"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { useSound } from "@/components/providers/SoundProvider";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "electric" | "ghost";
  magneticStrength?: number;
  magneticRadius?: number;
  cursorMode?: "cta" | "link" | "drag" | "video";
  /**
   * Indicates the button is performing an async action. Visually distinct
   * from `disabled` (which means "you cannot click this") — `loading` means
   * "you already clicked, hold tight." Both prevent activation.
   */
  loading?: boolean;
}

/**
 * MagneticButton — the brand's primary CTA component.
 *
 * Behavior contract:
 *  - `disabled` and `loading` both fully suppress activation (no click,
 *    no hover sound) and disable the magnetic cursor pull so the button
 *    can't "follow" the cursor while inert.
 *  - Forwards every native `<button>` attribute, so `type="submit"`,
 *    `form="…"`, `name`, `value`, ARIA, etc. all work as expected when used
 *    inside a real `<form>`.
 *  - Visual disabled state is applied via Tailwind utility — no global CSS.
 */
const MagneticButton = forwardRef<HTMLButtonElement, Props>(function MagneticButton(
  {
    className,
    children,
    variant = "electric",
    magneticStrength = 0.35,
    magneticRadius = 110,
    cursorMode,
    loading = false,
    disabled,
    onClick,
    onMouseEnter,
    type,
    ...props
  },
  ref,
) {
  const { play } = useSound();
  const inert = Boolean(disabled || loading);

  return (
    <button
      ref={ref}
      // `type` defaults to "button" so the button never accidentally submits
      // its enclosing form unless the caller explicitly opts in.
      type={type ?? "button"}
      disabled={inert}
      aria-busy={loading || undefined}
      aria-disabled={inert || undefined}
      // Magnetic attributes only emitted when active — the global cursor
      // hook reads these and won't latch onto an inert button.
      data-magnetic={inert ? undefined : true}
      data-magnetic-strength={inert ? undefined : magneticStrength}
      data-magnetic-radius={inert ? undefined : magneticRadius}
      data-cursor={inert ? undefined : cursorMode ?? (variant === "electric" ? "cta" : "link")}
      onMouseEnter={(e) => {
        if (inert) return;
        play("hover");
        onMouseEnter?.(e);
      }}
      onClick={(e) => {
        if (inert) {
          e.preventDefault();
          return;
        }
        play("click");
        onClick?.(e);
      }}
      className={cn(
        "magnetic-target inline-flex items-center gap-2 select-none transition-opacity",
        variant === "electric" && "btn-electric",
        variant === "ghost" && "btn-ghost",
        inert && "cursor-not-allowed opacity-60",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
});

export default MagneticButton;
