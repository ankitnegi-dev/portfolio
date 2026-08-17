import { NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";
import { getRateLimiter, getClientIp } from "@/lib/rate-limit";

const LABELS = ["impressive", "curious", "collab", "browsing"] as const;
type Label = (typeof LABELS)[number];

type TracePoint = { x: number; y: number; label: Label; ts: number };
type DayCount = { date: string; count: number };

async function getWeeklyTrend(
  redis: NonNullable<ReturnType<typeof getRedis>>
): Promise<DayCount[]> {
  const days: DayCount[] = [];
  const now = new Date();

  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const count = (await redis.get<number>(`reactions:day:${key}`)) ?? 0;
    days.push({ date: key, count: Number(count) || 0 });
  }

  return days;
}

async function buildAggregate(redis: NonNullable<ReturnType<typeof getRedis>>) {
  const counts: Record<Label, number> =
    (await redis.hgetall<Record<Label, number>>("reactions:counts")) ??
    ({} as Record<Label, number>);
  const total = LABELS.reduce((sum, l) => sum + (Number(counts[l]) || 0), 0);

  const today = new Date().toISOString().slice(0, 10);
  const todayCount = (await redis.get<number>(`reactions:day:${today}`)) ?? 0;

  const trace = await redis.lrange<TracePoint>("reactions:trace", 0, 149);
  const trend = await getWeeklyTrend(redis);

  return {
    counts: Object.fromEntries(LABELS.map((l) => [l, Number(counts[l]) || 0])),
    total,
    today: Number(todayCount) || 0,
    trace,
    trend,
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
      trend: [],
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

  const x = Math.random() * 90 + 5;
  const y = Math.random() * 25 + 6;

  const today = new Date().toISOString().slice(0, 10);
  const point: TracePoint = { x, y, label: label as Label, ts: Date.now() };

  try {
    await redis.lpush("reactions:trace", point);
    await redis.ltrim("reactions:trace", 0, 149);
  } catch (err) {
    console.error("trace write failed:", err);
  }

  await Promise.all([
    redis.hincrby("reactions:counts", label, 1),
    redis.incr(`reactions:day:${today}`),
    redis.expire(`reactions:day:${today}`, 60 * 60 * 24 * 8), // 8 days, was 48h
  ]);

  if (label === "collab") {
    await notifyDiscord(point, geoFromHeaders(req));
  }

  const data = await buildAggregate(redis);
  return NextResponse.json(data);
}