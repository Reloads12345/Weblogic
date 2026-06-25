import { NextResponse, type NextRequest } from "next/server";

/**
 * Edge middleware — server-side gate for the admin dashboard.
 *
 * Before this existed, `/admin/dashboard/*` was protected only by the
 * client-side <AdminGate> (a localStorage check that redirects after the
 * page JS hydrates). That meant the dashboard shell HTML/JS still shipped
 * to anyone who typed the URL. Now the request is blocked at the edge,
 * before any dashboard code is served, unless the httpOnly `wl_admin`
 * cookie matches the current ADMIN_PASSWORD.
 *
 * Scope: only `/admin/dashboard` and below. The login page at `/admin`
 * is intentionally NOT gated (gating it would create a redirect loop).
 *
 * Fail closed: if ADMIN_PASSWORD isn't configured in production, there's
 * no valid token to match, so every dashboard request redirects to the
 * login screen.
 *
 * Note: the API routes (`/api/upload`, `/api/diagnostics`) keep their own
 * `checkAdmin()` validation — middleware guards the *pages*, checkAdmin
 * guards the *mutations*. Defense in depth, not a single point of failure.
 */

const ADMIN_COOKIE = "wl_admin";
const IS_VERCEL = process.env.VERCEL === "1";

function expectedToken(): string | null {
  const pwd = process.env.ADMIN_PASSWORD;
  if (pwd) return pwd;
  if (!IS_VERCEL) return "admin2026"; // local dev default only
  return null; // prod without a password → fail closed
}

/** Constant-time compare so the edge can't leak the secret via timing. */
function safeEquals(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let m = 0;
  for (let i = 0; i < a.length; i++) m |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return m === 0;
}

export function middleware(req: NextRequest) {
  const supplied = req.cookies.get(ADMIN_COOKIE)?.value ?? "";
  const expected = expectedToken();

  if (expected && safeEquals(supplied, expected)) {
    return NextResponse.next();
  }

  // Not authenticated — bounce to the login page, preserving where they
  // were trying to go so the login can send them back after success.
  const url = req.nextUrl.clone();
  url.pathname = "/admin";
  url.search = "";
  return NextResponse.redirect(url);
}

export const config = {
  // Only run on dashboard routes. Everything else (marketing pages, the
  // login page, API routes, static assets) is untouched.
  matcher: ["/admin/dashboard/:path*"],
};
