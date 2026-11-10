import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { assessMarineWater } from "@aquamind/compatibility-engine";
import type { Livestock, WaterParameters } from "@aquamind/domain";

// Sağlık analizindeki "Deniz suyu" bölümü (motor 1.13.0, karar 0030): bölüm motorun değerlendirmesini olduğu gibi gösterir.
vi.mock("@/providers/i18n-provider", async () => {
  const { messagesFor: messages } = await import("@aquamind/localization");
  return { useI18n: () => ({ t: messages("tr"), locale: "tr" }) };
});
vi.mock("@/lib/use-display-format", async () => {
  const { createDisplayFormat: format } = await import("@aquamind/localization");
  return { useDisplayFormat: () => format("tr", { temperature: "celsius", volume: "liters", dateFormat: "day-first" }) };
});
const { MarineWaterSection } = await import("@/components/marine-water");
const decode = (html: string) => html.replace(/&#x27;/g, "'").replace(/&quot;/g, "\"").replace(/&amp;/g, "&");
const textOf = (html: string) => decode(html.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
const section = (marine: Parameters<typeof MarineWaterSection>[0]["marine"]) => textOf(renderToStaticMarkup(createElement(MarineWaterSection, { marine })));
const count = (text: string, part: string) => text.split(part).length - 1;
const reading = (values: Partial<WaterParameters>): WaterParameters => ({ id: "w", aquariumId: "a", measuredAt: "2026-10-30", ...values });
const fish: Pick<Livestock, "category">[] = [{ category: "fish" }];
const withShrimp: Pick<Livestock, "category">[] = [{ category: "fish" }, { category: "shrimp" }];

describe("Deniz suyu bölümü", () => {
  it("deniz akvaryumu değilse görünmez", () => {
    expect(section(assessMarineWater("freshwater", fish, reading({ ph: 7 })))).toBe("");
  });

  it("yalnız balıklı hedefte değerleri, hedefleri ve durumları yazar", () => {
    const text = section(assessMarineWater("saltwater", fish, reading({ specificGravity: 1.025, ph: 8.1, nitrate: 30, temperature: 25 })));
    expect(text).toContain("Deniz suyu Yalnız balıklı akvaryum hedefi Akvaryumda deniz omurgasızı kayıtlı değil. Kaynak: OATA");
    expect(text).toContain("Özgül ağırlık 1,025 Hedef 1,017–1,023");
    expect(text).toContain("pH 8,1 Hedefte Hedef 8–8,2");
    expect(text).toContain("Nitrat 30 mg/L Hedef en çok 20 mg/L");
    expect(text).toContain("Sıcaklık 25 °C Canlılara göre OATA'nın aralığı 24–27 °C");
    expect(text).not.toContain("KH");
    expect(text).not.toContain("Fosfat");
    // Hedef dışı satır hedefi bir kez yazar (etikette), yanında ikinci kez yazmaz.
    expect(count(text, "Hedef 1,017–1,023")).toBe(1);
    expect(count(text, "Hedef en çok 20 mg/L")).toBe(1);
  });

  it("yalnız balıklı hedefte ölçülmemiş değerlerin hedefini de yazar (en çok değerli nitrat dahil)", () => {
    const text = section(assessMarineWater("saltwater", fish, reading({})));
    expect(text).toContain("Özgül ağırlık — Ölçüm yok Hedef 1,017–1,023");
    expect(text).toContain("pH — Ölçüm yok Hedef 8–8,2");
    expect(text).toContain("Nitrat — Ölçüm yok Hedef en çok 20 mg/L");
    expect(text).toContain("Sıcaklık — Canlılara göre OATA'nın aralığı 24–27 °C");
  });

  it("omurgasızlı hedefte KH'yi değerlendirir, nitrat ve fosfatı türe bağlı bilgi olarak gösterir", () => {
    const text = section(assessMarineWater("saltwater", withShrimp, reading({ specificGravity: 1.025, nitrate: 30 })));
    expect(text).toContain("Omurgasızlı akvaryum hedefi Akvaryumda deniz omurgasızı (karides, salyangoz, anemon gibi) kayıtlı.");
    expect(text).toContain("Özgül ağırlık 1,025 Hedefte Hedef 1,024–1,026");
    // Ölçüm yokken de hedef yazar (Codex 1. tur görüşü).
    expect(text).toContain("pH — Ölçüm yok Hedef 8–8,2");
    expect(text).toContain("KH — Ölçüm yok Hedef 8–12 dKH");
    expect(text).toContain("Nitrat 30 mg/L Türe bağlı OATA'nın aralığı 5–10 mg/L");
    expect(text).toContain("Fosfat — Türe bağlı OATA'nın aralığı 0,04–0,1 mg/L");
    expect(text).toContain("Sıcaklık — Canlılara göre OATA'nın aralığı 24–26 °C");
  });

  it("iki hedefin de dışındaki özgül ağırlığı tehlike rengiyle gösterir", () => {
    const html = renderToStaticMarkup(createElement(MarineWaterSection, { marine: assessMarineWater("saltwater", fish, reading({ specificGravity: 1.03 })) }));
    expect(textOf(html)).toContain("Özgül ağırlık 1,03 Hedef 1,017–1,023");
    expect(html).toMatch(/bg-red-400\/10 text-red-300[^>]*>Hedef 1,017–1,023/);
  });
});
