import { chunkText } from "@/helpers/ChunkText";
import { NextResponse } from "next/server";
import { PdfReader } from "pdfreader";
import { User } from "@/models/User";
import { use } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { gettokeninfo } from "@/helpers/gettokeninfo";


function parsePdf(buffer) {
  return new Promise((resolve, reject) => {
    let text = "";

    new PdfReader().parseBuffer(buffer, (err, item) => {
      if (err) return reject(err);

      if (!item) {
        resolve(text);
      } else if (item.text) {
        text += item.text + "";
      }
    });
  });
}

export async function POST(req) {
  try {
    //get the current user from oAuth Or with Tokken
    //check for oauth first..
    let userId = null;
    const session = await getServerSession(authOptions);
    if (session?.user?.id) {
      userId = session.user.id;
    }

    if (!userId) {
      userId = await gettokeninfo();
    }
    //still didn't got then
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }


    const formData = await req.formData();
    const file = formData.get("pdf");

    if (!file) {
      return NextResponse.json(
        { error: "No PDF uploaded" },
        { status: 400 }
      );
    }


    //for rate limiting
    const today = new Date().toDateString();
    const savedDate = user.pdfUploadDate
      ? new Date(user.pdfUploadDate).toDateString()
      : null;

    // new day → reset count
    if (savedDate !== today) {
      user.pdfUploadCount = 0;
      user.pdfUploadDate = new Date();
    }




    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 👉 extract text
    const text = await parsePdf(buffer);
    console.log(text);

    // // 👉 chunk it
    // const chunks = chunkText(text);

    const title = file.name.replace(".pdf", "");

    //if old user and he does not have pdfs schema 
    // if (!Array.isArray(user.pdfs)) {
    //   user.pdfs = [];
    // }
    console.log(typeof text, "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@22");
    const finalText = Array.isArray(text)
      ? text.join(" ")
      : String(text);

    // check if pdf already exists
    const existingPdf = user.pdfs.find(
      (pdf) => pdf.title.toLowerCase().trim() === title.toLowerCase().trim()
    );

    if (existingPdf) {
      return NextResponse.json({
        success: true,
        alreadyExists: true,
        title: existingPdf.title,
        text: existingPdf.text,
      });
    }

    // limit check
    if (user.pdfUploadCount >= 2) {
      return NextResponse.json(
        {
          error: "Daily PDF limit reached. Tokens are expensive 😅 Try again tomorrow."
        },
        { status: 429 }
      );
    }

    // save only if new
    user.pdfs.push({
      pdfId: crypto.randomUUID(),
      title: title,
      text: finalText,
    });

    //Update the rate limit of pdf uploads
    user.pdfUploadCount += 1;
    user.pdfUploadDate = new Date();

    // saving user

    await user.save();

    return NextResponse.json({
      success: true,
      alreadyExists: false,
      title: title,
      text: text,
    });

  } catch (err) {
    console.log(err);

    return NextResponse.json(
      { error: "PDF parsing failed" },
      { status: 500 }
    );
  }
}