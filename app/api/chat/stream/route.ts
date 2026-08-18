import { NextRequest } from "next/server";

export const maxDuration = 60;

const RAG_API_URL = process.env.RAG_API_URL;

type ChatMessage = { role: "user" | "assistant"; content: string };

function sseError(message: string) {
  return new Response(
    `data: ${JSON.stringify({ error: message })}\n\ndata: [DONE]\n\n`,
    { headers: { "Content-Type": "text/event-stream" } }
  );
}

export async function POST(req: NextRequest) {
  if (!RAG_API_URL) {
    return sseError("The assistant backend isn't configured yet.");
  }

  let body: { message?: string; history?: ChatMessage[] };
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid request body", { status: 400 });
  }

  if (!body.message || typeof body.message !== "string") {
    return new Response("Missing 'message'", { status: 400 });
  }

  try {
    const upstream = await fetch(`${RAG_API_URL}/chat/stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: body.message,
        history: body.history ?? [],
      }),
    });

    if (!upstream.body) {
      return sseError("No stream received from the assistant backend.");
    }

    return new Response(upstream.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch {
    return sseError(
      "Couldn't reach the assistant backend - it may be waking up from idle."
    );
  }
}