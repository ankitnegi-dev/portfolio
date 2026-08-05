import { NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";
import { getRateLimiter, getClientIp } from "@/lib/rate-limit";

type ContactSubmission = { contact: string; ts: number };

export async function POST(req: Request) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  const redis = getRedis();

  const ratelimiter = getRateLimiter();
  if (ratelimiter) {
    const ip = getClientIp(req);
    const { success } = await ratelimiter.limit(ip);
    if (!success) {
      return NextResponse.json({ error: "too many requests" }, { status: 429 });
    }
  }

  const body = await req.json().catch(() => null);
  const contact =
    typeof body?.contact === "string" ? body.contact.trim().slice(0, 200) : "";

  if (!contact) {
    return NextResponse.json({ ok: true });
  }

  const submission: ContactSubmission = { contact, ts: Date.now() };

  if (redis) {
    try {
      await redis.lpush("reactions:contacts", submission);
      await redis.ltrim("reactions:contacts", 0, 99);
    } catch (err) {
      console.error("contact storage failed:", err);
    }
  }

  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: `📇 Follow-up contact from a "want to build together" click: **${contact}**`,
          allowed_mentions: { parse: [] },
        }),
      });
    } catch {
      // ignore - best effort
    }
  }

  return NextResponse.json({ ok: true });
}