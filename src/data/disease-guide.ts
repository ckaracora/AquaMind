import type { Locale } from "@aquamind/localization";
import { AQUARIUM_PARAM } from "@/lib/aquarium-links";
import type { Aquarium, Livestock } from "@/types/aquarium";

// Hastalık ve tedavi sayfasının kaynakları (docs/DECISIONS/0022-hastalik-ve-tedavi-sayfasi.md). Sayfa teşhis koymaz ve ilaç önermez;
// yalnız bu kaynaklara yönlendirir. Her adres açılarak okundu; okuma tarihi `verifiedAt`. Kaynağın adı ve açıklaması dil dosyasındadır
// (`t.diseases.sources[id]`).
export type DiseaseSourceId =
  | "ufAmmonia"
  | "oataDiseaseSigns"
  | "ufResponsibleOwnership"
  | "oataInvertebrates"
  | "pfkShrimpMedication"
  | "tvhbChambers"
  | "erciyesAquatic"
  | "fishVetSociety"
  | "aafvFindVet"
  | "wavmaFindVet"
  | "colvetColleges"
  | "ufFishHealth"
  | "oataCareSheets";

export interface DiseaseSource {
  id: DiseaseSourceId;
  url: string;
  /** Kaynağın dili; arayüz dilinden farklıysa ekranda etiketle gösterilir. */
  language: "tr" | "en" | "es";
  verifiedAt: string;
}

const source = (id: DiseaseSourceId, url: string, language: DiseaseSource["language"], verifiedAt = "2026-10-22"): DiseaseSource => ({ id, url, language, verifiedAt });

export const diseaseSources: Record<DiseaseSourceId, DiseaseSource> = {
  ufAmmonia: source("ufAmmonia", "https://ask.ifas.ufl.edu/fa031", "en"),
  oataDiseaseSigns: source("oataDiseaseSigns", "https://ornamentalfish.org/what-we-do/advice-information/care-sheets/caresheets-tropical-freshwater-fish/how-to-look-after-guppies-and-mollies/", "en"),
  ufResponsibleOwnership: source("ufResponsibleOwnership", "https://ask.ifas.ufl.edu/fa124", "en"),
  oataInvertebrates: source("oataInvertebrates", "https://ornamentalfish.org/what-we-do/advice-information/care-sheets/caresheets-tropical-freshwater-invertebrates/how-to-look-after-freshwater-shrimp-and-snails/", "en"),
  pfkShrimpMedication: source("pfkShrimpMedication", "https://www.practicalfishkeeping.co.uk/fishkeeping-answers/articles/are-there-any-shrimps-my-fish-wont-eat", "en"),
  tvhbChambers: source("tvhbChambers", "https://tvhb.org.tr/odalar/", "tr"),
  erciyesAquatic: source("erciyesAquatic", "https://veteriner.erciyes.edu.tr/tr/d/su-urunleri-ve-hastaliklari-anabilim-dali-tanitimi/klinik-oncesi-bolumler", "tr"),
  fishVetSociety: source("fishVetSociety", "https://www.fishvetsociety.org.uk/find-a-vet/", "en"),
  // Herkese açık harita ve arama; harita yalnız ABD ve Kanada adreslerini kapsar (üyelik sayfası, 2026-10-31). Çevrede balık veterineri yoksa
  // yerel veterinerin AAFV aracılığıyla bir balık veterinerine bağlanabileceğini söylüyor. Sitenin yalnız bu sayfasına bağlanılır.
  aafvFindVet: source("aafvFindVet", "https://fishvets.org/find-a-fish-vet/", "en", "2026-10-31"),
  // Ülke ve şehre göre herkese açık arama formu (üyelik gerekmez).
  wavmaFindVet: source("wavmaFindVet", "https://www.wavma.org/find-a-fish-vet", "en", "2026-10-31"),
  // İspanya'nın 52 il veteriner odası, iletişim bilgileriyle (Türkçedeki il veteriner hekimleri odalarının karşılığı).
  colvetColleges: source("colvetColleges", "https://www.colvet.es/es/13-CGCPVE/30-Colegios", "es", "2026-10-31"),
  ufFishHealth: source("ufFishHealth", "https://ask.ifas.ufl.edu/topics/fish-health-management", "en"),
  oataCareSheets: source("oataCareSheets", "https://ornamentalfish.org/what-we-do/advice-information/care-sheets/", "en"),
};

/** Belirti görülünce ilk adımlar: her madde kendi kaynağına bağlıdır. */
export const firstSteps = [
  { key: "water", sources: ["ufAmmonia"] },
  { key: "signs", sources: ["oataDiseaseSigns"] },
  { key: "quarantine", sources: ["ufResponsibleOwnership"] },
] as const satisfies ReadonlyArray<{ key: string; sources: readonly DiseaseSourceId[] }>;

export const copperSources = ["oataInvertebrates", "pfkShrimpMedication"] as const satisfies readonly DiseaseSourceId[];
/**
 * Veteriner bulma yolları arayüz diline göre: Türkçede Türkiye, İngilizcede İngilizce konuşulan ülkeler, İspanyolcada İspanya'nın il
 * veteriner odaları ve ABD/Kanada dizini; hepsinde dünya geneli dizin. Latin Amerika için herkese açık bir balık
 * veterineri dizini bulunamadı (2026-10-31); metin yerel veteriner odasına yönlendirir.
 */
export const vetSources: Record<Locale, readonly DiseaseSourceId[]> = {
  tr: ["tvhbChambers", "erciyesAquatic", "fishVetSociety"],
  en: ["aafvFindVet", "fishVetSociety", "wavmaFindVet"],
  es: ["colvetColleges", "aafvFindVet", "wavmaFindVet"],
};
export const guideSources = ["ufFishHealth", "oataCareSheets", "ufAmmonia"] as const satisfies readonly DiseaseSourceId[];

/** Adresteki akvaryum (`?aquarium=`); kayıtlı akvaryumlar arasında yoksa yok sayılır. */
export function requestedAquariumId(search: string, aquariums: readonly Aquarium[]): string | undefined {
  const id = new URLSearchParams(search).get(AQUARIUM_PARAM);
  return id && aquariums.some((aquarium) => aquarium.id === id) ? id : undefined;
}

export type InvertebrateKinds = "shrimp" | "snail" | "both";

export interface InvertebrateAquarium {
  aquarium: Aquarium;
  kinds: InvertebrateKinds;
}

/**
 * Karides ya da salyangoz bulunan akvaryumlar (bakır uyarısı bunlarda öne çıkar). Kayıttaki canlı türüne (`category`) bakılır; adedi
 * sıfır olan kayıt sayılmaz. `firstId` verilirse o akvaryum listenin başına gelir (sağlık analizinden gelindiğinde).
 */
export function aquariumsWithInvertebrates(aquariums: readonly Aquarium[], livestock: readonly Livestock[], firstId?: string): InvertebrateAquarium[] {
  const found: InvertebrateAquarium[] = [];
  for (const aquarium of aquariums) {
    const animals = livestock.filter((item) => item.aquariumId === aquarium.id && item.quantity > 0);
    const shrimp = animals.some((item) => item.category === "shrimp");
    const snail = animals.some((item) => item.category === "snail");
    if (shrimp || snail) found.push({ aquarium, kinds: shrimp && snail ? "both" : shrimp ? "shrimp" : "snail" });
  }
  return firstId ? [...found.filter((item) => item.aquarium.id === firstId), ...found.filter((item) => item.aquarium.id !== firstId)] : found;
}
