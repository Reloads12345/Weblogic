"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Persona } from "@/types";

interface PersonalizationCopy {
  heroEyebrow: string;
  heroHeadlineSlot: string; // word that swaps in headline
  heroSub: string;
  ctaPrimary: string;
  prioritizedCaseStudies: string[]; // slugs
  primaryStatLabel: string;
  primaryStatValue: string;
}

const COPY: Record<Persona, PersonalizationCopy> = {
  default: {
    heroEyebrow: "Composable web engineering studio",
    heroHeadlineSlot: "visionary brands",
    heroSub:
      "Precision-engineered digital ecosystems for visionary brands that scale with ambition.",
    ctaPrimary: "Talk to an Expert",
    prioritizedCaseStudies: ["gong", "calendly", "servicetitan", "snowflake-university"],
    primaryStatLabel: "Avg. organic lift",
    primaryStatValue: "+340%",
  },
  "marketing-leader": {
    heroEyebrow: "For CMOs & VPs of Marketing",
    heroHeadlineSlot: "marketing teams",
    heroSub:
      "Ship campaigns at the velocity of your product. Composable websites that let your team move 4× faster — with zero engineering tax.",
    ctaPrimary: "Book a Strategy Call",
    prioritizedCaseStudies: ["calendly", "gong", "servicetitan", "snowflake-university"],
    primaryStatLabel: "Faster time-to-publish",
    primaryStatValue: "−74%",
  },
  founder: {
    heroEyebrow: "For Founders & Operators",
    heroHeadlineSlot: "category leaders",
    heroSub:
      "Look like the company you're becoming, not the one you started. Composable websites engineered for the next funding round.",
    ctaPrimary: "Talk to a Founder",
    prioritizedCaseStudies: ["gong", "calendly", "snowflake-university", "servicetitan"],
    primaryStatLabel: "Pipeline lift",
    primaryStatValue: "4.8×",
  },
  engineering: {
    heroEyebrow: "For Engineering Leaders",
    heroHeadlineSlot: "engineering teams",
    heroSub:
      "Type-safe content models, edge-first SSR, RUM-driven performance budgets. We ship in your repo, your standup, your stack.",
    ctaPrimary: "Review the Architecture",
    prioritizedCaseStudies: ["servicetitan", "snowflake-university", "gong", "calendly"],
    primaryStatLabel: "Lighthouse median",
    primaryStatValue: "98",
  },
  fintech: {
    heroEyebrow: "For Fintech & Financial Services",
    heroHeadlineSlot: "fintech leaders",
    heroSub:
      "Trust is the only conversion metric that matters. We engineer fintech experiences that compound trust on every scroll.",
    ctaPrimary: "Talk to Fintech Practice",
    prioritizedCaseStudies: ["calendly", "gong", "servicetitan", "snowflake-university"],
    primaryStatLabel: "Demo conversion",
    primaryStatValue: "+92%",
  },
  saas: {
    heroEyebrow: "For B2B SaaS",
    heroHeadlineSlot: "B2B SaaS leaders",
    heroSub:
      "Composable websites built for the PLG-to-enterprise transition. Personalization, performance, and pipeline — engineered together.",
    ctaPrimary: "Talk to a SaaS Expert",
    prioritizedCaseStudies: ["calendly", "gong", "servicetitan", "snowflake-university"],
    primaryStatLabel: "Pipeline growth",
    primaryStatValue: "4.8×",
  },
};

interface Ctx {
  persona: Persona;
  copy: PersonalizationCopy;
  setPersona: (p: Persona) => void;
}

const PersonalizationCtx = createContext<Ctx | null>(null);

const STORAGE_KEY = "weblogic.persona";

function detectFromQuery(): Persona | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  const raw = (params.get("persona") || params.get("role") || params.get("industry") || "")
    .toLowerCase()
    .trim();
  const aliases: Record<string, Persona> = {
    cmo: "marketing-leader",
    vp: "marketing-leader",
    "marketing-leader": "marketing-leader",
    marketing: "marketing-leader",
    founder: "founder",
    ceo: "founder",
    operator: "founder",
    eng: "engineering",
    engineering: "engineering",
    cto: "engineering",
    fintech: "fintech",
    finance: "fintech",
    payments: "fintech",
    saas: "saas",
    "b2b-saas": "saas",
  };
  return aliases[raw] ?? null;
}

export default function PersonalizationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [persona, setPersonaState] = useState<Persona>("default");

  useEffect(() => {
    const fromQuery = detectFromQuery();
    if (fromQuery) {
      setPersonaState(fromQuery);
      try {
        localStorage.setItem(STORAGE_KEY, fromQuery);
      } catch {}
      return;
    }
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Persona | null;
      if (stored && COPY[stored]) setPersonaState(stored);
    } catch {}
  }, []);

  const setPersona = useCallback((p: Persona) => {
    setPersonaState(p);
    try {
      localStorage.setItem(STORAGE_KEY, p);
    } catch {}
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      persona,
      copy: COPY[persona] ?? COPY.default,
      setPersona,
    }),
    [persona, setPersona],
  );

  return (
    <PersonalizationCtx.Provider value={value}>{children}</PersonalizationCtx.Provider>
  );
}

export function usePersonalization() {
  const ctx = useContext(PersonalizationCtx);
  if (!ctx) throw new Error("usePersonalization must be used within PersonalizationProvider");
  return ctx;
}

export const PERSONA_OPTIONS: { id: Persona; label: string }[] = [
  { id: "default", label: "Default" },
  { id: "marketing-leader", label: "Marketing leader" },
  { id: "founder", label: "Founder / Operator" },
  { id: "engineering", label: "Engineering" },
  { id: "fintech", label: "Fintech" },
  { id: "saas", label: "B2B SaaS" },
];
