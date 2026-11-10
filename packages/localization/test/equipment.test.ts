import { describe, expect, it } from "vitest";
import { catalogTextKey } from "../src/catalog";
import { equipmentPattern, equipmentText, turkishNumberValue } from "../src/equipment";
import { createDisplayFormat } from "../src/format";

// Ekipman kataloğunun çevirisi (karar 0021, 7. paket): parça kalıbı, sayıların yerine konması, kullanıcının birimi.

const metric = { temperature: "celsius", volume: "liters", dateFormat: "day-first" } as const;
const us = { temperature: "fahrenheit", volume: "gallons", dateFormat: "month-first" } as const;
const table = (rows: Record<string, string>) => Object.fromEntries(Object.entries(rows).map(([pattern, text]) => [catalogTextKey(pattern), text]));

const texts = table({
  "Dış filtre": "Canister filter",
  "# L/saat": "{1} L/h",
  "# W": "{1} W",
  "barkod #": "barcode {1}",
  "Fluval #/#/#": "Fluval {1}/{2}/{3}",
  "# litreye kadar": "up to {1:L}",
  "#–# L": "{1:l}–{2:L}",
  "# L hazne": "{1:L} reservoir",
  "#–# °C ayar": "{1:c}–{2:C} setting",
  "#–# °C": "{1:c}–{2:C}",
  "# °C sıcaklık artışı": "{1} °C temperature rise",
  "MT-# pompa": "MT-{1} pump",
  "# Eylül # denetimi": "September {1}, {2} review",
});

describe("ekipman metninin çevirisi", () => {
  it("kalıp: sayılar # olur; işaret yalnız önünde harf ya da rakam yoksa sayıya aittir", () => {
    expect(equipmentPattern("-10–+50 °C")).toEqual({ pattern: "#–# °C", numbers: ["-10", "+50"] });
    expect(equipmentPattern("MT-60 pompa")).toEqual({ pattern: "MT-# pompa", numbers: ["60"] });
    expect(equipmentPattern("1-2 hafta")).toEqual({ pattern: "#-# hafta", numbers: ["1", "2"] });
    expect(equipmentPattern("15.000 L/saat")).toEqual({ pattern: "# L/saat", numbers: ["15.000"] });
    expect(equipmentPattern("Dış filtre")).toEqual({ pattern: "Dış filtre", numbers: [] });
  });

  it("Türkçe sayının değeri: virgül ondalık, nokta + üç rakam binlik, nokta + bir-iki rakam ondalık", () => {
    expect([turkishNumberValue("4,5"), turkishNumberValue("15.000"), turkishNumberValue("4.6"), turkishNumberValue("1.234,5"), turkishNumberValue("0,025"), turkishNumberValue("-10"), turkishNumberValue("+50")])
      .toEqual([4.5, 15000, 4.6, 1234.5, 0.025, -10, 50]);
  });

  it("Türkçede metin olduğu gibi kalır; çevirisi eksik parça varsa ya da tablo yoksa çeviri yoktur", () => {
    const tr = createDisplayFormat("tr", metric);
    const en = createDisplayFormat("en", metric);
    expect(equipmentText("Dış filtre · 300 L/saat · 11 W", undefined, tr)).toBe("Dış filtre · 300 L/saat · 11 W");
    expect(equipmentText("Dış filtre · 300 L/saat", undefined, en)).toBeUndefined();
    expect(equipmentText("Dış filtre · bilinmeyen parça", texts, en)).toBeUndefined();
    expect(equipmentText("constructor", texts, en)).toBeUndefined();
  });

  it("düz sayıların rakamları aynen kalır, ayırıcılar dilin olur (kod, barkod, öndeki sıfır)", () => {
    for (const locale of ["en", "es"] as const) {
      const fmt = createDisplayFormat(locale, metric);
      expect(equipmentText("Dış filtre · 15.000 L/saat · 4,5 W", texts, fmt)).toBe("Canister filter · 15,000 L/h · 4.5 W");
      expect(equipmentText("barkod 0868147561359 · Fluval 05/06/07 · MT-60 pompa", texts, fmt)).toBe("barcode 0868147561359 · Fluval 05/06/07 · MT-60 pump");
      expect(equipmentText("16 Eylül 2026 denetimi", texts, fmt)).toBe("September 16, 2026 review");
    }
  });

  it("hacim ve sıcaklık kullanıcının birimiyle yazılır; sıcaklık farkı dönüştürülmez", () => {
    const en = createDisplayFormat("en", metric);
    const usFmt = createDisplayFormat("en", us);
    expect(equipmentText("30 litreye kadar · 10–120 L · 0,2 L hazne", texts, en)).toBe("up to 30 L · 10–120 L · 0.2 L reservoir");
    expect(equipmentText("30 litreye kadar · 10–120 L · 0,2 L hazne", texts, usFmt)).toBe("up to 7.9 gal · 2.6–31.7 gal · 0.05 gal reservoir");
    expect(equipmentText("20–34 °C ayar · -10–+50 °C · 5 °C sıcaklık artışı", texts, en)).toBe("20–34 °C setting · -10–+50 °C · 5 °C temperature rise");
    expect(equipmentText("20–34 °C ayar · -10–+50 °C · 5 °C sıcaklık artışı", texts, usFmt)).toBe("68–93.2 °F setting · 14–122 °F · 5 °C temperature rise");
  });
});
