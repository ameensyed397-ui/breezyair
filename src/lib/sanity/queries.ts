import { config, getClient } from "./client";

export interface SanityBlock {
  _type: string;
  text?: string;
  items?: string[];
  src?: { asset?: { _ref?: string } };
  alt?: string;
}

export interface SanityPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  category: string;
  readTime: string;
  coverImage: { asset?: { _ref?: string } };
  body: SanityBlock[];
}

const POST_FIELDS = `{
  "slug": slug.current,
  title,
  excerpt,
  "date": date,
  author,
  category,
  readTime,
  coverImage,
  body
}`;

const allPostsQuery = `*[_type == "post"] | order(date desc) ${POST_FIELDS}`;
const postBySlugQuery = `*[_type == "post" && slug.current == $slug][0] ${POST_FIELDS}`;
const allSlugsQuery = `*[_type == "post"]{ "slug": slug.current }`;

export async function getAllPostsFromSanity(): Promise<SanityPost[]> {
  if (!config.projectId) return [];
  return getClient().fetch(allPostsQuery);
}

export async function getPostFromSanity(slug: string): Promise<SanityPost | null> {
  if (!config.projectId) return null;
  return getClient().fetch(postBySlugQuery, { slug });
}

export async function getAllSlugsFromSanity(): Promise<string[]> {
  if (!config.projectId) return [];
  const rows: { slug: string }[] = await getClient().fetch(allSlugsQuery);
  return rows.map((r) => r.slug);
}
