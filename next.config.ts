import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  experimental: { serverActions: { bodySizeLimit: "5mb" } },
  serverExternalPackages: ["postgres", "drizzle-orm/postgres-js"],
};
export default nextConfig;
