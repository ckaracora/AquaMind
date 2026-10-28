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

/** Bir akvaryumun bitki denetimi: uyarılar, katalogla eşleşmediği için değerlendirilmeyen bitkiler ve değerlendirilen bitki sayısı. */
export interface AquariumPlantCheck {
  warnings: PlantWarning[];
  unmatched: Plant[];
  checked: number;
}

/**
 * Bir akvaryumun bitki uyarıları: yalnız o akvaryumun bitkileri, ekipmanı ve en son su ölçümü kullanılır. Bitki katalogla
 * `plantForRecord` ile eşleşir (katalog kimliği, yoksa bilimsel ad, o da yoksa ad). Eşleşmeyen bitkide uyarı hesaplanmaz; bitki
 * `unmatched` listesinde döner, böylece ekran "uyarı yok" ile "değerlendirilmedi"yi ayırır.
 */
export function checkAquariumPlants(catalog: PlantCatalogModule, aquarium: Aquarium, plants: Plant[], equipment: Equipment[], readings: WaterParameters[]): AquariumPlantCheck {
  const inTank = <T extends { aquariumId: string }>(items: T[]) => items.filter((item) => item.aquariumId === aquarium.id);
  // Sağlık analizinin "son ölçüm"üyle aynı: ölçüm zamanı en yeni olan kayıt.
  const latest = inTank(readings).sort((a, b) => +new Date(b.measuredAt) - +new Date(a.measuredAt))[0];
  const entries = inTank(plants).map((plant) => ({ plant, profile: catalog.plantForRecord(plant) }));
  const unmatched = entries.filter((entry) => !entry.profile).map((entry) => entry.plant);
  return { warnings: assessPlants(aquarium, entries, inTank(equipment), latest), unmatched, checked: entries.length - unmatched.length };
}

/** Sağlık analizindeki sıra: önce sarı uyarılar, sonra bilgi notları; her grupta motorun sırası korunur. */
export function warningsFirst(warnings: PlantWarning[]): PlantWarning[] {
  return [...warnings.filter((warning) => warning.level === "warning"), ...warnings.filter((warning) => warning.level !== "warning")];
}
