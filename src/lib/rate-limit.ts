/**
 * Fixed-window rate limiter with a durable backend when configured.
 *
 * Backends, in priority order:
 *   1. Vercel KV / Upstash Redis — used automatically when
 *      `KV_REST_API_URL` + `KV_REST_API_TOKEN` are set on the deployment.
 *      Durable + shared across every serverless instance, so the limit is
 *      actually enforced under real traffic.
 *   2. In-memory Map — fallback for local dev or any deployment without KV.
 *      Resets on cold start and isn't shared across lambda instances, so
 *      treat it as a speed-bump, not a guarantee. (This is why KV matters
 *      once you have real traffic.)
 *
 * Why raw REST instead of the @vercel/kv SDK:
 *   Keeps the dependency tree lean and lets the same code path work with
 *   either Vercel KV or a bare Upstash Redis instance — both expose the
 *   identical REST command API. No SDK, no extra bundle weight.
 *
 * Provision KV in one click: Vercel dashboard → Storage → KV → connect to
 * the project. Vercel injects KV_REST_API_URL + KV_REST_API_TOKEN
 * automatically; this module picks them up with zero code changes.
 */

const KV_URL = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;

export function rateLimitBackend(): "kv" | "memory" {
  return KV_URL && KV_TOKEN ? "kv" : "memory";
}

/* ─────────────────────────── In-memory fallback ─────────────────────────── */

const MEM = new Map<string, { count: number; resetAt: number }>();

function memHit(key: string, windowMs: number): number {
  const now = Date.now();
  const entry = MEM.get(key);
  if (!entry || entry.resetAt < now) {
    MEM.set(key, { count: 1, resetAt: now + windowMs });
    // Opportunistic cleanup so the Map can't grow unbounded on a
    // long-lived instance.
    if (MEM.size > 5000) {
      for (const [k, v] of MEM) if (v.resetAt < now) MEM.delete(k);
    }
    return 1;
  }
  entry.count += 1;
  return entry.count;
}

/* ─────────────────────────── KV backend ─────────────────────────── */

/**
 * Run a single Redis command against the KV REST API. Returns the
 * command result, or null if KV is unconfigured / errored (caller then
 * falls back to memory).
 */
async function kvCommand(args: (string | number)[]): Promise<unknown | null> {
  if (!KV_URL || !KV_TOKEN) return null;
  try {
    const res = await fetch(`${KV_URL}/${args.map((a) => encodeURIComponent(String(a))).join("/")}`, {
      headers: { authorization: `Bearer ${KV_TOKEN}` },
      // Rate-limit checks must never be cached.
      cache: "no-store",
      signal: AbortSignal.timeout(2000),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { result?: unknown };
    return data.result ?? null;
  } catch {
    return null;
  }
}

/**
 * Increment the counter for `key` and ensure it expires after the window.
 * Returns the post-increment count, or null on KV failure.
 */
async function kvHit(key: string, windowSec: number): Promise<number | null> {
  const n = await kvCommand(["incr", key]);
  if (typeof n !== "number") return null;
  // First hit in the window sets the TTL. Subsequent hits leave it alone
  // so the window is fixed from the first request, not sliding.
  if (n === 1) await kvCommand(["expire", key, windowSec]);
  return n;
}

/* ─────────────────────────── Public API ─────────────────────────── */

export interface RateLimitResult {
  /** True when the caller is OVER the limit and should be blocked. */
  limited: boolean;
  /** Current hit count in the window (best-effort). */
  count: number;
  /** Which backend answered. */
  backend: "kv" | "memory";
}

/**
 * Check + increment a rate-limit bucket.
 *
 * @param key       Unique bucket id, e.g. `lead:<ip>` or `audit:<ip>:<email>`.
 * @param max       Max requests allowed per window.
 * @param windowSec Window length in seconds.
 *
 * Usage:
 *   const { limited } = await rateLimit(`lead:${ip}`, 4, 3600);
 *   if (limited) return tooMany();
 */
export async function rateLimit(
  key: string,
  max: number,
  windowSec: number,
): Promise<RateLimitResult> {
  const namespaced = `rl:${key}`;

  if (KV_URL && KV_TOKEN) {
    const n = await kvHit(namespaced, windowSec);
    if (typeof n === "number") {
      return { limited: n > max, count: n, backend: "kv" };
    }
    // KV errored mid-flight — fall through to memory rather than failing open.
  }

  const n = memHit(namespaced, windowSec * 1000);
  return { limited: n > max, count: n, backend: "memory" };
}
