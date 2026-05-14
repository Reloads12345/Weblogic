export interface Discipline {
  slug:
    | "design"
    | "engineering"
    | "strategy"
    | "seo-aeo"
    | "cro"
    | "ai";
  number: string;
  title: string;
  subtitle: string;
  intro: string;
  pillars: { title: string; copy: string }[];
  approach: string[];
  deliverables: string[];
  metrics: { label: string; value: string }[];
  related: string[]; // case study slugs
}

export const DISCIPLINES: Discipline[] = [
  {
    slug: "design",
    number: "01",
    title: "Design",
    subtitle: "Brand-native systems and interfaces engineered to convert without diluting the product.",
    intro:
      "We design websites the same way we design products: tokens first, components second, surfaces last. Every motion, color, and typographic choice earns its place against the brand and the funnel.",
    pillars: [
      {
        title: "Design Systems",
        copy: "Token libraries, primitives, motion grammar — the operating system that travels from marketing site to product surface without dilution.",
      },
      {
        title: "Brand Identity",
        copy: "Wordmarks, voice, motion, iconography. We harden brand guidelines so every page feels like it was made by the same hand.",
      },
      {
        title: "Interaction Design",
        copy: "Micro-interactions and motion that earn their frame budget. Choreographed, not bolted on.",
      },
      {
        title: "Illustration & Motion",
        copy: "Custom illustration systems, lottie sequences, and WebGL accents — used surgically.",
      },
    ],
    approach: [
      "We start with tokens, not screens. A 1,840-token system covers color, type, motion, and elevation before a single page is wireframed.",
      "Figma becomes the source of truth — and Storybook keeps it honest. Every component you see in production maps 1:1 to a Figma library.",
      "WCAG 2.2 AA is locked into the design step, not patched in QA. Color contrast, focus states, and motion preferences are budgeted as design constraints.",
    ],
    deliverables: [
      "Token library (color, type, motion, elevation, radius)",
      "Figma source-of-truth + Storybook parity",
      "Component primitives + composed surfaces",
      "Motion grammar + reduced-motion fallbacks",
      "WCAG 2.2 AA audit + remediation plan",
    ],
    metrics: [
      { label: "Design tokens", value: "1,840" },
      { label: "WCAG compliance", value: "AA" },
      { label: "Figma → code parity", value: "100%" },
    ],
    related: ["gong", "ramp", "calendly"],
  },
  {
    slug: "engineering",
    number: "02",
    title: "Engineering",
    subtitle: "Composable, headless, edge-first. Type-safe content models and sub-second LCP at any scale.",
    intro:
      "We don't write code that gets thrown away. We architect the operating system your marketing team will run for the next decade — type-safe, edge-first, and paid back on every shipping cycle.",
    pillars: [
      {
        title: "Composable Architecture",
        copy: "Best-of-breed services assembled into a single coherent stack. No monolith tax, no vendor lock-in.",
      },
      {
        title: "Edge SSR & ISR",
        copy: "Render at the edge, cache where it matters, revalidate at the speed of content. 275+ regions, sub-second from anywhere.",
      },
      {
        title: "Performance Engineering",
        copy: "RUM-driven budgets. We optimize for the slowest 5% of your audience — not the dev's MacBook.",
      },
      {
        title: "Migrations",
        copy: "Off WordPress, Webflow, AEM, or HubSpot CMS. Zero traffic dip, zero ranking loss, written guarantee.",
      },
    ],
    approach: [
      "We ship in your repo. Your engineers see every commit, every PR, every code review — never a black-box hand-off.",
      "Every content model is Zod-validated. Schema drift between CMS and code is caught at build time, not after production.",
      "Performance budgets enforced in CI. LCP, INP, and CLS targets fail the build if regressed beyond threshold.",
    ],
    deliverables: [
      "Production codebase + CI/CD pipeline",
      "Type-safe content schemas (CMS ↔ code)",
      "Performance baselines + budget enforcement",
      "Migration playbook + 301 mapping",
      "Runbooks for content ops, deploys, rollbacks",
    ],
    metrics: [
      { label: "Median LCP", value: "0.7s" },
      { label: "Lighthouse median", value: "98" },
      { label: "Edge regions", value: "275+" },
    ],
    related: ["gong", "circle", "datadog"],
  },
  {
    slug: "strategy",
    number: "03",
    title: "Strategy",
    subtitle: "Positioning, narrative, and ICP — translated into a site that actually moves pipeline.",
    intro:
      "A website is the most expensive sales person you'll ever hire. We start there: who is it talking to, what does it have to prove, and what action does it have to drive on every scroll?",
    pillars: [
      {
        title: "Positioning",
        copy: "Where you sit in the market — and where you're moving. We sharpen the line until your category-of-one is unmistakable.",
      },
      {
        title: "ICP Mapping",
        copy: "Firmographic, technographic, and intent profiles that drive every downstream decision: hero, proof, CTA.",
      },
      {
        title: "Conversion Architecture",
        copy: "The funnel inside the site. We map every path from impression to SQO and engineer the friction out.",
      },
      {
        title: "Content Strategy",
        copy: "What earns its place in the IA. Content that compounds in organic, AEO, and sales enablement simultaneously.",
      },
    ],
    approach: [
      "Five-day diagnostic: RUM, SEO, content audit, brand audit, conversion-path map. We end with a written plan, not a deck.",
      "ICP is the spine. Hero, proof, CTAs, even motion language are tuned per persona — and the personalization stack ships with the site.",
      "Strategy isn't a phase. It's a layer that runs through every build sprint and every Always-On retainer.",
    ],
    deliverables: [
      "Positioning canvas + narrative architecture",
      "ICP + jobs-to-be-done documentation",
      "Information architecture tree + sitemap",
      "Conversion path map (impression → SQO)",
      "Content strategy for organic + AEO",
    ],
    metrics: [
      { label: "ICP variants live", value: "47" },
      { label: "SQO pipeline lift", value: "4.8×" },
      { label: "Conversion lift", value: "+92%" },
    ],
    related: ["ramp", "calendly", "servicetitan"],
  },
  {
    slug: "seo-aeo",
    number: "04",
    title: "SEO / AEO",
    subtitle: "Organic + Answer Engine Optimization. We engineer for both Google's index and ChatGPT's citations.",
    intro:
      "Half of your traffic in 2026 won't come from Google. We engineer marketing sites that win in the SERP and in the answer engines — same content surface, two distribution channels.",
    pillars: [
      {
        title: "Technical SEO",
        copy: "Crawl-budget hygiene, Core Web Vitals, structured data, internal-link mesh. The boring parts done correctly.",
      },
      {
        title: "Schema Architecture",
        copy: "Schema.org markup at every level — Organization, Product, FAQ, Article, BreadcrumbList — to feed both classic SERP and LLM citations.",
      },
      {
        title: "Content Mesh",
        copy: "Pillar pages, supporting clusters, internal-link patterns that compound topical authority over quarters.",
      },
      {
        title: "AEO (Answer Engine Optimization)",
        copy: "Citable, factual, structured content that LLMs prefer to quote. We track citations across ChatGPT, Perplexity, Gemini, and Claude.",
      },
    ],
    approach: [
      "We treat AEO as a first-class metric, not a side-effect. Citations are tracked monthly across the major answer engines.",
      "Every long-form page ships with FAQ schema, BreadcrumbList, and structured pricing/feature data when applicable.",
      "Internal-link patterns are templated — every new page enters the mesh on day one.",
    ],
    deliverables: [
      "Technical SEO audit + remediation",
      "Schema.org markup map across all templates",
      "Content brief library + pillar/cluster IA",
      "AEO citation scorecard (monthly readout)",
      "Migration ranking guarantee (90-day window)",
    ],
    metrics: [
      { label: "Avg. organic lift", value: "+340%" },
      { label: "Ranking loss in migration", value: "0%" },
      { label: "AEO citations / month", value: "1,200+" },
    ],
    related: ["gong", "calendly", "snowflake"],
  },
  {
    slug: "cro",
    number: "05",
    title: "CRO",
    subtitle: "Per-visitor experiences shipped on the edge — without a CRO consultant on retainer.",
    intro:
      "CRO is infrastructure, not a service line. We bake personalization, A/B experimentation, and RUM analytics into the platform so the site keeps optimizing after we leave.",
    pillars: [
      {
        title: "Edge Personalization",
        copy: "Server-rendered variants by industry, firmographic, intent, and source. Sub-50ms swap, no client-side flicker.",
      },
      {
        title: "A/B Experimentation",
        copy: "GrowthBook + LaunchDarkly wired to the design system. Ship a variant in an afternoon, not a sprint.",
      },
      {
        title: "Funnel Analytics",
        copy: "Segment + Mixpanel + Datadog RUM, unified into one dashboard. Every CTA, scroll, and micro-conversion accounted for.",
      },
      {
        title: "Heuristic Audits",
        copy: "Quarterly UX/conversion audits against Nielsen-Norman heuristics, baseline benchmarks, and industry pacers.",
      },
    ],
    approach: [
      "Test on the edge. Ship the win. Retire the variant. We never let dead experiments accrete.",
      "Statistical significance is enforced by the platform — no CRO consultant calling tests early because the line trended up.",
      "Quarterly readouts ladder into the strategy layer — every win compounds into the next sprint's hypotheses.",
    ],
    deliverables: [
      "Edge variant configuration + routing",
      "Experiment playbook + active hypothesis backlog",
      "Unified analytics dashboard (Segment + RUM)",
      "Quarterly heuristic audit + readout",
      "Personalization rules engine + admin",
    ],
    metrics: [
      { label: "Demo conversion lift", value: "+92%" },
      { label: "Live edge variants", value: "47" },
      { label: "Time-to-experiment", value: "< 1 day" },
    ],
    related: ["ramp", "calendly", "servicetitan"],
  },
  {
    slug: "ai",
    number: "06",
    title: "AI",
    subtitle: "AI-driven content, search, and personalization woven into the marketing stack — not bolted on.",
    intro:
      "We treat AI like infrastructure — vector indexes, semantic search, content pipelines, and citation engines that quietly compound throughout the site. Never a chat bubble in the corner.",
    pillars: [
      {
        title: "Vector & Semantic Search",
        copy: "Site-wide search backed by vector embeddings. Visitors find what they meant, not what they typed.",
      },
      {
        title: "AI Content Operations",
        copy: "Briefing, drafting, fact-checking, and translation pipelines. Marketing ships 5× more content without losing voice.",
      },
      {
        title: "LLM Personalization",
        copy: "Hero copy, proof points, even microcopy generated per ICP at the edge. With guardrails, fallbacks, and approval flows.",
      },
      {
        title: "Citations Engine",
        copy: "We engineer for what ChatGPT, Perplexity, and Claude actually quote — and track citations as a core metric.",
      },
    ],
    approach: [
      "AI is invisible until it isn't. No chat bots, no flashy demos — just compounding leverage in search, content, and personalization.",
      "Every LLM-driven surface ships with a deterministic fallback. The site never breaks if the model rate-limits.",
      "Content pipelines live in your CMS. Marketing approves drafts; AI doesn't ship without a human in the loop.",
    ],
    deliverables: [
      "Vector index + semantic search UI",
      "AI content pipeline (brief → draft → review)",
      "Edge LLM personalization + fallbacks",
      "Citation-engine instrumentation",
      "Governance playbook + guardrails",
    ],
    metrics: [
      { label: "Content velocity", value: "5×" },
      { label: "Citation rate (90d)", value: "+71%" },
      { label: "Edge LLM latency", value: "< 90ms" },
    ],
    related: ["datadog", "snowflake", "circle"],
  },
];

export function getDiscipline(slug: string) {
  return DISCIPLINES.find((d) => d.slug === slug);
}
