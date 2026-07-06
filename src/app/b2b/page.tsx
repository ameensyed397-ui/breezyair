import {
  Building2, Store, UtensilsCrossed, Dumbbell, Stethoscope, Server,
  CheckCircle2, Clock, FileText, Wrench, ShieldCheck, Phone, Mail, ArrowRight, Star,
} from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Commercial AC Contracts & B2B AMC in Bengaluru | Breezyair",
  description:
    "Breezyair for business — annual maintenance contracts (AMC), bulk AC servicing, priority SLAs and GST-compliant invoicing for offices, retail, restaurants, clinics & gyms across Bengaluru.",
  alternates: { canonical: "https://breezyair.co/b2b" },
  openGraph: {
    title: "Commercial AC Contracts & B2B AMC | Breezyair Bengaluru",
    description:
      "Priority SLAs, dedicated technicians, quarterly servicing and GST invoicing for Bengaluru businesses. Get a custom commercial AC contract quote.",
    url: "https://breezyair.co/b2b",
  },
};

const segments = [
  { icon: Building2, title: "Offices & Co-working", desc: "Keep teams productive with zero-downtime cooling across floors." },
  { icon: Store, title: "Retail & Showrooms", desc: "Consistent comfort that keeps customers browsing longer." },
  { icon: UtensilsCrossed, title: "Restaurants & Cafés", desc: "Kitchen-grade cooling and dining-area comfort, maintained." },
  { icon: Stethoscope, title: "Clinics & Labs", desc: "Precise, hygienic climate control for sensitive environments." },
  { icon: Dumbbell, title: "Gyms & Studios", desc: "High-load ventilation and cooling that keeps up with the burn." },
  { icon: Server, title: "Server & IT Rooms", desc: "24/7 monitored cooling to protect critical infrastructure." },
];

const included = [
  { icon: Clock, title: "Priority SLA response", desc: "Guaranteed callout windows — as fast as 2 hours for contract clients." },
  { icon: Wrench, title: "Scheduled servicing", desc: "Quarterly or monthly preventive maintenance across every unit." },
  { icon: ShieldCheck, title: "Dedicated technician", desc: "One accountable engineer who knows your site and your units." },
  { icon: FileText, title: "GST-compliant invoicing", desc: "Clean monthly or annual billing with full service reports." },
];

const tiers = [
  {
    name: "Care",
    price: "Custom",
    tagline: "Small offices & retail",
    highlight: false,
    features: ["Quarterly preventive servicing", "48-hr priority response", "10% off ad-hoc repairs", "Digital service log", "Single point of contact"],
  },
  {
    name: "Pro",
    price: "Custom",
    tagline: "Multi-unit & restaurants",
    highlight: true,
    features: ["Monthly preventive servicing", "12-hr priority response", "20% off ad-hoc repairs", "Dedicated technician", "Quarterly health reports", "GST invoicing & AMC docs"],
  },
  {
    name: "Critical",
    price: "Custom",
    tagline: "Clinics, labs & server rooms",
    highlight: false,
    features: ["Fortnightly + on-call servicing", "2-hr emergency SLA", "25% off ad-hoc repairs", "24/7 escalation line", "Compliance-ready reporting", "Standby unit planning"],
  },
];

export default function B2B() {
  return (
    <div className="flex flex-col w-full">

      {/* ── HERO ──────────────────────────────────────────── */}
      <section aria-label="B2B hero" className="max-w-7xl mx-auto px-4 md:px-8 w-full pt-10 md:pt-16 pb-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="flex flex-col gap-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 border-2 border-black bg-[#ffb74d] text-black text-xs font-bold uppercase tracking-wide w-fit rotate-[-2deg] brutal-shadow-sm">
              <Star className="w-3.5 h-3.5" aria-hidden="true" />
              For Business
            </div>
            <h1 className="flex flex-col gap-1">
              <span className="font-sans font-black text-4xl sm:text-5xl md:text-6xl text-[#111111] leading-[1.05]">Commercial cooling,</span>
              <span className="font-display font-bold text-4xl sm:text-5xl md:text-6xl leading-[1.1]">
                <span style={{ background: "linear-gradient(transparent 50%, #4fc3f7 50%)", paddingBottom: "4px" }}>on contract.</span>
              </span>
              <span className="font-sans font-black text-2xl sm:text-3xl md:text-4xl text-gray-400 leading-[1.1]">zero downtime.</span>
            </h1>
            <p className="text-sm text-gray-500 leading-relaxed max-w-md">
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
                  Call Sales
                </button>
              </a>
            </div>
            <div className="flex flex-wrap gap-6 mt-2">
              {[["2-hr", "Emergency SLA"], ["100+", "Units under contract"], ["GST", "Invoicing ready"]].map(([num, label]) => (
                <div key={label} className="flex flex-col">
                  <span className="font-display text-2xl font-bold text-[#111111]">{num}</span>
                  <span className="text-xs text-gray-400 font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Highlight card */}
          <div className="w-full max-w-md mx-auto lg:mx-0 lg:ml-auto">
            <div className="border-2 border-black bg-[#0d47a1] brutal-shadow p-7 flex flex-col gap-4 text-white">
              <h2 className="font-display text-2xl font-bold text-white">Why businesses switch to Breezyair</h2>
              <ul className="flex flex-col gap-3">
                {[
                  "One partner for every unit — no juggling vendors",
                  "Fixed annual cost, no surprise breakdown bills",
                  "Preventive servicing that extends AC lifespan",
                  "Priority response so you never lose a trading day",
                ].map((point) => (
                  <li key={point} className="flex items-start gap-2.5 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-[#4fc3f7] shrink-0 mt-0.5" aria-hidden="true" />
                    <span className="text-white/90">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── SEGMENTS ──────────────────────────────────────── */}
      <section aria-label="Industries we serve" className="border-t-2 border-black bg-white">
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
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT'S INCLUDED ───────────────────────────────── */}
      <section aria-label="What every contract includes" className="border-t-2 border-black bg-[#f5f7fa]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-14 md:py-20">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#111111] mb-2">Every contract includes</h2>
            <p className="text-sm text-gray-400 italic">The essentials — before we even tailor the details to your site</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {included.map((f) => (
              <div key={f.title} className="card-lift bg-white p-6 flex flex-col gap-3">
                <div className="w-10 h-10 border-2 border-black bg-[#ffb74d] flex items-center justify-center shrink-0" aria-hidden="true">
                  <f.icon className="w-5 h-5 text-black" />
                </div>
                <h3 className="text-sm font-bold text-[#111111]">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTRACT TIERS ────────────────────────────────── */}
      <section aria-label="Contract tiers" className="border-t-2 border-black bg-white">
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-14 md:py-20">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#111111] mb-2">Contract tiers</h2>
            <p className="text-sm text-[#4fc3f7] font-semibold italic">Priced per site after a free survey — no cookie-cutter quotes</p>
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
                    ⭐ Most Popular
                  </div>
                )}
                <div className="p-6 flex flex-col gap-4 flex-1">
                  <div>
                    <h3 className={`text-xl font-bold ${t.highlight ? "text-white" : "text-[#111111]"}`}>{t.name}</h3>
                    <p className={`text-xs mt-0.5 ${t.highlight ? "text-white/70" : "text-gray-400"}`}>{t.tagline}</p>
                    <div className={`font-display text-3xl font-bold mt-2 ${t.highlight ? "text-[#4fc3f7]" : "text-[#0d47a1]"}`}>{t.price}</div>
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

      {/* ── ENQUIRY FORM ──────────────────────────────────── */}
      <section id="enquiry" aria-label="B2B enquiry" className="border-t-2 border-black bg-[#f5f7fa]">
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
                Tell us about your premises and we&apos;ll arrange a free on-site survey. You&apos;ll get a tailored quote within 48 hours —
                no obligation.
              </p>
              <div className="flex flex-col gap-3 mt-1">
                {[
                  { icon: Phone, label: "Sales direct line", value: "+91 8660174569", href: "tel:+918660174569" },
                  { icon: Mail, label: "Business enquiries", value: "asadkhanassu000@gmail.com", href: "mailto:asadkhanassu000@gmail.com?subject=B2B%20AC%20Contract%20Enquiry" },
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
              </div>
            </div>

            {/* Form */}
            <div className="border-2 border-black bg-white brutal-shadow">
              <div className="border-b-2 border-black p-5 bg-[#e8f4fd]">
                <h3 className="font-display text-2xl italic text-[#4fc3f7] font-bold leading-tight">Request a commercial quote</h3>
                <p className="text-xs text-gray-400 mt-0.5">We reply to business enquiries within one working day.</p>
              </div>
              <form className="p-5 md:p-7 flex flex-col gap-4" aria-label="B2B contract enquiry form">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="b2b-company" className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Business Name</label>
                    <input id="b2b-company" className="h-11 w-full border-2 border-black bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4fc3f7]" placeholder="e.g. Cafe Coffee Day, Indiranagar" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="b2b-person" className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Contact Person</label>
                    <input id="b2b-person" className="h-11 w-full border-2 border-black bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4fc3f7]" placeholder="Your name" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="b2b-phone" className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Phone</label>
                    <input id="b2b-phone" type="tel" className="h-11 w-full border-2 border-black bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4fc3f7]" placeholder="+91 00000 00000" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="b2b-email" className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Work Email</label>
                    <input id="b2b-email" type="email" className="h-11 w-full border-2 border-black bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4fc3f7]" placeholder="you@business.com" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="b2b-type" className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Business Type</label>
                    <select id="b2b-type" className="h-11 w-full border-2 border-black bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4fc3f7]">
                      <option>Office / Co-working</option>
                      <option>Retail / Showroom</option>
                      <option>Restaurant / Café</option>
                      <option>Clinic / Lab</option>
                      <option>Gym / Studio</option>
                      <option>Server / IT Room</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="b2b-units" className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Number of AC Units</label>
                    <select id="b2b-units" className="h-11 w-full border-2 border-black bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4fc3f7]">
                      <option>1–5 units</option>
                      <option>6–15 units</option>
                      <option>16–30 units</option>
                      <option>30+ units</option>
                    </select>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="b2b-message" className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Tell us about your requirement</label>
                  <textarea id="b2b-message" className="w-full border-2 border-black bg-white px-3 py-2.5 text-sm min-h-[100px] resize-none focus:outline-none focus:ring-2 focus:ring-[#4fc3f7]" placeholder="Locations, current pain points, preferred service frequency..." />
                </div>
                <button type="submit" className="btn-lift w-full bg-[#4fc3f7] text-black font-bold text-sm uppercase tracking-wider py-4 border-2 border-black mt-1">
                  REQUEST QUOTE
                </button>
                <p className="text-center font-display italic text-xs text-gray-400 mt-1">Free on-site survey · Tailored quote in 48 hours</p>
              </form>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
