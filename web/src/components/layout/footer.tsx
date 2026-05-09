import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="w-full border-t-2 border-black bg-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between gap-10 md:gap-12">

          {/* Callback CTA */}
          <div className="flex flex-col gap-4 max-w-sm w-full">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#111111]">
              Get a Chill Callback
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              Drop your number and we&apos;ll call you back within 15 minutes to schedule your cooling checkup.
            </p>
            <div className="flex gap-2 w-full">
              <input
                type="tel"
                placeholder="+91 98765 43210"
                className="flex-1 h-11 px-3 text-sm border-2 border-black bg-white focus:outline-none focus:ring-2 focus:ring-[#4fc3f7] min-w-0"
              />
              <button className="btn-lift h-11 px-5 bg-[#4fc3f7] text-black text-sm font-bold border-2 border-black uppercase tracking-wide shrink-0">
                Call Me
              </button>
            </div>
            <p className="font-display italic text-[#4fc3f7] text-lg">
              &quot;I&apos;ll call you personally!&quot; – The HVAC Pro Mascot
            </p>
          </div>

          {/* Links + logo */}
          <div className="flex flex-col gap-6 md:items-end">
            <div className="flex flex-col gap-2 md:text-right">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Quick Links</h4>
              <p className="text-sm font-semibold text-gray-700">Emergency: +91 80-4567-8901</p>
              <Link href="/services" className="text-sm text-gray-500 hover:text-[#4fc3f7] transition-colors">Service Areas</Link>
              <Link href="#"         className="text-sm text-gray-500 hover:text-[#4fc3f7] transition-colors">Terms of Service</Link>
              <Link href="#"         className="text-sm text-gray-500 hover:text-[#4fc3f7] transition-colors">Mascot Guide</Link>
            </div>

            {/* Vertical logo */}
            <div className="mt-auto">
              <Image
                src="/logo-vertical.png"
                alt="Breezyair"
                width={100}
                height={120}
                className="h-24 w-auto object-contain"
              />
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 pt-6 border-t border-gray-200 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Breezyair. Quality cooling for Indiranagar, Koramangala &amp; Whitefield.
        </div>
      </div>
    </footer>
  );
}
