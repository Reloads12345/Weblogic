"use client";

import { ArrowUpRight } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";
import { useLeadModal } from "@/components/ui/LeadModalProvider";

/**
 * Mid-page conversion band.
 *   "Got a project? Let's talk."  + electric CTA + supporting line.
 *
 * Pure black, just like the rest. The hairline above + the urgency dot
 * pull attention without screaming.
 */
export default function MidCta() {
  const { open } = useLeadModal();

  return (
    <section
      id="mid-cta"
      className="relative bg-ink-0 border-y border-white/8 py-20 md:py-28"
    >
      <div className="container-pad grid items-center gap-10 md:grid-cols-12">
        <div className="md:col-span-7">
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.22em] text-mute">
            <span className="relative inline-flex h-2 w-2" aria-hidden>
              <span className="absolute inset-0 rounded-full bg-electric/50 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-electric" />
            </span>
            Now accepting U.S. projects
          </div>
          <h2 className="mt-5 max-w-[18ch] text-balance font-display text-display-md tracking-tightest text-bone md:text-display-lg">
            Have a project? <span className="text-mute">Get a free 24-hour audit.</span>
          </h2>
          <p className="mt-5 max-w-xl text-pretty text-mute md:text-lg">
            Send us your site and a sentence or two about your business. You'll
            get a written plan and a fixed quote — within 24 hours, no obligation.
          </p>
        </div>

        <div className="md:col-span-5 md:justify-self-end">
          <div className="flex flex-col items-start gap-3 md:items-end">
            <MagneticButton
              variant="electric"
              cursorMode="cta"
              onClick={() => open("Mid-page CTA")}
              className="!px-7 !py-4 text-sm"
            >
              Book a Free Audit
              <ArrowUpRight className="h-4 w-4" />
            </MagneticButton>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-mute">
              Avg. response: 4 hours · No SDR pipeline
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
