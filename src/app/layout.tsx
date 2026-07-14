import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Caveat } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import Script from "next/script";
import { ClientWidgetLoader } from "@/components/layout/client-widget-loader";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const caveat = Caveat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

/* ── Global SEO metadata ─────────────────────────────────── */
export const metadata: Metadata = {
  metadataBase: new URL("https://breezyair.co"),

  title: {
    default: "Breezyair | #1 AC Repair & Maintenance in Bengaluru",
    template: "%s | Breezyair — Bengaluru's Trusted HVAC Experts",
  },
  description:
    "Breezyair offers expert AC repair, deep cleaning, maintenance plans & new installations across Indiranagar, Koramangala, Whitefield & Bengaluru. Same-day service. Certified technicians. No hidden costs.",
  keywords: [
    "AC repair Bengaluru",
    "AC maintenance Bengaluru",
    "HVAC service Bangalore",
    "air conditioner repair Indiranagar",
    "AC cleaning Koramangala",
    "AC installation Whitefield",
    "best AC service Bengaluru",
    "split AC repair Bangalore",
    "AC servicing near me",
    "AC repair Indiranagar",
    "Breezyair",
    "AC technician Bengaluru",
  ],
  authors: [{ name: "Breezyair", url: "https://breezyair.co" }],
  creator: "Breezyair",
  publisher: "Breezyair",
  category: "Home Services",
  applicationName: "Breezyair",
  referrer: "origin-when-cross-origin",
  formatDetection: { email: false, address: false, telephone: false },

  /* ── Open Graph ──────────────────────────────────────── */
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://breezyair.co",
    siteName: "Breezyair",
    title: "Breezyair | #1 AC Repair & Maintenance in Bengaluru",
    description:
      "Expert HVAC services across Bengaluru — same-day repairs, deep cleaning, annual maintenance plans & new installations by certified technicians.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Breezyair — Keeping Bengaluru Cool, One Home at a Time",
        type: "image/png",
      },
    ],
  },

  /* ── Twitter Card ────────────────────────────────────── */
  twitter: {
    card: "summary_large_image",
    title: "Breezyair | AC Repair & Maintenance, Bengaluru",
    description:
      "Expert HVAC services — same-day repairs, deep cleaning, maintenance plans & installations across Bengaluru.",
    images: ["/og-image.png"],
  },

  /* ── Canonical & Robots ──────────────────────────────── */
  alternates: {
    canonical: "https://breezyair.co",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  /* ── Verification (set GOOGLE_SITE_VERIFICATION in .env.local) ────── */
  ...(process.env.GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }
    : {}),

  /* ── Icons — doodle mascot favicon ──────────────────── */
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};

/* ── JSON-LD Structured Data ─────────────────────────────── */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      "@id": "https://breezyair.co/#business",
      name: "Breezyair",
      description:
        "Expert AC repair, deep cleaning, maintenance and installation services in Bengaluru by certified HVAC technicians.",
      url: "https://breezyair.co",
      telephone: "+918660174569",
      email: "hellobreezyair@gmail.com",
      logo: "https://breezyair.co/logo-vertical.png",
      image: "https://breezyair.co/og-image.png",
      priceRange: "₹₹",
      currenciesAccepted: "INR",
      paymentAccepted: "Cash, UPI, Credit Card, Debit Card",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Indiranagar",
        addressLocality: "Bengaluru",
        addressRegion: "Karnataka",
        postalCode: "560038",
        addressCountry: "IN",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: "12.9716",
        longitude: "77.6412",
      },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
          opens: "08:00",
          closes: "20:00",
        },
      ],
      areaServed: [
        { "@type": "City", name: "Bengaluru" },
        { "@type": "Neighborhood", name: "Indiranagar" },
        { "@type": "Neighborhood", name: "Koramangala" },
        { "@type": "Neighborhood", name: "Whitefield" },
        { "@type": "Neighborhood", name: "HSR Layout" },
        { "@type": "Neighborhood", name: "Marathahalli" },
      ],
      serviceType: [
        "AC Repair",
        "AC Maintenance",
        "AC Deep Cleaning",
        "AC Installation",
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "HVAC Services",
        itemListElement: [
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Wet Deep Clean" }, price: "899", priceCurrency: "INR" },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "AC Repair" }, price: "499", priceCurrency: "INR" },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "AC Installation" }, price: "1499", priceCurrency: "INR" },
        ],
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://breezyair.co/#website",
      url: "https://breezyair.co",
      name: "Breezyair",
      description: "Bengaluru's trusted HVAC service provider",
      publisher: { "@id": "https://breezyair.co/#business" },
      potentialAction: {
        "@type": "SearchAction",
        target: { "@type": "EntryPoint", urlTemplate: "https://breezyair.co/?q={search_term_string}" },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: "How much does AC repair cost in Bengaluru?", acceptedAnswer: { "@type": "Answer", text: "AC repair at Breezyair starts from ₹499 for quick repairs. Deep cleaning starts at ₹899. We provide transparent pricing before starting any work — no hidden charges." } },
        { "@type": "Question", name: "Do you offer same-day AC service in Bengaluru?", acceptedAnswer: { "@type": "Answer", text: "Yes! Breezyair offers same-day AC repair and maintenance across Indiranagar, Koramangala, Whitefield, and most of Bengaluru. Call +91 8660174569 for emergency bookings." } },
        { "@type": "Question", name: "Are your AC technicians certified?", acceptedAnswer: { "@type": "Answer", text: "All Breezyair technicians are industry-certified, background-verified professionals with 10+ years of experience in HVAC repair and maintenance." } },
        { "@type": "Question", name: "What areas in Bengaluru do you serve?", acceptedAnswer: { "@type": "Answer", text: "We serve Indiranagar, Koramangala, Whitefield, HSR Layout, Marathahalli, and the wider Bengaluru metropolitan area." } },
      ],
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN" className={`h-full antialiased scroll-smooth ${inter.variable} ${caveat.variable}`}>
      <head>
        <meta name="theme-color" content="#4fc3f7" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        {/* Canonical URLs are emitted per-page via each route's `metadata.alternates.canonical`.
            Do NOT hardcode a global canonical here — it would override every subpage. */}
      </head>
      <body className="min-h-full flex flex-col bg-white text-[#111111]">
        {/* JSON-LD structured data */}
        <Script
          id="json-ld-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Navbar />
        <main className="flex-1" id="main-content">
          {children}
        </main>
        <Footer />
        <ClientWidgetLoader />
      </body>
    </html>
  );
}
