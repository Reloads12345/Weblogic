"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Loader2, Gauge, Zap, Eye, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";
import { runAudit, type AuditResult } from "@/app/actions/audit";
import { cn } from "@/lib/utils";

/**
 * Free audit widget. Visitor pastes a URL, sees four Lighthouse scores
 * and the top 3 wins inline. If they also drop an email, they get the
 * full written report via Resend.
 *
 * Designed to be drop-in: <AuditWidget source="hero" /> works anywhere.
 * The component is fully self-contained — no external state, no
 * provider dependencies.
 *
 * Tone: visualize the audit result like a premium Lighthouse panel,
 * not like a marketing form result. That's the whole reason this exists
 * — to show prospects we can actually deliver.
 */
interface Props {
  source?: string;
  /** Compact view for use inside narrow containers (modals, sidebars). */
  compact?: boolean;
  className?: string;
}

export default function AuditWidget({
  source = "audit-widget",
  compact = false,
  className,
}: Props) {
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<AuditResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    setError(null);
    startTransition(async () => {
      const res = await runAudit({
        url: url.trim(),
        email: email.trim() || undefined,
        source,
      });
      if (res.ok) {
        setResult(res);
      } else {
        setError(res.error ?? "Couldn't run the audit. Try again.");
      }
    });
  };

  return (
    <div
      className={cn(
        "rounded-3xl border border-white/10 bg-ink-50/40 p-6 backdrop-blur-md md:p-8",
        className,
      )}
    >
      {!result ? (
        <form onSubmit={onSubmit}>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-electric">
            / Free instant audit
          </p>
          <h3
            className={cn(
              "mt-3 font-display tracking-tightest text-bone",
              compact ? "text-2xl md:text-3xl" : "text-3xl md:text-4xl",
            )}
          >
            Drop your URL. See the truth in 60 seconds.
          </h3>
          <p className="mt-3 text-sm text-mute md:text-base">
            We run a real Lighthouse audit and surface the three biggest wins.
            Email it to yourself for the full written report.
          </p>

          <div className="mt-6 grid gap-3">
            <label className="block">
              <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
                Your site URL *
              </span>
              <input
                type="text"
                inputMode="url"
                autoComplete="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="yourbusiness.com"
                className="w-full rounded-xl border border-white/10 bg-ink-100/60 px-4 py-3 text-sm text-bone placeholder:text-white/30 focus:border-electric focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
                Email me the full report (optional)
              </span>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full rounded-xl border border-white/10 bg-ink-100/60 px-4 py-3 text-sm text-bone placeholder:text-white/30 focus:border-electric focus:outline-none"
              />
            </label>

            {error && (
              <div className="flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/[0.06] px-3 py-2 text-xs text-red-300">
                <AlertCircle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={pending}
              className={cn(
                "group inline-flex w-full items-center justify-center gap-2 rounded-full bg-electric px-6 py-3.5 text-sm font-medium text-ink-0 transition",
                pending
                  ? "opacity-70"
                  : "hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,82,255,0.4)]",
              )}
            >
              {pending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Running audit…
                </>
              ) : (
                <>
                  Run my audit
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </>
              )}
            </button>
            <p className="text-center text-[10px] font-mono uppercase tracking-[0.2em] text-mute">
              Real Lighthouse · mobile strategy · no signup wall
            </p>
          </div>
        </form>
      ) : (
        <ResultPanel
          result={result}
          onReset={() => {
            setResult(null);
            setEmail("");
          }}
        />
      )}
    </div>
  );
}

/* ─────────────────────── Result rendering ─────────────────────── */

function ResultPanel({
  result,
  onReset,
}: {
  result: AuditResult;
  onReset: () => void;
}) {
  const scores = result.scores;
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="result"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-electric">
              / Audit complete
            </p>
            <p className="mt-2 truncate font-mono text-xs text-mute">
              {result.url}
            </p>
          </div>
          {result.emailQueued && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-electric/40 bg-electric/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-electric">
              <CheckCircle2 className="h-3 w-3" />
              Emailed
            </span>
          )}
        </div>

        {scores && (
          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            <ScoreDial label="Performance" score={scores.performance} icon={Zap} />
            <ScoreDial label="Accessibility" score={scores.accessibility} icon={Eye} />
            <ScoreDial label="Best practices" score={scores.bestPractices} icon={Sparkles} />
            <ScoreDial label="SEO" score={scores.seo} icon={Gauge} />
          </div>
        )}

        {result.metrics && (
          <div className="mt-6 grid grid-cols-3 gap-2 rounded-2xl border border-white/8 bg-ink-100/40 p-4 text-center">
            <Metric label="LCP" value={result.metrics.lcp?.display ?? "—"} />
            <Metric label="CLS" value={result.metrics.cls?.display ?? "—"} />
            <Metric label="TBT" value={result.metrics.tbt?.display ?? "—"} />
          </div>
        )}

        {result.wins && result.wins.length > 0 && (
          <div className="mt-7">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
              / Top 3 wins
            </p>
            <ul className="mt-3 space-y-2">
              {result.wins.map((w, i) => (
                <li
                  key={`${w.title}-${i}`}
                  className="rounded-xl border border-white/10 bg-ink-0/50 p-4"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-sm text-bone">{w.title}</p>
                    {w.savingsMs && (
                      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-electric">
                        ~{Math.round(w.savingsMs / 100) / 10}s
                      </p>
                    )}
                  </div>
                  {w.description && (
                    <p className="mt-1 text-xs text-mute">{w.description}</p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-7 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-5 py-2.5 text-xs text-bone transition hover:border-white/35"
          >
            Run another
          </button>
          <a
            href="/checkout"
            className="inline-flex items-center gap-2 rounded-full bg-electric px-5 py-2.5 text-xs font-medium text-ink-0 transition hover:-translate-y-0.5"
          >
            See pricing
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ─────────────────────── Score dial ─────────────────────── */

function ScoreDial({
  label,
  score,
  icon: Icon,
}: {
  label: string;
  score: number | null;
  icon: React.ComponentType<{ className?: string }>;
}) {
  const tone =
    score == null
      ? "text-mute"
      : score >= 90
        ? "text-electric"
        : score >= 50
          ? "text-bone"
          : "text-amber-300";
  const ring =
    score == null
      ? "border-white/10"
      : score >= 90
        ? "border-electric/60"
        : score >= 50
          ? "border-white/30"
          : "border-amber-300/50";

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border bg-ink-0/40 p-4 text-center",
        ring,
      )}
    >
      <Icon className={cn("h-4 w-4", tone)} />
      <p className={cn("mt-2 font-display text-3xl tracking-tightest md:text-4xl", tone)}>
        {score ?? "—"}
      </p>
      <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.18em] text-mute">
        {label}
      </p>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-display text-lg text-bone md:text-xl">{value}</p>
      <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.18em] text-mute">
        {label}
      </p>
    </div>
  );
}
