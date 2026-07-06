import { CheckCircle2, X, Star, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AC Service Pricing in Bengaluru | Transparent Rates",
  description:
    "Transparent AC service pricing in Bengaluru. Basic service ₹499, full service ₹699, wet deep clean ₹899. AMC plans from ₹1,499/year. No hidden charges — you approve before we start.",
  alternates: { canonical: "https://breezyair.co/pricing" },
  openGraph: {
    title: "AC Service Pricing in Bengaluru | Breezyair",
    description:
      "Published prices, no surprises. AC repair from ₹499, deep cleaning ₹899, AMC plans from ₹1,499/year across Bengaluru.",
    url: "https://breezyair.co/pricing",
  },
};

const baseServices = [
  { service: "AC Basic Service", ourPrice: "₹499", rivalPrice: "₹699–₹799", includes: "Filter clean, coil check, performance test" },
  { service: "AC Full Service", ourPrice: "₹699", rivalPrice: "₹899–₹999", includes: "Indoor + outdoor unit, fin clean, capacitor check" },
  { service: "Wet Deep Clean", ourPrice: "₹899", rivalPrice: "₹1,200–₹1,500", includes: "High-pressure wash, anti-bacterial, drain flush" },
  { service: "AC Installation", ourPrice: "₹1,499", rivalPrice: "₹2,000–₹2,500", includes: "Mounting, piping (3m), wiring, gas charge, trial run" },
  { service: "AC Uninstallation", ourPrice: "₹699", rivalPrice: "₹899–₹1,200", includes: "Gas recovery, dismount, cap & seal" },
  { service: "Inspection Visit", ourPrice: "₹350*", rivalPrice: "₹399–₹499", includes: "Fault diagnosis + written quote. *Waived if work done." },
];

const addons = [
  { name: "Gas top-up — 1 ton", price: "₹1,200", desc: "R-32 or R-22 refrigerant" },
  { name: "Gas top-up — 1.5 ton", price: "₹1,500", desc: "R-32 or R-22 refrigerant" },
  { name: "Gas top-up — 2 ton", price: "₹1,800", desc: "R-32 or R-22 refrigerant" },
  { name: "Capacitor replacement", price: "₹749", desc: "Run capacitor, fitted & tested" },
  { name: "Copper pipe (per metre)", price: "₹899", desc: "Quality copper, properly insulated" },
  { name: "Fan motor replacement", price: "₹1,200–₹2,500", desc: "Indoor or outdoor fan motor" },
  { name: "PCB / Control board", price: "₹1,500–₹4,000", desc: "Depends on brand & model" },
  { name: "Drain pipe cleaning", price: "₹399", desc: "Unblock and flush drain line" },
  { name: "Emergency surcharge", price: "+₹299", desc: "For same-day urgent calls" },
];

const bundles = [
  { label: "2 ACs", price: "₹1,299", saving: "Save ₹199", desc: "Basic service for 2 split ACs" },
  { label: "3 ACs", price: "₹1,799", saving: "Save ₹398", desc: "Basic service for 3 split ACs" },
  { label: "4+ ACs", price: "₹449/AC", saving: "Best value", desc: "Basic service per unit, 4 or more ACs" },
];

const amcPlans = [
  {
    name: "Chill Basic",
    price: "₹1,499",
    period: "/year",
    highlight: false,
    visits: "2 scheduled service visits",
    features: ["Filter clean each visit", "Basic health check", "10% off all repairs", "Priority booking", "WhatsApp updates"],
  },
  {
    name: "Bengaluru Cool",
    price: "₹2,999",
    period: "/year",
    highlight: true,
    visits: "3 scheduled service visits",
    features: ["Full service each visit", "Gas pressure check", "20% off all repairs", "Priority same-day booking", "WhatsApp direct line", "Reminder service"],
  },
  {
    name: "Villa Plan",
    price: "₹1,999",
    period: "/AC/year",
    highlight: false,
    visits: "3 visits per AC unit",
    features: ["All ACs covered", "Full service each visit", "20% off all repairs", "Priority booking", "Dedicated technician", "Annual AC health report"],
  },
];

export default function Pricing() {
  return (
    <div className="flex flex-col w-full">

      {/* ── HERO ──────────────────────────────────────────── */}
      <section aria-label="Pricing hero" className="max-w-7xl mx-auto px-4 md:px-8 w-full pt-10 md:pt-16 pb-14 text-center">
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

      {/* ── COMPARISON TABLE ──────────────────────────────── */}
      <section aria-label="Base prices compared" className="border-t-2 border-black bg-[#f5f7fa]">
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-14 md:py-20">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#111111] mb-2">How we compare</h2>
            <p className="text-sm text-[#4fc3f7] font-semibold italic">Same quality. Neighbourhood pricing.</p>
          </div>
          <div className="border-2 border-black bg-white brutal-shadow overflow-x-auto">
            <table className="w-full text-sm min-w-[620px]">
              <thead>
                <tr className="bg-black text-white">
                  <th className="text-left p-4 font-bold">Service</th>
                  <th className="text-center p-4 font-bold text-[#4fc3f7]">Breezyair</th>
                  <th className="text-center p-4 font-bold text-gray-300">Big Platforms</th>
                  <th className="text-left p-4 font-bold">What&apos;s included</th>
                </tr>
              </thead>
              <tbody>
                {baseServices.map((s, i) => (
                  <tr key={s.service} className="border-t-2 border-black" style={{ background: i % 2 === 0 ? "#ffffff" : "#f5f7fa" }}>
                    <td className="p-4 font-bold text-[#111111]">{s.service}</td>
                    <td className="p-4 text-center">
                      <span className="inline-block bg-[#4fc3f7] text-black font-bold border-2 border-black px-3 py-1">{s.ourPrice}</span>
                    </td>
                    <td className="p-4 text-center font-semibold text-gray-400 line-through">{s.rivalPrice}</td>
                    <td className="p-4 text-xs text-gray-500">{s.includes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── ADD-ONS ───────────────────────────────────────── */}
      <section aria-label="Add-ons and parts" className="border-t-2 border-black bg-white">
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-14 md:py-20">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#111111] mb-2">Extra work. Published price.</h2>
            <p className="text-sm text-gray-400 italic">You always approve before we start. No surprises.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {addons.map((a) => (
              <div key={a.name} className="card-lift bg-white p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-sm text-[#111111]">{a.name}</span>
                  <span className="bg-[#0d47a1] text-white text-xs font-bold border-2 border-black px-2 py-0.5 whitespace-nowrap">{a.price}</span>
                </div>
                <p className="text-xs text-gray-500">{a.desc}</p>
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
                    ⭐ Most Popular in Bengaluru
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
            <button className="btn-lift bg-black text-white font-bold text-sm uppercase tracking-wider px-10 py-4 border-2 border-black inline-flex items-center gap-2">
              Book a Service <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </Link>
        </div>
      </section>

    </div>
  );
}
