import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Workspace paketleri TypeScript kaynağı olarak yayımlanır; Next bunları derler.
  transpilePackages: ["@aquamind/domain", "@aquamind/compatibility-engine"],
};

export default nextConfig;
