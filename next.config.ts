import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // Add output file tracing root to fix warning
  outputFileTracingRoot: __dirname,
  // Skip font optimization during build to avoid timeout
  experimental: {
    optimizeCss: false,
  },
};

export default nextConfig;
