/**
 * Tiny error-reporting facade.
 *
 * Today this is a structured-log shim — every call produces a single
 * `[error-report] ...` line that Vercel automatically captures into the
 * Logs tab. The JSON shape mirrors what a real Sentry / Honeycomb /
 * Datadog payload would carry, so when we swap to a real SDK (likely
 * `@sentry/nextjs` once we're past first-billing) the only change is the
 * body of `reportError`.
 *
 * Why not install Sentry today?
 *   • Until there's revenue, the value of paid monitoring is questionable
 *     and the bundle / runtime cost is non-zero.
 *   • Vercel Logs already captures structured console output reliably.
 *   • Decoupling the call sites from any specific SDK means we never
 *     touch a route handler again when we upgrade.
 *
 * Future drop-in:
 *   import * as Sentry from "@sentry/nextjs";
 *   Sentry.captureException(error, { tags: { route, ...tags }, extra });
 *
 * Usage:
 *   try { … } catch (err) {
 *     reportError(err, { route: "/api/checkout", tags: { mode: "payment" } });
 *     return NextResponse.json({ error: "…" }, { status: 500 });
 *   }
 *
 * The helper NEVER throws — if it threw inside a catch block we'd mask
 * the original error.
 */

type ReportContext = {
  /** Logical route or feature name — e.g. "/api/checkout" or "admin-upload" */
  route?: string;
  /** Cheap searchable key/value tags. Keep values short. */
  tags?: Record<string, string | number | boolean | null | undefined>;
  /** Arbitrary extra context. Will be JSON-stringified. */
  extra?: Record<string, unknown>;
  /** Override severity (default: "error"). "warning" for caught-and-continued. */
  level?: "error" | "warning" | "info";
};

const DSN = process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN ?? null;
const ENV =
  process.env.VERCEL_ENV ??
  process.env.NODE_ENV ??
  "development";
const RELEASE =
  process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ??
  process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ??
  null;

/**
 * Returns the configured monitoring backend, or `"console"` if we're in
 * structured-log mode. Useful for /api/diagnostics to surface what's wired.
 */
export function errorReporterBackend(): "sentry" | "console" {
  return DSN ? "sentry" : "console";
}

/** Strip Error → plain object for JSON serialization. */
function serializeError(err: unknown): Record<string, unknown> {
  if (err instanceof Error) {
    return {
      name: err.name,
      message: err.message,
      stack: err.stack,
      // Surface any custom keys some libraries attach (e.g. Stripe error codes)
      ...(err as unknown as Record<string, unknown>),
    };
  }
  if (typeof err === "object" && err !== null) {
    try {
      return JSON.parse(JSON.stringify(err));
    } catch {
      return { value: String(err) };
    }
  }
  return { value: String(err) };
}

/**
 * Report a thrown error. Never throws.
 *
 * In production with `SENTRY_DSN` set, this would forward to Sentry. Today
 * it always falls through to a structured console.error so the operator
 * sees the same data in Vercel Logs.
 */
export function reportError(
  err: unknown,
  ctx: ReportContext = {},
): void {
  const level = ctx.level ?? "error";
  const payload = {
    ts: new Date().toISOString(),
    level,
    env: ENV,
    release: RELEASE,
    route: ctx.route ?? null,
    tags: ctx.tags ?? null,
    extra: ctx.extra ?? null,
    error: serializeError(err),
  };

  try {
    if (DSN) {
      // Future: forward to Sentry. For now we still emit the structured
      // log so we never lose context during the transition.
      // (Intentionally no fire-and-forget fetch here — keeping zero
      // external dependencies in this module.)
    }
    const line = `[error-report] ${JSON.stringify(payload)}`;
    if (level === "error") {
      console.error(line);
    } else if (level === "warning") {
      console.warn(line);
    } else {
      console.log(line);
    }
  } catch {
    // Last-resort: even our reporter blew up. Don't propagate.
    try {
      console.error("[error-report] reporter_failed", err);
    } catch {
      /* nothing else we can do */
    }
  }
}

/**
 * Sugar for caught-but-handled errors that you want recorded as a warning
 * instead of an error (e.g. third-party email send failed but the lead
 * was still captured to the database).
 */
export function reportWarning(err: unknown, ctx: ReportContext = {}): void {
  reportError(err, { ...ctx, level: "warning" });
}
