import type { NextConfig } from "next";
import { authConfig } from "./src/lib/auth/config";
import { publicEnvWithSecrets } from "./src/lib/auth/secret-guard";
import { headerRules } from "./src/lib/security-headers";

// Herhangi bir `NEXT_PUBLIC_` değişkeninde Supabase gizli anahtarı varsa derleme durur; yoksa değer tarayıcı paketine yazılırdı
// (karar 0035). Hata iletisi yalnız değişkenin adını yazar, değeri yazmaz.
const leaked = publicEnvWithSecrets(process.env);
if (leaked.length) {
  throw new Error(`${leaked.join(", ")} gizli bir Supabase anahtarı içeriyor. Tarayıcıya giden değişkenlere yalnız proje adresi ve yayınlanabilir anahtar (sb_publishable_…) girilir.`);
}

const nextConfig: NextConfig = {
  // Workspace paketleri TypeScript kaynağı olarak yayımlanır; Next bunları derler.
  transpilePackages: ["@aquamind/domain", "@aquamind/compatibility-engine", "@aquamind/localization"],
  poweredByHeader: false,
  // Güvenlik başlıkları her sayfaya gider (src/lib/security-headers.ts, docs/SECURITY.md).
  async headers() {
    const env = { development: process.env.NODE_ENV === "development", vercelPreview: process.env.VERCEL_ENV === "preview", supabaseOrigin: authConfig?.url ?? null };
    return headerRules(env);
  },
};

export default nextConfig;
