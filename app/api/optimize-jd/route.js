import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

export const POST = async (req) => {
    try {
        const { jobDescription } = await req.json();

        if (!jobDescription) {
            return NextResponse.json(
                { error: "Job description is missing" },
                { status: 400 }
            );
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

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
      
      Output ONLY the refined JD text.
    `;

        const result = await model.generateContent(prompt);
        const refinedText = result.response.text();

        return NextResponse.json({ refinedText });
    } catch (error) {
        console.error("JD Optimization Error:", error);
        return NextResponse.json(
            { error: "Failed to optimize JD" },
            { status: 500 }
        );
    }
};
