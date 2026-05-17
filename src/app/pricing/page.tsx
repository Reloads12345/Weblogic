import type { Metadata } from "next";
import PricingClient from "./PricingClient";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Transparent pricing for WebLogic services — websites, client portals, payment systems, automations, and maintenance.",
};

// Cache for an hour at the edge — pricing copy is mostly static, so
// TTFB on this route drops from ~1s to <300ms.
export const revalidate = 3600;

export default function PricingPage() {
  return <PricingClient />;
}
