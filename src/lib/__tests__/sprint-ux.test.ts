import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { loadLocaleBundle, messagesFor } from "@aquamind/localization";
import { primaryNavigationItems } from "@/data/navigation";
import { demoRowsForToday, localizeDemoRows, maintenanceTasks as seedTasks, waterReadings as seedReadings } from "@/data/mock-data";
import { editedLivestock } from "@/components/livestock-edit-dialog";
import { ADD_PARAM, addRecordHref, addRequested } from "@/lib/aquarium-links";
import { equipmentModelMatches, visibleEquipmentModels } from "@/lib/equipment-model-search";
import { completeMaintenance, nextDueAt } from "@/lib/maintenance-recurrence";
import { chartHasValues, chartSegments } from "@/lib/water-chart";
import type { Livestock, MaintenanceTask, WaterParameters } from "@/types/aquarium";

// 2026-11-14 sprinti, kolay düzeltmeler: tekrarlayan bakım, uydurma noktasız grafik, bugüne göre örnek tarihler, canlı düzenleme, akvaryum
// sayfasından doğrudan açılan pencereler, markasız model araması, kaldırılan "yakında" öğeleri, yeni metinler.
await loadLocaleBundle("en");
await loadLocaleBundle("es");
const read = (path: string) => readFileSync(path, "utf8");

describe("tekrarlayan bakım", () => {
  const task: MaintenanceTask = { id: "m1", aquariumId: "a", type: "water_change", title: "%30 su değişimi", dueAt: "2026-11-10T18:00:00", recurrenceDays: 7, amountPercent: 30 };

  it("tamamlanınca sonraki görev tamamlanma tarihi + aralıkta, eski görevin saatinde oluşur", () => {
    const done = new Date("2026-11-12T09:15:00");
    const next = completeMaintenance([task], "m1", done, () => "new");
    expect(next).toHaveLength(2);
    expect(next[1]).toMatchObject({ id: "m1", completedAt: done.toISOString() });
    expect(next[0]).toMatchObject({ id: "new", title: task.title, type: task.type, recurrenceDays: 7, amountPercent: 30 });
    expect(next[0].completedAt).toBeUndefined();
    const due = new Date(next[0].dueAt);
    expect([due.getFullYear(), due.getMonth() + 1, due.getDate(), due.getHours(), due.getMinutes()]).toEqual([2026, 11, 19, 18, 0]);
  });

  it("tekrarlamasız görev yalnız tamamlanır; tamamlanmış görev yeniden tamamlanmaz", () => {
    const once = { ...task, recurrenceDays: undefined };
    expect(completeMaintenance([once], "m1", new Date(), () => "new")).toHaveLength(1);
    expect(nextDueAt(once, new Date())).toBeUndefined();
    const completed = completeMaintenance([task], "m1", new Date(), () => "new");
    expect(completeMaintenance(completed, "m1", new Date(), () => "again")).toBe(completed);
    expect(completeMaintenance([task], "yok", new Date(), () => "new")).toEqual([task]);
  });

  it("silme ortak onay penceresiyle; sayfalarda window.confirm yok", () => {
    for (const file of ["src/app/maintenance/page.tsx", "src/app/livestock/page.tsx", "src/app/equipment/page.tsx"]) {
      expect(read(file), file).not.toMatch(/\bconfirm\(t\./);
      expect(read(file), file).toContain("<ConfirmDialog");
    }
    expect(read("src/app/maintenance/page.tsx")).toContain("removeMaintenanceTask(removing.id)");
  });
});

describe("su grafiği uydurma nokta çizmez", () => {
  const at = (day: number, values: Partial<WaterParameters>): WaterParameters => ({ id: `w${day}`, aquariumId: "a", measuredAt: `2026-11-0${day}T09:00:00Z`, ...values });

  it("girilmeyen değer boşluk bırakır, tek kalan değer nokta olur", () => {
    const readings = [at(1, { ph: 7, temperature: 25 }), at(2, { temperature: 26 }), at(3, { ph: 6.5 }), at(4, { ph: 6.8, temperature: 24 })];
    const ph = chartSegments(readings, "ph", 5, 9);
    expect(ph.map((segment) => segment.length)).toEqual([1, 2]);
    expect(ph[0][0].x).toBe(10);
    expect(ph[1][1].x).toBe(90);
    const temperature = chartSegments(readings, "temperature", 20, 30);
    expect(temperature.map((segment) => segment.map((point) => point.x))).toEqual([[10, 10 + 80 / 3], [90]]);
    expect(chartSegments([at(1, {}), at(2, {})], "ph", 5, 9)).toEqual([]);
    expect(chartHasValues([at(1, { ph: 7 }), at(2, {})])).toBe(false);
    expect(chartHasValues(readings)).toBe(true);
  });

  it("sayfada eski varsayılan değerler yok", () => {
    const page = read("src/app/water/page.tsx");
    expect(page).not.toContain("r.ph ?? 7");
    expect(page).not.toContain("r.temperature ?? 25");
  });
});

describe("örnek akvaryumun tarihleri bugüne göre", () => {
  it("ölçümler son iki haftada, bakımlar önümüzdeki günlerde; dil değişince tarih korunur", () => {
    const now = new Date(2026, 10, 14, 12, 0);
    const { waterReadings, maintenanceTasks } = demoRowsForToday(now);
    const days = (iso: string) => (new Date(iso).getTime() - now.getTime()) / 86_400_000;
    for (const row of waterReadings) expect(days(row.measuredAt)).toBeLessThan(0), expect(days(row.measuredAt)).toBeGreaterThan(-16);
    for (const row of maintenanceTasks) expect(days(row.dueAt)).toBeGreaterThan(0), expect(days(row.dueAt)).toBeLessThan(9);
    expect(waterReadings.map((row) => row.id)).toEqual(seedReadings.map((row) => row.id));
    const english = localizeDemoRows("maintenanceTasks", maintenanceTasks, "en");
    expect(english.map((row) => row.dueAt)).toEqual(maintenanceTasks.map((row) => row.dueAt));
    expect(english[0].title).toBe("30% water change");
    expect(localizeDemoRows("maintenanceTasks", english, "tr").map((row) => row.title)).toEqual(seedTasks.map((row) => row.title));
  });
});

describe("canlı kaydını düzenleme", () => {
  const item: Livestock = { id: "l1", aquariumId: "a", catalogId: "neon-tetra", commonName: "Neon tetra", category: "fish", quantity: 10, gender: "mixed", addedAt: "2026-01-02" };
  const form = (values: Record<string, string>) => { const data = new FormData(); for (const [key, value] of Object.entries(values)) data.set(key, value); return data; };

  it("adet, cinsiyet, tarih ve not değişir; tür ve kimlik aynen kalır; geçersiz adet ya da tarih kaydı değiştirmez", () => {
    expect(editedLivestock(item, form({ quantity: "12", gender: "female", addedAt: "2026-02-03", notes: "  karantinadan geldi " }))).toEqual({ ...item, quantity: 12, gender: "female", addedAt: "2026-02-03", notes: "karantinadan geldi" });
    expect(editedLivestock(item, form({ quantity: "0", gender: "male", addedAt: "2026-02-03" }))).toBeUndefined();
    expect(editedLivestock(item, form({ quantity: "2.5", gender: "male", addedAt: "2026-02-03" }))).toBeUndefined();
    expect(editedLivestock(item, form({ quantity: "2", gender: "male", addedAt: "" }))).toBeUndefined();
    expect(editedLivestock(item, form({ quantity: "2", gender: "başka", addedAt: "2026-02-03" }))?.gender).toBe("unknown");
    expect(read("src/app/livestock/page.tsx")).toContain("<LivestockEditDialog");
  });
});

describe("akvaryum sayfasından ekleme penceresi doğrudan açılır", () => {
  it("bağlantılar ?add=1 taşır, sayfalar bunu okur", () => {
    expect(addRecordHref("/livestock", "a b")).toBe("/livestock?aquarium=a%20b&add=1");
    expect(addRequested("?aquarium=x&add=1")).toBe(true);
    expect(addRequested("?aquarium=x")).toBe(false);
    const detail = read("src/app/aquariums/[id]/page.tsx");
    for (const path of ["/livestock", "/equipment", "/water", "/maintenance"]) expect(detail, path).toContain(`addRecordHref("${path}", id)`);
    for (const page of ["src/app/livestock/page.tsx", "src/app/equipment/page.tsx", "src/app/plants/page.tsx"]) expect(read(page), page).toContain("addRequested(location.search)");
    for (const page of ["src/app/water/page.tsx", "src/app/maintenance/page.tsx"]) expect(read(page), page).toContain("ADD_PARAM");
    expect(ADD_PARAM).toBe("add");
  });
});

describe("ekipmanda markasız model araması", () => {
  it("arama seçili türdeki bütün markalarda arar; marka seçiliyken yalnız o marka; markayla başlayan yazım da bulunur", () => {
    expect(visibleEquipmentModels("filter", "", "")).toEqual([]);
    const any = visibleEquipmentModels("filter", "", "biomaster 350").map((item) => item.id);
    expect(any).toContain("oase-biomaster-350");
    expect(visibleEquipmentModels("filter", "", "oase biomaster 350").map((item) => item.id)).toContain("oase-biomaster-350");
    const oase = visibleEquipmentModels("filter", "Oase", "biomaster");
    expect(oase.length).toBeGreaterThan(1);
    expect(oase.every((item) => item.brand === "Oase")).toBe(true);
    expect(visibleEquipmentModels("lighting", "", "biomaster 350")).toEqual([]);
    expect(equipmentModelMatches(oase[0], "")).toBe(true);
    // Model seçilince marka kendiliğinden gelir.
    expect(read("src/app/equipment/page.tsx")).toContain("if (chosen && chosen.brand !== brand) setBrand(chosen.brand)");
  });
});

describe("boş ve yakında öğeler kaldırıldı; yeni formlar", () => {
  it("hesaplayıcılarda Yakında, menüde AquaMatch, misafir kutusu, slogan, sürüm satırı ve fotoğraf kartı yok", () => {
    expect(primaryNavigationItems.map((item) => item.key)).not.toContain("aquamatch");
    expect(read("src/app/calculators/page.tsx")).not.toContain("ComingSoon");
    for (const file of ["src/components/sidebar.tsx", "src/components/mobile-nav.tsx"]) {
      expect(read(file), file).not.toContain("t.account");
      expect(read(file), file).not.toContain("tagline");
      expect(read(file), file).not.toContain("comingSoon");
    }
    expect(read("src/app/settings/page.tsx")).not.toContain("settings.footer");
    expect(read("src/app/aquariums/new/page.tsx")).not.toContain("photoTitle");
    for (const locale of ["tr", "en", "es"] as const) {
      const m = messagesFor(locale) as unknown as Record<string, Record<string, unknown>>;
      expect(m.account, locale).toBeUndefined();
      expect(m.app.tagline, locale).toBeUndefined();
      expect((m.navigation.items as Record<string, string>).aquamatch, locale).toBeUndefined();
      expect(m.settings.footer, locale).toBeUndefined();
    }
  });

  it("yeni akvaryum formunda ölçüler boş gelir", () => {
    const page = read("src/app/aquariums/new/page.tsx");
    expect(page).toContain('useState({ length: "", width: "", height: "" })');
    expect(page).not.toContain("length: 100, width: 40, height: 50");
  });

  it("su ölçümü penceresi: açık adlar, üstte tek satır, tatlı suda özgül ağırlık yok", () => {
    const page = read("src/app/water/page.tsx");
    expect(page).toContain('key !== "specificGravity" || aquariumType !== "freshwater"');
    expect(page).toContain("{t.water.formHint}");
    expect(messagesFor("tr").water.formFields).toEqual({ gh: "Genel sertlik (GH)", kh: "Karbonat sertliği (KH)", ammonia: "Amonyak (NH₃/NH₄)", nitrite: "Nitrit (NO₂)", nitrate: "Nitrat (NO₃)", phosphate: "Fosfat (PO₄)", iron: "Demir (Fe)" });
    expect(messagesFor("tr").water.formHint).toBe("Hepsini doldurman gerekmez; testin neyi ölçüyorsa onu gir.");
  });

  it("yeni metinler üç dilde", () => {
    for (const locale of ["tr", "en", "es"] as const) {
      const m = messagesFor(locale);
      for (const text of [m.common.delete, m.common.cannotUndo, m.common.edit, m.maintenance.remove, m.maintenance.recurrenceHelp, m.livestock.editTitle, m.livestock.editHelp, m.water.formHint, m.livestock.form.searchAllHint, m.livestock.form.browseTitle, m.equipment.form.noModelMatchAnyBrand, m.livestock.form.didYouMean("X"), m.livestock.form.limitedCoverage("saltwater"), m.livestock.form.limitedCoverage("brackish")]) expect(text.length, locale).toBeGreaterThan(1);
    }
    expect(messagesFor("tr").livestock.form.limitedCoverage("saltwater")).toBe("Deniz kapsamı başlangıç düzeyinde; aradığın canlı listede olmayabilir. Listede olmayan canlı için hacim ve uyumluluk değerlendirmesi yapılamaz.");
    expect(messagesFor("en").livestock.form.didYouMean("Guppy")).toBe("Did you mean: Guppy?");
    expect(messagesFor("es").livestock.form.didYouMean("Guppy")).toBe("¿Quisiste decir: Guppy?");
  });
});
