import { NextResponse } from "next/server";
import { getNextApiKey } from "../../../lib/apiKeyManager";

export const POST = async (req) => {
    try {
        const { jobDescription } = await req.json();

        if (!jobDescription) {
            return NextResponse.json(
                { error: "Job description is missing" },
                { status: 400 }
            );
        }

        // Get next API key using round-robin from shared manager
        const apiKey = getNextApiKey();
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

        const prompt = `
      You are an expert HR Specialist. 
      Refine and structure the following Job Description (JD). 
      
      Tasks:
      1. Fix grammar and typos.
      2. Use clear headings (About, Responsibilities, Requirements, etc.).
      3. Use bullet points for lists.
      4. Make it look professional and readable.
      5. Do NOT change the core requirements or meaning.
      
      Original JD:
      "${jobDescription}"
      
      Output ONLY the refined JD text. Do not include markdown code blocks like \`\`\` or \`\`\`json. Just the clean text.
    `;

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [{ text: prompt }],
                    },
                ],
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Gemini API Error:", data);
            throw new Error(data.error?.message || "Gemini API request failed");
        }

        let refinedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

        // Cleanup any accidental markdown code blocks if the model ignores the instruction
        refinedText = refinedText.replace(/^```(markdown)?/i, "").replace(/```$/i, "").trim();

        return NextResponse.json({ refinedText });
    } catch (error) {
        console.error("JD Optimization Error:", error);
        return NextResponse.json(
            { error: "Failed to optimize JD" },
            { status: 500 }
        );
    }
};
