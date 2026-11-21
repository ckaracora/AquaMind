// Herkese açık tür sayfalarının metinleri (docs/DECISIONS/0047-herkese-acik-tur-sayfalari.md). Paketin ayrı giriş noktasından gelir
// (`@aquamind/localization/public-pages`); yalnız sunucuda, derleme anında okunur, tarayıcı paketine girmez. Tür kartının etiketleri
// (`t.livestock.card`) ayrıca arayüz metinlerinden alınır; burada yalnız bu sayfalara özgü metinler durur. Başka bir dilin dosyası bu
// nesneyle aynı biçimde olmalıdır (`PublicPageMessages`).

/** Açıklama cümlesinin parçaları; sayılar sayfanın biçimleyicisiyle yazılmış gelir. `group` 1 ise verilmez. */
export interface SpeciesDescriptionParts { name: string; scientificName: string; volume: string; temperature: string; ph?: string; group?: string }

export const trPublicPages = {
  /** Tür dizini (`/tr/tur`). */
  indexTitle: "Tatlı su canlıları rehberi",
  indexDescription: "Yaygın tatlı su balıkları, karidesleri ve salyangozları için kaynaklı bakım bilgisi: en az akvaryum hacmi, grup, sıcaklık ve pH.",
  indexIntro: "Her sayfadaki değerler katalogdan gelir; kaynakları sayfanın altında yazar.",
  speciesCount: (count: number) => `${count} tür`,
  /** Tür sayfası. Başlığın sonuna uygulama adı yerleşimden eklenir. */
  speciesTitle: (name: string) => `${name} bakımı: akvaryum hacmi, sıcaklık ve pH`,
  speciesDescription: ({ name, scientificName, volume, temperature, ph, group }: SpeciesDescriptionParts) =>
    `${name} (${scientificName}): en az ${volume} akvaryum${group ? `, en az ${group} birey` : ""}, ${temperature}${ph ? `, pH ${ph}` : ""}. Kaynaklı davranış ve bakım bilgisi.`,
  eyebrow: "Tür rehberi",
  allSpecies: "Bütün türler",
  languages: "Dil",
  catalogNote: "Kaynağın yazmadığı değer gösterilmez.",
  tryTitle: "Kendi akvaryumunda dene",
  tryText: "Bu türü akvaryumuna ekle; uygulama hacmi, öbür canlıları, ekipmanı ve suyu birlikte değerlendirir.",
  tryButton: "Kendi akvaryumunda dene",
  sourcesIntro: "Bilgiler şu kaynaklardan derlendi:",
  disclaimer: "Hobi rehberliğidir; veteriner tavsiyesi değildir.",
  openApp: "Uygulamayı aç",
};

export type PublicPageMessages = typeof trPublicPages;
