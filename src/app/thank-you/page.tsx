import type { Metadata } from "next";
import { Suspense } from "react";
import ThankYouClient from "./ThankYouClient";

export const metadata: Metadata = {
  title: "Thank you",
  description: "Your WebLogic request was received. Here's what happens next.",
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  // Suspense wrapper required because ThankYouClient reads useSearchParams.
  return (
    <Suspense fallback={null}>
      <ThankYouClient />
    </Suspense>
  );
}
