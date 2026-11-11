import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { buildCatalogBucket } from "@/data/catalog-bucket-builders";
import {
  assertEquipmentRedirects, equipmentById, equipmentCatalog, equipmentForBrandInCategory, equipmentMatchesModelQuery, profileForEquipment,
  specificationsForEquipment, type EquipmentProfile,
} from "@/data/catalog-equipment";
import { speciesById } from "@/data/catalog-species";
import { loadCatalogSlice, type FetchCatalogJson } from "@/lib/catalog-slice";
import { analyzeAquarium } from "@/lib/health-analysis";
import { createHealthAnalyzer } from "@/lib/health-analysis-core";
import type { Aquarium, Equipment, Livestock } from "@/types/aquarium";

// Birleştirilen ekipman kaydı (2026-11-11, JBL PROTEMP S; docs/CATALOG_LOG.md, "2026-11-11 JBL PROTEMP S: aynı ürünün iki kaydı tek kayıt
// oldu"): katalogdan kaldırılan eski kimlik (`formerIds`) ve eski ya da öbür ülke adları (`aliases`) kanonik kayda gider. Kullanıcı kaydı
// değişmez; eşleme yalnız okuma anında yapılır.

const fromBuilders: FetchCatalogJson = async (path) => JSON.parse(JSON.stringify(buildCatalogBucket(path)));
/** Boy, katalogun 2026-10-30 adı, JBL ürün sayfasındaki hacim aralığı. */
const sizes = [["25", "26", 10, 50], ["50", "51", 30, 80], ["100", "101", 50, 160], ["150", "151", 90, 200], ["200", "201", 100, 300], ["300", "301", 160, 400]] as const;
const heater = (extra: Partial<Equipment>): Equipment => Object.freeze({ id: "h", aquariumId: "a", category: "heater", installedAt: "2026-08-20", ...extra });
const aquarium = (netVolumeLiters: number): Aquarium => ({ id: "a", name: "A", type: "freshwater", lengthCm: 80, widthCm: 35, heightCm: 40, netVolumeLiters, setupDate: "2026-01-01" });
const neon = speciesById("neon-tetra")!;
const animals: Livestock[] = [{ id: "l", aquariumId: "a", catalogId: neon.id, commonName: neon.commonName, category: neon.category, quantity: 8, addedAt: "2026-01-01" }];

describe("JBL PROTEMP S: eski kimlik ve eş ad yönlendirmesi", () => {
  it("eski kimlik kanonik kayda gider; eski kayıt katalogda ayrı satır değil", () => {
    for (const [size, former, minL, maxL] of sizes) {
      const canonical = equipmentById(`jbl-protemp-s-${former}`)!;
      expect(canonical.model).toBe(`PROTEMP S ${size}`);
      expect([canonical.recommendedMinL, canonical.recommendedMaxL]).toEqual([minL, maxL]);
      expect(equipmentById(`jbl-protemp-s${size}`)).toBe(canonical);
      expect(equipmentCatalog.some((profile) => profile.id === `jbl-protemp-s${size}`)).toBe(false);
    }
  });

  it("eski ve öbür adlar marka + model eşlemesinde kanonik kaydı bulur", () => {
    for (const [size, former] of sizes) {
      for (const model of [`ProTemp S ${size}`, `PROTEMP S ${size}`, `PROTEMP S ${former}`, `PROTEMP S${size}`, ` protemp  s ${former} `]) {
        expect(profileForEquipment(heater({ brand: "JBL", model }))?.id, model).toBe(`jbl-protemp-s-${former}`);
        expect(profileForEquipment(heater({ brand: " jbl ", model }))?.id, model).toBe(`jbl-protemp-s-${former}`);
      }
      // Marka olmadan eşleşme yok (önceki kural).
      expect(profileForEquipment(heater({ model: `PROTEMP S ${former}` }))).toBeUndefined();
    }
  });

  it("seçim listesinde her boy bir kez; eski ve öbür ülke adlarıyla arama kanonik kaydı bulur", () => {
    const choices = equipmentForBrandInCategory("heater", "JBL");
    const rodHeaters = choices.filter((profile) => /^protemp s ?\d/i.test(profile.model));
    expect(rodHeaters.map((profile) => profile.model)).toEqual(sizes.map(([size]) => `PROTEMP S ${size}`));
    const found = (query: string) => choices.filter((profile) => equipmentMatchesModelQuery(profile, query)).map((profile) => profile.id);
    expect(found("PROTEMP S 101")).toEqual(["jbl-protemp-s-101"]);
    expect(found("ProTemp S 100")).toEqual(["jbl-protemp-s-101"]);
    expect(found("S 201")).toEqual(["jbl-protemp-s-201"]);
    expect(found("s 26")).toEqual(["jbl-protemp-s-26"]);
    expect(found("S150")).toEqual(["jbl-protemp-s-151"]);
    // Aynı kayıt hem adıyla hem eş adıyla eşleşse de bir kez gelir.
    expect(found("PROTEMP S 1")).toEqual(["jbl-protemp-s-101", "jbl-protemp-s-151"]);
    // Eş adı olmayan kayıtta arama yalnız model adına bakar (önceki davranış).
    const plain: EquipmentProfile = { id: "x", category: "heater", brand: "X", model: "Isıtıcı 50", specifications: "" };
    expect(equipmentMatchesModelQuery(plain, "ISITICI")).toBe(true);
    expect(equipmentMatchesModelQuery(plain, "60")).toBe(false);
  });

  // Ekipman ekleme penceresi (src/app/equipment/page.tsx) listeyi ve seçimi aynı aramayla süzer; yalnız `item.model`'e bakan eski
  // arama "S 101" ya da "ProTemp S 100" yazınca boş liste veriyordu.
  it("ekleme penceresi model listesini ve seçimi eş adlara bakan aramayla süzer", () => {
    const page = readFileSync("src/app/equipment/page.tsx", "utf8");
    expect(page).toMatch(/import \{[^}]*\bequipmentMatchesModelQuery\b[^}]*\} from "@\/data\/catalog-equipment"/);
    expect(page).toContain("const visibleModels = models.filter(item => equipmentMatchesModelQuery(item, modelQuery));");
    expect(page).toContain("setSelected(models.find(item => equipmentMatchesModelQuery(item, next))?.id ?? \"\")");
    expect(page).not.toMatch(/item\.model\.toLocaleLowerCase\("tr-TR"\)\.includes/);
    // Pencerenin JBL ısıtıcı listesinde eski ve öbür ülke adları kanonik kaydı seçer.
    const models = equipmentForBrandInCategory("heater", "JBL");
    for (const [query, id] of [["S 101", "jbl-protemp-s-101"], ["ProTemp S 100", "jbl-protemp-s-101"], ["S 201", "jbl-protemp-s-201"], ["PROTEMP S25", "jbl-protemp-s-26"]] as const) {
      expect(models.find((item) => equipmentMatchesModelQuery(item, query))?.id, query).toBe(id);
    }
  });

  it("parça yükleyici eski kimliği ve eş adı tam katalogla aynı kayda bağlar", async () => {
    const equipment = sizes.flatMap(([size, former]) => [
      heater({ id: `old-${size}`, catalogId: `jbl-protemp-s${size}`, brand: "JBL", model: `ProTemp S ${size}` }),
      heater({ id: `alias-${size}`, brand: "JBL", model: `PROTEMP S ${former}` }),
      heater({ id: `manual-${size}`, brand: "JBL", model: `PROTEMP S${size}` }),
    ]);
    const slice = await loadCatalogSlice([], equipment, fromBuilders);
    for (const item of equipment) {
      expect(slice.profileForEquipment(item), item.id).toEqual(profileForEquipment(item));
      expect(slice.profileForEquipment(item)?.id, item.id).toMatch(/^jbl-protemp-s-\d+$/);
    }
  });

  it("eski kimlikli kullanıcı kaydı değişmeden kanonik değerlerle hesaplanır", async () => {
    for (const [size, former, minL, maxL] of sizes) {
      const old = heater({ catalogId: `jbl-protemp-s${size}`, brand: "JBL", model: `ProTemp S ${size}`, specifications: `Ayarlı ısıtıcı · ${size} W` });
      const canonical = heater({ catalogId: `jbl-protemp-s-${former}`, brand: "JBL", model: `PROTEMP S ${size}` });
      for (const volume of [minL, maxL, maxL + 1, Math.max(1, minL - 1)]) {
        const before = JSON.stringify(old);
        const oldResult = analyzeAquarium(aquarium(volume), animals, [old]);
        const canonicalResult = analyzeAquarium(aquarium(volume), animals, [canonical]);
        // Puan, durum, ölçütler ve uyarılar kanonik kimlikli kayıtla birebir aynı.
        expect(oldResult, `${size} / ${volume} L`).toEqual(canonicalResult);
        expect(oldResult.metrics.some((metric) => metric.key === "heater" && metric.detailCode !== "heaterUnverified" && metric.detailCode !== "noHeater"), `${size} / ${volume} L`).toBe(true);
        // Tarayıcıdaki parça yükleyiciyle aynı sonuç.
        const slice = await loadCatalogSlice(animals, [old], fromBuilders);
        expect(createHealthAnalyzer(slice)(aquarium(volume), animals, [old]), `${size} / ${volume} L`).toEqual(oldResult);
        expect(JSON.stringify(old)).toBe(before);
      }
      // Kartta kanonik açıklama; kayıttaki eski metin silinmez.
      expect(specificationsForEquipment(old)).toBe(equipmentById(`jbl-protemp-s-${former}`)!.specifications);
      expect(old.specifications).toBe(`Ayarlı ısıtıcı · ${size} W`);
    }
  });

  it("eski S 100 kaydı 70 litrede artık üretici aralığına uyar (eski kaynaksız 90–150 L yerine 50–160 L)", () => {
    const old = heater({ catalogId: "jbl-protemp-s100", brand: "JBL", model: "ProTemp S 100" });
    const metric = analyzeAquarium(aquarium(70), animals, [old]).metrics.find((item) => item.key === "heater");
    expect(metric?.detailCode).toBe("manufacturerOk");
    expect(metric?.score).toBe(95);
  });
});

describe("eski kimlik ve eş ad denetimi", () => {
  const profile = (extra: Partial<EquipmentProfile>): EquipmentProfile => ({ id: "a", category: "heater", brand: "X", model: "A 1", specifications: "s", ...extra });

  it("katalog ve geçerli örnek denetimden geçer", () => {
    expect(() => assertEquipmentRedirects(equipmentCatalog)).not.toThrow();
    expect(() => assertEquipmentRedirects([profile({ formerIds: ["a-old"], aliases: ["A 2"] }), profile({ id: "b", model: "B 1" })])).not.toThrow();
    // Başka markada aynı ad serbest: marka + model anahtarı markaya bakar.
    expect(() => assertEquipmentRedirects([profile({ aliases: ["B 1"] }), profile({ id: "b", brand: "Y", model: "B 1" })])).not.toThrow();
  });

  it("eski kimlik katalogdaki bir kimlikse (başka kayda ya da kendine yönlenme, zincir) hata verir", () => {
    expect(() => assertEquipmentRedirects([profile({ formerIds: ["b"] }), profile({ id: "b", model: "B 1" })])).toThrow(/katalogda kayıtlı/);
    expect(() => assertEquipmentRedirects([profile({ formerIds: ["a"] })])).toThrow(/katalogda kayıtlı/);
    expect(() => assertEquipmentRedirects([profile({ formerIds: ["b"] }), profile({ id: "b", model: "B 1", formerIds: ["c"] })])).toThrow(/katalogda kayıtlı/);
  });

  it("aynı eski kimlik iki kez yönlenirse ya da biçimi bozuksa hata verir", () => {
    expect(() => assertEquipmentRedirects([profile({ formerIds: ["old"] }), profile({ id: "b", model: "B 1", formerIds: ["old"] })])).toThrow(/iki kez/);
    expect(() => assertEquipmentRedirects([profile({ formerIds: ["old", "old"] })])).toThrow(/iki kez/);
    expect(() => assertEquipmentRedirects([profile({ formerIds: [""] })])).toThrow(/Geçersiz/);
    expect(() => assertEquipmentRedirects([profile({ formerIds: [" old"] })])).toThrow(/Geçersiz/);
  });

  it("eş ad aynı markadaki bir kaydın adıyla (kategori fark etmez, biçim farkı yok sayılır) ya da kendi adıyla aynıysa hata verir", () => {
    expect(() => assertEquipmentRedirects([profile({ aliases: ["B 1"] }), profile({ id: "b", category: "filter", model: " b  1 " })])).toThrow(/çakışıyor/);
    expect(() => assertEquipmentRedirects([profile({ aliases: ["a  1"] })])).toThrow(/kendi model/);
  });

  it("aynı eş ad iki kayıtta ya da boşsa hata verir", () => {
    expect(() => assertEquipmentRedirects([profile({ aliases: ["Z 9"] }), profile({ id: "b", model: "B 1", aliases: ["z 9"] })])).toThrow(/iki kayıtta/);
    expect(() => assertEquipmentRedirects([profile({ aliases: [" "] })])).toThrow(/Boş/);
  });
});


describe("önceki nesil Oase kullanıcı kaydı", () => {
  it("demo BioMaster² kullansa da eski neslin kimliği ve adı değer üretmez, kullanıcı kaydı değişmez", async () => {
    for (const size of [250, 350, 600]) {
      for (const catalogId of [`oase-biomaster-${size}`, undefined]) {
        const old: Equipment = Object.freeze({ id: "old-filter", aquariumId: "a", category: "filter", catalogId, brand: "Oase", model: `BioMaster ${size}`, installedAt: "2026-08-20" });
        const before = JSON.stringify(old);
        const profile = profileForEquipment(old);
        expect(profile?.id).toBe(`oase-biomaster-${size}`);
        expect(profile?.ratedFlowLph).toBeUndefined();
        expect(profile?.powerW).toBeUndefined();
        expect(profile?.recommendedMaxL).toBeUndefined();
        const result = analyzeAquarium(aquarium(200), animals, [old]);
        expect(result.metrics.find((metric) => metric.key === "filter")?.detailCode).toBe("flowUnverified");
        expect(result.warnings.some((warning) => warning.code === "missingCapacity")).toBe(true);
        const slice = await loadCatalogSlice(animals, [old], fromBuilders);
        expect(createHealthAnalyzer(slice)(aquarium(200), animals, [old])).toEqual(result);
        expect(JSON.stringify(old)).toBe(before);
      }
    }
  });
});
