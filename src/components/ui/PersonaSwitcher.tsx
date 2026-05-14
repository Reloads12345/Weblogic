"use client";

import { useState } from "react";
import { Sparkles, Check } from "lucide-react";
import {
  PERSONA_OPTIONS,
  usePersonalization,
} from "@/components/providers/PersonalizationProvider";
import { cn } from "@/lib/utils";

export default function PersonaSwitcher() {
  const { persona, setPersona } = usePersonalization();
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-5 left-5 z-[150]">
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        data-cursor="link"
        className="flex items-center gap-2 rounded-full border border-white/10 bg-ink-100/90 px-4 py-2.5 text-xs font-mono uppercase tracking-[0.18em] text-white/80 backdrop-blur-md transition-all hover:border-electric/50 hover:text-electric"
      >
        <Sparkles className="h-3.5 w-3.5 text-electric" />
        Personalized
        <span className="rounded-full bg-electric/20 px-2 py-0.5 text-[9px] text-electric">
          {persona === "default" ? "Default" : persona.replace("-", " ")}
        </span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute bottom-full left-0 mb-2 w-64 overflow-hidden rounded-2xl border border-white/10 bg-ink-50/95 shadow-glow-md backdrop-blur"
        >
          <div className="border-b border-white/10 px-4 py-3">
            <p className="eyebrow text-electric">Personalization</p>
            <p className="mt-1 text-xs text-mute">
              Switch the visitor profile to see hero, CTAs, and case-study order adapt in real time.
            </p>
          </div>
          <ul className="py-1">
            {PERSONA_OPTIONS.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => {
                    setPersona(p.id);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between px-4 py-2 text-left text-sm transition",
                    persona === p.id
                      ? "bg-electric/10 text-electric"
                      : "text-white/80 hover:bg-white/5",
                  )}
                >
                  {p.label}
                  {persona === p.id && <Check className="h-3.5 w-3.5" />}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
