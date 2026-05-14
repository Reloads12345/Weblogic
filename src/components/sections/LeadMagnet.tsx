"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Download, FileDown } from "lucide-react";
import { useState, useTransition } from "react";
import { submitLead } from "@/app/actions/lead";
import { useAssets } from "@/components/providers/AssetProvider";
import { cn } from "@/lib/utils";

const PROMISES = [
  "47-line website readiness scorecard",
  "Performance budget worksheet (LCP / INP / CLS)",
  "Mobile usability + booking-flow audit",
  "SEO, schema, and on-page checklist",
];

export default function LeadMagnet() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const { getDocumentUrl } = useAssets();
  const pdfUrl = getDocumentUrl("teardown-pdf");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) return setError("Drop your name first.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("Need a real email.");
    startTransition(async () => {
      const res = await submitLead({
        name: name.trim(),
        email,
        company: "(via teardown lead magnet)",
        scope: "Enterprise Website Teardown",
        timeline: "Exploring",
        notes: "Requested the free Enterprise Website Teardown PDF.",
        source: "lead-magnet",
      });
      if (res.ok) {
        setDone(true);
        // If a PDF has been uploaded, trigger the download immediately
        if (pdfUrl) {
          const a = document.createElement("a");
          a.href = pdfUrl;
          a.download = "WebLogic-Enterprise-Website-Teardown.pdf";
          a.target = "_blank";
          a.rel = "noopener noreferrer";
          document.body.appendChild(a);
          a.click();
          a.remove();
        }
      } else setError(res.error ?? "Couldn't send.");
    });
  };

  return (
    <section
      id="teardown"
      className="relative bg-ink-0 border-y border-white/8 py-24 md:py-32"
    >
      <div className="container-pad grid items-stretch gap-10 md:grid-cols-12">
        {/* Left: pitch */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="md:col-span-7"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
            / Free download
          </p>
          <h2 className="mt-6 max-w-[20ch] text-balance font-display text-display-lg leading-[0.95] tracking-tightest text-bone">
            The Website Audit Checklist.{" "}
            <span className="text-electric">Free.</span>
          </h2>
          <p className="mt-5 max-w-xl text-pretty text-mute md:text-lg">
            The same 47-line scorecard we use during every WebLogic audit —
            packaged into a clean PDF you can run against your own site this
            afternoon.
          </p>

          <ul className="mt-8 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {PROMISES.map((p, i) => (
              <motion.li
                key={p}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: 0.15 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-start gap-2 text-sm text-bone/85"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-electric" />
                {p}
              </motion.li>
            ))}
          </ul>

          <p className="mt-8 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
            <FileDown className="h-3.5 w-3.5" />
            PDF · 9 pages · Used by 1,200+ B2B teams
          </p>
        </motion.div>

        {/* Right: form */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="md:col-span-5"
        >
          <form
            onSubmit={submit}
            className="rounded-3xl border border-white/10 bg-ink-0 p-7"
          >
            {!done ? (
              <>
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-electric">
                  / Get the teardown
                </p>
                <h3 className="mt-3 font-display text-2xl tracking-tightest text-bone">
                  Drop your details. <br />
                  <span className="text-mute">PDF lands in 60 seconds.</span>
                </h3>

                <div className="mt-6 space-y-3">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full rounded-full border border-white/10 bg-ink-0 px-5 py-3.5 text-sm text-bone placeholder:text-white/30 focus:border-electric focus:outline-none"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full rounded-full border border-white/10 bg-ink-0 px-5 py-3.5 text-sm text-bone placeholder:text-white/30 focus:border-electric focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={pending}
                  className={cn(
                    "btn-electric mt-5 w-full justify-center !py-4",
                    pending && "pointer-events-none opacity-60",
                  )}
                >
                  {pending ? "Sending…" : "Download Free Teardown"}
                  <ArrowRight className="h-4 w-4" />
                </button>
                {error && <p className="mt-2 text-xs text-red-400">{error}</p>}

                <p className="mt-4 text-[10px] font-mono uppercase tracking-[0.18em] text-mute">
                  No spam · Unsubscribe in one click
                </p>
              </>
            ) : (
              <div className="grid place-items-center py-6 text-center">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-electric/15 text-electric">
                  <CheckCircle2 className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display text-2xl tracking-tightest">
                  {pdfUrl ? "Downloading now." : "On its way."}
                </h3>
                <p className="mt-2 max-w-sm text-sm text-mute">
                  {pdfUrl
                    ? "Your teardown PDF should open in a new tab. We've also emailed a copy to "
                    : "Check "}
                  <span className="text-bone">{email}</span>
                  {pdfUrl ? "." : " in the next minute."}
                </p>
                {pdfUrl && (
                  <a
                    href={pdfUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost mt-5 inline-flex items-center gap-2 text-xs"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Re-download
                  </a>
                )}
              </div>
            )}
          </form>
        </motion.div>
      </div>
    </section>
  );
}
