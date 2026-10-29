// Bitki uyarılarının ekran metni ve hesaplanması (docs/DECISIONS/0025-bitki-uyarilari.md). Motor (`assessPlants`) `code` ve `params`
// üretir; metin seçili dilin dosyasından kurulur (`@aquamind/localization/plant-warnings`). Dil dosyasında karşılığı olmayan kodda
// motorun Türkçe metni gösterilir. Bu modül ve içe aktardıkları kataloğu ve motorun geri kalanını yüklemez (bitki sayfası için).
import { assessPlants, type PlantWarning } from "@aquamind/compatibility-engine/plants";
import type { PlantWarningFormat, PlantWarningMessages } from "@aquamind/localization/plant-warnings";
import { own } from "@/lib/engine-text";
import type { PlantCatalogModule } from "@/lib/use-plant-catalog";
import type { Aquarium, Equipment, Plant, WaterParameters } from "@/types/aquarium";

export function plantWarningText(messages: PlantWarningMessages, format: PlantWarningFormat, warning: PlantWarning): { title: string; message: string } {
  const entry = own<PlantWarningMessages["warnings"][keyof PlantWarningMessages["warnings"]]>(messages.warnings, warning.code);
  return entry ? { title: entry.title(warning.params, format), message: entry.message(warning.params, format) } : { title: warning.title, message: warning.message };
}

/**
 * Bir akvaryumun bitki denetimi: uyarılar, değerlendirilemeyen bitkiler ve değerlendirilen bitki sayısı. Değerlendirilemeyenler iki türlü:
 * katalogla eşleşmeyen (`unmatched`) ve katalogda yalnız uyarı kaydı olan, yani değerleri kaynakta olmayan (`noValues`, karar 0026).
 * Yalnız uyarı kaydının etiket uyarıları ("su bitkisi değil", istilacı tür; karar 0028) `warnings` içindedir; değer kuralları onda denetlenemez.
 */
export interface AquariumPlantCheck {
  warnings: PlantWarning[];
  unmatched: Plant[];
  noValues: Plant[];
  checked: number;
}

/**
 * Bir akvaryumun bitki uyarıları: yalnız o akvaryumun bitkileri, ekipmanı ve en son su ölçümü kullanılır. Bitki katalogla
 * `plantForRecord` ile eşleşir (katalog kimliği, yoksa bilimsel ad, o da yoksa ad). Eşleşmeyen bitkide uyarı hesaplanmaz; yalnız uyarı
 * kaydıyla eşleşen bitkide yalnız etiketler uyarı verir (değerleri yok). Bu bitkiler `unmatched` ya da `noValues` listesinde döner, böylece
 * ekran "uyarı yok" ile "değerlendirilmedi"yi ayırır; `checked` yalnız değerleri denetlenen bitkileri sayar.
 */
export function checkAquariumPlants(catalog: PlantCatalogModule, aquarium: Aquarium, plants: Plant[], equipment: Equipment[], readings: WaterParameters[]): AquariumPlantCheck {
  const inTank = <T extends { aquariumId: string }>(items: T[]) => items.filter((item) => item.aquariumId === aquarium.id);
  // Sağlık analizinin "son ölçüm"üyle aynı: ölçüm zamanı en yeni olan kayıt.
  const latest = inTank(readings).sort((a, b) => +new Date(b.measuredAt) - +new Date(a.measuredAt))[0];
  const entries = inTank(plants).map((plant) => ({ plant, profile: catalog.plantForRecord(plant) }));
  const unmatched = entries.filter((entry) => !entry.profile).map((entry) => entry.plant);
  const noValues = entries.filter((entry) => entry.profile?.warningOnly).map((entry) => entry.plant);
  const matched = entries.filter((entry) => entry.profile);
  return { warnings: assessPlants(aquarium, matched, inTank(equipment), latest), unmatched, noValues, checked: matched.length - noValues.length };
}

/** Kaydın etiketinden gelen uyarılar (karar 0028). Bitki kartı bunları katalogdaki uyarı olarak zaten gösterir; kart listesine girmez. */
const labelCodes = new Set<PlantWarning["code"]>(["plantNotAquatic", "plantInvasive"]);
export const isLabelWarning = (warning: PlantWarning) => labelCodes.has(warning.code);

/** Sağlık analizindeki sıra: önce sarı uyarılar, sonra bilgi notları; her grupta motorun sırası korunur. */
export function warningsFirst(warnings: PlantWarning[]): PlantWarning[] {
  return [...warnings.filter((warning) => warning.level === "warning"), ...warnings.filter((warning) => warning.level !== "warning")];
}
