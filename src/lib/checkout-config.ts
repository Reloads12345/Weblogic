/**
 * Checkout configuration — the only file in the codebase that defines
 * what can be sold, for how much, and which Stripe Price IDs each option
 * maps to. The API route reads this for server-side validation; the UI
 * reads this for the checkout configurator.
 *
 * Pricing is mirrored here for display + summary math only. Stripe is
 * still the source of truth for actual charges — line items always
 * reference Price IDs from the env vars below, never raw amounts.
 *
 * Stripe naming note: the user calls these on the website
 *   "Starter Website" / "Growth Website" / "Business System Build"
 * even though their Stripe product is named "Enterprise Systems Build".
 * We keep the WebLogic-facing name and only use the env-keyed Price ID
 * when talking to Stripe.
 */

/* ─────────────────────────── Types ─────────────────────────── */

export type PackageKey =
  | "starter"
  | "growth"
  | "businessSystem"
  | "websiteAudit"
  | "customProjectDeposit";

export type AddonKey =
  | "extraPage"
  | "advancedSeo"
  | "blogCms"
  | "bookingSystem"
  | "stripeCheckout"
  | "emailAutomation"
  | "copywriting"
  | "speedOptimization"
  | "motionAnimation"
  | "priorityDelivery";

export type CarePlanKey =
  | "essential"
  | "growth"
  | "systems"
  | "customRetainer";

export interface Package {
  key: PackageKey;
  name: string;
  shortName: string;
  /** Full estimated project price in USD — display only. */
  fullPriceUsd: number;
  /** Amount charged today via Stripe Checkout. */
  depositUsd: number;
  /** What's still owed at launch. Zero for pay-in-full packages. */
  remainingUsd: number;
  /** `deposit` = pay deposit now + remaining at launch; `oneTime` = paid in full. */
  chargeMode: "deposit" | "oneTime";
  /** Env-var name resolving to the Stripe Price ID for the deposit charge. */
  stripePriceEnvKey: string;
  /** Optional env-var name for the matching remaining-balance Price ID. */
  stripeRemainingEnvKey?: string;
  /** Optional env-var name for the full one-time price (currently informational). */
  stripeFullEnvKey?: string;
  ctaLabel: string;
  payButtonLabel: string;
  bestFor: string;
  timeline?: string;
  includes: string[];
  allowedAddons: AddonKey[];
  /** Caution shown beneath the card. */
  warning?: string;
  /** When true, the remaining balance is custom — UI shows "varies" instead of a number. */
  customRemaining?: boolean;
}

export interface Addon {
  key: AddonKey;
  name: string;
  priceUsd: number;
  stripePriceEnvKey: string;
  description?: string;
}

export interface CarePlan {
  key: CarePlanKey;
  name: string;
  monthlyUsd: number;
  stripePriceEnvKey: string;
  bestFor: string;
  includes: string[];
  highlight?: boolean;
  payButtonLabel: string;
}

/* ─────────────────────────── Add-ons ─────────────────────────── */

export const ADDONS: Record<AddonKey, Addon> = {
  extraPage: {
    key: "extraPage",
    name: "Extra Website Page",
    priceUsd: 150,
    stripePriceEnvKey: "STRIPE_PRICE_ADDON_EXTRA_PAGE",
    description: "One additional custom-designed page.",
  },
  advancedSeo: {
    key: "advancedSeo",
    name: "Advanced SEO Setup",
    priceUsd: 250,
    stripePriceEnvKey: "STRIPE_PRICE_ADDON_ADVANCED_SEO",
    description: "Structured data, sitemap, metadata, technical SEO audit.",
  },
  blogCms: {
    key: "blogCms",
    name: "Blog / CMS Setup",
    priceUsd: 300,
    stripePriceEnvKey: "STRIPE_PRICE_ADDON_BLOG_CMS",
    description: "Markdown or headless CMS with publishing flow.",
  },
  bookingSystem: {
    key: "bookingSystem",
    name: "Booking System Setup",
    priceUsd: 400,
    stripePriceEnvKey: "STRIPE_PRICE_ADDON_BOOKING_SYSTEM",
    description: "Cal.com or custom booking flow wired to your inbox.",
  },
  stripeCheckout: {
    key: "stripeCheckout",
    name: "Stripe Checkout Integration",
    priceUsd: 500,
    stripePriceEnvKey: "STRIPE_PRICE_ADDON_STRIPE_CHECKOUT",
    description: "Hosted Stripe payments, deposits, or one-time products.",
  },
  emailAutomation: {
    key: "emailAutomation",
    name: "Email / Form Automation",
    priceUsd: 300,
    stripePriceEnvKey: "STRIPE_PRICE_ADDON_EMAIL_AUTOMATION",
    description: "Resend pipeline with templated replies + lead routing.",
  },
  copywriting: {
    key: "copywriting",
    name: "Copywriting Assistance",
    priceUsd: 250,
    stripePriceEnvKey: "STRIPE_PRICE_ADDON_COPYWRITING",
    description: "Headlines, CTAs, and section copy for your pages.",
  },
  speedOptimization: {
    key: "speedOptimization",
    name: "Website Speed Optimization",
    priceUsd: 350,
    stripePriceEnvKey: "STRIPE_PRICE_ADDON_SPEED_OPTIMIZATION",
    description: "LCP / CLS / INP tuning, image pipeline, JS budget.",
  },
  motionAnimation: {
    key: "motionAnimation",
    name: "Motion / Animation Package",
    priceUsd: 500,
    stripePriceEnvKey: "STRIPE_PRICE_ADDON_MOTION_ANIMATION",
    description: "Hero motion, scroll choreography, micro-interactions.",
  },
  priorityDelivery: {
    key: "priorityDelivery",
    name: "Priority Delivery",
    priceUsd: 450,
    stripePriceEnvKey: "STRIPE_PRICE_ADDON_PRIORITY_DELIVERY",
    description: "Move your project to the front of the build queue.",
  },
};

/* ─────────────────────────── Packages ─────────────────────────── */

export const PACKAGES: Record<PackageKey, Package> = {
  starter: {
    key: "starter",
    name: "Starter Website",
    shortName: "Starter",
    fullPriceUsd: 750,
    depositUsd: 375,
    remainingUsd: 375,
    chargeMode: "deposit",
    stripePriceEnvKey: "STRIPE_PRICE_STARTER_DEPOSIT",
    stripeRemainingEnvKey: "STRIPE_PRICE_STARTER_REMAINING_BALANCE",
    stripeFullEnvKey: "STRIPE_PRICE_STARTER_WEBSITE",
    ctaLabel: "Configure Starter Website",
    payButtonLabel: "Pay Starter Deposit",
    bestFor:
      "Simple business websites, landing pages, and small brands that need a clean online presence.",
    timeline: "2 weeks",
    includes: [
      "One-page or small starter website",
      "Mobile responsive layout",
      "Contact form",
      "Basic SEO setup",
      "Deployment support",
      "1 revision round",
    ],
    allowedAddons: [
      "extraPage",
      "advancedSeo",
      "blogCms",
      "bookingSystem",
      "copywriting",
      "speedOptimization",
      "priorityDelivery",
    ],
    warning:
      "Need portals, dashboards, advanced automation, or custom systems? Choose Business System or request a custom quote.",
  },
  growth: {
    key: "growth",
    name: "Growth Website",
    shortName: "Growth",
    fullPriceUsd: 1500,
    depositUsd: 750,
    remainingUsd: 750,
    chargeMode: "deposit",
    stripePriceEnvKey: "STRIPE_PRICE_GROWTH_DEPOSIT",
    stripeRemainingEnvKey: "STRIPE_PRICE_GROWTH_REMAINING_BALANCE",
    stripeFullEnvKey: "STRIPE_PRICE_GROWTH_WEBSITE",
    ctaLabel: "Configure Growth Website",
    payButtonLabel: "Pay Growth Deposit",
    bestFor:
      "Businesses that need stronger design, structure, lead capture, SEO foundation, analytics, and a clear conversion flow.",
    timeline: "3–4 weeks",
    includes: [
      "Custom homepage",
      "3–5 pages or sections",
      "Mobile responsive design",
      "Lead capture forms",
      "SEO foundation",
      "Analytics setup",
      "Basic animation",
      "Speed optimization",
      "2 revision rounds",
    ],
    allowedAddons: [
      "extraPage",
      "advancedSeo",
      "blogCms",
      "bookingSystem",
      "stripeCheckout",
      "emailAutomation",
      "copywriting",
      "speedOptimization",
      "motionAnimation",
      "priorityDelivery",
    ],
  },
  businessSystem: {
    key: "businessSystem",
    name: "Business System Build",
    shortName: "Business System",
    fullPriceUsd: 3500,
    depositUsd: 1750,
    // No fixed remaining balance — Business System balance is custom-invoiced
    remainingUsd: 1750,
    chargeMode: "deposit",
    stripePriceEnvKey: "STRIPE_PRICE_BUSINESS_SYSTEM_DEPOSIT",
    stripeFullEnvKey: "STRIPE_PRICE_BUSINESS_SYSTEM_BUILD",
    ctaLabel: "Configure Business System",
    payButtonLabel: "Pay System Deposit",
    bestFor:
      "Client portals, dashboards, Stripe checkout, booking systems, automations, admin tools, and custom integrations.",
    timeline: "4–8 weeks",
    includes: [
      "Strategy and system planning",
      "Custom web system build",
      "Core pages or interface",
      "Database / API planning if needed",
      "Deployment support",
      "Testing",
      "Launch support",
    ],
    allowedAddons: [
      "bookingSystem",
      "stripeCheckout",
      "emailAutomation",
      "speedOptimization",
      "motionAnimation",
      "priorityDelivery",
    ],
    warning:
      "Advanced modules like client portals, admin dashboards, authentication, databases, custom SaaS systems, and complex automations may require custom quoting before development begins.",
    customRemaining: true,
  },
  websiteAudit: {
    key: "websiteAudit",
    name: "Website Audit — Paid Deep Dive",
    shortName: "Audit",
    fullPriceUsd: 99,
    depositUsd: 99,
    remainingUsd: 0,
    chargeMode: "oneTime",
    stripePriceEnvKey: "STRIPE_PRICE_WEBSITE_AUDIT",
    ctaLabel: "Buy Website Audit",
    payButtonLabel: "Buy Website Audit",
    bestFor:
      "Businesses that want a detailed website review before committing to a build.",
    includes: [
      "Design review",
      "Mobile experience review",
      "Speed / performance review",
      "SEO basics review",
      "Conversion flow review",
      "Trust / credibility review",
      "Prioritized action plan",
    ],
    allowedAddons: [],
  },
  customProjectDeposit: {
    key: "customProjectDeposit",
    name: "Custom Project Deposit",
    shortName: "Custom",
    // No full price — balance is custom-invoiced after scope approval.
    fullPriceUsd: 500,
    depositUsd: 500,
    remainingUsd: 0,
    chargeMode: "deposit",
    stripePriceEnvKey: "STRIPE_PRICE_CUSTOM_PROJECT_DEPOSIT",
    ctaLabel: "Pay Custom Deposit",
    payButtonLabel: "Pay Custom Deposit",
    bestFor:
      "Custom projects that already have an approved scope or are starting with a custom deposit.",
    includes: [
      "Locks in your project slot",
      "Starts the planning and discovery phase",
      "Balance invoiced based on approved scope",
    ],
    allowedAddons: [],
    customRemaining: true,
  },
};

/* ─────────────────────────── Care plans ─────────────────────────── */

export const CARE_PLANS: Record<CarePlanKey, CarePlan> = {
  essential: {
    key: "essential",
    name: "Website Care — Essential",
    monthlyUsd: 75,
    stripePriceEnvKey: "STRIPE_PRICE_WEBSITE_CARE_ESSENTIAL",
    bestFor: "Basic website upkeep.",
    includes: [
      "Uptime monitoring",
      "Security checks",
      "Minor content edits",
      "Monthly backup check",
      "Contact form testing",
      "Basic performance review",
    ],
    payButtonLabel: "Start Essential Care",
  },
  growth: {
    key: "growth",
    name: "Website Care — Growth",
    monthlyUsd: 150,
    stripePriceEnvKey: "STRIPE_PRICE_WEBSITE_CARE_GROWTH",
    bestFor:
      "Businesses that rely on their website for leads, bookings, quotes, or sales.",
    includes: [
      "Everything in Essential",
      "Monthly analytics review",
      "SEO maintenance",
      "Performance checks",
      "Conversion recommendations",
      "CTA / content improvements",
      "Priority support",
    ],
    highlight: true,
    payButtonLabel: "Start Growth Care",
  },
  systems: {
    key: "systems",
    name: "Website Care — Systems",
    monthlyUsd: 250,
    stripePriceEnvKey: "STRIPE_PRICE_WEBSITE_CARE_SYSTEMS",
    bestFor:
      "Websites with portals, payments, dashboards, automations, booking systems, or custom integrations.",
    includes: [
      "Everything in Growth",
      "Stripe / payment flow checks",
      "Client portal support",
      "Dashboard monitoring",
      "Automation checks",
      "Integration testing",
      "Priority bug fixes",
      "Monthly system health report",
    ],
    payButtonLabel: "Start Systems Care",
  },
  customRetainer: {
    key: "customRetainer",
    name: "Custom Retainer",
    monthlyUsd: 500,
    stripePriceEnvKey: "STRIPE_PRICE_CUSTOM_RETAINER",
    bestFor:
      "Businesses that need ongoing WebLogic development, support, and strategy.",
    includes: [
      "Monthly development support",
      "Feature additions",
      "Landing pages",
      "Automation expansion",
      "Performance improvements",
      "Strategy calls",
      "Priority support",
    ],
    payButtonLabel: "Start Custom Retainer",
  },
};

/* ─────────────────────────── Type guards ─────────────────────────── */

export const PACKAGE_KEYS = Object.keys(PACKAGES) as PackageKey[];
export const ADDON_KEYS = Object.keys(ADDONS) as AddonKey[];
export const CARE_PLAN_KEYS = Object.keys(CARE_PLANS) as CarePlanKey[];

export function isPackageKey(k: string): k is PackageKey {
  return (PACKAGE_KEYS as string[]).includes(k);
}
export function isAddonKey(k: string): k is AddonKey {
  return (ADDON_KEYS as string[]).includes(k);
}
export function isCarePlanKey(k: string): k is CarePlanKey {
  return (CARE_PLAN_KEYS as string[]).includes(k);
}
export function addonAllowedForPackage(
  pkg: PackageKey,
  addon: AddonKey,
): boolean {
  return PACKAGES[pkg].allowedAddons.includes(addon);
}

/* ─────────────────────────── Math helpers ─────────────────────────── */

export interface OrderTotals {
  packageFullUsd: number;
  packageDepositUsd: number;
  addonsTotalUsd: number;
  /** Charged via Stripe today */
  dueTodayUsd: number;
  /** Owed at launch */
  remainingUsd: number;
  /** Estimated total (package full + add-ons) */
  estimatedTotalUsd: number;
  customRemaining: boolean;
}

export function computeOrderTotals(
  pkg: Package,
  selectedAddons: Addon[],
): OrderTotals {
  const addonsTotalUsd = selectedAddons.reduce((s, a) => s + a.priceUsd, 0);
  const packageFullUsd = pkg.fullPriceUsd;
  const packageDepositUsd = pkg.depositUsd;
  const dueTodayUsd = packageDepositUsd + addonsTotalUsd;
  const remainingUsd =
    pkg.chargeMode === "oneTime"
      ? 0
      : Math.max(0, packageFullUsd - packageDepositUsd);
  const estimatedTotalUsd = packageFullUsd + addonsTotalUsd;
  return {
    packageFullUsd,
    packageDepositUsd,
    addonsTotalUsd,
    dueTodayUsd,
    remainingUsd,
    estimatedTotalUsd,
    customRemaining: Boolean(pkg.customRemaining),
  };
}

export function formatUsd(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}
