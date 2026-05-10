import { NextResponse } from "next/server";
import pdf from "pdf-parse-new";

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

    // Convert uploaded file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Parse PDF
    const parsedPdf = await pdf(buffer);

    // Console log extracted text
    console.log(parsedPdf.text);
    const text = parsedPdf.text;
    console.log(parsedPdf.info.Title,"@@@@@@@");

    // Requesting My pdf data into chunks from helper method
    const chunk=chunkText(text);

    return NextResponse.json({
      success: true,
      text: parsedPdf.text,
      title:parsedPdf.info.Title
    });

  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Failed to parse PDF" },
      { status: 500 }
    );
  }
}