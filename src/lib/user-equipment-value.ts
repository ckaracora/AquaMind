// Kullanıcının cihaz etiketinden elle girdiği ekipman değeri (docs/DECISIONS/0017-elle-girilen-ekipman-degerleri.md).
// Hangi kayıtta hangi değerin girilebileceğini ve kabul edilen aralığı motor belirler; bu modül yalnızca formdaki
// metni sayıya çevirir ve ekranda gösterilecek metinleri üretir. Katalog verisi içermez.
import { userValueFor, userValueLimitsFor, type EquipmentProfileInput, type UserEquipmentValueKind } from "@aquamind/compatibility-engine";
import type { Equipment } from "@/types/aquarium";

/** Debi birimi: etikette "L/H" (saat) ya da "L/min" (dakika) yazabilir; kayıt her zaman L/saat tutulur. */
export type FlowUnit = "lph" | "lpm";

export interface UserValueField {
  kind: UserEquipmentValueKind;
  /** Kabul edilen aralık; debide L/saat, güçte W. */
  min: number;
  max: number;
  /** Alanın etiketi, ör. "Etikette yazan debi". */
  label: string;
  /** Değerin nerede yazdığını anlatan kısa yardım metni. */
  help: string;
}

const number = (value: number) => value.toLocaleString("tr-TR", { maximumFractionDigits: 1 });

/** Bu kayıtta elle değer girilebiliyorsa alanın tanımı; girilemiyorsa `undefined`. */
export function userValueField(category: Equipment["category"], profile?: EquipmentProfileInput): UserValueField | undefined {
  const limits = userValueLimitsFor(profile?.category ?? category, profile);
  if (!limits) return undefined;
  if (limits.kind === "power") return { ...limits, label: "Etikette yazan güç", help: "Isıtıcının ya da kutusunun üzerindeki watt (W) değeridir." };
  return (profile?.category ?? category) === "air_pump"
    ? { ...limits, label: "Etikette yazan hava debisi", help: "Hava motorunun ya da kutusunun üzerindeki değerdir. Çift çıkışlıysa iki çıkışın toplamını gir." }
    : { ...limits, label: "Etikette yazan debi", help: "Filtrenin ya da kutusunun üzerindeki değerdir; çoğu zaman \"L/H\" ya da \"Qmax\" diye geçer." };
}

export type ParsedUserValue = { value?: number; error?: undefined } | { value?: undefined; error: string };

/**
 * Formdaki metni kayda yazılacak değere çevirir (debi L/saat, güç W). Boş metin "değer girilmedi" demektir.
 * Aralık dışındaki sayı kaydedilmez; büyük olasılıkla birim ya da yazım hatasıdır.
 */
export function parseUserValue(raw: string, field: UserValueField, unit: FlowUnit = "lph"): ParsedUserValue {
  const text = raw.trim();
  if (!text) return {};
  // "1.200" ve "1.200,5" Türkçe binlik yazımıdır; "2.5" ve "2,5" ondalıktır.
  const compact = text.replace(/\s/g, "");
  const entered = Number(/^\d{1,3}(\.\d{3})+(,\d+)?$/.test(compact) ? compact.replace(/\./g, "").replace(",", ".") : compact.replace(",", "."));
  if (!Number.isFinite(entered) || entered <= 0) return { error: "Yalnızca sayı gir (ör. 600)." };
  const value = Math.round((field.kind === "flow" && unit === "lpm" ? entered * 60 : entered) * 10) / 10;
  if (value < field.min || value > field.max) {
    // L/dakika sınırları içe doğru yuvarlanır (alt sınır yukarı, üst sınır aşağı); böylece mesajda yazan her değer kabul edilir.
    const perMinute = `${number(Math.ceil((field.min / 60) * 10 - 1e-9) / 10)}–${number(Math.floor((field.max / 60) * 10 + 1e-9) / 10)} L/dakika`;
    const perHour = `${number(field.min)}–${number(field.max)} L/saat`;
    const range = field.kind === "power" ? `${number(field.min)}–${number(field.max)} W` : unit === "lpm" ? `${perMinute}; ${perHour}` : perHour;
    return { error: `Bu değer kabul edilen aralığın dışında (${range}). Sayıyı ve birimi kontrol et.` };
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
export function userValueText(item: Equipment, profile?: EquipmentProfileInput): string | undefined {
  const user = userValueFor(item, profile);
  if (!user) return undefined;
  return user.kind === "power" ? `${number(user.value)} W` : `${number(user.value)} L/saat`;
}

/**
 * Etiket değeri girilirse hesaba katılacak ama henüz değeri girilmemiş kayıtların adları (sağlık sayfasındaki yönlendirme için).
 * Hava motoru yalnızca akvaryumda hava motoruyla çalışan bir filtre varsa hesaba girer; yoksa listelenmez.
 */
export function devicesAwaitingUserValue(items: Equipment[], profileFor: (item: Equipment) => EquipmentProfileInput | undefined): string[] {
  const matched = items.map((item) => ({ item, profile: profileFor(item) }));
  const airPumpCounts = matched.some(({ profile }) => profile?.category === "filter" && profile.requiresAirPump && !profile.passiveComponent);
  return matched.flatMap(({ item, profile }) => {
    const category = profile?.category ?? item.category;
    if (category === "air_pump" && !airPumpCounts) return [];
    if (!userValueLimitsFor(category, profile) || userValueFor(item, profile)) return [];
    return [[profile?.brand ?? item.brand, profile?.model ?? item.model].filter(Boolean).join(" ") || "Adı girilmemiş cihaz"];
  });
}

/**
 * Girilen değer akvaryuma göre olağan dışıysa gösterilecek, kaydı engellemeyen uyarı.
 * Filtrede saatte 30 çevrimin üstü ya da yarım çevrimin altı çoğu zaman birim karışıklığıdır (L/dakika ↔ L/saat).
 */
export function userValueHint(field: UserValueField, category: Equipment["category"], value: number, aquariumVolumeL: number): string | undefined {
  if (field.kind !== "flow" || category !== "filter" || aquariumVolumeL <= 0) return undefined;
  const turnover = value / aquariumVolumeL;
  if (turnover > 30) return `Bu debi ${number(aquariumVolumeL)} L akvaryumu saatte ${number(turnover)} kez çevirir. Birimi kontrol et: etikette L/saat mi, L/dakika mı yazıyor?`;
  if (turnover < 0.5) return `Bu debi ${number(aquariumVolumeL)} L akvaryum için çok düşük görünüyor. Birimi kontrol et: etikette L/saat mi, L/dakika mı yazıyor?`;
  return undefined;
}
