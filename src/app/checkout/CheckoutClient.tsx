"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Lock, ShieldCheck, Sparkles, Check } from "lucide-react";
import Header from "@/components/nav/Header";
import Footer from "@/components/sections/Footer";
import MagneticButton from "@/components/ui/MagneticButton";
import { cn } from "@/lib/utils";

type Tier = {
  id: string;
  name: string;
  price: number; // base USD
  timeline: string;
  blurb: string;
  includes: string[];
};

const TIERS: Tier[] = [
  {
    id: "starter",
    name: "Starter Website",
    price: 750,
    timeline: "2 weeks",
    blurb: "Up to 6 pages. Fast, mobile-first, lead-ready.",
    includes: [
      "6 custom-designed pages",
      "Lead capture + email automation",
      "Hosting on Vercel + custom domain",
      "1 week post-launch support",
    ],
  },
  {
    id: "growth",
    name: "Growth Website",
    price: 1500,
    timeline: "3–4 weeks",
    blurb: "8–12 pages with CMS + CRO + analytics.",
    includes: [
      "Everything in Starter",
      "8–12 pages with custom design + motion",
      "Headless CMS (Sanity / Storyblok)",
      "Conversion-rate optimization harness",
      "30 days post-launch support",
    ],
  },
  {
    id: "business",
    name: "Business System",
    price: 3000,
    timeline: "4–8 weeks",
    blurb: "Real product: auth, payments, portals, admin tools.",
    includes: [
      "Everything in Growth",
      "Authenticated client portal (Supabase Auth)",
      "Stripe payments + subscriptions",
      "Custom admin dashboard",
      "60 days post-launch support",
    ],
  },
];

const ADDONS = [
  { id: "care", name: "WebLogic Care (3 months)", price: 225 },
  { id: "seo", name: "SEO content audit + opt. (10 pages)", price: 600 },
  { id: "cro", name: "Performance overhaul (LCP / CLS / INP)", price: 400 },
  { id: "migration", name: "Migration off WordPress / Webflow", price: 800 },
];

function formatUsd(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function CheckoutClient() {
  const params = useSearchParams();
  const router = useRouter();
  const initialPlan = (params.get("plan") ?? "growth").toLowerCase();
  const wasCanceled = params.get("canceled") === "1";

  const [tierId, setTierId] = useState<string>(
    TIERS.find((t) => t.id === initialPlan)?.id ?? "growth",
  );
  const [addons, setAddons] = useState<string[]>([]);
  const [contact, setContact] = useState({
    name: "",
    email: "",
    company: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tier = useMemo(
    () => TIERS.find((t) => t.id === tierId) ?? TIERS[1],
    [tierId],
  );

  const addonTotal = useMemo(
    () =>
      addons.reduce(
        (sum, id) => sum + (ADDONS.find((a) => a.id === id)?.price ?? 0),
        0,
      ),
    [addons],
  );

  const subtotal = tier.price + addonTotal;
  const deposit = Math.round(subtotal * 0.5);
  const balance = subtotal - deposit;

  // Keep URL in sync (shareable / re-openable) without spamming history.
  useEffect(() => {
    const next = new URL(window.location.href);
    next.searchParams.set("plan", tier.id);
    window.history.replaceState(null, "", next.toString());
  }, [tier.id]);

  const toggleAddon = (id: string) => {
    setAddons((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id],
    );
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact.name || !contact.email) return;
    setError(null);
    setSubmitting(true);

    try {
      // Call our /api/checkout route. If STRIPE_SECRET_KEY is set in env,
      // the server returns a real Stripe-hosted checkout URL; if not, it
      // returns a /thank-you placeholder URL. Either way we just redirect.
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tierId: tier.id,
          tierName: tier.name,
          subtotal,
          deposit,
          addons,
          contact,
        }),
      });

      const data = (await res.json()) as {
        redirectUrl?: string;
        error?: string;
      };

      if (!res.ok || !data.redirectUrl) {
        throw new Error(data.error ?? "Checkout failed.");
      }

      setSubmitted(true);
      // Hosted Stripe URLs need a full page navigation, not Next's router.
      window.location.href = data.redirectUrl;
    } catch (err) {
      setSubmitting(false);
      setError(
        err instanceof Error ? err.message : "Something went wrong. Try again.",
      );
    }
  };

  return (
    <>
      <Header />
      <main className="bg-ink-0">
        {/* Top eyebrow + back link */}
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
              Reserve your build slot.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="mt-5 max-w-[60ch] text-lg text-bone/70 md:text-xl"
            >
              Pay a 50% deposit to lock in your timeline. The balance is due at
              launch. Full refund within 7 days, no questions.
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
          </div>
        </section>

        {/* Form + summary */}
        <section className="border-b border-white/5 py-16 md:py-20">
          <div className="container-pad max-w-6xl">
            {wasCanceled && (
              <div className="mb-8 rounded-2xl border border-amber-500/30 bg-amber-500/[0.06] px-5 py-4 text-sm text-amber-200">
                You canceled the Stripe checkout. No charge was made — adjust
                your selection below and try again whenever you're ready.
              </div>
            )}
            <form onSubmit={onSubmit} className="grid gap-10 md:grid-cols-12">
              {/* Left — selection + contact */}
              <div className="space-y-12 md:col-span-7">
                {/* Step 1 — Plan */}
                <Step number="01" title="Choose your build">
                  <div className="grid gap-3">
                    {TIERS.map((t) => {
                      const active = t.id === tier.id;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setTierId(t.id)}
                          className={cn(
                            "group flex w-full items-start justify-between gap-4 rounded-2xl border p-5 text-left transition",
                            active
                              ? "border-electric/60 bg-electric/[0.06]"
                              : "border-white/10 bg-white/[0.02] hover:border-white/25 hover:bg-white/[0.04]",
                          )}
                        >
                          <div className="flex-1 space-y-1.5">
                            <div className="flex items-center gap-2">
                              <span className="font-display text-lg tracking-tight text-bone">
                                {t.name}
                              </span>
                              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
                                · {t.timeline}
                              </span>
                            </div>
                            <p className="text-sm text-bone/65">{t.blurb}</p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span
                              className={cn(
                                "font-display text-2xl tracking-tight",
                                active ? "text-electric" : "text-bone",
                              )}
                            >
                              {formatUsd(t.price)}
                            </span>
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
                        </button>
                      );
                    })}
                  </div>
                </Step>

                {/* Step 2 — Add-ons */}
                <Step number="02" title="Add-ons (optional)">
                  <div className="grid gap-2.5">
                    {ADDONS.map((a) => {
                      const active = addons.includes(a.id);
                      return (
                        <button
                          key={a.id}
                          type="button"
                          onClick={() => toggleAddon(a.id)}
                          className={cn(
                            "flex w-full items-center justify-between gap-4 rounded-xl border px-4 py-3 text-left text-sm transition",
                            active
                              ? "border-electric/60 bg-electric/[0.06] text-bone"
                              : "border-white/10 bg-white/[0.02] text-bone/85 hover:border-white/25",
                          )}
                        >
                          <span className="flex items-center gap-3">
                            <span
                              className={cn(
                                "flex h-4 w-4 items-center justify-center rounded border transition",
                                active
                                  ? "border-electric bg-electric text-ink-0"
                                  : "border-white/25",
                              )}
                            >
                              {active && <Check className="h-2.5 w-2.5" />}
                            </span>
                            {a.name}
                          </span>
                          <span
                            className={cn(
                              "font-mono text-xs",
                              active ? "text-electric" : "text-mute",
                            )}
                          >
                            +{formatUsd(a.price)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </Step>

                {/* Step 3 — Contact */}
                <Step number="03" title="Your details">
                  <div className="grid gap-4">
                    <Field
                      label="Name"
                      value={contact.name}
                      onChange={(v) => setContact({ ...contact, name: v })}
                      required
                      placeholder="Caleb Gathu"
                    />
                    <Field
                      label="Email"
                      type="email"
                      value={contact.email}
                      onChange={(v) => setContact({ ...contact, email: v })}
                      required
                      placeholder="you@company.com"
                    />
                    <Field
                      label="Company / project"
                      value={contact.company}
                      onChange={(v) => setContact({ ...contact, company: v })}
                      placeholder="Acme Co."
                    />
                    <div className="space-y-2">
                      <label className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
                        Anything we should know?
                      </label>
                      <textarea
                        value={contact.notes}
                        onChange={(e) =>
                          setContact({ ...contact, notes: e.target.value })
                        }
                        rows={4}
                        placeholder="Goals, deadlines, references…"
                        className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-bone placeholder:text-mute focus:border-electric/60 focus:outline-none"
                      />
                    </div>
                  </div>
                </Step>
              </div>

              {/* Right — summary (sticky on desktop) */}
              <aside className="md:col-span-5">
                <div className="sticky top-28 space-y-5 rounded-3xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-md">
                  <div className="space-y-1.5">
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
                      / Order summary
                    </p>
                    <h2 className="font-display text-2xl tracking-tight text-bone">
                      {tier.name}
                    </h2>
                    <p className="text-xs text-mute">
                      Timeline: {tier.timeline}
                    </p>
                  </div>

                  <div className="h-px w-full bg-white/8" />

                  {/* Line items */}
                  <div className="space-y-2.5 text-sm">
                    <Line label={tier.name} value={formatUsd(tier.price)} />
                    {addons.map((id) => {
                      const a = ADDONS.find((x) => x.id === id);
                      if (!a) return null;
                      return (
                        <Line
                          key={id}
                          label={a.name}
                          value={`+${formatUsd(a.price)}`}
                          muted
                        />
                      );
                    })}
                  </div>

                  <div className="h-px w-full bg-white/8" />

                  <div className="space-y-2 text-sm">
                    <Line
                      label="Subtotal"
                      value={formatUsd(subtotal)}
                      muted
                    />
                    <Line label="Balance at launch" value={formatUsd(balance)} muted />
                    <div className="flex items-baseline justify-between pt-2">
                      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
                        Due today (50%)
                      </span>
                      <span className="font-display text-3xl tracking-tight text-electric">
                        {formatUsd(deposit)}
                      </span>
                    </div>
                  </div>

                  {/* What you get */}
                  <div className="rounded-2xl border border-white/8 bg-ink-0/40 p-4">
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
                      / Included
                    </p>
                    <ul className="mt-2 space-y-1.5">
                      {tier.includes.slice(0, 4).map((line) => (
                        <li
                          key={line}
                          className="flex items-start gap-2 text-xs text-bone/75"
                        >
                          <Check className="mt-0.5 h-3 w-3 flex-shrink-0 text-electric" />
                          {line}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {error && (
                    <p className="rounded-xl border border-red-500/30 bg-red-500/[0.06] px-4 py-3 text-xs text-red-300">
                      {error}
                    </p>
                  )}

                  <MagneticButton
                    type="submit"
                    variant="electric"
                    loading={submitting}
                    disabled={submitted}
                    className="group w-full justify-center px-6 py-4 text-sm font-semibold"
                  >
                    {submitted ? (
                      <>
                        <Check className="h-4 w-4" /> Redirecting…
                      </>
                    ) : submitting ? (
                      <>Processing…</>
                    ) : (
                      <>
                        Reserve slot · {formatUsd(deposit)}
                        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                      </>
                    )}
                  </MagneticButton>

                  <p className="text-center text-[11px] text-mute">
                    Placeholder checkout. Stripe goes live once your project is
                    confirmed by email.
                  </p>
                </div>
              </aside>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </>
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
    <div className="space-y-2">
      <label className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
        {label} {required && <span className="text-electric">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-bone placeholder:text-mute focus:border-electric/60 focus:outline-none"
      />
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
      <span className={cn("truncate", muted ? "text-bone/65" : "text-bone")}>
        {label}
      </span>
      <span
        className={cn(
          "font-mono text-xs flex-shrink-0",
          muted ? "text-bone/65" : "text-bone",
        )}
      >
        {value}
      </span>
    </div>
  );
}
