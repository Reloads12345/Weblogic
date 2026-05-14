"use client";

import { motion } from "framer-motion";
import { TECH_LOGOS } from "@/components/ui/TechLogos";

/**
 * "Built with Modern Architecture"
 *  Top row    → flows left-to-right (.wl-marquee-ltr, 55s)
 *  Bottom row → flows right-to-left (.wl-marquee-rtl, 75s, dimmed)
 * Tripled track for seamless looping.
 */
export default function TechStack() {
  const row = [...TECH_LOGOS, ...TECH_LOGOS, ...TECH_LOGOS];

  return (
    <section
      id="tech-stack"
      aria-labelledby="tech-stack-heading"
      className="relative bg-ink-0 border-y border-white/5 py-20"
    >
      <div className="container-pad mb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2
            id="tech-stack-heading"
            className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute"
          >
            / Built with Modern Architecture
          </h2>
          <p className="mt-3 max-w-xl text-pretty text-mute md:text-lg">
            The stack we ship on. Best-of-breed for performance, content velocity,
            and edge personalization.
          </p>
        </motion.div>
      </div>

      <div className="mask-fade-edges overflow-hidden">
        {/* Top row — LTR */}
        <div
          className="wl-marquee-ltr flex w-max items-center gap-12 py-4 will-change-transform"
          style={{ ["--marquee-duration" as never]: "55s" }}
        >
          {row.map(({ name, Component }, i) => (
            <LogoItem key={`top-${name}-${i}`} name={name} Component={Component} size="lg" />
          ))}
        </div>

        {/* Bottom row — RTL */}
        <div
          className="wl-marquee-rtl mt-2 flex w-max items-center gap-12 py-4 will-change-transform"
          style={{ ["--marquee-duration" as never]: "75s" }}
        >
          {row.map(({ name, Component }, i) => (
            <LogoItem
              key={`bot-${name}-${i}`}
              name={name}
              Component={Component}
              size="md"
              dim
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function LogoItem({
  name,
  Component,
  size = "lg",
  dim = false,
}: {
  name: string;
  Component: React.FC<{ className?: string }>;
  size?: "md" | "lg";
  dim?: boolean;
}) {
  return (
    <span
      className={`group inline-flex shrink-0 items-center gap-3 transition-colors duration-300 hover:text-bone ${
        dim ? "text-bone/30" : "text-bone/55"
      }`}
    >
      <Component
        className={size === "lg" ? "h-9 w-auto md:h-11" : "h-7 w-auto md:h-9"}
      />
      <span
        className={`font-display tracking-tightest ${
          size === "lg" ? "text-3xl md:text-4xl" : "text-xl md:text-2xl"
        }`}
      >
        {name}
      </span>
      <span
        className={`mx-2 ${size === "lg" ? "text-3xl md:text-4xl" : "text-xl md:text-2xl"}`}
      >
        ·
      </span>
    </span>
  );
}
