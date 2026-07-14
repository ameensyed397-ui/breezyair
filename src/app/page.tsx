import { CheckCircle2, Zap, Wind, Wrench, Droplet, ShieldCheck, Star, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { PriceEstimator } from "@/components/ui/price-estimator";
import { AnimateIn } from "@/components/ui/animate-in";

export const metadata: Metadata = {
  title: "AC Repair & HVAC Service in Bengaluru | Breezyair",
  description:
    "Bengaluru's most trusted AC repair, maintenance & installation service. Certified technicians in Indiranagar, Koramangala & Whitefield. Same-day service from ₹499. Book now.",
  alternates: { canonical: "https://breezyair.co" },
  openGraph: {
    title: "AC Repair & HVAC Service in Bengaluru | Breezyair",
    description: "Same-day AC repair, deep cleaning & maintenance across Bengaluru by certified experts. Starts at ₹499.",
    url: "https://breezyair.co",
  },
};

export default function Home() {
  return (
    <div className="flex flex-col w-full">

      {/* ── HERO ────────────────────────────────────────────── */}
      <section aria-label="Hero — AC Service Bengaluru" className="max-w-7xl mx-auto px-4 md:px-8 w-full pt-10 md:pt-20 pb-16">
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-12">

          {/* Text */}
          <div className="flex-1 flex flex-col gap-5 w-full">
            {/* Badge — Inter bold */}
            <AnimateIn animation="slide-in-right">
              <div className="inline-flex items-center gap-2 px-3 py-1 border-2 border-black bg-[#ffb74d] text-black text-xs font-bold uppercase tracking-wide w-fit rotate-[-2deg] brutal-shadow-sm">
                <Star className="w-3.5 h-3.5" aria-hidden="true" />
                Bengaluru&apos;s top rated HVAC
              </div>
            </AnimateIn>

            {/* H1 — Inter 900 + Caveat combo with highlighter */}
            <h1 className="flex flex-col gap-1">
              {/* Line 1: Inter bold */}
              <span className="font-sans font-black text-5xl sm:text-6xl md:text-7xl text-[#111111] leading-[1.05]">
                Your AC fixed,
              </span>
              {/* Line 2: Caveat with sky-blue highlighter */}
              <span className="font-display font-bold text-5xl sm:text-6xl md:text-7xl leading-[1.1]">
                <span
                  className="text-[#111111]"
                  style={{ background: "linear-gradient(transparent 50%, #4fc3f7 50%)", paddingBottom: "4px" }}
                >
                  same day.
                </span>
              </span>
              {/* Line 3: Inter bold, muted */}
              <span className="font-sans font-black text-3xl sm:text-4xl md:text-5xl text-gray-400 leading-[1.1]">
                guaranteed.
              </span>
            </h1>

            <p className="text-sm text-gray-500 max-w-md leading-relaxed">
              Smart AC repair, deep cleaning, maintenance &amp; installations by Bengaluru&apos;s most trusted
              neighborhood technicians. No hidden costs. No mess. Just cool air.
            </p>

            {/* Quick booking widget */}
            <form action="/book" method="GET" className="border-2 border-black bg-white p-4 flex flex-col sm:flex-row gap-3 w-full max-w-xl brutal-shadow mt-2">
              <div className="flex-1 flex flex-col gap-1.5">
                <label htmlFor="service-select" className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Service Needed</label>
                <select name="service" id="service-select" className="h-11 w-full border-2 border-black bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4fc3f7]">
                  <option value="basic-service">AC Basic Service — ₹499</option>
                  <option value="full-service">AC Full Service — ₹699</option>
                  <option value="wet-clean">Wet Deep Clean — ₹899</option>
                  <option value="installation">AC Installation — ₹1,499</option>
                  <option value="uninstallation">AC Uninstallation — ₹699</option>
                  <option value="inspection">Inspection Visit — ₹350</option>
                  <option value="amc-chill-basic">AMC Chill Basic — ₹1,499/yr</option>
                  <option value="amc-bengaluru-cool">AMC Bengaluru Cool — ₹2,999/yr</option>
                  <option value="amc-villa-plan">AMC Villa Plan — ₹1,999/AC/yr</option>
                </select>
              </div>
              <div className="flex-1 flex flex-col gap-1.5">
                <label htmlFor="locality-select" className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Your Area</label>
                <select name="locality" id="locality-select" className="h-11 w-full border-2 border-black bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4fc3f7]">
                  <option value="indiranagar">Indiranagar</option>
                  <option value="koramangala">Koramangala</option>
                  <option value="whitefield">Whitefield</option>
                  <option value="hsr-layout">HSR Layout</option>
                  <option value="bellandur">Bellandur</option>
                  <option value="marathahalli">Marathahalli</option>
                </select>
              </div>
              <div className="flex items-end w-full sm:w-auto">
                <button type="submit" className="btn-lift h-11 w-full sm:w-auto px-5 bg-[#4fc3f7] text-black font-bold text-sm uppercase tracking-wide border-2 border-black whitespace-nowrap">
                  Book Now
                </button>
              </div>
            </form>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-4 mt-1">
              {["500+ Happy Homes", "Same Asad Every Time", "Visiting Charge Waived", "No Hidden Costs"].map((t) => (
                <div key={t} className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#4fc3f7] shrink-0" aria-hidden="true" />
                  {t}
                </div>
              ))}
            </div>
          </div>

          {/* Mascot */}
          <div className="flex-1 flex justify-center items-center w-full max-w-[260px] md:max-w-[400px] mx-auto md:mx-0">
            <div className="relative w-full aspect-square">
              <Image
                src="/hero-mascot.png"
                alt="Breezyair friendly indoor AC mascot waving"
                fill
                className="object-contain"
                priority
              />
              <div className="absolute bottom-4 right-0 rotate-[-4deg] bg-white border-2 border-black brutal-shadow-sm px-3 py-1.5 font-display italic text-base text-[#111111] z-10">
                &quot;Let&apos;s get chillin, Bengaluru!&quot;
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICE CARDS ───────────────────────────────────── */}
      <section aria-label="Our AC Services" className="border-t-2 border-black bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-14 md:py-20">
          <AnimateIn>
            <div className="text-center mb-10">
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#111111] mb-2">Our Chill Services</h2>
              <p className="text-sm text-[#4fc3f7] font-semibold italic">Cooling Bengaluru since 2012</p>
            </div>
          </AnimateIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: Droplet, title: "Wet Deep Clean", desc: "Breathe easy. We remove mold, dust and grime — your AC comes out feeling brand new.", price: "Starts at ₹899", href: "/services" },
              { icon: Wrench,  title: "AC Repair",      desc: "Weird noise? Warm air? We diagnose and fix all AC issues fast, the same day.",        price: "Starts at ₹499", href: "/services" },
              { icon: Zap,     title: "AC Installation", desc: "Upgrading? We install new split or window ACs with precision and a full handover.",    price: "Flat ₹1,499",   href: "/services" },
            ].map((s, i) => (
              <AnimateIn key={i} delay={i * 0.1}>
                <article className="card-lift bg-white flex flex-col h-full">
                <div className="p-5 pb-0">
                  <div className="w-10 h-10 bg-[#e8f4fd] border-2 border-black flex items-center justify-center mb-3" aria-hidden="true">
                    <s.icon className="w-5 h-5 text-[#4fc3f7]" />
                  </div>
                  <h3 className="text-base font-bold text-[#111111] font-sans">{s.title}</h3>
                </div>
                <div className="p-5 flex flex-col gap-3 flex-1">
                  <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                  <Link href={s.href} className="text-[#4fc3f7] text-sm font-bold flex items-center gap-1 hover:underline mt-auto">
                    {s.price} <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </article>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST BAND ──────────────────────────────────────── */}
      <section aria-label="Why choose Breezyair" className="border-t-2 border-black bg-[#4fc3f7]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-14 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            {/* Main */}
            <div className="md:col-span-2 bg-white border-2 border-black brutal-shadow p-7 md:p-8">
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#111111] mb-3">Built on Neighborly Trust.</h2>
              <p className="text-sm text-gray-500 mb-7 leading-relaxed">
                Transparent pricing, certified experts, zero mess. We quote before we start — you approve every rupee. Same technician, Asad, every time.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {[
                  { icon: ShieldCheck,  title: "Quote Before Work",  desc: "You approve every rupee" },
                  { icon: CheckCircle2, title: "Same Tech Every Time",  desc: "Asad shows up, not a stranger" },
                  { icon: Wind,         title: "Visiting Charge Waived",  desc: "If you say yes to the work" },
                ].map((t, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="w-9 h-9 bg-[#4fc3f7] border-2 border-black flex items-center justify-center shrink-0" aria-hidden="true">
                      <t.icon className="w-4 h-4 text-black" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#111111]">{t.title}</h3>
                      <p className="text-xs text-gray-400 mt-0.5">{t.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="bg-[#ffb74d] border-2 border-black brutal-shadow p-7 flex flex-col items-center justify-center text-center">
              <Star className="w-14 h-14 text-black mb-3" aria-hidden="true" />
              <span className="font-display text-6xl font-bold text-black" aria-label="500 plus homes cooled">500+</span>
              <p className="text-xs font-bold uppercase tracking-widest mt-2 text-black">Homes Cooled</p>
            </div>
          </div>

          {/* Testimonials */}
          <div className="mt-10">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-black mb-6 text-center">Happy Cooling Stories</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { name: "Suresh P.", loc: "Indiranagar", quote: "They came within an hour and fixed my AC right up. Highly recommend!" },
                { name: "Priya M.",  loc: "Whitefield",  quote: "Very professional, left no mess. Pricing was transparent — no surprises." },
                { name: "Rahul D.", loc: "Koramangala", quote: "Deep cleaning actually made my 5-year-old AC feel brand new. Worth every rupee." },
              ].map((t, i) => (
                <article key={i} className="card-lift bg-white p-5 flex flex-col gap-4">
                  <blockquote className="text-sm italic text-gray-600 leading-relaxed">&quot;{t.quote}&quot;</blockquote>
                  <footer className="flex items-center gap-3 mt-auto">
                    <div className="w-9 h-9 bg-[#e8f4fd] border-2 border-black flex items-center justify-center font-bold text-sm text-[#0d47a1] shrink-0" aria-hidden="true">
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#111111]">{t.name}</p>
                      <p className="text-xs text-gray-400">{t.loc}</p>
                    </div>
                  </footer>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS — TRANSPARENT BILLING ──────────────── */}
      <section aria-label="How Breezyair works" className="border-t-2 border-black bg-white">
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-14 md:py-20">
          <AnimateIn>
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#111111] mb-2">Transparent Billing — 5 Steps</h2>
              <p className="text-sm text-gray-500 italic">You always know what you&apos;re paying. No surprises.</p>
            </div>
          </AnimateIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
            {[
              { step: "1", title: "Fixed Base Price",    desc: "What you booked. Locked." },
              { step: "2", title: "Free Diagnosis",      desc: "10-min check, full quote" },
              { step: "3", title: "You Approve",         desc: "No extras without your OK" },
              { step: "4", title: "Published Add-ons",   desc: "Fixed prices, no surprises" },
              { step: "5", title: "WhatsApp Invoice",    desc: "Itemised, saved to your phone" },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center gap-3 h-full">
                <div className="w-12 h-12 shrink-0 bg-[#4fc3f7] border-2 border-black rounded-full flex items-center justify-center font-display font-bold text-xl text-black brutal-shadow-sm" aria-hidden="true">
                  {s.step}
                </div>
                <div className="flex flex-col items-center justify-center text-center border-2 border-black px-3 py-3 bg-white brutal-shadow-sm w-full flex-1">
                  <p className="text-sm font-bold text-[#111111]">{s.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICE ESTIMATOR ──────────────────────────────── */}
      <section aria-label="Price estimator" className="border-t-2 border-black bg-[#f5f7fa]">
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-14 md:py-20">
          <AnimateIn>
            <div className="text-center mb-8">
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#111111] mb-2">What will it cost?</h2>
              <p className="text-sm text-gray-500 max-w-lg mx-auto">
                Use the estimator below for an instant ballpark. Every price is transparent — Asad confirms the final quote on-site before starting.
              </p>
            </div>
          </AnimateIn>
          <AnimateIn animation="pop-in" delay={0.15}>
            <PriceEstimator />
          </AnimateIn>
        </div>
      </section>

    </div>
  );
}
