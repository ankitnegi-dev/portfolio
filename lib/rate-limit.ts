import { Ratelimit } from "@upstash/ratelimit";
import { getRedis } from "@/lib/redis";

// 5 requests per 10 minutes, per IP - generous for a real visitor,
// too slow to be useful for spam
let limiter: Ratelimit | null = null;

export function getRateLimiter(): Ratelimit | null {
  const redis = getRedis();
  if (!redis) return null;

  if (!limiter) {
    limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "10 m"),
      prefix: "ratelimit:reactions",
    });
  }
  return limiter;
}

export function getClientIp(req: Request): string {
  // Vercel sets this automatically on every request
  const forwarded = req.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() ?? "unknown";
}