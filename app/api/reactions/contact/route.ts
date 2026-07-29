import { NextResponse } from "next/server";
import { getRateLimiter, getClientIp } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
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
  const contact =
    typeof body?.contact === "string" ? body.contact.trim().slice(0, 200) : "";

  if (!contact) {
    return NextResponse.json({ ok: true });
  }

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: `📇 Follow-up contact from a "want to build together" click: **${contact}**`,
        allowed_mentions: { parse: [] }, // prevents @everyone / @here / user-mention abuse
      }),
    });
  } catch {
    // ignore - best effort
  }

  return NextResponse.json({ ok: true });
}