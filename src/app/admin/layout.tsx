import type { Metadata } from "next";

/**
 * /admin layout — applies noindex to every page under /admin.
 *
 * robots.txt already disallows /admin (soft block via crawl rules), but
 * search engines that ignore robots.txt would still see the page meta.
 * Adding `robots: { index: false, follow: false }` here makes EVERY
 * descendant route inherit the no-index directive — including the client-
 * component pages (content, cases, settings) that can't export their own
 * metadata.
 *
 * Title template scoped to /admin so dashboard titles render as
 * "<page> · Admin" instead of "<page> · WebLogic".
 */
export const metadata: Metadata = {
  title: {
    default: "Admin",
    template: "%s · Admin",
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
