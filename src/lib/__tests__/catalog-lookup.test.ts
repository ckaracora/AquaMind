import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { equipmentCatalog, profileForEquipment } from "@/data/catalog-equipment";
import { normalize } from "@/data/catalog-shared";
import { speciesCatalog, speciesForCatalogExactSearch, speciesForCatalogSearch, speciesForLivestock, speciesWaterTypes } from "@/data/catalog-species";
import type { Equipment, Livestock } from "@/types/aquarium";

// Dizinli aramaların (docs/DECISIONS/0015-katalog-modulleri-ve-sayfa-hizi.md) eski doğrusal aramalarla aynı sonucu verdiğini sınar.
// Başvuru fonksiyonları eski kodun ifadelerini aynen kullanır; yalnızca `normalize` sonuçları testin hızlı bitmesi için önbelleğe alınır.
const normalizedCache = new Map<string | undefined, string | undefined>();
const n = (value?: string) => {
  if (!normalizedCache.has(value)) normalizedCache.set(value, normalize(value));
  return normalizedCache.get(value);
};
const referenceSpeciesForLivestock = (item: Livestock) => speciesCatalog.find((profile) => profile.id === item.catalogId) ?? speciesCatalog.find((profile) =>
  n(profile.scientificName) === n(item.scientificName) || n(profile.commonName) === n(item.commonName) || profile.aliases?.some((alias) => n(alias) === n(item.commonName)),
);
const referenceExactSearch = (value: string, category: Livestock["category"], waterType: "freshwater" | "brackish" | "saltwater") => {
  const query = n(value);
  if (!query) return undefined;
  return speciesCatalog.find((profile) => profile.category === category && speciesWaterTypes(profile).includes(waterType) && [profile.commonName, profile.scientificName, ...(profile.aliases ?? [])].some((name) => n(name) === query));
};
const referenceSearch = (value: string, category: Livestock["category"], waterType: "freshwater" | "brackish" | "saltwater") => {
  const query = n(value);
  if (!query) return undefined;
  return referenceExactSearch(value, category, waterType) ?? speciesCatalog.find((profile) => profile.category === category && speciesWaterTypes(profile).includes(waterType) && [profile.commonName, profile.scientificName, ...(profile.aliases ?? [])].some((name) => n(name)?.includes(query)));
};
const referenceProfileForEquipment = (item: Equipment) => equipmentCatalog.find((profile) => profile.id === item.catalogId) ?? equipmentCatalog.find((profile) =>
  n(profile.brand) === n(item.brand) && n(profile.model) === n(item.model),
);

const variants = (value: string) => [value, value.toUpperCase(), value.toLowerCase(), `  ${value}  `, value.replace(/ /g, "  "), value.replace(/i/g, "ı"), value.replace(/I/g, "İ")];
const names = [...new Set(speciesCatalog.flatMap((profile) => [profile.commonName, profile.scientificName, ...(profile.aliases ?? [])]))];
const livestock = (commonName: string, scientificName?: string, catalogId?: string): Livestock => ({ id: "l", aquariumId: "a", commonName, scientificName, category: "fish", quantity: 1, addedAt: "2026-01-01", catalogId });
const device = (brand?: string, model?: string, catalogId?: string): Equipment => ({ id: "e", aquariumId: "a", category: "filter", brand, model, installedAt: "2026-01-01", catalogId });

describe("katalog arama dizinleri", () => {
  it("canlı eşleme eski aramayla aynı sonucu verir", () => {
    const cases = [
      ...names.flatMap((name, index) => (index % 10 === 0 ? variants(name) : [name]).flatMap((value) => [livestock(value), livestock("", value)])),
      livestock("Bilinmeyen balık"), livestock(""), livestock("x", undefined, "neon-tetra"), livestock("Neon tetra", undefined, "yok-boyle"),
    ];
    for (const item of cases) expect(speciesForLivestock(item)?.id, `${item.commonName} / ${item.scientificName}`).toBe(referenceSpeciesForLivestock(item)?.id);
  }, 60_000);

  it("katalog araması eski aramayla aynı sonucu verir", () => {
    const queries = [...new Set(names.filter((_, index) => index % 7 === 0).flatMap((name) => [name, name.toUpperCase(), name.slice(0, 3), name.slice(-4)])), "", " "];
    const combos = [["fish", "freshwater"], ["fish", "brackish"], ["fish", "saltwater"], ["shrimp", "freshwater"], ["snail", "freshwater"], ["other", "saltwater"]] as const;
    for (const query of queries) for (const [category, waterType] of combos) {
      expect(speciesForCatalogExactSearch(query, category, waterType)?.id, `tam: ${query}`).toBe(referenceExactSearch(query, category, waterType)?.id);
      expect(speciesForCatalogSearch(query, category, waterType)?.id, `kısmi: ${query}`).toBe(referenceSearch(query, category, waterType)?.id);
    }
  }, 60_000);

  it("ekipman eşleme eski aramayla aynı sonucu verir", () => {
    const cases = [
      ...equipmentCatalog.flatMap((profile, index) => index % 4 === 0
        ? [device(profile.brand, profile.model), device(profile.brand.toUpperCase(), profile.model.toLowerCase()), device(` ${profile.brand} `, profile.model.replace(/ /g, "  ")), device(profile.brand, `${profile.model}x`)]
        : [device(profile.brand, profile.model)]),
      device("ISTA", "2L Set"), device(undefined, "BioMaster 350"), device("Oase"), device("x", "y", "oase-biomaster-350"), device("Oase", "BioMaster 350", "yok-boyle"),
    ];
    for (const item of cases) expect(profileForEquipment(item)?.id, `${item.brand} / ${item.model}`).toBe(referenceProfileForEquipment(item)?.id);
  }, 60_000);
});

describe("katalog modülleri", () => {
  // Uygulama kodu birleşik `@/data/catalog` dosyasını değer olarak içe aktarırsa sayfa iki kataloğu birden indirir.
  const sourceFiles = (dir: string): string[] => readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) return entry === "__tests__" ? [] : sourceFiles(path);
    return /\.(ts|tsx)$/.test(entry) ? [path] : [];
  });
  it("uygulama kodu birleşik katalog dosyasını değer olarak içe aktarmaz", () => {
    const offenders = ["src/app", "src/components", "src/lib", "src/providers"].flatMap((dir) => sourceFiles(dir))
      .filter((file) => readFileSync(file, "utf8").split("\n").some((line) => /from "@\/data\/catalog"/.test(line) && !/^import type /.test(line.trim())));
    expect(offenders).toEqual([]);
  });

  // Sağlık sayfası ve ana sayfa yalnızca gereken katalog parçalarını indirir (docs/DECISIONS/0016-gereken-katalog-kayitlarinin-yuklenmesi.md);
  // bu modüller katalog verisini değer olarak içe aktarırsa kataloğun tamamı yeniden tarayıcıya gider.
  it("parça yükleyen modüller katalog verisini değer olarak içe aktarmaz", () => {
    const dataFree = [
      "src/lib/catalog-slice.ts", "src/lib/health-analysis-core.ts", "src/lib/use-catalog-lookup.ts", "src/lib/dashboard-status.ts", "src/lib/water-status.ts",
      "src/data/catalog-buckets.ts", "src/data/catalog-shared.ts", "src/app/page.tsx", "src/app/aquariums/[id]/health/page.tsx",
    ];
    const dataModules = /from "(@\/data\/(catalog|catalog-species|catalog-equipment|catalog-species-expanded|catalog-equipment-[a-z]+|catalog-bucket-builders|species-behavior)|@\/lib\/health-analysis|\.\/(catalog|catalog-species|catalog-equipment|catalog-species-expanded|catalog-equipment-[a-z]+|catalog-bucket-builders|species-behavior))"/;
    const offenders = dataFree.flatMap((file) => readFileSync(file, "utf8").split("\n")
      .filter((line) => /^\s*import /.test(line) && !/^\s*import type /.test(line) && dataModules.test(line))
      .map((line) => `${file}: ${line.trim()}`));
    expect(offenders).toEqual([]);
  });

  it("kaynak dosyalarında NUL baytı yok (Git dosyayı ikili sayar)", () => {
    const textFiles = (dir: string): string[] => readdirSync(dir).flatMap((entry) => {
      const path = join(dir, entry);
      if (statSync(path).isDirectory()) return entry === "node_modules" || entry.startsWith(".") ? [] : textFiles(path);
      return /\.(ts|tsx|cjs|mjs|js|json|md|css)$/.test(entry) ? [path] : [];
    });
    const files = ["src", "packages", "scripts", "docs"].flatMap((dir) => textFiles(dir));
    expect(files.length).toBeGreaterThan(50);
    expect(files.filter((file) => readFileSync(file).includes(0))).toEqual([]);
  });
});
