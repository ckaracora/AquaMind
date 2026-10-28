// Bitki uyarıları (motor 1.11.0, docs/DECISIONS/0025-bitki-uyarilari.md). Akvaryumun sağlık analizinden (`analyzeAquarium`) ayrıdır:
// sağlık puanını ve genel durumu etkilemez (ürün sahibinin 2026-10-28 kararı). Kurallar yalnız kaynakta yazan değerleri kullanır;
// yeni bir eşik koymaz. Paketin ayrı giriş noktasıdır (`@aquamind/compatibility-engine/plants`): bitki sayfası motorun tamamını yüklemez.
import type { Aquarium, Equipment, Plant, WaterParameters } from "@aquamind/domain";

export type PlantNeedLevelInput = "low" | "medium" | "high";

/** Motorun bir bitki kaydından okuduğu alanlar. Katalogdaki PlantProfile bunu yapısal olarak karşılar. */
export interface PlantProfileInput {
  id: string;
  scientificName: string;
  light?: [PlantNeedLevelInput, PlantNeedLevelInput];
  co2?: PlantNeedLevelInput;
  heightCm?: number;
  temperature?: [number, number];
  ph?: [number, number];
}

export type PlantWarningCode = "plantCo2" | "plantLight" | "plantTemperature" | "plantPh" | "plantHeight";

/**
 * Bir bitkinin uyarısı. `level`: "warning" sarı uyarı, "info" bilgi notu. Ekran metni dil dosyasında `code` ve `params`'tan kurulur;
 * Türkçe `title` ve `message` öbür motor uyarılarıyla aynı biçimde üretilir.
 */
export interface PlantWarning {
  plantId: string;
  level: "warning" | "info";
  code: PlantWarningCode;
  params: Record<string, string | number>;
  title: string;
  message: string;
}

const fmt = (value: number) => new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 2 }).format(value);
const levelText: Record<PlantNeedLevelInput, string> = { low: "düşük", medium: "orta", high: "yüksek" };

/**
 * Akvaryumdaki bitkilerin uyarıları. Katalogla eşleşmeyen bitki (profil yok) atlanır. Uyarıda bitkinin kullanıcının kaydındaki adı
 * yazılır (boşsa kaynaktaki bilimsel adı). Kurallar:
 * - CO₂: kaynağa (Tropica) göre yüksek CO₂ isteyen bitki var, akvaryumda CO₂ ekipmanı kayıtlı değil → uyarı.
 * - Işık: kaynağa göre en az orta ışık isteyen bitki var (aralığın alt ucu), akvaryumda aydınlatma kayıtlı değil → uyarı.
 *   Işığın gücü ölçülmez; yalnız aydınlatmanın varlığına bakılır.
 * - Sıcaklık ve pH: son su ölçümü bitkinin kaynaktaki aralığının dışında → uyarı. Aralığı kaynakta olmayan bitkide uyarı çıkmaz.
 * - Boy: bitkinin kaynaktaki boyu akvaryumun yüksekliğinden büyük → bilgi notu (bitki su yüzeyine ulaşır, budama gerekir). Akvaryumun
 *   yüksekliği girilmemişse (sıfır ya da sayı değil) not çıkmaz.
 */
export function assessPlants(aquarium: Aquarium, plants: { plant: Plant; profile?: PlantProfileInput }[], equipment: Equipment[], latest?: WaterParameters): PlantWarning[] {
  const hasCo2 = equipment.some((item) => item.category === "co2");
  const hasLighting = equipment.some((item) => item.category === "lighting");
  const warnings: PlantWarning[] = [];
  for (const { plant, profile } of plants) {
    if (!profile) continue;
    const name = plant.name.trim() || profile.scientificName;
    const base = { plantId: plant.id };
    if (profile.co2 === "high" && !hasCo2) {
      warnings.push({ ...base, level: "warning", code: "plantCo2", params: { name },
        title: `${name} yüksek CO₂ ister`,
        message: "Tropica'ya göre bu bitki için yaklaşık 15–25 mg/L CO₂ gerekir. Akvaryumda kayıtlı bir CO₂ sistemi yok; bitki zayıf büyüyebilir." });
    }
    const minLight = profile.light?.[0];
    if ((minLight === "medium" || minLight === "high") && !hasLighting) {
      warnings.push({ ...base, level: "warning", code: "plantLight", params: { name, level: minLight },
        title: `${name} ${levelText[minLight]} ışık ister`,
        message: "Akvaryumda kayıtlı bir aydınlatma yok. Aydınlatmanı ekipman sayfasından ekleyebilirsin." });
    }
    const temperature = latest?.temperature;
    if (profile.temperature && typeof temperature === "number" && Number.isFinite(temperature) && (temperature < profile.temperature[0] || temperature > profile.temperature[1])) {
      const [min, max] = profile.temperature;
      const direction = temperature > max ? "high" : "low";
      warnings.push({ ...base, level: "warning", code: "plantTemperature", params: { name, min, max, value: temperature, direction },
        title: `${name} için su ${direction === "high" ? "sıcak" : "soğuk"}`,
        message: `Bu bitkinin kaynaktaki sıcaklık aralığı ${fmt(min)}–${fmt(max)} °C; son ölçüm ${fmt(temperature)} °C.` });
    }
    const ph = latest?.ph;
    if (profile.ph && typeof ph === "number" && Number.isFinite(ph) && (ph < profile.ph[0] || ph > profile.ph[1])) {
      const [min, max] = profile.ph;
      const direction = ph > max ? "high" : "low";
      warnings.push({ ...base, level: "warning", code: "plantPh", params: { name, min, max, value: ph, direction },
        title: `${name} için pH ${direction === "high" ? "yüksek" : "düşük"}`,
        message: `Bu bitkinin kaynaktaki pH aralığı ${fmt(min)}–${fmt(max)}; son ölçüm ${fmt(ph)}.` });
    }
    if (typeof profile.heightCm === "number" && Number.isFinite(aquarium.heightCm) && aquarium.heightCm > 0 && profile.heightCm > aquarium.heightCm) {
      warnings.push({ ...base, level: "info", code: "plantHeight", params: { name, height: profile.heightCm, tankHeight: aquarium.heightCm },
        title: `${name} ${fmt(profile.heightCm)} cm'ye kadar uzar`,
        message: `Akvaryumun yüksekliği ${fmt(aquarium.heightCm)} cm. Bitki su yüzeyine ulaşır; düzenli budama gerekir.` });
    }
  }
  return warnings;
}
