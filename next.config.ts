import type { NextConfig } from "next";
import { PrismaPlugin } from "@prisma/nextjs-monorepo-workaround-plugin";
import bundleAnalyzer from "@next/bundle-analyzer";
import withPWA from "next-pwa";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

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
      "lucide-react",
      "framer-motion",
      "date-fns",
    ],
    scrollRestoration: true,
    // Optimize CSS for faster loading
    optimizeCss: true,
    // Enable partial prerendering for instant navigation
    ppr: false, // Will be stable in future Next.js versions
  },
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  generateEtags: true, // Enable for better caching
  // Optimize images
  images: {
    formats: ["image/avif", "image/webp"], // AVIF first (smaller)
    minimumCacheTTL: 3600, // 1 hour cache
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Optimize bundling
  productionBrowserSourceMaps: false,
  devIndicators: false,
};

export default withBundleAnalyzer(
  withPWA({
    dest: "public",
    register: true,
    skipWaiting: true,
    // Disable PWA during local dev and bundle analysis to avoid noisy errors
    disable: process.env.NODE_ENV === "development" || process.env.ANALYZE === "true",
    buildExcludes: [/middleware-manifest\.json$/],
  })(nextConfig)
);
