# WebLogic — Websites & systems that evolve with your business.

A premium U.S.-based remote web development studio. WebLogic builds
high-performance websites, client portals, payment systems, and automations for
service businesses, startups, creators, and growing online brands.

> **Websites & systems that evolve with your business.**
> Built remotely. Delivered nationwide.

This repo is the WebLogic marketing site — Next.js 15 App Router, TypeScript,
Tailwind, Framer Motion, Three.js (for one decorative element), Resend, and a
built-in admin media library at `/admin`.

---

## Quickstart (local development)

```bash
# 1. Install dependencies
npm install

# 2. (Optional) configure environment
cp .env.example .env.local
# Set RESEND_API_KEY + LEAD_TO_EMAIL if you want the lead form to actually email
# you (sign up at https://resend.com — free tier).

# 3. Start the dev server
npm run dev

# 4. Open http://localhost:3000
```

Production build & start:

```bash
npm run build
npm run start
```

Type-check only:

```bash
npm run typecheck
```

Lint:

```bash
npm run lint
```

---

## Working on WebLogic from school or another computer

You don't need this repo cloned to your laptop to make changes. There are three
clean ways to work remotely.

### Option A — GitHub Codespaces (recommended)

This repo ships with a [`devcontainer.json`](./.devcontainer/devcontainer.json),
so you get a full Node 20 dev environment in your browser.

1. **Push this repo to GitHub** (one-time):

   ```bash
   gh repo create weblogic-studio --private --source=. --remote=origin --push
   ```

   Or via the GitHub UI: create a new repo, then `git remote add origin <url>` and `git push -u origin main`.

2. **Open Codespaces**: On the repo page, click **Code → Codespaces → Create
   codespace on main**. The container provisions automatically, runs
   `npm install` for you, and opens VS Code in your browser.

3. **Run the dev server**:

   ```bash
   npm run dev
   ```

   Codespaces auto-forwards port 3000 and opens a preview tab — your live
   WebLogic site, running in the browser, editable from any computer.

4. **Commit and push changes** from inside Codespaces — Vercel (see below) will
   auto-deploy a preview URL on every push.

### Option B — Vercel Preview Deployments

Connect this repo to [Vercel](https://vercel.com) once:

1. Vercel → Add New → Project → Import this GitHub repo.
2. Add the same environment variables as `.env.local` in **Project Settings →
   Environment Variables**.
3. Every git push triggers a preview deployment with a shareable URL
   (`weblogic-<branch>-<hash>.vercel.app`). Production deploys on push to
   `main`.

This means you can edit from any device that can reach GitHub (phone, school
laptop, Codespaces), push, and have a live preview in seconds.

### Option C — Replit (compatible, lighter)

Replit imports this repo via "Create Repl → Import from GitHub". It detects
Next.js automatically. Run with `npm run dev` and forward port 3000.
Codespaces is more reliable for the heavier Three.js/Framer build steps.

---

## Environment variables

Copy `.env.example` to `.env.local` and set what you need.

| Var | Purpose | Required? |
| --- | --- | --- |
| `RESEND_API_KEY` | Sends "Book a Free Audit" form submissions as real email via [Resend](https://resend.com) | Optional — lead form still logs locally without it |
| `LEAD_TO_EMAIL` | Where leads are delivered (e.g. `studio@weblogic.studio`) | Required if `RESEND_API_KEY` set |
| `LEAD_FROM_EMAIL` | Override From address. Must be a verified Resend sender. | Optional — defaults to `onboarding@resend.dev` |
| `LEAD_WEBHOOK_URL` | Mirror lead JSON to HubSpot / Salesforce / Slack / Make.com webhook | Optional |
| `NEXT_PUBLIC_SITE_URL` | Used in OG/Twitter meta tags | Optional |

**Do not commit `.env.local`.** It's gitignored. Use `.env.example` to document
what envs are needed.

---

## Admin & media uploads

WebLogic ships with a gated admin panel for managing site media.

### Sign in

1. Visit `/admin` on any deployment.
2. Username: `weblogic` — Password: `admin2026`
3. You'll be redirected to `/admin/dashboard`.

> The credentials are hardcoded in `src/components/admin/AdminAuth.ts` — change
> them there. For real production deployments swap to NextAuth, Clerk, or
> Supabase Auth.

### Media library

`/admin/dashboard/media` shows every upload slot the public site supports —
logo, hero, expertise videos, case-study thumbnails, hover videos, client logos,
blog post covers, founder photo, audit-checklist PDF.

Drag-and-drop or click to upload. Files write to `public/uploads/[slot].[ext]`
and a manifest at `public/uploads/manifest.json` tracks them. Refresh the
public site to see new media live.

### How to add a new Work item

Currently work projects live in `src/lib/data.ts` under `CASE_STUDIES`, with
deeper detail in `CASE_DETAILS`. To add a new project:

1. Add a new entry to `CASE_STUDIES` (in `src/lib/data.ts`):

   ```ts
   {
     slug: "new-project",
     client: "New Project",
     industry: "Concept Rebuild · Local Service",
     category: "Concept Rebuild",
     headline: "Short outcome-driven headline.",
     summary: "1–2 sentence summary that appears on the homepage card.",
     story: "Longer paragraph for the /work/[slug] page.",
     metrics: [{ label: "LCP", value: "0.6s" }, ...],
     stack: ["Next.js 15", "Stripe", "Supabase"],
     videoSlot: "case-new-project", // legacy slot key
     duration: "Internal build", // or "Concept rebuild", "Real client"
     href: "#",
     tags: ["Website", "Stripe", "Mobile"],
   }
   ```

2. Optionally add a detail block to `CASE_DETAILS` for the "What was broken /
   What we changed / Before / After" panel on the work card and `/work/[slug]`.

3. Save. Two new upload slots auto-appear in the Media Library:

   - `work-new-project-thumbnail` (screenshot, JPG 16:10 ≤500KB)
   - `work-new-project-video` (hover video, MP4/WebM 720p ≤4MB)

4. Upload your screenshot. It shows on the homepage carousel and the
   `/work/new-project` page immediately. The hover video plays only on mouse
   enter — does not autoplay or preload.

### Recommended export specs

| Asset | Format | Dimensions | Size cap |
| --- | --- | --- | --- |
| Work thumbnail | JPG (or WebP) | 1600×1000 (16:10) | ≤500KB |
| Work hover video | MP4 + WebM | 1280×800 (16:10), 720p | ≤4MB |
| Insights post cover | JPG (or WebP) | 1600×900 (16:9) | ≤500KB |
| Founder photo | JPG | ≥800×800 (square) | ≤1MB |
| Client logos | SVG (monochrome) or PNG | width ≥200px | ≤80KB |
| Audit Checklist PDF | PDF | n/a | ≤10MB |

**Compression tips:**
- For images: [Squoosh](https://squoosh.app) (free, browser-based, supports WebP/AVIF).
- For video: [Handbrake](https://handbrake.fr/) with H.264 + 720p + CRF 28, or
  ffmpeg: `ffmpeg -i in.mov -c:v libx264 -crf 28 -preset slow -an -movflags +faststart out.mp4`.
- Never upload raw 4K. Trim to 6–12 seconds. No audio (videos are muted-on-hover).

---

## Architecture overview

```
src/
├── app/                            # Next.js App Router routes
│   ├── page.tsx                    # Homepage
│   ├── about/                      # /about (uses main Header + Footer)
│   ├── pricing/                    # /pricing (uses main Header + Footer)
│   ├── thank-you/                  # /thank-you (slim header)
│   ├── work/[slug]/                # /work/[slug] (slim header)
│   ├── solutions/[slug]/           # /solutions/[slug] (slim header)
│   ├── privacy/ terms/ security/ accessibility/ press-kit/   # legal pages
│   ├── admin/                      # /admin login + dashboard
│   ├── api/upload/                 # multipart upload API for media
│   └── actions/lead.ts             # Server Action for form submissions
├── components/
│   ├── nav/                        # Header, MegaMenu
│   ├── hero/                       # Hero section
│   ├── sections/                   # Manifesto, Services, CaseStudies, etc.
│   ├── ui/                         # AnnouncementBar, MagneticCursor, LeadModal, etc.
│   ├── admin/                      # AdminLogin, AdminLayout, AdminAuth, AdminGate
│   ├── discipline/                 # /design /engineering legacy detail
│   ├── solution/                   # /solutions/[slug] template
│   └── legal/                      # /privacy /terms /security template
├── lib/
│   ├── data.ts                     # All content: BRAND, NAV, CASE_STUDIES, EXPERTISE, FAQ, POSTS, UPLOAD_SLOTS, etc.
│   ├── solutions.ts                # 30+ solution sub-pages content
│   ├── disciplines.ts              # Legacy discipline pages
│   ├── legal.ts                    # Privacy / Terms / Security / Accessibility / Press Kit copy
│   └── utils.ts
└── types/
    └── index.ts
```

### Header system

- **Main pages** (`/`, `/about`, `/pricing`) use `<Header />` — full nav, mega
  menu, mobile drawer, hide-on-scroll, **Book a Free Audit** CTA.
- **Detail / article pages** (`/work/[slug]`, `/solutions/[slug]`, `/privacy`,
  `/terms`, `/thank-you`, etc.) use the slim header — back button on left,
  centered logo, **Book a Free Audit** CTA on right.
- **Announcement bar** sits above both header types, fixed top, hides on
  scroll-down, reappears on scroll-up, dismissible (session-stored).

To change which pages use which header: open the page's client component (e.g.
`src/app/about/AboutClient.tsx`) and swap `<Header />` (main) for the inline
slim-header block, or vice versa.

---

## Lead form & email delivery

The "Book a Free Audit" modal submits to a Next.js Server Action in
`src/app/actions/lead.ts`. The action:

1. Always writes the lead to `public/uploads/leads.log.jsonl`.
2. If `RESEND_API_KEY` + `LEAD_TO_EMAIL` are set, sends a styled HTML email via
   Resend with all fields (name, email, company, role, current URL, scope,
   budget, timeline, biggest problem, source).
3. If `LEAD_WEBHOOK_URL` is set, mirrors the lead JSON to that webhook.

After submit, the modal closes and navigates to `/thank-you`. To wire analytics
conversion events, add gtag/PostHog in `src/app/thank-you/ThankYouClient.tsx`.

---

## Deploying to Vercel

```bash
# Install Vercel CLI once
npm i -g vercel

# Deploy
vercel
# Follow prompts. First deploy creates the project.
# Subsequent pushes to your linked branch auto-deploy.
```

Or hook GitHub → Vercel via the dashboard (one-click).

**Set the following in Vercel → Settings → Environment Variables (Production +
Preview):**
- `RESEND_API_KEY`
- `LEAD_TO_EMAIL`
- `LEAD_FROM_EMAIL`
- `LEAD_WEBHOOK_URL` (optional)
- `NEXT_PUBLIC_SITE_URL`

`public/uploads/` is committed and deploys with the build. Local uploads via the
admin panel won't sync to production unless you commit them too (or you swap the
upload API to write to S3/R2/Cloudflare KV in production).

---

## Performance targets

| Metric | Target |
| --- | --- |
| Lighthouse Performance | 90+ |
| LCP | <2.5s |
| CLS | <0.1 |
| INP | <200ms |

Notes:
- The 3D globe is lazy-mounted via IntersectionObserver and only runs when
  scrolled into view.
- Lenis smooth scroll is disabled on touch devices.
- Videos use `preload="metadata"`, play on hover only, no autoplay.
- Star count in the globe is capped at 500, DPR cap 1.5.

---

## License

Internal — WebLogic Studio. © 2026.
