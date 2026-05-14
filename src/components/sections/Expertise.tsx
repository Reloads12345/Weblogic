"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { EXPERTISE } from "@/lib/data";
import AssetVideo from "@/components/ui/AssetVideo";

/**
 * Capabilities — clean 3-col × 2-row grid.
 *
 * Each card is a Next.js Link wrapping the whole article so the whole card is
 * clickable AND the video underneath still receives onMouseEnter/Leave (the
 * previous absolute Link overlay was blocking those events — that's why the
 * hover-play wasn't firing).
 */
export default function Expertise() {
  return (
    <section
      id="expertise"
      className="relative bg-ink-0 py-24 md:py-32 border-t border-white/5"
    >
      <div className="container-pad">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="grid items-end gap-8 md:grid-cols-12"
        >
          <div className="md:col-span-7">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
              / What we do
            </p>
            <h2 className="mt-6 max-w-[16ch] text-balance font-display text-display-lg leading-[0.95] tracking-tightest text-bone">
              Six disciplines.{" "}
              <span className="text-mute">One operating system for the modern web.</span>
            </h2>
          </div>
          <p className="md:col-span-5 text-pretty text-mute md:text-lg">
            We don't sell deliverables — we operate the marketing engine that powers
            your category. Click any card to dive deeper.
          </p>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {EXPERTISE.map((tile, i) => (
            <motion.div
              key={tile.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.65, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                href="/#services"
                data-cursor="link"
                aria-label={`See ${tile.title} services and pricing`}
                className="group block overflow-hidden rounded-2xl border border-white/8 bg-ink-0 transition-all duration-500 hover:-translate-y-0.5 hover:border-white/25"
              >
                {/* Media area — receives mouse events directly; no overlay */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <AssetVideo
                    slot={tile.videoSlot}
                    fallback="solid"
                    hoverOnly
                    className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col p-6 md:p-7">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-mute">
                    {tile.eyebrow}
                  </p>
                  <h3 className="mt-3 font-display text-2xl leading-tight tracking-tightest text-bone transition-colors duration-500 group-hover:text-electric">
                    {tile.title}
                  </h3>
                  <p className="mt-2 text-sm text-mute md:text-base">{tile.copy}</p>

                  <ul className="mt-5 flex flex-wrap gap-1.5">
                    {tile.bullets.map((b) => (
                      <li
                        key={b}
                        className="rounded-full border border-white/8 px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.16em] text-white/55"
                      >
                        {b}
                      </li>
                    ))}
                  </ul>

                  <span className="mt-6 inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-[0.2em] text-mute transition-colors group-hover:text-electric">
                    See pricing
                    <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
