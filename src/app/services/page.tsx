import { CheckCircle2, Droplet, Wrench, Zap, Settings2, ThermometerSun, Shield, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

export const metadata: Metadata = {
  title: "AC Repair, Cleaning & Installation Services in Bengaluru",
  description:
    "Breezyair offers expert AC repair (₹499), deep cleaning (₹899), maintenance plans & new installations across Indiranagar, Koramangala & Whitefield. Same-day certified service.",
  alternates: { canonical: "https://breezyair.co/services" },
  openGraph: {
    title: "AC Repair, Cleaning & Installation Services | Breezyair Bengaluru",
    description: "Expert AC repair from ₹499. Deep cleaning, maintenance plans & installations by certified HVAC technicians across Bengaluru.",
    url: "https://breezyair.co/services",
  },
};

/* Team data */
const TEAM = [
  { initials: "AK", name: "Asad Khan",    role: "Lead Technician",   color: "#4fc3f7", text: "#111111" },
  { initials: "RS", name: "Ravi S.",       role: "Senior Tech",       color: "#ffb74d", text: "#111111" },
  { initials: "MK", name: "Mohan K.",      role: "HVAC Specialist",   color: "#a7ffeb", text: "#111111" },
  { initials: "SP", name: "Suresh P.",     role: "Repair Expert",     color: "#4fc3f7", text: "#111111" },
  { initials: "DR", name: "Dinesh R.",     role: "Installations",     color: "#ffb74d", text: "#111111" },
  { initials: "KM", name: "Kiran M.",      role: "AC Specialist",     color: "#a7ffeb", text: "#111111" },
  { initials: "PJ", name: "Pradeep J.",    role: "AC Cleaning",       color: "#4fc3f7", text: "#111111" },
  { initials: "HV", name: "Harish V.",     role: "Field Tech",        color: "#ffb74d", text: "#111111" },
];

export default function Services() {
  return (
    <div className="flex flex-col w-full">

      {/* ── HERO ──────────────────────────────────────────── */}
      <section aria-label="Services hero" className="max-w-7xl mx-auto px-4 md:px-8 w-full pt-10 md:pt-16 pb-16">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">

          {/* Text left */}
          <div className="flex-1 flex flex-col gap-5 w-full">
            <Breadcrumbs items={[{ label: "Services" }]} />
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#4fc3f7]">Certified HVAC Experts</p>

            {/* H1 — Inter 900 + Caveat highlighter combo */}
            <h1 className="flex flex-col gap-1">
              <span className="font-sans font-black text-5xl sm:text-6xl md:text-7xl text-[#111111] leading-[1.05]">
                All your AC needs,
              </span>
              <span className="font-display font-bold text-5xl sm:text-6xl md:text-7xl leading-[1.1]">
                <span
                  style={{ background: "linear-gradient(transparent 50%, #4fc3f7 50%)", paddingBottom: "4px" }}
                >
                  sorted in one visit.
                </span>
              </span>
            </h1>

            <p className="text-sm text-gray-500 max-w-md leading-relaxed">
              Whether it&apos;s an emergency repair, annual maintenance, or a brand-new installation —
              Breezyair handles it all in a single trip. Licensed, insured, and always on time.
            </p>

            <div className="flex flex-wrap gap-3 mt-2">
              <Link href="/book">
                <button className="btn-lift bg-[#4fc3f7] text-black font-bold text-sm uppercase tracking-wider px-6 py-3 border-2 border-black">
                  Book a Service
                </button>
              </Link>
              <Link href="/pricing">
                <button className="btn-lift bg-white text-black font-bold text-sm uppercase tracking-wider px-6 py-3 border-2 border-black">
                  View Pricing
                </button>
              </Link>
            </div>

            {/* Quick stats */}
            <div className="flex flex-wrap gap-5 mt-2">
              {[["15+", "Years in HVAC"], ["Same-day", "Service"], ["30-min", "Callback"]].map(([num, label]) => (
                <div key={label} className="flex flex-col">
                  <span className="font-display text-2xl font-bold text-[#111111]">{num}</span>
                  <span className="text-xs text-gray-400 font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Outdoor AC mascot */}
          <div className="flex-1 flex justify-center items-center w-full max-w-xs md:max-w-sm mx-auto md:mx-0">
            <div className="relative w-full aspect-square">
              <Image
                src="/mascot-outdoor.png"
                alt="Breezyair outdoor AC unit mascot — Expert Help for Bengaluru homes"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── ASAD KHAN — LEAD TECHNICIAN ───────────────────── */}
      <section aria-label="About our lead technician" className="border-t-2 border-black bg-[#f5f7fa]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-14 md:py-20">
          <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-center">

            {/* Photo */}
            <div className="w-full max-w-xs md:w-72 mx-auto md:mx-0 shrink-0">
              <div className="relative w-full">
                <div className="absolute top-4 -right-4 w-full h-full bg-[#4fc3f7] border-2 border-black z-0" />
                <div className="border-2 border-black w-full aspect-[4/5] relative z-10 overflow-hidden">
                  <Image
                    src="/asad-khan.jpg"
                    alt="Asad Khan — Breezyair Lead HVAC Technician in Bengaluru"
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 768px) 100vw, 288px"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-white border-t-2 border-black p-3 text-center">
                    <p className="text-sm font-bold text-[#111111]">Asad Khan</p>
                    <p className="text-xs text-gray-400">Lead Technician · 15+ yrs</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Text */}
            <div className="flex-1 flex flex-col gap-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#4fc3f7]">Master Technician</p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#111111] leading-tight">
                Expert hands you can count on.
              </h2>
              <p className="text-sm text-gray-500 italic border-l-4 border-[#4fc3f7] pl-4 leading-relaxed">
                &quot;I treat every home like it&apos;s my own. When your AC breaks, it&apos;s not just a technical
                problem — it&apos;s a comfort emergency. My goal is to get your family back to cool as fast as possible.&quot;
              </p>
              <ul className="flex flex-col gap-2.5 mt-1">
                {[
                  "15+ Years of HVAC Industry Experience",
                  "Industry-Certified Professional",
                  "Background-Verified & Insured",
                  "Local Community Service Award Winner",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm font-semibold text-[#111111]">
                    <CheckCircle2 className="w-4 h-4 text-[#4fc3f7] shrink-0" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES GRID ─────────────────────────────────── */}
      <section aria-label="All AC services" className="border-t-2 border-black bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-14 md:py-20">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#111111] mb-2">Everything You Need</h2>
            <p className="text-sm text-[#4fc3f7] font-semibold italic">From quick fixes to full installations — all under one roof</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: Settings2, title: "AC Repair", available: true,
                desc: "Strange noises? Warm air? We diagnose and fix all AC issues fast — same day guaranteed.",
                included: ["Fault diagnosis & written quote", "Common parts (fan motor, capacitor, etc.)", "Performance test after fix"],
              },
              {
                icon: Wrench, title: "Maintenance Plans", available: false,
                desc: "Prevent costly breakdowns before they happen. Regular servicing doubles your AC lifespan.",
                included: ["Seasonal tune-ups", "Filter replacement", "Full performance check"],
              },
              {
                icon: ThermometerSun, title: "New Installations", available: false,
                desc: "Upgrading to a 5-star energy efficient system? We design, supply and install with precision.",
                included: ["Mounting & wall bracket", "Piping (3m included)", "Wiring & gas charge", "Trial run & handover"],
              },
              {
                icon: Droplet, title: "Deep AC Cleaning", available: true,
                desc: "Foam wash, high-pressure jet, full inside-out clean. Removes mold, bacteria and grime.",
                included: ["High-pressure water jet", "Anti-bacterial foam treatment", "Drain line flush", "Coil & fin deep clean"],
              },
              {
                icon: Wrench, title: "Emergency Repair", available: true,
                desc: "AC dead on a hot night? Same-day response within 1 hour across Bengaluru.",
                included: ["Same-day response (within 1hr)", "Fault diagnosis on-site", "Common fixes same visit"],
              },
              {
                icon: Zap, title: "Gas Top-up & Refill", available: false,
                desc: "R-32 or R-22 refrigerant. Partial top-up or full refill depending on your AC's needs.",
                included: ["Gas pressure check", "Leak detection", "Partial or full refill"],
              },
              {
                icon: Settings2, title: "PCB & Board Repair", available: false,
                desc: "Diagnosis and repair of control boards and PCBs. Free diagnosis, quote before repair.",
                included: ["Free PCB diagnosis", "Detailed repair quote", "Fitting & testing"],
              },
              {
                icon: Wrench, title: "Fan Motor & Parts", available: false,
                desc: "Indoor or outdoor fan motor replacement. Parts at cost, fitting included.",
                included: ["Motor diagnosis", "Parts at cost price", "Fitting included (₹300)"],
              },
              {
                icon: Droplet, title: "Drain Pipe Unblocking", available: false,
                desc: "Standard drain line blockage clearance. Quick fix, no mess.",
                included: ["Blockage diagnosis", "Drain line flush", "Flow test"],
              },
            ].map((s, i) => (
              <article key={i} className="card-lift bg-white flex flex-col group relative">
                {s.available && (
                  <div className="absolute top-3 right-3 bg-[#4fc3f7] text-black text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 border border-black z-10">
                    Available Today
                  </div>
                )}
                <div className="p-5 pb-0">
                  <div className="w-10 h-10 bg-[#e8f4fd] border-2 border-black flex items-center justify-center mb-3 group-hover:bg-[#4fc3f7] transition-colors" aria-hidden="true">
                    <s.icon className="w-5 h-5 text-[#4fc3f7] group-hover:text-black transition-colors" />
                  </div>
                  <h3 className="text-base font-bold text-[#111111] font-sans">{s.title}</h3>
                </div>
                <div className="p-5 flex flex-col gap-3 flex-1">
                  <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#4fc3f7] mb-2">What&apos;s included</p>
                    <ul className="space-y-1.5">
                      {s.included.map((item) => (
                        <li key={item} className="flex items-center gap-2 text-xs font-semibold text-[#111111]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#4fc3f7] shrink-0" aria-hidden="true" /> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-auto pt-3">
                    <Link href="/book">
                      <button className="btn-lift w-full bg-[#4fc3f7] text-black font-bold text-xs uppercase tracking-wider py-3 border-2 border-black">
                        Book Now
                      </button>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY TRUST US ──────────────────────────────────── */}
      <section aria-label="Why choose Breezyair" className="border-t-2 border-black bg-[#f5f7fa]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-14 md:py-20">
          <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-center">

            {/* Shield visual */}
            <div className="w-full max-w-xs md:w-72 mx-auto md:mx-0 shrink-0">
              <div className="relative w-full">
                <div className="absolute top-4 -left-4 w-full h-full bg-[#ffb74d] border-2 border-black z-0" />
                <div className="border-2 border-black bg-white w-full aspect-square relative z-10 flex flex-col items-center justify-center p-8 text-center">
                  <Shield className="w-20 h-20 text-[#4fc3f7] mb-4" aria-hidden="true" />
                  <h3 className="font-display text-2xl font-bold text-[#111111]">Licensed &amp; Insured</h3>
                  <p className="text-xs text-gray-400 mt-1">Your home is safe with us</p>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="flex-1 flex flex-col gap-6">
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#111111]">
                Why neighbors trust the Breeze.
              </h2>
              <div className="flex flex-col gap-5">
                {[
                  { icon: Settings2, title: "Transparent Pricing",  desc: "We quote before we touch anything. No surprises, no upsells — just honest pricing." },
                  { icon: Shield,    title: "Licensed Experts",     desc: "Every Breezyair technician is industry-certified and fully insured for your peace of mind." },
                  { icon: Clock,     title: "Same-Day Turnaround",  desc: "We know Bengaluru heat doesn&apos;t wait. Most AC repairs are completed within 24 hours." },
                ].map((f, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-10 h-10 border-2 border-black bg-[#e8f4fd] flex items-center justify-center shrink-0" aria-hidden="true">
                      <f.icon className="w-5 h-5 text-[#4fc3f7]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#111111]">{f.title}</h3>
                      <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TEAM GRID ─────────────────────────────────────── */}
      <section aria-label="Our expert technicians" className="border-t-2 border-black bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-14 md:py-20">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#111111] mb-2">Our Experts on Field</h2>
            <p className="text-sm text-gray-400 italic max-w-lg mx-auto leading-relaxed">
              A passionate team of certified HVAC professionals — ready to restore your comfort across Bengaluru.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {TEAM.map((t, i) => (
              <article
                key={i}
                className="card-lift flex flex-col items-center justify-center p-5 gap-3 group cursor-pointer"
                style={{ backgroundColor: `${t.color}20` }}
              >
                <div
                  className="w-16 h-16 border-2 border-black flex items-center justify-center font-display text-3xl font-bold"
                  style={{ backgroundColor: t.color, color: t.text }}
                  aria-hidden="true"
                >
                  {t.initials}
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-[#111111] group-hover:text-[#4fc3f7] transition-colors">{t.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{t.role}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────── */}
      <section aria-label="Book a service" className="border-t-2 border-black bg-[#0d47a1]">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-16 md:py-20 text-center flex flex-col items-center gap-6">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white">Ready to Stay Cool?</h2>
          <p className="text-sm text-white/70 max-w-sm leading-relaxed">
            Book a service today — fast, friendly, and priced fairly. Same-day availability across Bengaluru.
          </p>
          <Link href="/book">
            <button className="btn-lift bg-white text-black font-bold text-sm uppercase tracking-wider px-10 py-4 border-2 border-black">
              Book a Service
            </button>
          </Link>
        </div>
      </section>

    </div>
  );
}
