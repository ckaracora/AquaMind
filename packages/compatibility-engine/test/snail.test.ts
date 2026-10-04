import { describe, expect, it } from "vitest";
import type { Aquarium, Livestock } from "@aquamind/domain";
import { createAnalyzer, type KnowledgeResolver, type SpeciesProfileInput } from "../src";

// Kural seti 1.7.0: salyangoz uyarısı (docs/DECISIONS/0013-salyangoz-uyarisi.md). Stub kayıtlarla sınanır.

const base = { minVolumeL: 10, minGroup: 1, temperature: [22, 28] as [number, number], ph: [6, 8] as [number, number], flow: "medium" as const, wasteFactor: 0.3 };
const species: Record<string, SpeciesProfileInput & { category: Livestock["category"] }> = {
  puffer: { id: "puffer", commonName: "Balon", adultSizeCm: 3, category: "fish", ...base, behavior: { eatsSnails: { source: "Seriously Fish" } } },
  loach: { id: "loach", commonName: "Çöpçü", adultSizeCm: 6, category: "fish", ...base, behavior: { eatsSnails: { source: "Fishkeeper", condition: "Yalnızca küçük salyangozlar" } } },
  disputed: { id: "disputed", commonName: "Tartışmalı", adultSizeCm: 6, category: "fish", ...base, behavior: { eatsSnails: { source: "Practical Fishkeeping", conflict: true } } },
  peaceful: { id: "peaceful", commonName: "Barışçıl", adultSizeCm: 4, category: "fish", ...base },
  nerite: { id: "nerite", commonName: "Nerit", adultSizeCm: 3, category: "snail", ...base },
  apple: { id: "apple", commonName: "Elma salyangozu", adultSizeCm: 6, category: "snail", ...base },
};

const resolver: KnowledgeResolver = {
  speciesForLivestock: (item) => (item.catalogId ? species[item.catalogId] : undefined),
  profileForEquipment: () => undefined,
  isVerifiedSpeciesProfile: (profile) => profile !== undefined,
  isVerifiedEquipmentProfile: () => false,
};
const analyze = createAnalyzer(resolver);
const tank: Aquarium = { id: "a", name: "Stub", type: "freshwater", lengthCm: 150, widthCm: 50, heightCm: 50, netVolumeLiters: 400, setupDate: "2026-01-01" };
const animal = (id: string): Livestock => ({ id: `l-${id}`, aquariumId: "a", catalogId: id, commonName: species[id].commonName, category: species[id].category, quantity: 1, addedAt: "2026-01-01" });
const run = (...ids: string[]) => analyze(tank, ids.map(animal), []);
const snailWarnings = (result: ReturnType<typeof analyze>) => result.warnings.filter((warning) => warning.title === "Salyangozlar yenebilir");
const compatibility = (result: ReturnType<typeof analyze>) => result.metrics.find((metric) => metric.key === "compatibility")!;

describe("salyangoz: kaynağı açıkça salyangoz yer diyen balık", () => {
  it("salyangozla birlikteyse sarı uyarı verir; adları, kaynağın notunu ve kaynağı söyler", () => {
    const [warning] = snailWarnings(run("puffer", "loach", "nerite", "apple"));
    expect(warning.level).toBe("warning");
    expect(warning.message).toBe("Kaynaklara göre Balon ve Çöpçü salyangoz yer; Nerit ve Elma salyangozu risk altında olabilir. Çöpçü: Yalnızca küçük salyangozlar. Kaynak: Seriously Fish, Fishkeeper.");
  });

  it("salyangoz yoksa uyarı vermez", () => {
    expect(snailWarnings(run("puffer", "peaceful"))).toEqual([]);
  });

  it("kaynakları çelişen ya da bilgisi olmayan balık uyarı üretmez", () => {
    expect(snailWarnings(run("disputed", "peaceful", "nerite"))).toEqual([]);
  });

  it("tür uyumuna 30 puan ceza verir, ölçüt ayrıntısı uyarıyı söyler; genel durum tehlikeye düşmez", () => {
    const result = run("puffer", "nerite");
    expect(compatibility(result)).toMatchObject({ score: 70, detail: "Salyangozlar yenebilir" });
    expect(result.status).not.toBe("danger");
  });
});
