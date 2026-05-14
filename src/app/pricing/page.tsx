import type { Metadata } from "next";
import PricingClient from "./PricingClient";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Transparent pricing for WebLogic services — websites, client portals, payment systems, automations, and maintenance.",
};

export default function PricingPage() {
  return <PricingClient />;
}
