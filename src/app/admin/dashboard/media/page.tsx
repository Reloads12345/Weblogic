import type { Metadata } from "next";
import MediaClient from "./MediaClient";

export const metadata: Metadata = {
  title: "Admin · Media Library",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <MediaClient />;
}
