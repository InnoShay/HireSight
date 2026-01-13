// Force Node.js runtime
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import * as tf from "@tensorflow/tfjs";
import { NextResponse } from "next/server";
import { db } from "../../../firebase/config";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import * as use from "@tensorflow-models/universal-sentence-encoder";
import cosineSimilarity from "cosine-similarity";

// Simple hash for duplicate detection
const generateHash = (text) => {
    let hash = 0, i, chr;
    if (text.length === 0) return hash;
    for (i = 0; i < text.length; i++) {
        chr = text.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0;
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
        console.log("[Quick Rank] Analyzing Job:", jobDesc.substring(0, 50));
        console.log("[Quick Rank] Resume IDs received:", resumeIds);

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
            console.log("[Quick Rank] No IDs provided, fetching all resumes...");
            const querySnapshot = await getDocs(collection(db, "resumes"));
            resumes = querySnapshot.docs.map((d) => ({
                id: d.id,
                ...d.data(),
            }));
        }

        console.log(`[Quick Rank] Fetched ${resumes.length} resumes from DB.`);

        if (resumes.length === 0) {
            return NextResponse.json({ ranked: [], jobDescription: jobDesc });
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

        // 3. TensorFlow Semantic Scoring (Fast!)
        console.log("[Quick Rank] Loading TensorFlow model...");
        const model = await use.load();
        const jobEmbedTensor = await model.embed([jobDesc]);
        const jobEmbedding = (await jobEmbedTensor.array())[0];

        console.log("[Quick Rank] Computing semantic scores...");
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

        // 4. Build Quick Results (No AI Analysis Yet)
        const quickResults = resumes.map(r => {
            const sem = semanticScores.find(s => s.id === r.id);
            return {
                id: r.id,
                filename: r.fileName || "Unknown",
                score: sem?.score || 0,
                isDuplicate: r.isDuplicate,
                rawText: r.rawText?.substring(0, 2000) || "", // Send partial for AI analysis later
                aiAnalysis: null, // Will be filled by progressive loading
                aiLoading: true   // Flag for UI to show skeleton
            };
        });

        quickResults.sort((a, b) => b.score - a.score);

        console.log(`[Quick Rank] Returning ${quickResults.length} quickly scored candidates.`);

        return NextResponse.json({
            ranked: quickResults,
            jobDescription: jobDesc
        });

    } catch (err) {
        console.error("[Quick Rank] Error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
};
