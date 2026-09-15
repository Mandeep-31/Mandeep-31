import type { NextConfig } from "next";

/*
 * Static export for GitHub Pages, which serves the site from
 * https://mandeep-31.github.io/Mandeep-31/ (repo subpath). Set the empty
 * string in .env.local (NEXT_BASE_PATH=) to serve at the root during local
 * development; CI builds (no env file) keep the "/Mandeep-31" subpath.
 * If the site is ever hosted at a domain root (custom domain or other
 * provider), drop `basePath` entirely.
 */
const nextConfig: NextConfig = {
  output: "export",
  basePath: process.env.NEXT_BASE_PATH ?? "/Mandeep-31",
};

export default nextConfig;