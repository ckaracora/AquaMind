import type { NextConfig } from "next";
import { securityHeaders } from "./src/lib/security-headers";

const nextConfig: NextConfig = {
  // Workspace paketleri TypeScript kaynağı olarak yayımlanır; Next bunları derler.
  transpilePackages: ["@aquamind/domain", "@aquamind/compatibility-engine", "@aquamind/localization"],
  poweredByHeader: false,
  // Güvenlik başlıkları her sayfaya gider (src/lib/security-headers.ts, docs/SECURITY.md).
  async headers() {
    const env = { development: process.env.NODE_ENV === "development", vercelPreview: process.env.VERCEL_ENV === "preview" };
    return [{ source: "/:path*", headers: securityHeaders(env) }];
  },
};

export default nextConfig;
