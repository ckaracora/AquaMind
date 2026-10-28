import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import type { Aquarium, Equipment, Plant, WaterParameters } from "@aquamind/domain";
import { assessPlants, type PlantProfileInput } from "../src/plants";

// Motor 1.11.0: bitki uyarıları (docs/DECISIONS/0025-bitki-uyarilari.md). Stub kayıtlarla sınanır.

const tank: Aquarium = { id: "a", name: "Stub", type: "freshwater", lengthCm: 60, widthCm: 30, heightCm: 36, netVolumeLiters: 54, setupDate: "2026-01-01" };
const profiles: Record<string, PlantProfileInput> = {
  carpet: { id: "carpet", scientificName: "Hemianthus callitrichoides", light: ["medium", "high"], co2: "high", heightCm: 3, temperature: [20, 28], ph: [5, 7] },
  easy: { id: "easy", scientificName: "Anubias barteri", light: ["low", "high"], co2: "low", heightCm: 30, temperature: [22, 28], ph: [6, 7.5] },
  tall: { id: "tall", scientificName: "Vallisneria gigantea", light: ["low", "medium"], co2: "low", heightCm: 100 },
  bright: { id: "bright", scientificName: "Rotala macrandra", light: ["high", "high"], co2: "medium" },
  bare: { id: "bare", scientificName: "Kaynağı boş bitki" },
};
// Kaydın adı varsayılan olarak kaynaktaki bilimsel ad; kullanıcının verdiği ad ayrıca sınanır.
const plant = (id: string, name = profiles[id].scientificName): Plant => ({ id: `p-${id}`, aquariumId: "a", name, quantity: 1, addedAt: "2026-01-01", catalogId: id });
const entry = (id: string, name?: string) => ({ plant: plant(id, name), profile: profiles[id] });
const device = (category: Equipment["category"]): Equipment => ({ id: `e-${category}`, aquariumId: "a", category, installedAt: "2026-01-01" });
const reading = (values: Partial<WaterParameters>): WaterParameters => ({ id: "w", aquariumId: "a", measuredAt: "2026-10-01T10:00:00Z", ...values });
const codes = (warnings: ReturnType<typeof assessPlants>) => warnings.map((warning) => `${warning.plantId}:${warning.code}:${warning.level}`);

describe("bitki uyarıları", () => {
  it("yüksek CO₂ isteyen bitki: CO₂ ekipmanı yoksa uyarı, varsa uyarı yok", () => {
    const without = assessPlants(tank, [entry("carpet")], [device("lighting")]);
    expect(codes(without)).toEqual(["p-carpet:plantCo2:warning"]);
    expect(without[0]).toMatchObject({ params: { name: "Hemianthus callitrichoides" }, title: "Hemianthus callitrichoides yüksek CO₂ ister" });
    expect(without[0].message).toContain("15–25 mg/L");
    expect(assessPlants(tank, [entry("carpet")], [device("lighting"), device("co2")])).toEqual([]);
    // Orta ve düşük CO₂ isteyen bitkide CO₂ uyarısı çıkmaz.
    expect(codes(assessPlants(tank, [entry("bright"), entry("easy")], [device("lighting")]))).toEqual([]);
  });

  it("ışık: aralığın alt ucu orta ya da yüksekse ve aydınlatma yoksa uyarı", () => {
    const warnings = assessPlants(tank, [entry("carpet"), entry("bright"), entry("easy")], [device("co2")]);
    expect(codes(warnings)).toEqual(["p-carpet:plantLight:warning", "p-bright:plantLight:warning"]);
    expect(warnings[0]).toMatchObject({ params: { name: "Hemianthus callitrichoides", level: "medium" }, title: "Hemianthus callitrichoides orta ışık ister" });
    expect(warnings[1]).toMatchObject({ params: { level: "high" }, title: "Rotala macrandra yüksek ışık ister" });
    // Alt ucu düşük olan bitki (ör. düşük–yüksek) aydınlatma olmasa da uyarı vermez; aydınlatma varsa hiçbirinde uyarı yok.
    expect(assessPlants(tank, [entry("carpet"), entry("bright")], [device("co2"), device("lighting")])).toEqual([]);
  });

  it("sıcaklık: son ölçüm aralığın dışındaysa uyarı; sınır değerler aralığın içindedir", () => {
    const equipment = [device("lighting"), device("co2")];
    const hot = assessPlants(tank, [entry("easy")], equipment, reading({ temperature: 29.5 }));
    expect(codes(hot)).toEqual(["p-easy:plantTemperature:warning"]);
    expect(hot[0]).toMatchObject({ params: { name: "Anubias barteri", min: 22, max: 28, value: 29.5, direction: "high" }, title: "Anubias barteri için su sıcak" });
    expect(hot[0].message).toBe("Bu bitkinin kaynaktaki sıcaklık aralığı 22–28 °C; son ölçüm 29,5 °C.");
    const cold = assessPlants(tank, [entry("easy")], equipment, reading({ temperature: 21 }));
    expect(cold[0]).toMatchObject({ params: { direction: "low", value: 21 }, title: "Anubias barteri için su soğuk" });
    for (const temperature of [22, 28]) expect(assessPlants(tank, [entry("easy")], equipment, reading({ temperature }))).toEqual([]);
  });

  it("pH: son ölçüm aralığın dışındaysa uyarı; sınır değerler aralığın içindedir", () => {
    const equipment = [device("lighting"), device("co2")];
    const high = assessPlants(tank, [entry("easy")], equipment, reading({ ph: 7.8 }));
    expect(codes(high)).toEqual(["p-easy:plantPh:warning"]);
    expect(high[0]).toMatchObject({ params: { name: "Anubias barteri", min: 6, max: 7.5, value: 7.8, direction: "high" }, title: "Anubias barteri için pH yüksek" });
    expect(high[0].message).toBe("Bu bitkinin kaynaktaki pH aralığı 6–7,5; son ölçüm 7,8.");
    expect(assessPlants(tank, [entry("easy")], equipment, reading({ ph: 5.9 }))[0]).toMatchObject({ params: { direction: "low" }, title: "Anubias barteri için pH düşük" });
    for (const ph of [6, 7.5]) expect(assessPlants(tank, [entry("easy")], equipment, reading({ ph }))).toEqual([]);
  });

  it("sıcaklık ya da pH aralığı kaynakta olmayan bitkide, ölçüm yokken veya değer sayı değilken uyarı çıkmaz", () => {
    const equipment = [device("lighting"), device("co2")];
    expect(assessPlants({ ...tank, heightCm: 200 }, [entry("tall"), entry("bare")], equipment, reading({ temperature: 35, ph: 9 }))).toEqual([]);
    expect(assessPlants(tank, [entry("easy")], equipment)).toEqual([]);
    expect(assessPlants(tank, [entry("easy")], equipment, reading({}))).toEqual([]);
    expect(assessPlants(tank, [entry("easy")], equipment, reading({ temperature: Number.NaN, ph: Number.POSITIVE_INFINITY }))).toEqual([]);
  });

  it("boy: bitkinin boyu akvaryumun yüksekliğinden büyükse bilgi notu; eşitse not yok", () => {
    const equipment = [device("lighting"), device("co2")];
    const tall = assessPlants(tank, [entry("tall")], equipment);
    expect(codes(tall)).toEqual(["p-tall:plantHeight:info"]);
    expect(tall[0]).toMatchObject({ params: { name: "Vallisneria gigantea", height: 100, tankHeight: 36 }, title: "Vallisneria gigantea 100 cm'ye kadar uzar" });
    expect(tall[0].message).toBe("Akvaryumun yüksekliği 36 cm. Bitki su yüzeyine ulaşır; düzenli budama gerekir.");
    expect(assessPlants({ ...tank, heightCm: 100 }, [entry("tall")], equipment)).toEqual([]);
    // Yüksekliği girilmemiş akvaryumda (sıfır ya da sayı değil) not çıkmaz.
    for (const heightCm of [0, Number.NaN]) expect(assessPlants({ ...tank, heightCm }, [entry("tall")], equipment)).toEqual([]);
  });

  it("uyarıda kullanıcının kayıttaki adı yazılır; ad boşsa kaynaktaki bilimsel ad", () => {
    const [named] = assessPlants(tank, [entry("carpet", "Küba halısı")], [device("lighting")]);
    expect(named).toMatchObject({ params: { name: "Küba halısı" }, title: "Küba halısı yüksek CO₂ ister" });
    const [blank] = assessPlants(tank, [entry("carpet", "  ")], [device("lighting")]);
    expect(blank).toMatchObject({ params: { name: "Hemianthus callitrichoides" }, title: "Hemianthus callitrichoides yüksek CO₂ ister" });
  });

  it("katalogla eşleşmeyen bitki (profil yok) atlanır; uyarılar bitki sırasıyla, her bitkide kural sırasıyla gelir", () => {
    const manual: Plant = { id: "p-manual", aquariumId: "a", name: "Elle eklenen", quantity: 3, addedAt: "2026-01-01" };
    expect(assessPlants(tank, [{ plant: manual }], [])).toEqual([]);
    const all = assessPlants(tank, [{ plant: manual }, entry("tall"), entry("carpet")], [], reading({ temperature: 30, ph: 8 }));
    expect(codes(all)).toEqual([
      "p-tall:plantHeight:info",
      "p-carpet:plantCo2:warning",
      "p-carpet:plantLight:warning",
      "p-carpet:plantTemperature:warning",
      "p-carpet:plantPh:warning",
    ]);
  });

  it("girişleri değiştirmez; ayrı giriş noktası katalog modüllerini ve motorun geri kalanını içe aktarmaz", () => {
    const freeze = <T extends object>(value: T): T => {
      for (const item of Object.values(value)) if (item && typeof item === "object") freeze(item);
      return Object.freeze(value);
    };
    const plants = freeze([entry("carpet"), entry("tall")]);
    const equipment = freeze([device("filter")]);
    expect(() => assessPlants(freeze({ ...tank }), plants, equipment, freeze(reading({ temperature: 30, ph: 8 })))).not.toThrow();
    const source = readFileSync(fileURLToPath(new URL("../src/plants.ts", import.meta.url)), "utf8");
    expect(source).not.toMatch(/from\s+["']@\//);
    expect(source).not.toMatch(/data\/catalog/);
    // Bitki sayfası motorun tamamını yüklemesin: ayrı giriş yalnız tip içe aktarır.
    expect(source.match(/^import .*$/gm)).toEqual(['import type { Aquarium, Equipment, Plant, WaterParameters } from "@aquamind/domain";']);
  });
});
