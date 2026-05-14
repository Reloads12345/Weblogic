"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { TESTIMONIALS } from "@/lib/data";

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      className="relative bg-ink-0 border-t border-white/5 py-24 md:py-32"
    >
      <div className="container-pad">
        <div className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="eyebrow">/ Trusted by</p>
            <h2 className="section-h mt-4 max-w-[18ch] text-balance">
              The teams behind the brands you{" "}
              <span className="text-electric">already trust</span>.
            </h2>
            <p className="mt-5 max-w-md text-mute">
              We work with operators who treat their website like the product it is.
              Here's what they say about working with us.
            </p>
          </div>
          <div className="md:col-span-7">
            <ul className="grid gap-4">
              {TESTIMONIALS.map((t, i) => (
                <motion.li
                  key={t.id}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="group relative grid grid-cols-[auto_1fr] gap-5 rounded-2xl border border-white/8 bg-ink-0 p-6 transition-colors duration-500 hover:border-white/20 md:p-7"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-full border border-electric/30 bg-electric/10 text-electric">
                    <Quote className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-pretty text-base leading-snug text-bone md:text-lg">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span
                          aria-hidden
                          className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-electric/40 to-ink-200 text-xs font-mono uppercase tracking-widest"
                        >
                          {t.headshot}
                        </span>
                        <div className="text-sm leading-tight">
                          <p className="text-bone">{t.name}</p>
                          <p className="text-xs text-mute">
                            {t.title} · <span className="text-bone">{t.company}</span>
                          </p>
                        </div>
                      </div>
                      {t.metric && (
                        <div className="rounded-lg border border-white/10 px-3 py-1.5">
                          <p className="font-display text-sm tracking-tight text-bone">
                            {t.metric.value}
                          </p>
                          <p className="text-[9px] font-mono uppercase tracking-[0.18em] text-mute">
                            {t.metric.label}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
