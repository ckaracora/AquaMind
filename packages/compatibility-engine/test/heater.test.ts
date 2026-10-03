import { describe, expect, it } from "vitest";
import type { Aquarium, Equipment, Livestock } from "@aquamind/domain";
import { createAnalyzer, type EquipmentProfileInput, type KnowledgeResolver, type SpeciesProfileInput } from "../src";

// Kural seti 1.5.0: taban ısıtma kablosu gibi pasif ısıtıcı kayıtları ısıtıcı kapasitesine katılmaz
// (docs/DECISIONS/0011-katalog-entegrasyonu-2-taban-isiticisi.md).

const species: Record<string, SpeciesProfileInput> = {
  tropical: { id: "tropical", commonName: "Tropik tür", adultSizeCm: 4, wasteFactor: 0.5, minVolumeL: 40, minGroup: 1, temperature: [24, 28], ph: [6, 8], flow: "medium" },
};

const devices: Record<string, EquipmentProfileInput> = {
  // JBL PROTEMP b10 III gibi: üretici hacim aralığı var ama suyu ısıtan ana ısıtıcının yerine geçmez.
  substrate: { id: "substrate", category: "heater", brand: "Stub", model: "Taban 10", powerW: 10, recommendedMinL: 40, recommendedMaxL: 120, passiveComponent: true },
  heater: { id: "heater", category: "heater", brand: "Stub", model: "H100", powerW: 100, recommendedMinL: 50, recommendedMaxL: 250 },
};

const resolver: KnowledgeResolver = {
  speciesForLivestock: (item) => (item.catalogId ? species[item.catalogId] : undefined),
  profileForEquipment: (item) => (item.catalogId ? devices[item.catalogId] : undefined),
  isVerifiedSpeciesProfile: (profile) => profile !== undefined,
  isVerifiedEquipmentProfile: (profile) => profile !== undefined,
};
const analyze = createAnalyzer(resolver);

const tank: Aquarium = { id: "a", name: "Stub", type: "freshwater", lengthCm: 80, widthCm: 35, heightCm: 40, netVolumeLiters: 80, setupDate: "2026-01-01" };
const fish: Livestock = { id: "l-tropical", aquariumId: "a", catalogId: "tropical", commonName: "Tropik tür", category: "fish", quantity: 1, addedAt: "2026-01-01" };
const device = (catalogId: string): Equipment => ({ id: `e-${catalogId}`, aquariumId: "a", catalogId, category: "heater", installedAt: "2026-01-01" });
const heaterMetric = (ids: string[]) => analyze(tank, [fish], ids.map(device)).metrics.find((item) => item.key === "heater")!;

describe("ısıtıcı: taban ısıtma kablosu", () => {
  it("tek başına ısıtıcı sayılmaz; sonuç hiç ısıtıcı seçilmemiş gibidir", () => {
    expect(heaterMetric(["substrate"])).toEqual(heaterMetric([]));
    expect(heaterMetric(["substrate"]).detail).toBe("Katalogdan ısıtıcı bulunamadı");
  });

  it("gerçek ısıtıcının yanında hesabı değiştirmez", () => {
    expect(heaterMetric(["substrate", "heater"])).toEqual(heaterMetric(["heater"]));
    expect(heaterMetric(["heater"]).detail).toBe("Üretici hacim aralığı uygun");
  });
});
