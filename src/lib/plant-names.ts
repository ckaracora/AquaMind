// Kullanıcının bitki kaydının ekrandaki adı (karar 0021 → "Bitki adları"). Kayıttaki ad değişmez; yalnız gösterim dile göre seçilir.
// Bu dosya kataloğu yalnız tür olarak içe aktarır (katalog bitki sayfasının ayrı parçasıdır, docs/DECISIONS/0024-bitki-secme.md).
import type { Locale } from "@aquamind/localization";
import type { PlantProfile } from "@/data/catalog-plants";

/**
 * Kayıttaki ad, katalog kaydının Türkçe satış adlarından biriyle (`turkishAliases`) birebir aynıysa Türkçe dışındaki ekranda o dilin
 * adı gösterilir: İngilizcede İngilizce ortak ad, yoksa ve İspanyolcada bilimsel ad. Canlılardaki kuralın karşılığıdır (kayıttaki ad
 * kataloğun adıyla aynıysa çevrilir). Kullanıcının kendi yazdığı ad ve Türkçe ekran olduğu gibi kalır.
 */
export function plantShownName(plant: { name: string }, profile: Pick<PlantProfile, "scientificName" | "commonNameEn" | "turkishAliases"> | undefined, locale: Locale): string {
  if (locale === "tr" || !profile?.turkishAliases?.includes(plant.name.trim())) return plant.name;
  return (locale === "en" && profile.commonNameEn) || profile.scientificName;
}
