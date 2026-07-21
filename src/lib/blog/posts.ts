/**
 * Blog content source.
 *
 * Fetches posts from Sanity CMS. When Sanity is not configured
 * (env vars missing), returns empty arrays — the site still builds.
 */

import { getAllPostsFromSanity, getPostFromSanity } from "@/lib/sanity/queries";
import type { SanityPost } from "@/lib/sanity/queries";

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "quote"; text: string }
  | { type: "image"; src: string; alt: string };

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  category: string;
  readTime: string;
  imageSrc: string;
  body: Block[];
}

const projectId = () => process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
const dataset = () => process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

function sanityImageUrl(ref: string): string {
  // ref format: "image-abc123def-400x300-png" → "abc123def.png"
  const cleaned = ref.replace("image-", "").replace(/-\d+x\d+-/, ".");
  return `https://cdn.sanity.io/images/${projectId()}/${dataset()}/${cleaned}`;
}

function mapBody(raw: SanityPost["body"]): Block[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((b) => {
    switch (b._type) {
      case "blockP":
        return { type: "p", text: b.text ?? "" };
      case "blockH2":
        return { type: "h2", text: b.text ?? "" };
      case "blockUl":
        return { type: "ul", items: b.items ?? [] };
      case "blockQuote":
        return { type: "quote", text: b.text ?? "" };
      case "blockImage":
        return {
          type: "image",
          src: b.src?.asset?._ref ? sanityImageUrl(b.src.asset._ref) : "",
          alt: b.alt ?? "",
        };
      default:
        return { type: "p", text: "" };
    }
  });
}

function mapPost(p: SanityPost): Post {
  return {
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    date: p.date,
    author: p.author,
    category: p.category,
    readTime: p.readTime,
    imageSrc: p.coverImage?.asset?._ref ? sanityImageUrl(p.coverImage.asset._ref) : "",
    body: mapBody(p.body),
  };
}

export async function getAllPosts(): Promise<Post[]> {
  const posts = await getAllPostsFromSanity();
  return posts.map(mapPost);
}

export async function getPost(slug: string): Promise<Post | null> {
  const post = await getPostFromSanity(slug);
  return post ? mapPost(post) : null;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
