// Sağlık analizi motorunun uyarı ve ölçüt metinlerini seçili dilin dosyasından kurar (karar 0021, 3. paket).
// Motor her uyarı için `code` ve `params`, her ölçüt için `detailCode` ve `detailParams` üretir. Dil dosyasında karşılığı olmayan
// bir kod gelirse (ör. dil dosyası henüz güncellenmemişse) motorun kendi Türkçe metni gösterilir. Metinler `engineMessagesFor(locale)`
// ile alınır (`@aquamind/localization/engine`); sayılar ve hacimler ekranın biçimleyicisiyle (`engineTextFormat`) yazılır (3b).
import type { HealthMetric, HealthWarning } from "@aquamind/compatibility-engine";
import type { EngineMessages, EngineTextFormat } from "@aquamind/localization/engine";

/** Yalnız tablonun kendi anahtarları; `constructor` gibi nesne üyeleri kod sayılmaz. */
function own<T>(table: Record<string, T>, key: string): T | undefined {
  return Object.prototype.hasOwnProperty.call(table, key) ? table[key] : undefined;
}

export function engineWarningText(messages: EngineMessages, format: EngineTextFormat, warning: HealthWarning): { title: string; message: string } {
  const entry = own<EngineMessages["warnings"][keyof EngineMessages["warnings"]]>(messages.warnings, warning.code);
  return entry ? { title: entry.title(warning.params, format), message: entry.message(warning.params, format) } : { title: warning.title, message: warning.message };
}

export function engineMetricText(messages: EngineMessages, format: EngineTextFormat, metric: HealthMetric): { label: string; detail: string } {
  const label = own<string>(messages.metricLabels, metric.key) ?? metric.label;
  const detail = own<EngineMessages["metricDetails"][keyof EngineMessages["metricDetails"]]>(messages.metricDetails, metric.detailCode);
  return { label, detail: detail ? detail(metric.detailParams, format) : metric.detail };
}
