// Sağlık sayfasındaki uyarıların ekrandaki düzeni (kullanılabilirlik turu, 2026-11-12). Motorun sonucu değişmez: uyarıların listesi, seviyesi
// ve metni aynı kalır; burada yalnız ekranda hangi sırayla ve hangi grupta gösterilecekleri belirlenir. Katalog verisi içe aktarılmaz (sağlık
// sayfası yalnız gereken katalog parçalarını yükler, src/lib/__tests__/catalog-lookup.test.ts).
import { UNEVALUATED_RECORD_WARNING_CODES, type HealthWarning, type UnevaluatedCode, type UnevaluatedItem } from "@aquamind/compatibility-engine";
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
    .map((item) => messages.unevaluated[item.code](translate ? translateCatalogParams(item.params, translate, translateEquipment) : item.params, format));
}
