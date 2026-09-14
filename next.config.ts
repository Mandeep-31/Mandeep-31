import type { NextConfig } from "next";

/*
 * Static export for GitHub Pages, which serves the site from
 * https://mandeep-31.github.io/Mandeep-31/ (repo subpath). If the site is
 * ever hosted at a domain root (custom domain or other provider), drop
 * `basePath` and revert the image paths in ExpandingVisual/Work to
 * leading-slash ("/hero-sky.jpg").
 */
const nextConfig: NextConfig = {
  output: "export",
  basePath: "/Mandeep-31",
};

export default nextConfig;