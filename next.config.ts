import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  devIndicators: false,
  output: "export",
  basePath: process.env.GITHUB_ACTIONS === "true" ? "/xin-dong-archives" : "",
  assetPrefix: process.env.GITHUB_ACTIONS === "true" ? "/xin-dong-archives/" : undefined,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
