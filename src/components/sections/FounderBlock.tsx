"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useAssets } from "@/components/providers/AssetProvider";

/**
 * FounderBlock — small homepage section that humanizes the studio.
 * Honest, single-person framing. No fake team of 47.
 */
export default function FounderBlock() {
  const { getImageUrl } = useAssets();
  const photo = getImageUrl("founder-photo");

  return (
    <section
      aria-labelledby="founder-heading"
      className="relative bg-ink-0 border-t border-white/5 py-20 md:py-28"
    >
      <div className="container-pad">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto flex max-w-4xl flex-col items-start gap-8 rounded-3xl border border-white/8 bg-ink-0 p-7 md:flex-row md:items-center md:gap-12 md:p-10"
        >
          {/* Headshot */}
          <div className="relative shrink-0">
            <div className="relative h-28 w-28 overflow-hidden rounded-full border border-white/12 bg-gradient-to-br from-electric/20 to-transparent md:h-36 md:w-36">
              {photo ? (
                <Image
                  src={photo}
                  alt="Caleb Gathu — Founder, WebLogic"
                  fill
                  sizes="(max-width: 768px) 112px, 144px"
                  loading="lazy"
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 grid place-items-center font-display text-3xl tracking-tightest text-bone/60 md:text-4xl">
                  CG
                </div>
              )}
            </div>
            <span className="absolute -bottom-1 left-1/2 inline-flex h-3 w-3 -translate-x-1/2 items-center justify-center" aria-hidden>
              <span className="absolute inset-0 rounded-full bg-electric/55 animate-ping" />
              <span className="relative h-3 w-3 rounded-full bg-electric shadow-[0_0_12px_rgba(0,82,255,0.85)]" />
            </span>
          </div>

          {/* Bio */}
          <div className="flex-1">
            <p id="founder-heading" className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
              / Built by
            </p>
            <h2 className="mt-3 font-display text-3xl leading-tight tracking-tightest text-bone md:text-4xl">
              Caleb Gathu · Founder
            </h2>
            <p className="mt-4 max-w-2xl text-pretty text-mute md:text-lg">
              WebLogic is a small studio — not a 47-person agency. I personally
              architect and ship every engagement, with a tight network of senior
              engineers and designers for surge capacity. Direct access, fast
              decisions, written quotes, and a single point of contact from
              audit to launch.
            </p>
            <Link
              href="/about"
              data-cursor="link"
              className="mt-6 inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.22em] text-bone transition-colors hover:text-electric"
            >
              Read more about WebLogic
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
