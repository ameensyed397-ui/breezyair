import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { getAllPosts, getPost, formatDate, type Block } from "@/lib/blog/posts";

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Article not found | Breezyair" };
  const url = `https://breezyair.co/blog/${post.slug}`;
  return {
    title: `${post.title} | Breezyair Blog`,
    description: post.excerpt,
    alternates: { canonical: url },
    openGraph: { title: post.title, description: post.excerpt, url, type: "article", publishedTime: post.date, authors: [post.author] },
  };
}

function renderBlock(block: Block, i: number) {
  switch (block.type) {
    case "h2":
      return <h2 key={i} className="font-display text-2xl sm:text-3xl font-bold text-[#111111] mt-10 mb-3">{block.text}</h2>;
    case "p":
      return <p key={i} className="text-base text-gray-600 leading-relaxed mb-4">{block.text}</p>;
    case "ul":
      return (
        <ul key={i} className="flex flex-col gap-2 mb-4">
          {block.items.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-base text-gray-600 leading-relaxed">
              <span className="mt-2 w-2 h-2 bg-[#4fc3f7] border border-black shrink-0" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      );
    case "quote":
      return (
        <blockquote key={i} className="border-l-4 border-[#4fc3f7] bg-[#f5f7fa] px-5 py-4 my-6 font-display text-xl italic text-[#111111]">
          {block.text}
        </blockquote>
      );
  }
}

export default async function Article({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: { "@type": "Person", name: post.author },
    publisher: { "@type": "Organization", name: "Breezyair", logo: { "@type": "ImageObject", url: "https://breezyair.co/logo-vertical.png" } },
    mainEntityOfPage: `https://breezyair.co/blog/${post.slug}`,
  };

  const related = getAllPosts().filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <div className="flex flex-col w-full">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ── HEADER ────────────────────────────────────────── */}
      <section aria-label="Article header" className="border-b-2 border-black bg-[#f5f7fa]">
        <div className="max-w-3xl mx-auto px-4 md:px-8 pt-8 md:pt-12 pb-10">
          <Link href="/blog" className="text-sm font-bold text-gray-500 inline-flex items-center gap-1 hover:text-[#4fc3f7] mb-6">
            <ArrowLeft className="w-4 h-4" /> All articles
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-[#ffb74d] text-black text-[10px] font-bold uppercase tracking-wide border-2 border-black px-2 py-0.5">{post.category}</span>
            <span className="text-xs text-gray-400 inline-flex items-center gap-1"><Clock className="w-3 h-3" aria-hidden="true" /> {post.readTime}</span>
          </div>
          <h1 className="font-sans font-black text-3xl sm:text-4xl md:text-5xl text-[#111111] leading-[1.1]">{post.title}</h1>
          <p className="mt-4 text-sm text-gray-500">By {post.author} · {formatDate(post.date)}</p>
        </div>
      </section>

      {/* ── BODY ──────────────────────────────────────────── */}
      <article className="max-w-3xl mx-auto px-4 md:px-8 py-10 md:py-14 w-full">
        <p className="text-lg text-[#111111] font-semibold leading-relaxed mb-6">{post.excerpt}</p>
        {post.body.map(renderBlock)}

        {/* Inline CTA */}
        <div className="mt-12 border-2 border-black bg-[#4fc3f7] brutal-shadow p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-display text-2xl font-bold text-[#111111]">Need a hand from Asad?</p>
            <p className="text-sm text-black/70">Same-day AC service across Bengaluru from ₹499.</p>
          </div>
          <Link href="/book" className="shrink-0">
            <button className="btn-lift bg-black text-white font-bold text-sm uppercase tracking-wider px-6 py-3 border-2 border-black">Book Now</button>
          </Link>
        </div>
      </article>

      {/* ── RELATED ───────────────────────────────────────── */}
      {related.length > 0 && (
        <section aria-label="Related articles" className="border-t-2 border-black bg-white">
          <div className="max-w-3xl mx-auto px-4 md:px-8 py-12">
            <h2 className="font-display text-2xl font-bold text-[#111111] mb-6">Keep reading</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {related.map((r) => (
                <Link key={r.slug} href={`/blog/${r.slug}`} className="card-lift bg-white p-5 flex items-start gap-4 no-underline group">
                  <span className="text-4xl shrink-0" aria-hidden="true">{r.emoji}</span>
                  <div>
                    <h3 className="text-sm font-bold text-[#111111] leading-snug group-hover:text-[#0d47a1] transition-colors">{r.title}</h3>
                    <span className="mt-2 text-[#4fc3f7] text-xs font-bold inline-flex items-center gap-1">Read <ArrowRight className="w-3 h-3" aria-hidden="true" /></span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
