import { describe, expect, it } from "vitest";
import { catalogTextKey } from "@aquamind/localization/catalog";
import { speciesCatalog } from "@/data/catalog-species";
import { speciesCare, type SpeciesCare } from "@/data/species-care";
import { enCatalogSpeciesCare } from "../../../packages/localization/src/messages/en-catalog-species-care";
import { esCatalogSpeciesCare } from "../../../packages/localization/src/messages/es-catalog-species-care";
import { readTranslations, spainOnlySpanish, values } from "./catalog-translation-checks";

// Tür bakım bilgisi (veri sprinti E3, 2026-11-14): beslenme, cinsiyet ayrımı, üreme, ömür, zorluk, yüzme bölgesi, su sertliği.
// Her dolu alanın kaynak adresi vardır; aralıklar tutarlıdır; metinlerin İngilizce ve İspanyolca çevirisi tamdır ve Türkçeyle aynı sayıları taşır.

const TEXT_FIELDS = ["diet", "sexing", "breeding"] as const;
const SOURCE_OF: Record<string, keyof NonNullable<SpeciesCare["sources"]>> = {
  diet: "diet", sexing: "sexing", breeding: "breeding", lifespan: "lifespan", difficulty: "difficulty", swimLevels: "swimLevel", hardnessDgh: "hardness",
};
const ids = new Set(speciesCatalog.map((profile) => profile.id));
const turkishTexts = new Set(Object.values(speciesCare).flatMap((care) => TEXT_FIELDS.map((field) => care[field]).filter((text): text is string => Boolean(text))));
const TURKISH_LETTERS = /[çğıöşüÇĞİÖŞÜ]/;

describe("tür bakım bilgisi verisi", () => {
  it("her kayıt katalogdaki bir türe ait ve en az bir alanı dolu", () => {
    for (const [id, care] of Object.entries(speciesCare)) {
      expect(ids.has(id), id).toBe(true);
      expect(Object.keys(SOURCE_OF).some((field) => (care as unknown as Record<string, unknown>)[field] !== undefined), id).toBe(true);
    }
  });

  it("her dolu alanın kaynak adresi var; kaynak adresi olan alan dolu (kaynak yoksa alan yok)", () => {
    for (const [id, care] of Object.entries(speciesCare)) {
      for (const [field, source] of Object.entries(SOURCE_OF)) {
        const filled = (care as unknown as Record<string, unknown>)[field] !== undefined;
        expect(Boolean(care.sources[source]), `${id}.${field}`).toBe(filled);
        if (filled) expect(care.sources[source], `${id}.${field}`).toMatch(/^https:\/\//);
      }
      expect(Object.keys(care.sources).every((key) => Object.values(SOURCE_OF).includes(key as never)), id).toBe(true);
      expect(care.verifiedAt, id).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("sayısal aralıklar tutarlı; sertlikte kaynak tek sınır verdiyse öbürü null (0 uydurulmaz)", () => {
    for (const [id, care] of Object.entries(speciesCare)) {
      if (care.lifespan) {
        const [low, high] = care.lifespan.years;
        expect(low > 0 && high >= low && high <= 60, `${id} ömür`).toBe(true);
        if (care.lifespan.qualifier) expect(["atLeast", "upTo", "about", "maxRecorded"], id).toContain(care.lifespan.qualifier);
        if (care.lifespan.qualifier === "atLeast" || care.lifespan.qualifier === "upTo" || care.lifespan.qualifier === "about" || care.lifespan.qualifier === "maxRecorded") expect(low, `${id} tek değer`).toBe(high);
      }
      if (care.hardnessDgh) {
        const [low, high] = care.hardnessDgh;
        expect(low !== null || high !== null, `${id} sertlik`).toBe(true);
        if (low !== null) expect(low >= 0 && low <= 40, `${id} alt`).toBe(true);
        if (high !== null) expect(high > 0 && high <= 40, `${id} üst`).toBe(true);
        if (low !== null && high !== null) expect(low <= high, id).toBe(true);
      }
      if (care.swimLevels) {
        expect(care.swimLevels.length, id).toBeGreaterThan(0);
        expect(new Set(care.swimLevels).size, id).toBe(care.swimLevels.length);
      }
      if (care.difficulty) expect(["easy", "notForBeginners", "expertsOnly"], id).toContain(care.difficulty);
    }
  });

  it("metinler kısa (en çok 2 cümle), emir kipinde değil ve boş değil", () => {
    for (const [id, care] of Object.entries(speciesCare)) {
      for (const field of TEXT_FIELDS) {
        const text = care[field];
        if (text === undefined) continue;
        expect(text.trim(), `${id}.${field}`).toBe(text);
        expect(text.length, `${id}.${field}`).toBeGreaterThan(5);
        expect(text.length, `${id}.${field}`).toBeLessThanOrEqual(300);
        expect(text.split(/(?<=[.!?])\s+/).length, `${id}.${field} cümle sayısı`).toBeLessThanOrEqual(3);
        expect(text, `${id}.${field}`).not.toMatch(/\b(?:verin|besleyin|koyun|ekleyin|kullanın|tutun)\b/);
      }
    }
  });
});

describe.each(["en", "es"] as const)("tür bakım metinlerinin %s çevirisi", (locale) => {
  const entries = readTranslations(locale, "species-care") as Array<ReturnType<typeof readTranslations>[number] & Record<string, string>>;
  const table = locale === "en" ? enCatalogSpeciesCare : esCatalogSpeciesCare;

  it("her Türkçe metnin çevirisi var; eskimiş ya da fazla çeviri yok; anahtar metinden üretilmiş", () => {
    expect(new Set(entries.map((entry) => entry.tr))).toEqual(turkishTexts);
    expect(entries.every((entry) => entry.key === catalogTextKey(entry.tr))).toBe(true);
    expect(new Set(entries.map((entry) => entry.key)).size).toBe(entries.length);
    expect(entries.every((entry) => entry.fields.length > 0 && entry.fields.every((field) => /^care\.(?:diet|sexing|breeding)$/.test(field)))).toBe(true);
  });

  it("alan adları metnin kullanıldığı alanlarla uyuşur", () => {
    const used = new Map<string, Set<string>>();
    for (const care of Object.values(speciesCare)) for (const field of TEXT_FIELDS) {
      const text = care[field];
      if (text) used.set(text, (used.get(text) ?? new Set()).add(`care.${field}`));
    }
    for (const entry of entries) expect(new Set(entry.fields), entry.key).toEqual(used.get(entry.tr));
  });

  it("uygulamadaki tablo kaynakla aynı (betikle yeniden üretilmiş)", () => {
    expect(table).toEqual(Object.fromEntries(entries.map((entry) => [entry.key, entry[locale]])));
  });

  it("çeviri dolu, Türkçe harf taşımaz, sayılar Türkçeyle aynı", () => {
    for (const entry of entries) {
      const text = entry[locale];
      expect(text.trim().length, entry.key).toBeGreaterThan(3);
      expect(text, entry.key).not.toMatch(/[ğışİ]|ç(?=[a-z])/);
      if (locale === "en") expect(text, entry.key).not.toMatch(TURKISH_LETTERS);
      expect(values(text, locale === "en" ? "en" : "tr"), `${entry.key} sayılar`).toEqual(values(entry.tr, "tr"));
    }
  });
});

describe("İspanyolca bakım metinleri Latin Amerika ortak İspanyolcası", () => {
  it("İspanya'ya özgü sözcük ve vosotros biçimi yok", () => {
    const entries = readTranslations("es", "species-care") as Array<ReturnType<typeof readTranslations>[number] & { es: string }>;
    expect(entries.flatMap((entry) => spainOnlySpanish(entry.es).map((word) => `${entry.key}: ${word}`))).toEqual([]);
  });
});
