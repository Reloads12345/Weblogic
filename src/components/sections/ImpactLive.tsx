"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Activity, Cloud, Gauge, Globe2 } from "lucide-react";
import { IMPACT } from "@/lib/data";
import Counter from "@/components/ui/Counter";

const LIVE_SIGNALS = [
  { icon: Gauge, label: "Avg. deployment", value: "2.3s" },
  { icon: Activity, label: "Uptime · 90d", value: "99.99%" },
  { icon: Cloud, label: "Edge regions", value: "275+" },
  { icon: Globe2, label: "Median TTFB", value: "180ms" },
];

export default function ImpactLive() {
  const [liveTick, setLiveTick] = useState(2410);
  useEffect(() => {
    const id = setInterval(() => setLiveTick((n) => n + Math.floor(1 + Math.random() * 3)), 4200);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="impact" className="relative bg-ink-0 border-y border-white/5 py-24">
      <div className="container-pad">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end"
        >
          <div>
            <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
              <span className="relative inline-flex h-2 w-2" aria-hidden>
                <span className="absolute inset-0 rounded-full bg-electric/55 animate-ping" />
                <span className="relative h-2 w-2 rounded-full bg-electric" />
              </span>
              Impact · live
            </p>
            <h2 className="mt-6 max-w-[20ch] text-pretty font-display text-display-md tracking-tightest text-bone md:text-display-lg">
              The numbers behind the work,{" "}
              <span className="text-mute">updated as you scroll.</span>
            </h2>
          </div>
          <div className="rounded-xl border border-white/10 px-4 py-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
              Optimizations shipped today
            </p>
            <p className="mt-1 font-display text-3xl tracking-tightest text-bone">
              {liveTick.toLocaleString()}
            </p>
          </div>
        </motion.div>

        {/* Big stat grid — staggered fade-in on scroll */}
        <ul className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/8 bg-white/8 md:grid-cols-3 lg:grid-cols-6">
          {IMPACT.map((m, i) => (
            <motion.li
              key={m.label}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.65, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              className="bg-ink-0 p-6 transition-colors duration-300 hover:bg-white/[0.02]"
            >
              <p className="font-display text-3xl tracking-tightest text-bone md:text-4xl">
                <Counter
                  value={m.value}
                  prefix={m.prefix}
                  suffix={m.suffix}
                  decimals={m.decimals ?? 0}
                />
              </p>
              <p className="mt-2 text-[10px] font-mono uppercase tracking-[0.2em] text-mute">
                {m.label}
              </p>
            </motion.li>
          ))}
        </ul>

        {/* Live infrastructure signals */}
        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
          {LIVE_SIGNALS.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: 0.4 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-3 rounded-xl border border-white/8 bg-ink-0 px-4 py-3"
              >
                <span className="grid h-8 w-8 place-items-center rounded-lg border border-electric/40 text-electric">
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <div>
                  <p className="font-display text-lg tracking-tightest text-bone">{s.value}</p>
                  <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-mute">
                    {s.label}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
