// Hastalık ve tedavi sayfasının metinleri (docs/DECISIONS/0022-hastalik-ve-tedavi-sayfasi.md). Paketin ayrı giriş noktasından gelir
// (`@aquamind/localization/diseases`): ana giriş bu dosyayı içe aktarmadığı için metinler yalnız bu sayfanın paketine girer.
// Başka bir dilin dosyası bu nesneyle aynı biçimde olmalıdır (`DiseaseMessages`).
export const trDiseases = {
  eyebrow: "Güvenilir kaynaklar",
  description: "Belirti gördüğünde ilk adımlar, ilaçtan önce bilmen gerekenler ve veteriner bulma yolları.",
  notice: "AquaMind hastalık teşhisi koymaz ve ilaç önermez. Bu sayfa seni güvenilir kaynaklara ve veterinere yönlendirir.",
  firstStepsTitle: "Belirti gördüysen ilk adımlar",
  steps: {
    water: "Suyu hemen ölç: balığın görünüşü ya da davranışı değiştiğinde, yem yemesi azaldığında bile amonyak hemen ölçülmeli. Sağlıklı bir akvaryumda amonyak her zaman sıfırdır.",
    signs: "Hastalık belirtileri arasında yüzgeçleri kapalı tutma, çakıla ya da dekora sürtünme, titreme, beyaz benek ya da pamuksu oluşum var. Belirti göstermeyen balık da hastalık taşıyabilir.",
    quarantine: "Yeni aldığın canlıyı ve bitkiyi ana akvaryuma koymadan önce ayrı bir akvaryumda tut. Hasta canlı için veterinere ya da balık sağlığı uzmanına danış.",
  },
  addReading: "Su ölçümü ekle",
  copperTitle: "İlaç kullanmadan önce",
  copperGeneral: "Karides ve salyangozlar bakıra çok duyarlıdır; düşük düzeyde bile bakıra maruz kalırlarsa ölürler. Akvaryuma eklediğin her ilacın omurgasızlar için güvenli olduğundan emin ol. Bakır ve formalin içeren ilaçlar karidesler için öldürücüdür.",
  /** `name`: akvaryumun adı; `kinds`: akvaryumdaki omurgasızlar. */
  copperAquarium: (name: string, kinds: "shrimp" | "snail" | "both") => `${name} akvaryumunda ${kinds === "both" ? "karides ve salyangoz" : kinds === "shrimp" ? "karides" : "salyangoz"} var. Bu canlılar bakıra çok duyarlıdır ve düşük düzeyde bile ölürler; eklediğin ilacın omurgasızlar için güvenli olduğundan emin ol.`,
  vetTitle: "Veteriner bul",
  vetHelp: "Süs balığı tedavi eden bir veteriner bulmak için il veteriner hekimleri odasını arayıp balık bakan hekim sorabilirsin. Veteriner fakültelerinin su ürünleri hastalıkları bölümleri balık hastalıkları üzerine çalışır; süs balığına hizmet verip vermediklerini önce sor.",
  guidesTitle: "Güvenilir rehberler",
  sourceLabel: "Kaynak",
  /** Bağlantının dili; ekran okuyucu için tam adı. */
  language: { tr: "Türkçe", en: "İngilizce" },
  languageShort: { tr: "TR", en: "EN" },
  opensNewTab: "yeni sekmede açılır",
  sponsorNote: "Sponsorlu içerik olursa açıkça \"Sponsorlu\" diye işaretlenir ve önerileri etkilemez.",
  sources: {
    ufAmmonia: { name: "Akvaryum ve havuzda amonyak", publisher: "Florida Üniversitesi (UF/IFAS)" },
    oataDiseaseSigns: { name: "Lepistes ve moli bakım kartı: hastalık belirtileri", publisher: "OATA" },
    ufResponsibleOwnership: { name: "Sorumlu akvaryum sahipliği", publisher: "Florida Üniversitesi (UF/IFAS)" },
    oataInvertebrates: { name: "Tatlı su karides ve salyangoz bakım kartı", publisher: "OATA" },
    pfkShrimpMedication: { name: "Karidesler ve ilaçlar", publisher: "Practical Fishkeeping" },
    tvhbChambers: { name: "İl veteriner hekimleri odaları", publisher: "Türk Veteriner Hekimleri Birliği" },
    erciyesAquatic: { name: "Sucul Hayvan Hastalıkları Anabilim Dalı", publisher: "Erciyes Üniversitesi Veteriner Fakültesi" },
    fishVetSociety: { name: "Süs balığı tedavi eden veteriner listesi (İngiltere ve İrlanda)", publisher: "Fish Veterinary Society" },
    ufFishHealth: { name: "Balık sağlığı yönetimi", publisher: "Florida Üniversitesi (UF/IFAS)" },
    oataCareSheets: { name: "Türlere göre bakım kartları", publisher: "OATA" },
  },
};

export type DiseaseMessages = typeof trDiseases;
