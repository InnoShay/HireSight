// Force Node.js runtime
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import * as tf from "@tensorflow/tfjs";
import { NextResponse } from "next/server";
import { db } from "../../../firebase/config";
import { collection, getDocs } from "firebase/firestore";
import * as use from "@tensorflow-models/universal-sentence-encoder";
import cosineSimilarity from "cosine-similarity";

export const POST = async (req) => {
  try {
    const body = await req.json();
    const jobDesc = body.jobDescription || "";

    if (!jobDesc.trim()) {
      return NextResponse.json(
        { error: "Job description missing" },
        { status: 400 }
      );
    }

    // Load TensorFlow model
    const model = await use.load();

    // Embed job description
    const jobEmbedTensor = await model.embed([jobDesc]);
    const jobEmbedding = (await jobEmbedTensor.array())[0];

    // Fetch all resumes
    const querySnapshot = await getDocs(collection(db, "resumes"));
    const resumes = querySnapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    const scored = [];

    // Compute similarity for each resume
    for (const r of resumes) {
      const text = r.rawText || "";

      const resumeTensor = await model.embed([text]);
      const embedding = (await resumeTensor.array())[0];

      const score = cosineSimilarity(jobEmbedding, embedding);

      scored.push({
        filename: r.filename,
        rawText: text.substring(0, 200) + "...",
        score: +score.toFixed(4),
      });
    }

    scored.sort((a, b) => b.score - a.score);

    return NextResponse.json({ ranked: scored });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};
