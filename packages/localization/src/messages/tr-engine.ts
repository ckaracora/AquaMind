// Sağlık analizi motorunun uyarı ve ölçüt metinleri (karar 0021, 3. paket). Motor her uyarı için `code` ve `params`, her ölçüt
// için `detailCode` ve `detailParams` üretir; ekran metni burada kurulur. Türkçe metinler motorun kendi Türkçe alanlarıyla birebir
// aynıdır (eşitlik testi: src/lib/__tests__/engine-text.test.ts). Sayı biçimleri de bilerek motorunkiyle aynı tutulur; dile ve
// birim tercihine göre biçimleme sonraki pakette. Bu metinler yalnız sağlık sayfasında gerektiği için arayüz metinlerinden (`Messages`)
// ayrı tutulur ve paketin ayrı girişinden (`@aquamind/localization/engine`, `engineMessagesFor`) alınır; öteki sayfaların paketine girmez.

/** Motor değişkenlerinin değer türleri (motorun `EngineParams` türüyle aynı biçim). */
export type EngineTextParams = Record<string, string | number | boolean | string[]>;
type Text = (p: EngineTextParams) => string;

const num = (p: EngineTextParams, key: string) => p[key] as number;
const str = (p: EngineTextParams, key: string) => p[key] as string;
const list = (p: EngineTextParams, key: string) => p[key] as string[];
const flag = (p: EngineTextParams, key: string) => p[key] as boolean;
/** Motorun su ölçümü biçimi: en fazla `digits` ondalık, ondalık ayırıcı virgül. */
const waterValue = (value: number, digits = 3) => String(Number(value.toFixed(digits))).replace(".", ",");
/** Motorun etiket debisi çevrim biçimi: bir ondalık, virgül. */
const cyclesValue = (value: number) => value.toFixed(1).replace(".", ",");
const cm = (value: number) => `${Math.round(value * 10) / 10} cm`;
const nameList = (names: string[]) => (names.length > 1 ? `${names.slice(0, -1).join(", ")} ve ${names[names.length - 1]}` : names[0]);
const sentence = (text: string) => text.replace(/\.?$/, ".");
const sourceNote = (p: EngineTextParams) =>
  (str(p, "condition") ? ` Kaynağın notu: ${sentence(str(p, "condition"))}` : "") + ` Kaynak: ${str(p, "source")}.`;
const aquariumTypeName = (type: string) => (type === "freshwater" ? "tatlı su" : type === "saltwater" ? "tuzlu su" : "acı su");
const waterFieldName = (field: string) => ({ ammonia: "amonyak", nitrite: "nitrit", nitrate: "nitrat" } as Record<string, string>)[field] ?? field;
const manufacturerCapacity = (p: EngineTextParams) =>
  flag(p, "multiple")
    ? `filtrelerin üreticilerince önerilen toplam hacmin (${num(p, "liters")} L)`
    : `filtrenin üreticisinin önerdiği en büyük hacmin (${num(p, "liters")} L)`;
const spaceReference = (p: EngineTextParams) =>
  flag(p, "hasLength")
    ? `Kayıtlı adet için minimum ${num(p, "volume")} L ve ${num(p, "length")} cm uzunluk referansı kullanıldı.`
    : `Kayıtlı adet için minimum ${num(p, "volume")} L referansı kullanıldı; kaynak tank uzunluğu yayımlamıyor.`;
const fixed = (text: string): Text => () => text;

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
    loadRatio: (p) => `Tahmini yük oranı %${num(p, "percent")}`,
    spaceSevere: (p) => `${num(p, "count")} tür için akvaryum çok küçük`,
    spaceLimited: (p) => `${num(p, "count")} tür için alan sınırda`,
    spaceOk: fixed("Kayıtlı türler için uygun"),
    groupLow: (p) => `${num(p, "count")} türün grup sayısı düşük`,
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
    manufacturerMax: (p) => `Üretici önerisi en fazla ${num(p, "liters")} L`,
    ratedTurnover: (p) => `Etiket debisiyle ${cyclesValue(num(p, "turnover"))} çevrim/saat`,
    mixedMax: (p) => `Üretici önerisi ve etiket debisine göre en fazla ${num(p, "liters")} L`,
    airReady: fixed("Hava motorlu sünger filtre bağlantısı hazır"),
    airMissing: fixed("Sünger filtre için hava motoru gerekli"),
    flowUnverified: fixed("Debi bilgisi doğrulanmayı bekliyor"),
    auxiliaryOnly: fixed("Yalnız yardımcı yüzey skimmeri kayıtlı; ana filtre gerekli"),
    noFilter: fixed("Katalogdan filtre bulunamadı"),
    estimatedOk: (p) => `Toplam ${num(p, "watts")} W için tahmini hacim uygun`,
    manufacturerOk: fixed("Üretici hacim aralığı uygun"),
    powerLow: fixed("Isıtma gücü bu hacim için düşük"),
    powerHigh: fixed("Isıtma gücü bu hacim için yüksek"),
    outOfRange: fixed("Hacim aralığı dışında"),
    heaterUnverified: fixed("Watt veya hacim verisi doğrulanmayı bekliyor"),
    noHeater: fixed("Katalogdan ısıtıcı bulunamadı"),
    latestReading: fixed("Son ölçüme göre"),
    readingNeeded: fixed("Ölçüm eklenmesi gerekli"),
    recordsReady: (p) =>
      `${num(p, "ready")}/${num(p, "total")} güvenlik kaydı hesaplamaya hazır${num(p, "userValue") ? ` · ${num(p, "userValue")} kayıt senin girdiğin değerle` : ""}`,
    noRecords: fixed("Güvenlik hesabı için kayıt bulunamadı"),
  } satisfies Record<string, Text>,
  /** Uyarıların başlıkları ve metinleri, motorun `code` alanına göre. */
  warnings: {
    unmatchedAnimals: {
      title: fixed("Katalogla eşleşmeyen canlı kaydı var"),
      message: (p) => `${num(p, "count")} canlı kaydı tanınmadığı için biyolojik yük ve uyumluluk hesabına dahil edilmedi.`,
    },
    unmatchedEquipment: {
      title: fixed("Katalogla eşleşmeyen ekipman kaydı var"),
      message: (p) => `${num(p, "count")} ekipmanın kapasitesi tanınmadığı için filtrasyon veya ısıtıcı hesabına dahil edilmedi.`,
    },
    unverifiedAnimals: {
      title: fixed("Bazı canlı verileri doğrulanmayı bekliyor"),
      message: (p) => `${num(p, "count")} canlı kaydı güvenlik hesabına dahil edilmedi; doğrulanmış katalog kaydı seçilmeli.`,
    },
    unverifiedEquipment: {
      title: fixed("Bazı ekipman verileri doğrulanmayı bekliyor"),
      message: (p) => `${num(p, "count")} ekipman kaydının teknik değerleri otomatik kapasite hesabında kullanılmadı.`,
    },
    missingCapacity: {
      title: fixed("Ekipman kapasite bilgisi eksik"),
      message: (p) =>
        `${list(p, "names").join(", ")}${num(p, "remaining") ? ` ve ${num(p, "remaining")} ekipman daha` : ""} güvenli kapasite hesabına alınamadı.${str(p, "note") ? ` ${str(p, "note")}` : " Gerekli debi, hacim veya hava motoru bağlantısı doğrulanmalı."}`,
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
      message: (p) => `Tahmini ${num(p, "turnover").toFixed(1)} çevrim/saat. Düşük akıntı seven türler için çıkışı dağıtmayı düşün.`,
    },
    filterTooSmallManufacturer: {
      title: fixed("Filtre bu akvaryum için küçük"),
      message: (p) => `Akvaryumun net hacmi (${num(p, "volume")} L), ${manufacturerCapacity(p)} %50'den fazla üstünde. Akvaryuma uygun bir filtre ekleyin.`,
    },
    filterOverManufacturer: {
      title: fixed("Filtre üretici önerisinin üstünde"),
      message: (p) => `Akvaryumun net hacmi (${num(p, "volume")} L), ${manufacturerCapacity(p)} üstünde. Filtre bakımını sık yapın; canlı eklemeden önce daha büyük bir filtre düşünün.`,
    },
    filterFlowInsufficient: {
      title: fixed("Filtre debisi yetersiz"),
      message: (p) =>
        `Üretici hacim önerisi olmadığı için etiket debisine bakıldı: akvaryumun suyu saatte yaklaşık ${cyclesValue(num(p, "turnover"))} kez dolaşıyor. Hortum ve filtre malzemesiyle gerçek debi bunun yaklaşık yarısına iner; akvaryuma uygun bir filtre ekleyin.`,
    },
    filterFlowLow: {
      title: fixed("Filtre debisi düşük olabilir"),
      message: (p) =>
        `Üretici hacim önerisi olmadığı için etiket debisine bakıldı: akvaryumun suyu saatte yaklaşık ${cyclesValue(num(p, "turnover"))} kez dolaşıyor, önerilen en az ${num(p, "min")}. Filtre kirlendikçe gerçek debi daha da düşer.`,
    },
    filterTooSmallMixed: {
      title: fixed("Filtre bu akvaryum için küçük"),
      message: (p) =>
        `Akvaryumun net hacmi (${num(p, "volume")} L), filtrelerin üretici önerisi ve etiket debisine göre karşılayabildiği en büyük hacmin (${num(p, "liters")} L) üstünde. Akvaryuma uygun bir filtre ekleyin.`,
    },
    filterCapacityLow: {
      title: fixed("Filtre kapasitesi düşük olabilir"),
      message: (p) =>
        `Akvaryumun net hacmi (${num(p, "volume")} L), filtrelerin üretici önerisi ve etiket debisine göre uygun olduğu hacmin (${num(p, "liters")} L) üstünde. Filtre bakımını sık yapın; canlı eklemeden önce daha güçlü bir filtre düşünün.`,
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
      message: (p) => `${num(p, "count")} canlı için son özgül ağırlık ölçümü güvenli katalog aralığının dışında.`,
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
      message: (p) =>
        `Toplam amonyak ${waterValue(num(p, "total"))} ppm. pH veya sıcaklık ölçümü eksik ya da geçersiz olduğu için zehirli (serbest) kısmı hesaplanamadı; en kötü durumda güvenli üst sınır olan ${waterValue(num(p, "limit"))} ppm aşılıyor. pH ve sıcaklığı da ölçün, bu arada kısmi su değişimi yapın.`,
    },
    ammoniaToxic: {
      title: fixed("Zehirli amonyak sınırın üzerinde"),
      message: (p) =>
        `Ölçülen pH ve sıcaklıkta serbest (zehirli) amonyak yaklaşık ${waterValue(num(p, "free"), 4)} ppm; güvenli üst sınır ${waterValue(num(p, "limit"))} ppm. Hemen kısmi su değişimi yapın, beslemeyi azaltın ve filtreyi kontrol edin.`,
    },
    ammoniaDetected: {
      title: fixed("Amonyak ölçüldü"),
      message: (p) =>
        `Toplam amonyak ${waterValue(num(p, "total"))} ppm. Olgun bir akvaryumda amonyak 0 olmalıdır; sıfırın üstündeki değerler yalnızca kısa süre tolere edilebilir. pH yükselirse zehirli kısmı hızla artar.`,
    },
    nitriteHigh: {
      title: fixed("Nitrit sınırın üzerinde"),
      message: (p) => `Nitrit ${waterValue(num(p, "value"))} ppm; güvenli üst sınır ${waterValue(num(p, "limit"))} ppm. Hemen kısmi su değişimi yapın ve filtreyi kontrol edin.`,
    },
    nitriteDetected: {
      title: fixed("Nitrit ölçüldü"),
      message: (p) => `Nitrit ${waterValue(num(p, "value"))} ppm. Nitrit 0 olmalıdır; sıfırın üstündeki değerler yalnızca kısa süre tolere edilebilir.`,
    },
    nitrateTooHighSaltwater: {
      title: fixed("Nitrat çok yüksek"),
      message: (p) => `Nitrat ${waterValue(num(p, "value"))} ppm; deniz akvaryumu için üst sınır 100 ppm. Su değişimini artırın.`,
    },
    nitrateTooHigh: {
      title: fixed("Nitrat çok yüksek"),
      message: (p) =>
        `Nitrat ${waterValue(num(p, "value"))} ppm. Musluk suyu yasal olarak en fazla 50 ppm nitrat içerebildiği için önerilen sınır (musluk suyunun en fazla 50 ppm üstü) aşılmış. Su değişimini artırın.`,
    },
    nitrateHigh: {
      title: fixed("Nitrat yüksek olabilir"),
      message: (p) =>
        `Nitrat ${waterValue(num(p, "value"))} ppm. Önerilen sınır musluk suyunun en fazla 50 ppm üstüdür; musluk suyunun nitratını da ölçün ve su değişimini artırın.`,
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
      message: (p) =>
        `Kaynağa göre bu türün erkekleri birbiriyle kavga eder; kayıtlı ${num(p, "count")} bireyden birden fazlası erkekse ayırın.${sourceNote(p)}`,
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
      message: (p) => `Kayıtlı adet ${num(p, "count")}; katalog önerisi en az ${num(p, "min")}.`,
    },
    spaceLimited: {
      title: (p) => `${str(p, "name")}: alan sınırda`,
      message: spaceReference,
    },
    spaceSevere: {
      title: (p) => `${str(p, "name")}: akvaryum çok küçük`,
      message: (p) =>
        `${spaceReference(p)} Akvaryum ayrıca İsviçre Hayvan Koruma Yönetmeliği'nin ölçü kuralından (uzunluk 3×, genişlik 2×, su derinliği 1× vücut boyu) uyarlanan AquaMind sınırının altında. Yönetmelik kuyruk yüzgeci hariç boyu kullanır; AquaMind daha sıkı davranıp katalogdaki ${cm(num(p, "size"))} yetişkin boyu (çoğu türde toplam boy) kullanır: uzunluk en az ${cm(num(p, "minLength"))}, genişlik en az ${cm(num(p, "minWidth"))}, su derinliği en az ${cm(num(p, "minDepth"))}.`,
    },
  } satisfies Record<string, { title: Text; message: Text }>,
};

/** Motor metinlerinin biçimi; başka bir dilin motor metinleri bu tipi karşılamalıdır. */
export type EngineMessages = typeof trEngine;
