import { NextResponse } from "next/server";
import { User } from "@/models/User";
import { connect } from "@/dbconfig/dbconfig";
import { gettokeninfo } from "@/helpers/gettokeninfo";

connect();

/* ===================== POST ===================== */
export async function POST(req) {
  try {
    const userId = await gettokeninfo(req);
    const { message, isNewChat, currentTitle } = await req.json(); // ✅

    if (!message) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let title;

    if (isNewChat || !currentTitle) {
      title =
        message.length > 10
          ? message.substring(0, 10) + "..."
          : message;
    } else {
      title = currentTitle; // ✅ FIX
    }

    const recentMessages = user.Messages
      .filter((m) => m.title === title)
      .slice(-20);

    const messagesForLLM = [
      { role: "system", content: "You are a helpful AI assistant." },
      ...recentMessages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
      { role: "user", content: message },
    ];

    const llamaRes = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.LLAMA_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "meta-llama/llama-3.1-8b-instruct",
          messages: messagesForLLM,
        }),
      }
    );

    const data = await llamaRes.json();
    const reply =
      data?.choices?.[0]?.message?.content || "Sorry, I couldn't respond.";

    user.Messages.push(
      { role: "user", content: message, userId, title },
      { role: "assistant", content: reply, userId, title }
    );

    await user.save();

    return NextResponse.json({ reply, title });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Chat failed" }, { status: 500 });
  }
}

/* ===================== GET ===================== */
export async function GET(req) {
  try {
    const userId = await gettokeninfo(req);

    const user = await User.findById(userId).select("Messages");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const chatMap = {};

    user.Messages.forEach((m) => {
      if (!chatMap[m.title]) chatMap[m.title] = [];
      chatMap[m.title].push({
        role: m.role,
        content: m.content,
      });
    });

    const chats = Object.keys(chatMap).map((title) => ({
      title,
      messages: chatMap[title],
    }));

    return NextResponse.json({ chats });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to load chats" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const userId = await gettokeninfo(req);
    const { title } = await req.json();

    if (!title) {
      return NextResponse.json(
        { error: "Title required" },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    user.Messages = user.Messages.filter(
      (m) => m.title !== title
    );

    await user.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Delete failed" },
      { status: 500 }
    );
  }
}
