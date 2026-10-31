import { describe, expect, it } from "vitest";
import { careProductCatalog } from "@/data/care-product-catalog";
import { equipmentCatalog } from "@/data/catalog-equipment";
import { speciesCatalog, speciesGroup } from "@/data/catalog-species";
import { messagesFor } from "@aquamind/localization";
import { speciesBehavior } from "@/data/species-behavior";
import { catalogTextKey } from "@aquamind/localization/catalog";
import { SPECIES_TEXT_FIELDS, speciesCatalogTexts } from "@/lib/catalog-texts";

// Çevrilecek katalog metinleri (docs/DECISIONS/0021-dil-altyapisi.md, 4. paket).

describe("canlılar aşamasının metinleri", () => {
  const texts = speciesCatalogTexts(speciesCatalog, speciesBehavior);

  it("her türün adı ve dolu her uyarı alanı listede; boş metin yok", () => {
    expect(texts.filter((item) => item.field === "species.commonName")).toHaveLength(speciesCatalog.length);
    for (const field of ["husbandryCaution", "communityCaution", "tankLengthDataNote"] as const) {
      expect(texts.filter((item) => item.field === `species.${field}`)).toHaveLength(speciesCatalog.filter((profile) => profile[field]).length);
    }
    const conditions = Object.values(speciesBehavior).flat().filter((record) => record.condition).length;
    expect(texts.filter((item) => item.field === "behavior.condition")).toHaveLength(conditions);
    expect(texts.every((item) => item.text.trim() !== "" && SPECIES_TEXT_FIELDS.includes(item.field))).toBe(true);
  });

  it("anahtar metnin kendi anahtarı", () => {
    expect(texts.every((item) => item.key === catalogTextKey(item.text))).toBe(true);
  });
});

describe("katalog metni anahtarı çakışmaz", () => {
  it("canlı, ekipman ve bakım ürünü metinlerinin farklı her metni farklı anahtar alır", () => {
    const all = new Set<string>([
      ...speciesCatalogTexts(speciesCatalog, speciesBehavior).map((item) => item.text),
      ...speciesCatalog.flatMap((profile) => profile.aliases ?? []),
      ...equipmentCatalog.flatMap((item) => [item.model, item.specifications, item.capacityDataNote ?? ""]),
      ...careProductCatalog.flatMap((item) => [item.model, item.description]),
    ].filter(Boolean));
    const keys = new Set([...all].map(catalogTextKey));
    expect(all.size).toBeGreaterThan(9000);
    expect(keys.size).toBe(all.size);
  });
});

describe("canlı grupları dil dosyasında", () => {
  it("katalogdaki her grubun adı var; kullanılmayan grup adı yok", () => {
    const groups = new Set(speciesCatalog.map(speciesGroup));
    expect(new Set(Object.keys(messagesFor("tr").livestock.speciesGroups))).toEqual(groups);
  });
});
