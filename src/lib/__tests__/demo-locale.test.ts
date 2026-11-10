import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { aquariums, equipment, localizeDemoRows, maintenanceTasks, plants } from "@/data/mock-data";
import type { Aquarium } from "@/types/aquarium";

// Demo kayıtların metinleri seçili dilde (karar 0021, 5. paket): yalnız ekranda, kimliğe göre; demo olmayan satıra dokunulmaz.

describe("demo kayıtların dili", () => {
  it("İngilizcede demo metinleri İngilizce; Türkçeye dönünce Türkçe", () => {
    const english = localizeDemoRows("aquariums", aquariums, "en");
    expect(english[0]).toMatchObject({ id: "aqua-1", name: "Amazon River", description: "Densely planted South American biotope", netVolumeLiters: 180 });
    expect(localizeDemoRows("aquariums", english, "tr")).toEqual(aquariums);
    expect(localizeDemoRows("maintenanceTasks", maintenanceTasks, "en").map((task) => task.title)).toEqual(["30% water change", "Clean the filter's prefilter sponge", "Trim the background plants"]);
    expect(localizeDemoRows("plants", plants, "en").map((plant) => [plant.name, plant.position])).toEqual([["Amazon sword", "Arka plan"], ["Anubias Nana", "Orta plan"], ["Java moss", "Kök üzeri"]]);
    expect(localizeDemoRows("equipment", equipment, "en")[0].specifications).toBe("1100 L/h");
  });

  it("değişiklik yoksa aynı dizi; demo olmayan satır olduğu gibi kalır; silinen demo satırı geri gelmez", () => {
    expect(localizeDemoRows("aquariums", aquariums, "tr")).toBe(aquariums);
    const own: Aquarium = { ...aquariums[0], id: "benim", name: "Salon" };
    expect(localizeDemoRows("aquariums", [own], "en")).toEqual([own]);
    const remaining = maintenanceTasks.filter((task) => task.id !== "m2");
    expect(localizeDemoRows("maintenanceTasks", remaining, "en").map((task) => task.id)).toEqual(["m1", "m3"]);
  });

  it.each(["en", "es"] as const)("demo metinlerinde Türkçe harf yok; her demo satırının metni çevrilmiş (%s)", (locale) => {
    for (const [collection, rows] of [["aquariums", aquariums], ["maintenanceTasks", maintenanceTasks], ["equipment", equipment]] as const) {
      const localized = localizeDemoRows(collection, rows as Array<{ id: string }>, locale);
      expect(JSON.stringify(localized), `${locale} ${collection}`).not.toMatch(/[çğıöşüÇĞİÖŞÜ]/);
    }
    expect(localizeDemoRows("plants", plants, locale)[0].name).not.toBe(plants[0].name);
    expect(localizeDemoRows("maintenanceTasks", maintenanceTasks, "es").map((task) => task.title)).toEqual(["Cambio de agua del 30%", "Limpiar la esponja del prefiltro", "Podar las plantas del fondo"]);
  });

  it("sağlayıcı yalnız hâlâ demo olan koleksiyonları yerelleştirir", () => {
    const source = readFileSync("src/providers/aquarium-provider.tsx", "utf8");
    for (const [flag, setter, collection] of [["aquariums", "setAquariums", "aquariums"], ["maintenanceTasks", "setMaintenanceTasks", "maintenanceTasks"], ["plants", "setPlants", "plants"], ["equipment", "setEquipment", "equipment"]]) {
      expect(source).toContain(`if (flags.${flag}) ${setter}((rows) => localizeDemoRows("${collection}", rows, locale));`);
    }
  });
});
