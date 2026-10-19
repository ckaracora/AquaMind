import { describe, expect, it } from "vitest";
import type { HealthAnalysis } from "@aquamind/compatibility-engine";
import { messagesFor } from "@aquamind/localization";
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
    expect(rangeStatus(undefined, [22, 26])).toEqual({ key: "noReading", tone: "neutral" });
    expect(rangeStatus(25, undefined)).toEqual({ key: "noSpeciesData", tone: "neutral" });
    expect(rangeStatus(25, [22, 26])).toEqual({ key: "inRange", tone: "good" });
    expect(rangeStatus(30, [22, 26])).toEqual({ key: "outOfRange", tone: "danger" });
    expect(rangeStatus(25, [28, 24])).toEqual({ key: "speciesConflict", tone: "danger" });
  });
});

describe("nitrateStatus ve tdsStatus", () => {
  it("nitratı motorun su kalitesi kuralıyla etiketler", () => {
    expect(nitrateStatus(undefined, "freshwater").key).toBe("noReading");
    expect(nitrateStatus(reading({ nitrate: 10 }), "freshwater")).toEqual({ key: "inRange", tone: "good" });
    expect(nitrateStatus(reading({ nitrate: 80 }), "freshwater")).toEqual({ key: "mayBeHigh", tone: "warning" });
    expect(nitrateStatus(reading({ nitrate: 150 }), "freshwater")).toEqual({ key: "veryHigh", tone: "danger" });
    expect(nitrateStatus(reading({ nitrate: -5 }), "freshwater")).toEqual({ key: "invalidReading", tone: "warning" });
  });

  it("TDS'yi hiçbir zaman 'normal' diye etiketlemez", () => {
    expect(tdsStatus(undefined).key).toBe("noReading");
    expect(tdsStatus(180)).toEqual({ key: "informational", tone: "neutral" });
  });
});

describe("healthSummary", () => {
  it("özet cümlesini sağlık analizinin durumundan üretir", () => {
    // Her durumda hem renk hem ekrana giden cümle sınanır: acil durumda "sorun görünmüyor" cümlesi çıkmamalı.
    const text = (status: HealthAnalysis["status"], hasData = true) => messagesFor("tr").healthSummary[healthSummary(analysis(status), hasData).key];
    expect(healthSummary(analysis("good"), false)).toEqual({ key: "noData", tone: "neutral" });
    expect(healthSummary(analysis("danger"), true)).toEqual({ key: "danger", tone: "danger" });
    expect(healthSummary(analysis("warning"), true)).toEqual({ key: "warning", tone: "warning" });
    expect(healthSummary(analysis("good"), true)).toEqual({ key: "good", tone: "good" });
    expect(text("good", false)).toBe("Durum özeti için canlı ve su ölçümü ekle.");
    expect(text("danger")).toBe("Sağlık analizi acil ilgilenmen gereken bir durum gösteriyor.");
    expect(text("warning")).toBe("Sağlık analizinde dikkat gerektiren konular var.");
    expect(text("good")).toBe("Sağlık analizinde öne çıkan bir sorun görünmüyor.");
    expect(text("good")).not.toMatch(/her şey yolunda/);
  });
});

describe("durum metinleri", () => {
  it("anahtarların Türkçe metni ekranda eskiden yazan metinle aynı", () => {
    // Dil altyapısı 2b'de (docs/DECISIONS/0021-dil-altyapisi.md) etiketler koddan dil dosyasına taşındı; görünen metin değişmemeli.
    const t = messagesFor("tr");
    expect(t.waterStatus).toEqual({
      noReading: "Ölçüm yok", noSpeciesData: "Tür verisi yok", speciesConflict: "Türler uyuşmuyor", inRange: "Uygun", outOfRange: "Aralık dışında",
      invalidReading: "Geçersiz ölçüm", veryHigh: "Çok yüksek", mayBeHigh: "Yüksek olabilir", informational: "Bilgi amaçlı", pending: "…", unavailable: "Yüklenemedi",
    });
    expect(t.healthSummary).toEqual({
      noData: "Durum özeti için canlı ve su ölçümü ekle.",
      danger: "Sağlık analizi acil ilgilenmen gereken bir durum gösteriyor.",
      warning: "Sağlık analizinde dikkat gerektiren konular var.",
      good: "Sağlık analizinde öne çıkan bir sorun görünmüyor.",
    });
  });
});

describe("parameterStatuses ve latestReading", () => {
  it("su değeri kartlarını son ölçüme ve türlere göre etiketler (ana sayfa, akvaryum ve su sayfaları aynı kuralı kullanır)", () => {
    const neon = speciesById("neon-tetra")!;
    const statuses = parameterStatuses([animal("neon-tetra")], speciesForLivestock, reading({ temperature: neon.temperature[1] + 5, ph: neon.ph[0], nitrate: 10, specificGravity: 1.024 }), "freshwater");
    expect(statuses.temperature).toEqual({ key: "outOfRange", tone: "danger" });
    expect(statuses.ph).toEqual({ key: "inRange", tone: "good" });
    expect(statuses.nitrate).toEqual({ key: "inRange", tone: "good" });
    expect(statuses.tds).toEqual({ key: "noReading", tone: "neutral" });
    expect(statuses.specificGravity).toEqual({ key: "informational", tone: "neutral" });
  });

  it("ölçüm yokken hiçbir kart olumlu etiket taşımaz", () => {
    const statuses = parameterStatuses([animal("neon-tetra")], speciesForLivestock, undefined, "freshwater");
    expect(Object.values(statuses).map((status) => status.key)).toEqual(["noReading", "noReading", "noReading", "noReading", "noReading"]);
  });

  it("tür aralıkları henüz yokken sıcaklık ve pH bekleme ya da hata etiketi alır; katalog gerektirmeyen etiketler yine hesaplanır", () => {
    const latest = reading({ temperature: 25, ph: 7, nitrate: 10, tds: 180 });
    const loading = parameterStatuses([animal("neon-tetra")], undefined, latest, "freshwater");
    expect([loading.temperature, loading.ph]).toEqual([pendingStatus, pendingStatus]);
    expect([loading.nitrate.key, loading.tds.key]).toEqual(["inRange", "informational"]);
    const failed = parameterStatuses([animal("neon-tetra")], undefined, latest, "freshwater", unavailableStatus);
    expect([failed.temperature, failed.ph]).toEqual([{ key: "unavailable", tone: "warning" }, { key: "unavailable", tone: "warning" }]);
    // Ölçülmemiş değer için katalog beklenmez.
    expect(parameterStatuses([animal("neon-tetra")], undefined, reading({}), "freshwater", unavailableStatus).temperature.key).toBe("noReading");
  });

  it("en son ölçümü kayıt sırasına değil ölçüm tarihine göre seçer", () => {
    const older = { id: "eski", measuredAt: "2026-09-01T08:00:00.000Z" };
    const newer = { id: "yeni", measuredAt: "2026-09-20T08:00:00.000Z" };
    expect(latestReading([older, newer])?.id).toBe("yeni");
    expect(latestReading([newer, older])?.id).toBe("yeni");
    expect(latestReading([])).toBeUndefined();
  });
});
