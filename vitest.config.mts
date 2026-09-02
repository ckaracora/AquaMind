import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Vitest yalnızca workspace paketlerinin testlerini çalıştırır. Mevcut
// `scripts/*.cjs` doğrulama betikleri `pnpm verify` içinde ayrıca çalışmaya
// devam eder; bu yapılandırma onların yerine geçmez.
export default defineConfig({
  resolve: {
    // Uygulamadaki `@/…` takma adı (tsconfig.json ile aynı hedef).
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    include: ["packages/**/*.test.ts"],
    environment: "node",
  },
});
