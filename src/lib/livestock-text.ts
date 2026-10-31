// Canlılar sayfasındaki kartın adı ve arama metni (karar 0021, 4. paket).
import type { CatalogTranslator } from "@aquamind/localization/catalog";

/**
 * Kayıttaki ad, kataloğun bugünkü adıyla aynıysa seçili dile çevrilir; değilse (kullanıcının yazdığı ya da kataloğun eski adı) olduğu
 * gibi kalır. Türkçede ad her zaman kayıttaki addır.
 */
export function livestockDisplayName(savedName: string, catalogName: string | undefined, translate: CatalogTranslator): string {
  return catalogName !== undefined && savedName === catalogName ? (translate(savedName) ?? savedName) : savedName;
}

/** Arama metni: kayıttaki ad, ondan farklıysa ekranda görünen ad ve bilimsel ad. Türkçede 4. paketten önceki arama metniyle aynıdır. */
export function livestockSearchText(savedName: string, displayName: string, scientificName: string | undefined): string {
  return [savedName, ...(displayName !== savedName ? [displayName] : []), scientificName ?? ""].join(" ");
}
