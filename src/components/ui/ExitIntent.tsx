"use client";

import { useEffect, useState, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Download, X } from "lucide-react";
import { submitLead } from "@/app/actions/lead";
import { cn } from "@/lib/utils";

const CHALLENGES = [
  "WordPress / Webflow migration",
  "Performance / Core Web Vitals",
  "PLG → enterprise repositioning",
  "Multi-brand unification",
  "Personalization / CRO",
  "Something else",
];

export default function ExitIntent() {
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [challenge, setChallenge] = useState<string>("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    try {
      if (sessionStorage.getItem("weblogic.exitIntent") === "1") {
        setShown(true);
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (shown) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(hover: none)").matches) return;

    let armed = false;
    const arm = setTimeout(() => {
      armed = true;
    }, 8_000);

    const onLeave = (e: MouseEvent) => {
      if (!armed) return;
      if (e.clientY < 12 && e.relatedTarget === null) {
        setOpen(true);
        setShown(true);
        try {
          sessionStorage.setItem("weblogic.exitIntent", "1");
        } catch {}
      }
    };
    document.addEventListener("mouseleave", onLeave);
    return () => {
      clearTimeout(arm);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, [shown]);

  const close = () => {
    setOpen(false);
    setTimeout(() => {
      setName("");
      setEmail("");
      setChallenge("");
      setDone(false);
      setError(null);
    }, 300);
  };

  const submit = () => {
    setError(null);
    if (!name.trim()) {
      setError("Mind dropping your name?");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("That doesn't look like a work email.");
      return;
    }
    if (!challenge) {
      setError("Pick the challenge that fits best — even 'something else' helps.");
      return;
    }
    startTransition(async () => {
      const res = await submitLead({
        name: name.trim(),
        email,
        company: "(via exit intent)",
        scope: "Audit + " + challenge,
        timeline: "Exploring",
        notes: `Biggest website challenge: ${challenge}. Sent free composable audit checklist.`,
        source: "exit-intent",
      });
      if (res.ok) setDone(true);
      else setError(res.error ?? "Couldn't send. Try again?");
    });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[175] flex items-center justify-center p-4"
          aria-modal
          role="dialog"
        >
          <button
            aria-label="Close"
            onClick={close}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          <motion.div
            initial={{ y: 24, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
            className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-white/10 bg-ink-50 p-7"
          >
            <button
              type="button"
              onClick={close}
              className="absolute right-4 top-4 rounded-full border border-white/10 p-2 text-white/60 transition hover:border-white/30 hover:text-white"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            {!done ? (
              <>
                <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.22em] text-electric">
                  <span className="relative inline-flex h-2 w-2" aria-hidden>
                    <span className="absolute inset-0 rounded-full bg-electric/50 animate-ping" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-electric" />
                  </span>
                  Leaving already?
                </div>
                <h3 className="mt-3 font-display text-3xl tracking-tightest text-bone">
                  Take the free <span className="text-electric">website audit</span>{" "}
                  checklist with you.
                </h3>
                <p className="mt-3 text-pretty text-mute">
                  47 line items we use during every WebLogic audit. PDF, no spam,
                  unsubscribe in one click.
                </p>

                <div className="mt-5 space-y-3">
                  <div className="grid gap-2 sm:grid-cols-2">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="rounded-full border border-white/10 bg-ink-100/60 px-4 py-3 text-sm text-bone placeholder:text-white/30 focus:border-electric focus:outline-none"
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="rounded-full border border-white/10 bg-ink-100/60 px-4 py-3 text-sm text-bone placeholder:text-white/30 focus:border-electric focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-[10px] font-mono uppercase tracking-[0.18em] text-mute">
                      What's your biggest website challenge?
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {CHALLENGES.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setChallenge(c)}
                          className={cn(
                            "rounded-full border px-3 py-1.5 text-xs transition",
                            challenge === c
                              ? "border-electric bg-electric/15 text-electric"
                              : "border-white/10 text-white/70 hover:border-white/30 hover:text-white",
                          )}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={submit}
                      disabled={pending}
                      className={cn(
                        "btn-electric w-full justify-center",
                        pending && "pointer-events-none opacity-50",
                      )}
                    >
                      {pending ? "Sending…" : "Send the checklist"}
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {error && <p className="mt-2 text-xs text-red-400">{error}</p>}

                <p className="mt-5 flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.18em] text-mute">
                  <Download className="h-3 w-3" />
                  PDF · 9 pages · No spam · Unsubscribe in one click
                </p>
              </>
            ) : (
              <div className="grid place-items-center py-6 text-center">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-electric/15 text-electric">
                  <CheckCircle2 className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display text-2xl tracking-tightest">On its way.</h3>
                <p className="mt-2 max-w-sm text-sm text-mute">
                  Check <span className="text-bone">{email}</span> in the next minute.
                  We'll also queue a short note about{" "}
                  <span className="text-electric">{challenge}</span> based on what
                  we've seen at similar-stage companies.
                </p>
                <button type="button" onClick={close} className="mt-5 btn-ghost text-xs">
                  Close
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
