import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Sandbox/preview profile: standalone output for the managed dev/prod flow.
  output: "standalone",
  // ── GitHub Pages / Vercel static hosting ─────────────────────────────
  // GroundReady is 100% client-side (Zustand + localStorage, no API routes),
  // so it can be exported as a fully static site:
  //   1. Replace `output: "standalone"` with `output: "export"` above.
  //   2. `next build` → upload ./out to GitHub Pages (add .nojekyll).
  //   3. If hosting under a sub-path (e.g. /<repo>/), also set:
  //        basePath: "/<repo>", assetPrefix: "/<repo>/"
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
