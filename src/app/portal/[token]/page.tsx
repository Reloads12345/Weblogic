import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  DEMO_TOKEN,
  demoClient,
  findClientByToken,
} from "@/lib/client-portal";
import PortalClient from "./PortalClient";

/**
 * /portal/[token] — shared-link client portal.
 *
 * Routing model:
 *   • Each WebLogic client gets `/portal/<random-32-hex>` as their bookmark.
 *   • The route is server-rendered + force-dynamic — no caching, no
 *     prerendering, so tokens are never baked into the build artifact.
 *   • `noindex, nofollow` on every variant + robots.txt already disallows
 *     /portal at the crawler level.
 *   • The single reserved token `demo` always renders a synthetic demo
 *     project so operators can preview the UI without writing data.
 *
 * Token leakage / security note:
 *   The URL IS the credential. Treat it like an API key: don't share in
 *   screenshots, rotate by issuing a new token in /admin if leaked.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Project portal",
  robots: { index: false, follow: false, nocache: true },
};

export default async function PortalPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const trimmed = (token ?? "").trim();

  // Reserved DEMO route — always works so operators can preview the UI
  // without writing real data into the client store.
  if (trimmed === DEMO_TOKEN) {
    return <PortalClient project={demoClient()} isDemo />;
  }

  const project = await findClientByToken(trimmed);
  if (!project) notFound();

  return <PortalClient project={project} isDemo={false} />;
}
