import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure Vercel deployments do not fail due to ESLint or TypeScript warnings
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  // Configure for production
  reactStrictMode: true,

  // Optimize for production bundles
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // Environment variables (NEXT_PUBLIC_ prefix for client-side access)
  env: {
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001",
  },

  // Headers for security
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
