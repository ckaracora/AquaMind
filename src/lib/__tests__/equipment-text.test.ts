import { describe, expect, it } from "vitest";
import { createDisplayFormat, loadLocaleBundle, messagesFor } from "@aquamind/localization";
import { catalogTranslator } from "@aquamind/localization/catalog";
import { equipmentText } from "@aquamind/localization/equipment";
import { enCatalogEquipment } from "../../../packages/localization/src/messages/en-catalog-equipment";
import { esCatalogEquipment } from "../../../packages/localization/src/messages/es-catalog-equipment";
import { equipmentCatalog, specificationsForEquipment } from "@/data/catalog-equipment";
import { equipmentSpecsText, profileSpecsText } from "@/lib/equipment-text";
import type { Equipment } from "@/types/aquarium";

// Ekipmanın teknik bilgi satırı (karar 0021, 5. paket): Türkçede katalogdaki satır aynen; çevirisi olmayan dilde sayısal özet.

await loadLocaleBundle("en");
await loadLocaleBundle("es");
const prefs = { temperature: "celsius", volume: "liters", dateFormat: "day-first" } as const;
const tr = { translate: catalogTranslator("tr"), texts: messagesFor("tr").equipment.specSummary, fmt: createDisplayFormat("tr", prefs) };
const en = { translate: catalogTranslator("en", {}), texts: messagesFor("en").equipment.specSummary, fmt: createDisplayFormat("en", prefs) };
const record = (profile: (typeof equipmentCatalog)[number]): Equipment => ({ id: "x", aquariumId: "a", category: profile.category, brand: profile.brand, model: profile.model, installedAt: "2026-01-01", catalogId: profile.id, specifications: "eski metin" });

describe("ekipmanın teknik bilgi satırı", () => {
  it("Türkçede kart ve pencere eskisi gibi katalogdaki satırı gösterir (bütün katalog)", () => {
    for (const profile of equipmentCatalog) {
      expect(equipmentSpecsText(profile, "eski metin", tr.translate, tr.texts, tr.fmt), profile.id).toBe(specificationsForEquipment(record(profile)));
      expect(profileSpecsText(profile, tr.translate, tr.texts, tr.fmt), profile.id).toBe(profile.specifications);
    }
  });

  it("çevirisi olmayan dilde Türkçe satır yerine sayısal özet yazılır; Türkçe harf kalmaz", () => {
    const filter = equipmentCatalog.find((profile) => profile.ratedFlowLph === 750 && profile.powerW === 22 && profile.recommendedMaxL === 250 && profile.recommendedMinL === undefined)!;
    expect(profileSpecsText(filter, en.translate, en.texts, en.fmt)).toBe("750 L/h · 22 W · up to 250 L");
    expect(profileSpecsText({ ...filter, ratedFlowLph: 1100, recommendedMinL: 60 }, en.translate, en.texts, en.fmt)).toBe("1,100 L/h · 22 W · 60–250 L");
    const gallons = createDisplayFormat("en", { ...prefs, volume: "gallons" });
    expect(profileSpecsText(filter, en.translate, en.texts, gallons)).toBe("750 L/h · 22 W · up to 66 gal");
    for (const profile of equipmentCatalog) expect(profileSpecsText(profile, en.translate, en.texts, en.fmt), profile.id).not.toMatch(/[çğıöşüÇĞİÖŞÜ]|saat|litre/);
    expect(profileSpecsText({ ...filter, ratedFlowLph: undefined, powerW: undefined, recommendedMaxL: undefined }, en.translate, en.texts, en.fmt)).toBe("");
  });

  it("İspanyolcada da sayısal özet: Latin Amerika sayı biçimi, Türkçe satır yok", () => {
    const texts = messagesFor("es").equipment.specSummary;
    const fmt = createDisplayFormat("es", prefs);
    const filter = equipmentCatalog.find((profile) => profile.ratedFlowLph === 750 && profile.powerW === 22 && profile.recommendedMaxL === 250 && profile.recommendedMinL === undefined)!;
    expect(profileSpecsText({ ...filter, ratedFlowLph: 1100 }, catalogTranslator("es", {}), texts, fmt)).toMatch(/^1,100 L\/h · 22 W · /);
    for (const profile of equipmentCatalog) expect(profileSpecsText(profile, catalogTranslator("es", {}), texts, fmt), profile.id).not.toMatch(/[çğıöşüÇĞİÖŞÜ]|saat|litre/);
  });

  it("ekipman çevirisi yüklenmiş dilde katalogdaki satırın çevirisi gösterilir; hacim kullanıcının biriminde (7. paket)", () => {
    const sera = equipmentCatalog.find((profile) => profile.id === "sera-fil-bioactive-130")!;
    const english = (fmt: typeof en.fmt) => (text: string) => equipmentText(text, enCatalogEquipment, fmt);
    expect(profileSpecsText(sera, english(en.fmt), en.texts, en.fmt)).toBe("Canister filter · 300 L/h · 11 W");
    expect(profileSpecsText(sera, (text) => equipmentText(text, esCatalogEquipment, createDisplayFormat("es", prefs)), messagesFor("es").equipment.specSummary, createDisplayFormat("es", prefs))).toBe("Filtro externo · 300 L/h · 11 W");
    const upTo = equipmentCatalog.find((profile) => / 30 litreye kadar(?: ·|$)/.test(profile.specifications))!;
    const gallons = createDisplayFormat("en", { ...prefs, volume: "gallons" });
    expect(profileSpecsText(upTo, english(en.fmt), en.texts, en.fmt)).toContain("up to 30 L");
    expect(profileSpecsText(upTo, english(gallons), en.texts, gallons)).toContain("up to 7.9 gal");
  });

  it("katalogda karşılığı olmayan ekipmanda kullanıcının yazdığı metin aynen kalır", () => {
    expect(equipmentSpecsText(undefined, "Kendi notum", en.translate, en.texts, en.fmt)).toBe("Kendi notum");
    expect(equipmentSpecsText(undefined, undefined, en.translate, en.texts, en.fmt)).toBe("");
  });
});
