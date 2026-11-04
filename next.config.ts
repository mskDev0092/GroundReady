import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required by the production start script.
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
