import { Phone, Mail, Globe, MapPin, MessageCircle } from "lucide-react";
import Image from "next/image";
import type { Metadata } from "next";
import { ContactForm } from "@/components/ui/contact-form";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

export const metadata: Metadata = {
  title: "Contact Breezyair | Book AC Service in Bengaluru",
  description:
    "Contact Breezyair to book same-day AC repair, maintenance or installation in Bengaluru. Call +91 8660174569 or fill the form — Asad replies within 30 minutes.",
  alternates: { canonical: "https://breezyair.co/contact" },
  openGraph: {
    title: "Contact Breezyair | Book AC Service in Bengaluru",
    description: "Book same-day AC service in Bengaluru. Call, email or fill the form — Asad Khan replies within 30 minutes.",
    url: "https://breezyair.co/contact",
  },
};

export default function Contact() {
  return (
    <div className="flex flex-col w-full">

      {/* ── MAIN CONTACT SECTION ───────────────────────────── */}
      <section aria-label="Contact information and booking form" className="max-w-7xl mx-auto px-4 md:px-8 w-full py-10 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">

          {/* ── LEFT: Contact info ───────────────────────── */}
          <div className="flex flex-col gap-6">
            <Breadcrumbs items={[{ label: "Contact" }]} />

            <div className="inline-block bg-[#4fc3f7] text-black text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 border-2 border-black w-fit brutal-shadow-sm">
              WE ARE OPEN
            </div>

            <h1 className="flex flex-col gap-1">
              <span className="font-sans font-black text-4xl sm:text-5xl text-[#111111] leading-[1.05]">
                Say Hello to
              </span>
              <span className="font-display font-bold text-4xl sm:text-5xl leading-[1.1]">
                <span
                  style={{ background: "linear-gradient(transparent 50%, #4fc3f7 50%)", paddingBottom: "4px" }}
                >
                  Asad Khan.
                </span>
              </span>
            </h1>

            <p className="text-sm text-gray-500 leading-relaxed max-w-sm">
              Need a hand with your AC or heating? Whether it&apos;s a quick fix or a fresh install,
              I&apos;m here to keep your home feeling breezy and comfortable.
            </p>

            {/* Contact cards */}
            <div className="flex flex-col gap-3">
              {[
                { icon: Phone, label: "Call Me Directly",  value: "+91 8660174569",            href: "tel:+918660174569" },
                { icon: MessageCircle, label: "WhatsApp Us",  value: "Chat on WhatsApp",        href: "https://wa.me/918660174569" },
                { icon: Mail,  label: "Email Anytime",     value: "hellobreezyair@gmail.com",  href: "mailto:hellobreezyair@gmail.com" },
                { icon: Globe, label: "Visit Our Website", value: "www.breezyair.co",           href: "https://breezyair.co" },
              ].map((c, i) => (
                <a
                  key={i}
                  href={c.href}
                  className="card-lift bg-white flex items-center gap-4 p-4 no-underline group"
                  aria-label={`${c.label}: ${c.value}`}
                >
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

            {/* Sticky note with spinning-eyes indoor mascot */}
            <div className="flex items-end gap-4 mt-2">
              <div className="border-2 border-black bg-white px-4 py-2 font-display italic text-xl brutal-shadow-sm rotate-[-3deg]">
                &quot;I&apos;m on my way!&quot;
              </div>
              <div className="w-14 h-14 shrink-0">
                <Image
                  src="/mascot-indoor.png"
                  alt="Breezyair indoor AC mascot"
                  width={56}
                  height={56}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>

          <div className="w-full max-w-md mx-auto lg:mx-0 lg:ml-auto">
            <ContactForm />
          </div>
        </div>
      </section>

      {/* ── GOOGLE MAP ────────────────────────────────────── */}
      <section aria-label="Service area map — Bengaluru" className="border-t-2 border-black w-full relative" style={{ height: "380px" }}>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31099.391!2d77.60893!3d12.97194!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44e6d%3A0xf8dfc3e8517e4fe0!2sIndiranagar%2C%20Bengaluru%2C%20Karnataka%20560038!5e0!3m2!1sen!2sin!4v1714258800000!5m2!1sen!2sin"
          width="100%"
          height="380"
          style={{ border: 0, display: "block" }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Breezyair service area — Indiranagar, Bengaluru"
        />
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md border-2 border-black bg-white brutal-shadow flex items-center gap-3 px-4 py-3">
          <div className="w-8 h-8 bg-[#ef4444] border-2 border-black flex items-center justify-center rounded-full shrink-0" aria-hidden="true">
            <MapPin className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-[#111111]">Serving Bengaluru &amp; Surrounding Areas</p>
            <p className="text-xs text-gray-400">Indiranagar · Koramangala · Whitefield · HSR Layout · Bellandur · Marathahalli</p>
          </div>
        </div>
      </section>

    </div>
  );
}
