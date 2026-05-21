import { Layers, Zap, Target } from "lucide-react";

/**
 * Why-WebLogic manifesto — Server Component.
 *
 * Was client-only because of Framer Motion entrance animations. Now uses
 * `.fade-up-on-mount` on the heading and `.fade-up-stagger > *` on the
 * pillar grid for staggered card entrances. CSS-only, zero hydration JS.
 */
const PILLARS = [
  {
    icon: Layers,
    eyebrow: "01",
    title: "Real software, not templates",
    copy: "Every site is custom-built. Type-safe, auth-ready, payment-ready. The same stack that runs SaaS apps — applied to your business.",
  },
  {
    icon: Zap,
    eyebrow: "02",
    title: "Fast where it matters",
    copy: "Sub-second loads, mobile-first layouts, image and font pipelines tuned for the slowest device your customer might use.",
  },
  {
    icon: Target,
    eyebrow: "03",
    title: "Built to move business",
    copy: "Every page is built to move visitors toward action — booking calls, submitting forms, buying products, requesting quotes.",
  },
];

export default function Manifesto() {
  return (
    <section
      id="why-weblogic"
      className="relative bg-ink-0 border-t border-white/5 py-28 md:py-36"
    >
      <div className="container-pad">
        <div className="fade-up-on-mount">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
            / Why WebLogic
          </p>
          <h2 className="mt-6 max-w-[20ch] text-balance font-display text-display-lg leading-[0.95] tracking-tightest text-bone">
            Most agencies ship websites.{" "}
            <span className="text-mute">We build systems that evolve.</span>
          </h2>
        </div>

        {/* Three pillars — staggered fade-up via CSS, no JS */}
        <div className="fade-up-stagger mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-white/8 bg-white/8 md:grid-cols-3">
          {PILLARS.map((p) => {
            const Icon = p.icon;
            return (
              <article
                key={p.title}
                className="group relative bg-ink-0 p-8 transition-colors duration-500 hover:bg-white/[0.015] md:p-10"
              >
                <div className="flex items-center justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 text-bone/85 transition-all duration-500 group-hover:border-electric/50 group-hover:text-electric">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
                    {p.eyebrow}
                  </span>
                </div>
                <h3 className="mt-7 font-display text-2xl leading-tight tracking-tightest text-bone md:text-3xl">
                  {p.title}
                </h3>
                <p className="mt-3 text-pretty text-mute">{p.copy}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
