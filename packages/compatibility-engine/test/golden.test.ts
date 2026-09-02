import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { analyzeAquarium } from "@/lib/health-analysis";
import { buildGoldenCases } from "./fixtures/golden-cases";

// Altın çıktı karşılaştırması: uygulamanın kullandığı `analyzeAquarium`
// uyarlayıcısının çıktısı, motor taşınmadan ÖNCE alınmış fikstürle birebir
// aynı olmalıdır. Fikstür yalnızca bilinçli, ayrıca onaylanmış bir motor
// değişikliğinde ve şu komutla yeniden üretilir:
//
//   AQUAMIND_GOLDEN_CAPTURE=1 pnpm exec vitest run packages/compatibility-engine/test/golden.test.ts
//
// Normal çalıştırmada fikstür yoksa test başarısız olur; sessizce yazılmaz.

const fixturePath = fileURLToPath(new URL("./fixtures/golden-v1.json", import.meta.url));
const captureMode = process.env.AQUAMIND_GOLDEN_CAPTURE === "1";

interface GoldenRecord {
  name: string;
  result: unknown;
}

describe("altın çıktı karşılaştırması (analyzeAquarium)", () => {
  const cases = buildGoldenCases();

  if (captureMode) {
    it("fikstürü mevcut motor çıktısıyla yeniden yazar", () => {
      const lines = cases.map((testCase) => JSON.stringify({ name: testCase.name, result: analyzeAquarium(...testCase.args) }));
      writeFileSync(fixturePath, `[\n${lines.join(",\n")}\n]\n`);
      expect(existsSync(fixturePath)).toBe(true);
    });
    return;
  }

  it("fikstür dosyası mevcut", () => {
    expect(existsSync(fixturePath), `Fikstür yok: ${fixturePath}`).toBe(true);
  });

  const expected: GoldenRecord[] = existsSync(fixturePath) ? JSON.parse(readFileSync(fixturePath, "utf8")) : [];

  it("vaka sayısı ve adları fikstürle aynı", () => {
    expect(cases.length).toBe(expected.length);
    expect(cases.map((testCase) => testCase.name)).toEqual(expected.map((record) => record.name));
  });

  it("her vakanın puanı, metrikleri ve uyarıları fikstürle birebir aynı", () => {
    for (let index = 0; index < cases.length; index += 1) {
      const testCase = cases[index];
      const actual = JSON.parse(JSON.stringify(analyzeAquarium(...testCase.args)));
      expect(actual, testCase.name).toStrictEqual(expected[index]?.result);
    }
  });
});
