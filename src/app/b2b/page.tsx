import {
  Building2, Store, UtensilsCrossed, Dumbbell, Stethoscope, Server,
  CheckCircle2, FileText, Wrench, ShieldCheck, Phone, Mail, ArrowRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { B2bForm } from "@/components/ui/b2b-form";
import { AcTypesTabs } from "@/components/ui/ac-types-tabs";
import { OpenChatButton } from "@/components/ui/open-chat-button";

export const metadata: Metadata = {
  title: "Commercial AC Contracts & B2B HVAC AMC in Bengaluru | Breezyair",
  description:
    "Annual maintenance contracts for offices, restaurants, clinics and co-working spaces in Bengaluru. Split, cassette, ductable & VRF systems serviced. Priority SLA. GST invoicing. Free site survey.",
  alternates: { canonical: "https://breezyair.co/b2b" },
  keywords: ["Commercial AC contracts Bengaluru", "B2B HVAC AMC", "Bengaluru HVAC consultant", "HVAC contractor", "VRF AC installation", "AC Ducts installations"],
  openGraph: {
    title: "Breezyair Commercial — AC Contracts for Bengaluru Businesses",
    description:
      "Priority SLA, dedicated technician, GST invoicing. Split, cassette, ductable & VRF systems. Free site survey.",
    url: "https://breezyair.co/b2b",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

/* ── Segment data ─────────────────────────────────────────────── */
const segments = [
  {
    icon: Building2,
    title: "Offices & Co-working",
    body: "Whether it\u2019s 4 split ACs or a multi-floor VRF system, we service it all on a fixed annual contract. Keep teams productive with zero-downtime cooling.",
  },
  {
    icon: UtensilsCrossed,
    title: "Restaurants & Caf\u00e9s",
    body: "Dining AC failure during peak hours loses you covers. Our 2-hour emergency SLA and monthly filter cleaning keep your guests comfortable and your kitchen ventilated.",
  },
  {
    icon: Store,
    title: "Retail & Showrooms",
    body: "Warm floors reduce dwell time. We maintain every cassette and split unit on a scheduled cycle so your customers stay and browse longer.",
  },
  {
    icon: Stethoscope,
    title: "Clinics & Labs",
    body: "Temperature-critical spaces \u2014 vaccine storage, imaging rooms, diagnostic areas \u2014 need precision climate control. We service with manufacturer-grade protocols.",
  },
  {
    icon: Dumbbell,
    title: "Gyms & Studios",
    body: "High-occupancy spaces push AC systems hard. Our monthly service cycle and priority breakdown SLA keep your members cool through every session.",
  },
  {
    icon: Server,
    title: "Server & IT Rooms",
    body: "Server room AC failure is a data risk. We offer fortnightly checks, 2-hour emergency response, and redundancy unit testing to keep your infrastructure protected.",
  },
];

/* ── Contract tiers ───────────────────────────────────────────── */
const tiers = [
  {
    name: "Care",
    tagline: "Small offices \u00b7 retail shops \u00b7 single-unit restaurants",
    highlight: false,
    features: [
      "Quarterly preventive servicing (4/yr per unit)",
      "48-hr emergency SLA",
      "10% off ad-hoc repairs",
      "Shared technician pool",
      "Annual summary report",
      "GST invoicing on request",
      "Split & Cassette ACs covered",
    ],
  },
  {
    name: "Pro",
    tagline: "Multi-unit offices \u00b7 restaurants \u00b7 gyms \u00b7 co-working",
    highlight: true,
    features: [
      "Monthly preventive servicing (12/yr per unit)",
      "12-hr emergency SLA",
      "20% off ad-hoc repairs",
      "Dedicated technician",
      "Quarterly health reports",
      "GST invoicing included",
      "Split, Cassette, Ductable & VRF covered",
    ],
  },
  {
    name: "Critical",
    tagline: "Clinics \u00b7 labs \u00b7 server rooms \u00b7 24/7 operations",
    highlight: false,
    features: [
      "Fortnightly + on-call servicing (26+/yr per unit)",
      "2-hr emergency SLA",
      "25% off ad-hoc repairs",
      "Dedicated + backup technician",
      "Compliance-ready monthly reports",
      "GST invoicing included",
      "All types incl. Precision AC (partner-assisted)",
    ],
  },
];

/* ── Workflow steps ───────────────────────────────────────────── */
const steps = [
  { num: "01", title: "You get in touch", desc: "Fill the form on this page or call us directly. Tell us your premises type and rough AC count. We\u2019ll call back within 2 hours." },
  { num: "02", title: "Free site survey", desc: "Asad visits your premises \u2014 no cost, no obligation. He photographs every unit, checks condition, measures spaces, and notes any issues." },
  { num: "03", title: "Custom quote in 48 hours", desc: "You get a detailed proposal: units covered, service frequency, SLA tier, annual price, and a clear breakdown of what\u2019s included." },
  { num: "04", title: "You decide what\u2019s included", desc: "We walk you through optional add-ons \u2014 gas refills, parts pre-approval, out-of-hours cover. You choose what fits your budget." },
  { num: "05", title: "Contract live \u2014 first service within 2 weeks", desc: "Sign the contract, we schedule the baseline service. Every unit is serviced, photographed, and reported." },
];

export default function B2b() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Commercial AC Maintenance Contracts",
    provider: {
      "@type": "LocalBusiness",
      name: "Breezyair",
      url: "https://breezyair.co"
    },
    areaServed: {
      "@type": "City",
      name: "Bengaluru"
    },
    description: "Annual maintenance contracts for offices, restaurants, clinics and co-working spaces in Bengaluru. Split, cassette, ductable & VRF systems serviced."
  };

  return (
    <div className="flex flex-col w-full">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ── 1. HERO ──────────────────────────────────────────── */}
      <section aria-label="B2B hero" className="bg-[#0d47a1] border-b-2 border-black">
        <div className="max-w-7xl mx-auto px-4 md:px-8 w-full pt-10 md:pt-16 pb-14">
          <div className="flex flex-col lg:flex-row gap-10 items-center">
            {/* Left copy */}
            <div className="flex flex-col gap-5 max-w-3xl flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 border-2 border-white bg-[#ffb74d] text-black text-xs font-bold uppercase tracking-wide w-fit rotate-[-2deg] brutal-shadow-sm">
                FOR BUSINESS &middot; COMMERCIAL HVAC CONTRACTS
              </div>
              <h1 className="flex flex-col gap-1">
                <span className="font-sans font-black text-4xl sm:text-5xl md:text-6xl text-white leading-[1.05]">Commercial cooling,</span>
                <span className="font-display font-bold text-4xl sm:text-5xl md:text-6xl leading-[1.1]">
                  <span style={{ background: "linear-gradient(transparent 50%, #4fc3f7 50%)", paddingBottom: "4px" }}>on contract.</span>
                </span>
                <span className="font-sans font-black text-2xl sm:text-3xl md:text-4xl text-white/50 leading-[1.1]">Zero downtime.</span>
              </h1>
              <p className="text-sm text-white/70 leading-relaxed max-w-md">
                Annual maintenance contracts, bulk servicing and priority SLAs for Bengaluru businesses. One accountable
                partner for every AC on your premises — with clean GST invoicing and reporting your finance team will love.
              </p>
              <div className="flex flex-wrap gap-3 mt-1">
                <Link href="#enquiry">
                  <button className="btn-lift bg-[#4fc3f7] text-black font-bold text-sm uppercase tracking-wider px-6 py-3 border-2 border-black inline-flex items-center gap-2">
                    Request a Quote <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </Link>
                <a href="tel:+918660174569">
                  <button className="btn-lift bg-white text-black font-bold text-sm uppercase tracking-wider px-6 py-3 border-2 border-black">
                    Call Sales: +91 86601 74569
                  </button>
                </a>
              </div>
              <div className="flex flex-wrap gap-6 mt-2">
                {[["2-hr", "Emergency SLA"], ["100+", "Units under contract"], ["GST", "Invoicing ready"]].map(([num, label]) => (
                  <div key={label} className="flex flex-col">
                    <span className="font-display text-2xl font-bold text-[#4fc3f7]">{num}</span>
                    <span className="text-xs text-white/50 font-medium">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right image */}
            <div className="relative w-full max-w-xs lg:max-w-sm shrink-0 hidden sm:block ml-auto">
              <div className="relative border-2 border-black bg-white p-3 brutal-shadow rotate-[-3deg] hover:rotate-0 transition-transform">
                <Image
                  src="/b2b-hero-doodle.png"
                  alt="Breezyair commercial doodle"
                  width={350}
                  height={350}
                  className="w-full h-auto"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. WHY BREEZYAIR FOR BUSINESS ─────────────────────── */}
      <section aria-label="Why businesses choose Breezyair" className="border-b-2 border-black bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-14 md:py-20">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#111111] mb-2">Why businesses switch to Breezyair</h2>
            <p className="text-sm text-[#4fc3f7] font-semibold italic">Four reasons ops managers never go back</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Building2, title: "One partner for every unit", body: "No juggling vendors, no communication gaps, no \u2018not our problem\u2019. One number, one technician who knows your site." },
              { icon: FileText, title: "Fixed annual cost, no surprise bills", body: "Everything scheduled. Everything documented. Ad-hoc work quoted before it\u2019s done. Your finance team gets clean GST invoices." },
              { icon: Wrench, title: "Preventive servicing that extends lifespan", body: "Regular maintenance catches failing parts before they fail. Lower breakdown frequency means fewer disruptions to your business." },
              { icon: ShieldCheck, title: "Priority response so you never lose a trading day", body: "Our SLA windows are written into your contract. Care: 48hr. Pro: 12hr. Critical: 2hr. No other vendor in Bengaluru commits to that in writing." },
            ].map((f) => (
              <div key={f.title} className="card-lift bg-white p-6 flex flex-col gap-3">
                <div className="w-10 h-10 border-2 border-black bg-[#ffb74d] flex items-center justify-center shrink-0" aria-hidden="true">
                  <f.icon className="w-5 h-5 text-black" />
                </div>
                <h3 className="text-sm font-bold text-[#111111]">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. SEGMENTS ──────────────────────────────────────── */}
      <section aria-label="Industries we serve" className="border-b-2 border-black bg-[#f5f7fa]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-14 md:py-20">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#111111] mb-2">Built for your business</h2>
            <p className="text-sm text-[#4fc3f7] font-semibold italic">Tailored contracts for every kind of premises</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {segments.map((s) => (
              <article key={s.title} className="card-lift bg-white p-6 flex flex-col gap-3 group">
                <div className="w-11 h-11 bg-[#e8f4fd] border-2 border-black flex items-center justify-center group-hover:bg-[#4fc3f7] transition-colors" aria-hidden="true">
                  <s.icon className="w-5 h-5 text-[#4fc3f7] group-hover:text-black transition-colors" />
                </div>
                <h3 className="text-base font-bold text-[#111111]">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. AC TYPES WE COVER ─────────────────────────────── */}
      <section aria-label="AC types we service" className="border-b-2 border-black bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-14 md:py-20">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#111111] mb-2">We service every type of commercial AC system</h2>
            <p className="text-sm text-gray-500 max-w-2xl mx-auto leading-relaxed">
              From a single wall-mounted split in a small office to a multi-zone VRF network across six floors — we
              have the tools, training, and experience to maintain it on an annual contract. Tap a system type to see what&apos;s included.
            </p>
          </div>

          <AcTypesTabs />

          <p className="text-xs text-gray-400 mt-6 text-center">
            Chillers and central plant systems (20T+) are outside current scope. We refer these to specialist partners and can manage the project on your behalf.
          </p>
        </div>
      </section>

      {/* ── 5. HOW IT WORKS ──────────────────────────────────── */}
      <section aria-label="How it works" className="border-b-2 border-black bg-[#f5f7fa]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-14 md:py-20">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#111111] mb-2">From enquiry to contract in 5 steps</h2>
            <p className="text-sm text-gray-500 max-w-xl mx-auto leading-relaxed">
              No paperwork maze. No back-and-forth. We survey, quote, and onboard fast \u2014 most clients are live within 3 weeks of first contact.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {steps.map((s) => (
              <div key={s.num} className="card-lift bg-white p-5 flex flex-col gap-3">
                <div className="w-10 h-10 bg-[#4fc3f7] border-2 border-black flex items-center justify-center shrink-0 font-display text-lg font-bold text-black">
                  {s.num}
                </div>
                <h3 className="text-sm font-bold text-[#111111]">{s.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. CONTRACT TIERS ────────────────────────────────── */}
      <section aria-label="Contract tiers" className="border-b-2 border-black bg-white">
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-14 md:py-20">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#111111] mb-2">Three contract tiers. One right fit.</h2>
            <p className="text-sm text-gray-500 max-w-xl mx-auto leading-relaxed">
              Pricing is custom after a free site survey \u2014 every site is different. These tiers define what&apos;s included, how often we visit, and how fast we respond.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {tiers.map((t) => (
              <div
                key={t.name}
                className={t.highlight
                  ? "border-2 border-black bg-[#0d47a1] brutal-shadow flex flex-col"
                  : "border-2 border-black bg-white brutal-shadow flex flex-col"}
              >
                {t.highlight && (
                  <div className="py-2 px-4 text-center text-xs font-bold uppercase tracking-wide border-b-2 border-black bg-[#ffb74d] text-black">
                    Most Popular
                  </div>
                )}
                <div className="p-6 flex flex-col gap-4 flex-1">
                  <div>
                    <h3 className={`text-xl font-bold ${t.highlight ? "text-white" : "text-[#111111]"}`}>{t.name}</h3>
                    <p className={`text-xs mt-0.5 ${t.highlight ? "text-white/70" : "text-gray-400"}`}>{t.tagline}</p>
                    <div className={`font-display text-2xl font-bold mt-2 ${t.highlight ? "text-[#4fc3f7]" : "text-[#0d47a1]"}`}>Custom</div>
                  </div>
                  <ul className="flex flex-col gap-2 flex-1">
                    {t.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-[#4fc3f7] shrink-0 mt-0.5" aria-hidden="true" />
                        <span className={t.highlight ? "text-white" : "text-[#111111]"}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="#enquiry">
                    <button className="btn-lift w-full bg-[#4fc3f7] text-black font-bold text-sm uppercase tracking-wider py-3 border-2 border-black">
                      Get a Quote
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. ENQUIRY FORM ──────────────────────────────────── */}
      <section id="enquiry" aria-label="B2B enquiry" className="border-b-2 border-black bg-[#f5f7fa]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-14 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">

            {/* Left copy */}
            <div className="flex flex-col gap-5">
              <h2 className="flex flex-col gap-1">
                <span className="font-sans font-black text-3xl sm:text-4xl text-[#111111] leading-[1.05]">Let&apos;s scope your</span>
                <span className="font-display font-bold text-3xl sm:text-4xl leading-[1.1]">
                  <span style={{ background: "linear-gradient(transparent 50%, #4fc3f7 50%)", paddingBottom: "4px" }}>contract.</span>
                </span>
              </h2>
              <p className="text-sm text-gray-500 leading-relaxed max-w-sm">
                Tell us about your premises and we&apos;ll arrange a free on-site survey. You&apos;ll get a tailored quote within 48 hours \u2014
                no obligation.
              </p>
              <div className="flex flex-col gap-3 mt-1">
                {[
                  { icon: Phone, label: "Sales direct line", value: "+91 8660174569", href: "tel:+918660174569" },
                  { icon: Mail, label: "Business enquiries", value: "hellobreezyair@gmail.com", href: "mailto:hellobreezyair@gmail.com?subject=B2B%20AC%20Contract%20Enquiry" },
                ].map((c) => (
                  <a key={c.label} href={c.href} className="card-lift bg-white flex items-center gap-4 p-4 no-underline group" aria-label={`${c.label}: ${c.value}`}>
                    <div className="w-11 h-11 bg-[#4fc3f7] border-2 border-black flex items-center justify-center shrink-0 group-hover:bg-[#111111] transition-colors" aria-hidden="true">
                      <c.icon className="w-5 h-5 text-black group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{c.label}</p>
                      <p className="text-sm font-bold text-[#111111] mt-0.5 break-all">{c.value}</p>
                    </div>
                  </a>
                ))}
                <div className="bg-white border-2 border-black p-4 flex flex-col gap-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Response time</p>
                  <p className="text-sm font-bold text-[#111111]">Within 2 hours · Mon–Sat 9am–7pm</p>
                </div>
                <OpenChatButton />
              </div>
            </div>

            <div className="w-full max-w-xl mx-auto lg:mx-0 lg:ml-auto">
              <B2bForm />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
