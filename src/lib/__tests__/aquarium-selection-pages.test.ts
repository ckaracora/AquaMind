import { createElement, type ComponentType, type ReactElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { messagesFor } from "@aquamind/localization";
import { aquariums as seedAquariums } from "@/data/mock-data";
import type { Aquarium, Equipment, MaintenanceTask, Plant, WaterParameters } from "@/types/aquarium";

// Ekipman, bitki, su ve bakım sayfalarında seçili akvaryum (hata 2026-11-11; canlılar sayfasıyla aynı kök neden, bkz.
// aquarium-selection.test.ts). Sağlayıcı ilk çizimde örnek veriyle başlar, kullanıcının akvaryumları depodan sonra gelir. Sayfalar seçimi
// ilk çizimde saklıyordu: ekipman penceresi çöküyordu; bitki, su ve bakım pencereleri adsız açılıp kaydı örnek verideki (ya da boş)
// akvaryum kimliğiyle yazıyordu; kullanıcının kendi kayıtları görünmüyordu; hiç akvaryum yokken "ekle" düğmeleri açık kalıyordu.
// Sayfa gerçek bileşen çıktısıyla, iki kez çizilerek sınanır: önce örnek veriyle, sonra kullanıcının akvaryumlarıyla. Sayfanın kendi
// `useState` değerleri iki çizim arasında React'teki gibi korunur (ilk çizimin başlangıç değeri kalır). Kullanıcının düğmeye basması
// (pencereyi açması) ikinci çizimden önce sayfanın pencere durumuna yazılır. Veri ve dil sağlayıcısı yerine sınama değerleri verilir.
const store = vi.hoisted(() => ({
  data: {} as Record<string, unknown[]>,
  /** Sayfanın kendi durumları: ilk `pageStates` `useState` çağrısı. Sonrakiler (pencere bileşenleri) React'in kendi durumudur. */
  slots: new Map<number, unknown>(),
  pageStates: 0,
  calls: 0,
  search: "",
  effects: [] as (() => void)[],
  /** Sağlayıcıya eklenen kayıtlar. */
  added: [] as unknown[],
  /** Açık penceredeki formun gönderme işlevi (ortak pencere kabuğundan alınır). */
  submit: undefined as undefined | ((event: unknown) => void),
  /** Bitki penceresine verilen akvaryum. */
  plantForm: undefined as undefined | { aquariumId: string; aquariumName: string },
}));
vi.mock("react", async (importOriginal) => {
  const react = await importOriginal<typeof import("react")>();
  const useState = (initial: unknown) => {
    const index = store.calls++;
    if (index >= store.pageStates) return react.useState(initial);
    if (!store.slots.has(index)) store.slots.set(index, initial);
    const set = (next: unknown) => store.slots.set(index, typeof next === "function" ? (next as (value: unknown) => unknown)(store.slots.get(index)) : next);
    return [store.slots.get(index), set];
  };
  return { ...react, useState, useEffect: (effect: () => void) => { store.effects.push(effect); } };
});
vi.mock("@/providers/aquarium-provider", () => {
  const add = (item: unknown) => { store.added.push(item); };
  const noop = () => {};
  return {
    useAquariums: () => ({
      aquariums: [], equipment: [], plants: [], waterReadings: [], maintenanceTasks: [], livestock: [], ...store.data,
      addEquipment: add, updateEquipment: noop, removeEquipment: noop, addPlant: add, removePlant: noop,
      addWaterReading: add, addMaintenanceTask: add, completeMaintenanceTask: noop,
    }),
  };
});
vi.mock("@/providers/i18n-provider", async () => {
  const { messagesFor: messages } = await import("@aquamind/localization");
  return { useI18n: () => ({ t: messages("tr"), locale: "tr" }) };
});
vi.mock("@/lib/use-display-format", async () => {
  const { createDisplayFormat: format } = await import("@aquamind/localization");
  return { useDisplayFormat: () => format("tr", { temperature: "celsius", volume: "liters", dateFormat: "day-first" }) };
});
// Ayrı parça yükleyen kancalar: çizimde yükleme yapılmaz; sayfanın durum sırasına da girmezler.
vi.mock("@/lib/use-equipment-text", () => ({ useEquipmentText: () => (text: string) => text }));
vi.mock("@/lib/use-plant-catalog", () => ({ usePlantCatalog: () => ({ catalog: undefined, failed: false, retry: () => {} }) }));
vi.mock("@/lib/use-catalog-lookup", () => ({ useCatalogLookup: () => ({ lookup: undefined, failed: false, retry: () => {} }) }));
vi.mock("next/navigation", () => ({ useSearchParams: () => new URLSearchParams(store.search) }));
vi.mock("@/components/app-shell", () => ({ AppShell: ({ children }: { children: ReactNode }) => children }));
vi.mock("@/components/page-header", () => ({ PageHeader: () => null }));
// Ortak pencere kabuğu: içindeki formun gönderme işlevi saklanır; böylece kaydın hangi akvaryuma yazıldığı sınanır.
vi.mock("@/components/modal-dialog", async () => {
  const { createElement: h } = await vi.importActual<typeof import("react")>("react");
  return {
    ModalDialog: ({ children }: { children: ReactElement<{ onSubmit?: (event: unknown) => void }> }) => {
      store.submit = children.props.onSubmit;
      return h("div", { role: "dialog" }, children);
    },
  };
});
// Bitki penceresi: sayfanın verdiği akvaryum kimliği saklanır (pencere kaydı bu kimlikle yazar, src/components/plant-catalog.tsx).
vi.mock("@/components/plant-catalog", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/components/plant-catalog")>();
  const { createElement: h } = await vi.importActual<typeof import("react")>("react");
  return {
    ...actual,
    PlantForm: ({ aquariumId, aquariumName }: { aquariumId: string; aquariumName: string }) => {
      store.plantForm = { aquariumId, aquariumName };
      return h("div", { role: "dialog" }, h("p", { className: "eyebrow text-aqua" }, aquariumName));
    },
  };
});
const { default: EquipmentPage } = await import("@/app/equipment/page");
const { default: PlantsPage } = await import("@/app/plants/page");
const { default: WaterPage } = await import("@/app/water/page");
const { default: MaintenancePage } = await import("@/app/maintenance/page");

const t = messagesFor("tr");
const tank = (id: string, name: string, type: Aquarium["type"] = "freshwater"): Aquarium => ({ id, name, type, lengthCm: 60, widthCm: 30, heightCm: 35, netVolumeLiters: 54, setupDate: "2026-01-01" });
const own = [tank("own-1", "Salon"), tank("own-2", "Resif", "saltwater")];
// İlk çizimde sayfanın gördüğü örnek verideki ilk akvaryum; kullanıcının akvaryumları arasında yoktur.
const sampleId = seedAquariums[0].id;
const device = (aquariumId: string, category: Equipment["category"], brand = "Deneme Marka"): Equipment => ({ id: `e-${aquariumId}-${category}`, aquariumId, category, brand, model: "Model X", installedAt: "2026-01-01" });
const plantOf = (aquariumId: string): Plant => ({ id: `p-${aquariumId}`, aquariumId, name: "Deneme bitkisi", quantity: 2, addedAt: "2026-01-01" });
const readingOf = (aquariumId: string): WaterParameters => ({ id: `w-${aquariumId}`, aquariumId, measuredAt: "2026-11-10T10:00:00Z", ph: 6.8 });
const taskOf = (aquariumId: string): MaintenanceTask => ({ id: `m-${aquariumId}`, aquariumId, type: "filter_cleaning", title: "Deneme bakımı", dueAt: "2026-11-20T10:00:00Z" });

/** Sayfanın kendi `useState` sayısı ve pencere durumunun sırası (sayfanın kaynağındaki sırayla). */
type PageSetup = { page: ComponentType; states: number; open: number };
// 0 seçili akvaryum, 1 tür süzgeci, 2 arama, 3 ekleme penceresi, 4 değeri düzenlenen ekipman.
const equipmentPage: PageSetup = { page: EquipmentPage, states: 5, open: 3 };
// 0 seçili akvaryum, 1 konum süzgeci, 2 arama, 3 ekleme penceresi.
const plantsPage: PageSetup = { page: PlantsPage, states: 4, open: 3 };
// 0 seçili akvaryum, 1 ölçüm penceresi.
const waterPage: PageSetup = { page: WaterPage, states: 2, open: 1 };
// 0 seçili akvaryum, 1 süzgeç, 2 bakım penceresi.
const maintenancePage: PageSetup = { page: MaintenancePage, states: 3, open: 2 };

type ShowOptions = {
  /** İlk çizimdeki akvaryumlar (varsayılan: örnek veri). */
  first?: Aquarium[];
  /** İkinci çizimdeki akvaryumlar (varsayılan: kullanıcının iki akvaryumu). */
  then?: Aquarium[];
  data?: Record<string, unknown[]>;
  search?: string;
  /** İki çizim arasında kullanıcı "ekle" düğmesine bastı. */
  open?: boolean;
  /** İki çizim arasında sayfanın durumuna yazılan değerler (sıra → değer). */
  set?: Record<number, unknown>;
};
const show = (setup: PageSetup, options: ShowOptions = {}) => {
  store.pageStates = setup.states;
  store.slots = new Map();
  store.search = options.search ?? "";
  store.added = [];
  store.submit = undefined;
  store.plantForm = undefined;
  const draw = (aquariums: Aquarium[]) => {
    store.data = { ...options.data, aquariums };
    store.calls = 0;
    store.effects = [];
    return renderToStaticMarkup(createElement(setup.page));
  };
  draw(options.first ?? seedAquariums);
  if (options.open) store.slots.set(setup.open, true);
  for (const [index, value] of Object.entries(options.set ?? {})) store.slots.set(Number(index), value);
  const html = draw(options.then ?? own);
  // Ekipman ve bitki sayfası URL seçimini efektte alır; kullanıcı verisi geldikten sonraki efekti de çalıştır.
  if (options.search && (setup === equipmentPage || setup === plantsPage)) {
    vi.stubGlobal("location", { search: `?${options.search}` });
    try { store.effects[0]?.(); } finally { vi.unstubAllGlobals(); }
    return draw(options.then ?? own);
  }
  return html;
};
/** Açık penceredeki formu verilen alan değerleriyle gönderir. */
const send = (values: Record<string, string>) => {
  vi.stubGlobal("FormData", class { get(key: string) { return values[key] ?? null; } });
  try { store.submit?.({ preventDefault: () => {}, currentTarget: {} }); } finally { vi.unstubAllGlobals(); }
};
const decode = (html: string) => html.replace(/&#x27;/g, "'").replace(/&quot;/g, "\"").replace(/&amp;/g, "&");
const plain = (html: string) => decode(html.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ");
/** Penceredeki akvaryum adı (pencere başlığının üstündeki satır). */
const dialogAquarium = (html: string) => /role="dialog"[\s\S]*?<p class="eyebrow text-aqua">([^<]*)<\/p>/.exec(html)?.[1];
/** Akvaryum seçim kutusunda (sayfanın ilk seçim kutusu; penceredekiler sonra gelir) seçili seçenek. */
const chosenOption = (html: string) => (/<select[^>]*>[\s\S]*?<\/select>/.exec(html)?.[0].match(/<option[^>]*>/g) ?? []).find((tag) => tag.includes("selected"))?.match(/value="([^"]*)"/)?.[1];
/** Kapalı düğmenin açılış etiketi (`disabled` niteliği; sınıftaki `disabled:` biçimi sayılmaz). */
const disabledButton = /^<button[^>]*\sdisabled=""/;
/** Sayfanın "ekle" düğmesi (penceredekinden önce gelir). */
const buttonWith = (html: string, label: string) => (html.match(/<button[^>]*>[\s\S]*?<\/button>/g) ?? []).find((button) => plain(button).includes(label));

/** Hiç akvaryum yokken: pencere açılmaz, "ekle" düğmesi kapalı, önce akvaryum oluşturma notu görünür. İlk çizim örnek veriyle de
 *  (sayfa doğrudan açıldı), boş listeyle de (sağlayıcı yüklüyken sayfaya geçildi) sınanır. */
const expectNoAquariumState = (setup: PageSetup, addLabel: string) => {
  for (const first of [seedAquariums, []]) {
    const html = show(setup, { first, then: [], open: true });
    expect(html).not.toContain('role="dialog"');
    expect(buttonWith(html, addLabel)).toMatch(disabledButton);
    expect(plain(html)).toContain(t.water.noAquarium);
  }
  const html = show(setup, { first: own });
  expect(buttonWith(html, addLabel)).not.toMatch(disabledButton);
  expect(plain(html)).not.toContain(t.water.noAquarium);
};

describe("ekipman sayfasında seçili akvaryum", () => {
  it("örnek veriden kalan seçimde kullanıcının ilk akvaryumu seçilir ve ekipmanı görünür", () => {
    expect(own.some((aquarium) => aquarium.id === sampleId)).toBe(false);
    const html = show(equipmentPage, { data: { equipment: [device("own-1", "other")] } });
    expect(chosenOption(html)).toBe("own-1");
    expect(plain(html)).toContain("Deneme Marka");
    expect(plain(html)).not.toContain(t.equipment.emptyTitle);
  });

  it("örnek veriden kalan seçimde 'Ekipman ekle' penceresi çökmez, kullanıcının ilk akvaryumuyla açılır", () => {
    const html = show(equipmentPage, { open: true });
    expect(dialogAquarium(html)).toBe("Salon");
  });

  it("seçilen akvaryum listede varsa o kullanılır", () => {
    const html = show(equipmentPage, { open: true, set: { 0: "own-2" } });
    expect(dialogAquarium(html)).toBe("Resif");
    expect(chosenOption(html)).toBe("own-2");
  });

  it("değer penceresi kaydın akvaryumuyla açılır; akvaryumu listede olmayan kayıtta açılmaz, sayfa çökmez", () => {
    expect(dialogAquarium(show(equipmentPage, { set: { 4: device("own-2", "heater") } }))).toBe("Resif");
    expect(show(equipmentPage, { set: { 4: device(sampleId, "heater") } })).not.toContain('role="dialog"');
  });

  it("hiç akvaryum yoksa pencere açılmaz, düğme kapalıdır ve önce akvaryum oluşturma notu görünür", () => {
    expectNoAquariumState(equipmentPage, t.equipment.add);
  });
});

describe("bitki sayfasında seçili akvaryum", () => {
  it("örnek veriden kalan seçimde kullanıcının ilk akvaryumu seçilir ve bitkileri görünür", () => {
    const html = show(plantsPage, { data: { plants: [plantOf("own-1")] } });
    expect(chosenOption(html)).toBe("own-1");
    expect(plain(html)).toContain("Deneme bitkisi");
    expect(plain(html)).not.toContain(t.plants.emptyTitle);
  });

  it("'Bitki ekle' penceresi kullanıcının akvaryumuyla açılır; kayıt örnek verideki kimlikle yazılmaz", () => {
    const html = show(plantsPage, { open: true });
    expect(dialogAquarium(html)).toBe("Salon");
    expect(store.plantForm).toEqual({ aquariumId: "own-1", aquariumName: "Salon" });
    show(plantsPage, { open: true, set: { 0: "own-2" } });
    expect(store.plantForm).toEqual({ aquariumId: "own-2", aquariumName: "Resif" });
  });

  it("hiç akvaryum yoksa pencere açılmaz, düğme kapalıdır ve önce akvaryum oluşturma notu görünür", () => {
    expectNoAquariumState(plantsPage, t.common.addPlant);
  });
});

describe("su sayfasında seçili akvaryum", () => {
  it("örnek veriden kalan seçimde kullanıcının ilk akvaryumu seçilir; ölçümleri görünür, yeni ölçüm o akvaryuma yazılır", () => {
    const html = show(waterPage, { open: true, data: { waterReadings: [readingOf("own-1")] } });
    expect(chosenOption(html)).toBe("own-1");
    expect(plain(html)).toContain(t.common.recordCount(1));
    expect(dialogAquarium(html)).toBe("Salon");
    send({ measuredAt: "2026-11-11T10:00", ph: "7" });
    expect(store.added).toHaveLength(1);
    expect(store.added[0]).toMatchObject({ aquariumId: "own-1", ph: 7 });
  });

  it("adresteki akvaryum (?aquarium=) kullanıcının akvaryumları gelince seçilir; listede yoksa ilki", () => {
    const html = show(waterPage, { open: true, search: "aquarium=own-2" });
    expect(chosenOption(html)).toBe("own-2");
    expect(dialogAquarium(html)).toBe("Resif");
    expect(chosenOption(show(waterPage, { search: "aquarium=yok" }))).toBe("own-1");
  });

  it("hiç akvaryum yoksa pencere açılmaz, düğme kapalıdır ve önce akvaryum oluşturma notu görünür", () => {
    expectNoAquariumState(waterPage, t.common.addReading);
  });
});

describe("bakım sayfasında seçili akvaryum", () => {
  it("örnek veriden kalan seçimde kullanıcının ilk akvaryumu seçilir; bakımları görünür, yeni bakım o akvaryuma yazılır", () => {
    const html = show(maintenancePage, { open: true, data: { maintenanceTasks: [taskOf("own-1")] } });
    expect(chosenOption(html)).toBe("own-1");
    expect(plain(html)).toContain("Deneme bakımı");
    expect(dialogAquarium(html)).toBe("Salon");
    send({ type: "water_change", title: "", dueAt: "2026-11-12T10:00", recurrenceDays: "", amountPercent: "", amountLiters: "", notes: "" });
    expect(store.added).toHaveLength(1);
    expect(store.added[0]).toMatchObject({ aquariumId: "own-1", type: "water_change" });
  });

  it("adresteki akvaryum (?aquarium=) kullanıcının akvaryumları gelince seçilir; listede yoksa ilki", () => {
    const html = show(maintenancePage, { open: true, search: "aquarium=own-2" });
    expect(chosenOption(html)).toBe("own-2");
    expect(dialogAquarium(html)).toBe("Resif");
    expect(chosenOption(show(maintenancePage, { search: "aquarium=yok" }))).toBe("own-1");
  });

  it("hiç akvaryum yoksa pencere açılmaz, düğme kapalıdır ve önce akvaryum oluşturma notu görünür", () => {
    expectNoAquariumState(maintenancePage, t.common.addMaintenance);
  });
});


describe("efektle URL'den akvaryum seçimi", () => {
  it.each([equipmentPage, plantsPage])("kullanıcı listesi yüklendiğinde URL kimliği seçilir, olmayan kimlik ilk akvaryuma düşer", (setup) => {
    const html = show(setup, { open: true, search: "aquarium=own-2" });
    expect(chosenOption(html)).toBe("own-2");
    expect(dialogAquarium(html)).toBe("Resif");
    expect(chosenOption(show(setup, { search: "aquarium=missing" }))).toBe("own-1");
  });
});
