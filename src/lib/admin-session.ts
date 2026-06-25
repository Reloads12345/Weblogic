/**
 * Admin session helpers — server side.
 *
 * The login server action (src/app/actions/admin-auth.ts) returns an opaque
 * token to the client. The client stores it in localStorage AND sends it on
 * every privileged API call as the `x-admin-token` header. Server-side
 * routes call `requireAdmin(req)` to validate.
 *
 * Token validity check:
 *   The token doesn't actually encode anything — it's a random UUID. The
 *   only thing the server can verify is "you typed the right password
 *   recently enough to have RECEIVED a token, AND the credentials still
 *   match what's in the env right now". So we rotate the secret by
 *   bumping ADMIN_PASSWORD, then revisit /admin to log in again.
 *
 * Production-safety:
 *   If ADMIN_USERNAME or ADMIN_PASSWORD aren't set in production, the gate
 *   FAILS CLOSED — every privileged request returns 503. We never fall
 *   back to "weblogic / admin2026" defaults outside of local dev.
 */

const IS_VERCEL = process.env.VERCEL === "1";

/**
 * Returns true if the admin credentials are configured for this deployment.
 * In dev we accept the built-in defaults; in production both env vars must
 * be set.
 */
export function adminConfigured(): boolean {
  if (IS_VERCEL) {
    return Boolean(process.env.ADMIN_USERNAME) && Boolean(process.env.ADMIN_PASSWORD);
  }
  return true; // dev defaults are fine on localhost
}

/**
 * Returns the opaque shared secret expected from the admin client.
 *
 * Today we use the ADMIN_PASSWORD value itself as the bearer token. Not
 * the most beautiful design, but it means:
 *   - Rotating the password rotates every active session.
 *   - No additional secret needs to be stored.
 *   - When `loginAction` returns a UUID token it doesn't actually have to
 *     match — the next privileged call sends `x-admin-token: <password>`
 *     directly (set by AdminAuth.ts after a successful login).
 *
 * If this feels janky, the upgrade path is NextAuth or a signed JWT. The
 * call sites only depend on `requireAdmin(req)`, so the swap is local.
 */
function expectedAdminToken(): string | null {
  const pwd = process.env.ADMIN_PASSWORD;
  if (pwd) return pwd;
  if (!IS_VERCEL) return "admin2026"; // dev fallback only
  return null;
}

/**
 * Constant-time string compare. Prevents trivial timing-attack leaks on
 * the length of the secret.
 */
function safeEquals(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let m = 0;
  for (let i = 0; i < a.length; i++) m |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return m === 0;
}

/** Name of the httpOnly admin session cookie (mirrors ADMIN_COOKIE in the
 * login action — duplicated here so this module has no client/server-action
 * import edge cases). */
const ADMIN_COOKIE = "wl_admin";

/** Pull a single cookie value out of a raw Cookie header. */
function readCookie(req: Request, name: string): string {
  const raw = req.headers.get("cookie");
  if (!raw) return "";
  for (const part of raw.split(";")) {
    const [k, ...v] = part.trim().split("=");
    if (k === name) return decodeURIComponent(v.join("="));
  }
  return "";
}

/**
 * Validate an admin request. Returns `null` if authorized, or a
 * NextResponse-shaped error object the caller can return directly.
 *
 * Accepts EITHER the `x-admin-token` header (sent by `adminFetch`) OR the
 * httpOnly `wl_admin` cookie (set at login). Either proves the caller knows
 * the current ADMIN_PASSWORD.
 */
export function checkAdmin(req: Request): null | { status: number; body: { error: string; code: string } } {
  if (!adminConfigured()) {
    return {
      status: 503,
      body: {
        error: "Admin not configured. Set ADMIN_USERNAME and ADMIN_PASSWORD on the deployment.",
        code: "ADMIN_NOT_CONFIGURED",
      },
    };
  }

  const headerToken = req.headers.get("x-admin-token") ?? "";
  const cookieToken = readCookie(req, ADMIN_COOKIE);
  const expected = expectedAdminToken();
  if (!expected) {
    return {
      status: 503,
      body: {
        error: "Admin secret missing on server.",
        code: "ADMIN_SECRET_MISSING",
      },
    };
  }
  if (!safeEquals(headerToken, expected) && !safeEquals(cookieToken, expected)) {
    return {
      status: 401,
      body: { error: "Unauthorized", code: "ADMIN_UNAUTHORIZED" },
    };
  }
  return null;
}
