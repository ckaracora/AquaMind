// Bitki uyarılarının metinleri (docs/DECISIONS/0025-bitki-uyarilari.md). Motor (`assessPlants`) her uyarı için `code` ve `params`
// üretir; ekran metni burada kurulur. Sözcükler motorun kendi Türkçe alanlarıyla aynıdır; sayılar dilin ayırıcılarıyla, sıcaklık
// kullanıcının birim tercihiyle yazılır (`PlantWarningFormat`). Eşitlik testi: src/lib/__tests__/plant-warnings.test.ts. Metinler
// yalnız bitki ve sağlık sayfalarında gerektiği için paketin ayrı girişinden alınır (`@aquamind/localization/plant-warnings`).
import type { PlantWarningFormat } from "../plant-warnings";

/** Motor değişkenlerinin değer türleri (motorun `PlantWarning.params` türüyle aynı biçim). */
export type PlantWarningParams = Record<string, string | number>;
type Text = (p: PlantWarningParams, f: PlantWarningFormat) => string;

const num = (p: PlantWarningParams, key: string) => p[key] as number;
const str = (p: PlantWarningParams, key: string) => p[key] as string;
const high = (p: PlantWarningParams) => str(p, "direction") === "high";
const levelNames: Record<string, string> = { low: "düşük", medium: "orta", high: "yüksek" };

export const trPlantWarnings = {
  /** Sağlık analizindeki bölüm. */
  eyebrow: "Bitkiler",
  title: "Bitki uyarıları",
  note: "Bitki uyarıları sağlık puanını etkilemez.",
  none: "Kayıtlı bitkiler için uyarı yok.",
  /** Bir kısmı değerlendirilemediyse (katalogla eşleşmedi ya da değerleri kaynakta yok) yeşil sonuç yalnız değerlendirilenler içindir. */
  noneForMatched: "Değerlendirilen bitkiler için uyarı yok.",
  /** Katalogla eşleşmeyen bitkiler (adları virgülle; adı boş kayıtlarda liste boş olabilir): onlar için uyarı hesaplanmadı. */
  unmatched: (names: string) => `Katalogla eşleşmeyen bitkiler için uyarı hesaplanmadı${names ? `: ${names}` : ""}.`,
  /** Hiçbir bitki katalogla eşleşmedi: değerlendirme yapılamadı (yeşil "uyarı yok" gösterilmez). */
  noneChecked: (names: string) => `Bitkiler katalogla eşleşmediği için uyarı hesaplanamadı${names ? `: ${names}` : ""}.`,
  /** Katalogda yalnız uyarı kaydı olan bitkiler (değerleri kaynakta yok; karar 0026): onlar için uyarı hesaplanmadı. */
  noValues: (names: string) => `Değerleri kaynakta olmayan bitkiler için uyarı hesaplanmadı${names ? `: ${names}` : ""}. Bitki kartındaki uyarıya bakın.`,
  preparing: "Bitki bilgileri hazırlanıyor…",
  loadFailed: "Bitki bilgileri yüklenemedi; bitkilerin kısa bilgisi ve uyarıları gösterilemiyor. Bağlantını kontrol edip yeniden dene.",
  /** Uyarı metinleri, motorun `code` alanına göre. */
  warnings: {
    plantCo2: {
      title: (p) => `${str(p, "name")} yüksek CO₂ ister`,
      // 15–25 mg/L Tropica'nın "yüksek" düzeyinin tanımıdır (src/data/catalog-plants.ts, docs/DATA_SOURCES.md); sabit metindir.
      message: () => "Tropica'ya göre bu bitki için yaklaşık 15–25 mg/L CO₂ gerekir. Akvaryumda kayıtlı bir CO₂ sistemi yok; bitki zayıf büyüyebilir.",
    },
    plantLight: {
      title: (p) => `${str(p, "name")} ${levelNames[str(p, "level")] ?? str(p, "level")} ışık ister`,
      message: () => "Akvaryumda kayıtlı bir aydınlatma yok. Aydınlatmanı ekipman sayfasından ekleyebilirsin.",
    },
    plantTemperature: {
      title: (p) => `${str(p, "name")} için su ${high(p) ? "sıcak" : "soğuk"}`,
      message: (p, f) =>
        `Bu bitkinin kaynaktaki sıcaklık aralığı ${f.temperatureNumber(num(p, "min"))}–${f.temperature(num(p, "max"))}; son ölçüm ${f.temperature(num(p, "value"), num(p, high(p) ? "max" : "min"))}.`,
    },
    plantPh: {
      title: (p) => `${str(p, "name")} için pH ${high(p) ? "yüksek" : "düşük"}`,
      message: (p, f) =>
        `Bu bitkinin kaynaktaki pH aralığı ${f.measurement(num(p, "min"))}–${f.measurement(num(p, "max"))}; son ölçüm ${f.measurement(num(p, "value"), num(p, high(p) ? "max" : "min"))}.`,
    },
    plantHeight: {
      title: (p, f) => `${str(p, "name")} ${f.length(num(p, "height"), num(p, "tankHeight"))}'ye kadar uzar`,
      message: (p, f) => `Akvaryumun yüksekliği ${f.length(num(p, "tankHeight"), num(p, "height"))}. Bitki su yüzeyine ulaşır; düzenli budama gerekir.`,
    },
  } satisfies Record<string, { title: Text; message: Text }>,
};

/** Bitki uyarısı metinlerinin biçimi; başka bir dilin metinleri bu tipi karşılamalıdır. */
export type PlantWarningMessages = typeof trPlantWarnings;
