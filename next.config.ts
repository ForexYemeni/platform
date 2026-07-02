import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel يتعامل مع البناء تلقائياً، لا نحتاج standalone
  // output: "standalone" -- مخصص لـ Docker، علّقناه لـ Vercel
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: false,
  images: {
    unoptimized: true,
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "recharts", "framer-motion"],
  },
};

export default nextConfig;
