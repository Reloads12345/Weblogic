"use client";

import { ArrowDown, ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import MagneticButton from "@/components/ui/MagneticButton";
import { useLeadModal } from "@/components/ui/LeadModalProvider";
import Counter from "@/components/ui/Counter";
import GlobeMount from "@/components/globe/GlobeMount";

const SERVICE_CHIPS = [
  "Websites",
  "Client portals",
  "Payment systems",
  "Automations",
];

/**
 * Hero — honest, plain-English positioning. Two CTAs:
 *  - Primary: Book a Free Audit (opens lead modal w/ source "Hero · Free Audit")
 *  - Secondary: View Services (scrolls to #services)
 */
export default function Hero() {
  const { open: openLead } = useLeadModal();

  const headlineRef = useRef<HTMLHeadingElement>(null);
  const [showGlobe, setShowGlobe] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px) and (hover: hover)");
    const update = () => setShowGlobe(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const el = headlineRef.current;
    if (!el) return;
    const lines = el.querySelectorAll<HTMLElement>("[data-line]");
    lines.forEach((l, i) => {
      window.setTimeout(() => l.classList.add("is-in"), 80 + i * 110);
    });
  }, []);

  return (
    <section
      id="top"
      className="relative isolate overflow-hidden bg-ink-0 pt-32 md:pt-40 pb-24 md:pb-28"
    >
      <div className="container-pad relative z-10 grid grid-cols-12 items-center gap-8">
        <div className="col-span-12 md:col-span-7 lg:col-span-7">
          {/* Eyebrow */}
          <p
            className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute"
            style={{ animation: "rise 0.7s 0s cubic-bezier(0.2,0.8,0.2,1) backwards" }}
          >
            Web engineering · client portals · automations
          </p>

          {/* Got a tight timeline? above main CTA */}
          <a
            href="#mid-cta"
            data-cursor="link"
            className="mt-6 inline-flex items-center gap-2 text-xs italic text-bone/85 transition-colors hover:text-bone"
            style={{ animation: "rise 0.7s 0.2s cubic-bezier(0.2,0.8,0.2,1) backwards" }}
          >
            <span className="relative inline-flex h-2 w-2" aria-hidden>
              <span className="absolute inset-0 rounded-full bg-electric/55 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-electric" />
            </span>
            Free audit · reply within 24 hours
          </a>

          {/* Headline — plain English, benefit-driven */}
          <h1
            ref={headlineRef}
            className="mt-8 max-w-[22ch] font-display text-display-xl tracking-tightest text-bone"
          >
            <span data-line className="reveal-line">
              <span>Websites & systems</span>
            </span>
            <span data-line className="reveal-line">
              <span>that evolve with your business.</span>
            </span>
          </h1>

          {/* Subheadline — direct, says what we build */}
          <p
            className="mt-8 max-w-2xl text-pretty text-lg leading-snug text-mute md:text-xl"
            style={{ animation: "rise 0.9s 0.55s cubic-bezier(0.2,0.8,0.2,1) backwards" }}
          >
            WebLogic builds high-performance websites, client portals, payment
            systems, and automations for businesses that need more than a basic
            online presence.
          </p>

          {/* Service chips — what we actually build */}
          <ul
            className="mt-7 flex flex-wrap gap-2"
            style={{ animation: "rise 0.9s 0.65s cubic-bezier(0.2,0.8,0.2,1) backwards" }}
          >
            {SERVICE_CHIPS.map((c) => (
              <li key={c}>
                <a
                  href="#services"
                  data-cursor="link"
                  className="inline-flex items-center rounded-full border border-white/10 bg-ink-0 px-3.5 py-1.5 text-xs text-bone/80 transition-all duration-300 hover:border-electric/60 hover:text-electric hover:shadow-[0_0_0_4px_rgba(0,82,255,0.08)]"
                >
                  {c}
                </a>
              </li>
            ))}
          </ul>

          {/* Dual CTAs */}
          <div
            className="mt-10 flex flex-wrap items-center gap-3"
            style={{ animation: "rise 0.9s 0.8s cubic-bezier(0.2,0.8,0.2,1) backwards" }}
          >
            <MagneticButton
              variant="electric"
              cursorMode="cta"
              onClick={() => openLead("Hero · Book Free Audit")}
              className="!px-7 !py-3.5 text-sm"
            >
              Book a Free Audit
              <ArrowUpRight className="h-4 w-4" />
            </MagneticButton>
            <a
              href="#services"
              data-cursor="link"
              className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-ink-0 px-7 py-3.5 text-sm text-bone transition-all duration-300 hover:border-white/30 hover:bg-white/[0.03]"
            >
              View services
              <ArrowDown className="h-4 w-4" />
            </a>
          </div>

          {/* Audit microcopy */}
          <p
            className="mt-5 flex items-center gap-2 text-xs text-mute"
            style={{ animation: "rise 0.9s 0.9s cubic-bezier(0.2,0.8,0.2,1) backwards" }}
          >
            <span className="h-1 w-1 rounded-full bg-electric" />
            Free 24-hour audit · written plan + fixed quote · no obligation
          </p>
        </div>

        {/* Globe — lives inside the grid so it always sits flush with the
            headline column, regardless of viewport width or browser zoom.
            No absolute positioning means no clipping at wide viewports. */}
        <div
          aria-hidden
          className="relative col-span-12 hidden aspect-square w-full md:col-span-5 md:block lg:col-span-5"
        >
          {showGlobe && (
            <div className="absolute inset-0 opacity-60">
              <GlobeMount variant="hero" className="absolute inset-0" />
              {/* Left feather so the globe doesn't collide visually with the
                  headline column at the narrowest tablet width. */}
              <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-ink-0 via-ink-0/60 to-transparent" />
            </div>
          )}
        </div>
      </div>

      {/* Thin metric strip */}
      <div
        className="container-pad relative z-10 mt-20 grid grid-cols-2 gap-x-10 gap-y-6 border-t border-white/6 pt-8 md:grid-cols-4"
        style={{ animation: "rise 0.9s 1.05s cubic-bezier(0.2,0.8,0.2,1) backwards" }}
      >
        <Stat label="Lighthouse target" value={98} />
        <Stat label="Median LCP" value={700} suffix="ms" />
        <Stat label="Avg. ship time" value={3} suffix=" wks" />
        <Stat label="Maintenance plans" value={3} />
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-6 z-10 flex items-center justify-center text-mute">
        <span className="font-mono text-[10px] uppercase tracking-[0.24em]">Scroll</span>
      </div>
    </section>
  );
}

function Stat({ label, value, suffix }: { label: string; value: number; suffix?: string }) {
  return (
    <div>
      <p className="font-display text-3xl tracking-tightest text-bone md:text-4xl">
        <Counter value={value} suffix={suffix} />
      </p>
      <p className="mt-2 text-[10px] font-mono uppercase tracking-[0.2em] text-mute">{label}</p>
    </div>
  );
}
