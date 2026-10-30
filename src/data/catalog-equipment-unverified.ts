// Değeri doğrulanamayan ekipman kayıtları (docs/DECISIONS/0019-dogrulanamayan-ekipman-degerleri.md).
// Ürün sahibinin 2026-10-11 kararı: küçük markalarda derin kaynak araştırması yapılmaz. Bir değer yalnızca üreticinin sitesinden,
// Türkiye distribütöründen ya da kabul edilen 6 yerel mağazadan (docs/DATA_SOURCES.md) doğrulanabiliyorsa hesapta kalır. Aşağıdaki
// kayıtların değerleri ilk olarak bu kaynakların dışında (yabancı mağaza, pazar yeri, kılavuz sitesi, liste sayfası) yayımlanmıştı.
// Kabul edilen mağazalarda doğrulanan değerler mağaza sayfasıyla geri gelir (shopVerifiedEquipment); doğrulanamayan değerler otomatik
// hesaptan çekilir, cihaz adıyla listede kalır ve kullanıcı etiket değerini kendisi girebilir (0017). Kaynağın yayımladığı eski
// değerler ve bağlantılar kaydın tanımlandığı dosyada durur.
import type { EquipmentProfile } from "./catalog-equipment";

/** Bütün sayısal değerleri hesaptan çekilen kayıtlar: kabul edilen 5 yerel mağazada bulunamadı ya da mağaza değer vermiyor (marka sırasıyla). */
export const unverifiedEquipmentIds: readonly string[] = [
  // Aquawing (19; AQ-A1000/2000/3000 zaten hesap dışı, güçleri 2026-09-25 denetiminde Türkiye kaynağıyla doğrulandı)
  "aquawing-aq101f", "aquawing-aq101fb", "aquawing-aq102f", "aquawing-aq160", "aquawing-aq600f", "aquawing-aq607f", "aquawing-aq80f",
  "aquawing-wp1000fa", "aquawing-wp1000fb", "aquawing-wp2300a", "aquawing-wp3300a", "aquawing-wp3300b", "aquawing-wp3300c", "aquawing-wp750fa",
  "aquawing-wp750fb", "aquawing-wp850fa", "aquawing-wp850fb", "aquawing-wp950fa", "aquawing-wp950fb",
  // JBL (3; 2026-10-30 JBL kaynak bağlantısı paketi: WHITE kayıtları değerleri eşdeğer greenline modelden almıştı; eski ürün sayfaları
  // JBL'in ana sayfasına yönleniyor ve WHITE'ı adıyla yazan açık bir JBL sayfası ya da belgesi bulunamadı.)
  "jbl-cristalprofi-e401-white-archive", "jbl-cristalprofi-e701-white-archive", "jbl-cristalprofi-e901-white-archive",
  // Boyu (11; 2026-10-30 örnek denetimi: HT ve DR serilerinin üretici sayfaları yalnız model adlarını ve boyları veriyor, gücü yazmıyor.
  // Güç model adından çıkarılmıştı; kabul edilen yerel mağazalarda bu modeller yok. DR-50 listede değil: seri sayfasındaki ürün
  // resminin etiketi "DR-50 220V 50Hz 50W" yazıyor. GR ve TR serilerinin tabloları gücü yazıyor.)
  "boyu-dr-100", "boyu-dr-150", "boyu-dr-200", "boyu-dr-250", "boyu-dr-300",
  "boyu-ht-650", "boyu-ht-6100", "boyu-ht-6150", "boyu-ht-6200", "boyu-ht-6250", "boyu-ht-6300",
  // Ejet (3; 905F için Malawi İzmir 1000 L/saat yazıyor ama 2026-08-27 Ejet denetimi bu değeri eldeki 470 L/saat kaydıyla çelişkili
  // bulup kullanmamıştı ve mağaza sayfası güç vermiyor. Değerin hangisinin doğru olduğu kurala uyan bir kaynaktan çözülemediği için
  // ikisi de kullanılmadı.)
  "ejet-905f", "ejet-907f", "ejet-bp3",
  // Eurostar (6)
  "eurostar-ege-2200f", "eurostar-ege-400", "eurostar-ege-500", "eurostar-ege-w550", "eurostar-marmara-double", "eurostar-marmara-single",
  // Haqos (5)
  "haqos-ex-1200at", "haqos-ex-1500at", "haqos-exp-500", "haqos-hf-900", "haqos-jular-230",
  // Netlea (14)
  "netlea-2fl-complete", "netlea-aquatic-time-no1-canister", "netlea-no1-dc-canister", "netlea-no1-sf", "netlea-no2-dc-canister", "netlea-no2-sf",
  "netlea-no2b-air-pump", "netlea-no2s-hang-on", "netlea-no2v-dc-canister", "netlea-no3-sf", "netlea-no3b-air-pump", "netlea-no4-sf",
  "netlea-no4b-q2-air-pump", "netlea-no4b-q9-air-pump",
  // Nubios (10; YU-118C zaten hesap dışı)
  "nubios-my03", "nubios-my05", "nubios-my07", "nubios-my10", "nubios-nb-1500f", "nubios-nb-800f", "nubios-nw-1500f", "nubios-nw-450f",
  "nubios-nw-600f", "nubios-nw-800f",
  // Regent (2; 6500–9500 aşağıda, yalnız debi)
  "regent-5500", "regent-calm-rc-006",
  // Resun (2)
  "resun-lp300", "resun-sf-400",
  // RS Electrical (7)
  "rs-118f", "rs-rs-04b", "rs-rs602", "rs-rs604", "rs-rs605", "rs-rs760", "rs-rs800",
  // Sobo (5; Türkiye distribütörünün sitesine, sobo.com.tr'ye dayanan Sobo kayıtları listede değil. Mağazalardaki WP-190F-UV5 ve
  // WP-290F-UV7 UV lambalı türler olduğu için bu kayıtlarla eşleştirilmedi; WP-390F sayfası kendi içinde çelişkili.)
  "sobo-sb-848", "sobo-wp-4001", "sobo-wp190f", "sobo-wp290f", "sobo-wp390f",
  // SunSun (2; Malawi İzmir sayfaları teknik değer vermiyor, Atakan Petshop'taki 503B ayrı tür)
  "sunsun-502", "sunsun-503",
  // Xinyou (11; hava motoruyla çalışan sünger filtre, önerilen hacimleri çekiliyor)
  "xinyou-xy-168", "xinyou-xy-180", "xinyou-xy-280", "xinyou-xy-2810", "xinyou-xy-2811", "xinyou-xy-2812", "xinyou-xy-2813", "xinyou-xy-2836",
  "xinyou-xy-2901", "xinyou-xy-2902", "xinyou-xy-380",
];

/** Yalnız hava debisi çekilen kayıtlar: kabul edilen yerel mağazaların ürün sayfaları gücü yayımlıyor, hava debisini yayımlamıyor.
 * Atakan Petshop'un marka sayfasındaki "6500 cc/dk hava akışı" gibi ifadeler ürün sayfası değil ve sayılar model adlarıyla aynı;
 * Akvaryum Express 9500 için birimsiz "900-1600 litre" yazıyor. */
export const unverifiedAirFlowIds: readonly string[] = ["regent-6500", "regent-7500", "regent-8500", "regent-9500"];

const valueFields = ["ratedFlowLph", "powerW", "recommendedMinL", "recommendedMaxL", "recommendedTankLengthCm", "integratedHeaterW", "integratedUvcW"] as const;
type ValueField = (typeof valueFields)[number];

/** Kabul edilen yerel mağaza sayfalarının okunduğu gün. */
export const shopVerifiedAt = "2026-10-17";

export interface ShopVerification {
  /** Değerleri yayımlayan kabul edilen yerel mağaza sayfası; kaydın kaynak bağlantısı buna geçer. */
  sourceUrl: string;
  /** Mağazada doğrulanan değerler. Burada olmayan değer hesaptan çekilir. */
  values: Partial<Pick<EquipmentProfile, ValueField>>;
  /** Mağaza sayfasına dayanan açıklama. */
  specifications: string;
  /** Doğrulanan değer bağımsız kapasite hesabına yetmiyorsa (ör. yalnız güç) kapasite notu. */
  note?: string;
}

// 2026-10-17'de kabul edilen 5 yerel mağazada (Akvaryum Express, Atakan Petshop, Malawi İzmir, Aquarubi, Betta Marketim; Çikletist
// Pet Shop sayfası insan doğrulaması istediği için açılamadı) doğrulanan kayıtlar. Kurallar (0019):
// - Değer, tam modelin ürün sayfasında (başlık, açıklama ya da teknik tablo) yazmalıdır; marka ya da liste sayfası yetmez.
// - Değer yalnızca kayıtta önceden olan alanda geri gelir; kayda yeni alan eklenmez.
// - Mağaza değeri eskisinden farklıysa mağazanınki kullanılır (ör. WaterBear Q serisi, Resun LP-200).
// - Kabul edilen mağazalar ya da aynı sayfanın başlığı ile açıklaması aynı alanı farklı yayımlıyorsa o değer kullanılmaz.
// - Hava debisi L/dakika yazıldıysa L/saate çevrilir; çok çıkışlı motorda çıkışlar toplanır.
export const shopVerifiedEquipment: Readonly<Record<string, ShopVerification>> = {
  // Aquawing (40)
  "aquawing-aq008": { sourceUrl: "https://www.akvaryumexpress.com/aquawing-aq008-tek-cikisli-hava-motoru", values: { ratedFlowLph: 180, powerW: 2.5 }, specifications: "Tek çıkışlı ayarlanabilir hava motoru · 3 L/dakika · 2,5 W · barkod 8681475613104" },
  "aquawing-aq088": { sourceUrl: "https://bettamarketim.com.tr/aquawing-aq088-akvaryum-tepe-filtresi-8w-880l-h", values: { ratedFlowLph: 880, powerW: 8 }, specifications: "Tepe akvaryum filtresi · 880 L/saat · 8 W · barkod 8681475613579" },
  "aquawing-aq103f": { sourceUrl: "https://atakanpetshop.com/aquawing-aq103f-ic-filtre-30w-2000l-h", values: { ratedFlowLph: 2000, powerW: 30 }, specifications: "İç filtre · 2000 L/saat · 30 W · barkod 8681475612909" },
  "aquawing-aq104f": { sourceUrl: "https://atakanpetshop.com/aquawing-aq104f-ic-filtre-40w-2800l-h", values: { ratedFlowLph: 2800, powerW: 40 }, specifications: "İç filtre · 2800 L/saat · 40 W · barkod 8681475612916" },
  "aquawing-aq105f": { sourceUrl: "https://atakanpetshop.com/aquawing-aq105f-ic-filtre-40w-2800l-h", values: { ratedFlowLph: 2800, powerW: 40 }, specifications: "İç filtre · 2800 L/saat · 40 W" },
  "aquawing-aq111f": { sourceUrl: "https://atakanpetshop.com/aquawing-aq111f-selale-ic-filtre-5w-600l-h", values: { ratedFlowLph: 600, powerW: 5 }, specifications: "Şelale iç filtre · 600 L/saat · 5 W · barkod 8681475611032" },
  "aquawing-aq1300f": { sourceUrl: "https://atakanpetshop.com/aquawing-aq1300f-tepe-filtre-25w-1500l-h", values: { ratedFlowLph: 1500 }, specifications: "Tepe filtre · 1500 L/saat · güç mağazalarda farklı (25 W / 30 W)" },
  "aquawing-aq1303": { sourceUrl: "https://atakanpetshop.com/aquawing-aq1303-bolmeli-ic-filtre-20w-1200l-h", values: { ratedFlowLph: 1200, powerW: 20 }, specifications: "İç filtre · 1200 L/saat · 20 W" },
  "aquawing-aq201f": { sourceUrl: "https://www.akvaryumexpress.com/aq201f-aquawing-akvaryum-ic-filtre-3w-300lh", values: { ratedFlowLph: 300, powerW: 3 }, specifications: "İç filtre · 300 L/saat · 3 W" },
  "aquawing-aq203f": { sourceUrl: "https://www.akvaryumexpress.com/aq203f-aquawing-akvaryum-ic-filtre-12w-600l-h", values: { ratedFlowLph: 600, powerW: 12 }, specifications: "İç filtre · 600 L/saat · 12 W" },
  "aquawing-aq204f": { sourceUrl: "https://www.akvaryumexpress.com/aquawing-aq204f-akvaryum-ic-filtre-15w-800l-h", values: { ratedFlowLph: 800, powerW: 15 }, specifications: "İç filtre · 800 L/saat · 15 W" },
  "aquawing-aq205f": { sourceUrl: "https://www.akvaryumexpress.com/aq205f-aquawing-ic-filtre-25w-1200l-h", values: { ratedFlowLph: 1200, powerW: 25 }, specifications: "İç filtre · 1200 L/saat · 25 W" },
  "aquawing-aq260": { sourceUrl: "https://atakanpetshop.com/aquawing-aq260-cift-cikisli-hava-motoru", values: { ratedFlowLph: 360, powerW: 5 }, specifications: "Çift çıkışlı hava motoru · 2 × 3 L/dakika · 5 W" },
  "aquawing-aq301hf": { sourceUrl: "https://atakanpetshop.com/aquawing-aq301hf-selale-filtre-5w-300l-h", values: { ratedFlowLph: 300, powerW: 5 }, specifications: "Şelale filtre · 300 L/saat · 5 W · barkod 8681475613029" },
  "aquawing-aq302hf": { sourceUrl: "https://atakanpetshop.com/aquawing-aq302hf-selale-filtre-5w-300l-h", values: { ratedFlowLph: 300, powerW: 5 }, specifications: "Şelale filtre · 300 L/saat · 5 W · barkod 8681475611049" },
  "aquawing-aq310f": { sourceUrl: "https://www.akvaryumexpress.com/aq310f-aquawing-ic-filtre-4w-400l-h", values: { ratedFlowLph: 400, powerW: 4 }, specifications: "İç filtre · 400 L/saat · 4 W · barkod 8681475612824" },
  "aquawing-aq311": { sourceUrl: "https://aquarubi.com/aquawing-aq311-tek-cikisli-hava-motoru", values: { ratedFlowLph: 108, powerW: 2.5 }, specifications: "Tek çıkışlı hava motoru · 1,8 L/dakika (108 L/saat) · 2,5 W · barkod 8681475611063" },
  "aquawing-aq312": { sourceUrl: "https://www.akvaryumexpress.com/aq312-aquawing-cift-cikisli-hava-motoru-3w", values: { powerW: 3 }, specifications: "Çift çıkışlı hava motoru · 3 W · hava debisi doğrulanamadı", note: "Hava debisinin kaynağı cihanakvaryum.com; kabul edilen yerel mağazalar (Akvaryum Express, Aquarubi) yalnızca gücü yayımlıyor. Debi otomatik hesapta kullanılmaz." },
  "aquawing-aq388": { sourceUrl: "https://atakanpetshop.com/aquawing-aq388-tepe-filtre-35w-2500l-h", values: { ratedFlowLph: 2500, powerW: 35 }, specifications: "Tepe akvaryum filtresi · 2500 L/saat · 35 W · barkod 8681475613609" },
  "aquawing-aq40f": { sourceUrl: "https://atakanpetshop.com/aquawing-aq40f-ic-filtre-12w-550l-h", values: { ratedFlowLph: 550, powerW: 12 }, specifications: "İç filtre · 550 L/saat · 12 W · barkod 8681475612862" },
  "aquawing-aq501hf": { sourceUrl: "https://atakanpetshop.com/aquawing-aq501hf-selale-filtre-8w-500l-h", values: { ratedFlowLph: 500, powerW: 8 }, specifications: "Şelale filtre · 500 L/saat · 8 W · barkod 8681475613036" },
  "aquawing-aq510f": { sourceUrl: "https://atakanpetshop.com/aquawing-aq510f-ic-filtre-4w-400l-h", values: { ratedFlowLph: 400, powerW: 4 }, specifications: "İç filtre · 400 L/saat · 4 W · barkod 8681475612848" },
  "aquawing-aq520f": { sourceUrl: "https://www.akvaryumexpress.com/aq520f-aquawing-ic-filtre-6w-500l-h", values: { ratedFlowLph: 500, powerW: 6 }, specifications: "İç filtre · 500 L/saat · 6 W" },
  "aquawing-aq601f": { sourceUrl: "https://atakanpetshop.com/aquawing-aq601f-ic-filtre-15w-880l-h", values: { ratedFlowLph: 880, powerW: 15 }, specifications: "İç filtre · 880 L/saat · 15 W" },
  "aquawing-aq602f": { sourceUrl: "https://atakanpetshop.com/aquawing-aq602f-ic-filtre-18w-1000l-h", values: { ratedFlowLph: 1000, powerW: 18 }, specifications: "İç filtre · 1000 L/saat · 18 W" },
  "aquawing-aq603f": { sourceUrl: "https://atakanpetshop.com/aquawing-aq603f-ic-filtre-20w-1200l-h", values: { ratedFlowLph: 1200, powerW: 20 }, specifications: "İç filtre · 1200 L/saat · 20 W · barkod 8681475612770" },
  "aquawing-aq604f": { sourceUrl: "https://atakanpetshop.com/aquawing-aq604f-ic-filtre-20w-1200l-h", values: { ratedFlowLph: 1200, powerW: 20 }, specifications: "İç filtre · 1200 L/saat · 20 W" },
  "aquawing-aq605f": { sourceUrl: "https://atakanpetshop.com/aquawing-aq605f-ic-filtre-15w-880l-h", values: { ratedFlowLph: 880, powerW: 15 }, specifications: "İç filtre · 880 L/saat · 15 W" },
  "aquawing-aq60f": { sourceUrl: "https://atakanpetshop.com/aquawing-aq60f-ic-filtre-15w-880l-h", values: { ratedFlowLph: 880, powerW: 15 }, specifications: "İç filtre · 880 L/saat · 15 W · barkod 8681475622007" },
  "aquawing-aq680": { sourceUrl: "https://www.akvaryumexpress.com/aq680-aquawing-yuzey-emici-filtre-5w-880l-h", values: { ratedFlowLph: 880, powerW: 5 }, specifications: "Yüzey emici filtre · 880 L/saat · 5 W · önerilen hacim mağazalarda farklı (80 L / 350 L) · barkod 8681475610967" },
  "aquawing-aq702f": { sourceUrl: "https://bettamarketim.com.tr/aquawing-aq702f-akvaryum-ic-filtre-25w-1500l-h-3-sepetli", values: { ratedFlowLph: 1500, powerW: 25 }, specifications: "İç filtre · 1500 L/saat · 25 W" },
  "aquawing-aq703f": { sourceUrl: "https://bettamarketim.com.tr/aquawing-aq703f-akvaryum-ic-filtre-30w-1800l-h", values: { ratedFlowLph: 1800, powerW: 30 }, specifications: "İç filtre · 1800 L/saat · 30 W" },
  "aquawing-aq708": { sourceUrl: "https://atakanpetshop.com/aquawing-aq708-tek-cikisli-hava-motoru-3w", values: { ratedFlowLph: 210, powerW: 3, recommendedMaxL: 60 }, specifications: "Tek çıkışlı hava motoru · 3,5 L/dakika (210 L/saat) · 3 W · 60 litreye kadar · barkod 8681475613111" },
  "aquawing-aq818": { sourceUrl: "https://www.akvaryumexpress.com/aquawing-aq818-tek-cikisli-hava-motoru-25w", values: { ratedFlowLph: 180, powerW: 2.5 }, specifications: "Tek çıkışlı ayarlanabilir hava motoru · 3 L/dakika · 2,5 W" },
  "aquawing-aq838": { sourceUrl: "https://www.akvaryumexpress.com/aquawing-aq838-cift-cikisli-hava-motoru-8w", values: { ratedFlowLph: 420, powerW: 8 }, specifications: "Çift çıkışlı hava motoru · 2 × 3,5 L/dakika · 8 W" },
  "aquawing-aq848": { sourceUrl: "https://www.akvaryumexpress.com/aquawing-aq848-cift-cikisli-hava-motoru-10w", values: { ratedFlowLph: 480, powerW: 10 }, specifications: "Çift çıkışlı hava motoru · 2 × 4 L/dakika · 10 W" },
  "aquawing-aq908": { sourceUrl: "https://www.akvaryumexpress.com/aquawing-aq908-cift-cikisli-hava-motoru-5w", values: { ratedFlowLph: 480, powerW: 5 }, specifications: "Çift çıkışlı hava motoru · 2 × 4 L/dakika · 5 W" },
  "aquawing-aq920fa": { sourceUrl: "https://www.akvaryumexpress.com/aq920fa-aquawing-ic-filtre-30w-1500-h", values: { ratedFlowLph: 1500, powerW: 30 }, specifications: "İç filtre · 1500 L/saat · 30 W" },
  "aquawing-aq920fc": { sourceUrl: "https://www.akvaryumexpress.com/aq920fc-aquawing-ic-filtre-30w-1500l-h", values: { ratedFlowLph: 1500, powerW: 30 }, specifications: "İç filtre · 1500 L/saat · 30 W · barkod 8681475612954" },
  "aquawing-aq930": { sourceUrl: "https://atakanpetshop.com/aquawing-aq930-tek-cikisli-hava-motoru-3-5w", values: { ratedFlowLph: 270, powerW: 3.5 }, specifications: "Tek çıkışlı hava motoru · 4,5 L/dakika · 3,5 W · barkod 8681475622083" },
  // Ejet (2)
  "ejet-906f": { sourceUrl: "https://malawiizmir.com/e-jet-906-f-1050-lt-s-ic-filtre", values: { ratedFlowLph: 1050, powerW: 15 }, specifications: "İç filtre · 1050 L/saat · 15 W" },
  "ejet-908f": { sourceUrl: "https://malawiizmir.com/e---jet-908-f-ic-filtre-1400-litre-saat", values: { ratedFlowLph: 1400 }, specifications: "İç filtre · 1400 L/saat · güç yayımlanmamış" },
  // Eurostar (2)
  "eurostar-ege-sp200": { sourceUrl: "https://bettamarketim.com.tr/eurostar-ege-sp200-ic-filtre-200-lt-h-2w", values: { ratedFlowLph: 200, powerW: 2 }, specifications: "Kompakt iç filtre · 200 L/saat · 2 W" },
  "eurostar-ege-sp300": { sourceUrl: "https://bettamarketim.com.tr/eurostar-ege-sp300-ic-filtre", values: { ratedFlowLph: 300, powerW: 2 }, specifications: "Ayarlanabilir çıkışlı kompakt iç filtre · 300 L/saat · 2 W · önerilen hacim doğrulanamadı" },
  // Resun (3)
  "resun-lp20": { sourceUrl: "https://atakanpetshop.com/resun-lp-20-dusuk-sesli-hava-pompasi", values: { powerW: 17 }, specifications: "Düşük sesli üretim tipi hava motoru · 17 W · hava debisi mağazalarda farklı (28 L/dakika / 1500 L/saat)", note: "Kabul edilen yerel mağazalar hava debisini farklı yayımlıyor (28 L/dakika, yani 1680 L/saat; 1500 L/saat). Debi otomatik hesapta kullanılmaz." },
  "resun-lp200": { sourceUrl: "https://atakanpetshop.com/resun-lp-200-hava-kompresoru", values: { ratedFlowLph: 15000, powerW: 200 }, specifications: "Düşük sesli üretim tipi hava motoru · 250 L/dakika (15.000 L/saat) · 200 W" },
  "resun-lp40": { sourceUrl: "https://malawiizmir.com/resun-lp-40-akvaryum-hava-kompresor", values: { ratedFlowLph: 3000, powerW: 35 }, specifications: "Düşük sesli üretim tipi hava motoru · 3000 L/saat (50 L/dakika) · 35 W" },
  // RS Electrical (6)
  "rs-062a": { sourceUrl: "https://bettamarketim.com.tr/ic-filitre-300l-h-rs-062a", values: { ratedFlowLph: 300, powerW: 2 }, specifications: "İç filtre · 300 L/saat · 2 W" },
  "rs-082a": { sourceUrl: "https://bettamarketim.com.tr/ic-filitre-450l-h-6watt-rs-082a", values: { ratedFlowLph: 450, powerW: 6 }, specifications: "İç filtre · 450 L/saat · 6 W" },
  "rs-188-top": { sourceUrl: "https://atakanpetshop.com/rs-188-tepe-filtre-800l-h-12w", values: { ratedFlowLph: 800, powerW: 12 }, specifications: "Tepe filtre · 800 L/saat · 12 W" },
  "rs-388-top": { sourceUrl: "https://atakanpetshop.com/rs-388-tepe-filtre-1750l-h-25w", values: { ratedFlowLph: 1750, powerW: 25 }, specifications: "Tepe filtre · 1750 L/saat · 25 W" },
  "rs-rs2002": { sourceUrl: "https://bettamarketim.com.tr/ic-filitre-1500l-h-18watt-rs-2002-yeni-model", values: { ratedFlowLph: 1500, powerW: 18 }, specifications: "İç filtre · 1500 L/saat · 18 W" },
  "rs-rs2004": { sourceUrl: "https://bettamarketim.com.tr/ic-filitre-1750l-h-25watt-rs-2004-yeni-model", values: { ratedFlowLph: 1750, powerW: 25 }, specifications: "İç filtre · 1750 L/saat · 25 W" },
  // Sobo (7)
  "sobo-aq-500f": { sourceUrl: "https://atakanpetshop.com/sobo-aq-500f-ic-filtre-yeni-nesil-6w-500l-s", values: { ratedFlowLph: 500, powerW: 6 }, specifications: "Kompakt iç filtre · 500 L/saat · 6 W" },
  "sobo-fg-1204": { sourceUrl: "https://www.akvaryumexpress.com/sobo-fg-1204-internal-filter-ic-filtre", values: { ratedFlowLph: 880, powerW: 12 }, specifications: "Dört filtre malzemeli, Venturi çıkışlı iç filtre · 880 L/saat · 12 W" },
  "sobo-sb-860a": { sourceUrl: "https://malawiizmir.com/sobo-sb-860a-cift-cikisli-hava-motoru", values: { powerW: 5 }, specifications: "Ayarlanabilir çift çıkışlı hava motoru · 5 W · hava debisi doğrulanamadı", note: "Hava debisinin kaynağı pets-lifestyle.com; kabul edilen yerel mağaza (Malawi İzmir) yalnızca gücü yayımlıyor. Debi otomatik hesapta kullanılmaz." },
  "sobo-sf-550f": { sourceUrl: "https://www.akvaryumexpress.com/sobo-sf-550f-askili-dis-filtre", values: { ratedFlowLph: 500 }, specifications: "Askı dış filtre · 500 L/saat · güç mağazalarda farklı (7 W / 8,6 W)" },
  "sobo-wp-303h": { sourceUrl: "https://atakanpetshop.com/sobo-mini-aski-filtre-5w-280lh-745-wp-303h", values: { ratedFlowLph: 280, powerW: 5, recommendedMinL: 10, recommendedMaxL: 50 }, specifications: "Ayarlanabilir, yüzey emişli askı şelale filtre · 280 L/saat · 5 W · 10–50 litre" },
  "sobo-wp-607h": { sourceUrl: "https://malawiizmir.com/sobo-wp-607h-selale-filtre-600-l-h", values: { ratedFlowLph: 600, powerW: 12 }, specifications: "Ayarlanabilir, yüzey emişli askı şelale filtre · 600 L/saat · 12 W" },
  "sobo-wp-950f": { sourceUrl: "https://atakanpetshop.com/sobo-wp-950f-mini-ic-filtre-6w-500ls", values: { ratedFlowLph: 500, powerW: 6 }, specifications: "İç filtre · 500 L/saat · 6 W" },
  // SunSun (1)
  "sunsun-604b": { sourceUrl: "https://malawiizmir.com/sunsun-604-b-dis-filtre-800-l-h", values: { ratedFlowLph: 800, powerW: 14 }, specifications: "Kompakt dış filtre · 800 L/saat · 14 W" },
  // WaterBear (12)
  "waterbear-q418": { sourceUrl: "https://bettamarketim.com.tr/waterbear-q418-tek-cikisli-hava-motoru-2-5w-3-5-lt-dak", values: { ratedFlowLph: 210, powerW: 2.5 }, specifications: "Tek çıkış · 3,5 L/dakika hava motoru · 210 L/saat · 2,5 W" },
  "waterbear-q428": { sourceUrl: "https://bettamarketim.com.tr/waterbear-q428-cift-cikisli-hava-motoru-12w-2x4-5l-dak", values: { ratedFlowLph: 540, powerW: 12 }, specifications: "Çift çıkış · 2 × 4,5 L/dakika hava motoru · 540 L/saat · 12 W" },
  "waterbear-q448": { sourceUrl: "https://atakanpetshop.com/waterbear-q448-dort-cikisli-hava-motoru-8w-4x3l", values: { ratedFlowLph: 720, powerW: 8 }, specifications: "Dört çıkış · 4 × 3 L/dakika hava motoru · 720 L/saat · 8 W" },
  "waterbear-q458": { sourceUrl: "https://bettamarketim.com.tr/waterbear-q458-dort-cikisli-hava-motoru-12w-4x4l-dak", values: { ratedFlowLph: 960, powerW: 12 }, specifications: "Dört çıkış · 4 × 4 L/dakika hava motoru · 960 L/saat · 12 W" },
  "waterbear-q708": { sourceUrl: "https://malawiizmir.com/waterbear-q708-hava-motoru-tek-cikisli-1-l-dak", values: { ratedFlowLph: 60 }, specifications: "Tek çıkış · 1 L/dakika hava motoru · 60 L/saat" },
  "waterbear-q718": { sourceUrl: "https://aquarubi.com/waterbear-wb-q718-tek-cikisli-hava-motoru", values: { ratedFlowLph: 90 }, specifications: "Tek çıkış · 1,5 L/dakika hava motoru · 90 L/saat" },
  "waterbear-wb-1770": { sourceUrl: "https://malawiizmir.com/waterbear-wb-1770-akvaryum-ic-filtre-500l-h", values: { ratedFlowLph: 500 }, specifications: "İç filtre · 500 L/saat · güç mağazalarda farklı (6 W / 8 W)" },
  "waterbear-wb-2770": { sourceUrl: "https://aquarubi.com/waterbear-wb-2770-akvaryum-ic-filtre", values: { powerW: 12 }, specifications: "İç filtre · 12 W · debi mağazalarda farklı (800 L/saat / 900 L/saat)", note: "Kabul edilen yerel mağazalar debiyi farklı yayımlıyor (ürün başlığında 800 L/saat, açıklamada 900 L/saat). Debi otomatik hesapta kullanılmaz." },
  "waterbear-wb-3770": { sourceUrl: "https://aquarubi.com/waterbear-wb-3770-akvaryum-ic-filtre", values: { ratedFlowLph: 1200, powerW: 18 }, specifications: "İç filtre · 1200 L/saat · 18 W" },
  "waterbear-wb-4770": { sourceUrl: "https://aquarubi.com/waterbear-wb-4770-akvaryum-ic-filtre", values: { ratedFlowLph: 1600, powerW: 25 }, specifications: "İç filtre · 1600 L/saat · 25 W" },
  "waterbear-wb-g800": { sourceUrl: "https://atakanpetshop.com/waterbear-wb-g800-zamanlayicili-uvli-ic-filtre-10w-800ls", values: { ratedFlowLph: 800, powerW: 10 }, specifications: "Zaman ayarlı UV modüllü iç filtre · 800 L/saat · 10 W" },
  "waterbear-wb-g810": { sourceUrl: "https://atakanpetshop.com/waterbear-wb-g810-zamanlayicili-uvli-ic-filtre-15w-900ls", values: { ratedFlowLph: 900 }, specifications: "Zaman ayarlı UV modüllü iç filtre · 900 L/saat · güç mağaza sayfalarında farklı (10 W / 15 W)" },
  // Xinyou (1)
  "xinyou-xy-2835": { sourceUrl: "https://bettamarketim.com.tr/pipo-filtre-xy-2835-mini-40lt", values: { recommendedMaxL: 40 }, specifications: "Hava ile çalışan biyolojik sünger filtre · 40 litreye kadar" },
  // XLPro (2)
  "xlpro-230-mini": { sourceUrl: "https://www.akvaryumexpress.com/xl-pro-xlpro-230-mini-dis-filtre-210l-s", values: { ratedFlowLph: 210, powerW: 1.7 }, specifications: "Mini dış filtre · 210 L/saat · 1,7 W" },
  "xlpro-500at-mini": { sourceUrl: "https://malawiizmir.com/xlpro-mini---500at-dis-filtre-450l-h", values: { ratedFlowLph: 450, recommendedMaxL: 100 }, specifications: "Yüzey emicili mini dış filtre · 450 L/saat · 100 litreye kadar" },
};

// Açıklamadaki değer parçaları: "600 L/saat", "2 × 3,5 L/dakika", "15 W", "3,5–28 W", "20–40 litre", "50 litreye kadar", "10–120 L",
// "9 L filtre malzemesi", "25–60 cm akvaryum", "20 kPa", "0,020 MPa", "3550 mAh / 17,75 Wh", "1,2 m azami basma yüksekliği",
// "220–240 V", "50–60 Hz" ve yazıyla yazılmış miktar ("üç litre filtre hacimli"). Açıklama " · " ile ayrılmış parçalardan oluşur;
// değer taşıyan parça çıkarılır. Ürün kodu, barkod ve "üç aşamalı", "dört çıkış" gibi özellikler kalır.
const range = String.raw`\d[\d.,]*\s*(?:[–-]\s*\d[\d.,]*\s*)?`;
const flowPart = /\d[\d.,]*\s*(?:×\s*\d[\d.,]*\s*)?L\s*\/\s*(?:saat|dakika|h|min)\b/i;
const writtenAmount = /(?:^|[\s(])(?:yarım|bir|iki|üç|dört|beş|altı|yedi|sekiz|dokuz|on|yirmi|otuz|kırk|elli|altmış|yetmiş|seksen|doksan|yüz|bin)(?:\s+(?:buçuk|yüz|bin))?\s+(?:litre|watt|santimetre|metre)/iu;
const otherValueParts = [
  new RegExp(`${range}W\\b`),
  new RegExp(`${range}(?:litre|L\\b)`, "i"),
  new RegExp(`${range}(?:cm|m)\\b`),
  new RegExp(`${range}(?:kPa|MPa|bar)\\b`, "i"),
  new RegExp(`${range}(?:mAh|Wh)\\b`),
  new RegExp(`${range}(?:V|Hz)\\b`),
  writtenAmount,
];
// Açıklama değerin yayımlanmadığını ya da doğrulanamadığını zaten söylüyorsa ayrıca eklenmez.
const alreadyExplained = /yayımlanmamış|doğrulanamadı/i;

const hostOf = (url?: string) => {
  try {
    return url ? new URL(url).hostname.replace(/^www\./, "") : "belirtilmemiş";
  } catch {
    return "belirtilmemiş";
  }
};

// Açıklamaya eklenen ifade çekilen değere göre seçilir: debi çekildiyse debi, yalnız hacim önerisi çekildiyse hacim, yalnız güç
// çekildiyse güç (ör. üreticinin gücü yazmadığı ısıtıcı). Açıklama değerin neden olmadığını zaten söylüyorsa eklenmez.
const missingText = (item: EquipmentProfile, withdrawn: readonly ValueField[]) =>
  withdrawn.includes("ratedFlowLph") ? (item.category === "air_pump" ? "hava debisi doğrulanamadı" : "debi doğrulanamadı")
    : withdrawn.includes("recommendedMinL") || withdrawn.includes("recommendedMaxL") ? "önerilen hacim doğrulanamadı"
      : withdrawn.includes("powerW") ? "güç doğrulanamadı"
        : undefined;

function withdraw(item: EquipmentProfile, fields: readonly ValueField[], parts: readonly RegExp[], note: string) {
  const withdrawn = fields.filter((field) => item[field] !== undefined);
  for (const field of withdrawn) delete item[field];
  const kept = item.specifications.split(" · ").filter((part) => !parts.some((pattern) => pattern.test(part)));
  const missing = missingText(item, withdrawn);
  item.specifications = [...kept, ...(missing && !kept.some((part) => alreadyExplained.test(part)) ? [missing] : [])].join(" · ");
  // Hava motoruyla çalışan sünger filtre hacim önerisi olmadan da "hava motoruna bağlı filtre" olarak değerlendirilir; kapasite notu
  // yalnızca değeri tümüyle eksik kalan kayıtta tutulur (catalog-equipment.ts bütünlük denetimi).
  if (!item.requiresAirPump && !item.capacityDataNote) item.capacityDataNote = note;
}

function applyShopVerification(item: EquipmentProfile, verification: ShopVerification) {
  for (const field of valueFields) delete item[field];
  Object.assign(item, verification.values);
  item.sourceUrl = verification.sourceUrl;
  item.verifiedAt = shopVerifiedAt;
  item.specifications = verification.specifications;
  if (verification.note) item.capacityDataNote = verification.note;
}

/** Listedeki kayıtların doğrulanamayan değerlerini çeker, mağazada doğrulananları mağaza değeriyle yazar. Bulunamayan kimlikleri döndürür (bütünlük denetimi hata verir). */
export function withdrawUnverifiedEquipmentValues(catalog: EquipmentProfile[]): string[] {
  const byId = new Map(catalog.map((item) => [item.id, item]));
  const missingIds: string[] = [];
  const find = (id: string) => {
    const item = byId.get(id);
    if (!item) missingIds.push(id);
    return item;
  };
  for (const id of unverifiedEquipmentIds) {
    const item = find(id);
    if (item) withdraw(item, valueFields, [flowPart, ...otherValueParts],
      `Değerlerin kaynağı ${hostOf(item.sourceUrl)}; üretici, Türkiye distribütörü ya da kabul edilen yerel mağazalarda doğrulanamadı. Otomatik hesapta kullanılmaz.`);
  }
  for (const id of unverifiedAirFlowIds) {
    const item = find(id);
    if (item) withdraw(item, ["ratedFlowLph"], [flowPart],
      `Hava debisinin kaynağı ${hostOf(item.sourceUrl)}; kabul edilen yerel mağazalar gücü yayımlıyor, hava debisini L/saat ya da L/dakika olarak yayımlamıyor. Debi otomatik hesapta kullanılmaz.`);
  }
  for (const [id, verification] of Object.entries(shopVerifiedEquipment)) {
    const item = find(id);
    if (item) applyShopVerification(item, verification);
  }
  return missingIds;
}
