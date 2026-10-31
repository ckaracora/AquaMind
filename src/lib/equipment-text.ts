import type { DisplayFormat, Messages } from "@aquamind/localization";
import type { CatalogTranslator } from "@aquamind/localization/catalog";
import type { EquipmentProfile } from "@/data/catalog-equipment";

// Ekipmanın teknik bilgi satırı (karar 0021, 5. paket). Katalogdaki satır Türkçe yazılmış katalog metnidir: çevirisi olan dilde çevirisi
// gösterilir; çevirisi olmayan dilde satır gösterilmez (ürün sahibi kararı 2026-10-30), yerine kaydın sayısal alanlarından (debi, güç,
// önerilen hacim) seçili dilde bir özet kurulur. Türkçede çevirmen metnin kendisini verdiği için katalogdaki satır aynen kalır.
// Katalogda karşılığı olmayan ekipmanın satırı kullanıcının yazdığıdır ve aynen gösterilir.

/** Katalog kaydının seçili dildeki teknik bilgi satırı; çevirisi yoksa sayısal alanlardan özet, o da yoksa boş. */
export function profileSpecsText(profile: EquipmentProfile, translate: CatalogTranslator, texts: Messages["equipment"]["specSummary"], fmt: DisplayFormat): string {
  const translated = translate(profile.specifications);
  if (translated !== undefined) return translated;
  const volume = (liters: number) => fmt.volume(liters);
  const parts = [
    profile.ratedFlowLph !== undefined ? texts.flow(fmt.number(profile.ratedFlowLph, { maximumFractionDigits: 0 })) : "",
    profile.powerW !== undefined ? texts.power(fmt.number(profile.powerW)) : "",
    profile.recommendedMaxL !== undefined
      ? profile.recommendedMinL !== undefined ? texts.volumeRange(fmt.volumeNumber(profile.recommendedMinL), volume(profile.recommendedMaxL)) : texts.volumeUpTo(volume(profile.recommendedMaxL))
      : "",
  ];
  return parts.filter(Boolean).join(" · ");
}

/** Kayıtlı ekipmanın teknik bilgi satırı: katalogdaki kaydı varsa onun satırı (yukarıdaki kuralla), yoksa kullanıcının yazdığı. */
export function equipmentSpecsText(profile: EquipmentProfile | undefined, ownText: string | undefined, translate: CatalogTranslator, texts: Messages["equipment"]["specSummary"], fmt: DisplayFormat): string {
  return profile ? profileSpecsText(profile, translate, texts, fmt) : (ownText ?? "");
}
