import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['@excalidraw/excalidraw'],
  experimental: {
    optimizePackageImports: ['@excalidraw/excalidraw', 'lucide-react']
  }
};

export default nextConfig;
