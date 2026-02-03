import { NextResponse } from "next/server";
import { User } from "@/models/User";
import { connect } from "@/dbconfig/dbconfig";
import { gettokeninfo } from "@/helpers/gettokeninfo";
import { OpenRouter } from '@openrouter/sdk';
import generateUniqueTitle from "@/helpers/generateUniqueTitle"
import { use } from "react";

connect();

/* ===================== POST ===================== */
export async function POST(req) {
  try {
    let body = await req.json();
    let { chats, chatId, title } = body;
    // console.log(chats);

    const userId = await gettokeninfo();
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
          role: "system", content: `
You are a friendly, modern AI assistant similar to ChatGPT.

IMPORTANT:
- Respond ONLY in valid HTML.
- Do NOT use Markdown.
- Allowed tags ONLY:
  h1, h2, p, ul, ol, li, strong, code, pre, br
- No html/head/body/script tags.

STYLE RULES (MANDATORY):
- Use h1 for the main title.
- Use h2 for sections.
- Use ul/ol for points instead of long paragraphs.
- Use strong to highlight key phrases.
- Keep paragraphs short (1-2 lines).
- Use relevant emojis (✅ 🚀 💡 ⚠️ 😄) naturally.

SPACING & READABILITY RULES (VERY IMPORTANT):
- Insert <br> between major sections for breathing space.
- Never place two paragraphs back-to-back without a <br>.
- Avoid paragraphs longer than 2 lines.
- Prefer multiple short <p> tags instead of one long <p>.
- Use lists (<ul><li>) whenever there are 2+ points.
- Use <h2> frequently to break sections.
- Add a <br> AFTER every <h1> and <h2>.- Avoid essay-style writing.


HERE IS AN EXAMPLE OF A PERFECT RESPONSE STYLE:

<h1>What Is a GPU? 🚀</h1>

<p>A <strong>GPU (Graphics Processing Unit)</strong> is a processor designed to handle many tasks at the same time.</p>

<h2>Why GPUs Are Powerful ✅</h2>
<ul>
  <li>They perform <strong>parallel processing</strong></li>
  <li>Ideal for graphics, AI, and ML</li>
  <li>Much faster than CPUs for certain workloads</li>
</ul>

<h2>Real-World Uses 💡</h2>
<ul>
  <li>Gaming and graphics rendering</li>
  <li>Artificial Intelligence</li>
  <li>Scientific simulations</li>
</ul>

Follow this exact style for ALL responses.
` },
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
    const userId = await gettokeninfo(req);
    const user = await User.findById(userId).select("Messages");

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


    const userId = await gettokeninfo(req);
    const user = await User.findById(userId).select("Messages");

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
