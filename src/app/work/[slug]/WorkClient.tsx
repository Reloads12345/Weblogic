"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  AlertTriangle,
  Wrench,
  Code2,
  ExternalLink,
  Quote,
} from "lucide-react";
import Logo from "@/components/ui/Logo";
import MagneticButton from "@/components/ui/MagneticButton";
import { useLeadModal } from "@/components/ui/LeadModalProvider";
import { useAssets } from "@/components/providers/AssetProvider";
import { CASE_DETAILS, BRAND } from "@/lib/data";
import type { CaseStudy } from "@/types";
import { cn } from "@/lib/utils";

interface Props {
  slug: string;
  item: CaseStudy;
  items: CaseStudy[];
}

/**
 * Section IDs used by the sticky desktop TOC. Kept here so the TOC and
 * each <section> stay in sync — if you rename or add a section, edit
 * both this list and the corresponding id="" on the section.
 */
const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "cover", label: "Visual" },
  { id: "story", label: "The project" },
  { id: "screens", label: "Screens" },
  { id: "teardown", label: "Teardown" },
  { id: "timeline", label: "Timeline" },
  { id: "metrics", label: "Metrics" },
  { id: "testimonial", label: "Testimonial" },
  { id: "related", label: "More work" },
] as const;

export default function WorkClient({ slug, item: cs, items }: Props) {
  const { open } = useLeadModal();
  const { getImageUrl } = useAssets();

  const detail = CASE_DETAILS[slug];
  const coverImage =
    getImageUrl(`work-${slug}-thumbnail`) ?? getImageUrl(`case-${slug}-image`);
  const desktopImage = getImageUrl(`work-${slug}-desktop`);
  const mobileImage = getImageUrl(`work-${slug}-mobile`);
  const others = items.filter((c) => c.slug !== slug && c.visible !== false).slice(0, 3);

  // Track which section is currently in view so the sticky TOC can
  // highlight it. IntersectionObserver-driven; one observer for all
  // section refs, so it's cheap even on long pages.
  const [activeSection, setActiveSection] = useState<string>(SECTIONS[0].id);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const candidates = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => Boolean(el),
    );
    if (candidates.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        // Pick the entry closest to the top of the viewport that's still
        // intersecting — `whichever section the user is reading right now`.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) setActiveSection(visible[0].target.id);
      },
      // Big top margin so the TOC swaps when a section is ~25% above the
      // top of the viewport — feels right while scrolling at a normal pace.
      { rootMargin: "-25% 0px -60% 0px", threshold: 0 },
    );
    candidates.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Filter the TOC down to the sections that actually have content for
  // THIS case study — no point linking to "Testimonial" if there isn't one.
  const visibleSections = SECTIONS.filter((s) => {
    if (s.id === "screens") return Boolean(desktopImage || mobileImage);
    if (s.id === "teardown") return Boolean(detail);
    if (s.id === "timeline") return Boolean(cs.timeline && cs.timeline.length > 0);
    if (s.id === "testimonial") return Boolean(cs.caseQuote);
    return true;
  });

  return (
    <>
      {/* Slim header */}
      <header
        style={{ top: "var(--announcement-h, 0px)" }}
        className="fixed inset-x-0 z-[100] border-b border-white/8 bg-ink-0/80 backdrop-blur-xl"
      >
        <div className="container-pad flex h-[80px] items-center justify-between gap-4 md:h-[88px]">
          <Link
            href="/#case-studies"
            data-cursor="link"
            className="group inline-flex items-center gap-2.5 text-sm text-bone/85 transition-colors hover:text-bone"
            aria-label="Back to work"
          >
            <span className="grid h-9 w-9 place-items-center rounded-full border border-white/12 transition-all duration-300 group-hover:-translate-x-0.5 group-hover:border-white/30">
              <ArrowLeft className="h-4 w-4" />
            </span>
            <span className="text-sm text-mute transition-colors group-hover:text-bone">
              All work
            </span>
          </Link>
          <Link href="/" className="absolute left-1/2 -translate-x-1/2" aria-label="WebLogic — home">
            <Logo size="md" />
          </Link>
          <MagneticButton
            variant="electric"
            cursorMode="cta"
            onClick={() => open(`Work · ${cs.client}`)}
            className="!px-5 !py-2.5 text-xs"
          >
            Book a Free Audit
          </MagneticButton>
        </div>
      </header>

      <main id="main" className="bg-ink-0 pt-[80px] md:pt-[88px]">
        {/* Two-column shell on desktop: sticky TOC + content. On mobile the
            TOC collapses entirely (the page is short enough that scroll-only
            navigation is fine). */}
        <div className="container-pad grid gap-10 py-12 md:py-16 lg:grid-cols-[180px_1fr] lg:gap-16">
          {/* Sticky on-page TOC */}
          <aside
            aria-label="Sections in this case study"
            className="hidden lg:block"
          >
            <nav className="sticky top-32">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
                / On this page
              </p>
              <ul className="mt-4 space-y-1.5">
                {visibleSections.map((s) => {
                  const active = activeSection === s.id;
                  return (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        className={cn(
                          "block border-l-2 px-3 py-1 text-sm transition-colors",
                          active
                            ? "border-electric text-bone"
                            : "border-white/10 text-mute hover:border-white/30 hover:text-bone",
                        )}
                      >
                        {s.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
              {cs.liveUrl && (
                <a
                  href={cs.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex items-center gap-2 rounded-full border border-electric/40 bg-electric/10 px-3.5 py-2 text-xs font-mono uppercase tracking-[0.18em] text-electric transition hover:border-electric hover:bg-electric/20"
                >
                  <ExternalLink className="h-3 w-3" />
                  Live site
                </a>
              )}
            </nav>
          </aside>

          <div>
            {/* Hero */}
            <section id="overview" className="scroll-mt-32 pb-12 md:pb-16">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex items-center gap-3"
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
                  / {cs.industry}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-electric">
                  · {cs.duration}
                </span>
                {cs.year && (
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
                    · {cs.year}
                  </span>
                )}
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="mt-6 max-w-[18ch] font-display text-display-xl leading-[0.92] tracking-tightest text-bone"
              >
                {cs.client}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="mt-6 max-w-3xl text-pretty text-bone/85 md:text-2xl"
              >
                {cs.headline}
              </motion.p>

              {/* Tags + Live link row */}
              <div className="mt-7 flex flex-wrap items-center gap-2">
                {cs.tags?.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-electric/30 bg-electric/8 px-3 py-1.5 text-[10px] font-mono uppercase tracking-[0.16em] text-electric"
                  >
                    {t}
                  </span>
                ))}
                {cs.liveUrl && (
                  <a
                    href={cs.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="link"
                    className="group ml-auto inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.03] px-4 py-1.5 text-xs text-bone transition hover:border-electric/50 hover:bg-electric/10 hover:text-electric lg:hidden"
                  >
                    View live site
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                )}
              </div>
            </section>

            {/* Cover media */}
            <section id="cover" className="scroll-mt-32 border-t border-white/5 py-12 md:py-16">
              <div
                className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-white/10 bg-ink-100"
                style={{
                  background: coverImage
                    ? undefined
                    : `radial-gradient(80% 100% at 50% 100%, ${cs.accentColor ?? "#0052ff"}25, transparent 70%), linear-gradient(135deg, rgba(255,255,255,0.04), transparent)`,
                }}
              >
                {coverImage && (
                  <Image
                    src={coverImage}
                    alt={`${cs.client} — cover`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 800px"
                    priority
                    className="object-cover"
                  />
                )}
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-ink-0/85 via-ink-0/0 to-transparent p-6 md:p-8">
                  <p className="font-display text-4xl tracking-tightest text-bone/90 md:text-6xl">
                    {cs.client}
                  </p>
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
                    {cs.category}
                  </p>
                </div>
              </div>
            </section>

            {/* Story */}
            <section id="story" className="scroll-mt-32 border-t border-white/5 py-16 md:py-24">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
                / Summary
              </p>
              <h2 className="mt-5 font-display text-display-md tracking-tightest text-bone">
                The project.
              </h2>
              <div className="mt-8 grid gap-8 md:grid-cols-12">
                <p className="text-pretty text-bone/85 md:col-span-7 md:text-xl">
                  {cs.summary}
                </p>
                <p className="text-pretty text-mute md:col-span-5 md:text-base">
                  {cs.story}
                </p>
              </div>
              {cs.services && cs.services.length > 0 && (
                <div className="mt-8 border-t border-white/8 pt-6">
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
                    Services delivered
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {cs.services.map((s) => (
                      <li
                        key={s}
                        className="rounded-full border border-white/10 px-3 py-1 text-xs text-bone/80"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>

            {/* Desktop + Mobile screenshots */}
            {(desktopImage || mobileImage) && (
              <section
                id="screens"
                className="scroll-mt-32 border-t border-white/5 py-16 md:py-24"
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
                  / Screens
                </p>
                <h2 className="mt-5 font-display text-display-md tracking-tightest text-bone">
                  Desktop &amp; mobile.
                </h2>

                <div className="mt-12 grid gap-6 md:grid-cols-12">
                  {desktopImage && (
                    <div className="md:col-span-8">
                      <div className="rounded-2xl border border-white/10 bg-ink-100 p-3">
                        {/* Browser frame */}
                        <div className="flex items-center gap-2 border-b border-white/8 px-2 pb-2">
                          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                          <span className="ml-3 truncate font-mono text-[9px] uppercase tracking-[0.18em] text-white/30">
                            weblogic.digital / work / {slug}
                          </span>
                        </div>
                        <div className="relative mt-3 aspect-[16/10] overflow-hidden rounded-lg">
                          <Image
                            src={desktopImage}
                            alt={`${cs.client} — desktop screenshot`}
                            fill
                            sizes="(max-width: 1024px) 100vw, 700px"
                            loading="lazy"
                            className="object-cover"
                          />
                        </div>
                      </div>
                      <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
                        Desktop · 16:10
                      </p>
                    </div>
                  )}

                  {mobileImage && (
                    <div className="md:col-span-4">
                      <div className="mx-auto rounded-[2rem] border border-white/10 bg-ink-100 p-3">
                        <div className="relative aspect-[9/19.5] overflow-hidden rounded-2xl">
                          <Image
                            src={mobileImage}
                            alt={`${cs.client} — mobile screenshot`}
                            fill
                            sizes="(max-width: 1024px) 50vw, 250px"
                            loading="lazy"
                            className="object-cover"
                          />
                        </div>
                      </div>
                      <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
                        Mobile · 9:19.5
                      </p>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Teardown */}
            {detail && (
              <section
                id="teardown"
                className="scroll-mt-32 border-t border-white/5 py-16 md:py-24"
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
                  / The teardown
                </p>
                <h2 className="mt-5 font-display text-display-md tracking-tightest text-bone">
                  What was broken. What we changed.
                </h2>

                <div className="mt-12 grid gap-6 md:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-ink-0 p-7">
                    <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      What was broken
                    </p>
                    <ul className="mt-5 space-y-3 text-bone/85">
                      {detail.broken.map((b) => (
                        <li key={b} className="flex gap-2">
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-bone/30" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-2xl border border-electric/30 bg-ink-0 p-7">
                    <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-electric">
                      <Wrench className="h-3.5 w-3.5" />
                      What we changed
                    </p>
                    <ul className="mt-5 space-y-3 text-bone/85">
                      {detail.changed.map((c) => (
                        <li key={c} className="flex gap-2">
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-electric" />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Before / After */}
                <div className="mt-8 grid grid-cols-1 gap-3 overflow-hidden rounded-2xl border border-white/10 md:grid-cols-2">
                  <div className="bg-ink-0 p-7">
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
                      Before
                    </p>
                    <p className="mt-3 font-display text-xl tracking-tight text-bone/75 md:text-2xl">
                      {detail.before}
                    </p>
                  </div>
                  <div className="bg-electric/5 p-7">
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-electric">
                      After
                    </p>
                    <p className="mt-3 font-display text-xl tracking-tight text-bone md:text-2xl">
                      {detail.after}
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* Process timeline */}
            {cs.timeline && cs.timeline.length > 0 && (
              <section
                id="timeline"
                className="scroll-mt-32 border-t border-white/5 py-16 md:py-24"
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
                  / How it shipped
                </p>
                <h2 className="mt-5 font-display text-display-md tracking-tightest text-bone">
                  The build, phase by phase.
                </h2>

                <ol className="mt-12 relative space-y-0">
                  {/* Vertical rail behind the dots */}
                  <span
                    aria-hidden
                    className="absolute left-[7px] top-2 bottom-2 w-px bg-white/10"
                  />
                  {cs.timeline.map((phase, i) => (
                    <li key={`${phase.phase}-${i}`} className="relative flex gap-6 pb-8 last:pb-0">
                      <span
                        aria-hidden
                        className="relative z-10 mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full border-2 border-electric bg-ink-0 shadow-[0_0_12px_rgba(0,82,255,0.5)]"
                      />
                      <div className="flex-1">
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <p className="font-display text-xl tracking-tight text-bone md:text-2xl">
                            {phase.phase}
                          </p>
                          {phase.dates && (
                            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-electric">
                              {phase.dates}
                            </p>
                          )}
                        </div>
                        <p className="mt-2 text-pretty text-mute md:text-base">
                          {phase.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {/* Metrics + stack */}
            <section
              id="metrics"
              className="scroll-mt-32 border-t border-white/5 py-16 md:py-24"
            >
              <div className="grid gap-12 md:grid-cols-12">
                <div className="md:col-span-6">
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
                    / Metrics
                  </p>
                  <h2 className="mt-5 font-display text-display-md tracking-tightest text-bone">
                    What it produced.
                  </h2>
                  <ul className="mt-8 grid grid-cols-2 gap-3">
                    {cs.metrics.map((m) => (
                      <li
                        key={m.label}
                        className="rounded-xl border border-white/10 bg-ink-0 p-5"
                      >
                        <p className="font-display text-2xl tracking-tightest text-bone md:text-3xl">
                          {m.value}
                        </p>
                        <p className="mt-1 text-[10px] font-mono uppercase tracking-[0.18em] text-mute">
                          {m.label}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="md:col-span-6">
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
                    / Stack
                  </p>
                  <h2 className="mt-5 font-display text-display-md tracking-tightest text-bone">
                    What it&apos;s built on.
                  </h2>
                  <ul className="mt-8 flex flex-wrap gap-2">
                    {cs.stack.map((s) => (
                      <li
                        key={s}
                        className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3.5 py-1.5 text-xs text-bone/85"
                      >
                        <Code2 className="h-3 w-3 text-electric" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Testimonial pull-quote */}
            {cs.caseQuote && (
              <section
                id="testimonial"
                className="scroll-mt-32 border-t border-white/5 py-16 md:py-24"
              >
                <figure className="mx-auto max-w-3xl text-center">
                  <Quote
                    className="mx-auto h-8 w-8 text-electric/70"
                    aria-hidden
                  />
                  <blockquote className="mt-6 text-balance font-display text-2xl leading-snug tracking-tightest text-bone md:text-4xl">
                    &ldquo;{cs.caseQuote.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-8 inline-flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-ink-0 text-xs font-mono uppercase tracking-widest text-bone">
                      {cs.caseQuote.author
                        .split(" ")
                        .map((w) => w[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </span>
                    <span className="text-left">
                      <span className="block text-sm text-bone">
                        {cs.caseQuote.author}
                      </span>
                      <span className="block text-[10px] font-mono uppercase tracking-[0.22em] text-mute">
                        {cs.caseQuote.role}
                      </span>
                    </span>
                  </figcaption>
                </figure>
              </section>
            )}

            {/* Related work */}
            <section
              id="related"
              className="scroll-mt-32 border-t border-white/5 py-16 md:py-24"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
                / More builds
              </p>
              <h2 className="mt-5 font-display text-display-md tracking-tightest text-bone">
                Selected builds
              </h2>

              <ul className="mt-10 grid grid-cols-1 gap-3 md:grid-cols-3">
                {others.map((o) => (
                  <li key={o.slug}>
                    <Link
                      href={`/work/${o.slug}`}
                      className="group flex h-full flex-col rounded-2xl border border-white/8 bg-ink-0 p-6 transition hover:-translate-y-0.5 hover:border-electric/40"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
                          {o.category}
                        </span>
                        <ArrowUpRight className="h-4 w-4 text-mute transition group-hover:text-electric" />
                      </div>
                      <p className="mt-6 font-display text-2xl tracking-tightest text-bone group-hover:text-electric">
                        {o.client}
                      </p>
                      <p className="mt-3 text-sm text-mute">{o.summary}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            {/* CTA */}
            <section className="border-t border-white/5 py-20 md:py-28">
              <div className="text-center">
                <h2 className="mx-auto max-w-[18ch] text-balance font-display text-display-md tracking-tightest text-bone md:text-display-lg">
                  Want to build something like this?
                </h2>
                <p className="mx-auto mt-5 max-w-md text-pretty text-mute md:text-lg">
                  Book the free 24-hour audit. We&apos;ll send a written plan
                  + fixed quote.
                </p>
                <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                  <MagneticButton
                    variant="electric"
                    cursorMode="cta"
                    onClick={() => open(`Work · ${cs.client} · CTA`)}
                    className="!px-7 !py-3.5"
                  >
                    Book a Free Audit
                    <ArrowUpRight className="h-4 w-4" />
                  </MagneticButton>
                  <Link
                    href="/#case-studies"
                    className="inline-flex items-center gap-2 rounded-full border border-white/12 px-7 py-3.5 text-sm text-bone transition-all duration-300 hover:border-white/30"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to all work
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </div>

        <footer className="border-t border-white/5 py-10">
          <div className="container-pad flex flex-col items-start justify-between gap-4 text-[10px] font-mono uppercase tracking-[0.22em] text-mute md:flex-row md:items-center">
            <p>© {new Date().getFullYear()} {BRAND.name} Studio. All rights reserved.</p>
            <p>Built remotely · United States</p>
          </div>
        </footer>
      </main>
    </>
  );
}
