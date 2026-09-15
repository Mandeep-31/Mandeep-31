import type { NextConfig } from "next";

/*
 * Static export for GitHub Pages. The site is served at the domain root
 * (custom domain mandeepacharya.com.np), so no basePath is applied — all
 * assets and links are root-relative. If the site is ever served from a
 * repo subpath instead, set NEXT_BASE_PATH=/Mandeep-31 when building.
 */
const nextConfig: NextConfig = {
  output: "export",
  basePath: process.env.NEXT_BASE_PATH ?? "",
};

export default nextConfig;