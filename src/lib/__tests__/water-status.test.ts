import { describe, expect, it } from "vitest";
import type { HealthAnalysis } from "@aquamind/compatibility-engine";
import { speciesById, speciesForLivestock } from "@/data/catalog";
import type { Livestock } from "@/types/aquarium";
import { commonSpeciesRanges, healthSummary, nitrateStatus, rangeStatus, tdsStatus } from "@/lib/water-status";

const animal = (id: string): Livestock => {
  const profile = speciesById(id)!;
  return { id, aquariumId: "a", catalogId: id, commonName: profile.commonName, category: profile.category, quantity: 1, addedAt: "2026-01-01" };
};
const reading = (values: object) => ({ id: "w", aquariumId: "a", measuredAt: "2026-09-26", ...values });
const analysis = (status: HealthAnalysis["status"]): HealthAnalysis => ({ score: 0, status, metrics: [], warnings: [] });

describe("commonSpeciesRanges", () => {
  it("türlerin ortak sıcaklık ve pH aralığını verir", () => {
    const neon = speciesById("neon-tetra")!;
    const cory = speciesById("corydoras-panda")!;
    const ranges = commonSpeciesRanges([animal("neon-tetra"), animal("corydoras-panda")], speciesForLivestock);
    expect(ranges.temperature).toEqual([Math.max(neon.temperature[0], cory.temperature[0]), Math.min(neon.temperature[1], cory.temperature[1])]);
    expect(ranges.ph).toEqual([Math.max(neon.ph[0], cory.ph[0]), Math.min(neon.ph[1], cory.ph[1])]);
  });

  it("canlı yoksa aralık vermez", () => {
    expect(commonSpeciesRanges([], speciesForLivestock)).toEqual({});
  });
});

describe("rangeStatus", () => {
  it("ölçüm, tür verisi, uyum ve çakışma durumlarını ayırır", () => {
    expect(rangeStatus(undefined, [22, 26])).toEqual({ label: "Ölçüm yok", tone: "neutral" });
    expect(rangeStatus(25, undefined)).toEqual({ label: "Tür verisi yok", tone: "neutral" });
    expect(rangeStatus(25, [22, 26])).toEqual({ label: "Uygun", tone: "good" });
    expect(rangeStatus(30, [22, 26])).toEqual({ label: "Aralık dışında", tone: "danger" });
    expect(rangeStatus(25, [28, 24])).toEqual({ label: "Türler uyuşmuyor", tone: "danger" });
  });
});

describe("nitrateStatus ve tdsStatus", () => {
  it("nitratı motorun su kalitesi kuralıyla etiketler", () => {
    expect(nitrateStatus(undefined, "freshwater").label).toBe("Ölçüm yok");
    expect(nitrateStatus(reading({ nitrate: 10 }), "freshwater")).toEqual({ label: "Uygun", tone: "good" });
    expect(nitrateStatus(reading({ nitrate: 80 }), "freshwater")).toEqual({ label: "Yüksek olabilir", tone: "warning" });
    expect(nitrateStatus(reading({ nitrate: 150 }), "freshwater")).toEqual({ label: "Çok yüksek", tone: "danger" });
    expect(nitrateStatus(reading({ nitrate: -5 }), "freshwater")).toEqual({ label: "Geçersiz ölçüm", tone: "warning" });
  });

  it("TDS'yi hiçbir zaman 'normal' diye etiketlemez", () => {
    expect(tdsStatus(undefined).label).toBe("Ölçüm yok");
    expect(tdsStatus(180)).toEqual({ label: "Bilgi amaçlı", tone: "neutral" });
  });
});

describe("healthSummary", () => {
  it("özet cümlesini sağlık analizinin durumundan üretir", () => {
    expect(healthSummary(analysis("good"), false).tone).toBe("neutral");
    expect(healthSummary(analysis("danger"), true).tone).toBe("danger");
    expect(healthSummary(analysis("warning"), true).tone).toBe("warning");
    expect(healthSummary(analysis("good"), true).text).not.toMatch(/her şey yolunda/);
  });
});
