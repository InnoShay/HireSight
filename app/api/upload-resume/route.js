import { NextResponse } from "next/server";
import PDFParser from "pdf2json";

// In-memory store for parsed resumes (shared across API routes via module cache)
// In production, use a database or Redis
if (!global.resumeStore) {
  global.resumeStore = new Map();
}

export const POST = async (req) => {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const pdfParser = new PDFParser();

    const extractedText = await new Promise((resolve, reject) => {
      pdfParser.on("pdfParser_dataError", (err) => reject(err.parserError));
      pdfParser.on("pdfParser_dataReady", (data) => {
        let text = "";
        data.Pages.forEach((page) => {
          page.Texts.forEach((t) => {
            let raw = t.R[0].T || "";
            try {
              raw = decodeURIComponent(raw);
            } catch {
              raw = raw.replace(/%/g, " ");
            }
            text += raw + " ";
          });
        });
        resolve(text.trim());
      });

      pdfParser.parseBuffer(buffer);
    });

    // Generate a unique ID and store in memory
    const id = `resume_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    global.resumeStore.set(id, {
      filename: file.name,
      rawText: extractedText,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ message: "Resume parsed & stored!", id, filename: file.name });
  } catch (error) {
    console.error("UPLOAD FAIL:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
