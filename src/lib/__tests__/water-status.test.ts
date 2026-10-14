import { describe, expect, it } from "vitest";
import type { HealthAnalysis } from "@aquamind/compatibility-engine";
import { speciesById, speciesForLivestock } from "@/data/catalog";
import type { Livestock } from "@/types/aquarium";
import { commonSpeciesRanges, healthSummary, latestReading, nitrateStatus, parameterStatuses, pendingStatus, rangeStatus, tdsStatus, unavailableStatus } from "@/lib/water-status";

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

describe("parameterStatuses ve latestReading", () => {
  it("su değeri kartlarını son ölçüme ve türlere göre etiketler (ana sayfa, akvaryum ve su sayfaları aynı kuralı kullanır)", () => {
    const neon = speciesById("neon-tetra")!;
    const statuses = parameterStatuses([animal("neon-tetra")], speciesForLivestock, reading({ temperature: neon.temperature[1] + 5, ph: neon.ph[0], nitrate: 10, specificGravity: 1.024 }), "freshwater");
    expect(statuses.temperature).toEqual({ label: "Aralık dışında", tone: "danger" });
    expect(statuses.ph).toEqual({ label: "Uygun", tone: "good" });
    expect(statuses.nitrate).toEqual({ label: "Uygun", tone: "good" });
    expect(statuses.tds).toEqual({ label: "Ölçüm yok", tone: "neutral" });
    expect(statuses.specificGravity).toEqual({ label: "Bilgi amaçlı", tone: "neutral" });
  });

  it("ölçüm yokken hiçbir kart olumlu etiket taşımaz", () => {
    const statuses = parameterStatuses([animal("neon-tetra")], speciesForLivestock, undefined, "freshwater");
    expect(Object.values(statuses).map((status) => status.label)).toEqual(["Ölçüm yok", "Ölçüm yok", "Ölçüm yok", "Ölçüm yok", "Ölçüm yok"]);
  });

  it("tür aralıkları henüz yokken sıcaklık ve pH bekleme ya da hata etiketi alır; katalog gerektirmeyen etiketler yine hesaplanır", () => {
    const latest = reading({ temperature: 25, ph: 7, nitrate: 10, tds: 180 });
    const loading = parameterStatuses([animal("neon-tetra")], undefined, latest, "freshwater");
    expect([loading.temperature, loading.ph]).toEqual([pendingStatus, pendingStatus]);
    expect([loading.nitrate.label, loading.tds.label]).toEqual(["Uygun", "Bilgi amaçlı"]);
    const failed = parameterStatuses([animal("neon-tetra")], undefined, latest, "freshwater", unavailableStatus);
    expect([failed.temperature, failed.ph]).toEqual([{ label: "Yüklenemedi", tone: "warning" }, { label: "Yüklenemedi", tone: "warning" }]);
    // Ölçülmemiş değer için katalog beklenmez.
    expect(parameterStatuses([animal("neon-tetra")], undefined, reading({}), "freshwater", unavailableStatus).temperature.label).toBe("Ölçüm yok");
  });

  it("en son ölçümü kayıt sırasına değil ölçüm tarihine göre seçer", () => {
    const older = { id: "eski", measuredAt: "2026-09-01T08:00:00.000Z" };
    const newer = { id: "yeni", measuredAt: "2026-09-20T08:00:00.000Z" };
    expect(latestReading([older, newer])?.id).toBe("yeni");
    expect(latestReading([newer, older])?.id).toBe("yeni");
    expect(latestReading([])).toBeUndefined();
  });
});
