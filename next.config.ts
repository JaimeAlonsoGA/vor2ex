import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["m.media-amazon.com", "https://placehold.co/"],
    unoptimized: true,
  },
};

export default nextConfig;
