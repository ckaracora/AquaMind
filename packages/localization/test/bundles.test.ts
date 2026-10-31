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
import { es } from "../src/messages/es";
import { esCatalogSpecies } from "../src/messages/es-catalog-species";
import { esDiseases } from "../src/messages/es-diseases";
import { esEngine } from "../src/messages/es-engine";
import { esPlantWarnings } from "../src/messages/es-plant-warnings";
import { esPrivacy } from "../src/messages/es-privacy";

// Dil paketleri (docs/DECISIONS/0021-dil-altyapisi.md, 5. paket ve İspanyolca paketi): Türkçe dışındaki her dilin metinleri yalnız o dil
// seçilince, kendi ayrı parçasında yüklenir.

const OTHER = ["en", "es"] as const;
const BUNDLES = {
  en: { messages: en, engine: enEngine, diseases: enDiseases, plantWarnings: enPlantWarnings, privacy: enPrivacy, catalogSpecies: enCatalogSpecies },
  es: { messages: es, engine: esEngine, diseases: esDiseases, plantWarnings: esPlantWarnings, privacy: esPrivacy, catalogSpecies: esCatalogSpecies },
};
const FILES = ["bundle", "catalog-species", "diseases", "engine", "plant-warnings", "privacy"];

const src = new URL("../src/", import.meta.url);
const read = (path: string) => readFileSync(new URL(path, src), "utf8");
/** Dosyanın içe aktardığı modüller; yalnız tip içe aktarımı (`import type`) derlemede silindiği için ayrı tutulur. */
const imports = (source: string) => {
  const all = [...source.matchAll(/^(import(?: type)?)\s[^;]*?from\s+"([^"]+)";/gm)].map((match) => ({ typeOnly: match[1] === "import type", from: match[2] }));
  const reexports = [...source.matchAll(/^export\s[^;]*?from\s+"([^"]+)";/gm)].map((match) => ({ typeOnly: /^export type/.test(match[0]), from: match[1] }));
  const dynamic = [...source.matchAll(/import\("([^"]+)"\)/g)].map((match) => match[1]);
  return { values: [...all, ...reexports].filter((item) => !item.typeOnly).map((item) => item.from), dynamic };
};
/** Başka bir dilin mesaj dosyası (`messages/en.ts`, `messages/es-engine.ts` …). */
const otherLanguageFile = /(?:^|\/)messages\/(?:en|es)(?:-[a-z-]+)?(?:\.ts)?$/;

describe("dil paketi yüklenmeden", () => {
  it.each(OTHER)("varsayılan dilin metni döner; paket kayıtlı değil (%s)", (locale) => {
    expect(localeBundle(locale)).toBeUndefined();
    expect(localeBundle(DEFAULT_LOCALE)).toBeUndefined();
    expect(messagesFor(locale)).toBe(messagesFor("tr"));
    expect(engineMessagesFor(locale)).toBe(engineMessagesFor("tr"));
    expect(diseaseMessagesFor(locale)).toBe(diseaseMessagesFor("tr"));
    expect(plantWarningMessagesFor(locale)).toBe(plantWarningMessagesFor("tr"));
    expect(privacyMessagesFor(locale)).toBe(privacyMessagesFor("tr"));
  });
});

describe("dil paketi yüklenince", () => {
  it.each(OTHER)("bütün girişler o dilin metnini verir; katalog çevirisi pakette (%s)", async (locale) => {
    await loadLocaleBundle("tr");
    expect(localeBundle("tr")).toBeUndefined();
    await loadLocaleBundle(locale);
    await loadLocaleBundle(locale);
    const expected = BUNDLES[locale];
    expect(messagesFor(locale)).toBe(expected.messages);
    expect(engineMessagesFor(locale)).toBe(expected.engine);
    expect(diseaseMessagesFor(locale)).toBe(expected.diseases);
    expect(plantWarningMessagesFor(locale)).toBe(expected.plantWarnings);
    expect(privacyMessagesFor(locale)).toBe(expected.privacy);
    expect(localeBundle(locale)?.catalogSpecies).toBe(expected.catalogSpecies);
    // Türkçe etkilenmez.
    expect(messagesFor("tr").app.description).toBe("Akvaryumunuzu bilinçle yönetin.");
  });
});

describe("paketin sınırı", () => {
  const entries = ["index.ts", "engine.ts", "catalog.ts", "diseases.ts", "plant-warnings.ts", "privacy.ts", "bundles.ts", "locales.ts", "format.ts", "units.ts", "engine-format.ts"];

  it("hiçbir giriş başka dilin dosyasını durağan olarak içe aktarmaz; paketleri yalnız `loadLocaleBundle` ayrı parça olarak yükler", () => {
    for (const file of entries) {
      const { values, dynamic } = imports(read(file));
      expect(values.filter((from) => otherLanguageFile.test(from)), file).toEqual([]);
      expect(dynamic, file).toEqual(file === "bundles.ts" ? OTHER.map((locale) => `./messages/${locale}-bundle`) : []);
    }
  });

  it("uygulamada ve öbür paketlerde hiçbir dosya başka dilin dosyalarını içe aktarmaz; paket onları dışa açmaz", () => {
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
    const offenders = files.flatMap((file) => {
      const source = readFileSync(decodeURIComponent(file.replace(/^\/([A-Za-z]:)/, "$1")), "utf8");
      const specifiers = [...source.matchAll(/(?:from|import)\s*\(?\s*["']([^"']+)["']/g)].map((match) => match[1]);
      return specifiers.filter((specifier) => otherLanguageFile.test(specifier)).map((specifier) => `${file}: ${specifier}`);
    }).filter((line) => !/packages\/localization\/src\/(?:bundles\.ts|messages\/(?:en|es)-bundle\.ts):/.test(line));
    expect(offenders).toEqual([]);
    const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8")) as { exports: Record<string, unknown> };
    expect(JSON.stringify(pkg.exports)).not.toMatch(/messages\/(?:en|es)|(?:en|es)-bundle/);
  });

  it.each(OTHER)("%s dosyaları Türkçe dosyalardan yalnız tip alır, başka dilin dosyasını hiç almaz (her dil kendi parçasında)", (locale) => {
    const files = readdirSync(new URL("messages/", src)).filter((name) => new RegExp(`^${locale}(?:-[a-z-]+)?\\.ts$`).test(name));
    expect(files.sort()).toEqual([`${locale}.ts`, ...FILES.map((name) => `${locale}-${name}.ts`)].sort());
    for (const name of files) {
      const { values } = imports(read(`messages/${name}`));
      expect(values.filter((from) => /(?:^|\/)tr(?:-[a-z-]+)?$/.test(from)), name).toEqual([]);
      expect(values.filter((from) => otherLanguageFile.test(from) && !from.startsWith(`./${locale}`)), name).toEqual([]);
    }
  });
});
