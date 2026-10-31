import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { DEFAULT_LOCALE, loadLocaleBundle, localeBundle, messagesFor } from "../src";
import { diseaseMessagesFor } from "../src/diseases";
import { engineMessagesFor } from "../src/engine";
import { plantWarningMessagesFor } from "../src/plant-warnings";
import { privacyMessagesFor } from "../src/privacy";
import { en } from "../src/messages/en";
import { enCatalogSpecies } from "../src/messages/en-catalog-species";
import { enDiseases } from "../src/messages/en-diseases";
import { enEngine } from "../src/messages/en-engine";
import { enPlantWarnings } from "../src/messages/en-plant-warnings";
import { enPrivacy } from "../src/messages/en-privacy";

// Dil paketleri (docs/DECISIONS/0021-dil-altyapisi.md, 5. paket): Türkçe dışındaki dilin metinleri yalnız o dil seçilince yüklenir.

const src = new URL("../src/", import.meta.url);
const read = (path: string) => readFileSync(new URL(path, src), "utf8");
/** Dosyanın içe aktardığı modüller; yalnız tip içe aktarımı (`import type`) derlemede silindiği için ayrı tutulur. */
const imports = (source: string) => {
  const all = [...source.matchAll(/^(import(?: type)?)\s[^;]*?from\s+"([^"]+)";/gm)].map((match) => ({ typeOnly: match[1] === "import type", from: match[2] }));
  const reexports = [...source.matchAll(/^export\s[^;]*?from\s+"([^"]+)";/gm)].map((match) => ({ typeOnly: /^export type/.test(match[0]), from: match[1] }));
  const dynamic = [...source.matchAll(/import\("([^"]+)"\)/g)].map((match) => match[1]);
  return { values: [...all, ...reexports].filter((item) => !item.typeOnly).map((item) => item.from), dynamic };
};

describe("dil paketi yüklenmeden", () => {
  it("varsayılan dilin metni döner; paket kayıtlı değil", () => {
    expect(localeBundle("en")).toBeUndefined();
    expect(localeBundle(DEFAULT_LOCALE)).toBeUndefined();
    expect(messagesFor("en")).toBe(messagesFor("tr"));
    expect(engineMessagesFor("en")).toBe(engineMessagesFor("tr"));
    expect(diseaseMessagesFor("en")).toBe(diseaseMessagesFor("tr"));
    expect(plantWarningMessagesFor("en")).toBe(plantWarningMessagesFor("tr"));
    expect(privacyMessagesFor("en")).toBe(privacyMessagesFor("tr"));
  });
});

describe("dil paketi yüklenince", () => {
  it("bütün girişler İngilizce metni verir; katalog çevirisi pakette", async () => {
    await loadLocaleBundle("tr");
    expect(localeBundle("tr")).toBeUndefined();
    await loadLocaleBundle("en");
    await loadLocaleBundle("en");
    expect(messagesFor("en")).toBe(en);
    expect(engineMessagesFor("en")).toBe(enEngine);
    expect(diseaseMessagesFor("en")).toBe(enDiseases);
    expect(plantWarningMessagesFor("en")).toBe(enPlantWarnings);
    expect(privacyMessagesFor("en")).toBe(enPrivacy);
    expect(localeBundle("en")?.catalogSpecies).toBe(enCatalogSpecies);
    // Türkçe etkilenmez.
    expect(messagesFor("tr").app.description).toBe("Akvaryumunuzu bilinçle yönetin.");
  });
});

describe("paketin sınırı", () => {
  const entries = ["index.ts", "engine.ts", "catalog.ts", "diseases.ts", "plant-warnings.ts", "privacy.ts", "bundles.ts", "locales.ts", "format.ts", "units.ts", "engine-format.ts"];

  it("hiçbir giriş İngilizce dosyayı durağan olarak içe aktarmaz; paketi yalnız `loadLocaleBundle` ayrı parça olarak yükler", () => {
    for (const file of entries) {
      const { values, dynamic } = imports(read(file));
      expect(values.filter((from) => /\/en(?:-|\.|")|\/en$/.test(`${from}"`)), file).toEqual([]);
      expect(dynamic, file).toEqual(file === "bundles.ts" ? ["./messages/en-bundle"] : []);
    }
  });

  it("uygulamada ve öbür paketlerde hiçbir dosya İngilizce dosyaları içe aktarmaz; paket onları dışa açmaz", () => {
    // Derleme sonrasındaki denetim (scripts/check-locale-bundle.cjs, `pnpm verify`) aynı sınırı gerçek ilk yükleme dosyalarında sınar.
    const repo = new URL("../../../", import.meta.url);
    const files: string[] = [];
    const walk = (dir: URL) => {
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        if (entry.isDirectory()) {
          if (!["node_modules", "__tests__", "test", ".next"].includes(entry.name)) walk(new URL(`${entry.name}/`, dir));
        } else if (/\.(?:ts|tsx|cjs|mjs|js)$/.test(entry.name)) files.push(new URL(entry.name, dir).pathname);
      }
    };
    for (const dir of ["src/", "packages/"]) walk(new URL(dir, repo));
    expect(files.some((file) => file.endsWith("src/providers/i18n-provider.tsx"))).toBe(true);
    const english = /(?:^|\/)messages\/en(?:-[a-z-]+)?(?:\.ts)?$/;
    const offenders = files.flatMap((file) => {
      const source = readFileSync(decodeURIComponent(file.replace(/^\/([A-Za-z]:)/, "$1")), "utf8");
      const specifiers = [...source.matchAll(/(?:from|import)\s*\(?\s*["']([^"']+)["']/g)].map((match) => match[1]);
      return specifiers.filter((specifier) => english.test(specifier)).map((specifier) => `${file}: ${specifier}`);
    }).filter((line) => !/packages\/localization\/src\/(?:bundles\.ts|messages\/en-bundle\.ts):/.test(line));
    expect(offenders).toEqual([]);
    const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8")) as { exports: Record<string, unknown> };
    expect(JSON.stringify(pkg.exports)).not.toMatch(/messages\/en|en-bundle/);
  });

  it("İngilizce dosyalar Türkçe dosyalardan yalnız tip alır (Türkçe metin İngilizce parçaya girmez)", () => {
    const files = readdirSync(new URL("messages/", src)).filter((name) => /^en(?:-[a-z-]+)?\.ts$/.test(name));
    expect(files.sort()).toEqual(["en-bundle.ts", "en-catalog-species.ts", "en-diseases.ts", "en-engine.ts", "en-plant-warnings.ts", "en-privacy.ts", "en.ts"]);
    for (const name of files) {
      const { values } = imports(read(`messages/${name}`));
      expect(values.filter((from) => /(?:^|\/)tr(?:-[a-z-]+)?$/.test(from)), name).toEqual([]);
    }
  });
});
