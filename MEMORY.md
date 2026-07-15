# Breezyair — Project Memory

> Auto-updated session log. Last updated: 2026-07-14.

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
| `BreezyWidget` | `components/agent/breezy-widget.tsx` | AI chatbot floating widget |
| `PaymentButton` | `components/ui/payment-button.tsx` | Razorpay checkout |
| `AnimateIn` | `components/ui/animate-in.tsx` | IntersectionObserver scroll animations |
| `Breadcrumbs` | `components/ui/breadcrumbs.tsx` | Breadcrumbs + JSON-LD schema |

### Agent System
| Agent | File | Purpose |
|-------|------|---------|
| Breezy | `lib/agent/breezy.ts` | Lead capture & booking (7 tools) |
| Breezy Care | `lib/agent/care/breezy-care.ts` | Daily batch follow-ups |

**Multi-provider LLM resolver** (`lib/agent/model.ts`): Gateway → Kimi → Minimax → DeepSeek → Gemini → OpenAI

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

### Required for staging
| Variable | Purpose | Status |
|----------|---------|--------|
| `GOOGLE_GENERATIVE_AI_API_KEY` | Gemini LLM for chatbot | ✅ Set locally |
| `NOTION_TOKEN` | Notion CRM auth | ✅ Set locally |
| `NOTION_LEADS_DB` | Leads database | ✅ Set locally |
| `NOTION_APPOINTMENTS_DB` | Appointments database | ✅ Set locally |
| `NOTION_AMC_DB` | AMC contracts database | ✅ Set locally |
| `NOTION_B2B_LEADS_DB` | B2B leads database | ✅ Set locally |
| `NOTION_TECHNICIANS_DB` | Technicians database | ✅ Set locally |
| `CRON_SECRET` | Cron route protection | ⚠️ Weak dev value — needs strong prod value |
| `RAZORPAY_KEY_ID` | Payment gateway | ⚠️ Empty — needed for payments |
| `RAZORPAY_KEY_SECRET` | Payment gateway | ⚠️ Empty — needed for payments |
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

### Open
- ⚠️ `CRON_SECRET` uses weak dev value — must change for production
- ⚠️ Razorpay keys empty — payment flow returns 503 gracefully
- ⚠️ DND compliance is a stub (`isOnDnd()` always returns `false`)
- ⚠️ Voice channel parked (`VOICE_PARKED = true`)
- ⚠️ Google Search Console not activated
- ⚠️ README says Next.js 15 but project uses 16.2.4
- ⚠️ Unused default Next.js SVGs in `/public` (file.svg, globe.svg, etc.)
- ⚠️ 3 hardcoded blog posts (no CMS yet)
- ⚠️ Pricing data duplicated across `price-estimator.tsx`, `booking-form.tsx`, and `pricing.ts`

---

## Git History

```
8488a3f 2026-07-14 fix: align price estimator → booking flow service IDs and bundle pricing
6e0cf4e 2026-07-14 feat: complete full website — pages, AI agent, payments, blog, CRM integration
de9f8eb 2026-07-07 chore: ignore local dev logs
786755a 2026-07-07 feat: add breezyair agent and blog stack
3717942 2026-07-06 refactor: flatten repo to single root + add Pricing, Book, About, B2B pages
762448a 2026-05-09 feat: initial commit — Breezyair HVAC website
```

---

## Session Log

### 2026-07-14 — Staging Readiness & Pricing Fix
1. **Full codebase audit** — assessed 73 files, found 33 modified + 45 untracked files
2. **Committed all pending work** — `6e0cf4e` (5,741 insertions, 1,099 deletions)
3. **Updated .gitignore** — added `.claude/`, `.tmp-claude/`, `UX-AUDIT-REPORT.html`
4. **Build verified** — all 23 routes generate successfully
5. **Pushed to origin/master**
6. **Fixed price estimator → booking flow** — `8488a3f`
   - Root cause: service IDs didn't match (`basic` vs `basic-service`, `full` vs `full-service`)
   - Added `acCount` URL param passing from estimator to booking form
   - Added bundle discount logic to booking form (2 ACs save ₹99, 3 save ₹298, 4+ at ₹449/AC)
   - Added AC count selector for one-off services in booking step 2
7. **Created MEMORY.md and AUDIT-LOG.md**
