"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  Lock,
  Plus,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import Header from "@/components/nav/Header";
import Footer from "@/components/sections/Footer";
import MagneticButton from "@/components/ui/MagneticButton";
import { cn } from "@/lib/utils";
import {
  ADDONS,
  CARE_PLANS,
  PACKAGES,
  computeOrderTotals,
  formatUsd,
  isPackageKey,
  isCarePlanKey,
  type AddonKey,
  type CarePlanKey,
  type PackageKey,
} from "@/lib/checkout-config";

type CheckoutMode = "project" | "subscription";

const PACKAGE_ORDER: PackageKey[] = [
  "starter",
  "growth",
  "businessSystem",
  "websiteAudit",
  "customProjectDeposit",
];

const CARE_ORDER: CarePlanKey[] = [
  "essential",
  "growth",
  "systems",
  "customRetainer",
];

interface Contact {
  name: string;
  email: string;
  businessName: string;
  currentUrl: string;
  projectNotes: string;
  timeline: string;
  budget: string;
  bestContactMethod: string;
}

const EMPTY_CONTACT: Contact = {
  name: "",
  email: "",
  businessName: "",
  currentUrl: "",
  projectNotes: "",
  timeline: "",
  budget: "",
  bestContactMethod: "",
};

const TIMELINES = ["< 2 weeks", "2–6 weeks", "1–3 months", "Just exploring"];
const BUDGETS = ["$500–$1.5k", "$1.5k–$3k", "$3k–$7.5k", "$7.5k+"];
const CONTACT_METHODS = ["Email", "Phone", "SMS", "Slack / Teams"];

export default function CheckoutClient() {
  const params = useSearchParams();
  const router = useRouter();
  const wasCanceled = params.get("canceled") === "1";

  // ── Mode + selection state ───────────────────────────────────────────
  const initialMode: CheckoutMode = params.get("mode") === "care"
    ? "subscription"
    : "project";
  const [mode, setMode] = useState<CheckoutMode>(initialMode);

  const initialPackage = (() => {
    const p = params.get("plan") ?? params.get("package");
    if (p && isPackageKey(p)) return p;
    return "growth" as PackageKey;
  })();
  const [packageKey, setPackageKey] = useState<PackageKey>(initialPackage);

  const initialCarePlan = (() => {
    const p = params.get("carePlan");
    if (p && isCarePlanKey(p)) return p;
    return "growth" as CarePlanKey;
  })();
  const [carePlanKey, setCarePlanKey] = useState<CarePlanKey>(initialCarePlan);

  const [addons, setAddons] = useState<AddonKey[]>([]);
  const [contact, setContact] = useState<Contact>(EMPTY_CONTACT);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Derived state ────────────────────────────────────────────────────
  const pkg = useMemo(() => PACKAGES[packageKey], [packageKey]);
  const carePlan = useMemo(
    () => CARE_PLANS[carePlanKey],
    [carePlanKey],
  );
  const selectedAddonObjs = useMemo(
    () => addons.map((k) => ADDONS[k]).filter(Boolean),
    [addons],
  );
  const totals = useMemo(
    () => computeOrderTotals(pkg, selectedAddonObjs),
    [pkg, selectedAddonObjs],
  );

  // Drop add-ons that aren't allowed when the package changes.
  useEffect(() => {
    setAddons((prev) =>
      prev.filter((a) => pkg.allowedAddons.includes(a)),
    );
  }, [pkg.allowedAddons]);

  // Keep URL in sync with current selection (shareable / reload-safe).
  useEffect(() => {
    const next = new URL(window.location.href);
    next.searchParams.set("mode", mode === "subscription" ? "care" : "project");
    if (mode === "project") {
      next.searchParams.set("plan", packageKey);
      next.searchParams.delete("carePlan");
    } else {
      next.searchParams.set("carePlan", carePlanKey);
      next.searchParams.delete("plan");
    }
    window.history.replaceState(null, "", next.toString());
  }, [mode, packageKey, carePlanKey]);

  // ── Helpers ──────────────────────────────────────────────────────────

  const toggleAddon = (k: AddonKey) =>
    setAddons((prev) =>
      prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k],
    );

  const updateContact = <K extends keyof Contact>(k: K, v: Contact[K]) =>
    setContact((c) => ({ ...c, [k]: v }));

  const requiredOk =
    contact.name.trim().length > 0 &&
    contact.email.trim().length > 0 &&
    contact.businessName.trim().length > 0;

  const payButtonLabel =
    mode === "project" ? pkg.payButtonLabel : carePlan.payButtonLabel;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requiredOk) {
      setError("Enter your name, email, and business name before checkout.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const body =
        mode === "project"
          ? {
              checkoutType: "project" as const,
              packageKey,
              addons,
              contact,
            }
          : {
              checkoutType: "subscription" as const,
              carePlanKey,
              contact,
            };
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = (await res.json()) as {
        redirectUrl?: string;
        error?: string;
      };
      if (!res.ok || !json.redirectUrl) {
        throw new Error(json.error ?? "Checkout failed.");
      }
      setSubmitted(true);
      window.location.href = json.redirectUrl;
    } catch (err) {
      setSubmitting(false);
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Try again.",
      );
    }
  };

  return (
    <>
      <Header />
      <main id="main" className="bg-ink-0">
        {/* Hero */}
        <section className="border-b border-white/5 pt-32 md:pt-40 pb-10">
          <div className="container-pad max-w-6xl">
            <button
              type="button"
              onClick={() => router.push("/pricing")}
              className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-mute transition hover:text-bone"
            >
              <ArrowLeft className="h-3 w-3" />
              Back to pricing
            </button>
            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 max-w-[20ch] text-balance font-display text-display-lg leading-[0.92] tracking-tightest text-bone md:text-display-xl"
            >
              Configure your project.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="mt-5 max-w-[60ch] text-lg text-bone/70 md:text-xl"
            >
              Pick a package, configure add-ons, and pay your deposit through
              Stripe. WebLogic begins planning and design once the deposit
              clears. Refundable within 7 days.
            </motion.p>
            <div className="mt-6 flex flex-wrap gap-2">
              {[
                { icon: Lock, label: "Stripe-secured" },
                { icon: ShieldCheck, label: "7-day refund" },
                { icon: Sparkles, label: "Built by Caleb Gathu" },
              ].map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-3 py-1.5 text-xs text-bone/80"
                >
                  <Icon className="h-3.5 w-3.5 text-electric" />
                  {label}
                </span>
              ))}
            </div>

            {/* Mode toggle — Project Build vs Monthly Care */}
            <div
              role="tablist"
              aria-label="Checkout type"
              className="mt-10 inline-flex items-center gap-1 rounded-full border border-white/10 bg-ink-50 p-1"
            >
              <ModeTab
                active={mode === "project"}
                onClick={() => setMode("project")}
              >
                Project Build
              </ModeTab>
              <ModeTab
                active={mode === "subscription"}
                onClick={() => setMode("subscription")}
              >
                Monthly Care
              </ModeTab>
            </div>
          </div>
        </section>

        {wasCanceled && (
          <div className="container-pad max-w-6xl pt-8">
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/[0.06] px-5 py-4 text-sm text-amber-200">
              You canceled checkout. No charge was made — adjust your
              selection below and try again when ready.
            </div>
          </div>
        )}

        {/* Configurator */}
        <section className="border-b border-white/5 py-12 md:py-16">
          <div className="container-pad max-w-6xl">
            <form
              onSubmit={onSubmit}
              className="grid gap-10 md:grid-cols-12"
            >
              {/* ───────── LEFT COLUMN ───────── */}
              <div className="space-y-12 md:col-span-7">
                {/* PROJECT MODE */}
                {mode === "project" && (
                  <>
                    <Step number="01" title="Choose your package">
                      <div className="grid gap-3">
                        {PACKAGE_ORDER.map((k) => {
                          const p = PACKAGES[k];
                          const active = k === packageKey;
                          return (
                            <button
                              key={k}
                              type="button"
                              onClick={() => setPackageKey(k)}
                              className={cn(
                                "group w-full rounded-2xl border p-5 text-left transition",
                                active
                                  ? "border-electric/60 bg-electric/[0.06]"
                                  : "border-white/10 bg-white/[0.02] hover:border-white/25 hover:bg-white/[0.04]",
                              )}
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 space-y-1.5">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className="font-display text-lg tracking-tight text-bone">
                                      {p.name}
                                    </span>
                                    {p.timeline && (
                                      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
                                        · {p.timeline}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-sm text-bone/65">
                                    {p.bestFor}
                                  </p>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                  <div className="text-right">
                                    <span
                                      className={cn(
                                        "block font-display text-2xl tracking-tight",
                                        active ? "text-electric" : "text-bone",
                                      )}
                                    >
                                      {formatUsd(p.depositUsd)}
                                    </span>
                                    <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
                                      {p.chargeMode === "oneTime"
                                        ? "Pay in full"
                                        : "Due today"}
                                    </span>
                                  </div>
                                  <span
                                    className={cn(
                                      "flex h-5 w-5 items-center justify-center rounded-full border transition",
                                      active
                                        ? "border-electric bg-electric text-ink-0"
                                        : "border-white/25",
                                    )}
                                  >
                                    {active && <Check className="h-3 w-3" />}
                                  </span>
                                </div>
                              </div>

                              {active && (
                                <>
                                  <div className="mt-4 grid gap-1.5 border-t border-white/8 pt-4">
                                    {p.includes.map((line) => (
                                      <p
                                        key={line}
                                        className="flex items-start gap-2 text-xs text-bone/75"
                                      >
                                        <Check className="mt-0.5 h-3 w-3 flex-shrink-0 text-electric" />
                                        {line}
                                      </p>
                                    ))}
                                  </div>
                                  {p.warning && (
                                    <p className="mt-3 flex items-start gap-2 rounded-xl border border-amber-500/25 bg-amber-500/[0.04] px-3 py-2 text-[11px] text-amber-200/90">
                                      <AlertCircle className="mt-0.5 h-3 w-3 flex-shrink-0" />
                                      {p.warning}
                                    </p>
                                  )}
                                </>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </Step>

                    {/* Add-ons — filtered by selected package */}
                    {pkg.allowedAddons.length > 0 ? (
                      <Step number="02" title="Add-ons (optional)">
                        <p className="text-sm text-bone/65">
                          Only add-ons compatible with {pkg.name} are shown.
                          Final scope locks in writing before development
                          begins.
                        </p>
                        <div className="grid gap-2.5">
                          {pkg.allowedAddons.map((k) => {
                            const a = ADDONS[k];
                            const active = addons.includes(k);
                            return (
                              <button
                                key={k}
                                type="button"
                                onClick={() => toggleAddon(k)}
                                className={cn(
                                  "flex w-full items-start justify-between gap-4 rounded-xl border px-4 py-3 text-left transition",
                                  active
                                    ? "border-electric/60 bg-electric/[0.06]"
                                    : "border-white/10 bg-white/[0.02] hover:border-white/25",
                                )}
                              >
                                <span className="flex items-start gap-3">
                                  <span
                                    className={cn(
                                      "mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border transition",
                                      active
                                        ? "border-electric bg-electric text-ink-0"
                                        : "border-white/25",
                                    )}
                                  >
                                    {active && <Check className="h-2.5 w-2.5" />}
                                  </span>
                                  <span className="flex flex-col gap-0.5">
                                    <span className="text-sm text-bone">
                                      {a.name}
                                    </span>
                                    {a.description && (
                                      <span className="text-[11px] text-mute">
                                        {a.description}
                                      </span>
                                    )}
                                  </span>
                                </span>
                                <span
                                  className={cn(
                                    "font-mono text-xs",
                                    active ? "text-electric" : "text-mute",
                                  )}
                                >
                                  +{formatUsd(a.priceUsd)}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </Step>
                    ) : (
                      <Step
                        number="02"
                        title="No add-ons for this package"
                      >
                        <p className="text-sm text-bone/65">
                          {pkg.key === "websiteAudit"
                            ? "The paid audit is delivered as a written deliverable. Skip ahead to your details."
                            : "Custom deposits start the planning phase. Add-ons are scoped on the approved proposal."}
                        </p>
                      </Step>
                    )}
                  </>
                )}

                {/* SUBSCRIPTION MODE */}
                {mode === "subscription" && (
                  <Step number="01" title="Choose your care plan">
                    <p className="text-sm text-bone/65">
                      Monthly recurring. Charged on the day of signup, renews
                      automatically until canceled.
                    </p>
                    <div className="grid gap-3">
                      {CARE_ORDER.map((k) => {
                        const p = CARE_PLANS[k];
                        const active = k === carePlanKey;
                        return (
                          <button
                            key={k}
                            type="button"
                            onClick={() => setCarePlanKey(k)}
                            className={cn(
                              "w-full rounded-2xl border p-5 text-left transition",
                              active
                                ? "border-electric/60 bg-electric/[0.06]"
                                : "border-white/10 bg-white/[0.02] hover:border-white/25 hover:bg-white/[0.04]",
                            )}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 space-y-1.5">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="font-display text-lg tracking-tight text-bone">
                                    {p.name}
                                  </span>
                                  {p.highlight && (
                                    <span className="rounded-full bg-electric px-2 py-0.5 text-[9px] font-mono uppercase tracking-widest text-white">
                                      Most chosen
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-bone/65">
                                  {p.bestFor}
                                </p>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <div className="text-right">
                                  <span
                                    className={cn(
                                      "block font-display text-2xl tracking-tight",
                                      active ? "text-electric" : "text-bone",
                                    )}
                                  >
                                    {formatUsd(p.monthlyUsd)}
                                  </span>
                                  <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
                                    / month
                                  </span>
                                </div>
                                <span
                                  className={cn(
                                    "flex h-5 w-5 items-center justify-center rounded-full border transition",
                                    active
                                      ? "border-electric bg-electric text-ink-0"
                                      : "border-white/25",
                                  )}
                                >
                                  {active && <Check className="h-3 w-3" />}
                                </span>
                              </div>
                            </div>

                            {active && (
                              <div className="mt-4 grid gap-1.5 border-t border-white/8 pt-4">
                                {p.includes.map((line) => (
                                  <p
                                    key={line}
                                    className="flex items-start gap-2 text-xs text-bone/75"
                                  >
                                    <Check className="mt-0.5 h-3 w-3 flex-shrink-0 text-electric" />
                                    {line}
                                  </p>
                                ))}
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </Step>
                )}

                {/* Contact + project details */}
                <Step
                  number={mode === "project" ? "03" : "02"}
                  title="Your details"
                >
                  <div className="grid gap-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field
                        label="Full name"
                        value={contact.name}
                        onChange={(v) => updateContact("name", v)}
                        required
                        placeholder="Caleb Gathu"
                      />
                      <Field
                        label="Email"
                        type="email"
                        value={contact.email}
                        onChange={(v) => updateContact("email", v)}
                        required
                        placeholder="you@company.com"
                      />
                      <Field
                        label="Business name"
                        value={contact.businessName}
                        onChange={(v) => updateContact("businessName", v)}
                        required
                        placeholder="Acme Co."
                      />
                      <Field
                        label="Current website (if any)"
                        value={contact.currentUrl}
                        onChange={(v) => updateContact("currentUrl", v)}
                        placeholder="https://yourbusiness.com"
                      />
                    </div>

                    {mode === "project" && (
                      <>
                        <ChipField
                          label="Timeline"
                          value={contact.timeline}
                          options={TIMELINES}
                          onSelect={(v) => updateContact("timeline", v)}
                        />
                        <ChipField
                          label="Budget range"
                          value={contact.budget}
                          options={BUDGETS}
                          onSelect={(v) => updateContact("budget", v)}
                        />
                      </>
                    )}

                    <ChipField
                      label="Best contact method"
                      value={contact.bestContactMethod}
                      options={CONTACT_METHODS}
                      onSelect={(v) =>
                        updateContact("bestContactMethod", v)
                      }
                    />

                    <div className="space-y-2">
                      <label className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
                        Project notes (optional)
                      </label>
                      <textarea
                        value={contact.projectNotes}
                        onChange={(e) =>
                          updateContact("projectNotes", e.target.value)
                        }
                        rows={4}
                        placeholder="Anything we should know before kickoff…"
                        className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-bone placeholder:text-mute focus:border-electric/60 focus:outline-none"
                      />
                    </div>
                  </div>
                </Step>
              </div>

              {/* ───────── RIGHT COLUMN — sticky summary ───────── */}
              <aside className="md:col-span-5">
                <div className="sticky top-28 space-y-5 rounded-3xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-md">
                  <div className="space-y-1.5">
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
                      / Order summary
                    </p>
                    {mode === "project" ? (
                      <>
                        <h2 className="font-display text-2xl tracking-tight text-bone">
                          {pkg.name}
                        </h2>
                        {pkg.timeline && (
                          <p className="text-xs text-mute">
                            Timeline: {pkg.timeline}
                          </p>
                        )}
                      </>
                    ) : (
                      <>
                        <h2 className="font-display text-2xl tracking-tight text-bone">
                          {carePlan.name}
                        </h2>
                        <p className="text-xs text-mute">
                          Renews monthly until canceled
                        </p>
                      </>
                    )}
                  </div>

                  <div className="h-px w-full bg-white/8" />

                  {/* PROJECT line items */}
                  {mode === "project" && (
                    <>
                      <div className="space-y-2.5 text-sm">
                        <Line
                          label={`${pkg.name} ${
                            pkg.chargeMode === "oneTime" ? "(pay in full)" : "(deposit)"
                          }`}
                          value={formatUsd(pkg.depositUsd)}
                        />
                        {selectedAddonObjs.map((a) => (
                          <Line
                            key={a.key}
                            label={a.name}
                            value={`+${formatUsd(a.priceUsd)}`}
                            muted
                          />
                        ))}
                      </div>

                      <div className="h-px w-full bg-white/8" />

                      <div className="space-y-2 text-sm">
                        <div className="flex items-baseline justify-between pt-1">
                          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
                            Due today
                          </span>
                          <span className="font-display text-3xl tracking-tight text-electric">
                            {formatUsd(totals.dueTodayUsd)}
                          </span>
                        </div>

                        {pkg.chargeMode === "deposit" && (
                          <Line
                            label="Remaining before launch"
                            value={
                              totals.customRemaining
                                ? "Custom (after scope)"
                                : formatUsd(totals.remainingUsd)
                            }
                            muted
                          />
                        )}

                        {pkg.chargeMode === "deposit" && !totals.customRemaining && (
                          <Line
                            label="Estimated full total"
                            value={formatUsd(totals.estimatedTotalUsd)}
                            muted
                          />
                        )}
                      </div>
                    </>
                  )}

                  {/* SUBSCRIPTION line items */}
                  {mode === "subscription" && (
                    <>
                      <div className="space-y-2.5 text-sm">
                        <Line
                          label={carePlan.name}
                          value={`${formatUsd(carePlan.monthlyUsd)} / mo`}
                        />
                      </div>
                      <div className="h-px w-full bg-white/8" />
                      <div className="flex items-baseline justify-between pt-1">
                        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
                          Charged today
                        </span>
                        <span className="font-display text-3xl tracking-tight text-electric">
                          {formatUsd(carePlan.monthlyUsd)}
                        </span>
                      </div>
                      <p className="text-[11px] text-mute">
                        Subscription renews monthly. Cancel anytime before the
                        next billing date.
                      </p>
                    </>
                  )}

                  {/* CTA + error */}
                  <div className="space-y-3 pt-2">
                    {error && (
                      <p className="flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/[0.06] px-3 py-2 text-xs text-red-300">
                        <AlertCircle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
                        <span>{error}</span>
                      </p>
                    )}

                    <MagneticButton
                      type="submit"
                      variant="electric"
                      loading={submitting}
                      disabled={submitted || !requiredOk}
                      className="group w-full justify-center px-6 py-4 text-sm font-semibold"
                    >
                      {submitted ? (
                        <>
                          <Check className="h-4 w-4" /> Redirecting…
                        </>
                      ) : (
                        <>
                          {payButtonLabel}
                          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                        </>
                      )}
                    </MagneticButton>

                    {!requiredOk && (
                      <p className="text-center text-[11px] text-mute">
                        Enter your name, email, and business name before
                        checkout.
                      </p>
                    )}

                    <p className="text-center text-[10px] font-mono uppercase tracking-[0.18em] text-mute">
                      Powered by Stripe · Secure 256-bit TLS
                    </p>
                  </div>

                  {/* Legal notes */}
                  <div className="space-y-2 rounded-2xl border border-white/8 bg-ink-0/40 p-4 text-[11px] text-mute">
                    {mode === "project" && pkg.chargeMode === "deposit" && (
                      <p>
                        <span className="text-bone/80">Deposit:</span>{" "}
                        Secures your project slot and starts planning + design.
                        Remaining balance is due before launch.
                      </p>
                    )}
                    {mode === "project" && addons.length > 0 && (
                      <p>
                        <span className="text-bone/80">Add-ons:</span>{" "}
                        Apply to the current project scope. Additional
                        complexity may require a revised quote before
                        development begins.
                      </p>
                    )}
                    {mode === "project" && pkg.key === "businessSystem" && (
                      <p>
                        <span className="text-bone/80">Business System:</span>{" "}
                        Final scope may require additional quoting. WebLogic
                        sends a written proposal before development continues.
                      </p>
                    )}
                    {mode === "subscription" && (
                      <p>
                        <span className="text-bone/80">Monthly plan:</span>{" "}
                        Renews automatically. Cancel before the next billing
                        cycle to stop charges. Support scope depends on the
                        selected plan.
                      </p>
                    )}
                    <p>
                      Refundable within 7 days. Email{" "}
                      <a
                        href="mailto:caleb@weblogic.digital"
                        className="text-electric"
                      >
                        caleb@weblogic.digital
                      </a>{" "}
                      for any billing question.
                    </p>
                  </div>
                </div>

                {/* Cross-sell hint (project → care plan) */}
                {mode === "project" && pkg.chargeMode === "deposit" && (
                  <div className="mt-4 flex items-start gap-3 rounded-2xl border border-electric/20 bg-electric/[0.04] p-4 text-sm">
                    <Plus className="mt-0.5 h-4 w-4 flex-shrink-0 text-electric" />
                    <div>
                      <p className="text-bone/85">
                        After your project ships, add{" "}
                        <button
                          type="button"
                          onClick={() => setMode("subscription")}
                          className="text-electric underline-offset-2 hover:underline"
                        >
                          monthly care
                        </button>{" "}
                        to keep the site running, secure, and improving.
                      </p>
                    </div>
                  </div>
                )}
              </aside>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

/* ─────────────────────────── Subcomponents ─────────────────────────── */

function ModeTab({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "rounded-full px-5 py-2 text-xs font-mono uppercase tracking-[0.18em] transition",
        active
          ? "bg-electric text-ink-0"
          : "text-mute hover:text-bone",
      )}
    >
      {children}
    </button>
  );
}

function Step({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-electric">
          / {number}
        </span>
        <h2 className="font-display text-xl tracking-tight text-bone md:text-2xl">
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
        {label} {required && <span className="text-electric">*</span>}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-bone placeholder:text-mute focus:border-electric/60 focus:outline-none"
      />
    </label>
  );
}

function ChipField({
  label,
  value,
  options,
  onSelect,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onSelect: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
        {label}
      </span>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const active = value === o;
          return (
            <button
              key={o}
              type="button"
              onClick={() => onSelect(active ? "" : o)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs transition",
                active
                  ? "border-electric bg-electric/15 text-electric"
                  : "border-white/10 text-bone/70 hover:border-white/25 hover:text-bone",
              )}
            >
              {active && <X className="mr-1 inline h-3 w-3" />}
              {o}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Line({
  label,
  value,
  muted,
}: {
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span
        className={cn(
          "truncate",
          muted ? "text-bone/65" : "text-bone",
        )}
      >
        {label}
      </span>
      <span
        className={cn(
          "flex-shrink-0 font-mono text-xs",
          muted ? "text-bone/65" : "text-bone",
        )}
      >
        {value}
      </span>
    </div>
  );
}
