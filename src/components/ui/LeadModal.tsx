"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CheckCircle2, X } from "lucide-react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useLeadModal } from "@/components/ui/LeadModalProvider";
import { submitLead } from "@/app/actions/lead";
import { cn } from "@/lib/utils";

const STAGES = [
  { id: "init", label: "What do you need?" },
  { id: "situation", label: "Tell us about your situation" },
  { id: "details", label: "How do we reach you?" },
  { id: "done", label: "Sent" },
] as const;

type Stage = (typeof STAGES)[number]["id"];

interface FormState {
  name: string;
  email: string;
  company: string;
  role: string;
  currentUrl: string;
  budget: string;
  timeline: string;
  scope: string;
  problem: string;
}

const EMPTY: FormState = {
  name: "",
  email: "",
  company: "",
  role: "",
  currentUrl: "",
  budget: "",
  timeline: "",
  scope: "",
  problem: "",
};

const BUDGETS = ["$500–$1.5k", "$1.5k–$3k", "$3k–$7.5k", "$7.5k+"];
const TIMELINES = ["Yesterday", "< 2 weeks", "2–6 weeks", "1–3 months", "Just exploring"];
const SCOPES = [
  "Build a new website",
  "Redesign current site",
  "Add Stripe / payments",
  "Build a client portal",
  "Custom automation",
  "Not sure yet",
];

export default function LeadModal() {
  const { isOpen, close, source } = useLeadModal();
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("init");
  const [form, setForm] = useState<FormState>(EMPTY);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((s) => ({ ...s, [k]: v }));

  const onClose = () => {
    close();
    setTimeout(() => {
      setStage("init");
      setForm(EMPTY);
      setError(null);
    }, 300);
  };

  const submit = () => {
    setError(null);
    startTransition(async () => {
      const res = await submitLead({ ...form, source: source ?? "modal" });
      if (res.ok) {
        setStage("done");
        // brief inline confirmation, then route to the full thank-you page
        window.setTimeout(() => {
          close();
          router.push("/thank-you");
          // reset state so re-opening the modal starts clean
          setTimeout(() => {
            setStage("init");
            setForm(EMPTY);
          }, 300);
        }, 1100);
      } else setError(res.error ?? "Something went wrong. Try again.");
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[170] flex items-center justify-center p-4"
          aria-modal
          role="dialog"
        >
          <button
            aria-label="Close"
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          <motion.div
            initial={{ y: 30, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 30, opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
            className="relative grid w-full max-w-3xl grid-cols-1 overflow-hidden rounded-3xl border border-white/10 bg-ink-50 shadow-glow-lg md:grid-cols-[300px_1fr]"
          >
            {/* Side rail */}
            <aside className="hidden flex-col justify-between border-r border-white/5 bg-ink-100/60 p-7 md:flex">
              <div>
                <p className="eyebrow text-electric">Free 24-hour audit</p>
                <h3 className="mt-3 font-display text-3xl leading-[0.95] tracking-tightest text-bone">
                  Send your site. Get a written plan.
                </h3>
                <p className="mt-3 text-sm text-mute">
                  Reply within one business day. Written audit covering performance,
                  mobile, SEO, and conversion paths — plus a fixed quote.
                </p>
              </div>
              <ol className="space-y-3">
                {STAGES.filter((s) => s.id !== "done").map((s, i) => {
                  const idx = STAGES.findIndex((x) => x.id === stage);
                  const cur = STAGES.findIndex((x) => x.id === s.id);
                  const done = cur < idx || stage === "done";
                  const active = cur === idx;
                  return (
                    <li
                      key={s.id}
                      className={cn(
                        "flex items-center gap-3 text-xs font-mono uppercase tracking-[0.18em] transition-colors",
                        active ? "text-bone" : done ? "text-electric" : "text-mute",
                      )}
                    >
                      <span
                        className={cn(
                          "grid h-5 w-5 place-items-center rounded-full border",
                          active && "border-electric bg-electric/15 text-electric",
                          done && "border-electric bg-electric text-white",
                          !active && !done && "border-white/15",
                        )}
                      >
                        {done ? <CheckCircle2 className="h-3 w-3" /> : i + 1}
                      </span>
                      {s.label}
                    </li>
                  );
                })}
              </ol>
            </aside>

            {/* Form pane */}
            <section className="relative p-6 md:p-8">
              <button
                type="button"
                onClick={onClose}
                className="absolute right-4 top-4 rounded-full border border-white/10 p-2 text-white/60 transition hover:border-white/30 hover:text-white"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>

              {stage === "init" && (
                <Step title="What do you need?" subtitle="Pick the closest match. You can change it later.">
                  <div className="grid grid-cols-2 gap-2">
                    {SCOPES.map((s) => (
                      <Chip
                        key={s}
                        active={form.scope === s}
                        onClick={() => {
                          update("scope", s);
                          setStage("situation");
                        }}
                      >
                        {s}
                      </Chip>
                    ))}
                  </div>
                </Step>
              )}

              {stage === "situation" && (
                <Step title="Tell us about your situation." subtitle="Two minutes. Helps us send a real plan, not a sales pitch.">
                  <Field label="Current website URL (if any)">
                    <input
                      value={form.currentUrl}
                      onChange={(e) => update("currentUrl", e.target.value)}
                      placeholder="https://yourbusiness.com"
                      className="input"
                    />
                  </Field>

                  <Field label="What's the biggest problem with your current site?">
                    <textarea
                      value={form.problem}
                      onChange={(e) => update("problem", e.target.value)}
                      rows={3}
                      placeholder="Slow on mobile, no payments, can't update it, no leads coming in…"
                      className="w-full resize-none rounded-xl border border-white/10 bg-ink-100/60 p-3 text-sm text-bone placeholder:text-white/30 focus:border-electric focus:outline-none"
                    />
                  </Field>

                  <Field label="Budget range">
                    <div className="flex flex-wrap gap-2">
                      {BUDGETS.map((b) => (
                        <Chip
                          key={b}
                          active={form.budget === b}
                          onClick={() => update("budget", b)}
                        >
                          {b}
                        </Chip>
                      ))}
                    </div>
                  </Field>
                  <Field label="Timeline">
                    <div className="flex flex-wrap gap-2">
                      {TIMELINES.map((t) => (
                        <Chip
                          key={t}
                          active={form.timeline === t}
                          onClick={() => update("timeline", t)}
                        >
                          {t}
                        </Chip>
                      ))}
                    </div>
                  </Field>

                  <div className="mt-2 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStage("init")}
                      className="text-xs font-mono uppercase tracking-[0.18em] text-mute hover:text-bone"
                    >
                      ← Back
                    </button>
                    <NextButton
                      disabled={!form.budget || !form.timeline}
                      onClick={() => setStage("details")}
                    />
                  </div>
                </Step>
              )}

              {stage === "details" && (
                <Step title="Last bit." subtitle="So we can send the audit to the right person.">
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Name">
                      <input
                        value={form.name}
                        onChange={(e) => update("name", e.target.value)}
                        className="input"
                        placeholder="Avery Reyes"
                      />
                    </Field>
                    <Field label="Role">
                      <input
                        value={form.role}
                        onChange={(e) => update("role", e.target.value)}
                        className="input"
                        placeholder="Founder / Marketing"
                      />
                    </Field>
                    <Field label="Work email">
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => update("email", e.target.value)}
                        className="input"
                        placeholder="avery@company.com"
                      />
                    </Field>
                    <Field label="Company">
                      <input
                        value={form.company}
                        onChange={(e) => update("company", e.target.value)}
                        className="input"
                        placeholder="Company Inc."
                      />
                    </Field>
                  </div>
                  {error && (
                    <p className="mt-2 text-xs text-red-400">{error}</p>
                  )}
                  <div className="mt-4 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStage("situation")}
                      className="text-xs font-mono uppercase tracking-[0.18em] text-mute hover:text-bone"
                    >
                      ← Back
                    </button>
                    <NextButton
                      disabled={pending || !form.name || !form.email || !form.company}
                      label={pending ? "Sending…" : "Send audit request"}
                      onClick={submit}
                    />
                  </div>
                </Step>
              )}

              {stage === "done" && (
                <div className="grid place-items-center py-10 text-center">
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-electric/15 text-electric shadow-glow-md">
                    <CheckCircle2 className="h-6 w-6" />
                  </span>
                  <h3 className="mt-5 font-display text-3xl tracking-tightest">
                    Got it.
                  </h3>
                  <p className="mt-2 max-w-sm text-sm text-mute">
                    Redirecting you to the next steps…
                  </p>
                </div>
              )}
            </section>
          </motion.div>
        </motion.div>
      )}

      <style>{`
        .input {
          width: 100%;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 0.75rem;
          padding: 0.6rem 0.8rem;
          font-size: 0.875rem;
          color: #fff;
        }
        .input::placeholder { color: rgba(255,255,255,0.3); }
        .input:focus { outline: none; border-color: #0052ff; box-shadow: 0 0 0 3px rgba(0,82,255,0.18); }
      `}</style>
    </AnimatePresence>
  );
}

function Step({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="eyebrow text-electric">Step</p>
      <h3 className="mt-1 font-display text-3xl tracking-tightest">{title}</h3>
      <p className="mt-1 text-sm text-mute">{subtitle}</p>
      <div className="mt-6 space-y-5">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] font-mono uppercase tracking-[0.18em] text-mute">
        {label}
      </span>
      {children}
    </label>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs transition",
        active
          ? "border-electric bg-electric/15 text-electric"
          : "border-white/10 text-white/70 hover:border-white/30 hover:text-white",
      )}
    >
      {children}
    </button>
  );
}

function NextButton({
  disabled,
  onClick,
  label = "Continue",
}: {
  disabled?: boolean;
  onClick: () => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "btn-electric text-xs",
        disabled && "pointer-events-none opacity-40",
      )}
    >
      {label}
      <ArrowRight className="h-3.5 w-3.5" />
    </button>
  );
}
