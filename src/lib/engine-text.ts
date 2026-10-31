// Sağlık analizi motorunun uyarı ve ölçüt metinlerini seçili dilin dosyasından kurar (karar 0021, 3. paket).
// Motor her uyarı için `code` ve `params`, her ölçüt için `detailCode` ve `detailParams` üretir. Dil dosyasında karşılığı olmayan
// bir kod gelirse (ör. dil dosyası henüz güncellenmemişse) motorun kendi Türkçe metni gösterilir. Metinler `engineMessagesFor(locale)`
// ile alınır (`@aquamind/localization/engine`); sayılar ve hacimler ekranın biçimleyicisiyle (`engineTextFormat`) yazılır (3b).
import type { EngineParams, HealthMetric, HealthWarning } from "@aquamind/compatibility-engine";
import type { CatalogTranslator } from "@aquamind/localization/catalog";
import type { EngineMessages, EngineTextFormat } from "@aquamind/localization/engine";

/** Yalnız tablonun kendi anahtarları; `constructor` gibi nesne üyeleri kod sayılmaz. Bitki uyarılarının metinleri de kullanır. */
export function own<T>(table: Record<string, T>, key: string): T | undefined {
  return Object.prototype.hasOwnProperty.call(table, key) ? table[key] : undefined;
}

/**
 * Motor değişkenlerinden katalogdan gelen Türkçe metinler (karar 0021, 4. paket, canlılar aşaması). Seçili dilin katalog çevirmeninden
 * geçer; Türkçede her metin kendisidir. Ürün sahibi kararı (2026-10-30): çevirisi olmayan tür adı katalogdaki adla kalır, çevirisi
 * olmayan not ve koşul metni boş verilir. Türkçe dil dosyası boş tekil `condition`ı atlar, ama boş `text` uyarı gövdesini boş, boş
 * `noteConditions` salyangoz cümlesini eksik bırakır; Türkçe çevirmen kimlik olduğu için bu Türkçede olmaz. Başka dilin dosyası boş
 * notu atlamalıdır (karar 0021, "4. paket ayrıntıları"). Ekipman adları (`names`) ve kapasite notu (`note`) ekipman aşamasında
 * eklenir; kaynak adları (`sources`, `source`) özel addır, çevrilmez.
 */
export const SPECIES_NAME_PARAMS = ["name", "hunter", "prey", "predator", "nipper", "target"] as const;
export const SPECIES_NAME_LIST_PARAMS = ["eaters", "shrimp", "snails", "fish", "noteNames"] as const;
export const SPECIES_NOTE_PARAMS = ["text", "condition"] as const;
export const SPECIES_NOTE_LIST_PARAMS = ["noteConditions"] as const;
export const SPECIES_CATALOG_PARAMS = [...SPECIES_NAME_PARAMS, ...SPECIES_NOTE_PARAMS] as const;
export const SPECIES_CATALOG_LIST_PARAMS = [...SPECIES_NAME_LIST_PARAMS, ...SPECIES_NOTE_LIST_PARAMS] as const;

export function translateCatalogParams(params: EngineParams, translate: CatalogTranslator): EngineParams {
  const out: EngineParams = { ...params };
  const name = (value: string) => translate(value) ?? value;
  const note = (value: string) => (value === "" ? "" : (translate(value) ?? ""));
  for (const [keys, convert] of [[SPECIES_NAME_PARAMS, name], [SPECIES_NOTE_PARAMS, note]] as const) {
    for (const key of keys) {
      const value = own<EngineParams[string]>(params, key);
      if (typeof value === "string") out[key] = convert(value);
    }
  }
  for (const [keys, convert] of [[SPECIES_NAME_LIST_PARAMS, name], [SPECIES_NOTE_LIST_PARAMS, note]] as const) {
    for (const key of keys) {
      const value = own<EngineParams[string]>(params, key);
      if (Array.isArray(value)) out[key] = value.map(convert);
    }
  }
  return out;
}

export function engineWarningText(messages: EngineMessages, format: EngineTextFormat, warning: HealthWarning, translate?: CatalogTranslator): { title: string; message: string } {
  const entry = own<EngineMessages["warnings"][keyof EngineMessages["warnings"]]>(messages.warnings, warning.code);
  if (!entry) return { title: warning.title, message: warning.message };
  const params = translate ? translateCatalogParams(warning.params, translate) : warning.params;
  return { title: entry.title(params, format), message: entry.message(params, format) };
}

export function engineMetricText(messages: EngineMessages, format: EngineTextFormat, metric: HealthMetric): { label: string; detail: string } {
  const label = own<string>(messages.metricLabels, metric.key) ?? metric.label;
  const detail = own<EngineMessages["metricDetails"][keyof EngineMessages["metricDetails"]]>(messages.metricDetails, metric.detailCode);
  return { label, detail: detail ? detail(metric.detailParams, format) : metric.detail };
}
