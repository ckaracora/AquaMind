export type CareProductCategory = "food" | "fertilizer" | "water_conditioner" | "bacteria" | "test" | "filter_media" | "substrate" | "plant_seed" | "treatment" | "decoration" | "aquarium_set" | "aquaterrarium" | "terrarium" | "tank" | "cover" | "cabinet";

export interface CareProductProfile {
  id: string;
  brand: string;
  model: string;
  category: CareProductCategory;
  description: string;
  volumeL?: number;
  dimensionsCm?: [number, number, number];
  footprintCm?: [number, number];
  includedEquipmentModels?: string[];
  sourceUrl: string;
  additionalSourceUrls?: string[];
  verifiedAt: string;
}

const verifiedAt = "2026-08-17";
const tropicalSource = "https://tropical.pl/tropical/products_search";
const tetraFoodSource = "https://www.tetra.net/en-eu/products/nutrition-and-care/aquarium/food";
const tetraCareSource = "https://www.tetra.net/en-eu/products/nutrition-and-care/aquarium/care";
const seraSource = "https://www.sera.de/us/freshwater-aquarium/products/";
const seraWaterSource = "https://www.sera.de/us/freshwater-aquarium/Products/maintain-freshwater-aquariums/water-conditioning/";
const seraTestSource = "https://www.sera.de/us/freshwater-aquarium/Products/maintain-freshwater-aquariums/water-analysis/";
const seraTreatmentSource = "https://www.sera.de/us/freshwater-aquarium/Products/maintain-freshwater-aquariums/treat-diseases/";
const seraPlantSource = "https://www.sera.de/us/freshwater-aquarium/Products/maintain-freshwater-aquariums/plant-care/";
const seraMediaSource = "https://www.sera.de/us/freshwater-aquarium/Products/technical-products-for-freshwater-aquariums/filter-media/";
const seachemSource = "https://www.seachem.com/products.php";
const seachemFreshwaterSource = "https://www.seachem.com/freshwater.php";
const seachemConditionerSource = "https://www.seachem.com/conditioners.php";
const seachemFiltrationSource = "https://www.seachem.com/filtration.php";
const seachemTestingSource = "https://www.seachem.com/water-testing.php";
const seachemMedicationSource = "https://www.seachem.com/medications.php";
const seachemHealthSource = "https://www.seachem.com/appetite-health.php";
const seachemPlantSource = "https://www.seachem.com/planted.php";
const seachemSubstrateSource = "https://www.seachem.com/substrates.php";
const seachemProbioticFoodSource = "https://www.seachem.com/nutridiet.php";
const seachemFoodSource = "https://www.seachem.com/nutridiet-international.php";
const aptSource = "https://www.2hraquarist.com/collections/all";
const shrimpsForeverSource = "https://shrimpsforever.com/";
const masterLineSource = "https://www.acvaristic.ro/";
const dennerleSource = "https://dennerle.com/en/pages/html-sitemap";
const adaFertilizerSource = "https://www.adana.co.jp/en/contents/products/na_liquid/detail01.html";
const adaAdditiveSource = "https://www.adana.co.jp/en/contents/products/na_liquid/detail02.html";
const adaConditionerSource = "https://www.adana.co.jp/en/contents/products/na_liquid/detail03.html";
const adaFoodSource = "https://www.adana.co.jp/en/contents/products/na_food/detail01.html";
const adaSoilSource = "https://www.adana.co.jp/en/contents/products/na_substrate/detail02.html/1000";
const adaPowerSandSource = "https://www.adana.co.jp/en/contents/products/na_substrate/detail01.html/1000";
const adaSubstrateAdditiveSource = "https://www.adana.co.jp/en/contents/products/na_substrate/detail05.html/1000";
const adaTestSource = "https://www.adana.co.jp/en/contents/products/na_condition/detail03.html";
const adaFilterMediaSource = "https://www.adana.co.jp/en/contents/products/na_filter/detail03.html";
const aquaminsSource = "https://atakanpetshop.com/aquamins";

const catalogSlug = (value:string) => value
  .normalize("NFKD")
  .replace(/[ıİ]/g,"i")
  .replace(/[şŞ]/g,"s")
  .replace(/[ğĞ]/g,"g")
  .replace(/[üÜ]/g,"u")
  .replace(/[öÖ]/g,"o")
  .replace(/[çÇ]/g,"c")
  .toLowerCase()
  .replace(/[^a-z0-9]+/g,"-")
  .replace(/(^-|-$)/g,"");

const products = (brand:string, category:CareProductCategory, sourceUrl:string, names:Array<[string,string]>, verifiedDate = verifiedAt): CareProductProfile[] =>
  names.map(([model,description]) => ({ id:catalogSlug(`${brand}-${model}`), brand, model, category, description, sourceUrl, verifiedAt:verifiedDate }));

const aquariumProducts = (
  category:"aquarium_set"|"tank",
  sourceUrl:string,
  entries:Array<[string,number,[number,number,number],string,string[]?]>,
): CareProductProfile[] => entries.map(([model,volumeL,dimensionsCm,description,includedEquipmentModels]) => ({
  id:catalogSlug(`Aquael-${model}`), brand:"Aquael", model, category, description, volumeL, dimensionsCm,
  includedEquipmentModels, sourceUrl, verifiedAt:"2026-09-12",
}));

const dimensionProducts = (
  category:"cover"|"cabinet",
  sourceUrl:string,
  entries:Array<[string,[number,number]|[number,number,number],string]>,
): CareProductProfile[] => entries.map(([model,dimensions,description]) => ({
  id:catalogSlug(`Aquael-${model}`), brand:"Aquael", model, category, description,
  ...(dimensions.length === 3 ? {dimensionsCm:dimensions} : {footprintCm:dimensions}),
  sourceUrl, verifiedAt:"2026-09-12",
}));

const habitatProducts = (
  category:"aquaterrarium"|"terrarium",
  sourceUrl:string,
  entries:Array<[string,[number,number,number],string,string[]?]>,
): CareProductProfile[] => entries.map(([model,dimensionsCm,description,includedEquipmentModels]) => ({
  id:catalogSlug(`Aquael-${model}`), brand:"Aquael", model, category, description, dimensionsCm,
  includedEquipmentModels, sourceUrl, verifiedAt:"2026-09-12",
}));

const volumeProducts = (
  category:"tank",
  sourceUrl:string,
  entries:Array<[string,number,string]>,
): CareProductProfile[] => entries.map(([model,volumeL,description]) => ({
  id:catalogSlug(`Aquael-${model}`), brand:"Aquael", model, category, description, volumeL,
  sourceUrl, verifiedAt:"2026-09-12",
}));

const dennerleProducts = (category:CareProductCategory, entries:Array<[string,string,string]>): CareProductProfile[] =>
  entries.map(([handle,model,description]) => ({
    id:catalogSlug(`Dennerle-${model}`), brand:"Dennerle", model, category, description,
    sourceUrl:`https://dennerle.com/en/products/${handle}`, verifiedAt:"2026-08-27",
  }));

export const careProductCatalog: CareProductProfile[] = [
  ...products("Tetra","food",tetraFoodSource,[
    ["TetraMin Flakes","Tüm süs balıkları için günlük tam pul yem"],
    ["TetraMin Granules","Tüm süs balıkları için yavaş batan günlük tam granül yem"],
    ["TetraMin XL Granules","Büyük süs balıkları için yavaş batan XL granül yem"],
    ["TetraMin XL Flakes","Büyük süs balıkları için XL pul yem"],
    ["TetraMin Mini Granules","Küçük süs balıkları için yavaş batan mini granül yem"],
    ["TetraMin Crisps","Tüm süs balıkları için günlük tam cips yem"],
    ["TetraMin Baby","Boyu 1 cm'ye kadar olan yavru süs balıkları için mikro pul yem"],
    ["TetraMin Junior","Boyu 1 cm üzerindeki genç süs balıkları için mini pul yem"],
    ["Tetra Cichlid Sticks","Cikletler için dengeli tam çubuk yem"],
    ["Tetra Cichlid XL Flakes","Büyük cikletler ve iri süs balıkları için tam pul yem"],
    ["Tetra Rubin Granules","Doğal renk destekli, yavaş batan granül yem"],
    ["Tetra Betta Mini Flakes","Betta balıkları için dengeli mini pul yem"],
    ["Tetra Goldfish Flakes","Japon balıkları için dengeli tam pul yem"],
    ["Tetra Goldfish WaveSticks","Japon balıkları için dalga biçimli yüzen çubuk yem"],
    ["Tetra Cichlid Granules","Orta ve dip katmandan beslenen cikletler için granül yem"],
    ["Tetra Cichlid Colour Mini Pellets","Küçük cikletler için doğal renk destekli mini pelet"],
    ["Tetra Rubin Flakes","Tüm süs balıkları için doğal renk destekli pul yem"],
    ["Tetra Phyll Flakes","Bitkisel bileşenli günlük tam pul yem"],
    ["Tetra Phyll Granules","Bitkisel bileşenli, yavaş batan günlük granül yem"],
    ["Tetra Malawi Flakes","Otçul cikletlerin gereksinimlerine yönelik pul yem"],
    ["Tetra Discus Granules","Discusların beslenme gereksinimlerine yönelik granül yem"],
    ["Tetra Goldfish Granules","Japon ve diğer soğuk su balıkları için yüzen granül yem"],
    ["Tetra Goldfish Colour Sticks","Japon ve diğer soğuk su balıkları için renk destekli çubuk yem"],
    ["Tetra Goldfish Energy Sticks","Japon ve diğer soğuk su balıkları için tam çubuk yem"],
    ["TetraMin XL Crisps","Büyük süs balıkları için XL cips yem"],
    ["Tetra Cichlid Mini Granules","Küçük, orta ve dip katmandan beslenen cikletler için mini granül"],
    ["Tetra Cichlid Shrimp Sticks","Etçil cikletler için krill ve karides içerikli çubuk yem"],
    ["Tetra Cichlid Colour Pellets","Cikletler için doğal renk destekli pelet yem"],
    ["Tetra Cichlid Algae Mini Pellets","Küçük cikletler için alg içerikli mini pelet"],
    ["Tetra Cichlid Algae Pellets","Cikletler için alg içerikli pelet yem"],
    ["Tetra Discus Colour Granules","Discus ve diğer cikletler için renk destekli granül yem"],
    ["Tetra Guppy Mini Flakes","Guppy ve diğer canlı doğuranlar için küçük pul yem"],
    ["Tetra Guppy Colour Mini Flakes","Guppy ve diğer canlı doğuranlar için renk destekli küçük pul yem"],
    ["Tetra Malawi Granules","Otçul cikletler ve Mbuna grubu için granül yem"],
    ["Tetra Delica 4in1 Menu","Pul yem ve dört atıştırmalık seçeneği içeren tam yem menüsü"],
    ["Tetra Delica 4in1 Mix","Artemia, Daphnia, krill ve Gammarus içeren atıştırmalık karışımı"],
    ["Tetra Delica Brine Shrimps","Yüzde yüz bütün, dondurularak kurutulmuş Artemia atıştırmalığı"],
    ["Tetra Delica Daphnia","Yüzde yüz bütün, güneşte kurutulmuş Daphnia atıştırmalığı"],
    ["Tetra Delica Bloodworms","Yüzde yüz bütün, dondurularak kurutulmuş sivrisinek larvası atıştırmalığı"],
    ["Tetra Delica Krill","Yüzde yüz bütün, dondurularak kurutulmuş krill atıştırmalığı"],
    ["Tetra Goldfish Menu","Japon ve soğuk su balıkları için dengeli tam yem karışımı"],
    ["Tetra Wafer Mix","Dip balıkları ve kabuklular için karides ve spirulinalı wafer karışımı"],
    ["Tetra Wafer Mini Mix","Küçük dip balıkları ve kabuklular için mini wafer karışımı"],
    ["Tetra Micro Granules","Küçük ağızlı süs balıkları için yavaş batan mikro granül"],
    ["Tetra Micro Pellets","Küçük ağızlı süs balıkları için yüzen ve yavaş batan mikro pelet"],
    ["Tetra Micro Sticks","Küçük ağızlı süs balıkları için yüzen ve yavaş batan mikro çubuk"],
    ["Tetra Selection","Farklı su katmanları için dört bölmeli tam yem seçkisi"],
    ["Tetra Crusta Menu","Karides ve kerevitler için dört bileşenli tam yem menüsü"],
    ["Tetra Micro Crisps","Küçük süs balıkları için besleyici mikro cips yem"],
    ["Tetra Menu","Farklı su katmanları için dört bölmeli pul yem menüsü"],
    ["Tetra Micro Menu","Küçük süs balıkları ve genç cikletler için dört bileşenli mikro yem"],
    ["Tetra Weekend","Tropikal süs balıkları için dört güne kadar kısa süreli tatil yemi"],
    ["Tetra Crusta Granules","Karides ve kerevitler için dengeli tam granül yem"],
    ["Tetra Crusta Sticks","Karides ve kerevitler için dengeli tam çubuk yem"],
    ["TetraPRO Fertility","Üreme başarısı, yumurta kalitesi ve larva gelişimini destekleyen zerdeçallı premium yem"],
    ["TetraPRO Algae","Bağışıklık desteğine yönelik alg konsantreli premium yem"],
    ["TetraPRO Energy","Canlılık ve kondisyon desteğine yönelik konsantreli premium yem"],
    ["TetraPRO Colour","Doğal renk görünümünü destekleyen konsantreli premium yem"],
    ["TetraPRO Menu","Dört farklı premium tam yemi ayrı bölmelerde sunan menü"],
    ["Tetra Cichlid Crisps","Cikletler için besleyici premium cips yem"],
    ["Tetra TabiMin Tablets","Dipten beslenen ve çekingen balıklar için tablet yem"],
    ["Tetra Pleco Tablets","Otçul ve çekingen dip balıkları için tablet yem"],
    ["Tetra Pleco Tablets XL","Büyük otçul ve çekingen dip balıkları için XL tablet yem"],
    ["Tetra FunTips Tablets","Cama yapışabilen gözlem amaçlı tablet yem"],
  ],"2026-09-25"),
  ...products("Tetra","treatment",tetraCareSource,[
    ["Tetra Medica GeneralTonic Plus","Tatlı su balıklarındaki yaygın bakteriyel ve dış parazit kaynaklı hastalıklar için üretici talimatıyla kullanılan ilaç"],
    ["Tetra Medica FungiStop Plus","Tatlı su balıklarında mantar, yumurta mantarı ve bazı dış bakteriyel enfeksiyonlar için üretici talimatıyla kullanılan ilaç"],
    ["Tetra Medica ContraIck Plus","Beyaz benek ve bazı deri/solungaç parazitleri için üretici talimatıyla kullanılan ilaç"],
    ["Tetra AlguMin","Tatlı su akvaryumlarında alg kontrolü için sıvı ürün"],
    ["Tetra Algetten","40 litreye kadar tatlı su akvaryumlarında yavaş salınımlı alg kontrol ürünü"],
    ["Tetra Algizit","Tatlı su akvaryumlarında inatçı alg türlerine yönelik tablet ürün"],
    ["Tetra AlgoStop depot","40 litre ve üzeri tatlı su akvaryumlarında yaklaşık dört haftalık yavaş salınımlı alg önleyici"],
  ],"2026-09-25"),
  ...products("Tetra","water_conditioner",tetraCareSource,[
    ["Tetra VitaMinPro 3in1","Tatlı su canlıları ve bitkileri için vitamin, iz element, mineral ve probiyotik içeren su bakım sıvısı"],
    ["Tetra AquaSafe","Musluk suyunu balıklar için hazırlayan ve su değişimi stresini azaltmaya yardımcı su düzenleyici"],
    ["Tetra EasyBalance","pH ve KH kararlılığı ile nitrat/fosfat kontrolüne yardımcı su bakım ürünü"],
    ["Tetra CrystalWater","Sudaki küçük kir parçacıklarını filtrelenebilir kümeler hâlinde bağlayan berraklaştırıcı"],
    ["Tetra NitrateMinus","Tatlı su akvaryumlarında nitratı biyolojik yolla azaltmaya yardımcı ürün"],
    ["Tetra PhosphateMinus","Akvaryum suyundaki fazla fosfatı azaltmaya yönelik ürün"],
    ["Tetra pH/KH Minus","KH değerini ve buna bağlı olarak pH seviyesini kontrollü düşürmeye yönelik ürün"],
    ["Tetra pH/KH Plus","KH değerini kontrollü yükseltip pH tamponlamaya yönelik ürün"],
    ["Tetra Goldfish AquaSafe","Musluk suyunu Japon balıkları için hazırlamaya yönelik su düzenleyici"],
    ["Tetra ToruMin","Tropikal habitatları taklit eden siyah su koşulları oluşturmaya yardımcı torf özlü düzenleyici"],
    ["Tetra Vital","Tatlı su balıkları için vitamin ve iz element desteği"],
    ["Tetra Wasserpflege Plus","Yalnız Almanca pazarda listelenen su bakım ürünü; kullanım bilgisi için üretici etiketine bakılmalıdır"],
    ["Tetra NitrateMinus Pearls","Tabanda uzun süreli biyolojik nitrat azaltımını destekleyen inciler"],
  ],"2026-09-25"),
  ...products("Tetra","bacteria",tetraCareSource,[
    ["Tetra Bactozym","Filtre medyasında yararlı bakteri kolonizasyonunu destekleyen bakteri sporlu tablet"],
    ["Tetra FilterActive Bacteria","Filtre biyolojisini ve organik atık parçalanmasını destekleyen canlı bakteri karışımı"],
    ["Tetra SafeStart Bacteria","Yeni akvaryum başlangıcında biyolojik döngüyü destekleyen canlı bakteri karışımı"],
    ["Tetra Biocoryn Bacteria","Tatlı ve deniz akvaryumlarında organik atık parçalanmasını destekleyen canlı bakteri ürünü"],
  ],"2026-09-25"),
  ...products("Tetra","test",tetraCareSource,[
    ["Tetra Test 7in1","pH, KH, GH, NO2, NO3, Cl2 ve CO2 için yedi parametreli şerit test"],
    ["Tetra Test pH","Akvaryum veya süs havuzu suyunun pH değerini ölçen test"],
    ["Tetra Test NO2-","Tatlı su, deniz akvaryumu ve süs havuzunda nitrit ölçen test"],
    ["Tetra Test NO3-","Tatlı su, deniz akvaryumu ve süs havuzunda nitrat ölçen test"],
  ],"2026-09-25"),
  ...products("Tetra","fertilizer",tetraCareSource,[
    ["Tetra CO2 Optimat Set","Akvaryum bitkileri için kullanıma hazır basmalı CO2 gübreleme seti"],
    ["Tetra CO2 Optimat Refill","Tetra CO2 Optimat Set için yedek CO2 şişesi"],
    ["Tetra CO2 Plus","Ek donanım gerektirmeden yedi güne kadar biyolojik CO2 salımını destekleyen sıvı ürün"],
    ["Tetra Crypto","Kökten beslenen akvaryum bitkileri için uzun etkili tablet gübre"],
    ["Tetra PlantaStart","Dikim ve yeniden dikim sonrasında kök oluşumunu destekleyen bitki ürünü"],
    ["Tetra PlantaMin","Yapraklardan demir ve temel besin sağlayan, 30 güne kadar etkili sıvı bitki gübresi"],
  ],"2026-09-25"),
  ...products("Tetra","substrate",tetraCareSource,[
    ["Tetra ActiveSubstrate","Bitki kökleri için geniş yüzeyli, su değerlerini değiştirmeyen doğal kil granüllü taban"],
    ["Tetra CompleteSubstrate","Güçlü akvaryum bitkileri için uzun etkili besin içeren taban malzemesi"],
  ],"2026-09-25"),
  ...products("Tropical","food",tropicalSource,[
    ["Supervit Flakes","Günlük çok bileşenli pul yem"], ["Supervit Mini Flakes","Küçük balıklar ve yavrular için mini pul yem"],
    ["Supervit Tablets A","Cama yapışan çok bileşenli tablet yem"], ["Supervit Tablets B","Dibe batan çok bileşenli tablet yem"],
    ["3-Algae Flakes","Üç alg içeren bitkisel pul yem"], ["Hi-Algae Discs","Vatoz ve karidesler için algli batan disk"],
    ["Hi-Algae Discs XXL","Büyük dip balıkları için algli disk"], ["Hi-Protein Discs XXL","Etçil büyük dip balıkları için proteinli disk"],
    ["Vitality & Color Flakes","Renk ve kondisyon destekli pul yem"], ["Vitality & Color Granules","Renk ve kondisyon destekli granül yem"],
    ["Spirulina Super Forte","Yüksek spirulina içerikli bitkisel yem"], ["Cichlid Gran","Cichlidler için granül yem"],
    ["Supervit Granulat","Orta ve dip katmandan beslenen balıklar için batan çok bileşenli granül yem"],
    ["Supervit Mini Granulat","Küçük balıklar ve yavrular için yavaş batan mini granül yem"],
    ["Supervit Chips","Orta ve büyük boy balıklar için batan çok bileşenli cips yem"],
    ["Vitality & Color Tablets","Cama yapıştırılabilen renk ve kondisyon destekli tablet yem"],
    ["Super Spirulina Forte Granulat","Yüksek spirulina içerikli bitkisel granül yem"],
    ["Super Spirulina Forte Mini Granulat","Küçük balıklar için yüksek spirulina içerikli mini granül yem"],
    ["Super Spirulina Forte Micro Granulat","Yavru ve nano balıklar için yüksek spirulina içerikli mikro granül yem"],
    ["3-Algae Tablets B","Dipten beslenen balıklar için üç alg içeren batan tablet yem"],
    ["D-Allio Plus","Sarımsak içeren, sindirim ve kondisyon destekli pul yem"],
    ["Malawi","Mbuna ve diğer otçul Malawi cikletleri için bitkisel ağırlıklı pul yem"],
    ["Tanganyika","Tanganika Gölü'nün etçil ve hepçil cikletleri için temel pul yem"],
    ["Tanganyika Chips","Tanganika cikletleri için batan cips yem"],
    ["Cichlid Spirulina Medium Sticks","Orta boy otçul cikletler için spirulinalı yüzen çubuk yem"],
    ["Cichlid Color XXL","Büyük cikletler için protein ve renk destekli yüzen çubuk yem"],
    ["Mini Wafers Mix","Küçük dip balıkları için kırmızı ve yeşil batan wafer karışımı"],
    ["Green Algae Wafers","Otçul Loricariidae türleri için spirulinalı batan wafer yem"],
    ["Pleco's Tablets","Büyük vatozlar için bitkisel batan tablet yem"],
    ["Welsi Gran","Kir, piskor ve diğer dip balıkları için batan granül yem"],
    ["Carnivore","Etçil dip balıkları için yüksek proteinli batan granül yem"],
    ["Shrimp Sticks","Tatlı ve deniz suyu kabukluları için batan çubuk yem"],
    ["Crusta Sticks","Karides ve kerevitler için kalsiyum destekli batan çubuk yem"],
    ["Caridina Nano Sticks","Cüce karidesler için kalsiyum destekli mikro çubuk yem"],
    ["Mikro-Vit Basic","Akvaryum balığı yavruları için çok bileşenli temel mikro yem"],
    ["Mikro-Vit Hi-Protein","Yavrular için yumurta sarılı yüksek proteinli mikro yem"],
    ["Mikro-Vit Spirulina","Yavrular için spirulina katkılı mikro yem"],
    ["Mikro-Vit Vegetable","Otçul balık yavruları için bitkisel mikro yem"],
    ["Nanovit Granulat","Nano balıklar için küçük taneli batan granül yem"],
    ["Shrimp-UP!","Karideslerde kabuk gelişimi ve renklenmeyi destekleyen batan yem"],
    ["Gel Formula For Herbivorous Fish","Otçul ve hepçil balıklar için evde hazırlanan alg ağırlıklı jel yem"],
    ["Gel Formula For Carnivorous Fish","Etçil balıklar için evde hazırlanan yüksek proteinli jel yem"],
    ["Herbs & Vegetables","Tatlı su karidesleri için ot, yaprak ve sebze içerikli superfood yem"],
    ["Leaves & Flowers","Tatlı su karidesleri için yaprak ve çiçek karışımlı superfood yem"],
    ["Betta","Betta ve küçük labirent balıkları için günlük pul yem"],
    ["Betta Granulat","Betta balıkları için kırmızı mikroalgli yüzen granül yem"],
    ["Guppy","Guppy ve diğer canlı doğuranlar için çok bileşenli pul yem"],
    ["Bio-Vit","Otçul ve hepçil balıklar için bitkisel günlük pul yem"],
    ["Ichtio-Vit","Genel akvaryumlardaki hepçil balıklar için günlük pul yem"],
    ["Ovo-Vit","Yumurta sarısı kaynaklı protein ve lesitin içeren kondisyon pul yemi"],
    ["Tropical Flakes","Hepçil ve etçil balıklar için yüksek proteinli günlük pul yem"],
    ["Tropical Granulat","Hepçil ve etçil balıklar için yüksek proteinli günlük granül yem"],
    ["Hobby Mix","Küçük canlı doğuranlar ve barblar için çok bileşenli pul yem"],
    ["Kirysek","Corydoras, loach ve küçük yayın balıkları için batan granül yem"],
    ["Breeder Mix","Profesyonel üretim ve satış akvaryumları için çok bileşenli pul yem"],
    ["Vitabin Vegetable","Küçük otçul ve dip balıkları için bitkisel yapışan tablet yem"],
    ["Vitabin Multi-Ingredient","Küçük hepçil ve dip balıkları için çok bileşenli yapışan tablet yem"],
  ]),
  ...products("Tropical","fertilizer","https://tropical.pl/tropical/products_line_details/grupa-zielona",[
    ["Aqua Plant","Balık yükü düşük bitkili akvaryumlar için NPK makro besin gübresi"],
    ["Multimineral","Balıklar ve su bitkileri için iz element desteği"],
    ["Aquaflorin Potassium","Potasyum eksikliğine yönelik potasyum ve mikro element gübresi"],
    ["Ferro-Aktiv","Su bitkileri için biyoyararlanılabilir şelatlı demir gübresi"],
    ["Kobaltosan","Balık ve bitkilerde büyüme ile renklenmeyi destekleyen kobalt katkısı"],
    ["Carbo","Su bitkileri için organik karbon gübresi"],
  ]),
  ...products("Sera","food",seraSource,[
    ["Vipan Tropical Flakes","Yüzeyden beslenen balıklar için temel pul yem"], ["Vipan Tropical Flakes XL","Büyük balıklar için temel pul yem"],
    ["Vipagran Tropical Granules","Orta su katmanı için temel granül yem"], ["Vipachips Tropical Wafers","Dip balıkları için temel wafer"],
    ["Insect Granules","Böcek proteini içeren temel granül"], ["Immune Probiotic Granules","Büyüme ve bağışıklık destekli probiyotik granül"],
    ["San Color Flakes","Renk destekleyici pul yem"], ["San Color Granules","Renk destekleyici granül yem"],
    ["Betta Granules","Betta balıkları için temel granül"], ["Flora Flakes","Bitkisel pul yem"],
    ["Veggie Granules","Bitkisel granül yem"], ["Spirulina Tabs","Bitkisel yapışan tablet yem"],
    ["Immune Probiotic Granules XS","5 cm altındaki balıklar için probiyotik büyüme ve bağışıklık granülü"],
    ["Plankton Color Tabs","Dipten beslenen balıklar için planktonlu renk destek tableti"],
    ["Guppy Granules","Guppy ve diğer canlı doğuranlar için renk destekli temel granül"],
    ["O-Nip Stickies","Cama yapışan, hayvansal ve bitkisel bileşenli ödül tableti"],
    ["Daphnia Snack","Yüzde yüz doğal kurutulmuş su piresi ödül yemi"],
    ["Artemia FD Snack","Yüzde yüz dondurularak kurutulmuş Artemia ödül yemi"],
    ["Bloodworms FD Snack","Yüzde yüz dondurularak kurutulmuş kan kurdu ödül yemi"],
    ["Mixpur FD Snack","Dondurularak kurutulmuş yem organizmaları karışımı"],
    ["Tubifex FD Snack","Yüzde yüz dondurularak kurutulmuş Tubifex ödül yemi"],
    ["GVG Mix Royal Flakes","Dondurularak kurutulmuş parçalar içeren temel pul yem"],
    ["Krill FD Snack","Yüzde yüz dondurularak kurutulmuş krill ödül yemi"],
    ["Pleco Chips","Ancistrus ve diğer vatozlar için temel batan cips yem"],
    ["Pleco Tabs XL","Büyük yayın balıkları ve vatozlar için büyük batan tablet yem"],
    ["Viformo Pleco Tabs","Yayın balıkları ve loach türleri için temel batan tablet yem"],
    ["Cichlid Sticks","Cikletler için yüzen temel çubuk yem"],
    ["Cichlid Carnivore Granules XL","Büyük etçil cikletler için temel granül yem"],
    ["Cichlid Herbivore Granules XL","Büyük otçul cikletler için temel granül yem"],
    ["Cichlid Malawi Granules","Otçul ve hepçil Malawi cikletleri için temel granül yem"],
    ["Cichlid Tanganyika Granules","Etçil Tanganika cikletleri için temel granül yem"],
    ["Arowana Pellets","Arowana türleri için yüzen temel pelet yem"],
    ["Red Parrot Pellets","Papağan cikletleri için temel pelet yem"],
    ["Discus Granules","Discus balıkları için temel granül yem"],
    ["Discus Color Granules","Discus balıkları için renk destekli granül yem"],
    ["Discus Probiotic Granules","Discus için probiyotik büyüme ve bağışıklık granülü"],
    ["Goldfish Flakes","Küçük Japon balıkları için temel pul yem"],
    ["Goldfish Granules","Büyük Japon balıkları için temel granül yem"],
    ["Goldfish Color Granules","Japon balıkları için renk destekli granül yem"],
    ["Shrimp Granules","Tatlı su karidesleri için temel batan granül yem"],
    ["Crab Loops","Yengeç ve diğer kabuklular için temel halka yem"],
    ["Vipan Baby Flakes","Yüzeyden beslenen yavru balıklar için mikro pul yem"],
    ["Vipagran Baby Granules","Orta su katmanından beslenen yavrular için mikro granül yem"],
    ["Micron Powder","Balık yavruları ve amfibi larvaları için toz büyütme yemi"],
    ["Axolotl Wafers","Aksolotllar için temel batan wafer yem"],
    ["Holiday Tabs","Tatil döneminde balıklar için yavaş tüketilen tablet yem"],
    ["Fish Vitamin Mix","Balık yemine eklenen vitamin desteği"],
  ]),
  ...products("Sera","water_conditioner",seraSource,[
    ["aquatan","Klor, kloramin ve ağır metalleri bağlayan su düzenleyici"], ["toxivec","Acil kirletici bağlayıcı"],
    ["mineral salt","Osmos ve mineralce fakir su için mineral karışımı"], ["KH/pH-plus","KH ve pH yükseltici"],
    ["pH/KH-minus","pH ve KH düşürücü"], ["phosvec clear","Fosfat ve bulanıklık giderici"],
  ]),
  ...products("Sera","bacteria",seraSource,[["bio nitrivec","Biyolojik denge için nitrifikasyon bakteri kültürü"], ["filter biostart","Filtre başlangıç bakteri kültürü"]]),
  ...products("Sera","water_conditioner",seraWaterSource,[
    ["GH/KH-plus","Genel ve karbonat sertliğini birlikte yükselten mineral karışımı"],
    ["super peat","Hümik asit salarak doğal siyah su koşulları oluşturan torf granülü"],
    ["goldy aquatan","Japon balıkları için mineral destekli musluk suyu düzenleyici"],
    ["betta aquatan","Betta balıkları için mineral destekli musluk suyu düzenleyici"],
    ["shrimp mineral salt","Karidesler ve diğer omurgasızlar için mineral ve iz element karışımı"],
    ["Catappa Leaves","Doğal su düzenleme için tropik badem yaprakları"],
    ["blackwater aquatan","Tropik karasu etkisi ve hümik madde desteği sağlayan su düzenleyici"],
    ["Nitrite-minus","Acil nitrit yükselmesinde nitriti hızla düşürmeye yardımcı düzenleyici"],
    ["chlor-ex","Klor ve kloramini gideren su düzenleyici"],
    ["O2 plus","Düşük oksijen durumlarında oksijen desteği sağlayan bakım ürünü"],
  ]),
  ...products("Sera","test",seraTestSource,[
    ["7in1 Quick Test","pH, KH, GH, nitrat, nitrit, klor ve CO₂ için hızlı şerit test"],
    ["pH Test","pH değerini ölçen damlalı test"], ["KH Test","Karbonat sertliğini ölçen damlalı test"],
    ["GH Test","Toplam sertliği ölçen damlalı test"], ["Ammonia Test","Amonyum ve amonyak ölçüm testi"],
    ["Nitrite Test","Nitrit ölçüm testi"], ["Nitrate Test","Nitrat ölçüm testi"],
    ["Phosphate Test","Fosfat ölçüm testi"], ["Iron Test","Demir ölçüm testi"],
    ["Oxygen Test","Çözünmüş oksijen ölçüm testi"], ["Chlorine Test","Klor ölçüm testi"],
    ["Calcium Test","Kalsiyum düzeyini 20 mg/L adımlarla ölçen test"],
  ]),
  ...products("Sera","fertilizer",seraPlantSource,[
    ["florena","Yapraklardan beslenen bitkiler için sıvı temel gübre"],
    ["florenette","Kök bölgesinde yavaş salınımlı besin sağlayan tablet gübre"],
    ["flore 1 carbo","Bitkili akvaryum için sıvı karbon desteği"],
    ["flore 2 ferro","Bitkiler için ilave demir desteği"],
    ["flore 3 vital","Bitkilerin dayanıklılığını destekleyen iz element ve bakım ürünü"],
    ["flore 4 plant","Canlı yükü düşük bitkili akvaryumlar için makro besin desteği"],
  ]),
  ...products("Sera","filter_media",seraMediaSource,[
    ["siporax Professional 15 mm","Biyolojik filtrasyon için gözenekli halka medya"],
    ["siporax mini Professional","Küçük akvaryum filtreleri için biyolojik medya"],
    ["siporax Nitrate-minus Professional","Biyolojik nitrat azaltımını destekleyen filtre medyası"],
    ["siporax algovec Professional","Biyolojik fosfat azaltımını destekleyen filtre medyası"],
    ["siporax bio active Professional","Bakteri kültürüyle etkinleştirilmiş biyolojik filtre medyası"],
    ["crystal clear Professional","İnce parçacıkları tutan yüksek performanslı mekanik medya"],
    ["Phosvec Granulat","Fosfatı kalıcı olarak bağlayan granül filtre medyası"],
    ["biopur","Biyomekanik filtrasyon için seramik filtre medyası"],
    ["biofibres fine","Mekanik ön filtrasyon için ince filtre elyafı"],
    ["biofibres coarse","Mekanik ön filtrasyon için kalın filtre elyafı"],
    ["Silicate Clear","Silikatı kalıcı olarak bağlayan filtre medyası"],
    ["super carbon","Organik kirleticileri adsorbe eden aktif karbon"],
    ["Filter Wool Fine","İnce mekanik filtrasyon elyafı"],
    ["Filter Wool Coarse","Kaba mekanik filtrasyon elyafı"],
    ["filter wool","İnce kir parçacıkları için mekanik ön filtre elyafı"],
  ]),
  ...products("Sera","treatment",seraTreatmentSource,[
    ["Phyto med Mycozid","Erken evre dış mantar ve yumurta mantarına karşı bitkisel tedavi"],
    ["Phyto med Catappa","Dış mantar, bakteri ve parazitlere karşı bitkisel tedavi"],
    ["Phyto med Tremazid","Deri ve solungaç kurtlarına karşı bitkisel tedavi"],
    ["Phyto med Protazid","Beyaz benek ve tek hücreli deri parazitlerine karşı bitkisel tedavi"],
    ["Phyto med Baktazid","Deri ve solungaçlardaki dış bakteriyel enfeksiyonlara karşı bitkisel tedavi"],
    ["ectopur","Hastalık ve stres dönemlerinde oksijen ve tuz desteği"],
    ["med Professional Protazol","Beyaz benek ve tek hücreli deri parazitlerine karşı tedavi"],
    ["med Professional Tremazol","Deri-solungaç kurtları ve tenyaya karşı tedavi"],
    ["med Professional Nematol","Camallanus, Capillaria ve diğer nematodlara karşı tedavi"],
    ["omnipur A","Yaygın tatlı su balığı hastalıklarına karşı geniş spektrumlu tedavi"],
    ["costapur","Beyaz benek ve diğer tek hücreli deri parazitlerine karşı tedavi"],
    ["mycopur","Mantar enfeksiyonlarına karşı tedavi"],
    ["baktopur","Ağız ve yüzgeç çürümesi gibi bakteriyel enfeksiyonlara karşı tedavi"],
    ["baktopur direct","Bakteriyel enfeksiyonlara karşı tablet tedavi"],
    ["bakto Tabs","Bakteriyel enfeksiyonlara karşı ilaçlı yem tableti"],
  ]),
  ...products("Sera","substrate","https://www.sera.de/us/freshwater-aquarium/Products/maintain-freshwater-aquariums/bottom-ground/",[
    ["Aquarium Gravel Floredepot Substrate","Bitki kökleri için uzun süreli besin sağlayan taban altı katmanı"],
    ["Aquarium Gravel Lava Substrate","2–8 mm iri ve gözenekli doğal lav tabanı"],
    ["Aquarium Gravel Anthracite Fine","1–2 mm antrasit renkli doğal ince çakıl"],
    ["Aquarium Gravel Brown Fine","0–2 mm kahverengi ince doğal kum karışımı"],
    ["Aquarium Gravel Ocher Fine","0–2 mm okra renkli ince doğal kum"],
    ["Aquarium Gravel White Fine","0–2 mm tatlı ve deniz suyu için beyaz ince kum"],
    ["Aquarium Gravel Anthracite Coarse","1–3 mm antrasit renkli doğal iri çakıl"],
    ["Aquarium Gravel Beige Coarse","2–6 mm bej renkli doğal iri çakıl"],
    ["Aquarium Gravel Black Coarse","2–3 mm siyah iri akvaryum çakılı"],
    ["Aquarium Gravel Mix Coarse","2–8 mm çok renkli iri dekoratif çakıl"],
    ["Aquarium Gravel White Coarse","1–3 mm beyaz doğal iri çakıl"],
  ]),
  ...products("Seachem","water_conditioner",seachemSource,[
    ["Prime","Klor, kloramin ve amonyak detoksifikasyonu için konsantre düzenleyici"], ["Safe","Toz formda konsantre su düzenleyici"],
    ["Pristine","Organik atık kontrolüne yardımcı bakteri desteği"], ["Clarity","Tatlı ve tuzlu su için berraklaştırıcı"],
    ["Equilibrium","Bitkili akvaryumlar için GH mineral desteği"], ["Acid Buffer","Karbonat sertliği ve pH düşürme desteği"],
    ["Alkaline Buffer","KH ve pH yükseltme desteği"],
  ]),
  ...products("Seachem","water_conditioner",seachemConditionerSource,[
    ["AmGuard","Acil durumlarda serbest amonyağı bağlayan konsantre düzenleyici"],
    ["Replenish","RO/DI ve mineralce fakir tatlı suda genel sertliği geri kazandıran mineral karışımı"],
    ["StressGuard","Taşıma ve yaralanma dönemlerinde koruyucu slime coat ve stres desteği"],
    ["Axolotl Conditioner","Aksolotl akvaryumları için klor, kloramin ve amonyak detoksifikasyonu"],
    ["Betta Basics","Betta akvaryumlarında suyu düzenleyen ve pH'ı tamponlayan bakım ürünü"],
    ["Gold Basics","Japon balığı akvaryumlarında suyu düzenleyen ve pH'ı tamponlayan bakım ürünü"],
    ["SureStart","Prime, Stability ve Clarity içeren yeni akvaryum başlangıç paketi"],
  ]),
  ...products("Seachem","water_conditioner",seachemFreshwaterSource,[
    ["Acid Regulator","Tatlı suda pH'ı asidik aralığa düşüren fosfat tamponu"],
    ["Alkaline Regulator","Tatlı suda pH'ı alkali aralığa yükselten fosfat tamponu"],
    ["American Cichlid Salt","Orta ve Güney Amerika cikletleri için mineral ve iz element karışımı"],
    ["Arowana Buffer","Arowana akvaryumlarında uygun pH ve mineral dengesini destekleyen tampon"],
    ["Axolotl Buffer","Aksolotl akvaryumlarında uygun mineral ve tampon dengesini destekleyen karışım"],
    ["Brackish Salt","Acı su akvaryumları için mineral tuz karışımı"],
    ["Cichlid Lake Salt","Afrika göl cikletleri için mineral tuz karışımı"],
    ["Cichlid Trace","Ciklet akvaryumları için iz element desteği"],
    ["Discus Buffer","Discus akvaryumlarında pH'ı asidik aralığa düşüren tampon"],
    ["Discus Trace","Discus akvaryumları için iz element desteği"],
    ["Fresh Trace","Tatlı su balıkları için iz element desteği"],
    ["Gold Buffer","Japon balığı akvaryumlarında pH ve mineral dengesini destekleyen tampon"],
    ["Gold Salt","Japon balıkları için mineral tuz karışımı"],
    ["Gold Trace","Japon balığı akvaryumları için iz element desteği"],
    ["Malawi/Victoria Buffer","Malawi ve Victoria gölü cikletleri için pH ve KH tamponu"],
    ["Neutral Regulator","Tatlı suda pH'ı 7,0 civarında sabitleyen fosfat tamponu"],
    ["Liquid Neutral Regulator","Tatlı suda pH'ı nötr aralıkta tutmaya yardımcı sıvı tampon"],
    ["Tanganyika Buffer","Tanganika gölü cikletleri için pH ve KH tamponu"],
  ]),
  ...products("Seachem","bacteria",seachemSource,[["Stability","Yeni akvaryum ve biyofiltre için bakteri kültürü"]]),
  ...products("Seachem","fertilizer",seachemSource,[
    ["Flourish","Bitkili akvaryum için kapsamlı mikro element desteği"], ["Flourish Excel","Biyoyararlanılabilir organik karbon desteği"],
    ["Flourish Nitrogen","Azot desteği"], ["Flourish Phosphorus","Fosfor desteği"], ["Flourish Potassium","Potasyum desteği"],
    ["Flourish Iron","Demir desteği"], ["Flourish Trace","İz element desteği"], ["Flourish Tabs","Kök bölgesi besin tableti"],
  ]),
  ...products("Seachem","fertilizer",seachemPlantSource,[
    ["Flourish Advance","Kök ve sürgün gelişimini destekleyen biyolojik bitki takviyesi"],
    ["Plant Pack Fundamentals","Flourish, Flourish Excel ve Flourish Iron içeren temel bitki bakım paketi"],
    ["Plant Pack Enhancer NPK","Flourish Nitrogen, Phosphorus ve Potassium içeren makro besin paketi"],
  ]),
  ...products("Seachem","filter_media",seachemSource,[
    ["Matrix","Gözenekli biyolojik filtre medyası"], ["Purigen","Organik atık tutucu sentetik filtre medyası"], ["De*Nitrate","Nitrat kontrolü için gözenekli medya"],
  ]),
  ...products("Seachem","filter_media",seachemFiltrationSource,[
    ["CupriSorb","Bakır ve ağır metalleri seçici olarak tutan filtre medyası"],
    ["HyperSorb","Organik atık ve renklenmeyi tutan sentetik adsorban"],
    ["MatrixCarbon","Düşük fosfatlı küresel aktif karbon"],
    ["PhosBond","Fosfat ve silikatı bağlayan alüminyum oksit-demir oksit karışımı medya"],
    ["PhosGuard","Fosfat ve silikatı hızla bağlayan filtre medyası"],
    ["PhosNet","Fosfatı bağlayan yüksek kapasiteli granüler demir oksit medya"],
    ["Renew","Fosfat salmayan, daha yumuşak etkili karbon alternatifi filtre medyası"],
    ["SeaGel","MatrixCarbon ve PhosGuard birleşimi organik-fosfat filtre medyası"],
    ["Zeolite","Tatlı suda amonyağı bağlayan doğal zeolit filtre medyası"],
  ]),
  ...products("Seachem","test",seachemTestingSource,[
    ["Ammonia Alert","Serbest amonyağı sürekli izleyen akvaryum içi renkli sensör"],
    ["pH Alert","Tatlı suda pH değerini sürekli izleyen akvaryum içi renkli sensör"],
    ["Alert Combo","Ammonia Alert ve pH Alert içeren sürekli izleme paketi"],
    ["One Year Alert Combo","Bir yıla kadar sürekli pH ve serbest amonyak izleme paketi"],
    ["MultiTest Ammonia","Toplam ve serbest amonyak ölçüm kiti"],
    ["MultiTest Copper","Bakır düzeyini ölçen test kiti"],
    ["MultiTest Iron","Tatlı ve tuzlu suda demir ölçüm kiti"],
    ["MultiTest Nitrite/Nitrate","Nitrit ve nitrat ölçüm kiti"],
    ["MultiTest Phosphate","Fosfat ölçüm kiti"],
    ["MultiTest Silicate","Silikat ölçüm kiti"],
  ]),
  ...products("Seachem","treatment",seachemMedicationSource,[
    ["Cupramine","Bakır bazlı parazit tedavisi; omurgasız bulunan tanklarda kullanılmamalı"],
    ["Focus","İlaçların yeme bağlanmasına yardımcı antibakteriyel polimer"],
    ["KanaPlex","Bakteriyel ve bazı fungal enfeksiyonlar için kanamisin bazlı ilaç"],
    ["MetroPlex","Protozoan ve anaerobik bakteriyel sorunlar için metronidazol bazlı ilaç"],
    ["NeoPlex","Dış bakteriyel enfeksiyonlar için neomisin bazlı ilaç"],
    ["ParaGuard","Dış parazit, fungal ve bakteriyel lezyonlara yönelik aldehit bazlı tedavi"],
    ["PolyGuard","Birden fazla etkenin şüpheli olduğu durumlar için geniş spektrumlu ilaç"],
    ["SulfaPlex","Bakteriyel, fungal ve bazı protozoan sorunlar için sülfatiasol bazlı ilaç"],
  ]),
  ...products("Seachem","food",seachemHealthSource,[
    ["Entice","Yem kabulünü artırmaya yardımcı koku ve tat destek ürünü"],
    ["GarlicGuard","Sarımsak özlü iştah ve yem desteği"],
    ["Nourish","Tatlı ve tuzlu su balıkları için vitamin, aminoasit ve iz element desteği"],
    ["Vitality","Balık yemi için vitamin, aminoasit ve iz element desteği"],
  ]),
  ...products("Seachem","food",seachemProbioticFoodSource,[
    ["NutriDiet Chlorella Probiotics Formula","Otçul balıklar için chlorella ve probiyotik içeren pul yem"],
    ["NutriDiet Cichlid Probiotics Formula","Cikletler için probiyotik içeren pul yem"],
    ["NutriDiet Discus Probiotics Formula","Discus için probiyotik içeren pul yem"],
    ["NutriDiet Goldfish Probiotics Formula","Japon balıkları için probiyotik içeren pul yem"],
    ["NutriDiet Shrimp Probiotics Formula","Karides içerikli, probiyotik destekli pul yem"],
    ["NutriDiet Tropical Probiotics Formula","Tropikal balıklar için probiyotik içeren pul yem"],
    ["NutriDiet Worm Flakes Probiotics Formula","Solucan proteinli ve probiyotik destekli pul yem"],
  ]),
  ...products("Seachem","food",seachemFoodSource,[
    ["NutriDiet Betta","Betta balıkları için temel yem"],
    ["NutriDiet Chlorella","Otçul balıklar için chlorella içerikli pul yem"],
    ["NutriDiet Cichlid","Cikletler için temel pul yem"],
    ["NutriDiet Discus","Discus balıkları için temel pul yem"],
    ["NutriDiet Goldfish","Japon balıkları için temel pul yem"],
    ["NutriDiet Shrimp","Karides içerikli tropikal balık yemi"],
    ["NutriDiet Tropical","Tropikal balıklar için temel pul yem"],
    ["NutriDiet Vacation Tabs","Tatil dönemleri için yavaş tüketilen tablet yem"],
    ["NutriDiet Herbivore Tabs","Otçul dip balıkları için batan tablet yem"],
  ]),
  ...products("Seachem","substrate",seachemSubstrateSource,[
    ["Flourite","Bitkili akvaryumlar için gözenekli kil çakılı"],
    ["Flourite Black","Bitkili akvaryumlar için siyah gözenekli kil çakılı"],
    ["Flourite Black Sand","Bitkili akvaryumlar için siyah ince kil kumu"],
    ["Flourite Dark","Bitkili akvaryumlar için koyu renkli gözenekli kil çakılı"],
    ["Flourite Red","Bitkili akvaryumlar için kırmızı gözenekli kil çakılı"],
    ["Onyx Sand","Bitkili ve alkali su akvaryumları için karbonatlı gri kum"],
    ["Onyx","Bitkili ve alkali su akvaryumları için karbonatlı gri çakıl"],
    ["Gray Coast","Alkali su ve ciklet akvaryumları için kalsiyum-magnezyum içerikli çakıl"],
  ]),
  ...products("Seachem","test",seachemPlantSource,[
    ["CO2 Indicator Solution","Drop checker ile çözünmüş CO₂ düzeyini renk üzerinden izleyen gösterge sıvısı"],
  ]),
  ...products("Tropica","fertilizer","https://tropica.com/en/plant-care/liquid-fertilisers/premium-nutrition/",[["Premium Nutrition","Az veya yavaş büyüyen bitkili akvaryumlar için azot ve fosfor içermeyen mikro elementli sıvı gübre"]],"2026-08-26"),
  ...products("Tropica","fertilizer","https://tropica.com/en/plant-care/liquid-fertilisers/specialised-nutrition/",[["Specialised Nutrition","Yoğun bitkili akvaryumlar için azot, fosfor, demir, magnezyum ve mikro elementli sıvı gübre"]],"2026-08-26"),
  ...products("Tropica","fertilizer","https://tropica.com/en/plant-care/liquid-fertilisers/carbon-nutrition/",[["Carbon Nutrition","Bitkiler için günlük sıvı karbon desteği"]],"2026-08-26"),
  ...products("Tropica","fertilizer","https://tropica.com/en/plant-care/nutrition-capsules/",[["Nutrition Capsules","Kökten beslenen bitkiler için yavaş salınımlı besin kapsülü"]],"2026-08-26"),
  ...products("Tropica","water_conditioner","https://tropica.com/en/plant-care/liquid-fertilisers/water-conditioner/",[["Water Conditioner","Musluk suyundaki kloru etkisizleştiren ve ağır metalleri bağlayan su düzenleyici"]],"2026-08-26"),
  ...products("Tropica","substrate","https://tropica.com/en/plant-care/aquarium-soil/",[["Aquarium Soil","Doğal volkanik minerallerden oluşan, su kimyasını etkileyen tam aktif bitki toprağı"]],"2026-08-26"),
  ...products("Tropica","substrate","https://tropica.com/en/plant-care/aquarium-soil/aquarium-soil-powder/",[["Aquarium Soil Powder","Ön plan bitkileri için 1–2 mm taneli tam aktif bitki toprağı"]],"2026-08-26"),
  ...products("Tropica","substrate","https://tropica.com/en/plant-care/substrate/",[["Substrate","Çakılın altına serilen, KH veya pH değerini etkilemeyen konsantre besleyici taban katmanı"]],"2026-08-26"),
  ...products("The 2Hr Aquarist","fertilizer",aptSource,[
    ["APT 1 / Zero","Nitrat ve fosfat içermeyen günlük kapsamlı sıvı gübre"], ["APT 3 / Complete","Makro ve mikro element içeren günlük tam sıvı gübre"],
    ["APT e","EI yöntemi için yoğun sıvı gübre"], ["APT Jazz","Soil için katı kök besini"],
    ["APT Dew","Terraryum, paludaryum, emers ve ev bitkileri için yaprak gübresi"],
  ]),
  ...products("The 2Hr Aquarist","treatment",aptSource,[
    ["APT Fix","Lokal yosun kontrol ürünü"], ["APT FixLite","Hassas bitkiler için hafif yosun kontrol ürünü"],
  ]),
  ...products("The 2Hr Aquarist","water_conditioner",aptSource,[
    ["APT Pure","Klor ve kloramini gideren; ağır metal, amonyak, nitrit ve nitratı detoksifiye eden su düzenleyici"],
    ["APT Sky","KH ve pH değerini değiştirmeden GH yükselten kalsiyum-magnezyum mineral desteği"],
    ["APT Sky Plus","GH ile birlikte iz element desteği sağlayan mineral karışımı"],
  ]),
  ...products("The 2Hr Aquarist","bacteria",aptSource,[
    ["APT Start","Yeni kurulum için taban besini ve başlangıç bakteri kültürü"],
    ["APT Balance","Düşük pH'lı aquasoil akvaryumlarında döngü ve mikrobiyal dengeyi destekleyen kuru bakteri kültürü"],
  ]),
  ...products("The 2Hr Aquarist","substrate",aptSource,[["APT Feast","Bitkili akvaryum için aktif besleyici soil"]]),
  ...products("Shrimps Forever","food",shrimpsForeverSource,[
    ["Complete","Günlük karides temel yemi"], ["Daily Feed","Bitkisel günlük karides yemi"], ["VitaPlus","Vitamin ve makro element destek yemi"],
    ["Mineral Shrimps Stick","Mineral destekli karides çubuğu"], ["Spinach Shrimps Stick","Ispanak ve sebze içerikli karides çubuğu"],
    ["Neocaridina / Tiger Box","Neocaridina ve tiger karides bakım-yem paketi"], ["Caridina Box","Caridina bakım-yem başlangıç paketi"],
  ]),
  ...products("Shrimps Forever","food","https://www.prizeaquatics.com/",[
    ["Walnut Shrimps Sticks","Ceviz yaprağı ve bitkisel protein içeren doğal karides çubuğu"],
    ["Shrimp Sticks Algae","Doğal alg, vitamin ve mineral içeren karides çubuğu"],
    ["Bean Pellet","Tahıl ve soya kabuğu içerikli, biyofilm oluşumunu destekleyen pelet yem"],
    ["Barley Mix","Karides ve salyangozlar için organik tahıl karışımı"],
    ["Speed Growth","Yavru ve genç karidesler için protein ağırlıklı büyüme yemi"],
    ["Mulberry","Dut yaprağı, spirulina ve vitamin içerikli karides yemi"],
    ["Snowflake","Soya kabuğu esaslı, mantar miseli ve biyofilm oluşumunu destekleyen yem"],
    ["Glucazyme","Beta glukan, protein ve sindirim enzimi içeren bağışıklık destekli karides yemi"],
    ["Moringa","Yüzde yüz organik moringa yaprağından üretilen vitamin ve mineral destekli karides yemi"],
  ]),
  ...products("Shrimps Forever","bacteria",shrimpsForeverSource,[
    ["Bio Powder","Mikroorganizma ve biyofilm gelişim desteği"],
    ["Cycle Starter Pro Bacter","Yeni karides akvaryumlarında biyolojik döngüyü başlatan bakteri kültürü"],
    ["Live Water (PSB - Bacteria)","Fotosentetik bakterilerle mikrobiyal dengeyi destekleyen sıvı kültür"],
  ]),
  ...products("Shrimps Forever","water_conditioner",shrimpsForeverSource,[
    ["Liquid GH+","Caridina için KH yükseltmeden GH mineral desteği"], ["GH/KH+ Mineral Powder","Neocaridina için GH ve KH mineral desteği"],
    ["Sulawesi Mineral 7.5","Sulawesi karidesleri için osmos suyu mineral desteği"], ["Shrimp Trace","Karidesler için iz element desteği"],
    ["TapFix","Klor ve ağır metalleri bağlayan musluk suyu düzenleyici"],
    ["Crystallize Crystal Water","Sudaki ince parçacıkları çöktürmeye yardımcı berraklaştırıcı"],
    ["Black Water","Fulvik asit içeren karasu düzenleyicisi"],
    ["Powder GH+","KH değerini yükseltmeden GH mineral desteği sağlayan toz karışım"],
    ["Shrimp Mineral (Montmorillonite)","Montmorillonit esaslı mineral ve kabuk değişimi desteği"],
    ["Vit-Amine","Karidesler için vitamin ve amino asit desteği"],
    ["FLY Breeding Aid","Üreme dönemindeki karidesler için mineral ve kondisyon desteği"],
  ]),
  ...products("Shrimps Forever","treatment",shrimpsForeverSource,[["Algasol","Karides akvaryumları için organik yosun kontrol ürünü"]]),
  ...products("Shrimps Forever","substrate","https://www.prizeaquatics.com/index.php?manufacturer_id=64&route=product%2Fmanufacturer%2Finfo",[
    ["Shrimp Soil","Karides, bitki ve mikroflora gelişimini destekleyen organik asit ve mineralce zengin aktif toprak"],
  ]),
  ...products("MasterLine","fertilizer",masterLineSource,[
    ["MasterLine I","Mikro element sıvı gübresi"], ["MasterLine II","Makro element sıvı gübresi"], ["Carbo","Sıvı karbon desteği"],
    ["All In One Boost","Yoğun bitkili akvaryumlar için tam gübre"], ["All In One Golden","Düşük azot yaklaşımı için tam gübre"],
    ["All In One Lean","Yalın dozlama için tam gübre"], ["Nitrate","Tek bileşenli nitrat desteği"], ["Phosphate","Tek bileşenli fosfat desteği"],
    ["Potassium","Tek bileşenli potasyum desteği"], ["Iron","Tek bileşenli demir desteği"], ["Root Caps","Kök bölgesi besin kapsülü"],
    ["All In One Red","Nitrat içermeyen, kırmızı bitki pigmentasyonunu destekleyen tam gübre"], ["RootMax","Kök gelişimini 6–12 ay destekleyen organik besin peletleri"],
  ]),
  ...products("MasterLine","water_conditioner",masterLineSource,[
    ["Safe Water","Klor, kloramin ve toksik ağır metalleri etkisizleştiren musluk suyu düzenleyici"],
    ["GH Plus","KH değerini etkilemeden kalsiyum, magnezyum ve potasyumla GH yükselten mineral karışımı"],
    ["Crystal Clear","Organik parçacıkları bağlayarak tatlı suyu berraklaştıran düzenleyici"],
  ]),
  ...products("MasterLine","filter_media",masterLineSource,[
    ["Purity","Çözünmüş organik maddeleri adsorbe eden yenilenebilir filtre medyası"],
    ["FilterMax","Amonyak ve nitrit azaltımını destekleyen, bakteri kolonizasyonuna uygun doğal filtre medyası"],
  ]),
  ...dennerleProducts("food",[
    ["betta-booster","Betta Booster","Betta ve diğer labirent balıkları için böcek ve kabuklu içerikli temel yem"],
    ["cichlid-carny","Cichlid Carny","Etçil Malawi ve Tanganika cikletleri için hayvansal içerikli temel yem"],
    ["cichlid-veggy","Cichlid Veggy","Aufwuchs ile beslenen otçul cikletler için alg ve sebze içerikli yem"],
    ["color-booster","Color Booster","Astaksantin içeren 0,5 mm renk destekleyici granül yem"],
    ["complete-gourmet-flakes","Complete Gourmet Flakes","Karma türlerin bulunduğu topluluk akvaryumları için dengeli pul yem"],
    ["complete-gourmet-menu","Complete Gourmet Menu","Doğal beslenme örüntüsünü temel alan çok bileşenli granül yem"],
    ["cookies-special-menu","Cookies Special Menu","Dip balıkları için probiyotik ve prebiyotik içerikli batan yem cipsi"],
    ["crusta-brennnessel-stixx","Crusta Brennnessel Stixx","Karidesler için ısırgan otu bazlı mineral ve vitamin desteği"],
    ["crusta-spinat-stixx","Crusta Spinat Stixx","Karidesler için yüzde yüz ıspanaktan üretilen tamamlayıcı yem"],
    ["crustagran","CrustaGran","Karides ve cüce kerevit için alg içerikli batan temel granül yem"],
    ["crustagran-baby","CrustaGran Baby","Yavru karidesler için 0,1–0,8 mm, suyu bulandırmayan mikro granül yem"],
    ["diskus-soft","Diskus Soft","Diskus balıkları için yumuşak ve dengeli granül yem"],
    ["goldy-booster","Goldy Booster","Japon balığı ve varyeteleri için hayvansal ve bitkisel içerikli yem"],
    ["guppy-booster","Guppy Booster","Guppy, plati ve moliler için biyolojik olarak dengeli temel yem"],
    ["nano-algenfutterblaetter","Nano Algae Food Leaves","Karidesler için yüzde yüz doğal alg yaprakları"],
    ["nano-gran","Nano Gran","Üç santimetreye kadar nano balıklar için suya dayanıklı granül yem"],
    ["neon-booster","Neon Booster","Neon tetra ve diğer küçük süs balıkları için ince granül temel yem"],
    ["pleco-menu","Pleco Menu","Alg ve bitki yiyen vatozlar için yaprak ve bitkisel içerikli temel yem"],
    ["shrimp-king-5in1","Shrimp King 5in1","Beş Shrimp King yeminden oluşan karides karma paketi"],
    ["shrimp-king-atyopsis","Shrimp King Atyopsis","Yelpaze karidesleri için uygun parçacık boyutlu toz temel yem"],
    ["shrimp-king-baby","Shrimp King Baby","Karides larvaları ve genç karidesler için mikro granül büyütme yemi"],
    ["shrimp-king-cambarellus","Shrimp King Cambarellus","Cüce kerevitlerin hepçil beslenmesine uygun temel yem"],
    ["shrimp-king-color","Shrimp King Color","Karideslerde doğal renk oluşumunu destekleyen karotenoidli yem"],
    ["shrimp-king-complete","Shrimp King Complete","Karidesler için günlük, suya dayanıklı tam yem çubuğu"],
    ["shrimp-king-dadap-leaves","Shrimp King Dadap Leaves","Karides ve kerevitler için doğal yaprak yemi"],
    ["shrimp-king-mineral","Shrimp King Mineral","Yüzde 7 kalsiyum ve yüzde 10 montmorillonit içeren mineral yem"],
    ["shrimp-king-protein","Shrimp King Protein","Artan protein gereksinimi dönemleri için yüzde 42,2 proteinli yem"],
    ["shrimp-king-snailstixx","Shrimp King SnailStixx","Tatlı su salyangozları için kalsiyum destekli temel çubuk yem"],
    ["shrimp-king-snow-pops","Shrimp King Snow Pops","Organik soya kepeğinden üretilen dağılan karides yem çubuğu"],
    ["shrimp-king-yummy-gum","Shrimp King Yummy Gum","Taş, kök veya cama yapışabilen karides yem hamuru"],
  ]),
  ...dennerleProducts("fertilizer",[
    ["all-in-one-elixir","All in One Elixir","Balık, karides ve bitkili akvaryumlar için birleşik temel bakım ürünü"],
    ["carbo-care-bio","Carbo Care Bio","Kolay ve orta düzey bitkili akvaryumlar için biyolojik karbon bakım ürünü"],
    ["carbo-care-pro","Carbo Care Pro","Yoğun bitkili akvaryumlar için yüksek performanslı karbon bakım ürünü"],
    ["carbo-elixier-bio","Carbo Elixir Bio","Akvaryum bitkilerine biyolojik kullanılabilir karbon sağlayan sıvı bakım ürünü"],
    ["dosator","Dosator","V30 ve S7 gübrelerini osmozla düzenli veren elektriksiz dozlayıcı"],
    ["plant-active-enzymes","Plant Active Enzymes","Bitki besinlerinin kullanımını destekleyen enzim bakım ürünü"],
    ["plant-care-basic-root","Plant Care Basic Root","Kökten beslenen bitkiler için kil tabanlı besin deposu"],
    ["plant-care-k","Plant Care K","Hedefli potasyum desteği sağlayan makro gübre"],
    ["plant-care-n","Plant Care N","Hedefli azot ve nitrat desteği sağlayan makro gübre"],
    ["plant-care-npk","Plant Care NPK","Azot, fosfat, potasyum ve magnezyum içeren makro gübre"],
    ["plant-care-p","Plant Care P","Hedefli fosfat desteği sağlayan tek besinli gübre"],
    ["plant-care-pro","Plant Care Pro","Yoğun bitkili ve CO₂ destekli akvaryumlar için mikro besin gübresi"],
    ["plant-care-pro-daily","Plant Care Pro Daily","Yoğun bitkili akvaryumlar için günlük mikro besin ve demir gübresi"],
    ["plant-care-pro-root","Plant Care Pro Root","Güçlü köklenen bitkiler için kök bölgesi besin tableti"],
    ["plant-elixir-basic","Plant Elixir Basic","Tüm bitkili akvaryumlar için genel amaçlı sıvı gübre"],
    ["plant-system-e15","Plant System E15","Uzun dönemli demir desteği sağlayan sistem bileşeni"],
    ["plant-system-s7","Plant System S7","Haftalık vitamin ve iz element desteği sağlayan sistem bileşeni"],
    ["plant-system-set-de","Plant System Set","V30, E15 ve S7 bileşenlerinden oluşan büyük akvaryum gübre sistemi"],
    ["plant-system-set-nano","Plant System Set Nano","Nano akvaryumlar için üç bileşenli gübre sistemi"],
    ["plant-system-v30","Plant System V30","Aylık kapsamlı bitki besini sağlayan sistem bileşeni"],
  ]),
  ...dennerleProducts("test",[
    ["aqua-dest","Aqua Dest","CO₂ ve pH testlerinin hazırlanmasında kullanılan saflaştırılmış test suyu"],
    ["aqua-test","Aqua Test","Dennerle sürekli CO₂ testleri için test çözeltisi"],
    ["carbo-test-indicator","Carbo Test Indicator","CO₂ seviyesini renk değişimiyle gösteren indikatör çözeltisi"],
    ["carbo-test-precision","Carbo Test Precision","Small, Medium ve Large boy sürekli CO₂ ölçüm cihazı"],
    ["co2-langzeittest-correct","CO₂ Long-Term Test Correct","Akvaryumdaki CO₂ seviyesini sürekli izleyen test"],
    ["co2-langzeittest-crystal","Carbo Test Crystal","Nano ve standart boy cam sürekli CO₂ testi"],
    ["co2-quick-test","CO₂ QuickTest","Akvaryum suyundaki CO₂ yeterliliğini hızlı kontrol eden test"],
    ["kcl-losung","KCL Solution","pH elektrodu saklama ve bakım çözeltisi"],
    ["ph-eichloesung-4","pH Calibration Solution 4","pH elektrotları için pH 4 kalibrasyon çözeltisi"],
    ["ph-eichloesung-7","pH Calibration Solution 7","pH elektrotları için pH 7 kalibrasyon çözeltisi"],
    ["water-test-6in1","Water Test 6in1","Altı temel tatlı su parametresini birlikte ölçen şerit test"],
  ]),
  ...dennerleProducts("filter_media",[
    ["corner-filter-element-40-60","Corner Filter Element 40/60","Corner Filter 40 ve 60 için tekli ve üçlü yedek filtre elemanı"],
    ["corner-filter-element-100","Corner Filter Element 100","Corner Filter 100 için yedek filtre elemanı"],
    ["nano-active-carbon","Nano Active Carbon","İlaç kalıntısı ve organik maddeleri adsorbe eden aktif karbon medya"],
    ["nano-algenstop","Nano Algae Stop","Nano filtreler için alg besinlerini bağlayan özel filtre medyası"],
    ["nano-biofiltergranulat","Nano Bio Filter Granules","Bakteri kolonizasyonu için yüksek yüzeyli biyolojik filtre granülü"],
    ["nano-filtertubes","Nano Filtertubes","Nano filtreler için biyolojik seramik tüp medya"],
    ["osmose-feinfilter","Osmose Fine Filter","Osmose Professional sistemi için ince ön filtre kartuşu"],
    ["osmose-kohlefilter","Osmose Carbon Filter","Osmose Professional sistemi için aktif karbon ön filtre kartuşu"],
    ["scapers-flow-filter-schwamm","Scaper's Flow Filter Sponge","Scaper's Flow için yedek mekanik filtre süngeri"],
    ["scapers-flow-pad","Scaper's Flow Pad","Scaper's Flow için yedek ince filtre pedi"],
  ]),
  ...dennerleProducts("water_conditioner",[
    ["aqua-elixir","Aqua Elixir","Klor ve ağır metalleri nötralize eden genel su düzenleyici"],
    ["betta-water","Betta Water","Betta akvaryumları için klor ve ağır metalleri nötralize eden su düzenleyici"],
    ["clear-water-elixir","Clear Water Elixir","Bulanıklık, renk ve kokuyu bağlamaya yardımcı mineral esaslı berraklaştırıcı"],
    ["humin-elixir","Humin Elixir","Balık ve omurgasız bakımı için humik ve fulvik asit karışımı"],
    ["osmose-remineral","Osmose Remineral+","Ozmoz suyuna gerekli mineralleri geri kazandıran mineral karışımı"],
    ["shrimp-king-bee-salt-gh","Shrimp King Bee Salt GH+","Bee karidesler için iletkenlik ve genel sertlik sağlayan mineral tuzu"],
    ["shrimp-king-shrimp-salt-gh-kh","Shrimp King Shrimp Salt GH/KH+","Neocaridina ve tiger karidesler için GH/KH mineral tuzu"],
    ["shrimp-king-sulawesi-salt","Shrimp King Sulawesi Salt","Sulawesi karidesleri için mineral tuzu"],
  ]),
  ...dennerleProducts("bacteria",[
    ["aquarium-starter-rapid","Aquarium Starter Rapid","Yeni akvaryumların hızlı başlangıcı için canlı filtre bakterisi sistemi"],
    ["bacto-elixir-bio","Bacto Elixir Bio","Filtre temizliği ve canlı ekleme sonrasında kullanılan yoğun bakteri kültürü"],
    ["bacto-elixir-fb7","Bacto Elixir FB7","Atık parçalanmasını başlatan canlı temizleme bakterileri karışımı"],
  ]),
  ...dennerleProducts("treatment",[
    ["all-for-betta","All for Betta","Betta için yem, su düzenleme ve bakım ürünlerinden oluşan üçlü set"],
    ["betta-care","Betta Care","Humik ve fulvik asitli Betta su bakım ürünü"],
    ["black-cones","Black Cones","Humik ve tanen desteği sağlayan doğal kızılağaç kozalakları"],
    ["care-protect-set","Care & Protect Set","Genel akvaryum bakımı ve koruması için üçlü ürün seti"],
    ["catappa-leaves","Catappa Leaves","Balık ve omurgasız bakımı için doğal badem yaprakları"],
    ["nano-catappa-barks","Nano Catappa Barks","Uzun süreli humik ve tanen desteği sağlayan badem ağacı kabuğu"],
    ["nano-crusta-fit","Nano Crusta Fit","Karides ve kerevitler için vitamin ve iz element bakım ürünü"],
    ["nano-crusta-mineral","Nano Crusta Mineral","Karides ve kerevitler için mineral bakım ürünü"],
    ["vital-elixir","Vital Elixir","Tatlı su balıklarına fizyolojik iz element ve mineral desteği"],
  ]),
  ...dennerleProducts("substrate",[
    ["deponit-mix-pro","Deponit Mix Pro","Kum veya çakıl altında kullanılan uzun etkili besleyici taban katmanı · 1–9,6 kg"],
    ["deponit-mix-pro-black","Deponit Mix Pro Black","Koyu renkli akvaryumlar için besleyici taban katmanı · 1–9,6 kg"],
    ["kristall-quarzkies-diamantschwarz","Kristall Quartz Gravel Diamond Black","Elmas siyahı kristal kuvars çakıl · 5 ve 10 kg"],
    ["kristall-quarzkies-dunkelbraun","Kristall Quartz Gravel Dark Brown","Koyu kahverengi kristal kuvars çakıl · 10 kg"],
    ["kristall-quarzkies-naturweiss","Kristall Quartz Gravel Natural White","Doğal beyaz kristal kuvars çakıl · 10 kg"],
    ["kristall-quarzkies-rehbraun","Kristall Quartz Gravel Deer Brown","Açık kahverengi kristal kuvars çakıl · 10 kg"],
    ["kristall-quarzkies-schiefergrau","Kristall Quartz Gravel Slate Grey","Arduvaz gri kristal kuvars çakıl · 10 kg"],
    ["nano-garnelenkies","Nano Shrimp Gravel","Sulawesi siyah, Arkansas gri, Borneo kahverengi ve Sunda beyaz nano çakıl"],
    ["naturkies-bairaman","Natural Gravel Bairaman 0,1–0,6 mm","0,1–0,6 mm doğal akvaryum kumu · 0,5–5 kg"],
    ["naturkies-kongo-10-30mm","Natural Gravel Congo 10–30 mm","10–30 mm iri doğal akvaryum çakılı · 0,5–5 kg"],
    ["naturkies-kongo-3-8mm","Natural Gravel Congo 3–8 mm","3–8 mm doğal akvaryum çakılı · 0,5–5 kg"],
    ["naturkies-mekong","Natural Gravel Mekong 0,1–1,4 mm","0,1–1,4 mm doğal akvaryum kumu · 0,5 ve 2,5 kg"],
    ["naturkies-okavango-4-8mm","Natural Gravel Okavango 4–8 mm","4–8 mm doğal akvaryum çakılı · 0,5–5 kg"],
    ["naturkies-okavango-8-12mm","Natural Gravel Okavango 8–12 mm","8–12 mm doğal akvaryum çakılı · 0,5–5 kg"],
    ["naturkies-rio-branco","Natural Gravel Rio Branco 0,1–2 mm","0,1–2 mm doğal akvaryum kumu · 0,5 ve 2,5 kg"],
    ["naturkies-rio-xingu","Natural Gravel Rio Xingu 2–22 mm","2–22 mm karma taneli doğal akvaryum çakılı · 0,5–5 kg"],
    ["nutribasis","NutriBasis","Kum veya çakıl altında kullanılan besleyici taban katmanı · 2,4–9,6 kg"],
    ["scapers-soil","Scaper's Soil","Bitkili ve yumuşak su karides akvaryumları için aktif soil · 4 ve 8 L"],
    ["scapers-soil-natural-mix","Scaper's Soil Natural Mix","Doğal karışım görünümlü aktif aquascaping soil · 4 ve 8 L"],
    ["shrimp-king-active-soil","Shrimp King Active Soil","Bee karidesleri için pH düşürücü aktif volkanik soil · 4 ve 8 L"],
  ]),
  ...products("ADA","food",adaFoodSource,[
    ["AP-1 Premium","Yüzeyden beslenen küçük balıklar için yüzen premium yem"], ["AP-2 Premium","Küçük ve orta boy balıklar için yavaş batan premium yem"],
    ["AP-3 Premium","Orta ve dip katmanındaki orta boy balıklar için batan premium yem"],
  ]),
  ...products("ADA","fertilizer",adaFertilizerSource,[
    ["Green Brighty Neutral K","pH ve KH yükseltmeyen potasyum gübresi"], ["Brighty K","Potasyum ve tamponlama desteği"],
    ["Green Brighty Nitrogen","Azot gübresi"], ["Green Brighty Mineral","İz element gübresi"], ["Green Brighty Iron","Demir gübresi"],
  ]),
  ...products("ADA","fertilizer",adaAdditiveSource,[
    ["Green Gain Plus","Budama sonrası yeni sürgün gelişimini destekleyen deniz yosunu kökenli bitki takviyesi"],
    ["ECA Plus","Yeni sürgünlerde klorozu önlemeye yardımcı demir ve magnezyum takviyesi"],
  ]),
  ...products("ADA","bacteria",adaAdditiveSource,[
    ["Green Bacter Plus","Akvaryum ve filtrede yararlı bakterilerin gelişimini destekleyen organik asit ve mineral katkısı"],
  ]),
  ...products("ADA","treatment",adaAdditiveSource,[
    ["Phyton Git Plus","Bitki hastalıkları ile mavi-yeşil alg oluşumunu önlemeye yardımcı bitki özlü katkı"],
    ["Phyton Git Sol","Mavi-yeşil alg bölgelerine lokal uygulanan yüksek viskoziteli bitki özlü kontrol ürünü"],
  ]),
  ...products("ADA","water_conditioner",adaConditionerSource,[
    ["Chlor-Off","Musluk suyundaki kalıntı kloru gideren düzenleyici"], ["Vita-Mix","Vitamin desteği"],
    ["Clear Water","Fosfatı ve bulanıklığa yol açan ince parçacıkları bağlayan berraklaştırıcı"],
    ["Soft Water","Yüksek pH ve KH değerlerini hafif asidik koşullara doğru ayarlayan düzenleyici"],
  ]),
  ...products("ADA","substrate",adaSoilSource,[
    ["Aqua Soil Amazonia Pro","Yoğun besinli profesyonel sınıf aktif bitki toprağı"],
    ["Aqua Soil Amazonia Ver.2","Besin takviyeli aktif bitki toprağı"], ["Aqua Soil Amazonia Ver.2 Powder","İnce taneli aktif bitki toprağı"],
  ]),
  ...products("ADA","substrate",adaPowerSandSource,[
    ["Power Sand Basic S","40 cm ve altı su derinliği için mikroorganizma ve kök gelişimini destekleyen taban katmanı"],
    ["Power Sand Advance S","40 cm ve altı su derinliği için zenginleştirilmiş besleyici taban katmanı"],
    ["Power Sand Advance M","40–60 cm su derinliği için zenginleştirilmiş besleyici taban katmanı"],
    ["Power Sand Advance L","60 cm üzeri su derinliği için iri taneli besleyici taban katmanı"],
  ]),
  ...products("ADA","substrate",adaSubstrateAdditiveSource,[
    ["Bacter 100","Yüzden fazla uyku hâlindeki bakteri türü içeren taban katkısı"],
    ["Clear Super","Aktif karbon ve organik asit içeren mikrobiyal taban katkısı"],
    ["Tourmaline BC","Bambu kömürü ve turmalin içeren taban iyileştirici katkı"],
    ["Bacter Ball","Tabanda veya biyolojik filtrede kullanılabilen küresel bakteri katkısı"],
  ]),
  ...products("ADA","test",adaTestSource,[
    ["Pack Checker pH","pH 5,8–8,0 aralığını ölçen tek kullanımlık tüp test"],
    ["Pack Checker TH","Toplam sertliği ölçen tek kullanımlık tüp test"],
    ["Pack Checker NH4","Amonyum düzeyini ölçen tek kullanımlık tüp test"],
    ["Pack Checker NO2","Nitrit düzeyini ölçen tek kullanımlık tüp test"],
    ["Pack Checker NO3","Nitrat düzeyini ölçen tek kullanımlık tüp test"],
    ["Pack Checker ClO","Kalıntı klor düzeyini ölçen tek kullanımlık tüp test"],
    ["Pack Checker COD","Organik kirlilik göstergesi COD düzeyini ölçen tüp test"],
    ["Pack Checker PO4","Fosfat düzeyini ölçen tek kullanımlık tüp test"],
  ]),
  ...products("ADA","filter_media",adaFilterMediaSource,[
    ["Bio Rio G","pH ve sertliği belirgin biçimde etkilemeden biyolojik filtrasyon sağlayan gözenekli sinterlenmiş cam medya · 1 L"],
    ["Bio Cube","Uzun süreli biyolojik filtrasyon için geniş yüzeyli siyah poliüretan medya · 2 L"],
    ["NA Carbon","Su sararmasını azaltan, asitle işlenmiş yüksek emiş kapasiteli aktif karbon · 750 ml"],
    ["Bamboo Charcoal","Emiş etkisi sonrasında da biyolojik medya olarak kullanılabilen rafine bambu kömürü · 1 L"],
  ],"2026-08-27"),
  ...products("Netlea","substrate","https://www.netlea.com/xqy-scn.html",[
    ["Aquatic Plant Soil","Zayıf asidik siyah-kahverengi topraktan üretilen, organik madde, demir ve iz elementler içeren bitkili akvaryum taban malzemesi"],
  ],"2026-08-27"),
  ...products("Netlea","fertilizer","https://www.netlea.com/xqy-scyf.html",[
    ["Aquatic Plant Liquid Fertilizer","Su bitkilerine besin ve enerji desteği sağlayan sıvı bitki gübresi"],
  ],"2026-08-27"),
  ...products("Netlea","filter_media","https://www.netlea.com/xqy-xwh.html",[
    ["Microbial Fiber Ring","Diyatomlu toprağın yüksek sıcaklıkta pişirilmesiyle üretilen, nötr ve çok gözenekli biyolojik filtre medyası"],
  ],"2026-08-27"),
  ...products("Netlea","bacteria","https://www.sxi.com.tw/product/%E5%B0%BC%E7%89%B9%E5%88%A9Netlea%E7%A1%9D%E5%8C%96%E8%8F%8C",[
    ["Supreme Nitrifying Bacteria Bottle","Akvaryum döngüsünü kurmayı destekleyen yoğun canlı bakteri kültürü"],
    ["Supreme Nitrifying Bacteria Capsule","İlk kurulumda 150 litreye bir kapsül önerisi yayımlanan yoğun canlı bakteri kültürü"],
  ],"2026-08-27"),
  ...products("Netlea","filter_media","https://www.sxi.com.tw/product/%E5%B0%BC%E7%89%B9%E5%88%A9NetleaNOV",[
    ["Technology Hollow Colored Ball S 1 L","Biyolojik filtrasyon için teknoloji tipi boşluklu renkli küresel medya"],
    ["Microporous Fiber Ring M 1 L","Biyolojik filtrasyon için mikro gözenekli orta boy lif halka"],
    ["Small Hollow Quartz Ball S 1 L","Biyolojik filtrasyon için küçük boşluklu kuvars küre"],
    ["Fiber Ring S 1 L","Biyolojik filtrasyon için küçük boy lif halka"],
    ["Fiber Ring M 1 L","Biyolojik filtrasyon için orta boy lif halka"],
    ["Fiber Ball 1 L","Biyolojik filtrasyon için lif küre"],
    ["Fiber Triangle 1 L","Biyolojik filtrasyon için üçgen lif medya"],
  ],"2026-08-27"),
  ...products("Aquamins","fertilizer",aquaminsSource,[["Potasflow 100 ml","Potasyum ağırlıklı bitki gübresi"],["Plants All Included 100 ml","Kapsamlı bitki gübresi"],["Plants All Included 250 ml","Kapsamlı bitki gübresi"]]),
  ...products("Aquamins","water_conditioner",aquaminsSource,[
    ["H2O 100 ml","Klor ve ağır metalleri nötralize eden musluk suyu düzenleyici"],
    ["H2O 250 ml","Klor ve ağır metalleri nötralize eden musluk suyu düzenleyici"],
    ["Productive Cleaner 100 ml","Askıdaki parçacıkları filtrelenebilir kümeler hâline getiren su berraklaştırıcı"],
    ["Productive Cleaner 250 ml","Askıdaki parçacıkları filtrelenebilir kümeler hâline getiren su berraklaştırıcı"],
    ["Minerals Plus 100 ml","Tatlı su balıkları ve karidesleri için GH mineral desteği"],
    ["Beta Mineral 30 ml","Betta akvaryumları için mineral desteği"],
    ["Beta Mineral 100 ml","Betta akvaryumları için mineral desteği"],
    ["Anti Ammonia 100 ml","Amonyak giderici"],
  ]),
  ...products("Aquamins","bacteria",aquaminsSource,[["Bacteria 100 ml","Biyolojik denge için bakteri kültürü"],["Bacteria 250 ml","Biyolojik denge için bakteri kültürü"]]),
  ...products("Aquamins","treatment",aquaminsSource,[
    ["Aqua Nutrifish 30 ml","Bakteriyel ve mantar kaynaklı balık hastalıklarında kullanılan bakım ürünü"],
    ["Aqua Nutrifish 100 ml","Bakteriyel ve mantar kaynaklı balık hastalıklarında kullanılan bakım ürünü"],
    ["Ichthyo 30 ml","Balık parazit bakım losyonu"],
    ["Ichthyo 100 ml","Balık parazit bakım losyonu"],
    ["Anti Algae 100 ml","Akvaryumlarda yosun kontrolüne yardımcı bakım ürünü"],
    ["Anti Algae 250 ml","Akvaryumlarda yosun kontrolüne yardımcı bakım ürünü"],
    ["Anti Algae 500 ml","Akvaryumlarda yosun kontrolüne yardımcı bakım ürünü"],
  ]),
  ...products("Aquamins","substrate",aquaminsSource,[
    ["California Black Sand 1,5 mm 10 kg","Bitkili akvaryum için 1,5 mm siyah kum"],
    ["California Black Sand 1,5 mm 20 kg","Bitkili akvaryum için 1,5 mm siyah kum"],
    ["California Black Sand 3,5 mm 10 kg","Bitkili akvaryum için 3,5 mm siyah kum"],
    ["California Black Sand 3,5 mm 20 kg","Bitkili akvaryum için 3,5 mm siyah kum"],
    ["White Sand 0,5 mm 10 kg","Ciklet akvaryumu için 0,5 mm beyaz kum"],
    ["White Sand 0,5 mm 20 kg","Ciklet akvaryumu için 0,5 mm beyaz kum"],
    ["White Sand 1,5 mm 10 kg","Ciklet akvaryumu için 1,5 mm beyaz kum"],
    ["White Sand 1,5 mm 20 kg","Ciklet akvaryumu için 1,5 mm beyaz kum"],
    ["Silis Kumu 0,5 mm 10 kg","Tatlı su akvaryumu için ince taneli doğal silis kumu"],
    ["Silis Kumu 1,5 mm 10 kg","Bitki kökleri ve dip balıkları için 1,5 mm silis kumu"],
    ["Lav Taşı Kırığı 0,5 cm 12 kg","Akvaryum tabanı için yaklaşık 0,5 cm gözenekli lav taşı kırığı"],
    ["Lav Taşı Kırığı 0,5–1,5 cm 12 kg","Akvaryum tabanı için 0,5–1,5 cm gözenekli lav taşı kırığı"],
  ]),
  ...[
    ["30×30×30",27,[30,30,30]], ["35×35×35",42.875,[35,35,35]], ["40×40×30",48,[40,40,30]],
    ["50×30×30",45,[50,30,30]], ["60×40×40",96,[60,40,40]], ["90×45×45",182.25,[90,45,45]],
    ["100×50×45",225,[100,50,45]], ["120×50×45",270,[120,50,45]], ["30×20×15",9,[30,20,15]],
    ["40×30×20",24,[40,30,20]], ["150×50×40",300,[150,50,40]], ["150×50×50",375,[150,50,50]],
  ].flatMap(([size,volumeL,dimensionsCm])=>[
    {id:`creaqua-crystal-45-${String(size).replaceAll("×","-")}`,brand:"Creaqua",model:`Crystal 45 ${size} cm`,category:"tank" as const,description:"Yüzde 90'ın üzerinde ışık geçirgenliğine sahip cam, 45° rodajlı köşeler, beyaz taban matı ve buzlu arka fonla sunulan boş akvaryum",volumeL:Number(volumeL),dimensionsCm:dimensionsCm as [number,number,number],sourceUrl:"https://www.creaqua.com.tr/tr/akvaryum/7-2590-creaqua-crystal-akvaryum.html",verifiedAt:"2026-09-14"},
    {id:`creaqua-crystal-classic-${String(size).replaceAll("×","-")}`,brand:"Creaqua",model:`Crystal Classic ${size} cm`,category:"tank" as const,description:"Yüzde 90'ın üzerinde ışık geçirgenliğine sahip cam, düz rodajlı köşeler, beyaz taban matı ve buzlu arka fonla sunulan boş akvaryum",volumeL:Number(volumeL),dimensionsCm:dimensionsCm as [number,number,number],sourceUrl:"https://www.creaqua.com.tr/tr/akvaryum/72-crystal-classic.html",verifiedAt:"2026-09-14"},
  ]),
  ...[
    ["30×30×80",[30,30,80]], ["40×40×80",[40,40,80]], ["50×30×80",[50,30,80]],
    ["60×40×80",[60,40,80]], ["90×45×80",[90,45,80]], ["100×50×80",[100,50,80]],
    ["120×50×80",[120,50,80]], ["150×55×80",[150,55,80]], ["120×55×80",[120,55,80]],
    ["150×50×80",[150,50,80]],
  ].map(([size,dimensionsCm])=>({id:`creaqua-stand-45-${String(size).replaceAll("×","-")}`,brand:"Creaqua",model:`Stand 45 ${size} cm`,category:"cabinet" as const,description:"Akvaryum için beyaz veya antrasit renk seçeneği bulunan dayanıklı mobilya",dimensionsCm:dimensionsCm as [number,number,number],sourceUrl:"https://www.creaqua.com.tr/tr/mobilya/8-2489-creaqua-akvaryum-mobilyasi.html",verifiedAt:"2026-09-14"})),
  ...[
    ["35×50",[35,50]], ["90×50",[90,50]], ["150×50",[150,50]],
  ].map(([size,footprintCm])=>({id:`creaqua-aquamat-${String(size).replaceAll("×","-")}`,brand:"Creaqua",model:`AquaMat ${size} cm`,category:"decoration" as const,description:"Akvaryum taban camını korumak, yüzey pürüzlerini absorbe etmek, stabilite ve ısı yalıtımı sağlamak için siyah veya beyaz taban matı",footprintCm:footprintCm as [number,number],sourceUrl:"https://www.creaqua.com.tr/tr/akvaryum-ve-mobilya-ekipmanlari/9-2613-creaqua-aquamat.html",verifiedAt:"2026-09-14"})),
  ...[
    ["35×35×50",[35,35,50]], ["45×45×60",[45,45,60]], ["50×50×70",[50,50,70]], ["60×60×90",[60,60,90]],
  ].map(([size,dimensionsCm])=>({id:`creaqua-planted-terrarium-${String(size).replaceAll("×","-")}`,brand:"Creaqua",model:`Bitkili Teraryum ${size} cm`,category:"terrarium" as const,description:"Yoğun bitkili teraryumlar için dip çekim bölmesi, ön ve üst paslanmaz havalandırma ızgaraları, güvenli menteşe/kilit, taban matı ve kablo-nozul geçişleri bulunan cam habitat",dimensionsCm:dimensionsCm as [number,number,number],sourceUrl:"https://www.creaqua.com.tr/tr/paludaryum-teraryum/81-2609-bitkili-teraryum.html",verifiedAt:"2026-09-14"})),
  ...[
    ["40×30×40",[40,30,40]], ["50×40×40",[50,40,40]], ["60×40×50",[60,40,50]], ["80×50×50",[80,50,50]], ["100×50×60",[100,50,60]],
  ].map(([size,dimensionsCm])=>({id:`creaqua-reptile-terrarium-${String(size).replaceAll("×","-")}`,brand:"Creaqua",model:`Reptile Teraryum ${size} cm`,category:"terrarium" as const,description:"Bitkili ve sürüngen teraryumları için dip çekim bölmesi, ön ve üst paslanmaz havalandırma ızgaraları, güvenli menteşe/kilit, taban matı ve kablo-nozul geçişleri bulunan cam habitat",dimensionsCm:dimensionsCm as [number,number,number],sourceUrl:"https://www.creaqua.com.tr/tr/paludaryum-teraryum/94-reptile-teraryum.html",verifiedAt:"2026-09-14"})),
  ...[
    ["30×30×10",[30,30,10]], ["35×35×10",[35,35,10]], ["40×40×10",[40,40,10]], ["50×30×10",[50,30,10]],
  ].map(([size,dimensionsCm])=>({id:`creaqua-desktop-nano-stand-${String(size).replaceAll("×","-")}`,brand:"Creaqua",model:`Desktop Nano Stand ${size} cm`,category:"cabinet" as const,description:"Nano akvaryum ekipmanlarını düzenlemek için çekmeceli masaüstü mobilyası · beyaz veya antrasit renk seçeneği",dimensionsCm:dimensionsCm as [number,number,number],sourceUrl:"https://www.creaqua.com.tr/tr/mobilya/69-desktop-nano-stand.html",verifiedAt:"2026-09-14"})),
  ...products("Creaqua","filter_media","https://www.creaqua.com.tr/tr/filtre-medyalari/57-revex.html",[
    ["REVEX 100 ml","Organik maddeler, organik atıklar ve tanen giderimi için rejenere edilebilir sentetik adsorban"],
    ["REVEX 250 ml","Organik maddeler, organik atıklar ve tanen giderimi için rejenere edilebilir sentetik adsorban"],
    ["REVEX 500 ml","Organik maddeler, organik atıklar ve tanen giderimi için rejenere edilebilir sentetik adsorban"],
  ],"2026-09-14"),
  {id:"creaqua-clarifier-filter-pad",brand:"Creaqua",model:"Clarifier Filter Pad 50×25 cm",category:"filter_media",description:"Koku, bulanıklık, organik atık ve kirleticileri gidermeye yardımcı, filtreye göre kesilebilen tek kullanımlık ped",footprintCm:[50,25],sourceUrl:"https://www.creaqua.com.tr/tr/filtre-medyalari/66-clarifier-filter-pad.html",verifiedAt:"2026-09-14"},
  {id:"creaqua-media-bag-15-15",brand:"Creaqua",model:"Media Bag 15×15 cm",category:"filter_media",description:"Küçük taneli karbon, reçine ve zeolit gibi medyalar için fermuarlı, sık gözenekli ve yüksek su geçirgenliğine sahip filtre çantası",footprintCm:[15,15],sourceUrl:"https://www.creaqua.com.tr/tr/filtrasyon-aksesuarlari/70-media-bag.html",verifiedAt:"2026-09-14"},
  ...products("Creaqua","decoration","https://www.creaqua.com.tr/tr/agaclar/25-ribbed-wood.html",[["Ribbed Wood","Doğal nervürlü ve burgulu görünümlü, suya kolay batan ve suyu az renklendiren akvaryum tasarım ağacı"]],"2026-09-14"),
  ...products("Creaqua","decoration","https://www.creaqua.com.tr/tr/ana-sayfa/36-flame-wood.html",[["Spotted Wood","Koyu benekli ince dalları bulunan, suya kolay batan ve suyu az renklendiren akvaryum tasarım ağacı"]],"2026-09-14"),
  ...products("Creaqua","decoration","https://www.creaqua.com.tr/tr/ana-sayfa/37-black-flame.html",[["Black Flame","Koyu kahverengi, alev biçimli kıvrımları bulunan yoğun ve suya hemen batan akvaryum tasarım ağacı"]],"2026-09-14"),
  ...products("Creaqua","decoration","https://www.creaqua.com.tr/tr/agaclar/59-red-velt.html",[["Red Velt","Çok dallı açık kahverengi, suda zamanla kırmızı çizgiler oluşturabilen ve az tanen salan doğal tasarım ağacı"]],"2026-09-14"),
  ...products("Creaqua","decoration","https://www.creaqua.com.tr/tr/agaclar/82-arbour-wood.html",[["Arbour Wood","Kırmızı karamel renkli, sık ve kıvırcık dokulu; 15–80 cm arasında doğal parçalar halinde sunulan, az tanen salan tasarım ağacı"]],"2026-09-14"),
  ...products("Creaqua","decoration","https://www.creaqua.com.tr/tr/ana-sayfa/85-bucelog.html",[["Bucelog","Anubias, fern, Bucephalandra ve Bolbitis gibi epifit bitkileri lastikle sabitlemek için hemen batan küçük doğal ağaç parçaları"]],"2026-09-14"),
  ...products("Creaqua","decoration","https://www.creaqua.com.tr/tr/agaclar/83-twiggy.html",[["Twigy Dark","Küçük koyu dal porsiyonu ve doğal tanen kaynağı"],["Twigy Light","Küçük açık renkli dal porsiyonu ve doğal tanen kaynağı"],["Twigy Mix","Küçük karışık dal porsiyonu ve doğal tanen kaynağı"]],"2026-09-14"),
  ...products("Creaqua","decoration","https://www.creaqua.com.tr/tr/agaclar/87-2622-twigy-large.html",[["Twigy Large Dark","Ortalama 30–40 cm koyu dal porsiyonu ve doğal tanen kaynağı"],["Twigy Large Light","Ortalama 30–40 cm açık renkli dal porsiyonu ve doğal tanen kaynağı"]],"2026-09-14"),
  ...products("Creaqua","decoration","https://www.creaqua.com.tr/tr/tasarim-malzemeleri/27-mossrock.html",[["MossRock","Misina yardımıyla moss porsiyonları hazırlamak için ince, düz ve su kimyasını etkilemeyen doğal dekor"]],"2026-09-14"),
  ...products("Creaqua","decoration","https://www.creaqua.com.tr/tr/kayalar/28-ancyra-rock-type-1.html",[["Frodo Stone","İnce çizgili ve derin oluklu yapısıyla doğal kayalık tasarımlar için akvaryum kayası"]],"2026-09-14"),
  ...products("Creaqua","decoration","https://www.creaqua.com.tr/tr/ana-sayfa/51-gray-moon-stone.html",[["Gray Moon Stone","Oval delikli, ıslandığında açık griye dönen doğal tasarım kayası · üretici ilk kullanımda suyu biraz sertleştirebileceğini belirtir"]],"2026-09-14"),
  ...products("Creaqua","decoration","https://www.creaqua.com.tr/tr/ana-sayfa/52-orange-moon-stone.html",[["Orange Moon Stone","Farklı büyüklüklerde oval delikleri bulunan ve gerektiğinde küçültülebilen doğal tasarım kayası"]],"2026-09-14"),
  ...products("Creaqua","decoration","https://www.creaqua.com.tr/tr/ana-sayfa/53-galapagos-rock.html",[["Galapagos Rock","Yoğun delikli ve oluklu yüzeyi bitki yerleşimine uygun, koyu renkli doğal tasarım kayası"]],"2026-09-14"),
  ...products("Creaqua","decoration","https://www.creaqua.com.tr/tr/kayalar/60-keitir-stone.html",[["Keitir Stone","Sarp dağ kayalıklarını andıran güçlü yüzey şekillerine sahip siyah volkanik tasarım kayası"]],"2026-09-14"),
  ...products("Creaqua","water_conditioner","https://www.creaqua.com.tr/en/natural-water-conditioners/96-alder-cones.html",[["Alder Cones","Kızılağaç kozalağı · tatlı su ve nemli teraryumlarda tanen, hümik ve fulvik bileşikler sağlayan doğal biyotop malzemesi"]],"2026-09-14"),
  ...products("Creaqua","water_conditioner","https://www.creaqua.com.tr/en/natural-water-conditioners/97-kurrajong-pods.html",[["Kurrajong Pods","Orta düzey tanen salan; tatlı su, paludaryum ve nemli teraryumlarda kullanılan doğal biyotop malzemesi"]],"2026-09-14"),
  ...products("Creaqua","water_conditioner","https://www.creaqua.com.tr/en/natural-water-conditioners/99-banana-leaves.html",[["Banana Leaves","Tatlı su, paludaryum ve nemli teraryumlarda tanen sağlayan ve biyofilm oluşumunu destekleyen doğal muz yaprağı"]],"2026-09-14"),
  ...products("Creaqua","decoration","https://www.creaqua.com.tr/tr/ana-sayfa/55-plantie.html",[["Plantie Kahverengi 500 cm","Epifit bitkileri köklenene kadar sabitlemek için kahverengi plastik kaplı tel"],["Plantie Yeşil 500 cm","Epifit bitkileri köklenene kadar sabitlemek için yeşil plastik kaplı tel"]],"2026-09-14"),
  ...products("Creaqua","water_conditioner","https://www.creaqua.com.tr/tr/su-duezenleyiciler/77-just-clear.html",[["Just Clear 250 ml","Tatlı ve tuzlu su akvaryumları ile süs havuzlarında serbest partikülleri bağlayan konsantre berraklaştırıcı · 2,5 ml/50 L doz · 250 ml şişe 5000 L su için"]],"2026-09-14"),
  ...products("Creaqua","fertilizer","https://www.creaqua.com.tr/en/10-fertilizers-and-water-conditioners",[
    ["Plant Nutrition Macro 250 ml","Bitkili akvaryumlar için haftalık makro besin desteği"],
    ["Plant Nutrition Micro 250 ml","Bitkili akvaryumlar için konsantre mikro besin desteği"],
    ["Plant Nutrition Nitrogen 250 ml","Azot eksikliğine yönelik bitki besini"],
    ["Plant Nutrition Phosphate 250 ml","Fosfor eksikliğine yönelik fosfat bitki besini"],
    ["Plant Nutrition Potassium 250 ml","Potasyum eksikliğine yönelik bitki besini"],
    ["Plant Nutrition Iron 250 ml","Demir eksikliğine yönelik bitki besini"],
    ["EXALG Carbon 250 ml","Bitkili akvaryumlar için sıvı organik karbon desteği"],
    ["Low Tech 250 ml","Düşük teknolojili bitkili akvaryumlar için birleşik besin desteği"],
    ["Six Up 250 ml","Bitkili akvaryumlar için çok bileşenli besin desteği"],
    ["Shallow Nutritions 100 ml","Sığ bitkili akvaryumlar için yoğunlaştırılmış besin desteği"],
  ]),
  ...products("Creaqua","water_conditioner","https://www.aquackakvaryum.com.tr/creaqua/page-5",[
    ["GH Plus 250 ml","Osmoz ve deiyonize suyu kalsiyum ve magnezyumla yeniden minerallendiren GH desteği"],
    ["Avant Guard 250 ml","Musluk suyunu akvaryum kullanımına hazırlayan su düzenleyici"],
  ]),
  ...products("Creaqua","bacteria","https://www.aquackakvaryum.com.tr/creaqua/page-5",[
    ["Cycle Booster","Akvaryumun biyolojik döngüsünü destekleyen bakteri kültürü"],
  ]),
  ...products("Creaqua","filter_media","https://www.aquackakvaryum.com.tr/creaqua/page-5",[
    ["Active Carbon 250 ml","Organik kirletici, renk ve kokuyu adsorbe eden aktif karbon"],
    ["Active Carbon 500 ml","Organik kirletici, renk ve kokuyu adsorbe eden aktif karbon"],
    ["Hivex","Faydalı bakteri kolonileri için gözenekli biyolojik filtre medyası"],
    ["Purifier Filter Pad","Koku, renk ve organik kirleticileri tutmaya yardımcı arıtıcı filtre pedi"],
  ]),
  ...products("Creaqua","substrate","https://www.aquackakvaryum.com.tr/creaqua/page-5",[
    ["Cosmetics Beige Sand 3 L","Su değerlerini etkilemeyen bej kozmetik akvaryum kumu"],
    ["Cosmetics White Sand 3 L","Su değerlerini etkilemeyen beyaz kozmetik akvaryum kumu"],
    ["Cosmetics Natural Sand 3 L","Doğal görünüm için kozmetik akvaryum kumu"],
    ["Cosmetics River Sand 3 L","Nehir tabanı görünümü için kozmetik akvaryum kumu"],
    ["Cosmetics Black Sand 3 L","Su değerlerini etkilemeyen siyah kozmetik akvaryum kumu"],
  ]),
  ...products("Creaqua","substrate","https://www.creaqua.com.tr/tr/kozmetik-kumlar/54-brown.html",[["Cosmetics Brown Sand","Genel akvaryum ve bitkili tasarımlarda kozmetik kullanım için su değerlerini etkilemeyen kahverengi nötr kum · resmî sayfa paket hacmi yayımlamadığı için miktar belirtilmedi"]],"2026-09-14"),
  { id:"eurostar-zeo-carbon-fix-500ml", brand:"Eurostar", model:"Zeo Karbon Fix 500 ml", category:"filter_media", description:"Aktif karbon ve zeolit içeren kimyasal filtre medyası", sourceUrl:"https://atakanpetshop.com/eurostar-zeo-karbon-fix-500ml-filtre-malzemesi", verifiedAt },
  { id:"eurostar-lava-fix-500ml", brand:"Eurostar", model:"Lava Fix 500 ml", category:"filter_media", description:"Biyolojik filtrasyon için doğal volkanik lav taşı", sourceUrl:"https://atakanpetshop.com/eurostar-lava-fix-500ml-filtre-malzemesi-452-1018", verifiedAt },
  { id:"eurostar-bio-porous-ring-500ml", brand:"Eurostar", model:"Bio Porous Ring 500 ml", category:"filter_media", description:"Gözenekli seramik biyolojik filtre halkası", sourceUrl:"https://atakanpetshop.com/eurostar-bio-porous-ring-500ml-filtre-malzemesi-452-1017", verifiedAt },
  { id:"eurostar-filter-wool-100g", brand:"Eurostar", model:"Filter Wool 100 g", category:"filter_media", description:"Mekanik filtrasyon için akvaryum filtre elyafı", sourceUrl:"https://atakanpetshop.com/eurostar", verifiedAt },
  { id:"eurostar-zyro-max-fix-500ml", brand:"Eurostar", model:"Zyro Max Fix 500 ml", category:"filter_media", description:"Faydalı bakteri kolonileri için yüksek gözenekli seramik biyolojik filtre medyası", sourceUrl:"https://atakanpetshop.com/eurostar-zyro-max-fix-500ml-filtre-malzemesi-452-1021", verifiedAt:"2026-08-24" },
  { id:"eurostar-zyro-max-fix-xl-500ml", brand:"Eurostar", model:"Zyro Max Fix XL 500 ml", category:"filter_media", description:"Büyük gözenekli XL seramik biyolojik filtre medyası", sourceUrl:"https://atakanpetshop.com/eurostar-zyro-max-fix-xl-500ml-filtre-malzemesi-452-1022", verifiedAt:"2026-08-25" },
  { id:"eurostar-hollow-bio-balls-1l", brand:"Eurostar", model:"Hollow Bio Balls 1 L", category:"filter_media", description:"pH üzerinde etkisiz biyokimyasal seramik biyolojik filtre medyası", sourceUrl:"https://atakanpetshop.com/eurostar-hollow-bio-balls-biolojik-filtre-malzemesi-1lt", verifiedAt:"2026-08-24" },
  { id:"eurostar-super-premium-carbon-300ml", brand:"Eurostar", model:"Super Premium Carbon 300 ml", category:"filter_media", description:"Klor, ağır metal, koku ve organik kirleticileri adsorbe eden aktif karbon", sourceUrl:"https://atakanpetshop.com/eurostar-super-premium-carbon-300ml-filtre-malzemesi-452-1016", verifiedAt:"2026-08-24" },
  { id:"eurostar-aquaclay-500ml", brand:"Eurostar", model:"Aquaclay 500 ml", category:"filter_media", description:"Biyolojik filtrasyon için 8–16 mm gözenekli, katkısız ve fırınlanmış kil esaslı filtre medyası", sourceUrl:"https://www.akvaryumexpress.com/eurostar-aquaclay-biyolojik-filtre-malzemesi", verifiedAt:"2026-08-25" },
  { id:"eurostar-aquaclay-substrate-5l", brand:"Eurostar", model:"Aquaclay Bitki Kumu 5 L", category:"substrate", description:"Bitkili akvaryumlar için kil esaslı taban malzemesi · 5 L · ürün kodu 452-2001 · barkod 8681144120018", sourceUrl:"https://atakanpetshop.com/eurostar-aquaclay-bitki-kumu-5lt", verifiedAt:"2026-09-09" },
  { id:"eurostar-aquaclay-substrate-10l", brand:"Eurostar", model:"Aquaclay Bitki Kumu 10 L", category:"substrate", description:"Bitkili akvaryumlar için kil esaslı taban malzemesi · 10 L · ürün kodu 452-2009 · barkod 8681144120094", sourceUrl:"https://atakanpetshop.com/eurostar-aquaclay-bitki-kumu-10lt", verifiedAt:"2026-09-09" },
  { id:"eurostar-seed-eleocharis", brand:"Eurostar", model:"Bitki Tohumu Eleocharis Parvula", category:"plant_seed", description:"Satıcının Eleocharis parvula adıyla sunduğu bitki tohumu seçeneği · ürün kodu 452-1503 · barkod 8681144115038; paket içeriğinin bilimsel kimliği bağımsız olarak doğrulanmamıştır", sourceUrl:"https://atakanpetshop.com/eurostar-bitki-tohumu-eleocharis-parvula", verifiedAt:"2026-09-09" },
  { id:"eurostar-seed-glossostigma", brand:"Eurostar", model:"Bitki Tohumu Glossostigma Elatinoides", category:"plant_seed", description:"Satıcının Glossostigma elatinoides adıyla sunduğu bitki tohumu seçeneği · ürün kodu 452-1501 · barkod 8681144115014; paket içeriğinin bilimsel kimliği bağımsız olarak doğrulanmamıştır", sourceUrl:"https://atakanpetshop.com/eurostar-bitki-tohumu-glossostigma-elatinoides", verifiedAt:"2026-09-09" },
  { id:"eurostar-seed-hemianthus", brand:"Eurostar", model:"Bitki Tohumu Hemianthus Callitrichoides", category:"plant_seed", description:"Satıcının Hemianthus callitrichoides adıyla sunduğu bitki tohumu seçeneği · ürün kodu 452-1502 · barkod 8681144115021; paket içeriğinin bilimsel kimliği bağımsız olarak doğrulanmamıştır", sourceUrl:"https://atakanpetshop.com/eurostar-bitki-tohumu-hemianthus-callitrichoides", verifiedAt:"2026-09-09" },
  { id:"eurostar-water-clarifier-500ml", brand:"Eurostar", model:"Su Berraklaştırıcı 500 ml", category:"water_conditioner", description:"Askıdaki ince partiküllerin filtre tarafından tutulmasını destekleyen su berraklaştırıcı", sourceUrl:"https://atakanpetshop.com/eurostar", verifiedAt:"2026-08-24" },
  { id:"eurostar-ammonia-zeolite-500ml", brand:"Eurostar", model:"Amonyak Giderici Zeolit 500 ml", category:"filter_media", description:"Amonyak, nitrit ve ağır metal kontrolüne yardımcı doğal zeolit filtre medyası", sourceUrl:"https://www.akvaryumexpress.com/eurostar-amonyak-giderici-zeolite-filtre-malzemesi-500-ml", verifiedAt:"2026-08-25" },
  { id:"eurostar-micro-bio-pellets-1000ml", brand:"Eurostar", model:"Micro Bio Pellets 1000 ml", category:"filter_media", description:"Nitrat ve fosfat kontrolünü destekleyen biyolojik filtre peleti", sourceUrl:"https://atakanpetshop.com/eurostar", verifiedAt:"2026-08-24" },
  { id:"eurostar-super-premium-carbon-1l", brand:"Eurostar", model:"Super Premium Carbon 1 L", category:"filter_media", description:"Tatlı su sistemlerinde organik kirletici, ilaç kalıntısı ve koku giderimi için granül aktif karbon · yaklaşık 450 g", sourceUrl:"https://www.akvaryumexpress.com/eurostar-super-premium-karbon-komur-filtre-malzemesi-1lt", verifiedAt:"2026-08-25" },
  { id:"eurostar-bio-filter-ring-white-500ml", brand:"Eurostar", model:"Bio Filter Ring Beyaz 500 ml", category:"filter_media", description:"Amonyak ve nitrit dönüşümünü destekleyen yüksek gözenekli beyaz seramik biyolojik filtre halkası", sourceUrl:"https://www.akvaryumexpress.com/eurostar-bio-filtre-ring-beyaz-500ml", verifiedAt:"2026-08-25" },
  { id:"eurostar-bio-filter-ring-brown-500ml", brand:"Eurostar", model:"Bio Filter Ring Kahverengi 500 ml", category:"filter_media", description:"Faydalı bakteri kolonizasyonu için kahverengi seramik biyolojik filtre halkası", sourceUrl:"https://www.akvaryumexpress.com/yeni-urunler/sayfa/3", verifiedAt:"2026-08-25" },
  { id:"eurostar-bio-brick-fix-500ml", brand:"Eurostar", model:"Bio Brick Seramik Fix 500 ml", category:"filter_media", description:"Sump ve filtre sepetlerinde biyolojik filtrasyon için sabit yerleşimli gözenekli seramik medya", sourceUrl:"https://www.akvaryumexpress.com/akvaryum-filtre-malzemeleri/sayfa/64", verifiedAt:"2026-08-25" },
  { id:"eurostar-bio-glass-ring-500ml", brand:"Eurostar", model:"Bio Glass Ring 500 ml", category:"filter_media", description:"pH ve KH dengesini değiştirmeden biyolojik filtrasyon yüzeyi sağlayan gözenekli cam-seramik halka", sourceUrl:"https://www.akvaryumexpress.com/eurostar-seramik-500ml", verifiedAt:"2026-08-25" },
  { id:"nubios-seramik-halka-500g", brand:"Nubios", model:"Seramik Halka 500 g", category:"filter_media", description:"Biyolojik filtrasyon için gözenekli seramik halka", sourceUrl:"https://www.ozelyem.com/nubios", verifiedAt:"2026-08-24" },
  { id:"nubios-aktif-karbon-300g", brand:"Nubios", model:"Aktif Karbon 300 g", category:"filter_media", description:"Kimyasal filtrasyon için aktif karbon filtre medyası", sourceUrl:"https://www.ozelyem.com/nubios", verifiedAt:"2026-08-24" },
  { id:"liya-ly202-active-carbon-500g", brand:"Liya", model:"LY202 Aktif Karbon 500 g", category:"filter_media", description:"Organik atık, renk ve kokunun giderilmesine yardımcı aktif karbon filtre medyası", sourceUrl:"https://atakanpetshop.com/liya", verifiedAt:"2026-08-24" },
  { id:"liya-biological-ceramic-500g", brand:"Liya", model:"Biyolojik Seramik 500 g", category:"filter_media", description:"Faydalı bakteri kolonileri için gözenekli seramik biyolojik filtre medyası", sourceUrl:"https://atakanpetshop.com/liya", verifiedAt:"2026-08-24" },
  { id:"liya-zeolite-500g", brand:"Liya", model:"Zeolit 500 g", category:"filter_media", description:"Amonyak kontrolüne yardımcı doğal zeolit filtre medyası", sourceUrl:"https://atakanpetshop.com/liya", verifiedAt:"2026-08-24" },
  ...["30 × 30 cm", "30 × 40 cm", "40 × 50 cm", "40 × 60 cm"].map((size):CareProductProfile=>({
    id:`mufan-six-layer-filter-sponge-${size.replace(/[^0-9]+/g,"-").replace(/(^-|-$)/g,"")}`,
    brand:"Mufan", model:`6 Katlı Biyolojik Filtre Süngeri ${size}`, category:"filter_media",
    description:`Mekanik ve biyolojik filtrasyon için kesilerek kullanılabilen, yıkanabilir altı katmanlı filtre süngeri · ${size} · satıcı başlığı ile seçenek alanındaki kalınlık değerleri çeliştiğinden kalınlık belirtilmedi`,
    sourceUrl:"https://atakanpetshop.com/mufan-6-katli-biyolojik-filtre-sungeri-30x30x18-cm", verifiedAt:"2026-08-24",
  })),
  ...products("Aquael","filter_media","https://www.aquael.com/wp-content/uploads/2024/09/new_media_info_en_131452_131453_131454_131455_677.pdf",[
    ["NanoMax Bio 1 L","Yaklaşık 2.000 m²/L yüzey alanlı sinterlenmiş seramik biyolojik filtre medyası · 1 L"],
    ["NatureMax Bio 1 L","Su pH, KH ve GH değerlerini değiştirmeyen doğal mikrogözenekli biyolojik filtre medyası · 1 L"],
    ["PearlMax Bio 1 L","Nitrifikasyon, denitrifikasyon ve mineralizasyonu destekleyen sinterlenmiş cam biyolojik filtre medyası · 1 L"],
    ["Magic Balls 1 L","Üç mikrona kadar parçacıkları yakalamak üzere tasarlanmış yeniden kullanılabilir mekanik filtre medyası · 1 L"],
  ],"2026-09-11"),
  ...products("Aquael","filter_media","https://www.aquael.com/products/aquaristics/pond-filter-media/biologiczne/",[
    ["BioCeraMAX Pro 600 1 L","Tatlı ve deniz suyu için 600 m²/L yüzey alanlı gözenekli seramik biyolojik filtre medyası · 1 L"],
    ["BioCeraMAX UltraPro 1200 1 L","Tatlı ve deniz suyu için 1.200 m²/L yüzey alanlı sinterlenmiş cam biyolojik filtre medyası · 1 L"],
    ["BioCeraMAX UltraPro 1600 1 L","Tatlı ve deniz suyu için 1.600 m²/L yüzey alanlı sinterlenmiş cam biyolojik filtre medyası · 1 L"],
    ["Multi Cartridge BioCeraMAX","Aquael MultiKani filtre için BioCeraMAX biyolojik medya kartuşu"],
  ],"2026-09-11"),
  ...products("Aquael","filter_media","https://www.aquael.com/products/aquaristics/pond-filter-media/chemiczne/",[
    ["CarboMAX Plus 1 L","Kloru, ağır metal iyonlarını, ilaç kalıntılarını ve renklenmeyi adsorbe eden aktif karbon · 1 L"],
    ["FZN Mini CarboMAX Media Pack 3'lü","FZN Mini için aktif karbonlu kimyasal filtre kartuşu · 3 adet"],
    ["FZN Mini PhosMAX Media Pack 3'lü","FZN Mini için fosfat tutucu filtre kartuşu · 3 adet"],
    ["Magic Algae Stop","Fosfatı bağlayarak alg gelişimini sınırlamaya yardımcı kimyasal filtre kartuşu"],
    ["Multi Cartridge CarboMAX","Aquael MultiKani filtre için aktif karbon kartuşu"],
    ["Multi Cartridge PhosMAX Basic","Aquael MultiKani filtre için fosfat tutucu kartuş"],
    ["Multi Cartridge ZeoMAX","Aquael MultiKani filtre için zeolit kartuşu"],
    ["NitroMAX","Nitrat kontrolüne yardımcı kimyasal filtre medyası"],
    ["PhosMAX","Fosfat kontrolüne yardımcı kimyasal filtre medyası"],
    ["Sponge ASAP 300 CarboMAX 2'li","ASAP 300 için aktif karbon emdirilmiş filtre süngeri · 2 adet"],
    ["Sponge ASAP 300 PhosMAX 2'li","ASAP 300 için fosfat tutucu filtre süngeri · 2 adet"],
    ["Sponge ASAP 500 PhosMAX 2'li","ASAP 500 için fosfat tutucu filtre süngeri · 2 adet"],
    ["Sponge ASAP 700 CarboMAX 2'li","ASAP 700 için aktif karbon emdirilmiş filtre süngeri · 2 adet"],
    ["Sponge ASAP 700 PhosMAX 2'li","ASAP 700 için fosfat tutucu filtre süngeri · 2 adet"],
    ["Sponge FAN 1 Plus Carbo 2'li","FAN 1 Plus için aktif karbon emdirilmiş filtre süngeri · 2 adet"],
    ["Sponge FAN 2 Plus Carbo 2'li","FAN 2 Plus için aktif karbon emdirilmiş filtre süngeri · 2 adet"],
    ["Sponge FAN 3 Plus Carbo 2'li","FAN 3 Plus için aktif karbon emdirilmiş filtre süngeri · 2 adet"],
    ["Sponge FAN Mikro Plus Carbo 2'li","FAN Mikro Plus için aktif karbon emdirilmiş filtre süngeri · 2 adet"],
    ["Sponge FAN Mini Plus Carbo 2'li","FAN Mini Plus için aktif karbon emdirilmiş filtre süngeri · 2 adet"],
    ["Sponge PAT Mini CarboMAX 2'li","PAT Mini için aktif karbon emdirilmiş filtre süngeri · 2 adet"],
    ["Sponge PAT Mini PhosMAX 2'li","PAT Mini için fosfat tutucu filtre süngeri · 2 adet"],
    ["ZeoMAX Plus 1 L","Tatlı su sistemlerinde amonyak kontrolüne yardımcı doğal zeolit medya · 1 L"],
  ],"2026-09-11"),
  ...products("Aquael","filter_media","https://www.aquael.com/products/aquaristics/pond-filter-media/mechaniczne-2/",[
    ["Cartridge ASAP 300 Standard","ASAP 300 için standart mekanik filtre kartuşu"],
    ["Cartridge ASAP 500 Standard","ASAP 500 için standart mekanik filtre kartuşu"],
    ["Cartridge ASAP 700 Standard","ASAP 700 için standart mekanik filtre kartuşu"],
    ["FZN Mini Standard Media Pack 3'lü","FZN Mini için standart mekanik filtre kartuşu · 3 adet"],
    ["Sponge ASAP 300 Standard 2'li","ASAP 300 için standart mekanik filtre süngeri · 2 adet"],
    ["Sponge ASAP 500 Standard 2'li","ASAP 500 için standart mekanik filtre süngeri · 2 adet"],
    ["Sponge ASAP 700 Standard 2'li","ASAP 700 için standart mekanik filtre süngeri · 2 adet"],
    ["Sponge FAN 1 Plus 2'li","FAN 1 Plus için standart filtre süngeri · 2 adet"],
    ["Sponge FAN 2 Plus 2'li","FAN 2 Plus için standart filtre süngeri · 2 adet"],
    ["Sponge FAN 3 Plus 2'li","FAN 3 Plus için standart filtre süngeri · 2 adet"],
    ["Sponge FAN Mikro Plus 2'li","FAN Mikro Plus için standart filtre süngeri · 2 adet"],
    ["Sponge FAN Mini Plus 2'li","FAN Mini Plus için standart filtre süngeri · 2 adet"],
    ["Sponge FZN-1 2'li","FZN-1 için standart filtre süngeri · 2 adet"],
    ["Sponge FZN-2 2'li","FZN-2 için standart filtre süngeri · 2 adet"],
    ["Sponge FZN-3 2'li","FZN-3 için standart filtre süngeri · 2 adet"],
    ["Sponge High Density MultiKani 800","MultiKani 800 için yüksek yoğunluklu mekanik filtre süngeri"],
    ["Sponge Low Density MultiKani 800","MultiKani 800 için düşük yoğunluklu mekanik filtre süngeri"],
    ["Sponge MiniKani 80/120","MiniKani 80 ve 120 için filtre süngeri"],
    ["Sponge PAT Mini 2'li","PAT Mini için standart filtre süngeri · 2 adet"],
    ["Sponge PAT Mini Dense","PAT Mini için yoğun gözenekli filtre süngeri"],
    ["Sponge Turbo 500 2'li","Turbo 500 için standart filtre süngeri · 2 adet"],
    ["Sponge Turbo 1000/1500/2000 2'li","Turbo 1000, 1500 ve 2000 için standart filtre süngeri · 2 adet"],
    ["Sponge Unifilter 500 3'lü","Unifilter 500 için standart filtre süngeri · 3 adet"],
    ["Sponge Unifilter 750/1000 3'lü","Unifilter 750 ve 1000 için standart filtre süngeri · 3 adet"],
    ["WoolMax Pro","İnce parçacıkları tutan mekanik filtre elyafı"],
  ],"2026-09-11"),
  ...products("Aquael","filter_media","https://www.aquael.com/products/aquaristics/aquaristics/ultramax-maxi-kani-media/",[
    ["UltraMax/MaxiKani Standard 20 PPI","UltraMax ve MaxiKani filtrelerde yüksek akış öncelikli 20 PPI sünger"],
    ["UltraMax/MaxiKani Finish 30 PPI","UltraMax ve MaxiKani filtrelerde akış ve berraklık dengeli 30 PPI sünger"],
    ["UltraMax/MaxiKani Super Finish 45 PPI","UltraMax ve MaxiKani filtrelerde ince mekanik filtrasyon sağlayan 45 PPI sünger"],
    ["UltraMax/MaxiKani WoolMax Pro","UltraMax ve MaxiKani filtreler için ince mekanik filtre elyafı"],
  ],"2026-09-11"),
  ...products("Aquael","filter_media","https://www.aquael.com/products/aquaristics/pond-filter-media/fzn-pro-sponge-cartridge/",[
    ["FZN Pro 700 Sponge Cartridge","FZN Pro 700 ana sepetine uyumlu mekanik filtre süngeri"],
    ["FZN Pro 1000 Sponge Cartridge","FZN Pro 1000 ana sepetine uyumlu mekanik filtre süngeri"],
    ["FZN Pro 1500 Sponge Cartridge","FZN Pro 1500 ana sepetine uyumlu mekanik filtre süngeri"],
    ["FZN Pro Prefilter Sponge Cartridge","FZN Pro ailesi için silindirik kaba gözenekli ön filtre süngeri"],
  ],"2026-09-11"),
  ...products("Aquael","filter_media","https://www.aquael.com/products/aquaristics/pond-filter-media/media-pack-fzn-pro/",[
    ["FZN Pro Media Pack Standard 3'lü","FZN Pro filtreler için mekanik filtre elyafı kartuşu · 3 adet"],
    ["FZN Pro Media Pack CarboMAX 3'lü","FZN Pro filtreler için aktif karbonlu mekanik ve kimyasal kartuş · 3 adet"],
    ["FZN Pro Media Pack PhosMAX 3'lü","FZN Pro filtreler için fosfat tutucu kartuş · 3 adet"],
  ],"2026-09-11"),
  ...products("Aquael","filter_media","https://www.aquael.com/products/aquaristics/pond-filter-media/aquarium-filter-media-bags/",[
    ["Filter Media Bag 15 × 20 cm","Yaklaşık 1 L gevşek filtre medyası için fermuarlı torba · 15 × 20 cm"],
    ["Filter Media Bag 15 × 30 cm","Yaklaşık 2 L gevşek filtre medyası için fermuarlı torba · 15 × 30 cm"],
    ["Filter Media Bag 28 × 32 cm","Yaklaşık 3,5 L gevşek filtre medyası için fermuarlı torba · 28 × 32 cm"],
  ],"2026-09-11"),
  ...products("Aquael","substrate","https://www.aquael.com/products/aquaristics/substrates-gravels/kwarcowe-wielobarwne-2/",[
    ["Aqua Decoris White 2–3 mm 1 kg","Tatlı su akvaryumları için beyaz kaplamalı kuvars çakıl · 2–3 mm · 1 kg"],
    ["Aqua Decoris Black 2–3 mm 1 kg","Tatlı su akvaryumları için siyah kaplamalı kuvars çakıl · 2–3 mm · 1 kg"],
    ["Aqua Decoris Green 2–3 mm 1 kg","Tatlı su akvaryumları için yeşil kaplamalı kuvars çakıl · 2–3 mm · 1 kg"],
    ["Aqua Decoris Yellow 2–3 mm 1 kg","Tatlı su akvaryumları için sarı kaplamalı kuvars çakıl · 2–3 mm · 1 kg"],
    ["Aqua Decoris Turquoise 2–3 mm 1 kg","Tatlı su akvaryumları için turkuaz kaplamalı kuvars çakıl · 2–3 mm · 1 kg"],
    ["Aqua Decoris Fuchsia 2–3 mm 1 kg","Tatlı su akvaryumları için fuşya kaplamalı kuvars çakıl · 2–3 mm · 1 kg"],
    ["Aqua Decoris Red 2–3 mm 1 kg","Tatlı su akvaryumları için kırmızı kaplamalı kuvars çakıl · 2–3 mm · 1 kg"],
    ["Aqua Decoris Violet 2–3 mm 1 kg","Tatlı su akvaryumları için mor kaplamalı kuvars çakıl · 2–3 mm · 1 kg"],
    ["Aqua Decoris Blue 2–3 mm 1 kg","Tatlı su akvaryumları için mavi kaplamalı kuvars çakıl · 2–3 mm · 1 kg"],
    ["Aqua Decoris Lila Rose 2–3 mm 1 kg","Tatlı su akvaryumları için lila-pembe kaplamalı kuvars çakıl · 2–3 mm · 1 kg"],
  ],"2026-09-11"),
  ...products("Aquael","substrate","https://www.aquael.com/products/aquaristics/substrates-gravels/kwarcowe-wielobarwne/",[
    ["Natural Multicolored Gravel 1,4–2 mm 2 kg","Tatlı su akvaryumları için doğal çok renkli çakıl · 1,4–2 mm · 2 kg"],
    ["Natural Multicolored Gravel 1,4–2 mm 10 kg","Tatlı su akvaryumları için doğal çok renkli çakıl · 1,4–2 mm · 10 kg"],
    ["Natural Multicolored Gravel 3–5 mm 2 kg","Tatlı su akvaryumları için doğal çok renkli çakıl · 3–5 mm · 2 kg"],
    ["Natural Multicolored Gravel 3–5 mm 10 kg","Tatlı su akvaryumları için doğal çok renkli çakıl · 3–5 mm · 10 kg"],
    ["Natural Multicolored Gravel 5–10 mm 2 kg","Tatlı su akvaryumları için doğal çok renkli çakıl · 5–10 mm · 2 kg"],
    ["Natural Multicolored Gravel 5–10 mm 10 kg","Tatlı su akvaryumları için doğal çok renkli çakıl · 5–10 mm · 10 kg"],
  ],"2026-09-11"),
  ...products("Aquael","substrate","https://www.aquael.com/wp-content/uploads/2024/05/aquael-product-catalogue-2024_670.pdf",[
    ["Quartz Sand 0,1–0,3 mm 2 kg","Dip balıkları için uygun ince doğal kuvars kumu · 0,1–0,3 mm · 2 kg"],
    ["Quartz Sand 0,1–0,3 mm 10 kg","Dip balıkları için uygun ince doğal kuvars kumu · 0,1–0,3 mm · 10 kg"],
    ["Quartz Sand 0,4–1,2 mm 2 kg","Tatlı su akvaryumları için doğal kuvars kumu · 0,4–1,2 mm · 2 kg"],
    ["Quartz Sand 0,4–1,2 mm 10 kg","Tatlı su akvaryumları için doğal kuvars kumu · 0,4–1,2 mm · 10 kg"],
    ["Quartz Sand 1,6–4 mm 2 kg","Tatlı su akvaryumları için iri doğal kuvars kumu · 1,6–4 mm · 2 kg"],
    ["Quartz Sand 1,6–4 mm 10 kg","Tatlı su akvaryumları için iri doğal kuvars kumu · 1,6–4 mm · 10 kg"],
  ],"2026-09-11"),
  ...products("Aquael","substrate","https://www.aquael.com/products/aquaristics/substrates-gravels/bazaltowe/",[
    ["Basalt Gravel 2–4 mm 2 kg","Koyu taban tercih eden canlılar için doğal bazalt çakıl · 2–4 mm · 2 kg"],
    ["Basalt Gravel 2–4 mm 10 kg","Koyu taban tercih eden canlılar için doğal bazalt çakıl · 2–4 mm · 10 kg"],
  ],"2026-09-11"),
  ...products("Aquael","substrate","https://www.aquael.com/products/aquaristics/substrates-gravels/dolomitowe/",[
    ["Dolomite Gravel 2–4 mm 2 kg","Sert ve alkali suyu tercih eden türler için doğal dolomit çakıl · 2–4 mm · 2 kg"],
    ["Dolomite Gravel 2–4 mm 10 kg","Sert ve alkali suyu tercih eden türler için doğal dolomit çakıl · 2–4 mm · 10 kg"],
  ],"2026-09-11"),
  ...products("Aquael","substrate","https://www.aquael.com/wp-content/uploads/2024/05/aquael-product-catalogue-2024_670.pdf",[
    ["H.E.L.P. Advanced Soil Plants 3 L","Bitkili akvaryumlar için 1–4 mm siyah granüllü aktif taban · 3 L"],
    ["H.E.L.P. Advanced Soil Plants 8 L","Bitkili akvaryumlar için 1–4 mm siyah granüllü aktif taban · 8 L"],
    ["H.E.L.P. Advanced Soil Shrimp 3 L","Karides akvaryumlarında su değerlerini dengelemeye yardımcı aktif taban · 3 L"],
    ["H.E.L.P. Advanced Soil Original 3 L","Tatlı su akvaryumları için aktif Japon taban malzemesi · 3 L"],
    ["H.E.L.P. Advanced Soil Original 8 L","Tatlı su akvaryumları için aktif Japon taban malzemesi · 8 L"],
  ],"2026-09-11"),
  ...products("Aquael","substrate","https://www.aquael.com/products/aquaristics/substrates-gravels/aqua-grunt-floran/",[
    ["Aqua Decoris Grunt 1,25 kg","Demir ve mikroelement içeren mikrogözenekli bitki tabanı · 1,25 kg"],
    ["Aqua Decoris Flora 1,5 kg","Bitkili tatlı su akvaryumları için besleyici taban malzemesi · 1,5 kg"],
  ],"2026-09-11"),
  ...products("Aquael","food","https://www.aquael.com/products/aquaristics/acti-food/actigran/",[
    ["ActiGran 100 ml","Tropikal akvaryum balıkları için günlük çok bileşenli granül yem · 100 ml"],
    ["ActiGran 250 ml","Tropikal akvaryum balıkları için günlük çok bileşenli granül yem · 250 ml"],
    ["ActiGran 1000 ml","Tropikal akvaryum balıkları için günlük çok bileşenli granül yem · 1000 ml"],
  ],"2026-09-11"),
  ...products("Aquael","food","https://www.aquael.com/products/aquaristics/acti-food/spirutabs/",[
    ["SpiruTabs 100 ml","Yüzde 20 spirulina içeren, cama yapıştırılabilen veya dibe bırakılabilen bitkisel tablet yem · 100 ml"],
    ["SpiruTabs 250 ml","Yüzde 20 spirulina içeren, cama yapıştırılabilen veya dibe bırakılabilen bitkisel tablet yem · 250 ml"],
  ],"2026-09-11"),
  ...products("Aquael","food","https://www.aquael.com/products/aquaristics/acti-food/tortue/",[
    ["Tortue 100 ml","Su kaplumbağaları için Gammarus ve spirulinalı bitkisel çubuk içeren karma yem · 100 ml"],
    ["Tortue 250 ml","Su kaplumbağaları için Gammarus ve spirulinalı bitkisel çubuk içeren karma yem · 250 ml"],
    ["Tortue 1000 ml","Su kaplumbağaları için Gammarus ve spirulinalı bitkisel çubuk içeren karma yem · 1000 ml"],
  ],"2026-09-11"),
  ...products("Aquael","food","https://www.aquael.com/products/aquaristics/acti-food/vegetal/",[
    ["Vegetal 10 g","Canlı doğuranlar ve otçul cikletler için bitkisel proteinli pul yem · 10 g"],
    ["Vegetal 100 ml","Canlı doğuranlar ve otçul cikletler için bitkisel proteinli pul yem · 100 ml"],
    ["Vegetal 250 ml","Canlı doğuranlar ve otçul cikletler için bitkisel proteinli pul yem · 250 ml"],
    ["Vegetal 11 L","Canlı doğuranlar ve otçul cikletler için bitkisel proteinli pul yem · 11 L"],
  ],"2026-09-11"),
  ...products("Aquael","food","https://www.aquael.com/products/aquaristics/acti-food/goldgran/",[
    ["GoldGran 100 ml","Japon balıkları ve diğer soğuk su balıkları için kolay sindirilen granül yem · 100 ml"],
    ["GoldGran 250 ml","Japon balıkları ve diğer soğuk su balıkları için kolay sindirilen granül yem · 250 ml"],
    ["GoldGran 1000 ml","Japon balıkları ve diğer soğuk su balıkları için kolay sindirilen granül yem · 1000 ml"],
  ],"2026-09-11"),
  ...products("Aquael","food","https://www.aquael.com/products/aquaristics/acti-food/actimin/",[
    ["ActiMin 10 g","Akvaryum balıkları için günlük çok bileşenli pul yem · 10 g"],
    ["ActiMin 100 ml","Akvaryum balıkları için günlük çok bileşenli pul yem · 100 ml"],
    ["ActiMin 250 ml","Akvaryum balıkları için günlük çok bileşenli pul yem · 250 ml"],
    ["ActiMin 1000 ml","Akvaryum balıkları için günlük çok bileşenli pul yem · 1000 ml"],
  ],"2026-09-11"),
  ...products("Aquael","food","https://www.aquael.com/products/aquaristics/acti-food/betta/",[
    ["Betta 100 ml","Betta balıkları için plankton, kan kurdu ve krill içeren dengeli yem · 100 ml"],
  ],"2026-09-11"),
  ...products("Aquael","food","https://www.aquael.com/products/aquaristics/acti-food/goldvit/",[
    ["GoldVit 100 ml","Japon balıkları ve diğer soğuk su balıkları için kolay sindirilen pul yem · 100 ml"],
    ["GoldVit 250 ml","Japon balıkları ve diğer soğuk su balıkları için kolay sindirilen pul yem · 250 ml"],
    ["GoldVit 1000 ml","Japon balıkları ve diğer soğuk su balıkları için kolay sindirilen pul yem · 1000 ml"],
    ["GoldVit 11 L","Japon balıkları ve diğer soğuk su balıkları için kolay sindirilen pul yem · 11 L"],
  ],"2026-09-11"),
  ...products("Aquael","food","https://www.aquael.com/products/aquaristics/acti-food/cichlid/",[
    ["Cichlid 100 ml","Doğu Afrika göl cikletleri için bitkisel ağırlıklı dengeli pul yem · 100 ml"],
    ["Cichlid 250 ml","Doğu Afrika göl cikletleri için bitkisel ağırlıklı dengeli pul yem · 250 ml"],
  ],"2026-09-11"),
  ...products("Aquael","food","https://www.aquael.com/products/aquaristics/acti-food/cichlidgran/",[
    ["CichlidGran 250 ml","Doğu Afrika göl cikletleri için bitkisel ağırlıklı dengeli granül yem · 250 ml"],
    ["CichlidGran 1000 ml","Doğu Afrika göl cikletleri için bitkisel ağırlıklı dengeli granül yem · 1000 ml"],
  ],"2026-09-11"),
  ...products("Aquael","food","https://www.aquael.com/products/aquaristics/acti-food/acticolor/",[
    ["Acti Color 10 g","Beta-karoten ve doğal astaksantin içeren renk destekli pul yem · 10 g"],
    ["Acti Color 100 ml","Beta-karoten ve doğal astaksantin içeren renk destekli pul yem · 100 ml"],
    ["Acti Color 250 ml","Beta-karoten ve doğal astaksantin içeren renk destekli pul yem · 250 ml"],
  ],"2026-09-11"),
  ...products("Aquael","food","https://www.aquael.com/products/aquaristics/acti-food/guppy/",[
    ["Guppy 100 ml","Guppyler için sucul böcek larvası temelli ince pul yem · 100 ml"],
  ],"2026-09-11"),
  ...products("Aquael","food","https://www.aquael.com/products/aquaristics/acti-food/crustabs/",[
    ["CrusTabs 10 g","Tatlı su karidesleri ve diğer kabuklular için mineral destekli tablet yem · 10 g"],
    ["CrusTabs 100 ml","Tatlı su karidesleri ve diğer kabuklular için mineral destekli tablet yem · 100 ml"],
  ],"2026-09-11"),
  ...products("Aquael","food","https://www.aquael.com/products/aquaristics/acti-food/artemin/",[
    ["ArteMin 10 g","Artemia salina içeren yüksek proteinli pul yem · 10 g"],
    ["ArteMin 100 ml","Artemia salina içeren yüksek proteinli pul yem · 100 ml"],
    ["ArteMin 250 ml","Artemia salina içeren yüksek proteinli pul yem · 250 ml"],
  ],"2026-09-11"),
  ...products("Aquael","food","https://www.aquael.com/products/aquaristics/acti-food/discus-vit/",[
    ["DiscusVit 100 ml","Discus ve Güney/Orta Amerika cikletleri için yavaş batan küçük granül yem · 100 ml"],
    ["DiscusVit 250 ml","Discus ve Güney/Orta Amerika cikletleri için yavaş batan küçük granül yem · 250 ml"],
    ["DiscusVit 1000 ml","Discus ve Güney/Orta Amerika cikletleri için yavaş batan küçük granül yem · 1000 ml"],
  ],"2026-09-11"),
  ...products("Aquael","water_conditioner","https://www.aquael.com/products/aquaristics/treatments-en/acti-clean/",[
    ["Acti Clean 100 ml","Kloru ve zararlı bileşikleri bağlayan, ağır metalleri güvenli forma getirmeye yardımcı musluk suyu düzenleyicisi · 100 ml"],
    ["Acti Clean 250 ml","Kloru ve zararlı bileşikleri bağlayan, ağır metalleri güvenli forma getirmeye yardımcı musluk suyu düzenleyicisi · 250 ml"],
  ],"2026-09-11"),
  ...products("Aquael","bacteria","https://www.aquael.com/products/aquaristics/treatments-en/acti-bactol/",[
    ["Acti Bactol 100 ml","Filtre medyası ve tabanda biyolojik filtrasyonun başlamasını destekleyen canlı bakteri kültürü · 100 ml"],
    ["Acti Bactol 250 ml","Filtre medyası ve tabanda biyolojik filtrasyonun başlamasını destekleyen canlı bakteri kültürü · 250 ml"],
  ],"2026-09-11"),
  ...products("Aquael","decoration","https://www.aquael.com/products/aquaristics/aquaristics/shrimp-wood-mix/",[
    ["Shrimp Wood Mix 25 kg","Karides ve nano akvaryumlar için doğal küçük köklerden oluşan dekorasyon karışımı · 25 kg"],
  ],"2026-09-11"),
  ...products("Aquael","decoration","https://www.aquael.com/products/aquaristics/aquaristics/red-driftwood-mix/",[
    ["Red Driftwood Mix 25 kg","Farklı biçim ve boylarda kızıl-kahverengi doğal köklerden oluşan dekorasyon karışımı · 25 kg"],
  ],"2026-09-11"),
  ...products("Aquael","decoration","https://www.aquael.com/products/aquaristics/aquaristics/lava-red-mix/",[
    ["Lava Red Mix 10 kg","Farklı boylarda doğal volkanik kırmızı lav taşlarından oluşan dekorasyon karışımı · 10 kg"],
  ],"2026-09-11"),
  ...products("Aquael","decoration","https://www.aquael.com/products/aquaristics/aquaristics/leopard-stone-mix/",[
    ["Leopard Stone Mix 10 kg","Farklı boylarda çizgili doğal Leopard taşlarından oluşan dekorasyon karışımı · 10 kg"],
  ],"2026-09-11"),
  ...products("Aquael","decoration","https://www.aquael.com/products/aquaristics/aquaristics/iron-driftwood-mix/",[
    ["Iron Driftwood Mix 25 kg","Farklı biçim ve boylarda sert, koyu renkli doğal köklerden oluşan dekorasyon karışımı · 25 kg"],
  ],"2026-09-11"),
  ...products("Aquael","decoration","https://www.aquael.com/products/aquaristics/decorations/plastic-plants/",[
    ["Plastic Plant B2207 24 × 12 × 16 cm","Akvaryum düzenlemesi için B2207 model yapay bitki · 24 × 12 × 16 cm"],
    ["Plastic Plant Mix 5'li 10 cm","Akvaryum düzenlemesi için 10 cm yapay bitki karışımı · 5 adet"],
    ["Plastic Plant PR-203 7 cm","Akvaryum düzenlemesi için PR-203 model yapay bitki · 7 cm"],
    ["Plastic Plant PR-410 10 cm","Akvaryum düzenlemesi için PR-410 model yapay bitki · 10 cm"],
    ["Plastic Plant CP-035 20 cm","Akvaryum düzenlemesi için CP-035 model yapay bitki · 20 cm"],
    ["Plastic Plant PR-402 10 cm","Akvaryum düzenlemesi için PR-402 model yapay bitki · 10 cm"],
    ["Plastic Plant AP-005 20 cm","Akvaryum düzenlemesi için AP-005 model yapay bitki · 20 cm"],
    ["Plastic Plant CP-057 7 cm","Akvaryum düzenlemesi için CP-057 model yapay bitki · 7 cm"],
    ["Plastic Plant AP-012 20 cm","Akvaryum düzenlemesi için AP-012 model yapay bitki · 20 cm"],
    ["Plastic Plant PR-203 20 cm","Akvaryum düzenlemesi için PR-203 model yapay bitki · 20 cm"],
    ["Plastic Plant B2001 23 × 16 × 14 cm","Akvaryum düzenlemesi için B2001 model yapay bitki · 23 × 16 × 14 cm"],
  ],"2026-09-11"),
  ...products("Aquael","decoration","https://www.aquael.com/products/aquaristics/decorations/korzenie-naturalne/",[
    ["Mangro Root S","Akvaryum düzenlemesi için doğal mangrov kökü · S boy"],
    ["Mangro Root M","Akvaryum düzenlemesi için doğal mangrov kökü · M boy"],
    ["Mangro Root L","Akvaryum düzenlemesi için doğal mangrov kökü · L boy"],
    ["Root Driftwood S","Akvaryum düzenlemesi için doğal driftwood kökü · S boy"],
    ["Root Driftwood M","Akvaryum düzenlemesi için doğal driftwood kökü · M boy"],
    ["Root Driftwood L","Akvaryum düzenlemesi için doğal driftwood kökü · L boy"],
    ["Root Driftwood XL","Akvaryum düzenlemesi için doğal driftwood kökü · XL boy"],
    ["Driftwood Mix Pack 8–10 kg","Farklı biçim ve boylarda doğal driftwood köklerinden oluşan karışım · 8–10 kg"],
  ],"2026-09-11"),
  ...products("Aquael","decoration","https://www.aquael.com/products/aquaristics/decorations/kamienie-naturalne/",[
    ["Dinosaur Bone Stone Mix 20 kg","Farklı biçim ve boylarda doğal Dinosaur Bone taşlarından oluşan dekorasyon karışımı · 20 kg"],
    ["Black Quartz Rock Stone Mix 20 kg","Farklı biçim ve boylarda doğal siyah kuvars taşlarından oluşan dekorasyon karışımı · 20 kg"],
  ],"2026-09-11"),
  ...aquariumProducts("aquarium_set","https://www.aquael.com/products/aquaristics/aquaristics/neo-set/",[
    ["Neo Set 125",125,[81,36,51],"125 L tam akvaryum seti · 81 × 36 × 51 cm · Neo Bio 1000 filtre, Platinium 150 W ısıtıcı ve iki 10 W LED modülü",["Neo Bio 1000","Platinium Heater 150 W","Leddy Slim BT 10 W × 2"]],
    ["Neo Set 130",130,[61,41,60.5],"130 L tam akvaryum seti · 61 × 41 × 60,5 cm · Neo Bio 1000 filtre, Platinium 150 W ısıtıcı ve iki 10 W LED modülü",["Neo Bio 1000","Platinium Heater 150 W","Leddy Tube Sunny 2.0 10 W × 2"]],
    ["Neo Set 200",200,[101,41,56],"200 L tam akvaryum seti · 101 × 41 × 56 cm · Neo Bio 1000 filtre, Platinium 200 W ısıtıcı ve iki 14 W LED modülü",["Neo Bio 1000","Platinium Heater 200 W","Leddy Tube Sunny 2.0 14 W × 2"]],
    ["Neo Set 240",240,[121,41,56],"240 L tam akvaryum seti · 121 × 41 × 56 cm · Neo Bio 1000 filtre, Platinium 250 W ısıtıcı ve iki 17 W LED modülü",["Neo Bio 1000","Platinium Heater 250 W","Leddy Tube Sunny 2.0 17 W × 2"]],
  ]),
  ...aquariumProducts("aquarium_set","https://www.aquael.com/products/aquaristics/aquarium-sets/aqua-4/",[
    ["Aqua 4 Kids Rectangular",25,[41,25,25],"25 L dik ön camlı tam set · 41 × 25 × 25 cm · FAN Mini filtre, FIX 25 W ısıtıcı ve 6 W LED aydınlatma",["FAN Mini","FIX 25 W","LEDDY TUBE 6 W"]],
    ["Aqua 4 Kids Oval",20,[41,25,25],"20 L bombeli ön camlı tam set · 41 × 25 × 25 cm · FAN Mini filtre, FIX 50 W ısıtıcı ve 7 W Day&Night LED",["FAN Mini","FIX 50 W","LEDDY TUBE SUNNY DAY&NIGHT 7 W"]],
    ["Aqua 4 Start Rectangular",54,[60,30,30],"54 L dik ön camlı tam set · 60 × 30 × 30 cm · FAN 1 filtre, FIX 50 W ısıtıcı ve 10 W LED aydınlatma",["FAN 1","FIX 50 W","RETROFIT 10 W"]],
    ["Aqua 4 Start Oval",45,[60,30,30],"45 L bombeli ön camlı tam set · 60 × 30 × 30 cm · FAN 1 filtre, FIX 50 W ısıtıcı ve 10 W Day&Night LED",["FAN 1","FIX 50 W","LEDDY TUBE SUNNY DAY&NIGHT 10 W"]],
    ["Aqua 4 Family Rectangular",112,[80,35,40],"112 L dik ön camlı tam set · 80 × 35 × 40 cm · FAN 2 filtre, FIX 100 W ısıtıcı ve 14 W Day&Night LED",["FAN 2","FIX 100 W","LEDDY TUBE SUNNY DAY&NIGHT 14 W"]],
    ["Aqua 4 Family Oval",102,[80,35,40],"102 L bombeli ön camlı tam set · 80 × 35 × 40 cm · FAN 2 filtre, FIX 100 W ısıtıcı ve 14 W Day&Night LED",["FAN 2","FIX 100 W","LEDDY TUBE SUNNY DAY&NIGHT 14 W"]],
  ]),
  ...aquariumProducts("aquarium_set","https://www.aquael.com/products/aquaristics/aquarium-sets/classic-box/",[
    ["Classic Box Set 40 Oval",20,[41,25,25],"20 L bombeli ön camlı akvaryum ve kapak seti · 41 × 25 × 25 cm · 7 W Leddy Tube Sunny Day&Night",["Leddy Tube Sunny Day&Night 7 W"]],
    ["Classic Box Set 60 Oval",45,[60,30,30],"45 L bombeli ön camlı akvaryum ve kapak seti · 60 × 30 × 30 cm · 10 W Leddy Tube Sunny Day&Night",["Leddy Tube Sunny Day&Night 10 W"]],
    ["Classic Box Set 80 Oval",102,[80,35,40],"102 L bombeli ön camlı akvaryum ve kapak seti · 80 × 35 × 40 cm · 14 W Leddy Tube Sunny Day&Night",["Leddy Tube Sunny Day&Night 14 W"]],
    ["Classic Box Set 40 Rectangular",25,[41,25,25],"25 L dik ön camlı akvaryum ve kapak seti · 41 × 25 × 25 cm · 7 W Leddy Tube Sunny Day&Night",["Leddy Tube Sunny Day&Night 7 W"]],
    ["Classic Box Set 60 Rectangular",54,[60,30,30],"54 L dik ön camlı akvaryum ve kapak seti · 60 × 30 × 30 cm · 10 W Leddy Tube Sunny Day&Night",["Leddy Tube Sunny Day&Night 10 W"]],
    ["Classic Box Set 80 Rectangular",112,[80,35,40],"112 L dik ön camlı akvaryum ve kapak seti · 80 × 35 × 40 cm · 14 W Leddy Tube Sunny Day&Night",["Leddy Tube Sunny Day&Night 14 W"]],
  ]),
  ...aquariumProducts("aquarium_set","https://www.aquael.com/products/aquaristics/aquarium-sets/shrimp-set-daynight/",[
    ["Shrimp Set Day&Night 10 Black",10,[20,20,25],"10 L siyah nano akvaryum seti · 20 × 20 × 25 cm · Turbo Mini filtre, Fix 2 50 W ısıtıcı ve 4,8 W Day&Night LED",["Turbo Mini","Fix 2 50 W","Leddy Smart Day&Night 4.8 W"]],
    ["Shrimp Set Day&Night 10 White",10,[20,20,25],"10 L beyaz nano akvaryum seti · 20 × 20 × 25 cm · Turbo Mini filtre, Fix 2 50 W ısıtıcı ve 4,8 W Day&Night LED",["Turbo Mini","Fix 2 50 W","Leddy Smart Day&Night 4.8 W"]],
    ["Shrimp Set Day&Night 20 Black",19,[25,25,30],"19 L siyah nano akvaryum seti · 25 × 25 × 30 cm · Turbo Mini filtre, Fix 2 50 W ısıtıcı ve 4,8 W Day&Night LED",["Turbo Mini","Fix 2 50 W","Leddy Smart Day&Night 4.8 W"]],
    ["Shrimp Set Day&Night 20 White",19,[25,25,30],"19 L beyaz nano akvaryum seti · 25 × 25 × 30 cm · Turbo Mini filtre, Fix 2 50 W ısıtıcı ve 4,8 W Day&Night LED",["Turbo Mini","Fix 2 50 W","Leddy Smart Day&Night 4.8 W"]],
    ["Shrimp Set Day&Night 30 Black",30,[29,29,35],"30 L siyah nano akvaryum seti · 29 × 29 × 35 cm · Turbo Mini filtre, Fix 2 50 W ısıtıcı ve 4,8 W Day&Night LED",["Turbo Mini","Fix 2 50 W","Leddy Smart Day&Night 4.8 W"]],
    ["Shrimp Set Day&Night 30 White",30,[29,29,35],"30 L beyaz nano akvaryum seti · 29 × 29 × 35 cm · Turbo Mini filtre, Fix 2 50 W ısıtıcı ve 4,8 W Day&Night LED",["Turbo Mini","Fix 2 50 W","Leddy Smart Day&Night 4.8 W"]],
  ]),
  ...aquariumProducts("aquarium_set","https://www.aquael.com/products/aquaristics/aquaristics/shrimp-set-duo/",[
    ["Fish & Shrimp Set Duo 35 White",49,[35,35,40],"49 L beyaz küp akvaryum seti · 35 × 35 × 40 cm · FZN Versa Pro 700 filtre, Fix 50 ısıtıcı ve Leddy Slim Duo aydınlatma",["FZN Versa Pro 700","Fix 50","Leddy Slim Duo"]],
    ["Fish & Shrimp Set Duo 35 Day&Night Black",49,[35,35,40],"49 L siyah küp akvaryum seti · 35 × 35 × 40 cm · FZN Versa Pro 700 filtre, Fix 50 ısıtıcı ve Leddy Slim Duo Sunny Plant&Night aydınlatma",["FZN Versa Pro 700","Fix 50","Leddy Slim Duo Sunny Plant&Night"]],
  ]),
  ...aquariumProducts("aquarium_set","https://www.aquael.com/products/aquaristics/aquarium-sets/opti-set-130/",[
    ["Opti Set 130 White",130,[60.9,40.9,60.5],"130 L beyaz Opti-Glass akvaryum seti · 60,9 × 40,9 × 60,5 cm · iki Leddy Tube Sunny Day&Night 2.0 aydınlatma modülü",["Leddy Tube Sunny Day&Night 2.0 × 2"]],
    ["Opti Set 130 Black",130,[60.9,40.9,60.5],"130 L siyah Opti-Glass akvaryum seti · 60,9 × 40,9 × 60,5 cm · iki Leddy Tube Sunny Day&Night 2.0 aydınlatma modülü",["Leddy Tube Sunny Day&Night 2.0 × 2"]],
    ["Opti Set 130 Grey",130,[60.9,40.9,60.5],"130 L gri Opti-Glass akvaryum seti · 60,9 × 40,9 × 60,5 cm · iki Leddy Tube Sunny Day&Night 2.0 aydınlatma modülü",["Leddy Tube Sunny Day&Night 2.0 × 2"]],
  ]),
  ...aquariumProducts("aquarium_set","https://www.aquael.com/products/aquaristics/aquarium-sets/leddy-xl-daynight/",[
    ["Leddy XL Day&Night 40",35,[41,25,35],"35 L yüksek akvaryum seti · 41 × 25 × 35 cm · ASAP 300 filtre, Fix 50 W ısıtıcı ve 7 W Leddy Tube Sunny Day&Night",["ASAP 300","Fix 50 W","Leddy Tube Sunny Day&Night 7 W"]],
    ["Leddy XL Day&Night 60",72,[60,30,40],"72 L yüksek akvaryum seti · 60 × 30 × 40 cm · ASAP 300 filtre, Fix 100 W ısıtıcı ve 10 W Leddy Tube Sunny Day&Night",["ASAP 300","Fix 100 W","Leddy Tube Sunny Day&Night 10 W"]],
  ]),
  ...aquariumProducts("aquarium_set","https://www.aquael.com/products/aquaristics/aquarium-sets/ultrascape-set/",[
    ["UltraScape Set 60 Forest",64.8,[60,30,36],"64,8 L Forest renkli Opti-Glass aquascape seti · 60 × 30 × 36 cm · iki 10 W Plant ve bir 10 W Sunny Day&Night LED modülü",["Leddy Tube Plant 10 W × 2","Leddy Tube Sunny Day&Night 10 W"]],
    ["UltraScape Set 60 Snow",64.8,[60,30,36],"64,8 L Snow renkli Opti-Glass aquascape seti · 60 × 30 × 36 cm · iki 10 W Plant ve bir 10 W Sunny Day&Night LED modülü",["Leddy Tube Plant 10 W × 2","Leddy Tube Sunny Day&Night 10 W"]],
    ["UltraScape Set 90 Forest",243,[90,60,45],"243 L Forest renkli Opti-Glass aquascape seti · 90 × 60 × 45 cm · iki 14 W Plant ve iki 14 W Sunny Day&Night LED modülü",["Leddy Tube Plant 14 W × 2","Leddy Tube Sunny Day&Night 14 W × 2"]],
    ["UltraScape Set 90 Snow",243,[90,60,45],"243 L Snow renkli Opti-Glass aquascape seti · 90 × 60 × 45 cm · iki 14 W Plant ve iki 14 W Sunny Day&Night LED modülü",["Leddy Tube Plant 14 W × 2","Leddy Tube Sunny Day&Night 14 W × 2"]],
  ]),
  ...aquariumProducts("aquarium_set","https://www.aquael.com/us/products/aquaristics-us/aquarium-sets-us/optibent-set/",[
    ["OptiBent Set 20 Black",19,[25,25,30],"19 L siyah, yuvarlatılmış köşeli Opti-Glass set · 25 × 25 × 30 cm · Fan Mini Plus filtre, Ultra Heater 25 W ve Leddy Slim Duo Sunny Plant&Night",["Fan Mini Plus","Ultra Heater 25 W","Leddy Slim Duo Sunny Plant&Night"]],
    ["OptiBent Set 20 White",19,[25,25,30],"19 L beyaz, yuvarlatılmış köşeli Opti-Glass set · 25 × 25 × 30 cm · Fan Mini Plus filtre, Ultra Heater 25 W ve Leddy Slim Duo Sunny Plant&Night",["Fan Mini Plus","Ultra Heater 25 W","Leddy Slim Duo Sunny Plant&Night"]],
    ["OptiBent Set 30 Black",29,[29,29,35],"29 L siyah, yuvarlatılmış köşeli Opti-Glass set · 29 × 29 × 35 cm · Fan Mini Plus filtre, Ultra Heater 25 W ve Leddy Slim Duo Sunny Plant&Night",["Fan Mini Plus","Ultra Heater 25 W","Leddy Slim Duo Sunny Plant&Night"]],
    ["OptiBent Set 30 White",29,[29,29,35],"29 L beyaz, yuvarlatılmış köşeli Opti-Glass set · 29 × 29 × 35 cm · Fan Mini Plus filtre, Ultra Heater 25 W ve Leddy Slim Duo Sunny Plant&Night",["Fan Mini Plus","Ultra Heater 25 W","Leddy Slim Duo Sunny Plant&Night"]],
    ["OptiBent Set 70 Black",68,[39,39,45],"68 L siyah, yuvarlatılmış köşeli Opti-Glass set · 39 × 39 × 45 cm · Fan 1 Plus filtre, Ultra Heater 75 W ve Leddy Slim Duo Sunny Plant&Night",["Fan 1 Plus","Ultra Heater 75 W","Leddy Slim Duo Sunny Plant&Night"]],
    ["OptiBent Set 70 White",68,[39,39,45],"68 L beyaz, yuvarlatılmış köşeli Opti-Glass set · 39 × 39 × 45 cm · Fan 1 Plus filtre, Ultra Heater 75 W ve Leddy Slim Duo Sunny Plant&Night",["Fan 1 Plus","Ultra Heater 75 W","Leddy Slim Duo Sunny Plant&Night"]],
  ]),
  ...aquariumProducts("aquarium_set","https://www.aquael.com/products/aquaristics/aquarium-sets/opti-set/",[
    ["Opti Set 125 Grey",125,[81,36,51],"125 L gri Opti-Glass akvaryum seti · 81 × 36 × 51 cm · iki 14 W LED aydınlatma modülü",["Leddy Tube Sunny Day&Night 14 W × 2"]],
    ["Opti Set 125 Black",125,[81,36,51],"125 L siyah Opti-Glass akvaryum seti · 81 × 36 × 51 cm · iki 14 W LED aydınlatma modülü",["Leddy Tube Sunny Day&Night 14 W × 2"]],
    ["Opti Set 125 White",125,[81,36,51],"125 L beyaz Opti-Glass akvaryum seti · 81 × 36 × 51 cm · iki 14 W LED aydınlatma modülü",["Leddy Tube Sunny Day&Night 14 W × 2"]],
    ["Opti Set 200 Grey",200,[101,41,56],"200 L gri Opti-Glass akvaryum seti · 101 × 41 × 56 cm · iki 14 W LED aydınlatma modülü",["Leddy Tube Sunny Day&Night 14 W × 2"]],
    ["Opti Set 200 Black",200,[101,41,56],"200 L siyah Opti-Glass akvaryum seti · 101 × 41 × 56 cm · iki 14 W LED aydınlatma modülü",["Leddy Tube Sunny Day&Night 14 W × 2"]],
    ["Opti Set 200 White",200,[101,41,56],"200 L beyaz Opti-Glass akvaryum seti · 101 × 41 × 56 cm · iki 14 W LED aydınlatma modülü",["Leddy Tube Sunny Day&Night 14 W × 2"]],
    ["Opti Set 240 Grey",240,[121,41,56],"240 L gri Opti-Glass akvaryum seti · 121 × 41 × 56 cm · iki 17 W LED aydınlatma modülü",["Leddy Tube Sunny Day&Night 17 W × 2"]],
    ["Opti Set 240 Black",240,[121,41,56],"240 L siyah Opti-Glass akvaryum seti · 121 × 41 × 56 cm · iki 17 W LED aydınlatma modülü",["Leddy Tube Sunny Day&Night 17 W × 2"]],
    ["Opti Set 240 White",240,[121,41,56],"240 L beyaz Opti-Glass akvaryum seti · 121 × 41 × 56 cm · iki 17 W LED aydınlatma modülü",["Leddy Tube Sunny Day&Night 17 W × 2"]],
  ]),
  ...aquariumProducts("aquarium_set","https://www.aquael.com/products/aquaristics/aquarium-sets/hexa-set/",[
    ["Hexa Set II 60L Black LT",60,[41,41,60],"60 L siyah altıgen akvaryum seti · 41 × 41 × 60 cm · kapağa gömülü 350 L/saat filtre, Platinium 50 W ısıtıcı ve Leddy Tube 7 W Day&Night",["Built-in Filter 350 L/h","Platinium Heater 50 W","Leddy Tube Day&Night 7 W"]],
  ]),
  ...aquariumProducts("aquarium_set","https://www.aquael.com/products/aquaristics/aquarium-sets/nano-reef/",[
    ["NanoReef Duo 35 White",49,[35,35,40],"49 L beyaz deniz nano akvaryum seti · 35 × 35 × 40 cm · ayarlanabilir 1200 L/saat FZN 3 filtre ve Leddy Slim Duo Marine & Actinic aydınlatma",["FZN 3","Leddy Slim Duo Marine & Actinic"]],
  ]),
  ...aquariumProducts("aquarium_set","https://www.aquael.com/products/aquaristics/aquarium-sets/leddy-daynight/",[
    ["Leddy Day&Night 40 Black",25,[41,25,25],"25 L siyah tam akvaryum seti · 41 × 25 × 25 cm · ASAP 300 filtre, Fix 50 ısıtıcı ve 7 W Leddy Tube Sunny Day&Night",["ASAP 300","Fix 50","Leddy Tube Sunny Day&Night 7 W"]],
    ["Leddy Day&Night 40 White",25,[41,25,25],"25 L beyaz tam akvaryum seti · 41 × 25 × 25 cm · ASAP 300 filtre, Fix 50 ısıtıcı ve 7 W Leddy Tube Sunny Day&Night",["ASAP 300","Fix 50","Leddy Tube Sunny Day&Night 7 W"]],
    ["Leddy Day&Night 60 Black",54,[60,30,30],"54 L siyah tam akvaryum seti · 60 × 30 × 30 cm · ASAP 300 filtre, Fix 50 ısıtıcı ve 7 W Leddy Tube Sunny Day&Night",["ASAP 300","Fix 50","Leddy Tube Sunny Day&Night 7 W"]],
    ["Leddy Day&Night 60 White",54,[60,30,30],"54 L beyaz tam akvaryum seti · 60 × 30 × 30 cm · ASAP 300 filtre, Fix 50 ısıtıcı ve 7 W Leddy Tube Sunny Day&Night",["ASAP 300","Fix 50","Leddy Tube Sunny Day&Night 7 W"]],
    ["Leddy Day&Night 75 Black",105,[75,35,40],"105 L siyah tam akvaryum seti · 75 × 35 × 40 cm · ASAP 500 filtre, Fix 100 ısıtıcı ve 14 W Leddy Tube Sunny Day&Night",["ASAP 500","Fix 100","Leddy Tube Sunny Day&Night 14 W"]],
    ["Leddy Day&Night 75 White",105,[75,35,40],"105 L beyaz tam akvaryum seti · 75 × 35 × 40 cm · ASAP 500 filtre, Fix 100 ısıtıcı ve 14 W Leddy Tube Sunny Day&Night",["ASAP 500","Fix 100","Leddy Tube Sunny Day&Night 14 W"]],
  ]),
  ...aquariumProducts("aquarium_set","https://www.aquael.com/products/aquaristics/aquarium-sets/leddy-plus-en/",[
    ["Leddy Plus Day&Night 40 Black",25,[41,25,25],"25 L siyah Plus akvaryum seti · 41 × 25 × 25 cm · Fan Mini Plus filtre, Platinium 25 W ısıtıcı ve 7 W Day&Night LED",["Fan Mini Plus","Platinium Heater 25 W","Leddy Tube Day&Night 7 W"]],
    ["Leddy Plus Day&Night 40 White",25,[41,25,25],"25 L beyaz Plus akvaryum seti · 41 × 25 × 25 cm · Fan Mini Plus filtre, Platinium 25 W ısıtıcı ve 7 W Day&Night LED",["Fan Mini Plus","Platinium Heater 25 W","Leddy Tube Day&Night 7 W"]],
    ["Leddy Plus Day&Night 60 Black",54,[60,30,30],"54 L siyah Plus akvaryum seti · 60 × 30 × 30 cm · Fan 1 Plus filtre, Platinium 50 W ısıtıcı ve 7 W Day&Night LED",["Fan 1 Plus","Platinium Heater 50 W","Leddy Tube Day&Night 7 W"]],
    ["Leddy Plus Day&Night 60 White",54,[60,30,30],"54 L beyaz Plus akvaryum seti · 60 × 30 × 30 cm · Fan 1 Plus filtre, Platinium 50 W ısıtıcı ve 7 W Day&Night LED",["Fan 1 Plus","Platinium Heater 50 W","Leddy Tube Day&Night 7 W"]],
    ["Leddy Plus Day&Night 75 Black",105,[75,35,40],"105 L siyah Plus akvaryum seti · 75 × 35 × 40 cm · Fan 2 Plus filtre, Platinium 100 W ısıtıcı ve 7 W Day&Night LED",["Fan 2 Plus","Platinium Heater 100 W","Leddy Tube Day&Night 7 W"]],
    ["Leddy Plus Day&Night 75 White",105,[75,35,40],"105 L beyaz Plus akvaryum seti · 75 × 35 × 40 cm · Fan 2 Plus filtre, Platinium 100 W ısıtıcı ve 7 W Day&Night LED",["Fan 2 Plus","Platinium Heater 100 W","Leddy Tube Day&Night 7 W"]],
  ]),
  ...aquariumProducts("aquarium_set","https://www.aquael.com/products/aquaristics/aquarium-sets/leddy-mini-creative-set/",[
    ["Leddy Mini Creative Set 30 Black",12.6,[28,15,30],"12,6 L siyah başlangıç akvaryumu · 28 × 15 × 30 cm · ayarlanabilir ve havalandırmalı Turbo Mini filtre",["Turbo Mini"]],
    ["Leddy Mini Creative Set 30 White",12.6,[28,15,30],"12,6 L beyaz başlangıç akvaryumu · 28 × 15 × 30 cm · ayarlanabilir ve havalandırmalı Turbo Mini filtre",["Turbo Mini"]],
    ["Leddy Mini Creative Set 35 Black",19,[35,18,30],"19 L siyah başlangıç akvaryumu · 35 × 18 × 30 cm · ayarlanabilir ve havalandırmalı Turbo Mini filtre",["Turbo Mini"]],
    ["Leddy Mini Creative Set 35 White",19,[35,18,30],"19 L beyaz başlangıç akvaryumu · 35 × 18 × 30 cm · ayarlanabilir ve havalandırmalı Turbo Mini filtre",["Turbo Mini"]],
  ]),
  ...aquariumProducts("aquarium_set","https://www.aquael.com/products/aquaristics/aquarium-sets/glossy-st-grey-en/",[
    ["Glossy ST 80 Grey",125,[80,35,54],"125 L gri parlak akvaryum seti · 80 × 35 × 54 cm · iki 14 W LED aydınlatma modülü",["Leddy Tube Sunny Day&Night 14 W × 2"]],
    ["Glossy ST 100 Grey",215,[100,40,63],"215 L gri parlak akvaryum seti · 100 × 40 × 63 cm · iki 14 W LED aydınlatma modülü",["Leddy Tube Sunny Day&Night 14 W × 2"]],
    ["Glossy ST 120 Grey",260,[120,40,63],"260 L gri parlak akvaryum seti · 120 × 40 × 63 cm · üç 17 W LED aydınlatma modülü",["Leddy Tube Sunny Day&Night 17 W × 3"]],
    ["Glossy ST 150 Grey",405,[150,50,63],"405 L gri parlak akvaryum seti · 150 × 50 × 63 cm · üç 17 W LED aydınlatma modülü",["Leddy Tube Sunny Day&Night 17 W × 3"]],
    ["Glossy ST Cube Grey",135,[50,50,63],"135 L gri parlak küp akvaryum seti · 50 × 50 × 63 cm · iki 10 W LED aydınlatma modülü",["Leddy Tube Sunny Day&Night 10 W × 2"]],
  ]),
  ...aquariumProducts("aquarium_set","https://www.aquael.com/products/aquaristics/aquarium-sets/betta-kit/",[
    ["Betta Kit",3,[23.7,15.4,17.3],"3 L çizilmeye ve kırılmaya dayanıklı plastik taşıma akvaryumu · 23,7 × 15,4 × 17,3 cm · havalandırma delikli çıkarılabilir kapak ve taşıma sapı"],
  ]),
  ...aquariumProducts("aquarium_set","https://www.aquael.com/products/aquaristics/new-en/glossy-marine-2/",[
    ["Glossy Marine Standard",170,[60,58,50],"170 L Opti cam deniz akvaryumu seti · 60 × 58 × 50 cm · filtre paneli, protein skimmer, ayarlanabilir sirkülasyon pompası ve biyolojik filtre medyası",["Filter Panel","Protein Skimmer","Adjustable Circulation Pump"]],
    ["Glossy Marine Optimum",170,[60,58,50],"Yaklaşık 170 L Opti cam deniz akvaryumu seti · 60 × 58 × 50 cm · Standard ekipmanlarına ek iki 18 W Leddy Slim BT aydınlatma",["Filter Panel","Protein Skimmer","Adjustable Circulation Pump","Leddy Slim BT 18 W × 2"]],
  ]),
  ...habitatProducts("aquaterrarium","https://www.aquael.com/wp-content/uploads/2025/02/aquaterrarium-123968-123969-123970-info-en_173.pdf",[
    ["AquaTerrarium 60",[60,30,20.5],"Kaplumbağa ve yengeç gibi su-kara canlıları için 60 cm aquaterrarium · 60 × 30 × 20,5 cm · doğal çakıl kaplı kaymaz çıkış platformu; filtre dahil değil"],
    ["AquaTerrarium 80",[80,35,30.5],"Kaplumbağa ve yengeç gibi su-kara canlıları için 80 cm aquaterrarium · 80 × 35 × 30,5 cm · kaymaz çıkış platformu ve 500 L/saat filtre",["Filter 500 L/h"]],
    ["AquaTerrarium 100",[100,40,35.5],"Kaplumbağa ve yengeç gibi su-kara canlıları için 100 cm aquaterrarium · 100 × 40 × 35,5 cm · kaymaz çıkış platformu ve 500 L/saat filtre",["Filter 500 L/h"]],
  ]),
  ...habitatProducts("terrarium","https://www.aquael.com/products/aquaristics/smart-aquarium/selva-mini-terrarium/",[
    ["Selva Mini Terrarium",[20,20,30],"Egzotik bitkiler için Opti cam mini terrarium · 20 × 20 × 30 cm · Aquael BT uygulamasıyla kontrol edilen WRGB LED ve entegre havalandırma sistemi",["WRGB LED (Bluetooth, Aquael BT)"]],
  ]),
  ...aquariumProducts("tank","https://www.aquael.com/products/aquaristics/aquarien/standard/",[
    ["Glass Aquarium Oval 41",20,[41,25,25],"20 L bombeli ön camlı boş cam akvaryum · 41 × 25 × 25 cm · 4 mm cam"],
    ["Glass Aquarium Oval 50",40,[50,30,30],"40 L bombeli ön camlı boş cam akvaryum · 50 × 30 × 30 cm · 4 mm cam"],
    ["Glass Aquarium Oval 60",45,[60,30,30],"45 L bombeli ön camlı boş cam akvaryum · 60 × 30 × 30 cm · 4 mm cam"],
    ["Glass Aquarium Oval 80",102,[80,35,40],"102 L bombeli ön camlı boş cam akvaryum · 80 × 35 × 40 cm · 6 mm cam"],
    ["Glass Aquarium Oval 100",170,[100,40,50],"170 L bombeli ön camlı boş cam akvaryum · 100 × 40 × 50 cm · 8 mm cam"],
    ["Glass Aquarium Oval 120",205,[120,40,50],"205 L bombeli ön camlı boş cam akvaryum · 120 × 40 × 50 cm · 8 mm cam"],
    ["Glass Aquarium Oval 150",320,[150,40,50],"320 L bombeli ön camlı boş cam akvaryum · 150 × 40 × 50 cm · 10 mm cam"],
    ["Glass Aquarium Rectangular 41",25,[41,25,25],"25 L dik ön camlı boş cam akvaryum · 41 × 25 × 25 cm · 4 mm cam"],
    ["Glass Aquarium Rectangular 50",45,[50,30,30],"45 L dik ön camlı boş cam akvaryum · 50 × 30 × 30 cm · 4 mm cam"],
    ["Glass Aquarium Rectangular 60",54,[60,30,30],"54 L dik ön camlı boş cam akvaryum · 60 × 30 × 30 cm · 4 mm cam"],
    ["Glass Aquarium Rectangular 80",112,[80,35,40],"112 L dik ön camlı boş cam akvaryum · 80 × 35 × 40 cm · 6 mm cam"],
    ["Glass Aquarium Rectangular 100",200,[100,40,50],"200 L dik ön camlı boş cam akvaryum · 100 × 40 × 50 cm · 8 mm cam"],
    ["Glass Aquarium Rectangular 120",240,[120,40,50],"240 L dik ön camlı boş cam akvaryum · 120 × 40 × 50 cm · 8 mm cam"],
    ["Glass Aquarium Rectangular 150",375,[150,50,50],"375 L dik ön camlı boş cam akvaryum · 150 × 50 × 50 cm · 10 mm cam"],
  ]),
  ...aquariumProducts("tank","https://www.aquael.com/us/products/aquaristics-us/aquariums-us/opti-tank/",[
    ["Opti Tank 60",54,[60,30,30],"54 L şeffaf Opti cam akvaryum · 60 × 30 × 30 cm · 5 mm cam"],
    ["Opti Tank 80",112,[80,35,40],"112 L şeffaf Opti cam akvaryum · 80 × 35 × 40 cm · 6 mm cam"],
    ["Opti Tank 100",200,[100,40,50],"200 L şeffaf Opti cam akvaryum · 100 × 40 × 50 cm · 8 mm cam"],
  ]),
  ...aquariumProducts("tank","https://www.aquael.com/products/aquaristics/aquarien/opti-tank-rounded/",[
    ["Opti Tank Rounded 20 Black",19,[25,25,30],"19 L siyah detaylı, yuvarlatılmış ön köşeli Opti cam akvaryum · 25 × 25 × 30 cm · cam kapak ve taban matı"],
    ["Opti Tank Rounded 20 White",19,[25,25,30],"19 L beyaz detaylı, yuvarlatılmış ön köşeli Opti cam akvaryum · 25 × 25 × 30 cm · cam kapak ve taban matı"],
    ["Opti Tank Rounded 30 Black",29,[29,29,35],"29 L siyah detaylı, yuvarlatılmış ön köşeli Opti cam akvaryum · 29 × 29 × 35 cm · cam kapak ve taban matı"],
    ["Opti Tank Rounded 30 White",29,[29,29,35],"29 L beyaz detaylı, yuvarlatılmış ön köşeli Opti cam akvaryum · 29 × 29 × 35 cm · cam kapak ve taban matı"],
    ["Opti Tank Rounded 70 Black",68,[39,39,45],"68 L siyah detaylı, yuvarlatılmış ön köşeli Opti cam akvaryum · 39 × 39 × 45 cm · cam kapak ve taban matı"],
    ["Opti Tank Rounded 70 White",68,[39,39,45],"68 L beyaz detaylı, yuvarlatılmış ön köşeli Opti cam akvaryum · 39 × 39 × 45 cm · cam kapak ve taban matı"],
  ]),
  ...volumeProducts("tank","https://www.aquael.com/products/aquaristics/aquaristics/kula/",[
    ["Glass Bowl 23",4.5,"Wabi-kusa, su bitkileri, salyangoz ve karides düzenlemeleri için 4,5 L dayanıklı cam fanus"],
    ["Glass Bowl 25",8.5,"Wabi-kusa, su bitkileri, salyangoz ve karides düzenlemeleri için 8,5 L dayanıklı cam fanus"],
    ["Glass Bowl 30",13,"Wabi-kusa, su bitkileri, salyangoz ve karides düzenlemeleri için 13 L dayanıklı cam fanus"],
    ["Glass Bowl 45",45,"Wabi-kusa, su bitkileri, salyangoz ve karides düzenlemeleri için 45 L dayanıklı cam fanus"],
  ]),
  ...dimensionProducts("cover","https://www.aquael.com/products/aquaristics/aquarium-cover/leddy-2/",[
    ["Leddy Cover Rectangular 40 Black",[41,25],"40 cm akvaryum için siyah kapak · 41 × 25 cm · 6 W, 680 lm, 6500 K LED"],
    ["Leddy Cover Rectangular 40 White",[41,25],"40 cm akvaryum için beyaz kapak · 41 × 25 cm · 6 W, 680 lm, 6500 K LED"],
    ["Leddy Cover Rectangular 60 Black",[60,30],"60 cm akvaryum için siyah kapak · 60 × 30 cm · 8 W, 900 lm, 6500 K LED"],
    ["Leddy Cover Rectangular 60 White",[60,30],"60 cm akvaryum için beyaz kapak · 60 × 30 cm · 8 W, 900 lm, 6500 K LED"],
    ["Leddy Cover Rectangular 75 Black",[75,35],"75 cm akvaryum için siyah kapak · 75 × 35 cm · 16 W, 1650 lm, 6500 K LED"],
  ]),
  ...dimensionProducts("cover","https://www.aquael.com/products/aquaristics/aquarium-cover/classic-2/",[
    ["Classic Cover Oval 100 LT",[100,40],"100 cm bombeli akvaryum kapağı · 100 × 40 cm · 2 × 16 W, toplam 3300 lm, 6500 K LED"],
    ["Classic Cover Oval 120 × 40 LT",[120,40],"120 cm bombeli akvaryum kapağı · 120 × 40 cm · 2 × 18 W, toplam 3640 lm, 6500 K LED"],
    ["Classic Cover Oval 150 × 50 LT",[150,50],"150 cm bombeli akvaryum kapağı · 150 × 50 cm · 2 × 18 W, toplam 3640 lm, 6500 K LED"],
    ["Classic Cover Rectangular 100 LT",[100,40],"100 cm dik akvaryum kapağı · 100 × 40 cm · 2 × 16 W, toplam 3300 lm, 6500 K LED"],
    ["Classic Cover Rectangular 120 × 40 LT",[120,40],"120 cm dik akvaryum kapağı · 120 × 40 cm · 2 × 18 W, toplam 3640 lm, 6500 K LED"],
    ["Classic Cover Rectangular 150 × 50 LT",[150,50],"150 cm dik akvaryum kapağı · 150 × 50 cm · 2 × 18 W, toplam 3640 lm, 6500 K LED"],
  ]),
  ...dimensionProducts("cabinet","https://www.aquael.com/products/aquaristics/cabinets/opti-set-cabinet/",[
    ["Opti Set Cabinet 125 Black",[81,36,80],"Opti Set 125 için siyah akvaryum dolabı · 81 × 36 × 80 cm"],
    ["Opti Set Cabinet 125 White",[81,36,80],"Opti Set 125 için beyaz akvaryum dolabı · 81 × 36 × 80 cm"],
    ["Opti Set Cabinet 200 Black",[101,41,80],"Opti Set 200 için siyah akvaryum dolabı · 101 × 41 × 80 cm"],
    ["Opti Set Cabinet 200 White",[101,41,80],"Opti Set 200 için beyaz akvaryum dolabı · 101 × 41 × 80 cm"],
    ["Opti Set Cabinet 240 Black",[121,41,80],"Opti Set 240 için siyah akvaryum dolabı · 121 × 41 × 80 cm"],
    ["Opti Set Cabinet 240 White",[121,41,80],"Opti Set 240 için beyaz akvaryum dolabı · 121 × 41 × 80 cm"],
  ]),
  ...products("Aquael","cabinet","https://www.aquael.com/products/aquaristics/cabinets/opti-set-cabinet-130/",[
    ["Opti Set Cabinet 130 White","Opti Set 130 için beyaz, 60 cm genişliğinde ve 80 cm yüksekliğinde akvaryum dolabı · 200 kg taşıma kapasitesi"],
    ["Opti Set Cabinet 130 Black","Opti Set 130 için siyah, 60 cm genişliğinde ve 80 cm yüksekliğinde akvaryum dolabı · 200 kg taşıma kapasitesi"],
    ["Opti Set Cabinet 130 Grey","Opti Set 130 için gri, 60 cm genişliğinde ve 80 cm yüksekliğinde akvaryum dolabı · 200 kg taşıma kapasitesi"],
  ],"2026-09-12"),
  ...dimensionProducts("cabinet","https://www.aquael.com/products/aquaristics/aquaristics/cabinet-opti-set-grey/",[
    ["Opti Set Cabinet 125 Grey",[81.5,36,80],"Opti Set 125 için gri akvaryum dolabı · 81,5 × 36 × 80 cm"],
    ["Opti Set Cabinet 200 Grey",[101,41,80],"Opti Set 200 için gri akvaryum dolabı · 101 × 41 × 80 cm"],
    ["Opti Set Cabinet 240 Grey",[121,41,80],"Opti Set 240 için gri akvaryum dolabı · 121 × 41 × 80 cm"],
  ]),
  ...dimensionProducts("cabinet","https://www.aquael.com/products/aquaristics/cabinets/shrimp-set/",[
    ["Shrimp Set 30 Stand Black",[29,29,90],"Shrimp Set ve NanoReef için siyah akvaryum dolabı · 29 × 29 × 90 cm"],
    ["Shrimp Set 30 Stand White",[29,29,90],"Shrimp Set ve NanoReef için beyaz akvaryum dolabı · 29 × 29 × 90 cm"],
  ]),
  ...dimensionProducts("cabinet","https://www.aquael.com/products/aquaristics/cabinets/simple/",[
    ["Simple Cabinet Rectangular 60 Black",[61,31,72.5],"60 cm dik akvaryum için kapaksız siyah dolap · 61 × 31 × 72,5 cm"],
    ["Simple Cabinet Rectangular 60 White",[61,31,72.5],"60 cm dik akvaryum için kapaksız beyaz dolap · 61 × 31 × 72,5 cm"],
    ["Simple Cabinet Rectangular 75 Black",[75.6,36,72.5],"75 cm dik akvaryum için kapaksız siyah dolap · 75,6 × 36 × 72,5 cm"],
    ["Simple Cabinet Rectangular 75 White",[75.6,36,72.5],"75 cm dik akvaryum için kapaksız beyaz dolap · 75,6 × 36 × 72,5 cm"],
    ["Simple Cabinet Rectangular 80 Black",[81,35.5,72.5],"80 cm dik akvaryum için kapaksız siyah dolap · 81 × 35,5 × 72,5 cm"],
    ["Simple Cabinet Rectangular 80 White",[81,35.5,72.5],"80 cm dik akvaryum için kapaksız beyaz dolap · 81 × 35,5 × 72,5 cm"],
  ]),
  ...dimensionProducts("cabinet","https://www.aquael.com/products/aquaristics/cabinets/ultrascape-cabinet/",[
    ["UltraScape Cabinet 60 Snow",[60,30,80],"UltraScape Set 60 için Snow renkli akvaryum dolabı · 60 × 30 × 80 cm"],
    ["UltraScape Cabinet 60 Forest",[60,30,80],"UltraScape Set 60 için Forest renkli akvaryum dolabı · 60 × 30 × 80 cm"],
    ["UltraScape Cabinet 90 Snow",[90,45,80],"UltraScape Set 90 için Snow renkli akvaryum dolabı · 90 × 45 × 80 cm"],
    ["UltraScape Cabinet 90 Forest",[90,45,80],"UltraScape Set 90 için Forest renkli akvaryum dolabı · 90 × 45 × 80 cm"],
  ]),
  ...dimensionProducts("cabinet","https://www.aquael.com/products/aquaristics/new-en/glossy-st-grey-cabinet/",[
    ["Glossy ST 80 Grey Cabinet",[80,35,72],"Glossy ST 80 için gri parlak akvaryum dolabı · 80 × 35 × 72 cm"],
    ["Glossy ST 100 Grey Cabinet",[100,40,72],"Glossy ST 100 için gri parlak akvaryum dolabı · 100 × 40 × 72 cm"],
    ["Glossy ST 120 Grey Cabinet",[120,40,72],"Glossy ST 120 için gri parlak akvaryum dolabı · 120 × 40 × 72 cm"],
    ["Glossy ST 150 Grey Cabinet",[150,50,72],"Glossy ST 150 için gri parlak akvaryum dolabı · 150 × 50 × 72 cm"],
    ["Glossy ST Cube Grey Cabinet",[50,50,90],"Glossy ST Cube için gri parlak akvaryum dolabı · 50 × 50 × 90 cm"],
  ]),
  ...dimensionProducts("cabinet","https://www.aquael.com/products/aquaristics/cabinets/hexa/",[
    ["Hexa 60 Simple Cabinet",[45,45,73],"Hexa Set 60 için Simple akvaryum dolabı · 45 × 45 × 73 cm"],
    ["Hexa 60 Cabinet",[45,45,73],"Hexa Set 60 için kapalı akvaryum dolabı · 45 × 45 × 73 cm"],
  ]),
  ...dimensionProducts("cabinet","https://www.aquael.com/products/aquaristics/cabinets/fishshrimp-set-duo/",[
    ["Fish & Shrimp Set Duo Cabinet Black",[35,35,90],"Fish & Shrimp Set Duo için siyah akvaryum dolabı · 35 × 35 × 90 cm"],
    ["Fish & Shrimp Set Duo Cabinet White",[35,35,90],"Fish & Shrimp Set Duo için beyaz akvaryum dolabı · 35 × 35 × 90 cm"],
  ]),
  ...dimensionProducts("cabinet","https://www.aquael.com/products/aquaristics/new-en/glossy-marine-2/",[
    ["Glossy Marine Cabinet",[60,60,87],"Glossy Marine akvaryum seti için dolap · 60 × 60 × 87 cm"],
  ]),
  {
    id:"chihiros-glass-air-aquarium-tank",brand:"Chihiros",model:"Glass Air Aquarium Tank",category:"tank",
    description:"45 derece kesimli cam akvaryum · 30 × 18 × 12 cm · üretimden kaldırıldı",
    dimensionsCm:[30,18,12],sourceUrl:"https://www.chihirosaquaticstudio.com/products/chihiros-glass-air-aquarium-tank",verifiedAt:"2026-09-12",
  },
  {
    id:"chihiros-magnetic-light-terrarium-set-glass-air",brand:"Chihiros",model:"Magnetic Light Terrarium Set — Glass Air",category:"terrarium",
    description:"15 × 15 × 30 cm Glass Air gövde, Magnetic Light ve Magnetic Base içeren uygulama kontrollü terrarium seti · üretimden kaldırıldı",
    dimensionsCm:[15,15,30],includedEquipmentModels:["Magnetic Light"],sourceUrl:"https://www.chihirosaquaticstudio.com/products/chihiros-magnetic-light-terrarium-set",verifiedAt:"2026-09-12",
  },
  {
    id:"chihiros-magnetic-light-terrarium-set-glass-pot",brand:"Chihiros",model:"Magnetic Light Terrarium Set — Glass Pot",category:"terrarium",
    description:"21,6 cm genişlik ve 27 cm yüksekliğe sahip Glass Pot, Magnetic Light ve Magnetic Base içeren uygulama kontrollü terrarium seti · üretimden kaldırıldı",
    includedEquipmentModels:["Magnetic Light"],sourceUrl:"https://www.chihirosaquaticstudio.com/products/chihiros-magnetic-light-terrarium-set",verifiedAt:"2026-09-12",
  },
  {
    id:"chihiros-tiny-terrarium-egg",brand:"Chihiros",model:"Tiny Terrarium Egg",category:"terrarium",
    description:"Bitki ve nemli mini peyzaj düzenlemeleri için yumurta biçimli cam terrarium · üretimden kaldırıldı; resmî arşiv ölçü yayımlamıyor",
    sourceUrl:"https://www.chihirosaquaticstudio.com/products/chihiros-tiny-terrarium-egg",verifiedAt:"2026-09-12",
  },
  {
    id:"chihiros-aqua-soil",brand:"Chihiros",model:"Aqua Soil",category:"substrate",
    description:"Bitkili akvaryumlar için granül taban malzemesi · yalnız yerel bayiler üzerinden sunulan arşiv ürünü; paket hacmi resmî arşivde yayımlanmadığı için eklenmedi",
    sourceUrl:"https://www.chihirosaquaticstudio.com/products/chihiros-aqua-soil-need-to-contact-your-local-dealer-to-purchase",verifiedAt:"2026-09-12",
  },
  {
    id:"chihiros-eco-ping",brand:"Chihiros",model:"ECO Ping",category:"aquarium_set",
    description:"6,1 L silindirik masaüstü akvaryum seti · 295 mm yükseklik ve 216 mm çap · uygulama kontrollü beyaz/RGB aydınlatma ve USB kablosu · üretici 5 V / 3 A adaptör öneriyor · üretimden kaldırıldı",
    volumeL:6.1,includedEquipmentModels:["ECO Ping Light"],sourceUrl:"https://www.chihirosaquaticstudio.com/products/chihiros-eco-ping",verifiedAt:"2026-09-12",
  },
  {
    id:"chihiros-glass-pot-for-plant",brand:"Chihiros",model:"Glass Pot for Plant",category:"terrarium",
    description:"Bitki ve mini peyzaj düzenlemeleri için cam kap · üretimden kaldırıldı; resmî arşiv güvenilir üç boyut veya hacim yayımlamadığı için ölçü eklenmedi",
    sourceUrl:"https://www.chihirosaquaticstudio.com/products/chihiros-glass-pot-for-plant",verifiedAt:"2026-09-12",
  },
  ...[
    ["Dew S","Küçük boy"],["Dew L","Büyük boy"],["Dew Shaped","Şekilli gövde"],
  ].map(([model,size])=>({
    id:catalogSlug(`Chihiros-Glass Pot ${model}`),brand:"Chihiros",model:`Glass Pot ${model}`,category:"terrarium" as const,
    description:`${size} cam bitki/terrarium kabı · havalandırma delikli akrilik kapak · ters çevrilebilir şişe ve merkezde damlatma deliği`,
    sourceUrl:"https://bbs.chihirosaquaticstudio.com/threads/chihiros-glass-pot-dew.169/",verifiedAt:"2026-09-12",
  })),
  {
    id:"chihiros-aquarium-acrylic-uv-print-pod",brand:"Chihiros",model:"Aquarium Acrylic UV Print POD",category:"decoration",
    description:"Kullanıcının akvaryum fotoğrafının UV baskıyla uygulandığı akrilik dekor paneli · 240 × 90 × 20 mm",
    dimensionsCm:[24,9,2],sourceUrl:"https://bbs.chihirosaquaticstudio.com/threads/chihiros-aquarium-acrylic-uv-print-pod.19/",verifiedAt:"2026-09-12",
  },
  ...products("Resun","filter_media","https://www.resun-china.com/h-pd-268.html",[
    ["FTP01 Ammonia Filter Pad","Yeni canlı ekleme, fazla yemleme ve aşırı yük kaynaklı amonyak kontrolüne yardımcı kesilebilir filtre pedi"],
    ["FTP02 Carbon Filter Pad","Koku, renk ve toksinlerin tutulmasına yardımcı kesilebilir karbon filtre pedi"],
    ["FTP03 Phosphate Filter Pad","Fosfat seviyesini ve alg gelişimini azaltmaya yardımcı kesilebilir filtre pedi"],
    ["FTP04 Polyfiber Filter Pad","Suda yüzen atık ve parçacıkları mekanik olarak tutan kesilebilir polyfiber filtre pedi"],
    ["FTP05 Nitrate Filter Pad","Fazla yemleme, aşırı yük ve yetersiz su değişimi kaynaklı nitrat kontrolüne yardımcı kesilebilir filtre pedi"],
  ],"2026-08-27"),
  ...products("JBL","substrate","https://www.jbl.de/en/products/detail/5014/jbl-sansibar-white?country=us",[
    ["Sansibar WHITE 5 kg","Tatlı ve deniz suyu akvaryumları ile teraryumlar için beyaz doğal kum · 5 kg · 0,2–0,6 mm yuvarlak taneler · dip balıklarının bıyıklarına uygun · taban ısıtma kabloları için uygun değil"],
    ["Sansibar WHITE 10 kg","Tatlı ve deniz suyu akvaryumları ile teraryumlar için beyaz doğal kum · 10 kg · 0,2–0,6 mm yuvarlak taneler · dip balıklarının bıyıklarına uygun · taban ısıtma kabloları için uygun değil"],
  ],"2026-09-17"),
  ...products("JBL","substrate","https://www.jbl.de/en/products/detail/5017/jbl-sansibar-river?country=us",[
    ["Sansibar RIVER 5 kg","Tatlı ve deniz suyu akvaryumları ile teraryumlar için beyaz-gri doğal kum · 5 kg · 0,8 mm yuvarlak taneler · kazıcı balıklar ve taban ısıtma kabloları için uygun"],
    ["Sansibar RIVER 10 kg","Tatlı ve deniz suyu akvaryumları ile teraryumlar için beyaz-gri doğal kum · 10 kg · 0,8 mm yuvarlak taneler · kazıcı balıklar ve taban ısıtma kabloları için uygun"],
  ],"2026-09-17"),
  ...products("JBL","substrate","https://www.jbl.de/en/products/detail/6109/jbl-sansibar-snow?country=us",[
    ["Sansibar SNOW 5 kg","Tatlı ve deniz suyu akvaryumları, aquaterrarium ve teraryumlar için kar beyazı çok ince doğal kum · 5 kg · 0,1–0,6 mm yuvarlak taneler · taban ısıtma kabloları için uygun değil"],
    ["Sansibar SNOW 10 kg","Tatlı ve deniz suyu akvaryumları, aquaterrarium ve teraryumlar için kar beyazı çok ince doğal kum · 10 kg · 0,1–0,6 mm yuvarlak taneler · taban ısıtma kabloları için uygun değil"],
  ],"2026-09-17"),
  ...products("JBL","substrate","https://www.jbl.de/en/products/detail/6112/jbl-sansibar-grey?country=us",[
    ["Sansibar GREY 5 kg","Tatlı ve deniz suyu akvaryumları ile aquaterrariumlar için gri, boyasız doğal kum · 5 kg · 0,2–0,6 mm yuvarlak taneler · taban ısıtma kabloları için tam uygun değil"],
    ["Sansibar GREY 10 kg","Tatlı ve deniz suyu akvaryumları ile aquaterrariumlar için gri, boyasız doğal kum · 10 kg · 0,2–0,6 mm yuvarlak taneler · taban ısıtma kabloları için tam uygun değil"],
  ],"2026-09-17"),
  ...products("JBL","substrate","https://www.jbl.de/en/products/detail/6115/jbl-sansibar-orange?country=us",[
    ["Sansibar ORANGE 5 kg","Tatlı ve deniz suyu akvaryumları ile aquaterrariumlar için turuncu, boyasız doğal kum · 5 kg · 0,2–0,6 mm yuvarlak taneler · taban ısıtma kabloları için tam uygun değil"],
    ["Sansibar ORANGE 10 kg","Tatlı ve deniz suyu akvaryumları ile aquaterrariumlar için turuncu, boyasız doğal kum · 10 kg · 0,2–0,6 mm yuvarlak taneler · taban ısıtma kabloları için tam uygun değil"],
  ],"2026-09-17"),
  ...products("JBL","substrate","https://www.jbl.de/en/products/detail/6117/jbl-sansibar-red?country=us",[
    ["Sansibar RED 5 kg","Tatlı ve deniz suyu akvaryumları ile aquaterrariumlar için kırmızı, boyasız doğal kum · 5 kg · 0,2–0,6 mm yuvarlak taneler · taban ısıtma kabloları için tam uygun değil"],
    ["Sansibar RED 10 kg","Tatlı ve deniz suyu akvaryumları ile aquaterrariumlar için kırmızı, boyasız doğal kum · 10 kg · 0,2–0,6 mm yuvarlak taneler · taban ısıtma kabloları için tam uygun değil"],
  ],"2026-09-17"),
  ...products("JBL","substrate","https://www.jbl.de/en/products/detail/5011/jbl-sansibar-dark?country=us",[
    ["Sansibar DARK 5 kg","Tatlı ve deniz suyu akvaryumları ile teraryumlar için koyu renkli doğal granit kum · 5 kg · 0,2–0,6 mm yuvarlak taneler · dip balıklarının bıyıklarına uygun · taban ısıtma kabloları için uygun değil"],
    ["Sansibar DARK 10 kg","Tatlı ve deniz suyu akvaryumları ile teraryumlar için koyu renkli doğal granit kum · 10 kg · 0,2–0,6 mm yuvarlak taneler · dip balıklarının bıyıklarına uygun · taban ısıtma kabloları için uygun değil"],
  ],"2026-09-17"),
  ...products("JBL","substrate","https://www.jbl.de/en/products/detail/6473/jbl-proscape-volcano-mineral?country=us",[
    ["PROSCAPE VOLCANO MINERAL 3 L","Aquascaping taş ve kök yapıları için birbirine kilitlenen gözenekli volkanik temel katman · 3 L · taban dolaşımı ve mikroorganizma yerleşimini destekler · keskin kenarlı olduğundan kazıcı balıklar için üstü uygun tabanla örtülmeli · Sansibar ile birlikte kullanılmamalı"],
    ["PROSCAPE VOLCANO MINERAL 9 L","Aquascaping taş ve kök yapıları için birbirine kilitlenen gözenekli volkanik temel katman · 9 L · taban dolaşımı ve mikroorganizma yerleşimini destekler · keskin kenarlı olduğundan kazıcı balıklar için üstü uygun tabanla örtülmeli · Sansibar ile birlikte kullanılmamalı"],
  ],"2026-09-17"),
  {
    id:"jbl-proscape-mount-aso-soil-brown-3-l",brand:"JBL",model:"PROSCAPE MOUNT ASO SOIL BROWN 3 L",category:"substrate",
    description:"Japonya Aso Dağı'ndan kahverengi, önceden gübreyle yüklenmemiş doğal volkanik aktif soil · 3 L · yumuşak ve hafif asidik suyu destekler · bulanıklık ve renk veren maddeleri bağlar · keskin kenarsız olduğu için kazıcı balıklara ve karideslere uygundur · taban ısıtıcısıyla kullanılabilir",
    sourceUrl:"https://www.jbl.de/en-id/productsv2/detail/25213415",additionalSourceUrls:["https://www.jbl.de/en/proscapesoil_2026/proscape-mount-aso-soil?country=sg"],verifiedAt:"2026-09-18",
  },
  {
    id:"jbl-proscape-mount-aso-soil-brown-9-l",brand:"JBL",model:"PROSCAPE MOUNT ASO SOIL BROWN 9 L",category:"substrate",
    description:"Japonya Aso Dağı'ndan kahverengi, önceden gübreyle yüklenmemiş doğal volkanik aktif soil · 9 L · yumuşak ve hafif asidik suyu destekler · bulanıklık ve renk veren maddeleri bağlar · keskin kenarsız olduğu için kazıcı balıklara ve karideslere uygundur · taban ısıtıcısıyla kullanılabilir",
    sourceUrl:"https://www.jbl.de/en-ie/productsv2/detail/25213353",additionalSourceUrls:["https://www.jbl.de/en/proscapesoil_2026/proscape-mount-aso-soil?country=sg"],verifiedAt:"2026-09-18",
  },
  {
    id:"jbl-proscape-mount-aso-soil-black-3-l",brand:"JBL",model:"PROSCAPE MOUNT ASO SOIL BLACK 3 L",category:"substrate",
    description:"Japonya Aso Dağı'ndan siyah, önceden gübreyle yüklenmemiş doğal volkanik aktif soil · 3 L · yumuşak ve hafif asidik suyu destekler · bulanıklık ve renk veren maddeleri bağlar · keskin kenarsız olduğu için kazıcı balıklara ve karideslere uygundur · taban ısıtıcısıyla kullanılabilir",
    sourceUrl:"https://www.jbl.de/en-us/productsv2/detail/25213181",additionalSourceUrls:["https://www.jbl.de/en/proscapesoil_2026/proscape-mount-aso-soil?country=sg"],verifiedAt:"2026-09-18",
  },
  {
    id:"jbl-proscape-mount-aso-soil-black-9-l",brand:"JBL",model:"PROSCAPE MOUNT ASO SOIL BLACK 9 L",category:"substrate",
    description:"Japonya Aso Dağı'ndan siyah, önceden gübreyle yüklenmemiş doğal volkanik aktif soil · 9 L · yumuşak ve hafif asidik suyu destekler · bulanıklık ve renk veren maddeleri bağlar · keskin kenarsız olduğu için kazıcı balıklara ve karideslere uygundur · taban ısıtıcısıyla kullanılabilir",
    sourceUrl:"https://www.jbl.de/en-ie/productsv2/detail/25213323",additionalSourceUrls:["https://www.jbl.de/en/proscapesoil_2026/proscape-mount-aso-soil?country=sg"],verifiedAt:"2026-09-18",
  },
  ...[
    ["Manado 1,5 L (Arşiv)","6702100","https://www.jbl.de/en-au/productsv2/detail/25150534"],
    ["Manado 3 L (Arşiv)","6702200","https://www.jbl.de/it-it/productsv2/detail/25079403"],
    ["Manado 5 L (Arşiv)","6702300","https://www.jbl.de/es-es/productsv2/detail/25140148"],
    ["Manado 10 L (Arşiv)","6702400","https://www.jbl.de/?country=sv&func=detail&id=25153885&lang=en&mod=productsv2"],
    ["Manado 25 L (Arşiv)","6702500","https://www.jbl.de/?country=de&func=detail&id=25134322&lang=de&mod=productsv2"],
  ].map(([model,itemNumber,sourceUrl])=>({
    id:catalogSlug(`JBL-${model}`),brand:"JBL",model,category:"substrate" as const,
    description:`Eski nesil kahverengi tatlı su taban malzemesi · ürün kodu ${itemNumber} · 0,5–2 mm yuvarlatılmış gözenekli kil granülü · fazla besinleri depolayıp gerektiğinde bırakır · dip balıklarının hassas bıyıklarına uygundur · taban ısıtma kablosuyla kullanılabilir · kullanımdan önce ılık musluk suyuyla iyice durulanmalıdır · resmî sayfada arşivlenmiştir`,
    sourceUrl,additionalSourceUrls:["https://www.jbl.de/en/blog/detail/292/the-jbl-substrates-for-aquariums-at-a-glance?country=id"],verifiedAt:"2026-09-18",
  })),
  ...[
    ["Manado DARK 3 L (Güncel)","6710000","https://www.jbl.de/en-rs/productsv2/detail/25213639"],
    ["Manado DARK 5 L (Güncel)","6710100","https://www.jbl.de/en-rs/productsv2/detail/25213727"],
    ["Manado DARK 10 L (Güncel)","6710200","https://www.jbl.de/en-rs/productsv2/detail/25213607"],
  ].map(([model,itemNumber,sourceUrl])=>({
    id:catalogSlug(`JBL-${model}`),brand:"JBL",model,category:"substrate" as const,
    description:`Güncel koyu renkli tatlı su taban malzemesi · ürün kodu ${itemNumber} · gözenekli yapı kök gelişimini ve yararlı taban bakterilerinin yerleşimini destekler · yüksek demirli besin tamponu fazla besinleri depolayıp gerektiğinde bırakır · kazıcı balıklara uygundur · kullanımdan önce musluk suyuyla durulanmalıdır`,
    sourceUrl,verifiedAt:"2026-09-18",
  })),
  ...[
    ["Manado DARK 3 L (Eski nesil arşiv)","6703500","https://www.jbl.de/?country=ie&func=detail&id=25145632&lang=en&mod=productsv2"],
    ["Manado DARK 5 L (Eski nesil arşiv)","6703600","https://www.jbl.de/?country=hr&func=detail&id=25145647&lang=en&mod=productsv2"],
    ["Manado DARK 10 L (Eski nesil arşiv)","6703700","https://www.jbl.de/en-hk/productsv2/detail/25153962"],
  ].map(([model,itemNumber,sourceUrl])=>({
    id:catalogSlug(`JBL-${model}`),brand:"JBL",model,category:"substrate" as const,
    description:`Eski nesil koyu renkli tatlı su taban malzemesi · ürün kodu ${itemNumber} · gözenekli yapı ve yüksek demirli besin tamponu · kazıcı balıklara uygundur · ilk kullanımda geçici demir çökelmesi ve sertlik artışı görülebilir; durulama ve ilk 10 gün iki günde bir %50 su değişimi önerilir · resmî sayfada arşivlenmiştir`,
    sourceUrl,verifiedAt:"2026-09-18",
  })),
  ...products("JBL","substrate","https://www.jbl.de/en/blog/detail/292/the-jbl-substrates-for-aquariums-at-a-glance?country=id",[
    ["PROSCAPE PLANT SOIL BEIGE 3 L (Arşiv)","Eski nesil bej, çift pişirilmiş aktif soil · 3 L · ilave gübre içerir · suyu yumuşatıp pH'ı hafif asidik aralığa taşır · yoğun bitkili aquascape akvaryumları için · taban filtresinde kullanılmamalıdır"],
    ["PROSCAPE PLANT SOIL BEIGE 9 L (Arşiv)","Eski nesil bej, çift pişirilmiş aktif soil · 9 L · ilave gübre içerir · suyu yumuşatıp pH'ı hafif asidik aralığa taşır · yoğun bitkili aquascape akvaryumları için · taban filtresinde kullanılmamalıdır"],
  ],"2026-09-18"),
  ...products("JBL","substrate","https://www.jbl.de/?country=gb&func=detail&id=25178073&lang=en&mod=productsv2",[
    ["PROSCAPE PLANT SOIL BROWN 3 L (Arşiv)","Eski nesil kahverengi, çift pişirilmiş aktif soil · ürün kodu 6708000 · 3 L · ilave gübre ve mineraller içerir · suyu yumuşatıp pH'ı hafif asidik aralığa taşır · yoğun bitkili aquascape akvaryumları için · taban filtresinde kullanılmamalıdır"],
    ["PROSCAPE PLANT SOIL BROWN 9 L (Arşiv)","Eski nesil kahverengi, çift pişirilmiş aktif soil · ürün kodu 6708100 · 9 L · ilave gübre ve mineraller içerir · suyu yumuşatıp pH'ı hafif asidik aralığa taşır · yoğun bitkili aquascape akvaryumları için · taban filtresinde kullanılmamalıdır"],
  ],"2026-09-18"),
  ...products("JBL","substrate","https://www.jbl.de/en/blog/detail/292/the-jbl-substrates-for-aquariums-at-a-glance?country=id",[
    ["PROSCAPE SHRIMPS SOIL BEIGE 3 L (Arşiv)","Eski nesil bej, çift pişirilmiş aktif karides soil'i · 3 L · ilave gübre içermez · suyu yumuşatıp pH'ı hafif asidik aralığa taşır · yumuşak su isteyen karides ve diğer canlılar için"],
    ["PROSCAPE SHRIMPS SOIL BEIGE 9 L (Arşiv)","Eski nesil bej, çift pişirilmiş aktif karides soil'i · 9 L · ilave gübre içermez · suyu yumuşatıp pH'ı hafif asidik aralığa taşır · yumuşak su isteyen karides ve diğer canlılar için"],
  ],"2026-09-18"),
  ...products("JBL","substrate","https://www.jbl.de/en/products/detail/6496/jbl-proscape-shrimps-soil-brown?country=ba",[
    ["PROSCAPE SHRIMPS SOIL BROWN 3 L (Arşiv)","Eski nesil kahverengi, çift pişirilmiş aktif karides soil'i · ürün kodu 6708400 · 3 L · ilave gübre içermez · suyu yumuşatıp pH'ı hafif asidik aralığa taşır · yumuşak su isteyen karides ve diğer canlılar için"],
    ["PROSCAPE SHRIMPS SOIL BROWN 9 L (Arşiv)","Eski nesil kahverengi, çift pişirilmiş aktif karides soil'i · ürün kodu 6708500 · 9 L · ilave gübre içermez · suyu yumuşatıp pH'ı hafif asidik aralığa taşır · yumuşak su isteyen karides ve diğer canlılar için"],
  ],"2026-09-18"),
  ...products("JBL","filter_media","https://www.jbl.de/en/products/detail/2420/jbl-carbomec-activ?country=hu",[
    ["Carbomec activ 400 g","Tatlı su akvaryumlarında yaklaşık 200 L su için pH 6,5–7,5 aralığına ayarlı aktif karbon · ilaç kalıntısı, renklenme ve organik kirleticileri giderir · fosfat salmaz · sürekli değil, sorun çözülene kadar kısa süreli kullanılmalıdır"],
  ],"2026-09-18"),
  ...products("JBL","filter_media","https://www.jbl.de/en-fi/productsv2/detail/25164252",[
    ["Carbomec ultra 400 g","Deniz suyu ile Malawi/Tanganika akvaryumlarındaki pH 7,5–8,5 koşulları için 400 g pellet aktif karbon · renklenme ve organik kirleticileri giderir · fosfat salmaz · tatlı suda ilaç kalıntısı için yalnız 2–3 gün kullanılmalıdır"],
  ],"2026-09-18"),
  ...products("JBL","filter_media","https://www.jbl.de/en/products/detail/2423/jbl-tormec-activ?country=bn",[
    ["Tormec activ 1000 ml (Arşiv)","Yaklaşık 800 L tatlı su için iki bileşenli aktif torf pelletleri · karbonat sertliği ve pH'ı düşürür, hümik madde ekler ve suyu hafif kehribar renge taşır · kullanımdan önce 24 saat ıslatılır · resmî ürün sayfasında arşivlenmiştir"],
  ],"2026-09-18").map((item) => ({...item,additionalSourceUrls:["https://www.jbl.de/en/download/11627/Allgemein/JBL_Hauptkatalog_fr.pdf"]})),
  ...products("JBL","filter_media","https://www.jbl.de/en/products/detail/8228/jbl-silicatex-rapid?country=md",[
    ["SilicatEx Rapid 400 g","Tatlı ve deniz suyunda 200–400 L için silikat ve fosfat bağlayan 400 g granül · 1 kg başına 30000 mg SiO₂ bağlama kapasitesi · 400 g paket yaklaşık 12000 mg silikat bağlar · yumuşak suda KH ve pH izlenmelidir"],
  ],"2026-09-18"),
  ...products("JBL","filter_media","https://www.jbl.de/en-ie/productsv2/detail/25166419",[
    ["NitratEx 250 ml","Yalnız tatlı su için 250 ml/170 g iyon değiştirici reçine · yaklaşık 200 L su için 9000 mg nitrat bağlar · nitrat yükseldiğinde sofra tuzuyla yenilenebilir · torfla aynı anda kullanılmamalıdır"],
  ],"2026-09-18"),
  ...products("JBL","filter_media","https://www.jbl.de/en/products/detail/8032/jbl-bionitratex?country=fi&cpref=44",[
    ["BioNitratEx 100 biyolojik top","Tatlı ve deniz suyunda 200–300 L için 100 biyolojik top · doz 2–3 L suya bir top · bakteriyel denitrifikasyonla çalışır, yaklaşık altı ay sonra eksilen miktar tamamlanır · düzenli su değişiminin yerine geçmez"],
  ],"2026-09-18"),
  ...products("JBL","filter_media","https://www.jbl.de/en-au/productsv2/detail/25211093",[
    ["PhosEx ultra 340 g","Tatlı ve deniz suyunda toplam 18000 mg fosfatı kalıcı bağlayan 340 g çözünmez demir bileşiği · ağ torba ve klips içerir · fosfat testiyle etkinliği izlenmelidir"],
  ],"2026-09-18"),
  ...products("JBL","filter_media","https://www.jbl.de/en-us/productsv2/detail/25165953",[
    ["ClearMec plus 600 ml / 450 g","Tatlı suda 150–300 L için iki hazır torbada toplam 600 ml/450 g nitrit, nitrat ve fosfat giderici medya · son ince filtre katmanından hemen önce yerleştirilir · yaklaşık üç ay sonra veya değerler yeniden yükseldiğinde yenilenir"],
  ],"2026-09-18"),
  ...products("JBL","filter_media","https://www.jbl.de/en/products/detail/9764/jbl-cermec?country=us",[
    ["Cermec 700 g","Tatlı ve deniz suyunda mekanik ön filtreleme ve biyolojik yerleşim için 700 g seramik halka · halka ölçüsü 17,4 × 17,4 mm, iç çap 7,75 mm · ağ torba içerir"],
  ],"2026-09-18"),
  ...products("JBL","filter_media","https://www.jbl.de/en/products/detail/10415/jbl-sintomec?country=mu",[
    ["Sintomec 450 g","Tatlı ve deniz suyunda biyolojik kirletici parçalanması için 450 g sinterlenmiş cam halka · 1200 m²/L yüzey · 5 mm iç delik · büyük filtre hacimleri ve yüksek akış için uygundur"],
  ],"2026-09-18"),
  ...products("JBL","filter_media","https://www.jbl.de/en/products/detail/2418/jbl-micromec?country=hu&cpref=768",[
    ["Micromec 650 g","Tatlı ve deniz suyunda biyolojik kirletici parçalanması için 650 g, yaklaşık 14 mm çaplı sinterlenmiş cam bilye · 1500 m²/L yüzey · küçük filtre hacimleri için uygundur"],
  ],"2026-09-18"),
  ...products("JBL","filter_media","https://www.jbl.de/en/products/detail/2407/jbl-filterpad-vl?country=hu&cpref=76",[
    ["FilterPad VL CristalProfi 120/250 (Arşiv)","Eski JBL CristalProfi 120 ve 250 dış filtrelere hazır kesilmiş iki adet çok ince elyaf ped · etkili son mekanik filtrasyon için kısa süreli kullanılır; tıkandığında akışı kısıtlamaması için yeniden kullanılmaz · ürün kodu 6220100 · resmî ürün ailesi arşivlenmiştir"],
    ["FilterPad VL CristalProfi 500 (Arşiv)","Eski JBL CristalProfi 500 dış filtreye hazır kesilmiş iki adet çok ince elyaf ped · etkili son mekanik filtrasyon için kısa süreli kullanılır; tıkandığında akışı kısıtlamaması için yeniden kullanılmaz · ürün kodu 6220200 · resmî ürün sayfası arşivlenmiştir"],
  ],"2026-09-18").map((item) => ({...item,additionalSourceUrls:["https://www.jbl.de/en/download/11627/Allgemein/JBL_Hauptkatalog_fr.pdf"]})),
  ...products("JBL","filter_media","https://www.jbl.de/en/products/detail/2408/jbl-filterpad-f15?country=bg",[
    ["FilterPad F15 CristalProfi 120/250 (Son şans)","Eski JBL CristalProfi 120 ve 250 dış filtreler için iki adet 15 ppi kaba, açık gözenekli nötr polyether sünger · tatlı ve deniz suyunda mekanik/biyolojik filtrasyon · ürün kodu 6221000 · üretici sayfasında son şans olarak listelenir"],
    ["FilterPad F15 CristalProfi 500 (Son şans)","Eski JBL CristalProfi 500 dış filtre için iki adet 15 ppi kaba, açık gözenekli nötr polyether sünger · tatlı ve deniz suyunda mekanik/biyolojik filtrasyon · ürün kodu 6221100 · üretici sayfasında son şans olarak listelenir"],
  ],"2026-09-18"),
  ...products("JBL","filter_media","https://www.jbl.de/en/products/detail/2409/jbl-filterpad-f35?country=bg",[
    ["FilterPad F35 CristalProfi 120/250 (Son şans)","Eski JBL CristalProfi 120 ve 250 dış filtreler için iki adet 35 ppi ince, açık gözenekli nötr polyether sünger · tatlı ve deniz suyunda mekanik/biyolojik filtrasyon · ürün kodu 6220600 · üretici sayfasında son şans olarak listelenir"],
    ["FilterPad F35 CristalProfi 500 (Arşiv)","Eski JBL CristalProfi 500 dış filtre için iki adet 35 ppi ince, açık gözenekli nötr polyether sünger · tatlı ve deniz suyunda mekanik/biyolojik filtrasyon · ürün kodu 6220700 · güncel seçimde bulunmadığından resmî katalog kaydı arşiv olarak korunur"],
  ],"2026-09-18").map((item) => ({...item,additionalSourceUrls:["https://www.jbl.de/en/download/11627/Allgemein/JBL_Hauptkatalog_fr.pdf"]})),
  ...products("JBL","filter_media","https://www.jbl.de/en/products/detail/3052/jbl-combibloc-cristalprofi-e?country=ee&cpref=352",[
    ["CombiBloc CristalProfi e4/7/900/1/2 6 parça","CristalProfi e4/7/900/1/2 üst sepeti için altı parçalı eski nesil set · dört 10 ppi ön filtre pedi, bir 20 ppi orta ve bir 30 ppi ince sünger · tatlı ve deniz suyunda nötr"],
    ["CombiBloc CristalProfi e15/1900/1/2 6 parça","CristalProfi e15/1900/1/2 üst sepeti için altı parçalı eski nesil set · dört 10 ppi ön filtre pedi, bir 20 ppi orta ve bir 30 ppi ince sünger · tatlı ve deniz suyunda nötr"],
  ],"2026-09-18"),
  ...products("JBL","filter_media","https://www.jbl.de/en/products/detail/3057/jbl-cristalprofi-unibloc-e?country=fi",[
    ["CRISTALPROFI UNIBLOC e4/7/90X 2'li","CristalProfi e4/7/90X orta sepetleri için iki adet 25 ppi biyolojik filtre süngeri · merkez kesiti özel filtre medyası yerleştirmek için çıkarılabilir · ürün kodu 6016100"],
    ["CRISTALPROFI UNIBLOC e15/190X 2'li","CristalProfi e15/190X orta sepetleri için iki adet 25 ppi biyolojik filtre süngeri · merkez kesiti özel filtre medyası yerleştirmek için çıkarılabilir · ürün kodu 6016200"],
  ],"2026-09-18"),
  ...products("JBL","filter_media","https://www.jbl.de/en/products/detail/3070/jbl-cristalprofi-clearmec-e?country=ua&cpref=742",[
    ["CRISTALPROFI CLEARMEC e4/7/900/1/2 500 ml","CristalProfi e4/7/900/1/2 için 500 ml nitrit, nitrat ve fosfat giderici set · iki yuvarlak sünger ile ortadaki torbada kil bilye/reçine karışımı · üstten bir önceki boş sepete komple yerleştirilir · ürün kodu 6017500"],
    ["CRISTALPROFI CLEARMEC e15/1900/1/2 800 ml","CristalProfi e15/1900/1/2 için 800 ml nitrit, nitrat ve fosfat giderici set · iki yuvarlak sünger ile ortadaki torbada kil bilye/reçine karışımı · üstten bir önceki boş sepete komple yerleştirilir · ürün kodu 6017600"],
  ],"2026-09-18"),
  ...products("JBL","filter_media","https://www.jbl.de/en/products/detail/8034/jbl-cristalprofi-combibloc-ii?country=dk&cpref=56",[
    ["CRISTALPROFI COMBIBLOC II e4/7/902 3 parça","CristalProfi e402/e702/e902 üst sepeti için üç lazer kesim sünger · iki kaba 15 ppi ve bir ince 35 ppi · tatlı ve deniz suyunda nötr"],
    ["CRISTALPROFI COMBIBLOC II e15/1902 3 parça","CristalProfi e1502/e1902 üst sepeti için üç lazer kesim sünger · iki kaba 15 ppi ve bir ince 35 ppi · tatlı ve deniz suyunda nötr"],
  ],"2026-09-18"),
  ...products("JBL","filter_media","https://www.jbl.de/en/products/detail/8037/jbl-cristalprofi-symecpad-e?country=mt&cpref=998",[
    ["CRISTALPROFI SYMECPAD e4/7/901/2 6'lı","CristalProfi e4/7/901/2 için hazır kesilmiş altı çok ince elyaf ped · bir süngerin yerine takılır · ağır kirlendiğinde yalnız bir kez durulanıp ardından değiştirilir"],
    ["CRISTALPROFI SYMECPAD e15/1901/2 6'lı","CristalProfi e15/1901/2 için hazır kesilmiş altı çok ince elyaf ped · bir süngerin yerine takılır · ağır kirlendiğinde yalnız bir kez durulanıp ardından değiştirilir"],
  ],"2026-09-18"),
  ...products("JBL","filter_media","https://www.jbl.de/en/products/detail/7336/jbl-procristal-i30-filtersponge?country=il",[
    ["PROCRISTAL i30 FilterSponge 1'li","JBL PROCRISTAL i30 için bir adet 30 ppi biyolojik/mekanik yedek sünger · 10–40 L akvaryumlar için · üretici üç ayda bir yenilemeyi belirtir · ürün kodu 6099300"],
  ],"2026-09-18"),
  ...products("JBL","filter_media","https://www.jbl.de/en/products/detail/7328/jbl-procristal-i30-superclear?country=ie",[
    ["PROCRISTAL i30 SuperClear 2'li","JBL PROCRISTAL i30 için iki hazır kartuş; her kartuşta 25 ml yüksek performanslı aktif karbon · yem/metabolizma kalıntılarını ve renklenmeyi bağlar · kartuş ayda bir değiştirilir · ürün kodu 6099100"],
    ["PROCRISTAL i30 SuperClear 6'lı (Son şans)","JBL PROCRISTAL i30 için altı hazır kartuş; her kartuşta 25 ml yüksek performanslı aktif karbon · yem/metabolizma kalıntılarını ve renklenmeyi bağlar · kartuş ayda bir değiştirilir · ürün kodu 6099200 · üretici sayfasında son şans olarak listelenir"],
  ],"2026-09-18"),
  ...products("JBL","filter_media","https://www.jbl.de/en/products/detail/7331/jbl-procristal-i30-greenstop?country=es",[
    ["PROCRISTAL i30 GreenStop 2'li (Arşiv)","JBL PROCRISTAL i30 için iki hazır özel medya kartuşu; her kartuş 25 ml · yeşil suyu destekleyen fosfat, nitrat ve nitriti sudan çeker · kartuş ayda bir değiştirilir · ürün kodu 6099400 · resmî seçim arşivlenmiştir"],
    ["PROCRISTAL i30 GreenStop 6'lı","JBL PROCRISTAL i30 için altı hazır özel medya kartuşu; her kartuş 25 ml · yeşil suyu destekleyen fosfat, nitrat ve nitriti sudan çeker · kartuş ayda bir değiştirilir · ürün kodu 6099500"],
  ],"2026-09-18"),
  ...products("JBL","filter_media","https://www.jbl.de/en/products/detail/6857/jbl-unibloc-cristalprofi-i6080100200?country=ge",[
    ["UniBloc CristalProfi i60/80/100/200 1'li","CristalProfi i60/i80/i100/i200 için iç borusuz bir adet 20 ppi, suya nötr yedek sünger · mekanik ve biyolojik filtrasyon için FilterStart ile aşılanıp modüle yerleştirilir · ürün kodu 6092800"],
  ],"2026-09-18"),
  ...products("JBL","filter_media","https://www.jbl.de/en/products/detail/3011/jbl-phosex-ultra-cristalprofi-i6080100200?country=ie&cpref=742",[
    ["PhosEx ultra CristalProfi i60/80/100/200 190 ml","CristalProfi i60/i80/i100/i200 için iç borulu, kullanıma hazır 190 ml fosfat giderici kartuş · 50–100 L için · 2–3 ay sonra veya fosfat yeniden yükseldiğinde yenilenir ya da PhosEx ultra ile doldurulur · ürün kodu 6093100"],
  ],"2026-09-18"),
  ...products("JBL","filter_media","https://www.jbl.de/en/products/detail/3009/jbl-carbomec-ultra-pad-cristalprof-i6080100200?country=gb",[
    ["CarboMec ultra CristalProfi i60/80/100/200 190 ml","CristalProfi i60/i80/i100/i200 için 190 ml, suya nötr ve fosfat salmayan aktif karbon kartuşu · 50–100 L için · renklenme, koku ve ilaç kalıntıları giderildiğinde veya en geç 2–3 hafta sonra çıkarılır · ürün kodu 6093000"],
  ],"2026-09-18"),
  ...products("JBL","filter_media","https://www.jbl.de/en/products/detail/3013/jbl-clearmec-cristalprofi-i6080100200?country=gb",[
    ["ClearMec CristalProfi i60/80/100/200 190 ml","CristalProfi i60/i80/i100/i200 için iç borulu, kullanıma hazır 190 ml nitrit, nitrat ve fosfat giderici kartuş · 50–100 L için · yaklaşık üç ay sonra yenilenir · ürün kodu 6093200"],
  ],"2026-09-18"),
  ...products("JBL","filter_media","https://www.jbl.de/en/products/detail/3015/jbl-tormec-cristalprofi-i6080100200?country=gb",[
    ["TorMec CristalProfi i60/80/100/200 190 ml (Son şans)","CristalProfi i60/i80/i100/i200 için iç borulu, kullanıma hazır 190 ml aktif torf granülü kartuşu · 50–100 L için · yaklaşık üç ay sonra yenilenir · ürün kodu 6093300 · üretici sayfasında son şans olarak listelenir"],
  ],"2026-09-18"),
  ...products("JBL","filter_media","https://www.jbl.de/en/products/detail/3007/jbl-micromec-cristalprofi-i6080100200?country=gb&cpref=694",[
    ["MicroMec CristalProfi i60/80/100/200 190 ml","CristalProfi i60/i80/i100/i200 için iç borulu, kullanıma hazır 190 ml yüksek performanslı sinterlenmiş cam filtre bilyesi kartuşu · bilyeler temizlenip yeniden kullanılabilir · ürün kodu 6092900"],
  ],"2026-09-18"),
  ...products("JBL","filter_media","https://www.jbl.de/en/products/detail/5174/jbl-cp-m-greenline-filterpad?country=fi",[
    ["CristalProfi m greenline FilterPad 35 ppi","CristalProfi m greenline iç filtre için yıkanabilir 35 ppi ince gözenekli yedek sünger · küçük balık ve karideslerin emilmesini önleyen dış yüzey · ürün kodu 6096700"],
  ],"2026-09-18"),
  ...products("JBL","filter_media","https://www.jbl.de/en/products/detail/6515/jbl-cp-m-greenline-filterpad-module?country=gb",[
    ["CristalProfi m greenline Modul FilterPad 2'li","CristalProfi m greenline uzatma modülü için iki adet 13 × 9 cm tam oturan yedek sünger · yaklaşık iki kez nazikçe durulandıktan sonra veya temizlenemeyen bölgeler oluştuğunda yenilenir · ürün kodu 6096800"],
  ],"2026-09-18"),
  ...products("JBL","filter_media","https://www.jbl.de/en/products/detail/2402/jbl-symec-micro?country=tw",[
    ["Symec micro 25 × 74 cm","Bir adet 25 × 74 cm su nötr sentetik mikro elyaf keçe · 1/1000 mm ve üzerindeki en ince parçacıkları tutar · filtreye son katman olarak tek kat ve kesitten 1–2 mm büyük yerleştirilir · 12 saat sonra, en geç 24 saatte çıkarılır ve kesilen parça yalnız bir kez kullanılır · ürün kodu 6238700"],
  ],"2026-09-18"),
  ...products("JBL","filter_media","https://www.jbl.de/en/products/detail/2403/jbl-symec-filter-floss?country=si",[
    ["Symec filtre elyafı 100 g","Tatlı ve deniz suyu filtreleri için kalıntı ve lif bırakmayan tamamen sentetik ince elyaf · son filtre katmanına istenen miktarda yerleştirilir · su debisi düştüğünde çıkarılır; yıkanabilse de yenilenmesi önerilir"],
    ["Symec filtre elyafı 250 g","Tatlı ve deniz suyu filtreleri için kalıntı ve lif bırakmayan tamamen sentetik ince elyaf · son filtre katmanına istenen miktarda yerleştirilir · su debisi düştüğünde çıkarılır; yıkanabilse de yenilenmesi önerilir"],
    ["Symec filtre elyafı 500 g","Tatlı ve deniz suyu filtreleri için kalıntı ve lif bırakmayan tamamen sentetik ince elyaf · son filtre katmanına istenen miktarda yerleştirilir · su debisi düştüğünde çıkarılır; yıkanabilse de yenilenmesi önerilir · ürün kodu 6231500"],
    ["Symec filtre elyafı 1000 g","Tatlı ve deniz suyu filtreleri için kalıntı ve lif bırakmayan tamamen sentetik ince elyaf · son filtre katmanına istenen miktarda yerleştirilir · su debisi düştüğünde çıkarılır; yıkanabilse de yenilenmesi önerilir"],
  ],"2026-09-18"),
  ...products("JBL","filter_media","https://www.jbl.de/en/products/detail/2404/jbl-symec-xl?country=ge",[
    ["Symec XL 250 g yeşil","Sıkışmayan yapıda 250 g kalın yeşil sentetik filtre elyafı · tatlı ve deniz suyu filtrelerinde son katman olarak kullanılır · su debisi düştüğünde çıkarılır; yıkanabilse de yenilenmesi önerilir · ürün kodu 6232500"],
  ],"2026-09-18"),
  ...products("JBL","filter_media","https://www.jbl.de/en/products/detail/2406/jbl-symec-vl?country=il",[
    ["Symec VL 80 × 25 × 3 cm","Bir adet 80 × 25 × 3 cm kesilebilir, su nötr sentetik filtre keçesi · tatlı ve deniz suyunda son filtre katmanı olarak kullanılır · 3 cm kalınlıktaki keçe yıkanabilse de debi düştüğünde yenilenmesi önerilir · ürün kodu 6231000"],
  ],"2026-09-18"),
  ...products("JBL","filter_media","https://www.jbl.de/en/products/detail/2410/jbl-fine-filter-foam?country=ca",[
    ["Mavi ince filtre süngeri 50 × 50 × 2,5 cm","Su nötr polieterden, yıkanabilir 30 ppi ince gözenekli kesilebilir sünger · tatlı su, deniz suyu ve havuz filtrelerinde ön veya uzun süreli filtre katmanı · kesitten 1–2 mm büyük kesilerek boşluk bırakmadan yerleştirilir · ürün kodu 6256200"],
    ["Mavi ince filtre süngeri 50 × 50 × 5 cm","Su nötr polieterden, yıkanabilir 30 ppi ince gözenekli kesilebilir sünger · tatlı su, deniz suyu ve havuz filtrelerinde ön veya uzun süreli filtre katmanı · kesitten 1–2 mm büyük kesilerek boşluk bırakmadan yerleştirilir · ürün kodu 6256100"],
    ["Mavi ince filtre süngeri 50 × 50 × 10 cm","Su nötr polieterden, yıkanabilir 30 ppi ince gözenekli kesilebilir sünger · tatlı su, deniz suyu ve havuz filtrelerinde ön veya uzun süreli filtre katmanı · kesitten 1–2 mm büyük kesilerek boşluk bırakmadan yerleştirilir · ürün kodu 6256300"],
  ],"2026-09-18"),
  ...products("JBL","filter_media","https://www.jbl.de/en/products/detail/2411/jbl-coarse-filter-foam?country=dk",[
    ["Mavi kaba filtre süngeri 50 × 50 × 2,5 cm","Su nötr polieterden, yıkanabilir 10 ppi kaba gözenekli kesilebilir sünger · tatlı su, deniz suyu ve havuz filtrelerinde ön veya uzun süreli filtre katmanı · kesitten 1–2 mm büyük kesilerek boşluk bırakmadan yerleştirilir · ürün kodu 6256500"],
    ["Mavi kaba filtre süngeri 50 × 50 × 5 cm","Su nötr polieterden, yıkanabilir 10 ppi kaba gözenekli kesilebilir sünger · tatlı su, deniz suyu ve havuz filtrelerinde ön veya uzun süreli filtre katmanı · kesitten 1–2 mm büyük kesilerek boşluk bırakmadan yerleştirilir · ürün kodu 6256000"],
    ["Mavi kaba filtre süngeri 50 × 50 × 10 cm","Su nötr polieterden, yıkanabilir 10 ppi kaba gözenekli kesilebilir sünger · tatlı su, deniz suyu ve havuz filtrelerinde ön veya uzun süreli filtre katmanı · kesitten 1–2 mm büyük kesilerek boşluk bırakmadan yerleştirilir · ürün kodu 6256600"],
  ],"2026-09-18"),
  ...products("JBL","bacteria","https://www.jbl.de/en/products/detail/2320/jbl-denitrol?country=se",[
    ["Denitrol 100 ml (Arşiv)","Tatlı, acı ve deniz suyunda amonyum/amonyak ile nitriti parçalayan canlı bakteri ve enzim kültürü · ilk kurulum ve hastalık sonrası 20 L suya 10 ml, su değişiminde 300 L suya 10 ml · şişe 3000 L su değişim dozuna yeter · ürün kodu 2306110"],
    ["Denitrol 250 ml","Tatlı, acı ve deniz suyunda amonyum/amonyak ile nitriti parçalayan canlı bakteri ve enzim kültürü · ilk kurulum ve hastalık sonrası 20 L suya 10 ml, su değişiminde 300 L suya 10 ml · şişe 7500 L su değişim dozuna yeter · ürün kodu 2306200"],
  ],"2026-09-18"),
  ...products("JBL","bacteria","https://www.jbl.de/en/products/detail/2321/jbl-filterstart?country=de",[
    ["FilterStart 10 ml","Yeni veya temizlenmiş filtre medyasını biyolojik olarak başlatan, amonyum/amonyak ve nitriti parçalayan canlı bakteri kültürü · şişe çalkalanır ve 10 ml ürün 3 L filtre malzemesine uygulanır · 35 °C üzerinde saklanmaz · ürün kodu 2518200"],
  ],"2026-09-18"),
  ...products("JBL","bacteria","https://www.jbl.de/en/products/detail/3614/jbl-filterstart-red?country=es",[
    ["FilterStart Red 10 ml","Japon balığı ve tül kuyruk gibi serin su varyetelerinin filtreleri için uyarlanmış sekiz canlı bakteri kültürü · amonyum/amonyak ve nitrit parçalanmasını başlatır · 10 ml ürün 3 L filtre malzemesine yeter · şişe çalkalanır ve 35 °C üzerinde saklanmaz · ürün kodu 2518400"],
  ],"2026-09-18"),
  ...products("JBL","bacteria","https://www.jbl.de/en/products/detail/2322/jbl-filterboost?country=dz",[
    ["FilterBoost 25 g","Tatlı/deniz suyu, karides ve su kaplumbağası sistemlerinde çok katmanlı filtrelerin ilk katına yerleştirilen bakteri etkin mineralli granül · organik tortuyu parçalayarak tıkanmayı geciktirir · 25 g ürün 5–6 L filtre hacmine yeter · tek sünger kartuşlu iç filtrelere uygun değildir · ürün kodu 2518500"],
  ],"2026-09-18"),
  ...products("JBL","bacteria","https://www.jbl.de/en/products/detail/8056/jbl-startkit?country=us",[
    ["StartKit 2 × 15 ml","10–60 L tatlı su akvaryumu için 15 ml Biotopol su düzenleyici ve 15 ml Denitrol bakteri başlatıcı seti · balık, karides ve su kaplumbağası sistemlerine uygun · önce Biotopol, 15 dakika sonra Denitrol eklenir · ürün kodu 2301000"],
  ],"2026-09-18"),
  ...products("JBL","bacteria","https://www.jbl.de/en/products/detail/8560/jbl-proclean-bac?country=nz",[
    ["PROCLEAN BAC 50 ml","60–200 L tatlı su akvaryumu için tek kullanımlık 50 ml canlı bakteri konsantresi · su değişimi, filtre temizliği, ilaç kullanımı veya yeni balık eklenmesinden sonra tüm kartuş akvaryuma dökülür · amonyum/amonyak ve nitriti parçalar, filtreyi destekler ve taban tortusunu azaltır · ürün kodu 2302700"],
  ],"2026-09-18"),
  ...products("JBL","water_conditioner","https://www.jbl.de/en/products/detail/2316/jbl-biotopol?country=ca",[
    ["Biotopol 100 ml","Tatlı su akvaryumları ve su kaplumbağaları için klor, kloramin, bakır, kurşun ve çinkoyu nötralize eden su düzenleyici · aloe vera ve B vitamini kompleksi · doz 40 L suya 10 ml · omurgasız bulunan akvaryumlarda musluk suyu önce ayrı kovada hazırlanmalıdır"],
    ["Biotopol 250 ml","1000 L su için tatlı su ve su kaplumbağası su düzenleyicisi · klor, kloramin, bakır, kurşun ve çinkoyu nötralize eder · doz 40 L suya 10 ml · omurgasız bulunan akvaryumlarda ayrı kova yöntemi kullanılmalıdır"],
    ["Biotopol 500 ml","2000 L su için tatlı su ve su kaplumbağası su düzenleyicisi · klor, kloramin, bakır, kurşun ve çinkoyu nötralize eder · doz 40 L suya 10 ml · omurgasız bulunan akvaryumlarda ayrı kova yöntemi kullanılmalıdır"],
    ["Biotopol Refill 500+125 ml","Toplam 625 ml çevre dostu yedek paket · 2500 L su için tatlı su ve su kaplumbağası su düzenleyicisi · doz 40 L suya 10 ml · omurgasız bulunan akvaryumlarda ayrı kova yöntemi kullanılmalıdır"],
    ["Biotopol 5 L","20000 L su için büyük ambalaj tatlı su ve su kaplumbağası su düzenleyicisi · doz 40 L suya 10 ml · omurgasız bulunan akvaryumlarda ayrı kova yöntemi kullanılmalıdır"],
  ],"2026-09-18"),
  ...products("JBL","water_conditioner","https://www.jbl.de/en/products/detail/2318/jbl-biotopol-r?country=hu&cpref=998",[
    ["Biotopol R 100 ml","Özellikle Japon balığı akvaryumları için su düzenleyici · klor, kloramin, bakır, kurşun ve çinkoyu nötralize eder · aloe vera, B vitaminleri ve hassas gözler için gözotu (Euphrasia) özü · doz 20 L suya 10 ml · bakteri başlangıç ürününden bir saat önce kullanılır"],
  ],"2026-09-18"),
  ...products("JBL","water_conditioner","https://www.jbl.de/en-us/productsv2/detail/25201655",[
    ["Nano-Biotopol Betta 15 ml","Betta akvaryumlarında yeni kurulum ve su değişimi için tropikal badem yaprağı özlü su düzenleyici · bakır, çinko, kurşun ve kloru nötralize eder · 180 L'ye kadar kullanım · doz 1 L suya 2 damla"],
  ],"2026-09-18"),
  ...products("JBL","water_conditioner","https://www.jbl.de/en/products/detail/3213/jbl-biotopol-c?country=ge",[
    ["Biotopol C 100 ml","Karides ve diğer kabukluların bulunduğu akvaryumlar için su düzenleyici · çinko ve kurşunu nötralize eder, kloru giderir ve bakırı bağlar · kabuk gelişimi ile deri değiştirme için mineral desteği · doz 40 L suya 10 ml · omurgasızların bakırla temas etmemesi için yeni su ayrı kovada hazırlanmalıdır"],
  ],"2026-09-18"),
  ...products("JBL","water_conditioner","https://www.jbl.de/en/products/detail/2340/jbl-acclimol?country=hu&cpref=968",[
    ["Acclimol 50 ml","Yeni balık ekleme, akvaryumda çalışma ve taşıma sonrasında stres koruması için 50 ml su düzenleyici · C vitaminli multivitamin, koruyucu kolloid ve iyot kompleksi · doz 40 L suya 10 ml"],
    ["Acclimol 100 ml","400 L su için alıştırma ve stres desteği · C vitaminli multivitamin, koruyucu kolloid ve iyot kompleksi · doz 40 L suya 10 ml"],
    ["Acclimol 250 ml","1000 L su için alıştırma ve stres desteği · C vitaminli multivitamin, koruyucu kolloid ve iyot kompleksi · doz 40 L suya 10 ml"],
    ["Acclimol 500 ml","2000 L su için alıştırma ve stres desteği · C vitaminli multivitamin, koruyucu kolloid ve iyot kompleksi · doz 40 L suya 10 ml"],
    ["Acclimol 5 L","20000 L su için büyük ambalaj alıştırma ve stres desteği · C vitaminli multivitamin, koruyucu kolloid ve iyot kompleksi · doz 40 L suya 10 ml"],
  ],"2026-09-18"),
  ...products("JBL","water_conditioner","https://www.jbl.de/en/products/detail/2319/jbl-tropol?country=ae",[
    ["Tropol 100 ml","400 L tatlı su ve karides akvaryumu için torf hümik maddeleri ve meşe kabuğu tanenleri içeren siyah su düzenleyicisi · doz 40 L suya 10 ml · Biotopol yerine tam musluk suyu düzenleyicisi değildir"],
    ["Tropol 250 ml","1000 L tatlı su ve karides akvaryumu için torf hümik maddeleri ve meşe kabuğu tanenleri içeren siyah su düzenleyicisi · doz 40 L suya 10 ml · Biotopol yerine tam musluk suyu düzenleyicisi değildir"],
    ["Tropol 5 L","20000 L tatlı su ve karides akvaryumu için büyük ambalaj siyah su düzenleyicisi · doz 40 L suya 10 ml · Biotopol yerine tam musluk suyu düzenleyicisi değildir"],
  ],"2026-09-18"),
  ...products("JBL","water_conditioner","https://www.jbl.de/en/products/detail/4316/jbl-catappa-xl?country=fi",[
    ["Catappa XL 10 yaprak","Balık ve omurgasızlar için yaklaşık 23 cm uzunluğunda 10 tropikal badem yaprağı · doz 50–100 L suya bir yaprak · etken maddeler 1–3 haftada tamamen salınır"],
  ],"2026-09-18"),
  ...products("JBL","water_conditioner","https://www.jbl.de/en-us/productsv2/detail/25164968",[
    ["Nano-Catappa 10 yaprak","Nano akvaryumlarda balık ve omurgasızlar için 10 tropikal badem yaprağı · doz 15–30 L suya bir yaprak · etken maddeler 1–3 haftada tamamen salınır"],
  ],"2026-09-18"),
  ...products("JBL","water_conditioner","https://www.jbl.de/en/products/detail/8498/jbl-detoxol?country=id",[
    ["Detoxol 100 ml","Tatlı ve deniz suyunda acil amonyak, klor, kloramin ve ağır metal yükünü yaklaşık 10 dakikada nötralize etmeye yönelik su düzenleyici · doz 40 L suya 10 ml; bu doz 30 mg amonyum/amonyak ve 2 mg klor bağlar · en fazla beş kat dozlanabilir · resmî ürün metni nitriti de saysa da üretici SSS'si mevcut nitritin bağlanmadığını belirtir; yüksek nitritte su değişimi ve ölçümün yerine geçmez · ürün kodu 2515600"],
    ["Detoxol 250 ml","Tatlı ve deniz suyunda acil amonyak, klor, kloramin ve ağır metal yükünü yaklaşık 10 dakikada nötralize etmeye yönelik su düzenleyici · doz 40 L suya 10 ml; bu doz 30 mg amonyum/amonyak ve 2 mg klor bağlar · en fazla beş kat dozlanabilir · resmî ürün metni nitriti de saysa da üretici SSS'si mevcut nitritin bağlanmadığını belirtir; yüksek nitritte su değişimi ve ölçümün yerine geçmez"],
  ],"2026-09-18"),
  ...products("JBL","water_conditioner","https://www.jbl.de/en/products/detail/3216/jbl-phosex-rapid?country=mt",[
    ["PhosEx rapid 100 ml","Tatlı su, karides ve su kaplumbağası akvaryumlarında çözünmüş fosfatı demir bileşiğiyle bağlayan sıvı ürün · PO₄ >2,4 mg/L ise 40 L'ye, >1,2 mg/L ise 80 L'ye, >0,6 mg/L ise 160 L'ye 10 ml · 2–24 saat sürebilen kahverengi bulanıklık etkinin göstergesidir · aşındırıcıdır; ciddi cilt ve göz hasarı riski nedeniyle etiket güvenliği izlenir"],
    ["PhosEx rapid 250 ml","Tatlı su, karides ve su kaplumbağası akvaryumlarında çözünmüş fosfatı demir bileşiğiyle bağlayan sıvı ürün · PO₄ >2,4 mg/L ise 40 L'ye, >1,2 mg/L ise 80 L'ye, >0,6 mg/L ise 160 L'ye 10 ml · 2–24 saat sürebilen kahverengi bulanıklık etkinin göstergesidir · aşındırıcıdır; ciddi cilt ve göz hasarı riski nedeniyle etiket güvenliği izlenir · ürün kodu 2519500"],
  ],"2026-09-18"),
  ...products("JBL","water_conditioner","https://www.jbl.de/en/products/detail/2787/jbl-clynol?country=bn",[
    ["Clynol 100 ml","Tatlı/deniz suyu, karides ve su kaplumbağası sistemlerinde mikro ince doğal minerallerle ağır metal, amonyum, protein, koku, renk ve bulanıklığı bağlayan su arındırıcı · haftalık doz 40 L suya 10 ml · ilk bulanıklık 2–24 saatte berraklaşır · 400 L'ye yeter"],
    ["Clynol 250 ml","Tatlı/deniz suyu, karides ve su kaplumbağası sistemlerinde mikro ince doğal minerallerle ağır metal, amonyum, protein, koku, renk ve bulanıklığı bağlayan su arındırıcı · haftalık doz 40 L suya 10 ml · ilk bulanıklık 2–24 saatte berraklaşır · 1000 L'ye yeter"],
    ["Clynol 500 ml","Tatlı/deniz suyu, karides ve su kaplumbağası sistemlerinde mikro ince doğal minerallerle ağır metal, amonyum, protein, koku, renk ve bulanıklığı bağlayan su arındırıcı · haftalık doz 40 L suya 10 ml · ilk bulanıklık 2–24 saatte berraklaşır · 2000 L'ye yeter"],
  ],"2026-09-18"),
  ...products("JBL","water_conditioner","https://www.jbl.de/en/products/detail/2323/jbl-clearol?country=hu",[
    ["Clearol 100 ml","Tatlı su ve su kaplumbağası akvaryumlarında filtrenin tutamadığı beyaz, yeşil ve bakteriyel ince bulanıklığı topaklaştıran berraklaştırıcı · doz 40 L suya 10 ml · yalnız pH >6 ve KH >5 °dKH iken kullanılır; aksi halde ani pH düşüşü riski vardır · haftalık düzenli kullanım önerilmez · 400 L'ye yeter"],
    ["Clearol 250 ml","Tatlı su ve su kaplumbağası akvaryumlarında filtrenin tutamadığı beyaz, yeşil ve bakteriyel ince bulanıklığı topaklaştıran berraklaştırıcı · doz 40 L suya 10 ml · yalnız pH >6 ve KH >5 °dKH iken kullanılır; aksi halde ani pH düşüşü riski vardır · haftalık düzenli kullanım önerilmez · 1000 L'ye yeter · ürün kodu 2303200"],
    ["Clearol 500 ml","Tatlı su ve su kaplumbağası akvaryumlarında filtrenin tutamadığı beyaz, yeşil ve bakteriyel ince bulanıklığı topaklaştıran berraklaştırıcı · doz 40 L suya 10 ml · yalnız pH >6 ve KH >5 °dKH iken kullanılır; aksi halde ani pH düşüşü riski vardır · haftalık düzenli kullanım önerilmez · 2000 L'ye yeter · ürün kodu 2303300"],
  ],"2026-09-18"),
  ...products("JBL","water_conditioner","https://www.jbl.de/en/products/detail/2325/jbl-ph-minus?country=bg",[
    ["pH-Minus 100 ml (Son şans)","Tatlı su, karides ve su kaplumbağası akvaryumlarında doğal meşe özüyle pH düşüren fosfatsız ürün · yalnız KH en az 4 °dKH iken; pH >8 için 40 L'ye, pH 7–8 için 80 L'ye 10 ml, pH <7 iken kullanılmaz · sülfürik asit içerir; ciddi cilt yanığı ve göz hasarı riski nedeniyle etiket güvenliği zorunludur · 400 L'ye kadar"],
    ["pH-Minus 250 ml (Son şans)","Tatlı su, karides ve su kaplumbağası akvaryumlarında doğal meşe özüyle pH düşüren fosfatsız ürün · yalnız KH en az 4 °dKH iken; pH >8 için 40 L'ye, pH 7–8 için 80 L'ye 10 ml, pH <7 iken kullanılmaz · sülfürik asit içerir; ciddi cilt yanığı ve göz hasarı riski nedeniyle etiket güvenliği zorunludur · 1000 L'ye kadar · ürün kodu 2304700"],
  ],"2026-09-18"),
  ...products("JBL","water_conditioner","https://www.jbl.de/en/products/detail/2326/jbl-ph-plus?country=rs",[
    ["pH-Plus 100 ml","Tatlı ve deniz suyunda karbonat sertliğini artırarak pH'ı yükselten/stabilize eden ürün · 40 L suya 10 ml yaklaşık 1 °dKH artış sağlar · tatlı suda pH en fazla 8,5; deniz suyunda hedef KH 10–12 °dKH ve pH 8,0–8,4 · değişim birkaç güne yayılan küçük adımlarla yapılır · 400 L'ye kadar · ürün kodu 2305600"],
    ["pH-Plus 250 ml","Tatlı ve deniz suyunda karbonat sertliğini artırarak pH'ı yükselten/stabilize eden ürün · 40 L suya 10 ml yaklaşık 1 °dKH artış sağlar · tatlı suda pH en fazla 8,5; deniz suyunda hedef KH 10–12 °dKH ve pH 8,0–8,4 · değişim birkaç güne yayılan küçük adımlarla yapılır · 1000 L'ye kadar · ürün kodu 2305700"],
  ],"2026-09-18"),
  ...products("JBL","water_conditioner","https://www.jbl.de/en/products/detail/3785/jbl-nano-crusta?country=mt",[
    ["Nano-Crusta 15 ml","Tatlı su karidesi, cüce kerevit ve salyangozlarda kabuk/deri değiştirme mineralleri sağlayan montmorillonitli destek · haftada 2 L suya bir damla · şişe en fazla 700 L'lik uygulamaya yeter · ilk beyaz bulanıklık birkaç saatte çöker; aşırı doz veya çok güçlü akıntıda kalıcı bulanıklık kontrol edilir · ürün kodu 2310700"],
  ],"2026-09-18"),
  ...products("JBL","water_conditioner","https://www.jbl.de/en/products/detail/5103/jbl-aquadur?country=is",[
    ["Aquadur 250 g","Yumuşak, musluk, yağmur veya osmoz suyunda KH/GH artıran mineral tuzu · düz 18,75 g ölçü kaşığı 100 L'de yaklaşık 2,5 °dKH ve 3,2 °dGH artış sağlar · en az 5–10 L değişim suyunda önceden tamamen çözülür; doğrudan akvaryumdaki yoğun mineral bulutuna balık girmesi önlenir · tozu solumayın, ciddi göz tahrişi riski taşır · ürün no 24902"],
  ],"2026-09-18"),
  ...products("JBL","water_conditioner","https://www.jbl.de/files/faq/393/AquaDur_Web_V01_GB.pdf",[
    ["Aquadur Malawi/Tanganjika 250 g","Malawi ve Tanganjika gölü cikletleri için KH'nin GH'den yüksek olduğu mineral oranını oluşturan tuz · saf osmoz suyunda Malawi hedefi için 100 L'ye 30 g, Tanganjika hedefi için 100 L'ye 78,7 g · musluk suyunda doz başlangıç KH'sına ve seçilen göle göre resmî tablodan belirlenir; KH ölçülmeden sabit doz uygulanmaz · ürün no 24903"],
  ],"2026-09-18"),
  ...products("JBL","fertilizer","https://www.jbl.de/en/products/group/7991/proflora-basis",[
  ],"2026-09-14"),
  ...products("JBL","fertilizer","https://www.jbl.de/en-gb/productsv2/detail/25193747",[
    ["PROFLORA Ferropol 100 ml (Eski seri)","Su değişimi sonrası 40 L başına 10 ml kullanılan demir, potasyum ve iz elementli temel sıvı gübre · fosfat ve nitrat içermez · tatlı su karidesleri ve kerevitleri için üretici dozunda uygundur · seri ülke sayfalarında son şans veya arşiv olarak görünür"],
    ["PROFLORA Ferropol 250 ml (Arşiv)","Ürün kodu 2304200 · su değişimi sonrası 40 L başına 10 ml kullanılan demir, potasyum ve iz elementli temel sıvı gübre · fosfat ve nitrat içermez · resmî sayfada arşivlenmiştir"],
    ["PROFLORA Ferropol 500 ml (Arşiv)","Ürün kodu 2304300 · su değişimi sonrası 40 L başına 10 ml kullanılan demir, potasyum ve iz elementli temel sıvı gübre · fosfat ve nitrat içermez · resmî sayfada arşivlenmiştir"],
    ["PROFLORA Ferropol Refill 500+125 ml (Arşiv)","Ürün kodu 2305000 · toplam 625 ml çevre dostu yedek paket · 40 L başına 10 ml dozlanan demir, potasyum ve iz elementli temel sıvı gübre · resmî sayfada arşivlenmiştir"],
    ["PROFLORA Ferropol 5 L (Eski seri)","Ürün kodu 2017500 · büyük akvaryumlar için 5 L temel sıvı gübre · 40 L başına 10 ml doz · fosfat ve nitrat içermez · seri ülke sayfalarında son şans veya arşiv olarak görünür"],
  ],"2026-09-18"),
  ...products("JBL","fertilizer","https://www.jbl.de/en-gb/productsv2/detail/25163054",[
    ["PROFLORA Ferropol 24 10 ml (Arşiv)","Tatlı su bitkileri için günlük iz element gübresi · 50 L suya her gün bir damla · fosfat ve nitrat içermez · resmî sayfada arşivlenmiştir"],
    ["PROFLORA Ferropol 24 50 ml (Arşiv)","Tatlı su bitkileri için günlük iz element gübresi · 50 L suya her gün bir damla · fosfat ve nitrat içermez · resmî sayfada arşivlenmiştir"],
  ],"2026-09-18"),
  ...products("JBL","fertilizer","https://www.jbl.de/en-us/productsv2/detail/25166910",[
    ["PROFLORA Ferropol Tabs 30 tablet","Ürün kodu 2020000 · su kolonuna yönelik demir, potasyum ve iz element tableti · ilk doz 25 L başına bir, haftalık devam dozu 50 L başına bir tablet · su akışlı bölgeye konur, tabana gömülmez · fosfat ve nitrat içermez"],
  ],"2026-09-18"),
  ...products("JBL","fertilizer","https://www.jbl.de/en-us/productsv2/detail/25195314",[
    ["PROFLORA Ferropol Root 30 tablet","Ürün kodu 2011600 · kök bölgesine aylık gömülen NPK, demir ve iz element tableti · büyük köklü bitkide 1–2 tablet, saplı bitkilerde 5–10 gövdeye bir tablet · omurgasızlara uygundur"],
  ],"2026-09-18"),
  ...products("JBL","fertilizer","https://www.jbl.de/en/products/detail/2345/jbl-proflora-7-balls?country=sk&cpref=366",[
    ["PROFLORA 7 Balls 7 adet","Kökten beslenen tatlı su bitkileri için demir, mineral ve iz element yüklü yedi kil gübre topu · bitki büyüklüğüne göre kök bölgesine altı ayda bir uygulanır · fosfat ve nitrat içermez"],
  ],"2026-09-18"),
  ...products("JBL","fertilizer","https://www.jbl.de/en-us/productsv2/detail/25205185",[
    ["PROFLORA 7 + 13 Balls 20 adet","Ürün kodu 2011100 · kök bölgesi için yedi büyük ve 13 küçük olmak üzere 20 uzun süreli kil gübre topu · bitki büyüklüğüne göre yılda bir uygulanır · fosfat ve nitrat içermez"],
  ],"2026-09-18"),
  ...products("JBL","fertilizer","https://www.jbl.de/en/products/detail/2347/jbl-proflora-florapol?country=ge&cpref=178",[
    ["PROFLORA Florapol 700 g (Arşiv)","Ürün kodu 2012300 · yeni kurulumda taban malzemesine karıştırılıp yıkanmış kum/çakılla örtülen demir ve kil içerikli uzun süreli taban gübresi · en az üç yıl etkili · fosfat ve nitrat içermez · resmî sayfada arşivlenmiştir"],
  ],"2026-09-18"),
  ...[
    ["PROFLORA AquaBasis plus 2,5 L","2021200","40–120 L","https://www.jbl.de/en-us/productsv2/detail/25175609"],
    ["PROFLORA AquaBasis plus 5 L","2021000","60–200 L","https://www.jbl.de/de-de/productsv2/detail/25175049"],
  ].map(([model,itemNumber,aquariumRange,sourceUrl])=>({
    id:catalogSlug(`JBL-${model}`),brand:"JBL",model,category:"fertilizer" as const,
    description:`Ürün kodu ${itemNumber} · ${aquariumRange} tatlı su akvaryumları için yıkanmış üst tabanın altına serilen hazır uzun süreli besin katmanı · demir ve besin depolayan kil içerir · ürün sayfası beş yıllık etkiyi, 2026 üretici duyurusu ise ilk 4–6 hafta sonrası yaklaşık 2–3 yıllık yeniden şarj edilebilir tampon evresini açıklar`,
    sourceUrl,additionalSourceUrls:["https://www.jbl.de/en/press/detail/973/jbl-proflora-aquabasis-plus-improved-once-again?country=gb"],verifiedAt:"2026-09-18",
  })),
  ...products("JBL","fertilizer","https://www.jbl.de/en/products/detail/8338/jbl-proscape-plant-start?country=sk",[
    ["PROSCAPE PLANT START 2 × 8 g","20–100 L yeni kurulan bitkili akvaryumlar için ayrı metalize poşetlerde iki adet 8 g canlı bakteri kültürlü mineral granül · besin tabanı veya ilk taban katmanına eşit yayılıp kum/çakıl/soil ile tamamen örtülür · kök oluşumunu ve taban mineral dönüşümünü destekler; istenmeyen bakteri ve siyanobakteri yerleşimini azaltır · kurulu akvaryuma tabanın üstünden sonradan eklenmez · ürün kodu 2302500"],
  ],"2026-09-18"),
  ...products("JBL","fertilizer","https://www.jbl.de/en/products/detail/6452/jbl-proscape-fe-microelements?country=ro&cpref=578",[
    ["PROSCAPE Fe +MICROELEMENTS 250 ml","Ürün kodu 2111100 · aquascape için demir ve iz element temel gübresi · güçlü ışık ve CO₂ ile 100 L'ye günlük 10 ml; zayıf ışık ve CO₂ olmadan haftalık 2 ml · N, P, K ve Mg ihtiyaca göre ayrı tamamlanır"],
    ["PROSCAPE Fe +MICROELEMENTS 500 ml","Ürün kodu 2111200 · aquascape için demir ve iz element temel gübresi · güçlü ışık ve CO₂ ile 100 L'ye günlük 10 ml; zayıf ışık ve CO₂ olmadan haftalık 2 ml · N, P, K ve Mg ihtiyaca göre ayrı tamamlanır"],
  ],"2026-09-18"),
  ...products("JBL","fertilizer","https://www.jbl.de/en/products/detail/6456/jbl-proscape-npk-macroelements?country=dk",[
    ["PROSCAPE NPK +MACROELEMENTS 250 ml","Ürün kodu 2111400 · nitrat formunda azot, fosfat formunda fosfor, potasyum ve magnezyum içerir · güçlü ışık ve CO₂ ile 100 L'ye günlük 6 ml; zayıf ışık ve CO₂ olmadan haftalık 2 ml · demir ve iz element ayrı eklenir"],
    ["PROSCAPE NPK +MACROELEMENTS 500 ml","Ürün kodu 2111500 · nitrat formunda azot, fosfat formunda fosfor, potasyum ve magnezyum içerir · güçlü ışık ve CO₂ ile 100 L'ye günlük 6 ml; zayıf ışık ve CO₂ olmadan haftalık 2 ml · demir ve iz element ayrı eklenir"],
  ],"2026-09-18"),
  ...products("JBL","fertilizer","https://www.jbl.de/en/products/detail/6459/jbl-proscape-n-macroelements?country=il",[
    ["PROSCAPE N +MACROELEMENTS 250 ml","Ürün kodu 2111700 · azot yanında potasyum, kalsiyum ve magnezyum sağlar · güçlü ışık ve CO₂ ile 100 L'ye günlük 2 ml; zayıf ışık ve CO₂ olmadan haftalık 2 ml · doz nitrat testiyle izlenir"],
  ],"2026-09-18"),
  ...products("JBL","fertilizer","https://www.jbl.de/en-ge/productsv2/detail/25195374",[
    ["PROSCAPE P +MACROELEMENTS 250 ml","Ürün kodu 2111800 · fosfor ve bitkinin kullanabildiği potasyum sağlar · güçlü ışık ve CO₂ ile 100 L'ye günlük 2 ml; zayıf ışık ve CO₂ olmadan haftalık 2 ml · doz hassas fosfat testiyle izlenir"],
  ],"2026-09-18"),
  ...products("JBL","fertilizer","https://www.jbl.de/en/products/detail/6463/jbl-proscape-k-macroelements?country=ca",[
    ["PROSCAPE K +MACROELEMENTS 250 ml","Ürün kodu 2112000 · hedefli potasyum gübresi · güçlü ışık ve CO₂ ile 100 L'ye günlük 6 ml; zayıf ışık ve CO₂ olmadan haftalık 4 ml · doz potasyum testiyle izlenir"],
  ],"2026-09-18"),
  ...products("JBL","fertilizer","https://www.jbl.de/en/products/detail/6465/jbl-proscape-mg-macroelements?country=ca",[
    ["PROSCAPE Mg +MACROELEMENTS 250 ml","Ürün kodu 2112200 · hedefli magnezyum gübresi · güçlü ışık ve CO₂ ile 100 L'ye günlük 6 ml; zayıf ışık ve CO₂ olmadan haftalık 2 ml · doz tatlı su magnezyum testiyle izlenir"],
  ],"2026-09-18"),
  ...products("JBL","fertilizer","https://www.jbl.de/en/products/detail/6510/jbl-proscape-volcano-powder?country=au",[
    ["PROSCAPE VOLCANO POWDER 250 g","Ürün kodu 6708800 · 200 L / yaklaşık 100×40 cm taban için 250 g volkanik kaya tozu · mineral, iz element ve makro besin deposu yaklaşık 12 ay etkilidir · taban camına veya alt katmana ince serilip üst tabanla örtülür · taban ısıtma kablosuyla kullanılabilir; üst taban gözenekli ve dolaşıma uygun olmalıdır"],
  ],"2026-09-18"),
  ...products("JBL","test","https://www.jbl.de/en/products/detail/8640/jbl-proaquatest-ph-310-100?country=ie",[
    ["PROAQUATEST pH 3.0-10.0 Set","Ürün kodu 2410117 · tatlı/deniz suyu ve havuz için yaklaşık 50 ölçümlük geniş aralıklı tam set · bir reaktif, küvet ve renk kartı içerir · yeni kurulumda ilk hafta günlük, sonrasında haftalık ölçüm · sıvı/buhar yanıcıdır ve ciddi göz tahrişine yol açabilir"],
  ],"2026-09-18"),
  ...products("JBL","test","https://www.jbl.de/en/products/detail/8643/jbl-proaquatest-ph-60-76?country=ie",[
    ["PROAQUATEST pH 6.0-7.6 Set","Yaklaşık 80 ölçümlük hassas tatlı su tam seti · reaktif, iki vidalı cam küvet, şırınga, karşılaştırma bloğu ve renk kartı içerir · yeni kurulumda ilk hafta günlük, sonrasında haftalık ölçüm · sıvı/buhar yanıcıdır ve ciddi göz tahrişine yol açabilir"],
  ],"2026-09-18"),
  ...products("JBL","test","https://www.jbl.de/en/products/detail/8646/jbl-proaquatest-ph-74-90?country=ie",[
    ["PROAQUATEST pH 7.4-9.0 Set","Ürün kodu 2410517 · tatlı/deniz suyu ve havuz için yaklaşık 80 ölçümlük alkalin aralık tam seti · reaktif, iki vidalı cam küvet, şırınga, karşılaştırma bloğu ve renk kartı içerir · sıvı/buhar yanıcıdır ve ciddi göz tahrişine yol açabilir"],
  ],"2026-09-18"),
  ...products("JBL","test","https://www.jbl.de/en/products/detail/8649/jbl-proaquatest-gh-general-hardness?country=ie",[
    ["PROAQUATEST GH General hardness Set","Tatlı su akvaryumu ve havuzlarda toplam sertlik için renk dönüşümlü tam set · reaktif, plastik küvet ve kullanım düzeni içerir; damla sayısı doğrudan °dGH değeridir · deniz suyunda GH yerine kalsiyum ve magnezyum ayrı ölçülür · reaktif yanıcıdır; cilt ve göz tahrişine yol açabilir"],
  ],"2026-09-18"),
  ...products("JBL","test","https://www.jbl.de/en/products/detail/8652/jbl-proaquatest-kh-carbonate-hardness?country=ie",[
    ["PROAQUATEST KH Carbonate hardness Set","Tatlı/deniz suyu ve havuzlarda karbonat sertliği için renk dönüşümlü tam set · reaktif ve plastik küvet içerir; mavi-sarı dönüşümüne kadar damla sayısı °dKH değeridir · üretici KH'nin 4 °dKH altına düşmemesini belirtir · reaktif yanıcı ve aşındırıcıdır; ciddi cilt/ göz hasarı riski taşır"],
  ],"2026-09-18"),
  ...products("JBL","test","https://www.jbl.de/en/products/detail/8655/jbl-proaquatest-o2-oxygen?country=ie",[
    ["PROAQUATEST O2 Oxygen Set","Tatlı/deniz suyu ve havuzda çözünmüş oksijen için yaklaşık 40 ölçümlük tam set · üç reaktif, şırınga, vidalı cam küvet ve renk kartı içerir · yeni akvaryumlarda haftalık ve oksijen eksikliği belirtisinde kullanılır · reaktifler aşındırıcıdır; ciddi cilt/göz hasarı, alerji ve uzun süreli organ hasarı riski taşır"],
  ],"2026-09-18"),
  ...products("JBL","test","https://www.jbl.de/en/products/detail/8658/jbl-proaquatest-cu-copper?country=ie",[
    ["PROAQUATEST Cu Copper Set","Ürün kodu 2411400 · tatlı/deniz suyu için yaklaşık 50 ölçümlük bakır tam seti · iki reaktif, iki vidalı cam küvet, şırınga, karşılaştırma bloğu ve renk kartı içerir · yeni kurulumda günlük, canlı ölümü veya bakırlı ilaç dozunda kullanılır · yalnız serbest bakırı ölçer; su düzenleyiciyle şelatlanmış bakırı göstermez"],
  ],"2026-09-18"),
  ...products("JBL","test","https://www.jbl.de/en/products/detail/8661/jbl-proaquatest-fe-iron?country=ie",[
    ["PROAQUATEST Fe Iron Set","Tatlı/deniz suyu ve havuzda yaklaşık 50 ölçümlük demir tam seti · reaktif, iki vidalı cam küvet, şırınga, karşılaştırma bloğu ve renk kartı içerir · kurulumdan sonra bir kez, ardından haftalık; yeşil alg veya yetersiz bitki gelişiminde kullanılır · yutulması zararlı, göz tahriş edici ve alerjik deri reaksiyonu oluşturabilir"],
  ],"2026-09-18"),
  ...products("JBL","test","https://www.jbl.de/en/products/detail/8664/jbl-proaquatest-sio2-silicate?country=ie",[
    ["PROAQUATEST SiO2 Silicate Set","Ürün kodu 2411800 · tatlı/deniz suyunda diatom kontrolü için yaklaşık 50 ölçümlük silikat tam seti · iki reaktif, iki vidalı cam küvet, ölçü kaşığı, şırınga, karşılaştırma bloğu ve renk kartı içerir · yeni kurulumda, musluk suyu kontrolünde ve diatom sorununda kullanılır"],
  ],"2026-09-18"),
  ...products("JBL","test","https://www.jbl.de/en/products/detail/8667/jbl-proaquatest-nh4-ammonium?country=ie",[
    ["PROAQUATEST NH4 Ammonium Set","Ürün kodu 2412117 · tatlı/deniz suyu ve havuzda NH4 ölçüp pH tablosuyla NH3 riskini değerlendiren yaklaşık 50 ölçümlük tam set · üç reaktif, iki vidalı cam küvet, şırınga, karşılaştırma bloğu ve renk kartı içerir · yeni tatlı suda günlük, yeni deniz suyunda haftalık ve canlı kaybında kullanılır · reaktifler aşındırıcı/yanıcıdır; asitle temasında zehirli gaz açığa çıkarabilir"],
  ],"2026-09-18"),
  ...products("JBL","test","https://www.jbl.de/en/products/detail/8670/jbl-proaquatest-no2-nitrite?country=ie",[
    ["PROAQUATEST NO2 Nitrite Set","Ürün kodu 2412317 · tatlı/deniz suyu ve havuzda yaklaşık 50 ölçümlük nitrit tam seti · iki reaktif, iki vidalı cam küvet, şırınga, karşılaştırma bloğu ve renk kartı içerir · yeni tatlı suda üç hafta günlük, yeni deniz suyunda haftalık ve canlı kaybında kullanılır · soğuk örnekte reaksiyon gecikebilir; şüphede daha kötü değer esas alınır · reaktif yanıcıdır"],
  ],"2026-09-18"),
  ...products("JBL","test","https://www.jbl.de/en/products/detail/8673/jbl-proaquatest-no3-nitrate?country=ie",[
    ["PROAQUATEST NO3 Nitrate Set","Tatlı/deniz suyu ve havuzda yaklaşık 40 ölçümlük nitrat tam seti · iki reaktif, iki vidalı cam küvet, şırınga, ölçü kaşığı, karşılaştırma bloğu ve renk kartı içerir · yeni kurulumda haftalık ve yeşil alg sorununda kullanılır; doğru sonuç için bir dakika kuvvetle çalkalanır · reaktifler aşındırıcı/alerjendir ve genetik hasar şüphesi taşır"],
  ],"2026-09-18"),
  ...products("JBL","test","https://www.jbl.de/en/products/detail/8676/jbl-proaquatest-po4-phosphate-sensitive?country=ie",[
    ["PROAQUATEST PO4 Phosphate Sensitive Set","Ürün kodu 2412717 · tatlı/deniz suyu ve havuzda yaklaşık 50 ölçümlük hassas fosfat tam seti · üç reaktif (2 × reaktif 2), iki vidalı cam küvet, şırınga, ölçü kaşığı, karşılaştırma bloğu ve renk kartı içerir · polifosfatı doğrudan ölçmez; yalnız parçalanıp fosfata dönüştüğünde gösterir · reaktif aşındırıcıdır, yutulması zararlı ve solunum tahriş edicidir"],
  ],"2026-09-18"),
  ...products("JBL","test","https://www.jbl.de/en/products/detail/8679/jbl-proaquatest-k-potassium?country=ie",[
    ["PROAQUATEST K Potassium Set","Ürün kodu 2413000 · tatlı su bitki beslemesini izlemek için yaklaşık 25 ölçümlük potasyum tam seti · iki reaktif, özel cam tüp, şırınga, ölçü kaşığı ve renk kartı içerir · hedef 10–30 mg/L · ana ürün bilgisi deniz suyunu standart kullanım dışında tutar; üretici SSS'sindeki 10 ml örneği 300 ml'ye seyreltip sonucu 30 ile çarpma yöntemi uzman uygulamasıdır"],
  ],"2026-09-18"),
  ...products("JBL","test","https://www.jbl.de/en/products/detail/8682/jbl-proaquatest-ca-calcium?country=ie",[
    ["PROAQUATEST Ca Calcium Set","Ürün kodu 2413217 · deniz suyu akvaryumlarında kalsiyumu ölçen tam titrasyon seti · üç reaktif, plastik küvet, şırınga ve ölçü kaşığı içerir · renk değişimine kadarki damla sayısı × 20 = mg/L Ca; ölçüm sayısı kalsiyum düzeyine bağlıdır · tatlı suda çalışmaz · reaktifler yutulduğunda zararlı ve aşındırıcıdır; ağır cilt/göz hasarına yol açabilir"],
  ],"2026-09-18"),
  ...products("JBL","test","https://www.jbl.de/en/products/detail/8685/jbl-proaquatest-mg-ca-magnesium-calcium?country=ie",[
    ["PROAQUATEST Mg-Ca Magnesium-Calcium Set","Ürün kodu 2413617 · deniz suyu için birleşik magnezyum-kalsiyum tam seti · beş reaktif, iki plastik küvet, şırınga ve ölçü kaşığı içerir · önce Ca, sonra Mg+Ca ölçülür; Mg sonucu toplamdan Ca çıkarılarak bulunur · yapay deniz tuzunda Mg+Ca damla sayısı × 120, doğal deniz suyunda × 100 kullanılır · reaktifler yanıcı/aşındırıcıdır ve uzun süreli organ ile sucul yaşam riski taşır"],
  ],"2026-09-18"),
  ...products("JBL","test","https://www.jbl.de/en/products/detail/8688/jbl-proaquatest-co2-ph-permanent?country=ie",[
    ["PROAQUATEST CO2-pH Permanent Set","Ürün kodu 2413800 · tatlı suda kalıcı CO2 ve pH takibi için gösterge kabı, vantuz, renk skalası etiketi ve biri yedek iki indikatör şişesi içeren tam set · pH 6,4–7,8 aralığını ve CO2 düzeyini gösterir · sabit karbonat sertliğine ayarlı indikatör akvaryum suyuyla hazırlanmaz; sıvı karbon ürünleri gaz CO2 üretmediği için bu testte görünmez"],
  ],"2026-09-18"),
  ...products("JBL","test","https://www.jbl.de/en/products/detail/8691/jbl-proaquatest-co2-direct?country=ie",[
    ["PROAQUATEST CO2 Direct Set","Ürün kodu 2414000 · tatlı su için iki reaktif, plastik küvet ve renk kartı içeren doğrudan CO2 tam seti · kalıcı pembe renge kadarki damla sayısı × 2 = mg/L CO2 · bitki gelişimi durduğunda veya canlı kaybında haftalık kontrol önerilir · reaktifler yüksek derecede yanıcıdır; ağır cilt ve göz hasarına yol açabilir"],
  ],"2026-09-18"),
  ...products("JBL","test","https://www.jbl.de/en/products/detail/8694/jbl-proaquatest-mg-magnesium-fresh-water?country=ie",[
    ["PROAQUATEST Mg Magnesium Fresh water Set","Ürün kodu 2414200 · tatlı su bitki gübrelemesini izlemek için yaklaşık 60 ölçümlük karşılaştırmalı magnezyum tam seti · üç reaktif, vidalı iki cam küvet, şırınga, karşılaştırma bloğu ve renk skalası içerir · suyun kendi rengini telafi etmek için boş numune karşılaştırması gerekir; blok kullanılmazsa okuma sapabilir · deniz suyu için değildir · reaktif ağır cilt/göz hasarına yol açabilecek kadar aşındırıcıdır"],
  ],"2026-09-18"),
  ...products("JBL","test","https://www.jbl.de/en/products/detail/8640/jbl-proaquatest-ph-310-100?country=ie",[
    ["PROAQUATEST pH 3.0-10.0 Refill","Ürün kodu 2410219 · yaklaşık 50 ölçümlük yalnız yedek pH 3,0–10,0 reaktifi · küvet ve renk kartı içermez; tam set yerine geçmez · sıvı/buhar yanıcıdır ve ciddi göz tahrişine yol açabilir"],
  ],"2026-09-18"),
  ...products("JBL","test","https://www.jbl.de/en/products/detail/8643/jbl-proaquatest-ph-60-76?country=ie",[
    ["PROAQUATEST pH 6.0-7.6 Refill","Ürün kodu 2410419 · yaklaşık 80 ölçümlük yalnız yedek pH 6,0–7,6 reaktifi · cam küvet, şırınga, karşılaştırma bloğu ve renk kartı içermez; tam set yerine geçmez · yanıcı ve göz tahriş edicidir"],
  ],"2026-09-18"),
  ...products("JBL","test","https://www.jbl.de/en/products/detail/8646/jbl-proaquatest-ph-74-90?country=ie",[
    ["PROAQUATEST pH 7.4-9.0 Refill","Ürün kodu 2410619 · yaklaşık 80 ölçümlük yalnız yedek pH 7,4–9,0 reaktifi · cam küvet, şırınga, karşılaştırma bloğu ve renk kartı içermez; tam set yerine geçmez · yanıcı ve göz tahriş edicidir"],
  ],"2026-09-18"),
  ...products("JBL","test","https://www.jbl.de/en/products/detail/8649/jbl-proaquatest-gh-general-hardness?country=ie",[
    ["PROAQUATEST GH General hardness Refill","Toplam sertlik testi için yalnız yedek reaktif · plastik küvet içermez ve tam test seti yerine geçmez · her damla 1 °dGH; 10 ml örnekte 0,5 °dGH hassasiyetle okunabilir · yanıcıdır; cilt ve göz tahrişine yol açabilir"],
  ],"2026-09-18"),
  ...products("JBL","test","https://www.jbl.de/en/products/detail/8652/jbl-proaquatest-kh-carbonate-hardness?country=ie",[
    ["PROAQUATEST KH Carbonate hardness Refill","Ürün kodu 2411119 · karbonat sertliği testi için yalnız yedek reaktif · plastik küvet içermez ve tam test seti yerine geçmez · her damla 1 °dKH; 10 ml örnekte 0,5 °dKH hassasiyetle okunabilir · yanıcı ve aşındırıcıdır"],
  ],"2026-09-18"),
  ...products("JBL","test","https://www.jbl.de/en/products/detail/8655/jbl-proaquatest-o2-oxygen?country=ie",[
    ["PROAQUATEST O2 Oxygen Refill","Ürün kodu 2411319 · yaklaşık 40 ölçümlük üçlü yalnız yedek reaktif paketi · şırınga, vidalı cam küvet ve renk kartı içermez; tam test seti yerine geçmez · aşındırıcıdır; ciddi cilt/göz hasarı, alerji ve uzun süreli organ hasarı riski taşır"],
  ],"2026-09-18"),
  ...products("JBL","test","https://www.jbl.de/en/products/detail/8658/jbl-proaquatest-cu-copper?country=ie",[
    ["PROAQUATEST Cu Copper Refill","Yaklaşık 50 ölçümlük iki reaktifli yalnız yedek paket · cam küvet, şırınga, karşılaştırma bloğu ve renk kartı içermez; tam test seti yerine geçmez · yalnız serbest bakırı ölçer; şelatlanmış bakırı göstermez"],
  ],"2026-09-18"),
  ...products("JBL","test","https://www.jbl.de/en/products/detail/8661/jbl-proaquatest-fe-iron?country=ie",[
    ["PROAQUATEST Fe Iron Refill","Ürün kodu 2411719 · yaklaşık 50 ölçümlük yalnız yedek demir reaktifi · cam küvet, şırınga, karşılaştırma bloğu ve renk kartı içermez; tam test seti yerine geçmez · yutulması zararlı, göz tahriş edici ve alerjen olabilir"],
  ],"2026-09-18"),
  ...products("JBL","test","https://www.jbl.de/en/products/detail/8664/jbl-proaquatest-sio2-silicate?country=ie",[
    ["PROAQUATEST SiO2 Silicate Refill","Ürün kodu 2411900 · yaklaşık 50 ölçümlük iki reaktifli yalnız yedek paket · küvetler, ölçü kaşığı, şırınga, karşılaştırma bloğu ve renk kartı içermez; tam test seti yerine geçmez · şişelerden biri bitince açılmış tüm reaktifler birlikte yenilenir"],
  ],"2026-09-18"),
  ...products("JBL","test","https://www.jbl.de/en/products/detail/8667/jbl-proaquatest-nh4-ammonium?country=ie",[
    ["PROAQUATEST NH4 Ammonium Refill","Yaklaşık 50 ölçümlük üç reaktifli yalnız yedek paket · cam küvetler, şırınga, karşılaştırma bloğu ve renk kartı içermez; tam test seti yerine geçmez · aşındırıcı/yanıcıdır ve asitle temasında zehirli gaz açığa çıkarabilir"],
  ],"2026-09-18"),
  ...products("JBL","test","https://www.jbl.de/en/products/detail/8670/jbl-proaquatest-no2-nitrite?country=ie",[
    ["PROAQUATEST NO2 Nitrite Refill","Yaklaşık 50 ölçümlük iki reaktifli yalnız yedek paket · cam küvetler, şırınga, karşılaştırma bloğu ve renk kartı içermez; tam test seti yerine geçmez · reaktif yanıcıdır; 20–25 °C dışında reaksiyon süresi değişebilir"],
  ],"2026-09-18"),
  ...products("JBL","test","https://www.jbl.de/en/products/detail/8673/jbl-proaquatest-no3-nitrate?country=ie",[
    ["PROAQUATEST NO3 Nitrate Refill","Ürün kodu 2412619 · yaklaşık 40 ölçümlük iki reaktifli yalnız yedek paket · küvetler, şırınga, ölçü kaşığı, karşılaştırma bloğu ve renk kartı içermez; tam test seti yerine geçmez · aşındırıcı/alerjendir ve genetik hasar şüphesi taşır"],
  ],"2026-09-18"),
  ...products("JBL","test","https://www.jbl.de/en/products/detail/8676/jbl-proaquatest-po4-phosphate-sensitive?country=ie",[
    ["PROAQUATEST PO4 Phosphate Sensitive Refill","Yaklaşık 50 ölçümlük üç reaktifli yalnız yedek paket · küvetler, şırınga, ölçü kaşığı, karşılaştırma bloğu ve renk kartı içermez; tam test seti yerine geçmez · polifosfatı doğrudan ölçmez; açılmış reaktifler takım halinde yenilenir · aşındırıcı ve solunum tahriş edicidir"],
  ],"2026-09-18"),
  ...products("JBL","test","https://www.jbl.de/en/products/detail/8679/jbl-proaquatest-k-potassium?country=ie",[
    ["PROAQUATEST K Potassium Refill","Ürün kodu 2413100 · yaklaşık 25 ölçümlük iki reaktifli yalnız yedek paket · özel cam tüp, şırınga, ölçü kaşığı ve renk kartı içermez; tam test seti yerine geçmez · açılmış reaktifler takım halinde yenilenir"],
  ],"2026-09-18"),
  ...products("JBL","test","https://www.jbl.de/en/products/detail/8682/jbl-proaquatest-ca-calcium?country=ie",[
    ["PROAQUATEST Ca Calcium Refill","Ürün kodu 2413319 · deniz suyu kalsiyum testi için üç reaktifli yalnız yedek paket · plastik küvet, şırınga ve ölçü kaşığı içermez; tam test seti yerine geçmez · damla sayısı × 20 = mg/L Ca · reaktifler yutulduğunda zararlı ve aşındırıcıdır"],
  ],"2026-09-18"),
  ...products("JBL","test","https://www.jbl.de/en/products/detail/8685/jbl-proaquatest-mg-ca-magnesium-calcium?country=ie",[
    ["PROAQUATEST Mg-Ca Magnesium-Calcium Refill","Ürün kodu 2413719 · birleşik deniz suyu Mg-Ca testi için yalnız yedek reaktifler · iki küvet, şırınga ve ölçü kaşığı içermez; tam test seti yerine geçmez · yapay tuz karışımında × 120, doğal deniz suyunda × 100 faktörü korunur · yanıcı ve aşındırıcıdır"],
  ],"2026-09-18"),
  ...products("JBL","test","https://www.jbl.de/en/products/detail/8688/jbl-proaquatest-co2-ph-permanent?country=ie",[
    ["PROAQUATEST CO2-pH Permanent Refill","Ürün kodu 2413900 · tatlı su kalıcı CO2-pH testi için yalnız yedek indikatör sıvısı · gösterge kabı, vantuz ve renk skalası etiketi içermez; tam test düzeneği yerine geçmez · pH 6,4–7,8 ile CO2 düzeyinin sürekli okunmasında kullanılır; sıvı karbon ürünlerini ölçmez"],
  ],"2026-09-18"),
  ...products("JBL","test","https://www.jbl.de/en/products/detail/8691/jbl-proaquatest-co2-direct?country=ie",[
    ["PROAQUATEST CO2 Direct Refill","Ürün kodu 2414100 · tatlı su doğrudan CO2 testi için iki reaktifli yalnız yedek paket · plastik küvet ve renk kartı içermez; tam test seti yerine geçmez · damla sayısı × 2 = mg/L CO2 · reaktifler yüksek derecede yanıcı ve aşındırıcıdır"],
  ],"2026-09-18"),
  ...products("JBL","test","https://www.jbl.de/en/products/detail/8694/jbl-proaquatest-mg-magnesium-fresh-water?country=ie",[
    ["PROAQUATEST Mg Magnesium Fresh water Refill","Ürün kodu 2414300 · yaklaşık 60 ölçümlük üç reaktifli yalnız yedek tatlı su magnezyum paketi · iki cam küvet, şırınga, karşılaştırma bloğu ve renk skalası içermez; tam karşılaştırma seti yerine geçmez · deniz suyu için değildir · aşındırıcı reaktif ağır cilt/göz hasarına yol açabilir"],
  ],"2026-09-18"),
  {
    id:"jbl-proaquatest-combiset-plus-fe",brand:"JBL",model:"PROAQUATEST COMBISET Plus Fe",category:"test",
    description:"Ürün kodu 2409217 · tatlı su için su geçirmez test çantası · pH, KH, Fe, NO2 ve NO3 ölçer; pH ile KH tablosundan CO2 hesaplanır · 7 reaktif, 3 cam küvet, plastik küvet, şırınga, ölçü kaşığı, karşılaştırma bloğu, renk kartları ve kayıt formları içerir · reaktifler arasında yanıcı, aşındırıcı, alerjen ve genetik hasar şüphesi taşıyan maddeler bulunur",
    sourceUrl:"https://www.jbl.de/en/products/detail/8698/jbl-proaquatest-combiset-plus-fe?country=ie",verifiedAt:"2026-09-18",
  },
  {
    id:"jbl-proaquatest-combiset-plus-nh4",brand:"JBL",model:"PROAQUATEST COMBISET Plus NH4",category:"test",
    description:"Ürün kodu 2409017 · tatlı su için su geçirmez test çantası · pH, KH, NH4/NH3, NO2 ve NO3 ölçer; pH ile KH tablosundan CO2 hesaplanır · 9 reaktif, 3 cam küvet, şırınga, ölçü kaşığı, karşılaştırma bloğu, renk kartları ve kayıt formları içerir · NH4 sonucu pH tablosuyla toksik NH3 riskine çevrilmelidir; reaktifler çocuklardan uzak tutulur",
    sourceUrl:"https://www.jbl.de/en/products/detail/8700/jbl-proaquatest-combiset-plus-nh4?country=ie",verifiedAt:"2026-09-18",
  },
  {
    id:"jbl-proaquatest-lab",brand:"JBL",model:"PROAQUATEST LAB",category:"test",
    description:"Ürün kodu 2408417 · tatlı su için 13 testli laboratuvar çantası · üç pH aralığı, KH, GH, NH4/NH3, NO2, NO3, PO4, Fe, Cu, SiO2 ve O2 ölçer; tablodan CO2 hesaplanır · 12 cam küvet, 2 şırınga, 3 ölçü kaşığı, termometre, karşılaştırma bloğu, 2 plastik küvet, renk kartları, CO2 tablosu ve kayıt araçları içerir · kimyasal reaktifler yanıcı/aşındırıcı olabilir",
    sourceUrl:"https://www.jbl.de/en/products/detail/8702/jbl-proaquatest-lab?country=ie",verifiedAt:"2026-09-18",
  },
  {
    id:"jbl-proaquatest-lab-proscape",brand:"JBL",model:"PROAQUATEST LAB PROSCAPE",category:"test",
    description:"Ürün kodu 2408300 · yoğun bitkili tatlı su akvaryumları için test çantası · pH, KH, doğrudan CO2, Fe, tatlı su Mg, K, PO4, SiO2 ve NO3 ölçer · 22 reaktif, 12 cam küvet, özel potasyum küveti, 2 şırınga, 3 ölçü kaşığı, termometre, karşılaştırma bloğu, 2 plastik küvet, renk kartları ve kayıt araçları içerir · deniz suyu laboratuvar çantası değildir",
    sourceUrl:"https://www.jbl.de/en/products/detail/8704/jbl-proaquatest-lab-proscape?country=ie",verifiedAt:"2026-09-18",
  },
  {
    id:"jbl-proaquatest-lab-marin",brand:"JBL",model:"PROAQUATEST LAB Marin",category:"test",
    description:"Ürün kodu 2408217 · deniz suyu akvaryumları için kapsamlı test çantası · pH, KH, Ca, Mg, Cu, NH4, NO2, NO3, PO4, SiO2 ve O2 ölçer · 29 reaktif, 12 cam ve 2 plastik küvet, 2 şırınga, 3 ölçü kaşığı, termometre, laboratuvar karşılaştırma sistemi ve kayıt araçları içerir · reaktifler yanıcı/aşındırıcıdır; alerji, organ ve sucul yaşam riski taşır, asitle temasında zehirli gaz açığa çıkabilir",
    sourceUrl:"https://www.jbl.de/en/products/detail/8706/jbl-proaquatest-lab-marin?country=ie",verifiedAt:"2026-09-18",
  },
  {
    id:"jbl-proaquatest-combiset-marin",brand:"JBL",model:"PROAQUATEST COMBISET Marin",category:"test",
    description:"Ürün kodu 2408117 · özellikle balık ağırlıklı deniz akvaryumları için altı testli su geçirmez çanta · KH, pH, NH4/NH3, NO2, NO3 ve PO4 ölçer · 11 reaktif, karşılaştırma bloğu, 3 küvet, şırınga, ölçü kaşıkları, renk kartları ve kayıt formları içerir · KH dahil bazı reaktifler yanıcı ve aşındırıcıdır; çocuklardan uzak tutulur",
    sourceUrl:"https://www.jbl.de/en/products/detail/8708/jbl-proaquatest-combiset-marin?country=ie",verifiedAt:"2026-09-18",
  },
  {
    id:"jbl-proaquatest-easy-7in1",brand:"JBL",model:"PROAQUATEST EASY 7in1",category:"test",
    description:"Akvaryum, havuz, kuyu ve musluk suyu için 50 adet tek kullanımlık hızlı test şeridi · 1 dakikada Cl2, pH, GH, NO2, NO3 ve KH ölçer; pH ile KH tablosundan CO2 hesaplanır · fosfat ve amonyum ölçmez",
    sourceUrl:"https://www.jbl.de/en/products/detail/8721/jbl-proaquatest-easy-7in1",verifiedAt:"2026-09-14",
  },
  {
    id:"jbl-proscan",brand:"JBL",model:"PROSCAN",category:"test",
    description:"Ürün kodu 2542000 · tatlı su akvaryumu, havuz ve kaynak/musluk suyu için akıllı telefonla dijital analiz başlangıç seti · GH, KH, pH, NO2, NO3 ve Cl2 ölçer; CO2'yi hesaplar · 24 analiz şeridi, özel kalibre renk kartı ve ücretsiz uygulama erişimi içerir · iOS 13+ veya Android 10+ ve otomatik odaklı kamera gerekir · deniz suyuna uygun değildir; EASY 7in1 şeritleriyle kullanılamaz",
    sourceUrl:"https://www.jbl.de/en/products/detail/6774/jbl-proscan?country=ie",verifiedAt:"2026-09-18",
  },
  {
    id:"jbl-proscan-recharge",brand:"JBL",model:"PROSCAN RECHARGE",category:"test",
    description:"Ürün kodu 2542100 · PROSCAN sistemi için 24 adet yedek su analiz şeridi · değerlendirme için ücretsiz uygulama ve başlangıç setindeki özel kalibre renk kartı gerekir; renk kartı içermez · GH, KH, pH, NO2, NO3 ve Cl2 ölçümüne, CO2 hesaplamasına yöneliktir · deniz suyuna uygun değildir; EASY 7in1 şeritleri farklı aralıklar nedeniyle uyumsuzdur",
    sourceUrl:"https://www.jbl.de/en/products/detail/6828/jbl-proscan-recharge?country=ie",verifiedAt:"2026-09-18",
  },
  ...products("JBL","test","https://www.jbl.de/en/products/group/4034/test-sets-and-refills",[
    ["pH Test 3.0-10.0","Eski JBL geniş aralıklı pH damla testi · resmî ürün grubunda arşiv olarak listelenir; güncel PROAQUATEST pH 3.0-10.0 seti ve refill ürünüyle karıştırılmamalıdır"],
    ["pH Test 6.0-7.6","Eski JBL hassas tatlı su pH damla testi · resmî ürün grubunda arşiv olarak listelenir; güncel PROAQUATEST pH 6.0-7.6 seti ve refill ürünüyle karıştırılmamalıdır"],
    ["pH Test 7.4-9.0","Eski JBL alkalin tatlı/deniz suyu pH damla testi · resmî ürün grubunda arşiv olarak listelenir; güncel PROAQUATEST pH 7.4-9.0 seti ve refill ürünüyle karıştırılmamalıdır"],
    ["GH Test","Eski JBL toplam sertlik damla testi · resmî ürün grubunda arşiv olarak listelenir; güncel PROAQUATEST GH seti ve refill ürünüyle karıştırılmamalıdır"],
    ["KH Test","Eski JBL karbonat sertliği damla testi · resmî ürün grubunda arşiv olarak listelenir; güncel PROAQUATEST KH seti ve refill ürünüyle karıştırılmamalıdır"],
    ["Oxygen Test O2 - New Formula","Eski JBL yeni formül çözünmüş oksijen damla testi · resmî ürün grubunda arşiv olarak listelenir; önceki O2 Oxygen Test'ten ve güncel PROAQUATEST O2 set/refill ürünlerinden ayrı modeldir"],
    ["O2 Oxygen Test","Eski JBL çözünmüş oksijen damla testi · resmî ürün grubunda arşiv olarak listelenir; New Formula seçeneğinden ve güncel PROAQUATEST O2 set/refill ürünlerinden ayrı modeldir"],
    ["CO2-pH Permanent Test","Eski JBL kalıcı CO2 ve pH gösterge testi · resmî ürün grubunda arşiv olarak listelenir; güncel PROAQUATEST seti ve refill ürünüyle karıştırılmamalıdır"],
    ["CO2 Direct Test","Eski JBL doğrudan çözünmüş CO2 damla testi · resmî ürün grubunda arşiv olarak listelenir; güncel PROAQUATEST seti ve refill ürünüyle karıştırılmamalıdır"],
    ["Cu Copper Test","Eski JBL bakır damla testi · resmî ürün grubunda arşiv olarak listelenir; güncel PROAQUATEST seti ve refill ürünüyle karıştırılmamalıdır"],
    ["Fe Iron Test","Eski JBL demir damla testi · resmî ürün grubunda arşiv olarak listelenir; güncel PROAQUATEST seti ve refill ürünüyle karıştırılmamalıdır"],
    ["SiO2 Silicate Test","Eski JBL silikat damla testi · resmî ürün grubunda arşiv olarak listelenir; güncel PROAQUATEST seti ve refill ürünüyle karıştırılmamalıdır"],
    ["NH4 Ammonium Test","Eski JBL amonyum damla testi · resmî ürün grubunda arşiv olarak listelenir; güncel PROAQUATEST seti ve refill ürünüyle karıştırılmamalıdır"],
    ["NO2 Nitrite Test","Eski JBL nitrit damla testi · resmî ürün grubunda arşiv olarak listelenir; güncel PROAQUATEST seti ve refill ürünüyle karıştırılmamalıdır"],
    ["NO3 Nitrate Test","Eski JBL nitrat damla testi · resmî ürün grubunda arşiv olarak listelenir; güncel PROAQUATEST seti ve refill ürünüyle karıştırılmamalıdır"],
    ["PO4 Phosphate Test sensitive","Eski JBL hassas fosfat damla testi · resmî ürün grubunda arşiv olarak listelenir; güncel PROAQUATEST seti ve refill ürünüyle karıştırılmamalıdır"],
    ["K Potassium Test","Eski JBL potasyum damla testi · resmî ürün grubunda arşiv olarak listelenir; güncel PROAQUATEST seti ve refill ürünüyle karıştırılmamalıdır"],
    ["Mg Magnesium Test Freshwater","Eski JBL tatlı su magnezyum damla testi · resmî ürün grubunda arşiv olarak listelenir; güncel PROAQUATEST seti ve refill ürünüyle karıştırılmamalıdır"],
  ],"2026-09-15"),
  ...products("JBL","test","https://www.jbl.de/en/products/group/6051/test-case",[
    ["Test Combi Set plus Fe","Eski JBL tatlı su test çantası · resmî ürün grubunda arşiv olarak listelenir; güncel PROAQUATEST COMBISET Plus Fe ile karıştırılmamalıdır"],
    ["Test Combi Set Plus NH4","Eski JBL amonyum testli tatlı su test çantası · resmî ürün grubunda arşiv olarak listelenir; güncel PROAQUATEST COMBISET Plus NH4 ile karıştırılmamalıdır"],
    ["Testlab","Eski JBL kapsamlı tatlı su laboratuvar test çantası · resmî ürün grubunda arşiv olarak listelenir; güncel PROAQUATEST LAB ile karıştırılmamalıdır"],
    ["Testlab ProScape","Eski JBL bitkili akvaryum laboratuvar test çantası · resmî ürün grubunda arşiv olarak listelenir; güncel PROAQUATEST LAB PROSCAPE ile karıştırılmamalıdır"],
    ["Testlab Marin","Eski JBL deniz suyu laboratuvar test çantası · resmî ürün grubunda arşiv olarak listelenir; güncel PROAQUATEST LAB Marin ile karıştırılmamalıdır"],
    ["Test Combi Set Marin","Eski JBL deniz suyu test çantası · resmî ürün grubunda arşiv olarak listelenir; güncel PROAQUATEST COMBISET Marin ile karıştırılmamalıdır"],
  ],"2026-09-15"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/8930/jbl-pronovo-bel-flakes-s?country=ie",[
    ["PRONOVO BEL FLAKES S 100 ml","3–10 cm toplum akvaryumu balıkları için S boy prebiyotik ana pul yem · somon, krill, spirulina ve %2 sarımsak içeren 100 ml geri dönüştürülebilir dozaj kapaklı kutu · ham protein %38, yağ %6 · yapay renklendirici içermez"],
  ],"2026-09-18"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/8932/jbl-pronovo-bel-flakes-m?country=ie",[
    ["PRONOVO BEL FLAKES M 100 ml","8–20 cm toplum akvaryumu balıkları için M boy prebiyotik ana pul yemin 100 ml dozaj kapaklı kutusu · ham protein %38, yağ %6"],
    ["PRONOVO BEL FLAKES M 250 ml","8–20 cm toplum akvaryumu balıkları için M boy prebiyotik ana pul yemin 250 ml dozaj kapaklı kutusu · ham protein %38, yağ %6"],
    ["PRONOVO BEL FLAKES M 750 ml Refill","8–20 cm toplum akvaryumu balıkları için M boy prebiyotik ana pul yemin çevre dostu 750 ml yedek paketi · kutu ve dozaj kapağı içermez · ham protein %38, yağ %6"],
    ["PRONOVO BEL FLAKES M 1000 ml","8–20 cm toplum akvaryumu balıkları için M boy prebiyotik ana pul yemin 1000 ml dozaj kapaklı kutusu · ham protein %38, yağ %6"],
    ["PRONOVO BEL FLAKES M 5,5 L","8–20 cm toplum akvaryumu balıkları için M boy prebiyotik ana pul yemin 5,5 L büyük ambalajı · ham protein %38, yağ %6"],
  ],"2026-09-18"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/8895/jbl-pronovo-bel-grano-xxs?country=ie",[
    ["PRONOVO BEL GRANO XXS 100 ml","En küçük toplum akvaryumu balıkları için XXS boy yavaş batan prebiyotik ana granül yemin 100 ml Click dozajlı kutusu · ham protein %38, yağ %6"],
  ],"2026-09-18"),
  ...products("JBL","food","https://www.jbl.de/en-us/productsv2/detail/25187166",[
    ["PRONOVO BEL GRANO XS 20 ml Freshlock","3–5 cm toplum balıkları için XS boy batan prebiyotik granülün küçük Freshlock paketi · resmî başlık hacmi 20 ml, ürün metni paketi 20 g olarak tanımlar; bu çelişki nedeniyle ağırlık/hacim birbirine çevrilmez · ham protein %38, yağ %6"],
    ["PRONOVO BEL GRANO XS 100 ml","3–5 cm toplum balıkları için XS boy batan prebiyotik ana granülün 100 ml Click dozajlı kutusu · ham protein %38, yağ %6"],
  ],"2026-09-18"),
  ...products("JBL","food","https://www.jbl.de/en-us/productsv2/detail/25174154",[
    ["PRONOVO BEL GRANO S 20 ml","3–10 cm toplum balıkları için S boy batan prebiyotik ana granülün 20 ml küçük paketi · ham protein %38, yağ %6"],
    ["PRONOVO BEL GRANO S 100 ml","3–10 cm toplum balıkları için S boy batan prebiyotik ana granülün 100 ml Click dozajlı kutusu · ham protein %38, yağ %6"],
    ["PRONOVO BEL GRANO S 250 ml","3–10 cm toplum balıkları için S boy batan prebiyotik ana granülün 250 ml Click dozajlı kutusu · ham protein %38, yağ %6"],
    ["PRONOVO BEL GRANO S 1000 ml","3–10 cm toplum balıkları için S boy batan prebiyotik ana granülün 1000 ml Click dozajlı kutusu · ham protein %38, yağ %6"],
  ],"2026-09-18"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/8946/jbl-pronovo-bel-grano-m?country=ie",[
    ["PRONOVO BEL GRANO M 250 ml","8–20 cm toplum balıkları için M boy batan prebiyotik ana granülün 250 ml dozaj kapaklı kutusu · ham protein %38, yağ %6"],
  ],"2026-09-18"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/9040/jbl-pronovo-tab-m?country=ie",[
    ["PRONOVO TAB M 100 ml","1–20 cm dip ve toplum balıkları için tabana bırakılan veya cama bastırılan M tablet · 100 ml / 58 g dozaj kapaklı kutu · ham protein %37, yağ %7, Tubifex %12"],
    ["PRONOVO TAB M 250 ml","1–20 cm dip ve toplum balıkları için tabana bırakılan veya cama bastırılan M tablet · 250 ml / 150 g dozaj kapaklı kutu · ham protein %37, yağ %7, Tubifex %12"],
    ["PRONOVO TAB M 1000 ml","1–20 cm dip ve toplum balıkları için tabana bırakılan veya cama bastırılan M tablet · 1000 ml / 600 g dozaj kapaklı kutu · ham protein %37, yağ %7, Tubifex %12"],
    ["PRONOVO TAB M 5,5 L","1–20 cm dip ve toplum balıkları için tabana bırakılan veya cama bastırılan M tablet · 5,5 L / 2900 g büyük ambalaj · ham protein %37, yağ %7, Tubifex %12"],
  ],"2026-09-18"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/8949/jbl-pronovo-bel-flakes-baby?country=ie",[
    ["PRONOVO BEL FLAKES BABY 3 × 10 ml","Yavru ve canlı doğuran akvaryum balıkları için tozdan mini pula uzanan üç farklı büyüme boyunda prebiyotik ana yem · ürün kodu 3112418 · her boy ayrı hava ve ışık geçirmez geri dönüştürülebilir 10 ml poşettedir · ham protein %38, yağ %6, lif %4, kül %7"],
  ],"2026-09-18"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/8953/jbl-pronovo-bel-grano-baby?country=ie",[
    ["PRONOVO BEL GRANO BABY 3 × 10 ml","5–20 mm yavru akvaryum balıkları için üç farklı büyüme boyunda toz prebiyotik ana yem · ürün kodu 3112500 · %10 Artemia içerir; üç ayrı hava ve ışık geçirmez geri dönüştürülebilir 10 ml poşet ile dozaj kaşığı bulunur · ham protein %38, yağ %6, lif %4, kül %7"],
  ],"2026-09-18"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/8951/jbl-pronovo-bel-fluid?country=ie",[
    ["PRONOVO BEL FLUID 50 ml","Toz yem yiyemeyecek kadar küçük yumurtlayan balık yavruları için 50'den fazla doğal içerikten oluşan Artemia bileşenli ultra ince sıvı başlangıç yemi · ürün kodu 3112618 · damlalıklı 50 ml şişe · ham protein %38, yağ %6, lif %4, kül %7 · koruyucu 1a327 içerir"],
  ],"2026-09-18"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/8955/jbl-pronovo-bel-weekend?country=ie",[
    ["PRONOVO BEL WEEKEND 4 blok","3–20 cm toplum akvaryumu balıkları için kısa süreli yem · ürün kodu 3112818 · dört blok içerir; her blok 10–15 balığı üç gün besler · çözünürken kalsiyum bileşeni genel sertliği bir miktar artırabilir · ham protein %38, yağ %6, lif %4, kül %7"],
  ],"2026-09-18"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/8957/jbl-pronovo-bel-holiday?country=ie",[
    ["PRONOVO BEL HOLIDAY 1 blok","3–20 cm toplum akvaryumu balıkları için uzun süreli tatil yemi · ürün kodu 3112918 · tek blok yaklaşık 20–25 balığı 14 güne kadar besler · çözünürken kalsiyum bileşeni genel sertliği bir miktar artırabilir · ham protein %38, yağ %6, lif %4, kül %7"],
  ],"2026-09-18"),
  ...products("JBL","food","https://www.jbl.de/en-au/productsv2/detail/25206268",[
    ["PRONOVO SPIRULINA FLAKES M 100 ml","Canlı doğuranlar ile Malawi/Tanganika göllerinin otçul ve alg yiyen balıkları için yüzen prebiyotik pul yem · 100 ml dozaj kapaklı geri dönüştürülebilir kutu · %20 Spirulina · ham protein %35, yağ %5, lif %2, kül %8"],
    ["PRONOVO SPIRULINA FLAKES M 250 ml","Canlı doğuranlar ile Malawi/Tanganika göllerinin otçul ve alg yiyen balıkları için yüzen prebiyotik pul yem · 250 ml dozaj kapaklı geri dönüştürülebilir kutu · %20 Spirulina · ham protein %35, yağ %5, lif %2, kül %8"],
    ["PRONOVO SPIRULINA FLAKES M 1000 ml","Canlı doğuranlar ile Malawi/Tanganika göllerinin otçul ve alg yiyen balıkları için yüzen prebiyotik pul yem · 1000 ml dozaj kapaklı geri dönüştürülebilir kutu · %20 Spirulina · ham protein %35, yağ %5, lif %2, kül %8"],
    ["PRONOVO SPIRULINA FLAKES M 5,5 L","Canlı doğuranlar ile Malawi/Tanganika göllerinin otçul ve alg yiyen balıkları için yüzen prebiyotik pul yemin 5,5 L büyük ambalajı · %20 Spirulina · ham protein %35, yağ %5, lif %2, kül %8"],
  ],"2026-09-18"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/8964/jbl-pronovo-spirulina-grano-s?country=ie",[
    ["PRONOVO SPIRULINA GRANO S 100 ml","Canlı doğuranlar ve karidesler gibi otçul/alg yiyen akvaryum canlıları için batan prebiyotik granül · ürün kodu 3113618 · 100 ml Click dozajlı geri dönüştürülebilir kutu · %20 Spirulina · ham protein %35, yağ %5, lif %2, kül %8"],
  ],"2026-09-18"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/8966/jbl-pronovo-spirulina-grano-m?country=ie",[
    ["PRONOVO SPIRULINA GRANO M 250 ml","Canlı doğuranlar ve emici çöpçü balıkları gibi otçul/alg yiyen akvaryum balıkları için batan prebiyotik granül · ürün kodu 3113718 · 250 ml Click dozajlı geri dönüştürülebilir kutu · %20 Spirulina · ham protein %35, yağ %5, lif %2, kül %8"],
  ],"2026-09-18"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/8968/jbl-pronovo-color-flakes-m?country=ie",[
    ["PRONOVO COLOR FLAKES M 100 ml","Doğal krill astaksantiniyle renk oluşumunu destekleyen prebiyotik pul yem · ürün kodu 3113818 · 100 ml dozaj kapaklı geri dönüştürülebilir kutu · karides unu %12 · ham protein %40, yağ %8, lif %3, kül %8"],
    ["PRONOVO COLOR FLAKES M 250 ml","Doğal krill astaksantiniyle renk oluşumunu destekleyen prebiyotik pul yem · ürün kodu 3113918 · 250 ml dozaj kapaklı geri dönüştürülebilir kutu · karides unu %12 · ham protein %40, yağ %8, lif %3, kül %8"],
  ],"2026-09-18"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/8971/jbl-pronovo-color-grano-s?country=ie",[
    ["PRONOVO COLOR GRANO S 100 ml","Doğal krill astaksantiniyle renk oluşumunu destekleyen S boy batan prebiyotik granül · ürün kodu 3114118 · 100 ml Click dozajlı geri dönüştürülebilir kutu · karides unu %8 · ham protein %40, yağ %8, lif %3, kül %8"],
  ],"2026-09-18"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/8973/jbl-pronovo-color-grano-m?country=ie",[
    ["PRONOVO COLOR GRANO M 250 ml","8–20 cm akvaryum balıklarında doğal krill astaksantiniyle renk oluşumunu destekleyen M boy batan prebiyotik granül · ürün kodu 3114318 · 250 ml / 125 g Click dozajlı geri dönüştürülebilir kutu · ham protein %40, yağ %8, lif %3, kül %8"],
  ],"2026-09-18"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/8905/jbl-pronovo-neon-grano-xxs?country=ie",[
    ["PRONOVO NEON GRANO XXS 20 ml Freshlock","1–3 cm neon ve diğer küçük tetra türleri için batan XXS prebiyotik granül · 20 ml / 16 g hava ve ışık geçirmez Freshlock paket · plankton ağırlıklı doğal beslenmeye uyarlanmış, %5 Hermetia böcek proteini içerir · ham protein %39, yağ %6, lif %4, kül %8"],
    ["PRONOVO NEON GRANO XXS 100 ml","1–3 cm neon ve diğer küçük tetra türleri için batan XXS prebiyotik granül · ürün kodu 3114818 · 100 ml / 48 g Click dozajlı geri dönüştürülebilir kutu · plankton ağırlıklı doğal beslenmeye uyarlanmış, %5 Hermetia böcek proteini içerir · ham protein %39, yağ %6, lif %4, kül %8"],
  ],"2026-09-18"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/8908/jbl-pronovo-danio-grano-xs?country=ie",[
    ["PRONOVO DANIO GRANO XS 20 ml Freshlock","Danio ve barb türleri için batan XS prebiyotik granülün 20 ml hava ve ışık geçirmez Freshlock paketi · somon, karides, Spirulina ve %5 Hermetia böcek proteini içerir · ham protein %39, yağ %6, lif %4, kül %8"],
    ["PRONOVO DANIO GRANO XS 100 ml","Danio ve barb türleri için batan XS prebiyotik granül · ürün kodu 3115118 · 100 ml Click dozajlı geri dönüştürülebilir kutu · somon, karides, Spirulina ve %5 Hermetia böcek proteini içerir · ham protein %39, yağ %6, lif %4, kül %8"],
  ],"2026-09-18"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/8978/jbl-pronovo-guppy-flakes-s?country=ie",[
    ["PRONOVO GUPPY FLAKES S 100 ml","3–10 cm guppy ve diğer canlı doğuranlar için yüzen S boy prebiyotik pul yem · ürün kodu 3115818 · 100 ml dozaj kapaklı geri dönüştürülebilir kutu · %18 Spirulina ve doğal astaksantin · ham protein %36, yağ %5, lif %2, kül %7"],
    ["PRONOVO GUPPY FLAKES S 250 ml","3–10 cm guppy ve diğer canlı doğuranlar için yüzen S boy prebiyotik pul yem · 250 ml dozaj kapaklı geri dönüştürülebilir kutu · %18 Spirulina ve doğal astaksantin · ham protein %36, yağ %5, lif %2, kül %7"],
  ],"2026-09-18"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/8981/jbl-pronovo-guppy-grano-s?country=ie",[
    ["PRONOVO GUPPY GRANO S 100 ml","3–10 cm guppy ve diğer canlı doğuranlar için batan S boy prebiyotik granül · ürün kodu 3116118 · 100 ml / 56 g dozaj kapaklı geri dönüştürülebilir kutu · %18 Spirulina ve doğal astaksantin · ham protein %36, yağ %5, lif %2, kül %7"],
    ["PRONOVO GUPPY GRANO S 250 ml","3–10 cm guppy ve diğer canlı doğuranlar için batan S boy prebiyotik granül · 250 ml / 136 g dozaj kapaklı geri dönüştürülebilir kutu · %18 Spirulina ve doğal astaksantin · ham protein %36, yağ %5, lif %2, kül %7"],
  ],"2026-09-18"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/8986/jbl-pronovo-tanganyika-flakes-m?country=ie",[
    ["PRONOVO TANGANYIKA FLAKES M 250 ml","8–20 cm ağırlıklı etçil Tanganika ve Malawi cikletleri için yüzen M boy prebiyotik pul yem · somon, karides, krill ve kalamar içerir · doğal astaksantin · ham protein %43, yağ %8, lif %2, kül %8"],
    ["PRONOVO TANGANYIKA FLAKES M 1000 ml","8–20 cm ağırlıklı etçil Tanganika ve Malawi cikletleri için yüzen M boy prebiyotik pul yemin 1000 ml dozaj kapaklı kutusu · ham protein %43, yağ %8, lif %2, kül %8"],
    ["PRONOVO TANGANYIKA FLAKES M 5,5 L","8–20 cm ağırlıklı etçil Tanganika ve Malawi cikletleri için yüzen M boy prebiyotik pul yemin 5,5 L büyük ambalajı · ham protein %43, yağ %8, lif %2, kül %8"],
  ],"2026-09-18"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/8989/jbl-pronovo-tanganyika-grano-m?country=ie",[
    ["PRONOVO TANGANYIKA GRANO M 250 ml","8–20 cm ağırlıklı etçil Tanganika ve Malawi cikletleri için batan M boy prebiyotik granül · 250 ml / 145 g dozaj kapaklı kutu · karides unu %15 · ham protein %43, yağ %8, lif %2, kül %8"],
    ["PRONOVO TANGANYIKA GRANO M 1000 ml","8–20 cm ağırlıklı etçil Tanganika ve Malawi cikletleri için batan M boy prebiyotik granül · 1000 ml / 570 g dozaj kapaklı kutu · karides unu %15 · ham protein %43, yağ %8, lif %2, kül %8"],
  ],"2026-09-18"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/8992/jbl-pronovo-malawi-flakes-m?country=ie",[
    ["PRONOVO MALAWI FLAKES M 250 ml","8–20 cm alg ve kaya yüzeyi otlayarak beslenen Malawi/Tanganika cikletleri için yüzen M boy prebiyotik pul yem · 250 ml / 40 g dozaj kapaklı kutu · %18 Spirulina · ham protein %38, yağ %6, lif %3, kül %7"],
    ["PRONOVO MALAWI FLAKES M 1000 ml","8–20 cm alg ve kaya yüzeyi otlayarak beslenen Malawi/Tanganika cikletleri için yüzen M boy prebiyotik pul yem · 1000 ml / 190 g dozaj kapaklı kutu · %18 Spirulina · ham protein %38, yağ %6, lif %3, kül %7"],
  ],"2026-09-18"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/8995/jbl-pronovo-malawi-grano-m?country=ie",[
    ["PRONOVO MALAWI GRANO M 250 ml","Alg ve kaya yüzeyi otlayarak beslenen Malawi/Tanganika cikletleri için batan M boy prebiyotik granülün 250 ml dozaj kapaklı kutusu · %18 Spirulina · ham protein %38, yağ %6, lif %3, kül %7"],
    ["PRONOVO MALAWI GRANO M 1000 ml","Alg ve kaya yüzeyi otlayarak beslenen Malawi/Tanganika cikletleri için batan M boy prebiyotik granülün 1000 ml dozaj kapaklı kutusu · %18 Spirulina · ham protein %38, yağ %6, lif %3, kül %7"],
    ["PRONOVO MALAWI GRANO M 5,5 L","Alg ve kaya yüzeyi otlayarak beslenen Malawi/Tanganika cikletleri için batan M boy prebiyotik granülün 5,5 L büyük ambalajı · %18 Spirulina · ham protein %38, yağ %6, lif %3, kül %7"],
  ],"2026-09-18"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/9001/jbl-pronovo-bits-grano-s?country=ie",[
    ["PRONOVO BITS GRANO S 250 ml","Küçük diskus ve diğer seçici Güney Amerika cikletleri için batan S boy prebiyotik granülün 250 ml dozaj kapaklı kutusu · karides unu %12 · ham protein %43, yağ %6, lif %3, kül %10"],
    ["PRONOVO BITS GRANO S 1000 ml","Küçük diskus ve diğer seçici Güney Amerika cikletleri için batan S boy prebiyotik granülün 1000 ml dozaj kapaklı kutusu · karides unu %12 · ham protein %43, yağ %6, lif %3, kül %10"],
  ],"2026-09-18"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/9004/jbl-pronovo-bits-grano-m?country=ie",[
    ["PRONOVO BITS GRANO M 250 ml","8–20 cm diskus ve diğer seçici Güney Amerika cikletleri için batan M boy prebiyotik granül · 250 ml / 120 g dozaj kapaklı kutu · karides unu %12 · ham protein %43, yağ %6, lif %3, kül %10"],
    ["PRONOVO BITS GRANO M 1000 ml","8–20 cm diskus ve diğer seçici Güney Amerika cikletleri için batan M boy prebiyotik granül · 1000 ml / 480 g dozaj kapaklı kutu · karides unu %12 · ham protein %43, yağ %6, lif %3, kül %10"],
    ["PRONOVO BITS GRANO M 5,5 L","8–20 cm diskus ve diğer seçici Güney Amerika cikletleri için batan M boy prebiyotik granül · 5,5 L / 2640 g büyük ambalaj · karides unu %12 · ham protein %43, yağ %6, lif %3, kül %10"],
  ],"2026-09-18"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/9009/jbl-pronovo-cichlid-grano-s?country=ie",[
    ["PRONOVO CICHLID GRANO S 100 ml","Yaklaşık 10–12 cm'ye kadar küçük cikletler için batan S boy prebiyotik granül · ürün kodu 3122718 · 100 ml dozaj kapaklı geri dönüştürülebilir kutu · karides unu %15 · ham protein %42, yağ %8, lif %4, kül %8"],
    ["PRONOVO CICHLID GRANO S 250 ml","Yaklaşık 10–12 cm'ye kadar küçük cikletler için batan S boy prebiyotik granülün 250 ml dozaj kapaklı geri dönüştürülebilir kutusu · karides unu %15 · ham protein %42, yağ %8, lif %4, kül %8"],
  ],"2026-09-18"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/9013/jbl-pronovo-cichlid-grano-m?country=ie",[
    ["PRONOVO CICHLID GRANO M 250 ml","8–20 cm orta boy cikletler için batan M boy prebiyotik granül · 250 ml / 130 g dozaj kapaklı geri dönüştürülebilir kutu · karides unu %15 · ham protein %42, yağ %8, lif %4, kül %8"],
    ["PRONOVO CICHLID GRANO M 1000 ml","8–20 cm orta boy cikletler için batan M boy prebiyotik granül · 1000 ml / 520 g dozaj kapaklı geri dönüştürülebilir kutu · karides unu %15 · ham protein %42, yağ %8, lif %4, kül %8"],
  ],"2026-09-18"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/9016/jbl-pronovo-cichlid-grano-xl?country=ie",[
    ["PRONOVO CICHLID GRANO XL 1000 ml","15–25 cm büyük cikletler için batan XL boy prebiyotik granül · ürün kodu 3123700 · 1000 ml dozaj kapaklı geri dönüştürülebilir kutu · karides unu %15 · ham protein %42, yağ %8, lif %4, kül %8"],
  ],"2026-09-18"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/8917/jbl-pronovo-betta-insect-stick-s?country=ie",[
    ["PRONOVO BETTA INSECT STICK S 20 ml Freshlock","3–10 cm betta türleri için yüzen S boy prebiyotik yem çubuğu · ürün kodu 3117018 · 20 ml / 10 g Freshlock poşet · Hermetia böcek proteini %15 · ham protein %42, yağ %6, lif %3, kül %8"],
    ["PRONOVO BETTA INSECT STICK S 100 ml","3–10 cm betta türleri için yüzen S boy prebiyotik yem çubuğu · ürün kodu 3117118 · 100 ml / 38 g dozaj kapaklı geri dönüştürülebilir kutu · Hermetia böcek proteini %15 · ham protein %42, yağ %6, lif %3, kül %8"],
  ],"2026-09-18"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/9032/jbl-pronovo-betta-flakes-s?country=ie",[
    ["PRONOVO BETTA FLAKES S 20 ml (Arşiv)","3–10 cm betta türleri için yüzen S boy prebiyotik pul yem · ürün kodu 3130418 · 20 ml Freshlock ambalaj artık satışta değildir ve resmî sayfada arşivlenmiştir · krill unu %8 · ham protein %43, yağ %6, lif %3, kül %8"],
    ["PRONOVO BETTA FLAKES S 100 ml","3–10 cm betta türleri için yüzen S boy prebiyotik pul yem · 100 ml dozaj kapaklı geri dönüştürülebilir kutu · krill unu %8 · ham protein %43, yağ %6, lif %3, kül %8"],
  ],"2026-09-18"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/9035/jbl-pronovo-betta-grano-s?country=ie",[
    ["PRONOVO BETTA GRANO S 20 ml Freshlock","3–10 cm betta türleri için batan S boy prebiyotik granül · ürün kodu 3130718 · 20 ml / 16 g Freshlock poşet · krill unu %8 · ham protein %43, yağ %6, lif %3, kül %8"],
    ["PRONOVO BETTA GRANO S 100 ml","3–10 cm betta türleri için batan S boy prebiyotik granül · ürün kodu 3130818 · 100 ml / 50 g dozaj kapaklı geri dönüştürülebilir kutu · krill unu %8 · ham protein %43, yağ %6, lif %3, kül %8"],
  ],"2026-09-18"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/9038/jbl-pronovo-gourami-grano-s?country=ie",[
    ["PRONOVO GOURAMI GRANO S 250 ml","Gurami ve diğer labirentli balıklar için batan S boy prebiyotik granül · ürün kodu 3130918 · 250 ml dozaj kapaklı geri dönüştürülebilir kutu · karides unu %12; Hermetia içerir ancak oranı yayımlanmamıştır · ham protein %39, yağ %6, lif %4, kül %8"],
  ],"2026-09-18"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/8920/jbl-pronovo-red-insect-stick-s?country=ie",[
    ["PRONOVO RED INSECT STICK S 20 ml (Arşiv)","3–10 cm Japon balığı ve üretim formları için yüzen S boy prebiyotik yem çubuğu · ürün kodu 3118000 · 20 ml / 10 g Freshlock ambalaj artık satışta değildir ve resmî sayfada arşivlenmiştir · Hermetia böcek proteini %15 · ham protein %42, yağ %6, lif %3, kül %8"],
    ["PRONOVO RED INSECT STICK S 100 ml","3–10 cm Japon balığı ve üretim formları için yüzen S boy prebiyotik yem çubuğu · ürün kodu 3118118 · 100 ml / 38 g dozaj kapaklı geri dönüştürülebilir kutu · Hermetia böcek proteini %15 · ham protein %42, yağ %6, lif %3, kül %8"],
  ],"2026-09-18"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/9045/jbl-pronovo-red-flakes-m?country=ie",[
    ["PRONOVO RED FLAKES M 100 ml","8–20 cm Japon balığı ve üretim formları için yüzen M boy prebiyotik pul yem · ürün kodu 3131118 · 100 ml / 18 g dozaj kapaklı kutu · Spirulina %2 · ham protein %30, yağ %6, lif %3, kül %8"],
    ["PRONOVO RED FLAKES M 250 ml","8–20 cm Japon balığı ve üretim formları için yüzen M boy prebiyotik pul yemin 250 ml / 45 g dozaj kapaklı kutusu · Spirulina %2 · ham protein %30, yağ %6, lif %3, kül %8"],
    ["PRONOVO RED FLAKES M 750 ml Refill","8–20 cm Japon balığı ve üretim formları için yüzen M boy prebiyotik pul yemin 750 ml / 135 g yeniden doldurma ambalajı · ürün kodu 3131318 · Spirulina %2 · ham protein %30, yağ %6, lif %3, kül %8"],
    ["PRONOVO RED FLAKES M 1000 ml","8–20 cm Japon balığı ve üretim formları için yüzen M boy prebiyotik pul yemin 1000 ml / 180 g dozaj kapaklı kutusu · Spirulina %2 · ham protein %30, yağ %6, lif %3, kül %8"],
  ],"2026-09-18"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/9050/jbl-pronovo-red-grano-m?country=ie",[
    ["PRONOVO RED GRANO M 100 ml","8–20 cm Japon balığı ve üretim formları için batan M boy prebiyotik granül · ürün kodu 3131618 · 100 ml dozaj kapaklı kutu · Spirulina %5 · ham protein %30, yağ %6, lif %3, kül %8"],
    ["PRONOVO RED GRANO M 250 ml","8–20 cm Japon balığı ve üretim formları için batan M boy prebiyotik granülün 250 ml dozaj kapaklı kutusu · Spirulina %5 · ham protein %30, yağ %6, lif %3, kül %8"],
  ],"2026-09-18"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/9055/jbl-pronovo-red-holiday?country=ie",[
    ["PRONOVO RED HOLIDAY 3 blok","3–20 cm Japon balığı ve üretim formları için üç tatil yem bloğu · ürün kodu 3132118 · bir blok 1–3 balığı 4–6 gün besler · kalsiyum bileşiği çözünürken genel sertliği bir miktar yükseltebilir · ham protein %30, yağ %6, lif %3, kül %8"],
  ],"2026-09-18"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/9057/jbl-pronovo-fantail-grano-s?country=ie",[
    ["PRONOVO FANTAIL GRANO S 100 ml","3–10 cm fantail, oranda ve diğer süslü Japon balığı formları için batan S boy prebiyotik granül · ürün kodu 3132300 · 100 ml / 56 g dozaj kapaklı kutu · Spirulina ve ıspanak içerir · ham protein %38, yağ %8, lif %4, kül %11"],
  ],"2026-09-18"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/9059/jbl-pronovo-fantail-grano-m?country=ie",[
    ["PRONOVO FANTAIL GRANO M 100 ml","8–20 cm fantail, oranda ve diğer süslü Japon balığı formları için batan M boy prebiyotik granül · ürün kodu 3132618 · 100 ml / 58 g dozaj kapaklı kutu · Spirulina ve ıspanak içerir · ham protein %38, yağ %8, lif %4, kül %11"],
    ["PRONOVO FANTAIL GRANO M 250 ml","8–20 cm fantail, oranda ve diğer süslü Japon balığı formları için batan M boy prebiyotik granül · ürün kodu 3132828 · 250 ml / 145 g dozaj kapaklı kutu · Spirulina ve ıspanak içerir · ham protein %38, yağ %8, lif %4, kül %11"],
    ["PRONOVO FANTAIL GRANO M 1000 ml","8–20 cm fantail, oranda ve diğer süslü Japon balığı formları için batan M boy prebiyotik granül · ürün kodu 3132900 · 1000 ml / 580 g dozaj kapaklı kutu · Spirulina ve ıspanak içerir · ham protein %38, yağ %8, lif %4, kül %11"],
  ],"2026-09-18"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/8911/jbl-pronovo-botia-tab-m?country=ie",[
    ["PRONOVO BOTIA TAB M 100 ml","Botia, emici çöpçü, tepe çöpçüsü ve Pangio türleri için dibe bırakılabilen veya hafifçe cama bastırılabilen M boy prebiyotik tablet · 100 ml / 58 g dozaj kapaklı kutu · Spirulina %14 · ham protein %33, yağ %6, lif %6, kül %8"],
    ["PRONOVO BOTIA TAB M 250 ml","Botia, emici çöpçü, tepe çöpçüsü ve Pangio türleri için dibe bırakılabilen veya hafifçe cama bastırılabilen M boy prebiyotik tablet · ürün kodu 3115318 · 250 ml / 150 g dozaj kapaklı kutu · Spirulina %14 · ham protein %33, yağ %6, lif %6, kül %8"],
    ["PRONOVO BOTIA TAB M 1000 ml","Botia, emici çöpçü, tepe çöpçüsü ve Pangio türleri için dibe bırakılabilen veya hafifçe cama bastırılabilen M boy prebiyotik tablet · 1000 ml / 580 g dozaj kapaklı kutu · Spirulina %14 · ham protein %33, yağ %6, lif %6, kül %8"],
    ["PRONOVO BOTIA TAB M 5,5 L","Botia, emici çöpçü, tepe çöpçüsü ve Pangio türleri için dibe bırakılabilen veya hafifçe cama bastırılabilen M boy prebiyotik tablet · 5,5 L / 2900 g büyük ambalaj · Spirulina %14 · ham protein %33, yağ %6, lif %6, kül %8"],
  ],"2026-09-18"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/9063/jbl-pronovo-pleco-wafer-m?country=ie",[
    ["PRONOVO PLECO WAFER M 100 ml","Bitki ve algle beslenen emici vatozlar için batan M boy prebiyotik wafer · 100 ml / 53 g dozaj kapaklı kutu · odun lifi %10; gececi türlerde ışıklar kapandıktan sonra verilir · ham protein %29, yağ %7, lif %11, kül %8"],
    ["PRONOVO PLECO WAFER M 250 ml","Bitki ve algle beslenen emici vatozlar için batan M boy prebiyotik wafer · ürün kodu 3133318 · 250 ml / 133 g dozaj kapaklı kutu · odun lifi %10; gececi türlerde ışıklar kapandıktan sonra verilir · ham protein %29, yağ %7, lif %11, kül %8"],
    ["PRONOVO PLECO WAFER M 1000 ml","Bitki ve algle beslenen emici vatozlar için batan M boy prebiyotik wafer · 1000 ml / 530 g dozaj kapaklı kutu · odun lifi %10; gececi türlerde ışıklar kapandıktan sonra verilir · ham protein %29, yağ %7, lif %11, kül %8"],
    ["PRONOVO PLECO WAFER M 5,5 L","Bitki ve algle beslenen emici vatozlar için batan M boy prebiyotik wafer · 5,5 L / 2900 g büyük ambalaj · odun lifi %10; gececi türlerde ışıklar kapandıktan sonra verilir · ham protein %29, yağ %7, lif %11, kül %8"],
  ],"2026-09-18"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/9068/jbl-pronovo-pleco-wafer-xl?country=ie",[
    ["PRONOVO PLECO WAFER XL 250 ml","15–40 cm büyük, bitki ve algle beslenen emici vatozlar için batan XL boy prebiyotik wafer · ürün kodu 3133818 · 250 ml / 125 g dozaj kapaklı kutu · odun lifi %10; gececi türlerde ışıklar kapandıktan sonra verilir · ham protein %29, yağ %7, lif %11, kül %8"],
    ["PRONOVO PLECO WAFER XL 1000 ml","15–40 cm büyük, bitki ve algle beslenen emici vatozlar için batan XL boy prebiyotik wafer · ürün kodu 3133918 · 1000 ml / 510 g dozaj kapaklı kutu · odun lifi %10; gececi türlerde ışıklar kapandıktan sonra verilir · ham protein %29, yağ %7, lif %11, kül %8"],
    ["PRONOVO PLECO WAFER XL 5,5 L","15–40 cm büyük, bitki ve algle beslenen emici vatozlar için batan XL boy prebiyotik wafer · ürün kodu 3134000 · 5,5 L / 2800 g büyük ambalaj · odun lifi %10; gececi türlerde ışıklar kapandıktan sonra verilir · ham protein %29, yağ %7, lif %11, kül %8"],
  ],"2026-09-18"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/9160/jbl-pronovo-corydoras-tab-m?country=ie",[
    ["PRONOVO CORYDORAS TAB M 100 ml","Corydoras, Aspidoras, Brochis, Scleromystax, Dianema ve Hoplosternum türleri için batan M boy prebiyotik tablet · ürün kodu 3134118 · 100 ml / 58 g dozaj kapaklı kutu · karides unu %10,53; Hermetia içerir ancak oranı yayımlanmamıştır · alacakaranlıkta etkin türlerde ışıklar kapandıktan sonra verilir · ham protein %39, yağ %7, lif %3, kül %10"],
    ["PRONOVO CORYDORAS TAB M 250 ml","Corydoras, Aspidoras, Brochis, Scleromystax, Dianema ve Hoplosternum türleri için batan M boy prebiyotik tablet · ürün kodu 3134318 · 250 ml / 150 g dozaj kapaklı kutu · karides unu %10,53; Hermetia içerir ancak oranı yayımlanmamıştır · alacakaranlıkta etkin türlerde ışıklar kapandıktan sonra verilir · ham protein %39, yağ %7, lif %3, kül %10"],
  ],"2026-09-18"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/9074/jbl-pronovo-killifish-grano-s?country=ie",[
    ["PRONOVO KILLIFISH GRANO S 100 ml","3–10 cm yumurtlayan dişli sazangiller (killifish ve panchax) için batan S boy prebiyotik granül · ürün kodu 3134218 · 100 ml / 48 g Click dozajlı kutu · Hermetia böcek proteini %5; somon, karides, Spirulina ve doğal astaksantin içerir · ham protein %38, yağ %7, lif %4, kül %8"],
  ],"2026-09-18"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/9079/jbl-pronovo-dragon-stick-l?country=ie",[
    ["PRONOVO DRAGON STICK L 1000 ml","40–100 cm Arowana türleri için yüzen L boy prebiyotik ana yem çubuğu · ürün kodu 3134773 · 1000 ml yeniden kapatılabilir ambalaj · somon unu %34 ve karidesten doğal astaksantin içerir · ham protein %44, yağ %8, lif %2, kül %10"],
    ["PRONOVO DRAGON STICK L 5,5 L","40–100 cm Arowana türleri için yüzen L boy prebiyotik ana yem çubuğu · ürün kodu 3134800 · 5,5 L / 2000 g yeniden kapatılabilir PP kova · somon unu %34 ve karidesten doğal astaksantin içerir · ham protein %44, yağ %8, lif %2, kül %10"],
  ],"2026-09-18"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/9086/jbl-pronovo-lotl-grano-s?country=ie",[
    ["PRONOVO LOTL GRANO S 100 ml","3–10 cm aksolotl, semender ve cüce pençeli kurbağalar için batan S boy prebiyotik granül · ürün kodu 3135200 · 100 ml Click dozajlı kutu · alabalık unu %40, Gammarus %10 ve karides unu %10 · ham protein %50, yağ %8, lif %2, kül %12"],
  ],"2026-09-18"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/9088/jbl-pronovo-lotl-grano-m?country=ie",[
    ["PRONOVO LOTL GRANO M 250 ml","8–20 cm aksolotl, semender ve pençeli kurbağalar için batan M boy prebiyotik granül · ürün kodu 3135600 · 250 ml / 150 g dozaj kapaklı kutu · alabalık unu %40, Gammarus %10 ve karides unu %10 · ham protein %50, yağ %8, lif %2, kül %12"],
  ],"2026-09-18"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/9091/jbl-pronovo-lotl-grano-xl?country=ie",[
    ["PRONOVO LOTL GRANO XL 250 ml","15–25 cm aksolotl ve semenderler için batan XL boy prebiyotik granül · ürün kodu 3135800 · 250 ml dozaj kapaklı kutu · alabalık unu %40, Gammarus %10 ve karides unu %10 · ham protein %50, yağ %8, lif %2, kül %12"],
  ],"2026-09-18"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/9094/jbl-pronovo-shrimps-grano-s?country=ie",[
    ["PRONOVO SHRIMPS GRANO S 100 ml","Karidesler için batan S boy prebiyotik granül · ürün kodu 3156018 · 100 ml dozaj kapaklı kutu · ısırgan unu %20, Spirulina ve doğal astaksantin içerir; dengeli hayvansal/bitkisel protein sağlıklı büyüme ve sorunsuz kabuk değişimini destekler · ham protein %35, yağ %5, lif %9, kül %12"],
    ["PRONOVO SHRIMPS GRANO S 250 ml","Karidesler için batan S boy prebiyotik granül · ürün kodu 3156300 · 250 ml dozaj kapaklı kutu · ısırgan unu %20, Spirulina ve doğal astaksantin içerir; dengeli hayvansal/bitkisel protein sağlıklı büyüme ve sorunsuz kabuk değişimini destekler · ham protein %35, yağ %5, lif %9, kül %12"],
  ],"2026-09-18"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/9098/jbl-pronovo-crabs-wafer-m?country=ie",[
    ["PRONOVO CRABS WAFER M 100 ml","Cherax, Procambarus ve diğer kerevit/yengeçler için batan M boy prebiyotik wafer · ürün kodu 3156500 · 100 ml dozaj kapaklı kutu · odun lifi %4, karides ve somon unu ile Spirulina kaynaklı doğal astaksantin içerir; dengeli hayvansal/bitkisel protein kabuk değişimini destekler · ham protein %33, yağ %6, lif %11, kül %11"],
    ["PRONOVO CRABS WAFER M 250 ml","Cherax, Procambarus ve diğer kerevit/yengeçler için batan M boy prebiyotik wafer · ürün kodu 3156700 · 250 ml dozaj kapaklı kutu · odun lifi %4, karides ve somon unu ile Spirulina kaynaklı doğal astaksantin içerir; dengeli hayvansal/bitkisel protein kabuk değişimini destekler · ham protein %33, yağ %6, lif %11, kül %11"],
  ],"2026-09-18"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/8926/jbl-pronovo-insect-stick-s?country=se",[
    ["PRONOVO INSECT STICK S 20 ml","3–10 cm akvaryum balıkları için yüzen S boy prebiyotik yem çubuğu · ürün kodu 3130018 · 20 ml / 10 g taze tutan poşet · Hermetia böcek proteini %15; karides, somon ve kalamar içerir · ham protein %42, yağ %6, lif %3, kül %8"],
    ["PRONOVO INSECT STICK S 100 ml","3–10 cm akvaryum balıkları için yüzen S boy prebiyotik yem çubuğu · ürün kodu 3130128 · 100 ml / 38 g Click dozajlı kutu · Hermetia böcek proteini %15; karides, somon ve kalamar içerir · ham protein %42, yağ %6, lif %3, kül %8"],
    ["PRONOVO INSECT STICK S 250 ml","3–10 cm akvaryum balıkları için yüzen S boy prebiyotik yem çubuğu · ürün kodu 3130200 · 250 ml / 93 g dozaj kapaklı kutu · Hermetia böcek proteini %15; karides, somon ve kalamar içerir · ham protein %42, yağ %6, lif %3, kül %8"],
  ],"2026-09-18"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/9101/jbl-pronovo-artemio?country=ie",[
    ["PRONOVO ARTEMIO 100 ml","8–20 cm tatlı ve deniz suyu balıkları için katkı ve koruyucu içermeyen, yüzen dondurularak kurutulmuş Artemia parçaları · ürün kodu 3157000 · 100 ml / 6 g dozaj kapaklı kutu · ham protein %48, yağ %5, lif %1, kül %16"],
    ["PRONOVO ARTEMIO 250 ml","8–20 cm tatlı ve deniz suyu balıkları için katkı ve koruyucu içermeyen, yüzen dondurularak kurutulmuş Artemia parçaları · ürün kodu 3157100 · 250 ml / 18 g dozaj kapaklı kutu · ham protein %48, yağ %5, lif %1, kül %16"],
  ],"2026-09-18"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/9104/jbl-pronovo-daph?country=ie",[
    ["PRONOVO DAPH 100 ml","3–10 cm süs balıkları için doğal güneşte kurutulmuş Daphnia destek yemi · ürün kodu 3157300 · 100 ml / 13 g dozaj kapaklı kutu · lif bakımından zengin tek bileşenli yem · ham protein %40, yağ %5, lif %4, kül %40"],
  ],"2026-09-18"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/9106/jbl-pronovo-fex?country=ee",[
    ["PRONOVO FEX 100 ml","8–20 cm tatlı su balıkları, yengeç, kerevit, karides ve aksolotllar için yüzen, dondurularak kurutulmuş Tubifex küpleri · ürün kodu 3157518 · 100 ml / 8 g dozaj kapaklı kutu · ham protein %60, yağ %10, lif %1, kül %6"],
    ["PRONOVO FEX 250 ml","8–20 cm tatlı su balıkları, yengeç, kerevit, karides ve aksolotllar için yüzen, dondurularak kurutulmuş Tubifex küpleri · ürün kodu 3157700 · 250 ml / 22 g dozaj kapaklı kutu · ham protein %60, yağ %10, lif %1, kül %6"],
  ],"2026-09-18"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/9109/jbl-pronovo-fil?country=ie",[
    ["PRONOVO FIL 100 ml","3–10 cm tropikal tatlı su balıkları için dondurularak kurutulmuş kırmızı Chironomidae larvası destek yemi · ürün kodu 3157918 · 100 ml / 10 g dozaj kapaklı kutu · ham protein %55, yağ %3, lif %5, kül %18"],
    ["PRONOVO FIL 250 ml","3–10 cm tropikal tatlı su balıkları için dondurularak kurutulmuş kırmızı Chironomidae larvası destek yemi · ürün kodu 3158100 · 250 ml / 25 g dozaj kapaklı kutu · ham protein %55, yağ %3, lif %5, kül %18"],
  ],"2026-09-18"),
  {
    id:"jbl-pronovo-snail",brand:"JBL",model:"PRONOVO SNAIL",category:"food",
    description:"Küresel balıklar, loach türleri, synodontis ve diğer salyangoz yiyen canlılar için kabuğuyla birlikte yüzde 100 dondurularak kurutulmuş salyangoz · katkı ve koruyucu içermez; sert kabuk özellikle küresel balıklarda diş aşınmasına yardımcı olur",
    sourceUrl:"https://www.jbl.de/en-gb/productsv2/detail/25214116",additionalSourceUrls:["https://www.jbl.de/en-dz/press/detail/992"],verifiedAt:"2026-09-15",
  },
  {
    id:"jbl-pronovo-medaka-flakes-xs",brand:"JBL",model:"PRONOVO MEDAKA FLAKES XS",category:"food",
    description:"Her boy Japon pirinç balığı (Oryzias latipes) için yüzen prebiyotik XS pul yem · farklı nesillere uygun değişken ince pul boyları; yüzde 18 spirulina, somon, karides ve 11 sebze/meyve içerir",
    sourceUrl:"https://www.jbl.de/en-gb/productsv2/detail/25214141",verifiedAt:"2026-09-15",
  },
  {
    id:"jbl-atvitol",brand:"JBL",model:"Atvitol",category:"food",
    description:"Tatlı ve deniz suyu balıkları için 50 ml damlalıklı multivitamin yem takviyesi · dondurulmuş, canlı, kurutulmuş veya kuru yemin üzerine damlatılarak kullanılır; eksiklik belirtilerini önlemeye ve direnci desteklemeye yöneliktir",
    sourceUrl:"https://www.jbl.de/en/products/detail/2315/jbl-atvitol",verifiedAt:"2026-09-15",
  },
  {
    id:"jbl-artemiomix-230-g",brand:"JBL",model:"ArtemioMix 230 g",category:"food",
    description:"Tatlı ve deniz suyu balıklarına canlı yem üretmek için Artemia yumurtası, mikroalgli özel tuz ve pH tamponu içeren hazır karışım · ürün kodu 3090200 · 230 g / 5 ml ölçü kaşıklı paket · 0,5 L suya iki düz ölçekle yaklaşık 14 kültür; nauplii 24–36 saatte çıkar",
    sourceUrl:"https://www.jbl.de/en-ie/productsv2/detail/25203130",verifiedAt:"2026-09-18",
  },
  {
    id:"jbl-artemiofluid-50-ml",brand:"JBL",model:"ArtemioFluid 50 ml",category:"food",
    description:"Üçüncü günden itibaren Artemia nauplii yetiştirmek için ultra ince homojenize fitoplanktonlu sıvı tam yem · ürün kodu 3090400 · 50 ml şişe · kullanmadan önce çalkalanır, su hafif yeşile dönene kadar damla damla eklenir ve ancak su yeniden berraklaşınca tekrarlanır · ham protein %37, yağ %6, lif %1,1, kül %7",
    sourceUrl:"https://www.jbl.de/en/products/detail/3382/jbl-artemiofluid?country=ie",verifiedAt:"2026-09-18",
  },
  {
    id:"jbl-artemiosal-230-g",brand:"JBL",model:"ArtemioSal 230 g",category:"food",
    description:"Artemia nauplii üretimi için mikroalgli ve pH tamponlu özel tuz · ürün kodu 3090600 · 230 g ölçü kaşıklı paket 7 L kültür çözeltisi hazırlar; 0,5 L suya iki düz ölçek kullanılır ve Artemia yumurtası ayrıca gerekir · iyot, florür veya topaklanma önleyici içerebilen sofra tuzu kullanılmamalıdır",
    sourceUrl:"https://www.jbl.de/en/products/detail/3383/jbl-artemiosal?country=ca",verifiedAt:"2026-09-18",
  },
  {
    id:"jbl-artemiopur-40-ml",brand:"JBL",model:"ArtemioPur 40 ml",category:"food",
    description:"Canlı yavru yemi üretmek için azot altında paketlenmiş yüksek kuluçka oranlı Artemia yumurtası · ürün kodu 3090700 · 40 ml cam şişede 20 g ve ölçü kaşığı · 0,5 L tuzlu suya 1–3 ölçek, güçlü havalandırmayla yaklaşık 24 saatte çıkım · kapalı 1 yıl, açıldıktan sonra 4 ay saklama süresi",
    sourceUrl:"https://www.jbl.de/en-hu/productsv2/detail/25185936",verifiedAt:"2026-09-18",
  },
  ...products("JBL","food","https://www.jbl.de/en/products/detail/5988/jbl-planktonpur-small?country=ee",[
    ["PlanktonPur SMALL 2","Arşiv ürün · 2–6 cm tatlı ve deniz suyu balıkları ile karidesler için 0,2–1 mm boyda, koruyucusuz %100 saf plankton karışımı · ürün kodu 3003100 · 8 × 2 g tek öğünlük stick · açılan stick tek öğünde kullanılmalı; zorunluysa hava geçirmez kapta 4–7 °C'de en fazla 24 saat saklanır · ham protein %49, yağ %13, lif %1, kül %6"],
    ["PlanktonPur SMALL 5","Arşiv ürün · 2–6 cm tatlı ve deniz suyu balıkları ile karidesler için 0,2–1 mm boyda, koruyucusuz %100 saf plankton karışımı · ürün kodu 3003300 · 8 × 5 g tek öğünlük stick · açılan stick tek öğünde kullanılmalı; zorunluysa hava geçirmez kapta 4–7 °C'de en fazla 24 saat saklanır · ham protein %49, yağ %13, lif %1, kül %6"],
  ],"2026-09-18"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/5991/jbl-planktonpur-medium?country=bg",[
    ["PlanktonPur MEDIUM 2","Arşiv ürün · 4–14 cm tatlı ve deniz suyu balıkları ile karidesler için 2 mm'ye kadar koruyucusuz %100 arktik plankton · ürün kodu 3003500 · 8 × 2 g tek öğünlük stick; bir stick 200 L'ye kadar akvaryuma yöneliktir · %95 Calanus finmarchicus ve %5 Calanus helgolandicus · ham protein %49, yağ %13, lif %1, kül %6"],
    ["PlanktonPur MEDIUM 5","Arşiv ürün · 4–14 cm tatlı ve deniz suyu balıkları ile karidesler için 2 mm'ye kadar koruyucusuz %100 arktik plankton · ürün kodu 3003700 · 8 × 5 g tek öğünlük stick · %95 Calanus finmarchicus ve %5 Calanus helgolandicus · açılan stick tek öğünde kullanılmalı · ham protein %49, yağ %13, lif %1, kül %6"],
  ],"2026-09-18"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/4525/jbl-gala?country=lv",[
    ["Gala 100 ml","Arşiv ürün · 10–20 cm tropikal tatlı su balıkları için karides ve %2 sarımsak içeren, tüm su katmanlarına dağılan farklı boylarda pul ana yem · 100 ml / 15 g · resmî ülke sayfalarında 4043051 ve 4043080 olarak farklı kodlanır · açıldıktan sonra 4 ay, kapalı ambalajda 3 yıl saklama · ham protein %45, yağ %8, lif %2, kül %9, nem %8"],
    ["Gala 250 ml","Arşiv ürün · 10–20 cm tropikal tatlı su balıkları için karides ve %2 sarımsak içeren, tüm su katmanlarına dağılan farklı boylarda pul ana yem · 250 ml / 38 g · ürün kodu 4043180 · açıldıktan sonra 4 ay, kapalı ambalajda 3 yıl saklama · ham protein %45, yağ %8, lif %2, kül %9, nem %8"],
    ["Gala 1000 ml","Arşiv ürün · 10–20 cm tropikal tatlı su balıkları için karides ve %2 sarımsak içeren, tüm su katmanlarına dağılan farklı boylarda pul ana yem · 1000 ml / 160 g · açıldıktan sonra 4 ay, kapalı ambalajda 3 yıl saklama · ham protein %45, yağ %8, lif %2, kül %9, nem %8"],
    ["Gala 5500 ml","Arşiv ürün · 10–20 cm tropikal tatlı su balıkları için karides ve %2 sarımsak içeren, tüm su katmanlarına dağılan farklı boylarda pul ana yem · 5500 ml / 950 g · açıldıktan sonra 4 ay, kapalı ambalajda 3 yıl saklama · ham protein %45, yağ %8, lif %2, kül %9, nem %8"],
  ],"2026-09-18"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/4495/jbl-grana-click?country=id&cpref=912",[
    ["Grana CLICK 100 ml","Arşiv ürün · 3–15 cm küçük tatlı su balıkları için tüm su katmanlarında yüzen ve batan granül ana yem · Click dozaj kapağında bir basış yaklaşık 5 balık içindir · 100 ml / 43 g · ürün kodu 4064600 · ham protein %45, yağ %6, lif %5, kül %9,5, nem %8"],
    ["Grana CLICK 250 ml","Arşiv ürün · 3–15 cm küçük tatlı su balıkları için tüm su katmanlarında yüzen ve batan granül ana yem · Click dozaj kapağında bir basış yaklaşık 5 balık içindir · 250 ml / 108 g · ürün kodu 4064700 · ham protein %45, yağ %6, lif %5, kül %9,5, nem %8"],
  ],"2026-09-18"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/2308/jbl-grana?country=fi&cpref=56",[
    ["Grana 250 ml REFILL","Arşiv ürün · 3–15 cm küçük tatlı su balıkları için tüm su katmanlarında yüzen ve batan granül ana yem refill paketi · 250 ml / 108 g · ürün kodu 4051200 · açıldıktan sonra 4 ay, kapalı ambalajda 3 yıl saklama · ham protein %45, yağ %6, lif %5, kül %9,5, nem %8"],
  ],"2026-09-18"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/2309/jbl-krill?country=in",[
    ["Krill 100 ml","Arşiv ürün · 3–20 cm tatlı ve deniz suyu balıkları için orta ve üst su katmanlarında tüketilen, protein, doymamış yağ asitleri ve karotenoid bakımından zengin ince öğütülmüş krill pul yemi · 100 ml / 16 g · ürün kodu 4058100 · ham protein %49, yağ %10, lif %1,8, kül %7, nem %8"],
    ["Krill 250 ml","Arşiv ürün · 3–20 cm tatlı ve deniz suyu balıkları için orta ve üst su katmanlarında tüketilen, protein, doymamış yağ asitleri ve karotenoid bakımından zengin ince öğütülmüş krill pul yemi · 250 ml / 40 g · ürün kodu 4058200 · ham protein %49, yağ %10, lif %1,8, kül %7, nem %8"],
  ],"2026-09-18"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/4494/jbl-granadiscus-click?country=hk",[
    ["GranaDiscus CLICK 250 ml","Arşiv ürün · seçici discus balıkları için bağışıklığı ve renk gelişimini destekleyen, yarı yüzen granül ana yem · Click dozaj kapağında bir basış yaklaşık 5 balık içindir · 250 ml / 110 g · ürün kodu 4065100 · ham protein %46, yağ %6, lif %1,8, kül %9,5, nem %8"],
  ],"2026-09-18"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/2310/jbl-granadiscus?country=dk",[
    ["GranaDiscus 250 ml REFILL","Arşiv ürün · seçici discus balıkları için bağışıklığı ve renk gelişimini destekleyen, yarı yüzen granül ana yem refill paketi · 250 ml / 110 g · ürün kodu 4052000 · ham protein %46, yağ %6, lif %1,8, kül %9,5, nem %8"],
    ["GranaDiscus 1000 ml","Arşiv ürün · seçici discus balıkları için bağışıklığı ve renk gelişimini destekleyen, yarı yüzen granül ana yem · 1000 ml / 440 g · ürün kodu 4052100 · ham protein %46, yağ %6, lif %1,8, kül %9,5, nem %8"],
  ],"2026-09-18"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/4493/jbl-granacichlid-click?country=gb",[
    ["GranaCichlid CLICK 100 ml","Arşiv ürün · 5–15 cm etçil cikletler için balık proteini ağırlıklı, yarı yüzen granül ana yem · Click dozaj kapağında bir basış yaklaşık 5 balık içindir · 100 ml / 44 g · ürün kodu 4065500 · ham protein %45, yağ %6, lif %5, kül %9,5, nem %8"],
    ["GranaCichlid CLICK 250 ml","Arşiv ürün · 5–15 cm etçil cikletler için balık proteini ağırlıklı, yarı yüzen granül ana yem · Click dozaj kapağında bir basış yaklaşık 5 balık içindir · 250 ml / 110 g · ürün kodu 4065600 · ham protein %45, yağ %6, lif %5, kül %9,5, nem %8"],
  ],"2026-09-18"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/2311/jbl-grana-cichlid?country=bg",[
    ["GranaCichlid 250 ml REFILL","Arşiv ürün · 5–15 cm etçil cikletler için balık proteini ağırlıklı, yarı yüzen granül ana yem refill paketi · 250 ml / 105 g · ürün kodu 4056200 · ham protein %45, yağ %6, lif %5, kül %9,5, nem %8"],
  ],"2026-09-18"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/3331/jbl-spirulina?country=jp",[
    ["Spirulina 100 ml","Arşiv ürün · 3–20 cm alg yiyen tatlı ve deniz suyu balıkları ile karidesler için orta ve üst su katmanlarında tüketilen pul ana yem · 100 ml / 16 g · ürün kodu 30004 · %40 Spirulina, %6 bütün karides ve %1 sarımsak · açıldıktan sonra 4 ay, kapalı ambalajda 3 yıl saklama"],
    ["Spirulina 250 ml","Eski Premium ürün · 3–20 cm alg yiyen tatlı ve deniz suyu balıkları ile karidesler için orta ve üst su katmanlarında tüketilen pul ana yem · 250 ml / 40 g · ürün kodu 30001 · %40 Spirulina, %6 bütün karides ve %1 sarımsak · resmî sayfada bu hacim arşiv etiketi taşımamaktadır"],
    ["Spirulina 1000 ml","Arşiv ürün · 3–20 cm alg yiyen tatlı ve deniz suyu balıkları ile karidesler için orta ve üst su katmanlarında tüketilen pul ana yem · 1000 ml / 160 g · ürün kodu 30002 · %40 Spirulina, %6 bütün karides ve %1 sarımsak"],
    ["Spirulina 5500 ml","Arşiv ürün · 3–20 cm alg yiyen tatlı ve deniz suyu balıkları ile karidesler için orta ve üst su katmanlarında tüketilen pul ana yem · 5500 ml / 950 g · ürün kodu 30003 · %40 Spirulina, %6 bütün karides ve %1 sarımsak"],
  ],"2026-09-18"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/4492/jbl-goldpearls-click?country=si",[
    ["GoldPearls CLICK 100 ml","Arşiv ürün · en az 8 cm Japon balıkları ve tül kuyruklar için hava yutmayı azaltan batan granül ana yem · Click dozaj kapağında bir basış yaklaşık 5 balık içindir · 100 ml / 58 g · ürün kodu 4063000 · ham protein %43, yağ %7,3, lif %1,9, kül %10,5, nem %8"],
    ["GoldPearls CLICK 250 ml","Arşiv ürün · en az 8 cm Japon balıkları ve tül kuyruklar için hava yutmayı azaltan batan granül ana yem · Click dozaj kapağında bir basış yaklaşık 5 balık içindir · 250 ml / 145 g · ham protein %43, yağ %7,3, lif %1,9, kül %10,5, nem %8"],
  ],"2026-09-18"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/2313/jbl-goldpearls?country=fr",[
    ["GoldPearls 100 ml","Eski Premium ürün · en az 8 cm Japon balıkları ve tül kuyruklar için hava yutmayı azaltan batan granül ana yem · 100 ml / 58 g · resmî sayfada bu hacim arşiv etiketi taşımamaktadır · ham protein %43, yağ %7,3, lif %1,9, kül %10,5, nem %8"],
    ["GoldPearls 250 ml","Arşiv ürün · en az 8 cm Japon balıkları ve tül kuyruklar için hava yutmayı azaltan batan granül ana yem · 250 ml / 145 g · ham protein %43, yağ %7,3, lif %1,9, kül %10,5, nem %8"],
    ["GoldPearls 1000 ml","Arşiv ürün · en az 8 cm Japon balıkları ve tül kuyruklar için hava yutmayı azaltan batan granül ana yem · 1000 ml / 580 g · ürün kodu 4063600 · ham protein %43, yağ %7,3, lif %1,9, kül %10,5, nem %8"],
  ],"2026-09-18"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/4491/jbl-goldpearls-mini-click?country=ee",[
    ["GoldPearls mini CLICK 100 ml","Arşiv ürün · en az 4 cm küçük Japon balıkları ve tül kuyruklar için alt su katmanına batan 1–2 mm ince granül ana yem · Click dozaj kapağında bir basış yaklaşık 5 balık içindir · 100 ml / 56 g · ürün kodu 4064300 · ham protein %38, yağ %4, lif %4,5, kül %10,5, nem %8"],
  ],"2026-09-18"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/2785/jbl-goldpearls-mini?country=dk",[
    ["GoldPearls mini 100 ml REFILL","Arşiv ürün · en az 4 cm küçük Japon balıkları ve tül kuyruklar için alt su katmanına batan 1–2 mm ince granül refill paketi · 100 ml / 56 g · ürün kodu 4064480 · ham protein %38, yağ %4, lif %4,5, kül %10,5, nem %8"],
  ],"2026-09-18"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/2314/jbl-tabis?country=hr&cpref=110",[
    ["Tabis 100 ml","Arşiv Premium yem · tüm akvaryum balıkları için cama hafifçe bastırılarak tutturulabilen tablet · 100 ml / 58 g · ürün kodu 4060000 · %10 derin deniz krili ve %6 Spirulina içerir; suyu kirleten bağlayıcı içermez · vatozlar, serbest yüzen balıklar ve üreticinin belirttiği salyangoz aileleri için uygundur · ham protein %46, yağ %6, lif %2,5, kül %11,2, nem %8 · açıldıktan sonra 4 ay, kapalı ambalajda 3 yıl saklama"],
    ["Tabis 250 ml","Arşiv Premium yem · tüm akvaryum balıkları için cama hafifçe bastırılarak tutturulabilen tablet · 250 ml / 160 g · resmî 2015 katalog kodu 40620 · %10 derin deniz krili ve %6 Spirulina içerir; suyu kirleten bağlayıcı içermez · vatozlar, serbest yüzen balıklar ve üreticinin belirttiği salyangoz aileleri için uygundur · ham protein %46, yağ %6, lif %2,5, kül %11,2, nem %8"],
  ],"2026-09-18"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/2103/jbl-novobel?country=gb",[
    ["NovoBel 100 ml","Arşiv Novo pul ana yem · 3–20 cm tropikal tatlı su balıkları için orta ve üst su katmanlarında tüketilen, 50 doğal ham maddeden oluşan 7 farklı pul · 100 ml / 18 g · açıldıktan sonra 4 ay, kapalı ambalajda 3 yıl saklama"],
    ["NovoBel 250 ml","Arşiv Novo pul ana yem · 3–20 cm tropikal tatlı su balıkları için orta ve üst su katmanlarında tüketilen, 50 doğal ham maddeden oluşan 7 farklı pul · 250 ml / 45 g · açıldıktan sonra 4 ay, kapalı ambalajda 3 yıl saklama"],
    ["NovoBel 1000 ml","Arşiv Novo pul ana yem · 3–20 cm tropikal tatlı su balıkları için orta ve üst su katmanlarında tüketilen, 50 doğal ham maddeden oluşan 7 farklı pul · 1000 ml / 190 g · açıldıktan sonra 4 ay, kapalı ambalajda 3 yıl saklama"],
    ["NovoBel 5500 ml","Arşiv Novo pul ana yem · 3–20 cm tropikal tatlı su balıkları için orta ve üst su katmanlarında tüketilen, 50 doğal ham maddeden oluşan 7 farklı pul · 5500 ml / 950 g · açıldıktan sonra 4 ay, kapalı ambalajda 3 yıl saklama"],
    ["NovoBel 10,5 L","Arşiv Novo pul ana yem · 3–20 cm tropikal tatlı su balıkları için orta ve üst su katmanlarında tüketilen, 50 doğal ham maddeden oluşan 7 farklı pul · 10,5 L / 1995 g · açıldıktan sonra 4 ay, kapalı ambalajda 3 yıl saklama"],
  ],"2026-09-18"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/2217/jbl-novobel-refill-pack?country=gb",[
    ["NovoBel Refill 750 ml","Arşiv NovoBel yedek ambalajı · boş 1 L JBL kutusuna yerleştirilebilen, 3–20 cm tropikal tatlı su balıkları için pul ana yem · 750 ml / 135 g · ürün kodu 3014100 · açıldıktan sonra 4 ay, kapalı ambalajda 3 yıl saklama"],
  ],"2026-09-18"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/3518/jbl-nanobel?country=gb",[
    ["NanoBel 60 ml","Arşiv Novo mini pul ana yem · 1–4 cm küçük tropikal tatlı su balıkları için tüm su katmanlarında tüketilen, 50'den fazla ham maddeden oluşan 7 farklı pul · 60 ml · eski katalog kodu 23171 · resmî kataloglarda net ağırlık 15 g ve 16 g olarak çeliştiğinden tek değer seçilmedi"],
  ],"2026-09-18"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/2218/jbl-novogrand?country=gb",[
    ["NovoGrand 1000 ml","Arşiv Novo iri pul ana yem · 10–25 cm büyük Güney Amerika cikletleri için · 1000 ml / 160 g · ürün kodu 3018000 · kapalı ambalaj raf ömrü 36 ay"],
    ["NovoGrand 12,5 L","Arşiv Novo iri pul ana yem · 10–25 cm büyük Güney Amerika cikletleri için · 12,5 L · ürün kodu 3018500 · resmî ürün veri sayfasında ağırlık 2200 g, net ağırlık 2100 g olarak çeliştiğinden tek değer seçilmedi · kapalı ambalaj raf ömrü 36 ay"],
  ],"2026-09-18"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/2219/jbl-novocolor?country=gb",[
    ["NovoColor 100 ml","Arşiv Novo renk pulu · 3–20 cm tropikal tatlı su balıkları için orta ve üst su katmanlarında renk gelişimini destekleyen 7 farklı pul · 100 ml / 18 g · ürün kodu 3015600 · ham protein %43, yağ %8,5, lif %1,9, kül %9, nem %8"],
    ["NovoColor 250 ml","Arşiv Novo renk pulu · 3–20 cm tropikal tatlı su balıkları için orta ve üst su katmanlarında renk gelişimini destekleyen 7 farklı pul · 250 ml / 45 g · ürün kodu 3015700 · ham protein %43, yağ %8,5, lif %1,9, kül %9, nem %8"],
  ],"2026-09-18"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/9122/jbl-novogranomix-xxs?country=se&cpref=742",[
    ["NovoGranoMix XXS 100 ml","Arşiv Novo granül ana yem · 1–3 cm çok küçük tropikal tatlı su balıkları için tüm su katmanlarında önce yüzen, sonra yavaşça batan mini granül · 100 ml / 58 g · ürün kodu 3136000 · ham protein %40, yağ %8, lif %3, kül %8, nem %8"],
  ],"2026-09-18"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/9124/jbl-novogranomix-xs?country=us",[
    ["NovoGranoMix XS 100 ml","Arşiv Novo granül ana yem · 3–5 cm küçük tropikal tatlı su balıkları için tüm su katmanlarında önce yüzen, sonra yavaşça batan mini granül · 100 ml · ürün kodu 3136300 · resmî sayfada net ağırlık yayımlanmadığı için fiyat/birim fiyattan türetilmedi · ham protein %40, yağ %8, lif %3, kül %8, nem %8"],
  ],"2026-09-18"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/2220/jbl-novogranomix-mini-click?country=fi",[
    ["NovoGranoMix mini CLICK 100 ml","Arşiv Novo granül ana yem · 3–10 cm küçük balıklar için tüm su katmanlarında yüzen ve batan granül · Click dozaj kapağında bir basış yaklaşık 5 balık içindir · 100 ml / 42 g · ürün kodu 3010000"],
  ],"2026-09-18"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/2221/jbl-novogranomix-mini?country=eg&cpref=998",[
    ["NovoGranoMix mini 100 ml REFILL","Arşiv Novo granül ana yem · 3–10 cm küçük balıklar için tüm su katmanlarında yüzen ve batan granül refill paketi · Click kapağıyla uyumludur · 100 ml / 42 g · ürün kodu 3009900"],
    ["NovoGranoMix mini 5500 ml","Arşiv Novo granül ana yem · 3–10 cm küçük balıklar için tüm su katmanlarında yüzen ve batan granül büyük ambalaj · 5500 ml / 2400 g · ürün kodu 3011100"],
  ],"2026-09-18"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/3520/jbl-nanomix?country=gb",[
    ["NanoMix 60 ml","Arşiv Novo nano granül ana yem · 1–4 cm küçük tropikal tatlı su balıkları için tüm su katmanlarında yüzen ve batan dört granül çeşidi · 60 ml / 32 g · ürün kodu 23174 · 60 ml ambalaj üreticiye göre 60 L akvaryuma yaklaşık üç ay yeter"],
  ],"2026-09-18"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/2222/jbl-novogranocolor-mini-click?country=my",[
    ["NovoGranoColor mini CLICK 100 ml","Arşiv Novo renk granülü · 3–10 cm küçük tropikal tatlı su balıkları için tüm su katmanlarında yüzen ve batan granül · Click dozaj kapağında bir basış yaklaşık 5 balık içindir · 100 ml / 43 g · ürün kodu 3009800 · ham protein %40, yağ %7, lif %3, kül %7, nem %8"],
  ],"2026-09-18"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/2223/jbl-novogranocolor-mini?country=fo&cpref=112",[
    ["NovoGranoColor mini 100 ml REFILL","Arşiv Novo renk granülü · 3–10 cm küçük tropikal tatlı su balıkları için tüm su katmanlarında yüzen ve batan granül refill paketi · Click kapağıyla uyumludur · 100 ml / 43 g · ürün kodu 3009700 · ham protein %40, yağ %7, lif %3, kül %7, nem %8"],
  ],"2026-09-18"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/2224/jbl-novogranomix-click?country=gb",[
    ["NovoGranoMix CLICK 250 ml","Arşiv Novo granül ana yem · 6–15 cm orta ve büyük tropikal tatlı su balıkları için tüm su katmanlarında yüzen ve batan granül · Click dozaj kapağında bir basış yaklaşık 5 balık içindir · 250 ml / 115 g · ürün kodu 3010100"],
  ],"2026-09-18"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/2225/jbl-novogranomix?country=ee",[
    ["NovoGranoMix 250 ml REFILL","Arşiv Novo granül ana yem · 6–15 cm orta ve büyük tropikal tatlı su balıkları için tüm su katmanlarında yüzen ve batan granül refill paketi · 250 ml / 110 g · ürün kodu 3010200 · Click kapağıyla uyumludur"],
  ],"2026-09-18"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/2226/jbl-novogranocolor-click?country=gr",[
    ["NovoGranoColor CLICK 250 ml","Arşiv Novo renk granülü · 6–15 cm orta ve büyük tropikal tatlı su balıkları için tüm su katmanlarında yüzen ve batan granül · Click dozaj kapağında bir basış yaklaşık 5 balık içindir · 250 ml · ürün kodu 3010400 · resmî ürün sayfasında ağırlık 107 g, net ağırlık 118 g olarak çeliştiğinden tek değer seçilmedi"],
  ],"2026-09-18"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/2227/jbl-novogranocolor?country=mt",[
    ["NovoGranoColor 250 ml REFILL","Arşiv Novo renk granülü · 6–15 cm orta ve büyük tropikal tatlı su balıkları için tüm su katmanlarında yüzen ve batan granül refill paketi · 250 ml · ürün kodu 3010500 · resmî ürün sayfasında ağırlık 120 g, net ağırlık 118 g olarak çeliştiğinden tek değer seçilmedi · Click kapağıyla uyumludur"],
  ],"2026-09-18"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/2228/jbl-novobits-click?country=cy",[
    ["NovoBits CLICK 250 ml","Arşiv Novo discus granülü · 6–15 cm discus ve diğer seçici tropikal tatlı su balıkları için yarı yüzen ana yem · Click dozaj kapağında bir basış yaklaşık 5 balık içindir · 250 ml / 100 g · ürün kodu 3031340 · ham protein %43, yağ %6, lif %3, kül %10, nem %8"],
  ],"2026-09-18"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/4340/jbl-novobits?country=fi",[
    ["NovoBits 250 ml REFILL","Arşiv Novo discus granülü · discus ve diğer seçici tropikal tatlı su balıkları için yarı yüzen ana yem refill paketi · 250 ml / 100 g · eski katalog kodu 30314 · Click kapağıyla uyumludur · ham protein %43, yağ %6, lif %3, kül %10, nem %8"],
    ["NovoBits 1000 ml","Arşiv Novo discus granülü · discus ve diğer seçici tropikal tatlı su balıkları için yarı yüzen ana yem · 1000 ml / 450 g · eski katalog kodu 30315; resmî ürün sayfasındaki daha yeni ürün kodu 3031540 · ham protein %43, yağ %6, lif %3, kül %10, nem %8"],
    ["NovoBits 12,5 L","Arşiv Novo discus granülü · discus ve diğer seçici tropikal tatlı su balıkları için yarı yüzen eski büyük ambalaj · 12,5 L / 5500 g · eski katalog kodu 30316 · ham protein %43, yağ %6, lif %3, kül %10, nem %8"],
    ["NovoBits 10,5 L","Arşiv Novo discus granülü · 8–20 cm discus balıkları için yarı yüzen daha yeni büyük ambalaj · 10,5 L / 4620 g · ürün kodu 3031810 · ham protein %43, yağ %6, lif %3, kül %10, nem %8"],
  ],"2026-09-18"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/2229/jbl-novofil?country=au",[
    ["NovoFil 100 ml","Arşiv Novo doğal yemi · 5–20 cm seçici tropikal tatlı su balıkları ve su kaplumbağaları için vakumda dondurularak kurutulmuş kırmızı sivrisinek larvası destek yemi · 100 ml / 8 g · ürün kodu 3026000 · ham protein %55, yağ %13, lif %7, kül %9"],
    ["NovoFil 250 ml","Arşiv Novo doğal yemi · 5–20 cm seçici tropikal tatlı su balıkları ve su kaplumbağaları için vakumda dondurularak kurutulmuş kırmızı sivrisinek larvası destek yemi · 250 ml / 20 g · ürün kodu 3027000 · ham protein %55, yağ %13, lif %7, kül %9"],
  ],"2026-09-19"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/2230/jbl-novofex?country=si",[
    ["NovoFex 100 ml","Arşiv Novo doğal yemi · 5–20 cm tropikal tatlı su balıkları ve su kaplumbağaları için vakumda dondurularak kurutulmuş Tubifex küpleri · 100 ml / 10 g · ürün kodu 3062000 · ham protein %60, yağ %12, lif %2, kül %8"],
    ["NovoFex 250 ml","Arşiv Novo doğal yemi · 5–20 cm tropikal tatlı su balıkları ve su kaplumbağaları için vakumda dondurularak kurutulmuş Tubifex küpleri · 250 ml / 30 g · ürün kodu 3063000 · ham protein %60, yağ %12, lif %2, kül %8"],
  ],"2026-09-19"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/2231/jbl-novodaph?country=ca",[
    ["NovoDaph 100 ml","Arşiv Novo doğal yemi · 3–15 cm tropikal tatlı su balıkları ve su kaplumbağaları için sindirimi destekleyen, vakumda dondurularak kurutulmuş Daphnia destek yemi · 100 ml / 9 g · ürün kodu 3070000 · ham protein %50, yağ %10, lif %2, kül %18"],
  ],"2026-09-19"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/5983/jbl-novoartemio?country=ee",[
    ["NovoArtemio 100 ml","Arşiv Novo doğal yemi · 3–20 cm tropikal tatlı ve deniz suyu balıkları için dondurularak kurutulmuş Artemia destek yemi · 100 ml / 6 g · ürün kodu 3026300 · ham protein %48,6, yağ %4,8, lif %1,2, kül %16,6"],
    ["NovoArtemio 250 ml","Arşiv Novo doğal yemi · 3–20 cm tropikal tatlı ve deniz suyu balıkları için dondurularak kurutulmuş Artemia destek yemi · 250 ml / 18 g · ürün kodu 3026400 · ham protein %48,6, yağ %4,8, lif %1,2, kül %16,6"],
  ],"2026-09-19"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/2301/jbl-novotab?country=ie",[
    ["NovoTab 100 ml","Arşiv Novo tablet ana yem · 3–20 cm tatlı su balıkları ve dip balıkları için akvaryum camına yapıştırılabilen tablet · 100 ml / 60 g · ham protein %43, yağ %8, lif %1,9, kül %8,1, nem %8"],
    ["NovoTab 250 ml","Arşiv Novo tablet ana yem · 3–20 cm tatlı su balıkları ve dip balıkları için akvaryum camına yapıştırılabilen tablet · 250 ml / 160 g · ürün kodu 3024000 · ham protein %43, yağ %8, lif %1,9, kül %8,1, nem %8"],
    ["NovoTab 1000 ml","Arşiv Novo tablet ana yem · 3–20 cm tatlı su balıkları ve dip balıkları için akvaryum camına yapıştırılabilen tablet · 1000 ml / 640 g · ham protein %43, yağ %8, lif %1,9, kül %8,1, nem %8"],
    ["NovoTab 10,5 L","Arşiv Novo tablet ana yem · 3–20 cm tatlı su balıkları ve dip balıkları için akvaryum camına yapıştırılabilen büyük ambalaj · 10,5 L / 5880 g · ham protein %43, yağ %8, lif %1,9, kül %8,1, nem %8"],
  ],"2026-09-19"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/2303/jbl-novopleco?country=se",[
    ["NovoPleco 100 ml","Arşiv Novo vatoz yemi · 5–20 cm küçük ve orta vatozlar için odun lifi, Spirulina ve bitkisel içerik taşıyan batan wafer · 100 ml / 53 g · ürün kodu 3031010 · ham protein %32, yağ %8, lif %13, kül %10, nem %8"],
    ["NovoPleco 250 ml","Arşiv Novo vatoz yemi · 5–20 cm küçük ve orta vatozlar için odun lifi, Spirulina ve bitkisel içerik taşıyan batan wafer · 250 ml / 133 g · ürün kodu 3031100 · ham protein %32, yağ %8, lif %13, kül %10, nem %8"],
    ["NovoPleco 1000 ml","Arşiv Novo vatoz yemi · 5–20 cm küçük ve orta vatozlar için odun lifi, Spirulina ve bitkisel içerik taşıyan batan wafer · 1000 ml / 530 g · ham protein %32, yağ %8, lif %13, kül %10, nem %8"],
    ["NovoPleco 5500 ml","Arşiv Novo vatoz yemi · 5–20 cm küçük ve orta vatozlar için odun lifi, Spirulina ve bitkisel içerik taşıyan batan wafer büyük ambalajı · 5500 ml / 2900 g · ürün kodu 3030900 · ham protein %32, yağ %8, lif %13, kül %10, nem %8"],
  ],"2026-09-19"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/3511/jbl-nanotabs?country=us",[
    ["NanoTabs 60 ml","Arşiv Novo nano tablet yemi · karidesler ve cüce kerevitler için pençeyle tutulabilen, batan sert tablet · 60 ml / 36 g · ürün kodu 2317700 · günlük 20–30 karidese bir tablet doz önerisi"],
  ],"2026-09-19"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/2302/jbl-novofect?country=dk",[
    ["NovoFect 100 ml","Arşiv Novo bitkisel tablet ana yem · 3–20 cm bitkisel beslenen tatlı su balıkları ve karidesler için cama yapıştırılabilen tablet · 100 ml / 58 g · ürün kodu 3024700 · ham protein %35, yağ %5, lif %5, kül %8, nem %8"],
    ["NovoFect 250 ml","Arşiv Novo bitkisel tablet ana yem · 3–20 cm bitkisel beslenen tatlı su balıkları ve karidesler için cama yapıştırılabilen tablet · 250 ml / 150 g · ham protein %35, yağ %5, lif %5, kül %8, nem %8"],
    ["NovoFect 1000 ml","Arşiv Novo bitkisel tablet ana yem · 3–20 cm bitkisel beslenen tatlı su balıkları ve karidesler için cama yapıştırılabilen tablet · 1000 ml / 640 g · ham protein %35, yağ %5, lif %5, kül %8, nem %8"],
    ["NovoFect 10,5 L","Arşiv Novo bitkisel tablet ana yem · 3–20 cm bitkisel beslenen tatlı su balıkları ve karidesler için cama yapıştırılabilen büyük ambalaj · 10,5 L / 5880 g · ham protein %35, yağ %5, lif %5, kül %8, nem %8"],
  ],"2026-09-19"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/3294/jbl-novopleco-xl?country=us",[
    ["NovoPleco XL 250 ml","Arşiv Novo XL vatoz yemi · 12–50 cm büyük vatozlar için odun lifi, Spirulina ve bitkisel içerik taşıyan sert batan wafer · 250 ml / 125 g · ürün kodu 3034100 · ham protein %32, yağ %8, lif %13, kül %10, nem %8"],
    ["NovoPleco XL 1000 ml","Arşiv Novo XL vatoz yemi · 12–50 cm büyük vatozlar için odun lifi, Spirulina ve bitkisel içerik taşıyan sert batan wafer · 1000 ml / 500 g · ham protein %32, yağ %8, lif %13, kül %10, nem %8"],
    ["NovoPleco XL 5500 ml","Arşiv Novo XL vatoz yemi · 12–50 cm büyük vatozlar için odun lifi, Spirulina ve bitkisel içerik taşıyan sert batan wafer büyük ambalajı · 5500 ml / 2750 g · ham protein %32, yağ %8, lif %13, kül %10, nem %8"],
  ],"2026-09-19"),
  ...products("JBL","food","https://www.jbl.de/qr/30096",[
    ["NovoGranoVert mini CLICK 100 ml","Arşiv Novo otçul granül ana yem · 3–10 cm tropikal tatlı su balıkları ve karidesler için tüm su katmanlarında yüzen ve batan bitkisel granül · Click kapağında bir basış yaklaşık 5 balık içindir · 100 ml / 40 g · eski katalog kodu 30096 · %79 bitkisel bileşen ve %5 Spirulina · ham protein %35, yağ %5,5, lif %6, kül %8, nem %8"],
  ],"2026-09-19"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/3613/jbl-novogranovert-mini?country=mu",[
    ["NovoGranoVert mini 100 ml REFILL","Arşiv Novo otçul granül ana yem · 3–10 cm tropikal tatlı su balıkları ve karidesler için tüm su katmanlarında yüzen ve batan bitkisel granül refill paketi · Click kapağıyla uyumludur · 100 ml / 40 g · ürün kodu 3009500 · %79 bitkisel bileşen ve %5 Spirulina · ham protein %35, yağ %5,5, lif %6, kül %8, nem %8"],
  ],"2026-09-19"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/2232/jbl-novovert?country=ee",[
    ["NovoVert 100 ml","Arşiv Novo otçul pul ana yem · 3–20 cm bitkisel beslenen tatlı su balıkları ve karidesler için orta ve üst su katmanlarında tüketilen Spirulinalı pul · 100 ml / 16 g · ürün kodu 3019000 · %76 bitkisel bileşen ve %10 Spirulina · ham protein %32, yağ %5,3, lif %3, kül %8,5, nem %8"],
    ["NovoVert 250 ml","Arşiv Novo otçul pul ana yem · 3–20 cm bitkisel beslenen tatlı su balıkları ve karidesler için orta ve üst su katmanlarında tüketilen Spirulinalı pul · 250 ml / 40 g · ürün kodu 3019580 · %76 bitkisel bileşen ve %10 Spirulina · ham protein %32, yağ %5,3, lif %3, kül %8,5, nem %8"],
  ],"2026-09-19"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/2917/jbl-novoguppy?country=no",[
    ["NovoGuppy 100 ml","Arşiv Novo canlı doğuran pulu · 3–10 cm guppy, platy ve diğer canlı doğuran balıklar için orta ve üst su katmanlarında tüketilen, renk gelişimini destekleyen pul ana yem · 100 ml / 21 g · %7 Spirulina · ham protein %36, yağ %5,5, lif %2,5, kül %8,5, nem %8"],
    ["NovoGuppy 250 ml","Arşiv Novo canlı doğuran pulu · 3–10 cm guppy, platy ve diğer canlı doğuran balıklar için orta ve üst su katmanlarında tüketilen, renk gelişimini destekleyen pul ana yem · 250 ml / 58 g · ürün kodu 3017600 · %7 Spirulina · ham protein %36, yağ %5,5, lif %2,5, kül %8,5, nem %8"],
  ],"2026-09-19"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/2288/jbl-novostick-m?country=ph",[
    ["NovoStick M 250 ml","Arşiv Novo ciklet yemi · 10–25 cm etçil cikletler için orta ve üst su katmanlarında tüketilen, balık eti ağırlıklı yem çubuğu · 250 ml / 110 g · ürün kodu 3028900 · ham protein %44, yağ %8, lif %1,5, kül %10, nem %8"],
    ["NovoStick M 1000 ml","Arşiv Novo ciklet yemi · 10–25 cm etçil cikletler için orta ve üst su katmanlarında tüketilen, balık eti ağırlıklı yem çubuğu · 1000 ml / 440 g · ham protein %44, yağ %8, lif %1,5, kül %10, nem %8"],
    ["NovoStick M 5500 ml","Arşiv Novo ciklet yemi · 10–25 cm etçil cikletler için orta ve üst su katmanlarında tüketilen, balık eti ağırlıklı yem çubuğu büyük ambalajı · 5500 ml / 2530 g · ham protein %44, yağ %8, lif %1,5, kül %10, nem %8"],
  ],"2026-09-19"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/2774/jbl-novostick-xl?country=id",[
    ["NovoStick XL 1000 ml","Arşiv Novo XL ciklet yemi · 15–35 cm büyük etçil cikletler için tüm su katmanlarında tüketilen, su canlılarından protein ve yağ içeren yem çubuğu · 1000 ml / 400 g · ürün kodu 3028100 · ham protein %44, yağ %8, lif %1,5, kül %10, nem %8"],
    ["NovoStick XL 5500 ml","Arşiv Novo XL ciklet yemi · 15–35 cm büyük etçil cikletler için tüm su katmanlarında tüketilen, su canlılarından protein ve yağ içeren yem çubuğu büyük ambalajı · 5500 ml / 2200 g · ham protein %44, yağ %8, lif %1,5, kül %10, nem %8"],
  ],"2026-09-19"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/3286/jbl-novotanganjika?country=bg",[
    ["NovoTanganjika 250 ml","Arşiv Novo ciklet pulu · 5–20 cm etçil Tanganika ve Malawi cikletleri için balık eti ve plankton canlıları ağırlıklı pul ana yem · 250 ml / 45 g · ürün kodu 3002000 · ham protein %43, yağ %8,3, lif %1,5, kül %8, nem %8"],
    ["NovoTanganjika 1000 ml","Arşiv Novo ciklet pulu · 5–20 cm etçil Tanganika ve Malawi cikletleri için balık eti ve plankton canlıları ağırlıklı pul ana yem · 1000 ml / 190 g · ürün kodu 3002100 · ham protein %43, yağ %8,3, lif %1,5, kül %8, nem %8"],
    ["NovoTanganjika 5500 ml","Arşiv Novo ciklet pulu · 5–20 cm etçil Tanganika ve Malawi cikletleri için balık eti ve plankton canlıları ağırlıklı pul ana yem büyük ambalajı · 5500 ml / 950 g · ham protein %43, yağ %8,3, lif %1,5, kül %8, nem %8"],
  ],"2026-09-19"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/3290/jbl-novomalawi?country=gi",[
    ["NovoMalawi 250 ml","Arşiv Novo ciklet pulu · 5–20 cm alg tabakası kazıyan Malawi ve Tanganika cikletleri için alg ve mikroorganizma odaklı pul ana yem · 250 ml / 40 g · ürün kodu 3001000 · ham protein %36, yağ %6, lif %1,1, kül %7, nem %8"],
    ["NovoMalawi 1000 ml","Arşiv Novo ciklet pulu · 5–20 cm alg tabakası kazıyan Malawi ve Tanganika cikletleri için alg ve mikroorganizma odaklı pul ana yem · 1000 ml / 156 g · ürün kodu 3001100 · ham protein %36, yağ %6, lif %1,1, kül %7, nem %8"],
    ["NovoMalawi 5500 ml","Arşiv Novo ciklet pulu · 5–20 cm alg tabakası kazıyan Malawi ve Tanganika cikletleri için alg ve mikroorganizma odaklı pul ana yem büyük ambalajı · 5500 ml / 860 g · ham protein %36, yağ %6, lif %1,1, kül %7, nem %8"],
  ],"2026-09-19"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/2289/jbl-novorift?country=ua",[
    ["NovoRift 250 ml","Arşiv Novo ciklet yemi · 10–25 cm alg tabakası kazıyan Malawi ve Tanganika cikletleri için Spirulina içeren, tüm su katmanlarında tüketilen yem çubuğu · 250 ml / 133 g · ürün kodu 3029300 · ham protein %30, yağ %9, lif %6, kül %8, nem %8"],
    ["NovoRift 1000 ml","Arşiv Novo ciklet yemi · 10–25 cm alg tabakası kazıyan Malawi ve Tanganika cikletleri için Spirulina içeren, tüm su katmanlarında tüketilen yem çubuğu · 1000 ml / 530 g · ürün kodu 3029500 · ham protein %30, yağ %9, lif %6, kül %8, nem %8"],
    ["NovoRift 5500 ml","Arşiv Novo ciklet yemi · 10–25 cm alg tabakası kazıyan Malawi ve Tanganika cikletleri için Spirulina içeren, tüm su katmanlarında tüketilen yem çubuğu büyük ambalajı · 5500 ml / 2750 g · ham protein %30, yağ %9, lif %6, kül %8, nem %8"],
  ],"2026-09-19"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/2290/jbl-novoflower-mini?country=us",[
    ["NovoFlower mini 250 ml","Arşiv Novo Flowerhorn granülü · 12 cm'ye kadar küçük ve orta Flowerhorn cikletleri için yüksek astaksantinli granül ana yem · 250 ml / 110 g · ürün kodu 3031740 · ham protein %46, yağ %6, lif %1,8, kül %9,5, nem %8 · kapalı ambalaj raf ömrü 4 yıl"],
  ],"2026-09-19"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/2291/jbl-novoflower-maxi?country=us",[
    ["NovoFlower maxi 1000 ml","Arşiv Novo Flowerhorn çubuğu · 15 cm ve üzeri büyük Flowerhorn cikletleri için yüksek astaksantinli yem çubuğu · 1000 ml / 440 g · ürün kodu 3032040 · ham protein %44, yağ %8, lif %1, kül %10, nem %8 · kapalı ambalaj raf ömrü 4 yıl"],
  ],"2026-09-19"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/2292/jbl-novored?country=ba",[
    ["NovoRed 100 ml","Arşiv Novo Japon balığı yemi · 5–20 cm Japon balıkları ve tül kuyruklar için orta/üst su katmanında tüketilen, %70 bitkisel içerikli pul ana yem · 100 ml / 18 g · ürün kodu 3019900 · ham protein %35, yağ %5,5, lif %3, kül %10, nem %8"],
    ["NovoRed 250 ml","Arşiv Novo Japon balığı yemi · 5–20 cm Japon balıkları ve tül kuyruklar için orta/üst su katmanında tüketilen, %70 bitkisel içerikli pul ana yem · 250 ml / 45 g · ürün kodu 3020000 · ham protein %35, yağ %5,5, lif %3, kül %10, nem %8"],
    ["NovoRed 1000 ml","Arşiv Novo Japon balığı yemi · 5–20 cm Japon balıkları ve tül kuyruklar için orta/üst su katmanında tüketilen, %70 bitkisel içerikli pul ana yem · 1000 ml / 190 g · ürün kodu 3022000 · ham protein %35, yağ %5,5, lif %3, kül %10, nem %8"],
  ],"2026-09-19"),
  ...products("JBL","food","https://www.jbl.de/fr/produits/detail/4406/jbl-novored-recharge?country=fr&cpref=338",[
    ["NovoRed Refill 750 ml","Arşiv Novo Japon balığı yemi ekonomik dolumu · NovoRed 1000 ml kutusuna yerleştirilen, yem içeriği NovoRed ile aynı dolum paketi · 750 ml / 130 g · ürün kodu 3022180 · ham protein %35, yağ %5,5, lif %3, kül %10, nem %8"],
  ],"2026-09-19"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/4498/jbl-novopearl-click?country=us",[
    ["NovoPearl CLICK 100 ml","Arşiv Novo Japon balığı yemi · en az 8 cm Japon balıkları, tül kuyruklar ve Shubunkin için yüzen inci biçimli, %53 bitkisel içerikli ana yem · Click dozaj kapağıyla bir basış beş balık içindir · 100 ml / 37 g · ürün kodu 3030300"],
    ["NovoPearl 100 ml REFILL","Arşiv Novo Japon balığı yemi · en az 8 cm Japon balıkları, tül kuyruklar ve Shubunkin için yüzen inci biçimli, %53 bitkisel içerikli ana yem · Click kapağıyla uyumlu dolum kutusu · 100 ml / 37 g · ürün kodu 3029900"],
    ["NovoPearl 250 ml","Arşiv Novo Japon balığı yemi · en az 8 cm Japon balıkları, tül kuyruklar ve Shubunkin için yüzen inci biçimli, %53 bitkisel içerikli ana yem · 250 ml / 93 g · ürün kodu 3030000"],
  ],"2026-09-19"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/2781/jbl-novocrabs?country=hu",[
    ["NovoCrabs 100 ml","Arşiv Novo kabuklu yemi · 5–20 cm kerevit ve yengeçler için batan, 24 saate kadar dağılmayan ve kabuk değişimini destekleyen yüksek selülozlu yem tableti · 100 ml / 49 g · ürün kodu 3027300 · ham protein %35, yağ %5, lif %10, kül %12, nem %8"],
    ["NovoCrabs 250 ml","Arşiv Novo kabuklu yemi · 5–20 cm kerevit ve yengeçler için batan, 24 saate kadar dağılmayan ve kabuk değişimini destekleyen yüksek selülozlu yem tableti · 250 ml / 123 g · ürün kodu 3027200 · ham protein %35, yağ %5, lif %10, kül %12, nem %8"],
  ],"2026-09-19"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/3514/jbl-nanocrabs?country=gb",[
    ["NanoCrabs 60 ml","Arşiv Novo nano kabuklu yemi · 5–20 cm cüce kerevit ve yengeçler için batan, yüksek selülozlu ve suda dağılmayan mini yem tableti · 60 ml / 32 g · ürün kodu 2318000 · üreticinin 2015 kataloğuna göre 60 litrelik akvaryumda yaklaşık üç aylık paket"],
  ],"2026-09-19"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/4499/jbl-novoprawn-click?country=fr",[
    ["NovoPrawn CLICK 100 ml","Arşiv Novo karides yemi · 2–10 cm karidesler için yüzen ve batan, %20 ısırgan ve %5 Spirulina içeren 2–3 mm granül ana yem · Click dozaj kapaklı 100 ml / 58 g · ürün kodu 3027400 · günde hayvan başına boyuna göre 1–2 granül · ham protein %37, yağ %5, lif %10, kül %12, nem %8"],
  ],"2026-09-19"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/2783/jbl-novoprawn?country=gb",[
    ["NovoPrawn 100 ml REFILL","Arşiv Novo karides yemi · NovoPrawn CLICK ile aynı içerikte, Click kapağıyla uyumlu 2–10 cm karides granülü · 100 ml / 58 g · ürün kodu 3027600 · günde hayvan başına boyuna göre 1–2 granül · ham protein %37, yağ %5, lif %10, kül %12, nem %8"],
    ["NovoPrawn 250 ml","Arşiv Novo karides yemi · NovoPrawn CLICK ile aynı içerikte, 2–10 cm karidesler için yüzen ve batan granül ana yem · 250 ml / 145 g · ürün kodu 3027700 · günde hayvan başına boyuna göre 1–2 granül · ham protein %37, yağ %5, lif %10, kül %12, nem %8"],
  ],"2026-09-19"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/3516/jbl-nanoprawn?country=gb",[
    ["NanoPrawn 60 ml","Arşiv Novo nano karides yemi · 2–10 cm cüce karidesler için yüzen ve batan, suda dağılmayan granül ana yem · 60 ml / 35 g · ürün kodu 2318300 · günde hayvan başına boyuna göre 1–2 granül"],
  ],"2026-09-19"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/3439/jbl-novodragon-shrimp?country=ie",[
    ["NovoDragon Shrimp 1000 ml","Arşiv Novo özel yemi · en az 15 cm arowanalar için %8 karidesli, yüzen ve solucan biçimli yem çubuğu · 1000 ml · ürün kodu 3028340 · 2015 resmî katalogda 440 g; daha yeni resmî mağaza sayfası erişilebilir ayrıntıda net ağırlığı yayımlamadığından tek güncel ağırlık gibi sunulmaz · ham protein %44, yağ %8, lif %1,5, kül %10, nem %8"],
  ],"2026-09-19"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/2915/jbl-novobetta?country=ca",[
    ["NovoBetta 100 ml","Arşiv Novo özel yemi · 3–10 cm betta ve diğer labirentli balıklar için pul ana yem · 100 ml / 20 g · ürün kodu 3017100 · günde 1–2 kez birkaç dakikada tüketilecek kadar; büyüyen gençlerde 3–4 kez · 2015 resmî katalogdaki 25 g eski nesil bilgisi güncel doğrudan sayfadaki 20 g ile değiştirilmeden nesil farkı olarak korunur"],
  ],"2026-09-19"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/4232/jbl-nanogranobetta?country=ee",[
    ["NanoGranoBetta 60 ml","Arşiv Novo özel yemi · küçükten yetişkine bettalar için ağız boyuna uygun, yüzen mini granül · 60 ml · ürün kodu 2318800 · ham protein %40, yağ %7, lif %3, kül %7 · günde 2–3 kez birkaç dakikada tüketilecek kadar; üreticinin ürün metnindeki hayvan başına 1–2 inci ifadesi betta besleme talimatıyla çeliştiğinden otomatik doz olarak kullanılmaz"],
  ],"2026-09-19"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/4019/jbl-nanobetta?country=be",[
    ["NanoBetta 60 ml","Arşiv Novo nano betta yemi · 3–10 cm bettalar için doz kaşıklı pul ana yem · 60 ml · ürün kodu 2317300 · resmî katalog nesillerinde 12 g ve 15 g yayımlandığından tek kesin net ağırlık seçilmez · 60 L akvaryum için yaklaşık üç aylık paket · günde 2–3 kez birkaç dakikada tüketilecek kadar"],
  ],"2026-09-19"),
  ...products("JBL","food","https://www.jbl.de/en/download/11627/Allgemein/JBL_Hauptkatalog_fr.pdf",[
    ["NovoLotl 250 ml","Arşiv Novo özel yemi · 10–25 cm genç aksolotl ve diğer sucul amfibiler için batan, suda dağılmayan 3 mm yem incisi · 250 ml / 150 g · eski ürün kodu 3035300 · %5 Spirulina ve 3,6:1 protein/yağ oranı · üreticinin 2015 resmî kataloğundaki eski reçete; NovoLotl M ile aynı ürün gibi birleştirilmez"],
  ],"2026-09-19"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/8246/jbl-novolotl-m?country=is",[
    ["NovoLotl M 250 ml","Arşiv Novo özel yemi · 8–20 cm aksolotl, semender ve Afrika cüce kurbağaları için batan 3 mm yem incisi · 250 ml / 150 g · ürün kodu 3035480 · 100 L akvaryumda yaklaşık 50 günlük paket · ham protein %54, yağ %12, lif %2, kül %10, nem %8 · günde 1–2 kez yaklaşık 30 dakikada tüketilecek kadar"],
  ],"2026-09-19"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/8248/jbl-novolotl-xl?country=gr",[
    ["NovoLotl XL 250 ml","Arşiv Novo özel yemi · 18 cm ve üzeri aksolotl ve semenderler için batan 5 mm granül · 250 ml / 150 g · güncel arşiv ürün kodu 3035900; eski resmî katalogdaki 3035800 önceki nesildir · 100 L akvaryumda yaklaşık 50 günlük paket · günde 1–2 kez yaklaşık 30 dakikada tüketilecek kadar · resmî sitemapte yinelenen ad tek kayıt olarak tutulur"],
  ],"2026-09-19"),
  ...products("JBL","food","https://www.jbl.de/en/download/11627/Allgemein/JBL_Hauptkatalog_fr.pdf",[
    ["Holiday 1 blok / 43 g","Eski Novo tatil yemi · yaklaşık 25 orta boy akvaryum balığı için yaklaşık iki haftalık tek yem bloğu · 43 g · eski ürün kodu 4031000 · blok yalnız balıklar yedikçe çözünür; kalsiyum sülfat/alçı taşıyıcı akvaryum canlıları için üretici tarafından zararsız olarak açıklanır · daha az balık veya daha kısa süre için blok bölünebilir"],
    ["Holiday Red 3 blok / 17 g","Arşiv Novo tatil yemi · Japon balığı, fantail ve benzer soğuk su balıkları için üç yem bloğu · toplam 17 g · eski ürün kodu 4032100 · her blok 1–3 Japon balığını 4–6 gün besler · kalsiyum sülfat kaplama çözünürken suya, bitkilere ve mikroorganizmalara zarar vermeyecek biçimde açıklanır"],
    ["Weekend 4 blok / 20 g","Arşiv Novo hafta sonu yemi · yaklaşık 15 orta boy akvaryum balığı için üçer günlük dört yem bloğu · toplam 20 g · eski ürün kodu 4032000 · blok yalnız balıklar yedikçe çözünür; daha az balık veya daha kısa süre için bölünebilir"],
  ],"2026-09-19"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/2294/jbl-novobea?country=ba",[
    ["NovoBea 100 ml","Arşiv Novo yavru yemi · 1–5 cm küçük balıklar ve yavrular için orta/üst su katmanında kullanılan, 52 doğal hammaddenin yedi pul çeşidinde sunulduğu ana yem · 100 ml / 28 g · ürün kodu 3016000"],
  ],"2026-09-19"),
  ...products("JBL","food","https://www.jbl.de/en/download/11627/Allgemein/JBL_Hauptkatalog_fr.pdf",[
    ["NovoBea 12,5 L","Arşiv Novo yavru yemi · 1–5 cm küçük balıklar ve yavrular için orta/üst su katmanında kullanılan, 52 doğal hammaddenin yedi pul çeşidinde sunulduğu büyük ambalaj · 12,5 L / 4000 g · eski ürün kodu 3016500"],
  ],"2026-09-19"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/2295/jbl-novotom-artemia?country=mu",[
    ["NovoTom Artemia 100 ml","Arşiv Novo yavru yemi · 5–10 mm canlı doğuran yavrular ile daha büyük yumurtlayan tür yavruları için Artemia bileşenli, üst ve orta su katmanına yayılan toz ana yem · 100 ml / 60 g · ürün kodu 3025300 · ham protein %43, yağ %8,5, lif %1,9, kül %9, nem %8"],
  ],"2026-09-19"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/2296/jbl-novobaby?country=ba",[
    ["NovoBaby 3 × 10 ml","Arşiv Novo yavru yemi seti · canlı doğuran balık yavruları için üç parçacık boyu: yeni doğandan 15 mm'ye kadar, yaklaşık 15–30 mm ve 30 mm üzeri · toplam 30 ml / 18 g · ürün kodu 3025400 · günde 3–4 kez yaklaşık beş dakikada tüketilecek kadar verilir; artık yem günlük uzaklaştırılır"],
  ],"2026-09-19"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/2297/jbl-nobilfluid-artemia?country=us",[
    ["NobilFluid Artemia 50 ml","Arşiv Novo sıvı yavru yemi · toz yem veya Artemia naupliisi alamayacak kadar küçük yumurtlayan balık larvaları için 50'den fazla doğal hammaddeden ultra ince homojenat · 50 ml / 54 g · ürün kodu 3088100 · yumurta sarısı kesesi tüketilip yavrular serbest yüzmeye başladıktan sonra yaklaşık 100 larvaya 10–15 damla, günde 3–4 kez; besleme sırasında filtre kısa süre kapatılır · kuru madde %12,5; kuru maddede ham protein %48, yağ %5,5, lif %2,5, kül %10,2"],
  ],"2026-09-19"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/2511/jbl-maris?country=gb",[
    ["Maris 250 ml","Arşiv JBL deniz yemi · 5–20 cm deniz balıkları için tüm su katmanlarına uygun, altı farklı pul çeşidinde %30 krill pulu ve Spirulina içeren ana yem · 250 ml / 40 g · ürün kodu 3102060 · ham protein %43, yağ %6, lif %2,5, kül %11, nem %8"],
  ],"2026-09-19"),
  ...products("JBL","food","https://www.jbl.de/en-ba/productsv2/detail/25171805",[
    ["MariPearls CLICK 250 ml","Arşiv JBL deniz yemi · 5–20 cm deniz balıkları için tüm su katmanlarında yüzen ve batan, otomatik yemleyiciye uygun, %10 deniz yosunlu granül ana yem · Click dozaj kapaklı 250 ml / 140 g · ürün kodu 4066100 · bir Click beş balığı besler · ham protein %38, yağ %4, lif %4,5, kül %10,5, nem %8"],
  ],"2026-09-19"),
  ...products("JBL","food","https://www.jbl.de/en/download/11627/Allgemein/JBL_Hauptkatalog_fr.pdf",[
    ["MariPearls 1000 ml","Arşiv JBL deniz yemi · 5–20 cm deniz balıkları için tüm su katmanlarında yüzen ve batan, otomatik yemleyiciye uygun granül ana yem · MariPearls CLICK kutusu için dolum ambalajı · 1000 ml / 520 g · resmî ürün sayfasındaki güncel reçete %10 deniz yosunu; eski üretici kataloğunda %6 bütün karides ve %1 sarımsak bilgisi yer aldığından reçete nesilleri birleştirilmez"],
  ],"2026-09-19"),
  ...products("JBL","food","https://www.jbl.de/en/products/detail/2513/jbl-korallfluid?country=us",[
    ["KorallFluid 100 ml","Arşiv JBL sıvı deniz yemi · mercan, tüp kurdu, çift kabuklu ve diğer planktonla beslenen omurgasızlar için fito- ve zooplankton süspansiyonu · esansiyel aminoasitler ile multivitamin kompleksi içerir · ölçüm pipetli 100 ml şişe · üreticinin resmî SSS'sine göre pipette 10 damla 0,125 ml'dir; bu dönüşüm tek başına akvaryum dozu değildir"],
    ["KorallFluid 500 ml","Arşiv JBL sıvı deniz yemi · mercan, tüp kurdu, çift kabuklu ve diğer planktonla beslenen omurgasızlar için fito- ve zooplankton süspansiyonu · esansiyel aminoasitler ile multivitamin kompleksi içerir · 500 ml şişe · doz akvaryumdaki canlı yüküne ve ambalaj talimatına göre belirlenmelidir"],
  ],"2026-09-19"),
  ...products("JBL","water_conditioner","https://www.jbl.de/?country=us&cpref=566&id=2515&lang=en&mod=productpdf",[
    ["CalciuMarin 500 g","Arşiv JBL deniz bakım ürünü · resif akvaryumlarında kalsiyum, stronsiyum ve karbonat sertliği desteği sağlayan iki bileşenli 500 g toz set · ürün kodu 2491000 · 50 L suda her iki bileşenden birer ölçü kaşığı kalsiyumu yaklaşık 20 mg/L artırır · iki bileşen daima eşit miktarda kullanılmalı; 1. bileşen güçlü akıntıya eklendikten 10 dakika sonra 2. bileşen eklenmeli ve doz ölçülen kalsiyum/KH değerine göre belirlenmelidir"],
  ],"2026-09-19"),
  ...products("JBL","water_conditioner","https://www.jbl.de/en/products/detail/2519/jbl-magnesiumarin?country=fi",[
    ["MagnesiuMarin 500 ml","Arşiv JBL deniz bakım ürünü · resif akvaryumlarında magnezyumu 1200–1400 mg/L aralığına ayarlamaya yönelik sıvı destek · 500 ml · ürün kodu 2491100 · 50 ml ürün, 50 L suda magnezyumu 50 mg/L yükseltir · güçlü akıntıya eklenir; kalsiyum ürününden sonra en az 10 dakika ara verilir ve ölçüm yapılmadan kullanılmaz"],
    ["MagnesiuMarin 5000 ml","Arşiv JBL deniz bakım ürünü · resif akvaryumlarında magnezyumu 1200–1400 mg/L aralığına ayarlamaya yönelik büyük sıvı destek ambalajı · 5000 ml · ürün kodu 2491200 · 50 ml ürün, 50 L suda magnezyumu 50 mg/L yükseltir · güçlü akıntıya eklenir; kalsiyum ürününden sonra en az 10 dakika ara verilir ve ölçüm yapılmadan kullanılmaz"],
  ],"2026-09-19"),
  ...products("JBL","water_conditioner","https://www.jbl.de/?country=us&id=2516&lang=en&mod=productpdf",[
    ["TraceMarin 1 500 ml","Arşiv JBL deniz bakım ürünü · stronsiyum, baryum ve kobalt içeren üç parçalı iz element sisteminin 1. bileşeni · 500 ml / yaklaşık 7000 L kullanım hacmi · haftada 7 ml/100 L · TraceMarin 2 ve 3 ile birlikte, güçlü akıntıya 2–5 dakika arayla eklenir; doğrudan mercanların üzerine uygulanmaz ve diğer bileşenlerin yerine geçmez"],
    ["TraceMarin 1 5000 ml","Arşiv JBL deniz bakım ürünü · stronsiyum, baryum ve kobalt içeren üç parçalı iz element sisteminin 1. bileşeni · 5000 ml / yaklaşık 70000 L kullanım hacmi · haftada 7 ml/100 L · TraceMarin 2 ve 3 ile birlikte, güçlü akıntıya 2–5 dakika arayla eklenir; doğrudan mercanların üzerine uygulanmaz ve diğer bileşenlerin yerine geçmez"],
  ],"2026-09-19"),
  ...products("JBL","water_conditioner","https://www.jbl.de/?country=us&id=2517&lang=en&mod=productpdf",[
    ["TraceMarin 2 500 ml","Arşiv JBL deniz bakım ürünü · iyot, flor, bor ve krom içeren üç parçalı iz element sisteminin 2. bileşeni · 500 ml / yaklaşık 7000 L kullanım hacmi · haftada 7 ml/100 L · TraceMarin 1 ve 3 ile birlikte, güçlü akıntıya 2–5 dakika arayla eklenir; doğrudan mercanların üzerine uygulanmaz ve diğer bileşenlerin yerine geçmez"],
    ["TraceMarin 2 5000 ml","Arşiv JBL deniz bakım ürünü · iyot, flor, bor ve krom içeren üç parçalı iz element sisteminin 2. bileşeni · 5000 ml / yaklaşık 70000 L kullanım hacmi · haftada 7 ml/100 L · TraceMarin 1 ve 3 ile birlikte, güçlü akıntıya 2–5 dakika arayla eklenir; doğrudan mercanların üzerine uygulanmaz ve diğer bileşenlerin yerine geçmez"],
  ],"2026-09-19"),
  ...products("JBL","water_conditioner","https://www.jbl.de/?country=au&id=2518&lang=en&mod=productpdf",[
    ["TraceMarin 3 500 ml","Arşiv JBL deniz bakım ürünü · mangan, çinko, demir, nikel, molibden, vanadyum ve rubidyum dahil 16 element içeren üç parçalı iz element sisteminin 3. bileşeni · 500 ml / yaklaşık 7000 L kullanım hacmi · haftada 7 ml/100 L · TraceMarin 1 ve 2 ile birlikte, güçlü akıntıya 2–5 dakika arayla eklenir; doğrudan mercanların üzerine uygulanmaz ve diğer bileşenlerin yerine geçmez"],
    ["TraceMarin 3 5000 ml","Arşiv JBL deniz bakım ürünü · mangan, çinko, demir, nikel, molibden, vanadyum ve rubidyum dahil 16 element içeren üç parçalı iz element sisteminin 3. bileşeni · 5000 ml / yaklaşık 70000 L kullanım hacmi · haftada 7 ml/100 L · TraceMarin 1 ve 2 ile birlikte, güçlü akıntıya 2–5 dakika arayla eklenir; doğrudan mercanların üzerine uygulanmaz ve diğer bileşenlerin yerine geçmez"],
  ],"2026-09-19"),
  {
    id:"jbl-punktol-plus-125",brand:"JBL",model:"Punktol Plus 125 100 ml",category:"treatment",
    description:"Arşiv akvaryum balığı ilacı · ürün kodu 1006542 · tatlı ve deniz suyunda beyaz benek ile diğer tek hücreli dış parazitlere yönelik, bakır içermez · 100 ml; tek uygulamada 1000 L, yaklaşık 15 günlük sekiz uygulamalı kürde en çok 125 L · yayımlanan doz 10 ml/100 L'dir · uygulamadan önce yüzde 50 su değişimi yapılır; aktif karbon çıkarılır, UV-C ve CO₂, deniz suyunda ayrıca protein skimmer ve ozon kapatılır, güçlü havalandırma sağlanır · kıkırdaklı balıklarla uyumlu değildir; deniz omurgasızları ve mercanlarda uzun süreli hasar, tatlı su omurgasızlarında intolerans riski vardır; pulsuz veya zayıf balıklarda prospektüs yarım doz ister · kesin tanı, tam prospektüs ve balık konusunda deneyimli veteriner olmadan kullanılmamalı; başka ilaçla eşzamanlı karıştırılmamalıdır",
    sourceUrl:"https://www.jbl.de/en/products/detail/5589/jbl-punktol-plus-125?country=ua&cpref=56",
    additionalSourceUrls:["https://www.jbl.de/de/download/9216/Gebrauchsanleitungen/JBL_Punktol_Plus_125.pdf"],verifiedAt:"2026-09-19",
  },
  {
    id:"jbl-punktol-plus-250",brand:"JBL",model:"Punktol Plus 250 100 ml",category:"treatment",
    description:"Arşiv akvaryum balığı ilacı · ürün kodu 1006642 · tatlı ve deniz suyunda beyaz benek ile diğer tek hücreli dış parazitlere yönelik, bakır içermez · 100 ml; tek uygulamada 2000 L, yaklaşık 15 günlük sekiz uygulamalı kürde en çok 250 L · yayımlanan doz iki günde bir 5 ml/100 L'dir · uygulamadan önce yüzde 50 su değişimi yapılır; aktif karbon çıkarılır, UV-C ve CO₂, deniz suyunda ayrıca protein skimmer ve ozon kapatılır, güçlü havalandırma sağlanır · omurgasızlara yalnız sınırlı uygundur; kesin tanı, tam prospektüs ve balık konusunda deneyimli veteriner olmadan kullanılmamalı; başka ilaçla eşzamanlı karıştırılmamalıdır",
    sourceUrl:"https://www.jbl.de/en/products/detail/5591/jbl-punktol-plus-250?country=gr",
    additionalSourceUrls:["https://www.jbl.de/?country=gr&id=9116&lang=en&mod=download"],verifiedAt:"2026-09-19",
  },
  {
    id:"jbl-punktol-plus-1500",brand:"JBL",model:"Punktol Plus 1500 50 ml",category:"treatment",
    description:"Arşiv akvaryum balığı ilacı · ürün kodu 1006800 · tatlı ve deniz suyunda beyaz benek ile diğer tek hücreli dış parazitlere yönelik, bakır içermez · 50 ml; tek uygulamada 12500 L, yaklaşık 15 günlük sekiz uygulamalı kürde en çok 1500 L · yayımlanan doz iki günde bir 1 damla/10 L'dir · uygulamadan önce yüzde 50 su değişimi yapılır; aktif karbon çıkarılır, UV-C ve CO₂, deniz suyunda ayrıca protein skimmer ve ozon kapatılır, güçlü havalandırma sağlanır · omurgasızlara yalnız sınırlı uygundur; kesin tanı, tam prospektüs ve balık konusunda deneyimli veteriner olmadan kullanılmamalı; başka ilaçla eşzamanlı karıştırılmamalıdır",
    sourceUrl:"https://www.jbl.de/de/produkte/detail/5559/jbl-punktol-plus-1500?country=li",
    additionalSourceUrls:["https://www.jbl.de/?country=li&id=10390&lang=de&mod=download"],verifiedAt:"2026-09-19",
  },
  {
    id:"jbl-oodinol-plus-250",brand:"JBL",model:"Oodinol Plus 250 100 ml",category:"treatment",
    description:"Arşiv akvaryum balığı ilacı · ürün kodu 1007600 · tatlı ve deniz suyu balıklarında Oodinium/kadife hastalığına yönelik bakır sülfat pentahidratlı ürün · 100 ml; tek uygulamada 1000 L, tekrarlı kürde en çok 250 L · ilk gün 10 ml/100 L; sonraki doz yalnız bakır testi sonucuna göre ayarlanır ve hedef bakır düzeyi 0,3 mg/L'dir · düşük bakır etkisiz veya direnç riski, yüksek bakır balık ölümü riski taşır; yayınlanan şema bakır ölçümü olmadan uygulanamaz · tatlı ve deniz suyu omurgasızlarında kullanılmaz, birçok yayın balığı bakıra hassastır · kesin mikroskobik/uzman tanısı, tam prospektüs ve balık konusunda deneyimli veteriner olmadan kullanılmamalı; başka ilaçla eşzamanlı karıştırılmamalıdır",
    sourceUrl:"https://www.jbl.de/?country=nz&cpref=804&func=detail&id=5567&lang=en&mod=products",
    additionalSourceUrls:["https://www.jbl.de/?country=nz&id=9214&lang=en&mod=download"],verifiedAt:"2026-09-19",
  },
  {
    id:"jbl-ektol-bac-plus-250",brand:"JBL",model:"Ektol bac Plus 250 2 × 100 ml",category:"treatment",
    description:"Arşiv tatlı su akvaryum balığı ilacı · Aeromonas, Pseudomonas, Columnaris ve diğer bakteriyel enfeksiyonlara yönelik iki bileşenli 2 × 100 ml set · K1 bileşeninin 100 ml'sinde 700 mg benzalkonyum klorür ve 480 mg metilen mavisi, K2 bileşeninin 100 ml'sinde 8000 mg polivinilpirolidon iyot bulunur · ürün sayfası tek uygulamada en çok 500 L, tekrarlı kullanımda 250 L; 10 ml veya 5 ml/100 L ve yaklaşık altı günlük altı doz şeması yayımlar · tatlı su omurgasızları tedaviden çıkarılmalı; pulsuz, canlı doğuran veya zayıf balıklarda prospektüsteki yarım dozla başlayıp dikkatle artırma kuralı izlenmelidir · filtre bakterilerini etkileyebilir; kesin tanı, tam prospektüs ve balık konusunda deneyimli veteriner olmadan kullanılmamalı, başka ilaçla eşzamanlı karıştırılmamalıdır",
    sourceUrl:"https://www.jbl.de/es/productos/detail/5582/jbl-ektol-bac-plus-250?country=mx",
    additionalSourceUrls:["https://www.jbl.de/en/press/detail/274/jbl-ektol-bac-a-new-medication-against-bacterial-infections?country=ie","https://www.jbl.de/it/stampa/detail/269/a-new-medication-against-bacterial-infections-and-?country=it"],verifiedAt:"2026-09-19",
  },
  {
    id:"jbl-gyrodol-plus-250",brand:"JBL",model:"Gyrodol Plus 250 100 ml",category:"treatment",
    description:"Arşiv tatlı ve deniz suyu akvaryum balığı ilacı · eski katalog no. 10072 · solungaç kurdu Dactylogyrus, deri kurdu Gyrodactylus ve tenyalar için 1500 mg/100 ml prazikuantel içeren 100 ml süspansiyon · tek uygulamada 500 L, tekrarlı kürde en çok 250 L; yayımlanan doz 10 ml/50 L, suda kalma süresi 48 saat ve ardından yüzde 30 su değişimidir · yumurta bırakan solungaç kurtlarında tedavi 23 °C üstünde 7, altında 10 gün sonra tekrarlanır · tatlı ve deniz suyu omurgasızlarında kullanılmaz; pulsuz ve zayıf balıklarda prospektüs yarım dozla başlayıp dikkatle artırmayı ister · kesin mikroskobik tanı, tam prospektüs ve balık konusunda deneyimli veteriner olmadan kullanılmamalı; başka ilaçla eşzamanlı karıştırılmamalıdır",
    sourceUrl:"https://www.jbl.de/en/products/detail/5569/jbl-gyrodol-plus-250?country=jo",
    additionalSourceUrls:["https://www.jbl.de/de/download/9210/Gebrauchsanleitungen/JBL_Gyrodol_Plus_250.pdf","https://www.jbl.de/?country=gr&id=5569&lang=en&mod=productpdf"],verifiedAt:"2026-09-19",
  },
  {
    id:"jbl-aradol-plus-250",brand:"JBL",model:"Aradol Plus 250 100 ml",category:"treatment",
    description:"Arşiv tatlı ve deniz suyu akvaryum balığı ilacı · eski katalog no. 10073 · Argulus balık biti, Lernaea çapa kurdu, solungaç kabukluları ve izopodlara yönelik 100 ml şişe · tek uygulamada 500 L, tekrarlı kürde en çok 250 L · yayımlanan şema 1. gün 10 ml/50 L, 8. gün yüzde 50 su değişimi ve 14. gün yeniden 10 ml/50 L'dir · 18 °C altında etkisizdir; paraziti doğrudan öldürmek yerine büyümesini engeller · karides, kerevit ve diğer omurgasızlarda kullanılmaz · kesin tanı, tam prospektüs ve balık konusunda deneyimli veteriner olmadan kullanılmamalı; başka ilaçla eşzamanlı karıştırılmamalıdır",
    sourceUrl:"https://www.jbl.de/de/produkte/detail/5577/jbl-aradol-plus-250?country=ch",
    additionalSourceUrls:["https://www.jbl.de/en/download/11627/Allgemein/JBL_Hauptkatalog_fr.pdf"],verifiedAt:"2026-09-19",
  },
  {
    id:"jbl-nedol-plus-250",brand:"JBL",model:"Nedol Plus 250 100 ml",category:"treatment",
    description:"Arşiv akvaryum balığı ilacı · eski katalog no. 10074 · Camallanus kırmızı guppy kurdu, Capillariidae, Oxyuridae ve diğer nematodlara yönelik 100 ml şişe · tek uygulamada 750 L, tekrarlı kürde en çok 250 L; yayımlanan doz 10 ml/75 L'dir · yassı kurt ilaçları nematodlarda etkili değildir ve doğru parazit grubu tanısı gerekir · tatlı ve deniz suyu omurgasızlarında kullanılmaz · kesin tanı, tam prospektüs ve balık konusunda deneyimli veteriner olmadan kullanılmamalı; başka ilaçla eşzamanlı karıştırılmamalıdır",
    sourceUrl:"https://www.jbl.de/en/download/11627/Allgemein/JBL_Hauptkatalog_fr.pdf",
    additionalSourceUrls:["https://www.jbl.de/en/faq/detail?country=ie&faqid=477&glossary_id=79","https://www.jbl.de/en/products/group/5566/medications?country=sg"],verifiedAt:"2026-09-19",
  },
  {
    id:"jbl-spirohexol-plus-250",brand:"JBL",model:"Spirohexol Plus 250 100 ml",category:"treatment",
    description:"Arşiv tatlı ve deniz suyu akvaryum balığı ilacı · eski katalog no. 10071 · Hexamita, Spironucleus ve Protoopalina bağırsak kamçılılarına yönelik 100 ml şişe · tek uygulamada 500 L, tekrarlı kürde en çok 250 L; yayımlanan doz 10 ml/50 L, suda kalma süresi 7 gün, ardından yüzde 50 su değişimi ve gerekirse 8. gün tekrardır · delik hastalığı yalnız kamçılılardan kaynaklanmayabilir; yetersiz hijyen, vitamin ve mineral eksikliği değerlendirilip çok yumuşak su mineralce desteklenmelidir · kıkırdaklı balıklar ile tatlı/deniz suyu omurgasızlarında kullanılmaz; deniz balıkları karantina tankında tedavi edilmelidir · kesin tanı, tam prospektüs ve balık konusunda deneyimli veteriner olmadan kullanılmamalı; başka ilaçla eşzamanlı karıştırılmamalıdır",
    sourceUrl:"https://www.jbl.de/en/products/detail/5575/jbl-spirohexol-plus-250?country=lb",
    additionalSourceUrls:["https://www.jbl.de/de/download/10393/Gebrauchsanleitungen/JBL_Spirohexol_Plus_250.pdf"],verifiedAt:"2026-09-19",
  },
  ...[
    ["jbl-ektol-cristal","Ektol cristal 80 g","10041","800 L"],
    ["jbl-ektol-cristal-240-g","Ektol cristal 240 g","10050","2400 L"],
    ["jbl-ektol-cristal-3000-g","Ektol cristal 3000 g","10055","30000 L"],
  ].map(([id,model,itemNumber,treatedVolume])=>(
    {
      id,brand:"JBL",model,category:"treatment" as const,
      description:`Arşiv tatlı su balığı bakım tuzu · eski katalog no. ${itemNumber} · oksijen salan tuz karışımı; stres azaltma, solunumu ve mukoza yenilenmesini destekleme amacı taşır, ilaçların yerine geçmez · ambalajın yayımlanan toplam kullanım hacmi ${treatedVolume} · normal destek dozu 5 g/50 L, yeni balık uyumunda 5 g/25 L; 8 °dKH altındaki yumuşak suda prospektüs yarım doz ister · 0,2 g/L üzerindeki uzun süreli kullanım bitki gelişimini bozabilir; amonyum/amonyak ve nitrit her gün ölçülmeli, nitrit 0,5 mg/L'yi aşarsa derhal yüzde 50 su değişimi yapılmalıdır · tatlı su omurgasızlarında intolerans görülebilir; bakır içeren ilaçlarla birlikte kullanılmaz ve geçişte en az yüzde 75 su değişimi gerekir · tuz banyosu ayrı kapta, tür toleransı doğrulanarak, en çok 3 g/L ve 10 dakika sürekli gözlemle yapılabilir; tam prospektüs veya uzman yönlendirmesi olmadan tedavi gibi uygulanmamalıdır`,
      sourceUrl:id === "jbl-ektol-cristal-3000-g" ? "https://www.jbl.de/en/download/11627/Allgemein/JBL_Hauptkatalog_fr.pdf" : "https://www.jbl.de/en/download/497/Gebrauchsanleitungen/JBL_Ektol_cristal.pdf",
      additionalSourceUrls:id === "jbl-ektol-cristal-3000-g" ? ["https://www.jbl.de/en/download/497/Gebrauchsanleitungen/JBL_Ektol_cristal.pdf"] : ["https://www.jbl.de/en/download/11627/Allgemein/JBL_Hauptkatalog_fr.pdf"],
      verifiedAt:"2026-09-19",
    }
  )),
  {
    id:"jbl-ektol-fluid-plus-125",brand:"JBL",model:"Ektol fluid Plus 125 100 ml",category:"treatment",
    description:"Arşiv tatlı su akvaryum balığı ilacı · ürün kodu 1007800 · ağız ve yüzgeç çürümesi ile diğer dış bakteriyel enfeksiyonlara yönelik 100 ml şişe · yayımlanan doz 10 ml/50 L'dir; gerekirse su değişiminden sonra 5. gün yeniden uygulanır, 8 °dKH altındaki yumuşak suda yalnız yarım doz kullanılır · KH, pH, amonyum/amonyak ve nitrit ölçülmeden ve altta yatan su kalitesi düzeltilmeden kalıcı çözüm gibi sunulmaz · kesin tanı, tam prospektüs ve balık konusunda deneyimli veteriner olmadan kullanılmamalı; başka ilaçla eşzamanlı karıştırılmamalıdır",
    sourceUrl:"https://www.jbl.de/de/produkte/detail/5564/jbl-ektol-fluid-plus-125?country=li",verifiedAt:"2026-09-19",
  },
  {
    id:"jbl-ektol-fluid-plus-250",brand:"JBL",model:"Ektol fluid Plus 250 100 ml",category:"treatment",
    description:"Arşiv akvaryum balığı ilacı · ürün kodu 1006981 · ağız ve yüzgeç çürümesi ile diğer dış bakteriyel enfeksiyonlara yönelik 100 ml şişe · yayımlanan doz 10 ml/50 L'dir; gerekirse su değişiminden sonra 5. gün yeniden uygulanır, 8 °dKH altındaki yumuşak suda yalnız yarım doz kullanılır · KH, pH, amonyum/amonyak ve nitrit ölçülmeden ve altta yatan su kalitesi düzeltilmeden kalıcı çözüm gibi sunulmaz · kesin tanı, tam prospektüs ve balık konusunda deneyimli veteriner olmadan kullanılmamalı; başka ilaçla eşzamanlı karıştırılmamalıdır",
    sourceUrl:"https://www.jbl.de/en/products/detail/8343/jbl-ektol-fluid-plus-250?country=fr",verifiedAt:"2026-09-19",
  },
  {
    id:"jbl-fungol-plus-250",brand:"JBL",model:"Fungol Plus 250 2 × 100 ml",category:"treatment",
    description:"Arşiv tatlı su akvaryum balığı ilacı · ürün kodu 1006300 · Saprolegniaceae kaynaklı dış mantar enfeksiyonlarına yönelik iki bileşenli 2 × 100 ml set; toplam yayımlanan erişim 750 L · bileşen 1 ilk gün 10 ml/80 L, gerekirse 3. ve 5. gün; bileşen 2 ise 7. gün 10 ml/80 L, gerekirse 9. ve 11. gün uygulanır · her tekrar dozundan önce yüzde 30–50 su değişimi gerekir · aktif karbon çıkarılır, UV-C ve CO₂ kapatılır, güçlü havalandırma sağlanır; tatlı su omurgasızları tedaviden çıkarılır, pulsuz ve zayıf balıklar hassas olabilir · tedavi sırasında ve sonraki ilk günlerde amonyum/amonyak ile nitrit her gün ölçülür; nitrit 0,5 mg/L üstündeyse derhal yüzde 50 su değişimi yapılır · kesin tanı, tam prospektüs ve balık konusunda deneyimli veteriner olmadan kullanılmamalı; başka ilaçla eşzamanlı karıştırılmamalıdır",
    sourceUrl:"https://www.jbl.de/de/produkte/detail/5557/jbl-fungol-plus-250?country=li",
    additionalSourceUrls:["https://www.jbl.de/de/download/9114/Gebrauchsanleitungen/JBL_Fungol_Plus_250.pdf"],verifiedAt:"2026-09-19",
  },
  {
    id:"jbl-furanol-plus-250",brand:"JBL",model:"Furanol Plus 250 20 tablet",category:"treatment",
    description:"Arşiv tatlı ve deniz suyu akvaryum balığı ilacı · nifurpirinol adlı antibiyotik etken maddeyi içeren 20 tabletlik paket; Aeromonas, Pseudomonas, Columnaris, Flexibacter ve diğer bakteriyel enfeksiyonlara yöneliktir · yayımlanan doz 1 tablet/25 L, tam paket 500 L içindir · bazı ülkelerde, özellikle Almanya'da serbest satılmaz ve yalnız ihracat ürünü olarak belirtilir; yerel mevzuat doğrulanmadan temin veya kullanım önerilmez · belirtiler tek başına bakteriyel tanı değildir; üretici kesin ayrım için mikroskobik inceleme gerektiğini belirtir · kesin tanı, tam prospektüs ve balık konusunda deneyimli veteriner olmadan kullanılmamalı; başka ilaçla eşzamanlı karıştırılmamalıdır",
    sourceUrl:"https://www.jbl.de/?country=th&id=5580&lang=en&mod=productpdf",
    additionalSourceUrls:["https://www.jbl.de/de/presse/detail/350/neues-und-bestes-heilmittelprogramm-das-jbl-je-im-programm-hatte?country=de"],verifiedAt:"2026-09-19",
  },
  {
    id:"jbl-algol",brand:"JBL",model:"Algol",category:"treatment",
    description:"Tatlı su akvaryumlarında alg kontrolü için bakır içermeyen biyosit · 10 ml/40 L; kullanımdan önce en az yüzde 30 su değişimi ve uygulama sırasında güçlü havalandırma gerekir · hassas karidesler ve bazı bitkiler için olumsuz etki riski vardır",
    sourceUrl:"https://www.jbl.de/en/products/detail/2329/jbl-algol",verifiedAt:"2026-09-14",
  },
  ...([30,120,250,500,2000] as const).map((volumeMl,index)=>{
    const itemNumbers = ["A8340","A8342","A8343","A8344","A8345"] as const;
    const treatedLitres = [113,908,1892,3785,15140] as const;
    return {
      id:`fluval-aqua-plus-${volumeMl}ml`,brand:"Fluval",model:`Aqua Plus Water Conditioner ${volumeMl === 2000 ? "2 L" : `${volumeMl} ml`}`,category:"water_conditioner" as const,
      description:`Tatlı ve deniz suyu için musluk suyundaki klor, kloramin ve istenmeyen metalleri nötralize eden su düzenleyici · ${volumeMl === 2000 ? "2 L" : `${volumeMl} ml`} · ürün kodu ${itemNumbers[index]} · üreticinin yayımladığı toplam kullanım hacmi ${treatedLitres[index]} L · bitkisel özlerle taşıma ve adaptasyon stresini azaltmayı, pul ve yüzgeçleri küçük sıyrıklara karşı korumayı amaçlar; gerçek doz ve yerel su koşulları için etiket talimatı izlenmelidir`,
      sourceUrl:"https://fluvalaquatics.com/us/shop/product/water-care",additionalSourceUrls:["https://fluvalaquatics.com/us/shop/product/aqua-plus-water-conditioner-16-9-fl-oz-500-ml"],verifiedAt:"2026-09-28",
    };
  }),
  ...([30,120,250,500,2000] as const).map((volumeMl,index)=>{
    const itemNumbers = ["A8346","A8348","A8349","A8351","A8352"] as const;
    const treatedLitres:Array<number|undefined> = [undefined,908,1892,3785,15140];
    const coverage = treatedLitres[index] === undefined ? "üreticinin ortak karşılaştırma tablosunda 30 ml için toplam kullanım hacmi yayımlanmıyor" : `üreticinin yayımladığı toplam kullanım hacmi ${treatedLitres[index]} L`;
    return {
      id:`fluval-cycle-${volumeMl}ml`,brand:"Fluval",model:`Cycle Biological Enhancer ${volumeMl === 2000 ? "2 L" : `${volumeMl} ml`}`,category:"bacteria" as const,
      description:`Tatlı ve deniz suyu için amonyak ve nitriti işleyen yararlı bakteri kültürü · ${volumeMl === 2000 ? "2 L" : `${volumeMl} ml`} · ürün kodu ${itemNumbers[index]} · ${coverage} · yeni akvaryum, yeni canlı ekleme, su değişimi ve filtre medyası değişimi sonrasında kullanıma yöneliktir; ölçülen amonyak/nitrit takibinin ve olgunlaşma sürecinin yerine geçmez`,
      sourceUrl:"https://fluvalaquatics.com/us/shop/product/water-care",additionalSourceUrls:["https://fluvalaquatics.com/us/shop/product/cycle-biological-enhancer-16-9-fl-oz-500-ml"],verifiedAt:"2026-09-28",
    };
  }),
  ...([30,120,250,2000] as const).map((volumeMl,index)=>{
    const itemNumbers = ["A8353","A8354","A8355","A8357"] as const;
    const treatedLitres:Array<number|undefined> = [113,undefined,1892,15140];
    const coverage = treatedLitres[index] === undefined ? "üreticinin ürün sayfasında toplam kullanım hacmi yayımlanmıyor" : `üreticinin yayımladığı toplam kullanım hacmi ${treatedLitres[index]} L`;
    return {
      id:`fluval-waste-control-${volumeMl}ml`,brand:"Fluval",model:`Waste Control Biological Aquarium Cleaner ${volumeMl === 2000 ? "2 L" : `${volumeMl} ml`}`,category:"bacteria" as const,
      description:`Tatlı ve deniz suyu yüzeylerindeki balık atığı, yem ve çürüyen organik maddeyi parçalamaya yardımcı bakteri ürünü · ${volumeMl === 2000 ? "2 L" : `${volumeMl} ml`} · ürün kodu ${itemNumbers[index]} · ${coverage} · organik atığın parçalanması sırasında amonyak/nitrit artışını önlemek için Cycle ile birlikte kullanım önerilir; su değişimi ve ölçümün yerine geçmez`,
      sourceUrl:volumeMl === 120 ? "https://fluvalaquatics.com/ca/shop/product/waste-control-biological-aquarium-cleaner-4-oz-120-ml" : "https://fluvalaquatics.com/us/shop/product/water-care",additionalSourceUrls:["https://fluvalaquatics.com/us/shop/product/waste-control-biological-aquarium-cleaner-8-4-fl-oz-250-ml"],verifiedAt:volumeMl === 120 ? "2026-09-29" : "2026-09-28",
    };
  }),
  {
    id:"fluval-betta-plus-60ml",brand:"Fluval",model:"Betta Plus Water Conditioner 60 ml",category:"water_conditioner",
    description:"Betta akvaryumlarında musluk suyundaki klor, kloramin ve istenmeyen metalleri nötralize eden su düzenleyici · 60 ml · ürün kodu A8334 · bitkisel özlerle stresi azaltmayı ve pul/yüzgeçleri küçük sıyrıklara karşı korumayı amaçlar; doz için ürün etiketi izlenmelidir",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/betta-plus-water-conditioner-2-oz-57-g",additionalSourceUrls:["https://fluvalaquatics.com/us/wp-content/uploads/2024/12/Betta-CARE-GUIDE_EN-1.pdf"],verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-betta-enviro-clean-60ml",brand:"Fluval",model:"Betta Enviro Clean 60 ml",category:"bacteria",
    description:"Betta akvaryumlarında çakıl, filtre, dekor ve iç yüzeylerdeki organik atığı parçalamaya yardımcı yararlı bakteri ürünü · 60 ml · ürün kodu A8335 · yeni kurulum ve düzenli bakım için; üretici en iyi sonuç için Cycle ile birlikte kullanım önerir, su değişimi ve amonyak/nitrit ölçümünün yerine geçmez",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/betta-enviro-clean-2-oz-57-g",additionalSourceUrls:["https://fluvalaquatics.com/us/wp-content/uploads/2024/12/Betta-CARE-GUIDE_EN-1.pdf"],verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-quick-clear-120ml",brand:"Fluval",model:"Quick Clear 120 ml",category:"water_conditioner",
    description:"Tatlı suda organik ve inorganik askıdaki parçacıkları iyonik çekimle kümeleyip filtrasyonla tutulmasını destekleyen berraklaştırıcı · 120 ml · ürün kodu A8366 · üreticinin yayımladığı toplam kullanım hacmi 1816 L · bulanıklığın nedenini ve düzenli bakımı ortadan kaldırmaz",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/quick-clear-4-fl-oz-120-ml",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-bio-clear-120ml",brand:"Fluval",model:"Bio Clear 120 ml",category:"water_conditioner",
    description:"Yeni tank sendromu veya çürüyen bitki, yem ve organik atık kaynaklı biyolojik bulanıklığı hızlı enzimlerle azaltmaya yardımcı tatlı su berraklaştırıcı · 120 ml · ürün kodu A8367 · üreticinin yayımladığı toplam kullanım hacmi 908 L · biyolojik döngü, su değişimi ve amonyak/nitrit ölçümünün yerine geçmez",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/bio-clear-4-fl-oz-120-ml",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-sea-alkalinity-a8253-237ml",brand:"Fluval",model:"SEA Alkalinity 237 ml",category:"water_conditioner",
    description:"Deniz akvaryumlarında mercan tüketimi, koralin alg ve organik süreçlerle azalan alkaliniteyi destekleyen yoğun takviye · 237 ml · ürün kodu A8253 · UPC 015561182539 · farmasötik sınıf sodyum karbonat, bikarbonat ve borat içerir; net su hacmi kullanılmalı, yoğun canlı kaya varsa başlangıç hesabında hacim yüzde 20 azaltılmalı, KH ve kalsiyum ölçülmeden dozlanmamalıdır; yanlış kalsiyum/alkalinite dengesi çökelti ve bulanıklık oluşturabilir",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/alkalinity-8-fl-oz-237-ml",additionalSourceUrls:["https://fluvalaquatics.com/ca/shop/water-care/page/2","https://fluvalaquatics.com/careguides/Fluval-Saltwater-Care-Guide_en.pdf"],verifiedAt:"2026-09-29",
  },
  {
    id:"fluval-sea-calcium-a8257-237ml",brand:"Fluval",model:"SEA Calcium 237 ml",category:"water_conditioner",
    description:"Deniz akvaryumlarında mercan ve diğer omurgasızların tükettiği kalsiyumu destekleyen yoğun takviye · 237 ml · ürün kodu A8257 · UPC 015561182577 · farmasötik sınıf kalsiyum klorür içerir; iyon dengesini korumak için güncel kalsiyum ve alkalinite ölçülmeden, ayrı mineral takviyeleriyle gelişigüzel birleştirilmeden kullanılmamalıdır; üretici ürün sayfasında kesin doz yayımlamadığı için doz tahmin edilmemiştir",
    sourceUrl:"https://fluvalaquatics.com/ca/shop/product/calcium-8-fl-oz-237-ml",additionalSourceUrls:["https://fluvalaquatics.com/ca/shop/water-care/page/2","https://fluvalaquatics.com/ca/fr/shop/product/calcium-8-fl-oz-237-ml-2","https://fluvalaquatics.com/careguides/Fluval-Saltwater-Care-Guide_en.pdf"],verifiedAt:"2026-09-29",
  },
  {
    id:"fluval-sea-iodine-a8264-237ml",brand:"Fluval",model:"SEA Iodine 237 ml",category:"water_conditioner",
    description:"Deniz akvaryumlarında protein skimmer, koralin alg, mercan gelişimi ve oksidasyonla azalan iyodu destekleyen yoğun takviye · 237 ml · ürün kodu A8264 · UPC 015561182645 · doğal deniz suyundaki orana göre kalsiyum iyodat ve potasyum iyodür içerir; mercan ve omurgasız sistemi için yalnız ölçüm ve etiket talimatıyla kullanılmalı, ürün sayfasında yayımlanmayan doz tahmin edilmemelidir",
    sourceUrl:"https://fluvalaquatics.com/ca/shop/product/iodine-8-fl-oz-237-ml",additionalSourceUrls:["https://fluvalaquatics.com/ca/shop/water-care/page/2","https://www.regulatory-info-hsx.com/pdf/english/MSDS-A8264-A8265.pdf"],verifiedAt:"2026-09-29",
  },
  {
    id:"fluval-sea-trace-elements-a8269-237ml",brand:"Fluval",model:"SEA Trace Elements 237 ml",category:"water_conditioner",
    description:"Deniz suyunda protein skimmer, kimyasal filtrasyon ve biyolojik süreçlerle azalan 11 temel iz elementi tamamlamaya yönelik yoğun takviye · 237 ml · ürün kodu A8269 · UPC 015561182690 · mercan büyüme, kondisyon ve renk desteği için; nitrat ve fosfat içermez, ölçüm/etiket talimatı olmadan veya diğer çoklu takviyelerle kontrolsüz birlikte kullanılmamalıdır",
    sourceUrl:"https://fluvalaquatics.com/ca/shop/product/trace-elements-8-fl-oz-237-ml",additionalSourceUrls:["https://fluvalaquatics.com/ca/shop/water-care/page/2"],verifiedAt:"2026-09-29",
  },
  {
    id:"fluval-sea-magnesium-a8261-237ml",brand:"Fluval",model:"SEA Magnesium 237 ml",category:"water_conditioner",
    description:"Deniz akvaryumlarında mercan emilimi ve diğer biyolojik süreçlerle azalan magnezyumu yükseltip korumaya yönelik yoğun takviye · 237 ml · ürün kodu A8261 · farmasötik saflıkta magnezyum klorür içerir; kararlı pH ve mercan gelişimini desteklemeye, kalsiyum çökelmesini önlemeye yardımcı olur · yalnız tuzlu su içindir; güncel magnezyum, kalsiyum ve alkalinite ölçülmeden ya da 3-Ions gibi magnezyum içeren başka takviyelerle mükerrer doz oluşturacak biçimde kullanılmamalıdır; güncel ürün dizininde kesin doz yayımlanmadığı için doz tahmin edilmemiştir",
    sourceUrl:"https://fluvalaquatics.com/ca/shop/product/magnesium",additionalSourceUrls:["https://fluvalaquatics.com/ca/shop/water-care/page/3","https://www.interempresas.net/FeriaVirtual/Catalogos_y_documentos/225656/catalogo-Fluval_2015.pdf","https://image.chewy.com/is/content/catalog/96774_UseAndCareInstructions._V1503504931_.pdf"],verifiedAt:"2026-09-29",
  },
  {
    id:"fluval-sea-magnesium-a8262-473ml",brand:"Fluval",model:"SEA Magnesium 473 ml",category:"water_conditioner",
    description:"Deniz akvaryumlarında mercan emilimi ve diğer biyolojik süreçlerle azalan magnezyumu yükseltip korumaya yönelik yoğun takviye · 473 ml · ürün kodu A8262 · farmasötik saflıkta magnezyum klorür içerir; kararlı pH ve mercan gelişimini desteklemeye, kalsiyum çökelmesini önlemeye yardımcı olur · yalnız tuzlu su içindir; güncel magnezyum, kalsiyum ve alkalinite ölçülmeden ya da 3-Ions gibi magnezyum içeren başka takviyelerle mükerrer doz oluşturacak biçimde kullanılmamalıdır; güncel ürün dizininde kesin doz yayımlanmadığı için doz tahmin edilmemiştir",
    sourceUrl:"https://fluvalaquatics.com/ca/shop/product/magnesium",additionalSourceUrls:["https://fluvalaquatics.com/ca/shop/water-care/page/3","https://www.interempresas.net/FeriaVirtual/Catalogos_y_documentos/225656/catalogo-Fluval_2015.pdf","https://image.chewy.com/is/content/catalog/96774_UseAndCareInstructions._V1503504931_.pdf"],verifiedAt:"2026-09-29",
  },
  {
    id:"fluval-sea-3-ions-a8272-237ml",brand:"Fluval",model:"SEA 3-Ions Supplement 237 ml",category:"water_conditioner",
    description:"Deniz akvaryumlarında mercan ve koralin alg tüketimiyle azalan kalsiyum, magnezyum ve stronsiyumu birlikte destekleyen yoğun takviye · 237 ml · ürün kodu A8272 · UPC 015561182720 · farmasötik sınıf klorür tuzları içerir; kalsiyum, magnezyum ve stronsiyum hedefleri ölçülmeden ya da tekli takviyelerle mükerrer doz oluşturacak biçimde kullanılmamalıdır",
    sourceUrl:"https://fluvalaquatics.com/ca/shop/product/3-ions-supplement-8-fl-oz-237-ml",additionalSourceUrls:["https://fluvalaquatics.com/ca/shop/water-care","https://fluvalaquatics.com/careguides/Fluval-Saltwater-Care-Guide_en.pdf"],verifiedAt:"2026-09-29",
  },
  {
    id:"fluval-marine-salt-a8279-6-8kg",brand:"Fluval",model:"Marine Salt 6,8 kg",category:"water_conditioner",
    description:"Deniz akvaryumu hazırlamak için hızlı çözünen profesyonel tuz karışımı · 6,8 kg · ürün kodu L-A8279 · UPC 015561182799 · özgül ağırlık 1,023'te yaklaşık 460 mg/L kalsiyum, 1250–1300 mg/L magnezyum, 8–12 mg/L stronsiyum ve 8,1–8,2 pH hedefler; ayrı temiz kapta filtrelenmiş veya ters ozmoz suyuyla tamamen çözündürülmeli ve akvaryuma eklenmeden önce tuzluluk ölçülmelidir",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/marine-salt-15-lb-6-8-kg",additionalSourceUrls:["https://fluvalaquatics.com/careguides/Fluval-Saltwater-Care-Guide_en.pdf"],verifiedAt:"2026-09-29",
  },
  {
    id:"fluval-marine-salt-a8280-22-5kg",brand:"Fluval",model:"Marine Salt 22,5 kg",category:"water_conditioner",
    description:"Deniz akvaryumu hazırlamak için hızlı çözünen profesyonel tuz karışımı · 22,5 kg · ürün kodu L-A8280 · UPC 015561182805 · özgül ağırlık 1,023'te yaklaşık 460 mg/L kalsiyum, 1250–1300 mg/L magnezyum, 8–12 mg/L stronsiyum ve 8,1–8,2 pH hedefler; ayrı temiz kapta filtrelenmiş veya ters ozmoz suyuyla tamamen çözündürülmeli ve akvaryuma eklenmeden önce tuzluluk ölçülmelidir",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/marine-salt-49-5-lb-22-5-kg",additionalSourceUrls:["https://fluvalaquatics.com/careguides/Fluval-Saltwater-Care-Guide_en.pdf"],verifiedAt:"2026-09-29",
  },
  {
    id:"fluval-freshwater-salt-a1091-675g",brand:"Fluval",model:"Freshwater Salt 675 g",category:"treatment",
    description:"Canlı doğuranlar, Japon balıkları, Afrika cikletleri, acı su hazırlığı ve bazı tür/amaçlara özel uygulamalar için katkısız tatlı su tuzu · 675 g · ürün kodu A1091 · UPC 015561110914 · üretici hastalık önleme/tedavi amacı için 1 yemek kaşığı/37,8 L yayımlar; ancak bazı tatlı su türleri ve omurgasızlar tuza hassastır, tür toleransı ve gerçek tanı doğrulanmadan rutin genel katkı veya veteriner tedavisi gibi kullanılmamalıdır · iyotlu sofra tuzu yerine geçmez",
    sourceUrl:"https://fluvalaquatics.com/ca/shop/product/salt-23-8-oz-675-g",additionalSourceUrls:["https://fluvalaquatics.com/ca/shop/water-care/freshwater-water-care"],verifiedAt:"2026-09-29",
  },
  {
    id:"fluval-plant-gro-plus-120ml",brand:"Fluval",model:"Plant Gro+ 120 ml",category:"fertilizer",
    description:"Tatlı su akvaryum bitkileri için demir içeren, şelatlı mikro besin ve B vitamini takviyesi · 120 ml · ürün kodu A8359 · üreticinin yayımladığı toplam kullanım hacmi 5450 L · haftalık kullanım önerilir; demir düzeyini 0,3 mg/L civarında izlemek için test yapılmalıdır",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/plant-gro-4-fl-oz-120-ml",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-plant-gro-plus-250ml",brand:"Fluval",model:"Plant Gro+ 250 ml",category:"fertilizer",
    description:"Tatlı su akvaryum bitkileri için demir içeren, şelatlı mikro besin ve B vitamini takviyesi · 250 ml · ürün kodu A8360 · üreticinin yayımladığı toplam kullanım hacmi 13000 L · haftalık kullanım önerilir; demir düzeyini 0,3 mg/L civarında izlemek için test yapılmalıdır",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/plant-gro-8-4-fl-oz-250-ml",verifiedAt:"2026-09-28",
  },
  ...([2,4,8] as const).map((weightKg,index)=>{
    const itemNumbers = ["12693","12694","12695"] as const;
    const upcs = ["015561126939","015561126946","015561126953"] as const;
    return {
      id:`fluval-stratum-${weightKg}kg`,brand:"Fluval",model:`Stratum ${weightKg} kg`,category:"substrate" as const,
      description:`Bitkili tatlı su ve karides akvaryumları için Japon volkanik toprağından 3–5 mm gözenekli taban · ${weightKg} kg · ürün kodu ${itemNumbers[index]} · UPC ${upcs[index]} · nötr ile hafif asidik pH'ı destekler, suyu doğal biçimde yumuşatabilir; kurulumdan sonra amonyak ölçümü yapılmalıdır`,
      sourceUrl:"https://fluvalaquatics.com/us/shop/product/stratum",additionalSourceUrls:["https://fluvalaquatics.com/us/shop/product/stratum-series-page"],verifiedAt:"2026-09-28",
    };
  }),
  ...([2,4,8] as const).map((weightKg,index)=>{
    const itemNumbers = ["12696","12697","12698"] as const;
    const upcs = ["015561126960","015561126977","015561126984"] as const;
    return {
      id:`fluval-bio-stratum-${weightKg}kg`,brand:"Fluval",model:`Bio-Stratum ${weightKg} kg`,category:"substrate" as const,
      description:`İnce köklü bitkiler için 1–3 mm gözenekli Japon volkanik toprağı · ${weightKg} kg · ürün kodu ${itemNumbers[index]} · UPC ${upcs[index]} · kuru halde bekleyen yararlı nitrifikasyon bakterileri içerir ve nötr ile hafif asidik pH'ı destekler; biyolojik döngü ve amonyak/nitrit ölçümünün yerine geçmez`,
      sourceUrl:"https://fluvalaquatics.com/us/shop/product/bio-stratum",additionalSourceUrls:["https://fluvalaquatics.com/us/shop/product/stratum-series-page","https://www.aquaristikshop.com/download/pdf/en_information/347005.pdf"],verifiedAt:"2026-09-28",
    };
  }),
  {
    id:"fluval-betta-stratum-0-8kg",brand:"Fluval",model:"Betta Stratum 0,8 kg",category:"substrate",
    description:"Betta ve bitkili küçük tatlı su akvaryumları için 1–3 mm pürüzsüz, gözenekli volkanik taban · 0,8 kg · ürün kodu 12689 · UPC 015561126892 · yararlı bakteriler içerir; bir torba 10 L Fluval Betta Kit, iki torba 22,7 L kit için önerilir",
    sourceUrl:"https://fluvalaquatics.com/ca/shop/product/betta-stratum-1-76-lb-0-8-kg",additionalSourceUrls:["https://fluvalaquatics.com/us/shop/product/stratum-series-page","https://fluvalaquatics.com/us/wp-content/uploads/2024/12/Betta-CARE-GUIDE_EN.pdf"],verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-professional-test-kit-a7860",brand:"Fluval",model:"Professional Test Kit · 10 test",category:"test",
    description:"Tatlı ve deniz suyu parametrelerini izlemek için sert taşıma çantalı profesyonel sıvı test seti · ürün kodu A7860 · düşük/yüksek aralık pH, amonyak, GH, KH, nitrat, nitrit, kalsiyum, fosfat ve demir olmak üzere 10 test; beş cam tüp, iki pipet, kaşık, hızlı başvuru kılavuzu ve ayrı kullanım talimatları içerir · İngilizce resmî sayfa UPC 015561178600, Fransızca resmî sayfa ise Waste Control A8354 ile çakışan 015561183543 değerini yayımladığı için UPC benzersiz doğrulayıcı sayılmamalıdır · sonuçlar tek başına hastalık tanısı değildir; her reaktifin güvenlik ve bekleme talimatı ayrı izlenmelidir",
    sourceUrl:"https://fluvalaquatics.com/ca/shop/product/professional-test-kit",additionalSourceUrls:["https://fluvalaquatics.com/ca/fr/shop/product/trousse-principale-danalyse","https://fluvalaquatics.com/ca/shop/water-care/water-testing/test-kits"],verifiedAt:"2026-09-29",
  },
  {
    id:"fluval-nitrate-test-a7871",brand:"Fluval",model:"Nitrate Test Kit 0–110 mg/L · 80 test",category:"test",
    description:"Tatlı ve deniz suyunda 0–110 mg/L NO₃ ölçümü · 80 test · ürün kodu A7871 · yüksek nitrit nitrat sonucunu etkileyebilir; renk skalası ve üretici prosedürü izlenmelidir",
    sourceUrl:"https://fluvalaquatics.com/us/wp-content/uploads/2023/03/984-FL-Test-Kits_ComboWEB-Manual_Mar16_23_AB.pdf",additionalSourceUrls:["https://fluvalaquatics.com/us/shop/product/nitrate-nitrite-test-kit-reagent-1-refill","https://fluvalaquatics.com/ca/shop/water-care/water-testing/test-kits"],verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-nitrite-test-a7870",brand:"Fluval",model:"Nitrite Test Kit 0–3,3 mg/L · 75 test",category:"test",
    description:"Tatlı ve deniz suyunda 0–3,3 mg/L NO₂ ölçümü · 75 test · ürün kodu A7870 · 0,3 mg/L üzeri üretici kılavuzunda tehlikeli kabul edilir; sonuç bakım kararını destekler, tek başına teşhis değildir",
    sourceUrl:"https://fluvalaquatics.com/us/wp-content/uploads/2023/03/984-FL-Test-Kits_ComboWEB-Manual_Mar16_23_AB.pdf",additionalSourceUrls:["https://fluvalaquatics.com/us/shop/product/nitrate-nitrite-test-kit-reagent-1-refill","https://fluvalaquatics.com/ca/shop/water-care/water-testing/test-kits"],verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-iron-test-a7873",brand:"Fluval",model:"Iron Test Kit 0–1,0 mg/L · 50 test",category:"test",
    description:"Tatlı ve deniz suyunda 0–1,0 mg/L demir ölçümü · 50 test · ürün kodu A7873 · bitkili akvaryumlarda üretici 0,25–0,5 mg/L aralığını önerir; reaktifler kullanımdan önce çalkalanmalıdır",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/iron-test-kit-0-0-1-0-mg-l-50-tests",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-ph-wide-test-a7868",brand:"Fluval",model:"pH Wide Range Test Kit 4,5–9,0 · 100 test",category:"test",
    description:"Asidik ve alkali aralığı birlikte izlemek için 4,5–9,0 pH sıvı test kiti · 100 test · ürün kodu A7868 · birden fazla akvaryum veya farklı pH gerektiren canlılar için geniş aralık sunar",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/ph-wide-range-test-kit-4-5-9-0-ph-100-tests",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-ph-high-test-a7877",brand:"Fluval",model:"pH High Range Test Kit 7,4–8,6 · 125 test",category:"test",
    description:"Alkali tatlı su akvaryumları için 7,4–8,6 pH ölçüm aralığı · 125 test · ABD/uluslararası ürün kodu A7877; Kanada güncel ambalaj sayfası aynı kit için A7812 ve UPC 015561178129 yayımlar · yüksek pH isteyen canlıların suyunu izlemek içindir; bölgesel paket kodları tek envanter kodu gibi birbirinin yerine kullanılmamalıdır",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/ph-high-range-test-kit-7-4-8-6-ph-125-tests",additionalSourceUrls:["https://fluvalaquatics.com/ca/shop/product/ph-high-range-test-kit-7-4-8-6-ph-125-tests-2","https://fluvalaquatics.com/manuals/A7877_pH.pdf"],verifiedAt:"2026-09-29",
  },
  {
    id:"fluval-ph-low-test-a7810-a7874",brand:"Fluval",model:"pH Low Range Test Kit 6,0–7,6 · 225 test",category:"test",
    description:"Asidik koşulları tercih eden tropikal tatlı su balıkları için 6,0–7,6 pH ölçüm aralığı · 225 test · Kanada güncel ürün kodu A7810 ve UPC 015561178105; üreticinin uluslararası kılavuz dosyası aynı aralık ve test sayısını A7874 adıyla yayımlar · 18 ml pH reaktifi, pipet ve cam tüp içerir; üretici pH değişimini günde 0,5 birimden fazla yapmamayı belirtir; bölgesel paket kodları tek stok kodu gibi birbirinin yerine kullanılmamalıdır",
    sourceUrl:"https://fluvalaquatics.com/ca/shop/product/ph-low-range-test-kit-6-0-7-6-ph-225-tests-2",additionalSourceUrls:["https://fluvalaquatics.com/manuals/A7874_pH.pdf","https://fluvalaquatics.com/ca/shop/water-care/water-testing/test-kits"],verifiedAt:"2026-09-29",
  },
  {
    id:"fluval-phosphate-test-a7872",brand:"Fluval",model:"Phosphate Test Kit 0–5,0 mg/L · 75 test",category:"test",
    description:"Tatlı ve deniz suyunda 0–5,0 mg/L PO₄ ölçümü · 75 test · ürün kodu A7872 · üretici 1 mg/L üzerindeki değerin alg büyümesini destekleyebileceğini belirtir; reaktif güvenlik talimatları izlenmelidir",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/phosphate-test-kit-0-0-5-0-mg-l-75-tests",additionalSourceUrls:["https://fluvalaquatics.com/manuals/A7872_Manual_Map.pdf"],verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-ammonia-test-a7869",brand:"Fluval",model:"Ammonia Test Kit 0–6,1 mg/L · 50 test",category:"test",
    description:"Tatlı ve deniz suyunda 0–6,1 mg/L amonyak ölçümü · 50 test · ABD güncel yedek reaktif uyumluluğunda ürün kodu A7869; Kanada sayfasındaki A7855 bölgesel/eski paket kodudur · üreticinin değiştirilmiş indofenol yöntemi 20 dakika sonuç süresi ister; pH ve sıcaklıkla birlikte yorumlanmalıdır",
    sourceUrl:"https://fluvalaquatics.com/us/wp-content/uploads/2023/03/984-FL-Test-Kits_ComboWEB-Manual_Mar16_23_AB.pdf",additionalSourceUrls:["https://fluvalaquatics.com/us/shop/product/ammonia-test-kit-reagent-1-refill","https://fluvalaquatics.com/ca/shop/product/ammonia-test-kit-0-0-61-mg-l-50-tests-2"],verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-kh-gh-test-a7876",brand:"Fluval",model:"KH/GH Test Kit",category:"test",
    description:"Tatlı suda genel sertlik (GH), tatlı ve deniz suyunda karbonat sertliği (KH) için titrasyon testi · ürün kodu A7876 · GH sonucu damla sayısı ×20, KH sonucu damla sayısı ×10 mg/L CaCO₃ olarak hesaplanır; reaktifler yanıcı/toksik uyarıları taşır ve güvenlik talimatları izlenmelidir",
    sourceUrl:"https://fluvalaquatics.com/manuals/A7876_KH_GH_Fresh-Salt-2018-FCB.pdf",additionalSourceUrls:["https://fluvalaquatics.com/us/shop/product/kh-test-kit-reagent-refill","https://fluvalaquatics.com/us/shop/product/gh-test-kit-reagent-refill"],verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-calcium-test-a7875",brand:"Fluval",model:"Calcium Test Kit",category:"test",
    description:"Tatlı ve deniz suyunda kalsiyumu damla titrasyonuyla ölçen test · ABD/uluslararası ürün kodu A7875; Kanada güncel ambalaj sayfası aynı üç reaktifli kit için A7850 ve UPC 015561178501 yayımlar · sonuç kullanılan üçüncü reaktif damla sayısı ×20 mg/L Ca²⁺ olarak hesaplanır; 20 mg/L altını hassas ölçmek için tasarlanmamıştır ve aşındırıcı reaktif güvenliği izlenmelidir · bölgesel paket kodları tek stok kodu gibi birbirinin yerine kullanılmamalıdır",
    sourceUrl:"https://fluvalaquatics.com/manuals/A7875_Calcium_Fresh-Salt-2018-FCB.pdf",additionalSourceUrls:["https://fluvalaquatics.com/us/shop/product/calcium-test-kit-reagent-3-refill","https://fluvalaquatics.com/ca/shop/product/calcium-test-kit-2"],verifiedAt:"2026-09-29",
  },
  {
    id:"fluval-ammonia-reagent-1-a7856",brand:"Fluval",model:"Ammonia Test Kit Reagent #1 Refill",category:"test",
    description:"Fluval A7869 Ammonia Test Kit için birinci yedek reaktif · ürün kodu A7856 · UPC 015561178563 · tek başına test kiti, renk skalası veya sonuç üretmez; yalnız ilgili kitin diğer iki reaktifi, tüpü ve güncel kullanım/güvenlik talimatıyla birlikte kullanılmalıdır",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/ammonia-test-kit-reagent-1-refill",additionalSourceUrls:["https://fluvalaquatics.com/ca/fr/shop/product/trousse-principale-danalyse"],verifiedAt:"2026-09-29",
  },
  {
    id:"fluval-iron-reagent-1-a7836",brand:"Fluval",model:"Iron Test Kit Reagent #1 Refill",category:"test",
    description:"Fluval A7873 Iron Test Kit için 7,5 ml birinci yedek reaktif · ürün kodu A7836 · UPC 015561178365 · tek başına test kiti veya sonuç üretmez; ikinci reaktif, tüp, renk skalası ve güncel kullanım/güvenlik talimatıyla birlikte kullanılmalıdır",
    sourceUrl:"https://fluvalaquatics.com/ca/shop/product/iron-test-kit-reagent-1-refill",additionalSourceUrls:["https://fluvalaquatics.com/ca/fr/shop/product/trousse-principale-danalyse"],verifiedAt:"2026-09-29",
  },
  {
    id:"fluval-ph-high-reagent-a7813",brand:"Fluval",model:"pH High Range Test Kit Reagent Refill",category:"test",
    description:"Fluval A7877 pH High Range Test Kit için 15 ml yedek reaktif · ürün kodu A7813 · UPC 015561178136 · tek başına test kiti, tüp veya renk skalası içermez; yalnız 7,4–8,6 pH kitinin güncel kullanım/güvenlik talimatıyla kullanılmalıdır",
    sourceUrl:"https://fluvalaquatics.com/ca/shop/product/ph-high-range-test-kit-reagent-refill",additionalSourceUrls:["https://fluvalaquatics.com/manuals/A7877_pH.pdf"],verifiedAt:"2026-09-29",
  },
  {
    id:"fluval-ph-wide-reagent-a7816",brand:"Fluval",model:"pH Wide Range Test Kit Reagent Refill",category:"test",
    description:"Fluval A7868 pH Wide Range Test Kit için yedek reaktif · ürün kodu A7816 · UPC 015561178167 · tek başına test kiti, tüp veya renk skalası içermez; yalnız 4,5–9,0 pH kitinin güncel kullanım/güvenlik talimatıyla kullanılmalıdır",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/ph-wide-range-test-kit-reagent-refill",additionalSourceUrls:["https://fluvalaquatics.com/manuals/A7868_pH_Wide_Fresh-Salt-2018-FCB.pdf"],verifiedAt:"2026-09-29",
  },
  {
    id:"fluval-kh-reagent-a7831",brand:"Fluval",model:"KH Test Kit Reagent Refill",category:"test",
    description:"Fluval A7876 KH/GH Test Kit için 15 ml karbonat sertliği yedek reaktifi · ürün kodu A7831 · UPC 015561178310 · tek başına tam test kiti değildir ve yalnız KH bölümünü tamamlar; GH reaktifi, tüp ve kılavuz içermez, damla hesabı ilgili kitin güncel kullanım/güvenlik talimatıyla yapılmalıdır",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/kh-test-kit-reagent-refill",additionalSourceUrls:["https://fluvalaquatics.com/manuals/A7876_KH_GH_Fresh-Salt-2018-FCB.pdf"],verifiedAt:"2026-09-29",
  },
  {
    id:"fluval-nitrate-nitrite-reagent-2-a7847",brand:"Fluval",model:"Nitrate & Nitrite Test Kit Reagent #2 Refill",category:"test",
    description:"Fluval A7870 Nitrite ve A7871 Nitrate test kitleri için ortak ikinci yedek reaktif · ürün kodu A7847 · UPC 015561178471 · tek başına ölçüm veya sonuç üretmez; ilgili testin diğer reaktifleri, tüpü, renk skalası ve güncel güvenlik talimatıyla birlikte kullanılmalıdır",
    sourceUrl:"https://fluvalaquatics.com/ca/shop/product/nitrate-nitrite-test-kit-reagent-2-refill",additionalSourceUrls:["https://fluvalaquatics.com/manuals/A7870_Manual_Map.pdf","https://fluvalaquatics.com/manuals/A7871_Manual_Map.pdf"],verifiedAt:"2026-09-29",
  },
  {
    id:"fluval-phosphate-reagent-1-a7841",brand:"Fluval",model:"Phosphate Test Kit Reagent #1 Refill",category:"test",
    description:"Fluval A7872 Phosphate Test Kit için 10 ml birinci yedek reaktif · ürün kodu A7841 · UPC 015561178419 · yüzde 10 sülfürik asit içerir; tek başına sonuç üretmez, cilt/göz temasından kaçınılarak diğer iki reaktif ve resmî güvenlik talimatıyla kullanılmalıdır",
    sourceUrl:"https://fluvalaquatics.com/ca/shop/product/phosphate-test-kit-reagent-1-refill",additionalSourceUrls:["https://fluvalaquatics.com/manuals/A7872_Manual_Map.pdf"],verifiedAt:"2026-09-29",
  },
  {
    id:"fluval-phosphate-reagent-3-a7843",brand:"Fluval",model:"Phosphate Test Kit Reagent #3 Refill",category:"test",
    description:"Fluval A7872 Phosphate Test Kit için 10 ml üçüncü yedek reaktif · ürün kodu A7843 · UPC 015561178433 · tek başına ölçüm veya sonuç üretmez; diğer iki reaktif, tüp, renk skalası ve güncel kullanım/güvenlik talimatıyla birlikte kullanılmalıdır",
    sourceUrl:"https://fluvalaquatics.com/ca/shop/product/phosphate-test-kit-reagent-3-refill",additionalSourceUrls:["https://fluvalaquatics.com/manuals/A7872_Manual_Map.pdf"],verifiedAt:"2026-09-29",
  },
  {
    id:"fluval-nitrate-nitrite-reagent-1-a7846",brand:"Fluval",model:"Nitrate & Nitrite Test Kit Reagent #1 Refill",category:"test",
    description:"Fluval A7870 Nitrite ve A7871 Nitrate test kitleri için ortak 17 ml birinci yedek reaktif · ürün kodu A7846 · UPC 015561178464 · 4-aminobenzenesülfonik asit içerir ve alerjik reaksiyona yol açabilir; tek başına sonuç üretmez, ilgili testin diğer reaktifleri, tüpü, renk skalası ve güncel güvenlik talimatıyla birlikte kullanılmalıdır",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/nitrate-nitrite-test-kit-reagent-1-refill",additionalSourceUrls:["https://fluvalaquatics.com/ca/shop/water-care/water-testing/reagent-refills","https://fluvalaquatics.com/manuals/A7870_Manual_Map.pdf","https://fluvalaquatics.com/manuals/A7871_Manual_Map.pdf"],verifiedAt:"2026-09-30",
  },
  {
    id:"fluval-ammonia-reagent-2-a7857",brand:"Fluval",model:"Ammonia Test Kit Reagent #2 Refill",category:"test",
    description:"Fluval A7869 Ammonia Test Kit için 15 ml ikinci yedek reaktif · ürün kodu A7857 · UPC 015561178570 · sodyum hidroksit içerir ve aşındırıcıdır; tek başına test veya sonuç üretmez, birinci ve üçüncü reaktif, tüp, renk skalası ve güncel güvenlik talimatıyla birlikte kullanılmalıdır",
    sourceUrl:"https://fluvalaquatics.com/ca/shop/product/ammonia-test-kit-reagent-2-refill",additionalSourceUrls:["https://fluvalaquatics.com/ca/shop/water-care/water-testing/reagent-refills","https://fluvalaquatics.com/manuals/A7869_Manual_Map.pdf"],verifiedAt:"2026-09-30",
  },
  {
    id:"fluval-ammonia-reagent-3-a7858",brand:"Fluval",model:"Ammonia Test Kit Reagent #3 Refill",category:"test",
    description:"Fluval A7869 Ammonia Test Kit için 10 ml üçüncü yedek reaktif · ürün kodu A7858 · UPC 015561178587 · fenol içerir; yanıcı, aşındırıcı ve toksik uyarıları taşır, yalnız iyi havalandırılan alanda güncel güvenlik talimatıyla kullanılmalıdır · tek başına test veya sonuç üretmez ve diğer iki reaktif gereklidir",
    sourceUrl:"https://fluvalaquatics.com/ca/shop/product/ammonia-test-kit-reagent-3-refill",additionalSourceUrls:["https://fluvalaquatics.com/ca/shop/water-care/water-testing/reagent-refills","https://fluvalaquatics.com/manuals/A7869_Manual_Map.pdf"],verifiedAt:"2026-09-30",
  },
  {
    id:"fluval-calcium-reagent-1-a7851",brand:"Fluval",model:"Calcium Test Kit Reagent #1 Refill",category:"test",
    description:"Fluval A7875 Calcium Test Kit için 15 ml birinci yedek reaktif · ürün kodu A7851 · UPC 015561178518 · tek başına kalsiyum sonucu üretmez; ikinci ve üçüncü reaktif, pipet, cam tüp ve güncel kullanım/güvenlik talimatıyla birlikte kullanılmalıdır",
    sourceUrl:"https://fluvalaquatics.com/ca/shop/product/calcium-test-kit-reagent-1-refill",additionalSourceUrls:["https://fluvalaquatics.com/ca/shop/water-care/water-testing/reagent-refills","https://fluvalaquatics.com/manuals/A7875_Calcium_Fresh-Salt-2018-FCB.pdf"],verifiedAt:"2026-09-30",
  },
  {
    id:"fluval-calcium-reagent-2-a7852",brand:"Fluval",model:"Calcium Test Kit Reagent #2 Refill",category:"test",
    description:"Fluval A7875 Calcium Test Kit için 6 ml ikinci yedek reaktif · ürün kodu A7852 · üreticinin güncel dizini ayrı yedek ürünü ve uyumluluğu yayımlar ancak ürün sayfasından güvenle doğrulanabilen UPC kaydı bulunmadığı için numara tahmin edilmemiştir · tek başına sonuç üretmez; diğer iki reaktif, pipet, cam tüp ve güncel güvenlik talimatı gereklidir",
    sourceUrl:"https://fluvalaquatics.com/ca/shop/water-care/water-testing/reagent-refills",additionalSourceUrls:["https://fluvalaquatics.com/ca/fr/shop/product/trousse-principale-danalyse","https://fluvalaquatics.com/manuals/A7875_Calcium_Fresh-Salt-2018-FCB.pdf"],verifiedAt:"2026-09-30",
  },
  {
    id:"fluval-calcium-reagent-3-a7853",brand:"Fluval",model:"Calcium Test Kit Reagent #3 Refill",category:"test",
    description:"Fluval A7875 Calcium Test Kit için 18 ml üçüncü yedek reaktif · ürün kodu A7853 · UPC 015561178532 · tek başına kalsiyum sonucu üretmez; birinci ve ikinci reaktif, pipet, cam tüp ve güncel kullanım/güvenlik talimatıyla birlikte kullanılmalıdır",
    sourceUrl:"https://fluvalaquatics.com/ca/shop/product/calcium-test-kit-reagent-3-refill",additionalSourceUrls:["https://fluvalaquatics.com/ca/shop/water-care/water-testing/reagent-refills","https://fluvalaquatics.com/manuals/A7875_Calcium_Fresh-Salt-2018-FCB.pdf"],verifiedAt:"2026-09-30",
  },
  {
    id:"fluval-iron-reagent-2-a7837",brand:"Fluval",model:"Iron Test Kit Reagent #2 Refill",category:"test",
    description:"Fluval A7873 Iron Test Kit için 5 g ikinci yedek toz reaktif · ürün kodu A7837 · üreticinin güncel dizini ayrı yedek ürünü ve uyumluluğu yayımlar ancak ürün sayfasından güvenle doğrulanabilen UPC kaydı bulunmadığı için numara tahmin edilmemiştir · tek başına test değildir; şelatlı demir ölçümünde birinci reaktif, ölçü kaşığı, tüp, renk skalası ve 30 dakikalık bekleme talimatıyla kullanılmalıdır",
    sourceUrl:"https://fluvalaquatics.com/ca/shop/water-care/water-testing/reagent-refills",additionalSourceUrls:["https://fluvalaquatics.com/ca/fr/shop/product/trousse-principale-danalyse","https://fluvalaquatics.com/manuals/A7873_Iron_Fresh-Salt-2018-FCB.pdf"],verifiedAt:"2026-09-30",
  },
  {
    id:"fluval-nitrate-reagent-3-a7848",brand:"Fluval",model:"Nitrate Test Kit Reagent #3 Refill",category:"test",
    description:"Fluval A7871 Nitrate Test Kit için 10,5 ml üçüncü yedek reaktif · ürün kodu A7848 · UPC 015561178488 · yüzde 75 etoksidiglikol içerir ve gözleri tahriş eder; kullanımdan önce şişe 30 saniye kuvvetle çalkalanmalıdır · tek başına sonuç üretmez, ortak birinci ve ikinci reaktif, tüp, renk skalası ve güncel güvenlik talimatı gereklidir",
    sourceUrl:"https://fluvalaquatics.com/ca/shop/product/nitrate-test-kit-reagent-3-refill",additionalSourceUrls:["https://fluvalaquatics.com/ca/shop/water-care/water-testing/reagent-refills","https://fluvalaquatics.com/manuals/A7871_Manual_Map.pdf"],verifiedAt:"2026-09-30",
  },
  {
    id:"fluval-ph-low-reagent-a7811",brand:"Fluval",model:"pH Low Range Test Kit Reagent Refill",category:"test",
    description:"Fluval A7874 pH Low Range Test Kit için 18 ml yedek reaktif · ürün kodu A7811 · UPC 015561178112 · tek başına test kiti, cam tüp veya renk skalası içermez; yalnız 6,0–7,6 pH aralığındaki uyumlu kitin güncel kullanım/güvenlik talimatıyla kullanılmalıdır",
    sourceUrl:"https://fluvalaquatics.com/ca/shop/product/ph-low-range-test-kit-reagent-refill",additionalSourceUrls:["https://fluvalaquatics.com/ca/shop/water-care/water-testing/reagent-refills","https://fluvalaquatics.com/manuals/A7874_pH.pdf"],verifiedAt:"2026-09-30",
  },
  {
    id:"fluval-bug-bites-betta-micro-granules-a6575-30g",brand:"Fluval",model:"Bug Bites Betta Micro Granules 30 g",category:"food",
    description:"Betta için 0,25–1,0 mm yavaş batan mikro granül · 30 g · ürün kodu A6575 · UPC 015561165754 · ilk bileşen kara asker sineği larvasıdır ve formül %40'a kadar larva ile somon, vitamin, aminoasit ve mineral içerir; tek tip yem yerine uygun çeşitlilik ve balığın tüketebileceği miktar gözetilmelidir",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/bug-bites-betta-micro-granules-1-05-oz-30-g",verifiedAt:"2026-09-29",
  },
  {
    id:"fluval-bug-bites-goldfish-granules-a6583-45g",brand:"Fluval",model:"Bug Bites Goldfish Granules 45 g",category:"food",
    description:"Japon balıkları için lifçe zengin granül yem · 45 g · ürün kodu A6583 · UPC 015561165839 · soğuk su türlerinin sindirim gereksinimlerine göre hazırlanmış, sarı-turuncu-kırmızı pigmentleri desteklemek için kadife çiçeği özü içeren günlük formüldür; fazla yemleme yapılmamalıdır",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/bug-bites-goldfish-granules-1-6-oz-45-g",verifiedAt:"2026-09-29",
  },
  {
    id:"fluval-bug-bites-tropical-granules-a6578-45g",brand:"Fluval",model:"Bug Bites Tropical Granules 45 g",category:"food",
    description:"Tropikal balıklar için 1,4–2,0 mm yavaş batan granül · 45 g · ürün kodu A6578 · UPC 015561165785 · %40'a kadar kara asker sineği larvası ile somon içeren, %40 ham proteinli formül; üretici günde iki-üç kez yalnız iki dakikada tüketilecek miktarı önerir",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/bug-bites-tropical-granules-1-6-oz-45-g",verifiedAt:"2026-09-29",
  },
  {
    id:"fluval-bug-bites-betta-flakes-a7366-18g",brand:"Fluval",model:"Bug Bites Betta Flakes 18 g",category:"food",
    description:"Betta için pul yem · 18 g · ürün kodu A7366 · UPC 015561173667 · ilk bileşen kara asker sineği larvasıdır; krill ve karides lezzet ile renk desteği sağlar, ancak üretici dondurulmuş veya canlı uygun yemlerle beslenme çeşitliliğini de önerir",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/bug-bites-betta-flakes-0-63-oz-18-g",verifiedAt:"2026-09-29",
  },
  {
    id:"fluval-bug-bites-tropical-flakes-a7330-18g",brand:"Fluval",model:"Bug Bites Tropical Flakes 18 g",category:"food",
    description:"Yüzeyden beslenen tropikal balıklar için pul yem · 18 g · ürün kodu A7330 · UPC 015561173308 · ilk bileşen kara asker sineği larvası olan formül %46 ham protein ile Omega 3 ve 6 içerir; yapay dolgu ve koruyucu eklenmediği üretici tarafından belirtilir, fazla yemleme yapılmamalıdır",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/bug-bites-tropical-flakes-0-63oz-18-g",verifiedAt:"2026-09-29",
  },
  {
    id:"fluval-bug-bites-tropical-flakes-a7331-45g",brand:"Fluval",model:"Bug Bites Tropical Flakes 45 g",category:"food",
    description:"Yüzeyden beslenen tropikal balıklar için pul yem · 45 g · ürün kodu A7331 · UPC 015561173315 · ilk bileşen kara asker sineği larvası olan formül %46 ham protein ile Omega 3 ve 6 içerir; yapay dolgu ve koruyucu eklenmediği üretici tarafından belirtilir, fazla yemleme yapılmamalıdır",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/bug-bites-tropical-flakes-1-58-oz-45-g",verifiedAt:"2026-09-29",
  },
  {
    id:"fluval-bug-bites-tropical-flakes-a7332-90g",brand:"Fluval",model:"Bug Bites Tropical Flakes 90 g",category:"food",
    description:"Yüzeyden beslenen tropikal balıklar için pul yem · 90 g · ürün kodu A7332 · UPC 015561173322 · ilk bileşen kara asker sineği larvası olan formül %46 ham protein ile Omega 3 ve 6 içerir; yapay dolgu ve koruyucu eklenmediği üretici tarafından belirtilir, fazla yemleme yapılmamalıdır",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/bug-bites-tropical-flakes-3-17-oz-90-g",verifiedAt:"2026-09-29",
  },
  {
    id:"fluval-bug-bites-tropical-flakes-a7334-1kg",brand:"Fluval",model:"Bug Bites Tropical Flakes 1 kg",category:"food",
    description:"Yüzeyden beslenen tropikal balıklar için toplu pul yem · 1 kg · ürün kodu A7334 · UPC 015561173346 · ilk bileşen kara asker sineği larvası olan formül %46 ham protein ile Omega 3 ve 6 içerir; yapay dolgu ve koruyucu eklenmediği üretici tarafından belirtilir, fazla yemleme yapılmamalıdır",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/bug-bites-tropical-flakes-2-2-lb-1-kg",verifiedAt:"2026-09-29",
  },
  {
    id:"fluval-bug-bites-tropical-micro-granules-a6577-45g",brand:"Fluval",model:"Bug Bites Tropical Micro Granules 45 g",category:"food",
    description:"Küçük tropikal balıklar için 0,25–1,4 mm yavaş batan mikro granül · 45 g · ürün kodu A6577 · UPC 015561165778 · %40'a kadar kara asker sineği larvası ile somon, vitamin, aminoasit ve mineral içerir; balık boyuna uygun granül ve tüketilebilecek porsiyon seçilmelidir",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/bug-bites-tropical-micro-granules-1-6-oz-45-g",verifiedAt:"2026-09-29",
  },
  {
    id:"fluval-bug-bites-goldfish-flakes-a7339-45g",brand:"Fluval",model:"Bug Bites Goldfish Flakes 45 g",category:"food",
    description:"Japon balıkları için lifçe zengin pul yem · 45 g · ürün kodu A7339 · UPC 015561173391 · %33 ham protein, kara asker sineği larvası ve renk desteği için kadife çiçeği özü içerir; üretici günde iki-üç kez yalnız iki dakikada tüketilecek miktarı önerir",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/bug-bites-goldfish-flakes-1-58-oz-45-g",verifiedAt:"2026-09-29",
  },
  {
    id:"fluval-bug-bites-goldfish-flakes-a7338-18g",brand:"Fluval",model:"Bug Bites Goldfish Flakes 18 g",category:"food",
    description:"Japon balıkları için lifçe zengin pul yem · 18 g · ürün kodu A7338 · UPC 015561173384 · %33 ham protein, kara asker sineği larvası ve renk desteği için kadife çiçeği özü içerir; üretici günde iki-üç kez yalnız iki dakikada tüketilecek miktarı önerir",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/bug-bites-goldfish-flakes-0-63oz-18-g",verifiedAt:"2026-09-29",
  },
  {
    id:"fluval-bug-bites-goldfish-flakes-a7340-90g",brand:"Fluval",model:"Bug Bites Goldfish Flakes 90 g",category:"food",
    description:"Japon balıkları için lifçe zengin pul yem · 90 g · ürün kodu A7340 · UPC 015561173407 · %33 ham protein, kara asker sineği larvası ve renk desteği için kadife çiçeği özü içerir; üretici günde iki-üç kez yalnız iki dakikada tüketilecek miktarı önerir",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/bug-bites-goldfish-flakes-3-17-oz-90-g",verifiedAt:"2026-09-29",
  },
  {
    id:"fluval-bug-bites-goldfish-flakes-a7342-1kg",brand:"Fluval",model:"Bug Bites Goldfish Flakes 1 kg",category:"food",
    description:"Japon balıkları için lifçe zengin toplu pul yem · 1 kg · ürün kodu A7342 · UPC 015561173421 · %33 ham protein, kara asker sineği larvası ve renk desteği için kadife çiçeği özü içerir; üretici günde iki-üç kez yalnız iki dakikada tüketilecek miktarı önerir",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/bug-bites-goldfish-flakes-2-2-lb-1-kg",verifiedAt:"2026-09-29",
  },
  {
    id:"fluval-bug-bites-cichlid-pellets-a6595-1-7kg",brand:"Fluval",model:"Bug Bites Cichlid Pellets 1,7 kg",category:"food",
    description:"Büyük ve aktif cikletler için 5–7 mm yavaş batan pelet · 1,7 kg · ürün kodu A6595 · UPC 015561165952 · %40'a kadar kara asker sineği larvası içeren %40 ham proteinli formül; üretici günde iki-üç kez yalnız iki dakikada tüketilecek miktarı önerir",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/bug-bites-cichlid-pellets-3-7-lb-1-7-kg",verifiedAt:"2026-09-29",
  },
  {
    id:"fluval-bug-bites-shrimp-micro-granules-a6931-30g",brand:"Fluval",model:"Bug Bites Shrimp Micro Granules 30 g",category:"food",
    description:"Tatlı su karidesleri için 0,25–1,0 mm yavaş batan mikro granül · 30 g · ürün kodu A6931 · UPC 015561169318 · %32'ye kadar kara asker sineği larvası, vitamin D ve kalsiyum içeren dış iskelet destekli formül; üretici günde bir kez yalnız iki dakikada tüketilecek miktarı önerir",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/bug-bites-shrimp-micro-granules-1-05-oz-30-g",verifiedAt:"2026-09-29",
  },
  {
    id:"fluval-bug-bites-bottom-feeder-granules-a6586-45g",brand:"Fluval",model:"Bug Bites Bottom Feeder Granules 45 g",category:"food",
    description:"Pleco ve Ancistrus gibi dipten beslenen balıklar için lifçe zengin 1,4–2,0 mm batan granül · 45 g · ürün kodu A6586 · UPC 015561165860 · %40'a kadar kara asker sineği larvası içeren formül; üretici günde iki-üç kez yalnız iki dakikada tüketilecek miktarı önerir",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/bug-bites-bottom-feeder-granules-1-6-oz-45-g",verifiedAt:"2026-09-29",
  },
  {
    id:"fluval-bug-bites-cichlid-granules-a6580-45g",brand:"Fluval",model:"Bug Bites Cichlid Granules 45 g",category:"food",
    description:"Aktif ve agresif cikletler için 1,4–2,0 mm yavaş batan granül · 45 g · ürün kodu A6580 · UPC 015561165808 · %40'a kadar kara asker sineği larvası içeren büyüme, kondisyon ve gövde-yüzgeç onarımını destekleyen formül; üretici günde iki-üç kez yalnız iki dakikada tüketilecek miktarı önerir",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/bug-bites-cichlid-granules-1-6-oz-45-g",verifiedAt:"2026-09-29",
  },
  {
    id:"fluval-bug-bites-color-enhancing-flakes-a7346-18g",brand:"Fluval",model:"Bug Bites Color Enhancing Flakes 18 g",category:"food",
    description:"Tropikal balıkların renk desteği için pul yem · 18 g · ürün kodu A7346 · UPC 015561173469 · ilk bileşen kara asker sineği larvası olan %46 ham proteinli formül karides unu ve astaksantin içerir; üretici günde iki-üç kez yalnız iki dakikada tüketilecek miktarı önerir",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/bug-bites-color-enhancing-flakes-0-63oz-18-g",verifiedAt:"2026-09-29",
  },
  {
    id:"fluval-bug-bites-color-enhancing-flakes-a7347-45g",brand:"Fluval",model:"Bug Bites Color Enhancing Flakes 45 g",category:"food",
    description:"Tropikal balıkların renk desteği için pul yem · 45 g · ürün kodu A7347 · UPC 015561173476 · ilk bileşen kara asker sineği larvası olan %46 ham proteinli formül karides unu ve astaksantin içerir; üretici günde iki-üç kez yalnız iki dakikada tüketilecek miktarı önerir",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/bug-bites-color-enhancing-flakes-1-58-oz-45-g",verifiedAt:"2026-09-29",
  },
  {
    id:"fluval-bug-bites-color-enhancing-flakes-a7348-90g",brand:"Fluval",model:"Bug Bites Color Enhancing Flakes 90 g",category:"food",
    description:"Tropikal balıkların renk desteği için pul yem · 90 g · ürün kodu A7348 · UPC 015561173483 · ilk bileşen kara asker sineği larvası olan %46 ham proteinli formül karides unu ve astaksantin içerir; üretici günde iki-üç kez yalnız iki dakikada tüketilecek miktarı önerir",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/bug-bites-color-enhancing-flakes-3-17-oz-90-g",verifiedAt:"2026-09-29",
  },
  {
    id:"fluval-bug-bites-color-enhancing-flakes-a7350-1kg",brand:"Fluval",model:"Bug Bites Color Enhancing Flakes 1 kg",category:"food",
    description:"Tropikal balıkların renk desteği için toplu pul yem · 1 kg · ürün kodu A7350 · UPC 015561173506 · ilk bileşen kara asker sineği larvası olan %46 ham proteinli formül karides unu ve astaksantin içerir; üretici günde iki-üç kez yalnız iki dakikada tüketilecek miktarı önerir",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/bug-bites-color-enhancing-flakes-2-2-lb-1-kg",verifiedAt:"2026-09-29",
  },
  {
    id:"fluval-bug-bites-color-enhancing-granules-a6589-45g",brand:"Fluval",model:"Bug Bites Color Enhancing Granules 45 g",category:"food",
    description:"Tropikal balıkların renk desteği için 1,4–2,0 mm yavaş batan granül · 45 g · ürün kodu A6589 · UPC 015561165891 · %45'e kadar kara asker sineği larvası içeren %45 ham proteinli formül karides unu ve astaksantin içerir; üretici günde iki-üç kez yalnız iki dakikada tüketilecek miktarı önerir",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/bug-bites-color-enhancing-granules-1-6-oz-45-g-2",verifiedAt:"2026-09-29",
  },
  {
    id:"fluval-bug-bites-color-enhancing-granules-a6590-125g",brand:"Fluval",model:"Bug Bites Color Enhancing Granules 125 g",category:"food",
    description:"Tropikal balıkların renk desteği için 1,4–2,0 mm yavaş batan granül · 125 g · ürün kodu A6590 · UPC 015561165907 · %45'e kadar kara asker sineği larvası içeren %45 ham proteinli formül karides unu ve astaksantin içerir; üretici günde iki-üç kez yalnız iki dakikada tüketilecek miktarı önerir",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/bug-bites-color-enhancing-granules-4-4-oz-125-g-2",verifiedAt:"2026-09-29",
  },
  {
    id:"fluval-bug-bites-color-enhancing-granules-a6599-2kg",brand:"Fluval",model:"Bug Bites Color Enhancing Granules 2 kg",category:"food",
    description:"Tropikal balıkların renk desteği için 1,4–2,0 mm yavaş batan toplu granül · 2 kg · ürün kodu A6599 · UPC 015561165990 · %45'e kadar kara asker sineği larvası içeren %45 ham proteinli formül karides unu ve astaksantin içerir; üretici günde iki-üç kez yalnız iki dakikada tüketilecek miktarı önerir",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/bug-bites-color-enhancing-granules-4-4-lb-2-kg-2",verifiedAt:"2026-09-29",
  },
  {
    id:"fluval-bug-bites-cichlid-pellets-a6581-100g",brand:"Fluval",model:"Bug Bites Cichlid Pellets 100 g",category:"food",
    description:"Büyük ve aktif cikletler için 5–7 mm yavaş batan pelet · 100 g · ürün kodu A6581 · UPC 015561165815 · %40'a kadar kara asker sineği larvası içeren %40 ham proteinli formül; üretici günde iki-üç kez yalnız iki dakikada tüketilecek miktarı önerir",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/bug-bites-cichlid-pellets-3-52-oz-100-g",verifiedAt:"2026-09-29",
  },
  {
    id:"fluval-bug-bites-cichlid-pellets-a6582-450g",brand:"Fluval",model:"Bug Bites Cichlid Pellets 450 g",category:"food",
    description:"Büyük ve aktif cikletler için 5–7 mm yavaş batan pelet · 450 g · ürün kodu A6582 · UPC 015561165983 · %40'a kadar kara asker sineği larvası içeren %40 ham proteinli formül; üretici günde iki-üç kez yalnız iki dakikada tüketilecek miktarı önerir",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/bug-bites-cichlid-pellets-15-8-oz-450-g-2",verifiedAt:"2026-09-29",
  },
  {
    id:"fluval-bug-bites-pleco-sticks-a6587-130g",brand:"Fluval",model:"Bug Bites Pleco Sticks 130 g",category:"food",
    description:"Pleco ve Ancistrus türleri için 17–20 mm batan stick yem · 130 g · ürün kodu A6587 · UPC 015561165877 · %40'a kadar kara asker sineği larvası ile hayvansal protein, sebze ve lif içeren uzun süre dayanıklı formül; üretici günde iki-üç kez yalnız iki dakikada tüketilecek miktarı önerir",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/bug-bites-pleco-sticks-4-6-oz-130-g",verifiedAt:"2026-09-29",
  },
  {
    id:"fluval-bug-bites-cichlid-granules-a6598-1-7kg",brand:"Fluval",model:"Bug Bites Cichlid Granules 1,7 kg",category:"food",
    description:"Aktif ve agresif cikletler için 1,4–2,0 mm yavaş batan toplu granül · 1,7 kg · ürün kodu A6598 · üretici sayfasındaki UPC 015561165983, Cichlid Pellets A6582 sayfasında da yayımlandığından benzersiz doğrulayıcı sayılmamıştır · %40'a kadar kara asker sineği larvası ve %40 ham protein içerir; günde iki-üç kez yalnız iki dakikada tüketilecek miktar önerilir",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/bug-bites-cichlid-granules-3-7-lb-1-7-kg",verifiedAt:"2026-09-29",
  },
  {
    id:"fluval-bug-bites-turtle-pellets-a6592-45g",brand:"Fluval",model:"Bug Bites Turtle Pellets 45 g",category:"food",
    description:"Su kaplumbağaları için 5–7 mm yüzen pelet · 45 g · ürün kodu A6592 · UPC 015561165921 · %40'a kadar kara asker sineği larvası, yumurta ve kabuk desteği için vitamin D3 içeren %38 ham proteinli formül; üretici günde iki-üç kez yalnız iki dakikada tüketilecek miktarı önerir",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/bug-bites-turtle-pellets-1-6-oz-45-g",verifiedAt:"2026-09-29",
  },
  {
    id:"fluval-bug-bites-turtle-sticks-a6593-100g",brand:"Fluval",model:"Bug Bites Turtle Sticks 100 g",category:"food",
    description:"Su kaplumbağaları için 17–20 mm yüzen stick yem · 100 g · ürün kodu A6593 · UPC 015561165938 · %40'a kadar kara asker sineği larvası, yumurta ve kabuk desteği için vitamin D3 içeren %38 ham proteinli formül; üretici günde iki-üç kez yalnız iki dakikada tüketilecek miktarı önerir",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/bug-bites-turtle-sticks-3-52-oz-100-g",verifiedAt:"2026-09-29",
  },
  {
    id:"fluval-bug-bites-turtle-sticks-a6596-1-7kg",brand:"Fluval",model:"Bug Bites Turtle Sticks 1,7 kg",category:"food",
    description:"Su kaplumbağaları için 17–20 mm yüzen toplu stick yem · 1,7 kg · ürün kodu A6596 · UPC 015561165969 · %40'a kadar kara asker sineği larvası, yumurta ve kabuk desteği için vitamin D3 içeren %38 ham proteinli formül; üretici günde iki-üç kez yalnız iki dakikada tüketilecek miktarı önerir",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/bug-bites-turtle-sticks-3-7-lb-1-7-kg",verifiedAt:"2026-09-29",
  },
  {
    id:"fluval-bug-bites-algae-crisps-a7360-40g",brand:"Fluval",model:"Bug Bites Algae Crisps 40 g",category:"food",
    description:"Pleco ve Ancistrus türleri için uzun süre dayanıklı alg crisp yemi · 40 g · ürün kodu A7360 · UPC 015561173605 · kara asker sineği larvası, Hawaii spirulinası ve kelp içeren %43,5 ham proteinli bitkisel-hayvansal formül; üretici günde iki-üç kez yalnız iki dakikada tüketilecek miktarı önerir",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/bug-bites-algae-crisps-40-g-1-41-oz",verifiedAt:"2026-09-29",
  },
  {
    id:"fluval-bug-bites-algae-crisps-a7361-100g",brand:"Fluval",model:"Bug Bites Algae Crisps 100 g",category:"food",
    description:"Pleco ve Ancistrus türleri için uzun süre dayanıklı alg crisp yemi · 100 g · ürün kodu A7361 · UPC 015561173612 · kara asker sineği larvası, Hawaii spirulinası ve kelp içeren %43,5 ham proteinli bitkisel-hayvansal formül; üretici günde iki-üç kez yalnız iki dakikada tüketilecek miktarı önerir",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/bug-bites-algae-crisps-3-52-oz-100-g",verifiedAt:"2026-09-29",
  },
  {
    id:"fluval-bug-bites-goldfish-pellets-a6584-100g",brand:"Fluval",model:"Bug Bites Goldfish Pellets 100 g",category:"food",
    description:"Japon balıkları, özellikle fancy varyeteler için 5–7 mm yavaş batan lifçe zengin pelet · 100 g · ürün kodu A6584 · UPC 015561165846 · %40'a kadar kara asker sineği larvası ve renk desteği için kadife çiçeği özü içerir; üretici günde iki-üç kez yalnız iki dakikada tüketilecek miktarı önerir",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/bug-bites-goldfish-pellets-3-5-oz-100-g",verifiedAt:"2026-09-29",
  },
  {
    id:"fluval-bug-bites-tropical-granules-a6579-125g",brand:"Fluval",model:"Bug Bites Tropical Granules 125 g",category:"food",
    description:"Tropikal balıklar için 1,4–2,0 mm yavaş batan granül · 125 g · ürün kodu A6579 · üretici sayfasındaki UPC 015561165976, 1,7 kg A6597 sayfasında da yayımlandığından benzersiz doğrulayıcı sayılmamıştır · %40'a kadar kara asker sineği larvası içeren %40 ham proteinli formül; günde iki-üç kez yalnız iki dakikada tüketilecek miktar önerilir",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/bug-bites-tropical-granules-4-4-oz-125-g-2",verifiedAt:"2026-09-29",
  },
  {
    id:"fluval-bug-bites-tropical-granules-a6597-1-7kg",brand:"Fluval",model:"Bug Bites Tropical Granules 1,7 kg",category:"food",
    description:"Tropikal balıklar için 1,4–2,0 mm yavaş batan toplu granül · 1,7 kg · ürün kodu A6597 · üretici sayfasındaki UPC 015561165976, 125 g A6579 sayfasında da yayımlandığından benzersiz doğrulayıcı sayılmamıştır · %40'a kadar kara asker sineği larvası içeren %40 ham proteinli formül; günde iki-üç kez yalnız iki dakikada tüketilecek miktar önerilir",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/bug-bites-tropical-granules-3-7-lb-1-7-kg-2",verifiedAt:"2026-09-29",
  },
  {
    id:"fluval-bug-bites-spirulina-flakes-a7354-18g",brand:"Fluval",model:"Bug Bites Spirulina Flakes 18 g",category:"food",
    description:"Tüm balıklar için ilk bileşeni Hawaii spirulinası olan pul yem · 18 g · ürün kodu A7354 · UPC 015561173544 · %37 ham proteinli formül krill, karides, sebze ve kara asker sineği larvası ile renk, deri, pul ve yüzgeç desteği sağlar; üretici günde iki-üç kez yalnız iki dakikada tüketilecek miktarı önerir",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/bug-bites-spirulina-flakes-0-63oz-18-g",verifiedAt:"2026-09-29",
  },
  {
    id:"fluval-bug-bites-spirulina-flakes-a7355-45g",brand:"Fluval",model:"Bug Bites Spirulina Flakes 45 g",category:"food",
    description:"Tüm balıklar için ilk bileşeni Hawaii spirulinası olan pul yem · 45 g · ürün kodu A7355 · UPC 015561173551 · %37 ham proteinli formül krill, karides, sebze ve kara asker sineği larvası ile renk, deri, pul ve yüzgeç desteği sağlar; üretici günde iki-üç kez yalnız iki dakikada tüketilecek miktarı önerir",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/bug-bites-spirulina-flakes-1-58-oz-45-g",verifiedAt:"2026-09-29",
  },
  {
    id:"fluval-bug-bites-spirulina-flakes-a7358-1kg",brand:"Fluval",model:"Bug Bites Spirulina Flakes 1 kg",category:"food",
    description:"Tüm balıklar için ilk bileşeni Hawaii spirulinası olan toplu pul yem · 1 kg · ürün kodu A7358 · UPC 015561173582 · %37 ham proteinli formül krill, karides, sebze ve kara asker sineği larvası ile renk, deri, pul ve yüzgeç desteği sağlar; üretici günde iki-üç kez yalnız iki dakikada tüketilecek miktarı önerir",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/bug-bites-spirulina-flakes-2-2-lb-1-kg",verifiedAt:"2026-09-29",
  },
  {
    id:"fluval-bug-bites-vacation-food-a7367-20g",brand:"Fluval",model:"Bug Bites Vacation Food 20 g · 11 nugget",category:"food",
    description:"Standart toplum akvaryumları için yedi güne kadar yavaş salınımlı 11 nugget · 20 g · ürün kodu A7367 · UPC 015561173674 · yeni kurulmuş akvaryumlarda kullanılmamalı; ayrılmadan önce filtrasyon, düzenli bakım ve su kalitesi doğrulanmalı, özel diyetli türlerde kabul testi yapılmalı, dönüşte artıklar çıkarılıp su öncesi/sonrası test edilmelidir",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/bug-bites-vacation-food-0-7-oz-20-g",verifiedAt:"2026-09-29",
  },
  {
    id:"fluval-betta-protein-rich-food-a6678",brand:"Fluval",model:"Betta Protein-Rich Food · A6678",category:"food",
    description:"Bettalar için yüzeyde kalan, porsiyon kontrollü dağıtıcılı mikro granül günlük yem · ürün kodu A6678 · UPC 015561166782 · %40 ham proteinli formül; üretici günde iki kez yalnız 30 saniyede tamamen tüketilecek miktarı önerir",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/betta-protein-rich-food",verifiedAt:"2026-09-29",
  },
  {
    id:"fluval-betta-vacation-food-a6675",brand:"Fluval",model:"Betta Vacation Food · A6675",category:"food",
    description:"Bettalar için yedi güne kadar yavaş çözünen multivitaminli tatil bloğu · ürün kodu A6675 · UPC 015561166751 · akvaryuma bir blok yerleştirilir; dönüşte kalan yem çıkarılmalı, kısmi su değişimi yapılmalı ve normal besleme düzenine dönülmelidir · standart toplum akvaryumları için Bug Bites Vacation Food A7367 önerilir",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/betta-vacation-food",verifiedAt:"2026-09-29",
  },
  {
    id:"fluval-betta-freeze-dried-bloodworms-14840-5g",brand:"Fluval",model:"Betta Freeze Dried Bloodworms 5 g",category:"food",
    description:"Bettaların düzenli diyetini tamamlayan dondurularak kurutulmuş kan kurdu ödül yemi · 5 g · ürün kodu 14840 · UPC 015561148405 · %55 ham protein; üretici haftada iki-üç kez yalnız bir dakikada tüketilecek miktarı önerir, tek başına tam günlük diyet olarak sunulmamalıdır",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/betta-freeze-dried-bloodworms-0-18-oz-5-g",verifiedAt:"2026-09-29",
  },
  {
    id:"fluval-carbon-a1440-100g-3pack",brand:"Fluval",model:"Carbon 100 g · 3'lü paket",category:"filter_media",
    description:"Tatlı ve deniz suyunda koku, renk değişimi, organik kirletici ve iz metalleri adsorbe eden bitümlü, buharla etkinleştirilmiş karbon · üç adet 100 g poşet · ürün kodu A1440 · UPC 015561114400 · üretici aylık değişim ve sıvı bitki besini eklemeden önce yeni karbonun bir–iki hafta çalıştırılmasını önerir; tüm biyolojik medyayla aynı anda değiştirilmemelidir",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/carbon",additionalSourceUrls:["https://fluvalaquatics.com/manuals/Fluval_Filter-Media_Manual.pdf"],verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-biomax-a1456-500g",brand:"Fluval",model:"BIOMAX 500 g",category:"filter_media",
    description:"Karmaşık gözenek yapısıyla yararlı bakteriler için geniş yüzey ve uzun temas süresi sağlayan biyolojik filtre halkası · 500 g · ürün kodu A1456 · UPC 015561114561 · amonyak ve nitrat kontrolüne yardımcı olur; biyolojik döngü ve ölçümün yerine geçmez",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/biomax-17-63-oz-500-g",additionalSourceUrls:["https://fluvalaquatics.com/manuals/fx_manual_6_lang_web.pdf"],verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-biomax-a495-u2-u3-u4",brand:"Fluval",model:"BIOMAX U2/U3/U4 · A495",category:"filter_media",
    description:"Fluval U2, U3 ve U4 iç filtreleri için gözenekli biyolojik filtre medyası · ürün kodu A495 · UPC 015561104951 · ABD ve İngiltere resmî ürün sayfaları 110 g, Kanada resmî sayfası ile U serisi kılavuzu 170 g yayımladığı için ağırlık kesin alan olarak kullanılmamıştır · tatlı su, deniz suyu ve sürüngen ortamlarına uygundur; tüm biyolojik medya aynı anda yenilenmemelidir",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/biomax-for-u2-u3-u4-underwater-filter-3-88-oz-110-g",additionalSourceUrls:["https://fluvalaquatics.com/ca/shop/product/biomax-for-u2-u3-u4-underwater-filter-3-88-oz-110-g","https://fluvalaquatics.com/manuals/Fluval_A465-A470-A475-A480_Underwater-Filter_Manual.pdf"],verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-biomax-19660-ac20-ac30-42g",brand:"Fluval",model:"BIOMAX AC20/AC30 42 g",category:"filter_media",
    description:"Fluval AC20 ve AC30 askı filtreleri için gözenekli biyolojik medya · 42 g · ürün kodu 19660 · UPC 015561196604 · eşit su dağılımı ve yararlı bakteri kolonizasyonunu destekler; üretici üç ayda bir değişim önerir ve tatlı/deniz suyuna uygun olduğunu belirtir",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/biomax-for-aquaclear-ac20-ac30-power-filter-1-5-oz-42-g",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-biomax-19662-ac50-80g",brand:"Fluval",model:"BIOMAX AC50 80 g",category:"filter_media",
    description:"Fluval AC50 askı filtresi için gözenekli biyolojik medya · 80 g · ürün kodu 19662 · UPC 015561196628 · eşit su dağılımı ve yararlı bakteri kolonizasyonunu destekler; üretici üç ayda bir değişim önerir ve tatlı/deniz suyuna uygun olduğunu belirtir",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/biomax-for-aquaclear-ac50-power-filter-2-8-oz-80-g",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-carbon-19641-ac20-ac30-50g",brand:"Fluval",model:"Carbon AC20/AC30 50 g",category:"filter_media",
    description:"Fluval AC20 ve AC30 askı filtreleri için koku, renk değişimi ve kirleticileri adsorbe eden aktif karbon · 50 g · ürün kodu 19641 · UPC 015561196413 · fosfatı yükseltmeyecek biçimde tanımlanmıştır; üretici dört haftada bir değişim önerir ve tatlı/deniz suyuna uygun olduğunu belirtir",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/carbon-for-aquaclear-ac20-ac30-power-filter-1-8-oz-50-g",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-carbon-19642-ac20-ac30-150g-3pack",brand:"Fluval",model:"Carbon AC20/AC30 50 g · 3'lü paket",category:"filter_media",
    description:"Fluval AC20 ve AC30 askı filtreleri için üç adet 50 g aktif karbon poşeti · toplam 150 g · ürün kodu 19642 · UPC 015561196420 · koku, renk değişimi ve kirleticileri adsorbe eder; üretici dört haftada bir değişim önerir ve tatlı/deniz suyuna uygun olduğunu belirtir",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/carbon-for-aquaclear-ac20-30-power-filter-5-4-oz-150-g-3-pack",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-ammonia-remover-19630-ac20-ac30-90g",brand:"Fluval",model:"Ammonia Remover AC20/AC30 90 g",category:"filter_media",
    description:"Fluval AC20 ve AC30 askı filtrelerinde tatlı su için doğal klinoptilolit iyon değişim medyası · 90 g · ürün kodu 19630 · UPC 015561196307 · amonyağı kontrol etmeye yardımcıdır; üretici dört haftada bir değişim önerir, deniz suyuna uygun değildir ve amonyak/nitrit ölçümünün yerine geçmez",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/ammonia-remover-for-aquaclear-ac20-ac30-power-filter-3-2-oz-90-g",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-ammonia-remover-ll-a1487-2800g",brand:"Fluval",model:"Ammonia Remover 2800 g",category:"filter_media",
    description:"Tüm dış filtrelerle uyumlu, sudan geçiş sırasında toksik amonyağı tutan doğal iyon değişim medyası · 2800 g · ürün kodu LL-A1487 · UPC 015561114875 · sump ve büyük filtreler için file çanta içerir; özellikle yeni veya yoğun stoklu akvaryumlarda kullanıma yöneliktir, biyolojik döngü ve ölçümün yerine geçmez",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/ammonia-remover-98-76-oz-2800-g",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-biomax-19664-ac70-ac110-125g",brand:"Fluval",model:"BIOMAX AC70/AC110 125 g",category:"filter_media",
    description:"Fluval AC70 ve AC110 askı filtreleri için gözenekli biyolojik medya · 125 g · ürün kodu 19664 · UPC 015561196642 · eşit su dağılımı ve yararlı bakteri kolonizasyonunu destekler; üretici üç ayda bir değişim önerir ve tatlı/deniz suyuna uygun olduğunu belirtir",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/biomax-for-aquaclear-ac70-ac110-power-filter-4-4-oz-125-g",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-biomax-19665-ac70-ac110-250g-2pack",brand:"Fluval",model:"BIOMAX AC70/AC110 125 g · 2'li paket",category:"filter_media",
    description:"Fluval AC70 ve AC110 askı filtreleri için iki adet 125 g gözenekli biyolojik medya · toplam 250 g · ürün kodu 19665 · UPC 015561196659 · eşit su dağılımı ve yararlı bakteri kolonizasyonunu destekler; üretici üç ayda bir değişim önerir ve tatlı/deniz suyuna uygun olduğunu belirtir",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/biomax-for-aquaclear-ac70-ac110-power-filter-8-8-oz-250-g-2-pack",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-carbon-19644-ac50-210g-3pack",brand:"Fluval",model:"Carbon AC50 70 g · 3'lü paket",category:"filter_media",
    description:"Fluval AC50 askı filtresi için üç adet 70 g aktif karbon poşeti · toplam 210 g · ürün kodu 19644 · UPC 015561196444 · koku, renk değişimi ve kirleticileri adsorbe eder; üretici dört haftada bir değişim önerir ve tatlı/deniz suyuna uygun olduğunu belirtir",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/carbon-for-aquaclear-ac50-power-filter-7-5-oz-210-g-3-pack",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-ammonia-remover-19634-ac70-ac110-346g",brand:"Fluval",model:"Ammonia Remover AC70/AC110 346 g",category:"filter_media",
    description:"Fluval AC70 ve AC110 askı filtrelerinde tatlı su için doğal klinoptilolit iyon değişim medyası · 346 g · ürün kodu 19634 · UPC 015561196345 · amonyağı kontrol etmeye yardımcıdır; üretici dört haftada bir değişim önerir, deniz suyuna uygun değildir ve amonyak/nitrit ölçümünün yerine geçmez",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/ammonia-remover-for-aquaclear-ac70-ac110-12-2-oz-346-g",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-carbon-19643-ac50-70g",brand:"Fluval",model:"Carbon AC50 70 g",category:"filter_media",
    description:"Fluval AC50 askı filtresi için koku, renk değişimi ve kirleticileri adsorbe eden aktif karbon · 70 g · ürün kodu 19643 · UPC 015561196424 · fosfatı yükseltmeyecek biçimde tanımlanmıştır; üretici dört haftada bir değişim önerir ve tatlı/deniz suyuna uygun olduğunu belirtir",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/carbon-for-aquaclear-ac50-power-filter-2-5-oz-70-g",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-carbon-19646-ac70-ac110-435g-3pack",brand:"Fluval",model:"Carbon AC70/AC110 145 g · 3'lü paket",category:"filter_media",
    description:"Fluval AC70 ve AC110 askı filtreleri için üç adet 145 g aktif karbon poşeti · toplam 435 g · ürün kodu 19646 · UPC 015561196468 · koku, renk değişimi ve kirleticileri adsorbe eder; üretici dört haftada bir değişim önerir ve tatlı/deniz suyuna uygun olduğunu belirtir",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/carbon-for-aquaclear-ac70-ac110-power-filter-15-3-oz-435-g-3-pack",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-ammonia-remover-19631-ac20-ac30-272g-3pack",brand:"Fluval",model:"Ammonia Remover AC20/AC30 90 g · 3'lü paket",category:"filter_media",
    description:"Fluval AC20 ve AC30 askı filtrelerinde tatlı su için üç paket doğal klinoptilolit iyon değişim medyası · toplam 272 g · ürün kodu 19631 · UPC 015561196314 · amonyağı kontrol etmeye yardımcıdır; üretici dört haftada bir değişim önerir, deniz suyuna uygun değildir ve amonyak/nitrit ölçümünün yerine geçmez",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/ammonia-remover-for-aquaclear-ac20-ac30-power-filter-9-6-oz-272-g-3-pack",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-ammonia-remover-19632-ac50-143g",brand:"Fluval",model:"Ammonia Remover AC50 143 g",category:"filter_media",
    description:"Fluval AC50 askı filtresinde tatlı su için doğal klinoptilolit iyon değişim medyası · 143 g · ürün kodu 19632 · UPC 015561196321 · amonyağı kontrol etmeye yardımcıdır; üretici dört haftada bir değişim önerir, deniz suyuna uygun değildir ve amonyak/nitrit ölçümünün yerine geçmez",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/ammonia-remover-for-aquaclear-ac50-power-filter-5-oz-143-g",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-clear-carb-19628-ac70-ac110-310g-2pack",brand:"Fluval",model:"Clear-Carb AC70/AC110 155 g · 2'li paket",category:"filter_media",
    description:"Fluval AC70 ve AC110 askı filtreleri için aktif karbon ile Clearmax kimyasal medyasını birleştiren iki paket · toplam 310 g · ürün kodu 19628 · UPC 015561196284 · koku, renk ve kirleticilerin yanında fosfat, nitrit ve nitratı azaltmaya yardımcıdır; üretici dört haftada bir değişim önerir ve tatlı/deniz suyuna uygun olduğunu belirtir",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/clear-carb-for-aquaclear-ac70-ac110-power-filter-10-8-oz-310-g-2-pack",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-carbon-19645-ac70-ac110-145g",brand:"Fluval",model:"Carbon AC70/AC110 145 g",category:"filter_media",
    description:"Fluval AC70 ve AC110 askı filtreleri için koku, renk değişimi ve kirleticileri adsorbe eden aktif karbon · 145 g · ürün kodu 19645 · resmî sayfa UPC 015561196659 yayımlar ancak aynı UPC BIOMAX 19665 sayfasında da bulunduğundan benzersiz ürün doğrulayıcısı olarak kullanılmamıştır · üretici dört haftada bir değişim önerir ve tatlı/deniz suyuna uygun olduğunu belirtir",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/carbon-for-aquaclear-ac70-ac110-power-filter-5-1-oz-145-g",additionalSourceUrls:["https://fluvalaquatics.com/us/shop/product/biomax-for-aquaclear-ac70-ac110-power-filter-8-8-oz-250-g-2-pack"],verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-ammonia-remover-19633-ac50-429g-3pack",brand:"Fluval",model:"Ammonia Remover AC50 143 g · 3'lü paket",category:"filter_media",
    description:"Fluval AC50 askı filtresinde tatlı su için üç paket doğal klinoptilolit iyon değişim medyası · toplam 429 g · ürün kodu 19633 · UPC 015561196338 · amonyağı kontrol etmeye yardımcıdır; üretici dört haftada bir değişim önerir, deniz suyuna uygun değildir ve amonyak/nitrit ölçümünün yerine geçmez",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/ammonia-remover-for-aquaclear-ac50-power-filter-15-oz-429-g-3-pack",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-ammonia-remover-19635-ac70-ac110-1038g-3pack",brand:"Fluval",model:"Ammonia Remover AC70/AC110 346 g · 3'lü paket",category:"filter_media",
    description:"Fluval AC70 ve AC110 askı filtrelerinde tatlı su için üç paket doğal klinoptilolit iyon değişim medyası · toplam 1038 g · ürün kodu 19635 · UPC 015561196352 · amonyağı kontrol etmeye yardımcıdır; üretici dört haftada bir değişim önerir, deniz suyuna uygun değildir ve amonyak/nitrit ölçümünün yerine geçmez",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/ammonia-remover-for-aquaclear-ac70-ac110-36-6-oz-1038-g-3-pack",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-zeo-carb-19650-ac20-ac30-60g",brand:"Fluval",model:"Zeo-Carb AC20/AC30 60 g",category:"filter_media",
    description:"Fluval AC20 ve AC30 askı filtreleri için aktif karbon ile amonyak tutucu zeoliti birleştiren kimyasal medya · 60 g · ürün kodu 19650 · UPC 015561196505 · koku, renk, kirletici ve toksik amonyağı azaltmaya yardımcıdır; üretici dört haftada bir değişim ve tatlı/deniz suyu kullanımı belirtir",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/zeo-carb-for-aquaclear-ac20-ac30-power-filter-2-1-oz-60-g",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-zeo-carb-19651-ac20-ac30-180g-3pack",brand:"Fluval",model:"Zeo-Carb AC20/AC30 60 g · 3'lü paket",category:"filter_media",
    description:"Fluval AC20 ve AC30 askı filtreleri için üç adet 60 g aktif karbon ve zeolit karışımı · toplam 180 g · ürün kodu 19651 · UPC 015561196512 · koku, renk, kirletici ve toksik amonyağı azaltmaya yardımcıdır; üretici dört haftada bir değişim ve tatlı/deniz suyu kullanımı belirtir",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/zeo-carb-for-aquaclear-ac20-ac30-power-filter-6-3-oz-180-g-3-pack",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-zeo-carb-19652-ac50-90g",brand:"Fluval",model:"Zeo-Carb AC50 90 g",category:"filter_media",
    description:"Fluval AC50 askı filtresi için aktif karbon ile amonyak tutucu zeoliti birleştiren kimyasal medya · 90 g · ürün kodu 19652 · UPC 015561196529 · koku, renk, kirletici ve toksik amonyağı azaltmaya yardımcıdır; üretici dört haftada bir değişim ve tatlı/deniz suyu kullanımı belirtir",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/zeo-carb-for-aquaclear-ac50-power-filter-3-2-oz-90-g",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-zeo-carb-19653-ac50-270g-3pack",brand:"Fluval",model:"Zeo-Carb AC50 90 g · 3'lü paket",category:"filter_media",
    description:"Fluval AC50 askı filtresi için üç adet 90 g aktif karbon ve zeolit karışımı · toplam 270 g · ürün kodu 19653 · UPC 015561196536 · koku, renk, kirletici ve toksik amonyağı azaltmaya yardımcıdır; üretici dört haftada bir değişim ve tatlı/deniz suyu kullanımı belirtir",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/zeo-carb-for-aquaclear-ac50-power-filter-9-5-oz-270-g-3-pack",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-clear-carb-19626-ac20-ac30-55g",brand:"Fluval",model:"Clear-Carb AC20/AC30 55 g",category:"filter_media",
    description:"Fluval AC20 ve AC30 askı filtreleri için aktif karbon ile Clearmax kimyasal medyasını birleştiren paket · 55 g · ürün kodu 19626 · UPC 015561196260 · koku, renk ve kirleticilerin yanında fosfat, nitrit ve nitratı azaltmaya yardımcıdır; üretici dört haftada bir değişim ve tatlı/deniz suyu kullanımı belirtir",
    sourceUrl:"https://fluvalaquatics.com/ca/shop/product/clear-carb-for-ac20-ac30-power-filter-1-9-oz-55-g",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-clear-carb-19627-ac50-75g",brand:"Fluval",model:"Clear-Carb AC50 75 g",category:"filter_media",
    description:"Fluval AC50 askı filtresi için aktif karbon ile Clearmax kimyasal medyasını birleştiren paket · 75 g · ürün kodu 19627 · UPC 015561196277 · koku, renk ve kirleticilerin yanında fosfat, nitrit ve nitratı azaltmaya yardımcıdır; üretici dört haftada bir değişim ve tatlı/deniz suyu kullanımı belirtir",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/clear-carb-for-aquaclear-ac50-power-filter-2-6-oz-75-g",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-bio-foam-19598-ac20",brand:"Fluval",model:"Bio-Foam AC20",category:"filter_media",
    description:"Fluval AC20 askı filtresi için mekanik ve biyolojik filtre süngeri · ürün kodu 19598 · UPC 015561195980 · 30 PPI yoğunluk parçacıkları tutarken yararlı bakterilere yüzey sağlar; üretici iki ayda bir değişim ve tatlı/deniz suyu kullanımı belirtir",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/bio-foam-for-ac20-aquaclear-power-filter",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-bio-foam-19670-ac20-3pack",brand:"Fluval",model:"Bio-Foam AC20 · 3'lü paket",category:"filter_media",
    description:"Fluval AC20 askı filtresi için üç adet mekanik ve biyolojik filtre süngeri · ürün kodu 19670 · UPC 015561196703 · 30 PPI yoğunluk parçacıkları tutarken yararlı bakterilere yüzey sağlar; üretici iki ayda bir değişim ve tatlı/deniz suyu kullanımı belirtir",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/bio-foam-for-ac20-aquaclear-power-filter-3-pack",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-bio-foam-19605-ac30",brand:"Fluval",model:"Bio-Foam AC30",category:"filter_media",
    description:"Fluval AC30 askı filtresi için mekanik ve biyolojik filtre süngeri · ürün kodu 19605 · UPC 015561196055 · 30 PPI yoğunluk parçacıkları tutarken yararlı bakterilere yüzey sağlar; üretici iki ayda bir değişim ve tatlı/deniz suyu kullanımı belirtir",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/bio-foam-for-ac30-aquaclear-power-filter",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-bio-foam-19672-ac30-3pack",brand:"Fluval",model:"Bio-Foam AC30 · 3'lü paket",category:"filter_media",
    description:"Fluval AC30 askı filtresi için üç adet mekanik ve biyolojik filtre süngeri · ürün kodu 19672 · UPC 015561196727 · 30 PPI yoğunluk parçacıkları tutarken yararlı bakterilere yüzey sağlar; üretici iki ayda bir değişim ve tatlı/deniz suyu kullanımı belirtir",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/bio-foam-for-ac30-aquaclear-power-filter-3-pack",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-bio-foam-19613-ac50",brand:"Fluval",model:"Bio-Foam AC50",category:"filter_media",
    description:"Fluval AC50 askı filtresi için mekanik ve biyolojik filtre süngeri · ürün kodu 19613 · UPC 015561196130 · 30 PPI yoğunluk parçacıkları tutarken yararlı bakterilere yüzey sağlar; üretici iki ayda bir değişim ve tatlı/deniz suyu kullanımı belirtir",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/bio-foam-for-ac50-aquaclear-power-filter",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-bio-foam-19674-ac50-3pack",brand:"Fluval",model:"Bio-Foam AC50 · 3'lü paket",category:"filter_media",
    description:"Fluval AC50 askı filtresi için üç adet mekanik ve biyolojik filtre süngeri · ürün kodu 19674 · UPC 015561196741 · 30 PPI yoğunluk parçacıkları tutarken yararlı bakterilere yüzey sağlar; üretici iki ayda bir değişim ve tatlı/deniz suyu kullanımı belirtir",
    sourceUrl:"https://fluvalaquatics.com/ca/shop/product/bio-foam-for-ac50-power-filter-3-pack",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-bio-foam-19618-ac70",brand:"Fluval",model:"Bio-Foam AC70",category:"filter_media",
    description:"Fluval AC70 askı filtresi için mekanik ve biyolojik filtre süngeri · ürün kodu 19618 · UPC 015561196185 · 30 PPI yoğunluk parçacıkları tutarken yararlı bakterilere yüzey sağlar; üretici iki ayda bir değişim ve tatlı/deniz suyu kullanımı belirtir",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/bio-foam-for-ac70-aquaclear-power-filter",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-bio-foam-19676-ac70-3pack",brand:"Fluval",model:"Bio-Foam AC70 · 3'lü paket",category:"filter_media",
    description:"Fluval AC70 askı filtresi için üç adet mekanik ve biyolojik filtre süngeri · ürün kodu 19676 · UPC 015561196765 · 30 PPI yoğunluk parçacıkları tutarken yararlı bakterilere yüzey sağlar; üretici iki ayda bir değişim ve tatlı/deniz suyu kullanımı belirtir",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/bio-foam-for-ac70-aquaclear-power-filter-3-pack",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-bio-foam-19623-ac110",brand:"Fluval",model:"Bio-Foam AC110",category:"filter_media",
    description:"Fluval AC110 askı filtresi için mekanik ve biyolojik filtre süngeri · ürün kodu 19623 · UPC 015561196239 · diğer AC Bio-Foam seçeneklerinden farklı olarak 20 PPI yoğunlukta yayımlanmıştır; üretici iki ayda bir değişim ve tatlı/deniz suyu kullanımı belirtir",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/bio-foam-for-ac110-aquaclear-power-filter",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-media-maintenance-kit-19690-ac20",brand:"Fluval",model:"Media Maintenance Kit AC20",category:"filter_media",
    description:"Fluval AC20 askı filtresi için bakım paketi · ürün kodu 19690 · UPC 015561196901 · iki Carbon, bir Bio-Foam ve bir BIOMAX medya içerir; mekanik, biyolojik ve kimyasal katmanlar tatlı/deniz suyu kullanımına uygun yedeklerdir",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/media-maintenance-kit-for-aquaclear-ac20-power-filter",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-media-maintenance-kit-19691-ac30",brand:"Fluval",model:"Media Maintenance Kit AC30",category:"filter_media",
    description:"Fluval AC30 askı filtresi için bakım paketi · ürün kodu 19691 · UPC 015561196918 · iki Carbon, bir Bio-Foam ve bir BIOMAX medya içerir; mekanik, biyolojik ve kimyasal katmanlar tatlı/deniz suyu kullanımına uygun yedeklerdir",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/media-maintenance-kit-for-aquaclear-ac30-power-filter",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-media-maintenance-kit-19692-ac50",brand:"Fluval",model:"Media Maintenance Kit AC50",category:"filter_media",
    description:"Fluval AC50 askı filtresi için bakım paketi · ürün kodu 19692 · UPC 015561196925 · iki Carbon, bir Bio-Foam ve bir BIOMAX medya içerir; mekanik, biyolojik ve kimyasal katmanlar tatlı/deniz suyu kullanımına uygun yedeklerdir",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/media-maintenance-kit-for-aquaclear-ac50-power-filter",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-media-maintenance-kit-19693-ac70",brand:"Fluval",model:"Media Maintenance Kit AC70",category:"filter_media",
    description:"Fluval AC70 askı filtresi için bakım paketi · ürün kodu 19693 · UPC 015561196932 · iki Carbon, bir Bio-Foam ve bir BIOMAX medya içerir; mekanik, biyolojik ve kimyasal katmanlar tatlı/deniz suyu kullanımına uygun yedeklerdir",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/media-maintenance-kit-for-aquaclear-ac70-power-filter",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-media-maintenance-kit-19694-ac110",brand:"Fluval",model:"Media Maintenance Kit AC110",category:"filter_media",
    description:"Fluval AC110 askı filtresi için bakım paketi · ürün kodu 19694 · UPC 015561196949 · dört Carbon, bir Bio-Foam ve iki BIOMAX medya içerir; mekanik, biyolojik ve kimyasal katmanlar tatlı/deniz suyu kullanımına uygun yedeklerdir",
    sourceUrl:"https://fluvalaquatics.com/ca/shop/product/media-maintenance-kit-for-ac110-power-filter",verifiedAt:"2026-09-28",
  },
  ...([20,30,50,70,110] as const).map((filterModel,index):CareProductProfile=>{
    const itemNumbers = ["A1360","A1362","A1364","A1366","A1368"] as const;
    const upcs = ["015561113601","015561113625","015561113649","015561113663","015561113687"] as const;
    return {
      id:`fluval-filter-insert-bag-${itemNumbers[index].toLowerCase()}-ac${filterModel}-2pack`,brand:"Fluval",model:`Filter Insert Bag AC${filterModel} · 2'li paket`,category:"filter_media",
      description:`Fluval AC${filterModel} askı filtresi için iki adet yeniden kullanılabilir naylon medya torbası · ürün kodu ${itemNumbers[index]} · UPC ${upcs[index]} · kapanabilir ağ yapı karbon, torf ve biyolojik halka gibi gevşek medyaların kolay takılıp çıkarılmasını sağlar; tatlı ve deniz suyuna uygundur`,
      sourceUrl:`https://fluvalaquatics.com/${filterModel===20?"ca":"us"}/shop/product/aquaclear-ac${filterModel}-filter-insert-bag-2-pack`,verifiedAt:"2026-09-28",
    };
  }),
  {
    id:"fluval-flex-2-foam-block-a1409-3pack",brand:"Fluval",model:"Flex 2.0 Foam Block · 3'lü paket",category:"filter_media",
    description:"Fluval Flex 2.0 57 L akvaryum kiti için üç mekanik filtre süngeri · ürün kodu A1409 · UPC 015561114097 · büyük parçacık ve döküntüleri tutar; üretici en iyi sonuç için 12 ayda bir değişim önerir",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/flex-2-0-foam-block-3pack",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-kuhl-coarse-filter-pad-a1381-4pack",brand:"Fluval",model:"Kühl Coarse Filter Pad · 4'lü paket",category:"filter_media",
    description:"Fluval Kühl 8 L Microscaping Kit için dört yoğun kaba mekanik filtre pedi · ürün kodu A1381 · UPC 015561113816 · büyük parçacık ve döküntüleri tutar; üretici haftalık durulama ve 4–8 haftada bir değişim önerir",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/kuhl-coarse-filter-pad-4-pack",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-kuhl-fine-filter-pad-a1383-3pack",brand:"Fluval",model:"Kühl Fine Filter Pad · 3'lü paket",category:"filter_media",
    description:"Fluval Kühl 8 L Microscaping Kit için üçlü mekanik, biyolojik ve kimyasal filtre pedi · ürün kodu A1383 · UPC 015561113830 · dış polyester atıkları tutar, iç amonyak giderici ile karbon granülleri amonyak, koku ve toksinleri azaltır; üretici 2–4 haftada bir değişim önerir",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/kuhl-fine-filter-pad-3-pack",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-flex-2-poly-carb-a1407-3pack",brand:"Fluval",model:"Flex 2.0 Poly-Carb Cartridge · 3'lü paket",category:"filter_media",
    description:"Fluval Flex 2.0 34 ve 57 L kitleri için üç karbon emdirilmiş polyester kartuş · ürün kodu A1407 · UPC 015561114073 · ince döküntü, toksin, renklenme ve kokuyu mekanik/kimyasal olarak azaltır; üretici karbon ömrünü yaklaşık bir ay, önerilen değişimi 2–4 hafta olarak belirtir",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/flex-2-0-poly-carb-cartridge-3-pack",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-clearx-a1336-4pack",brand:"Fluval",model:"ClearX Media Insert 60 L · 4'lü paket",category:"filter_media",
    description:"Spec 10/19 L, Edge 23/46 L ve Flex 34/57 L dahil uyumlu akvaryum kitleri için dört kimyasal filtre pedi · ürün kodu A1336 · UPC 015561113366 · her ped 60 L'ye kadar fosfat, nitrit ve nitratı kontrol etmeye; bulanıklık, koku ve renklenmeyi gidermeye yardımcıdır; düzenli su değişiminin yerine geçmez ve üretici iki haftada bir değişim önerir",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/clearx-media-insert-up-to-15-us-gal-60-l",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-foam-block-a1376-spec-evo-flex-betta",brand:"Fluval",model:"Foam Filter Block Spec/Evo/Flex/Betta",category:"filter_media",
    description:"Spec 10/19 L, Evo 19 L, Flex 34 L, Flex 2.0 34 L ve Betta 10/22,7 L kitleri için saplı mekanik filtre bloğu · ürün kodu A1376 · UPC 015561113762 · büyük parçacık ve döküntüleri tutar; yalnız listelenen kitlerle uyumludur",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/foam-filter-block-for-spec-evo-flex-aquarium-kit",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-foam-block-10532-spec16-evo13-5",brand:"Fluval",model:"Foam Filter Block Spec 16 / Evo 13.5",category:"filter_media",
    description:"Spec 60 L ve Evo 52 L akvaryum kitleri için mekanik filtre bloğu · ürün kodu 10532 · UPC 015561105323 · büyük parçacık ve döküntüleri tutar; daha küçük Spec/Evo/Flex bloklarıyla aynı parça değildir",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/foam-filter-block-for-spec-evo-aquarium-kit",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-foam-block-a1375-flex15",brand:"Fluval",model:"Foam Filter Block Flex 15",category:"filter_media",
    description:"Flex 15 US gal / 57 L akvaryum kiti için mekanik filtre bloğu · ürün kodu A1375 · UPC 015561113755 · büyük parçacık ve döküntüleri tutar; Flex 2.0 üçlü A1409 paketinden ayrı önceki nesil parçadır",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/foam-filter-block-for-flex-aquarium-kit",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-edge-foam-biomax-renewal-a1389",brand:"Fluval",model:"Edge Foam & BIOMAX Renewal Kit",category:"filter_media",
    description:"Edge 23 ve 46 L akvaryum kitleri için mekanik sünger ile biyolojik BIOMAX halkalarını birleştiren yenileme kiti · ürün kodu A1389 · UPC 015561113892 · sünger parçacıkları tutar, BIOMAX yararlı bakteri kolonizasyonunu destekler; biyolojik döngü ve ölçümün yerine geçmez",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/foam-biomax-renewal-kit-for-edge-aquarium-kit",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-betta-diffusion-pad-a1337-4pack",brand:"Fluval",model:"Betta Diffusion Chamber Pad · 4'lü paket",category:"filter_media",
    description:"Betta Premium 10 ve 22,7 L akvaryum kitlerinin son filtrasyon aşaması için dört mekanik ped · ürün kodu A1337 · UPC 015561113373 · suyu hem dağıtır hem parlatır ve bypass bırakmayacak biçimde difüzyon haznesine oturur; üretici aylık değişim önerir",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/betta-diffusion-chamber-pad-4-pack",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-biomax-a1378-spec-evo-flex-betta-60g",brand:"Fluval",model:"BIOMAX Spec/Evo/Flex/Betta 60 g",category:"filter_media",
    description:"Spec, Evo, Flex, Flex 2.0 ve Betta akvaryum kitlerinin listelenen modelleri için file torbada 60 g biyolojik medya · ürün kodu A1378 · UPC 015561113786 · gözenekli yapı yararlı bakteri yüzeyi sağlayarak amonyak ve nitrit kontrolünü destekler; üretici akvaryum suyuyla aylık durulama ve üç ayda bir değişim önerir, biyolojik döngü ve testin yerine geçmez",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/biomax-for-spec-evo-flex-aquarium-kit-21-oz-60-g",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-carbon-a1377-spec-evo-flex-45g-3pack",brand:"Fluval",model:"Carbon Spec/Evo/Flex 45 g · 3'lü paket",category:"filter_media",
    description:"Spec 10/19 L, Evo 19/52 L ve Flex 34/57/123 L kitleri için üçlü kimyasal filtre karbonu · ürün kodu A1377 · UPC 015561113779 · toplam yayımlanan paket ağırlığı 45 g'dır; ağır metal, koku, renklenme ve organik kirleticileri gidermeye yardımcı olur",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/replacement-carbon-for-spec-evo-flex-aquarium-kit-1-6-oz-45-g-3-pack",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-edge-carbon-a1379-45g-3pack",brand:"Fluval",model:"Edge Carbon Clean & Clear 45 g · 3'lü paket",category:"filter_media",
    description:"Edge 23 ve 46 L akvaryum kitleri için üçlü yüksek kaliteli karbon poşeti · ürün kodu A1379 · UPC 015561113793 · toplam yayımlanan paket ağırlığı 45 g'dır; toksik kirletici, koku ve renklenmeyi azaltmaya yardımcı kimyasal medyadır",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/carbon-clean-clear-renewal-sachet-for-edge-aquarium-kit-1-6-oz-45-g-3-pack",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-betta-poly-carb-a1338-4pack",brand:"Fluval",model:"Betta Poly-Carb Cartridge · 4'lü paket",category:"filter_media",
    description:"Betta Premium 22,7 L akvaryum kiti için dört karbon emdirilmiş polyester kartuş · ürün kodu A1338 · UPC 015561113380 · ince döküntü ve kirleticileri tutarken toksin, renklenme ve kokuyu azaltan mekanik/kimyasal medyadır; üretici 2–4 haftada bir değişim önerir",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/betta-poly-carb-cartridge-4-pack",additionalSourceUrls:["https://fluvalaquatics.com/us/wp-content/uploads/2025/01/10496_Betta-Aquarium_Manual.pdf"],verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-edge-prefilter-sponge-a1387",brand:"Fluval",model:"Edge Pre-Filter Sponge",category:"filter_media",
    description:"Edge 23 ve 46 L akvaryum kitlerinin filtre emişine takılan mekanik ön filtre süngeri · ürün kodu A1387 · UPC 015561113878 · küçük ve yavru balıkların emiş borusuna çekilmesini önlemeye yardımcı olurken ince döküntüleri tutar; bağımsız filtre kapasitesi üretmez",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/pre-filter-sponge-for-edge-aquarium-kit",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-chi-foam-pad-combo-a1426",brand:"Fluval",model:"Chi Filter Foam & Pad Combo",category:"filter_media",
    description:"Chi 19 L akvaryum kiti için mekanik köpük ile polyester filtre pedini birlikte sunan yenileme paketi · ürün kodu A1426 · UPC 015561114264 · kaba ve ince parçacıkları ardışık olarak tutar; bağımsız filtre kapasitesi üretmez",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/filter-foam-pad-combo-pack-for-chi-aquarium-kit",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-chi-filter-pad-a1424-3pack",brand:"Fluval",model:"Chi Filter Pad · 3'lü paket",category:"filter_media",
    description:"Chi 19 ve 25 L akvaryum kitleri için üç polyester kimyasal/mekanik filtre pedi · ürün kodu A1424 · UPC 015561110240 · ince parçacık ve kirleticileri tutmaya yardımcıdır; üretici A1425 köpük pedle birlikte kullanılmasını belirtir",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/filter-pad-for-chi-aquarium-kit-3-pack",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-ammonia-remover-a1333-flex-spec-evo-4pack",brand:"Fluval",model:"Ammonia Remover Flex/Spec/Evo · 4'lü paket",category:"filter_media",
    description:"Flex 34/57/123 L, Spec 10/19 L ve Evo 19/52 L akvaryum kitleri için dört Duo-Pack kimyasal medya · ürün kodu A1333 · UPC 015561113335 · yeni, yoğun stoklu veya fazla yemlenen akvaryumlarda; amonyak yükselmesinde ve ilaç kullanımı sonrasında amonyak kontrolüne yardımcıdır · üretici aylık ya da su testi gerektirdiğinde değişim önerir; biyolojik döngü, su testi ve uygun su değişiminin yerine geçmez",
    sourceUrl:"https://fluvalaquatics.com/ca/shop/product/ammonia-remover-for-flex-spec-evo-aquarium-kit-4-pack",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-chi-foam-pad-a1425-2pack",brand:"Fluval",model:"Chi Foam Pad · 2'li paket",category:"filter_media",
    description:"Chi 19 L akvaryum kiti için iki mekanik köpük ped · ürün kodu A1425 · UPC 015561110257 · büyük parçacık ve döküntüleri tutar, özel kesimi suyun medyayı bypass etmesini önler; üretici en iyi sonuç için A1424 filtre pediyle birlikte kullanım belirtir",
    sourceUrl:"https://fluvalaquatics.com/ca/shop/product/filter-pad-for-chi-aquarium-kit-2-pack",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-nano-bio-foam-a456",brand:"Fluval",model:"Nano Filter Bio-Foam",category:"filter_media",
    description:"A455 Nano Aquarium Filter için mekanik ve biyolojik köpük medya · ürün kodu A456 · UPC 015561104562 · döküntüleri tutarken geniş yüzeyi yararlı nitrifikasyon bakterilerinin kolonizasyonunu destekler; bağımsız filtre kapasitesi üretmez",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/bio-foam-for-nano-aquarium-filter",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-nano-fine-foam-a457-2pack",brand:"Fluval",model:"Nano Filter Fine Foam Pad · 2'li paket",category:"filter_media",
    description:"A455 Nano Aquarium Filter için iki ince mekanik köpük ped · ürün kodu A457 · UPC 015561104579 · daha küçük tortu ve döküntüleri tutar; uygun gözenek yapısı su akışını korurken filtre haznesindeki bypass riskini azaltır",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/fine-foam-pad-for-nano-aquarium-filter-2-pack",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-nano-carbon-a458-2pack",brand:"Fluval",model:"Nano Filter Carbon Cartridge · 2'li paket",category:"filter_media",
    description:"A455 Nano Aquarium Filter için iki kimyasal karbon kartuşu · ürün kodu A458 · UPC 015561104586 · gözenekli karbon ağır metal, organik kirletici, koku ve renklenmeyi azaltmaya yardımcıdır; biyolojik döngü, su testi ve su değişiminin yerine geçmez",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/carbon-cartridge-for-nano-aquarium-filter-2-pack",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-u1-bio-foam-a485-2pack",brand:"Fluval",model:"U1 Bio-Foam Pad · 2'li paket",category:"filter_media",
    description:"U1 Underwater Filter için iki mekanik köpük ped · ürün kodu A485 · UPC 015561104852 · büyük parçacık ve döküntüleri tutar, özel kesimi filtre haznesinde bypass riskini azaltır; tatlı su, deniz suyu ve sürüngen ortamlarına uygundur",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/bio-foam-pad-for-u1-underwater-filter-2-pack",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-u2-bio-foam-a486-2pack",brand:"Fluval",model:"U2 Bio-Foam Pad · 2'li paket",category:"filter_media",
    description:"U2 Underwater Filter için iki mekanik köpük ped · ürün kodu A486 · UPC 015561104869 · büyük parçacık ve döküntüleri tutar, özel kesimi filtre haznesinde bypass riskini azaltır; tatlı su, deniz suyu ve sürüngen ortamlarına uygundur",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/bio-foam-pad-for-u2-underwater-filter-2-pack",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-u3-bio-foam-a487-2pack",brand:"Fluval",model:"U3 Bio-Foam Pad · 2'li paket",category:"filter_media",
    description:"U3 Underwater Filter için iki mekanik/biyolojik köpük ped · ürün kodu A487 · UPC 015561104876 · büyük parçacık ve döküntüleri tutar, gözenekli yüzeyi yararlı bakteri kolonizasyonunu destekler; tatlı su, deniz suyu ve sürüngen ortamlarına uygundur",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/bio-foam-pad-for-u3-underwater-filter-2-pack",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-u4-bio-foam-a488-2pack",brand:"Fluval",model:"U4 Bio-Foam Pad · 2'li paket",category:"filter_media",
    description:"U4 Underwater Filter için iki mekanik köpük ped · ürün kodu A488 · UPC 015561104883 · büyük parçacık ve döküntüleri tutar, özel kesimi filtre haznesinde bypass riskini azaltır; tatlı su, deniz suyu ve sürüngen ortamlarına uygundur",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/bio-foam-pad-for-u4-underwater-filter-2-pack",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-u2-poly-carb-a490-2pack",brand:"Fluval",model:"U2 Poly-Carb Cartridge · 2'li paket",category:"filter_media",
    description:"U2 Underwater Filter için iki yüzlü polyester/karbon kartuş · ürün kodu A490 · UPC 015561104906 · polyester yüz ince döküntü ve kirleticileri, karbon yüz zararlı çözünmüş maddeleri, renklenme ve kokuyu azaltmaya yardımcıdır; tatlı su, deniz suyu ve sürüngen ortamlarına uygundur",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/poly-carb-cartridge-for-u2-underwater-filter-2-pack",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-u3-poly-carb-a491-2pack",brand:"Fluval",model:"U3 Poly-Carb Cartridge · 2'li paket",category:"filter_media",
    description:"U3 Underwater Filter için iki yüzlü polyester/karbon kartuş · ürün kodu A491 · UPC 015561104913 · polyester yüz ince döküntü ve kirleticileri, karbon yüz zararlı çözünmüş maddeleri, renklenme ve kokuyu azaltmaya yardımcıdır; tatlı su, deniz suyu ve sürüngen ortamlarına uygundur",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/poly-carb-cartridge-for-u3-underwater-filter-2-pack",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-u4-poly-carb-a492-2pack",brand:"Fluval",model:"U4 Poly-Carb Cartridge · 2'li paket",category:"filter_media",
    description:"U4 Underwater Filter için iki yüzlü polyester/karbon kartuş · ürün kodu A492 · UPC 015561104920 · polyester yüz ince döküntü ve kirleticileri, karbon yüz zararlı çözünmüş maddeleri, renklenme ve kokuyu azaltmaya yardımcıdır; tatlı su, deniz suyu ve sürüngen ortamlarına uygundur",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/poly-carb-cartridge-for-u4-underwater-filter-2-pack",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-u2-poly-max-a481-2pack",brand:"Fluval",model:"U2 Poly-Max Cartridge · 2'li paket",category:"filter_media",
    description:"U2 Underwater Filter için iki kimyasal kartuş · ürün kodu A481 · UPC 015561104814 · fosfat, nitrit ve nitratı adsorbe ederek yeşil su ve alg kontrolüne yardımcıdır; güncel resmî ürün sayfası Poly-Max, resmî U serisi kılavuzu aynı kodu Clearmax adıyla yayımlar, bu ad farkı gizlenmemiştir",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/poly-max-cartridge-for-u2-underwater-filter-2-pack",additionalSourceUrls:["https://fluvalaquatics.com/manuals/Fluval_A465-A470-A475-A480_Underwater-Filter_Manual.pdf"],verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-u3-poly-max-a482-2pack",brand:"Fluval",model:"U3 Poly-Max Cartridge · 2'li paket",category:"filter_media",
    description:"U3 Underwater Filter için iki kimyasal kartuş · ürün kodu A482 · UPC 015561104821 · fosfat, nitrit ve nitratı adsorbe ederek yeşil su, alg ve koku kontrolüne yardımcıdır; temel akvaryum bakımı ile su değişiminin yerine geçmez",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/poly-max-cartridge-for-u3-underwater-filter-2-pack",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-u4-poly-max-a483-2pack",brand:"Fluval",model:"U4 Poly-Max Cartridge · 2'li paket",category:"filter_media",
    description:"U4 Underwater Filter için iki kimyasal kartuş · ürün kodu A483 · UPC 015561104838 · fosfat, nitrit ve nitratı adsorbe ederek yeşil su, alg ve koku kontrolüne yardımcıdır; temel akvaryum bakımı ile su değişiminin yerine geçmez",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/poly-max-cartridge-for-u4-underwater-filter-2-pack",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-c2-foam-pad-14005-2pack",brand:"Fluval",model:"C2 Foam Pad · 2'li paket",category:"filter_media",
    description:"C2 Power Filter için iki yüksek gözenekli mekanik köpük ped · ürün kodu 14005 · UPC 015561140058 · büyük parçacık ve döküntüleri tutmaya yardımcıdır; bağımsız filtre kapasitesi üretmez",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/foam-pad-for-c2-power-filter-2-pack",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-c3-foam-pad-14006-2pack",brand:"Fluval",model:"C3 Foam Pad · 2'li paket",category:"filter_media",
    description:"C3 Power Filter için iki yüksek gözenekli mekanik köpük ped · ürün kodu 14006 · UPC 015561140065 · büyük parçacık ve döküntüleri tutmaya yardımcıdır; bağımsız filtre kapasitesi üretmez",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/foam-pad-for-c3-power-filter-2-pack",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-c4-foam-pad-14007-2pack",brand:"Fluval",model:"C4 Foam Pad · 2'li paket",category:"filter_media",
    description:"C4 Power Filter için iki yüksek gözenekli mekanik köpük ped · ürün kodu 14007 · UPC 015561140072 · büyük parçacık ve döküntüleri tutmaya yardımcıdır; bağımsız filtre kapasitesi üretmez",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/foam-pad-for-c4-power-filter-2-pack",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-c2-poly-foam-pad-14008-3pack",brand:"Fluval",model:"C2 Poly/Foam Pad · 3'lü paket",category:"filter_media",
    description:"C2 Power Filter için üç iki yüzlü mekanik ped · ürün kodu 14008 · UPC 015561140089 · gözenekli yüz büyük parçacıkları birinci aşamada, yoğun polyester yüz ince döküntüyü ikinci aşamada tutar",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/poly-foam-pad-for-c2-power-filter-3-pack",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-c3-poly-foam-pad-14009-3pack",brand:"Fluval",model:"C3 Poly/Foam Pad · 3'lü paket",category:"filter_media",
    description:"C3 Power Filter için üç iki yüzlü mekanik ped · ürün kodu 14009 · UPC 015561140096 · gözenekli yüz büyük parçacıkları birinci aşamada, yoğun polyester yüz ince döküntüyü ikinci aşamada tutar",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/poly-foam-pad-for-c3-power-filter-3-pack",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-c4-poly-foam-pad-14010-3pack",brand:"Fluval",model:"C4 Poly/Foam Pad · 3'lü paket",category:"filter_media",
    description:"C4 Power Filter için üç iki yüzlü mekanik ped · ürün kodu 14010 · UPC 015561140102 · gözenekli yüz büyük parçacıkları birinci aşamada, yoğun polyester yüz ince döküntüyü ikinci aşamada tutar",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/poly-foam-pad-for-c4-power-filter-3-pack",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-c2-bio-screen-14020-3pack",brand:"Fluval",model:"C2 Bio-Screen Pad · 3'lü paket",category:"filter_media",
    description:"C2 Power Filter için üç biyolojik Bio-Screen ped · ürün kodu 14020 · UPC 015561140201 · yararlı bakteri kolonizasyonuna yüzey sağlar, suyu C-serisi damlatma haznesine eşit dağıtır ve döküntü tutmaya yardımcı olur; biyolojik döngü ve testin yerine geçmez",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/bio-screen-pad-for-c2-power-filter-3-pack",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-c3-bio-screen-14021-3pack",brand:"Fluval",model:"C3 Bio-Screen Pad · 3'lü paket",category:"filter_media",
    description:"C3 Power Filter için üç biyolojik Bio-Screen ped · ürün kodu 14021 · UPC 015561140218 · yararlı bakteri kolonizasyonuna yüzey sağlar, suyu C-serisi damlatma haznesine eşit dağıtır ve döküntü tutmaya yardımcı olur; biyolojik döngü ve testin yerine geçmez",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/bio-screen-pad-for-c3-power-filter-3-pack",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-c4-bio-screen-14022-3pack",brand:"Fluval",model:"C4 Bio-Screen Pad · 3'lü paket",category:"filter_media",
    description:"C4 Power Filter için üç biyolojik Bio-Screen ped · ürün kodu 14022 · UPC 015561140225 · yararlı bakteri kolonizasyonuna yüzey sağlar, suyu C-serisi damlatma haznesine eşit dağıtır ve döküntü tutmaya yardımcı olur; biyolojik döngü ve testin yerine geçmez",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/bio-screen-pad-for-c4-power-filter-3-pack",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-c2-carbon-14011-45g-3pack",brand:"Fluval",model:"C2 Activated Carbon 45 g · 3'lü paket",category:"filter_media",
    description:"C2 Power Filter için üç aktif karbon poşeti · yayımlanan paket toplamı 45 g · ürün kodu 14011 · UPC 015561140119 · koku, renklenme ve kirleticileri azaltmaya yardımcıdır; tatlı ve deniz suyu akvaryumlarına uygundur",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/activated-carbon-for-c2-power-filter-1-6-oz-45-g-3-pack",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-c3-carbon-14012-70g-3pack",brand:"Fluval",model:"C3 Activated Carbon 70 g · 3'lü paket",category:"filter_media",
    description:"C3 Power Filter için üç aktif karbon poşeti · yayımlanan paket toplamı 70 g · ürün kodu 14012 · UPC 015561140126 · koku, renklenme ve kirleticileri azaltmaya yardımcıdır; tatlı ve deniz suyu akvaryumlarına uygundur",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/activated-carbon-for-c3-power-filter-2-47-oz-70-g-3-pack",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-c4-carbon-14013-140g-3pack",brand:"Fluval",model:"C4 Activated Carbon 140 g · 3'lü paket",category:"filter_media",
    description:"C4 Power Filter için üç aktif karbon poşeti · yayımlanan paket toplamı 140 g · ürün kodu 14013 · UPC 015561140133 · koku, renklenme ve kirleticileri azaltmaya yardımcıdır; tatlı ve deniz suyu akvaryumlarına uygundur",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/activated-carbon-for-c4-power-filter-4-9-oz-140-g-3-pack",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-c2-ammonia-remover-14014-90g-3pack",brand:"Fluval",model:"C2 Ammonia Remover 90 g · 3'lü paket",category:"filter_media",
    description:"C2 Power Filter için üç kimyasal medya poşeti · yayımlanan paket toplamı 90 g · ürün kodu 14014 · UPC 015561140140 · yeni veya yoğun stoklu tatlı su akvaryumlarında amonyak ve nitrit kontrolüne yardımcıdır; biyolojik döngü, su testi ve su değişiminin yerine geçmez",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/ammonia-remover-for-c2-power-filter-3-17-oz-90-g-3-pack",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-c3-ammonia-remover-14015-140g-3pack",brand:"Fluval",model:"C3 Ammonia Remover 140 g · 3'lü paket",category:"filter_media",
    description:"C3 Power Filter için üç kimyasal medya poşeti · yayımlanan paket toplamı 140 g · ürün kodu 14015 · UPC 015561140157 · yeni veya yoğun stoklu tatlı su akvaryumlarında amonyak ve nitrit kontrolüne yardımcıdır; biyolojik döngü, su testi ve su değişiminin yerine geçmez",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/ammonia-remover-for-c3-power-filter-4-9-oz-140-g-3-pack",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-c4-ammonia-remover-14016-290g-3pack",brand:"Fluval",model:"C4 Ammonia Remover 290 g · 3'lü paket",category:"filter_media",
    description:"C4 Power Filter için üç kimyasal medya poşeti · yayımlanan paket toplamı 290 g · ürün kodu 14016 · UPC 015561140164 · yeni veya yoğun stoklu tatlı su akvaryumlarında amonyak ve nitrit kontrolüne yardımcıdır; biyolojik döngü, su testi ve su değişiminin yerine geçmez",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/ammonia-remover-for-c4-power-filter-10-2-oz-290-g-3-pack",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-c2-zeo-carb-14017-70g-3pack",brand:"Fluval",model:"C2 Zeo-Carb 70 g · 3'lü paket",category:"filter_media",
    description:"C2 Power Filter için üç karbon ve amonyak giderici karışım poşeti · yayımlanan paket toplamı 70 g · ürün kodu 14017 · UPC 015561140171 · koku, renklenme, kirletici ve toksik amonyağı azaltmaya yardımcıdır; biyolojik döngü, su testi ve su değişiminin yerine geçmez",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/zeo-carb-for-c2-power-filter-2-47-oz-70-g-3-pack",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-c3-zeo-carb-14018-3pack",brand:"Fluval",model:"C3 Zeo-Carb · 3'lü paket",category:"filter_media",
    description:"C3 Power Filter için üç karbon ve amonyak giderici karışım poşeti · ürün kodu 14018 · UPC 015561140188 · resmî ürün başlığı 4,58 oz ile 140 g değerlerini birlikte yayımlar; bu iki değer birbirine dönüşmediği için ağırlık kesin alan olarak kullanılmamıştır · koku, renklenme, kirletici ve toksik amonyağı azaltmaya yardımcıdır",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/zeo-carb-for-c3-power-filter-4-58-oz-140-g-3-pack",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-c4-zeo-carb-14019-3pack",brand:"Fluval",model:"C4 Zeo-Carb · 3'lü paket",category:"filter_media",
    description:"C4 Power Filter için üç karbon ve amonyak giderici karışım poşeti · ürün kodu 14019 · UPC 015561140195 · resmî ürün başlığı 2,47 oz ile 230 g değerlerini birlikte yayımlar; bu iki değer birbirine dönüşmediği için ağırlık kesin alan olarak kullanılmamıştır · koku, renklenme, kirletici ve toksik amonyağı azaltmaya yardımcıdır",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/zeo-carb-for-c4-power-filter-2-47-oz-230-g-3-pack",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-c-nodes-14023-c2-c3-100g",brand:"Fluval",model:"C-Nodes C2/C3 100 g",category:"filter_media",
    description:"C2 ve C3 Power Filter için yıldız biçimli biyolojik medya · 100 g · ürün kodu 14023 · UPC 015561140232 · karmaşık gözenek sistemi yararlı bakteri kolonizasyonuna geniş yüzey sağlar; biyolojik döngü ve testin yerine geçmez",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/c-nodes-for-c2-c3-power-filter-3-05-oz-100-g",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-c-nodes-14024-c4-200g",brand:"Fluval",model:"C-Nodes C4 200 g",category:"filter_media",
    description:"C4 Power Filter için yıldız biçimli biyolojik medya · 200 g · ürün kodu 14024 · UPC 015561140249 · karmaşık gözenek sistemi yararlı bakteri kolonizasyonuna geniş yüzey sağlar; biyolojik döngü ve testin yerine geçmez",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/c-nodes-for-c4-power-filter-7-oz-200g",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-fx2-bio-foam-a227-2pack",brand:"Fluval",model:"FX2 Bio-Foam · 2'li paket",category:"filter_media",
    description:"FX2 dış filtre için iki dalgalı yüzeyli mekanik/biyolojik köpük · ürün kodu A227 · UPC 015561102278 · büyük döküntüyü tutarken gözenekli yapı yararlı bakteri kolonizasyonunu destekler; tatlı ve deniz suyu için uygundur, bağımsız filtre kapasitesi üretmez",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/bio-foam-for-fx2-canister-filter-2-pack",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-fx4-fx5-fx6-bio-foam-a228-3pack",brand:"Fluval",model:"FX4/FX5/FX6 Bio-Foam · 3'lü paket",category:"filter_media",
    description:"FX4, FX5 ve FX6 dış filtreler için üç mekanik köpük · ürün kodu A228 · UPC 015561102285 · özel kesim medya bypass riskini azaltır, uygun gözenek su akışını korur ve biyolojik filtrasyonu destekler; tatlı ve deniz suyu için uygundur",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/bio-foam-for-fx4-fx5-fx6-canister-filter-3-pack",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-fx-bio-foam-plus-a239-2pack",brand:"Fluval",model:"FX2/FX4/FX5/FX6 Bio-Foam+ · 2'li paket",category:"filter_media",
    description:"FX2, FX4, FX5 ve FX6 dış filtreler için iki yoğun mekanik/biyolojik köpük · ürün kodu A239 · UPC 015561102391 · küçük parçacıkları tutan yapı, yararlı bakteri gelişimine geniş gözenekli yüzey sağlar; tatlı ve deniz suyu için uygundur",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/bio-foam-for-fx4-fx5-fx6-canister-filter-2-pack",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-fx-carbon-foam-a249-2pack",brand:"Fluval",model:"FX2/FX4/FX5/FX6 Carbon Foam · 2'li paket",category:"filter_media",
    description:"FX2, FX4, FX5 ve FX6 dış filtreler için iki karbon emdirilmiş mekanik/kimyasal köpük · ürün kodu A249 · UPC 015561102490 · küçük parçacıkların yanında koku, renklenme, ağır metal ve organik kirleticileri azaltmaya yardımcıdır; tatlı ve deniz suyu için uygundur",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/carbon-foam-for-fx4-fx5-fx6-canister-filter-2-pack",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-fx-quick-clear-a246-3pack",brand:"Fluval",model:"FX2/FX4/FX5/FX6 Quick-Clear · 3'lü paket",category:"filter_media",
    description:"FX2, FX4, FX5 ve FX6 dış filtreler için üç ultra ince polyester su parlatma pedi · ürün kodu A246 · UPC 015561102469 · mikro parçacık ve döküntüyü tutar; bulanıklıkta veya genel bakım sonrasında kullanılan pasif mekanik medyadır",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/quick-clear-for-fx2-fx4-fx5-fx6-canister-filter-3-pack",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-fx-max-clean-a248-3pack",brand:"Fluval",model:"FX2/FX4/FX5/FX6 Max-Clean · 3'lü paket",category:"filter_media",
    description:"FX2, FX4, FX5 ve FX6 dış filtreler için üç dayanıklı ince polyester ped · ürün kodu A248 · UPC 015561102483 · küçük parçacık ve döküntüyü tutar; üretici en iyi su berraklığı için A246 Quick-Clear ile birlikte kullanım belirtir",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/max-clean-for-fx2-fx4-fx5-fx6-canister-filter-3-pack",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-fx-nitrite-remover-a265-3pack",brand:"Fluval",model:"FX2/FX4/FX5/FX6 Nitrite Remover · 3'lü paket",category:"filter_media",
    description:"FX2, FX4, FX5 ve FX6 dış filtreler için üç nitrit reçinesi emdirilmiş mekanik/kimyasal ped · ürün kodu A265 · UPC 015561102650 · nitriti ve askıdaki döküntüyü azaltmaya yardımcıdır; üretici değişimi aylık veya su testi sonucuna göre belirtir, biyolojik döngü ve su değişiminin yerine geçmez",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/nitrite-remover-for-fx4-fx5-fx6-canister-filter-3-pack",additionalSourceUrls:["https://fluvalaquatics.com/ca/shop/product/nitrite-remover-for-fx4-fx5-fx6-canister-filter-3-pack"],verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-fx-ammonia-remover-a259-3pack",brand:"Fluval",model:"FX2/FX4/FX5/FX6 Ammonia Remover · 3'lü paket",category:"filter_media",
    description:"FX2, FX4, FX5 ve FX6 dış filtreler için üç mekanik/kimyasal amonyak pedi · ürün kodu A259 · UPC 015561102599 · yeni veya yoğun stoklu akvaryumlarda toksik amonyak sıçramalarını ve askıdaki döküntüyü azaltmaya yardımcıdır; biyolojik döngü, su testi ve uygun su değişiminin yerine geçmez",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/ammonia-remover-for-fx4-fx5-fx6-canister-filter-3-pack",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-fx-phosphate-remover-a262-3pack",brand:"Fluval",model:"FX2/FX4/FX5/FX6 Phosphate Remover · 3'lü paket",category:"filter_media",
    description:"FX2, FX4, FX5 ve FX6 dış filtreler için üç fosfat reçinesi emdirilmiş mekanik/kimyasal ped · ürün kodu A262 · UPC 015561102629 · fosfatı ve askıdaki döküntüyü azaltmaya yardımcıdır; üretici değişimi aylık veya su testi sonucuna göre belirtir, temel bakım ve su değişiminin yerine geçmez",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/phosphate-remover-for-fx4-fx5-fx6-canister-filter-3-pack",additionalSourceUrls:["https://fluvalaquatics.com/uk/shop/product/phosphate-remover-for-fx4-fx5-fx6-canister-filter-3-pack"],verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-bio-fx-a1458-2l",brand:"Fluval",model:"BIO-FX 2 L",category:"filter_media",
    description:"Tüm dış ve askı filtreleri için 2 L güvenli inert seramik biyolojik medya · ürün kodu A1458 · UPC 015561114585 · litre başına 2.250 m² yüzey, derin bağlantılı mikro tüneller ve serbest su akışı yararlı nitrifikasyon bakterilerini destekler; küçük dış/askı filtrelerine yöneliktir, biyolojik döngü ve su testinin yerine geçmez",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/bio-fx-2-l",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-bio-fx-a1459-5l",brand:"Fluval",model:"BIO-FX 5 L",category:"filter_media",
    description:"Büyük dış filtre ve sump sistemleri için 5 L güvenli inert seramik biyolojik medya · ürün kodu A1459 · UPC 015561114592 · litre başına 2.250 m² yüzey, derin bağlantılı mikro tüneller ve serbest su akışı yararlı nitrifikasyon bakterilerini destekler; biyolojik döngü ve su testinin yerine geçmez",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/bio-fx-5-l",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-106-107-bio-foam-value-pack-a334",brand:"Fluval",model:"106/107 Bio-Foam Value Pack",category:"filter_media",
    description:"Fluval 106 ve 107 dış filtreler için altı aylık mekanik/biyolojik medya paketi · ürün kodu A334 · UPC 015561103343 · içerik: 2 × A187 Bio-Foam Max, 2 × A220 Bio-Foam ve 1 × A236 Bio-Foam+ · tatlı ve deniz suyu için uygundur",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/bio-foam-for-106-107-canister-filter-value-pack",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-206-207-bio-foam-value-pack-a335",brand:"Fluval",model:"206/207 Bio-Foam Value Pack",category:"filter_media",
    description:"Fluval 206 ve 207 dış filtreler için altı aylık mekanik/biyolojik medya paketi · ürün kodu A335 · UPC 015561103350 · içerik: 2 × A188 Bio-Foam Max, 2 × A222 Bio-Foam ve 1 × A236 Bio-Foam+ · tatlı ve deniz suyu için uygundur",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/bio-foam-for-206-207-canister-filter-value-pack",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-306-307-bio-foam-value-pack-a336",brand:"Fluval",model:"306/307 Bio-Foam Value Pack",category:"filter_media",
    description:"Fluval 306 ve 307 dış filtreler için altı aylık mekanik/biyolojik medya paketi · ürün kodu A336 · UPC 015561103367 · içerik: 2 × A188 Bio-Foam Max, 2 × A222 Bio-Foam ve 2 × A237 Bio-Foam+ · tatlı ve deniz suyu için uygundur",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/bio-foam-for-306-307-canister-filter-value-pack",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-406-407-bio-foam-value-pack-a337",brand:"Fluval",model:"406/407 Bio-Foam Value Pack",category:"filter_media",
    description:"Fluval 406 ve 407 dış filtreler için altı aylık mekanik/biyolojik medya paketi · ürün kodu A337 · UPC 015561103374 · içerik: 2 × A189 Bio-Foam Max, 2 × A226 Bio-Foam ve 2 × A237 Bio-Foam+ · tatlı ve deniz suyu için uygundur",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/bio-foam-for-406-407-canister-filter-value-pack",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-106-107-bio-foam-a220-2pack",brand:"Fluval",model:"106/107 Bio-Foam · 2'li paket",category:"filter_media",
    description:"Fluval 106 ve 107 dış filtreler için iki hassas kesimli mekanik köpük · ürün kodu A220 · UPC 015561102209 · büyük döküntüyü tutar, boşluksuz kesim medya bypass riskini azaltır ve uygun gözenek su akışını korurken biyolojik filtrasyonu destekler",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/bio-foam-for-106-107-canister-filter-2-pack",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-206-306-207-307-bio-foam-a222-2pack",brand:"Fluval",model:"206/306–207/307 Bio-Foam · 2'li paket",category:"filter_media",
    description:"Fluval 206/306 ve 207/307 dış filtreler için iki hassas kesimli mekanik köpük · ürün kodu A222 · UPC 015561102223 · büyük döküntüyü tutar, boşluksuz kesim medya bypass riskini azaltır ve uygun gözenek su akışını korurken biyolojik filtrasyonu destekler",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/bio-foam-for-206-306-207-307-canister-filter-2-pack",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-406-407-bio-foam-a226-2pack",brand:"Fluval",model:"406/407 Bio-Foam · 2'li paket",category:"filter_media",
    description:"Fluval 406 ve 407 dış filtreler için iki hassas kesimli mekanik köpük · ürün kodu A226 · UPC 015561102261 · büyük döküntüyü tutar, boşluksuz kesim medya bypass riskini azaltır ve uygun gözenek su akışını korurken biyolojik filtrasyonu destekler",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/bio-foam-for-406-407-canister-filter-2-pack",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-106-206-107-207-bio-foam-plus-a236-3pack",brand:"Fluval",model:"106/206–107/207 Bio-Foam+ · 3'lü paket",category:"filter_media",
    description:"Fluval 106/206 ve 107/207 dış filtreler için üç mekanik/biyolojik köpük · ürün kodu A236 · UPC 015561102360 · ilk köpük aşamasını geçen küçük parçacıkları tutar ve geniş gözenekli yüzey yararlı nitrifikasyon bakterilerini destekler; üç ayda akvaryum suyuyla durulama ve altı ayda değişim önerilir",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/bio-foam-for-106-206-107-207-canister-filter-3-pack",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-306-406-307-407-bio-foam-plus-a237-2pack",brand:"Fluval",model:"306/406–307/407 Bio-Foam+ · 2'li paket",category:"filter_media",
    description:"Fluval 306/406 ve 307/407 dış filtreler için iki yoğun mekanik/biyolojik köpük · ürün kodu A237 · UPC 015561102377 · küçük parçacıkları tutan yoğun yapı, yararlı bakteri gelişimi için geniş gözenekli yüzey sağlar; biyolojik döngü ve su testinin yerine geçmez",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/bio-foam-for-306-406-307-407-canister-filter-2-pack",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-106-107-bio-foam-max-a187-2pack",brand:"Fluval",model:"106/107 Bio-Foam Max · 2'li paket",category:"filter_media",
    description:"Fluval 106 ve 107 dış filtreler için iki dalgalı mekanik/biyolojik köpük · ürün kodu A187 · UPC 015561101875 · düz yüzeye göre %30 daha fazla alan sunarak atık ve döküntü yakalamayı, düzenli akışı ve yararlı bakteri gelişimini destekler; altı ayda değişim önerilir",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/bio-foam-max-for-106-107-canister-filter-2-pack",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-206-306-207-307-bio-foam-max-a188-2pack",brand:"Fluval",model:"206/306–207/307 Bio-Foam Max · 2'li paket",category:"filter_media",
    description:"Fluval 206/306 ve 207/307 dış filtreler için iki dalgalı mekanik/biyolojik köpük · ürün kodu A188 · UPC 015561101882 · düz yüzeye göre %30 daha fazla alan sunarak atık ve döküntü yakalamayı, düzenli akışı ve yararlı bakteri gelişimini destekler; altı ayda değişim önerilir",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/bio-foam-max-for-206-306-207-307-canister-filter-2-pack",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-406-407-bio-foam-max-a189-2pack",brand:"Fluval",model:"406/407 Bio-Foam Max · 2'li paket",category:"filter_media",
    description:"Fluval 406 ve 407 dış filtreler için iki dalgalı mekanik/biyolojik köpük · ürün kodu A189 · UPC 015561101899 · düz yüzeye göre %30 daha fazla alan sunarak atık ve döküntü yakalamayı, düzenli akışı ve yararlı bakteri gelişimini destekler; altı ayda değişim önerilir",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/bio-foam-max-for-406-407-canister-filter-2-pack",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-106-206-107-207-quick-clear-a242-3pack",brand:"Fluval",model:"106/206–107/207 Quick-Clear · 3'lü paket",category:"filter_media",
    description:"Fluval 106/206 ve 107/207 dış filtreler için üç ultra ince polyester mekanik parlatma pedi · ürün kodu A242 · UPC 015561102421 · mikro parçacık ve döküntüyü tutmaya yardımcıdır; bulanık su oluştuğunda veya akvaryum bakımından hemen sonra kullanım için yayımlanmıştır ve tatlı/deniz suyu akvaryumlarına uygundur",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/quick-clear-for-106-206-107-207-canister-filter-3-pack",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-306-406-307-407-quick-clear-a244-6pack",brand:"Fluval",model:"306/406–307/407 Quick-Clear · 6'lı paket",category:"filter_media",
    description:"Fluval 306/406 ve 307/407 dış filtreler için altı ultra ince polyester mekanik parlatma pedi · ürün kodu A244 · UPC 015561102445 · mikro parçacık ve döküntüyü tutmaya yardımcıdır; bulanık su oluştuğunda veya akvaryum bakımından hemen sonra kullanım için yayımlanmıştır ve tatlı/deniz suyu akvaryumlarına uygundur",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/quick-clear-for-306-406-307-407-canister-filter-6-pack",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-106-206-107-207-ammonia-remover-a257-3pack",brand:"Fluval",model:"106/206–107/207 Ammonia Remover · 3'lü paket",category:"filter_media",
    description:"Fluval 106/206 ve 107/207 dış filtreler için üç mekanik/kimyasal amonyak pedi · ürün kodu A257 · UPC 015561102575 · toksik amonyak sıçramalarını ve askıdaki döküntüyü azaltmaya yardımcıdır; yeni, yoğun stoklu veya ilaç uygulaması sonrasındaki akvaryumlar için yayımlanmıştır ve tatlı/deniz suyuna uygundur · biyolojik döngü, su testi ve uygun su değişiminin yerine geçmez",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/ammonia-remover-for-106-206-107-207-canister-filter-3-pack",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-306-406-307-407-ammonia-remover-a258-6pack",brand:"Fluval",model:"306/406–307/407 Ammonia Remover · 6'lı paket",category:"filter_media",
    description:"Fluval 306/406 ve 307/407 dış filtreler için altı mekanik/kimyasal amonyak pedi · ürün kodu A258 · UPC 015561102582 · toksik amonyak sıçramalarını ve askıdaki döküntüyü azaltmaya yardımcıdır; yeni, yoğun stoklu veya ilaç uygulaması sonrasındaki akvaryumlar için yayımlanmıştır ve tatlı/deniz suyuna uygundur · biyolojik döngü, su testi ve uygun su değişiminin yerine geçmez",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/ammonia-remover-for-306-406-307-407-canister-filter-6-pack",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-106-206-107-207-nitrite-remover-a263-3pack",brand:"Fluval",model:"106/206–107/207 Nitrite Remover · 3'lü paket",category:"filter_media",
    description:"Fluval 106/206 ve 107/207 dış filtreler için üç nitrit reçinesi emdirilmiş mekanik/kimyasal ped · ürün kodu A263 · UPC 015561102636 · nitriti ve askıdaki döküntüyü azaltmaya yardımcı olur, yararlı bakteri ortamını destekler ve tatlı/deniz suyuna uygundur · kullanım gereksinimi su testiyle değerlendirilmelidir; biyolojik döngü ve su değişiminin yerine geçmez",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/nitrite-remover-for-106-206-107-207-canister-filter-3-pack",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-306-406-307-407-nitrite-remover-a264-6pack",brand:"Fluval",model:"306/406–307/407 Nitrite Remover · 6'lı paket",category:"filter_media",
    description:"Fluval 306/406 ve 307/407 dış filtreler için altı nitrit reçinesi emdirilmiş mekanik/kimyasal ped · ürün kodu A264 · UPC 015561102643 · nitriti ve askıdaki döküntüyü azaltmaya yardımcı olur, yararlı bakteri ortamını destekler ve tatlı/deniz suyuna uygundur · kullanım gereksinimi su testiyle değerlendirilmelidir; biyolojik döngü ve su değişiminin yerine geçmez",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/nitrite-remover-for-306-406-307-407-canister-filter-6-pack",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-106-206-107-207-phosphate-remover-a260-3pack",brand:"Fluval",model:"106/206–107/207 Phosphate Remover · 3'lü paket",category:"filter_media",
    description:"Fluval 106/206 ve 107/207 dış filtreler için üç fosfat reçinesi emdirilmiş mekanik/kimyasal ped · ürün kodu A260 · UPC 015561102605 · fosfatı ve askıdaki döküntüyü azaltarak olası alg artışını sınırlamaya yardımcıdır ve tatlı/deniz suyuna uygundur · kullanım gereksinimi su testiyle değerlendirilmelidir; temel bakım ve su değişiminin yerine geçmez",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/phosphate-remover-for-106-206-107-207-canister-filter-3-pack",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-306-406-307-407-phosphate-remover-a261-6pack",brand:"Fluval",model:"306/406–307/407 Phosphate Remover · 6'lı paket",category:"filter_media",
    description:"Fluval 306/406 ve 307/407 dış filtreler için altı fosfat reçinesi emdirilmiş mekanik/kimyasal ped · ürün kodu A261 · UPC 015561102612 · fosfatı ve askıdaki döküntüyü azaltarak olası alg artışını sınırlamaya yardımcıdır ve tatlı/deniz suyuna uygundur · kullanım gereksinimi su testiyle değerlendirilmelidir; temel bakım ve su değişiminin yerine geçmez",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/phosphate-remover-for-306-406-307-407-canister-filter-6-pack",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-106-206-107-207-media-value-pack-a1461",brand:"Fluval",model:"106/206–107/207 Media Value Pack · 6 aylık",category:"filter_media",
    description:"Fluval 106/206 ve 107/207 dış filtreler için altı aylık mekanik/kimyasal medya paketi · ürün kodu A1461 · UPC 015561114615 · içerik: 6 × Carbon A1440 (toplam 100 g), 3 × Quick-Clear A242 ve 6 × Phosphate Remover A260 · tatlı ve deniz suyu için uygundur; fosfat medyası su testi ve düzenli bakımın yerine geçmez",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/media-value-pack-for-106-206-107-207-canister-filter",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-306-406-307-407-media-value-pack-a1462",brand:"Fluval",model:"306/406–307/407 Media Value Pack · 6 aylık",category:"filter_media",
    description:"Fluval 306/406 ve 307/407 dış filtreler için altı aylık mekanik/kimyasal medya paketi · ürün kodu A1462 · UPC 015561114622 · içerik: 12 × Carbon A1440 (toplam 100 g), 6 × Quick-Clear A242 ve 12 × Phosphate Remover A260 · tatlı ve deniz suyu için uygundur; üreticinin bu paket için yayımladığı A242/A260 içerik kodları daha küçük tekil ped paketleriyle karıştırılmadan korunmuştur ve fosfat medyası su testi/düzenli bakımın yerine geçmez",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/media-value-pack-for-306-406-307-407-canister-filter",verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-ammonia-remover-a1480-180g-3pack",brand:"Fluval",model:"Ammonia Remover 180 g · 3'lü paket",category:"filter_media",
    description:"Tüm dış filtrelerde kullanılabilen üç adet 180 g doğal iyon değişim medyası poşeti · ürün kodu A1480 (Birleşik Krallık sayfasında L-A1480) · UPC 015561114806 · toksik amonyağı azaltmaya yardımcıdır ve yalnız tatlı su içindir · üretici aylık değişim ve tüm filtre medyasını aynı anda değiştirmemeyi önerir; biyolojik döngü, su testi ve uygun su değişiminin yerine geçmez",
    sourceUrl:"https://fluvalaquatics.com/uk/shop/product/ammonia-remover-6-3-oz-180-g-3-pack",additionalSourceUrls:["https://fluvalaquatics.com/us/shop/product/ammonia-remover","https://fluvalaquatics.com/manuals/Fluval_Filter-Media_Manual.pdf"],verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-ammonia-remover-a1486-1600g",brand:"Fluval",model:"Ammonia Remover 1600 g",category:"filter_media",
    description:"Tüm dış filtreler için file torbalı 1600 g doğal iyon değişim medyası · ürün kodu A1486 · toksik amonyağı azaltmaya yardımcıdır ve yalnız tatlı su içindir · üretici aylık değişim ve tüm filtre medyasını aynı anda değiştirmemeyi önerir; biyolojik döngü, su testi ve uygun su değişiminin yerine geçmez",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/ammonia-remover",additionalSourceUrls:["https://fluvalaquatics.com/careguides/fluval-guide-daquariophilie.pdf","https://fluvalaquatics.com/manuals/Fluval_Filter-Media_Manual.pdf"],verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-zeo-carb-a1490-150g-3pack",brand:"Fluval",model:"Zeo-Carb 150 g · 3'lü paket",category:"filter_media",
    description:"Tüm dış filtrelerde kullanılabilen üç adet 150 g karbon ve amonyak giderici karışımı · ürün kodu A1490 · sıvı kirleticileri, koku, renklenme ve toksik amonyağı azaltmaya yardımcıdır; yalnız tatlı su içindir · üretici aylık değişim ve tüm filtre medyasını aynı anda değiştirmemeyi önerir; biyolojik döngü, su testi ve uygun su değişiminin yerine geçmez",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/zeo-carb-product",additionalSourceUrls:["https://fluvalaquatics.com/manuals/Fluval_Filter-Media_Manual.pdf"],verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-zeo-carb-a1492-1200g",brand:"Fluval",model:"Zeo-Carb 1200 g",category:"filter_media",
    description:"Tüm dış filtreler için file torbalı 1200 g karbon ve amonyak giderici karışımı · ürün kodu A1492 · sıvı kirleticileri, koku, renklenme ve toksik amonyağı azaltmaya yardımcıdır; yalnız tatlı su içindir · üretici aylık değişim ve tüm filtre medyasını aynı anda değiştirmemeyi önerir; biyolojik döngü, su testi ve uygun su değişiminin yerine geçmez",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/zeo-carb-product",additionalSourceUrls:["https://fluvalaquatics.com/careguides/fluval-guide-daquariophilie.pdf","https://fluvalaquatics.com/manuals/Fluval_Filter-Media_Manual.pdf"],verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-clearmax-a1348-100g-3pack",brand:"Fluval",model:"ClearMax 100 g · 3'lü paket",category:"filter_media",
    description:"Tüm dış filtreler için üç adet 100 g bilimsel sınıf reçine poşeti · ürün kodu A1348 · UPC 015561113489 · üretici 300 L su arıtma kapasitesi yayımlar; fosfat, nitrit ve nitratı adsorbe etmeye yardımcıdır · tatlı ve deniz suyuna uygundur ancak deniz suyunda nitratı gidermez · aylık değişim önerilir; su testi, biyolojik döngü ve düzenli bakımın yerine geçmez, tüm medya aynı anda değiştirilmemelidir",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/clearmax-3-52-oz-100-g-3-pack",additionalSourceUrls:["https://fluvalaquatics.com/manuals/Fluval_Filter-Media_Manual.pdf"],verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-pre-filter-a1470-750g",brand:"Fluval",model:"Pre-Filter 750 g",category:"filter_media",
    description:"Tüm dış filtreler için 750 g inert seramik mekanik ön filtre medyası · ürün kodu A1470 · UPC 015561114707 · orta ve kaba filtrasyonda katı atık parçacıklarını daha ince medyaya ulaşmadan tutarak erken tıkanmayı ve medya değişim sıklığını azaltmaya yardımcıdır; bağımsız filtre kapasitesi üretmez",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/pre-filter-26-45-oz-750g",additionalSourceUrls:["https://fluvalaquatics.com/careguides/fluval-guide-daquariophilie.pdf"],verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-carbon-a1447-900g",brand:"Fluval",model:"Carbon 900 g",category:"filter_media",
    description:"Tüm dış filtreler için 900 g toplu bitümlü aktif karbon · ürün kodu A1447 · ağır metal, koku, renklenme, organik kirletici ve diğer kirleticileri adsorbe etmeye yardımcıdır; fosfat seviyesini yükseltmez ve tatlı/deniz suyuna uygundur · dış filtrede file torba içinde kullanılmalı, aylık değiştirilmeli ve tüm medya aynı anda değiştirilmemelidir",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/carbon",additionalSourceUrls:["https://fluvalaquatics.com/careguides/fluval-guide-daquariophilie.pdf","https://fluvalaquatics.com/manuals/Fluval_Filter-Media_Manual.pdf"],verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-carbon-a1448-1650g-archive",brand:"Fluval",model:"Carbon 1650 g (Arşiv)",category:"filter_media",
    description:"Üreticinin resmî medya kılavuzundaki 1650 g toplu bitümlü aktif karbon seçeneği · ürün kodu A1448 · ağır metal, koku, renklenme, organik kirletici ve diğer kirleticileri adsorbe etmeye yardımcıdır; fosfat seviyesini yükseltmez ve tatlı/deniz suyuna uygundur · güncel genel ürün sayfası bu eski büyük paketi ayrı seçilebilir varyant olarak göstermediği için arşiv etiketiyle korunur; dış filtrede file torba içinde kullanılmalı ve tüm medya aynı anda değiştirilmemelidir",
    sourceUrl:"https://fluvalaquatics.com/manuals/Fluval_Filter-Media_Manual.pdf",additionalSourceUrls:["https://fluvalaquatics.com/us/shop/product/carbon"],verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-biomax-a1457-1100g",brand:"Fluval",model:"BIOMAX 1100 g",category:"filter_media",
    description:"Tüm dış filtreler için 1100 g karmaşık gözenekli biyolojik seramik halka · ürün kodu A1457 · UPC 015561114578 · yararlı bakteri kolonizasyonunu ve amonyak/nitrit kontrolünü destekler; tatlı ve deniz suyuna uygundur · üretici altı ayda değişim önerir; biyolojik döngü ve su testinin yerine geçmez, tüm biyolojik medya aynı anda değiştirilmemelidir",
    sourceUrl:"https://fluvalaquatics.com/ca/shop/product/biomax-38-80-oz-1100-g",additionalSourceUrls:["https://fluvalaquatics.com/manuals/Fluval_Filter-Media_Manual.pdf"],verifiedAt:"2026-09-28",
  },
  {
    id:"fluval-peat-granules-a1465-500g",brand:"Fluval",model:"Peat Granules 500 g",category:"filter_media",
    description:"Tüm dış filtreler için 500 g yüksek yoğunluklu doğal torf granülü · ürün kodu A1465 · UPC 015561114653 · hümik asit, tanen ve iz elementler içerir; yumuşak ve asidik su isteyen türlerde suyu yumuşatmaya ve pH'ı düşürmeye yardımcıdır, yalnız tatlı su içindir · dış filtrede file torba içinde kullanılmalı; etkinlik zamanla azaldığından pH ve KH düzenli ölçülmeli, üreticinin yayımladığı 3–5 dKH aralığı yalnız uygun yumuşak/asidik su türleri için hedef olarak değerlendirilmelidir",
    sourceUrl:"https://fluvalaquatics.com/ca/fr/shop/product/aquatic-peat-17-63-oz-500-g-2",additionalSourceUrls:["https://fluvalaquatics.com/manuals/Fluval_Filter-Media_Manual.pdf","https://fluvalaquatics.com/ca/blog/replacing-filter-media-why-and-when"],verifiedAt:"2026-09-29",
  },
  {
    id:"fluval-zeo-carb-a1493-2100g",brand:"Fluval",model:"Zeo-Carb 2100 g",category:"filter_media",
    description:"Tüm dış filtreler için 2100 g karbon ve amonyak giderici karışımı · ürün kodu A1493 · UPC 015561114936 · sıvı kirleticileri, koku, renklenme ve toksik amonyağı azaltmaya yardımcıdır; yalnız tatlı su içindir · dış filtrede file torba içinde kullanılmalı, üretici aylık değişim ve tüm filtre medyasını aynı anda değiştirmemeyi önerir; biyolojik döngü, su testi ve uygun su değişiminin yerine geçmez",
    sourceUrl:"https://fluvalaquatics.com/ca/shop/product/zeo-carb-74-07-oz-2100-g",additionalSourceUrls:["https://fluvalaquatics.com/manuals/Fluval_Filter-Media_Manual.pdf"],verifiedAt:"2026-09-29",
  },
  {
    id:"fluval-universal-nylon-bags-a1428-2pack",brand:"Fluval",model:"Universal Nylon Media Bag 16,5 × 25,4 cm · 2'li paket",category:"filter_media",
    description:"Tüm Fluval dış filtrelerinde toplu kimyasal veya biyolojik medya için iki evrensel naylon torba · ürün kodu A1428 · UPC 015561114288 · ölçü 16,5 × 25,4 cm · kapanabilir yapı karbon, amonyak giderici, Zeo-Carb ve torf gibi gevşek medyanın pompa haznesine kaçmasını önlemeye yardımcıdır; FX2/FX4/FX6 filtrelerin resmî parça tablosunda medya torbası olarak listelenir ve bağımsız filtrasyon kapasitesi üretmez",
    sourceUrl:"https://fluvalaquatics.com/us/shop/product/universal-nylon-bags-6-5-x-10-16-5-x-25-4-cm-2-pack",additionalSourceUrls:["https://fluvalaquatics.com/us/wp-content/uploads/2024/09/FX_Manual.pdf"],verifiedAt:"2026-09-29",
  },
  {
    id:"ferplast-co2-energy-ingredients",brand:"Ferplast",model:"CO₂ ENERGY INGREDIENTS",category:"fertilizer",
    description:"CO₂ Energy Classic sistemi için uzun süreli karbondioksit üretimine yönelik doğal bileşen kiti",
    sourceUrl:"https://www.ferplast.com/products/co2-energy-ingredients",verifiedAt:"2026-08-27",
  },
];

const careCatalogIds = new Set<string>();
for (const product of careProductCatalog) {
  if (careCatalogIds.has(product.id)) throw new Error(`Bakım ürünü kataloğunda yinelenen kimlik: ${product.id}`);
  careCatalogIds.add(product.id);
  if (!product.brand.trim() || !product.model.trim() || !product.description.trim()) {
    throw new Error(`Bakım ürünü kataloğunda eksik zorunlu alan: ${product.id}`);
  }
  if (!/^https:\/\//.test(product.sourceUrl) || !/^\d{4}-\d{2}-\d{2}$/.test(product.verifiedAt)) {
    throw new Error(`Bakım ürünü kataloğunda geçersiz kaynak kaydı: ${product.id}`);
  }
}

export const careCategoryLabels: Record<CareProductCategory,string> = {
  food:"Yem", fertilizer:"Gübre", water_conditioner:"Su düzenleyici", bacteria:"Bakteri kültürü",
  test:"Test", filter_media:"Filtre medyası", substrate:"Taban malzemesi", plant_seed:"Bitki tohumu", treatment:"Tedavi", decoration:"Dekorasyon",
  aquarium_set:"Akvaryum seti", aquaterrarium:"Aquaterrarium", terrarium:"Terrarium", tank:"Boş akvaryum",
  cover:"Akvaryum kapağı", cabinet:"Akvaryum dolabı",
};
