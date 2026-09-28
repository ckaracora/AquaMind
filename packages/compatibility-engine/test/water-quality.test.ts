import { describe, expect, it } from "vitest";
import type { WaterParameters } from "@aquamind/domain";
import { assessWaterQuality, unionizedAmmoniaFraction } from "../src/water-quality";

const reading = (values: Partial<WaterParameters>): WaterParameters => ({ id: "w", aquariumId: "a", measuredAt: "2026-09-26", ...values });

describe("unionizedAmmoniaFraction", () => {
  // Florida DEP SOP, Ek II tablosundaki yüzde değerleri (Thurston ve ark.).
  it.each([
    [8.3, 18.5, 6.63],
    [7.0, 25.0, 0.566],
    [7.5, 20.0, 1.24],
    [8.0, 28.0, 6.56],
    [6.5, 15.5, 0.0898],
    [9.0, 30.0, 44.6],
  ])("pH %s ve %s °C için yayımlanmış tabloyla uyuşur (%%%s)", (ph, temperature, percent) => {
    expect(unionizedAmmoniaFraction(ph, temperature) * 100).toBeCloseTo(percent, percent < 1 ? 3 : 1);
  });
});

describe("assessWaterQuality — amonyak", () => {
  it("sıfır amonyak uygundur", () => {
    expect(assessWaterQuality(reading({ ammonia: 0, ph: 7, temperature: 25 }), "freshwater").ammonia?.level).toBe("ok");
  });

  it("serbest amonyak sınırın altındaysa bile sıfırın üstü uyarıdır", () => {
    // pH 7 ve 25 °C'de 2 ppm toplam amonyağın serbest kısmı ≈ 0,0113 ppm < 0,02.
    const result = assessWaterQuality(reading({ ammonia: 2, ph: 7, temperature: 25 }), "freshwater").ammonia!;
    expect(result.level).toBe("warning");
    expect(result.free).toBeCloseTo(0.0113, 4);
    expect(result.worstCase).toBe(false);
  });

  it("serbest amonyak tatlı su sınırını (0,02) aşarsa tehlikedir", () => {
    // pH 8 ve 26 °C'de kesir ≈ %5,75; 1 ppm toplam → ≈ 0,0575 ppm serbest.
    expect(assessWaterQuality(reading({ ammonia: 1, ph: 8, temperature: 26 }), "freshwater").ammonia?.level).toBe("danger");
  });

  it("deniz ve acı suda daha sıkı sınır (0,01) kullanılır", () => {
    // pH 8,2 ve 25 °C'de kesir ≈ %8,27; 0,15 ppm toplam → ≈ 0,0124 ppm serbest.
    const values = reading({ ammonia: 0.15, ph: 8.2, temperature: 25 });
    expect(assessWaterQuality(values, "freshwater").ammonia?.level).toBe("warning");
    expect(assessWaterQuality(values, "saltwater").ammonia?.level).toBe("danger");
    expect(assessWaterQuality(values, "brackish").ammonia?.level).toBe("danger");
  });

  it("pH veya sıcaklık yoksa toplam amonyağın tamamı zehirli sayılır (en kötü durum)", () => {
    const withoutPh = assessWaterQuality(reading({ ammonia: 0.05, temperature: 25 }), "freshwater").ammonia!;
    expect(withoutPh.worstCase).toBe(true);
    expect(withoutPh.level).toBe("danger");
    expect(assessWaterQuality(reading({ ammonia: 0.01 }), "freshwater").ammonia?.level).toBe("warning");
  });
});

describe("assessWaterQuality — nitrit ve nitrat", () => {
  it("nitrit: 0 uygun, sınıra kadar uyarı, sınırın üstü tehlike", () => {
    expect(assessWaterQuality(reading({ nitrite: 0 }), "freshwater").nitrite?.level).toBe("ok");
    expect(assessWaterQuality(reading({ nitrite: 0.2 }), "freshwater").nitrite?.level).toBe("warning");
    expect(assessWaterQuality(reading({ nitrite: 0.25 }), "freshwater").nitrite?.level).toBe("danger");
    expect(assessWaterQuality(reading({ nitrite: 0.15 }), "saltwater").nitrite?.level).toBe("danger");
  });

  it("tatlı su nitratı: 50'ye kadar uygun, 100'e kadar uyarı, üstü tehlike", () => {
    expect(assessWaterQuality(reading({ nitrate: 50 }), "freshwater").nitrate?.level).toBe("ok");
    expect(assessWaterQuality(reading({ nitrate: 80 }), "freshwater").nitrate?.level).toBe("warning");
    expect(assessWaterQuality(reading({ nitrate: 120 }), "brackish").nitrate?.level).toBe("danger");
  });

  it("deniz nitratı: 100'e kadar uygun, üstü tehlike", () => {
    expect(assessWaterQuality(reading({ nitrate: 80 }), "saltwater").nitrate?.level).toBe("ok");
    expect(assessWaterQuality(reading({ nitrate: 101 }), "saltwater").nitrate?.level).toBe("danger");
  });

  it("ölçüm yoksa değerlendirme yapılmaz", () => {
    expect(assessWaterQuality(undefined, "freshwater")).toEqual({ invalid: [] });
    expect(assessWaterQuality(reading({ temperature: 25 }), "freshwater")).toEqual({ invalid: [] });
  });
});

describe("assessWaterQuality — geçersiz değerler", () => {
  it("negatif amonyak, nitrit ve nitrat değerlendirilmez ve 'uygun' sayılmaz", () => {
    const result = assessWaterQuality(reading({ ammonia: -1, nitrite: -0.1, nitrate: -5, ph: 7, temperature: 25 }), "freshwater");
    expect(result.ammonia).toBeUndefined();
    expect(result.nitrite).toBeUndefined();
    expect(result.nitrate).toBeUndefined();
    expect(result.invalid).toEqual(["ammonia", "nitrite", "nitrate"]);
  });

  it("sıfır geçerli sınırdır; sayı olmayan ve sonsuz değer geçersizdir", () => {
    const zero = assessWaterQuality(reading({ ammonia: 0, nitrite: 0, nitrate: 0, ph: 7, temperature: 25 }), "freshwater");
    expect([zero.ammonia?.level, zero.nitrite?.level, zero.nitrate?.level]).toEqual(["ok", "ok", "ok"]);
    expect(zero.invalid).toEqual([]);
    expect(assessWaterQuality(reading({ nitrite: Number.NaN }), "freshwater").invalid).toEqual(["nitrite"]);
    const infinite = assessWaterQuality(reading({ ammonia: Infinity, nitrate: -Infinity }), "freshwater");
    expect(infinite.ammonia).toBeUndefined();
    expect(infinite.nitrate).toBeUndefined();
    expect(infinite.invalid).toEqual(["ammonia", "nitrate"]);
  });

  it("negatif pH veya sıcaklıkla serbest amonyak hesaplanmaz; en kötü durum kullanılır", () => {
    // pH -1 formüle girseydi kesir ≈ 0 çıkar ve 2 ppm amonyak yalnızca uyarı olurdu.
    for (const values of [{ ph: -1, temperature: 25 }, { ph: 7, temperature: -5 }]) {
      const ammonia = assessWaterQuality(reading({ ammonia: 2, ...values }), "freshwater").ammonia!;
      expect(ammonia.worstCase).toBe(true);
      expect(ammonia.level).toBe("danger");
    }
  });
});
