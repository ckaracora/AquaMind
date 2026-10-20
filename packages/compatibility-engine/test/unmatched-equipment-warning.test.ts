import { describe, expect, it } from "vitest";
import type { Aquarium, Equipment, Livestock } from "@aquamind/domain";
import { createAnalyzer, type EquipmentProfileInput, type KnowledgeResolver, type SpeciesProfileInput } from "../src";

// Kural seti 1.9.0: "Katalogla eşleşmeyen ekipman kaydı var" uyarısı yalnızca güvenlik hesabına giren türlerde çıkar
// (docs/DECISIONS/0018-eslesmeyen-ekipman-uyarisi.md).

const species: Record<string, SpeciesProfileInput> = {
  tropical: { id: "tropical", commonName: "Tropik tür", adultSizeCm: 4, wasteFactor: 0.5, minVolumeL: 40, minGroup: 1, temperature: [24, 28], ph: [6, 8], flow: "medium" },
};

const devices: Record<string, EquipmentProfileInput> = {
  verifiedFilter: { id: "verifiedFilter", category: "filter", brand: "Stub", model: "F400", ratedFlowLph: 400 },
  spongeFilter: { id: "spongeFilter", category: "filter", brand: "Stub", model: "Pipo", requiresAirPump: true },
  verifiedHeater: { id: "verifiedHeater", category: "heater", brand: "Stub", model: "H100", powerW: 100 },
};

const resolver: KnowledgeResolver = {
  speciesForLivestock: (item) => (item.catalogId ? species[item.catalogId] : undefined),
  profileForEquipment: (item) => (item.catalogId ? devices[item.catalogId] : undefined),
  isVerifiedSpeciesProfile: (profile) => profile !== undefined,
  isVerifiedEquipmentProfile: (profile) => profile !== undefined,
};
const analyze = createAnalyzer(resolver);

const TITLE = "Katalogla eşleşmeyen ekipman kaydı var";
const tank: Aquarium = { id: "a", name: "Stub", type: "freshwater", lengthCm: 80, widthCm: 35, heightCm: 40, netVolumeLiters: 100, setupDate: "2026-01-01" };
const fish: Livestock = { id: "l-tropical", aquariumId: "a", catalogId: "tropical", commonName: "Tropik tür", category: "fish", quantity: 1, addedAt: "2026-01-01" };
const listed = (catalogId: string): Equipment => ({ id: `e-${catalogId}`, aquariumId: "a", category: devices[catalogId].category, catalogId, installedAt: "2026-01-01" });
const unlisted = (category: Equipment["category"], extra: Partial<Equipment> = {}): Equipment => ({ id: `e-unlisted-${category}`, aquariumId: "a", category, brand: "Listede", model: `Yok ${category}`, installedAt: "2026-01-01", ...extra });
const run = (equipment: Equipment[]) => analyze(tank, [fish], equipment);
const warning = (result: ReturnType<typeof run>) => result.warnings.find((entry) => entry.title === TITLE);
const notCalculated = ["lighting", "co2", "uv", "dosing_pump", "other"] as const;

describe("katalogla eşleşmeyen ekipman uyarısı (1.9.0)", () => {
  const base = [listed("verifiedFilter"), listed("verifiedHeater")];

  it("hesaba girmeyen türde listede olmayan cihaz uyarı üretmez ve sonucu hiç değiştirmez", () => {
    const expected = run(base);
    expect(warning(expected)).toBeUndefined();
    for (const category of notCalculated) expect(run([...base, unlisted(category)]), category).toStrictEqual(expected);
    expect(run([...base, ...notCalculated.map((category) => unlisted(category))])).toStrictEqual(expected);
  });

  it("listede olmayan filtre ve ısıtıcı uyarı üretir", () => {
    expect(warning(run([unlisted("filter")]))?.message).toBe("1 ekipmanın kapasitesi tanınmadığı için filtrasyon veya ısıtıcı hesabına dahil edilmedi.");
    expect(warning(run([listed("verifiedFilter"), unlisted("heater")]))?.message).toBe("1 ekipmanın kapasitesi tanınmadığı için filtrasyon veya ısıtıcı hesabına dahil edilmedi.");
  });

  it("uyarıdaki sayı yalnızca hesaba giren türleri sayar", () => {
    const result = run([unlisted("filter"), unlisted("heater"), ...notCalculated.map((category) => unlisted(category))]);
    expect(warning(result)).toEqual({ level: "warning", title: TITLE, message: "2 ekipmanın kapasitesi tanınmadığı için filtrasyon veya ısıtıcı hesabına dahil edilmedi.", code: "unmatchedEquipment", params: { count: 2 } });
  });

  it("listede olmayan hava motoru yalnızca hava motoruyla çalışan filtre varken uyarı üretir", () => {
    expect(warning(run([...base, unlisted("air_pump")]))).toBeUndefined();
    expect(warning(run([listed("spongeFilter"), listed("verifiedHeater"), unlisted("air_pump")]))?.message).toBe("1 ekipmanın kapasitesi tanınmadığı için filtrasyon veya ısıtıcı hesabına dahil edilmedi.");
  });

  it("değeri elle girilen listede olmayan cihaz uyarı üretmez (1.8.0 kuralı sürer)", () => {
    expect(warning(run([unlisted("filter", { userRatedFlowLph: 400 }), unlisted("heater", { userPowerW: 100 })]))).toBeUndefined();
    expect(warning(run([unlisted("filter", { userRatedFlowLph: 400 }), unlisted("heater")]))?.message).toMatch(/^1 ekipmanın/);
  });

  it("listede olmayan filtre veri güvenini düşürür, listede olmayan lamba düşürmez", () => {
    const confidence = (result: ReturnType<typeof run>) => result.metrics.find((entry) => entry.key === "confidence")!.score;
    expect(confidence(run([...base, unlisted("lighting")]))).toBe(100);
    expect(confidence(run([...base, unlisted("filter")]))).toBeLessThan(100);
  });
});
