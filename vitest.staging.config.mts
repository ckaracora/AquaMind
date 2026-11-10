import { defineConfig } from "vitest/config";

// Hazırlık projesinde gerçek istemciyle yetki senaryoları (karar 0034). Yalnız `.github/workflows/staging-db.yml` çalıştırır
// (`pnpm test:staging`); ağ ve iş akışının sırları gerekir. Senaryolar aynı test kullanıcılarını sırayla kullandığı için tek iş
// parçacığında ve dosya içinde sırayla çalışır.
export default defineConfig({
  test: {
    include: ["supabase/staging/**/*.test.ts"],
    environment: "node",
    fileParallelism: false,
    sequence: { concurrent: false },
    testTimeout: 30_000,
  },
});
