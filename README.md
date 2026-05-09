# Breezyair — Neo-Brutalist HVAC Website

A modern, SEO-optimised HVAC service website built for **Breezyair**, Bengaluru's trusted AC repair and maintenance company.

## 🚀 Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Deployment**: Vercel (recommended)

---

## 📁 Project Structure

```
web/
├── public/
│   ├── logo-horizontal.png   ← Navbar logo
│   ├── logo-vertical.png     ← Footer logo
│   ├── hero-mascot.png       ← Indoor AC mascot (home hero)
│   ├── mascot-outdoor.png    ← Outdoor AC mascot (services hero)
│   ├── mascot-indoor.png     ← Spinning-eyes AC mascot (contact sticky note)
│   ├── asad-khan.jpg         ← Lead technician photo
│   └── og-image.png          ← Open Graph / social share image
├── src/
│   ├── app/
│   │   ├── globals.css       ← Design system tokens + utility classes
│   │   ├── layout.tsx        ← Root layout + full SEO metadata + JSON-LD
│   │   ├── page.tsx          ← Home page
│   │   ├── sitemap.ts        ← Auto-generated sitemap.xml
│   │   ├── robots.ts         ← robots.txt
│   │   ├── services/
│   │   │   └── page.tsx      ← Services page
│   │   └── contact/
│   │       └── page.tsx      ← Contact page
│   └── components/
│       ├── layout/
│       │   ├── navbar.tsx    ← Sticky navbar with mobile hamburger
│       │   └── footer.tsx    ← Footer with callback CTA
│       └── ui/               ← shadcn/ui primitives (button, card, input)
└── AGENTS.md                 ← AI agent handoff documentation
```

---

## 🎨 Design System

**Philosophy**: Neo-Brutalism — flat design, 2px black borders, hard black shadows, high contrast.

| Token | Value | Usage |
|-------|-------|-------|
| Sky Blue | `#4fc3f7` | Primary CTA, icons, links, active states |
| Amber | `#ffb74d` | Secondary, badges, stats panels |
| Cool Navy | `#0d47a1` | CTA bands, "Most Popular" badge |
| Black | `#000000` | ALL borders, ALL box-shadows |
| White | `#ffffff` | Page bg, cards, navbar, footer |

**Fonts**:
- `Inter` (900/700/600) — headings, body, UI
- `Caveat` (700/800) — brand quotes, hero highlights, prices

**Typography pattern** (hero headings):
```html
<h1>
  <span class="font-sans font-black text-7xl">Line 1 in Inter</span>
  <span class="font-display text-7xl">
    <span style="background: linear-gradient(transparent 50%, #4fc3f7 50%)">Highlighted Caveat line</span>
  </span>
</h1>
```

---

## 📋 Pages

### Home (`/`)
- **Hero**: "Your AC fixed, same day. guaranteed." — distinct from services page
- Booking widget with service type and locality selects
- Services preview (3 cards)
- Trust band (testimonials, stats)
- How it works (4 steps)
- Pricing plans (3 tiers)
- Lead capture form

### Services (`/services`)
- **Hero**: "All your AC needs, sorted in one visit." — unique content
- Asad Khan technician section (real photo)
- 6-service grid (AC Repair, Maintenance, Installations, Deep Cleaning, Emergency, Energy Audit)
- Why trust us section
- 8-member team grid (coloured avatar cards)
- CTA band

### Contact (`/contact`)
- Contact info (phone, email, web) — clickable cards
- "I'm on my way!" sticky note with indoor mascot
- Booking form with Asad Khan photo in header
- Live Google Maps embed (Indiranagar, Bengaluru)

---

## 🔍 SEO Features

| Feature | Implementation |
|---------|---------------|
| Page titles | Unique per page via `export const metadata` |
| Meta descriptions | Keyword-rich, under 160 chars |
| Open Graph | Full OG tags + custom `og-image.png` (1200×630) |
| Twitter Card | `summary_large_image` |
| JSON-LD | `LocalBusiness` + `FAQPage` + `WebSite` schema |
| Sitemap | Auto at `/sitemap.xml` via `app/sitemap.ts` |
| robots.txt | Auto at `/robots.txt` via `app/robots.ts` |
| Canonical URLs | Set per page |
| Semantic HTML | `<article>`, `<section>`, `<blockquote>`, `aria-label` |
| Image alt text | Keyword-rich on all images |

**To activate Google Search Console**:
1. Get your verification token from [search.google.com/search-console](https://search.google.com/search-console)
2. Replace `REPLACE_WITH_GOOGLE_SEARCH_CONSOLE_TOKEN` in `layout.tsx`

---

## 🛠 Local Development

```bash
cd web
npm install
npm run dev        # → http://localhost:3000
npm run build      # Production build
npm run lint       # ESLint check
```

---

## 🚢 Deployment (Vercel)

1. Push to GitHub
2. Import project in [vercel.com](https://vercel.com)
3. Root directory: `web`
4. Framework: Next.js (auto-detected)
5. Deploy — updates automatically on every git push

**Set production URL in `layout.tsx`**:
```ts
metadataBase: new URL("https://breezyair.co"),
```

---

## 🔧 Updating Content

| Task | File |
|------|------|
| Change phone number | `contact/page.tsx`, `footer.tsx`, `layout.tsx` (JSON-LD) |
| Add a new service | `services/page.tsx` → services array |
| Change pricing | `page.tsx` → pricing section |
| Update technician photo | Replace `public/asad-khan.jpg` |
| Change service areas | `contact/page.tsx` map pin, `layout.tsx` JSON-LD `areaServed` |

---

*Built with ❤️ for Bengaluru's coolest HVAC company.*
