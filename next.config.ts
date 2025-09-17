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
  }
};

export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  buildExcludes: [/middleware-manifest\.json$/],
})(nextConfig);
