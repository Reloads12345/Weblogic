"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { useAssets } from "@/components/providers/AssetProvider";
import { useLeadModal } from "@/components/ui/LeadModalProvider";
import MagneticButton from "@/components/ui/MagneticButton";

/**
 * BigStatement — Webstacks-inspired two-column section.
 * Sits immediately after the Why-WebLogic manifesto on the homepage.
 *
 * Headline + Left card (composable visual + Talk-to-Expert) + Right card (team photo + Open roles).
 */
export default function BigStatement() {
  const { open: openLead } = useLeadModal();
  const { getImageUrl } = useAssets();
  const leftUrl = getImageUrl("about-team-left");
  const rightUrl = getImageUrl("about-team-right");

  return (
    <section
      id="big-statement"
      aria-labelledby="big-statement-heading"
      className="relative bg-ink-0 border-t border-white/5 py-24 md:py-32"
    >
      <div className="container-pad">
        <motion.h2
          id="big-statement-heading"
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-[24ch] text-balance font-display text-display-lg leading-[0.95] tracking-tightest text-bone md:text-display-xl"
        >
          For businesses that need{" "}
          <span className="text-mute">more than a basic website.</span>
        </motion.h2>

        <div className="mt-14 grid grid-cols-1 gap-6 md:mt-16 md:grid-cols-2">
          {/* LEFT — composable visual + Talk to Expert */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="group flex flex-col overflow-hidden rounded-3xl border border-white/8 bg-ink-0 transition-colors duration-500 hover:border-white/20"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              {leftUrl ? (
                <Image
                  src={leftUrl}
                  alt="Composable architecture visual"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  loading="lazy"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              ) : (
                <CompositionVisual />
              )}
            </div>
            <div className="flex flex-1 flex-col p-7 md:p-8">
              <h3 className="font-display text-2xl leading-tight tracking-tightest text-bone md:text-3xl">
                Future-proof websites that grow with your business.
              </h3>
              <p className="mt-4 text-pretty text-mute md:text-lg">
                Composable architecture, modern frameworks, and a cross-functional
                team to keep you ahead of what's next.
              </p>
              <div className="mt-7">
                <MagneticButton
                  variant="electric"
                  cursorMode="cta"
                  onClick={() => openLead("BigStatement · Composable")}
                  className="!px-6 !py-3"
                >
                  Book a Free Audit
                  <ArrowUpRight className="h-4 w-4" />
                </MagneticButton>
              </div>
            </div>
          </motion.div>

          {/* RIGHT — team photo + Open roles */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="group flex flex-col overflow-hidden rounded-3xl border border-white/8 bg-ink-0 transition-colors duration-500 hover:border-white/20"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              {rightUrl ? (
                <Image
                  src={rightUrl}
                  alt="WebLogic studio team"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  loading="lazy"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              ) : (
                <TeamVisual />
              )}
            </div>
            <div className="flex flex-1 flex-col p-7 md:p-8">
              <h3 className="font-display text-2xl leading-tight tracking-tightest text-bone md:text-3xl">
                Stop treating your website like a brochure.
              </h3>
              <p className="mt-4 text-pretty text-mute md:text-lg">
                WebLogic builds websites, portals, and digital systems
                designed to sell, automate, organize, and grow with your
                business.
              </p>
              <div className="mt-7">
                <MagneticButton
                  variant="electric"
                  cursorMode="cta"
                  onClick={() => openLead("BigStatement · Stop treating like brochure")}
                  className="!px-6 !py-3"
                >
                  Book a Free Audit
                  <ArrowUpRight className="h-4 w-4" />
                </MagneticButton>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* — Visual placeholders when no image uploaded — */

function CompositionVisual() {
  return (
    <div className="absolute inset-0 grid place-items-center bg-ink-100/40">
      <div className="relative h-[70%] w-[70%]">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="absolute inset-x-0 rounded-2xl border border-electric/35 bg-electric/5 transition-transform duration-700"
            style={{
              height: "22%",
              top: `${i * 22}%`,
              transform: `translateX(${i % 2 === 0 ? -14 : 14}px)`,
              boxShadow: "0 16px 48px rgba(0,82,255,0.18)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function TeamVisual() {
  return (
    <div className="absolute inset-0 grid place-items-center bg-ink-100/40">
      <div className="relative flex items-center gap-8">
        {[0, 1].map((i) => (
          <div key={i} className="relative">
            <div className="h-28 w-28 rounded-full border border-white/10 bg-gradient-to-br from-white/10 to-transparent" />
            <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-electric shadow-[0_0_14px_rgba(0,82,255,0.6)]" />
          </div>
        ))}
      </div>
    </div>
  );
}
