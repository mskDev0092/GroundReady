import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: process.env.NEXT_STATIC_EXPORT === "true" ? "export" : "standalone",
  basePath: process.env.NEXT_BASE_PATH || undefined,
  images: {
    unoptimized: process.env.NEXT_STATIC_EXPORT === "true",
  },
  reactStrictMode: false,
};

export default nextConfig;
