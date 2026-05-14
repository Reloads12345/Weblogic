import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          0: "#000000",
          50: "#0a0a0a",
          100: "#111111",
          200: "#1a1a1a",
          300: "#242424",
          400: "#2e2e2e",
        },
        bone: "#ffffff",
        mute: "#8e8e93",
        electric: {
          DEFAULT: "#0052ff",
          50: "#e6efff",
          100: "#b8ceff",
          200: "#7ea8ff",
          300: "#4f86ff",
          400: "#2c6cff",
          500: "#0052ff",
          600: "#0040cc",
          700: "#002f99",
          800: "#001f66",
          900: "#001033",
          glow: "rgba(0, 82, 255, 0.45)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      fontSize: {
        /*
          Display sizes use a `clamp(min, pref, max)` curve so they scale
          smoothly with viewport width. The `vw`-based middle term ensures
          they react to zoom changes, and the `rem` max cap prevents the
          headline from blowing up when the user zooms way out on a 4K
          monitor — that's the "demorphed" failure mode we saw before.
        */
        "display-xl": ["clamp(3rem, 7vw, 7.5rem)", { lineHeight: "0.94", letterSpacing: "-0.045em" }],
        "display-lg": ["clamp(2.5rem, 5.25vw, 5.25rem)", { lineHeight: "0.96", letterSpacing: "-0.04em" }],
        "display-md": ["clamp(1.875rem, 3.75vw, 3.5rem)", { lineHeight: "1", letterSpacing: "-0.035em" }],
        eyebrow: ["0.6875rem", { lineHeight: "1.2", letterSpacing: "0.18em" }],
      },
      letterSpacing: {
        tightest: "-0.05em",
        tighter: "-0.04em",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "pulse-dot": "pulse-dot 2s ease-in-out infinite",
        "marquee": "marquee 40s linear infinite",
        "marquee-slow": "marquee 80s linear infinite",
        "scan": "scan 2.4s linear infinite",
        "ticker": "ticker 1.2s ease-out forwards",
        "rise": "rise 0.9s cubic-bezier(0.2, 0.8, 0.2, 1) forwards",
        "blue-pulse": "blue-pulse 3s ease-in-out infinite",
        "shimmer": "shimmer 2.5s linear infinite",
        "rotate-slow": "rotate-slow 60s linear infinite",
      },
      keyframes: {
        "pulse-dot": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(0,82,255,0.6)" },
          "50%": { boxShadow: "0 0 0 14px rgba(0,82,255,0)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(2400%)" },
        },
        ticker: {
          from: { transform: "translateY(100%)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        rise: {
          from: { transform: "translateY(40px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        "blue-pulse": {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.06)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "rotate-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
      },
      backgroundImage: {
        "grid-fade":
          "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0) 60%)",
        "radial-electric":
          "radial-gradient(60% 50% at 50% 0%, rgba(0,82,255,0.18), rgba(0,0,0,0) 70%)",
        "shimmer-gradient":
          "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.08) 45%, rgba(0,82,255,0.25) 50%, rgba(255,255,255,0.08) 55%, rgba(255,255,255,0) 100%)",
        "noise":
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.05 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
      },
      boxShadow: {
        "glow-sm": "0 0 24px rgba(0,82,255,0.25)",
        "glow-md": "0 0 48px rgba(0,82,255,0.35)",
        "glow-lg": "0 0 96px rgba(0,82,255,0.45)",
        "ring-electric": "0 0 0 1px rgba(0,82,255,0.5), 0 0 32px rgba(0,82,255,0.3)",
        "inner-line": "inset 0 0 0 1px rgba(255,255,255,0.06)",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        "in-out-expo": "cubic-bezier(0.87, 0, 0.13, 1)",
      },
      backdropBlur: {
        xs: "2px",
      },
      gridTemplateColumns: {
        "12": "repeat(12, minmax(0, 1fr))",
      },
    },
  },
  plugins: [],
};

export default config;
