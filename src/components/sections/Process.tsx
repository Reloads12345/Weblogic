"use client";

import { motion } from "framer-motion";
import { Compass, Hammer, Rocket, TrendingUp } from "lucide-react";

const STEPS = [
  {
    n: "01",
    icon: Compass,
    title: "Strategy",
    copy:
      "We audit your current website, brand, competitors, and conversion flow. You get a written plan — not a deck.",
    duration: "Week 1",
  },
  {
    n: "02",
    icon: Hammer,
    title: "Build",
    copy:
      "We design and develop the website, portal, payment system, or automation. Working URL on day one.",
    duration: "Weeks 2–4",
  },
  {
    n: "03",
    icon: Rocket,
    title: "Launch",
    copy:
      "We handle performance, SEO basics, analytics, forms, hosting, and deployment. You go live with zero loose ends.",
    duration: "Week 4–5",
  },
  {
    n: "04",
    icon: TrendingUp,
    title: "Maintain",
    copy:
      "We monitor, update, optimize, and improve the system monthly. Your site stops being a one-time project.",
    duration: "Ongoing",
  },
];

export default function Process() {
  return (
    <section
      id="process"
      className="relative bg-ink-0 border-t border-white/5 py-28 md:py-36"
    >
      <div className="container-pad">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
            / The WebLogic Growth System
          </p>
          <h2 className="mt-6 max-w-[20ch] text-balance font-display text-display-lg leading-[0.95] tracking-tightest text-bone">
            Strategy. Build. Launch.{" "}
            <span className="text-mute">Maintain.</span>
          </h2>
          <p className="mt-6 max-w-2xl text-pretty text-mute md:text-lg">
            Most agencies hand you a one-time website. We deliver a system that
            keeps improving every month — built around outcomes, not deliverables.
          </p>
        </motion.div>

        <ol className="mt-16 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.li
                key={s.n}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="group relative flex flex-col rounded-2xl border border-white/8 bg-ink-0 p-6 transition-all duration-500 hover:-translate-y-0.5 hover:border-white/20 md:p-7"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
                    {s.n}
                  </span>
                  <span className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-bone/80 transition-all duration-500 group-hover:border-electric/60 group-hover:text-electric">
                    <Icon className="h-4 w-4" />
                  </span>
                </div>
                <h3 className="mt-8 font-display text-2xl leading-tight tracking-tightest text-bone">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm text-mute md:text-base">{s.copy}</p>
                <span className="mt-auto pt-6 text-[10px] font-mono uppercase tracking-[0.22em] text-mute">
                  {s.duration}
                </span>
                {i < STEPS.length - 1 && (
                  <span
                    aria-hidden
                    className="pointer-events-none absolute right-[-8px] top-12 hidden h-px w-4 bg-gradient-to-r from-white/20 to-transparent lg:block"
                  />
                )}
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
