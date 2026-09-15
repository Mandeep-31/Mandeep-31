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

/*
 * NEXT_PUBLIC_* vars are inlined at build time, so a CI/deploy machine without
 * them silently ships a form that can never send. Fail loudly in the build log
 * (warn, not throw, so the rest of the site still deploys).
 */
if (process.env.NODE_ENV === "production") {
  const required = [
    "NEXT_PUBLIC_EMAILJS_SERVICE_ID",
    "NEXT_PUBLIC_EMAILJS_TEMPLATE_ID",
    "NEXT_PUBLIC_EMAILJS_PUBLIC_KEY",
  ].filter((name) => !process.env[name]);
  if (required.length > 0) {
    console.warn(
      `⚠ next.config.ts: building without ${required.join(", ")}. ` +
        "The contact form will fail on this deploy. Add them as build " +
        "environment variables and redeploy."
    );
  }
}

export default nextConfig;