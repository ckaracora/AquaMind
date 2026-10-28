// Veri kapsamı raporu (docs/DATA_COVERAGE.md): katalogların her bilgisinin yüzde kaçının dolu olduğu ve kaynağın türü.
// Uygulama sayfaları bu modülü kullanmaz; `scripts/data-coverage.cjs` ve testler kullanır. Kataloglar parametre olarak verilir
// (bitki kataloğu yalnız bitki sayfasının ayrı parçasıyla yüklenir; burada içe aktarılmaz).

/** Raporun okuduğu alanlar (kataloglardaki kayıt tiplerinin ilgili kısmı). */
export interface CoverageInput {
  species: { id: string; scientificName: string; category: string; sourceUrl?: string; verifiedAt?: string; minTankLengthCm?: number; flow?: string; communityCaution?: string; husbandryCaution?: string; predatory?: boolean; speciesOnly?: boolean; aliases?: string[] }[];
  equipment: { id: string; category: string; brand: string; sourceUrl?: string; verifiedAt?: string; passiveComponent?: boolean; requiresAirPump?: boolean; ratedFlowLph?: number; powerW?: number; recommendedMinL?: number; recommendedMaxL?: number }[];
  unverifiedEquipmentIds: readonly string[];
  /** Kaynak bağlantısı bilimsel addan otomatik üretilen canlı kayıtları (`generatedSourceSpeciesIds`, src/data/catalog-species.ts). */
  generatedSourceSpeciesIds: readonly string[];
  care: { id: string; category: string; sourceUrl: string; verifiedAt: string; volumeL?: number }[];
  plants: { id: string; sourceUrl: string; verifiedAt: string; light?: unknown; co2?: unknown; growth?: unknown; heightCm?: number; temperature?: unknown; ph?: unknown; placements?: unknown[]; invasiveListings?: unknown[] }[];
}

export interface CoverageRow { label: string; count: number; total: number }
export interface CatalogCoverage { name: string; total: number; rows: CoverageRow[] }
export interface CoverageReport { measuredOn: string; catalogs: CatalogCoverage[] }

/** "Son 3 ay": ölçüm gününden geriye 92 gün (3 ayda bir yeniden araştırma kararı, docs/DECISIONS/0020-urun-hedefleri-ve-yol-haritasi.md). */
export const RECENT_DAYS = 92;

const filled = (value: unknown) => value !== undefined && value !== null && value !== "" && !(Array.isArray(value) && value.length === 0);
const row = <T,>(items: readonly T[], label: string, test: (item: T) => boolean): CoverageRow => ({ label, count: items.filter(test).length, total: items.length });
/** Takvimde olan bir gün mü (`YYYY-MM-DD`; ör. 2026-02-31 değil). */
export function isCalendarDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const time = Date.parse(`${value}T00:00:00Z`);
  return Number.isFinite(time) && new Date(time).toISOString().slice(0, 10) === value;
}
// Ölçüm gününden en çok RECENT_DAYS gün önce ya da ölçüm günü doğrulanmış; ölçüm gününden sonraki tarih sayılmaz.
const recent = (measuredOn: string) => {
  const end = Date.parse(`${measuredOn}T00:00:00Z`);
  const start = end - RECENT_DAYS * 86_400_000;
  return (item: { verifiedAt?: string }) => {
    // Takvimde olmayan tarih (ör. 2026-09-31; Date.parse onu 1 Ekim'e kaydırır) doğrulanmış sayılmaz.
    if (!item.verifiedAt || !isCalendarDate(item.verifiedAt)) return false;
    const time = Date.parse(`${item.verifiedAt}T00:00:00Z`);
    return time >= start && time <= end;
  };
};

export function dataCoverage(input: CoverageInput, measuredOn: string): CoverageReport {
  if (!isCalendarDate(measuredOn)) throw new Error(`Geçersiz ölçüm tarihi: ${measuredOn} (YYYY-MM-DD, takvimde olan bir gün)`);
  const isRecent = recent(measuredOn);
  const { species, equipment, care, plants } = input;
  const unverified = new Set(input.unverifiedEquipmentIds);
  // Otomatik bağlantı değerlerin o sayfadan okunduğunu göstermez; ayrı sayılır.
  const generated = new Set(input.generatedSourceSpeciesIds);
  const generatedSource = (item: { id: string }) => generated.has(item.id);
  const capacityEquipment = equipment.filter((item) => ["filter", "heater", "air_pump"].includes(item.category) && !item.passiveComponent);
  const volumeCare = care.filter((item) => ["tank", "aquarium_set", "aquaterrarium", "terrarium"].includes(item.category));
  return {
    measuredOn,
    catalogs: [
      { name: "Canlılar", total: species.length, rows: [
        row(species, "Kendi kaynak sayfası var (otomatik bağlantı değil)", (item) => filled(item.sourceUrl) && !generatedSource(item)),
        row(species, "Yalnız otomatik kaynak bağlantısı", generatedSource),
        row(species, "En az tank uzunluğu", (item) => filled(item.minTankLengthCm)),
        row(species, "Akıntı", (item) => filled(item.flow)),
        row(species, "Davranış ya da bakım notu", (item) => filled(item.communityCaution) || filled(item.husbandryCaution) || Boolean(item.predatory) || Boolean(item.speciesOnly)),
        row(species, "Eş ad ya da satış adı", (item) => filled(item.aliases)),
        row(species, `Son ${RECENT_DAYS} günde doğrulanmış`, isRecent),
      ] },
      { name: "Ekipman", total: equipment.length, rows: [
        row(equipment, "Kaynak sayfası", (item) => filled(item.sourceUrl)),
        row(equipment, "Doğrulanmamışlar listesinde değil", (item) => !unverified.has(item.id)),
        row(capacityEquipment, "Hesap değeri (filtre, ısıtıcı, hava motoru)", (item) => item.category === "heater"
          ? item.powerW != null || item.recommendedMinL != null || item.recommendedMaxL != null
          : Boolean(item.requiresAirPump) || item.ratedFlowLph != null || item.recommendedMaxL != null),
        row(equipment, "Güç (W)", (item) => item.powerW != null),
        row(equipment, "Önerilen hacim", (item) => item.recommendedMinL != null || item.recommendedMaxL != null),
        row(equipment, `Son ${RECENT_DAYS} günde doğrulanmış`, isRecent),
      ] },
      { name: "Bakım ürünleri", total: care.length, rows: [
        row(care, "Kaynak sayfası", (item) => filled(item.sourceUrl)),
        row(volumeCare, "Hacim (tank, set, teraryum)", (item) => item.volumeL != null),
        row(care, `Son ${RECENT_DAYS} günde doğrulanmış`, isRecent),
      ] },
      { name: "Bitkiler", total: plants.length, rows: [
        row(plants, "Işık", (item) => filled(item.light)),
        row(plants, "CO₂", (item) => filled(item.co2)),
        row(plants, "Büyüme hızı", (item) => filled(item.growth)),
        row(plants, "Boy", (item) => filled(item.heightCm)),
        row(plants, "Sıcaklık", (item) => filled(item.temperature)),
        row(plants, "pH", (item) => filled(item.ph)),
        row(plants, "Yerleşim", (item) => filled(item.placements)),
        row(plants, "Bütün değerler dolu", (item) => [item.light, item.co2, item.growth, item.heightCm, item.temperature, item.ph, item.placements].every(filled)),
        row(plants, "İstilacı tür etiketi", (item) => filled(item.invasiveListings)),
        row(plants, `Son ${RECENT_DAYS} günde doğrulanmış`, isRecent),
      ] },
    ],
  };
}

/**
 * scripts/data-coverage.cjs'in argümanları: en çok bir ölçüm tarihi ve isteğe bağlı "--json <dosya>", sıraları serbest. Tarih verilmezse `today`.
 * Hatalı argümanda `error` döner (betik bunu yazıp 1 koduyla çıkar).
 */
export function parseCoverageArgs(args: readonly string[], today: string): { measuredOn: string; jsonPath?: string } | { error: string } {
  const jsonIndex = args.indexOf("--json");
  if (jsonIndex >= 0 && args.indexOf("--json", jsonIndex + 1) >= 0) return { error: "--json yalnız bir kez verilebilir." };
  const jsonPath = jsonIndex >= 0 ? args[jsonIndex + 1] : undefined;
  if (jsonIndex >= 0 && (!jsonPath || jsonPath.startsWith("--"))) return { error: "--json için bir dosya yolu verin: node scripts/data-coverage.cjs --json <dosya>" };
  const rest = args.filter((_, index) => jsonIndex < 0 || (index !== jsonIndex && index !== jsonIndex + 1));
  if (rest.length > 1) return { error: `Beklenmeyen argüman: ${rest.slice(1).join(" ")}` };
  const measuredOn = rest[0] ?? today;
  if (!isCalendarDate(measuredOn)) return { error: `Geçersiz ölçüm tarihi: ${measuredOn} (YYYY-MM-DD, takvimde olan bir gün)` };
  return jsonPath ? { measuredOn, jsonPath } : { measuredOn };
}

const percent = (count: number, total: number) => (total ? `%${new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 1 }).format((100 * count) / total)}` : "—");

/** docs/DATA_COVERAGE.md içindeki güncel tablo (testler belgenin bu çıktıyla aynı olduğunu denetler). */
export function coverageMarkdown(report: CoverageReport) {
  const lines = [`Ölçüm tarihi: ${report.measuredOn}`, ""];
  for (const catalog of report.catalogs) {
    lines.push(`### ${catalog.name} (${catalog.total} kayıt)`, "", "| Bilgi | Dolu | Oran |", "|---|---|---|");
    for (const item of catalog.rows) lines.push(`| ${item.label} | ${item.count}/${item.total} | ${percent(item.count, item.total)} |`);
    lines.push("");
  }
  return lines.join("\n").trimEnd();
}
