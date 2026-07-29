import { NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";

const LABELS = ["impressive", "curious", "collab", "browsing"] as const;
type Label = (typeof LABELS)[number];

type TracePoint = { x: number; y: number; label: Label; ts: number };

async function notifyDiscord(point: TracePoint) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) return;

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: `🤝 Someone on the portfolio just clicked **"want to build together"** — ${new Date(
          point.ts
        ).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`,
      }),
    });
  } catch {
    // notification failure shouldn't break the actual reaction flow
  }
}

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

  const body = await req.json().catch(() => null);
  const label = body?.label as string | undefined;
  const x = typeof body?.x === "number" ? body.x : Math.random() * 100;
  const y = typeof body?.y === "number" ? body.y : Math.random() * 100;

  if (!label || !LABELS.includes(label as Label)) {
    return NextResponse.json({ error: "invalid label" }, { status: 400 });
  }

  const today = new Date().toISOString().slice(0, 10);
  const point: TracePoint = { x, y, label: label as Label, ts: Date.now() };

  await Promise.all([
    redis.hincrby("reactions:counts", label, 1),
    redis.incr(`reactions:day:${today}`),
    redis.expire(`reactions:day:${today}`, 60 * 60 * 48), // 48h TTL, auto-cleans old daily keys
    redis.lpush("reactions:trace", JSON.stringify(point)),
    redis.ltrim("reactions:trace", 0, 149), // keep only the most recent 150 points
  ]);

  await Promise.all([
    redis.hincrby("reactions:counts", label, 1),
    redis.incr(`reactions:day:${today}`),
    redis.expire(`reactions:day:${today}`, 60 * 60 * 48),
    redis.lpush("reactions:trace", JSON.stringify(point)),
    redis.ltrim("reactions:trace", 0, 149),
  ]);

  if (label === "collab") {
    await notifyDiscord(point);
  }

  const data = await buildAggregate(redis);
  return NextResponse.json(data);
}