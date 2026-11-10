import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { tableForLocale } from "@/lib/use-equipment-text";

// Ekipman çevirmeninin kancası ve ekranlara bağlanması (karar 0021, 7. paket).

describe("ekipman çevirmeni", () => {
  it("yüklenen tablo yalnız kendi dilinde kullanılır; dil değişince eski dilin tablosu kullanılmaz", () => {
    const english = { a: "English" };
    expect(tableForLocale({ locale: "en", texts: english }, "en")).toBe(english);
    expect(tableForLocale({ locale: "en", texts: english }, "es")).toBeUndefined();
    expect(tableForLocale({ locale: "es" }, "es")).toBeUndefined();
  });

  it("ekranlar katalog metnini ekipman çevirmeninden geçirir (kart, ekleme penceresi, sağlık analizindeki kapasite notu)", () => {
    const equipment = readFileSync("src/app/equipment/page.tsx", "utf8");
    expect(equipment.match(/useEquipmentText\(\)/g)).toHaveLength(2);
    expect(equipment).toContain("equipmentSpecsText(profileForEquipment(item), item.specifications, equipmentText,");
    expect(equipment).toContain("profileSpecsText(profile, equipmentText,");
    expect(equipment).toContain("equipmentText(profile.capacityDataNote)");
    expect(equipment).not.toContain("catalogText");
    const health = readFileSync("src/app/aquariums/[id]/health/page.tsx", "utf8");
    expect(health).toContain("engineWarningText(engineTexts,engineFormat,warning,catalogText,equipmentText)");
    // Tablo yalnız kapasite notu olan cihaz varsa yüklenir.
    expect(health).toMatch(/useEquipmentText\(Boolean\(lookup&&devices\.some\(item=>lookup\.profileForEquipment\(item\)\?\.capacityDataNote\)\)\)/);
  });
});
