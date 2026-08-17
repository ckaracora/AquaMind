export type CareProductCategory = "food" | "fertilizer" | "water_conditioner" | "bacteria" | "test" | "filter_media" | "substrate" | "treatment";

export interface CareProductProfile {
  id: string;
  brand: string;
  model: string;
  category: CareProductCategory;
  description: string;
  sourceUrl: string;
  verifiedAt: string;
}

const verifiedAt = "2026-08-17";
const tropicalSource = "https://tropical.pl/tropical/products_search";
const seraSource = "https://www.sera.de/us/freshwater-aquarium/products/";
const seachemSource = "https://www.seachem.com/products.php";
const tropicaSource = "https://tropica.com/en/plant-care/";
const aptSource = "https://www.2hraquarist.com/";
const shrimpsForeverSource = "https://shrimpsforever.com/";
const masterLineSource = "https://masterlineonline.com/wp-content/uploads/2019/2023/11/Ingredients-Product-Catalogue-A4-Approved-28-11-2023_compressed.pdf";
const dennerleSource = "https://dennerle.com/en/pages/html-sitemap";
const adaFertilizerSource = "https://www.adana.co.jp/en/contents/products/na_liquid/detail01.html";
const adaFoodSource = "https://www.adana.co.jp/en/contents/products/na_food/detail01.html";
const adaSoilSource = "https://www.adana.co.jp/en/contents/products/na_substrate/detail02.html/1000";
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

const products = (brand:string, category:CareProductCategory, sourceUrl:string, names:Array<[string,string]>): CareProductProfile[] =>
  names.map(([model,description]) => ({ id:catalogSlug(`${brand}-${model}`), brand, model, category, description, sourceUrl, verifiedAt }));

export const careProductCatalog: CareProductProfile[] = [
  ...products("Tropical","food",tropicalSource,[
    ["Supervit Flakes","Günlük çok bileşenli pul yem"], ["Supervit Mini Flakes","Küçük balıklar ve yavrular için mini pul yem"],
    ["Supervit Tablets A","Cama yapışan çok bileşenli tablet yem"], ["Supervit Tablets B","Dibe batan çok bileşenli tablet yem"],
    ["3-Algae Flakes","Üç alg içeren bitkisel pul yem"], ["Hi-Algae Discs","Vatoz ve karidesler için algli batan disk"],
    ["Hi-Algae Discs XXL","Büyük dip balıkları için algli disk"], ["Hi-Protein Discs XXL","Etçil büyük dip balıkları için proteinli disk"],
    ["Vitality & Color Flakes","Renk ve kondisyon destekli pul yem"], ["Vitality & Color Granules","Renk ve kondisyon destekli granül yem"],
    ["Spirulina Super Forte","Yüksek spirulina içerikli bitkisel yem"], ["Cichlid Gran","Cichlidler için granül yem"],
  ]),
  ...products("Sera","food",seraSource,[
    ["Vipan Tropical Flakes","Yüzeyden beslenen balıklar için temel pul yem"], ["Vipan Tropical Flakes XL","Büyük balıklar için temel pul yem"],
    ["Vipagran Tropical Granules","Orta su katmanı için temel granül yem"], ["Vipachips Tropical Wafers","Dip balıkları için temel wafer"],
    ["Insect Granules","Böcek proteini içeren temel granül"], ["Immune Probiotic Granules","Büyüme ve bağışıklık destekli probiyotik granül"],
    ["San Color Flakes","Renk destekleyici pul yem"], ["San Color Granules","Renk destekleyici granül yem"],
    ["Betta Granules","Betta balıkları için temel granül"], ["Flora Flakes","Bitkisel pul yem"],
    ["Veggie Granules","Bitkisel granül yem"], ["Spirulina Tabs","Bitkisel yapışan tablet yem"],
  ]),
  ...products("Sera","water_conditioner",seraSource,[
    ["aquatan","Klor, kloramin ve ağır metalleri bağlayan su düzenleyici"], ["toxivec","Acil kirletici bağlayıcı"],
    ["mineral salt","Osmos ve mineralce fakir su için mineral karışımı"], ["KH/pH-plus","KH ve pH yükseltici"],
    ["pH/KH-minus","pH ve KH düşürücü"], ["phosvec clear","Fosfat ve bulanıklık giderici"],
  ]),
  ...products("Sera","bacteria",seraSource,[["bio nitrivec","Biyolojik denge için nitrifikasyon bakteri kültürü"], ["filter biostart","Filtre başlangıç bakteri kültürü"]]),
  ...products("Seachem","water_conditioner",seachemSource,[
    ["Prime","Klor, kloramin ve amonyak detoksifikasyonu için konsantre düzenleyici"], ["Safe","Toz formda konsantre su düzenleyici"],
    ["Pristine","Organik atık kontrolüne yardımcı bakteri desteği"], ["Clarity","Tatlı ve tuzlu su için berraklaştırıcı"],
    ["Equilibrium","Bitkili akvaryumlar için GH mineral desteği"], ["Acid Buffer","Karbonat sertliği ve pH düşürme desteği"],
    ["Alkaline Buffer","KH ve pH yükseltme desteği"],
  ]),
  ...products("Seachem","bacteria",seachemSource,[["Stability","Yeni akvaryum ve biyofiltre için bakteri kültürü"]]),
  ...products("Seachem","fertilizer",seachemSource,[
    ["Flourish","Bitkili akvaryum için kapsamlı mikro element desteği"], ["Flourish Excel","Biyoyararlanılabilir organik karbon desteği"],
    ["Flourish Nitrogen","Azot desteği"], ["Flourish Phosphorus","Fosfor desteği"], ["Flourish Potassium","Potasyum desteği"],
    ["Flourish Iron","Demir desteği"], ["Flourish Trace","İz element desteği"], ["Flourish Tabs","Kök bölgesi besin tableti"],
  ]),
  ...products("Seachem","filter_media",seachemSource,[
    ["Matrix","Gözenekli biyolojik filtre medyası"], ["Purigen","Organik atık tutucu sentetik filtre medyası"], ["De*Nitrate","Nitrat kontrolü için gözenekli medya"],
  ]),
  ...products("Tropica","fertilizer",tropicaSource,[
    ["Premium Nutrition","Makro içermeyen mikro elementli sıvı gübre"], ["Specialised Nutrition","NPK, demir ve mikro elementli sıvı gübre"],
    ["Carbon Nutrition","Günlük sıvı karbon desteği"], ["Nutrition Capsules","Kökten beslenen bitkiler için yavaş salınımlı kapsül"],
  ]),
  ...products("Tropica","water_conditioner",tropicaSource,[["Water Conditioner","Klor ve ağır metal bağlayan su düzenleyici"]]),
  ...products("Tropica","substrate",tropicaSource,[
    ["Aquarium Soil","Aktif volkanik bitki toprağı"], ["Aquarium Soil Powder","İnce taneli aktif bitki toprağı"], ["Substrate","Taban altı besleyici katman"],
  ]),
  ...products("The 2Hr Aquarist","fertilizer",aptSource,[
    ["APT 1 / Zero","Nitrat ve fosfat içermeyen günlük kapsamlı sıvı gübre"], ["APT 3 / Complete","Makro ve mikro element içeren günlük tam sıvı gübre"],
    ["APT e","EI yöntemi için yoğun sıvı gübre"], ["APT Jazz","Soil için katı kök besini"],
    ["APT Sky","Karidesli bitkili akvaryumlar için GH mineral desteği"], ["APT Sky Plus","GH ve iz element mineral desteği"],
  ]),
  ...products("The 2Hr Aquarist","treatment",aptSource,[
    ["APT Fix","Lokal yosun kontrol ürünü"], ["APT FixLite","Hassas bitkiler için hafif yosun kontrol ürünü"],
    ["APT Pure","Su berraklığı ve organik yük yönetimi ürünü"], ["APT Start","Yeni kurulum başlangıç desteği"], ["APT Dew","Yaprak bakım ürünü"],
  ]),
  ...products("The 2Hr Aquarist","substrate",aptSource,[["APT Feast","Bitkili akvaryum için aktif besleyici soil"]]),
  ...products("Shrimps Forever","food",shrimpsForeverSource,[
    ["Complete","Günlük karides temel yemi"], ["Daily Feed","Bitkisel günlük karides yemi"], ["VitaPlus","Vitamin ve makro element destek yemi"],
    ["Mineral Shrimps Stick","Mineral destekli karides çubuğu"], ["Spinach Shrimps Stick","Ispanak ve sebze içerikli karides çubuğu"],
    ["Neocaridina / Tiger Box","Neocaridina ve tiger karides bakım-yem paketi"], ["Caridina Box","Caridina bakım-yem başlangıç paketi"],
  ]),
  ...products("Shrimps Forever","bacteria",shrimpsForeverSource,[["Bio Powder","Mikroorganizma ve biyofilm gelişim desteği"], ["ProBacter","Karides akvaryumu bakteri kültürü"]]),
  ...products("Shrimps Forever","water_conditioner",shrimpsForeverSource,[
    ["Liquid GH+","Caridina için KH yükseltmeden GH mineral desteği"], ["GH/KH+ Mineral Powder","Neocaridina için GH ve KH mineral desteği"],
    ["Sulawesi Mineral 7.5","Sulawesi karidesleri için osmos suyu mineral desteği"], ["Shrimp Trace","Karidesler için iz element desteği"],
  ]),
  ...products("MasterLine","fertilizer",masterLineSource,[
    ["MasterLine I","Mikro element sıvı gübresi"], ["MasterLine II","Makro element sıvı gübresi"], ["Carbo","Sıvı karbon desteği"],
    ["All In One Boost","Yoğun bitkili akvaryumlar için tam gübre"], ["All In One Golden","Düşük azot yaklaşımı için tam gübre"],
    ["All In One Lean","Yalın dozlama için tam gübre"], ["Nitrate","Tek bileşenli nitrat desteği"], ["Phosphate","Tek bileşenli fosfat desteği"],
    ["Potassium","Tek bileşenli potasyum desteği"], ["Iron","Tek bileşenli demir desteği"], ["Root Caps","Kök bölgesi besin kapsülü"],
  ]),
  ...products("MasterLine","water_conditioner",masterLineSource,[["Safe Water","Musluk suyu düzenleyici"]]),
  ...products("Dennerle","food",dennerleSource,[
    ["Shrimp King Complete","Karidesler için günlük tam yem"], ["Shrimp King Protein","Üreme ve büyüme için protein yemi"],
    ["Shrimp King Mineral","Kabuk gelişimi için mineral yemi"], ["Shrimp King Snow Pops","Soya kepeği bazlı karides yemi"],
    ["Shrimp King Color","Renk destekleyici karides yemi"], ["Shrimp King 5in1","Beş Shrimp King yeminden oluşan karma paket"],
    ["CrustaGran","Karides ve cüce kerevit için temel granül yem"],
  ]),
  ...products("Dennerle","fertilizer",dennerleSource,[
    ["Plant Care Pro","Yoğun bitkili akvaryum için kapsamlı mikro gübre"], ["Plant Care NPK","Azot, fosfor ve potasyum gübresi"],
    ["Plant Care P","Tek bileşenli fosfat gübresi"], ["Plant System V30","Kapsamlı bitki gübresi"],
    ["Plant System E15","Demir gübresi"], ["Plant System S7","Vitamin ve iz element desteği"],
    ["Plant Elixir Basic","Genel bitki bakım gübresi"], ["All in One Elixir","Bitki, su ve filtre için birleşik bakım ürünü"],
  ]),
  ...products("Dennerle","water_conditioner",dennerleSource,[
    ["Shrimp King Shrimp Salt GH/KH+","Neocaridina ve tiger karidesler için mineral tuzu"], ["Shrimp King Bee Salt GH+","Bee karidesler için GH mineral tuzu"],
  ]),
  ...products("Dennerle","substrate",dennerleSource,[["Scaper's Soil","Bitkili ve yumuşak su karides akvaryumları için aktif soil"]]),
  ...products("ADA","food",adaFoodSource,[
    ["AP-1 Premium","Yüzeyden beslenen küçük balıklar için yüzen premium yem"], ["AP-2 Premium","Küçük ve orta boy balıklar için yavaş batan premium yem"],
    ["AP-3 Premium","Orta ve dip katmanındaki orta boy balıklar için batan premium yem"],
  ]),
  ...products("ADA","fertilizer",adaFertilizerSource,[
    ["Green Brighty Neutral K","pH ve KH yükseltmeyen potasyum gübresi"], ["Brighty K","Potasyum ve tamponlama desteği"],
    ["Green Brighty Nitrogen","Azot gübresi"], ["Green Brighty Mineral","İz element gübresi"], ["Green Brighty Iron","Demir gübresi"],
  ]),
  ...products("ADA","water_conditioner",adaFertilizerSource,[["Chlor-Off","Musluk suyundaki kalıntı kloru gideren düzenleyici"], ["Vita-Mix","Vitamin desteği"]]),
  ...products("ADA","substrate",adaSoilSource,[
    ["Aqua Soil Amazonia Ver.2","Besin takviyeli aktif bitki toprağı"], ["Aqua Soil Amazonia Ver.2 Powder","İnce taneli aktif bitki toprağı"],
  ]),
  ...products("Aquamin","fertilizer",aquaminsSource,[["Potasflow","Potasyum ağırlıklı bitki gübresi"],["Plants All Included","Kapsamlı bitki gübresi"]]),
  ...products("Aquamin","water_conditioner",aquaminsSource,[["H2O","Musluk suyu düzenleyici"],["Productive Cleaner","Su berraklaştırıcı"],["Minerals Plus","Mineral düzenleyici"],["Beta Mineral","Betta akvaryumları için mineral desteği"],["Anti Ammonia","Amonyak giderici"]]),
  ...products("Aquamin","bacteria",aquaminsSource,[["Bacteria","Biyolojik denge için bakteri kültürü"]]),
  ...products("Aquamin","treatment",aquaminsSource,[["Ichthyo","Balık parazit bakım losyonu"]]),
  ...products("Aquamin","substrate",aquaminsSource,[["California Black Sand","Bitkili akvaryum için siyah kum"],["White Sand","Cichlid akvaryumu için beyaz kum"],["Silis Kumu","1,5 mm silis kum"],["Lav Taşı Kırığı","Gözenekli lav taşı kırığı"]]),
  { id:"eurostar-zeo-carbon-fix-500ml", brand:"Eurostar", model:"Zeo Karbon Fix 500 ml", category:"filter_media", description:"Aktif karbon ve zeolit içeren kimyasal filtre medyası", sourceUrl:"https://atakanpetshop.com/eurostar-zeo-karbon-fix-500ml-filtre-malzemesi", verifiedAt },
  { id:"eurostar-lava-fix-500ml", brand:"Eurostar", model:"Lava Fix 500 ml", category:"filter_media", description:"Biyolojik filtrasyon için doğal volkanik lav taşı", sourceUrl:"https://atakanpetshop.com/eurostar-lava-fix-500ml-filtre-malzemesi-452-1018", verifiedAt },
  { id:"eurostar-bio-porous-ring-500ml", brand:"Eurostar", model:"Bio Porous Ring 500 ml", category:"filter_media", description:"Gözenekli seramik biyolojik filtre halkası", sourceUrl:"https://atakanpetshop.com/eurostar-bio-porous-ring-500ml-filtre-malzemesi-452-1017", verifiedAt },
  { id:"eurostar-filter-wool-100g", brand:"Eurostar", model:"Filter Wool 100 g", category:"filter_media", description:"Mekanik filtrasyon için akvaryum filtre elyafı", sourceUrl:"https://atakanpetshop.com/eurostar", verifiedAt },
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
  test:"Test", filter_media:"Filtre medyası", substrate:"Taban malzemesi", treatment:"Tedavi",
};
