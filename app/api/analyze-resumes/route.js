// Force Node.js runtime
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import * as tf from "@tensorflow/tfjs";
import { NextResponse } from "next/server";
import { db } from "../../../firebase/config";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import * as use from "@tensorflow-models/universal-sentence-encoder";
import cosineSimilarity from "cosine-similarity";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

// Simple hash for duplicate detection
const generateHash = (text) => {
  let hash = 0, i, chr;
  if (text.length === 0) return hash;
  for (i = 0; i < text.length; i++) {
    chr = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash.toString();
};

export const POST = async (req) => {
  try {
    const body = await req.json();
    const jobDesc = body.jobDescription || "";
    const resumeIds = body.resumeIds || [];

    if (!jobDesc.trim()) {
      return NextResponse.json(
        { error: "Job description missing" },
        { status: 400 }
      );
    }

    // 1. Fetch Data
    console.log("Analyzing Job:", jobDesc.substring(0, 50));
    console.log("Resume IDs received:", resumeIds);

    let resumes = [];
    if (resumeIds.length > 0) {
      const resumeDocs = await Promise.all(
        resumeIds.map((id) => getDoc(doc(db, "resumes", id)))
      );
      resumes = resumeDocs
        .filter((d) => {
          if (!d.exists()) console.warn(`Resume ID not found in DB: ${d.id}`);
          return d.exists();
        })
        .map((d) => ({ id: d.id, ...d.data() }));
    } else {
      console.log("No IDs provided, fetching all resumes...");
      const querySnapshot = await getDocs(collection(db, "resumes"));
      resumes = querySnapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
    }

    console.log(`Fetched ${resumes.length} resumes from DB.`);

    if (resumes.length === 0) {
      return NextResponse.json({ ranked: [] });
    }

    // 2. Duplicate Detection
    const seenHashes = new Set();
    const duplicates = new Set();

    resumes.forEach(r => {
      const h = generateHash(r.rawText.trim());
      if (seenHashes.has(h)) {
        duplicates.add(r.id);
      }
      seenHashes.add(h);
      r.isDuplicate = duplicates.has(r.id);
    });

    // 3. TensorFlow Semantic Scoring (Base Layer)
    const model = await use.load();
    const jobEmbedTensor = await model.embed([jobDesc]);
    const jobEmbedding = (await jobEmbedTensor.array())[0];

    const semanticScores = [];
    for (const r of resumes) {
      const text = r.rawText || "";
      const resumeTensor = await model.embed([text]);
      const embedding = (await resumeTensor.array())[0];
      const score = cosineSimilarity(jobEmbedding, embedding);

      semanticScores.push({
        id: r.id,
        score: +score.toFixed(4)
      });
    }

    // 4. Gemini AI Deep Analysis
    // We construct a structured prompt to get JSON back
    // DIRECT API CALL to support custom/new models like gemini-2.5-flash
    let aiData = { jd_analysis: {}, candidates: [] };

    try {
      const promptText = `
          You are an expert AI Recruiter. 
          JOB DESCRIPTION:
          "${jobDesc.substring(0, 3000)}"

          RESUMES:
          ${resumes.map((r, i) => `Resume ${i + 1} (ID: ${r.id}): "${r.rawText.substring(0, 1500)}"`).join("\n\n")}

          TASK:
          Analyze these resumes against the JD. Return a JSON object with this EXACT structure (no markdown formatting, just raw JSON):
          {
            "jd_analysis": {
              "must_have_skills": ["skill1", "skill2"],
              "good_to_have_skills": ["skill3", "skill4"],
              "soft_skills": ["skill5"],
              "experience_required_years": number or null
            },
            "candidates": [
              {
                "id": "ID_FROM_INPUT",
                "experience_years": number,
                "matched_keywords": ["kw1", "kw2"],
                "missing_keywords": ["kw3", "kw4"],
                "why_high_score": "reason...",
                "improvement_area": "improvement...",
                "summary": "one line summary"
              }
            ]
          }
        `;

      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      // Using v1beta and gemini-2.5-flash as explicitly requested by user
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

      console.log("Calling Gemini 2.5 Flash via direct REST...");

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: promptText }]
          }]
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Gemini REST API Error: ${response.status} ${response.statusText} - ${errText}`);
      }

      const data = await response.json();
      const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

      // Clean and parse JSON
      const cleanJson = responseText.replace(/```json|```/g, "").trim();
      aiData = JSON.parse(cleanJson);

    } catch (aiError) {
      console.error("GEMINI API FAILED (Falling back):", aiError.message);
      // Fallback: Dummy data to prevent UI crash
      aiData.jd_analysis = {
        must_have_skills: ["AI Analysis Failed"],
        good_to_have_skills: ["Check Logs"]
      };
    }


    // 5. Merge Results
    const finalResults = resumes.map(r => {
      const sem = semanticScores.find(s => s.id === r.id);
      const ai = aiData.candidates?.find(c => c.id === r.id) || {};

      // Bonus for experience match
      let experienceBonus = 0;
      const jdExp = aiData.jd_analysis?.experience_required_years || 0;
      const candExp = ai.experience_years || 0;
      if (jdExp > 0 && candExp >= jdExp) experienceBonus = 0.1;

      const finalScore = Math.min((sem.score || 0) + experienceBonus, 1.0);

      return {
        ...r,
        score: +finalScore.toFixed(2),
        semanticScore: sem.score,
        isDuplicate: r.isDuplicate,
        aiAnalysis: {
          matchedKeywords: ai.matched_keywords || [],
          missingKeywords: ai.missing_keywords || [],
          experienceYears: ai.experience_years || "?",
          whyHigh: ai.why_high_score || "AI insights unavailable due to API error.",
          improvement: ai.improvement_area || "Please review manually.",
          summary: ai.summary || "Basic semantic match only."
        }
      };
    });

    // Sort by score
    finalResults.sort((a, b) => b.score - a.score);

    return NextResponse.json({
      ranked: finalResults,
      jdAnalysis: aiData.jd_analysis
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};
