import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";
import { getLegal } from "@/lib/legal";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How WebLogic Studio collects, uses, and protects information.",
};

export default function Page() {
  const data = getLegal("privacy");
  if (!data) notFound();
  return <LegalPage data={data} />;
}
