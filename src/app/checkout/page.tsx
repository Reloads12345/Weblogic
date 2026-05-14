import type { Metadata } from "next";
import { Suspense } from "react";
import CheckoutClient from "./CheckoutClient";
import Loading from "./loading";

export const metadata: Metadata = {
  title: "Checkout",
  description:
    "Secure your build slot with WebLogic. Pay a 50% deposit to lock in your timeline. Stripe-secured payments, full refund within 7 days.",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  // Suspense wrapper is required because CheckoutClient calls useSearchParams
  // — Next.js opts the route out of static rendering otherwise.
  return (
    <Suspense fallback={<Loading />}>
      <CheckoutClient />
    </Suspense>
  );
}
