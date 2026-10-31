import { beforeAll, describe, expect, it } from "vitest";
import {
  DEFAULT_LOCALE, SUPPORTED_LOCALES, loadLocaleBundle, celsiusToFahrenheit, cmToInches, createDisplayFormat, fahrenheitToCelsius, formatCalendarDate,
  formatDate, formatNumber, formatTemperature, formatVolume, gallonsToLiters, inchesToCm, isLocale, litersToGallons, messagesFor,
  temperatureFromCelsius, temperatureToCelsius, volumeFromLiters, volumeInputText, volumeInputToLiters, volumeToLiters, type Messages,
} from "../src";

// Dil altyapısı (docs/DECISIONS/0021-dil-altyapisi.md).

const leaves = (value: unknown, path = ""): Array<[string, unknown]> =>
  value !== null && typeof value === "object"
    ? Object.entries(value as Record<string, unknown>).flatMap(([key, child]) => leaves(child, path ? `${path}.${key}` : key))
    : [[path, value]];

describe("diller", () => {
  it("varsayılan dil Türkçe ve desteklenen diller arasında", () => {
    expect(DEFAULT_LOCALE).toBe("tr");
    expect(SUPPORTED_LOCALES).toContain(DEFAULT_LOCALE);
    expect(isLocale("tr")).toBe(true);
    expect(isLocale("en")).toBe(true);
    expect(isLocale("es")).toBe(true);
    expect(isLocale("xx")).toBe(false);
    expect(isLocale(undefined)).toBe(false);
  });

  beforeAll(() => Promise.all(SUPPORTED_LOCALES.map((locale) => loadLocaleBundle(locale))));

  it("her dilin metinleri boş değil; değişkenli metin fonksiyon", () => {
    for (const locale of SUPPORTED_LOCALES) {
      for (const [path, value] of leaves(messagesFor(locale))) {
        expect(typeof value === "string" || typeof value === "function", `${locale} ${path}`).toBe(true);
        if (typeof value === "string") expect(value.trim(), `${locale} ${path}`).not.toBe("");
      }
    }
  });

  it("bilinmeyen dil varsayılan dile düşer", () => {
    expect(messagesFor("xx" as never)).toBe(messagesFor(DEFAULT_LOCALE));
  });

  it("değişkenli metin değeri yerine koyar", () => {
    const messages: Messages = messagesFor("tr");
    expect(messages.storageWarning.unsaved("akvaryumlar, canlılar")).toBe("Değişiklikleriniz bu cihazda saklanamadı (akvaryumlar, canlılar).");
  });
});

describe("biçimleme", () => {
  it("sayılar dilin ayırıcılarıyla yazılır", () => {
    expect(formatNumber(1234.56, "tr")).toBe("1.234,6");
    expect(formatNumber(25.4, "tr")).toBe("25,4");
    expect(formatNumber(1500, "tr", { maximumFractionDigits: 0 })).toBe("1.500");
  });

  it("İngilizcede Amerikan biçimi: binlik virgül, ondalık nokta, ay adı İngilizce", () => {
    expect(formatNumber(1234.56, "en")).toBe("1,234.6");
    expect(formatVolume(120, "gallons", "en")).toBe("31.7 gal");
    expect(formatTemperature(25.4, "celsius", "en")).toBe("25.4 °C");
    expect(formatDate("2026-10-19", "en", { day: "numeric", month: "short", year: "numeric" })).toBe("Oct 19, 2026");
  });

  it("İspanyolcada Latin Amerika biçimi: binlik virgül, ondalık nokta, ay adı İspanyolca", () => {
    expect(formatNumber(1234.56, "es")).toBe("1,234.6");
    expect(formatVolume(120, "gallons", "es")).toBe("31.7 gal");
    expect(formatTemperature(25.4, "celsius", "es")).toBe("25.4 °C");
    expect(formatDate("2026-10-19", "es", { day: "numeric", month: "long", year: "numeric" })).toBe("19 de octubre de 2026");
  });

  it("hacim ve sıcaklık tercih edilen birimde gösterilir", () => {
    expect(formatVolume(120, "liters", "tr")).toBe("120 L");
    expect(formatVolume(120, "gallons", "tr")).toBe("31,7 gal");
    expect(formatTemperature(25.4, "celsius", "tr")).toBe("25,4 °C");
    expect(formatTemperature(25, "fahrenheit", "tr")).toBe("77 °F");
  });

  it("takvim tarihi seçilen sırayla ve saat dilimine göre kaymadan yazılır", () => {
    expect(formatCalendarDate("2026-10-19", "day-first")).toBe("19.10.2026");
    expect(formatCalendarDate("2026-10-19", "month-first")).toBe("10/19/2026");
    expect(formatCalendarDate("2026-01-05", "day-first")).toBe("05.01.2026");
    expect(formatCalendarDate("geçersiz", "day-first")).toBe("");
  });

  it("takvimde olmayan gün başka bir güne kaydırılmaz", () => {
    expect(formatCalendarDate("2024-02-29", "day-first")).toBe("29.02.2024");
    for (const value of ["2026-02-29", "2026-04-31", "2026-13-01", "2026-00-10", "2026-10-00", "2026-10-32"]) {
      expect(formatCalendarDate(value, "day-first"), value).toBe("");
      expect(formatCalendarDate(value, "month-first"), value).toBe("");
    }
  });

  it("ay adlı ve saatli tarih dilin kuralıyla; ISO günü kaymaz, geçersiz girdi boş", () => {
    expect(formatDate("2026-10-19", "tr", { day: "numeric", month: "short" })).toBe("19 Eki");
    expect(formatDate("2026-10-19", "tr", { day: "numeric", month: "short", year: "numeric" })).toBe("19 Eki 2026");
    expect(formatDate("2026-01-01", "tr", { year: "numeric" })).toBe("2026");
    expect(formatDate(new Date(2026, 0, 5, 9, 7), "tr", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })).toBe("05 Oca 09:07");
    expect(formatDate("2026-02-29", "tr", { year: "numeric" })).toBe("");
    expect(formatDate("geçersiz", "tr", { year: "numeric" })).toBe("");
  });
});

describe("tercihe göre gösterim", () => {
  const metric = createDisplayFormat("tr", { temperature: "celsius", volume: "liters", dateFormat: "day-first" });
  const imperial = createDisplayFormat("tr", { temperature: "fahrenheit", volume: "gallons", dateFormat: "month-first" });

  it("varsayılan tercihte litre, °C ve gün önce", () => {
    expect(metric.volume(120)).toBe("120 L");
    expect(metric.volume(1500)).toBe("1.500 L");
    expect([metric.volumeNumber(60), metric.volumeSymbol]).toEqual(["60", "L"]);
    expect(metric.temperature(25.4)).toBe("25,4 °C");
    expect(metric.temperature(25.45)).toBe("25,45 °C");
    expect([metric.temperatureNumber(25.4), metric.temperatureSymbol]).toEqual(["25,4", "°C"]);
    expect(metric.calendarDate("2026-10-19")).toBe("19.10.2026");
  });

  it("galon, °F ve ay önce seçilince çevrilerek yazılır", () => {
    expect(imperial.volume(120)).toBe("31,7 gal");
    expect([imperial.volumeNumber(60), imperial.volumeSymbol]).toEqual(["15,9", "gal"]);
    expect(imperial.temperature(25)).toBe("77 °F");
    expect(imperial.temperature(25.4)).toBe("77,7 °F");
    expect([imperial.temperatureNumber(25.4), imperial.temperatureSymbol]).toEqual(["77,7", "°F"]);
    expect(imperial.calendarDate("2026-10-19")).toBe("10/19/2026");
  });

  it("su ölçümleri yuvarlanmadan, dilin ayırıcısıyla", () => {
    expect(metric.measurement(7.2)).toBe("7,2");
    expect(metric.measurement(0.25)).toBe("0,25");
    expect(metric.measurement(1.025)).toBe("1,025");
    expect(metric.measurement(1500)).toBe("1.500");
  });
});

describe("form girişi", () => {
  it("galon ve °F girişi kayda litre ve °C olarak yuvarlanarak yazılır", () => {
    expect(volumeToLiters(30, "gallons")).toBe(113.6);
    expect(volumeToLiters(120, "liters")).toBe(120);
    expect(temperatureToCelsius(78, "fahrenheit")).toBe(25.56);
    expect(temperatureToCelsius(77, "fahrenheit")).toBe(25);
    expect(temperatureToCelsius(25.4, "celsius")).toBe(25.4);
    expect(volumeFromLiters(113.6, "gallons")).toBeCloseTo(30.01, 2);
    expect(temperatureFromCelsius(25, "fahrenheit")).toBe(77);
  });

  it("hacim alanının başlangıç metni; değiştirilmeyen alan kayıttaki litreyi korur", () => {
    expect(volumeInputText(120, "liters")).toBe("120");
    expect(volumeInputText(120.25, "liters")).toBe("120.25");
    expect(volumeInputText(120, "gallons")).toBe("31.7");
    // Galonla açılan form değiştirilmeden kaydedilirse 180 L aynen korunur; korumasız geri dönüşüm 47,6 galondan 180,2 L verirdi.
    expect(volumeInputText(180, "gallons")).toBe("47.6");
    expect(volumeToLiters(47.6, "gallons")).toBe(180.2);
    expect(volumeInputToLiters("47.6", "gallons", 180)).toBe(180);
    expect(volumeInputToLiters("47.6", "gallons", 180.25)).toBe(180.25);
    expect(volumeInputToLiters("47.7", "gallons", 180)).toBe(180.6);
    expect(volumeInputToLiters("40", "gallons", 120)).toBe(151.4);
    expect(volumeInputToLiters("40", "gallons")).toBe(151.4);
    expect(volumeInputToLiters("150", "liters", 120)).toBe(150);
    expect(volumeInputToLiters("", "gallons")).toBeNaN();
    expect(volumeInputToLiters("abc", "liters")).toBeNaN();
  });
});

describe("birim dönüşümü", () => {
  it("dönüşümler tanımlara uyar ve geri dönüşte değer korunur", () => {
    expect(gallonsToLiters(1)).toBeCloseTo(3.785411784, 9);
    expect(litersToGallons(gallonsToLiters(55))).toBeCloseTo(55, 9);
    expect(celsiusToFahrenheit(0)).toBe(32);
    expect(celsiusToFahrenheit(100)).toBe(212);
    expect(fahrenheitToCelsius(celsiusToFahrenheit(24.5))).toBeCloseTo(24.5, 9);
    expect(cmToInches(2.54)).toBe(1);
    expect(inchesToCm(cmToInches(60))).toBeCloseTo(60, 9);
  });
});
