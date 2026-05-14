import dynamic from "next/dynamic";
import Header from "@/components/nav/Header";
import Hero from "@/components/hero/Hero";
import ClientLogos from "@/components/sections/ClientLogos";
import WhyWebsitesFail from "@/components/sections/WhyWebsitesFail";
import Manifesto from "@/components/sections/Manifesto";
import Services from "@/components/sections/Services";
import BigStatement from "@/components/sections/BigStatement";
import Expertise from "@/components/sections/Expertise";
import WorkGallery from "@/components/sections/WorkGallery";
import { TESTIMONIALS } from "@/lib/data";
import { getWorkItems } from "@/lib/work-store";

/**
 * Below-fold sections are dynamic-imported so they don't bloat the initial
 * JS bundle. They still render server-side (no `ssr: false`) — Next.js just
 * splits the JS so the browser can defer parsing.
 *
 * Each `loading` is a thin placeholder matching the section's vertical size,
 * which prevents CLS while the chunk arrives.
 */
const Process = dynamic(() => import("@/components/sections/Process"), {
  loading: () => <SectionPlaceholder h="h-[480px]" />,
});
const FounderBlock = dynamic(() => import("@/components/sections/FounderBlock"), {
  loading: () => <SectionPlaceholder h="h-[560px]" />,
});
const ImpactLive = dynamic(() => import("@/components/sections/ImpactLive"), {
  loading: () => <SectionPlaceholder h="h-[420px]" />,
});
const GlobalReach = dynamic(() => import("@/components/sections/GlobalReach"), {
  loading: () => <SectionPlaceholder h="h-[480px]" />,
});
const Testimonials = dynamic(() => import("@/components/sections/Testimonials"), {
  loading: () => <SectionPlaceholder h="h-[420px]" />,
});
const MidCta = dynamic(() => import("@/components/sections/MidCta"), {
  loading: () => <SectionPlaceholder h="h-[360px]" />,
});
const LeadMagnet = dynamic(() => import("@/components/sections/LeadMagnet"), {
  loading: () => <SectionPlaceholder h="h-[560px]" />,
});
const Insights = dynamic(() => import("@/components/sections/Insights"), {
  loading: () => <SectionPlaceholder h="h-[640px]" />,
});
const TechStack = dynamic(() => import("@/components/sections/TechStack"), {
  loading: () => <SectionPlaceholder h="h-[480px]" />,
});
const FaqSection = dynamic(() => import("@/components/sections/FAQ"), {
  loading: () => <SectionPlaceholder h="h-[640px]" />,
});
const FounderQuote = dynamic(() => import("@/components/sections/FounderQuote"), {
  loading: () => <SectionPlaceholder h="h-[420px]" />,
});
const Footer = dynamic(() => import("@/components/sections/Footer"), {
  loading: () => <SectionPlaceholder h="h-[480px]" />,
});

function SectionPlaceholder({ h }: { h: string }) {
  return (
    <div
      aria-hidden
      className={`${h} w-full border-b border-white/5 bg-ink-0`}
    />
  );
}

export default async function Home() {
  const showTestimonials = TESTIMONIALS.length > 0;
  const workItems = await getWorkItems();

  return (
    <>
      <Header />
      <main className="relative">
        {/* Above-fold: eager so first paint is instant */}
        <Hero />
        <ClientLogos />
        <WhyWebsitesFail />
        <Manifesto />
        <Services />
        <BigStatement />
        <Expertise />
        <WorkGallery items={workItems} />

        {/* Below-fold: dynamic-imported to shrink initial JS */}
        <Process />
        <FounderBlock />
        <ImpactLive />
        <GlobalReach />
        {showTestimonials && <Testimonials />}
        <MidCta />
        <LeadMagnet />
        <Insights />
        <TechStack />
        <FaqSection />
        <FounderQuote />
        <Footer />
      </main>
    </>
  );
}
