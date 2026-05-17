"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, AlertTriangle, Wrench, Code2 } from "lucide-react";
import Logo from "@/components/ui/Logo";
import MagneticButton from "@/components/ui/MagneticButton";
import { useLeadModal } from "@/components/ui/LeadModalProvider";
import { useAssets } from "@/components/providers/AssetProvider";
import { CASE_DETAILS, BRAND } from "@/lib/data";
import type { CaseStudy } from "@/types";

interface Props {
  slug: string;
  item: CaseStudy;
  items: CaseStudy[];
}

export default function WorkClient({ slug, item: cs, items }: Props) {
  const { open } = useLeadModal();
  const { getImageUrl } = useAssets();

  const detail = CASE_DETAILS[slug];
  const coverImage =
    getImageUrl(`work-${slug}-thumbnail`) ?? getImageUrl(`case-${slug}-image`);
  const desktopImage = getImageUrl(`work-${slug}-desktop`);
  const mobileImage = getImageUrl(`work-${slug}-mobile`);
  const others = items.filter((c) => c.slug !== slug && c.visible !== false).slice(0, 3);

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

      <main className="bg-ink-0 pt-[80px] md:pt-[88px]">
        {/* Hero */}
        <section className="border-b border-white/5 py-20 md:py-28">
          <div className="container-pad">
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

            {cs.tags && cs.tags.length > 0 && (
              <ul className="mt-7 flex flex-wrap gap-2">
                {cs.tags.map((t) => (
                  <li
                    key={t}
                    className="rounded-full border border-electric/30 bg-electric/8 px-3 py-1.5 text-[10px] font-mono uppercase tracking-[0.16em] text-electric"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* Cover media */}
        <section className="border-b border-white/5 py-12 md:py-16">
          <div className="container-pad">
            <div
              className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-white/10 bg-ink-100"
              style={{
                background: coverImage
                  ? undefined
                  : `radial-gradient(80% 100% at 50% 100%, ${cs.accentColor ?? "#0052ff"}25, transparent 70%), linear-gradient(135deg, rgba(255,255,255,0.04), transparent)`,
              }}
            >
              {coverImage && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={coverImage}
                  alt={cs.client}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )}
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 md:p-8">
                <p className="font-display text-4xl tracking-tightest text-bone/90 md:text-6xl">
                  {cs.client}
                </p>
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
                  {cs.category}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="border-b border-white/5 py-20 md:py-28">
          <div className="container-pad grid gap-10 md:grid-cols-12">
            <div className="md:col-span-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
                / Summary
              </p>
              <h2 className="mt-5 font-display text-display-md tracking-tightest text-bone">
                The project.
              </h2>
            </div>
            <div className="md:col-span-8">
              <p className="text-pretty text-bone/85 md:text-xl">{cs.summary}</p>
              <p className="mt-5 text-pretty text-mute md:text-lg">{cs.story}</p>
            </div>
          </div>
        </section>

        {/* Desktop + Mobile screenshots (only render the section if either is uploaded) */}
        {(desktopImage || mobileImage) && (
          <section className="border-b border-white/5 py-20 md:py-28">
            <div className="container-pad">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
                / Screens
              </p>
              <h2 className="mt-5 font-display text-display-md tracking-tightest text-bone">
                Desktop & mobile.
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
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={desktopImage}
                          alt={`${cs.client} — desktop screenshot`}
                          loading="lazy"
                          className="absolute inset-0 h-full w-full object-cover"
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
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={mobileImage}
                          alt={`${cs.client} — mobile screenshot`}
                          loading="lazy"
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                      </div>
                    </div>
                    <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
                      Mobile · 9:19.5
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Before / After / What was broken / What we changed */}
        {detail && (
          <section className="border-b border-white/5 py-20 md:py-28">
            <div className="container-pad">
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
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">Before</p>
                  <p className="mt-3 font-display text-xl tracking-tight text-bone/75 md:text-2xl">
                    {detail.before}
                  </p>
                </div>
                <div className="bg-electric/5 p-7">
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-electric">After</p>
                  <p className="mt-3 font-display text-xl tracking-tight text-bone md:text-2xl">
                    {detail.after}
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Metrics + stack */}
        <section className="border-b border-white/5 py-20 md:py-28">
          <div className="container-pad grid gap-12 md:grid-cols-12">
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
                What it's built on.
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

        {/* Related work */}
        <section className="border-b border-white/5 py-20 md:py-28">
          <div className="container-pad">
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
          </div>
        </section>

        {/* CTA */}
        <section className="border-b border-white/5 py-20 md:py-28">
          <div className="container-pad text-center">
            <h2 className="mx-auto max-w-[18ch] text-balance font-display text-display-md tracking-tightest text-bone md:text-display-lg">
              Want to build something like this?
            </h2>
            <p className="mx-auto mt-5 max-w-md text-pretty text-mute md:text-lg">
              Book the free 24-hour audit. We'll send a written plan + fixed quote.
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

        <footer className="py-10">
          <div className="container-pad flex flex-col items-start justify-between gap-4 text-[10px] font-mono uppercase tracking-[0.22em] text-mute md:flex-row md:items-center">
            <p>© {new Date().getFullYear()} {BRAND.name} Studio. All rights reserved.</p>
            <p>Built remotely · United States</p>
          </div>
        </footer>
      </main>
    </>
  );
}
