<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know
APIs, conventions, and file structure may differ from your training data. Read relevant guides in `node_modules/next/dist/docs/` before writing any code. Heed deprecation warnings.
<!-- END:nextjs-agent-rules -->

---

# Breezyair — Agent Handoff Documentation

## Project Overview
Multi-page HVAC service website (Home, Services, Contact, Blog, Book, Pricing, B2B, About) using the Next.js App Router with Sanity CMS for blog content.

**Dev server**: `npm run dev` from `d:\Breezyair\web`  
**Live URL**: `https://breezyair.co` (deploy via Vercel)  
**Blog CMS**: Sanity Studio at `https://breezyair-blog.sanity.studio`  
**Repo**: `github.com/ameensyed397-ui/breezyair`

---

## Design System — STRICT RULES

### Colors
| Token       | Hex       | Usage                               |
|-------------|-----------|-------------------------------------|
| Sky Blue    | `#4fc3f7` | Primary — CTAs, icons, active links |
| Amber       | `#ffb74d` | Badges, stats, secondary accents    |
| Navy        | `#0d47a1` | Dark CTA bands, "Most Popular" tag  |
| Near-Black  | `#111111` | All text                            |
| BLACK       | `#000000` | ALL borders and ALL box-shadows     |
| White       | `#ffffff` | Page bg, cards, navbar, footer      |

### ⚠️ Shadow Rule — NON-NEGOTIABLE
**Every single shadow must use `#000000`. Never use navy, blue, or any color.**
- `brutal-shadow` = `box-shadow: 4px 4px 0px 0px #000000`
- `brutal-shadow-sm` = `box-shadow: 2px 2px 0px 0px #000000`
- `card-lift:hover` = `box-shadow: 6px 6px 0px 0px #000000`
- `btn-lift:hover` = `box-shadow: 0 5px 0 #000000`
- `nav-scrolled` = `box-shadow: 0 4px 0 0 #000000`

---

## Typography — STRICT HIERARCHY

| Element                      | Font      | Weight | Class         |
|------------------------------|-----------|--------|---------------|
| Hero H1 (display lines)      | Inter     | 900    | `font-sans font-black` |
| Hero highlight word/line     | Caveat    | Bold   | `font-display` + CSS gradient highlight |
| Section H2                   | Caveat    | Bold   | `font-display` |
| Price numbers (₹3,499)       | Caveat    | Bold   | `font-display` |
| Brand quotes / taglines      | Caveat    | Italic | `font-display italic` |
| Card titles                  | Inter     | Bold   | `font-sans font-bold` (never font-display) |
| Body / descriptions          | Inter     | 400    | default |
| Labels / uppercase tags      | Inter     | Bold   | `uppercase tracking-widest` |
| Buttons / navigation         | Inter     | Bold   | `font-bold uppercase` |

### Highlighter Effect Pattern
```tsx
<span
  className="font-display font-bold text-6xl"
  style={{ background: "linear-gradient(transparent 50%, #4fc3f7 50%)", paddingBottom: "4px" }}
>
  highlighted text here
</span>
```

---

## Page Hero Distinction — CRITICAL

Each page has a UNIQUE hero. Do not duplicate content.

| Page     | Hero Headline                           | Mascot/Image       |
|----------|-----------------------------------------|--------------------|
| Home     | "Your AC fixed, same day. guaranteed."  | `hero-mascot.png`  |
| Services | "All your AC needs, sorted in one visit." | `mascot-outdoor.png` |
| Contact  | "Say Hello to Asad Khan."               | `asad-khan.jpg` in form |

---

## Public Assets
| File                   | Usage                                 |
|------------------------|---------------------------------------|
| `logo-horizontal.png`  | Navbar logo                           |
| `logo-vertical.png`    | Footer logo                           |
| `hero-mascot.png`      | Home page hero (indoor AC mascot)     |
| `mascot-outdoor.png`   | Services hero (outdoor AC with fan)   |
| `mascot-indoor.png`    | Contact sticky note (spinning eyes)   |
| `asad-khan.jpg`        | Technician photo (services + contact) |
| `og-image.png`         | Open Graph image (1200×630)           |

---

## Component API

### `<Navbar />`
- White background, black `border-b-2 border-black`
- Scroll event: adds `.nav-scrolled` → `box-shadow: 0 4px 0 0 #000000`
- Nav links: `border-2 border-black px-4 py-2`, active = `bg-[#4fc3f7]`
- Mobile: hamburger button → full-width dropdown
- BOOK NOW: sky blue filled, black border, `.btn-lift`

### `<Footer />`
- White background, `border-t-2 border-black`
- Left: "Get a Chill Callback" + phone input + "Call Me" button
- Right: quick links + vertical logo
- CTA brand quote: Caveat italic sky blue

### `<Button />`
- Default: `bg-[#4fc3f7] text-black border-2 border-black` + `.btn-lift`
- Outline: `bg-white text-black border-2 border-black` + `.btn-lift`
- Class `.btn-lift`: `translateY(-3px) + box-shadow: 0 5px 0 #000000` on hover

### `<Card />`
- `bg-white border-2 border-black brutal-shadow`
- Hover version: also add `.card-lift` class

### `<Input />`
- `border-2 border-black bg-white` + `focus:ring-2 focus:ring-[#4fc3f7]`

---

## SEO Implementation
| Feature        | File                                    |
|----------------|-----------------------------------------|
| Global metadata | `src/app/layout.tsx`                  |
| JSON-LD schema | `src/app/layout.tsx` (LocalBusiness + FAQ + WebSite) |
| Page metadata  | `export const metadata` in each page  |
| Sitemap        | `src/app/sitemap.ts` → `/sitemap.xml` |
| robots.txt     | `src/app/robots.ts` → `/robots.txt`   |
| Canonical URLs | Set per page via `alternates.canonical` |
| OG image       | `public/og-image.png` (1200×630)      |
| llms.txt       | `public/llms.txt` (AI search visibility) |
| Vercel Analytics | `src/app/layout.tsx` (Analytics component) |

**To activate Google Search Console indexing:**
1. Get verification token from [search.google.com/search-console](https://search.google.com/search-console)
2. Replace `REPLACE_WITH_GOOGLE_SEARCH_CONSOLE_TOKEN` in `layout.tsx` → `metadata.verification.google`

---

## Performance — Lighthouse Audit History

### v3 (current — after widget split + font preload)
| Metric | Score | Previous |
|--------|-------|----------|
| Performance | 75-77 | 76 |
| Accessibility | ~96 | 96 |
| Best Practices | ~100 | 100 |
| SEO | ~100 | 100 |
| FCP | 1.6-2.2s | 2.5s |
| LCP | 4.5-4.6s | 4.6s |
| TBT | 230ms | 320ms |
| CLS | 0 | 0 |

**Optimizations applied:**
- Hero image `sizes` prop on home + services pages
- Font preloading (`preconnect` Google Fonts, `preload` hero image)
- Footer converted to server component (removed unused useState)
- `optimizePackageImports` for lucide-react, @sanity/client, react-markdown, ai, @ai-sdk/react
- `serverExternalPackages: ["zod"]`
- Split breezy-widget into lightweight launcher + lazy-loaded chat panel (defers ai-sdk/zod/react-markdown to chat open)
- Next.js image formats: AVIF + WebP

**Remaining LCP bottleneck:** ~4.5s LCP likely caused by Google Fonts render-blocking CSS + server TTFB to India. Next.js `next/font` already handles font optimization.

---

## Responsive Breakpoints
- Mobile first (`< 768px`): single column, stacked flex
- Tablet (`md:` = 768px+): 2-column layouts
- Desktop (`lg:` = 1024px+): 3-column grids
- All grids: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- All hero sections: `flex-col md:flex-row`

---

## Git Workflow
```bash
# Install
cd web && npm install

# Dev
npm run dev

# Lint
npm run lint

# Build (verify before deploy)
npm run build

# Commit pattern
git commit -m "fix(contact): update phone number in contact cards"
git commit -m "feat(home): add seasonal promotion banner"
git commit -m "seo(layout): add Bing verification token"
```

---

## Content Update Reference
| Task                        | File(s) to Edit |
|-----------------------------|-----------------|
| Phone number                | `contact/page.tsx` cards + `footer.tsx` + `layout.tsx` JSON-LD |
| Email address               | `contact/page.tsx` + `layout.tsx` JSON-LD |
| Service pricing             | `page.tsx` pricing section + `services/page.tsx` service cards |
| Add new service             | `services/page.tsx` → services array |
| Change technician photo     | Replace `public/asad-khan.jpg` (keep same filename) |
| Update service areas        | `contact/page.tsx` map pin desc + `layout.tsx` `areaServed` |
| Add new team member         | `services/page.tsx` → `TEAM` array |
| Change OG image             | Replace `public/og-image.png` (keep 1200×630) |

---

## Known Constraints
- `next/image` requires known image dimensions or `fill` prop — use `fill` for all hero/card images
- Google Maps embed uses a static API URL — update coordinates if office moves
- The Caveat font is loaded from Google Fonts — ensure internet access during development
- `script` with `dangerouslySetInnerHTML` in layout.tsx is intentional (JSON-LD is safe static data)

---

## CRM Architecture (Notion Integration)

### Data Flow
```
Forms → POST /api/enquiry → Zod validation → adapters/crm.ts → Notion (4 DBs)
Chat  → /api/agent/breezy → LLM tools → crm.ts + notify.ts → Notion + WhatsApp
Care  → /api/agent/care/run (cron) → queries Notion → WhatsApp follow-ups
```

### Notion Databases
| Database | Env Var | Written By |
|----------|---------|-----------|
| Leads | `NOTION_LEADS_DB` | `createLead()` — all form types + chat agent |
| Appointments | `NOTION_APPOINTMENTS_DB` | `bookSlot()` — booking form + chat agent |
| AMC Contracts | `NOTION_AMC_DB` | `createAmcContract()` — AMC bookings |
| B2B Leads | `NOTION_B2B_LEADS_DB` | `createB2bLead()` — B2B form |

### Key Files
| File | Role |
|------|------|
| `src/lib/agent/adapters/crm.ts` | Central Notion adapter — all CRUD operations |
| `src/lib/agent/adapters/notify.ts` | WhatsApp notifications (confirmations + urgent alerts) |
| `src/lib/agent/adapters/compliance.ts` | DND/IST compliance checks (currently stub) |
| `src/app/api/enquiry/route.ts` | Unified form endpoint (4 form types) |
| `src/app/api/agent/breezy/route.ts` | Chat agent endpoint |
| `src/app/api/agent/care/run/` | Daily batch follow-up cron |
| `NOTION_SETUP.md` | Database schemas + setup guide |

### Known Issues (from smoke test)
| Issue | Severity | Status |
|-------|----------|--------|
| Payment ID not persisted to CRM | HIGH | Known — needs Razorpay webhook |
| No Razorpay webhook for payment confirmation | MEDIUM | Known — requires webhook endpoint |
| No rate limiting on chat agent | MEDIUM | Known — add rate limiting |
| DND compliance is a stub (`isOnDnd()` always returns false) | LOW | Known — needs DLT provider |
| `NOTION_TECHNICIANS_DB` env var set but unused | LOW | Known — reserved for future |
