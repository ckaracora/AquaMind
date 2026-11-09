export type CareProductCategory = "food" | "fertilizer" | "water_conditioner" | "bacteria" | "test" | "filter_media" | "substrate" | "plant_seed" | "treatment" | "decoration" | "cleaning" | "accessory" | "aquarium_set" | "aquaterrarium" | "terrarium" | "tank" | "cover" | "cabinet";

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
const seraTreatmentSource = "https://www.sera.de/us/freshwater-aquarium/Products/maintain-freshwater-aquariums/treat-diseases/";
const seraMediaSource = "https://www.sera.de/us/freshwater-aquarium/Products/technical-products-for-freshwater-aquariums/filter-media/";
const shrimpsForeverLegacySource = "https://www.shrimpsforever.com/";
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
const aquaminsRetailSource = "https://atakanpetshop.com/aquamins";

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

const shrimpsForeverProducts = (category:CareProductCategory, entries:Array<[string,string,string]>): CareProductProfile[] =>
  entries.map(([slug,model,description]) => ({
    id:catalogSlug(`Shrimps Forever-${model}`), brand:"Shrimps Forever", model, category, description,
    sourceUrl:`https://shrimpsforever.com/${slug}`, verifiedAt:"2026-10-25",
  }));

const masterLineProducts = (category:CareProductCategory, entries:Array<[string,string,string]>): CareProductProfile[] =>
  entries.map(([slug,model,description]) => ({
    id:catalogSlug(`MasterLine-${model}`), brand:"MasterLine", model, category, description,
    sourceUrl:`https://masterline.ro/${slug}/`, verifiedAt:"2026-10-26",
  }));

const aquaminsProducts = (category:CareProductCategory, path:string, entries:Array<[string,string]>): CareProductProfile[] =>
  entries.map(([model,description]) => ({
    id:catalogSlug(`Aquamins-${model}`), brand:"Aquamins", model, category, description,
    sourceUrl:`https://aquamins.com.tr/EN/Products/${path}`, verifiedAt:"2026-10-26",
  }));

const dophinTankProducts = (
  category:"aquarium_set"|"tank",
  sourceUrl:string,
  entries:Array<[string,number|undefined,string,[number,number,number]?]>,
): CareProductProfile[] => entries.map(([model,volumeL,description,dimensionsCm]) => ({
  id:catalogSlug(`Dophin-${model}`), brand:"Dophin", model, category, description,
  ...(volumeL === undefined ? {} : {volumeL}), ...(dimensionsCm ? {dimensionsCm} : {}),
  sourceUrl, verifiedAt:"2026-10-27",
}));

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
  ...products("Tropical","food","https://tropical.pl/tropical/product/SUPERVIT",[
    ["Supervit Flakes 12 g Sachet","Günlük çok bileşenli pul yem · ürün kodu 70011 · EAN 5900469700112 · gün içinde birkaç küçük porsiyon, birkaç dakikada tüketilecek miktarda"],
    ["Supervit Flakes 100 ml / 20 g","Günlük çok bileşenli pul yem · ürün kodu 77103 · EAN 5900469771037 · gün içinde birkaç küçük porsiyon, birkaç dakikada tüketilecek miktarda"],
    ["Supervit Flakes 250 ml / 50 g","Günlük çok bileşenli pul yem · ürün kodu 77104 · EAN 5900469771044 · gün içinde birkaç küçük porsiyon, birkaç dakikada tüketilecek miktarda"],
    ["Supervit Flakes 500 ml / 100 g","Günlük çok bileşenli pul yem · ürün kodu 77105 · EAN 5900469771051 · gün içinde birkaç küçük porsiyon, birkaç dakikada tüketilecek miktarda"],
    ["Supervit Flakes 1000 ml / 200 g","Günlük çok bileşenli pul yem · ürün kodu 77106 · EAN 5900469771068 · gün içinde birkaç küçük porsiyon, birkaç dakikada tüketilecek miktarda"],
    ["Supervit Flakes 5 L / 1 kg","Günlük çok bileşenli pul yem · ürün kodu 70407 · EAN 5900469704073 · gün içinde birkaç küçük porsiyon, birkaç dakikada tüketilecek miktarda"],
    ["Supervit Flakes 11 L / 2 kg","Günlük çok bileşenli pul yem · ürün kodu 70408 · EAN 5900469704080 · gün içinde birkaç küçük porsiyon, birkaç dakikada tüketilecek miktarda"],
    ["Supervit Flakes 21 L / 4 kg","Günlük çok bileşenli pul yem · ürün kodu 70409 · EAN 5900469704097 · gün içinde birkaç küçük porsiyon, birkaç dakikada tüketilecek miktarda"],
  ],"2026-10-09"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/supervit-mini-flakes",[
    ["Supervit Mini Flakes 110 ml / 44 g","Küçük balıklar ve yavrular için mini pul yem · ürün kodu 77113 · EAN 5900469771136 · gün içinde birkaç küçük porsiyon, birkaç dakikada tüketilecek miktarda"],
    ["Supervit Mini Flakes 250 ml / 110 g","Küçük balıklar ve yavrular için mini pul yem · ürün kodu 77114 · EAN 5900469771143 · gün içinde birkaç küçük porsiyon, birkaç dakikada tüketilecek miktarda"],
  ],"2026-10-09"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/supervit-granulat",[
    ["Supervit Granulat 10 g Sachet","Yaklaşık 1,5 mm batan çok bileşenli granül · ürün kodu 61401 · EAN 5900469614013 · günde birkaç kez, 2–3 dakikada tüketilecek miktarda"],
    ["Supervit Granulat 100 ml / 55 g","Yaklaşık 1,5 mm batan çok bileşenli granül · ürün kodu 60413 · EAN 5900469604137 · günde birkaç kez, 2–3 dakikada tüketilecek miktarda"],
    ["Supervit Granulat 250 ml / 138 g","Yaklaşık 1,5 mm batan çok bileşenli granül · ürün kodu 60414 · EAN 5900469604144 · günde birkaç kez, 2–3 dakikada tüketilecek miktarda"],
    ["Supervit Granulat 1000 ml / 550 g","Yaklaşık 1,5 mm batan çok bileşenli granül · ürün kodu 60416 · EAN 5900469604168 · günde birkaç kez, 2–3 dakikada tüketilecek miktarda"],
    ["Supervit Granulat 5 L / 2.75 kg","Yaklaşık 1,5 mm batan çok bileşenli granül · ürün kodu 60418 · EAN 5900469604182 · günde birkaç kez, 2–3 dakikada tüketilecek miktarda"],
    ["Supervit Granulat 10 L / 5.5 kg","Yaklaşık 1,5 mm batan çok bileşenli granül · ürün kodu 60419 · EAN 5900469604199 · günde birkaç kez, 2–3 dakikada tüketilecek miktarda"],
  ],"2026-10-09"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/supervit-tablets-a",[
    ["Supervit Tablets A 50 ml / 36 g / ~80 pcs","Cama yapışan yaklaşık 12 mm çok bileşenli tablet · ürün kodu 20622 · EAN 5900469206225 · günde 2–5 kez, canlı yüküne uygun miktarda"],
    ["Supervit Tablets A 250 ml / 150 g / ~340 pcs","Cama yapışan yaklaşık 12 mm çok bileşenli tablet · ürün kodu 20624 · EAN 5900469206249 · günde 2–5 kez, canlı yüküne uygun miktarda"],
    ["Supervit Tablets A 2 L / 2 kg / ~4500 pcs","Cama yapışan yaklaşık 12 mm çok bileşenli tablet · ürün kodu 20627 · EAN 5900469206270 · günde 2–5 kez, canlı yüküne uygun miktarda"],
  ],"2026-10-09"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/supervit-tablets-b",[
    ["Supervit Tablets B 50 ml / 36 g / ~200 pcs","Dipten beslenen canlılar için yaklaşık 8 mm batan tablet · ürün kodu 20632 · EAN 5900469206324 · günde 2–5 kez, beslenme bölgesine canlı yüküne uygun miktarda"],
    ["Supervit Tablets B 250 ml / 150 g / ~830 pcs","Dipten beslenen canlılar için yaklaşık 8 mm batan tablet · ürün kodu 20634 · EAN 5900469206348 · günde 2–5 kez, beslenme bölgesine canlı yüküne uygun miktarda"],
    ["Supervit Tablets B 2 L / 2 kg / ~10000 pcs","Dipten beslenen canlılar için yaklaşık 8 mm batan tablet · ürün kodu 20637 · EAN 5900469206379 · günde 2–5 kez, beslenme bölgesine canlı yüküne uygun miktarda"],
  ],"2026-10-09"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/supervit-mini-granulat",[
    ["Supervit Mini Granulat 10 g Sachet","Küçük balıklar, yavrular, salyangoz ve kabuklular için yaklaşık 1 × 0,6 mm yavaş batan mini granül · ürün kodu 61421 · EAN 5900469614211 · birkaç dakikada tüketilecek küçük porsiyonlar"],
    ["Supervit Mini Granulat 100 ml / 65 g","Küçük balıklar, yavrular, salyangoz ve kabuklular için yaklaşık 1 × 0,6 mm yavaş batan mini granül · ürün kodu 60423 · EAN 5900469604236 · birkaç dakikada tüketilecek küçük porsiyonlar"],
    ["Supervit Mini Granulat 250 ml / 162.5 g","Küçük balıklar, yavrular, salyangoz ve kabuklular için yaklaşık 1 × 0,6 mm yavaş batan mini granül · ürün kodu 60424 · EAN 5900469604243 · birkaç dakikada tüketilecek küçük porsiyonlar"],
    ["Supervit Mini Granulat 3 L / 1.95 kg","Küçük balıklar, yavrular, salyangoz ve kabuklular için yaklaşık 1 × 0,6 mm yavaş batan mini granül · ürün kodu 60427 · EAN 5900469604274 · birkaç dakikada tüketilecek küçük porsiyonlar"],
  ],"2026-10-09"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/supervit-chips",[
    ["Supervit Chips 100 ml / 52 g","Orta ve büyük balıklar için yaklaşık 5 mm batan çok bileşenli cips · ürün kodu 60813 · EAN 5900469608135 · birkaç dakikada tüketilecek küçük porsiyonlar"],
    ["Supervit Chips 250 ml / 130 g","Orta ve büyük balıklar için yaklaşık 5 mm batan çok bileşenli cips · ürün kodu 60814 · EAN 5900469608142 · birkaç dakikada tüketilecek küçük porsiyonlar"],
    ["Supervit Chips 1000 ml / 520 g","Orta ve büyük balıklar için yaklaşık 5 mm batan çok bileşenli cips · ürün kodu 60816 · EAN 5900469608166 · birkaç dakikada tüketilecek küçük porsiyonlar"],
    ["Supervit Chips 5 L / 2.6 kg","Orta ve büyük balıklar için yaklaşık 5 mm batan çok bileşenli cips · ürün kodu 60818 · EAN 5900469608180 · birkaç dakikada tüketilecek küçük porsiyonlar"],
  ],"2026-10-09"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/3-algae-flakes",[
    ["3-Algae Flakes 12 g Sachet","Tatlı su ve deniz akvaryumlarındaki otçul ve hepçil balıklar için %12 alg içeren pul yem · ürün kodu 77161 · EAN 5900469771617 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar"],
    ["3-Algae Flakes 100 ml / 20 g","Tatlı su ve deniz akvaryumlarındaki otçul ve hepçil balıklar için %12 alg içeren pul yem · ürün kodu 77163 · EAN 5900469771631 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar"],
    ["3-Algae Flakes 250 ml / 50 g","Tatlı su ve deniz akvaryumlarındaki otçul ve hepçil balıklar için %12 alg içeren pul yem · ürün kodu 77164 · EAN 5900469771648 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar"],
    ["3-Algae Flakes 1000 ml / 200 g","Tatlı su ve deniz akvaryumlarındaki otçul ve hepçil balıklar için %12 alg içeren pul yem · ürün kodu 77166 · EAN 5900469771662 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar"],
    ["3-Algae Flakes 5 L / 1 kg","Tatlı su ve deniz akvaryumlarındaki otçul ve hepçil balıklar için %12 alg içeren pul yem · ürün kodu 77167 · EAN 5900469771679 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar"],
    ["3-Algae Flakes 11 L / 2 kg","Tatlı su ve deniz akvaryumlarındaki otçul ve hepçil balıklar için %12 alg içeren pul yem · ürün kodu 77168 · EAN 5900469771686 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar"],
    ["3-Algae Flakes 21 L / 4 kg","Tatlı su ve deniz akvaryumlarındaki otçul ve hepçil balıklar için %12 alg içeren pul yem · ürün kodu 77169 · EAN 5900469771693 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar"],
  ],"2026-10-11"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/3-algae-granulat",[
    ["3-Algae Granulat 100 ml / 44 g","Tatlı su ve deniz akvaryumlarındaki otçul ve hepçil balıklar için %12 alg içeren granül yem · ürün kodu 60523 · EAN 5900469605233 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar"],
    ["3-Algae Granulat 250 ml / 110 g","Tatlı su ve deniz akvaryumlarındaki otçul ve hepçil balıklar için %12 alg içeren granül yem · ürün kodu 60524 · EAN 5900469605240 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar"],
    ["3-Algae Granulat 1000 ml / 440 g","Tatlı su ve deniz akvaryumlarındaki otçul ve hepçil balıklar için %12 alg içeren granül yem · ürün kodu 60526 · EAN 5900469605264 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar"],
    ["3-Algae Granulat 3 L / 2.2 kg","Tatlı su ve deniz akvaryumlarındaki otçul ve hepçil balıklar için %12 alg içeren granül yem · ürün kodu 60528 · EAN 5900469605288 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar"],
    ["3-Algae Granulat 10 L / 4.4 kg","Tatlı su ve deniz akvaryumlarındaki otçul ve hepçil balıklar için %12 alg içeren granül yem · ürün kodu 60529 · EAN 5900469605295 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar"],
  ],"2026-10-11"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/3-algae-tablets-a",[
    ["3-Algae Tablets A 50 ml / 36 g / ~80 pcs","Tatlı su ve deniz akvaryumlarındaki otçul ve hepçil balıklar için %12 alg içeren cama yapışan yaklaşık 12 mm tablet · ürün kodu 20732 · EAN 5900469207321 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar"],
    ["3-Algae Tablets A 250 ml / 150 g / ~340 pcs","Tatlı su ve deniz akvaryumlarındaki otçul ve hepçil balıklar için %12 alg içeren cama yapışan yaklaşık 12 mm tablet · ürün kodu 20734 · EAN 5900469207345 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar"],
    ["3-Algae Tablets A 2 L / 2 kg / ~4500 pcs","Tatlı su ve deniz akvaryumlarındaki otçul ve hepçil balıklar için %12 alg içeren cama yapışan yaklaşık 12 mm tablet · ürün kodu 20737 · EAN 5900469207376 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar"],
  ],"2026-10-11"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/33",[
    ["3-Algae Tablets B 50 ml / 36 g / ~200 pcs","Tatlı su ve deniz akvaryumlarındaki otçul ve hepçil dip balıkları için %12 alg içeren yaklaşık 8 mm batan tablet · ürün kodu 20742 · EAN 5900469207420 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar"],
    ["3-Algae Tablets B 250 ml / 150 g / ~830 pcs","Tatlı su ve deniz akvaryumlarındaki otçul ve hepçil dip balıkları için %12 alg içeren yaklaşık 8 mm batan tablet · ürün kodu 20744 · EAN 5900469207444 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar"],
    ["3-Algae Tablets B 2 L / 2 kg / ~10000 pcs","Tatlı su ve deniz akvaryumlarındaki otçul ve hepçil dip balıkları için %12 alg içeren yaklaşık 8 mm batan tablet · ürün kodu 20747 · EAN 5900469207475 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar"],
  ],"2026-10-11"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/spirulina-flakes",[
    ["Spirulina Flakes 100 ml / 20 g","Tatlı su ve deniz akvaryumlarındaki otçul ve hepçil balıklar için %44 proteinli, en az %6 Spirulina platensis ve %1 zeolit içeren pul yem · ürün kodu 77133 · EAN 5900469771334 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar"],
    ["Spirulina Flakes 250 ml / 50 g","Tatlı su ve deniz akvaryumlarındaki otçul ve hepçil balıklar için %44 proteinli, en az %6 Spirulina platensis ve %1 zeolit içeren pul yem · ürün kodu 77134 · EAN 5900469771341 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar"],
    ["Spirulina Flakes 1000 ml / 200 g","Tatlı su ve deniz akvaryumlarındaki otçul ve hepçil balıklar için %44 proteinli, en az %6 Spirulina platensis ve %1 zeolit içeren pul yem · ürün kodu 77136 · EAN 5900469771365 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar"],
    ["Spirulina Flakes 5 L / 1 kg","Tatlı su ve deniz akvaryumlarındaki otçul ve hepçil balıklar için %44 proteinli, en az %6 Spirulina platensis ve %1 zeolit içeren pul yem · ürün kodu 70327 · EAN 5900469703274 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar"],
    ["Spirulina Flakes 11 L / 2 kg","Tatlı su ve deniz akvaryumlarındaki otçul ve hepçil balıklar için %44 proteinli, en az %6 Spirulina platensis ve %1 zeolit içeren pul yem · ürün kodu 70328 · EAN 5900469703281 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar"],
    ["Spirulina Flakes 21 L / 4 kg","Tatlı su ve deniz akvaryumlarındaki otçul ve hepçil balıklar için %44 proteinli, en az %6 Spirulina platensis ve %1 zeolit içeren pul yem · ürün kodu 70329 · EAN 5900469703298 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar"],
  ],"2026-10-21"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/spirulina-granulat-1",[
    ["Spirulina Granulat 100 ml / 44 g","Tatlı su ve deniz akvaryumlarındaki otçul ve hepçil balıklar için %48 proteinli, %6 Spirulina platensis içeren yavaş batan granül yem · ürün kodu 60333 · EAN 5900469603338 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar"],
    ["Spirulina Granulat 250 ml / 110 g","Tatlı su ve deniz akvaryumlarındaki otçul ve hepçil balıklar için %48 proteinli, %6 Spirulina platensis içeren yavaş batan granül yem · ürün kodu 60334 · EAN 5900469603345 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar"],
    ["Spirulina Granulat 5 L / 2.2 kg","Tatlı su ve deniz akvaryumlarındaki otçul ve hepçil balıklar için %48 proteinli, %6 Spirulina platensis içeren yavaş batan granül yem · ürün kodu 60338 · EAN 5900469603383 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar"],
    ["Spirulina Granulat 10 L / 4.4 kg","Tatlı su ve deniz akvaryumlarındaki otçul ve hepçil balıklar için %48 proteinli, %6 Spirulina platensis içeren yavaş batan granül yem · ürün kodu 60339 · EAN 5900469603390 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar"],
  ],"2026-10-21"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/hi-algae-disc",[
    ["Hi-Algae Discs 100 ml / 60 g","Vatoz, diğer dip balıkları ve karidesler için 10 mm batan disk; %52,4 alg içerir · ürün kodu 61333 · EAN 5900469613337 · günde birkaç küçük porsiyon; gece beslenen balıklara ışıklar kapandıktan sonra"],
    ["Hi-Algae Discs 250 ml / 150 g","Vatoz, diğer dip balıkları ve karidesler için 10 mm batan disk; %52,4 alg içerir · ürün kodu 61334 · EAN 5900469613344 · günde birkaç küçük porsiyon; gece beslenen balıklara ışıklar kapandıktan sonra"],
    ["Hi-Algae Discs 3 L / 1.5 kg","Vatoz, diğer dip balıkları ve karidesler için 10 mm batan disk; %52,4 alg içerir · ürün kodu 61337 · EAN 5900469613375 · günde birkaç küçük porsiyon; gece beslenen balıklara ışıklar kapandıktan sonra"],
  ],"2026-10-11"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/hi-algae-discs-xxl",[
    ["Hi-Algae Discs XXL 250 ml / 125 g","Büyük otçul ve hepçil dip balıkları için batan disk; %52,4 alg içerir · ürün kodu 61354 · EAN 5900469613542 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar"],
    ["Hi-Algae Discs XXL 1000 ml / 500 g","Büyük otçul ve hepçil dip balıkları için batan disk; %52,4 alg içerir · ürün kodu 61356 · EAN 5900469613566 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar"],
    ["Hi-Algae Discs XXL 3 L / 1.5 kg","Büyük otçul ve hepçil dip balıkları için batan disk; %52,4 alg içerir · ürün kodu 61357 · EAN 5900469613573 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar"],
    ["Hi-Algae Discs XXL 5 L / 2.5 kg","Büyük otçul ve hepçil dip balıkları için batan disk; %52,4 alg içerir · ürün kodu 61358 · EAN 5900469613580 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar"],
  ],"2026-10-11"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/hi-protein-discs-xxl",[
    ["Hi-Protein Discs XXL 250 ml / 125 g","Büyük etçil ve hepçil dip balıkları için kabuklu ve yumuşakça içerikli batan disk · ürün kodu 61364 · EAN 5900469613641 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar"],
    ["Hi-Protein Discs XXL 1000 ml / 500 g","Büyük etçil ve hepçil dip balıkları için kabuklu ve yumuşakça içerikli batan disk · ürün kodu 61366 · EAN 5900469613665 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar"],
    ["Hi-Protein Discs XXL 3 L / 1.5 kg","Büyük etçil ve hepçil dip balıkları için kabuklu ve yumuşakça içerikli batan disk · ürün kodu 61367 · EAN 5900469613672 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar"],
    ["Hi-Protein Discs XXL 5 L / 2.5 kg","Büyük etçil ve hepçil dip balıkları için kabuklu ve yumuşakça içerikli batan disk · ürün kodu 61368 · EAN 5900469613689 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar"],
  ],"2026-10-11"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/vitality-color",[
    ["Vitality & Color Flakes 12 g Sachet","Hepçil ve etçil balıklar için yüksek proteinli renk ve kondisyon destekli pul yem · ürün kodu 70431 · EAN 5900469704318 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar; lif veya kitin yönünden zengin yemlerle çeşitlendirilmelidir"],
    ["Vitality & Color Flakes 100 ml / 20 g","Hepçil ve etçil balıklar için yüksek proteinli renk ve kondisyon destekli pul yem · ürün kodu 77143 · EAN 5900469771433 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar; lif veya kitin yönünden zengin yemlerle çeşitlendirilmelidir"],
    ["Vitality & Color Flakes 250 ml / 50 g","Hepçil ve etçil balıklar için yüksek proteinli renk ve kondisyon destekli pul yem · ürün kodu 77144 · EAN 5900469771440 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar; lif veya kitin yönünden zengin yemlerle çeşitlendirilmelidir"],
    ["Vitality & Color Flakes 500 ml / 100 g","Hepçil ve etçil balıklar için yüksek proteinli renk ve kondisyon destekli pul yem · ürün kodu 77145 · EAN 5900469771457 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar; lif veya kitin yönünden zengin yemlerle çeşitlendirilmelidir"],
    ["Vitality & Color Flakes 1000 ml / 200 g","Hepçil ve etçil balıklar için yüksek proteinli renk ve kondisyon destekli pul yem · ürün kodu 77146 · EAN 5900469771464 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar; lif veya kitin yönünden zengin yemlerle çeşitlendirilmelidir"],
    ["Vitality & Color Flakes 5 L / 1 kg","Hepçil ve etçil balıklar için yüksek proteinli renk ve kondisyon destekli pul yem · ürün kodu 70437 · EAN 5900469704370 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar; lif veya kitin yönünden zengin yemlerle çeşitlendirilmelidir"],
    ["Vitality & Color Flakes 11 L / 2 kg","Hepçil ve etçil balıklar için yüksek proteinli renk ve kondisyon destekli pul yem · ürün kodu 70438 · EAN 5900469704387 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar; lif veya kitin yönünden zengin yemlerle çeşitlendirilmelidir"],
    ["Vitality & Color Flakes 21 L / 4 kg","Hepçil ve etçil balıklar için yüksek proteinli renk ve kondisyon destekli pul yem · ürün kodu 70439 · EAN 5900469704394 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar; lif veya kitin yönünden zengin yemlerle çeşitlendirilmelidir"],
  ],"2026-10-11"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/vitality-color-granules",[
    ["Vitality & Color Granules 100 ml / 55 g","Hepçil ve etçil balıklar için yaklaşık 1 mm yavaş batan yüksek proteinli renk ve kondisyon destekli granül · ürün kodu 60243 · EAN 5900469602430 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlar"],
    ["Vitality & Color Granules 250 ml / 138 g","Hepçil ve etçil balıklar için yaklaşık 1 mm yavaş batan yüksek proteinli renk ve kondisyon destekli granül · ürün kodu 60244 · EAN 5900469602447 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlar"],
    ["Vitality & Color Granules 1000 ml / 550 g","Hepçil ve etçil balıklar için yaklaşık 1 mm yavaş batan yüksek proteinli renk ve kondisyon destekli granül · ürün kodu 60246 · EAN 5900469602461 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlar"],
    ["Vitality & Color Granules 5 L / 2.75 kg","Hepçil ve etçil balıklar için yaklaşık 1 mm yavaş batan yüksek proteinli renk ve kondisyon destekli granül · ürün kodu 60248 · EAN 5900469602485 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlar"],
    ["Vitality & Color Granules 10 L / 5.5 kg","Hepçil ve etçil balıklar için yaklaşık 1 mm yavaş batan yüksek proteinli renk ve kondisyon destekli granül · ürün kodu 60249 · EAN 5900469602492 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlar"],
  ],"2026-10-11"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/vitality-color-tablets",[
    ["Vitality & Color Tablets 50 ml / 36 g / ~80 pcs","Hepçil ve etçil balıklar ile büyüyen yavrular için yüksek proteinli renk ve kondisyon destekli tablet · ürün kodu 20722 · EAN 5900469207222 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar; lif veya kitin yönünden zengin yemlerle çeşitlendirilmelidir"],
    ["Vitality & Color Tablets 250 ml / 150 g / ~340 pcs","Hepçil ve etçil balıklar ile büyüyen yavrular için yüksek proteinli renk ve kondisyon destekli tablet · ürün kodu 20724 · EAN 5900469207246 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar; lif veya kitin yönünden zengin yemlerle çeşitlendirilmelidir"],
    ["Vitality & Color Tablets 2 L / 2 kg / ~4500 pcs","Hepçil ve etçil balıklar ile büyüyen yavrular için yüksek proteinli renk ve kondisyon destekli tablet · ürün kodu 20727 · EAN 5900469207277 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar; lif veya kitin yönünden zengin yemlerle çeşitlendirilmelidir"],
  ],"2026-10-11"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/super-spirulina-forte",[
    ["Super Spirulina Forte Flakes 12 g Sachet","Alg yiyen ve bitkisel içerik gereksinimi yüksek balıklar için %36 spirulinalı pul yem · ürün kodu 70311 · EAN 5900469703113 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlar"],
    ["Super Spirulina Forte Flakes 250 ml / 50 g","Alg yiyen ve bitkisel içerik gereksinimi yüksek balıklar için %36 spirulinalı pul yem · ürün kodu 77234 · EAN 5900469772348 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlar"],
    ["Super Spirulina Forte Flakes 1000 ml / 200 g","Alg yiyen ve bitkisel içerik gereksinimi yüksek balıklar için %36 spirulinalı pul yem · ürün kodu 77236 · EAN 5900469772362 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlar"],
    ["Super Spirulina Forte Flakes 5 L / 1 kg","Alg yiyen ve bitkisel içerik gereksinimi yüksek balıklar için %36 spirulinalı pul yem · ürün kodu 70317 · EAN 5900469703175 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlar"],
    ["Super Spirulina Forte Flakes 11 L / 2 kg","Alg yiyen ve bitkisel içerik gereksinimi yüksek balıklar için %36 spirulinalı pul yem · ürün kodu 70318 · EAN 5900469703182 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlar"],
    ["Super Spirulina Forte Flakes 21 L / 4 kg","Alg yiyen ve bitkisel içerik gereksinimi yüksek balıklar için %36 spirulinalı pul yem · ürün kodu 70319 · EAN 5900469703199 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlar"],
  ],"2026-10-12"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/super-spirulina-forte-granulat",[
    ["Super Spirulina Forte Granulat 100 ml / 60 g","Alg yiyen ve bitkisel içerik gereksinimi yüksek balıklar için %36 spirulinalı granül yem · ürün kodu 60533 · EAN 5900469605332 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlar"],
    ["Super Spirulina Forte Granulat 250 ml / 150 g","Alg yiyen ve bitkisel içerik gereksinimi yüksek balıklar için %36 spirulinalı granül yem · ürün kodu 60534 · EAN 5900469605349 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlar"],
    ["Super Spirulina Forte Granulat 1000 ml / 600 g","Alg yiyen ve bitkisel içerik gereksinimi yüksek balıklar için %36 spirulinalı granül yem · ürün kodu 60536 · EAN 5900469605363 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlar"],
    ["Super Spirulina Forte Granulat 5 L / 3 kg","Alg yiyen ve bitkisel içerik gereksinimi yüksek balıklar için %36 spirulinalı granül yem · ürün kodu 60538 · EAN 5900469605387 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlar"],
  ],"2026-10-12"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/super-spirulina-forte-mini-granulat",[
    ["Super Spirulina Forte Mini Granulat 100 ml / 56 g","Küçük alg yiyen balıklar ve genç Afrika cikletleri için %36 spirulinalı 0,9 mm mini granül · ürün kodu 60543 · EAN 5900469605431 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlar"],
    ["Super Spirulina Forte Mini Granulat 250 ml / 140 g","Küçük alg yiyen balıklar ve genç Afrika cikletleri için %36 spirulinalı 0,9 mm mini granül · ürün kodu 60544 · EAN 5900469605448 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlar"],
    ["Super Spirulina Forte Mini Granulat 3 L / 1.68 kg","Küçük alg yiyen balıklar ve genç Afrika cikletleri için %36 spirulinalı 0,9 mm mini granül · ürün kodu 60547 · EAN 5900469605479 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlar"],
  ],"2026-10-12"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/super-spirulina-forte-tablets",[
    ["Super Spirulina Forte Tablets 50 ml / 36 g / ~80 pcs","Otçul dip balıkları, genç Afrika cikletleri ve kabuklular için %36 spirulinalı yaklaşık 12 × 3,5 mm cama yapışan tablet · ürün kodu 20752 · EAN 5900469207529 · canlı sayısına uygun miktarda, günde birkaç kez"],
    ["Super Spirulina Forte Tablets 250 ml / 150 g / ~340 pcs","Otçul dip balıkları, genç Afrika cikletleri ve kabuklular için %36 spirulinalı yaklaşık 12 × 3,5 mm cama yapışan tablet · ürün kodu 20754 · EAN 5900469207543 · canlı sayısına uygun miktarda, günde birkaç kez"],
    ["Super Spirulina Forte Tablets 2 kg","Otçul dip balıkları, genç Afrika cikletleri ve kabuklular için %36 spirulinalı yaklaşık 12 × 3,5 mm cama yapışan tablet · ürün kodu 20757 · EAN 5900469207574 · üretici hacim veya tablet adedi yayımlamamıştır · canlı sayısına uygun miktarda, günde birkaç kez"],
  ],"2026-10-12"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/super-spirulina-forte-chips",[
    ["Super Spirulina Forte Chips 100 ml / 52 g","Büyük alg yiyen balıklar için %36 spirulinalı 5,8 × 1,2 mm batan cips · ürün kodu 60573 · EAN 5900469605738 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlar"],
    ["Super Spirulina Forte Chips 250 ml / 130 g","Büyük alg yiyen balıklar için %36 spirulinalı 5,8 × 1,2 mm batan cips · ürün kodu 60574 · EAN 5900469605745 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlar"],
    ["Super Spirulina Forte Chips 1000 ml / 520 g","Büyük alg yiyen balıklar için %36 spirulinalı 5,8 × 1,2 mm batan cips · ürün kodu 60576 · EAN 5900469605769 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlar"],
    ["Super Spirulina Forte Chips 5 L / 2.6 kg","Büyük alg yiyen balıklar için %36 spirulinalı 5,8 × 1,2 mm batan cips · ürün kodu 60578 · EAN 5900469605783 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlar"],
  ],"2026-10-12"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/d-allio-plus",[
    ["D-Allio Plus Flakes 100 ml / 20 g","Çoğu tatlı su ve deniz balığı için en az %30 sarımsak içeren pul yem · ürün kodu 77323 · üretici sayfasındaki EAN 590046977323 eksik basamaklı göründüğü için düzeltilmedi · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar"],
    ["D-Allio Plus Flakes 500 ml / 100 g","Çoğu tatlı su ve deniz balığı için en az %30 sarımsak içeren pul yem · ürün kodu 77325 · EAN 5900469773253 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar"],
    ["D-Allio Plus Flakes 1000 ml / 200 g","Çoğu tatlı su ve deniz balığı için en az %30 sarımsak içeren pul yem · ürün kodu 77326 · EAN 5900469773260 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar"],
    ["D-Allio Plus Flakes 5 L / 1 kg","Çoğu tatlı su ve deniz balığı için en az %30 sarımsak içeren pul yem · ürün kodu 72347 · EAN 5900469723470 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar"],
    ["D-Allio Plus Flakes 11 L / 2 kg","Çoğu tatlı su ve deniz balığı için en az %30 sarımsak içeren pul yem · ürün kodu 72348 · EAN 5900469723487 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar"],
  ],"2026-10-12"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/d-allio-plus-granulat",[
    ["D-Allio Plus Granulat 100 ml / 60 g","Hassas ve kondisyon desteği gereken balıklar için en az %30 sarımsak içeren granül yem · ürün kodu 60623 · EAN 5900469606230 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar"],
    ["D-Allio Plus Granulat 250 ml / 150 g","Hassas ve kondisyon desteği gereken balıklar için en az %30 sarımsak içeren granül yem · ürün kodu 60624 · EAN 5900469606247 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar"],
    ["D-Allio Plus Granulat 1000 ml / 600 g","Hassas ve kondisyon desteği gereken balıklar için en az %30 sarımsak içeren granül yem · ürün kodu 60626 · EAN 5900469606261 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar"],
    ["D-Allio Plus Granulat 5 L / 3 kg","Hassas ve kondisyon desteği gereken balıklar için en az %30 sarımsak içeren granül yem · ürün kodu 60628 · EAN 5900469606285 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar"],
    ["D-Allio Plus Granulat 10 L / 6 kg","Hassas ve kondisyon desteği gereken balıklar için en az %30 sarımsak içeren granül yem · ürün kodu 60629 · EAN 5900469606292 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar"],
  ],"2026-10-12"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/cichlid-gran",[
    ["Cichlid Gran 100 ml / 55 g","Hepçil ve etçil cikletler için yüksek proteinli batan renk destekli granül · ürün kodu 60453 · EAN 5900469604533 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar; bitkisel ve diğer uygun yemlerle çeşitlendirilmelidir"],
    ["Cichlid Gran 250 ml / 138 g","Hepçil ve etçil cikletler için yüksek proteinli batan renk destekli granül · ürün kodu 60454 · EAN 5900469604540 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar; bitkisel ve diğer uygun yemlerle çeşitlendirilmelidir"],
    ["Cichlid Gran 1000 ml / 550 g","Hepçil ve etçil cikletler için yüksek proteinli batan renk destekli granül · ürün kodu 60456 · EAN 5900469604564 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar; bitkisel ve diğer uygun yemlerle çeşitlendirilmelidir"],
    ["Cichlid Gran 5 L / 2.75 kg","Hepçil ve etçil cikletler için yüksek proteinli batan renk destekli granül · ürün kodu 60458 · EAN 5900469604588 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar; bitkisel ve diğer uygun yemlerle çeşitlendirilmelidir"],
    ["Cichlid Gran 10 L / 5.5 kg","Hepçil ve etçil cikletler için yüksek proteinli batan renk destekli granül · ürün kodu 60459 · EAN 5900469604595 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar; bitkisel ve diğer uygun yemlerle çeşitlendirilmelidir"],
  ],"2026-10-12"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/malawi",[
    ["Malawi Flakes 12 g sachet","Mbuna ve diğer otçul Malawi cikletleri için bitkisel ağırlıklı pul yem · ürün kodu 73381 · EAN 5900469733813 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlar"],
    ["Malawi Flakes 250 ml / 50 g","Mbuna ve diğer otçul Malawi cikletleri için bitkisel ağırlıklı pul yem · ürün kodu 77224 · EAN 5900469772249 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlar"],
    ["Malawi Flakes 1000 ml / 200 g","Mbuna ve diğer otçul Malawi cikletleri için bitkisel ağırlıklı pul yem · ürün kodu 77226 · EAN 5900469772263 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlar"],
    ["Malawi Flakes 5 L / 1 kg","Mbuna ve diğer otçul Malawi cikletleri için bitkisel ağırlıklı pul yem · ürün kodu 73387 · EAN 5900469733875 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlar"],
    ["Malawi Flakes 11 L / 2 kg","Mbuna ve diğer otçul Malawi cikletleri için bitkisel ağırlıklı pul yem · ürün kodu 73388 · EAN 5900469733882 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlar"],
    ["Malawi Flakes 21 L / 4 kg","Mbuna ve diğer otçul Malawi cikletleri için bitkisel ağırlıklı pul yem · ürün kodu 73389 · EAN 5900469733899 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlar"],
  ],"2026-10-12"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/malawi-chips",[
    ["Malawi Chips 250 ml / 130 g","Mbuna ve diğer otçul Malawi cikletleri için batan cips yem · ürün kodu 60724 · EAN 5900469607244 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlar"],
    ["Malawi Chips 1000 ml / 520 g","Mbuna ve diğer otçul Malawi cikletleri için batan cips yem · ürün kodu 60726 · EAN 5900469607268 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlar"],
    ["Malawi Chips 5 L / 2.6 kg","Mbuna ve diğer otçul Malawi cikletleri için batan cips yem · ürün kodu 60728 · EAN 5900469607282 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlar"],
  ],"2026-10-12"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/tanganyika",[
    ["Tanganyika Flakes 100 ml / 20 g","Tanganika Gölü'nün etçil ve hepçil cikletleri için temel pul yem · ürün kodu 77213 · EAN 5900469772133 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlar"],
    ["Tanganyika Flakes 250 ml / 50 g","Tanganika Gölü'nün etçil ve hepçil cikletleri için temel pul yem · ürün kodu 77214 · EAN 5900469772140 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlar"],
    ["Tanganyika Flakes 1000 ml / 200 g","Tanganika Gölü'nün etçil ve hepçil cikletleri için temel pul yem · ürün kodu 77216 · EAN 5900469772164 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlar"],
    ["Tanganyika Flakes 5 L / 1 kg","Tanganika Gölü'nün etçil ve hepçil cikletleri için temel pul yem · ürün kodu 73587 · EAN 5900469735879 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlar"],
    ["Tanganyika Flakes 11 L / 2 kg","Tanganika Gölü'nün etçil ve hepçil cikletleri için temel pul yem · ürün kodu 73588 · EAN 5900469735886 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlar"],
    ["Tanganyika Flakes 21 L / 4 kg","Tanganika Gölü'nün etçil ve hepçil cikletleri için temel pul yem · ürün kodu 73589 · EAN 5900469735893 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlar"],
  ],"2026-10-12"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/tanganyika-chips",[
    ["Tanganyika Chips 250 ml / 130 g","Tanganika cikletleri için batan cips yem · ürün kodu 60834 · EAN 5900469608340 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlar"],
    ["Tanganyika Chips 1000 ml / 520 g","Tanganika cikletleri için batan cips yem · ürün kodu 60836 · EAN 5900469608364 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlar"],
    ["Tanganyika Chips 5 L / 2.6 kg","Tanganika cikletleri için batan cips yem · ürün kodu 60838 · EAN 5900469608388 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlar"],
  ],"2026-10-12"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/cichlid-spirulina-medium-sticks",[
    ["Cichlid Spirulina Medium Sticks 250 ml / 90 g","Orta ve büyük, bitkisel içeriğe ihtiyaç duyan cikletler için %3 spirulinalı yüzen çubuk yem · ürün kodu 63624 · EAN 5900469636244 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar"],
    ["Cichlid Spirulina Medium Sticks 1000 ml / 360 g","Orta ve büyük, bitkisel içeriğe ihtiyaç duyan cikletler için %3 spirulinalı yüzen çubuk yem · ürün kodu 63626 · EAN 5900469636268 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar"],
    ["Cichlid Spirulina Medium Sticks 5 L / 1.8 kg","Orta ve büyük, bitkisel içeriğe ihtiyaç duyan cikletler için %3 spirulinalı yüzen çubuk yem · ürün kodu 63628 · EAN 5900469636282 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar"],
    ["Cichlid Spirulina Medium Sticks 10 L / 3.6 kg","Orta ve büyük, bitkisel içeriğe ihtiyaç duyan cikletler için %3 spirulinalı yüzen çubuk yem · ürün kodu 63629 · EAN 5900469636299 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar"],
  ],"2026-10-12"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/cichlid-color",[
    ["Cichlid Color XXL 100 ml / 20 g","Hepçil ve etçil cikletler için yüksek proteinli, karotenoidlerle renk destekli temel yem · ürün kodu 77153 · EAN 5900469771532 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar"],
    ["Cichlid Color XXL 250 ml / 50 g","Hepçil ve etçil cikletler için yüksek proteinli, karotenoidlerle renk destekli temel yem · ürün kodu 77154 · EAN 5900469771549 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar"],
    ["Cichlid Color XXL 1000 ml / 160 g","Hepçil ve etçil cikletler için yüksek proteinli, karotenoidlerle renk destekli temel yem · ürün kodu 77156 · EAN 5900469771563 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar"],
    ["Cichlid Color XXL 5 L / 1 kg","Hepçil ve etçil cikletler için yüksek proteinli, karotenoidlerle renk destekli temel yem · ürün kodu 71387 · EAN 5900469713877 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar"],
    ["Cichlid Color XXL 11 L / 2 kg","Hepçil ve etçil cikletler için yüksek proteinli, karotenoidlerle renk destekli temel yem · ürün kodu 71388 · EAN 5900469713884 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar"],
    ["Cichlid Color XXL 21 L / 4 kg","Hepçil ve etçil cikletler için yüksek proteinli, karotenoidlerle renk destekli temel yem · ürün kodu 71389 · EAN 5900469713891 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar"],
  ],"2026-10-12"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/mini-wafers-mix",[
    ["Mini Wafers Mix 18 g doypack","Hepçil dip balıkları ile tatlı ve deniz suyu kabukluları için kırmızı-yeşil batan wafer karışımı · ürün kodu 66532 · EAN 5900469665329 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar"],
    ["Mini Wafers Mix 90 g doypack","Hepçil dip balıkları ile tatlı ve deniz suyu kabukluları için kırmızı-yeşil batan wafer karışımı · ürün kodu 66533 · EAN 5900469665336 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar"],
    ["Mini Wafers Mix 100 ml / 55 g","Hepçil dip balıkları ile tatlı ve deniz suyu kabukluları için kırmızı-yeşil batan wafer karışımı · ürün kodu 66163 · EAN 5900469661635 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar"],
    ["Mini Wafers Mix 250 ml / 138 g","Hepçil dip balıkları ile tatlı ve deniz suyu kabukluları için kırmızı-yeşil batan wafer karışımı · ürün kodu 66164 · EAN 5900469661642 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar"],
    ["Mini Wafers Mix 3 L / 1.65 kg","Hepçil dip balıkları ile tatlı ve deniz suyu kabukluları için kırmızı-yeşil batan wafer karışımı · ürün kodu 66167 · EAN 5900469661673 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar"],
  ],"2026-10-12"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/green-algae-wafers",[
    ["Green Algae Wafers 100 ml / 45 g","Bitkisel ve alg ağırlıklı beslenen Loricariidae türleri ile dip balıkları ve kabuklular için %3 spirulinalı batan wafer · ürün kodu 66423 · EAN 5900469664230 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar"],
    ["Green Algae Wafers 250 ml / 113 g","Bitkisel ve alg ağırlıklı beslenen Loricariidae türleri ile dip balıkları ve kabuklular için %3 spirulinalı batan wafer · ürün kodu 66424 · EAN 5900469664247 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar"],
    ["Green Algae Wafers 1000 ml / 450 g","Bitkisel ve alg ağırlıklı beslenen Loricariidae türleri ile dip balıkları ve kabuklular için %3 spirulinalı batan wafer · ürün kodu 66426 · EAN 5900469664261 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar"],
    ["Green Algae Wafers 5 L / 2.25 kg","Bitkisel ve alg ağırlıklı beslenen Loricariidae türleri ile dip balıkları ve kabuklular için %3 spirulinalı batan wafer · ürün kodu 66428 · EAN 5900469664285 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar"],
  ],"2026-10-12"),
  ...products("Tropical","food","https://us.tropical.pl/tropical/product/plecos-tablets",[
    ["Pleco's Tablets 50 ml / 30 g / ~11 pcs","Büyük Loricariidae türleri ve daha küçük alg yiyen vatoz grupları için %36 spirulinalı, %1 meşe odunlu 25 mm batan tablet · ürün kodu 20772 · EAN 5900469207727 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar"],
    ["Pleco's Tablets 250 ml / 135 g / ~48 pcs","Büyük Loricariidae türleri ve daha küçük alg yiyen vatoz grupları için %36 spirulinalı, %1 meşe odunlu 25 mm batan tablet · ürün kodu 20774 · EAN 5900469207741 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar"],
    ["Pleco's Tablets 5 L / 3 kg","Büyük Loricariidae türleri ve daha küçük alg yiyen vatoz grupları için %36 spirulinalı, %1 meşe odunlu 25 mm batan tablet · ürün kodu 20337 · EAN 5900469203378 · üretici yaklaşık tablet adedi yayımlamamıştır · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar"],
  ],"2026-10-12"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/welsi-gran",[
    ["Welsi Gran 100 ml / 65 g","Hepçil ve etçil dip balıkları için hızlı batan granül · ürün kodu 60463 · EAN 5900469604632 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar"],
    ["Welsi Gran 250 ml / 162.5 g","Hepçil ve etçil dip balıkları için hızlı batan granül · ürün kodu 60464 · EAN 5900469604649 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar"],
    ["Welsi Gran 1000 ml / 650 g","Hepçil ve etçil dip balıkları için hızlı batan granül · ürün kodu 60466 · EAN 5900469604663 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar"],
    ["Welsi Gran 5 L / 3.25 kg","Hepçil ve etçil dip balıkları için hızlı batan granül · ürün kodu 60468 · EAN 5900469604687 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar"],
    ["Welsi Gran 10 L / 6.5 kg","Hepçil ve etçil dip balıkları için hızlı batan granül · ürün kodu 60469 · EAN 5900469604694 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar"],
  ],"2026-10-12"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/Carnivore",[
    ["Carnivore 500 ml / 300 g","Orta ve büyük etçil dip balıkları için %48 proteinli batan granül · ürün kodu 60735 · EAN 5900469607350 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar"],
    ["Carnivore 1000 ml / 600 g","Orta ve büyük etçil dip balıkları için %48 proteinli batan granül · ürün kodu 60736 · EAN 5900469607367 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar"],
    ["Carnivore 3 L / 1.8 kg","Orta ve büyük etçil dip balıkları için %48 proteinli batan granül · ürün kodu 60737 · EAN 5900469607374 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar"],
    ["Carnivore 5 L / 3 kg","Orta ve büyük etçil dip balıkları için %48 proteinli batan granül · ürün kodu 60738 · EAN 5900469607381 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar"],
  ],"2026-10-12"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/shrimp-sticks",[
    ["Shrimp Sticks 100 ml / 55 g","Tatlı ve deniz suyu kabukluları için spirulina, beta-glukan, ketapang ve karotenoid içeren batan çubuk yem · ürün kodu 63363 · EAN 5900469633632 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar"],
    ["Shrimp Sticks 250 ml / 138 g","Tatlı ve deniz suyu kabukluları için spirulina, beta-glukan, ketapang ve karotenoid içeren batan çubuk yem · ürün kodu 63364 · EAN 5900469633649 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar"],
    ["Shrimp Sticks 3 L / 1.65 kg","Tatlı ve deniz suyu kabukluları için spirulina, beta-glukan, ketapang ve karotenoid içeren batan çubuk yem · ürün kodu 63367 · EAN 5900469633670 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar"],
  ],"2026-10-12"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/crusta-sticks",[
    ["Crusta Sticks 100 ml / 70 g","Tatlı ve deniz suyu kabukluları için yüksek kalsiyumlu, %6 spirulinalı hızlı batan çubuk yem · ürün kodu 63343 · EAN 5900469633434 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar"],
    ["Crusta Sticks 250 ml / 175 g","Tatlı ve deniz suyu kabukluları için yüksek kalsiyumlu, %6 spirulinalı hızlı batan çubuk yem · ürün kodu 63344 · EAN 5900469633441 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar"],
  ],"2026-10-12"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/caridina-nano-sticks",[
    ["Caridina Nano Sticks 10 g sachet","Özellikle genç cüce karidesler ve diğer sucul kabuklular için yüksek kalsiyumlu, %6 spirulinalı batan mikro çubuk yem · ürün kodu 63351 · EAN 5900469633519 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlar"],
  ],"2026-10-12"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/mikrovit-basic",[
    ["Mikro-Vit Basic 50 ml / 32 g","Yavrular için spirulina, krill ve kalamar içeren çok ince temel yem · ürün kodu 77602 · EAN 5900469776025 · küçük ve sık porsiyonlar verilmeli, 2–3 dakikada yenmeyen artıklar uzaklaştırılmalıdır"],
  ],"2026-10-12"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/mikrovit-hi-protein",[
    ["Mikro-Vit Hi-Protein 50 ml / 32 g","Yumurta sarısı ve %8 krill unuyla %49 protein sağlayan çok ince yavru yemi · ürün kodu 77622 · EAN 5900469776223 · yumurta kesesi çekildikten sonra küçük ve sık porsiyonlar verilmeli, artıklar uzaklaştırılmalıdır"],
  ],"2026-10-12"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/mikrovit-spirulina",[
    ["Mikro-Vit Spirulina 50 ml / 32 g","Çoğu süs balığı yavrusu için %6 spirulinalı çok ince yem · ürün kodu 77632 · EAN 5900469776322 · yumurta kesesi çekildikten sonra küçük ve sık porsiyonlar verilmeli, artıklar uzaklaştırılmalıdır"],
  ],"2026-10-12"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/mikrovit-vegetable",[
    ["Mikro-Vit Vegetable 50 ml / 32 g","Bitkisel içeriğe ihtiyaç duyan yavrular için ısırgan, ıspanak ve %1 spirulinalı çok ince yem · ürün kodu 77612 · EAN 5900469776124 · yumurta kesesi çekildikten sonra küçük ve sık porsiyonlar verilmeli, artıklar uzaklaştırılmalıdır"],
  ],"2026-10-12"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/38",[
    ["Nanovit Granulat 10 g sachet","Küçük akvaryum balıkları ve gelişen yavrular için beta-glukanlı küçük batan granül · ürün kodu 67101 · EAN 5900469671016 · günde birkaç kez, küçük porsiyonlar halinde verilmelidir"],
    ["Nanovit Granulat 100 ml / 70 g","Küçük akvaryum balıkları ve gelişen yavrular için beta-glukanlı küçük batan granül · ürün kodu 67103 · EAN 5900469671030 · günde birkaç kez, küçük porsiyonlar halinde verilmelidir"],
    ["Nanovit Granulat 3 L / 2.1 kg","Küçük akvaryum balıkları ve gelişen yavrular için beta-glukanlı küçük batan granül · ürün kodu 67107 · EAN 5900469671078 · günde birkaç kez, küçük porsiyonlar halinde verilmelidir"],
  ],"2026-10-12"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/gel-formula-herbivorous-fish",[
    ["Gel Formula For Herbivorous Fish 35 g sachet","Otçul ve hepçil balıklar için %36 alg içeren, suyla hazırlanarak yüzen veya batan jel haline getirilen toz yem · ürün kodu 61721 · EAN 5900469617212 · toz hali balığa doğrudan verilmemeli; bir saşe yaklaşık 100 g jel hazırlar"],
    ["Gel Formula For Herbivorous Fish 1000 ml / 3 × 35 g","Otçul ve hepçil balıklar için %36 alg içeren, suyla hazırlanarak yüzen veya batan jel haline getirilen üç saşelik set · ürün kodu 61726 · EAN 5900469617267 · toz hali balığa doğrudan verilmemeli; her saşe yaklaşık 100 g jel hazırlar"],
  ],"2026-10-12"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/gel-formula-carnivorous-",[
    ["Gel Formula For Carnivorous Fish 35 g sachet","Etçil ve hepçil balıklar için %24,2 kabuklu, yumuşakça ve böcek içeren, suyla hazırlanarak yüzen veya batan jel haline getirilen toz yem · ürün kodu 61711 · EAN 5900469617113 · toz hali balığa doğrudan verilmemeli; bir saşe yaklaşık 100 g jel hazırlar"],
    ["Gel Formula For Carnivorous Fish 1000 ml / 3 × 35 g","Etçil ve hepçil balıklar için %24,2 kabuklu, yumuşakça ve böcek içeren, suyla hazırlanarak yüzen veya batan jel haline getirilen üç saşelik set · ürün kodu 61716 · EAN 5900469617168 · toz hali balığa doğrudan verilmemeli; her saşe yaklaşık 100 g jel hazırlar"],
  ],"2026-10-12"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/shrimp-up-breeding-colour-",[
    ["Shrimp-UP! Breeding & Colour 10 g sachet","Tatlı su karidesleri için renk, büyüme, üreme ve linlemeyi destekleyen 5 × 5 × 2 mm batan blok tam yem · ürün kodu 63811 · EAN 5900469638118 · günde bir kez, birkaç saatte tüketilecek miktarda; seri dönüşümlü kullanılırsa 2–3 günde bir"],
    ["Shrimp-UP! Breeding & Colour 100 ml / 45 g","Tatlı su karidesleri için renk, büyüme, üreme ve linlemeyi destekleyen 5 × 5 × 2 mm batan blok tam yem · ürün kodu 63813 · EAN 5900469638132 · günde bir kez, birkaç saatte tüketilecek miktarda; seri dönüşümlü kullanılırsa 2–3 günde bir"],
  ],"2026-10-12"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/shrimp-up-growth-immunity",[
    ["Shrimp-UP! Growth & Immunity 10 g sachet","Tatlı su karidesleri için büyüme, bağışıklık ve linlemeyi destekleyen 5 × 5 × 2 mm batan blok tam yem · ürün kodu 63821 · EAN 5900469638217 · günde bir kez, birkaç saatte tüketilecek miktarda; seri dönüşümlü kullanılırsa 2–3 günde bir"],
    ["Shrimp-UP! Growth & Immunity 100 ml / 45 g","Tatlı su karidesleri için büyüme, bağışıklık ve linlemeyi destekleyen 5 × 5 × 2 mm batan blok tam yem · ürün kodu 63823 · EAN 5900469638231 · günde bir kez, birkaç saatte tüketilecek miktarda; seri dönüşümlü kullanılırsa 2–3 günde bir"],
  ],"2026-10-12"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/shrimp-up-minerals-molting",[
    ["Shrimp-UP! Minerals & Molting 10 g sachet","Tatlı su karidesleri için kalsiyum ve mineral oranlarıyla linlemeyi ve yeni kabuk oluşumunu destekleyen 5 × 5 × 2 mm batan blok tam yem · ürün kodu 63831 · EAN 5900469638316 · günde bir kez, birkaç saatte tüketilecek miktarda; seri dönüşümlü kullanılırsa 2–3 günde bir"],
    ["Shrimp-UP! Minerals & Molting 100 ml / 45 g","Tatlı su karidesleri için kalsiyum ve mineral oranlarıyla linlemeyi ve yeni kabuk oluşumunu destekleyen 5 × 5 × 2 mm batan blok tam yem · ürün kodu 63833 · EAN 5900469638330 · günde bir kez, birkaç saatte tüketilecek miktarda; seri dönüşümlü kullanılırsa 2–3 günde bir"],
  ],"2026-10-12"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/shrimp-up-algae-phytobiotics",[
    ["Shrimp-UP! Algae & Phytobiotics 10 g sachet","Tatlı su karidesleri için %37 alg ile zerdeçal ve ashwagandha fitobiyotiklerini içeren 5 × 5 × 2 mm batan tamamlayıcı blok · ürün kodu 63841 · EAN 5900469638415 · tam yemlerle birlikte 2–3 günde bir, birkaç saatte tüketilecek miktarda"],
    ["Shrimp-UP! Algae & Phytobiotics 100 ml / 45 g","Tatlı su karidesleri için %37 alg ile zerdeçal ve ashwagandha fitobiyotiklerini içeren 5 × 5 × 2 mm batan tamamlayıcı blok · ürün kodu 63843 · EAN 5900469638439 · tam yemlerle birlikte 2–3 günde bir, birkaç saatte tüketilecek miktarda"],
  ],"2026-10-12"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/shrimp-up-herbs-vegetables-",[
    ["Shrimp-UP! Herbs & Vegetables 10 g sachet","Tatlı su karidesleri için ısırgan, karahindiba, moringa, ıspanak, bezelye ve pancar içeren 5 × 5 × 2 mm batan tamamlayıcı blok · ürün kodu 63851 · EAN 5900469638514 · tam yemlerle birlikte 2–3 günde bir, birkaç saatte tüketilecek miktarda"],
    ["Shrimp-UP! Herbs & Vegetables 100 ml / 45 g","Tatlı su karidesleri için ısırgan, karahindiba, moringa, ıspanak, bezelye ve pancar içeren 5 × 5 × 2 mm batan tamamlayıcı blok · ürün kodu 63853 · EAN 5900469638538 · tam yemlerle birlikte 2–3 günde bir, birkaç saatte tüketilecek miktarda"],
  ],"2026-10-12"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/shrimp-up-leaves-flowers",[
    ["Shrimp-UP! Leaves & Flowers 10 g sachet","Tatlı su karidesleri için dut, badem ve ceviz yaprakları ile kadife çiçeği ve papatya içeren 5 × 5 × 2 mm batan tamamlayıcı blok · ürün kodu 63861 · EAN 5900469638613 · tam yemlerle birlikte 2–3 günde bir, birkaç saatte tüketilecek miktarda"],
    ["Shrimp-UP! Leaves & Flowers 100 ml / 45 g","Tatlı su karidesleri için dut, badem ve ceviz yaprakları ile kadife çiçeği ve papatya içeren 5 × 5 × 2 mm batan tamamlayıcı blok · ürün kodu 63863 · EAN 5900469638637 · tam yemlerle birlikte 2–3 günde bir, birkaç saatte tüketilecek miktarda"],
  ],"2026-10-12"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/betta-granulat",[
    ["Betta Granulat 10 g sachet","Betta balıkları için kırmızı mikroalg içeren 0,9–1,4 mm yüzen granül tam yem · %50 ham protein · ürün kodu 61441 · EAN 5900469614419 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlarla"],
  ],"2026-10-12"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/guppy",[
    ["Guppy 100 ml / 20 g","Guppy ve diğer canlı doğuranlar için en az %2,25 spirulina ve 280 mg/kg deniz tuzu içeren çok bileşenli pul tam yem · ürün kodu 77053 · EAN 5900469770535 · 2–3 dakikada tüketilecek küçük porsiyonlarla"],
    ["Guppy 250 ml / 50 g","Guppy ve diğer canlı doğuranlar için en az %2,25 spirulina ve 280 mg/kg deniz tuzu içeren çok bileşenli pul tam yem · ürün kodu 77054 · EAN 5900469770542 · 2–3 dakikada tüketilecek küçük porsiyonlarla"],
  ],"2026-10-12"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/bio-vit",[
    ["Bio-Vit 12 g sachet","Otçul balıklar için tam, hepçil balıklar için tamamlayıcı; sindirimi destekleyen lifli bitkisel pul yem · ürün kodu 74411 · EAN 5900469744116 · 2–3 dakikada tüketilecek küçük porsiyonlarla"],
    ["Bio-Vit 100 ml / 20 g","Otçul balıklar için tam, hepçil balıklar için tamamlayıcı; sindirimi destekleyen lifli bitkisel pul yem · ürün kodu 77013 · EAN 5900469770139 · 2–3 dakikada tüketilecek küçük porsiyonlarla"],
    ["Bio-Vit 250 ml / 50 g","Otçul balıklar için tam, hepçil balıklar için tamamlayıcı; sindirimi destekleyen lifli bitkisel pul yem · ürün kodu 77014 · EAN 5900469770146 · 2–3 dakikada tüketilecek küçük porsiyonlarla"],
    ["Bio-Vit 500 ml / 100 g","Otçul balıklar için tam, hepçil balıklar için tamamlayıcı; sindirimi destekleyen lifli bitkisel pul yem · ürün kodu 77015 · EAN 5900469770153 · 2–3 dakikada tüketilecek küçük porsiyonlarla"],
    ["Bio-Vit 1000 ml / 200 g","Otçul balıklar için tam, hepçil balıklar için tamamlayıcı; sindirimi destekleyen lifli bitkisel pul yem · ürün kodu 77016 · EAN 5900469770160 · 2–3 dakikada tüketilecek küçük porsiyonlarla"],
    ["Bio-Vit 5 L / 1 kg","Otçul balıklar için tam, hepçil balıklar için tamamlayıcı; sindirimi destekleyen lifli bitkisel pul yem · ürün kodu 74417 · EAN 5900469744178 · 2–3 dakikada tüketilecek küçük porsiyonlarla"],
    ["Bio-Vit 11 L / 2 kg","Otçul balıklar için tam, hepçil balıklar için tamamlayıcı; sindirimi destekleyen lifli bitkisel pul yem · ürün kodu 74418 · EAN 5900469744185 · 2–3 dakikada tüketilecek küçük porsiyonlarla"],
    ["Bio-Vit 21 L / 4 kg","Otçul balıklar için tam, hepçil balıklar için tamamlayıcı; sindirimi destekleyen lifli bitkisel pul yem · ürün kodu 74419 · EAN 5900469744192 · 2–3 dakikada tüketilecek küçük porsiyonlarla"],
  ],"2026-10-12"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/ichtio-vit",[
    ["Ichtio-Vit 12 g sachet","Topluluk akvaryumlarındaki hepçil balıklar için %45 ham proteinli çok bileşenli pul tam yem · ürün kodu 74401 · EAN 5900469744017 · 2–3 dakikada tüketilecek küçük porsiyonlarla"],
    ["Ichtio-Vit 100 ml / 20 g","Topluluk akvaryumlarındaki hepçil balıklar için %45 ham proteinli çok bileşenli pul tam yem · ürün kodu 77003 · EAN 5900469770030 · 2–3 dakikada tüketilecek küçük porsiyonlarla"],
    ["Ichtio-Vit 250 ml / 50 g","Topluluk akvaryumlarındaki hepçil balıklar için %45 ham proteinli çok bileşenli pul tam yem · ürün kodu 77004 · EAN 5900469770047 · 2–3 dakikada tüketilecek küçük porsiyonlarla"],
    ["Ichtio-Vit 500 ml / 100 g","Topluluk akvaryumlarındaki hepçil balıklar için %45 ham proteinli çok bileşenli pul tam yem · ürün kodu 77005 · EAN 5900469770054 · 2–3 dakikada tüketilecek küçük porsiyonlarla"],
    ["Ichtio-Vit 1000 ml / 200 g","Topluluk akvaryumlarındaki hepçil balıklar için %45 ham proteinli çok bileşenli pul tam yem · ürün kodu 77006 · EAN 5900469770061 · 2–3 dakikada tüketilecek küçük porsiyonlarla"],
    ["Ichtio-Vit 1000 ml / 120 g bag","Topluluk akvaryumlarındaki hepçil balıklar için %45 ham proteinli çok bileşenli pul tam yem · ürün kodu 00407 · EAN 5900469004074 · 2–3 dakikada tüketilecek küçük porsiyonlarla"],
    ["Ichtio-Vit 5 L / 1 kg","Topluluk akvaryumlarındaki hepçil balıklar için %45 ham proteinli çok bileşenli pul tam yem · ürün kodu 74407 · EAN 5900469744079 · 2–3 dakikada tüketilecek küçük porsiyonlarla"],
    ["Ichtio-Vit 11 L / 2 kg","Topluluk akvaryumlarındaki hepçil balıklar için %45 ham proteinli çok bileşenli pul tam yem · ürün kodu 74408 · EAN 5900469744086 · 2–3 dakikada tüketilecek küçük porsiyonlarla"],
    ["Ichtio-Vit 21 L / 4 kg","Topluluk akvaryumlarındaki hepçil balıklar için %45 ham proteinli çok bileşenli pul tam yem · ürün kodu 74409 · EAN 5900469744093 · 2–3 dakikada tüketilecek küçük porsiyonlarla"],
  ],"2026-10-12"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/betta",[
    ["Betta 50 ml / 15 g","Betta ve küçük labirent balıkları için krill, kalamar ve %5 dondurularak kurutulmuş kan kurdu içeren %50 proteinli pul tam yem · ürün kodu 77062 · EAN 5900469770627 · 2–3 dakikada tüketilecek küçük porsiyonlarla"],
    ["Betta 100 ml / 25 g","Betta ve küçük labirent balıkları için krill, kalamar ve %5 dondurularak kurutulmuş kan kurdu içeren %50 proteinli pul tam yem · ürün kodu 77063 · EAN 5900469770634 · 2–3 dakikada tüketilecek küçük porsiyonlarla"],
  ],"2026-10-12"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/ovo-vit",[
    ["Ovo-Vit 12 g sachet","Yumurta ürünlerinden en az %6 içeren; büyüme, üreme dönemi ve iyileşme için yüksek enerjili %43 proteinli pul yem · ürün kodu 74431 · EAN 5900469744314 · 2–3 dakikada tüketilecek küçük porsiyonlarla"],
    ["Ovo-Vit 100 ml / 20 g","Yumurta ürünlerinden en az %6 içeren; büyüme, üreme dönemi ve iyileşme için yüksek enerjili %43 proteinli pul yem · ürün kodu 77033 · EAN 5900469770337 · 2–3 dakikada tüketilecek küçük porsiyonlarla"],
    ["Ovo-Vit 250 ml / 50 g","Yumurta ürünlerinden en az %6 içeren; büyüme, üreme dönemi ve iyileşme için yüksek enerjili %43 proteinli pul yem · ürün kodu 77034 · EAN 5900469770344 · 2–3 dakikada tüketilecek küçük porsiyonlarla"],
    ["Ovo-Vit 500 ml / 100 g","Yumurta ürünlerinden en az %6 içeren; büyüme, üreme dönemi ve iyileşme için yüksek enerjili %43 proteinli pul yem · ürün kodu 77035 · EAN 5900469770351 · 2–3 dakikada tüketilecek küçük porsiyonlarla"],
    ["Ovo-Vit 1000 ml / 200 g","Yumurta ürünlerinden en az %6 içeren; büyüme, üreme dönemi ve iyileşme için yüksek enerjili %43 proteinli pul yem · ürün kodu 77036 · EAN 5900469770368 · 2–3 dakikada tüketilecek küçük porsiyonlarla"],
    ["Ovo-Vit 5 L / 1 kg","Yumurta ürünlerinden en az %6 içeren; büyüme, üreme dönemi ve iyileşme için yüksek enerjili %43 proteinli pul yem · ürün kodu 74437 · EAN 5900469744376 · 2–3 dakikada tüketilecek küçük porsiyonlarla"],
    ["Ovo-Vit 11 L / 2 kg","Yumurta ürünlerinden en az %6 içeren; büyüme, üreme dönemi ve iyileşme için yüksek enerjili %43 proteinli pul yem · ürün kodu 74438 · EAN 5900469744383 · 2–3 dakikada tüketilecek küçük porsiyonlarla"],
    ["Ovo-Vit 21 L / 4 kg","Yumurta ürünlerinden en az %6 içeren; büyüme, üreme dönemi ve iyileşme için yüksek enerjili %43 proteinli pul yem · ürün kodu 74439 · EAN 5900469744390 · 2–3 dakikada tüketilecek küçük porsiyonlarla"],
  ],"2026-10-12"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/tropical",[
    ["Tropical Flakes 12 g sachet","Hepçil ve etçil balıklar ile damızlık ve genç balıklar için %46,5 proteinli yüksek proteinli pul yem · ürün kodu 74421 · EAN 5900469744215 · 2–3 dakikada tüketilecek küçük porsiyonlarla"],
    ["Tropical Flakes 100 ml / 20 g","Hepçil ve etçil balıklar ile damızlık ve genç balıklar için %46,5 proteinli yüksek proteinli pul yem · ürün kodu 77023 · EAN 5900469770238 · 2–3 dakikada tüketilecek küçük porsiyonlarla"],
    ["Tropical Flakes 250 ml / 50 g","Hepçil ve etçil balıklar ile damızlık ve genç balıklar için %46,5 proteinli yüksek proteinli pul yem · ürün kodu 77024 · EAN 5900469770245 · 2–3 dakikada tüketilecek küçük porsiyonlarla"],
    ["Tropical Flakes 500 ml / 100 g","Hepçil ve etçil balıklar ile damızlık ve genç balıklar için %46,5 proteinli yüksek proteinli pul yem · ürün kodu 77025 · EAN 5900469770252 · 2–3 dakikada tüketilecek küçük porsiyonlarla"],
    ["Tropical Flakes 1000 ml / 200 g","Hepçil ve etçil balıklar ile damızlık ve genç balıklar için %46,5 proteinli yüksek proteinli pul yem · ürün kodu 77026 · EAN 5900469770269 · 2–3 dakikada tüketilecek küçük porsiyonlarla"],
    ["Tropical Flakes 5 L / 1 kg","Hepçil ve etçil balıklar ile damızlık ve genç balıklar için %46,5 proteinli yüksek proteinli pul yem · ürün kodu 74427 · EAN 5900469744277 · 2–3 dakikada tüketilecek küçük porsiyonlarla"],
    ["Tropical Flakes 11 L / 2 kg","Hepçil ve etçil balıklar ile damızlık ve genç balıklar için %46,5 proteinli yüksek proteinli pul yem · ürün kodu 74428 · EAN 5900469744284 · 2–3 dakikada tüketilecek küçük porsiyonlarla"],
    ["Tropical Flakes 21 L / 4 kg","Hepçil ve etçil balıklar ile damızlık ve genç balıklar için %46,5 proteinli yüksek proteinli pul yem · ürün kodu 74429 · EAN 5900469744291 · 2–3 dakikada tüketilecek küçük porsiyonlarla"],
  ],"2026-10-12"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/tropical-granulat",[
    ["Tropical Granulat 20 g sachet","Hepçil ve etçil balıklar ile damızlık ve genç balıklar için %50 proteinli batan granül yem; dipteki Corydoras ve küçük yayın balıklarına da ulaşır · ürün kodu 61481 · EAN 5900469614815 · 2–3 dakikada tüketilecek küçük porsiyonlarla"],
    ["Tropical Granulat 100 ml / 50 g","Hepçil ve etçil balıklar ile damızlık ve genç balıklar için %50 proteinli batan granül yem; dipteki Corydoras ve küçük yayın balıklarına da ulaşır · ürün kodu 60403 · EAN 5900469604038 · 2–3 dakikada tüketilecek küçük porsiyonlarla"],
  ],"2026-10-12"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/hobby-mix",[
    ["Hobby Mix 12 g sachet","Kılıçkuyruk, guppy, moli, plati, barb, danio ve japon balığı gibi küçük/popüler türler için %49 proteinli çok bileşenli pul tam yem · ürün kodu 74471 · EAN 5900469744710 · 2–3 dakikada tüketilecek küçük porsiyonlarla"],
  ],"2026-10-12"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/kirysek",[
    ["Kirysek 100 ml / 68 g","Corydoras, loach, küçük yayın ve Loricariidae için %48 proteinli küçük batan granül tam yem · ürün kodu 60483 · EAN 5900469604830 · 2–3 dakikada tüketilecek küçük porsiyonlarla"],
  ],"2026-10-12"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/breeder-mix",[
    ["Breeder Mix 5 L / 1 kg","Profesyonel üretim, toptan satış, pet mağazası ve zoolojik tesislerde çoğu popüler süs balığı için çok bileşenli pul yem · ürün kodu 00396 · EAN 5900469003961 · 2–3 dakikada tüketilecek küçük porsiyonlarla"],
    ["Breeder Mix 11 L / 2 kg","Profesyonel üretim, toptan satış, pet mağazası ve zoolojik tesislerde çoğu popüler süs balığı için çok bileşenli pul yem · ürün kodu 00397 · EAN 5900469003978 · 2–3 dakikada tüketilecek küçük porsiyonlarla"],
    ["Breeder Mix 21 L / 4 kg","Profesyonel üretim, toptan satış, pet mağazası ve zoolojik tesislerde çoğu popüler süs balığı için çok bileşenli pul yem · ürün kodu 00398 · EAN 5900469003985 · 2–3 dakikada tüketilecek küçük porsiyonlarla"],
  ],"2026-10-12"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/vitabin-roslinny",[
    ["Vitabin Vegetable 50 ml / 36 g","Küçük otçul ve dip balıkları için tam, hepçiler ve büyüyen yavrular için tamamlayıcı; lifli cama yapışan yaklaşık 80 tablet · ürün kodu 20602 · EAN 5900469206027 · 2–3 dakikada tüketilecek küçük porsiyonlarla"],
  ],"2026-10-12"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/vitabin-wieloskladnikowy",[
    ["Vitabin Multi-Ingredient 50 ml / 36 g","Küçük hepçil ve dip balıkları ile büyüyen yavrular için %42 proteinli cama yapışan yaklaşık 80 tablet · ürün kodu 20612 · EAN 5900469206126 · 2–3 dakikada tüketilecek küçük porsiyonlarla"],
  ],"2026-10-12"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/nanovit-tablets",[
    ["Nanovit Tablets 10 g sachet / approx. 70 tablets","Nano akvaryumlardaki küçük hepçil/etçil balıklar, kabuklular ve salyangozlar için en az %14 spirulinalı, batan veya cama yapışan yaklaşık 70 küçük renk destek tableti · ürün kodu 20701 · EAN 5900469207017 · 2–3 dakikada tüketilecek küçük porsiyonlarla"],
  ],"2026-10-12"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/red-mico-colour-sticks",[
    ["Red Mico Colour Sticks 100 ml / 32 g","Hepçil ve etçil balıklar için kan kurdu biçimini taklit eden 6 × 0,8 mm yüzen, astaksantin ve kırmızı biberli %50 proteinli renk destek çubuğu · ürün kodu 63553 · EAN 5900469635537 · birkaç dakikada tüketilecek küçük porsiyonlarla"],
    ["Red Mico Colour Sticks 250 ml / 80 g","Hepçil ve etçil balıklar için kan kurdu biçimini taklit eden 6 × 0,8 mm yüzen, astaksantin ve kırmızı biberli %50 proteinli renk destek çubuğu · ürün kodu 63554 · EAN 5900469635544 · birkaç dakikada tüketilecek küçük porsiyonlarla"],
    ["Red Mico Colour Sticks 3 L / 1 kg","Hepçil ve etçil balıklar için kan kurdu biçimini taklit eden 6 × 0,8 mm yüzen, astaksantin ve kırmızı biberli %50 proteinli renk destek çubuğu · ürün kodu 63557 · EAN 5900469635575 · birkaç dakikada tüketilecek küçük porsiyonlarla"],
    ["Red Mico Colour Sticks 5 L / 1.7 kg","Hepçil ve etçil balıklar için kan kurdu biçimini taklit eden 6 × 0,8 mm yüzen, astaksantin ve kırmızı biberli %50 proteinli renk destek çubuğu · ürün kodu 63558 · EAN 5900469635582 · birkaç dakikada tüketilecek küçük porsiyonlarla"],
  ],"2026-10-12"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/red-mico-colour-sticks-xxs",[
    ["Red Mico Colour Sticks XXS 100 ml / 50 g","Küçük hepçil ve etçil balıklar için kan kurdu biçimini taklit eden 0,4 mm yavaş batan mikro çubuk; astaksantin ve kırmızı biberli %50 proteinli tam yem · ürün kodu 63573 · EAN 5900469635735 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlarla"],
    ["Red Mico Colour Sticks XXS 250 ml / 125 g","Küçük hepçil ve etçil balıklar için kan kurdu biçimini taklit eden 0,4 mm yavaş batan mikro çubuk; astaksantin ve kırmızı biberli %50 proteinli tam yem · ürün kodu 63574 · EAN 5900469635742 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlarla"],
    ["Red Mico Colour Sticks XXS 3 L / 1.5 kg","Küçük hepçil ve etçil balıklar için kan kurdu biçimini taklit eden 0,4 mm yavaş batan mikro çubuk; astaksantin ve kırmızı biberli %50 proteinli tam yem · ürün kodu 63577 · EAN 5900469635773 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlarla"],
  ],"2026-10-12"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/krill-flake",[
    ["Krill Flake 100 ml / 20 g","Tatlı su ve deniz akvaryumlarındaki hepçil/etçil balıklar için %40 Antarktika krili içeren %47 proteinli renk destek pul tam yem · ürün kodu 77243 · EAN 5900469772430 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlarla"],
    ["Krill Flake 500 ml / 100 g","Tatlı su ve deniz akvaryumlarındaki hepçil/etçil balıklar için %40 Antarktika krili içeren %47 proteinli renk destek pul tam yem · ürün kodu 77245 · EAN 5900469772454 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlarla"],
    ["Krill Flake 1000 ml / 200 g","Tatlı su ve deniz akvaryumlarındaki hepçil/etçil balıklar için %40 Antarktika krili içeren %47 proteinli renk destek pul tam yem · ürün kodu 77246 · EAN 5900469772461 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlarla"],
    ["Krill Flake 5 L / 1 kg","Tatlı su ve deniz akvaryumlarındaki hepçil/etçil balıklar için %40 Antarktika krili içeren %47 proteinli renk destek pul tam yem · ürün kodu 73487 · EAN 5900469734872 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlarla"],
    ["Krill Flake 11 L / 2 kg","Tatlı su ve deniz akvaryumlarındaki hepçil/etçil balıklar için %40 Antarktika krili içeren %47 proteinli renk destek pul tam yem · ürün kodu 73488 · EAN 5900469734889 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlarla"],
  ],"2026-10-12"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/krill-gran",[
    ["Krill Gran 100 ml / 54 g","Tatlı su ve deniz akvaryumlarındaki hepçil/etçil balıklar için %40 Antarktika krili içeren 1,5 mm batan, %50 proteinli renk destek granül tam yem · ürün kodu 60943 · EAN 5900469609439 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlarla"],
    ["Krill Gran 250 ml / 135 g","Tatlı su ve deniz akvaryumlarındaki hepçil/etçil balıklar için %40 Antarktika krili içeren 1,5 mm batan, %50 proteinli renk destek granül tam yem · ürün kodu 60944 · EAN 5900469609446 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlarla"],
    ["Krill Gran 1000 ml / 540 g","Tatlı su ve deniz akvaryumlarındaki hepçil/etçil balıklar için %40 Antarktika krili içeren 1,5 mm batan, %50 proteinli renk destek granül tam yem · ürün kodu 60946 · EAN 5900469609460 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlarla"],
    ["Krill Gran 5 L / 2.7 kg","Tatlı su ve deniz akvaryumlarındaki hepçil/etçil balıklar için %40 Antarktika krili içeren 1,5 mm batan, %50 proteinli renk destek granül tam yem · ürün kodu 60948 · EAN 5900469609484 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlarla"],
  ],"2026-10-12"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/krill-chips",[
    ["Krill Chips 250 ml / 125 g","Büyük hepçil ve etçil tatlı su/deniz balıkları için %40 Antarktika krili içeren 4,5 × 1 mm batan, %50 proteinli renk destek cips tam yem · ürün kodu 60844 · EAN 5900469608449 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlarla"],
    ["Krill Chips 1000 ml / 500 g","Büyük hepçil ve etçil tatlı su/deniz balıkları için %40 Antarktika krili içeren 4,5 × 1 mm batan, %50 proteinli renk destek cips tam yem · ürün kodu 60846 · EAN 5900469608463 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlarla"],
    ["Krill Chips 5 L / 2.5 kg","Büyük hepçil ve etçil tatlı su/deniz balıkları için %40 Antarktika krili içeren 4,5 × 1 mm batan, %50 proteinli renk destek cips tam yem · ürün kodu 60848 · EAN 5900469608487 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlarla"],
  ],"2026-10-12"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/krill-gran-xxl-1",[
    ["Krill Gran XXL 250 ml / 125 g","Büyük hepçil ve etçil tatlı su/deniz balıkları için %50 proteinli, %40 Antarktika krili içeren 7 × 4 mm batan büyük granül tam yem · ürün kodu 61344 · EAN 5900469613443 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlarla"],
    ["Krill Gran XXL 1000 ml / 500 g","Büyük hepçil ve etçil tatlı su/deniz balıkları için %50 proteinli, %40 Antarktika krili içeren 7 × 4 mm batan büyük granül tam yem · ürün kodu 61346 · EAN 5900469613467 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlarla"],
    ["Krill Gran XXL 3 L / 1.5 kg","Büyük hepçil ve etçil tatlı su/deniz balıkları için %50 proteinli, %40 Antarktika krili içeren 7 × 4 mm batan büyük granül tam yem · ürün kodu 61347 · EAN 5900469613474 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlarla"],
    ["Krill Gran XXL 5 L / 2.5 kg","Büyük hepçil ve etçil tatlı su/deniz balıkları için %50 proteinli, %40 Antarktika krili içeren 7 × 4 mm batan büyük granül tam yem · ürün kodu 61348 · EAN 5900469613481 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlarla"],
    ["Krill Gran XXL 10 L / 5 kg","Büyük hepçil ve etçil tatlı su/deniz balıkları için %50 proteinli, %40 Antarktika krili içeren 7 × 4 mm batan büyük granül tam yem · ürün kodu 61349 · EAN 5900469613498 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlarla"],
  ],"2026-10-21"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/weekend-food",[
    ["Weekend Food 20 g / 24 tablets","Süs balıkları ve kabuklular için %40 proteinli, yüksek su kararlılığına sahip yavaş yumuşayan batan tatil tableti · yalnızca stabil ve olgun akvaryumlarda, bakıcının yokluğunda 10 güne kadar kullanım · ürün kodu 20711 · EAN 5900469207116"],
  ],"2026-10-21"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/tubivit",[
    ["Tubivit 100 ml / 20 g","Hepçil ve etçil balıklar için %46 proteinli, Tubifex (%10) ve en az %1 dondurularak kurutulmuş kan kurdu larvası içeren pul tam yem · %1 zeolit · işlenmiş sucul omurgasız içeriği canlı/dondurulmuş yemlerde görülebilen patojen riskine karşı güvenli alternatif olarak sunulur · ürün kodu 77083 · EAN 5900469770832 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla"],
  ],"2026-10-22"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/red-mico-",[
    ["Red Mico 100 ml / 8 g","Hepçil ve etçil akvaryum balıkları için %46 proteinli, dondurularak kurutulmuş Chironomus kan kurdu larvası · kuru veya önceden ıslatılarak verilebilir · ürün kodu 01143 · EAN 5900469011430 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla"],
  ],"2026-10-22"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/calanus",[
    ["FD Calanus 100 ml / 12 g","Tatlı su ve deniz balıkları için %100 dondurularak kurutulmuş Calanus finmarchicus; %55 protein, %22 yağ ve en az 330 mg/kg astaksantin içeren doğal plankton yemi · ıslatıldığında LPS/SPS mercanlar ve anemonlar için de kullanılabilir · ürün kodu 01163 · EAN 5900469011638 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla"],
  ],"2026-10-22"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/tubi-cubi",[
    ["Tubi-Cubi 100 ml / 10 g","Hepçil ve etçil balıklar için %55 proteinli, dondurularak kurutulmuş Tubifex tubifex küpleri · kuru veya önceden ıslatılarak verilebilir · ürün kodu 01133 · EAN 5900469011331 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla"],
  ],"2026-10-22"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/fd-brine-shrimp",[
    ["FD Brine Shrimp 100 ml / 8 g","Hepçil ve etçil balıklar için %54 proteinli, dondurularak kurutulmuş Artemia salina küpleri · kuru veya önceden ıslatılarak verilebilir · ürün kodu 01153 · EAN 5900469011539 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla"],
  ],"2026-10-22"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/dafnia",[
    ["Dafnia 12 g sachet","Küçük balıklar ve büyüyen yavrular için %41 proteinli, güneşte kurutulmuş Daphnia pulex doğal ek yemi · sindirimi destekleyen kitin kaynağı · ürün kodu 01011 · EAN 5900469010112 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla"],
    ["Dafnia 100 ml / 18 g","Küçük balıklar ve büyüyen yavrular için %41 proteinli, güneşte kurutulmuş Daphnia pulex doğal ek yemi · sindirimi destekleyen kitin kaynağı · ürün kodu 01113 · EAN 5900469011133 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla"],
  ],"2026-10-22"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/dafnia-witaminizowana",[
    ["Dafnia Vitaminized 12 g sachet","Küçük balıklar ve büyüyen yavrular için %41 proteinli, vitaminlerle zenginleştirilmiş kurutulmuş Daphnia pulex · kg başına 40.000 IU A, 300 IU D3, 240 mg E ve 1.800 mg C vitamini · ürün kodu 01021 · EAN 5900469010211 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla"],
    ["Dafnia Vitaminized 100 ml / 16 g","Küçük balıklar ve büyüyen yavrular için %41 proteinli, vitaminlerle zenginleştirilmiş kurutulmuş Daphnia pulex · kg başına 40.000 IU A, 300 IU D3, 240 mg E ve 1.800 mg C vitamini · ürün kodu 01123 · EAN 5900469011232 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla"],
  ],"2026-10-22"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/gammarus-1",[
    ["Gammarus 12 g sachet","Büyük akvaryum ve havuz balıkları ile su/karasal kaplumbağalar için %44 proteinli, güneşte kurutulmuş Gammarus pulex doğal ek yemi · kitin ile doğal beta-karoten kaynağı · ürün kodu 00301 · EAN 5900469003015 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla"],
    ["Gammarus 100 ml / 12 g","Büyük akvaryum ve havuz balıkları ile su/karasal kaplumbağalar için %44 proteinli, güneşte kurutulmuş Gammarus pulex doğal ek yemi · kitin ile doğal beta-karoten kaynağı · ürün kodu 10323 · EAN 5900469103234 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla"],
    ["Gammarus 250 ml / 30 g","Büyük akvaryum ve havuz balıkları ile su/karasal kaplumbağalar için %44 proteinli, güneşte kurutulmuş Gammarus pulex doğal ek yemi · kitin ile doğal beta-karoten kaynağı · ürün kodu 10324 · EAN 5900469103241 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla"],
    ["Gammarus 500 ml / 60 g","Büyük akvaryum ve havuz balıkları ile su/karasal kaplumbağalar için %44 proteinli, güneşte kurutulmuş Gammarus pulex doğal ek yemi · kitin ile doğal beta-karoten kaynağı · ürün kodu 10325 · EAN 5900469103258 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla"],
    ["Gammarus 1000 ml / 120 g","Büyük akvaryum ve havuz balıkları ile su/karasal kaplumbağalar için %44 proteinli, güneşte kurutulmuş Gammarus pulex doğal ek yemi · kitin ile doğal beta-karoten kaynağı · ürün kodu 10326 · EAN 5900469103265 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla"],
  ],"2026-10-22"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/tropical-discus-flakes-wild",[
    ["Discus Flakes Wild 1000 ml / 200 g","Yabani discus ve yüksek beslenme gereksinimli balıklar için %48 proteinli pul tam yem · %10 kalamar unu, %4 krill unu, Spirulina/Chlorella/Ascophyllum/Laminaria algleri, 5.000 mg/kg Haematococcus pluvialis, %5 sarımsak ve 500 mg/kg kırmızı biber özütü · ürün kodu 77346 · EAN 5900469773468 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlarla"],
  ],"2026-10-21"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/cichlid-chips",[
    ["Cichlid Chips 250 ml / 130 g","Orta ve büyük hepçil/etçil cikletler için %48 proteinli renk destek cips tam yem · en az %1,5 Spirulina platensis, 1.000 mg/kg beta-glukan, %1 zeolit ve 80 mg/kg astaksantin · ürün kodu 60924 · EAN 5900469609248 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla"],
    ["Cichlid Chips 1000 ml / 520 g","Orta ve büyük hepçil/etçil cikletler için %48 proteinli renk destek cips tam yem · en az %1,5 Spirulina platensis, 1.000 mg/kg beta-glukan, %1 zeolit ve 80 mg/kg astaksantin · ürün kodu 60926 · EAN 5900469609262 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla"],
    ["Cichlid Chips 5 L / 2.6 kg","Orta ve büyük hepçil/etçil cikletler için %48 proteinli renk destek cips tam yem · en az %1,5 Spirulina platensis, 1.000 mg/kg beta-glukan, %1 zeolit ve 80 mg/kg astaksantin · ürün kodu 60928 · EAN 5900469609286 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla"],
  ],"2026-10-21"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/cichlid-arowana-medium-sticks",[
    ["Cichlid & Arowana Medium Sticks 250 ml / 90 g","Orta boy hepçil/etçil cikletler ve genç arowanalar için %48 proteinli, 80 mg/kg astaksantin içeren renk destekli yüzen çubuk tam yem · ürün kodu 63524 · EAN 5900469635247 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla"],
    ["Cichlid & Arowana Medium Sticks 1000 ml / 360 g","Orta boy hepçil/etçil cikletler ve genç arowanalar için %48 proteinli, 80 mg/kg astaksantin içeren renk destekli yüzen çubuk tam yem · ürün kodu 63526 · EAN 5900469635261 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla"],
    ["Cichlid & Arowana Medium Sticks 5 L / 1.8 kg","Orta boy hepçil/etçil cikletler ve genç arowanalar için %48 proteinli, 80 mg/kg astaksantin içeren renk destekli yüzen çubuk tam yem · ürün kodu 63528 · EAN 5900469635285 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla"],
    ["Cichlid & Arowana Medium Sticks 10 L / 3.6 kg","Orta boy hepçil/etçil cikletler ve genç arowanalar için %48 proteinli, 80 mg/kg astaksantin içeren renk destekli yüzen çubuk tam yem · ürün kodu 63529 · EAN 5900469635292 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla"],
  ],"2026-10-21"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/cichlid-arowana-large-sticks",[
    ["Cichlid & Arowana Large Sticks 250 ml / 75 g","Büyük hepçil/etçil cikletler ve yetişkin arowanalar için %48 proteinli, 80 mg/kg astaksantin içeren renk destekli yüzen çubuk tam yem · ürün kodu 63534 · EAN 5900469635346 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla"],
    ["Cichlid & Arowana Large Sticks 1000 ml / 300 g","Büyük hepçil/etçil cikletler ve yetişkin arowanalar için %48 proteinli, 80 mg/kg astaksantin içeren renk destekli yüzen çubuk tam yem · ürün kodu 63536 · EAN 5900469635360 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla"],
    ["Cichlid & Arowana Large Sticks 5 L / 1.5 kg","Büyük hepçil/etçil cikletler ve yetişkin arowanalar için %48 proteinli, 80 mg/kg astaksantin içeren renk destekli yüzen çubuk tam yem · ürün kodu 63538 · EAN 5900469635384 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla"],
    ["Cichlid & Arowana Large Sticks 10 L / 3 kg","Büyük hepçil/etçil cikletler ve yetişkin arowanalar için %48 proteinli, 80 mg/kg astaksantin içeren renk destekli yüzen çubuk tam yem · ürün kodu 63539 · EAN 5900469635391 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla"],
  ],"2026-10-21"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/cichlid-red-green-medium-sticks",[
    ["Cichlid Red & Green Medium Sticks 250 ml / 90 g","Orta boy hepçil cikletler için kırmızı ve yeşil yüzen çubuk tam yem · %46,5 protein, en az %3 Spirulina platensis, 1.000 mg/kg beta-glukan, %1 zeolit ve 60 mg/kg astaksantin · ürün kodu 63724 · EAN 5900469637241 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla"],
    ["Cichlid Red & Green Medium Sticks 1000 ml / 360 g","Orta boy hepçil cikletler için kırmızı ve yeşil yüzen çubuk tam yem · %46,5 protein, en az %3 Spirulina platensis, 1.000 mg/kg beta-glukan, %1 zeolit ve 60 mg/kg astaksantin · ürün kodu 63726 · EAN 5900469637265 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla"],
    ["Cichlid Red & Green Medium Sticks 5 L / 1.8 kg","Orta boy hepçil cikletler için kırmızı ve yeşil yüzen çubuk tam yem · %46,5 protein, en az %3 Spirulina platensis, 1.000 mg/kg beta-glukan, %1 zeolit ve 60 mg/kg astaksantin · ürün kodu 63728 · EAN 5900469637289 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla"],
    ["Cichlid Red & Green Medium Sticks 10 L / 3.6 kg","Orta boy hepçil cikletler için kırmızı ve yeşil yüzen çubuk tam yem · %46,5 protein, en az %3 Spirulina platensis, 1.000 mg/kg beta-glukan, %1 zeolit ve 60 mg/kg astaksantin · ürün kodu 63729 · EAN 5900469637296 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla"],
  ],"2026-10-21"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/cichlid-red-green-large-sticks",[
    ["Cichlid Red & Green Large Sticks 250 ml / 75 g","Büyük hepçil cikletler için kırmızı ve yeşil yüzen çubuk tam yem · %46,5 protein, en az %3 Spirulina platensis, 1.000 mg/kg beta-glukan, %1 zeolit ve 60 mg/kg astaksantin · ürün kodu 63734 · EAN 5900469637340 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla"],
    ["Cichlid Red & Green Large Sticks 1000 ml / 300 g","Büyük hepçil cikletler için kırmızı ve yeşil yüzen çubuk tam yem · %46,5 protein, en az %3 Spirulina platensis, 1.000 mg/kg beta-glukan, %1 zeolit ve 60 mg/kg astaksantin · ürün kodu 63736 · EAN 5900469637364 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla"],
    ["Cichlid Red & Green Large Sticks 5 L / 1.5 kg","Büyük hepçil cikletler için kırmızı ve yeşil yüzen çubuk tam yem · %46,5 protein, en az %3 Spirulina platensis, 1.000 mg/kg beta-glukan, %1 zeolit ve 60 mg/kg astaksantin · ürün kodu 63738 · EAN 5900469637388 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla"],
    ["Cichlid Red & Green Large Sticks 10 L / 3 kg","Büyük hepçil cikletler için kırmızı ve yeşil yüzen çubuk tam yem · %46,5 protein, en az %3 Spirulina platensis, 1.000 mg/kg beta-glukan, %1 zeolit ve 60 mg/kg astaksantin · ürün kodu 63739 · EAN 5900469637395 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla"],
  ],"2026-10-21"),
  ...products("Tropical","food","https://us.tropical.pl/tropical/product/cichlid-omnivore-small-pellet",[
    ["Cichlid Omnivore Small Pellet 250 ml / 90 g","Genç ve küçük hepçil cikletler için %43 proteinli, en az %1,5 Spirulina platensis, %1 zeolit ve 45 mg/kg astaksantin içeren hidro-stabil pelet tam yem · ürün kodu 60954 · EAN 5900469609545 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla"],
    ["Cichlid Omnivore Small Pellet 1000 ml / 360 g","Genç ve küçük hepçil cikletler için %43 proteinli, en az %1,5 Spirulina platensis, %1 zeolit ve 45 mg/kg astaksantin içeren hidro-stabil pelet tam yem · ürün kodu 60956 · EAN 5900469609569 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla"],
    ["Cichlid Omnivore Small Pellet 5 L / 1.8 kg","Genç ve küçük hepçil cikletler için %43 proteinli, en az %1,5 Spirulina platensis, %1 zeolit ve 45 mg/kg astaksantin içeren hidro-stabil pelet tam yem · ürün kodu 60958 · EAN 5900469609583 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla"],
    ["Cichlid Omnivore Small Pellet 10 L / 3.6 kg","Genç ve küçük hepçil cikletler için %43 proteinli, en az %1,5 Spirulina platensis, %1 zeolit ve 45 mg/kg astaksantin içeren hidro-stabil pelet tam yem · ürün kodu 60959 · EAN 5900469609590 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla"],
  ],"2026-10-21"),
  ...products("Tropical","food","https://us.tropical.pl/tropical/product/cichlid-omnivore-medium-pellet",[
    ["Cichlid Omnivore Medium Pellet 500 ml / 180 g","Orta ve büyük hepçil cikletler için %43 proteinli, en az %1,5 Spirulina platensis, %1 zeolit ve 45 mg/kg astaksantin içeren hidro-stabil pelet tam yem · ürün kodu 60965 · EAN 5900469609651 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla"],
    ["Cichlid Omnivore Medium Pellet 1000 ml / 360 g","Orta ve büyük hepçil cikletler için %43 proteinli, en az %1,5 Spirulina platensis, %1 zeolit ve 45 mg/kg astaksantin içeren hidro-stabil pelet tam yem · ürün kodu 60966 · EAN 5900469609668 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla"],
    ["Cichlid Omnivore Medium Pellet 5 L / 1.8 kg","Orta ve büyük hepçil cikletler için %43 proteinli, en az %1,5 Spirulina platensis, %1 zeolit ve 45 mg/kg astaksantin içeren hidro-stabil pelet tam yem · ürün kodu 60968 · EAN 5900469609682 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla"],
    ["Cichlid Omnivore Medium Pellet 10 L / 3.6 kg","Orta ve büyük hepçil cikletler için %43 proteinli, en az %1,5 Spirulina platensis, %1 zeolit ve 45 mg/kg astaksantin içeren hidro-stabil pelet tam yem · ürün kodu 60969 · EAN 5900469609699 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla"],
  ],"2026-10-21"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/cichlid-herbivore-small-pellet",[
    ["Cichlid Herbivore Small Pellet 250 ml / 90 g","Genç ve küçük otçul cikletler için %40 proteinli, %4 lifli, en az %3 Spirulina platensis ve %1 zeolit içeren hidro-stabil bitkisel pelet tam yem · ürün kodu 60854 · EAN 5900469608548 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla"],
    ["Cichlid Herbivore Small Pellet 1000 ml / 360 g","Genç ve küçük otçul cikletler için %40 proteinli, %4 lifli, en az %3 Spirulina platensis ve %1 zeolit içeren hidro-stabil bitkisel pelet tam yem · ürün kodu 60856 · EAN 5900469608562 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla"],
    ["Cichlid Herbivore Small Pellet 5 L / 1.8 kg","Genç ve küçük otçul cikletler için %40 proteinli, %4 lifli, en az %3 Spirulina platensis ve %1 zeolit içeren hidro-stabil bitkisel pelet tam yem · ürün kodu 60858 · EAN 5900469608586 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla"],
    ["Cichlid Herbivore Small Pellet 10 L / 3.6 kg","Genç ve küçük otçul cikletler için %40 proteinli, %4 lifli, en az %3 Spirulina platensis ve %1 zeolit içeren hidro-stabil bitkisel pelet tam yem · ürün kodu 60859 · EAN 5900469608593 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla"],
  ],"2026-10-21"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/cichlid-herbivore-medium-pellet",[
    ["Cichlid Herbivore Medium Pellet 500 ml / 180 g","Orta ve büyük otçul cikletler için %40 proteinli, %4 lifli, en az %3 Spirulina platensis ve %1 zeolit içeren hidro-stabil bitkisel pelet tam yem · ürün kodu 60865 · EAN 5900469608654 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla"],
    ["Cichlid Herbivore Medium Pellet 1000 ml / 360 g","Orta ve büyük otçul cikletler için %40 proteinli, %4 lifli, en az %3 Spirulina platensis ve %1 zeolit içeren hidro-stabil bitkisel pelet tam yem · ürün kodu 60866 · EAN 5900469608661 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla"],
    ["Cichlid Herbivore Medium Pellet 5 L / 1.8 kg","Orta ve büyük otçul cikletler için %40 proteinli, %4 lifli, en az %3 Spirulina platensis ve %1 zeolit içeren hidro-stabil bitkisel pelet tam yem · ürün kodu 60868 · EAN 5900469608685 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla"],
    ["Cichlid Herbivore Medium Pellet 10 L / 3.6 kg","Orta ve büyük otçul cikletler için %40 proteinli, %4 lifli, en az %3 Spirulina platensis ve %1 zeolit içeren hidro-stabil bitkisel pelet tam yem · ürün kodu 60869 · EAN 5900469608692 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla"],
  ],"2026-10-21"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/cichlid-carnivore-small-pellet",[
    ["Cichlid Carnivore Small Pellet 250 ml / 90 g","Genç ve küçük etçil cikletler için %46 proteinli, %1 zeolit ve 80 mg/kg astaksantin içeren renk destekli hidro-stabil pelet tam yem · ürün kodu 60754 · EAN 5900469607541 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla"],
    ["Cichlid Carnivore Small Pellet 1000 ml / 360 g","Genç ve küçük etçil cikletler için %46 proteinli, %1 zeolit ve 80 mg/kg astaksantin içeren renk destekli hidro-stabil pelet tam yem · ürün kodu 60756 · EAN 5900469607565 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla"],
    ["Cichlid Carnivore Small Pellet 5 L / 1.8 kg","Genç ve küçük etçil cikletler için %46 proteinli, %1 zeolit ve 80 mg/kg astaksantin içeren renk destekli hidro-stabil pelet tam yem · ürün kodu 60758 · EAN 5900469607589 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla"],
    ["Cichlid Carnivore Small Pellet 10 L / 3.6 kg","Genç ve küçük etçil cikletler için %46 proteinli, %1 zeolit ve 80 mg/kg astaksantin içeren renk destekli hidro-stabil pelet tam yem · ürün kodu 60759 · EAN 5900469607596 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla"],
  ],"2026-10-21"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/62",[
    ["Cichlid Carnivore Medium Pellet 500 ml / 180 g","Orta ve büyük etçil cikletler için %46 proteinli, %1 zeolit ve 80 mg/kg astaksantin içeren renk destekli hidro-stabil pelet tam yem · ürün kodu 60765 · EAN 5900469607657 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla"],
    ["Cichlid Carnivore Medium Pellet 1000 ml / 360 g","Orta ve büyük etçil cikletler için %46 proteinli, %1 zeolit ve 80 mg/kg astaksantin içeren renk destekli hidro-stabil pelet tam yem · ürün kodu 60766 · EAN 5900469607664 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla"],
    ["Cichlid Carnivore Medium Pellet 5 L / 1.8 kg","Orta ve büyük etçil cikletler için %46 proteinli, %1 zeolit ve 80 mg/kg astaksantin içeren renk destekli hidro-stabil pelet tam yem · ürün kodu 60768 · EAN 5900469607688 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla"],
    ["Cichlid Carnivore Medium Pellet 10 L / 3.6 kg","Orta ve büyük etçil cikletler için %46 proteinli, %1 zeolit ve 80 mg/kg astaksantin içeren renk destekli hidro-stabil pelet tam yem · ürün kodu 60769 · EAN 5900469607695 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla"],
  ],"2026-10-21"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/flower-horn-young-pellet",[
    ["Flower Horn Young Pellet 250 ml / 95 g","Genç Flower Horn ve diğer cikletler için %48 proteinli, yüzen hidro-stabil granül tam yem · en az %2 Spirulina platensis, %1 zeolit ve 100 mg/kg astaksantin · ürün kodu 65384 · EAN 5900469653845 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla"],
    ["Flower Horn Young Pellet 1000 ml / 380 g","Genç Flower Horn ve diğer cikletler için %48 proteinli, yüzen hidro-stabil granül tam yem · en az %2 Spirulina platensis, %1 zeolit ve 100 mg/kg astaksantin · ürün kodu 65386 · EAN 5900469653869 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla"],
    ["Flower Horn Young Pellet 3 L / 1.14 kg","Genç Flower Horn ve diğer cikletler için %48 proteinli, yüzen hidro-stabil granül tam yem · en az %2 Spirulina platensis, %1 zeolit ve 100 mg/kg astaksantin · ürün kodu 65387 · EAN 5900469653876 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla"],
  ],"2026-10-21"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/flower-horn-adult-pellet",[
    ["Flower Horn Adult Pellet 500 ml / 190 g","Yetişkin Flower Horn ve diğer cikletler için %47 proteinli, yüzen hidro-stabil pelet tam yem · en az %2 Spirulina platensis, %1 zeolit ve 100 mg/kg astaksantin · ürün kodu 64385 · EAN 5900469643853 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla"],
    ["Flower Horn Adult Pellet 1000 ml / 380 g","Yetişkin Flower Horn ve diğer cikletler için %47 proteinli, yüzen hidro-stabil pelet tam yem · en az %2 Spirulina platensis, %1 zeolit ve 100 mg/kg astaksantin · ürün kodu 64386 · EAN 5900469643860 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla"],
    ["Flower Horn Adult Pellet 3 L / 1.14 kg","Yetişkin Flower Horn ve diğer cikletler için %47 proteinli, yüzen hidro-stabil pelet tam yem · en az %2 Spirulina platensis, %1 zeolit ve 100 mg/kg astaksantin · ürün kodu 64387 · EAN 5900469643877 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla"],
    ["Flower Horn Adult Pellet 5 L / 1.9 kg","Yetişkin Flower Horn ve diğer cikletler için %47 proteinli, yüzen hidro-stabil pelet tam yem · en az %2 Spirulina platensis, %1 zeolit ve 100 mg/kg astaksantin · ürün kodu 64388 · EAN 5900469643884 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla"],
  ],"2026-10-21"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/tropical-discus-gran-wild",[
    ["Discus Gran Wild 250 ml / 110 g","Yabani discus ve yüksek beslenme gereksinimli balıklar için 1,2–2,6 mm batan granül tam yem · %48 protein, %12 alg, %4 krill unu, %5 sarımsak, %0,2 kırmızı biber konsantresi ve 60 mg/kg astaksantin · ürün kodu 61624 · EAN 5900469616246 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlarla"],
    ["Discus Gran Wild 1000 ml / 440 g","Yabani discus ve yüksek beslenme gereksinimli balıklar için 1,2–2,6 mm batan granül tam yem · %48 protein, %12 alg, %4 krill unu, %5 sarımsak, %0,2 kırmızı biber konsantresi ve 60 mg/kg astaksantin · ürün kodu 61626 · EAN 5900469616260 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlarla"],
    ["Discus Gran Wild 5 L / 2.2 kg","Yabani discus ve yüksek beslenme gereksinimli balıklar için 1,2–2,6 mm batan granül tam yem · %48 protein, %12 alg, %4 krill unu, %5 sarımsak, %0,2 kırmızı biber konsantresi ve 60 mg/kg astaksantin · ürün kodu 61628 · EAN 5900469616284 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlarla"],
    ["Discus Gran Wild 10 L / 4.4 kg","Yabani discus ve yüksek beslenme gereksinimli balıklar için 1,2–2,6 mm batan granül tam yem · %48 protein, %12 alg, %4 krill unu, %5 sarımsak, %0,2 kırmızı biber konsantresi ve 60 mg/kg astaksantin · ürün kodu 61629 · EAN 5900469616291 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlarla"],
  ],"2026-10-21"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/tropical-discus-gran-d-50-plus",[
    ["Discus Gran D-50 Plus 20 g sachet","Genç ve yetişkin discus ile yüksek beslenme gereksinimli balıklar için yaklaşık 2,4 mm yavaş batan granül tam yem · %50 protein, %1,5 Spirulina platensis, 1.000 mg/kg beta-glukan, 3.000 mg/kg kırmızı biber özütü ve 100 mg/kg astaksantin · ürün kodu 60641 · EAN 5900469606414 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlarla"],
    ["Discus Gran D-50 Plus 100 ml / 44 g","Genç ve yetişkin discus ile yüksek beslenme gereksinimli balıklar için yaklaşık 2,4 mm yavaş batan granül tam yem · %50 protein, %1,5 Spirulina platensis, 1.000 mg/kg beta-glukan, 3.000 mg/kg kırmızı biber özütü ve 100 mg/kg astaksantin · ürün kodu 61613 · EAN 5900469616130 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlarla"],
    ["Discus Gran D-50 Plus 250 ml / 110 g","Genç ve yetişkin discus ile yüksek beslenme gereksinimli balıklar için yaklaşık 2,4 mm yavaş batan granül tam yem · %50 protein, %1,5 Spirulina platensis, 1.000 mg/kg beta-glukan, 3.000 mg/kg kırmızı biber özütü ve 100 mg/kg astaksantin · ürün kodu 61614 · EAN 5900469616147 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlarla"],
    ["Discus Gran D-50 Plus 1000 ml / 440 g","Genç ve yetişkin discus ile yüksek beslenme gereksinimli balıklar için yaklaşık 2,4 mm yavaş batan granül tam yem · %50 protein, %1,5 Spirulina platensis, 1.000 mg/kg beta-glukan, 3.000 mg/kg kırmızı biber özütü ve 100 mg/kg astaksantin · ürün kodu 61616 · EAN 5900469616161 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlarla"],
    ["Discus Gran D-50 Plus 5 L / 2.2 kg","Genç ve yetişkin discus ile yüksek beslenme gereksinimli balıklar için yaklaşık 2,4 mm yavaş batan granül tam yem · %50 protein, %1,5 Spirulina platensis, 1.000 mg/kg beta-glukan, 3.000 mg/kg kırmızı biber özütü ve 100 mg/kg astaksantin · ürün kodu 61618 · EAN 5900469616185 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlarla"],
    ["Discus Gran D-50 Plus 10 L / 4.4 kg","Genç ve yetişkin discus ile yüksek beslenme gereksinimli balıklar için yaklaşık 2,4 mm yavaş batan granül tam yem · %50 protein, %1,5 Spirulina platensis, 1.000 mg/kg beta-glukan, 3.000 mg/kg kırmızı biber özütü ve 100 mg/kg astaksantin · ürün kodu 61619 · EAN 5900469616192 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlarla"],
  ],"2026-10-21"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/tropical-discus-gran-d-50-plus-baby",[
    ["Discus Gran D-50 Plus Baby 100 ml / 52 g","Genç discus ve yüksek beslenme gereksinimli yavrular için %55 proteinli küçük, yavaş batan granül tam yem · %15 yumurta tozu, %5 sarımsak, %3 Spirulina platensis, %1,5 Ascophyllum nodosum, 1.000 mg/kg beta-glukan ve %1 zeolit · ürün kodu 60673 · EAN 5900469606735 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla"],
    ["Discus Gran D-50 Plus Baby 250 ml / 130 g","Genç discus ve yüksek beslenme gereksinimli yavrular için %55 proteinli küçük, yavaş batan granül tam yem · %15 yumurta tozu, %5 sarımsak, %3 Spirulina platensis, %1,5 Ascophyllum nodosum, 1.000 mg/kg beta-glukan ve %1 zeolit · ürün kodu 60674 · EAN 5900469606742 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla"],
    ["Discus Gran D-50 Plus Baby 3 L / 1.56 kg","Genç discus ve yüksek beslenme gereksinimli yavrular için %55 proteinli küçük, yavaş batan granül tam yem · %15 yumurta tozu, %5 sarımsak, %3 Spirulina platensis, %1,5 Ascophyllum nodosum, 1.000 mg/kg beta-glukan ve %1 zeolit · ürün kodu 60677 · EAN 5900469606773 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla"],
  ],"2026-10-22"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/d-50-plus",[
    ["D-50 Plus 12 g sachet","Genç/yetişkin discus, damızlıklar ve yüksek beslenme gereksinimli balıklar için %50 proteinli renk destekli pul tam yem · %8 kalamar unu, %3 krill unu, %0,5 Spirulina platensis, 1.000 mg/kg beta-glukan, 3.000 mg/kg kırmızı biber özütü ve 100 mg/kg astaksantin · ürün kodu 72391 · EAN 5900469723913 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlarla"],
    ["D-50 Plus 250 ml / 50 g","Genç/yetişkin discus, damızlıklar ve yüksek beslenme gereksinimli balıklar için %50 proteinli renk destekli pul tam yem · %8 kalamar unu, %3 krill unu, %0,5 Spirulina platensis, 1.000 mg/kg beta-glukan, 3.000 mg/kg kırmızı biber özütü ve 100 mg/kg astaksantin · ürün kodu 77314 · EAN 5900469773147 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlarla"],
    ["D-50 Plus 1000 ml / 200 g","Genç/yetişkin discus, damızlıklar ve yüksek beslenme gereksinimli balıklar için %50 proteinli renk destekli pul tam yem · %8 kalamar unu, %3 krill unu, %0,5 Spirulina platensis, 1.000 mg/kg beta-glukan, 3.000 mg/kg kırmızı biber özütü ve 100 mg/kg astaksantin · ürün kodu 77316 · EAN 5900469773161 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlarla"],
    ["D-50 Plus 5 L / 1 kg","Genç/yetişkin discus, damızlıklar ve yüksek beslenme gereksinimli balıklar için %50 proteinli renk destekli pul tam yem · %8 kalamar unu, %3 krill unu, %0,5 Spirulina platensis, 1.000 mg/kg beta-glukan, 3.000 mg/kg kırmızı biber özütü ve 100 mg/kg astaksantin · ürün kodu 72397 · EAN 5900469723975 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlarla"],
    ["D-50 Plus 11 L / 2 kg","Genç/yetişkin discus, damızlıklar ve yüksek beslenme gereksinimli balıklar için %50 proteinli renk destekli pul tam yem · %8 kalamar unu, %3 krill unu, %0,5 Spirulina platensis, 1.000 mg/kg beta-glukan, 3.000 mg/kg kırmızı biber özütü ve 100 mg/kg astaksantin · ürün kodu 72398 · EAN 5900469723982 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlarla"],
  ],"2026-10-22"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/astacolor",[
    ["Astacolor 12 g sachet","Hepçil ve etçil akvaryum balıkları için %48 proteinli renk destekli pul tam yem · %2 Spirulina platensis, 3.500 mg/kg kırmızı biber özütü ve 100 mg/kg astaksantin · ürün kodu 72331 · EAN 5900469723319 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlarla"],
    ["Astacolor 100 ml / 20 g","Hepçil ve etçil akvaryum balıkları için %48 proteinli renk destekli pul tam yem · %2 Spirulina platensis, 3.500 mg/kg kırmızı biber özütü ve 100 mg/kg astaksantin · ürün kodu 77333 · EAN 5900469723338 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlarla"],
    ["Astacolor 500 ml / 100 g","Hepçil ve etçil akvaryum balıkları için %48 proteinli renk destekli pul tam yem · %2 Spirulina platensis, 3.500 mg/kg kırmızı biber özütü ve 100 mg/kg astaksantin · ürün kodu 77335 · EAN 5900469773352 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlarla"],
    ["Astacolor 5 L / 1 kg","Hepçil ve etçil akvaryum balıkları için %48 proteinli renk destekli pul tam yem · %2 Spirulina platensis, 3.500 mg/kg kırmızı biber özütü ve 100 mg/kg astaksantin · ürün kodu 72337 · EAN 5900469723371 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlarla"],
    ["Astacolor 11 L / 2 kg","Hepçil ve etçil akvaryum balıkları için %48 proteinli renk destekli pul tam yem · %2 Spirulina platensis, 3.500 mg/kg kırmızı biber özütü ve 100 mg/kg astaksantin · ürün kodu 72338 · EAN 5900469723388 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlarla"],
  ],"2026-10-22"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/red-parrot-granulat",[
    ["Red Parrot Granulat 250 ml / 100 g","Papağan cikletleri ve yüksek karotenoid gereksinimli cikletler için %48 proteinli, yüzen hidro-stabil granül tam yem · %1 zeolit ve 100 mg/kg astaksantin · ürün kodu 60714 · EAN 5900469607145 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla"],
    ["Red Parrot Granulat 1000 ml / 400 g","Papağan cikletleri ve yüksek karotenoid gereksinimli cikletler için %48 proteinli, yüzen hidro-stabil granül tam yem · %1 zeolit ve 100 mg/kg astaksantin · ürün kodu 60716 · EAN 5900469607169 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla"],
    ["Red Parrot Granulat 3 L / 1.2 kg","Papağan cikletleri ve yüksek karotenoid gereksinimli cikletler için %48 proteinli, yüzen hidro-stabil granül tam yem · %1 zeolit ve 100 mg/kg astaksantin · ürün kodu 60717 · EAN 5900469607176 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla"],
  ],"2026-10-22"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/bionutic-flakes",[
    ["Bionautic Flakes 250 ml / 50 g","Küçük ve orta boy hepçil deniz balıkları ile kabuklular için %47 proteinli pul tam yem · en az %8,75 Spirulina platensis, %8 sarımsak, %1 zeolit ve 60 mg/kg astaksantin · ürün kodu 77504 · EAN 5900469775042 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla"],
    ["Bionautic Flakes 1000 ml / 200 g","Küçük ve orta boy hepçil deniz balıkları ile kabuklular için %47 proteinli pul tam yem · en az %8,75 Spirulina platensis, %8 sarımsak, %1 zeolit ve 60 mg/kg astaksantin · ürün kodu 77506 · EAN 5900469775066 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla"],
  ],"2026-10-22"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/bionautic-granulat",[
    ["Bionautic Granulat 100 ml / 55 g","Küçük ve orta boy hepçil deniz balıkları ile kabuklular için %48 proteinli granül tam yem · en az %8 sarımsak, en az %3 Spirulina platensis, %1 zeolit, 15.000 mg/kg lesitin ve 60 mg/kg astaksantin · ürün kodu 61153 · EAN 5900469611531 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla"],
    ["Bionautic Granulat 500 ml / 275 g","Küçük ve orta boy hepçil deniz balıkları ile kabuklular için %48 proteinli granül tam yem · en az %8 sarımsak, en az %3 Spirulina platensis, %1 zeolit, 15.000 mg/kg lesitin ve 60 mg/kg astaksantin · ürün kodu 61155 · EAN 5900469611555 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla"],
    ["Bionautic Granulat 5 L / 2.75 kg","Küçük ve orta boy hepçil deniz balıkları ile kabuklular için %48 proteinli granül tam yem · en az %8 sarımsak, en az %3 Spirulina platensis, %1 zeolit, 15.000 mg/kg lesitin ve 60 mg/kg astaksantin · ürün kodu 61158 · EAN 5900469611586 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla"],
    ["Bionautic Granulat 10 L / 5.5 kg","Küçük ve orta boy hepçil deniz balıkları ile kabuklular için %48 proteinli granül tam yem · en az %8 sarımsak, en az %3 Spirulina platensis, %1 zeolit, 15.000 mg/kg lesitin ve 60 mg/kg astaksantin · ürün kodu 61159 · EAN 5900469611593 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla"],
  ],"2026-10-22"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/bionautic-chips",[
    ["Bionautic Chips 250 ml / 130 g","Orta ve büyük hepçil deniz balıkları ile kabuklular için %48 proteinli yavaş batan cips tam yem · en az %8 sarımsak, en az %3 Spirulina platensis, 15.000 mg/kg lesitin ve 60 mg/kg astaksantin · ürün kodu 61164 · EAN 5900469611647 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla"],
    ["Bionautic Chips 1000 ml / 520 g","Orta ve büyük hepçil deniz balıkları ile kabuklular için %48 proteinli yavaş batan cips tam yem · en az %8 sarımsak, en az %3 Spirulina platensis, 15.000 mg/kg lesitin ve 60 mg/kg astaksantin · ürün kodu 61166 · EAN 5900469611661 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla"],
  ],"2026-10-22"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/goldfish-colour-pellet",[
    ["Goldfish Colour Pellet 100 ml / 36 g","Japon balıkları ve genç koi için %45 proteinli küçük yüzen granül tam yem · 2.200 mg/kg kırmızı biber özütü, 1.000 mg/kg beta-glukan, %1 zeolit ve 80 mg/kg astaksantin · ürün kodu 60473 · EAN 5900469604731 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla"],
    ["Goldfish Colour Pellet 250 ml / 90 g","Japon balıkları ve genç koi için %45 proteinli küçük yüzen granül tam yem · 2.200 mg/kg kırmızı biber özütü, 1.000 mg/kg beta-glukan, %1 zeolit ve 80 mg/kg astaksantin · ürün kodu 60474 · EAN 5900469604748 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla"],
    ["Goldfish Colour Pellet 1000 ml / 360 g","Japon balıkları ve genç koi için %45 proteinli küçük yüzen granül tam yem · 2.200 mg/kg kırmızı biber özütü, 1.000 mg/kg beta-glukan, %1 zeolit ve 80 mg/kg astaksantin · ürün kodu 60476 · EAN 5900469604762 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla"],
    ["Goldfish Colour Pellet 5 L / 1.8 kg","Japon balıkları ve genç koi için %45 proteinli küçük yüzen granül tam yem · 2.200 mg/kg kırmızı biber özütü, 1.000 mg/kg beta-glukan, %1 zeolit ve 80 mg/kg astaksantin · ürün kodu 60478 · EAN 5900469604786 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla"],
  ],"2026-10-22"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/insect-menu-flakes",[
    ["Insect Menu Flakes 12 g sachet","Hepçil ve etçil balıklar için %15 Hermetia, %15 ipek böceği ve %15 un kurdu içeren %45 proteinli pul tam yem; renklendirici ve koruyucu içermez · ürün kodu 70441 · EAN 5900469704417 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlarla"],
    ["Insect Menu Flakes 100 ml / 20 g","Hepçil ve etçil balıklar için %15 Hermetia, %15 ipek böceği ve %15 un kurdu içeren %45 proteinli pul tam yem; renklendirici ve koruyucu içermez · ürün kodu 70443 · EAN 5900469704431 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlarla"],
    ["Insect Menu Flakes 250 ml / 50 g","Hepçil ve etçil balıklar için %15 Hermetia, %15 ipek böceği ve %15 un kurdu içeren %45 proteinli pul tam yem; renklendirici ve koruyucu içermez · ürün kodu 70444 · EAN 5900469704448 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlarla"],
    ["Insect Menu Flakes 1000 ml / 200 g","Hepçil ve etçil balıklar için %15 Hermetia, %15 ipek böceği ve %15 un kurdu içeren %45 proteinli pul tam yem; renklendirici ve koruyucu içermez · ürün kodu 70446 · EAN 5900469704462 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlarla"],
  ],"2026-10-12"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/insect-menu-granules-size-s",[
    ["Insect Menu Granules S 100 ml / 54 g","Hepçil ve etçil balıklar için %15 Hermetia, %15 ipek böceği ve %15 un kurdu içeren 1,2 mm batan, %45 proteinli granül tam yem; renklendirici ve koruyucu içermez · ürün kodu 64033 · EAN 5900469640333 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlarla"],
    ["Insect Menu Granules S 250 ml / 135 g","Hepçil ve etçil balıklar için %15 Hermetia, %15 ipek böceği ve %15 un kurdu içeren 1,2 mm batan, %45 proteinli granül tam yem; renklendirici ve koruyucu içermez · ürün kodu 64034 · EAN 5900469640340 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlarla"],
    ["Insect Menu Granules S 1000 ml / 540 g","Hepçil ve etçil balıklar için %15 Hermetia, %15 ipek böceği ve %15 un kurdu içeren 1,2 mm batan, %45 proteinli granül tam yem; renklendirici ve koruyucu içermez · ürün kodu 64036 · EAN 5900469640364 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlarla"],
  ],"2026-10-12"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/insect-menu-granules-size-xxs",[
    ["Insect Menu Granules XXS 100 ml / 64 g","Küçük hepçil ve etçil balıklar için %15 Hermetia, %15 ipek böceği ve %15 un kurdu içeren 0,5 mm çok ince batan, %45 proteinli granül tam yem; renklendirici ve koruyucu içermez · ürün kodu 64013 · EAN 5900469640135 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlarla"],
    ["Insect Menu Granules XXS 250 ml / 160 g","Küçük hepçil ve etçil balıklar için %15 Hermetia, %15 ipek böceği ve %15 un kurdu içeren 0,5 mm çok ince batan, %45 proteinli granül tam yem; renklendirici ve koruyucu içermez · ürün kodu 64014 · EAN 5900469640142 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlarla"],
    ["Insect Menu Granules XXS 1000 ml / 640 g","Küçük hepçil ve etçil balıklar için %15 Hermetia, %15 ipek böceği ve %15 un kurdu içeren 0,5 mm çok ince batan, %45 proteinli granül tam yem; renklendirici ve koruyucu içermez · ürün kodu 64016 · EAN 5900469640166 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlarla"],
  ],"2026-10-12"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/insect-menu-colour-flakes",[
    ["Insect Menu Colour Flakes 100 ml / 20 g","Hepçil ve etçil balıklar için %15 Hermetia, %15 ipek böceği ve %15 un kurdu içeren %45 proteinli renk destek pul tam yem; doğal karotenoidli Tropical Colour Booster kullanır, yapay renklendirici ve koruyucu içermez · ürün kodu 70453 · EAN 5900469704530 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlarla"],
    ["Insect Menu Colour Flakes 250 ml / 50 g","Hepçil ve etçil balıklar için %15 Hermetia, %15 ipek böceği ve %15 un kurdu içeren %45 proteinli renk destek pul tam yem; doğal karotenoidli Tropical Colour Booster kullanır, yapay renklendirici ve koruyucu içermez · ürün kodu 70454 · EAN 5900469704547 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlarla"],
    ["Insect Menu Colour Flakes 1000 ml / 200 g","Hepçil ve etçil balıklar için %15 Hermetia, %15 ipek böceği ve %15 un kurdu içeren %45 proteinli renk destek pul tam yem; doğal karotenoidli Tropical Colour Booster kullanır, yapay renklendirici ve koruyucu içermez · ürün kodu 70456 · EAN 5900469704561 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlarla"],
  ],"2026-10-12"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/insect-menu-colour-granules-size-s",[
    ["Insect Menu Colour Granules S 100 ml / 54 g","Hepçil ve etçil balıklar için %15 Hermetia, %15 ipek böceği ve %15 un kurdu içeren 1,2 mm batan, %45 proteinli renk destek granül tam yem; doğal karotenoidli Tropical Colour Booster kullanır, yapay renklendirici ve koruyucu içermez · ürün kodu 64063 · EAN 5900469640630 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlarla"],
    ["Insect Menu Colour Granules S 250 ml / 135 g","Hepçil ve etçil balıklar için %15 Hermetia, %15 ipek böceği ve %15 un kurdu içeren 1,2 mm batan, %45 proteinli renk destek granül tam yem; doğal karotenoidli Tropical Colour Booster kullanır, yapay renklendirici ve koruyucu içermez · ürün kodu 64064 · EAN 5900469640647 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlarla"],
  ],"2026-10-12"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/insect-menu-colour-granules-size-xxs",[
    ["Insect Menu Colour Granules XXS 100 ml / 64 g","Küçük hepçil ve etçil balıklar için %15 Hermetia, %15 ipek böceği ve %15 un kurdu içeren 0,5 mm çok ince batan, %45 proteinli renk destek granül tam yem; doğal karotenoidli Tropical Colour Booster kullanır, yapay renklendirici ve koruyucu içermez · ürün kodu 64043 · EAN 5900469640432 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlarla"],
    ["Insect Menu Colour Granules XXS 250 ml / 160 g","Küçük hepçil ve etçil balıklar için %15 Hermetia, %15 ipek böceği ve %15 un kurdu içeren 0,5 mm çok ince batan, %45 proteinli renk destek granül tam yem; doğal karotenoidli Tropical Colour Booster kullanır, yapay renklendirici ve koruyucu içermez · ürün kodu 64044 · EAN 5900469640449 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlarla"],
  ],"2026-10-12"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/pro-defence-micro-size",[
    ["Pro Defence Micro (Powder) 100 ml / 60 g","Yavrular için %60 proteinli probiyotik destekli toz yem · Bacillus subtilis C-3102 (DSM 15544), en az 1 × 10^10 CFU · ürün kodu 68013 · EAN 5900469680131 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla; doğal topaklanmayı azaltmak için kullanmadan önce nazikçe çalkalayın"],
    ["Pro Defence Micro (Powder) 3 L / 1.8 kg","Yavrular için %60 proteinli probiyotik destekli toz yem · Bacillus subtilis C-3102 (DSM 15544), en az 1 × 10^10 CFU · ürün kodu 68017 · EAN 5900469680179 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla; doğal topaklanmayı azaltmak için kullanmadan önce nazikçe çalkalayın"],
  ],"2026-10-21"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/pro-defence-size-m",[
    ["Pro Defence Size M 100 ml / 44 g","Yetişkin akvaryum balıkları için %47,5 proteinli, yavaş batan probiyotik destekli granül yem · Bacillus subtilis C-3102 (DSM 15544), en az 1 × 10^10 CFU · ürün kodu 68033 · EAN 5900469680339 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla; kullanmadan önce nazikçe çalkalayın"],
    ["Pro Defence Size M 250 ml / 110 g","Yetişkin akvaryum balıkları için %47,5 proteinli, yavaş batan probiyotik destekli granül yem · Bacillus subtilis C-3102 (DSM 15544), en az 1 × 10^10 CFU · ürün kodu 68034 · EAN 5900469680346 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla; kullanmadan önce nazikçe çalkalayın"],
    ["Pro Defence Size M 1000 ml / 440 g","Yetişkin akvaryum balıkları için %47,5 proteinli, yavaş batan probiyotik destekli granül yem · Bacillus subtilis C-3102 (DSM 15544), en az 1 × 10^10 CFU · ürün kodu 68036 · EAN 5900469680360 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla; kullanmadan önce nazikçe çalkalayın"],
    ["Pro Defence Size M 3 L / 1.32 kg","Yetişkin akvaryum balıkları için %47,5 proteinli, yavaş batan probiyotik destekli granül yem · Bacillus subtilis C-3102 (DSM 15544), en az 1 × 10^10 CFU · ürün kodu 68037 · EAN 5900469680377 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla; kullanmadan önce nazikçe çalkalayın"],
    ["Pro Defence Size M 5 L / 2.2 kg","Yetişkin akvaryum balıkları için %47,5 proteinli, yavaş batan probiyotik destekli granül yem · Bacillus subtilis C-3102 (DSM 15544), en az 1 × 10^10 CFU · ürün kodu 68038 · EAN 5900469680384 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla; kullanmadan önce nazikçe çalkalayın"],
    ["Pro Defence Size M 10 L / 4.4 kg","Yetişkin akvaryum balıkları için %47,5 proteinli, yavaş batan probiyotik destekli granül yem · Bacillus subtilis C-3102 (DSM 15544), en az 1 × 10^10 CFU · ürün kodu 68039 · EAN 5900469680391 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla; kullanmadan önce nazikçe çalkalayın"],
  ],"2026-10-21"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/pro-defence-size-s",[
    ["Pro Defence Size S 100 ml / 52 g","Genç ve küçük tür yetişkin balıklar için %47,5 proteinli, yavaş batan probiyotik destekli granül yem · Bacillus subtilis C-3102 (DSM 15544), en az 1 × 10^10 CFU · ürün kodu 68023 · EAN 5900469680230 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla; kullanmadan önce nazikçe çalkalayın"],
    ["Pro Defence Size S 250 ml / 130 g","Genç ve küçük tür yetişkin balıklar için %47,5 proteinli, yavaş batan probiyotik destekli granül yem · Bacillus subtilis C-3102 (DSM 15544), en az 1 × 10^10 CFU · ürün kodu 68024 · EAN 5900469680247 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla; kullanmadan önce nazikçe çalkalayın"],
    ["Pro Defence Size S 1000 ml / 520 g","Genç ve küçük tür yetişkin balıklar için %47,5 proteinli, yavaş batan probiyotik destekli granül yem · Bacillus subtilis C-3102 (DSM 15544), en az 1 × 10^10 CFU · ürün kodu 68026 · EAN 5900469680261 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla; kullanmadan önce nazikçe çalkalayın"],
    ["Pro Defence Size S 3 L / 1.56 kg","Genç ve küçük tür yetişkin balıklar için %47,5 proteinli, yavaş batan probiyotik destekli granül yem · Bacillus subtilis C-3102 (DSM 15544), en az 1 × 10^10 CFU · ürün kodu 68027 · EAN 5900469680278 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla; kullanmadan önce nazikçe çalkalayın"],
    ["Pro Defence Size S 5 L / 2.6 kg","Genç ve küçük tür yetişkin balıklar için %47,5 proteinli, yavaş batan probiyotik destekli granül yem · Bacillus subtilis C-3102 (DSM 15544), en az 1 × 10^10 CFU · ürün kodu 68028 · EAN 5900469680285 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla; kullanmadan önce nazikçe çalkalayın"],
    ["Pro Defence Size S 10 L / 5.2 kg","Genç ve küçük tür yetişkin balıklar için %47,5 proteinli, yavaş batan probiyotik destekli granül yem · Bacillus subtilis C-3102 (DSM 15544), en az 1 × 10^10 CFU · ürün kodu 68029 · EAN 5900469680292 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla; kullanmadan önce nazikçe çalkalayın"],
  ],"2026-10-21"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/pro-defence-size-xxs",[
    ["Pro Defence Size XXS 10 g sachet","Yavru ve küçük tür balıklar için 0,5 mm, %57 proteinli, yavaş batan probiyotik destekli mikrogranül yem · Bacillus subtilis C-3102 (DSM 15544), en az 1 × 10^10 CFU · ürün kodu 68041 · EAN 5900469680414 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla; kullanmadan önce nazikçe çalkalayın"],
    ["Pro Defence Size XXS 100 ml / 70 g","Yavru ve küçük tür balıklar için 0,5 mm, %57 proteinli, yavaş batan probiyotik destekli mikrogranül yem · Bacillus subtilis C-3102 (DSM 15544), en az 1 × 10^10 CFU · ürün kodu 68043 · EAN 5900469680438 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla; kullanmadan önce nazikçe çalkalayın"],
    ["Pro Defence Size XXS 3 L / 2.1 kg","Yavru ve küçük tür balıklar için 0,5 mm, %57 proteinli, yavaş batan probiyotik destekli mikrogranül yem · Bacillus subtilis C-3102 (DSM 15544), en az 1 × 10^10 CFU · ürün kodu 68047 · EAN 5900469680476 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla; kullanmadan önce nazikçe çalkalayın"],
    ["Pro Defence Size XXS 5 L / 3.5 kg","Yavru ve küçük tür balıklar için 0,5 mm, %57 proteinli, yavaş batan probiyotik destekli mikrogranül yem · Bacillus subtilis C-3102 (DSM 15544), en az 1 × 10^10 CFU · ürün kodu 68048 · EAN 5900469680483 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla; kullanmadan önce nazikçe çalkalayın"],
  ],"2026-10-21"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/africa-carnivore",[
    ["Soft Line Africa Carnivore M 100 ml / 52 g","Afrika etçil ve hepçil balıkları için %40 proteinli yumuşak batan cips tam yem · %14 ringa balığı unu, %12 bütün karides unu, %10 krill, %6 kalamar, %1,5 Calanus, %5 böcek larvası unu ve %4,5 sarımsak · ürün kodu 67523 · EAN 5900469675236 · günde birkaç kez küçük porsiyonlarla; kullanmadan önce nazikçe çalkalayın"],
    ["Soft Line Africa Carnivore M 250 ml / 130 g","Afrika etçil ve hepçil balıkları için %40 proteinli yumuşak batan cips tam yem · %14 ringa balığı unu, %12 bütün karides unu, %10 krill, %6 kalamar, %1,5 Calanus, %5 böcek larvası unu ve %4,5 sarımsak · ürün kodu 67524 · EAN 5900469675243 · günde birkaç kez küçük porsiyonlarla; kullanmadan önce nazikçe çalkalayın"],
  ],"2026-10-21"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/africa-carnivore-s",[
    ["Soft Line Africa Carnivore S 100 ml / 60 g","Afrika etçil ve hepçil balıkları için %40 proteinli yumuşak batan çubuk tam yem · %14 ringa balığı unu, %12 bütün karides unu, %10 krill, %6 kalamar, %1,5 Calanus, %5 böcek larvası unu ve %4,5 sarımsak · ürün kodu 67513 · EAN 5900469675137 · günde birkaç kez küçük porsiyonlarla; kullanmadan önce nazikçe çalkalayın"],
    ["Soft Line Africa Carnivore S 250 ml / 150 g","Afrika etçil ve hepçil balıkları için %40 proteinli yumuşak batan çubuk tam yem · %14 ringa balığı unu, %12 bütün karides unu, %10 krill, %6 kalamar, %1,5 Calanus, %5 böcek larvası unu ve %4,5 sarımsak · ürün kodu 67514 · EAN 5900469675144 · günde birkaç kez küçük porsiyonlarla; kullanmadan önce nazikçe çalkalayın"],
  ],"2026-10-21"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/africa-herbivore",[
    ["Soft Line Africa Herbivore M 100 ml / 52 g","Afrika otçul ve hepçil balıkları için %40 proteinli yumuşak batan cips tam yem · %20 Spirulina, %4,1 Laminaria, %2,8 Chlorella, %1,2 Lithothamnium, %8,6 genç yonca sürgünü, %6 krill, %4 kalamar ve %1,7 Calanus · ürün kodu 67573 · EAN 5900469675731 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla; kullanmadan önce nazikçe çalkalayın"],
    ["Soft Line Africa Herbivore M 250 ml / 130 g","Afrika otçul ve hepçil balıkları için %40 proteinli yumuşak batan cips tam yem · %20 Spirulina, %4,1 Laminaria, %2,8 Chlorella, %1,2 Lithothamnium, %8,6 genç yonca sürgünü, %6 krill, %4 kalamar ve %1,7 Calanus · ürün kodu 67574 · EAN 5900469675748 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla; kullanmadan önce nazikçe çalkalayın"],
  ],"2026-10-21"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/africa-herbivore-size-s",[
    ["Soft Line Africa Herbivore S 100 ml / 60 g","Afrika otçul ve hepçil balıkları için %40 proteinli yumuşak batan çubuk tam yem · %20 Spirulina, %4,1 Laminaria, %2,8 Chlorella, %1,2 Lithothamnium, %8,6 genç yonca sürgünü, %6 krill, %4 kalamar ve %1,7 Calanus · ürün kodu 67563 · EAN 5900469675632 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla; kullanmadan önce nazikçe çalkalayın"],
    ["Soft Line Africa Herbivore S 250 ml / 150 g","Afrika otçul ve hepçil balıkları için %40 proteinli yumuşak batan çubuk tam yem · %20 Spirulina, %4,1 Laminaria, %2,8 Chlorella, %1,2 Lithothamnium, %8,6 genç yonca sürgünü, %6 krill, %4 kalamar ve %1,7 Calanus · ürün kodu 67564 · EAN 5900469675649 · günde birkaç kez, 2–3 dakikada tüketilecek küçük porsiyonlarla; kullanmadan önce nazikçe çalkalayın"],
  ],"2026-10-21"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/monster-fish",[
    ["Soft Line Monster Fish 1000 ml / 320 g","Büyük etçil balıklar için %38,5 proteinli yumuşak yüzen çubuk tam yem · %12 bütün karides unu, %10 krill unu, %6 kalamar unu, %1,7 Calanus unu, %5 böcek larvası unu, %3 meyve, 3.000 mg/kg kırmızı biber özütü ve 1.000 mg/kg beta-glukan · ürün kodu 67786 · EAN 5900469677865 · günde birkaç kez küçük porsiyonlarla; kullanmadan önce nazikçe çalkalayın"],
  ],"2026-10-21"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/carnivore-",[
    ["Soft Line Carnivore 250 ml / 80 g","Büyük etçil balıklar için %36 proteinli yüzen karma tam yem; ana bileşeni yumuşak çubuklardır · %20 kurutulmuş karides, %8 kurutulmuş un kurdu larvası, %2 kurutulmuş cırcır böceği, %2,2 Spirulina platensis ve 1.000 mg/kg beta-glukan · ürün kodu 67774 · EAN 5900469677742 · günde birkaç kez küçük porsiyonlarla; kullanmadan önce nazikçe çalkalayın"],
    ["Soft Line Carnivore 1000 ml / 320 g","Büyük etçil balıklar için %36 proteinli yüzen karma tam yem; ana bileşeni yumuşak çubuklardır · %20 kurutulmuş karides, %8 kurutulmuş un kurdu larvası, %2 kurutulmuş cırcır böceği, %2,2 Spirulina platensis ve 1.000 mg/kg beta-glukan · ürün kodu 67776 · EAN 5900469677766 · günde birkaç kez küçük porsiyonlarla; kullanmadan önce nazikçe çalkalayın"],
  ],"2026-10-21"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/america-soft-line-s",[
    ["Soft Line America S 100 ml / 56 g","Kuzey ve Güney Amerika kökenli 2–6 cm hepçil ve etçil balıklar için 0,6 × 1–3 mm yumuşak batan çubuk tam yem · %41 protein, %8 krill, %1,7 Calanus, %5 böcek larvası unu ve %4,5 sarımsak · ürün kodu 67413 · EAN 5900469674130 · günde birkaç kez küçük porsiyonlarla; kullanmadan önce nazikçe çalkalayın"],
    ["Soft Line America S 250 ml / 140 g","Kuzey ve Güney Amerika kökenli 2–6 cm hepçil ve etçil balıklar için 0,6 × 1–3 mm yumuşak batan çubuk tam yem · %41 protein, %8 krill, %1,7 Calanus, %5 böcek larvası unu ve %4,5 sarımsak · ürün kodu 67414 · EAN 5900469674147 · günde birkaç kez küçük porsiyonlarla; kullanmadan önce nazikçe çalkalayın"],
  ],"2026-10-21"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/america-soft-line-m",[
    ["Soft Line America M 100 ml / 60 g","Kuzey ve Güney Amerika kökenli 6–12 cm hepçil ve etçil balıklar için 2 mm yumuşak batan granül tam yem · %41 protein, %8 krill, %1,7 Calanus, %5 böcek larvası unu ve %4,5 sarımsak · ürün kodu 67423 · EAN 5900469674239 · günde birkaç kez küçük porsiyonlarla; kullanmadan önce nazikçe çalkalayın"],
    ["Soft Line America M 250 ml / 150 g","Kuzey ve Güney Amerika kökenli 6–12 cm hepçil ve etçil balıklar için 2 mm yumuşak batan granül tam yem · %41 protein, %8 krill, %1,7 Calanus, %5 böcek larvası unu ve %4,5 sarımsak · ürün kodu 67424 · EAN 5900469674246 · günde birkaç kez küçük porsiyonlarla; kullanmadan önce nazikçe çalkalayın"],
  ],"2026-10-21"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/america-soft-line",[
    ["Soft Line America L 100 ml / 52 g","Kuzey ve Güney Amerika kökenli 12 cm üzeri hepçil ve etçil balıklar için 1,8 × 5 mm yumuşak batan cips tam yem · %41 protein, %8 krill, %1,7 Calanus, %5 böcek larvası unu ve %4,5 sarımsak · ürün kodu 67433 · EAN 5900469674338 · günde birkaç kez küçük porsiyonlarla; kullanmadan önce nazikçe çalkalayın"],
    ["Soft Line America L 250 ml / 130 g","Kuzey ve Güney Amerika kökenli 12 cm üzeri hepçil ve etçil balıklar için 1,8 × 5 mm yumuşak batan cips tam yem · %41 protein, %8 krill, %1,7 Calanus, %5 böcek larvası unu ve %4,5 sarımsak · ürün kodu 67434 · EAN 5900469674345 · günde birkaç kez küçük porsiyonlarla; kullanmadan önce nazikçe çalkalayın"],
  ],"2026-10-21"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/asia-soft-line-",[
    ["Soft Line Asia S 100 ml / 50 g","Asya kökenli hepçil ve etçil balıklar için %39 proteinli yumuşak yavaş batan çubuk tam yem · %14 ringa balığı unu, %1,7 Calanus, %5 böcek larvası unu, %1,5 Ascophyllum nodosum, %1 meyve ve 2.700 mg/kg kırmızı biber özütü · ürün kodu 67713 · EAN 5900469677131 · günde birkaç kez küçük porsiyonlarla; kullanmadan önce nazikçe çalkalayın"],
    ["Soft Line Asia S 250 ml / 125 g","Asya kökenli hepçil ve etçil balıklar için %39 proteinli yumuşak yavaş batan çubuk tam yem · %14 ringa balığı unu, %1,7 Calanus, %5 böcek larvası unu, %1,5 Ascophyllum nodosum, %1 meyve ve 2.700 mg/kg kırmızı biber özütü · ürün kodu 67714 · EAN 5900469677148 · günde birkaç kez küçük porsiyonlarla; kullanmadan önce nazikçe çalkalayın"],
  ],"2026-10-21"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/asia-soft-line-m",[
    ["Soft Line Asia M 100 ml / 60 g","Asya kökenli hepçil ve etçil balıklar için %39 proteinli yumuşak yavaş batan granül tam yem · %14 ringa balığı unu, %1,7 Calanus, %5 böcek larvası unu, %1,5 Ascophyllum nodosum, %1 meyve ve 2.700 mg/kg kırmızı biber özütü · ürün kodu 67733 · EAN 5900469677339 · günde birkaç kez küçük porsiyonlarla; kullanmadan önce nazikçe çalkalayın"],
    ["Soft Line Asia M 250 ml / 150 g","Asya kökenli hepçil ve etçil balıklar için %39 proteinli yumuşak yavaş batan granül tam yem · %14 ringa balığı unu, %1,7 Calanus, %5 böcek larvası unu, %1,5 Ascophyllum nodosum, %1 meyve ve 2.700 mg/kg kırmızı biber özütü · ürün kodu 67734 · EAN 5900469677346 · günde birkaç kez küçük porsiyonlarla; kullanmadan önce nazikçe çalkalayın"],
  ],"2026-10-21"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/betta-soft-line-",[
    ["Soft Line Betta 5 g sachet","Betta ve diğer küçük labirent balıkları için %38 proteinli yumuşak yavaş batan mini granül tam yem · %14 ringa balığı unu, %1,7 Calanus, %5 böcek larvası unu, %1,5 Ascophyllum nodosum, %1 meyve ve 2.700 mg/kg kırmızı biber özütü · ürün kodu 67761 · EAN 5900469677612 · günde birkaç kez küçük porsiyonlarla; kullanmadan önce nazikçe çalkalayın"],
  ],"2026-10-21"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/arowana-size-l",[
    ["Soft Line Arowana L 100 ml / 32 g","Genç arowanalar için %41 proteinli yumuşak yüzen çubuk tam yem · %12 bütün karides unu, %10 krill, %6 kalamar, %1,7 Calanus, %5 böcek larvası unu, %3 meyve ve 3.000 mg/kg kırmızı biber özütü · ürün kodu 67333 · EAN 5900469673331 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlarla; kullanmadan önce nazikçe çalkalayın"],
    ["Soft Line Arowana L 250 ml / 80 g","Genç arowanalar için %41 proteinli yumuşak yüzen çubuk tam yem · %12 bütün karides unu, %10 krill, %6 kalamar, %1,7 Calanus, %5 böcek larvası unu, %3 meyve ve 3.000 mg/kg kırmızı biber özütü · ürün kodu 67334 · EAN 5900469673348 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlarla; kullanmadan önce nazikçe çalkalayın"],
  ],"2026-10-21"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/arowana-soft-line",[
    ["Soft Line Arowana XXL 250 ml / 80 g","Yetişkin arowanalar için %40,5 proteinli yumuşak yüzen çubuk tam yem · %12 bütün karides unu, %10 krill, %6 kalamar, %1,7 Calanus, %5 böcek larvası unu, %3 meyve ve 3.000 mg/kg kırmızı biber özütü · ürün kodu 67354 · EAN 5900469673546 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlarla; kullanmadan önce nazikçe çalkalayın"],
    ["Soft Line Arowana XXL 1000 ml / 320 g","Yetişkin arowanalar için %40,5 proteinli yumuşak yüzen çubuk tam yem · %12 bütün karides unu, %10 krill, %6 kalamar, %1,7 Calanus, %5 böcek larvası unu, %3 meyve ve 3.000 mg/kg kırmızı biber özütü · ürün kodu 67356 · EAN 5900469673560 · günde birkaç kez, birkaç dakikada tüketilecek küçük porsiyonlarla; kullanmadan önce nazikçe çalkalayın"],
  ],"2026-10-21"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/gel-formula-for-omnivorous-fish",[
    ["Gel Formula For Omnivorous Fish 35 g sachet","Hepçil balıklar için %8,5 alg, %3 krill, %3,5 sarımsak ve %2 meyveli; suyla hazırlanıp yüzen veya batan jele dönüşen toz tam yem · ürün kodu 61731 · EAN 5900469617311 · toz hali balığa doğrudan verilmemeli; hazırlanmış ürün buzdolabında en fazla 5 gün"],
    ["Gel Formula For Omnivorous Fish 1000 ml / 3 × 35 g","Hepçil balıklar için %8,5 alg, %3 krill, %3,5 sarımsak ve %2 meyveli; suyla hazırlanıp yüzen veya batan jele dönüşen üç saşelik set · ürün kodu 61736 · EAN 5900469617366 · toz hali balığa doğrudan verilmemeli; hazırlanmış ürün buzdolabında en fazla 5 gün"],
  ],"2026-10-12"),
  ...products("Tropical","food","https://tropical.pl/upload/files/katalog_produktow_2016.pdf",[
    ["Super Spirulina Forte Micro Granulat 22 g","Yavru ile küçük tatlı su ve deniz balıkları için %36 Spirulina platensis içeren 500 µm'den küçük ekstrüde mikrogranül bitkisel yem · ürün kodu 67012 · EAN 5900469670125 · güncel resmî ürün dizininde geçici olarak satışta değil"],
  ],"2026-10-22"),
  ...products("Tropical","fertilizer","https://tropical.pl/tropical/product/aqua-plant",[
    ["Aqua Plant 30 ml","Balık yükü düşük bitkili akvaryumlar için NPK makro besin gübresi · 10 ml'de 110 mg azot, 10 mg fosfor ve 160 mg potasyum · her su değişiminde 10 ml / 100 L; doz bitki gelişimi gözlenerek ayarlanabilir · karidesler için güvenli olarak yayımlanmıştır, hassas tür ve varyetelerde dikkat gerekir · ürün kodu 33111 · EAN 5900469331118"],
    ["Aqua Plant 100 ml","Balık yükü düşük bitkili akvaryumlar için NPK makro besin gübresi · 10 ml'de 110 mg azot, 10 mg fosfor ve 160 mg potasyum · her su değişiminde 10 ml / 100 L; doz bitki gelişimi gözlenerek ayarlanabilir · karidesler için güvenli olarak yayımlanmıştır, hassas tür ve varyetelerde dikkat gerekir · ürün kodu 33114 · EAN 5900469331149"],
    ["Aqua Plant 250 ml","Balık yükü düşük bitkili akvaryumlar için NPK makro besin gübresi · 10 ml'de 110 mg azot, 10 mg fosfor ve 160 mg potasyum · her su değişiminde 10 ml / 100 L; doz bitki gelişimi gözlenerek ayarlanabilir · karidesler için güvenli olarak yayımlanmıştır, hassas tür ve varyetelerde dikkat gerekir · ürün kodu 33116 · EAN 5900469331163"],
    ["Aqua Plant 2 L","Balık yükü düşük bitkili akvaryumlar için NPK makro besin gübresi · 10 ml'de 110 mg azot, 10 mg fosfor ve 160 mg potasyum · her su değişiminde 10 ml / 100 L; doz bitki gelişimi gözlenerek ayarlanabilir · karidesler için güvenli olarak yayımlanmıştır, hassas tür ve varyetelerde dikkat gerekir · ürün kodu 33118 · EAN 2010000022450"],
  ],"2026-10-22"),
  ...products("Tropical","fertilizer","https://tropical.pl/tropical/product/Multimineral",[
    ["Multimineral 30 ml","Demir, çinko, bakır, bor, mangan, kobalt ve molibden içeren iz element desteği; bitkili/üretim akvaryumları, aktif karbon sonrası ve RO/distile su zenginleştirmesi için · her su değişiminde 10 ml / 100 L · karidesler için güvenli olarak yayımlanmıştır, hassas tür ve varyetelerde dikkat gerekir · ürün kodu 34071 · EAN 5900469340714"],
    ["Multimineral 100 ml","Demir, çinko, bakır, bor, mangan, kobalt ve molibden içeren iz element desteği; bitkili/üretim akvaryumları, aktif karbon sonrası ve RO/distile su zenginleştirmesi için · her su değişiminde 10 ml / 100 L · karidesler için güvenli olarak yayımlanmıştır, hassas tür ve varyetelerde dikkat gerekir · ürün kodu 34074 · EAN 5900469340745"],
  ],"2026-10-22"),
  ...products("Tropical","fertilizer","https://tropical.pl/tropical/product/aquaflorin-potassium",[
    ["Aquaflorin Potassium 30 ml","Azot ve fosfor içermeyen potasyum/mikro element gübresi; potasyum eksikliği, yeni kurulum veya balık yükü yüksek bitkili akvaryumlar için · 10 ml'de 130 mg potasyum ve yayımlanan iz elementler · her su değişiminde 10 ml / 100 L; doz bitki gelişimi gözlenerek ayarlanabilir · hassas karideslerde dikkat gerekir · ürün kodu 33041 · EAN 5900469330418"],
    ["Aquaflorin Potassium 100 ml","Azot ve fosfor içermeyen potasyum/mikro element gübresi; potasyum eksikliği, yeni kurulum veya balık yükü yüksek bitkili akvaryumlar için · 10 ml'de 130 mg potasyum ve yayımlanan iz elementler · her su değişiminde 10 ml / 100 L; doz bitki gelişimi gözlenerek ayarlanabilir · hassas karideslerde dikkat gerekir · ürün kodu 33044 · EAN 5900469330449"],
    ["Aquaflorin Potassium 250 ml","Azot ve fosfor içermeyen potasyum/mikro element gübresi; potasyum eksikliği, yeni kurulum veya balık yükü yüksek bitkili akvaryumlar için · 10 ml'de 130 mg potasyum ve yayımlanan iz elementler · her su değişiminde 10 ml / 100 L; doz bitki gelişimi gözlenerek ayarlanabilir · hassas karideslerde dikkat gerekir · ürün kodu 33045 · EAN 5900469330456"],
    ["Aquaflorin Potassium 500 ml","Azot ve fosfor içermeyen potasyum/mikro element gübresi; potasyum eksikliği, yeni kurulum veya balık yükü yüksek bitkili akvaryumlar için · 10 ml'de 130 mg potasyum ve yayımlanan iz elementler · her su değişiminde 10 ml / 100 L; doz bitki gelişimi gözlenerek ayarlanabilir · hassas karideslerde dikkat gerekir · ürün kodu 33046 · EAN 5900469330463"],
    ["Aquaflorin Potassium 2 L","Azot ve fosfor içermeyen potasyum/mikro element gübresi; potasyum eksikliği, yeni kurulum veya balık yükü yüksek bitkili akvaryumlar için · 10 ml'de 130 mg potasyum ve yayımlanan iz elementler · her su değişiminde 10 ml / 100 L; doz bitki gelişimi gözlenerek ayarlanabilir · hassas karideslerde dikkat gerekir · ürün kodu 33048 · EAN 5900469330487"],
  ],"2026-10-22"),
  ...products("Tropical","fertilizer","https://tropical.pl/tropical/product/ferro-aktiv",[
    ["Ferro-Aktiv 30 ml","Su bitkileri için biyoyararlanılabilir şelatlı demir gübresi · 10 ml'de 16 mg demir · her su değişiminde 10 ml / 100 L; doz bitki gelişimi gözlenerek ayarlanabilir · karidesler için güvenli olarak yayımlanmıştır, hassas tür ve varyetelerde dikkat gerekir · ürün kodu 33021 · EAN 5900469330210"],
    ["Ferro-Aktiv 500 ml","Su bitkileri için biyoyararlanılabilir şelatlı demir gübresi · 10 ml'de 16 mg demir · her su değişiminde 10 ml / 100 L; doz bitki gelişimi gözlenerek ayarlanabilir · karidesler için güvenli olarak yayımlanmıştır, hassas tür ve varyetelerde dikkat gerekir · ürün kodu 33026 · EAN 5900469330265"],
    ["Ferro-Aktiv 2 L","Su bitkileri için biyoyararlanılabilir şelatlı demir gübresi · 10 ml'de 16 mg demir · her su değişiminde 10 ml / 100 L; doz bitki gelişimi gözlenerek ayarlanabilir · karidesler için güvenli olarak yayımlanmıştır, hassas tür ve varyetelerde dikkat gerekir · ürün kodu 33028 · EAN 2010000023068"],
  ],"2026-10-22"),
  ...products("Tropical","fertilizer","https://tropical.pl/tropical/product/kobaltosan",[
    ["Kobaltosan 30 ml","Tatlı su balıkları ve bitkileri için aktif kobalt iyonu desteği · her su değişiminde 10 ml / 100 L; renk desteği için uygun renk yemleriyle birlikte kullanılabilir · karidesler için güvenli olarak yayımlanmıştır, hassas tür ve varyetelerde dikkat gerekir · ürün kodu 34081 · EAN 5900469340813"],
    ["Kobaltosan 500 ml","Tatlı su balıkları ve bitkileri için aktif kobalt iyonu desteği · her su değişiminde 10 ml / 100 L; renk desteği için uygun renk yemleriyle birlikte kullanılabilir · karidesler için güvenli olarak yayımlanmıştır, hassas tür ve varyetelerde dikkat gerekir · ürün kodu 34086 · EAN 5900469340868"],
    ["Kobaltosan 2 L","Tatlı su balıkları ve bitkileri için aktif kobalt iyonu desteği · her su değişiminde 10 ml / 100 L; renk desteği için uygun renk yemleriyle birlikte kullanılabilir · karidesler için güvenli olarak yayımlanmıştır, hassas tür ve varyetelerde dikkat gerekir · ürün kodu 34088 · EAN 2010000022436"],
  ],"2026-10-22"),
  ...products("Tropical","fertilizer","https://tropical.pl/tropical/product/tropical-carbo",[
    ["Tropical Carbo 100 ml","Su bitkileri için organik karbon gübresi; tek karbon kaynağı olarak veya gaz CO₂ ile birlikte kullanılabilir · günlük 2 ml / 100 L; yoğun ve gelişmiş bitkili tankta hayvanlar gözlenerek en fazla 4 ml / 100 L · önerilen doz aşılmamalı, diğer preparatlar birkaç dakika sonra verilmeli · nadiren oluşan bulanıklık birkaç gün içinde geçebilir · ürün kodu 33064 · EAN 5900469330647"],
    ["Tropical Carbo 500 ml","Su bitkileri için organik karbon gübresi; tek karbon kaynağı olarak veya gaz CO₂ ile birlikte kullanılabilir · günlük 2 ml / 100 L; yoğun ve gelişmiş bitkili tankta hayvanlar gözlenerek en fazla 4 ml / 100 L · önerilen doz aşılmamalı, diğer preparatlar birkaç dakika sonra verilmeli · nadiren oluşan bulanıklık birkaç gün içinde geçebilir · ürün kodu 33066 · EAN 5900469330661"],
    ["Tropical Carbo 2 L","Su bitkileri için organik karbon gübresi; tek karbon kaynağı olarak veya gaz CO₂ ile birlikte kullanılabilir · günlük 2 ml / 100 L; yoğun ve gelişmiş bitkili tankta hayvanlar gözlenerek en fazla 4 ml / 100 L · önerilen doz aşılmamalı, diğer preparatlar birkaç dakika sonra verilmeli · nadiren oluşan bulanıklık birkaç gün içinde geçebilir · ürün kodu 33068 · EAN 5900469330685"],
  ],"2026-10-22"),
  ...products("Tropical","water_conditioner","https://tropical.pl/tropical/product/esklarin",[
    ["Esklarin 30 ml","Yeni kurulum, su değişimi, karantina ve iyileşme dönemlerinde ağır metal tuzlarını nötralize eden aloe özlü musluk suyu düzenleyici · 10 ml / 50 L doz · klor bileşikleriyle dezenfekte edilmiş musluk suyunda Antychlor ile birlikte kullanım önerilir · ürün kodu 34011 · EAN 5900469340110"],
    ["Esklarin 100 ml","Yeni kurulum, su değişimi, karantina ve iyileşme dönemlerinde ağır metal tuzlarını nötralize eden aloe özlü musluk suyu düzenleyici · 10 ml / 50 L doz · klor bileşikleriyle dezenfekte edilmiş musluk suyunda Antychlor ile birlikte kullanım önerilir · ürün kodu 34014 · EAN 5900469340141"],
    ["Esklarin 250 ml","Yeni kurulum, su değişimi, karantina ve iyileşme dönemlerinde ağır metal tuzlarını nötralize eden aloe özlü musluk suyu düzenleyici · 10 ml / 50 L doz · klor bileşikleriyle dezenfekte edilmiş musluk suyunda Antychlor ile birlikte kullanım önerilir · ürün kodu 34015 · EAN 5900469340158"],
    ["Esklarin 500 ml","Yeni kurulum, su değişimi, karantina ve iyileşme dönemlerinde ağır metal tuzlarını nötralize eden aloe özlü musluk suyu düzenleyici · 10 ml / 50 L doz · klor bileşikleriyle dezenfekte edilmiş musluk suyunda Antychlor ile birlikte kullanım önerilir · ürün kodu 34016 · EAN 5900469340165"],
    ["Esklarin 2 L","Yeni kurulum, su değişimi, karantina ve iyileşme dönemlerinde ağır metal tuzlarını nötralize eden aloe özlü musluk suyu düzenleyici · 10 ml / 50 L doz · klor bileşikleriyle dezenfekte edilmiş musluk suyunda Antychlor ile birlikte kullanım önerilir · ürün kodu 34018 · EAN 5900469340189"],
  ],"2026-10-22"),
  ...products("Tropical","water_conditioner","https://tropical.pl/tropical/product/supreme-water-conditioner-with-aloe",[
    ["Supreme 30 ml","Yeni kurulum ve su değişimlerinde kloru ve ağır metal tuzlarını hızla nötralize eden konsantre aloe özlü musluk suyu düzenleyici · 1 ml (yaklaşık 25 damla) / 50 L ham musluk suyu · ürün kodu 34331 · EAN 5900469343319"],
    ["Supreme 100 ml","Yeni kurulum ve su değişimlerinde kloru ve ağır metal tuzlarını hızla nötralize eden konsantre aloe özlü musluk suyu düzenleyici · 1 ml (yaklaşık 25 damla) / 50 L ham musluk suyu · ürün kodu 34334 · EAN 5900469343340"],
    ["Supreme 250 ml","Yeni kurulum ve su değişimlerinde kloru ve ağır metal tuzlarını hızla nötralize eden konsantre aloe özlü musluk suyu düzenleyici · 1 ml (yaklaşık 25 damla) / 50 L ham musluk suyu · ürün kodu 34335 · EAN 5900469343357"],
    ["Supreme 500 ml","Yeni kurulum ve su değişimlerinde kloru ve ağır metal tuzlarını hızla nötralize eden konsantre aloe özlü musluk suyu düzenleyici · 1 ml (yaklaşık 25 damla) / 50 L ham musluk suyu · ürün kodu 34336 · EAN 5900469343364"],
  ],"2026-10-22"),
  ...products("Tropical","water_conditioner","https://tropical.pl/tropical/product/ecoclar-krystalicznie-czysta-woda",[
    ["Ecoclar 250 ml","Tatlı su akvaryumlarında bulanıklık, koku, renklenme, organik/kimyasal kir ve amonyum iyonlarını doğal mineral süspansiyonuyla bağlayan su berraklaştırıcı · 20 ml / 100 L; uygulama sonrası doğal bulanıklık 24 saate kadar sürebilir · başka preparatlarla aynı anda kullanılmamalı, en az bir gün beklenmeli · ürün kodu 34365 · EAN 5900469343654"],
    ["Ecoclar 500 ml","Tatlı su akvaryumlarında bulanıklık, koku, renklenme, organik/kimyasal kir ve amonyum iyonlarını doğal mineral süspansiyonuyla bağlayan su berraklaştırıcı · 20 ml / 100 L; uygulama sonrası doğal bulanıklık 24 saate kadar sürebilir · başka preparatlarla aynı anda kullanılmamalı, en az bir gün beklenmeli · ürün kodu 34366 · EAN 5900469343661"],
  ],"2026-10-22"),
  ...products("Tropical","water_conditioner","https://tropical.pl/tropical/product/bacto-active",[
    ["Bacto-Active 30 ml","Organik maddeyi parçalayan canlı bakteri kültürü; yeni/olgun akvaryumlarda, su değişimi, filtre temizliği veya tedavi sonrası biyolojik dengeyi destekler · olgunlaşmamış akvaryumda 5 ml / 75 L haftada bir, 3 hafta; olgun akvaryumda 5 ml / 45 L ayda bir · uygulamada UV kapatılmalı · ürün kodu 34301 · EAN 5900469343012"],
    ["Bacto-Active 100 ml","Organik maddeyi parçalayan canlı bakteri kültürü; yeni/olgun akvaryumlarda, su değişimi, filtre temizliği veya tedavi sonrası biyolojik dengeyi destekler · olgunlaşmamış akvaryumda 5 ml / 75 L haftada bir, 3 hafta; olgun akvaryumda 5 ml / 45 L ayda bir · uygulamada UV kapatılmalı · ürün kodu 34304 · EAN 5900469343043"],
    ["Bacto-Active 250 ml","Organik maddeyi parçalayan canlı bakteri kültürü; yeni/olgun akvaryumlarda, su değişimi, filtre temizliği veya tedavi sonrası biyolojik dengeyi destekler · olgunlaşmamış akvaryumda 5 ml / 75 L haftada bir, 3 hafta; olgun akvaryumda 5 ml / 45 L ayda bir · uygulamada UV kapatılmalı · ürün kodu 34305 · EAN 5900469343050"],
    ["Bacto-Active 2 L","Organik maddeyi parçalayan canlı bakteri kültürü; yeni/olgun akvaryumlarda, su değişimi, filtre temizliği veya tedavi sonrası biyolojik dengeyi destekler · olgunlaşmamış akvaryumda 5 ml / 75 L haftada bir, 3 hafta; olgun akvaryumda 5 ml / 45 L ayda bir · uygulamada UV kapatılmalı · ürün kodu 34308 · EAN 5900469343081"],
  ],"2026-10-22"),
  ...products("Tropical","water_conditioner","https://tropical.pl/tropical/product/tropical-nitri-active",[
    ["Nitri-Active 30 ml","Her 1 ml'de 100 milyon nitrifikasyon/denitrifikasyon bakteri hücresi içeren biyolojik döngü desteği · yeni kurulum veya tedavi sonrası 20 ml / 100 L haftada bir, 3 hafta; olgun akvaryumda 10 ml / 100 L haftada bir · uygulamada UV kapatılmalı · ürün kodu 34371 · EAN 5900469343715"],
    ["Nitri-Active 100 ml","Her 1 ml'de 100 milyon nitrifikasyon/denitrifikasyon bakteri hücresi içeren biyolojik döngü desteği · yeni kurulum veya tedavi sonrası 20 ml / 100 L haftada bir, 3 hafta; olgun akvaryumda 10 ml / 100 L haftada bir · uygulamada UV kapatılmalı · ürün kodu 34374 · EAN 5900469343746"],
    ["Nitri-Active 250 ml","Her 1 ml'de 100 milyon nitrifikasyon/denitrifikasyon bakteri hücresi içeren biyolojik döngü desteği · yeni kurulum veya tedavi sonrası 20 ml / 100 L haftada bir, 3 hafta; olgun akvaryumda 10 ml / 100 L haftada bir · uygulamada UV kapatılmalı · ürün kodu 34375 · EAN 5900469343753"],
  ],"2026-10-22"),
  ...products("Tropical","water_conditioner","https://tropical.pl/tropical/product/antychlor",[
    ["Antychlor 30 ml","Yeni kurulum ve su değişimlerinde ham musluk suyundaki kloru anında nötralize eden su düzenleyici · 10 ml / 100 L ham musluk suyu; su hedef sıcaklığa getirilmeli, yoğun havalandırılmalı ve filtrelenmeli · ürün kodu 34061 · EAN 5900469340615"],
    ["Antychlor 100 ml","Yeni kurulum ve su değişimlerinde ham musluk suyundaki kloru anında nötralize eden su düzenleyici · 10 ml / 100 L ham musluk suyu; su hedef sıcaklığa getirilmeli, yoğun havalandırılmalı ve filtrelenmeli · ürün kodu 34064 · EAN 5900469340646"],
    ["Antychlor 2 L","Yeni kurulum ve su değişimlerinde ham musluk suyundaki kloru anında nötralize eden su düzenleyici · 10 ml / 100 L ham musluk suyu; su hedef sıcaklığa getirilmeli, yoğun havalandırılmalı ve filtrelenmeli · ürün kodu 34068 · EAN 5900469340684"],
  ],"2026-10-22"),
  ...products("Tropical","water_conditioner","https://tropical.pl/tropical/product/shrimp-guard-30ml",[
    ["Shrimp Guard 30 ml","Tatlı su karidesleri ve diğer kabuklular için ağır metal tuzlarını nötralize eden, inozitol ve D-pantenollü su düzenleyici · yeni kurulum, su değişimi ve kabuk değiştirme döneminde 10 ml / 50 L · klor bileşikleriyle dezenfekte edilmiş musluk suyunda Antychlor ile birlikte kullanım önerilir · ürün kodu 34221 · EAN 5900469342213"],
  ],"2026-10-22"),
  ...products("Tropical","water_conditioner","https://tropical.pl/tropical/product/aquacid-ph-minus",[
    ["Aquacid pH Minus 30 ml","Genel ve üretim akvaryumlarında pH ile KH'yi düşüren, fosforik asit içermeyen su düzenleyici · canlı bulunan tankta sürekli karıştırma ve pH testiyle kademeli kullanılmalı; günlük değişim 0,2–0,3 pH değerini aşmamalı · güvenlik için akvaryuma doğrudan değil değişim suyuna dozlanması önerilir · ürün kodu 34031 · EAN 5900469340318"],
    ["Aquacid pH Minus 500 ml","Genel ve üretim akvaryumlarında pH ile KH'yi düşüren, fosforik asit içermeyen su düzenleyici · canlı bulunan tankta sürekli karıştırma ve pH testiyle kademeli kullanılmalı; günlük değişim 0,2–0,3 pH değerini aşmamalı · güvenlik için akvaryuma doğrudan değil değişim suyuna dozlanması önerilir · ürün kodu 34036 · EAN 5900469340363"],
  ],"2026-10-22"),
  ...products("Tropical","water_conditioner","https://tropical.pl/tropical/product/aqua-alkal-ph-plus",[
    ["Aqua-Alkal pH Plus 30 ml","Genel ve üretim akvaryumlarında asitleri nötralize ederek pH ile KH'yi yükselten su düzenleyici · canlı bulunan tankta sürekli karıştırma ve pH testiyle kademeli kullanılmalı; günlük değişim 0,2–0,3 pH değerini aşmamalı · güvenlik için akvaryuma doğrudan değil değişim suyuna dozlanması önerilir · ürün kodu 34021 · EAN 5900469340219"],
    ["Aqua-Alkal pH Plus 500 ml","Genel ve üretim akvaryumlarında asitleri nötralize ederek pH ile KH'yi yükselten su düzenleyici · canlı bulunan tankta sürekli karıştırma ve pH testiyle kademeli kullanılmalı; günlük değişim 0,2–0,3 pH değerini aşmamalı · güvenlik için akvaryuma doğrudan değil değişim suyuna dozlanması önerilir · ürün kodu 34026 · EAN 5900469340264"],
    ["Aqua-Alkal pH Plus 2 L","Genel ve üretim akvaryumlarında asitleri nötralize ederek pH ile KH'yi yükselten su düzenleyici · canlı bulunan tankta sürekli karıştırma ve pH testiyle kademeli kullanılmalı; günlük değişim 0,2–0,3 pH değerini aşmamalı · güvenlik için akvaryuma doğrudan değil değişim suyuna dozlanması önerilir · ürün kodu 34028 · EAN 5900469340288"],
  ],"2026-10-22"),
  ...products("Tropical","water_conditioner","https://tropical.pl/tropical/product/ketapang-extract",[
    ["Ketapang Extract 30 ml","Terminalia catappa yaprak özütüyle balık ve karidesler için siyah su koşullarını destekleyen sıvı düzenleyici · 10 ml / 50 L veya istenen renklenmeye ulaşana kadar; su değişimi, taşıma ve yeni tanka alışma dönemlerinde kullanılır · sert suda etkili değildir; yumuşak ve hafif asidik suda kullanılmalı, yararlı filtre bakterilerine zarar vermez · ürün kodu 34321 · EAN 5900469343210"],
    ["Ketapang Extract 250 ml","Terminalia catappa yaprak özütüyle balık ve karidesler için siyah su koşullarını destekleyen sıvı düzenleyici · 10 ml / 50 L veya istenen renklenmeye ulaşana kadar; su değişimi, taşıma ve yeni tanka alışma dönemlerinde kullanılır · sert suda etkili değildir; yumuşak ve hafif asidik suda kullanılmalı, yararlı filtre bakterilerine zarar vermez · ürün kodu 34325 · EAN 5900469343258"],
    ["Ketapang Extract 2 L","Terminalia catappa yaprak özütüyle balık ve karidesler için siyah su koşullarını destekleyen sıvı düzenleyici · 10 ml / 50 L veya istenen renklenmeye ulaşana kadar; su değişimi, taşıma ve yeni tanka alışma dönemlerinde kullanılır · sert suda etkili değildir; yumuşak ve hafif asidik suda kullanılmalı, yararlı filtre bakterilerine zarar vermez · ürün kodu 34328 · EAN 5900469343289"],
  ],"2026-10-22"),
  ...products("Tropical","water_conditioner","https://tropical.pl/tropical/product/QUEREX",[
    ["Querex 30 ml","Meşe kabuğu özütünden doğal tanen sağlayarak siyah su koşullarını destekleyen sıvı düzenleyici · 10 ml / 100 L veya istenen renklenmeye ulaşana kadar; su değişimi, taşıma ve yeni tanka alışma dönemlerinde kullanılır · sert suda etkili değildir; yumuşak ve hafif asidik suda kullanılmalı, yararlı filtre bakterilerine zarar vermez · ürün kodu 34051 · EAN 5900469340516"],
    ["Querex 500 ml","Meşe kabuğu özütünden doğal tanen sağlayarak siyah su koşullarını destekleyen sıvı düzenleyici · 10 ml / 100 L veya istenen renklenmeye ulaşana kadar; su değişimi, taşıma ve yeni tanka alışma dönemlerinde kullanılır · sert suda etkili değildir; yumuşak ve hafif asidik suda kullanılmalı, yararlı filtre bakterilerine zarar vermez · ürün kodu 34056 · EAN 5900469340561"],
  ],"2026-10-22"),
  ...products("Tropical","water_conditioner","https://tropical.pl/tropical/product/torfin-complex",[
    ["Torfin Complex 30 ml","Yüksek bataklık torfu özütünden tanen ve hümik asit sağlayarak siyah su koşullarını destekleyen sıvı düzenleyici · 10 ml / 100 L veya istenen renklenmeye ulaşana kadar; su değişimi, taşıma ve yeni tanka alışma dönemlerinde kullanılır · sert suda etkili değildir; yumuşak ve hafif asidik suda kullanılmalı, yararlı filtre bakterilerine zarar vermez · ürün kodu 34041 · EAN 5900469340417"],
    ["Torfin Complex 500 ml","Yüksek bataklık torfu özütünden tanen ve hümik asit sağlayarak siyah su koşullarını destekleyen sıvı düzenleyici · 10 ml / 100 L veya istenen renklenmeye ulaşana kadar; su değişimi, taşıma ve yeni tanka alışma dönemlerinde kullanılır · sert suda etkili değildir; yumuşak ve hafif asidik suda kullanılmalı, yararlı filtre bakterilerine zarar vermez · ürün kodu 34046 · EAN 5900469340462"],
  ],"2026-10-22"),
  ...products("Tropical","water_conditioner","https://tropical.pl/tropical/product/Blacklarin",[
    ["Blacklarin 30 ml","Ham musluk suyundaki ağır metal tuzlarını nötralize eden torf özlü siyah su biyotopu düzenleyicisi · yeni kurulum, su değişimi, karantina ve yeni tanka alışma dönemlerinde 10 ml / 50 L ham su · orta sert ve yumuşak su içindir; suyu hafif saman rengine boyar fakat pH'ı düşürmez · diğer preparatlar birkaç dakika sonra eklenmeli · ürün kodu 34311 · EAN 5900469343128"],
  ],"2026-10-22"),
  ...products("Tropical","water_conditioner","https://tropical.pl/tropical/product/Ketapang",[
    ["Ketapang 6 × 5 g sachet","Terminalia catappa kurutulmuş ve parçalanmış yapraklarını içeren altı adet 5 g saşe · bir saşe 150–200 L su için doğrudan akvaryuma veya filtreye yerleştirilir ve iki hafta sonra değiştirilir · tanen ve hümik asit sağlar, pH'ı hafifçe düşürebilir; uygulamadan sonra suyun kimyasına bağlı geçici bulanıklık genellikle üç gün içinde geçer · ürün kodu 34001 · EAN 5900469340011"],
  ],"2026-10-22"),
  ...products("Tropical","treatment","https://tropical.pl/tropical/product/chloramina",[
    ["Chloramina 30 ml","Karantina/üretim ekipmanı ve çıplak tank dezenfeksiyonu için 5.000 mg / 100 ml Chloramine-T içeren sıvı preparat · canlıların rutin bakım ürünü değildir: tabansız karantina akvaryumunda 10 ml / 100 L ile yaklaşık 24 saatlik banyo; ekipman ve ağlarda 10 ml / 2 L · Antychlor ile 1:1 oranında nötralize edilir, başka akvaryum preparatlarıyla aynı anda kullanılmaz · ürün kodu 32011 · EAN 5900469320112"],
  ],"2026-10-22"),
  ...products("Tropical","treatment","https://tropical.pl/tropical/product/algin",[
    ["Algin 30 ml","Yeşil yosun gelişimini sınırlamak için 100 ml'de 300 mg bakır sülfat pentahidrat içeren preparat · 7 günde bir 10 ml / 100 L; aydınlatma/besin dengesi, su testi, su değişimi, dip çekimi, filtre bakımı, stok ve yemleme kontrolünün yerine geçmez · yumurta, yeni çıkmış larva, genç yavru veya kabuklu bulunan akvaryumlarda kullanılmaz · ürün kodu 33031 · EAN 5900469330319"],
    ["Algin 100 ml","Yeşil yosun gelişimini sınırlamak için 100 ml'de 300 mg bakır sülfat pentahidrat içeren preparat · 7 günde bir 10 ml / 100 L; aydınlatma/besin dengesi, su testi, su değişimi, dip çekimi, filtre bakımı, stok ve yemleme kontrolünün yerine geçmez · yumurta, yeni çıkmış larva, genç yavru veya kabuklu bulunan akvaryumlarda kullanılmaz · ürün kodu 33034 · EAN 5900469330340"],
    ["Algin 250 ml","Yeşil yosun gelişimini sınırlamak için 100 ml'de 300 mg bakır sülfat pentahidrat içeren preparat · 7 günde bir 10 ml / 100 L; aydınlatma/besin dengesi, su testi, su değişimi, dip çekimi, filtre bakımı, stok ve yemleme kontrolünün yerine geçmez · yumurta, yeni çıkmış larva, genç yavru veya kabuklu bulunan akvaryumlarda kullanılmaz · ürün kodu 33035 · EAN 5900469330357"],
    ["Algin 500 ml","Yeşil yosun gelişimini sınırlamak için 100 ml'de 300 mg bakır sülfat pentahidrat içeren preparat · 7 günde bir 10 ml / 100 L; aydınlatma/besin dengesi, su testi, su değişimi, dip çekimi, filtre bakımı, stok ve yemleme kontrolünün yerine geçmez · yumurta, yeni çıkmış larva, genç yavru veya kabuklu bulunan akvaryumlarda kullanılmaz · ürün kodu 33036 · EAN 5900469330364"],
    ["Algin 2 L","Yeşil yosun gelişimini sınırlamak için 100 ml'de 300 mg bakır sülfat pentahidrat içeren preparat · 7 günde bir 10 ml / 100 L; aydınlatma/besin dengesi, su testi, su değişimi, dip çekimi, filtre bakımı, stok ve yemleme kontrolünün yerine geçmez · yumurta, yeni çıkmış larva, genç yavru veya kabuklu bulunan akvaryumlarda kullanılmaz · ürün kodu 33038 · EAN 5900469330388"],
  ],"2026-10-22"),
  ...products("Tropical","treatment","https://tropical.pl/tropical/product/bactosan",[
    ["Bactosan 30 ml","Filtrasyon sorunu, aşırı yemleme veya yeni tank dengesizliğine bağlı biyolojik bulanıklığı gidermeye yönelik su bakım preparatı · 10 ml / 100 L; bulanıklık geçene kadar her gün %20–30 su değişimi ve değişen suya orantılı yeniden doz gerekir, bu sırada yemleme azaltılır veya durdurulur · beş günden uzun süren ya da tekrarlayan bulanıklıkta sistem nedeni araştırılmalı; diğer mor grup preparatlarla birleştirilmez · ürün kodu 34391 · EAN 5900469343913"],
    ["Bactosan 100 ml","Filtrasyon sorunu, aşırı yemleme veya yeni tank dengesizliğine bağlı biyolojik bulanıklığı gidermeye yönelik su bakım preparatı · 10 ml / 100 L; bulanıklık geçene kadar her gün %20–30 su değişimi ve değişen suya orantılı yeniden doz gerekir, bu sırada yemleme azaltılır veya durdurulur · beş günden uzun süren ya da tekrarlayan bulanıklıkta sistem nedeni araştırılmalı; diğer mor grup preparatlarla birleştirilmez · ürün kodu 34394 · EAN 5900469343944"],
    ["Bactosan 250 ml","Filtrasyon sorunu, aşırı yemleme veya yeni tank dengesizliğine bağlı biyolojik bulanıklığı gidermeye yönelik su bakım preparatı · 10 ml / 100 L; bulanıklık geçene kadar her gün %20–30 su değişimi ve değişen suya orantılı yeniden doz gerekir, bu sırada yemleme azaltılır veya durdurulur · beş günden uzun süren ya da tekrarlayan bulanıklıkta sistem nedeni araştırılmalı; diğer mor grup preparatlarla birleştirilmez · ürün kodu 34395 · EAN 5900469343951"],
    ["Bactosan 2 L","Filtrasyon sorunu, aşırı yemleme veya yeni tank dengesizliğine bağlı biyolojik bulanıklığı gidermeye yönelik su bakım preparatı · 10 ml / 100 L; bulanıklık geçene kadar her gün %20–30 su değişimi ve değişen suya orantılı yeniden doz gerekir, bu sırada yemleme azaltılır veya durdurulur · beş günden uzun süren ya da tekrarlayan bulanıklıkta sistem nedeni araştırılmalı; diğer mor grup preparatlarla birleştirilmez · ürün kodu 34398 · EAN 2010000022627"],
  ],"2026-10-22"),
  ...products("Tropical","treatment","https://tropical.pl/tropical/product/ichtio",[
    ["Ichtio 30 ml","Ichthyophthirius multifiliis kaynaklı beyaz benek belirtilerinde üreticinin yayımladığı uzun banyo preparatı; kesin tanı veya her tür için otomatik sıcaklık önerisi değildir · 7–14 gün 10 ml / 100 L; üçüncü gün %20 su değişimi sonrası 5 ml / 100 L, işlem iki kez daha yinelenir · üretici protokolü 27–30 °C ve güçlü havalandırma ister; uygulamadan önce tür sıcaklık toleransı doğrulanmalı · bitişte düzenli su değişimi ve Coco Carb ile aktif karbon filtrasyonu; diğer mor grup preparatlarla birleştirilmez · ürün kodu 32131 · EAN 5900469321317"],
    ["Ichtio 100 ml","Ichthyophthirius multifiliis kaynaklı beyaz benek belirtilerinde üreticinin yayımladığı uzun banyo preparatı; kesin tanı veya her tür için otomatik sıcaklık önerisi değildir · 7–14 gün 10 ml / 100 L; üçüncü gün %20 su değişimi sonrası 5 ml / 100 L, işlem iki kez daha yinelenir · üretici protokolü 27–30 °C ve güçlü havalandırma ister; uygulamadan önce tür sıcaklık toleransı doğrulanmalı · bitişte düzenli su değişimi ve Coco Carb ile aktif karbon filtrasyonu; diğer mor grup preparatlarla birleştirilmez · ürün kodu 32134 · EAN 5900469321348"],
    ["Ichtio 500 ml","Ichthyophthirius multifiliis kaynaklı beyaz benek belirtilerinde üreticinin yayımladığı uzun banyo preparatı; kesin tanı veya her tür için otomatik sıcaklık önerisi değildir · 7–14 gün 10 ml / 100 L; üçüncü gün %20 su değişimi sonrası 5 ml / 100 L, işlem iki kez daha yinelenir · üretici protokolü 27–30 °C ve güçlü havalandırma ister; uygulamadan önce tür sıcaklık toleransı doğrulanmalı · bitişte düzenli su değişimi ve Coco Carb ile aktif karbon filtrasyonu; diğer mor grup preparatlarla birleştirilmez · ürün kodu 32136 · EAN 5900469321362"],
    ["Ichtio 2 L","Ichthyophthirius multifiliis kaynaklı beyaz benek belirtilerinde üreticinin yayımladığı uzun banyo preparatı; kesin tanı veya her tür için otomatik sıcaklık önerisi değildir · 7–14 gün 10 ml / 100 L; üçüncü gün %20 su değişimi sonrası 5 ml / 100 L, işlem iki kez daha yinelenir · üretici protokolü 27–30 °C ve güçlü havalandırma ister; uygulamadan önce tür sıcaklık toleransı doğrulanmalı · bitişte düzenli su değişimi ve Coco Carb ile aktif karbon filtrasyonu; diğer mor grup preparatlarla birleştirilmez · ürün kodu 32138 · EAN 2010000023419"],
  ],"2026-10-22"),
  ...products("Tropical","treatment","https://tropical.pl/tropical/product/cmf/CMF",[
    ["CMF 30 ml","Bakteri, mantar ve Ichthyophthirius multifiliis belirtilerinde geniş uygulamalı destek preparatı; kesin tanı yerine geçmez · 7–14 gün 10 ml / 100 L; üçüncü gün %20 su değişimi sonrası 5 ml / 100 L, işlem iki kez daha yinelenir · üretici protokolü 27–30 °C ve güçlü havalandırma ister; uygulamadan önce tür sıcaklık toleransı doğrulanmalı · bitişte düzenli su değişimi ve Coco Carb ile aktif karbon filtrasyonu; diğer mor grup preparatlarla birleştirilmez · ürün kodu 32181 · EAN 5900469321812"],
    ["CMF 100 ml","Bakteri, mantar ve Ichthyophthirius multifiliis belirtilerinde geniş uygulamalı destek preparatı; kesin tanı yerine geçmez · 7–14 gün 10 ml / 100 L; üçüncü gün %20 su değişimi sonrası 5 ml / 100 L, işlem iki kez daha yinelenir · üretici protokolü 27–30 °C ve güçlü havalandırma ister; uygulamadan önce tür sıcaklık toleransı doğrulanmalı · bitişte düzenli su değişimi ve Coco Carb ile aktif karbon filtrasyonu; diğer mor grup preparatlarla birleştirilmez · ürün kodu 32184 · EAN 5900469321843"],
  ],"2026-10-22"),
  ...products("Tropical","treatment","https://tropical.pl/tropical/product/HEALTHOSAN",[
    ["Healthosan 30 ml","Bakteri, protozoa ve mantar belirtilerinde geniş uygulamalı destek preparatı; kesin tanı yerine geçmez ve hassas bitkilere zarar verebilir · genel akvaryumda 7–14 gün 10 ml / 100 L, üç günde bir %20 su değişimi sonrası 5 ml / 100 L · tabansız ayrı tankta uzun banyo 10 ml / 50 L (6–14 gün) veya kısa banyo 10 ml / 10 L (2–12 saat) · ışık etken maddeyi hızla parçaladığı için uygulamada aydınlatma kapatılır; diğer mor grup preparatlarla birleştirilmez · ürün kodu 32071 · EAN 5900469320716"],
  ],"2026-10-22"),
  ...products("Tropical","treatment","https://tropical.pl/tropical/product/sanital-z-aloesem",[
    ["Sanital 100 ml","Aloe içeren akvaryum tuzu; taşıma/alıştırma sonrası, geniş su değişimleri, biyolojik bulanıklık veya üreticinin belirttiği destek banyoları için · tüm tatlı su canlılarına otomatik uygun değildir; türün tuz toleransı uygulamadan önce doğrulanmalı · genel akvaryum ve su değişiminde 50 L'ye 2 düz çay kaşığı; tabansız karantina tankı veya biyolojik bulanıklıkta 50 L'ye 4 düz çay kaşığı · ürün kodu 80323 · EAN 5900469803233"],
    ["Sanital 500 ml","Aloe içeren akvaryum tuzu; taşıma/alıştırma sonrası, geniş su değişimleri, biyolojik bulanıklık veya üreticinin belirttiği destek banyoları için · tüm tatlı su canlılarına otomatik uygun değildir; türün tuz toleransı uygulamadan önce doğrulanmalı · genel akvaryum ve su değişiminde 50 L'ye 2 düz çay kaşığı; tabansız karantina tankı veya biyolojik bulanıklıkta 50 L'ye 4 düz çay kaşığı · ürün kodu 80325 · EAN 5900469803257"],
    ["Sanital 1000 ml","Aloe içeren akvaryum tuzu; taşıma/alıştırma sonrası, geniş su değişimleri, biyolojik bulanıklık veya üreticinin belirttiği destek banyoları için · tüm tatlı su canlılarına otomatik uygun değildir; türün tuz toleransı uygulamadan önce doğrulanmalı · genel akvaryum ve su değişiminde 50 L'ye 2 düz çay kaşığı; tabansız karantina tankı veya biyolojik bulanıklıkta 50 L'ye 4 düz çay kaşığı · ürün kodu 80326 · EAN 5900469803264"],
    ["Sanital 3 L","Aloe içeren akvaryum tuzu; taşıma/alıştırma sonrası, geniş su değişimleri, biyolojik bulanıklık veya üreticinin belirttiği destek banyoları için · tüm tatlı su canlılarına otomatik uygun değildir; türün tuz toleransı uygulamadan önce doğrulanmalı · genel akvaryum ve su değişiminde 50 L'ye 2 düz çay kaşığı; tabansız karantina tankı veya biyolojik bulanıklıkta 50 L'ye 4 düz çay kaşığı · ürün kodu 80327 · EAN 5900469803271"],
  ],"2026-10-23"),
  ...products("Tropical","treatment","https://tropical.pl/tropical/product/sanital-plus-ketapang",[
    ["Sanital Plus Ketapang 100 ml / 120 g","Terminalia catappa yaprağı ve meşe kabuğu özütleri ile B1 vitamini içeren siyah su/acı su akvaryum tuzu · tüm tatlı su canlılarına otomatik uygun değildir; türün tuz ve su tipi toleransı uygulamadan önce doğrulanmalı · genel akvaryumda 10 g (2 düz çay kaşığı) / 50 L; karantina tankında 20 g (4 düz çay kaşığı) / 50 L · balık davranışı izlenmeli, rahatsızlıkta kısmi su değişimi yapılmalı · RO/distile su mineralizasyonunun yerine geçmez; orta sert ve yumuşak su içindir, pH'ı düşürmez · ürün kodu 80333 · EAN 5900469803332"],
    ["Sanital Plus Ketapang 3 L / 3,6 kg","Terminalia catappa yaprağı ve meşe kabuğu özütleri ile B1 vitamini içeren siyah su/acı su akvaryum tuzu · tüm tatlı su canlılarına otomatik uygun değildir; türün tuz ve su tipi toleransı uygulamadan önce doğrulanmalı · genel akvaryumda 10 g (2 düz çay kaşığı) / 50 L; karantina tankında 20 g (4 düz çay kaşığı) / 50 L · balık davranışı izlenmeli, rahatsızlıkta kısmi su değişimi yapılmalı · RO/distile su mineralizasyonunun yerine geçmez; orta sert ve yumuşak su içindir, pH'ı düşürmez · ürün kodu 80337 · EAN 5900469803370"],
  ],"2026-10-23"),
  ...products("Tropical","food","https://tropical.pl/tropical/product/sol-do-wylegania-artemii",[
    ["Salt for Hatching Artemia 250 ml / 300 g","Artemia salina kistlerini ayrı bir kuluçka kabında çıkarmak için iyotsuz ve salamurayı pH 8'e taşıyan tuz karışımı · yaklaşık 15–20 g / 1 L suyla yalnız kuluçka çözeltisi hazırlanır; tatlı su akvaryumuna bakım tuzu veya mineral düzenleyici olarak dozlanmaz · ürün kodu 80314 · EAN 5900469803141"],
  ],"2026-10-23"),
  ...products("Tropical","test","https://tropical.pl/tropical/product/tropical-6-in-1-test",[
    ["6 in 1 Test","Tatlı su akvaryumu ve havuz için hızlı test şeridi · NO₃, NO₂, GH, KH, pH ve toplam kloru aynı şeritte ölçer · şerit 2–3 saniye suya daldırılır; klor 1 saniye, diğer parametreler 60 saniye sonra okunur · sonuçlar türün kendi gereksinimleriyle değerlendirilmelidir; şerit amonyak veya fosfat ölçmez · ürün kodu 80106 · EAN 5900469801062"],
  ],"2026-10-23"),
  ...products("Tropical","test","https://tropical.pl/tropical/product/test-ph-60-78",[
    ["Test pH 6.0-7.8","Tatlı suda pH 6,0–7,8 aralığını 0,2 pH hassasiyetle ölçen damlalı test · 10 ml örneğe 4 damla reaktif eklenir ve renk skalası gün ışığında üstten okunur · pH düzeltme ürünü değildir; ölçüm sonucuna göre değişiklikler canlı türünün toleransına uygun ve kademeli yapılmalıdır · ürün kodu 80102 · EAN 5900469801024"],
  ],"2026-10-23"),
  ...products("Tropical","test","https://tropical.pl/tropical/product/test-ph-45-95",[
    ["Test pH 4.5-9.5","Tatlı suda pH 4,5–9,5 aralığını 0,5 pH hassasiyetle ölçen geniş aralıklı damlalı test · 5 ml örneğe 4 damla reaktif eklenir ve renk skalası gün ışığında üstten okunur · pH düzeltme ürünü değildir; ölçüm sonucuna göre değişiklikler canlı türünün toleransına uygun ve kademeli yapılmalıdır · ürün kodu 80100 · EAN 5900469801000"],
  ],"2026-10-23"),
  ...products("Tropical","test","https://tropical.pl/tropical/product/test-ghkh",[
    ["Test GH/KH","Tatlı su akvaryumu ve havuzlarda genel sertlik ile karbonat sertliğini 0–30 °dH aralığında titrasyonla ölçer · 5 ml örnekte her damla 1 °dH değerine karşılık gelir; GH kırmızıdan yeşile, KH mordan sarıya renk değişiminde okunur · sonuç türün GH/KH gereksinimleriyle birlikte yorumlanmalıdır · ürün kodu 80103 · EAN 5900469801031"],
  ],"2026-10-23"),
  ...products("Tropical","test","https://tropical.pl/tropical/product/test-no2",[
    ["Test NO2","Tatlı ve deniz suyunda nitriti 0,0–3,3 mg/L aralığında ölçen iki reaktifli damla test · 5 ml örneğe 7 damla A, 15 saniye sonra 7 damla B eklenir; sonuç 10 dakika sonra renk skalasından okunur · üreticiye göre olgun akvaryumda değer sıfıra yakın olmalı, 0,3 mg/L altı güvenli kabul edilir; yüksek sonuç yeni döngü, aşırı stok/yemleme, filtre veya oksijen sorunlarıyla birlikte araştırılmalıdır"],
  ],"2026-10-23"),
  ...products("Tropical","test","https://tropical.pl/tropical/product/test-no3",[
    ["Test NO3","Tatlı ve deniz suyunda nitratı 0–100 mg/L aralığında ölçen üç reaktifli damla test · 5 ml örneğe bir kaşık A, 1 dakika sonra 7 damla B ve ardından 7 damla C eklenir; sonuç 10 dakika sonra renk skalasından okunur · üretici 50 mg/L'nin hassas türlere zarar verebileceğini ve 100 mg/L'yi tehlikeli kabul eder; sonuç tür gereksinimi, kaynak suyu, stok ve bakım düzeniyle birlikte yorumlanmalıdır"],
  ],"2026-10-23"),
  ...products("Tropical","filter_media","https://tropical.pl/tropical/product/coco-carb",[
    ["Coco Carb 1 L","Hindistan cevizi kabuğundan, buharla etkinleştirilmiş aktif karbon · 1 gramda yaklaşık 1100 m² yüzey alanı; suyun rengini ve kokusunu oluşturan organik bileşikleri, ilaç kalıntılarını, kloru ve bazı ağır metal iyonlarını adsorbe eder · mekanik medyadan sonra kullanılmalı; gübre, ilaç, vitamin, torf ve ketapang özleriyle aynı anda kullanılmamalı · tatlı ve deniz suyu için · ürün kodu 81313"],
  ],"2026-10-23"),
  ...products("Tropical","filter_media","https://tropical.pl/tropical/product/carbolit",[
    ["Carbolit 1 L","Aktif hindistan cevizi karbonu ile zeolitin 1:1 karışımı · renk, koku, klor, bazı ağır metal iyonları, amonyum iyonları ve tedavi kalıntılarını bağlamaya yönelik kimyasal filtre medyası · mekanik medyadan sonra kullanılmalı; gübre, ilaç, vitamin, torf ve ketapang özleriyle aynı anda kullanılmamalı · ürün kodu 81314 · EAN 5900469813140"],
  ],"2026-10-23"),
  ...products("Tropical","filter_media","https://tropical.pl/tropical/product/spare-sponge-for-cristal-baby-filter-30-l",[
    ["Spare Sponge for Cristal Baby Filter 30 l","Cristal Baby Filter 30 l için modele özel yedek sünger · 5 × 5 cm, uzunluk 9 cm · bağımsız filtre veya 30 L kapasite sağlayan cihaz değildir · ürün kodu 81211 · EAN 5900469812112"],
  ],"2026-10-23"),
  ...products("Tropical","filter_media","https://tropical.pl/tropical/product/spare-sponge-for-cristal-baby-mini-filter-40-l",[
    ["Spare Sponge for Cristal Mini Filter 40 l","Cristal Mini Filter 40 l için modele özel yedek sünger · 5 × 6 cm, uzunluk 9 cm · bağımsız filtre veya 40 L kapasite sağlayan cihaz değildir · ürün kodu 81212 · EAN 5900469812129"],
  ],"2026-10-23"),
  ...products("Tropical","filter_media","https://tropical.pl/tropical/product/spare-sponge-for-cristal-standard-filter-60-l",[
    ["Spare Sponge for Cristal Standard Filter 60 l","Cristal Standard Filter 60 l için modele özel yedek sünger · 6 × 6 cm, uzunluk 11 cm · bağımsız filtre veya 60 L kapasite sağlayan cihaz değildir · ürün kodu 81215 · EAN 5900469812150"],
  ],"2026-10-23"),
  ...products("Tropical","filter_media","https://tropical.pl/tropical/product/spare-sponge-for-cristal-maxi-filter-100-l",[
    ["Spare Sponge for Cristal Maxi Filter 100 l","Cristal Maxi Filter 100 l için modele özel yedek sünger · 8 × 8 cm, uzunluk 15 cm · bağımsız filtre veya 100 L kapasite sağlayan cihaz değildir · ürün kodu 81216 · EAN 5900469812167"],
  ],"2026-10-23"),
  ...products("Tropical","filter_media","https://tropical.pl/tropical/product/spare-sponge-for-delfin-filter-150-l",[
    ["Spare Sponge for Delfin Single Filter 150 l","Delfin Single Filter 150 l için modele özel yuvarlak yedek sünger · çap 9 cm, uzunluk 17 cm · bağımsız filtre veya 150 L kapasite sağlayan cihaz değildir · ürün kodu 81241 · EAN 5900469812419"],
  ],"2026-10-23"),
  ...products("Tropical","filter_media","https://tropical.pl/tropical/product/filter-medium-pu-f10",[
    ["Filter medium PU-F10 8 × 8 × 15 cm","8 × 8 cm kesitli, 15 cm uzunlukta genel filtre süngeri · bağımsız filtre veya motor değildir; uygun gövde ve su/hava hareketiyle kullanılmalıdır · ürün kodu 81221 · EAN 5900469812211"],
  ],"2026-10-23"),
  ...products("Tropical","filter_media","https://tropical.pl/tropical/product/filter-medium-pu-f30",[
    ["Filter medium PU-F30 Blue 8 × 8 × 15 cm","Mavi, 8 × 8 cm kesitli ve 15 cm uzunlukta genel filtre süngeri · bağımsız filtre veya motor değildir; uygun gövde ve su/hava hareketiyle kullanılmalıdır · ürün kodu 81222 · EAN 5900469812228"],
  ],"2026-10-23"),
  ...products("Tropical","filter_media","https://tropical.pl/upload/files/katalog-produktow-tropical-2026.pdf",[
    ["Filter medium PU-F30 Black 8 × 8 × 15 cm","Siyah, 8 × 8 cm kesitli ve 15 cm uzunlukta genel filtre süngeri · bağımsız filtre veya motor değildir; uygun gövde ve su/hava hareketiyle kullanılmalıdır · ürün kodu 81231"],
    ["Filter medium PU-F45 Black 8 × 8 × 15 cm","Siyah, 8 × 8 cm kesitli ve 15 cm uzunlukta genel filtre süngeri · bağımsız filtre veya motor değildir; uygun gövde ve su/hava hareketiyle kullanılmalıdır · ürün kodu 81232"],
    ["Filter medium PU-F30 Round Blue Ø 9 × 17 cm","Mavi, 9 cm çapında ve 17 cm uzunlukta yuvarlak genel filtre süngeri · bağımsız filtre veya motor değildir; uygun gövde ve su/hava hareketiyle kullanılmalıdır · ürün kodu 81252"],
    ["Filter medium PU-F20 Round Black Ø 9 × 17 cm","Siyah, 9 cm çapında ve 17 cm uzunlukta yuvarlak genel filtre süngeri · 2026 resmî katalog modeli PU-F20 olarak adlandırırken güncel ürün dizini PU-F30 yazar; bu ad çelişkisi çözülene kadar ürün kodu 81261 ayırt edici kabul edilmiştir · bağımsız filtre veya motor değildir"],
  ],"2026-10-23"),
  ...products("Sera","food","https://www.sera.de/us/product/freshwater-aquarium/sera-vipan-tropical-flakes/",[
    ["Vipan Tropical Flakes 100 ml / 22 g","Yüzeyden beslenen süs balıkları için yüzde 4 böcek unu ve prebiyotik içeren, suyu bulandırmayan yüzen tam pul yem · ürün kodu 32238 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
    ["Vipan Tropical Flakes 250 ml / 60 g","Yüzeyden beslenen süs balıkları için yüzde 4 böcek unu ve prebiyotik içeren, suyu bulandırmayan yüzen tam pul yem · ürün kodu 32239 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
    ["Vipan Tropical Flakes 1000 ml / 210 g","Yüzeyden beslenen süs balıkları için yüzde 4 böcek unu ve prebiyotik içeren, suyu bulandırmayan yüzen tam pul yem · ürün kodu 32240 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
    ["Vipan Tropical Flakes 10 L / 2 kg","Yüzeyden beslenen süs balıkları için yüzde 4 böcek unu ve prebiyotik içeren, suyu bulandırmayan yüzen tam pul yem · ürün kodu 32286 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
    ["Vipan Tropical Flakes 21 L / 4 kg","Yüzeyden beslenen süs balıkları için yüzde 4 böcek unu ve prebiyotik içeren, suyu bulandırmayan yüzen tam pul yem · ürün kodu 32293 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
  ],"2026-10-23"),
  ...products("Sera","food","https://www.sera.de/en/product/freshwater-aquarium/sera-vipan-flakes-xl/",[
    ["Vipan Flakes XL 1000 ml / 210 g","Büyük ve yüzeyden beslenen süs balıkları için yüzde 4 böcek unu ve prebiyotik içeren yüzen XL tam pul yem · ürün kodu 32285 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
    ["Vipan Flakes XL 10 L / 2 kg","Büyük ve yüzeyden beslenen süs balıkları için yüzde 4 böcek unu ve prebiyotik içeren yüzen XL tam pul yem · ürün kodu 32287 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
    ["Vipan Flakes XL 21 L / 4 kg","Büyük ve yüzeyden beslenen süs balıkları için yüzde 4 böcek unu ve prebiyotik içeren yüzen XL tam pul yem · ürün kodu 32294 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
  ],"2026-10-23"),
  ...products("Sera","food","https://www.sera.de/us/product/freshwater-aquarium/sera-vipagran-tropical-granules/",[
    ["Vipagran Tropical Granules 50 ml / 22 g","Orta su katmanından beslenen balıklar için yüzde 4 böcek unu ve prebiyotik içeren, yavaş batan yumuşak tam granül yem · ürün kodu 32866 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
    ["Vipagran Tropical Granules 100 ml / 39 g","Orta su katmanından beslenen balıklar için yüzde 4 böcek unu ve prebiyotik içeren, yavaş batan yumuşak tam granül yem · ürün kodu 00201 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
    ["Vipagran Tropical Granules 250 ml / 100 g","Orta su katmanından beslenen balıklar için yüzde 4 böcek unu ve prebiyotik içeren, yavaş batan yumuşak tam granül yem · ürün kodu 00202 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
    ["Vipagran Tropical Granules 1000 ml / 370 g","Orta su katmanından beslenen balıklar için yüzde 4 böcek unu ve prebiyotik içeren, yavaş batan yumuşak tam granül yem · ürün kodu 00203 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
    ["Vipagran Tropical Granules 10 L / 3,6 kg","Orta su katmanından beslenen balıklar için yüzde 4 böcek unu ve prebiyotik içeren, yavaş batan yumuşak tam granül yem · ürün kodu 00204 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
  ],"2026-10-23"),
  ...products("Sera","food","https://www.sera.de/us/product/freshwater-aquarium/sera-vipachips-tropical-wafers/",[
    ["Vipachips Tropical Wafers 100 ml / 37 g","Dipten beslenen balıklar için yüzde 6,5 böcek unu ve prebiyotik içeren, hızlı batan ve suda biçimini koruyan tam wafer yem · ürün kodu 00514 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
    ["Vipachips Tropical Wafers 250 ml / 90 g","Dipten beslenen balıklar için yüzde 6,5 böcek unu ve prebiyotik içeren, hızlı batan ve suda biçimini koruyan tam wafer yem · ürün kodu 00515 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
    ["Vipachips Tropical Wafers 1000 ml / 380 g","Dipten beslenen balıklar için yüzde 6,5 böcek unu ve prebiyotik içeren, hızlı batan ve suda biçimini koruyan tam wafer yem · ürün kodu 00519 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
    ["Vipachips Tropical Wafers 10 L / 3,3 kg","Dipten beslenen balıklar için yüzde 6,5 böcek unu ve prebiyotik içeren, hızlı batan ve suda biçimini koruyan tam wafer yem · ürün kodu 00518 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
  ],"2026-10-23"),
  ...products("Sera","food","https://www.sera.de/en/product/freshwater-aquarium/sera-san-color-flakes/",[
    ["San Color Flakes 100 ml / 22 g","Yüzeyden beslenen süs balıkları için yüzde 10 krill ve astaksantince zengin Haematococcus algi içeren, boyasız ve koruyucusuz renk destekleyici tam pul yem · ürün kodu 32241 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
    ["San Color Flakes 250 ml / 60 g","Yüzeyden beslenen süs balıkları için yüzde 10 krill ve astaksantince zengin Haematococcus algi içeren, boyasız ve koruyucusuz renk destekleyici tam pul yem · ürün kodu 32242 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
    ["San Color Flakes 1000 ml / 210 g","Yüzeyden beslenen süs balıkları için yüzde 10 krill ve astaksantince zengin Haematococcus algi içeren, boyasız ve koruyucusuz renk destekleyici tam pul yem · ürün kodu 32243 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
    ["San Color Flakes 10 L / 2 kg","Yüzeyden beslenen süs balıkları için yüzde 10 krill ve astaksantince zengin Haematococcus algi içeren, boyasız ve koruyucusuz renk destekleyici tam pul yem · ürün kodu 32288 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
  ],"2026-10-23"),
  ...products("Sera","food","https://www.sera.de/en/product/freshwater-aquarium/sera-flora-flakes/",[
    ["Flora Flakes 100 ml / 22 g","Otçul ve hepçil, yüzeyden beslenen süs balıkları için yüzde 7 spirulina ve lifçe zengin bitkisel bileşenler içeren, sindirimi destekleyen tam pul yem · ürün kodu 32244 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
    ["Flora Flakes 250 ml / 60 g","Otçul ve hepçil, yüzeyden beslenen süs balıkları için yüzde 7 spirulina ve lifçe zengin bitkisel bileşenler içeren, sindirimi destekleyen tam pul yem · ürün kodu 32245 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
    ["Flora Flakes 1000 ml / 210 g","Otçul ve hepçil, yüzeyden beslenen süs balıkları için yüzde 7 spirulina ve lifçe zengin bitkisel bileşenler içeren, sindirimi destekleyen tam pul yem · ürün kodu 32246 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
    ["Flora Flakes 10 L / 2 kg","Otçul ve hepçil, yüzeyden beslenen süs balıkları için yüzde 7 spirulina ve lifçe zengin bitkisel bileşenler içeren, sindirimi destekleyen tam pul yem · ürün kodu 32289 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
  ],"2026-10-23"),
  ...products("Sera","food","https://www.sera.de/en/product/freshwater-aquarium/sera-vipan-baby-flakes/",[
    ["Vipan Baby Flakes 50 ml / 30 g","Yüzeyden beslenen yavru balıklar için yüzde 4 böcek unu ve prebiyotik içeren, suda biçimini koruyan yüzen mikro tam pul yem · ürün kodu 00730 · günde birkaç kez, kısa sürede tüketilecek miktarda"],
    ["Vipan Baby Flakes 100 ml / 56 g","Yüzeyden beslenen yavru balıklar için yüzde 4 böcek unu ve prebiyotik içeren, suda biçimini koruyan yüzen mikro tam pul yem · ürün kodu 00740 · günde birkaç kez, kısa sürede tüketilecek miktarda"],
    ["Vipan Baby Flakes 2,2 L / 1,1 kg","Yüzeyden beslenen yavru balıklar için yüzde 4 böcek unu ve prebiyotik içeren, suda biçimini koruyan yüzen mikro tam pul yem · ürün kodu 00780 · günde birkaç kez, kısa sürede tüketilecek miktarda"],
  ],"2026-10-23"),
  ...products("Sera","food","https://www.sera.de/en/product/freshwater-aquarium/sera-san-color-granules/",[
    ["San Color Granules 100 ml / 40 g","Orta su katmanından beslenen süs balıkları için yüzde 4 krill ve astaksantince zengin Haematococcus algi içeren, yavaş batan renk destekleyici tam granül yem · ürün kodu 32862 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
    ["San Color Granules 250 ml / 100 g","Orta su katmanından beslenen süs balıkları için yüzde 4 krill ve astaksantince zengin Haematococcus algi içeren, yavaş batan renk destekleyici tam granül yem · ürün kodu 32863 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
    ["San Color Granules 1000 ml / 420 g","Orta su katmanından beslenen süs balıkları için yüzde 4 krill ve astaksantince zengin Haematococcus algi içeren, yavaş batan renk destekleyici tam granül yem · ürün kodu 32864 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
    ["San Color Granules 10 L / 4,5 kg","Orta su katmanından beslenen süs balıkları için yüzde 4 krill ve astaksantince zengin Haematococcus algi içeren, yavaş batan renk destekleyici tam granül yem · ürün kodu 32865 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
  ],"2026-10-23"),
  ...products("Sera","food","https://www.sera.de/en/product/freshwater-aquarium/sera-betta-granules/",[
    ["Betta Granules 50 ml / 24 g","Betta ve diğer labirent balıkları için yüzde 6 böcek unu, prebiyotik ve kilogram başına 50 mg doğal astaksantin içeren, yavaş batan yumuşak ince tam granül yem · ürün kodu 00104 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
    ["Betta Granules 100 ml / 44 g","Betta ve diğer labirent balıkları için yüzde 6 böcek unu, prebiyotik ve kilogram başına 50 mg doğal astaksantin içeren, yavaş batan yumuşak ince tam granül yem · ürün kodu 00105 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
  ],"2026-10-23"),
  ...products("Sera","food","https://www.sera.de/us/product/freshwater-aquarium/sera-veggie-granules/",[
    ["Veggie Granules 100 ml / 38 g","Otçul ve orta su katmanından beslenen süs balıkları için yüzde 2 spirulina ve lifçe zengin bitkisel bileşenler içeren, yavaş batan ve sindirimi destekleyen tam granül yem · ürün kodu 32870 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
    ["Veggie Granules 250 ml / 98 g","Otçul ve orta su katmanından beslenen süs balıkları için yüzde 2 spirulina ve lifçe zengin bitkisel bileşenler içeren, yavaş batan ve sindirimi destekleyen tam granül yem · ürün kodu 32871 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
    ["Veggie Granules 1000 ml / 400 g","Otçul ve orta su katmanından beslenen süs balıkları için yüzde 2 spirulina ve lifçe zengin bitkisel bileşenler içeren, yavaş batan ve sindirimi destekleyen tam granül yem · ürün kodu 32872 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
    ["Veggie Granules 10 L / 4,2 kg","Otçul ve orta su katmanından beslenen süs balıkları için yüzde 2 spirulina ve lifçe zengin bitkisel bileşenler içeren, yavaş batan ve sindirimi destekleyen tam granül yem · ürün kodu 32873 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
  ],"2026-10-23"),
  ...products("Sera","food","https://www.sera.de/en/product/freshwater-aquarium/sera-spirulina-tabs/",[
    ["Spirulina Tabs 24 tablet / 16 g","Dipten beslenen otçul balıklar ve omurgasızlar için yüzde 25 spirulina içeren, dibe batan veya cama yapıştırılabilen tam tablet yem · ürün kodu 00920 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
    ["Spirulina Tabs 100 ml / 60 g","Dipten beslenen otçul balıklar ve omurgasızlar için yüzde 25 spirulina içeren, dibe batan veya cama yapıştırılabilen tam tablet yem · ürün kodu 00940 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
    ["Spirulina Tabs 2,2 L / 1,4 kg","Dipten beslenen otçul balıklar ve omurgasızlar için yüzde 25 spirulina içeren, dibe batan veya cama yapıştırılabilen tam tablet yem · ürün kodu 00980 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
  ],"2026-10-23"),
  ...products("Sera","food","https://www.sera.de/en/product/freshwater-aquarium/sera-insect-granules/",[
    ["Insect Granules 100 ml / 36 g","Hayvansal proteini yalnız kara asker sineği larvasından gelen, yüzde 40 böcek unu içeren yavaş batan yumuşak tam granül yem · ürün kodu 32615 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
    ["Insect Granules 250 ml / 95 g","Hayvansal proteini yalnız kara asker sineği larvasından gelen, yüzde 40 böcek unu içeren yavaş batan yumuşak tam granül yem · ürün kodu 32616 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
    ["Insect Granules 1000 ml / 410 g","Hayvansal proteini yalnız kara asker sineği larvasından gelen, yüzde 40 böcek unu içeren yavaş batan yumuşak tam granül yem · ürün kodu 32429 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
  ],"2026-10-23"),
  ...products("Sera","food","https://www.sera.de/en/product/freshwater-aquarium/sera-immune-probiotic-granules/",[
    ["Immune Probiotic Granules 100 ml / 45 g","Boyu 5 cm üzerindeki süs balıkları için yüzde 50,5 protein ve kilogram başına 1×10^10 KOB Bacillus velezensis içeren, yavaş batan probiyotik büyüme ve bağışıklık yemi · ürün kodu 32164 · günde birkaç kez, kısa sürede tüketilecek miktarda"],
    ["Immune Probiotic Granules 250 ml / 112 g","Boyu 5 cm üzerindeki süs balıkları için yüzde 50,5 protein ve kilogram başına 1×10^10 KOB Bacillus velezensis içeren, yavaş batan probiyotik büyüme ve bağışıklık yemi · ürün kodu 32045 · günde birkaç kez, kısa sürede tüketilecek miktarda"],
    ["Immune Probiotic Granules 1000 ml / 450 g","Boyu 5 cm üzerindeki süs balıkları için yüzde 50,5 protein ve kilogram başına 1×10^10 KOB Bacillus velezensis içeren, yavaş batan probiyotik büyüme ve bağışıklık yemi · ürün kodu 32046 · günde birkaç kez, kısa sürede tüketilecek miktarda"],
    ["Immune Probiotic Granules 10 L / 4,5 kg","Boyu 5 cm üzerindeki süs balıkları için yüzde 50,5 protein ve kilogram başına 1×10^10 KOB Bacillus velezensis içeren, yavaş batan probiyotik büyüme ve bağışıklık yemi · ürün kodu 32049 · günde birkaç kez, kısa sürede tüketilecek miktarda"],
  ],"2026-10-23"),
  ...products("Sera","food","https://www.sera.de/en/product/freshwater-aquarium/sera-immune-probiotic-granules-xs/",[
    ["Immune Probiotic Granules XS 100 ml / 48 g","Boyu 5 cm'ye kadar olan süs balıkları için yüzde 50,5 protein ve kilogram başına 1×10^10 KOB Bacillus velezensis içeren, yavaş batan ince probiyotik büyüme ve bağışıklık yemi · ürün kodu 32165 · günde birkaç kez, kısa sürede tüketilecek miktarda"],
    ["Immune Probiotic Granules XS 250 ml / 120 g","Boyu 5 cm'ye kadar olan süs balıkları için yüzde 50,5 protein ve kilogram başına 1×10^10 KOB Bacillus velezensis içeren, yavaş batan ince probiyotik büyüme ve bağışıklık yemi · ürün kodu 32044 · günde birkaç kez, kısa sürede tüketilecek miktarda"],
    ["Immune Probiotic Granules XS 1000 ml / 540 g","Boyu 5 cm'ye kadar olan süs balıkları için yüzde 50,5 protein ve kilogram başına 1×10^10 KOB Bacillus velezensis içeren, yavaş batan ince probiyotik büyüme ve bağışıklık yemi · ürün kodu 32047 · günde birkaç kez, kısa sürede tüketilecek miktarda"],
    ["Immune Probiotic Granules XS 10 L / 5,4 kg","Boyu 5 cm'ye kadar olan süs balıkları için yüzde 50,5 protein ve kilogram başına 1×10^10 KOB Bacillus velezensis içeren, yavaş batan ince probiyotik büyüme ve bağışıklık yemi · ürün kodu 32048 · günde birkaç kez, kısa sürede tüketilecek miktarda"],
  ],"2026-10-23"),
  ...products("Sera","food","https://www.sera.de/en/product/freshwater-aquarium/sera-plankton-color-tabs/",[
    ["Plankton Color Tabs 50 ml / 30 g","Dipten beslenen balıklar ve omurgasızlar için yüzde 24 spirulina ve yüzde 7 krill içeren, doğal renk gelişimini destekleyen batan tam tablet yem · ürün kodu 00500 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
    ["Plankton Color Tabs 100 ml / 65 g","Dipten beslenen balıklar ve omurgasızlar için yüzde 24 spirulina ve yüzde 7 krill içeren, doğal renk gelişimini destekleyen batan tam tablet yem · ürün kodu 00502 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
    ["Plankton Color Tabs 2,2 L / 1,3 kg","Dipten beslenen balıklar ve omurgasızlar için yüzde 24 spirulina ve yüzde 7 krill içeren, doğal renk gelişimini destekleyen batan tam tablet yem · ürün kodu 00505 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
  ],"2026-10-23"),
  ...products("Sera","food","https://www.sera.de/en/product/freshwater-aquarium/sera-guppy-granules/",[
    ["Guppy Granules 100 ml / 46 g","Guppy ve diğer canlı doğuran dişli sazangiller için yüzde 4 spirulina, doğal karotenoidler ve prebiyotik içeren, yavaş batan yumuşak ince tam granül yem · ürün kodu 00710 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
    ["Guppy Granules 250 ml / 120 g","Guppy ve diğer canlı doğuran dişli sazangiller için yüzde 4 spirulina, doğal karotenoidler ve prebiyotik içeren, yavaş batan yumuşak ince tam granül yem · ürün kodu 00711 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
  ],"2026-10-23"),
  ...products("Sera","food","https://www.sera.de/en/product/freshwater-aquarium/sera-o-nip-stickies/",[
    ["O-Nip Stickies 24 tablet / 16 g","Cama yapışan, yüzde 7 krill ile kan kurdu, Tubifex ve Gammarus içeren zengin tam tablet yem · ürün kodu 00420 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
    ["O-Nip Stickies 100 ml / 62 g","Cama yapışan, yüzde 7 krill ile kan kurdu, Tubifex ve Gammarus içeren zengin tam tablet yem · ürün kodu 00440 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
    ["O-Nip Stickies 250 ml / 169 g","Cama yapışan, yüzde 7 krill ile kan kurdu, Tubifex ve Gammarus içeren zengin tam tablet yem · ürün kodu 00450 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
    ["O-Nip Stickies 2,2 L / 1,2 kg","Cama yapışan, yüzde 7 krill ile kan kurdu, Tubifex ve Gammarus içeren zengin tam tablet yem · ürün kodu 00480 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
  ],"2026-10-23"),
  ...products("Sera","food","https://www.sera.de/en/product/freshwater-aquarium/sera-daphnia-snack/",[
    ["Daphnia Snack 100 ml / 13 g","Büyük balıklar için lif ve mineralce zengin, güneşte nazikçe kurutulmuş yüzde 100 su piresinden oluşan doğal ara öğün · ürün kodu 01440 · haftada birkaç kez, kısa sürede tüketilecek miktarda"],
  ],"2026-10-23"),
  ...products("Sera","food","https://www.sera.de/en/product/freshwater-aquarium/sera-artemia-fd-snack/",[
    ["Artemia FD Snack 100 ml / 8 g","Balıklar ve omurgasızlar için yüzde 100 dondurularak kurutulmuş Artemia'dan oluşan, protein ve doğal karotenoid içeren ara öğün · ürün kodu 01540 · haftada birkaç kez, kısa sürede tüketilecek miktarda"],
    ["Artemia FD Snack 250 ml / 19 g","Balıklar ve omurgasızlar için yüzde 100 dondurularak kurutulmuş Artemia'dan oluşan, protein ve doğal karotenoid içeren ara öğün · ürün kodu 01550 · haftada birkaç kez, kısa sürede tüketilecek miktarda"],
  ],"2026-10-23"),
  ...products("Sera","food","https://www.sera.de/en/product/freshwater-aquarium/sera-bloodworms-fd-snack/",[
    ["Bloodworms FD Snack 50 ml / 6 g","Etçil, seçici ve genç balıklar için yüzde 100 dondurularak kurutulmuş kan kurdundan oluşan doğal ara öğün · ürün kodu 01130 · haftada birkaç kez, kısa sürede tüketilecek miktarda"],
    ["Bloodworms FD Snack 100 ml / 11 g","Etçil, seçici ve genç balıklar için yüzde 100 dondurularak kurutulmuş kan kurdundan oluşan doğal ara öğün · ürün kodu 01140 · haftada birkaç kez, kısa sürede tüketilecek miktarda"],
    ["Bloodworms FD Snack 250 ml / 24 g","Etçil, seçici ve genç balıklar için yüzde 100 dondurularak kurutulmuş kan kurdundan oluşan doğal ara öğün · ürün kodu 01150 · haftada birkaç kez, kısa sürede tüketilecek miktarda"],
  ],"2026-10-23"),
  ...products("Sera","food","https://www.sera.de/en/product/freshwater-aquarium/sera-mixpur-fd-snack/",[
    ["Mixpur FD Snack 100 ml / 12 g","Topluluk akvaryumları için yüzde 28 kan kurdu, yüzde 28 su piresi, yüzde 28 Tubifex ve yüzde 16 krill içeren dondurularak kurutulmuş doğal ara öğün · ürün kodu 01240 · haftada birkaç kez, kısa sürede tüketilecek miktarda"],
  ],"2026-10-23"),
  ...products("Sera","food","https://www.sera.de/en/product/freshwater-aquarium/sera-tubifex-fd-snack/",[
    ["Tubifex FD Snack 100 ml / 12 g","Etçil, zayıflamış veya seçici balıklar için yüzde 100 dondurularak kurutulmuş Tubifex'ten oluşan proteinli doğal ara öğün · ürün kodu 01340 · haftada birkaç kez, kısa sürede tüketilecek miktarda"],
    ["Tubifex FD Snack 250 ml / 28 g","Etçil, zayıflamış veya seçici balıklar için yüzde 100 dondurularak kurutulmuş Tubifex'ten oluşan proteinli doğal ara öğün · ürün kodu 01350 · haftada birkaç kez, kısa sürede tüketilecek miktarda"],
  ],"2026-10-23"),
  ...products("Sera","food","https://www.sera.de/en/product/freshwater-aquarium/sera-gvg-mix-royal-flakes/",[
    ["GVG Mix Royal Flakes 100 ml / 24 g","Yüzeyden beslenen balıklar için yüzde 12,6 krill, yüzde 2,7 kan kurdu ve yüzde 2,7 su piresi içeren tam pul yem karışımı · ürün kodu 32250 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
    ["GVG Mix Royal Flakes 250 ml / 62 g","Yüzeyden beslenen balıklar için yüzde 12,6 krill, yüzde 2,7 kan kurdu ve yüzde 2,7 su piresi içeren tam pul yem karışımı · ürün kodu 32251 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
    ["GVG Mix Royal Flakes 10 L / 2 kg","Yüzeyden beslenen balıklar için yüzde 12,6 krill, yüzde 2,7 kan kurdu ve yüzde 2,7 su piresi içeren tam pul yem karışımı · ürün kodu 32292 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
  ],"2026-10-23"),
  ...products("Sera","food","https://www.sera.de/de/produkt/suesswasseraquarium/sera-krill-fd-snack/",[
    ["Krill FD Snack 100 ml / 15 g","Büyük balıklar ve omurgasızlar için yüzde 100 dondurularak kurutulmuş krilden oluşan, doğal astaksantinli ara öğün · ürün kodu 01570 · haftada birkaç kez, kısa sürede tüketilecek miktarda"],
    ["Krill FD Snack 250 ml / 40 g","Büyük balıklar ve omurgasızlar için yüzde 100 dondurularak kurutulmuş krilden oluşan, doğal astaksantinli ara öğün · ürün kodu 01575 · haftada birkaç kez, kısa sürede tüketilecek miktarda"],
  ],"2026-10-23"),
  ...products("Sera","food","https://www.sera.de/en/product/freshwater-aquarium/sera-pleco-chips/",[
    ["Pleco Chips 100 ml / 36 g","Ancistrus ve diğer raspalayan/vantuz ağızlı dip balıkları için yüzde 4 spirulina ile söğüt kabuğu ve ısırgan içeren, en az 24 saat biçimini koruyan hızla batan cips yem · ürün kodu 00510 · günde bir kez az miktarda, gececil türlere tercihen akşam"],
    ["Pleco Chips 250 ml / 92 g","Ancistrus ve diğer raspalayan/vantuz ağızlı dip balıkları için yüzde 4 spirulina ile söğüt kabuğu ve ısırgan içeren, en az 24 saat biçimini koruyan hızla batan cips yem · ürün kodu 00511 · günde bir kez az miktarda, gececil türlere tercihen akşam"],
    ["Pleco Chips 1000 ml / 380 g","Ancistrus ve diğer raspalayan/vantuz ağızlı dip balıkları için yüzde 4 spirulina ile söğüt kabuğu ve ısırgan içeren, en az 24 saat biçimini koruyan hızla batan cips yem · ürün kodu 00508 · günde bir kez az miktarda, gececil türlere tercihen akşam"],
    ["Pleco Chips 10 L / 3,9 kg","Ancistrus ve diğer raspalayan/vantuz ağızlı dip balıkları için yüzde 4 spirulina ile söğüt kabuğu ve ısırgan içeren, en az 24 saat biçimini koruyan hızla batan cips yem · ürün kodu 00517 · günde bir kez az miktarda, gececil türlere tercihen akşam"],
  ],"2026-10-23"),
  ...products("Sera","food","https://www.sera.de/en/product/freshwater-aquarium/sera-pleco-tabs-xl/",[
    ["Pleco Tabs XL 250 ml / 130 g","Büyük vatozlar ve diğer dip balıkları için yüzde 20 spirulina içeren, yaklaşık 3 cm çapında, cama yapıştırılabilen ve biçimini uzun süre koruyan tam tablet yem · ürün kodu 00498 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
    ["Pleco Tabs XL 1000 ml / 550 g","Büyük vatozlar ve diğer dip balıkları için yüzde 20 spirulina içeren, yaklaşık 3 cm çapında, cama yapıştırılabilen ve biçimini uzun süre koruyan tam tablet yem · ürün kodu 00499 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
  ],"2026-10-23"),
  ...products("Sera","food","https://www.sera.de/en/product/freshwater-aquarium/sera-viformo-pleco-tabs/",[
    ["Viformo Pleco Tabs 50 ml / 33 g","Küçük ağızlı yayın balıkları ve loach türleri için yüzde 13 deniz algi ile yüzde 4 Gammarus içeren, dipte aranırken lokmalara ayrılan tam tablet yem · ürün kodu 00520 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
    ["Viformo Pleco Tabs 100 ml / 64 g","Küçük ağızlı yayın balıkları ve loach türleri için yüzde 13 deniz algi ile yüzde 4 Gammarus içeren, dipte aranırken lokmalara ayrılan tam tablet yem · ürün kodu 00540 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
    ["Viformo Pleco Tabs 250 ml / 160 g","Küçük ağızlı yayın balıkları ve loach türleri için yüzde 13 deniz algi ile yüzde 4 Gammarus içeren, dipte aranırken lokmalara ayrılan tam tablet yem · ürün kodu 00550 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
    ["Viformo Pleco Tabs 2,2 L / 1,4 kg","Küçük ağızlı yayın balıkları ve loach türleri için yüzde 13 deniz algi ile yüzde 4 Gammarus içeren, dipte aranırken lokmalara ayrılan tam tablet yem · ürün kodu 00580 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
  ],"2026-10-23"),
  ...products("Sera","food","https://www.sera.de/en/product/freshwater-aquarium/sera-cichlid-sticks/",[
    ["Cichlid Sticks 250 ml / 52 g","Büyük hepçil cikletler ve diğer iri balıklar için yüzde 4 böcek unu ve yüzde 3 balık yağı içeren, su yüzeyinde kalan tam çubuk yem · ürün kodu 00228 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
    ["Cichlid Sticks 1000 ml / 210 g","Büyük hepçil cikletler ve diğer iri balıklar için yüzde 4 böcek unu ve yüzde 3 balık yağı içeren, su yüzeyinde kalan tam çubuk yem · ürün kodu 00210 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
    ["Cichlid Sticks 10 L / 2,2 kg","Büyük hepçil cikletler ve diğer iri balıklar için yüzde 4 böcek unu ve yüzde 3 balık yağı içeren, su yüzeyinde kalan tam çubuk yem · ürün kodu 00220 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
  ],"2026-10-23"),
  ...products("Sera","food","https://www.sera.de/en/product/freshwater-aquarium/sera-cichlid-carnivore-granules-xl/",[
    ["Cichlid Carnivore Granules XL 1000 ml / 330 g","Büyük etçil ve hepçil cikletler için yüzde 4 krill, yüzde 2 balık yağı ve kilogram başına 75 mg astaksantin eşdeğeri Haematococcus algi içeren, yüzen tam granül yem · ürün kodu 00214 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
    ["Cichlid Carnivore Granules XL 3,8 L / 1,3 kg","Büyük etçil ve hepçil cikletler için yüzde 4 krill, yüzde 2 balık yağı ve kilogram başına 75 mg astaksantin eşdeğeri Haematococcus algi içeren, yüzen tam granül yem · ürün kodu 00215 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
    ["Cichlid Carnivore Granules XL 10 L / 3,6 kg","Büyük etçil ve hepçil cikletler için yüzde 4 krill, yüzde 2 balık yağı ve kilogram başına 75 mg astaksantin eşdeğeri Haematococcus algi içeren, yüzen tam granül yem · ürün kodu 00216 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
  ],"2026-10-23"),
  ...products("Sera","food","https://www.sera.de/en/product/freshwater-aquarium/sera-cichlid-herbivore-granules-xl/",[
    ["Cichlid Herbivore Granules XL 1000 ml / 350 g","Büyük, bitki ve perifiton ağırlıklı beslenen cikletler için yüzde 10 spirulina içeren, yüzen tam granül yem · ürün kodu 00213 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
    ["Cichlid Herbivore Granules XL 3,8 L / 1,3 kg","Büyük, bitki ve perifiton ağırlıklı beslenen cikletler için yüzde 10 spirulina içeren, yüzen tam granül yem · ürün kodu 00217 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
    ["Cichlid Herbivore Granules XL 10 L / 3,6 kg","Büyük, bitki ve perifiton ağırlıklı beslenen cikletler için yüzde 10 spirulina içeren, yüzen tam granül yem · ürün kodu 00218 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
  ],"2026-10-23"),
  ...products("Sera","food","https://www.sera.de/en/product/freshwater-aquarium/sera-cichlid-malawi-granules/",[
    ["Cichlid Malawi Granules 100 ml / 55 g","Bitki ve perifiton ağırlıklı beslenen küçük Doğu Afrika cikletleri için yüzde 4 spirulina içeren, yavaş batan tam granül yem · ürün kodu 00393 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
    ["Cichlid Malawi Granules 250 ml / 135 g","Bitki ve perifiton ağırlıklı beslenen küçük Doğu Afrika cikletleri için yüzde 4 spirulina içeren, yavaş batan tam granül yem · ürün kodu 00392 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
    ["Cichlid Malawi Granules 1000 ml / 565 g","Bitki ve perifiton ağırlıklı beslenen küçük Doğu Afrika cikletleri için yüzde 4 spirulina içeren, yavaş batan tam granül yem · ürün kodu 00396 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
  ],"2026-10-23"),
  ...products("Sera","food","https://www.sera.de/en/product/freshwater-aquarium/sera-cichlid-tanganyika-granules/",[
    ["Cichlid Tanganyika Granules 100 ml / 55 g","Etçil küçük cikletler ve hepçil türler için yüzde 4 krill ve yüzde 4 balık yağı içeren, yavaş batan tam granül yem · ürün kodu 00403 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
    ["Cichlid Tanganyika Granules 250 ml / 135 g","Etçil küçük cikletler ve hepçil türler için yüzde 4 krill ve yüzde 4 balık yağı içeren, yavaş batan tam granül yem · ürün kodu 00402 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
    ["Cichlid Tanganyika Granules 1000 ml / 565 g","Etçil küçük cikletler ve hepçil türler için yüzde 4 krill ve yüzde 4 balık yağı içeren, yavaş batan tam granül yem · ürün kodu 00406 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
    ["Cichlid Tanganyika Granules 10 L / 5,6 kg","Etçil küçük cikletler ve hepçil türler için yüzde 4 krill ve yüzde 4 balık yağı içeren, yavaş batan tam granül yem · ürün kodu 00408 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
  ],"2026-10-23"),
  ...products("Sera","food","https://www.sera.de/us/product/freshwater-aquarium/sera-arowana-pellets/",[
    ["Arowana Pellets 1000 ml / 350 g","Arowana ve diğer büyük etçil balıklar için yüzde 39 balık içeren, suda etsi kıvam alan ve biçimini koruyan yüzen tam pelet yem · ürün kodu 00400 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
  ],"2026-10-23"),
  ...products("Sera","food","https://www.sera.de/us/product/freshwater-aquarium/sera-red-parrot-pellets/",[
    ["Red Parrot Pellets 250 ml / 83 g","Papağan cikletleri ve renkli süs balıkları için kilogram başına 54 mg doğal astaksantin ile prebiyotik bileşenler içeren, yüzen tam pelet yem · ürün kodu 00411 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
    ["Red Parrot Pellets 1000 ml / 335 g","Papağan cikletleri ve renkli süs balıkları için kilogram başına 54 mg doğal astaksantin ile prebiyotik bileşenler içeren, yüzen tam pelet yem · ürün kodu 00413 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
  ],"2026-10-23"),
  ...products("Sera","food","https://www.sera.de/en/product/freshwater-aquarium/sera-discus-granules/",[
    ["Discus Granules 100 ml / 42 g","Yavru dâhil discus ve hassas süs balıkları için yüzde 50,5 protein, yüzde 4 krill ve yüzde 0,05 sarımsak içeren; suda şişmeden etsi kıvam alan, yavaş batan yumuşak tam granül yem · ürün kodu 00300 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
    ["Discus Granules 250 ml / 105 g","Yavru dâhil discus ve hassas süs balıkları için yüzde 50,5 protein, yüzde 4 krill ve yüzde 0,05 sarımsak içeren; suda şişmeden etsi kıvam alan, yavaş batan yumuşak tam granül yem · ürün kodu 00305 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
    ["Discus Granules 1000 ml / 420 g","Yavru dâhil discus ve hassas süs balıkları için yüzde 50,5 protein, yüzde 4 krill ve yüzde 0,05 sarımsak içeren; suda şişmeden etsi kıvam alan, yavaş batan yumuşak tam granül yem · ürün kodu 00307 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
    ["Discus Granules 10 L / 4,3 kg","Yavru dâhil discus ve hassas süs balıkları için yüzde 50,5 protein, yüzde 4 krill ve yüzde 0,05 sarımsak içeren; suda şişmeden etsi kıvam alan, yavaş batan yumuşak tam granül yem · ürün kodu 00309 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
  ],"2026-10-23"),
  ...products("Sera","food","https://www.sera.de/en/product/freshwater-aquarium/sera-discus-color-granules/",[
    ["Discus Color Granules 100 ml / 42 g","Tüm discus balıkları için yüzde 50 protein, yüzde 4 krill, yüzde 3,5 balık yağı ve kilogram başına 175 mg doğal astaksantin içeren; suda aşırı şişmeden etsi kıvam alan, yavaş batan renk granülü · ürün kodu 00332 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
    ["Discus Color Granules 250 ml / 105 g","Tüm discus balıkları için yüzde 50 protein, yüzde 4 krill, yüzde 3,5 balık yağı ve kilogram başına 175 mg doğal astaksantin içeren; suda aşırı şişmeden etsi kıvam alan, yavaş batan renk granülü · ürün kodu 00334 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
    ["Discus Color Granules 10 L / 4 kg","Tüm discus balıkları için yüzde 50 protein, yüzde 4 krill, yüzde 3,5 balık yağı ve kilogram başına 175 mg doğal astaksantin içeren; suda aşırı şişmeden etsi kıvam alan, yavaş batan renk granülü · ürün kodu 00337 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
  ],"2026-10-23"),
  ...products("Sera","food","https://www.sera.de/en/product/freshwater-aquarium/sera-discus-probiotic-granules/",[
    ["Discus Probiotic Granules 100 ml / 45 g","Tüm discus balıkları için yüzde 51 protein, yüzde 8 böcek unu ve kilogram başına 75 mg doğal astaksantin içeren; 1×10^10 KOB/kg Bacillus velezensis ile bağırsak florasını destekleyen, suda aşırı şişmeden etsi kıvam alan yavaş batan granül · ürün kodu 32326 · günde birkaç kez, kısa sürede tüketilecek miktarda"],
    ["Discus Probiotic Granules 250 ml / 112 g","Tüm discus balıkları için yüzde 51 protein, yüzde 8 böcek unu ve kilogram başına 75 mg doğal astaksantin içeren; 1×10^10 KOB/kg Bacillus velezensis ile bağırsak florasını destekleyen, suda aşırı şişmeden etsi kıvam alan yavaş batan granül · ürün kodu 32327 · günde birkaç kez, kısa sürede tüketilecek miktarda"],
    ["Discus Probiotic Granules 1000 ml / 450 g","Tüm discus balıkları için yüzde 51 protein, yüzde 8 böcek unu ve kilogram başına 75 mg doğal astaksantin içeren; 1×10^10 KOB/kg Bacillus velezensis ile bağırsak florasını destekleyen, suda aşırı şişmeden etsi kıvam alan yavaş batan granül · ürün kodu 32328 · günde birkaç kez, kısa sürede tüketilecek miktarda"],
    ["Discus Probiotic Granules 10 L / 4,5 kg","Tüm discus balıkları için yüzde 51 protein, yüzde 8 böcek unu ve kilogram başına 75 mg doğal astaksantin içeren; 1×10^10 KOB/kg Bacillus velezensis ile bağırsak florasını destekleyen, suda aşırı şişmeden etsi kıvam alan yavaş batan granül · ürün kodu 32329 · günde birkaç kez, kısa sürede tüketilecek miktarda"],
  ],"2026-10-23"),
  ...products("Sera","food","https://www.sera.de/en/product/freshwater-aquarium/sera-goldfish-flakes/",[
    ["Goldfish Flakes 50 ml / 12 g","Küçük Japon balıkları için yüzde 47,5 protein, yüzde 5 böcek unu ve yüzde 1,5 spirulina içeren, su yüzeyinde kalan temel pul yem · ürün kodu 00830 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
    ["Goldfish Flakes 100 ml / 22 g","Küçük Japon balıkları için yüzde 47,5 protein, yüzde 5 böcek unu ve yüzde 1,5 spirulina içeren, su yüzeyinde kalan temel pul yem · ürün kodu 32247 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
    ["Goldfish Flakes 250 ml / 60 g","Küçük Japon balıkları için yüzde 47,5 protein, yüzde 5 böcek unu ve yüzde 1,5 spirulina içeren, su yüzeyinde kalan temel pul yem · ürün kodu 32248 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
  ],"2026-10-23"),
  ...products("Sera","food","https://www.sera.de/en/product/freshwater-aquarium/sera-goldfish-granules/",[
    ["Goldfish Granules 100 ml / 30 g","Büyük Japon balıkları ve hassas süs formları için yüzde 36 protein, yüzde 4 böcek unu ve yüzde 2 balık yağı içeren; biçimini koruyan, suyu bulandırmayan yüzen temel granül yem · ürün kodu 00861 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
    ["Goldfish Granules 250 ml / 75 g","Büyük Japon balıkları ve hassas süs formları için yüzde 36 protein, yüzde 4 böcek unu ve yüzde 2 balık yağı içeren; biçimini koruyan, suyu bulandırmayan yüzen temel granül yem · ürün kodu 00862 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
    ["Goldfish Granules 50 ml / 18 g","Büyük Japon balıkları ve hassas süs formları için yüzde 36 protein, yüzde 4 böcek unu ve yüzde 2 balık yağı içeren; biçimini koruyan, suyu bulandırmayan yüzen temel granül yem · ürün kodu 00863 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
  ],"2026-10-23"),
  ...products("Sera","food","https://www.sera.de/en/product/freshwater-aquarium/sera-goldfish-color-granules/",[
    ["Goldfish Color Granules 100 ml / 33 g","Büyük Japon balıkları ve hassas süs formları için yüzde 39,5 protein ve yüzde 10 spirulina içeren; doğal renk gelişimini destekleyen, biçimini koruyan yüzen renk granülü · ürün kodu 00881 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
    ["Goldfish Color Granules 250 ml / 90 g","Büyük Japon balıkları ve hassas süs formları için yüzde 39,5 protein ve yüzde 10 spirulina içeren; doğal renk gelişimini destekleyen, biçimini koruyan yüzen renk granülü · ürün kodu 00882 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
    ["Goldfish Color Granules 50 ml / 20 g","Büyük Japon balıkları ve hassas süs formları için yüzde 39,5 protein ve yüzde 10 spirulina içeren; doğal renk gelişimini destekleyen, biçimini koruyan yüzen renk granülü · ürün kodu 00880 · günde bir veya iki kez, kısa sürede tüketilecek miktarda"],
  ],"2026-10-23"),
  ...products("Sera","food","https://www.sera.de/en/product/freshwater-aquarium/sera-shrimp-granules/",[
    ["Shrimp Granules 100 ml / 55 g","Tüm tatlı ve deniz suyu karidesleri için yüzde 39 protein, yüzde 5 spirulina, yüzde 1,5 kızılağaç kozalağı ve yüzde 2,5 kalsiyum içeren; güvenli deri değişimini destekleyen, uzun süre biçimini koruyan batan granül · ürün kodu 00554 · günde bir kez az miktarda; karidesler yavaş otladığı için artıkları hemen uzaklaştırmayın"],
  ],"2026-10-23"),
  ...products("Sera","food","https://www.sera.de/en/product/freshwater-aquarium/sera-crab-loops/",[
    ["Crab Loops 100 ml / 32 g","Tüm kabuklular için yüzde 37 protein, yüzde 4 spirulina ve yüzde 1,8 kalsiyum içeren; güvenli deri değişimini destekleyen, taşınabilir ve uzun süre biçimini koruyan batan halka yem · ürün kodu 00556 · günde bir kez az miktarda"],
  ],"2026-10-23"),
  ...products("Sera","food","https://www.sera.de/en/product/freshwater-aquarium/sera-vipagran-baby-granules/",[
    ["Vipagran Baby Granules 50 ml / 28 g","Orta su katmanında beslenen yavrular için yüzde 41,5 protein, yüzde 4 böcek unu, yüzde 3 balık yağı ve yüzde 1,2 spirulina içeren, yavaş batan mikro yumuşak granül · ürün kodu 00700 · günde birkaç kez, kısa sürede tüketilecek miktarda"],
    ["Vipagran Baby Granules 100 ml / 52 g","Orta su katmanında beslenen yavrular için yüzde 41,5 protein, yüzde 4 böcek unu, yüzde 3 balık yağı ve yüzde 1,2 spirulina içeren, yavaş batan mikro yumuşak granül · ürün kodu 00705 · günde birkaç kez, kısa sürede tüketilecek miktarda"],
    ["Vipagran Baby Granules 2,2 L / 1,1 kg","Orta su katmanında beslenen yavrular için yüzde 41,5 protein, yüzde 4 böcek unu, yüzde 3 balık yağı ve yüzde 1,2 spirulina içeren, yavaş batan mikro yumuşak granül · ürün kodu 00708 · günde birkaç kez, kısa sürede tüketilecek miktarda"],
  ],"2026-10-23"),
  ...products("Sera","food","https://www.sera.de/en/product/freshwater-aquarium/sera-micron-powder/",[
    ["Micron Powder 50 ml / 25 g","Balık yavruları, amfibi larvaları ve Artemia nauplii için yüzde 53,5 protein, yüzde 51 spirulina ve yüzde 18 krill içeren; doğal plankton gibi suda asılı kalan ince büyütme yemi · ürün kodu 00720 · günde birkaç kez, kısa sürede tüketilecek miktarda"],
  ],"2026-10-23"),
  ...products("Sera","food","https://www.sera.de/en/product/freshwater-aquarium/sera-axolotl-wafers/",[
    ["Axolotl Wafers 100 ml / 40 g","12 cm üzerindeki aksolotllar için yüzde 42 protein ve yüzde 12 yağ içeren; hızla batan, uzun süre biçimini koruyan yumuşak wafer · ürün kodu 32874 · haftada iki veya üç kez, 30 dakikada tüketilecek tek porsiyon; artıkları uzaklaştırın ve tercihen cımbızla verin"],
    ["Axolotl Wafers 250 ml / 105 g","12 cm üzerindeki aksolotllar için yüzde 42 protein ve yüzde 12 yağ içeren; hızla batan, uzun süre biçimini koruyan yumuşak wafer · ürün kodu 32875 · haftada iki veya üç kez, 30 dakikada tüketilecek tek porsiyon; artıkları uzaklaştırın ve tercihen cımbızla verin"],
  ],"2026-10-23"),
  ...products("Sera","food","https://www.sera.de/en/product/freshwater-aquarium/sera-holiday-tabs/",[
    ["Holiday Tabs 10 tablet / 21 g","Bir haftaya kadar yoklukta çoğu süs balığı için katman katman yumuşayan, cama yapıştırılan yüzde 40 proteinli tamamlayıcı tablet · ürün kodu 00990 · en fazla 60 litreye bir tablet; nano akvaryumlara uygun değildir, yeterli havalandırma sağlayın ve ayrılmadan önce kısmi su değişimi yapın"],
  ],"2026-10-23"),
  ...products("Sera","food","https://www.sera.de/en/product/freshwater-aquarium/sera-fish-vitamin-mix/",[
    ["Fish Vitamin Mix 100 ml / 100 g","Tatlı ve deniz suyu balıkları için krill yağı ve mikroalg yağı içeren emülsifiye multivitamin tamamlayıcısı · ürün kodu 02740 · kullanmadan önce çalkalayın; düzenli destek için haftada bir yeme 2–3 damla damlatıp kısa süre emdirin ve hemen verin"],
  ],"2026-10-23"),
  ...products("Sera","water_conditioner","https://www.sera.de/us/product/freshwater-aquarium/sera-aquatan/",[
    ["aquatan 50 ml","Klor, kloramin ve amonyağı birkaç dakika içinde gideren; ağır metalleri bağlayıp biyoyararlanılabilir kalsiyum, magnezyum, manganez ve iyot ekleyen su düzenleyici · ürün kodu 03030 · 200 litre için"],
    ["aquatan 100 ml","Klor, kloramin ve amonyağı birkaç dakika içinde gideren; ağır metalleri bağlayıp biyoyararlanılabilir kalsiyum, magnezyum, manganez ve iyot ekleyen su düzenleyici · ürün kodu 03040 · 400 litre için"],
    ["aquatan 250 ml","Klor, kloramin ve amonyağı birkaç dakika içinde gideren; ağır metalleri bağlayıp biyoyararlanılabilir kalsiyum, magnezyum, manganez ve iyot ekleyen su düzenleyici · ürün kodu 03050 · 1.000 litre için"],
    ["aquatan 500 ml","Klor, kloramin ve amonyağı birkaç dakika içinde gideren; ağır metalleri bağlayıp biyoyararlanılabilir kalsiyum, magnezyum, manganez ve iyot ekleyen su düzenleyici · ürün kodu 03060 · 2.000 litre için"],
    ["aquatan 2500 ml","Klor, kloramin ve amonyağı birkaç dakika içinde gideren; ağır metalleri bağlayıp biyoyararlanılabilir kalsiyum, magnezyum, manganez ve iyot ekleyen su düzenleyici · ürün kodu 03088 · 10.000 litre için"],
    ["aquatan 5000 ml","Klor, kloramin ve amonyağı birkaç dakika içinde gideren; ağır metalleri bağlayıp biyoyararlanılabilir kalsiyum, magnezyum, manganez ve iyot ekleyen su düzenleyici · ürün kodu 03080 · 20.000 litre için"],
  ],"2026-10-23"),
  ...products("Sera","water_conditioner","https://www.sera.de/en/product/freshwater-aquarium/sera-toxivec/",[
    ["toxivec 50 ml","Acil durumda amonyak, nitrit, klor ve kloramini gideren; kurşun ve bakır gibi ağır metalleri bağlayıp nitratı azaltan geniş etkili su düzenleyici · ürün kodu 03000 · 200 litre için · standart doz 20 litreye 5 ml, gerektiğinde beş kata kadar uygulanabilir"],
    ["toxivec 100 ml","Acil durumda amonyak, nitrit, klor ve kloramini gideren; kurşun ve bakır gibi ağır metalleri bağlayıp nitratı azaltan geniş etkili su düzenleyici · ürün kodu 03001 · 400 litre için · standart doz 20 litreye 5 ml, gerektiğinde beş kata kadar uygulanabilir"],
    ["toxivec 250 ml","Acil durumda amonyak, nitrit, klor ve kloramini gideren; kurşun ve bakır gibi ağır metalleri bağlayıp nitratı azaltan geniş etkili su düzenleyici · ürün kodu 03002 · 1.000 litre için · standart doz 20 litreye 5 ml, gerektiğinde beş kata kadar uygulanabilir"],
    ["toxivec 500 ml","Acil durumda amonyak, nitrit, klor ve kloramini gideren; kurşun ve bakır gibi ağır metalleri bağlayıp nitratı azaltan geniş etkili su düzenleyici · ürün kodu 03003 · 2.000 litre için · standart doz 20 litreye 5 ml, gerektiğinde beş kata kadar uygulanabilir"],
  ],"2026-10-23"),
  ...products("Sera","water_conditioner","https://www.sera.de/en/product/freshwater-aquarium/sera-mineral-salt/",[
    ["mineral salt 100 ml / 105 g","Mineralce fakir ve ozmoz suyu için suda çözünen kalsiyum, magnezyum, potasyum ve iz element karışımı · ürün kodu 03399 · 2.100 litre için · KH ve pH'ı değiştirmeden yalnız GH'ı hafifçe yükseltir"],
    ["mineral salt 250 ml / 270 g","Mineralce fakir ve ozmoz suyu için suda çözünen kalsiyum, magnezyum, potasyum ve iz element karışımı · ürün kodu 03400 · 5.400 litre için · KH ve pH'ı değiştirmeden yalnız GH'ı hafifçe yükseltir"],
    ["mineral salt 2200 ml / 2,3 kg","Mineralce fakir ve ozmoz suyu için suda çözünen kalsiyum, magnezyum, potasyum ve iz element karışımı · ürün kodu 03403 · 50.000 litre için · KH ve pH'ı değiştirmeden yalnız GH'ı hafifçe yükseltir"],
  ],"2026-10-23"),
  ...products("Sera","water_conditioner","https://www.sera.de/de/produkt/suesswasseraquarium/sera-khph-plus/",[
    ["KH/pH-plus 100 ml","Karbonat sertliğini kalıcı yükselten ve pH'ı tamponlayıp güvenle stabilize eden düzenleyici · ürün kodu 03810 · 600 sertlik litresi için · 30 litreye 5 ml, KH'ı 1 °dKH yükseltir; günde en fazla 2 °dKH artırın"],
    ["KH/pH-plus 250 ml","Karbonat sertliğini kalıcı yükselten ve pH'ı tamponlayıp güvenle stabilize eden düzenleyici · ürün kodu 03812 · 1.500 sertlik litresi için · 30 litreye 5 ml, KH'ı 1 °dKH yükseltir; günde en fazla 2 °dKH artırın"],
    ["KH/pH-plus 500 ml","Karbonat sertliğini kalıcı yükselten ve pH'ı tamponlayıp güvenle stabilize eden düzenleyici · ürün kodu 03814 · 3.000 sertlik litresi için · 30 litreye 5 ml, KH'ı 1 °dKH yükseltir; günde en fazla 2 °dKH artırın"],
    ["KH/pH-plus 2500 ml","Karbonat sertliğini kalıcı yükselten ve pH'ı tamponlayıp güvenle stabilize eden düzenleyici · ürün kodu 03815 · 15.000 sertlik litresi için · 30 litreye 5 ml, KH'ı 1 °dKH yükseltir; günde en fazla 2 °dKH artırın"],
    ["KH/pH-plus 5000 ml","Karbonat sertliğini kalıcı yükselten ve pH'ı tamponlayıp güvenle stabilize eden düzenleyici · ürün kodu 03816 · 30.000 sertlik litresi için · 30 litreye 5 ml, KH'ı 1 °dKH yükseltir; günde en fazla 2 °dKH artırın"],
  ],"2026-10-23"),
  ...products("Sera","water_conditioner","https://www.sera.de/de/produkt/suesswasseraquarium/sera-phkh-minus/",[
    ["pH/KH-minus 100 ml","Yüksek KH ve pH'ı kısa sürede düşürüp yumuşak su koşullarını destekleyen asitli düzenleyici · ürün kodu 03540 · 400 litre için · konsantre ürün ciltte ciddi yanık ve göz hasarı riski taşır; etiketi ve kullanım talimatını izleyin"],
    ["pH/KH-minus 250 ml","Yüksek KH ve pH'ı kısa sürede düşürüp yumuşak su koşullarını destekleyen asitli düzenleyici · ürün kodu 03550 · 1.000 litre için · konsantre ürün ciltte ciddi yanık ve göz hasarı riski taşır; etiketi ve kullanım talimatını izleyin"],
    ["pH/KH-minus 500 ml","Yüksek KH ve pH'ı kısa sürede düşürüp yumuşak su koşullarını destekleyen asitli düzenleyici · ürün kodu 03560 · 2.000 litre için · konsantre ürün ciltte ciddi yanık ve göz hasarı riski taşır; etiketi ve kullanım talimatını izleyin"],
    ["pH/KH-minus 2500 ml","Yüksek KH ve pH'ı kısa sürede düşürüp yumuşak su koşullarını destekleyen asitli düzenleyici · ürün kodu 03579 · 10.000 litre için · konsantre ürün ciltte ciddi yanık ve göz hasarı riski taşır; etiketi ve kullanım talimatını izleyin"],
    ["pH/KH-minus 5000 ml","Yüksek KH ve pH'ı kısa sürede düşürüp yumuşak su koşullarını destekleyen asitli düzenleyici · ürün kodu 03580 · 20.000 litre için · konsantre ürün ciltte ciddi yanık ve göz hasarı riski taşır; etiketi ve kullanım talimatını izleyin"],
  ],"2026-10-23"),
  ...products("Sera","water_conditioner","https://www.sera.de/de/produkt/suesswasseraquarium/sera-phosvecclear/",[
    ["phosvec clear 50 ml","Fazla fosfatı ve bulanıklığı hemen bağlayıp parçacıkları filtrenin yakalayabileceği hâle getiren, alg gelişimini sınırlamaya yardımcı düzenleyici · ürün kodu 03391 · 200 litre için"],
    ["phosvec clear 100 ml","Fazla fosfatı ve bulanıklığı hemen bağlayıp parçacıkları filtrenin yakalayabileceği hâle getiren, alg gelişimini sınırlamaya yardımcı düzenleyici · ürün kodu 03390 · 400 litre için"],
    ["phosvec clear 250 ml","Fazla fosfatı ve bulanıklığı hemen bağlayıp parçacıkları filtrenin yakalayabileceği hâle getiren, alg gelişimini sınırlamaya yardımcı düzenleyici · ürün kodu 03392 · 1.000 litre için"],
    ["phosvec clear 500 ml","Fazla fosfatı ve bulanıklığı hemen bağlayıp parçacıkları filtrenin yakalayabileceği hâle getiren, alg gelişimini sınırlamaya yardımcı düzenleyici · ürün kodu 03394 · 2.000 litre için"],
    ["phosvec clear 2500 ml","Fazla fosfatı ve bulanıklığı hemen bağlayıp parçacıkları filtrenin yakalayabileceği hâle getiren, alg gelişimini sınırlamaya yardımcı düzenleyici · ürün kodu 03395 · 10.000 litre için"],
    ["phosvec clear 5000 ml","Fazla fosfatı ve bulanıklığı hemen bağlayıp parçacıkları filtrenin yakalayabileceği hâle getiren, alg gelişimini sınırlamaya yardımcı düzenleyici · ürün kodu 03396 · 20.000 litre için"],
  ],"2026-10-23"),
  ...products("Sera","bacteria","https://www.sera.de/us/product/freshwater-aquarium/sera-bio-nitrivec/",[
    ["bio nitrivec 50 ml","Amonyum, nitrit ve organik atıkların biyolojik parçalanmasını destekleyen; mineral volkanik kaya ile bakterilere yerleşim alanı sağlayıp bulanıklığı bağlayan sıvı biyofiltre ürünü · ürün kodu 03730 · 125 litre için · standart doz 25 litreye 10 ml; aquatan ile birlikte 24 saat sonra balık eklemeye imkân verir"],
    ["bio nitrivec 100 ml","Amonyum, nitrit ve organik atıkların biyolojik parçalanmasını destekleyen; mineral volkanik kaya ile bakterilere yerleşim alanı sağlayıp bulanıklığı bağlayan sıvı biyofiltre ürünü · ürün kodu 03740 · 250 litre için · standart doz 25 litreye 10 ml; aquatan ile birlikte 24 saat sonra balık eklemeye imkân verir"],
    ["bio nitrivec 250 ml","Amonyum, nitrit ve organik atıkların biyolojik parçalanmasını destekleyen; mineral volkanik kaya ile bakterilere yerleşim alanı sağlayıp bulanıklığı bağlayan sıvı biyofiltre ürünü · ürün kodu 03750 · 625 litre için · standart doz 25 litreye 10 ml; aquatan ile birlikte 24 saat sonra balık eklemeye imkân verir"],
    ["bio nitrivec 500 ml","Amonyum, nitrit ve organik atıkların biyolojik parçalanmasını destekleyen; mineral volkanik kaya ile bakterilere yerleşim alanı sağlayıp bulanıklığı bağlayan sıvı biyofiltre ürünü · ürün kodu 03760 · 1.250 litre için · standart doz 25 litreye 10 ml; aquatan ile birlikte 24 saat sonra balık eklemeye imkân verir"],
    ["bio nitrivec 2500 ml","Amonyum, nitrit ve organik atıkların biyolojik parçalanmasını destekleyen; mineral volkanik kaya ile bakterilere yerleşim alanı sağlayıp bulanıklığı bağlayan sıvı biyofiltre ürünü · ürün kodu 03779 · 6.250 litre için · standart doz 25 litreye 10 ml; aquatan ile birlikte 24 saat sonra balık eklemeye imkân verir"],
    ["bio nitrivec 5000 ml","Amonyum, nitrit ve organik atıkların biyolojik parçalanmasını destekleyen; mineral volkanik kaya ile bakterilere yerleşim alanı sağlayıp bulanıklığı bağlayan sıvı biyofiltre ürünü · ürün kodu 03780 · 12.500 litre için · standart doz 25 litreye 10 ml; aquatan ile birlikte 24 saat sonra balık eklemeye imkân verir"],
  ],"2026-10-23"),
  ...products("Sera","bacteria","https://www.sera.de/us/product/freshwater-aquarium/sera-filter-biostart/",[
    ["filter biostart 50 ml","Organik atık ve dip tortusunu parçalayıp nitrifikasyonu hazırlayan bakteri ve biyolojik aktif enzim karışımı · ürün kodu 03795 · 2.000 litre için · haftada bir 200 litreye 5 ml doğrudan filtre süngerine; kullanmadan önce çalkalayın, aşırı dozlamayın ve açıldıktan sonra serin yerde saklayın"],
  ],"2026-10-23"),
  ...products("Sera","water_conditioner","https://www.sera.de/en/product/freshwater-aquarium/sera-catappa-leaves/",[
    ["Catappa Leaves S 10 adet / 10–15 cm","Doğal davranış ve üreme isteğini destekleyen, 2–3 hafta hümik madde salan tropik badem yaprağı · ürün kodu 32273 · 30 litreye bir yaprak; 24–48 saatte batar"],
    ["Catappa Leaves M 10 adet / 16–20 cm","Doğal davranış ve üreme isteğini destekleyen, 2–3 hafta hümik madde salan tropik badem yaprağı · ürün kodu 32274 · 60 litreye bir yaprak; 24–48 saatte batar"],
    ["Catappa Leaves XXL 10 adet / 30–35 cm","Doğal davranış ve üreme isteğini destekleyen, 2–3 hafta hümik madde salan tropik badem yaprağı · ürün kodu 32275 · 100 litreye bir yaprak; 24–48 saatte batar"],
  ],"2026-10-23"),
  ...products("Sera","water_conditioner","https://www.sera.de/en/product/freshwater-aquarium/sera-alder-cones/",[
    ["alder cones 50 adet","Siyah su koşullarını ve doğal davranışları destekleyen, tanen salıp pH'ı doğal biçimde düşüren kızılağaç kozalağı · ürün kodu 32276 · standart doz 10 litreye bir kozalak; hastalık tedavisine destek amacıyla litreye bir kozalağa kadar uygulanabilir, bu dozda pH izlenmelidir"],
  ],"2026-10-23"),
  ...products("Sera","water_conditioner","https://www.sera.de/de/produkt/suesswasseraquarium/sera-blackwater-aquatan/",[
    ["blackwater aquatan 100 ml","Ağır metalleri hemen bağlayan, pH'ı değiştirmeden tropik siyah su etkisi ve uzun süreli kehribar renk oluşturan düzenleyici · ürün kodu 03140 · 500 litre için · 50 litreye 10 ml"],
    ["blackwater aquatan 5000 ml","Ağır metalleri hemen bağlayan, pH'ı değiştirmeden tropik siyah su etkisi ve uzun süreli kehribar renk oluşturan düzenleyici · ürün kodu 03180 · 25.000 litre için · 50 litreye 10 ml"],
  ],"2026-10-23"),
  ...products("Sera","water_conditioner","https://www.sera.de/en/product/freshwater-aquarium/sera-nitrite-minus/",[
    ["Nitrite-minus 50 ml","Doz başına litre başına 1,5 mg'a kadar nitriti organik aminlere dönüştürerek hemen uzaklaştıran, balık/omurgasız/bitkilerce iyi tolere edilen düzenleyici · ürün kodu 32299 · 200 litre için · 20 litreye 5 ml, beş kata kadar dozlanabilir"],
    ["Nitrite-minus 100 ml","Doz başına litre başına 1,5 mg'a kadar nitriti organik aminlere dönüştürerek hemen uzaklaştıran, balık/omurgasız/bitkilerce iyi tolere edilen düzenleyici · ürün kodu 32300 · 400 litre için · 20 litreye 5 ml, beş kata kadar dozlanabilir"],
    ["Nitrite-minus 250 ml","Doz başına litre başına 1,5 mg'a kadar nitriti organik aminlere dönüştürerek hemen uzaklaştıran, balık/omurgasız/bitkilerce iyi tolere edilen düzenleyici · ürün kodu 32301 · 1.000 litre için · 20 litreye 5 ml, beş kata kadar dozlanabilir"],
    ["Nitrite-minus 500 ml","Doz başına litre başına 1,5 mg'a kadar nitriti organik aminlere dönüştürerek hemen uzaklaştıran, balık/omurgasız/bitkilerce iyi tolere edilen düzenleyici · ürün kodu 32302 · 2.000 litre için · 20 litreye 5 ml, beş kata kadar dozlanabilir"],
    ["Nitrite-minus 2500 ml","Doz başına litre başına 1,5 mg'a kadar nitriti organik aminlere dönüştürerek hemen uzaklaştıran, balık/omurgasız/bitkilerce iyi tolere edilen düzenleyici · ürün kodu 32303 · 10.000 litre için · 20 litreye 5 ml, beş kata kadar dozlanabilir"],
    ["Nitrite-minus 5000 ml","Doz başına litre başına 1,5 mg'a kadar nitriti organik aminlere dönüştürerek hemen uzaklaştıran, balık/omurgasız/bitkilerce iyi tolere edilen düzenleyici · ürün kodu 32304 · 20.000 litre için · 20 litreye 5 ml, beş kata kadar dozlanabilir"],
  ],"2026-10-23"),
  ...products("Sera","water_conditioner","https://www.sera.de/us/product/freshwater-aquarium/sera-chlorex/",[
    ["chlor-ex","Tatlı ve deniz suyu akvaryumlarında klor, kloramin ve amonyumu hızla gideren, pH değerini değiştirmeyen su düzenleyici · üretici güncel ürün sayfasında hacim veya ürün kodu yayımlamıyor"],
  ],"2026-10-23"),
  ...products("Sera","water_conditioner","https://www.sera.de/en/product/freshwater-aquarium/sera-o2-plus/",[
    ["O2 plus 250 ml / 260 g","Özellikle yüksek sıcaklıkta akut oksijen eksikliğine hızlı destek sağlayan, organik madde parçalanmasını hızlandırıp kokuyu azaltan granül · ürün kodu 03415 · 5.200 litre için · doğrudan suya serpilir"],
  ],"2026-10-23"),
  ...products("Sera","water_conditioner","https://www.sera.de/de/produkt/suesswasseraquarium/sera-ghkh-plus/",[
    ["GH/KH-plus 250 ml / 275 g","Ozmoz veya yumuşak musluk suyunda toplam ve karbonat sertliğini birlikte yükselten, kalsiyum ve magnezyum sağlayan mineral karışımı · ürün kodu 03818 · 5.500 °dKH kapasite · 100 litreye yaklaşık 5 g, KH'ı 1 °dKH ve GH'ı 0,5 °dGH yükseltir; 24 saatte en fazla 2 °dKH ve 1 °dGH artırın"],
    ["GH/KH-plus 2200 ml / 2,5 kg","Ozmoz veya yumuşak musluk suyunda toplam ve karbonat sertliğini birlikte yükselten, kalsiyum ve magnezyum sağlayan mineral karışımı · ürün kodu 03819 · 50.000 °dKH kapasite · 100 litreye yaklaşık 5 g, KH'ı 1 °dKH ve GH'ı 0,5 °dGH yükseltir; 24 saatte en fazla 2 °dKH ve 1 °dGH artırın"],
  ],"2026-10-23"),
  ...products("Sera","water_conditioner","https://www.sera.de/en/product/freshwater-aquarium/sera-super-peat/",[
    ["super peat 500 g","Filtreye yerleştirildiğinde KH'ı nazikçe düşüren, hafif asidik pH'ı stabilize eden ve hümik/fulvik asit salan doğal siyah torf granülü · ürün kodu 08410 · 250 litreye kadar · ortalama kullanım süresi KH ve su değişimine bağlı olarak 4–6 hafta"],
  ],"2026-10-23"),
  ...products("Sera","water_conditioner","https://www.sera.de/en/product/freshwater-aquarium/sera-goldy-aquatan/",[
    ["goldy aquatan 50 ml","Japon balıkları ve süs formları için klor, kloramin ve amonyağı gideren; ağır metalleri bağlayıp kalsiyum, magnezyum, manganez ve iyot ekleyen su düzenleyici · ürün kodu 03057 · 200 litre için"],
  ],"2026-10-23"),
  ...products("Sera","water_conditioner","https://www.sera.de/us/product/freshwater-aquarium/sera-betta-aquatan/",[
    ["betta aquatan 50 ml","Betta ve diğer labirent balıkları için klor, kloramin ve amonyağı gideren; ağır metalleri bağlayıp kalsiyum, magnezyum, manganez ve iyot ekleyen, nano akvaryumlara uygun su düzenleyici · ürün kodu 03035 · 200 litre için"],
  ],"2026-10-23"),
  ...products("Sera","water_conditioner","https://www.sera.de/us/product/freshwater-aquarium/sera-shrimp-mineral-salt/",[
    ["shrimp mineral salt 100 ml / 105 g","Karidesler ve diğer omurgasızlar için kalsiyum, magnezyum, potasyum ve iz element sağlayan; KH ile pH'ı etkilemeden mineralce fakir ozmoz suyunu destekleyen karışım · ürün kodu 03398 · 420 litre için · ciddi göz tahrişine yol açabilir; etiketi ve kullanım talimatını izleyin"],
  ],"2026-10-23"),
  ...products("Sera","test","https://www.sera.de/en/product/freshwater-aquarium/sera-quick-test-1/",[
    ["Quick Test 50 strip","pH, KH, GH, nitrat, nitrit ve kloru hızlı kontrol eden 50 test şeridi · ürün kodu 04960 · doğrudan CO₂ ölçmez; hassas sapmalar için ilgili damlalı testle doğrulama gerekir"],
  ],"2026-10-24"),
  ...products("Sera","test","https://www.sera.de/en/product/freshwater-aquarium/sera-ph-test-1/",[
    ["pH Test 15 ml","pH değerini 4,5–9,0 aralığında 0,5 pH adımlarıyla ölçen; küvet, şırınga ve değerlendirme kartı içeren damlalı test · ürün kodu 04310 · yaklaşık 100 ölçüm"],
  ],"2026-10-24"),
  ...products("Sera","test","https://www.sera.de/en/product/freshwater-aquarium/sera-kh-test-1/",[
    ["KH Test 15 ml","Karbonat sertliğini ölçerek pH tampon kapasitesinin izlenmesini sağlayan; küvet, şırınga ve değerlendirme kartı içeren damlalı test · ürün kodu 04210 · yaklaşık 390 °dKH ölçüm kapasitesi"],
  ],"2026-10-24"),
  ...products("Sera","test","https://www.sera.de/en/product/freshwater-aquarium/sera-gh-test-1/",[
    ["GH Test 15 ml","Kalsiyum ve magnezyumla ilişkili toplam sertliği ölçen; küvet, şırınga ve değerlendirme kartı içeren damlalı test · ürün kodu 04110 · yaklaşık 420 °dGH ölçüm kapasitesi"],
  ],"2026-10-24"),
  ...products("Sera","test","https://www.sera.de/en/product/freshwater-aquarium/sera-ammonia-test/",[
    ["Ammonia Test 15 ml","Toplam amonyum ve amonyak yoğunluğunu ölçen; gerçek toksik amonyak düzeyini pH değeriyle birlikte değerlendiren tam test seti · ürün kodu 04910 · yaklaşık 60 ölçüm"],
  ],"2026-10-24"),
  ...products("Sera","test","https://www.sera.de/us/product/freshwater-aquarium/sera-nitrite-test/",[
    ["Nitrite Test 15 ml","Yeni kurulum ve filtre temizliği sonrasında toksik nitrit yükselişini erken saptamak için küvet, şırınga ve değerlendirme kartı içeren damlalı test · ürün kodu 04410 · yaklaşık 75 ölçüm"],
  ],"2026-10-24"),
  ...products("Sera","test","https://www.sera.de/us/product/freshwater-aquarium/sera-nitrate-test",[
    ["Nitrate Test 15 ml","Organik yükün son ürünü ve bitki besini olan nitratı ölçen; küvet, şırınga, ölçü kaşığı ve değerlendirme kartı içeren test · ürün kodu 04510 · yaklaşık 60 ölçüm"],
  ],"2026-10-24"),
  ...products("Sera","test","https://www.sera.de/en/product/freshwater-aquarium/sera-phosphate-test/",[
    ["Phosphate Test 15 ml","Organik atık birikimi ve alg riskiyle ilişkili fosfatı ölçen; küvet, şırınga, ölçü kaşığı ve değerlendirme kartı içeren test · ürün kodu 04930 · yaklaşık 60 ölçüm"],
  ],"2026-10-24"),
  ...products("Sera","test","https://www.sera.de/en/product/pond/sera-iron-test/",[
    ["Iron Test 15 ml","Şelatlı demiri de algılayan bitki bakım testi · ürün kodu 04610 · yaklaşık 75 ölçüm · hedef demir aralığı 0,1–0,25 mg/L; 0,5 mg/L üzeri yosun riskini artırabileceğinden kaçınılmalıdır"],
  ],"2026-10-24"),
  ...products("Sera","test","https://www.sera.de/en/product/pond/sera-oxygen-test/",[
    ["Oxygen Test 15 ml","Yüksek sıcaklık veya yoğun canlı yükünde çözünmüş oksijeni ölçen, yaklaşık 60 ölçümlük damlalı test · ürün kodu 04914 · reaktif 2 ciddi cilt yanığı ve göz hasarı riski taşır; güvenlik talimatını izleyin"],
  ],"2026-10-24"),
  ...products("Sera","test","https://www.sera.de/en/product/freshwater-aquarium/sera-chlorine-test/",[
    ["Chlorine Test 15 ml","Musluk suyundaki balık solungaçları, mukozası ve filtre bakterileri için zararlı kloru ölçen tam test seti · ürün kodu 04810 · yaklaşık 45 ölçüm"],
  ],"2026-10-24"),
  ...products("Sera","test","https://www.sera.de/en/product/freshwater-aquarium/sera-calcium-test/",[
    ["Calcium Test 15 ml","Reef ve deniz akvaryumlarında kalsiyumu 20 mg/L adımlarla ölçen, yaklaşık 7.500 mg kalsiyum ölçüm kapasiteli test · ürün kodu 04920 · üretici hedefi yaklaşık 420 mg/L deniz suyu kalsiyumudur; tatlı su bakım testi değildir"],
  ],"2026-10-24"),
  ...products("Sera","fertilizer","https://www.sera.de/us/product/freshwater-aquarium/sera-florena/",[
    ["florena 50 ml","Yapraktan beslenen akvaryum bitkileri için UV-C altında da kullanılabilir kalan demir, mineral ve iz element içeren; nitrat ve fosfat içermeyen sıvı temel gübre · ürün kodu 03215 · 200 litre için · haftada bir 20 litreye 5 ml veya gereksinime göre"],
    ["florena 100 ml","Yapraktan beslenen akvaryum bitkileri için UV-C altında da kullanılabilir kalan demir, mineral ve iz element içeren; nitrat ve fosfat içermeyen sıvı temel gübre · ürün kodu 03240 · 400 litre için · haftada bir 20 litreye 5 ml veya gereksinime göre"],
    ["florena 250 ml","Yapraktan beslenen akvaryum bitkileri için UV-C altında da kullanılabilir kalan demir, mineral ve iz element içeren; nitrat ve fosfat içermeyen sıvı temel gübre · ürün kodu 03250 · 1.000 litre için · haftada bir 20 litreye 5 ml veya gereksinime göre"],
    ["florena 500 ml","Yapraktan beslenen akvaryum bitkileri için UV-C altında da kullanılabilir kalan demir, mineral ve iz element içeren; nitrat ve fosfat içermeyen sıvı temel gübre · ürün kodu 03260 · 2.000 litre için · haftada bir 20 litreye 5 ml veya gereksinime göre"],
    ["florena 5000 ml","Yapraktan beslenen akvaryum bitkileri için UV-C altında da kullanılabilir kalan demir, mineral ve iz element içeren; nitrat ve fosfat içermeyen sıvı temel gübre · ürün kodu 03280 · 20.000 litre için · haftada bir 20 litreye 5 ml veya gereksinime göre"],
  ],"2026-10-24"),
  ...products("Sera","fertilizer","https://www.sera.de/en/product/freshwater-aquarium/sera-florenette/",[
    ["florenette 24 tablet / 22 g","Kökten beslenen akvaryum bitkileri için mineral, iz element ve uzun süre kullanılabilir demir sağlayan; nitrat ve fosfat içermeyen dip tableti · ürün kodu 03320 · bir tableti köklerin yakınına 1–2 cm derine bastırın, gerekirse bölüp dağıtın"],
    ["florenette 50 tablet","Kökten beslenen akvaryum bitkileri için mineral, iz element ve uzun süre kullanılabilir demir sağlayan; nitrat ve fosfat içermeyen dip tableti · ürün kodu 03330 · bir tableti köklerin yakınına 1–2 cm derine bastırın, gerekirse bölüp dağıtın"],
  ],"2026-10-24"),
  ...products("Sera","fertilizer","https://www.sera.de/en/product/freshwater-aquarium/sera-flore-1-carbo/",[
    ["flore 1 carbo 50 ml","Akvaryum bitkileri için CO₂ sistemine alternatif veya tamamlayıcı, omurgasızlarca iyi tolere edilen sıvı karbon kaynağı · ürün kodu 03341 · 200 litre için · günlük 20 litreye 5 ml veya gereksinime göre"],
    ["flore 1 carbo 250 ml","Akvaryum bitkileri için CO₂ sistemine alternatif veya tamamlayıcı, omurgasızlarca iyi tolere edilen sıvı karbon kaynağı · ürün kodu 03342 · 1.000 litre için · günlük 20 litreye 5 ml veya gereksinime göre"],
    ["flore 1 carbo 500 ml","Akvaryum bitkileri için CO₂ sistemine alternatif veya tamamlayıcı, omurgasızlarca iyi tolere edilen sıvı karbon kaynağı · ürün kodu 03343 · 2.000 litre için · günlük 20 litreye 5 ml veya gereksinime göre"],
  ],"2026-10-24"),
  ...products("Sera","fertilizer","https://www.sera.de/us/product/freshwater-aquarium/sera-flore-2-ferro/",[
    ["flore 2 ferro 50 ml","Yoğun aydınlatılan veya hızlı büyüyen bitkiler için UV-stabil ve biyoyararlanılabilir ilave demir sağlayan; nitrat ve fosfat içermeyen sıvı gübre · ürün kodu 03344 · 200 litre için · haftada bir 20 litreye 5 ml veya gereksinime göre, depo etkisi bir haftaya kadar"],
    ["flore 2 ferro 250 ml","Yoğun aydınlatılan veya hızlı büyüyen bitkiler için UV-stabil ve biyoyararlanılabilir ilave demir sağlayan; nitrat ve fosfat içermeyen sıvı gübre · ürün kodu 03345 · 1.000 litre için · haftada bir 20 litreye 5 ml veya gereksinime göre, depo etkisi bir haftaya kadar"],
    ["flore 2 ferro 500 ml","Yoğun aydınlatılan veya hızlı büyüyen bitkiler için UV-stabil ve biyoyararlanılabilir ilave demir sağlayan; nitrat ve fosfat içermeyen sıvı gübre · ürün kodu 03346 · 2.000 litre için · haftada bir 20 litreye 5 ml veya gereksinime göre, depo etkisi bir haftaya kadar"],
  ],"2026-10-24"),
  ...products("Sera","fertilizer","https://www.sera.de/en/product/freshwater-aquarium/sera-flore-3-vital/",[
    ["flore 3 vital 50 ml","Akvaryum bitkilerindeki besin açıklarını kapatmaya ve dayanıklılığı desteklemeye yönelik mikro besin, iz element ve vitamin karışımı; nitrat ve fosfat içermez · ürün kodu 03347 · 200 litre için"],
    ["flore 3 vital 250 ml","Akvaryum bitkilerindeki besin açıklarını kapatmaya ve dayanıklılığı desteklemeye yönelik mikro besin, iz element ve vitamin karışımı; nitrat ve fosfat içermez · ürün kodu 03348 · 1.000 litre için"],
  ],"2026-10-24"),
  ...products("Sera","fertilizer","https://www.sera.de/us/product/freshwater-aquarium/sera-flore-4-plant/",[
    ["flore 4 plant 50 ml","Canlı yükü az veya olmayan aquascape ve Hollanda tipi akvaryumlar için azot, fosfor ve potasyum sağlayan NPK makro besin gübresi · ürün kodu 03349 · 200–1.000 litre için"],
    ["flore 4 plant 250 ml","Canlı yükü az veya olmayan aquascape ve Hollanda tipi akvaryumlar için azot, fosfor ve potasyum sağlayan NPK makro besin gübresi · ürün kodu 03350 · 1.000–5.000 litre için"],
  ],"2026-10-24"),
  ...products("Sera","filter_media","https://www.sera.de/us/product/freshwater-aquarium/sera-siporax-professional-15-mm/",[
    ["siporax Professional 15 mm 500 ml / 145 g","Tatlı ve deniz suyunda biyolojik filtrasyon için 270 m²/L bakteri yüzeyi sunan sinterlenmiş cam halka medya · ürün kodu 08471 · 100 litre için · mekanik ön filtrasyonun ardından son filtre aşamasına yerleştirin; akış belirgin azalınca akvaryum suyunda nazikçe durulayın, yalnız halkalar parçalandığında değiştirin"],
    ["siporax Professional 15 mm 1000 ml / 290 g","Tatlı ve deniz suyunda biyolojik filtrasyon için 270 m²/L bakteri yüzeyi sunan sinterlenmiş cam halka medya · ürün kodu 08472 · 200 litre için · mekanik ön filtrasyonun ardından son filtre aşamasına yerleştirin; akış belirgin azalınca akvaryum suyunda nazikçe durulayın, yalnız halkalar parçalandığında değiştirin"],
    ["siporax Professional 15 mm 10 L / 2,9 kg","Tatlı ve deniz suyunda biyolojik filtrasyon için 270 m²/L bakteri yüzeyi sunan sinterlenmiş cam halka medya · ürün kodu 08474 · canlı yüküne göre 2.000–4.100 litre için · mekanik ön filtrasyonun ardından son filtre aşamasına yerleştirin; akış belirgin azalınca akvaryum suyunda nazikçe durulayın, yalnız halkalar parçalandığında değiştirin"],
  ],"2026-10-24"),
  ...products("Sera","filter_media","https://www.sera.de/de/produkt/suesswasseraquarium/sera-siporax-mini-professional/",[
    ["siporax mini Professional 35 g","Küçük akvaryum filtreleri için sinterlenmiş cam biyolojik medya · ürün kodu 06853 · güncel Alman resmî sayfasına göre 30 litre için; diğer resmî dil sayfalarında 25 litre görülebildiğinden yerel ambalaj etiketini kontrol edin"],
    ["siporax mini Professional 500 ml / 130 g","Küçük akvaryum filtreleri için sinterlenmiş cam biyolojik medya · ürün kodu 08477 · 100 litre için"],
    ["siporax mini Professional 1000 ml / 270 g","Küçük akvaryum filtreleri için sinterlenmiş cam biyolojik medya · ürün kodu 08476 · 200 litre için"],
  ],"2026-10-24"),
  ...products("Sera","filter_media","https://www.sera.de/en/product/freshwater-aquarium/sera-siporax-nitrate-minus-professional/",[
    ["siporax Nitrate-minus Professional 500 ml / 145 g","Nitrit ve amonyum dönüşümüne paralel biyolojik nitrat giderimini karbon kaynaklı biyopolimer kürelerle destekleyen filtre medyası · ürün kodu 32631 · 150 litre için · 15 litreye bir biyopolimer küre; yoğun bitkili özel kurulumlarda azot eksikliği oluşabileceğinden bitki besinini ölçümle yönetin"],
  ],"2026-10-24"),
  ...products("Sera","filter_media","https://www.sera.de/de/produkt/meerwasseraquarium/sera-siporax-algovec-professional/",[
    ["siporax algovec Professional 35 g","Taşıyıcı medyadaki yararlı bakterilerle fosfat birikimini ve alg büyümesini besin rekabeti yoluyla azaltmaya yardımcı biyolojik filtre medyası · ürün kodu 32053 · 100 litre için"],
    ["siporax algovec Professional 500 ml / 210 g","Taşıyıcı medyadaki yararlı bakterilerle fosfat birikimini ve alg büyümesini besin rekabeti yoluyla azaltmaya yardımcı biyolojik filtre medyası · ürün kodu 08484 · 600 litre için"],
  ],"2026-10-24"),
  ...products("Sera","filter_media","https://www.sera.de/de/produkt/suesswasseraquarium/sera-siporax-bio-active-professional/",[
    ["siporax bio active Professional 50 ml / 25 g","Su ile temas ettiğinde etkinleşen bakterilerle amonyum ve nitrit gibi kirleticilerin biyolojik parçalanmasını destekleyen kuru su düzenleyici filtre medyası · ürün kodu 32106 · üretici bu ambalaj için litre kapasitesi yayımlamaz"],
    ["siporax bio active Professional 35 g","Su ile temas ettiğinde etkinleşen bakterilerle amonyum ve nitrit gibi kirleticilerin biyolojik parçalanmasını destekleyen kuru su düzenleyici filtre medyası · ürün kodu 32213 · 66 litre için"],
    ["siporax bio active Professional 500 ml / 210 g","Su ile temas ettiğinde etkinleşen bakterilerle amonyum ve nitrit gibi kirleticilerin biyolojik parçalanmasını destekleyen kuru su düzenleyici filtre medyası · ürün kodu 08485 · 400 litre için"],
  ],"2026-10-24"),
  ...products("Sera","filter_media","https://www.sera.de/de/produkt/suesswasseraquarium/sera-crystal-clear-professional/",[
    ["crystal clear Professional 12 ball","Patentli 3B lif yapısıyla 10 µm ve üzerindeki askıda alg ve tortu parçacıklarını tutan, tüm filtre tiplerine uygun mekanik filtre topları · ürün kodu 32052 · 360 litre için · yıkandıktan sonra yaklaşık %80 yeniden kullanılabilir"],
  ],"2026-10-24"),
  ...products("Sera","filter_media","https://www.sera.de/en/product/freshwater-aquarium/sera-phosvec-granulat/",[
    ["Phosvec Granulat 60 g","Tatlı ve deniz suyunda fosfatı yeniden salmadan uzun süre bağlayan alüminyum oksit granül · ürün kodu 32180 · 1.500 mg fosfat bağlama kapasitesi · akvaryum büyüklüğü ve kirliliğe göre üç aya kadar etkin; tozunu solumayın ve göze kaçırmayın"],
    ["Phosvec Granulat 500 g","Tatlı ve deniz suyunda fosfatı yeniden salmadan uzun süre bağlayan alüminyum oksit granül · ürün kodu 08415 · 12.500 mg fosfat bağlama kapasitesi · akvaryum büyüklüğü ve kirliliğe göre üç aya kadar etkin; tozunu solumayın ve göze kaçırmayın"],
  ],"2026-10-24"),
  ...products("Sera","filter_media","https://www.sera.de/en/product/freshwater-aquarium/sera-biopur/",[
    ["biopur 750 g","Oksijen seven nitrifikasyon bakterileri için iri ve pürüzlü yüzey ile kesintisiz su akışı sağlayan kil tüp biyomekanik medya · ürün kodu 08420 · tatlı, deniz ve havuz suyu için; ilk kullanımdan önce iyice yıkayın"],
  ],"2026-10-24"),
  ...products("Sera","filter_media","https://www.sera.de/en/product/freshwater-aquarium/sera-biofibres-fine/",[
    ["biofibres fine 40 g","Kaba kir parçacıklarını yakalayıp sonraki biyolojik medyayı koruyan biyomekanik ön filtre lifi · ürün kodu 08450 · yumurtlama medyası, yavru saklanma alanı ve karides taşıma desteği olarak da kullanılabilir"],
  ],"2026-10-24"),
  ...products("Sera","filter_media","https://www.sera.de/en/product/freshwater-aquarium/sera-biofibres-coarse/",[
    ["biofibres coarse 40 g","Kaba kir parçacıklarını yakalayıp sonraki biyolojik medyayı koruyan biyomekanik ön filtre lifi · ürün kodu 08452 · yumurtlama medyası, yavru saklanma alanı ve karides taşıma desteği olarak da kullanılabilir"],
    ["biofibres coarse 400 g","Kaba kir parçacıklarını yakalayıp sonraki biyolojik medyayı koruyan biyomekanik ön filtre lifi · ürün kodu 08454 · yumurtlama medyası, yavru saklanma alanı ve karides taşıma desteği olarak da kullanılabilir"],
  ],"2026-10-24"),
  ...products("Sera","filter_media","https://www.sera.de/en/product/freshwater-aquarium/sera-silicate-clear/",[
    ["Silicate Clear 60 g","Diatomların kullandığı silikatı kalıcı olarak bağlayan, filtre torbalı emici medya · ürün kodu 32179 · 1.200 mg silikat bağlama kapasitesi · kullanmadan önce akan suyla kısa süre durulayın; silikat yüküne göre üç aya kadar etkin"],
    ["Silicate Clear 500 g","Diatomların kullandığı silikatı kalıcı olarak bağlayan, filtre torbalı emici medya · ürün kodu 08417 · 200–400 litre için · kullanmadan önce akan suyla kısa süre durulayın; silikat yüküne göre üç aya kadar etkin"],
  ],"2026-10-24"),
  ...products("Sera","filter_media","https://www.sera.de/en/product/freshwater-aquarium/sera-super-carbon/",[
    ["super carbon 29 g","Tedavi kalıntılarını, kirleticileri ve renklenmeyi pH nötr ve fosfatsız biçimde adsorbe eden aktif karbon · ürün kodu 06854 · 60 litre için · tedavi sonrasında veya akut zehirlenme şüphesinde kullanılır"],
    ["super carbon 250 g","Tedavi kalıntılarını, kirleticileri ve renklenmeyi pH nötr ve fosfatsız biçimde adsorbe eden aktif karbon · ürün kodu 08400 · 500 litreye kadar · tedavi sonrasında veya akut zehirlenme şüphesinde kullanılır"],
    ["super carbon 1000 g","Tedavi kalıntılarını, kirleticileri ve renklenmeyi pH nötr ve fosfatsız biçimde adsorbe eden aktif karbon · ürün kodu 08405 · 2.000 litreye kadar · tedavi sonrasında veya akut zehirlenme şüphesinde kullanılır"],
  ],"2026-10-24"),
  ...products("Sera","filter_media","https://www.sera.de/us/product/freshwater-aquarium/sera-filter-wool-fine/",[
    ["Filter Wool Fine 100 g","Balık atığı ile yem ve bitki kalıntıları gibi ince parçacıkları biyolojik medyadan önce tutan Oeko-Tex belgeli sentetik mekanik filtre elyafı · ürün kodu 08460 · ilk kullanımdan önce ılık suyla durulayın; birkaç kez yıkanabilir, ağır kirlendiğinde değiştirin"],
    ["Filter Wool Fine 250 g","Balık atığı ile yem ve bitki kalıntıları gibi ince parçacıkları biyolojik medyadan önce tutan Oeko-Tex belgeli sentetik mekanik filtre elyafı · ürün kodu 08463 · ilk kullanımdan önce ılık suyla durulayın; birkaç kez yıkanabilir, ağır kirlendiğinde değiştirin"],
    ["Filter Wool Fine 500 g","Balık atığı ile yem ve bitki kalıntıları gibi ince parçacıkları biyolojik medyadan önce tutan Oeko-Tex belgeli sentetik mekanik filtre elyafı · ürün kodu 08466 · ilk kullanımdan önce ılık suyla durulayın; birkaç kez yıkanabilir, ağır kirlendiğinde değiştirin"],
    ["Filter Wool Fine 1000 g","Balık atığı ile yem ve bitki kalıntıları gibi ince parçacıkları biyolojik medyadan önce tutan Oeko-Tex belgeli sentetik mekanik filtre elyafı · ürün kodu 32319 · ilk kullanımdan önce ılık suyla durulayın; birkaç kez yıkanabilir, ağır kirlendiğinde değiştirin"],
  ],"2026-10-24"),
  ...products("Sera","filter_media","https://www.sera.de/en/product/freshwater-aquarium/sera-filter-wool-coarse/",[
    ["Filter Wool Coarse 1000 g","Kaba atık, yem ve bitki parçalarını biyolojik medyadan önce tutan Oeko-Tex belgeli sentetik mekanik filtre elyafı · ürün kodu 32795 · ilk kullanımdan önce ılık suyla durulayın; birkaç kez yıkanabilir, ağır kirlendiğinde değiştirin"],
  ],"2026-10-24"),
  ...products("Sera","treatment","https://www.sera.de/de/produkt/suesswasseraquarium/sera-phyto-med-mycozid/",[
    ["Phyto med Mycozid 30 ml","Erken evre Saprolegnia/Achlya dış mantarı ve yumurta mantarına karşı kekik yağı temelli süs balığı ilacı · ürün kodu 32624 · 300–400 litre için · 1., 3. ve 5. gün 40 litreye 1 ml; ağır durumda 7. gün tekrar · nerite salyangozları tolere etmez, UV'yi kapatın ve iyi havalandırın"],
    ["Phyto med Mycozid 100 ml","Erken evre Saprolegnia/Achlya dış mantarı ve yumurta mantarına karşı kekik yağı temelli süs balığı ilacı · ürün kodu 32625 · 1.000–1.300 litre için · 1., 3. ve 5. gün 40 litreye 1 ml; ağır durumda 7. gün tekrar · nerite salyangozları tolere etmez, UV'yi kapatın ve iyi havalandırın"],
  ],"2026-10-24"),
  ...products("Sera","treatment","https://www.sera.de/en/product/freshwater-aquarium/sera-phyto-med-catappa/",[
    ["Phyto med Catappa 50 ml","Terminalia catappa özütüyle dış mantar, bakteri ve Trichodina gibi dış parazitlere karşı kullanılan; yara iyileşmesini destekleyen bitkisel süs balığı tedavisi · ürün kodu 32626 · 400 litre için · güvenli tanı için mümkünse deri veya solungaç sürüntüsünü mikroskopla doğrulayın"],
  ],"2026-10-24"),
  ...products("Sera","treatment","https://www.sera.de/en/product/freshwater-aquarium/sera-phyto-med-tremazid/",[
    ["Phyto med Tremazid 30 ml","Tatlı/deniz suyu ve havuzda deri ve solungaç kurtlarına karşı nane yağı temelli, biyolojik filtreyle uyumlu tedavi · ürün kodu 32176 · uygulamaya göre 300–600 litre için · başka ilaçlarla birlikte kullanmayın ve prospektüsü izleyin"],
    ["Phyto med Tremazid 100 ml","Tatlı/deniz suyu ve havuzda deri ve solungaç kurtlarına karşı nane yağı temelli, biyolojik filtreyle uyumlu tedavi · ürün kodu 32177 · uygulamaya göre 1.000–2.000 litre için · başka ilaçlarla birlikte kullanmayın ve prospektüsü izleyin"],
  ],"2026-10-24"),
  ...products("Sera","treatment","https://www.sera.de/en/product/marine-aquarium/sera-phyto-med-protazid/",[
    ["Phyto med Protazid 30 ml","Beyaz benek ve diğer tek hücreli deri parazitlerine karşı kınakına kökenli kinin hidroklorür tedavisi · ürün kodu 32297 · uygulamaya göre 195–330 litre için · salyangozlar, omurgasızlar ve algler tolere etmez; karantina kabı kullanın, UV'yi kapatıp iyi havalandırın"],
    ["Phyto med Protazid 100 ml","Beyaz benek ve diğer tek hücreli deri parazitlerine karşı kınakına kökenli kinin hidroklorür tedavisi · ürün kodu 32279 · uygulamaya göre 650–1.100 litre için · salyangozlar, omurgasızlar ve algler tolere etmez; karantina kabı kullanın, UV'yi kapatıp iyi havalandırın"],
  ],"2026-10-24"),
  ...products("Sera","treatment","https://www.sera.de/en/product/freshwater-aquarium/sera-phyto-med-baktazid/",[
    ["Phyto med Baktazid 30 ml","Aeromonas, Pseudomonas ve Vibrio kaynaklı dış deri/solungaç enfeksiyonları ile yüzgeç ve solungaç çürümesine karşı kekik yağı temelli tedavi · ürün kodu 32280 · uygulamaya göre 400–600 litre için · 1. ve 3. gün 40 litreye 1 ml; ağır durumda 5. gün tekrar · UV'yi kapatın ve iyi havalandırın"],
    ["Phyto med Baktazid 100 ml","Aeromonas, Pseudomonas ve Vibrio kaynaklı dış deri/solungaç enfeksiyonları ile yüzgeç ve solungaç çürümesine karşı kekik yağı temelli tedavi · ürün kodu 32281 · uygulamaya göre 1.300–2.000 litre için · 1. ve 3. gün 40 litreye 1 ml; ağır durumda 5. gün tekrar · UV'yi kapatın ve iyi havalandırın"],
  ],"2026-10-24"),
  ...products("Sera","treatment","https://www.sera.de/de/produkt/suesswasseraquarium/sera-ectopur/",[
    ["ectopur 100 ml / 130 g","Hastalık ve stres dönemlerinde solunumu, mukozanın yenilenmesini ve dış hastalık tedavilerini destekleyen oksijen salan tuz karışımı · ürün kodu 02320 · 650 litre için · tek başına kesin hastalık tedavisi değildir"],
    ["ectopur 2200 ml / 2,5 kg","Hastalık ve stres dönemlerinde solunumu, mukozanın yenilenmesini ve dış hastalık tedavilerini destekleyen oksijen salan tuz karışımı · ürün kodu 02330 · 12.500 litre için · tek başına kesin hastalık tedavisi değildir"],
  ],"2026-10-24"),
  ...products("Sera","treatment","https://www.sera.de/us/product/freshwater-aquarium/sera-med-professional-protazol/",[
    ["med Professional Protazol 25 ml","Tatlı suda beyaz benek ve Ichthyobodo, Apiosoma, Trichodina, Chilodonella gibi tek hücreli deri parazitlerine karşı renksiz tedavi · ürün kodu 02180 · 500 litre için · bitki, salyangoz ve karideslerle uyumlu; kıkırdaklı balıklar tolere etmez"],
    ["med Professional Protazol 100 ml","Tatlı suda beyaz benek ve Ichthyobodo, Apiosoma, Trichodina, Chilodonella gibi tek hücreli deri parazitlerine karşı renksiz tedavi · ürün kodu 02182 · 2.000 litre için · bitki, salyangoz ve karideslerle uyumlu; kıkırdaklı balıklar tolere etmez"],
  ],"2026-10-24"),
  ...products("Sera","treatment","https://www.sera.de/us/product/pond/sera-med-professional-tremazol/",[
    ["med Professional Tremazol 25 ml","Tatlı ve deniz suyunda deri/solungaç kurtları, tenyalar ve bazı digenetik trematodlara karşı prazikuantel temelli tedavi · ürün kodu 02190 · uygulamaya göre 375–500 litre için · yalnız prospektüsteki tanı, doz ve su değişimi planıyla kullanın"],
    ["med Professional Tremazol 100 ml","Tatlı ve deniz suyunda deri/solungaç kurtları, tenyalar ve bazı digenetik trematodlara karşı prazikuantel temelli tedavi · ürün kodu 02192 · uygulamaya göre 1.500–2.000 litre için · yalnız prospektüsteki tanı, doz ve su değişimi planıyla kullanın"],
  ],"2026-10-24"),
  ...products("Sera","treatment","https://www.sera.de/en/product/freshwater-aquarium/sera-med-professional-nematol/",[
    ["med Professional Nematol 10 ml","Tatlı ve deniz suyu balıklarında Camallanus, Capillaria ve Oxyuris gibi nematodlara karşı veteriner ilacı · ürün kodu 02196 · 400 litre için · karides, kerevit ve diğer hassas omurgasızlar tolere etmez"],
    ["med Professional Nematol 50 ml","Tatlı ve deniz suyu balıklarında Camallanus, Capillaria ve Oxyuris gibi nematodlara karşı veteriner ilacı · ürün kodu 02204 · 2.000 litre için · karides, kerevit ve diğer hassas omurgasızlar tolere etmez"],
  ],"2026-10-24"),
  ...products("Sera","treatment","https://www.sera.de/us/product/freshwater-aquarium/sera-omnipur-a/",[
    ["omnipur A 50 ml","Tatlı suda bakteriler, mantarlar, tek hücreli deri parazitleri ve deri/solungaç kurtlarına karşı geniş spektrumlu veteriner ilacı · ürün kodu 02170 · 1.000 litre için · 20 litreye bir kez 1 ml; kıkırdaklı balıklar tolere etmez, bıçak balıkları, loach ve yayınlar malahit yeşiline hassas olabilir; başka ilaçla birleştirmeyin"],
  ],"2026-10-24"),
  ...products("Sera","treatment","https://www.sera.de/us/product/freshwater-aquarium/sera-costapur/",[
    ["costapur 50 ml","Tatlı ve deniz suyunda beyaz benek, diğer tek hücreli deri parazitleri ve bazı mantarlara karşı tedavi · ürün kodu 02130 · uygulamaya göre 500–1.000 litre için · akvaryumu karartın; kıkırdaklı balıklar ve omurgasızlar tolere etmez"],
    ["costapur 100 ml","Tatlı ve deniz suyunda beyaz benek, diğer tek hücreli deri parazitleri ve bazı mantarlara karşı tedavi · ürün kodu 02140 · uygulamaya göre 1.000–2.000 litre için · akvaryumu karartın; kıkırdaklı balıklar ve omurgasızlar tolere etmez"],
    ["costapur 500 ml","Tatlı ve deniz suyunda beyaz benek, diğer tek hücreli deri parazitleri ve bazı mantarlara karşı tedavi · ürün kodu 02160 · uygulamaya göre 5.000–10.000 litre için · akvaryumu karartın; kıkırdaklı balıklar ve omurgasızlar tolere etmez"],
  ],"2026-10-24"),
  ...products("Sera","treatment","https://www.sera.de/en/product/freshwater-aquarium/sera-mycopur/",[
    ["mycopur 50 ml","Tatlı su balıklarında Saprolegnia gibi mantar, yumurta mantarı ve deri/solungaç kurtlarına karşı bakır ve akriflavin içeren tedavi · ürün kodu 02230 · 800 litre için · üç gün boyunca günlük 20 litreye 1 ml; omurgasızlar tolere etmez, aktif karbonu kapatıp iyi havalandırın"],
    ["mycopur 100 ml","Tatlı su balıklarında Saprolegnia gibi mantar, yumurta mantarı ve deri/solungaç kurtlarına karşı bakır ve akriflavin içeren tedavi · ürün kodu 02240 · 1.600 litre için · üç gün boyunca günlük 20 litreye 1 ml; omurgasızlar tolere etmez, aktif karbonu kapatıp iyi havalandırın"],
    ["mycopur 500 ml","Tatlı su balıklarında Saprolegnia gibi mantar, yumurta mantarı ve deri/solungaç kurtlarına karşı bakır ve akriflavin içeren tedavi · ürün kodu 02260 · 8.000 litre için · üç gün boyunca günlük 20 litreye 1 ml; omurgasızlar tolere etmez, aktif karbonu kapatıp iyi havalandırın"],
  ],"2026-10-24"),
  ...products("Sera","treatment","https://www.sera.de/us/product/pond/sera-baktopur/",[
    ["baktopur 50 ml","Tatlı suda Columnaris, ağız/yüzgeç/solungaç çürümesi ile Aeromonas ve Pseudomonas enfeksiyonlarına karşı akriflavin ve metilen mavisi içeren tedavi · ürün kodu 02550 · uygulamaya göre 500–1.000 litre için · 1. ve 3. gün 20 litreye 1 ml; aktif karbonu kapatıp iyi havalandırın"],
    ["baktopur 100 ml","Tatlı suda Columnaris, ağız/yüzgeç/solungaç çürümesi ile Aeromonas ve Pseudomonas enfeksiyonlarına karşı akriflavin ve metilen mavisi içeren tedavi · ürün kodu 02560 · uygulamaya göre 1.000–2.000 litre için · 1. ve 3. gün 20 litreye 1 ml; aktif karbonu kapatıp iyi havalandırın"],
    ["baktopur 500 ml","Tatlı suda Columnaris, ağız/yüzgeç/solungaç çürümesi ile Aeromonas ve Pseudomonas enfeksiyonlarına karşı akriflavin ve metilen mavisi içeren tedavi · ürün kodu 02580 · uygulamaya göre 5.000–10.000 litre için · 1. ve 3. gün 20 litreye 1 ml; aktif karbonu kapatıp iyi havalandırın"],
  ],"2026-10-24"),
  ...products("Sera","treatment","https://www.sera.de/us/product/freshwater-aquarium/sera-baktopur-direct/",[
    ["baktopur direct 8 tablet","İlerlemiş bakteriyel enfeksiyonlar, açık ülser ve dropsy belirtilerinde suya çözülen nifurpirinol tableti · ürün kodu 02588 · 400 litre için · 50 litreye bir tablet, en az iki günde bir kısmi su değişimi ve değişen hacme yeniden doz; CO₂/UV/aktif karbonu kapatın"],
    ["baktopur direct 24 tablet","İlerlemiş bakteriyel enfeksiyonlar, açık ülser ve dropsy belirtilerinde suya çözülen nifurpirinol tableti · ürün kodu 02590 · 1.200 litre için · 50 litreye bir tablet, en az iki günde bir kısmi su değişimi ve değişen hacme yeniden doz; CO₂/UV/aktif karbonu kapatın"],
    ["baktopur direct 100 tablet","İlerlemiş bakteriyel enfeksiyonlar, açık ülser ve dropsy belirtilerinde suya çözülen nifurpirinol tableti · ürün kodu 02595 · 5.000 litre için · 50 litreye bir tablet, en az iki günde bir kısmi su değişimi ve değişen hacme yeniden doz; CO₂/UV/aktif karbonu kapatın"],
    ["baktopur direct 2000 tablet / 2 kg","İlerlemiş bakteriyel enfeksiyonlar, açık ülser ve dropsy belirtilerinde suya çözülen nifurpirinol tableti · ürün kodu 02597 · 100.000 litre için · 50 litreye bir tablet, en az iki günde bir kısmi su değişimi ve değişen hacme yeniden doz; CO₂/UV/aktif karbonu kapatın"],
  ],"2026-10-24"),
  ...products("Sera","treatment","https://www.sera.de/us/product/marine-aquarium/sera-bakto-tabs/",[
    ["bakto Tabs","Tatlı ve deniz suyu balıklarındaki bakteriyel enfeksiyonlara karşı nifurpirinol içeren ilaçlı yem tableti; iyileşene kadar tek yem olarak verilir · üreticinin güncel sayfası ambalaj miktarı ve ürün kodu yayımlamaz; baktopur direct gibi suya çözülmez"],
  ],"2026-10-24"),
  ...([{
    family:"Aquarium Gravel Floredepot Substrate",
    sourceUrl:"https://www.sera.de/en/product/freshwater-aquarium/sera-aquarium-gravel-floredepot-substrate/",
    detail:"Kum, torf, besinler ve iz elementler içeren işlevsel taban altı katmanı; yaklaşık 2 cm serilir, Fine veya Coarse çakılla örtülür ve ilk 4–6 hafta kök gelişimini destekler",
    variants:[["2,4 kg","32856"]],
  },{
    family:"Aquarium Gravel Lava Substrate",
    sourceUrl:"https://www.sera.de/us/product/freshwater-aquarium/sera-aquarium-gravel-lava-substrate/",
    detail:"2–8 mm gözenekli doğal lavdan, suya nötr işlevsel alt katman; dolaşımı, yararlı bakterileri ve bitki köklerini destekler, Fine veya Coarse çakılla örtülür",
    variants:[["3 L / 4 kg","32857"],["6 L / 8 kg","32915"]],
  },{
    family:"Aquarium Gravel Anthracite Fine",
    sourceUrl:"https://www.sera.de/us/product/freshwater-aquarium/sera-aquarium-gravel-anthracite-fine/",
    detail:"1–2 mm yuvarlatılmış antrasit doğal çakıl; suya nötr ve CO₂'ye dayanıklıdır, dipte yem arayan hassas balıklar için uygundur; kullanmadan önce durulanır",
    variants:[["3 L / 4 kg","32848"],["6 L / 8 kg","32849"]],
  },{
    family:"Aquarium Gravel Brown Fine",
    sourceUrl:"https://www.sera.de/us/product/freshwater-aquarium/sera-aquarium-gravel-brown-fine/",
    detail:"0–2 mm yuvarlatılmış kahverengi ince kum karışımı; suya nötr ve CO₂'ye dayanıklıdır, dipte yem arayan balıklar için uygundur; kullanmadan önce durulanır",
    variants:[["3 L / 4 kg","32850"],["6 L / 8 kg","32851"]],
  },{
    family:"Aquarium Gravel Ocher Fine",
    sourceUrl:"https://www.sera.de/en/product/freshwater-aquarium/sera-aquarium-gravel-ocher-fine/",
    detail:"0–2 mm yuvarlatılmış okra-kırmızı doğal ince çakıl; suya nötr ve CO₂'ye dayanıklıdır, dipte yem arayan balıklar için uygundur; kullanmadan önce durulanır",
    variants:[["3 L / 4 kg","32269"],["6 L / 8 kg","32270"]],
  },{
    family:"Aquarium Gravel White Fine",
    sourceUrl:"https://www.sera.de/en/product/freshwater-aquarium/sera-aquarium-gravel-white-fine/",
    detail:"0–2 mm yuvarlatılmış beyaz ince kum karışımı; suya nötr ve CO₂'ye dayanıklıdır, tatlı ve deniz suyu ile dipte yem arayan balıklar için uygundur; kullanmadan önce durulanır",
    variants:[["3 L / 4 kg","32852"],["6 L / 8 kg","32853"]],
  },{
    family:"Aquarium Gravel Anthracite Coarse",
    sourceUrl:"https://www.sera.de/en/product/freshwater-aquarium/sera-aquarium-gravel-anthracite-coarse/",
    detail:"1–3 mm yuvarlatılmış antrasit doğal çakıl; suya nötr ve CO₂'ye dayanıklıdır, dolaşım ile kök gelişimini destekler ve dip balıkları için uygundur; kullanmadan önce durulanır",
    variants:[["3 L / 5 kg","32267"],["6 L / 10 kg","32268"]],
  },{
    family:"Aquarium Gravel Beige Coarse",
    sourceUrl:"https://www.sera.de/en/product/freshwater-aquarium/sera-aquarium-gravel-beige-coarse/",
    detail:"2–6 mm yuvarlatılmış bej doğal çakıl; suya nötr ve CO₂'ye dayanıklıdır, dolaşım ile kök gelişimini destekler ve dip balıkları için uygundur; kullanmadan önce durulanır",
    variants:[["3 L / 5 kg","32223"],["6 L / 10 kg","32272"]],
  },{
    family:"Aquarium Gravel Black Coarse",
    sourceUrl:"https://www.sera.de/en/product/freshwater-aquarium/sera-aquarium-gravel-black-coarse/",
    detail:"2–3 mm yuvarlatılmış derin siyah renkli çakıl; suya nötr ve CO₂'ye dayanıklıdır, DIN 38415-6 / EN ISO 15088 kapsamında zararlı madde yönünden bağımsız olarak test edilmiştir; dip balıkları için uygundur ve kullanmadan önce durulanır",
    variants:[["3 L / 5 kg","32261"],["6 L / 10 kg","32262"]],
  },{
    family:"Aquarium Gravel Mix Coarse",
    sourceUrl:"https://www.sera.de/en/product/freshwater-aquarium/sera-aquarium-gravel-mix-coarse/",
    detail:"2–8 mm yuvarlatılmış çok renkli doğal dekoratif çakıl; suya nötr ve renk sabittir, dipte yem arayan balıklar için uygundur; kullanmadan önce durulanır",
    variants:[["3 L / 4 kg","32854"],["6 L / 8 kg","32855"]],
  },{
    family:"Aquarium Gravel White Coarse",
    sourceUrl:"https://www.sera.de/us/product/freshwater-aquarium/sera-aquarium-gravel-white-coarse/",
    detail:"1–3 mm güçlü biçimde yuvarlatılmış beyaz doğal çakıl; suya nötr ve CO₂'ye dayanıklıdır, kök gelişimini destekler ve dip balıkları için uygundur; kullanmadan önce durulanır",
    variants:[["3 L / 5 kg","32265"],["6 L / 10 kg","32266"]],
  }] as Array<{family:string;sourceUrl:string;detail:string;variants:Array<[string,string]>}>).flatMap(({family,sourceUrl,detail,variants})=>variants.map(([pack,itemNo]):CareProductProfile=>({
    id:catalogSlug(`Sera-${family}-${pack}`), brand:"Sera", model:`${family} ${pack}`, category:"substrate",
    description:`${detail} · ürün kodu ${itemNo}`, sourceUrl, verifiedAt:"2026-10-24",
  }))),
  ...([
    {family:"Rock Gray Mountain",sourceUrl:"https://www.sera.de/us/product/freshwater-aquarium/sera-rock-gray-mountain-1/",detail:"Çatlak yüzeyli gri doğal taş; hafif kireç içerdiği için KH ve sertliği artırabilir",variants:[["S/M","0,6–1,4 kg","32340"],["L","2–3 kg","32341"],["XXL","yaklaşık 6 kg","32342"]]},
    {family:"Rock Grand Canyon",sourceUrl:"https://www.sera.de/us/product/freshwater-aquarium/sera-rock-grand-canyon-1/",detail:"Güçlü çatlaklı kırmızı-kahverengi doğal taş; hafif kireç içerdiği için KH ve sertliği artırabilir",variants:[["S/M","0,4–0,8 kg","32347"],["L","0,9–1,5 kg","32348"],["XXL","2–3 kg","32349"]]},
    {family:"Rock Red Lava",sourceUrl:"https://www.sera.de/en/product/freshwater-aquarium/sera-rock-red-lava-1/",detail:"Gözenekli koyu kırmızı lav taşı; üreticiye göre kireç içermez ve suda nötrdür",variants:[["S/M","8–15 cm","32356"],["L","16–23 cm","32357"]]},
    {family:"Rock Quartz Gray",sourceUrl:"https://www.sera.de/us/product/freshwater-aquarium/sera-rock-quartz-gray-1/",detail:"Beyaz katmanlı koyu gri doğal taş; hafif kireç içerdiği için KH ve sertliği artırabilir",variants:[["S/M","0,6–1,4 kg","32343"],["L","2–3 kg","32344"]]},
    {family:"Rock Asian Pagoda",sourceUrl:"https://www.sera.de/en/product/freshwater-aquarium/sera-rock-asian-pagoda-1/",detail:"Gri-bej çok renkli, çıkıntılı doğal taş; hafif kireç içerdiği için KH ve sertliği artırabilir",variants:[["S/M","0,6–1,4 kg","32350"],["L","2–3 kg","32351"],["XXL","yaklaşık 6 kg","32352"]]},
    {family:"Rock Hole Stone",sourceUrl:"https://www.sera.de/us/product/freshwater-aquarium/sera-rock-hole-stone-1/",detail:"Balık ve omurgasızlar için boşluklar sağlayan bej delikli taş; kireç içerdiği için KH ve sertliği artırabilir",variants:[["S/M","0,6–1,4 kg","32345"],["L","2–3 kg","32346"]]},
    {family:"Rock Desert",sourceUrl:"https://www.sera.de/us/product/freshwater-aquarium/sera-rock-desert-1/",detail:"Yatay oluklu açık bej doğal taş; hafif kireç içerdiği için KH ve sertliği artırabilir",variants:[["S/M","0,6–1,4 kg","32353"],["L","2–3 kg","32354"],["XXL","yaklaşık 6 kg","32355"]]},
    {family:"Scaper Root",sourceUrl:"https://www.sera.de/us/product/freshwater-aquarium/sera-scaper-root-1/",detail:"Moss ile bitkilendirilebilen koyu kahverengi doğal ince kök; serbest yerleştirmeden önce suya doyurulmalıdır",variants:[["XS","18–20 cm","32358"],["S","25–30 cm","32359"],["M","30–35 cm","32360"]]},
    {family:"Scaper Wood",sourceUrl:"https://www.sera.de/us/product/freshwater-aquarium/sera-scaper-wood-1/",detail:"Şist plakaya sabitlenmiş, Anubias ve Java fern gibi bitkilerle kullanılabilen kompakt doğal kök",variants:[["M","18–20 cm","32361"],["L","30–35 cm","32362"]]},
    {family:"Rock Dragon Stone",sourceUrl:"https://www.sera.de/en/product/freshwater-aquarium/sera-rock-dragon-stone/",detail:"Güçlü oluklu kahverengi doğal taş; üreticiye göre kireç içermez ve su değerlerini etkilemez",variants:[["S/M","0,6–1,1 kg","32618"],["L","1,2–1,8 kg","32619"],["XXL","3,5–4,5 kg","32620"]]},
    {family:"Rock Zebra Stone",sourceUrl:"https://www.sera.de/en/product/freshwater-aquarium/sera-rock-zebra-stone/",detail:"Beyaz damarlı gri doğal taş; hafif keskin kenarlı ve kireçli olduğundan KH ile sertliği artırabilir",variants:[["S/M","0,6–1,4 kg","32621"],["L","2–3 kg","32622"]]},
    {family:"Rock Black Lava",sourceUrl:"https://www.sera.de/us/product/freshwater-aquarium/sera-rock-black-lava/",detail:"Bakteriler ve epifit bitkiler için geniş yüzey sağlayan derin siyah, çok gözenekli lav taşı",variants:[["L","0,8–1,8 kg","32846"],["XXL","4–6 kg","32847"]]},
    {family:"Rock Gray Pebble",sourceUrl:"https://www.sera.de/us/product/freshwater-aquarium/sera-rock-gray-pebble/",detail:"Akarsu düzenleri ve biyofilm otlayan canlılar için hafif gözenekli, yuvarlak koyu gri nehir taşı",variants:[["S (6 adet)","toplam 0,8–1,2 kg","32843"],["M (3 adet)","toplam 1,8–2,4 kg","32844"],["L (1 adet)","1,8–2,6 kg","32845"]]},
    {family:"Drift Wood",sourceUrl:"https://www.sera.de/us/product/freshwater-aquarium/sera-drift-wood/",detail:"Saklanma ve üreme alanı sağlayan; biofilm, salyangoz, karides ve odun raspalayan vatozlar için doğal yüzey oluşturan koyu kahverengi ağaç",variants:[["M","0,6–0,9 kg","32841"],["L","1,3–2 kg","32842"]]},
  ] as Array<{family:string;sourceUrl:string;detail:string;variants:Array<[string,string,string]>}>).flatMap(({family,sourceUrl,detail,variants})=>variants.map(([variant,measurement,itemNo]):CareProductProfile=>({
    id:catalogSlug(`Sera-${family}-${variant}`), brand:"Sera", model:`${family} ${variant}`, category:"decoration",
    description:`${detail} · ${measurement} · ürün kodu ${itemNo}`, sourceUrl, verifiedAt:"2026-10-23",
  }))),
  ...([
    ["Hardscape Scaper Cube Africa","32334","https://www.sera.de/en/product/freshwater-aquarium/sera-hardscape-africa/","Scaper Cube 80 L için önerilen; 2 adet Rock Hole Stone S/M, 4 adet Rock Hole Stone L, 3 L ve 2 × 6 L Gravel White içeren Afrika temalı set"],
    ["Hardscape Scaper Cube Shrimp","32335","https://www.sera.de/us/product/freshwater-aquarium/sera-hardscape-shrimp/","Scaper Cube 48 L için önerilen; 6 adet Rock Gray Mountain S/M, Scaper Root S ve M, 4,7 kg floredepot ve 2 × 6 L Gravel Anthracite içeren karides seti"],
    ["Hardscape Scaper Cube Grand Canyon","32336","https://www.sera.de/en/product/freshwater-aquarium/sera-hardscape-grand-canyon/","Scaper Cube 64 L için önerilen; 6 adet Rock Asian Pagoda S/M, 2 adet Rock Asian Pagoda L, Rock Grand Canyon S/M, 4,7 kg floredepot ve 6'şar L Beige/Ocher çakıl içeren set"],
    ["Hardscape Scaper Cube South America","32337","https://www.sera.de/en/product/freshwater-aquarium/sera-hardscape-scaper-cube-south-america/","Scaper Cube 64 L için önerilen; Scaper Wood M ve L, 4,7 kg floredepot ve 2 × 6 L Gravel Brown içeren Güney Amerika temalı set"],
    ["Hardscape Scaper Cube Asia","32338","https://www.sera.de/en/product/freshwater-aquarium/sera-hardscape-asia/","Scaper Cube 48 L için önerilen; 2'şer adet Rock Quartz Gray S/M ve L, Scaper Root S, 4,7 kg floredepot ve 2 × 6 L Gravel Gray içeren Asya temalı set"],
    ["Hardscape Scaper Cube Desert","32339","https://www.sera.de/en/product/freshwater-aquarium/sera-hardscape-desert/","Scaper Cube 80 L için önerilen; Grand Canyon ve Asian Pagoda kayaları, 4,7 kg floredepot ile toplam 18 L Ocher ve 3 L Beige çakıl içeren çöl seti"],
    ["Hardscape Shrimp XXL","32438","https://www.sera.de/en/product/freshwater-aquarium/sera-hardscape-shrimp-xxl/","AquaTank 96 L için önerilen; Gray Mountain S/M, L ve XXL kayalar, Scaper Root L, toplam 7,1 kg floredepot ve 13 L Gravel Anthracite içeren büyük karides seti"],
    ["Hardscape Monument Rock","32439","https://www.sera.de/us/product/freshwater-aquarium/sera-hardscape-monument-rock/","AquaTank 128 L için önerilen; 3 adet Rock Desert S/M, 4 adet Rock Desert XXL, toplam 7,1 kg floredepot, 13 L Gravel Ocher ve 3 L Gravel Beige içeren çöl seti"],
    ["Hardscape Rio Negro","32440","https://www.sera.de/en/product/freshwater-aquarium/sera-hardscape-rio-negro/","AquaTank 160 L için önerilen; Scaper Wood L ve 2 adet XL, toplam 7,1 kg floredepot ve 20 L Gravel Brown içeren Amazon temalı set"],
  ] as const).map(([model,itemNo,sourceUrl,description]):CareProductProfile=>({
    id:catalogSlug(`Sera-${model}`), brand:"Sera", model, category:"decoration",
    description:`${description} · ürün kodu ${itemNo}`, sourceUrl, verifiedAt:"2026-10-23",
  })),
  ...([
    ["Magnet Cleaner Floating XS","32835","https://www.sera.de/de/produkt/suesswasseraquarium/sera-magnet-cleaner-floating-xs/","Küçük akvaryumlar için, ayrıldığında su yüzeyine çıkan iç parçalı mıknatıslı cam temizleyici"],
    ["Magnet Cleaner Floating S","32836","https://www.sera.de/de/produkt/suesswasseraquarium/sera-magnet-cleaner-floating-s/","Küçük akvaryumlar için, ayrıldığında su yüzeyine çıkan iç parçalı mıknatıslı cam temizleyici"],
    ["Magnet Cleaner Floating M","32837","https://www.sera.de/de/produkt/suesswasseraquarium/sera-magnet-cleaner-floating-m/","Orta boy akvaryumlar için, ayrıldığında su yüzeyine çıkan iç parçalı mıknatıslı cam temizleyici"],
    ["Magnet Cleaner Floating L","32838","https://www.sera.de/de/produkt/suesswasseraquarium/sera-magnet-cleaner-floating-l/","Büyük akvaryumlar için, ayrıldığında su yüzeyine çıkan iç parçalı mıknatıslı cam temizleyici"],
    ["Gravel Cleaner Edge","32801","https://www.sera.de/us/product/freshwater-aquarium/sera-gravel-cleaner-edge/","Köşeler ve bitkilerin arası için bypass açıklıklı köşeli taban temizleyici"],
    ["Gravel Cleaner Nano","32800","https://www.sera.de/en/product/freshwater-aquarium/sera-gravel-cleaner-nano/","Nano akvaryumların erişilmesi zor bölgeleri için küçük taban temizleyici"],
    ["Gravel Cleaner Round","32802","https://www.sera.de/en/product/freshwater-aquarium/sera-gravel-cleaner-round/","Geniş taban yüzeyleri için yuvarlak taban temizleyici"],
    ["Water Suction Starter","32803","https://www.sera.de/en/product/freshwater-aquarium/sera-water-suction-starter/","Su değişiminde sifon akışını başlatmaya yardımcı emiş aparatı"],
    ["Deco Cleaner 500 g","32746","https://www.sera.de/us/product/freshwater-aquarium/sera-deco-cleaner/","Doğal ve yapay dekorasyon ile teknik parçaların organik kirlerini çözmeye yardımcı, 125 L'ye kadar temizleme çözeltisi hazırlayan klorsuz toz"],
    ["Glass Cleaner 100 ml","32747","https://www.sera.de/en/product/freshwater-aquarium/sera-glass-cleaner/","Cam ve akrilik yüzeylerdeki kireç kalıntıları için sitrik asitli temizleyici · akvaryum suyuyla doğrudan temas ettirilmemeli; iç yüzeyde yalnız su seviyesinin üzerinde, nemli bez veya süngere uygulanmalı · asit hassas yüzeylerde kullanılmamalı ve gidere dökülmemelidir"],
    ["Sponge Soft","32813","https://www.sera.de/en/product/freshwater-aquarium/sera-sponge-soft/","Hafif kirler için yumuşak temizlik süngeri"],
    ["Sponge Hard","32812","https://www.sera.de/en/product/freshwater-aquarium/sera-sponge-hard/","Cam ve sert, pürüzsüz yüzeylerde inatçı kirler için bir yüzü çelik yün dokulu temizlik süngeri"],
    ["Cleaning Glove","32814","https://www.sera.de/en/product/freshwater-aquarium/sera-cleaning-glove/","Su altında erişilmesi zor alanlar, küçük parçalar ve geniş düz yüzeyler için iki ele de uygun lurex temizlik eldiveni"],
    ["Cleaning Towel","32815","https://www.sera.de/en/product/freshwater-aquarium/sera-cleaning-towel/","Cam ve diğer pürüzsüz yüzeyler için karbon lifli, hızlı kuruyan 40 × 40 cm mikrofiber bez"],
    ["Drying Towel","32816","https://www.sera.de/us/product/freshwater-aquarium/sera-drying-towel/","Bakım sırasında dökülen su için 630 g/m² gramajlı, yüzde yüz pamuk, 80 × 40 cm emici havlu"],
    ["Tube Brush","32828","https://www.sera.de/en/product/freshwater-aquarium/sera-tube-brush/","9–18 mm iç çaplı ve 2 metreye kadar hortumlar için üç fırça ile iki metre çekme ipleri içeren esnek hortum temizleyici"],
    ["Brush Set","32827","https://www.sera.de/en/product/freshwater-aquarium/sera-brush-set/","Filtre, pompa ve skimmer parçaları için beş düz ve iki kavisli olmak üzere yedi teknik temizlik fırçası"],
  ] as const).map(([model,itemNo,sourceUrl,description]):CareProductProfile=>({
    id:catalogSlug(`Sera-${model}`), brand:"Sera", model, category:"cleaning",
    description:`${description} · ürün kodu ${itemNo}`, sourceUrl, verifiedAt:"2026-10-23",
  })),
  ...products("Seachem","water_conditioner","https://www.seachem.com/prime.php",[
    ["Prime 50 ml","Klor ve kloramini gideren; amonyak, nitrit ve nitratı 48 saate kadar detoksifiye eden konsantre düzenleyici · ürün kodu 0434 · standart doz 5 ml / 200 L yeni su; yüksek kloramin için iki kat, nitrit acil durumunda en fazla beş kat doz; 30 °C üzerinde klor veya amonyak düşükse yarım doz"],
    ["Prime 100 ml","Klor ve kloramini gideren; amonyak, nitrit ve nitratı 48 saate kadar detoksifiye eden konsantre düzenleyici · ürün kodu 0435 · standart doz 5 ml / 200 L yeni su; yüksek kloramin için iki kat, nitrit acil durumunda en fazla beş kat doz; 30 °C üzerinde klor veya amonyak düşükse yarım doz"],
    ["Prime 250 ml","Klor ve kloramini gideren; amonyak, nitrit ve nitratı 48 saate kadar detoksifiye eden konsantre düzenleyici · ürün kodu 0436 · standart doz 5 ml / 200 L yeni su; yüksek kloramin için iki kat, nitrit acil durumunda en fazla beş kat doz; 30 °C üzerinde klor veya amonyak düşükse yarım doz"],
    ["Prime 500 ml","Klor ve kloramini gideren; amonyak, nitrit ve nitratı 48 saate kadar detoksifiye eden konsantre düzenleyici · ürün kodu 0433 · standart doz 5 ml / 200 L yeni su; yüksek kloramin için iki kat, nitrit acil durumunda en fazla beş kat doz; 30 °C üzerinde klor veya amonyak düşükse yarım doz"],
    ["Prime 1 L","Klor ve kloramini gideren; amonyak, nitrit ve nitratı 48 saate kadar detoksifiye eden konsantre düzenleyici · ürün kodu 0437 · standart doz 5 ml / 200 L yeni su; yüksek kloramin için iki kat, nitrit acil durumunda en fazla beş kat doz; 30 °C üzerinde klor veya amonyak düşükse yarım doz"],
    ["Prime 2 L","Klor ve kloramini gideren; amonyak, nitrit ve nitratı 48 saate kadar detoksifiye eden konsantre düzenleyici · ürün kodu 0438 · standart doz 5 ml / 200 L yeni su; yüksek kloramin için iki kat, nitrit acil durumunda en fazla beş kat doz; 30 °C üzerinde klor veya amonyak düşükse yarım doz"],
    ["Prime 4 L","Klor ve kloramini gideren; amonyak, nitrit ve nitratı 48 saate kadar detoksifiye eden konsantre düzenleyici · ürün kodu 0439 · standart doz 5 ml / 200 L yeni su; yüksek kloramin için iki kat, nitrit acil durumunda en fazla beş kat doz; 30 °C üzerinde klor veya amonyak düşükse yarım doz"],
  ],"2026-10-24"),
  ...products("Seachem","water_conditioner","https://www.seachem.com/safe.php",[
    ["Safe 50 g","Tatlı ve deniz suyunda klor/kloramini gideren; amonyak, nitrit ve nitratı geçici olarak detoksifiye eden çok konsantre kuru düzenleyici · ürün kodu 0384 · 50 g paketin güncel dozu klor/kloramin için 200 mg / 200 L, amonyak için 200 mg / 50 L'dir · yüksek kloramin için iki kat, nitrit/nitrat acil durumunda en fazla dört kat kullanılabilir; 30 °C üzerinde klor veya amonyak düşükse yarım doz uygulanır · hazırlanmış sıvı çözelti saklanmamalıdır"],
    ["Safe 250 g","Tatlı ve deniz suyunda klor/kloramini gideren; amonyak, nitrit ve nitratı geçici olarak detoksifiye eden çok konsantre kuru düzenleyici · ürün kodu 0386 · klor/kloramin için 1,25 g / 1.250 L, amonyak için 1,25 g / 300 L · yüksek kloramin için iki kat, nitrit/nitrat acil durumunda en fazla dört kat kullanılabilir; 30 °C üzerinde klor veya amonyak düşükse yarım doz uygulanır · hazırlanmış sıvı çözelti saklanmamalıdır"],
    ["Safe 1 kg","Tatlı ve deniz suyunda klor/kloramini gideren; amonyak, nitrit ve nitratı geçici olarak detoksifiye eden çok konsantre kuru düzenleyici · ürün kodu 0387 · klor/kloramin için 1,25 g / 1.250 L, amonyak için 1,25 g / 300 L · yüksek kloramin için iki kat, nitrit/nitrat acil durumunda en fazla dört kat kullanılabilir; 30 °C üzerinde klor veya amonyak düşükse yarım doz uygulanır · hazırlanmış sıvı çözelti saklanmamalıdır"],
    ["Safe 4 kg","Tatlı ve deniz suyunda klor/kloramini gideren; amonyak, nitrit ve nitratı geçici olarak detoksifiye eden çok konsantre kuru düzenleyici · ürün kodu 0389 · klor/kloramin için 1,25 g / 1.250 L, amonyak için 1,25 g / 300 L · yüksek kloramin için iki kat, nitrit/nitrat acil durumunda en fazla dört kat kullanılabilir; 30 °C üzerinde klor veya amonyak düşükse yarım doz uygulanır · hazırlanmış sıvı çözelti saklanmamalıdır"],
    ["Safe 20 kg","Tatlı ve deniz suyunda klor/kloramini gideren; amonyak, nitrit ve nitratı geçici olarak detoksifiye eden çok konsantre kuru düzenleyici · ürün kodu 0381 · klor/kloramin için 1,25 g / 1.250 L, amonyak için 1,25 g / 300 L · yüksek kloramin için iki kat, nitrit/nitrat acil durumunda en fazla dört kat kullanılabilir; 30 °C üzerinde klor veya amonyak düşükse yarım doz uygulanır · resmî boyut özeti 20 kg'ı yazmasa da aynı sayfanın ürün kodlu görsel listesi bu paketi yayımlar; hazırlanmış sıvı çözelti saklanmamalıdır"],
  ],"2026-10-24"),
  ...products("Seachem","water_conditioner","https://www.seachem.com/equilibrium.php",[
    ["Equilibrium 300 g","Bitkili akvaryumlarda RO/DI veya mineralce fakir suyun genel sertliğini (GH) kalsiyum, magnezyum ve potasyum tuzlarıyla yükselten mineral karışımı · ürün kodu 0446 · 16 g / 80 L doz GH'ı yaklaşık 1 meq/L (3 dH) artırır; önce mevcut GH ölçülmelidir · yeni suya yaklaşık 1 L suda karıştırılarak eklenir, 15–30 dakikalık geçici bulanıklık olabilir · buharlaşan suyu tamamlarken kullanılmaz; KH için Alkaline Buffer ayrıca gerekir"],
    ["Equilibrium 600 g","Bitkili akvaryumlarda RO/DI veya mineralce fakir suyun genel sertliğini (GH) kalsiyum, magnezyum ve potasyum tuzlarıyla yükselten mineral karışımı · ürün kodu 0443 · 16 g / 80 L doz GH'ı yaklaşık 1 meq/L (3 dH) artırır; önce mevcut GH ölçülmelidir · yeni suya yaklaşık 1 L suda karıştırılarak eklenir, 15–30 dakikalık geçici bulanıklık olabilir · buharlaşan suyu tamamlarken kullanılmaz; KH için Alkaline Buffer ayrıca gerekir"],
    ["Equilibrium 4 kg","Bitkili akvaryumlarda RO/DI veya mineralce fakir suyun genel sertliğini (GH) kalsiyum, magnezyum ve potasyum tuzlarıyla yükselten mineral karışımı · ürün kodu 0449 · 16 g / 80 L doz GH'ı yaklaşık 1 meq/L (3 dH) artırır; önce mevcut GH ölçülmelidir · yeni suya yaklaşık 1 L suda karıştırılarak eklenir, 15–30 dakikalık geçici bulanıklık olabilir · buharlaşan suyu tamamlarken kullanılmaz; KH için Alkaline Buffer ayrıca gerekir"],
  ],"2026-10-24"),
  ...products("Seachem","water_conditioner","https://www.seachem.com/acid-buffer.php",[
    ["Acid Buffer 70 g","Bitkili veya çok sert tatlı suda fosfat eklemeden pH ve KH'ı düşüren tampon · ürün kodu 0244 · günlük 2 g / 80 L doz alkaliniteyi yaklaşık 0,2 meq/L (0,6 dKH) azaltır; istenen pH'a kademeli ulaşılmalı ve özellikle yumuşak suda Alkaline Buffer ile birlikte ölçülerek kullanılmalıdır · ciddi göz tahrişine yol açabilir; çocuklardan uzak tutulmalı, cilt ve göz temasından kaçınılmalıdır"],
    ["Acid Buffer 300 g","Bitkili veya çok sert tatlı suda fosfat eklemeden pH ve KH'ı düşüren tampon · ürün kodu 0246 · günlük 2 g / 80 L doz alkaliniteyi yaklaşık 0,2 meq/L (0,6 dKH) azaltır; istenen pH'a kademeli ulaşılmalı ve özellikle yumuşak suda Alkaline Buffer ile birlikte ölçülerek kullanılmalıdır · ciddi göz tahrişine yol açabilir; çocuklardan uzak tutulmalı, cilt ve göz temasından kaçınılmalıdır"],
    ["Acid Buffer 500 g","Bitkili veya çok sert tatlı suda fosfat eklemeden pH ve KH'ı düşüren tampon · ürün kodu 0243 · resmî sayfanın boyut özeti bu paketi 600 g, aynı sayfanın ürün kodlu görsel listesi ise 500 g gösterir; katalog kodlu fiziksel seçeneği izler ve satın almadan önce etiket doğrulanmalıdır · günlük 2 g / 80 L doz alkaliniteyi yaklaşık 0,2 meq/L (0,6 dKH) azaltır · ciddi göz tahrişine yol açabilir; çocuklardan uzak tutulmalı, cilt ve göz temasından kaçınılmalıdır"],
    ["Acid Buffer 1,2 kg","Bitkili veya çok sert tatlı suda fosfat eklemeden pH ve KH'ı düşüren tampon · ürün kodu 0247 · günlük 2 g / 80 L doz alkaliniteyi yaklaşık 0,2 meq/L (0,6 dKH) azaltır; istenen pH'a kademeli ulaşılmalı ve özellikle yumuşak suda Alkaline Buffer ile birlikte ölçülerek kullanılmalıdır · ciddi göz tahrişine yol açabilir; çocuklardan uzak tutulmalı, cilt ve göz temasından kaçınılmalıdır"],
    ["Acid Buffer 4 kg","Bitkili veya çok sert tatlı suda fosfat eklemeden pH ve KH'ı düşüren tampon · ürün kodu 0249 · günlük 2 g / 80 L doz alkaliniteyi yaklaşık 0,2 meq/L (0,6 dKH) azaltır; istenen pH'a kademeli ulaşılmalı ve özellikle yumuşak suda Alkaline Buffer ile birlikte ölçülerek kullanılmalıdır · ciddi göz tahrişine yol açabilir; çocuklardan uzak tutulmalı, cilt ve göz temasından kaçınılmalıdır"],
  ],"2026-10-24"),
  ...products("Seachem","water_conditioner","https://www.seachem.com/alkaline-buffer.php",[
    ["Alkaline Buffer 70 g","Bitkili tatlı suda fosfat eklemeden pH ve alkaliniteyi (KH) yükselten sodyum bikarbonat bazlı tampon · ürün kodu 0234 · günlük 6 g / 80 L doz alkaliniteyi yaklaşık 1 meq/L (2,8 dKH) artırır; istenen pH'a kademeli ulaşılmalı, mevcut ve hedef KH ölçülmelidir · yumuşak suda veya belirli pH hedefinde Acid Buffer ile yayımlanan oran tablosuna göre kullanılmalıdır"],
    ["Alkaline Buffer 300 g","Bitkili tatlı suda fosfat eklemeden pH ve alkaliniteyi (KH) yükselten sodyum bikarbonat bazlı tampon · ürün kodu 0236 · günlük 6 g / 80 L doz alkaliniteyi yaklaşık 1 meq/L (2,8 dKH) artırır; istenen pH'a kademeli ulaşılmalı, mevcut ve hedef KH ölçülmelidir · yumuşak suda veya belirli pH hedefinde Acid Buffer ile yayımlanan oran tablosuna göre kullanılmalıdır"],
    ["Alkaline Buffer 600 g","Bitkili tatlı suda fosfat eklemeden pH ve alkaliniteyi (KH) yükselten sodyum bikarbonat bazlı tampon · ürün kodu 0233 · günlük 6 g / 80 L doz alkaliniteyi yaklaşık 1 meq/L (2,8 dKH) artırır; istenen pH'a kademeli ulaşılmalı, mevcut ve hedef KH ölçülmelidir · yumuşak suda veya belirli pH hedefinde Acid Buffer ile yayımlanan oran tablosuna göre kullanılmalıdır"],
    ["Alkaline Buffer 1,2 kg","Bitkili tatlı suda fosfat eklemeden pH ve alkaliniteyi (KH) yükselten sodyum bikarbonat bazlı tampon · ürün kodu 0237 · günlük 6 g / 80 L doz alkaliniteyi yaklaşık 1 meq/L (2,8 dKH) artırır; istenen pH'a kademeli ulaşılmalı, mevcut ve hedef KH ölçülmelidir · yumuşak suda veya belirli pH hedefinde Acid Buffer ile yayımlanan oran tablosuna göre kullanılmalıdır"],
    ["Alkaline Buffer 4 kg","Bitkili tatlı suda fosfat eklemeden pH ve alkaliniteyi (KH) yükselten sodyum bikarbonat bazlı tampon · ürün kodu 0239 · günlük 6 g / 80 L doz alkaliniteyi yaklaşık 1 meq/L (2,8 dKH) artırır; istenen pH'a kademeli ulaşılmalı, mevcut ve hedef KH ölçülmelidir · yumuşak suda veya belirli pH hedefinde Acid Buffer ile yayımlanan oran tablosuna göre kullanılmalıdır"],
  ],"2026-10-24"),
  ...products("Seachem","bacteria","https://www.seachem.com/pristine.php",[
    ["Pristine 100 ml","Organik atık, taban çamuru ve yüzey yağını parçalayan bakteriyel biyolojik destek · ürün kodu 1240 · iyice çalkalayın, UV/ozonu kapatın; başlangıçta 5 ml / 40 L, canlı ekleme veya biyofiltre bozulmasında 5 ml / 80 L; antibiyotik önce su değişimi ve taze karbonla uzaklaştırılmalı, UV/ozon için 2–3 gün beklenmelidir"],
    ["Pristine 250 ml","Organik atık, taban çamuru ve yüzey yağını parçalayan bakteriyel biyolojik destek · ürün kodu 1241 · iyice çalkalayın, UV/ozonu kapatın; başlangıçta 5 ml / 40 L, canlı ekleme veya biyofiltre bozulmasında 5 ml / 80 L; antibiyotik önce su değişimi ve taze karbonla uzaklaştırılmalı, UV/ozon için 2–3 gün beklenmelidir"],
    ["Pristine 500 ml","Organik atık, taban çamuru ve yüzey yağını parçalayan bakteriyel biyolojik destek · ürün kodu 1242 · iyice çalkalayın, UV/ozonu kapatın; başlangıçta 5 ml / 40 L, canlı ekleme veya biyofiltre bozulmasında 5 ml / 80 L; antibiyotik önce su değişimi ve taze karbonla uzaklaştırılmalı, UV/ozon için 2–3 gün beklenmelidir"],
    ["Pristine 1 L","Organik atık, taban çamuru ve yüzey yağını parçalayan bakteriyel biyolojik destek · ürün kodu 1245 · iyice çalkalayın, UV/ozonu kapatın; başlangıçta 5 ml / 40 L, canlı ekleme veya biyofiltre bozulmasında 5 ml / 80 L; antibiyotik önce su değişimi ve taze karbonla uzaklaştırılmalı, UV/ozon için 2–3 gün beklenmelidir"],
    ["Pristine 2 L","Organik atık, taban çamuru ve yüzey yağını parçalayan bakteriyel biyolojik destek · ürün kodu 1247 · iyice çalkalayın, UV/ozonu kapatın; başlangıçta 5 ml / 40 L, canlı ekleme veya biyofiltre bozulmasında 5 ml / 80 L; antibiyotik önce su değişimi ve taze karbonla uzaklaştırılmalı, UV/ozon için 2–3 gün beklenmelidir"],
    ["Pristine 4 L","Organik atık, taban çamuru ve yüzey yağını parçalayan bakteriyel biyolojik destek · ürün kodu 1243 · iyice çalkalayın, UV/ozonu kapatın; başlangıçta 5 ml / 40 L, canlı ekleme veya biyofiltre bozulmasında 5 ml / 80 L; antibiyotik önce su değişimi ve taze karbonla uzaklaştırılmalı, UV/ozon için 2–3 gün beklenmelidir"],
  ],"2026-10-24"),
  ...products("Seachem","water_conditioner","https://www.seachem.com/clarity.php",[
    ["Clarity 100 ml","Tatlı, deniz ve resif akvaryumlarındaki parçacıkları mekanik filtrenin tutacağı kümelere dönüştüren berraklaştırıcı · ürün kodu 0145 · 5 ml / 80 L; geçici bulanıklık normaldir ve mekanik filtre pamuğu/kartuşu temizlenmelidir · çok yumuşak veya düşük tamponlu suda önce dörtte bir–yarım dozla pH etkisi test edilmelidir"],
    ["Clarity 250 ml","Tatlı, deniz ve resif akvaryumlarındaki parçacıkları mekanik filtrenin tutacağı kümelere dönüştüren berraklaştırıcı · ürün kodu 0146 · 5 ml / 80 L; geçici bulanıklık normaldir ve mekanik filtre pamuğu/kartuşu temizlenmelidir · çok yumuşak veya düşük tamponlu suda önce dörtte bir–yarım dozla pH etkisi test edilmelidir"],
    ["Clarity 500 ml","Tatlı, deniz ve resif akvaryumlarındaki parçacıkları mekanik filtrenin tutacağı kümelere dönüştüren berraklaştırıcı · ürün kodu 0143 · 5 ml / 80 L; geçici bulanıklık normaldir ve mekanik filtre pamuğu/kartuşu temizlenmelidir · çok yumuşak veya düşük tamponlu suda önce dörtte bir–yarım dozla pH etkisi test edilmelidir"],
    ["Clarity 2 L","Tatlı, deniz ve resif akvaryumlarındaki parçacıkları mekanik filtrenin tutacağı kümelere dönüştüren berraklaştırıcı · ürün kodu 0148 · 5 ml / 80 L; geçici bulanıklık normaldir ve mekanik filtre pamuğu/kartuşu temizlenmelidir · çok yumuşak veya düşük tamponlu suda önce dörtte bir–yarım dozla pH etkisi test edilmelidir"],
    ["Clarity 4 L","Tatlı, deniz ve resif akvaryumlarındaki parçacıkları mekanik filtrenin tutacağı kümelere dönüştüren berraklaştırıcı · ürün kodu 0149 · 5 ml / 80 L; geçici bulanıklık normaldir ve mekanik filtre pamuğu/kartuşu temizlenmelidir · çok yumuşak veya düşük tamponlu suda önce dörtte bir–yarım dozla pH etkisi test edilmelidir"],
  ],"2026-10-24"),
  ...products("Seachem","water_conditioner","https://www.seachem.com/amguard.php",[
    ["AmGuard 100 ml","Tatlı ve deniz suyunda serbest amonyağı dakikalar içinde yaklaşık 72 saate kadar detoksifiye eden acil durum düzenleyicisi · ürün kodu 0775 · standart doz günlük veya gerektiğinde 5 ml / 200 L; Ammonia Alert düzeyine göre Alert 5 ml / 400 L, Alarm 5 ml / 200 L, Toxic 5 ml / 80 L · 30 °C üzerinde kullanılmaz; yüksek doz düşük oksijenli veya ağır biyolojik yüklü sistemlerde oksijeni daha da azaltabilir · toplam amonyak testi yalancı pozitif gösterebilir, serbest amonyak ölçülmelidir"],
    ["AmGuard 250 ml","Tatlı ve deniz suyunda serbest amonyağı dakikalar içinde yaklaşık 72 saate kadar detoksifiye eden acil durum düzenleyicisi · ürün kodu 0776 · standart doz günlük veya gerektiğinde 5 ml / 200 L; Ammonia Alert düzeyine göre Alert 5 ml / 400 L, Alarm 5 ml / 200 L, Toxic 5 ml / 80 L · 30 °C üzerinde kullanılmaz; yüksek doz düşük oksijenli veya ağır biyolojik yüklü sistemlerde oksijeni daha da azaltabilir · toplam amonyak testi yalancı pozitif gösterebilir, serbest amonyak ölçülmelidir"],
    ["AmGuard 500 ml","Tatlı ve deniz suyunda serbest amonyağı dakikalar içinde yaklaşık 72 saate kadar detoksifiye eden acil durum düzenleyicisi · ürün kodu 0773 · standart doz günlük veya gerektiğinde 5 ml / 200 L; Ammonia Alert düzeyine göre Alert 5 ml / 400 L, Alarm 5 ml / 200 L, Toxic 5 ml / 80 L · 30 °C üzerinde kullanılmaz; yüksek doz düşük oksijenli veya ağır biyolojik yüklü sistemlerde oksijeni daha da azaltabilir · toplam amonyak testi yalancı pozitif gösterebilir, serbest amonyak ölçülmelidir"],
    ["AmGuard 4 L","Tatlı ve deniz suyunda serbest amonyağı dakikalar içinde yaklaşık 72 saate kadar detoksifiye eden acil durum düzenleyicisi · resmî sayfa 4 L boyutu listeler ancak ürün kodu yayımlamaz · standart doz günlük veya gerektiğinde 5 ml / 200 L; Ammonia Alert düzeyine göre Alert 5 ml / 400 L, Alarm 5 ml / 200 L, Toxic 5 ml / 80 L · 30 °C üzerinde kullanılmaz; yüksek doz düşük oksijenli veya ağır biyolojik yüklü sistemlerde oksijeni daha da azaltabilir · toplam amonyak testi yalancı pozitif gösterebilir, serbest amonyak ölçülmelidir"],
  ],"2026-10-24"),
  ...products("Seachem","water_conditioner","https://www.seachem.com/replenish.php",[
    ["Replenish 100 ml","RO/DI veya mineralce fakir tatlı suda kalsiyum, magnezyum, potasyum ve sodyum tuzlarıyla genel sertliği (GH) geri kazandıran mineral karışımı · ürün kodu 1475 · 5 ml / 40 L doz GH'ı yaklaşık 1 meq/L (2,8 dGH) artırır; hedef GH önce ölçülmelidir · resmî boyut özeti 100 ml'yi yazmasa da aynı sayfanın ürün kodlu görsel listesi bu paketi yayımlar · sodyum ve klorür içerdiği için canlı bitkili akvaryumlarda Equilibrium tercih edilmelidir"],
    ["Replenish 250 ml","RO/DI veya mineralce fakir tatlı suda kalsiyum, magnezyum, potasyum ve sodyum tuzlarıyla genel sertliği (GH) geri kazandıran mineral karışımı · ürün kodu 1476 · 5 ml / 40 L doz GH'ı yaklaşık 1 meq/L (2,8 dGH) artırır; hedef GH önce ölçülmelidir · sodyum ve klorür içerdiği için canlı bitkili akvaryumlarda Equilibrium tercih edilmelidir"],
    ["Replenish 500 ml","RO/DI veya mineralce fakir tatlı suda kalsiyum, magnezyum, potasyum ve sodyum tuzlarıyla genel sertliği (GH) geri kazandıran mineral karışımı · ürün kodu 1473 · 5 ml / 40 L doz GH'ı yaklaşık 1 meq/L (2,8 dGH) artırır; hedef GH önce ölçülmelidir · sodyum ve klorür içerdiği için canlı bitkili akvaryumlarda Equilibrium tercih edilmelidir"],
    ["Replenish 4 L","RO/DI veya mineralce fakir tatlı suda kalsiyum, magnezyum, potasyum ve sodyum tuzlarıyla genel sertliği (GH) geri kazandıran mineral karışımı · resmî sayfa 4 L boyutu listeler ancak ürün kodu yayımlamaz · 5 ml / 40 L doz GH'ı yaklaşık 1 meq/L (2,8 dGH) artırır; hedef GH önce ölçülmelidir · sodyum ve klorür içerdiği için canlı bitkili akvaryumlarda Equilibrium tercih edilmelidir"],
  ],"2026-10-24"),
  ...products("Seachem","water_conditioner","https://www.seachem.com/stressguard.php",[
    ["StressGuard 50 ml","Tatlı ve deniz suyu balıklarında taşıma/stres döneminde slime coat ve açık yara yüzeyini destekleyen protein etkin kolloid · ürün kodu 0524 · günlük 2,5–5 ml / 40 L, belirtiler geçene veya iyileşme tamamlanana kadar; doz iki katına çıkarılabilir · bakır bazlı ilaçlarla birlikte kullanılmaz, protein skimmer kapatılır · talimata uygun dozda bitkili, resif ve omurgasızlı sistemlerle uyumludur; veteriner teşhisi veya enfeksiyon nedeninin giderilmesi yerine geçmez"],
    ["StressGuard 100 ml","Tatlı ve deniz suyu balıklarında taşıma/stres döneminde slime coat ve açık yara yüzeyini destekleyen protein etkin kolloid · ürün kodu 0525 · günlük 2,5–5 ml / 40 L, belirtiler geçene veya iyileşme tamamlanana kadar; doz iki katına çıkarılabilir · bakır bazlı ilaçlarla birlikte kullanılmaz, protein skimmer kapatılır · talimata uygun dozda bitkili, resif ve omurgasızlı sistemlerle uyumludur; veteriner teşhisi veya enfeksiyon nedeninin giderilmesi yerine geçmez"],
    ["StressGuard 250 ml","Tatlı ve deniz suyu balıklarında taşıma/stres döneminde slime coat ve açık yara yüzeyini destekleyen protein etkin kolloid · ürün kodu 0526 · günlük 2,5–5 ml / 40 L, belirtiler geçene veya iyileşme tamamlanana kadar; doz iki katına çıkarılabilir · bakır bazlı ilaçlarla birlikte kullanılmaz, protein skimmer kapatılır · talimata uygun dozda bitkili, resif ve omurgasızlı sistemlerle uyumludur; veteriner teşhisi veya enfeksiyon nedeninin giderilmesi yerine geçmez"],
    ["StressGuard 500 ml","Tatlı ve deniz suyu balıklarında taşıma/stres döneminde slime coat ve açık yara yüzeyini destekleyen protein etkin kolloid · ürün kodu 0523 · günlük 2,5–5 ml / 40 L, belirtiler geçene veya iyileşme tamamlanana kadar; doz iki katına çıkarılabilir · bakır bazlı ilaçlarla birlikte kullanılmaz, protein skimmer kapatılır · talimata uygun dozda bitkili, resif ve omurgasızlı sistemlerle uyumludur; veteriner teşhisi veya enfeksiyon nedeninin giderilmesi yerine geçmez"],
    ["StressGuard 4 L","Tatlı ve deniz suyu balıklarında taşıma/stres döneminde slime coat ve açık yara yüzeyini destekleyen protein etkin kolloid · resmî sayfa 4 L boyutu listeler ancak ürün kodu yayımlamaz · günlük 2,5–5 ml / 40 L, belirtiler geçene veya iyileşme tamamlanana kadar; doz iki katına çıkarılabilir · bakır bazlı ilaçlarla birlikte kullanılmaz, protein skimmer kapatılır · talimata uygun dozda bitkili, resif ve omurgasızlı sistemlerle uyumludur; veteriner teşhisi veya enfeksiyon nedeninin giderilmesi yerine geçmez"],
  ],"2026-10-24"),
  ...products("Seachem","water_conditioner","https://www.seachem.com/axolotl-conditioner.php",[
    ["Axolotl Conditioner 250 ml","Aksolotl akvaryumlarında klor ve kloramini gideren; amonyak, nitrit, nitrat ve tipik musluk suyu ağır metallerini geçici olarak detoksifiye eden, pH'ı değiştirmeyen düzenleyici · ürün kodu 8136 · başlangıçta ve her yeni suda 5 ml / 160 L; doğrudan akvaryuma eklenirse toplam hacim esas alınır · yüksek kloramin için iki kat, nitrit acil durumunda en fazla beş kat kullanılabilir · kükürt kokusu normaldir; biyolojik döngünün yerine geçmez"],
  ],"2026-10-24"),
  ...products("Seachem","water_conditioner","https://www.seachem.com/betta-basics.php",[
    ["Betta Basics 60 ml","Betta ve bitkili küçük kurulumlarda klor/kloramini gideren, amonyağı detoksifiye eden ve pH'ı 7,0'a tamponlayan düzenleyici · ürün kodu 0424 · bitkili kurulumda 5 ml / 1,25 L, yalnız betta bulunan bitkisiz kapta su değişiminde 5 ml / 4 L · her su değişiminde, gerekirse haftada 2–3 kez kullanılır · bulanıklığı temizlemez; düzenli su değişimi ve filtrasyonun yerine geçmez"],
    ["Betta Basics 250 ml","Betta ve bitkili küçük kurulumlarda klor/kloramini gideren, amonyağı detoksifiye eden ve pH'ı 7,0'a tamponlayan düzenleyici · ürün kodu 0426 · bitkili kurulumda 5 ml / 1,25 L, yalnız betta bulunan bitkisiz kapta su değişiminde 5 ml / 4 L · her su değişiminde, gerekirse haftada 2–3 kez kullanılır · bulanıklığı temizlemez; düzenli su değişimi ve filtrasyonun yerine geçmez"],
    ["Betta Basics 2 L","Betta ve bitkili küçük kurulumlarda klor/kloramini gideren, amonyağı detoksifiye eden ve pH'ı 7,0'a tamponlayan düzenleyici · ürün kodu 0428 · bitkili kurulumda 5 ml / 1,25 L, yalnız betta bulunan bitkisiz kapta su değişiminde 5 ml / 4 L · her su değişiminde, gerekirse haftada 2–3 kez kullanılır · bulanıklığı temizlemez; düzenli su değişimi ve filtrasyonun yerine geçmez"],
  ],"2026-10-24"),
  ...products("Seachem","water_conditioner","https://www.seachem.com/gold-basics.php",[
    ["Gold Basics 50 ml","Japon balığı suyunda klor/kloramini gideren, amonyağı detoksifiye eden ve pH'ı 7,0'a tamponlayan düzenleyici · ürün kodu 0404 · her su değişiminde veya haftada bir, hangisi daha sıksa, yaklaşık 2,5 ml / 3,8 L · 50 ml paket yaklaşık 25 US galon suyu işler · akvaryum hacmi, filtrasyon, azot döngüsü ve düzenli su değişiminin yerine geçmez"],
  ],"2026-10-24"),
  ...products("Seachem","water_conditioner","https://www.seachem.com/surestart.php",[
    ["SureStart 3 × 100 ml","Yeni tatlı veya deniz akvaryumu başlangıcı için 100'er ml Prime, Stability ve Pristine içeren üçlü paket · ürün kodu 1128 · Prime yeni suyu düzenler, Stability biyofiltre başlangıcını destekler, Pristine organik atık ve tortu kontrolüne yönelik bakteri sağlar · tek bir karışım veya tek doz ürünü değildir; her şişe kendi talimatıyla ayrı uygulanmalı, canlı eklemeden önce amonyak ve nitrit ölçülmelidir"],
  ],"2026-10-24"),
  ...products("Seachem","water_conditioner","https://www.seachem.com/acid-regulator.php",[
    ["Acid Regulator 50 g","Tatlı suda pH'ı 4,5–6,8 aralığına düşüren ve kalsiyum/magnezyumu çöktürerek suyu yumuşatan fosfat bazlı tampon · ürün kodu 0074 · hedef pH'a ulaşana kadar günlük 5 g / 40 L, ardından ayda bir veya su değişimlerinde gerektiği kadar kullanılır · pH 5,8–6,8 hedefleri için Neutral Regulator ile resmî oran tablosuna göre uygulanmalıdır · bitkili akvaryumda fosfat nedeniyle istenmeyen yosunu destekleyebilir; bu durumda fosfatsız Acid Buffer tercih edilmelidir"],
    ["Acid Regulator 250 g","Tatlı suda pH'ı 4,5–6,8 aralığına düşüren ve kalsiyum/magnezyumu çöktürerek suyu yumuşatan fosfat bazlı tampon · ürün kodu 0076 · hedef pH'a ulaşana kadar günlük 5 g / 40 L, ardından ayda bir veya su değişimlerinde gerektiği kadar kullanılır · pH 5,8–6,8 hedefleri için Neutral Regulator ile resmî oran tablosuna göre uygulanmalıdır · bitkili akvaryumda fosfat nedeniyle istenmeyen yosunu destekleyebilir; bu durumda fosfatsız Acid Buffer tercih edilmelidir"],
    ["Acid Regulator 500 g","Tatlı suda pH'ı 4,5–6,8 aralığına düşüren ve kalsiyum/magnezyumu çöktürerek suyu yumuşatan fosfat bazlı tampon · ürün kodu 0073 · hedef pH'a ulaşana kadar günlük 5 g / 40 L, ardından ayda bir veya su değişimlerinde gerektiği kadar kullanılır · pH 5,8–6,8 hedefleri için Neutral Regulator ile resmî oran tablosuna göre uygulanmalıdır · bitkili akvaryumda fosfat nedeniyle istenmeyen yosunu destekleyebilir; bu durumda fosfatsız Acid Buffer tercih edilmelidir"],
    ["Acid Regulator 1 kg","Tatlı suda pH'ı 4,5–6,8 aralığına düşüren ve kalsiyum/magnezyumu çöktürerek suyu yumuşatan fosfat bazlı tampon · ürün kodu 0077 · hedef pH'a ulaşana kadar günlük 5 g / 40 L, ardından ayda bir veya su değişimlerinde gerektiği kadar kullanılır · pH 5,8–6,8 hedefleri için Neutral Regulator ile resmî oran tablosuna göre uygulanmalıdır · bitkili akvaryumda fosfat nedeniyle istenmeyen yosunu destekleyebilir; bu durumda fosfatsız Acid Buffer tercih edilmelidir"],
    ["Acid Regulator 4 kg","Tatlı suda pH'ı 4,5–6,8 aralığına düşüren ve kalsiyum/magnezyumu çöktürerek suyu yumuşatan fosfat bazlı tampon · resmî sayfa 4 kg boyutu listeler ancak ürün kodu yayımlamaz · hedef pH'a ulaşana kadar günlük 5 g / 40 L, ardından ayda bir veya su değişimlerinde gerektiği kadar kullanılır · pH 5,8–6,8 hedefleri için Neutral Regulator ile resmî oran tablosuna göre uygulanmalıdır · bitkili akvaryumda fosfat nedeniyle istenmeyen yosunu destekleyebilir; bu durumda fosfatsız Acid Buffer tercih edilmelidir"],
  ],"2026-10-24"),
  ...products("Seachem","water_conditioner","https://www.seachem.com/alkaline-regulator.php",[
    ["Alkaline Regulator 50 g","Tatlı suda pH'ı 7,1–7,6 aralığına yükselten fosfat bazlı tampon · ürün kodu 0094 · hedef pH'a ulaşana kadar günlük 5 g / 40–80 L, ardından ayda bir veya su değişimlerinde gerektiği kadar kullanılır · pH 7,1–7,5 hedefleri için Neutral Regulator ile resmî oran tablosuna göre uygulanmalıdır · KH yükseltmez ve fosfat yosuna katkıda bulunabilir; KH için Alkaline Buffer gerekir"],
    ["Alkaline Regulator 250 g","Tatlı suda pH'ı 7,1–7,6 aralığına yükselten fosfat bazlı tampon · ürün kodu 0096 · hedef pH'a ulaşana kadar günlük 5 g / 40–80 L, ardından ayda bir veya su değişimlerinde gerektiği kadar kullanılır · pH 7,1–7,5 hedefleri için Neutral Regulator ile resmî oran tablosuna göre uygulanmalıdır · KH yükseltmez ve fosfat yosuna katkıda bulunabilir; KH için Alkaline Buffer gerekir"],
    ["Alkaline Regulator 500 g","Tatlı suda pH'ı 7,1–7,6 aralığına yükselten fosfat bazlı tampon · ürün kodu 0093 · hedef pH'a ulaşana kadar günlük 5 g / 40–80 L, ardından ayda bir veya su değişimlerinde gerektiği kadar kullanılır · pH 7,1–7,5 hedefleri için Neutral Regulator ile resmî oran tablosuna göre uygulanmalıdır · KH yükseltmez ve fosfat yosuna katkıda bulunabilir; KH için Alkaline Buffer gerekir"],
    ["Alkaline Regulator 1 kg","Tatlı suda pH'ı 7,1–7,6 aralığına yükselten fosfat bazlı tampon · ürün kodu 0097 · hedef pH'a ulaşana kadar günlük 5 g / 40–80 L, ardından ayda bir veya su değişimlerinde gerektiği kadar kullanılır · pH 7,1–7,5 hedefleri için Neutral Regulator ile resmî oran tablosuna göre uygulanmalıdır · KH yükseltmez ve fosfat yosuna katkıda bulunabilir; KH için Alkaline Buffer gerekir"],
    ["Alkaline Regulator 4 kg","Tatlı suda pH'ı 7,1–7,6 aralığına yükselten fosfat bazlı tampon · resmî sayfa 4 kg boyutu listeler ancak ürün kodu yayımlamaz · hedef pH'a ulaşana kadar günlük 5 g / 40–80 L, ardından ayda bir veya su değişimlerinde gerektiği kadar kullanılır · pH 7,1–7,5 hedefleri için Neutral Regulator ile resmî oran tablosuna göre uygulanmalıdır · KH yükseltmez ve fosfat yosuna katkıda bulunabilir; KH için Alkaline Buffer gerekir"],
  ],"2026-10-24"),
  ...products("Seachem","water_conditioner","https://www.seachem.com/american-cichlid-salt.php",[
    ["American Cichlid Salt 50 g","Orta ve Güney Amerika cikletleri için kalsiyum, magnezyum, sodyum, potasyum ve iz element sağlayan mineral tuzu · ürün kodu 1464 · 110 L yeni su için Güney Amerika türlerinde 2,5 g, Orta Amerika türlerinde 1,25 g kullanılır · yalnız ilk kurulumda ve değiştirilen su hacmine göre su değişiminde dozlanır; buharlaşan suyu tamamlarken eklenmez · GH'ı yükseltir fakat pH veya KH'ı tamponlamaz; ciddi göz tahrişi ve cilt yanığı riski nedeniyle eldivenle kullanılmalı ve çocuklardan uzak tutulmalıdır"],
    ["American Cichlid Salt 250 g","Orta ve Güney Amerika cikletleri için kalsiyum, magnezyum, sodyum, potasyum ve iz element sağlayan mineral tuzu · ürün kodu 1466 · 110 L yeni su için Güney Amerika türlerinde 2,5 g, Orta Amerika türlerinde 1,25 g kullanılır · yalnız ilk kurulumda ve değiştirilen su hacmine göre su değişiminde dozlanır; buharlaşan suyu tamamlarken eklenmez · GH'ı yükseltir fakat pH veya KH'ı tamponlamaz; ciddi göz tahrişi ve cilt yanığı riski nedeniyle eldivenle kullanılmalı ve çocuklardan uzak tutulmalıdır"],
    ["American Cichlid Salt 4 kg","Orta ve Güney Amerika cikletleri için kalsiyum, magnezyum, sodyum, potasyum ve iz element sağlayan mineral tuzu · resmî sayfa 4 kg boyutu listeler ancak ürün kodu yayımlamaz · 110 L yeni su için Güney Amerika türlerinde 2,5 g, Orta Amerika türlerinde 1,25 g kullanılır · yalnız ilk kurulumda ve değiştirilen su hacmine göre su değişiminde dozlanır; buharlaşan suyu tamamlarken eklenmez · GH'ı yükseltir fakat pH veya KH'ı tamponlamaz; ciddi göz tahrişi ve cilt yanığı riski nedeniyle eldivenle kullanılmalı ve çocuklardan uzak tutulmalıdır"],
  ],"2026-10-24"),
  ...products("Seachem","water_conditioner","https://www.seachem.com/arowana-buffer.php",[
    ["Arowana Buffer 250 g","Asya arowanaları için düşük veya yüksek pH'ı 6,5'e ayarlayıp 2–4 hafta koruyan ve kalsiyum/magnezyumu çöktürerek suyu yumuşatan tampon · ürün kodu 1226 · ayda bir veya iki kez 1 silme çay kaşığı / 40 L; yüksek alkalinitede pH 6,5 kurulana kadar günlük kullanılabilir · tercihen değişim suyunda çözülür; bağışıklık desteği ifadesi hastalık tedavisi veya veteriner teşhisi değildir"],
    ["Arowana Buffer 500 g","Asya arowanaları için düşük veya yüksek pH'ı 6,5'e ayarlayıp 2–4 hafta koruyan ve kalsiyum/magnezyumu çöktürerek suyu yumuşatan tampon · ürün kodu 1223 · ayda bir veya iki kez 1 silme çay kaşığı / 40 L; yüksek alkalinitede pH 6,5 kurulana kadar günlük kullanılabilir · tercihen değişim suyunda çözülür; bağışıklık desteği ifadesi hastalık tedavisi veya veteriner teşhisi değildir"],
    ["Arowana Buffer 1 kg","Asya arowanaları için düşük veya yüksek pH'ı 6,5'e ayarlayıp 2–4 hafta koruyan ve kalsiyum/magnezyumu çöktürerek suyu yumuşatan tampon · ürün kodu 1227 · ayda bir veya iki kez 1 silme çay kaşığı / 40 L; yüksek alkalinitede pH 6,5 kurulana kadar günlük kullanılabilir · tercihen değişim suyunda çözülür; bağışıklık desteği ifadesi hastalık tedavisi veya veteriner teşhisi değildir"],
    ["Arowana Buffer 4 kg","Asya arowanaları için düşük veya yüksek pH'ı 6,5'e ayarlayıp 2–4 hafta koruyan ve kalsiyum/magnezyumu çöktürerek suyu yumuşatan tampon · resmî sayfa 4 kg boyutu listeler ancak ürün kodu yayımlamaz · ayda bir veya iki kez 1 silme çay kaşığı / 40 L; yüksek alkalinitede pH 6,5 kurulana kadar günlük kullanılabilir · tercihen değişim suyunda çözülür; bağışıklık desteği ifadesi hastalık tedavisi veya veteriner teşhisi değildir"],
  ],"2026-10-24"),
  ...products("Seachem","water_conditioner","https://www.seachem.com/axolotl-buffer.php",[
    ["Axolotl Buffer 250 ml","Aksolotl suyunda düşük veya yüksek pH'ı 7,4–7,6 aralığına ayarlayan ve kalsiyum/magnezyumu çöktürerek suyu yumuşatan fosfat bazlı tampon · ürün kodu 8146 · haftada iki kez veya gerektiğinde 5 ml / 10 L; çok sert suda çift veya üçlü doz gerekebilir · klor, kloramin veya amonyak gidermez; bu işlev için Axolotl Conditioner ayrıca gerekir · pH ve KH ölçülmeden ani yüksek doz uygulanmamalıdır"],
  ],"2026-10-24"),
  ...products("Seachem","water_conditioner","https://www.seachem.com/brackish-salt.php",[
    ["Brackish Salt 300 g","Canlı doğuranlar ve acı su türleri için yalnız sodyum klorürden oluşmayan mineral tuz karışımı · ürün kodu 0226 · ilk kurulumda ve su değişiminde çözülerek, mevcut tanka kademeli eklenir; buharlaşan suyu tamamlarken kullanılmaz · canlı doğuranlar/genel tatlı su için 20 g / 40 L, Yucatán veya Sri Lanka haliç türleri için 15 g / 12 L, Tayland-Kamboçya-Borneo-Sumatra türleri için 40 g / 12 L; scat için 80 g / 12 L dozu bitkili akvaryuma uygun değildir · pH'ı değiştirmez ve tamponlama sağlamaz"],
    ["Brackish Salt 600 g","Canlı doğuranlar ve acı su türleri için yalnız sodyum klorürden oluşmayan mineral tuz karışımı · ürün kodu 0223 · ilk kurulumda ve su değişiminde çözülerek, mevcut tanka kademeli eklenir; buharlaşan suyu tamamlarken kullanılmaz · canlı doğuranlar/genel tatlı su için 20 g / 40 L, Yucatán veya Sri Lanka haliç türleri için 15 g / 12 L, Tayland-Kamboçya-Borneo-Sumatra türleri için 40 g / 12 L; scat için 80 g / 12 L dozu bitkili akvaryuma uygun değildir · pH'ı değiştirmez ve tamponlama sağlamaz"],
    ["Brackish Salt 4 kg","Canlı doğuranlar ve acı su türleri için yalnız sodyum klorürden oluşmayan mineral tuz karışımı · resmî sayfa 4 kg boyutu listeler ancak ürün kodu yayımlamaz · ilk kurulumda ve su değişiminde çözülerek, mevcut tanka kademeli eklenir; buharlaşan suyu tamamlarken kullanılmaz · canlı doğuranlar/genel tatlı su için 20 g / 40 L, Yucatán veya Sri Lanka haliç türleri için 15 g / 12 L, Tayland-Kamboçya-Borneo-Sumatra türleri için 40 g / 12 L; scat için 80 g / 12 L dozu bitkili akvaryuma uygun değildir · pH'ı değiştirmez ve tamponlama sağlamaz"],
  ],"2026-10-24"),
  ...products("Seachem","water_conditioner","https://www.seachem.com/cichlid-lake-salt.php",[
    ["Cichlid Lake Salt 250 g","Afrika Rift gölü cikletleri için kalsiyum, magnezyum, sodyum, potasyum ve iz element sağlayan mineral tuzu · ürün kodu 0276 · RO/DI su için 40 L başına Tanganyika 11 g, Malawi 5,5 g, Victoria 3,6 g; diğer sularda önce GH ölçülür · bu dozlar GH'ı sırasıyla yaklaşık 8,8, 4,4 ve 3 dGH artırır · yalnız kurulum ve değiştirilen su hacmi için çözülerek kullanılır, buharlaşan suya eklenmez · pH/KH tamponlamaz; bunlar için göle uygun Buffer ayrıca gerekir"],
    ["Cichlid Lake Salt 500 g","Afrika Rift gölü cikletleri için kalsiyum, magnezyum, sodyum, potasyum ve iz element sağlayan mineral tuzu · ürün kodu 0273 · RO/DI su için 40 L başına Tanganyika 11 g, Malawi 5,5 g, Victoria 3,6 g; diğer sularda önce GH ölçülür · bu dozlar GH'ı sırasıyla yaklaşık 8,8, 4,4 ve 3 dGH artırır · yalnız kurulum ve değiştirilen su hacmi için çözülerek kullanılır, buharlaşan suya eklenmez · pH/KH tamponlamaz; bunlar için göle uygun Buffer ayrıca gerekir"],
    ["Cichlid Lake Salt 1 kg","Afrika Rift gölü cikletleri için kalsiyum, magnezyum, sodyum, potasyum ve iz element sağlayan mineral tuzu · ürün kodu 0277 · RO/DI su için 40 L başına Tanganyika 11 g, Malawi 5,5 g, Victoria 3,6 g; diğer sularda önce GH ölçülür · bu dozlar GH'ı sırasıyla yaklaşık 8,8, 4,4 ve 3 dGH artırır · yalnız kurulum ve değiştirilen su hacmi için çözülerek kullanılır, buharlaşan suya eklenmez · pH/KH tamponlamaz; bunlar için göle uygun Buffer ayrıca gerekir"],
    ["Cichlid Lake Salt 4 kg","Afrika Rift gölü cikletleri için kalsiyum, magnezyum, sodyum, potasyum ve iz element sağlayan mineral tuzu · ürün kodu 0279 · RO/DI su için 40 L başına Tanganyika 11 g, Malawi 5,5 g, Victoria 3,6 g; diğer sularda önce GH ölçülür · bu dozlar GH'ı sırasıyla yaklaşık 8,8, 4,4 ve 3 dGH artırır · yalnız kurulum ve değiştirilen su hacmi için çözülerek kullanılır, buharlaşan suya eklenmez · pH/KH tamponlamaz; bunlar için göle uygun Buffer ayrıca gerekir"],
    ["Cichlid Lake Salt 20 kg","Afrika Rift gölü cikletleri için kalsiyum, magnezyum, sodyum, potasyum ve iz element sağlayan mineral tuzu · resmî sayfa 20 kg boyutu listeler ancak ürün kodu yayımlamaz · RO/DI su için 40 L başına Tanganyika 11 g, Malawi 5,5 g, Victoria 3,6 g; diğer sularda önce GH ölçülür · yalnız kurulum ve değiştirilen su hacmi için çözülerek kullanılır, buharlaşan suya eklenmez · pH/KH tamponlamaz; ciddi göz tahrişi ve cilt yanığı riski nedeniyle eldivenle kullanılmalıdır"],
    ["Cichlid Lake Salt 100 kg","Afrika Rift gölü cikletleri için kalsiyum, magnezyum, sodyum, potasyum ve iz element sağlayan mineral tuzu · resmî sayfa 100 kg boyutu listeler ancak ürün kodu yayımlamaz · RO/DI su için 40 L başına Tanganyika 11 g, Malawi 5,5 g, Victoria 3,6 g; diğer sularda önce GH ölçülür · yalnız kurulum ve değiştirilen su hacmi için çözülerek kullanılır, buharlaşan suya eklenmez · pH/KH tamponlamaz; ciddi göz tahrişi ve cilt yanığı riski nedeniyle eldivenle kullanılmalıdır"],
  ],"2026-10-24"),
  ...products("Seachem","water_conditioner","https://www.seachem.com/cichlid-trace.php",[
    ["Cichlid Trace 250 ml","Cikletler için kalsiyum, magnezyum, iyot, potasyum ve yayımlanan ultra iz elementleri düzenli yenileyen sıvı destek · ürün kodu 0706 · haftada iki kez 5 ml / 80 L · Cichlid Lake Salt'ın kurulum/su değişimi mineralizasyonunun yerine geçmez; iz element takviyesidir ve hastalık tedavisi değildir"],
    ["Cichlid Trace 500 ml","Cikletler için kalsiyum, magnezyum, iyot, potasyum ve yayımlanan ultra iz elementleri düzenli yenileyen sıvı destek · ürün kodu 0703 · haftada iki kez 5 ml / 80 L · Cichlid Lake Salt'ın kurulum/su değişimi mineralizasyonunun yerine geçmez; iz element takviyesidir ve hastalık tedavisi değildir"],
    ["Cichlid Trace 4 L","Cikletler için kalsiyum, magnezyum, iyot, potasyum ve yayımlanan ultra iz elementleri düzenli yenileyen sıvı destek · resmî sayfa 4 L boyutu listeler ancak ürün kodu yayımlamaz · haftada iki kez 5 ml / 80 L · Cichlid Lake Salt'ın kurulum/su değişimi mineralizasyonunun yerine geçmez; iz element takviyesidir ve hastalık tedavisi değildir"],
  ],"2026-10-24"),
  ...products("Seachem","water_conditioner","https://www.seachem.com/discus-buffer.php",[
    ["Discus Buffer 50 g","Discus ve asidik suya uyumlu tatlı su türleri için pH'ı 5,8–6,8 aralığına düşüren, kalsiyum/magnezyumu çöktürerek GH'ı azaltan fosfat bazlı tampon · ürün kodu 0264 · hedef pH'a ulaşana kadar günlük 5 g / 40–80 L, ardından ayda bir veya su değişiminde gerektiği kadar · belirli hedefler için Neutral Regulator ile resmî RO/DI oran tablosuna göre kullanılır · bitkili akvaryumda fazla fosfat/yosun kaygısı varsa Acid Buffer ile Alkaline Buffer tercih edilmelidir"],
    ["Discus Buffer 250 g","Discus ve asidik suya uyumlu tatlı su türleri için pH'ı 5,8–6,8 aralığına düşüren, kalsiyum/magnezyumu çöktürerek GH'ı azaltan fosfat bazlı tampon · ürün kodu 0266 · hedef pH'a ulaşana kadar günlük 5 g / 40–80 L, ardından ayda bir veya su değişiminde gerektiği kadar · belirli hedefler için Neutral Regulator ile resmî RO/DI oran tablosuna göre kullanılır · bitkili akvaryumda fazla fosfat/yosun kaygısı varsa Acid Buffer ile Alkaline Buffer tercih edilmelidir"],
    ["Discus Buffer 500 g","Discus ve asidik suya uyumlu tatlı su türleri için pH'ı 5,8–6,8 aralığına düşüren, kalsiyum/magnezyumu çöktürerek GH'ı azaltan fosfat bazlı tampon · ürün kodu 0263 · hedef pH'a ulaşana kadar günlük 5 g / 40–80 L, ardından ayda bir veya su değişiminde gerektiği kadar · belirli hedefler için Neutral Regulator ile resmî RO/DI oran tablosuna göre kullanılır · bitkili akvaryumda fazla fosfat/yosun kaygısı varsa Acid Buffer ile Alkaline Buffer tercih edilmelidir"],
    ["Discus Buffer 1 kg","Discus ve asidik suya uyumlu tatlı su türleri için pH'ı 5,8–6,8 aralığına düşüren, kalsiyum/magnezyumu çöktürerek GH'ı azaltan fosfat bazlı tampon · ürün kodu 0267 · hedef pH'a ulaşana kadar günlük 5 g / 40–80 L, ardından ayda bir veya su değişiminde gerektiği kadar · belirli hedefler için Neutral Regulator ile resmî RO/DI oran tablosuna göre kullanılır · bitkili akvaryumda fazla fosfat/yosun kaygısı varsa Acid Buffer ile Alkaline Buffer tercih edilmelidir"],
    ["Discus Buffer 4 kg","Discus ve asidik suya uyumlu tatlı su türleri için pH'ı 5,8–6,8 aralığına düşüren, kalsiyum/magnezyumu çöktürerek GH'ı azaltan fosfat bazlı tampon · resmî sayfa 4 kg boyutu listeler ancak ürün kodu yayımlamaz · hedef pH'a ulaşana kadar günlük 5 g / 40–80 L, ardından ayda bir veya su değişiminde gerektiği kadar · belirli hedefler için Neutral Regulator ile resmî RO/DI oran tablosuna göre kullanılır · bitkili akvaryumda fazla fosfat/yosun kaygısı varsa Acid Buffer ile Alkaline Buffer tercih edilmelidir"],
  ],"2026-10-24"),
  ...products("Seachem","water_conditioner","https://www.seachem.com/discus-trace.php",[
    ["Discus Trace 250 ml","Discus için sodyum içermeyen kalsiyum, magnezyum, iyot, potasyum ve yayımlanan ultra iz element desteği · ürün kodu 0756 · haftada iki kez 5 ml / 80 L · sıradan sodyum klorürlü akvaryum tuzunun yerine geçmez; discus ve canlı bitkilerin yüksek sodyum toleransının düşük olduğu özellikle dikkate alınmalıdır · hastalık tedavisi değildir"],
    ["Discus Trace 500 ml","Discus için sodyum içermeyen kalsiyum, magnezyum, iyot, potasyum ve yayımlanan ultra iz element desteği · ürün kodu 0753 · haftada iki kez 5 ml / 80 L · sıradan sodyum klorürlü akvaryum tuzunun yerine geçmez; discus ve canlı bitkilerin yüksek sodyum toleransının düşük olduğu özellikle dikkate alınmalıdır · hastalık tedavisi değildir"],
    ["Discus Trace 4 L","Discus için sodyum içermeyen kalsiyum, magnezyum, iyot, potasyum ve yayımlanan ultra iz element desteği · resmî sayfa 4 L boyutu listeler ancak ürün kodu yayımlamaz · haftada iki kez 5 ml / 80 L · sıradan sodyum klorürlü akvaryum tuzunun yerine geçmez; discus ve canlı bitkilerin yüksek sodyum toleransının düşük olduğu özellikle dikkate alınmalıdır · hastalık tedavisi değildir"],
  ],"2026-10-24"),
  ...products("Seachem","water_conditioner","https://www.seachem.com/fresh-trace.php",[
    ["Fresh Trace 250 ml","Tatlı su balıkları için kalsiyum, magnezyum, iyot, potasyum ve yayımlanan ultra iz elementleri düzenli yenileyen sıvı destek · ürün kodu 0716 · haftada iki kez 5 ml / 80 L · su düzenleyici, GH/KH mineralizasyonu veya hastalık tedavisi değildir; uygun yem ve düzenli su bakımıyla birlikte tamamlayıcıdır"],
    ["Fresh Trace 500 ml","Tatlı su balıkları için kalsiyum, magnezyum, iyot, potasyum ve yayımlanan ultra iz elementleri düzenli yenileyen sıvı destek · ürün kodu 0713 · haftada iki kez 5 ml / 80 L · su düzenleyici, GH/KH mineralizasyonu veya hastalık tedavisi değildir; uygun yem ve düzenli su bakımıyla birlikte tamamlayıcıdır"],
    ["Fresh Trace 4 L","Tatlı su balıkları için kalsiyum, magnezyum, iyot, potasyum ve yayımlanan ultra iz elementleri düzenli yenileyen sıvı destek · resmî sayfa 4 L boyutu listeler ancak ürün kodu yayımlamaz · haftada iki kez 5 ml / 80 L · su düzenleyici, GH/KH mineralizasyonu veya hastalık tedavisi değildir; uygun yem ve düzenli su bakımıyla birlikte tamamlayıcıdır"],
  ],"2026-10-24"),
  ...products("Seachem","water_conditioner","https://www.seachem.com/gold-buffer.php",[
    ["Gold Buffer 70 g","Japon balıkları için fosfat eklemeden pH'ı 7,2–7,8 aralığına yükseltip tamponlayan bikarbonat tuzu karışımı · ürün kodu 0254 · hedef pH'a ulaşana kadar günlük 1 silme çay kaşığı / 40 L; yumuşak veya zayıf tamponlu suda yarım doz · pH'ı düşürmez ve tercihli tampon noktası 7,8'dir · klor gidermez; yeni su için Gold Basics ayrıca gerekir"],
    ["Gold Buffer 300 g","Japon balıkları için fosfat eklemeden pH'ı 7,2–7,8 aralığına yükseltip tamponlayan bikarbonat tuzu karışımı · ürün kodu 0256 · hedef pH'a ulaşana kadar günlük 1 silme çay kaşığı / 40 L; yumuşak veya zayıf tamponlu suda yarım doz · pH'ı düşürmez ve tercihli tampon noktası 7,8'dir · klor gidermez; yeni su için Gold Basics ayrıca gerekir"],
    ["Gold Buffer 4 kg","Japon balıkları için fosfat eklemeden pH'ı 7,2–7,8 aralığına yükseltip tamponlayan bikarbonat tuzu karışımı · resmî sayfa 4 kg boyutu listeler ancak ürün kodu yayımlamaz · hedef pH'a ulaşana kadar günlük 1 silme çay kaşığı / 40 L; yumuşak veya zayıf tamponlu suda yarım doz · pH'ı düşürmez ve tercihli tampon noktası 7,8'dir · klor gidermez; yeni su için Gold Basics ayrıca gerekir"],
  ],"2026-10-24"),
  ...products("Seachem","water_conditioner","https://www.seachem.com/gold-salt.php",[
    ["Gold Salt 70 g","Japon balıkları için mineral ortam sağlayan ve nitrit zehirlenmesi riskini azaltmaya yardımcı olan tuz karışımı · ürün kodu 0214 · kurulumda veya su değişiminde 18 g / 40 L; mevcut tanka kademeli ve önceden çözülerek eklenir · buharlaşan suyu tamamlarken kullanılmaz · pH'ı değiştirmez veya tamponlamaz; pH için Gold Buffer, klor/kloramin için Gold Basics ayrıca gerekir"],
    ["Gold Salt 300 g","Japon balıkları için mineral ortam sağlayan ve nitrit zehirlenmesi riskini azaltmaya yardımcı olan tuz karışımı · ürün kodu 0216 · kurulumda veya su değişiminde 18 g / 40 L; mevcut tanka kademeli ve önceden çözülerek eklenir · buharlaşan suyu tamamlarken kullanılmaz · pH'ı değiştirmez veya tamponlamaz; pH için Gold Buffer, klor/kloramin için Gold Basics ayrıca gerekir"],
    ["Gold Salt 4 kg","Japon balıkları için mineral ortam sağlayan ve nitrit zehirlenmesi riskini azaltmaya yardımcı olan tuz karışımı · resmî sayfa 4 kg boyutu listeler ancak ürün kodu yayımlamaz · kurulumda veya su değişiminde 18 g / 40 L; mevcut tanka kademeli ve önceden çözülerek eklenir · buharlaşan suyu tamamlarken kullanılmaz · pH'ı değiştirmez veya tamponlamaz; pH için Gold Buffer, klor/kloramin için Gold Basics ayrıca gerekir"],
  ],"2026-10-24"),
  ...products("Seachem","water_conditioner","https://www.seachem.com/gold-trace.php",[
    ["Gold Trace 250 ml","Japon balıkları için kalsiyum, magnezyum, iyot, potasyum ve yayımlanan ultra iz element desteği · ürün kodu 0786 · haftada iki kez 5 ml / 80 L · Gold Salt, pH tamponu, klor düzenleyicisi veya hastalık tedavisi değildir; uygun yem ve düzenli su bakımıyla birlikte tamamlayıcıdır"],
    ["Gold Trace 500 ml","Japon balıkları için kalsiyum, magnezyum, iyot, potasyum ve yayımlanan ultra iz element desteği · ürün kodu 0783 · haftada iki kez 5 ml / 80 L · Gold Salt, pH tamponu, klor düzenleyicisi veya hastalık tedavisi değildir; uygun yem ve düzenli su bakımıyla birlikte tamamlayıcıdır"],
    ["Gold Trace 4 L","Japon balıkları için kalsiyum, magnezyum, iyot, potasyum ve yayımlanan ultra iz element desteği · resmî sayfa 4 L boyutu listeler ancak ürün kodu yayımlamaz · haftada iki kez 5 ml / 80 L · Gold Salt, pH tamponu, klor düzenleyicisi veya hastalık tedavisi değildir; uygun yem ve düzenli su bakımıyla birlikte tamamlayıcıdır"],
  ],"2026-10-24"),
  ...products("Seachem","water_conditioner","https://www.seachem.com/malawi-victoria-buffer.php",[
    ["Malawi/Victoria Buffer 250 g","Malawi ve Victoria gölü cikletleri için KH, tampon kapasitesi ve pH'ı yükselten karbonat tuzu karışımı · ürün kodu 0296 · pH 7,8–8,4 hedeflenir; hedefe ulaşana kadar günlük 6 g / 40–80 L, ardından genellikle 2–3 haftada bir gerektiği kadar · GH'ı yükseltmez; mineralizasyon için Cichlid Lake Salt ayrıca gerekir · pH 7,8 altı için Acid Buffer, 8,4 üstü için Tanganyika Buffer ile ölçümlü ayar yapılır"],
    ["Malawi/Victoria Buffer 500 g","Malawi ve Victoria gölü cikletleri için KH, tampon kapasitesi ve pH'ı yükselten karbonat tuzu karışımı · ürün kodu 0293 · pH 7,8–8,4 hedeflenir; hedefe ulaşana kadar günlük 6 g / 40–80 L, ardından genellikle 2–3 haftada bir gerektiği kadar · GH'ı yükseltmez; mineralizasyon için Cichlid Lake Salt ayrıca gerekir · pH 7,8 altı için Acid Buffer, 8,4 üstü için Tanganyika Buffer ile ölçümlü ayar yapılır"],
    ["Malawi/Victoria Buffer 1 kg","Malawi ve Victoria gölü cikletleri için KH, tampon kapasitesi ve pH'ı yükselten karbonat tuzu karışımı · ürün kodu 0297 · pH 7,8–8,4 hedeflenir; hedefe ulaşana kadar günlük 6 g / 40–80 L, ardından genellikle 2–3 haftada bir gerektiği kadar · GH'ı yükseltmez; mineralizasyon için Cichlid Lake Salt ayrıca gerekir · pH 7,8 altı için Acid Buffer, 8,4 üstü için Tanganyika Buffer ile ölçümlü ayar yapılır"],
    ["Malawi/Victoria Buffer 4 kg","Malawi ve Victoria gölü cikletleri için KH, tampon kapasitesi ve pH'ı yükselten karbonat tuzu karışımı · resmî sayfa 4 kg boyutu listeler ancak ürün kodu yayımlamaz · pH 7,8–8,4 hedeflenir; hedefe ulaşana kadar günlük 6 g / 40–80 L, ardından genellikle 2–3 haftada bir gerektiği kadar · GH'ı yükseltmez; mineralizasyon için Cichlid Lake Salt ayrıca gerekir · pH 7,8 altı için Acid Buffer, 8,4 üstü için Tanganyika Buffer ile ölçümlü ayar yapılır"],
  ],"2026-10-24"),
  ...products("Seachem","water_conditioner","https://www.seachem.com/tanganyika-buffer.php",[
    ["Tanganyika Buffer 250 g","Tanganyika gölü cikletleri için KH, alkalinite, tampon kapasitesi ve pH'ı yükselten karbonat tuzu karışımı · ürün kodu 0286 · pH 9,0–9,4 hedeflenir; hedefe ulaşana kadar günlük 5 g / 40–80 L, ardından genellikle 2–3 haftada bir gerektiği kadar · GH'ı yükseltmez; mineralizasyon için Cichlid Lake Salt ayrıca gerekir · daha düşük pH için Malawi/Victoria Buffer tek başına veya birlikte ölçümlü kullanılır"],
    ["Tanganyika Buffer 500 g","Tanganyika gölü cikletleri için KH, alkalinite, tampon kapasitesi ve pH'ı yükselten karbonat tuzu karışımı · ürün kodu 0283 · pH 9,0–9,4 hedeflenir; hedefe ulaşana kadar günlük 5 g / 40–80 L, ardından genellikle 2–3 haftada bir gerektiği kadar · GH'ı yükseltmez; mineralizasyon için Cichlid Lake Salt ayrıca gerekir · daha düşük pH için Malawi/Victoria Buffer tek başına veya birlikte ölçümlü kullanılır"],
    ["Tanganyika Buffer 1 kg","Tanganyika gölü cikletleri için KH, alkalinite, tampon kapasitesi ve pH'ı yükselten karbonat tuzu karışımı · ürün kodu 0287 · pH 9,0–9,4 hedeflenir; hedefe ulaşana kadar günlük 5 g / 40–80 L, ardından genellikle 2–3 haftada bir gerektiği kadar · GH'ı yükseltmez; mineralizasyon için Cichlid Lake Salt ayrıca gerekir · daha düşük pH için Malawi/Victoria Buffer tek başına veya birlikte ölçümlü kullanılır"],
    ["Tanganyika Buffer 4 kg","Tanganyika gölü cikletleri için KH, alkalinite, tampon kapasitesi ve pH'ı yükselten karbonat tuzu karışımı · resmî sayfa 4 kg boyutu listeler ancak ürün kodu yayımlamaz · pH 9,0–9,4 hedeflenir; hedefe ulaşana kadar günlük 5 g / 40–80 L, ardından genellikle 2–3 haftada bir gerektiği kadar · GH'ı yükseltmez; mineralizasyon için Cichlid Lake Salt ayrıca gerekir · daha düşük pH için Malawi/Victoria Buffer tek başına veya birlikte ölçümlü kullanılır"],
  ],"2026-10-24"),
  ...products("Seachem","water_conditioner","https://www.seachem.com/neutral-regulator.php",[
    ["Neutral Regulator 50 g","Tatlı suda düşük veya yüksek pH'ı 7,0'a ayarlayan, kalsiyum/magnezyumu çöktürerek suyu yumuşatan ve klor/kloramini giderip amonyağı detoksifiye eden fosfat bazlı tampon · ürün kodu 0304 · ayda bir veya iki kez 5 g / 40–80 L; yüksek alkalinitede hedefe ulaşana kadar günlük kullanılabilir · tercihen değişim suyunda çözülür · KH yükseltmez; bitkili akvaryumda fosfatlı tampon yerine Acid Buffer ve Alkaline Buffer önerilir"],
    ["Neutral Regulator 250 g","Tatlı suda düşük veya yüksek pH'ı 7,0'a ayarlayan, kalsiyum/magnezyumu çöktürerek suyu yumuşatan ve klor/kloramini giderip amonyağı detoksifiye eden fosfat bazlı tampon · ürün kodu 0306 · ayda bir veya iki kez 5 g / 40–80 L; yüksek alkalinitede hedefe ulaşana kadar günlük kullanılabilir · tercihen değişim suyunda çözülür · KH yükseltmez; bitkili akvaryumda fosfatlı tampon yerine Acid Buffer ve Alkaline Buffer önerilir"],
    ["Neutral Regulator 500 g","Tatlı suda düşük veya yüksek pH'ı 7,0'a ayarlayan, kalsiyum/magnezyumu çöktürerek suyu yumuşatan ve klor/kloramini giderip amonyağı detoksifiye eden fosfat bazlı tampon · ürün kodu 0303 · ayda bir veya iki kez 5 g / 40–80 L; yüksek alkalinitede hedefe ulaşana kadar günlük kullanılabilir · tercihen değişim suyunda çözülür · KH yükseltmez; bitkili akvaryumda fosfatlı tampon yerine Acid Buffer ve Alkaline Buffer önerilir"],
    ["Neutral Regulator 1 kg","Tatlı suda düşük veya yüksek pH'ı 7,0'a ayarlayan, kalsiyum/magnezyumu çöktürerek suyu yumuşatan ve klor/kloramini giderip amonyağı detoksifiye eden fosfat bazlı tampon · ürün kodu 0307 · ayda bir veya iki kez 5 g / 40–80 L; yüksek alkalinitede hedefe ulaşana kadar günlük kullanılabilir · tercihen değişim suyunda çözülür · KH yükseltmez; bitkili akvaryumda fosfatlı tampon yerine Acid Buffer ve Alkaline Buffer önerilir"],
    ["Neutral Regulator 4 kg","Tatlı suda düşük veya yüksek pH'ı 7,0'a ayarlayan, kalsiyum/magnezyumu çöktürerek suyu yumuşatan ve klor/kloramini giderip amonyağı detoksifiye eden fosfat bazlı tampon · ürün kodu 0309 · ayda bir veya iki kez 5 g / 40–80 L; yüksek alkalinitede hedefe ulaşana kadar günlük kullanılabilir · tercihen değişim suyunda çözülür · KH yükseltmez; bitkili akvaryumda fosfatlı tampon yerine Acid Buffer ve Alkaline Buffer önerilir"],
  ],"2026-10-24"),
  ...products("Seachem","water_conditioner","https://www.seachem.com/liquid-neutral-regulator.php",[
    ["Liquid Neutral Regulator 250 ml","Tatlı suda düşük veya yüksek pH'ı 7,0'a ayarlayan, suyu yumuşatan ve klor/kloramini giderip amonyağı detoksifiye eden sıvı fosfat tamponu · ürün kodu 0826 · ayda bir veya iki kez 5 ml / 10 L; çok sert suda çift veya üçlü doz gerekebilir · sert suyla çalışırken geçici bulanıklık normal olabilir; pH ve KH ölçülmeden ani yüksek doz uygulanmamalıdır"],
    ["Liquid Neutral Regulator 500 ml","Tatlı suda düşük veya yüksek pH'ı 7,0'a ayarlayan, suyu yumuşatan ve klor/kloramini giderip amonyağı detoksifiye eden sıvı fosfat tamponu · ürün kodu 0823 · ayda bir veya iki kez 5 ml / 10 L; çok sert suda çift veya üçlü doz gerekebilir · sert suyla çalışırken geçici bulanıklık normal olabilir; pH ve KH ölçülmeden ani yüksek doz uygulanmamalıdır"],
    ["Liquid Neutral Regulator 2 L","Tatlı suda düşük veya yüksek pH'ı 7,0'a ayarlayan, suyu yumuşatan ve klor/kloramini giderip amonyağı detoksifiye eden sıvı fosfat tamponu · resmî sayfa 2 L boyutu listeler ancak ürün kodu yayımlamaz · ayda bir veya iki kez 5 ml / 10 L; çok sert suda çift veya üçlü doz gerekebilir · sert suyla çalışırken geçici bulanıklık normal olabilir; pH ve KH ölçülmeden ani yüksek doz uygulanmamalıdır"],
    ["Liquid Neutral Regulator 4 L","Tatlı suda düşük veya yüksek pH'ı 7,0'a ayarlayan, suyu yumuşatan ve klor/kloramini giderip amonyağı detoksifiye eden sıvı fosfat tamponu · resmî sayfa 4 L boyutu listeler ancak ürün kodu yayımlamaz · ayda bir veya iki kez 5 ml / 10 L; çok sert suda çift veya üçlü doz gerekebilir · sert suyla çalışırken geçici bulanıklık normal olabilir; pH ve KH ölçülmeden ani yüksek doz uygulanmamalıdır"],
  ],"2026-10-24"),
  ...products("Seachem","bacteria","https://www.seachem.com/stability.php",[
    ["Stability 50 ml","Tatlı ve deniz suyunda biyofiltreyi başlatan bakteri karışımı · ürün kodu 0124 · iyice çalkalayın, UV/ozonu kapatın; ilk gün 5 ml / 40 L, ardından yedi gün boyunca günlük 5 ml / 80 L; doz sürdürülürse canlı eklenebilir"],
    ["Stability 100 ml","Tatlı ve deniz suyunda biyofiltreyi başlatan bakteri karışımı · ürün kodu 0125 · iyice çalkalayın, UV/ozonu kapatın; ilk gün 5 ml / 40 L, ardından yedi gün boyunca günlük 5 ml / 80 L; doz sürdürülürse canlı eklenebilir"],
    ["Stability 250 ml","Tatlı ve deniz suyunda biyofiltreyi başlatan bakteri karışımı · ürün kodu 0126 · iyice çalkalayın, UV/ozonu kapatın; ilk gün 5 ml / 40 L, ardından yedi gün boyunca günlük 5 ml / 80 L; doz sürdürülürse canlı eklenebilir"],
    ["Stability 500 ml","Tatlı ve deniz suyunda biyofiltreyi başlatan bakteri karışımı · ürün kodu 0123 · iyice çalkalayın, UV/ozonu kapatın; ilk gün 5 ml / 40 L, ardından yedi gün boyunca günlük 5 ml / 80 L; doz sürdürülürse canlı eklenebilir"],
    ["Stability 1 L","Tatlı ve deniz suyunda biyofiltreyi başlatan bakteri karışımı · ürün kodu 0122 · iyice çalkalayın, UV/ozonu kapatın; ilk gün 5 ml / 40 L, ardından yedi gün boyunca günlük 5 ml / 80 L; doz sürdürülürse canlı eklenebilir"],
    ["Stability 2 L","Tatlı ve deniz suyunda biyofiltreyi başlatan bakteri karışımı · ürün kodu 0128 · iyice çalkalayın, UV/ozonu kapatın; ilk gün 5 ml / 40 L, ardından yedi gün boyunca günlük 5 ml / 80 L; doz sürdürülürse canlı eklenebilir"],
    ["Stability 4 L","Tatlı ve deniz suyunda biyofiltreyi başlatan bakteri karışımı · ürün kodu 0129 · iyice çalkalayın, UV/ozonu kapatın; ilk gün 5 ml / 40 L, ardından yedi gün boyunca günlük 5 ml / 80 L; doz sürdürülürse canlı eklenebilir"],
  ],"2026-10-24"),
  ...products("Seachem","fertilizer","https://www.seachem.com/flourish.php",[
    ["Flourish 50 ml","Bitkili tatlı su akvaryumları için kalsiyum, magnezyum, demir ve mikro/iz element sağlayan kapsamlı destek · ürün kodu 0514 · haftada bir veya iki kez 5 ml / 250 L; kapak dişi yaklaşık 1 ml'dir · anlamlı N/P makro gübre içermez, gereksinim ölçülerek ayrı NPK ürünleri kullanılır · Flourish Trace ile dönüşümlü günlerde uygulanır ve açıldıktan üç ay sonra soğutma önerilir · eser bakır içerir; talimata uygun doz omurgasızlarla uyumludur, 1,5-pentanedial alerjik reaksiyon oluşturabilir ve çocuklardan uzak tutulmalıdır"],
    ["Flourish 100 ml","Bitkili tatlı su akvaryumları için kalsiyum, magnezyum, demir ve mikro/iz element sağlayan kapsamlı destek · ürün kodu 0515 · haftada bir veya iki kez 5 ml / 250 L; kapak dişi yaklaşık 1 ml'dir · anlamlı N/P makro gübre içermez, gereksinim ölçülerek ayrı NPK ürünleri kullanılır · Flourish Trace ile dönüşümlü günlerde uygulanır ve açıldıktan üç ay sonra soğutma önerilir · eser bakır içerir; talimata uygun doz omurgasızlarla uyumludur, 1,5-pentanedial alerjik reaksiyon oluşturabilir ve çocuklardan uzak tutulmalıdır"],
    ["Flourish 250 ml","Bitkili tatlı su akvaryumları için kalsiyum, magnezyum, demir ve mikro/iz element sağlayan kapsamlı destek · ürün kodu 0516 · haftada bir veya iki kez 5 ml / 250 L; kapak dişi yaklaşık 1 ml'dir · anlamlı N/P makro gübre içermez, gereksinim ölçülerek ayrı NPK ürünleri kullanılır · Flourish Trace ile dönüşümlü günlerde uygulanır ve açıldıktan üç ay sonra soğutma önerilir · eser bakır içerir; talimata uygun doz omurgasızlarla uyumludur, 1,5-pentanedial alerjik reaksiyon oluşturabilir ve çocuklardan uzak tutulmalıdır"],
    ["Flourish 500 ml","Bitkili tatlı su akvaryumları için kalsiyum, magnezyum, demir ve mikro/iz element sağlayan kapsamlı destek · ürün kodu 0513 · haftada bir veya iki kez 5 ml / 250 L; kapak dişi yaklaşık 1 ml'dir · anlamlı N/P makro gübre içermez, gereksinim ölçülerek ayrı NPK ürünleri kullanılır · Flourish Trace ile dönüşümlü günlerde uygulanır ve açıldıktan üç ay sonra soğutma önerilir · eser bakır içerir; talimata uygun doz omurgasızlarla uyumludur, 1,5-pentanedial alerjik reaksiyon oluşturabilir ve çocuklardan uzak tutulmalıdır"],
    ["Flourish 2 L","Bitkili tatlı su akvaryumları için kalsiyum, magnezyum, demir ve mikro/iz element sağlayan kapsamlı destek · ürün kodu 0518 · haftada bir veya iki kez 5 ml / 250 L; kapak dişi yaklaşık 1 ml'dir · anlamlı N/P makro gübre içermez, gereksinim ölçülerek ayrı NPK ürünleri kullanılır · Flourish Trace ile dönüşümlü günlerde uygulanır ve açıldıktan üç ay sonra soğutma önerilir · eser bakır içerir; talimata uygun doz omurgasızlarla uyumludur, 1,5-pentanedial alerjik reaksiyon oluşturabilir ve çocuklardan uzak tutulmalıdır"],
    ["Flourish 4 L","Bitkili tatlı su akvaryumları için kalsiyum, magnezyum, demir ve mikro/iz element sağlayan kapsamlı destek · ürün kodu 0519 · haftada bir veya iki kez 5 ml / 250 L; kapak dişi yaklaşık 1 ml'dir · anlamlı N/P makro gübre içermez, gereksinim ölçülerek ayrı NPK ürünleri kullanılır · Flourish Trace ile dönüşümlü günlerde uygulanır ve açıldıktan üç ay sonra soğutma önerilir · eser bakır içerir; talimata uygun doz omurgasızlarla uyumludur, 1,5-pentanedial alerjik reaksiyon oluşturabilir ve çocuklardan uzak tutulmalıdır"],
  ],"2026-10-24"),
  ...products("Seachem","fertilizer","https://www.seachem.com/flourish-excel.php",[
    ["Flourish Excel 50 ml","Bitkili akvaryum için biyoyararlanılabilir organik karbon kaynağı · ürün kodu 0454 · ilk kullanımda veya %40'tan büyük su değişiminden sonra 5 ml / 40 L; ardından günlük ya da gün aşırı 5 ml / 200 L · CO₂ gazı değildir ve talimata uygun kullanımda pH'ı etkilemez · yosun ilacı veya noktasal tedavi değildir; aşırı/doğrudan uygulama hassas bitkilere zarar verebilir, Anacharis için gün aşırı kullanım önerilir · yenmez, içilmez; göz temasında bol suyla yıkanmalı ve tıbbi yardım alınmalıdır"],
    ["Flourish Excel 100 ml","Bitkili akvaryum için biyoyararlanılabilir organik karbon kaynağı · ürün kodu 0455 · ilk kullanımda veya %40'tan büyük su değişiminden sonra 5 ml / 40 L; ardından günlük ya da gün aşırı 5 ml / 200 L · CO₂ gazı değildir ve talimata uygun kullanımda pH'ı etkilemez · yosun ilacı veya noktasal tedavi değildir; aşırı/doğrudan uygulama hassas bitkilere zarar verebilir, Anacharis için gün aşırı kullanım önerilir · yenmez, içilmez; göz temasında bol suyla yıkanmalı ve tıbbi yardım alınmalıdır"],
    ["Flourish Excel 250 ml","Bitkili akvaryum için biyoyararlanılabilir organik karbon kaynağı · ürün kodu 0456 · ilk kullanımda veya %40'tan büyük su değişiminden sonra 5 ml / 40 L; ardından günlük ya da gün aşırı 5 ml / 200 L · CO₂ gazı değildir ve talimata uygun kullanımda pH'ı etkilemez · yosun ilacı veya noktasal tedavi değildir; aşırı/doğrudan uygulama hassas bitkilere zarar verebilir, Anacharis için gün aşırı kullanım önerilir · yenmez, içilmez; göz temasında bol suyla yıkanmalı ve tıbbi yardım alınmalıdır"],
    ["Flourish Excel 500 ml","Bitkili akvaryum için biyoyararlanılabilir organik karbon kaynağı · ürün kodu 0453 · ilk kullanımda veya %40'tan büyük su değişiminden sonra 5 ml / 40 L; ardından günlük ya da gün aşırı 5 ml / 200 L · CO₂ gazı değildir ve talimata uygun kullanımda pH'ı etkilemez · yosun ilacı veya noktasal tedavi değildir; aşırı/doğrudan uygulama hassas bitkilere zarar verebilir, Anacharis için gün aşırı kullanım önerilir · yenmez, içilmez; göz temasında bol suyla yıkanmalı ve tıbbi yardım alınmalıdır"],
    ["Flourish Excel 2 L","Bitkili akvaryum için biyoyararlanılabilir organik karbon kaynağı · ürün kodu 0458 · ilk kullanımda veya %40'tan büyük su değişiminden sonra 5 ml / 40 L; ardından günlük ya da gün aşırı 5 ml / 200 L · CO₂ gazı değildir ve talimata uygun kullanımda pH'ı etkilemez · yosun ilacı veya noktasal tedavi değildir; aşırı/doğrudan uygulama hassas bitkilere zarar verebilir, Anacharis için gün aşırı kullanım önerilir · yenmez, içilmez; göz temasında bol suyla yıkanmalı ve tıbbi yardım alınmalıdır"],
    ["Flourish Excel 4 L","Bitkili akvaryum için biyoyararlanılabilir organik karbon kaynağı · ürün kodu 0459 · ilk kullanımda veya %40'tan büyük su değişiminden sonra 5 ml / 40 L; ardından günlük ya da gün aşırı 5 ml / 200 L · CO₂ gazı değildir ve talimata uygun kullanımda pH'ı etkilemez · yosun ilacı veya noktasal tedavi değildir; aşırı/doğrudan uygulama hassas bitkilere zarar verebilir, Anacharis için gün aşırı kullanım önerilir · yenmez, içilmez; göz temasında bol suyla yıkanmalı ve tıbbi yardım alınmalıdır"],
  ],"2026-10-24"),
  ...products("Seachem","fertilizer","https://www.seachem.com/flourish-nitrogen.php",[
    ["Flourish Nitrogen 100 ml","Bitkili akvaryum için 15.000 mg/L azot içeren nitrat ve kompleks amonyum/üre kaynağı · ürün kodu 0625 · başlangıç dozu haftada iki kez 2,5 ml / 160 L; yaklaşık 1 mg/L nitrat eşdeğeri azot artışı sağlar · serbest amonyak salmaz ancak gereksinim ve ölçüm olmadan eklenmemeli; aşırı azot yosuna açık besin bırakabilir · hedefli doz üreticinin formülüyle hesaplanmalı ve nitrat eşdeğeri değerlerde sonuç beşe bölünmelidir"],
    ["Flourish Nitrogen 250 ml","Bitkili akvaryum için 15.000 mg/L azot içeren nitrat ve kompleks amonyum/üre kaynağı · ürün kodu 0626 · başlangıç dozu haftada iki kez 2,5 ml / 160 L; yaklaşık 1 mg/L nitrat eşdeğeri azot artışı sağlar · serbest amonyak salmaz ancak gereksinim ve ölçüm olmadan eklenmemeli; aşırı azot yosuna açık besin bırakabilir · hedefli doz üreticinin formülüyle hesaplanmalı ve nitrat eşdeğeri değerlerde sonuç beşe bölünmelidir"],
    ["Flourish Nitrogen 500 ml","Bitkili akvaryum için 15.000 mg/L azot içeren nitrat ve kompleks amonyum/üre kaynağı · ürün kodu 0623 · başlangıç dozu haftada iki kez 2,5 ml / 160 L; yaklaşık 1 mg/L nitrat eşdeğeri azot artışı sağlar · serbest amonyak salmaz ancak gereksinim ve ölçüm olmadan eklenmemeli; aşırı azot yosuna açık besin bırakabilir · hedefli doz üreticinin formülüyle hesaplanmalı ve nitrat eşdeğeri değerlerde sonuç beşe bölünmelidir"],
    ["Flourish Nitrogen 2 L","Bitkili akvaryum için 15.000 mg/L azot içeren nitrat ve kompleks amonyum/üre kaynağı · ürün kodu 0628 · başlangıç dozu haftada iki kez 2,5 ml / 160 L; yaklaşık 1 mg/L nitrat eşdeğeri azot artışı sağlar · serbest amonyak salmaz ancak gereksinim ve ölçüm olmadan eklenmemeli; aşırı azot yosuna açık besin bırakabilir · hedefli doz üreticinin formülüyle hesaplanmalı ve nitrat eşdeğeri değerlerde sonuç beşe bölünmelidir"],
    ["Flourish Nitrogen 4 L","Bitkili akvaryum için 15.000 mg/L azot içeren nitrat ve kompleks amonyum/üre kaynağı · ürün kodu 0629 · başlangıç dozu haftada iki kez 2,5 ml / 160 L; yaklaşık 1 mg/L nitrat eşdeğeri azot artışı sağlar · serbest amonyak salmaz ancak gereksinim ve ölçüm olmadan eklenmemeli; aşırı azot yosuna açık besin bırakabilir · hedefli doz üreticinin formülüyle hesaplanmalı ve nitrat eşdeğeri değerlerde sonuç beşe bölünmelidir"],
  ],"2026-10-24"),
  ...products("Seachem","fertilizer","https://www.seachem.com/flourish-phosphorus.php",[
    ["Flourish Phosphorus 100 ml","Bitkili akvaryum için nitrat içermeyen 4.500 mg/L potasyum fosfat çözeltisi · ürün kodu 0195 · haftada bir veya iki kez 2,5 ml / 80 L; fosforu 0,05 mg/L ve fosfatı yaklaşık 0,15 mg/L artırır · genel fosfat aralığı 0,15–1,0 mg/L olarak yayımlanır ancak tank gereksinimi ölçülmeli; aşırı fosfor yosuna açık besin bırakabilir · hedefli doz üreticinin 0,8 × galon × istenen fosfat artışı formülüyle hesaplanır"],
    ["Flourish Phosphorus 250 ml","Bitkili akvaryum için nitrat içermeyen 4.500 mg/L potasyum fosfat çözeltisi · ürün kodu 0196 · haftada bir veya iki kez 2,5 ml / 80 L; fosforu 0,05 mg/L ve fosfatı yaklaşık 0,15 mg/L artırır · genel fosfat aralığı 0,15–1,0 mg/L olarak yayımlanır ancak tank gereksinimi ölçülmeli; aşırı fosfor yosuna açık besin bırakabilir · hedefli doz üreticinin 0,8 × galon × istenen fosfat artışı formülüyle hesaplanır"],
    ["Flourish Phosphorus 500 ml","Bitkili akvaryum için nitrat içermeyen 4.500 mg/L potasyum fosfat çözeltisi · ürün kodu 0193 · haftada bir veya iki kez 2,5 ml / 80 L; fosforu 0,05 mg/L ve fosfatı yaklaşık 0,15 mg/L artırır · genel fosfat aralığı 0,15–1,0 mg/L olarak yayımlanır ancak tank gereksinimi ölçülmeli; aşırı fosfor yosuna açık besin bırakabilir · hedefli doz üreticinin 0,8 × galon × istenen fosfat artışı formülüyle hesaplanır"],
    ["Flourish Phosphorus 2 L","Bitkili akvaryum için nitrat içermeyen 4.500 mg/L potasyum fosfat çözeltisi · ürün kodu 0198 · haftada bir veya iki kez 2,5 ml / 80 L; fosforu 0,05 mg/L ve fosfatı yaklaşık 0,15 mg/L artırır · genel fosfat aralığı 0,15–1,0 mg/L olarak yayımlanır ancak tank gereksinimi ölçülmeli; aşırı fosfor yosuna açık besin bırakabilir · hedefli doz üreticinin 0,8 × galon × istenen fosfat artışı formülüyle hesaplanır"],
    ["Flourish Phosphorus 4 L","Bitkili akvaryum için nitrat içermeyen 4.500 mg/L potasyum fosfat çözeltisi · ürün kodu 0199 · haftada bir veya iki kez 2,5 ml / 80 L; fosforu 0,05 mg/L ve fosfatı yaklaşık 0,15 mg/L artırır · genel fosfat aralığı 0,15–1,0 mg/L olarak yayımlanır ancak tank gereksinimi ölçülmeli; aşırı fosfor yosuna açık besin bırakabilir · hedefli doz üreticinin 0,8 × galon × istenen fosfat artışı formülüyle hesaplanır"],
  ],"2026-10-24"),
  ...products("Seachem","fertilizer","https://www.seachem.com/flourish-potassium.php",[
    ["Flourish Potassium 50 ml","Bitkili akvaryum için nitrat ve fosfat içermeyen, potasyum sülfattan türetilmiş 41.500 mg/L potasyum desteği · ürün kodu 0464 · çalkalayıp haftada 2–3 kez veya gerektikçe 5 ml / 125 L; güncel kullanım talimatına göre potasyumu 1,66 mg/L artırır · eksiklik önce yaşlı yapraklarda sararma, kahverengileşme, iğne deliği ve zayıf kök/gövde olarak görülebilir · tatlı su karidesleriyle uyumludur; gereksinim ölçülmeden aşırı dozlanmamalıdır"],
    ["Flourish Potassium 100 ml","Bitkili akvaryum için nitrat ve fosfat içermeyen, potasyum sülfattan türetilmiş 41.500 mg/L potasyum desteği · ürün kodu 0465 · çalkalayıp haftada 2–3 kez veya gerektikçe 5 ml / 125 L; güncel kullanım talimatına göre potasyumu 1,66 mg/L artırır · eksiklik önce yaşlı yapraklarda sararma, kahverengileşme, iğne deliği ve zayıf kök/gövde olarak görülebilir · tatlı su karidesleriyle uyumludur; gereksinim ölçülmeden aşırı dozlanmamalıdır"],
    ["Flourish Potassium 250 ml","Bitkili akvaryum için nitrat ve fosfat içermeyen, potasyum sülfattan türetilmiş 41.500 mg/L potasyum desteği · ürün kodu 0466 · çalkalayıp haftada 2–3 kez veya gerektikçe 5 ml / 125 L; güncel kullanım talimatına göre potasyumu 1,66 mg/L artırır · eksiklik önce yaşlı yapraklarda sararma, kahverengileşme, iğne deliği ve zayıf kök/gövde olarak görülebilir · tatlı su karidesleriyle uyumludur; gereksinim ölçülmeden aşırı dozlanmamalıdır"],
    ["Flourish Potassium 500 ml","Bitkili akvaryum için nitrat ve fosfat içermeyen, potasyum sülfattan türetilmiş 41.500 mg/L potasyum desteği · ürün kodu 0463 · çalkalayıp haftada 2–3 kez veya gerektikçe 5 ml / 125 L; güncel kullanım talimatına göre potasyumu 1,66 mg/L artırır · eksiklik önce yaşlı yapraklarda sararma, kahverengileşme, iğne deliği ve zayıf kök/gövde olarak görülebilir · tatlı su karidesleriyle uyumludur; gereksinim ölçülmeden aşırı dozlanmamalıdır"],
    ["Flourish Potassium 2 L","Bitkili akvaryum için nitrat ve fosfat içermeyen, potasyum sülfattan türetilmiş 41.500 mg/L potasyum desteği · ürün kodu 0468 · çalkalayıp haftada 2–3 kez veya gerektikçe 5 ml / 125 L; güncel kullanım talimatına göre potasyumu 1,66 mg/L artırır · eksiklik önce yaşlı yapraklarda sararma, kahverengileşme, iğne deliği ve zayıf kök/gövde olarak görülebilir · tatlı su karidesleriyle uyumludur; gereksinim ölçülmeden aşırı dozlanmamalıdır"],
    ["Flourish Potassium 4 L","Bitkili akvaryum için nitrat ve fosfat içermeyen, potasyum sülfattan türetilmiş 41.500 mg/L potasyum desteği · ürün kodu 0469 · çalkalayıp haftada 2–3 kez veya gerektikçe 5 ml / 125 L; güncel kullanım talimatına göre potasyumu 1,66 mg/L artırır · eksiklik önce yaşlı yapraklarda sararma, kahverengileşme, iğne deliği ve zayıf kök/gövde olarak görülebilir · tatlı su karidesleriyle uyumludur; gereksinim ölçülmeden aşırı dozlanmamalıdır"],
  ],"2026-10-24"),
  ...products("Seachem","fertilizer","https://www.seachem.com/flourish-iron.php",[
    ["Flourish Iron 50 ml","Bitkili akvaryum için 10.000 mg/L ferrous gluconate demir desteği · ürün kodu 0474 · 5 ml / 200 L veya yaklaşık 0,10 mg/L demiri koruyacak kadar; standart doz demiri 0,25 mg/L artırır · hızlı tüketim nedeniyle dozdan sonraki 30 dakika içinde test edilir · eksiklik önce genç yapraklarda damar arası sararma ve kısa-ince gövde olarak görülür; gereksinime göre düzenli/günlük demir kullanımı, Flourish'in günlük dozlanması anlamına gelmez"],
    ["Flourish Iron 100 ml","Bitkili akvaryum için 10.000 mg/L ferrous gluconate demir desteği · ürün kodu 0475 · 5 ml / 200 L veya yaklaşık 0,10 mg/L demiri koruyacak kadar; standart doz demiri 0,25 mg/L artırır · hızlı tüketim nedeniyle dozdan sonraki 30 dakika içinde test edilir · eksiklik önce genç yapraklarda damar arası sararma ve kısa-ince gövde olarak görülür; gereksinime göre düzenli/günlük demir kullanımı, Flourish'in günlük dozlanması anlamına gelmez"],
    ["Flourish Iron 250 ml","Bitkili akvaryum için 10.000 mg/L ferrous gluconate demir desteği · ürün kodu 0476 · 5 ml / 200 L veya yaklaşık 0,10 mg/L demiri koruyacak kadar; standart doz demiri 0,25 mg/L artırır · hızlı tüketim nedeniyle dozdan sonraki 30 dakika içinde test edilir · eksiklik önce genç yapraklarda damar arası sararma ve kısa-ince gövde olarak görülür; gereksinime göre düzenli/günlük demir kullanımı, Flourish'in günlük dozlanması anlamına gelmez"],
    ["Flourish Iron 500 ml","Bitkili akvaryum için 10.000 mg/L ferrous gluconate demir desteği · ürün kodu 0473 · 5 ml / 200 L veya yaklaşık 0,10 mg/L demiri koruyacak kadar; standart doz demiri 0,25 mg/L artırır · hızlı tüketim nedeniyle dozdan sonraki 30 dakika içinde test edilir · eksiklik önce genç yapraklarda damar arası sararma ve kısa-ince gövde olarak görülür; gereksinime göre düzenli/günlük demir kullanımı, Flourish'in günlük dozlanması anlamına gelmez"],
    ["Flourish Iron 2 L","Bitkili akvaryum için 10.000 mg/L ferrous gluconate demir desteği · ürün kodu 0478 · 5 ml / 200 L veya yaklaşık 0,10 mg/L demiri koruyacak kadar; standart doz demiri 0,25 mg/L artırır · hızlı tüketim nedeniyle dozdan sonraki 30 dakika içinde test edilir · eksiklik önce genç yapraklarda damar arası sararma ve kısa-ince gövde olarak görülür; gereksinime göre düzenli/günlük demir kullanımı, Flourish'in günlük dozlanması anlamına gelmez"],
    ["Flourish Iron 4 L","Bitkili akvaryum için 10.000 mg/L ferrous gluconate demir desteği · ürün kodu 0479 · 5 ml / 200 L veya yaklaşık 0,10 mg/L demiri koruyacak kadar; standart doz demiri 0,25 mg/L artırır · hızlı tüketim nedeniyle dozdan sonraki 30 dakika içinde test edilir · eksiklik önce genç yapraklarda damar arası sararma ve kısa-ince gövde olarak görülür; gereksinime göre düzenli/günlük demir kullanımı, Flourish'in günlük dozlanması anlamına gelmez"],
  ],"2026-10-24"),
  ...products("Seachem","fertilizer","https://www.seachem.com/flourish-trace.php",[
    ["Flourish Trace 50 ml","Bitkili akvaryum için bor, kobalt, bakır, mangan, molibden, çinko, rubidyum, nikel ve vanadyum içeren iz element desteği · ürün kodu 0744 · haftada iki kez 5 ml / 80 L; Flourish ile birlikte kullanıldığında dönüşümlü günlerde uygulanır · önerilen doz GH'ı anlamlı biçimde yükseltmez ve tatlı su karidesleriyle uyumludur · günlük kullanım yalnız yoğun bitki büyümesinde gerekebilir; seyrek bitkili tankta gereksizdir"],
    ["Flourish Trace 100 ml","Bitkili akvaryum için bor, kobalt, bakır, mangan, molibden, çinko, rubidyum, nikel ve vanadyum içeren iz element desteği · ürün kodu 0745 · haftada iki kez 5 ml / 80 L; Flourish ile birlikte kullanıldığında dönüşümlü günlerde uygulanır · önerilen doz GH'ı anlamlı biçimde yükseltmez ve tatlı su karidesleriyle uyumludur · günlük kullanım yalnız yoğun bitki büyümesinde gerekebilir; seyrek bitkili tankta gereksizdir"],
    ["Flourish Trace 250 ml","Bitkili akvaryum için bor, kobalt, bakır, mangan, molibden, çinko, rubidyum, nikel ve vanadyum içeren iz element desteği · ürün kodu 0746 · haftada iki kez 5 ml / 80 L; Flourish ile birlikte kullanıldığında dönüşümlü günlerde uygulanır · önerilen doz GH'ı anlamlı biçimde yükseltmez ve tatlı su karidesleriyle uyumludur · günlük kullanım yalnız yoğun bitki büyümesinde gerekebilir; seyrek bitkili tankta gereksizdir"],
    ["Flourish Trace 500 ml","Bitkili akvaryum için bor, kobalt, bakır, mangan, molibden, çinko, rubidyum, nikel ve vanadyum içeren iz element desteği · ürün kodu 0743 · haftada iki kez 5 ml / 80 L; Flourish ile birlikte kullanıldığında dönüşümlü günlerde uygulanır · önerilen doz GH'ı anlamlı biçimde yükseltmez ve tatlı su karidesleriyle uyumludur · günlük kullanım yalnız yoğun bitki büyümesinde gerekebilir; seyrek bitkili tankta gereksizdir"],
    ["Flourish Trace 2 L","Bitkili akvaryum için bor, kobalt, bakır, mangan, molibden, çinko, rubidyum, nikel ve vanadyum içeren iz element desteği · ürün kodu 0748 · haftada iki kez 5 ml / 80 L; Flourish ile birlikte kullanıldığında dönüşümlü günlerde uygulanır · önerilen doz GH'ı anlamlı biçimde yükseltmez ve tatlı su karidesleriyle uyumludur · günlük kullanım yalnız yoğun bitki büyümesinde gerekebilir; seyrek bitkili tankta gereksizdir"],
    ["Flourish Trace 4 L","Bitkili akvaryum için bor, kobalt, bakır, mangan, molibden, çinko, rubidyum, nikel ve vanadyum içeren iz element desteği · ürün kodu 0749 · haftada iki kez 5 ml / 80 L; Flourish ile birlikte kullanıldığında dönüşümlü günlerde uygulanır · önerilen doz GH'ı anlamlı biçimde yükseltmez ve tatlı su karidesleriyle uyumludur · günlük kullanım yalnız yoğun bitki büyümesinde gerekebilir; seyrek bitkili tankta gereksizdir"],
  ],"2026-10-24"),
  ...products("Seachem","fertilizer","https://www.seachem.com/flourish-tabs.php",[
    ["Flourish Tabs 10 tablet","Bitki kök bölgesine mikro/iz element, amino asit ve vitaminleri zamanla bırakan taban tableti · ürün kodu 0505 · 10–15 cm yarıçap başına bir tablet, 10 galonluk standart tankta altı tablet; çakıl yatağının ortasına kadar gömülür ve 3–4 ayda bir yenilenir · nitrat veya fosfat içermez fakat %0,4 toplam azot taşır · pH'ı değiştirmez; çok yumuşak/tamponsuz suda hafif asidik olabilir"],
    ["Flourish Tabs 40 tablet","Bitki kök bölgesine mikro/iz element, amino asit ve vitaminleri zamanla bırakan taban tableti · ürün kodu 0507 · 10–15 cm yarıçap başına bir tablet, 10 galonluk standart tankta altı tablet; çakıl yatağının ortasına kadar gömülür ve 3–4 ayda bir yenilenir · nitrat veya fosfat içermez fakat %0,4 toplam azot taşır · pH'ı değiştirmez; çok yumuşak/tamponsuz suda hafif asidik olabilir"],
  ],"2026-10-24"),
  ...products("Seachem","fertilizer","https://www.seachem.com/flourish-advance.php",[
    ["Flourish Advance 50 ml","Bitkili akvaryum için fitohormon, mineral ve besin içeren doğal biyolojik büyüme desteği · ürün kodu 1234 · çalkalayıp günlük veya gerektiğinde 5 ml / 80 L · ilk 10–14 günde öncelikle kök gelişimini, ardından yaprak ve gövde büyümesini destekler · talimata uygun kullanımda balıklar, karidesler ve diğer sucul canlılarla uyumludur; üreticinin mineral emilimi ve hastalık direnci iddiası bitki hastalığı tedavisi anlamına gelmez"],
    ["Flourish Advance 100 ml","Bitkili akvaryum için fitohormon, mineral ve besin içeren doğal biyolojik büyüme desteği · ürün kodu 1235 · çalkalayıp günlük veya gerektiğinde 5 ml / 80 L · ilk 10–14 günde öncelikle kök gelişimini, ardından yaprak ve gövde büyümesini destekler · talimata uygun kullanımda balıklar, karidesler ve diğer sucul canlılarla uyumludur; üreticinin mineral emilimi ve hastalık direnci iddiası bitki hastalığı tedavisi anlamına gelmez"],
    ["Flourish Advance 250 ml","Bitkili akvaryum için fitohormon, mineral ve besin içeren doğal biyolojik büyüme desteği · ürün kodu 1236 · çalkalayıp günlük veya gerektiğinde 5 ml / 80 L · ilk 10–14 günde öncelikle kök gelişimini, ardından yaprak ve gövde büyümesini destekler · talimata uygun kullanımda balıklar, karidesler ve diğer sucul canlılarla uyumludur; üreticinin mineral emilimi ve hastalık direnci iddiası bitki hastalığı tedavisi anlamına gelmez"],
    ["Flourish Advance 500 ml","Bitkili akvaryum için fitohormon, mineral ve besin içeren doğal biyolojik büyüme desteği · ürün kodu 1233 · çalkalayıp günlük veya gerektiğinde 5 ml / 80 L · ilk 10–14 günde öncelikle kök gelişimini, ardından yaprak ve gövde büyümesini destekler · talimata uygun kullanımda balıklar, karidesler ve diğer sucul canlılarla uyumludur; üreticinin mineral emilimi ve hastalık direnci iddiası bitki hastalığı tedavisi anlamına gelmez"],
    ["Flourish Advance 2 L","Bitkili akvaryum için fitohormon, mineral ve besin içeren doğal biyolojik büyüme desteği · ürün kodu 1238 · çalkalayıp günlük veya gerektiğinde 5 ml / 80 L · ilk 10–14 günde öncelikle kök gelişimini, ardından yaprak ve gövde büyümesini destekler · talimata uygun kullanımda balıklar, karidesler ve diğer sucul canlılarla uyumludur; üreticinin mineral emilimi ve hastalık direnci iddiası bitki hastalığı tedavisi anlamına gelmez"],
    ["Flourish Advance 4 L","Bitkili akvaryum için fitohormon, mineral ve besin içeren doğal biyolojik büyüme desteği · ürün kodu 1239 · çalkalayıp günlük veya gerektiğinde 5 ml / 80 L · ilk 10–14 günde öncelikle kök gelişimini, ardından yaprak ve gövde büyümesini destekler · talimata uygun kullanımda balıklar, karidesler ve diğer sucul canlılarla uyumludur; üreticinin mineral emilimi ve hastalık direnci iddiası bitki hastalığı tedavisi anlamına gelmez"],
  ],"2026-10-24"),
  ...products("Seachem","fertilizer","https://www.seachem.com/plant-pack-fundamentals.php",[
    ["Plant Pack Fundamentals 3 × 100 ml","Yeni başlayan bitkili akvaryumlar için üçlü paket · ürün kodu 1105 · 100 ml Flourish, 100 ml Flourish Iron ve 100 ml Flourish Excel içerir; geniş spektrumlu mikro/iz desteği, demir ve organik karbon ayrı şişelerdir · tek bir karışım veya ortak doz değildir; her ürün kendi resmî talimatına göre bağımsız uygulanır ve Flourish Excel CO₂ gazı değildir"],
  ],"2026-10-24"),
  ...products("Seachem","fertilizer","https://www.seachem.com/plant-pack-enhancer.php",[
    ["Plant Pack Enhancer NPK 3 × 100 ml","Bitkili akvaryumda makro besinleri ayrı ayrı hedeflemek için üçlü paket · ürün kodu 1115 · 100 ml Flourish Nitrogen, 100 ml Flourish Phosphorus ve 100 ml Flourish Potassium içerir · tek bir NPK karışımı veya ortak doz değildir; azot, fosfor ve potasyum gereksinimi ölçülerek her şişe kendi resmî talimatına göre bağımsız uygulanır"],
  ],"2026-10-24"),
  ...products("Seachem","filter_media","https://www.seachem.com/matrix.php",[
    ["Matrix 250 ml","Yüksek gözenekli, inert biyolojik filtre medyası · ürün kodu 0116 · 250 ml / 200 L; amonyak, nitrit ve nitratı işleyen aerobik ve anaerobik bakteriler için yüzey sağlar · mekanik ve kimyasal medyadan sonra yerleştirilir, akvaryum suyuyla durulanabilir ve parçalanmadığı için yenilenmesi gerekmez"],
    ["Matrix 500 ml","Yüksek gözenekli, inert biyolojik filtre medyası · ürün kodu 0113 · 250 ml / 200 L; amonyak, nitrit ve nitratı işleyen aerobik ve anaerobik bakteriler için yüzey sağlar · mekanik ve kimyasal medyadan sonra yerleştirilir, akvaryum suyuyla durulanabilir ve parçalanmadığı için yenilenmesi gerekmez"],
    ["Matrix 1 L","Yüksek gözenekli, inert biyolojik filtre medyası · ürün kodu 0117 · 250 ml / 200 L; amonyak, nitrit ve nitratı işleyen aerobik ve anaerobik bakteriler için yüzey sağlar · mekanik ve kimyasal medyadan sonra yerleştirilir, akvaryum suyuyla durulanabilir ve parçalanmadığı için yenilenmesi gerekmez"],
    ["Matrix 2 L","Yüksek gözenekli, inert biyolojik filtre medyası · ürün kodu 0118 · 250 ml / 200 L; amonyak, nitrit ve nitratı işleyen aerobik ve anaerobik bakteriler için yüzey sağlar · mekanik ve kimyasal medyadan sonra yerleştirilir, akvaryum suyuyla durulanabilir ve parçalanmadığı için yenilenmesi gerekmez"],
    ["Matrix 4 L","Yüksek gözenekli, inert biyolojik filtre medyası · ürün kodu 0119 · 250 ml / 200 L; amonyak, nitrit ve nitratı işleyen aerobik ve anaerobik bakteriler için yüzey sağlar · mekanik ve kimyasal medyadan sonra yerleştirilir, akvaryum suyuyla durulanabilir ve parçalanmadığı için yenilenmesi gerekmez"],
  ],"2026-10-24"),
  ...products("Seachem","filter_media","https://www.seachem.com/purigen.php",[
    ["Purigen 100 ml","Azotlu organik atıkları uzaklaştıran sentetik adsorban · ürün kodu 0165 · 250 ml / 1.000 L ve yaklaşık altı aya kadar kullanım; en fazla 180 mikron gözenekli ince torbada yüksek akışa yerleştirilir · koyu kahverengi/siyah olduğunda yenilenir veya üretici talimatıyla rejenere edilir; yalnız kokusuz-boyasız normal çamaşır suyu kullanılmalı, klor kokusu kalırsa tekrar kullanılmamalı ve amin bazlı slime-coat ürünlerinden sonra rejenerasyon güvenli olmayabilir · nitratı doğrudan gidermez"],
    ["Purigen 250 ml","Azotlu organik atıkları uzaklaştıran sentetik adsorban · ürün kodu 0166 · 250 ml / 1.000 L ve yaklaşık altı aya kadar kullanım; en fazla 180 mikron gözenekli ince torbada yüksek akışa yerleştirilir · koyu kahverengi/siyah olduğunda yenilenir veya üretici talimatıyla rejenere edilir; yalnız kokusuz-boyasız normal çamaşır suyu kullanılmalı, klor kokusu kalırsa tekrar kullanılmamalı ve amin bazlı slime-coat ürünlerinden sonra rejenerasyon güvenli olmayabilir · nitratı doğrudan gidermez"],
    ["Purigen 500 ml","Azotlu organik atıkları uzaklaştıran sentetik adsorban · ürün kodu 0163 · 250 ml / 1.000 L ve yaklaşık altı aya kadar kullanım; en fazla 180 mikron gözenekli ince torbada yüksek akışa yerleştirilir · koyu kahverengi/siyah olduğunda yenilenir veya üretici talimatıyla rejenere edilir; yalnız kokusuz-boyasız normal çamaşır suyu kullanılmalı, klor kokusu kalırsa tekrar kullanılmamalı ve amin bazlı slime-coat ürünlerinden sonra rejenerasyon güvenli olmayabilir · nitratı doğrudan gidermez"],
    ["Purigen 1 L","Azotlu organik atıkları uzaklaştıran sentetik adsorban · ürün kodu 0167 · 250 ml / 1.000 L ve yaklaşık altı aya kadar kullanım; en fazla 180 mikron gözenekli ince torbada yüksek akışa yerleştirilir · koyu kahverengi/siyah olduğunda yenilenir veya üretici talimatıyla rejenere edilir; yalnız kokusuz-boyasız normal çamaşır suyu kullanılmalı, klor kokusu kalırsa tekrar kullanılmamalı ve amin bazlı slime-coat ürünlerinden sonra rejenerasyon güvenli olmayabilir · nitratı doğrudan gidermez"],
    ["Purigen 2 L","Azotlu organik atıkları uzaklaştıran sentetik adsorban · ürün kodu 0168 · 250 ml / 1.000 L ve yaklaşık altı aya kadar kullanım; en fazla 180 mikron gözenekli ince torbada yüksek akışa yerleştirilir · koyu kahverengi/siyah olduğunda yenilenir veya üretici talimatıyla rejenere edilir; yalnız kokusuz-boyasız normal çamaşır suyu kullanılmalı, klor kokusu kalırsa tekrar kullanılmamalı ve amin bazlı slime-coat ürünlerinden sonra rejenerasyon güvenli olmayabilir · nitratı doğrudan gidermez"],
    ["Purigen 4 L","Azotlu organik atıkları uzaklaştıran sentetik adsorban · ürün kodu 0169 · 250 ml / 1.000 L ve yaklaşık altı aya kadar kullanım; en fazla 180 mikron gözenekli ince torbada yüksek akışa yerleştirilir · koyu kahverengi/siyah olduğunda yenilenir veya üretici talimatıyla rejenere edilir; yalnız kokusuz-boyasız normal çamaşır suyu kullanılmalı, klor kokusu kalırsa tekrar kullanılmamalı ve amin bazlı slime-coat ürünlerinden sonra rejenerasyon güvenli olmayabilir · nitratı doğrudan gidermez"],
  ],"2026-10-24"),
  ...products("Seachem","filter_media","https://www.seachem.com/denitrate.php",[
    ["de*nitrate 100 ml","Doğal gözenekli biyolojik nitrat kontrol medyası · ürün kodu 0135 · 500 ml / 100–200 L; hem aerobik hem anaerobik bakterilerin çalışması için akış 200 L/saat değerini aşmamalıdır · nitrat çok yüksekse önce su değişimiyle 20 mg/L altına indirilir; tükenmez ancak tıkanabileceği için ön filtreyle korunup durulanmalıdır"],
    ["de*nitrate 250 ml","Doğal gözenekli biyolojik nitrat kontrol medyası · ürün kodu 0136 · 500 ml / 100–200 L; hem aerobik hem anaerobik bakterilerin çalışması için akış 200 L/saat değerini aşmamalıdır · nitrat çok yüksekse önce su değişimiyle 20 mg/L altına indirilir; tükenmez ancak tıkanabileceği için ön filtreyle korunup durulanmalıdır"],
    ["de*nitrate 500 ml","Doğal gözenekli biyolojik nitrat kontrol medyası · ürün kodu 0133 · 500 ml / 100–200 L; hem aerobik hem anaerobik bakterilerin çalışması için akış 200 L/saat değerini aşmamalıdır · nitrat çok yüksekse önce su değişimiyle 20 mg/L altına indirilir; tükenmez ancak tıkanabileceği için ön filtreyle korunup durulanmalıdır"],
    ["de*nitrate 1 L","Doğal gözenekli biyolojik nitrat kontrol medyası · ürün kodu 0137 · 500 ml / 100–200 L; hem aerobik hem anaerobik bakterilerin çalışması için akış 200 L/saat değerini aşmamalıdır · nitrat çok yüksekse önce su değişimiyle 20 mg/L altına indirilir; tükenmez ancak tıkanabileceği için ön filtreyle korunup durulanmalıdır"],
    ["de*nitrate 2 L","Doğal gözenekli biyolojik nitrat kontrol medyası · ürün kodu 0138 · 500 ml / 100–200 L; hem aerobik hem anaerobik bakterilerin çalışması için akış 200 L/saat değerini aşmamalıdır · nitrat çok yüksekse önce su değişimiyle 20 mg/L altına indirilir; tükenmez ancak tıkanabileceği için ön filtreyle korunup durulanmalıdır"],
    ["de*nitrate 4 L","Doğal gözenekli biyolojik nitrat kontrol medyası · ürün kodu 0139 · 500 ml / 100–200 L; hem aerobik hem anaerobik bakterilerin çalışması için akış 200 L/saat değerini aşmamalıdır · nitrat çok yüksekse önce su değişimiyle 20 mg/L altına indirilir; tükenmez ancak tıkanabileceği için ön filtreyle korunup durulanmalıdır"],
  ],"2026-10-24"),
  ...products("Seachem","filter_media","https://www.seachem.com/renew.php",[
    ["Renew 100 ml","Fosfat salmayan, yumuşak etkili karbon alternatifi · ürün kodu 0085 · 250 ml / 120–160 L; organikleri ve mikron altı parçacıkları uzaklaştırmaya, amonyak/nitrat/fosfat kontrolüne yardımcı olur · bitkili ve yumuşak su kurulumlarında iz element, mineral ve besinleri belirgin biçimde etkilemeden yüksek akışta kullanılır"],
    ["Renew 250 ml","Fosfat salmayan, yumuşak etkili karbon alternatifi · ürün kodu 0086 · 250 ml / 120–160 L; organikleri ve mikron altı parçacıkları uzaklaştırmaya, amonyak/nitrat/fosfat kontrolüne yardımcı olur · bitkili ve yumuşak su kurulumlarında iz element, mineral ve besinleri belirgin biçimde etkilemeden yüksek akışta kullanılır"],
    ["Renew 500 ml","Fosfat salmayan, yumuşak etkili karbon alternatifi · ürün kodu 0083 · 250 ml / 120–160 L; organikleri ve mikron altı parçacıkları uzaklaştırmaya, amonyak/nitrat/fosfat kontrolüne yardımcı olur · bitkili ve yumuşak su kurulumlarında iz element, mineral ve besinleri belirgin biçimde etkilemeden yüksek akışta kullanılır"],
    ["Renew 1 L","Fosfat salmayan, yumuşak etkili karbon alternatifi · ürün kodu 0087 · 250 ml / 120–160 L; organikleri ve mikron altı parçacıkları uzaklaştırmaya, amonyak/nitrat/fosfat kontrolüne yardımcı olur · bitkili ve yumuşak su kurulumlarında iz element, mineral ve besinleri belirgin biçimde etkilemeden yüksek akışta kullanılır"],
    ["Renew 2 L","Fosfat salmayan, yumuşak etkili karbon alternatifi · ürün kodu 0088 · 250 ml / 120–160 L; organikleri ve mikron altı parçacıkları uzaklaştırmaya, amonyak/nitrat/fosfat kontrolüne yardımcı olur · bitkili ve yumuşak su kurulumlarında iz element, mineral ve besinleri belirgin biçimde etkilemeden yüksek akışta kullanılır"],
    ["Renew 4 L","Fosfat salmayan, yumuşak etkili karbon alternatifi · ürün kodu 0089 · 250 ml / 120–160 L; organikleri ve mikron altı parçacıkları uzaklaştırmaya, amonyak/nitrat/fosfat kontrolüne yardımcı olur · bitkili ve yumuşak su kurulumlarında iz element, mineral ve besinleri belirgin biçimde etkilemeden yüksek akışta kullanılır"],
  ],"2026-10-24"),
  ...products("Seachem","filter_media","https://www.seachem.com/zeolite.php",[
    ["Zeolite 100 ml","Amonyak ve ağır metalleri bağlayan doğal iyon değişim medyası · ürün kodu 1271 · 250 ml / 200 L; 0,5 mg/L'ye kadar amonyağı gidermek için yüksek akışta fakat savrulmadan kullanılır ve değer 24–48 saat izlenir · kalıcı azot döngüsünün, su testinin veya su değişiminin yerine geçmez; uzun süreli amonyak kontrolü için biyofiltre kurulmalıdır"],
    ["Zeolite 250 ml","Amonyak ve ağır metalleri bağlayan doğal iyon değişim medyası · ürün kodu 1272 · 250 ml / 200 L; 0,5 mg/L'ye kadar amonyağı gidermek için yüksek akışta fakat savrulmadan kullanılır ve değer 24–48 saat izlenir · kalıcı azot döngüsünün, su testinin veya su değişiminin yerine geçmez; uzun süreli amonyak kontrolü için biyofiltre kurulmalıdır"],
    ["Zeolite 500 ml","Amonyak ve ağır metalleri bağlayan doğal iyon değişim medyası · ürün kodu 1273 · 250 ml / 200 L; 0,5 mg/L'ye kadar amonyağı gidermek için yüksek akışta fakat savrulmadan kullanılır ve değer 24–48 saat izlenir · kalıcı azot döngüsünün, su testinin veya su değişiminin yerine geçmez; uzun süreli amonyak kontrolü için biyofiltre kurulmalıdır"],
    ["Zeolite 1 L","Amonyak ve ağır metalleri bağlayan doğal iyon değişim medyası · ürün kodu 1274 · 250 ml / 200 L; 0,5 mg/L'ye kadar amonyağı gidermek için yüksek akışta fakat savrulmadan kullanılır ve değer 24–48 saat izlenir · kalıcı azot döngüsünün, su testinin veya su değişiminin yerine geçmez; uzun süreli amonyak kontrolü için biyofiltre kurulmalıdır"],
    ["Zeolite 2 L","Amonyak ve ağır metalleri bağlayan doğal iyon değişim medyası · ürün kodu 1275 · 250 ml / 200 L; 0,5 mg/L'ye kadar amonyağı gidermek için yüksek akışta fakat savrulmadan kullanılır ve değer 24–48 saat izlenir · kalıcı azot döngüsünün, su testinin veya su değişiminin yerine geçmez; uzun süreli amonyak kontrolü için biyofiltre kurulmalıdır"],
    ["Zeolite 4 L","Amonyak ve ağır metalleri bağlayan doğal iyon değişim medyası · ürün kodu 1276 · 250 ml / 200 L; 0,5 mg/L'ye kadar amonyağı gidermek için yüksek akışta fakat savrulmadan kullanılır ve değer 24–48 saat izlenir · kalıcı azot döngüsünün, su testinin veya su değişiminin yerine geçmez; uzun süreli amonyak kontrolü için biyofiltre kurulmalıdır"],
  ],"2026-10-24"),
  ...products("Seachem","filter_media","https://www.seachem.com/cuprisorb.php",[
    ["CupriSorb 100 ml","Bakır ve ağır metalleri seçici olarak bağlayan şelatlayıcı reçine · ürün kodu 0205 · 250 ml / 600 L; 7.500 mg'a veya 12 ppm'e kadar bakır giderimi, bakır testiyle izlenir ve boncuklar koyu mavi-siyaha döndüğünde medya tükenmiştir · kalıcı kullanım temel iz elementleri tüketebileceğinden önerilmez; rejenerasyon yalnız üreticinin asit güvenliği talimatıyla, metal olmayan kapta, açık havada ve çocuklardan uzakta yapılmalıdır"],
    ["CupriSorb 250 ml","Bakır ve ağır metalleri seçici olarak bağlayan şelatlayıcı reçine · ürün kodu 0206 · 250 ml / 600 L; 7.500 mg'a veya 12 ppm'e kadar bakır giderimi, bakır testiyle izlenir ve boncuklar koyu mavi-siyaha döndüğünde medya tükenmiştir · kalıcı kullanım temel iz elementleri tüketebileceğinden önerilmez; rejenerasyon yalnız üreticinin asit güvenliği talimatıyla, metal olmayan kapta, açık havada ve çocuklardan uzakta yapılmalıdır"],
    ["CupriSorb 500 ml","Bakır ve ağır metalleri seçici olarak bağlayan şelatlayıcı reçine · ürün kodu 0203 · 250 ml / 600 L; 7.500 mg'a veya 12 ppm'e kadar bakır giderimi, bakır testiyle izlenir ve boncuklar koyu mavi-siyaha döndüğünde medya tükenmiştir · kalıcı kullanım temel iz elementleri tüketebileceğinden önerilmez; rejenerasyon yalnız üreticinin asit güvenliği talimatıyla, metal olmayan kapta, açık havada ve çocuklardan uzakta yapılmalıdır"],
    ["CupriSorb 4 L","Bakır ve ağır metalleri seçici olarak bağlayan şelatlayıcı reçine · ürün kodu 0209 · 250 ml / 600 L; 7.500 mg'a veya 12 ppm'e kadar bakır giderimi, bakır testiyle izlenir ve boncuklar koyu mavi-siyaha döndüğünde medya tükenmiştir · kalıcı kullanım temel iz elementleri tüketebileceğinden önerilmez; rejenerasyon yalnız üreticinin asit güvenliği talimatıyla, metal olmayan kapta, açık havada ve çocuklardan uzakta yapılmalıdır"],
  ],"2026-10-24"),
  ...products("Seachem","filter_media","https://www.seachem.com/hypersorb.php",[
    ["HyperSorb 100 ml","Organik atık ve renklenmeyi tutan, pH'ı etkilemeyen sentetik karbon alternatifi · ürün kodu 0155 · 250 ml / 300 L; sarı boncuklar koyu kahverengiye döndüğünde tükenir · rejenerasyon yalnız kokusuz-boyasız normal %8,25 hipokloritli çamaşır suyuyla ve üretici protokolüyle yapılmalı; klor kokusu kalırsa tekrar kullanılmamalı ve slime-coat ürünleri rejenerasyonu bozabilir"],
    ["HyperSorb 250 ml","Organik atık ve renklenmeyi tutan, pH'ı etkilemeyen sentetik karbon alternatifi · ürün kodu 0156 · 250 ml / 300 L; sarı boncuklar koyu kahverengiye döndüğünde tükenir · rejenerasyon yalnız kokusuz-boyasız normal %8,25 hipokloritli çamaşır suyuyla ve üretici protokolüyle yapılmalı; klor kokusu kalırsa tekrar kullanılmamalı ve slime-coat ürünleri rejenerasyonu bozabilir"],
    ["HyperSorb 2 L","Organik atık ve renklenmeyi tutan, pH'ı etkilemeyen sentetik karbon alternatifi · ürün kodu 0158 · 250 ml / 300 L; sarı boncuklar koyu kahverengiye döndüğünde tükenir · rejenerasyon yalnız kokusuz-boyasız normal %8,25 hipokloritli çamaşır suyuyla ve üretici protokolüyle yapılmalı; klor kokusu kalırsa tekrar kullanılmamalı ve slime-coat ürünleri rejenerasyonu bozabilir"],
    ["HyperSorb 4 L","Organik atık ve renklenmeyi tutan, pH'ı etkilemeyen sentetik karbon alternatifi · ürün kodu 0159 · 250 ml / 300 L; sarı boncuklar koyu kahverengiye döndüğünde tükenir · rejenerasyon yalnız kokusuz-boyasız normal %8,25 hipokloritli çamaşır suyuyla ve üretici protokolüyle yapılmalı; klor kokusu kalırsa tekrar kullanılmamalı ve slime-coat ürünleri rejenerasyonu bozabilir"],
  ],"2026-10-24"),
  ...products("Seachem","filter_media","https://www.seachem.com/matrixcarbon.php",[
    ["MatrixCarbon 100 ml","Düşük kül ve sızabilir fosfat içeriğine sahip küresel makro gözenekli aktif karbon · ürün kodu 0105 · 250 ml / 400 L; filtre torbasında durulanarak yüksek akışa yerleştirilir ve tipik olarak 3–6 ay çalışır, ancak gerçek süre su yüküne bağlıdır · tüm karbonlar bir miktar fosfat içerir; bitkili akvaryumlarda iz elementlere etkisi düşük olsa da sıfır değildir"],
    ["MatrixCarbon 250 ml","Düşük kül ve sızabilir fosfat içeriğine sahip küresel makro gözenekli aktif karbon · ürün kodu 0106 · 250 ml / 400 L; filtre torbasında durulanarak yüksek akışa yerleştirilir ve tipik olarak 3–6 ay çalışır, ancak gerçek süre su yüküne bağlıdır · tüm karbonlar bir miktar fosfat içerir; bitkili akvaryumlarda iz elementlere etkisi düşük olsa da sıfır değildir"],
    ["MatrixCarbon 500 ml","Düşük kül ve sızabilir fosfat içeriğine sahip küresel makro gözenekli aktif karbon · ürün kodu 0103 · 250 ml / 400 L; filtre torbasında durulanarak yüksek akışa yerleştirilir ve tipik olarak 3–6 ay çalışır, ancak gerçek süre su yüküne bağlıdır · tüm karbonlar bir miktar fosfat içerir; bitkili akvaryumlarda iz elementlere etkisi düşük olsa da sıfır değildir"],
    ["MatrixCarbon 1 L","Düşük kül ve sızabilir fosfat içeriğine sahip küresel makro gözenekli aktif karbon · ürün kodu 0107 · 250 ml / 400 L; filtre torbasında durulanarak yüksek akışa yerleştirilir ve tipik olarak 3–6 ay çalışır, ancak gerçek süre su yüküne bağlıdır · tüm karbonlar bir miktar fosfat içerir; bitkili akvaryumlarda iz elementlere etkisi düşük olsa da sıfır değildir"],
    ["MatrixCarbon 2 L","Düşük kül ve sızabilir fosfat içeriğine sahip küresel makro gözenekli aktif karbon · ürün kodu 0108 · 250 ml / 400 L; filtre torbasında durulanarak yüksek akışa yerleştirilir ve tipik olarak 3–6 ay çalışır, ancak gerçek süre su yüküne bağlıdır · tüm karbonlar bir miktar fosfat içerir; bitkili akvaryumlarda iz elementlere etkisi düşük olsa da sıfır değildir"],
    ["MatrixCarbon 4 L","Düşük kül ve sızabilir fosfat içeriğine sahip küresel makro gözenekli aktif karbon · ürün kodu 0109 · 250 ml / 400 L; filtre torbasında durulanarak yüksek akışa yerleştirilir ve tipik olarak 3–6 ay çalışır, ancak gerçek süre su yüküne bağlıdır · tüm karbonlar bir miktar fosfat içerir; bitkili akvaryumlarda iz elementlere etkisi düşük olsa da sıfır değildir"],
  ],"2026-10-24"),
  ...products("Seachem","filter_media","https://www.seachem.com/phosbond.php",[
    ["PhosBond 100 ml","Fosfat ve silikatı bağlayan GFO kaplı alüminyum oksit hibrit medya · ürün kodu 1260 · 60 ml / 400 L tatlı su; 1,19 mg/g fosfat bağlama kapasitesi · durulanıp yüksek akışa fakat savrulmayacak biçimde yerleştirilir; dört gün sonra yaklaşık 0,02 mg/L hedefi test edilir, aşırı kullanım önerilmez ve ölçüm yükselene kadar medya bırakılabilir"],
    ["PhosBond 250 ml","Fosfat ve silikatı bağlayan GFO kaplı alüminyum oksit hibrit medya · ürün kodu 1261 · 60 ml / 400 L tatlı su; 1,19 mg/g fosfat bağlama kapasitesi · durulanıp yüksek akışa fakat savrulmayacak biçimde yerleştirilir; dört gün sonra yaklaşık 0,02 mg/L hedefi test edilir, aşırı kullanım önerilmez ve ölçüm yükselene kadar medya bırakılabilir"],
    ["PhosBond 500 ml","Fosfat ve silikatı bağlayan GFO kaplı alüminyum oksit hibrit medya · ürün kodu 1262 · 60 ml / 400 L tatlı su; 1,19 mg/g fosfat bağlama kapasitesi · durulanıp yüksek akışa fakat savrulmayacak biçimde yerleştirilir; dört gün sonra yaklaşık 0,02 mg/L hedefi test edilir, aşırı kullanım önerilmez ve ölçüm yükselene kadar medya bırakılabilir"],
    ["PhosBond 1 L","Fosfat ve silikatı bağlayan GFO kaplı alüminyum oksit hibrit medya · ürün kodu 1265 · 60 ml / 400 L tatlı su; 1,19 mg/g fosfat bağlama kapasitesi · durulanıp yüksek akışa fakat savrulmayacak biçimde yerleştirilir; dört gün sonra yaklaşık 0,02 mg/L hedefi test edilir, aşırı kullanım önerilmez ve ölçüm yükselene kadar medya bırakılabilir"],
    ["PhosBond 4 L","Fosfat ve silikatı bağlayan GFO kaplı alüminyum oksit hibrit medya · ürün kodu 1263 · 60 ml / 400 L tatlı su; 1,19 mg/g fosfat bağlama kapasitesi · durulanıp yüksek akışa fakat savrulmayacak biçimde yerleştirilir; dört gün sonra yaklaşık 0,02 mg/L hedefi test edilir, aşırı kullanım önerilmez ve ölçüm yükselene kadar medya bırakılabilir"],
  ],"2026-10-24"),
  ...products("Seachem","filter_media","https://www.seachem.com/phosguard.php",[
    ["PhosGuard 100 ml","Fosfat ve silikatı geri salmadan bağlayan küresel alüminyum oksit medya · ürün kodu 0185 · 85 ml / 400 L tatlı su; fosfat tamponlu tatlı suda kullanılmaz · ilk ıslatmada ısı üretebildiği için ürün iki kat hacimde tatlı suya yavaşça eklenip durulanır; dört gün sonra yaklaşık 0,02 mg/L hedefi test edilir ve aşırı kullanım önerilmez"],
    ["PhosGuard 250 ml","Fosfat ve silikatı geri salmadan bağlayan küresel alüminyum oksit medya · ürün kodu 0186 · 85 ml / 400 L tatlı su; fosfat tamponlu tatlı suda kullanılmaz · ilk ıslatmada ısı üretebildiği için ürün iki kat hacimde tatlı suya yavaşça eklenip durulanır; dört gün sonra yaklaşık 0,02 mg/L hedefi test edilir ve aşırı kullanım önerilmez"],
    ["PhosGuard 500 ml","Fosfat ve silikatı geri salmadan bağlayan küresel alüminyum oksit medya · ürün kodu 0183 · 85 ml / 400 L tatlı su; fosfat tamponlu tatlı suda kullanılmaz · ilk ıslatmada ısı üretebildiği için ürün iki kat hacimde tatlı suya yavaşça eklenip durulanır; dört gün sonra yaklaşık 0,02 mg/L hedefi test edilir ve aşırı kullanım önerilmez"],
    ["PhosGuard 1 L","Fosfat ve silikatı geri salmadan bağlayan küresel alüminyum oksit medya · ürün kodu 0187 · 85 ml / 400 L tatlı su; fosfat tamponlu tatlı suda kullanılmaz · ilk ıslatmada ısı üretebildiği için ürün iki kat hacimde tatlı suya yavaşça eklenip durulanır; dört gün sonra yaklaşık 0,02 mg/L hedefi test edilir ve aşırı kullanım önerilmez"],
    ["PhosGuard 2 L","Fosfat ve silikatı geri salmadan bağlayan küresel alüminyum oksit medya · ürün kodu 0188 · 85 ml / 400 L tatlı su; fosfat tamponlu tatlı suda kullanılmaz · ilk ıslatmada ısı üretebildiği için ürün iki kat hacimde tatlı suya yavaşça eklenip durulanır; dört gün sonra yaklaşık 0,02 mg/L hedefi test edilir ve aşırı kullanım önerilmez"],
    ["PhosGuard 4 L","Fosfat ve silikatı geri salmadan bağlayan küresel alüminyum oksit medya · ürün kodu 0189 · 85 ml / 400 L tatlı su; fosfat tamponlu tatlı suda kullanılmaz · ilk ıslatmada ısı üretebildiği için ürün iki kat hacimde tatlı suya yavaşça eklenip durulanır; dört gün sonra yaklaşık 0,02 mg/L hedefi test edilir ve aşırı kullanım önerilmez"],
  ],"2026-10-24"),
  ...products("Seachem","filter_media","https://www.seachem.com/phosnet.php",[
    ["PhosNet 50 g","Fosfat ve silikatı geri salmadan bağlayan sentetik granüler demir oksit medya · ürün kodu 1250 · 50 g / 400 L tatlı su; 1,41 mg/g fosfat bağlama kapasitesi · durulanıp yüksek akışa fakat savrulmayacak biçimde yerleştirilir; dört gün sonra yaklaşık 0,02 mg/L hedefi test edilir, aşırı kullanım önerilmez ve medya reaktörde çevrilmemelidir"],
    ["PhosNet 125 g","Fosfat ve silikatı geri salmadan bağlayan sentetik granüler demir oksit medya · ürün kodu 1251 · 50 g / 400 L tatlı su; 1,41 mg/g fosfat bağlama kapasitesi · durulanıp yüksek akışa fakat savrulmayacak biçimde yerleştirilir; dört gün sonra yaklaşık 0,02 mg/L hedefi test edilir, aşırı kullanım önerilmez ve medya reaktörde çevrilmemelidir"],
    ["PhosNet 250 g","Fosfat ve silikatı geri salmadan bağlayan sentetik granüler demir oksit medya · ürün kodu 1252 · 50 g / 400 L tatlı su; 1,41 mg/g fosfat bağlama kapasitesi · durulanıp yüksek akışa fakat savrulmayacak biçimde yerleştirilir; dört gün sonra yaklaşık 0,02 mg/L hedefi test edilir, aşırı kullanım önerilmez ve medya reaktörde çevrilmemelidir"],
    ["PhosNet 500 g","Fosfat ve silikatı geri salmadan bağlayan sentetik granüler demir oksit medya · ürün kodu 1255 · 50 g / 400 L tatlı su; 1,41 mg/g fosfat bağlama kapasitesi · durulanıp yüksek akışa fakat savrulmayacak biçimde yerleştirilir; dört gün sonra yaklaşık 0,02 mg/L hedefi test edilir, aşırı kullanım önerilmez ve medya reaktörde çevrilmemelidir"],
    ["PhosNet 2 kg","Fosfat ve silikatı geri salmadan bağlayan sentetik granüler demir oksit medya · ürün kodu 1253 · 50 g / 400 L tatlı su; 1,41 mg/g fosfat bağlama kapasitesi · durulanıp yüksek akışa fakat savrulmayacak biçimde yerleştirilir; dört gün sonra yaklaşık 0,02 mg/L hedefi test edilir, aşırı kullanım önerilmez ve medya reaktörde çevrilmemelidir"],
  ],"2026-10-24"),
  ...products("Seachem","filter_media","https://www.seachem.com/seagel.php",[
    ["SeaGel 100 ml","MatrixCarbon ve PhosGuard'ın 50/50 karışımı; organik renk, fosfat, silikat, metal ve asitleri uzaklaştırır · ürün kodu 0065 · 250 ml / 150–225 L, yaklaşık 3–4 ay · yalnız fosfat tamponlu olmayan tatlı suda kullanılır; ilk ıslatmada köpürüp ısınabileceği için dikkatle durulanır ve filtre torbasında yüksek akışa yerleştirilir"],
    ["SeaGel 250 ml","MatrixCarbon ve PhosGuard'ın 50/50 karışımı; organik renk, fosfat, silikat, metal ve asitleri uzaklaştırır · ürün kodu 0066 · 250 ml / 150–225 L, yaklaşık 3–4 ay · yalnız fosfat tamponlu olmayan tatlı suda kullanılır; ilk ıslatmada köpürüp ısınabileceği için dikkatle durulanır ve filtre torbasında yüksek akışa yerleştirilir"],
    ["SeaGel 500 ml","MatrixCarbon ve PhosGuard'ın 50/50 karışımı; organik renk, fosfat, silikat, metal ve asitleri uzaklaştırır · ürün kodu 0063 · 250 ml / 150–225 L, yaklaşık 3–4 ay · yalnız fosfat tamponlu olmayan tatlı suda kullanılır; ilk ıslatmada köpürüp ısınabileceği için dikkatle durulanır ve filtre torbasında yüksek akışa yerleştirilir"],
    ["SeaGel 1 L","MatrixCarbon ve PhosGuard'ın 50/50 karışımı; organik renk, fosfat, silikat, metal ve asitleri uzaklaştırır · 250 ml / 150–225 L, yaklaşık 3–4 ay · resmî sayfa 1 L boyutu listeler ancak ürün kodu yayımlamaz; yalnız fosfat tamponlu olmayan tatlı suda kullanılır, ilk ıslatmada köpürüp ısınabileceği için dikkatle durulanır"],
    ["SeaGel 2 L","MatrixCarbon ve PhosGuard'ın 50/50 karışımı; organik renk, fosfat, silikat, metal ve asitleri uzaklaştırır · ürün kodu 0068 · 250 ml / 150–225 L, yaklaşık 3–4 ay · yalnız fosfat tamponlu olmayan tatlı suda kullanılır; ilk ıslatmada köpürüp ısınabileceği için dikkatle durulanır ve filtre torbasında yüksek akışa yerleştirilir"],
    ["SeaGel 4 L","MatrixCarbon ve PhosGuard'ın 50/50 karışımı; organik renk, fosfat, silikat, metal ve asitleri uzaklaştırır · ürün kodu 0069 · 250 ml / 150–225 L, yaklaşık 3–4 ay · yalnız fosfat tamponlu olmayan tatlı suda kullanılır; ilk ıslatmada köpürüp ısınabileceği için dikkatle durulanır ve filtre torbasında yüksek akışa yerleştirilir"],
  ],"2026-10-24"),
  ...products("Seachem","test","https://www.seachem.com/ammonia-alert.php",[
    ["Ammonia Alert","Serbest amonyağı sürekli izleyen renkli sensör · ürün kodu 0010 · bir yıldan uzun kullanım; 0,05 mg/L Alert, 0,2 mg/L Alarm ve 0,5 mg/L Toxic eşikleri yaklaşık 15 dakikada gösterir · yalnız toksik serbest amonyağı ölçer, toplam amonyağı ölçmez ve asidik pH'ta önerilmez; Safe dışındaki her gösterimde su değişimi düşünülmelidir"],
  ],"2026-10-24"),
  ...products("Seachem","test","https://www.seachem.com/ph-alert.php",[
    ["pH Alert","Tatlı suda pH'ı sürekli izleyen renkli sensör · ürün kodu 0020 · 5,4–8,0 aralığı; ilk kullanımda yaklaşık 30 dakika, sonraki değişimlerde yaklaşık 10 dakika yanıt · yalnız tatlı su içindir; sensör sabun, deterjan, çamaşır suyu veya sert cisimle temizlenmez"],
  ],"2026-10-24"),
  ...products("Seachem","test","https://www.seachem.com/one-year-alert-combo.php",[
    ["Alert Combo / One Year Alert Combo","Ammonia Alert ve pH Alert sürekli sensör paketi · ürün kodu 0013 · serbest amonyak 0,05/0,2/0,5 mg/L eşikleri ve tatlı suda pH 5,4–8,0 aralığı · üreticinin iki güncel resmî URL'si aynı 0013 kodu için paket içeriğini farklı açıklar: biri birer kart, diğeri ayrıca bir yedek pH sensörü belirtir; satın almadan önce fiziksel kutu içeriği doğrulanmalıdır"],
  ],"2026-10-24"),
  ...products("Seachem","test","https://www.seachem.com/multitest-ammonia.php",[
    ["MultiTest Ammonia","Toplam ve serbest amonyağı 0,05 mg/L altına kadar ölçen 75'ten fazla testlik kit · ürün kodu 0950 · altı örneği eşzamanlı çalıştırabilen plaka ve doğrulama referansı içerir; güçlü alkali ve güçlü asit içeren bileşenleri nedeniyle çocuklardan uzak tutulmalı, göze temas hâlinde 10 dakika suyla durulanıp tıbbi yardım alınmalıdır"],
  ],"2026-10-24"),
  ...products("Seachem","test","https://www.seachem.com/multitest-copper.php",[
    ["MultiTest Copper","İyonik ve şelatlı bakırı 0–0,80 mg/L aralığında ölçen 75'ten fazla testlik kit · ürün kodu 0966 · düşük aralıkta 0,0025 mg/L'ye kadar renk adımları ve doğrulama referansı içerir; Reagent 2 güçlü baz içerir, cilt ve göz temasından korunmalıdır"],
  ],"2026-10-24"),
  ...products("Seachem","test","https://www.seachem.com/multitest-iron.php",[
    ["MultiTest Iron","İyonik ve çoğu şelatlı demiri 0–2,0 mg/L aralığında, 0,05 mg/L adımlarla ölçen 75'ten fazla testlik kit · ürün kodu 0968 · bitkili akvaryumlar için yayımlanan 0,1–0,2 mg/L hedefi ve bazı türlerde 0,5 mg/L üzeri toksisite sınırı ölçüm bağlamıdır; reaktif yutulmamalı veya göze temas ettirilmemelidir"],
  ],"2026-10-24"),
  ...products("Seachem","test","https://www.seachem.com/multitest-nitrite.php",[
    ["MultiTest Nitrite/Nitrate","Nitriti 0–25 mg/L ve nitratı 0–50 mg/L aralığında ölçen 75'ten fazla testlik kit · ürün kodu 0960 · belirgin nitrit varken nitrat sonucu doğru okunamaz; kit değerleri nitrit/nitrat olarak raporlanır ve nitrojen birimine çevrilmemelidir · asit ve organik çözücü içeren bileşenleri nedeniyle çocuklardan uzak tutulmalıdır"],
  ],"2026-10-24"),
  ...products("Seachem","test","https://www.seachem.com/multitest-phosphate.php",[
    ["MultiTest Phosphate","İnorganik fosfatı 0–3,0 mg/L aralığında ölçen 75'ten fazla testlik kit · ürün kodu 0970 · tatlı sudaki fosfat düzeyi kit aralığını aşarsa örnek distile suyla seyreltilmelidir; Reagent 2 sülfürik ve molibdik asit içerir, cilt/göz ve çalışma yüzeyi teması önlenmelidir"],
  ],"2026-10-24"),
  ...products("Seachem","test","https://www.seachem.com/multitest-silicate.php",[
    ["MultiTest Silicate","Çözünür silikatı 0–25 mg/L aralığında ölçen 75'ten fazla testlik kit · ürün kodu 0976 · tatlı suda silikat genellikle kritik değildir ve üretici 4–20 mg/L aralığını olağan bağlam olarak verir; Reagent 1a/1b sülfürik ve molibdik asit içerir, cilt/göz ve çalışma yüzeyi teması önlenmelidir"],
  ],"2026-10-24"),
  ...products("Seachem","treatment","https://www.seachem.com/cupramine.php",[
    ["Cupramine 50 ml","Bakır bazlı dış parazit ilacı · ürün kodu 0564 · ilk gün 1 ml / 40 L, 48 saat sonra tekrar; tatlı suda yarım doz ve 0,25 mg/L son konsantrasyon, 14 gün · omurgasızlar çıkarılmalı; UV/ozon ve kimyasal filtrasyon kapatılmalı · başka ilaç, su düzenleyici, amonyak bağlayıcı veya indirgeme ajanıyla birlikte kullanılmamalı; yeniden dozlamadan önce bakır ölçülmeli ve 0,6 mg/L aşılmamalıdır"],
    ["Cupramine 100 ml","Bakır bazlı dış parazit ilacı · ürün kodu 0565 · ilk gün 1 ml / 40 L, 48 saat sonra tekrar; tatlı suda yarım doz ve 0,25 mg/L son konsantrasyon, 14 gün · omurgasızlar çıkarılmalı; UV/ozon ve kimyasal filtrasyon kapatılmalı · başka ilaç, su düzenleyici, amonyak bağlayıcı veya indirgeme ajanıyla birlikte kullanılmamalı; yeniden dozlamadan önce bakır ölçülmeli ve 0,6 mg/L aşılmamalıdır"],
    ["Cupramine 250 ml","Bakır bazlı dış parazit ilacı · ürün kodu 0566 · ilk gün 1 ml / 40 L, 48 saat sonra tekrar; tatlı suda yarım doz ve 0,25 mg/L son konsantrasyon, 14 gün · omurgasızlar çıkarılmalı; UV/ozon ve kimyasal filtrasyon kapatılmalı · başka ilaç, su düzenleyici, amonyak bağlayıcı veya indirgeme ajanıyla birlikte kullanılmamalı; yeniden dozlamadan önce bakır ölçülmeli ve 0,6 mg/L aşılmamalıdır"],
    ["Cupramine 500 ml","Bakır bazlı dış parazit ilacı · ürün kodu 0563 · ilk gün 1 ml / 40 L, 48 saat sonra tekrar; tatlı suda yarım doz ve 0,25 mg/L son konsantrasyon, 14 gün · omurgasızlar çıkarılmalı; UV/ozon ve kimyasal filtrasyon kapatılmalı · başka ilaç, su düzenleyici, amonyak bağlayıcı veya indirgeme ajanıyla birlikte kullanılmamalı; yeniden dozlamadan önce bakır ölçülmeli ve 0,6 mg/L aşılmamalıdır"],
    ["Cupramine 2 L","Bakır bazlı dış parazit ilacı · ürün kodu 0568 · ilk gün 1 ml / 40 L, 48 saat sonra tekrar; tatlı suda yarım doz ve 0,25 mg/L son konsantrasyon, 14 gün · omurgasızlar çıkarılmalı; UV/ozon ve kimyasal filtrasyon kapatılmalı · başka ilaç, su düzenleyici, amonyak bağlayıcı veya indirgeme ajanıyla birlikte kullanılmamalı; yeniden dozlamadan önce bakır ölçülmeli ve 0,6 mg/L aşılmamalıdır"],
    ["Cupramine 4 L","Bakır bazlı dış parazit ilacı · ürün kodu 0569 · ilk gün 1 ml / 40 L, 48 saat sonra tekrar; tatlı suda yarım doz ve 0,25 mg/L son konsantrasyon, 14 gün · omurgasızlar çıkarılmalı; UV/ozon ve kimyasal filtrasyon kapatılmalı · başka ilaç, su düzenleyici, amonyak bağlayıcı veya indirgeme ajanıyla birlikte kullanılmamalı; yeniden dozlamadan önce bakır ölçülmeli ve 0,6 mg/L aşılmamalıdır"],
  ],"2026-10-24"),
  ...products("Seachem","treatment","https://www.seachem.com/focus.php",[
    ["Focus 5 g","İlacı yeme bağlayan, difüzyon kaybını azaltan %0,1 polimere bağlı nitrofurantoin içeren destek · ürün kodu 0641 · tek başına rastgele kullanılmaz; uygun ilaçtan 1 ölçek + Focus'tan 1 ölçek + 1 yemek kaşığı yem karıştırılır, günde bir kez yaklaşık bir dakikada tüketilecek kadar ve en az bir hafta verilir · belirtiler farklı hastalıklarda ortak olabileceğinden uygun ilaç ayrıca belirlenmelidir"],
    ["Focus 100 g","İlacı yeme bağlayan, difüzyon kaybını azaltan %0,1 polimere bağlı nitrofurantoin içeren destek · ürün kodu 0645 · tek başına rastgele kullanılmaz; uygun ilaçtan 1 ölçek + Focus'tan 1 ölçek + 1 yemek kaşığı yem karıştırılır, günde bir kez yaklaşık bir dakikada tüketilecek kadar ve en az bir hafta verilir · belirtiler farklı hastalıklarda ortak olabileceğinden uygun ilaç ayrıca belirlenmelidir"],
  ],"2026-10-24"),
  ...products("Seachem","treatment","https://www.seachem.com/kanaplex.php",[
    ["KanaPlex 5 g","Kanamisin bazlı bakteriyel/fungal balık ilacı · ürün kodu 0881 · suya 1 ölçek / 20 L, 48 saatte bir ve en fazla üç doz; ikinci tur yalnız balık stres göstermiyorsa · suya dozlamada omurgasızlar çıkarılmalı, UV/ozon ve kimyasal filtrasyon kapatılmalı · belirtiler birden fazla hastalıkta ortak olabilir; mümkünse hastane akvaryumu kullanılmalıdır"],
    ["KanaPlex 100 g","Kanamisin bazlı bakteriyel/fungal balık ilacı · ürün kodu 0885 · suya 1 ölçek / 20 L, 48 saatte bir ve en fazla üç doz; ikinci tur yalnız balık stres göstermiyorsa · suya dozlamada omurgasızlar çıkarılmalı, UV/ozon ve kimyasal filtrasyon kapatılmalı · belirtiler birden fazla hastalıkta ortak olabilir; mümkünse hastane akvaryumu kullanılmalıdır"],
  ],"2026-10-24"),
  ...products("Seachem","treatment","https://www.seachem.com/metroplex.php",[
    ["MetroPlex 5 g","%70 metronidazol içeren protozoan ve anaerobik bakteriyel hastalık ilacı · ürün kodu 0801 · suya 1–2 ölçek / 40 L, 48 saatte bir ve en fazla üç hafta; omurgasızlar çıkarılmalı, UV/ozon ve kimyasal filtrasyon kapatılmalı · yemde 1 ölçek MetroPlex + 1 ölçek Focus + 1 yemek kaşığı yem, günlük ve en fazla üç hafta kullanılır; hiçbir ilaç koşulsuz reef güvenli sayılmaz"],
    ["MetroPlex 100 g","%70 metronidazol içeren protozoan ve anaerobik bakteriyel hastalık ilacı · ürün kodu 0805 · suya 1–2 ölçek / 40 L, 48 saatte bir ve en fazla üç hafta; omurgasızlar çıkarılmalı, UV/ozon ve kimyasal filtrasyon kapatılmalı · yemde 1 ölçek MetroPlex + 1 ölçek Focus + 1 yemek kaşığı yem, günlük ve en fazla üç hafta kullanılır; hiçbir ilaç koşulsuz reef güvenli sayılmaz"],
  ],"2026-10-24"),
  ...products("Seachem","treatment","https://www.seachem.com/neoplex.php",[
    ["NeoPlex 5 g","%43 neomisin sülfat içeren geniş spektrumlu dış bakteriyel enfeksiyon ilacı · ürün kodu 0682 · suya 1 ölçek / 8 L, yedi günde bir ve en fazla üç hafta; omurgasızlar çıkarılmalı, UV/ozon ve kimyasal filtrasyon kapatılmalı · iç enfeksiyonda Focus ile yem karışımı günlük en fazla bir hafta; hassas omurgasızlarda stres görülebilir"],
    ["NeoPlex 100 g","%43 neomisin sülfat içeren geniş spektrumlu dış bakteriyel enfeksiyon ilacı · ürün kodu 0685 · suya 1 ölçek / 8 L, yedi günde bir ve en fazla üç hafta; omurgasızlar çıkarılmalı, UV/ozon ve kimyasal filtrasyon kapatılmalı · iç enfeksiyonda Focus ile yem karışımı günlük en fazla bir hafta; hassas omurgasızlarda stres görülebilir"],
  ],"2026-10-24"),
  ...products("Seachem","treatment","https://www.seachem.com/paraguard.php",[
    ["ParaGuard 100 ml","Aldehit, malakit yeşili ve koruyucu polimer karışımlı dış parazit/lezyon tedavisi · ürün kodu 0605 · 5 ml / 40 L günlük, yalnız balık stres göstermediği sürece; omurgasızlar ve kimyasal filtrasyon çıkarılmalı · reef için önerilmez; yılan balığı, loach, vatoz/köpek balığı gibi hassas balıklarda dörtte bir–yarım dozla başlanmalıdır · formaldehit, metanol veya bakır içermez"],
    ["ParaGuard 250 ml","Aldehit, malakit yeşili ve koruyucu polimer karışımlı dış parazit/lezyon tedavisi · ürün kodu 0606 · 5 ml / 40 L günlük, yalnız balık stres göstermediği sürece; omurgasızlar ve kimyasal filtrasyon çıkarılmalı · reef için önerilmez; yılan balığı, loach, vatoz/köpek balığı gibi hassas balıklarda dörtte bir–yarım dozla başlanmalıdır · formaldehit, metanol veya bakır içermez"],
    ["ParaGuard 500 ml","Aldehit, malakit yeşili ve koruyucu polimer karışımlı dış parazit/lezyon tedavisi · ürün kodu 0603 · 5 ml / 40 L günlük, yalnız balık stres göstermediği sürece; omurgasızlar ve kimyasal filtrasyon çıkarılmalı · reef için önerilmez; yılan balığı, loach, vatoz/köpek balığı gibi hassas balıklarda dörtte bir–yarım dozla başlanmalıdır · formaldehit, metanol veya bakır içermez"],
    ["ParaGuard 2 L","Aldehit, malakit yeşili ve koruyucu polimer karışımlı dış parazit/lezyon tedavisi · ürün kodu 0608 · 5 ml / 40 L günlük, yalnız balık stres göstermediği sürece; omurgasızlar ve kimyasal filtrasyon çıkarılmalı · reef için önerilmez; yılan balığı, loach, vatoz/köpek balığı gibi hassas balıklarda dörtte bir–yarım dozla başlanmalıdır · formaldehit, metanol veya bakır içermez"],
    ["ParaGuard 4 L","Aldehit, malakit yeşili ve koruyucu polimer karışımlı dış parazit/lezyon tedavisi · ürün kodu 0609 · 5 ml / 40 L günlük, yalnız balık stres göstermediği sürece; omurgasızlar ve kimyasal filtrasyon çıkarılmalı · reef için önerilmez; yılan balığı, loach, vatoz/köpek balığı gibi hassas balıklarda dörtte bir–yarım dozla başlanmalıdır · formaldehit, metanol veya bakır içermez"],
  ],"2026-10-24"),
  ...products("Seachem","treatment","https://www.seachem.com/polyguard.php",[
    ["PolyGuard 5 g","Bakteriyel, fungal ve parazitik sorunlara yönelik güçlü geniş spektrumlu ilaç · ürün kodu 0762 · 1 ölçek / 40 L, 72 saatte bir ve en fazla iki hafta/beş doz · omurgasızlar çıkarılmalı; UV/ozon ve kimyasal filtrasyon kapatılmalı; akvaryum döngüsü ve su kalitesi önce doğrulanmalıdır · başka ilaçlarla karıştırılması önerilmez"],
    ["PolyGuard 100 g","Bakteriyel, fungal ve parazitik sorunlara yönelik güçlü geniş spektrumlu ilaç · ürün kodu 0765 · 1 ölçek / 40 L, 72 saatte bir ve en fazla iki hafta/beş doz · omurgasızlar çıkarılmalı; UV/ozon ve kimyasal filtrasyon kapatılmalı; akvaryum döngüsü ve su kalitesi önce doğrulanmalıdır · başka ilaçlarla karıştırılması önerilmez"],
  ],"2026-10-24"),
  ...products("Seachem","treatment","https://www.seachem.com/sulfaplex.php",[
    ["SulfaPlex 5 g","%69 sülfatiasol içeren bakteriyel, fungal ve bazı protozoan sorunlarına yönelik ilaç · ürün kodu 0842 · suya 2–3 ölçek / 40 L, 72 saatte bir ve en fazla üç hafta · omurgasızlar çıkarılmalı; UV/ozon ve kimyasal filtrasyon kapatılmalı · belirtiler farklı hastalıklarda ortak olabilir; kötü su koşulları ve kalabalık ayrıca düzeltilmelidir"],
    ["SulfaPlex 100 g","%69 sülfatiasol içeren bakteriyel, fungal ve bazı protozoan sorunlarına yönelik ilaç · ürün kodu 0845 · suya 2–3 ölçek / 40 L, 72 saatte bir ve en fazla üç hafta · omurgasızlar çıkarılmalı; UV/ozon ve kimyasal filtrasyon kapatılmalı · belirtiler farklı hastalıklarda ortak olabilir; kötü su koşulları ve kalabalık ayrıca düzeltilmelidir"],
  ],"2026-10-24"),
  ...products("Seachem","food","https://www.seachem.com/entice.php",[
    ["Entice 250 ml","Tatlı ve tuzlu su balıklarında seçici yem alımını destekleyen doğal koku ve tat artırıcı · ürün kodu 1426 · yem kısa süre üründe bekletilir veya yemin verildiği noktaya 1–2 kapak eklenir; kullanmadan önce çalkalanır · ilaç veya hastalık tedavisi değildir"],
    ["Entice 500 ml","Tatlı ve tuzlu su balıklarında seçici yem alımını destekleyen doğal koku ve tat artırıcı · ürün kodu 1423 · yem kısa süre üründe bekletilir veya yemin verildiği noktaya 1–2 kapak eklenir; kullanmadan önce çalkalanır · ilaç veya hastalık tedavisi değildir"],
    ["Entice 4 L","Tatlı ve tuzlu su balıklarında seçici yem alımını destekleyen doğal koku ve tat artırıcı · resmî ürün sayfası 4 L boyutu listeler ancak ürün kodu yayımlamaz · yem kısa süre üründe bekletilir veya yemin verildiği noktaya 1–2 kapak eklenir; kullanmadan önce çalkalanır · ilaç veya hastalık tedavisi değildir"],
  ],"2026-10-24"),
  ...products("Seachem","food","https://www.seachem.com/garlicguard.php",[
    ["GarlicGuard 100 ml","Tatlı ve tuzlu su balıkları için doğal sarımsak kokulu iştah/yem desteği ve C vitamini kaynağı · ürün kodu 0175 · doğrudan akvaryuma dozlamak yerine yemi üründe bekletmek önerilir; ilaçlı yemle kullanılabilir fakat tek başına parazit veya hastalık tedavisi değildir · reef ve bitkili akvaryumlarla uyumludur"],
    ["GarlicGuard 250 ml","Tatlı ve tuzlu su balıkları için doğal sarımsak kokulu iştah/yem desteği ve C vitamini kaynağı · ürün kodu 0176 · doğrudan akvaryuma dozlamak yerine yemi üründe bekletmek önerilir; ilaçlı yemle kullanılabilir fakat tek başına parazit veya hastalık tedavisi değildir · reef ve bitkili akvaryumlarla uyumludur"],
    ["GarlicGuard 500 ml","Tatlı ve tuzlu su balıkları için doğal sarımsak kokulu iştah/yem desteği ve C vitamini kaynağı · ürün kodu 0173 · doğrudan akvaryuma dozlamak yerine yemi üründe bekletmek önerilir; ilaçlı yemle kullanılabilir fakat tek başına parazit veya hastalık tedavisi değildir · reef ve bitkili akvaryumlarla uyumludur"],
    ["GarlicGuard 2 L","Tatlı ve tuzlu su balıkları için doğal sarımsak kokulu iştah/yem desteği ve C vitamini kaynağı · ürün kodu 0178 · doğrudan akvaryuma dozlamak yerine yemi üründe bekletmek önerilir; ilaçlı yemle kullanılabilir fakat tek başına parazit veya hastalık tedavisi değildir · reef ve bitkili akvaryumlarla uyumludur"],
    ["GarlicGuard 4 L","Tatlı ve tuzlu su balıkları için doğal sarımsak kokulu iştah/yem desteği ve C vitamini kaynağı · resmî ürün sayfası 4 L boyutu listeler ancak ürün kodu yayımlamaz · doğrudan akvaryuma dozlamak yerine yemi üründe bekletmek önerilir; ilaçlı yemle kullanılabilir fakat tek başına parazit veya hastalık tedavisi değildir · reef ve bitkili akvaryumlarla uyumludur"],
  ],"2026-10-24"),
  ...products("Seachem","food","https://www.seachem.com/nourish.php",[
    ["Nourish 50 ml","Tatlı su süs balıkları için spirulina, chlorella, vitamin, aminoasit, iz element ve potasyum iyodür içeren tamamlayıcı yem desteği · ürün kodu 1484 · çalkalanıp yem her gün bir kapak üründe bekletilir · iyodür miktarı en az 0,008 mg/g; ilaç veya hastalık tedavisi değildir"],
    ["Nourish 100 ml","Tatlı su süs balıkları için spirulina, chlorella, vitamin, aminoasit, iz element ve potasyum iyodür içeren tamamlayıcı yem desteği · ürün kodu 1485 · çalkalanıp yem her gün bir kapak üründe bekletilir · iyodür miktarı en az 0,008 mg/g; ilaç veya hastalık tedavisi değildir"],
    ["Nourish 250 ml","Tatlı su süs balıkları için spirulina, chlorella, vitamin, aminoasit, iz element ve potasyum iyodür içeren tamamlayıcı yem desteği · ürün kodu 1486 · çalkalanıp yem her gün bir kapak üründe bekletilir · iyodür miktarı en az 0,008 mg/g; ilaç veya hastalık tedavisi değildir"],
    ["Nourish 500 ml","Tatlı su süs balıkları için spirulina, chlorella, vitamin, aminoasit, iz element ve potasyum iyodür içeren tamamlayıcı yem desteği · ürün kodu 1483 · çalkalanıp yem her gün bir kapak üründe bekletilir · iyodür miktarı en az 0,008 mg/g; ilaç veya hastalık tedavisi değildir"],
    ["Nourish 4 L","Tatlı su süs balıkları için spirulina, chlorella, vitamin, aminoasit, iz element ve potasyum iyodür içeren tamamlayıcı yem desteği · resmî ürün sayfası 4 L boyutu listeler ancak ürün kodu yayımlamaz · çalkalanıp yem her gün bir kapak üründe bekletilir · iyodür miktarı en az 0,008 mg/g; ilaç veya hastalık tedavisi değildir"],
  ],"2026-10-24"),
  ...products("Seachem","food","https://www.seachem.com/vitality.php",[
    ["Vitality 50 ml","Öncelikle deniz balıkları için tasarlanmış, tatlı su süs balıklarında da kullanılabilen spirulina/chlorella, vitamin, aminoasit ve iz element desteği · ürün kodu 1494 · çalkalanıp yem her gün bir kapak üründe bekletilir · askorbik asit en az 0,5 mg/g; ilaç veya hastalık tedavisi değildir"],
    ["Vitality 100 ml","Öncelikle deniz balıkları için tasarlanmış, tatlı su süs balıklarında da kullanılabilen spirulina/chlorella, vitamin, aminoasit ve iz element desteği · ürün kodu 1495 · çalkalanıp yem her gün bir kapak üründe bekletilir · askorbik asit en az 0,5 mg/g; ilaç veya hastalık tedavisi değildir"],
    ["Vitality 250 ml","Öncelikle deniz balıkları için tasarlanmış, tatlı su süs balıklarında da kullanılabilen spirulina/chlorella, vitamin, aminoasit ve iz element desteği · ürün kodu 1496 · çalkalanıp yem her gün bir kapak üründe bekletilir · askorbik asit en az 0,5 mg/g; ilaç veya hastalık tedavisi değildir"],
    ["Vitality 500 ml","Öncelikle deniz balıkları için tasarlanmış, tatlı su süs balıklarında da kullanılabilen spirulina/chlorella, vitamin, aminoasit ve iz element desteği · ürün kodu 1493 · çalkalanıp yem her gün bir kapak üründe bekletilir · askorbik asit en az 0,5 mg/g; ilaç veya hastalık tedavisi değildir"],
    ["Vitality 4 L","Öncelikle deniz balıkları için tasarlanmış, tatlı su süs balıklarında da kullanılabilen spirulina/chlorella, vitamin, aminoasit ve iz element desteği · resmî ürün sayfası 4 L boyutu listeler ancak ürün kodu yayımlamaz · çalkalanıp yem her gün bir kapak üründe bekletilir · askorbik asit en az 0,5 mg/g; ilaç veya hastalık tedavisi değildir"],
  ],"2026-10-24"),
  ...([{
    family:"Chlorella Flakes", sourceUrl:"https://www.seachem.com/nutridiet-chlorella.php",
    audience:"Tatlı ve tuzlu suda otçul ve omnivor balıklar için chlorella ağırlıklı tam pul yem",
    variants:[["15 g","1111"],["30 g","1112"],["50 g","1113"],["100 g","1114"],["500 g","1115"]],
  },{
    family:"Cichlid Flakes", sourceUrl:"https://www.seachem.com/nutridiet-cichlid.php",
    audience:"Cikletler için hormonesiz ve doğal renk desteği sunan tam pul yem",
    variants:[["15 g","1071"],["30 g","1072"],["50 g","1073"],["100 g","1074"],["500 g","1075"]],
  },{
    family:"Discus Flakes", sourceUrl:"https://www.seachem.com/nutridiet-discus.php",
    audience:"Discuslar için balık, kalamar ve solucan bileşenli dengeli tam pul yem",
    variants:[["15 g","1131"],["30 g","1132"],["50 g","1133"],["100 g","1134"],["500 g","1136"]],
  },{
    family:"Goldfish Flakes", sourceUrl:"https://www.seachem.com/nutridiet-goldfish.php",
    audience:"Japon balıkları için protein, vitamin, mineral ve doğal renk desteği içeren tam pul yem",
    variants:[["15 g","1061"],["30 g","1062"],["50 g","1063"],["100 g","1064"],["500 g","1065"]],
  },{
    family:"Shrimp Flakes", sourceUrl:"https://www.seachem.com/nutridiet-shrimp.php",
    audience:"Tatlı ve tuzlu suda etçil ve omnivor balıklar için karides, kalamar ve balık içeren tam pul yem",
    variants:[["15 g","1121"],["30 g","1122"],["50 g","1123"],["100 g","1124"],["500 g","1126"]],
  },{
    family:"Tropical Flakes", sourceUrl:"https://www.seachem.com/nutridiet-tropical.php",
    audience:"Tropikal balıklar için protein, vitamin, mineral ve doğal renk desteği içeren tam pul yem",
    variants:[["15 g","1081"],["30 g","1082"],["50 g","1083"],["100 g","1084"],["500 g","1085"]],
  },{
    family:"Worm Flakes", sourceUrl:"https://www.seachem.com/nutridiet-worm.php",
    audience:"Tatlı ve tuzlu suda etçil ve omnivor süs balıkları için bloodworm, ipek böceği, tubifex ve blackworm bileşenli tam pul yem",
    variants:[["15 g","1053"],["30 g","1054"],["50 g","1055"],["100 g","1056"],["500 g","1058"],["2,27 kg","1059"]],
  }] as Array<{family:string;sourceUrl:string;audience:string;variants:Array<[string,string]>}>).flatMap(({family,sourceUrl,audience,variants})=>variants.map(([pack,itemNo]):CareProductProfile=>({
    id:catalogSlug(`Seachem-NutriDiet-${family}-Probiotics-Formula-${pack}`), brand:"Seachem",
    model:`NutriDiet ${family} Probiotics Formula ${pack}`, category:"food",
    description:`${audience} · probiyotik, chlorella, sarımsak ve C vitamini içerir; besin alımını desteklemeyi ve atığı azaltmayı amaçlar · günde 1–3 kez, üç dakikada tüketilecek kadar verilir; yalnız süs balıkları içindir · ürün kodu ${itemNo}`,
    sourceUrl, verifiedAt:"2026-10-24",
  }))),
  ...products("Seachem","food","https://www.seachem.com/nutridiet-betta.php",[
    ["NutriDiet Betta 30 g","Betta balıkları için chlorella ve balık unu içeren günlük pelet yem · ürün kodu 0004 · her Betta'nın iki dakikada tüketeceği kadar günlük verilir; yalnız süs balıkları içindir"],
  ],"2026-10-24"),
  ...([{
    family:"Chlorella Flakes", sourceUrl:"https://www.seachem.com/nutridiet-chlorella-international.php",
    audience:"Tatlı ve tuzlu suda otçul ve omnivor balıklar için chlorella ağırlıklı tam pul yem",
    variants:[["15 g","1900"],["30 g","1901"],["50 g","1902"],["100 g","1903"],["500 g","1904"]],
  },{
    family:"Cichlid Flakes", sourceUrl:"https://www.seachem.com/nutridiet-cichlid-international.php",
    audience:"Cikletler için hormonesiz ve doğal renk desteği sunan tam pul yem",
    variants:[["15 g","1905"],["30 g","1906"],["50 g","1907"],["100 g","1908"],["500 g","1909"]],
  },{
    family:"Discus Flakes", sourceUrl:"https://www.seachem.com/nutridiet-discus-international.php",
    audience:"Discuslar için balık, kalamar ve solucan bileşenli dengeli tam pul yem",
    variants:[["15 g","1941"],["30 g","1911"],["50 g","1912"],["100 g","1913"],["500 g","1914"]],
  },{
    family:"Goldfish Flakes", sourceUrl:"https://www.seachem.com/nutridiet-goldfish-international.php",
    audience:"Japon balıkları için protein, vitamin, mineral ve doğal renk desteği içeren tam pul yem",
    variants:[["15 g","1915"],["30 g","1916"],["50 g","1917"],["100 g","1918"],["500 g","1919"]],
  },{
    family:"Shrimp Flakes", sourceUrl:"https://www.seachem.com/nutridiet-shrimp-international.php",
    audience:"Tatlı ve tuzlu suda etçil ve omnivor balıklar için karides, kalamar ve balık içeren tam pul yem",
    variants:[["15 g","1942"],["30 g","1931"],["50 g","1932"],["100 g","1933"],["500 g","1934"]],
  },{
    family:"Tropical Flakes", sourceUrl:"https://www.seachem.com/nutridiet-tropical-international.php",
    audience:"Tropikal balıklar için protein, vitamin, mineral ve doğal renk desteği içeren tam pul yem",
    variants:[["15 g","1935"],["30 g","1936"],["50 g","1937"],["100 g","1938"],["500 g","1939"]],
  }] as Array<{family:string;sourceUrl:string;audience:string;variants:Array<[string,string]>}>).flatMap(({family,sourceUrl,audience,variants})=>variants.map(([pack,itemNo]):CareProductProfile=>({
    id:catalogSlug(`Seachem-NutriDiet-${family}-Original-Formula-${pack}`), brand:"Seachem",
    model:`NutriDiet ${family} Original Formula ${pack}`, category:"food",
    description:`${audience} · probiyotik içermez; chlorella, sarımsak, C vitamini ile sindirimi destekleyen proteinat ve hidrolizatlar içerir · günde 1–3 kez, üç dakikada tüketilecek kadar verilir; yalnız süs balıkları içindir · ürün kodu ${itemNo}`,
    sourceUrl, verifiedAt:"2026-10-24",
  }))),
  ...products("Seachem","food","https://www.seachem.com/vacation-tabs.php",[
    ["NutriDiet Vacation Tabs 10 adet","Tüm süs balıkları için yedi güne kadar yavaş salınımlı tam tatil yemi · ürün kodu 1000 · küçük balıklarda toplam 10 cm balık boyuna, daha iri veya yoğun beslenen balıklarda toplam 7 cm balık boyuna bir tablet kullanılır; dönüşte su değişimi önerilir"],
  ],"2026-10-24"),
  ...products("Seachem","food","https://www.seachem.com/herbivore-tabs.php",[
    ["NutriDiet Herbivore Tabs 85 g","Tatlı ve tuzlu suda otçul, dipten beslenen ve otlayan türler için bitki/alg bileşenli batan tam tablet yem · ürün kodu 1003 · toplam 25 cm balık boyuna bir tablet günlük veya gün aşırı verilir; tüketim miktarına göre ayarlanır"],
  ],"2026-10-24"),
  ...([{
    family:"Flourite",
    sourceUrl:"https://www.seachem.com/flourite.php",
    detail:"Bitkili tatlı su akvaryumları için kararlı gözenekli kil çakılı; kimyasal kaplama içermez, pH'ı değiştirmez, zamanla yenilenmesi gerekmez ve kullanımdan önce tozu gidermek için durulanır",
    variants:[["3,5 kg","0493"],["7 kg","0495"]],
  },{
    family:"Flourite Black",
    sourceUrl:"https://www.seachem.com/flourite-black.php",
    detail:"Bitkili tatlı su akvaryumları için siyah, kararlı gözenekli kil çakılı; kimyasal kaplama içermez, pH'ı değiştirmez, zamanla yenilenmesi gerekmez ve kullanımdan önce durulanır",
    variants:[["3,5 kg","3723"],["7 kg","3725"]],
  },{
    family:"Flourite Black Sand",
    sourceUrl:"https://www.seachem.com/flourite-black-sand.php",
    detail:"Bitkili tatlı su akvaryumları için siyah ince, kararlı gözenekli kil kumu; kimyasal kaplama içermez, pH'ı değiştirmez, zamanla yenilenmesi gerekmez ve kullanımdan önce durulanır",
    variants:[["3,5 kg","3523"],["7 kg","3525"]],
  },{
    family:"Flourite Dark",
    sourceUrl:"https://www.seachem.com/flourite-dark.php",
    detail:"Bitkili tatlı su akvaryumları için koyu renkli, kararlı gözenekli kil çakılı; kimyasal kaplama içermez, pH'ı değiştirmez, zamanla yenilenmesi gerekmez ve kullanımdan önce durulanır",
    variants:[["3,5 kg","3733"],["7 kg","3735"]],
  },{
    family:"Flourite Red",
    sourceUrl:"https://www.seachem.com/flourite-red.php",
    detail:"Bitkili tatlı su akvaryumları için kırmızı, kararlı gözenekli kil çakılı; kimyasal kaplama içermez, pH'ı değiştirmez, zamanla yenilenmesi gerekmez ve kullanımdan önce durulanır",
    variants:[["3,5 kg","3713"],["7 kg","3715"]],
  },{
    family:"Flourite Sand",
    sourceUrl:"https://www.seachem.com/flourite-sand.php",
    detail:"Bitkili tatlı su akvaryumları için doğal ince, kararlı gözenekli kil kumu; kimyasal kaplama içermez, pH'ı değiştirmez, zamanla yenilenmesi gerekmez ve kullanımdan önce durulanır",
    variants:[["3,5 kg","3513"],["7 kg","3515"]],
  },{
    family:"Onyx Sand",
    sourceUrl:"https://www.seachem.com/onyx-sand.php",
    detail:"Bitkili tatlı su akvaryumlarında KH'ı destekleyen karbonatça zengin koyu gri kum; suya göre pH'ı yaklaşık 0,1–0,5 birim yükseltebilir, zamanla yenilenmesi gerekmez ve kullanımdan önce durulanır",
    variants:[["3,5 kg","3503"],["7 kg","3505"]],
  },{
    family:"Onyx",
    sourceUrl:"https://www.seachem.com/onyx.php",
    detail:"Özellikle Tanganika cikletleri ve alkali su kurulumları için karbonatça zengin doğal çakıl; hafif tamponlama etkisi vardır, nötr taban değildir ve kullanımdan önce durulanır",
    variants:[["7 kg","3705"]],
  },{
    family:"Gray Coast",
    sourceUrl:"https://www.seachem.com/gray-coast.php",
    detail:"Deniz, resif veya alkali tropikal kurulumlarda kalsiyum ve alkaliniteyi destekleyen, magnezyumca zengin doğal kalsit çakıl; nötr taban değildir, yumuşak-asidik su isteyen canlılar için otomatik önerilmez ve kullanımdan önce durulanır",
    variants:[["3,5 kg","3623"],["10 kg","3626"]],
  }] as Array<{family:string;sourceUrl:string;detail:string;variants:Array<[string,string]>}>).flatMap(({family,sourceUrl,detail,variants})=>variants.map(([pack,itemNo]):CareProductProfile=>({
    id:catalogSlug(`Seachem-${family}-${pack}`), brand:"Seachem", model:`${family} ${pack}`, category:"substrate",
    description:`${detail} · ürün kodu ${itemNo}`, sourceUrl, verifiedAt:"2026-10-24",
  }))),
  {
    id:catalogSlug("Seachem-pH Checker Refill Solution-50 ml"), brand:"Seachem", model:"pH Checker Refill Solution 50 ml", category:"test",
    description:"Seachem Glass pH Checker için 50 ml renk göstergesi yedek çözeltisi · ürün sayfası bunu CO₂ Indicator Solution adıyla, güncel resmî bayi envanteri pH Checker Refill Solution adıyla listeler; refill ürün kodu yayımlanmadığı için kod eklenmemiştir · hazneye 20 damla konur, cihaz difüzörden en uzak noktaya yerleştirilir · sarı daha düşük pH/daha fazla CO₂, mavi daha yüksek pH/daha az CO₂ gösterir · renk dolaylı bir pH/CO₂ göstergesidir; kalibre edilmiş pH veya çözünmüş CO₂ ölçüm cihazı değildir",
    sourceUrl:"https://www.seachem.com/pH-checker.php",
    additionalSourceUrls:["https://www.seachem.com/SDL/SDLDealerDetail.php?recID=203351"],
    verifiedAt:"2026-10-25",
  },
  ...products("Tropica","fertilizer","https://tropica.com/en/plant-care/liquid-fertilisers/premium-nutrition/",[
    ["Premium Nutrition 125 ml","Az veya yavaş büyüyen bitkili akvaryumlar için azot ve fosfor içermeyen sıvı gübre; haftalık öneri 50 L net suya 6 ml, pompa basışı 2 ml"],
    ["Premium Nutrition 300 ml","Az veya yavaş büyüyen bitkili akvaryumlar için azot ve fosfor içermeyen sıvı gübre; haftalık öneri 50 L net suya 6 ml, pompa basışı 2 ml"],
    ["Premium Nutrition 750 ml","Az veya yavaş büyüyen bitkili akvaryumlar için azot ve fosfor içermeyen sıvı gübre; haftalık öneri 50 L net suya 6 ml, pompa basışı 2 ml"],
    ["Premium Nutrition 3 L","Az veya yavaş büyüyen bitkili akvaryumlar için azot ve fosfor içermeyen sıvı gübre; haftalık öneri 50 L net suya 6 ml"],
  ],"2026-10-09"),
  ...products("Tropica","fertilizer","https://tropica.com/en/plant-care/liquid-fertilisers/specialised-nutrition/",[
    ["Specialised Nutrition 125 ml","Yoğun bitkili akvaryumlar için azot ve fosfor içeren sıvı gübre; haftalık öneri 50 L net suya 6 ml, yosun görülürse doz azaltılıp su değişimi artırılmalı"],
    ["Specialised Nutrition 300 ml","Yoğun bitkili akvaryumlar için azot ve fosfor içeren sıvı gübre; haftalık öneri 50 L net suya 6 ml, yosun görülürse doz azaltılıp su değişimi artırılmalı"],
    ["Specialised Nutrition 750 ml","Yoğun bitkili akvaryumlar için azot ve fosfor içeren sıvı gübre; haftalık öneri 50 L net suya 6 ml, yosun görülürse doz azaltılıp su değişimi artırılmalı"],
    ["Specialised Nutrition 3 L","Yoğun bitkili akvaryumlar için azot ve fosfor içeren sıvı gübre; haftalık öneri 50 L net suya 6 ml, yosun görülürse doz azaltılıp su değişimi artırılmalı"],
  ],"2026-10-09"),
  ...products("Tropica","fertilizer","https://tropica.com/en/plant-care/liquid-fertilisers/carbon-nutrition/",[
    ["Carbon Nutrition 125 ml","Bitkiler için günlük sıvı karbon desteği; üreticinin önerisi 100 L net suya günde 4 ml"],
    ["Carbon Nutrition 300 ml","Bitkiler için günlük sıvı karbon desteği; üreticinin önerisi 100 L net suya günde 4 ml"],
    ["Carbon Nutrition 750 ml","Bitkiler için günlük sıvı karbon desteği; üreticinin önerisi 100 L net suya günde 4 ml"],
  ],"2026-10-09"),
  ...products("Tropica","fertilizer","https://tropica.com/en/plant-care/nutrition-capsules/nutrition-capsules-3-pcs/",[["Nutrition Capsules 3 pcs","Kökten beslenen bitkiler için azot, fosfor, demir, mangan ve mikro elementleri 1–2 ayda salan üçlü paket"]],"2026-10-09"),
  ...products("Tropica","fertilizer","https://tropica.com/en/plant-care/nutrition-capsules/nutrition-capsules-10-pcs/",[["Nutrition Capsules 10 pcs","Kökten beslenen bitkiler için azot, fosfor, demir, mangan ve mikro elementleri 1–2 ayda salan onlu paket"]],"2026-10-09"),
  ...products("Tropica","fertilizer","https://tropica.com/en/plant-care/nutrition-capsules/nutrition-capsules-50-pcs/",[["Nutrition Capsules 50 pcs","Kökten beslenen bitkiler için azot, fosfor, demir, mangan ve mikro elementleri 1–2 ayda salan ellili paket"]],"2026-10-09"),
  ...products("Tropica","water_conditioner","https://tropica.com/en/plant-care/liquid-fertilisers/water-conditioner/",[
    ["Water Conditioner 125 ml","Musluk suyundaki kloru etkisizleştiren ve ağır metalleri bağlayan su düzenleyici; her su değişiminde 100 L yeni suya 10–12 ml"],
    ["Water Conditioner 300 ml","Musluk suyundaki kloru etkisizleştiren ve ağır metalleri bağlayan su düzenleyici; her su değişiminde 100 L yeni suya 10–12 ml"],
    ["Water Conditioner 750 ml","Musluk suyundaki kloru etkisizleştiren ve ağır metalleri bağlayan su düzenleyici; her su değişiminde 100 L yeni suya 10–12 ml"],
  ],"2026-10-09"),
  ...products("Tropica","substrate","https://tropica.com/da/plant-care/aquarium-soil/",[
    ["Aquarium Soil 3 L","2–3 mm taneli, doğal volkanik mineralli tam aktif bitki toprağı; pH ve su kimyasını etkiler, ilk dört hafta sık su değişimi gerekir"],
    ["Aquarium Soil 9 L","2–3 mm taneli, doğal volkanik mineralli tam aktif bitki toprağı; pH ve su kimyasını etkiler, ilk dört hafta sık su değişimi gerekir"],
    ["Aquarium Soil Powder 3 L","Ön plan bitkileri için ince taneli tam aktif bitki toprağı; pH ve su kimyasını etkiler, ilk dört hafta sık su değişimi gerekir"],
    ["Aquarium Soil Powder 9 L","Ön plan bitkileri için ince taneli tam aktif bitki toprağı; pH ve su kimyasını etkiler, ilk dört hafta sık su değişimi gerekir"],
  ],"2026-10-09"),
  ...products("Tropica","substrate","https://tropica.com/en/plant-care/substrate/",[["Substrate","Çakılın altına 1 cm katman halinde serilen, KH veya pH değerini etkilemeyen konsantre besleyici taban katmanı"]],"2026-10-09"),
  ...products("The 2Hr Aquarist","fertilizer","https://www.2hraquarist.com/products/apt1",[
    ["APT1 / Zero","Nitrat ve fosfat içermeyen kapsamlı sıvı gübre; yeni aquasoil kurulumlarının ilk 1–3 ayı veya balık yükü bitki yükünden yüksek tanklar için. Günlük 3 ml / 100 L dozlanır; K₂O %5,5, magnezyum %0,85 ve şelatlı demir %0,1 içerir. Gübre değişimi sistem şokunu azaltmak için iki haftaya yayılmalıdır; talimata uygun kullanımda karides ve diğer canlılarla uyumludur."],
  ],"2026-10-25"),
  ...products("The 2Hr Aquarist","fertilizer","https://www.2hraquarist.com/products/apt3",[
    ["APT3 / Complete","Makro, mikro ve iz element içeren günlük tam sıvı gübre; bitki yükü balık yükünden yüksek tanklar için. Günlük 3 ml / 100 L dozlanır; %0,75 nitrat azotu, %0,69 P₂O₅, %4,52 K₂O, %1,10 magnezyum ve %0,12 şelatlı demir içerir. CO₂'siz veya yavaş büyüyen bitkili tanklarda doz düşürülmeli; başka gübreden geçiş iki haftaya yayılmalıdır."],
  ],"2026-10-25"),
  ...products("The 2Hr Aquarist","fertilizer","https://www.2hraquarist.com/products/aptei",[
    ["APTe / Estimative Index","Estimative Index yaklaşımını hazır konsantre olarak sunan yoğun sıvı gübre. Günlük 2 ml / 100 L dozlanır; %2 azot, %1,37 P₂O₅, %8 K₂O, %1,60 magnezyum ve %0,16 şelatlı demir içerir. Güçlü ve kararlı CO₂, iyi dolaşım ve yüksek bitki kütlesi varsayar; hata payı daha düşüktür ve geçiş iki haftaya yayılmalıdır."],
  ],"2026-10-25"),
  ...products("The 2Hr Aquarist","fertilizer","https://www.2hraquarist.com/products/2hr-aquarist-apt-jazz",[
    ["APT Jazz","Olgunlaşmış aquasoili veya 2 mm'den ince ve en az 4 cm derin inert tabanı kökten besleyen, yavaş salımlı amonyum azotu taşıyan kapsül. Kök bölgesine en az 2,5 cm derine, yaklaşık her 16 cm² için bir kapsül yerleştirilir ve iki ay sonra yenilenir; yerleştirme sonrası kalkan tortu sifonlanmalıdır. 18 kapsüllük küçük pakettir; %16 toplam azot, %0,2 P₂O₅ ve %0,6 MgO içerir."],
  ],"2026-10-25"),
  ...products("The 2Hr Aquarist","fertilizer","https://www.2hraquarist.com/products/2hr-aquarist-apt-dew",[
    ["APT Dew","Terraryum ve paludaryumdaki yosun, eğrelti ve emers bitkiler için makro, mikro ve iz elementli yaprak spreyi. Yapraklar nemli ve parlak olacak fakat damlamayacak şekilde haftada 2–3 kez uygulanır; püskürtme başına 0,18 ml verir. Balık, kurbağa, amfibi, böcek, izopod ve salyangozlarla uyumlu olarak tanımlansa da doğrudan hayvanların üzerine püskürtülmez."],
  ],"2026-10-25"),
  ...products("The 2Hr Aquarist","treatment","https://www.2hraquarist.com/products/aptfix",[
    ["APT Fix","BBA, saç/iplik/tüy ve çoğu filamentli alg için %3 tescilli epoksi aldehit formüllü noktasal uygulama. Filtre en fazla iki dakika durdurularak doğrudan algli bölgeye 1 ml / 10 L sınırında uygulanır; aşılırsa hemen %80 su değişimi yapılır. Hassas yosun ve bitkilerden kaçınılır, canlıların üzerine uygulanmaz ve sonrasında güçlü dolaşım/oksijen sağlanır; bileşik 12–24 saatte biyolojik olarak parçalanır."],
  ],"2026-10-25"),
  ...products("The 2Hr Aquarist","treatment","https://www.2hraquarist.com/products/2hr-aquarist-fixlite",[
    ["APT FIXLITE","Yosunlar, liverwortlar, Vallisneria ve genç/hassas bitkiler için %2,5 tescilli karboksilik asit formüllü daha nazik noktasal alg uygulaması. Filtre en fazla iki dakika durdurularak 1 ml / 10 L sınırında uygulanır; sınır aşılırsa hemen %80 su değişimi yapılır. Canlıların üzerine uygulanmaz ve sonrasında güçlü dolaşım/oksijen sağlanır; 12–24 saatte parçalanır, yoğun saç algi ve Cladophora önce fiziksel olarak uzaklaştırılır."],
  ],"2026-10-25"),
  ...products("The 2Hr Aquarist","water_conditioner","https://www.2hraquarist.com/products/aptpure",[
    ["APT Pure","Klor ve kloramini gideren; ağır metal, amonyak, nitrit ve nitratı detoksifiye eden %30 sulu hidrosülfit tuzu çözeltisi. 1 ml / 60 L dozlanır; tanka musluk suyu eklenmeden önce uygulanır, değişken su veya hassas canlılarda ayrı kapta ön karışım yapılır. Sarımsak/kükürt kokusu normaldir; nitratı yok etmez, canlılar için zararsız ve bitki/bakterilerin kullanabileceği bağlı forma getirir."],
  ],"2026-10-25"),
  ...products("The 2Hr Aquarist","water_conditioner","https://www.2hraquarist.com/products/2hr-aquarist-apt-sky",[
    ["APT SKY","RO/RODI veya çok yumuşak su için GH yükselten kalsiyum-magnezyum mineral karışımı; NPK, KH ve pH değerini değiştirmez. 60 L için 10,5 g / 15 ml temel doz kullanılır; her 3,5 g / 5 ml yaklaşık 12 ppm kalsiyum, 3,5 ppm magnezyum ve 2,5 dGH ekler. İlk kurulumda toplam suya, sonraki değişimlerde yalnız yeni suya göre ve ölçülen GH hedefiyle dozlanır; konsantre stok çözelti veya otomatik dozaj için uygun değildir."],
  ],"2026-10-25"),
  ...products("The 2Hr Aquarist","water_conditioner","https://www.2hraquarist.com/products/2hr-aquarist-apt-sky-plus",[
    ["APT SKY PLUS","RO/RODI veya çok yumuşak suyu remineralize eder; GH ile birlikte KH'yi yaklaşık 2 dKH'ye ve pH'ı 7,2–7,6 aralığına doğru tamponlar, NPK oranını bozmaz. 60 L için 15 ml temel doz kullanılır; her 3,5 g / 5 ml yaklaşık 9 ppm kalsiyum, 2,5 ppm magnezyum, 1,8 dGH ve 0,5 dKH ekler. İlk kurulumda toplam suya, sonraki değişimlerde yalnız yeni suya göre dozlanır; konsantre stok çözelti veya otomatik dozaj için uygun değildir."],
  ],"2026-10-25"),
  ...products("The 2Hr Aquarist","bacteria","https://www.2hraquarist.com/products/2hr-aquarist-apt-start",[
    ["APT Start","Yeni kurulumda taban zenginleştirmeyi ve başlangıç bakterisini birleştiren tek kullanımlık 45 g paket. Bir paket 60 × 30 cm taban veya 60 L için tabanın altına yayılır; içteki bakteri poşeti ayrılarak tank doldurulduktan sonra suya eklenir. Döngüyü beslemek için az miktarda amonyak salar; APT Feast ile birlikte gerekmez, serin-kuru ve güneşten uzak saklanır."],
  ],"2026-10-25"),
  ...products("The 2Hr Aquarist","bacteria","https://www.2hraquarist.com/products/2hr-aquarist-apt-balance",[
    ["APT Balance","Özellikle düşük pH'lı aquasoil akvaryumları için iki poşetli kuru nitrifikasyon ve atık parçalayıcı bakteri kültürü. Yaklaşık 100 L için birer A ve B poşeti kullanılır; yeni tankta ve ardından aylık, filtre temizliği veya sistem sıfırlaması sonrası tekrarlanabilir. Uygulamadan sonra UV sterilizatör 24 saat kapatılır; canlı varken eklenebilir fakat balık eklemek için yine 1–2 hafta beklenmesi önerilir. Fazla doz geçici yüzey filmi veya bulanıklık yapabilir."],
  ],"2026-10-25"),
  ...products("The 2Hr Aquarist","substrate","https://www.2hraquarist.com/products/apt-feast",[
    ["APT Feast","Bitkili akvaryum için %0,5 azot ve %0,25 fosfor içeren organik, besleyici aktif aquasoil; 4 cm derinlikte serilir, suyu yaklaşık pH 6,2–6,6'ya yumuşatır ve 12 aya kadar sürekli besin sağlar. Döngüsüz kurulumda iki hafta gün aşırı %100 su değişimi veya iki haftalık karanlık başlangıç gerekir; ardından stabil olana kadar haftalık %80 su değişimi sürdürülür. APT Start gerekmez; balık ve karides eklemek için yaklaşık 3–4 hafta beklenir."],
  ],"2026-10-25"),
  ...shrimpsForeverProducts("food",[
    ["astaxanthine-40gr","Astaxanthine 40 g","Yüksek astaksantin içerikli, kırmızı pigmentasyonu desteklemeye yönelik karides yemi; tek başına temel yem veya hastalık tedavisi değildir."],
    ["baby-shrimp-food-20gr","Baby Shrimp Food 20 g","Yeni doğan karideslerin erişebileceği mikro boyutlu yem ve mikroorganizma gelişim desteği; porsiyon suyu kirletmeyecek kadar sınırlı tutulmalıdır."],
    ["barley-mix-50gr","Barley Mix 50 g","Karides ve salyangozlar için organik tahıl karışımı; suda kaldıkça mikroorganizma ve mantar miseli gelişimini destekler."],
    ["bean-pellet-50gr","Bean Pellet 50 g","Doğal tahıl ve soya kabuklarından üretilmiş, lifli ve suda biyofilm oluşumunu destekleyen pelet yem."],
    ["caridina-sp-starter-pack","Caridina Sp Starter Pack","Pro Bacter 50 ml, Shrimp Trace 50 ml, Bio Powder 20 g, Daily Feed 20 g ve GH+ Plus 40 g içeren Caridina başlangıç paketi; ürünler tek karışım değildir ve ayrı talimatla kullanılır."],
    ["color-30gr","Color 30 g","Spirulina, vitamin, mineral, lif ve aminoasit içeren renk destekli karides yemi; renk iddiası tedavi anlamına gelmez."],
    ["complete-30gr","Complete 30 g","Bitkisel bileşenler, soya, karides unu ve spirulina içeren günlük karides yemi. Karideslerin iki saatte tüketebileceği porsiyon verilir; ikinci öğün yalnız ilk porsiyon tamamen tüketildiyse uygulanır."],
    ["daily-feed-30gr","Daily Feed 30 g","Lif ve karbonhidratça zengin, tamamen bitkisel günlük karides yemi; porsiyon canlı sayısına ve tüketim hızına göre sınırlandırılır."],
    ["gluzayme-35gr","Gluzayme 35 g","Beta glukan ve sindirim enzimleri içeren tamamlayıcı karides yemi; üreticinin bağışıklık desteği ifadesi hastalık tedavisi veya veteriner teşhisi değildir."],
    ["growth-30gr","Growth 30 g","Karides ve diğer omurgasızların protein gereksinimine yönelik büyüme yemi; yalnız iki saat içinde tüketilecek miktar verilir."],
    ["mulberry-30gr","Mulberry 30 g","Dut yaprağı, soya, balık unu, spirulina, mineral ve vitamin premiksi içeren tamamlayıcı karides yemi."],
    ["multizyme-40gr","Multizyme 40 g","Vitamin, enzim ve aminoasit karışımı içeren tamamlayıcı karides yemi; hastalık önleme veya tedavi ürünü gibi değerlendirilmez."],
    ["neocaridina-tiger-sp-starter-pack","Neocaridina / Tiger Sp Starter Pack","Pro Bacter 50 ml, Shrimp Trace 50 ml, Bio Powder 20 g, Daily Feed 20 g ve GH/KH+ Plus 40 g içeren başlangıç paketi; içerikler ayrı ayrı dozlanır."],
    ["polyenzyme-40gr","Polyenzyme 40 g","Genç ve yetişkin karidesler için enzim ve besin emilimi desteği; üreticinin bağışıklık iddiası tedavi yerine geçmez."],
    ["red-40gr","Red 40 g","Kırmızı pigmentasyonu ve kabuk gelişimini desteklemeye yönelik mineral, mikro element, enzim ve aminoasit karışımı; haftada bir, 50 L altına bir ve üstüne iki ölçek önerilir."],
    ["shrimp-delight-main-50gr","Shrimp Delight Main 50 g","Karideslerin düzenli beslenmesine yönelik temel Shrimp Delight yemi."],
    ["shrimp-delight-mineral-50gr","Shrimp Delight Mineral 50 g","Karideslerin mineral ve kabuk gelişimi gereksinimine yönelik tamamlayıcı Shrimp Delight yemi."],
    ["shrimps-forever-astaxanthin-shrimps-stick","Astaxanthin Shrimps Stick","Astaksantin içeren renk destekli karides yem çubuğu; tamamlayıcı yemdir."],
    ["shrimps-forever-mineral-shrimps-stick","Mineral Shrimps Stick","Doğal mineral içerikli, kabuk değişimi dönemine yönelik tamamlayıcı karides yem çubuğu."],
    ["shrimps-forever-moringa-30gr","Moringa 30 g","Moringa yaprağı temelli vitamin, mineral ve lif destekli karides yemi."],
    ["shrimps-forever-pollen-shrimps-sticks","Pollen Shrimps Sticks","Polen içerikli tamamlayıcı karides yem çubuğu."],
    ["shrimps-forever-shrimp-sticks-algea","Shrimp Sticks Algea","Alg, vitamin ve mineral içerikli tamamlayıcı karides yem çubuğu; üreticinin güncel sayfasındaki Algea yazımı korunmuştur."],
    ["shrimps-forever-spinach-shrimps-stick","Spinach Shrimps Stick","Ispanak ve sebze içerikli karides yem çubuğu; ıspanağın doğal silikat içeriği kabuk desteği amacıyla sunulur."],
    ["shrimps-forever-walnut-shrimps-sticks","Walnut Shrimps Sticks","Ceviz yaprağından üretilen, lifli tamamlayıcı karides yem çubuğu; antibakteriyel iddia tedavi olarak sunulmaz."],
    ["shrimpsforever-color-150gr","Color 150 g","Color yeminin 150 g fiziksel paketi; spirulina, vitamin, mineral, lif ve aminoasit içeren renk destekli formül."],
    ["shrimpsforever-complete-150gr","Complete 150 g","Complete günlük yeminin 150 g fiziksel paketi; yalnız iki saatte tüketilecek porsiyon verilir ve nemden korunur."],
    ["shrimpsforever-daily-feed-150gr","Daily Feed 150 g","Bitkisel Daily Feed yeminin 150 g fiziksel paketi; porsiyon tüketim hızına göre sınırlandırılır."],
    ["shrimpsforever-growth-150gr","Growth 150 g","Protein ağırlıklı Growth yeminin 150 g fiziksel paketi; aşırı yemlemeyi önlemek için iki saatlik tüketim sınırı uygulanır."],
    ["shrimpsforever-snowflake-200gr","Snowflake 200 g","Soya kabuğu esaslı, suda mantar miseli ve biyofilm gelişimini destekleyen Snowflake yeminin 200 g paketi."],
    ["snowflake-50gr","Snowflake 50 g","Soya kabuğu esaslı, suda mantar miseli ve biyofilm gelişimini destekleyen Snowflake yeminin 50 g paketi."],
    ["speed-growth-40gr","Speed Growth 40 g","Yavru ve genç karidesler için protein ağırlıklı büyüme yemi; temel yemle dönüşümlü ve ölçülü kullanılır."],
    ["spinach-30gr","Spinach 30 g","Ispanak temelli vitamin, lif ve mineral destekli tamamlayıcı karides yemi."],
    ["veggy-pellet-50gr","Veggy Pellet 50 g","Bitkisel içerikli pelet karides yemi; günlük porsiyon suyu kirletmeyecek miktarda tutulur."],
    ["vitaplus-40gr","VitaPlus 40 g","Karidesler için vitamin ve makro element içeren tamamlayıcı yem; temel beslenmenin yerine geçmez."],
    ["white-30gr","White 30 g","Beyaz ve açık renk karides varyetelerinde renk görünümünü desteklemeye yönelik tamamlayıcı yem."],
    ["white-full-mineral-20gr","White Full Mineral 20 g","Beyaz pigment görünümü ve kabuk mineral desteğine yönelik tamamlayıcı karides yemi."],
  ]),
  ...shrimpsForeverProducts("bacteria",[
    ["bio-powder-50gr","Bio Powder 50 g","Mikroorganizma ve biyofilm gelişimini destekleyen bakteri-mineral karışımı. Yeni kurulumda 100 L için tabanın altına yarım kavanoz; canlı eklendikten bir ay sonra gün aşırı 100 L için bir ölçek önerilir."],
    ["cycle-starter-pro-bacter-130ml","Cycle Starter Pro Bacter 130 ml","Yeni ve mevcut karides akvaryumlarında nitrifikasyon döngüsünü başlatmaya/desteklemeye yönelik canlı filtre bakteri kültürü; ölçülmüş amonyak ve nitrit takibinin yerine geçmez."],
  ]),
  ...shrimpsForeverProducts("water_conditioner",[
    ["black-water-fulvic-acid-130ml","Black Water (Fulvic Acid) 130 ml","Humik ve fulvik asit içeren karasu düzenleyicisi; üreticinin mineral alımı ve düşük pH ortamı desteği amacıyla sunduğu katkıdır."],
    ["crystallize-crystal-water-130ml","Crystallize Crystal Water 130 ml","Mikro parçacıkların elektrik yükünü değiştirip kümelenerek filtrede tutulmasını destekleyen su berraklaştırıcı; fiziksel filtrasyon ve bakımın yerine geçmez."],
    ["gh-kh-plus-90gr","GH / KH+ Plus 90 g","RO veya saf suyu Neocaridina ve Tiger karideslere göre yeniden mineralleştirmek için GH ile KH sağlayan mineral karışımı; hedef değerler test edilerek kademeli dozlanır."],
    ["gh-plus-90gr","GH+ Plus 90 g","Kalsiyum, magnezyum, potasyum, sodyum ve mikro mineraller içeren GH mineral karışımı; RO/saf su için hedef GH ölçülerek kullanılır."],
    ["liquid-gh-130ml","Liquid GH+ 130 ml","Kalsiyum, magnezyum, potasyum, sodyum ve mikro mineraller içeren sıvı GH desteği; KH etkisi ve hedef değer etiket/talimat üzerinden doğrulanmadan otomatik dozlanmaz."],
    ["mineral-powder-90gr","Mineral Powder 90 g","Altmıştan fazla mineral içerdiği belirtilen, ağır/toksik mineralleri bağlama ve biyofilm desteği amaçlı toz; üretici GH, pH, KH ve TDS'yi etkilemediğini bildirir. Haftada iki kez 1–2 ölçek önerilir."],
    ["shrimp-trace-130ml","Shrimp Trace 130 ml","Kabuk değişimi ve metabolik süreçler için iz element/mineral desteği; su değerleri ölçülmeden gereksiz aşırı doz uygulanmaz."],
    ["sulawesi-7-5-90gr","Sulawesi 7,5 90 g","RO veya saf suyu Sulawesi karidesleri için yeniden mineralleştiren, mineral ve iz element içeren karışım; hedef pH 7,5 ifadesi ani pH düzeltmesi için kullanılmaz."],
    ["vit-amine-40gr","Vit-Amine 40 g","Karidesler için vitamin ve aminoasit desteği; temel yem, dengeli su değerleri veya hastalık tedavisi yerine geçmez."],
  ]),
  ...shrimpsForeverProducts("treatment",[
    ["algasol-organik-yosun-sokucu-130ml","Algasol 130 ml","Yeşil ve sakal algine karşı bitkisel asit temelli organik alg kontrol ürünü. Haftada 100 L suya 2 ml uygulanır; 20 damla yaklaşık 1 ml'dir. Alg nedenini ve su kalitesini düzeltmenin yerine geçmez."],
    ["shrimpsforever-ex-it-no-planaira-35gr","EX-it No Planaira 35 g","Planarya, hidra ve istenmeyen salyangozlara yönelik doğal akvaryum ürünü. 50 L için 1 g önerilir ve gerekirse beş gün sonra tekrarlanır; uygulama sırasında değerli karides, balık ve salyangozlar çıkarılmalı, aktif karbon kullanılmamalıdır."],
  ]),
  ...shrimpsForeverProducts("substrate",[
    ["shrimps-forever-3lt-shrimps-soil","Shrimps Soil 3 L","Karides, bitki ve mikroflora gelişimine yönelik organik asit ve mineralce zengin aktif toprağın 3 L paketi; aktif taban su değerlerini değiştirebilir ve kurulumda ölçüm gerektirir."],
    ["shrimps-forever-9lt-shrimps-soil","Shrimps Soil 9 L","Karides, bitki ve mikroflora gelişimine yönelik organik asit ve mineralce zengin aktif toprağın 9 L paketi; aktif taban su değerlerini değiştirebilir ve kurulumda ölçüm gerektirir."],
  ]),
  ...products("Shrimps Forever","bacteria",shrimpsForeverLegacySource,[
    ["Live Water (PSB - Bacteria) — önceki portföy","Üreticinin önceki resmî portföyünde fotosentetik bakteri kültürü olarak listelenen ürün; güncel 51 ürünlük mağaza kataloğunda fiziksel paket sayfası doğrulanamadı."],
  ],"2026-10-25"),
  ...products("Shrimps Forever","water_conditioner",shrimpsForeverLegacySource,[
    ["TapFix — önceki portföy","Üreticinin önceki resmî portföyünde klor ve ağır metal düzenleyicisi olarak listelenen ürün; güncel mağazada fiziksel paket sayfası doğrulanamadı."],
    ["Powder GH+ 1 kg — önceki portföy","Üreticinin önceki resmî portföyünde 1 kg GH+ paketi olarak listelenen ürün; güncel mağaza kataloğunda fiziksel ürün sayfası doğrulanamadı."],
    ["Shrimp Mineral (Montmorillonite) — önceki portföy","Üreticinin önceki resmî portföyünde montmorillonit mineral desteği olarak listelenen ürün; güncel mağazada fiziksel paket sayfası doğrulanamadı."],
    ["FLY Breeding Aid — önceki portföy","Üreticinin önceki resmî portföyünde üreme dönemi mineral/kondisyon desteği olarak listelenen ürün; güncel mağazada fiziksel paket sayfası doğrulanamadı."],
  ],"2026-10-25"),
  ...masterLineProducts("fertilizer",[
    ["masterline-i","MasterLine I","Mikro element gübresi; günlük 1 ml / 30 L doz 0,07 ppm Fe sağlar. MasterLine II ve Carbo ile ayrı dozlanır; UV kullanılıyorsa üreticinin talimatı dışında miktar artırılmaz."],
    ["masterline-ii","MasterLine II","N, P, K ve Mg içeren makro gübre; günlük 1 ml / 30 L doz 1,2 ppm NO3, 0,2 ppm PO4, 1,6 ppm K ve 0,12 ppm Mg sağlar. Yüzde 50'den büyük su değişimi sonrası üretici üç kat doz önerir."],
    ["masterline-carbo","Carbo","Glutaraldehit içeren sıvı organik karbon desteği; yalnız günlük 1 ml / 30 L, ışık açılmadan hemen önce veya sonra ve canlı/bitkiden uzakta güçlü akıntıya dozlanır. Aşırı doz uygulanmaz ve basınçlı CO2 ölçümünün yerine geçmez."],
    ["masterline-all-in-one-boost","All In One Boost","Hızlı büyüyen yoğun bitkili tanklar için mikro ve makro elementli tam gübre; günlük 1 ml / 30 L doz 1,5 ppm NO3, 0,2 ppm PO4, 1,5 ppm K, 0,12 ppm Mg ve 0,09 ppm Fe sağlar."],
    ["masterline-all-in-one-golden","All In One Golden","Zor türler dahil bitkili akvaryumlar için orta büyüme hızına yönelik tam gübre; günlük 1 ml / 30 L doz 1 ppm NO3, 0,15 ppm PO4, 1 ppm K, 0,1 ppm Mg ve 0,07 ppm Fe sağlar."],
    ["masterline-all-in-one-lean","All In One Lean","Az veya yavaş büyüyen bitkili/yarışma tanklarına yönelik düşük besinli tam gübre; günlük 1 ml / 30 L doz 0,6 ppm NO3, 0,1 ppm PO4, 0,8 ppm K, 0,08 ppm Mg ve 0,045 ppm Fe sağlar."],
    ["masterline-all-in-one-red","All In One Red","Nitrat içermeyen, canlı yükü yüksek veya besince zengin tabanlı tanklara yönelik tam gübre; günlük 1 ml / 30 L doz 0,1 ppm PO4, 1,2 ppm K, 0,1 ppm Mg ve 0,04 ppm Fe sağlar. Üretici nitratın 5–10 ppm aralığında tutulmasını ister."],
    ["masterline-nitrate","Nitrate","Nitrat ve potasyum desteği; gereksinim ölçülerek 1 ml / 30 L ile 1 ppm NO3 ve 0,63 ppm K eklenir. Üreticinin 5 ppm altına düşürmeme önerisi test sonucuna göre uygulanır."],
    ["masterline-phosphate","Phosphate","Fosfat ve potasyum desteği; gereksinim ölçülerek 1 ml / 30 L ile 0,5 ppm PO4 ve 0,2 ppm K eklenir. Aktif tabanların fosfatı tutabileceği dikkate alınır."],
    ["masterline-potassium","Potassium","Nitrat veya fosfat eklemeden potasyum sağlayan tek elementli gübre; gereksinim ölçülerek 1 ml / 30 L ile 1 ppm K eklenir."],
    ["masterline-iron","Iron","Yüzde 0,3 DTPA şelatlı demir çözeltisi; gereksinim ölçülerek 1 ml / 30 L ile 0,1 ppm Fe eklenir. Üretici 0,05–0,1 ppm altına düşürmemeyi önerir."],
    ["masterline-root-caps","Root Caps","Mikro ve makro besinleri kök bölgesine yavaş salan kapsül; kapsüller yaklaşık 15 cm arayla tabana derin yerleştirilir, yaklaşık dört ayda yenilenir ve gereken miktar üç haftaya yayılarak eklenir."],
    ["masterline-rootmax","RootMAX","Organik mikro/makro besin, humik/fulvik asit, aminoasit ve enzim içeren pelet; yeni kurulumda 50 L için 100 ml tabana yayılıp 4–5 cm örtülür, çalışan tankta bitki grubu başına 4–5 pelet derine yerleştirilir."],
  ]),
  ...masterLineProducts("water_conditioner",[
    ["masterline-safe-water","Safe Water","Klor, kloramin ve ağır metalleri nötralize eden musluk suyu düzenleyici; yeni su hacmi için 1 ml / 30 L, yeni akvaryumda ise tüm hacme göre su eklenmeden önce dozlanır."],
    ["masterline-kh-minus","KH Minus","Asit içeren KH/pH düşürücü; 1 ml / 10 L yaklaşık 1 dKH azaltır. KH 3 dKH altına indirilmez, günlük en çok 2 ml / 10 L uygulanır; damla testinden sonra 20–30 saniyede, canlı ve bitkilerden uzakta güçlü akıntıya yavaşça eklenir."],
    ["masterline-gh-plus","GH Plus","RO veya 6 dGH altındaki yumuşak suyu kalsiyum:magnezyum 4:1 ve potasyumla mineralleştirir; yaklaşık 3 g / 15 L GH'yi 6 dGH artırır ve KH'yi değiştirmez. Önce ayrı kapta tamamen çözündürülür."],
    ["masterline-crystal-clear","Crystal Clear","İnce organik parçacıkları mekanik filtrelemeye bağlayan tatlı su berraklaştırıcısı; bulanıklıkta 1 ml / 10 L, yalnız ışık açıkken ve KH en az 2 dKH ise yavaş dozlanır. Haftada iki uygulama aşılmaz; ilk geçici bulanıklık 6–12 saatte açılabilir."],
  ]),
  ...masterLineProducts("filter_media",[
    ["masterline-purity","Purity","Çözünmüş organik maddeleri adsorbe eden yenilenebilir medya; en az 100 ml / 100 L kullanılır. Yüzde 5 çamaşır suyuyla yenileme sonrası iyice durulanıp 24 saat deklorinatörlü suda bekletilir; koku tamamen kaybolmadan filtreye dönmez."],
    ["masterline-filtermax","FilterMAX","Tatlı ve tuzlu suda nitrifikasyon bakterilerine yüzey sağlayan 6–12 mm doğal biyolojik medya; 100 L için 1 L'den azı yeterlidir. Mekanik filtrasyondan sonra yerleştirilir ve filtre 5–6 saatten uzun kapalı bırakılmaz."],
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
  ...aquaminsProducts("fertilizer","Plant/Aqua-POTASFLOW",[
    ["Aqua Potasflow 100 ml","Potasyum yoğun bitki desteği · üretici dozu 100 L için 1 ml · 20 damla = 1 ml"],
    ["Aqua Potasflow 250 ml","Potasyum yoğun bitki desteği · üretici dozu 100 L için 1 ml · kapak 6 ml"],
  ]),
  ...aquaminsProducts("fertilizer","Plant/Aqua-PLANTS-ALL-INCLUDED",["100 ml","250 ml","500 ml","1000 ml"].map((size):[string,string]=>[
    `Aqua Plants All Included ${size}`,
    `Tüm su bitkileri için kapsamlı mineral desteği · haftada 100 L için 5 ml${size === "100 ml" ? " · 20 damla = 1 ml" : " · kapak 6 ml"}`,
  ])),
  ...aquaminsProducts("water_conditioner","Freshwater/Aqua-H2O",["100 ml","250 ml","500 ml","1000 ml","3000 ml"].map((size):[string,string]=>[
    `Aqua H2O ${size}`,
    "Klor, kloramin ve ağır metaller için tatlı/deniz suyu düzenleyici · haftalık veya su değişiminde 100 L için 3 ml; kötü musluk suyunda en çok 12 ml, acil durumda günlük en çok 24 ml · pH'ı değiştirmez",
  ])),
  ...aquaminsProducts("water_conditioner","Freshwater/Aqua-PRODUCTIVE-AQUA-CLEANER",["100 ml","250 ml","500 ml","1000 ml","3000 ml"].map((size):[string,string]=>[
    `Aqua Productive Aqua Cleaner ${size}`,
    "Tatlı ve deniz suyunda askıdaki küçük parçacıkları filtrelenebilir kümeler hâline getiren berraklaştırıcı · akıntılı bölgeye 100 L için 5 ml · iki uygulama arasında en az iki gün",
  ])),
  ...aquaminsProducts("bacteria","Freshwater/Aqua-BACTERIA",["100 ml","250 ml","500 ml","1000 ml"].map((size):[string,string]=>[
    `Aqua Bacteria ${size}`,
    "Tatlı ve deniz suyu için bakteri düzenleyici · ortalama yükte iki günde bir 100 L için 3 ml; günlük en çok 6 ml/100 L ve uzun kullanımda günlük en çok 3 ml/100 L · beyaz bulanıklıkta doz kesilir, oksijen/protein skimmer sürdürülür",
  ])),
  ...aquaminsProducts("water_conditioner","Freshwater/Aqua-MINERALS-PLUS",["100 ml","250 ml"].map((size):[string,string]=>[
    `Aqua Minerals Plus ${size}`,
    "Tropikal tatlı su balıkları ve karidesler için mineral/GH desteği · haftada 100 L için 3 ml · 30 ml/100 L yaklaşık 1 dGH artış sağlar; GH test edilerek kullanılır",
  ])),
  ...aquaminsProducts("water_conditioner","Freshwater/Aqua-STRESS-PREVENTIVE",["100 ml","250 ml","500 ml"].map((size):[string,string]=>[
    `Aqua Stress Preventive ${size}`,
    "Taşıma, canlı ekleme ve bakım sonrası üreticinin stres desteği · olay sırasında 100 L için 10 ml, koruyucu kullanımda haftada 2 ml/100 L · tatlı ve deniz suyu için",
  ])),
  ...aquaminsProducts("treatment","Freshwater/Aqua-ANTI-ALGEA",["100 ml","250 ml","500 ml","1000 ml","3000 ml"].map((size):[string,string]=>[
    `Aqua Anti Algea ${size}`,
    "Tatlı, bitkili, deniz ve resif akvaryumlarında üreticinin yosun kontrol ürünü · sorun çözülene kadar üç günde bir 2 ml/100 L · doz aşılmaz; filtrasyon ve havalandırma açık tutulur; karides, yengeç, mercan, anemon ve hassas balıklarda yarım doz",
  ])),
  ...aquaminsProducts("water_conditioner","Freshwater/Aqua-ANTI-AMMONIA",["100 ml","250 ml","500 ml","1000 ml"].map((size):[string,string]=>[
    `Aqua Anti Ammonia ${size}`,
    "Üreticinin amonyak kontrolü ve su düzenleme ürünü · yeni kurulumda beş gün günlük 2 ml/100 L, ardından haftada 2 ml/100 L; acil durumda günlük en çok 10 ml/100 L · ölçüm ve biyolojik filtrasyonun yerine geçmez",
  ])),
  ...aquaminsProducts("water_conditioner","Freshwater/Aqua-DISCUS",["250 ml","500 ml","1000 ml"].map((size):[string,string]=>[
    `Aqua Discus ${size}`,
    "Diskus ve Güney Amerika balıkları için mineral/GH desteği · haftada 3 ml/100 L · 60 ml/100 L yaklaşık 1 dGH artış sağlar; üretici diskus akvaryumunda 8 dGH üzerine çıkılmamasını belirtir",
  ])),
  ...aquaminsProducts("water_conditioner","Freshwater/Aqua-BETA",[["Aqua Beta 100 ml","Betta balıkları için mineral desteği · yüzde 30 haftalık su değişimi varsayımıyla haftada 20 L için 2 ml · 20 damla = 1 ml"]]),
  ...aquaminsProducts("water_conditioner","Freshwater/Aqua-CICHLED",["100 ml","250 ml"].map((size):[string,string]=>[
    `Aqua Cichled ${size}`,
    "Afrika cikletleri için mineral/GH desteği · Tanganyika'da haftada 6 ml/100 L ve 15–20 dGH; Malawi/Victoria'da haftada 3 ml/100 L ve 10–15 dGH · 20 ml/100 L yaklaşık 1 dGH artış sağlar",
  ])),
  ...aquaminsProducts("treatment","Freshwater/Aqua-ICHYTO",[["Aqua Ichtyo 100 ml","Metilen mavisi, kristal viyole ve mineralli üretici bakım ürünü · günde bir kez 10 ml/20 L, 3–4 gün · önerilen doz aşılmaz; veteriner teşhisinin yerine geçmez"]]),
  ...aquaminsProducts("treatment","Freshwater/Aqua-NUTRIFISH.html",["100 ml","500 ml"].map((size):[string,string]=>[
    `Aqua Nutrifish ${size}`,
    "Üreticinin bakteri/mantar belirtileri ve yüzgeç hasarı için sunduğu bakım ürünü · günde bir kez 10 ml/20 L, 3–4 gün · önerilen doz aşılmaz; veteriner teşhisinin yerine geçmez",
  ])),
  ...aquaminsProducts("water_conditioner","Saltwater/Aqua-KH",["250 ml","500 ml","1000 ml","3000 ml"].map((size):[string,string]=>[
    `Aqua KH ${size}`,
    "Deniz akvaryumunda alkalinite/KH desteği · testten sonra tek seferde en çok 10 ml/100 L · 10 ml/100 L yaklaşık 1 dKH artış sağlar",
  ])),
  ...aquaminsProducts("water_conditioner","Saltwater/Aqua-CALCIUM",["250 ml","500 ml","1000 ml","3000 ml"].map((size):[string,string]=>[
    `Aqua Calcium ${size}`,
    "Resif sistemleri için kalsiyum desteği · günlük en çok 20 ml/100 L · 1 ml/100 L yaklaşık 1,5 ppm artış sağlar; tüketim testlerle belirlenir",
  ])),
  ...aquaminsProducts("water_conditioner","Saltwater/Aqua-MAGNESIUM",["250 ml","500 ml","1000 ml","3000 ml"].map((size):[string,string]=>[
    `Aqua Magnesium ${size}`,
    "Resif sistemleri için magnezyum desteği · günlük en çok 20 ml/100 L · 1 ml/100 L yaklaşık 1 ppm artış sağlar; tüketim testlerle belirlenir",
  ])),
  ...aquaminsProducts("water_conditioner","Saltwater/Aqua-PASIFIC-SEA-SALT",[["Aqua Pasific Sea Salt 25 kg","Doğal deniz tuzundan katkısız deniz akvaryumu tuzu · 33,5 ppt için 1 L RO suyuna 34 g · hazırlanmış su canlıların üzerine doğrudan dökülmez · üretici aralığı 9,03–9,8 dKH, 410–430 ppm Ca, 1260–1290 ppm Mg"]]),
  ...aquaminsProducts("water_conditioner","Saltwater/Aqua-PASIFIC-CORAL-SALT",[["Aqua Pasific Coral Salt 25 kg","Resif akvaryumu tuzu · 33,5 ppt için 1 L RO suyuna 34 g · hazırlanmış su canlıların üzerine doğrudan dökülmez · üretici aralığı 8,3–8,8 dKH, 420–435 ppm Ca, 1340–1380 ppm Mg"]]),
  ...aquaminsProducts("water_conditioner","Saltwater/Aqua-PH-PLUS",["500 ml","1000 ml","3000 ml"].map((size):[string,string]=>[
    `Aqua pH Plus ${size}`,
    "Tatlı ve deniz suyunda pH/KH yükseltici · hedefe kadar günlük 10 ml/100 L, tek seferde önerilen dozun iki katı aşılmaz · Tanganyika su hazırlığında 4 ml/10 L, Malawi/Victoria'da 2 ml/10 L",
  ])),
  ...aquaminsProducts("water_conditioner","Saltwater/Aqua-PH-REDUCE",["100 ml","250 ml"].map((size):[string,string]=>[
    `Aqua pH Reduce ${size}`,
    "pH düşürücü · hedefe kadar günlük 5 ml/100 L, önerilen dozun iki katı aşılmaz · düzenli test ve pH kararlılığı için 4–8,3 dKH aralığı üretici tavsiyesidir",
  ])),
  ...aquaminsProducts("fertilizer","Pond/Aqua-POND-PLANTS-ALL-INCLUDED",[["Aqua Pond Plants All Included 3000 ml","Süs havuzu bitkileri için kapsamlı mineral desteği · haftada 5 ml/1000 L · kapak 30 ml"]]),
  ...aquaminsProducts("bacteria","Pond/Aqua-POND-BACTERIA-REGULATOR",[["Aqua Pond Bacteria Regulator 3000 ml","Havuz için bakteri düzenleyici · iki günde bir 3 ml/100 L; günlük en çok 6 ml/100 L ve uzun kullanımda günlük en çok 3 ml/100 L · beyaz bulanıklıkta kullanım durdurulur ve oksijenlendirme sürdürülür"]]),
  ...aquaminsProducts("treatment","Pond/Aqua-POND-ANTI-ALGEA",[["Aqua Pond Anti Algea 3000 ml","Balık ve bitki içeren süs havuzları için üreticinin yosun kontrol ürünü · üç günde bir 20 ml/1000 L · doz aşılmaz, filtrasyon/havalandırma açık tutulur; hassas canlılarda yarım doz"]]),
  ...aquaminsProducts("water_conditioner","Pond/Aqua-POND-STRESS-PREVENTIVE",[["Aqua Pond Stress Preventive 3000 ml","Havuz balıklarında taşıma, canlı ekleme ve bakım sonrası üretici stres desteği · olay sırasında 25 ml/1000 L, mevcut streste iki katı; koruyucu kullanımda haftada 5 ml/1000 L"]]),
  ...aquaminsProducts("water_conditioner","Pond/Aqua-POND-MINERAL-PLUS",[["Aqua Pond Mineral Plus 3000 ml","Süs havuzu için mineral/GH desteği · haftada 5 ml/1000 L · 300 ml/1000 L yaklaşık 1 dGH artış sağlar; GH test edilerek kullanılır"]]),
  ...aquaminsProducts("water_conditioner","Pond/Aqua-POND-ANTI-AMMONIA",[["Aqua Pond Anti Ammonia 3000 ml","Havuz için üreticinin amonyak kontrol ürünü · yeni kurulumda ilk üç ay günlük 10 ml/1000 L, ardından haftada 5 ml/1000 L; acil durumda günlük en çok 100 ml/1000 L · ölçüm ve biyolojik filtrasyonun yerine geçmez"]]),
  ...aquaminsProducts("water_conditioner","Pond/Aqua-POND-PRODUCTIVE-AQUA",[["Aqua Pond Productive Aqua 3000 ml","Havuzda askıdaki parçacıkları filtrelenebilir kümeler hâline getiren berraklaştırıcı · akıntılı bölgeye 25 ml/1000 L · iki uygulama arasında en az iki gün"]]),
  ...aquaminsProducts("substrate","Sand/Aqua-CALIFORNIA-BLACK-SAND",[["Aqua California Black Sand 25 kg","GH, KH ve pH değerlerini değiştirmeyen doğal siyah kum · keskin olmayan taneler · kullanım öncesi iyice durulanır"]]),
  ...aquaminsProducts("substrate","Sand/Aqua-WHITE-SAND",[["Aqua White Sand 25 kg","Yüzde 99 kalsiyum karbonat içeren doğal beyaz kum · sertliği ve pH'ı yükseltip 8,1–8,4 yönünde tamponlayabilir; yalnız yüksek pH isteyen sistemler için · kullanım öncesi durulanır"]]),
  ...products("Aquamins","water_conditioner",aquaminsRetailSource,[["Aqua Beta 30 ml (yerel perakende varyantı)","Betta akvaryumları için mineral desteği · üreticinin resmî aile sayfası yalnız 100 ml ambalaj yayımlar; 30 ml varyantı Türkiye perakende kataloğundan doğrulanmıştır"]],"2026-10-26"),
  ...products("Aquamins","treatment",aquaminsRetailSource,[
    ["Aqua Nutrifish 30 ml (yerel perakende varyantı)","Üreticinin resmî sayfası 100 ve 500 ml ambalaj yayımlar; 30 ml varyantı Türkiye perakende kataloğundan doğrulanmıştır · veteriner teşhisinin yerine geçmez"],
    ["Aqua Ichtyo 30 ml (yerel perakende varyantı)","Üreticinin resmî sayfası yalnız 100 ml ambalaj yayımlar; 30 ml varyantı Türkiye perakende kataloğundan doğrulanmıştır · veteriner teşhisinin yerine geçmez"],
  ],"2026-10-26"),
  ...products("Aquamins","substrate",aquaminsRetailSource,[
    ["California Black Sand 1,5 mm 10 kg","Türkiye perakende kataloğundaki 1,5 mm siyah kum varyantı · resmî ürün ailesi GH, KH ve pH değerlerini değiştirmediğini ve keskin olmadığını belirtir"],
    ["California Black Sand 1,5 mm 20 kg","Türkiye perakende kataloğundaki 1,5 mm siyah kum varyantı · resmî ürün ailesi GH, KH ve pH değerlerini değiştirmediğini ve keskin olmadığını belirtir"],
    ["California Black Sand 3,5 mm 10 kg","Türkiye perakende kataloğundaki 3,5 mm siyah kum varyantı · resmî ürün ailesi GH, KH ve pH değerlerini değiştirmediğini ve keskin olmadığını belirtir"],
    ["California Black Sand 3,5 mm 20 kg","Türkiye perakende kataloğundaki 3,5 mm siyah kum varyantı · resmî ürün ailesi GH, KH ve pH değerlerini değiştirmediğini ve keskin olmadığını belirtir"],
    ["White Sand 0,5 mm 10 kg","Türkiye perakende kataloğundaki 0,5 mm beyaz kum varyantı · kalsiyum karbonatlı resmî ürün ailesi pH'ı 8,1–8,4 yönünde tamponlayabilir"],
    ["White Sand 0,5 mm 20 kg","Türkiye perakende kataloğundaki 0,5 mm beyaz kum varyantı · kalsiyum karbonatlı resmî ürün ailesi pH'ı 8,1–8,4 yönünde tamponlayabilir"],
    ["White Sand 1,5 mm 10 kg","Türkiye perakende kataloğundaki 1,5 mm beyaz kum varyantı · kalsiyum karbonatlı resmî ürün ailesi pH'ı 8,1–8,4 yönünde tamponlayabilir"],
    ["White Sand 1,5 mm 20 kg","Türkiye perakende kataloğundaki 1,5 mm beyaz kum varyantı · kalsiyum karbonatlı resmî ürün ailesi pH'ı 8,1–8,4 yönünde tamponlayabilir"],
    ["Silis Kumu 0,5 mm 10 kg","Türkiye perakende kataloğunda doğrulanan ince taneli doğal silis kumu"],
    ["Silis Kumu 1,5 mm 10 kg","Türkiye perakende kataloğunda doğrulanan 1,5 mm silis kumu"],
    ["Lav Taşı Kırığı 0,5 cm 12 kg","Türkiye perakende kataloğunda doğrulanan yaklaşık 0,5 cm gözenekli lav taşı kırığı"],
    ["Lav Taşı Kırığı 0,5–1,5 cm 12 kg","Türkiye perakende kataloğunda doğrulanan 0,5–1,5 cm gözenekli lav taşı kırığı"],
  ],"2026-10-26"),
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
    id:"dophin-12-bottom-feeder",brand:"Dophin",model:"12# Bottom Feeder",category:"food",
    description:"Dipten beslenen balıklar için hazırlanmış yem · üretici dengeli beslenme, multivitamin ve mineral desteği sunduğunu; renk, sindirim ve sağlıklı büyümeyi desteklemeyi hedeflediğini belirtir · paket ağırlığı ve besleme miktarı yayımlanmamıştır",
    sourceUrl:"https://www.qimeigroup.com/Products_detail/1454470042752802816.html",verifiedAt:"2026-10-26",
  },
  {
    id:"dophin-11-goldfish-flake",brand:"Dophin",model:"11# Goldfish Flake",category:"food",
    description:"Japon balıkları için özel pul yem · renk desteği için doğal astaksantin ve sindirilebilir deniz proteini kaynağı olarak krill hidrolizatı içerdiği belirtilir · paket ağırlığı ve besleme miktarı yayımlanmamıştır",
    sourceUrl:"https://www.qimeigroup.com/Products_detail/1454469807930499072.html",verifiedAt:"2026-10-26",
  },
  {
    id:"dophin-10-algae-wafers",brand:"Dophin",model:"10# Algae Wafers",category:"food",
    description:"Dipten beslenen ve alg tüketen balıkların çoğu için vitaminlerle desteklenmiş wafer yem · suyu emerek kolayca yumuşayan biçimdedir · üreticinin dayanıklılık ve bağışıklık ifadeleri hastalık tedavisi değildir; paket ağırlığı ve besleme miktarı yayımlanmamıştır",
    sourceUrl:"https://www.qimeigroup.com/Products_detail/1454469505823170560.html",verifiedAt:"2026-10-26",
  },
  {
    id:"dophin-9-discus-staple-food",brand:"Dophin",model:"9# Discus Staple Food",category:"food",
    description:"Tüm discus türleri ve seçici beslenen diğer balıklar için temel yem · üretici dengeli beslenme, multivitamin ve mineral desteği sunduğunu; renk, sindirim ve sağlıklı büyümeyi desteklemeyi hedeflediğini belirtir · paket ağırlığı ve besleme miktarı yayımlanmamıştır",
    sourceUrl:"https://www.qimeigroup.com/Products_detail/160.html",verifiedAt:"2026-10-26",
  },
  {
    id:"dophin-7-turtle-stick",brand:"Dophin",model:"7# Turtle Stick",category:"food",
    description:"Tüm kaplumbağa ve reptil türleri için stick yem · üretici yüksek kaliteli protein ve yüksek kalsiyum içerdiğini, kalsiyumun sağlıklı kabuk gelişimi için önemli olduğunu belirtir · kesin kalsiyum oranı ve besleme miktarı yayımlanmamıştır; tek başına veteriner değerlendirmesinin yerine geçmez",
    sourceUrl:"https://www.qimeigroup.com/Products_detail/159.html",verifiedAt:"2026-10-26",
  },
  {
    id:"dophin-6-red-parrot-pellet",brand:"Dophin",model:"6# Red Parrot Pellet",category:"food",
    description:"Red parrot, cikletler ve diğer balıklar için pelet yem · üretici dengeli beslenme, multivitamin ve mineral desteği sunduğunu; renk, sindirim ve sağlıklı büyümeyi desteklemeyi hedeflediğini belirtir · paket ağırlığı ve besleme miktarı yayımlanmamıştır",
    sourceUrl:"https://www.qimeigroup.com/Products_detail/1454442684847005696.html",verifiedAt:"2026-10-26",
  },
  {
    id:"dophin-5-spirulina-flake",brand:"Dophin",model:"5# Spirulina Flake",category:"food",
    description:"Üreticinin tüm balıklar için sunduğu spirulinalı pul yem · dengeli beslenme, multivitamin ve mineral desteğiyle renk, sindirim ve sağlıklı büyümeyi desteklemeyi hedefler · spirulina oranı, paket ağırlığı ve besleme miktarı yayımlanmamıştır",
    sourceUrl:"https://www.qimeigroup.com/Products_detail/158.html",verifiedAt:"2026-10-26",
  },
  {
    id:"dophin-4-goldfish-pellet",brand:"Dophin",model:"4# Goldfish Pellet",category:"food",
    description:"Japon balıkları için özel pelet yem · renk desteği için doğal astaksantin ve sindirilebilir deniz proteini kaynağı olarak krill hidrolizatı içerdiği belirtilir · paket ağırlığı ve besleme miktarı yayımlanmamıştır",
    sourceUrl:"https://www.qimeigroup.com/Products_detail/157.html",verifiedAt:"2026-10-26",
  },
  {
    id:"dophin-3-basic-flake",brand:"Dophin",model:"3# Basic Flake",category:"food",
    description:"Tropikal balıklar ve Japon balıkları, özellikle küçük veya iştahı zayıf süs balıkları için tam ve dengeli günlük pul yem · paket ağırlığı ve besleme miktarı yayımlanmamıştır",
    sourceUrl:"https://www.qimeigroup.com/Products_detail/1454441770614562816.html",verifiedAt:"2026-10-26",
  },
  {
    id:"dophin-15-psb-200ml",brand:"Dophin",model:"15# PSB 200 ml",category:"bacteria",
    description:"Üreticinin su ve tabandaki organik maddeler, nitrit, nitrat ve toksik hidrojen sülfürü parçalamaya yardımcı olduğunu belirttiği PSB ürünü · içerik türleri, canlı yoğunluğu ve doz yayımlanmamıştır; biyolojik döngü, su testi ve uygun su değişiminin yerine geçmez",
    sourceUrl:"https://www.qimeigroup.com/Products_detail/dophin-water-treatment-PSB.html",verifiedAt:"2026-10-26",
  },
  {
    id:"dophin-aquacare-tablets-500g",brand:"Dophin",model:"Aquacare Tablets 500 g",category:"water_conditioner",
    description:"Üreticinin suyu yumuşatma, bakteri ve kokuyu baskılama ile ozmotik dengeyi düzenleme amacıyla sunduğu tablet ürün · etken maddeler, tablet adedi, doz ve hedef su değerleri yayımlanmamıştır; GH, KH ve pH ölçülmeden kullanılmamalı ve hastalık tedavisi/dezenfeksiyon yerine geçmemelidir",
    sourceUrl:"https://www.qimeigroup.com/Products_detail/dophin-aquacare-tablets.html",verifiedAt:"2026-10-26",
  },
  {
    id:"dophin-14-nitrifying-bacteria-200ml",brand:"Dophin",model:"14# 14 In 1 Nitrifying Bacteria 200 ml",category:"bacteria",
    description:"Nitrifikasyon bakterilerinin gelişimini ve özellikle yeni filtrasyon sisteminin kurulmasını desteklemek üzere sunulan bakteri ürünü · bakteri türleri, canlı yoğunluğu ve doz yayımlanmamıştır; akvaryum döngüsünü, amonyak/nitrit testini ve kademeli canlı eklemeyi ikame etmez",
    sourceUrl:"https://www.qimeigroup.com/Products_detail/94.html",verifiedAt:"2026-10-26",
  },
  {
    id:"dophin-11-black-water-special-200ml",brand:"Dophin",model:"11# Black Water Special 200 ml",category:"water_conditioner",
    description:"Üreticinin hümik içerik ve vitaminlerle doğal su ortamını taklit etmek, renklenmeyi desteklemek ve yeni suyu olgunlaştırmak amacıyla sunduğu blackwater ürünü · içerik miktarı, doz ve beklenen pH/KH değişimi yayımlanmamıştır; tür gereksinimi doğrulanıp pH ve KH ölçülerek kullanılmalıdır",
    sourceUrl:"https://www.qimeigroup.com/Products_detail/1449428389637808128.html",verifiedAt:"2026-10-26",
  },
  {
    id:"dophin-1-anti-chlorine-special-200ml",brand:"Dophin",model:"1# Anti-Chlorine Special 200 ml",category:"water_conditioner",
    description:"Yeni eklenen musluk suyundaki kloru nötralize etmek ve su koşullarını iyileştirmek üzere sunulan düzenleyici · üretici ayrıca sudaki zararlı gazları giderme iddiası yayımlar; etken madde ve doz verilmediğinden klor/kloramin ayrımı ile kullanım miktarı etiketten doğrulanmalı, mümkünse artık klor test edilmelidir",
    sourceUrl:"https://www.qimeigroup.com/Products_detail/1449422529111908352.html",verifiedAt:"2026-10-26",
  },
  {
    id:"dophin-2-anti-white-spot-special-200ml",brand:"Dophin",model:"2# Anti-White Spot Special 200 ml",category:"treatment",
    description:"Üreticinin balıklardaki beyaz benek ve mantar benzeri lekeler için sunduğu bakım/tedavi ürünü · etken madde, doz, tedavi süresi, hedef patojen ve hassas canlı kontrendikasyonları yayımlanmamıştır; belirtiler kesin tanı değildir ve ürün profesyonel/veteriner değerlendirmesinin yerine geçmez",
    sourceUrl:"https://www.qimeigroup.com/Products_detail/1449422937164242944.html",verifiedAt:"2026-10-26",
  },
  {
    id:"dophin-7-cloudiness-remover-special-200ml",brand:"Dophin",model:"7# Cloudiness Remover Special 200 ml",category:"water_conditioner",
    description:"Üreticinin alg gelişimini önleme ve akvaryum bulanıklığını 24 saat içinde berraklaştırma iddiasıyla sunduğu ürün · etken madde ve doz yayımlanmadığından süre garantisi verilemez; amonyak/nitrit testi, filtrasyon, oksijenlendirme ve bulanıklığın kök nedenini düzeltmenin yerine geçmez",
    sourceUrl:"https://www.qimeigroup.com/Products_detail/93.html",verifiedAt:"2026-10-26",
  },
  {
    id:"dophin-4-gill-fungus-parasite-special-200ml",brand:"Dophin",model:"4# Gill, Fungus Parasite Special 200 ml",category:"treatment",
    description:"Üreticinin solungaç hastalığı, mantar, deri/solungaç parazitleri, kelebek ve çapa kurdu gibi tablolar için sunduğu bakım/tedavi ürünü · etken madde, doz, süre ve hassas canlı kontrendikasyonları yayımlanmamıştır; mikroskobik veya veteriner tanı olmadan kesin tedavi olarak sunulmaz",
    sourceUrl:"https://www.qimeigroup.com/Products_detail/92.html",verifiedAt:"2026-10-26",
  },
  ...products("Dophin","treatment","https://www.qimeigroup.com/Products_detail/91.html",[
    ["3# General Aid Special 100 ml","Üreticinin beyaz benek, yara, yüzgeç/kuyruk çürümesi ile ağız ve vücut mantarı gibi yaygın belirtiler için sunduğu genel bakım/tedavi ürünü · etken madde, doz, süre ve hassas canlı kontrendikasyonları yayımlanmamıştır; belirtiler kesin tanı değildir ve profesyonel/veteriner değerlendirmesinin yerine geçmez"],
    ["3# General Aid Special 200 ml","Üreticinin beyaz benek, yara, yüzgeç/kuyruk çürümesi ile ağız ve vücut mantarı gibi yaygın belirtiler için sunduğu genel bakım/tedavi ürünü · etken madde, doz, süre ve hassas canlı kontrendikasyonları yayımlanmamıştır; belirtiler kesin tanı değildir ve profesyonel/veteriner değerlendirmesinin yerine geçmez"],
  ],"2026-10-26"),
  {
    id:"dophin-5-anti-parasite-special-200ml",brand:"Dophin",model:"5# Anti-Parasite Special 200 ml",category:"treatment",
    description:"Üreticinin yaygın parazitler ile vücut, ağız ve yüzgeç çürümesi için sunduğu ve ayrıca virüs iddiası taşıyan bakım/tedavi ürünü · etken madde, doz, hedef organizma ve kanıt yayımlanmadığından virüs veya parazit tedavisi garanti edilmez; profesyonel/veteriner tanı ve tür güvenliği doğrulaması gerekir",
    sourceUrl:"https://www.qimeigroup.com/Products_detail/1449425245134544896.html",verifiedAt:"2026-10-26",
  },
  {
    id:"dophin-6-green-away-200ml",brand:"Dophin",model:"6# Green Away 200 ml",category:"treatment",
    description:"Alg gelişimini durdurmak üzere sunulan ürün · üretici etken madde, doz ve bitki, karides, salyangoz veya biyolojik filtre güvenliğini yayımlamamıştır; otomatik doz önerilmez ve ışık, besin, bakım ile su değerleri gibi kök nedenleri düzeltmenin yerine geçmez",
    sourceUrl:"https://www.qimeigroup.com/Products_detail/1449425452474687488.html",verifiedAt:"2026-10-26",
  },
  {
    id:"dophin-8-fish-stabilizer-100ml",brand:"Dophin",model:"8# Fish Stabilizer 100 ml",category:"treatment",
    description:"Üreticinin özellikle büyük balıkları taşıma veya küçük müdahaleler sırasında stabilize etmek amacıyla sunduğu ürün · etken madde, sedasyon düzeyi, doz, maruz kalma süresi ve geri kazanım protokolü yayımlanmamıştır; otomatik tavsiye edilmez ve yalnız sucul veteriner/profesyonel gözetiminde değerlendirilmelidir",
    sourceUrl:"https://www.qimeigroup.com/Products_detail/1449427902300545024.html",verifiedAt:"2026-10-26",
  },
  ...dophinTankProducts("tank","https://www.qimeigroup.com/Products_detail/dophin-plastic-betta-tanks.html",[
    ["BT-104 Plastic Betta Tank",1.6,"Yüksek şeffaflıklı plastik tank · Betta adı tek başına uygunluk kanıtı değildir; 1,6 L hacim AquaMind'in doğrulanmış tek Betta için en az 20 L bakım profilinin altındadır"],
    ["BT-105 Plastic Betta Tank",0.5,"Yüksek şeffaflıklı plastik tank · Betta adı tek başına uygunluk kanıtı değildir; 0,5 L hacim AquaMind'in doğrulanmış tek Betta için en az 20 L bakım profilinin altındadır"],
    ["T-101 Plastic Betta Tank · Blue Light",1.4,"Mavi ışıklı, yüksek şeffaflıklı plastik tank · Betta adı tek başına uygunluk kanıtı değildir; 1,4 L hacim AquaMind'in doğrulanmış tek Betta için en az 20 L bakım profilinin altındadır"],
    ["T-201 Plastic Betta Tank · Changeable Light",1.4,"Değiştirilebilir ışıklı, yüksek şeffaflıklı plastik tank · Betta adı tek başına uygunluk kanıtı değildir; 1,4 L hacim AquaMind'in doğrulanmış tek Betta için en az 20 L bakım profilinin altındadır"],
    ["T-102 Plastic Betta Tank",0.9,"Yüksek şeffaflıklı plastik tank · Betta adı tek başına uygunluk kanıtı değildir; 0,9 L hacim AquaMind'in doğrulanmış tek Betta için en az 20 L bakım profilinin altındadır"],
  ]),
  ...dophinTankProducts("aquarium_set","https://www.qimeigroup.com/Products_detail/dophin-plastic-betta-tank-bt111-bt112.html",[
    ["BT111 Betta Tank Kit",5.2,"Şeffaf tank, filtreleme sistemi ve 12 V trafolu LED ışık içeren 3'ü 1 arada set · 5,2 L hacim AquaMind'in doğrulanmış tek Betta için en az 20 L bakım profilinin altındadır; ürün adı uygunluk kanıtı değildir"],
    ["BT112 Betta Tank Kit",5.2,"Şeffaf tank, filtreleme sistemi ve 12 V trafolu LED ışık içeren 3'ü 1 arada set · 5,2 L hacim AquaMind'in doğrulanmış tek Betta için en az 20 L bakım profilinin altındadır; ürün adı uygunluk kanıtı değildir"],
  ]),
  ...dophinTankProducts("aquarium_set","https://www.qimeigroup.com/Products_detail/dophin-plastic-betta-tank-bt119-bt120.html",[
    ["BT119 2 In 1 Betta Tank Kit",7,"Tank, filtreleme sistemi, LED ışık, 5 V USB besleme ve kolay su değişim sistemi içeren balık/bitki seti · 7 L hacim AquaMind'in doğrulanmış tek Betta için en az 20 L bakım profilinin altındadır; ürün adı uygunluk kanıtı değildir"],
    ["BT120 2 In 1 Betta Tank Kit",10,"Tank, filtreleme sistemi, LED ışık, 5 V USB besleme ve kolay su değişim sistemi içeren balık/bitki seti · 10 L hacim AquaMind'in doğrulanmış tek Betta için en az 20 L bakım profilinin altındadır; ürün adı uygunluk kanıtı değildir"],
  ]),
  ...dophinTankProducts("tank","https://www.qimeigroup.com/Products_detail/dophin-plastic-tank-set.html",[
    ["PT 100 mm Plastic Tank",0.7,"Üreticinin PT100 plastik tank serisindeki 100 mm seçeneği · balık veya omurgasız bakım uygunluğu yalnız hacimden çıkarılamaz"],
    ["PT 180 mm Plastic Tank",1.3,"Üreticinin PT100 plastik tank serisindeki 180 mm seçeneği · balık veya omurgasız bakım uygunluğu yalnız hacimden çıkarılamaz"],
    ["PT 230 mm Plastic Tank",3.5,"Üreticinin PT100 plastik tank serisindeki 230 mm seçeneği · balık veya omurgasız bakım uygunluğu yalnız hacimden çıkarılamaz"],
    ["PT 300 mm Plastic Tank",7.5,"Üreticinin PT100 plastik tank serisindeki 300 mm seçeneği · balık veya omurgasız bakım uygunluğu yalnız hacimden çıkarılamaz"],
    ["PT 380 mm Plastic Tank",17,"Üreticinin PT100 plastik tank serisindeki 380 mm seçeneği · balık veya omurgasız bakım uygunluğu yalnız hacimden çıkarılamaz"],
  ]),
  ...dophinTankProducts("tank","https://www.qimeigroup.com/Products_detail/dophin-nano-glass-aquarium-gt6001.html",[
    ["GT-6001 Glass Tank · Silver",15,"Düz panelli cam tank · gümüş renkli çerçeve ve plastik köşe koruyucuları"],
    ["GT-6001 Glass Tank · Black",15,"Düz panelli cam tank · siyah renkli çerçeve ve plastik köşe koruyucuları"],
    ["GT-6002 Glass Tank · Silver",18,"Düz panelli cam tank · gümüş renkli çerçeve ve plastik köşe koruyucuları"],
    ["GT-6002 Glass Tank · Black",18,"Düz panelli cam tank · siyah renkli çerçeve ve plastik köşe koruyucuları"],
  ]),
  ...dophinTankProducts("aquarium_set","https://www.qimeigroup.com/Products_detail/dophin-nano-glass-aquarium-kit-gtk6001.html",[
    ["GTK6001 Glass Aquarium Kit · Silver",15,"Düz panelli ve plastik köşe koruyuculu gümüş renkli cam set · KF-160 iç filtre, 10 LED ışık, dijital termometre, 3 inç kepçe, 20 ml klor giderici ve U-20 kale dekoru içerir · sayfadaki GT-6002 tablo etiketi kit modeliyle çeliştiğinden GTK6002 türetilmemiştir"],
    ["GTK6001 Glass Aquarium Kit · Black",15,"Düz panelli ve plastik köşe koruyuculu siyah renkli cam set · KF-160 iç filtre, 10 LED ışık, dijital termometre, 3 inç kepçe, 20 ml klor giderici ve U-20 kale dekoru içerir · sayfadaki GT-6002 tablo etiketi kit modeliyle çeliştiğinden GTK6002 türetilmemiştir"],
  ]),
  ...dophinTankProducts("tank","https://www.qimeigroup.com/Products_detail/dophin-glass-aquarium-set-gt7004.html",[
    ["GT 7001R Round Corner Glass Tank",21,"Yuvarlatılmış köşeli cam tank · 4 mm cam",[30,24,30]],
    ["GT 7002R Round Corner Glass Tank",47,"Yuvarlatılmış köşeli cam tank · 5 mm cam",[45,30,35]],
    ["GT 7003R Round Corner Glass Tank",86,"Yuvarlatılmış köşeli cam tank · 5 mm cam",[60,36,40]],
    ["GT 7001S Square Corner Glass Tank",21,"Düz köşeli cam tank · 4 mm cam",[30,24,30]],
    ["GT 7002S Square Corner Glass Tank",47,"Düz köşeli cam tank · 5 mm cam",[45,30,35]],
    ["GT 7003S Square Corner Glass Tank",86,"Düz köşeli cam tank · 5 mm cam",[60,36,40]],
    ["GTS 7004R Round Corner 3-Tank Bundle",undefined,"GT 7001R, GT 7002R ve GT 7003R seçeneklerini birlikte içeren üretici 3'ü 1 arada paket modeli · tek akvaryum hacmi değildir"],
    ["GTS 7004S Square Corner 3-Tank Bundle",undefined,"GT 7001S, GT 7002S ve GT 7003S seçeneklerini birlikte içeren üretici 3'ü 1 arada paket modeli · tek akvaryum hacmi değildir"],
  ]),
  ...dophinTankProducts("aquarium_set","https://www.qimeigroup.com/Products_detail/dophin-nano-glass-aquarium-kit-gt8001.html",[
    ["GT-8001 Glass Tank Kit",undefined,"Beyaz ve siyah renk seçeneği bulunan 3'ü 1 arada cam set · FC-604 filtreleme sistemi ve LED 105 ışık içerir · üretici bu sayfada akvaryum hacmi veya ölçü yayımlamamıştır"],
  ]),
  ...dophinTankProducts("aquarium_set","https://www.qimeigroup.com/Products_detail/dophin-3-in-1-aquariums-gt8005.html",[
    ["GT-8005 3 In 1 Aquarium",9,"Yüksek verimli LED sistemi, döndürülebilir yemleme kapağı ve cam/ABS gövde",[32.2,16.9,22.2]],
    ["GT-8006 3 In 1 Aquarium",21,"Yüksek verimli LED sistemi, döndürülebilir yemleme kapağı ve cam/ABS gövde",[41,22,28.2]],
    ["GT-8007 3 In 1 Aquarium",40,"Yüksek verimli LED sistemi, döndürülebilir yemleme kapağı ve cam/ABS gövde",[51,27.4,34.6]],
  ]),
  ...dophinTankProducts("aquarium_set","https://www.qimeigroup.com/Products_detail/dophin-glass-aquarium-kit-gts1358.html",[
    ["GTS1358 Glass Aquarium Kit",18,"Dokunmatik düğmeli üç ışık moduna sahip IPX8 LED, geniş üst filtre haznesi, kaba/ince sünger, aktif karbon, seramik halka ve yağmurlama çıkışı içeren cam set"],
    ["GTS1458 Glass Aquarium Kit",32,"Dokunmatik düğmeli üç ışık moduna sahip IPX8 LED, geniş üst filtre haznesi, kaba/ince sünger, aktif karbon, seramik halka ve yağmurlama çıkışı içeren cam set"],
    ["GTS1608 Glass Aquarium Kit",54,"Dokunmatik düğmeli üç ışık moduna sahip IPX8 LED, geniş üst filtre haznesi, kaba/ince sünger, aktif karbon, seramik halka ve yağmurlama çıkışı içeren cam set"],
  ]),
  ...dophinTankProducts("tank","https://www.qimeigroup.com/Products_detail/dophin-glass-aquarium-set-gt3007.html",[
    ["GT 3001R Bent Glass Tank",14.8,"Kavisli ön köşeli cam tank · 4 mm cam",[30,19,26]],
    ["GT 3002R Bent Glass Tank",21,"Kavisli ön köşeli cam tank · 4 mm cam",[35,22,28]],
    ["GT 3003R Bent Glass Tank",31,"Kavisli ön köşeli cam tank · 5 mm cam",[40,26,30]],
    ["GT 3005R Bent Glass Tank",43,"Kavisli ön köşeli cam tank · 5 mm cam",[45,30,32]],
    ["GT 3006R Bent Glass Tank",57,"Kavisli ön köşeli cam tank · 5 mm cam",[50,34,34]],
    ["GT 3001S Straight Glass Tank",14.8,"Düz köşeli cam tank · 4 mm cam",[30,19,26]],
    ["GT 3002S Straight Glass Tank",21,"Düz köşeli cam tank · 4 mm cam",[35,22,28]],
    ["GT 3003S Straight Glass Tank",31,"Düz köşeli cam tank · 5 mm cam",[40,26,30]],
    ["GT 3005S Straight Glass Tank",43,"Düz köşeli cam tank · 5 mm cam",[45,30,32]],
    ["GT 3006S Straight Glass Tank",57,"Düz köşeli cam tank · 5 mm cam",[50,34,34]],
    ["GTS 3004R Bent 3-Tank Bundle",undefined,"Üreticinin GT 3001R, GT 3002R ve GT 3003R satırlarını bir araya getirdiği 3'ü 1 arada paket · tek akvaryum hacmi değildir"],
    ["GTS 3007R Bent 5-Tank Bundle",undefined,"Üreticinin 1+2+3+5+6 olarak yayımladığı beşli kavisli seri paketi · tablo eşlemesi belirsiz olduğundan tek tek içerik veya toplam hacim türetilmemiştir"],
    ["GTS 3004S Straight 3-Tank Bundle",undefined,"Üreticinin GT 3001S, GT 3002S ve GT 3003S satırlarını bir araya getirdiği 3'ü 1 arada paket · tek akvaryum hacmi değildir"],
    ["GTS 3007S Straight 5-Tank Bundle",undefined,"Üreticinin 1+2+3+5+6 olarak yayımladığı beşli düz seri paketi · tablo eşlemesi belirsiz olduğundan tek tek içerik veya toplam hacim türetilmemiştir"],
  ]),
  ...dophinTankProducts("aquarium_set","https://www.qimeigroup.com/Products_detail/dophin-led-bio-aquarium-gt-8009-wholesale.html",[
    ["GT8009 LED Bio-Aquarium",50,"Siyah veya haki renkli cam set · dahili dalgıç pompa, LED ışık, güçlü filtre medyası haznesi, biyolojik şelale çıkışı ve ayrı açılır yemleme kapağı · ısıtıcı isteğe bağlıdır, standart ekipman gibi gösterilmez"],
  ]),
  ...products("Dophin","filter_media","https://cn.qimeigroup.com/Products_detail/1456643731891986432.html",[
    ["FM 901 Activated Carbon 150 g","Üreticinin kutulu serisindeki 150 g aktif karbon filtre medyası · verimli filtrasyon ve nitrifikasyon bakteri sisteminin kurulmasına destek amacıyla sunulur"],
    ["FM 902 Activated Carbon 300 g","Üreticinin kutulu serisindeki 300 g aktif karbon filtre medyası · verimli filtrasyon ve nitrifikasyon bakteri sisteminin kurulmasına destek amacıyla sunulur"],
    ["FM 903 Activated Carbon + Zeolite 200 g","Üreticinin kutulu serisindeki 200 g aktif karbon ve zeolit karışımlı filtre medyası · verimli filtrasyon desteği için sunulur"],
    ["FM 904 Activated Carbon + Zeolite 400 g","Üreticinin kutulu serisindeki 400 g aktif karbon ve zeolit karışımlı filtre medyası · verimli filtrasyon desteği için sunulur"],
    ["FM 905 Ceramic Ring 400 g","Üreticinin kutulu serisindeki 400 g seramik halka filtre medyası · nitrifikasyon bakterileri için yüzey ve verimli filtrasyon desteği sağlar"],
    ["FM 906 Zeolite 400 g","Üreticinin kutulu serisindeki 400 g zeolit filtre medyası · verimli filtrasyon desteği için sunulur"],
    ["FM 907 Infrared Bio Ring 500 g","Üreticinin kutulu serisindeki 500 g infrared biyolojik halka filtre medyası · nitrifikasyon bakteri sisteminin kurulmasına destek amacıyla sunulur"],
    ["FM 908 Bacteria Cultivation Bio Ball 500 g","Üreticinin kutulu serisindeki 500 g bakteri kolonizasyonu amaçlı biyolojik top filtre medyası"],
    ["FM 913 12 In 1 Bio Filter Media 500 g","Üreticinin kutulu serisindeki 500 g, 12'si 1 arada biyolojik filtre medyası · üretici bileşenlerin ayrı listesini yayımlamadığından içerik türetilmez"],
  ],"2026-10-27"),
  ...products("Dophin","filter_media","https://www.qimeigroup.com/Products_detail/1456644414338916352.html",[
    ["Zeolite 1 kg","Üreticinin 1 kg paketli kimyasal filtre medyası · verimli filtrasyonu ve nitrifikasyon bakteri sisteminin kurulmasını desteklemek üzere sunulur"],
    ["Activated Carbon 1 kg","Üreticinin 1 kg paketli aktif karbon filtre medyası · verimli filtrasyonu desteklemek üzere sunulur"],
    ["Ceramic Ring 1 kg","Üreticinin 1 kg paketli seramik halka filtre medyası · nitrifikasyon bakterileri için yüzey ve verimli filtrasyon desteği sağlar"],
  ],"2026-10-26"),
  {
    id:"dophin-gt-8010",brand:"Dophin",model:"GT-8010 Glass Tank Kit",category:"aquarium_set",
    description:"USB beslemeli mini masaüstü cam akvaryum seti · gizli su giriş ve çıkışları · üç arka plan seçeneği · düşük sesli sirkülasyon · temizliği ve bakımı kolaylaştıran modüler tasarım · üretici hacim, ölçü ve dahil ekipman modeli yayımlamıyor",
    sourceUrl:"https://www.qimeigroup.com/Products_detail/Dophinaquariumkit-gt8010.html",verifiedAt:"2026-10-26",
  },
  {
    id:"dophin-mc115",brand:"Dophin",model:"MC115 Cleaner Pump",category:"cleaning",
    description:"Elektriksiz elle çalışan akvaryum temizleyici · su boşaltma, dip atığı çekme ve kum yıkama işlevleri · hortumu sabitleyen ve su akışını ayarlayan kontrol klipsi · elektrikli parça içermediğinden elektrik çarpması riski oluşturmaz",
    sourceUrl:"https://www.qimeigroup.com/Products_detail/210.html",verifiedAt:"2026-10-26",
  },
  ...products("Dophin","decoration","https://www.qimeigroup.com/Products_detail/Dophin-ornament-U-873-U-874.html",[
    ["U-873 Air Bubbler Ornament","Hava motoruna bağlandığında kabarcık üreten, balıklar için güvenli reçine dekor · kolay temizlenebilir · üretici üç tasarım bulunduğunu belirtir ancak tasarım-model eşlemesini yayımlamaz"],
    ["U-874 Air Bubbler Ornament","Hava motoruna bağlandığında kabarcık üreten, balıklar için güvenli reçine dekor · kolay temizlenebilir · üretici üç tasarım bulunduğunu belirtir ancak tasarım-model eşlemesini yayımlamaz"],
  ],"2026-10-26"),
  {
    id:"dophin-u-893",brand:"Dophin",model:"U-893 3D Dinosaur Background",category:"decoration",
    description:"Balıkların geçebildiği içi boş tünellere sahip üç boyutlu dinozor akvaryum arka planı · iç filtreyi gizleyebilen boşluk · balıklar için güvenli, toksik olmayan malzeme",
    sourceUrl:"https://www.qimeigroup.com/Products_detail/211.html",verifiedAt:"2026-10-26",
  },
  {
    id:"dophin-u-894",brand:"Dophin",model:"U-894 3D Rock Stratum Background",category:"decoration",
    description:"Doğal kaya tabakası ve kanyon duvarı görünümü veren üç boyutlu akvaryum arka planı · iç filtre ve ekipmanı gizleyebilen içi boş bölüm · balıklar için güvenli, toksik olmayan ve su kimyasını değiştirmeyen malzeme",
    sourceUrl:"https://www.qimeigroup.com/Products_detail/212.html",verifiedAt:"2026-10-26",
  },
  {
    id:"dophin-u-895",brand:"Dophin",model:"U-895 3D Tree Stump Background",category:"decoration",
    description:"Ağaç kökü ve kaya görünümünü birleştiren üç boyutlu akvaryum arka planı · küçük balık ve karideslerin geçebildiği oyuklar · iç filtre ve ısıtıcıyı gizleyebilen arka bölüm · balıklar için güvenli, toksik olmayan ve su değerlerini değiştirmeyen malzeme",
    sourceUrl:"https://www.qimeigroup.com/Products_detail/213.html",verifiedAt:"2026-10-26",
  },
  {
    id:"dophin-mc112",brand:"Dophin",model:"MC112 Feeding Ring",category:"accessory",
    description:"Vantuzla akvaryum camına tutunan yüzer yemleme halkası · yemi halka içinde toplayarak kontrollü beslemeye yardımcı olur",
    sourceUrl:"https://www.qimeigroup.com/Products_detail/143.html",verifiedAt:"2026-10-26",
  },
  ...products("Dophin","accessory","https://www.qimeigroup.com/Products_detail/127.html",[
    ["BB10 Breeding Box","Çıkarılabilir dalgıç pompa, kablo klipsi, çıkarılabilir kapak ve şeffaf gövde içeren yavruluk · üretici yalnız BB10 varyantında pompa bulunduğunu belirtir"],
    ["BB11 Breeding Box","Kablo klipsi, çıkarılabilir kapak ve şeffaf gövdeli yavruluk · BB10'dan farklı olarak dalgıç pompa içermez"],
  ],"2026-10-26"),
  {
    id:"dophin-bb12",brand:"Dophin",model:"BB12 Breeding Box",category:"accessory",
    description:"Anne balık için yavruluk · yavruların kaçış aralığından alt bölmeye geçmesini sağlar · zayıf balığı ayırmak veya yeni balığı ana akvaryuma eklemeden önce gözlemlemek için de kullanılabilir",
    sourceUrl:"https://www.qimeigroup.com/Products_detail/1452629894539894784.html",verifiedAt:"2026-10-26",
  },
  ...products("Dophin","accessory","https://www.qimeigroup.com/Products_detail/144.html",[
    ["TL20 Acrylic Turtle Ladder","Kaplumbağalar için akrilik tırmanma rampası · saklanma alanı, rahat tırmanma açısı ve güneşlenme platformu · dört vantuzla akvaryum veya terraryuma sabitlenir"],
    ["TL30 Acrylic Turtle Ladder","Kaplumbağalar için akrilik tırmanma rampası · saklanma alanı, rahat tırmanma açısı ve güneşlenme platformu · dört vantuzla akvaryum veya terraryuma sabitlenir"],
    ["TL50 Acrylic Turtle Ladder","Kaplumbağalar için akrilik tırmanma rampası · saklanma alanı, rahat tırmanma açısı ve güneşlenme platformu · dört vantuzla akvaryum veya terraryuma sabitlenir"],
  ],"2026-10-26"),
  ...products("Dophin","accessory","https://www.qimeigroup.com/Products_detail/1453427701631836160.html",[
    ["TL40 Turtle Ladder","Deformasyona dayanıklı plastik kaplumbağa rampası · geniş güneşlenme platformu ve basamaklı kolay tırmanma tasarımı · güçlü vantuzla akvaryuma sabitlenir"],
    ["TL60 Turtle Ladder","Deformasyona dayanıklı plastik kaplumbağa rampası · geniş güneşlenme platformu ve basamaklı kolay tırmanma tasarımı · güçlü vantuzla akvaryuma sabitlenir"],
  ],"2026-10-26"),
  ...products("Dophin","cleaning","https://www.qimeigroup.com/Products_detail/21.html",[
    ["SM001 (S) Magnet Cleaner","3–6 mm cam kalınlığına uygun mıknatıslı akvaryum cam temizleyici"],
    ["SM002 (M) Magnet Cleaner","6–8 mm cam kalınlığına uygun mıknatıslı akvaryum cam temizleyici"],
    ["SM003 (L) Magnet Cleaner","6–8 mm cam kalınlığına uygun mıknatıslı akvaryum cam temizleyici"],
    ["SM004 (XL) Magnet Cleaner","8–12 mm cam kalınlığına uygun mıknatıslı akvaryum cam temizleyici"],
  ],"2026-10-26"),
  ...products("Dophin","cleaning","https://www.qimeigroup.com/Products_detail/22.html",[
    ["FM001 (S) Floating Magnet Cleaner","Üreticinin küçük boy yüzen mıknatıslı akvaryum cam temizleyicisi · uygun cam kalınlığı yayımlanmamıştır"],
    ["FM002 (M) Floating Magnet Cleaner","Üreticinin orta boy yüzen mıknatıslı akvaryum cam temizleyicisi · uygun cam kalınlığı yayımlanmamıştır"],
    ["FM003 (L) Floating Magnet Cleaner","Üreticinin büyük boy yüzen mıknatıslı akvaryum cam temizleyicisi · uygun cam kalınlığı yayımlanmamıştır"],
    ["FM004 (L) Floating Magnet Cleaner","Üreticinin L olarak yayımladığı yüzen mıknatıslı akvaryum cam temizleyicisi · uygun cam kalınlığı yayımlanmamıştır"],
    ["FM005 (XL) Floating Magnet Cleaner","Üreticinin ekstra büyük boy yüzen mıknatıslı akvaryum cam temizleyicisi · uygun cam kalınlığı yayımlanmamıştır"],
  ],"2026-10-26"),
  {
    id:"dophin-aa015",brand:"Dophin",model:"AA015 Check Valve",category:"accessory",
    description:"Akvaryum hava hattı için çekvalf · üretici bağlantı çapı, basınç sınırı veya paket adedi yayımlamıyor",
    sourceUrl:"https://www.qimeigroup.com/Products_detail/79.html",verifiedAt:"2026-10-26",
  },
  ...products("Dophin","accessory","https://www.qimeigroup.com/Products_detail/1456656412703236096.html",[
    ["AA016 PVC Tubing · 25 m · 9/12 mm","Yeşil veya beyaz renkte yumuşak PVC su hortumu · 25 m bobin · 9 mm iç / 12 mm dış çap"],
    ["AA017 PVC Tubing · 25 m · 12/16 mm","Yeşil veya beyaz renkte yumuşak PVC su hortumu · 25 m bobin · 12 mm iç / 16 mm dış çap"],
    ["AA018 PVC Tubing · 25 m · 16/22 mm","Yeşil veya beyaz renkte yumuşak PVC su hortumu · 25 m bobin · 16 mm iç / 22 mm dış çap"],
  ],"2026-10-26"),
  ...products("Dophin","accessory","https://www.qimeigroup.com/Products_detail/169.html",[
    ["AA019 Soft PVC Air Tubing · White · 5 m","Hava motoru için beyaz yumuşak PVC hortum · 5 m bobin · 3,8 mm iç / 5,8 mm dış çap"],
    ["AA019 Soft PVC Air Tubing · Green · 5 m","Hava motoru için yeşil yumuşak PVC hortum · 5 m bobin · 3,8 mm iç / 5,8 mm dış çap"],
    ["AA019 Soft PVC Air Tubing · White · 100 m","Hava motoru için beyaz yumuşak PVC hortum · 100 m bobin · 3,8 mm iç / 5,8 mm dış çap"],
    ["AA019 Soft PVC Air Tubing · Green · 100 m","Hava motoru için yeşil yumuşak PVC hortum · 100 m bobin · 3,8 mm iç / 5,8 mm dış çap"],
  ],"2026-10-26"),
  ...products("Dophin","cleaning","https://www.qimeigroup.com/Products_detail/168.html",[
    ["MC102 Blade Scraper · 25 cm","25 cm uzunluğunda bıçaklı akvaryum kazıyıcısı"],
    ["MC103 Blade Scraper · 40 cm","40 cm uzunluğunda bıçaklı akvaryum kazıyıcısı"],
    ["MC105 Blade Scraper · 55 cm","55 cm uzunluğunda bıçaklı akvaryum kazıyıcısı"],
    ["MC106 Sponge Scraper · 25 cm","25 cm uzunluğunda sünger pedli akvaryum kazıyıcısı"],
    ["MC107 Sponge Scraper · 40 cm","40 cm uzunluğunda sünger pedli akvaryum kazıyıcısı"],
    ["MC108 Sponge Scraper · 55 cm","55 cm uzunluğunda sünger pedli akvaryum kazıyıcısı"],
  ],"2026-10-26"),
  ...products("Dophin","cleaning","https://www.qimeigroup.com/Products_detail/167.html",[
    ["MC110 Dual-Sided Scraper · 14 in","14 inç uzunluğunda, iki farklı sünger yüzeyli akvaryum kazıyıcısı · uç bölümü bitki temizliğinde kullanılabilir"],
    ["MC110 Dual-Sided Scraper · 18 in","18 inç uzunluğunda, iki farklı sünger yüzeyli akvaryum kazıyıcısı · uç bölümü bitki temizliğinde kullanılabilir"],
    ["MC110 Dual-Sided Scraper · 24 in","24 inç uzunluğunda, iki farklı sünger yüzeyli akvaryum kazıyıcısı · uç bölümü bitki temizliğinde kullanılabilir"],
    ["MC110 Dual-Sided Scraper · 32 in","32 inç uzunluğunda, iki farklı sünger yüzeyli akvaryum kazıyıcısı · uç bölümü bitki temizliğinde kullanılabilir"],
  ],"2026-10-26"),
  {
    id:"dophin-as078",brand:"Dophin",model:"AS078 Plastic Air Stone",category:"accessory",
    description:"Vantuzla akvaryuma sabitlenen plastik hava taşı · kabarcık üretmek için hava motoruna bağlanır · kolay kurulum ve bakım",
    sourceUrl:"https://www.qimeigroup.com/Products_detail/166.html",verifiedAt:"2026-10-26",
  },
  {
    id:"dophin-ra001",brand:"Dophin",model:"RA001 Reptile Carrier",category:"accessory",
    description:"Işık geçiren havalandırma filesi ve hayvanı gözlemlemeyi sağlayan şeffaf penceresi bulunan reptil taşıma çantası · elde veya çapraz taşıma seçenekleri · yem ve mendil cepleri · çıkarılıp temizlenebilen emici pamuk ped · üretici ölçü ve taşıma kapasitesi yayımlamıyor",
    sourceUrl:"https://www.qimeigroup.com/Products_detail/24.html",verifiedAt:"2026-10-26",
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
  test:"Test", filter_media:"Filtre medyası", substrate:"Taban malzemesi", plant_seed:"Bitki tohumu", treatment:"Tedavi", decoration:"Dekorasyon", cleaning:"Temizlik", accessory:"Aksesuar",
  aquarium_set:"Akvaryum seti", aquaterrarium:"Aquaterrarium", terrarium:"Terrarium", tank:"Boş akvaryum",
  cover:"Akvaryum kapağı", cabinet:"Akvaryum dolabı",
};
