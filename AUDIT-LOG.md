# Breezyair — Audit Log

> Chronological record of all significant changes. Last updated: 2026-07-21.

---

### Session: Smoke Test & Data Leak Fixes

**Commit [pending]** — `fix: smoke test fixes for Notion CRM adapter, chat validation, and payment API data leak`

| File | Change | Reason |
|------|--------|--------|
| `src/app/api/payment/create-order/route.ts` | Sanitized 503 error message | **Security fix**: The previous error message leaked `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` strings to the client. |
| `src/app/api/agent/breezy/route.ts` | Added rate limiting (20 req/min/IP) + sanitized 503 message | **Security fix**: Missing rate limiting on chat endpoint exposed LLM API to spam. |
| `src/app/api/agent/voice/route.ts` | Sanitized 503 error message | **Security fix**: Leaked API key names. |
| `src/app/api/enquiry/route.ts` | Handled `SyntaxError` (JSON parse errors) properly with 400 status + sanitized 500 error | **Bug fix**: Prevent leaking internal stack trace details or Notion API errors to the client on malformed requests. |
| `src/app/api/agent/care/feedback/route.ts` | Added `runtime = "nodejs"` and safe try/catch for JSON parsing | **Bug fix**: Enforce correct runtime for Notion API; handle JSON parse errors safely to return 400 instead of 500. |
| `src/lib/agent/adapters/crm.ts` | Removed explicit `Created` property from all `pages.create` calls | **Bug fix**: Notion's API throws a hard 400 error if this property is missing in the user's database. Relying on Notion's built-in "Created time" property is safer and prevents the entire API route from crashing (500) if the user hasn't perfectly configured the Notion schema. |
| `scripts/smoke-test.mjs` | Re-wrote the smoke test from PowerShell to Node.js | PowerShell's `curl.exe` and `Invoke-WebRequest` were corrupting JSON single quotes causing false positive 400/500 errors. |

**Verification**: Ran the full test suite (`node scripts/smoke-test.mjs`), which checks 34 assertions across 8 pages, SEO files, Rate Limiting, Data Leaks, and API routes. Results: **34 PASSED, 0 FAILED**.

### Session: B2B Created Field + Vercel Env Setup Doc

**Uncommitted work in this session:**

| File | Change | Reason |
|------|--------|--------|
| `src/lib/agent/adapters/crm.ts` | Added `Created` Date property to `createB2bLead()` Notion write | `NOTION_SETUP.md` documents `Created` for the B2B DB but the adapter was not writing it, so FIFO sorting wouldn't work. Matches `createLead` / `bookSlot` behaviour. |
| `src/app/api/enquiry/route.ts` | Pass `createdAt: leadData.createdAt` to `createB2bLead` | Ensures B2B and Lead share the same submission timestamp. |
| `.env.example` | Added `NOTION_B2B_LEADS_DB` line; expanded `BREEZY_MODEL` comment with direct-Gemini example | `NOTION_B2B_LEADS_DB` was undocumented; `BREEZY_MODEL=gemini-2.5-flash` is the most common production setting. |
| `.gitignore` | Added `lh*.json` and `lighthouse-report*.json` patterns | Lighthouse runs left 3 large JSON artefacts untracked on every commit. Treat as dev-only. |
| `VERCEL_ENV_SETUP.md` | New file | Deployment-time env var checklist. Documented every var, which environments need it, smoke-test curl commands. Critical for the unresolved `GOOGLE_GENERATIVE_AI_API_KEY` not-on-Vercel issue. |
| `AGENTS.md` | Added `VERCEL_ENV_SETUP.md` row to CRM key-files table | Cross-reference. |
| `MEMORY.md` | Added open-issue bullet for Notion `Created` property; new session log entry | Track that Notion DBs need the Date property added manually (Notion UI change, not a code task). |

**Verification**: `npx tsc --noEmit -p tsconfig.json` clean. No lint output (eslint timed out but pre-existing).

### Session: Chatbot Fix + Documentation

**Commit `59f7e2e`** — `fix(agent): remove VERCEL auto-gateway, require explicit AI_GATEWAY_API_KEY`

| File | Change | Reason |
|------|--------|--------|
| `src/lib/agent/model.ts` | Removed `process.env.VERCEL` from `IS_MODEL_CONNECTED` and `resolveModel()` | On Vercel, `VERCEL=1` is always set, which caused the gateway path to be hit before the Google Gemini provider. Without `AI_GATEWAY_API_KEY`, the gateway fails. |

**Root cause**: The model resolver checked `process.env.AI_GATEWAY_API_KEY || process.env.VERCEL` on line 29. On Vercel, `VERCEL` is always `"1"`, so the gateway path was always hit first. The user's `GOOGLE_GENERATIVE_AI_API_KEY` was only set locally, not on Vercel. The gateway tried to use `moonshotai/kimi-k2` without a key and failed with 500.

**Action required**: Add to Vercel dashboard → Settings → Environment Variables:
- `GOOGLE_GENERATIVE_AI_API_KEY` = (same key as local .env.local)
- `BREEZY_MODEL` = `gemini-2.5-flash`

**Commit `cfc9a69`** — `docs: add CRM architecture, smoke test findings to AGENTS.md`

| File | Change |
|------|--------|
| `AGENTS.md` | Added CRM architecture section: data flow diagram, 4 Notion databases, key files table, known issues table from smoke test |

---

## 2026-07-14

### Session: Performance, SEO, Security, CRM Audit

**Commit `37df697`** — `fix: consentGiven respects user opt-in, amount bounds ₹50-₹50K, add Marathahalli to booking`

| File | Change | Reason |
|------|--------|--------|
| `src/app/api/enquiry/route.ts` | `consentGiven` now reads from request body (default `false`) | Was hardcoded to `true`, violating GDPR/TRAI consent rules |
| `src/app/api/payment/create-order/route.ts` | Added server-side amount bounds check (₹50–₹50,000) | Client-side amount could be tampered with |
| `src/components/ui/booking-form.tsx` | Added `Marathahalli` to LOCALITIES array | Was missing from locality picker despite being a core service area |

**Commit `0d0bbca`** — `seo: add llms.txt, explicit AI crawler rules, AirConditioningService schema, Vercel Analytics`

| File | Change | Purpose |
|------|--------|---------|
| `public/llms.txt` | New file | AI-friendly index for ChatGPT, Perplexity, Claude crawlers |
| `src/app/robots.ts` | Rewritten | Explicit rules for 11 AI user-agents (GPTBot, ClaudeBot, PerplexityBot, etc.) |
| `src/app/layout.tsx` | Enhanced JSON-LD | Upgraded `LocalBusiness` → `AirConditioningService`, added `sameAs`, `founder`, 6 FAQ questions |
| `src/app/layout.tsx` | Added `<Analytics />` | Vercel Analytics integration |
| `package.json` | Added `@vercel/analytics` | Dependency |

**Commit `36382fe`** — `perf: defer ai-sdk/zod/react-markdown to chat open, preload fonts & hero image`

| File | Change | Purpose |
|------|--------|---------|
| `src/components/agent/breezy-widget.tsx` | Rewritten as lightweight launcher | Zero heavy deps — no ai-sdk, zod, react-markdown |
| `src/components/agent/breezy-chat-panel.tsx` | New file | Heavy chat panel, lazy-loaded only when user opens chat |
| `src/app/layout.tsx` | Added `preconnect` to Google Fonts, `preload` hero image | Reduce FCP by ~0.8s |
| `next.config.ts` | Added `serverExternalPackages: ["zod"]`, `optimizePackageImports` | Reduce TBT from 320ms → 230ms |

**Commit `2e833bf`** — `perf: optimize LCP — hero image sizes, AVIF/WebP formats, remove unnecessary client boundary from footer`

| File | Change |
|------|--------|
| `src/app/page.tsx` | Added `sizes` prop to hero image |
| `src/app/services/page.tsx` | Added `sizes` prop to hero image |
| `src/components/layout/footer.tsx` | Removed unused `useState`, converted to server component |
| `next.config.ts` | Added AVIF + WebP image formats |

**Lighthouse results after all optimizations**:
| Metric | Before | After |
|--------|--------|-------|
| Performance | 76 | 75-77 |
| FCP | 2.5s | 1.6-2.2s |
| TBT | 320ms | 230ms |
| LCP | 4.6s | 4.5-4.6s |
| CLS | 0 | 0 |

**Remaining LCP bottleneck**: ~4.5s likely caused by Google Fonts render-blocking CSS + server TTFB from India.

---

### Session: Sanity CMS Integration

**Commit `9128f87`** — `chore: deploy Sanity Studio with app ID config`

**Commit `a31e74a`** — `chore: add blog migration script for Sanity CMS`

| File | Change |
|------|--------|
| `scripts/migrate-blog.ts` | New script to migrate hardcoded blog posts to Sanity |
| `scripts/upload-images.ts` | New script to upload blog images to Sanity CDN |

**Commit `7ba46a3`** — `feat(blog): integrate Sanity CMS for dynamic blog content`

| File | Change |
|------|--------|
| `src/lib/sanity/client.ts` | Sanity client with lazy initialization |
| `src/lib/sanity/schema.ts` | Blog post schema definition |
| `src/lib/blog/posts.ts` | Blog data layer — maps Sanity content to Block[] |
| `src/app/blog/page.tsx` | Async server component, fetches from Sanity |
| `src/app/blog/[slug]/page.tsx` | SSG with ISR (60s revalidation) |

**Sanity config**:
- Project: `v624lop9`
- Dataset: `production`
- Studio: `https://breezyair-blog.sanity.studio`
- 3 blog posts migrated with 5 images

---

### Session: Staging Readiness & Pricing Fix

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

**Root cause**: Price estimator used service IDs (`basic`, `full`) that didn't match booking form's expected values (`basic-service`, `full-service`), causing `selectedService` to be `undefined` and `totalCost` to be `0`.

---

## 2026-07-07

**Commit `de9f8eb`** — `chore: ignore local dev logs`

**Commit `786755a`** — `feat: add breezyair agent and blog stack`
- Multi-provider LLM resolver (6 providers)
- Breezy agent with 7 tools
- Breezy Care daily cron
- Notion CRM adapter (4 databases)
- WhatsApp notification adapter (stubs)
- DND compliance gate (stub)

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
- 2026-07-21: B2B Leads missing `Created` Date property in Notion adapter
- 2026-07-21: Chatbot model resolver — VERCEL auto-gateway bypassed Google provider
- 2026-07-14: consentGiven hardcoded to true
- 2026-07-14: Payment amount no server-side bounds check
- 2026-07-14: Marathahalli missing from booking form
- 2026-07-14: Price estimator → booking flow ID mismatch + missing bundle discounts

### Features
- 2026-07-14: AI search visibility (llms.txt, robots.ts, AirConditioningService schema)
- 2026-07-14: Sanity CMS blog integration (3 posts, ISR)
- 2026-07-14: Vercel Analytics
- 2026-07-14: Widget split (lightweight launcher + lazy chat panel)
- 2026-07-14: Font/hero preloading
- 2026-07-14: Full website complete (9 pages, 7 API routes, AI agent, payments, blog)
- 2026-07-07: Agent system + blog stack
- 2026-07-06: Pricing, Book, About, B2B pages
- 2026-05-09: Initial website

### Infrastructure
- 2026-07-21: .gitignore — ignore Lighthouse reports
- 2026-07-14: optimizePackageImports, serverExternalPackages, AVIF/WebP formats
- 2026-07-14: .gitignore cleanup, vercel.json cron config
- 2026-07-07: Dev log ignoring

### Documentation
- 2026-07-21: VERCEL_ENV_SETUP.md — deployment env var checklist
- 2026-07-21: CRM architecture, smoke test findings in AGENTS.md
- 2026-07-21: Full project memory update
- 2026-07-14: NOTION_SETUP.md, WHATSAPP_SETUP.md
- 2026-07-14: MEMORY.md, AUDIT-LOG.md
