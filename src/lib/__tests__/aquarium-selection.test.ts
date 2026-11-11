import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { messagesFor } from "@aquamind/localization";
import { aquariums as seedAquariums } from "@/data/mock-data";
import type { Aquarium, Livestock } from "@/types/aquarium";

// Canlılar sayfasında seçili akvaryum (hata 2026-11-11). Sağlayıcı ilk çizimde örnek veriyle başlar, kullanıcının kendi akvaryumları
// depodan sonra gelir. Sayfa seçimi ilk çizimde saklıyordu; kimlik örnek veride kalınca "Canlı ekle" penceresi akvaryumsuz açılıp
// çöküyordu ("Application error"). Sayfa gerçek bileşen çıktısıyla sınanır; veri ve dil sağlayıcısı yerine sınama değerleri verilir.
// Tarayıcı olmadan sayfa yeniden çizilemediği için ilk çizimden kalan durum (örnek verideki kimlik, açık pencere) sayfanın `useState`
// çağrılarına doğrudan konur.
const store = vi.hoisted(() => ({
  aquariums: [] as Aquarium[],
  livestock: [] as Livestock[],
  /** Sayfanın sıradaki `useState` çağrısına verilecek değer; olmayan sırada React'in kendi durumu çalışır. */
  state: new Map<number, unknown>(),
  calls: 0,
  effects: [] as (() => void)[],
}));
vi.mock("react", async (importOriginal) => {
  const react = await importOriginal<typeof import("react")>();
  const useState = (initial: unknown) => {
    const index = store.calls++;
    return store.state.has(index) ? [store.state.get(index), (next: unknown) => store.state.set(index, next)] : react.useState(initial);
  };
  return { ...react, useState, useEffect: (effect: () => void) => { store.effects.push(effect); } };
});
vi.mock("@/providers/aquarium-provider", () => ({
  useAquariums: () => ({ aquariums: store.aquariums, livestock: store.livestock, addLivestock: () => {}, removeLivestock: () => {} }),
}));
vi.mock("@/providers/i18n-provider", async () => {
  const { localeBundle: bundle, messagesFor: messages } = await import("@aquamind/localization");
  const { catalogTranslator: translator } = await import("@aquamind/localization/catalog");
  return { useI18n: () => ({ t: messages("tr"), locale: "tr", catalogText: translator("tr", bundle("tr")?.catalogSpecies) }) };
});
vi.mock("@/lib/use-display-format", async () => {
  const { createDisplayFormat: format } = await import("@aquamind/localization");
  return { useDisplayFormat: () => format("tr", { temperature: "celsius", volume: "liters", dateFormat: "day-first" }) };
});
vi.mock("@/components/app-shell", () => ({ AppShell: ({ children }: { children: ReactNode }) => children }));
vi.mock("@/components/page-header", () => ({ PageHeader: () => null }));
const { default: LivestockPage } = await import("@/app/livestock/page");
const { selectedAquarium } = await import("@/lib/aquarium-selection");

const t = messagesFor("tr");
const tank = (id: string, name: string, type: Aquarium["type"] = "freshwater"): Aquarium => ({ id, name, type, lengthCm: 60, widthCm: 30, heightCm: 35, netVolumeLiters: 54, setupDate: "2026-01-01" });
const own = [tank("own-1", "Salon"), tank("own-2", "Resif", "saltwater")];
// İlk çizimde sayfanın gördüğü örnek verideki ilk akvaryum; kullanıcının akvaryumları arasında yoktur.
const sampleId = seedAquariums[0].id;

// Sayfadaki `useState` sırası: 0 seçili akvaryum, 1 sınıf süzgeci, 2 arama, 3 pencere açık mı.
const render = (aquariums: Aquarium[], state: { selectedId?: string; open?: boolean } = {}) => {
  store.aquariums = aquariums;
  store.state = new Map<number, unknown>();
  if (state.selectedId !== undefined) store.state.set(0, state.selectedId);
  if (state.open !== undefined) store.state.set(3, state.open);
  store.calls = 0;
  store.effects = [];
  return renderToStaticMarkup(createElement(LivestockPage));
};
const decode = (html: string) => html.replace(/&#x27;/g, "'").replace(/&quot;/g, "\"").replace(/&amp;/g, "&");
const plain = (html: string) => decode(html.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ");
/** Penceredeki akvaryum adı (pencere başlığının üstündeki satır). */
const dialogAquarium = (html: string) => /role="dialog"[\s\S]*?<p class="eyebrow text-aqua">([^<]*)<\/p>/.exec(html)?.[1];
/** Akvaryum seçim kutusunda seçili seçenek. */
const chosenOption = (html: string) => (html.match(/<option[^>]*>/g) ?? []).find((tag) => tag.includes("selected"))?.match(/value="([^"]*)"/)?.[1];
/** Kapalı düğmenin açılış etiketi (`disabled` niteliği; sınıftaki `disabled:` biçimi sayılmaz). */
const disabledButton = /^<button[^>]*\sdisabled=""/;
/** Sayfanın "Canlı ekle" düğmesi (penceredekinden önce gelir). */
const addButton = (html: string) => (html.match(/<button[^>]*>[\s\S]*?<\/button>/g) ?? []).find((button) => plain(button).includes(t.common.addLivestock));

describe("akvaryum seçimi kuralı", () => {
  it("seçilen kimlik listede varsa o akvaryum, yoksa ilki, liste boşsa hiçbiri", () => {
    expect(selectedAquarium(own, "own-2")?.id).toBe("own-2");
    expect(selectedAquarium(own, sampleId)?.id).toBe("own-1");
    expect(selectedAquarium(own, "")?.id).toBe("own-1");
    expect(selectedAquarium(own, undefined)?.id).toBe("own-1");
    expect(selectedAquarium([], sampleId)).toBeUndefined();
    expect(selectedAquarium([], "")).toBeUndefined();
  });
});

describe("canlılar sayfasında seçili akvaryum", () => {
  it("örnek veriden kalan kimlikte 'Canlı ekle' penceresi çökmez, kullanıcının ilk akvaryumuyla açılır", () => {
    expect(own.some((aquarium) => aquarium.id === sampleId)).toBe(false);
    const html = render(own, { selectedId: sampleId, open: true });
    expect(html).toContain('role="dialog"');
    expect(dialogAquarium(html)).toBe("Salon");
    expect(chosenOption(html)).toBe("own-1");
  });

  it("seçilen akvaryum listede varsa o kullanılır", () => {
    const html = render(own, { selectedId: "own-2", open: true });
    expect(dialogAquarium(html)).toBe("Resif");
    expect(chosenOption(html)).toBe("own-2");
  });

  it("seçim yapılmamışsa (boş kimlik) ilk akvaryum kullanılır", () => {
    const html = render(own, { selectedId: "", open: true });
    expect(dialogAquarium(html)).toBe("Salon");
    expect(chosenOption(html)).toBe("own-1");
  });

  it("hiç akvaryum yoksa pencere açılmaz, düğme kapalıdır ve önce akvaryum oluşturma notu görünür", () => {
    const html = render([], { selectedId: sampleId, open: true });
    expect(html).not.toContain('role="dialog"');
    expect(addButton(html)).toMatch(disabledButton);
    expect(plain(html)).toContain(t.water.noAquarium);
  });

  it("akvaryum varken düğme açıktır ve akvaryum oluşturma notu görünmez", () => {
    const html = render(own, { selectedId: sampleId });
    expect(addButton(html)).not.toMatch(disabledButton);
    expect(plain(html)).not.toContain(t.water.noAquarium);
  });
});


it("canlılar sayfası kullanıcı listesi geldikten sonra URL'deki akvaryumu seçer", () => {
  render(own, { selectedId: "", open: true });
  vi.stubGlobal("location", { search: "?aquarium=own-2" });
  try { store.effects[0](); } finally { vi.unstubAllGlobals(); }
  expect(store.state.get(0)).toBe("own-2");
  expect(dialogAquarium(render(own, { selectedId: String(store.state.get(0)), open: true }))).toBe("Resif");
});
