// Kullanıcının cihaz etiketinden elle girdiği ekipman değeri (docs/DECISIONS/0017-elle-girilen-ekipman-degerleri.md).
// Hangi kayıtta hangi değerin girilebileceğini ve kabul edilen aralığı motor belirler; bu modül yalnızca formdaki
// metni sayıya çevirir ve ekranda gösterilecek metinleri üretir. Katalog verisi içermez. Metinler dil dosyasından
// gelir (`equipment.userValue`; docs/DECISIONS/0021-dil-altyapisi.md).
import { userValueFor, userValueLimitsFor, type EquipmentProfileInput, type UserEquipmentValueKind } from "@aquamind/compatibility-engine";
import type { Messages } from "@aquamind/localization";
import type { Equipment } from "@/types/aquarium";

/** Debi birimi: etikette "L/H" (saat) ya da "L/min" (dakika) yazabilir; kayıt her zaman L/saat tutulur. */
export type FlowUnit = "lph" | "lpm";

/** Ekrana yazılan metinler: dil dosyasının `equipment.userValue` bölümü ve dile göre sayı biçimi (en çok bir ondalık). */
export interface UserValueTexts {
  messages: Messages["equipment"]["userValue"];
  number: (value: number) => string;
}

export interface UserValueField {
  kind: UserEquipmentValueKind;
  /** Kabul edilen aralık; debide L/saat, güçte W. */
  min: number;
  max: number;
  /** Alanın etiketi ve yardım metni: `messages.fields[text]` (ör. "Etikette yazan debi"). */
  text: keyof Messages["equipment"]["userValue"]["fields"];
}

/** Bu kayıtta elle değer girilebiliyorsa alanın tanımı; girilemiyorsa `undefined`. */
export function userValueField(category: Equipment["category"], profile?: EquipmentProfileInput): UserValueField | undefined {
  const limits = userValueLimitsFor(profile?.category ?? category, profile);
  if (!limits) return undefined;
  if (limits.kind === "power") return { ...limits, text: "power" };
  return (profile?.category ?? category) === "air_pump" ? { ...limits, text: "airFlow" } : { ...limits, text: "flow" };
}

export type ParsedUserValue = { value?: number; error?: undefined } | { value?: undefined; error: string };

/**
 * Formdaki metni kayda yazılacak değere çevirir (debi L/saat, güç W). Boş metin "değer girilmedi" demektir.
 * Aralık dışındaki sayı kaydedilmez; büyük olasılıkla birim ya da yazım hatasıdır.
 */
export function parseUserValue(raw: string, field: UserValueField, unit: FlowUnit, texts: UserValueTexts): ParsedUserValue {
  const { messages, number } = texts;
  const text = raw.trim();
  if (!text) return {};
  // "1.200" ve "1.200,5" Türkçe binlik yazımıdır; "2.5" ve "2,5" ondalıktır.
  const compact = text.replace(/\s/g, "");
  const entered = Number(/^\d{1,3}(\.\d{3})+(,\d+)?$/.test(compact) ? compact.replace(/\./g, "").replace(",", ".") : compact.replace(",", "."));
  if (!Number.isFinite(entered) || entered <= 0) return { error: messages.notNumber };
  const value = Math.round((field.kind === "flow" && unit === "lpm" ? entered * 60 : entered) * 10) / 10;
  if (value < field.min || value > field.max) {
    // L/dakika sınırları içe doğru yuvarlanır (alt sınır yukarı, üst sınır aşağı); böylece mesajda yazan her değer kabul edilir.
    const perMinute = `${number(Math.ceil((field.min / 60) * 10 - 1e-9) / 10)}–${number(Math.floor((field.max / 60) * 10 + 1e-9) / 10)} ${messages.perMinute}`;
    const perHour = `${number(field.min)}–${number(field.max)} ${messages.perHour}`;
    const range = field.kind === "power" ? `${number(field.min)}–${number(field.max)} ${messages.watt}` : unit === "lpm" ? `${perMinute}; ${perHour}` : perHour;
    return { error: messages.outOfRange(range) };
  }
  return { value };
}

/** Kayda yazılacak alan; değer yoksa ilgili alan kayıttan çıkarılır. */
export function withUserValue(item: Equipment, field: UserValueField | undefined, value: number | undefined): Equipment {
  const rest: Equipment = { ...item };
  delete rest.userRatedFlowLph;
  delete rest.userPowerW;
  if (!field || value === undefined) return rest;
  return field.kind === "flow" ? { ...rest, userRatedFlowLph: value } : { ...rest, userPowerW: value };
}

/** Hesaba katılan elle girilmiş değerin ekranda gösterimi, ör. "1.200 L/saat"; yoksa `undefined`. */
export function userValueText(item: Equipment, profile: EquipmentProfileInput | undefined, texts: UserValueTexts): string | undefined {
  const user = userValueFor(item, profile);
  if (!user) return undefined;
  return `${texts.number(user.value)} ${user.kind === "power" ? texts.messages.watt : texts.messages.perHour}`;
}

/**
 * Etiket değeri girilirse hesaba katılacak ama henüz değeri girilmemiş kayıtların adları (sağlık sayfasındaki yönlendirme için).
 * Hava motoru yalnızca akvaryumda hava motoruyla çalışan bir filtre varsa hesaba girer; yoksa listelenmez. Marka ve modeli
 * olmayan kayıt `unnamed` adıyla listelenir.
 */
export function devicesAwaitingUserValue(items: Equipment[], profileFor: (item: Equipment) => EquipmentProfileInput | undefined, unnamed: string): string[] {
  const matched = items.map((item) => ({ item, profile: profileFor(item) }));
  const airPumpCounts = matched.some(({ profile }) => profile?.category === "filter" && profile.requiresAirPump && !profile.passiveComponent);
  return matched.flatMap(({ item, profile }) => {
    const category = profile?.category ?? item.category;
    if (category === "air_pump" && !airPumpCounts) return [];
    if (!userValueLimitsFor(category, profile) || userValueFor(item, profile)) return [];
    return [[profile?.brand ?? item.brand, profile?.model ?? item.model].filter(Boolean).join(" ") || unnamed];
  });
}

/**
 * Girilen değer akvaryuma göre olağan dışıysa gösterilecek, kaydı engellemeyen uyarı.
 * Filtrede saatte 30 çevrimin üstü ya da yarım çevrimin altı çoğu zaman birim karışıklığıdır (L/dakika ↔ L/saat).
 */
export function userValueHint(field: UserValueField, category: Equipment["category"], value: number, aquariumVolumeL: number, texts: UserValueTexts): string | undefined {
  if (field.kind !== "flow" || category !== "filter" || aquariumVolumeL <= 0) return undefined;
  const turnover = value / aquariumVolumeL;
  if (turnover > 30) return texts.messages.tooFast(texts.number(aquariumVolumeL), texts.number(turnover));
  if (turnover < 0.5) return texts.messages.tooSlow(texts.number(aquariumVolumeL));
  return undefined;
}
