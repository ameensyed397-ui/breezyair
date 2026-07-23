import { CheckCircle2, X, Star, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

export const metadata: Metadata = {
  title: "AC Service Pricing in Bengaluru | Transparent Rates",
  description:
    "Transparent AC service pricing in Bengaluru. Basic service ₹499, full service ₹699, wet deep clean ₹899. AMC plans from ₹1,499/year. No hidden charges — you approve before we start.",
  alternates: { canonical: "https://breezyair.co/pricing" },
  keywords: ["AC service pricing Bengaluru", "AC repair cost Bengaluru", "AC maintenance plans", "Bengaluru HVAC consultant", "HVAC contractor"],
  openGraph: {
    title: "AC Service Pricing in Bengaluru | Breezyair",
    description:
      "Published prices, no surprises. AC repair from ₹499, deep cleaning ₹899, AMC plans from ₹1,499/year across Bengaluru.",
    url: "https://breezyair.co/pricing",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

const services = [
  {
    service: "AC Basic Service", price: "₹499", rival: "₹699–₹799",
    includes: ["Filter clean & coil check", "Performance test", "Cooling output check"],
    extra: ["Capacitor replacement — ₹749", "Fan motor — from ₹1,200"],
  },
  {
    service: "AC Full Service", price: "₹699", rival: "₹899–₹999",
    includes: ["Indoor + outdoor unit service", "Fin straightening & coil wash", "Capacitor health check", "Electrical connection check"],
    extra: ["Gas top-up (if low) — from ₹800", "Capacitor replacement — ₹749", "Drain flush — ₹399"],
  },
  {
    service: "Wet Deep Clean", price: "₹899", rival: "₹1,200–₹1,500",
    includes: ["High-pressure water jet wash", "Anti-bacterial foam treatment", "Drain line flush", "Coil & fin deep clean", "Odor removal"],
    extra: ["Gas top-up (if low) — from ₹800", "Copper pipe (if damaged) — ₹899/m"],
  },
  {
    service: "AC Installation", price: "₹1,499", rival: "₹2,000–₹2,500",
    includes: ["Wall mounting & bracket", "Piping up to 3m", "Wiring & gas charge", "Trial run & handover"],
    extra: ["Extra piping — ₹899/m", "Outdoor mount bracket — from ₹500"],
  },
  {
    service: "AC Uninstallation", price: "₹699", rival: "₹899–₹1,200",
    includes: ["Gas recovery", "Dismount & pack", "Cap & seal outdoor unit"],
    extra: [],
  },
  {
    service: "Inspection Visit", price: "₹350*", rival: "₹399–₹499",
    includes: ["10-minute on-site diagnosis", "Written quote for repair", "*Waived if you approve the work"],
    extra: [],
  },
];

const parts = [
  { name: "Gas top-up — 1 ton", price: "₹800", note: "Partial refill, 3-month guarantee" },
  { name: "Gas top-up — 1.5 ton", price: "₹1,000", note: "Partial refill, 3-month guarantee" },
  { name: "Gas top-up — 2 ton", price: "₹1,200", note: "Partial refill, 3-month guarantee" },
  { name: "Full gas refill — 1–1.5T", price: "₹1,800–₹2,200", note: "Complete system evacuation & recharge" },
  { name: "Full gas refill — 2T+", price: "₹2,500–₹3,000", note: "Complete system evacuation & recharge" },
  { name: "Capacitor replacement", price: "₹749", note: "Run capacitor, fitted & tested" },
  { name: "Copper pipe (per metre)", price: "₹899", note: "Quality copper, properly insulated" },
  { name: "Fan motor — indoor/outdoor", price: "₹1,200–₹2,500", note: "Parts at cost + ₹300 fitting" },
  { name: "PCB / control board", price: "₹1,500–₹4,000", note: "Depends on brand & model" },
  { name: "Drain pipe cleaning", price: "₹399", note: "Unblock and flush drain line" },
  { name: "Emergency surcharge", price: "+₹299", note: "Same-day urgent calls after 2pm" },
];

const bundles = [
  { label: "2 ACs", price: "₹1,299", saving: "Save ₹99", desc: "Basic service for 2 split ACs" },
  { label: "3 ACs", price: "₹1,799", saving: "Save ₹298", desc: "Basic service for 3 split ACs" },
  { label: "4+ ACs", price: "₹449/AC", saving: "Best value", desc: "Basic service per unit, 4 or more" },
];

const amcPlans = [
  {
    name: "Chill Basic", price: "₹1,499", period: "/year", highlight: false, visits: "2 scheduled service visits",
    features: ["Filter clean each visit", "Basic health check", "10% off all repairs", "Priority booking", "WhatsApp updates"],
  },
  {
    name: "Bengaluru Cool", price: "₹2,999", period: "/year", highlight: true, visits: "3 scheduled service visits",
    features: ["Full service each visit", "Gas pressure check", "20% off all repairs", "Priority same-day booking", "WhatsApp direct line", "Reminder service"],
  },
  {
    name: "Villa Plan", price: "₹1,999", period: "/AC/year", highlight: false, visits: "3 visits per AC unit",
    features: ["All ACs covered", "Full service each visit", "20% off all repairs", "Priority booking", "Dedicated technician", "Annual AC health report"],
  },
];

export default function Pricing() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: "AC Services Pricing",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "AC Basic Service" }, price: "499", priceCurrency: "INR" },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "AC Full Service" }, price: "699", priceCurrency: "INR" },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Wet Deep Clean" }, price: "899", priceCurrency: "INR" },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "AC Repair (Diagnostics)" }, price: "499", priceCurrency: "INR" },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "AC Installation" }, price: "1499", priceCurrency: "INR" },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "AC Uninstallation" }, price: "699", priceCurrency: "INR" }
    ]
  };

  return (
    <div className="flex flex-col w-full">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ── HERO ──────────────────────────────────────────── */}
      <section aria-label="Pricing hero" className="max-w-7xl mx-auto px-4 md:px-8 w-full pt-10 md:pt-16 pb-14 text-center">
        <Breadcrumbs items={[{ label: "Pricing" }]} />
        <div className="inline-flex items-center gap-2 px-3 py-1 border-2 border-black bg-[#ffb74d] text-black text-xs font-bold uppercase tracking-wide w-fit mx-auto rotate-[-2deg] brutal-shadow-sm">
          <Star className="w-3.5 h-3.5" aria-hidden="true" />
          Transparent pricing
        </div>
        <h1 className="mt-5 flex flex-col gap-1 items-center">
          <span className="font-sans font-black text-5xl sm:text-6xl md:text-7xl text-[#111111] leading-[1.05]">
            No hidden charges.
          </span>
          <span className="font-display font-bold text-5xl sm:text-6xl md:text-7xl leading-[1.1]">
            <span style={{ background: "linear-gradient(transparent 50%, #4fc3f7 50%)", paddingBottom: "4px" }}>
              Ever.
            </span>
          </span>
        </h1>
        <p className="mt-5 text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
          Every price is published. Asad quotes before he starts. You approve. Simple.
        </p>
      </section>

      {/* ── SERVICE CARDS — INCLUDED / EXTRA ──────────────── */}
      <section aria-label="Base prices with what's included" className="border-t-2 border-black bg-[#f5f7fa]">
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-14 md:py-20">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#111111] mb-2">What you pay. What you get.</h2>
            <p className="text-sm text-[#4fc3f7] font-semibold italic">Each service = base price + any extras you approve.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {services.map((s) => (
              <div key={s.service} className="bg-white border-2 border-black brutal-shadow p-5 flex flex-col gap-4">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-base font-bold text-[#111111]">{s.service}</h3>
                  <div className="flex flex-col items-end shrink-0">
                    <span className="bg-[#4fc3f7] text-black font-bold text-sm border-2 border-black px-3 py-1">{s.price}</span>
                    <span className="text-[10px] text-gray-500 mt-0.5 line-through">{s.rival}</span>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#4fc3f7] mb-2">Included</p>
                  <ul className="space-y-1.5">
                    {s.includes.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-xs text-[#111111]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#4fc3f7] shrink-0" aria-hidden="true" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
                {s.extra.length > 0 && (
                  <div className="border-t border-gray-100 pt-3">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">May also need (if applicable)</p>
                    <ul className="space-y-1">
                      {s.extra.map((item) => (
                        <li key={item} className="flex items-center gap-2 text-xs text-gray-500">
                          <span className="w-1 h-1 bg-gray-300 rounded-full shrink-0" aria-hidden="true" /> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PARTS & ADD-ONS ───────────────────────────────── */}
      <section aria-label="Parts and add-on pricing" className="border-t-2 border-black bg-white">
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-14 md:py-20">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#111111] mb-2">Parts &amp; Add-ons</h2>
            <p className="text-sm text-gray-400 italic">Only charged if needed. Always quoted &amp; approved first.</p>
          </div>
          <div className="border-2 border-black bg-white brutal-shadow overflow-hidden">
            <div className="grid grid-cols-[1fr_auto] sm:grid-cols-[1.2fr_0.6fr_1.2fr] items-center bg-black text-white px-4 py-3 text-xs font-bold uppercase tracking-wider">
              <span>Part / Add-on</span>
              <span className="text-center">Price</span>
              <span className="hidden sm:block">Note</span>
            </div>
            {parts.map((p, i) => (
              <div
                key={p.name}
                className="grid grid-cols-[1fr_auto] sm:grid-cols-[1.2fr_0.6fr_1.2fr] items-center px-4 py-3 text-xs border-t-2 border-black gap-3"
                style={{ background: i % 2 === 0 ? "#ffffff" : "#f5f7fa" }}
              >
                <span className="font-bold text-[#111111]">{p.name}</span>
                <span className="bg-[#0d47a1] text-white font-bold border-2 border-black px-2.5 py-0.5 text-center whitespace-nowrap">{p.price}</span>
                <span className="text-gray-500 hidden sm:block">{p.note}</span>
              </div>
            ))}
            {/* Mobile note row — shows below each item's note on small screens */}
            {parts.map((p, i) => (
              <div
                key={`note-${p.name}`}
                className="sm:hidden px-4 pb-3 text-[10px] text-gray-400 border-t border-gray-100"
                style={{ background: i % 2 === 0 ? "#ffffff" : "#f5f7fa" }}
              >
                {p.note}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MULTI-AC BUNDLES ──────────────────────────────── */}
      <section aria-label="Multi-AC bundles" className="border-t-2 border-black bg-[#f5f7fa]">
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-14 md:py-20">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#111111] mb-2">More ACs. Better deal.</h2>
            <p className="text-sm text-[#4fc3f7] font-semibold italic">Bundle your whole home and save</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {bundles.map((b) => (
              <div key={b.label} className="card-lift bg-white text-center p-6 flex flex-col items-center gap-1">
                <div className="font-display text-4xl font-bold text-[#0d47a1]">{b.label}</div>
                <div className="font-display text-3xl font-bold text-[#4fc3f7]">{b.price}</div>
                <span className="inline-block bg-[#a7ffeb] text-black text-xs font-bold border-2 border-black px-3 py-0.5 my-2">{b.saving}</span>
                <p className="text-sm text-gray-500">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AMC PLANS ─────────────────────────────────────── */}
      <section id="amc" aria-label="Annual maintenance plans" className="border-t-2 border-black bg-white">
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-14 md:py-20">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#111111] mb-2">Annual Maintenance Contracts</h2>
            <p className="text-sm text-gray-400 italic">Pay once. Stay cool. Save money every year.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {amcPlans.map((p) => (
              <div
                key={p.name}
                className={p.highlight
                  ? "border-2 border-black bg-[#0d47a1] brutal-shadow flex flex-col"
                  : "border-2 border-black bg-white brutal-shadow flex flex-col"}
              >
                {p.highlight && (
                  <div className="py-2 px-4 text-center text-xs font-bold uppercase tracking-wide border-b-2 border-black bg-[#ffb74d] text-black">
                    Most Popular in Bengaluru
                  </div>
                )}
                <div className="p-6 flex flex-col gap-4 flex-1">
                  <div>
                    <h3 className={`text-xl font-bold ${p.highlight ? "text-white" : "text-[#111111]"}`}>{p.name}</h3>
                    <div className="flex items-end gap-1 mt-1">
                      <span className={`font-display text-4xl font-bold ${p.highlight ? "text-[#4fc3f7]" : "text-[#0d47a1]"}`}>{p.price}</span>
                      <span className={`text-sm mb-1 ${p.highlight ? "text-white/70" : "text-gray-500"}`}>{p.period}</span>
                    </div>
                    <p className={`text-sm mt-1 ${p.highlight ? "text-white/70" : "text-gray-500"}`}>{p.visits}</p>
                  </div>
                  <ul className="flex flex-col gap-2 flex-1">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className={`w-4 h-4 shrink-0 ${p.highlight ? "text-[#4fc3f7]" : "text-[#4fc3f7]"}`} aria-hidden="true" />
                        <span className={p.highlight ? "text-white" : "text-[#111111]"}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href={`/book?service=amc-${p.name.toLowerCase().replace(/ /g, "-")}`}>
                    <button className="btn-lift w-full bg-[#4fc3f7] text-black font-bold text-sm uppercase tracking-wider py-3 border-2 border-black">
                      Get this plan
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-xs text-gray-400 flex items-center justify-center gap-1.5">
            <X className="w-3.5 h-3.5 text-gray-400" aria-hidden="true" />
            Gas top-ups &amp; major parts billed at cost — always quoted &amp; approved first.
          </p>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section aria-label="Book a service" className="border-t-2 border-black bg-[#4fc3f7]">
        <div className="max-w-3xl mx-auto px-4 md:px-8 py-16 md:py-20 text-center flex flex-col items-center gap-5">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-[#111111]">Ready to book?</h2>
          <p className="text-sm text-black/70 max-w-sm leading-relaxed">
            No contracts, no commitments for one-off jobs. Book in 2 minutes.
          </p>
          <Link href="/book">
            <button className="btn-lift bg-white text-black font-bold text-sm uppercase tracking-wider px-10 py-4 border-2 border-black inline-flex items-center gap-2">
              Book a Service <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </Link>
        </div>
      </section>

    </div>
  );
}
