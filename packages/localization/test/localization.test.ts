import { describe, expect, it } from "vitest";
import {
  DEFAULT_LOCALE, SUPPORTED_LOCALES, celsiusToFahrenheit, cmToInches, fahrenheitToCelsius, formatCalendarDate, formatNumber,
  formatTemperature, formatVolume, gallonsToLiters, inchesToCm, isLocale, litersToGallons, messagesFor, type Messages,
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
    expect(isLocale("xx")).toBe(false);
    expect(isLocale(undefined)).toBe(false);
  });

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
