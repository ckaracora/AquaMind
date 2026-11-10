import assert from "node:assert/strict";
import { engineTextFormat } from "../../localization/src/engine-format";
import { createDisplayFormat } from "../../localization/src/format";
import { trEngine } from "../../localization/src/messages/tr-engine";
import { enEngine } from "../../localization/src/messages/en-engine";
import { esEngine } from "../../localization/src/messages/es-engine";

// Aynı kontroller Vitest ve izin verilen test-health.cjs kabul kapısında çalışır.
// Sayılar yalnız biçimleme sınırlarını sınayan örneklerdir; katalog gereksinimi değildir.
export function assertWarningFormatting() {
  for (const [locale, messages] of [["tr", trEngine], ["en", enEngine], ["es", esEngine]] as const) {
    const f = engineTextFormat(createDisplayFormat(locale, { temperature: "fahrenheit", volume: "liters", dateFormat: "day-first" }));
    const localized = (text: string) => locale === "tr" ? text.replaceAll(".", ",") : text;
    const outside = { value: 24.39, above: [], below: ["Stub"], hasRange: true, min: 24.4, max: 28 };
    const below = messages.warnings.speciesTemperatureOutOfRange.message(outside, f);
    assert(below.includes(localized("75.9 °F")), below);
    assert(below.includes(localized("75.92–82.4 °F")), below);
    const above = messages.warnings.speciesTemperatureOutOfRange.message({ ...outside, value: 24.41, above: ["Stub"], below: [], min: 20, max: 24.4 }, f);
    assert(above.includes(localized("75.94 °F")), above);
    assert(above.includes(localized("68–75.92 °F")), above);
    const point = messages.warnings.speciesTemperatureOutOfRange.message({ ...outside, max: 24.4 }, f);
    assert(point.includes(localized("75.92 °F")), point);
    const narrow = messages.warnings.coldwaterWithTropical.message({ coldwater: ["Cold"], tropical: ["Warm"], min: 24.4, max: 24.41 }, f);
    assert(narrow.includes(localized("75.92–75.94 °F")), narrow);
    const ph = messages.warnings.speciesPhOutOfRange.message({ ...outside, value: 6.44, min: 6.444, max: 8 }, f);
    assert(ph.includes(localized("6.444–8")), ph);
    const phPoint = messages.warnings.speciesPhOutOfRange.message({ ...outside, value: 6.44, min: 6.444, max: 6.444 }, f);
    assert(phPoint.includes(localized("6.444")), phPoint);
  }
}
