import { chunkText } from "@/helpers/ChunkText";
import { NextResponse } from "next/server";
import { PdfReader } from "pdfreader";

function parsePdf(buffer) {
  return new Promise((resolve, reject) => {
    let text = "";

    new PdfReader().parseBuffer(buffer, (err, item) => {
      if (err) return reject(err);

      if (!item) {
        resolve(text);
      } else if (item.text) {
        text += item.text + " ";
      }
    });
  });
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("pdf");

    if (!file) {
      return NextResponse.json(
        { error: "No PDF uploaded" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 👉 extract text
    const text = await parsePdf(buffer);

    // 👉 chunk it
    const chunks = chunkText(text); 

    return NextResponse.json({
      success: true,
      title: file.name.replace(".pdf", ""),
      text,
      chunks
    });

  } catch (err) {
    console.log(err);

    return NextResponse.json(
      { error: "PDF parsing failed" },
      { status: 500 }
    );
  }
}