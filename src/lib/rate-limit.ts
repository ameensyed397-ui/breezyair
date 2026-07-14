/**
 * Lightweight in-memory IP rate limiter for public API routes.
 *
 * Blunts casual abuse/spam. On Fluid Compute instances are reused, so the window
 * survives across requests within an instance; it is NOT globally consistent
 * across regions/instances. For hard guarantees at scale, front with Vercel BotID
 * or an Upstash-backed limiter.
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

export interface RateLimitResult {
  ok: boolean;
  retryAfter: number; // seconds until the window resets
}

/** Allow `limit` requests per `windowMs` per key. */
export function rateLimit(key: string, limit = 6, windowMs = 60_000): RateLimitResult {
  const now = Date.now();

  // Opportunistic prune so the map can't grow unbounded.
  if (buckets.size > 5000) {
    for (const [k, b] of buckets) if (now > b.resetAt) buckets.delete(k);
  }

  const bucket = buckets.get(key);
  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfter: 0 };
  }

  if (bucket.count >= limit) {
    return { ok: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) };
  }

  bucket.count += 1;
  return { ok: true, retryAfter: 0 };
}

/** Best-effort client IP from proxy headers. */
export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip")?.trim() || "unknown";
}
