import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Vitest workspace paketlerinin, uygulamanın ve yerel test veritabanının (`supabase/tests`, karar 0032) testlerini çalıştırır; hazırlık
// projesine karşı çalışan `supabase/staging` testleri ayrı yapılandırmadadır (`vitest.staging.config.mts`, karar 0034). Mevcut
// `scripts/*.cjs` doğrulama betikleri `pnpm verify` içinde ayrıca çalışmaya
// devam eder; bu yapılandırma onların yerine geçmez.
export default defineConfig({
  resolve: {
    // Uygulamadaki `@/…` takma adı (tsconfig.json ile aynı hedef).
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  // Next'in tsconfig ayarı JSX'i olduğu gibi bırakır (`"jsx": "preserve"`); sayfa bileşenlerini çizen testler için JSX burada dönüştürülür (Vite 8: Oxc).
  oxc: { jsx: { runtime: "automatic" } },
  test: {
    include: ["packages/**/*.test.ts", "src/**/*.test.ts", "supabase/tests/**/*.test.ts"],
    environment: "node",
    // Ağır testler (motor fikstürü, katalog taramaları) paralel çalıştırmada, özellikle yerel veritabanı testleri (PGlite) aynı anda
    // açılırken 5 sn'lik varsayılanı aşabiliyor (2026-11-01: 5,2 sn). Daha da ağır olanlar kendi sürelerini verir (30 sn).
    testTimeout: 15_000,
  },
});
