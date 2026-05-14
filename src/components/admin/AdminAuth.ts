/**
 * Client-side admin gate.
 *
 * The actual credential check now lives in `src/app/actions/admin-auth.ts`,
 * which reads `ADMIN_USERNAME` and `ADMIN_PASSWORD` from environment vars
 * at request time. Those secrets never ship in the client bundle.
 *
 * This file only manages the resulting opaque token in localStorage.
 * To swap to real auth (NextAuth, Clerk, Supabase, etc.) replace the
 * helpers below — the rest of the admin UI uses `isAuthed()` / `logout()`.
 */

import { loginAction } from "@/app/actions/admin-auth";

const KEY = "weblogic.admin.session";

export function isAuthed(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const v = localStorage.getItem(KEY);
    return Boolean(v && v.length > 0);
  } catch {
    return false;
  }
}

/**
 * Async login. Calls the server action to validate against env vars,
 * persists the returned opaque token on success.
 */
export async function login(
  username: string,
  password: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await loginAction({ username, password });
    if (res.ok && res.token) {
      try {
        localStorage.setItem(KEY, res.token);
      } catch {}
      return { ok: true };
    }
    return { ok: false, error: res.error ?? "Wrong credentials." };
  } catch {
    return { ok: false, error: "Server error — try again." };
  }
}

export function logout() {
  try {
    localStorage.removeItem(KEY);
  } catch {}
}
