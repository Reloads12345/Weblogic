import type { Metadata } from "next";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: "About",
  description:
    "WebLogic is a U.S.-based remote web development studio. We build websites, client portals, payment systems, and automations for ambitious small businesses.",
};

// Edge-cached for a day — about page rarely changes.
export const revalidate = 86400;

export default function Page() {
  return <AboutClient />;
}
