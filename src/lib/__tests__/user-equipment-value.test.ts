import { describe, expect, it } from "vitest";
import { formatNumber, messagesFor } from "@aquamind/localization";
import { devicesAwaitingUserValue, parseUserValue, userValueField, userValueHint, userValueText, withUserValue } from "@/lib/user-equipment-value";
import type { Equipment } from "@/types/aquarium";

// Ekran metinleri Türkçe dil dosyasından; beklenen cümleler dil dosyasına taşınmadan önce ekranda yazanlarla aynıdır.
const texts = { messages: messagesFor("tr").equipment.userValue, number: (value: number) => formatNumber(value, "tr") };
const unnamed = texts.messages.unnamedDevice;

// Elle girilen ekipman değeri (docs/DECISIONS/0017-elle-girilen-ekipman-degerleri.md): form metninin sayıya çevrilmesi.

const equipment = (category: Equipment["category"], extra: Partial<Equipment> = {}): Equipment => ({ id: "e", aquariumId: "a", category, installedAt: "2026-01-01", ...extra });
const filter = userValueField("filter")!;
const heater = userValueField("heater")!;
const airPump = userValueField("air_pump")!;

describe("elle değer alanı", () => {
  it("filtre ve hava motorunda debi, ısıtıcıda güç sorulur; diğer kategorilerde alan yoktur", () => {
    expect([filter.kind, texts.messages.fields[filter.text].label]).toEqual(["flow", "Etikette yazan debi"]);
    expect([airPump.kind, texts.messages.fields[airPump.text].label]).toEqual(["flow", "Etikette yazan hava debisi"]);
    expect([heater.kind, texts.messages.fields[heater.text].label]).toEqual(["power", "Etikette yazan güç"]);
    expect(userValueField("lighting")).toBeUndefined();
    expect(userValueField("other")).toBeUndefined();
  });

  it("katalogda doğrulanmış değeri olan kayıtta alan yoktur", () => {
    expect(userValueField("filter", { id: "f", category: "filter", brand: "Eheim", model: "Classic", ratedFlowLph: 440 })).toBeUndefined();
    expect(userValueField("filter", { id: "f", category: "filter", brand: "Jeneca", model: "LT-300", capacityDataNote: "Debi doğrulanamadı." })?.kind).toBe("flow");
  });
});

describe("form metninin değere çevrilmesi", () => {
  it("boş metin 'değer girilmedi' demektir, hata değildir", () => {
    expect(parseUserValue("", filter, "lph", texts)).toEqual({});
    expect(parseUserValue("   ", filter, "lph", texts)).toEqual({});
  });

  it("L/saat değeri olduğu gibi, L/dakika değeri 60 ile çarpılarak kaydedilir", () => {
    expect(parseUserValue("600", filter, "lph", texts)).toEqual({ value: 600 });
    expect(parseUserValue("10", filter, "lpm", texts)).toEqual({ value: 600 });
    expect(parseUserValue("3,5", airPump, "lpm", texts)).toEqual({ value: 210 });
    expect(parseUserValue("1.6", airPump, "lpm", texts)).toEqual({ value: 96 });
  });

  it("Türkçe binlik ve ondalık yazımı kabul edilir", () => {
    expect(parseUserValue("1.200", filter, "lph", texts)).toEqual({ value: 1200 });
    expect(parseUserValue("1 200", filter, "lph", texts)).toEqual({ value: 1200 });
    expect(parseUserValue("1.200,5", filter, "lph", texts)).toEqual({ value: 1200.5 });
    expect(parseUserValue("7,5", heater, "lph", texts)).toEqual({ value: 7.5 });
    expect(parseUserValue("7.5", heater, "lph", texts)).toEqual({ value: 7.5 });
  });

  it("sayı olmayan, sıfır ya da eksi değer açıklayıcı bir hatayla reddedilir", () => {
    for (const raw of ["abc", "600 L/saat", "0", "-5", "1,2,3"]) expect(parseUserValue(raw, filter, "lph", texts).error, raw).toBe("Yalnızca sayı gir (ör. 600).");
  });

  it("aralık dışındaki değer reddedilir ve aralık kullanıcının seçtiği birimle yazılır", () => {
    expect(parseUserValue("50000", filter, "lph", texts).error).toBe("Bu değer kabul edilen aralığın dışında (20–20.000 L/saat). Sayıyı ve birimi kontrol et.");
    expect(parseUserValue("19", filter, "lph", texts).error).toContain("20–20.000 L/saat");
    expect(parseUserValue("500", filter, "lpm", texts).error).toBe("Bu değer kabul edilen aralığın dışında (0,4–333,3 L/dakika; 20–20.000 L/saat). Sayıyı ve birimi kontrol et.");
    expect(parseUserValue("3000", heater, "lph", texts).error).toBe("Bu değer kabul edilen aralığın dışında (5–2.000 W). Sayıyı ve birimi kontrol et.");
    expect(parseUserValue("20", filter, "lph", texts)).toEqual({ value: 20 });
    expect(parseUserValue("20000", filter, "lph", texts)).toEqual({ value: 20000 });
    expect(parseUserValue("5", heater, "lph", texts)).toEqual({ value: 5 });
  });

  it("L/dakika mesajında yazan sınırların ikisi de kabul edilir; alt sınırın hemen altı reddedilir", () => {
    // Filtre 20–20.000 L/saat: 0,3 L/dakika 18 L/saat eder ve reddedilir; mesaj 0,3 değil 0,4 göstermelidir.
    expect(parseUserValue("0,3", filter, "lpm", texts).error).toContain("0,4–333,3 L/dakika");
    expect(parseUserValue("0,4", filter, "lpm", texts)).toEqual({ value: 24 });
    expect(parseUserValue("333,3", filter, "lpm", texts)).toEqual({ value: 19998 });
    // Hava motoru 10–50.000 L/saat.
    expect(parseUserValue("0,1", airPump, "lpm", texts).error).toBe("Bu değer kabul edilen aralığın dışında (0,2–833,3 L/dakika; 10–50.000 L/saat). Sayıyı ve birimi kontrol et.");
    expect(parseUserValue("0,2", airPump, "lpm", texts)).toEqual({ value: 12 });
    expect(parseUserValue("833,3", airPump, "lpm", texts)).toEqual({ value: 49998 });
    for (const field of [filter, airPump]) {
      const [low, high] = parseUserValue("999999", field, "lpm", texts).error!.match(/\(([\d.,]+)–([\d.,]+) L\/dakika/)!.slice(1);
      expect(parseUserValue(low, field, "lpm", texts).error, low).toBeUndefined();
      expect(parseUserValue(high, field, "lpm", texts).error, high).toBeUndefined();
    }
  });
});

describe("değerin kayda yazılması ve gösterimi", () => {
  it("debi ve güç kendi alanına yazılır; değer silinince alan kayıttan çıkar", () => {
    expect(withUserValue(equipment("filter"), filter, 600)).toEqual(equipment("filter", { userRatedFlowLph: 600 }));
    expect(withUserValue(equipment("heater"), heater, 100)).toEqual(equipment("heater", { userPowerW: 100 }));
    const cleared = withUserValue(equipment("filter", { userRatedFlowLph: 600 }), filter, undefined);
    expect(cleared).toEqual(equipment("filter"));
    expect("userRatedFlowLph" in cleared).toBe(false);
  });

  it("elle giriş olmayan kayıtta eski değer de temizlenir", () => {
    expect(withUserValue(equipment("filter", { userRatedFlowLph: 600, userPowerW: 5 }), undefined, 700)).toEqual(equipment("filter"));
  });

  it("hesaba katılan değer birimiyle gösterilir; katılmayan değer gösterilmez", () => {
    expect(userValueText(equipment("filter", { userRatedFlowLph: 1200 }), undefined, texts)).toBe("1.200 L/saat");
    expect(userValueText(equipment("heater", { userPowerW: 7.5 }), undefined, texts)).toBe("7,5 W");
    expect(userValueText(equipment("filter"), undefined, texts)).toBeUndefined();
    expect(userValueText(equipment("filter", { userRatedFlowLph: 50000 }), undefined, texts)).toBeUndefined();
    expect(userValueText(equipment("filter", { userRatedFlowLph: 600 }), { id: "f", category: "filter", brand: "Eheim", model: "Classic", ratedFlowLph: 440 }, texts)).toBeUndefined();
  });
});

describe("etiket değeri bekleyen cihazlar", () => {
  const named = { id: "lt", category: "filter" as const, brand: "Jeneca", model: "LT-300", capacityDataNote: "Debi doğrulanamadı." };
  const verified = { id: "f", category: "filter" as const, brand: "Eheim", model: "Classic", ratedFlowLph: 440 };
  const sponge = { id: "s", category: "filter" as const, brand: "Stub", model: "Pipo", requiresAirPump: true as const };
  const profiles: Record<string, typeof named | typeof verified | typeof sponge> = { lt: named, f: verified, s: sponge };
  const profileFor = (item: Equipment) => (item.catalogId ? profiles[item.catalogId] : undefined);

  it("değeri girilmemiş filtre ve ısıtıcıyı adıyla listeler; değeri girilen ya da doğrulanmış olanı listelemez", () => {
    expect(devicesAwaitingUserValue([
      equipment("filter", { brand: "Aquawing", model: "AQ604F" }),
      equipment("filter", { catalogId: "lt", brand: "Jeneca", model: "LT-300" }),
      equipment("heater", { brand: "Marka", model: "H-1" }),
      equipment("filter", { brand: "Aquawing", model: "AQ800", userRatedFlowLph: 800 }),
      equipment("filter", { catalogId: "f" }),
      equipment("lighting", { brand: "Marka", model: "Lamba" }),
    ], profileFor, unnamed)).toEqual(["Aquawing AQ604F", "Jeneca LT-300", "Marka H-1"]);
  });

  it("aralık dışı değer girilmemiş sayılır; adı olmayan kayıt genel bir adla listelenir", () => {
    expect(devicesAwaitingUserValue([equipment("filter", { brand: "Aquawing", model: "AQ604F", userRatedFlowLph: 50000 }), equipment("heater")], profileFor, unnamed)).toEqual(["Aquawing AQ604F", "Adı girilmemiş cihaz"]);
  });

  it("hava motoru yalnızca hava motoruyla çalışan filtre varsa listelenir", () => {
    const airPumpOnly = [equipment("air_pump", { brand: "Marka", model: "Hava" })];
    expect(devicesAwaitingUserValue(airPumpOnly, profileFor, unnamed)).toEqual([]);
    expect(devicesAwaitingUserValue([equipment("filter", { catalogId: "s" }), ...airPumpOnly], profileFor, unnamed)).toEqual(["Marka Hava"]);
    expect(devicesAwaitingUserValue([equipment("filter", { catalogId: "s" }), equipment("air_pump", { brand: "Marka", model: "Hava", userRatedFlowLph: 120 })], profileFor, unnamed)).toEqual([]);
  });
});

describe("akvaryuma göre olağan dışı değer uyarısı", () => {
  it("filtrede saatte 30 çevrimin üstü ve yarım çevrimin altı için birim uyarısı verir", () => {
    expect(userValueHint(filter, "filter", 600, 100, texts)).toBeUndefined();
    expect(userValueHint(filter, "filter", 3000, 100, texts)).toBeUndefined();
    expect(userValueHint(filter, "filter", 3001, 100, texts)).toContain("L/saat mi, L/dakika mı");
    expect(userValueHint(filter, "filter", 49, 100, texts)).toContain("çok düşük");
    expect(userValueHint(filter, "filter", 50, 100, texts)).toBeUndefined();
  });

  it("ısıtıcı ve hava motorunda bu uyarı yoktur", () => {
    expect(userValueHint(heater, "heater", 2000, 20, texts)).toBeUndefined();
    expect(userValueHint(airPump, "air_pump", 9600, 20, texts)).toBeUndefined();
  });
});
