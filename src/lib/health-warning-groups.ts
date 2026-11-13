// Sağlık sayfasındaki uyarıların ekrandaki düzeni (kullanılabilirlik turu, 2026-11-12). Motorun sonucu değişmez: uyarıların listesi, seviyesi
// ve metni aynı kalır; burada yalnız ekranda hangi sırayla ve hangi grupta gösterilecekleri belirlenir. Katalog verisi içe aktarılmaz (sağlık
// sayfası yalnız gereken katalog parçalarını yükler, src/lib/__tests__/catalog-lookup.test.ts).
import type { HealthWarning } from "@aquamind/compatibility-engine";

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
 * Sağlık sayfasının iki listesi: `risks` ciddiyete göre dizili uyarılar, `notes` türlerin bakım notları (motorun sırasıyla). Bir not kodu
 * tehlike seviyesinde gelirse risk sayılır; renk ve yer seviyeyi gizlemez. Her uyarı iki listeden tam birindedir.
 */
export function groupHealthWarnings<T extends Pick<HealthWarning, "level" | "code">>(warnings: readonly T[]): { risks: T[]; notes: T[] } {
  const isNote = (warning: T) => warning.level === "warning" && SPECIES_NOTE_CODES.has(warning.code);
  return { risks: sortWarningsBySeverity(warnings.filter((warning) => !isNote(warning))), notes: warnings.filter(isNote) };
}
