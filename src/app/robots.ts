import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Default: allow all, block private paths
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/", "/admin/"],
      },
      // Googlebot (standard search + AI Overviews)
      {
        userAgent: "Googlebot",
        allow: "/",
      },
      // OpenAI — ChatGPT Search citations
      {
        userAgent: "OAI-SearchBot",
        allow: "/",
      },
      // OpenAI — user-triggered browsing
      {
        userAgent: "ChatGPT-User",
        allow: "/",
      },
      // OpenAI — training (allow for maximum model familiarity)
      {
        userAgent: "GPTBot",
        allow: "/",
      },
      // Anthropic — Claude search + citations
      {
        userAgent: "ClaudeBot",
        allow: "/",
      },
      // Anthropic — user-triggered browsing
      {
        userAgent: "Claude-User",
        allow: "/",
      },
      // Perplexity — search citations
      {
        userAgent: "PerplexityBot",
        allow: "/",
      },
      // Perplexity — user-triggered fetches
      {
        userAgent: "Perplexity-User",
        allow: "/",
      },
      // Google AI (Gemini + AI Overviews, non-search)
      {
        userAgent: "Google-Extended",
        allow: "/",
      },
      // Microsoft Copilot / Bing
      {
        userAgent: "bingbot",
        allow: "/",
      },
      // Apple Intelligence
      {
        userAgent: "Applebot-Extended",
        allow: "/",
      },
      // Meta AI
      {
        userAgent: "Meta-ExternalAgent",
        allow: "/",
      },
    ],
    sitemap: "https://breezyair.co/sitemap.xml",
    host: "https://breezyair.co",
  };
}
