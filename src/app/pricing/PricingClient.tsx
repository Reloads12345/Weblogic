"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Check, ChevronDown, Minus } from "lucide-react";
import Header from "@/components/nav/Header";
import Footer from "@/components/sections/Footer";
import MagneticButton from "@/components/ui/MagneticButton";
import { useLeadModal } from "@/components/ui/LeadModalProvider";

/**
 * Each tier carries a `planId` that maps 1:1 to /checkout?plan=<id>. The
 * checkout page reads that param and pre-selects the plan, so a user can
 * skip the lead form entirely and reserve their build slot directly.
 *
 * The "Get a Quote" CTA stays exactly as-is per the brief — we just add an
 * additional primary "Reserve build slot →" link above it.
 */
const TIERS = [
  {
    planId: "starter",
    name: "Starter Website",
    price: "from $750",
    timeline: "2 weeks",
    forWho: "Service businesses, creators, local shops with a basic site or none at all.",
    outcome: "A fast, modern, mobile-first site that captures leads and looks credible.",
    includes: [
      "Up to 6 custom-designed pages",
      "Mobile-first responsive layout",
      "Lead capture form + email automation (Resend)",
      "Basic SEO setup + sitemap",
      "Analytics (GA4 or Plausible)",
      "Hosting on Vercel + custom domain",
      "1-week post-launch support",
    ],
    excludes: [
      "Custom client portal or dashboard",
      "Stripe / payment system",
      "Custom CMS (uses headless or Markdown)",
    ],
    cta: "Get a Quote",
  },
  {
    planId: "growth",
    name: "Growth Website",
    price: "from $1,500",
    timeline: "3–4 weeks",
    forWho: "Businesses with a real funnel — leads → sales → revenue. PLG sites, agencies, ecommerce brands.",
    outcome: "A conversion-tuned marketing engine with analytics, A/B testing, and a CMS you'll actually use.",
    includes: [
      "Everything in Starter",
      "8–12 pages with custom design + animation",
      "Headless CMS setup (Sanity, Storyblok, or Contentful)",
      "Advanced SEO + structured data (schema.org)",
      "Conversion-rate optimization (A/B testing harness)",
      "Blog + content publishing flow",
      "30 days of post-launch support",
    ],
    excludes: [
      "Custom client portal",
      "Stripe / booking systems",
    ],
    cta: "Get a Quote",
    accent: true,
  },
  {
    planId: "business",
    name: "Business System",
    price: "from $3,000",
    timeline: "4–8 weeks",
    forWho: "Businesses that need software, not a brochure. Client portals, payment systems, booking flows, custom admin tools.",
    outcome: "A real digital product that runs part of your business — authentication, payments, dashboards, automation.",
    includes: [
      "Everything in Growth",
      "Authenticated client portal (Supabase Auth)",
      "Role-based access control (admin / client)",
      "Stripe payments (one-time, subscription, deposit + balance)",
      "Custom admin dashboard",
      "Booking system (Cal.com or custom)",
      "Email + CRM automation workflows",
      "60 days of post-launch support",
    ],
    excludes: [],
    cta: "Get a Quote",
  },
] as const;

/**
 * Recurring subscription plans — "WebLogic Care Plans". These power the
 * post-launch revenue side of the business: maintenance, optimization,
 * and ongoing development for clients whose sites/systems are already
 * live. Each plan stacks: Growth inherits Essential, Systems inherits
 * Growth, Custom Retainer is a separate strategic engagement.
 */
const CARE_PLANS = [
  {
    id: "essential",
    name: "Essential Care",
    price: "$75",
    cadence: "/mo",
    tagline: "For basic website upkeep.",
    bestFor:
      "Small business websites, landing pages, and simple service websites.",
    includes: [
      "Hosting support",
      "Security checks",
      "Minor content edits",
      "Monthly backups",
      "Uptime monitoring",
      "Basic performance checks",
      "Email/form testing",
    ],
    cta: "Add Essential Care",
  },
  {
    id: "growth",
    name: "Growth Care",
    price: "$150",
    cadence: "/mo",
    tagline: "For businesses that want ongoing improvement.",
    bestFor:
      "Businesses that depend on their site for leads, bookings, quotes, or sales.",
    inherits: "Essential",
    includes: [
      "SEO updates",
      "Monthly analytics report",
      "Conversion recommendations",
      "Speed checks",
      "Homepage/service page improvements",
      "Lead form testing",
      "CTA and content adjustments",
    ],
    cta: "Add Growth Care",
    accent: true,
  },
  {
    id: "systems",
    name: "Systems Care",
    price: "$250+",
    cadence: "/mo",
    tagline:
      "For clients with portals, payments, automations, dashboards, or custom systems.",
    bestFor: "Clients with business systems beyond a simple website.",
    inherits: "Growth",
    includes: [
      "Stripe/payment flow checks",
      "Automation monitoring",
      "Dashboard support",
      "Client portal support",
      "Workflow updates",
      "Priority bug fixes",
      "Monthly system health report",
      "Integration checks",
    ],
    cta: "Add Systems Care",
  },
  {
    id: "retainer",
    name: "Custom Retainer",
    price: "$500+",
    cadence: "/mo",
    tagline:
      "For clients who need ongoing development and strategic support.",
    bestFor:
      "Growing businesses that need WebLogic as an ongoing web/system partner.",
    includes: [
      "Monthly development hours",
      "Feature additions",
      "Priority support",
      "Strategy calls",
      "Performance improvements",
      "New landing pages",
      "Automation expansion",
      "Advanced integrations",
      "A/B testing support (when applicable)",
    ],
    cta: "Request Custom Retainer",
  },
] as const;

/**
 * Specialty builds we'll quote on request but DON'T showcase as primary
 * pricing — they distract from WebLogic's main offer (websites, portals,
 * checkout flows, automations). Rendered in a collapsed disclosure.
 */
const CUSTOM_BUILDS = [
  "Discord bot development",
  "Custom automations",
  "App development",
  "DevOps support",
  "Cloud / security support",
  "SaaS support",
  "Server / hosting consulting",
];

const ADDONS = [
  { name: "Additional landing pages", price: "$150–$300 per page" },
  { name: "Stripe subscription billing", price: "from $500" },
  { name: "CRM integration (HubSpot / Salesforce / Pipedrive)", price: "from $400" },
  { name: "Custom email automation (Resend + Server Actions)", price: "from $300" },
  { name: "Booking system (Cal.com integration)", price: "from $250" },
  { name: "Performance overhaul (LCP / CLS / INP)", price: "from $400" },
  { name: "SEO content audit + optimization (10 pages)", price: "from $600" },
  { name: "Migration off WordPress / Webflow / Squarespace", price: "from $800" },
];

export default function PricingClient() {
  const { open } = useLeadModal();
  const [showCustom, setShowCustom] = useState(false);

  return (
    <>
      <Header />
      <main className="bg-ink-0">
        {/* Hero */}
        <section className="border-b border-white/5 pt-32 md:pt-40 pb-20 md:pb-24">
          <div className="container-pad max-w-4xl">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute"
            >
              / Pricing
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 max-w-[20ch] text-balance font-display text-display-xl leading-[0.92] tracking-tightest text-bone"
            >
              Transparent pricing.{" "}
              <span className="text-mute">No hourly surprises.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="mt-7 max-w-2xl text-pretty text-mute md:text-xl"
            >
              Every WebLogic project ships on a fixed quote. Pick a tier below or
              ask for a custom scope — we'll send a written plan and a fixed price
              within 24 hours.
            </motion.p>

            {/* Quick checkout shortcut — visible from the very top of the page
                for users who already know which tier they want and don't need
                a written quote first. */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-bone/80"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
                Already decided?
              </span>
              <Link
                href="/checkout?plan=starter"
                className="inline-flex items-center gap-1.5 text-electric underline-offset-4 transition hover:underline"
              >
                Reserve Starter
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
              <span className="text-mute">·</span>
              <Link
                href="/checkout?plan=growth"
                className="inline-flex items-center gap-1.5 text-electric underline-offset-4 transition hover:underline"
              >
                Reserve Growth
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
              <span className="text-mute">·</span>
              <Link
                href="/checkout?plan=business"
                className="inline-flex items-center gap-1.5 text-electric underline-offset-4 transition hover:underline"
              >
                Reserve Business System
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Tiers */}
        <section className="border-b border-white/5 py-20 md:py-28">
          <div className="container-pad">
            <ul className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              {TIERS.map((t, i) => (
                <motion.li
                  key={t.name}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.65, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  className={`relative flex flex-col rounded-3xl border p-7 md:p-8 ${
                    "accent" in t && t.accent
                      ? "border-electric/40 bg-electric/5"
                      : "border-white/10 bg-ink-0"
                  }`}
                >
                  {"accent" in t && t.accent && (
                    <span className="absolute -top-2.5 left-7 rounded-full bg-electric px-2 py-0.5 text-[9px] font-mono uppercase tracking-widest text-white">
                      Most popular
                    </span>
                  )}
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
                    {t.timeline}
                  </p>
                  <h2 className="mt-3 font-display text-2xl leading-tight tracking-tightest text-bone md:text-3xl">
                    {t.name}
                  </h2>
                  <p className="mt-2 text-bone/85">
                    <span className="font-display text-2xl text-electric">{t.price}</span>
                  </p>
                  <p className="mt-3 text-sm text-mute">
                    <span className="text-bone">For:</span> {t.forWho}
                  </p>
                  <p className="mt-2 text-sm text-mute">
                    <span className="text-bone">Outcome:</span> {t.outcome}
                  </p>

                  <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.22em] text-electric">
                    Includes
                  </p>
                  <ul className="mt-3 space-y-2 text-sm text-bone/85">
                    {t.includes.map((line) => (
                      <li key={line} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-electric" />
                        {line}
                      </li>
                    ))}
                  </ul>

                  {t.excludes.length > 0 && (
                    <>
                      <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
                        Not included
                      </p>
                      <ul className="mt-3 space-y-2 text-sm text-mute">
                        {t.excludes.map((line) => (
                          <li key={line} className="flex items-start gap-2">
                            <Minus className="mt-0.5 h-4 w-4 shrink-0 text-white/30" />
                            {line}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}

                  {/* Dual CTAs:
                       1. Primary  → /checkout?plan=<id>   (immediate checkout, skips the lead form)
                       2. Secondary → "Get a Quote"         (unchanged — opens the lead modal)
                       The "Get a Quote" copy + behavior stays exactly the
                       same per the brief; we just add a way to skip ahead. */}
                  <div className="mt-8 flex flex-col gap-2">
                    <Link
                      href={`/checkout?plan=${t.planId}`}
                      className="btn-electric w-full justify-center !py-3"
                      aria-label={`Reserve a ${t.name} build slot — go to checkout`}
                    >
                      Reserve build slot
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => open(`Pricing · ${t.name}`)}
                      className="btn-ghost w-full justify-center !py-3 text-sm"
                    >
                      {t.cta}
                    </button>
                  </div>
                </motion.li>
              ))}
            </ul>

            {/* Honesty banner — sets expectations for both paths */}
            <p className="mt-10 text-center text-xs text-mute">
              Reserve to lock in your start date with a 50% deposit (refundable
              within 7 days). Prefer a written plan first? Get a quote — we
              reply within 24 hours.
            </p>
          </div>
        </section>

        {/* WebLogic Care Plans — 4 recurring subscriptions */}
        <section
          id="care-plans"
          aria-labelledby="care-plans-heading"
          className="border-b border-white/5 py-20 md:py-28"
        >
          <div className="container-pad">
            <div className="max-w-3xl">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
                / Recurring
              </p>
              <h2
                id="care-plans-heading"
                className="mt-5 font-display text-display-md tracking-tightest text-bone md:text-display-lg"
              >
                WebLogic Care Plans
              </h2>
              <p className="mt-5 max-w-2xl text-pretty text-mute md:text-lg">
                Ongoing support, maintenance, optimization, and system
                monitoring for websites and digital systems after launch.
              </p>
            </div>

            <ul className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              {CARE_PLANS.map((plan, i) => (
                <motion.li
                  key={plan.id}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{
                    duration: 0.6,
                    delay: i * 0.05,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={`relative flex flex-col rounded-3xl border p-6 md:p-7 ${
                    "accent" in plan && plan.accent
                      ? "border-electric/40 bg-electric/5"
                      : "border-white/10 bg-ink-0"
                  }`}
                >
                  {"accent" in plan && plan.accent && (
                    <span className="absolute -top-2.5 left-6 rounded-full bg-electric px-2 py-0.5 text-[9px] font-mono uppercase tracking-widest text-white">
                      Most chosen
                    </span>
                  )}

                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
                    / {plan.id}
                  </p>

                  <h3 className="mt-3 font-display text-xl leading-tight tracking-tightest text-bone md:text-2xl">
                    {plan.name}
                  </h3>

                  <p className="mt-3 flex items-baseline gap-1">
                    <span className="font-display text-3xl text-electric md:text-4xl">
                      {plan.price}
                    </span>
                    <span className="font-mono text-xs text-mute">
                      {plan.cadence}
                    </span>
                  </p>

                  <p className="mt-3 text-sm text-bone/85">{plan.tagline}</p>

                  {"inherits" in plan && plan.inherits && (
                    <p className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-full border border-electric/25 bg-electric/[0.06] px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.16em] text-electric">
                      Everything in {plan.inherits}, plus
                    </p>
                  )}

                  <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.22em] text-electric">
                    Includes
                  </p>
                  <ul className="mt-3 space-y-2 text-sm text-bone/85">
                    {plan.includes.map((line) => (
                      <li key={line} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-electric" />
                        {line}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 border-t border-white/8 pt-4">
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
                      Best for
                    </p>
                    <p className="mt-2 text-xs text-mute">{plan.bestFor}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => open(`Pricing · ${plan.name}`)}
                    className="btn-electric mt-6 w-full justify-center !py-3 text-sm"
                  >
                    {plan.cta}
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                </motion.li>
              ))}
            </ul>

            <p className="mt-8 max-w-3xl text-sm text-mute">
              Custom support plans are available for larger websites, portals,
              automation systems, and advanced builds.{" "}
              <button
                type="button"
                onClick={() => open("Pricing · Custom support plan")}
                className="text-electric underline-offset-2 transition hover:underline"
              >
                Request a custom support quote
              </button>
              .
            </p>
          </div>
        </section>

        {/* Custom Technical Builds — secondary, collapsed by default */}
        <section
          id="custom-builds"
          aria-labelledby="custom-builds-heading"
          className="border-b border-white/5 py-16 md:py-20"
        >
          <div className="container-pad max-w-4xl">
            <button
              type="button"
              onClick={() => setShowCustom((v) => !v)}
              aria-expanded={showCustom}
              aria-controls="custom-builds-list"
              className="group flex w-full items-center justify-between gap-4 rounded-2xl border border-white/10 bg-ink-0 px-6 py-5 text-left transition hover:border-white/25 md:px-8 md:py-6"
            >
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
                  / By request
                </p>
                <h2
                  id="custom-builds-heading"
                  className="mt-2 font-display text-xl tracking-tight text-bone md:text-2xl"
                >
                  Custom Technical Builds Available by Request
                </h2>
                <p className="mt-2 max-w-2xl text-sm text-mute">
                  These aren't part of the public catalog. WebLogic still takes
                  them on for the right engagement — ask for a custom quote.
                </p>
              </div>
              <ChevronDown
                className={`h-5 w-5 shrink-0 text-bone/70 transition-transform duration-300 ${
                  showCustom ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence initial={false}>
              {showCustom && (
                <motion.div
                  key="custom-builds-panel"
                  id="custom-builds-list"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <ul className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-2">
                    {CUSTOM_BUILDS.map((label) => (
                      <li
                        key={label}
                        className="flex items-center justify-between gap-4 rounded-xl border border-white/8 bg-ink-0 px-5 py-4"
                      >
                        <span className="text-sm text-bone/85">{label}</span>
                        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
                          By quote
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        open("Pricing · Custom technical build request")
                      }
                      className="btn-electric text-sm !py-3"
                    >
                      Request a custom quote
                      <ArrowUpRight className="h-4 w-4" />
                    </button>
                    <p className="text-xs text-mute">
                      24-hour written reply · no obligation
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Add-ons */}
        <section className="border-b border-white/5 py-20 md:py-28">
          <div className="container-pad max-w-4xl">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
              / Add-ons
            </p>
            <h2 className="mt-5 font-display text-display-md tracking-tightest text-bone">
              Bolt anything on.
            </h2>
            <p className="mt-3 max-w-2xl text-mute">
              Add-ons can be combined with any tier above. Pricing scales with
              scope — final price locked in the written quote.
            </p>

            <ul className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/8 md:grid-cols-2">
              {ADDONS.map((a) => (
                <li
                  key={a.name}
                  className="flex items-center justify-between gap-4 bg-ink-0 p-5"
                >
                  <span className="text-sm text-bone">{a.name}</span>
                  <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.22em] text-electric">
                    {a.price}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Payment terms */}
        <section className="border-b border-white/5 py-20 md:py-28">
          <div className="container-pad grid gap-10 md:grid-cols-12">
            <div className="md:col-span-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
                / How payment works
              </p>
              <h2 className="mt-5 font-display text-display-md tracking-tightest text-bone">
                Fixed quotes.<br />
                Milestone billing.<br />
                <span className="text-mute">No surprises.</span>
              </h2>
            </div>
            <ul className="md:col-span-7 space-y-3">
              <Term
                title="50% deposit to lock in your start date"
                body="Reserve a build slot directly via /checkout — or get a quote first. Either way the deposit secures the slot and is refundable within 7 days."
              />
              <Term
                title="Milestone billing every 2 weeks"
                body="You pay as we ship. Each milestone has a clear deliverable and a written check-in."
              />
              <Term
                title="Final payment on launch"
                body="Pay the balance when the site goes live. WebLogic Care (if added) starts the day after launch."
              />
              <Term
                title="Net-30 available"
                body="For established businesses or recurring engagements, Net-30 payment terms are available on request."
              />
            </ul>
          </div>
        </section>

        {/* Final CTA */}
        <section className="border-b border-white/5 py-20 md:py-28">
          <div className="container-pad text-center">
            <h2 className="mx-auto max-w-[20ch] text-balance font-display text-display-md tracking-tightest text-bone md:text-display-lg">
              Not sure which tier?
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-pretty text-mute md:text-lg">
              Book the free 24-hour audit. We'll send back a written plan with the
              right tier, scope, and fixed price for your business.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <MagneticButton
                variant="electric"
                cursorMode="cta"
                onClick={() => open("Pricing · Bottom CTA")}
                className="!px-7 !py-3.5"
              >
                Book a Free Audit
                <ArrowUpRight className="h-4 w-4" />
              </MagneticButton>
              <Link
                href="/checkout?plan=growth"
                className="inline-flex items-center gap-2 rounded-full border border-white/12 px-7 py-3.5 text-sm text-bone transition-all duration-300 hover:border-electric/40 hover:bg-electric/[0.04] hover:text-electric"
              >
                Reserve a slot now
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full border border-white/12 px-7 py-3.5 text-sm text-bone transition-all duration-300 hover:border-white/30"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to home
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}

function Term({ title, body }: { title: string; body: string }) {
  return (
    <li className="rounded-xl border border-white/10 bg-ink-0 p-5">
      <p className="font-display text-lg tracking-tight text-bone">{title}</p>
      <p className="mt-2 text-sm text-mute">{body}</p>
    </li>
  );
}
