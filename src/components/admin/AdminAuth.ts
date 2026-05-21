/**
 * Client-side admin gate.
 *
 * The actual credential check lives in `src/app/actions/admin-auth.ts`,
 * which reads `ADMIN_USERNAME` / `ADMIN_PASSWORD` from env vars at request
 * time. The secrets never ship in the client bundle.
 *
 * On successful login the server hands back an opaque bearer token. We
 * persist it in localStorage and use it to authenticate every subsequent
 * privileged API call (`/api/upload` etc.) via the `x-admin-token`
 * header. Helper: `adminFetch(input, init)`.
 *
 * To swap to real auth (NextAuth, Clerk, Supabase, etc.) replace these
 * helpers — the rest of the admin UI uses `isAuthed()` / `logout()` /
 * `adminFetch()`.
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
 * Read the bearer token. Used by `adminFetch` to attach `x-admin-token`.
 * Returns null when not signed in.
 */
export function adminToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
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

/**
 * fetch() wrapper that attaches the admin bearer token. Use this for ANY
 * call to a privileged API route. Falls back to a 401-shaped response if
 * the operator isn't signed in, so the caller doesn't have to special-case.
 */
export async function adminFetch(
  input: string,
  init: RequestInit = {},
): Promise<Response> {
  const token = adminToken();
  const headers = new Headers(init.headers ?? {});
  if (token) headers.set("x-admin-token", token);
  return fetch(input, { ...init, headers });
}
