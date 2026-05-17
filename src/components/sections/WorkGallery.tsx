"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Play } from "lucide-react";
import type { CaseStudy } from "@/types";
import { useAssets } from "@/components/providers/AssetProvider";
import { cn } from "@/lib/utils";

/**
 * WorkGallery — image-first horizontal scroll gallery.
 *
 * Architecture
 *   • Native CSS `overflow-x: auto` + `scroll-snap-type: x mandatory` —
 *     faster and more battery-efficient than custom Framer drag.
 *   • Trackpad / wheel / touch scrolling works natively.
 *   • Optional mouse-drag layer for desktop users who can't horizontal-scroll
 *     (we don't fight the browser's native scrolling; we just translate
 *     mouse drag into scrollLeft adjustments).
 *   • Arrow buttons jump one card-width at a time.
 *   • Progress bar reflects scrollLeft / maxScroll.
 *
 * Card design
 *   • 70-80% media area.
 *   • Static thumbnail by default. Hover video overlays + fades in if
 *     uploaded — `preload="metadata"`, mute, loop, playsInline.
 *   • On mobile (no hover), thumbnail stays put; tap reveals a small play
 *     button if there's a video.
 *   • Label chip (Real Client / Demo / Concept / Internal Build / Performance Demo).
 *   • Service / tech tags.
 *   • Card links to /work/[slug].
 */
export default function WorkGallery({ items: rawItems }: { items: CaseStudy[] }) {
  const items = rawItems.filter((c) => c.visible !== false);
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  // Read scroll position → progress + arrow enablement
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const update = () => {
      const max = el.scrollWidth - el.clientWidth;
      const pct = max > 0 ? el.scrollLeft / max : 0;
      setProgress(pct);
      setCanPrev(el.scrollLeft > 8);
      setCanNext(el.scrollLeft < max - 8);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, []);

  const scrollByCard = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const firstCard = el.querySelector<HTMLElement>("[data-card]");
    const cardWidth = (firstCard?.offsetWidth ?? 460) + 16; // include gap
    el.scrollBy({ left: cardWidth * dir, behavior: "smooth" });
  };

  // Desktop mouse-drag-to-scroll (non-blocking; native trackpad scroll
  // still works for everyone else).
  const drag = useRef({ active: false, startX: 0, startScroll: 0 });
  const onMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    const el = trackRef.current;
    if (!el) return;
    drag.current.active = true;
    drag.current.startX = e.pageX - el.offsetLeft;
    drag.current.startScroll = el.scrollLeft;
    el.style.cursor = "grabbing";
    el.style.scrollSnapType = "none"; // release snap while dragging
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!drag.current.active) return;
    const el = trackRef.current;
    if (!el) return;
    const x = e.pageX - el.offsetLeft;
    el.scrollLeft = drag.current.startScroll - (x - drag.current.startX);
  };
  const endDrag = () => {
    if (!drag.current.active) return;
    drag.current.active = false;
    const el = trackRef.current;
    if (!el) return;
    el.style.cursor = "";
    el.style.scrollSnapType = ""; // re-enable snap so we settle on a card
  };

  return (
    <section
      id="case-studies"
      aria-label="Selected work"
      className="relative bg-ink-0 border-t border-white/5 py-24 md:py-32"
    >
      <div className="container-pad">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
        >
          <div className="md:max-w-xl">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
              / Selected Work
            </p>
            <h2 className="mt-6 text-balance font-display text-display-lg leading-[0.95] tracking-tightest text-bone">
              Websites and systems built to{" "}
              <span className="text-mute">move business.</span>
            </h2>
            <p className="mt-5 text-pretty text-mute md:text-lg">
              Scroll through websites, dashboards, checkout flows, portals, and
              performance builds. Hover to preview animations when video is
              available.
            </p>
          </div>

          {/* Arrow controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollByCard(-1)}
              disabled={!canPrev}
              aria-label="Previous work"
              className={cn(
                "grid h-11 w-11 place-items-center rounded-full border transition",
                canPrev
                  ? "border-white/15 text-bone hover:border-white/35 hover:bg-white/[0.03]"
                  : "border-white/8 text-white/25",
              )}
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollByCard(1)}
              disabled={!canNext}
              aria-label="Next work"
              className={cn(
                "grid h-11 w-11 place-items-center rounded-full border transition",
                canNext
                  ? "border-white/15 text-bone hover:border-white/35 hover:bg-white/[0.03]"
                  : "border-white/8 text-white/25",
              )}
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Track */}
      <div className="relative mt-12">
        <div
          ref={trackRef}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseLeave={endDrag}
          onMouseUp={endDrag}
          className={cn(
            "flex gap-4 overflow-x-auto overflow-y-hidden scroll-smooth pl-[var(--container-pad)] pr-[var(--container-pad)] pb-3",
            "snap-x snap-mandatory cursor-grab",
            "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          )}
          style={{ scrollPaddingLeft: "var(--container-pad)" }}
          data-cursor="drag"
        >
          {items.map((cs) => (
            <WorkCard key={cs.slug} cs={cs} />
          ))}
          {/* spacer keeps the last card from snapping awkwardly against the edge */}
          <div className="shrink-0" aria-hidden style={{ width: "var(--container-pad)" }} />
        </div>
      </div>

      {/* Progress bar */}
      <div className="container-pad mt-6">
        <div className="relative h-px overflow-hidden bg-white/10">
          <motion.div
            className="absolute inset-y-0 left-0 origin-left bg-electric"
            style={{ width: "100%", scaleX: progress, transformOrigin: "left" }}
            transition={{ type: "tween", duration: 0.18 }}
          />
        </div>
      </div>
    </section>
  );
}

/* ---------- Card ---------- */

function WorkCard({ cs }: { cs: CaseStudy }) {
  const { getImageUrl, getVideoUrl } = useAssets();
  const thumb =
    getImageUrl(`work-${cs.slug}-thumbnail`) ??
    getImageUrl(`case-${cs.slug}-image`);
  const video =
    getVideoUrl(`work-${cs.slug}-video`) ?? getVideoUrl(cs.videoSlot);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [hovered, setHovered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Respect the OS / browser reduced-motion preference — never auto-play
  // hover previews for users who've opted out of motion.
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (hovered && !reducedMotion) {
      // Start fresh from frame 0 each time the user hovers in.
      v.currentTime = 0;
      v.play().catch(() => {
        /* autoplay may still be blocked on slow connections — fail quiet */
      });
    } else {
      v.pause();
      // Reset to the poster frame so the next hover starts clean.
      v.currentTime = 0;
    }
  }, [hovered, video, reducedMotion]);

  // Hard-stop the preview after ~5s even if the source video is longer —
  // keeps the carousel from turning into a wall of looping noise.
  useEffect(() => {
    if (!hovered || reducedMotion) return;
    const t = window.setTimeout(() => {
      const v = videoRef.current;
      if (v) v.pause();
    }, 5000);
    return () => window.clearTimeout(t);
  }, [hovered, reducedMotion]);

  return (
    <Link
      href={`/work/${cs.slug}`}
      data-card
      data-cursor="link"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "group relative flex shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-white/10 bg-ink-0 transition-colors duration-500 hover:border-white/30",
        // Mobile: ~90% viewport. Desktop: fixed 480px (featured 560).
        "w-[88vw] max-w-[88vw]",
        "md:w-[460px] md:max-w-none",
        cs.featured && "md:w-[540px]",
      )}
      aria-label={`${cs.client} — view full breakdown`}
    >
      {/* MEDIA — image first, video on hover */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-ink-100">
        {thumb ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={thumb}
            alt={`${cs.client} screenshot`}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            draggable={false}
          />
        ) : (
          <BrowserPlaceholder slug={cs.slug} />
        )}

        {/* Hover-video overlay */}
        {video && (
          <video
            ref={videoRef}
            src={video}
            muted
            loop
            playsInline
            preload="metadata"
            className={cn(
              "pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-500",
              hovered ? "opacity-100" : "opacity-0",
            )}
          />
        )}

        {/* Label chip — top left, always visible */}
        <span className="absolute left-4 top-4 z-10 rounded-full border border-white/15 bg-ink-100/75 px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.18em] text-bone backdrop-blur">
          {cs.label}
        </span>

        {/* Mobile play hint when a video exists (replaces hover-to-play) */}
        {video && (
          <span
            aria-hidden
            className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-ink-100/70 text-white/80 backdrop-blur transition-all duration-500 group-hover:border-electric group-hover:bg-electric group-hover:text-white md:opacity-0 md:group-hover:opacity-100"
          >
            <Play className="h-3.5 w-3.5" />
          </span>
        )}

        {/* Bottom fade for legibility */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink-0/85 via-ink-0/0 to-transparent"
        />
      </div>

      {/* FOOTER — compact */}
      <div className="flex items-start justify-between gap-4 px-5 py-4 md:px-6 md:py-5">
        <div className="min-w-0">
          <p className="truncate font-display text-lg leading-tight tracking-tight text-bone md:text-xl">
            {cs.client}
          </p>
          <p className="mt-1 line-clamp-1 text-xs text-mute md:text-sm">
            {cs.headline}
          </p>
        </div>
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/12 text-white/70 transition-all duration-500 group-hover:border-electric group-hover:bg-electric group-hover:text-white">
          <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </div>

      {/* Tags — only show 3 to keep the card visually clean */}
      {cs.tags && cs.tags.length > 0 && (
        <ul className="flex flex-wrap gap-1.5 px-5 pb-5 md:px-6 md:pb-6">
          {cs.tags.slice(0, 4).map((t) => (
            <li
              key={t}
              className="rounded-full border border-electric/25 bg-electric/8 px-2 py-0.5 text-[10px] font-mono uppercase tracking-[0.14em] text-electric"
            >
              {t}
            </li>
          ))}
        </ul>
      )}
    </Link>
  );
}

/* ---------- Browser-frame placeholder ---------- */

function BrowserPlaceholder({ slug }: { slug: string }) {
  return (
    <div className="absolute inset-0 bg-ink-100 p-3 md:p-4">
      <div className="relative flex h-full w-full flex-col overflow-hidden rounded-lg border border-white/10 bg-ink-50">
        {/* Browser chrome */}
        <div className="flex items-center gap-2 border-b border-white/8 bg-ink-100/60 px-3 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="ml-3 hidden flex-1 truncate rounded border border-white/8 bg-ink-0 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-white/30 md:block">
            weblogic.digital / work / {slug}
          </span>
        </div>
        {/* Page body */}
        <div className="relative flex-1 overflow-hidden p-6">
          <div className="space-y-2">
            <div className="h-2.5 w-1/3 rounded bg-white/12" />
            <div className="h-1.5 w-2/3 rounded bg-white/7" />
            <div className="h-1.5 w-1/2 rounded bg-white/7" />
          </div>
          <div className="mt-8 grid grid-cols-3 gap-2">
            <div className="h-12 rounded border border-white/8 bg-white/[0.02]" />
            <div className="h-12 rounded border border-white/8 bg-white/[0.02]" />
            <div className="h-12 rounded border border-white/8 bg-white/[0.02]" />
          </div>
          <div className="mt-6 h-1 w-1/4 rounded bg-electric/30" />
        </div>
      </div>
      <p className="absolute bottom-1 right-3 font-mono text-[9px] uppercase tracking-[0.18em] text-white/25">
        Screenshot coming soon
      </p>
    </div>
  );
}
