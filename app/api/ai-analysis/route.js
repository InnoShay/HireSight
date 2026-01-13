// Force Node.js runtime
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getNextApiKey } from "../../../lib/apiKeyManager";

export const POST = async (req) => {
    try {
        const body = await req.json();
        const { jobDescription, candidates } = body;

        if (!jobDescription || !candidates || candidates.length === 0) {
            return NextResponse.json(
                { error: "Missing job description or candidates" },
                { status: 400 }
            );
        }

        console.log(`[AI Analysis] Processing ${candidates.length} candidates...`);

        // Call Gemini for AI analysis
        const apiKey = getNextApiKey();
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

        const promptText = `
      You are an expert AI Recruiter. 
      JOB DESCRIPTION:
      "${jobDescription.substring(0, 3000)}"

      RESUMES:
      ${candidates.map((c, i) => `Resume ${i + 1} (ID: ${c.id}): "${c.rawText?.substring(0, 1500) || 'No text available'}"`).join("\n\n")}

      TASK:
      Analyze these resumes against the JD. Return a JSON object with this EXACT structure (no markdown formatting, just raw JSON):
      {
        "jd_analysis": {
          "must_have_skills": ["skill1", "skill2"],
          "good_to_have_skills": ["skill3", "skill4"],
          "soft_skills": ["skill5"],
          "experience_required_years": number or null,
          "job_title": "inferred job title"
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

        console.log("[AI Analysis] Calling Gemini API...");

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
            throw new Error(`Gemini API Error: ${response.status} ${response.statusText} - ${errText}`);
        }

        const data = await response.json();
        const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

        // Clean and parse JSON
        const cleanJson = responseText.replace(/```json|```/g, "").trim();
        const aiData = JSON.parse(cleanJson);

        console.log(`[AI Analysis] Successfully analyzed ${aiData.candidates?.length || 0} candidates`);

        // Merge AI analysis with candidate IDs
        const analysisMap = {};
        aiData.candidates?.forEach(c => {
            analysisMap[c.id] = {
                matchedKeywords: c.matched_keywords || [],
                missingKeywords: c.missing_keywords || [],
                experienceYears: c.experience_years || "?",
                whyHigh: c.why_high_score || "Analysis complete.",
                improvement: c.improvement_area || "No specific improvements noted.",
                summary: c.summary || "Resume analyzed."
            };
        });

        return NextResponse.json({
            success: true,
            jdAnalysis: aiData.jd_analysis || {},
            candidateAnalysis: analysisMap
        });

    } catch (err) {
        console.error("[AI Analysis] Error:", err);

        // Return partial success with fallback
        return NextResponse.json({
            success: false,
            error: err.message,
            jdAnalysis: {
                must_have_skills: ["Analysis temporarily unavailable"],
                good_to_have_skills: [],
                job_title: "Position"
            },
            candidateAnalysis: {}
        });
    }
};
