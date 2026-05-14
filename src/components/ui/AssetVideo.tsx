"use client";

import { useRef, useEffect, useState } from "react";
import { useAssets } from "@/components/providers/AssetProvider";
import { cn } from "@/lib/utils";

interface Props {
  slot: string;
  className?: string;
  fallback?: "solid" | "ripple" | "rays" | "noise" | "grid";
  accent?: string;
  /** Loop & autoplay (default true). Set false to play only on hover. */
  autoPlay?: boolean;
  /** When true, video pauses unless hovered. */
  hoverOnly?: boolean;
  /** Slow the playback rate (1 = normal). */
  playbackRate?: number;
}

/**
 * AssetVideo (production)
 *  - Plays the video uploaded to /public/uploads/[slot].(mp4|webm) if present.
 *  - When hoverOnly is true, plays on mouseenter, pauses on mouseleave.
 *  - When no video is uploaded, shows a tasteful matte placeholder
 *    that subtly responds to hover. NO play button, NO upload chip.
 */
export default function AssetVideo({
  slot,
  className,
  fallback = "solid",
  accent = "#0052ff",
  autoPlay = true,
  hoverOnly = false,
  playbackRate = 1,
}: Props) {
  const { getVideoUrl } = useAssets();
  const videoUrl = getVideoUrl(slot);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.playbackRate = playbackRate;
  }, [playbackRate, videoUrl]);

  useEffect(() => {
    if (!hoverOnly) return;
    const v = videoRef.current;
    if (!v) return;
    if (hovered) {
      v.currentTime = 0;
      v.playbackRate = playbackRate;
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [hovered, hoverOnly, videoUrl, playbackRate]);

  const showVideo = Boolean(videoUrl);

  return (
    <div
      className={cn("relative overflow-hidden bg-ink-0", className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {showVideo ? (
        <video
          ref={videoRef}
          src={videoUrl}
          autoPlay={!hoverOnly && autoPlay}
          muted
          loop={!hoverOnly}
          playsInline
          preload={hoverOnly ? "metadata" : "auto"}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <Placeholder kind={fallback} accent={accent} hovered={hovered} hoverOnly={hoverOnly} />
      )}

      {/* Subtle bottom vignette only — no overlays, no UI */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-0/55 via-transparent to-transparent" />
    </div>
  );
}

function Placeholder({
  kind,
  accent,
  hovered,
  hoverOnly,
}: {
  kind: Props["fallback"];
  accent: string;
  hovered: boolean;
  hoverOnly: boolean;
}) {
  if (kind === "solid" || !kind) {
    return (
      <div className="absolute inset-0 bg-ink-0">
        <div
          className={cn(
            "absolute inset-0 transition-opacity duration-700",
            hovered ? "opacity-100" : hoverOnly ? "opacity-40" : "opacity-100",
          )}
          style={{
            background: `radial-gradient(60% 80% at 50% 100%, ${accent}1a, transparent 70%)`,
          }}
        />
      </div>
    );
  }
  if (kind === "rays") {
    return (
      <div className="absolute inset-0 bg-ink-0">
        <div
          className="absolute inset-0 opacity-50"
          style={{ background: `radial-gradient(80% 60% at 50% 100%, ${accent}28 0%, transparent 60%)` }}
        />
      </div>
    );
  }
  return <div className="absolute inset-0 bg-ink-0" />;
}
