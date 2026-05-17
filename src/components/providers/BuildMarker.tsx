"use client";

import { useEffect } from "react";

/**
 * Logs a one-line build marker to the browser console on first paint.
 * Helps confirm which build Vercel is actually serving.
 *
 * Output looks like:  [weblogic] build loaded · commit 4281fdf · 2026-05-17T08:23:11Z
 *
 * Values come from `NEXT_PUBLIC_*` env vars that Vercel injects at build
 * time. Safe to ship publicly — no secrets here.
 */
export default function BuildMarker({
  commit,
  buildTime,
}: {
  commit: string | null;
  buildTime: string;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log(
      `%c[weblogic]%c build loaded · ${commit ? `commit ${commit}` : "local"} · ${buildTime}`,
      "color:#0052ff;font-weight:600",
      "color:inherit",
    );
  }, [commit, buildTime]);

  return null;
}
