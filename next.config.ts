import type { NextConfig } from "next";
import { PrismaPlugin } from "@prisma/nextjs-monorepo-workaround-plugin";
import withPWA from "next-pwa";

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      "@/generated/prisma": "./src/generated/prisma",
    },
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()];
    }
    return config;
  },
  experimental: {
    authInterrupts: true,
    optimizePackageImports: [
      "@radix-ui/react-avatar",
      "@radix-ui/react-badge",
      "@radix-ui/react-button",
      "@radix-ui/react-card",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-label",
      "@radix-ui/react-popover",
      "@radix-ui/react-select",
      "@radix-ui/react-separator",
      "@radix-ui/react-sidebar",
      "@radix-ui/react-tabs",
      "@radix-ui/react-tooltip",
      "lucide-react"
    ],
    optimizeCss: true,
    scrollRestoration: true,
  },
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  // Optimize images
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
  // Enable prefetching for better navigation
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  devIndicators: false,
};

export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  buildExcludes: [/middleware-manifest\.json$/],
})(nextConfig);
