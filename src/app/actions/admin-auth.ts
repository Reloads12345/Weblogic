"use server";

import { z } from "zod";

/**
 * Server-side admin auth.
 *
 * Credentials read from env vars at request time — never ship in the
 * client bundle:
 *
 *   ADMIN_USERNAME   (required in production)
 *   ADMIN_PASSWORD   (required in production)
 *
 * In LOCAL DEV ONLY, sensible defaults exist so `npm run dev` works
 * out of the box. In production (VERCEL=1) both env vars MUST be set —
 * the action returns 503 if either is missing, so we never accept the
 * default credentials on a public deployment.
 *
 * Token contract:
 *   On success we return the configured password itself as the bearer
 *   token. The client persists it in localStorage and sends it on every
 *   privileged API call via the `x-admin-token` header. The route handler
 *   uses `checkAdmin(req)` (lib/admin-session.ts) to validate.
 *
 *   Trade-offs:
 *     • Stored in plaintext localStorage (XSS-readable). Acceptable for a
 *       single-tenant operator CRUD; not acceptable for multi-tenant.
 *     • Rotating ADMIN_PASSWORD invalidates every active session
 *       automatically — which is desirable.
 *
 *   To upgrade to JWT / NextAuth / a sessions table, replace this function
 *   and `checkAdmin` — every call site already routes through them.
 */

const InputSchema = z.object({
  username: z.string().min(1).max(64),
  password: z.string().min(1).max(128),
});

export interface LoginResult {
  ok: boolean;
  /** Opaque token caller stores client-side. Empty on failure. */
  token: string;
  error?: string;
}

const IS_VERCEL = process.env.VERCEL === "1";

/**
 * Cheap constant-time-ish string compare. Not crypto-secure (JS strings
 * leak length), but eliminates the most obvious early-out timing channel.
 */
function safeEquals(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

export async function loginAction(input: unknown): Promise<LoginResult> {
  const parsed = InputSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, token: "", error: "Invalid input." };
  }

  // Fail closed in production if env vars aren't set — never accept the
  // default credentials on a public deployment.
  const envUser = process.env.ADMIN_USERNAME;
  const envPass = process.env.ADMIN_PASSWORD;
  if (IS_VERCEL && (!envUser || !envPass)) {
    return {
      ok: false,
      token: "",
      error:
        "Admin not configured on this deployment. Set ADMIN_USERNAME and ADMIN_PASSWORD.",
    };
  }
  const expectedUser = envUser ?? "weblogic";
  const expectedPass = envPass ?? "admin2026";

  const userOk = safeEquals(parsed.data.username.trim(), expectedUser);
  const passOk = safeEquals(parsed.data.password, expectedPass);

  if (!(userOk && passOk)) {
    // Tiny artificial delay so brute-force is at least slow.
    await new Promise((r) => setTimeout(r, 350));
    return { ok: false, token: "", error: "Wrong credentials." };
  }

  // Return the password itself as the bearer token. The server validates
  // x-admin-token === ADMIN_PASSWORD on every privileged request — so
  // rotating the password automatically invalidates every active session.
  return { ok: true, token: expectedPass };
}
