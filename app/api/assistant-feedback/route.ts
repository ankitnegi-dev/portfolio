import { NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";
import { getRateLimiter, getClientIp } from "@/lib/rate-limit";

type Feedback = {
  question: string;
  answer: string;
  vote: "up" | "down";
  ts: number;
};

export async function POST(req: Request) {
  const redis = getRedis();
  if (!redis) {
    return NextResponse.json({ error: "not configured" }, { status: 503 });
  }

  const ratelimiter = getRateLimiter();
  if (ratelimiter) {
    const ip = getClientIp(req);
    const { success } = await ratelimiter.limit(ip);
    if (!success) {
      return NextResponse.json({ error: "too many requests" }, { status: 429 });
    }
  }

  const body = await req.json().catch(() => null);
  const question = typeof body?.question === "string" ? body.question.slice(0, 300) : "";
  const answer = typeof body?.answer === "string" ? body.answer.slice(0, 500) : "";
  const vote = body?.vote === "up" || body?.vote === "down" ? body.vote : null;

  if (!vote) {
    return NextResponse.json({ error: "invalid vote" }, { status: 400 });
  }

  const entry: Feedback = { question, answer, vote, ts: Date.now() };

  try {
    await redis.lpush("assistant:feedback", entry);
    await redis.ltrim("assistant:feedback", 0, 199);
  } catch (err) {
    console.error("assistant feedback write failed:", err);
  }

  return NextResponse.json({ ok: true });
}