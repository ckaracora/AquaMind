import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { analyzeAquarium } from "@/lib/health-analysis";
import { groupHealthWarnings, sortWarningsBySeverity, SPECIES_NOTE_CODES } from "@/lib/health-warning-groups";
import type { Aquarium, Livestock } from "@/types/aquarium";

// Sağlık sayfasındaki uyarıların ekrandaki düzeni (kullanılabilirlik turu, 2026-11-12, ürün sahibi onayı). Kırmızı uyarı sarıların altında
// kalıyordu; sorunsuz akvaryumda türlerin bakım notları sarı kutularla risk gibi görünüyordu; canlısı olmayan akvaryum "İyi 78" alıyordu.
// Sıralama ve gruplama yalnız ekran içindir; motorun sonucu, puanı ve altın fikstür değişmez.
type Level = "danger" | "warning";
const stub = (code: string, level: Level) => ({ code, level });
const aquarium: Aquarium = { id: "a", name: "Deneme", type: "freshwater", lengthCm: 80, widthCm: 35, heightCm: 40, netVolumeLiters: 100, setupDate: "2026-11-12" };
const animal = (id: string, catalogId: string, commonName: string, quantity: number): Livestock => ({ id, aquariumId: "a", catalogId, commonName, category: "fish", quantity, gender: "unknown", addedAt: "2026-11-12" });
const page = () => readFileSync("src/app/aquariums/[id]/health/page.tsx", "utf8");

describe("uyarıların ciddiyet sırası", () => {
  it("tehlike önce, sonra uyarı; aynı seviyede motorun sırası korunur ve girdi değişmez", () => {
    const input = [stub("w1", "warning"), stub("d1", "danger"), stub("w2", "warning"), stub("d2", "danger"), stub("w3", "warning")];
    const before = input.map((warning) => warning.code);
    expect(sortWarningsBySeverity(input).map((warning) => warning.code)).toEqual(["d1", "d2", "w1", "w2", "w3"]);
    expect(input.map((warning) => warning.code)).toEqual(before);
    expect(sortWarningsBySeverity([])).toEqual([]);
    expect(sortWarningsBySeverity([stub("w", "warning")]).map((warning) => warning.code)).toEqual(["w"]);
  });

  it("melek balığı ve neon tetra: motor sarı uyarıyı kırmızıdan önce veriyor, ekranda kırmızı en üstte", () => {
    const { warnings } = analyzeAquarium(aquarium, [animal("l1", "angelfish", "Melek balığı", 1), animal("l2", "neon-tetra", "Neon tetra", 10)], []);
    const firstDanger = warnings.findIndex((warning) => warning.level === "danger");
    expect(warnings.map((warning) => warning.code)).toContain("smallFishPredation");
    expect(warnings.findIndex((warning) => warning.level === "warning")).toBeLessThan(firstDanger);
    const sorted = sortWarningsBySeverity(warnings);
    const dangers = sorted.filter((warning) => warning.level === "danger");
    expect(sorted.slice(0, dangers.length).every((warning) => warning.level === "danger")).toBe(true);
    expect(dangers.map((warning) => warning.code)).toContain("smallFishPredation");
    expect(sorted).toHaveLength(warnings.length);
    // Aynı seviyede motor sırası: sıralanmış listenin her seviyesi motorun listesindeki sırayla aynıdır.
    for (const level of ["danger", "warning"] as const) expect(sorted.filter((warning) => warning.level === level)).toEqual(warnings.filter((warning) => warning.level === level));
  });
});

describe("türlerin bakım notları ayrı grupta", () => {
  it("üç not kodu; her uyarı iki listeden tam birinde; riskler ciddiyet sırasıyla, notlar motor sırasıyla", () => {
    expect([...SPECIES_NOTE_CODES].sort()).toEqual(["communityCaution", "husbandryCaution", "tankLengthNote"]);
    const input = [stub("husbandryCaution", "warning"), stub("heaterMissing", "warning"), stub("smallFishPredation", "danger"), stub("communityCaution", "warning"), stub("tankLengthNote", "warning")];
    const { risks, notes } = groupHealthWarnings(input);
    expect(risks.map((warning) => warning.code)).toEqual(["smallFishPredation", "heaterMissing"]);
    expect(notes.map((warning) => warning.code)).toEqual(["husbandryCaution", "communityCaution", "tankLengthNote"]);
    // Not kodu tehlike seviyesinde gelirse risk sayılır: renk ve yer seviyeyi gizlemez.
    expect(groupHealthWarnings([stub("husbandryCaution", "danger")]).risks).toHaveLength(1);
  });

  it("ekran turundaki sorunsuz akvaryum: panda çöpçü ve neon tetrada dört sarı kutu artık bakım notu; puan aynı", () => {
    const analysis = analyzeAquarium(aquarium, [animal("l1", "corydoras-panda", "Panda çöpçü", 6), animal("l2", "neon-tetra", "Neon tetra", 10)], []);
    const { risks, notes } = groupHealthWarnings(analysis.warnings);
    expect(notes.map((warning) => warning.code).sort()).toEqual(["communityCaution", "communityCaution", "husbandryCaution", "husbandryCaution"]);
    expect(risks.every((warning) => !SPECIES_NOTE_CODES.has(warning.code))).toBe(true);
    expect(risks.length + notes.length).toBe(analysis.warnings.length);
  });

  it("sağlık sayfası uyarıları bu gruplarla çizer; notlar kapalı bir <details> içinde", () => {
    const source = page();
    expect(source).toContain("groupHealthWarnings(analysis.warnings)");
    expect(source).toContain("{risks.length?");
    expect(source).toContain("{notes.length>0&&<details");
    expect(source).not.toContain("{analysis.warnings.map(");
    expect(source).not.toContain("<details open");
  });
});

describe("canlısı olmayan akvaryumda puan gösterilmez", () => {
  it("canlısız akvaryumun döngü uyarısı risk grubunda ve görünür bölümde kalır", () => {
    const analysis = analyzeAquarium(aquarium, [], [], { id: "w", aquariumId: "a", measuredAt: "2026-11-12T10:00:00Z", ammonia: 0.5, nitrite: 0.2 });
    const groups = groupHealthWarnings(analysis.warnings);
    expect(groups.risks).toContainEqual(analysis.warnings.find(w => w.code === "cycleIncomplete"));
    expect(groups.notes).toEqual([]);
    expect(page()).toContain("const showAdvice=!noLivestock||awaiting.length>0||analysis.warnings.length>0;");
  });

  it("motor boş akvaryuma yine 78 'iyi' verir (değişmedi); sayfa canlı yoksa halkayı ve göstergeleri çizmez", () => {
    // Motor davranışı değişmedi: altın fikstürdeki "empty" vakası.
    expect(analyzeAquarium(aquarium, [], [])).toMatchObject({ score: 78, status: "good" });
    const source = page();
    expect(source).toContain("const noLivestock=animals.length===0;");
    expect(source).toMatch(/\{noLivestock\?<section[^]*?t\.health\.noLivestock\.title[^]*?:\s*<div className="grid gap-5 lg:grid-cols-\[\.75fr_1\.5fr\]"><section className="surface grid place-items-center p-7 text-center"><ScoreRing/);
  });
});
