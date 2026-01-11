import { NextResponse } from "next/server";
import { db } from "../../../firebase/config";
import { collection, addDoc } from "firebase/firestore";
import PDFParser from "pdf2json";

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

    const docRef = await addDoc(collection(db, "resumes"), {
      filename: file.name,
      rawText: extractedText,
      createdAt: new Date(),
    });

    return NextResponse.json({ message: "Resume parsed & stored!", id: docRef.id, filename: file.name });
  } catch (error) {
    console.error("UPLOAD FAIL:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
