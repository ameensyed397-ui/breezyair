import type { NextConfig } from "next";

// Baseline security headers applied to every route. (A full Content-Security-Policy
// is intentionally omitted for now — it needs testing against Razorpay checkout,
// Google Fonts and the inline JSON-LD before enabling.)
const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
    ],
  },
  serverExternalPackages: ["zod"],
  experimental: {
    optimizePackageImports: ["lucide-react", "@sanity/client", "react-markdown", "ai", "@ai-sdk/react"],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    return [
      // Legacy static-site URLs indexed by Google before this became a Next.js app.
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/Home", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
