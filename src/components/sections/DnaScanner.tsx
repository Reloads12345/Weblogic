"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Layers, Database, Zap, Globe2, Cpu, Search, ScanLine, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * "Website DNA Scanner" — an interactive, animated visualizer of how a
 * composable site is layered together. Click a layer to inspect it.
 *
 * Pure UI / no real network call — the magic is the demo, not the data.
 */

const LAYERS = [
  {
    id: "edge",
    icon: Globe2,
    title: "Edge Layer",
    sub: "Vercel · Cloudflare Workers",
    body: "Routes, caches, and personalizes at the network edge — within 50ms of every visitor on earth.",
    metric: "37ms",
    metricLabel: "median TTFB",
  },
  {
    id: "render",
    icon: Cpu,
    title: "Render Layer",
    sub: "Next.js 15 · React Server Components",
    body: "Server components stream from the edge, with type-safe content models and zero client-side JS where possible.",
    metric: "0.5s",
    metricLabel: "LCP target",
  },
  {
    id: "design",
    icon: Layers,
    title: "Design System",
    sub: "Tokens · Motion grammar · A11y",
    body: "1,840 design tokens, 47 motion presets, WCAG 2.2 AA-locked. Every surface uses the same primitives.",
    metric: "1,840",
    metricLabel: "tokens",
  },
  {
    id: "content",
    icon: Database,
    title: "Content Layer",
    sub: "Storyblok · Sanity · Contentful",
    body: "Headless CMS with Zod-validated schemas. Marketing ships pages without engineering tickets.",
    metric: "100%",
    metricLabel: "schema parity",
  },
  {
    id: "intelligence",
    icon: Search,
    title: "Intelligence",
    sub: "GrowthBook · Segment · GA4",
    body: "Per-visitor personalization, RUM-driven performance, GTM/pixel parity. The site learns.",
    metric: "47",
    metricLabel: "live variants",
  },
  {
    id: "infra",
    icon: Lock,
    title: "Infra & Security",
    sub: "Vercel · Cloudflare · Datadog RUM",
    body: "SOC 2-aligned infra, signed deploys, real-user monitoring on every pageview.",
    metric: "99.99%",
    metricLabel: "uptime SLA",
  },
] as const;

export default function DnaScanner() {
  const [activeId, setActiveId] = useState<(typeof LAYERS)[number]["id"]>("edge");
  const active = LAYERS.find((l) => l.id === activeId)!;
  const ActiveIcon = active.icon;

  return (
    <section
      id="dna"
      className="relative bg-ink-0 border-t border-white/5 py-24 md:py-32"
    >
      <div className="container-pad grid gap-10 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="eyebrow flex items-center gap-2">
            <ScanLine className="h-3 w-3 text-electric" /> Website DNA Scanner
          </p>
          <h2 className="section-h mt-4 max-w-[16ch] text-balance">
            See how a composable site is{" "}
            <span className="text-electric">built, in real time</span>.
          </h2>
          <p className="mt-5 max-w-md text-mute">
            Click a layer to inspect it. This is the same architecture we ship for Gong, Calendly, and ServiceTitan — assembled in your browser.
          </p>
          <p className="mt-3 text-[10px] font-mono uppercase tracking-[0.2em] text-electric">
            Scanning · 6 layers · 0 monolith
          </p>
        </div>

        {/* Layer stack */}
        <div className="relative md:col-span-7">
          <div className="relative grid grid-cols-1 gap-2.5">
            {LAYERS.map((layer, i) => {
              const Icon = layer.icon;
              const isActive = layer.id === activeId;
              return (
                <button
                  type="button"
                  key={layer.id}
                  onClick={() => setActiveId(layer.id)}
                  className={cn(
                    "group relative flex items-center gap-4 overflow-hidden rounded-2xl border bg-ink-0 px-5 py-4 text-left transition-all duration-500",
                    isActive
                      ? "border-electric/50"
                      : "border-white/10 hover:border-white/20",
                  )}
                  data-cursor="link"
                  style={{ transform: `translateX(${i * 14}px)`, marginRight: `${i * 14}px` }}
                >
                  {/* Scanner line */}
                  {isActive && (
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-transparent via-electric to-transparent opacity-80"
                      style={{ animation: "blue-pulse 2s ease-in-out infinite" }}
                    />
                  )}
                  <span
                    className={cn(
                      "grid h-10 w-10 shrink-0 place-items-center rounded-lg border transition-all",
                      isActive
                        ? "border-electric bg-electric/10 text-electric shadow-glow-sm"
                        : "border-white/10 text-white/70",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-lg leading-tight tracking-tight text-bone">
                      {layer.title}
                    </p>
                    <p className="mt-0.5 text-[11px] font-mono uppercase tracking-[0.16em] text-mute">
                      {layer.sub}
                    </p>
                  </div>
                  <div className="hidden flex-shrink-0 text-right md:block">
                    <p className="font-display text-xl tracking-tightest text-bone">
                      {layer.metric}
                    </p>
                    <p className="text-[9px] font-mono uppercase tracking-[0.18em] text-mute">
                      {layer.metricLabel}
                    </p>
                  </div>
                  {/* shimmer rail */}
                  <span className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-shimmer-gradient opacity-50 shimmer" />
                </button>
              );
            })}
          </div>

          {/* Active layer panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 rounded-2xl border border-white/10 bg-ink-0 p-6"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-lg border border-electric/40 bg-electric/15 text-electric">
                  <ActiveIcon className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-electric">
                    Inspecting · {active.id}
                  </p>
                  <p className="font-display text-xl tracking-tight">{active.title}</p>
                </div>
              </div>
              <p className="mt-3 text-mute">{active.body}</p>
              <div className="mt-4 grid grid-cols-3 gap-3">
                <Mini label="LCP" value="< 0.8s" icon={Zap} />
                <Mini label="A11y" value="100" icon={Lock} />
                <Mini label="Layer" value={active.metric} icon={Layers} />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function Mini({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: typeof Zap;
}) {
  return (
    <div className="rounded-lg border border-white/8 bg-ink-100/40 p-3">
      <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.2em] text-mute">
        <Icon className="h-3 w-3 text-electric" />
        {label}
      </div>
      <p className="mt-1 font-display text-lg tracking-tightest">{value}</p>
    </div>
  );
}
