import type {
  BlogPost,
  CaseStudy,
  ExpertiseTile,
  FaqItem,
  GlobeNode,
  ImpactMetric,
  NavItem,
  Testimonial,
  UploadSlot,
} from "@/types";

/* =========================================================================
   BRAND
   ========================================================================= */

export const BRAND = {
  name: "WebLogic",
  tagline: "Websites & systems that evolve with your business.",
  supporting:
    "WebLogic builds high-performance websites, client portals, payment systems, and automations for businesses that need more than a basic online presence.",
  domain: "weblogic.digital",
  url: "https://weblogic.digital",
  email: "caleb@weblogic.digital",
  supportEmail: "support@weblogic.digital",
  city: "Remote · United States",
  established: "2024",
};

/* =========================================================================
   SOCIAL LINKS — single source of truth for every icon row on the site.

   Replace the placeholder URLs below with the real WebLogic profiles when
   they're ready. Each entry has a `placeholder` flag so the Footer can
   render the icon as inert-styled until a real URL is wired in.
   ========================================================================= */

export interface SocialLink {
  key: "github" | "linkedin" | "x" | "tiktok" | "instagram";
  label: string;
  href: string;
  /** When true, the icon shows but the link is treated as not-yet-live. */
  placeholder?: boolean;
}

export const SOCIAL_LINKS: SocialLink[] = [
  {
    key: "github",
    label: "GitHub",
    href: "https://github.com/WebLogic-dev",
    placeholder: false,
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/weblogic-digital-solutions-46b50640b/",
    placeholder: false,
  },
  {
    key: "x",
    label: "X",
    href: "https://x.com/weblogic_tech",
    placeholder: false,
  },
  {
    key: "tiktok",
    label: "TikTok",
    href: "https://www.tiktok.com/@weblogic.design",
    placeholder: false,
  },
  {
    key: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/weblogic.digital/",
    placeholder: false,
  },
];

/* =========================================================================
   NAVIGATION  (5-column mega menu — exact structure)
   ========================================================================= */

export const NAV: NavItem[] = [
  {
    label: "Solutions",
    mega: [
      {
        heading: "Design",
        links: [
          { label: "Web Design", href: "/solutions/web-design", description: "Brand-native, conversion-tuned" },
          { label: "Design Systems", href: "/solutions/design-systems", description: "Tokens, primitives, motion" },
          { label: "Illustration Design", href: "/solutions/illustration-design" },
          { label: "Motion Design", href: "/solutions/motion-design" },
          { label: "Branding", href: "/solutions/branding" },
        ],
      },
      {
        heading: "Development",
        links: [
          { label: "Frontend Development", href: "/solutions/frontend-development" },
          { label: "Backend Development", href: "/solutions/backend-development" },
          { label: "System Integrations", href: "/solutions/system-integrations" },
          { label: "Technical QA", href: "/solutions/technical-qa" },
          { label: "CMS Implementation", href: "/solutions/cms-implementation" },
        ],
      },
      {
        heading: "SEO & Scope",
        links: [
          { label: "Site Structure", href: "/solutions/site-structure" },
          { label: "On-Page SEO", href: "/solutions/on-page-seo" },
          { label: "Technical SEO", href: "/solutions/technical-seo" },
          { label: "Localization", href: "/solutions/localization" },
          { label: "Website Redesign", href: "/solutions/website-redesign" },
          { label: "Website Migration", href: "/solutions/website-migration" },
          { label: "Ongoing Engagements", href: "/solutions/ongoing-engagements" },
        ],
      },
      {
        heading: "By CMS",
        links: [
          { label: "Contentful", href: "/solutions/contentful" },
          { label: "Sanity", href: "/solutions/sanity" },
          { label: "Storyblok", href: "/solutions/storyblok" },
          { label: "Builder", href: "/solutions/builder" },
          { label: "DatoCMS", href: "/solutions/datocms" },
          { label: "Webflow", href: "/solutions/webflow" },
          { label: "HubSpot CMS", href: "/solutions/hubspot-cms" },
          { label: "WordPress", href: "/solutions/wordpress" },
        ],
      },
      {
        heading: "Industry · Stage · Use Case",
        links: [
          // Industry
          { label: "SaaS", href: "/solutions/saas" },
          { label: "AI / ML", href: "/solutions/ai-ml" },
          { label: "FinTech", href: "/solutions/fintech" },
          { label: "Enterprise Software", href: "/solutions/enterprise-software" },
          { label: "Software Dev Tools", href: "/solutions/software-development-tools" },
          { label: "MedTech", href: "/solutions/medtech" },
          { label: "Web3", href: "/solutions/web3" },
          // Stage
          { label: "Startups", href: "/solutions/startups" },
          { label: "Enterprise", href: "/solutions/enterprise" },
          // Use Case
          { label: "Support In-House Engineers", href: "/solutions/support-in-house-engineers" },
          { label: "Improve Brand Consistency", href: "/solutions/improve-brand-consistency" },
          { label: "Increase Conversions", href: "/solutions/increase-website-conversions" },
          { label: "Boost Performance", href: "/solutions/boost-website-performance" },
          { label: "Increase Traffic", href: "/solutions/increase-website-traffic" },
        ],
      },
    ],
    feature: {
      eyebrow: "Framework · Cloud",
      title: "Next.js · Gatsby · Vercel · Netlify",
      copy: "Browse by tech →",
      href: "/solutions/nextjs",
    },
  },
  { label: "Work", href: "/#case-studies" },
  { label: "Pricing", href: "/pricing" },
  { label: "Insights", href: "/#insights" },
  { label: "About", href: "/about" },
];

/* =========================================================================
   EXPERTISE BENTO
   ========================================================================= */

export const EXPERTISE: ExpertiseTile[] = [
  {
    id: "strategy",
    eyebrow: "01 / Strategy",
    title: "Strategy",
    copy:
      "Audits, positioning, and conversion planning before a single page is wireframed. You get a written plan, not a deck.",
    bullets: ["Website audits", "Offer positioning", "Conversion planning", "Funnel mapping"],
    videoSlot: "expertise-strategy",
    span: "1x1",
  },
  {
    id: "design",
    eyebrow: "02 / Design",
    title: "Design",
    copy:
      "Premium landing pages and UI that's brand-aligned, mobile-first, and built around conversion — not awards.",
    bullets: ["Premium landing pages", "UI / UX design", "Responsive layouts", "Brand-aligned interfaces"],
    videoSlot: "expertise-design",
    span: "1x1",
  },
  {
    id: "engineering",
    eyebrow: "03 / Engineering",
    title: "Engineering",
    copy:
      "Next.js and React builds, client portals, Stripe payments, booking systems, and custom admin panels. Real software, not templates.",
    bullets: ["Next.js / React", "Client portals", "Stripe payments", "Booking + admin"],
    videoSlot: "expertise-engineering",
    span: "1x1",
    accent: true,
  },
  {
    id: "growth",
    eyebrow: "04 / Growth",
    title: "Growth",
    copy:
      "SEO baseline, analytics, conversion-rate optimization, and lead-capture systems that compound over time.",
    bullets: ["SEO setup", "Analytics + RUM", "CRO improvements", "Lead capture"],
    videoSlot: "expertise-growth",
    span: "1x1",
  },
  {
    id: "automation",
    eyebrow: "05 / Automation",
    title: "Automation",
    copy:
      "Email workflows, CRM routing, form automations, client onboarding flows, and internal ops tools that replace your spreadsheet stack.",
    bullets: ["Email workflows", "CRM routing", "Form automations", "Internal tools"],
    videoSlot: "expertise-automation",
    span: "1x1",
  },
  {
    id: "maintenance",
    eyebrow: "06 / Maintenance",
    title: "Maintenance",
    copy:
      "Hosting, security, monitoring, monthly SEO + analytics reports, and priority support. We don't disappear after launch.",
    bullets: ["Hosting + uptime", "Security + updates", "Monthly reports", "Priority support"],
    videoSlot: "expertise-maintenance",
    span: "1x1",
  },
];

/* =========================================================================
   CASE STUDIES — fictional WebLogic clients
   ========================================================================= */

/**
 * Selected work — currently a mix of internal builds, concept rebuilds,
 * and performance demos. Each one is clearly labeled. Real client work
 * will replace these as engagements ship.
 */
export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "client-portal",
    client: "Client Portal Dashboard",
    logo: "Client Portal",
    industry: "Internal Build · SaaS-style",
    category: "Internal Build",
    label: "Internal Build",
    year: "2024",
    visible: true,
    featured: true,
    headline:
      "A client portal system for projects, invoices, files, and updates.",
    summary:
      "WebLogic-built client portal: authentication, project tracking, file uploads, invoice status, and an admin panel — all in one Next.js + Supabase build.",
    story:
      "Internal build to demonstrate WebLogic's portal stack. The portal includes role-based auth (admin / client), live project status with milestone tracking, secure file uploads, invoice + Stripe billing status, and an admin panel for project + user management. Built end-to-end on Next.js 15, Supabase Auth, Stripe, and Resend.",
    metrics: [
      { label: "User roles", value: "5" },
      { label: "Dashboard views", value: "14" },
      { label: "Stripe states", value: "Active · trialing · past_due" },
      { label: "Auth + RLS", value: "Enabled" },
    ],
    stack: ["Next.js 15", "Supabase", "Stripe", "Resend", "Vercel"],
    videoSlot: "case-client-portal",
    accentColor: "#0052ff",
    duration: "Internal build",
    href: "/work/client-portal",
    tags: ["Portal", "Dashboard", "Auth", "Invoices", "Files"],
    services: ["Client portal", "Authentication", "Stripe billing", "File uploads"],
    permissionStatus: "internal",
    timeline: [
      { phase: "Discovery", description: "Mapped role permissions (admin/client/contractor), audit log requirements, and Stripe state machine.", dates: "Week 1" },
      { phase: "Schema + auth", description: "Supabase tables, RLS policies, magic-link auth, password reset, session refresh.", dates: "Week 2" },
      { phase: "Portal UI", description: "Project tracker, milestone signoff, file uploader, invoice viewer, support inbox.", dates: "Week 3–4" },
      { phase: "Admin panel", description: "User management, project CRUD, billing overrides, audit log export.", dates: "Week 5" },
      { phase: "Hardening + launch", description: "Penetration sweep, accessibility pass, RUM wiring, internal pilot.", dates: "Week 6" },
    ],
  },
  {
    slug: "service-business",
    client: "Service Business Website",
    logo: "Service Business",
    industry: "Concept · Local Service",
    category: "Concept Rebuild",
    label: "Concept",
    year: "2024",
    visible: true,
    headline:
      "A conversion-focused website for service businesses that need leads fast.",
    summary:
      "Concept rebuild of a contractor / local-service site: online booking, structured lead capture, fast mobile experience, and clearer pricing.",
    story:
      "Concept rebuild to demonstrate WebLogic's small-business stack. Replaces a slow template-driven site with a Next.js build: online booking via Cal.com, structured lead capture wired to email + CRM, mobile-first layout, image pipeline, and clean service pages with transparent pricing.",
    metrics: [
      { label: "LCP improvement", value: "−68%" },
      { label: "Mobile bounce", value: "−42%" },
      { label: "Booking conversion", value: "+180% (demo)" },
      { label: "Lighthouse", value: "98" },
    ],
    stack: ["Next.js 15", "Cal.com", "Sanity", "Resend", "Vercel"],
    videoSlot: "case-service-business",
    accentColor: "#0052ff",
    duration: "Concept rebuild",
    href: "/work/service-business",
    tags: ["Website", "Booking", "Lead Capture", "Local Business"],
    services: ["Website design", "Booking flow", "Lead capture", "SEO"],
    permissionStatus: "concept",
    timeline: [
      { phase: "Audit", description: "Baseline Lighthouse, mobile session recording, call-tracking analysis on existing site.", dates: "Day 1–3" },
      { phase: "Information architecture", description: "Service hierarchy, location pages, lead-magnet placement, structured pricing.", dates: "Week 1" },
      { phase: "Design + content", description: "Mobile-first wireframes, copy rewrite, hero photography pipeline.", dates: "Week 2" },
      { phase: "Build", description: "Next.js implementation, Cal.com booking, lead-capture server actions, image optimization.", dates: "Week 2–3" },
      { phase: "Launch + measure", description: "DNS cutover, analytics + heatmap install, two-week post-launch tune.", dates: "Week 3" },
    ],
  },
  {
    slug: "checkout-flow",
    client: "Checkout Flow",
    logo: "Checkout Flow",
    industry: "Internal Build · Payments",
    category: "Internal Build",
    label: "Internal Build",
    year: "2024",
    visible: true,
    headline:
      "A project deposit flow built for secure payments and cleaner client onboarding.",
    summary:
      "Internal demo of WebLogic's custom Stripe flow: deposit collection, milestone billing, automated invoice generation, and customer dashboard.",
    story:
      "Demo of a payment workflow built for WebLogic's own engagements. Captures a 50% deposit on signup, sends an automated Resend receipt, gates project staging until paid, then invoices the balance after preview approval. Every state is webhook-driven and observable in a small admin panel.",
    metrics: [
      { label: "Payment states", value: "5" },
      { label: "Setup time", value: "~2 hours" },
      { label: "Webhook handlers", value: "8" },
      { label: "Manual touchpoints", value: "0" },
    ],
    stack: ["Stripe", "Next.js Server Actions", "Resend", "Supabase"],
    videoSlot: "case-checkout-flow",
    accentColor: "#0052ff",
    duration: "Internal demo",
    href: "/work/checkout-flow",
    tags: ["Stripe", "Payments", "Deposit", "Checkout"],
    services: ["Stripe integration", "Payment flow", "Webhook automation"],
    permissionStatus: "internal",
    timeline: [
      { phase: "Spec", description: "Stripe product + price catalog modeled in code, env-driven so the build never carries plaintext IDs.", dates: "Day 1" },
      { phase: "Server action", description: "Discriminated-union validation, allowlist enforcement, fallback lead capture if Stripe fails.", dates: "Day 2" },
      { phase: "Webhook", description: "Signature verification, idempotent handlers for completed/failed/subscription events.", dates: "Day 3" },
      { phase: "Email + ops", description: "Resend confirmation, internal Slack ping, intake-form email to customer.", dates: "Day 4" },
    ],
  },
  {
    slug: "restaurant-rebuild",
    client: "Restaurant Rebuild",
    logo: "Restaurant",
    industry: "Concept · Hospitality",
    category: "Concept Rebuild",
    label: "Concept",
    year: "2024",
    visible: true,
    headline:
      "A premium restaurant website with reservations, menu structure, and mobile-first UX.",
    summary:
      "Concept rebuild: improved menu visibility, mobile ordering flow, reservation completion, and clean photography pipeline.",
    story:
      "Concept rebuild of a local restaurant. Replaces a slow image-heavy template with a Next.js build: menu schema indexed by Algolia, integrated reservation flow via OpenTable webhook, and mobile-first photography pipeline using Next/Image + WebP.",
    metrics: [
      { label: "Mobile speed", value: "3.2s → 0.9s" },
      { label: "Reservation completion", value: "+94% (demo)" },
      { label: "Menu scrolls", value: "+220% (demo)" },
      { label: "Lighthouse", value: "100" },
    ],
    stack: ["Next.js 15", "Sanity", "Algolia", "Vercel Image Optimization"],
    videoSlot: "case-restaurant",
    accentColor: "#0052ff",
    duration: "Concept rebuild",
    href: "/work/restaurant-rebuild",
    tags: ["Restaurant", "Reservations", "Menu", "Mobile"],
    services: ["Website design", "Reservations integration", "Menu CMS"],
    permissionStatus: "concept",
    timeline: [
      { phase: "Photo audit", description: "Reshoot list, file-size targets, color-grading reference per dish.", dates: "Week 1" },
      { phase: "Menu schema", description: "Categories, allergens, prices, seasonal flags modeled in Sanity for non-technical edits.", dates: "Week 1" },
      { phase: "Reservation hook-up", description: "OpenTable / Resy webhook to capture booking confirmations in the CMS for analytics.", dates: "Week 2" },
      { phase: "Build + ship", description: "Next.js implementation, image optimization pipeline, mobile-first reservation flow.", dates: "Week 2–3" },
    ],
  },
  {
    slug: "landing-performance",
    client: "Landing Page Performance",
    logo: "Performance Demo",
    industry: "Performance Demo · Before / After",
    category: "Performance Demo",
    label: "Performance Demo",
    year: "2024",
    visible: true,
    headline:
      "A speed-focused landing page rebuild with clearer messaging and stronger conversion structure.",
    summary:
      "Before/after demo: optimized hero, faster load, stronger CTA, cleaner layout. Pure performance + UX play.",
    story:
      "Performance demo showing what WebLogic does to a typical underperforming landing page. Replaces a heavy image-stack with a single hero, defers non-critical JS, replaces 5 above-fold CTAs with one primary + one secondary, and rebuilds the form server-action style.",
    metrics: [
      { label: "LCP", value: "4.1s → 0.6s" },
      { label: "CLS", value: "0.34 → 0" },
      { label: "Conversion lift", value: "+73% (demo)" },
      { label: "JS bundle", value: "−71%" },
    ],
    stack: ["Next.js 15", "Vercel Edge", "Server Actions", "Datadog RUM"],
    videoSlot: "case-landing-performance",
    accentColor: "#0052ff",
    duration: "Performance demo",
    href: "/work/landing-performance",
    tags: ["Performance", "CRO", "SEO", "Speed"],
    services: ["Performance audit", "CRO", "SEO refactor"],
    permissionStatus: "internal",
    timeline: [
      { phase: "RUM baseline", description: "Wired Vercel Speed Insights + Datadog RUM to capture real user LCP / CLS / INP before any change.", dates: "Day 1" },
      { phase: "Above-fold rewrite", description: "Replaced image stack with a single hero, deferred non-critical JS, font subset.", dates: "Day 2–3" },
      { phase: "Form + CTA simplification", description: "5 above-fold CTAs → 1 primary + 1 secondary. Form moved to server actions.", dates: "Day 3" },
      { phase: "A/B + ship", description: "GrowthBook flag for the new layout, 7-day split, full rollout once delta confirmed.", dates: "Day 4–10" },
    ],
  },
];

/* =========================================================================
   TESTIMONIALS — match new fictional clients
   ========================================================================= */

/**
 * Testimonials are currently empty — the homepage hides the section until
 * real client quotes are added. Drop authentic feedback here as engagements
 * close and the homepage will surface them automatically.
 */
export const TESTIMONIALS: Testimonial[] = [];

/* =========================================================================
   BLOG / INSIGHTS — all authored by Caleb Gathu (Founder), 5 posts
   ========================================================================= */

const FOUNDER = { name: "Caleb Gathu", role: "Founder" } as const;

export const POSTS: BlogPost[] = [
  {
    slug: "best-b2b-saas-websites-2026",
    title: "The Best B2B SaaS Websites of 2026",
    excerpt:
      "We tore apart the top 47 B2B SaaS sites of the year — what they get right about composability, motion, and conversion. Patterns you can steal.",
    category: "Field Notes",
    readTime: "12 min",
    date: "Apr 14, 2026",
    author: { ...FOUNDER },
    cover: "post-1",
  },
  {
    slug: "composable-migration-without-momentum-loss",
    title: "How to Migrate to a Composable Architecture Without Losing Momentum",
    excerpt:
      "A field-tested playbook for moving off WordPress, Webflow, or AEM — with zero traffic dip, zero rank loss, and a marketing team that thanks you.",
    category: "Engineering",
    readTime: "9 min",
    date: "Mar 28, 2026",
    author: { ...FOUNDER },
    cover: "post-2",
  },
  {
    slug: "fintech-website-design-2026",
    title: "24 Best Fintech Website Design Examples in 2026",
    excerpt:
      "Trust is the only conversion metric that matters in fintech. Here are 24 sites that engineered it on purpose — and the patterns behind each.",
    category: "Design",
    readTime: "11 min",
    date: "Mar 10, 2026",
    author: { ...FOUNDER },
    cover: "post-3",
  },
  {
    slug: "enterprise-website-migration-guide",
    title: "Enterprise Website Migration Guide: What Actually Works",
    excerpt:
      "Ten enterprise migrations later, here is the only sequence we trust. The boring parts that decide whether a $4M rebuild ships or stalls.",
    category: "Operations",
    readTime: "14 min",
    date: "Feb 22, 2026",
    author: { ...FOUNDER },
    cover: "post-4",
  },
  {
    slug: "future-of-web-development",
    title: "Future of Web Development",
    excerpt:
      "A well-crafted design system is the backbone of consistent, scalable product design. Learn how to create and maintain effective design systems.",
    category: "Engineering",
    readTime: "7 min",
    date: "Feb 06, 2026",
    author: { ...FOUNDER },
    cover: "post-5",
  },
];

/* =========================================================================
   FAQ
   ========================================================================= */

/* =========================================================================
   CASE STUDY DETAIL  (Before/After + Broken/Changed for each demo)
   ========================================================================= */

export interface CaseDetail {
  broken: string[];
  changed: string[];
  before: string;
  after: string;
}

export const CASE_DETAILS: Record<string, CaseDetail> = {
  "client-portal": {
    broken: [
      "Project status lived in 3 different tools (email, drive, spreadsheet)",
      "No client visibility into invoice or payment state",
      "Manual onboarding — every new client took an afternoon",
    ],
    changed: [
      "Single Next.js + Supabase portal with role-based auth",
      "Live milestone tracking + Stripe-integrated invoice status",
      "Automated onboarding email sequence via Resend",
    ],
    before: "Email + spreadsheets · manual onboarding · no client visibility",
    after: "1 portal · auth + RLS · live invoice + Stripe status",
  },
  "service-business": {
    broken: [
      "Old template-driven site loading in 4+ seconds",
      "Booking required calling — no online flow",
      "Mobile menu broke; pricing was hidden three clicks deep",
    ],
    changed: [
      "Mobile-first Next.js rebuild with optimized image pipeline",
      "Online booking via Cal.com wired to email automation",
      "Transparent pricing surfaced on the hero + service pages",
    ],
    before: "4.1s LCP · phone-only booking · hidden pricing",
    after: "0.9s LCP · self-serve booking · transparent pricing",
  },
  "checkout-flow": {
    broken: [
      "Manual invoicing — each project took 30+ minutes to set up",
      "No automated gating between deposit and project kickoff",
      "Customers had no dashboard to see what they'd paid",
    ],
    changed: [
      "Stripe Checkout for 25% deposit on signup, automated via Server Actions",
      "Webhook-driven gating: project doesn't start until deposit clears",
      "Mini admin dashboard surfaces every payment state",
    ],
    before: "Manual invoicing · 30+ min setup · no payment visibility",
    after: "Stripe Checkout · 0 manual touchpoints · live dashboard",
  },
  "restaurant-rebuild": {
    broken: [
      "Image-heavy template loaded in 3+ seconds on mobile",
      "Menu was a single PDF — unreadable on phones",
      "Reservations required calling during business hours",
    ],
    changed: [
      "Mobile-first rebuild with Next/Image WebP pipeline",
      "Menu schema indexed by Algolia with search + categories",
      "OpenTable integration for self-serve reservations 24/7",
    ],
    before: "3.2s mobile · PDF menu · phone-only reservations",
    after: "0.9s mobile · searchable menu · 24/7 self-serve booking",
  },
  "landing-performance": {
    broken: [
      "4.1s LCP — visitors left before the hero loaded",
      "Five competing CTAs above the fold — no clear next action",
      "Heavy JS bundle (1.2MB) on a marketing page",
    ],
    changed: [
      "Single primary CTA + one secondary, server-action form submission",
      "Defer non-critical JS, inline critical CSS, optimized images",
      "Streamed React Server Components — 70%+ bundle reduction",
    ],
    before: "4.1s LCP · 5 CTAs · 1.2MB JS · 0.34 CLS",
    after: "0.6s LCP · 1 CTA · 350kb JS · 0 CLS",
  },
};

export function getCaseDetail(slug: string) {
  return CASE_DETAILS[slug];
}

export const FAQ: FaqItem[] = [
  {
    q: "How much does a website cost?",
    a: "Marketing-site rebuilds start at $750. Client portals and dashboards start at $1,500. Custom business systems (payments, booking, automations) start at $800. Full-stack builds typically land between $3,000 and $12,000 depending on scope. Every project gets a fixed quote — no hourly billing surprises.",
  },
  {
    q: "How long does a project take?",
    a: "Most marketing websites ship in 2–3 weeks. Client portals and Stripe systems run 4–6 weeks. We always show a working URL on day one and ship in two-week increments — never a black-box reveal at the end.",
  },
  {
    q: "Do I have to pay everything upfront?",
    a: "No. Standard terms: 25% deposit to lock in the start date, then milestone billing every two weeks. Final payment is due when the site goes live. Maintenance plans are billed monthly. Net-30 terms available for established businesses.",
  },
  {
    q: "Can you redesign my current website?",
    a: "Yes — that's a large share of our work. We migrate sites off WordPress, Webflow, Squarespace, HubSpot CMS, and custom legacy builds. We preserve your SEO rankings (301 mapping, schema parity), keep your content, and ship the new site with zero downtime.",
  },
  {
    q: "Do you offer ongoing maintenance?",
    a: "Yes. WebLogic Care starts at $75/month and covers hosting, security updates, performance monitoring, monthly analytics reports, and priority support. We don't disappear after launch — your site becomes a system we operate with you.",
  },
  {
    q: "Can you add Stripe payments or a booking system?",
    a: "Yes — Stripe Checkout, Stripe Connect, subscriptions, deposit + balance billing, and custom booking flows (Cal.com, Calendly, or fully custom). All payment systems we build are webhook-driven, observable, and integrate with your CRM and email automation.",
  },
  {
    q: "Can you build a client portal or dashboard?",
    a: "Yes. We build authenticated portals with role-based access (admin / client), file uploads, project status tracking, invoice and payment status, and custom admin panels. Stack: Next.js, Supabase Auth, Stripe, Resend.",
  },
  {
    q: "What if I don't know exactly what I need?",
    a: "Book the free 24-hour audit. Send us your site (or just a sentence about your business) and we'll send back a written plan with three options ranked by what would move your business the most. No obligation, no sales call.",
  },
  {
    q: "Do you work with small businesses?",
    a: "Yes — most of our clients are service businesses, ecommerce brands, creators, and growing online businesses. We do not require an enterprise budget. The starter website package starts at $750. If you have a real business and need real software, we'll work with you.",
  },
  {
    q: "What happens after I submit a free audit request?",
    a: "We review your site within 24 hours and email you a written audit covering performance, mobile usability, SEO baseline, conversion paths, and recommended priorities. If there's a fit, we'll include a fixed-price quote for the work. If there isn't, we'll tell you what to do yourself.",
  },
];

/* =========================================================================
   IMPACT METRICS  (animated counters)
   ========================================================================= */

export const IMPACT: ImpactMetric[] = [
  { label: "Lighthouse target", value: 98 },
  { label: "Median LCP (ms)", value: 700, suffix: "" },
  { label: "Avg. project ship time (wks)", value: 3 },
  { label: "Stripe-integrated builds", value: 4 },
  { label: "Webhook handlers shipped", value: 22 },
  { label: "Maintenance plans", value: 3 },
];

/* =========================================================================
   GLOBE NODES — fictional client cities
   ========================================================================= */

export const GLOBE_NODES: GlobeNode[] = [
  { city: "New York", country: "USA", lat: 40.7128, lng: -74.006, client: "Gong", metric: "+340% organic" },
  { city: "San Francisco", country: "USA", lat: 37.7749, lng: -122.4194, client: "Ramp", metric: "4.8× pipeline" },
  { city: "Atlanta", country: "USA", lat: 33.749, lng: -84.388, client: "Calendly", metric: "+92% conversion" },
  { city: "Glendale", country: "USA", lat: 34.1425, lng: -118.2551, client: "ServiceTitan", metric: "6 brands unified" },
  { city: "Bozeman", country: "USA", lat: 45.6794, lng: -111.0448, client: "Snowflake", metric: "240k learners" },
  { city: "Boston", country: "USA", lat: 42.3601, lng: -71.0589, client: "Datadog", metric: "320k builders" },
  { city: "Austin", country: "USA", lat: 30.2672, lng: -97.7431, client: "CrowdStrike", metric: "−68% LCP" },
  { city: "London", country: "UK", lat: 51.5074, lng: -0.1278, client: "Circle", metric: "14 markets" },
  { city: "Berlin", country: "Germany", lat: 52.52, lng: 13.405, client: "Aurelia", metric: "11 locales" },
  { city: "Amsterdam", country: "Netherlands", lat: 52.3676, lng: 4.9041, client: "Mercator", metric: "Edge rollout" },
  { city: "Tel Aviv", country: "Israel", lat: 32.0853, lng: 34.7818, client: "Trillion", metric: "+58% demos" },
  { city: "Bengaluru", country: "India", lat: 12.9716, lng: 77.5946, client: "Ardent", metric: "5× velocity" },
  { city: "Singapore", country: "Singapore", lat: 1.3521, lng: 103.8198, client: "Cobalt", metric: "11 markets" },
  { city: "Tokyo", country: "Japan", lat: 35.6762, lng: 139.6503, client: "Stratos", metric: "Brand refresh" },
  { city: "Sydney", country: "Australia", lat: -33.8688, lng: 151.2093, client: "Foundry", metric: "Composable rebuild" },
];

/* =========================================================================
   TECH STACK MARQUEE
   ========================================================================= */

export const TECH_STACK = [
  "Next.js 15",
  "TypeScript",
  "Tailwind",
  "Framer Motion",
  "GSAP",
  "Three.js",
  "Storyblok",
  "Sanity",
  "Contentful",
  "Adobe Experience Manager",
  "HubSpot",
  "Salesforce",
  "Segment",
  "GrowthBook",
  "Algolia",
  "Vercel",
  "Cloudflare",
  "Datadog RUM",
  "Zod",
  "Lenis",
];

/* =========================================================================
   CLIENT LOGO MARQUEE  (8 upload slots — user uploads via Asset Manager)
   ========================================================================= */

export const CLIENT_LOGOS = [
  { slot: "client-1", fallback: "Halcyon" },
  { slot: "client-2", fallback: "Northbeam" },
  { slot: "client-3", fallback: "Atlas Compute" },
  { slot: "client-4", fallback: "Cipher Studio" },
  { slot: "client-5", fallback: "Vantage Health" },
  { slot: "client-6", fallback: "Aurelia" },
  { slot: "client-7", fallback: "Trillion" },
  { slot: "client-8", fallback: "Mercator" },
];

/* =========================================================================
   UPLOAD SLOTS  (client can replace placeholders here)
   ========================================================================= */

export const UPLOAD_SLOTS: UploadSlot[] = [
  {
    key: "logo",
    label: "Company Logo",
    description: "Auto-injected into nav, hero, footer.",
    accept: "image/svg+xml,image/png,image/webp",
    recommended: "SVG · transparent · ≤200KB",
    group: "logo",
  },
  {
    key: "teardown-pdf",
    label: "Website Audit Checklist — PDF",
    description: "Delivered when someone clicks 'Download now' in the announcement bar or the lead magnet.",
    accept: "application/pdf",
    recommended: "PDF · ≤10MB · branded cover",
    group: "section",
  },
  {
    key: "founder-photo",
    label: "Founder photo (Caleb Gathu)",
    description: "Rendered in the homepage FounderBlock + /about page. Falls back to initials if not uploaded.",
    accept: "image/jpeg,image/png,image/webp",
    recommended: "JPG · square · ≥800×800 · ≤1MB",
    group: "section",
  },
  // Insights / blog post cover images — replaces the numbered gradient banners.
  ...POSTS.map((p) => ({
    key: p.cover, // e.g. "post-1", "post-2"
    label: `Insights · ${p.title}`,
    description: "Cover image for this blog post card. Renders behind the numeral on the homepage Insights grid.",
    accept: "image/jpeg,image/png,image/webp",
    recommended: "JPG · 16:9 · 1600×900 · ≤500KB",
    group: "section" as const,
  })),
  {
    key: "hero",
    label: "Hero Background Video (optional)",
    description: "Plays muted, looped, behind hero copy. Currently unused — keep for future.",
    accept: "video/mp4,video/webm",
    recommended: "MP4 · 1920×1080 · ≤8MB · 8–15s loop",
    group: "hero",
  },
  ...EXPERTISE.map((tile) => ({
    key: tile.videoSlot,
    label: tile.title,
    description: `Bento tile · ${tile.eyebrow} · plays on hover`,
    accept: "video/mp4,video/webm",
    recommended: "MP4 · 16:10 · ≤4MB · 4–8s loop",
    group: "expertise" as const,
  })),
  // Work card thumbnails (primary slot key — preferred for new uploads).
  ...CASE_STUDIES.map((cs) => ({
    key: `work-${cs.slug}-thumbnail`,
    label: `${cs.client} — Thumbnail screenshot`,
    description: `${cs.category} · static screenshot rendered on the homepage carousel.`,
    accept: "image/jpeg,image/png,image/webp",
    recommended: "JPG · 16:10 · 1600×1000 · ≤500KB · realistic browser screenshot",
    group: "case" as const,
  })),
  // Work card hover videos (primary slot key).
  ...CASE_STUDIES.map((cs) => ({
    key: `work-${cs.slug}-video`,
    label: `${cs.client} — Hover video (optional)`,
    description:
      "Plays only on hover. Falls back to the thumbnail when unset. Mute, loop, 6–12s.",
    accept: "video/mp4,video/webm",
    recommended: "MP4/WebM · 16:10 · 720p · ≤4MB · muted · poster recommended",
    group: "case" as const,
  })),
  // Desktop screenshots — used on /work/[slug] full breakdown pages.
  ...CASE_STUDIES.map((cs) => ({
    key: `work-${cs.slug}-desktop`,
    label: `${cs.client} — Desktop screenshot`,
    description: "Full desktop view rendered on /work/[slug]. Optional.",
    accept: "image/jpeg,image/png,image/webp",
    recommended: "JPG/WebP · 16:10 · 2400×1500 · ≤900KB · straight-on browser shot",
    group: "case" as const,
  })),
  // Mobile screenshots — used on /work/[slug] full breakdown pages.
  ...CASE_STUDIES.map((cs) => ({
    key: `work-${cs.slug}-mobile`,
    label: `${cs.client} — Mobile screenshot`,
    description: "Vertical mobile view rendered on /work/[slug]. Optional.",
    accept: "image/jpeg,image/png,image/webp",
    recommended: "JPG/WebP · 9:19.5 · 750×1624 · ≤500KB · iPhone-style frame",
    group: "case" as const,
  })),
  ...CLIENT_LOGOS.map((c, i) => ({
    key: c.slot,
    label: `Client Logo ${i + 1} — ${c.fallback}`,
    description: "Trusted-by marquee logo · auto-inverted to white on the dark bg.",
    accept: "image/svg+xml,image/png,image/webp",
    recommended: "SVG · monochrome white preferred · ≤80KB",
    group: "client" as const,
  })),
  // About-page team imagery (2 images at the bottom of /about)
  {
    key: "about-team-left",
    label: "About — Composable visual (left card)",
    description: "Used on /about — left card image. Abstract / composable / 3D blocks works well.",
    accept: "image/png,image/jpeg,image/webp",
    recommended: "JPG/PNG · 4:3 · ≤1.5MB",
    group: "section" as const,
  },
  {
    key: "about-team-right",
    label: "About — Team photo (right card)",
    description: "Used on /about — right card image. Team photo or studio shot.",
    accept: "image/png,image/jpeg,image/webp",
    recommended: "JPG · 4:3 · ≤1.5MB",
    group: "section" as const,
  },
];
