"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useSound } from "@/components/providers/SoundProvider";

export default function SoundToggle() {
  const { enabled, toggle } = useSound();
  return (
    <button
      type="button"
      onClick={toggle}
      data-cursor="link"
      className="fixed top-[88px] right-5 z-[140] grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-ink-100/80 text-white/70 backdrop-blur transition hover:border-electric/50 hover:text-electric"
      aria-label={enabled ? "Mute UI sound" : "Enable UI sound"}
      title={enabled ? "Mute UI sound" : "Enable UI sound"}
    >
      {enabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
    </button>
  );
}
