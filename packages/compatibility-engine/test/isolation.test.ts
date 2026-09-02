import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import type { Aquarium, Equipment, Livestock } from "@aquamind/domain";
import { ENGINE_VERSION, RULESET_VERSION, createAnalyzer, type EquipmentProfileInput, type KnowledgeResolver, type SpeciesProfileInput } from "../src";

// Motor, katalog modülünü içe aktarmadan yalnızca çözümleyici üzerinden çalışmalıdır.
// Bu test gerçek kataloğa dokunmaz; küçük bir stub çözümleyici kullanır.

const species: Record<string, SpeciesProfileInput> = {
  small: { id: "small", commonName: "Küçük tür", adultSizeCm: 3, minVolumeL: 40, minTankLengthCm: 50, minGroup: 6, temperature: [22, 26], ph: [6, 7.5], flow: "low", wasteFactor: 0.5 },
  hunter: { id: "hunter", commonName: "Avcı tür", adultSizeCm: 20, minVolumeL: 200, minTankLengthCm: 100, minGroup: 1, temperature: [24, 28], ph: [6.5, 7.5], flow: "medium", wasteFactor: 2, predatory: true },
};

const devices: Record<string, EquipmentProfileInput> = {
  filter: { id: "filter", category: "filter", brand: "Stub", model: "F1", ratedFlowLph: 600 },
  heater: { id: "heater", category: "heater", brand: "Stub", model: "H1", powerW: 100 },
};

const resolver: KnowledgeResolver = {
  speciesForLivestock: (item) => (item.catalogId ? species[item.catalogId] : undefined),
  profileForEquipment: (item) => (item.catalogId ? devices[item.catalogId] : undefined),
  isVerifiedSpeciesProfile: (profile) => profile !== undefined,
  isVerifiedEquipmentProfile: (profile) => profile !== undefined,
};

const aquarium: Aquarium = { id: "a", name: "Stub", type: "freshwater", lengthCm: 100, widthCm: 40, heightCm: 50, netVolumeLiters: 160, setupDate: "2026-01-01" };
const animal = (catalogId: string, quantity: number): Livestock => ({ id: `l-${catalogId}`, aquariumId: "a", catalogId, commonName: species[catalogId].commonName, category: "fish", quantity, addedAt: "2026-01-01" });
const device = (catalogId: string): Equipment => ({ id: `e-${catalogId}`, aquariumId: "a", catalogId, category: devices[catalogId].category, installedAt: "2026-01-01" });

describe("uyumluluk motoru sınırı", () => {
  const analyze = createAnalyzer(resolver);

  it("katalog modüllerini içe aktarmaz", () => {
    const source = readFileSync(fileURLToPath(new URL("../src/index.ts", import.meta.url)), "utf8");
    expect(source).not.toMatch(/from\s+["']@\//);
    expect(source).not.toMatch(/data\/catalog/);
    expect(source).not.toMatch(/mock-data/);
  });

  it("stub çözümleyiciyle sekiz metrik ve genel puan üretir", () => {
    const analysis = analyze(aquarium, [animal("small", 8)], [device("filter"), device("heater")]);
    expect(analysis.metrics.map((metric) => metric.key)).toEqual(["load", "space", "social", "compatibility", "filter", "heater", "water", "confidence"]);
    expect(analysis.score).toBeGreaterThanOrEqual(0);
    expect(analysis.score).toBeLessThanOrEqual(100);
    expect(["good", "warning", "danger"]).toContain(analysis.status);
    expect(analysis.metrics.find((metric) => metric.key === "confidence")?.score).toBe(100);
  });

  it("çözümleyicinin verdiği yırtıcılık bilgisini avlanma uyarısına çevirir", () => {
    const analysis = analyze(aquarium, [animal("hunter", 1), animal("small", 8)], []);
    expect(analysis.warnings.map((warning) => warning.title)).toContain("Küçük tür için avlanma riski");
    expect(analysis.metrics.find((metric) => metric.key === "compatibility")?.status).toBe("danger");
  });

  it("çözümleyicinin tanımadığı kayıtları hesaba katmaz ve uyarır", () => {
    const analysis = analyze(aquarium, [{ ...animal("small", 8), catalogId: "unknown" }], []);
    expect(analysis.warnings.map((warning) => warning.title)).toContain("Katalogla eşleşmeyen canlı kaydı var");
  });

  it("sonuç nesnesine sürüm alanı eklemez; sürümler ayrı sabitlerdir", () => {
    const analysis = analyze(aquarium, [], []);
    expect(Object.keys(analysis).sort()).toEqual(["metrics", "score", "status", "warnings"]);
    expect(ENGINE_VERSION).toMatch(/^\d+\.\d+\.\d+$/);
    expect(RULESET_VERSION).toMatch(/^\d+\.\d+\.\d+$/);
  });
});
