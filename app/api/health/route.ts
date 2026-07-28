import { NextResponse } from "next/server";

export async function GET() {
  const backendUrl = process.env.RAG_API_URL;

  if (!backendUrl) {
    return NextResponse.json({ status: "unconfigured" });
  }

  const start = Date.now();

  try {
    const res = await fetch(`${backendUrl}/health`, {
      cache: "no-store",
      signal: AbortSignal.timeout(15000), // Render free-tier cold starts can take a while
    });
    const latencyMs = Date.now() - start;

    if (!res.ok) {
      return NextResponse.json({ status: "offline", latencyMs });
    }
    return NextResponse.json({ status: "online", latencyMs });
  } catch {
    return NextResponse.json({ status: "offline", latencyMs: Date.now() - start });
  }
}