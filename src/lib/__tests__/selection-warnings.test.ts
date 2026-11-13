import { readFileSync } from "node:fs";
import { LIVESTOCK_RISK_WARNING_CODES } from "@aquamind/compatibility-engine";
import { describe, expect, it } from "vitest";
import { analyzeAquarium, fullCatalogLookup } from "@/lib/health-analysis";
import { newWarningsForCandidate, SELECTION_WARNING_CODES } from "@/lib/selection-warnings";
import type { Aquarium, Livestock, WaterParameters } from "@/types/aquarium";

// Canlı seçme penceresinde eklemeden önce gösterilen uyarılar (kullanılabilirlik turu, 2026-11-12; ekran turu kusur 3). Yeni kural yok:
// sağlık analizi adaysız ve adaylı çalıştırılır, adayla yeni çıkan avlanma ve uyumsuzluk uyarıları gösterilir.
const aquarium: Aquarium = { id: "a", name: "Melek ve Neon", type: "freshwater", lengthCm: 80, widthCm: 35, heightCm: 40, netVolumeLiters: 100, setupDate: "2026-11-12" };
const animal = (id: string, catalogId: string, commonName: string, quantity: number): Livestock => ({ id, aquariumId: "a", catalogId, commonName, category: "fish", quantity, gender: "unknown", addedAt: "2026-11-12" });
const angel = animal("l1", "angelfish", "Melek balığı", 1);
const neon = animal("candidate", "neon-tetra", "Neon tetra", 10);
const codes = (warnings: { code: string }[]) => warnings.map((warning) => warning.code);

describe("seçme anındaki uyarılar", () => {
  it("aynı tür ikinci kez eklenince toplam adetle çıkan uyarı motorun metni ve seviyesiyle aynen gösterilir", () => {
    const first = animal("old", "betta", "Beta balığı", 1);
    const candidate = { ...first, id: "candidate" };
    const existing = [first];
    const before = JSON.stringify(existing);
    const warnings = newWarningsForCandidate(fullCatalogLookup, aquarium, existing, [], undefined, candidate);
    const actual = analyzeAquarium(aquarium, [...existing, candidate], []).warnings;
    expect(warnings.find(w => w.code === "conspecificMales")).toEqual(actual.find(w => w.code === "conspecificMales"));
    expect(warnings.find(w => w.code === "conspecificMales")?.params.count).toBe(2);
    for (const warning of warnings) expect(actual).toContainEqual(warning);
    expect(JSON.stringify(existing)).toBe(before);
  });

  it("melek balığı varken neon tetra seçilince kırmızı 'avlanabilir' uyarısı çıkar", () => {
    const warnings = newWarningsForCandidate(fullCatalogLookup, aquarium, [angel], [], undefined, neon);
    expect(warnings[0]).toMatchObject({ code: "smallFishPredation", level: "danger" });
    expect(warnings[0].params).toMatchObject({ prey: "Neon tetra" });
  });

  it("ters yönde de çıkar: neon varken melek balığı seçilince", () => {
    const warnings = newWarningsForCandidate(fullCatalogLookup, aquarium, [{ ...neon, id: "l2" }], [], undefined, { ...angel, id: "candidate" });
    expect(codes(warnings)).toContain("smallFishPredation");
  });

  it("akvaryumda zaten olan uyarı yeniden gösterilmez; bakım notları, kayıt ve ekipman uyarıları gösterilmez", () => {
    const existing = [angel, { ...neon, id: "l2" }];
    const warnings = newWarningsForCandidate(fullCatalogLookup, aquarium, existing, [], undefined, { ...neon, id: "candidate", quantity: 2 });
    expect(codes(warnings)).not.toContain("smallFishPredation");
    for (const code of ["communityCaution", "husbandryCaution", "tankLengthNote", "filterMissing", "heaterMissing", "spaceLimited", "groupLow"]) expect(SELECTION_WARNING_CODES.has(code), code).toBe(false);
  });

  it("boş akvaryumda ilk canlı: barışçıl tür için uyarı yok; amonyak ölçülmüşse canlı riski uyarısı çıkar", () => {
    const panda = animal("candidate", "corydoras-panda", "Panda çöpçü", 6);
    expect(newWarningsForCandidate(fullCatalogLookup, aquarium, [], [], undefined, panda)).toEqual([]);
    const reading: WaterParameters = { id: "w", aquariumId: "a", measuredAt: "2026-11-12T10:00:00.000Z", ammonia: 0.5 };
    // pH ve sıcaklık ölçülmediği için motor en kötü durumu varsayar (kırmızı); canlısız akvaryumda bu "Canlı eklemek için erken" uyarısıydı.
    expect(newWarningsForCandidate(fullCatalogLookup, aquarium, [], [], reading, panda)[0]).toMatchObject({ code: "ammoniaWorstCase", level: "danger" });
    expect(codes(newWarningsForCandidate(fullCatalogLookup, aquarium, [], [], { ...reading, ph: 7, temperature: 25, ammonia: 0.02 }, panda))).toContain("ammoniaDetected");
  });

  it("erkek beta balığı varken bir erkek daha seçilince 'erkekler kavga eder' uyarısı çıkar; seçilen cinsiyet adaya geçer", () => {
    const male = (id: string): Livestock => ({ ...animal(id, "betta", "Beta balığı", 1), gender: "male" });
    const warnings = newWarningsForCandidate(fullCatalogLookup, aquarium, [male("l-erkek")], [], undefined, male("candidate"));
    expect(warnings).toEqual([expect.objectContaining({ code: "conspecificMales", level: "warning" })]);
    expect(warnings[0].params).toMatchObject({ count: 2 });
    // Motor cinsiyeti kullanmaz (karar 0040: "uygulama cinsiyeti bilmiyor"); uyarı kayıtlı toplam adetten çıkar. Pencere seçilen cinsiyeti
    // yine de adaya verir: kayıt ile önizleme aynı canlıyı anlatır.
    const form = readFileSync("src/components/catalog-livestock-form.tsx", "utf8");
    expect(form).toContain("quantity: candidateQuantity, gender, addedAt");
    expect(form).toContain('<select name="gender" value={gender} onChange=');
    // Tek erkekte uyarı yok.
    expect(newWarningsForCandidate(fullCatalogLookup, aquarium, [], [], undefined, male("candidate"))).toEqual([]);
  });

  it("kod sınıfı: canlı riski sınıfı (alan ve grup hariç) ve uyumsuzluk kodları", () => {
    for (const code of LIVESTOCK_RISK_WARNING_CODES) expect(SELECTION_WARNING_CODES.has(code), code).toBe(code !== "spaceLimited" && code !== "groupLow");
    for (const code of ["predation", "speciesOnly", "temperatureConflict", "phConflict", "flowConflict", "conspecificMales", "conspecificAll", "shrimpUnverified", "spaceSevere", "ammoniaToxic", "ammoniaWorstCase", "nitriteHigh"]) expect(SELECTION_WARNING_CODES.has(code), code).toBe(true);
  });

  it("canlılar sayfası pencereye akvaryumun canlılarını, ekipmanını ve son ölçümünü verir; pencere tam katalog modülünü içe aktarmaz", () => {
    const pageSource = readFileSync("src/app/livestock/page.tsx", "utf8");
    expect(pageSource).toContain("animals={aquariumAnimals} devices={aquariumDevices} latest={latest}");
    const form = readFileSync("src/components/catalog-livestock-form.tsx", "utf8");
    expect(form).toContain("newWarningsForCandidate(lookup, aquarium, animals, devices, latest, candidate)");
    expect(form).not.toMatch(/from "@\/lib\/health-analysis"/);
    expect(readFileSync("src/lib/selection-warnings.ts", "utf8")).not.toMatch(/from "@\/(data\/|lib\/health-analysis")/);
  });
});
