// Gizlilik sayfasının metinleri (docs/DECISIONS/0027-yedekten-geri-yukleme.md → "Gizlilik sayfası"). Paketin ayrı giriş
// noktasından gelir (`@aquamind/localization/privacy`): ana giriş bu dosyayı içe aktarmadığı için metinler yalnız bu
// sayfanın paketine girer. Başka bir dilin dosyası bu nesneyle aynı biçimde olmalıdır (`PrivacyMessages`).
//
// TASLAK: ürün sahibi onaylamadan ve `pending` alanları doldurulmadan yayımlanmaz. Metin uygulamanın bugünkü
// davranışını anlatır; uygulama değişince (hesap, bulut eşitleme, sosyal özellikler) metin önceden güncellenir.
export const trPrivacy = {
  eyebrow: "Verilerin ve gizliliğin",
  title: "Gizlilik",
  /** Metnin son değiştiği gün (YYYY-AA-GG). */
  updatedAt: "2026-10-29",
  updated: (date: string) => `Son güncelleme: ${date}`,
  draftNotice: "Taslak: bu metin henüz onaylanmadı ve hukuki incelemeden geçmedi.",
  summaryTitle: "Kısaca",
  summary: [
    "AquaMind'a girdiğin her şey yalnızca bu cihazdaki tarayıcıda saklanır. Bize gönderilmez; bizim bir sunucumuzda kopyası yoktur.",
    "Hesap yok. Çerez, reklam, analiz ya da izleme aracı kullanmıyoruz.",
    "Siteyi Vercel adlı bir barındırma hizmeti sunar. Her web sitesinde olduğu gibi, sayfayı açtığında tarayıcın IP adresini ve tarayıcı bilgisini Vercel'in sunucularına gönderir.",
  ],
  sections: [
    {
      title: "Bu cihazda ne saklanıyor",
      paragraphs: [
        "Akvaryumların, su ölçümlerin, bakım kayıtların, canlıların, bitkilerin, ekipmanların ve ayarların tarayıcının yerel deposunda (localStorage) durur. Silinen bir akvaryum, geri alabilmen için 30 gün daha bu cihazda saklanır.",
        "Ayarlar sayfasındaki \"Ad soyad\" ve \"E-posta\" kutuları bugün hiçbir yere kaydedilmez.",
        "Bu veriler başka bir cihaza ya da tarayıcıya kendiliğinden geçmez. Tarayıcının site verilerini silersen ya da tarayıcı yer açmak için silerse veriler de silinir. Bunun için Ayarlar'dan düzenli yedek almanı öneririz.",
      ],
    },
    {
      title: "Yedek dosyası",
      paragraphs: [
        "\"Verileri dışa aktar\" düğmesi tüm kayıtlarını içeren bir JSON dosyası indirir. Dosya şifresizdir: onu açan herkes içindekileri okuyabilir. Güvendiğin bir yerde sakla ve kimseyle paylaşma.",
        "\"Yedekten geri yükle\" bu dosyayı yalnızca bu cihazdaki tarayıcıya yükler; dosya hiçbir yere gönderilmez.",
      ],
    },
    {
      title: "Siteyi sunan hizmet",
      paragraphs: [
        "AquaMind'ın sayfaları Vercel Inc. (Amerika Birleşik Devletleri) tarafından sunulur. Sayfayı açtığında tarayıcın, istediği sayfayla birlikte IP adresini ve tarayıcı bilgisini Vercel'in sunucularına gönderir. Vercel bu bilgileri hizmeti çalıştırmak ve güvenliğini sağlamak için işler.",
        "Akvaryum kayıtların bu isteklere eklenmez; tarayıcında kalır.",
      ],
      link: { label: "Vercel gizlilik politikası", url: "https://vercel.com/legal/privacy-policy" },
    },
    {
      title: "Başka sitelere bağlantılar",
      paragraphs: [
        "Katalogdaki kaynak, mağaza ve rehber bağlantılarına tıklarsan o site yeni sekmede açılır. O sitenin kendi gizlilik kuralları geçerlidir.",
      ],
    },
    {
      title: "Verilerini silmek",
      paragraphs: [
        "Ayarlar → \"Tüm verileri sıfırla\" bu cihazdaki tüm AquaMind kayıtlarını siler. Tarayıcının site verilerini silmek de aynı sonucu verir. İndirdiğin yedek dosyaları senin cihazındadır; onları sen silersin.",
      ],
    },
    {
      title: "Hakların ve bize ulaşmak",
      paragraphs: [
        "6698 sayılı Kişisel Verilerin Korunması Kanunu'nun 11. maddesindeki haklarını kullanmak ya da bu metinle ilgili soru sormak için bize yazabilirsin.",
      ],
      pending: "Veri sorumlusunun adı ve iletişim adresi henüz belirlenmedi; yayından önce buraya eklenecek.",
    },
    {
      title: "Bu metin değişirse",
      paragraphs: [
        "Hesap, bulut eşitleme ya da sosyal özellikler eklenirse hangi verinin nereye gittiği değişir. Bu metin o özellikler gelmeden önce güncellenir ve değişiklik bu sayfada tarihiyle gösterilir.",
      ],
    },
  ],
  opensNewTab: "yeni sekmede açılır",
  backToSettings: "Ayarlara dön",
};

export type PrivacyMessages = typeof trPrivacy;
