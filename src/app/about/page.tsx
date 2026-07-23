import { CheckCircle2, MapPin, ArrowRight, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

export const metadata: Metadata = {
  title: "About Asad Khan | Breezyair's Lead HVAC Technician",
  description:
    "Meet Asad Khan — 15+ years of HVAC experience and Bengaluru's most trusted neighbourhood AC technician. The story behind Breezyair and how we work.",
  alternates: { canonical: "https://breezyair.co/about" },
  keywords: ["Asad Khan Breezyair", "Bengaluru HVAC consultant", "HVAC contractor", "AC technician Bengaluru", "About Breezyair"],
  openGraph: {
    title: "About Asad Khan | Breezyair",
    description: "15+ years fixing ACs across Bengaluru. Honest pricing, respected homes, and work you can trust. This is the Breezyair story.",
    url: "https://breezyair.co/about",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

const values = [
  { title: "Honest pricing", desc: "Every price is published before we visit. No surprises on the invoice." },
  { title: "Your home, respected", desc: "We remove shoes, cover surfaces, and leave your space cleaner than we found it." },
  { title: "Approve before we start", desc: "Any extra work gets quoted and approved by you — verbally and in writing." },
  { title: "Before / after proof", desc: "Every job documented, so you know exactly what was done and that it was done right." },
];

const certifications = [
  "HVAC Technician Certification — Karnataka NSDC",
  "Refrigeration & AC Servicing — ITI Bengaluru",
  "15+ years field experience across 1,000+ units",
  "Authorised service partner — multiple AC brands",
];

const areas = ["Koramangala", "HSR Layout", "Indiranagar", "Whitefield", "Bellandur", "Marathahalli"];

export default function About() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: "Asad Khan",
      jobTitle: "Lead HVAC Technician",
      worksFor: {
        "@type": "LocalBusiness",
        name: "Breezyair"
      },
      description: "15+ years of HVAC experience and Bengaluru's most trusted neighbourhood AC technician."
    }
  };

  return (
    <div className="flex flex-col w-full">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ── HERO ──────────────────────────────────────────── */}
      <section aria-label="Our story" className="max-w-7xl mx-auto px-4 md:px-8 w-full pt-10 md:pt-16 pb-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="flex flex-col gap-5">
            <Breadcrumbs items={[{ label: "About" }]} />
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#4fc3f7]">Our story</p>
            <h1 className="flex flex-col gap-1">
              <span className="font-sans font-black text-4xl sm:text-5xl md:text-6xl text-[#111111] leading-[1.05]">The AC guy your</span>
              <span className="font-display font-bold text-4xl sm:text-5xl md:text-6xl leading-[1.1]">
                <span style={{ background: "linear-gradient(transparent 50%, #4fc3f7 50%)", paddingBottom: "4px" }}>neighbour trusts.</span>
              </span>
            </h1>
            <p className="text-sm text-gray-500 leading-relaxed max-w-md">
              I&apos;m Asad Khan. I&apos;ve been fixing ACs across Bengaluru for 15+ years — in homes, offices, and server rooms.
              I started Breezyair because I saw too many customers getting overcharged and under-served by platforms that treat
              technicians as gig workers and homeowners as invoices.
            </p>
            <p className="text-sm text-gray-500 leading-relaxed max-w-md">
              Breezyair is different. It&apos;s me — Asad — showing up at your door, treating your home like mine, and charging
              you what the job actually costs. Same technician every time. No strangers, no surprises.
            </p>
            <div className="flex flex-wrap gap-3 mt-2">
              <Link href="/book" className="w-fit">
                <button className="btn-lift bg-[#4fc3f7] text-black font-bold text-sm uppercase tracking-wider px-6 py-3 border-2 border-black inline-flex items-center gap-2">
                  Book with Asad <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </Link>
              <a href="tel:+918660174569" className="w-fit">
                <button className="btn-lift bg-white text-black font-bold text-sm uppercase tracking-wider px-6 py-3 border-2 border-black inline-flex items-center gap-2">
                  <Phone className="w-4 h-4" aria-hidden="true" /> Call Asad
                </button>
              </a>
            </div>
          </div>

          {/* Portrait with offset block */}
          <div className="w-full max-w-sm mx-auto lg:mx-0 lg:ml-auto">
            <div className="relative w-full">
              <div className="absolute top-4 -right-4 w-full h-full bg-[#ffb74d] border-2 border-black z-0" />
              <div className="border-2 border-black w-full aspect-[4/5] relative z-10 overflow-hidden">
                <Image
                  src="/asad-khan.jpg"
                  alt="Asad Khan — Breezyair founder and lead HVAC technician in Bengaluru"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 100vw, 384px"
                  priority
                />
                <div className="absolute bottom-0 left-0 right-0 bg-white border-t-2 border-black p-3 text-center">
                  <p className="text-sm font-bold text-[#111111]">Asad Khan · Founder</p>
                  <p className="text-xs text-gray-400">Lead Technician · 15+ yrs</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MISSION QUOTE ─────────────────────────────────── */}
      <section aria-label="Our promise" className="border-t-2 border-black bg-[#0d47a1]">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-14 md:py-20 text-center flex flex-col items-center gap-5">
          <div className="w-20 h-20">
            <Image src="/mascot-outdoor.png" alt="Breezyair AC mascot" width={80} height={80} className="w-full h-full object-contain" />
          </div>
          <blockquote className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
            &ldquo;Drop your problem, ASAP. Pinky promise.&rdquo;
          </blockquote>
          <p className="text-sm text-white/70">— Asad Khan, Founder, Breezyair</p>
        </div>
      </section>

      {/* ── VALUES ────────────────────────────────────────── */}
      <section aria-label="How we work" className="border-t-2 border-black bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-14 md:py-20">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#111111] mb-2">The Breezyair way</h2>
            <p className="text-sm text-[#4fc3f7] font-semibold italic">Four promises we keep on every single job</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {values.map((v) => (
              <div key={v.title} className="card-lift bg-white p-6 flex gap-4 items-start">
                <div className="w-10 h-10 border-2 border-black bg-[#4fc3f7] flex items-center justify-center shrink-0" aria-hidden="true">
                  <CheckCircle2 className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#111111] mb-1">{v.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CREDENTIALS + AREAS ───────────────────────────── */}
      <section aria-label="Credentials and service areas" className="border-t-2 border-black bg-[#f5f7fa]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-14 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#4fc3f7] mb-3">Credentials</p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#111111] mb-6">Certified. Experienced. Local.</h2>
              <ul className="flex flex-col gap-4">
                {certifications.map((c) => (
                  <li key={c} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#4fc3f7] shrink-0 mt-0.5" aria-hidden="true" />
                    <span className="text-sm font-semibold text-[#111111]">{c}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#4fc3f7] mb-3">Our neighbourhood</p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#111111] mb-6">We know Bengaluru&apos;s streets.</h2>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">
                We&apos;re not a pan-India platform sending whoever is closest. We work exclusively in south and east Bengaluru —
                areas we know like the back of our hand. Short travel times mean faster response and better prices for everyone.
              </p>
              <div className="flex flex-wrap gap-3">
                {areas.map((a) => (
                  <div key={a} className="inline-flex items-center gap-1.5 bg-white border-2 border-black px-3 py-1.5 text-sm font-semibold text-[#111111] brutal-shadow-sm">
                    <MapPin className="w-3.5 h-3.5 text-[#4fc3f7]" aria-hidden="true" /> {a}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section aria-label="Book a service" className="border-t-2 border-black bg-[#4fc3f7]">
        <div className="max-w-3xl mx-auto px-4 md:px-8 py-16 md:py-20 text-center flex flex-col items-center gap-5">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-[#111111]">Ready to meet your new AC guy?</h2>
          <p className="text-sm text-black/70 max-w-sm leading-relaxed">Book a service. Asad will call you within 30 minutes.</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/book">
              <button className="btn-lift bg-black text-white font-bold text-sm uppercase tracking-wider px-8 py-4 border-2 border-black">Book a Service</button>
            </Link>
            <a href="tel:+918660174569">
              <button className="btn-lift bg-white text-black font-bold text-sm uppercase tracking-wider px-8 py-4 border-2 border-black inline-flex items-center gap-2">
                <Phone className="w-4 h-4" aria-hidden="true" /> Call +91 8660174569
              </button>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
