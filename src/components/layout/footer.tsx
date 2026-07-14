"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Phone, Mail, Clock, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t-2 border-black">

      {/* ── MAIN FOOTER ────────────────────────────────────── */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

            {/* Col 1: Brand */}
            <div className="flex flex-col gap-4">
              <Link href="/" className="w-fit">
                <Image src="/logo-vertical.png" alt="Breezyair" width={100} height={120} className="h-20 w-auto object-contain" />
              </Link>
              <p className="font-display italic text-lg text-[#4fc3f7]">
                &ldquo;Keeping Bengaluru cool, one home at a time.&rdquo;
              </p>
              <div className="flex flex-col gap-2.5 mt-1">
                <a href="tel:+918660174569" className="flex items-center gap-2.5 text-sm text-gray-600 hover:text-[#4fc3f7] transition-colors group" aria-label="Call +91 86601 74569">
                  <div className="w-8 h-8 border-2 border-black bg-[#4fc3f7] flex items-center justify-center shrink-0 group-hover:bg-[#111111] transition-colors" aria-hidden="true">
                    <Phone className="w-3.5 h-3.5 text-black group-hover:text-white transition-colors" />
                  </div>
                  <span className="font-bold text-[#111111]">+91 86601 74569</span>
                </a>
                <a href="mailto:hellobreezyair@gmail.com" className="flex items-center gap-2.5 text-sm text-gray-600 hover:text-[#4fc3f7] transition-colors group" aria-label="Email hellobreezyair@gmail.com">
                  <div className="w-8 h-8 border-2 border-black bg-[#e8f4fd] flex items-center justify-center shrink-0 group-hover:bg-[#111111] transition-colors" aria-hidden="true">
                    <Mail className="w-3.5 h-3.5 text-[#4fc3f7] group-hover:text-white transition-colors" />
                  </div>
                  <span className="break-all text-[#111111]">hellobreezyair@gmail.com</span>
                </a>
              </div>
            </div>

            {/* Col 2: Services */}
            <div className="flex flex-col gap-3">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Services</h4>
              {[
                { href: "/services", label: "AC Repair" },
                { href: "/services", label: "Deep Cleaning" },
                { href: "/services", label: "AC Installation" },
                { href: "/services", label: "AC Uninstallation" },
                { href: "/pricing", label: "View All Pricing" },
                { href: "/pricing#amc", label: "AMC Plans" },
              ].map((link) => (
                <Link key={link.label} href={link.href} className="text-sm text-gray-500 hover:text-[#4fc3f7] transition-colors py-1">
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Col 3: Company */}
            <div className="flex flex-col gap-3">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Company</h4>
              {[
                { href: "/about", label: "About Asad" },
                { href: "/b2b", label: "For Business" },
                { href: "/blog", label: "Blog" },
                { href: "/contact", label: "Contact Us" },
                { href: "/book", label: "Book a Service" },
              ].map((link) => (
                <Link key={link.label} href={link.href} className="text-sm text-gray-500 hover:text-[#4fc3f7] transition-colors py-1">
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Col 4: Hours & Areas */}
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-3">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Working Hours</h4>
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 border-2 border-black bg-[#ffb74d] flex items-center justify-center shrink-0" aria-hidden="true">
                    <Clock className="w-3.5 h-3.5 text-black" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#111111]">Mon – Sat: 8 AM – 8 PM</p>
                    <p className="text-xs text-gray-400 mt-0.5">Emergency calls accepted 24/7</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Service Areas</h4>
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 border-2 border-black bg-[#e8f4fd] flex items-center justify-center shrink-0" aria-hidden="true">
                    <MapPin className="w-3.5 h-3.5 text-[#4fc3f7]" />
                  </div>
                  <div className="flex flex-wrap gap-x-1 gap-y-0.5">
                    {["Indiranagar", "Koramangala", "Whitefield", "HSR Layout", "Bellandur", "Marathahalli"].map((area) => (
                      <span key={area} className="text-xs text-gray-500">{area}<span className="text-gray-300"> · </span></span>
                    ))}
                    <span className="text-xs text-gray-400">&amp; wider Bengaluru</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ── BOTTOM BAR ──────────────────────────────────── */}
        <div className="border-t-2 border-black bg-[#f5f7fa]">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-gray-400 text-center sm:text-left">
              &copy; {new Date().getFullYear()} Breezyair. Keeping Bengaluru cool since 2012.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/contact" className="text-xs text-gray-400 hover:text-[#4fc3f7] transition-colors">Privacy</Link>
              <span className="text-gray-300">|</span>
              <a href="https://wa.me/918660174569" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 hover:text-[#4fc3f7] transition-colors">WhatsApp</a>
            </div>
          </div>
        </div>
      </div>

    </footer>
  );
}
