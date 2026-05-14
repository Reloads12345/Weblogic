export interface LegalDoc {
  slug: "privacy" | "terms" | "security" | "accessibility" | "press-kit";
  title: string;
  subtitle: string;
  effective?: string;
  sections: { heading: string; body: string[] }[];
}

export const LEGAL: LegalDoc[] = [
  {
    slug: "privacy",
    title: "Privacy Policy",
    subtitle:
      "How WebLogic Studio collects, uses, and protects information about visitors and clients.",
    effective: "Effective May 2026",
    sections: [
      {
        heading: "What we collect",
        body: [
          "We collect information you provide directly — name, work email, company, role, and project notes — when you submit a contact form, request the Enterprise Website Teardown, or subscribe to our field notes.",
          "We collect technical data automatically — IP, user agent, referrer, page views, and approximate geographic region — through Datadog RUM and our edge analytics layer.",
        ],
      },
      {
        heading: "How we use it",
        body: [
          "To respond to inbound inquiries, schedule strategy calls, send the deliverables you've requested, and improve our marketing surfaces.",
          "We never sell your information. We share it only with subprocessors essential to the service: HubSpot (CRM), Resend (transactional email), Vercel (hosting), Cloudflare (network), and Datadog (observability).",
        ],
      },
      {
        heading: "Your rights",
        body: [
          "You can request access, correction, deletion, or export of your data at any time by emailing studio@weblogic.studio. We respond within five business days.",
          "EU and UK residents have the rights granted by GDPR / UK-GDPR. California residents have CCPA rights. We honor all applicable requests regardless of jurisdiction.",
        ],
      },
      {
        heading: "Cookies & local storage",
        body: [
          "We use a small set of strictly necessary cookies and localStorage entries — persona preference, dismissed-modal state, and sound toggle. We do not deploy advertising cookies.",
          "Analytics cookies are session-scoped and aggregated; you can disable them in your browser without breaking the site.",
        ],
      },
      {
        heading: "Contact",
        body: [
          "Questions about this policy: studio@weblogic.studio.",
          "Postal: WebLogic Studio · 28 W 36th St, New York, NY 10018.",
        ],
      },
    ],
  },
  {
    slug: "terms",
    title: "Terms of Service",
    subtitle:
      "The agreement that governs your use of weblogic.studio and any deliverables we provide.",
    effective: "Effective May 2026",
    sections: [
      {
        heading: "Use of this site",
        body: [
          "By accessing weblogic.studio you agree to use the site lawfully and not attempt to disrupt or reverse-engineer it. We reserve the right to revoke access for misuse.",
          "All content — copy, design, code, assets, case studies — is © WebLogic Studio unless explicitly attributed otherwise. You may not republish without written permission.",
        ],
      },
      {
        heading: "Engagements",
        body: [
          "These site terms do not constitute an engagement. Engagements are governed by a separate Master Services Agreement (MSA) and a Statement of Work (SOW) signed by both parties.",
          "Quoted ranges on this site are indicative. Actual investment is fixed only in the SOW.",
        ],
      },
      {
        heading: "Intellectual property",
        body: [
          "Deliverables produced under an SOW transfer to the client on full payment, except for our pre-existing tooling, design-system primitives, and engineering libraries, which remain WebLogic property under a perpetual license to the client.",
          "Open-source dependencies retain their original licenses.",
        ],
      },
      {
        heading: "Limitation of liability",
        body: [
          "WebLogic's total liability under any engagement is capped at the fees paid to WebLogic under the relevant SOW in the twelve months preceding the claim.",
          "We are not liable for indirect, incidental, or consequential damages.",
        ],
      },
      {
        heading: "Governing law",
        body: [
          "These terms are governed by the laws of the State of New York. Disputes are resolved in the courts of New York County.",
        ],
      },
    ],
  },
  {
    slug: "security",
    title: "Security",
    subtitle:
      "How we protect client code, content, infrastructure, and customer data.",
    effective: "Effective May 2026",
    sections: [
      {
        heading: "Posture",
        body: [
          "WebLogic operates a SOC 2-aligned program, with annual third-party review of access management, change management, and incident response. Reports available under NDA.",
          "We follow OWASP ASVS Level 2 for engineered surfaces and CIS Benchmarks for the infrastructure we operate on behalf of clients.",
        ],
      },
      {
        heading: "Access controls",
        body: [
          "All staff use SSO with FIDO2 hardware keys. No service account is shared. Production access is just-in-time and audit-logged.",
          "Code review is mandatory; signed commits are required on all release branches.",
        ],
      },
      {
        heading: "Infrastructure",
        body: [
          "Default stack: Vercel + Cloudflare + managed databases (Supabase, Neon, or client-owned). All HTTP traffic is TLS 1.3 with HSTS. Edge regions are isolated per client when required.",
          "RUM and synthetic monitoring on every production surface via Datadog.",
        ],
      },
      {
        heading: "Incident response",
        body: [
          "We follow a documented IR playbook with a 15-minute initial-acknowledgement SLA for high-severity incidents during business hours and a 60-minute SLA off-hours.",
          "Clients on Always-On retainers receive root-cause analysis within 5 business days of any production incident.",
        ],
      },
      {
        heading: "Reporting a vulnerability",
        body: [
          "Send disclosures to security@weblogic.studio. We acknowledge within 24 hours and provide a timeline within 5 business days.",
          "We thank coordinated disclosers publicly with consent.",
        ],
      },
    ],
  },
  {
    slug: "accessibility",
    title: "Accessibility",
    subtitle:
      "Our commitment to building marketing surfaces that meet WCAG 2.2 AA — for our clients and on our own site.",
    effective: "Effective May 2026",
    sections: [
      {
        heading: "Standards",
        body: [
          "Every WebLogic deliverable targets WCAG 2.2 Level AA at minimum. We design accessibility into the token system, not as a remediation pass.",
          "We test with a combination of automated tooling (axe, Lighthouse), manual keyboard-only walkthroughs, and screen-reader passes (NVDA, VoiceOver).",
        ],
      },
      {
        heading: "On this site",
        body: [
          "Color contrast: text passes AA (4.5:1) at all sizes. Decorative elements meet 3:1 where required.",
          "Keyboard: all interactive controls are reachable and operable via keyboard, with visible focus rings (electric blue).",
          "Motion: every animation respects prefers-reduced-motion. Decorative loops can be paused on focus.",
          "Forms: every input has an associated label, descriptive error states, and Zod-validated server-side handling.",
        ],
      },
      {
        heading: "Known limitations",
        body: [
          "The interactive 3D globe is decorative and not exposed to assistive technology. The same data (cities, clients, metrics) is available in the Global Reach section as a list.",
          "If you encounter a barrier, email studio@weblogic.studio with the URL and a description. We aim to acknowledge within 2 business days.",
        ],
      },
    ],
  },
  {
    slug: "press-kit",
    title: "Press Kit",
    subtitle:
      "Brand assets, boilerplate, fact sheet, and founder bio for journalists and partners.",
    sections: [
      {
        heading: "Boilerplate",
        body: [
          "WebLogic is a U.S.-based remote web development studio. We build high-performance websites, client portals, payment systems, and automations for service businesses, startups, creators, and growing online brands that need more than a basic website.",
          "Studio name: WebLogic Studio · Tagline: Websites & systems that evolve with your business. · Established: 2024 · Location: Remote · United States",
        ],
      },
      {
        heading: "Founder",
        body: [
          "Caleb Gathu, Founder. Caleb personally architects and ships every WebLogic engagement, with a small network of senior engineers and designers for surge capacity.",
          "Press contact: studio@weblogic.studio",
        ],
      },
      {
        heading: "Fact sheet",
        body: [
          "Studio type: U.S.-based remote web development studio. Founded: 2024. Performance target: Lighthouse 98+ / sub-second LCP. Average ship time: 2–4 weeks for marketing sites. Maintenance plans: Available from $75/mo.",
          "Selected builds: client portal demo, service-business concept rebuild, Stripe deposit + invoice flow, restaurant rebuild concept, landing-page performance demo. All labeled honestly as internal builds, concept rebuilds, or performance demos.",
        ],
      },
      {
        heading: "Brand assets",
        body: [
          "Wordmark: [ WebLogic ] — full white on matte black, brackets in 40% white. SVG and PNG available on request.",
          "Accent color: electric blue #0052FF. Primary type: Inter. Use without alteration of letter spacing or weight.",
          "Email studio@weblogic.studio for high-resolution assets and for permission to use the wordmark in editorial contexts.",
        ],
      },
    ],
  },
];

export function getLegal(slug: string) {
  return LEGAL.find((l) => l.slug === slug);
}
