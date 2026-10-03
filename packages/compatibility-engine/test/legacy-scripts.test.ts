import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

// Mevcut 113 sağlık senaryosu `scripts/test-health.cjs` içinde yaşamaya devam eder
// ve `pnpm verify` tarafından doğrudan çalıştırılır. Bu test aynı betiği
// `pnpm test` altında da çalıştırır; senaryolar kopyalanmaz, tek kaynak kalır.

const repoRoot = fileURLToPath(new URL("../../../", import.meta.url));
const script = fileURLToPath(new URL("../../../scripts/test-health.cjs", import.meta.url));

// Betik, kataloğu (yaklaşık 1,1 MB TypeScript) `ts.transpileModule` ile derlediği için
// yük altında birkaç saniye sürer; Vitest'in 5 sn'lik varsayılanı bu alt süreç için
// yetersizdir. Zaman aşımı, betiğin ölçülen süresinin çok üstünde tutulur.
const LEGACY_SCRIPT_TIMEOUT_MS = 120_000;

describe("mevcut sağlık senaryoları (scripts/test-health.cjs)", () => {
  it(
    "uyarlayıcı üzerinden 113 senaryoyu geçer",
    () => {
      const run = spawnSync(process.execPath, [script], { cwd: repoRoot, encoding: "utf8", timeout: LEGACY_SCRIPT_TIMEOUT_MS });
      expect(run.status, run.stderr).toBe(0);
      expect(run.stdout).toContain("113 senaryo başarıyla doğrulandı");
    },
    LEGACY_SCRIPT_TIMEOUT_MS,
  );
});
