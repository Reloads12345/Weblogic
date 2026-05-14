"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

type SoundKind = "click" | "hover" | "open" | "close" | "scroll-tick";

interface Ctx {
  enabled: boolean;
  toggle: () => void;
  play: (kind: SoundKind) => void;
}

const SoundCtx = createContext<Ctx | null>(null);

const STORAGE_KEY = "weblogic.sound";

/**
 * Lightweight, dependency-free Web Audio "UI sound" generator.
 * No audio files needed — synth blips per kind.
 */
function makeSynth() {
  if (typeof window === "undefined") return null;
  const AudioCtor =
    (window as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext })
      .AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtor) return null;
  const ctx = new AudioCtor();

  function blip(freq: number, dur: number, vol = 0.04, type: OscillatorType = "sine") {
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.value = freq;
    o.connect(g);
    g.connect(ctx.destination);
    const t = ctx.currentTime;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.start(t);
    o.stop(t + dur + 0.02);
  }

  return {
    play(kind: SoundKind) {
      switch (kind) {
        case "click":
          blip(880, 0.08, 0.05, "triangle");
          break;
        case "hover":
          blip(1320, 0.04, 0.02, "sine");
          break;
        case "open":
          blip(520, 0.12, 0.05, "sine");
          setTimeout(() => blip(780, 0.1, 0.04, "sine"), 60);
          break;
        case "close":
          blip(620, 0.08, 0.04, "sine");
          setTimeout(() => blip(380, 0.1, 0.03, "sine"), 50);
          break;
        case "scroll-tick":
          blip(1600, 0.02, 0.012, "sine");
          break;
      }
    },
    suspend() {
      ctx.suspend().catch(() => {});
    },
  };
}

export default function SoundProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState(false);
  const synthRef = useRef<ReturnType<typeof makeSynth>>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "1") setEnabled(true);
    } catch {}
  }, []);

  useEffect(() => {
    if (enabled && !synthRef.current) {
      synthRef.current = makeSynth();
    }
  }, [enabled]);

  const toggle = useCallback(() => {
    setEnabled((e) => {
      const next = !e;
      try {
        localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      } catch {}
      if (!next) synthRef.current?.suspend();
      return next;
    });
  }, []);

  const play = useCallback(
    (kind: SoundKind) => {
      if (!enabled) return;
      synthRef.current?.play(kind);
    },
    [enabled],
  );

  const value = useMemo<Ctx>(() => ({ enabled, toggle, play }), [enabled, toggle, play]);

  return <SoundCtx.Provider value={value}>{children}</SoundCtx.Provider>;
}

export function useSound() {
  const ctx = useContext(SoundCtx);
  if (!ctx) throw new Error("useSound must be used within SoundProvider");
  return ctx;
}
