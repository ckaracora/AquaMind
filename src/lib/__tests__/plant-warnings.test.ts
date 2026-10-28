import { readFileSync } from "node:fs";
import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { assessPlants, type PlantProfileInput, type PlantWarning } from "@aquamind/compatibility-engine/plants";
import { createDisplayFormat } from "@aquamind/localization";
import { plantWarningFormat, plantWarningMessagesFor, type PlantWarningFormat } from "@aquamind/localization/plant-warnings";
import { checkAquariumPlants, plantWarningText, warningsFirst } from "@/lib/plant-warning-text";
import type { PlantCatalogModule } from "@/lib/use-plant-catalog";
import type { Aquarium, Equipment, Plant, WaterParameters } from "@/types/aquarium";

// Bitki uyarılarının ekran metinleri (docs/DECISIONS/0025-bitki-uyarilari.md): dil dosyasının metni motorun Türkçe metniyle aynı,
// sayılar dilin ayırıcılarıyla ve sıcaklık kullanıcının birimiyle yazılır.

const tr = plantWarningMessagesFor("tr");
const formatFor = (temperature: "celsius" | "fahrenheit") => plantWarningFormat(createDisplayFormat("tr", { temperature, volume: "liters", dateFormat: "day-first" }));
const celsius = formatFor("celsius");
const fahrenheit = formatFor("fahrenheit");

const tank: Aquarium = { id: "a", name: "Senaryo", type: "freshwater", lengthCm: 60, widthCm: 30, heightCm: 36, netVolumeLiters: 54, setupDate: "2026-01-01" };
const profiles: Record<string, PlantProfileInput> = {
  carpet: { id: "carpet", scientificName: "Hemianthus callitrichoides", light: ["medium", "high"], co2: "high", heightCm: 3, temperature: [20, 28], ph: [5, 7] },
  tall: { id: "tall", scientificName: "Vallisneria gigantea", light: ["high", "high"], co2: "low", heightCm: 100, temperature: [18, 28.5], ph: [6.5, 7.5] },
};
const plant = (id: string, name = profiles[id].scientificName): Plant => ({ id: `p-${id}`, aquariumId: "a", name, quantity: 1, addedAt: "2026-01-01", catalogId: id });
const reading = (values: Partial<WaterParameters>, measuredAt = "2026-10-01T10:00:00Z"): WaterParameters => ({ id: measuredAt, aquariumId: "a", measuredAt, ...values });
const run = (latest?: WaterParameters, equipment: Equipment[] = []) => assessPlants(tank, ["carpet", "tall"].map((id) => ({ plant: plant(id), profile: profiles[id] })), equipment, latest);
const textFor = (warnings: PlantWarning[], code: string, format: PlantWarningFormat = celsius) => plantWarningText(tr, format, warnings.find((warning) => warning.code === code)!);
// Bileşenler gerçek çıktılarıyla sınanır: dil, görüntü biçimi, kayıtlar ve bitki kataloğu kancası sınama değerleriyle verilir.
const store = vi.hoisted(() => ({
  catalog: { failed: false, catalog: undefined as unknown, retry: () => {} },
  data: { aquariums: [] as unknown[], plants: [] as unknown[], equipment: [] as unknown[], waterReadings: [] as unknown[], addPlant: () => {}, removePlant: () => {} },
}));
vi.mock("@/providers/i18n-provider", async () => {
  const { messagesFor: messages } = await import("@aquamind/localization");
  return { useI18n: () => ({ t: messages("tr"), locale: "tr" }) };
});
vi.mock("@/lib/use-display-format", async () => {
  const { createDisplayFormat: format } = await import("@aquamind/localization");
  return { useDisplayFormat: () => format("tr", { temperature: "celsius", volume: "liters", dateFormat: "day-first" }) };
});
vi.mock("@/lib/use-plant-catalog", () => ({ usePlantCatalog: () => store.catalog }));
vi.mock("@/providers/aquarium-provider", () => ({ useAquariums: () => store.data }));
vi.mock("@/components/app-shell", () => ({ AppShell: ({ children }: { children: ReactNode }) => children }));
vi.mock("@/components/page-header", () => ({ PageHeader: () => null }));
const { PlantWarningsBody } = await import("@/components/plant-warnings");
const { default: PlantsPage } = await import("@/app/plants/page");
const decode = (html: string) => html.replace(/&#x27;/g, "'").replace(/&quot;/g, "\"").replace(/&amp;/g, "&");
const textOf = (html: string) => decode(html.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
const fakeCatalog = { plantForRecord: (record: Plant) => (record.catalogId ? profiles[record.catalogId] : undefined) } as unknown as PlantCatalogModule;
const manual = (id: string, name: string): Plant => ({ id, aquariumId: "a", name, quantity: 1, addedAt: "2026-01-01" });
const body = (props: Parameters<typeof PlantWarningsBody>[0]) => textOf(renderToStaticMarkup(createElement(PlantWarningsBody, props)));
beforeEach(() => {
  store.catalog = { failed: false, catalog: undefined, retry: () => {} };
  store.data = { aquariums: [], plants: [], equipment: [], waterReadings: [], addPlant: () => {}, removePlant: () => {} };
});

const engineCodes = new Set([...readFileSync("packages/compatibility-engine/src/plants.ts", "utf8").matchAll(/code: "([A-Za-z0-9]+)"/g)].map((match) => match[1]));

describe("bitki uyarılarının metinleri", () => {
  it("motorun her kodu dil dosyasında var, dil dosyasında kullanılmayan kod yok", () => {
    expect(engineCodes).toEqual(new Set(["plantCo2", "plantLight", "plantTemperature", "plantPh", "plantHeight"]));
    expect(new Set(Object.keys(tr.warnings))).toEqual(engineCodes);
  });

  it("Türkçe metin motorun Türkçe metniyle aynı (her kod, iki yön)", () => {
    const scenarios = [run(reading({ temperature: 29.5, ph: 7.8 })), run(reading({ temperature: 17, ph: 4.5 })), run(reading({ temperature: 24, ph: 6.75 }))];
    const seen = new Set<string>();
    for (const warnings of scenarios) {
      for (const warning of warnings) {
        seen.add(warning.code);
        expect(plantWarningText(tr, celsius, warning), `${warning.plantId} ${warning.code}`).toEqual({ title: warning.title, message: warning.message });
      }
    }
    expect(seen).toEqual(engineCodes);
    expect(textFor(scenarios[0], "plantTemperature").message).toBe("Bu bitkinin kaynaktaki sıcaklık aralığı 20–28 °C; son ölçüm 29,5 °C.");
    expect(textFor(scenarios[1], "plantPh")).toEqual({ title: "Hemianthus callitrichoides için pH düşük", message: "Bu bitkinin kaynaktaki pH aralığı 5–7; son ölçüm 4,5." });
    expect(textFor(scenarios[2], "plantHeight").message).toBe("Akvaryumun yüksekliği 36 cm. Bitki su yüzeyine ulaşır; düzenli budama gerekir.");
  });

  it("sıcaklık kullanıcının biriminde yazılır (°F)", () => {
    const warnings = run(reading({ temperature: 29.5 }));
    expect(textFor(warnings, "plantTemperature", fahrenheit).message).toBe("Bu bitkinin kaynaktaki sıcaklık aralığı 68–82,4 °F; son ölçüm 85,1 °F.");
    expect(textFor(warnings, "plantTemperature", fahrenheit).title).toBe("Hemianthus callitrichoides için su sıcak");
  });

  it("yuvarlama, aşılan sınırla son ölçüm arasındaki farkı gizlemez", () => {
    expect(textFor(run(reading({ temperature: 28.004 })), "plantTemperature").message).toBe("Bu bitkinin kaynaktaki sıcaklık aralığı 20–28 °C; son ölçüm 28,004 °C.");
    expect(textFor(run(reading({ temperature: 28.01 })), "plantTemperature", fahrenheit).message).toBe("Bu bitkinin kaynaktaki sıcaklık aralığı 68–82,4 °F; son ölçüm 82,42 °F.");
    expect(textFor(run(reading({ ph: 7.001 })), "plantPh").message).toBe("Bu bitkinin kaynaktaki pH aralığı 5–7; son ölçüm 7,001.");
    const shallow = assessPlants({ ...tank, heightCm: 99.96 }, [{ plant: plant("tall"), profile: profiles.tall }], [], undefined);
    expect(textFor(shallow, "plantHeight")).toEqual({ title: "Vallisneria gigantea 100 cm'ye kadar uzar", message: "Akvaryumun yüksekliği 99,96 cm. Bitki su yüzeyine ulaşır; düzenli budama gerekir." });
  });

  it("dil dosyası sayıyı kendisi yazmaz, her sayı biçimleyiciden geçer", () => {
    // Bütün sayı değişkenleri ayırt edilebilir bir değerle değiştirilip işaretleyen biçimleyiciyle yazılır; işaretler ve adlar çıkarılınca
    // geriye yalnız kalıbın sabit sayıları kalmalıdır (Tropica'nın yüksek CO₂ tanımı: 15–25 mg/L).
    const probe: PlantWarningFormat = { measurement: () => "⟦⟧", temperature: () => "⟦⟧", temperatureNumber: () => "⟦⟧", length: () => "⟦⟧" };
    const leaks: string[] = [];
    for (const warnings of [run(reading({ temperature: 30, ph: 8 })), run(reading({ temperature: 10, ph: 4 }))]) {
      for (const warning of warnings) {
        const params = Object.fromEntries(Object.entries(warning.params).map(([key, value]) => [key, typeof value === "number" ? 987654.321 : value]));
        const text = plantWarningText(tr, probe, { ...warning, params });
        const rest = `${text.title} ${text.message}`.split("⟦⟧").join("").split(String(params.name)).join("");
        for (const digits of rest.match(/\d+/g) ?? []) if (!["15", "25"].includes(digits)) leaks.push(`${warning.code}: ${digits}`);
      }
    }
    expect(leaks).toEqual([]);
  });

  it("dil dosyasında karşılığı olmayan kodda motorun Türkçe metnine düşer", () => {
    const warning = { plantId: "p", level: "warning" as const, code: "unknownCode", params: {}, title: "Başlık", message: "Metin" } as unknown as PlantWarning;
    expect(plantWarningText(tr, celsius, warning)).toEqual({ title: "Başlık", message: "Metin" });
    for (const code of ["constructor", "toString", "__proto__"]) expect(plantWarningText(tr, celsius, { ...warning, code } as PlantWarning)).toEqual({ title: "Başlık", message: "Metin" });
  });

  it("akvaryumun uyarıları: yalnız o akvaryumun bitkileri, ekipmanı ve en son ölçümü", () => {
    const other = (item: Plant): Plant => ({ ...item, id: `${item.id}-b`, aquariumId: "b" });
    const plants = [plant("carpet"), other(plant("tall"))];
    const equipment: Equipment[] = [{ id: "e-co2", aquariumId: "b", category: "co2", installedAt: "2026-01-01" }, { id: "e-light", aquariumId: "a", category: "lighting", installedAt: "2026-01-01" }];
    const readings = [reading({ temperature: 30 }, "2026-10-02T10:00:00Z"), reading({ temperature: 24 }, "2026-10-03T08:00:00Z"), { ...reading({ temperature: 35 }, "2026-10-09T10:00:00Z"), aquariumId: "b" }];
    // Öbür akvaryumun CO₂ sistemi, bitkisi ve ölçümü sayılmaz; en son ölçüm (24 °C) aralıkta, eskisi (30 °C) dikkate alınmaz.
    const result = checkAquariumPlants(fakeCatalog, tank, plants, equipment, readings);
    expect(result.warnings.map((warning) => `${warning.plantId}:${warning.code}`)).toEqual(["p-carpet:plantCo2"]);
    expect(result).toMatchObject({ unmatched: [], checked: 1 });
  });

  it("katalogla eşleşmeyen bitkiler ayrıca döner; değerlendirilen bitki sayısı yalnız eşleşenleri sayar", () => {
    const result = checkAquariumPlants(fakeCatalog, tank, [manual("m1", "Elle eklenen"), plant("carpet"), { ...manual("m2", "Başka akvaryum"), aquariumId: "b" }], [], []);
    expect(result.unmatched.map((item) => item.id)).toEqual(["m1"]);
    expect(result.checked).toBe(1);
    expect(checkAquariumPlants(fakeCatalog, tank, [manual("m1", "Elle eklenen")], [], [])).toEqual({ warnings: [], unmatched: [manual("m1", "Elle eklenen")], checked: 0 });
  });

  it("sağlık analizindeki bölüm: hiçbir bitki eşleşmediyse yeşil 'uyarı yok' yerine 'hesaplanamadı' der ve adları yazar", () => {
    const retry = () => {};
    const none = body({ result: { warnings: [], unmatched: [manual("m1", "Java yosunu"), manual("m2", "Java yosunu"), manual("m3", "Amazon kılıcı")], checked: 0 }, failed: false, retry });
    expect(none).toBe("Bitkiler katalogla eşleşmediği için uyarı hesaplanamadı: Java yosunu, Amazon kılıcı.");
    expect(none).not.toContain(tr.none);
    // Bir kısmı eşleştiyse yeşil sonuç yalnız eşleşenler içindir; eşleşmeyenler ayrıca yazılır.
    expect(body({ result: { warnings: [], unmatched: [manual("m1", "Java yosunu")], checked: 2 }, failed: false, retry })).toBe("Katalogla eşleşen bitkiler için uyarı yok. Katalogla eşleşmeyen bitkiler için uyarı hesaplanmadı: Java yosunu.");
    expect(body({ result: { warnings: [], unmatched: [], checked: 2 }, failed: false, retry })).toBe("Kayıtlı bitkiler için uyarı yok.");
    // Uyarı varken eşleşmeyenler listenin sonunda; adı boş kayıtta liste yazılmaz.
    const warnings = run(reading({ temperature: 30 }));
    const listed = body({ result: { warnings, unmatched: [manual("m1", " ")], checked: 2 }, failed: false, retry });
    expect(listed.startsWith("Hemianthus callitrichoides yüksek CO₂ ister")).toBe(true);
    expect(listed.endsWith("Katalogla eşleşmeyen bitkiler için uyarı hesaplanmadı.")).toBe(true);
    expect(listed).not.toContain(tr.none);
    // Katalog yüklenirken bekleme metni, yüklenemezse yeniden deneme düğmesi.
    expect(body({ failed: false, retry })).toBe(tr.preparing);
    expect(body({ failed: true, retry })).toBe(`${tr.loadFailed} Yeniden dene`);
  });

  it("bitki sayfası: katalog yüklenemezse listenin üstünde bunu söyler ve yeniden deneme düğmesi verir", () => {
    store.data = { ...store.data, aquariums: [tank], plants: [plant("carpet")] };
    const page = () => decode(renderToStaticMarkup(createElement(PlantsPage)));
    store.catalog = { failed: true, catalog: undefined, retry: () => {} };
    expect(page()).toContain(tr.loadFailed);
    expect(page()).toMatch(/role="alert"[^]*Yeniden dene/);
    // Katalog yüklenince kartta uyarı görünür, hata satırı görünmez.
    store.catalog = { failed: false, catalog: fakeCatalog, retry: () => {} };
    expect(page()).not.toContain(tr.loadFailed);
    expect(textOf(page())).toContain("Hemianthus callitrichoides yüksek CO₂ ister");
    // Bitki yokken hata satırı gösterilmez (katalog zaten istenmez).
    store.data = { ...store.data, plants: [] };
    store.catalog = { failed: true, catalog: undefined, retry: () => {} };
    expect(page()).not.toContain(tr.loadFailed);
  });

  it("sağlık analizinde önce sarı uyarılar, sonra bilgi notları; her grupta motorun sırası korunur", () => {
    const warnings = assessPlants(tank, ["tall", "carpet"].map((id) => ({ plant: plant(id), profile: profiles[id] })), [], reading({ temperature: 30 }));
    expect(warnings.map((warning) => `${warning.plantId}:${warning.code}`)).toEqual(["p-tall:plantLight", "p-tall:plantTemperature", "p-tall:plantHeight", "p-carpet:plantCo2", "p-carpet:plantLight", "p-carpet:plantTemperature"]);
    expect(warningsFirst(warnings).map((warning) => `${warning.plantId}:${warning.code}`)).toEqual(["p-tall:plantLight", "p-tall:plantTemperature", "p-carpet:plantCo2", "p-carpet:plantLight", "p-carpet:plantTemperature", "p-tall:plantHeight"]);
    expect(warnings[2].level).toBe("info");
  });

  it("metinler dil paketinin ana girişine bağlı değil; bitki ve sağlık sayfaları ayrı girişi ve motorun bitki girişini kullanır", () => {
    const main = readFileSync("packages/localization/src/index.ts", "utf8");
    expect(main).not.toMatch(/plant-warnings/);
    const text = readFileSync("src/lib/plant-warning-text.ts", "utf8");
    expect(text).toContain('from "@aquamind/compatibility-engine/plants"');
    expect(text).not.toMatch(/from "@aquamind\/compatibility-engine"/);
    expect(text).not.toMatch(/^import (?!type).*@\/data\//m);
    const component = readFileSync("src/components/plant-warnings.tsx", "utf8");
    expect(component).toContain('from "@aquamind/localization/plant-warnings"');
    expect(component).not.toMatch(/^import (?!type).*@\/data\//m);
    expect(readFileSync("src/app/plants/page.tsx", "utf8")).not.toMatch(/from "@aquamind\/compatibility-engine"/);
  });
});
