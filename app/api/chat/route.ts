import { NextRequest, NextResponse } from "next/server";

const RAG_API_URL = process.env.RAG_API_URL;

type ChatMessage = { role: "user" | "assistant"; content: string };

export async function POST(req: NextRequest) {
  if (!RAG_API_URL) {
    return NextResponse.json(
      {
        reply:
          "The assistant backend isn't configured yet. Set RAG_API_URL in the environment to connect it.",
      },
      { status: 200 }
    );
  }

  let body: { message?: string; history?: ChatMessage[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!body.message || typeof body.message !== "string") {
    return NextResponse.json({ error: "Missing 'message'" }, { status: 400 });
  }

  try {
    const upstream = await fetch(`${RAG_API_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: body.message,
        history: body.history ?? [],
      }),
      // Render free tier can cold-start slowly — give it real time.
      signal: AbortSignal.timeout(45_000),
    });

    if (!upstream.ok) {
      const detail = await upstream.text().catch(() => "");
      return NextResponse.json(
        { reply: "The assistant hit an error. Try again in a moment.", detail },
        { status: 200 }
      );
    }

    const data = await upstream.json();
    return NextResponse.json({ reply: data.reply as string });
  } catch {
    return NextResponse.json(
      {
        reply:
          "Couldn't reach the assistant backend — it may be waking up from idle. Try again in a few seconds.",
      },
      { status: 200 }
    );
  }
}