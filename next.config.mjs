/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configurable build output directory. Set NEXT_DIST_DIR=.next-build (or
  // similar) when running `next build` to avoid clobbering the running dev
  // server's .next cache. Default stays at .next so `next dev` and `next
  // start` keep working unconfigured.
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

export default nextConfig;
