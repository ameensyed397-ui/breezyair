import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock } from "lucide-react";
import type { Metadata } from "next";
import { getAllPosts, formatDate } from "@/lib/blog/posts";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "AC Care Blog | Tips, Guides & Advice | Breezyair Bengaluru",
  description:
    "Honest AC care advice from Bengaluru's neighbourhood HVAC experts — repair checklists, maintenance schedules, buying guides and money-saving tips from Asad Khan.",
  alternates: { canonical: "https://breezyair.co/blog" },
  openGraph: {
    title: "AC Care Blog | Breezyair Bengaluru",
    description: "Repair checklists, maintenance schedules and buying guides from Bengaluru's trusted AC technicians.",
    url: "https://breezyair.co/blog",
  },
};

export default async function Blog() {
  const posts = await getAllPosts();
  const [featured, ...rest] = posts;

  return (
    <div className="flex flex-col w-full">

      {/* ── HERO ──────────────────────────────────────────── */}
      <section aria-label="Blog hero" className="max-w-7xl mx-auto px-4 md:px-8 w-full pt-10 md:pt-16 pb-12 text-center">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#4fc3f7]">The Breezyair Blog</p>
        <h1 className="mt-3 flex flex-col gap-1 items-center">
          <span className="font-sans font-black text-5xl sm:text-6xl md:text-7xl text-[#111111] leading-[1.05]">Keep your cool,</span>
          <span className="font-display font-bold text-5xl sm:text-6xl md:text-7xl leading-[1.1]">
            <span style={{ background: "linear-gradient(transparent 50%, #4fc3f7 50%)", paddingBottom: "4px" }}>the smart way.</span>
          </span>
        </h1>
        <p className="mt-5 text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
          Honest AC advice from 15+ years on Bengaluru rooftops — checklists, schedules and buying guides, no sales fluff.
        </p>
      </section>

      {/* ── FEATURED ──────────────────────────────────────── */}
      {featured && (
        <section aria-label="Featured article" className="border-t-2 border-black bg-[#f5f7fa]">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
            <Link href={`/blog/${featured.slug}`} className="block card-lift bg-white no-underline group">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="border-b-2 md:border-b-0 md:border-r-2 border-black bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] flex items-center justify-center p-12 md:p-16">
                  <Image src={featured.imageSrc} alt={featured.title} width={160} height={160} className="w-32 h-32 md:w-40 md:h-40 object-contain mix-blend-multiply" />
                </div>
                <div className="p-6 md:p-8 flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <span className="bg-[#ffb74d] text-black text-[10px] font-bold uppercase tracking-wide border-2 border-black px-2 py-0.5">{featured.category}</span>
                    <span className="text-xs text-gray-400 inline-flex items-center gap-1"><Clock className="w-3 h-3" aria-hidden="true" /> {featured.readTime}</span>
                  </div>
                  <h2 className="font-display text-2xl md:text-3xl font-bold text-[#111111] leading-tight group-hover:text-[#0d47a1] transition-colors">{featured.title}</h2>
                  <p className="text-sm text-gray-500 leading-relaxed">{featured.excerpt}</p>
                  <div className="mt-auto pt-3 flex items-center justify-between">
                    <span className="text-xs text-gray-400">{featured.author} · {formatDate(featured.date)}</span>
                    <span className="text-[#4fc3f7] text-sm font-bold inline-flex items-center gap-1">Read <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" /></span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* ── GRID ──────────────────────────────────────────── */}
      <section aria-label="All articles" className="border-t-2 border-black bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="card-lift bg-white flex flex-col no-underline group">
                <div className="border-b-2 border-black bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] flex items-center justify-center py-10">
                  <Image src={post.imageSrc} alt={post.title} width={100} height={100} className="w-24 h-24 object-contain mix-blend-multiply hover:scale-105 transition-transform" />
                </div>
                <div className="p-5 flex flex-col gap-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#ffb74d] text-black text-[9px] font-bold uppercase tracking-wide border-2 border-black px-1.5 py-0.5">{post.category}</span>
                    <span className="text-[11px] text-gray-400 inline-flex items-center gap-1"><Clock className="w-3 h-3" aria-hidden="true" /> {post.readTime}</span>
                  </div>
                  <h3 className="text-base font-bold text-[#111111] leading-snug group-hover:text-[#0d47a1] transition-colors">{post.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">{post.excerpt}</p>
                  <div className="mt-auto pt-2 text-xs text-gray-400">{formatDate(post.date)}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section aria-label="Book a service" className="border-t-2 border-black bg-[#0d47a1]">
        <div className="max-w-3xl mx-auto px-4 md:px-8 py-16 md:py-20 text-center flex flex-col items-center gap-5">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white">Reading is good. Cool air is better.</h2>
          <p className="text-sm text-white/70 max-w-sm leading-relaxed">Done troubleshooting? Book a Breezyair service and let Asad handle the rest.</p>
          <Link href="/book">
            <button className="btn-lift bg-[#4fc3f7] text-black font-bold text-sm uppercase tracking-wider px-10 py-4 border-2 border-black">Book a Service</button>
          </Link>
        </div>
      </section>

    </div>
  );
}
