# Breezyair — Audit Log

> Chronological record of all significant changes. Last updated: 2026-07-14.

---

## 2026-07-14

### Session: Staging Readiness + Pricing Fix

**Commit `6e0cf4e`** — `feat: complete full website — pages, AI agent, payments, blog, CRM integration`

| Category | Files | Summary |
|----------|-------|---------|
| New pages | 5 | about, b2b, book, pricing, blog (listing + [slug]) |
| New components | 13 | booking-form, contact-form, home-callback-form, b2b-form, price-estimator, payment-button, ac-types-tabs, animate-in, breadcrumbs, open-chat-button, client-widget-loader, breezy-widget, error/loading/not-found boundaries |
| New API routes | 5 | /api/enquiry, /api/payment/create-order, /api/payment/verify, /api/agent/care/feedback |
| Agent system | 8 files modified | Multi-provider LLM, Notion CRM adapter, WhatsApp adapter, compliance gate, pricing data, types |
| Infrastructure | 4 | vercel.json (cron), .gitignore updated, .env.example expanded, CRLF warnings |
| Assets | 18 new | AC type images, blog covers, chatbot avatars |
| Docs | 2 | NOTION_SETUP.md, WHATSAPP_SETUP.md |

**Total**: 73 files changed, 5,741 insertions, 1,099 deletions

---

**Commit `8488a3f`** — `fix: align price estimator → booking flow service IDs and bundle pricing`

| File | Change | Reason |
|------|--------|--------|
| `price-estimator.tsx` | Fixed service ID mapping in CTA link | `basic` → `basic-service`, `full` → `full-service` |
| `price-estimator.tsx` | Added `&acCount=N` to CTA URL | Pass user's AC count selection to booking form |
| `booking-form.tsx` | Read `acCount` from URL params | Initialize with estimator's selection |
| `booking-form.tsx` | Added `isOneOff` detection | Identify basic/full/wet-clean for AC count support |
| `booking-form.tsx` | Added `BUNDLES` discount record | Match estimator's bundle pricing logic |
| `booking-form.tsx` | Updated `totalCost` calculation | Apply bundle discounts: 2 ACs -₹99, 3 -₹298, 4+ at ₹449/AC |
| `booking-form.tsx` | Added AC count selector in step 2 | Let users adjust count for one-off services |
| `booking-form.tsx` | Updated submission payload | Send correct `acCount` and `amount` |
| `booking-form.tsx` | Updated booking summary display | Show AC count and discounted total |

**Root cause**: Price estimator used service IDs (`basic`, `full`) that didn't match booking form's expected values (`basic-service`, `full-service`), causing `selectedService` to be `undefined` and `totalCost` to be `0`.

---

## 2026-07-07

**Commit `de9f8eb`** — `chore: ignore local dev logs`

**Commit `786755a`** — `feat: add breezyair agent and blog stack`

---

## 2026-07-06

**Commit `3717942`** — `refactor: flatten repo to single root + add Pricing, Book, About, B2B pages`

---

## 2026-05-09

**Commit `762448a`** — `feat: initial commit — Breezyair HVAC website (Neo-Brutalist design, Next.js 15, SEO-optimized)`

Initial project scaffold: Home, Services, Contact pages. Design system, components, SEO, JSON-LD.

---

## Change Categories

### Bug Fixes
- 2026-07-14: Price estimator → booking flow ID mismatch + missing bundle discounts

### Features
- 2026-07-14: Full website complete (9 pages, 7 API routes, AI agent, payments, blog)
- 2026-07-07: Agent system + blog stack
- 2026-07-06: Pricing, Book, About, B2B pages
- 2026-05-09: Initial website

### Infrastructure
- 2026-07-14: .gitignore cleanup, vercel.json cron config
- 2026-07-07: Dev log ignoring
