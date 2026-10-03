import type { NextConfig } from "next";

function cmsAdminBase() {
  const raw = process.env.NEXT_PUBLIC_CMS_ADMIN_BASE?.trim() || "/admin";
  const base = raw.startsWith("/") ? raw : `/${raw}`;
  return base.replace(/\/$/, "") || "/admin";
}

const cmsBase = cmsAdminBase();

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: false, // Let Cloudflare handle compression to avoid Next.js decoding errors

  turbopack: {
    root: __dirname,
  },

  // Nexora will be hosted at:
  // https://your-domain.com/Nexora/
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || undefined,

  // Generate a static website when building for Bluehost via GitHub Actions
  output: process.env.BUILD_TARGET === "static" ? "export" : undefined,

  // Important for Apache/cPanel hosting
  trailingSlash: true,

  images: {
    unoptimized: true,

    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "images.ctfassets.net",
      },
      {
        protocol: "https",
        hostname: "**.ctfassets.net",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },

};

export default nextConfig;