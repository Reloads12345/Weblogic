"use client";

import { useEffect, useRef, useState } from "react";
import { ExternalLink, Loader2 } from "lucide-react";

/**
 * Cal.com inline embed.
 *
 * Why dynamic-load:
 *   Cal.com ships ~50kb of JS. We don't want that on every page — only
 *   when a user actually opens the booking surface. The embed script is
 *   appended on first mount, then namespaced via the `data-cal-namespace`
 *   convention so multiple instances can coexist.
 *
 * Why fail-gracefully:
 *   The Cal.com handle is configured via `NEXT_PUBLIC_CAL_LINK`. If
 *   unset (e.g. local dev before Caleb sets up his Cal account), the
 *   component renders a "Calendar not configured" stub WITHOUT throwing.
 *   That's safer than hard-failing the LeadModal whenever Cal is being
 *   set up.
 *
 * Usage:
 *   <CalEmbed />                                 // hero-style 720×640
 *   <CalEmbed handle="caleb/discovery" />        // override env handle
 *   <CalEmbed minHeight={420} />                 // shrink for modals
 *
 * Configuration:
 *   NEXT_PUBLIC_CAL_LINK="caleb/discovery"       // username/event-slug
 *   NEXT_PUBLIC_CAL_LINK="https://cal.com/caleb/discovery"  // also works
 */
interface Props {
  /** Override the env-driven Cal link. Pass "username/event-type". */
  handle?: string;
  /** Minimum frame height in px. Defaults to 640. */
  minHeight?: number;
  /** Optional className for the wrapper. */
  className?: string;
}

declare global {
  interface Window {
    Cal?: ((...args: unknown[]) => void) & { loaded?: boolean; ns?: Record<string, unknown> };
  }
}

const NAMESPACE = "weblogic-discovery";

function resolveHandle(input: string | undefined): string | null {
  if (!input) return null;
  let h = input.trim();
  if (!h) return null;
  // Accept either "username/event" or a full URL.
  if (h.startsWith("http")) {
    try {
      const u = new URL(h);
      h = u.pathname.replace(/^\//, "").replace(/\/$/, "");
    } catch {
      return null;
    }
  }
  // Cal.com expects "username/event-slug" or just "username"
  if (!/^[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)?$/.test(h)) return null;
  return h;
}

export default function CalEmbed({
  handle,
  minHeight = 640,
  className,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">(
    "idle",
  );

  const link = resolveHandle(handle ?? process.env.NEXT_PUBLIC_CAL_LINK);

  useEffect(() => {
    if (!link) return;
    if (typeof window === "undefined") return;
    setStatus("loading");

    // Cal.com's standard inline-embed snippet, adapted so we only inject
    // it once even if multiple CalEmbed instances mount on the page.
    if (!window.Cal) {
      const script = document.createElement("script");
      script.src = "https://app.cal.com/embed/embed.js";
      script.async = true;
      script.onload = () => initCal();
      script.onerror = () => setStatus("error");
      document.head.appendChild(script);
    } else {
      initCal();
    }

    function initCal() {
      if (!window.Cal) {
        setStatus("error");
        return;
      }
      try {
        // Initialize a namespaced embed (so multiple CalEmbeds can coexist)
        window.Cal("init", NAMESPACE, { origin: "https://cal.com" });
        // Mount the inline calendar inside our container
        window.Cal.ns ??= {};
        const ns = window.Cal as unknown as Record<string, (...args: unknown[]) => void>;
        ns[NAMESPACE]?.("inline", {
          elementOrSelector: containerRef.current,
          calLink: link,
          config: { theme: "dark", layout: "month_view" },
        });
        ns[NAMESPACE]?.("ui", {
          theme: "dark",
          cssVarsPerTheme: {
            dark: {
              "cal-brand": "#0052ff",
              "cal-bg": "#020410",
              "cal-bg-emphasis": "#0c1024",
              "cal-text": "#ffffff",
              "cal-text-emphasis": "#ffffff",
              "cal-border": "rgba(255,255,255,0.10)",
              "cal-border-subtle": "rgba(255,255,255,0.06)",
            },
          },
          hideEventTypeDetails: false,
        });
        setStatus("ready");
      } catch {
        setStatus("error");
      }
    }
    // No cleanup: Cal.com's embed manages its own iframe lifecycle.
    // Re-mounting would just re-call init() which is idempotent.
  }, [link]);

  if (!link) {
    return (
      <div
        className={
          "grid place-items-center rounded-2xl border border-white/10 bg-ink-0 p-8 text-center text-mute " +
          (className ?? "")
        }
        style={{ minHeight }}
      >
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-electric">
            / Calendar pending
          </p>
          <p className="mt-3 max-w-sm text-sm">
            Set <code className="rounded bg-ink-100 px-1.5 py-0.5 font-mono text-[11px] text-bone">NEXT_PUBLIC_CAL_LINK</code>{" "}
            to your Cal.com handle (e.g. <code className="rounded bg-ink-100 px-1.5 py-0.5 font-mono text-[11px] text-bone">caleb/discovery</code>)
            to enable inline booking.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={"relative " + (className ?? "")}>
      {status !== "ready" && (
        <div
          className="absolute inset-0 z-10 grid place-items-center rounded-2xl border border-white/10 bg-ink-0/90 backdrop-blur-sm"
          style={{ minHeight }}
        >
          {status === "error" ? (
            <div className="text-center">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
                / Calendar didn&apos;t load
              </p>
              <a
                href={`https://cal.com/${link}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-electric px-5 py-2.5 text-xs font-medium text-ink-0 transition hover:-translate-y-0.5"
              >
                Open Cal.com in a new tab
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          ) : (
            <Loader2 className="h-5 w-5 animate-spin text-mute" />
          )}
        </div>
      )}
      <div
        ref={containerRef}
        className="overflow-hidden rounded-2xl"
        style={{ minHeight }}
      />
    </div>
  );
}
