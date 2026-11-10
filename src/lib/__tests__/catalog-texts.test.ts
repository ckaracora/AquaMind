import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { careProductCatalog } from "@/data/care-product-catalog";
import { equipmentCatalog } from "@/data/catalog-equipment";
import { speciesCatalog, speciesGroup } from "@/data/catalog-species";
import { unresolvedSpeciesListings } from "@/data/catalog-species-unresolved";
import { messagesFor } from "@aquamind/localization";
import { speciesBehavior } from "@/data/species-behavior";
import { catalogTextKey } from "@aquamind/localization/catalog";
import { SPECIES_TEXT_FIELDS, speciesCatalogTexts } from "@/lib/catalog-texts";

// Çevrilecek katalog metinleri (docs/DECISIONS/0021-dil-altyapisi.md, 4. paket).

describe("canlılar aşamasının metinleri", () => {
  const texts = speciesCatalogTexts(speciesCatalog, speciesBehavior, unresolvedSpeciesListings);

  it("her türün adı, dolu her uyarı alanı ve türe bağlanmayan her satış kaydının gerekçesi listede; boş metin yok", () => {
    expect(texts.filter((item) => item.field === "species.commonName")).toHaveLength(speciesCatalog.length);
    for (const field of ["husbandryCaution", "communityCaution", "tankLengthDataNote"] as const) {
      expect(texts.filter((item) => item.field === `species.${field}`)).toHaveLength(speciesCatalog.filter((profile) => profile[field]).length);
    }
    const conditions = Object.values(speciesBehavior).flat().filter((record) => record.condition).length;
    expect(texts.filter((item) => item.field === "behavior.condition")).toHaveLength(conditions);
    expect(texts.filter((item) => item.field === "unresolved.reason").map((item) => item.text)).toEqual(unresolvedSpeciesListings.map((listing) => listing.reason));
    expect(texts.every((item) => item.text.trim() !== "" && SPECIES_TEXT_FIELDS.includes(item.field))).toBe(true);
  });

  it("anahtar metnin kendi anahtarı", () => {
    expect(texts.every((item) => item.key === catalogTextKey(item.text))).toBe(true);
  });
});

describe("katalog metni anahtarı çakışmaz", () => {
  it("canlı, ekipman ve bakım ürünü metinlerinin farklı her metni farklı anahtar alır", () => {
    const all = new Set<string>([
      ...speciesCatalogTexts(speciesCatalog, speciesBehavior, unresolvedSpeciesListings).map((item) => item.text),
      ...speciesCatalog.flatMap((profile) => profile.aliases ?? []),
      ...equipmentCatalog.flatMap((item) => [item.model, item.specifications, item.capacityDataNote ?? ""]),
      ...careProductCatalog.flatMap((item) => [item.model, item.description]),
    ].filter(Boolean));
    const keys = new Set([...all].map(catalogTextKey));
    expect(all.size).toBeGreaterThan(9000);
    expect(keys.size).toBe(all.size);
  });
});

describe("türe bağlanmayan satış kayıtları", () => {
  it("ekleme penceresi gerekçeyi katalog çevirmeninden geçirir (çevirisi yoksa gizler); ad mağazanın yazımıyla kalabilir", () => {
    const form = readFileSync("src/components/catalog-livestock-form.tsx", "utf8");
    expect(form).toContain("const unresolvedReason = unresolvedMatch ? catalogText(unresolvedMatch.reason) : undefined;");
    // Paragraf çevrilmiş gerekçeyi yazar; Türkçe kaynak metni (`unresolvedMatch.reason`) doğrudan ekrana gitmez.
    expect(form).toMatch(/\{unresolvedReason && <p [^>]*>\{unresolvedReason\}<\/p>\}/);
    expect(form.match(/unresolvedMatch\.reason/g)).toHaveLength(1);
    expect(form).toContain("catalogText(unresolvedMatch.name) ?? unresolvedMatch.name");
  });
});

describe("canlı grupları dil dosyasında", () => {
  it("katalogdaki her grubun adı var; kullanılmayan grup adı yok", () => {
    const groups = new Set(speciesCatalog.map(speciesGroup));
    expect(new Set(Object.keys(messagesFor("tr").livestock.speciesGroups))).toEqual(groups);
  });
});
