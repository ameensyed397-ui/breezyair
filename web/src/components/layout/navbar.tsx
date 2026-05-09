"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change without useEffect to satisfy strict linting
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMobileOpen(false);
  }

  const links = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full bg-white border-b-2 border-black transition-shadow duration-200",
        scrolled && "nav-scrolled"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex h-16 md:h-20 items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Image
            src="/logo-horizontal.png"
            alt="Breezyair"
            width={150}
            height={44}
            className="h-9 md:h-11 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop nav — each link is a bordered pill matching reference */}
        <nav className="hidden md:flex items-center gap-2">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-2 text-sm font-semibold border-2 border-black btn-lift transition-colors",
                  active
                    ? "bg-[#4fc3f7] text-black"
                    : "bg-white text-[#111111] hover:bg-gray-50"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* BOOK NOW + hamburger */}
        <div className="flex items-center gap-2">
          <Link href="/contact" className="hidden md:inline-flex">
            <button className="btn-lift bg-[#4fc3f7] text-black font-bold text-sm uppercase tracking-wider px-5 py-2.5 border-2 border-black">
              BOOK NOW
            </button>
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 border-2 border-black bg-white text-[#111111]"
            aria-label="Toggle menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
              {mobileOpen ? (
                <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
              ) : (
                <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t-2 border-black">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center px-5 py-4 text-base font-semibold border-b-2 border-black",
                  active ? "bg-[#4fc3f7] text-black" : "text-[#111111]"
                )}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="p-4">
            <Link href="/contact">
              <button className="btn-lift w-full bg-[#4fc3f7] text-black font-bold text-sm uppercase tracking-wider py-3 border-2 border-black">
                BOOK NOW
              </button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
