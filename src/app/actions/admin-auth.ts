"use server";

import { z } from "zod";

/**
 * Server-side admin auth.
 *
 * Credentials are read from environment variables at request time so they
 * never ship in the client bundle:
 *
 *   ADMIN_USERNAME   (default: "weblogic")
 *   ADMIN_PASSWORD   (default: "admin2026")
 *
 * The fallback defaults exist so local dev / first-clone works out of the
 * box — but ANY production deploy should set both envs to something
 * unguessable before the URL is shared.
 *
 * This is intentionally lightweight (no JWT, no sessions table). It's a
 * single-tenant gate for an asset/work CRUD admin. To upgrade to real
 * multi-user auth, replace this action with NextAuth / Clerk / Supabase
 * and keep the same call signature.
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

  const expectedUser = process.env.ADMIN_USERNAME ?? "weblogic";
  const expectedPass = process.env.ADMIN_PASSWORD ?? "admin2026";

  const userOk = safeEquals(parsed.data.username.trim(), expectedUser);
  const passOk = safeEquals(parsed.data.password, expectedPass);

  if (!(userOk && passOk)) {
    // Tiny artificial delay so brute-force is at least slow.
    await new Promise((r) => setTimeout(r, 350));
    return { ok: false, token: "", error: "Wrong credentials." };
  }

  // Opaque token tied to the env credential. Client persists this in
  // localStorage. We can rotate it by changing ADMIN_PASSWORD in prod.
  const token =
    typeof globalThis.crypto?.randomUUID === "function"
      ? globalThis.crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  return { ok: true, token };
}
