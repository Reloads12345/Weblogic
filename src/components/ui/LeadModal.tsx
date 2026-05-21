"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, ArrowRight, CheckCircle2, X } from "lucide-react";
import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useLeadModal } from "@/components/ui/LeadModalProvider";
import { submitLead } from "@/app/actions/lead";
import { cn } from "@/lib/utils";

/* ----------------------------------------------------------------------------
   Multi-step lead modal. Now collects a quick site-audit checklist in
   addition to the contact + project basics. Honeypot field is included
   for spam protection — humans never see it; bots fill it; server drops
   the submission silently.
---------------------------------------------------------------------------- */

const STAGES = [
  { id: "init", label: "What do you need?" },
  { id: "audit", label: "Quick site audit" },
  { id: "situation", label: "Project details" },
  { id: "details", label: "How do we reach you?" },
  { id: "done", label: "Sent" },
] as const;

type Stage = (typeof STAGES)[number]["id"];

type YesNo = "yes" | "no";
type YesNoUnsure = "yes" | "no" | "unsure";
type BuildType = "redesign" | "new-build" | "not-sure";

interface ChecklistState {
  hasWebsite?: YesNo;
  mobileFriendly?: YesNoUnsure;
  enoughLeads?: YesNo;
  needs: string[];
  needsSeo?: YesNoUnsure;
  buildType?: BuildType;
}

interface FormState {
  name: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  currentUrl: string;
  budget: string;
  timeline: string;
  scope: string;
  problem: string;
  checklist: ChecklistState;
  /** Honeypot — must remain empty. Hidden via CSS, not in tab order. */
  website: string;
}

const EMPTY: FormState = {
  name: "",
  email: "",
  phone: "",
  company: "",
  role: "",
  currentUrl: "",
  budget: "",
  timeline: "",
  scope: "",
  problem: "",
  checklist: { needs: [] },
  website: "",
};

const BUDGETS = ["$500–$1.5k", "$1.5k–$3k", "$3k–$7.5k", "$7.5k+"];
const TIMELINES = [
  "Yesterday",
  "< 2 weeks",
  "2–6 weeks",
  "1–3 months",
  "Just exploring",
];
const SCOPES = [
  "Build a new website",
  "Redesign current site",
  "Add Stripe / payments",
  "Build a client portal",
  "Custom automation",
  "Not sure yet",
];
const NEEDS = ["Booking", "Payments", "Automations", "Forms"];

export default function LeadModal() {
  const { isOpen, close, source } = useLeadModal();
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("init");
  const [form, setForm] = useState<FormState>(EMPTY);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Escape closes; body-scroll lock while open; restore focus to opener on
  // close. The native <dialog> would handle most of this automatically but
  // it doesn't compose with Framer Motion's enter/exit transitions.
  useEffect(() => {
    if (!isOpen) return;
    const opener = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      }
    };
    document.addEventListener("keydown", onKey);

    // Focus the first focusable element in the dialog so keyboard users
    // land inside immediately instead of having to Tab back from <body>.
    const focusTimer = window.setTimeout(() => {
      const first = dialogRef.current?.querySelector<HTMLElement>(
        "[autofocus], input:not([type=hidden]), button:not([aria-label='Close'])",
      );
      first?.focus();
    }, 60);

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      window.clearTimeout(focusTimer);
      // Restore focus to whatever triggered the modal so screen-reader
      // and keyboard users don't get dumped at the top of <body>.
      opener?.focus?.();
    };
  }, [isOpen, close]);

  const update = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((s) => ({ ...s, [k]: v }));

  const updateChecklist = <K extends keyof ChecklistState>(
    k: K,
    v: ChecklistState[K],
  ) =>
    setForm((s) => ({ ...s, checklist: { ...s.checklist, [k]: v } }));

  const toggleNeed = (need: string) =>
    setForm((s) => {
      const has = s.checklist.needs.includes(need);
      return {
        ...s,
        checklist: {
          ...s.checklist,
          needs: has
            ? s.checklist.needs.filter((n) => n !== need)
            : [...s.checklist.needs, need],
        },
      };
    });

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
        window.setTimeout(() => {
          close();
          router.push("/thank-you");
          setTimeout(() => {
            setStage("init");
            setForm(EMPTY);
          }, 300);
        }, 1300);
      } else {
        setError(res.error ?? "Something went wrong. Try again.");
      }
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dialogRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[170] flex items-center justify-center p-4"
          aria-modal="true"
          aria-labelledby="lead-modal-title"
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
            className="relative grid w-full max-w-3xl grid-cols-1 overflow-hidden rounded-3xl border border-white/10 bg-ink-50 shadow-glow-lg md:grid-cols-[300px_1fr] max-h-[90vh]"
          >
            {/* Side rail */}
            <aside className="hidden flex-col justify-between border-r border-white/5 bg-ink-100/60 p-7 md:flex">
              <div>
                <p className="eyebrow text-electric">Free 24-hour audit</p>
                <h3
                  id="lead-modal-title"
                  className="mt-3 font-display text-3xl leading-[0.95] tracking-tightest text-bone"
                >
                  Send your site. Get a written plan.
                </h3>
                <p className="mt-3 text-sm text-mute">
                  Reply within one business day. Covers performance, mobile,
                  SEO, and conversion paths — plus a fixed quote.
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
                          "grid h-5 w-5 shrink-0 place-items-center rounded-full border",
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
            <section className="relative overflow-y-auto p-6 md:p-8">
              <button
                type="button"
                onClick={onClose}
                className="absolute right-4 top-4 z-10 rounded-full border border-white/10 bg-ink-50 p-2 text-white/60 transition hover:border-white/30 hover:text-white"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>

              {/* HONEYPOT — invisible to humans, magnet for bots. */}
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden
                value={form.website}
                onChange={(e) => update("website", e.target.value)}
                style={{
                  position: "absolute",
                  left: "-9999px",
                  width: 1,
                  height: 1,
                  opacity: 0,
                  pointerEvents: "none",
                }}
              />

              {/* ───────────── Step 1: scope ───────────── */}
              {stage === "init" && (
                <Step
                  title="What do you need?"
                  subtitle="Pick the closest match. You can change it later."
                >
                  <div className="grid grid-cols-2 gap-2">
                    {SCOPES.map((s) => (
                      <Chip
                        key={s}
                        active={form.scope === s}
                        onClick={() => {
                          update("scope", s);
                          setStage("audit");
                        }}
                      >
                        {s}
                      </Chip>
                    ))}
                  </div>
                </Step>
              )}

              {/* ───────────── Step 2: quick site audit ───────────── */}
              {stage === "audit" && (
                <Step
                  title="Quick site audit."
                  subtitle="Six fast taps. Helps us send a plan tailored to what you actually need."
                >
                  <YesNoField
                    label="Do you currently have a website?"
                    value={form.checklist.hasWebsite}
                    onSelect={(v) => updateChecklist("hasWebsite", v)}
                  />
                  <YesNoUnsureField
                    label="Is your current site mobile-friendly?"
                    value={form.checklist.mobileFriendly}
                    onSelect={(v) => updateChecklist("mobileFriendly", v)}
                  />
                  <YesNoField
                    label="Are you getting enough leads right now?"
                    value={form.checklist.enoughLeads}
                    onSelect={(v) => updateChecklist("enoughLeads", v)}
                  />
                  <YesNoUnsureField
                    label="Do you need SEO improvement?"
                    value={form.checklist.needsSeo}
                    onSelect={(v) => updateChecklist("needsSeo", v)}
                  />
                  <Field label="Which of these do you need? (pick any)">
                    <div className="flex flex-wrap gap-2">
                      {NEEDS.map((n) => (
                        <Chip
                          key={n}
                          active={form.checklist.needs.includes(n)}
                          onClick={() => toggleNeed(n)}
                        >
                          {n}
                        </Chip>
                      ))}
                    </div>
                  </Field>
                  <Field label="Redesign or new build?">
                    <div className="flex flex-wrap gap-2">
                      {(
                        [
                          ["Redesign", "redesign"],
                          ["New build", "new-build"],
                          ["Not sure", "not-sure"],
                        ] as Array<[string, BuildType]>
                      ).map(([label, value]) => (
                        <Chip
                          key={value}
                          active={form.checklist.buildType === value}
                          onClick={() => updateChecklist("buildType", value)}
                        >
                          {label}
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
                    <NextButton onClick={() => setStage("situation")} />
                  </div>
                </Step>
              )}

              {/* ───────────── Step 3: project details ───────────── */}
              {stage === "situation" && (
                <Step
                  title="Project details."
                  subtitle="Two minutes. Helps us send a real plan, not a sales pitch."
                >
                  <Field label="Current website URL (if any)">
                    <input
                      value={form.currentUrl}
                      onChange={(e) => update("currentUrl", e.target.value)}
                      placeholder="https://yourbusiness.com"
                      className="input"
                    />
                  </Field>

                  <Field label="What's the biggest problem with your current online presence?">
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
                      onClick={() => setStage("audit")}
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

              {/* ───────────── Step 4: contact ───────────── */}
              {stage === "details" && (
                <Step
                  title="Last bit."
                  subtitle="So we can send the audit to the right person."
                >
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Name *">
                      <input
                        value={form.name}
                        onChange={(e) => update("name", e.target.value)}
                        className="input"
                        placeholder="Avery Reyes"
                        required
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
                    <Field label="Work email *">
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => update("email", e.target.value)}
                        className="input"
                        placeholder="avery@company.com"
                        required
                      />
                    </Field>
                    <Field label="Phone (optional)">
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => update("phone", e.target.value)}
                        className="input"
                        placeholder="(555) 123-4567"
                      />
                    </Field>
                    <Field label="Business name *">
                      <input
                        value={form.company}
                        onChange={(e) => update("company", e.target.value)}
                        className="input"
                        placeholder="Acme Co."
                        required
                      />
                    </Field>
                  </div>

                  {error && (
                    <div className="mt-3 flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/[0.06] px-3 py-2 text-xs text-red-300">
                      <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      <span>{error}</span>
                    </div>
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
                      disabled={
                        pending ||
                        !form.name ||
                        !form.email ||
                        !form.company
                      }
                      label={pending ? "Sending…" : "Send audit request"}
                      onClick={submit}
                    />
                  </div>
                </Step>
              )}

              {/* ───────────── Done ───────────── */}
              {stage === "done" && (
                <div className="grid place-items-center py-10 text-center">
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-electric/15 text-electric shadow-glow-md">
                    <CheckCircle2 className="h-6 w-6" />
                  </span>
                  <h3 className="mt-5 font-display text-3xl tracking-tightest">
                    Got it.
                  </h3>
                  <p className="mt-2 max-w-sm text-sm text-mute">
                    Your audit request is on its way to{" "}
                    <span className="text-bone">caleb@weblogic.digital</span>.
                    We&apos;ll reply within 24 hours.
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

/* ----------------------- Subcomponents ----------------------- */

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

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
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

function YesNoField({
  label,
  value,
  onSelect,
}: {
  label: string;
  value: YesNo | undefined;
  onSelect: (v: YesNo) => void;
}) {
  return (
    <Field label={label}>
      <div className="flex flex-wrap gap-2">
        <Chip active={value === "yes"} onClick={() => onSelect("yes")}>
          Yes
        </Chip>
        <Chip active={value === "no"} onClick={() => onSelect("no")}>
          No
        </Chip>
      </div>
    </Field>
  );
}

function YesNoUnsureField({
  label,
  value,
  onSelect,
}: {
  label: string;
  value: YesNoUnsure | undefined;
  onSelect: (v: YesNoUnsure) => void;
}) {
  return (
    <Field label={label}>
      <div className="flex flex-wrap gap-2">
        <Chip active={value === "yes"} onClick={() => onSelect("yes")}>
          Yes
        </Chip>
        <Chip active={value === "no"} onClick={() => onSelect("no")}>
          No
        </Chip>
        <Chip active={value === "unsure"} onClick={() => onSelect("unsure")}>
          Don&apos;t know
        </Chip>
      </div>
    </Field>
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
