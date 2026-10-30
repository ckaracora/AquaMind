// Sağlık analizi motorunun uyarı ve ölçüt metinleri (karar 0021, 3. paket ve 3b). Motor her uyarı için `code` ve `params`, her ölçüt
// için `detailCode` ve `detailParams` üretir; ekran metni burada kurulur. Sözcükler motorun kendi Türkçe alanlarıyla aynıdır; sayılar ve
// hacimler dilin ayırıcılarıyla ve kullanıcının hacim tercihiyle yazılır (`EngineTextFormat`, 3b). Eşitlik testi:
// src/lib/__tests__/engine-text.test.ts. Bu metinler yalnız sağlık sayfasında gerektiği için arayüz metinlerinden (`Messages`) ayrı
// tutulur ve paketin ayrı girişinden (`@aquamind/localization/engine`, `engineMessagesFor`) alınır; öteki sayfaların paketine girmez.
import type { EngineTextFormat } from "../engine-format";

/** Motor değişkenlerinin değer türleri (motorun `EngineParams` türüyle aynı biçim). */
export type EngineTextParams = Record<string, string | number | boolean | string[]>;
type Text = (p: EngineTextParams, f: EngineTextFormat) => string;

const num = (p: EngineTextParams, key: string) => p[key] as number;
const str = (p: EngineTextParams, key: string) => p[key] as string;
const list = (p: EngineTextParams, key: string) => p[key] as string[];
const flag = (p: EngineTextParams, key: string) => p[key] as boolean;
const nameList = (names: string[]) => (names.length > 1 ? `${names.slice(0, -1).join(", ")} ve ${names[names.length - 1]}` : names[0]);
const sentence = (text: string) => text.replace(/\.?$/, ".");
const sourceNote = (p: EngineTextParams) =>
  (str(p, "condition") ? ` Kaynağın notu: ${sentence(str(p, "condition"))}` : "") + ` Kaynak: ${str(p, "source")}.`;
const aquariumTypeName = (type: string) => (type === "freshwater" ? "tatlı su" : type === "saltwater" ? "tuzlu su" : "acı su");
const waterFieldName = (field: string) => ({ ammonia: "amonyak", nitrite: "nitrit", nitrate: "nitrat" } as Record<string, string>)[field] ?? field;
const manufacturerCapacity = (p: EngineTextParams, f: EngineTextFormat) =>
  flag(p, "multiple")
    ? `filtrelerin üreticilerince önerilen toplam hacmin (${f.volume(num(p, "liters"), num(p, "volume"))})`
    : `filtrenin üreticisinin önerdiği en büyük hacmin (${f.volume(num(p, "liters"), num(p, "volume"))})`;
const spaceReference = (p: EngineTextParams, f: EngineTextFormat) =>
  flag(p, "hasLength")
    ? `Kayıtlı adet için minimum ${f.volume(num(p, "volume"))} ve ${f.length(num(p, "length"))} uzunluk referansı kullanıldı.`
    : `Kayıtlı adet için minimum ${f.volume(num(p, "volume"))} referansı kullanıldı; kaynak tank uzunluğu yayımlamıyor.`;
const fixed = (text: string): Text => () => text;
/** Deniz akvaryumunun hedefinin adı (motor 1.13.0, `MarineProfile`). */
const marineTarget = (p: EngineTextParams) => (str(p, "profile") === "fishOnly" ? "yalnız balıklı akvaryum" : "omurgasızlı akvaryum");
const marineRange = (p: EngineTextParams, f: EngineTextFormat) => `${f.measurement(num(p, "min"), 3)}–${f.measurement(num(p, "max"), 3)}`;
/** Özgül ağırlığın güvenli aralığı: OATA'nın iki ev akvaryumu hedefinin birleşimi; motorun `MARINE_SPECIFIC_GRAVITY_SAFE` sabitiyle aynı olmalı (testte denetlenir). */
export const MARINE_SPECIFIC_GRAVITY_SAFE_MIN = 1.017;
export const MARINE_SPECIFIC_GRAVITY_SAFE_MAX = 1.026;
/** Nitrat sınırları (ppm); motorun `MARINE_NITRATE_LIMIT`, `TAP_WATER_NITRATE_LIMIT` ve `NITRATE_ABOVE_TAP_LIMIT` sabitleriyle aynı olmalı (testte denetlenir). */
export const MARINE_NITRATE_LIMIT_PPM = 100;
export const TAP_WATER_NITRATE_LIMIT_PPM = 50;
export const NITRATE_ABOVE_TAP_LIMIT_PPM = 50;

export const trEngine = {
  /** Ölçütlerin adları, motorun `key` alanına göre. */
  metricLabels: {
    load: "Biyolojik yük",
    space: "Yüzme alanı",
    social: "Sosyal ihtiyaç",
    compatibility: "Tür uyumu",
    filter: "Filtrasyon uygunluğu",
    heater: "Isıtıcı uygunluğu",
    water: "Su değeri uyumu",
    confidence: "Veri güveni",
  },
  /** Ölçüt açıklamaları, motorun `detailCode` alanına göre. */
  metricDetails: {
    loadRatio: (p, f) => `Tahmini yük oranı %${f.number(num(p, "percent"))}`,
    spaceSevere: (p, f) => `${f.number(num(p, "count"))} tür için akvaryum çok küçük`,
    spaceLimited: (p, f) => `${f.number(num(p, "count"))} tür için alan sınırda`,
    spaceOk: fixed("Kayıtlı türler için uygun"),
    groupLow: (p, f) => `${f.number(num(p, "count"))} türün grup sayısı düşük`,
    groupOk: fixed("Grup ihtiyaçları uygun"),
    habitat: fixed("Akvaryum türüyle yaşam ortamı uyuşmuyor"),
    speciesOnly: fixed("Tür akvaryumu önerilen canlı var"),
    predation: fixed("Küçük canlılar için avlanma riski var"),
    waterRanges: fixed("Su değeri aralıkları kesişmiyor"),
    smallFishPredation: fixed("Küçük balıklar avlanabilir"),
    finNip: fixed("Yüzgeç ısırma riski var"),
    conspecific: fixed("Aynı tür bireyleri kavga edebilir"),
    shrimpEaten: fixed("Karidesler yenebilir"),
    snailEaten: fixed("Salyangozlar yenebilir"),
    flowConflict: fixed("Akıntı ihtiyaçları farklı"),
    communityCaution: fixed("Tank arkadaşı seçimi dikkat gerektiriyor"),
    shrimpUnverified: fixed("Karides uyumu doğrulanmadı"),
    compatible: fixed("Ortak yaşam aralıkları mevcut"),
    manufacturerMax: (p, f) => `Üretici önerisi en fazla ${f.volume(num(p, "liters"))}`,
    ratedTurnover: (p, f) => `Etiket debisiyle ${f.cycles(num(p, "turnover"))} çevrim/saat`,
    mixedMax: (p, f) => `Üretici önerisi ve etiket debisine göre en fazla ${f.volume(num(p, "liters"))}`,
    airReady: fixed("Hava motorlu sünger filtre bağlantısı hazır"),
    airMissing: fixed("Sünger filtre için hava motoru gerekli"),
    flowUnverified: fixed("Debi bilgisi doğrulanmayı bekliyor"),
    auxiliaryOnly: fixed("Yalnız yardımcı yüzey skimmeri kayıtlı; ana filtre gerekli"),
    noFilter: fixed("Katalogdan filtre bulunamadı"),
    estimatedOk: (p, f) => `Toplam ${f.number(num(p, "watts"))} W için tahmini hacim uygun`,
    manufacturerOk: fixed("Üretici hacim aralığı uygun"),
    powerLow: fixed("Isıtma gücü bu hacim için düşük"),
    powerHigh: fixed("Isıtma gücü bu hacim için yüksek"),
    outOfRange: fixed("Hacim aralığı dışında"),
    heaterUnverified: fixed("Watt veya hacim verisi doğrulanmayı bekliyor"),
    noHeater: fixed("Katalogdan ısıtıcı bulunamadı"),
    latestReading: fixed("Son ölçüme göre"),
    readingNeeded: fixed("Ölçüm eklenmesi gerekli"),
    recordsReady: (p, f) =>
      `${f.number(num(p, "ready"))}/${f.number(num(p, "total"))} güvenlik kaydı hesaplamaya hazır${num(p, "userValue") ? ` · ${f.number(num(p, "userValue"))} kayıt senin girdiğin değerle` : ""}`,
    noRecords: fixed("Güvenlik hesabı için kayıt bulunamadı"),
  } satisfies Record<string, Text>,
  /** Uyarıların başlıkları ve metinleri, motorun `code` alanına göre. */
  warnings: {
    unmatchedAnimals: {
      title: fixed("Katalogla eşleşmeyen canlı kaydı var"),
      message: (p, f) => `${f.number(num(p, "count"))} canlı kaydı tanınmadığı için biyolojik yük ve uyumluluk hesabına dahil edilmedi.`,
    },
    unmatchedEquipment: {
      title: fixed("Katalogla eşleşmeyen ekipman kaydı var"),
      message: (p, f) => `${f.number(num(p, "count"))} ekipmanın kapasitesi tanınmadığı için filtrasyon veya ısıtıcı hesabına dahil edilmedi.`,
    },
    unverifiedAnimals: {
      title: fixed("Bazı canlı verileri doğrulanmayı bekliyor"),
      message: (p, f) => `${f.number(num(p, "count"))} canlı kaydı güvenlik hesabına dahil edilmedi; doğrulanmış katalog kaydı seçilmeli.`,
    },
    unverifiedEquipment: {
      title: fixed("Bazı ekipman verileri doğrulanmayı bekliyor"),
      message: (p, f) => `${f.number(num(p, "count"))} ekipman kaydının teknik değerleri otomatik kapasite hesabında kullanılmadı.`,
    },
    missingCapacity: {
      title: fixed("Ekipman kapasite bilgisi eksik"),
      message: (p, f) =>
        `${list(p, "names").join(", ")}${num(p, "remaining") ? ` ve ${f.number(num(p, "remaining"))} ekipman daha` : ""} güvenli kapasite hesabına alınamadı.${str(p, "note") ? ` ${str(p, "note")}` : " Gerekli debi, hacim veya hava motoru bağlantısı doğrulanmalı."}`,
    },
    primaryFilterRequired: {
      title: fixed("Ana filtre gerekli"),
      message: fixed("Yüzey skimmeri su yüzeyindeki filmi toplar ancak tek başına ana mekanik ve biyolojik filtrenin yerine geçmez. Katalogdan akvaryuma uygun bir ana filtre ekleyin."),
    },
    airPumpRequired: {
      title: fixed("Sünger filtre için hava motoru gerekli"),
      message: fixed("Seçilen pipo/sünger filtre kendi başına su çevirmez. Katalogdan uygun bir hava motoru ekleyin."),
    },
    highLoad: {
      title: fixed("Biyolojik yük yüksek olabilir"),
      message: fixed("Tahmini canlı yükü, türlerin kaynaklarında önerilen koşulların belirgin biçimde üstünde. Canlı eklemeden önce filtrasyonu ve bakım sıklığını gözden geçir; amonyak, nitrit ve nitratı düzenli ölç."),
    },
    strongFlow: {
      title: fixed("Filtre akışı güçlü olabilir"),
      message: (p, f) => `Tahmini ${f.cycles(num(p, "turnover"))} çevrim/saat. Düşük akıntı seven türler için çıkışı dağıtmayı düşün.`,
    },
    filterTooSmallManufacturer: {
      title: fixed("Filtre bu akvaryum için küçük"),
      message: (p, f) => `Akvaryumun net hacmi (${f.volume(num(p, "volume"), num(p, "liters"))}), ${manufacturerCapacity(p, f)} %50'den fazla üstünde. Akvaryuma uygun bir filtre ekleyin.`,
    },
    filterOverManufacturer: {
      title: fixed("Filtre üretici önerisinin üstünde"),
      message: (p, f) => `Akvaryumun net hacmi (${f.volume(num(p, "volume"), num(p, "liters"))}), ${manufacturerCapacity(p, f)} üstünde. Filtre bakımını sık yapın; canlı eklemeden önce daha büyük bir filtre düşünün.`,
    },
    filterFlowInsufficient: {
      title: fixed("Filtre debisi yetersiz"),
      message: (p, f) =>
        `Üretici hacim önerisi olmadığı için etiket debisine bakıldı: akvaryumun suyu saatte yaklaşık ${f.cycles(num(p, "turnover"))} kez dolaşıyor. Hortum ve filtre malzemesiyle gerçek debi bunun yaklaşık yarısına iner; akvaryuma uygun bir filtre ekleyin.`,
    },
    filterFlowLow: {
      title: fixed("Filtre debisi düşük olabilir"),
      message: (p, f) =>
        `Üretici hacim önerisi olmadığı için etiket debisine bakıldı: akvaryumun suyu saatte yaklaşık ${f.cycles(num(p, "turnover"))} kez dolaşıyor, önerilen en az ${f.cycles(num(p, "min"))}. Filtre kirlendikçe gerçek debi daha da düşer.`,
    },
    filterTooSmallMixed: {
      title: fixed("Filtre bu akvaryum için küçük"),
      message: (p, f) =>
        `Akvaryumun net hacmi (${f.volume(num(p, "volume"), num(p, "liters"))}), filtrelerin üretici önerisi ve etiket debisine göre karşılayabildiği en büyük hacmin (${f.volume(num(p, "liters"), num(p, "volume"))}) üstünde. Akvaryuma uygun bir filtre ekleyin.`,
    },
    filterCapacityLow: {
      title: fixed("Filtre kapasitesi düşük olabilir"),
      message: (p, f) =>
        `Akvaryumun net hacmi (${f.volume(num(p, "volume"), num(p, "liters"))}), filtrelerin üretici önerisi ve etiket debisine göre uygun olduğu hacmin (${f.volume(num(p, "liters"), num(p, "volume"))}) üstünde. Filtre bakımını sık yapın; canlı eklemeden önce daha güçlü bir filtre düşünün.`,
    },
    heaterTooSmall: {
      title: fixed("Isıtıcı gücü yetersiz olabilir"),
      message: fixed("Seçilen ısıtıcının üretici hacim aralığı veya watt kapasitesi bu akvaryum için düşük kalıyor."),
    },
    heaterTooLarge: {
      title: fixed("Isıtıcı akvaryuma göre güçlü olabilir"),
      message: fixed("Yüksek güçlü ısıtıcı küçük hacimde sıcaklığı hızlı değiştirebilir. Güvenilir termostat ve doğru konumlandırma önemlidir."),
    },
    heaterMismatch: {
      title: fixed("Isıtıcı hacimle eşleşmiyor"),
      message: fixed("Seçilen ısıtıcının katalog hacim aralığı bu akvaryumu kapsamıyor."),
    },
    habitatMismatch: {
      title: (p) => `${str(p, "name")}: akvaryum türü uyumsuz`,
      message: (p) =>
        `${str(p, "name")}, ${aquariumTypeName(str(p, "aquariumType"))} akvaryumunda güvenli kabul edilmez. Canlı profilinin desteklediği su türüne uygun ayrı bir akvaryum seçin.`,
    },
    salinityReadingNeeded: {
      title: fixed("Özgül ağırlık ölçümü gerekli"),
      message: fixed("Deniz canlılarının tuzluluk uyumu değerlendirilemedi. Refraktometre veya hidrometre ile özgül ağırlık ölçümü ekleyin."),
    },
    salinityOutOfRange: {
      title: fixed("Özgül ağırlık canlı aralığı dışında"),
      message: (p, f) => `${f.number(num(p, "count"))} canlı için son özgül ağırlık ölçümü güvenli katalog aralığının dışında.`,
    },
    marineSpecificGravity: {
      title: fixed("Özgül ağırlık hedefin dışında"),
      message: (p, f) => `OATA'nın ${marineTarget(p)} hedefi ${marineRange(p, f)}; son ölçüm ${f.measurement(num(p, "value"), 3)}.`,
    },
    marineSpecificGravityDanger: {
      title: fixed("Özgül ağırlık güvenli aralığın dışında"),
      message: (p, f) =>
        `Son ölçüm ${f.measurement(num(p, "value"), 3)}. OATA'nın hiçbir ev akvaryumu hedefi bu değeri kapsamıyor (${f.measurement(MARINE_SPECIFIC_GRAVITY_SAFE_MIN, 3)}–${f.measurement(MARINE_SPECIFIC_GRAVITY_SAFE_MAX, 3)}). Tuzluluğu yavaşça hedefe getirin.`,
    },
    marinePh: {
      title: fixed("pH hedefin dışında"),
      message: (p, f) => `OATA'nın ${marineTarget(p)} hedefi pH ${marineRange(p, f)}; son ölçüm ${f.measurement(num(p, "value"), 2)}.`,
    },
    marineKh: {
      title: fixed("KH hedefin dışında"),
      message: (p, f) => `OATA'nın ${marineTarget(p)} hedefi KH ${marineRange(p, f)} dKH; son ölçüm ${f.measurement(num(p, "value"), 2)} dKH.`,
    },
    marineNitrate: {
      title: fixed("Nitrat hedefin üstünde"),
      message: (p, f) => `OATA'nın ${marineTarget(p)} hedefi nitrat en çok ${f.measurement(num(p, "max"), 3)} mg/L; son ölçüm ${f.measurement(num(p, "value"), 2)} mg/L.`,
    },
    invalidReading: {
      title: fixed("Geçersiz su ölçümü"),
      message: (p) => {
        const names = list(p, "fields").map(waterFieldName);
        return names.length > 1
          ? `Son ölçümdeki ${nameList(names)} değerleri geçersiz (negatif ya da geçerli bir sayı değil); bu değerler değerlendirmeye alınmadı. Yeniden ölçüp kaydedin.`
          : `Son ölçümdeki ${names[0]} değeri geçersiz (negatif ya da geçerli bir sayı değil); bu değer değerlendirmeye alınmadı. Yeniden ölçüp kaydedin.`;
      },
    },
    ammoniaWorstCase: {
      title: fixed("Amonyak zehirli olabilir"),
      message: (p, f) =>
        `Toplam amonyak ${f.measurement(num(p, "total"), 3, num(p, "limit"))} ppm. pH veya sıcaklık ölçümü eksik ya da geçersiz olduğu için zehirli (serbest) kısmı hesaplanamadı; en kötü durumda güvenli üst sınır olan ${f.measurement(num(p, "limit"), 3, num(p, "total"))} ppm aşılıyor. pH ve sıcaklığı da ölçün, bu arada kısmi su değişimi yapın.`,
    },
    ammoniaToxic: {
      title: fixed("Zehirli amonyak sınırın üzerinde"),
      message: (p, f) =>
        `Ölçülen pH ve sıcaklıkta serbest (zehirli) amonyak yaklaşık ${f.measurement(num(p, "free"), 4, num(p, "limit"))} ppm; güvenli üst sınır ${f.measurement(num(p, "limit"), 3, num(p, "free"))} ppm. Hemen kısmi su değişimi yapın, beslemeyi azaltın ve filtreyi kontrol edin.`,
    },
    ammoniaDetected: {
      title: fixed("Amonyak ölçüldü"),
      message: (p, f) =>
        `Toplam amonyak ${f.measurement(num(p, "total"))} ppm. Olgun bir akvaryumda amonyak 0 olmalıdır; sıfırın üstündeki değerler yalnızca kısa süre tolere edilebilir. pH yükselirse zehirli kısmı hızla artar.`,
    },
    nitriteHigh: {
      title: fixed("Nitrit sınırın üzerinde"),
      message: (p, f) => `Nitrit ${f.measurement(num(p, "value"), 3, num(p, "limit"))} ppm; güvenli üst sınır ${f.measurement(num(p, "limit"), 3, num(p, "value"))} ppm. Hemen kısmi su değişimi yapın ve filtreyi kontrol edin.`,
    },
    nitriteDetected: {
      title: fixed("Nitrit ölçüldü"),
      message: (p, f) => `Nitrit ${f.measurement(num(p, "value"))} ppm. Nitrit 0 olmalıdır; sıfırın üstündeki değerler yalnızca kısa süre tolere edilebilir.`,
    },
    nitrateTooHighSaltwater: {
      title: fixed("Nitrat çok yüksek"),
      message: (p, f) =>
        `Nitrat ${f.measurement(num(p, "value"), 3, MARINE_NITRATE_LIMIT_PPM)} ppm; deniz akvaryumu için üst sınır ${f.measurement(MARINE_NITRATE_LIMIT_PPM, 3, num(p, "value"))} ppm. Su değişimini artırın.`,
    },
    nitrateTooHigh: {
      title: fixed("Nitrat çok yüksek"),
      message: (p, f) =>
        `Nitrat ${f.measurement(num(p, "value"), 3, TAP_WATER_NITRATE_LIMIT_PPM + NITRATE_ABOVE_TAP_LIMIT_PPM)} ppm. Musluk suyu yasal olarak en fazla ${f.measurement(TAP_WATER_NITRATE_LIMIT_PPM)} ppm nitrat içerebildiği için önerilen sınır (musluk suyunun en fazla ${f.measurement(NITRATE_ABOVE_TAP_LIMIT_PPM)} ppm üstü) aşılmış. Su değişimini artırın.`,
    },
    nitrateHigh: {
      title: fixed("Nitrat yüksek olabilir"),
      message: (p, f) =>
        `Nitrat ${f.measurement(num(p, "value"), 3, NITRATE_ABOVE_TAP_LIMIT_PPM)} ppm. Önerilen sınır musluk suyunun en fazla ${f.measurement(NITRATE_ABOVE_TAP_LIMIT_PPM)} ppm üstüdür; musluk suyunun nitratını da ölçün ve su değişimini artırın.`,
    },
    temperatureConflict: {
      title: fixed("Türlerin sıcaklık ihtiyaçları uyuşmuyor"),
      message: fixed("Seçilen canlılar için ortak ve güvenli bir sıcaklık aralığı bulunamadı."),
    },
    phConflict: {
      title: fixed("Türlerin pH ihtiyaçları uyuşmuyor"),
      message: fixed("Seçilen canlılar için ortak ve güvenli bir pH aralığı bulunamadı."),
    },
    flowConflict: {
      title: fixed("Akıntı ihtiyaçları farklı"),
      message: fixed("Düşük ve yüksek akıntı isteyen türler birlikte seçildi. Akvaryumda sakin ve güçlü akış bölgeleri oluşturulmalı."),
    },
    predation: {
      title: (p) => `${str(p, "prey")} için avlanma riski`,
      message: (p) => `${str(p, "predator")}, yetişkin boy farkı nedeniyle ${str(p, "prey")} için güvenli bir tank arkadaşı olmayabilir.`,
    },
    speciesOnly: {
      title: (p) => `${str(p, "name")} için tür akvaryumu önerilir`,
      message: fixed("Bu tür agresiflik ve özel beslenme davranışları nedeniyle başka canlılarla birlikte güvenli kabul edilmedi."),
    },
    communityCaution: {
      title: (p) => `${str(p, "name")}: tank arkadaşı seçimine dikkat`,
      message: (p) => str(p, "text"),
    },
    smallFishPredation: {
      title: (p) => `${str(p, "prey")}: avlanabilir`,
      message: (p) => `${str(p, "hunter")} ağzına sığan küçük balıkları yiyebilir; ${str(p, "prey")} yetişkin boyuyla bu risk içinde.${sourceNote(p)}`,
    },
    finNip: {
      title: (p) => `${str(p, "target")}: yüzgeç ısırma riski`,
      message: (p) =>
        `${str(p, "nipper")} yüzgeç ısırabilir; ${str(p, "target")} gibi uzun ya da yavaş yüzgeçli balıklarla birlikte tutulması önerilmez.${sourceNote(p)}`,
    },
    conspecificMales: {
      title: (p) => `${str(p, "name")}: erkekler kavga eder`,
      message: (p, f) =>
        `Kaynağa göre bu türün erkekleri birbiriyle kavga eder; kayıtlı ${f.number(num(p, "count"))} bireyden birden fazlası erkekse ayırın.${sourceNote(p)}`,
    },
    conspecificAll: {
      title: (p) => `${str(p, "name")}: tek tutulmalı`,
      message: (p) => `Kaynağa göre bu tür kendi türünden bireylere karşı saldırgandır ve genellikle tek tutulmalıdır.${sourceNote(p)}`,
    },
    shrimpEaten: {
      title: fixed("Karidesler yenebilir"),
      message: (p) =>
        `Kaynaklara göre ${nameList(list(p, "eaters"))} karides yer; ${nameList(list(p, "shrimp"))} ve özellikle yavruları risk altındadır. Kaynak: ${list(p, "sources").join(", ")}.`,
    },
    snailEaten: {
      title: fixed("Salyangozlar yenebilir"),
      message: (p) => {
        const conditions = list(p, "noteConditions");
        const notes = list(p, "noteNames").map((name, index) => ` ${name}: ${sentence(conditions[index])}`).join("");
        return `Kaynaklara göre ${nameList(list(p, "eaters"))} salyangoz yer; ${nameList(list(p, "snails"))} risk altında olabilir.${notes} Kaynak: ${list(p, "sources").join(", ")}.`;
      },
    },
    shrimpUnverified: {
      title: fixed("Karides uyumu doğrulanmadı"),
      message: (p) =>
        `${nameList(list(p, "fish"))} için "karidesle güvenli" bilgisi kaynaklarda bulunamadı. OATA, karideslerin ağzına sığabilecekleri balıklarla tutulmamasını önerir; ${nameList(list(p, "shrimp"))} yavruları ve yeni kabuk değiştirmiş karidesler özellikle risk altındadır.`,
    },
    husbandryCaution: {
      title: (p) => `${str(p, "name")}: özel bakım gereksinimi`,
      message: (p) => str(p, "text"),
    },
    tankLengthNote: {
      title: (p) => `${str(p, "name")}: tank uzunluğu verisi sınırlı`,
      message: (p) => str(p, "text"),
    },
    groupLow: {
      title: (p) => `${str(p, "name")}: grup sayısı düşük`,
      message: (p, f) => `Kayıtlı adet ${f.number(num(p, "count"))}; katalog önerisi en az ${f.number(num(p, "min"))}.`,
    },
    spaceLimited: {
      title: (p) => `${str(p, "name")}: alan sınırda`,
      message: spaceReference,
    },
    spaceSevere: {
      title: (p) => `${str(p, "name")}: akvaryum çok küçük`,
      message: (p, f) =>
        `${spaceReference(p, f)} Akvaryum ayrıca İsviçre Hayvan Koruma Yönetmeliği'nin ölçü kuralından (uzunluk 3×, genişlik 2×, su derinliği 1× vücut boyu) uyarlanan AquaMind sınırının altında. Yönetmelik kuyruk yüzgeci hariç boyu kullanır; AquaMind daha sıkı davranıp katalogdaki ${f.length(num(p, "size"))} yetişkin boyu (çoğu türde toplam boy) kullanır: uzunluk en az ${f.length(num(p, "minLength"))}, genişlik en az ${f.length(num(p, "minWidth"))}, su derinliği en az ${f.length(num(p, "minDepth"))}.`,
    },
  } satisfies Record<string, { title: Text; message: Text }>,
};

/** Motor metinlerinin biçimi; başka bir dilin motor metinleri bu tipi karşılamalıdır. */
export type EngineMessages = typeof trEngine;
