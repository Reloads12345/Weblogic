// `Persona` was used by an unshipped personalization experiment that
// switched hero copy based on a `?persona=...` query param. The provider
// and switcher were never wired into a public surface, so both — along
// with this type — were removed during the production audit. Re-add when
// there's a real personalization story to ship.

export interface NavMegaColumn {
  heading: string;
  links: { label: string; href: string; description?: string; badge?: string }[];
}

export interface NavItem {
  label: string;
  href?: string;
  mega?: NavMegaColumn[];
  feature?: { eyebrow: string; title: string; copy: string; href: string };
}

export type CaseLabel =
  | "Real Client"
  | "Demo"
  | "Concept"
  | "Internal Build"
  | "Performance Demo";

/**
 * Honest disclosure of how this project may be shown publicly.
 *  - "granted"          — client has signed off on full public display
 *  - "anonymized"       — show the work but mask the client name
 *  - "internal"         — WebLogic-owned demo/internal build, no client involved
 *  - "concept"          — speculative rebuild for portfolio purposes only
 *  - "pending"          — awaiting written permission, keep `visible: false`
 */
export type PermissionStatus =
  | "granted"
  | "anonymized"
  | "internal"
  | "concept"
  | "pending";

export interface CaseStudy {
  slug: string;
  /** Display name (real client name when permission=granted, otherwise the project title). */
  client: string;
  logo: string;
  industry: string;
  category: string;
  /** Honest project label rendered as a chip on every card. */
  label: CaseLabel;
  headline: string;
  summary: string;
  story: string;
  metrics: { label: string; value: string }[];
  stack: string[];
  /** Optional services list for the /work/[slug] page. */
  services?: string[];
  videoSlot: string; // legacy upload slot key
  poster?: string;
  accentColor?: string;
  duration: string;
  href: string;
  /** Short discoverability tags rendered as chips on the card. */
  tags?: string[];
  /** Year the project shipped — string so "2024" / "2024 Q4" / "Ongoing" all work. */
  year?: string;
  /** When true, the project is highlighted (larger card). */
  featured?: boolean;
  /** When false, the gallery hides this item without deleting it. */
  visible?: boolean;
  /** External URLs surfaced on /work/[slug]. */
  liveUrl?: string;
  githubUrl?: string;
  caseStudyUrl?: string;
  /**
   * Honest permission disclosure. Drives whether the real client name is
   * shown publicly or anonymized. Defaults to "internal" for demos and
   * "concept" for portfolio rebuilds.
   */
  permissionStatus?: PermissionStatus;
  /**
   * If `permissionStatus === "anonymized"`, use this label instead of `client`.
   */
  anonymizedClientName?: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  title: string;
  company: string;
  companyLogo: string;
  headshot: string;
  metric?: { label: string; value: string };
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  author: { name: string; role: string };
  cover: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface ImpactMetric {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
}

export interface ExpertiseTile {
  id: string;
  eyebrow: string;
  title: string;
  copy: string;
  bullets: string[];
  videoSlot: string;
  span: "1x1" | "2x1" | "1x2" | "2x2";
  accent?: boolean;
}

export interface GlobeNode {
  city: string;
  country: string;
  lat: number;
  lng: number;
  client?: string;
  metric?: string;
}

export interface UploadSlot {
  key: string;
  label: string;
  description: string;
  accept: string; // mime patterns
  recommended: string;
  group: "logo" | "hero" | "expertise" | "case" | "client" | "section";
}
