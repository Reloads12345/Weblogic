import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";
import { getLegal } from "@/lib/legal";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Accessibility",
  description: "WebLogic's commitment to WCAG 2.2 AA across every surface.",
};

export default function Page() {
  const data = getLegal("accessibility");
  if (!data) notFound();
  return <LegalPage data={data} />;
}
