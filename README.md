# WebLogic — Websites & systems that evolve with your business.

A premium U.S.-based remote web development studio. WebLogic builds
high-performance websites, client portals, payment systems, and automations for
service businesses, startups, creators, and growing online brands.

> **Websites & systems that evolve with your business.**
> Built remotely. Delivered nationwide.

Live: **https://weblogic.digital**

This repo is the WebLogic marketing site — Next.js 15 App Router, TypeScript,
Tailwind, Framer Motion, Three.js (one decorative globe), Resend, Stripe,
Vercel Blob (admin uploads), and a small admin panel at `/admin`.

---

## 1. Local development

```powershell
# Install
npm install

# Configure (optional — site runs without env vars, see Fallbacks below)
cp .env.example .env.local
# Edit .env.local — at minimum set RESEND_API_KEY + LEAD_TO_EMAIL if you
# want lead form emails. Stripe keys turn /checkout from simulated to live.

# Run
npm run dev
# → http://localhost:3000
```

---

## 2. Deploy to Vercel

```powershell
git add .
git commit -m "Deploy"
git push
```

Vercel auto-builds and deploys in ~90s. Branches get preview URLs;
`main` deploys to production.

---

## 3. Required environment variables (Vercel → Settings → Environment Variables)

**Scope every variable to all three environments** (Production / Preview / Development)
unless noted. After adding env vars, **redeploy** — Vercel only picks them up on new builds.

### Site identity
| Variable | Value | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://weblogic.digital` | Used by metadata, sitemap, robots, OG, Stripe redirect URLs |
| `NEXT_PUBLIC_CONTACT_EMAIL` | `support@weblogic.digital` | Public contact email shown in UI |
| `SUPPORT_EMAIL` | `support@weblogic.digital` | Mirror used server-side |

### Lead form (Resend)
| Variable | Value | Purpose |
|---|---|---|
| `RESEND_API_KEY` | `re_…` | Required for email delivery |
| `LEAD_FROM_EMAIL` | `"WebLogic Support <support@weblogic.digital>"` | Sender — must be on a verified Resend domain |
| `LEAD_TO_EMAIL` | `caleb@weblogic.digital` | Where leads land |
| `LEAD_WEBHOOK_URL` | (optional) | Posts lead JSON to Slack / HubSpot / Make.com |

### Admin gate
| Variable | Value |
|---|---|
| `ADMIN_USERNAME` | any unguessable string |
| `ADMIN_PASSWORD` | strong random password |

### Stripe
| Variable | Purpose |
|---|---|
| `STRIPE_SECRET_KEY` | `sk_test_…` or `sk_live_…` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_test_…` or `pk_live_…` |
| `STRIPE_WEBHOOK_SECRET` | set once `/api/stripe-webhook` is wired (future) |

### Stripe Price IDs (all required for `/checkout` to function)
All 24 price IDs from your Stripe dashboard — full list in `.env.example`. The code maps these env-var names → Stripe Price IDs at request time. Missing vars trigger the lead-capture fallback (email to caleb@) instead of erroring.

### Storage (admin uploads on production)
| Variable | Value |
|---|---|
| `BLOB_READ_WRITE_TOKEN` | Vercel → Storage → Blob → Settings (paste here for prod uploads) |

If `BLOB_READ_WRITE_TOKEN` is unset, the production admin upload route returns HTTP 503 with an instructional message — uploads continue to work locally via the filesystem.

---

## 4. Media architecture (IMPORTANT — read before adding new media)

The site has **three** media locations. Pick the right one based on use case:

| Folder | Committed? | Survives Vercel deploy? | Use for |
|---|---|---|---|
| `public/brand/` | ✅ Yes | ✅ Yes | Brand mark, logo, official assets that must always ship |
| `public/media/work/` | ✅ Yes | ✅ Yes | Work-section thumbnails. Naming: `{slug}-thumbnail.png` |
| `public/uploads/` | ❌ No (gitignored) | ❌ No | **Development-only.** Admin uploads go here in dev. Files DO NOT ship to Vercel — they exist only on your laptop. |

### Adding a new Work thumbnail
1. Save a 1600×1000 (16:10) PNG/WebP to `public/media/work/{slug}-thumbnail.png`
2. Commit it to git
3. Push — it ships with the next deploy

That's it. `WorkGallery.tsx` resolves thumbs in this order:
1. Admin upload (AssetProvider manifest) — dev only
2. Static committed asset at `/media/work/{slug}-thumbnail.png` — production-safe
3. Browser-frame placeholder if both miss — never broken icons

### Admin uploads on production
Currently development-only. To unlock production uploads:
1. Vercel → Storage → Create Blob Store → copy `BLOB_READ_WRITE_TOKEN`
2. Add to Vercel env vars, redeploy
3. Update `src/app/api/upload/route.ts` to call `@vercel/blob`'s `put()` (package is already installed). This is a Tier 2 task — committed static assets cover all current display needs.

---

## 5. Resend domain verification

1. Resend → Domains → Add → `weblogic.digital`
2. Copy the 3 DNS records (SPF / DKIM / DMARC) → paste into your domain registrar's DNS
3. Wait 15–30 min for "Verified" status
4. Confirm `LEAD_FROM_EMAIL` env var matches a verified address on `weblogic.digital`

Until verification completes, the code falls back to `WebLogic Support <support@weblogic.digital>` which still requires the domain to be verified. As a temporary workaround you can set `LEAD_FROM_EMAIL=onboarding@resend.dev` (Resend's universal sender, always accepted).

---

## 6. Stripe setup checklist

1. Stripe dashboard → confirm all 24 prices exist (Products → Prices)
2. Vercel → all `STRIPE_PRICE_*` env vars match
3. Vercel → redeploy after adding env vars
4. Test card: `4242 4242 4242 4242`, any future expiry, any CVC, any ZIP
5. Test each route:
   - `/checkout?plan=starter` → "Pay Starter Deposit"
   - `/checkout?plan=growth` → "Pay Growth Deposit"
   - `/checkout?plan=businessSystem` → "Pay System Deposit"
   - `/checkout?plan=websiteAudit` → "Buy Website Audit"
   - `/checkout?plan=customProjectDeposit` → "Pay Custom Deposit"
   - `/checkout?mode=care&carePlan=essential` → "Start Essential Care"

If a Stripe call fails for any reason, the route automatically captures the lead via Resend (subject: "Checkout attempt — follow up needed") and redirects the user to `/thank-you?type=lead-checkout-fallback` with "Caleb will follow up" copy. No lead is ever lost.

---

## 7. Recovering leads from Vercel logs

Even if Resend fails, every lead is `console.log`'d as JSON. Search Vercel logs for:
- `[lead] captured` — lead-form submissions
- `[checkout-fallback] lead captured` — failed checkout attempts

Vercel → Project → Logs → search bar.

---

## 8. Performance

Public routes are edge-cached via ISR (`export const revalidate`). Expected metrics after deploy:

| Route | revalidate | First-paint TTFB |
|---|---|---|
| `/` | 1h | 100–300ms |
| `/pricing` | 1h | 100–300ms |
| `/about` | 24h | 100–300ms |
| `/work/[slug]` | 1h | 100–300ms |
| `/checkout` | (dynamic) | 300–800ms |

Below-fold homepage sections are dynamic-imported. Three.js globe + WorkGallery videos lazy-mount via IntersectionObserver. Logo is preloaded with `fetchPriority="high"`.

---

## 9. Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Giant `[WebLogic]` text on every page | `/uploads/logo.png` 404'd; SVG fallback showed | `/public/brand/logo.png` is now committed — pull latest |
| "We couldn't deliver" on lead form | Resend rejected — usually unverified `LEAD_FROM_EMAIL` domain | Verify domain in Resend (see §5) |
| "Checkout temporarily unavailable" | Missing `STRIPE_PRICE_*` env var, OR vars added but not redeployed | Vercel → check all 24 vars are in Production scope → Redeploy |
| Work thumbnails missing on prod | Files in `/public/uploads/` (gitignored) | Move to `/public/media/work/` and commit |
| Logo flash before paint | Browser fetching after HTML | Already handled — `<link rel="preload">` in `<head>` |

---

## 10. Honesty rules (lived in the codebase)

WebLogic is a U.S.-based remote studio. No fake clients, no fake offices, no fake metrics. Project labels in the Work section are honest: `Real Client / Demo / Concept / Internal Build / Performance Demo`. `TESTIMONIALS = []` until real client quotes arrive. Don't use `weblogic.design` or any other domain — `weblogic.digital` is the canonical domain.

---

© 2026 WebLogic. All rights reserved.
