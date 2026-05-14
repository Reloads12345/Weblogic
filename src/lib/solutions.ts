export type SolutionGroup =
  | "design"
  | "development"
  | "seo"
  | "scope"
  | "cms"
  | "industry"
  | "use-case"
  | "stage"
  | "framework"
  | "cloud";

export interface Solution {
  slug: string;
  group: SolutionGroup;
  label: string;
  hero: string;
  intro: string;
  pillars: { title: string; copy: string }[];
  process: string[];
  stack: string[];
  metrics: { label: string; value: string }[];
  related: string[]; // case study slugs
}

const HUB_INTRO = (focus: string) =>
  `WebLogic engineers ${focus} on a composable, edge-first stack. We assemble the exact set of tools your team needs — type-safe content models, RUM-driven performance budgets, and edge personalization — without the monolith tax.`;

const HUB_PROCESS = [
  "Five-day diagnostic — RUM, SEO, content audit, conversion-path map. Ends in a written plan, not a deck.",
  "Architecture sprint — tokens, schemas, motion grammar, edge runtime locked before a single page is wireframed.",
  "Build & iterate — two-week increments with a working URL on day one. Never a black-box reveal.",
  "Always-On — experimentation, performance budgets, content velocity, edge personalization. The site keeps compounding.",
];

const STACK_DEFAULT = ["Next.js 15", "TypeScript", "Vercel Edge", "Storyblok", "Cloudflare", "Datadog RUM"];

export const SOLUTIONS: Solution[] = [
  // ─── DESIGN ─────────────────────────────────────────────────────────────
  {
    slug: "web-design",
    group: "design",
    label: "Web Design",
    hero: "Web design that compounds revenue, not just pixels.",
    intro: HUB_INTRO("brand-native marketing surfaces"),
    pillars: [
      { title: "Brand-native systems", copy: "Tokens, primitives, motion grammar — your brand as an operating system." },
      { title: "Conversion architecture", copy: "Every surface earns its keep against pipeline. Heuristics + RUM, not opinions." },
      { title: "Tokenized motion", copy: "Choreographed transitions that respect performance and reduced-motion." },
    ],
    process: HUB_PROCESS,
    stack: ["Figma", "Storybook", "Tailwind", "Framer Motion", "GSAP", "Storyblok"],
    metrics: [
      { label: "Avg. organic lift", value: "+340%" },
      { label: "Lighthouse median", value: "98" },
      { label: "Demo conversion lift", value: "+92%" },
    ],
    related: ["gong", "ramp", "calendly"],
  },
  {
    slug: "design-systems",
    group: "design",
    label: "Design Systems",
    hero: "Design systems that travel from marketing site to product surface.",
    intro: HUB_INTRO("token-driven design systems"),
    pillars: [
      { title: "Token libraries", copy: "Color, type, motion, elevation — codified once, consumed everywhere." },
      { title: "Figma → code parity", copy: "Storybook keeps the design library honest. Drift caught at PR review." },
      { title: "Accessibility-locked", copy: "WCAG 2.2 AA budgeted as a design constraint, not a remediation pass." },
    ],
    process: HUB_PROCESS,
    stack: ["Figma", "Storybook", "Style Dictionary", "Tailwind", "Radix UI"],
    metrics: [
      { label: "Tokens per system", value: "1,840" },
      { label: "Figma → code parity", value: "100%" },
      { label: "WCAG", value: "2.2 AA" },
    ],
    related: ["servicetitan", "datadog", "crowdstrike"],
  },
  {
    slug: "illustration-design",
    group: "design",
    label: "Illustration Design",
    hero: "Illustration systems that read instantly and ship at scale.",
    intro: HUB_INTRO("custom illustration systems"),
    pillars: [
      { title: "Brand-locked styles", copy: "A consistent illustration grammar across hero, product, and editorial." },
      { title: "Production pipelines", copy: "SVG-first, CDN-optimized, dark-mode aware." },
      { title: "Motion-ready", copy: "Lottie sequences, micro-interactions, GSAP timelines built into the system." },
    ],
    process: HUB_PROCESS,
    stack: ["Figma", "Illustrator", "Lottie", "Rive", "GSAP"],
    metrics: [
      { label: "Asset library", value: "320+" },
      { label: "Brand recall lift", value: "+71%" },
      { label: "Locales supported", value: "11" },
    ],
    related: ["snowflake", "datadog"],
  },
  {
    slug: "motion-design",
    group: "design",
    label: "Motion Design",
    hero: "Motion as language — choreographed to brand, not to flex.",
    intro: HUB_INTRO("motion grammar and choreography"),
    pillars: [
      { title: "Motion grammar", copy: "Easing, duration, and choreography codified into the design system." },
      { title: "Performance-first", copy: "GPU-accelerated transforms, reduced-motion fallbacks, 60fps budgets." },
      { title: "WebGL & 3D", copy: "Three.js + R3F when the brand earns it. Never decorative for its own sake." },
    ],
    process: HUB_PROCESS,
    stack: ["Framer Motion", "GSAP", "Three.js", "R3F", "Lenis"],
    metrics: [
      { label: "Frame budget", value: "60fps" },
      { label: "Reduced-motion parity", value: "100%" },
      { label: "Lighthouse", value: "98+" },
    ],
    related: ["ramp", "circle"],
  },
  {
    slug: "branding",
    group: "design",
    label: "Branding",
    hero: "Branding that makes the site inevitable, not optional.",
    intro: HUB_INTRO("brand identity systems"),
    pillars: [
      { title: "Wordmark + voice", copy: "Voice, type, color, motion — all aligned to the same north star." },
      { title: "Brand guidelines", copy: "Living documentation, not a frozen PDF." },
      { title: "Cross-surface harmony", copy: "Marketing site, product, sales decks, email — one brand, no drift." },
    ],
    process: HUB_PROCESS,
    stack: ["Figma", "Storybook", "Tailwind", "MDX docs"],
    metrics: [
      { label: "Brand recall lift", value: "+71%" },
      { label: "Brand consistency", value: "100%" },
      { label: "Surfaces unified", value: "9" },
    ],
    related: ["crowdstrike", "ramp"],
  },

  // ─── DEVELOPMENT ───────────────────────────────────────────────────────
  {
    slug: "frontend-development",
    group: "development",
    label: "Frontend Development",
    hero: "Type-safe, edge-rendered frontends that ship sub-second.",
    intro: HUB_INTRO("composable, edge-first frontends"),
    pillars: [
      { title: "Next.js 15 + RSC", copy: "Server Components by default, client interactivity where it earns its weight." },
      { title: "Type-safe schemas", copy: "Zod-validated content models — schema drift caught at build time." },
      { title: "Performance budgets", copy: "LCP / INP / CLS targets enforced in CI." },
    ],
    process: HUB_PROCESS,
    stack: ["Next.js 15", "TypeScript", "React 19", "Tailwind", "Zod", "Vercel Edge"],
    metrics: [
      { label: "Median LCP", value: "0.7s" },
      { label: "Lighthouse median", value: "98" },
      { label: "Type coverage", value: "100%" },
    ],
    related: ["gong", "datadog", "circle"],
  },
  {
    slug: "backend-development",
    group: "development",
    label: "Backend Development",
    hero: "Backends that scale with content velocity, not engineering tickets.",
    intro: HUB_INTRO("edge-deployed backends and APIs"),
    pillars: [
      { title: "Edge runtimes", copy: "Cloudflare Workers + Vercel Edge — sub-50ms responses anywhere." },
      { title: "Type-safe APIs", copy: "tRPC, Zod, end-to-end type safety." },
      { title: "Event-driven", copy: "Webhooks, queues, observability built in from day one." },
    ],
    process: HUB_PROCESS,
    stack: ["Cloudflare Workers", "Vercel Edge", "tRPC", "Zod", "Postgres", "Redis"],
    metrics: [
      { label: "Median TTFB", value: "180ms" },
      { label: "Edge regions", value: "275+" },
      { label: "Uptime SLA", value: "99.99%" },
    ],
    related: ["datadog", "circle", "snowflake"],
  },
  {
    slug: "system-integrations",
    group: "development",
    label: "System Integrations",
    hero: "Wire your CRM, CDP, billing, and search into one coherent stack.",
    intro: HUB_INTRO("CRM, CDP, billing, and search integrations"),
    pillars: [
      { title: "HubSpot · Salesforce", copy: "Lead routing, object sync, pipeline reporting." },
      { title: "Segment · GrowthBook", copy: "Unified event stream, edge personalization." },
      { title: "Algolia · Stripe", copy: "Search and billing wired to the design system." },
    ],
    process: HUB_PROCESS,
    stack: ["HubSpot", "Salesforce", "Segment", "GrowthBook", "Algolia", "Stripe"],
    metrics: [
      { label: "Integrations shipped", value: "120+" },
      { label: "Avg. lead routing", value: "< 4s" },
      { label: "CRM hygiene", value: "99.9%" },
    ],
    related: ["ramp", "calendly"],
  },
  {
    slug: "technical-qa",
    group: "development",
    label: "Technical QA",
    hero: "QA as engineering — automated, observable, never an afterthought.",
    intro: HUB_INTRO("automated QA and observability"),
    pillars: [
      { title: "E2E with Playwright", copy: "Critical flows tested on every PR, screenshots compared." },
      { title: "Visual regression", copy: "Chromatic + Percy gating UI changes at the design system level." },
      { title: "RUM & synthetic", copy: "Datadog watching production. Alerts before users notice." },
    ],
    process: HUB_PROCESS,
    stack: ["Playwright", "Chromatic", "Datadog RUM", "Sentry", "Storybook"],
    metrics: [
      { label: "Critical-flow coverage", value: "100%" },
      { label: "Median bug TTR", value: "< 4h" },
      { label: "Production incidents / qtr", value: "< 1" },
    ],
    related: ["servicetitan", "crowdstrike"],
  },
  {
    slug: "cms-implementation",
    group: "development",
    label: "CMS Implementation",
    hero: "Headless CMS that lets marketing ship without engineering tickets.",
    intro: HUB_INTRO("headless CMS implementations"),
    pillars: [
      { title: "Schema-first", copy: "Zod-validated content models, generated TypeScript types." },
      { title: "Editor UX", copy: "Live preview, draft branches, role-based publishing." },
      { title: "Migration playbook", copy: "Off WordPress, Webflow, AEM, HubSpot CMS — with a written ranking guarantee." },
    ],
    process: HUB_PROCESS,
    stack: ["Storyblok", "Sanity", "Contentful", "Builder", "DatoCMS"],
    metrics: [
      { label: "Time-to-publish", value: "−74%" },
      { label: "Pages migrated", value: "18,420+" },
      { label: "Ranking loss", value: "0%" },
    ],
    related: ["gong", "calendly", "servicetitan"],
  },

  // ─── SEO ───────────────────────────────────────────────────────────────
  {
    slug: "site-structure",
    group: "seo",
    label: "Site Structure",
    hero: "IA that compounds in organic, AEO, and sales enablement at once.",
    intro: HUB_INTRO("information architecture and crawl-budget hygiene"),
    pillars: [
      { title: "Pillar/cluster IA", copy: "Topical authority over quarters, not opportunistic content." },
      { title: "Internal-link mesh", copy: "Templated patterns — every new page enters the mesh on day one." },
      { title: "Crawl-budget hygiene", copy: "Robots, sitemaps, canonicals — the boring parts done correctly." },
    ],
    process: HUB_PROCESS,
    stack: ["Ahrefs", "Screaming Frog", "GSC", "Algolia", "Schema.org"],
    metrics: [
      { label: "Avg. organic lift", value: "+340%" },
      { label: "Time to rank", value: "−58%" },
      { label: "Indexed pages", value: "100%" },
    ],
    related: ["gong", "snowflake"],
  },
  {
    slug: "on-page-seo",
    group: "seo",
    label: "On-Page SEO",
    hero: "On-page SEO that AEO and Google both reward.",
    intro: HUB_INTRO("on-page SEO and AEO"),
    pillars: [
      { title: "Schema.org coverage", copy: "Organization, Product, FAQ, Article, BreadcrumbList — at every level." },
      { title: "Citable content", copy: "Structured, factual prose that LLMs prefer to quote." },
      { title: "Title / meta hygiene", copy: "Templated for consistency, hand-tuned for top-50 pages." },
    ],
    process: HUB_PROCESS,
    stack: ["Schema.org", "Open Graph", "GSC", "Ahrefs", "Surfer"],
    metrics: [
      { label: "AEO citations / mo", value: "1,200+" },
      { label: "CTR lift", value: "+38%" },
      { label: "Snippet wins", value: "47" },
    ],
    related: ["gong", "calendly"],
  },
  {
    slug: "technical-seo",
    group: "seo",
    label: "Technical SEO",
    hero: "Technical SEO engineered into the platform, not bolted on.",
    intro: HUB_INTRO("technical SEO and Core Web Vitals"),
    pillars: [
      { title: "Core Web Vitals", copy: "LCP / INP / CLS budgets enforced in CI." },
      { title: "Migration guarantees", copy: "301 mapping, parallel staging, written guarantee against ranking loss." },
      { title: "Edge-rendered SEO", copy: "Bot-aware caching, structured data on the edge." },
    ],
    process: HUB_PROCESS,
    stack: ["Next.js", "Vercel Edge", "Cloudflare", "GSC", "Datadog RUM"],
    metrics: [
      { label: "Migration ranking loss", value: "0%" },
      { label: "Core Web Vitals pass rate", value: "100%" },
      { label: "Median LCP", value: "0.7s" },
    ],
    related: ["gong", "crowdstrike"],
  },
  {
    slug: "localization",
    group: "seo",
    label: "Localization",
    hero: "Locale-aware sites that load sub-second on every continent.",
    intro: HUB_INTRO("localization and multi-region routing"),
    pillars: [
      { title: "Edge-routed locales", copy: "11+ markets, locale-aware SSR, geo-aware redirects." },
      { title: "Translation pipelines", copy: "CMS-driven, version-controlled, AI-augmented." },
      { title: "hreflang & schema", copy: "Hreflang clusters and locale-specific schema for every page." },
    ],
    process: HUB_PROCESS,
    stack: ["Vercel Edge", "Cloudflare", "Storyblok", "DeepL", "Crowdin"],
    metrics: [
      { label: "Locales supported", value: "11" },
      { label: "Median TTFB", value: "180ms" },
      { label: "Markets unified", value: "14" },
    ],
    related: ["snowflake", "circle"],
  },

  // ─── SCOPE ─────────────────────────────────────────────────────────────
  {
    slug: "website-redesign",
    group: "scope",
    label: "Website Redesign",
    hero: "Website redesigns that ship in 12 weeks and lift pipeline 4×.",
    intro: HUB_INTRO("end-to-end website redesigns"),
    pillars: [
      { title: "Brand-aligned IA", copy: "We start with positioning, not screens." },
      { title: "Composable build", copy: "Next.js + headless CMS + edge personalization." },
      { title: "Always-On hand-off", copy: "Marketing ships pages without engineering tickets after launch." },
    ],
    process: HUB_PROCESS,
    stack: STACK_DEFAULT,
    metrics: [
      { label: "Avg. ship time", value: "12 wks" },
      { label: "Pipeline lift", value: "4.8×" },
      { label: "Lighthouse median", value: "98" },
    ],
    related: ["gong", "ramp", "calendly"],
  },
  {
    slug: "website-migration",
    group: "scope",
    label: "Website Migration",
    hero: "Website migrations with a written guarantee against ranking loss.",
    intro: HUB_INTRO("website migrations off WordPress, Webflow, AEM, HubSpot CMS"),
    pillars: [
      { title: "301 mapping at scale", copy: "Every URL accounted for, automatic diff against staging." },
      { title: "Parallel staging", copy: "Cutovers via shadow traffic — zero downtime, zero rank loss." },
      { title: "GTM / pixel parity", copy: "Reviewed line-by-line. Analytics never miss a beat." },
    ],
    process: HUB_PROCESS,
    stack: ["Next.js", "Vercel Edge", "Storyblok", "Screaming Frog", "GSC"],
    metrics: [
      { label: "Pages migrated", value: "18,420+" },
      { label: "Ranking loss", value: "0%" },
      { label: "Cutover downtime", value: "0 min" },
    ],
    related: ["gong", "servicetitan", "crowdstrike"],
  },
  {
    slug: "ongoing-engagements",
    group: "scope",
    label: "Ongoing Engagements",
    hero: "Always-On retainers that compound month over month.",
    intro: HUB_INTRO("ongoing optimization, content velocity, and experimentation"),
    pillars: [
      { title: "Experimentation", copy: "GrowthBook + LaunchDarkly wired to the design system." },
      { title: "Content velocity", copy: "Marketing ships pages in hours instead of sprints." },
      { title: "Performance budgets", copy: "RUM-driven. Regressions fail the build." },
    ],
    process: HUB_PROCESS,
    stack: ["GrowthBook", "Segment", "Datadog RUM", "Storyblok", "Vercel Edge"],
    metrics: [
      { label: "Time-to-experiment", value: "< 1 day" },
      { label: "Pipeline lift / qtr", value: "+38%" },
      { label: "Live edge variants", value: "47" },
    ],
    related: ["ramp", "calendly", "datadog"],
  },

  // ─── BY CMS ────────────────────────────────────────────────────────────
  ...(["contentful", "sanity", "builder", "datocms", "storyblok", "webflow", "hubspot-cms", "wordpress"].map((cms) => ({
    slug: cms,
    group: "cms" as const,
    label:
      cms === "datocms" ? "DatoCMS" :
      cms === "hubspot-cms" ? "HubSpot CMS" :
      cms === "cms" ? cms : cms[0].toUpperCase() + cms.slice(1).replace("-", " "),
    hero: `${cms === "datocms" ? "DatoCMS" : cms === "hubspot-cms" ? "HubSpot CMS" : cms[0].toUpperCase() + cms.slice(1)} engineered the WebLogic way.`,
    intro: HUB_INTRO(`${cms === "datocms" ? "DatoCMS" : cms === "hubspot-cms" ? "HubSpot CMS" : cms[0].toUpperCase() + cms.slice(1)} implementations and migrations`),
    pillars: [
      { title: "Schema-first", copy: "Zod-validated content models, end-to-end type safety." },
      { title: "Edge-rendered", copy: "Sub-second LCP across every locale, every device." },
      { title: "Editor UX", copy: "Live preview, role-based publishing, draft branches." },
    ],
    process: HUB_PROCESS,
    stack: ["Next.js 15", cms === "hubspot-cms" ? "HubSpot CMS" : cms === "datocms" ? "DatoCMS" : cms[0].toUpperCase() + cms.slice(1), "Vercel Edge", "TypeScript", "Zod"],
    metrics: [
      { label: "Time-to-publish", value: "70% faster" },
      { label: "Pages migrated", value: "1,247+" },
      { label: "Ranking loss", value: "0%" },
    ],
    related: ["gong", "calendly", "servicetitan"],
  }))),

  // ─── INDUSTRY ──────────────────────────────────────────────────────────
  ...([
    { slug: "saas", label: "SaaS", focus: "B2B SaaS marketing engines" },
    { slug: "ai-ml", label: "AI/ML", focus: "AI / ML company websites" },
    { slug: "fintech", label: "FinTech", focus: "fintech and payments marketing surfaces" },
    { slug: "web3", label: "Web3", focus: "Web3 and on-chain protocol sites" },
    { slug: "enterprise-software", label: "Enterprise Software", focus: "enterprise platform marketing engines" },
    { slug: "software-development-tools", label: "Software Development Tools", focus: "developer tool sites and documentation surfaces" },
    { slug: "medtech", label: "MedTech", focus: "medtech and digital health marketing" },
  ].map((i) => ({
    slug: i.slug,
    group: "industry" as const,
    label: i.label,
    hero: `${i.label} websites engineered for trust and pipeline.`,
    intro: HUB_INTRO(i.focus),
    pillars: [
      { title: "Industry-aligned IA", copy: `${i.label} buyers expect specific signals. We engineer them in.` },
      { title: "Trust at every scroll", copy: "Compliance, certifications, and case proof surfaced where buyers expect them." },
      { title: "Pipeline architecture", copy: "Conversion paths tuned to your sales motion." },
    ],
    process: HUB_PROCESS,
    stack: STACK_DEFAULT,
    metrics: [
      { label: "Pipeline lift", value: "4.8×" },
      { label: "Demo conversion", value: "+92%" },
      { label: "Avg. organic lift", value: "+340%" },
    ],
    related: ["gong", "ramp", "datadog"],
  }))),

  // ─── USE CASE ──────────────────────────────────────────────────────────
  ...([
    { slug: "support-in-house-engineers", label: "Support In-House Engineers", focus: "co-build with in-house engineering teams" },
    { slug: "improve-brand-consistency", label: "Improve Brand Consistency", focus: "brand consistency across acquired and regional sites" },
    { slug: "increase-website-conversions", label: "Increase Website Conversions", focus: "conversion-rate optimization at the platform level" },
    { slug: "boost-website-performance", label: "Boost Website Performance", focus: "performance engineering and Core Web Vitals" },
    { slug: "increase-website-traffic", label: "Increase Website Traffic", focus: "organic and AEO growth" },
  ].map((u) => ({
    slug: u.slug,
    group: "use-case" as const,
    label: u.label,
    hero: `${u.label} — engineered into the platform, not bolted on.`,
    intro: HUB_INTRO(u.focus),
    pillars: [
      { title: "Diagnostic-first", copy: "We measure before we touch. RUM, RUM, RUM." },
      { title: "System-level fixes", copy: "Solutions that compound, not patches." },
      { title: "Always-On loop", copy: "Wins ladder into the next sprint's hypotheses." },
    ],
    process: HUB_PROCESS,
    stack: ["Next.js 15", "Datadog RUM", "GrowthBook", "Vercel Edge", "Storyblok"],
    metrics: [
      { label: "Avg. organic lift", value: "+340%" },
      { label: "Conversion lift", value: "+92%" },
      { label: "Pipeline lift", value: "4.8×" },
    ],
    related: ["gong", "ramp", "servicetitan"],
  }))),

  // ─── STAGE ─────────────────────────────────────────────────────────────
  {
    slug: "startups",
    group: "stage",
    label: "Startups",
    hero: "Websites for startups that have outgrown their PLG-era site.",
    intro: HUB_INTRO("growth-stage startups in the PLG-to-enterprise transition"),
    pillars: [
      { title: "Speed-to-launch", copy: "12-week ship cycles, real working URL on day one." },
      { title: "Investor-ready brand", copy: "Look like the company you're becoming." },
      { title: "Composable foundation", copy: "Ready to scale to enterprise without a rebuild." },
    ],
    process: HUB_PROCESS,
    stack: STACK_DEFAULT,
    metrics: [
      { label: "Ship time", value: "12 wks" },
      { label: "Pipeline lift", value: "4.8×" },
      { label: "Engineering hours saved", value: "1,200+" },
    ],
    related: ["ramp", "calendly"],
  },
  {
    slug: "enterprise",
    group: "stage",
    label: "Enterprise",
    hero: "Enterprise websites that survive acquisitions, audits, and re-orgs.",
    intro: HUB_INTRO("enterprise marketing surfaces"),
    pillars: [
      { title: "Multi-brand systems", copy: "Federated design systems, single source of truth." },
      { title: "Security & compliance", copy: "SOC 2-aligned, signed deploys, audit-logged access." },
      { title: "Cross-team enablement", copy: "Marketing, brand, sales, support — one platform." },
    ],
    process: HUB_PROCESS,
    stack: ["Next.js 15", "Contentful", "Vercel Edge", "Storybook", "Datadog RUM"],
    metrics: [
      { label: "Properties unified", value: "9" },
      { label: "Cutover downtime", value: "0 min" },
      { label: "Lighthouse median", value: "98" },
    ],
    related: ["servicetitan", "crowdstrike", "snowflake"],
  },

  // ─── FRAMEWORK ─────────────────────────────────────────────────────────
  ...([
    { slug: "nextjs", label: "Next.js" },
    { slug: "gatsby", label: "Gatsby" },
  ].map((f) => ({
    slug: f.slug,
    group: "framework" as const,
    label: f.label,
    hero: `${f.label} engineered the WebLogic way — type-safe, edge-rendered, observable.`,
    intro: HUB_INTRO(`${f.label} marketing engines`),
    pillars: [
      { title: "Type-safe schemas", copy: "Zod-validated content models from CMS to component." },
      { title: "Edge SSR & ISR", copy: "Sub-second LCP from any continent." },
      { title: "Performance CI", copy: "LCP / INP / CLS gates on every PR." },
    ],
    process: HUB_PROCESS,
    stack: [f.label, "TypeScript", "Vercel Edge", "Zod", "Datadog RUM"],
    metrics: [
      { label: "Median LCP", value: "0.7s" },
      { label: "Lighthouse median", value: "98" },
      { label: "Type coverage", value: "100%" },
    ],
    related: ["gong", "datadog", "circle"],
  }))),

  // ─── CLOUD ─────────────────────────────────────────────────────────────
  ...([
    { slug: "vercel", label: "Vercel" },
    { slug: "netlify", label: "Netlify" },
  ].map((c) => ({
    slug: c.slug,
    group: "cloud" as const,
    label: c.label,
    hero: `${c.label} deployments engineered for sub-second response, anywhere.`,
    intro: HUB_INTRO(`${c.label} deployments and edge runtimes`),
    pillars: [
      { title: "Edge SSR & ISR", copy: "275+ regions, sub-50ms responses." },
      { title: "Preview environments", copy: "Every PR gets a URL. Every URL gets RUM." },
      { title: "Observability", copy: "Datadog RUM + synthetic monitors on every release." },
    ],
    process: HUB_PROCESS,
    stack: [c.label, "Next.js 15", "TypeScript", "Datadog RUM"],
    metrics: [
      { label: "Edge regions", value: "275+" },
      { label: "Median TTFB", value: "180ms" },
      { label: "Uptime SLA", value: "99.99%" },
    ],
    related: ["datadog", "circle"],
  }))),
];

export function getSolution(slug: string) {
  return SOLUTIONS.find((s) => s.slug === slug);
}

export function listSolutions(group: SolutionGroup) {
  return SOLUTIONS.filter((s) => s.group === group);
}
