"use client";

import {
  NextjsIcon,
  VercelIcon,
  StoryblokIcon,
  SanityIcon,
  ContentfulIcon,
  HubSpotIcon,
  AlgoliaIcon,
  CloudflareIcon,
  TypeScriptIcon,
  TailwindIcon,
  FramerIcon,
  ThreeJsIcon,
} from "@/components/ui/TechLogos";

/**
 * "Built on industry-standard infrastructure" marquee.
 *
 * Previously framed as "Trusted by category leaders" with brand logos that
 * implied client relationships. Replaced with the actual tools and platforms
 * WebLogic builds and deploys on — defensible and honest.
 */
const STACK = [
  { name: "Next.js", Component: NextjsIcon },
  { name: "Vercel", Component: VercelIcon },
  { name: "TypeScript", Component: TypeScriptIcon },
  { name: "Tailwind", Component: TailwindIcon },
  { name: "Storyblok", Component: StoryblokIcon },
  { name: "Sanity", Component: SanityIcon },
  { name: "Contentful", Component: ContentfulIcon },
  { name: "HubSpot", Component: HubSpotIcon },
  { name: "Algolia", Component: AlgoliaIcon },
  { name: "Cloudflare", Component: CloudflareIcon },
  { name: "Framer Motion", Component: FramerIcon },
  { name: "Three.js", Component: ThreeJsIcon },
];

export default function ClientLogos() {
  const row = [...STACK, ...STACK, ...STACK];
  return (
    <section
      aria-labelledby="stack-heading"
      className="relative bg-ink-0 border-t border-white/5 py-14"
    >
      <div className="container-pad mb-8">
        <h2
          id="stack-heading"
          className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute"
        >
          / Built on industry-standard infrastructure
        </h2>
      </div>
      <div className="mask-fade-edges overflow-hidden">
        <div
          className="wl-marquee-ltr flex w-max items-center gap-12 will-change-transform"
          style={{ ["--marquee-duration" as never]: "60s" }}
        >
          {row.map(({ name, Component }, i) => (
            <span
              key={`${name}-${i}`}
              className="inline-flex shrink-0 items-center gap-3 text-bone/55 transition-colors duration-300 hover:text-bone"
            >
              <Component className="h-7 w-auto md:h-8" />
              <span className="font-display text-2xl tracking-tightest md:text-3xl">
                {name}
              </span>
              <span className="mx-2 text-bone/15 text-2xl md:text-3xl">·</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
