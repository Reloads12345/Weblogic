import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";
import { getLegal } from "@/lib/legal";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms governing use of weblogic.studio.",
};

export default function Page() {
  const data = getLegal("terms");
  if (!data) notFound();
  return <LegalPage data={data} />;
}
