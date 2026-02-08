import { NextResponse } from "next/server";
import { User } from "@/models/User";
import { connect } from "@/dbconfig/dbconfig";
import { gettokeninfo } from "@/helpers/gettokeninfo";
import { OpenRouter } from '@openrouter/sdk';
import generateUniqueTitle from "@/helpers/generateUniqueTitle"
import { use } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

connect();

/* ===================== POST ===================== */
export async function POST(req) {
  try {
    let body = await req.json();
    let { chats, chatId, title } = body;
    // console.log(chats);

    //check for oauth first..
    let userId = null;
    const session = await getServerSession(authOptions);
    if (session?.user?.id) {
      userId = session.user.id;
    }

    if (!userId) {
      userId = await gettokeninfo();
    }
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

    const lastUserMsg = chats[chats.length - 1];

    //If title already exists, reuse it
    const existingTitles = new Set(user.Messages.map(m => m.title));
    const finalTitle = existingTitles.has(title)
      ? title
      : generateUniqueTitle(title, existingTitles);

    user.Messages.push({
      userId: user._id,
      chatId,
      title: finalTitle,
      role: "user",
      content: lastUserMsg.content,
    });

    await user.save();

    const openrouter = new OpenRouter({
      apiKey: process.env.LLAMA_API_KEY
    });

    // Stream the response to get reasoning tokens in usage
    const stream = await openrouter.chat.send({
      model: "openai/gpt-4o-mini",
      messages: [

        {
          role: "system",
          content: `
You are a highly intelligent, empathetic, and proactive AI assistant. Your goal is to provide expert-level clarity while maintaining a friendly, modern vibe.

CORE PERSONALITY:
- Be insightful, not just robotic. 
- Validate the user's intent and offer deeper value.
- Be proactive: If a user's request is vague, ask smart follow-up questions to provide a better result.

INTERACTION RULES:
- ALWAYS end your response with a brief, helpful follow-up question or a "next step" suggestion to keep the conversation going.
- If the user asks for something complex, break it down into logical steps.
- Use a tone that matches the user: witty for casual chats, professional for technical tasks.

IMPORTANT FORMATTING:
- Respond ONLY in valid HTML.
- Do NOT use Markdown.
- Allowed tags ONLY: h1, h2, p, ul, ol, li, strong, code, pre, br.
- No html/head/body/script tags.

STYLE & READABILITY (MANDATORY):
- Use <h1> for the main title and <h2> for sections.
- Add <br> AFTER every <h1> and <h2>.
- Use <ul>/<li> for any list of 2+ items.
- Keep paragraphs to 1-2 lines maximum. 
- Use <br> between all major sections and back-to-back paragraphs.
- Use <strong> for key concepts and <code> for technical terms.
- Use relevant emojis (✅ 🚀 💡 ⚠️ 😄) to add personality.

EXAMPLE OF AN ENHANCED RESPONSE:
<h1>Understanding React Hooks ⚛️</h1>
<br>
<p><strong>Hooks</strong> allow you to use state and other features without writing a class.</p>
<br>
<h2>Commonly Used Hooks ✅</h2>
<br>
<ul>
  <li><code>useState</code>: Manages local data.</li>
  <li><code>useEffect</code>: Handles side effects like API calls.</li>
  <li><code>useContext</code>: Manages global themes or user data.</li>
</ul>
<br>
<p>Would you like to see a code example of <strong>useState</strong>, or should we move on to how <strong>useEffect</strong> works?</p>
`
        },
        ...chats
      ],
      stream: true
    });


    let response = "";
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        response += content;
        // process.stdout.write(content);
      }

      // Usage information comes in the final chunk
      if (chunk.usage) {
        // console.log("\nReasoning tokens:", chunk.usage.reasoningTokens);
      }
    }

    /* ---------- Save Ai message ---------- */
    user.Messages.push({
      userId: user._id,
      chatId,                //same chat
      title: finalTitle,
      role: "assistant",
      content: response,
    });

    await user.save();


    return NextResponse.json({ message: response, title: finalTitle }, { status: 201 })
  }
  catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
export async function GET(req) {
  try {
    //check for oauth first..
    let userId = null;
    const session = await getServerSession(authOptions);
    if (session?.user?.id) {
      userId = session.user.id;
    }

    if (!userId) {
      userId = await gettokeninfo();
    }
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const titles = [
      ...new Set(user.Messages.map(m => m.title))  //to avoid duplicates
    ];

    return NextResponse.json(
      { messages: user.Messages, titles },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    let body = await req.json();
    let { title } = body;


    //check for oauth first..
    let userId = null;
    const session = await getServerSession(authOptions);
    if (session?.user?.id) {
      userId = session.user.id;
    }

    if (!userId) {
      userId = await gettokeninfo();
    }
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    user.Messages = user.Messages.filter(msg => msg.title !== title);
    await user.save();

    return NextResponse.json(
      { messages: "Chat Deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Server Error" },
      { status: 500 }
    );
  }
}
