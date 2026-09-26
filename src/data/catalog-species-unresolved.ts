import type { AquariumType, Livestock } from "@/types/aquarium";

export interface UnresolvedSpeciesListing {
  name: string;
  aliases?: string[];
  category: Livestock["category"];
  group: "livebearer" | "tetra" | "rasbora" | "danio" | "barb" | "rainbowfish" | "killifish" | "cichlid" | "labyrinth" | "bottom" | "goby" | "puffer" | "monster" | "coldwater" | "shrimp" | "snail" | "crayfish" | "other";
  waterTypes: AquariumType[];
  reason: string;
  sourceUrl: string;
  additionalSourceUrls: string[];
  verifiedAt: string;
}

const unresolvedRetailFish = (
  name: string,
  aliases: string[],
  group: UnresolvedSpeciesListing["group"],
  waterTypes: AquariumType[],
  sourceUrl: string,
  ambiguity: string,
  additionalSourceUrls: string[],
): UnresolvedSpeciesListing => ({
  name,
  aliases,
  category: "fish",
  group,
  waterTypes,
  reason: `Satış sayfası bilimsel tür, köken veya erişkin bakım eşiği yayımlamıyor ve görsellerin temsili olduğunu belirtiyor. ${ambiguity} Bu nedenle yalnız ticari ada ya da fotoğrafa bakılarak güvenli bir tür ve akvaryum profili seçilemez.`,
  sourceUrl,
  additionalSourceUrls,
  verifiedAt: "2026-09-03",
});

const cikletistTetraMainUnresolved: UnresolvedSpeciesListing[] = [
  unresolvedRetailFish("BLUE KİNG TETRA", ["Blue King Tetra", "Blue Tetra"], "tetra", ["freshwater"], "https://www.cikletistpetshop.com/blue-king-tetra-353", "Blue King ve Blue Tetra adları ticarette Inpaichthys kerri, gerçek Boehlkea fredcochui ve uzun süre yanlışlıkla B. fredcochui adıyla satılan Knodus borki için kullanılabiliyor. Bilimsel kimlik verilmeden bu üç ayrı bakım profilinden biri seçilemez.", ["https://www.fishbase.se/summary/Inpaichthys-kerri.html", "https://www.fishbase.se/summary/Boehlkea-fredcochui.html", "https://www.fishbase.se/summary/Knodus_borki.html", "https://www.seriouslyfish.com/species/knodus-borki/"]),
  unresolvedRetailFish("KIRMIZI KALEM TETRA BALIKLARI", ["Kırmızı Kalem Tetra", "Red Pencilfish"], "tetra", ["freshwater"], "https://www.cikletistpetshop.com/kirmizi-kalem-tetra-baliklari-361", "Kırmızı kalem ve Red Pencilfish adları birden fazla Nannostomus türüne uygulanabiliyor. N. mortenthaleri ile N. rubrocaudatus için ayrı güvenli profiller hazırdır ancak satılan örnek bilimsel olarak ayırt edilmeden bunlardan biri seçilemez.", ["https://www.fishbase.se/ComNames/CommonNameSearchList.php?CommonName=Red+pencilfish&crit1_operator=CONTAINS&resultPage=1&sortby=nametype&sp=y", "https://www.seriouslyfish.com/species/nannostomus-mortenthaleri/", "https://www.seriouslyfish.com/species/nannostomus-rubrocaudatus/"]),
  unresolvedRetailFish("BUZ BALIĞI", ["Buz Balığı", "Icefish"], "other", ["freshwater", "brackish", "saltwater"], "https://www.cikletistpetshop.com/buz-baligi-369", "Buz balığı ve Icefish ortak adları tatlı su, acı su ve denizde yaşayan birbiriyle ilgisiz çok sayıda taksonu kapsıyor. Parambassis ranga için ayrı güvenli Hint cam balığı profili hazırdır; ancak satış sayfası bilimsel kimlik vermediğinden genel ad bu profile bağlanamaz.", ["https://www.fishbase.se/ComNames/CommonNameSearchList.php?CommonName=Icefish&crit1_operator=CONTAINS&resultPage=1&sortby=nametype&sp=y", "https://www.seriouslyfish.com/species/parambassis-ranga", "https://www.fishbase.se/summary/Parambassis_ranga.html"]),
  unresolvedRetailFish("Siyah Simpson Tetra", ["Black Simpson Tetra", "Simpson Tetra"], "tetra", ["freshwater"], "https://www.cikletistpetshop.com/siyah-simpson-tetra-1935", "Simpson Tetra yerleşik bilimsel bir ortak ad değildir ve doğrudan örneğin hangi tetra türü olduğu belirtilmiyor.", ["https://www.fishbase.se/ComNames/CommonNameSearchList.php?CommonName=Simpson+tetra&crit1_operator=CONTAINS&resultPage=1&sortby=nametype&sp=y"]),
  unresolvedRetailFish("Gül Tetra", ["Rose Tetra"], "tetra", ["freshwater"], "https://www.cikletistpetshop.com/gul-tetra-1939", "Gül ve Rose tetra adları rosy ve bentosi/ornate grubu dahil birbirine benzeyen farklı Hyphessobrycon türleri için kullanılabiliyor. H. rosaceus ile H. bentosi için ayrı güvenli profiller hazırdır ancak satılan örnek bilimsel olarak ayırt edilmeden bunlardan biri seçilemez.", ["https://www.fishbase.se/ComNames/CommonNameSearchList.php?CommonName=Rose+tetra&crit1_operator=CONTAINS&resultPage=1&sortby=nametype&sp=y", "https://www.seriouslyfish.com/species/hyphessobrycon-rosaceus", "https://www.seriouslyfish.com/species/hyphessobrycon-bentosi"]),
  unresolvedRetailFish("Kiraz Tetra", ["Cherry Tetra"], "tetra", ["freshwater"], "https://www.cikletistpetshop.com/kiraz-tetra-1943", "Cherry Tetra adı tek bir doğrulanmış taksona özgü değildir ve Kiraz Barb adıyla da kolayca karışabilir.", ["https://www.fishbase.se/ComNames/CommonNameSearchList.php?CommonName=Cherry+tetra&crit1_operator=CONTAINS&resultPage=1&sortby=nametype&sp=y"]),
  unresolvedRetailFish("Rasbora", ["Rasbora Balığı"], "rasbora", ["freshwater"], "https://www.cikletistpetshop.com/rasbora-1950", "Rasbora adı erişkin boyu, su kimyası ve sürü gereksinimi farklı çok sayıda cins ve türü kapsayan genel bir addır.", ["https://www.fishbase.se/identification/specieslist.php?famcode=122"]),
  unresolvedRetailFish("PLATİNİUM HALF BEAK CÜCE ZARGANA", ["Platinum Halfbeak", "Cüce Zargana"], "livebearer", ["freshwater", "brackish"], "https://www.cikletistpetshop.com/platinium-half-beak-cuce-zargana", "Halfbeak ve cüce zargana adları Dermogenys ve Nomorhamphus cinslerindeki farklı canlı doğuranlara uygulanabiliyor. Dermogenys pusilla ile Nomorhamphus liemi için ayrı güvenli profiller hazırdır ancak satış sayfası bilimsel kimlik vermediğinden bunlardan biri seçilemez.", ["https://www.fishbase.se/ComNames/CommonNameSearchList.php?CommonName=Halfbeak&crit1_operator=CONTAINS&resultPage=1&sortby=nametype&sp=y", "https://www.fishbase.se/summary/Nomorhamphus-liemi.html", "https://www.practicalfishkeeping.co.uk/features/what-conditions-do-halfbeaks-need/"]),
  unresolvedRetailFish("ALBİNO BIÇAK BALIĞI", ["Albino Knife Fish", "Albino Knifefish"], "monster", ["freshwater"], "https://www.cikletistpetshop.com/albino-bicak-baligi", "Albino ifadesi farklı bıçak balığı türlerinin seçilim formlarında kullanılabildiğinden renk adı biyolojik kimliği kanıtlamaz. Chitala ornata için ayrı kaynaklı profil hazırdır; ancak yalnız renk adı bu türü veya başka bir bıçak balığını ayırt edemez.", ["https://www.fishbase.se/ComNames/CommonNameSearchList.php?CommonName=Knifefish&crit1_operator=CONTAINS&resultPage=1&sortby=nametype&sp=y", "https://www.fishbase.se/summary/Chitala_ornata.html", "https://www.seriouslyfish.com/species/chitala-ornata/"]),
  unresolvedRetailFish("PIPE FISH NEEDLE", ["Pipefish", "Needlefish", "Pipe Fish"], "other", ["freshwater", "brackish", "saltwater"], "https://www.cikletistpetshop.com/pipe-fish-needle", "Pipefish ve Needlefish adları farklı familyalarda, farklı tuzluluk ve beslenme gereksinimine sahip çok sayıda türü kapsıyor. Xenentodon cancila ile X. canciloides için ayrı güvenli profiller hazırdır; ancak satış sayfası bu iki benzer iğne balığını veya gerçek bir pipefish türünü ayırt edecek bilimsel kimliği vermiyor.", ["https://www.fishbase.se/ComNames/CommonNameSearchList.php?CommonName=Pipefish&crit1_operator=CONTAINS&resultPage=1&sortby=nametype&sp=y", "https://www.fishbase.se/ComNames/CommonNameSearchList.php?CommonName=Needlefish&crit1_operator=CONTAINS&resultPage=1&sortby=nametype&sp=y", "https://www.seriouslyfish.com/species/xenentodon-cancila", "https://www.seriouslyfish.com/species/xenentodon-canciloides"]),
  unresolvedRetailFish("DEV TİMSAH BALIKLARI", ["Dev Timsah Balığı", "Giant Gar"], "monster", ["freshwater", "brackish"], "https://www.cikletistpetshop.com/dev-timsah-baliklari", "Timsah balığı adı Atractosteus ve Lepisosteus cinslerindeki erişkin boyları farklı birden fazla gar türü için kullanılıyor.", ["https://www.fishbase.se/ComNames/CommonNameSearchList.php?CommonName=Gar&crit1_operator=CONTAINS&resultPage=1&sortby=nametype&sp=y"]),
  unresolvedRetailFish("BIÇAK BALIKLARI", ["Bıçak Balığı", "Knifefish"], "monster", ["freshwater"], "https://www.cikletistpetshop.com/bicak-baliklari", "Bıçak balığı ortak adı erişkin boyu birkaç santimetreden bir metreyi aşan farklı familya ve türleri kapsıyor. Chitala ornata için ayrı kaynaklı profil hazırdır; genel satış başlığı bilimsel kimlik olmadan bu profile veya daha küçük bıçak balıklarına bağlanamaz.", ["https://www.fishbase.se/ComNames/CommonNameSearchList.php?CommonName=Knifefish&crit1_operator=CONTAINS&resultPage=1&sortby=nametype&sp=y", "https://www.fishbase.se/summary/Chitala_ornata.html", "https://www.seriouslyfish.com/species/chitala-ornata/"]),
  unresolvedRetailFish("GÖKKUŞAĞI GOBY", ["Rainbow Goby", "Gökkuşağı Gobisi"], "goby", ["freshwater", "brackish", "saltwater"], "https://www.cikletistpetshop.com/gokkusagi-goby", "Rainbow Goby adı farklı kıtalardaki ve farklı tuzluluk isteyen birden fazla goby türü için kullanılıyor.", ["https://www.fishbase.se/ComNames/CommonNameSearchList.php?CommonName=Rainbow+goby&crit1_operator=CONTAINS&resultPage=1&sortby=nametype&sp=y"]),
  unresolvedRetailFish("PUFFER BALIKLARI", ["Puffer", "Puffer Balığı", "Balon Balığı"], "puffer", ["freshwater", "brackish", "saltwater"], "https://www.cikletistpetshop.com/puffer-baliklari", "Puffer ve balon balığı adları tatlı, acı ve deniz suyunda yaşayan; boy ve saldırganlığı çok farklı türleri kapsıyor.", ["https://www.fishbase.se/ComNames/CommonNameSearchList.php?CommonName=Puffer&crit1_operator=CONTAINS&resultPage=1&sortby=nametype&sp=y"]),
  {
    name: "ALLIGATOR GAR TİMSAH BALIKLARI",
    aliases: ["Alligator Gar", "Alligator Gar Timsah Balığı"],
    category: "fish",
    group: "monster",
    waterTypes: ["freshwater", "brackish"],
    reason: "Alligator Gar ortak adı güvenilir kaynaklarda Atractosteus spatula için kullanılır; ancak satış sayfası bilimsel kimlik yayımlamıyor ve ticarette gar melezleri de bulunuyor. FishBase 260 cm toplam boy, uzman bakım kaynağı 305 cm standart boy bildiriyor; bu farklı ölçüm türleri birbirinin yerine kullanılamaz. Uzman kaynak ev akvaryumuna uygun olmadığını ve yalnız çok büyük kamusal tesislerde düşünülmesi gerektiğini belirtirken sayısal bir akvaryum hacmi veya tabanı yayımlamıyor. Bu nedenle örnek kimliği ve yetişkin tesisi doğrulanmadan güvenli hacim profili üretilemez.",
    sourceUrl: "https://www.cikletistpetshop.com/alligator-gar-timsah-baliklari",
    additionalSourceUrls: ["https://www.fishbase.se/summary/1073", "https://www.seriouslyfish.com/species/atractosteus-spatula", "https://www.floridamuseum.ufl.edu/discover-fish/species-profiles/alligator-gar/", "https://www.fws.gov/sites/default/files/documents/Ecological-Risk-Screening-Summary-Alligator-gar.pdf"],
    verifiedAt: "2026-09-10",
  },
  unresolvedRetailFish("REED KİTTY TETRA", ["Reed Kitty Tetra", "Red Kitty Tetra"], "tetra", ["freshwater"], "https://www.cikletistpetshop.com/reed-kitty-tetra", "Reed ve Kitty ifadeleri yerleşik tek bir bilimsel ortak ad oluşturmuyor; yazım hatası olasılığı da tür kimliğini belirsiz bırakıyor.", ["https://www.fishbase.se/ComNames/CommonNameSearchList.php?CommonName=Kitty+tetra&crit1_operator=CONTAINS&resultPage=1&sortby=nametype&sp=y"]),
  {
    name: "RED BELLY TETRA",
    aliases: ["Red Belly Tetra", "Red-bellied Tetra"],
    category: "fish",
    group: "tetra",
    waterTypes: ["freshwater"],
    reason: "Satış sayfası bilimsel kimlik ya da ayırt edici bakım verisi yayımlamıyor ve görsellerin temsili olduğunu belirtiyor. Ticari kaynaklarda Red Belly Tetra adı hem Aphyocharax rathbuni hem Hyphessobrycon pyrrhonotus için kullanılıyor; FishBase bu adların farklı türlere ait olduğunu doğruluyor. Satılan örneğin kimliği kanıtlanmadan iki ayrı erişkin boy ve su profili arasından seçim yapılamaz.",
    sourceUrl: "https://www.cikletistpetshop.com/red-belly-tetra",
    additionalSourceUrls: [
      "https://www.fishbase.se/summary/Aphyocharax-rathbuni",
      "https://www.fishbase.se/summary/Hyphessobrycon-pyrrhonotus.html",
      "https://nanotanksaustralia.com.au/products/red-belly-tetra-3cm",
      "https://www.livingaquarium.net/product-page/red-belly-tetra",
    ],
    verifiedAt: "2026-09-08",
  },
  unresolvedRetailFish("RED RUBY CİKLET", ["Red Ruby Cichlid", "Ruby Red Peacock"], "cichlid", ["freshwater"], "https://www.cikletistpetshop.com/red-ruby-ciklet", "Red Ruby doğal bir tür değildir; Aulonocara sp. 'stuartgranti maleri' seçilim hattı, A. stuartgranti kökenli farklı yerel formlar ve melez Peacock hatları bu adla satılabiliyor. Aulonocara stuartgranti için ayrı güvenli profil hazırdır ancak renk adı tek başına bu bilimsel kimliği kanıtlamaz.", ["https://www.fishbase.se/summary/Aulonocara-stuartgranti", "https://www.seriouslyfish.com/species/aulonocara-stuartgranti", "https://malawi-guru.de/aulonocara-sp-stuartgranti-maleri-verzeichnis/"]),
  unresolvedRetailFish("İTHAL SARI İMPARATOR CİKLET", ["Sarı İmparator Ciklet", "Yellow Emperor Cichlid"], "cichlid", ["freshwater"], "https://www.cikletistpetshop.com/ithal-sari-imparator-ciklet", "Sarı İmparator ticari adı Aulonocara baenschi, sarı A. stuartgranti yerel formları ve seçilim/melez Peacock hatları için kullanılabiliyor. A. baenschi için ayrı güvenli profil hazırdır ancak satış sayfası bilimsel kimlik veya göl kökeni vermediğinden bu profile bağlanamaz.", ["https://www.seriouslyfish.com/species/aulonocara-baenschi", "https://www.fishbase.se/summary/2179", "https://www.seriouslyfish.com/species/aulonocara-stuartgranti"]),
  unresolvedRetailFish("MALAWİ CİKLET BALIKLARI", ["Malawi Ciklet", "Malawi Cichlid"], "cichlid", ["freshwater"], "https://www.cikletistpetshop.com/malawi-ciklet-baliklari", "Malawi ciklet adı davranış, boy, beslenme ve sosyal düzeni çok farklı yüzlerce türe ait genel bir kategori adıdır.", ["https://www.fishbase.se/identification/specieslist.php?famcode=349"]),
  unresolvedRetailFish("TATLI SU DİL BALIKLARI", ["Tatlı Su Dil Balığı", "Freshwater Sole"], "other", ["freshwater", "brackish"], "https://www.cikletistpetshop.com/tatli-su-dil-baliklari", "Freshwater sole ve tatlı su dil balığı adları tam tatlı su ile acı su isteyen farklı yassı balık türlerini kapsıyor. Brachirus panoides için ayrı güvenli profil hazırdır; ancak bilimsel kimliği verilmeyen satış kaydı B. harmandi, B. selheimi ve başka dil balıklarından ayırt edilemez.", ["https://www.fishbase.se/ComNames/CommonNameSearchList.php?CommonName=Freshwater+sole&crit1_operator=CONTAINS&resultPage=1&sortby=nametype&sp=y", "https://www.fishbase.se/summary/Brachirus_panoides.html", "https://www.fishbase.se/identification/SpeciesList.php?genus=Brachirus"]),
  unresolvedRetailFish("PURPLE SPOTTED GUDGEON MOGURNDA BALIĞI", ["Purple Spotted Gudgeon", "Mogurnda Balığı"], "goby", ["freshwater"], "https://www.cikletistpetshop.com/purple-spotted-gudgeon-mogurnda-baligi", "Purple-spotted gudgeon adı Mogurnda cinsinde birbirine benzeyen türlere uygulanabiliyor ve satılan örneğin bilimsel adı verilmiyor.", ["https://www.fishbase.se/ComNames/CommonNameSearchList.php?CommonName=Purple-spotted+gudgeon&crit1_operator=CONTAINS&resultPage=1&sortby=nametype&sp=y"]),
  unresolvedRetailFish("İTHAL KARIŞIK CİKLET", ["Karışık Ciklet", "Mixed Cichlid"], "cichlid", ["freshwater"], "https://www.cikletistpetshop.com/ithal-karisik-ciklet", "Karışık ciklet ifadesi tek bir tür değildir; aynı sevkiyatta farklı boy, su ve davranış gereksinimli türler bulunabilir.", ["https://www.fishbase.se/identification/specieslist.php?famcode=349"]),
  {
    name: "BLUE AZUL PEACOCK BASS",
    aliases: ["Blue Azul Peacock Bass", "Azul Peacock Bass"],
    category: "fish",
    group: "monster",
    waterTypes: ["freshwater"],
    reason: "Azul adı çoğunlukla Cichla piquiti için kullanılır; ancak satış sayfası bilimsel kimlik yayımlamıyor ve aynı cinsteki türler ile melezler ticarette karışabiliyor. FishBase C. piquiti için yayımlanmış azami boyu 48 cm verirken Fishipedia 80 cm'ye kadar boy, en az 5.000 litre ve 300 cm akvaryum cephesi bildiriyor. Kesin C. piquiti için koruyucu ayrı profil hazırdır; fakat yalnız bu ticari addan tür kimliği seçilerek otomatik biyolojik yük hesabı yapılamaz.",
    sourceUrl: "https://www.cikletistpetshop.com/blue-azul-peacock-bass",
    additionalSourceUrls: ["https://www.fishbase.se/summary/Cichla-piquiti.html", "https://www.fishi-pedia.com/fishes/cichla-piquiti", "https://www.fishbase.se/identification/specieslist.php?genus=Cichla"],
    verifiedAt: "2026-09-09",
  },
  unresolvedRetailFish("YELLOW FLAGTAİL", ["Yellow Flagtail", "Sarı Flagtail"], "other", ["freshwater", "brackish", "saltwater"], "https://www.cikletistpetshop.com/yellow-flagtail", "Satış sayfası ürünü Sazansıgiller altında ve yaklaşık 8 cm satış boyuyla listelese de bilimsel ad vermiyor. Yellow Flagtail ticari adı Semaprochilodus kneri, S. taeniurus ve S. insignis gibi erişkin bakım gereksinimleri ayrı türlerle; ayrıca deniz flagtailleriyle de kullanılıyor.", ["https://www.fishbase.se/ComNames/CommonNameSearchList.php?CommonName=Yellow+flagtail&crit1_operator=CONTAINS&resultPage=1&sortby=nametype&sp=y", "https://www.qualitymarine.com/news/flagtail-yellow-prochilodus-semaprochilodus-taeniurus/", "https://www.aquaristatlas.com/piranhas/semaprochilodus-kneri/", "https://www.kingsoftheaquarium.com.au/product-page/flagtail-prochilodus-yellow-finned"]),
  {
    name: "SİLVER ARGUS BALIKLARI",
    aliases: ["Silver Argus"],
    category: "fish",
    group: "other",
    waterTypes: ["freshwater", "brackish", "saltwater"],
    reason: "Satış sayfası bilimsel ad yayımlamıyor, balık boylarının değişebildiğini ve görsellerin temsili olduğunu belirtiyor. OATA bakım belgesi Silver Scat adını Selenotoca multifasciata için kullanırken FishBase Argus fish adını Scatophagus argus için kaydediyor; bu iki tür aynı değildir. Başlıktaki Silver ve Argus sözcükleri tek başına hangi türün satıldığını kanıtlamadığı için tatlı, acı ya da deniz suyu bakım profillerinden biri güvenle seçilemez.",
    sourceUrl: "https://www.cikletistpetshop.com/silver-argus-baliklari",
    additionalSourceUrls: [
      "https://ornamentalfish.org/what-we-do/advice-information/care-sheets/brackish-fish/how-to-look-after-monos-scats-archerfish/",
      "https://www.fishbase.se/ComNames/CommonNamesList.php?GenusName=Scatophagus&ID=4698&SpeciesName=argus&StockCode=4919",
      "https://www.fishbase.se/Fieldguide/FieldGuideSummary.php?c_code=360&genusname=Selenotoca&speciesname=multifasciata",
    ],
    verifiedAt: "2026-09-08",
  },
  unresolvedRetailFish("ODUN PENGASUS BALIKLARI", ["Odun Pangasius", "Wood Pangasius", "Odun Pengasus"], "bottom", ["freshwater"], "https://www.cikletistpetshop.com/odun-pengasus-baliklari", "Odun ve Pengasus yazımı yerleşik tek bir bilimsel ortak ad değildir; pangasiid veya odun kedi balığı kimliği doğrulanamıyor.", ["https://www.fishbase.se/ComNames/CommonNameSearchList.php?CommonName=Pangasius&crit1_operator=CONTAINS&resultPage=1&sortby=nametype&sp=y"]),
  unresolvedRetailFish("DRAGONE FİSH", ["Dragone Fish", "Dragon Fish"], "other", ["freshwater", "brackish", "saltwater"], "https://www.cikletistpetshop.com/dragone-fish", "Dragon Fish adı arowana, dragon goby ve deniz ejderi gibi tamamen farklı su ve bakım gereksinimli canlılar için kullanılıyor.", ["https://www.fishbase.se/ComNames/CommonNameSearchList.php?CommonName=Dragon+fish&crit1_operator=CONTAINS&resultPage=1&sortby=nametype&sp=y"]),
];

const unresolvedRetailListing = (
  name: string,
  aliases: string[],
  category: Livestock["category"],
  group: UnresolvedSpeciesListing["group"],
  waterTypes: AquariumType[],
  sourceUrl: string,
  reason: string,
  additionalSourceUrls: string[],
): UnresolvedSpeciesListing => ({ name, aliases, category, group, waterTypes, reason, sourceUrl, additionalSourceUrls, verifiedAt: "2026-09-03" });

const cikletistMainCategoryUnresolved: UnresolvedSpeciesListing[] = [
  unresolvedRetailListing("AMERİKAN KEREVİTLERİ", ["Amerikan Kereviti", "American Crayfish"], "other", "crayfish", ["freshwater"], "https://www.cikletistpetshop.com/amerikan-kerevitleri-380", "Satış adı tek bir tür belirtmiyor. Amerikan kereviti adı Procambarus ve Cambarus dahil erişkin boyu, saldırganlığı ve istilacılık riski farklı çok sayıda türü kapsadığı için güvenli bakım profili seçilemez.", ["https://www.gbif.org/species/search?q=American%20crayfish", "https://www.gbif.org/species/search?q=Procambarus"]),
  unresolvedRetailListing("Şeker Pembe Ciklet", ["Seker Pembe Ciklet", "Candy Pink Cichlid"], "fish", "cichlid", ["freshwater"], "https://www.cikletistpetshop.com/seker-pembe-ciklet--1863", "Satış adı bilimsel tür veya ebeveyn melez hattı vermeyen bir renk adıdır. Cichlidlerde pembe renk adı farklı tür ve melezlerde kullanıldığından erişkin boy, saldırganlık ve su gereksinimleri güvenle atanamaz.", ["https://www.fishbase.se/identification/specieslist.php?famcode=349"]),
  unresolvedRetailListing("GREEN TEXAS CİKLET BALIKLARI", ["Green Texas Ciklet", "Yeşil Teksas Ciklet"], "fish", "cichlid", ["freshwater"], "https://www.cikletistpetshop.com/green-texas-ciklet-baliklari", "Green Texas ticari adı kaynaklarda hem Herichthys carpintis hem de Herichthys cyanoguttatus seçilim hatları için kullanılıyor. Mağaza bilimsel kimlik vermediğinden iki ayrı türün bakım profilinden biri seçilemez.", ["https://www.fishbase.se/summary/Herichthys-carpintis.html", "https://www.fishbase.se/summary/Herichthys-cyanoguttatus.html", "https://www.fws.gov/sites/default/files/documents/2025-06/ecological-risk-screening-summary-rio-grande-cichlid-june-2025.pdf"]),
  unresolvedRetailListing("GEOPHAGUS HONGDEA", ["Geophagus Hongdea"], "fish", "cichlid", ["freshwater"], "https://www.cikletistpetshop.com/geophagus-hongdea", "Hongdea adı geçerli bir bilimsel Geophagus tür adı olarak doğrulanamadı ve satış sayfası bilimsel kimlik vermiyor. Benzer görünümlü Geophagus türlerinin boy ve davranışları farklı olduğundan fotoğraftan profil atanmadı.", ["https://www.fishbase.se/identification/SpeciesList.php?genus=Geophagus"]),
  unresolvedRetailListing("TROPHEUS RED BELLY", ["Red Belly Tropheus"], "fish", "cichlid", ["freshwater"], "https://www.cikletistpetshop.com/tropheus-red-belly", "Red Belly bir tür veya doğrulanmış göl popülasyonu adı değildir. Tropheus tür ve popülasyonlarının sosyal grup, beslenme ve eşleşme riskleri farklı olduğundan köken bilgisi olmadan mevcut bir profile bağlanamaz.", ["https://www.fishbase.se/identification/SpeciesList.php?genus=Tropheus"]),
  unresolvedRetailListing("CİKLET M BOY A KALİTE", ["Ciklet M Boy", "A Kalite Ciklet"], "fish", "cichlid", ["freshwater"], "https://www.cikletistpetshop.com/ciklet-m-boy-a-kalite", "Başlık yalnız ürün boy sınıfı ve kalite ifadesi taşıyor; tür, köken veya bilimsel kimlik vermiyor. Cichlid ailesindeki çok farklı boy ve saldırganlık profilleri arasından seçim yapılamaz.", ["https://www.fishbase.se/identification/specieslist.php?famcode=349"]),
  unresolvedRetailListing("SPOTTED NERİTE ÇEŞİTLERİ YOSUN YİYİCİ SALYANGOZLAR 4 ADET STRAFORLU GÖNDERİM", ["Spotted Nerite Çeşitleri", "Spotted Nerite Snail"], "snail", "snail", ["freshwater", "brackish"], "https://www.cikletistpetshop.com/spotted-nerite-cesitleri-yosun-yiyici-salyangozlar", "Spotted Nerite tek bir bilimsel tür değildir; benekli kabuk desenine sahip farklı Neritidae türleri aynı adla satılabilir. Yumurtlama, erişkin boy ve tuzluluk gereksinimi tür kimliği olmadan kesinleştirilemez.", ["https://www.gbif.org/species/search?q=Neritidae"]),
  unresolvedRetailListing("CHALLENGERLAR", ["Challenger", "Challenger Balığı"], "fish", "monster", ["freshwater", "brackish"], "https://www.cikletistpetshop.com/challengerlar", "Challenger yerleşik ve tekil bir bilimsel ortak ad değildir; farklı pazarlarda pangasiid kedi balıkları ve başka iri türler için kullanılabilir. Satış sayfası bilimsel ad vermediği için erişkin hacim hesabı üretilemez.", ["https://www.fishbase.se/ComNames/CommonNameSearchList.php?CommonName=Challenger&crit1_operator=CONTAINS&resultPage=1&sortby=nametype&sp=y"]),
  unresolvedRetailListing("Red Carpet Anemone (Rare)", ["Red Carpet Anemone"], "other", "other", ["saltwater"], "https://www.cikletistpetshop.com/red-carpet-anemone-rare", "Carpet Anemone adı Stichodactyla cinsindeki bakım zorluğu, erişkin çapı ve balık yakalama riski farklı türleri kapsar. Renk tek başına bilimsel kimliği kanıtlamadığından tür profili atanmadı.", ["https://www.marinespecies.org/aphia.php?p=taxlist&tName=Stichodactyla"]),
  unresolvedRetailListing("Green Carpet Anemone", ["Green Carpet Anemone L Boy", "Yeşil Carpet Anemone"], "other", "other", ["saltwater"], "https://www.cikletistpetshop.com/green-carpet-anemone", "Green Carpet Anemone adı Stichodactyla haddoni, S. gigantea ve başka halı anemonları için kullanılabilir; L boy yalnız satış boyudur. Bilimsel kimlik olmadan erişkin hacim, akıntı ve ışık profili seçilemez.", ["https://www.marinespecies.org/aphia.php?p=taxlist&tName=Stichodactyla"]),
  unresolvedRetailListing("Sand Cucumber", ["Sea Cucumber", "Kum Deniz Hıyarı"], "other", "other", ["saltwater"], "https://www.cikletistpetshop.com/sand-cucumber", "Sand Cucumber çok sayıda deniz hıyarı türü için kullanılan genel bir addır. Türler erişkin boy, beslenme ve toksin riski bakımından ayrıldığı için bilimsel kimlik olmadan güvenli profil verilemez.", ["https://www.marinespecies.org/aphia.php?p=taxlist&tName=Holothuroidea"]),
  unresolvedRetailListing("Karışık Nerite Salyangoz(Yosun Yiyici) 4 ADET STRAFORLU GÖNDERİM", ["Karışık Nerite Salyangoz", "Mixed Nerite Snail"], "snail", "snail", ["freshwater", "brackish"], "https://www.cikletistpetshop.com/karisik-nerite-salyangozyosun-yiyici-4-adet-straforlu-gonderim", "Karışık paket tek bir tür değildir ve hangi Neritidae türlerinin gönderileceği belirtilmiyor. Türler farklı erişkin boy ve tuzluluk davranışı gösterebildiği için tek bakım profiline bağlanamaz.", ["https://www.gbif.org/species/search?q=Neritidae"]),
  unresolvedRetailListing("Elma Salyangozu 3 ADET", ["Elma Salyangozu", "Apple Snail"], "snail", "snail", ["freshwater"], "https://www.cikletistpetshop.com/elma-salyangozu-1925", "Elma salyangozu adı Pomacea diffusa, P. canaliculata ve başka ampullariid türlerini kapsayabilir. Türler erişkin boy, bitki yeme ve istilacılık riski açısından farklı olduğundan bilimsel kimlik olmadan mevcut profile bağlanmadı.", ["https://www.gbif.org/species/search?q=Pomacea"]),
  unresolvedRetailListing("Tatlı Su Midyesi(Doğal Filtre) 3 ADET KLASİK BÜYÜK BOY", ["Tatlı Su Midyesi", "Freshwater Mussel"], "other", "other", ["freshwater"], "https://www.cikletistpetshop.com/tatli-su-midyesidogal-filtre-3-adet-klasik-buyuk-boy-", "Tatlı su midyesi tek bir tür değildir; farklı familya ve türlerin erişkin boyu, beslenmesi ve larva yaşam döngüsü değişir. Yalnız doğal filtre ifadesi güvenli tür ve bakım profili oluşturmaz.", ["https://www.gbif.org/species/search?q=freshwater%20mussel"]),
  unresolvedRetailListing("CARİDİNA GALAXY FİSHBONE KARİDES 2 ADET", ["Caridina Galaxy Fishbone", "Galaxy Fishbone Shrimp"], "shrimp", "shrimp", ["freshwater"], "https://www.cikletistpetshop.com/caridina-galaxy-fishbone-karides-2-adet", "Galaxy Fishbone adı kırmızı, siyah ve melez Caridina seçilim hatlarında kullanılır. Satış sayfası doğrulanmış hat veya bilimsel köken vermediği için mevcut Red ya da Black Galaxy profillerinden biri seçilemez.", ["https://www.gbif.org/species/search?q=Caridina"]),
  unresolvedRetailListing("CARİDİNA TANGERİ TİGER KARİDES 2 ADET", ["Caridina Tangeri Tiger", "Tangerine Tiger Shrimp"], "shrimp", "shrimp", ["freshwater"], "https://www.cikletistpetshop.com/caridina-tangeri-tiger-karides-2-adet", "Tangeri yazımı tek başına Caridina mariae kimliğini kanıtlamaz ve ürün sayfası bilimsel tür veya üretim hattı vermiyor. Hassas su değerleri tahmin edilmeden kayıt güvenlik listesinde tutulur.", ["https://www.gbif.org/species/search?q=Caridina%20mariae"]),
  unresolvedRetailListing("CARİDİNA PİNTO KARİDES 2 ADET", ["Caridina Pinto", "Pinto Shrimp"], "shrimp", "shrimp", ["freshwater"], "https://www.cikletistpetshop.com/caridina-pinto-karides-2-adet", "Pinto adı kırmızı, siyah, spotted, zebra ve farklı melez Caridina hatlarını kapsar. Renk ve hat belirtilmeden mevcut Red Pinto veya Black Pinto profilinden biri güvenle seçilemez.", ["https://www.gbif.org/species/search?q=Caridina"]),
];

export const unresolvedSpeciesListings: UnresolvedSpeciesListing[] = [
  ...cikletistTetraMainUnresolved,
  ...cikletistMainCategoryUnresolved,
  {
    name: "ALBİNO SKY BLUE", aliases: ["Albino Sky Blue", "Albino Sky", "Sky Blue"],
    category: "fish", group: "livebearer", waterTypes: ["freshwater"],
    reason: "Satış sayfası yalnız renk adını veriyor; tür veya bilimsel ad yayımlamıyor. Albino ve Sky Blue ifadeleri farklı canlı doğuran varyetelerinde kullanılabildiği için yalnız fotoğraf ve kategoriye bakarak lepistes ya da moli profili seçilemez.",
    sourceUrl: "https://www.cikletistpetshop.com/albino-sky-blue",
    additionalSourceUrls: ["https://ornamentalfish.org/what-we-do/advice-information/care-sheets/caresheets-tropical-freshwater-fish/how-to-look-after-guppies-and-mollies/", "https://www.cikletistpetshop.com/canli-doguranlar-87"], verifiedAt: "2026-09-02",
  },
  {
    name: "MEYAN KÖKÜ GURAMİ", aliases: ["Meyan Kökü Gurami", "Licorice Gourami", "Liquorice Gourami"],
    category: "fish", group: "labyrinth", waterTypes: ["freshwater"],
    reason: "Satış sayfası yalnız genel Meyan Kökü Gurami adını veriyor; bilimsel tür veya köken bilgisi yayımlamıyor. Licorice Gourami adı birden fazla Parosphromenus türünü kapsıyor ve uzman koruma ağı gerçek P. deissneri'nin ticarette nadir olduğunu, başka türlerin bu adla sıkça yanlış etiketlendiğini belirtiyor. Bilimsel etiket veya Bangka kökeni doğrulanmadan gerçek P. deissneri'nin 25 litre, çok yumuşak ve pH 3,0–6,5 siyah su profili atanamaz.",
    sourceUrl: "https://www.cikletistpetshop.com/meyan-koku-gurami",
    additionalSourceUrls: ["https://parosphromenus-project.org/species/parosphromenus-deissneri/", "https://www.seriouslyfish.com/species/parosphromenus-deissneri", "https://www.fishbase.se/summary/12078"], verifiedAt: "2026-09-08",
  },
  {
    name: "Gurami", aliases: ["Gourami", "Gurami Balığı"],
    category: "fish", group: "labyrinth", waterTypes: ["freshwater"],
    reason: "Satış sayfası yalnız Gurami adını veriyor; bilimsel tür, erişkin boy veya köken bilgisi yayımlamıyor. Uzman kaynaklarda bu genel ad yaklaşık 4 cm'lik kıvılcım guramiden 70 cm'lik dev guramiye kadar bakım ve hacim gereksinimleri çok farklı türleri kapsıyor. Görsel temsili olduğu için fotoğrafa bakarak tür ve güvenli akvaryum eşiği seçilemez.",
    sourceUrl: "https://www.cikletistpetshop.com/gurami-1929",
    additionalSourceUrls: ["https://ornamentalfish.org/what-we-do/advice-information/care-sheets/caresheets-tropical-freshwater-fish/how-to-look-after-gouramis-and-paradise-fish/", "https://fishbase.se/ComNames/CommonNameSearchList.php?CommonName=Gourami&crit1_operator=EQUAL", "https://www.cikletistpetshop.com/labirentli-baliklar-27"], verifiedAt: "2026-09-02",
  },
  {
    name: "Borneo Kelebek Vatoz",
    aliases: ["Borneo sucker", "Butterfly loach", "Borneo kelebek loach"],
    category: "fish", group: "bottom", waterTypes: ["freshwater"],
    reason: "Satış sayfası bilimsel ad vermiyor. Borneo sucker ve Butterfly loach adları birden fazla tepe-akarsu loach türü için kullanılıyor; uzman kaynak gerçek Gastromyzon punctulatus'un ticarette bulunmadığını ve G. stellatus dahil farklı türlerin bu adlarla karıştığını belirtiyor. G. stellatus için ayrı güvenli profil hazırdır ancak bilimsel etiket olmadan mağaza kaydı bu profile bağlanamaz.",
    sourceUrl: "https://www.cikletistpetshop.com/borneo-kelebek-vatoz-1872",
    additionalSourceUrls: ["https://www.seriouslyfish.com/species/gastromyzon-stellatus", "https://www.fishbase.se/summary/Gastromyzon-punctulatus", "https://www.loaches.com/articles/Hillstream%20Flyer.pdf", "https://www.tfhmagazine.com/articles/freshwater/in-search-of-borneo-suckers"], verifiedAt: "2026-09-10",
  },
  {
    name: "RED LİP STİCK GOBBY", aliases: ["Red Lip Stick Goby", "Red Lipstick Goby"],
    category: "fish", group: "goby", waterTypes: ["freshwater"],
    reason: "Satış sayfası bilimsel ad vermiyor ve görsellerin temsili olduğunu belirtiyor. Red Lipstick Goby adı kaynaklarda Sicyopus exallisquamulus, S. rubicundus ve S. jonklaasi için kullanılıyor. Üç bilimsel türün profili ayrı ayrı eklendi; ancak bilimsel etiket veya köken olmadan mağaza adı bunlardan birine otomatik bağlanmaz. Tehlikede ve Sri Lanka'da ihracata karşı korunan S. jonklaasi kimliği özellikle varsayılmaz.",
    sourceUrl: "https://www.cikletistpetshop.com/red-lip-stick-gobby",
    additionalSourceUrls: ["https://www.seriouslyfish.com/species/sicyopus-exallisquamulus", "https://www.b-aqua.com/pages/fiche.aspx?id=7455", "https://www.fishbase.se/summary/10800", "https://publications.gc.ca/collections/collection_2022/mpo-dfo/fs70-5/Fs70-5-2021-036-eng.pdf", "https://www.interaquaristik.de/Roetliche-Lippenstiftgrundel-Sicyopus-rubicundus/SW13053", "https://tropicalfishco.co.uk/products/red-lipstick-goby-tropical-fish-uk-sale"], verifiedAt: "2026-09-09",
  },
  {
    name: "BLUE NEON GOBBY GOBİ", aliases: ["Blue Neon Goby", "Blue Neon Gobby"],
    category: "fish", group: "goby", waterTypes: ["freshwater"],
    reason: "Satış sayfası bilimsel ad vermiyor. Uzman bakım kaynakları Blue Neon Goby adını Stiphodon atropurpureus için kullanırken Stiphodon semoni'nin de S. atropurpureus, Cobalt Blue Goby ve Freshwater Neon Goby adlarıyla yanlış etiketlenebildiğini açıkça belirtiyor. İki türün sıcaklık üst sınırları ve coğrafi kimlikleri farklı olduğundan örnek bilimsel olarak doğrulanmadan bakım profili atanamaz.",
    sourceUrl: "https://www.cikletistpetshop.com/blue-neon-gobby",
    additionalSourceUrls: ["https://www.seriouslyfish.com/species/stiphodon-atropurpureus", "https://www.seriouslyfish.com/species/stiphodon-semoni", "https://www.fishbase.se/summary/Stiphodon-atropurpureus.html", "https://fishbase.se/summary/Stiphodon-semoni.html"], verifiedAt: "2026-09-08",
  },
  {
    name: "JULLY ÇÖPÇÜ BALIKLARI", aliases: ["Jully çöpçü", "Julii çöpçü", "Julii Cory"],
    category: "fish", group: "bottom", waterTypes: ["freshwater"],
    reason: "Satış sayfası bilimsel ad veya ayırt edici köken bilgisi vermiyor. Uzman tür kaynağı gerçek Hoplisoma julii'nin başında küçük ayrı noktalar, ticarette False Julii olarak bulunan H. trilineatum'un ise çoğunlukla solucanımsı çizgiler taşıdığını; buna rağmen desenlerin örtüşebildiğini ve ticari Julii kayıtlarının sıkça H. trilineatum olduğunu belirtiyor. Bilimsel etiket veya toplama kökeni olmadan iki profilden biri seçilemez.",
    sourceUrl: "https://www.cikletistpetshop.com/jully-copcu-baliklari",
    additionalSourceUrls: ["https://www.seriouslyfish.com/species/corydoras-julii", "https://www.fishbase.se/summary/10923", "https://www.fishkeeper.co.uk/fish/freshwater/catfish/false-julii-cory-"], verifiedAt: "2026-09-08",
  },
  {
    name: "KÜREK BURUN BALIKLARI", aliases: ["Kürek burun kedi balığı", "Shovelnose catfish"],
    category: "fish", group: "bottom", waterTypes: ["freshwater"],
    reason: "Satış sayfası bilimsel ad vermiyor. Kürek burun adı farklı cinslerde, erişkin boyları ve bakım ihtiyaçları çok farklı birden fazla kedi balığı için kullanılıyor.",
    sourceUrl: "https://www.cikletistpetshop.com/kurek-burun-kedi-baliklari-271",
    additionalSourceUrls: ["https://nas.er.usgs.gov/queries/FactSheet.aspx?SpeciesID=2578", "https://www.fishbase.se/ComNames/CommonNameSearchList.php?CommonName=Shovelnose+catfish&crit1_operator=CONTAINS&resultPage=1&sortby=nametype&sp=y"], verifiedAt: "2026-09-01",
  },
  {
    name: "PANDA GARRARUFA YOSUN YİYİCİ", aliases: ["Panda Garra", "Panda Garra Rufa", "Panda Garrarufa"],
    category: "fish", group: "bottom", waterTypes: ["freshwater"],
    reason: "Satış adı iki ayrı kimliği birleştiriyor: uzman kaynaklar Panda Garra adını Garra flavatra için kullanırken Garra rufa farklı, daha iri ve 14–20 °C serin su isteyen bir türdür. Satıcı bilimsel ad vermediği için 9 cm ve 22–27 °C isteyen G. flavatra ile 14,1 cm ve serin su isteyen G. rufa profillerinden hangisinin uygulanacağı güvenle belirlenemez.",
    sourceUrl: "https://www.cikletistpetshop.com/panda-garrarufa-yosun-yiyici",
    additionalSourceUrls: ["https://www.seriouslyfish.com/species/garra-flavatra", "https://www.fishbase.se/summary/Garra-flavatra.html", "https://www.seriouslyfish.com/species/garra-rufa", "https://www.fishbase.se/summary/Garra-rufa.html"], verifiedAt: "2026-09-08",
  },
  {
    name: "L-146 Albino Pleco", aliases: ["L146 Albino Pleco", "L 146 Albino"],
    category: "fish", group: "bottom", waterTypes: ["freshwater"],
    reason: "L146/LDA30 için ayrı Peckoltichthys cf. bachi profili doğrulandı; ancak uzman kaynak satış başlığındaki Albino ifadesini doğrulamıyor. Kullanıcı kesin L146 profilini seçebilir, fakat albino varyete kimliği doğrulanmadan bu mağaza adı otomatik eşlenmez.",
    sourceUrl: "https://www.cikletistpetshop.com/l-146-albino-pleco",
    additionalSourceUrls: ["https://www.suedamerikafans.de/en/wels-datenbank/welsart/?art=236", "https://www.suedamerikafans.de/en/wels-datenbank/welsgattung/?gattung_name=Peckoltichthys"], verifiedAt: "2026-09-08",
  },
  {
    name: "L-069 Peckoltia Ucayalensis", aliases: ["L069 Peckoltia Ucayalensis", "L 069 Pleco"],
    category: "fish", group: "bottom", waterTypes: ["freshwater"],
    reason: "Satış başlığındaki iki kimlik birbiriyle çelişiyor: güncel uzman L-numarası listesi L069'u Ancistomus/Ancistrini sp. olarak verirken Peckoltichthys ucayalensis ayrı bir bilimsel profildir. Kullanıcı kesin bilimsel profili seçebilir, fakat doğrudan örnek kimliği olmadan mağaza adı iki profilden birine otomatik bağlanmaz.",
    sourceUrl: "https://www.cikletistpetshop.com/l-069-peckoltia-ucayalensis",
    additionalSourceUrls: ["https://www.suedamerikafans.de/es/wels-datenbank/gefunden/?db_familie=1&db_lnr_bis=100&db_order=A15&db_show=bilder&db_unterfamilie=alle", "https://www.suedamerikafans.de/en/wels-datenbank/welsart/?art=2415"], verifiedAt: "2026-09-08",
  },
  {
    name: "COLOMBİAN FARLOWELLA", aliases: ["Colombian Farlowella", "Colombia Farlowella"],
    category: "fish", group: "bottom", waterTypes: ["freshwater"],
    reason: "Satış sayfası bilimsel ad vermiyor. Kolombiya'da birden fazla Farlowella türü bulunduğundan ülke adı tek başına Farlowella colombiensis kimliğini kanıtlamaz.",
    sourceUrl: "https://www.cikletistpetshop.com/colombian-farlowella",
    additionalSourceUrls: ["https://pmc.ncbi.nlm.nih.gov/articles/PMC12710843/", "https://researcharchive.calacademy.org/research/ichthyology/catalog/fishcatget.asp?genus=Farlowella&tbl=species"], verifiedAt: "2026-09-01",
  },
  {
    name: "ZİGZAK TARAK BALIKLARI", aliases: ["Zigzag eel", "Zig-zag eel", "Zigzag tarak balığı"],
    category: "fish", group: "monster", waterTypes: ["freshwater"],
    reason: "Satış sayfası bilimsel ad vermiyor. Zigzag eel adı güvenilir kaynaklarda 90 cm'ye ve en az 450 litre bakım ölçeğine ulaşan Mastacembelus armatus için kullanılırken akvaryum ticaretinde 20 cm'lik Macrognathus circumcinctus için de kullanılıyor. Yalnız ticari adla iki çok farklı erişkin boy ve akvaryum eşiğinden biri seçilemez.",
    sourceUrl: "https://www.cikletistpetshop.com/zigzak-tarak-baliklari",
    additionalSourceUrls: ["https://www.fishbase.se/summary/Mastacembelus-armatus.html", "https://www.fishkeeper.co.uk/fish/freshwater/miscellaneous/tyre-track-eel", "https://tankbud.com/species/tire-track-eel", "https://www.fishbase.se/summary/Macrognathus-circumcinctus.html", "https://www.fishkeeper.co.uk/fish/freshwater/miscellaneous/half-banded-spiny-eel"], verifiedAt: "2026-09-08",
  },
  {
    name: "CHANNA GOLDEN LİMBATA", aliases: ["Channa Golden Limbata", "Golden Limbata", "Channa limbata"],
    category: "fish", group: "monster", waterTypes: ["freshwater"],
    reason: "Satış başlığı geçerli Channa limbata adına işaret ediyor ancak ürün sayfası bilimsel kimliği, Golden formun köken popülasyonunu veya zorunlu bakım eşiklerini yayımlamıyor. Kesin Channa limbata için ayrı 20 cm, 100 litre/80 cm ve 22–28 °C profili eklendi; fakat Golden adı tek başına o bilimsel kimliği ve yerel formu kanıtlamadığından mağaza kaydı otomatik eşleşmez.",
    sourceUrl: "https://www.cikletistpetshop.com/channa-golden-limbata",
    additionalSourceUrls: ["https://researcharchive.calacademy.org/research/ichthyology/catalog/fishcatget.asp?spid=34187", "https://channaturkiye.com/cuce-turler/channa-limbata/", "https://journal.ipb.ac.id/jai/article/download/52145/28773/293734"], verifiedAt: "2026-09-09",
  },
  {
    name: "WHITE CHECK EEL MÜREN", aliases: ["White Check Eel", "White Cheek Eel", "White Cheek Moray"],
    category: "fish", group: "monster", waterTypes: ["freshwater", "brackish", "saltwater"],
    reason: "Satış sayfası bilimsel ad veya su türü vermiyor. White-cheek moray adı bilimsel kaynakta Echidna rhodochilus için kullanılsa da mağazadaki White Check yazımının aynı türü anlattığı kanıtlanamıyor. E. rhodochilus 33,8 cm'lik bir müren olup saha çalışması uzun süreli tatlı su bakımını desteklemiyor; güvenli profil 450 litre ve SG 1.005–1.015 acı su istiyor. Kimlik doğrulanmadan bu özel profil veya başka bir tatlı/deniz müreni seçilemez.",
    sourceUrl: "https://www.cikletistpetshop.com/white-check-eel-muren",
    additionalSourceUrls: ["https://www.fishbase.se/summary/Echidna-rhodochilus.html", "https://ws.nmmba.gov.tw/Download.ashx?icon=.pdf&n=NiBIdWFuZyBldCBhbC5wZGY%3D&u=LzAwMS9VcGxvYWQvMjIzL3JlbGZpbGUvNjQ1Ny8xMTc1Ni80OWZmNDM4Zi1hZTA2LTQ2NjYtYTI1OS1jOWJhODNkNDMxZTYucGRm", "https://www.aquaportail.com/fiche-poisson-3677-echidna-rhodochilus.html"], verifiedAt: "2026-09-08",
  },
  {
    name: "CHANNA ASIATICA GÖKKUŞAĞI YILANBAŞ BLEHERİ", aliases: ["Channa Asiatica Gökkuşağı Yılanbaş Bleheri", "Channa asiatica bleheri"],
    category: "fish", group: "monster", waterTypes: ["freshwater"],
    reason: "Satış başlığı iki ayrı geçerli tür adını birleştiriyor: Channa asiatica uzman kaynakta 35 cm, 100 × 40 cm taban ve 15–25 °C ile; gökkuşağı yılanbaşı Channa bleheri ise yaklaşık 17–20 cm ve farklı mevsimsel bakım profiliyle tanımlanıyor. Ürün sayfası hangi türün satıldığını açıklamadığı için iki ayrı erişkin ölçeği ve bakım profilinden biri tahminle seçilemez.",
    sourceUrl: "https://www.cikletistpetshop.com/channa-asiatica-gokkusagi-yilanbas-bleheri",
    additionalSourceUrls: ["https://www.seriouslyfish.com/species/channa-asiatica", "https://www.fishbase.se/summary/Channa_asiatica.html", "https://www.seriouslyfish.com/species/channa-bleheri"], verifiedAt: "2026-09-08",
  },
];

const normalizeSearch = (value: string) => value.trim().toLocaleLowerCase("tr-TR").replaceAll("ı", "i").replace(/\s+/g, " ");

export function unresolvedSpeciesForSearch(value: string, category: Livestock["category"], waterType: AquariumType) {
  const query = normalizeSearch(value);
  if (query.length < 3) return undefined;
  const compatible = unresolvedSpeciesListings.filter((item) => item.category === category && item.waterTypes.includes(waterType));
  const names = (item: UnresolvedSpeciesListing) => [item.name, ...(item.aliases ?? [])].map(normalizeSearch);
  return compatible.find((item) => names(item).includes(query)) ?? compatible.find((item) => names(item).some((name) => name.includes(query)));
}
