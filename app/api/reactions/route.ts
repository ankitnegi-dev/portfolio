import { NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";
import { getRateLimiter, getClientIp } from "@/lib/rate-limit";

const LABELS = ["impressive", "curious", "collab", "browsing"] as const;
type Label = (typeof LABELS)[number];

type TracePoint = { x: number; y: number; label: Label; ts: number };

async function buildAggregate(redis: NonNullable<ReturnType<typeof getRedis>>) {
  const counts: Record<Label, number> =
    (await redis.hgetall<Record<Label, number>>("reactions:counts")) ??
    ({} as Record<Label, number>);
  const total = LABELS.reduce((sum, l) => sum + (Number(counts[l]) || 0), 0);

  const today = new Date().toISOString().slice(0, 10);
  const todayCount = (await redis.get<number>(`reactions:day:${today}`)) ?? 0;

  const rawTrace = await redis.lrange<string>("reactions:trace", 0, 149);
  const trace: TracePoint[] = rawTrace
    .map((entry) => {
      try {
        return JSON.parse(entry) as TracePoint;
      } catch {
        return null;
      }
    })
    .filter((p): p is TracePoint => p !== null);

  return {
    counts: Object.fromEntries(LABELS.map((l) => [l, Number(counts[l]) || 0])),
    total,
    today: Number(todayCount) || 0,
    trace,
  };
}

function geoFromHeaders(req: Request): string {
  const city = req.headers.get("x-vercel-ip-city");
  const region = req.headers.get("x-vercel-ip-country-region");
  const country = req.headers.get("x-vercel-ip-country");

  const parts = [city, region, country]
    .filter((v): v is string => v !== null)
    .map(decodeURIComponent);

  return parts.length > 0 ? parts.join(", ") : "location unavailable";
}

async function notifyDiscord(point: TracePoint, location: string) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) return;

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content:
          `🤝 Someone on the portfolio just clicked **"want to build together"**\n` +
          `📍 ${location}\n` +
          `🕒 ${new Date(point.ts).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`,
        allowed_mentions: { parse: [] },
      }),
    });
  } catch {
    // notification failure shouldn't break the actual reaction flow
  }
}

export async function GET() {
  const redis = getRedis();
  if (!redis) {
    return NextResponse.json({
      counts: Object.fromEntries(LABELS.map((l) => [l, 0])),
      total: 0,
      today: 0,
      trace: [],
    });
  }

  const data = await buildAggregate(redis);
  return NextResponse.json(data);
}

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
  const label = body?.label as string | undefined;

  if (!label || !LABELS.includes(label as Label)) {
    return NextResponse.json({ error: "invalid label" }, { status: 400 });
  }

  // scatter into the open band above the prompt, well clear of the
  // buttons/text - generated server-side so it's not tied to click position
  const x = Math.random() * 90 + 5; // 5–95%
  const y = Math.random() * 25 + 6; // 6–31%

  const today = new Date().toISOString().slice(0, 10);
  const point: TracePoint = { x, y, label: label as Label, ts: Date.now() };

  await Promise.all([
    redis.hincrby("reactions:counts", label, 1),
    redis.incr(`reactions:day:${today}`),
    redis.expire(`reactions:day:${today}`, 60 * 60 * 48),
    redis.lpush("reactions:trace", JSON.stringify(point)),
    redis.ltrim("reactions:trace", 0, 149),
  ]);

  if (label === "collab") {
    await notifyDiscord(point, geoFromHeaders(req));
  }

  const data = await buildAggregate(redis);
  return NextResponse.json(data);
}