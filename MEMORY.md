# Breezyair — Project Memory

> Auto-updated session log. Last updated: 2026-07-21.

---

## Quick Facts

| Field | Value |
|-------|-------|
| **Project** | Breezyair — HVAC service website |
| **Stack** | Next.js 16.2.4, React 19, Tailwind CSS v4, TypeScript 5 |
| **Design** | Neo-Brutalist (black borders, sharp edges, `#000000` shadows only) |
| **Deploy** | Vercel (auto-deploy from `master`) |
| **Live URL** | `https://breezyair.co` |
| **Repo** | `https://github.com/ameensyed397-ui/breezyair.git` |
| **Branch** | `master` (single branch workflow) |
| **Git Identity** | Amzzz <ameensyed397@gmail.com> |

---

## Architecture

### Pages (9 routes)
| Route | Type | Description |
|-------|------|-------------|
| `/` | Static | Home — hero, service cards, trust band, 5-step process, price estimator |
| `/about` | Static | Asad Khan bio, mission, values, credentials |
| `/services` | Static | 9-service grid, Asad profile, team section |
| `/pricing` | Static | Service cards, parts table, bundles, AMC plans |
| `/book` | Static | 5-step booking wizard (service → locality → date → details → payment) |
| `/contact` | Static | Contact cards, booking form, Google Maps embed |
| `/b2b` | Static | Commercial HVAC contracts, enquiry form |
| `/blog` | Static | Blog listing (featured + grid) |
| `/blog/[slug]` | SSG | Dynamic blog articles (3 posts, JSON-LD) |

### API Routes (7 endpoints)
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/enquiry` | POST | Unified form submissions (booking, contact, B2B) |
| `/api/payment/create-order` | POST | Razorpay order creation |
| `/api/payment/verify` | POST | Razorpay payment verification |
| `/api/agent/breezy` | POST | Breezy chat agent (lead capture & booking) |
| `/api/agent/voice` | POST/GET | Voice channel (PARKED — not implemented) |
| `/api/agent/care/run` | GET/POST | Breezy Care daily cron (follow-ups) |
| `/api/agent/care/feedback` | POST | Chat satisfaction tracking |

### Key Components
| Component | Location | Purpose |
|-----------|----------|---------|
| `Navbar` | `components/layout/navbar.tsx` | Sticky nav, scroll shadow, mobile hamburger |
| `Footer` | `components/layout/footer.tsx` | 4-column footer with callback form |
| `PriceEstimator` | `components/ui/price-estimator.tsx` | Interactive price calculator (home page) |
| `BookingForm` | `components/ui/booking-form.tsx` | 5-step booking wizard |
| `BreezyWidget` | `components/agent/breezy-widget.tsx` | AI chatbot floating widget (lightweight launcher) |
| `BreezyChatPanel` | `components/agent/breezy-chat-panel.tsx` | Chat panel (lazy-loaded with ai-sdk, zod, react-markdown) |
| `PaymentButton` | `components/ui/payment-button.tsx` | Razorpay checkout |
| `AnimateIn` | `components/ui/animate-in.tsx` | IntersectionObserver scroll animations |
| `Breadcrumbs` | `components/ui/breadcrumbs.tsx` | Breadcrumbs + JSON-LD schema |

### Agent System
| Agent | File | Purpose |
|-------|------|---------|
| Breezy | `lib/agent/breezy.ts` | Lead capture & booking (7 tools) |
| Breezy Care | `lib/agent/care/breezy-care.ts` | Daily batch follow-ups |

**Multi-provider LLM resolver** (`lib/agent/model.ts`): Gateway (explicit key required) → Kimi → Minimax → DeepSeek → Gemini → OpenAI

**CRM**: Notion adapter (`lib/agent/adapters/crm.ts`) — leads, appointments, AMC, B2B leads

**Notifications**: WhatsApp adapter (`lib/agent/adapters/notify.ts`) — confirmation + urgent escalation

---

## Design System

### Colors
| Token | Hex | Usage |
|-------|-----|-------|
| Sky Blue | `#4fc3f7` | Primary — CTAs, icons, active links |
| Amber | `#ffb74d` | Badges, stats, secondary accents |
| Navy | `#0d47a1` | Dark CTA bands, "Most Popular" tag |
| Near-Black | `#111111` | All text |
| BLACK | `#000000` | ALL borders and ALL box-shadows |
| White | `#ffffff` | Page bg, cards, navbar, footer |

### Shadow Rule (NON-NEGOTIABLE)
Every shadow MUST use `#000000`. Never navy, blue, or any other color.

### Typography
- Hero H1: Inter 900 (`font-sans font-black`)
- Section H2: Caveat Bold (`font-display`)
- Card titles: Inter Bold (`font-bold`)
- Buttons: Inter Bold uppercase

---

## Pricing Data

### Service Prices
| Service | Price | ID |
|---------|-------|----|
| AC Basic Service | ₹499 | `basic-service` |
| AC Full Service | ₹699 | `full-service` |
| Wet Deep Clean | ₹899 | `wet-clean` |
| AC Installation | ₹1,499 | `installation` |
| AC Uninstallation | ₹699 | `uninstallation` |
| Inspection Visit | ₹350 | `inspection` |

### Bundle Discounts (one-off services)
| ACs | Discount | Effective Per-AC |
|-----|----------|------------------|
| 1 | None | Full price |
| 2 | Save ₹99 | ~₹650/AC (full service) |
| 3 | Save ₹298 | ~₹500/AC (full service) |
| 4+ | ₹449/AC flat | ₹449/AC |

### AMC Plans
| Plan | Price | Visits |
|------|-------|--------|
| Chill Basic | ₹1,499/yr | 2 scheduled |
| Bengaluru Cool | ₹2,999/yr | 3 scheduled |
| Villa Plan | ₹1,999/AC/yr | 3 per AC |

### Gas Top-Up by Tonnage
| Tonnage | Price |
|---------|-------|
| 1T | ₹800 |
| 1.5T | ₹1,000 |
| 2T | ₹1,200 |
| 2.5T | ₹1,500 |
| 3T | ₹1,800 |

---

## Environment Variables

### Required for production
| Variable | Purpose | Status |
|----------|---------|--------|
| `GOOGLE_GENERATIVE_AI_API_KEY` | Gemini LLM for chatbot | ✅ Set locally, ❌ **NOT on Vercel** (chatbot broken) |
| `NOTION_TOKEN` | Notion CRM auth | ✅ Set locally |
| `NOTION_LEADS_DB` | Leads database | ✅ Set locally |
| `NOTION_APPOINTMENTS_DB` | Appointments database | ✅ Set locally |
| `NOTION_AMC_DB` | AMC contracts database | ✅ Set locally |
| `NOTION_B2B_LEADS_DB` | B2B leads database | ✅ Set locally |
| `NOTION_TECHNICIANS_DB` | Technicians database | ✅ Set locally |
| `CRON_SECRET` | Cron route protection | ⚠️ Weak dev value — needs strong prod value |
| `RAZORPAY_KEY_ID` | Payment gateway | ⚠️ Working — user handling separately |
| `RAZORPAY_KEY_SECRET` | Payment gateway | ⚠️ Working — user handling separately |
| `GOOGLE_SITE_VERIFICATION` | GSC verification | ❌ Still placeholder |

### Not yet implemented
| Variable | Purpose |
|----------|---------|
| `WHATSAPP_TOKEN` | WhatsApp Cloud API |
| `WHATSAPP_PHONE_NUMBER_ID` | WhatsApp sender |
| `VOICE_PROVIDER` | Voice channel (parked) |
| `DND_PROVIDER` | NCPR/DND compliance (stub) |

---

## Known Issues & Tech Debt

### Resolved
- ✅ Price estimator → booking form service ID mismatch (fixed 2026-07-14)
- ✅ Bundle discounts not applied in booking form (fixed 2026-07-14)
- ✅ Blog migrated from hardcoded to Sanity CMS (fixed 2026-07-14)
- ✅ Hero image LCP optimization — `sizes` prop added (fixed 2026-07-14)
- ✅ Footer converted to server component (fixed 2026-07-14)
- ✅ Breezy widget split — launcher + lazy-loaded chat panel (fixed 2026-07-14)
- ✅ Font preloading + hero image preload (fixed 2026-07-14)
- ✅ AI crawler rules — llms.txt, robots.ts, AirConditioningService schema (fixed 2026-07-14)
- ✅ Vercel Analytics integrated (fixed 2026-07-14)
- ✅ `consentGiven` respects user opt-in (fixed 2026-07-14)
- ✅ Payment amount bounds ₹50-₹50K (fixed 2026-07-14)
- ✅ Marathahalli added to booking form (fixed 2026-07-14)
- ✅ Chatbot model resolver — removed VERCEL auto-gateway (fixed 2026-07-21)
- ✅ CRM leads now include `Created` timestamp for FIFO job sorting (fixed 2026-07-21)
- ✅ Appointments now include `Created` timestamp (fixed 2026-07-21)
- ✅ AC Installation disclaimer — 2nd hand/relocation extra copper pipe charges shown (fixed 2026-07-21)
- ✅ Installation feature text updated to "Piping up to 3m (new AC only)" (fixed 2026-07-21)

### Open
- ⚠️ **`GOOGLE_GENERATIVE_AI_API_KEY` NOT on Vercel** — chatbot returns 503 on production
- ⚠️ `CRON_SECRET` uses weak dev value — must change for production
- ⚠️ DND compliance is a stub (`isOnDnd()` always returns `false`)
- ⚠️ Voice channel parked (`VOICE_PARKED = true`)
- ⚠️ Google Search Console not activated
- ⚠️ README says Next.js 15 but project uses 16.2.4
- ⚠️ Unused default Next.js SVGs in `/public` (file.svg, globe.svg, etc.)
- ⚠️ Pricing data duplicated across `price-estimator.tsx`, `booking-form.tsx`, and `pricing.ts`
- ⚠️ Payment ID not persisted to CRM after successful Razorpay payment
- ⚠️ Notion DBs need a `Created` Date property added (see `VERCEL_ENV_SETUP.md` + `NOTION_SETUP.md`)

---

## Git History

```
bfd8198 2026-07-21 feat(crm): add Created timestamps for FIFO, installation disclaimer for 2nd hand/relocation copper piping
59f7e2e 2026-07-21 fix(agent): remove VERCEL auto-gateway, require explicit AI_GATEWAY_API_KEY
cfc9a69 2026-07-21 docs: add CRM architecture, smoke test findings to AGENTS.md
37df697 2026-07-21 fix: consentGiven respects user opt-in, amount bounds ₹50-₹50K, add Marathahalli
0d0bbca 2026-07-14 seo: add llms.txt, explicit AI crawler rules, AirConditioningService schema, Vercel Analytics
36382fe 2026-07-14 perf: defer ai-sdk/zod/react-markdown to chat open, preload fonts & hero image
2e833bf 2026-07-14 perf: optimize LCP — hero image sizes, AVIF/WebP formats, remove unnecessary client boundary from footer
9128f87 2026-07-14 chore: deploy Sanity Studio with app ID config
a31e74a 2026-07-14 chore: add blog migration script for Sanity CMS
7ba46a3 2026-07-14 feat(blog): integrate Sanity CMS for dynamic blog content
fd0116c 2026-07-14 docs: add MEMORY.md and AUDIT-LOG.md for project tracking
8488a3f 2026-07-14 fix: align price estimator → booking flow service IDs and bundle pricing
6e0cf4e 2026-07-14 feat: complete full website — pages, AI agent, payments, blog, CRM integration
e68b871 2026-07-07 feat: complete Phase 1 build — login redesign, dashboard, UX audit fixes
de9f8eb 2026-07-07 chore: ignore local dev logs
786755a 2026-07-07 feat: add breezyair agent and blog stack
3717942 2026-07-06 refactor: flatten repo to single root + add Pricing, Book, About, B2B pages
762448a 2026-05-09 feat: initial commit — Breezyair HVAC website (Neo-Brutalist design, Next.js 15, SEO-optimized)
```

---

## Session Log

### 2026-07-21 — B2B Created Field, Vercel Env Setup Doc, Cleanup

- **B2B Created field** — `createB2bLead` was missing the `Created` Date property even though `NOTION_SETUP.md` documented it. Added the property to the Notion write and passed `leadData.createdAt` from the enquiry route so B2B and Lead share the same timestamp.
- **VERCEL_ENV_SETUP.md** — New deployment-time checklist. Documents every env var, which environments need it, and how to verify after deploy. Critical for the missing Vercel `GOOGLE_GENERATIVE_AI_API_KEY` issue.
- **.env.example** — Added `NOTION_B2B_LEADS_DB` (was missing) and expanded `BREEZY_MODEL` examples to include direct Gemini usage.
- **Untracked Lighthouse reports** — `lh3.json`, `lh4.json`, `lighthouse-report-v2.json` left out of repo; local dev artefacts only.

### 2026-07-21 — CRM Timestamps, Installation Disclaimer, Chatbot Fix

**CRM timestamps for FIFO** (`commit bfd8198`):
- Added `createdAt: new Date().toISOString()` to all leads in enquiry route
- Added `Created` date property to Notion writes in `createLead()` and `bookSlot()`
- Enables FIFO job sorting in Notion (sort by Created ascending)
- Notion Leads DB needs a "Created" Date property added (see NOTION_SETUP.md)

**AC Installation disclaimer** (`commit bfd8198`):
- Booking form: yellow warning box when "AC Installation" selected — explains 2nd hand/relocation extra copper pipe charges (₹899/m)
- Contact form: inline note below service dropdown when "AC Installation" selected
- Updated installation feature text from "Piping up to 3m" to "Piping up to 3m (new AC only)"

**Chatbot model fix** (`commit 59f7e2e`):
- Removed `process.env.VERCEL` from model resolver — gateway was being hit before Google Gemini provider
- Root cause: on Vercel, `VERCEL=1` is always set, which auto-triggered the gateway path without an API key
- **Action required**: Add `GOOGLE_GENERATIVE_AI_API_KEY` and `BREEZY_MODEL=gemini-2.5-flash` to Vercel env vars

---

### 2026-07-14 — Performance, SEO, Security, CRM Audit

**Performance optimizations** (`commit 36382fe`):
- Breezy widget split: lightweight launcher + lazy-loaded chat panel (defers ai-sdk/zod/react-markdown)
- Font preloading: `preconnect` to Google Fonts, `preload` hero mascot image
- Next.js config: `serverExternalPackages: ["zod"]`, `optimizePackageImports` for 5 packages
- TBT improved: 320ms → 230ms

**SEO & AI visibility** (`commit 0d0bbca`):
- `public/llms.txt` — AI-friendly index for Perplexity, ChatGPT, Claude
- `robots.ts` — explicit allow rules for 11 AI crawler user-agents
- JSON-LD upgraded: `AirConditioningService`, `sameAs`, `founder`, 6 FAQ questions
- Vercel Analytics installed and integrated

**Security & UX fixes** (`commit 37df697`):
- `consentGiven` respects user opt-in (was hardcoded `true`)
- Payment amount bounds check (₹50–₹50,000)
- Marathahalli added to booking form

**CRM smoke test** — traced all data flows:
- Forms → POST /api/enquiry → Zod → Notion (4 DBs)
- Chat → /api/agent/breezy → LLM tools → Notion + WhatsApp
- Care → /api/agent/care/run → Notion → WhatsApp

**Lighthouse results**: Performance 75-77, FCP 1.6-2.2s, LCP 4.5-4.6s, TBT 230ms, CLS 0

---

### 2026-07-14 — Staging Readiness & Pricing Fix

1. Full codebase audit — 73 files assessed, 33 modified + 45 untracked
2. Committed all pending work — `6e0cf4e` (5,741 insertions, 1,099 deletions)
3. Updated .gitignore, verified build (23 routes)
4. Fixed price estimator → booking flow — `8488a3f`
   - Service IDs: `basic` → `basic-service`, `full` → `full-service`
   - Added bundle discount logic to booking form
   - Added AC count selector for one-off services
5. Created MEMORY.md and AUDIT-LOG.md

---

### 2026-07-14 — Sanity CMS Integration

- Sanity project: `v624lop9`, dataset: `production`
- Studio: `https://breezyair-blog.sanity.studio`
- 3 blog posts migrated with 5 images uploaded
- Blog pages now fetch from Sanity with ISR (60s revalidation)
- Blog migration script: `scripts/migrate-blog.ts`

---

### 2026-07-07 — Agent System

- Multi-provider LLM resolver (6 providers)
- Breezy agent with 7 tools (pricing, availability, booking, leads, proposals, escalation)
- Breezy Care daily cron for follow-ups
- Notion CRM adapter (4 databases)
- WhatsApp notification adapter (stubs)
- DND compliance gate (stub)

---

### 2026-07-06 — Repo Restructure

- Flattened from `web/` subdirectory to single root
- Added Pricing, Book, About, B2B pages

---

### 2026-05-09 — Initial Build

- Home, Services, Contact pages
- Neo-Brutalist design system
- Next.js 15 scaffold, SEO, JSON-LD
