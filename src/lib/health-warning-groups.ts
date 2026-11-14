// Sağlık sayfasındaki uyarıların ekrandaki düzeni (kullanılabilirlik turu, 2026-11-12). Motorun sonucu değişmez: uyarıların listesi, seviyesi
// ve metni aynı kalır; burada yalnız ekranda hangi sırayla ve hangi grupta gösterilecekleri belirlenir. Katalog verisi içe aktarılmaz (sağlık
// sayfası yalnız gereken katalog parçalarını yükler, src/lib/__tests__/catalog-lookup.test.ts).
import { UNEVALUATED_RECORD_WARNING_CODES, type HealthAnalysis, type HealthMetric, type HealthWarning, type UnevaluatedCode, type UnevaluatedItem } from "@aquamind/compatibility-engine";
import type { CatalogTranslator } from "@aquamind/localization/catalog";
import type { EngineMessages, EngineTextFormat } from "@aquamind/localization/engine";
import { translateCatalogParams } from "@/lib/engine-text";

/**
 * Türlerin kaynaktaki bakım notları: topluluk notu, özel bakım gereksinimi ve sınırlı tank uzunluğu verisi. Karar 0040'a göre "bilgi notları
 * sonucu değiştirmez"; sağlık sayfası bunları risk uyarılarından ayrı, kapalı ve nötr renkli bir grupta gösterir (ürün sahibi onayı 2026-11-12).
 * Senden bir şey isteyen uyarılar (ör. "Isıtıcı kayıtlı değil") bu gruba girmez.
 */
export const SPECIES_NOTE_CODES: ReadonlySet<string> = new Set(["communityCaution", "husbandryCaution", "tankLengthNote"]);

/** Ekranda önce gösterilen seviye küçük sayıdır. */
const SEVERITY_ORDER: Record<HealthWarning["level"], number> = { danger: 0, warning: 1 };

/**
 * Uyarıları ciddiyete göre dizer: tehlike (kırmızı) önce, sonra uyarı (sarı). Aynı seviyedeki uyarılar motorun verdiği sırada kalır
 * (kararlı sıralama). Girdi dizisi değiştirilmez.
 */
export function sortWarningsBySeverity<T extends Pick<HealthWarning, "level">>(warnings: readonly T[]): T[] {
  return warnings
    .map((warning, index) => ({ warning, index }))
    .sort((a, b) => SEVERITY_ORDER[a.warning.level] - SEVERITY_ORDER[b.warning.level] || a.index - b.index)
    .map(({ warning }) => warning);
}

/**
 * Sağlık sayfasının üç listesi: `risks` ciddiyete göre dizili uyarılar, `notes` türlerin bakım notları (motorun sırasıyla) ve `records`
 * "Değerlendirilemeyenler" kartının adlarıyla söylediği kayıt uyarıları (motor 1.18.0, karar 0043: tanınmayan ya da doğrulanmamış canlı,
 * tanınmayan cihaz, kapasite bilgisi eksik cihaz). Sayfa `records` listesini ayrıca göstermez; kart aynı bilgiyi verir. Bir not ya da kayıt
 * kodu tehlike seviyesinde gelirse risk sayılır; renk ve yer seviyeyi gizlemez. Her uyarı üç listeden tam birindedir.
 */
export function groupHealthWarnings<T extends Pick<HealthWarning, "level" | "code">>(warnings: readonly T[]): { risks: T[]; notes: T[]; records: T[] } {
  const isNote = (warning: T) => warning.level === "warning" && SPECIES_NOTE_CODES.has(warning.code);
  const isRecord = (warning: T) => warning.level === "warning" && UNEVALUATED_RECORD_WARNING_CODES.has(warning.code);
  return { risks: sortWarningsBySeverity(warnings.filter((warning) => !isNote(warning) && !isRecord(warning))), notes: warnings.filter(isNote), records: warnings.filter(isRecord) };
}

/** Kartta önce canlılar, sonra cihazlar, en sonda su ölçümü (motorun sırası da budur). */
const UNEVALUATED_ORDER: Record<UnevaluatedCode, number> = { unknownAnimal: 0, unverifiedAnimal: 1, behaviorUnknown: 2, unknownEquipment: 3, equipmentNoCapacity: 4, noReading: 5 };

/**
 * "Değerlendirilemeyenler" kartının maddeleri (motor 1.18.0, karar 0043), seçili dilin motor metinlerinden. Tür adları ve cihazın kapasite notu
 * uyarılardaki gibi katalog çevirmeninden geçer (`translateCatalogParams`); kullanıcının yazdığı ad ve cihazın marka-modeli çevirisizse aynen kalır.
 */
export function unevaluatedTexts(messages: EngineMessages, format: EngineTextFormat, items: readonly UnevaluatedItem[] | undefined, translate?: CatalogTranslator, translateEquipment?: CatalogTranslator): string[] {
  return [...(items ?? [])]
    .sort((a, b) => UNEVALUATED_ORDER[a.code] - UNEVALUATED_ORDER[b.code])
    .map((item) => messages.unevaluated[item.code](translate || translateEquipment ? translateCatalogParams(item.params, translate ?? (() => undefined), translateEquipment ?? translate) : item.params, format));
}

/**
 * Risk listesi boşken "Bulgular ve Öneriler" kartının kutusu (kontrol turu, motor 1.18.0). İlke: ekranın bir yeri "eksik" ya da "yetersiz"
 * derken başka yeri "sorun yok" diyemez.
 * - `clear`: yeşil "Belirgin bir risk görünmüyor"; yalnız hüküm "iyi" ve değerlendirilemeyen hiçbir şey yokken.
 * - `incomplete`: tanınmayan ya da doğrulanmamış canlı var ("Değerlendirebildiğimiz kayıtlarda risk bulunmadı").
 * - `unevaluated`: canlılar tanındı ama başka bir şey değerlendirilemedi (ör. su ölçümü yok, kapasite bilgisi eksik cihaz).
 * - `verdict`: hüküm "dikkat" ya da "uygun değil" ama listede ayrı bir uyarı yok (ör. katalogda tanınmayan filtre yüzünden filtrasyon
 *   ölçütü "Yetersiz"); kutu sonucu göstergelerin belirlediğini söyler.
 */
export type EmptyAdviceBox = "clear" | "incomplete" | "unevaluated" | "verdict";

/** Canlıya bağlı ölçütler: hiçbir canlı hesaba girmeyince bunlar değerlendirilmemiş demektir. */
const LIVESTOCK_METRIC_KEYS: ReadonlySet<string> = new Set(["load", "space", "social", "compatibility"]);
/** Isıtıcı ölçütü, ısıtıcı hesaba girmediğinde yalnız canlılara (tropikal tür var mı) bakar. */
const HEATER_NOT_COUNTED_DETAILS: ReadonlySet<string> = new Set(["noHeater", "heaterNotRecorded"]);

export interface HealthAdviceView<T> {
  risks: T[];
  notes: T[];
  records: T[];
  /** "Bulgular ve Öneriler" kartı gösterilir mi (boş kart çizilmez). */
  showAdvice: boolean;
  /** Risk listesi boşken gösterilecek kutu; liste doluysa ya da canlı yoksa yok. */
  emptyBox?: EmptyAdviceBox;
  /** "Değerlendirilemeyenler" kartı (canlısız akvaryumda da: tanınmayan ve kapasitesi eksik cihaz). */
  showUnevaluated: boolean;
  /**
   * Canlı kaydı var ama hiçbiri hesaba girmedi (hepsi tanınmadı ya da doğrulanmadı): canlıya bağlı ölçütler değerlendirilmedi; ekranda yeşil
   * "Uygun" yerine nötr "Değerlendirilemedi" yazar.
   */
  unassessedMetrics: ReadonlySet<string>;
}

/** Sağlık sayfasının "Bulgular ve Öneriler" ve "Değerlendirilemeyenler" bölümlerinin görünümü. Motorun sonucu değişmez. */
export function healthAdviceView<T extends Pick<HealthWarning, "level" | "code">>(
  analysis: { status: HealthAnalysis["status"]; warnings: readonly T[]; metrics: readonly Pick<HealthMetric, "key" | "detailCode">[]; incomplete?: true; unevaluated?: readonly UnevaluatedItem[] },
  animalCount: number,
  awaitingCount: number,
): HealthAdviceView<T> {
  const { risks, notes, records } = groupHealthWarnings(analysis.warnings);
  const unevaluated = analysis.unevaluated ?? [];
  const noLivestock = animalCount === 0;
  const emptyBox: EmptyAdviceBox | undefined = risks.length || noLivestock ? undefined
    : analysis.status !== "good" ? "verdict"
    : analysis.incomplete ? "incomplete"
    : unevaluated.length ? "unevaluated"
    : "clear";
  // Motor değerlendirilemeyen canlıyı kayıt başına bir kez listeler; bu sayı kayıt sayısına eşitse hiçbir canlı hesaba girmedi.
  const unassessedAnimals = unevaluated.filter((item) => item.code === "unknownAnimal" || item.code === "unverifiedAnimal").length;
  const noAnimalAssessed = animalCount > 0 && unassessedAnimals >= animalCount;
  const unassessedMetrics = new Set(noAnimalAssessed ? analysis.metrics.filter((metric) => LIVESTOCK_METRIC_KEYS.has(metric.key) || (metric.key === "heater" && HEATER_NOT_COUNTED_DETAILS.has(metric.detailCode))).map((metric) => metric.key) : []);
  return { risks, notes, records, showAdvice: !noLivestock || awaitingCount > 0 || risks.length > 0 || notes.length > 0, emptyBox, showUnevaluated: unevaluated.length > 0, unassessedMetrics };
}
