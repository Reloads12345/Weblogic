"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Lock, Loader2 } from "lucide-react";
import Logo from "@/components/ui/Logo";
import { isAuthed, login } from "@/components/admin/AdminAuth";

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (isAuthed()) {
      router.replace("/admin/dashboard");
    } else {
      setChecking(false);
    }
  }, [router]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await login(username.trim(), password);
      if (res.ok) {
        router.replace("/admin/dashboard");
      } else {
        setError(res.error ?? "Wrong credentials.");
        setBusy(false);
      }
    } catch {
      setError("Server error — try again.");
      setBusy(false);
    }
  };

  if (checking) {
    return (
      <main className="grid min-h-screen place-items-center bg-ink-0 text-mute">
        <Loader2 className="h-5 w-5 animate-spin" />
      </main>
    );
  }

  return (
    <main className="relative grid min-h-screen place-items-center bg-ink-0 px-4">
      {/* Top-left back to site */}
      <Link
        href="/"
        className="group absolute left-5 top-5 inline-flex items-center gap-2 text-sm text-mute transition hover:text-bone"
      >
        <span className="grid h-9 w-9 place-items-center rounded-full border border-white/12 transition-transform duration-300 group-hover:-translate-x-0.5 group-hover:border-white/30">
          <ArrowLeft className="h-4 w-4" />
        </span>
        Back to site
      </Link>

      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-3">
          <Logo size="md" />
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
            / Admin
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="rounded-3xl border border-white/10 bg-ink-50 p-7 md:p-8"
        >
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.22em] text-electric">
            <Lock className="h-3.5 w-3.5" />
            Sign in
          </div>
          <h1 className="mt-3 font-display text-2xl tracking-tightest text-bone md:text-3xl">
            WebLogic Studio Admin
          </h1>
          <p className="mt-2 text-sm text-mute">
            Authenticated access only. Asset uploads, content, and CMS controls
            live behind this gate.
          </p>

          <div className="mt-7 space-y-3">
            <label className="block">
              <span className="mb-1.5 block text-[10px] font-mono uppercase tracking-[0.18em] text-mute">
                Username
              </span>
              <input
                autoFocus
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                className="w-full rounded-full border border-white/10 bg-ink-100/60 px-5 py-3 text-sm text-bone placeholder:text-white/30 focus:border-electric focus:outline-none"
                placeholder="weblogic"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[10px] font-mono uppercase tracking-[0.18em] text-mute">
                Password
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full rounded-full border border-white/10 bg-ink-100/60 px-5 py-3 text-sm text-bone placeholder:text-white/30 focus:border-electric focus:outline-none"
                placeholder="••••••••"
              />
            </label>
          </div>

          {error && (
            <p className="mt-3 text-xs text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="btn-electric mt-6 w-full justify-center !py-3.5"
          >
            {busy ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Sign in"
            )}
          </button>

          <p className="mt-4 text-center text-[10px] font-mono uppercase tracking-[0.2em] text-mute">
            Authorized personnel only · WebLogic Studio
          </p>
        </form>
      </div>
    </main>
  );
}
