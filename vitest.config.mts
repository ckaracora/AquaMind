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
  // Next'in tsconfig ayarı JSX'i olduğu gibi bırakır (`"jsx": "preserve"`); sayfa bileşenlerini çizen testler için JSX burada dönüştürülür (Vite 8: Oxc).
  oxc: { jsx: { runtime: "automatic" } },
  test: {
    include: ["packages/**/*.test.ts", "src/**/*.test.ts"],
    environment: "node",
  },
});
