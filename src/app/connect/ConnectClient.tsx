"use client";

import { useRef, useState, useTransition } from "react";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Clock,
  Gauge,
  Layers,
  MessageCircle,
  Play,
  Smartphone,
  Sparkles,
  Target,
} from "lucide-react";
import Header from "@/components/nav/Header";
import Footer from "@/components/sections/Footer";
import { useAssets } from "@/components/providers/AssetProvider";
import SocialIcon from "@/components/ui/SocialIcon";
import { submitLead } from "@/app/actions/lead";
import { BRAND, SOCIAL_LINKS } from "@/lib/data";
import { cn } from "@/lib/utils";

/* ────────────────────────────────────────────────────────────────────
   /connect — a single-purpose landing page for outreach + QR-code traffic.

   Performance notes:
     • Animated background is CSS-only (no JS rAF loops)
     • Hero copy renders immediately — no waiting for animations
     • Below-fold sections use `whileInView` with viewport once:true
     • No 3D, no Three.js — keeps mobile FCP tight
     • Mobile motion is auto-reduced by globals.css (250ms transition cap)
   ──────────────────────────────────────────────────────────────────── */

/* ───────────────────── Selected client work ─────────────────────
   These are real client sites the founder has built. The "Selected
   work" section links to them — no fake quotes, no fabricated metrics.
   ─────────────────────────────────────────────────────────────────── */
const CLIENT_SITES = [
  {
    url: "https://www.guildmind.app/",
    domain: "guildmind.app",
    name: "GuildMind",
    industry: "Productivity SaaS",
    accent: "from-violet-500/30 to-blue-500/20",
  },
  {
    url: "https://www.midlife.engineering/",
    domain: "midlife.engineering",
    name: "Midlife Engineering",
    industry: "Engineering studio",
    accent: "from-cyan-500/25 to-blue-500/15",
  },
  {
    url: "https://opalcamera.com/",
    domain: "opalcamera.com",
    name: "Opal",
    industry: "Hardware",
    accent: "from-rose-500/25 to-amber-500/15",
  },
  {
    url: "https://missioncontrol.co/",
    domain: "missioncontrol.co",
    name: "Mission Control",
    industry: "Ops platform",
    accent: "from-sky-500/25 to-indigo-500/15",
  },
  {
    url: "https://www.hut8.com/",
    domain: "hut8.com",
    name: "Hut 8",
    industry: "Energy infrastructure",
    accent: "from-emerald-500/25 to-teal-500/15",
  },
  {
    url: "https://drip.mdxpreview.xyz/",
    domain: "drip.mdxpreview.xyz",
    name: "Drip",
    industry: "Email automation",
    accent: "from-fuchsia-500/25 to-pink-500/15",
  },
  {
    url: "https://pfenergy.eu/",
    domain: "pfenergy.eu",
    name: "PF Energy",
    industry: "Renewable energy",
    accent: "from-lime-500/25 to-emerald-500/15",
  },
  {
    url: "https://buttermax.net/",
    domain: "buttermax.net",
    name: "ButterMax",
    industry: "Creator platform",
    accent: "from-amber-500/25 to-orange-500/15",
  },
  {
    url: "https://explore.ownprimland.com/",
    domain: "explore.ownprimland.com",
    name: "Primland",
    industry: "Lifestyle / Real estate",
    accent: "from-stone-400/20 to-zinc-500/15",
  },
  {
    url: "https://terminal-industries.com/",
    domain: "terminal-industries.com",
    name: "Terminal Industries",
    industry: "AI / Industrial",
    accent: "from-blue-500/30 to-electric/20",
  },
] as const;

/* ───────────────────── Concept redesigns ─────────────────────
   Honest framing: these are *concept* redesigns showing the design
   approach. Labeled clearly. No client claim implied.
   ─────────────────────────────────────────────────────────────── */
const CONCEPT_REDESIGNS = [
  {
    id: "dentist",
    label: "Dental practice",
    headline: "From clinical clutter to calm conversion",
    improvements: [
      "Clear hierarchy + one primary CTA above the fold",
      "Trust signals surfaced (credentials, hours, parking)",
      "Mobile booking flow replaces phone-only contact",
      "Image pipeline cuts load time by ~3.5s on 4G",
    ],
  },
  {
    id: "gym",
    label: "Boutique gym",
    headline: "Membership funnel, not a brochure",
    improvements: [
      "Pricing tiers visible without scrolling",
      "Class schedule pulled into the homepage",
      "Trainer profiles humanize the brand",
      "Sticky CTA: 'Book a free trial class'",
    ],
  },
  {
    id: "medspa",
    label: "Med spa",
    headline: "Premium service, premium presentation",
    improvements: [
      "Editorial typography + generous whitespace",
      "Treatment galleries with before/after standards",
      "Inline lead form on every treatment page",
      "FAQ schema for SEO + trust",
    ],
  },
] as const;

/* ───────────────────── The page ───────────────────── */

export default function ConnectClient() {
  return (
    <>
      <Header />
      <main className="bg-ink-0 text-bone overflow-x-hidden">
        <Hero />
        <IntroVideo />
        <TransformationShowcase />
        <WhyWebLogic />
        <Showreel />
        <SelectedWork />
        <FounderStory />
        <AuditForm />
        <ContentSection />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}

/* ───────────────────────── 1. HERO ───────────────────────── */

function Hero() {
  return (
    <section
      id="connect-hero"
      className="relative isolate overflow-hidden pb-24 pt-40 md:pb-32 md:pt-48"
    >
      {/* Animated background — CSS-only. Three slow radial gradients
          drift across the canvas via @keyframes (defined inline below). */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-ink-0" />
        <div className="connect-orb connect-orb-a" />
        <div className="connect-orb connect-orb-b" />
        <div className="connect-orb connect-orb-c" />
        {/* Faint grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
        {/* Bottom fade so the hero blends into the next section */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-ink-0" />
      </div>

      <div className="container-pad relative z-10 mx-auto max-w-4xl text-center">
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-electric/30 bg-electric/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-electric"
        >
          <span className="relative inline-flex h-1.5 w-1.5">
            <span className="absolute inset-0 rounded-full bg-electric/55 animate-ping" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-electric" />
          </span>
          Now accepting U.S. projects
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 text-balance font-display text-display-lg leading-[0.95] tracking-tightest md:text-display-xl"
        >
          Modern websites for businesses{" "}
          <span className="text-mute">that want to grow.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mx-auto mt-7 max-w-2xl text-pretty text-lg text-bone/75 md:text-xl"
        >
          WebLogic builds high-performance websites, branding systems, and
          digital experiences designed to help businesses stand out and
          convert better online.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-9 flex flex-wrap items-center justify-center gap-3"
        >
          <a
            href="#audit-form"
            className="group inline-flex items-center gap-2 rounded-full bg-electric px-7 py-3.5 text-sm font-medium text-ink-0 transition hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,82,255,0.4)]"
          >
            Book a Free Audit
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </a>
          <a
            href="#transformations"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-7 py-3.5 text-sm text-bone transition hover:border-white/35 hover:bg-white/[0.06]"
          >
            View transformations
            <ArrowRight className="h-4 w-4" />
          </a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-6 text-[10px] font-mono uppercase tracking-[0.22em] text-mute"
        >
          24-hour reply · written plan + fixed quote · no obligation
        </motion.p>
      </div>

      {/* Inline CSS for the animated background orbs — CSS animation is
          GPU-accelerated and doesn't burn JS frames. */}
      <style>{`
        .connect-orb {
          position: absolute;
          border-radius: 9999px;
          filter: blur(80px);
          opacity: 0.5;
          mix-blend-mode: screen;
          will-change: transform;
        }
        .connect-orb-a {
          width: 50vw; height: 50vw;
          left: -10%; top: -10%;
          background: radial-gradient(circle, rgba(0,82,255,0.55), rgba(0,82,255,0) 70%);
          animation: connect-drift-a 28s ease-in-out infinite;
        }
        .connect-orb-b {
          width: 55vw; height: 55vw;
          right: -15%; top: 10%;
          background: radial-gradient(circle, rgba(140,60,240,0.40), rgba(140,60,240,0) 70%);
          animation: connect-drift-b 36s ease-in-out infinite;
        }
        .connect-orb-c {
          width: 60vw; height: 60vw;
          left: 20%; bottom: -25%;
          background: radial-gradient(circle, rgba(0,82,255,0.30), rgba(0,0,0,0) 70%);
          animation: connect-drift-c 44s ease-in-out infinite;
        }
        @keyframes connect-drift-a {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(8%, 6%); }
        }
        @keyframes connect-drift-b {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-10%, 8%); }
        }
        @keyframes connect-drift-c {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(5%, -8%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .connect-orb { animation: none; }
        }
      `}</style>
    </section>
  );
}

/* ───────────────────────── 2. INTRO VIDEO ───────────────────────── */

function IntroVideo() {
  const { getVideoUrl } = useAssets();
  const url = getVideoUrl("connect-intro-video");

  return (
    <section className="border-t border-white/5 py-16 md:py-24">
      <div className="container-pad mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="mb-8 text-center"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
            / 30-second intro
          </p>
          <h2 className="mt-3 font-display text-3xl tracking-tightest md:text-4xl">
            Meet the studio behind your next site.
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.985 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-ink-100/40"
        >
          <div className="relative aspect-video w-full">
            {url ? (
              <video
                src={url}
                muted
                playsInline
                controls
                preload="metadata"
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <VideoPlaceholder
                label="Intro video"
                hint="Upload to slot `connect-intro-video` via /admin"
              />
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ───────────────────────── 3. TRANSFORMATION SHOWCASE ───────────────────────── */

function TransformationShowcase() {
  return (
    <section
      id="transformations"
      className="border-t border-white/5 py-20 md:py-32"
    >
      <div className="container-pad mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7 }}
          className="mb-12 max-w-2xl"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-electric">
            / Transformations
          </p>
          <h2 className="mt-4 text-balance font-display text-display-md leading-[0.95] tracking-tightest md:text-display-lg">
            Outdated to modern,{" "}
            <span className="text-mute">in three weeks.</span>
          </h2>
          <p className="mt-5 text-bone/65 md:text-lg">
            Below: concept redesigns for industries we work with. Real client
            engagements ship under NDA — these are illustrative of the
            approach.
          </p>
        </motion.div>

        <div className="grid gap-6 md:gap-8">
          {CONCEPT_REDESIGNS.map((concept, i) => (
            <motion.div
              key={concept.id}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.65, delay: i * 0.05 }}
              className="overflow-hidden rounded-3xl border border-white/10 bg-ink-50/40"
            >
              <BeforeAfterSlider variant={concept.id} label={concept.label} />
              <div className="grid gap-6 p-6 md:grid-cols-12 md:gap-10 md:p-10">
                <div className="md:col-span-5">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-mute">
                    Concept redesign · {concept.label}
                  </span>
                  <h3 className="mt-3 font-display text-2xl leading-tight tracking-tight md:text-3xl">
                    {concept.headline}
                  </h3>
                </div>
                <ul className="space-y-2.5 text-sm text-bone/80 md:col-span-7 md:text-base">
                  {concept.improvements.map((imp) => (
                    <li key={imp} className="flex items-start gap-3">
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-electric" />
                      <span>{imp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Lightweight before/after slider. Two stacked layers, a draggable
 * vertical divider, and a range input that handles all the pointer +
 * keyboard logic. No external dependencies.
 */
function BeforeAfterSlider({
  variant,
  label,
}: {
  variant: string;
  label: string;
}) {
  const [pct, setPct] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="relative aspect-[16/9] w-full overflow-hidden bg-ink-100 sm:aspect-[16/8] md:aspect-[16/7]"
    >
      {/* BEFORE layer — cluttered, dated styling */}
      <div className="absolute inset-0">
        <DatedMockup label={label} />
      </div>

      {/* AFTER layer — clipped from the right based on pct */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - pct}% 0 0)` }}
      >
        <ModernMockup label={label} variant={variant} />
      </div>

      {/* Divider line + handle */}
      <div
        className="absolute inset-y-0 z-10 w-px bg-electric shadow-[0_0_18px_rgba(0,82,255,0.55)]"
        style={{ left: `${pct}%` }}
      >
        <div className="absolute left-1/2 top-1/2 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-electric/40 bg-ink-0/85 shadow-[0_4px_20px_rgba(0,0,0,0.55)]">
          <span className="flex items-center gap-px text-electric">
            <span className="block h-2 w-px bg-current" />
            <span className="block h-3 w-px bg-current" />
            <span className="block h-2 w-px bg-current" />
          </span>
        </div>
      </div>

      {/* Labels in the corners */}
      <span className="absolute left-4 top-4 z-10 rounded-full border border-white/15 bg-ink-100/80 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-white/65 backdrop-blur">
        Before
      </span>
      <span className="absolute right-4 top-4 z-10 rounded-full border border-electric/40 bg-electric/15 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-electric backdrop-blur">
        After · WebLogic
      </span>

      {/* Range input — invisible but covers the full surface for drag */}
      <input
        type="range"
        min={0}
        max={100}
        value={pct}
        onChange={(e) => setPct(Number(e.target.value))}
        aria-label={`Compare before and after for ${label}`}
        className="absolute inset-0 z-20 m-0 h-full w-full cursor-ew-resize appearance-none bg-transparent opacity-0"
      />
    </div>
  );
}

function DatedMockup({ label }: { label: string }) {
  return (
    <div className="absolute inset-0 flex flex-col bg-[#1a1610] p-4 text-yellow-50/60 md:p-6">
      {/* Cramped header */}
      <div className="mb-2 flex items-center justify-between border-b border-yellow-100/15 pb-1.5">
        <span className="font-serif text-base font-bold text-yellow-100/80">
          {label}.com
        </span>
        <div className="flex items-center gap-1.5 text-[10px]">
          <span>Home</span>
          <span>·</span>
          <span>Services</span>
          <span>·</span>
          <span>About</span>
          <span>·</span>
          <span>Contact</span>
          <span>·</span>
          <span>FAQ</span>
        </div>
      </div>
      {/* Garish "hero" */}
      <div className="grid flex-1 grid-cols-3 gap-2">
        <div className="col-span-2 rounded-sm bg-yellow-100/[0.04] p-3">
          <p className="font-serif text-lg leading-tight text-yellow-100/85">
            WELCOME TO OUR WEBSITE!
          </p>
          <p className="mt-1 text-[9px] leading-tight">
            Best {label.toLowerCase()} services in town. Family-owned since
            1987. Call us today for a quote! We offer many services. Click here
            to learn more about our services.
          </p>
          <div className="mt-2 inline-block bg-red-700 px-2 py-0.5 text-[9px] text-yellow-100">
            CLICK HERE!!
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="h-12 rounded-sm bg-yellow-100/10" />
          <div className="h-12 rounded-sm bg-yellow-100/10" />
          <div className="h-6 rounded-sm bg-yellow-100/10" />
        </div>
      </div>
    </div>
  );
}

function ModernMockup({
  label,
  variant: _variant,
}: {
  label: string;
  variant: string;
}) {
  return (
    <div className="absolute inset-0 flex flex-col bg-ink-0 p-5 md:p-8">
      {/* Clean header */}
      <div className="flex items-center justify-between">
        <span className="font-display text-base font-semibold tracking-tight md:text-lg">
          {label}
        </span>
        <div className="hidden items-center gap-4 text-[10px] text-white/55 md:flex">
          <span>Services</span>
          <span>About</span>
          <span>Contact</span>
          <span className="rounded-full bg-electric px-3 py-1 text-ink-0">
            Book
          </span>
        </div>
      </div>
      {/* Modern hero */}
      <div className="mt-6 flex flex-1 flex-col justify-between gap-4 md:mt-10 md:flex-row md:items-end">
        <div className="max-w-md">
          <p className="font-mono text-[8px] uppercase tracking-[0.22em] text-electric">
            / Premium {label.toLowerCase()}
          </p>
          <p className="mt-2 font-display text-xl leading-[0.95] tracking-tightest md:text-3xl">
            Care that feels{" "}
            <span className="text-mute">unmistakably modern.</span>
          </p>
          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-electric px-3 py-1.5 text-[10px] font-medium text-ink-0">
            Book a visit →
          </div>
        </div>
        <div className="grid w-full grid-cols-3 gap-1.5 md:w-1/2">
          <div className="aspect-square rounded-lg bg-white/[0.04]" />
          <div className="aspect-square rounded-lg bg-white/[0.06]" />
          <div className="aspect-square rounded-lg bg-electric/15" />
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── 4. WHY WEBLOGIC ───────────────────────── */

const WHY_CARDS = [
  {
    icon: Layers,
    title: "Modern design",
    body: "We create visually modern websites built to feel premium and trustworthy — not template-driven, not generic.",
  },
  {
    icon: Smartphone,
    title: "Mobile-first",
    body: "Designed to perform beautifully across phones, tablets, and desktops. The majority of your traffic is on a phone.",
  },
  {
    icon: Target,
    title: "Conversion-focused",
    body: "Every layout decision works toward a measurable outcome — leads, bookings, sign-ups, or sales.",
  },
  {
    icon: MessageCircle,
    title: "Fast communication",
    body: "Direct replies, transparent updates, and a single point of contact from kickoff to launch.",
  },
] as const;

function WhyWebLogic() {
  return (
    <section className="border-t border-white/5 py-20 md:py-28">
      <div className="container-pad mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="mb-12 max-w-2xl"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-electric">
            / Why WebLogic
          </p>
          <h2 className="mt-4 text-balance font-display text-display-md leading-[0.95] tracking-tightest md:text-display-lg">
            Built to feel premium,{" "}
            <span className="text-mute">priced to be accessible.</span>
          </h2>
        </motion.div>

        <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {WHY_CARDS.map((c, i) => {
            const Icon = c.icon;
            return (
              <motion.li
                key={c.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.55, delay: i * 0.06 }}
                className="rounded-2xl border border-white/10 bg-ink-50/40 p-6 transition-colors hover:border-white/25"
              >
                <span className="grid h-10 w-10 place-items-center rounded-xl border border-electric/30 bg-electric/10 text-electric">
                  <Icon className="h-4 w-4" />
                </span>
                <h3 className="mt-5 font-display text-xl tracking-tight">
                  {c.title}
                </h3>
                <p className="mt-2 text-sm text-bone/70">{c.body}</p>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* ───────────────────────── 5. SHOWREEL ───────────────────────── */

function Showreel() {
  const { getVideoUrl } = useAssets();
  const url = getVideoUrl("connect-showreel");

  return (
    <section className="relative border-t border-white/5 py-20 md:py-28">
      <div className="container-pad mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-electric">
              / Studio reel
            </p>
            <h2 className="mt-3 max-w-xl text-balance font-display text-display-md leading-[0.95] tracking-tightest md:text-display-lg">
              Motion, branding, UI —{" "}
              <span className="text-mute">in 60 seconds.</span>
            </h2>
          </div>
          <p className="max-w-md text-sm text-bone/65 md:text-base">
            A condensed look at what we build: hero animations, scroll
            choreography, micro-interactions, and brand-led UI systems.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-ink-100/40"
        >
          <div className="relative aspect-video w-full">
            {url ? (
              <video
                src={url}
                muted
                loop
                playsInline
                autoPlay
                preload="metadata"
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <VideoPlaceholder
                label="Studio reel"
                hint="Upload to slot `connect-showreel` via /admin"
              />
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function VideoPlaceholder({ label, hint }: { label: string; hint?: string }) {
  return (
    <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-ink-100 via-ink-50 to-ink-0">
      <div className="absolute inset-0 opacity-30 [background:radial-gradient(60%_60%_at_50%_30%,rgba(0,82,255,0.25),rgba(0,0,0,0)_70%)]" />
      <div className="relative text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-white/15 bg-ink-0/60 backdrop-blur">
          <Play className="ml-1 h-5 w-5 text-bone/70" />
        </span>
        <p className="mt-4 font-display text-xl tracking-tight">{label}</p>
        <p className="mt-1 text-xs text-mute">In production</p>
        {hint && (
          <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.2em] text-white/30">
            {hint}
          </p>
        )}
      </div>
    </div>
  );
}

/* ───────────────────────── 6. SELECTED WORK ───────────────────────── */

function SelectedWork() {
  return (
    <section className="border-t border-white/5 py-20 md:py-28">
      <div className="container-pad mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-electric">
              / Selected work
            </p>
            <h2 className="mt-3 font-display text-display-md leading-[0.95] tracking-tightest md:text-display-lg">
              Live sites we&apos;ve shipped.
            </h2>
          </div>
          <p className="max-w-sm text-sm text-bone/65 md:text-right">
            Click any card to open the live site. Tap-friendly on mobile.
          </p>
        </motion.div>

        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {CLIENT_SITES.map((site, i) => (
            <motion.li
              key={site.url}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: Math.min(i * 0.03, 0.3) }}
            >
              <a
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-ink-50/40 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-electric/40"
              >
                {/* Gradient backdrop on hover */}
                <span
                  aria-hidden
                  className={cn(
                    "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100",
                    site.accent,
                  )}
                />

                {/* Monogram tile */}
                <div className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-ink-100/60">
                  <span
                    className={cn(
                      "absolute inset-0 bg-gradient-to-br opacity-60",
                      site.accent,
                    )}
                  />
                  <span className="relative font-display text-4xl font-semibold tracking-tightest text-bone md:text-5xl">
                    {site.name
                      .split(" ")
                      .map((w) => w[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </span>
                </div>

                {/* Card body */}
                <div className="relative mt-4 flex flex-1 flex-col">
                  <p className="font-display text-lg tracking-tight text-bone">
                    {site.name}
                  </p>
                  <p className="mt-1 text-xs text-mute">{site.industry}</p>
                  <div className="mt-auto flex items-center justify-between pt-4 text-xs">
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
                      {site.domain}
                    </span>
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/15 text-white/65 transition-all group-hover:border-electric group-hover:bg-electric group-hover:text-ink-0">
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </a>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ───────────────────────── 7. FOUNDER STORY ───────────────────────── */

function FounderStory() {
  const { getImageUrl } = useAssets();
  const photo = getImageUrl("founder-photo");

  return (
    <section className="border-t border-white/5 py-20 md:py-28">
      <div className="container-pad mx-auto max-w-5xl">
        <div className="grid items-center gap-10 md:grid-cols-12 md:gap-14">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="md:col-span-5"
          >
            <div className="relative aspect-square overflow-hidden rounded-3xl border border-white/10 bg-ink-50/40">
              {photo ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={photo}
                  alt="Caleb Gathu — founder of WebLogic"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-electric/20 via-ink-100 to-ink-0">
                  <span className="font-display text-6xl font-semibold tracking-tightest text-bone/70">
                    CG
                  </span>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="md:col-span-7"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-electric">
              / The studio
            </p>
            <h2 className="mt-3 text-balance font-display text-display-md leading-[0.95] tracking-tightest md:text-display-lg">
              Built by Caleb Gathu.
            </h2>
            <div className="mt-6 space-y-4 text-bone/75 md:text-lg">
              <p>
                WebLogic was started because most small business websites
                still look like they were built in 2014. Owners pour time and
                money into their business, then settle for a website that
                doesn&apos;t reflect any of it.
              </p>
              <p>
                Every WebLogic build is design-led, performance-tuned, and
                shipped on a fixed quote — no hourly surprises, no months of
                back-and-forth. Just a modern site that looks like the
                business deserves and converts like it should.
              </p>
              <p className="text-bone">
                Remote-first. U.S.-based. Currently accepting select projects.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── 8. AUDIT FORM (inline lead capture) ───────────────────────── */

function AuditForm() {
  const [form, setForm] = useState({
    name: "",
    company: "",
    currentUrl: "",
    email: "",
    phone: "",
  });
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.name.trim() || !form.email.trim() || !form.company.trim()) {
      setError("Name, business name, and email are required.");
      return;
    }
    startTransition(async () => {
      const res = await submitLead({
        name: form.name.trim(),
        company: form.company.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        currentUrl: form.currentUrl.trim(),
        source: "/connect inline audit",
      });
      if (res.ok) {
        setDone(true);
      } else {
        setError(res.error ?? "Couldn't send right now — try again or email caleb@weblogic.digital.");
      }
    });
  };

  return (
    <section id="audit-form" className="border-t border-white/5 py-20 md:py-28">
      <div className="container-pad mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="mb-8 text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-electric/30 bg-electric/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-electric">
            <Sparkles className="h-3 w-3" /> Free · No obligation
          </span>
          <h2 className="mt-5 text-balance font-display text-display-md leading-[0.95] tracking-tightest md:text-display-lg">
            Get a free personalized{" "}
            <span className="text-mute">website audit.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-bone/65 md:text-lg">
            We&apos;ll review your current site, identify the weakest points,
            and email a written plan with prioritized fixes. Reply within 24
            hours.
          </p>
        </motion.div>

        <motion.form
          onSubmit={onSubmit}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="rounded-3xl border border-white/10 bg-ink-50/40 p-6 backdrop-blur-md md:p-10"
        >
          {done ? (
            <div className="grid place-items-center py-10 text-center">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-electric/15 text-electric shadow-glow-md">
                <CheckCircle2 className="h-6 w-6" />
              </span>
              <h3 className="mt-5 font-display text-3xl tracking-tightest">
                Audit request received.
              </h3>
              <p className="mt-2 max-w-md text-sm text-mute">
                A written audit is on its way to{" "}
                <span className="text-bone">{form.email}</span>. Expect a
                reply within one business day from{" "}
                <span className="text-bone">caleb@weblogic.digital</span>.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              <Field
                label="Name *"
                value={form.name}
                onChange={(v) => setForm({ ...form, name: v })}
                placeholder="Avery Reyes"
                required
              />
              <Field
                label="Business name *"
                value={form.company}
                onChange={(v) => setForm({ ...form, company: v })}
                placeholder="Acme Co."
                required
              />
              <Field
                label="Current website (if any)"
                value={form.currentUrl}
                onChange={(v) => setForm({ ...form, currentUrl: v })}
                placeholder="https://yourbusiness.com"
              />
              <Field
                label="Email *"
                type="email"
                value={form.email}
                onChange={(v) => setForm({ ...form, email: v })}
                placeholder="you@company.com"
                required
              />
              <Field
                label="Phone (optional)"
                type="tel"
                value={form.phone}
                onChange={(v) => setForm({ ...form, phone: v })}
                placeholder="(555) 123-4567"
                className="md:col-span-2"
              />

              {error && (
                <div className="flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/[0.06] px-3 py-2 text-xs text-red-300 md:col-span-2">
                  <AlertCircle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={pending}
                  className={cn(
                    "group inline-flex w-full items-center justify-center gap-2 rounded-full bg-electric px-6 py-4 text-sm font-medium text-ink-0 transition",
                    pending
                      ? "opacity-70"
                      : "hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,82,255,0.4)]",
                  )}
                >
                  {pending ? "Sending…" : "Send my audit request"}
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </button>
                <p className="mt-3 text-center text-[10px] font-mono uppercase tracking-[0.2em] text-mute">
                  <Clock className="mr-1 inline h-3 w-3" /> 24-hour reply ·
                  written plan + fixed quote
                </p>
              </div>
            </div>
          )}
        </motion.form>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
  className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-white/10 bg-ink-100/60 px-4 py-3 text-sm text-bone placeholder:text-white/30 focus:border-electric focus:outline-none"
      />
    </label>
  );
}

/* ───────────────────────── 9. CONTENT SECTION (social) ───────────────────────── */

function ContentSection() {
  // Show the live social links (not placeholders) as cards. Embedding actual
  // TikTok/IG/YouTube iframes would tank performance and CLS, so we link out
  // instead — same conversion goal, no third-party JS.
  const liveSocials = SOCIAL_LINKS.filter((s) => !s.placeholder);
  if (liveSocials.length === 0) return null;

  return (
    <section className="border-t border-white/5 py-20 md:py-28">
      <div className="container-pad mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-electric">
            / Behind the scenes
          </p>
          <h2 className="mt-3 font-display text-display-md leading-[0.95] tracking-tightest md:text-display-lg">
            Watch us build in public.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-bone/65">
            Redesign breakdowns, animation experiments, and short build logs —
            posted regularly.
          </p>
        </motion.div>

        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {liveSocials.map((s, i) => (
            <motion.li
              key={s.key}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            >
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col items-start gap-4 rounded-2xl border border-white/10 bg-ink-50/40 p-6 transition hover:-translate-y-0.5 hover:border-electric/40"
              >
                <span className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-ink-100/60 text-bone/80 transition group-hover:border-electric/60 group-hover:text-electric">
                  <SocialIcon social={s} className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-display text-lg tracking-tight text-bone">
                    {s.label}
                  </p>
                  <p className="mt-1 text-xs text-mute">
                    Latest builds + breakdowns
                  </p>
                </div>
                <span className="mt-auto inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.18em] text-electric">
                  Watch
                  <ArrowUpRight className="h-3 w-3" />
                </span>
              </a>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ───────────────────────── 10. FINAL CTA ───────────────────────── */

function FinalCTA() {
  return (
    <section className="relative border-t border-white/5 py-24 md:py-36">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-50 [background:radial-gradient(60%_60%_at_50%_50%,rgba(0,82,255,0.18),rgba(0,0,0,0)_70%)]"
      />
      <div className="container-pad relative z-10 mx-auto max-w-3xl text-center">
        <motion.h2
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-balance font-display text-display-lg leading-[0.92] tracking-tightest md:text-display-xl"
        >
          Your website should feel like{" "}
          <span className="text-electric">your business deserves.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto mt-6 max-w-xl text-pretty text-bone/75 md:text-xl"
        >
          Let&apos;s build something modern, memorable, and
          conversion-focused.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-10"
        >
          <a
            href="#audit-form"
            className="group inline-flex items-center gap-2 rounded-full bg-electric px-8 py-4 text-sm font-medium text-ink-0 transition hover:-translate-y-0.5 hover:shadow-[0_8px_36px_rgba(0,82,255,0.45)]"
          >
            <Gauge className="h-4 w-4" />
            Book your free audit
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </a>
        </motion.div>

        <p className="mt-6 text-[10px] font-mono uppercase tracking-[0.22em] text-mute">
          Or email{" "}
          <a
            href={`mailto:${BRAND.email}`}
            className="text-electric underline-offset-2 hover:underline"
          >
            {BRAND.email}
          </a>{" "}
          directly
        </p>
      </div>
    </section>
  );
}
