"use client";

import { ArrowUpRight, Github, Linkedin, Twitter, Youtube } from "lucide-react";
import Logo from "@/components/ui/Logo";
import RemoteCoverageGlobe from "@/components/globe/RemoteCoverageGlobe";
import MagneticButton from "@/components/ui/MagneticButton";
import { useLeadModal } from "@/components/ui/LeadModalProvider";
import { BRAND, NAV } from "@/lib/data";

export default function Footer() {
  const { open: openLead } = useLeadModal();
  return (
    <footer
      id="footer"
      className="relative bg-ink-0 border-t border-white/10 pt-24 md:pt-32"
    >
      {/* Final CTA */}
      <div className="container-pad grid gap-12 md:grid-cols-12">
        <div className="md:col-span-7">
          <p className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.22em] text-mute">
            <span className="relative inline-flex h-2 w-2" aria-hidden>
              <span className="absolute inset-0 rounded-full bg-electric/55 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-electric" />
            </span>
            Studio open
          </p>
          <h2 className="mt-5 max-w-[18ch] text-balance font-display text-display-lg leading-[0.93] tracking-tightest text-bone">
            Websites & systems that{" "}
            <span className="text-electric">evolve with your business.</span>
          </h2>
          <p className="mt-5 max-w-xl text-pretty text-mute md:text-lg">
            Send your site and a sentence about your business. You'll get a written
            plan and a fixed quote within 24 hours — no obligation.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <MagneticButton
              variant="electric"
              cursorMode="cta"
              onClick={() => openLead("Footer · Free Audit")}
              className="!px-7 !py-3.5"
            >
              Book a Free Audit
              <ArrowUpRight className="h-4 w-4" />
            </MagneticButton>
            <a href={`mailto:${BRAND.email}`} className="btn-ghost text-sm" data-cursor="link">
              {BRAND.email}
            </a>
          </div>
        </div>

        {/* Remote U.S. coverage globe — dark cinematic Earth with U.S. city
            labels. Component lazy-mounts on scroll-into-view; respects
            prefers-reduced-motion; has its own pause button + honesty note. */}
        <div className="relative md:col-span-5">
          <RemoteCoverageGlobe />
        </div>
      </div>

      {/* Newsletter band removed — no content cadence yet. Add back when there's
          a real publishing plan. The component below is preserved but unused. */}

      {/* Mega-link grid mirroring nav */}
      <div className="container-pad mt-16 grid grid-cols-2 gap-8 border-t border-white/8 pt-12 md:grid-cols-6">
        {NAV.find((n) => n.label === "Solutions")?.mega?.map((col) => (
          <div key={col.heading}>
            <p className="eyebrow mb-3">{col.heading}</p>
            <ul className="space-y-2">
              {col.links.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-sm text-mute transition-colors hover:text-bone"
                    data-cursor="link"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
        {/* Studio column */}
        <div>
          <p className="eyebrow mb-3">Studio</p>
          <ul className="space-y-2 text-sm text-mute">
            <li><a href="/#case-studies" className="hover:text-bone">Work</a></li>
            <li><a href="/#insights" className="hover:text-bone">Insights</a></li>
            <li><a href="/#testimonials" className="hover:text-bone">Testimonials</a></li>
            <li><a href="/press-kit" className="hover:text-bone">Press kit</a></li>
          </ul>
        </div>
      </div>

      {/* Social row */}
      <div className="container-pad mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-white/8 pt-6">
        <div className="flex items-center gap-2">
          {[
            { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/company/weblogic-studio" },
            { icon: Twitter, label: "X / Twitter", href: "https://x.com/weblogicstudio" },
            { icon: Youtube, label: "YouTube", href: "https://youtube.com/@weblogicstudio" },
            { icon: Github, label: "GitHub", href: "https://github.com/weblogic-studio" },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="link"
                className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-white/65 transition-all duration-300 hover:-translate-y-0.5 hover:border-electric/60 hover:text-electric hover:shadow-[0_0_0_4px_rgba(0,82,255,0.08)]"
              >
                <Icon className="h-4 w-4" />
              </a>
            );
          })}
        </div>
        <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-mute">
          Built remotely · United States
        </p>
      </div>

      {/* Wordmark band */}
      <div className="relative mt-12 overflow-hidden border-t border-white/8 py-12">
        <Logo size="xl" />
        <p
          aria-hidden
          className="container-pad mt-4 select-none font-display leading-[0.85] tracking-tightest text-bone/[0.04]"
          style={{ fontSize: "clamp(5rem, 18vw, 22rem)" }}
        >
          WebLogic
        </p>
      </div>

      {/* Sub-footer */}
      <div className="container-pad flex flex-col items-start justify-between gap-4 border-t border-white/8 py-6 text-[10px] font-mono uppercase tracking-[0.18em] text-mute md:flex-row md:items-center">
        <p>
          © {new Date().getFullYear()} {BRAND.name} Studio. All rights reserved.
        </p>
        <ul className="flex flex-wrap gap-4">
          <li><a href="/privacy" className="transition-colors hover:text-bone">Privacy</a></li>
          <li><a href="/terms" className="transition-colors hover:text-bone">Terms</a></li>
          <li><a href="/security" className="transition-colors hover:text-bone">Security</a></li>
          <li><a href="/accessibility" className="transition-colors hover:text-bone">Accessibility</a></li>
          <li><a href="/press-kit" className="transition-colors hover:text-bone">Press kit</a></li>
        </ul>
        <p className="flex items-center gap-2">
          <span className="relative inline-flex h-2 w-2" aria-hidden>
            <span className="absolute inset-0 rounded-full bg-electric/55 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-electric" />
          </span>
          All systems operational
        </p>
      </div>
    </footer>
  );
}

