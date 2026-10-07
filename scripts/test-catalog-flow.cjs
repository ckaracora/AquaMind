const assert = require("node:assert/strict");
const fs = require("node:fs");
const Module = require("node:module");
const path = require("node:path");
const ts = require("typescript");

const projectRoot = path.resolve(__dirname, "..");
const originalResolveFilename = Module._resolveFilename;

Module._resolveFilename = function resolveTypeScriptImports(request, parent, ...rest) {
  if (request.startsWith(".") && parent?.filename) {
    const candidate = path.resolve(path.dirname(parent.filename), request);
    if (!path.extname(candidate) && fs.existsSync(`${candidate}.ts`)) {
      return originalResolveFilename.call(this, `${request}.ts`, parent, ...rest);
    }
  }
  return originalResolveFilename.call(this, request, parent, ...rest);
};

require.extensions[".ts"] = (module, filename) => {
  const source = fs.readFileSync(filename, "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
    fileName: filename,
  }).outputText;
  module._compile(output, filename);
};

const { equipmentBrandsForCategory, equipmentCatalog, equipmentForBrandInCategory, equipmentForCategory, hasStandaloneCapacityData, speciesCatalog, speciesForCatalogExactSearch, speciesForCatalogSearch, speciesForCategoryAndWaterType, speciesForLivestock, speciesGroup, speciesGroupsForCategoryAndWaterType, speciesWaterTypes } = require(path.join(projectRoot, "src/data/catalog.ts"));
const { unresolvedSpeciesForSearch, unresolvedSpeciesListings } = require(path.join(projectRoot, "src/data/catalog-species-unresolved.ts"));
const { careCategoryLabels, careProductCatalog } = require(path.join(projectRoot, "src/data/care-product-catalog.ts"));
const { catalogBrandCoverage } = require(path.join(projectRoot, "src/data/catalog-coverage.ts"));
const { allNavigationItems, primaryNavigationItems, settingsNavigationItem } = require(path.join(projectRoot, "src/data/navigation.ts"));
const cikletistMainCategoryInventory = require(path.join(projectRoot, "scripts/fixtures/cikletist-main-category.cjs"));

assert.deepEqual(primaryNavigationItems.map((item) => item.href), ["/", "/aquariums", "/water", "/maintenance", "/livestock", "/plants", "/equipment", "/products", "/calculators", "/aquamatch"], "Masaüstü ve mobil menü tüm ana uygulama başlıklarını ortak sırayla taşımalı");
assert.deepEqual(primaryNavigationItems.find((item) => item.key === "aquamatch"), {key:"aquamatch",label:"AquaMatch",href:"/aquamatch",comingSoon:true}, "AquaMatch yalnız Yakında durumundaki pasif menü seçeneği olarak kalmalı");
assert.deepEqual(settingsNavigationItem, {key:"settings",label:"Ayarlar",href:"/settings"}, "Ayarlar bağlantısı ortak menü kaynağında korunmalı");
assert.equal(new Set(allNavigationItems.map((item) => item.href)).size, allNavigationItems.length, "Ortak navigasyonda yinelenen bağlantı bulunmamalı");

assert.equal(catalogBrandCoverage.length, 49, "Kullanıcının zorunlu marka listesi 49 başlıkla korunmalı");
assert(catalogBrandCoverage.every((item) => item.equipmentCount + item.careProductCount > 0), "Zorunlu markaların hiçbiri boş katalog başlığına dönüşmemeli");
for (const brand of ["Aquael", "Sera", "Eheim", "Tetra", "ISTA", "Seachem", "Fluval", "Sobo", "Chihiros", "Oase", "SunSun", "Dennerle", "ADA"]) {
  assert(catalogBrandCoverage.some((item) => item.brand === brand && item.equipmentCount + item.careProductCount >= 8), `${brand} tek tük örnek ürünle temsil edilmemeli`);
}

const eheimCompactOnIds = ["300","600","1000","2100","3000","5000","9000","12000","16000"].map((model) => `eheim-compacton-${model}`);
const eheimCompactOn = eheimCompactOnIds.map((id) => equipmentCatalog.find((item) => item.id === id));
assert(eheimCompactOn.every(Boolean), "Eheim compactON ailesinin dokuz güncel modeli bulunmalı");
assert.deepEqual(eheimCompactOn.map((item) => item?.ratedFlowLph), [300,600,1000,2100,3000,5000,9000,12000,16000], "Eheim compactON modelleri resmî azami debileri taşımalı");
assert.deepEqual(eheimCompactOn.map((item) => item?.powerW), [7,7,15,38,55,70,80,110,160], "Eheim compactON modelleri resmî 50 Hz güçlerini taşımalı");
assert(eheimCompactOn.every((item) => item?.category === "other" && item.sourceUrl?.startsWith("https://eheim.com/") && item.verifiedAt === "2026-09-27"), "Eheim compactON pompaları ana filtre değil sirkülasyon pompası olarak resmî kaynakla tutulmalı");
assert.deepEqual(eheimCompactOn.map((item) => item?.adjustableFlow), [true,true,true,true,true,false,false,false,false], "Eheim compactON debi ayarı yalnız üreticinin yayımladığı modellerde işaretlenmeli");

const eheimStreamOnIds = ["3500","6500","9500"].map((model) => `eheim-streamon-plus-${model}`);
const eheimStreamOn = eheimStreamOnIds.map((id) => equipmentCatalog.find((item) => item.id === id));
assert(eheimStreamOn.every(Boolean), "Eheim streamON+ ailesinin üç güncel modeli bulunmalı");
assert.deepEqual(eheimStreamOn.map((item) => [item?.ratedFlowLph,item?.powerW]), [[3500,2.5],[6500,6],[9500,12]], "Eheim streamON+ pompaları resmî azami debi ve güçleri taşımalı");
assert(eheimStreamOn.every((item) => item?.category === "other" && item.adjustableFlow === true), "Eheim streamON+ modelleri ayarlanabilir sirkülasyon pompası olarak tutulmalı");

const eheimSkim350 = equipmentCatalog.find((item) => item.id === "eheim-skim350");
assert(eheimSkim350?.category === "filter" && eheimSkim350.auxiliaryFiltration === true && eheimSkim350.recommendedMaxL === 350 && eheimSkim350.powerW === 5, "Eheim skim350 yardımcı yüzey filtresi olarak 350 L ve 5 W resmî değerlerini taşımalı");
assert(eheimSkim350.ratedFlowLph === undefined && eheimSkim350.specifications.includes("üretici debi yayımlamıyor"), "Eheim skim350 için yayımlanmayan debi uydurulmamalı");
const eheimFeedingIds = ["eheim-autofeeder","eheim-autofeeder-plus","eheim-twinfeeder","eheim-feedingstation"];
const eheimFeeding = eheimFeedingIds.map((id) => equipmentCatalog.find((item) => item.id === id));
assert(eheimFeeding.every((item) => item?.category === "other" && item.sourceUrl?.startsWith("https://eheim.com/") && item.verifiedAt === "2026-09-27"), "Eheim besleme ailesinin dört güncel ürünü resmî kaynakla Diğer kategorisinde bulunmalı");
assert(eheimFeeding.at(-1)?.passiveComponent === true, "Eheim feedingSTATION motorsuz pasif aksesuar olarak kalmalı");

const eheimSmartHeaterIds = [150,200,250,300].map((powerW) => `eheim-thermocontrol-plus-e-${powerW}`);
const eheimSmartHeaters = eheimSmartHeaterIds.map((id) => equipmentCatalog.find((item) => item.id === id));
assert(eheimSmartHeaters.every(Boolean), "Eheim thermocontrol+ e ailesinin dört güncel modeli bulunmalı");
assert.deepEqual(eheimSmartHeaters.map((item) => [item?.powerW,item?.recommendedMinL,item?.recommendedMaxL]), [[150,200,300],[200,300,400],[250,400,600],[300,600,1000]], "Eheim thermocontrol+ e modelleri resmî güç ve hacim aralıklarını taşımalı");
assert(eheimSmartHeaters.every((item) => item?.category === "heater" && item.specifications.includes("18–32 °C") && item.specifications.includes("IPX8") && item.sourceUrl?.startsWith("https://eheim.com/") && item.verifiedAt === "2026-09-27"), "Eheim akıllı ısıtıcıları güvenlik ve kaynak bilgileriyle Isıtıcı kategorisinde bulunmalı");

const eheimSmartUvIds = [500,800,1500,2000].map((model) => `eheim-reeflexuv-plus-e-${model}`);
const eheimSmartUv = eheimSmartUvIds.map((id) => equipmentCatalog.find((item) => item.id === id));
assert(eheimSmartUv.every(Boolean), "Eheim reeflexUV+e ailesinin dört güncel modeli bulunmalı");
assert.deepEqual(eheimSmartUv.map((item) => [item?.powerW,item?.recommendedMinL,item?.recommendedMaxL]), [[11,300,500],[11,400,800],[19,700,1500],[24,1200,2000]], "Eheim reeflexUV+e modelleri resmî güç ve hacim aralıklarını taşımalı");
assert(eheimSmartUv.every((item) => item?.category === "uv" && item.specifications.includes("otomatik kapanma") && item.sourceUrl?.startsWith("https://eheim.com/") && item.verifiedAt === "2026-09-27"), "Eheim akıllı UV ailesi güvenlik özelliği ve resmî kaynakla UV kategorisinde bulunmalı");

const eheimLibertyIds = ["75","130","200"].map((model) => `eheim-liberty-${model}`);
const eheimLiberty = eheimLibertyIds.map((id) => equipmentCatalog.find((item) => item.id === id));
assert(eheimLiberty.every(Boolean), "Eheim LiBERTY ailesinin üç askı filtresi bulunmalı");
assert.deepEqual(eheimLiberty.map((item) => [item?.ratedFlowLph,item?.powerW,item?.recommendedMaxL]), [[380,2.5,75],[570,3,130],[760,4,200]], "Eheim LiBERTY modelleri resmî azami debi, güç ve hacimleri taşımalı");
assert(eheimLiberty.every((item) => item?.category === "filter" && item.adjustableFlow === true && item.sourceUrl?.startsWith("https://eheim.com/") && item.verifiedAt === "2026-09-27"), "Eheim LiBERTY ailesi ayarlanabilir askı filtre olarak resmî kaynakla tutulmalı");

const eheimMiniUp = equipmentCatalog.find((item) => item.id === "eheim-miniup");
assert.deepEqual([eheimMiniUp?.ratedFlowLph,eheimMiniUp?.powerW,eheimMiniUp?.recommendedMinL,eheimMiniUp?.recommendedMaxL], [300,5,25,30], "Eheim miniUP resmî debi, güç ve nano akvaryum hacmini taşımalı");

const eheimAquaIds = ["60","160","200"].map((model) => `eheim-aqua-${model}`);
const eheimAqua = eheimAquaIds.map((id) => equipmentCatalog.find((item) => item.id === id));
assert.deepEqual(eheimAqua.map((item) => [item?.ratedFlowLph,item?.recommendedMinL,item?.recommendedMaxL]), [[300,30,60],[440,60,160],[440,100,200]], "Eheim aqua ailesi resmî debi ve hacim aralıklarını taşımalı");
assert(eheimAqua.every((item) => item?.powerW === undefined && item.adjustableFlow === true && item.specifications.includes("güç alanı kesinleştirilmedi")), "Eheim aqua ailesindeki çelişkili resmî güç değerleri kesin watt alanına yazılmamalı");

const eheimAquaCorner = equipmentCatalog.find((item) => item.id === "eheim-aquacorner-60");
assert.deepEqual([eheimAquaCorner?.ratedFlowLph,eheimAquaCorner?.powerW,eheimAquaCorner?.recommendedMinL,eheimAquaCorner?.recommendedMaxL], [200,5,10,60], "Eheim aquaCorner 60 resmî teknik değerlerini taşımalı");

const eheimPowerLineIds = ["eheim-powerline-200","eheim-powerline-xl"];
const eheimPowerLine = eheimPowerLineIds.map((id) => equipmentCatalog.find((item) => item.id === id));
assert.deepEqual(eheimPowerLine.map((item) => [item?.ratedFlowLph,item?.powerW,item?.recommendedMinL,item?.recommendedMaxL]), [[600,10,100,200],[1200,28,200,undefined]], "Eheim PowerLine modelleri resmî debi, güç ve yayımlanan hacim sınırlarını taşımalı");
assert(eheimPowerLine[1]?.specifications.includes("üst hacim sınırı yayımlamıyor"), "PowerLine XL için yayımlanmayan üst hacim sınırı uydurulmamalı");

const eheimAquaCompactIds = ["40","60"].map((model) => `eheim-aquacompact-${model}`);
const eheimAquaCompact = eheimAquaCompactIds.map((id) => equipmentCatalog.find((item) => item.id === id));
assert.deepEqual(eheimAquaCompact.map((item) => [item?.recommendedMinL,item?.recommendedMaxL]), [[20,40],[30,60]], "Eheim aquacompact modelleri resmî hacim aralıklarını taşımalı");
assert(eheimAquaCompact.every((item) => item?.ratedFlowLph === undefined && item.powerW === undefined && item.adjustableFlow === true && item.specifications.includes("debi ve güç yayımlanmıyor")), "Eheim aquacompact için güncel sayfada yayımlanmayan debi ve güç uydurulmamalı");

const eheimAirfilter = equipmentCatalog.find((item) => item.id === "eheim-airfilter");
assert(eheimAirfilter?.category === "filter" && eheimAirfilter.requiresAirPump === true && eheimAirfilter.ratedFlowLph === undefined && eheimAirfilter.powerW === undefined, "Eheim Airfilter harici hava motoru gerektiren filtredir; motor kapasitesi uydurulmamalı");

const eheimCurrentPro5e = ["eheim-pro5e-350","eheim-pro5e-450","eheim-pro5e-700","eheim-professionel-5e-600t"].map((id) => equipmentCatalog.find((item) => item.id === id));
assert(eheimCurrentPro5e.every(Boolean), "Eheim professionel 5e güncel dört modelinin tamamı bulunmalı");
assert.deepEqual(eheimCurrentPro5e.map((item) => [item?.ratedFlowLph,item?.powerW,item?.recommendedMinL,item?.recommendedMaxL]), [[1500,35,180,350],[1700,35,240,550],[1850,35,300,700],[1850,35,300,600]], "Eheim professionel 5e ailesi resmî pompa, güç ve hacim verilerini taşımalı");
assert(eheimCurrentPro5e[1]?.model.includes("önceki ad 450") && eheimCurrentPro5e[2]?.model.includes("önceki ad 700"), "Eheim 2076/2078 gövdelerinin eski 450/700 adları aramada korunmalı");
assert(eheimCurrentPro5e[3]?.integratedHeaterW === 210 && eheimCurrentPro5e[3].specifications.includes("tatlı su"), "Professionel 5e 600T 210 W termofiltre ve yalnız tatlı su olarak tutulmalı");

const eheimClassicVario = equipmentCatalog.find((item) => item.id === "eheim-classicvario-plus-e-250");
assert.deepEqual([eheimClassicVario?.ratedFlowLph,eheimClassicVario?.powerW,eheimClassicVario?.recommendedMinL,eheimClassicVario?.recommendedMaxL], [510,9.8,50,250], "Eheim classicVARIO+e 250 resmî teknik değerlerini taşımalı");
assert(eheimClassicVario?.adjustableFlow === true && eheimClassicVario.specifications.includes("Wi-Fi"), "Eheim classicVARIO+e 250 ayarlanabilir akıllı dış filtre olmalı");

const eheimPro4eArchived = equipmentCatalog.find((item) => item.id === "eheim-professionel-4e-plus-350");
assert.deepEqual([eheimPro4eArchived?.ratedFlowLph,eheimPro4eArchived?.powerW,eheimPro4eArchived?.recommendedMinL,eheimPro4eArchived?.recommendedMaxL], [1500,35,180,350], "Eheim Professionel 4e+ 350 resmî arşiv teknik değerlerini taşımalı");
assert(eheimPro4eArchived?.adjustableFlow === true && eheimPro4eArchived.model.includes("arşiv") && eheimPro4eArchived.specifications.includes("stoklarla sınırlı"), "Eheim Professionel 4e+ 350 güncel ürün gibi sunulmamalı");
assert(eheimPro4eArchived?.sourceUrl?.startsWith("https://eheim.com/") && eheimPro4eArchived.additionalSourceUrls?.length === 2, "Eheim Professionel 4e+ 350 resmî teknik ve yedek parça kaynaklarına bağlı olmalı");

const eheimPro4Thermo = ["250t","350t"].map((model) => equipmentCatalog.find((item) => item.id === `eheim-professionel-4plus-${model}`));
assert.deepEqual(eheimPro4Thermo.map((item) => [item?.ratedFlowLph,item?.powerW,item?.integratedHeaterW,item?.recommendedMinL,item?.recommendedMaxL]), [[950,12,210,120,250],[1050,16,210,180,350]], "Eheim Professionel 4+ termofiltreleri resmî pompa, ısıtıcı ve hacim değerlerini taşımalı");
assert(eheimPro4Thermo.every((item) => item?.category === "filter" && item.adjustableFlow === true && item.sourceUrl?.startsWith("https://eheim.com/")), "Eheim Professionel 4+ termofiltreleri ayarlanabilir filtre kategorisinde resmî kaynakla bulunmalı");

const fluvalPSeries = [10,25,50].map((powerW) => equipmentCatalog.find((item) => item.id === `fluval-p${powerW}`));
assert.deepEqual(fluvalPSeries.map((item) => [item?.category,item?.powerW,item?.recommendedMaxL]), [["heater",10,10],["heater",25,25],["heater",50,50]], "Fluval P-Series üç güncel nano ısıtıcıyı resmî güç ve hacim değerleriyle taşımalı");
assert(fluvalPSeries.every((item) => item?.sourceUrl?.startsWith("https://fluvalaquatics.com/") && item.verifiedAt === "2026-09-28"), "Fluval P-Series resmî ve güncel kaynaklı olmalı");

const fluvalCurrentLights = [
  ["fluval-aquasky-3-12w",12,38,63],
  ["fluval-aquasky-3-18w",18,61,93],
  ["fluval-aquasky-3-27w",27,91,123],
  ["fluval-aquasky-3-35w",35,123,154],
  ["fluval-plant-4-22w",22,38,63],
  ["fluval-plant-4-32w",32,59,89],
  ["fluval-plant-4-46w",46,88,126],
  ["fluval-plant-4-59w",59,117,155],
  ["fluval-reef-4-22w",22,38,63],
  ["fluval-reef-4-32w",32,59,89],
  ["fluval-reef-4-46w",46,88,126],
  ["fluval-reef-4-59w",59,117,155],
  ["fluval-plant-pro-60",38,38,60],
  ["fluval-plant-pro-90",60,59,88],
  ["fluval-plant-pro-120",90,88,124],
  ["fluval-plant-pro-150",120,117,154],
  ["fluval-plant-4-nano-20w",20,11.5,20],
  ["fluval-reef-4-nano-25w",25,11.5,20],
];
for (const [id,powerW,minLength,maxLength] of fluvalCurrentLights) {
  const item = equipmentCatalog.find((entry) => entry.id === id);
  assert.deepEqual([item?.category,item?.powerW,item?.recommendedTankLengthCm], ["lighting",powerW,[minLength,maxLength]], `Fluval ${id} resmî güç ve uzunluk aralığını taşımalı`);
  assert(item?.sourceUrl?.startsWith("https://fluvalaquatics.com/") && item.verifiedAt === "2026-09-28", `Fluval ${id} resmî ve güncel kaynaklı olmalı`);
}

const fluvalPreviousGenerationLights = [
  ["fluval-aquasky-2-12w",12,[38,61]],["fluval-aquasky-2-18w",18,[61,91]],["fluval-aquasky-2-27w",27,[91,122]],["fluval-aquasky-2-35w",35,[122,153]],
  ["fluval-plant-3-22w",22,[38,61]],["fluval-plant-3-32w",32,[61,85]],["fluval-plant-3-46w",46,[91,115]],["fluval-plant-3-59w",59,[122,153]],
  ["fluval-marine-3-22w",22,[38,61]],["fluval-marine-3-32w",32,[61,85]],["fluval-marine-3-46w",46,[91,122]],["fluval-marine-3-59w",59,[122,153]],
];
for (const [id,powerW,lengthRange] of fluvalPreviousGenerationLights) {
  const item = equipmentCatalog.find((entry) => entry.id === id);
  assert.deepEqual([item?.category,item?.powerW,item?.recommendedTankLengthCm], ["lighting",powerW,lengthRange], `Fluval ${id} önceki nesil resmî güç ve uzunluk aralığını taşımalı`);
  assert(item?.specifications.includes("önceki nesil") && item.sourceUrl?.startsWith("https://fluvalaquatics.com/") && item.verifiedAt === "2026-09-28", `Fluval ${id} yeni nesille karışmadan resmî kaynağa bağlı olmalı`);
}
const fluvalSpecialLightExpectations = [
  ["fluval-plant-3-nano-15w",15,"1000 lm"],["fluval-marine-3-nano-20w",20,"850 lm"],["fluval-cob-nano-6-5w",6.5,"290 lm"],["fluval-prism-2-6-5w",6.5,"60 lm"],
];
const fluvalSpecialLights = fluvalSpecialLightExpectations.map(([id]) => equipmentCatalog.find((item) => item.id === id));
assert.deepEqual(fluvalSpecialLights.map((item) => [item?.category,item?.powerW]), [["lighting",15],["lighting",20],["lighting",6.5],["lighting",6.5]], "Fluval nano ve su altı aydınlatmaları resmî güçleriyle ayrı modeller olmalı");
for (const [index,[,powerW,lumens]] of fluvalSpecialLightExpectations.entries()) assert(fluvalSpecialLights[index]?.powerW === powerW && fluvalSpecialLights[index]?.specifications.includes(lumens), "Fluval özel aydınlatmasının resmî lümen değeri korunmalı");

const fluvalAcSeries = [
  ["fluval-ac20",379,5,18,76],
  ["fluval-ac30",568,5,38,114],
  ["fluval-ac50",757,5,76,190],
  ["fluval-ac70",1136,5,152,265],
  ["fluval-ac110",1892,14,227,416],
].map(([id]) => equipmentCatalog.find((item) => item.id === id));
assert.deepEqual(fluvalAcSeries.map((item) => [item?.ratedFlowLph,item?.powerW,item?.recommendedMinL,item?.recommendedMaxL]), [[379,5,18,76],[568,5,38,114],[757,5,76,190],[1136,5,152,265],[1892,14,227,416]], "Fluval AC Series resmî Avrupa güç, debi ve hacim değerlerini taşımalı");
assert(fluvalAcSeries.every((item) => item?.adjustableFlow === true && item.sourceUrl === "https://fluvalaquatics.com/us/shop/product/aquaclear" && item.verifiedAt === "2026-09-28"), "Fluval AC Series ortak güncel resmî kaynağa bağlı olmalı");

const fluvalCpSeries = [
  ["fluval-cp1",1000,3.5,60],
  ["fluval-cp2",1600,4,100],
  ["fluval-cp3",2800,5,200],
  ["fluval-cp4",5200,7,350],
];
for (const [id,ratedFlowLph,powerW,recommendedMaxL] of fluvalCpSeries) {
  const item = equipmentCatalog.find((entry) => entry.id === id);
  assert.deepEqual([item?.category,item?.ratedFlowLph,item?.powerW,item?.recommendedMaxL], ["other",ratedFlowLph,powerW,recommendedMaxL], `Fluval ${id} resmî sirkülasyon pompası değerlerini taşımalı`);
  assert(item?.specifications.includes("filtrasyon sağlamaz"), `Fluval ${id} biyolojik filtre hesabına karışmamalı`);
}

const fluvalSk400 = equipmentCatalog.find((item) => item.id === "fluval-sk400");
assert.deepEqual([fluvalSk400?.category,fluvalSk400?.powerW,fluvalSk400?.recommendedMaxL,fluvalSk400?.auxiliaryFiltration], ["filter",3.3,400,true], "Fluval SK400 yardımcı yüzey filtrasyonu olarak resmî güç ve hacim değerlerini taşımalı");
const fluvalPassiveSkimmers = ["fluval-surface-skimmer-05-07","fluval-ac-surface-skimmer-20-50","fluval-ac-surface-skimmer-70-110"].map((id) => equipmentCatalog.find((item) => item.id === id));
assert(fluvalPassiveSkimmers.every((item) => item?.category === "other" && item.passiveComponent === true && item.ratedFlowLph === undefined && item.powerW === undefined), "Fluval motorsuz yüzey süpürücüleri bağımsız kapasite cihazı olmamalı");

const fluvalSpPumps = ["fluval-sp4","fluval-sp6"].map((id) => equipmentCatalog.find((item) => item.id === id));
assert.deepEqual(fluvalSpPumps.map((item) => [item?.category,item?.ratedFlowLph,item?.powerW]), [["other",7500,90],["other",13000,100]], "Fluval SP sump pompaları resmî debi ve güç değerlerini taşımalı");
assert(fluvalSpPumps.every((item) => item?.specifications.includes("filtrasyon sağlamaz")), "Fluval SP pompaları biyolojik filtre hesabına karışmamalı");
const fluvalProteinSkimmers = ["fluval-ps1","fluval-ps2"].map((id) => equipmentCatalog.find((item) => item.id === id));
assert.deepEqual(fluvalProteinSkimmers.map((item) => [item?.category,item?.powerW,item?.recommendedMinL,item?.recommendedMaxL]), [["other",undefined,undefined,170],["other",8,20,80]], "Fluval PS1/PS2 yayımlanmış güç ve hacim sınırlarını taşımalı");
assert(fluvalProteinSkimmers.every((item) => item?.specifications.includes("ana biyolojik filtre yerine geçmez")), "Fluval protein skimmer'ları ana biyolojik filtre gibi değerlendirilmemeli");
const fluvalUvcClarifiers = ["fluval-uvc-inline-a198","fluval-fx-uvc-inline-a199"].map((id) => equipmentCatalog.find((item) => item.id === id));
assert.deepEqual(fluvalUvcClarifiers.map((item) => [item?.category,item?.ratedFlowLph,item?.powerW,item?.integratedUvcW,item?.recommendedMaxL]), [["uv",930,3,3,400],["uv",2130,6,6,1500]], "Fluval hat üstü UV-C berraklaştırıcıları resmî akış, güç ve hacim sınırlarını taşımalı");
assert(fluvalUvcClarifiers.every((item) => item?.specifications.includes("ana biyolojik filtre yerine geçmez") && item.sourceUrl?.startsWith("https://fluvalaquatics.com/") && item.additionalSourceUrls?.length === 2 && item.verifiedAt === "2026-09-28"), "Fluval UV-C cihazları filtre kapasitesine karışmadan resmî ürün ve kılavuz kaynaklarına bağlı olmalı");

const expectedJblCurrentHardware = [
  ["jbl-protemp-cooler-x200-gen2","other",3,60,200],
  ["jbl-protemp-cooler-x300-gen2","other",4,90,300],
  ["jbl-procristal-uvc-compact-plus-5","uv",5,undefined,300],
  ["jbl-procristal-uvc-compact-plus-11","uv",11,undefined,800],
  ["jbl-procristal-uvc-compact-plus-18","uv",18,undefined,1500],
  ["jbl-procristal-uvc-compact-plus-36","uv",36,undefined,3000],
];
for (const [id,category,powerW,minL,maxL] of expectedJblCurrentHardware) {
  const item = equipmentCatalog.find((entry) => entry.id === id);
  assert(item, `Güncel JBL cihazı eksik: ${id}`);
  assert.equal(item.category, category, `${id} doğru kategoriye ayrılmalı`);
  assert.equal(item.powerW, powerW, `${id} resmî güç değerini taşımalı`);
  assert.equal(item.recommendedMinL, minL, `${id} yalnız yayımlanan alt hacmi taşımalı`);
  assert.equal(item.recommendedMaxL, maxL, `${id} resmî üst hacmi taşımalı`);
  assert.equal(item.verifiedAt, "2026-09-14", `${id} güncel doğrulama tarihi taşımalı`);
}

const jblProFlowIds = ["jbl-proflow-t300","jbl-proflow-t500","jbl-proflow-u800","jbl-proflow-u1100","jbl-proflow-u2000"];
assert.deepEqual(jblProFlowIds.map((id) => equipmentCatalog.find((item) => item.id === id)?.ratedFlowLph), [300,500,900,1200,2000], "JBL ProFlow pompaları resmî azami debileriyle bulunmalı");
assert(jblProFlowIds.every((id) => equipmentCatalog.find((item) => item.id === id)?.category === "other"), "JBL ProFlow sirkülasyon pompaları ana biyolojik filtre sayılmamalı");

const jblCurrentExternalFilterIds = ["e402","e702","e902","e1502","e1902"].map((model) => "jbl-cristalprofi-" + model);
const jblCurrentExternalFilters = jblCurrentExternalFilterIds.map((id) => equipmentCatalog.find((item) => item.id === id));
assert(jblCurrentExternalFilters.every(Boolean), "JBL CRISTALPROFI 02 neslinin beş güncel dış filtresi bulunmalı");
assert.deepEqual(jblCurrentExternalFilters.map((item) => item?.ratedFlowLph), [450,700,900,1400,1900], "JBL güncel dış filtreleri resmî azami pompa debilerini korumalı");
assert.deepEqual(jblCurrentExternalFilters.map((item) => item?.powerW), [4,9,11,20,36], "JBL güncel dış filtreleri resmî güç değerlerini korumalı");
assert.deepEqual(jblCurrentExternalFilters.map((item) => [item?.recommendedMinL,item?.recommendedMaxL]), [[40,120],[60,200],[90,300],[160,600],[200,800]], "JBL güncel dış filtreleri resmî hacim aralıklarını korumalı");
const jblArchiveExternalFilterIds = [
  "jbl-cristalprofi-e401-archive","jbl-cristalprofi-e701-archive","jbl-cristalprofi-e901-archive",
  "jbl-cristalprofi-e1501-archive","jbl-cristalprofi-e1901-archive","jbl-cristalprofi-e401-white-archive",
  "jbl-cristalprofi-e701-white-archive","jbl-cristalprofi-e901-white-archive",
];
const jblArchiveExternalFilters = jblArchiveExternalFilterIds.map((id) => equipmentCatalog.find((item) => item.id === id));
assert(jblArchiveExternalFilters.every(Boolean), "JBL dış filtre arşivindeki beş 01 nesli ve üç WHITE model bulunmalı");
assert([...jblCurrentExternalFilters,...jblArchiveExternalFilters].every((item) => item?.category === "filter" && item.adjustableFlow === true && item.sourceUrl?.startsWith("https://www.jbl.de/") && item.verifiedAt === "2026-09-16"), "JBL dış filtreleri ayarlanabilir filtre olarak resmî kaynak ve güncel doğrulama tarihi taşımalı");
const jblE1501 = equipmentCatalog.find((item) => item.id === "jbl-cristalprofi-e1501-archive");
assert(jblE1501?.ratedFlowLph === undefined && jblE1501?.specifications.includes("1400 L/saat") && jblE1501?.specifications.includes("1500 L/saat") && jblE1501?.specifications.includes("debi otomatik biyolojik yük hesabına alınmaz"), "JBL e1501 için çelişen resmî debi değeri otomatik hesaba alınmamalı");
assert(jblArchiveExternalFilters.filter((item) => item?.id.includes("-white-")).every((item) => item?.model.includes("WHITE") && item.specifications.includes("beyaz 01 nesli")), "JBL WHITE dış filtreler renk varyantı ve arşiv nesli olarak ayrılmalı");

const jblCurrentInternalFilterIds = ["jbl-procristal-i30","jbl-cristalprofi-i60","jbl-cristalprofi-i80","jbl-cristalprofi-i100","jbl-cristalprofi-i200","jbl-cristalprofi-m-greenline"];
const jblCurrentInternalFilters = jblCurrentInternalFilterIds.map((id) => equipmentCatalog.find((item) => item.id === id));
assert(jblCurrentInternalFilters.every(Boolean), "JBL iç filtre grubunun altı güncel modeli bulunmalı");
assert.deepEqual(jblCurrentInternalFilters.map((item) => item?.ratedFlowLph), [200,420,420,720,720,200], "JBL güncel iç filtreleri resmî azami pompa debilerini korumalı");
assert.deepEqual(jblCurrentInternalFilters.map((item) => [item?.recommendedMinL,item?.recommendedMaxL]), [[10,60],[40,80],[60,110],[90,160],[130,200],[20,80]], "JBL güncel iç filtreleri resmî hacim aralıklarını korumalı");
const jblArchiveInternalFilterIds = ["jbl-prosilent-tekair-archive","jbl-cristalprofi-i40-archive","jbl-cristalprofi-i60-archive","jbl-cristalprofi-i80-archive","jbl-cristalprofi-i100-archive","jbl-cristalprofi-i200-archive"];
const jblArchiveInternalFilters = jblArchiveInternalFilterIds.map((id) => equipmentCatalog.find((item) => item.id === id));
assert(jblArchiveInternalFilters.every(Boolean), "JBL iç filtre arşivindeki TekAir ve beş CristalProfi modeli bulunmalı");
assert(jblArchiveInternalFilters.every((item) => item?.category === "filter" && item.sourceUrl?.startsWith("https://www.jbl.de/") && item.verifiedAt === "2026-09-16"), "JBL arşiv iç filtreleri filtre kategorisinde, resmî kaynaklı ve güncel doğrulama tarihli olmalı");
const jblTekAir = equipmentCatalog.find((item) => item.id === "jbl-prosilent-tekair-archive");
assert(jblTekAir?.passiveComponent === true && jblTekAir.ratedFlowLph === undefined && jblTekAir.recommendedMaxL === 80, "JBL TekAir hava motoru olmadan pasif kalmalı ve hava debisi su debisine dönüşmemeli");
const jblI40Archive = equipmentCatalog.find((item) => item.id === "jbl-cristalprofi-i40-archive");
assert(jblI40Archive?.ratedFlowLph === undefined && jblI40Archive.powerW === 3 && jblI40Archive.recommendedMinL === 10 && jblI40Archive.recommendedMaxL === 40, "JBL i40 hava debisini su debisi olarak kullanmadan resmî güç ve hacim aralığını taşımalı");
const jblMotorDrivenArchiveInternal = jblArchiveInternalFilters.slice(2);
assert.deepEqual(jblMotorDrivenArchiveInternal.map((item) => [item?.ratedFlowLph,item?.powerW]), [[800,11],[800,11],[800,11],[800,11]], "JBL eski i60-i200 nesli resmî 300-800 L/saat ve 11 W teknik verilerini korumalı");
assert(jblMotorDrivenArchiveInternal.every((item) => item?.recommendedMinL === undefined && item?.recommendedMaxL === undefined && item?.adjustableFlow === true), "JBL eski i60-i200 için yayımlanmayan hacim aralığı uydurulmamalı");

const jblCurrentRodHeaterIds = ["26","51","101","151","201","301"].map((model) => "jbl-protemp-s-" + model);
const jblCurrentRodHeaters = jblCurrentRodHeaterIds.map((id) => equipmentCatalog.find((item) => item.id === id));
assert(jblCurrentRodHeaters.every(Boolean), "JBL PROTEMP S güncel çubuk ısıtıcı ailesinin altı modeli bulunmalı");
assert.deepEqual(jblCurrentRodHeaters.map((item) => item?.powerW), [25,50,100,150,200,300], "JBL PROTEMP S modelleri resmî güç değerlerini korumalı");
assert.deepEqual(jblCurrentRodHeaters.map((item) => [item?.recommendedMinL,item?.recommendedMaxL]), [[10,50],[30,80],[50,160],[90,200],[100,300],[160,400]], "JBL PROTEMP S modelleri resmî hacim aralıklarını korumalı");
assert(jblCurrentRodHeaters.every((item) => item?.category === "heater" && item.sourceUrl?.startsWith("https://www.jbl.de/") && item.verifiedAt === "2026-09-16" && item.specifications.includes("önceki S")), "JBL PROTEMP S güncel adları eski resmî adlarla aranabilir ve kaynaklı olmalı");
const jblInlineHeaters = ["jbl-protemp-e300","jbl-protemp-e500"].map((id) => equipmentCatalog.find((item) => item.id === id));
assert.deepEqual(jblInlineHeaters.map((item) => item?.model), ["PROTEMP e301","PROTEMP e501"], "JBL dış ısıtıcıları güncel üretici model başlıklarını göstermeli");
assert.deepEqual(jblInlineHeaters.map((item) => [item?.powerW,item?.recommendedMinL,item?.recommendedMaxL]), [[300,90,300],[500,160,600]], "JBL dış ısıtıcıları resmî güç ve hacim aralıklarını korumalı");
assert(jblInlineHeaters.every((item) => item?.specifications.includes("Önceki e") && item.verifiedAt === "2026-09-16"), "JBL e301/e501 eski e300/e500 adlarıyla da aranabilir olmalı");
const jblCurrentSubstrateHeaters = ["10","20","40","60"].map((model) => equipmentCatalog.find((item) => item.id === `jbl-protemp-b-${model}-iii`));
assert(jblCurrentSubstrateHeaters.every(Boolean), "JBL PROTEMP b III güncel taban ısıtıcı ailesinin dört modeli bulunmalı");
assert.deepEqual(jblCurrentSubstrateHeaters.map((item) => [item?.powerW,item?.recommendedMinL,item?.recommendedMaxL]), [[10,40,120],[20,60,200],[40,90,300],[60,160,600]], "JBL PROTEMP b III resmî güç ve hacim aralıklarını korumalı");
assert(jblCurrentSubstrateHeaters.every((item) => item?.category === "heater" && item.passiveComponent === true && item.specifications.includes("ana ısıtıcının yerine geçmez") && item.specifications.includes("kumda önerilmez") && item.sourceUrl === "https://www.jbl.de/en/products/detail/9317/jbl-protemp-b-iii?country=gb" && item.verifiedAt === "2026-09-16"), "JBL taban ısıtıcıları Isıtıcı seçicisinde bulunmalı fakat ana su ısıtma kapasitesine katılmamalı");
const jblArchiveSubstrateHeaters = ["10","20","40","60"].map((model) => equipmentCatalog.find((item) => item.id === `jbl-protemp-b-${model}-archive`));
assert.deepEqual(jblArchiveSubstrateHeaters.map((item) => [item?.powerW,item?.recommendedMinL,item?.recommendedMaxL]), [[10,50,120],[20,100,250],[40,200,400],[60,300,600]], "JBL ilk nesil taban ısıtıcıları resmî arşiv güç ve hacim aralıklarını korumalı");
const jblArchiveSubstrateHeatersV2 = ["40","60"].map((model) => equipmentCatalog.find((item) => item.id === `jbl-protemp-b-${model}-ii-archive`));
assert.deepEqual(jblArchiveSubstrateHeatersV2.map((item) => [item?.powerW,item?.recommendedMinL,item?.recommendedMaxL]), [[40,200,400],[60,300,600]], "JBL ikinci nesil taban ısıtıcıları resmî arşiv güç ve hacim aralıklarını korumalı");
assert([...jblArchiveSubstrateHeaters,...jblArchiveSubstrateHeatersV2].every((item) => item?.category === "heater" && item.passiveComponent === true && item.model.includes("Arşiv") && item.specifications.includes("ana su ısıtıcısının yerine geçmez") && item.sourceUrl?.startsWith("https://www.jbl.de/") && item.verifiedAt === "2026-09-16"), "JBL arşiv taban ısıtıcıları ana su ısıtma kapasitesine karışmamalı");
const jblProtempExternal = equipmentCatalog.find((item) => item.id === "jbl-protemp-external");
assert.deepEqual([jblProtempExternal?.model,jblProtempExternal?.category,jblProtempExternal?.powerW,jblProtempExternal?.recommendedMinL,jblProtempExternal?.recommendedMaxL], ["PROTEMP EXTERNAL","heater",500,10,600], "JBL 2026 PROTEMP EXTERNAL resmî güç ve hacim aralığıyla bulunmalı");
assert(jblProtempExternal?.sourceUrl?.startsWith("https://www.jbl.de/") && jblProtempExternal.verifiedAt === "2026-09-16", "JBL PROTEMP EXTERNAL güncel resmî kaynağa bağlı olmalı");
const jblCurrentAirPumps = ["60","100","200","400","600"].map((model) => equipmentCatalog.find((item) => item.id === `jbl-proair-a${model}`));
assert(jblCurrentAirPumps.every(Boolean), "JBL PROAIR güncel hava pompası ailesinin beş modeli bulunmalı");
assert.deepEqual(jblCurrentAirPumps.map((item) => [item?.ratedFlowLph,item?.powerW]), [[60,2.5],[100,2.5],[200,3.2],[400,5],[600,10]], "JBL PROAIR modelleri resmî hava debisi ve güç değerlerini korumalı");
assert.deepEqual(jblCurrentAirPumps.map((item) => [item?.recommendedMinL,item?.recommendedMaxL]), [[40,120],[60,200],[90,300],[160,600],[200,800]], "JBL PROAIR modelleri resmî akvaryum hacim aralıklarını korumalı");
assert(jblCurrentAirPumps.every((item) => item?.category === "air_pump" && item.sourceUrl?.startsWith("https://www.jbl.de/") && item.verifiedAt === "2026-09-16"), "JBL PROAIR ailesi yalnız hava motoru kategorisinde ve güncel resmî kaynaklarla bulunmalı");
assert(jblCurrentAirPumps[0]?.adjustableFlow !== true && jblCurrentAirPumps.slice(1).every((item) => item?.adjustableFlow === true), "JBL PROAIR a60 ayarsız, a100-a600 elektronik ayarlı olarak ayrılmalı");
const jblArchiveAirPumpIds = ["jbl-proair-a50-archive","jbl-prosilent-a50-archive","jbl-prosilent-a100-archive","jbl-prosilent-a200-archive","jbl-prosilent-a300-archive","jbl-prosilent-a400-archive"];
const jblArchiveAirPumps = jblArchiveAirPumpIds.map((id) => equipmentCatalog.find((item) => item.id === id));
assert(jblArchiveAirPumps.every(Boolean), "JBL hava pompası arşivindeki iki a50 ve dört PROSILENT modeli bulunmalı");
assert.deepEqual(jblArchiveAirPumps.map((item) => item?.ratedFlowLph), [50,50,100,200,300,400], "JBL arşiv hava motorları resmî hava debilerini korumalı");
assert.deepEqual(jblArchiveAirPumps.map((item) => [item?.recommendedMinL,item?.recommendedMaxL]), [[10,50],[10,50],[40,150],[50,300],[100,400],[200,600]], "JBL arşiv hava motorları doğrulanmış hacim aralıklarını korumalı");
assert.deepEqual(jblArchiveAirPumps.map((item) => item?.powerW), [undefined,2.3,undefined,undefined,3.9,5.5], "JBL arşiv hava motorlarında yalnız çelişmeyen resmî güç değerleri kullanılmalı");
assert(jblArchiveAirPumps.every((item) => item?.category === "air_pump" && item.model.includes("Arşiv") && item.sourceUrl?.startsWith("https://www.jbl.de/") && item.verifiedAt === "2026-09-16"), "JBL arşiv hava motorları güncel ürün gibi gösterilmeden resmî kaynaklara bağlı olmalı");
assert(jblArchiveAirPumps[0]?.specifications.includes("2,3 W") && jblArchiveAirPumps[0]?.specifications.includes("3 W") && jblArchiveAirPumps[2]?.specifications.includes("2,9 W") && jblArchiveAirPumps[2]?.specifications.includes("3 W") && jblArchiveAirPumps[3]?.specifications.includes("3,5 W") && jblArchiveAirPumps[3]?.specifications.includes("3,4 W"), "JBL arşivindeki resmî teknik çelişkiler kullanıcıdan saklanmamalı");
const jblLegacySAirPumps = ["100","200","500"].map((model) => equipmentCatalog.find((item) => item.id === `jbl-prosilent-s${model}-archive`));
assert(jblLegacySAirPumps.every(Boolean), "JBL'nin eski ProSilent S100/S200/S500 hava motorları bulunmalı");
assert.deepEqual(jblLegacySAirPumps.map((item) => [item?.ratedFlowLph,item?.powerW]), [[60,1.5],[100,2],[150,2.5]], "JBL ProSilent S serisi doğrulanmış hava debisi ve güç değerlerini korumalı");
assert(jblLegacySAirPumps[0]?.adjustableFlow !== true && jblLegacySAirPumps.slice(1).every((item) => item?.adjustableFlow === true), "JBL ProSilent S100 ayarsız, S200 ve S500 mekanik ayarlı kalmalı");
assert(jblLegacySAirPumps.every((item) => item?.category === "air_pump" && item.model.includes("Arşiv") && item.recommendedMinL === undefined && item.recommendedMaxL === undefined && item.sourceUrl === "https://www.jbl.de/de/download/458/Gebrauchsanleitungen/JBL_ProSilent.pdf" && item.verifiedAt === "2026-09-17"), "Eski JBL S serisine yayımlanmayan akvaryum hacmi uydurulmamalı ve resmî kılavuz korunmalı");
const jblEcoAir40 = equipmentCatalog.find((item) => item.id === "jbl-ecoair-40-archive");
assert(jblEcoAir40?.category === "air_pump" && jblEcoAir40.model.includes("Arşiv") && jblEcoAir40.sourceUrl?.startsWith("https://www.jbl.de/") && jblEcoAir40.verifiedAt === "2026-09-25", "JBL EcoAir 40 resmî katalog ve sistem kılavuzuyla arşiv hava motoru olarak bulunmalı");
assert.deepEqual([jblEcoAir40?.ratedFlowLph,jblEcoAir40?.powerW],[80,3], "JBL EcoAir 40 resmî yaklaşık hava debisi ve güç değerlerini taşımalı");
assert(jblEcoAir40?.recommendedMinL === undefined && jblEcoAir40?.recommendedMaxL === undefined && jblEcoAir40?.capacityDataNote === undefined && jblEcoAir40?.specifications.includes("akvaryum hacmi yayımlanmamış"), "JBL EcoAir 40'a yayımlanmayan akvaryum hacmi uydurulmamalı");
const jblAerationAccessoryIds = [
  "jbl-prosilent-safe","jbl-prosilent-control","jbl-prosilent-tube",
  "jbl-prosilent-aeras-micro-s2","jbl-prosilent-aeras-micro-s3",
  "jbl-prosilent-aeras-micro-s","jbl-prosilent-aeras-micro-m",
  "jbl-prosilent-aeras-micro-plus-m","jbl-prosilent-aeras-micro-plus-l",
  "jbl-prosilent-aeras-micro-ball-l",
  "jbl-aeras-marin-s-archive","jbl-aeras-marin-m-archive",
  "jbl-prosilent-ceramic-s-archive","jbl-prosilent-ceramic-m-archive","jbl-prosilent-ceramic-l-archive",
];
const jblAerationAccessories = jblAerationAccessoryIds.map((id) => equipmentCatalog.find((item) => item.id === id));
assert(jblAerationAccessories.every(Boolean), "JBL havalandırma aksesuar ailesinin 15 doğrulanmış seçeneği bulunmalı");
assert(jblAerationAccessories.every((item) => item?.category === "other" && item.passiveComponent === true && item.sourceUrl?.startsWith("https://www.jbl.de/") && item.verifiedAt === "2026-09-17"), "JBL havalandırma aksesuarları pasif kalmalı ve resmî JBL kaynağı taşımalı");
assert(jblAerationAccessories.every((item) => item?.ratedFlowLph === undefined && item.powerW === undefined && item.recommendedMinL === undefined && item.recommendedMaxL === undefined), "JBL pasif havalandırma parçaları pompa debisi, gücü veya hacim kapasitesi kazanmamalı");
assert.deepEqual(
  ["jbl-prosilent-aeras-micro-s2","jbl-prosilent-aeras-micro-s3","jbl-prosilent-aeras-micro-s","jbl-prosilent-aeras-micro-m","jbl-prosilent-aeras-micro-plus-m","jbl-prosilent-aeras-micro-plus-l","jbl-prosilent-aeras-micro-ball-l"].map((id) => equipmentCatalog.find((item) => item.id === id)?.specifications.match(/(?:Ø )?\d+(?: × \d+)? mm/g)),
  [["Ø 21 mm"],["26 × 14 mm","Ø 14 mm"],["100 mm"],["140 mm"],["140 mm"],["270 mm"],["Ø 40 mm"]],
  "JBL güncel hava taşları resmî ölçülerini korumalı",
);
assert.deepEqual(
  ["jbl-aeras-marin-s-archive","jbl-aeras-marin-m-archive","jbl-prosilent-ceramic-s-archive","jbl-prosilent-ceramic-m-archive","jbl-prosilent-ceramic-l-archive"].map((id) => equipmentCatalog.find((item) => item.id === id)?.specifications.match(/\d+ mm/)?.[0]),
  ["45 mm","65 mm","55 mm","105 mm","155 mm"],
  "JBL arşiv hava taşı boyları eski resmî katalogla aynı kalmalı",
);
assert(["jbl-aeras-marin-s-archive","jbl-aeras-marin-m-archive","jbl-prosilent-ceramic-s-archive","jbl-prosilent-ceramic-m-archive","jbl-prosilent-ceramic-l-archive"].every((id) => equipmentCatalog.find((item) => item.id === id)?.model.includes("Arşiv")), "Üretimden kalkan JBL hava taşları güncel ürün gibi sunulmamalı");
const jblTubingAccessoryIds = [
  "jbl-backflow-protection-archive",
  "jbl-aquatube-green-4-6","jbl-aquatube-green-9-12","jbl-aquatube-green-12-16","jbl-aquatube-green-16-22",
  "jbl-aquatube-grey-4-6","jbl-aquatube-grey-9-12","jbl-aquatube-grey-12-16","jbl-aquatube-grey-16-22","jbl-aquatube-grey-19-27",
  "jbl-silicone-hose-4-6",
  "jbl-aquarium-tubing-green-cardboard-4-6","jbl-aquarium-tubing-green-cardboard-9-12","jbl-aquarium-tubing-green-cardboard-12-16","jbl-aquarium-tubing-green-cardboard-16-22",
  "jbl-aquarium-tubing-grey-cardboard-4-6","jbl-aquarium-tubing-grey-cardboard-9-12","jbl-aquarium-tubing-grey-cardboard-12-16","jbl-aquarium-tubing-grey-cardboard-16-22",
  "jbl-aquarium-tubing-silicone-cardboard-4-6",
  "jbl-aquarium-tubing-green-reel-4-6-archive","jbl-aquarium-tubing-green-reel-9-12-archive","jbl-aquarium-tubing-green-reel-12-16-archive","jbl-aquarium-tubing-green-reel-16-22-archive",
  "jbl-aquarium-tubing-grey-reel-4-6-archive","jbl-aquarium-tubing-grey-reel-9-12-archive","jbl-aquarium-tubing-grey-reel-12-16-archive","jbl-aquarium-tubing-grey-reel-16-22-archive",
  "jbl-silicone-hose-4-6-reel-archive",
];
const jblTubingAccessories = jblTubingAccessoryIds.map((id) => equipmentCatalog.find((item) => item.id === id));
assert(jblTubingAccessories.every(Boolean), "JBL çek valf ve hortum paketinin 29 doğrulanmış seçeneği bulunmalı");
assert(jblTubingAccessories.every((item) => item?.category === "other" && item.passiveComponent === true && item.sourceUrl?.startsWith("https://www.jbl.de/") && item.verifiedAt === "2026-09-17"), "JBL çek valf ve hortumları pasif kalmalı ve doğrudan resmî kaynak taşımalı");
assert(jblTubingAccessories.every((item) => item?.ratedFlowLph === undefined && item.powerW === undefined && item.recommendedMinL === undefined && item.recommendedMaxL === undefined), "JBL hortum ve çek valfleri cihaz kapasitesi kazanmamalı");
assert.deepEqual(
  ["jbl-aquarium-tubing-green-reel-4-6-archive","jbl-aquarium-tubing-green-reel-9-12-archive","jbl-aquarium-tubing-green-reel-12-16-archive","jbl-aquarium-tubing-green-reel-16-22-archive"].map((id) => equipmentCatalog.find((item) => item.id === id)?.specifications.match(/· (\d+) m/)?.[1]),
  ["200","70","50","25"],
  "JBL eski yeşil hortum makaraları resmî uzunluklarını korumalı",
);
assert.deepEqual(
  ["jbl-aquarium-tubing-green-cardboard-4-6","jbl-aquarium-tubing-green-cardboard-9-12","jbl-aquarium-tubing-green-cardboard-12-16","jbl-aquarium-tubing-green-cardboard-16-22"].map((id) => equipmentCatalog.find((item) => item.id === id)?.specifications.match(/· (\d+) m/)?.[1]),
  ["180","60","40","18"],
  "JBL güncel karton makaralı yeşil hortumları resmî uzunluklarını korumalı",
);
assert.deepEqual(
  ["jbl-aquarium-tubing-grey-cardboard-4-6","jbl-aquarium-tubing-grey-cardboard-9-12","jbl-aquarium-tubing-grey-cardboard-12-16","jbl-aquarium-tubing-grey-cardboard-16-22"].map((id) => equipmentCatalog.find((item) => item.id === id)?.specifications.match(/· (\d+) m/)?.[1]),
  ["180","60","40","18"],
  "JBL güncel karton makaralı gri hortumları doğrulanmış uzunluklarını korumalı",
);
assert.deepEqual(
  ["jbl-aquarium-tubing-grey-reel-4-6-archive","jbl-aquarium-tubing-grey-reel-9-12-archive","jbl-aquarium-tubing-grey-reel-12-16-archive","jbl-aquarium-tubing-grey-reel-16-22-archive"].map((id) => equipmentCatalog.find((item) => item.id === id)?.specifications.match(/· (\d+) m/)?.[1]),
  ["200","70","50","25"],
  "JBL eski gri hortum makaraları arşiv katalog uzunluklarını korumalı",
);
const jblCurrentSiliconeReel = equipmentCatalog.find((item) => item.id === "jbl-aquarium-tubing-silicone-cardboard-4-6");
assert(jblCurrentSiliconeReel?.specifications.includes("180 m") && !jblCurrentSiliconeReel.model.includes("Arşiv"), "JBL güncel silikon karton makarası 4/6 mm ve 180 m olarak bulunmalı");
assert(["jbl-aquarium-tubing-grey-reel-4-6-archive","jbl-aquarium-tubing-grey-reel-9-12-archive","jbl-aquarium-tubing-grey-reel-12-16-archive","jbl-aquarium-tubing-grey-reel-16-22-archive"].every((id) => equipmentCatalog.find((item) => item.id === id)?.model.includes("Arşiv")), "JBL eski plastik makaralı gri hortumlar güncel ürün gibi gösterilmemeli");
const jblGrey1927 = equipmentCatalog.find((item) => item.id === "jbl-aquatube-grey-19-27");
assert(jblGrey1927?.model.includes("19/27") && jblGrey1927.specifications.includes("19/25") && jblGrey1927.specifications.includes("çelişkisi"), "JBL gri hortum sayfasındaki 19/25 ve 19/27 üretici çelişkisi kullanıcıdan saklanmamalı");
const jblHoseFittingIds = [
  "jbl-double-stopcock-quick-coupling-12-16","jbl-double-stopcock-quick-coupling-16-22","jbl-double-stopcock-quick-coupling-19-25",
  "jbl-antikink-12-16","jbl-antikink-16-22","jbl-clipsafe-vario","jbl-clipsafe-archive","jbl-cleany",
];
const jblHoseFittings = jblHoseFittingIds.map((id) => equipmentCatalog.find((item) => item.id === id));
assert(jblHoseFittings.every(Boolean), "JBL hortum bağlantısı, kelepçe ve temizleme ailesinin sekiz seçeneği bulunmalı");
assert(jblHoseFittings.every((item) => item?.category === "other" && item.passiveComponent === true && item.sourceUrl?.startsWith("https://www.jbl.de/") && item.verifiedAt === "2026-09-17"), "JBL hortum bağlantı aksesuarları pasif ve doğrudan resmî kaynaklı kalmalı");
assert(jblHoseFittings.every((item) => item?.ratedFlowLph === undefined && item.powerW === undefined && item.recommendedMinL === undefined && item.recommendedMaxL === undefined), "JBL hortum bağlantıları cihaz debisi, gücü veya hacim kapasitesi kazanmamalı");
assert.deepEqual(
  ["jbl-double-stopcock-quick-coupling-12-16","jbl-double-stopcock-quick-coupling-16-22","jbl-double-stopcock-quick-coupling-19-25"].map((id) => equipmentCatalog.find((item) => item.id === id)?.model.match(/\d+\/\d+/)?.[0]),
  ["12/16","16/22","19/25"],
  "JBL çift musluklu hızlı bağlantının üç güncel hortum çapı bulunmalı",
);
assert(equipmentCatalog.find((item) => item.id === "jbl-clipsafe-vario")?.specifications.includes("9–27 mm") && equipmentCatalog.find((item) => item.id === "jbl-clipsafe-archive")?.model.includes("Arşiv"), "JBL ClipSafe nesilleri ayarlı güncel ürün ve 12/16 mm arşiv ürün olarak ayrılmalı");
assert(equipmentCatalog.find((item) => item.id === "jbl-cleany")?.specifications.includes("160 cm") && equipmentCatalog.find((item) => item.id === "jbl-cleany")?.specifications.includes("9–30 mm"), "JBL Cleany resmî uzunluk ve hortum çapı aralığını korumalı");
const jblSuctionCupIds = [
  "jbl-suction-cup-clip-6","jbl-suction-cup-clip-12","jbl-suction-cup-clip-16","jbl-suction-cup-clip-23","jbl-suction-cup-clip-37",
  "jbl-suction-cup-hole-5-archive","jbl-suction-cup-hole-5-6","jbl-suction-cup-hole-12","jbl-slotted-suction-cup-2",
];
const jblSuctionCups = jblSuctionCupIds.map((id) => equipmentCatalog.find((item) => item.id === id));
assert(jblSuctionCups.every(Boolean), "JBL vantuz ailesinin sekiz güncel ve bir arşiv seçeneği bulunmalı");
assert(jblSuctionCups.every((item) => item?.category === "other" && item.passiveComponent === true && item.sourceUrl?.startsWith("https://www.jbl.de/") && item.verifiedAt === "2026-09-17"), "JBL vantuzları pasif ve doğrudan resmî kaynaklı kalmalı");
assert(jblSuctionCups.every((item) => item?.ratedFlowLph === undefined && item.powerW === undefined && item.recommendedMinL === undefined && item.recommendedMaxL === undefined), "JBL vantuzları cihaz debisi, gücü veya hacim kapasitesi kazanmamalı");
assert.deepEqual(
  ["jbl-suction-cup-clip-6","jbl-suction-cup-clip-12","jbl-suction-cup-clip-16","jbl-suction-cup-clip-23","jbl-suction-cup-clip-37"].map((id) => equipmentCatalog.find((item) => item.id === id)?.model.match(/\d+/)?.[0]),
  ["6","12","16","23","37"],
  "JBL klipsli vantuzların beş resmî çap seçeneği bulunmalı",
);
assert(equipmentCatalog.find((item) => item.id === "jbl-suction-cup-hole-5-archive")?.model.includes("Arşiv") && equipmentCatalog.find((item) => item.id === "jbl-slotted-suction-cup-2")?.specifications.includes("2–4 mm"), "JBL 5 mm delikli vantuz arşivde, yarıklı vantuz ise 2–4 mm kablolar için kalmalı");
const jblBreedingIds = ["jbl-babyhome-oxygen","jbl-babyhome-pro-air","jbl-nbox","jbl-discon","jbl-ceramic-spawning-cave"];
const jblBreedingEquipment = jblBreedingIds.map((id) => equipmentCatalog.find((item) => item.id === id));
assert(jblBreedingEquipment.every(Boolean), "JBL yavruluk ve yumurtlama yardımcılarının beş güncel ürünü bulunmalı");
assert(jblBreedingEquipment.every((item) => item?.category === "other" && item.sourceUrl?.startsWith("https://www.jbl.de/") && item.verifiedAt === "2026-09-17"), "JBL yavruluk ve yumurtlama yardımcıları doğrudan resmî kaynaklı kalmalı");
assert(equipmentCatalog.find((item) => item.id === "jbl-babyhome-oxygen")?.powerW === 3 && equipmentCatalog.find((item) => item.id === "jbl-babyhome-oxygen")?.passiveComponent !== true, "JBL BabyHome Oxygen dâhilî 3 W hava motoruyla aktif set olarak kalmalı");
assert(jblBreedingEquipment.filter((item) => item?.id !== "jbl-babyhome-oxygen").every((item) => item?.passiveComponent === true && item.powerW === undefined), "Motor içermeyen JBL yavruluk ve yumurtlama yardımcıları pasif kalmalı");
assert(equipmentCatalog.find((item) => item.id === "jbl-nbox")?.specifications.includes("2 L") && equipmentCatalog.find((item) => item.id === "jbl-discon")?.specifications.includes("25,5 cm") && equipmentCatalog.find((item) => item.id === "jbl-ceramic-spawning-cave")?.specifications.includes("Ø 11,5 cm"), "JBL yavruluk ve yumurtlama ürünleri resmî hacim ve ölçülerini korumalı");
const jblThermometerIds = [
  "jbl-aquarium-thermometer-float","jbl-aquarium-thermometer-slim","jbl-aquarium-thermometer-digital-strip","jbl-aquarium-thermometer-mini",
  "jbl-aquarium-thermometer-digiscan","jbl-aquarium-thermometer-digiscan-alarm-archive","jbl-aquarium-thermometer-digiscan-tube","jbl-hydrometer",
];
const jblThermometers = jblThermometerIds.map((id) => equipmentCatalog.find((item) => item.id === id));
assert(jblThermometers.every(Boolean), "JBL termometre ve hidrometre ailesinin sekiz seçeneği bulunmalı");
assert(jblThermometers.every((item) => item?.category === "other" && item.sourceUrl?.startsWith("https://www.jbl.de/") && item.verifiedAt === "2026-09-17"), "JBL termometre ve hidrometreleri doğrudan resmî kaynaklı kalmalı");
assert(["jbl-aquarium-thermometer-float","jbl-aquarium-thermometer-slim","jbl-aquarium-thermometer-digital-strip","jbl-aquarium-thermometer-mini","jbl-hydrometer"].every((id) => equipmentCatalog.find((item) => item.id === id)?.passiveComponent === true), "JBL pilsiz termometre ve hidrometreler pasif kalmalı");
assert(["jbl-aquarium-thermometer-digiscan","jbl-aquarium-thermometer-digiscan-alarm-archive","jbl-aquarium-thermometer-digiscan-tube"].every((id) => equipmentCatalog.find((item) => item.id === id)?.passiveComponent !== true), "JBL pilli DigiScan modelleri pasif parça gibi işaretlenmemeli");
assert(equipmentCatalog.find((item) => item.id === "jbl-aquarium-thermometer-digiscan-alarm-archive")?.model.includes("Arşiv") && equipmentCatalog.find((item) => item.id === "jbl-aquarium-thermometer-digiscan-tube")?.specifications.includes("12–26 mm"), "JBL DigiScan Alarm arşiv durumu ve Tube hortum aralığı korunmalı");
assert(equipmentCatalog.find((item) => item.id === "jbl-hydrometer")?.specifications.includes("1,016–1,028") && equipmentCatalog.find((item) => item.id === "jbl-hydrometer")?.specifications.includes("0,0005"), "JBL hidrometre resmî yoğunluk aralığı ve çözünürlüğünü korumalı");
const jblAquaPadIds = ["jbl-aquapad-80-41","jbl-aquapad-60-31","jbl-aquapad-100-40","jbl-aquapad-100-50","jbl-aquapad-120-40","jbl-aquapad-120-50","jbl-aquapad-150-51"];
const jblAquaPads = jblAquaPadIds.map((id) => equipmentCatalog.find((item) => item.id === id));
assert(jblAquaPads.every(Boolean), "JBL AquaPad ailesinin yedi güncel ölçü seçeneği bulunmalı");
assert.deepEqual(jblAquaPads.map((item) => item?.model.replace("AquaPad ","")), ["80x41","60x31","100x40","100x50","120x40","120x50","150x51"], "JBL AquaPad ölçüleri güncel resmî seçimlerle aynı kalmalı");
const jblProscapeToolIds = [
  "jbl-proscape-tools-s20-straight","jbl-proscape-tools-s20-curved","jbl-proscape-tools-s30-straight","jbl-proscape-tools-s30-curved",
  "jbl-proscape-tools-s20-wave","jbl-proscape-tools-s16-spring","jbl-proscape-tools-p30-straight","jbl-proscape-tools-p30-slim-line",
  "jbl-proscape-tools-p30-curved","jbl-proscape-tools-sp30-straight","jbl-proscape-plantis-pins","jbl-combifix",
];
const jblProscapeTools = jblProscapeToolIds.map((id) => equipmentCatalog.find((item) => item.id === id));
assert(jblProscapeTools.every(Boolean), "JBL PROSCAPE araçlarının 12 seçilebilir ürün ve varyantı bulunmalı");
const jblAquaPadAndTools = [...jblAquaPads,...jblProscapeTools];
assert(jblAquaPadAndTools.every((item) => item?.brand === "JBL" && item.category === "other" && item.passiveComponent === true && item.sourceUrl?.startsWith("https://www.jbl.de/") && item.verifiedAt === "2026-09-17"), "JBL AquaPad ve PROSCAPE araçları pasif ve doğrudan resmî kaynaklı kalmalı");
assert(jblAquaPadAndTools.every((item) => item?.ratedFlowLph === undefined && item.powerW === undefined && item.recommendedMinL === undefined && item.recommendedMaxL === undefined), "JBL AquaPad ve PROSCAPE araçları cihaz debisi, gücü veya hacim kapasitesi kazanmamalı");
assert(equipmentCatalog.find((item) => item.id === "jbl-proscape-tools-s16-spring")?.specifications.includes("16 cm") && equipmentCatalog.find((item) => item.id === "jbl-proscape-tools-sp30-straight")?.specifications.includes("62 mm ve 25 mm"), "JBL PROSCAPE makas ve spatula ölçüleri korunmalı");
assert(equipmentCatalog.find((item) => item.id === "jbl-proscape-plantis-pins")?.specifications.includes("12 adet") && equipmentCatalog.find((item) => item.id === "jbl-combifix")?.specifications.includes("46 cm"), "JBL Plantis Pins paket adedi ve CombiFix uzunluğu korunmalı");
const jblArchiveCoolers = ["jbl-protemp-cooler-x200-archive","jbl-protemp-cooler-x300-archive","jbl-cooler-100-archive","jbl-cooler-200-archive","jbl-cooler-300-archive"].map((id) => equipmentCatalog.find((item) => item.id === id));
assert(jblArchiveCoolers.every(Boolean), "JBL soğutma arşivindeki beş fan modeli bulunmalı");
assert.deepEqual(jblArchiveCoolers.map((item) => item?.powerW), [3,4,5.5,11.2,15.3], "JBL arşiv soğutucuları resmî güç değerlerini korumalı");
assert.deepEqual(jblArchiveCoolers.map((item) => [item?.recommendedMinL,item?.recommendedMaxL]), [[undefined,200],[90,300],[60,100],[100,200],[200,300]], "JBL arşiv soğutucuları doğrulanmış hacim sınırlarını korumalı ve x200 çelişkisini kesin alt sınıra çevirmemeli");
assert(jblArchiveCoolers.every((item) => item?.category === "other" && item.model.includes("Arşiv") && item.sourceUrl?.startsWith("https://www.jbl.de/") && item.verifiedAt === "2026-09-16"), "JBL arşiv soğutucuları güncel ürün veya ısıtıcı gibi gösterilmemeli");
const jblArchiveCoolControl = equipmentCatalog.find((item) => item.id === "jbl-coolcontrol-archive");
assert(jblArchiveCoolControl?.passiveComponent === true && jblArchiveCoolControl.specifications.includes("1–50 W") && jblArchiveCoolControl.specifications.includes("18–36 °C"), "JBL eski CoolControl bağımsız soğutucu kapasitesi kazanmadan resmî kontrol aralığını taşımalı");

const jblNaturGen2 = equipmentCatalog.filter((item) => item.id.startsWith("jbl-led-solar-natur-gen2-"));
const jblEffectGen2 = equipmentCatalog.filter((item) => item.id.startsWith("jbl-led-solar-effect-gen2-"));
assert.deepEqual(jblNaturGen2.map((item) => item.powerW), [16,20,28,31,47,48,53], "JBL LED SOLAR NATUR Gen 2'nin yedi resmî güç seçeneği bulunmalı");
assert.deepEqual(jblEffectGen2.map((item) => item.powerW), [8,9,14,17,20,21,22], "JBL LED SOLAR EFFECT Gen 2'nin yedi resmî güç seçeneği bulunmalı");
assert([...jblNaturGen2,...jblEffectGen2].every((item) => item.category === "lighting" && item.recommendedTankLengthCm && item.sourceUrl?.startsWith("https://www.jbl.de/")), "JBL LED seçenekleri yalnız aydınlatmada ve resmî kaynakla bulunmalı");

const jblProfloraSets = equipmentCatalog.filter((item) => /^jbl-proflora-co2-(basic|advanced|professional)-set-/.test(item.id));
assert.equal(jblProfloraSets.length, 9, "JBL PROFLORA BASIC, ADVANCED ve PROFESSIONAL ailelerinin U/M/V setleri bulunmalı");
for (const family of ["basic","advanced","professional"]) {
  const familySets = jblProfloraSets.filter((item) => item.id.includes(`-${family}-`));
  assert.deepEqual(familySets.map((item) => item.id.at(-1)), ["u","m","v"], `JBL PROFLORA ${family} ailesi U/M/V seçeneklerini korumalı`);
  assert(familySets.every((item) => item.recommendedMinL === 40 && item.recommendedMaxL === (family === "basic" ? 300 : 600)), `JBL PROFLORA ${family} setleri resmî hacim aralığını taşımalı`);
}
const jblProfloraControl = equipmentCatalog.filter((item) => item.id.startsWith("jbl-proflora-co2-") && ["jbl-proflora-co2-control","jbl-proflora-co2-ph-sensor-set","jbl-proflora-co2-calibration-set"].includes(item.id));
assert.equal(jblProfloraControl.length, 3, "JBL PROFLORA kontrol, pH sensörü ve kalibrasyon seti bulunmalı");
const jblProfloraRegulators = equipmentCatalog.filter((item) => item.sourceUrl?.includes("/group/9427/proflora-co2-regulator-adapt"));
const jblProfloraTaifun = equipmentCatalog.filter((item) => item.id.startsWith("jbl-proflora-co2-taifun-"));
assert.equal(jblProfloraRegulators.length, 7, "JBL PROFLORA regülatör ve adaptör ailesinin yedi güncel modeli bulunmalı");
assert.equal(jblProfloraTaifun.length, 14, "JBL PROFLORA TAIFUN ailesinin 14 güncel model ve varyantı bulunmalı");
assert([...jblProfloraSets,...jblProfloraControl,...jblProfloraRegulators].every((item) => item.brand === "JBL" && item.category === "co2" && item.verifiedAt === "2026-09-14"), "JBL PROFLORA set, kontrol ve regülatör paketi CO₂ kategorisinde ve doğrulama tarihiyle bulunmalı");
assert(jblProfloraTaifun.every((item) => item.brand === "JBL" && item.category === "co2" && item.sourceUrl?.includes("/products/detail/") && item.verifiedAt === "2026-09-16"), "JBL güncel TAIFUN ailesi doğrudan resmî ürün sayfası ve güncel doğrulama tarihi taşımalı");
assert.deepEqual(
  ["jbl-proflora-co2-taifun-spiral-5","jbl-proflora-co2-taifun-spiral-10"].map((id) => {
    const item = equipmentCatalog.find((entry) => entry.id === id);
    return [item?.recommendedMinL,item?.recommendedMaxL];
  }),
  [[40,200],[40,400]],
  "JBL TAIFUN SPIRAL 5/10 resmî hacim aralıklarını korumalı",
);
const jblCurrentInline = ["jbl-proflora-co2-taifun-inline","jbl-proflora-co2-taifun-inline-16-22","jbl-proflora-co2-taifun-inline-19-25"].map((id) => equipmentCatalog.find((item) => item.id === id));
assert.deepEqual(jblCurrentInline.map((item) => [item?.recommendedMinL,item?.recommendedMaxL]), [[40,300],[160,600],[200,800]], "JBL TAIFUN INLINE hortum seçenekleri resmî hacim aralıklarını korumalı");
const jblCurrentGlass = ["jbl-proflora-co2-taifun-glass-mini","jbl-proflora-co2-taifun-glass","jbl-proflora-co2-taifun-glass-maxi"].map((id) => equipmentCatalog.find((item) => item.id === id));
assert.deepEqual(jblCurrentGlass.map((item) => [item?.recommendedMinL,item?.recommendedMaxL]), [[40,120],[40,300],[160,800]], "JBL TAIFUN GLASS Mini/Midi/Maxi resmî hacim aralıklarını korumalı");
const jblCurrentTaifunPassiveIds = [
  "jbl-proflora-co2-taifun-count-safe","jbl-proflora-co2-taifun-safestop","jbl-proflora-co2-taifun-tube",
  "jbl-proflora-co2-taifun-tube-clear","jbl-proflora-co2-taifun-spiral-extend","jbl-proflora-co2-taifun-inline-membrane",
];
assert(jblCurrentTaifunPassiveIds.every((id) => {
  const item = equipmentCatalog.find((entry) => entry.id === id);
  return item?.passiveComponent === true && item.recommendedMinL === undefined && item.recommendedMaxL === undefined;
}), "JBL güncel sayaç, valf, hortum, uzatma ve membran kayıtları bağımsız kapasite kazanmamalı");
assert([...jblCurrentInline,...jblCurrentGlass].every((item) => item?.passiveComponent !== true), "JBL güncel INLINE ve GLASS difüzörleri pasif aksesuar sayılmamalı");
const jblLegacyBioCo2Ids = ["jbl-proflora-bio80-eco","jbl-proflora-bio80","jbl-proflora-bio160","jbl-proflora-biorefill"];
const jblLegacyBioCo2 = jblLegacyBioCo2Ids.map((id) => equipmentCatalog.find((item) => item.id === id));
assert(jblLegacyBioCo2.every(Boolean), "JBL eski Bio-CO₂ kayıtları eksiksiz bulunmalı");
assert.deepEqual(jblLegacyBioCo2.map((item) => item.model), ["PROFLORA Bio80 eco","PROFLORA Bio80","PROFLORA Bio160","PROFLORA BioRefill"], "JBL eski Bio-CO₂ grubunun dört benzersiz modeli bulunmalı");
assert.deepEqual(jblLegacyBioCo2.slice(0,3).map((item) => [item.recommendedMinL,item.recommendedMaxL]), [[30,80],[30,80],[50,160]], "JBL eski Bio-CO₂ setleri resmî hacim aralıklarını taşımalı");
assert(jblLegacyBioCo2.slice(0,3).every((item) => item.category === "co2" && item.specifications.includes("Arşiv Bio-CO₂") && item.verifiedAt === "2026-09-15"), "JBL eski Bio-CO₂ setleri güncel seri gibi gösterilmemeli");
const jblLegacyBioRefill = equipmentCatalog.find((item) => item.id === "jbl-proflora-biorefill");
assert(jblLegacyBioRefill?.passiveComponent === true && jblLegacyBioRefill.recommendedMinL === undefined && jblLegacyBioRefill.specifications.includes("tek başına CO₂ sistemi değildir"), "JBL BioRefill bağımsız kapasite sağlayan CO₂ sistemi sayılmamalı");
const expectedJblLegacyPressureSets = [
  ["jbl-proflora-u501",400],["jbl-proflora-u502",600],["jbl-proflora-u504",undefined],
  ["jbl-proflora-m501",400],["jbl-proflora-m502",600],["jbl-proflora-m503",600],["jbl-proflora-m2003",1000],
];
for (const [id,maxL] of expectedJblLegacyPressureSets) {
  const item = equipmentCatalog.find((entry) => entry.id === id);
  assert(item, `JBL eski basınçlı PROFLORA seti eksik: ${id}`);
  assert.equal(item.category, "co2", `${id} CO₂ kategorisinde bulunmalı`);
  assert.equal(item.recommendedMinL, undefined, `${id} için üreticinin yayımlamadığı alt hacim uydurulmamalı`);
  assert.equal(item.recommendedMaxL, maxL, `${id} yalnız üreticinin yayımladığı üst hacmi taşımalı`);
  assert(item.specifications.includes("Arşiv") && item.specifications.includes("yalnız dik konumda"), `${id} arşiv ve basınçlı tüp güvenlik bilgisini taşımalı`);
  assert(item.sourceUrl?.startsWith("https://www.jbl.de/"), `${id} doğrudan resmî JBL kaynağı taşımalı`);
  assert.equal(item.verifiedAt, "2026-09-15", `${id} güncel doğrulama tarihi taşımalı`);
}
assert(equipmentCatalog.find((item) => item.id === "jbl-proflora-u504")?.specifications.includes("otomatik kapasite değerlendirmesi yapılmaz"), "JBL u504 için yayımlanmayan hacim tahmin edilmemeli");
assert(equipmentCatalog.find((item) => item.id === "jbl-proflora-m2003")?.specifications.includes("pH sensörü ayrıca alınır"), "JBL m2003 pH sensörü paket sınırını açıkça göstermeli");
const expectedJblOlderPressureSets = [
  ["jbl-proflora-u401",undefined,400],["jbl-proflora-u402",undefined,400],["jbl-proflora-u403",undefined,400],
  ["jbl-proflora-m601",100,600],["jbl-proflora-m602",100,600],["jbl-proflora-m603",100,600],["jbl-proflora-m1003",600,1000],
];
for (const [id,minL,maxL] of expectedJblOlderPressureSets) {
  const item = equipmentCatalog.find((entry) => entry.id === id);
  assert(item, `JBL daha eski basınçlı PROFLORA seti eksik: ${id}`);
  assert.equal(item.category, "co2", `${id} CO₂ kategorisinde bulunmalı`);
  assert.equal(item.recommendedMinL, minL, `${id} yalnız üreticinin yayımladığı alt hacmi taşımalı`);
  assert.equal(item.recommendedMaxL, maxL, `${id} resmî üst hacmi taşımalı`);
  assert(item.specifications.includes("Daha eski arşiv") && item.specifications.includes("yalnız dik konumda"), `${id} nesil ve basınçlı tüp güvenlik bilgisini taşımalı`);
  assert(item.sourceUrl?.startsWith("https://www.jbl.de/"), `${id} doğrudan resmî JBL kaynağı taşımalı`);
}
assert.deepEqual(["jbl-proflora-u402","jbl-proflora-m602"].map((id) => equipmentCatalog.find((item) => item.id === id)?.powerW), [0.8,0.8], "JBL u402 ve m602 gece valfleri resmî 0,8 W değerini taşımalı");
assert(["jbl-proflora-u403","jbl-proflora-m603","jbl-proflora-m1003"].every((id) => equipmentCatalog.find((item) => item.id === id)?.specifications.includes("pH sensörü ayrıca alınır")), "Eski JBL pH kontrollü setlerde sensörün ayrıca alınması gerektiği açık olmalı");
const jblLegacyMiniSet = equipmentCatalog.find((item) => item.id === "jbl-proflora-u201");
assert(jblLegacyMiniSet?.category === "co2" && jblLegacyMiniSet.recommendedMinL === 10 && jblLegacyMiniSet.recommendedMaxL === 200, "JBL u201 mini seti resmî 10–200 L aralığıyla bulunmalı");
const jblLegacyCylinders = equipmentCatalog.filter((item) => [
  "jbl-proflora-u95","jbl-proflora-u95-3x","jbl-proflora-u500","jbl-proflora-u500-3x",
  "jbl-proflora-m500","jbl-proflora-m500-silver","jbl-proflora-m2000-silver",
].includes(item.id));
assert.equal(jblLegacyCylinders.length, 7, "JBL'nin yedi eski tekli/çoklu CO₂ tüp seçeneği bulunmalı");
assert(jblLegacyCylinders.every((item) => item.category === "co2" && item.passiveComponent === true && item.recommendedMinL === undefined && item.recommendedMaxL === undefined), "Eski JBL tüpleri bağımsız akvaryum kapasitesi sağlayan sistem sayılmamalı");
assert(jblLegacyCylinders.every((item) => item.specifications.includes("tek başına CO₂ dozaj sistemi değildir") && item.specifications.includes("yalnız dik konumda")), "Eski JBL tüpleri set sınırı ve basınçlı tüp güvenliğini göstermeli");
assert(equipmentCatalog.find((item) => item.id === "jbl-proflora-u95")?.specifications.includes("normal M10×1 U tipi regülatöre doğrudan bağlanmaz"), "JBL u95 bağlantı uyumsuzluğu kullanıcıdan saklanmamalı");
const expectedJblCurrentCylinderIds = [
  "jbl-proflora-co2-cylinder-500-m","jbl-proflora-co2-cylinder-2000-m","jbl-proflora-co2-cylinder-500-u",
  "jbl-proflora-co2-cylinder-500-u-3x","jbl-proflora-co2-cylinder-1200-u",
  "jbl-proflora-co2-cylinder-wallmount","jbl-proflora-co2-cylinder-stand",
];
const jblCurrentCylinders = expectedJblCurrentCylinderIds.map((id) => equipmentCatalog.find((item) => item.id === id));
assert(jblCurrentCylinders.every(Boolean), "JBL güncel CO₂ CYLINDER ailesinin beş tüp/paket ve iki montaj yardımcısı bulunmalı");
assert(jblCurrentCylinders.every((item) => item.category === "co2" && item.passiveComponent === true && item.recommendedMinL === undefined && item.recommendedMaxL === undefined), "JBL güncel tüp ve montaj yardımcıları bağımsız akvaryum kapasitesi sağlamamalı");
assert(jblCurrentCylinders.every((item) => item.sourceUrl?.startsWith("https://www.jbl.de/") && item.verifiedAt === "2026-09-15"), "JBL güncel CYLINDER ailesi resmî kaynak ve güncel doğrulama tarihi taşımalı");
assert(equipmentCatalog.find((item) => item.id === "jbl-proflora-co2-cylinder-500-m")?.specifications.includes("kendi başına dik durmaz"), "JBL 500 M için stand veya duvar askısı gereksinimi açık olmalı");
assert(equipmentCatalog.find((item) => item.id === "jbl-proflora-co2-cylinder-1200-u")?.specifications.includes("eski JBL PROFLORA U regülatörleriyle uyumlu"), "JBL 1200 U geriye dönük uyumluluğu korunmalı");
const expectedJblPhArchiveIds = [
  "jbl-proflora-ph-control-touch-archive","jbl-proflora-ph-control-archive","jbl-proflora-ph-sensor-cal-archive",
  "jbl-proflora-cal-legacy","jbl-proflora-cal-archive","jbl-buffer-solution-ph-4","jbl-buffer-solution-ph-7-archive",
  "jbl-dest-archive","jbl-storage-solution-archive","jbl-proflora-cal-tray-archive",
];
const jblPhArchiveProducts = expectedJblPhArchiveIds.map((id) => equipmentCatalog.find((item) => item.id === id));
assert(jblPhArchiveProducts.every(Boolean), "JBL pH kontrol grubunun iki cihazı, sensörü, iki Cal nesli ve beş tekil aksesuarı bulunmalı");
assert(jblPhArchiveProducts.every((item) => item.category === "co2" && item.sourceUrl?.startsWith("https://www.jbl.de/") && item.verifiedAt === "2026-09-16"), "JBL pH kontrol ürünleri CO₂ kategorisinde, resmî kaynaklı ve güncel doğrulama tarihli olmalı");
assert(jblPhArchiveProducts.every((item) => item.recommendedMinL === undefined && item.recommendedMaxL === undefined), "JBL pH kontrol parçalarına üreticinin yayımlamadığı akvaryum kapasitesi uydurulmamalı");
assert(jblPhArchiveProducts.slice(0,2).every((item) => item.passiveComponent !== true), "JBL pH kontrol bilgisayarları pasif aksesuar sayılmamalı");
assert(jblPhArchiveProducts.slice(2).every((item) => item.passiveComponent === true), "JBL pH sensörü, kalibrasyon setleri, sıvıları ve tablası pasif aksesuar olmalı");
assert(equipmentCatalog.find((item) => item.id === "jbl-proflora-ph-control-touch-archive")?.specifications.includes("pH elektrodu ve harici solenoid valf dahil değildir"), "JBL pH-Control Touch paket sınırı açık olmalı");
assert(equipmentCatalog.find((item) => item.id === "jbl-proflora-ph-control-archive")?.specifications.includes("entegre hassas solenoid valf") && equipmentCatalog.find((item) => item.id === "jbl-proflora-ph-control-archive")?.specifications.includes("pH elektrodu ayrıca alınır"), "Eski JBL pH Control entegre valf ve ayrı elektrot farkını korumalı");
assert(equipmentCatalog.find((item) => item.id === "jbl-proflora-ph-sensor-cal-archive")?.specifications.includes("BNC") && equipmentCatalog.find((item) => item.id === "jbl-proflora-ph-sensor-cal-archive")?.specifications.includes("dört adet 50 ml"), "JBL pH-Sensor+Cal bağlantı ve paket içeriğini taşımalı");
assert.deepEqual(["jbl-proflora-cal-legacy","jbl-proflora-cal-archive"].map((id) => equipmentCatalog.find((item) => item.id === id)?.model), ["ProFlora Cal (eski nesil)","PROFLORA Cal (2016 nesli)"], "JBL'nin iki arşiv Cal nesli kullanıcıya açık nesil etiketleri ve ayrı ürün kimlikleriyle korunmalı");
const expectedJblLegacyRegulatorIds = [
  "jbl-proflora-u001-archive","jbl-proflora-m001-legacy","jbl-proflora-m001-archive","jbl-proflora-v002-archive",
  "jbl-proflora-adapt-u-m-legacy","jbl-proflora-adapt-u-m-archive","jbl-proflora-adapt-u201-u500-archive","jbl-proflora-adapt-u-dennerle-archive",
];
const jblLegacyRegulators = expectedJblLegacyRegulatorIds.map((id) => equipmentCatalog.find((item) => item.id === id));
assert(jblLegacyRegulators.every(Boolean), "JBL arşiv regülatör, solenoid valf ve adaptör grubunun sekiz ürünü bulunmalı");
assert(jblLegacyRegulators.every((item) => item.category === "co2" && item.sourceUrl?.startsWith("https://www.jbl.de/") && item.verifiedAt === "2026-09-16"), "JBL arşiv regülatör parçaları CO₂ kategorisinde, resmî kaynaklı ve güncel doğrulama tarihli olmalı");
assert(jblLegacyRegulators.every((item) => item.recommendedMinL === undefined && item.recommendedMaxL === undefined), "JBL regülatör ve adaptör parçalarına bağımsız akvaryum kapasitesi uydurulmamalı");
assert(jblLegacyRegulators.slice(0,4).every((item) => item.passiveComponent !== true), "JBL basınç düşürücüleri ve solenoid valf pasif aksesuar sayılmamalı");
assert(jblLegacyRegulators.slice(4).every((item) => item.passiveComponent === true), "JBL adaptörleri pasif bileşen olmalı");
assert.deepEqual(["jbl-proflora-m001-legacy","jbl-proflora-m001-archive"].map((id) => equipmentCatalog.find((item) => item.id === id)?.model), ["ProFlora m001 (eski nesil)","PROFLORA m001 (2016 nesli)"], "JBL m001 nesilleri kullanıcıya görünür etiketlerle ayrılmalı");
assert(equipmentCatalog.find((item) => item.id === "jbl-proflora-u001-archive")?.specifications.includes("M10×1") && equipmentCatalog.find((item) => item.id === "jbl-proflora-u001-archive")?.specifications.includes("1,5 bar"), "JBL u001 bağlantı ve çalışma basıncı bilgisini taşımalı");
assert(equipmentCatalog.find((item) => item.id === "jbl-proflora-m001-archive")?.specifications.includes("W21,8×1/14") && equipmentCatalog.find((item) => item.id === "jbl-proflora-m001-archive")?.specifications.includes("60 bardan 1,5 bara"), "JBL m001 resmî bağlantı ve basınç değerlerini taşımalı");
const jblV002 = equipmentCatalog.find((item) => item.id === "jbl-proflora-v002-archive");
assert(jblV002?.powerW === undefined && jblV002?.specifications.includes("birbiriyle çelişen güç değerleri"), "JBL v002 için çelişkili resmî güç değeri otomatik hesaba alınmamalı");
assert(equipmentCatalog.find((item) => item.id === "jbl-proflora-adapt-u201-u500-archive")?.specifications.includes("5/8 inç UNF") && equipmentCatalog.find((item) => item.id === "jbl-proflora-adapt-u201-u500-archive")?.specifications.includes("M10×1"), "JBL u201-u500 adaptörünün iki bağlantı standardı korunmalı");
assert(equipmentCatalog.find((item) => item.id === "jbl-proflora-adapt-u-dennerle-archive")?.specifications.includes("ters yönde") && equipmentCatalog.find((item) => item.id === "jbl-proflora-adapt-u-dennerle-archive")?.specifications.includes("M10×1,25"), "JBL Dennerle adaptörünün yön ve bağlantı sınırı açık olmalı");

const expectedJblLegacyAccessoryIds = [
  "jbl-proflora-m001-duo-legacy","jbl-proflora-m001-duo-archive","jbl-proflora-cylinder-stand-archive",
  "jbl-proflora-t3-black-legacy","jbl-proflora-t3-archive","jbl-proflora-co2-count-safe-archive",
  "jbl-proflora-safestop-legacy","jbl-proflora-safestop-archive",
];
const jblLegacyAccessories = expectedJblLegacyAccessoryIds.map((id) => equipmentCatalog.find((item) => item.id === id));
assert(jblLegacyAccessories.every(Boolean), "JBL arşiv duo regülatör ve CO₂ yardımcıları sekiz ürünle bulunmalı");
assert(jblLegacyAccessories.every((item) => item.category === "co2" && item.sourceUrl?.startsWith("https://www.jbl.de/") && item.verifiedAt === "2026-09-16"), "JBL arşiv CO₂ yardımcıları resmî kaynak ve güncel doğrulama tarihi taşımalı");
assert(jblLegacyAccessories.every((item) => item.recommendedMinL === undefined && item.recommendedMaxL === undefined), "JBL duo regülatör ve pasif CO₂ yardımcılarına bağımsız akvaryum kapasitesi uydurulmamalı");
assert(jblLegacyAccessories.slice(0,2).every((item) => item.passiveComponent !== true), "JBL m001 duo regülatörleri pasif aksesuar sayılmamalı");
assert(jblLegacyAccessories.slice(2).every((item) => item.passiveComponent === true), "JBL stand, hortum, sayaç ve geri akış valfleri pasif bileşen olmalı");
assert(jblLegacyAccessories.slice(0,2).every((item) => item.specifications.includes("iki") && item.specifications.includes("M10×1") && item.specifications.includes("W21,8×1/14")), "JBL m001 duo nesilleri iki ayrı çıkış ve iki tüp standardını göstermeli");
assert(equipmentCatalog.find((item) => item.id === "jbl-proflora-cylinder-stand-archive")?.specifications.includes("60 mm") && equipmentCatalog.find((item) => item.id === "jbl-proflora-cylinder-stand-archive")?.specifications.includes("dik"), "JBL eski tüp standı çap ve dik kullanım güvenliğini taşımalı");
assert(["jbl-proflora-t3-black-legacy","jbl-proflora-t3-archive"].every((id) => equipmentCatalog.find((item) => item.id === id)?.specifications.includes("3 m") && equipmentCatalog.find((item) => item.id === id)?.specifications.includes("4/6 mm")), "JBL T3 hortum nesilleri resmî uzunluk ve çap değerini taşımalı");
assert(equipmentCatalog.find((item) => item.id === "jbl-proflora-co2-count-safe-archive")?.specifications.includes("entegre geri akış koruması"), "JBL eski Count Safe entegre çek valfini açıklamalı");
assert(["jbl-proflora-safestop-legacy","jbl-proflora-safestop-archive"].every((id) => equipmentCatalog.find((item) => item.id === id)?.specifications.includes("4/6 mm")), "JBL SafeStop nesilleri doğru hortum çapını taşımalı");
assert(equipmentCatalog.find((item) => item.id === "jbl-proflora-safestop-archive")?.specifications.includes("yalnız bir çek valf"), "JBL SafeStop çoklu çek valf riskini kullanıcıya göstermeli");

const expectedJblLegacyDiffuserIds = [
  "jbl-proflora-taifun-p-legacy","jbl-proflora-taifun-p-archive","jbl-proflora-taifun-s5-legacy","jbl-proflora-taifun-s-archive",
  "jbl-proflora-taifun-m10-legacy","jbl-proflora-taifun-m-archive","jbl-proflora-taifun-extend-legacy","jbl-proflora-taifun-extend-archive",
  "jbl-proflora-direct-12-16-archive","jbl-proflora-direct-16-22-archive","jbl-proflora-direct-19-25-archive","jbl-proflora-direct-membrane-archive",
];
const jblLegacyDiffusers = expectedJblLegacyDiffuserIds.map((id) => equipmentCatalog.find((item) => item.id === id));
assert(jblLegacyDiffusers.every(Boolean), "JBL arşiv Taifun ve Direct difüzör ailesinin 12 seçeneği bulunmalı");
assert(jblLegacyDiffusers.every((item) => item.category === "co2" && item.sourceUrl?.startsWith("https://www.jbl.de/") && item.verifiedAt === "2026-09-16"), "JBL arşiv difüzörleri CO₂ kategorisinde, resmî kaynaklı ve güncel doğrulama tarihli olmalı");
assert.deepEqual(
  ["jbl-proflora-taifun-p-legacy","jbl-proflora-taifun-s5-legacy","jbl-proflora-taifun-m10-legacy"].map((id) => equipmentCatalog.find((item) => item.id === id)?.recommendedMaxL),
  [undefined,200,400],
  "JBL eski Taifun nesillerine yalnız üreticinin yayımladığı üst hacimler yazılmalı",
);
assert.deepEqual(
  ["jbl-proflora-taifun-p-archive","jbl-proflora-taifun-s-archive","jbl-proflora-taifun-m-archive"].map((id) => {
    const item = equipmentCatalog.find((entry) => entry.id === id);
    return [item?.recommendedMinL,item?.recommendedMaxL];
  }),
  [[20,400],[50,200],[undefined,400]],
  "JBL 2016 Taifun nesilleri resmî hacim aralıklarını korumalı",
);
assert(["jbl-proflora-taifun-extend-legacy","jbl-proflora-taifun-extend-archive","jbl-proflora-direct-membrane-archive"].every((id) => {
  const item = equipmentCatalog.find((entry) => entry.id === id);
  return item?.passiveComponent === true && item.recommendedMinL === undefined && item.recommendedMaxL === undefined;
}), "JBL Taifun uzatmaları ve Direct membranı pasif kalmalı, bağımsız kapasite kazanmamalı");
const jblDirectDiffusers = ["jbl-proflora-direct-12-16-archive","jbl-proflora-direct-16-22-archive","jbl-proflora-direct-19-25-archive"].map((id) => equipmentCatalog.find((item) => item.id === id));
assert.deepEqual(jblDirectDiffusers.map((item) => [item?.recommendedMinL,item?.recommendedMaxL]), [[40,300],[160,600],[200,800]], "JBL Direct hortum seçeneklerinin resmî hacim aralıkları korunmalı");
assert(jblDirectDiffusers.every((item) => item?.passiveComponent !== true && item.specifications.includes("entegre kabarcık sayacı") && item.specifications.includes("1,0–1,5 bar")), "JBL Direct seçenekleri aktif difüzör ve resmî çalışma basıncıyla tanımlanmalı");
assert(equipmentCatalog.find((item) => item.id === "jbl-proflora-direct-membrane-archive")?.specifications.includes("24 saat") && equipmentCatalog.find((item) => item.id === "jbl-proflora-direct-membrane-archive")?.specifications.includes("yıllık değişim"), "JBL Direct membran hazırlık ve bakım sınırını taşımalı");

const jblAutomaticFeeders = equipmentCatalog.filter((item) => [
  "jbl-pronovo-autofood-multi",
  "jbl-pronovo-autofood-black",
  "jbl-pronovo-autofood-white",
  "jbl-autofood-black-archive",
  "jbl-autofood-white-archive",
].includes(item.id));
assert.equal(jblAutomaticFeeders.length, 5, "JBL'nin güncel ve arşiv otomatik yemleyicileri eksiksiz ayrılmalı");
assert(jblAutomaticFeeders.every((item) => item.category === "other" && item.sourceUrl?.startsWith("https://www.jbl.de/")), "JBL yemleyicileri resmî kaynaklı Diğer ekipman olmalı");
assert(equipmentCatalog.find((item) => item.id === "jbl-pronovo-autofood-multi")?.specifications.includes("günde 6 öğüne kadar"), "Yeni JBL AUTOFOOD MULTI altı öğün bilgisini taşımalı");
assert(equipmentCatalog.find((item) => item.id === "jbl-autofood-black-archive")?.specifications.includes("üretimden kaldırıldı"), "Önceki nesil JBL AutoFood güncel ürün gibi gösterilmemeli");

const jblCleaningEquipment = equipmentCatalog.filter((item) =>
  item.brand === "JBL" &&
  item.verifiedAt === "2026-09-14" &&
  (
    item.id.startsWith("jbl-proclean-") ||
    item.id.startsWith("jbl-floaty-") ||
    item.id.startsWith("jbl-algae-magnet-") ||
    item.id.startsWith("jbl-aqua-t-") ||
    ["jbl-blade-for-floaty-l-xl","jbl-blanki","jbl-blanki-set","jbl-wishwash","jbl-spongi","jbl-proscape-cleaning-glove"].includes(item.id)
  )
);
assert.equal(jblCleaningEquipment.length, 29, "JBL'nin 29 güncel dip, cam ve aksesuar temizlik seçeneği bulunmalı");
assert(jblCleaningEquipment.every((item) => item.category === "other" && item.passiveComponent === true && item.sourceUrl?.startsWith("https://www.jbl.de/")), "JBL temizlik ürünleri pasif olmalı ve kapasite hesabına karışmamalı");
assert.deepEqual(
  ["s","m","l"].map((size) => equipmentCatalog.find((item) => item.id === `jbl-algae-magnet-${size}`)?.specifications.match(/(6|10|15) mm/)?.[1]),
  ["6","10","15"],
  "JBL Algae Magnet S/M/L cam kalınlıkları resmî seçenekleri korumalı",
);
const jblFeedingAccessories = equipmentCatalog.filter((item) => ["jbl-novostation","jbl-food-clip"].includes(item.id));
assert.equal(jblFeedingAccessories.length, 2, "JBL'nin iki güncel pasif yemleme aksesuarı bulunmalı");
assert(jblFeedingAccessories.every((item) => item.category === "other" && item.passiveComponent === true && item.sourceUrl?.includes("/group/7989/accessories-feeding")), "JBL yemleme aksesuarları pasif olmalı ve kapasite hesabına karışmamalı");
const jblArtemioAccessories = equipmentCatalog.filter((item) => item.brand === "JBL" && item.sourceUrl?.includes("/group/3391/accessories-for-artemio"));
assert.equal(jblArtemioAccessories.length, 5, "JBL Artemio grubunda tam set ve dört aksesuar bulunmalı");
assert.deepEqual(jblArtemioAccessories.map((item) => item.model), ["ArtemioSet","Artemio 1","Artemio 2","Artemio 3","Artemio 4"], "JBL Artemio aksesuarlarının model ayrımı korunmalı");
assert(jblArtemioAccessories.slice(1).every((item) => item.passiveComponent === true), "JBL Artemio yedek kap ve elekleri pasif aksesuar olmalı");
const jblPestTraps = equipmentCatalog.filter((item) => ["jbl-limcollect","jbl-placollect"].includes(item.id));
assert.equal(jblPestTraps.length, 2, "JBL LimCollect ve PlaCollect tuzakları bulunmalı");
assert(jblPestTraps.every((item) => item.category === "other" && item.passiveComponent === true && item.sourceUrl?.includes("/products/detail/") && item.verifiedAt === "2026-09-15"), "JBL zararlı tuzakları pasif ekipman ve doğrudan resmî kaynakla tutulmalı");
assert(equipmentCatalog.find((item) => item.id === "jbl-placollect")?.specifications.includes("kıl kurtları için uygun değildir"), "JBL PlaCollect ürün sınırı kullanıcıdan saklanmamalı");
const jblLegacyGravelCleaning = equipmentCatalog.filter((item) => [
  "jbl-aquaex-set-10-35","jbl-aquaex-set-20-45","jbl-aquaex-set-45-70","jbl-aqua-in-out-complete-set","jbl-aqua-in-out-extension",
].includes(item.id));
assert.deepEqual(jblLegacyGravelCleaning.map((item) => item.model), ["AquaEx Set 10-35","AquaEX Set 20-45","AquaEx Set 45-70","Aqua In Out Complete Set","Aqua In Out Extension"], "JBL eski dip temizleme ailesinin beş arşiv ürünü bulunmalı");
assert(jblLegacyGravelCleaning.every((item) => item.category === "other" && item.passiveComponent === true && item.specifications.includes("Arşiv ürün") && item.verifiedAt === "2026-09-15"), "JBL eski dip temizleme ürünleri güncel PROCLEAN modeli veya kapasite sağlayan ekipman gibi gösterilmemeli");
const jblNanoFloaty = equipmentCatalog.find((item) => item.id === "jbl-nano-floaty");
assert(jblNanoFloaty?.category === "other" && jblNanoFloaty.passiveComponent === true && jblNanoFloaty.specifications.includes("Arşiv ürün") && jblNanoFloaty.specifications.includes("akrilik"), "JBL Nano-Floaty arşiv ve yüzey uyumluluğu bilgisiyle pasif ekipman olarak bulunmalı");
const jblLegacyCleaningSolutions = equipmentCatalog.filter((item) => ["jbl-clean-a","jbl-desinfekt","jbl-power-clean"].includes(item.id));
assert.deepEqual(jblLegacyCleaningSolutions.map((item) => item.model), ["Clean A","Desinfekt","Power Clean"], "JBL eski temizlik çözümlerinin üç modeli bulunmalı");
assert(jblLegacyCleaningSolutions.every((item) => item.category === "other" && item.passiveComponent === true && item.specifications.includes("Arşiv ürün") && item.verifiedAt === "2026-09-15"), "JBL eski temizlik çözümleri güncel veya kapasite sağlayan ekipman gibi gösterilmemeli");
assert(equipmentCatalog.find((item) => item.id === "jbl-clean-a")?.specifications.includes("yalnız dış yüzeyi"), "JBL Clean A kullanım yüzeyi sınırı açık olmalı");
assert(equipmentCatalog.find((item) => item.id === "jbl-desinfekt")?.specifications.includes("canlı ve bitki bulunan akvaryumun içinde kullanılmaz"), "JBL Desinfekt canlı akvaryum güvenlik uyarısını taşımalı");
assert(equipmentCatalog.find((item) => item.id === "jbl-power-clean")?.specifications.includes("bitki veya diğer canlılarda kullanılmaz"), "JBL Power Clean canlılar üzerindeki kullanım yasağını taşımalı");
assert.equal(equipmentCatalog.filter((item) => item.brand === "JBL").length, 351, "JBL ekipman kataloğu 351 doğrulanmış seçeneğe ulaşmalı");

const jblCareProducts = careProductCatalog.filter((item) => item.brand === "JBL");
assert.equal(jblCareProducts.length, 515, "JBL bakım kataloğunda 515 doğrulanmış ürün seçeneği bulunmalı");
const jblSansibarAndVolcano = jblCareProducts.filter((item) => item.category === "substrate");
assert.equal(jblSansibarAndVolcano.length, 39, "JBL taban kataloğunda Sansibar, Volcano, Mount Aso, Manado ve eski PROSCAPE Soil ailelerinin 39 seçeneği bulunmalı");
assert(jblSansibarAndVolcano.every((item) => item.sourceUrl.startsWith("https://www.jbl.de/") && ["2026-09-17","2026-09-18"].includes(item.verifiedAt)), "JBL taban kayıtları doğrudan resmî ürün sayfasına bağlanmalı");
assert.deepEqual(
  jblSansibarAndVolcano.filter((item) => item.model.startsWith("Sansibar ")).map((item) => item.model),
  ["Sansibar WHITE 5 kg","Sansibar WHITE 10 kg","Sansibar RIVER 5 kg","Sansibar RIVER 10 kg","Sansibar SNOW 5 kg","Sansibar SNOW 10 kg","Sansibar GREY 5 kg","Sansibar GREY 10 kg","Sansibar ORANGE 5 kg","Sansibar ORANGE 10 kg","Sansibar RED 5 kg","Sansibar RED 10 kg","Sansibar DARK 5 kg","Sansibar DARK 10 kg"],
  "JBL Sansibar ailesinin yedi renk ve ikişer paket boyu bulunmalı",
);
assert(jblSansibarAndVolcano.filter((item) => item.model.startsWith("Sansibar RIVER")).every((item) => item.description.includes("taban ısıtma kabloları için uygun")), "Yalnız Sansibar RIVER taban ısıtma kablosuna uygun gösterilmeli");
assert(jblSansibarAndVolcano.filter((item) => item.model.startsWith("PROSCAPE VOLCANO")).every((item) => item.description.includes("kazıcı balıklar") && item.description.includes("Sansibar ile birlikte kullanılmamalı")), "JBL Volcano Mineral kazıcı balık ve Sansibar uyumsuzluk uyarılarını taşımalı");
const jblMountAsoSoils = jblSansibarAndVolcano.filter((item) => item.model.startsWith("PROSCAPE MOUNT ASO SOIL"));
assert.deepEqual(jblMountAsoSoils.map((item) => item.model), ["PROSCAPE MOUNT ASO SOIL BROWN 3 L","PROSCAPE MOUNT ASO SOIL BROWN 9 L","PROSCAPE MOUNT ASO SOIL BLACK 3 L","PROSCAPE MOUNT ASO SOIL BLACK 9 L"], "JBL Mount Aso Soil iki renk ve iki hacimle bulunmalı");
assert(jblMountAsoSoils.every((item) => item.description.includes("önceden gübreyle yüklenmemiş") && item.description.includes("kazıcı balıklara ve karideslere uygundur") && item.description.includes("taban ısıtıcısıyla kullanılabilir")), "JBL Mount Aso Soil gübre yükü, canlı ve taban ısıtma uyumluluğunu korumalı");
const jblManado = jblSansibarAndVolcano.filter((item) => item.model.startsWith("Manado "));
assert.equal(jblManado.length, 11, "JBL Manado ailesinde beş kahverengi arşiv, üç güncel DARK ve üç eski DARK seçenek bulunmalı");
assert.deepEqual(jblManado.filter((item) => item.model.match(/^Manado \d/)).map((item) => item.model), ["Manado 1,5 L (Arşiv)","Manado 3 L (Arşiv)","Manado 5 L (Arşiv)","Manado 10 L (Arşiv)","Manado 25 L (Arşiv)"], "JBL Manado kahverengi serisinin beş hacmi korunmalı");
assert(jblManado.filter((item) => item.model.includes("DARK") && item.model.includes("Güncel")).every((item) => item.description.includes("6710")), "Güncel Manado DARK nesli 67100–67102 ürün kodlarıyla ayrılmalı");
assert(jblManado.filter((item) => item.model.includes("Eski nesil arşiv")).every((item) => item.description.includes("6703") && item.description.includes("resmî sayfada arşivlenmiştir")), "Eski Manado DARK nesli 67035–67037 ürün kodları ve arşiv durumu ile ayrılmalı");
const jblLegacyProscapeSoils = jblSansibarAndVolcano.filter((item) => item.model.startsWith("PROSCAPE PLANT SOIL") || item.model.startsWith("PROSCAPE SHRIMPS SOIL"));
assert.equal(jblLegacyProscapeSoils.length, 8, "Eski PROSCAPE Plant/Shrimps Soil ailelerinde iki renk ve iki hacim bulunmalı");
assert.equal(jblLegacyProscapeSoils.filter((item) => item.model.startsWith("PROSCAPE PLANT SOIL")).length, 4, "Eski PROSCAPE Plant Soil dört renk-hacim seçeneğiyle bulunmalı");
assert(jblLegacyProscapeSoils.filter((item) => item.model.startsWith("PROSCAPE PLANT SOIL")).every((item) => item.description.includes("ilave gübre") && item.description.includes("içerir") && item.description.includes("taban filtresinde kullanılmamalıdır")), "Plant Soil gübre yükü ve taban filtresi kısıtı korunmalı");
assert(jblLegacyProscapeSoils.filter((item) => item.model.startsWith("PROSCAPE SHRIMPS SOIL")).every((item) => item.description.includes("ilave gübre içermez") && item.description.includes("karides")), "Shrimps Soil gübresiz karides kullanım amacıyla ayrılmalı");
assert.equal(jblCareProducts.filter((item) => item.category === "filter_media").length, 53, "JBL filtre medyaları doğru ürün kategorisinde tutulmalı");
const jblGeneralFilterMedia = jblCareProducts.filter((item) => [
  "Carbomec activ 400 g","Carbomec ultra 400 g","Tormec activ 1000 ml (Arşiv)",
  "SilicatEx Rapid 400 g","NitratEx 250 ml","BioNitratEx 100 biyolojik top",
  "PhosEx ultra 340 g","ClearMec plus 600 ml / 450 g","Cermec 700 g",
  "Sintomec 450 g","Micromec 650 g",
].includes(item.model));
assert.equal(jblGeneralFilterMedia.length, 11, "JBL genel filtre medyasının 11 gerçek paket seçeneği bulunmalı");
assert(jblGeneralFilterMedia.every((item) => item.sourceUrl.startsWith("https://www.jbl.de/") && item.verifiedAt === "2026-09-18"), "JBL genel filtre medyaları doğrudan resmî kaynak ve güncel doğrulama tarihi taşımalı");
assert(jblCareProducts.find((item) => item.model === "Carbomec activ 400 g")?.description.includes("pH 6,5–7,5") && jblCareProducts.find((item) => item.model === "Carbomec activ 400 g")?.description.includes("kısa süreli"), "JBL Carbomec activ tatlı su pH aralığı ve süre sınırıyla bulunmalı");
assert(jblCareProducts.find((item) => item.model === "Carbomec ultra 400 g")?.description.includes("pH 7,5–8,5") && jblCareProducts.find((item) => item.model === "Carbomec ultra 400 g")?.description.includes("2–3 gün"), "JBL Carbomec ultra yüksek pH hedefi ve tatlı su süre sınırıyla bulunmalı");
const jblTormec = jblCareProducts.find((item) => item.model === "Tormec activ 1000 ml (Arşiv)");
assert(jblTormec?.description.includes("800 L") && jblTormec.description.includes("24 saat") && jblTormec.additionalSourceUrls?.some((url) => url.includes("JBL_Hauptkatalog")), "JBL Tormec paket hacmi, kullanım hazırlığı ve arşiv durumu iki resmî kaynakla korunmalı");
assert(jblCareProducts.find((item) => item.model === "SilicatEx Rapid 400 g")?.description.includes("12000 mg") && jblCareProducts.find((item) => item.model === "SilicatEx Rapid 400 g")?.description.includes("KH ve pH"), "JBL SilicatEx kapasitesi ve yumuşak su güvenlik takibiyle bulunmalı");
const jblNitratEx = jblCareProducts.find((item) => item.model === "NitratEx 250 ml");
assert(jblNitratEx?.description.includes("Yalnız tatlı su") && jblNitratEx.description.includes("9000 mg") && jblNitratEx.description.includes("sofra tuzuyla"), "JBL NitratEx su türü, bağlama kapasitesi ve yenilenme yöntemiyle bulunmalı");
const jblBioNitratEx = jblCareProducts.find((item) => item.model === "BioNitratEx 100 biyolojik top");
assert(jblBioNitratEx?.description.includes("200–300 L") && jblBioNitratEx.description.includes("düzenli su değişiminin yerine geçmez"), "JBL BioNitratEx paket kapasitesi ve bakım sınırıyla bulunmalı");
assert(jblCareProducts.find((item) => item.model === "PhosEx ultra 340 g")?.description.includes("18000 mg"), "JBL PhosEx ultra doğrulanmış fosfat bağlama kapasitesini taşımalı");
assert(jblCareProducts.find((item) => item.model === "ClearMec plus 600 ml / 450 g")?.description.includes("150–300 L"), "JBL ClearMec plus gerçek hacim, ağırlık ve kullanım aralığıyla bulunmalı");
assert(jblCareProducts.find((item) => item.model === "Cermec 700 g")?.description.includes("17,4 × 17,4 mm"), "JBL Cermec gerçek paket ağırlığı ve halka ölçüsüyle bulunmalı");
assert(jblCareProducts.find((item) => item.model === "Sintomec 450 g")?.description.includes("1200 m²/L"), "JBL Sintomec paket ağırlığı ve biyolojik yüzeyiyle bulunmalı");
assert(jblCareProducts.find((item) => item.model === "Micromec 650 g")?.description.includes("1500 m²/L"), "JBL Micromec paket ağırlığı ve biyolojik yüzeyiyle bulunmalı");
const jblExternalFilterMedia = jblCareProducts.filter((item) => [
  "FilterPad VL CristalProfi 120/250 (Arşiv)","FilterPad VL CristalProfi 500 (Arşiv)",
  "FilterPad F15 CristalProfi 120/250 (Son şans)","FilterPad F15 CristalProfi 500 (Son şans)",
  "FilterPad F35 CristalProfi 120/250 (Son şans)","FilterPad F35 CristalProfi 500 (Arşiv)",
  "CombiBloc CristalProfi e4/7/900/1/2 6 parça","CombiBloc CristalProfi e15/1900/1/2 6 parça",
  "CRISTALPROFI UNIBLOC e4/7/90X 2'li","CRISTALPROFI UNIBLOC e15/190X 2'li",
  "CRISTALPROFI CLEARMEC e4/7/900/1/2 500 ml","CRISTALPROFI CLEARMEC e15/1900/1/2 800 ml",
  "CRISTALPROFI COMBIBLOC II e4/7/902 3 parça","CRISTALPROFI COMBIBLOC II e15/1902 3 parça",
  "CRISTALPROFI SYMECPAD e4/7/901/2 6'lı","CRISTALPROFI SYMECPAD e15/1901/2 6'lı",
].includes(item.model));
assert.equal(jblExternalFilterMedia.length, 16, "JBL dış filtreye özel medya ailesinin 16 gerçek cihaz/paket seçeneği bulunmalı");
assert(jblExternalFilterMedia.every((item) => item.sourceUrl.startsWith("https://www.jbl.de/") && item.verifiedAt === "2026-09-18"), "JBL dış filtre medyaları doğrudan resmî kaynak ve güncel doğrulama tarihi taşımalı");
assert.deepEqual(jblExternalFilterMedia.filter((item) => item.model.startsWith("FilterPad VL")).map((item) => item.model), ["FilterPad VL CristalProfi 120/250 (Arşiv)","FilterPad VL CristalProfi 500 (Arşiv)"], "JBL FilterPad VL iki eski filtre gövdesi için ayrı seçilebilmeli");
assert(jblExternalFilterMedia.filter((item) => item.model.startsWith("FilterPad VL")).every((item) => item.description.includes("iki adet") && item.description.includes("yeniden kullanılmaz") && item.additionalSourceUrls?.some((url) => url.includes("JBL_Hauptkatalog"))), "JBL FilterPad VL paket adedi, tek kullanımlık güvenliği ve resmî katalog kaynağıyla bulunmalı");
assert.deepEqual(jblExternalFilterMedia.filter((item) => item.model.startsWith("FilterPad F15")).map((item) => item.model), ["FilterPad F15 CristalProfi 120/250 (Son şans)","FilterPad F15 CristalProfi 500 (Son şans)"], "JBL FilterPad F15 iki eski filtre gövdesi için ayrı seçilebilmeli");
assert(jblExternalFilterMedia.filter((item) => item.model.startsWith("FilterPad F15")).every((item) => item.description.includes("15 ppi") && item.description.includes("iki adet")), "JBL FilterPad F15 gözenek ve paket adedini taşımalı");
assert.deepEqual(jblExternalFilterMedia.filter((item) => item.model.startsWith("FilterPad F35")).map((item) => item.model), ["FilterPad F35 CristalProfi 120/250 (Son şans)","FilterPad F35 CristalProfi 500 (Arşiv)"], "JBL FilterPad F35 güncel son şans ve arşiv seçeneğini ayırmalı");
assert(jblExternalFilterMedia.filter((item) => item.model.startsWith("FilterPad F35")).every((item) => item.description.includes("35 ppi") && item.description.includes("iki adet") && item.additionalSourceUrls?.some((url) => url.includes("JBL_Hauptkatalog"))), "JBL FilterPad F35 gözenek, paket adedi ve resmî katalog kaynağıyla bulunmalı");
assert(jblExternalFilterMedia.filter((item) => item.model.startsWith("CombiBloc CristalProfi")).every((item) => item.description.includes("dört 10 ppi") && item.description.includes("20 ppi") && item.description.includes("30 ppi")), "JBL eski CombiBloc setleri altı parçalık doğru sünger bileşimini taşımalı");
assert(jblExternalFilterMedia.filter((item) => item.model.startsWith("CRISTALPROFI UNIBLOC")).every((item) => item.description.includes("iki adet 25 ppi") && item.description.includes("merkez kesiti")), "JBL UniBloc seçenekleri paket adedi, gözenek ve çıkarılabilir merkez bilgisini taşımalı");
assert.deepEqual(jblExternalFilterMedia.filter((item) => item.model.startsWith("CRISTALPROFI CLEARMEC")).map((item) => item.model), ["CRISTALPROFI CLEARMEC e4/7/900/1/2 500 ml","CRISTALPROFI CLEARMEC e15/1900/1/2 800 ml"], "JBL ClearMec e iki gerçek medya hacmiyle ayrılmalı");
assert(jblExternalFilterMedia.filter((item) => item.model.startsWith("CRISTALPROFI CLEARMEC")).every((item) => item.description.includes("nitrit, nitrat ve fosfat") && item.description.includes("üstten bir önceki")), "JBL ClearMec e hedef kirleticileri ve doğru sepet konumunu taşımalı");
assert(jblExternalFilterMedia.filter((item) => item.model.startsWith("CRISTALPROFI COMBIBLOC II")).every((item) => item.description.includes("iki kaba 15 ppi") && item.description.includes("bir ince 35 ppi")), "JBL CombiBloc II setleri üç parçalık doğru sünger bileşimini taşımalı");
assert(jblExternalFilterMedia.filter((item) => item.model.startsWith("CRISTALPROFI SYMECPAD")).every((item) => item.description.includes("altı") && item.description.includes("yalnız bir kez")), "JBL SymecPad e paket adedi ve güvenli yenileme sınırını taşımalı");
const jblInternalFilterMedia = jblCareProducts.filter((item) => [
  "PROCRISTAL i30 FilterSponge 1'li","PROCRISTAL i30 SuperClear 2'li","PROCRISTAL i30 SuperClear 6'lı (Son şans)",
  "PROCRISTAL i30 GreenStop 2'li (Arşiv)","PROCRISTAL i30 GreenStop 6'lı","UniBloc CristalProfi i60/80/100/200 1'li",
  "PhosEx ultra CristalProfi i60/80/100/200 190 ml","CarboMec ultra CristalProfi i60/80/100/200 190 ml",
  "ClearMec CristalProfi i60/80/100/200 190 ml","TorMec CristalProfi i60/80/100/200 190 ml (Son şans)",
  "MicroMec CristalProfi i60/80/100/200 190 ml","CristalProfi m greenline FilterPad 35 ppi",
  "CristalProfi m greenline Modul FilterPad 2'li",
].includes(item.model));
assert.equal(jblInternalFilterMedia.length, 13, "JBL iç filtre medyalarının 13 gerçek ürün ve paket seçeneği bulunmalı");
assert(jblInternalFilterMedia.every((item) => item.sourceUrl.startsWith("https://www.jbl.de/") && item.verifiedAt === "2026-09-18"), "JBL iç filtre medyaları doğrudan resmî ürün sayfası ve güncel doğrulama tarihi taşımalı");
const jblI30Sponge = jblInternalFilterMedia.find((item) => item.model === "PROCRISTAL i30 FilterSponge 1'li");
assert(jblI30Sponge?.description.includes("30 ppi") && jblI30Sponge.description.includes("10–40 L") && jblI30Sponge.description.includes("üç ayda"), "JBL i30 standart sünger gözenek, hacim ve yenileme bilgisiyle bulunmalı");
const jblI30SuperClear = jblInternalFilterMedia.filter((item) => item.model.startsWith("PROCRISTAL i30 SuperClear"));
assert.deepEqual(jblI30SuperClear.map((item) => item.model), ["PROCRISTAL i30 SuperClear 2'li","PROCRISTAL i30 SuperClear 6'lı (Son şans)"], "JBL i30 SuperClear güncel 2'li ve son şans 6'lı paketleri ayırmalı");
assert(jblI30SuperClear.every((item) => item.description.includes("25 ml") && item.description.includes("ayda bir") && item.description.includes("aktif karbon")), "JBL i30 SuperClear kartuş hacmi, medya ve yenileme sıklığını taşımalı");
const jblI30GreenStop = jblInternalFilterMedia.filter((item) => item.model.startsWith("PROCRISTAL i30 GreenStop"));
assert.deepEqual(jblI30GreenStop.map((item) => item.model), ["PROCRISTAL i30 GreenStop 2'li (Arşiv)","PROCRISTAL i30 GreenStop 6'lı"], "JBL i30 GreenStop arşiv 2'li ve etkin 6'lı paketleri ayırmalı");
assert(jblI30GreenStop.every((item) => item.description.includes("25 ml") && item.description.includes("fosfat, nitrat ve nitriti") && item.description.includes("ayda bir")), "JBL i30 GreenStop kartuş hacmi, hedef maddeler ve yenileme sıklığını taşımalı");
assert(jblInternalFilterMedia.find((item) => item.model.startsWith("UniBloc CristalProfi"))?.description.includes("20 ppi"), "JBL CristalProfi i UniBloc 20 ppi gözenekle bulunmalı");
const jblCpiProblemMedia = jblInternalFilterMedia.filter((item) => item.model.includes("CristalProfi i60/80/100/200 190 ml"));
assert.equal(jblCpiProblemMedia.length, 5, "JBL CristalProfi i serisinin beş özel 190 ml medya kartuşu bulunmalı");
assert(jblCpiProblemMedia.every((item) => item.description.includes("190 ml")), "JBL CristalProfi i özel kartuşları gerçek medya hacmini taşımalı");
assert(jblInternalFilterMedia.find((item) => item.model.startsWith("CarboMec ultra CristalProfi"))?.description.includes("2–3 hafta"), "JBL CristalProfi i aktif karbon kartuşu kısa kullanım sınırıyla bulunmalı");
assert(jblInternalFilterMedia.find((item) => item.model.startsWith("PhosEx ultra CristalProfi"))?.description.includes("2–3 ay"), "JBL CristalProfi i fosfat kartuşu ölçüme bağlı yenileme süresiyle bulunmalı");
assert(jblInternalFilterMedia.find((item) => item.model.startsWith("MicroMec CristalProfi"))?.description.includes("yeniden kullanılabilir"), "JBL CristalProfi i MicroMec bilyeleri tek kullanımlık gibi gösterilmemeli");
assert(jblInternalFilterMedia.find((item) => item.model === "CristalProfi m greenline FilterPad 35 ppi")?.description.includes("küçük balık ve karideslerin"), "JBL CP m ana ped karides ve yavru güvenliğini taşımalı");
assert(jblInternalFilterMedia.find((item) => item.model === "CristalProfi m greenline Modul FilterPad 2'li")?.description.includes("13 × 9 cm"), "JBL CP m modül pedi paket adedi ve gerçek ölçüsüyle bulunmalı");
const jblGeneralFlossAndFoam = jblCareProducts.filter((item) =>
  item.model.startsWith("Symec ") || item.model.startsWith("Mavi ince filtre süngeri") || item.model.startsWith("Mavi kaba filtre süngeri")
);
assert.equal(jblGeneralFlossAndFoam.length, 13, "JBL genel elyaf ve kesilebilir sünger grubunda 13 gerçek paket seçeneği bulunmalı");
assert(jblGeneralFlossAndFoam.every((item) => item.sourceUrl.startsWith("https://www.jbl.de/") && item.verifiedAt === "2026-09-18"), "JBL genel elyaf ve süngerleri doğrudan resmî ürün sayfası ve güncel doğrulama tarihi taşımalı");
const jblSymecMicro = jblGeneralFlossAndFoam.find((item) => item.model === "Symec micro 25 × 74 cm");
assert(jblSymecMicro?.description.includes("1/1000 mm") && jblSymecMicro.description.includes("12 saat") && jblSymecMicro.description.includes("24 saatte") && jblSymecMicro.description.includes("yalnız bir kez"), "JBL Symec micro gerçek ölçü, parçacık eşiği ve tek kullanımlık 12–24 saat sınırıyla bulunmalı");
const jblSymecFloss = jblGeneralFlossAndFoam.filter((item) => item.model.startsWith("Symec filtre elyafı"));
assert.deepEqual(jblSymecFloss.map((item) => item.model), ["Symec filtre elyafı 100 g","Symec filtre elyafı 250 g","Symec filtre elyafı 500 g","Symec filtre elyafı 1000 g"], "JBL Symec elyaf ailesi dört gerçek paket ağırlığıyla ayrılmalı");
assert(jblSymecFloss.every((item) => item.description.includes("su debisi düştüğünde") && item.description.includes("yenilenmesi önerilir")), "JBL Symec elyafları güvenli yenileme işaretini taşımalı");
assert(jblGeneralFlossAndFoam.find((item) => item.model === "Symec XL 250 g yeşil")?.description.includes("Sıkışmayan"), "JBL Symec XL gerçek 250 g paketi ve sıkışmayan yapısıyla bulunmalı");
assert(jblGeneralFlossAndFoam.find((item) => item.model === "Symec VL 80 × 25 × 3 cm")?.description.includes("3 cm kalınlıktaki"), "JBL Symec VL gerçek mat ölçüsü ve kalınlığıyla bulunmalı");
const jblFineFoam = jblGeneralFlossAndFoam.filter((item) => item.model.startsWith("Mavi ince filtre süngeri"));
assert.deepEqual(jblFineFoam.map((item) => item.model), ["Mavi ince filtre süngeri 50 × 50 × 2,5 cm","Mavi ince filtre süngeri 50 × 50 × 5 cm","Mavi ince filtre süngeri 50 × 50 × 10 cm"], "JBL ince kesilebilir sünger üç gerçek kalınlıkla ayrılmalı");
assert(jblFineFoam.every((item) => item.description.includes("30 ppi") && item.description.includes("1–2 mm büyük")), "JBL ince süngerler doğru gözenek ve kesim talimatını taşımalı");
const jblCoarseFoam = jblGeneralFlossAndFoam.filter((item) => item.model.startsWith("Mavi kaba filtre süngeri"));
assert.deepEqual(jblCoarseFoam.map((item) => item.model), ["Mavi kaba filtre süngeri 50 × 50 × 2,5 cm","Mavi kaba filtre süngeri 50 × 50 × 5 cm","Mavi kaba filtre süngeri 50 × 50 × 10 cm"], "JBL kaba kesilebilir sünger üç gerçek kalınlıkla ayrılmalı");
assert(jblCoarseFoam.every((item) => item.description.includes("10 ppi") && item.description.includes("1–2 mm büyük")), "JBL kaba süngerler doğru gözenek ve kesim talimatını taşımalı");
const jblBacteriaStarters = jblCareProducts.filter((item) => item.category === "bacteria");
assert.equal(jblBacteriaStarters.length, 7, "JBL bakteri başlangıç ürünleri yedi gerçek paket seçeneğiyle doğru kategoride tutulmalı");
assert(jblBacteriaStarters.every((item) => item.sourceUrl.startsWith("https://www.jbl.de/") && item.verifiedAt === "2026-09-18"), "JBL bakteri başlangıç ürünleri doğrudan resmî ürün sayfası ve güncel doğrulama tarihi taşımalı");
const jblDenitrol = jblBacteriaStarters.filter((item) => item.model.startsWith("Denitrol"));
assert.deepEqual(jblDenitrol.map((item) => item.model), ["Denitrol 100 ml (Arşiv)","Denitrol 250 ml"], "JBL Denitrol arşiv 100 ml ve güncel 250 ml paketleriyle ayrılmalı");
assert(jblDenitrol.every((item) => item.description.includes("20 L suya 10 ml") && item.description.includes("300 L suya 10 ml")), "JBL Denitrol ilk kurulum ve su değişimi dozlarını ayrı ayrı taşımalı");
const jblFilterStart = jblBacteriaStarters.find((item) => item.model === "FilterStart 10 ml");
assert(jblFilterStart?.description.includes("3 L filtre malzemesine") && jblFilterStart.description.includes("35 °C"), "JBL FilterStart gerçek hacim ve saklama sınırıyla bulunmalı");
const jblFilterStartRed = jblBacteriaStarters.find((item) => item.model === "FilterStart Red 10 ml");
assert(jblFilterStartRed?.description.includes("Japon balığı") && jblFilterStartRed.description.includes("serin su") && !jblFilterStartRed.description.includes("karides"), "JBL FilterStart Red karides ürünü değil serin su Japon balığı ürünü olarak sınıflandırılmalı");
const jblFilterBoost = jblBacteriaStarters.find((item) => item.model === "FilterBoost 25 g");
assert(jblFilterBoost?.description.includes("5–6 L filtre hacmine") && jblFilterBoost.description.includes("tek sünger kartuşlu iç filtrelere uygun değildir"), "JBL FilterBoost kapasite ve filtre tipi kısıtını taşımalı");
const jblStartKit = jblBacteriaStarters.find((item) => item.model === "StartKit 2 × 15 ml");
assert(jblStartKit?.description.includes("10–60 L") && jblStartKit.description.includes("15 dakika sonra"), "JBL StartKit gerçek iki şişe, hacim ve uygulama sırasıyla bulunmalı");
const jblProCleanBac = jblBacteriaStarters.find((item) => item.model === "PROCLEAN BAC 50 ml");
assert(jblProCleanBac?.description.includes("60–200 L") && jblProCleanBac.description.includes("tek kullanımlık 50 ml") && jblProCleanBac.description.includes("tatlı su"), "JBL PROCLEAN BAC gerçek kartuş hacmi ve tatlı su kullanım aralığıyla bulunmalı");
assert.equal(jblCareProducts.filter((item) => item.category === "water_conditioner").length, 44, "JBL su düzenleyici, sorun çözücü ve eski deniz bakım ambalajları doğru kategoride tutulmalı");
const jblTroubleshooterLiquids = jblCareProducts.filter((item) => /^(Detoxol|PhosEx rapid|Clynol|Clearol) /.test(item.model));
assert.equal(jblTroubleshooterLiquids.length, 10, "JBL ilk dört sorun giderici ailesi on gerçek şişe seçeneğiyle bulunmalı");
assert(jblTroubleshooterLiquids.every((item) => item.sourceUrl.startsWith("https://www.jbl.de/") && item.verifiedAt === "2026-09-18"), "JBL sıvı sorun gidericileri doğrudan resmî ürün sayfası ve güncel doğrulama tarihi taşımalı");
const jblDetoxol = jblTroubleshooterLiquids.filter((item) => item.model.startsWith("Detoxol"));
assert.deepEqual(jblDetoxol.map((item) => item.model), ["Detoxol 100 ml","Detoxol 250 ml"], "JBL Detoxol iki gerçek şişe seçeneğiyle ayrılmalı");
assert(jblDetoxol.every((item) => item.description.includes("30 mg amonyum/amonyak") && item.description.includes("mevcut nitritin bağlanmadığını") && item.description.includes("su değişimi ve ölçümün yerine geçmez")), "JBL Detoxol kapasite ve üretici nitrit çelişkisini güvenli biçimde taşımalı");
const jblPhosExRapid = jblTroubleshooterLiquids.filter((item) => item.model.startsWith("PhosEx rapid"));
assert.deepEqual(jblPhosExRapid.map((item) => item.model), ["PhosEx rapid 100 ml","PhosEx rapid 250 ml"], "JBL PhosEx rapid iki gerçek şişe seçeneğiyle ayrılmalı");
assert(jblPhosExRapid.every((item) => item.description.includes("PO₄ >2,4 mg/L") && item.description.includes("aşındırıcıdır") && item.description.includes("ciddi cilt ve göz hasarı")), "JBL PhosEx rapid ölçüme bağlı doz ve resmî tehlike uyarısını taşımalı");
const jblClynol = jblTroubleshooterLiquids.filter((item) => item.model.startsWith("Clynol"));
assert.deepEqual(jblClynol.map((item) => item.model), ["Clynol 100 ml","Clynol 250 ml","Clynol 500 ml"], "JBL Clynol üç gerçek şişe seçeneğiyle ayrılmalı");
assert(jblClynol.every((item) => item.description.includes("haftalık doz 40 L suya 10 ml") && item.description.includes("2–24 saatte")), "JBL Clynol doğru doz ve berraklaşma süresini taşımalı");
const jblClearol = jblTroubleshooterLiquids.filter((item) => item.model.startsWith("Clearol"));
assert.deepEqual(jblClearol.map((item) => item.model), ["Clearol 100 ml","Clearol 250 ml","Clearol 500 ml"], "JBL Clearol üç gerçek şişe seçeneğiyle ayrılmalı");
assert(jblClearol.every((item) => item.description.includes("pH >6") && item.description.includes("KH >5 °dKH") && item.description.includes("haftalık düzenli kullanım önerilmez")), "JBL Clearol pH/KH güvenlik eşikleri ve tekrar kullanım uyarısını taşımalı");
const jblPhMinus = jblCareProducts.filter((item) => item.model.startsWith("pH-Minus"));
assert.deepEqual(jblPhMinus.map((item) => item.model), ["pH-Minus 100 ml (Son şans)","pH-Minus 250 ml (Son şans)"], "JBL pH-Minus iki gerçek son şans şişesiyle ayrılmalı");
assert(jblPhMinus.every((item) => item.description.includes("KH en az 4 °dKH") && item.description.includes("pH <7 iken kullanılmaz") && item.description.includes("ciddi cilt yanığı ve göz hasarı")), "JBL pH-Minus ölçüm ve kimyasal güvenlik sınırlarını taşımalı");
const jblPhPlus = jblCareProducts.filter((item) => item.model.startsWith("pH-Plus"));
assert.deepEqual(jblPhPlus.map((item) => item.model), ["pH-Plus 100 ml","pH-Plus 250 ml"], "JBL pH-Plus iki gerçek şişe seçeneğiyle ayrılmalı");
assert(jblPhPlus.every((item) => item.description.includes("yaklaşık 1 °dKH") && item.description.includes("birkaç güne yayılan küçük adımlarla")), "JBL pH-Plus KH etkisi ve yavaş ayarlama uyarısını taşımalı");
const jblNanoCrusta = jblCareProducts.find((item) => item.model === "Nano-Crusta 15 ml");
assert(jblNanoCrusta?.description.includes("2 L suya bir damla") && jblNanoCrusta.description.includes("700 L"), "JBL Nano-Crusta gerçek şişe ve haftalık dozuyla bulunmalı");
const jblAquadur = jblCareProducts.find((item) => item.model === "Aquadur 250 g");
assert(jblAquadur?.description.includes("18,75 g") && jblAquadur.description.includes("2,5 °dKH") && jblAquadur.description.includes("5–10 L değişim suyunda"), "JBL Aquadur gerçek paket, sertlik etkisi ve güvenli çözündürme talimatıyla bulunmalı");
const jblAquadurMt = jblCareProducts.find((item) => item.model === "Aquadur Malawi/Tanganjika 250 g");
assert(jblAquadurMt?.description.includes("30 g") && jblAquadurMt.description.includes("78,7 g") && jblAquadurMt.description.includes("KH ölçülmeden sabit doz uygulanmaz"), "JBL Aquadur Malawi/Tanganjika göle ve başlangıç KH'sına bağlı ayrı dozları taşımalı");
const jblPlantStart = jblCareProducts.find((item) => item.model === "PROSCAPE PLANT START 2 × 8 g");
assert(jblPlantStart?.sourceUrl.includes("/detail/8338/") && jblPlantStart.verifiedAt === "2026-09-18", "JBL PROSCAPE PLANT START doğrudan resmî ürün sayfası ve güncel doğrulama tarihi taşımalı");
assert(jblPlantStart?.description.includes("20–100 L") && jblPlantStart.description.includes("iki adet 8 g") && jblPlantStart.description.includes("sonradan eklenmez"), "JBL PROSCAPE PLANT START gerçek paket, hacim ve yalnız ilk kurulum sınırıyla bulunmalı");
const jblBiotopol = jblCareProducts.filter((item) => /^Biotopol (100|250|500|Refill|5 L)/.test(item.model));
assert.deepEqual(jblBiotopol.map((item) => item.model), ["Biotopol 100 ml","Biotopol 250 ml","Biotopol 500 ml","Biotopol Refill 500+125 ml","Biotopol 5 L"], "JBL Biotopol ailesinin beş gerçek paket seçeneği bulunmalı");
assert(jblBiotopol.every((item) => item.description.includes("40 L suya 10 ml") && item.description.includes("ayrı kova")), "JBL Biotopol paketleri ortak doz ve omurgasızlar için güvenli su hazırlama uyarısını taşımalı");
const jblBiotopolR = jblCareProducts.find((item) => item.model === "Biotopol R 100 ml");
assert(jblBiotopolR?.description.includes("Japon balığı") && !jblBiotopolR.description.includes("Karides"), "JBL Biotopol R karides ürünü değil Japon balığı su düzenleyicisi olarak sınıflandırılmalı");
const jblBiotopolC = jblCareProducts.find((item) => item.model === "Biotopol C 100 ml");
assert(jblBiotopolC?.description.includes("Karides") && jblBiotopolC.description.includes("ayrı kovada") && jblBiotopolC.description.includes("40 L suya 10 ml"), "JBL Biotopol C kabuklu hedefi, üretici dozu ve bakır güvenliğiyle bulunmalı");
const jblNanoBiotopolBetta = jblCareProducts.find((item) => item.model === "Nano-Biotopol Betta 15 ml");
assert(jblNanoBiotopolBetta?.description.includes("180 L") && jblNanoBiotopolBetta.description.includes("1 L suya 2 damla"), "JBL Nano-Biotopol Betta gerçek şişe hacmi ve dozuyla bulunmalı");
const jblAcclimol = jblCareProducts.filter((item) => item.model.startsWith("Acclimol "));
assert.deepEqual(jblAcclimol.map((item) => item.model), ["Acclimol 50 ml","Acclimol 100 ml","Acclimol 250 ml","Acclimol 500 ml","Acclimol 5 L"], "JBL Acclimol ailesinin beş gerçek paket seçeneği bulunmalı");
assert(jblAcclimol.every((item) => item.description.includes("40 L suya 10 ml")), "JBL Acclimol paketleri ortak üretici dozunu taşımalı");
const jblTropol = jblCareProducts.filter((item) => item.model.startsWith("Tropol "));
assert.deepEqual(jblTropol.map((item) => item.model), ["Tropol 100 ml","Tropol 250 ml","Tropol 5 L"], "JBL Tropol ailesinin üç gerçek paket seçeneği bulunmalı");
assert(jblTropol.every((item) => item.description.includes("40 L suya 10 ml") && item.description.includes("Biotopol yerine")), "JBL Tropol dozu ve tam musluk suyu düzenleyicisi olmadığı uyarısını taşımalı");
assert(jblCareProducts.find((item) => item.model === "Catappa XL 10 yaprak")?.description.includes("50–100 L suya bir yaprak"), "JBL Catappa XL yaprak adedi, boyu ve dozuyla bulunmalı");
assert(jblCareProducts.find((item) => item.model === "Nano-Catappa 10 yaprak")?.description.includes("15–30 L suya bir yaprak"), "JBL Nano-Catappa yaprak adedi ve nano akvaryum dozuyla bulunmalı");
assert.equal(jblCareProducts.filter((item) => item.category === "fertilizer").length, 24, "JBL PROFLORA ve PROSCAPE gübre aileleri doğru kategoride tutulmalı");
const jblAquabasis = jblCareProducts.filter((item) => item.model.startsWith("PROFLORA AquaBasis plus"));
assert.deepEqual(jblAquabasis.map((item) => item.model), ["PROFLORA AquaBasis plus 2,5 L","PROFLORA AquaBasis plus 5 L"], "JBL AquaBasis plus iki güncel paket hacmiyle seçilebilmeli");
assert(jblAquabasis.every((item) => item.description.includes("beş yıllık etkiyi") && item.description.includes("2–3 yıllık") && item.additionalSourceUrls?.some((url) => url.includes("/press/detail/973/"))), "AquaBasis süre açıklamalarındaki resmî kaynak farkı gizlenmemeli");
assert(jblCareProducts.find((item) => item.model === "PROFLORA Ferropol Tabs 30 tablet")?.description.includes("tabana gömülmez"), "Ferropol Tabs su kolonu tableti kök tableti gibi sunulmamalı");
assert(jblCareProducts.find((item) => item.model === "PROFLORA Ferropol Root 30 tablet")?.description.includes("omurgasızlara uygundur"), "Ferropol Root paket adedi ve omurgasız uyumluluğunu taşımalı");
assert(jblCareProducts.find((item) => item.model === "PROFLORA Florapol 700 g (Arşiv)")?.description.includes("resmî sayfada arşivlenmiştir"), "Florapol 700 g güncel ürün gibi gösterilmemeli");
const jblVolcanoPowder = jblCareProducts.find((item) => item.model === "PROSCAPE VOLCANO POWDER 250 g");
assert(jblVolcanoPowder?.description.includes("200 L") && jblVolcanoPowder.description.includes("12 ay") && jblVolcanoPowder.description.includes("taban ısıtma kablosuyla kullanılabilir"), "Volcano Powder miktarı, etki süresi ve taban ısıtma uyumluluğunu taşımalı");
const jblFerropolLiquids = jblCareProducts.filter((item) => /^PROFLORA Ferropol (100|250|500|Refill|5 L)/.test(item.model));
assert.deepEqual(jblFerropolLiquids.map((item) => item.model), ["PROFLORA Ferropol 100 ml (Eski seri)","PROFLORA Ferropol 250 ml (Arşiv)","PROFLORA Ferropol 500 ml (Arşiv)","PROFLORA Ferropol Refill 500+125 ml (Arşiv)","PROFLORA Ferropol 5 L (Eski seri)"], "JBL Ferropol eski sıvı seri beş gerçek paketle bulunmalı");
assert(jblFerropolLiquids.every((item) => item.description.includes("40 L başına 10 ml") || item.description.includes("40 L'ye 10 ml")), "Ferropol paketleri ortak üretici dozunu taşımalı");
const jblFerropol24 = jblCareProducts.filter((item) => item.model.startsWith("PROFLORA Ferropol 24"));
assert.deepEqual(jblFerropol24.map((item) => item.model), ["PROFLORA Ferropol 24 10 ml (Arşiv)","PROFLORA Ferropol 24 50 ml (Arşiv)"], "Ferropol 24 iki eski hacimle bulunmalı");
assert(jblFerropol24.every((item) => item.description.includes("50 L suya her gün bir damla") && item.description.includes("arşivlenmiştir")), "Ferropol 24 günlük doz ve arşiv durumunu taşımalı");
const jblProscapeLiquids = jblCareProducts.filter((item) => /^PROSCAPE (Fe|NPK|N |P |K |Mg )/.test(item.model));
assert.deepEqual(jblProscapeLiquids.map((item) => item.model), ["PROSCAPE Fe +MICROELEMENTS 250 ml","PROSCAPE Fe +MICROELEMENTS 500 ml","PROSCAPE NPK +MACROELEMENTS 250 ml","PROSCAPE NPK +MACROELEMENTS 500 ml","PROSCAPE N +MACROELEMENTS 250 ml","PROSCAPE P +MACROELEMENTS 250 ml","PROSCAPE K +MACROELEMENTS 250 ml","PROSCAPE Mg +MACROELEMENTS 250 ml"], "JBL PROSCAPE sıvı gübreleri sekiz gerçek hacim seçeneğiyle bulunmalı");
assert(jblProscapeLiquids.every((item) => item.description.includes("100 L'ye") && item.description.includes("Ürün kodu")), "PROSCAPE sıvıları ürün kodu ve ışık/CO2'ye bağlı doz bilgisi taşımalı");
assert.equal(jblCareProducts.filter((item) => item.category === "treatment").length, 17, "JBL Algol ve 14 arşiv ilaç ailesinin 16 gerçek paketi tedavi kategorisinde tutulmalı");
const jblProAquaTests = jblCareProducts.filter((item) =>
  item.category === "test" &&
  item.model.startsWith("PROAQUATEST") &&
  (item.model.endsWith(" Set") || item.model.endsWith(" Refill"))
);
assert.equal(jblProAquaTests.length, 38, "JBL PROAQUATEST ailesinin 19 set ve 19 refill seçeneği bulunmalı");
assert.equal(jblProAquaTests.filter((item) => item.model.endsWith(" Set")).length, 19, "JBL PROAQUATEST tam setleri refill ürünlerinden ayrılmalı");
assert.equal(jblProAquaTests.filter((item) => item.model.endsWith(" Refill")).length, 19, "JBL PROAQUATEST refill ürünleri tam setlerden ayrılmalı");
const jblProAquaCoreTests = jblProAquaTests.filter((item) => /pH 3\.0-10\.0|pH 6\.0-7\.6|pH 7\.4-9\.0|GH General hardness|KH Carbonate hardness/.test(item.model));
assert.equal(jblProAquaCoreTests.length, 10, "JBL temel pH/GH/KH testlerinin beş set ve beş refill seçeneği bulunmalı");
assert(jblProAquaCoreTests.every((item) => item.sourceUrl.includes("/products/detail/") && item.verifiedAt === "2026-09-18"), "JBL temel pH/GH/KH testleri doğrudan resmî ürün sayfalarına bağlı olmalı");
assert(careProductCatalog.find((item) => item.model === "PROAQUATEST pH 3.0-10.0 Set")?.description.includes("2410117") && careProductCatalog.find((item) => item.model === "PROAQUATEST pH 3.0-10.0 Refill")?.description.includes("2410219"), "JBL geniş aralıklı pH set/refill ürün kodları ayrılmalı");
assert(careProductCatalog.find((item) => item.model === "PROAQUATEST pH 6.0-7.6 Refill")?.description.includes("tam set yerine geçmez") && careProductCatalog.find((item) => item.model === "PROAQUATEST pH 7.4-9.0 Set")?.description.includes("2410517"), "JBL hassas pH set/refill içerikleri karıştırılmamalı");
assert(careProductCatalog.find((item) => item.model === "PROAQUATEST GH General hardness Set")?.description.includes("deniz suyunda GH yerine") && careProductCatalog.find((item) => item.model === "PROAQUATEST KH Carbonate hardness Refill")?.description.includes("aşındırıcıdır"), "JBL GH/KH kullanım ve kimyasal güvenlik sınırları korunmalı");
const jblProAquaChemicalTests = jblProAquaTests.filter((item) => /O2 Oxygen|Cu Copper|Fe Iron|SiO2 Silicate|NH4 Ammonium/.test(item.model));
assert.equal(jblProAquaChemicalTests.length, 10, "JBL O2/Cu/Fe/SiO2/NH4 testlerinin beş set ve beş refill seçeneği bulunmalı");
assert(jblProAquaChemicalTests.every((item) => item.sourceUrl.includes("/products/detail/") && item.verifiedAt === "2026-09-18"), "JBL O2/Cu/Fe/SiO2/NH4 testleri doğrudan resmî ürün sayfalarına bağlı olmalı");
assert(careProductCatalog.find((item) => item.model === "PROAQUATEST O2 Oxygen Set")?.description.includes("üç reaktif") && careProductCatalog.find((item) => item.model === "PROAQUATEST O2 Oxygen Refill")?.description.includes("organ hasarı"), "JBL O2 set içeriği ve kimyasal güvenliği korunmalı");
assert(careProductCatalog.find((item) => item.model === "PROAQUATEST Cu Copper Set")?.description.includes("şelatlanmış bakırı göstermez") && careProductCatalog.find((item) => item.model === "PROAQUATEST Fe Iron Refill")?.description.includes("2411719"), "JBL Cu ölçüm sınırı ve Fe refill kimliği korunmalı");
assert(careProductCatalog.find((item) => item.model === "PROAQUATEST SiO2 Silicate Set")?.description.includes("2411800") && careProductCatalog.find((item) => item.model === "PROAQUATEST SiO2 Silicate Refill")?.description.includes("birlikte yenilenir"), "JBL SiO2 set/refill kapsamı korunmalı");
assert(careProductCatalog.find((item) => item.model === "PROAQUATEST NH4 Ammonium Set")?.description.includes("pH tablosuyla NH3") && careProductCatalog.find((item) => item.model === "PROAQUATEST NH4 Ammonium Refill")?.description.includes("zehirli gaz"), "JBL NH4 ölçüm ve kimyasal güvenlik sınırları korunmalı");
const jblProAquaNutrientTests = jblProAquaTests.filter((item) => /NO2 Nitrite|NO3 Nitrate|PO4 Phosphate Sensitive|K Potassium/.test(item.model));
assert.equal(jblProAquaNutrientTests.length, 8, "JBL NO2/NO3/PO4/K testlerinin dört set ve dört refill seçeneği bulunmalı");
assert(jblProAquaNutrientTests.every((item) => item.sourceUrl.includes("/products/detail/") && item.verifiedAt === "2026-09-18"), "JBL NO2/NO3/PO4/K testleri doğrudan resmî ürün sayfalarına bağlı olmalı");
assert(careProductCatalog.find((item) => item.model === "PROAQUATEST NO2 Nitrite Set")?.description.includes("üç hafta günlük") && careProductCatalog.find((item) => item.model === "PROAQUATEST NO3 Nitrate Set")?.description.includes("bir dakika kuvvetle"), "JBL NO2/NO3 kullanım süreleri korunmalı");
assert(careProductCatalog.find((item) => item.model === "PROAQUATEST PO4 Phosphate Sensitive Set")?.description.includes("polifosfatı doğrudan ölçmez") && careProductCatalog.find((item) => item.model === "PROAQUATEST PO4 Phosphate Sensitive Refill")?.description.includes("takım halinde"), "JBL PO4 ölçüm sınırı ve refill yenileme kuralı korunmalı");
assert(careProductCatalog.find((item) => item.model === "PROAQUATEST K Potassium Set")?.description.includes("uzman uygulamasıdır") && careProductCatalog.find((item) => item.model === "PROAQUATEST K Potassium Refill")?.description.includes("2413100"), "JBL K tatlı/deniz suyu sınırı ve refill kimliği korunmalı");
const jblProAquaMineralCo2Tests = jblProAquaTests.filter((item) => /Ca Calcium|Mg-Ca Magnesium-Calcium|CO2-pH Permanent|CO2 Direct|Mg Magnesium Fresh water/.test(item.model));
assert.equal(jblProAquaMineralCo2Tests.length, 10, "JBL Ca/Mg/CO2 testlerinin beş set ve beş refill seçeneği bulunmalı");
assert(jblProAquaMineralCo2Tests.every((item) => item.sourceUrl.includes("/products/detail/") && item.verifiedAt === "2026-09-18"), "JBL Ca/Mg/CO2 testleri doğrudan resmî ürün sayfalarına bağlı olmalı");
assert(careProductCatalog.find((item) => item.model === "PROAQUATEST Ca Calcium Set")?.description.includes("damla sayısı × 20") && careProductCatalog.find((item) => item.model === "PROAQUATEST Ca Calcium Refill")?.description.includes("2413319"), "JBL Ca titrasyon hesabı ve refill kimliği korunmalı");
assert(careProductCatalog.find((item) => item.model === "PROAQUATEST Mg-Ca Magnesium-Calcium Set")?.description.includes("doğal deniz suyunda × 100") && careProductCatalog.find((item) => item.model === "PROAQUATEST Mg-Ca Magnesium-Calcium Refill")?.description.includes("2413719"), "JBL Mg-Ca yapay/doğal deniz suyu faktörleri korunmalı");
assert(careProductCatalog.find((item) => item.model === "PROAQUATEST CO2-pH Permanent Set")?.description.includes("sıvı karbon ürünleri") && careProductCatalog.find((item) => item.model === "PROAQUATEST CO2-pH Permanent Refill")?.description.includes("2413900"), "JBL kalıcı CO2-pH testinin ölçüm sınırı ve refill kimliği korunmalı");
assert(careProductCatalog.find((item) => item.model === "PROAQUATEST CO2 Direct Set")?.description.includes("damla sayısı × 2") && careProductCatalog.find((item) => item.model === "PROAQUATEST CO2 Direct Refill")?.description.includes("2414100"), "JBL doğrudan CO2 titrasyon hesabı ve refill kimliği korunmalı");
assert(careProductCatalog.find((item) => item.model === "PROAQUATEST Mg Magnesium Fresh water Set")?.description.includes("karşılaştırma") && careProductCatalog.find((item) => item.model === "PROAQUATEST Mg Magnesium Fresh water Refill")?.description.includes("2414300"), "JBL tatlı su Mg karşılaştırma seti ve refill kimliği korunmalı");
assert(jblProAquaTests.filter((item) => item.model.endsWith(" Refill")).every((item) => item.description.includes("yalnız yedek") && item.description.includes("yerine geçmez")), "JBL refill seçenekleri tam test seti gibi gösterilmemeli");
const jblTestCases = jblCareProducts.filter((item) => [
  "jbl-proaquatest-combiset-plus-fe","jbl-proaquatest-combiset-plus-nh4","jbl-proaquatest-lab",
  "jbl-proaquatest-lab-proscape","jbl-proaquatest-lab-marin","jbl-proaquatest-combiset-marin",
].includes(item.id));
assert.equal(jblTestCases.length, 6, "JBL'nin altı güncel test çantası bulunmalı");
assert(jblTestCases.every((item) => item.category === "test" && item.sourceUrl.includes("/products/detail/")), "JBL test çantaları doğrudan resmî ürün sayfasına bağlanmalı");
assert(careProductCatalog.find((item) => item.id === "jbl-proaquatest-lab")?.description.includes("13 testli"), "JBL PROAQUATEST LAB 13 testli içerikle tanımlanmalı");
assert(jblTestCases.every((item) => item.description.includes("Ürün kodu") && item.verifiedAt === "2026-09-18"), "JBL güncel test çantalarının ürün kimlikleri ve doğrulama tarihi korunmalı");
assert(careProductCatalog.find((item) => item.id === "jbl-proaquatest-lab-marin")?.description.includes("asitle temasında zehirli gaz") && careProductCatalog.find((item) => item.id === "jbl-proaquatest-lab-proscape")?.description.includes("deniz suyu laboratuvar çantası değildir"), "JBL LAB Marin kimyasal güvenliği ile PROSCAPE su türü sınırı korunmalı");
const jblEasy7in1 = careProductCatalog.find((item) => item.id === "jbl-proaquatest-easy-7in1");
assert(jblEasy7in1?.description.includes("50 adet") && jblEasy7in1.description.includes("fosfat ve amonyum ölçmez"), "JBL EASY 7in1 şerit adedi ve ölçüm sınırı kullanıcıya açık olmalı");
const jblProscan = careProductCatalog.find((item) => item.id === "jbl-proscan");
const jblProscanRecharge = careProductCatalog.find((item) => item.id === "jbl-proscan-recharge");
assert(jblProscan?.description.includes("24 analiz şeridi") && jblProscan.description.includes("renk kartı"), "JBL PROSCAN başlangıç setinin şerit ve renk kartı içeriği bulunmalı");
assert(jblProscanRecharge?.description.includes("24 adet yedek") && jblProscanRecharge.description.includes("renk kartı içermez"), "JBL PROSCAN RECHARGE tam başlangıç seti gibi gösterilmemeli");
assert(jblProscan?.description.includes("2542000") && jblProscanRecharge?.description.includes("2542100"), "JBL PROSCAN başlangıç ve recharge ürün kodları korunmalı");
assert([jblProscan,jblProscanRecharge].every((item) => item?.description.includes("deniz suyuna uygun değildir") && item.description.includes("EASY 7in1") && item.verifiedAt === "2026-09-18"), "JBL PROSCAN su türü ve şerit uyumluluk sınırları korunmalı");
const jblProNovoBelCorePackages = jblCareProducts.filter((item) => /^(PRONOVO BEL FLAKES S|PRONOVO BEL FLAKES M|PRONOVO BEL GRANO XXS|PRONOVO BEL GRANO XS|PRONOVO BEL GRANO S|PRONOVO BEL GRANO M|PRONOVO TAB M) /.test(item.model));
assert.equal(jblProNovoBelCorePackages.length, 18, "JBL PRONOVO toplum ana yemlerinin 18 gerçek ambalaj seçeneği bulunmalı");
assert(jblProNovoBelCorePackages.every((item) => item.sourceUrl.includes("/detail/") && item.verifiedAt === "2026-09-18"), "JBL PRONOVO toplum ana yem ambalajları doğrudan resmî ürün sayfasına bağlı olmalı");
assert.equal(jblProNovoBelCorePackages.filter((item) => item.model.startsWith("PRONOVO BEL FLAKES M ")).length, 5, "JBL PRONOVO BEL FLAKES M beş ambalajla korunmalı");
assert(careProductCatalog.find((item) => item.model === "PRONOVO BEL GRANO XS 20 ml Freshlock")?.description.includes("çelişki") && careProductCatalog.find((item) => item.model === "PRONOVO TAB M 5,5 L")?.description.includes("2900 g"), "JBL PRONOVO XS kaynak çelişkisi ve TAB büyük ambalaj ağırlığı korunmalı");
const jblProNovoJuvenileHolidayFoods = jblCareProducts.filter((item) => /^(PRONOVO BEL FLAKES BABY|PRONOVO BEL GRANO BABY|PRONOVO BEL FLUID|PRONOVO BEL WEEKEND|PRONOVO BEL HOLIDAY) /.test(item.model));
assert.equal(jblProNovoJuvenileHolidayFoods.length, 5, "JBL PRONOVO yavru, sıvı ve tatil yemlerinin beş gerçek ambalajı bulunmalı");
assert(jblProNovoJuvenileHolidayFoods.every((item) => item.sourceUrl.includes("/detail/") && item.verifiedAt === "2026-09-18"), "JBL PRONOVO yavru ve tatil yemleri doğrudan resmî ürün sayfasına bağlı olmalı");
assert(careProductCatalog.find((item) => item.model === "PRONOVO BEL FLAKES BABY 3 × 10 ml")?.description.includes("3112418") && careProductCatalog.find((item) => item.model === "PRONOVO BEL FLAKES BABY 3 × 10 ml")?.description.includes("üç farklı"), "JBL FLAKES BABY ürün kodu ve üç büyüme boyu korunmalı");
assert(careProductCatalog.find((item) => item.model === "PRONOVO BEL GRANO BABY 3 × 10 ml")?.description.includes("5–20 mm") && careProductCatalog.find((item) => item.model === "PRONOVO BEL GRANO BABY 3 × 10 ml")?.description.includes("%10 Artemia"), "JBL GRANO BABY hedef yavru boyu ve Artemia oranı korunmalı");
assert(careProductCatalog.find((item) => item.model === "PRONOVO BEL FLUID 50 ml")?.description.includes("3112618") && careProductCatalog.find((item) => item.model === "PRONOVO BEL FLUID 50 ml")?.description.includes("damlalıklı"), "JBL BEL FLUID ürün kodu ve damlalıklı ambalajı korunmalı");
assert(careProductCatalog.find((item) => item.model === "PRONOVO BEL WEEKEND 4 blok")?.description.includes("üç gün") && careProductCatalog.find((item) => item.model === "PRONOVO BEL WEEKEND 4 blok")?.description.includes("genel sertliği"), "JBL WEEKEND blok sayısı, kullanım süresi ve sertlik etkisi korunmalı");
assert(careProductCatalog.find((item) => item.model === "PRONOVO BEL HOLIDAY 1 blok")?.description.includes("20–25") && careProductCatalog.find((item) => item.model === "PRONOVO BEL HOLIDAY 1 blok")?.description.includes("14 güne kadar") && careProductCatalog.find((item) => item.model === "PRONOVO BEL HOLIDAY 1 blok")?.description.includes("genel sertliği"), "JBL HOLIDAY balık sayısı, kullanım süresi ve sertlik etkisi korunmalı");
const jblProNovoSpirulinaPackages = jblCareProducts.filter((item) => item.model.startsWith("PRONOVO SPIRULINA "));
assert.equal(jblProNovoSpirulinaPackages.length, 6, "JBL PRONOVO Spirulina ailesinde altı gerçek ambalaj seçeneği bulunmalı");
assert.equal(jblProNovoSpirulinaPackages.filter((item) => item.model.startsWith("PRONOVO SPIRULINA FLAKES M ")).length, 4, "JBL PRONOVO Spirulina pul yem dört hacimle korunmalı");
assert(jblProNovoSpirulinaPackages.every((item) => item.sourceUrl.includes("/detail/") && item.verifiedAt === "2026-09-18" && item.description.includes("%20 Spirulina")), "JBL PRONOVO Spirulina ambalajları doğrudan resmî ürün sayfasına ve yayımlanan Spirulina oranına bağlı olmalı");
assert(careProductCatalog.find((item) => item.model === "PRONOVO SPIRULINA GRANO S 100 ml")?.description.includes("3113618") && careProductCatalog.find((item) => item.model === "PRONOVO SPIRULINA GRANO M 250 ml")?.description.includes("3113718"), "JBL Spirulina S ve M granül ürün kodları korunmalı");
const jblProNovoColorPackages = jblCareProducts.filter((item) => item.model.startsWith("PRONOVO COLOR "));
assert.equal(jblProNovoColorPackages.length, 4, "JBL PRONOVO Color ailesinde dört gerçek ambalaj seçeneği bulunmalı");
assert.equal(jblProNovoColorPackages.filter((item) => item.model.startsWith("PRONOVO COLOR FLAKES M ")).length, 2, "JBL PRONOVO Color pul yem iki hacimle korunmalı");
assert(jblProNovoColorPackages.every((item) => item.sourceUrl.includes("/detail/") && item.verifiedAt === "2026-09-18" && item.description.includes("ham protein %40")), "JBL PRONOVO Color ambalajları doğrudan resmî ürün sayfasına ve yayımlanan besin değerlerine bağlı olmalı");
assert(careProductCatalog.find((item) => item.model === "PRONOVO COLOR FLAKES M 250 ml")?.description.includes("3113918") && careProductCatalog.find((item) => item.model === "PRONOVO COLOR GRANO M 250 ml")?.description.includes("125 g"), "JBL Color 250 ml pul ürün kodu ve M granül net ağırlığı korunmalı");
const jblLegacyWaterTests = jblCareProducts.filter((item) => item.sourceUrl.includes("/group/4034/test-sets-and-refills"));
assert.equal(jblLegacyWaterTests.length, 18, "JBL eski su testi grubunda 18 tekil test bulunmalı");
assert(jblLegacyWaterTests.every((item) => item.category === "test" && item.description.includes("arşiv olarak listelenir") && item.description.includes("PROAQUATEST") && item.verifiedAt === "2026-09-15"), "JBL eski su testleri güncel PROAQUATEST ürünleri gibi gösterilmemeli");
assert.equal(jblLegacyWaterTests.filter((item) => item.model.includes("Oxygen")).length, 2, "JBL eski ve New Formula oksijen testleri ayrı model olarak korunmalı");
const jblLegacyTestCases = jblCareProducts.filter((item) => item.sourceUrl.includes("/group/6051/test-case"));
assert.deepEqual(jblLegacyTestCases.map((item) => item.model), ["Test Combi Set plus Fe","Test Combi Set Plus NH4","Testlab","Testlab ProScape","Testlab Marin","Test Combi Set Marin"], "JBL eski test çantalarının altı modeli resmî sırayla bulunmalı");
assert(jblLegacyTestCases.every((item) => item.category === "test" && item.description.includes("arşiv olarak listelenir") && item.description.includes("PROAQUATEST") && item.verifiedAt === "2026-09-15"), "JBL eski test çantaları güncel PROAQUATEST çantaları gibi gösterilmemeli");
assert.equal(jblCareProducts.filter((item) => item.category === "test").length, 71, "JBL test kategorisinde 71 doğrulanmış güncel ve arşiv seçenek bulunmalı");
const jblCommunityFood = jblCareProducts.filter((item) =>
  item.category === "food" &&
  (jblProNovoBelCorePackages.some((core) => core.id === item.id) || jblProNovoJuvenileHolidayFoods.some((food) => food.id === item.id) || jblProNovoSpirulinaPackages.some((food) => food.id === item.id) || jblProNovoColorPackages.some((food) => food.id === item.id))
);
assert.equal(jblCommunityFood.length, 33, "JBL toplum akvaryumu PRONOVO grubunda 33 güncel ürün/ambalaj seçeneği bulunmalı");
assert.equal(jblCommunityFood.filter((item) => item.model.startsWith("PRONOVO BEL") || item.model.startsWith("PRONOVO TAB M")).length, 23, "JBL PRONOVO genel yem ailesinde 23 ürün/ambalaj seçeneği bulunmalı");
assert.equal(jblCommunityFood.filter((item) => item.model.startsWith("PRONOVO SPIRULINA")).length, 6, "JBL PRONOVO Spirulina ailesinde altı ambalaj bulunmalı");
assert.equal(jblCommunityFood.filter((item) => item.model.startsWith("PRONOVO COLOR")).length, 4, "JBL PRONOVO renk yemi ailesinde dört ambalaj bulunmalı");
assert(jblCommunityFood.every((item) => item.sourceUrl.startsWith("https://www.jbl.de/") && ["2026-09-14","2026-09-18"].includes(item.verifiedAt)), "JBL toplum akvaryumu yemleri güncel resmî ürün veya grup sayfalarına bağlanmalı");
const jblSpeciesDirectFoods = jblCareProducts.filter((item) => /^(PRONOVO NEON GRANO XXS|PRONOVO DANIO GRANO XS|PRONOVO GUPPY FLAKES S|PRONOVO GUPPY GRANO S) /.test(item.model));
assert.equal(jblSpeciesDirectFoods.length, 8, "JBL Neon, Danio ve Guppy yemlerinde sekiz gerçek ambalaj seçeneği bulunmalı");
assert(jblSpeciesDirectFoods.every((item) => item.sourceUrl.includes("/detail/") && item.verifiedAt === "2026-09-18"), "JBL Neon, Danio ve Guppy ambalajları doğrudan resmî ürün sayfalarına bağlı olmalı");
assert.equal(jblSpeciesDirectFoods.filter((item) => item.model.startsWith("PRONOVO NEON GRANO XXS ")).length, 2, "JBL PRONOVO NEON 20 ve 100 ml seçenekleriyle korunmalı");
assert.equal(jblSpeciesDirectFoods.filter((item) => item.model.startsWith("PRONOVO DANIO GRANO XS ")).length, 2, "JBL PRONOVO DANIO 20 ve 100 ml seçenekleriyle korunmalı");
assert.equal(jblSpeciesDirectFoods.filter((item) => item.model.startsWith("PRONOVO GUPPY ")).length, 4, "JBL PRONOVO GUPPY pul ve granül yemleri ikişer hacimle korunmalı");
assert(careProductCatalog.find((item) => item.model === "PRONOVO NEON GRANO XXS 20 ml Freshlock")?.description.includes("16 g") && careProductCatalog.find((item) => item.model === "PRONOVO NEON GRANO XXS 100 ml")?.description.includes("48 g"), "JBL NEON küçük ve kutu ambalaj ağırlıkları korunmalı");
assert(careProductCatalog.find((item) => item.model === "PRONOVO DANIO GRANO XS 100 ml")?.description.includes("3115118") && careProductCatalog.find((item) => item.model === "PRONOVO GUPPY GRANO S 250 ml")?.description.includes("136 g"), "JBL DANIO ürün kodu ve GUPPY büyük granül ağırlığı korunmalı");
const jblCichlidFoodPackages = jblCareProducts.filter((item) => /^(PRONOVO TANGANYIKA FLAKES M|PRONOVO TANGANYIKA GRANO M|PRONOVO MALAWI FLAKES M|PRONOVO MALAWI GRANO M|PRONOVO BITS GRANO S|PRONOVO BITS GRANO M|PRONOVO CICHLID GRANO S|PRONOVO CICHLID GRANO M|PRONOVO CICHLID GRANO XL) /.test(item.model));
assert.equal(jblCichlidFoodPackages.length, 20, "JBL Tanganyika, Malawi, BITS ve CICHLID ailelerinde 20 gerçek ambalaj seçeneği bulunmalı");
assert(jblCichlidFoodPackages.every((item) => item.sourceUrl.includes("/detail/") && item.verifiedAt === "2026-09-18"), "JBL güncel ciklet yemi ambalajları doğrudan resmî ürün sayfalarına bağlı olmalı");
assert.equal(jblCichlidFoodPackages.filter((item) => item.model.startsWith("PRONOVO TANGANYIKA ")).length, 5, "JBL Tanganyika pul ve granül yemlerinde beş ambalaj bulunmalı");
assert.equal(jblCichlidFoodPackages.filter((item) => item.model.startsWith("PRONOVO MALAWI ")).length, 5, "JBL Malawi pul ve granül yemlerinde beş ambalaj bulunmalı");
assert.equal(jblCichlidFoodPackages.filter((item) => item.model.startsWith("PRONOVO BITS ")).length, 5, "JBL BITS S ve M granül yemlerinde beş ambalaj bulunmalı");
assert.equal(jblCichlidFoodPackages.filter((item) => item.model.startsWith("PRONOVO CICHLID GRANO ")).length, 5, "JBL CICHLID S, M ve XL granül yemlerinde beş ambalaj bulunmalı");
assert(careProductCatalog.find((item) => item.model === "PRONOVO TANGANYIKA GRANO M 1000 ml")?.description.includes("570 g") && careProductCatalog.find((item) => item.model === "PRONOVO MALAWI FLAKES M 1000 ml")?.description.includes("190 g"), "JBL Tanganyika granül ve Malawi pul büyük kutu ağırlıkları korunmalı");
assert(careProductCatalog.find((item) => item.model === "PRONOVO BITS GRANO M 5,5 L")?.description.includes("2640 g") && careProductCatalog.find((item) => item.model === "PRONOVO MALAWI GRANO M 5,5 L")?.description.includes("%18 Spirulina"), "JBL BITS büyük ambalaj ağırlığı ve Malawi Spirulina oranı korunmalı");
assert(careProductCatalog.find((item) => item.model === "PRONOVO CICHLID GRANO M 1000 ml")?.description.includes("520 g") && careProductCatalog.find((item) => item.model === "PRONOVO CICHLID GRANO XL 1000 ml")?.description.includes("15–25 cm"), "JBL CICHLID M büyük kutu ağırlığı ve XL hedef boyu korunmalı");
const jblBettaGouramiPackages = jblCareProducts.filter((item) => /^(PRONOVO BETTA INSECT STICK S|PRONOVO BETTA FLAKES S|PRONOVO BETTA GRANO S|PRONOVO GOURAMI GRANO S) /.test(item.model));
assert.equal(jblBettaGouramiPackages.length, 7, "JBL Betta ve Gourami ailelerinde yedi gerçek ambalaj seçeneği bulunmalı");
assert(jblBettaGouramiPackages.every((item) => item.sourceUrl.includes("/detail/") && item.verifiedAt === "2026-09-18"), "JBL Betta ve Gourami ambalajları doğrudan resmî ürün sayfalarına bağlı olmalı");
assert.equal(jblBettaGouramiPackages.filter((item) => item.model.startsWith("PRONOVO BETTA INSECT STICK S ")).length, 2, "JBL Betta böcek çubuğunun 20 ve 100 ml seçenekleri korunmalı");
assert.equal(jblBettaGouramiPackages.filter((item) => item.model.startsWith("PRONOVO BETTA FLAKES S ")).length, 2, "JBL Betta pul yeminin arşiv 20 ml ve güncel 100 ml seçenekleri korunmalı");
assert.equal(jblBettaGouramiPackages.filter((item) => item.model.startsWith("PRONOVO BETTA GRANO S ")).length, 2, "JBL Betta granül yeminin 20 ve 100 ml seçenekleri korunmalı");
assert.equal(jblBettaGouramiPackages.filter((item) => item.model.startsWith("PRONOVO GOURAMI GRANO S ")).length, 1, "JBL Gourami granül yemi 250 ml ambalajıyla korunmalı");
assert(careProductCatalog.find((item) => item.model === "PRONOVO BETTA FLAKES S 20 ml (Arşiv)")?.description.includes("artık satışta değildir"), "JBL Betta 20 ml pul yemin arşiv durumu açıkça belirtilmeli");
assert(careProductCatalog.find((item) => item.model === "PRONOVO BETTA INSECT STICK S 100 ml")?.description.includes("Hermetia böcek proteini %15"), "JBL Betta böcek çubuğunun yayımlanan Hermetia oranı korunmalı");
assert(careProductCatalog.find((item) => item.model === "PRONOVO GOURAMI GRANO S 250 ml")?.description.includes("karides unu %12") && careProductCatalog.find((item) => item.model === "PRONOVO GOURAMI GRANO S 250 ml")?.description.includes("oranı yayımlanmamıştır"), "JBL Gourami yeminde karides oranı korunmalı ve Hermetia oranı uydurulmamalı");
const jblColdwaterFoodPackages = jblCareProducts.filter((item) => /^(PRONOVO RED INSECT STICK S|PRONOVO RED FLAKES M|PRONOVO RED GRANO M|PRONOVO RED HOLIDAY|PRONOVO FANTAIL GRANO S|PRONOVO FANTAIL GRANO M) /.test(item.model));
assert.equal(jblColdwaterFoodPackages.length, 13, "JBL soğuk su ve Japon balığı grubunda 13 gerçek ambalaj seçeneği bulunmalı");
assert(jblColdwaterFoodPackages.every((item) => item.sourceUrl.includes("/detail/") && item.verifiedAt === "2026-09-18"), "JBL soğuk su yemi ambalajları doğrudan resmî ürün sayfalarına bağlı olmalı");
assert.equal(jblColdwaterFoodPackages.filter((item) => item.model.startsWith("PRONOVO RED INSECT STICK S ")).length, 2, "JBL RED INSECT 20 ve 100 ml seçenekleriyle korunmalı");
assert.equal(jblColdwaterFoodPackages.filter((item) => item.model.startsWith("PRONOVO RED FLAKES M ")).length, 4, "JBL RED FLAKES dört gerçek ambalajla korunmalı");
assert.equal(jblColdwaterFoodPackages.filter((item) => item.model.startsWith("PRONOVO RED GRANO M ")).length, 2, "JBL RED GRANO 100 ve 250 ml seçenekleriyle korunmalı");
assert.equal(jblColdwaterFoodPackages.filter((item) => item.model.startsWith("PRONOVO FANTAIL GRANO ")).length, 4, "JBL FANTAIL S ve M ailelerinde dört gerçek ambalaj bulunmalı");
assert(careProductCatalog.find((item) => item.model === "PRONOVO RED INSECT STICK S 20 ml (Arşiv)")?.description.includes("artık satışta değildir"), "JBL RED INSECT 20 ml arşiv durumu açıkça belirtilmeli");
assert(careProductCatalog.find((item) => item.model === "PRONOVO RED FLAKES M 750 ml Refill")?.description.includes("135 g") && careProductCatalog.find((item) => item.model === "PRONOVO RED FLAKES M 1000 ml")?.description.includes("180 g"), "JBL RED FLAKES refill ve büyük kutu ağırlıkları korunmalı");
assert(careProductCatalog.find((item) => item.model === "PRONOVO RED HOLIDAY 3 blok")?.description.includes("1–3 balığı 4–6 gün") && careProductCatalog.find((item) => item.model === "PRONOVO RED HOLIDAY 3 blok")?.description.includes("genel sertliği"), "JBL RED HOLIDAY kullanım süresi ve sertlik etkisini açıkça taşımalı");
assert(careProductCatalog.find((item) => item.model === "PRONOVO FANTAIL GRANO M 1000 ml")?.description.includes("580 g") && careProductCatalog.find((item) => item.model === "PRONOVO FANTAIL GRANO S 100 ml")?.description.includes("3–10 cm"), "JBL FANTAIL M büyük paket ağırlığı ve S hedef boyu korunmalı");
const jblBottomFoodPackages = jblCareProducts.filter((item) => /^(PRONOVO BOTIA TAB M|PRONOVO PLECO WAFER M|PRONOVO PLECO WAFER XL|PRONOVO CORYDORAS TAB M) /.test(item.model));
assert.equal(jblBottomFoodPackages.length, 13, "JBL dip balığı grubunda 13 gerçek ambalaj seçeneği bulunmalı");
assert(jblBottomFoodPackages.every((item) => item.sourceUrl.includes("/detail/") && item.verifiedAt === "2026-09-18"), "JBL dip balığı yemleri doğrudan resmî ürün sayfalarına bağlı olmalı");
assert.equal(jblBottomFoodPackages.filter((item) => item.model.startsWith("PRONOVO BOTIA TAB M ")).length, 4, "JBL BOTIA dört gerçek ambalajla korunmalı");
assert.equal(jblBottomFoodPackages.filter((item) => item.model.startsWith("PRONOVO PLECO WAFER M ")).length, 4, "JBL PLECO M dört gerçek ambalajla korunmalı");
assert.equal(jblBottomFoodPackages.filter((item) => item.model.startsWith("PRONOVO PLECO WAFER XL ")).length, 3, "JBL PLECO XL üç gerçek ambalajla korunmalı");
assert.equal(jblBottomFoodPackages.filter((item) => item.model.startsWith("PRONOVO CORYDORAS TAB M ")).length, 2, "JBL CORYDORAS iki gerçek ambalajla korunmalı");
assert(careProductCatalog.find((item) => item.model === "PRONOVO BOTIA TAB M 5,5 L")?.description.includes("2900 g") && careProductCatalog.find((item) => item.model === "PRONOVO BOTIA TAB M 5,5 L")?.description.includes("Spirulina %14"), "JBL BOTIA büyük ambalaj ağırlığı ve Spirulina oranı korunmalı");
assert(careProductCatalog.find((item) => item.model === "PRONOVO PLECO WAFER M 5,5 L")?.description.includes("2900 g") && careProductCatalog.find((item) => item.model === "PRONOVO PLECO WAFER M 5,5 L")?.description.includes("odun lifi %10"), "JBL PLECO M büyük ambalaj ağırlığı ve odun lifi oranı korunmalı");
assert(careProductCatalog.find((item) => item.model === "PRONOVO PLECO WAFER XL 1000 ml")?.description.includes("510 g") && careProductCatalog.find((item) => item.model === "PRONOVO PLECO WAFER XL 5,5 L")?.description.includes("2800 g") && careProductCatalog.find((item) => item.model === "PRONOVO PLECO WAFER XL 250 ml")?.description.includes("15–40 cm"), "JBL PLECO XL ağırlıkları ve hedef boyu korunmalı");
assert(careProductCatalog.find((item) => item.model === "PRONOVO CORYDORAS TAB M 250 ml")?.description.includes("150 g") && careProductCatalog.find((item) => item.model === "PRONOVO CORYDORAS TAB M 250 ml")?.description.includes("karides unu %10,53") && careProductCatalog.find((item) => item.model === "PRONOVO CORYDORAS TAB M 250 ml")?.description.includes("oranı yayımlanmamıştır"), "JBL CORYDORAS ağırlığı ile yayımlanan karides oranı korunmalı ve Hermetia oranı uydurulmamalı");
const jblKillifishPackage = jblCareProducts.filter((item) => item.model === "PRONOVO KILLIFISH GRANO S 100 ml");
assert.equal(jblKillifishPackage.length, 1, "JBL KILLIFISH 100 ml gerçek ambalajıyla korunmalı");
assert(jblKillifishPackage[0].sourceUrl.includes("/detail/") && jblKillifishPackage[0].verifiedAt === "2026-09-18", "JBL KILLIFISH doğrudan resmî ürün sayfasına bağlı olmalı");
assert(jblKillifishPackage[0].description.includes("3–10 cm") && jblKillifishPackage[0].description.includes("48 g") && jblKillifishPackage[0].description.includes("Hermetia böcek proteini %5") && jblKillifishPackage[0].description.includes("3134218"), "JBL KILLIFISH hedef boyu, ağırlığı, Hermetia oranı ve ürün kodu korunmalı");
const jblDragonPackages = jblCareProducts.filter((item) => item.model.startsWith("PRONOVO DRAGON STICK L "));
assert.equal(jblDragonPackages.length, 2, "JBL DRAGON 1000 ml ve 5,5 L gerçek ambalajlarıyla korunmalı");
assert(jblDragonPackages.every((item) => item.sourceUrl.includes("/detail/") && item.verifiedAt === "2026-09-18"), "JBL DRAGON doğrudan resmî ürün sayfasına bağlı olmalı");
assert(careProductCatalog.find((item) => item.model === "PRONOVO DRAGON STICK L 1000 ml")?.description.includes("3134773") && careProductCatalog.find((item) => item.model === "PRONOVO DRAGON STICK L 5,5 L")?.description.includes("2000 g") && careProductCatalog.find((item) => item.model === "PRONOVO DRAGON STICK L 5,5 L")?.description.includes("40–100 cm") && careProductCatalog.find((item) => item.model === "PRONOVO DRAGON STICK L 5,5 L")?.description.includes("somon unu %34"), "JBL DRAGON ürün kodu, büyük paket ağırlığı, hedef boyu ve somon oranı korunmalı");
const jblLotlPackages = jblCareProducts.filter((item) => /^PRONOVO LOTL GRANO (S|M|XL) /.test(item.model));
assert.equal(jblLotlPackages.length, 3, "JBL LOTL S, M ve XL gerçek ambalajlarıyla korunmalı");
assert(jblLotlPackages.every((item) => item.sourceUrl.includes("/detail/") && item.verifiedAt === "2026-09-18"), "JBL LOTL yemleri doğrudan resmî ürün sayfalarına bağlı olmalı");
assert(careProductCatalog.find((item) => item.model === "PRONOVO LOTL GRANO S 100 ml")?.description.includes("3–10 cm") && careProductCatalog.find((item) => item.model === "PRONOVO LOTL GRANO S 100 ml")?.description.includes("3135200"), "JBL LOTL S hedef boyu ve ürün kodu korunmalı");
assert(careProductCatalog.find((item) => item.model === "PRONOVO LOTL GRANO M 250 ml")?.description.includes("8–20 cm") && careProductCatalog.find((item) => item.model === "PRONOVO LOTL GRANO M 250 ml")?.description.includes("150 g"), "JBL LOTL M hedef boyu ve yayımlanan ağırlığı korunmalı");
assert(careProductCatalog.find((item) => item.model === "PRONOVO LOTL GRANO XL 250 ml")?.description.includes("15–25 cm") && jblLotlPackages.every((item) => item.description.includes("alabalık unu %40") && item.description.includes("Gammarus %10") && item.description.includes("karides unu %10")), "JBL LOTL XL hedef boyu ve üç boyun yayımlanan ana içerik oranları korunmalı");
const jblInvertebratePackages = jblCareProducts.filter((item) => /^(PRONOVO SHRIMPS GRANO S|PRONOVO CRABS WAFER M) /.test(item.model));
assert.equal(jblInvertebratePackages.length, 4, "JBL omurgasız grubunda dört gerçek ambalaj seçeneği bulunmalı");
assert(jblInvertebratePackages.every((item) => item.sourceUrl.includes("/detail/") && item.verifiedAt === "2026-09-18"), "JBL omurgasız yemleri doğrudan resmî ürün sayfalarına bağlı olmalı");
assert.equal(jblInvertebratePackages.filter((item) => item.model.startsWith("PRONOVO SHRIMPS GRANO S ")).length, 2, "JBL SHRIMPS 100 ve 250 ml seçenekleriyle korunmalı");
assert.equal(jblInvertebratePackages.filter((item) => item.model.startsWith("PRONOVO CRABS WAFER M ")).length, 2, "JBL CRABS 100 ve 250 ml seçenekleriyle korunmalı");
assert(careProductCatalog.find((item) => item.model === "PRONOVO SHRIMPS GRANO S 250 ml")?.description.includes("3156300") && jblInvertebratePackages.filter((item) => item.model.startsWith("PRONOVO SHRIMPS ")).every((item) => item.description.includes("ısırgan unu %20")), "JBL SHRIMPS büyük paket kodu ve ısırgan oranı korunmalı");
assert(careProductCatalog.find((item) => item.model === "PRONOVO CRABS WAFER M 250 ml")?.description.includes("3156700") && jblInvertebratePackages.filter((item) => item.model.startsWith("PRONOVO CRABS ")).every((item) => item.description.includes("odun lifi %4")), "JBL CRABS büyük paket kodu ve odun lifi oranı korunmalı");
const jblSpeciesFoods = jblCareProducts.filter((item) =>
  item.category === "food" && (jblSpeciesDirectFoods.some((food) => food.id === item.id) || jblCichlidFoodPackages.some((food) => food.id === item.id) || jblBettaGouramiPackages.some((food) => food.id === item.id) || jblColdwaterFoodPackages.some((food) => food.id === item.id) || jblBottomFoodPackages.some((food) => food.id === item.id) || jblKillifishPackage.some((food) => food.id === item.id) || jblDragonPackages.some((food) => food.id === item.id) || jblLotlPackages.some((food) => food.id === item.id) || jblInvertebratePackages.some((food) => food.id === item.id))
);
assert.equal(jblSpeciesFoods.length, 71, "JBL PRONOVO türe özel 11 grupta 71 güncel ürün/ambalaj bulunmalı");
assert(jblSpeciesFoods.every((item) => ["2026-09-14","2026-09-18"].includes(item.verifiedAt)), "JBL türe özel yemleri güncel doğrulama tarihi taşımalı");
const jblNaturalFoods = jblCareProducts.filter((item) => /^(PRONOVO INSECT STICK S|PRONOVO ARTEMIO|PRONOVO DAPH|PRONOVO FEX|PRONOVO FIL) /.test(item.model));
assert.equal(jblNaturalFoods.length, 10, "JBL PRONOVO doğal yem grubunda on gerçek ambalaj seçeneği bulunmalı");
assert(jblNaturalFoods.every((item) => item.sourceUrl.includes("/detail/") && item.verifiedAt === "2026-09-18"), "JBL doğal yemleri doğrudan resmî ürün sayfalarına ve güncel doğrulama tarihine bağlı olmalı");
assert.equal(jblNaturalFoods.filter((item) => item.model.startsWith("PRONOVO INSECT STICK S ")).length, 3, "JBL INSECT STICK 20, 100 ve 250 ml seçenekleriyle korunmalı");
assert.equal(jblNaturalFoods.filter((item) => item.model.startsWith("PRONOVO ARTEMIO ")).length, 2, "JBL ARTEMIO 100 ve 250 ml seçenekleriyle korunmalı");
assert.equal(jblNaturalFoods.filter((item) => item.model.startsWith("PRONOVO DAPH ")).length, 1, "JBL DAPH 100 ml gerçek ambalajıyla korunmalı");
assert.equal(jblNaturalFoods.filter((item) => item.model.startsWith("PRONOVO FEX ")).length, 2, "JBL FEX 100 ve 250 ml seçenekleriyle korunmalı");
assert.equal(jblNaturalFoods.filter((item) => item.model.startsWith("PRONOVO FIL ")).length, 2, "JBL FIL 100 ve 250 ml seçenekleriyle korunmalı");
assert(careProductCatalog.find((item) => item.model === "PRONOVO INSECT STICK S 20 ml")?.description.includes("3130018") && jblNaturalFoods.filter((item) => item.model.startsWith("PRONOVO INSECT ")).every((item) => item.description.includes("Hermetia böcek proteini %15")), "JBL INSECT küçük paket kodu ve Hermetia oranı korunmalı");
assert(careProductCatalog.find((item) => item.model === "PRONOVO ARTEMIO 250 ml")?.description.includes("18 g") && careProductCatalog.find((item) => item.model === "PRONOVO DAPH 100 ml")?.description.includes("13 g"), "JBL ARTEMIO ve DAPH yayımlanan ağırlıkları korunmalı");
assert(careProductCatalog.find((item) => item.model === "PRONOVO FEX 250 ml")?.description.includes("3157700") && careProductCatalog.find((item) => item.model === "PRONOVO FEX 250 ml")?.description.includes("22 g"), "JBL FEX büyük paket kodu ve ağırlığı korunmalı");
assert(careProductCatalog.find((item) => item.model === "PRONOVO FIL 250 ml")?.description.includes("3158100") && careProductCatalog.find((item) => item.model === "PRONOVO FIL 250 ml")?.description.includes("25 g"), "JBL FIL büyük paket kodu ve ağırlığı korunmalı");
const jblSeptemberFoods = jblCareProducts.filter((item) => ["jbl-pronovo-snail","jbl-pronovo-medaka-flakes-xs"].includes(item.id));
assert.equal(jblSeptemberFoods.length, 2, "JBL'nin Eylül 2026'da satışa çıkan iki yeni PRONOVO yemi bulunmalı");
assert(jblSeptemberFoods.every((item) => item.sourceUrl.includes("/productsv2/detail/") && item.verifiedAt === "2026-09-15"), "JBL yeni PRONOVO yemleri doğrudan güncel ürün sayfalarına bağlanmalı");
assert(careProductCatalog.find((item) => item.id === "jbl-pronovo-snail")?.description.includes("diş aşınmasına"), "JBL PRONOVO SNAIL kabuk ve diş aşınması bilgisini korumalı");
assert(careProductCatalog.find((item) => item.id === "jbl-pronovo-medaka-flakes-xs")?.description.includes("Oryzias latipes"), "JBL PRONOVO MEDAKA hedef tür kimliğini korumalı");
const jblArtemioPreparations = jblCareProducts.filter((item) => ["jbl-artemiomix-230-g","jbl-artemiofluid-50-ml","jbl-artemiosal-230-g","jbl-artemiopur-40-ml"].includes(item.id));
assert.equal(jblArtemioPreparations.length, 4, "JBL Artemio hazırlık grubunda dört ürün bulunmalı");
assert.deepEqual(jblArtemioPreparations.map((item) => item.model), ["ArtemioMix 230 g","ArtemioFluid 50 ml","ArtemioSal 230 g","ArtemioPur 40 ml"], "JBL Artemio hazırlıkları gerçek ambalajlarıyla model düzeyinde ayrılmalı");
assert(jblArtemioPreparations.every((item) => !item.sourceUrl.includes("/group/") && item.verifiedAt === "2026-09-18"), "JBL Artemio hazırlıkları doğrudan resmî ürün sayfalarına bağlı olmalı");
assert(careProductCatalog.find((item) => item.id === "jbl-artemiomix-230-g")?.description.includes("3090200") && careProductCatalog.find((item) => item.id === "jbl-artemiomix-230-g")?.description.includes("24–36 saatte"), "JBL ArtemioMix ürün kodu ve çıkım süresi korunmalı");
assert(careProductCatalog.find((item) => item.id === "jbl-artemiofluid-50-ml")?.description.includes("Üçüncü günden") && careProductCatalog.find((item) => item.id === "jbl-artemiofluid-50-ml")?.description.includes("berraklaşınca"), "JBL ArtemioFluid başlangıç günü ve güvenli tekrar dozlama kuralı korunmalı");
assert(careProductCatalog.find((item) => item.id === "jbl-artemiosal-230-g")?.description.includes("7 L") && careProductCatalog.find((item) => item.id === "jbl-artemiosal-230-g")?.description.includes("sofra tuzu kullanılmamalıdır"), "JBL ArtemioSal kapasitesi ve sofra tuzu uyarısı korunmalı");
assert(careProductCatalog.find((item) => item.id === "jbl-artemiopur-40-ml")?.description.includes("20 g") && careProductCatalog.find((item) => item.id === "jbl-artemiopur-40-ml")?.description.includes("açıldıktan sonra 4 ay"), "JBL ArtemioPur ağırlığı ve açılış sonrası saklama süresi korunmalı");
const jblPlanktonPur = jblCareProducts.filter((item) => item.model.startsWith("PlanktonPur "));
assert.equal(jblPlanktonPur.length, 4, "JBL PlanktonPur SMALL ve MEDIUM ailelerinin 2 ve 5 g stick seçenekleri bulunmalı");
assert(jblPlanktonPur.every((item) => item.sourceUrl.includes("/detail/") && item.verifiedAt === "2026-09-18" && item.description.includes("Arşiv ürün")), "JBL PlanktonPur doğrudan resmî ürün sayfalarına bağlanmalı ve arşiv durumu saklanmamalı");
assert.deepEqual(jblPlanktonPur.map((item) => item.model), ["PlanktonPur SMALL 2","PlanktonPur SMALL 5","PlanktonPur MEDIUM 2","PlanktonPur MEDIUM 5"], "JBL PlanktonPur gerçek stick seçenekleriyle ayrılmalı");
assert(careProductCatalog.find((item) => item.model === "PlanktonPur SMALL 2")?.description.includes("3003100") && careProductCatalog.find((item) => item.model === "PlanktonPur SMALL 5")?.description.includes("8 × 5 g"), "JBL PlanktonPur SMALL ürün kodu ve büyük stick paketi korunmalı");
assert(careProductCatalog.find((item) => item.model === "PlanktonPur MEDIUM 2")?.description.includes("200 L") && careProductCatalog.find((item) => item.model === "PlanktonPur MEDIUM 5")?.description.includes("%95 Calanus finmarchicus"), "JBL PlanktonPur MEDIUM 2 g kapasitesi ve plankton bileşimi korunmalı");
assert(jblPlanktonPur.filter((item) => item.model.startsWith("PlanktonPur SMALL")).every((item) => item.description.includes("en fazla 24 saat")), "JBL PlanktonPur açılmış stick saklama sınırı korunmalı");
const jblLegacyPremiumTabis = jblCareProducts.filter((item) => item.model.startsWith("Tabis ") && item.sourceUrl.includes("/detail/2314/"));
assert.equal(jblLegacyPremiumTabis.length, 2, "JBL eski Premium Tabis ailesi iki gerçek ambalaj seçeneği içermeli");
assert.deepEqual(jblLegacyPremiumTabis.map((item) => item.model), ["Tabis 100 ml","Tabis 250 ml"], "JBL Tabis gerçek 100 ve 250 ml ambalajlarıyla ayrılmalı");
assert(jblLegacyPremiumTabis.every((item) => item.verifiedAt === "2026-09-18" && item.description.includes("Arşiv Premium yem") && item.description.includes("%10 derin deniz krili") && item.description.includes("%6 Spirulina") && item.description.includes("bağlayıcı içermez")), "JBL Tabis arşiv durumu, bileşimi ve bağlayıcı güvenlik bilgisi korunmalı");
assert(careProductCatalog.find((item) => item.model === "Tabis 100 ml")?.description.includes("58 g") && careProductCatalog.find((item) => item.model === "Tabis 100 ml")?.description.includes("4060000"), "JBL Tabis 100 ml ağırlığı ve ürün kodu korunmalı");
assert(careProductCatalog.find((item) => item.model === "Tabis 250 ml")?.description.includes("160 g") && careProductCatalog.find((item) => item.model === "Tabis 250 ml")?.description.includes("40620"), "JBL Tabis 250 ml ağırlığı ve eski katalog kodu korunmalı");
const jblLegacyPremiumGeneral = jblCareProducts.filter((item) => ["Gala ","Grana CLICK ","Grana 250 ml REFILL","Krill "].some((prefix) => item.model.startsWith(prefix)));
assert.equal(jblLegacyPremiumGeneral.length, 9, "JBL eski Premium genel yem ailesi dokuz gerçek ambalaj seçeneği içermeli");
assert(jblLegacyPremiumGeneral.every((item) => item.sourceUrl.includes("/detail/") && item.verifiedAt === "2026-09-18" && item.description.includes("Arşiv ürün")), "JBL Premium genel yemleri doğrudan resmî ürün sayfasına bağlı arşiv kayıtları olmalı");
assert.deepEqual(jblLegacyPremiumGeneral.map((item) => item.model), ["Gala 100 ml","Gala 250 ml","Gala 1000 ml","Gala 5500 ml","Grana CLICK 100 ml","Grana CLICK 250 ml","Grana 250 ml REFILL","Krill 100 ml","Krill 250 ml"], "JBL Premium genel yemlerinin gerçek ambalajları korunmalı");
assert(careProductCatalog.find((item) => item.model === "Gala 5500 ml")?.description.includes("950 g") && careProductCatalog.find((item) => item.model === "Gala 100 ml")?.description.includes("%2 sarımsak"), "JBL Gala büyük paket ağırlığı ve sarımsak oranı korunmalı");
assert(careProductCatalog.find((item) => item.model === "Grana CLICK 100 ml")?.description.includes("4064600") && careProductCatalog.find((item) => item.model === "Grana CLICK 250 ml")?.description.includes("bir basış yaklaşık 5 balık"), "JBL Grana CLICK kodu ve dozaj kapağı bilgisi korunmalı");
assert(careProductCatalog.find((item) => item.model === "Grana 250 ml REFILL")?.description.includes("4051200") && careProductCatalog.find((item) => item.model === "Grana 250 ml REFILL")?.description.includes("108 g"), "JBL Grana refill ürün kodu ve ağırlığı korunmalı");
assert(careProductCatalog.find((item) => item.model === "Krill 100 ml")?.description.includes("4058100") && careProductCatalog.find((item) => item.model === "Krill 250 ml")?.description.includes("4058200"), "JBL Krill ambalaj kodları korunmalı");
const jblLegacyPremiumCichlid = jblCareProducts.filter((item) => ["GranaDiscus ","GranaCichlid "].some((prefix) => item.model.startsWith(prefix)));
assert.equal(jblLegacyPremiumCichlid.length, 6, "JBL eski Premium discus ve ciklet ailesi altı gerçek ambalaj seçeneği içermeli");
assert(jblLegacyPremiumCichlid.every((item) => item.sourceUrl.includes("/detail/") && item.verifiedAt === "2026-09-18" && item.description.includes("Arşiv ürün")), "JBL Premium discus ve ciklet yemleri doğrudan resmî ürün sayfasına bağlı arşiv kayıtları olmalı");
assert.deepEqual(jblLegacyPremiumCichlid.map((item) => item.model), ["GranaDiscus CLICK 250 ml","GranaDiscus 250 ml REFILL","GranaDiscus 1000 ml","GranaCichlid CLICK 100 ml","GranaCichlid CLICK 250 ml","GranaCichlid 250 ml REFILL"], "JBL Premium discus ve ciklet yemlerinin gerçek ambalajları korunmalı");
assert(careProductCatalog.find((item) => item.model === "GranaDiscus 1000 ml")?.description.includes("440 g") && careProductCatalog.find((item) => item.model === "GranaDiscus CLICK 250 ml")?.description.includes("4065100"), "JBL GranaDiscus büyük paket ağırlığı ve Click ürün kodu korunmalı");
assert(careProductCatalog.find((item) => item.model === "GranaCichlid CLICK 100 ml")?.description.includes("44 g") && careProductCatalog.find((item) => item.model === "GranaCichlid 250 ml REFILL")?.description.includes("105 g"), "JBL GranaCichlid küçük Click ve refill ağırlıkları korunmalı");
const jblLegacyPremiumSpirulina = jblCareProducts.filter((item) => item.model.startsWith("Spirulina ") && item.sourceUrl.includes("/detail/3331/"));
assert.equal(jblLegacyPremiumSpirulina.length, 4, "JBL eski Premium Spirulina ailesi dört gerçek ambalaj seçeneği içermeli");
assert.deepEqual(jblLegacyPremiumSpirulina.map((item) => item.model), ["Spirulina 100 ml","Spirulina 250 ml","Spirulina 1000 ml","Spirulina 5500 ml"], "JBL Premium Spirulina gerçek hacimleri korunmalı");
assert(jblLegacyPremiumSpirulina.every((item) => item.verifiedAt === "2026-09-18" && item.description.includes("%40 Spirulina") && item.description.includes("%6 bütün karides") && item.description.includes("%1 sarımsak")), "JBL Premium Spirulina bileşim oranları ve doğrulama tarihi korunmalı");
assert(careProductCatalog.find((item) => item.model === "Spirulina 5500 ml")?.description.includes("950 g") && careProductCatalog.find((item) => item.model === "Spirulina 250 ml")?.description.includes("arşiv etiketi taşımamaktadır"), "JBL Spirulina büyük paket ağırlığı ve 250 ml arşiv istisnası korunmalı");
const jblLegacyPremiumGoldPearls = jblCareProducts.filter((item) => item.model.startsWith("GoldPearls ") && item.sourceUrl.includes("/detail/"));
assert.equal(jblLegacyPremiumGoldPearls.length, 7, "JBL eski Premium GoldPearls ailesi yedi doğrudan doğrulanmış ambalaj seçeneği içermeli");
assert(jblLegacyPremiumGoldPearls.every((item) => item.verifiedAt === "2026-09-18" && item.description.includes("batan")), "JBL GoldPearls kayıtları güncel doğrulama tarihini ve batan yem davranışını taşımalı");
assert.deepEqual(jblLegacyPremiumGoldPearls.map((item) => item.model), ["GoldPearls CLICK 100 ml","GoldPearls CLICK 250 ml","GoldPearls 100 ml","GoldPearls 250 ml","GoldPearls 1000 ml","GoldPearls mini CLICK 100 ml","GoldPearls mini 100 ml REFILL"], "JBL GoldPearls gerçek ambalajları korunmalı");
assert(careProductCatalog.find((item) => item.model === "GoldPearls 1000 ml")?.description.includes("580 g") && careProductCatalog.find((item) => item.model === "GoldPearls mini CLICK 100 ml")?.description.includes("1–2 mm"), "JBL GoldPearls büyük paket ağırlığı ve mini granül boyu korunmalı");
const jblLegacyNovoFlakes = jblCareProducts.filter((item) => ["/detail/2103/","/detail/2217/","/detail/3518/","/detail/2218/","/detail/2219/"].some((path) => item.sourceUrl.includes(path)));
assert.equal(jblLegacyNovoFlakes.length, 11, "JBL eski Novo pul yem ailesi on bir gerçek ambalaj seçeneği içermeli");
assert(jblLegacyNovoFlakes.every((item) => item.verifiedAt === "2026-09-18" && item.description.includes("Arşiv Novo")), "JBL eski Novo pul yemleri doğrudan ürün sayfasına bağlı arşiv kayıtları olmalı");
assert.deepEqual(jblLegacyNovoFlakes.map((item) => item.model), ["NovoBel 100 ml","NovoBel 250 ml","NovoBel 1000 ml","NovoBel 5500 ml","NovoBel 10,5 L","NovoBel Refill 750 ml","NanoBel 60 ml","NovoGrand 1000 ml","NovoGrand 12,5 L","NovoColor 100 ml","NovoColor 250 ml"], "JBL Novo pul yemlerinin gerçek ambalajları korunmalı");
assert(careProductCatalog.find((item) => item.model === "NovoBel 10,5 L")?.description.includes("1995 g") && careProductCatalog.find((item) => item.model === "NovoBel Refill 750 ml")?.description.includes("3014100"), "JBL NovoBel büyük paket ağırlığı ve refill ürün kodu korunmalı");
assert(careProductCatalog.find((item) => item.model === "NanoBel 60 ml")?.description.includes("15 g ve 16 g") && careProductCatalog.find((item) => item.model === "NovoGrand 12,5 L")?.description.includes("2200 g") && careProductCatalog.find((item) => item.model === "NovoGrand 12,5 L")?.description.includes("2100 g"), "JBL NanoBel ve NovoGrand resmî ağırlık çelişkileri kullanıcıdan saklanmamalı");
assert(careProductCatalog.find((item) => item.model === "NovoColor 250 ml")?.description.includes("3015700") && careProductCatalog.find((item) => item.model === "NovoColor 250 ml")?.description.includes("ham protein %43"), "JBL NovoColor ürün kodu ve besin değeri korunmalı");
const jblLegacyNovoGranules = jblCareProducts.filter((item) => ["/detail/9122/","/detail/9124/","/detail/2220/","/detail/2221/","/detail/3520/","/detail/2222/","/detail/2223/","/detail/2224/","/detail/2225/","/detail/2226/","/detail/2227/","/detail/2228/","/detail/4340/"].some((path) => item.sourceUrl.includes(path)));
assert.equal(jblLegacyNovoGranules.length, 17, "JBL eski Novo granül ailesi on yedi gerçek ambalaj seçeneği içermeli");
assert(jblLegacyNovoGranules.every((item) => item.verifiedAt === "2026-09-18" && item.description.includes("Arşiv Novo")), "JBL eski Novo granülleri doğrudan ürün sayfasına bağlı arşiv kayıtları olmalı");
assert.deepEqual(jblLegacyNovoGranules.map((item) => item.model), ["NovoGranoMix XXS 100 ml","NovoGranoMix XS 100 ml","NovoGranoMix mini CLICK 100 ml","NovoGranoMix mini 100 ml REFILL","NovoGranoMix mini 5500 ml","NanoMix 60 ml","NovoGranoColor mini CLICK 100 ml","NovoGranoColor mini 100 ml REFILL","NovoGranoMix CLICK 250 ml","NovoGranoMix 250 ml REFILL","NovoGranoColor CLICK 250 ml","NovoGranoColor 250 ml REFILL","NovoBits CLICK 250 ml","NovoBits 250 ml REFILL","NovoBits 1000 ml","NovoBits 12,5 L","NovoBits 10,5 L"], "JBL Novo granüllerinin gerçek ambalajları korunmalı");
assert(careProductCatalog.find((item) => item.model === "NovoGranoMix XXS 100 ml")?.description.includes("3136000") && careProductCatalog.find((item) => item.model === "NovoGranoMix XS 100 ml")?.description.includes("3136300"), "JBL NovoGranoMix XXS ve XS ürün kodları korunmalı");
assert(careProductCatalog.find((item) => item.model === "NovoGranoMix mini 5500 ml")?.description.includes("2400 g") && careProductCatalog.find((item) => item.model === "NanoMix 60 ml")?.description.includes("23174"), "JBL NovoGranoMix mini büyük paket ağırlığı ve NanoMix ürün kodu korunmalı");
assert(careProductCatalog.find((item) => item.model === "NovoGranoColor CLICK 250 ml")?.description.includes("107 g") && careProductCatalog.find((item) => item.model === "NovoGranoColor CLICK 250 ml")?.description.includes("118 g"), "JBL NovoGranoColor CLICK resmî ağırlık çelişkisi kullanıcıdan saklanmamalı");
assert(careProductCatalog.find((item) => item.model === "NovoGranoColor 250 ml REFILL")?.description.includes("120 g") && careProductCatalog.find((item) => item.model === "NovoGranoColor 250 ml REFILL")?.description.includes("118 g"), "JBL NovoGranoColor refill resmî ağırlık çelişkisi kullanıcıdan saklanmamalı");
assert(careProductCatalog.find((item) => item.model === "NovoBits 12,5 L")?.description.includes("5500 g") && careProductCatalog.find((item) => item.model === "NovoBits 10,5 L")?.description.includes("4620 g"), "JBL NovoBits eski ve yeni büyük ambalajları birbirine karıştırılmamalı");
const jblLegacyNovoFreezeDried = jblCareProducts.filter((item) => ["/detail/2229/","/detail/2230/","/detail/2231/","/detail/5983/"].some((path) => item.sourceUrl.includes(path)));
assert.equal(jblLegacyNovoFreezeDried.length, 7, "JBL eski Novo dondurularak kurutulmuş yem ailesi yedi gerçek ambalaj seçeneği içermeli");
assert(jblLegacyNovoFreezeDried.every((item) => item.verifiedAt === "2026-09-19" && item.description.includes("Arşiv Novo doğal yemi")), "JBL eski Novo doğal yemleri doğrudan ürün sayfasına bağlı arşiv kayıtları olmalı");
assert.deepEqual(jblLegacyNovoFreezeDried.map((item) => item.model), ["NovoFil 100 ml","NovoFil 250 ml","NovoFex 100 ml","NovoFex 250 ml","NovoDaph 100 ml","NovoArtemio 100 ml","NovoArtemio 250 ml"], "JBL eski Novo doğal yemlerinin gerçek ambalajları korunmalı");
assert(careProductCatalog.find((item) => item.model === "NovoFil 250 ml")?.description.includes("3027000") && careProductCatalog.find((item) => item.model === "NovoFex 250 ml")?.description.includes("3063000"), "JBL NovoFil ve NovoFex büyük paket ürün kodları korunmalı");
assert(careProductCatalog.find((item) => item.model === "NovoDaph 100 ml")?.description.includes("9 g") && careProductCatalog.find((item) => item.model === "NovoArtemio 250 ml")?.description.includes("3026400"), "JBL NovoDaph ağırlığı ve NovoArtemio büyük paket kodu korunmalı");
const jblLegacyNovoTablets = jblCareProducts.filter((item) => ["/detail/2301/","/detail/2303/","/detail/3511/","/detail/2302/","/detail/3294/"].some((path) => item.sourceUrl.includes(path)));
assert.equal(jblLegacyNovoTablets.length, 16, "JBL eski Novo tablet ailesi on altı gerçek ambalaj seçeneği içermeli");
assert(jblLegacyNovoTablets.every((item) => item.verifiedAt === "2026-09-19" && item.description.includes("Arşiv Novo")), "JBL eski Novo tabletleri doğrudan ürün sayfasına bağlı arşiv kayıtları olmalı");
assert.deepEqual(jblLegacyNovoTablets.map((item) => item.model), ["NovoTab 100 ml","NovoTab 250 ml","NovoTab 1000 ml","NovoTab 10,5 L","NovoPleco 100 ml","NovoPleco 250 ml","NovoPleco 1000 ml","NovoPleco 5500 ml","NanoTabs 60 ml","NovoFect 100 ml","NovoFect 250 ml","NovoFect 1000 ml","NovoFect 10,5 L","NovoPleco XL 250 ml","NovoPleco XL 1000 ml","NovoPleco XL 5500 ml"], "JBL eski Novo tabletlerinin gerçek ambalajları korunmalı");
assert(careProductCatalog.find((item) => item.model === "NovoTab 10,5 L")?.description.includes("5880 g") && careProductCatalog.find((item) => item.model === "NovoPleco 5500 ml")?.description.includes("3030900"), "JBL NovoTab büyük paket ağırlığı ve NovoPleco büyük paket kodu korunmalı");
assert(careProductCatalog.find((item) => item.model === "NanoTabs 60 ml")?.description.includes("2317700") && careProductCatalog.find((item) => item.model === "NanoTabs 60 ml")?.description.includes("20–30 karidese bir tablet"), "JBL NanoTabs ürün kodu ve resmî doz bilgisi korunmalı");
assert(careProductCatalog.find((item) => item.model === "NovoPleco XL 250 ml")?.description.includes("3034100") && careProductCatalog.find((item) => item.model === "NovoPleco XL 5500 ml")?.description.includes("2750 g"), "JBL NovoPleco XL kodu ve büyük paket ağırlığı korunmalı");
const jblLegacyNovoHerbivore = jblCareProducts.filter((item) => ["/qr/30096","/detail/3613/","/detail/2232/","/detail/2917/"].some((path) => item.sourceUrl.includes(path)));
assert.equal(jblLegacyNovoHerbivore.length, 6, "JBL eski Novo otçul yem ailesi altı gerçek ambalaj seçeneği içermeli");
assert(jblLegacyNovoHerbivore.every((item) => item.verifiedAt === "2026-09-19" && item.description.includes("Arşiv Novo")), "JBL eski Novo otçul yemleri resmî ürün sayfasına bağlı arşiv kayıtları olmalı");
assert.deepEqual(jblLegacyNovoHerbivore.map((item) => item.model), ["NovoGranoVert mini CLICK 100 ml","NovoGranoVert mini 100 ml REFILL","NovoVert 100 ml","NovoVert 250 ml","NovoGuppy 100 ml","NovoGuppy 250 ml"], "JBL eski Novo otçul yemlerinin gerçek ambalajları korunmalı");
assert(careProductCatalog.find((item) => item.model === "NovoGranoVert mini CLICK 100 ml")?.description.includes("30096") && careProductCatalog.find((item) => item.model === "NovoGranoVert mini 100 ml REFILL")?.description.includes("3009500"), "JBL NovoGranoVert CLICK ve refill kodları korunmalı");
assert(careProductCatalog.find((item) => item.model === "NovoVert 250 ml")?.description.includes("3019580") && careProductCatalog.find((item) => item.model === "NovoGuppy 250 ml")?.description.includes("3017600"), "JBL NovoVert ve NovoGuppy büyük ambalaj kodları korunmalı");
const jblLegacyBreedingModels = new Set(["NovoBea 100 ml","NovoBea 12,5 L","NovoTom Artemia 100 ml","NovoBaby 3 × 10 ml","NobilFluid Artemia 50 ml"]);
const jblLegacyBreeding = jblCareProducts.filter((item) => jblLegacyBreedingModels.has(item.model));
assert.equal(jblLegacyBreeding.length, 5, "JBL eski Novo yavru ve büyütme ailesi beş gerçek ambalaj seçeneği içermeli");
assert(jblLegacyBreeding.every((item) => item.verifiedAt === "2026-09-19" && item.description.includes("Arşiv Novo")), "JBL eski Novo yavru yemleri doğrudan ürün sayfası veya resmî kataloğa bağlı arşiv kayıtları olmalı");
assert.deepEqual(jblLegacyBreeding.map((item) => item.model), ["NovoBea 100 ml","NovoBea 12,5 L","NovoTom Artemia 100 ml","NovoBaby 3 × 10 ml","NobilFluid Artemia 50 ml"], "JBL eski Novo yavru yemlerinin gerçek ambalajları korunmalı");
assert(careProductCatalog.find((item) => item.model === "NovoBea 100 ml")?.description.includes("3016000") && careProductCatalog.find((item) => item.model === "NovoBea 12,5 L")?.description.includes("4000 g"), "JBL NovoBea küçük paket kodu ve büyük paket ağırlığı korunmalı");
assert(careProductCatalog.find((item) => item.model === "NovoTom Artemia 100 ml")?.description.includes("3025300") && careProductCatalog.find((item) => item.model === "NovoTom Artemia 100 ml")?.description.includes("ham protein %43"), "JBL NovoTom Artemia ürün kodu ve besin değeri korunmalı");
assert(careProductCatalog.find((item) => item.model === "NovoBaby 3 × 10 ml")?.description.includes("3025400") && careProductCatalog.find((item) => item.model === "NovoBaby 3 × 10 ml")?.description.includes("günde 3–4 kez"), "JBL NovoBaby ürün kodu ve besleme dozu korunmalı");
assert(careProductCatalog.find((item) => item.model === "NobilFluid Artemia 50 ml")?.description.includes("3088100") && careProductCatalog.find((item) => item.model === "NobilFluid Artemia 50 ml")?.description.includes("10–15 damla") && careProductCatalog.find((item) => item.model === "NobilFluid Artemia 50 ml")?.description.includes("kuru madde %12,5"), "JBL NobilFluid ürün kodu, doz ve analiz bilgisi korunmalı");
const jblLegacyNovoColdWater = jblCareProducts.filter((item) => ["/detail/2292/","/detail/4406/","/detail/4498/"].some((path) => item.sourceUrl.includes(path)));
assert.equal(jblLegacyNovoColdWater.length, 7, "JBL eski Novo soğuk su ve Japon balığı ailesi yedi gerçek ambalaj seçeneği içermeli");
assert(jblLegacyNovoColdWater.every((item) => item.verifiedAt === "2026-09-19" && item.description.includes("Arşiv Novo")), "JBL eski Novo soğuk su yemleri doğrudan ürün sayfasına bağlı arşiv kayıtları olmalı");
assert.deepEqual(jblLegacyNovoColdWater.map((item) => item.model), ["NovoRed 100 ml","NovoRed 250 ml","NovoRed 1000 ml","NovoRed Refill 750 ml","NovoPearl CLICK 100 ml","NovoPearl 100 ml REFILL","NovoPearl 250 ml"], "JBL eski Novo soğuk su yemlerinin gerçek ambalajları korunmalı");
assert(careProductCatalog.find((item) => item.model === "NovoRed 1000 ml")?.description.includes("3022000") && careProductCatalog.find((item) => item.model === "NovoRed Refill 750 ml")?.description.includes("3022180"), "JBL NovoRed kutu ve ekonomik dolum kodları korunmalı");
assert(careProductCatalog.find((item) => item.model === "NovoPearl CLICK 100 ml")?.description.includes("bir basış beş balık") && careProductCatalog.find((item) => item.model === "NovoPearl 250 ml")?.description.includes("3030000"), "JBL NovoPearl Click dozu ve büyük kutu kodu korunmalı");
const jblLegacyNovoCrustacea = jblCareProducts.filter((item) => ["/detail/2781/","/detail/3514/","/detail/4499/","/detail/2783/","/detail/3516/"].some((path) => item.sourceUrl.includes(path)));
assert.equal(jblLegacyNovoCrustacea.length, 7, "JBL eski Novo kabuklu ve karides yem ailesi yedi gerçek ambalaj seçeneği içermeli");
assert(jblLegacyNovoCrustacea.every((item) => item.verifiedAt === "2026-09-19" && item.description.includes("Arşiv Novo")), "JBL eski Novo kabuklu yemleri doğrudan ürün sayfasına bağlı arşiv kayıtları olmalı");
assert.deepEqual(jblLegacyNovoCrustacea.map((item) => item.model), ["NovoCrabs 100 ml","NovoCrabs 250 ml","NanoCrabs 60 ml","NovoPrawn CLICK 100 ml","NovoPrawn 100 ml REFILL","NovoPrawn 250 ml","NanoPrawn 60 ml"], "JBL eski Novo kabuklu yemlerinin gerçek ambalajları korunmalı");
assert(careProductCatalog.find((item) => item.model === "NovoCrabs 250 ml")?.description.includes("3027200") && careProductCatalog.find((item) => item.model === "NanoCrabs 60 ml")?.description.includes("2318000"), "JBL NovoCrabs ve NanoCrabs ürün kodları korunmalı");
assert(careProductCatalog.find((item) => item.model === "NovoPrawn CLICK 100 ml")?.description.includes("hayvan başına boyuna göre 1–2 granül") && careProductCatalog.find((item) => item.model === "NovoPrawn 250 ml")?.description.includes("145 g"), "JBL NovoPrawn dozu ve büyük paket ağırlığı korunmalı");
const jblLegacyNovoSpecialModels = new Set(["NovoDragon Shrimp 1000 ml","NovoBetta 100 ml","NanoGranoBetta 60 ml","NanoBetta 60 ml","NovoLotl 250 ml","NovoLotl M 250 ml","NovoLotl XL 250 ml"]);
const jblLegacyNovoSpecial = jblCareProducts.filter((item) => jblLegacyNovoSpecialModels.has(item.model));
assert.equal(jblLegacyNovoSpecial.length, 7, "JBL eski Novo özel yem ailesi yedi gerçek ambalaj seçeneği içermeli");
assert(jblLegacyNovoSpecial.every((item) => item.verifiedAt === "2026-09-19" && item.description.includes("Arşiv Novo")), "JBL eski Novo özel yemleri doğrudan ürün sayfası veya resmî kataloğa bağlı arşiv kayıtları olmalı");
assert.deepEqual(jblLegacyNovoSpecial.map((item) => item.model), ["NovoDragon Shrimp 1000 ml","NovoBetta 100 ml","NanoGranoBetta 60 ml","NanoBetta 60 ml","NovoLotl 250 ml","NovoLotl M 250 ml","NovoLotl XL 250 ml"], "JBL eski Novo özel yemlerinin gerçek ambalajları korunmalı");
assert(careProductCatalog.find((item) => item.model === "NovoDragon Shrimp 1000 ml")?.description.includes("3028340") && careProductCatalog.find((item) => item.model === "NovoDragon Shrimp 1000 ml")?.description.includes("440 g"), "JBL NovoDragon Shrimp ürün kodu ve eski katalog ağırlığı korunmalı");
assert(careProductCatalog.find((item) => item.model === "NovoBetta 100 ml")?.description.includes("20 g") && careProductCatalog.find((item) => item.model === "NovoBetta 100 ml")?.description.includes("25 g"), "JBL NovoBetta resmî nesil ağırlığı farkı kullanıcıdan saklanmamalı");
assert(careProductCatalog.find((item) => item.model === "NanoGranoBetta 60 ml")?.description.includes("2318800") && careProductCatalog.find((item) => item.model === "NanoGranoBetta 60 ml")?.description.includes("ham protein %40"), "JBL NanoGranoBetta ürün kodu ve besin değeri korunmalı");
assert(careProductCatalog.find((item) => item.model === "NanoBetta 60 ml")?.description.includes("12 g ve 15 g") && careProductCatalog.find((item) => item.model === "NanoBetta 60 ml")?.description.includes("2317300"), "JBL NanoBetta resmî ağırlık çelişkisi ve ürün kodu korunmalı");
assert(careProductCatalog.find((item) => item.model === "NovoLotl 250 ml")?.description.includes("3035300") && careProductCatalog.find((item) => item.model === "NovoLotl M 250 ml")?.description.includes("3035480"), "JBL NovoLotl eski ve M nesilleri birbirine karıştırılmamalı");
assert(careProductCatalog.find((item) => item.model === "NovoLotl XL 250 ml")?.description.includes("3035900") && careProductCatalog.find((item) => item.model === "NovoLotl XL 250 ml")?.description.includes("3035800"), "JBL NovoLotl XL ürün kodu nesilleri kullanıcıdan saklanmamalı");
const jblLegacyHolidayModels = new Set(["Holiday 1 blok / 43 g","Holiday Red 3 blok / 17 g","Weekend 4 blok / 20 g"]);
const jblLegacyHoliday = jblCareProducts.filter((item) => jblLegacyHolidayModels.has(item.model));
assert.equal(jblLegacyHoliday.length, 3, "JBL eski Novo tatil ve hafta sonu ailesi üç gerçek paket içermeli");
assert(jblLegacyHoliday.every((item) => item.sourceUrl.includes("/download/11627/") && item.verifiedAt === "2026-09-19"), "JBL eski Novo tatil yemleri resmî katalog kaynağı ve güncel doğrulama tarihi taşımalı");
assert.deepEqual(jblLegacyHoliday.map((item) => item.model), ["Holiday 1 blok / 43 g","Holiday Red 3 blok / 17 g","Weekend 4 blok / 20 g"], "JBL eski Novo tatil yemlerinin gerçek paketleri korunmalı");
assert(careProductCatalog.find((item) => item.model === "Holiday 1 blok / 43 g")?.description.includes("4031000") && careProductCatalog.find((item) => item.model === "Holiday 1 blok / 43 g")?.description.includes("iki haftalık"), "JBL Holiday ürün kodu ve besleme süresi korunmalı");
assert(careProductCatalog.find((item) => item.model === "Holiday Red 3 blok / 17 g")?.description.includes("4032100") && careProductCatalog.find((item) => item.model === "Holiday Red 3 blok / 17 g")?.description.includes("1–3 Japon balığını 4–6 gün"), "JBL Holiday Red ürün kodu ve blok kapasitesi korunmalı");
assert(careProductCatalog.find((item) => item.model === "Weekend 4 blok / 20 g")?.description.includes("4032000") && careProductCatalog.find((item) => item.model === "Weekend 4 blok / 20 g")?.description.includes("üçer günlük dört"), "JBL Weekend ürün kodu ve paket içeriği korunmalı");
const jblLegacyNovoCichlids = jblCareProducts.filter((item) => ["/detail/2288/","/detail/2774/","/detail/3286/","/detail/3290/","/detail/2289/","/detail/2290/","/detail/2291/"].some((path) => item.sourceUrl.includes(path)));
assert.equal(jblLegacyNovoCichlids.length, 16, "JBL eski Novo ciklet yem ailesi on altı gerçek ambalaj seçeneği içermeli");
assert(jblLegacyNovoCichlids.every((item) => item.verifiedAt === "2026-09-19" && item.description.includes("Arşiv Novo")), "JBL eski Novo ciklet yemleri doğrudan ürün sayfasına bağlı arşiv kayıtları olmalı");
assert.deepEqual(jblLegacyNovoCichlids.map((item) => item.model), ["NovoStick M 250 ml","NovoStick M 1000 ml","NovoStick M 5500 ml","NovoStick XL 1000 ml","NovoStick XL 5500 ml","NovoTanganjika 250 ml","NovoTanganjika 1000 ml","NovoTanganjika 5500 ml","NovoMalawi 250 ml","NovoMalawi 1000 ml","NovoMalawi 5500 ml","NovoRift 250 ml","NovoRift 1000 ml","NovoRift 5500 ml","NovoFlower mini 250 ml","NovoFlower maxi 1000 ml"], "JBL eski Novo ciklet yemlerinin gerçek ambalajları korunmalı");
assert(careProductCatalog.find((item) => item.model === "NovoStick M 5500 ml")?.description.includes("2530 g") && careProductCatalog.find((item) => item.model === "NovoStick XL 5500 ml")?.description.includes("2200 g"), "JBL NovoStick M ve XL büyük paket ağırlıkları korunmalı");
assert(careProductCatalog.find((item) => item.model === "NovoTanganjika 1000 ml")?.description.includes("3002100") && careProductCatalog.find((item) => item.model === "NovoMalawi 1000 ml")?.description.includes("3001100"), "JBL NovoTanganjika ve NovoMalawi ürün kodları korunmalı");
assert(careProductCatalog.find((item) => item.model === "NovoRift 5500 ml")?.description.includes("2750 g") && careProductCatalog.find((item) => item.model === "NovoFlower mini 250 ml")?.description.includes("ham protein %46"), "JBL NovoRift büyük paket ağırlığı ve NovoFlower mini besin değeri korunmalı");
const jblLegacyNovoAll = [...jblLegacyNovoFlakes,...jblLegacyNovoGranules,...jblLegacyNovoFreezeDried,...jblLegacyNovoTablets,...jblLegacyNovoHerbivore,...jblLegacyNovoCichlids,...jblLegacyNovoColdWater,...jblLegacyNovoCrustacea,...jblLegacyNovoSpecial,...jblLegacyHoliday,...jblLegacyBreeding];
assert.equal(jblLegacyNovoAll.length, 102, "JBL resmî Novo ürün ağacı gerçek pul, granül, doğal yem, tablet, otçul, ciklet, soğuk su, kabuklu, özel ve yavru yem ambalajlarıyla 102 seçenek içermeli");
assert.equal(new Set(jblLegacyNovoAll.map((item) => item.id)).size, 102, "JBL sitemapte yinelenen NovoLotl XL tek katalog kaydı olmalı");
const jblLegacyMarineFoodModels = new Set(["Maris 250 ml","MariPearls CLICK 250 ml","MariPearls 1000 ml","KorallFluid 100 ml","KorallFluid 500 ml"]);
const jblLegacyMarineFoods = jblCareProducts.filter((item) => jblLegacyMarineFoodModels.has(item.model));
assert.equal(jblLegacyMarineFoods.length, 5, "JBL eski deniz yemi ailesi beş gerçek ambalaj seçeneği içermeli");
assert(jblLegacyMarineFoods.every((item) => item.description.includes("Arşiv JBL") && item.verifiedAt === "2026-09-19" && item.sourceUrl.startsWith("https://www.jbl.de/")), "JBL eski deniz yemleri doğrudan resmî ürün sayfası veya üretici kataloğuna bağlı arşiv kayıtları olmalı");
assert.deepEqual(jblLegacyMarineFoods.map((item) => item.model), ["Maris 250 ml","MariPearls CLICK 250 ml","MariPearls 1000 ml","KorallFluid 100 ml","KorallFluid 500 ml"], "JBL eski deniz yemlerinin gerçek ambalajları korunmalı");
assert(careProductCatalog.find((item) => item.model === "Maris 250 ml")?.description.includes("3102060") && careProductCatalog.find((item) => item.model === "Maris 250 ml")?.description.includes("ham protein %43"), "JBL Maris ürün kodu ve besin değeri korunmalı");
assert(careProductCatalog.find((item) => item.model === "MariPearls CLICK 250 ml")?.description.includes("4066100") && careProductCatalog.find((item) => item.model === "MariPearls CLICK 250 ml")?.description.includes("bir Click beş balığı"), "JBL MariPearls CLICK ürün kodu ve resmî Click dozu korunmalı");
assert(careProductCatalog.find((item) => item.model === "MariPearls 1000 ml")?.description.includes("520 g") && careProductCatalog.find((item) => item.model === "MariPearls 1000 ml")?.description.includes("reçete nesilleri birleştirilmez"), "JBL MariPearls büyük ambalaj ağırlığı ve reçete nesli farkı korunmalı");
assert(careProductCatalog.find((item) => item.model === "KorallFluid 100 ml")?.description.includes("10 damla 0,125 ml") && careProductCatalog.find((item) => item.model === "KorallFluid 100 ml")?.description.includes("tek başına akvaryum dozu değildir"), "JBL KorallFluid pipet dönüşümü akvaryum dozu gibi sunulmamalı");
const jblLegacyMarineCareModels = new Set(["CalciuMarin 500 g","MagnesiuMarin 500 ml","MagnesiuMarin 5000 ml","TraceMarin 1 500 ml","TraceMarin 1 5000 ml","TraceMarin 2 500 ml","TraceMarin 2 5000 ml","TraceMarin 3 500 ml","TraceMarin 3 5000 ml"]);
const jblLegacyMarineCare = jblCareProducts.filter((item) => jblLegacyMarineCareModels.has(item.model));
assert.equal(jblLegacyMarineCare.length, 9, "JBL eski deniz bakım ailesi dokuz gerçek ambalaj seçeneği içermeli");
assert(jblLegacyMarineCare.every((item) => item.category === "water_conditioner" && item.description.includes("Arşiv JBL deniz bakım ürünü") && item.verifiedAt === "2026-09-19" && item.sourceUrl.startsWith("https://www.jbl.de/")), "JBL eski deniz bakım ürünleri doğrudan resmî sayfa veya ürün bilgi formuna bağlı arşiv kayıtları olmalı");
assert.deepEqual(jblLegacyMarineCare.map((item) => item.model), ["CalciuMarin 500 g","MagnesiuMarin 500 ml","MagnesiuMarin 5000 ml","TraceMarin 1 500 ml","TraceMarin 1 5000 ml","TraceMarin 2 500 ml","TraceMarin 2 5000 ml","TraceMarin 3 500 ml","TraceMarin 3 5000 ml"], "JBL eski deniz bakım ürünlerinin gerçek ambalajları korunmalı");
assert(careProductCatalog.find((item) => item.model === "CalciuMarin 500 g")?.description.includes("2491000") && careProductCatalog.find((item) => item.model === "CalciuMarin 500 g")?.description.includes("10 dakika sonra") && careProductCatalog.find((item) => item.model === "CalciuMarin 500 g")?.description.includes("daima eşit miktarda"), "JBL CalciuMarin ürün kodu ve iki bileşenli güvenli kullanım sırası korunmalı");
assert(careProductCatalog.find((item) => item.model === "MagnesiuMarin 500 ml")?.description.includes("2491100") && careProductCatalog.find((item) => item.model === "MagnesiuMarin 5000 ml")?.description.includes("2491200") && jblLegacyMarineCare.filter((item) => item.model.startsWith("MagnesiuMarin ")).every((item) => item.description.includes("50 ml ürün, 50 L suda magnezyumu 50 mg/L yükseltir")), "JBL MagnesiuMarin ambalaj kodları ve resmî doz bilgisi korunmalı");
const jblTraceMarin = jblLegacyMarineCare.filter((item) => item.model.startsWith("TraceMarin "));
assert.equal(jblTraceMarin.length, 6, "JBL TraceMarin üç bileşeni 500 ve 5000 ml ambalajlarla bulunmalı");
assert(jblTraceMarin.every((item) => item.description.includes("haftada 7 ml/100 L") && item.description.includes("2–5 dakika arayla") && item.description.includes("doğrudan mercanların üzerine uygulanmaz") && item.description.includes("diğer bileşenlerin yerine geçmez")), "JBL TraceMarin doz, uygulama aralığı ve bileşen güvenliği korunmalı");
const jblArchivedMedicationIds = [
  "jbl-punktol-plus-125", "jbl-punktol-plus-250", "jbl-punktol-plus-1500", "jbl-oodinol-plus-250",
  "jbl-ektol-fluid-plus-125", "jbl-ektol-fluid-plus-250", "jbl-fungol-plus-250", "jbl-furanol-plus-250",
  "jbl-ektol-bac-plus-250", "jbl-gyrodol-plus-250", "jbl-aradol-plus-250", "jbl-nedol-plus-250",
  "jbl-spirohexol-plus-250", "jbl-ektol-cristal", "jbl-ektol-cristal-240-g", "jbl-ektol-cristal-3000-g",
];
const jblArchivedMedications = jblArchivedMedicationIds.map((id) => careProductCatalog.find((item) => item.id === id));
assert(jblArchivedMedications.every(Boolean), "JBL resmî ilaç arşivindeki 14 aile 16 gerçek paket kaydıyla bulunmalı");
assert(jblArchivedMedications.every((item) => item.category === "treatment" && item.description.toLowerCase().includes("arşiv") && ["2026-09-15", "2026-09-19"].includes(item.verifiedAt)), "JBL arşiv ilaçları güncel ürün gibi gösterilmemeli");
assert(jblArchivedMedications.every((item) => ["prospektüs","uzman","veteriner"].some((warning) => item.description.includes(warning))), "JBL ilaçları güvenli kullanım yönlendirmesi taşımalı");
const jblPunktolModels = jblArchivedMedications.filter((item) => item.id.startsWith("jbl-punktol-plus-"));
assert.deepEqual(new Set(jblPunktolModels.map((item) => item.model)), new Set(["Punktol Plus 125 100 ml", "Punktol Plus 250 100 ml", "Punktol Plus 1500 50 ml"]), "JBL Punktol gerçek ambalajları ayrı modeller olarak bulunmalı");
assert(jblPunktolModels.every((item) => item.sourceUrl.includes("/products/detail/") || item.sourceUrl.includes("/produkte/detail/")), "JBL Punktol kayıtları doğrudan resmî ürün sayfalarına bağlanmalı");
assert(jblPunktolModels.every((item) => item.description.includes("bakır içermez") && item.description.includes("yüzde 50 su değişimi") && item.description.includes("başka ilaçla eşzamanlı karıştırılmamalıdır")), "JBL Punktol kayıtları yayımlanan hazırlık ve karıştırmama güvenliğini taşımalı");
assert(careProductCatalog.find((item) => item.id === "jbl-punktol-plus-125")?.description.includes("1006542") && careProductCatalog.find((item) => item.id === "jbl-punktol-plus-125")?.description.includes("10 ml/100 L"), "JBL Punktol Plus 125 ürün kodu ve yayımlanan dozu taşımalı");
assert(careProductCatalog.find((item) => item.id === "jbl-punktol-plus-250")?.description.includes("1006642") && careProductCatalog.find((item) => item.id === "jbl-punktol-plus-250")?.description.includes("5 ml/100 L"), "JBL Punktol Plus 250 ürün kodu ve yayımlanan dozu taşımalı");
assert(careProductCatalog.find((item) => item.id === "jbl-punktol-plus-1500")?.description.includes("1006800") && careProductCatalog.find((item) => item.id === "jbl-punktol-plus-1500")?.description.includes("1 damla/10 L"), "JBL Punktol Plus 1500 ürün kodu ve yayımlanan dozu taşımalı");
const jblOodinol = careProductCatalog.find((item) => item.id === "jbl-oodinol-plus-250");
assert(jblOodinol?.sourceUrl.includes("id=5567") && jblOodinol.description.includes("1007600") && jblOodinol.description.includes("0,3 mg/L") && jblOodinol.description.includes("bakır testi") && jblOodinol.description.includes("omurgasızlarında kullanılmaz"), "JBL Oodinol doğrudan kaynak, ürün kodu, ölçümlü bakır dozu ve omurgasız yasağını açıkça göstermeli");
const jblEktolFluidModels = ["jbl-ektol-fluid-plus-125", "jbl-ektol-fluid-plus-250"].map((id) => careProductCatalog.find((item) => item.id === id));
assert(jblEktolFluidModels.every((item) => item.sourceUrl.includes("/produkte/detail/") || item.sourceUrl.includes("/products/detail/")), "JBL Ektol fluid kayıtları doğrudan resmî ürün sayfalarına bağlanmalı");
assert.deepEqual(new Set(jblEktolFluidModels.map((item) => item.model)), new Set(["Ektol fluid Plus 125 100 ml", "Ektol fluid Plus 250 100 ml"]), "JBL Ektol fluid gerçek 100 ml ambalajları ayrı modeller olarak bulunmalı");
assert(jblEktolFluidModels.every((item) => item.description.includes("10 ml/50 L") && item.description.includes("5. gün") && item.description.includes("8 °dKH") && item.description.includes("yarım doz") && item.description.includes("amonyum/amonyak") && item.description.includes("nitrit")), "JBL Ektol fluid kayıtları doz, yumuşak su ve su ölçümü sınırlarını taşımalı");
assert(careProductCatalog.find((item) => item.id === "jbl-ektol-fluid-plus-125")?.description.includes("1007800") && careProductCatalog.find((item) => item.id === "jbl-ektol-fluid-plus-250")?.description.includes("1006981"), "JBL Ektol fluid kayıtları yayımlanan ürün kodlarını taşımalı");
const jblFungol = careProductCatalog.find((item) => item.id === "jbl-fungol-plus-250");
assert(jblFungol?.model === "Fungol Plus 250 2 × 100 ml" && jblFungol.sourceUrl.includes("/detail/5557/") && jblFungol.description.includes("1006300") && jblFungol.description.includes("10 ml/80 L") && jblFungol.description.includes("0,5 mg/L") && jblFungol.description.includes("omurgasızları tedaviden çıkarılır"), "JBL Fungol gerçek set, iki aşamalı doz, nitrit eşiği ve omurgasız güvenliğini taşımalı");
const jblFuranol = careProductCatalog.find((item) => item.id === "jbl-furanol-plus-250");
assert(jblFuranol?.model === "Furanol Plus 250 20 tablet" && jblFuranol.sourceUrl.includes("id=5580") && jblFuranol.description.includes("1 tablet/25 L") && jblFuranol.description.includes("500 L") && jblFuranol.description.includes("nifurpirinol") && jblFuranol.description.includes("bazı ülkelerde") && jblFuranol.description.includes("serbest satılmaz") && jblFuranol.description.includes("mikroskobik inceleme"), "JBL Furanol gerçek tablet paketi, doz, antibiyotik ve satış/tanı kısıtını taşımalı");
const jblEktolBac = careProductCatalog.find((item) => item.id === "jbl-ektol-bac-plus-250");
assert(jblEktolBac?.model === "Ektol bac Plus 250 2 × 100 ml" && jblEktolBac.sourceUrl.includes("/detail/5582/") && jblEktolBac.description.includes("700 mg benzalkonyum klorür") && jblEktolBac.description.includes("8000 mg polivinilpirolidon iyot") && jblEktolBac.description.includes("altı günlük altı doz") && jblEktolBac.description.includes("omurgasızları tedaviden çıkarılmalı"), "JBL Ektol bac gerçek iki bileşenli paket, içerik, doz ve omurgasız güvenliğini taşımalı");
const jblGyrodol = careProductCatalog.find((item) => item.id === "jbl-gyrodol-plus-250");
assert(jblGyrodol?.model === "Gyrodol Plus 250 100 ml" && jblGyrodol.sourceUrl.includes("/detail/5569/") && jblGyrodol.description.includes("1500 mg/100 ml prazikuantel") && jblGyrodol.description.includes("10 ml/50 L") && jblGyrodol.description.includes("23 °C") && jblGyrodol.description.includes("mikroskobik tanı"), "JBL Gyrodol gerçek paket, etken madde, sıcaklığa bağlı tekrar ve tanı güvenliğini taşımalı");
const jblAradol = careProductCatalog.find((item) => item.id === "jbl-aradol-plus-250");
assert(jblAradol?.model === "Aradol Plus 250 100 ml" && jblAradol.sourceUrl.includes("/detail/5577/") && jblAradol.description.includes("10 ml/50 L") && jblAradol.description.includes("8. gün yüzde 50") && jblAradol.description.includes("14. gün") && jblAradol.description.includes("18 °C altında etkisizdir") && jblAradol.description.includes("büyümesini engeller"), "JBL Aradol gerçek paket, iki aşamalı şema, sıcaklık ve etki sınırını taşımalı");
const jblNedol = careProductCatalog.find((item) => item.id === "jbl-nedol-plus-250");
assert(jblNedol?.model === "Nedol Plus 250 100 ml" && jblNedol.description.includes("eski katalog no. 10074") && jblNedol.description.includes("10 ml/75 L") && jblNedol.description.includes("750 L") && jblNedol.description.includes("Camallanus") && jblNedol.description.includes("omurgasızlarında kullanılmaz"), "JBL Nedol gerçek paket, doz, hedef nematod ve omurgasız güvenliğini taşımalı");
const jblSpirohexol = careProductCatalog.find((item) => item.id === "jbl-spirohexol-plus-250");
assert(jblSpirohexol?.model === "Spirohexol Plus 250 100 ml" && jblSpirohexol.sourceUrl.includes("/detail/5575/") && jblSpirohexol.description.includes("10 ml/50 L") && jblSpirohexol.description.includes("7 gün") && jblSpirohexol.description.includes("8. gün") && jblSpirohexol.description.includes("kıkırdaklı balıklar") && jblSpirohexol.description.includes("karantina tankında"), "JBL Spirohexol gerçek paket, tekrar şeması, kıkırdaklı balık ve deniz karantinası güvenliğini taşımalı");
const jblEktolCristal = jblArchivedMedications.filter((item) => item.id.startsWith("jbl-ektol-cristal"));
assert.deepEqual(new Set(jblEktolCristal.map((item) => item.model)), new Set(["Ektol cristal 80 g","Ektol cristal 240 g","Ektol cristal 3000 g"]), "JBL Ektol cristal üç resmî ambalajıyla bulunmalı");
assert(jblEktolCristal.every((item) => item.description.includes("ilaçların yerine geçmez") && item.description.includes("8 °dKH") && item.description.includes("0,5 mg/L") && item.description.includes("yüzde 75 su değişimi") && item.description.includes("3 g/L") && item.description.includes("10 dakika")), "JBL Ektol cristal ilaç gibi sunulmamalı; yumuşak su, nitrit, bakır ve tuz banyosu sınırlarını taşımalı");
assert(jblCareProducts.every((item) => item.sourceUrl.startsWith("https://www.jbl.de/") && ["2026-09-14","2026-09-15","2026-09-17","2026-09-18","2026-09-19"].includes(item.verifiedAt)), "JBL bakım ürünleri resmî kaynak ve güncel doğrulama tarihi taşımalı");
assert(jblCareProducts.some((item) => item.model === "FilterStart 10 ml" && item.description.includes("10 ml ürün 3 L filtre malzemesine uygulanır")), "JBL FilterStart resmî 10 ml/3 L kullanım bilgisini taşımalı");
assert(careProductCatalog.find((item) => item.id === "jbl-algol")?.description.includes("hassas karidesler"), "JBL Algol kaydı üreticinin karides ve bitki riskini kullanıcıdan saklamamalı");

const expectedAquaelOxyboost = [
  ["aquael-oxyboost-100", 100, 2.2, undefined, 100, false],
  ["aquael-oxyboost-150", 150, 2.2, 100, 150, true],
  ["aquael-oxyboost-200", 200, 2.5, 150, 200, false],
  ["aquael-oxyboost-300", 300, 2.5, 200, 300, true],
];
for (const [id, flow, power, minL, maxL, adjustable] of expectedAquaelOxyboost) {
  const item = equipmentCatalog.find((entry) => entry.id === id);
  assert(item, `Aquael OXYBOOST modeli eksik: ${id}`);
  assert.equal(item.ratedFlowLph, flow, `${id} resmî debiyi taşımalı`);
  assert.equal(item.powerW, power, `${id} resmî güç değerini taşımalı`);
  assert.equal(item.recommendedMinL, minL, `${id} resmî alt hacim sınırını taşımalı`);
  assert.equal(item.recommendedMaxL, maxL, `${id} resmî üst hacim sınırını taşımalı`);
  assert.equal(item.adjustableFlow, adjustable, `${id} yalnız APR varyantında ayarlanabilir olmalı`);
  assert.equal(item.sourceUrl, "https://www.aquael.com/products/aquaristics/air_pumps/oxyboost-plus-en/", `${id} resmî güncel aile tablosuna bağlanmalı`);
  assert.equal(item.verifiedAt, "2026-09-11", `${id} güncel doğrulama tarihi taşımalı`);
}

const expectedAquaelPlatiniumHeaters = [
  [25, 10, 25],
  [50, 15, 50],
  [75, 35, 75],
  [100, 60, 100],
  [150, 90, 150],
  [200, 130, 200],
  [250, 180, 250],
  [300, 230, 300],
];
for (const [power, minL, maxL] of expectedAquaelPlatiniumHeaters) {
  const item = equipmentCatalog.find((entry) => entry.id === `aquael-platinium-${power}`);
  assert(item, `Aquael Platinium Heater ${power} W katalogda bulunmalı`);
  assert.equal(item.category, "heater", `Aquael Platinium Heater ${power} W yalnız ısıtıcı kategorisinde olmalı`);
  assert.equal(item.powerW, power, `Aquael Platinium Heater ${power} W resmî gücü taşımalı`);
  assert.equal(item.recommendedMinL, minL, `Aquael Platinium Heater ${power} W resmî alt hacim sınırını taşımalı`);
  assert.equal(item.recommendedMaxL, maxL, `Aquael Platinium Heater ${power} W resmî üst hacim sınırını taşımalı`);
  assert.equal(item.sourceUrl, "https://www.aquael.com/us/products/aquaristics-us/heaters-us/platinium-heater/", `Aquael Platinium Heater ${power} W resmî aile tablosuna bağlanmalı`);
  assert.equal(item.verifiedAt, "2026-09-11", `Aquael Platinium Heater ${power} W güncel doğrulama tarihi taşımalı`);
}

const expectedAquaelDayNightHeaters = [
  [25, 10, 25],
  [50, 15, 50],
  [75, 35, 75],
  [100, 60, 100],
  [150, 90, 150],
  [200, 130, 200],
];
for (const [power, minL, maxL] of expectedAquaelDayNightHeaters) {
  const item = equipmentCatalog.find((entry) => entry.id === `aquael-ultra-heater-day-night-${power}`);
  assert(item, `Aquael Ultra Heater Day&Night ${power} W katalogda bulunmalı`);
  assert.equal(item.category, "heater", `Aquael Ultra Heater Day&Night ${power} W yalnız ısıtıcı kategorisinde olmalı`);
  assert.equal(item.powerW, power, `Aquael Ultra Heater Day&Night ${power} W resmî gücü taşımalı`);
  assert.equal(item.recommendedMinL, minL, `Aquael Ultra Heater Day&Night ${power} W resmî alt hacim sınırını taşımalı`);
  assert.equal(item.recommendedMaxL, maxL, `Aquael Ultra Heater Day&Night ${power} W resmî üst hacim sınırını taşımalı`);
  assert.equal(item.sourceUrl, "https://www.aquael.com/products/aquaristics/heaters/ultra-heater-daynight/", `Aquael Ultra Heater Day&Night ${power} W resmî ürün sayfasına bağlanmalı`);
  assert.equal(item.verifiedAt, "2026-09-11", `Aquael Ultra Heater Day&Night ${power} W güncel doğrulama tarihi taşımalı`);
}

const aquaelFlowHeaterBt = equipmentCatalog.find((entry) => entry.id === "aquael-flow-heater-bt");
assert(aquaelFlowHeaterBt, "Aquael Flow Heater BT katalogda bulunmalı");
assert.equal(aquaelFlowHeaterBt.category, "heater", "Aquael Flow Heater BT yalnız ısıtıcı kategorisinde olmalı");
assert.equal(aquaelFlowHeaterBt.recommendedMinL, 60, "Aquael Flow Heater BT resmî alt hacim sınırını taşımalı");
assert.equal(aquaelFlowHeaterBt.recommendedMaxL, undefined, "Aquael Flow Heater BT çelişkili üst hacim sınırını otomatik hesaba almamalı");
assert.equal(aquaelFlowHeaterBt.powerW, undefined, "Aquael Flow Heater BT değişken 50–500 W aralığını sabit güç gibi kullanmamalı");
assert.match(aquaelFlowHeaterBt.specifications, /50–500 W/, "Aquael Flow Heater BT ayarlanabilir güç aralığını kullanıcıya açıklamalı");
assert.match(aquaelFlowHeaterBt.specifications, /kesin üst sınır kullanılmaz/, "Aquael Flow Heater BT resmî kaynak çelişkisini kullanıcıdan saklamamalı");
assert.equal(aquaelFlowHeaterBt.sourceUrl, "https://www.aquael.com/products/aquaristics/smart-aquarium/flow-heater-bt/", "Aquael Flow Heater BT resmî ürün sayfasına bağlanmalı");
assert.equal(aquaelFlowHeaterBt.verifiedAt, "2026-09-11", "Aquael Flow Heater BT güncel doğrulama tarihi taşımalı");

const expectedAquaelCurrentInternalFilters = [
  ["aquael-pat-mini", 450, 4.5, 10, 120],
  ["aquael-turbo-mini", 320, 4.4, undefined, 80],
  ["aquael-sas-500", 500, 4.4, 20, 500],
  ["aquael-unifilter-uvc-500", 500, 5, 100, 200],
  ["aquael-unifilter-uvc-750", 750, 8, 200, 300],
  ["aquael-unifilter-uvc-1000", 1000, 10.9, 250, 350],
];
for (const [id, flow, power, minL, maxL] of expectedAquaelCurrentInternalFilters) {
  const item = equipmentCatalog.find((entry) => entry.id === id);
  assert(item, `Güncel Aquael iç filtre katalogda bulunmalı: ${id}`);
  assert.equal(item.category, "filter", `${id} yalnız filtre kategorisinde olmalı`);
  assert.equal(item.ratedFlowLph, flow, `${id} resmî debiyi taşımalı`);
  assert.equal(item.powerW, power, `${id} resmî gücü taşımalı`);
  assert.equal(item.recommendedMinL, minL, `${id} resmî alt hacim sınırını taşımalı`);
  assert.equal(item.recommendedMaxL, maxL, `${id} resmî üst hacim sınırını taşımalı`);
  assert.equal(item.adjustableFlow, true, `${id} resmî akış ayarı bilgisini taşımalı`);
  assert.equal(item.verifiedAt, "2026-09-11", `${id} güncel doğrulama tarihi taşımalı`);
}

const expectedAquaelNewFilters = [
  ["aquael-neo-300", 320, 4.5, undefined, 100, true],
  ["aquael-neo-bio-1000", 1000, 15, undefined, 250, true],
  ["aquael-multikani-1000", 1000, 9.1, 25, 400, undefined],
  ["aquael-fzn-pro-400", 320, 4.5, 10, 75, true],
  ["aquael-fzn-pro-700", 700, 6.2, 75, 130, true],
  ["aquael-fzn-pro-1000", 900, 7.1, 130, 200, true],
  ["aquael-fzn-pro-1500", 1370, 13, 200, 300, true],
];
for (const [id, flow, power, minL, maxL, adjustable] of expectedAquaelNewFilters) {
  const item = equipmentCatalog.find((entry) => entry.id === id);
  assert(item, `Güncel Aquael filtre katalogda bulunmalı: ${id}`);
  assert.equal(item.category, "filter", `${id} yalnız filtre kategorisinde olmalı`);
  assert.equal(item.ratedFlowLph, flow, `${id} resmî debiyi taşımalı`);
  assert.equal(item.powerW, power, `${id} resmî gücü taşımalı`);
  assert.equal(item.recommendedMinL, minL, `${id} resmî alt hacim sınırını taşımalı`);
  assert.equal(item.recommendedMaxL, maxL, `${id} resmî üst hacim sınırını taşımalı`);
  assert.equal(item.adjustableFlow, adjustable, `${id} yalnız kaynakta yayımlanan akış ayarını taşımalı`);
  assert.equal(item.verifiedAt, "2026-09-11", `${id} güncel doğrulama tarihi taşımalı`);
}

const aquaelNeoBioAdditionalModule = equipmentCatalog.find((entry) => entry.id === "aquael-neo-bio-1000-additional-module");
assert(aquaelNeoBioAdditionalModule, "Aquael Neo Bio 1000 ek filtre modülü katalogda bulunmalı");
assert.deepEqual(
  [aquaelNeoBioAdditionalModule.category, aquaelNeoBioAdditionalModule.passiveComponent, aquaelNeoBioAdditionalModule.ratedFlowLph],
  ["other", true, undefined],
  "Neo Bio 1000 ek modülü bağımsız motor debisi olmayan pasif aksesuar olmalı",
);
assert.equal(aquaelNeoBioAdditionalModule.sourceUrl, "https://www.aquael.com/products/aquaristics/aquaristics/neo-bio-100-additional-module/", "Neo Bio 1000 ek modülü doğrudan resmî kaynağa bağlanmalı");

const aquaelOxypro150 = equipmentCatalog.find((entry) => entry.id === "aquael-oxypro-150");
assert(aquaelOxypro150, "Aquael OXYPRO 150 katalogda bulunmalı");
assert.deepEqual(
  [aquaelOxypro150.category, aquaelOxypro150.ratedFlowLph, aquaelOxypro150.powerW, aquaelOxypro150.recommendedMaxL, aquaelOxypro150.adjustableFlow],
  ["air_pump", 150, 2, 200, true],
  "OXYPRO 150 resmî debi, güç, hacim ve ayarlanabilirlik verilerini taşımalı",
);
assert.equal(aquaelOxypro150.sourceUrl, "https://www.aquael.com/products/aquaristics/air_pumps/oxypro/", "OXYPRO 150 doğrudan resmî ürün sayfasına bağlanmalı");

const expectedAquaelSmartCanisters = [
  ["aquael-ultramax-bt", 2200, 13.5, 100, 750, undefined],
  ["aquael-hypermax-link", 4500, 36, 200, 1500, 300],
  ["aquael-hypermax-bt-thermo", 4500, 36, 200, 1500, 300],
];
for (const [id, flow, power, minL, maxL, heaterPower] of expectedAquaelSmartCanisters) {
  const item = equipmentCatalog.find((entry) => entry.id === id);
  assert(item, `Güncel Aquael akıllı dış filtre katalogda bulunmalı: ${id}`);
  assert.equal(item.category, "filter", `${id} yalnız filtre kategorisinde olmalı`);
  assert.equal(item.ratedFlowLph, flow, `${id} resmî azami debiyi taşımalı`);
  assert.equal(item.powerW, power, `${id} resmî azami motor gücünü taşımalı`);
  assert.equal(item.recommendedMinL, minL, `${id} resmî alt hacim sınırını taşımalı`);
  assert.equal(item.recommendedMaxL, maxL, `${id} resmî üst hacim sınırını taşımalı`);
  assert.equal(item.integratedHeaterW, heaterPower, `${id} yalnız gerçek entegre ısıtıcı gücünü taşımalı`);
  assert.equal(item.adjustableFlow, true, `${id} uygulama veya panelden ayarlanabilir akışı taşımalı`);
  assert.equal(item.verifiedAt, "2026-09-11", `${id} güncel doğrulama tarihi taşımalı`);
}

const expectedAquaelCurrentLighting = [
  ["aquael-leddy-slim-sunny-day-night-4-8", 4.8, [20, 30], "520 lm"],
  ["aquael-leddy-slim-sunny-day-night-10", 10, [50, 70], "900 lm"],
  ["aquael-leddy-slim-sunny-day-night-32", 32, [80, 107], "2900 lm"],
  ["aquael-leddy-slim-sunny-day-night-36", 36, [100, 127], "3250 lm"],
  ["aquael-leddy-tube-sunny-day-night-7", 7, undefined, "620 lm"],
  ["aquael-leddy-tube-sunny-day-night-10", 10, undefined, "900 lm"],
  ["aquael-leddy-tube-sunny-day-night-14", 14, undefined, "70 cm"],
  ["aquael-leddy-tube-sunny-day-night-14-j", 14, undefined, "62 cm"],
  ["aquael-leddy-tube-sunny-day-night-17", 17, undefined, "101.5 cm"],
  ["aquael-leddy-tube-sunny-day-night-17-j", 17, undefined, "92.5 cm"],
  ["aquael-leddy-tube-sunny-4-8", 4.8, undefined, "520 lm"],
  ["aquael-leddy-tube-plant-4-8", 4.8, undefined, "9000 K"],
  ["aquael-leddy-tube-plant-10", 10, undefined, "41,5 cm"],
  ["aquael-leddy-tube-plant-14", 14, undefined, "70 cm"],
  ["aquael-leddy-tube-plant-17", 17, undefined, "101,5 cm"],
  ["aquael-leddy-tube-marine-day-night-10", 10, undefined, "900 lm"],
  ["aquael-leddy-tube-marine-day-night-14", 14, undefined, "1270 lm"],
  ["aquael-leddy-tube-marine-day-night-17", 17, undefined, "1520 lm"],
  ["aquael-leddy-slim-duo-sunny-plant-night-10", 10, [20, 30], "650 lm"],
  ["aquael-leddy-slim-duo-sunny-plant-night-16", 16, [40, 67], "1100 lm"],
  ["aquael-leddy-slim-duo-marine-actinic-10", 10, [20, 30], "900 lm"],
  ["aquael-ultra-slim-bt-30", 30, [31.9, 57.4], "3100 lm"],
  ["aquael-ultra-slim-bt-60", 60, [59.9, 105.4], "6200 lm"],
  ["aquael-ultra-slim-bt-90", 90, [87.9, 133.4], "9300 lm"],
  ["aquael-leddy-slim-bt-460", 14, undefined, "WRGB + UV-A"],
  ["aquael-leddy-slim-bt-560", 18, undefined, "WRGB + UV-A"],
  ["aquael-leddy-slim-bt-760", 26, undefined, "WRGB + UV-A"],
  ["aquael-leddy-slim-bt-960", 34, undefined, "WRGB + UV-A"],
  ["aquael-leddy-smart-day-night-sunny", 4.8, undefined, "520 lm"],
  ["aquael-leddy-smart-day-night-plant", 4.8, undefined, "350 lm"],
  ["aquael-leddy-smart-bt", 4.8, undefined, "10–50 L"],
  ["aquael-leddy-slim-marine-day-night-32", 32, [80, 107], "2900 lm"],
  ["aquael-leddy-slim-marine-day-night-36", 36, [100, 127], "3250 lm"],
  ["aquael-moonlight-led", 1, undefined, "IPX8"],
  ["aquael-leddy-slim-link-36", 36, [100, 120], "2750 lm"],
];
for (const [id, power, tankLength, detail] of expectedAquaelCurrentLighting) {
  const item = equipmentCatalog.find((entry) => entry.id === id);
  assert(item, `Güncel Aquael aydınlatma modeli katalogda bulunmalı: ${id}`);
  assert.equal(item.category, "lighting", `${id} yalnız aydınlatma kategorisinde olmalı`);
  assert.equal(item.powerW, power, `${id} resmî güç değerini taşımalı`);
  assert.deepEqual(item.recommendedTankLengthCm, tankLength, `${id} yalnız kaynakta akvaryum genişliği yayımlandığında uzunluk aralığı taşımalı`);
  assert.match(item.specifications, new RegExp(String(detail).replace(/[+]/g, "\\+")), `${id} resmî ışık veya boyut ayrıntısını taşımalı`);
  assert(item.sourceUrl?.startsWith("https://www.aquael.com/"), `${id} resmî Aquael kaynağına bağlanmalı`);
  assert(["2026-09-11", "2026-09-12"].includes(item.verifiedAt), `${id} güncel doğrulama tarihi taşımalı`);
}

for (const [id, model, power] of [
  ["aquael-leddy-slim-bt-460-white", "Leddy Slim BT 460 White", 14],
  ["aquael-leddy-slim-bt-560-white", "Leddy Slim BT 560 White", 18],
  ["aquael-leddy-slim-bt-760-white", "Leddy Slim BT 760 White", 26],
  ["aquael-leddy-slim-bt-960-white", "Leddy Slim BT 960 White", 34],
  ["aquael-leddy-slim-sunny-day-night-32-white", "Leddy Slim Sunny Day&Night 32 W White", 32],
  ["aquael-leddy-slim-sunny-day-night-36-white", "Leddy Slim Sunny Day&Night 36 W White", 36],
  ["aquael-leddy-plant-32-white", "Leddy Slim Plant 32 W White", 32],
  ["aquael-leddy-plant-36-white", "Leddy Slim Plant 36 W White", 36],
  ["aquael-leddy-slim-duo-sunny-plant-night-10-white", "Leddy Slim Duo Sunny Plant&Night 10 W White", 10],
  ["aquael-leddy-slim-duo-sunny-plant-night-16-white", "Leddy Slim Duo Sunny Plant&Night 16 W White", 16],
  ["aquael-leddy-smart-day-night-sunny-white", "Leddy Smart Day&Night Sunny White", 4.8],
  ["aquael-leddy-smart-day-night-plant-white", "Leddy Smart Day&Night Plant White", 4.8],
  ["aquael-leddy-slim-marine-day-night-32-white", "Leddy Slim Marine Day&Night 32 W White", 32],
  ["aquael-leddy-slim-marine-day-night-36-white", "Leddy Slim Marine Day&Night 36 W White", 36],
  ["aquael-leddy-smart-bt-white", "Leddy Smart BT White", 4.8],
]) {
  const item = equipmentCatalog.find((entry) => entry.id === id);
  assert.deepEqual([item?.model, item?.category, item?.powerW], [model, "lighting", power], `${model} ayrı resmî renk varyantı olarak bulunmalı`);
  assert.equal(item?.verifiedAt, "2026-09-12", `${model} güncel doğrulama tarihini taşımalı`);
}
assert.equal(equipmentCatalog.find((entry) => entry.id === "aquael-leddy-slim-bt-460")?.model, "Leddy Slim BT 460 Black", "Eski Leddy Slim BT katalog kimliği siyah varyantı korumalı");

const aquaelAirlights = equipmentCatalog.find((entry) => entry.id === "aquael-airlights-led");
assert(aquaelAirlights, "Aquael Airlights LED katalogda bulunmalı");
assert.equal(aquaelAirlights.category, "other", "Aquael Airlights ana aydınlatma veya filtre gibi sınıflandırılmamalı");
assert.equal(aquaelAirlights.requiresAirPump, true, "Aquael Airlights bağımsız hava motoru gereksinimini taşımalı");
assert.equal(aquaelAirlights.passiveComponent, true, "Aquael Airlights motorlu ekipman kapasitesine katılmamalı");
assert.equal(aquaelAirlights.sourceUrl, "https://www.aquael.com/products/aquaristics/decorations/koncowka-napowietrzajaca-led/", "Aquael Airlights resmî ürün sayfasına bağlanmalı");
assert.equal(aquaelAirlights.verifiedAt, "2026-09-11", "Aquael Airlights güncel doğrulama tarihi taşımalı");

for (const [id, sourcePart] of [
  ["aquael-leddy-slim-hanger", "/leddy-slim-hanger/"],
  ["aquael-leddy-slim-frame-bracket", "/drzak-na-ram-pro-lampy-leddy-slim/"],
]) {
  const item = equipmentCatalog.find((entry) => entry.id === id);
  assert(item, `Aquael pasif aydınlatma montaj aksesuarı katalogda bulunmalı: ${id}`);
  assert.equal(item.category, "other", `${id} ana aydınlatma cihazı gibi sınıflandırılmamalı`);
  assert.equal(item.passiveComponent, true, `${id} motorlu veya elektrikli kapasite hesabına katılmamalı`);
  assert(item.sourceUrl?.includes(sourcePart), `${id} doğrudan resmî ürün sayfasına bağlanmalı`);
  assert.equal(item.verifiedAt, "2026-09-11", `${id} güncel doğrulama tarihi taşımalı`);
}

for (const [id, flow, power, detail] of [
  ["aquael-unipump-700", 700, 9.5, "145 cm"],
  ["aquael-unipump-1000", 1000, 15, "145 cm"],
  ["aquael-unipump-1500", 1400, 19, "155 cm"],
]) {
  const item = equipmentCatalog.find((entry) => entry.id === id);
  assert(item, `Aquael güncel Uni Pump modeli katalogda bulunmalı: ${id}`);
  assert.deepEqual([item.category, item.ratedFlowLph, item.powerW], ["other", flow, power], `${id} resmî debi ve güç değerlerini taşımalı`);
  assert.match(item.specifications, new RegExp(detail), `${id} resmî basma yüksekliğini taşımalı`);
  assert(item.sourceUrl?.includes("/unipump/"), `${id} doğrudan resmî Uni Pump sayfasına bağlanmalı`);
}

for (const [id, power, minL, maxL] of [
  ["aquael-sterilizer-uv-as-2-5w", 5, 1, 200],
  ["aquael-sterilizer-uv-as-2-7w", 7, 200, 400],
  ["aquael-sterilizer-uv-as-2-9w", 9, 400, 600],
  ["aquael-sterilizer-uv-as-2-11w", 11, 600, 800],
]) {
  const item = equipmentCatalog.find((entry) => entry.id === id);
  assert(item, `Aquael UV AS 2.0 varyantı katalogda bulunmalı: ${id}`);
  assert.deepEqual([item.category, item.powerW, item.integratedUvcW, item.recommendedMinL, item.recommendedMaxL], ["uv", power, power, minL, maxL], `${id} resmî UV gücü ve hacim aralığını taşımalı`);
  assert(item.sourceUrl?.includes("/sterilizer-uv-as-2-0-en/"), `${id} doğrudan resmî sterilizatör sayfasına bağlanmalı`);
}

const aquaelUv3w = equipmentCatalog.find((entry) => entry.id === "aquael-sterilizer-uv-3w-led");
assert.deepEqual([aquaelUv3w?.category, aquaelUv3w?.powerW, aquaelUv3w?.integratedUvcW, aquaelUv3w?.recommendedMaxL], ["uv", 3.5, 3, 120], "Aquael 3 W LED sterilizatör UV gücü, toplam tüketimi ve 120 L sınırını ayırmalı");
const aquaelMiniUv = equipmentCatalog.find((entry) => entry.id === "aquael-mini-uv-c");
assert.deepEqual([aquaelMiniUv?.category, aquaelMiniUv?.powerW, aquaelMiniUv?.recommendedMaxL], ["uv", 0.5, 150], "Aquael Mini UV C resmî 0,5 W ve 150 L sınırını taşımalı");

for (const [id, sourcePart] of [
  ["aquael-thermometer-bt", "/thermometer-bt-2/"],
  ["aquael-socket-bt-duo", "/socket-bt-duo/"],
  ["aquael-wifi-gateway-bt", "/wi-fi-gateway-bt/"],
  ["aquael-thermometer-link", "/thermometer-link/"],
  ["aquael-socket-link-duo", "/socket-link-duo/"],
]) {
  const item = equipmentCatalog.find((entry) => entry.id === id);
  assert(item, `Aquael akıllı aksesuarı katalogda bulunmalı: ${id}`);
  assert.equal(item.category, "other", `${id} filtre, ısıtıcı veya UV kapasitesine karışmamalı`);
  assert(item.sourceUrl?.includes(sourcePart), `${id} doğrudan resmî ürün sayfasına bağlanmalı`);
  assert.equal(item.verifiedAt, "2026-09-11", `${id} güncel doğrulama tarihi taşımalı`);
}

const aquaelCurrentAccessoryIds = [
  "aquael-gravel-cleaner-s", "aquael-gravel-cleaner-l", "aquael-gravel-cleaner-xl",
  "aquael-straight-scissors-25", "aquael-curved-scissors-25",
  "aquael-straight-tweezers-27", "aquael-curved-tweezers-27",
  "aquael-thermometer-t9", "aquael-thermometer-glass-15", "aquael-thermometer-glass-6",
  "aquael-thermometer-hanging-6", "aquael-thermometer-hanging-10",
  "aquael-magnet-cleaner-2in1-s", "aquael-magnet-cleaner-2in1-m",
  "aquael-magnet-cleaner-2in1-l", "aquael-magnet-cleaner-2in1-xl",
  "aquael-aquarium-scraper-3in1",
  "aquael-air-stone-roller-small", "aquael-air-stone-sphere-small",
  "aquael-air-stone-roller-medium", "aquael-air-stone-sphere-medium",
  "aquael-sprinkler-fan-350-650", "aquael-sprinkler-unimax-1100",
  "aquael-glass-pipes-12-16", "aquael-nano-cool",
  "aquael-fish-net-7-5x6", "aquael-fish-net-10x7-5", "aquael-fish-net-12-5x10",
  "aquael-fish-net-15x12-5", "aquael-fish-net-20x15", "aquael-fish-net-25x20", "aquael-fish-net-30x25",
  "aquael-aquarium-mat-41x25", "aquael-aquarium-mat-60x30", "aquael-aquarium-mat-80x35",
  "aquael-aquarium-mat-100x40", "aquael-aquarium-mat-120x40", "aquael-aquarium-mat-150x50",
  "aquael-filter-hose-cleaner",
  "aquael-magnet-cleaner-s", "aquael-magnet-cleaner-m", "aquael-magnet-cleaner-l",
  "aquael-airline-3m", "aquael-airline-6m",
];
for (const id of aquaelCurrentAccessoryIds) {
  const item = equipmentCatalog.find((entry) => entry.id === id);
  assert(item, `Aquael güncel bakım aksesuarı katalogda bulunmalı: ${id}`);
  assert.equal(item.category, "other", `${id} diğer ekipman kategorisinde bulunmalı`);
  assert(item.sourceUrl?.startsWith("https://www.aquael.com/products/aquaristics/accessories/"), `${id} doğrudan resmî aksesuar sayfasına bağlanmalı`);
  assert.equal(item.verifiedAt, "2026-09-11", `${id} güncel doğrulama tarihi taşımalı`);
}
for (const id of ["aquael-air-stone-roller-small", "aquael-air-stone-sphere-medium"]) {
  const item = equipmentCatalog.find((entry) => entry.id === id);
  assert.deepEqual([item?.requiresAirPump, item?.passiveComponent, item?.ratedFlowLph], [true, true, undefined], `${id} bağımsız hava motoru gerektiren debisiz pasif aksesuar olmalı`);
}
assert.equal(equipmentCatalog.find((entry) => entry.id === "aquael-nano-cool")?.powerW, 1, "Aquael Nano Cool resmî 1 W tüketimini taşımalı");
const aquaelHypermaxEngineCover = equipmentCatalog.find((entry) => entry.id === "aquael-hypermax-engine-cover");
assert(aquaelHypermaxEngineCover, "Aquael Hypermax motor kapağı katalogda bulunmalı");
assert.deepEqual([aquaelHypermaxEngineCover.category, aquaelHypermaxEngineCover.passiveComponent], ["other", true], "Aquael Hypermax motor kapağı pasif aksesuar olmalı");
assert.equal(aquaelHypermaxEngineCover.sourceUrl, "https://www.aquael.com/products/aquaristics/aquaristics/139094-2/", "Aquael Hypermax motor kapağı doğrudan resmî ürün sayfasına bağlanmalı");

const aquaelCare = careProductCatalog.filter((entry) => entry.brand === "Aquael");
const aquaelEquipment = equipmentCatalog.filter((entry) => entry.brand === "Aquael");
assert.equal(aquaelEquipment.length, 194, "Aquael güncel ekipman portföyü 194 ayrı model/varyant içermeli");
assert.equal(aquaelCare.length, 322, "Aquael güncel ürün portföyü 322 ayrı ürün/varyant içermeli");
assert.equal(aquaelCare.filter((entry) => entry.category === "filter_media").length, 69, "Aquael resmî filtre medyası portföyü 69 kayıt içermeli");
assert.equal(aquaelCare.filter((entry) => entry.category === "substrate").length, 33, "Aquael resmî taban malzemesi portföyü 33 kayıt içermeli");
assert.equal(aquaelCare.filter((entry) => entry.category === "food").length, 40, "Aquael resmî Acti Food portföyü 40 paket varyantı içermeli");
assert.equal(aquaelCare.filter((entry) => entry.category === "water_conditioner").length, 2, "Aquael Acti Clean iki gerçek hacim seçeneği içermeli");
assert.equal(aquaelCare.filter((entry) => entry.category === "bacteria").length, 2, "Aquael Acti Bactol iki gerçek hacim seçeneği içermeli");
assert.equal(aquaelCare.filter((entry) => entry.category === "decoration").length, 26, "Aquael resmî dekorasyon portföyü 26 ürün/varyant içermeli");
assert.equal(aquaelCare.filter((entry) => entry.category === "aquarium_set").length, 74, "Aquael doğrulanmış akvaryum seti paketi 74 varyant içermeli");
assert.equal(aquaelCare.filter((entry) => entry.category === "tank").length, 27, "Aquael güncel boş akvaryum ve fanus aileleri 27 varyant içermeli");
assert.equal(aquaelCare.filter((entry) => entry.category === "cover").length, 11, "Aquael resmî Leddy ve Classic kapak aileleri 11 varyant içermeli");
assert.equal(aquaelCare.filter((entry) => entry.category === "cabinet").length, 34, "Aquael resmî dolap portföyü 34 varyant içermeli");
assert.equal(aquaelCare.filter((entry) => entry.category === "aquaterrarium").length, 3, "Aquael resmî Aquaterrarium ailesi üç gerçek boy içermeli");
assert.equal(aquaelCare.filter((entry) => entry.category === "terrarium").length, 1, "Aquael Selva Mini ayrı terrarium kategorisinde bulunmalı");
const aquaelOptiSetCabinet130White = aquaelCare.find((entry) => entry.model === "Opti Set Cabinet 130 White");
assert.equal(aquaelOptiSetCabinet130White?.category, "cabinet", "Opti Set Cabinet 130 renkleri dolap kategorisinde olmalı");
assert.equal(aquaelOptiSetCabinet130White?.dimensionsCm, undefined, "Opti Set Cabinet 130 için kaynakta yayımlanmayan derinlik değeri tahmin edilmemeli");
assert.equal(aquaelOptiSetCabinet130White?.sourceUrl, "https://www.aquael.com/products/aquaristics/cabinets/opti-set-cabinet-130/", "Opti Set Cabinet 130 doğrudan resmî ürün sayfasına bağlanmalı");
assert(aquaelCare.every((entry) => entry.sourceUrl.startsWith("https://www.aquael.com/")), "Aquael bakım ürünlerinin tamamı resmî üretici kaynağına bağlanmalı");
assert(aquaelCare.every((entry) => ["2026-09-11","2026-09-12"].includes(entry.verifiedAt)), "Aquael ürünlerinin tamamı güncel doğrulama tarihi taşımalı");
const aquaelCareCategory = (model) => aquaelCare.find((entry) => entry.model === model)?.category;
for (const [family,model,category] of [
  ["Neo Set","Neo Set 125","aquarium_set"],
  ["Selva Mini Terrarium","Selva Mini Terrarium","terrarium"],
  ["Glossy Marine","Glossy Marine Standard","aquarium_set"],
  ["Leddy XL Day&Night","Leddy XL Day&Night 40","aquarium_set"],
  ["Aquaterrarium","AquaTerrarium 60","aquaterrarium"],
  ["Opti Set 130","Opti Set 130 White","aquarium_set"],
  ["Fish & Shrimp Set Duo","Fish & Shrimp Set Duo 35 White","aquarium_set"],
  ["NanoReef Duo","NanoReef Duo 35 White","aquarium_set"],
  ["Shrimp Set Day&Night","Shrimp Set Day&Night 10 Black","aquarium_set"],
  ["Opti Set","Opti Set 125 Black","aquarium_set"],
  ["Glossy ST","Glossy ST 80 Grey","aquarium_set"],
  ["Leddy Day&Night","Leddy Day&Night 40 Black","aquarium_set"],
  ["Aqua 4","Aqua 4 Kids Rectangular","aquarium_set"],
  ["Classic Box","Classic Box Set 40 Rectangular","aquarium_set"],
  ["UltraScape Set","UltraScape Set 60 Forest","aquarium_set"],
  ["OptiBent Set","OptiBent Set 20 Black","aquarium_set"],
  ["Leddy Plus","Leddy Plus Day&Night 40 Black","aquarium_set"],
  ["Hexa Set","Hexa Set II 60L Black LT","aquarium_set"],
  ["Betta Kit","Betta Kit","aquarium_set"],
  ["Leddy Mini Creative Set","Leddy Mini Creative Set 30 Black","aquarium_set"],
]) {
  const item = aquaelCare.find((entry) => entry.model === model);
  assert.equal(item?.category, category, `Aquael resmî ${family} ailesi doğru kategoride temsil edilmeli`);
  assert(item?.sourceUrl.startsWith("https://www.aquael.com/"), `Aquael ${family} ailesi doğrudan resmî kaynağa bağlanmalı`);
}
for (const model of [
  "NanoMax Bio 1 L",
  "NatureMax Bio 1 L",
  "PearlMax Bio 1 L",
  "Magic Balls 1 L",
  "BioCeraMAX UltraPro 1600 1 L",
  "CarboMAX Plus 1 L",
  "ZeoMAX Plus 1 L",
  "WoolMax Pro",
  "FZN Pro Media Pack PhosMAX 3'lü",
  "Filter Media Bag 28 × 32 cm",
]) {
  assert.equal(aquaelCareCategory(model), "filter_media", `Aquael ${model} filtre medyası kategorisinde bulunmalı`);
}
for (const model of [
  "Aqua Decoris Black 2–3 mm 1 kg",
  "Natural Multicolored Gravel 5–10 mm 10 kg",
  "Quartz Sand 0,1–0,3 mm 10 kg",
  "Basalt Gravel 2–4 mm 10 kg",
  "Dolomite Gravel 2–4 mm 10 kg",
  "H.E.L.P. Advanced Soil Plants 8 L",
  "Aqua Decoris Flora 1,5 kg",
]) {
  assert.equal(aquaelCareCategory(model), "substrate", `Aquael ${model} taban malzemesi kategorisinde bulunmalı`);
}
for (const model of [
  "ActiGran 1000 ml",
  "SpiruTabs 250 ml",
  "Vegetal 11 L",
  "Betta 100 ml",
  "GoldVit 11 L",
  "CichlidGran 1000 ml",
  "CrusTabs 10 g",
  "DiscusVit 1000 ml",
]) {
  assert.equal(aquaelCareCategory(model), "food", `Aquael ${model} yem kategorisinde bulunmalı`);
}
assert.equal(aquaelCareCategory("Acti Clean 250 ml"), "water_conditioner", "Aquael Acti Clean su düzenleyici kategorisinde bulunmalı");
assert.equal(aquaelCareCategory("Acti Bactol 250 ml"), "bacteria", "Aquael Acti Bactol bakteri kültürü kategorisinde bulunmalı");
for (const model of [
  "Shrimp Wood Mix 25 kg",
  "Lava Red Mix 10 kg",
  "Plastic Plant PR-203 7 cm",
  "Plastic Plant PR-203 20 cm",
  "Driftwood Mix Pack 8–10 kg",
  "Black Quartz Rock Stone Mix 20 kg",
]) {
  assert.equal(aquaelCareCategory(model), "decoration", `Aquael ${model} dekorasyon kategorisinde bulunmalı`);
}
assert.equal(careCategoryLabels.decoration, "Dekorasyon", "Ürün kataloğu dekorasyon için ayrı ve anlaşılır filtre göstermeli");
assert.equal(careCategoryLabels.aquarium_set, "Akvaryum seti", "Tam akvaryum setleri ürün kataloğunda ayrı filtrelenmeli");
assert.equal(careCategoryLabels.aquaterrarium, "Aquaterrarium", "Su-kara habitatları akvaryum setlerinden ayrı filtrelenmeli");
assert.equal(careCategoryLabels.terrarium, "Terrarium", "Kara bitki habitatları akvaryum setlerinden ayrı filtrelenmeli");
assert.equal(careCategoryLabels.tank, "Boş akvaryum", "Boş cam akvaryumlar setlerden ayrı filtrelenmeli");
assert.equal(careCategoryLabels.cover, "Akvaryum kapağı", "Akvaryum kapakları ayrı filtrelenmeli");
assert.equal(careCategoryLabels.cabinet, "Akvaryum dolabı", "Akvaryum dolapları ayrı filtrelenmeli");
const aquaelNeoSet240 = aquaelCare.find((entry) => entry.model === "Neo Set 240");
assert.deepEqual([aquaelNeoSet240?.category, aquaelNeoSet240?.volumeL, aquaelNeoSet240?.dimensionsCm], ["aquarium_set",240,[121,41,56]], "Neo Set 240 resmî hacim ve ölçülerini taşımalı");
assert(aquaelNeoSet240?.includedEquipmentModels?.includes("Neo Bio 1000"), "Neo Set 240 içindeki doğrulanmış filtre modeli saklanmalı");
for (const [model,volume,dimensions,equipment] of [
  ["Shrimp Set Day&Night 20 White",19,[25,25,30],"Turbo Mini"],
  ["Fish & Shrimp Set Duo 35 Day&Night Black",49,[35,35,40],"FZN Versa Pro 700"],
  ["Opti Set 130 Grey",130,[60.9,40.9,60.5],"Leddy Tube Sunny Day&Night 2.0 × 2"],
  ["Leddy XL Day&Night 60",72,[60,30,40],"ASAP 300"],
  ["UltraScape Set 90 Forest",243,[90,60,45],"Leddy Tube Plant 14 W × 2"],
  ["OptiBent Set 70 White",68,[39,39,45],"Ultra Heater 75 W"],
  ["Opti Set 240 Grey",240,[121,41,56],"Leddy Tube Sunny Day&Night 17 W × 2"],
  ["Hexa Set II 60L Black LT",60,[41,41,60],"Built-in Filter 350 L/h"],
  ["NanoReef Duo 35 White",49,[35,35,40],"FZN 3"],
  ["Leddy Day&Night 75 White",105,[75,35,40],"ASAP 500"],
  ["Leddy Plus Day&Night 60 Black",54,[60,30,30],"Platinium Heater 50 W"],
  ["Leddy Mini Creative Set 30 White",12.6,[28,15,30],"Turbo Mini"],
  ["Glossy ST Cube Grey",135,[50,50,63],"Leddy Tube Sunny Day&Night 10 W × 2"],
  ["Glossy Marine Standard",170,[60,58,50],"Protein Skimmer"],
  ["Glossy Marine Optimum",170,[60,58,50],"Leddy Slim BT 18 W × 2"],
]) {
  const item = aquaelCare.find((entry) => entry.model === model);
  assert.deepEqual([item?.category,item?.volumeL,item?.dimensionsCm], ["aquarium_set",volume,dimensions], `Aquael ${model} resmî hacim ve ölçülerini taşımalı`);
  assert(item?.includedEquipmentModels?.includes(equipment), `Aquael ${model} içindeki doğrulanmış ekipmanı saklamalı`);
}
const aquaelRectangular150 = aquaelCare.find((entry) => entry.model === "Glass Aquarium Rectangular 150");
assert.deepEqual([aquaelRectangular150?.category, aquaelRectangular150?.volumeL, aquaelRectangular150?.dimensionsCm], ["tank",375,[150,50,50]], "150 cm dik cam akvaryum resmî hacim ve ölçülerini taşımalı");
for (const [model,volume,dimensions] of [
  ["Opti Tank 100",200,[100,40,50]],
  ["Opti Tank Rounded 20 White",19,[25,25,30]],
  ["Opti Tank Rounded 70 Black",68,[39,39,45]],
]) {
  const item = aquaelCare.find((entry) => entry.model === model);
  assert.deepEqual([item?.category,item?.volumeL,item?.dimensionsCm], ["tank",volume,dimensions], `Aquael ${model} resmî hacim ve ölçülerini taşımalı`);
}
const aquaelGlassBowl45 = aquaelCare.find((entry) => entry.model === "Glass Bowl 45");
assert.deepEqual([aquaelGlassBowl45?.category,aquaelGlassBowl45?.volumeL,aquaelGlassBowl45?.dimensionsCm], ["tank",45,undefined], "Glass Bowl 45 yalnız kaynakta yayımlanan hacmi taşımalı, ölçü uydurmamalı");
for (const entry of aquaelCare.filter((item) => item.category === "aquarium_set" || item.category === "tank")) {
  assert.equal(entry.verifiedAt, "2026-09-12", `Aquael ${entry.model} güncel yapısal ürün doğrulama tarihini taşımalı`);
  assert(entry.volumeL > 0, `Aquael ${entry.model} kaynaklı pozitif hacim taşımalı`);
  if (!entry.model.startsWith("Glass Bowl")) assert(entry.dimensionsCm?.every((value) => value > 0), `Aquael ${entry.model} kaynaklı üç boyut taşımalı`);
}
const aquaelLeddyCover = aquaelCare.find((entry) => entry.model === "Leddy Cover Rectangular 40 Black");
assert.deepEqual([aquaelLeddyCover?.category,aquaelLeddyCover?.footprintCm], ["cover",[41,25]], "Leddy 40 siyah kapak resmî taban ölçüsünü taşımalı");
const aquaelOptiCabinet = aquaelCare.find((entry) => entry.model === "Opti Set Cabinet 125 Grey");
assert.deepEqual([aquaelOptiCabinet?.category,aquaelOptiCabinet?.dimensionsCm], ["cabinet",[81.5,36,80]], "Opti Set 125 gri dolap resmî üç boyutunu taşımalı");
const aquaelBettaKit = aquaelCare.find((entry) => entry.model === "Betta Kit");
assert.deepEqual([aquaelBettaKit?.category,aquaelBettaKit?.volumeL,aquaelBettaKit?.dimensionsCm], ["aquarium_set",3,[23.7,15.4,17.3]], "Betta Kit resmî hacim ve ölçülerini taşımalı");
const aquaelGlossyMarineCabinet = aquaelCare.find((entry) => entry.model === "Glossy Marine Cabinet");
assert.deepEqual([aquaelGlossyMarineCabinet?.category,aquaelGlossyMarineCabinet?.dimensionsCm], ["cabinet",[60,60,87]], "Glossy Marine dolabı resmî üç boyutunu taşımalı");
const aquaelAquaterrarium60 = aquaelCare.find((entry) => entry.model === "AquaTerrarium 60");
assert.deepEqual([aquaelAquaterrarium60?.category,aquaelAquaterrarium60?.dimensionsCm,aquaelAquaterrarium60?.includedEquipmentModels], ["aquaterrarium",[60,30,20.5],undefined], "AquaTerrarium 60 resmî ölçüyü taşımalı ve kaynakta bulunmayan filtreyi içermemeli");
const aquaelAquaterrarium100 = aquaelCare.find((entry) => entry.model === "AquaTerrarium 100");
assert.deepEqual([aquaelAquaterrarium100?.category,aquaelAquaterrarium100?.dimensionsCm,aquaelAquaterrarium100?.includedEquipmentModels], ["aquaterrarium",[100,40,35.5],["Filter 500 L/h"]], "AquaTerrarium 100 resmî ölçüyü ve 500 L/saat filtreyi taşımalı");
const aquaelSelvaMini = aquaelCare.find((entry) => entry.model === "Selva Mini Terrarium");
assert.deepEqual([aquaelSelvaMini?.category,aquaelSelvaMini?.dimensionsCm], ["terrarium",[20,20,30]], "Selva Mini yanlış akvaryum kategorisine girmeden resmî ölçülerini taşımalı");
for (const [model,dimensions] of [
  ["UltraScape Cabinet 90 Forest",[90,45,80]],
  ["Glossy ST Cube Grey Cabinet",[50,50,90]],
  ["Hexa 60 Cabinet",[45,45,73]],
  ["Fish & Shrimp Set Duo Cabinet White",[35,35,90]],
]) {
  const item = aquaelCare.find((entry) => entry.model === model);
  assert.deepEqual([item?.category,item?.dimensionsCm], ["cabinet",dimensions], `Aquael ${model} resmî dolap ölçülerini taşımalı`);
}
assert.equal(aquaelCare.filter((entry) => entry.model === "Betta 100 ml").length, 1, "Aynı hacimde yalnız dil etiketi değişen Aquael Betta SKU'ları kullanıcıya yinelenmemeli");

const chihiros = equipmentCatalog.filter((item) => item.brand === "Chihiros");
assert.equal(chihiros.length, 289, "Chihiros katalog paketi 289 doğrulanmış ekipman kaydını korumalı");
for (const model of [
  "CO₂ Regulator Pro Limited Edition",
  "CO₂ Regulator Mate",
  "CO₂ Regulator Pro — W21.8",
  "CO₂ Regulator Pro — CGA320",
  "CO₂ Regulator — G5/8 / With Solenoid",
  "Mini CO₂ Regulator Whole Set without CO₂ Cartridge",
  "CO₂ Generator Kit 2.5 L",
  "External CO₂ Diffuser XL — 19/25 mm",
  "CO₂ Diffuser Mate",
  "Magnetic Light",
  "Fish Feeder",
  "Fish Feeder L",
  "Clean Hose 3 m — 9/12 mm",
  "Clean Hose 3 m — 12/16 mm",
  "Clean Hose 3 m — 16/22 mm",
  "LED Lights Small Hanging Stand Kit",
  "Nova 1 PCB Module",
  "WRGB I Connection Cable",
  "Doctor Power Supply",
  "Dosing Pump System Connect Tube",
  "Magnetic Light 2",
  "ECO Ping Light",
  "Magnetic Light Base",
  "Magnetic Light Base S",
  "Magnetic Light Base L",
  "CO₂ U Clip M — 8 mm",
  "CO₂ U Clip L — 12 mm",
  "VIVID 2 Mini Cooling Fan",
  "Magnet Cleaner Mini",
  "Magnet Cleaner Nano",
  "RGB VIVID Mini Hanging Rope Kit",
  "A II Hanging Rope Kit",
  "RGB VIVID II Lamp Panel",
  "WRGB II Slim Series Lamp Panel",
  "WRGB II Series Lamp Panel",
  "RGB VIVID II / Mini Bluetooth Module",
  "RGB VIVID II / Mini PCB Module",
  "Hanging Stand for VIVID / WRGB",
  "WRGB II Acrylic Stand",
  "C II RGB Shade with Mirror",
  "LED Hanging Kit",
  "A Series LED Leg Bracket Kit",
  "NOVA Stand",
  "RGB VIVID II Mini Mount Shade",
  "A II Series Lamp Panel",
  "A II Series Diamond Stand Holder",
  "WRGB II Pro Holder",
  "RGB VIVID II Mini Lamp Panel",
  "RGB VIVID II 10th Edition Lamp Panel",
  "RGB VIVID II 10th Edition PCB Module",
  "RGB VIVID II 10th Edition Bluetooth Module",
  "Z Light Tiny Standard",
  "Z Light Tiny Diving",
  "Z Light Tiny Extend Arm",
  "Z Light Tiny L Clip",
  "RGB VIVID II Mini Pendant Shade",
  "Dosing Tube Holder X",
  "Cooling Fan — Manual Edition",
  "Cooling Fan — Bluetooth Edition",
  "WiFi Hub Pro",
  "WiFi Hub Pro Dedicated Stand",
  "WiFi Hub Pro Desktop Stand",
  "WiFi Hub Pro with Dedicated Stand",
  "WiFi Hub Pro with Desktop Stand",
  "Filter Hose Pro 3 m — 9/12 mm",
  "Filter Hose Pro 3 m — 16/21 mm",
  "Filter Hose Pro 3 m — 19/25 mm",
  "Double Tap Quick Connector — 12/16 mm",
  "Pro-Brush Soft 15 cm",
  "Pro-Brush Soft 23 cm",
  "Pro-Brush Hard 15 cm",
  "Magnetic Stirrers",
  "Smart Power Strip — EU Plug",
  "Doctor 5",
  "Dosing Flow Adapter — 12/16 mm",
  "Dosing Flow Adapter — 16/22 mm",
  "Sand Flattener",
  "Extendable 3D Net S",
  "Extendable 3D Net L",
  "Double-Sided Tank Cleaning Cloth",
  "Adjustable Holder for A II Series Lights",
  "Scissors Pro Straight 17 cm",
  "Scissors Pro Wavy 28 cm",
  "Scissors Spring Pro",
  "Straight Tweezers Max 30 cm",
  "Straight Tweezers Pro 27 cm",
]) {
  assert.ok(chihiros.some((item) => item.model === model), `Chihiros CO₂ kataloğunda ${model} bulunmalı`);
}
for (const model of [
  "Clean Hose 3 m — 9/12 mm",
  "Clean Hose 3 m — 12/16 mm",
  "Clean Hose 3 m — 16/22 mm",
  "LED Lights Small Hanging Stand Kit",
  "Nova 1 PCB Module",
  "WRGB I Connection Cable",
  "Doctor Power Supply",
  "Dosing Pump System Connect Tube",
]) {
  assert.equal(chihiros.find((item) => item.model === model)?.passiveComponent, true, `${model} ana cihaz kapasitesine karışmamalı`);
}
for (const model of [
  "Glass Air Aquarium Tank",
  "Magnetic Light Terrarium Set — Glass Air",
  "Magnetic Light Terrarium Set — Glass Pot",
  "Tiny Terrarium Egg",
  "Aqua Soil",
  "ECO Ping",
  "Glass Pot for Plant",
  "Glass Pot Dew S",
  "Glass Pot Dew L",
  "Glass Pot Dew Shaped",
  "Aquarium Acrylic UV Print POD",
]) {
  assert.ok(careProductCatalog.some((item) => item.brand === "Chihiros" && item.model === model), `Chihiros ürün kataloğunda ${model} bulunmalı`);
}
for (const item of chihiros.filter((entry) => entry.model.includes("Manifold Block") || entry.model.includes("Diffuser"))) {
  assert.equal(item.passiveComponent, true, `${item.model} bağımsız CO₂ kaynağı veya kapasite cihazı gibi davranmamalı`);
}
for (const item of chihiros.filter((entry) => entry.model.includes("Lamp Panel") || entry.model.includes("Bluetooth Module") || entry.model.includes("PCB Module") || entry.model.includes("Hanging Rope") || entry.model.includes("Holder"))) {
  assert.equal(item.passiveComponent, true, `${item.model} ana aydınlatma veya kapasite cihazı gibi davranmamalı`);
  assert.equal(item.powerW, undefined, `${item.model} için yayımlanmayan güç değeri tahmin edilmemeli`);
}
for (const model of ["Z Light Tiny Standard","Z Light Tiny Diving"]) {
  const item = chihiros.find((entry) => entry.model === model);
  assert.deepEqual([item?.category,item?.powerW], ["lighting",6], `${model} resmî 6 W değerini taşımalı`);
  assert.match(item?.specifications ?? "", /400 lm · 2800–8000 K · 15–60°/, `${model} resmî ışık ve açı verilerini taşımalı`);
}
const chihirosVividMini = chihiros.find((entry) => entry.model === "RGB VIVID II Mini");
assert.deepEqual([chihirosVividMini?.category,chihirosVividMini?.powerW], ["lighting",75], "RGB VIVID II Mini resmî 75 W değerini taşımalı");
assert.match(chihirosVividMini?.specifications ?? "", /5000 lm · Mount ve Pendant/, "RGB VIVID II Mini resmî lümen ve iki montaj seçeneğini açıklamalı");
for (const model of ["Cooling Fan — Manual Edition","Cooling Fan — Bluetooth Edition"]) {
  const item = chihiros.find((entry) => entry.model === model);
  assert.deepEqual([item?.category,item?.powerW,item?.passiveComponent], ["other",2.8,undefined], `${model} resmî nominal gücüyle aktif cihaz olmalı`);
  assert.match(item?.specifications ?? "", /3800 RPM.*IP55.*5–20 mm.*2–4 °C/, `${model} resmî motor, koruma, cam ve soğutma verilerini taşımalı`);
}
for (const model of ["WiFi Hub Pro Dedicated Stand","WiFi Hub Pro Desktop Stand","Filter Hose Pro 3 m — 9/12 mm","Filter Hose Pro 3 m — 16/21 mm","Filter Hose Pro 3 m — 19/25 mm","Double Tap Quick Connector — 12/16 mm","Pro-Brush Soft 15 cm","Pro-Brush Soft 23 cm","Pro-Brush Hard 15 cm"]) {
  const item = chihiros.find((entry) => entry.model === model);
  assert.equal(item?.passiveComponent, true, `${model} bağımsız kapasite cihazı gibi davranmamalı`);
  assert.equal(item?.powerW, undefined, `${model} için güç değeri uydurulmamalı`);
}
const chihirosWifiHubPro = chihiros.find((entry) => entry.model === "WiFi Hub Pro");
assert.match(chihirosWifiHubPro?.specifications ?? "", /20 Bluetooth.*2,4\/5 GHz/, "WiFi Hub Pro resmî bağlantı sınırlarını taşımalı");
const chihirosFilterHosePro1612 = chihiros.find((entry) => entry.model === "Filter Hose Pro 3 m — 16/21 mm");
assert.match(chihirosFilterHosePro1612?.specifications ?? "", /16 mm iç \/ 21 mm dış.*17 mm jet/, "Filter Hose Pro 16/21 resmî teknik tablo değerlerini taşımalı");
for (const model of ["Filter Hose Pro 3 m — 9/12 mm","Filter Hose Pro 3 m — 19/25 mm"]) {
  assert.match(chihiros.find((entry) => entry.model === model)?.specifications ?? "", /tahmin edilmedi/, `${model} çelişkili teknik tablo nedeniyle türetilmiş çap ayrıntısı taşımamalı`);
}
const chihirosSmartPowerStrip = chihiros.find((entry) => entry.model === "Smart Power Strip — EU Plug");
assert.equal(chihirosSmartPowerStrip?.powerW, undefined, "Smart Power Strip azami anahtarlama yükü cihaz tüketimi gibi işlenmemeli");
assert.match(chihirosSmartPowerStrip?.specifications ?? "", /dört bağımsız priz.*toplam 30 W.*3000 W/, "Smart Power Strip resmî çıkış ve yük verilerini taşımalı");
for (const model of ["Dosing Flow Adapter — 12/16 mm","Dosing Flow Adapter — 16/22 mm","Sand Flattener","Extendable 3D Net S","Extendable 3D Net L","Double-Sided Tank Cleaning Cloth","Adjustable Holder for A II Series Lights","Scissors Pro Straight 17 cm","Scissors Pro Wavy 28 cm","Scissors Spring Pro","Straight Tweezers Max 30 cm","Straight Tweezers Pro 27 cm"]) {
  const item = chihiros.find((entry) => entry.model === model);
  assert.equal(item?.passiveComponent, true, `${model} aktif cihaz veya kapasite ekipmanı gibi davranmamalı`);
  assert.equal(item?.powerW, undefined, `${model} için güç değeri uydurulmamalı`);
}
const chihirosDoctor5 = chihiros.find((entry) => entry.model === "Doctor 5");
assert.equal(chihirosDoctor5?.category, "other", "Doctor 5 filtre veya UV kapasitesine karışmamalı");
assert.match(chihirosDoctor5?.specifications ?? "", /Plants, Fishes ve Shrimps.*sıcaklık/, "Doctor 5 yalnız resmî olarak doğrulanan mod ve gösterge bilgisini taşımalı");
assert.equal(chihirosDoctor5?.recommendedMaxL, undefined, "Doctor 5 için yayımlanmayan akvaryum kapasitesi tahmin edilmemeli");
for (const model of ["WRGB II Pro 60", "WRGB II Pro 120", "Dosing Pump System (4 Head)", "Dosing Pump Mate (2 Head)", "Heater Pro 12/16 mm (EU)", "Heater Pro 16/22 mm (EU)", "Doctor Mate", "Digital TDS / Temperature Tester Pen", "CO₂ Spiral Bubble Counter", "Nano CO₂ Diffuser", "CO₂ Drop Checker"]) {
  assert(chihiros.some((item) => item.model === model), `Chihiros ${model} güncel ürün ailesinde bulunduğu için katalogda yer almalı`);
}
for (const model of ["A II Max 301", "A II Max 451", "A II Max 601", "A II Max 801", "A II Max 901", "A II Max 1201"]) {
  const item = chihiros.find((entry) => entry.model === model);
  assert.equal(item?.sourceUrl, "https://www.chihirosaquaticstudio.com/products/chihiros-a-ii-max-led-light", `Chihiros ${model} resmî model seçeneğine bağlanmalı`);
  assert.equal(item?.powerW, undefined, `Chihiros ${model} için resmî sayfada yayımlanmayan güç değeri tahmin edilmemeli`);
}
for (const [model,powerW] of [["30x30",4.7],["35x30",5.6],["45x30",7.5],["50x35",9.9],["60x36",12.8],["60x45",12.8],["90x45",19.6]]) {
  const item = chihiros.find((entry) => entry.model === `White LED Background ${model} cm`);
  assert.deepEqual([item?.category,item?.powerW], ["lighting",powerW], `Chihiros White LED Background ${model} resmî güç değerini taşımalı`);
  assert(item?.sourceUrl.includes("chihiros-white-led-background-lightscreen"), `Chihiros White LED Background ${model} doğrudan ürün kaynağına bağlanmalı`);
}
for (const model of ["Metal Inflow Outflow Pro M Pro", "Metal Inflow Outflow Pro L Pro", "Metal Inflow Outflow Set S", "Metal Inflow Outflow Set M", "Metal Inflow Outflow Set L", "Metal Inflow Outflow Set ML", "Lily Type Glass Outflow M — 12/16 mm", "Lily Type Glass Outflow L — 16/22 mm", "Poppy Type Glass Outflow M — 12/16 mm", "Poppy Type Glass Outflow L — 16/22 mm", "U Type Glass Inflow M — 12/16 mm", "U Type Glass Inflow L — 16/22 mm", "Spiral Type Skimmer Glass Inflow M — 12/16 mm", "Spiral Type Skimmer Glass Inflow L — 16/22 mm"]) {
  const item = chihiros.find((entry) => entry.model === model);
  assert.deepEqual([item?.category,item?.passiveComponent,item?.ratedFlowLph], ["other",true,undefined], `Chihiros ${model} pasif hat aksesuarı olarak kalmalı`);
  assert(item?.sourceUrl.includes("bbs.chihirosaquaticstudio.com/threads/chihiros-inflow-outflow"), `Chihiros ${model} resmî ürün duyurusuna bağlanmalı`);
}
for (const model of ["Doctor Mesh Reactor Replacement — Doctor Mate", "B Series Shades with Mirror — B 20", "B Series Shades with Mirror — B 30", "B Series Shades with Mirror — B 60", "B Series Shades with Mirror — B 80", "B Series Shades with Mirror — B 90", "B Series Shades with Mirror — B 120", "Wabi Kusa Hanger (3 pcs)", "C II Base Stand", "C II RGB Base Stand", "WRGB II / 10th Edition Hanging Rope Kit", "WRGB II Slim Hanging Rope Kit", "WRGB II Pro Non-adjustable Metal Stand", "A II Max Acrylic Stand", "A II Max Hanging Rope Kit", "WRGB II Pro Shades with Mirror — 30 cm", "WRGB II Pro Shades with Mirror — 40 cm", "RGB VIVID II / VIVID 2 Mate Shades with Mirror — Black", "RGB VIVID II / VIVID 2 Mate Shades with Mirror — Silver", "WRGB II / WRGB II Slim Shades with Mirror — 30 cm"]) {
  const item = chihiros.find((entry) => entry.model === model);
  assert.deepEqual([item?.category,item?.passiveComponent,item?.powerW], ["other",true,undefined], `Chihiros ${model} pasif aksesuar olarak kalmalı`);
  assert(item?.sourceUrl.startsWith("https://www.chihirosaquaticstudio.com/products/"), `Chihiros ${model} doğrudan resmî ürün sayfasına bağlanmalı`);
}
const chihirosLedPanelReplacements = chihiros.filter((entry) => entry.model.startsWith("LED Panel Replacement — "));
assert.equal(chihirosLedPanelReplacements.length, 34, "Chihiros resmî LED panel yedek parçası 34 uyumlu model seçeneğini korumalı");
assert(chihirosLedPanelReplacements.every((entry) => entry.category === "other" && entry.passiveComponent === true && entry.powerW === undefined), "Chihiros LED panel yedekleri ana aydınlatma gücüne karışmamalı");
assert(chihirosLedPanelReplacements.every((entry) => entry.sourceUrl.endsWith("/chihiros-led-beads-panel-aluminum-substrate-replacement")), "Chihiros LED panel yedeklerinin tamamı doğrudan resmî ürün sayfasına bağlanmalı");
for (const compatibleModel of ["WRGB II 30 (Discontinued)", "WRGB II 120 10th Edition", "WRGB II Slim 90", "WRGB II Pro 80", "RGB VIVID II Mini", "A II 351 (Discontinued)", "A II 1201"]) {
  assert(chihirosLedPanelReplacements.some((entry) => entry.model === `LED Panel Replacement — ${compatibleModel}`), `Chihiros ${compatibleModel} LED panel seçeneği katalogda bulunmalı`);
}
for (const model of ["A II 351 (Discontinued)", "A II 361 (Discontinued)", "A II 451 (Discontinued)", "A II 501", "A II 1201", "B 60"]) {
  const item = chihiros.find((entry) => entry.model === model);
  assert.equal(item?.category, "lighting", `Chihiros ${model} resmî model uyumluluk kaydıyla aydınlatma kataloğunda bulunmalı`);
  assert(item?.additionalSourceUrls?.some((url) => url.startsWith("https://www.chihirosaquaticstudio.com/products/")), `Chihiros ${model} ikinci resmî doğrulama bağlantısını taşımalı`);
  assert.equal(item?.powerW, undefined, `Chihiros ${model} için model bazında yayımlanmayan güç değeri tahmin edilmemeli`);
}
const chihirosPowerSupplies = chihiros.filter((entry) => entry.model.startsWith("Power Supply "));
assert.equal(chihirosPowerSupplies.length, 24, "Chihiros güç kaynakları 12 elektriksel konfigürasyonun Standard ve Waterproof seçeneklerini taşımalı");
assert(chihirosPowerSupplies.every((entry) => entry.category === "other" && entry.passiveComponent === true && entry.powerW === undefined), "Chihiros yedek güç kaynakları ana cihaz tüketimi gibi değerlendirilmemeli");
for (const model of ["Power Supply 12V 1A — Standard", "Power Supply 12V 5A — Waterproof", "Power Supply 36V 0.8A — Standard", "Power Supply 36V 5.5A — Waterproof"]) {
  const item = chihirosPowerSupplies.find((entry) => entry.model === model);
  assert(item?.sourceUrl.endsWith("/chihiros-power-supply-replacement"), `Chihiros ${model} doğrudan resmî ürün sayfasına bağlanmalı`);
  assert.match(item?.specifications ?? "", /EU, UK, US ve AU/, `Chihiros ${model} ülkeye göre priz seçeneklerini tek üründe açıklamalı`);
}
for (const [model,powerW,lumen] of [["C201",7,750],["C251",10,1150],["C301",14,1500],["C361",18,1850]]) {
  const item = chihiros.find((entry) => entry.model === model);
  assert.deepEqual([item?.category,item?.powerW], ["lighting",powerW], `Chihiros ${model} resmî güç değerini taşımalı`);
  assert.match(item?.specifications ?? "", new RegExp(`${lumen} lm`), `Chihiros ${model} resmî lümen değerini taşımalı`);
  assert(item?.sourceUrl.startsWith("https://www.chihirosaquaticstudio.com/products/chihiros-c"), `Chihiros ${model} doğrudan resmî arşiv ürününe bağlanmalı`);
}
const chihirosNova1 = chihiros.find((entry) => entry.model === "Nova 1");
assert.deepEqual([chihirosNova1?.category,chihirosNova1?.powerW,chihirosNova1?.recommendedTankLengthCm], ["lighting",126,[45,60]], "Chihiros Nova 1 resmî 126 W ve 45–60 cm verilerini taşımalı");
assert.match(chihirosNova1?.specifications ?? "", /3800 lm · 61 LED/, "Chihiros Nova 1 resmî ışık akısı ve LED sayısını taşımalı");
assert(chihirosNova1?.sourceUrl.includes("chihirosaquaticstudio.com/blogs/"), "Chihiros Nova 1 resmî üretici yazısına bağlanmalı");
const chihirosArchivedTools = chihiros.filter((entry) => ["Wavy Scissor 21 cm", "Curved Tweezer 33 cm", "Curved Tweezer 25 cm", "Straight Tweezer 33 cm", "Straight Tweezer 25 cm", "Algae Scraper 65 cm", "Curved Scissor 21 cm", "Straight Scissor 21 cm", "Pipe Brush One Head 60 cm", "Pipe Brush Two Heads 155 cm", "Stainless Steel Tool Holder 24 cm", "Magnet Cleaner Mini", "Magnet Cleaner Nano", "Garden Mat"].includes(entry.model));
assert.equal(chihirosArchivedTools.length, 14, "Chihiros resmî arşivindeki bakım araçları ve iki gerçek mıknatıslı temizleyici seçeneği katalogda bulunmalı");
assert(chihirosArchivedTools.every((entry) => entry.category === "other" && entry.passiveComponent === true), "Chihiros bakım araçları cihaz kapasitesine karışmamalı");
for (const model of ["Commander 1 Bluetooth Controller", "Manual Dimmer", "Wi-Fi Hub", "CO₂ Regulator Solenoid Controller"]) {
  const item = chihiros.find((entry) => entry.model === model);
  assert(item?.sourceUrl.startsWith("https://www.chihirosaquaticstudio.com/products/"), `Chihiros ${model} resmî ürün arşivine bağlanmalı`);
  assert.equal(item?.passiveComponent, true, `Chihiros ${model} bağımsız cihaz kapasitesi üretmemeli`);
}
for (const model of ["Doctor 4th Gen Nano (Bluetooth)", "Doctor 4th Gen 125L+ (Bluetooth)", "Doctor 4th Gen 125L+ (Touch Control)"]) {
  const item = chihiros.find((entry) => entry.model === model);
  assert.equal(item?.category, "other", `Chihiros ${model} filtre veya UV kapasitesi gibi değerlendirilmemeli`);
  assert(item?.sourceUrl.includes("chihiros-doctor-4th-gen"), `Chihiros ${model} doğrudan resmî arşiv ürününe bağlanmalı`);
}

const ista = equipmentCatalog.filter((item) => item.brand === "ISTA");
for (const model of ["I-675 CO₂ Aluminum Cylinder Supply Set 0,5 L", "I-676 CO₂ Aluminum Cylinder Supply Set 0,82 L", "I-677 CO₂ Aluminum Cylinder Supply Set 1 L", "I-592 Refillable CO₂ Cylinder 0,5 L", "I-597 Refillable CO₂ Cylinder 2 L", "I-518 Disposable CO₂ Cartridge 95 g", "I-683 Disposable CO₂ Cartridge 88 g", "I-528 Max Mix CO₂ Reactor Medium", "I-529 Max Mix CO₂ Reactor Large", "I-562 3 in 1 CO₂ Diffuser Small", "I-563 3 in 1 CO₂ Diffuser Large"]) {
  assert.equal(ista.find((item) => item.model === model)?.category, "co2", `ISTA ${model} CO₂ kategorisinde bulunmalı`);
}
for (const model of ["I-522 Surface Skimmer", "I-578 CO₂ Pipe Holder", "I-559 Cylinder Supporting Base", "I-546 Water Plant Clip", "I-545 Water Plant Scissors", "I-821 Vortex Water Flow Accelerator", "I-823 Vortex Water Flow Accelerator", "E-DD03 Water Plant Cultivation Ceramic", "E-DD06 Water Plant Cultivation Ceramic"]) {
  assert.equal(ista.find((item) => item.model === model)?.category, "other", `ISTA ${model} bağımsız filtre gibi değerlendirilmeden diğer ekipman kategorisinde bulunmalı`);
}
for (const model of ["I-145 Round Bio Foam Small", "I-146 Round Bio Foam Large", "I-149 Rectangle Bio Foam Small", "I-148 Rectangle Bio Foam Large"]) {
  const item = ista.find((entry) => entry.model === model);
  assert.deepEqual([item?.category, item?.requiresAirPump, item?.ratedFlowLph], ["filter", true, undefined], `ISTA ${model} hava motoruna bağlı ve bağımsız debisiz filtre olmalı`);
}
assert.equal(chihiros.find((item) => item.model === "Heater Pro 12/16 mm (EU)")?.recommendedMaxL, 650, "Chihiros Heater Pro resmî 650 L kapasite sınırını taşımalı");
assert.equal(chihiros.find((item) => item.model === "Dosing Pump System (4 Head)")?.category, "other", "Chihiros dozaj sistemi filtre veya ısıtıcı hesabına karışmamalı");
const chihirosVivid2Mate = chihiros.find((item) => item.id === "chihiros-rgb-vivid-2-mate");
assert.deepEqual([chihirosVivid2Mate?.powerW, chihirosVivid2Mate?.recommendedTankLengthCm], [125, [60, 90]], "Chihiros RGB VIVID 2 Mate resmî 125 W ve 60–90 cm değerlerini taşımalı");
assert(chihirosVivid2Mate?.sourceUrl.includes("bbs.chihirosaquaticstudio.com/threads/chihiros-rgb-vivid-2-mate"), "Chihiros RGB VIVID 2 Mate resmî ürün duyurusuna bağlanmalı");
const chihirosVivid3 = chihiros.find((item) => item.id === "chihiros-wrgb-vivid-3");
assert.deepEqual([chihirosVivid3?.powerW, chihirosVivid3?.recommendedTankLengthCm], [180, [60, 90]], "Chihiros WRGB VIVID 3 doğrulanmış 180 W ve 60–90 cm değerlerini taşımalı");
assert(chihirosVivid3?.sourceUrl.includes("chihiros.eu/chihiros-vivid-3"), "Chihiros WRGB VIVID 3 doğrudan ürün kaynağına bağlanmalı");

const co2Art = equipmentCatalog.filter((item) => item.brand === "CO2Art");
assert.equal(co2Art.length, 29, "CO2Art resmî güncel akvaryum portföyündeki 29 ürün ailesinin tamamını taşımalı");
const co2ArtCurrentIds = [
  "co2art-pro-se-v2", "co2art-pro-elite-v2", "co2art-pro-se-intank-system", "co2art-pro-se-inline-system",
  "co2art-flux-v2", "co2art-inline-atomizer", "co2art-io-diffuser", "co2art-io-stainless-diffuser",
  "co2art-pro-elite-intank-system", "co2art-pro-elite-inline-system", "co2art-pro-elite-manifold",
  "co2art-pro-elite-v2-manifold", "co2art-pro-series-adapter", "co2art-drop-checker-kit",
  "co2art-drop-checker-solution", "co2art-pu-tubing", "co2art-pro-check-valve", "co2art-pro-bubble-counter",
  "co2art-ss-bubble-counter", "co2art-ss-u-bend", "co2art-adapter-seals", "co2art-regulator-washers",
  "co2art-suction-cups", "co2art-disposable-adapter-repair-kit", "co2art-io-membrane",
  "co2art-solenoid-coil", "co2art-inline-membrane", "co2art-sodastream-adapter-repair-kit", "co2art-power-adapter",
];
for (const id of co2ArtCurrentIds) {
  const item = co2Art.find((entry) => entry.id === id);
  assert(item, `CO2Art güncel ürün kaydı eksik: ${id}`);
  assert(item.sourceUrl.startsWith("https://www.co2art.eu/products/"), `CO2Art ${id} doğrudan resmî ürün sayfasına bağlanmalı`);
  assert.equal(item.verifiedAt, "2026-08-27", `CO2Art ${id} güncel doğrulama tarihini taşımalı`);
}
for (const id of ["co2art-flux-v2", "co2art-inline-atomizer", "co2art-io-diffuser"]) {
  const item = co2Art.find((entry) => entry.id === id);
  assert(item?.sourceUrl.includes("co2art.eu/") && item.sourceUrl !== "https://www.co2art.eu/", `CO2Art ${id} genel ana sayfa yerine doğrudan ürün kaynağına bağlanmalı`);
}
assert.match(co2Art.find((item) => item.id === "co2art-flux-v2")?.specifications || "", /250 litre.*40 PSI/, "CO2Art Flux V2 hacim varyantlarını ve çalışma basıncını taşımalı");
assert.match(co2Art.find((item) => item.id === "co2art-inline-atomizer")?.specifications || "", /12\/16.*16\/22.*30 PSI/, "CO2Art inline atomizer hortum ölçülerini ve çalışma basıncını taşımalı");
assert.match(co2Art.find((item) => item.id === "co2art-io-diffuser")?.specifications || "", /150 litre.*2 bar/, "CO2Art IO Acrylic hacim varyantlarını ve başlangıç basıncını taşımalı");
assert.match(co2Art.find((item) => item.id === "co2art-pro-elite-v2")?.specifications || "", /5–5000 litre.*12 V.*5 bar/, "CO2Art Pro-Elite V2 doğrulanmış hacim, solenoid ve çalışma basıncı verilerini taşımalı");
assert.match(co2Art.find((item) => item.id === "co2art-regulator-washers")?.specifications || "", /PRO-SE.*PRO-Elite.*DIN477.*CGA320/, "CO2Art regülatör pulları iki seri ve bağlantı standartlarını belirtmeli");
assert.match(co2Art.find((item) => item.id === "co2art-io-membrane")?.specifications || "", /Stainless Steel.*Acrylic.*Small.*Large/, "CO2Art IO membranı uyumlu difüzörleri ve iki boyu belirtmeli");
assert.match(co2Art.find((item) => item.id === "co2art-inline-membrane")?.specifications || "", /12\/16.*16\/22/, "CO2Art inline membranı iki hortum ölçüsünü belirtmeli");
assert.match(co2Art.find((item) => item.id === "co2art-solenoid-coil")?.specifications || "", /12 V DC/, "CO2Art yedek solenoid bobini doğrulanmış 12 V DC değerini taşımalı");

const sunsun = equipmentCatalog.filter((item) => item.brand === "SunSun");
assert.equal(sunsun.length, 77, "SunSun doğrulanmış katalog kapsamı 77 ekipman kaydını taşımalı");
const sunsunTurkeyExtraIds = [
  "sunsun-16-22-outlet-set", "sunsun-16-22-inlet-set", "sunsun-502", "sunsun-503", "sunsun-604b",
  "sunsun-ad260", "sunsun-aco006", "sunsun-ad200", "sunsun-ya-4l-white", "sunsun-ya-4l-pink",
  "sunsun-ya-6l-white", "sunsun-ya-6l-pink", "sunsun-ad120", "sunsun-hjs312", "sunsun-hkl250",
  "sunsun-hw602-603-outlet-set", "sunsun-hw602-603-inlet-set", "sunsun-jf002", "sunsun-jp022f",
  "sunsun-jp025f", "sunsun-jp094", "sunsun-jvp102b", "sunsun-jvp102a", "sunsun-jvp201",
  "sunsun-jvp202a", "sunsun-jvp402", "sunsun-pg180", "sunsun-pg250",
];
for (const id of sunsunTurkeyExtraIds) {
  const item = sunsun.find((entry) => entry.id === id);
  assert(item, `SunSun Türkiye güncel ürün kaydı eksik: ${id}`);
  assert(item.sourceUrl.startsWith("https://"), `SunSun ${id} doğrulanabilir HTTPS kaynağına bağlanmalı`);
  assert.equal(item.verifiedAt, ["sunsun-502", "sunsun-503"].includes(id) ? "2026-08-29" : "2026-08-27", `SunSun ${id} güncel doğrulama tarihini taşımalı`);
}
const sunsun604b = sunsun.find((item) => item.id === "sunsun-604b");
assert.deepEqual([sunsun604b?.category, sunsun604b?.ratedFlowLph, sunsun604b?.powerW], ["filter", 800, 14], "SunSun 604B doğrulanmış 800 L/saat ve 14 W değerlerini taşımalı");
const sunsunJp025f = sunsun.find((item) => item.id === "sunsun-jp025f");
assert.deepEqual([sunsunJp025f?.ratedFlowLph, sunsunJp025f?.powerW, sunsunJp025f?.recommendedMinL, sunsunJp025f?.recommendedMaxL], [1600, 35, 120, 600], "SunSun JP-025F doğrulanmış debi, güç ve hacim aralığını taşımalı");
const sunsunAco006 = sunsun.find((item) => item.id === "sunsun-aco006");
assert.deepEqual([sunsunAco006?.category, sunsunAco006?.ratedFlowLph, sunsunAco006?.powerW], ["air_pump", 5100, 105], "SunSun ACO-006 birim dönüşümü doğrulanmış hava debisi ve güç değerini taşımalı");
assert.deepEqual([sunsun.find((item) => item.id === "sunsun-pg180")?.ratedFlowLph, sunsun.find((item) => item.id === "sunsun-pg250")?.ratedFlowLph], [26000, 35000], "SunSun blower modellerinin m³/saat değerleri L/saat olarak doğru dönüştürülmeli");
const sunsun502 = sunsun.find((entry) => entry.id === "sunsun-502");
assert.deepEqual([sunsun502?.ratedFlowLph, sunsun502?.powerW, sunsun502?.recommendedMaxL], [320, undefined, 60], "SunSun 502 ortak doğrulanan debi ve hacmi taşımalı, çelişkili güç seçilmemeli");
assert.equal(sunsun502?.additionalSourceUrls?.length, 2, "SunSun 502 çapraz doğrulama kaynaklarını taşımalı");
const sunsun503 = sunsun.find((entry) => entry.id === "sunsun-503");
assert.deepEqual([sunsun503?.ratedFlowLph, sunsun503?.powerW], [600, 6], "SunSun 503 güncel Türkiye ürününün doğrulanan debi ve güç değerlerini taşımalı");
assert.equal(sunsun503?.additionalSourceUrls?.length, 2, "SunSun 503 çapraz doğrulama kaynaklarını taşımalı");
for (const id of ["sunsun-jvp102a", "sunsun-jvp201"]) {
  assert.equal(sunsun.find((item) => item.id === id)?.category, "other", `SunSun ${id} dalga motoru filtrasyon hesabına karışmamalı`);
}

const dennerleEquipment = equipmentCatalog.filter((item) => item.brand === "Dennerle");
assert.equal(dennerleEquipment.length, 87, "Dennerle güncel teknik ekipman, CO₂ ve bakım aracı kapsamı 87 doğrulanmış kayıt taşımalı");
const dennerleCurrentIds = [
  "dennerle-daytime-onex-20-black", "dennerle-daytime-onex-30-black", "dennerle-daytime-onex-40-black",
  "dennerle-daytime-onex-60-black", "dennerle-daytime-onex-80-black", "dennerle-trocal-flat-35",
  "dennerle-trocal-led-power-supply-20", "dennerle-trocal-led-power-supply-50", "dennerle-trocal-led-power-supply-80",
  "dennerle-carbo-bio-style-120", "dennerle-carbo-soda-m200", "dennerle-carbo-night-flex400",
  "dennerle-carbo-start-flex200-special", "dennerle-carbo-regulator-start", "dennerle-carbo-regulator-power",
  "dennerle-carbo-regulator-night", "dennerle-carbo-cylinder-e-500", "dennerle-carbo-cylinder-e-1200",
  "dennerle-co2-refillable-cylinder-500", "dennerle-co2-refillable-cylinder-2000", "dennerle-co2-solenoid-valve",
  "dennerle-co2-diffuser-ultra-s", "dennerle-co2-diffuser-ultra-m", "dennerle-co2-diffuser-ultra-l",
  "dennerle-co2-micro-flipper", "dennerle-co2-mini-flipper", "dennerle-co2-flipper", "dennerle-co2-maxi-flipper",
  "dennerle-co2-nano-flipper", "dennerle-co2-bubble-counter-exact", "dennerle-co2-check-valve",
  "dennerle-co2-hose-2m", "dennerle-co2-hose-5m", "dennerle-carbo-bio-depot-60-80", "dennerle-carbo-bio-depot-120",
  "dennerle-osmose-professional-190", "dennerle-nano-thermometer", "dennerle-shake-and-flow",
  "dennerle-alginator", "dennerle-gravel-cleaner", "dennerle-cleanator", "dennerle-nano-gravel-cleaner",
  "dennerle-snail-catcher", "dennerle-scapers-tools-set", "dennerle-plant-tweezer-straight",
  "dennerle-plant-tweezer-curved", "dennerle-aquarium-care-set", "dennerle-shrimp-net-small",
  "dennerle-shrimp-net-large", "dennerle-corner-filter-module-40-60", "dennerle-corner-filter-baby-protect-100",
];
for (const id of dennerleCurrentIds) {
  const item = dennerleEquipment.find((entry) => entry.id === id);
  assert(item, `Dennerle güncel ekipman kaydı eksik: ${id}`);
  assert(item.sourceUrl.startsWith("https://dennerle.com/en/products/"), `Dennerle ${id} doğrudan resmî ürün sayfasına bağlanmalı`);
  assert.equal(item.verifiedAt, "2026-08-27", `Dennerle ${id} güncel doğrulama tarihini taşımalı`);
}
for (const id of [
  "dennerle-carbo-power-e400", "dennerle-carbo-power-e400-special-edition",
  "dennerle-carbo-power-flex400", "dennerle-carbo-power-flex400-special-edition",
  "dennerle-carbo-power-m400", "dennerle-carbo-power-m400-special-edition",
]) {
  assert.equal(dennerleEquipment.find((item) => item.id === id)?.recommendedMaxL, 400, `Dennerle ${id} 400 litre sistem kapasitesini taşımalı`);
}
const dennerleOnex20 = dennerleEquipment.find((item) => item.id === "dennerle-daytime-onex-20-black");
const dennerleOnex80 = dennerleEquipment.find((item) => item.id === "dennerle-daytime-onex-80-black");
assert.deepEqual([dennerleOnex20?.powerW, dennerleOnex20?.recommendedTankLengthCm], [4.8, [20, 30]], "Dennerle onex20 resmî güç ve akvaryum uzunluğunu taşımalı");
assert.deepEqual([dennerleOnex80?.powerW, dennerleOnex80?.recommendedTankLengthCm], [21.6, [74, 84]], "Dennerle onex80 resmî güç ve akvaryum uzunluğunu taşımalı");
assert.deepEqual(
  ["dennerle-co2-micro-flipper", "dennerle-co2-mini-flipper", "dennerle-co2-flipper", "dennerle-co2-maxi-flipper"].map((id) => dennerleEquipment.find((item) => item.id === id)?.recommendedMaxL),
  [60, 200, 300, 600],
  "Dennerle CO₂ Flipper ailesi resmî akvaryum hacmi sırasını taşımalı",
);
const sharkFourRow23 = equipmentCatalog.find((item) => item.id === "shark-fs-23-4row");
assert.equal(sharkFourRow23?.category, "lighting", "Shark ayrı ölçülü armatür modelleri aydınlatma kategorisinde bulunmalı");
assert.deepEqual(sharkFourRow23?.recommendedTankLengthCm, [30, 35], "Shark 23 cm armatürün doğrulanmış akvaryum uyumu korunmalı");

const dophinHSeries = [
  ["H80", 190, 2.7, 25],
  ["H100", 350, 3.4, 50],
  ["H200", 370, 3.4, 75],
  ["H300", 440, 5.2, 100],
  ["H500", 580, 6.2, 150],
  ["H800", 1000, 8.1, 200],
];
for (const [model, flow, power, maxL] of dophinHSeries) {
  const item = equipmentCatalog.find((entry) => entry.brand === "Dophin" && entry.model === model);
  assert.deepEqual([item?.category, item?.ratedFlowLph, item?.powerW, item?.recommendedMaxL], ["filter", flow, power, maxL], `Dophin ${model} resmî 230 V / 50 Hz seri verilerini taşımalı`);
  assert(item?.sourceUrl.includes("qimeigroup.com/Products_detail/dophin-aquarium-slim-hanging-filter-h80"), `Dophin ${model} altı varyantı kapsayan resmî H serisi tablosuna bağlanmalı`);
}
for (const [model, flow, power, minL, maxL] of [["C-500", 1130, 12.4, 100, 160], ["C-700", 1520, 13.4, 120, 200], ["C-1000", 1650, 16.8, 140, 230], ["C-1300", 2300, 24.6, 170, 280], ["C-1600", 2540, 27.5, 190, 310]]) {
  const item = equipmentCatalog.find((entry) => entry.brand === "Dophin" && entry.model === model);
  assert.deepEqual([item?.ratedFlowLph, item?.powerW, item?.recommendedMinL, item?.recommendedMaxL, item?.adjustableFlow], [flow, power, minL, maxL, true], `Dophin ${model} resmî 230 V / 50 Hz dış filtre profilini taşımalı`);
  assert(item?.sourceUrl.includes("dophin-aquarium-external-canister-filter-c500"), `Dophin ${model} resmî C serisi tablosuna bağlanmalı`);
}
for (const [model, flow, basePower, uvPower, uvW, minL, maxL] of [["688", 800, 10, 20, 5, 110, 190], ["888", 1000, 10, 21.5, 7, 120, 200], ["1288", 1200, 13.2, 25.5, 9, 130, 210], ["1488", 1400, 17, 29.3, 9, 140, 230]]) {
  const base = equipmentCatalog.find((entry) => entry.brand === "Dophin" && entry.model === `CF${model}`);
  const uv = equipmentCatalog.find((entry) => entry.brand === "Dophin" && entry.model === `CF${model}UV`);
  assert.deepEqual([base?.ratedFlowLph, base?.powerW, base?.recommendedMinL, base?.recommendedMaxL], [flow, basePower, minL, maxL], `Dophin CF${model} standart dış filtre profilini taşımalı`);
  assert.deepEqual([uv?.ratedFlowLph, uv?.powerW, uv?.integratedUvcW, uv?.recommendedMinL, uv?.recommendedMaxL], [flow, uvPower, uvW, minL, maxL], `Dophin CF${model}UV entegre UV-C profilini taşımalı`);
  assert(base?.category === "filter" && uv?.category === "filter", `Dophin CF${model} ailesi filtrasyon kapasitesine katılmalı`);
}
for (const [model, flow, power, maxL] of [["KF150", 200, 2.8, 50], ["KF160", 200, 2.8, 30], ["KF200", 240, 3, 50], ["KF350", 280, 4.5, 70]]) {
  const item = equipmentCatalog.find((entry) => entry.brand === "Dophin" && entry.model === model);
  assert.deepEqual([item?.ratedFlowLph, item?.powerW, item?.recommendedMaxL], [flow, power, maxL], `Dophin ${model} resmî 230 V / 50 Hz KF serisi profilini taşımalı`);
  assert(item?.sourceUrl.includes("dophin-aquarium-internal-filter-kf350"), `Dophin ${model} resmî KF serisi tablosuna bağlanmalı`);
}
for (const [model, flow, power, maxL] of [["SH-200", 150, 2.8, 20], ["SH-250", 250, 4, 40], ["SH-280", 280, 4.1, 60], ["SH-380", 380, 4, 80]]) {
  const item = equipmentCatalog.find((entry) => entry.brand === "Dophin" && entry.model === model);
  assert.deepEqual([item?.category, item?.ratedFlowLph, item?.powerW, item?.recommendedMaxL], ["filter", flow, power, maxL], `Dophin ${model} resmî ince askı filtre profilini taşımalı`);
}
for (const [model, flow, basePower, uvPower, uvW, minL, maxL] of [["CF600", 650, 9.3, 20, 5, 100, 160], ["CF700", 750, 9.3, 20.8, 7, 120, 200], ["CF800", 850, 9.3, 20.8, 7, 140, 230], ["CF1200", 1200, 13.2, 25.5, 9, 170, 280], ["CF1400", 1400, 17, 29.3, 9, 190, 310], ["C2400", 3000, 47, 58, 9, 400, 660]]) {
  const base = equipmentCatalog.find((entry) => entry.brand === "Dophin" && entry.model === model);
  const uv = equipmentCatalog.find((entry) => entry.brand === "Dophin" && entry.model === `${model}UV`);
  assert.deepEqual([base?.ratedFlowLph, base?.powerW, base?.recommendedMinL, base?.recommendedMaxL], [flow, basePower, minL, maxL], `Dophin ${model} standart dış filtre profilini taşımalı`);
  assert.deepEqual([uv?.ratedFlowLph, uv?.powerW, uv?.integratedUvcW, uv?.recommendedMinL, uv?.recommendedMaxL], [flow, uvPower, uvW, minL, maxL], `Dophin ${model}UV entegre UV-C profilini taşımalı`);
  assert(base?.sourceUrl.includes("dophin-external-aquarium-uv-canister-filter-cf600"), `Dophin ${model} resmî 600 serisi tablosuna bağlanmalı`);
}
const dophinCf388 = equipmentCatalog.find((entry) => entry.brand === "Dophin" && entry.model === "CF388");
assert.deepEqual([dophinCf388?.category, dophinCf388?.ratedFlowLph, dophinCf388?.adjustableFlow], ["filter", 330, true], "Dophin CF388 resmî mini askı dış filtre profilini taşımalı");
const dophinLed109 = equipmentCatalog.find((entry) => entry.brand === "Dophin" && entry.model === "LED 109");
assert.deepEqual([dophinLed109?.category, dophinLed109?.powerW], ["lighting", 3.4], "Dophin LED 109 resmî güç değerini taşımalı");

assert.equal(
  new Set(equipmentCatalog.map((item) => item.id)).size,
  equipmentCatalog.length,
  "Ekipman kataloğunda yinelenen kimlik bulunmamalı",
);
assert(
  equipmentCatalog.every((item) => /^https:\/\//.test(item.sourceUrl || "")),
  "Her ekipman kaydı doğrulanabilir bir HTTPS kaynak bağlantısı taşımalı",
);
assert(
  equipmentCatalog.every((item) => item.brand.trim() && item.model.trim() && item.specifications.trim()),
  "Her ekipman kaydı marka, model ve teknik açıklama taşımalı",
);
assert(
  equipmentCatalog.every((item) => /^\d{4}-\d{2}-\d{2}$/.test(item.verifiedAt || "") && !Number.isNaN(Date.parse(item.verifiedAt))),
  "Her ekipman kaydı geçerli bir doğrulama tarihi taşımalı",
);
assert(
  equipmentCatalog.every((item) => new URL(item.sourceUrl).hostname.includes(".")),
  "Her ekipman kaydı gerçek bir kaynak alan adına bağlanmalı",
);
assert.equal(hasStandaloneCapacityData(equipmentCatalog.find((item) => item.id === "boyu-sp-1300c")), true, "Resmî debisi yayımlanan Boyu modeli hesaplamaya hazır gösterilmeli");
assert.equal(hasStandaloneCapacityData(equipmentCatalog.find((item) => item.id === "aquael-pat-mini")), true, "Doğrulanmış debili filtre hesaplamaya hazır gösterilmeli");
const aquawingAq488 = equipmentCatalog.find((item) => item.id === "aquawing-aq488");
assert.deepEqual(
  [aquawingAq488?.ratedFlowLph, aquawingAq488?.powerW, aquawingAq488?.recommendedMinL, aquawingAq488?.recommendedMaxL],
  [3000, 45, 200, 300],
  "Aquawing AQ488 doğrulanmış debi, güç ve hacim aralığını taşımalı",
);
const aquawingAq110f = equipmentCatalog.find((item) => item.id === "aquawing-aq110f");
assert.deepEqual([aquawingAq110f?.ratedFlowLph, aquawingAq110f?.powerW], [350, 3], "Aquawing AQ110F doğrulanmış teknik verileri taşımalı");
assert.equal(aquawingAq110f?.recommendedMaxL, undefined, "Aquawing AQ110F çelişkili hacim bilgisi otomatik analize sokulmamalı");
assert.deepEqual(
  [equipmentCatalog.find((item) => item.id === "aquawing-aq333")?.ratedFlowLph, equipmentCatalog.find((item) => item.id === "aquawing-aq333")?.powerW],
  [500, 3],
  "Aquawing AQ333 yayımlanmış debi ve güç değerlerini taşımalı",
);
assert.equal(equipmentCatalog.find((item) => item.id === "aquawing-aq333")?.category, "other", "Aquawing AQ333 su dolaşım debisi klasik hava pompası hesabına karışmamalı");
assert.equal(equipmentCatalog.find((item) => item.id === "aquawing-aq333")?.model, "AQ333LED", "Aquawing AQ333LED güncel model koduyla gösterilmeli");
for (const [model, flow, power, minL, maxL] of [
  ["AQ1500F", 1800, 30, 250, 350],
  ["AQ1800F", 2500, 40, 300, 500],
]) {
  const item = equipmentCatalog.find((entry) => entry.brand === "Aquawing" && entry.model === model);
  assert.deepEqual([item?.ratedFlowLph, item?.powerW, item?.recommendedMinL, item?.recommendedMaxL], [flow, power, minL, maxL], `Aquawing ${model} doğrulanmış tepe filtre verilerini taşımalı`);
  assert(item?.sourceUrl.includes("akvaryumexpress.com"), `Aquawing ${model} doğrudan yerel ürün kaynağına bağlanmalı`);
}
for (const [model, flow, power] of [["AQ2500", 2000, 40], ["AQ3000", 3000, 60], ["AQ4500", 4500, 85]]) {
  const item = equipmentCatalog.find((entry) => entry.brand === "Aquawing" && entry.model === model);
  assert.deepEqual([item?.category, item?.ratedFlowLph, item?.powerW], ["other", flow, power], `Aquawing ${model} sump motoru filtre hesabına karışmadan teknik verileri taşımalı`);
}
for (const model of ["AQ155", "AQ255"]) {
  assert.equal(equipmentCatalog.find((entry) => entry.brand === "Aquawing" && entry.model === model)?.requiresAirPump, true, `Aquawing ${model} harici hava motoru gereksinimini belirtmeli`);
}
assert.deepEqual(
  [equipmentCatalog.find((entry) => entry.id === "aquawing-aq920fb")?.ratedFlowLph, equipmentCatalog.find((entry) => entry.id === "aquawing-aq920fb")?.powerW],
  [1500, 30],
  "Aquawing AQ920FB doğrulanmış debi ve güç değerini taşımalı",
);
for (const model of ["AQ-A3000"]) {
  const item = equipmentCatalog.find((entry) => entry.brand === "Aquawing" && entry.model === model);
  assert.equal(item?.ratedFlowLph, undefined, `Aquawing ${model} debisi yayımlanmadığı için tahmin edilmemeli`);
  assert.match(item?.capacityDataNote || "", /yayımlanmamış|yayımlanmadığı/, `Aquawing ${model} kapasite boşluğunu kullanıcıya açıklamalı`);
  assert.equal(item?.powerW, 25, `Aquawing ${model} doğrulanmış 25 W güç değerini taşımalı`);
  assert.match(item?.specifications || "", /çift çıkışlı/i, `Aquawing ${model} doğrulanmış çift çıkış bilgisini taşımalı`);
  assert.match(item?.specifications || "", /8690000438723/, `Aquawing ${model} doğrulanmış barkodu taşımalı`);
  assert.equal(item?.sourceUrl, "https://www.petlebi.com/akvaryum-urunleri/aquawing-aq-a3000-cift-cikisli-akvaryum-hava-kompresoru-25w.html", `Aquawing ${model} doğrudan ürün kaynağına bağlanmalı`);
  assert(item?.additionalSourceUrls?.includes("https://www.batipettoptan.com/detay/16856/aqa3000-aquawing-hava-motoru-25w.html"), `Aquawing ${model} güncel tedarikçi ürün kaynağını taşımalı`);
  assert(item?.additionalSourceUrls?.includes("https://www.akvaryumexpress.com/aquawing"), `Aquawing ${model} ikinci güvenilir katalog kaynağını taşımalı`);
  assert.equal(item?.verifiedAt, "2026-09-25", `Aquawing ${model} güncel doğrulama tarihini taşımalı`);
}
for (const [model, flow, power, barcode] of [
  ["AQ-WP750FA", 400, 4, "8681475615443"],
  ["AQ-WP750FB", 400, 4, "8681475615405"],
  ["AQ-WP850FA", 500, 6, "8681475615450"],
  ["AQ-WP3300B", 2000, 30, "8681475615351"],
  ["AQ-WP3300C", 2800, 40, "8681475615368"],
  ["AQ111F", 600, 5, "8681475611032"],
  ["AQ501HF", 500, 8, "8681475613036"],
  ["AQ301HF", 300, 5, "8681475613029"],
  ["AQ302HF", 300, 5, "8681475611049"],
]) {
  const item = equipmentCatalog.find((entry) => entry.brand === "Aquawing" && entry.model === model);
  assert.deepEqual([item?.category, item?.ratedFlowLph, item?.powerW], ["filter", flow, power], `Aquawing ${model} doğrulanmış filtre verilerini taşımalı`);
  assert.match(item?.specifications || "", new RegExp(barcode), `Aquawing ${model} doğrulanmış barkodu taşımalı`);
  assert.equal(new URL(item?.sourceUrl).hostname, "eksenpet.com", `Aquawing ${model} doğrulanmış yerel kaynağa bağlanmalı`);
  assert.equal(item?.verifiedAt, "2026-09-09", `Aquawing ${model} güncel doğrulama tarihini taşımalı`);
}
for (const model of ["AQ60F", "AQ101FB", "AQ102F", "AQ103F", "AQ104F", "AQ603F"]) {
  const item = equipmentCatalog.find((entry) => entry.brand === "Aquawing" && entry.model === model);
  assert(item?.sourceUrl.toLowerCase().includes(model.toLowerCase()), `Aquawing ${model} başka bir modelin sayfasına bağlanmamalı`);
}
for (const [model, flow, power, head, barcode] of [
  ["AQ-ECO2000", 2000, 16, "2 m", "8681475615054"],
  ["AQ-ECO3000", 3000, 20, "2,5 m", "8681475615078"],
  ["AQ-ECO4000", 4000, 22, "3 m", "8681475615085"],
  ["AQ-ECO5000", 5000, 32, "3,5 m", "8681475615108"],
  ["AQ-ECO5500", 5500, 45, "3,8 m", "8681475615115"],
  ["AQ-ECO6000", 6000, 65, "4 m", "8681475615122"],
  ["AQ-ECO7000", 7000, 70, "4,5 m", "8681475615146"],
  ["AQ-ECO8000", 8000, 80, "5 m", "8681475615269"],
  ["AQ-ECO9000", 9000, 90, "5,2 m", "8681475615283"],
]) {
  const item = equipmentCatalog.find((entry) => entry.brand === "Aquawing" && entry.model === model);
  assert.deepEqual([item?.category, item?.ratedFlowLph, item?.powerW], ["other", flow, power], `Aquawing ${model} doğrulanmış sump motoru verilerini taşımalı`);
  assert.match(item?.specifications || "", new RegExp(head), `Aquawing ${model} doğrulanmış basma yüksekliğini taşımalı`);
  assert.match(item?.specifications || "", new RegExp(barcode), `Aquawing ${model} doğrulanmış barkodu taşımalı`);
  assert.equal(item?.verifiedAt, "2026-09-09", `Aquawing ${model} güncel doğrulama tarihini taşımalı`);
}
for (const [model, category, flow, power, barcode] of [
  ["AQ2500F", "other", 2000, 40, "8681475622021"],
  ["AQ3500", "other", 3500, 60, "8681475610998"],
  ["AQ388", "filter", 2500, 35, "8681475613609"],
  ["AQ088", "filter", 880, 8, "8681475613579"],
  ["AQ6000M", "other", 6000, 10, "8681475613531"],
  ["AQ10000M", "other", 10000, 15, "8681475613548"],
  ["AQ12000M", "other", 12000, 18, "8681475622069"],
  ["WM1500", "other", 15000, 25, "8681475613517"],
]) {
  const item = equipmentCatalog.find((entry) => entry.brand === "Aquawing" && entry.model === model);
  assert.deepEqual([item?.category, item?.ratedFlowLph, item?.powerW], [category, flow, power], `Aquawing ${model} doğrulanmış kategori, debi ve güç değerlerini taşımalı`);
  assert.match(item?.specifications || "", new RegExp(barcode), `Aquawing ${model} doğrulanmış barkodu taşımalı`);
  assert.equal(new URL(item?.sourceUrl).hostname, "eksenpet.com", `Aquawing ${model} güncel yerel kaynağa bağlanmalı`);
  assert.equal(item?.verifiedAt, "2026-09-09", `Aquawing ${model} güncel doğrulama tarihini taşımalı`);
}
for (const [model, flow, power, barcode] of [
  ["AQ60F", 880, 15, "8681475622007"],
  ["AQ101FB", 880, 15, "8681475612886"],
  ["AQ102F", 1400, 20, "8681475612893"],
  ["AQ103F", 2000, 30, "8681475612909"],
  ["AQ104F", 2800, 40, "8681475612916"],
  ["AQ603F", 1200, 20, "8681475612770"],
]) {
  const item = equipmentCatalog.find((entry) => entry.brand === "Aquawing" && entry.model === model);
  assert.deepEqual([item?.category, item?.ratedFlowLph, item?.powerW], ["filter", flow, power], `Aquawing ${model} doğrulanmış filtre verilerini taşımalı`);
  assert.match(item?.specifications || "", new RegExp(barcode), `Aquawing ${model} doğrulanmış barkodu taşımalı`);
  assert.equal(new URL(item?.sourceUrl).hostname, "eksenpet.com", `Aquawing ${model} doğrulanabilir yerel kaynağa bağlanmalı`);
  assert.equal(item?.verifiedAt, "2026-09-09", `Aquawing ${model} güncel doğrulama tarihini taşımalı`);
}
const aquawingAq680 = equipmentCatalog.find((entry) => entry.brand === "Aquawing" && entry.model === "AQ680");
assert.deepEqual([aquawingAq680?.category, aquawingAq680?.ratedFlowLph, aquawingAq680?.powerW, aquawingAq680?.recommendedMaxL], ["filter", 880, 5, 80], "Aquawing AQ680 doğrulanmış yüzey emici filtre ve hacim verilerini taşımalı");
assert.match(aquawingAq680?.specifications || "", /8681475610967/, "Aquawing AQ680 doğrulanmış barkodu taşımalı");
const aquawingAq708 = equipmentCatalog.find((entry) => entry.brand === "Aquawing" && entry.model === "AQ708");
assert.equal(aquawingAq708?.category, "air_pump", "Aquawing AQ708 hava motoru kategorisinde bulunmalı");
assert.equal(aquawingAq708?.powerW, 3, "Aquawing AQ708 doğrulanmış 3 W güç değerini taşımalı");
assert.equal(aquawingAq708?.ratedFlowLph, 210, "Aquawing AQ708 doğrulanmış 3,5 L/dk hava debisini saatlik değere dönüştürmeli");
assert.equal(aquawingAq708?.recommendedMaxL, 60, "Aquawing AQ708 yayımlanan üst akvaryum hacmini taşımalı");
assert.equal(aquawingAq708?.capacityDataNote, undefined, "Aquawing AQ708 kaynaklı debi varken kapasite boşluğu göstermemeli");
assert.match(aquawingAq708?.specifications || "", /8681475613111/, "Aquawing AQ708 doğrulanmış barkodu taşımalı");
assert.equal(aquawingAq708?.verifiedAt, "2026-09-10", "Aquawing AQ708 güncel doğrulama tarihini taşımalı");
for (const [model, power, barcode] of [["AQ-A1000", 8, "8690000438709"], ["AQ-A2000", 12, "8690000438716"]]) {
  const item = equipmentCatalog.find((entry) => entry.brand === "Aquawing" && entry.model === model);
  assert.equal(item?.category, "air_pump", `Aquawing ${model} hava motoru kategorisinde bulunmalı`);
  assert.equal(item?.powerW, power, `Aquawing ${model} doğrulanmış güç değerini taşımalı`);
  assert.equal(item?.ratedFlowLph, undefined, `Aquawing ${model} yayımlanmayan hava debisini tahmin etmemeli`);
  assert.match(item?.capacityDataNote || "", /yayımlanmadığı/, `Aquawing ${model} kapasite boşluğunu açıklamalı`);
  assert.match(item?.specifications || "", /çift çıkışlı/i, `Aquawing ${model} doğrulanmış çift çıkış bilgisini taşımalı`);
  assert.match(item?.specifications || "", new RegExp(barcode), `Aquawing ${model} doğrulanmış barkodu taşımalı`);
  assert.equal(new URL(item?.sourceUrl).hostname, "eksenpet.com", `Aquawing ${model} doğrudan ürün kaynağına bağlanmalı`);
  assert(item?.additionalSourceUrls?.some((url) => url.includes(`aqa${model.slice(-4)}-aquawing-hava-motoru-${power}w`)), `Aquawing ${model} güncel tedarikçi çapraz kaynağını taşımalı`);
  assert.equal(item?.verifiedAt, "2026-09-25", `Aquawing ${model} güncel doğrulama tarihini taşımalı`);
}
for (const [model, flow, power, barcode] of [
  ["AQ-WP950FA", 880, 12, "8681475615467"],
  ["AQ101F", 550, 12, "8681475612879"],
  ["AQ40F", 550, 12, "8681475612862"],
  ["AQ920FC", 1500, 30, "8681475612954"],
]) {
  const item = equipmentCatalog.find((entry) => entry.brand === "Aquawing" && entry.model === model);
  assert.deepEqual([item?.category, item?.ratedFlowLph, item?.powerW], ["filter", flow, power], `Aquawing ${model} doğrulanmış filtre verilerini taşımalı`);
  assert.match(item?.specifications || "", new RegExp(barcode), `Aquawing ${model} doğrulanmış barkodu taşımalı`);
  assert.equal(new URL(item?.sourceUrl).hostname, "eksenpet.com", `Aquawing ${model} doğrudan ürün kaynağına bağlanmalı`);
}
for (const [model, flow, power, barcode] of [
  ["AQ2600", 3000, 45, "8681475613401"],
  ["WM1200", 12000, 18, "8681475613500"],
  ["AQ4000", 4000, 85, "8681475613326"],
  ["AQ5000", 5000, 105, "8681475613333"],
  ["AQ6000", 6000, 135, "8681475613340"],
  ["AQ6500", 6000, 105, "8681475611018"],
  ["AQ901", 600, 5, "8681475613418"],
  ["AQ902", 1000, 18, "8681475613425"],
  ["AQ903", 1500, 26, "8681475613432"],
  ["AQ904", 2000, 45, "8681475613449"],
  ["AQ3000F", 3000, 60, "8681475622038"],
  ["AQ3200", 3000, 40, "8681475610974"],
  ["AQ5000F", 5000, 105, "8681475622045"],
  ["AQ6000F", 6000, 135, "8681475622052"],
]) {
  const item = equipmentCatalog.find((entry) => entry.brand === "Aquawing" && entry.model === model);
  assert.deepEqual([item?.category, item?.ratedFlowLph, item?.powerW], ["other", flow, power], `Aquawing ${model} doğrulanmış motor verilerini filtre hesabına karıştırmadan taşımalı`);
  assert.match(item?.specifications || "", new RegExp(barcode), `Aquawing ${model} doğrulanmış barkodu taşımalı`);
  assert.equal(new URL(item?.sourceUrl).hostname, "eksenpet.com", `Aquawing ${model} doğrudan ürün kaynağına bağlanmalı`);
}
const aquawingAq288 = equipmentCatalog.find((entry) => entry.id === "aquawing-aq288");
assert.deepEqual([aquawingAq288?.category, aquawingAq288?.ratedFlowLph, aquawingAq288?.powerW], ["other", 1500, 25], "Aquawing AQ288 güncel debi ve güç değerlerini taşımalı");
assert.match(aquawingAq288?.specifications || "", /8681475613593/, "Aquawing AQ288 doğrulanmış barkodu taşımalı");
const aquawingAq666led = equipmentCatalog.find((entry) => entry.id === "aquawing-aq666led");
assert.deepEqual([aquawingAq666led?.category, aquawingAq666led?.ratedFlowLph, aquawingAq666led?.powerW], ["other", 1000, 6], "Aquawing AQ666LED su dolaşım verisini hava debisi hesabına karıştırmamalı");
const aquawingAq999a = equipmentCatalog.find((entry) => entry.id === "aquawing-aq999a");
assert.deepEqual([aquawingAq999a?.category, aquawingAq999a?.powerW, aquawingAq999a?.ratedFlowLph], ["air_pump", 8, 720], "Aquawing AQ999A doğrulanmış dört çıkışlı toplam hava debisini taşımalı");
assert.equal(aquawingAq999a?.capacityDataNote, undefined, "Aquawing AQ999A kaynaklı debi varken kapasite boşluğu göstermemeli");
assert.equal(aquawingAq999a?.sourceUrl, "https://bettamarketim.com.tr/aquawing-dort-cikisli-hava-motoru-8w", "Aquawing AQ999A onaylı yerel kaynağa bağlanmalı");
assert.equal(aquawingAq999a?.verifiedAt, "2026-09-10", "Aquawing AQ999A güncel doğrulama tarihini taşımalı");
const aquawingAq311 = equipmentCatalog.find((entry) => entry.id === "aquawing-aq311");
assert.deepEqual([aquawingAq311?.category, aquawingAq311?.powerW, aquawingAq311?.ratedFlowLph], ["air_pump", 2.5, 108], "Aquawing AQ311 doğrulanmış 1,8 L/dk hava debisini saatlik değere dönüştürmeli");
assert.match(aquawingAq311?.specifications || "", /8681475611063/, "Aquawing AQ311 doğrulanmış barkodu taşımalı");
assert.equal(aquawingAq311?.capacityDataNote, undefined, "Aquawing AQ311 kaynaklı debi varken kapasite boşluğu göstermemeli");
assert.equal(aquawingAq311?.verifiedAt, "2026-09-10", "Aquawing AQ311 güncel doğrulama tarihini taşımalı");
for (const [model, barcode] of [["AQMBS1", "8681475628900"], ["AQMBM2", "8681475628917"], ["07708 Check Valve 20'li Paket", "8690000437665"]]) {
  const item = equipmentCatalog.find((entry) => entry.brand === "Aquawing" && entry.model === model);
  assert.equal(item?.category, "other", `Aquawing ${model} kapasite hesabına karışmamalı`);
  assert.match(item?.specifications || "", new RegExp(barcode), `Aquawing ${model} doğrulanmış barkodu taşımalı`);
  assert.equal(new URL(item?.sourceUrl).hostname, "eksenpet.com", `Aquawing ${model} doğrudan ürün kaynağına bağlanmalı`);
}
assert.equal(equipmentCatalog.filter((entry) => entry.brand === "Aquawing").length, 138, "Aquawing kataloğu 138 doğrulanmış kayda ulaşmalı");
const aquawingAq938 = equipmentCatalog.find((entry) => entry.brand === "Aquawing" && entry.model === "AQ938");
assert.deepEqual([aquawingAq938?.ratedFlowLph, aquawingAq938?.powerW, aquawingAq938?.recommendedMaxL], [420, 8, 200], "Aquawing AQ938 doğrulanmış hava debisi, güç ve hacim verilerini taşımalı");
assert.equal(aquawingAq938?.adjustableFlow, true, "Aquawing AQ938 ayarlanabilir hava çıkışını belirtmeli");
for (const model of ["AQ01 Mıknatıslı Cam Sileceği", "AQ02 Mıknatıslı Cam Sileceği", "AQ03 Mıknatıslı Cam Sileceği", "AQ04 Mıknatıslı Cam Sileceği"]) {
  const item = equipmentCatalog.find((entry) => entry.brand === "Aquawing" && entry.model === model);
  assert.equal(item?.category, "other", `Aquawing ${model} cihaz kapasite hesabına karışmamalı`);
}

const oaseCurrentBioMaster = [
  ["BioMaster² 150", 850, 15, undefined, 150],
  ["BioMaster² 250", 900, 15, undefined, 250],
  ["BioMaster² 350", 1100, 18, undefined, 350],
  ["BioMaster² 600", 1250, 22, undefined, 600],
  ["BioMaster² 850", 1500, 32, undefined, 850],
  ["BioMaster² Thermo 150", 850, 15, 100, 150],
  ["BioMaster² Thermo 250", 900, 15, 150, 250],
  ["BioMaster² Thermo 350", 1100, 18, 200, 350],
  ["BioMaster² Thermo 600", 1250, 22, 300, 600],
  ["BioMaster² Thermo 850", 1500, 32, 400, 850],
];
for (const [model, flow, power, heater, maxL] of oaseCurrentBioMaster) {
  const item = equipmentCatalog.find((entry) => entry.brand === "Oase" && entry.model === model);
  assert.deepEqual([item?.ratedFlowLph, item?.powerW, item?.integratedHeaterW, item?.recommendedMaxL], [flow, power, heater, maxL], `Oase ${model} resmî BioMaster² aile verilerini taşımalı`);
}
for (const [model, flow, power, heater, maxL] of [
  ["BioPlus 50", 350, 5, undefined, 50],
  ["BioPlus 100", 500, 6, undefined, 100],
  ["BioPlus 200", 650, 7, undefined, 200],
  ["BioPlus Thermo 50", 350, 5, 50, 50],
  ["BioPlus Thermo 100", 500, 6, 100, 100],
  ["BioPlus Thermo 200", 650, 7, 200, 200],
]) {
  const item = equipmentCatalog.find((entry) => entry.brand === "Oase" && entry.model === model);
  assert.deepEqual([item?.ratedFlowLph, item?.powerW, item?.integratedHeaterW, item?.recommendedMaxL], [flow, power, heater, maxL], `Oase ${model} resmî BioPlus aile verilerini taşımalı`);
  assert(new URL(item?.sourceUrl).hostname.endsWith("oase.com"), `Oase ${model} resmî üretici kaynağına bağlanmalı`);
}
for (const [model, flow, power, maxL, sku] of [
  ["BioStyle 75", 350, 3.5, 70, "89600"],
  ["BioStyle 115", 550, 4, 115, "89601"],
  ["BioStyle 180", 900, 4.5, 180, "89602"],
]) {
  const item = equipmentCatalog.find((entry) => entry.brand === "Oase" && entry.model === model);
  assert.deepEqual([item?.ratedFlowLph, item?.powerW, item?.recommendedMaxL], [flow, power, maxL], `Oase ${model} resmî BioStyle aile verilerini taşımalı`);
  assert.match(item?.sourceUrl || "", new RegExp(sku), `Oase ${model} başka bir modelin ürün sayfasına bağlanmamalı`);
}
for (const [model, flow, power, heater, maxL] of [
  ["FiltoSmart 60", 300, 5, undefined, 60],
  ["FiltoSmart 100", 600, 11, undefined, 100],
  ["FiltoSmart 200", 800, 17, undefined, 200],
  ["FiltoSmart 300", 1000, 23, undefined, 300],
  ["FiltoSmart Thermo 100", 600, 11, 100, 100],
  ["FiltoSmart Thermo 200", 800, 17, 200, 200],
  ["FiltoSmart Thermo 300", 1000, 23, 300, 300],
]) {
  const item = equipmentCatalog.find((entry) => entry.brand === "Oase" && entry.model === model);
  assert.deepEqual([item?.ratedFlowLph, item?.powerW, item?.integratedHeaterW, item?.recommendedMaxL], [flow, power, heater, maxL], `Oase ${model} resmî FiltoSmart aile verilerini taşımalı`);
}
for (const [model, maxL] of [["BioCompact 25", 25], ["BioCompact 50", 50]]) {
  const item = equipmentCatalog.find((entry) => entry.brand === "Oase" && entry.model === model);
  assert.deepEqual([item?.ratedFlowLph, item?.powerW, item?.recommendedMaxL, item?.adjustableFlow], [240, 5, maxL, true], `Oase ${model} resmî nano filtre verilerini taşımalı`);
  assert.equal(new URL(item?.sourceUrl).hostname, "www.oase.com", `Oase ${model} resmî üretici kaynağına bağlanmalı`);
}
for (const [model, flow, maxL] of [["CrystalSkim 350", 300, 350], ["CrystalSkim 600", 600, 600]]) {
  const item = equipmentCatalog.find((entry) => entry.brand === "Oase" && entry.model === model);
  assert.deepEqual([item?.category, item?.ratedFlowLph, item?.powerW, item?.recommendedMaxL, item?.adjustableFlow], ["other", flow, 4.5, maxL, true], `Oase ${model} resmî yüzey emici verilerini taşımalı ve ana filtre hesabına karışmamalı`);
}
assert.equal(equipmentCatalog.filter((entry) => entry.brand === "Oase").length, 55, "Oase kataloğu 55 doğrulanmış ekipmana ulaşmalı");

const equipmentCategories = [...new Set(equipmentCatalog.map((item) => item.category))];
for (const category of equipmentCategories) {
  const categoryItems = equipmentCatalog.filter((item) => item.category === category);
  assert(categoryItems.length > 0, `${category} ekipman kategorisi boş olmamalı`);
  assert.deepEqual(equipmentForCategory(category), categoryItems, `${category} seçildiğinde yalnızca o kategorinin katalog kayıtları gösterilmeli`);
  assert.deepEqual(equipmentBrandsForCategory(category), [...new Set(categoryItems.map((item) => item.brand))].sort((a, b) => a.localeCompare(b, "tr")), `${category} marka seçicisi yalnızca o kategorideki markaları göstermeli`);

  for (const brand of new Set(categoryItems.map((item) => item.brand))) {
    const models = categoryItems.filter((item) => item.brand === brand);
    assert.deepEqual(equipmentForBrandInCategory(category, brand), models, `${category} / ${brand} model seçicisi farklı kategori veya marka göstermemeli`);
    assert(models.length > 0, `${category} / ${brand} model listesi boş olmamalı`);
    assert(models.every((item) => item.category === category), `${brand} model listesine farklı ekipman kategorisi sızdı`);
    assert(models.every((item) => item.brand === brand), `${brand} model listesine farklı marka sızdı`);
    assert.equal(
      new Set(models.map((item) => item.model.toLocaleLowerCase("tr-TR"))).size,
      models.length,
      `${category} / ${brand} içinde yinelenen model adı bulunmamalı`,
    );
  }
}

const expectedRegentFlows = new Map([
  ["5500", 80],
  ["6500", 100],
  ["7500", 150],
  ["8500", 210],
  ["9500", 240],
  ["Calm RC-006", 180],
]);
for (const [model, expectedFlow] of expectedRegentFlows) {
  const item = equipmentCatalog.find((entry) => entry.brand === "Regent" && entry.model === model);
  assert(item, `Regent ${model} katalogda bulunmalı`);
  assert.equal(item.ratedFlowLph, expectedFlow, `Regent ${model} debisi model numarasından türetilmemeli`);
}
for (const model of ["6500", "7500", "8500", "9500"]) {
  const item = equipmentCatalog.find((entry) => entry.brand === "Regent" && entry.model === model);
  assert.equal(item?.sourceUrl, "https://hydroponic.co.za/hydroponics/air-pumps/", `Regent ${model} debisi model tablosuna bağlanmalı`);
  assert(item?.additionalSourceUrls?.some((url) => url.includes(`regent-${model}-`)), `Regent ${model} Türkiye ürün varyantı ayrıca kaynaklanmalı`);
  assert.equal(item?.verifiedAt, "2026-09-23", `Regent ${model} güncel doğrulama tarihi taşımalı`);
}
const currentRegentTurkiyeFixtures = [
  ["6500", "200-RE6500", "6938104012923", /5 × 12,2 × 6,2 cm/],
  ["7500", "200-RE7500", "6938104012930", /5,8 × 14,5 × 8 cm/],
  ["8500", "200-RE8500", "6938104012947", /8 × 17 × 9 cm/],
  ["9500", "200-RE9500", "6938104012954", /8 × 17 × 9 cm/],
];
for (const [model, productCode, barcode, dimensions] of currentRegentTurkiyeFixtures) {
  const item = equipmentCatalog.find((entry) => entry.brand === "Regent" && entry.model === model);
  assert.match(item?.specifications ?? "", new RegExp(productCode), `Regent ${model} Türkiye ürün kodunu taşımalı`);
  assert.match(item?.specifications ?? "", new RegExp(barcode), `Regent ${model} barkodunu taşımalı`);
  assert.match(item?.specifications ?? "", dimensions, `Regent ${model} doğrulanmış gövde ölçüsünü taşımalı`);
}
assert.equal(equipmentCatalog.find((entry) => entry.brand === "Regent" && entry.model === "5500")?.sourceUrl, "https://hydroponic.co.za/size/regent-5500/", "Regent 5500 yanlışlıkla 9500 ürün kaynağına bağlanmamalı");
assert.match(equipmentCatalog.find((entry) => entry.brand === "Regent" && entry.model === "6500")?.specifications ?? "", /2,4 W.*2,5 W/, "Regent 6500 bölgesel güç farkını açıklamalı");
assert.match(equipmentCatalog.find((entry) => entry.brand === "Regent" && entry.model === "8500")?.specifications ?? "", /4 W.*3,5 W/, "Regent 8500 bölgesel güç farkını açıklamalı");
assert.match(equipmentCatalog.find((entry) => entry.brand === "Regent" && entry.model === "9500")?.specifications ?? "", /4 W.*3,1–4 W.*5 W/, "Regent 9500 bölgesel güç çelişkisini saklamamalı");
assert(equipmentCatalog.find((entry) => entry.brand === "Regent" && entry.model === "9500")?.additionalSourceUrls?.includes("https://www.akwa.co.za/product/regent-9500-double-flow-control-240-l-h/"), "Regent 9500 bağımsız debi ve ayar kaynağına bağlanmalı");
assert(equipmentCatalog.find((entry) => entry.brand === "Regent" && entry.model === "9500")?.additionalSourceUrls?.includes("https://malawiizmir.com/regent-9500-hava-motoru"), "Regent 9500 güç çelişkisi yerel kaynağa bağlanmalı");
assert.equal(equipmentCatalog.find((entry) => entry.brand === "Regent" && entry.model === "6500")?.adjustableFlow, false, "Güncel Regent 6500 ayar düğmesi varmış gibi gösterilmemeli");
assert.equal(equipmentCatalog.find((entry) => entry.brand === "Regent" && entry.model === "7500")?.adjustableFlow, false, "Güncel Regent 7500 ayar düğmesi varmış gibi gösterilmemeli");
assert.equal(equipmentCatalog.find((entry) => entry.brand === "Regent" && entry.model === "8500")?.adjustableFlow, false, "Güncel Regent 8500 ayar düğmesi varmış gibi gösterilmemeli");
assert.equal(equipmentCatalog.find((entry) => entry.brand === "Regent" && entry.model === "9500")?.adjustableFlow, true, "Regent 9500 akış ayarı korunmalı");

const xlproEntries = equipmentCatalog.filter((entry) => entry.brand === "XLPro");
const xlproModels = new Set(xlproEntries.filter((entry) => entry.category === "filter").map((entry) => entry.model));
assert.deepEqual(
  xlproModels,
  new Set(["MINI-230", "MINI-500", "MINI-500AT", "EX-1000", "EX-1200", "EX-1500"]),
  "XLPro'nun Türkiye'de doğrulanan altı güncel filtre modeli eksiksiz bulunmalı",
);
assert.equal(xlproEntries.length, 29, "XLPro'nun altı filtresi ve 23 doğrulanmış yedek parçası eksiksiz bulunmalı");
const xlproReplacementFixtures = [
  ["Dış Filtre Emiş Süzgeci Yedek Parça", "ST06776", "8690000432929"],
  ["EX-1200/1500 Yedek Mıknatıs / Pervane ve Mil", "ST06778", "8690000432943"],
  ["EX-1500 Yedek Vana Takımı", "ST06769", "8690000432851"],
  ["Dış Filtre Yan Yedek Klipsi 2'li", "ST06779", "8690000432950"],
  ["EX-1000 Yedek Mıknatıs", "ST06777", "8690000432936"],
  ["EX-1000/1200 Yedek Vana Takımı", "ST06768", "8690000432844"],
  ["MINI-230 Yedek Çanak", "ST07655", "8690000437429"],
  ["MINI-500 Yedek Çanak", "ST07656", "8690000437436"],
  ["EX-1000/1200 Delikli Fıskiye Çubuk", "ST06780", "8690000432967"],
  ["MINI-230 Yedek Dış Filtre Kafası", "ST07663", "8690000437504"],
  ["MINI-500AT Yedek Çanak", "ST07657", "8690000437443"],
  ["MINI-500 Yedek Dış Filtre Kafası", "ST07661", "8690000437481"],
  ["MINI-500AT Yedek Dış Filtre Kafası", "ST07662", "8690000437498"],
  ["EX-1500 Yedek Çanak", "ST06772", "8690000432882"],
  ["EX-1200 Yedek Dış Filtre Kafası", "ST07659", "8690000437467"],
  ["12/16 Dirsek Boru Yedek Parça Small", "ST06774", "8690000432905"],
  ["EX-1000 Yedek Dış Filtre Kafası", "ST07658", "8690000437450"],
  ["EX-1000 Yedek Çanak", "ST06770", "8690000432868"],
  ["EX-1500 Yedek Dış Filtre Kafası", "ST07660", "8690000437474"],
  ["EX-1200 Yedek Çanak", "ST06771", "8690000432875"],
  ["EX-1000/1200/1500 Yedek Kafa Contası", "ST06773", "8690000432899"],
  ["16/22 Dirsek Boru Yedek Parça Large", "ST06775", "8690000432912"],
  ["EX-1500 Delikli Fıskiye Çubuk", "ST06781", "8690000432974"],
];
for (const [model, stockCode, barcode] of xlproReplacementFixtures) {
  const item = xlproEntries.find((entry) => entry.model === model);
  assert.deepEqual([item?.category, item?.passiveComponent, item?.ratedFlowLph, item?.recommendedMaxL], ["other", true, undefined, undefined], `XLPro ${model} kapasite hesabına girmeyen pasif yedek parça olmalı`);
  assert.match(item?.specifications ?? "", new RegExp(`${stockCode}.*${barcode}`), `XLPro ${model} doğrulanmış stok kodu ve barkodu taşımalı`);
  assert.equal(item?.verifiedAt, "2026-09-20", `XLPro ${model} güncel doğrulama tarihini taşımalı`);
}
const xlproEx1500Valve = xlproEntries.find((entry) => entry.model === "EX-1500 Yedek Vana Takımı");
assert.match(xlproEx1500Valve?.specifications ?? "", /yalnız kırmızı-siyah yeni kasa.*gri kasa ile uyumlu değil/, "XLPro EX-1500 vana takımının kasa uyumluluk sınırı görünür olmalı");
const xlproRotor = xlproEntries.find((entry) => entry.model === "EX-1200\/1500 Yedek Mıknatıs \/ Pervane ve Mil");
assert.match(xlproRotor?.specifications ?? "", /distribütör kaydı 'mıknatıs'.*AkvaryumExpress kaydı 'pervane ve mili'/, "XLPro ST06778 adlandırma çelişkisi kullanıcıdan saklanmamalı");
for (const [model, power, maxL] of [["MINI-500", 6.9, 100], ["EX-1000", 22, 200], ["EX-1200", 28, 280], ["EX-1500", 36, 300]]) {
  const item = equipmentCatalog.find((entry) => entry.brand === "XLPro" && entry.model === model);
  assert.deepEqual([item?.powerW, item?.recommendedMaxL], [power, maxL], `XLPro ${model} doğrulanmış güç ve hacim sınırını taşımalı`);
}
const xlproMini500At = equipmentCatalog.find((entry) => entry.brand === "XLPro" && entry.model === "MINI-500AT");
assert.deepEqual([xlproMini500At?.ratedFlowLph, xlproMini500At?.recommendedMaxL], [450, 100], "XLPro MINI-500AT doğrulanmış debi ve 100 litre hacim sınırını taşımalı");
assert.equal(xlproMini500At?.sourceUrl, "https://akvaryumbalikavm.com.tr/xlpro-500at-mini-dis-filtre-450l-s", "XLPro MINI-500AT doğrudan ürün kaynağına bağlanmalı");
const currentXinyouModels = new Map([
  ["XY-168", 30], ["XY-2835", 40], ["XY-2836", 80], ["XY-2810", 100], ["XY-2901", 120],
  ["XY-2811", 220], ["XY-2902", 220], ["XY-2812", 250], ["XY-2813", 380],
]);
for (const [model, maxL] of currentXinyouModels) {
  const item = equipmentCatalog.find((entry) => entry.brand === "Xinyou" && entry.model === model);
  assert.deepEqual([item?.category, item?.recommendedMaxL, item?.requiresAirPump], ["filter", maxL, true], `Xinyou ${model} güncel marka sayfasındaki hacim sınırıyla hava motorlu filtre olarak bulunmalı`);
}
for (const [model, productCode, barcode, dimensions, spongeDimensions] of [
  ["Motorlu Pipo Filtre Medium", "452-SG-YU228C-1", "1452000189084", "17,5 × 23 cm", "5 × 12 cm"],
  ["Motorlu Pipo Filtre Large", "452-SG-YU229C-1", "1452000189077", "18,5 × 25 cm", "6 × 13 cm"],
]) {
  const item = equipmentCatalog.find((entry) => entry.brand === "Eurostar" && entry.model === model);
  assert.equal(item?.powerW, 5, `Eurostar ${model} doğrulanmış 5 W güç değerini taşımalı`);
  assert.equal(item?.ratedFlowLph, undefined, `Eurostar ${model} debisi yayımlanmadığı için tahmin edilmemeli`);
  assert.match(item?.capacityDataNote || "", /yayımlanmadı|yayımlanmamış/, `Eurostar ${model} kapasite boşluğunu kullanıcıya açıklamalı`);
  assert.match(item?.capacityDataNote || "", /farklı marka\/voltaj/i, `Eurostar ${model} benzer OEM türevlerinden veri aktarılmadığını açıklamalı`);
  assert(item?.specifications.includes(productCode), `Eurostar ${model} yetkili satıcı ürün kodunu taşımalı`);
  assert(item?.specifications.includes(barcode), `Eurostar ${model} yetkili satıcı barkodunu taşımalı`);
  assert(item?.specifications.includes(dimensions) && item?.specifications.includes(spongeDimensions), `Eurostar ${model} cihaz ve sünger ölçülerini taşımalı`);
  assert(item?.sourceUrl.includes("atakanpetshop.com/eurostar-motorlu-pipo-filtre"), `Eurostar ${model} yetkili satıcı ürün sayfasına bağlanmalı`);
  assert.equal(item?.verifiedAt, "2026-09-25", `Eurostar ${model} güncel doğrulama tarihini taşımalı`);
}
const eurostarHbl802 = equipmentCatalog.find((entry) => entry.brand === "Eurostar" && entry.model === "HBL802");
assert.deepEqual([eurostarHbl802?.ratedFlowLph, eurostarHbl802?.powerW, eurostarHbl802?.recommendedMinL, eurostarHbl802?.recommendedMaxL], [500, 6, 60, 100], "Eurostar HBL802 yetkili satıcıdaki tüm kapasite verilerini taşımalı");
assert(eurostarHbl802?.sourceUrl.includes("atakanpetshop.com"), "Eurostar HBL802 yetkili satıcı ürün sayfasına bağlanmalı");
for (const [model, flow, power, minL, maxL] of [["Ege SP300", 300, 2, 30, 60], ["Ege 400", 400, 4, 40, 100], ["Ege 500", 500, 6, 40, 100], ["Ege W550", 550, 10, undefined, undefined]]) {
  const item = equipmentCatalog.find((entry) => entry.brand === "Eurostar" && entry.model === model);
  assert.deepEqual([item?.category, item?.ratedFlowLph, item?.powerW, item?.recommendedMinL, item?.recommendedMaxL], ["filter", flow, power, minL, maxL], `Eurostar ${model} doğrudan ürün sayfasındaki teknik değerleri taşımalı`);
  assert(item?.sourceUrl.includes("akvaryem.com.tr/urun/"), `Eurostar ${model} doğrudan ürün sayfasına bağlanmalı`);
}
assert.equal(equipmentCatalog.find((entry) => entry.brand === "Eurostar" && entry.model === "Ege SP300")?.adjustableFlow, true, "Eurostar Ege SP300 yayımlanmış su çıkışı ayarını taşımalı");
assert.equal(equipmentCatalog.some((entry) => entry.id === "eurostar-n708"), false, "Satıcılar arasında farklı ürünlere atanan N708 kodu ayrı Eurostar filtre modeli gibi gösterilmemeli");
const eurostarModels = new Set(equipmentCatalog.filter((entry) => entry.brand === "Eurostar").map((entry) => entry.model));
assert.equal(eurostarModels.size, 32, "Eurostar doğrulanan ekipman ve akvaryum aksesuarı portföyü 32 benzersiz kayıt içermeli");
for (const model of ["Akvaryum Temizlik Seti 4'lü", "Akvaryum Temizlik Seti 5'li", "Cam Yüzey Emiş Borusu 13 mm", "Cam Yüzey Emiş Borusu 17 mm", "Cam Emiş Borusu 13 mm", "Cam Emiş Borusu 17 mm", "Dijital Yapışkan Termometre", "Cam Derece Sarı İnce", "Sarı Cam Derece 6 cm", "Hortum İçi Temizleme Harbisi 48 cm", "Mangrove Akvaryum Dekoru M", "Mangrove Akvaryum Dekoru L", "Salyangoz Kapanı Large"]) {
  assert(eurostarModels.has(model), `Eurostar ${model} güncel Türkiye portföyünde bulunduğu için katalogda yer almalı`);
}
const eurostarCareModelsExpanded = new Set(careProductCatalog.filter((entry) => entry.brand === "Eurostar").map((entry) => entry.model));
for (const model of ["Super Premium Carbon 1 L", "Bio Filter Ring Beyaz 500 ml", "Bio Filter Ring Kahverengi 500 ml", "Bio Brick Seramik Fix 500 ml", "Bio Glass Ring 500 ml"]) {
  assert(eurostarCareModelsExpanded.has(model), `Eurostar ${model} güncel filtre medyası portföyünde bulunduğu için katalogda yer almalı`);
}
for (const model of ["Aquaclay Bitki Kumu 5 L", "Aquaclay Bitki Kumu 10 L", "Bitki Tohumu Eleocharis Parvula", "Bitki Tohumu Glossostigma Elatinoides", "Bitki Tohumu Hemianthus Callitrichoides"]) {
  assert(eurostarCareModelsExpanded.has(model), `Eurostar ${model} güncel ürün seçeneklerinde bulunduğu için katalogda yer almalı`);
}
const eurostarCare = careProductCatalog.filter((entry) => entry.brand === "Eurostar");
assert.equal(eurostarCare.length, 22, "Eurostar doğrulanan bakım, taban ve bitki tohumu portföyü 22 ürün içermeli");
assert.equal(eurostarCare.filter((entry) => entry.category === "substrate").length, 2, "Eurostar Aquaclay 5 ve 10 L taban varyantları ayrı bulunmalı");
assert.equal(eurostarCare.filter((entry) => entry.category === "plant_seed").length, 3, "Eurostar üç bitki tohumu seçeneği ayrı kategoride bulunmalı");
assert(eurostarCare.filter((entry) => entry.category === "plant_seed").every((entry) => entry.description.includes("bağımsız olarak doğrulanmamıştır")), "Eurostar bitki tohumu satış adları doğrulanmış bilimsel kimlik gibi sunulmamalı");

const sicceShark = equipmentCatalog.filter((entry) => entry.brand === "Shark (Sicce)");
assert.deepEqual(
  new Set(sicceShark.map((entry) => entry.model)),
  new Set(["Shark Pro 500", "Shark Pro 700", "Shark Pro 900", "Shark ADV 400", "Shark ADV 600", "Shark ADV 800", "Shark PRO NANO 250", "Shark PRO NANO 320"]),
  "Sicce'nin güncel Shark PRO, ADV ve PRO NANO filtre serileri eksiksiz bulunmalı",
);
const sharkNano250 = sicceShark.find((entry) => entry.model === "Shark PRO NANO 250");
assert.equal(sharkNano250?.ratedFlowLph, 250, "Shark PRO NANO 250 resmî 250 L/saat debiyi taşımalı");
assert.equal(sharkNano250?.powerW, 3.5, "Shark PRO NANO 250 Avrupa sürümü 3,5 W olmalı");
assert.deepEqual([sharkNano250?.recommendedMinL, sharkNano250?.recommendedMaxL], [40, 60], "Shark PRO NANO 250 resmî 40–60 L aralığını taşımalı");
const sharkNano320 = sicceShark.find((entry) => entry.model === "Shark PRO NANO 320");
assert.deepEqual([sharkNano320?.ratedFlowLph, sharkNano320?.powerW, sharkNano320?.recommendedMinL, sharkNano320?.recommendedMaxL], [320, 4, 60, 100], "Shark PRO NANO 320 resmî teknik verileri korunmalı");

const armaturkEquipment = equipmentCatalog.filter((entry) => entry.brand === "Armatürk");
const armaturkModels = new Set(armaturkEquipment.map((entry) => entry.model));
assert.equal(armaturkModels.size, 50, "Armatürk portföyü 37 tatlı su armatürü ile 13 deniz, soğutma ve aksesuar modelini içermeli");
for (const model of ["Nano Türk", "Plant Nano20", "Plant Nano25", "Eko 30 cm", "Eko 100 cm", "1030L", "1040L", "1090L", "1500L", "1030H", "2050H", "2200H", "2500H", "Premium 40 cm", "Premium 100 cm", "Fanus ve Beta Kabı Aydınlatma Seti"]) {
  assert(armaturkModels.has(model), `Armatürk ${model} katalogda bulunmalı`);
}
assert.deepEqual(
  armaturkEquipment.reduce((counts, entry) => ({...counts,[entry.category]:(counts[entry.category] || 0) + 1}), {}),
  {lighting:41,other:9},
  "Armatürk modelleri aydınlatma ve diğer ekipman seçimlerine doğru ayrılmalı",
);
for (const [model,power,range] of [["2040T Tuzlu Su 40 cm",48,[39,54]],["2060T Tuzlu Su 60 cm",72,[59,74]],["2070T Tuzlu Su 70 cm",84,[69,84]]]) {
  const item=armaturkEquipment.find((entry)=>entry.model===model);
  assert.deepEqual([item?.category,item?.powerW,item?.recommendedTankLengthCm],["lighting",power,range],`Armatürk ${model} doğrulanmış güç ve akvaryum aralığını taşımalı`);
}
const armaturk2080t=armaturkEquipment.find((entry)=>entry.model==="2080T Tuzlu Su 80 cm");
assert.equal(armaturk2080t?.powerW,undefined,"Armatürk 2080T kaynak model çelişkisi nedeniyle otomatik güç hesabına katılmamalı");
assert.equal(armaturk2080t?.recommendedTankLengthCm,undefined,"Armatürk 2080T kaynak model çelişkisi nedeniyle otomatik uzunluk hesabına katılmamalı");
for (const [model,min,max] of [["1'li Akvaryum Soğutucu Fan",undefined,50],["2'li Akvaryum Soğutucu Fan",undefined,120],["3'lü Akvaryum Soğutucu Fan",150,250],["4'lü Akvaryum Soğutucu Fan",undefined,350]]) {
  const item=armaturkEquipment.find((entry)=>entry.model===model);
  assert.deepEqual([item?.category,item?.recommendedMinL,item?.recommendedMaxL],["other",min,max],`Armatürk ${model} doğrulanmış hacim bilgisini taşımalı`);
}
for (const model of ["Armatür Yedek Ayak","Pipe Holder Dış Filtre Boru Tutucu","12/16 mm Kelepçeli Dış Filtre Vantuzu","Dış Filtre Hortumu 12×16 mm / 1 m","Dış Filtre Hortumu 16×22 mm / 1 m"]) {
  assert.equal(armaturkEquipment.find((entry)=>entry.model===model)?.category,"other",`Armatürk ${model} diğer ekipman seçiminde bulunmalı`);
}

const ejet905 = equipmentCatalog.find((entry) => entry.brand === "Ejet" && entry.model === "905F");
assert(ejet905, "Ejet 905F katalogda bulunmalı");
assert.equal(ejet905.ratedFlowLph, 470, "Ejet 905F debisi 1000 L/saat olarak hatalı kaydedilmemeli");
assert.equal(ejet905.powerW, 7, "Ejet 905F güç bilgisi doğrulanmış 7 W olmalı");
assert.equal(equipmentCatalog.filter((entry) => entry.brand === "Ejet").length, 13, "Ejet'in doğrulanan dış, iç, sünger ve hava motoru portföyü 13 model içermeli");
const ejet101 = equipmentCatalog.find((entry) => entry.brand === "Ejet" && entry.model === "101");
assert.deepEqual([ejet101?.category, ejet101?.requiresAirPump, ejet101?.ratedFlowLph], ["filter", true, undefined], "Ejet 101 pasif pipo filtre olarak kalmalı ve bağımsız pompa debisi uydurulmamalı");
assert.equal(ejet101?.sourceUrl, "https://malawiizmir.com/ejet-101-pipo-uretim-filtre", "Ejet 101 onaylı doğrudan yerel ürün kaynağına bağlanmalı");
assert.equal(ejet101?.verifiedAt, "2026-08-27", "Ejet 101 güncel doğrulama tarihini taşımalı");
const ejet3358 = equipmentCatalog.find((entry) => entry.brand === "Ejet" && entry.model === "3358");
assert.equal(ejet3358?.ratedFlowLph, 750, "Ejet 3358 çelişkili satıcı değerlerinde güncel yetkili satıcının güvenli 750 L/saat değerini kullanmalı");
assert(ejet3358?.specifications.includes("1000 L/saat"), "Ejet 3358 kaynaklar arasındaki debi farkını kullanıcıdan saklamamalı");
const ejetJ103 = equipmentCatalog.find((entry) => entry.brand === "Ejet" && entry.model === "J103");
assert(ejetJ103?.requiresAirPump, "Ejet J103 bağımsız motorlu filtre gibi değerlendirilmemeli");
assert(ejetJ103?.sourceUrl.endsWith("/e-jet-103-uretim-filtresi"), "Ejet J103 doğrudan ürün kaynağına bağlanmalı");
for (const [model, flow, power] of [["906F", 1000, 16], ["907F", 1350, 25], ["908F", 1400, 29.3]]) {
  const item = equipmentCatalog.find((entry) => entry.brand === "Ejet" && entry.model === model);
  assert.equal(item?.ratedFlowLph, flow, `Ejet ${model} çelişkili satıcı değerlerinde güvenli düşük debiyi kullanmalı`);
  assert.equal(item?.powerW, power, `Ejet ${model} doğrulanmış güç değerini taşımalı`);
  assert(item?.sourceUrl.includes(`/urun/e-jet-j${model.toLowerCase()}-`), `Ejet ${model} doğrudan ürün sayfasına bağlanmalı`);
}

const ferplastEquipment = equipmentCatalog.filter((entry) => entry.brand === "Ferplast");
const ferplastCare = careProductCatalog.filter((entry) => entry.brand === "Ferplast");
assert.equal(ferplastEquipment.length, 143, "Ferplast resmî güncel aileleri ve doğrulanmış eski modelleri 143 ekipman kaydı içermeli");
assert.equal(ferplastCare.length, 1, "Ferplast CO₂ Energy sarf kiti bakım kataloğunda bulunmalı");
assert.deepEqual(
  Object.fromEntries(["filter", "heater", "air_pump", "lighting", "other"].map((category) => [category, ferplastEquipment.filter((entry) => entry.category === category).length])),
  {filter:26,heater:21,air_pump:4,lighting:39,other:53},
  "Ferplast cihazları filtre, ısıtıcı, hava motoru, aydınlatma ve yardımcı ekipman olarak doğru ayrılmalı",
);
for (const [model,power] of [["LED BAR FRESHLIFE 45",4.5],["LED BAR FRESHLIFE 90",9],["LED BAR TOPLIFE 70",12],["LED BAR SEALIFE 55",8],["LED BAR PRO TOPLIFE 50",6.5],["HY-LED MINI",5]]) {
  const item = ferplastEquipment.find((entry) => entry.model === model);
  assert.deepEqual([item?.category,item?.powerW], ["lighting",power], `Ferplast ${model} resmî yayımlanmış gücüyle aydınlatma kategorisinde bulunmalı`);
  assert.match(item?.sourceUrl || "", /^https:\/\/www\.ferplast\.com\/products\//, `Ferplast ${model} doğrudan resmî ürün kaynağı taşımalı`);
}
for (const model of ["AQAMAI FRESH S","AQAMAI FRESH M","AQAMAI REEF S","AQAMAI REEF M","AQ-LUX FRESH 500","AQ-LUX FRESH 1100","AQ-LUX REEF 500","AQ-LUX REEF 1100"]) {
  const item = ferplastEquipment.find((entry) => entry.model === model);
  assert.equal(item?.category, "lighting", `Ferplast ${model} aydınlatma kategorisinde bulunmalı`);
  assert.equal(item?.powerW, undefined, `Ferplast ${model} için metin kaynağında yayımlanmayan güç tahmin edilmemeli`);
}
for (const [model, ratedFlowLph, powerW] of [["AIRFIZZ 50",50,2],["AIRFIZZ 100",100,3],["AIRFIZZ 200",200,4],["AIRFIZZ 400",400,5]]) {
  const item = ferplastEquipment.find((entry) => entry.model === model);
  assert.deepEqual([item?.category,item?.ratedFlowLph,item?.powerW,item?.adjustableFlow,item?.verifiedAt], ["air_pump",ratedFlowLph,powerW,true,"2026-08-29"], `Ferplast ${model} resmî model bazlı debi, güç ve ayarlanabilir akış verilerini taşımalı`);
}
for (const model of ["SELTZ L 700","PICO 600","BLUPOWER 1200","SELTZ D DC 4000","SELTZ D AC 12000","KORALIA NANO 2200","KORALIA EVO 5600","KORALIA G3 9000"]) {
  const item = ferplastEquipment.find((entry) => entry.model === model);
  assert.equal(item?.category, "other", `Ferplast ${model} ana filtre kapasitesi gibi sınıflandırılmamalı`);
  assert.equal(item?.ratedFlowLph, undefined, `Ferplast ${model} model numarası doğrulanmış debi yerine kullanılmamalı`);
}
const ferplastBioflo = ferplastEquipment.find((entry) => entry.model === "BIOFLO");
assert.deepEqual([ferplastBioflo?.category,ferplastBioflo?.ratedFlowLph,ferplastBioflo?.recommendedMaxL], ["other",undefined,200], "Ferplast BIOFLO pasif yardımcı filtre olarak kalmalı ve bağımsız debi almamalı");
assert.match(ferplastBioflo?.specifications || "", /bağımsız pompası olmayan pasif/, "Ferplast BIOFLO çalışma biçimini kullanıcıya açıklamalı");
for (const model of ["CHEF PRO","EKOMIXO","MIXO","SMART WAVE","SMART LEVEL","SLIM SKIM NANO","PICO SKIM","BLUSKIMMER 550","E-SKIM DC 1000","SELTZ D SKIM DC 1000"]) {
  assert(ferplastEquipment.some((entry) => entry.model === model), `Ferplast resmî güncel ${model} ailesi katalogda bulunmalı`);
}
for (const item of [...ferplastEquipment.filter((entry) => entry.verifiedAt === "2026-08-27"), ...ferplastCare]) {
  assert.match(item.sourceUrl || "", /^https:\/\/www\.ferplast\.com\/products\//, `Ferplast ${item.model} doğrudan resmî HTTPS ürün kaynağı taşımalı`);
  assert.equal(item.verifiedAt, "2026-08-27", `Ferplast ${item.model} güncel doğrulama tarihini taşımalı`);
}

const yikedaEquipment = equipmentCatalog.filter((entry) => entry.brand === "Yikeda");
assert.equal(yikedaEquipment.length, 28, "Yikeda'nın 24 güncel Türkiye modeli ve dört eski doğrulanmış modeli birlikte 28 kayıt içermeli");
const yikedaModels = new Set(yikedaEquipment.map((entry) => entry.model));
const currentYikedaModels = [
  "SD-48A-B", "SD-48A-S", "YKD-6124 Optik LED Beyaz", "YKD-6124 Optik LED Siyah", "YKD-6126 Optik LED Beyaz", "YKD-6126 Optik LED Siyah",
  "SD-T8-1200JL RGB", "SD-T8-1800JL RGB", "SD-1035 RGB", "SD-1040 RGB", "SD-1045 RGB", "SD-1055 RGB", "SD-1065 RGB",
  "DY-10W", "XT-4W", "Smart UFO 85 W", "Smart UFO 100 W", "Smart UFO 120 W",
  "TP-3,6WHB Tray Light", "TP-3,6WLB Tray Light", "TP-5,6WHB Tray Light", "TP-5,6WLB Tray Light", "TP-7,2WHB Tray Light", "TP-7,2WLB Tray Light",
];
assert.equal(currentYikedaModels.length, 24, "Yikeda yetkili satıcı akvaryum portföyü seçenek düzeyinde 24 model içermeli");
for (const model of currentYikedaModels) {
  assert(yikedaModels.has(model), `Yikeda ${model} katalogda bulunmalı`);
}
for (const model of ["SD-T8-13 W", "DY-10 Spot", "Mini Klipsli LED", "SD-1030 RGB"]) {
  assert(yikedaModels.has(model), `Yikeda eski doğrulanmış model yanlışlıkla silinmemeli: ${model}`);
}
const yikedaSd1045 = yikedaEquipment.find((entry) => entry.model === "SD-1045 RGB");
assert.deepEqual([yikedaSd1045?.powerW, yikedaSd1045?.recommendedTankLengthCm], [45, [80, 90]], "Yikeda SD-1045 güç ve akvaryum uzunluğu korunmalı");
assert(yikedaSd1045?.specifications.includes("3940 lm"), "Yikeda SD-1045 doğrulanmış ışık akısını taşımalı");
const yikedaSd1035 = yikedaEquipment.find((entry) => entry.model === "SD-1035 RGB");
assert.deepEqual([yikedaSd1035?.powerW, yikedaSd1035?.recommendedTankLengthCm], [35, [60,70]], "Yikeda SD-1035 doğrulanmış güç ve akvaryum uzunluğunu taşımalı");
assert(yikedaSd1035?.specifications.includes("2960 lm"), "Yikeda SD-1035 doğrulanmış ışık akısını taşımalı");
const yikedaSdT81800 = yikedaEquipment.find((entry) => entry.model === "SD-T8-1800JL RGB");
assert.deepEqual([yikedaSdT81800?.powerW, yikedaSdT81800?.recommendedTankLengthCm], [22.4, [40,50]], "Yikeda SD-T8-1800JL doğrulanmış güç ve akvaryum uzunluğunu taşımalı");
assert(yikedaSdT81800?.specifications.includes("1960 lm"), "Yikeda SD-T8-1800JL doğrulanmış ışık akısını taşımalı");
for (const model of currentYikedaModels.filter((model) => !model.startsWith("Smart UFO"))) {
  const item = yikedaEquipment.find((entry) => entry.model === model);
  assert(item?.sourceUrl.startsWith("https://atakanpetshop.com/yikeda-"), `Yikeda ${model} doğrudan yetkili satıcı ürün sayfasına bağlanmalı`);
}

const sharkLights = equipmentCatalog.filter((entry) => entry.brand === "Shark");
assert.equal(sharkLights.length, 22, "Shark doğrulanmış aydınlatma seçenekleri tek seri kaydı yerine 22 ayrı model içermeli");
const sharkLightModels = new Set(sharkLights.map((entry) => entry.model));
for (const model of ["Full Spectrum 23 cm / 4 Sıra", "Full Spectrum 33 cm / 4 Sıra", "Full Spectrum 43 cm / 4 Sıra", "Full Spectrum 53 cm / 4 Sıra", "Full Spectrum 63 cm / 4 Sıra", "Full Spectrum 75 cm / 4 Sıra", "Full Spectrum 83 cm / 4 Sıra", "Full Spectrum 93 cm / 4 Sıra", "Full Spectrum 73 cm / 3 Sıra", "Full Spectrum 93 cm / 3 Sıra", "Full Spectrum 113 cm / 3 Sıra", "Full Spectrum 23 cm / 2 Sıra", "Full Spectrum 33 cm / 2 Sıra", "Full Spectrum 53 cm / 2 Sıra", "Grolux 3 Renk Bar LED 60 cm", "Grolux 3 Renk Bar LED 70 cm", "Grolux 3 Renk Bar LED 100 cm", "Full Spectrum 4 Renk Bar LED 70 cm", "Full Spectrum 4 Renk Bar LED 100 cm", "Beyaz Bar LED 80 cm", "Beyaz Bar LED 90 cm", "Beyaz Bar LED 100 cm"]) {
  assert(sharkLightModels.has(model), `Shark ${model} katalogda ayrı seçilebilir olmalı`);
}
assert(!sharkLightModels.has("Full Spectrum 4 Sıra Osram LED (15 uzunluk seçeneği)"), "Shark modelleri tek ve belirsiz seri seçeneğinde birleştirilmemeli");
for (const obsoleteModel of ["Full Spectrum 23 cm / 3 Sıra","Full Spectrum 33 cm / 3 Sıra","Full Spectrum 53 cm / 3 Sıra","Full Spectrum 63 cm / 3 Sıra","Full Spectrum 95 cm / 3 Sıra","Full Spectrum 105 cm / 3 Sıra","Full Spectrum 83 cm / 2 Sıra"]) {
  assert(!sharkLightModels.has(obsoleteModel), `Shark güncel satıcı portföyünde görünmeyen ${obsoleteModel} seçeneğini taşımamalı`);
}
const sharkFourRow93 = sharkLights.find((entry) => entry.model === "Full Spectrum 93 cm / 4 Sıra");
assert.deepEqual([sharkFourRow93?.recommendedTankLengthCm, sharkFourRow93?.specifications.includes("5940 lm")], [[100, 105], true], "Shark 93 cm dört sıra modelinin doğrulanmış ölçü ve ışık akısı korunmalı");
const sharkFourRow75=sharkLights.find((entry)=>entry.model==="Full Spectrum 75 cm / 4 Sıra");
assert.deepEqual([sharkFourRow75?.recommendedTankLengthCm,/lümen değeri yayımlanmıyor/.test(sharkFourRow75?.specifications || "")],[[80,85],true],"Shark 75 cm dört sıra modelinde yayımlanmayan lümen değeri tahmin edilmemeli");
for (const [model,range,lumen] of [["Full Spectrum 23 cm / 2 Sıra",[30,35],"660 lm"],["Full Spectrum 33 cm / 2 Sıra",[40,45],"990 lm"],["Full Spectrum 53 cm / 2 Sıra",[60,65],"1650 lm"],["Full Spectrum 93 cm / 3 Sıra",[100,105],"4455 lm"],["Full Spectrum 53 cm / 4 Sıra",[60,65],"3300 lm"],["Full Spectrum 4 Renk Bar LED 100 cm",[100,100],"1650 lm"]]) {
  const item=sharkLights.find((entry)=>entry.model===model);
  assert.deepEqual([item?.recommendedTankLengthCm,item?.specifications.includes(lumen)],[range,true],`Shark ${model} doğrulanmış ölçü ve ışık akısını taşımalı`);
}

const netlea530 = equipmentCatalog.find((entry) => entry.brand === "Netlea" && entry.model === "530S-AT5");
assert.equal(netlea530?.powerW, 35, "Netlea 530S-AT5 doğrulanmış 35 W bilgisini taşımalı");
assert.deepEqual(netlea530?.recommendedTankLengthCm, [30, 40], "Netlea 530S-AT5 30–40 cm akvaryum aralığını taşımalı");
assert(netlea530?.sourceUrl.includes("530s-at5-rgb-35w"), "Netlea 530S-AT5 doğrudan yerel ürün kaynağına bağlanmalı");
for (const [model, power] of [["NL-5120S-AT5-Z0/4", 120], ["NL-560S-RGB-Z0/4", 60], ["NL-580P-AT5-D0/3", 80], ["NL-6105P-AT5-D0/4", 105], ["AT1e-130S", 30], ["AT1e-145S", 40], ["AT1e-160S", 60], ["AT1e-190S", 85]]) {
  const item = equipmentCatalog.find((entry) => entry.brand === "Netlea" && entry.model === model);
  assert.deepEqual([item?.category, item?.powerW], ["lighting", power], `Netlea ${model} yayımlanmış güç değeriyle aydınlatma kategorisinde bulunmalı`);
}
assert.deepEqual(equipmentCatalog.find((entry) => entry.brand === "Netlea" && entry.model === "NL-5120S-AT5-Z0/4")?.recommendedTankLengthCm, [120, 140], "Netlea 5120S yayımlanmış 120–140 cm montaj aralığını taşımalı");
assert.deepEqual(equipmentCatalog.find((entry) => entry.brand === "Netlea" && entry.model === "NL-6105P-AT5-D0/4")?.recommendedTankLengthCm, [45, 80], "Netlea 6105P yayımlanmış 45–80 cm akvaryum aralığını taşımalı");
for (const [model, flow] of [["No.1 DC Canister Filter", 980], ["No.2 DC Canister Filter", 1500], ["No.2V DC Canister Filter", 1500], ["2F-L Complete", 1100], ["No.2S Hang-on Back Filter", 600]]) {
  const item = equipmentCatalog.find((entry) => entry.brand === "Netlea" && entry.model === model);
  assert.deepEqual([item?.category, item?.ratedFlowLph], ["filter", flow], `Netlea ${model} doğrulanmış debiyle filtre kategorisinde bulunmalı`);
}
for (const model of ["No.1 DC Canister Filter", "No.2 DC Canister Filter", "No.2V DC Canister Filter"]) {
  assert.equal(equipmentCatalog.find((entry) => entry.brand === "Netlea" && entry.model === model)?.adjustableFlow, true, `Netlea ${model} ayarlanabilir debi bilgisini taşımalı`);
}
const netleaAquaticTime = equipmentCatalog.find((entry) => entry.brand === "Netlea" && entry.model === "Aquatic Time No.1 Variable Canister Filter");
assert.deepEqual([netleaAquaticTime?.category, netleaAquaticTime?.ratedFlowLph, netleaAquaticTime?.powerW, netleaAquaticTime?.adjustableFlow], ["filter", 960, 14, true], "Netlea Aquatic Time No.1 yayımlanmış debi, güç ve ayar bilgisini taşımalı");
assert.match(netleaAquaticTime?.specifications || "", /400–960 L\/saat.*4 L/, "Netlea Aquatic Time No.1 debi aralığı ve medya hacmini göstermeli");
const netleaNo2v = equipmentCatalog.find((entry) => entry.brand === "Netlea" && entry.model === "No.2V DC Canister Filter");
assert.deepEqual([netleaNo2v?.powerW, netleaNo2v?.recommendedMinL, netleaNo2v?.recommendedMaxL, netleaNo2v?.recommendedTankLengthCm], [28, 60, 300, [60, 120]], "Netlea No.2V güç, hacim ve akvaryum uzunluğu verilerini taşımalı");
const netleaNo2s = equipmentCatalog.find((entry) => entry.brand === "Netlea" && entry.model === "No.2S Hang-on Back Filter");
assert.deepEqual([netleaNo2s?.powerW, netleaNo2s?.recommendedTankLengthCm, netleaNo2s?.adjustableFlow], [7, [25, 60], true], "Netlea No.2S güç, akvaryum uzunluğu ve debi ayarı verilerini taşımalı");
for (const [model, flow, power] of [["S1500", 1500, 12], ["S3000", 3000, 20], ["S4000", 4000, 25], ["S5500", 5500, 35], ["C1500", 1500, 12]]) {
  const item = equipmentCatalog.find((entry) => entry.brand === "Netlea" && entry.model === model);
  assert.deepEqual([item?.category, item?.ratedFlowLph, item?.powerW, item?.adjustableFlow], ["other", flow, power, true], `Netlea ${model} doğrulanmış pompa verilerini taşımalı`);
}
for (const [model, volume, connection] of [["G1 Prefilter", "3,8 L", "16 mm"], ["G2 Prefilter", "6,9 L", "22 mm"]]) {
  const item = equipmentCatalog.find((entry) => entry.brand === "Netlea" && entry.model === model);
  assert.equal(item?.category, "filter", `Netlea ${model} filtre seçiminde bulunmalı`);
  assert.equal(item?.ratedFlowLph, undefined, `Netlea ${model} için bağımsız pompa debisi varsayılmamalı`);
  assert.equal(item?.passiveComponent, true, `Netlea ${model} kapasite denetiminde motorlu filtre sayılmamalı`);
  assert(item?.specifications.includes(volume) && item?.specifications.includes(connection), `Netlea ${model} doğrulanmış hazne ve bağlantı ölçülerini taşımalı`);
  assert.match(item?.capacityDataNote || "", /Pasif ön filtre.*otomatik filtrasyon hesabına tek başına katılmaz/, `Netlea ${model} biyolojik yük hesabında bağımsız filtre sayılmamalı`);
}

const netleaEquipment = equipmentCatalog.filter((entry) => entry.brand === "Netlea");
const netleaCare = careProductCatalog.filter((entry) => entry.brand === "Netlea");
assert.equal(netleaEquipment.length, 65, "Netlea güncel ve doğrulanmış ekipman kapsamı 65 ayrı kayıt içermeli");
assert.equal(netleaCare.length, 12, "Netlea taban, gübre, bakteri ve filtre medyası kapsamı 12 ayrı kayıt içermeli");
assert.deepEqual(
  Object.fromEntries(["filter", "air_pump", "lighting", "other"].map((category) => [category, netleaEquipment.filter((entry) => entry.category === category).length])),
  {filter:13, air_pump:4, lighting:28, other:20},
  "Netlea ekipmanları kullanıcı seçiminde doğru kategoriye ayrılmalı",
);
for (const [model, category] of [["Aquatic Plant Soil", "substrate"], ["Aquatic Plant Liquid Fertilizer", "fertilizer"], ["Microbial Fiber Ring", "filter_media"], ["Supreme Nitrifying Bacteria Capsule", "bacteria"], ["Fiber Triangle 1 L", "filter_media"]]) {
  const item = netleaCare.find((entry) => entry.model === model);
  assert.equal(item?.category, category, `Netlea ${model} doğru bakım kategorisinde bulunmalı`);
  assert.match(item?.sourceUrl || "", /^https:\/\//, `Netlea ${model} doğrulanabilir HTTPS kaynağı taşımalı`);
  assert.equal(item?.verifiedAt, "2026-08-27", `Netlea ${model} güncel doğrulama tarihini taşımalı`);
}
for (const [model, flow, power] of [["No.1 SF Stainless Canister Filter", 1098, 15], ["No.2 SF Stainless Canister Filter", 1499, 28], ["No.3 SF Stainless Canister Filter", 2699, 35], ["No.4 SF Stainless Canister Filter", 3157, 40]]) {
  const item = netleaEquipment.find((entry) => entry.model === model);
  assert.deepEqual([item?.category, item?.ratedFlowLph, item?.powerW, item?.adjustableFlow], ["filter", flow, power, true], `Netlea ${model} yayımlanmış filtre aralığı ve gücüyle bulunmalı`);
  assert.match(item?.specifications || "", /US gal\/saat.*L\/saat/, `Netlea ${model} kaynak birimini ve litre dönüşümünü açıkça göstermeli`);
}
for (const [model, flow, power, pressure, battery] of [["No.2B Bluetooth Air Pump", 600, 6.5, "0,020 MPa", "17,75 Wh"], ["No.3B Bluetooth Air Pump", 720, 9.5, "0,024 MPa", "48,75 Wh"], ["No.4B Q2/4 Bluetooth Air Pump", 960, 9.5, "0,027 MPa", "73 Wh"], ["No.4B Q9/4 Bluetooth Air Pump", 840, 9.5, "0,022 MPa", "73 Wh"]]) {
  const item = netleaEquipment.find((entry) => entry.model === model);
  assert.deepEqual([item?.category, item?.ratedFlowLph, item?.powerW, item?.adjustableFlow], ["air_pump", flow, power, true], `Netlea ${model} doğrulanmış hava debisi ve azami giriş gücüyle bulunmalı`);
  assert(item?.specifications.includes(pressure) && item?.specifications.includes(battery), `Netlea ${model} basınç ve batarya bilgisini taşımalı`);
  assert.equal(item?.capacityDataNote, undefined, `Netlea ${model} doğrulanmış teknik veriye rağmen kapasite hesabından dışlanmamalı`);
  assert.equal(item?.verifiedAt, "2026-08-29", `Netlea ${model} güncel doğrulama tarihini taşımalı`);
}
const netleaFlowerPrefilter = netleaEquipment.find((entry) => entry.model === "Flower Cartridge Prefilter 16/22");
assert.deepEqual([netleaFlowerPrefilter?.category, netleaFlowerPrefilter?.ratedFlowLph], ["filter", undefined], "Netlea Flower Cartridge pasif ön filtre olarak kalmalı ve pompa debisi uydurulmamalı");
assert.equal(netleaFlowerPrefilter?.passiveComponent, true, "Netlea Flower Cartridge kapasite denetiminde motorlu filtre sayılmamalı");
assert.match(netleaFlowerPrefilter?.capacityDataNote || "", /Pasif ön filtre.*otomatik filtrasyon hesabına tek başına katılmaz/, "Netlea Flower Cartridge biyolojik yük hesabına bağımsız filtre olarak girmemeli");
for (const [model, power] of [["7S-90 Cylinder Light (NL-7S-90-T2)", 90], ["7S-110 Cylinder Light (NL-7S-110-T2)", 110], ["7S-150 Cylinder Light (NL-7S-150-T2)", 150]]) {
  const item = netleaEquipment.find((entry) => entry.model === model);
  assert.deepEqual([item?.category, item?.powerW], ["lighting", power], `Netlea ${model} yayımlanmış güç değeriyle bulunmalı`);
}
for (const [model, power] of [["NL-6140P-AT5-D0/4", 140], ["AT1 PRO 70W", 70], ["AT3 PROS 65W", 65], ["NL-595P-AT5-D0/2", 95], ["NL-5130P-AT5-D0/2", 130], ["AT1 PROS 30W", 30], ["AT3 PROS 40W", 40], ["AT1 PROS 50W", 50]]) {
  const item = netleaEquipment.find((entry) => entry.model === model);
  assert.deepEqual([item?.category, item?.powerW, item?.verifiedAt], ["lighting", power, "2026-08-27"], `Netlea ${model} yerel ürün kaynağındaki güç değeriyle bulunmalı`);
  assert.match(item?.sourceUrl || "", /^https:\/\/www\.cikletistpetshop\.com\//, `Netlea ${model} onaylı yerel doğrulama kaynağına bağlı olmalı`);
}
assert.match(netleaEquipment.find((entry) => entry.model === "NL-6140P-AT5-D0/4")?.specifications || "", /128 LED.*68 × 18 cm/, "Netlea NL-6140P LED sayısı ve gövde ölçüsünü taşımalı");
assert.match(netleaEquipment.find((entry) => entry.model === "AT1 PRO 70W")?.specifications || "", /2000–9000 K.*120 × 50 × 50 cm/, "Netlea AT1 PRO yayımlanmış renk sıcaklığı ve üst akvaryum ölçüsünü taşımalı");
assert.match(netleaEquipment.find((entry) => entry.model === "NL-5130P-AT5-D0\/2")?.specifications || "", /60 × 16 cm/, "Netlea NL-5130P yayımlanmış gövde ölçüsünü taşımalı");
for (const model of ["AT6S III 6105P", "AT6S III 6140P", "AT7S II 7160P"]) {
  const item = netleaEquipment.find((entry) => entry.model === model);
  assert.equal(item?.category, "lighting", `Netlea ${model} aydınlatma kategorisinde bulunmalı`);
  assert.equal(item?.powerW, undefined, `Netlea ${model} için metin kaynağında yayımlanmayan güç değeri tahmin edilmemeli`);
}
for (const model of ["V1500", "V3000", "V4000", "C2500S", "C5000S", "C9000S"]) {
  const item = netleaEquipment.find((entry) => entry.model === model);
  assert.deepEqual([item?.category, item?.adjustableFlow, item?.ratedFlowLph], ["other", true, undefined], `Netlea ${model} ayarlanabilir su motoru olmalı; model numarası debi varsayımına dönüştürülmemeli`);
}
for (const model of ["L-Type Single-Arm Light Stand", "Light Panel Connector", "Dedicated Light Panel Stand"]) {
  const item = netleaEquipment.find((entry) => entry.model === model);
  assert.equal(item?.category, "other", `Netlea ${model} filtre veya aydınlatma kapasitesi gibi sınıflandırılmamalı`);
  assert.equal(item?.sourceUrl, "https://www.netlea.com/cpzx-szyp.html", `Netlea ${model} resmî ürün merkezi kaynağına bağlı olmalı`);
}
for (const item of [...netleaEquipment.filter((entry) => entry.verifiedAt === "2026-08-27"), ...netleaCare]) {
  assert.match(item.sourceUrl, /^https:\/\//, `Netlea ${item.model} HTTPS kaynak bağlantısı taşımalı`);
  assert.match(item.verifiedAt, /^\d{4}-\d{2}-\d{2}$/, `Netlea ${item.model} ISO doğrulama tarihi taşımalı`);
}

const creaquaEquipment = equipmentCatalog.filter((entry) => entry.brand === "Creaqua");
assert.equal(creaquaEquipment.length, 45, "Creaqua aydınlatma, CO₂, filtrasyon, bakım ve su hazırlama portföyü 45 seçenek içermeli");
for (const [model, power, length] of [["Sigma PW 5,5 W", 5.5, [35, 55]], ["Sigma PW 16,5 W", 16.5, [90, 115]], ["Nano Elite Black 17 W", 17, undefined], ["Nano S Black 6,5 W", 6.5, [10, 50]]]) {
  const item = equipmentCatalog.find((entry) => entry.brand === "Creaqua" && entry.model === model);
  assert.equal(item?.powerW, power, `Creaqua ${model} güncel üretici gücünü taşımalı`);
  if (length) assert.deepEqual(item?.recommendedTankLengthCm, length, `Creaqua ${model} doğrulanmış akvaryum uzunluğunu taşımalı`);
}
for (const [model, power, lumen, length] of [["Alpha RGB+W 60", 74, "7452 lm", [60, 85]], ["Alpha RGB+W 90", 111, "11178 lm", [90, 115]], ["Alpha RGB+W 120", 148, "14904 lm", [120, 150]], ["Alpha RGB+W 150", 185, "18630 lm", [150, 175]]]) {
  const item = equipmentCatalog.find((entry) => entry.brand === "Creaqua" && entry.model === model);
  assert.deepEqual([item?.powerW, item?.recommendedTankLengthCm], [power, length], `Creaqua ${model} resmi güç ve uzunluk verilerini taşımalı`);
  assert(item?.specifications.includes(lumen), `Creaqua ${model} resmi ışık akısını göstermeli`);
}
for (const [model, power, length] of [["Delta Marine 35", 15, [35, 55]], ["Delta Marine 40", 15, [40, 55]], ["Delta Marine 60", 30, [60, 80]]]) {
  const item = equipmentCatalog.find((entry) => entry.brand === "Creaqua" && entry.model === model);
  assert.deepEqual([item?.category, item?.powerW, item?.recommendedTankLengthCm], ["lighting", power, length], `Creaqua ${model} ayrı ve doğrulanmış resif aydınlatması olmalı`);
}
const creaquaCare = careProductCatalog.filter((item) => item.brand === "Creaqua");
assert.equal(creaquaCare.length, 101, "Creaqua akvaryum, mobilya, teraryum, tasarım, bakım ve taban portföyü 101 ayrı seçenek içermeli");
for (const [model, category] of [["Plant Nutrition Macro 250 ml", "fertilizer"], ["GH Plus 250 ml", "water_conditioner"], ["Cycle Booster", "bacteria"], ["Hivex", "filter_media"], ["Cosmetics River Sand 3 L", "substrate"]]) {
  const item = creaquaCare.find((entry) => entry.model === model);
  assert.equal(item?.category, category, `Creaqua ${model} doğru bakım kategorisinde bulunmalı`);
  assert.match(item?.sourceUrl || "", /^https:\/\//, `Creaqua ${model} doğrulama kaynağı taşımalı`);
}
for (const model of ["Askı Profili 120 × 20 cm", "Askı Profili 150 × 25 cm", "Chrome Pipe 12/16 mm", "Chrome Pipe 16/22 mm", "Chrome Pipe 16/22 mm emiş – 12/16 mm basış", "Pipe Holder"]) {
  const item = creaquaEquipment.find((entry) => entry.model === model);
  assert.deepEqual([item?.category, item?.passiveComponent, item?.ratedFlowLph], ["other", true, undefined], `Creaqua ${model} pasif aksesuar olmalı ve filtre debisi taşımamalı`);
  assert.equal(item?.verifiedAt, "2026-09-14", `Creaqua ${model} güncel doğrulama tarihini taşımalı`);
}
const creaquaCompact = creaquaEquipment.find((entry) => entry.model === "Compact RO Sistemi");
assert.deepEqual([creaquaCompact?.category, creaquaCompact?.passiveComponent, creaquaCompact?.ratedFlowLph, creaquaCompact?.recommendedMaxL], ["other", true, undefined, undefined], "Creaqua Compact günlük ozmos üretimini akvaryum filtre debisi veya hacim kapasitesi gibi kullanmamalı");
const creaquaExpress = creaquaEquipment.find((entry) => entry.model === "Express Su Değişim Ön Filtresi");
assert.deepEqual([creaquaExpress?.category, creaquaExpress?.passiveComponent, creaquaExpress?.ratedFlowLph, creaquaExpress?.recommendedMaxL], ["other", true, undefined, undefined], "Creaqua Express ön filtresi akvaryum filtre debisi veya hacim kapasitesi gibi kullanılmamalı");
const creaquaEraser = creaquaEquipment.find((entry) => entry.model === "Eraser Brick");
assert.deepEqual([creaquaEraser?.category, creaquaEraser?.passiveComponent, creaquaEraser?.powerW], ["other", true, undefined], "Creaqua Eraser Brick pasif bakım aracı olmalı ve cihaz gücü taşımamalı");
for (const [model, category, dimensions] of [
  ["Crystal 45 30×30×30 cm", "tank", [30,30,30]],
  ["Crystal Classic 150×50×50 cm", "tank", [150,50,50]],
  ["Stand 45 120×55×80 cm", "cabinet", [120,55,80]],
  ["Bitkili Teraryum 60×60×90 cm", "terrarium", [60,60,90]],
  ["Reptile Teraryum 100×50×60 cm", "terrarium", [100,50,60]],
  ["Desktop Nano Stand 50×30×10 cm", "cabinet", [50,30,10]],
]) {
  const item = creaquaCare.find((entry) => entry.model === model);
  assert.equal(item?.category, category, `Creaqua ${model} doğru yapısal kategoride bulunmalı`);
  assert.deepEqual(item?.dimensionsCm, dimensions, `Creaqua ${model} resmî ölçülerini taşımalı`);
  assert.equal(item?.verifiedAt, "2026-09-14", `Creaqua ${model} güncel doğrulama tarihini taşımalı`);
}
assert.deepEqual(creaquaCare.find((entry) => entry.model === "AquaMat 90×50 cm")?.footprintCm, [90,50], "Creaqua AquaMat resmî taban ölçüsünü taşımalı");
for (const model of ["REVEX 100 ml", "REVEX 250 ml", "REVEX 500 ml", "Clarifier Filter Pad 50×25 cm", "Media Bag 15×15 cm"]) {
  const item = creaquaCare.find((entry) => entry.model === model);
  assert.equal(item?.category, "filter_media", `Creaqua ${model} filtre medyası veya filtre aksesuarı ürünlerinde bulunmalı`);
  assert.equal(item?.verifiedAt, "2026-09-14", `Creaqua ${model} güncel doğrulama tarihini taşımalı`);
}
for (const model of ["Ribbed Wood", "Spotted Wood", "Black Flame", "Red Velt", "Arbour Wood", "Bucelog", "Twigy Dark", "Twigy Light", "Twigy Mix", "Twigy Large Dark", "Twigy Large Light", "MossRock", "Frodo Stone", "Gray Moon Stone", "Orange Moon Stone", "Galapagos Rock", "Keitir Stone", "Plantie Kahverengi 500 cm", "Plantie Yeşil 500 cm"]) {
  const item = creaquaCare.find((entry) => entry.model === model);
  assert.equal(item?.category, "decoration", `Creaqua ${model} tasarım/bakım ürünlerinde bulunmalı`);
  assert.match(item?.sourceUrl || "", /^https:\/\/www\.creaqua\.com\.tr\//, `Creaqua ${model} doğrudan resmî kaynağa bağlı olmalı`);
  assert.equal(item?.verifiedAt, "2026-09-14", `Creaqua ${model} güncel doğrulama tarihini taşımalı`);
}
for (const model of ["Alder Cones", "Kurrajong Pods", "Banana Leaves", "Just Clear 250 ml"]) {
  const item = creaquaCare.find((entry) => entry.model === model);
  assert.equal(item?.category, "water_conditioner", `Creaqua ${model} su düzenleyici ürünlerinde bulunmalı`);
  assert.equal(item?.verifiedAt, "2026-09-14", `Creaqua ${model} güncel doğrulama tarihini taşımalı`);
}
const creaquaHoseColors = ["Şeffaf", "Siyah", "Metalik Gri", "Cam Mavisi"];
for (const color of creaquaHoseColors) {
  const item = creaquaEquipment.find((entry) => entry.model === `CO₂ Hortumu 2 m ${color}`);
  assert.deepEqual([item?.category, item?.passiveComponent, item?.sourceUrl, item?.verifiedAt], ["co2", true, "https://www.creaqua.com.tr/tr/co2-sistemi/15-co2-hortumu.html", "2026-09-14"], `Creaqua ${color} CO₂ hortumu resmî ve pasif seçenek olmalı`);
}
const creaquaBrownSand = creaquaCare.find((entry) => entry.model === "Cosmetics Brown Sand");
assert.equal(creaquaBrownSand?.category, "substrate", "Creaqua Brown kozmetik kum taban ürünlerinde bulunmalı");
assert.match(creaquaBrownSand?.description || "", /paket hacmi yayımlamadığı/, "Creaqua Brown için yayımlanmayan paket miktarı tahmin edilmemeli");

const creaquaAll = [...creaquaEquipment, ...creaquaCare];
const creaquaOfficialFamilies = [
  "Crystal 45", "Stand 45", "AquaMat", "Askı Profili", "Bubblegun", "CO₂ İndikatör Sıvısı", "CO₂ Hortumu 2 m", "Macro", "Micro", "Potassium", "GH Plus", "EXALG",
  "Chrome Pipe", "Pipe Holder", "Ribbed Wood", "MossRock", "Frodo Stone", "Cosmetics Natural Sand", "Delta PW", "Nano Elite", "Nano S", "Spotted Wood", "Black Flame", "Compact RO",
  "Express Su", "Cosmetics Beige Sand", "Cosmetics Black Sand", "Cosmetics White Sand", "Cosmetics River Sand", "Low Tech", "Cocoon", "Damla Sayacı", "Hivex", "Gray Moon Stone", "Orange Moon Stone", "Galapagos Rock",
  "Cosmetics Brown Sand", "Plantie", "REVEX", "Active Carbon", "Red Velt", "Keitir Stone", "CO₂ İndikatör Seti", "Nitrogen", "Phosphate", "Iron", "Eraser Brick", "Clarifier Filter Pad",
  "Six Up", "Desktop Nano Stand", "Media Bag", "Purifier Filter Pad", "Crystal Classic", "Avant Guard", "Regülatörü", "Just Clear", "Cycle Booster", "Bitkili Teraryum", "Arbour Wood", "Twigy Dark",
  "Bucelog", "Twigy Large", "Alpha RGB+W", "Sigma PW", "Delta Marine", "Alpha PW", "Reptile Teraryum", "Alder Cones", "Kurrajong Pods", "Banana Leaves",
];
assert.equal(creaquaOfficialFamilies.length, 70, "Creaqua güncel ürün dizini 70 aileden oluşmalı");
for (const family of creaquaOfficialFamilies) {
  assert(creaquaAll.some((entry) => entry.model.includes(family)), `Creaqua resmî 70 aile kapsamı ${family} kaydını içermeli`);
}

const orionLed = equipmentCatalog.filter((entry) => entry.brand === "OrionLED");
assert.equal(orionLed.length, 164, "OrionLED güncel resmî akvaryum aydınlatma aileleriyle 164 ayrı seçenek içermeli");
for (const [prefix, expectedCount] of [
  ["Grolux A ", 8],
  ["Grolux T8-", 5],
  ["C ", 14],
  ["D-REEF ", 3],
  ["D-RGBW ", 14],
]) {
  assert.equal(orionLed.filter((entry) => entry.model.startsWith(prefix)).length, expectedCount, `OrionLED ${prefix.trim()} seçenek sayısı resmî tabloyla aynı olmalı`);
}
for (const model of ["Nano Arc", "Nano M1-B", "Nano C Reef", "Nano Grolux"]) {
  const item = orionLed.find((entry) => entry.model === model);
  assert.equal(item?.verifiedAt, "2026-09-14", `OrionLED ${model} güncel doğrulama tarihini taşımalı`);
  assert.match(item?.sourceUrl || "", /^https:\/\/orionled\.com\.tr\/urun\//, `OrionLED ${model} doğrudan resmî ürün kaynağına bağlanmalı`);
}
assert.deepEqual(
  [orionLed.find((entry) => entry.model === "Grolux T8-60")?.powerW, orionLed.find((entry) => entry.model === "Grolux T8-60")?.recommendedTankLengthCm],
  [11, [65, 80]],
  "OrionLED Grolux T8-60 resmî güç ve akvaryum uzunluğu değerlerini taşımalı",
);
assert.deepEqual(
  [orionLed.find((entry) => entry.model === "D-REEF 90")?.powerW, orionLed.find((entry) => entry.model === "D-REEF 90")?.recommendedTankLengthCm],
  [100, [90, 100]],
  "OrionLED D-REEF 90 resmî güç ve akvaryum uzunluğu değerlerini taşımalı",
);

for (const model of ["Nano M-1 Karışık Renkli", "Nano M-2", "Nano M-3", "Fanus & Nano Gooseneck 5V", "Fanus Mini LED Siyah"]) {
  const item = orionLed.find((entry) => entry.model === model);
  assert.equal(item?.verifiedAt, "2026-09-14", "OrionLED "+model+" güncel doğrulama tarihini taşımalı");
  assert.match(item?.sourceUrl || "", /^https:\/\/orionled\.com\.tr\/urun\//, "OrionLED "+model+" doğrudan resmî ürün kaynağına bağlanmalı");
}
assert.equal(orionLed.filter((entry) => entry.model.startsWith("Plant A ")).length, 14, "OrionLED Plant A resmî tabloda yayımlanan 14 boy seçeneğini içermeli");
assert(orionLed.filter((entry) => entry.model.startsWith("Plant A ")).every((entry) => entry.powerW === undefined && entry.specifications.includes("güç yayımlanmıyor")), "OrionLED Plant A için yayımlanmayan güç değeri tahmin edilmemeli");
assert.equal(orionLed.filter((entry) => entry.model.startsWith("SPOT 24V 12W ")).length, 3, "OrionLED SPOT resmî 3000K, 4000K ve 6500K seçeneklerini ayrı ayrı içermeli");
assert.equal(orionLed.filter((entry) => entry.model.startsWith("NANO SPOT 5V 3W ")).length, 3, "OrionLED NANO SPOT resmî 3000K, 4000K ve 6500K seçeneklerini ayrı ayrı içermeli");
assert.equal(orionLed.filter((entry) => /^B-\d+$/.test(entry.model)).length, 8, "OrionLED B serisi resmî sekiz ölçü seçeneğini içermeli");
assert.equal(orionLed.filter((entry) => entry.model.startsWith("C RGB-W ")).length, 7, "OrionLED C RGB-W serisi resmî yedi ölçü seçeneğini içermeli");
assert.equal(orionLed.filter((entry) => entry.model.startsWith("Bluetooth RGB ")).length, 14, "OrionLED Bluetooth RGB serisi resmî 14 ölçü seçeneğini içermeli");
assert(orionLed.filter((entry) => entry.model.startsWith("Bluetooth RGB ")).every((entry) => entry.powerW === undefined && entry.specifications.includes("güç yayımlanmıyor")), "OrionLED Bluetooth RGB için yayımlanmayan güç değeri tahmin edilmemeli");
assert.deepEqual(
  [orionLed.find((entry) => entry.model === "B-80")?.powerW, orionLed.find((entry) => entry.model === "B-80")?.recommendedTankLengthCm],
  [36, [85, 90]],
  "OrionLED B-80 resmî güç ve akvaryum uzunluğu değerlerini taşımalı",
);
assert.equal(orionLed.filter((entry) => entry.model.includes("Extreme B 80")).length, 0, "Eski tekil Extreme B 80 kaydı tam B serisiyle yinelenmemeli");
assert.equal(orionLed.filter((entry) => entry.model.startsWith("Aquaslim Grolux Fire ")).length, 8, "OrionLED Aquaslim Grolux Fire resmî sekiz boy seçeneğini içermeli");
assert.equal(orionLed.filter((entry) => entry.model.startsWith("Aquaslim Grolux Ice ")).length, 8, "OrionLED Aquaslim Grolux Ice resmî sekiz boy seçeneğini içermeli");
assert.equal(orionLed.filter((entry) => entry.model.startsWith("Aquaslim Royal Mavi ")).length, 11, "OrionLED Aquaslim Royal Mavi mağazada seçilebilen 11 boyu içermeli");
assert.equal(orionLed.filter((entry) => entry.model.startsWith("Shade Mirror D-")).length, 14, "OrionLED Shade Mirror mağazada seçilebilen yedi boy ve iki rengi içermeli");
for (const model of ["Aquaslim Royal Mavi 35", "Aquaslim Royal Mavi 65"]) {
  const item = orionLed.find((entry) => entry.model === model);
  assert.equal(item?.powerW, undefined, "OrionLED "+model+" için resmî tabloda yayımlanmayan güç tahmin edilmemeli");
  assert(item?.specifications.includes("güç yayımlanmıyor"), "OrionLED "+model+" eksik teknik değeri kullanıcıya açıklamalı");
}
for (const color of ["Gri", "Siyah"]) {
  const item = orionLed.find((entry) => entry.model === "Shade Mirror D-115 "+color);
  assert.equal(item?.recommendedTankLengthCm, undefined, "Shade Mirror D-115 "+color+" için D-120 tablosundan uyumluluk tahmin edilmemeli");
  assert(item?.specifications.includes("D-120") && item?.specifications.includes("çeliştiği"), "Shade Mirror D-115 "+color+" mağaza ve açıklama çelişkisini göstermeli");
}
for (const family of [
  "Aquaslim Grolux Fire", "Aquaslim Grolux Ice", "Aquaslim Royal Mavi", "Bluetooth RGB",
  "Shade Mirror", "Nano M1-B", "B-20", "C 30 Black / Grey", "C RGB-W 30", "D-REEF 45",
  "D-RGBW 35 Black", "D-RGBW 35 Grey", "Plant E 20", "Fanus & Nano Gooseneck", "Fanus Mini",
  "Grolux A", "Grolux T8", "Nano Arc", "Nano C Reef", "Nano Grolux", "Nano M-1",
  "Nano M-2", "Nano M-3", "NANO SPOT 5V", "Plant A", "SPOT 24V",
]) {
  assert(orionLed.some((entry) => entry.model.includes(family)), "OrionLED güncel ürün ailesi katalogda bulunmalı: "+family);
}
assert(orionLed.some((entry) => entry.model === "Aquaslim 20"), "OrionLED Aquaslim 4 Renk ailesi katalogda bulunmalı");

const waterbear = equipmentCatalog.filter((entry) => entry.brand === "WaterBear");
assert.equal(waterbear.length, 34, "WaterBear'ın doğrulanan filtre, hava motoru, pompa ve bakım ekipmanı portföyü 34 model içermeli");
for (const [model, flow, power] of [["Q418", 120, 4], ["Q428", 420, 6], ["Q448", 840, 10], ["Q458", 1200, 12]]) {
  const item = waterbear.find((entry) => entry.model === model);
  assert.deepEqual([item?.ratedFlowLph, item?.powerW], [flow, power], `WaterBear ${model} güncel hava debisi ve güç bilgisini taşımalı`);
}
for (const model of ["WB-1770", "WB-2770", "WB-3770", "WB-4770", "WB-G800", "WB-G810"]) {
  assert.equal(waterbear.find((entry) => entry.model === model)?.category, "filter", `WaterBear ${model} filtre kategorisinde olmalı`);
}
for (const [model, flow] of [["WB-D303", 2500], ["WB-D305", 3300], ["WB-D307", 4000], ["WB-Z601", 3000], ["WB-Z602", 7000]]) {
  assert.equal(waterbear.find((entry) => entry.model === model)?.ratedFlowLph, flow, `WaterBear ${model} doğrulanmış debiyi taşımalı`);
}

const boyuDgn120a = equipmentCatalog.find((entry) => entry.brand === "Boyu" && entry.model === "DGN-120A");
assert(boyuDgn120a, "Boyu DGN-120A katalogda bulunmalı");
assert.equal(boyuDgn120a.ratedFlowLph, 1200, "Boyu DGN-120A debisi doğrulanmış 1200 L/saat olmalı");
assert.equal(boyuDgn120a.powerW, 55, "Boyu DGN-120A pompa gücü doğrulanmış 55 W olmalı");
assert.equal(boyuDgn120a.integratedUvcW, 13, "Boyu DGN-120A UV-C gücü doğrulanmış 13 W olmalı");
const boyuDgn120 = equipmentCatalog.find((entry) => entry.brand === "Boyu" && entry.model === "DGN-120");
assert.equal(boyuDgn120?.ratedFlowLph, 1200, "Boyu DGN-120 debisi doğrulanmış 1200 L/saat olmalı");
assert.equal(boyuDgn120?.powerW, 55, "Boyu DGN-120 pompa gücü doğrulanmış 55 W olmalı");
assert.equal(boyuDgn120?.integratedUvcW, undefined, "DGN-120A UV-C gücü DGN-120 modeline varsayımla kopyalanmamalı");
const boyuSp1300c = equipmentCatalog.find((entry) => entry.brand === "Boyu" && entry.model === "SP-1300C");
assert.deepEqual([boyuSp1300c?.ratedFlowLph, boyuSp1300c?.powerW], [400, 9], "Boyu SP-1300C resmî model görselindeki debi ve gücü taşımalı");
assert.equal(boyuSp1300c?.sourceUrl, "https://www.boyuaquarium.com/En_Pr_d_gci_27_id_64.html", "Boyu SP-1300C doğrudan üretici ürün sayfasına bağlanmalı");
assert.equal(boyuSp1300c?.verifiedAt, "2026-09-06", "Boyu SP-1300C güncel doğrulama tarihini taşımalı");
assert.equal(boyuSp1300c?.capacityDataNote, undefined, "Boyu SP-1300C otomatik filtrasyon hesabına katılmalı");
for (const [model, flow, power] of [["CJY-1000", 60, 1.7], ["CJY-1500", 90, 2.2], ["SES-20", 1200, 15], ["SES-30", 1800, 25], ["SES-60", 3600, 35]]) {
  const item = equipmentCatalog.find((entry) => entry.brand === "Boyu" && entry.model === model);
  assert.deepEqual([item?.category, item?.ratedFlowLph, item?.powerW], ["air_pump", flow, power], `Boyu ${model} doğrulanmış hava debisi ve güç değerini taşımalı`);
  assert(item?.sourceUrl.includes("akvaryumexpress.com"), `Boyu ${model} güvenilir yerel ürün kaynağına bağlanmalı`);
}
for (const [model, flow, power] of [["WP-880F", 650, 15], ["WP-505C", 500, 5], ["FG-1202", 880, 12], ["WP-909C", 1600, 28], ["WP-308H", 580, 5.8], ["WP-1108F", 700, 8], ["WP-508H", 680, 6.8], ["WP-606H", 500, 10], ["WP-628H", 400, 6], ["WP-808C", 800, 15], ["WP-707C", 650, 12], ["SF-350F", 300, 5], ["WP-618H", 280, 5], ["WP-206H", 250, 3], ["WP-638H", 500, 6.8], ["WP-408H", 600, 6]]) {
  const item = equipmentCatalog.find((entry) => entry.brand === "Sobo" && entry.model === model);
  assert.deepEqual([item?.category, item?.ratedFlowLph, item?.powerW], ["filter", flow, power], `Sobo ${model} doğrulanmış filtre debisi ve güç değerini taşımalı`);
  assert(item?.sourceUrl.includes("akvaryumexpress.com"), `Sobo ${model} güvenilir yerel ürün kaynağına bağlanmalı`);
}
const soboSf150f = equipmentCatalog.find((entry) => entry.brand === "Sobo" && entry.model === "SF-150F");
assert.equal(soboSf150f?.ratedFlowLph, 260, "Sobo SF-150F ortak doğrulanan 260 L/saat debiyi taşımalı");
assert.equal(soboSf150f?.powerW, undefined, "Sobo SF-150F çelişkili güç değeri otomatik hesaplarda kesin kabul edilmemeli");
for (const [model, flow, power] of [["WP-200D", 1800, 25], ["WP-100D", 560, 7], ["PD-1", 200, 1], ["PD-2", 200, 1], ["PD-3", 200, 1], ["AQ-018", 600, 8], ["AQ-028", 800, 10], ["AQ-038", 1000, 15], ["WP-50M", 3000, 3]]) {
  const item = equipmentCatalog.find((entry) => entry.brand === "Sobo" && entry.model === model);
  assert.deepEqual([item?.category, item?.ratedFlowLph, item?.powerW], ["other", flow, power], `Sobo ${model} pompa debisi filtre çevrimi olarak değerlendirilmemeli`);
}
const soboWp300f = equipmentCatalog.find((entry) => entry.brand === "Sobo" && entry.model === "WP-300F");
assert.equal(soboWp300f?.ratedFlowLph, undefined, "Sobo WP-300F debisi yayımlanmadığı için tahmin edilmemeli");
assert.deepEqual([soboWp300f?.recommendedMinL, soboWp300f?.recommendedMaxL], [5, 10], "Sobo WP-300F yalnızca yayımlanan hacim aralığını kullanmalı");
for (const [model, flow, power] of [["WP-3880F", 2500, 40], ["WP-1105F", 200, 5], ["WP-377F", 1500, 20], ["WP-3200F", 1200, 25]]) {
  const item = equipmentCatalog.find((entry) => entry.brand === "Sobo" && entry.model === model);
  assert.deepEqual([item?.category, item?.ratedFlowLph, item?.powerW], ["filter", flow, power], `Sobo ${model} ikinci kaynak taramasındaki doğrulanmış değerleri taşımalı`);
}
assert.equal(equipmentCatalog.find((entry) => entry.brand === "Sobo" && entry.model === "WP-1105F")?.recommendedMaxL, 40, "Sobo WP-1105F yayımlanmış 30–40 litre aralığını taşımalı");
assert(equipmentCatalog.find((entry) => entry.brand === "Sobo" && entry.model === "WP-1105F")?.sourceUrl.includes("sobo-wp-1105f"), "Sobo WP-1105F ilgisiz Eheim görseline bağlanmamalı");
assert(equipmentCatalog.find((entry) => entry.brand === "Sobo" && entry.model === "WP-377F")?.sourceUrl.includes("cikletistpetshop.com"), "Sobo WP-377F güvenilir doğrudan ürün kaynağına bağlanmalı");
assert(equipmentCatalog.find((entry) => entry.brand === "Sobo" && entry.model === "WP-3200F")?.sourceUrl.includes("sobo.com.tr"), "Sobo WP-3200F farklı güçteki başka ürüne bağlanmamalı");
for (const model of ["AF2003", "AF2005", "AF2005D", "AF2009D", "AF2020"]) {
  const item = equipmentCatalog.find((entry) => entry.brand === "Resun" && entry.model === model);
  assert.equal(item?.category, "other", `Resun ${model} diğer ekipman kategorisinde listelenmeli`);
  assert.equal(item?.ratedFlowLph, undefined, `Resun ${model} filtrasyon debisi taşımamalı`);
}
const resunCurrentTurkeyModels = [
  "AF2005D", "AIR-1000", "AIR-2000", "AIR-3000", "CX-400 ClearMax", "LP-20",
  "Manuel Dip Sifonu", "MB-S Mıknatıslı Cam Sileceği", "MB-L Mıknatıslı Cam Sileceği", "RST04 Cam Termometre",
];
for (const model of resunCurrentTurkeyModels) {
  const item = equipmentCatalog.find((entry) => entry.brand === "Resun" && entry.model === model);
  assert(item, `Resun güncel Türkiye portföyündeki ${model} katalogda bulunmalı`);
}
for (const [model, flow, power] of [["AIR-1000", 60, 2], ["AIR-2000", 140, 3], ["AIR-3000", 360, 3.5]]) {
  const item = equipmentCatalog.find((entry) => entry.brand === "Resun" && entry.model === model);
  assert.deepEqual([item?.category, item?.ratedFlowLph, item?.powerW], ["air_pump", flow, power], `Resun ${model} güncel toplam hava debisini ve gücü taşımalı`);
  assert.equal(item?.sourceUrl, `https://malawiizmir.com/resun-air-${model.slice(4).toLowerCase()}-${model === "AIR-1000" ? "tek-ikisli-hava-motoru" : model === "AIR-2000" ? "hava-pompasi-1-8-litre-dakika" : "hava-motoru-3-litre-dakika"}`, `Resun ${model} doğrudan güncel ürün kaynağına bağlanmalı`);
  assert.equal(item?.verifiedAt, "2026-08-26", `Resun ${model} güncel doğrulama tarihini taşımalı`);
}
const resunCx400 = equipmentCatalog.find((entry) => entry.brand === "Resun" && entry.model === "CX-400 ClearMax");
assert.deepEqual([resunCx400?.category, resunCx400?.ratedFlowLph, resunCx400?.powerW, resunCx400?.recommendedMinL, resunCx400?.recommendedMaxL], ["filter", 340, 5.5, 38, 57], "Resun CX-400 resmî tablodaki 220–240 V değerlerini taşımalı");
const resunOfficialFilterExpected = [
  ["BC300",300,4.5,20,40], ["BC450",450,5.5,40,80], ["BC650",650,8.5,60,120],
  ["EFC300",300,4], ["EFC550",550,10], ["GF400",360,4], ["GF800",820,7], ["CX-200 ClearMax",180,3,8,30],
  ["CS400",400,6,40,80], ["CS700",700,10,70,140], ["CS1000",1000,15,100,200], ["CS1500",1500,25,150,300], ["CS2000",2000,30,200,400],
  ["MAGI200",208,5,20,40], ["MAGI380",380,7,40,80], ["MAGI700",606,10,60,120], ["MAGI1000",852,20,80,200],
  ["HS300",300,4,40,120], ["CY20",200,3,undefined,60], ["BF80",260,5.5,undefined,80], ["BF100",300,5.8,undefined,100], ["BF200",550,10,undefined,200],
  ["EVF600",600,6.5], ["EVF900",900,10], ["EVF1200",1200,17.5], ["EF1600",1600,35], ["EF1600U",1600,35,undefined,undefined,11], ["EF2800",2800,60], ["EF2800U",2800,60,undefined,undefined,11],
];
for (const [model, flow, power, minL, maxL, uvW] of resunOfficialFilterExpected) {
  const item = equipmentCatalog.find((entry) => entry.brand === "Resun" && entry.model === model);
  assert.equal(item?.category, "filter", `Resun resmî güncel filtre ailesindeki ${model} filtre kategorisinde bulunmalı`);
  assert.deepEqual([item?.ratedFlowLph, item?.powerW, item?.recommendedMinL, item?.recommendedMaxL, item?.integratedUvcW], [flow, power, minL, maxL, uvW], `Resun ${model} resmî görsel teknik tablodaki değerleri taşımalı`);
  assert.equal(item?.capacityDataNote, undefined, `Resun ${model} doğrulanmış kapasiteye rağmen otomatik hesaptan dışlanmamalı`);
  assert(item?.sourceUrl.startsWith("https://www.resun-china.com/h-pd-"), `Resun ${model} doğrudan resmî seri sayfasına bağlanmalı`);
  assert.equal(item?.verifiedAt, "2026-08-29", `Resun ${model} güncel doğrulama tarihini taşımalı`);
}
for (const model of ["U2", "Terminator 11", "Terminator 18", "Terminator 36", "Terminator 56"]) {
  const item = equipmentCatalog.find((entry) => entry.brand === "Resun" && entry.model === model);
  assert.equal(item?.category, "uv", `Resun ${model} yalnızca UV kategorisinde listelenmeli`);
  assert.equal(item?.powerW, undefined, `Resun ${model} için model adından güç değeri tahmin edilmemeli`);
  assert(item?.sourceUrl.startsWith("https://www.resun-china.com/h-pd-"), `Resun ${model} resmî UV seri sayfasına bağlanmalı`);
}
const resunOfficialCurrentPumpModels = [
  "SP500 / SP55", "SP600 / SP65", "SP650 / SP80", "SP980 / SP130", "SP800 / SP75", "SP880 / SP98",
  "FLOW700 / KING160", "FLOW1000 / KING290", "FLOW1500 / KING400", "FLOW2400 / KING590",
  "FLOW4000 / KING1000", "FLOW4800 / KING1340", "FLOW6000 / KING1630", "FLOW8500 / KING2160",
  "S400", "S700", "S1000", "S1500", "S2000", "S3000", "S4500", "S7000", "S10000",
  "BDP250", "BDP550", "BDP750", "SP1100", "SP1200", "SP2500", "SP3800",
  "PENGUIN2400", "PENGUIN3200", "PENGUIN4500", "PENGUIN8500", "SP9500", "SP9600", "SP9500S", "SP9600S",
  "HWM2000", "HWM4000", "HWM6000",
];
for (const model of resunOfficialCurrentPumpModels) {
  const item = equipmentCatalog.find((entry) => entry.brand === "Resun" && entry.model === model);
  assert.equal(item?.category, "other", `Resun ${model} su/devirdaim pompası filtre kategorisine karışmamalı`);
  assert.equal(item?.ratedFlowLph, undefined, `Resun ${model} görsel tablosundaki debi okunmadan tahmin edilmemeli`);
  assert.equal(item?.powerW, undefined, `Resun ${model} görsel tablosundaki güç okunmadan tahmin edilmemeli`);
  assert(item?.sourceUrl.startsWith("https://www.resun-china.com/h-pd-"), `Resun ${model} doğrudan resmî pompa seri sayfasına bağlanmalı`);
}
const resunOfficialCurrentAirPumpExpected = [
  ["HCB1000",60,1.5], ["HCB4000",360,3.5], ["HCA1000",60,1.5], ["HCA2000",140,2.8], ["HCA3000",360,3.5], ["HCA4000",360,3.5],
  ["AP72",72,2], ["AP108",108,2.5], ["AP180",180,3], ["AP216",216,3],
  ["HLP-4000",3600,28], ["HLP-8000",7200,28], ["DC120",120,undefined,80], ["DC160",160,undefined,120],
  ["PLP40",3600,30], ["PLP60",4500,40], ["PLP100",9000,70], ["NLP20",1500,17], ["NLP40",3000,35], ["NLP60",4200,50], ["NLP100",8400,100], ["NLP200",14000,230],
  ["QSW70",42,1.5], ["QSB70",42,1.5],
];
for (const [model, flow, power, maxL] of resunOfficialCurrentAirPumpExpected) {
  const item = equipmentCatalog.find((entry) => entry.brand === "Resun" && entry.model === model);
  assert.equal(item?.category, "air_pump", `Resun ${model} hava motoru yalnızca hava motoru kategorisinde listelenmeli`);
  assert.deepEqual([item?.ratedFlowLph, item?.powerW, item?.recommendedMaxL], [flow, power, maxL], `Resun ${model} resmî görsel teknik tablodaki kapasiteyi taşımalı`);
  assert.equal(item?.capacityDataNote, undefined, `Resun ${model} doğrulanmış kapasiteye rağmen otomatik hesaptan dışlanmamalı`);
  assert(item?.sourceUrl.startsWith("https://www.resun-china.com/h-pd-"), `Resun ${model} doğrudan resmî hava motoru seri sayfasına bağlanmalı`);
  assert.equal(item?.verifiedAt, "2026-08-29", `Resun ${model} güncel doğrulama tarihini taşımalı`);
}
const resunOfficialCurrentHeaterExpected = [
  ["SUNLIKE25",25,undefined,20], ["SUNLIKE50",50,undefined,40], ["SUNLIKE75",75,undefined,60], ["SUNLIKE100",100,undefined,100], ["SUNLIKE150",150,undefined,160], ["SUNLIKE200",200,undefined,200], ["SUNLIKE250",250,undefined,240], ["SUNLIKE300",300,undefined,300],
  ["DSH100",100,undefined,75], ["DSH150",150,undefined,110], ["DSH200",200,undefined,170], ["DSH300",300,undefined,245],
  ["TM25",25,undefined,20], ["TM50",50,undefined,40], ["TM100",100,undefined,75], ["TM150",150,undefined,110], ["TM200",200,undefined,170], ["TM300",300,undefined,245],
  ["RH9000 25W",25,undefined,20], ["RH9000 50W",50,undefined,40], ["RH9000 75W",75,undefined,60], ["RH9000 100W",100,undefined,100], ["RH9000 150W",150,undefined,160], ["RH9000 200W",200,undefined,200], ["RH9000 250W",250,undefined,240], ["RH9000 300W",300,undefined,300],
  ["DT50",50,20,50], ["DT100",100,50,100], ["DT150",150,100,150], ["DT200",200,100,200], ["DT300",300,200,300],
  ["HT10",10,undefined,20], ["HT25",25,undefined,40], ["MH75",7.5,undefined,10], ["MH150",15,undefined,40], ["MH250",25,undefined,60],
];
for (const [model, power, minL, maxL] of resunOfficialCurrentHeaterExpected) {
  const item = equipmentCatalog.find((entry) => entry.brand === "Resun" && entry.model === model);
  assert.equal(item?.category, "heater", `Resun ${model} yalnızca ısıtıcı kategorisinde listelenmeli`);
  assert.deepEqual([item?.powerW, item?.recommendedMinL, item?.recommendedMaxL], [power, minL, maxL], `Resun ${model} resmî görsel teknik tablodaki ısıtıcı kapasitesini taşımalı`);
  assert.equal(item?.capacityDataNote, undefined, `Resun ${model} doğrulanmış kapasiteye rağmen otomatik hesaptan dışlanmamalı`);
  assert(item?.sourceUrl.startsWith("https://www.resun-china.com/h-pd-"), `Resun ${model} doğrudan resmî ısıtıcı sayfasına bağlanmalı`);
  assert.equal(item?.verifiedAt, "2026-08-29", `Resun ${model} güncel doğrulama tarihini taşımalı`);
}
for (const obsoleteSeries of ["Sunlike Heater Series", "Digital Smart Heater Series", "Thermo Heater Series", "Rising Heat Heater Series", "Delta Pre-set Heater Series", "HT Mini Heater Series"]) {
  assert.equal(equipmentCatalog.some((entry) => entry.brand === "Resun" && entry.model === obsoleteSeries), false, `Resun ${obsoleteSeries} seçilemeyen genel başlık olarak kalmamalı`);
}
for (const model of ["SLM Super Slim LED Series", "Wi-Fi Super Slim LED Series", "Flexible LED Bubble Wand Series", "LDC-01 LED Controller"]) {
  const item = equipmentCatalog.find((entry) => entry.brand === "Resun" && entry.model === model);
  assert.equal(item?.category, "lighting", `Resun ${model} yalnızca aydınlatma kategorisinde listelenmeli`);
  assert.equal(item?.powerW, undefined, `Resun ${model} için yayımlanmayan LED gücü tahmin edilmemeli`);
  assert(item?.sourceUrl.startsWith("https://www.resun-china.com/h-pd-"), `Resun ${model} doğrudan resmî aydınlatma sayfasına bağlanmalı`);
}
for (const model of ["IceCore Chiller Series", "CL200", "CL280", "MINI200", "MINI300", "MINI650", "Outdoor Chiller Series"]) {
  const item = equipmentCatalog.find((entry) => entry.brand === "Resun" && entry.model === model);
  assert.equal(item?.category, "other", `Resun ${model} soğutucu diğer sistemler kategorisinde listelenmeli`);
  assert.equal(item?.ratedFlowLph, undefined, `Resun ${model} için su debisi tahmin edilmemeli`);
  assert.equal(item?.recommendedMaxL, undefined, `Resun ${model} için soğutma hacmi tahmin edilmemeli`);
  assert(item?.sourceUrl.startsWith("https://www.resun-china.com/h-pd-"), `Resun ${model} doğrudan resmî soğutucu sayfasına bağlanmalı`);
}
const resunOfficialAccessoryModels = [
  "AST410 FlexClean 3-in-1", "MCT510", "MCT180", "ACK12", "ACK36", "MWC01 Mini Water Changer",
  "VC1", "VC3", "VC3B", "SC150 Mini Siphon Cleaner", "VC5 Easy Vac", "Advanced Water Changer Series",
  "BD06B LED Bubble Ring", "BD06C LED Bubble Ring", "AS301 Air Stone", "SWH06 Hydrometer", "SWH05 Hydrometer", "SWH04 Hydrometer",
  "FMC-Mini", "FMC-S", "FMC-M", "MagBlade Floating Cleaner Series", "NF09-S", "NF09-M", "NF09-L",
];
for (const model of resunOfficialAccessoryModels) {
  const item = equipmentCatalog.find((entry) => entry.brand === "Resun" && entry.model === model);
  assert(item, `Resun resmî bakım aksesuarı ${model} katalogda bulunmalı`);
  assert.equal(item?.ratedFlowLph, undefined, `Resun ${model} aksesuarı filtrasyon debisi taşımamalı`);
  assert(item?.sourceUrl.startsWith("https://www.resun-china.com/h-pd-"), `Resun ${model} doğrudan resmî aksesuar sayfasına bağlanmalı`);
}
for (const model of ["BD06B LED Bubble Ring", "BD06C LED Bubble Ring", "AS301 Air Stone"]) {
  assert.equal(equipmentCatalog.find((entry) => entry.brand === "Resun" && entry.model === model)?.requiresAirPump, true, `Resun ${model} hava motoru gereksinimini belirtmeli`);
}
for (const model of ["FTP01 Ammonia Filter Pad", "FTP02 Carbon Filter Pad", "FTP03 Phosphate Filter Pad", "FTP04 Polyfiber Filter Pad", "FTP05 Nitrate Filter Pad"]) {
  const item = careProductCatalog.find((entry) => entry.brand === "Resun" && entry.model === model);
  assert.equal(item?.category, "filter_media", `Resun ${model} filtre medyası kataloğunda bulunmalı`);
  assert.equal(item?.sourceUrl, "https://www.resun-china.com/h-pd-268.html", `Resun ${model} doğrudan resmî filtre pedi sayfasına bağlanmalı`);
}
for (const model of ["Manuel Dip Sifonu", "MB-S Mıknatıslı Cam Sileceği", "MB-L Mıknatıslı Cam Sileceği", "RST04 Cam Termometre"]) {
  const item = equipmentCatalog.find((entry) => entry.brand === "Resun" && entry.model === model);
  assert.equal(item?.category, "other", `Resun ${model} otomatik filtre kapasitesi hesabına karışmamalı`);
  assert.equal(item?.ratedFlowLph, undefined, `Resun ${model} için teknik debi uydurulmamalı`);
  assert(item?.sourceUrl.startsWith("https://malawiizmir.com/resun-"), `Resun ${model} doğrudan onaylı yerel ürün kaynağına bağlanmalı`);
}
const resunSpExpected = [
  ["SP-5000", 2500, 35, "2,2 m"],
  ["SP-6000", 2800, 40, "2,5 m"],
  ["SP-7800S", 3000, 75, "3,5 m"],
  ["SP-9000AS", 3800, 120, "4,5 m"],
  ["SP-9000S", 4500, 130, "4,5 m"],
  ["SP-10000S", 5500, 160, "5,5 m"],
];
const resunSpProfiles = resunSpExpected.map(([model, flow, power, head]) => {
  const item = equipmentCatalog.find((entry) => entry.brand === "Resun" && entry.model === model);
  assert.deepEqual([item?.category, item?.ratedFlowLph, item?.powerW], ["other", flow, power], `Resun ${model} doğrulanmış pompa debisi ve gücünü taşımalı`);
  assert(item?.specifications.includes(head), `Resun ${model} doğrulanmış azami basma yüksekliğini taşımalı`);
  assert(!item?.sourceUrl.includes("shanvis.store/products/resun-sp-9000as"), `Resun ${model} yalnızca SP-9000AS ürün sayfasına bağlanmamalı`);
  return item;
});
assert.equal(new Set(resunSpProfiles.map((item) => item?.sourceUrl)).size, 6, "Resun SP serisinin altı modeli kendi model/seri doğrulama kaynağına bağlanmalı");
for (const model of ["Dijital Termometre", "Plastik Multi Fonksiyon Yavruluk", "Plastik Yemleme Aparatı 10 × 10 cm", "Paslanmaz Çelik Kıvrımlı Maşa 48 cm", "Paslanmaz Çelik Kıvrımlı Makas 27 cm"]) {
  const item = equipmentCatalog.find((entry) => entry.brand === "Eurostar" && entry.model === model);
  assert.equal(item?.category, "other", `Eurostar ${model} bakım aksesuarı diğer sistemlerde listelenmeli`);
  assert(item?.sourceUrl.includes("akvaryumexpress.com"), `Eurostar ${model} güvenilir yerel katalog kaynağına bağlanmalı`);
}
for (const model of ["Saplı Cam Silici 60 cm", "Saplı Silecek 70 cm"]) {
  const item = equipmentCatalog.find((entry) => entry.brand === "Haqos" && entry.model === model);
  assert.equal(item?.category, "other", `Haqos ${model} bakım ekipmanı diğer sistemlerde listelenmeli`);
  assert(item?.sourceUrl.includes("cikletistpetshop.com"), `Haqos ${model} güvenilir yerel katalog kaynağına bağlanmalı`);
}
const jenecaAs615b = equipmentCatalog.find((entry) => entry.brand === "Jeneca" && entry.model === "AS615B Dip Süpürgesi");
assert.equal(jenecaAs615b?.category, "other", "Jeneca AS615B dip süpürgesi filtre hesabına karışmamalı");
assert(jenecaAs615b?.sourceUrl.includes("atakanpetshop.com"), "Jeneca AS615B yetkili yerel satıcı kaynağına bağlanmalı");
for (const [model, flow, power] of [["WP-850F", 400, 4], ["WP-330F", 600, 12]]) {
  const item = equipmentCatalog.find((entry) => entry.brand === "Sobo" && entry.model === model);
  assert.deepEqual([item?.category, item?.ratedFlowLph, item?.powerW], ["filter", flow, power], `Sobo ${model} doğrulanmış filtre kapasitesini taşımalı`);
}
const soboSb848 = equipmentCatalog.find((entry) => entry.brand === "Sobo" && entry.model === "SB-848");
assert.deepEqual([soboSb848?.ratedFlowLph, soboSb848?.powerW, soboSb848?.adjustableFlow], [540, 12, true], "Sobo SB-848 toplam 2 × 4,5 L/dak doğrulanmış hava debisini taşımalı");
assert.equal(soboSb848?.capacityDataNote, undefined, "Sobo SB-848 doğrulanmış debiye rağmen kapasite dışı bırakılmamalı");
const soboSb3330 = equipmentCatalog.find((entry) => entry.brand === "Sobo" && entry.model === "SB-3330 Pipo Filtre");
assert.equal(soboSb3330?.requiresAirPump, true, "Sobo SB-3330 harici hava motoru gereksinimini taşımalı");
assert(soboSb3330?.sourceUrl.includes("sobo-sb-3330"), "Sobo SB-3330 ilgisiz bitki ürününe bağlanmamalı");
const soboSb8808 = equipmentCatalog.find((entry) => entry.brand === "Sobo" && entry.model === "SB-8808");
assert.deepEqual([soboSb8808?.ratedFlowLph, soboSb8808?.adjustableFlow], [720, true], "Sobo SB-8808 toplam 2 × 6 L/dak doğrulanmış hava debisini taşımalı");
assert.equal(soboSb8808?.powerW, undefined, "Sobo SB-8808 çelişkili 5,8/10 W kaynaklarından birini kesin güç değeri saymamalı");
assert.equal(soboSb8808?.capacityDataNote, undefined, "Sobo SB-8808 doğrulanmış hava debisine rağmen kapasite dışı bırakılmamalı");
const soboWp330f = equipmentCatalog.find((entry) => entry.id === "sobo-wp-330f");
assert.deepEqual([soboWp330f?.ratedFlowLph, soboWp330f?.powerW, soboWp330f?.recommendedMaxL], [600, 12, 200], "Sobo WP-330F için yetkili distribütörün 600 L/saat, 12 W ve 200 litre değerleri kullanılmalı");
assert(soboWp330f?.sourceUrl.includes("sobo.com.tr/sobo-akvaryum-selale-aparatli-ic-filtre-wp-330f"), "Sobo WP-330F genel mağaza sayfası yerine yetkili distribütör ürün sayfasına bağlanmalı");
for (const [model, flow, power] of [["WP-303H", 280, 5], ["WP-607H", 600, 12], ["SF-550F", 500, 7]]) {
  const item = equipmentCatalog.find((entry) => entry.brand === "Sobo" && entry.model === model);
  assert.deepEqual([item?.category, item?.ratedFlowLph, item?.powerW], ["filter", flow, power], `Sobo ${model} doğrulanmış debi ve güç değerlerini taşımalı`);
  assert.equal(item?.capacityDataNote, undefined, `Sobo ${model} doğrulanmış teknik veriye rağmen kapasite dışı bırakılmamalı`);
}
for (const [model, flow, power] of [["WP-780F", 800, 10], ["FG-1204", 880, 12]]) {
  const item = equipmentCatalog.find((entry) => entry.brand === "Sobo" && entry.model === model);
  assert.deepEqual([item?.category, item?.ratedFlowLph, item?.powerW], ["filter", flow, power], `Sobo ${model} doğrulanmış debi ve güç değerlerini taşımalı`);
  assert.equal(item?.capacityDataNote, undefined, `Sobo ${model} doğrulanmış teknik veriye rağmen kapasite dışı bırakılmamalı`);
}
const soboAq7500 = equipmentCatalog.find((entry) => entry.brand === "Sobo" && entry.model === "AQ7500");
assert.deepEqual([soboAq7500?.category, soboAq7500?.ratedFlowLph, soboAq7500?.powerW], ["other", 5000, 100], "Sobo AQ7500 sump pompası filtre çevrimine karışmadan teknik verileri taşımalı");
const boyuSes10 = equipmentCatalog.find((entry) => entry.brand === "Boyu" && entry.model === "SES-10");
assert.deepEqual([boyuSes10?.category, boyuSes10?.ratedFlowLph, boyuSes10?.powerW], ["air_pump", 600, 10], "Boyu SES-10 doğrulanmış 10 L/dakika hava debisini ve 10 W gücü taşımalı");
assert.equal(boyuSes10?.capacityDataNote, undefined, "Boyu SES-10 doğrulanmış teknik veriye rağmen kapasite dışı bırakılmamalı");
assert.equal(boyuSes10?.sourceUrl, "https://www.akvaryumexpress.com/ses-10-boyu-hava-kompresoru-10w", "Boyu SES-10 doğrudan doğrulanan ürün sayfasına bağlanmalı");
for (const [model, flow, power] of [["XFP-1000", 1000, 15], ["XFP-1500", 1500, 23]]) {
  const item = equipmentCatalog.find((entry) => entry.brand === "Boyu" && entry.model === model);
  assert.deepEqual([item?.category, item?.ratedFlowLph, item?.powerW], ["other", flow, power], `Boyu ${model} sump pompası filtre hesabına karışmadan teknik verileri taşımalı`);
}

const rsFaExpected = new Map([
  ["FA1000", [600, 2.5, 120]],
  ["FA2000", [800, 5, 160]],
  ["FA3000", [1200, 7, 240]],
  ["FA4000", [1600, 10, 320]],
  ["FA5000", [280, 2, 56]],
  ["FA6000", [350, 3, 70]],
  ["FA7000", [600, 4.5, 120]],
]);
for (const [model, expected] of rsFaExpected) {
  const item = equipmentCatalog.find((entry) => entry.brand === "RS Electrical" && entry.model === model);
  assert.deepEqual([item?.category, item?.ratedFlowLph, item?.powerW, item?.recommendedMaxL], ["filter", ...expected], `RS Electrical ${model} doğrulanmış debi, güç ve hacim sınırını taşımalı`);
  assert.equal(item?.adjustableFlow, true, `RS Electrical ${model} ayarlanabilir akış bilgisini taşımalı`);
  assert(item?.sourceUrl.includes(`rs-${model.slice(2)}-aski-filtre`), `RS Electrical ${model} doğrudan ürün kaynağına bağlanmalı`);
}
const rs288 = equipmentCatalog.find((entry) => entry.id === "rs-288-top");
assert.deepEqual([rs288?.ratedFlowLph, rs288?.powerW, rs288?.recommendedMaxL], [1200, 15, 240], "RS-288 tepe filtre doğrulanan 1200 L/saat, 15 W ve 240 litre değerlerini taşımalı");
assert.equal(rs288?.sourceUrl, "https://atakanpetshop.com/rs-288-tepe-filtre-1200l-h-15w", "RS-288 doğrudan doğrulanan ürün sayfasına bağlanmalı");
const rs313 = equipmentCatalog.find((entry) => entry.id === "rs-313-air");
assert.deepEqual([rs313?.category, rs313?.ratedFlowLph, rs313?.powerW, rs313?.recommendedMaxL], ["air_pump", 90, 1, 40], "RS 313 doğrulanmış hava debisi, güç ve hacim sınırını taşımalı");
const rs960 = equipmentCatalog.find((entry) => entry.id === "rs-960-air");
assert.deepEqual([rs960?.category, rs960?.ratedFlowLph, rs960?.powerW, rs960?.recommendedMaxL], ["air_pump", 120, undefined, 50], "RS 960 doğrulanmış hava debisi ve hacim sınırını taşımalı, yayımlanmamış güç uydurulmamalı");
const rs1000Air = equipmentCatalog.find((entry) => entry.id === "rs-1000-air");
assert.deepEqual([rs1000Air?.category, rs1000Air?.ratedFlowLph, rs1000Air?.powerW, rs1000Air?.recommendedMaxL, rs1000Air?.adjustableFlow], ["air_pump", 540, 8, 200, true], "RS 1000 doğrulanmış toplam hava debisi, güç, hacim ve ayarlanabilir akış bilgisini taşımalı");
for (const [prefix, powers] of [["I399", [25, 50, 100, 200, 300, 500]], ["758", [50, 100, 200, 300]]]) {
  const heaters = equipmentCatalog.filter((entry) => entry.brand === "RS Electrical" && entry.category === "heater" && entry.model.startsWith(`${prefix} `));
  assert.deepEqual(heaters.map((entry) => entry.powerW).sort((a, b) => a - b), powers, `RS Electrical ${prefix} ısıtıcı serisi eksiksiz olmalı`);
  for (const heater of heaters) {
    assert.equal(heater.recommendedMaxL, heater.powerW, `RS Electrical ${heater.model} yayımlanan hacim üst sınırını taşımalı`);
    assert(heater.sourceUrl.startsWith("https://atakanpetshop.com/rs-"), `RS Electrical ${heater.model} doğrudan ürün kaynağına bağlanmalı`);
  }
}
const currentRsModels = [
  "FA1000", "FA2000", "FA3000", "FA4000", "FA5000", "FA6000", "FA7000",
  "RS-188 Tepe", "RS-288 Tepe", "RS-388 Tepe", "RS-99 UV", "RS 313", "RS 960", "RS 1000",
  "I399 25 W Çelik Isıtıcı", "I399 50 W Çelik Isıtıcı", "I399 100 W Çelik Isıtıcı", "I399 200 W Çelik Isıtıcı", "I399 300 W Çelik Isıtıcı", "I399 500 W Çelik Isıtıcı",
  "758 50 W Cam Isıtıcı", "758 100 W Cam Isıtıcı", "758 200 W Cam Isıtıcı", "758 300 W Cam Isıtıcı",
  "FU430K", "SF331 Soğutucu Fan", "SF332 Soğutucu Fan", "MT27 Mıknatıslı Cam Sileceği", "S1 Pompalı Dip Sifonu",
];
assert.equal(currentRsModels.length, 29, "RS güncel Türkiye portföyü 29 satış kalemini kapsamalı");
for (const model of currentRsModels) {
  assert(equipmentCatalog.some((entry) => entry.brand === "RS Electrical" && entry.model === model), `RS Electrical güncel portföy modeli eksik: ${model}`);
}
const rsFu430k = equipmentCatalog.find((entry) => entry.id === "rs-fu430k");
assert.deepEqual([rsFu430k?.category, rsFu430k?.requiresAirPump], ["filter", true], "RS FU430K hava motoruyla çalışan filtre olarak sınıflandırılmalı");
for (const id of ["rs-sf331", "rs-sf332", "rs-mt27", "rs-s1"]) {
  const item = equipmentCatalog.find((entry) => entry.id === id);
  assert.equal(item?.category, "other", `RS ${id} otomatik filtrasyon veya ısıtıcı hesabına karışmamalı`);
  assert(item?.sourceUrl.startsWith("https://atakanpetshop.com/rs-"), `RS ${id} doğrudan ürün kaynağına bağlanmalı`);
}

const lifetechAp1000 = equipmentCatalog.find((entry) => entry.brand === "Lifetech" && entry.model === "AP1000");
assert(lifetechAp1000, "Lifetech AP1000 katalogda bulunmalı");
assert.equal(lifetechAp1000.category, "other", "Su pompası filtre kategorisine karışmamalı");
assert.equal(lifetechAp1000.ratedFlowLph, 400, "Lifetech AP1000 debisi doğrulanmış 400 L/saat olmalı");

const lifetechAp3500 = equipmentCatalog.find((entry) => entry.brand === "Lifetech" && entry.model === "AP3500");
assert(lifetechAp3500, "Lifetech AP3500 katalogda bulunmalı");
assert.equal(lifetechAp3500.ratedFlowLph, undefined, "Çelişkili Lifetech AP3500 debisi kesin değer gibi kullanılmamalı");

const aquawingAq948 = equipmentCatalog.find((entry) => entry.brand === "Aquawing" && entry.model === "AQ948");
assert.equal(aquawingAq948?.category, "air_pump", "Aquawing AQ948 hava motoru kategorisinde bulunmalı");
assert.equal(aquawingAq948?.powerW, 10, "Aquawing AQ948 doğrulanmış 10 W güç değerini taşımalı");
assert.equal(aquawingAq948?.ratedFlowLph, 480, "Aquawing AQ948 toplam 2 × 4 L/dak hava debisini taşımalı");
const aquawingAq928 = equipmentCatalog.find((entry) => entry.brand === "Aquawing" && entry.model === "AQ928");
assert.equal(aquawingAq928?.powerW, 5, "Aquawing AQ928 doğrulanmış 5 W güç değerini taşımalı");
assert.equal(aquawingAq928?.ratedFlowLph, 360, "Aquawing AQ928 toplam 2 × 3 L/dak hava debisini taşımalı");
assert(aquawingAq928?.sourceUrl.includes("akvaryumexpress.com"), "Aquawing AQ928 doğrudan Akvaryum Express ürün kaynağına bağlanmalı");
const aquawingAq828 = equipmentCatalog.find((entry) => entry.brand === "Aquawing" && entry.model === "AQ828");
assert.equal(aquawingAq828?.ratedFlowLph, 360, "Aquawing AQ828 toplam 2 × 3 L/dak hava debisini taşımalı");
assert.equal(aquawingAq828?.powerW, 5, "Aquawing AQ828 doğrulanmış 5 W güç değerini taşımalı");
assert(!aquawingAq828?.capacityDataNote, "Aquawing AQ828 doğrulanmış debiye rağmen kapasite dışı bırakılmamalı");
const aquawingAqf350 = equipmentCatalog.find((entry) => entry.brand === "Aquawing" && entry.model === "AQF350 Slim");
assert.equal(aquawingAqf350?.ratedFlowLph, 350, "Aquawing AQF350 doğrulanmış 350 L/saat debiyi taşımalı");
assert.equal(aquawingAqf350?.powerW, 3, "Aquawing AQF350 doğrulanmış 3 W güç değerini taşımalı");
assert(!aquawingAqf350?.capacityDataNote, "Aquawing AQF350 doğrulanmış debiye rağmen kapasite dışı bırakılmamalı");
const aquawingAqf380 = equipmentCatalog.find((entry) => entry.brand === "Aquawing" && entry.model === "AQF380 Slim");
assert.equal(aquawingAqf380?.ratedFlowLph, 380, "Aquawing AQF380 doğrulanmış 380 L/saat debiyi taşımalı");
assert.equal(aquawingAqf380?.powerW, 3.5, "Aquawing AQF380 doğrulanmış 3,5 W gücü taşımalı");
assert.equal(aquawingAqf380?.recommendedMaxL, 60, "Aquawing AQF380 60 litre üst sınırını taşımalı");
const aquawingAq25f = equipmentCatalog.find((entry) => entry.brand === "Aquawing" && entry.model === "AQ25F Köşe Pipo");
assert.equal(aquawingAq25f?.category, "filter", "Aquawing AQ25F filtre kategorisinde bulunmalı");
assert.equal(aquawingAq25f?.requiresAirPump, true, "Aquawing AQ25F harici hava motoru gereksinimini belirtmeli");
for (const [model, category, ratedFlowLph, powerW, recommendedMaxL] of [
  ["AQ320F", "filter", 500, 6, 80],
  ["AQ780", "filter", 880, 5, 80],
  ["AQF500 Slim", "filter", 500, 5, 80],
  ["AQ905", "other", 3000, 60, undefined],
  ["AQ906", "other", 3600, 65, undefined],
  ["AQX1", "air_pump", 120, undefined, undefined],
]) {
  const profile = equipmentCatalog.find((entry) => entry.brand === "Aquawing" && entry.model === model);
  assert(profile, `Aquawing ${model} yerel yetkili satıcı kataloğundan eklenmeli`);
  assert.equal(profile.category, category, `Aquawing ${model} doğru kategoride bulunmalı`);
  assert.equal(profile.ratedFlowLph, ratedFlowLph, `Aquawing ${model} doğrulanmış debiyi taşımalı`);
  assert.equal(profile.powerW, powerW, `Aquawing ${model} yayımlanmış güç değerini korumalı`);
  assert.equal(profile.recommendedMaxL, recommendedMaxL, `Aquawing ${model} yalnızca yayımlanmış hacim sınırını taşımalı`);
  assert(profile.sourceUrl?.includes("atakanpetshop.com"), `Aquawing ${model} yerel ürün kaynağını taşımalı`);
}
const aquawingAq820 = equipmentCatalog.find((entry) => entry.brand === "Aquawing" && entry.model === "AQ820");
assert.equal(aquawingAq820?.sourceUrl, "https://atakanpetshop.com/aquawing-aq820-pilli-hava-motoru", "AQ820 yanlış model sayfasına bağlanmamalı");
assert.equal(aquawingAq820?.recommendedMaxL, 200, "AQ820 yayımlanmış 200 litre üst sınırını taşımalı");

for (const [model, flow, power] of [["AP-01", 180, 2.4], ["AP-02", 360, 4.4], ["AP-03", 420, 3.2], ["AP-910", 96, 2.8], ["AP-920", 420, 4], ["AP-1688", 96, 1.5], ["AP-2688A", 192, 3], ["AP-8801", 126, 1.5], ["AP-8803", 174, 2], ["AP-8804", 396, 3.5]]) {
  const item = equipmentCatalog.find((entry) => entry.brand === "Jeneca" && entry.model === model);
  assert.deepEqual([item?.category, item?.ratedFlowLph, item?.powerW], ["air_pump", flow, power], `Jeneca ${model} yayımlanmış hava debisi ve güç değerini taşımalı`);
  assert.equal(item?.capacityDataNote, undefined, `Jeneca ${model} doğrulanmış hava debisine rağmen kapasite hesabından dışlanmamalı`);
}

const expectedJenecaXp = new Map([
  ["XP-03", [160, 2.5]],
  ["XP-09D", [200, 5]],
  ["XP-11D", [260, 4.2]],
  ["XP-13D", [290, 4.8]],
  ["XP-15", [270, 5.5]],
  ["XP-17", [330, 8]],
]);
for (const [model, [flow, power]] of expectedJenecaXp) {
  const item = equipmentCatalog.find((entry) => entry.brand === "Jeneca" && entry.model === model);
  assert(item, `Jeneca ${model} katalogda bulunmalı`);
  assert.equal(item.category, "filter", `Jeneca ${model} filtre kategorisinde bulunmalı`);
  assert.equal(item.ratedFlowLph, flow, `Jeneca ${model} doğrulanmış debiyi taşımalı`);
  assert.equal(item.powerW, power, `Jeneca ${model} doğrulanmış gücü taşımalı`);
}
const jenecaXp605 = equipmentCatalog.find((entry) => entry.brand === "Jeneca" && entry.model === "XP-605");
assert.deepEqual([jenecaXp605?.ratedFlowLph, jenecaXp605?.powerW, jenecaXp605?.adjustableFlow], [250, 3.5, true], "Jeneca XP-605 resmî model tablosundaki debi ve gücü taşımalı");
assert.equal(jenecaXp605?.sourceUrl, "https://gb.aleas.cn/product/684.html", "Jeneca XP-605 doğrudan üretici teknik tablosuna bağlanmalı");
assert.equal(jenecaXp605?.verifiedAt, "2026-09-04", "Jeneca XP-605 güncel doğrulama tarihini taşımalı");
assert.equal(jenecaXp605?.capacityDataNote, undefined, "Jeneca XP-605 otomatik filtrasyon hesabına katılmalı");
for (const [model, flow, power] of [
  ["GD-402", 500, 8],
  ["GD-502", 1000, 15],
  ["GD-602", 1800, 25],
  ["GD-603", 1800, 25],
]) {
  const item = equipmentCatalog.find((entry) => entry.brand === "Jeneca" && entry.model === model);
  assert.deepEqual([item?.ratedFlowLph, item?.powerW, item?.adjustableFlow], [flow, power, true], `Jeneca ${model} resmî model tablosundaki debi ve gücü taşımalı`);
  assert.equal(item?.sourceUrl, "https://gb.aleas.cn/product/630.html", `Jeneca ${model} doğrudan üretici teknik tablosuna bağlanmalı`);
  assert.equal(item?.verifiedAt, "2026-09-04", `Jeneca ${model} güncel doğrulama tarihini taşımalı`);
  assert.equal(item?.capacityDataNote, undefined, `Jeneca ${model} otomatik filtrasyon hesabına katılmalı`);
}
for (const model of ["GD-403", "GD-503"]) {
  const item = equipmentCatalog.find((entry) => entry.brand === "Jeneca" && entry.model === model);
  assert.equal(item?.ratedFlowLph, undefined, `Jeneca ${model} çelişkili debiyle otomatik hesaba katılmamalı`);
  assert.equal(item?.powerW, undefined, `Jeneca ${model} çelişkili güçle otomatik hesaba katılmamalı`);
  assert(item?.capacityDataNote?.includes("Çelişki çözülene kadar"), `Jeneca ${model} kaynak çelişkisini kullanıcıya açıklamalı`);
  assert.equal(item?.additionalSourceUrls?.length, 2, `Jeneca ${model} iki bağımsız karşılaştırma kaynağını izlenebilir tutmalı`);
  assert.equal(item?.verifiedAt, "2026-09-25", `Jeneca ${model} güncel çelişki denetim tarihini taşımalı`);
  assert(item?.additionalSourceUrls?.some((url) => url.includes("seasunaquarium.com")), `Jeneca ${model} üretici tablosunu destekleyen bağımsız model sayfasına bağlanmalı`);
}
for (const model of ["TGD-15", "TGD-16", "TGD-17", "TGD-18", "TGD-19"]) {
  const item = equipmentCatalog.find((entry) => entry.brand === "Jeneca" && entry.model === model);
  assert(item, `Jeneca ${model} resmî üretici kataloğunda bulunduğu için katalogda yer almalı`);
  assert.equal(item.category, "filter", `Jeneca ${model} filtre kategorisinde bulunmalı`);
  assert.deepEqual([item.ratedFlowLph, item.powerW], [400, 6], `Jeneca ${model} doğrudan üretici görselindeki debi ve gücü taşımalı`);
  assert.equal(item.sourceUrl, "https://www.aleas.cn/product/712.html", `Jeneca ${model} doğrudan üretici ürün sayfasına bağlanmalı`);
  assert.equal(item.verifiedAt, "2026-09-04", `Jeneca ${model} güncel doğrulama tarihini taşımalı`);
  assert.equal(item.capacityDataNote, undefined, `Jeneca ${model} otomatik filtrasyon hesabına katılmalı`);
}
const jenecaDc001 = equipmentCatalog.find((entry) => entry.brand === "Jeneca" && entry.model === "DC-001");
assert.deepEqual([jenecaDc001?.category, jenecaDc001?.ratedFlowLph, jenecaDc001?.powerW], ["air_pump", 78, undefined], "Jeneca DC-001 üretici etiketindeki tek çıkış debisini taşımalı; mAh değeri watt gibi yorumlanmamalı");
assert.equal(jenecaDc001?.sourceUrl, "https://gb.aleas.cn/product/648.html", "Jeneca DC-001 doğrudan üretici ürün sayfasına bağlanmalı");
assert.equal(jenecaDc001?.verifiedAt, "2026-09-04", "Jeneca DC-001 güncel doğrulama tarihini taşımalı");
assert.equal(jenecaDc001?.capacityDataNote, undefined, "Jeneca DC-001 otomatik hava kapasitesi hesabına katılmalı");
const jenecaDc003 = equipmentCatalog.find((entry) => entry.brand === "Jeneca" && entry.model === "DC-003");
assert.deepEqual([jenecaDc003?.category, jenecaDc003?.ratedFlowLph, jenecaDc003?.powerW], ["air_pump", 180, undefined], "Jeneca DC-003 üretici etiketindeki çift çıkış toplam debisini taşımalı; watt değeri uydurulmamalı");
assert.equal(jenecaDc003?.sourceUrl, "https://www.aleas.cn/product/702.html", "Jeneca DC-003 doğrudan üretici ürün sayfasına bağlanmalı");
assert.equal(jenecaDc003?.verifiedAt, "2026-09-04", "Jeneca DC-003 güncel doğrulama tarihini taşımalı");
assert.equal(jenecaDc003?.capacityDataNote, undefined, "Jeneca DC-003 otomatik hava kapasitesi hesabına katılmalı");

const jenecaProfiles = equipmentCatalog.filter((entry) => entry.brand === "Jeneca");
assert.equal(jenecaProfiles.length, 410, "Jeneca resmî cihaz ve aksesuar portföyü birkaç örnek modelle sınırlı kalmamalı");
assert.deepEqual(
  Object.fromEntries([...new Set(jenecaProfiles.map((entry) => entry.category))].sort().map((category) => [category, jenecaProfiles.filter((entry) => entry.category === category).length])),
  { air_pump: 41, filter: 107, heater: 39, lighting: 42, other: 176, uv: 5 },
  "Jeneca filtre, hava motoru, ısıtıcı, aydınlatma, UV ve aksesuar aileleri ayrı kategorilerde korunmalı",
);
assert(jenecaProfiles.every((entry) => entry.sourceUrl?.startsWith("https://")), "Jeneca kayıtlarının tamamı doğrulanabilir HTTPS kaynağı taşımalı");
assert(jenecaProfiles.every((entry) => /^\d{4}-\d{2}-\d{2}$/.test(entry.verifiedAt || "")), "Jeneca kayıtlarının tamamı YYYY-MM-DD doğrulama tarihi taşımalı");
for (const model of ["AE-800", "AE-800UV", "AE-1000UV", "AE-1300UV", "AE-1500UV", "AE-1800UV", "XP-18", "XP-19", "XP-31", "XP-32", "XP-03B"]) {
  assert.equal(jenecaProfiles.find((entry) => entry.model === model)?.category, "filter", `Jeneca ${model} dış filtre ailesinde bulunmalı`);
}
for (const [model, flow, power] of [["XP-03B", 160, 2.5], ["IPF-408", 200, 2], ["IPF-448", 450, 6], ["IPF-728", 720, 10], ["IPF-1008", 1020, 14], ["IPF-1508", 1500, 22]]) {
  const item = jenecaProfiles.find((entry) => entry.model === model);
  assert.deepEqual([item?.ratedFlowLph, item?.powerW], [flow, power], `Jeneca ${model} resmî debi ve güç tablosunu taşımalı`);
}
for (const [model, flow, power, maxL] of [["XP-18", 240, 4.2, 48], ["XP-19", 270, 4.8, 54], ["XP-31", 240, 4.2, undefined], ["XP-32", 270, 4.8, undefined]]) {
  const item = jenecaProfiles.find((entry) => entry.model === model);
  assert.equal(item?.ratedFlowLph, flow, `Jeneca ${model} resmî debiyi taşımalı`);
  assert.equal(item?.powerW, power, `Jeneca ${model} resmî gücü taşımalı`);
  assert.equal(item?.recommendedMaxL, maxL, `Jeneca ${model} yayımlanan akvaryum üst sınırını taşımalı`);
  assert.equal(item?.capacityDataNote, undefined, `Jeneca ${model} doğrulanmış hacim sınırıyla otomatik filtrasyon hesabına katılmalı`);
  assert.equal(item?.sourceUrl, "https://www.aleas.cn/product/474.html", `Jeneca ${model} resmî teknik tabloya bağlanmalı`);
  assert.equal(item?.verifiedAt, "2026-09-04", `Jeneca ${model} güncel doğrulama tarihini taşımalı`);
}
const jenecaXp01a = jenecaProfiles.find((entry) => entry.model === "XP-01A");
assert.deepEqual([jenecaXp01a?.ratedFlowLph, jenecaXp01a?.powerW], [90, 2.5], "Jeneca XP-01A resmî debi ve güç tablosunu taşımalı");
assert.equal(jenecaXp01a?.sourceUrl, "https://www.aleas.cn/product/697.html", "Jeneca XP-01A doğrudan üretici teknik sayfasına bağlanmalı");
assert.equal(jenecaXp01a?.capacityDataNote, undefined, "Jeneca XP-01A otomatik filtrasyon hesabına katılmalı");
for (const [model, flow, power] of [["GL-3", 250, 3], ["GL-5", 300, 3.5], ["GL-7", 350, 4]]) {
  const item = jenecaProfiles.find((entry) => entry.model === model);
  assert.deepEqual([item?.ratedFlowLph, item?.powerW], [flow, power], `Jeneca ${model} resmî debi ve güç tablosunu taşımalı`);
  assert.equal(item?.sourceUrl, "https://www.aleas.cn/product/485.html", `Jeneca ${model} doğrudan üretici teknik sayfasına bağlanmalı`);
  assert.equal(item?.capacityDataNote, undefined, `Jeneca ${model} otomatik filtrasyon hesabına katılmalı`);
}
const jenecaYm03 = jenecaProfiles.find((entry) => entry.model === "YM-03");
assert.deepEqual([jenecaYm03?.ratedFlowLph, jenecaYm03?.powerW, jenecaYm03?.recommendedMaxL], [300, 5, 300], "Jeneca YM-03 çapraz doğrulanmış debi, güç ve hacim sınırını taşımalı");
assert.equal(jenecaYm03?.auxiliaryFiltration, true, "Jeneca YM-03 ana biyolojik filtre gibi değerlendirilmemeli");
assert.equal(jenecaYm03?.additionalSourceUrls?.length, 1, "Jeneca YM-03 bağımsız çapraz doğrulama kaynağını saklamalı");
const jenecaYm01 = jenecaProfiles.find((entry) => entry.model === "YM-01");
assert.deepEqual([jenecaYm01?.ratedFlowLph, jenecaYm01?.passiveComponent, jenecaYm01?.auxiliaryFiltration], [undefined, true, true], "Jeneca YM-01 pompasız yardımcı yüzey emiş aparatı olarak tutulmalı");
assert.equal(hasStandaloneCapacityData(jenecaYm01), false, "Jeneca YM-01 bağımsız filtre kapasitesi varmış gibi gösterilmemeli");
assert.match(jenecaYm01?.capacityDataNote || "", /pompasız/, "Jeneca YM-01'in neden kapasite hesabına katılmadığı açıklanmalı");
const jenecaAe1000 = jenecaProfiles.find((entry) => entry.model === "AE-1000");
assert.deepEqual(
  [jenecaAe1000?.ratedFlowLph, jenecaAe1000?.powerW, jenecaAe1000?.recommendedMaxL, jenecaAe1000?.adjustableFlow],
  [850, 9.3, 170, true],
  "Jeneca AE-1000 çapraz doğrulanmış debi, güç, hacim ve ayarlanabilir akış bilgisini taşımalı",
);
assert.equal(jenecaAe1000?.additionalSourceUrls?.length, 1, "Jeneca AE-1000 bağımsız çapraz doğrulama kaynağını saklamalı");
const jenecaAe1300 = jenecaProfiles.find((entry) => entry.model === "AE-1300");
assert.deepEqual(
  [jenecaAe1300?.ratedFlowLph, jenecaAe1300?.powerW, jenecaAe1300?.recommendedMaxL, jenecaAe1300?.adjustableFlow],
  [950, undefined, undefined, true],
  "Jeneca AE-1300 yalnızca kaynaklarda ortak olan debiyi ve ayarlanabilir akış bilgisini taşımalı",
);
assert(jenecaAe1300?.specifications.includes("çelişkili"), "Jeneca AE-1300 güç ve hacim kaynak çelişkisini kullanıcıdan saklamamalı");
assert.equal(jenecaAe1300?.additionalSourceUrls?.length, 1, "Jeneca AE-1300 bağımsız çapraz doğrulama kaynağını saklamalı");
for (const model of ["AE-1000", "AE-1300"]) {
  const item = jenecaProfiles.find((entry) => entry.model === model);
  assert.equal(item?.capacityDataNote, undefined, `Jeneca ${model} doğrulanmış debiyle otomatik filtrasyon hesabına katılmalı`);
  assert.equal(item?.verifiedAt, "2026-08-30", `Jeneca ${model} güncel doğrulama tarihini taşımalı`);
}
for (const [model, flow, power] of [
  ["GLB-600", 150, 3.5], ["GLB-800", 180, 5.5], ["GLB-1000", 220, 7.5],
  ["IPF-060", 500, undefined], ["IPF-080", 800, 18], ["IPF-180", 1200, 25], ["IPF-280", 1800, 30], ["IPF-380", 2500, 40],
  ["IPF-228", 220, 4], ["IPF-628", 450, 7], ["IPF-260", 400, 5], ["IPF-360", 600, 8], ["IPF-460", 800, 15], ["IPF-480", 1000, 20], ["IPF-560", 1500, 25],
  ["GD-400", 500, 7], ["GD-500", 500, 7], ["GD-600", 1100, 17],
]) {
  const item = jenecaProfiles.find((entry) => entry.model === model);
  assert.deepEqual([item?.ratedFlowLph, item?.powerW], [flow, power], `Jeneca ${model} yalnızca doğrulanmış debi ve güç değerlerini taşımalı`);
  assert.equal(item?.capacityDataNote, undefined, `Jeneca ${model} doğrulanmış debiyle otomatik filtrasyon hesabına katılmalı`);
  assert.equal(item?.verifiedAt, "2026-08-30", `Jeneca ${model} güncel doğrulama tarihini taşımalı`);
}
const jenecaIpf338 = jenecaProfiles.find((entry) => entry.model === "IPF-338");
assert.deepEqual([jenecaIpf338?.ratedFlowLph, jenecaIpf338?.powerW], [300, 5], "Jeneca IPF-338 resmî model tablosundaki debi ve gücü taşımalı");
assert.equal(jenecaIpf338?.sourceUrl, "https://www.aleas.cn/product/483.html", "Jeneca IPF-338 doğrudan üretici ürün sayfasına bağlanmalı");
assert.equal(jenecaIpf338?.verifiedAt, "2026-09-04", "Jeneca IPF-338 güncel doğrulama tarihini taşımalı");
assert.equal(jenecaIpf338?.capacityDataNote, undefined, "Jeneca IPF-338 otomatik filtrasyon hesabına katılmalı");
assert(jenecaIpf338?.specifications.includes("PF-338 ön eki"), "Jeneca IPF-338 üretici tablosundaki model ön eki tutarsızlığını kullanıcıya açıklamalı");
assert.equal(jenecaIpf338?.additionalSourceUrls?.length, 2, "Jeneca IPF-338 iki bağımsız teknik kaynakla çapraz doğrulanmalı");
for (const model of ["GD-320"]) {
  const item = jenecaProfiles.find((entry) => entry.model === model);
  assert.equal(item?.ratedFlowLph, undefined, `Jeneca ${model} debisi çelişkili veya eksik kaynaklardan tahmin edilmemeli`);
  assert(item?.capacityDataNote?.includes("otomatik filtrasyon hesabına katılmaz"), `Jeneca ${model} güvenli kapasite hesabının dışında kalmalı`);
  assert(item?.capacityDataNote?.includes("459 L/saat") && item.capacityDataNote.includes("4 W") && item.capacityDataNote.includes("6 W"), `Jeneca ${model} kaynaklardaki debi ve güç çelişkisini kullanıcıya açıklamalı`);
  assert.equal(item?.additionalSourceUrls?.length, 2, `Jeneca ${model} çelişen iki ikincil kaynağı izlenebilir tutmalı`);
  assert.equal(item?.verifiedAt, "2026-09-25", `Jeneca ${model} güncel çelişki denetim tarihini taşımalı`);
}
for (const [model, flow, power] of [["XP-U1", 200, 3.5], ["XP-U3", 260, 4.2], ["XP-U5", 200, 3.5], ["XP-U6", 260, 4.2]]) {
  const item = jenecaProfiles.find((entry) => entry.model === model);
  assert.deepEqual([item?.category, item?.ratedFlowLph, item?.powerW], ["uv", flow, power], `Jeneca ${model} UV kategorisinde resmî teknik veriyi taşımalı`);
}
for (const [model, flow, power] of [["ZL-101", 4000, 8], ["ZL-103", 5000, 12], ["ZL-221", 8000, 16], ["ZL-223", 12000, 24]]) {
  const item = jenecaProfiles.find((entry) => entry.model === model);
  assert.deepEqual([item?.category, item?.ratedFlowLph, item?.powerW], ["other", flow, power], `Jeneca ${model} dalga motoru filtre kapasitesi hesabına karışmadan teknik değerini taşımalı`);
}
for (const [model, flow, power] of [["AH-2000DC", 2000, 15], ["AH-3000DC", 3000, 20], ["AH-4000DC", 4000, 25], ["AH-5500DC", 5500, 30], ["AH-6500DC", 6500, 40], ["AH-8500DC", 8500, 50]]) {
  const item = jenecaProfiles.find((entry) => entry.model === model);
  assert.deepEqual([item?.category, item?.ratedFlowLph, item?.powerW], ["other", flow, power], `Jeneca ${model} DC pompa tablosunu taşımalı`);
}
assert.equal(jenecaProfiles.find((entry) => entry.model === "AH-12000DC")?.ratedFlowLph, undefined, "Jeneca AH-12000DC üretici tablosundaki olası 120000 L/saat yazım hatası otomatik hesaba alınmamalı");
for (const model of ["AP-602", "AP-8806", "AP-601", "AP-18000", "AP-06", "AP-10000", "AP-12000", "AP-15000", "AP-20000", "AP-22000", "AP-30000", "AP-40000", "DB-58 Upgrade"]) {
  assert.equal(jenecaProfiles.find((entry) => entry.model === model)?.category, "air_pump", `Jeneca ${model} resmî hava motoru portföyünde bulunmalı`);
}
for (const [model, flow, power, maxL, adjustable] of [
  ["AP-601", 180, 2, undefined, undefined],
  ["AP-602", 360, 4, undefined, undefined],
  ["AP-8806", 516, 4.1, 600, true],
  ["AP-10000", 396, 3.3, undefined, true],
  ["AP-12000", 360, 4, undefined, true],
  ["AP-15000", 360, 6, undefined, true],
  ["AP-22000", 480, undefined, undefined, true],
  ["AP-30000", 600, 10, undefined, true],
  ["AP-40000", 1200, 12, undefined, true],
  ["DB-58", 3300, 25, undefined, true],
  ["DB-21", 1080, 10, undefined, true],
  ["DB-31", 1800, 16, undefined, undefined],
  ["DB-51", 3060, 25, undefined, undefined],
  ["DB-81", 4800, 42, undefined, undefined],
]) {
  const item = jenecaProfiles.find((entry) => entry.model === model);
  assert.deepEqual(
    [item?.ratedFlowLph, item?.powerW, item?.recommendedMaxL, item?.adjustableFlow],
    [flow, power, maxL, adjustable],
    "Jeneca " + model + " yalnızca doğrulanmış hava kapasitesi ve güç değerlerini taşımalı",
  );
  assert.equal(item?.capacityDataNote, undefined, "Jeneca " + model + " doğrulanmış kapasiteyle otomatik hava hesabına katılmalı");
  assert.equal(item?.verifiedAt, "2026-08-30", "Jeneca " + model + " güncel doğrulama tarihini taşımalı");
}
assert.equal(jenecaProfiles.find((entry) => entry.model === "AP-22000")?.specifications.includes("çelişkili"), true, "Jeneca AP-22000 güç çelişkisi kullanıcıdan saklanmamalı");
const jenecaAp06 = jenecaProfiles.find((entry) => entry.model === "AP-06");
assert.deepEqual([jenecaAp06?.ratedFlowLph, jenecaAp06?.powerW, jenecaAp06?.adjustableFlow], [840, 7, true], "Jeneca AP-06 resmî çift çıkış toplam debisini, gücünü ve ayar özelliğini taşımalı");
assert.equal(jenecaAp06?.sourceUrl, "https://www.aleas.cn/product/412.html", "Jeneca AP-06 doğrudan üretici teknik tablosuna bağlanmalı");
assert.equal(jenecaAp06?.capacityDataNote, undefined, "Jeneca AP-06 otomatik hava kapasitesi hesabına katılmalı");
const jenecaAp20000 = jenecaProfiles.find((entry) => entry.model === "AP-20000");
assert.deepEqual([jenecaAp20000?.ratedFlowLph, jenecaAp20000?.powerW, jenecaAp20000?.adjustableFlow], [480, 8, true], "Jeneca AP-20000 resmî debi, güç ve ayar özelliğini taşımalı");
assert.equal(jenecaAp20000?.sourceUrl, "https://www.aleas.cn/product/411.html", "Jeneca AP-20000 doğrudan üretici teknik tablosuna bağlanmalı");
assert.equal(jenecaAp20000?.capacityDataNote, undefined, "Jeneca AP-20000 otomatik hava kapasitesi hesabına katılmalı");
const jenecaAp18000 = jenecaProfiles.find((entry) => entry.model === "AP-18000");
assert.deepEqual([jenecaAp18000?.ratedFlowLph, jenecaAp18000?.powerW, jenecaAp18000?.adjustableFlow], [480, 6, undefined], "Jeneca AP-18000 resmî debi ve güç tablosunu taşımalı; ayarlanabilirlik uydurulmamalı");
assert.equal(jenecaAp18000?.sourceUrl, "https://www.aleas.cn/product/445.html", "Jeneca AP-18000 doğrudan üretici teknik tablosuna bağlanmalı");
assert.equal(jenecaAp18000?.verifiedAt, "2026-09-04", "Jeneca AP-18000 güncel doğrulama tarihini taşımalı");
assert.equal(jenecaAp18000?.capacityDataNote, undefined, "Jeneca AP-18000 otomatik hava kapasitesi hesabına katılmalı");
const jenecaDb11 = jenecaProfiles.find((entry) => entry.model === "DB-11");
assert.deepEqual([jenecaDb11?.ratedFlowLph, jenecaDb11?.powerW, jenecaDb11?.adjustableFlow], [660, 6.5, undefined], "Jeneca DB-11 resmî debi ve güç tablosunu taşımalı");
assert.equal(jenecaDb11?.sourceUrl, "https://www.aleas.cn/product/701.html", "Jeneca DB-11 doğrudan üretici teknik tablosuna bağlanmalı");
assert.equal(jenecaDb11?.verifiedAt, "2026-09-04", "Jeneca DB-11 güncel doğrulama tarihini taşımalı");
assert.equal(jenecaDb11?.capacityDataNote, undefined, "Jeneca DB-11 otomatik hava kapasitesi hesabına katılmalı");
const jenecaDb58Upgrade = jenecaProfiles.find((entry) => entry.model === "DB-58 Upgrade");
assert.deepEqual([jenecaDb58Upgrade?.ratedFlowLph, jenecaDb58Upgrade?.powerW, jenecaDb58Upgrade?.adjustableFlow], [3300, 25, true], "Jeneca DB-58 Upgrade resmî azami debi, güç ve ayar özelliğini taşımalı");
assert.equal(jenecaDb58Upgrade?.sourceUrl, "https://www.aleas.cn/product/642.html", "Jeneca DB-58 Upgrade doğrudan üretici ürün sayfasına bağlanmalı");
assert.equal(jenecaDb58Upgrade?.additionalSourceUrls?.length, 1, "Jeneca DB-58 Upgrade bağımsız teknik kaynakla çapraz doğrulanmalı");
assert.equal(jenecaDb58Upgrade?.verifiedAt, "2026-09-04", "Jeneca DB-58 Upgrade güncel doğrulama tarihini taşımalı");
assert.equal(jenecaDb58Upgrade?.capacityDataNote, undefined, "Jeneca DB-58 Upgrade otomatik hava kapasitesi hesabına katılmalı");
for (const [model, flow, power] of [["DB-11 Upgrade", 660, 6.5], ["DB-21 Upgrade", 1080, 10]]) {
  const item = jenecaProfiles.find((entry) => entry.model === model);
  assert.deepEqual([item?.ratedFlowLph, item?.powerW, item?.adjustableFlow], [flow, power, true], "Jeneca " + model + " resmî teknik tablodaki debi, güç ve ayar özelliğini taşımalı");
  assert.equal(item?.sourceUrl, "https://gb.aleas.cn/product/644.html", "Jeneca " + model + " doğrudan üretici seri sayfasına bağlanmalı");
  assert.equal(item?.verifiedAt, "2026-09-04", "Jeneca " + model + " güncel doğrulama tarihini taşımalı");
  assert.equal(item?.capacityDataNote, undefined, "Jeneca " + model + " otomatik hava kapasitesi hesabına katılmalı");
}
for (const model of ["AL-3201 25 W", "AL-3201 50 W", "AL-3201 75 W", "AL-3201 100 W", "AL-3201 150 W", "AL-3201 200 W", "AL-3201 300 W", "SX-366 1000 W", "SX-366 1200 W", "SX-366 1500 W", "SX-388 1000 W", "SX-388 1200 W", "SX-388 1500 W", "SX-265 500 W", "AL-22 25 W", "AL-22 50 W", "AL-22 100 W", "AL-22 200 W", "AL-22 300 W", "AL-28 50 W", "AL-28 100 W", "AL-28 300 W", "AL-28 500 W", "BX-22 25 W", "BX-22 50 W", "BX-22 100 W", "BX-22 200 W", "BX-22 300 W", "BX-22 500 W", "BX-28 500 W", "BX-29 200 W", "BX-29 300 W", "BX-29 500 W"]) {
  assert.equal(jenecaProfiles.find((entry) => entry.model === model)?.category, "heater", `Jeneca ${model} resmî ısıtıcı portföyünde bulunmalı`);
}
for (const [model, power, minL, maxL] of [
  ["SX-366 1000 W", 1000, undefined, undefined], ["SX-388 1500 W", 1500, undefined, undefined], ["SX-265 500 W", 500, undefined, 500],
  ["AL-22 25 W", 25, undefined, undefined], ["AL-28 500 W", 500, undefined, undefined],
  ["BX-22 25 W", 25, 5, 40], ["BX-22 300 W", 300, 250, 350], ["BX-22 500 W", 500, undefined, 500],
  ["BX-28 500 W", 500, undefined, 500], ["BX-29 200 W", 200, undefined, 200], ["BX-29 500 W", 500, undefined, 500],
]) {
  const item = jenecaProfiles.find((entry) => entry.model === model);
  assert.deepEqual([item?.powerW, item?.recommendedMinL, item?.recommendedMaxL], [power, minL, maxL], `Jeneca ${model} yalnızca kaynakta yayımlanan ısıtıcı değerlerini taşımalı`);
  assert.equal(item?.capacityDataNote, undefined, `Jeneca ${model} doğrulanmış güçle otomatik ısıtıcı hesabına katılmalı`);
  assert.equal(item?.verifiedAt, "2026-08-30", `Jeneca ${model} güncel doğrulama tarihini taşımalı`);
}
for (const model of ["T8-LY", "T8-YW", "T8-JL", "T8-BS", "T12-LY", "T12-JL", "SZ-40D", "SZ-50D", "SZ-60D", "X1", "X3", "X5", "D3", "D5", "D7"]) {
  assert.equal(jenecaProfiles.find((entry) => entry.model === model)?.category, "lighting", `Jeneca ${model} resmî aydınlatma portföyünde bulunmalı`);
}
for (const model of ["AS-01", "Q-40", "Q-60", "Q-80", "Q-100", "Q-120", "Q-150", "A-50", "A-80", "A-100", "A-100F"]) {
  const item = jenecaProfiles.find((entry) => entry.model === model);
  assert.deepEqual([item?.category, item?.requiresAirPump], ["other", true], `Jeneca ${model} hava taşı bağımsız filtre sayılmamalı ve hava motoru gereksinimini belirtmeli`);
}

for (const model of ["EASY-1000AT", "Aqua Flow 250"]) {
  const item = equipmentCatalog.find((entry) => entry.brand === "Haqos" && entry.model === model);
  assert(item, `Haqos ${model} resmî ürün kataloğunda bulunduğu için katalogda yer almalı`);
  assert.equal(item.category, "filter", `Haqos ${model} filtre kategorisinde bulunmalı`);
  assert.equal(item.ratedFlowLph, undefined, `Haqos ${model} debisi benzer model kodlarından türetilmemeli`);
  assert.equal(item.powerW, undefined, `Haqos ${model} gücü doğrulanmadan katalogda kullanılmamalı`);
  assert(item.capacityDataNote?.includes("otomatik kapasite hesabına katılmaz"), `Haqos ${model} eksik teknik veri nedeniyle kapasite hesabından açıkça dışlanmalı`);
  assert(/görsel sunucusu(?:na erişilemedi| yeniden bağlantıyı kabul etmedi)/.test(item.capacityDataNote || ""), `Haqos ${model} teknik görselin neden doğrulanamadığını kullanıcıya açıklamalı`);
  const expectedVerifiedAt = "2026-09-25";
  assert.equal(item.verifiedAt, expectedVerifiedAt, `Haqos ${model} güncel kaynak denetim tarihini taşımalı`);
}
assert.equal(equipmentCatalog.find((entry) => entry.id === "haqos-easy-1000at")?.sourceUrl, "https://www.haqos.com/productshow-45495781.html", "Haqos EASY-1000AT resmî model sayfasına bağlanmalı");
assert.equal(equipmentCatalog.find((entry) => entry.id === "haqos-aqua-flow-250")?.sourceUrl, "https://www.haqos.com/productshow-45495780.html", "Haqos Aqua Flow 250 resmî model sayfasına bağlanmalı");
assert.equal(equipmentCatalog.find((entry) => entry.id === "haqos-expro-500")?.sourceUrl, "https://www.haqos.com/productshow-45495778.html", "Haqos EXPRO-500 resmî model sayfasına bağlanmalı");
assert.equal(equipmentCatalog.find((entry) => entry.id === "haqos-expad-500")?.sourceUrl, "https://www.haqos.com/productshow-45495779.html", "Haqos EXPAD-500 resmî model sayfasına bağlanmalı");

const haqosProfiles = equipmentCatalog.filter((entry) => entry.brand === "Haqos");
assert.equal(haqosProfiles.length, 48, "Haqos kataloğu 24 eski/doğrulanmış kayıt ile 24 yeni resmî veya güncel yerel kaydı birlikte korumalı");
for (const [model, page] of [
  ["EASY-1000AT", "45495781"], ["Aqua Flow 250", "45495780"], ["EXPAD-500", "45495779"],
  ["EXPRO-500", "45495778"], ["EX-500AT", "45495777"], ["EXPRO-230", "45495776"],
  ["EXPRO-1000", "45495775"], ["EX1000AT", "45495774"], ["EXC-500", "45495772"], ["HEC-600", "45495770"],
]) {
  const item = haqosProfiles.find((entry) => entry.model === model);
  assert.equal(item?.sourceUrl, `https://www.haqos.com/productshow-${page}.html`, `Haqos ${model} doğrudan resmî model sayfasına bağlanmalı`);
  const expectedVerifiedAt = ["EASY-1000AT", "Aqua Flow 250"].includes(model) ? "2026-09-25" : "2026-08-26";
  assert.equal(item?.verifiedAt, expectedVerifiedAt, `Haqos ${model} güncel doğrulama tarihini taşımalı`);
}
for (const [model, page] of [
  ["WM-300", "45495755"], ["WM-200", "45495756"], ["WM-100", "45495758"],
  ["SP-230", "45495760"], ["MP-2200", "45495761"], ["SA101", "45495762"],
]) {
  const item = haqosProfiles.find((entry) => entry.model === model);
  assert.equal(item?.category, "other", `Haqos ${model} su pompası filtre gibi gösterilmemeli`);
  assert.equal(item?.sourceUrl, `https://www.haqos.com/productshow-${page}.html`, `Haqos ${model} resmî pompa sayfasına bağlanmalı`);
  assert.equal(item?.ratedFlowLph, undefined, `Haqos ${model} debisi model kodundan tahmin edilmemeli`);
  assert.equal(item?.powerW, undefined, `Haqos ${model} gücü doğrulanmadan kullanılmamalı`);
}
for (const [model, power, page] of [["UV 9W", 9, "45495767"], ["Mini UV 5W", 5, "45495768"]]) {
  const item = haqosProfiles.find((entry) => entry.model === model);
  assert.deepEqual([item?.category, item?.powerW], ["uv", power], `Haqos ${model} doğru UV kategorisi ve başlıkta yayımlanan gücü taşımalı`);
  assert.equal(item?.sourceUrl, `https://www.haqos.com/productshow-${page}.html`, `Haqos ${model} resmî UV sayfasına bağlanmalı`);
}
for (const [model, page] of [
  ["Power LED Clip Light", "45495617"], ["LED Clamp-on Lamp (45495618)", "45495618"],
  ["Power LED Clip Light 506", "45495621"], ["LED Clamp-on Lamp (45495622)", "45495622"],
]) {
  const item = haqosProfiles.find((entry) => entry.model === model);
  assert.equal(item?.category, "lighting", `Haqos ${model} yalnızca aydınlatma kategorisinde bulunmalı`);
  assert.equal(item?.sourceUrl, `https://www.haqos.com/productshow-${page}.html`, `Haqos ${model} resmî ışık sayfasına bağlanmalı`);
  assert.equal(item?.powerW, undefined, `Haqos ${model} gücü yayımlanmadan model adından türetilmemeli`);
}
const haqosBiopro = haqosProfiles.find((entry) => entry.model === "BIOPRO B-600");
assert.deepEqual([haqosBiopro?.category, haqosBiopro?.ratedFlowLph], ["other", 520], "Haqos BIOPRO B-600 yerel doğrulanmış 520 L/saat bakım debisini taşımalı fakat filtre sayılmamalı");
assert(haqosBiopro?.sourceUrl.includes("malawiizmir.com/biopro-b-600"), "Haqos BIOPRO B-600 doğrudan onaylı yerel kaynağa bağlanmalı");
const haqosSolaris = haqosProfiles.find((entry) => entry.model === "Solaris 508");
assert.equal(haqosSolaris?.category, "lighting", "Haqos Solaris 508 aydınlatma kategorisinde bulunmalı");
assert.equal(haqosSolaris?.powerW, undefined, "Haqos Solaris 508 gücü onaylı kaynakta yayımlanmadığı için tahmin edilmemeli");
const haqosOverBox = haqosProfiles.find((entry) => entry.model === "OverBox 5000");
assert.deepEqual([haqosOverBox?.category, haqosOverBox?.ratedFlowLph], ["other", 5000], "Haqos OverBox 5000 başlıkta yayımlanan 5000 L/saat değerini taşımalı fakat filtre sayılmamalı");
for (const powerW of [25, 50, 75, 100, 150, 200, 300]) {
  const item = haqosProfiles.find((entry) => entry.model === `Thermo-Genius ${powerW} W`);
  assert.deepEqual([item?.category, item?.powerW, item?.recommendedMaxL], ["heater", powerW, powerW], `Haqos Thermo-Genius ${powerW} W doğrulanmış güç/hacim varyantını taşımalı`);
  assert.equal(item?.sourceUrl, "https://www.haqos.com/productshow-45495754.html", `Haqos Thermo-Genius ${powerW} W resmî seri sayfasına bağlanmalı`);
}
const haqosThermoSprite = haqosProfiles.find((entry) => entry.model === "Thermo-Sprite Micro Plastic Heater");
assert.deepEqual([haqosThermoSprite?.category, haqosThermoSprite?.powerW, haqosThermoSprite?.recommendedMaxL], ["heater", 15, undefined], "Haqos Thermo-Sprite doğrulanmış 15 W gücü taşımalı; hacim sınırı uydurulmamalı");
assert.equal(haqosThermoSprite?.sourceUrl, "https://www.haqos.com/productshow-45495753.html", "Haqos Thermo-Sprite resmî ürün sayfasına bağlanmalı");
assert.equal(haqosThermoSprite?.additionalSourceUrls?.[0], "https://www.bettamarketim.com.tr/haqos-mikro-rezistans-kaplumbaga-isiticisi-15-watt", "Haqos Thermo-Sprite güvenilir yerel 15 W kaynağını taşımalı");
assert.equal(haqosThermoSprite?.verifiedAt, "2026-09-06", "Haqos Thermo-Sprite güncel doğrulama tarihini taşımalı");
assert.equal(haqosThermoSprite?.capacityDataNote, undefined, "Haqos Thermo-Sprite otomatik ısıtıcı hesabına katılmalı");

for (const [model, flow, power] of [["NW-450F", 450, 4], ["NW-600F", 600, 6], ["NW-800F", 800, 15], ["NW-1500F", 1500, 20], ["NB-1500F", 1500, 20]]) {
  const item = equipmentCatalog.find((entry) => entry.brand === "Nubios" && entry.model === model);
  assert(item, `Nubios ${model} katalogda bulunmalı`);
  assert.equal(item.category, "filter", `Nubios ${model} filtre kategorisinde bulunmalı`);
  assert.deepEqual([item.ratedFlowLph, item.powerW], [flow, power], `Nubios ${model} kutu üzerindeki model bazlı teknik değerleri taşımalı`);
  assert.equal(item.capacityDataNote, undefined, `Nubios ${model} doğrulanmış debiye rağmen kapasite hesabından dışlanmamalı`);
  assert(item.sourceUrl.includes(model.toLowerCase()), `Nubios ${model} doğrudan ürün sayfasına bağlanmalı`);
  assert.equal(item.verifiedAt, "2026-08-29", `Nubios ${model} güncel doğrulama tarihini taşımalı`);
}
for (const [model, productCode] of [["YU-118C", "771-YU118C1"], ["YU-119C", "771-YU119C"]]) {
  const item = equipmentCatalog.find((entry) => entry.brand === "Nubios" && entry.model === model);
  assert(item, `Nubios ${model} katalogda bulunmalı`);
  assert.equal(item.category, "filter", `Nubios ${model} filtre kategorisinde bulunmalı`);
  assert.equal(item.ratedFlowLph, undefined, `Nubios ${model} debisi model bazlı kaynak olmadan tahmin edilmemeli`);
  assert(item.capacityDataNote?.includes("otomatik filtrasyon hesabına katılmaz"), `Nubios ${model} yayımlanmamış debi nedeniyle kapasite hesabından açıkça dışlanmalı`);
  assert(item.specifications.includes(productCode), `Nubios ${model} doğrulanmış ürün kodunu taşımalı`);
  assert.equal(item.powerW, 5, `Nubios ${model} doğrulanmış 5 W gücü taşımalı`);
  assert.equal(item.verifiedAt, "2026-09-25", `Nubios ${model} güncel doğrulama tarihini taşımalı`);
}
assert.match(equipmentCatalog.find((entry) => entry.id === "nubios-yu118c")?.capacityDataNote || "", /XY-2900(?:'un 450 L\/saat)? verisi(?:ni yayımlayan hatalı satıcı metni reddedildi| kopyalanmadı)/, "Nubios YU-118C başka markanın teknik verisini devralmamalı");
for (const [model, flow, power, maxL] of [["MY03", 300, 3, 50], ["MY05", 450, 5, 100], ["MY07", 600, 7, 150], ["MY10", 800, 10, 250]]) {
  const item = equipmentCatalog.find((entry) => entry.brand === "Nubios" && entry.model === model);
  assert.deepEqual([item?.category, item?.ratedFlowLph, item?.powerW, item?.recommendedMaxL], ["filter", flow, power, maxL], `Nubios ${model} yayımlanmış model tablosundaki kapasiteyi taşımalı`);
  assert.equal(item?.capacityDataNote, undefined, `Nubios ${model} doğrulanmış debiye rağmen kapasite hesabından dışlanmamalı`);
}
assert.equal(equipmentCatalog.find((entry) => entry.id === "nubios-ch-729")?.ratedFlowLph, 520, "Nubios elektrikli dip süpürgesi doğrulanmış 520 L/saat pompa debisini taşımalı");
const waterBearG220 = equipmentCatalog.find((entry) => entry.brand === "WaterBear" && entry.model === "WB-G220");
assert.deepEqual([waterBearG220?.ratedFlowLph, waterBearG220?.powerW, waterBearG220?.adjustableFlow], [500, 8, true], "WaterBear WB-G220 Türkiye varyantının doğrulanmış teknik değerlerini taşımalı");
assert(waterBearG220?.sourceUrl.includes("aquarubi.com/waterbear-wb-g220"), "WaterBear WB-G220 ilgisiz Eurogold kategori sayfasına bağlanmamalı");

const aquaproInletPipe12 = equipmentCatalog.find((entry) => entry.id === "aquapro-inlet-strainer-12");
const aquaproInletPipe16 = equipmentCatalog.find((entry) => entry.id === "aquapro-inlet-strainer-16");
const aquaproPetg12 = equipmentCatalog.find((entry) => entry.id === "aquapro-inlet-12");
const aquaproPetg16 = equipmentCatalog.find((entry) => entry.id === "aquapro-inlet-16");
assert(aquaproInletPipe12?.sourceUrl.includes("aquapro-inlet-emis-borusu-suzgeci-12mm"), "Aquapro 12 mm emiş borusu süzgeci kendi ürün sayfasına bağlanmalı");
assert(aquaproInletPipe16?.sourceUrl.includes("aquapro-inlet-emis-borusu-suzgeci-16mm"), "Aquapro 16 mm emiş borusu süzgeci kendi ürün sayfasına bağlanmalı");
assert(aquaproPetg12?.sourceUrl.includes("aquapro-inlet-12mm-emis-suzgec-6975017512225"), "Aquapro barkodlu 12 mm PETG emiş süzgeci kendi ürün sayfasına bağlanmalı");
assert(aquaproPetg16?.sourceUrl.includes("aquapro-inlet-16mm-emis-suzgec-6975017512546"), "Aquapro barkodlu 16 mm PETG emiş süzgeci kendi ürün sayfasına bağlanmalı");
assert.equal(new Set([aquaproInletPipe12, aquaproInletPipe16, aquaproPetg12, aquaproPetg16].map((item) => item?.sourceUrl)).size, 4, "Aquapro'nun iki ayrı emiş süzgeci ailesindeki dört seçenek karıştırılmamalı");
for (const [model, flow, volume] of [["Nano Easy Tank 4,5 L", 180, 4.5], ["Masaüstü Akvaryum Seti 12 L", 250, 12], ["Masaüstü Akvaryum Seti Fanus 12 L", 150, 12]]) {
  const set = equipmentCatalog.find((entry) => entry.brand === "Nubios" && entry.model === model);
  assert.deepEqual([set?.category, set?.ratedFlowLph, set?.recommendedMaxL], ["other", flow, volume], `Nubios ${model} entegre sistem verilerini taşımalı`);
  assert(set?.sourceUrl.includes("aquarubi.com"), `Nubios ${model} güncel yerel ürün kaynağına bağlanmalı`);
}
const nubiosModels = new Set(equipmentCatalog.filter((entry) => entry.brand === "Nubios").map((entry) => entry.model));
for (const model of ["NB-150 Betta Habitat Nano Tank", "Şeffaf Dış Filtre Hortumu 12/16 mm 1 m", "Şeffaf Dış Filtre Hortumu 16/22 mm 1 m", "Dış Filtre Hortumu 12/16 mm 10 m", "Dış Filtre Hortumu 16/22 mm 10 m", "Pompalı Dip Sifonu Küçük", "Pompalı Vanalı Dip Sifonu Büyük", "KDSM01 Mini", "KDSM02 Small", "FPD-51A 5in1", "FPD51B 5in1", "FPD51-T 5in1 Teleskopik", "NB-002 Pompalı Dip Sifonu", "ZHDG-02-B Kaplumbağa Bahçesi Beyaz 46 cm", "ZHDG-03-B Kaplumbağa Bahçesi Beyaz 66 cm", "ZHDG-02-Y Kaplumbağa Bahçesi Yeşil 46 cm"]) {
  assert(nubiosModels.has(model), `Nubios ${model} güncel Türkiye portföyünde bulunduğu için katalogda yer almalı`);
}
const nubiosEquipment = equipmentCatalog.filter((entry) => entry.brand === "Nubios");
assert.equal(nubiosEquipment.length, 48, "Nubios doğrulanmış ekipman ve aksesuar kapsamı 48 ayrı kayıt içermeli");
assert.deepEqual(
  Object.fromEntries(["filter", "other"].map((category) => [category, nubiosEquipment.filter((entry) => entry.category === category).length])),
  {filter:16, other:32},
  "Nubios filtreleri ve yardımcı ekipmanları kullanıcı seçiminde doğru kategoriye ayrılmalı",
);
assert.equal(nubiosEquipment.some((entry) => entry.model === "KDSM01 Small"), false, "Nubios Small cam sileceği Mini model koduyla karıştırılmamalı");
for (const [model, productCode] of [["KDSM01 Mini","771-KDSM01"],["KDSM02 Small","771-KDSM02"],["FPD-51A 5in1","771-FPD51A"],["FPD51-T 5in1 Teleskopik","670-FPD51-T"],["NB-002 Pompalı Dip Sifonu","771-S0002"],["ZHDG-02-B Kaplumbağa Bahçesi Beyaz 46 cm","670-ZHDG-02-B"],["ZHDG-03-B Kaplumbağa Bahçesi Beyaz 66 cm","670-ZHDG-03-B"],["ZHDG-02-Y Kaplumbağa Bahçesi Yeşil 46 cm","670-ZHDG-02-Y"]]) {
  const item = nubiosEquipment.find((entry) => entry.model === model);
  assert.equal(new URL(item?.sourceUrl).hostname, "atakanpetshop.com", `Nubios ${model} doğrudan güncel ürün sayfasına bağlanmalı`);
  assert(item?.specifications.includes(productCode), `Nubios ${model} yayımlanan ürün kodunu taşımalı`);
  assert.equal(item?.verifiedAt, "2026-09-09", `Nubios ${model} güncel doğrulama tarihini taşımalı`);
}
for (const model of ["ZHDG-02-B Kaplumbağa Bahçesi Beyaz 46 cm","ZHDG-03-B Kaplumbağa Bahçesi Beyaz 66 cm","ZHDG-02-Y Kaplumbağa Bahçesi Yeşil 46 cm"]) {
  const item = nubiosEquipment.find((entry) => entry.model === model);
  assert.equal(item?.ratedFlowLph, undefined, `Nubios ${model} yayımlanmayan filtre debisini tahmin etmemeli`);
  assert.equal(item?.powerW, undefined, `Nubios ${model} yayımlanmayan lamba veya filtre gücünü tahmin etmemeli`);
}
for (const [model, sourceHost] of [
  ["Masaüstü Plastik Akvaryum Seti 5 L Küp", "cikletistpetshop.com"],
  ["Masaüstü Plastik Akvaryum Seti 3,7 L Faunus", "cikletistpetshop.com"],
  ["NB-A20-INCA-S Nano Akvaryum Inca Siyah", "aquarubi.com"],
  ["DA-L25 Masaüstü Akvaryum Seti 13,5 L Küp", "atakanpetshop.com"],
  ["Karides Kepçesi Kare 7 × 7 cm", "cikletistpetshop.com"],
  ["Dijital Kombo Termometre-Higrometre", "cikletistpetshop.com"],
]) {
  const item = nubiosEquipment.find((entry) => entry.model === model);
  assert.deepEqual([item?.category, item?.verifiedAt], ["other", "2026-08-27"], `Nubios ${model} güncel yerel portföy kaydı olarak bulunmalı`);
  assert(item?.sourceUrl.includes(sourceHost), `Nubios ${model} onaylı yerel ürün kaynağına bağlanmalı`);
  assert.equal(item?.ratedFlowLph, undefined, `Nubios ${model} için yayımlanmayan pompa debisi tahmin edilmemeli`);
}

const mufanModels = new Set(equipmentCatalog.filter((entry) => entry.brand === "Mufan").map((entry) => entry.model));
for (const way of [2, 3, 4, 5, 6]) {
  assert(mufanModels.has(`CO₂ Splitter ${way} Yollu`), `Mufan ${way} yollu CO₂ dağıtıcı katalogda bulunmalı`);
}
assert(mufanModels.has("Inline CO₂ Diffuser 12/16 mm"), "Mufan 12/16 mm hat içi difüzör katalogda bulunmalı");
assert(mufanModels.has("Inline CO₂ Diffuser 16/22 mm"), "Mufan 16/22 mm hat içi difüzör katalogda bulunmalı");
assert.equal(mufanModels.size, 30, "Mufan'ın Türkiye varyantları ve ayrıca doğrulanan uluslararası CO₂ aksesuarları 30 ekipman kaydı içermeli");
for (const model of ["Akrilik Boru Tutucu Aparat", "Sis Makinesi", "Paslanmaz Çelik Emiş Süzgeci 12 mm", "Paslanmaz Çelik Emiş Süzgeci 16 mm", "Akvaryum Bitki Budama Seti 6'lı", "Refraktometre Tuz Ölçer"]) {
  assert(mufanModels.has(model), `Mufan ${model} ekipman kataloğunda bulunmalı`);
}
const mufanMedia = careProductCatalog.filter((item) => item.brand === "Mufan" && item.category === "filter_media");
assert.equal(mufanMedia.length, 4, "Mufan altı katmanlı filtre süngerinin dört doğrulanmış ölçüsü bulunmalı");
assert(mufanMedia.every((item) => item.description.includes("kalınlık belirtilmedi")), "Mufan filtre süngerlerinde çelişkili kalınlık değeri kesin bilgi gibi sunulmamalı");
const currentMufanTurkeyModels = [
  "Akrilik Boru Tutucu Aparat",
  ...[20,25,30,35,40].map((length) => `Çelik CO₂ Difüzörü ${length} cm`),
  "W21.8 CO₂ Regülatörü", "W21.8 Selenoid Valfli CO₂ Regülatörü", "Damla Sayaçlı Çift Göstergeli CO₂ Regülatörü",
  ...["30 × 30 cm", "30 × 40 cm", "40 × 50 cm", "40 × 60 cm"].map((size) => `6 Katlı Biyolojik Filtre Süngeri ${size}`),
  "Paslanmaz Çelik Emiş 12 mm / Basış 12 mm Set", "Paslanmaz Çelik Emiş 16 mm / Basış 12 mm Set", "Paslanmaz Çelik Emiş 16 mm / Basış 16 mm Set",
  "Yüzey Emişli Paslanmaz Çelik Emiş 16 mm / Basış 12 mm Set", "Yüzey Emişli Paslanmaz Çelik Emiş 16 mm / Basış 16 mm Set",
  "Sis Makinesi", "Paslanmaz Çelik Emiş Süzgeci 12 mm", "Paslanmaz Çelik Emiş Süzgeci 16 mm", "Akvaryum Tutucu Aparat", "Akvaryum Bitki Budama Seti 6'lı", "Refraktometre Tuz Ölçer",
];
assert.equal(currentMufanTurkeyModels.length, 24, "Mufan yetkili satıcı portföyü seçenek düzeyinde 24 ürün içermeli");
const allMufanModels = new Set([...mufanModels, ...mufanMedia.map((entry) => entry.model)]);
for (const model of currentMufanTurkeyModels) {
  assert(allMufanModels.has(model), `Mufan güncel Türkiye portföyü modeli eksik: ${model}`);
}
for (const model of ["W21.8 CO₂ Regülatörü", "W21.8 Selenoid Valfli CO₂ Regülatörü", "Damla Sayaçlı Çift Göstergeli CO₂ Regülatörü", "Akrilik Boru Tutucu Aparat", "Akvaryum Tutucu Aparat", "Akvaryum Bitki Budama Seti 6'lı", "Refraktometre Tuz Ölçer"]) {
  const item = equipmentCatalog.find((entry) => entry.brand === "Mufan" && entry.model === model);
  assert(item?.sourceUrl.startsWith("https://atakanpetshop.com/mufan-"), `Mufan ${model} doğrudan yetkili satıcı ürün sayfasına bağlanmalı`);
  assert.equal(item?.verifiedAt, "2026-08-26", `Mufan ${model} güncel doğrulama tarihini taşımalı`);
}
for (const model of currentMufanTurkeyModels.filter((model) => model.includes("Emiş") && model.includes("Basış"))) {
  assert.equal(equipmentCatalog.find((entry) => entry.brand === "Mufan" && entry.model === model)?.category, "other", `Mufan ${model} otomatik filtre kapasitesi hesabına karışmamalı`);
}

const tropicaEquipment = equipmentCatalog.filter((entry) => entry.brand === "Tropica");
assert.equal(tropicaEquipment.length, 8, "Tropica'nın resmî CO₂ ve bakım aleti serisi eksiksiz bulunmalı");
assert(
  tropicaEquipment.filter((entry) => entry.category === "co2").length === 5,
  "Tropica CO₂ sistemleri yalnızca CO₂ kategorisinde bulunmalı",
);
const tropicaBio = tropicaEquipment.find((entry) => entry.model === "CO₂ System Bio");
assert.equal(tropicaBio?.recommendedMaxL, 60, "Tropica CO₂ System Bio hacim sınırı 60 litre olmalı");
assert.equal(tropicaBio?.sourceUrl, "https://tropica.com/en/plant-care.aspx", "Tropica CO₂ System Bio hacim sınırı resmî portföy sayfasına bağlanmalı");
assert(tropicaEquipment.every((entry) => entry.verifiedAt === "2026-08-26"), "Tropica ekipman portföyünün güncel doğrulama tarihi bulunmalı");
const tropicaCare = careProductCatalog.filter((entry) => entry.brand === "Tropica");
assert.equal(tropicaCare.length, 8, "Tropica'nın resmî bitki bakım portföyü sekiz ürün ailesi içermeli");
assert.equal(tropicaCare.filter((entry) => entry.category === "fertilizer").length, 4, "Tropica dört bitki besini ailesi içermeli");
assert.equal(tropicaCare.filter((entry) => entry.category === "water_conditioner").length, 1, "Tropica Water Conditioner doğru kategoride bulunmalı");
assert.equal(tropicaCare.filter((entry) => entry.category === "substrate").length, 3, "Tropica üç taban ürünü ailesi içermeli");
for (const model of ["Premium Nutrition", "Specialised Nutrition", "Carbon Nutrition", "Nutrition Capsules", "Water Conditioner", "Aquarium Soil", "Aquarium Soil Powder", "Substrate"]) {
  const item = tropicaCare.find((entry) => entry.model === model);
  assert(item, `Tropica güncel bakım ürünü eksik: ${model}`);
  assert(item.sourceUrl.startsWith("https://tropica.com/en/plant-care/"), `Tropica ${model} doğrudan resmî ürün kaynağına bağlanmalı`);
  assert.notEqual(item.sourceUrl, "https://tropica.com/en/plant-care/", `Tropica ${model} genel marka sayfasına bırakılmamalı`);
  assert.equal(item.verifiedAt, "2026-08-26", `Tropica ${model} güncel doğrulama tarihini taşımalı`);
}

const twinstarEquipment = equipmentCatalog.filter((entry) => entry.brand === "Twinstar");
assert.equal(twinstarEquipment.length, 40, "Twinstar Ver.5 S/E, Ver.3 B, önceki nesil ışıklar ve iki NANO sterilizatörle 40 kayıt içermeli");
assert.equal(twinstarEquipment.filter((entry) => entry.category === "lighting").length, 38, "Twinstar aydınlatma modelleri lighting kategorisinde bulunmalı");
assert.equal(twinstarEquipment.filter((entry) => entry.category === "other").length, 2, "UV kullanmayan Twinstar NANO cihazları yanıltıcı UV kategorisine konmamalı");
for (const [model,power,lumenText,min,max] of [["E-Line IV 200EA",13,"900 lm",20,25],["E-Line IV 750EA",60,"3700 lm",80,90],["E-Line IV 1200EA",79,"4600 lm",110,120],["B Line Ver.3 20B",10,"750 lm",20,25],["B Line Ver.3 75B",39,"3200 lm",75,85],["B Line Ver.3 120B",52,"4100 lm",120,125],["S Line Ver.5 200S",17,"1000 lm",20,25],["S Line Ver.5 600S",67,"4100 lm",60,70],["S Line Ver.5 1200S",100,"6200 lm",120,130],["E Line Ver.5 300E",19,"1200 lm",30,36],["E Line Ver.5 900E",69,"3700 lm",90,100]]) {
  const item = twinstarEquipment.find((entry) => entry.model === model);
  assert.equal(item?.powerW, power, `Twinstar ${model} güncel resmî güç değerini taşımalı`);
  assert(item?.specifications.includes(lumenText), `Twinstar ${model} güncel resmî lümen değerini taşımalı`);
  assert.deepEqual(item?.recommendedTankLengthCm, [min,max], `Twinstar ${model} güncel akvaryum uzunluğu aralığını taşımalı`);
}
assert.equal(twinstarEquipment.filter((entry) => entry.model.startsWith("B Line Legacy")).length, 5, "Önceki nesil Twinstar B Line cihazları yanlışlıkla güncel seri gibi sunulmamalı");
assert.equal(twinstarEquipment.filter((entry) => entry.model.startsWith("S Line Ver.5")).length, 6, "Twinstar güncel S Line Ver.5 ailesinin altı modeli bulunmalı");
assert.equal(twinstarEquipment.filter((entry) => entry.model.startsWith("E Line Ver.5")).length, 7, "Twinstar güncel E Line Ver.5 ailesinin yedi modeli bulunmalı");
const twinstarNano = twinstarEquipment.find((entry) => entry.model === "NANO Sterilizer");
assert.deepEqual([twinstarNano?.recommendedMinL,twinstarNano?.recommendedMaxL],[30,120],"Twinstar NANO resmî 30–120 L kapasitesini taşımalı");
assert(twinstarNano?.specifications.includes("UV kullanmayan"),"Twinstar NANO kullanıcıya UV cihazı gibi sunulmamalı");
const twinstarNanoPlus = twinstarEquipment.find((entry) => entry.model === "NANO Plus Sterilizer");
assert.deepEqual([twinstarNanoPlus?.recommendedMinL,twinstarNanoPlus?.recommendedMaxL],[50,250],"Twinstar NANO Plus resmî 50–250 L kapasitesini taşımalı");
assert(twinstarEquipment.every((entry) => entry.sourceUrl?.startsWith("https://") && /^\d{4}-\d{2}-\d{2}$/.test(entry.verifiedAt ?? "")),"Tüm Twinstar kayıtları doğrulanabilir HTTPS kaynak ve tarih taşımalı");
const twinstar750E = twinstarEquipment.find((entry) => entry.model === "E Line Ver.5 750E");
assert.equal(twinstar750E?.recommendedTankLengthCm,undefined,"Twinstar 750E çelişkili resmî uzunlukla otomatik uygunluk kararı vermemeli");
assert(twinstar750E?.specifications.includes("çelişkili"),"Twinstar 750E kaynak çelişkisi kullanıcıdan gizlenmemeli");

const aquaproEquipment = equipmentCatalog.filter((entry) => entry.brand === "Aquapro");
assert.equal(aquaproEquipment.length, 28, "Aquapro güncel Türkiye portföyündeki 28 ürünün tamamı bulunmalı");
for (const model of ["CO₂ Diffuser Small", "CO₂ Diffuser Hang Small", "CO₂ Diffuser Hang Medium"]) {
  assert.equal(aquaproEquipment.find((entry) => entry.model === model)?.category, "co2", `Aquapro ${model} CO₂ kategorisinde bulunmalı`);
}
for (const model of ["Pipe Holder XS 12–16 mm", "Lily Flow M 16 mm", "Emiş Basış Takımı 12/16 mm", "Lily Pipe Glass 12 mm", "Lily Pipe Glass Premium 12 mm", "Lily Pipe Glass Premium 16 mm", "Glass Plant Pot"]) {
  assert.equal(aquaproEquipment.find((entry) => entry.model === model)?.category, "other", `Aquapro ${model} aksesuar kategorisinde bulunmalı`);
}
const aquaproHangMedium = aquaproEquipment.find((entry) => entry.model === "CO₂ Diffuser Hang Medium");
assert.equal(aquaproHangMedium?.recommendedMinL, 125, "Aquapro Hang Medium alt hacim sınırı 125 litre olmalı");
assert.equal(aquaproHangMedium?.recommendedMaxL, 300, "Aquapro Hang Medium üst hacim sınırı 300 litre olmalı");

const masterLineEquipment = equipmentCatalog.filter((entry) => entry.brand === "MasterLine");
assert.equal(masterLineEquipment.length, 5, "MasterLine bakım aletleri ekipman kataloğunda eksiksiz bulunmalı");
assert(masterLineEquipment.every((entry) => entry.category === "other"), "MasterLine bakım aletleri yanlış kategoriye karışmamalı");

const livestockCategories = [...new Set(speciesCatalog.map((item) => item.category))];
const ocellarisClownfish = speciesCatalog.find((item) => item.id === "ocellaris-clownfish");
assert(ocellarisClownfish, "Ocellaris palyaço balığı doğrulanmış deniz canlısı kataloğunda bulunmalı");
assert.deepEqual(
  [ocellarisClownfish.scientificName, ocellarisClownfish.minVolumeL, ocellarisClownfish.minTankLengthCm, ocellarisClownfish.minGroup, ocellarisClownfish.temperature, ocellarisClownfish.ph, ocellarisClownfish.specificGravity],
  ["Amphiprion ocellaris", 60, 60, 2, [24, 26], [7.9, 8.3], [1.020, 1.025]],
  "Ocellaris palyaço balığı OATA ve uzman kaynaklardaki güvenli deniz akvaryumu eşiklerini taşımalı",
);
assert.deepEqual(speciesWaterTypes(ocellarisClownfish), ["saltwater"], "Ocellaris yalnızca tuzlu su akvaryumu seçicisinde görünmeli");
assert.deepEqual(speciesWaterTypes(speciesCatalog.find((item) => item.id === "neon-tetra")), ["freshwater"], "Eski tatlı su profilleri açık su türü alanı olmadan geriye uyumlu kalmalı");
assert.equal(speciesForLivestock({commonName:"Ocelleris Clown (Wild)",category:"fish",quantity:1})?.id, "ocellaris-clownfish", "Cikletist satış adı doğru Ocellaris profiline bağlanmalı");
assert.equal(ocellarisClownfish.verifiedAt, "2026-08-31", "İlk deniz canlısı güncel doğrulama tarihini taşımalı");
const verifiedClownfishProfiles = [
  ["pink-skunk-clownfish", "Amphiprion perideraion", "False Skunk-Stripe Anemonefish", 10, 120, 70],
  ["tomato-clownfish", "Amphiprion frenatus", "Tomato Clown", 14, 120, 90],
  ["saddleback-clownfish", "Amphiprion polymnus", "Saddleback Clown", 13, 120, 90],
  ["maroon-clownfish", "Amphiprion biaculeatus", "Maroon Clown", 17, 120, 100],
];
for (const [id, scientificName, salesName, adultSizeCm, minVolumeL, minTankLengthCm] of verifiedClownfishProfiles) {
  const profile = speciesCatalog.find((item) => item.id === id);
  assert(profile, `${salesName} doğrulanmış deniz canlısı kataloğunda bulunmalı`);
  assert.deepEqual(
    [profile.scientificName, profile.adultSizeCm, profile.minVolumeL, profile.minTankLengthCm, profile.minGroup],
    [scientificName, adultSizeCm, minVolumeL, minTankLengthCm, 2],
    `${salesName} tür bazlı kimlik, erişkin boy ve güvenli çift eşiğini taşımalı`,
  );
  assert.deepEqual(speciesWaterTypes(profile), ["saltwater"], `${salesName} yalnızca tuzlu su akvaryumu seçicisinde görünmeli`);
  assert.deepEqual([profile.temperature, profile.ph, profile.specificGravity], [[24, 26], [8.1, 8.3], [1.020, 1.025]], `${salesName} doğrulanmış deniz suyu aralıklarını taşımalı`);
  assert.equal(speciesForLivestock({commonName:salesName,category:"fish",quantity:1})?.id, id, `${salesName} doğru bilimsel profile bağlanmalı`);
  assert(profile.sourceUrl?.startsWith("https://"), `${salesName} doğrudan HTTPS bakım kaynağı taşımalı`);
  assert.equal(profile.verifiedAt, "2026-08-31", `${salesName} güncel doğrulama tarihini taşımalı`);
}
const perculaClownfish = speciesCatalog.find((item) => item.id === "percula-clownfish");
assert(perculaClownfish, "Full Black Percula satış adı için doğrulanmış Amphiprion percula profili bulunmalı");
assert.deepEqual(
  [perculaClownfish.scientificName, perculaClownfish.adultSizeCm, perculaClownfish.minVolumeL, perculaClownfish.minTankLengthCm, perculaClownfish.minGroup],
  ["Amphiprion percula", 11, 100, undefined, 2],
  "Percula profili yayımlanmayan tank uzunluğunu uydurmadan tür bazlı boy, hacim ve çift eşiğini taşımalı",
);
assert(perculaClownfish.tankLengthDataNote?.includes("yayımlıyor ancak"), "Percula eksik tank uzunluğu verisini kullanıcıdan ve denetimden gizlememeli");
assert.deepEqual([perculaClownfish.temperature, perculaClownfish.ph, perculaClownfish.specificGravity], [[23, 27], [8.1, 8.4], [1.020, 1.025]], "Percula doğrulanmış deniz suyu aralıklarını taşımalı");
assert.equal(speciesForLivestock({commonName:"Percula Clownfish (Full Black)",category:"fish",quantity:1})?.id, "percula-clownfish", "Cikletist Full Black satış adı doğru Amphiprion percula profiline bağlanmalı");
assert.deepEqual(speciesWaterTypes(perculaClownfish), ["saltwater"], "Percula yalnız tuzlu su akvaryumu seçicisinde görünmeli");
assert(perculaClownfish.sourceUrl?.startsWith("https://") && perculaClownfish.additionalSourceUrls?.length >= 4, "Percula tür ve varyete kimliği birden fazla HTTPS kaynakla doğrulanmalı");
const longTentacleAnemone = speciesCatalog.find((item) => item.id === "long-tentacle-anemone");
assert(longTentacleAnemone, "Green Long Tentacle Anemone doğrulanmış deniz omurgasızı kataloğunda bulunmalı");
assert.deepEqual(
  [longTentacleAnemone.scientificName, longTentacleAnemone.adultSizeCm, longTentacleAnemone.minVolumeL, longTentacleAnemone.minTankLengthCm, longTentacleAnemone.flow],
  ["Macrodactyla doreensis", 50, 300, undefined, "medium"],
  "Uzun tentaküllü anemon yalnız yayımlanmış boy, hacim ve akıntı değerlerini taşımalı",
);
assert.deepEqual(speciesWaterTypes(longTentacleAnemone), ["saltwater"], "Uzun tentaküllü anemon yalnız tuzlu su seçicisinde görünmeli");
assert.equal(speciesForLivestock({commonName:"Green Long Tentacle Anemone",category:"other",quantity:1})?.id, "long-tentacle-anemone", "Cikletist Green Long Tentacle adı doğru Macrodactyla profiline bağlanmalı");

const tiledSeaStar = speciesCatalog.find((item) => item.id === "tiled-sea-star");
assert(tiledSeaStar, "Tiled Sea Star doğrulanmış deniz omurgasızı kataloğunda bulunmalı");
assert.deepEqual(
  [tiledSeaStar.scientificName, tiledSeaStar.adultSizeCm, tiledSeaStar.minVolumeL, tiledSeaStar.minTankLengthCm, tiledSeaStar.flow],
  ["Fromia monilis", 13, 210, undefined, undefined],
  "Mozaik denizyıldızı kaynakta yayımlanmayan uzunluk ve akıntı değerlerini uydurmamalı",
);
assert.deepEqual([tiledSeaStar.temperature, tiledSeaStar.ph, tiledSeaStar.specificGravity], [[22, 26], [8.1, 8.3], [1.023, 1.025]], "Mozaik denizyıldızı doğrulanmış hassas deniz suyu aralıklarını taşımalı");
assert.equal(speciesForLivestock({commonName:"Tiled Sea Star",category:"other",quantity:1})?.id, "tiled-sea-star", "Cikletist Tiled Sea Star adı doğru Fromia profiline bağlanmalı");

const bubbleTipAnemone = speciesCatalog.find((item) => item.id === "bubble-tip-anemone");
assert(bubbleTipAnemone, "Rose/Bubble Green satış adları için doğrulanmış balon uçlu anemon profili bulunmalı");
assert.deepEqual(
  [bubbleTipAnemone.scientificName, bubbleTipAnemone.adultSizeCm, bubbleTipAnemone.minVolumeL, bubbleTipAnemone.minTankLengthCm, bubbleTipAnemone.flow],
  ["Entacmaea quadricolor", 30, 114, undefined, "medium"],
  "Balon uçlu anemon yalnız yayımlanmış boy, hacim ve akıntı değerlerini taşımalı",
);
for (const salesName of ["Rose Corn Bulb Anemone", "Bubble Green Anemone"]) {
  assert.equal(speciesForLivestock({commonName:salesName,category:"other",quantity:1})?.id, "bubble-tip-anemone", `${salesName} doğru Entacmaea profiline bağlanmalı`);
}

const blueStripedSeaSlug = speciesCatalog.find((item) => item.id === "blue-striped-sea-slug");
assert(blueStripedSeaSlug, "Blue Stripe Nudibranch doğrulanmış uzman canlı kataloğunda bulunmalı");
assert.deepEqual(
  [blueStripedSeaSlug.scientificName, blueStripedSeaSlug.adultSizeCm, blueStripedSeaSlug.minVolumeL, blueStripedSeaSlug.minTankLengthCm, blueStripedSeaSlug.flow, blueStripedSeaSlug.speciesOnly],
  ["Chelidonura varians", 7, 100, undefined, undefined, true],
  "Mavi çizgili deniz tavşanı kaynaksız tank uzunluğu veya akıntı değeri uydurmadan uzmanlık sınırını taşımalı",
);
assert.equal(speciesForLivestock({commonName:"Blue Stripe Nudibranch",category:"other",quantity:1})?.id, "blue-striped-sea-slug", "İhracat adı doğru Chelidonura profiline bağlanmalı");

const purpleAntennaNudibranch = speciesCatalog.find((item) => item.id === "purple-antenna-nudibranch");
assert(purpleAntennaNudibranch, "Antenna Purple Nudibranch doğrulanmış uzman canlı kataloğunda bulunmalı");
assert.deepEqual(
  [purpleAntennaNudibranch.scientificName, purpleAntennaNudibranch.adultSizeCm, purpleAntennaNudibranch.minVolumeL, purpleAntennaNudibranch.minTankLengthCm, purpleAntennaNudibranch.flow, purpleAntennaNudibranch.speciesOnly],
  ["Hypselodoris bullockii", 5, 114, undefined, undefined, true],
  "Mor antenli nudibranch güncel kabul edilen bilimsel adla ve yayımlanmayan teknik alanlar boş bırakılarak kaydedilmeli",
);
assert.equal(speciesForLivestock({commonName:"Antenna Purple Nudibranch",category:"other",quantity:1})?.id, "purple-antenna-nudibranch", "Resmi ihracat adı doğru Hypselodoris profiline bağlanmalı");
for (const profile of [bubbleTipAnemone, blueStripedSeaSlug, purpleAntennaNudibranch]) {
  assert.deepEqual(speciesWaterTypes(profile), ["saltwater"], `${profile.commonName} yalnız tuzlu su seçicisinde görünmeli`);
  assert(profile.sourceUrl?.startsWith("https://"), `${profile.commonName} HTTPS bakım kaynağı taşımalı`);
  assert.equal(profile.verifiedAt, "2026-08-31", `${profile.commonName} güncel doğrulama tarihini taşımalı`);
}

for (const unresolvedMarineName of [
  "Red Carpet Anemone (Rare)",
  "Green Carpet Anemone",
  "Green Carpet Anemone L Boy",
  "Sand Cucumber",
]) {
  assert.equal(
    speciesForLivestock({commonName:unresolvedMarineName,category:"other",quantity:1}),
    undefined,
    `${unresolvedMarineName} bilimsel kimlik kesinleşmeden tahminle bir profile bağlanmamalı`,
  );
}
assert.equal(
  new Set(speciesCatalog.map((item) => item.id)).size,
  speciesCatalog.length,
  "Canlı kataloğunda yinelenen kimlik bulunmamalı",
);
assert.equal(
  speciesCatalog.filter((item) => item.scientificName === "Stiphodon semoni").length,
  1,
  "Stiphodon semoni çelişen iki ayrı bakım profili olarak çoğaltılmamalı",
);
assert.equal(speciesCatalog.find((item) => item.id === "sparkling-gourami")?.commonName, "Parıltılı gurami", "Trichopsis pumila, Trichogaster lalius ile aynı Türkçe adla gösterilmemeli");
assert(speciesCatalog.filter((item) => speciesGroup(item) === "cichlid").length >= 38, "Cichlid kataloğu yaygın Amerika, Afrika ve Tanganika türlerini kapsamalı");
for (const id of ["jack-dempsey", "texas-cichlid", "jewel-cichlid", "tropheus-duboisi"]) {
  const species = speciesCatalog.find((item) => item.id === id);
  assert(species, `${id} yaygın hobi türü katalogda bulunmalı`);
  assert(species.minVolumeL > 0 && species.minTankLengthCm > 0, `${id} sağlık analizi için güvenli minimum tank verilerini taşımalı`);
}
assert.equal(speciesCatalog.find((item) => item.id === "texas-cichlid")?.speciesOnly, true, "Texas ciklet topluluk akvaryumuna güvenli tür gibi önerilmemeli");
assert.equal(speciesCatalog.find((item) => item.id === "tropheus-duboisi")?.minGroup, 10, "Duboisi Tropheus tekli veya küçük grup olarak önerilmemeli");
assert(speciesCatalog.filter((item) => speciesGroup(item) === "livebearer").length >= 13, "Canlı doğuran kataloğu yaygın Poeciliid, Limia ve Goodeid türlerini kapsamalı");
for (const [id, minVolumeL, minGroup] of [
  ["butterfly-goodeid", 250, 6],
  ["red-tailed-goodeid", 250, 6],
  ["sparkling-limia", 75, 6],
  ["dark-edged-splitfin", 80, 6],
]) {
  const profile = speciesCatalog.find((item) => item.id === id);
  assert(profile, `${id} canlı doğuran kataloğunda bulunmalı`);
  assert.equal(speciesGroup(profile), "livebearer", `${id} doğru canlı grubunda bulunmalı`);
  assert.equal(profile.minVolumeL, minVolumeL, `${id} doğrulanmış minimum hacmi korunmalı`);
  assert.equal(profile.minGroup, minGroup, `${id} sosyal grup gereksinimi korunmalı`);
  assert(profile.husbandryCaution, `${id} özel bakım uyarısı taşımalı`);
}
assert.equal(speciesCatalog.find((item) => item.id === "butterfly-goodeid")?.flow, "high", "Kelebek Goodeid oksijenli ve akıntılı habitat gereksinimini taşımalı");
const butterflyGoodeid = speciesCatalog.find((item) => item.id === "butterfly-goodeid");
assert.deepEqual(
  [butterflyGoodeid?.adultSizeCm,butterflyGoodeid?.minVolumeL,butterflyGoodeid?.minTankLengthCm,butterflyGoodeid?.minGroup,butterflyGoodeid?.temperature,butterflyGoodeid?.ph,butterflyGoodeid?.flow],
  [9,250,undefined,6,[17,25],[7,8],"high"],
  "Kelebek Goodeid kaynaklı boy, hacim, grup ve mevsimsel su eşiklerini taşımalı",
);
assert.equal(butterflyGoodeid?.speciesOnly,true,"Kelebek Goodeid sıradan topluluk balığı gibi önerilmemeli");
assert.equal(butterflyGoodeid?.verifiedAt,"2026-09-30","Kelebek Goodeid güncel doğrulama tarihini taşımalı");
assert.match(butterflyGoodeid?.sourceUrl || "",/^https:\/\/www\.goodeidworkinggroup\.com\/ameca-splendens$/,"Kelebek Goodeid doğrudan koruma ve tür uzmanı kaynağa bağlanmalı");
assert(butterflyGoodeid?.tankLengthDataNote?.includes("eski 100 cm eşiği kaldırıldı"),"Kelebek Goodeid kaynakta olmayan tank uzunluğunu korumamalı");
assert(butterflyGoodeid?.husbandryCaution?.includes("8 mg/L") && butterflyGoodeid.husbandryCaution.includes("%60–80") && butterflyGoodeid.husbandryCaution.includes("25 °C üzeri"),"Kelebek Goodeid oksijen, su değişimi ve sıcaklık güvenliğini taşımalı");
const redTailedGoodeid = speciesCatalog.find((item) => item.id === "red-tailed-goodeid");
assert.deepEqual(
  [redTailedGoodeid?.adultSizeCm,redTailedGoodeid?.minVolumeL,redTailedGoodeid?.minTankLengthCm,redTailedGoodeid?.minGroup,redTailedGoodeid?.temperature,redTailedGoodeid?.ph,redTailedGoodeid?.flow],
  [7.5,250,undefined,6,[17,25],[6,8],"high"],
  "Kırmızı kuyruklu Goodeid kaynaklı boy, hacim, grup ve mevsimsel su eşiklerini taşımalı",
);
assert.equal(redTailedGoodeid?.speciesOnly,true,"Kırmızı kuyruklu Goodeid güvenli topluluk balığı gibi önerilmemeli");
assert.deepEqual(redTailedGoodeid?.waterTypes,["freshwater"],"Kırmızı kuyruklu Goodeid yalnız tatlı su profili taşımalı");
assert.equal(redTailedGoodeid?.verifiedAt,"2026-09-30","Kırmızı kuyruklu Goodeid güncel doğrulama tarihini taşımalı");
assert.match(redTailedGoodeid?.sourceUrl || "",/^https:\/\/goodeidworkinggroup\.com\/xenotoca-eiseni$/,"Kırmızı kuyruklu Goodeid doğrudan koruma ve tür uzmanı kaynağa bağlanmalı");
assert(redTailedGoodeid?.tankLengthDataNote?.includes("eski 80 cm eşiği kaldırıldı"),"Kırmızı kuyruklu Goodeid kaynakta olmayan tank uzunluğunu korumamalı");
assert(redTailedGoodeid?.husbandryCaution?.includes("8 mg/L") && redTailedGoodeid.husbandryCaution.includes("%60–80") && redTailedGoodeid.husbandryCaution.includes("25 °C üzeri"),"Kırmızı kuyruklu Goodeid oksijen, su değişimi ve sıcaklık güvenliğini taşımalı");
assert(redTailedGoodeid?.husbandryCaution?.includes("X. doadrioi") && redTailedGoodeid.husbandryCaution.includes("X. lyonsi") && redTailedGoodeid.husbandryCaution.includes("melez"),"Kırmızı kuyruklu Goodeid taksonomi ve akvaryum soyu riskini açıklamalı");
const sparklingLimia = speciesCatalog.find((item) => item.id === "sparkling-limia");
assert.deepEqual(
  [sparklingLimia?.scientificName,sparklingLimia?.adultSizeCm,sparklingLimia?.minVolumeL,sparklingLimia?.minTankLengthCm,sparklingLimia?.minGroup,sparklingLimia?.temperature,sparklingLimia?.ph,sparklingLimia?.flow],
  ["Limia perugiae",10,75,undefined,6,[22,28],[7.2,8.5],"medium"],
  "Sparkling Limia kaynaklı kimlik, koruyucu boy, hacim, grup ve su eşiklerini taşımalı",
);
assert.deepEqual(sparklingLimia?.waterTypes,["freshwater"],"Sparkling Limia kökeni doğrulanmadan acı suya otomatik önerilmemeli");
assert.equal(sparklingLimia?.verifiedAt,"2026-09-30","Sparkling Limia güncel doğrulama tarihini taşımalı");
assert.match(sparklingLimia?.sourceUrl || "",/^https:\/\/www\.fishbase\.se\/summary\/27711$/,"Sparkling Limia geçerli taksonomi ve azami boya doğrudan bağlanmalı");
assert(sparklingLimia?.tankLengthDataNote?.includes("eski 80 cm eşiği kaldırıldı"),"Sparkling Limia kaynakta olmayan tank uzunluğunu korumamalı");
assert(sparklingLimia?.husbandryCaution?.includes("10 cm azami toplam boy") && sparklingLimia.husbandryCaution.includes("6–7 cm") && sparklingLimia.husbandryCaution.includes("tuz eklenmemelidir"),"Sparkling Limia boy farkını ve kökensiz tuz kullanım riskini açıklamalı");
assert(sparklingLimia?.communityCaution?.includes("melezleşebildiğinden"),"Sparkling Limia yakın canlı doğuranlarla melezleşme riskini taşımalı");
const darkEdgedSplitfin = speciesCatalog.find((item) => item.id === "dark-edged-splitfin");
assert.deepEqual(
  [darkEdgedSplitfin?.scientificName,darkEdgedSplitfin?.adultSizeCm,darkEdgedSplitfin?.minVolumeL,darkEdgedSplitfin?.minTankLengthCm,darkEdgedSplitfin?.minGroup,darkEdgedSplitfin?.temperature,darkEdgedSplitfin?.ph,darkEdgedSplitfin?.flow],
  ["Girardinichthys multiradiatus",5,80,undefined,6,[10,22],[7.5,8.5],"medium"],
  "Koyu kenarlı Splitfin kaynaklı kimlik, boy, hacim, grup ve serin su eşiklerini taşımalı",
);
assert.equal(darkEdgedSplitfin?.speciesOnly,true,"Koyu kenarlı Splitfin sıradan tropikal topluluk balığı gibi önerilmemeli");
assert.deepEqual(darkEdgedSplitfin?.waterTypes,["freshwater"],"Koyu kenarlı Splitfin yalnız tatlı su profili taşımalı");
assert.equal(darkEdgedSplitfin?.verifiedAt,"2026-09-30","Koyu kenarlı Splitfin güncel doğrulama tarihini taşımalı");
assert.match(darkEdgedSplitfin?.sourceUrl || "",/^https:\/\/goodeidworkinggroup\.com\/girardinichthys-multiradiatus$/,"Koyu kenarlı Splitfin doğrudan koruma ve tür uzmanı kaynağa bağlanmalı");
assert(darkEdgedSplitfin?.tankLengthDataNote?.includes("eski 60 cm eşiği kaldırıldı"),"Koyu kenarlı Splitfin kaynakta olmayan tank uzunluğunu korumamalı");
assert(darkEdgedSplitfin?.husbandryCaution?.includes("8 mg/L") && darkEdgedSplitfin.husbandryCaution.includes("%60–80") && darkEdgedSplitfin.husbandryCaution.includes("22 °C üzeri") && darkEdgedSplitfin.husbandryCaution.includes("18 °C altı"),"Koyu kenarlı Splitfin oksijen, su değişimi ve mevsimsel sıcaklık güvenliğini taşımalı");
assert(darkEdgedSplitfin?.communityCaution?.includes("Girmu1") && darkEdgedSplitfin.communityCaution.includes("Girmu2"),"Koyu kenarlı Splitfin koruma birimlerinin karıştırılmaması gerektiğini açıklamalı");
const blackNeonTetra = speciesCatalog.find((item) => item.id === "black-neon-tetra");
assert.deepEqual(
  [blackNeonTetra?.scientificName,blackNeonTetra?.adultSizeCm,blackNeonTetra?.minVolumeL,blackNeonTetra?.minTankLengthCm,blackNeonTetra?.minGroup,blackNeonTetra?.temperature,blackNeonTetra?.ph,blackNeonTetra?.flow],
  ["Hyphessobrycon herbertaxelrodi",3.5,72,80,8,[20,28],[5,7.5],"medium"],
  "Siyah Neon Tetra kaynaklı kimlik, boy, tank tabanı, sürü ve su eşiklerini taşımalı",
);
assert.deepEqual(blackNeonTetra?.waterTypes,["freshwater"],"Siyah Neon Tetra yalnız tatlı su profili taşımalı");
assert.equal(blackNeonTetra?.verifiedAt,"2026-10-02","Siyah Neon Tetra güncel doğrulama tarihini taşımalı");
assert.match(blackNeonTetra?.sourceUrl || "",/^https:\/\/www\.seriouslyfish\.com\/species\/hyphessobrycon-herbertaxelrodi\/$/,"Siyah Neon Tetra doğrudan türe özel uzman bakım kaynağına bağlanmalı");
assert(blackNeonTetra?.husbandryCaution?.includes("8–10") && blackNeonTetra.husbandryCaution.includes("80 × 30 cm") && blackNeonTetra.husbandryCaution.includes("FishBase"),"Siyah Neon Tetra sürü, taban ölçüsü ve kaynak farklarını açıklamalı");
const glowlightTetra = speciesCatalog.find((item) => item.id === "glowlight-tetra");
assert.deepEqual(
  [glowlightTetra?.scientificName,glowlightTetra?.adultSizeCm,glowlightTetra?.minVolumeL,glowlightTetra?.minTankLengthCm,glowlightTetra?.minGroup,glowlightTetra?.temperature,glowlightTetra?.ph,glowlightTetra?.flow],
  ["Hemigrammus erythrozonus",4,68,60,8,[24,28],[5.5,7.5],"medium"],
  "Günışığı Tetra kaynaklı kimlik, boy, tank tabanı, sürü, su ve dolaşım eşiklerini taşımalı",
);
assert.deepEqual(glowlightTetra?.waterTypes,["freshwater"],"Günışığı Tetra yalnız tatlı su profili taşımalı");
assert.equal(glowlightTetra?.verifiedAt,"2026-10-02","Günışığı Tetra güncel doğrulama tarihini taşımalı");
assert.match(glowlightTetra?.sourceUrl || "",/^https:\/\/www\.seriouslyfish\.com\/species\/hemigrammus-erythrozonus$/,"Günışığı Tetra doğrudan türe özel uzman bakım kaynağına bağlanmalı");
assert(glowlightTetra?.additionalSourceUrls?.some((url) => url.includes("fishbase.se/summary/Hemigrammus_erythrozonus")),"Günışığı Tetra FishBase taksonomi ve doğal su kaynağına bağlanmalı");
assert(glowlightTetra?.husbandryCaution?.includes("60 × 38 cm") && glowlightTetra.husbandryCaution.includes("4–5 tank hacmi") && glowlightTetra.husbandryCaution.includes("en az beşli grup"),"Günışığı Tetra taban, dolaşım ve kaynaklardaki grup farkını açıklamalı");
const blackSkirtTetra = speciesCatalog.find((item) => item.id === "black-skirt-tetra");
assert.deepEqual(
  [blackSkirtTetra?.scientificName,blackSkirtTetra?.adultSizeCm,blackSkirtTetra?.minVolumeL,blackSkirtTetra?.minTankLengthCm,blackSkirtTetra?.minGroup,blackSkirtTetra?.temperature,blackSkirtTetra?.ph,blackSkirtTetra?.flow],
  ["Gymnocorymbus ternetzi",7.5,68,75,12,[20,26],[6,7],"medium"],
  "Siyah Etek Tetra kaynaklı kimlik, koruyucu boy, tank tabanı, sürü ve su eşiklerini taşımalı",
);
assert.deepEqual(blackSkirtTetra?.waterTypes,["freshwater"],"Siyah Etek Tetra yalnız tatlı su profili taşımalı");
assert.equal(blackSkirtTetra?.verifiedAt,"2026-10-02","Siyah Etek Tetra güncel doğrulama tarihini taşımalı");
assert.match(blackSkirtTetra?.sourceUrl || "",/^https:\/\/www\.seriouslyfish\.com\/species\/gymnocorymbus-ternetzi$/,"Siyah Etek Tetra doğrudan türe özel uzman bakım kaynağına bağlanmalı");
assert(blackSkirtTetra?.additionalSourceUrls?.some((url) => url.includes("fda.gov/animal-veterinary/intentional-genomic-alterations")),"Siyah Etek Tetra floresan varyant kimliğini FDA kaynağıyla doğrulamalı");
assert(blackSkirtTetra?.husbandryCaution?.includes("7,5 cm azami standart boy") && blackSkirtTetra.husbandryCaution.includes("en az 12'li sürü") && blackSkirtTetra.husbandryCaution.includes("kalıtsal floresan"),"Siyah Etek Tetra boy, sürü ve floresan form ayrımını açıklamalı");
assert(blackSkirtTetra?.communityCaution?.includes("yüzgeç ısırma"),"Siyah Etek Tetra düşük grup sayısındaki yüzgeç ısırma riskini göstermeli");
assert.equal(speciesForCatalogExactSearch("TRANSGENETİK TETRA XXL BOY", "fish", "freshwater")?.id,"black-skirt-tetra","Türkiye'deki transgenetik tetra satış adı doğru türe bağlanmalı");
assert.equal(speciesForCatalogExactSearch("GloFish Tetra", "fish", "freshwater")?.id,"black-skirt-tetra","GloFish Tetra satış adı FDA tarafından doğrulanan Gymnocorymbus ternetzi profiline bağlanmalı");
const lemonTetra = speciesCatalog.find((item) => item.id === "lemon-tetra");
assert.deepEqual(
  [lemonTetra?.scientificName,lemonTetra?.adultSizeCm,lemonTetra?.minVolumeL,lemonTetra?.minTankLengthCm,lemonTetra?.minGroup,lemonTetra?.temperature,lemonTetra?.ph,lemonTetra?.flow],
  ["Hyphessobrycon pulchripinnis",4,72,80,10,[20,28],[5,7.5],"low"],
  "Limon Tetra kaynaklı kimlik, boy, tank tabanı, sürü, su ve akıntı eşiklerini taşımalı",
);
assert.deepEqual(lemonTetra?.waterTypes,["freshwater"],"Limon Tetra yalnız tatlı su profili taşımalı");
assert.equal(lemonTetra?.verifiedAt,"2026-10-02","Limon Tetra güncel doğrulama tarihini taşımalı");
assert.match(lemonTetra?.sourceUrl || "",/^https:\/\/www\.seriouslyfish\.com\/species\/hyphessobrycon-pulchripinnis$/,"Limon Tetra doğrudan türe özel uzman bakım kaynağına bağlanmalı");
assert(lemonTetra?.husbandryCaution?.includes("80 × 30 cm") && lemonTetra.husbandryCaution.includes("en az beşli grup") && lemonTetra.husbandryCaution.includes("Orange Bolivia"),"Limon Tetra taban, kaynaklardaki grup farkı ve benzer ticari form kimlik riskini açıklamalı");
assert.equal(speciesForCatalogExactSearch("Limon Tetra", "fish", "freshwater")?.id,"lemon-tetra","Limon Tetra satış adı doğru bilimsel profile bağlanmalı");
assert.equal(speciesForCatalogExactSearch("Orange Bolivia", "fish", "freshwater"),undefined,"Belirsiz Orange Bolivia formu Limon Tetra profiline otomatik bağlanmamalı");
const emperorTetra = speciesCatalog.find((item) => item.id === "emperor-tetra");
assert.deepEqual(
  [emperorTetra?.scientificName,emperorTetra?.adultSizeCm,emperorTetra?.minVolumeL,emperorTetra?.minTankLengthCm,emperorTetra?.minGroup,emperorTetra?.temperature,emperorTetra?.ph,emperorTetra?.flow],
  ["Nematobrycon palmeri",4.2,81,90,10,[23,27],[5,7.5],"low"],
  "İmparator Tetra kaynaklı kimlik, boy, tank tabanı, sürü, su ve akıntı eşiklerini taşımalı",
);
assert.deepEqual(emperorTetra?.waterTypes,["freshwater"],"İmparator Tetra yalnız tatlı su profili taşımalı");
assert.equal(emperorTetra?.verifiedAt,"2026-10-02","İmparator Tetra güncel doğrulama tarihini taşımalı");
assert.match(emperorTetra?.sourceUrl || "",/^https:\/\/www\.seriouslyfish\.com\/species\/nematobrycon-palmeri$/,"İmparator Tetra doğrudan türe özel uzman bakım kaynağına bağlanmalı");
assert(emperorTetra?.husbandryCaution?.includes("mavi irisli") && emperorTetra.husbandryCaution.includes("kırmızı irisli") && emperorTetra.husbandryCaution.includes("yağ yüzgeçli"),"İmparator Tetra benzer Nematobrycon lacortei ve Inpaichthys kerri türlerinden ayırt edilmeli");
assert.equal(speciesForCatalogExactSearch("BLACK PALMERİ TETRA", "fish", "freshwater")?.id,"emperor-tetra","Siyah Palmeri satış adı doğru Nematobrycon palmeri profiline bağlanmalı");
const blueEmperorTetra = speciesCatalog.find((item) => item.id === "blue-emperor-tetra");
assert.deepEqual(
  [blueEmperorTetra?.scientificName,blueEmperorTetra?.adultSizeCm,blueEmperorTetra?.minVolumeL,blueEmperorTetra?.minTankLengthCm,blueEmperorTetra?.minGroup,blueEmperorTetra?.temperature,blueEmperorTetra?.ph,blueEmperorTetra?.flow],
  ["Inpaichthys kerri",3.5,68,60,10,[24,27],[5.5,7],"low"],
  "Mavi İmparator Tetra kaynaklı boy, tank tabanı, sürü, su ve akıntı eşiklerini taşımalı",
);
assert.deepEqual(blueEmperorTetra?.waterTypes,["freshwater"],"Mavi İmparator Tetra yalnız tatlı su profili taşımalı");
assert.equal(blueEmperorTetra?.verifiedAt,"2026-10-02","Mavi İmparator Tetra güncel doğrulama tarihini taşımalı");
assert.match(blueEmperorTetra?.sourceUrl || "",/^https:\/\/www\.seriouslyfish\.com\/species\/inpaichthys-kerri$/,"Mavi İmparator Tetra doğrudan türe özel uzman bakım kaynağına bağlanmalı");
assert(blueEmperorTetra?.additionalSourceUrls?.some((url) => url.includes("fishkeeper.co.uk/fish/freshwater/characins/blue-emperor-tetra")),"Mavi İmparator Tetra onlu sürü ve varyant bilgisini kurumsal bakım kaynağıyla doğrulamalı");
assert(blueEmperorTetra?.additionalSourceUrls?.some((url) => url.includes("fishbase.se/summary/12388")),"Mavi İmparator Tetra bilimsel boy ve dağılımını FishBase ile çapraz doğrulamalı");
assert(blueEmperorTetra?.additionalSourceUrls?.some((url) => url.includes("doi.org/10.1590/1982-0224-2023-0113")),"Mavi İmparator Tetra güncel cins ayrımını hakemli taksonomi çalışmasına bağlamalı");
assert(blueEmperorTetra?.husbandryCaution?.includes("bazı evcil kerri hatlarında") && blueEmperorTetra.husbandryCaution.includes("I. parauapiranga"),"Mavi İmparator Tetra yağ yüzgeci istisnası ve yakın tür ayrımını açıklamalı");
assert.equal(speciesForCatalogExactSearch("Purple Emperor Tetra", "fish", "freshwater")?.id,"blue-emperor-tetra","Mor İmparator Tetra ayrı Inpaichthys kerri profiline bağlanmalı");
assert.equal(speciesForCatalogExactSearch("Blue Emperor Tetra", "fish", "freshwater")?.id,"blue-emperor-tetra","Mavi İmparator Tetra Nematobrycon palmeri profiline kaymamalı");
assert.equal(speciesForCatalogExactSearch("Super Blue Kerri Tetra", "fish", "freshwater")?.id,"blue-emperor-tetra","Super Blue Kerri üretim hattı doğru profile bağlanmalı");
const buenosAiresTetra = speciesCatalog.find((item) => item.id === "buenos-aires-tetra");
assert.deepEqual(
  [buenosAiresTetra?.scientificName,buenosAiresTetra?.adultSizeCm,buenosAiresTetra?.minVolumeL,buenosAiresTetra?.minTankLengthCm,buenosAiresTetra?.minGroup,buenosAiresTetra?.temperature,buenosAiresTetra?.ph,buenosAiresTetra?.flow],
  ["Psalidodon anisitsi",13.2,81,90,10,[16,28],[5.5,8.5],"medium"],
  "Buenos Aires Tetra güncel taksonomi, bilimsel azami boy, tank tabanı, sürü, su ve akıntı eşiklerini taşımalı",
);
assert.deepEqual(buenosAiresTetra?.waterTypes,["freshwater"],"Buenos Aires Tetra yalnız tatlı su profili taşımalı");
assert.equal(buenosAiresTetra?.verifiedAt,"2026-10-02","Buenos Aires Tetra güncel doğrulama tarihini taşımalı");
assert.match(buenosAiresTetra?.sourceUrl || "",/^https:\/\/www\.seriouslyfish\.com\/species\/hyphessobrycon-anisitsi$/,"Buenos Aires Tetra doğrudan türe özel uzman bakım kaynağına bağlanmalı");
assert(buenosAiresTetra?.additionalSourceUrls?.some((url) => url.includes("fishbase.se/summary/Psalidodon-anisitsi")),"Buenos Aires Tetra azami boy, bitki tüketimi ve güncel adı FishBase ile çapraz doğrulamalı");
assert(buenosAiresTetra?.additionalSourceUrls?.some((url) => url.includes("fishcatget.asp?spid=4019")),"Buenos Aires Tetra güncel Psalidodon adını Eschmeyer kataloğuna bağlamalı");
assert(buenosAiresTetra?.husbandryCaution?.includes("6 cm standart boy") && buenosAiresTetra.husbandryCaution.includes("13,2 cm azami toplam boy"),"Buenos Aires Tetra bakım boyu ile bilimsel azami boy farkını açıklamalı");
assert(buenosAiresTetra?.husbandryCaution?.includes("28 °C civarında uzun süre") && buenosAiresTetra.husbandryCaution.includes("Yumuşak yapraklı bitkileri yiyebilir"),"Buenos Aires Tetra serin dönem ve bitki yeme riskini açıklamalı");
assert.equal(speciesForCatalogExactSearch("Hyphessobrycon anisitsi", "fish", "freshwater")?.id,"buenos-aires-tetra","Eski Buenos Aires Tetra bilimsel adı güncel profile bağlanmalı");
assert.equal(speciesForCatalogExactSearch("Golden Buenos Aires Tetra", "fish", "freshwater")?.id,"buenos-aires-tetra","Golden üretim hattı doğru Buenos Aires Tetra profiline bağlanmalı");
const colombianTetra = speciesCatalog.find((item) => item.id === "colombian-tetra");
assert.deepEqual(
  [colombianTetra?.scientificName,colombianTetra?.adultSizeCm,colombianTetra?.minVolumeL,colombianTetra?.minTankLengthCm,colombianTetra?.minGroup,colombianTetra?.temperature,colombianTetra?.ph,colombianTetra?.flow],
  ["Hyphessobrycon columbianus",7,81,90,10,[20,28],[5,7.5],"medium"],
  "Kolombiya Tetra kaynaklı kimlik, bilimsel azami boy, tank tabanı, sürü, su ve akıntı eşiklerini taşımalı",
);
assert.deepEqual(colombianTetra?.waterTypes,["freshwater"],"Kolombiya Tetra yalnız tatlı su profili taşımalı");
assert.equal(colombianTetra?.verifiedAt,"2026-10-02","Kolombiya Tetra güncel doğrulama tarihini taşımalı");
assert.equal(colombianTetra?.sourceUrl,"https://www.seriouslyfish.com/species/hyphessobrycon-columbianus","Kolombiya Tetra doğrudan türe özel uzman bakım kaynağına bağlanmalı");
assert(colombianTetra?.additionalSourceUrls?.some((url) => url.includes("fishbase.se/summary/hyphessobrycon-columbianus")),"Kolombiya Tetra azami toplam boyu ve dar doğal dağılımı FishBase ile çapraz doğrulamalı");
assert(colombianTetra?.additionalSourceUrls?.some((url) => url.includes("fluvalaquatics.com/uk/wp-content/uploads/2022/02/Species-Spotlight_Colombian-Tetra_EN.pdf")),"Kolombiya Tetra topluluk ve asgari hacim bilgisini kurumsal bakım föyüyle çapraz doğrulamalı");
assert(colombianTetra?.husbandryCaution?.includes("90 × 30 cm") && colombianTetra.husbandryCaution.includes("H. ecuadorensis"),"Kolombiya Tetra erişkin taban alanını ve geçmiş kimlik karışıklığını açıklamalı");
assert(colombianTetra?.communityCaution?.includes("8–10") && colombianTetra.communityCaution.includes("uzun yüzgeçli"),"Kolombiya Tetra sürü ve yüzgeç güvenliğini açıklamalı");
assert.equal(speciesForCatalogExactSearch("Blue Flame Tetra", "fish", "freshwater")?.id,"colombian-tetra","Blue Flame ticari adı Kolombiya Tetra profiline bağlanmalı");
assert.equal(speciesForCatalogExactSearch("Colombian Redfin Tetra", "fish", "freshwater")?.id,"colombian-tetra","Colombian Redfin ticari adı doğru profile bağlanmalı");
const redEyeTetra = speciesCatalog.find((item) => item.id === "red-eye-tetra");
assert.deepEqual(
  [redEyeTetra?.scientificName,redEyeTetra?.adultSizeCm,redEyeTetra?.minVolumeL,redEyeTetra?.minTankLengthCm,redEyeTetra?.minGroup,redEyeTetra?.temperature,redEyeTetra?.ph,redEyeTetra?.flow],
  ["Bario sanctaefilomenae",7,103,90,8,[22,26],[6,8],"medium"],
  "Kırmızı Göz Tetra güncel kimlik, boy, tank tabanı, sürü, su ve akıntı eşiklerini taşımalı",
);
assert.deepEqual(redEyeTetra?.waterTypes,["freshwater"],"Kırmızı Göz Tetra yalnız tatlı su profili taşımalı");
assert.equal(redEyeTetra?.verifiedAt,"2026-10-02","Kırmızı Göz Tetra güncel doğrulama tarihini taşımalı");
assert.equal(redEyeTetra?.sourceUrl,"https://www.seriouslyfish.com/species/bario-sanctaefilomenae","Kırmızı Göz Tetra doğrudan türe özel uzman bakım kaynağına bağlanmalı");
assert(redEyeTetra?.additionalSourceUrls?.some((url) => url.includes("fishbase.se/summary/moenkhausia-sanctaefilomenae")),"Kırmızı Göz Tetra boy, su aralığı ve eski bilimsel adı FishBase ile çapraz doğrulamalı");
assert(redEyeTetra?.husbandryCaution?.includes("90 × 38 cm") && redEyeTetra.husbandryCaution.includes("Moenkhausia sanctaefilomenae"),"Kırmızı Göz Tetra erişkin taban alanını ve eski bilimsel adını açıklamalı");
assert(redEyeTetra?.communityCaution?.includes("6–8") && redEyeTetra.communityCaution.includes("uzun yüzgeçli"),"Kırmızı Göz Tetra sürü ve hareketlilik güvenliğini açıklamalı");
assert.equal(speciesForCatalogExactSearch("Moenkhausia sanctaefilomenae", "fish", "freshwater")?.id,"red-eye-tetra","Eski Kırmızı Göz Tetra bilimsel adı güncel profile bağlanmalı");
assert.equal(speciesForCatalogExactSearch("BALON KIRMIZI GÖZ TETRA", "fish", "freshwater")?.id,"red-eye-tetra","Balon satış adı aynı biyolojik profile bağlanmalı");
const greenFireTetra = speciesCatalog.find((item) => item.id === "green-fire-tetra");
assert.deepEqual(
  [greenFireTetra?.scientificName,greenFireTetra?.adultSizeCm,greenFireTetra?.minVolumeL,greenFireTetra?.minTankLengthCm,greenFireTetra?.minGroup,greenFireTetra?.temperature,greenFireTetra?.ph,greenFireTetra?.flow],
  ["Aphyocharax rathbuni",7.1,54,60,6,[20,26],[6.5,7.5],"medium"],
  "Yeşil Ateş Tetra kaynaklı kimlik, koruyucu boy, tank tabanı, sürü, su ve akıntı eşiklerini taşımalı",
);
assert.deepEqual(greenFireTetra?.waterTypes,["freshwater"],"Yeşil Ateş Tetra yalnız tatlı su profili taşımalı");
assert.equal(greenFireTetra?.verifiedAt,"2026-10-02","Yeşil Ateş Tetra güncel doğrulama tarihini taşımalı");
assert.equal(greenFireTetra?.sourceUrl,"https://www.seriouslyfish.com/species/aphyocharax-rathbuni","Yeşil Ateş Tetra doğrudan türe özel uzman bakım kaynağına bağlanmalı");
assert(greenFireTetra?.additionalSourceUrls?.some((url) => url.includes("fishbase.se/summary/aphyocharax-rathbuni")),"Yeşil Ateş Tetra bilimsel azami boy ve su aralığını FishBase ile çapraz doğrulamalı");
assert(greenFireTetra?.additionalSourceUrls?.some((url) => url.includes("fishbase.se/Nomenclature/12340")),"Yeşil Ateş Tetra eski bilimsel eş adlarını taksonomi kaynağıyla doğrulamalı");
assert(greenFireTetra?.husbandryCaution?.includes("4,5 cm standart boy") && greenFireTetra.husbandryCaution.includes("7,1 cm"),"Yeşil Ateş Tetra akvaryum bakım boyu ile bilimsel azami boy farkını açıklamalı");
assert(greenFireTetra?.communityCaution?.includes("yüzgeç ısırmaya") && greenFireTetra.communityCaution.includes("uzun yüzgeçli"),"Yeşil Ateş Tetra sürü ve yüzgeç güvenliğini açıklamalı");
assert.equal(speciesForCatalogExactSearch("Aphyocharax stramineus", "fish", "freshwater")?.id,"green-fire-tetra","Eski Yeşil Ateş Tetra bilimsel adı güncel profile bağlanmalı");
assert.equal(speciesForCatalogExactSearch("Rathbun's Bloodfin", "fish", "freshwater")?.id,"green-fire-tetra","Rathbun's Bloodfin ortak adı doğru profile bağlanmalı");
assert.equal(speciesForCatalogExactSearch("Green Fire Tetra", "fish", "saltwater"),undefined,"Yeşil Ateş Tetra deniz kataloğunda görünmemeli");
const eightBandedFalseBarb = speciesCatalog.find((item) => item.id === "eight-banded-false-barb");
assert.deepEqual(
  [eightBandedFalseBarb?.scientificName,eightBandedFalseBarb?.adultSizeCm,eightBandedFalseBarb?.minVolumeL,eightBandedFalseBarb?.minTankLengthCm,eightBandedFalseBarb?.minGroup,eightBandedFalseBarb?.temperature,eightBandedFalseBarb?.ph,eightBandedFalseBarb?.flow],
  ["Eirmotus octozona",3.6,54,60,10,[22,26],[5,7],"low"],
  "Eirmotus octozona kaynaklı kimlik, boy, tank tabanı, sürü, su ve akıntı eşiklerini taşımalı",
);
assert.deepEqual(eightBandedFalseBarb?.waterTypes,["freshwater"],"Eirmotus octozona yalnız tatlı su profili taşımalı");
assert.equal(eightBandedFalseBarb?.verifiedAt,"2026-10-02","Eirmotus octozona güncel doğrulama tarihini taşımalı");
assert.equal(eightBandedFalseBarb?.sourceUrl,"https://www.seriouslyfish.com/species/eirmotus-octozona","Eirmotus octozona doğrudan türe özel uzman bakım kaynağına bağlanmalı");
assert(eightBandedFalseBarb?.additionalSourceUrls?.some((url) => url.includes("fishbase.se/summary/Eirmotus-octozona")),"Eirmotus octozona bilimsel boy ve doğal sınıfını FishBase ile çapraz doğrulamalı");
assert(eightBandedFalseBarb?.husbandryCaution?.includes("biyolojik olarak olgunlaşmamış") && eightBandedFalseBarb.husbandryCaution.includes("Eirmotus insignis"),"Eirmotus octozona olgun tank ve ticari kimlik karışıklığını açıklamalı");
assert(eightBandedFalseBarb?.communityCaution?.includes("8–10") && eightBandedFalseBarb.communityCaution.includes("yem rekabetine"),"Eirmotus octozona sosyal grup ve yem rekabeti güvenliğini açıklamalı");
assert.equal(speciesForCatalogExactSearch("Eirmotus octozona", "fish", "freshwater")?.id,"eight-banded-false-barb","Kesin Eirmotus octozona bilimsel adı güvenli profile bağlanmalı");
assert.equal(speciesForLivestock({commonName:"EİGHT BANDED BARB",category:"fish",quantity:10}),undefined,"Belirsiz Eight Banded Barb mağaza adı E. octozona profiline tahminle bağlanmamalı");
const unresolvedEightBandedBarb = unresolvedSpeciesForSearch("EİGHT BANDED BARB", "fish", "freshwater");
assert.equal(unresolvedEightBandedBarb?.name,"EİGHT BANDED BARB","Belirsiz Eight Banded Barb mağaza adı açıklamalı güvenlik kaydını bulmalı");
assert(unresolvedEightBandedBarb?.reason.includes("Eirmotus octozona") && unresolvedEightBandedBarb.reason.includes("Eirmotus insignis"),"Eight Banded Barb güvenlik kaydı iki olası bilimsel kimliği açıklamalı");
assert.equal(unresolvedEightBandedBarb?.verifiedAt,"2026-10-02","Eight Banded Barb güvenlik kaydı güncel doğrulama tarihini taşımalı");
const daisysBlueRicefish = speciesCatalog.find((item) => item.id === "daisys-blue-ricefish");
assert.deepEqual(
  [daisysBlueRicefish?.scientificName,daisysBlueRicefish?.adultSizeCm,daisysBlueRicefish?.minVolumeL,daisysBlueRicefish?.minTankLengthCm,daisysBlueRicefish?.minGroup,daisysBlueRicefish?.temperature,daisysBlueRicefish?.ph,daisysBlueRicefish?.flow],
  ["Oryzias woworae",3,41,45,8,[23,27],[6,7.5],"low"],
  "Oryzias woworae kaynaklı kimlik, boy, tank tabanı, sürü, su ve akıntı eşiklerini taşımalı",
);
assert.deepEqual(daisysBlueRicefish?.waterTypes,["freshwater"],"Oryzias woworae yalnız tatlı su profili taşımalı");
assert.equal(daisysBlueRicefish?.verifiedAt,"2026-10-02","Oryzias woworae güncel doğrulama tarihini taşımalı");
assert.equal(daisysBlueRicefish?.sourceUrl,"https://www.seriouslyfish.com/species/oryzias-woworae","Oryzias woworae doğrudan türe özel uzman bakım kaynağına bağlanmalı");
assert(daisysBlueRicefish?.additionalSourceUrls?.some((url) => url.includes("fishbase.se/Summary/Oryzias-woworae")),"Oryzias woworae bilimsel boy, dağılım ve koruma durumunu FishBase ile çapraz doğrulamalı");
assert(daisysBlueRicefish?.additionalSourceUrls?.some((url) => url.includes("repository.si.edu/bitstream/handle/10088/9776")),"Oryzias woworae özgün tür tanımına bağlanmalı");
assert(daisysBlueRicefish?.husbandryCaution?.includes("O. wolasi") && daisysBlueRicefish.husbandryCaution.includes("Tehlikede") && daisysBlueRicefish.husbandryCaution.includes("üretim kökenli"),"Oryzias woworae melezlenme, koruma ve kaynak güvenliğini açıklamalı");
assert.equal(speciesForCatalogExactSearch("ORYZİAS WOWORAE", "fish", "freshwater")?.id,"daisys-blue-ricefish","Türkiye satışındaki bilimsel ad Oryzias woworae profiline bağlanmalı");
assert.equal(speciesForCatalogExactSearch("Daisy's Ricefish", "fish", "freshwater")?.id,"daisys-blue-ricefish","Daisy's Ricefish ortak adı doğru profile bağlanmalı");
assert.equal(speciesForCatalogExactSearch("Daisy's Ricefish", "fish", "saltwater"),undefined,"Oryzias woworae deniz kataloğunda görünmemeli");
const pacificBlueEye = speciesCatalog.find((item) => item.id === "pacific-blue-eye");
assert.deepEqual(
  [pacificBlueEye?.scientificName,pacificBlueEye?.adultSizeCm,pacificBlueEye?.minVolumeL,pacificBlueEye?.minTankLengthCm,pacificBlueEye?.minGroup,pacificBlueEye?.temperature,pacificBlueEye?.ph,pacificBlueEye?.flow],
  ["Pseudomugil signifer",8.8,54,60,10,[20,26],[6.5,7.5],"medium"],
  "Pseudomugil signifer kaynaklı kimlik, koruyucu boy, tank tabanı, sürü, su ve akıntı eşiklerini taşımalı",
);
assert.deepEqual(pacificBlueEye?.waterTypes,["freshwater"],"Pseudomugil signifer kaynaksız özgül ağırlık hedefi olmadan acı veya deniz suyu profiline açılmamalı");
assert.equal(pacificBlueEye?.verifiedAt,"2026-10-02","Pseudomugil signifer güncel doğrulama tarihini taşımalı");
assert.equal(pacificBlueEye?.sourceUrl,"https://www.seriouslyfish.com/species/pseudomugil-signifer","Pseudomugil signifer doğrudan türe özel uzman bakım kaynağına bağlanmalı");
assert(pacificBlueEye?.additionalSourceUrls?.some((url) => url.includes("fishbase.se/summary/pseudomugil_signifer")),"Pseudomugil signifer bilimsel boy, tatlı/acı su sınıfı ve su aralığını FishBase ile çapraz doğrulamalı");
assert(pacificBlueEye?.additionalSourceUrls?.some((url) => url.includes("australian.museum/learn/animals/fishes/pacific-blue-eye")),"Pseudomugil signifer büyük erkek boyunu Australian Museum ile doğrulamalı");
assert(pacificBlueEye?.husbandryCaution?.includes("7 cm azami standart boy") && pacificBlueEye.husbandryCaution.includes("8,8 cm"),"Pseudomugil signifer kaynaklardaki boy ölçümü farkını açıklamalı");
assert(pacificBlueEye?.husbandryCaution?.includes("özgül ağırlık hedefi") && pacificBlueEye.husbandryCaution.includes("tuz gerektirmez"),"Pseudomugil signifer tuzluluk varsayımı yapılmamasını açıklamalı");
assert(pacificBlueEye?.communityCaution?.includes("8–10") && pacificBlueEye.communityCaution.includes("öldürebildiğinden"),"Pseudomugil signifer sürü ve büyük kuzey erkeği saldırganlık güvenliğini açıklamalı");
assert.equal(speciesForCatalogExactSearch("PSEUDOMUGİL SİGNİFER", "fish", "freshwater")?.id,"pacific-blue-eye","Türkiye satışındaki bilimsel ad Pseudomugil signifer profiline bağlanmalı");
assert.equal(speciesForCatalogExactSearch("Atherina signata", "fish", "freshwater")?.id,"pacific-blue-eye","Eski Pseudomugil signifer bilimsel adı güncel profile bağlanmalı");
assert.equal(speciesForCatalogExactSearch("Pacific Blue-eye", "fish", "brackish"),undefined,"Pseudomugil signifer kaynaklı özgül ağırlık modeli olmadan acı su kataloğunda görünmemeli");
const redPhantomTetra = speciesCatalog.find((item) => item.id === "red-phantom-tetra");
assert.deepEqual(
  [redPhantomTetra?.scientificName,redPhantomTetra?.adultSizeCm,redPhantomTetra?.minVolumeL,redPhantomTetra?.minTankLengthCm,redPhantomTetra?.minGroup,redPhantomTetra?.temperature,redPhantomTetra?.ph,redPhantomTetra?.flow],
  ["Megalamphodus sweglesi",3.5,72,80,10,[20,28],[4.5,7.5],"low"],
  "Kırmızı Fantom Tetra güncel kimlik, boy, tank tabanı, sürü, su ve akıntı eşiklerini taşımalı",
);
assert.deepEqual(redPhantomTetra?.waterTypes,["freshwater"],"Kırmızı Fantom Tetra yalnız tatlı su profili taşımalı");
assert.equal(redPhantomTetra?.verifiedAt,"2026-10-02","Kırmızı Fantom Tetra güncel doğrulama tarihini taşımalı");
assert.equal(redPhantomTetra?.sourceUrl,"https://www.seriouslyfish.com/species/megalamphodus-sweglesi","Kırmızı Fantom Tetra doğrudan güncel türe özel uzman bakım kaynağına bağlanmalı");
assert(redPhantomTetra?.additionalSourceUrls?.some((url) => url.includes("fishbase.se/summary/Hyphessobrycon-sweglesi")),"Kırmızı Fantom Tetra bilimsel boy, eski ad ve su verilerini FishBase ile çapraz doğrulamalı");
assert(redPhantomTetra?.husbandryCaution?.includes("Megalamphodus sweglesi") && redPhantomTetra.husbandryCaution.includes("Hyphessobrycon sweglesi"),"Kırmızı Fantom Tetra güncel ve eski bilimsel adı açıklamalı");
assert(redPhantomTetra?.husbandryCaution?.includes("var. rubra") && redPhantomTetra.husbandryCaution.includes("aynı türdür"),"Kırmızı Fantom Tetra kırmızı üretim formunu ayrı tür gibi göstermemeli");
assert(redPhantomTetra?.communityCaution?.includes("8–10") && redPhantomTetra.communityCaution.includes("çok hareketli"),"Kırmızı Fantom Tetra sürü ve tank arkadaşı güvenliğini açıklamalı");
assert.equal(speciesForCatalogExactSearch("RED FANTOM TETRA BALIKLARI", "fish", "freshwater")?.id,"red-phantom-tetra","Türkiye satış adı doğru Kırmızı Fantom profiline bağlanmalı");
assert.equal(speciesForCatalogExactSearch("Hyphessobrycon sweglesi", "fish", "freshwater")?.id,"red-phantom-tetra","Eski Kırmızı Fantom bilimsel adı güncel profile bağlanmalı");
assert.equal(speciesForCatalogExactSearch("Hyphessobrycon sweglesi var. rubra", "fish", "freshwater")?.id,"red-phantom-tetra","Rubra formu aynı Kırmızı Fantom profiline bağlanmalı");
const sawbwaResplendens = speciesCatalog.find((item) => item.id === "sawbwa-resplendens");
assert.deepEqual(
  [sawbwaResplendens?.scientificName,sawbwaResplendens?.adultSizeCm,sawbwaResplendens?.minVolumeL,sawbwaResplendens?.minTankLengthCm,sawbwaResplendens?.minGroup,sawbwaResplendens?.temperature,sawbwaResplendens?.ph,sawbwaResplendens?.flow],
  ["Sawbwa resplendens",3.5,54,60,5,[18,22],[6,8],"low"],
  "Sawbwa resplendens kaynaklı kimlik, boy, tank tabanı, cinsiyet grubu, su ve akıntı eşiklerini taşımalı",
);
assert.deepEqual(sawbwaResplendens?.waterTypes,["freshwater"],"Sawbwa resplendens yalnız tatlı su profili taşımalı");
assert.equal(sawbwaResplendens?.verifiedAt,"2026-10-02","Sawbwa resplendens güncel doğrulama tarihini taşımalı");
assert.equal(sawbwaResplendens?.sourceUrl,"https://www.seriouslyfish.com/species/sawbwa-resplendens","Sawbwa resplendens doğrudan türe özel uzman bakım kaynağına bağlanmalı");
assert(sawbwaResplendens?.additionalSourceUrls?.some((url) => url.includes("fishbase.se/summary/sawbwa-resplendens")),"Sawbwa resplendens bilimsel boy, su ve koruma durumunu FishBase ile çapraz doğrulamalı");
assert(sawbwaResplendens?.husbandryCaution?.includes("bir erkek ve en az dört dişi") && sawbwaResplendens.husbandryCaution.includes("25 °C üzerindeki"),"Sawbwa resplendens cinsiyet oranı ve yüksek sıcaklık üreme riskini açıklamalı");
assert(sawbwaResplendens?.husbandryCaution?.includes("Tehlikede") && sawbwaResplendens.husbandryCaution.includes("üretim kökenli"),"Sawbwa resplendens koruma ve üretim kökeni güvenliğini açıklamalı");
assert(sawbwaResplendens?.communityCaution?.includes("baskınlık mücadelesi") && sawbwaResplendens.communityCaution.includes("dört dişidir"),"Sawbwa resplendens erkek saldırganlığı ve cinsiyet oranını açıklamalı");
assert.equal(speciesForCatalogExactSearch("SAWBWA REPLENDENS", "fish", "freshwater")?.id,"sawbwa-resplendens","Türkiye satışındaki bilimsel ad doğru Sawbwa profiline bağlanmalı");
assert.equal(speciesForCatalogExactSearch("Asian Rummynose", "fish", "freshwater")?.id,"sawbwa-resplendens","Asian Rummynose ortak adı doğru profile bağlanmalı");
const phoenixRasbora = speciesCatalog.find((item) => item.id === "phoenix-rasbora");
assert.deepEqual(
  [phoenixRasbora?.scientificName,phoenixRasbora?.adultSizeCm,phoenixRasbora?.minVolumeL,phoenixRasbora?.minTankLengthCm,phoenixRasbora?.minGroup,phoenixRasbora?.temperature,phoenixRasbora?.ph,phoenixRasbora?.flow],
  ["Boraras merah",2,41,45,10,[20,28],[4,6.5],"low"],
  "Phoenix Rasbora kaynaklı kimlik, boy, tank tabanı, sürü, su ve akıntı eşiklerini taşımalı",
);
assert.deepEqual(phoenixRasbora?.waterTypes,["freshwater"],"Phoenix Rasbora yalnız tatlı su profili taşımalı");
assert.equal(phoenixRasbora?.verifiedAt,"2026-10-02","Phoenix Rasbora güncel doğrulama tarihini taşımalı");
assert.equal(phoenixRasbora?.sourceUrl,"https://www.seriouslyfish.com/species/boraras-merah/","Phoenix Rasbora doğrudan türe özel uzman bakım kaynağına bağlanmalı");
assert(phoenixRasbora?.additionalSourceUrls?.some((url) => url.includes("fishbase.se/summary/Boraras-merah")),"Phoenix Rasbora bilimsel boy, dağılım ve koruma durumunu FishBase ile çapraz doğrulamalı");
assert(phoenixRasbora?.husbandryCaution?.includes("1–5 dGH") && phoenixRasbora.husbandryCaution.includes("biyolojik olarak olgun") && phoenixRasbora.husbandryCaution.includes("B. brigittae"),"Phoenix Rasbora su sertliği, olgun akvaryum ve kimlik karışıklığını açıklamalı");
assert(phoenixRasbora?.husbandryCaution?.includes("Veri Yetersiz") && phoenixRasbora.husbandryCaution.includes("üretim kökenli"),"Phoenix Rasbora koruma ve üretim kökeni güvenliğini açıklamalı");
assert.equal(speciesForCatalogExactSearch("RASBORA MERAH BORARAS BALIKLARI", "fish", "freshwater")?.id,"phoenix-rasbora","Türkiye satış adı doğru Phoenix Rasbora profiline bağlanmalı");
const redNeonBlueEye = speciesCatalog.find((item) => item.id === "red-neon-blue-eye");
assert.deepEqual(
  [redNeonBlueEye?.scientificName,redNeonBlueEye?.adultSizeCm,redNeonBlueEye?.minVolumeL,redNeonBlueEye?.minTankLengthCm,redNeonBlueEye?.minGroup,redNeonBlueEye?.temperature,redNeonBlueEye?.ph,redNeonBlueEye?.flow],
  ["Pseudomugil luminatus",3,60,60,10,[20,28],[6.5,8],"low"],
  "Red Neon Blue-eye kaynaklı kimlik, koruyucu boy, tank tabanı, sürü, su ve akıntı eşiklerini taşımalı",
);
assert.deepEqual(redNeonBlueEye?.waterTypes,["freshwater"],"Red Neon Blue-eye yalnız tatlı su profili taşımalı");
assert.equal(redNeonBlueEye?.verifiedAt,"2026-10-02","Red Neon Blue-eye güncel doğrulama tarihini taşımalı");
assert.equal(redNeonBlueEye?.sourceUrl,"https://www.fishkeeper.co.uk/fish/freshwater/rainbow-fish/red-neon-blue-eye","Red Neon Blue-eye doğrudan kurumsal bakım kaynağına bağlanmalı");
assert(redNeonBlueEye?.additionalSourceUrls?.some((url) => url.includes("fishbase.se/summary/Pseudomugil-luminatus")),"Red Neon Blue-eye bilimsel boy ve koruma durumunu FishBase ile çapraz doğrulamalı");
assert(redNeonBlueEye?.additionalSourceUrls?.some((url) => url.includes("rainbowfish.angfa.org.au")),"Red Neon Blue-eye bilimsel kimliğini uzman gökkuşağı balığı kaynağıyla çapraz doğrulamalı");
assert(redNeonBlueEye?.additionalSourceUrls?.some((url) => url.includes("dcceew.gov.au/environment/wildlife-trade/live-import-list")),"Red Neon Blue-eye üretim kökeni güvenliğini resmî ithalat listesiyle çapraz doğrulamalı");
assert(redNeonBlueEye?.husbandryCaution?.includes("1,9 cm") && redNeonBlueEye.husbandryCaution.includes("P. paskai") && redNeonBlueEye.husbandryCaution.includes("Tehlikede"),"Red Neon Blue-eye boy farkı, kimlik karışıklığı ve koruma durumunu açıklamalı");
assert.equal(speciesForCatalogExactSearch("Pseudomugil sp. Red Neon", "fish", "freshwater")?.id,"red-neon-blue-eye","Eski Red Neon ticari adı doğru profile bağlanmalı");
const ninjaWoodcat = speciesCatalog.find((item) => item.id === "ninja-woodcat");
assert.deepEqual(
  [ninjaWoodcat?.scientificName,ninjaWoodcat?.adultSizeCm,ninjaWoodcat?.minVolumeL,ninjaWoodcat?.minTankLengthCm,ninjaWoodcat?.minGroup,ninjaWoodcat?.temperature,ninjaWoodcat?.ph,ninjaWoodcat?.flow],
  ["Tatia musaica",7,56,60,5,[25,26],[6,7.2],"medium"],
  "Ninja Woodcat kaynaklı kimlik, koruyucu boy, tank tabanı, grup, su ve akıntı eşiklerini taşımalı",
);
assert.deepEqual(ninjaWoodcat?.waterTypes,["freshwater"],"Ninja Woodcat yalnız tatlı su profili taşımalı");
assert.equal(ninjaWoodcat?.predatory,true,"Ninja Woodcat çok küçük canlı avı riskini sağlık analizine taşımalı");
assert.equal(ninjaWoodcat?.verifiedAt,"2026-10-02","Ninja Woodcat güncel doğrulama tarihini taşımalı");
assert.equal(ninjaWoodcat?.sourceUrl,"https://www.fishkeeper.co.uk/fish/freshwater/catfish/ninja-woodcat","Ninja Woodcat doğrudan kurumsal bakım kaynağına bağlanmalı");
assert(ninjaWoodcat?.additionalSourceUrls?.some((url) => url.includes("aquarismopaulista.com/ninja-woodcat")) && ninjaWoodcat.additionalSourceUrls.some((url) => url.includes("suedamerikafans.de/wels-datenbank")),"Ninja Woodcat alan, boy ve su verilerini iki uzman kaynakla çapraz doğrulamalı");
assert(ninjaWoodcat?.husbandryCaution?.includes("22–26") && ninjaWoodcat.husbandryCaution.includes("24–30") && ninjaWoodcat.husbandryCaution.includes("25–29"),"Ninja Woodcat kaynaklar arasındaki sıcaklık farkını kullanıcıdan saklamamalı");
assert(ninjaWoodcat?.husbandryCaution?.includes("Tatia sp. aff. musaica") && ninjaWoodcat.husbandryCaution.includes("bilimsel kimlik"),"Ninja Woodcat benzer ticari türün kimlik riskini açıklamalı");
const redBelliedPiranha = speciesCatalog.find((item) => item.id === "red-bellied-piranha");
assert.deepEqual(
  [redBelliedPiranha?.scientificName,redBelliedPiranha?.adultSizeCm,redBelliedPiranha?.minVolumeL,redBelliedPiranha?.minTankLengthCm,redBelliedPiranha?.minGroup,redBelliedPiranha?.temperature,redBelliedPiranha?.ph,redBelliedPiranha?.flow],
  ["Pygocentrus nattereri",50,1296,240,6,[23,27],[5.5,7.5],"medium"],
  "Kırmızı Karınlı Pirana kaynaklı kimlik, koruyucu boy, erişkin tabanı, grup ve su eşiklerini taşımalı",
);
assert.deepEqual(redBelliedPiranha?.waterTypes,["freshwater"],"Kırmızı Karınlı Pirana yalnız tatlı su profili taşımalı");
assert.equal(redBelliedPiranha?.predatory,true,"Kırmızı Karınlı Pirana avcı güvenliğini sağlık analizine taşımalı");
assert.equal(redBelliedPiranha?.verifiedAt,"2026-10-02","Kırmızı Karınlı Pirana güncel doğrulama tarihini taşımalı");
assert(redBelliedPiranha?.additionalSourceUrls?.some((url) => url.includes("fishbase.se/summary/Pygocentrus_nattereri")) && redBelliedPiranha.additionalSourceUrls.some((url) => url.includes("b-aqua.com/pages/fiche.aspx?id=3026")),"Kırmızı Karınlı Pirana bilimsel ve bakım verisini bağımsız kaynaklarla çapraz doğrulamalı");
assert(redBelliedPiranha?.husbandryCaution?.includes("240 × 90 × 60 cm") && redBelliedPiranha.husbandryCaution.includes("600 litre") && redBelliedPiranha.husbandryCaution.includes("Canlı yem"),"Kırmızı Karınlı Pirana alan kaynak farkını ve yem güvenliğini açıklamalı");
const endlicheriBichir = speciesCatalog.find((item) => item.id === "endlicheri-bichir");
assert.deepEqual(
  [endlicheriBichir?.scientificName,endlicheriBichir?.adultSizeCm,endlicheriBichir?.minVolumeL,endlicheriBichir?.minTankLengthCm,endlicheriBichir?.minGroup,endlicheriBichir?.temperature,endlicheriBichir?.ph,endlicheriBichir?.flow],
  ["Polypterus endlicherii",70,2000,300,1,[26,28],[6.5,7.5],"low"],
  "Endlicheri Biçir kaynaklı kimlik, koruyucu boy, uzman sistem tabanı ve su eşiklerini taşımalı",
);
assert.deepEqual(endlicheriBichir?.waterTypes,["freshwater"],"Endlicheri Biçir yalnız tatlı su profili taşımalı");
assert.equal(endlicheriBichir?.verifiedAt,"2026-10-02","Endlicheri Biçir güncel doğrulama tarihini taşımalı");
assert.equal(endlicheriBichir?.sourceUrl,"https://www.einrichtungsbeispiele.de/zierfische/afrika/polypterus-endlicherii-slnk.html","Endlicheri Biçir doğrudan uzman bakım kaynağına bağlanmalı");
assert(endlicheriBichir?.additionalSourceUrls?.some((url) => url.includes("fishbase.se/summary/Polypterus_endlicherii")),"Endlicheri Biçir bilimsel boyu FishBase ile çapraz doğrulamalı");
assert(endlicheriBichir?.husbandryCaution?.includes("3 metre") && endlicheriBichir.husbandryCaution.includes("65,5 cm") && endlicheriBichir.husbandryCaution.includes("ağır"),"Endlicheri Biçir alan, boy farkı ve kaçış güvenliğini açıklamalı");
const monoculusPeacockBass = speciesCatalog.find((item) => item.id === "monoculus-peacock-bass");
assert.deepEqual(
  [monoculusPeacockBass?.scientificName,monoculusPeacockBass?.adultSizeCm,monoculusPeacockBass?.minVolumeL,monoculusPeacockBass?.minTankLengthCm,monoculusPeacockBass?.minGroup,monoculusPeacockBass?.temperature,monoculusPeacockBass?.ph,monoculusPeacockBass?.flow],
  ["Cichla monoculus",80,1200,200,1,[25,31],[5.5,6.5],"low"],
  "Monoculus Peacock Bass kaynaklı kimlik, toplam boy, uzman sistem tabanı ve su eşiklerini taşımalı",
);
assert.deepEqual(monoculusPeacockBass?.waterTypes,["freshwater"],"Monoculus Peacock Bass yalnız tatlı su profili taşımalı");
assert.equal(monoculusPeacockBass?.verifiedAt,"2026-10-02","Monoculus Peacock Bass güncel doğrulama tarihini taşımalı");
assert.equal(monoculusPeacockBass?.sourceUrl,"https://www.fishipedia.fr/fr/poissons/cichla-monoculus","Monoculus Peacock Bass doğrudan uzman bakım kaynağına bağlanmalı");
assert(monoculusPeacockBass?.additionalSourceUrls?.some((url) => url.includes("fishbase.se/summary/Cichla-monoculus")),"Monoculus Peacock Bass bilimsel boy ve doğal su aralığını FishBase ile çapraz doğrulamalı");
assert(monoculusPeacockBass?.husbandryCaution?.includes("70 cm azami standart boy") && monoculusPeacockBass.husbandryCaution.includes("80 cm toplam boy") && monoculusPeacockBass.husbandryCaution.includes("pH 7,0"),"Monoculus Peacock Bass boy ve su kaynağı farklarını kullanıcıdan saklamamalı");
const celebesRainbowfish = speciesCatalog.find((item) => item.id === "celebes-rainbowfish");
assert.deepEqual(
  [celebesRainbowfish?.scientificName,celebesRainbowfish?.adultSizeCm,celebesRainbowfish?.minVolumeL,celebesRainbowfish?.minTankLengthCm,celebesRainbowfish?.minGroup,celebesRainbowfish?.temperature,celebesRainbowfish?.ph,celebesRainbowfish?.flow],
  ["Marosatherina ladigesi",8,68,76,8,[22,28],[7,8],"medium"],
  "Celebes Gökkuşağı kaynaklı kimlik, boy, tank tabanı, sürü, su ve akıntı eşiklerini taşımalı",
);
assert.deepEqual(celebesRainbowfish?.waterTypes,["freshwater"],"Celebes Gökkuşağı kaynaksız özgül ağırlık hedefi olmadan acı su profiline açılmamalı");
assert.equal(celebesRainbowfish?.verifiedAt,"2026-10-02","Celebes Gökkuşağı güncel doğrulama tarihini taşımalı");
assert.equal(celebesRainbowfish?.sourceUrl,"https://www.seriouslyfish.com/species/marosatherina-ladigesi","Celebes Gökkuşağı doğrudan türe özel uzman bakım kaynağına bağlanmalı");
assert(celebesRainbowfish?.additionalSourceUrls?.some((url) => url.includes("fishbase.se/FieldGuide/FieldGuideSummary.php")),"Celebes Gökkuşağı boy, tatlı su sınıfı ve koruma durumunu FishBase ile çapraz doğrulamalı");
assert(celebesRainbowfish?.additionalSourceUrls?.some((url) => url.includes("fishkeeper.co.uk/fish/freshwater/rainbow-fish/celebes-rainbowfish-")),"Celebes Gökkuşağı sürü ve su bakımını kurumsal kaynakla çapraz doğrulamalı");
assert(celebesRainbowfish?.husbandryCaution?.includes("76 × 30 cm") && celebesRainbowfish.husbandryCaution.includes("özgül ağırlık hedefi") && celebesRainbowfish.husbandryCaution.includes("üretim kökenli"),"Celebes Gökkuşağı alan, tuzluluk varsayımı ve koruma kökeni güvenliğini açıklamalı");
assert.equal(speciesForCatalogExactSearch("Telmatherina ladigesi", "fish", "freshwater")?.id,"celebes-rainbowfish","Eski Celebes bilimsel adı güncel profile bağlanmalı");
assert.equal(speciesForCatalogExactSearch("CELEBES RAİNBOW", "fish", "freshwater")?.id,"celebes-rainbowfish","Türkiye satış adı doğru Celebes profiline bağlanmalı");
const bleedingHeartTetra = speciesCatalog.find((item) => item.id === "bleeding-heart-tetra");
assert.deepEqual(
  [bleedingHeartTetra?.scientificName,bleedingHeartTetra?.adultSizeCm,bleedingHeartTetra?.minVolumeL,bleedingHeartTetra?.minTankLengthCm,bleedingHeartTetra?.minGroup,bleedingHeartTetra?.temperature,bleedingHeartTetra?.ph,bleedingHeartTetra?.flow],
  ["Megalamphodus erythrostigma",6.1,81,90,10,[21,28],[4,7.5],"low"],
  "Kanayan Kalp Tetra güncel taksonomi, koruyucu boy, tank tabanı, sürü, su ve akıntı eşiklerini taşımalı",
);
assert.deepEqual(bleedingHeartTetra?.waterTypes,["freshwater"],"Kanayan Kalp Tetra yalnız tatlı su profili taşımalı");
assert.equal(bleedingHeartTetra?.verifiedAt,"2026-10-02","Kanayan Kalp Tetra güncel doğrulama tarihini taşımalı");
assert.match(bleedingHeartTetra?.sourceUrl || "",/^https:\/\/seriouslyfish\.com\/species\/hyphessobrycon-erythrostigma$/,"Kanayan Kalp Tetra doğrudan türe özel uzman bakım kaynağına bağlanmalı");
assert(bleedingHeartTetra?.additionalSourceUrls?.some((url) => url.includes("researcharchive.calacademy.org")),"Kanayan Kalp Tetra güncel bilimsel adı Eschmeyer katalog kaynağına bağlanmalı");
assert(bleedingHeartTetra?.additionalSourceUrls?.some((url) => url.includes("academic.oup.com/zoolinnean")),"Kanayan Kalp Tetra Megalamphodus dönüşümünü hakemli filogenomik kaynağa bağlamalı");
assert.equal(speciesForCatalogExactSearch("Hyphessobrycon erythrostigma", "fish", "freshwater")?.id,"bleeding-heart-tetra","Eski bilimsel ad güncel Megalamphodus erythrostigma profilini bulmalı");
assert.equal(speciesForCatalogExactSearch("Megalamphodus erythrostigma", "fish", "freshwater")?.id,"bleeding-heart-tetra","Güncel bilimsel ad doğru profili bulmalı");
assert.equal(speciesForCatalogExactSearch("Flame-back Bleeding Heart Tetra", "fish", "freshwater")?.id,"flameback-bleeding-heart-tetra","Alev sırtlı benzer tür genel Kanayan Kalp profiline kaymamalı");
const diamondTetra = speciesCatalog.find((item) => item.id === "diamond-tetra");
assert.deepEqual(
  [diamondTetra?.scientificName,diamondTetra?.adultSizeCm,diamondTetra?.minVolumeL,diamondTetra?.minTankLengthCm,diamondTetra?.minGroup,diamondTetra?.temperature,diamondTetra?.ph,diamondTetra?.flow],
  ["Makunaima pittieri",6,68,80,8,[24,28],[5.5,7],"low"],
  "Elmas Tetra güncel taksonomi, boy, tank, sürü, su ve akıntı eşiklerini taşımalı",
);
assert.deepEqual(diamondTetra?.waterTypes,["freshwater"],"Elmas Tetra yalnız tatlı su profili taşımalı");
assert.equal(diamondTetra?.verifiedAt,"2026-10-02","Elmas Tetra güncel doğrulama tarihini taşımalı");
assert.match(diamondTetra?.sourceUrl || "",/^https:\/\/www\.seriouslyfish\.com\/species\/makunaima-pittieri$/,"Elmas Tetra doğrudan güncel türe özel uzman bakım kaynağına bağlanmalı");
assert(diamondTetra?.additionalSourceUrls?.some((url) => url.includes("fishbase.se/summary/Moenkhausia-pittieri")),"Elmas Tetra boy, su ve 80 cm akvaryum verisini FishBase ile çapraz doğrulamalı");
assert(diamondTetra?.additionalSourceUrls?.some((url) => url.includes("10.1093/zoolinnean/zlae101")),"Elmas Tetra Makunaima dönüşümünü hakemli filogenomik kaynağa bağlamalı");
assert(diamondTetra?.husbandryCaution?.includes("4–5 tank hacmi") && diamondTetra.husbandryCaution.includes("tehlike altında"),"Elmas Tetra akıntı dağıtımı ile koruma kökeni güvenliğini açıklamalı");
assert.equal(speciesForCatalogExactSearch("Moenkhausia pittieri", "fish", "freshwater")?.id,"diamond-tetra","Eski Elmas Tetra bilimsel adı güncel Makunaima pittieri profilini bulmalı");
assert.equal(speciesForCatalogExactSearch("Makunaima pittieri", "fish", "freshwater")?.id,"diamond-tetra","Güncel Elmas Tetra bilimsel adı doğru profili bulmalı");
const serpaeTetra = speciesCatalog.find((item) => item.id === "serpae-tetra");
assert.deepEqual(
  [serpaeTetra?.scientificName,serpaeTetra?.adultSizeCm,serpaeTetra?.minVolumeL,serpaeTetra?.minTankLengthCm,serpaeTetra?.minGroup,serpaeTetra?.temperature,serpaeTetra?.ph,serpaeTetra?.flow],
  ["Megalamphodus eques",4,72,80,12,[20,28],[5,7.5],"low"],
  "Serpae Tetra güncel taksonomi, boy, tank, sürü, su ve akıntı eşiklerini taşımalı",
);
assert.deepEqual(serpaeTetra?.waterTypes,["freshwater"],"Serpae Tetra yalnız tatlı su profili taşımalı");
assert.equal(serpaeTetra?.verifiedAt,"2026-10-02","Serpae Tetra güncel doğrulama tarihini taşımalı");
assert.match(serpaeTetra?.sourceUrl || "",/^https:\/\/www\.seriouslyfish\.com\/species\/megalamphodus-eques$/,"Serpae Tetra doğrudan güncel türe özel uzman bakım kaynağına bağlanmalı");
assert(serpaeTetra?.additionalSourceUrls?.some((url) => url.includes("fishbase.se/summary/Hyphessobrycon-eques")),"Serpae Tetra boy, biyoloji ve kaynak farklarını FishBase ile çapraz doğrulamalı");
assert(serpaeTetra?.additionalSourceUrls?.some((url) => url.includes("10.1093/zoolinnean/zlae101")),"Serpae Tetra Megalamphodus dönüşümünü hakemli filogenomik kaynağa bağlamalı");
assert(serpaeTetra?.communityCaution?.includes("en az 12") && serpaeTetra.communityCaution.includes("uzun yüzgeçli"),"Serpae Tetra sürü ve yüzgeç ısırma güvenliğini açıklamalı");
assert(serpaeTetra?.husbandryCaution?.includes("blood tetra") && serpaeTetra.husbandryCaution.includes("melez"),"Serpae Tetra ticari kan tetra melezliği belirsizliğini açıklamalı");
assert.equal(speciesForCatalogExactSearch("Hyphessobrycon eques", "fish", "freshwater")?.id,"serpae-tetra","Eski Serpae Tetra bilimsel adı güncel Megalamphodus eques profilini bulmalı");
assert.equal(speciesForCatalogExactSearch("Megalamphodus eques", "fish", "freshwater")?.id,"serpae-tetra","Güncel Serpae Tetra bilimsel adı doğru profili bulmalı");
assert.equal(speciesForCatalogExactSearch("Callistus Tetra", "fish", "freshwater")?.id,"serpae-tetra","Callistus ticari adı Serpae Tetra profiline bağlanmalı");
const xrayTetra = speciesCatalog.find((item) => item.id === "xray-tetra");
assert.deepEqual(
  [xrayTetra?.scientificName,xrayTetra?.adultSizeCm,xrayTetra?.minVolumeL,xrayTetra?.minTankLengthCm,xrayTetra?.minGroup,xrayTetra?.temperature,xrayTetra?.ph,xrayTetra?.flow],
  ["Pristella maxillaris",4.5,54,60,10,[22,28],[6,7.5],"low"],
  "X-ray Tetra kaynaklı boy, tank, sürü, su ve akıntı eşiklerini taşımalı",
);
assert.deepEqual(xrayTetra?.waterTypes,["freshwater"],"X-ray Tetra kıyısal dağılımına rağmen kaynaksız acı su profili taşımamalı");
assert.equal(xrayTetra?.verifiedAt,"2026-10-02","X-ray Tetra güncel doğrulama tarihini taşımalı");
assert.match(xrayTetra?.sourceUrl || "",/^https:\/\/www\.seriouslyfish\.com\/species\/pristella-maxillaris$/,"X-ray Tetra doğrudan türe özel uzman bakım kaynağına bağlanmalı");
assert(xrayTetra?.additionalSourceUrls?.some((url) => url.includes("fishbase.se/summary/Pristella_maxillaris")),"X-ray Tetra boy, tatlı su sınıfı ve biyolojisini FishBase ile çapraz doğrulamalı");
assert(xrayTetra?.additionalSourceUrls?.some((url) => url.includes("fda.gov/animal-veterinary")),"GloFish Pristella hatları FDA kaynağına bağlanmalı");
assert(xrayTetra?.husbandryCaution?.includes("özgül ağırlık hedefi yayımlamaz") && xrayTetra.husbandryCaution.includes("sonradan boya"),"X-ray Tetra acı su varsayımını ve floresan/boyalı balık ayrımını açıklamalı");
assert.equal(speciesForCatalogExactSearch("Pristella riddlei", "fish", "freshwater")?.id,"xray-tetra","Eski Pristella bilimsel adı güncel X-ray Tetra profilini bulmalı");
assert.equal(speciesForCatalogExactSearch("Electric Green GloFish Pristella", "fish", "freshwater")?.id,"xray-tetra","FDA kaynaklı yeşil GloFish Pristella doğru profile bağlanmalı");
assert.equal(speciesForCatalogExactSearch("Starfire Red GloFish Pristella", "fish", "freshwater")?.id,"xray-tetra","FDA kaynaklı kırmızı GloFish Pristella doğru profile bağlanmalı");
const flameTetra = speciesCatalog.find((item) => item.id === "flame-tetra");
assert.deepEqual(
  [flameTetra?.scientificName,flameTetra?.adultSizeCm,flameTetra?.minVolumeL,flameTetra?.minTankLengthCm,flameTetra?.minGroup,flameTetra?.temperature,flameTetra?.ph,flameTetra?.flow],
  ["Hyphessobrycon flammeus",2.5,54,60,10,[20,26],[5.5,7.5],"low"],
  "Alev Tetra kaynaklı boy, tank, sürü, su ve akıntı eşiklerini taşımalı",
);
assert.deepEqual(flameTetra?.waterTypes,["freshwater"],"Alev Tetra yalnız tatlı su profili taşımalı");
assert.equal(flameTetra?.verifiedAt,"2026-10-02","Alev Tetra güncel doğrulama tarihini taşımalı");
assert.match(flameTetra?.sourceUrl || "",/^https:\/\/www\.seriouslyfish\.com\/species\/hyphessobrycon-flammeus$/,"Alev Tetra doğrudan türe özel uzman bakım kaynağına bağlanmalı");
assert(flameTetra?.additionalSourceUrls?.some((url) => url.includes("fishbase.se/summary/Hyphessobrycon-flammeus")),"Alev Tetra boy ve su aralığını FishBase ile çapraz doğrulamalı");
assert(flameTetra?.additionalSourceUrls?.some((url) => url.includes("scielo.br/j/ni/a/Xwr9kjjttqtf64YVvhXfgqt")),"Alev Tetra kimliği ve tehdit durumunu hakemli yeniden tanımla çapraz doğrulamalı");
assert(flameTetra?.communityCaution?.includes("on bireylik") && flameTetra.communityCaution.includes("avlayabilecek"),"Alev Tetra sosyal sürü ve tank arkadaşı güvenliğini açıklamalı");
assert(flameTetra?.husbandryCaution?.includes("biyolojik olarak olgun") && flameTetra.husbandryCaution.includes("haftalık") && flameTetra.husbandryCaution.includes("tehdit altındaki"),"Alev Tetra olgun tank, su kalitesi ve koruma risklerini açıklamalı");
assert.equal(speciesForCatalogExactSearch("Orange Von Rio Tetra", "fish", "freshwater")?.id,"flame-tetra","Orange Von Rio ticari adı Alev Tetra profiline bağlanmalı");
assert.equal(speciesForCatalogExactSearch("Hyphessobrycon flammeus", "fish", "freshwater")?.id,"flame-tetra","Alev Tetra bilimsel adı doğru profili bulmalı");
const congoTetra = speciesCatalog.find((item) => item.id === "congo-tetra");
assert.deepEqual(
  [congoTetra?.scientificName,congoTetra?.adultSizeCm,congoTetra?.minVolumeL,congoTetra?.minTankLengthCm,congoTetra?.minGroup,congoTetra?.temperature,congoTetra?.ph,congoTetra?.flow],
  ["Phenacogrammus interruptus",8,108,120,5,[23,28],[6,7.5],"medium"],
  "Kongo Tetra kaynaklı boy, erişkin tank tabanı, sosyal grup, su ve akıntı eşiklerini taşımalı",
);
assert.deepEqual(congoTetra?.waterTypes,["freshwater"],"Kongo Tetra yalnız tatlı su profili taşımalı");
assert.equal(congoTetra?.verifiedAt,"2026-10-02","Kongo Tetra güncel doğrulama tarihini taşımalı");
assert.match(congoTetra?.sourceUrl || "",/^https:\/\/www\.seriouslyfish\.com\/species\/phenacogrammus-interruptus$/,"Kongo Tetra doğrudan türe özel uzman bakım kaynağına bağlanmalı");
assert(congoTetra?.additionalSourceUrls?.some((url) => url.includes("fishbase.se/summary/10660")),"Kongo Tetra boy, grup ve 100 cm kaynak farkını FishBase ile çapraz doğrulamalı");
assert(congoTetra?.communityCaution?.includes("yüzgeç ısıran") && congoTetra.communityCaution.includes("karma cinsiyetli"),"Kongo Tetra erkek yüzgeci ve sosyal sürü güvenliğini açıklamalı");
assert(congoTetra?.husbandryCaution?.includes("sıfır amonyak/nitrit") && congoTetra.husbandryCaution.includes("erkek yüzgeçleri"),"Kongo Tetra su kalitesi ve erişkin erkek gelişimi riskini açıklamalı");
assert.equal(speciesForCatalogExactSearch("Micralestes interruptus", "fish", "freshwater")?.id,"congo-tetra","Eski Kongo Tetra bilimsel adı güncel profile bağlanmalı");
const endler = speciesCatalog.find((item) => item.id === "endler");
assert.deepEqual(
  [endler?.scientificName,endler?.adultSizeCm,endler?.minVolumeL,endler?.minTankLengthCm,endler?.minGroup,endler?.temperature,endler?.ph,endler?.flow],
  ["Poecilia wingei",2.5,45,45,3,[24,28],[7,8],"medium"],
  "Endler kaynaklı kimlik, boy, tank, sosyal grup ve ortak güvenli su eşiklerini taşımalı",
);
assert.deepEqual(endler?.waterTypes,["freshwater"],"Endler yalnız tatlı su profili taşımalı");
assert.equal(endler?.verifiedAt,"2026-10-02","Endler güncel doğrulama tarihini taşımalı");
assert.match(endler?.sourceUrl || "",/^https:\/\/www\.seriouslyfish\.com\/species\/poecilia-wingei$/,"Endler doğrudan türe özel uzman bakım kaynağına bağlanmalı");
assert(endler?.husbandryCaution?.includes("20–28 °C") && endler.husbandryCaution.includes("24–30 °C") && endler.husbandryCaution.includes("guppy melezi"),"Endler kaynak sıcaklık farkını ve ticari melezlik riskini açıklamalı");
assert(endler?.communityCaution?.includes("verimli melez"),"Endler ile guppy arasındaki verimli melezleşme riski görünür olmalı");
const sailfinMolly = speciesCatalog.find((item) => item.id === "sailfin-molly");
assert.deepEqual(
  [sailfinMolly?.scientificName,sailfinMolly?.adultSizeCm,sailfinMolly?.minVolumeL,sailfinMolly?.minTankLengthCm,sailfinMolly?.minGroup,sailfinMolly?.temperature,sailfinMolly?.ph,sailfinMolly?.flow],
  ["Poecilia latipinna",15,87,76,3,[21,26],[7,8.5],"medium"],
  "Yelken Moli kaynaklı kimlik, koruyucu boy, tank, cinsiyet grubu ve su eşiklerini taşımalı",
);
assert.deepEqual(sailfinMolly?.waterTypes,["freshwater","brackish"],"Yelken Moli tatlı ve acı su toleransını taşımalı");
assert.equal(sailfinMolly?.verifiedAt,"2026-10-02","Yelken Moli güncel doğrulama tarihini taşımalı");
assert.match(sailfinMolly?.sourceUrl || "",/^https:\/\/www\.seriouslyfish\.com\/species\/poecilia-latipinna\/$/,"Yelken Moli doğrudan türe özel uzman bakım kaynağına bağlanmalı");
assert(sailfinMolly?.husbandryCaution?.includes("15 cm azami toplam boy") && sailfinMolly.husbandryCaution.includes("12,5 cm standart boy") && sailfinMolly.husbandryCaution.includes("tuz sertliğin yerine geçmez"),"Yelken Moli boy ölçümü farkını ve gereksiz tuz kullanım riskini açıklamalı");
assert(sailfinMolly?.communityCaution?.includes("Poecilia sphenops"),"Yelken Moli yakın molilerle melezleşme riskini taşımalı");
const leastKillifish = speciesCatalog.find((item) => item.id === "least-killifish");
assert.deepEqual(
  [leastKillifish?.scientificName,leastKillifish?.adultSizeCm,leastKillifish?.minVolumeL,leastKillifish?.minTankLengthCm,leastKillifish?.minGroup,leastKillifish?.temperature,leastKillifish?.ph,leastKillifish?.flow],
  ["Heterandria formosa",3.6,40,undefined,6,[20,26],[7,8],"low"],
  "Cüce Canlı Doğuran kaynaklı kimlik, koruyucu boy, koloni hacmi ve su eşiklerini taşımalı",
);
assert.equal(leastKillifish?.speciesOnly,true,"Cüce Canlı Doğuran sıradan topluluk balığı gibi önerilmemeli");
assert.deepEqual(leastKillifish?.waterTypes,["freshwater","brackish"],"Cüce Canlı Doğuran doğal tatlı/acı su kapsamını taşımalı");
assert.equal(leastKillifish?.verifiedAt,"2026-10-02","Cüce Canlı Doğuran güncel doğrulama tarihini taşımalı");
assert.match(leastKillifish?.sourceUrl || "",/^https:\/\/www\.seriouslyfish\.com\/species\/heterandria-formosa\/$/,"Cüce Canlı Doğuran doğrudan türe özel uzman bakım kaynağına bağlanmalı");
assert(leastKillifish?.tankLengthDataNote?.includes("eski tahmini 40 cm uzunluk kaldırılmıştır"),"Cüce Canlı Doğuran grup için kaynaksız tank uzunluğunu korumamalı");
assert(leastKillifish?.husbandryCaution?.includes("3,6 cm azami toplam boy") && leastKillifish.husbandryCaution.includes("2 cm standart boy") && leastKillifish.husbandryCaution.includes("Gambusia"),"Cüce Canlı Doğuran boy farkını ve ticari ad kimlik riskini açıklamalı");
const starryBorneoSucker = speciesCatalog.find((item) => item.id === "starry-borneo-sucker");
assert.deepEqual(
  [starryBorneoSucker?.scientificName,starryBorneoSucker?.adultSizeCm,starryBorneoSucker?.minVolumeL,starryBorneoSucker?.minTankLengthCm,starryBorneoSucker?.minGroup,starryBorneoSucker?.temperature,starryBorneoSucker?.ph,starryBorneoSucker?.flow],
  ["Gastromyzon stellatus",5.5,68,75,4,[20,24],[6,7.5],"high"],
  "Gastromyzon stellatus kaynaklı boy, grup, akvaryum tabanı ve akarsu eşiklerini taşımalı",
);
assert.equal(starryBorneoSucker?.speciesOnly, true, "Gastromyzon stellatus sıradan sıcak su topluluk balığı gibi sunulmamalı");
assert.equal(starryBorneoSucker?.verifiedAt, "2026-09-10", "Gastromyzon stellatus güncel doğrulama tarihini taşımalı");
assert.match(starryBorneoSucker?.sourceUrl || "", /^https:\/\/www\.seriouslyfish\.com\/species\/gastromyzon-stellatus$/, "Gastromyzon stellatus doğrudan türe özel uzman kaynağa bağlanmalı");
const butterflyLoachBeaufortia = speciesForLivestock({commonName:"Çin kelebek loachu",scientificName:"Beaufortia kweichowensis",category:"fish",quantity:6});
assert.deepEqual(
  [butterflyLoachBeaufortia?.id,butterflyLoachBeaufortia?.adultSizeCm,butterflyLoachBeaufortia?.minVolumeL,butterflyLoachBeaufortia?.minTankLengthCm,butterflyLoachBeaufortia?.minGroup,butterflyLoachBeaufortia?.temperature,butterflyLoachBeaufortia?.ph,butterflyLoachBeaufortia?.flow],
  ["butterfly-loach-beaufortia",7.5,54,60,6,[16,24],[6.5,8],"high"],
  "Beaufortia kweichowensis kaynaklı boy, grup, akvaryum tabanı ve akarsu eşiklerini taşımalı",
);
assert.match(butterflyLoachBeaufortia?.husbandryCaution || "", /10–15 tank hacmi.*biyofilmli düz taşlar/, "Beaufortia kweichowensis akıntı, oksijen ve doğal otlak gereksinimini açıklamalı");
assert.equal(butterflyLoachBeaufortia?.verifiedAt, "2026-09-23", "Beaufortia kweichowensis güncel doğrulama tarihini taşımalı");
assert.match(butterflyLoachBeaufortia?.sourceUrl || "", /^https:\/\/www\.seriouslyfish\.com\/species\/beaufortia-kweichowensis$/, "Beaufortia kweichowensis doğrudan türe özel uzman kaynağa bağlanmalı");
assert.equal(speciesForCatalogExactSearch("Beaufortia kweichowensis", "fish", "freshwater")?.id, "butterfly-loach-beaufortia", "Kesin Beaufortia kweichowensis bilimsel adı doğru profili bulmalı");
assert.equal(speciesForLivestock({commonName:"Borneo Kelebek Vatoz",category:"fish",quantity:1}), undefined, "Genel Borneo Kelebek Vatoz adı Gastromyzon stellatus veya başka tepe loach profiline tahminle bağlanmamalı");
const unresolvedBorneoButterfly = unresolvedSpeciesForSearch("Borneo Kelebek Vatoz", "fish", "freshwater");
assert.equal(unresolvedBorneoButterfly?.verifiedAt, "2026-09-23", "Genel Borneo Kelebek Vatoz kaydı güncel tür ayrımı denetimini taşımalı");
assert(unresolvedBorneoButterfly?.reason.includes("Beaufortia kweichowensis") && unresolvedBorneoButterfly.reason.includes("Gastromyzon stellatus"), "Genel Borneo Kelebek Vatoz kaydı iki doğrulanmış olası kimliği açıklamalı");
assert.equal(speciesForCatalogExactSearch("Butterfly Loach", "fish", "freshwater"), undefined, "Genel Butterfly Loach adı bilimsel kimlik olmadan Beaufortia veya Gastromyzon profiline dönüşmemeli");
const stripedTwigCatfish = speciesForLivestock({commonName:"Çizgili dal kedi balığı",scientificName:"Farlowella vittata",category:"fish",quantity:1});
assert.deepEqual(
  [stripedTwigCatfish?.id,stripedTwigCatfish?.adultSizeCm,stripedTwigCatfish?.minVolumeL,stripedTwigCatfish?.minTankLengthCm,stripedTwigCatfish?.minGroup,stripedTwigCatfish?.temperature,stripedTwigCatfish?.ph,stripedTwigCatfish?.flow],
  ["striped-twig-catfish",22.5,115,90,1,[24,27],[6,7],"medium"],
  "Farlowella vittata bilimsel azami boyu ve koruyucu bakım eşiklerini taşımalı",
);
assert(stripedTwigCatfish?.husbandryCaution?.includes("FishBase 22,5 cm") && stripedTwigCatfish.husbandryCaution.includes("ticaretteki bireyler için 15 cm"), "Farlowella vittata bilimsel boy ile bakım kaynağı farkını kullanıcıya açıklamalı");
assert.equal(stripedTwigCatfish?.verifiedAt, "2026-09-23", "Farlowella vittata güncel doğrulama tarihini taşımalı");
assert.equal(speciesForCatalogExactSearch("Farlowella vittata", "fish", "freshwater")?.id, "striped-twig-catfish", "Kesin Farlowella vittata bilimsel adı doğru profili bulmalı");
assert.equal(speciesForLivestock({commonName:"COLOMBİAN FARLOWELLA",category:"fish",quantity:1}), undefined, "Genel Colombian Farlowella adı Farlowella vittata veya colombiensis profiline tahminle bağlanmamalı");
const unresolvedColombianFarlowella = unresolvedSpeciesForSearch("COLOMBİAN FARLOWELLA", "fish", "freshwater");
assert.equal(unresolvedColombianFarlowella?.verifiedAt, "2026-09-23", "Colombian Farlowella kaydı güncel ticaret ve tür ayrımı denetimini taşımalı");
assert(unresolvedColombianFarlowella?.reason.includes("Farlowella vittata") && unresolvedColombianFarlowella.reason.includes("F. colombiensis"), "Colombian Farlowella kaydı olası iki kimliği ve ticaret farkını açıklamalı");
const duckbillCatfish = speciesForLivestock({commonName:"Ördek gagalı kedi balığı",scientificName:"Sorubim lima",category:"fish",quantity:1});
assert.deepEqual(
  [duckbillCatfish?.id,duckbillCatfish?.adultSizeCm,duckbillCatfish?.minVolumeL,duckbillCatfish?.minTankLengthCm,duckbillCatfish?.minGroup,duckbillCatfish?.temperature,duckbillCatfish?.ph],
  ["duckbill-catfish-sorubim-lima",54.2,1125,200,1,[23,30],[6.5,7.8]],
  "Sorubim lima kaynaklı bilimsel boy ve uzun süreli bakım ölçeğini taşımalı",
);
assert.equal(duckbillCatfish?.predatory, true, "Sorubim lima küçük balık ve kabuklular için avlanma riski taşımalı");
assert.equal(duckbillCatfish?.speciesOnly, true, "Sorubim lima sıradan topluluk balığı gibi önerilmemeli");
const barredShovelnose = speciesForLivestock({commonName:"Çizgili kürek burun kedi balığı",scientificName:"Pseudoplatystoma fasciatum",category:"fish",quantity:1});
assert.deepEqual(
  [barredShovelnose?.id,barredShovelnose?.adultSizeCm,barredShovelnose?.minVolumeL,barredShovelnose?.minTankLengthCm,barredShovelnose?.temperature,barredShovelnose?.ph],
  ["barred-shovelnose-catfish",104,10368,360,[22,26],[6,7.6]],
  "Pseudoplatystoma fasciatum kamu akvaryumu ölçeğindeki kaynaklı eşikleri taşımalı",
);
const tigerShovelnose = speciesForLivestock({commonName:"Kaplan kürek burun kedi balığı",scientificName:"Pseudoplatystoma tigrinum",category:"fish",quantity:1});
assert.deepEqual(
  [tigerShovelnose?.id,tigerShovelnose?.adultSizeCm,tigerShovelnose?.minVolumeL,tigerShovelnose?.minTankLengthCm,tigerShovelnose?.temperature,tigerShovelnose?.ph],
  ["tiger-shovelnose-catfish",130,10368,360,[22,26],[6,7.6]],
  "Pseudoplatystoma tigrinum bilimsel azami boyu ve kamu akvaryumu ölçeğindeki eşikleri taşımalı",
);
for (const profile of [barredShovelnose,tigerShovelnose]) {
  assert.equal(profile?.predatory, true, profile?.scientificName + " avlanma riski taşımalı");
  assert.equal(profile?.speciesOnly, true, profile?.scientificName + " sıradan topluluk balığı gibi önerilmemeli");
  assert.match(profile?.husbandryCaution || "", /10\.368 litre.*kamu akvaryumu/, profile?.scientificName + " erişkin bakım ölçeğini açıkça göstermeli");
  assert.equal(profile?.verifiedAt, "2026-09-23", profile?.scientificName + " güncel doğrulama tarihini taşımalı");
}
assert.equal(speciesForCatalogExactSearch("Sorubim lima", "fish", "freshwater")?.id, "duckbill-catfish-sorubim-lima", "Kesin Sorubim lima adı doğru profile bağlanmalı");
assert.equal(speciesForCatalogExactSearch("Pseudoplatystoma fasciatum", "fish", "freshwater")?.id, "barred-shovelnose-catfish", "Kesin Pseudoplatystoma fasciatum adı doğru profile bağlanmalı");
assert.equal(speciesForCatalogExactSearch("Pseudoplatystoma tigrinum", "fish", "freshwater")?.id, "tiger-shovelnose-catfish", "Kesin Pseudoplatystoma tigrinum adı doğru profile bağlanmalı");
assert.equal(speciesForLivestock({commonName:"KÜREK BURUN BALIKLARI",category:"fish",quantity:1}), undefined, "Genel Kürek Burun adı üç bilimsel profilden birine tahminle bağlanmamalı");
const unresolvedShovelnose = unresolvedSpeciesForSearch("KÜREK BURUN BALIKLARI", "fish", "freshwater");
assert.equal(unresolvedShovelnose?.verifiedAt, "2026-09-23", "Genel Kürek Burun kaydı güncel tür ayrımı denetimini taşımalı");
assert(unresolvedShovelnose?.reason.includes("Sorubim lima") && unresolvedShovelnose.reason.includes("Pseudoplatystoma fasciatum/tigrinum"), "Genel Kürek Burun kaydı farklı boy ve bakım ölçeğindeki olası kimlikleri açıklamalı");
assert.equal(speciesForCatalogExactSearch("Shovelnose catfish", "fish", "freshwater"), undefined, "Genel Shovelnose catfish adı bilimsel kimlik olmadan kesin profile dönüşmemeli");
assert.deepEqual([speciesCatalog.find((item) => item.id === "tropheus-moorii")?.minGroup, speciesCatalog.find((item) => item.id === "tropheus-moorii")?.minTankLengthCm], [15, 150], "Moorii Tropheus küçük grup veya kısa tank için önerilmemeli");
assert.equal(speciesCatalog.find((item) => item.id === "red-zebra-mbuna")?.ph[0], 7.5, "Kırmızı zebra asidik topluluk su koşullarına önerilmemeli");
const grantsPeacock = speciesCatalog.find((item) => item.id === "grants-peacock");
assert.deepEqual(
  [grantsPeacock?.scientificName,grantsPeacock?.adultSizeCm,grantsPeacock?.minVolumeL,grantsPeacock?.minTankLengthCm,grantsPeacock?.minGroup,grantsPeacock?.temperature,grantsPeacock?.ph,grantsPeacock?.flow],
  ["Aulonocara stuartgranti",13,243,120,5,[23,29],[7.5,9],"medium"],
  "Aulonocara stuartgranti kaynaklı boy, harem grubu, taban alanı ve su eşiklerini taşımalı",
);
assert.equal(grantsPeacock?.speciesOnly, true, "Aulonocara stuartgranti melezleşme ve erkek saldırganlığı nedeniyle sıradan topluluk balığı gibi sunulmamalı");
assert.equal(grantsPeacock?.verifiedAt, "2026-09-10", "Aulonocara stuartgranti güncel doğrulama tarihini taşımalı");
assert.match(grantsPeacock?.sourceUrl || "", /^https:\/\/www\.seriouslyfish\.com\/species\/aulonocara-stuartgranti$/, "Aulonocara stuartgranti doğrudan türe özel uzman kaynağa bağlanmalı");
assert.equal(speciesForLivestock({commonName:"RED RUBY CİKLET",category:"fish",quantity:1}), undefined, "Red Ruby ticari adı Aulonocara stuartgranti veya başka Peacock profiline tahminle bağlanmamalı");
const baenschiPeacock = speciesCatalog.find((item) => item.id === "baenschi-peacock");
assert.deepEqual(
  [baenschiPeacock?.scientificName,baenschiPeacock?.adultSizeCm,baenschiPeacock?.minVolumeL,baenschiPeacock?.minTankLengthCm,baenschiPeacock?.minGroup,baenschiPeacock?.temperature,baenschiPeacock?.ph,baenschiPeacock?.flow],
  ["Aulonocara baenschi",12,243,120,5,[25,29],[7.5,9],"medium"],
  "Aulonocara baenschi kaynaklı boy, harem grubu, taban alanı ve su eşiklerini taşımalı",
);
assert.equal(baenschiPeacock?.speciesOnly, true, "Aulonocara baenschi melezleşme ve erkek saldırganlığı nedeniyle sıradan topluluk balığı gibi sunulmamalı");
assert.equal(baenschiPeacock?.verifiedAt, "2026-09-10", "Aulonocara baenschi güncel doğrulama tarihini taşımalı");
assert.match(baenschiPeacock?.sourceUrl || "", /^https:\/\/www\.seriouslyfish\.com\/species\/aulonocara-baenschi$/, "Aulonocara baenschi doğrudan türe özel uzman kaynağa bağlanmalı");
assert.equal(speciesForLivestock({commonName:"İTHAL SARI İMPARATOR CİKLET",category:"fish",quantity:1}), undefined, "Sarı İmparator ticari adı Aulonocara baenschi veya başka Peacock profiline tahminle bağlanmamalı");
for (const [id, minVolumeL, minTankLengthCm, minGroup] of [
  ["jaguar-cichlid", 680, 182, 1],
  ["salvini-cichlid", 240, 120, 2],
  ["uaru-cichlid", 450, 150, 4],
]) {
  const profile = speciesCatalog.find((item) => item.id === id);
  assert(profile, `${id} yaygın Amerika cikletleri arasında bulunmalı`);
  assert.equal(profile.minVolumeL, minVolumeL, `${id} güvenli yetişkin hacmi korunmalı`);
  assert.equal(profile.minTankLengthCm, minTankLengthCm, `${id} güvenli tank uzunluğu korunmalı`);
  assert.equal(profile.minGroup, minGroup, `${id} sosyal yapı gereksinimi korunmalı`);
  assert(profile.husbandryCaution, `${id} yetişkin bakım uyarısı taşımalı`);
}
assert.equal(speciesCatalog.find((item) => item.id === "jaguar-cichlid")?.speciesOnly, true, "Jaguar ciklet sıradan topluluk akvaryumuna önerilmemeli");
assert.equal(speciesCatalog.find((item) => item.id === "salvini-cichlid")?.speciesOnly, true, "Salvini ciklet üreme saldırganlığı nedeniyle tür akvaryumu uyarısı taşımalı");
assert.deepEqual(speciesCatalog.find((item) => item.id === "uaru-cichlid")?.ph, [5.5, 6.5], "Uaru sert ve alkali Malawi koşullarına önerilmemeli");
assert(
  speciesCatalog.every((item) => /^https:\/\//.test(item.sourceUrl || "")),
  "Her canlı kaydı doğrulanabilir bir HTTPS kaynak bağlantısı taşımalı",
);
const expectedLivestockCategories = ["fish", "shrimp", "snail", "other"];
assert.deepEqual(
  [...livestockCategories].sort(),
  [...expectedLivestockCategories].sort(),
  "Arayüzdeki her canlı sınıfı katalogda en az bir tür içermeli",
);
for (const category of livestockCategories) {
  const categoryItems = speciesCatalog.filter((item) => item.category === category);
  assert(categoryItems.length > 0, `${category} canlı sınıfı boş olmamalı`);

  for (const group of new Set(categoryItems.map(speciesGroup))) {
    const species = categoryItems.filter((item) => speciesGroup(item) === group);
    assert(species.length > 0, `${category} / ${group} tür listesi boş olmamalı`);
    assert(species.every((item) => item.category === category), `${group} grubuna farklı canlı sınıfı sızdı`);
    assert(species.every((item) => speciesGroup(item) === group), `${group} grubuna farklı canlı grubu sızdı`);
  }
}
assert.equal(speciesCatalog.filter((item) => speciesGroup(item) === "shrimp").length, 44, "Karides kataloğu doğrulanmış Caridina serrata dahil yaygın tür ve renk varyeteleriyle 44 biyolojik bakım profili içermeli");
assert.equal(speciesCatalog.filter((item) => speciesGroup(item) === "snail").length, 19, "Salyangoz kataloğu yinelenen Pomacea diffusa kaydı olmadan 19 benzersiz bakım profili içermeli");
const mysterySnail = speciesCatalog.find((item) => item.id === "apple-snail");
assert.deepEqual([mysterySnail?.scientificName,mysterySnail?.adultSizeCm,mysterySnail?.minVolumeL,mysterySnail?.minTankLengthCm,mysterySnail?.temperature,mysterySnail?.ph], ["Pomacea diffusa",6,40,undefined,[20,28],[7.2,7.8]], "Pomacea diffusa tek kaynaklı Mystery salyangoz profilinde güvenli eşikleri taşımalı");
assert.equal(speciesCatalog.filter((item) => item.scientificName === "Pomacea diffusa").length, 1, "Pomacea diffusa çelişen iki ayrı bakım profili olarak çoğaltılmamalı");
assert.equal(speciesForCatalogExactSearch("Mystery Snail", "snail", "freshwater")?.id, "apple-snail", "Kesin Mystery Snail ortak adı Pomacea diffusa profilini bulmalı");
assert.equal(speciesForCatalogExactSearch("Elma salyangozu", "snail", "freshwater"), undefined, "Genel Elma salyangozu adı bilimsel kimlik olmadan Pomacea diffusa profiline dönüşmemeli");
assert.equal(speciesForLivestock({ commonName:"Eski Mystery kaydı", scientificName:"Pomacea diffusa", category:"snail", quantity:1 })?.id, "apple-snail", "Eski localStorage canlısı bilimsel adıyla birleştirilen Pomacea diffusa profiline bağlanmalı");
assert(mysterySnail?.husbandryCaution?.includes("bakırsız") && mysterySnail.husbandryCaution.includes("doğaya kesinlikle bırakılmamalıdır"), "Mystery salyangoz bakır ve doğaya salım güvenliği taşımalı");
for (const id of ["blue-dream-shrimp", "yellow-fire-shrimp", "orange-sakura-shrimp", "green-jade-shrimp", "bloody-mary-shrimp", "red-rili-shrimp", "orange-rili-shrimp", "carbon-rili-shrimp", "green-jelly-shrimp", "chocolate-shrimp"]) {
  const item = speciesCatalog.find((entry) => entry.id === id);
  assert.equal(item?.scientificName, "Neocaridina davidi", `${id} renk varyetesi doğru biyolojik türü kullanmalı`);
  assert.deepEqual(item?.temperature, [18, 28], `${id} Neocaridina bakım aralığını paylaşmalı`);
}
const cardinalSulawesi = speciesCatalog.find((item) => item.id === "cardinal-sulawesi-shrimp");
assert.deepEqual(cardinalSulawesi?.temperature, [27, 29], "Cardinal Sulawesi karides serin Caridina koşullarına önerilmemeli");
assert((cardinalSulawesi?.ph[0] || 0) >= 7.8, "Cardinal Sulawesi karides asidik Caridina koşullarına önerilmemeli");
const whitePearl = speciesCatalog.find((item) => item.id === "white-pearl-shrimp");
assert.equal(whitePearl?.scientificName, "Neocaridina cf. zhangjiajiensis", "White Pearl mağaza adı yanlış Neocaridina türüne bağlanmamalı");
assert.deepEqual(whitePearl?.temperature, [20, 26], "White Pearl doğrulanan sıcaklık aralığını korumalı");
assert.deepEqual(whitePearl?.ph, [6.5, 7.8], "White Pearl doğrulanan pH aralığını korumalı");
for (const id of [
  "taiwan-bee-red-shrimp",
  "taiwan-bee-yellow-kingkong",
  "taiwan-bee-black-shrimp",
  "blue-shadow-mosura-shrimp",
  "snow-white-shrimp",
  "red-pinto-shrimp",
  "red-fancy-tiger-shrimp",
  "red-galaxy-shrimp",
  "prl-shrimp",
  "black-galaxy-shrimp",
  "black-pinto-shrimp",
  "black-fancy-tiger-shrimp",
]) {
  const profile = speciesCatalog.find((item) => item.id === id);
  assert(profile, `${id} doğrulanan Caridina kataloğunda bulunmalı`);
  assert.deepEqual(profile.temperature, [19, 22], `${id} hassas Taiwan Bee sıcaklık aralığını korumalı`);
  assert.deepEqual(profile.ph, [5.5, 6.5], `${id} aktif toprak ve asidik su gereksinimini korumalı`);
  assert.equal(profile.minGroup, 6, `${id} tek birey olarak önerilmemeli`);
  assert(profile.husbandryCaution?.includes("GH/TDS"), `${id} aktif toprak ve mineral kararlılığı uyarısı taşımalı`);
  assert.equal(profile.verifiedAt, "2026-08-27", `${id} güncel doğrulama tarihi taşımalı`);
  assert(/^https:\/\/aquarubi\.com\//.test(profile.sourceUrl || ""), `${id} doğrulanabilir yerel ikinci kaynak taşımalı`);
}
for (const retailName of [
  "Taiwan Bee Red Extreme",
  "Taiwan Bee Red Ruby",
  "Taiwan Bee Red Shadow Mosura",
  "Taiwan Bee Yellow Kingkong",
  "Taiwan Bee Black Extreme",
  "Taiwan Bee Blue Bolt",
  "Taiwan Bee Dark Blue Bolt",
  "Taiwan Bee Blue Shadow Mosura",
  "Snow White Shrimp",
  "Red Spotted Pinto",
  "Red Zebra Pinto",
  "Kırmızı Kristal Karides",
  "Red Fancy Tiger S Grade",
  "Red Fancy Tiger SS/SS+ Grade",
  "Red Galaxy Fishbone Shrimp",
  "PRL Shrimp S Grade",
  "PRL Shrimp SS Grade",
  "PRL Shrimp SS+ Grade",
  "Black Galaxy Fishbone",
  "Black Spotted Pinto",
  "Black Zebra Pinto",
  "Black Fancy Tiger SS/SS+",
  "Royal Blue Tiger Shrimp",
  "White Pearl Shrimp",
  "Orange Sakura",
  "Black Rose Shrimp",
  "Yellow Fire",
  "Blue Angel Shrimp",
  "Blue Black Rili Shrimp",
  "Green Jade",
  "Blue Jelly Shrimp",
  "Bloody Mary",
]) {
  assert(speciesForLivestock({ commonName: retailName, category: "shrimp", quantity: 1 }), `${retailName} mağaza adı sağlık profiline bağlanmalı`);
}
assert.equal(speciesCatalog.find((item) => item.id === "pagoda-snail")?.flow, "medium", "Pagoda salyangoz oksijenli ve akıntılı su gereksinimini taşımalı");
for (const retailName of [
  "Yellow Poso Spotted Rabbit",
  "Zebra Nerite Salyangoz",
  "Turbo salyangoz",
  "Tiger Snail",
  "Sun Nerite Snail",
  "Rhamshorn Salyangoz",
  "Poso Orange Rabbit salyangoz",
  "Poso Yellow Rabbit salyangoz",
  "Mini Tiger Nerite salyangoz",
  "Mini Nerite salyangoz",
  "Katil Salyangoz",
  "Batik Nerite salyangoz",
  "Batman Nerite salyangoz",
]) {
  assert(speciesForLivestock({ commonName: retailName, category: "snail", quantity: 1 }), `${retailName} mağaza adı sağlık profiline bağlanmalı`);
}
const cikletistSnailInventory = [
  ["RAMSHORN SALYANGOZ 4 ADET STRAFORLU GÖNDERİM", "ramshorn-snail"],
  ["PORTAKAL POSO TAVŞAN SALYANGOZ STRAFORLU GÖNDERİM", "poso-orange-rabbit-snail"],
  ["Katil Salyangoz Helena 3 ADET STRAFORLU GÖNDERİM", "assassin-snail"],
  ["Nerite Salyangoz Yeşil Boynuzlu (Yosun Yiyici) 4 ADET STRAFORLU GÖNDERİM", "horned-nerite"],
  ["Nerite Zebra Salyangoz(Yosun Yiyici) 4 ADET STRAFORLU GÖNDERİM", "nerite-snail"],
  ["Elma Salyangozu 3 ADET", undefined],
  ["Tatlı Su Midyesi(Doğal Filtre) 3 ADET", undefined],
  ["SPOTTED NERİTE ÇEŞİTLERİ YOSUN YİYİCİ SALYANGOZLAR 4 ADET STRAFORLU GÖNDERİM", undefined],
  ["Nerite Tricolor Horn Snail 4 ADET STRAFORLU GÖNDERİM", undefined],
  ["Nerite Ring Snail 4 ADET STRAFORLU GÖNDERİM", undefined],
];
for (const [retailName, expectedId] of cikletistSnailInventory) {
  assert.equal(
    speciesForLivestock({ commonName: retailName, category: "snail", quantity: 1 })?.id,
    expectedId,
    expectedId
      ? `${retailName} doğrulanan salyangoz profiline bağlanmalı`
      : `${retailName} tür kimliği doğrulanmadan bir salyangoz profiline bağlanmamalı`,
  );
}
for (const id of ["ramshorn-snail", "poso-orange-rabbit-snail", "assassin-snail", "horned-nerite", "nerite-snail"]) {
  const profile = speciesCatalog.find((item) => item.id === id);
  assert.equal(profile?.verifiedAt, "2026-08-29", `${id} güncel Cikletist karşılaştırma tarihi taşımalı`);
  assert(profile?.additionalSourceUrls?.some((url) => url.startsWith("https://www.cikletistpetshop.com/")), `${id} tam yerel satış kaynağını taşımalı`);
}
assert.equal(speciesCatalog.find((item) => item.id === "yellow-spotted-rabbit-snail")?.scientificName, "Tylomelania towutica", "Yellow Poso Spotted Rabbit doğrulanan bilimsel kimliği korumalı");
for (const id of ["turbo-snail", "tiger-nerite-snail", "mini-tiger-nerite-snail", "mini-nerite-snail", "batik-nerite-snail", "batman-nerite-snail"]) {
  const profile = speciesCatalog.find((item) => item.id === id);
  assert.equal(profile?.scientificName, "Neritidae sp.", `${id} için kaynağın vermediği tür kimliği uydurulmamalı`);
  assert(profile?.husbandryCaution?.includes("tür düzeyinde kimlik sağlamaz"), `${id} belirsiz ticari kimlik uyarısı taşımalı`);
  assert.equal(profile?.verifiedAt, "2026-08-27", `${id} güncel doğrulama tarihi taşımalı`);
}
assert(speciesCatalog.find((item) => item.id === "guppy")?.aliases?.includes("Moscow Blue"), "Lepistes yaygın mağaza varyeteleriyle aranabilmeli");
assert(speciesCatalog.find((item) => item.id === "betta")?.aliases?.includes("Halfmoon"), "Betta yüzgeç formları ana biyolojik profile bağlanmalı");
assert(speciesCatalog.find((item) => item.id === "angelfish")?.aliases?.includes("Koi melek"), "Melek balığı renk varyeteleri katalog aramasında bulunmalı");
assert(speciesCatalog.find((item) => item.id === "ancistrus")?.aliases?.includes("Albino cüce vatoz"), "Yaygın Ancistrus varyeteleri ana bakım profiliyle aranabilmeli");
assert(speciesCatalog.find((item) => item.id === "goldfish")?.aliases?.includes("Oranda"), "Yaygın süslü Japon balığı formları katalog aramasında bulunmalı");
assert.equal(speciesForLivestock({commonName:"Halfmoon",category:"fish",quantity:1})?.id, "betta", "Kimliksiz eski varyete kaydı ana Betta sağlık profiline bağlanmalı");
assert.equal(speciesForLivestock({commonName:"Albino cüce vatoz",category:"fish",quantity:1})?.id, "ancistrus", "Kimliksiz eski Ancistrus varyetesi sağlık analizinden düşmemeli");
for (const [retailName, expectedId] of [
  ["Sivrisinek Rasbora", "chili-rasbora"],
  ["Siyah Cüce Vatoz", "ancistrus"],
  ["Royal Farlowella Whiptail Catfish", "royal-farlowella"],
  ["SAE", "siamese-algae-eater"],
  ["Red Cap Oranda", "goldfish"],
  ["Red Lizard Whiptail Catfish", "red-whiptail-catfish"],
  ["Pigme Corydoras", "pygmy-cory"],
  ["Otocinclus Affinis", "otocinclus"],
  ["Panda Loach", "panda-loach"],
  ["Nannacara Anomala", "goldeneye-dwarf-cichlid"],
  ["Neon Tetra", "neon-tetra"],
  ["Mikrogeophagus Ramirezi", "ramirezi"],
  ["Melon Barb", "melon-barb"],
  ["Mascara Barb", "mascara-barb"],
  ["Limon Tetra", "lemon-tetra"],
  ["Kiraz Barb", "cherry-barb"],
  ["Kırmızı Burun Tetra", "rummy-nose"],
  ["L144 Cüce Vatoz", "ancistrus"],
  ["L144 Longfin Cüce Vatoz", "ancistrus"],
  ["Kardinal Neon Tetra", "cardinal-tetra"],
  ["Halfmoon Betta Red", "betta"],
  ["Halfmoon Betta White", "betta"],
  ["Harlequin Rasbora", "harlequin-rasbora"],
  ["Galaxy Candy Koi Betta", "betta"],
  ["Galaxy Halfmoon Betta", "betta"],
  ["Galaxy Rasbora", "galaxy-rasbora"],
  ["Ember Tetra", "ember-tetra"],
  ["Electric Blue Ramirezi", "ramirezi"],
  ["Dicrossus Filamentosus", "checkerboard-cichlid"],
  ["Corydoras Aspidoras C125 Red", "c125-red-aspidoras"],
  ["Corydoras Habrosus", "salt-pepper-cory"],
  ["Corydoras Napoensis", "napo-cory"],
  ["Corydoras Panda", "corydoras-panda"],
  ["Corydoras Similis", "smudge-spot-cory"],
  ["Bolivian Ramirezi", "bolivian-ram"],
  ["Black Venezuela Corydoras", "black-venezuela-cory"],
  ["Betta Mix Colour", "betta"],
  ["Apistogramma Kakadu", "apisto-cacatuoides"],
]) {
  assert.equal(
    speciesForLivestock({commonName:retailName,category:"fish",quantity:1})?.id,
    expectedId,
    `AquaRubi güncel balık adı doğru sağlık profiline bağlanmalı: ${retailName}`,
  );
}
assert.equal(speciesCatalog.find((item) => item.id === "otocinclus")?.scientificName, "Otocinclus macrospilus", "Otocinclus Affinis ticari adı bilimsel kimliği doğrulamadan ana profile yazılmamalı");
assert(speciesCatalog.find((item) => item.id === "otocinclus")?.husbandryCaution?.includes("birden fazla benzer"), "Otocinclus ticari kimlik belirsizliği görünür bakım uyarısı taşımalı");
assert(speciesCatalog.find((item) => item.id === "siamese-algae-eater")?.husbandryCaution?.includes("karıştırılabilir"), "SAE ticari kimlik karışıklığı kullanıcıya açıklanmalı");

const cikletistLivebearerInventory = [
  ["NEON BLUE LEPİSTES BALIKLARI", "guppy"],
  ["RED GRASS ÖZEL TÜR LEPİSTES BALIKLARI", "guppy"],
  ["ALBİNO WHİTE LEPİSTES BALIKLARI", "guppy"],
  ["FULL BLACK LEPİSTES BALIKLARI", "guppy"],
  ["SRILANKA LEPİSTES BALIKLARI", "guppy"],
  ["Plati Balıkları", "platy"],
  ["Moli Balığı", "molly"],
  ["Hb White Lepistes", "guppy"],
  ["Red Tail Big Ear Lepistes", "guppy"],
  ["Albino Full Red Lepistes", "guppy"],
  ["Metal Red Grass Lepistes", "guppy"],
  ["Metal Blue Grass Lepistes", "guppy"],
  ["Blue Grass Lepistes", "guppy"],
  ["TİGER LEPİSTES BALIKLARI", "guppy"],
  ["SADDLE BLACK WHİTE ÖZEL TÜR LEPİSTES", "guppy"],
  ["RED LACE LEPİSTES BALIKLARI", "guppy"],
  ["VELİFERA BALIKLARI", "giant-sailfin-molly"],
  ["KOİ KILIÇ KUYRUK", "swordtail"],
  ["ALBİNO SKY BLUE"],
  ["VELİFERA TÜRLERİ", "giant-sailfin-molly"],
  ["PANDA LEPİSTES", "guppy"],
  ["GREEN COBRA LEPİSTES", "guppy"],
  ["SNOW WHİTE LEPİSTES", "guppy"],
  ["COBRA LEPİSTES", "guppy"],
  ["YELLOW TUXEDO LEPİSTES", "guppy"],
  ["SANTA CLAUS LEPİSTES", "guppy"],
];
assert.equal(cikletistLivebearerInventory.length, 26, "Cikletist güncel iki sayfalık Canlı Doğuranlar envanterindeki 26 satış başlığının tamamı denetlenmeli");
for (const [retailName, expectedId] of cikletistLivebearerInventory) {
  const matched = speciesForLivestock({commonName:retailName,category:"fish",quantity:1});
  if (expectedId) assert.equal(matched?.id, expectedId, `Cikletist canlı doğuran adı doğru sağlık profiline bağlanmalı: ${retailName}`);
  else assert.equal(matched, undefined, `Bilimsel kimliği yayımlanmayan ticari ad tahminle bir türe bağlanmamalı: ${retailName}`);
}
const verifiedGuppy = speciesCatalog.find((item) => item.id === "guppy");
assert.deepEqual([verifiedGuppy?.adultSizeCm,verifiedGuppy?.minVolumeL,verifiedGuppy?.minTankLengthCm,verifiedGuppy?.minGroup,verifiedGuppy?.temperature,verifiedGuppy?.ph], [6,45,60,3,[20,28],[7,8]], "Lepistes FishBase ve OATA bakım eşiklerini taşımalı");
assert.equal(verifiedGuppy?.verifiedAt, "2026-09-02", "Lepistes güncel kaynak doğrulama tarihini taşımalı");
assert((verifiedGuppy?.additionalSourceUrls?.length || 0) >= 3, "Lepistes bilimsel, bakım ve yerel envanter kaynaklarını saklamalı");
const verifiedVelifera = speciesCatalog.find((item) => item.id === "giant-sailfin-molly");
assert.deepEqual([verifiedVelifera?.scientificName,verifiedVelifera?.adultSizeCm,verifiedVelifera?.minVolumeL,verifiedVelifera?.minTankLengthCm,verifiedVelifera?.minGroup,verifiedVelifera?.temperature,verifiedVelifera?.ph], ["Poecilia velifera",15,104,91,3,[22,28],[7,8.5]], "Velifera türe özel doğrulanmış bakım eşiklerini taşımalı");
assert.equal(verifiedVelifera?.verifiedAt, "2026-09-02", "Velifera güncel kaynak doğrulama tarihini taşımalı");
assert(verifiedVelifera?.husbandryCaution?.includes("melezleşmiş"), "Velifera ticari stok kimliği riskini kullanıcıya açıklamalı");
const cikletistBettaInventory = [
  ["Veiltail Betta", "betta"],
  ["Crowntail Betta", "betta"],
  ["HALFMOON BETTA BALIKLARI", "betta"],
  ["HALFMOON BETTA BALIKLARI A+", "betta"],
  ["DEV GURAMİ BALIKLARI", "giant-gourami"],
  ["WHİTE BETTA ÇEŞİTLERİ", "betta"],
  ["GALAXY KOİ BETTA BALIKLARI", "betta"],
  ["TAÇ BETTA BALIKLARI", "betta"],
  ["MEYAN KÖKÜ GURAMİ"],
  ["ÇİKOLATA GURAMİ", "chocolate-gourami"],
  ["SAMURAY BETTA", "betta"],
  ["KOİ PLAKAT BETTA", "betta"],
  ["GALAXY HALFMOON NEMO BETTA BALIKLARI STRAFORLU GÖNDERİM", "betta"],
  ["KOİ PLAKAT DİŞİ BETTA", "betta"],
];
assert.equal(cikletistBettaInventory.length, 14, "Cikletist Betta kategorisindeki yem dışındaki 14 canlı başlığının tamamı denetlenmeli");
for (const [retailName, expectedId] of cikletistBettaInventory) {
  const matched = speciesForLivestock({commonName:retailName,category:"fish",quantity:1});
  if (expectedId) assert.equal(matched?.id, expectedId, `Cikletist Betta/labirentli adı doğru sağlık profiline bağlanmalı: ${retailName}`);
  else assert.equal(matched, undefined, `Bilimsel kimliği yayımlanmayan Betta kategorisi adı tahminle bir türe bağlanmamalı: ${retailName}`);
}
const verifiedBetta = speciesCatalog.find((item) => item.id === "betta");
assert.deepEqual([verifiedBetta?.scientificName,verifiedBetta?.adultSizeCm,verifiedBetta?.minVolumeL,verifiedBetta?.minTankLengthCm,verifiedBetta?.minGroup,verifiedBetta?.temperature,verifiedBetta?.ph,verifiedBetta?.flow], ["Betta splendens",6.5,20,undefined,1,[20,28],[6,8],"low"], "Betta splendens FishBase ve OATA bakım eşiklerini taşımalı; yayımlanmayan tank uzunluğu tahmin edilmemeli");
assert.equal(verifiedBetta?.verifiedAt, "2026-09-02", "Betta güncel kaynak doğrulama tarihini taşımalı");
assert(verifiedBetta?.sourceUrl?.includes("fishbase.se"), "Betta bilimsel kimlik ve boy kaynağına bağlanmalı");
assert(verifiedBetta?.additionalSourceUrls?.some((url) => url.includes("ornamentalfish.org")), "Betta kurumsal bakım kaynağına bağlanmalı");
assert(verifiedBetta?.tankLengthDataNote?.includes("tahmini uzunluk kullanılmıyor"), "Betta için yayımlanmayan santimetre eşiği açıkça belirtilmeli");
const cikletistLabyrinthInventory = [["Gurami"], ...cikletistBettaInventory];
assert.equal(cikletistLabyrinthInventory.length, 15, "Cikletist Labirentli Balıklar kategorisindeki 15 canlı başlığının tamamı denetlenmeli");
for (const [retailName, expectedId] of cikletistLabyrinthInventory) {
  const matched = speciesForLivestock({commonName:retailName,category:"fish",quantity:1});
  if (expectedId) assert.equal(matched?.id, expectedId, `Cikletist labirentli adı doğru sağlık profiline bağlanmalı: ${retailName}`);
  else assert.equal(matched, undefined, `Tür belirtmeyen labirentli satış adı tahminle bir türe bağlanmamalı: ${retailName}`);
}
const cikletistGoldfishInventory = [
  ["KOİ BALIKLARI HAVUZ BALIKLARI A+", "koi-carp"],
  ["Ranchu Japon Balıkları", "goldfish"],
  ["Black Ranchu Japon Balığı", "goldfish"],
  ["Ryukin Japon Balıkları", "goldfish"],
  ["JAPON BALIKLAR M BOY 7 CM", "goldfish"],
  ["Koi Havuz Balıkları", "koi-carp"],
  ["Oranda Japon Balıkları", "goldfish"],
  ["Oranda Japon Balığı", "goldfish"],
  ["JAPON BALIKLARI XL BOY 12 CM", "goldfish"],
  ["JAPON BALIKLARI S BOY 5 CM", "goldfish"],
  ["KOİ BALIKLARI", "koi-carp"],
  ["Koi Balıkları", "koi-carp"],
  ["Ranchu Japon Balıkları", "goldfish"],
  ["A+ İTHAL ORANDALAR", "goldfish"],
  ["BALONGÖZ JAPON", "goldfish"],
  ["ORANDALAR YERLİ", "goldfish"],
  ["RYUKİN CALİCO", "goldfish"],
  ["TELESKOP JAPON", "goldfish"],
];
assert.equal(cikletistGoldfishInventory.length, 18, "Cikletist Japon/Oranda kategorisindeki 18 güncel satış kaydının tamamı denetlenmeli");
for (const [retailName, expectedId] of cikletistGoldfishInventory) {
  assert.equal(
    speciesForLivestock({commonName:retailName,category:"fish",quantity:1})?.id,
    expectedId,
    `Cikletist Japon/koi adı doğru sağlık profiline bağlanmalı: ${retailName}`,
  );
}
const cikletistPondFishInventory = [
  ["KOİ BALIKLARI HAVUZ BALIKLARI  A+", "koi-carp"],
  ["Koi Havuz Balıkları", "koi-carp"],
  ["KOİ BALIKLARI", "koi-carp"],
  ["Koi Balıkları", "koi-carp"],
  ["BALONGÖZ JAPON", "goldfish"],
  ["KOİ TÜL KUYRUK", "koi-carp"],
  ["RYUKİN CALİCO", "goldfish"],
  ["TELESKOP JAPON", "goldfish"],
];
assert.equal(cikletistPondFishInventory.length, 8, "Cikletist Havuz Balıkları kategorisindeki sekiz güncel satış başlığının tamamı denetlenmeli");
for (const [retailName, expectedId] of cikletistPondFishInventory) {
  assert.equal(
    speciesForLivestock({commonName:retailName,category:"fish",quantity:1})?.id,
    expectedId,
    `Havuz balığı satış adı doğru kaynaklı profile bağlanmalı: ${retailName}`,
  );
}
assert.equal(speciesForLivestock({commonName:"KOİ BALIKLARI HAVUZ BALIKLARI  A+",category:"fish",quantity:1})?.id, "koi-carp", "Mağaza başlığındaki yinelenen boşluk güvenli koi eşleşmesini bozmamalı");
assert(speciesCatalog.find((item) => item.id === "koi-carp")?.husbandryCaution?.includes("uzun yüzgeçli seçilim formudur"), "Tül kuyruk koi ayrı biyolojik tür gibi çoğaltılmamalı");
const verifiedGoldfish = speciesCatalog.find((item) => item.id === "goldfish");
assert.deepEqual([verifiedGoldfish?.scientificName,verifiedGoldfish?.adultSizeCm,verifiedGoldfish?.minVolumeL,verifiedGoldfish?.additionalVolumePerAnimalL,verifiedGoldfish?.minTankLengthCm,verifiedGoldfish?.temperature,verifiedGoldfish?.ph,verifiedGoldfish?.flow], ["Carassius auratus",25,100,50,100,[4,25],[6,8],"low"], "Japon balığı OATA ve FishBase bakım eşiklerini taşımalı");
assert.equal(verifiedGoldfish?.verifiedAt, "2026-09-02", "Japon balığı güncel kaynak doğrulama tarihini taşımalı");
assert(verifiedGoldfish?.sourceUrl?.includes("ornamentalfish.org"), "Japon balığı kurumsal bakım kaynağına bağlanmalı");
assert(verifiedGoldfish?.additionalSourceUrls?.some((url) => url.includes("fishbase.se")), "Japon balığı bilimsel kimlik ve 100 cm akvaryum kaynağına bağlanmalı");
assert(verifiedGoldfish?.husbandryCaution?.includes("her ek yetişkin için 50 litre"), "Japon balığı ek birey hacmi kullanıcıya açıklanmalı");
// Seriously Fish'in 120 × 45 × 45 cm ölçüsü yavrular veya üreyen çift içindir; katalog en az beş yetişkin istediği için hacim OATA'nın yetişkin sürü değerindedir.
const verifiedDiscus = speciesCatalog.find((item) => item.id === "discus");
assert.deepEqual([verifiedDiscus?.adultSizeCm,verifiedDiscus?.minVolumeL,verifiedDiscus?.minTankLengthCm,verifiedDiscus?.minGroup,verifiedDiscus?.temperature,verifiedDiscus?.ph], [20,300,120,5,[27,30],[6,6.5]], "Diskus yetişkin sürü için OATA ve Fishkeeper bakım eşiklerini taşımalı");
assert(verifiedDiscus.minVolumeL >= verifiedDiscus.minGroup * 50, "Diskus hacmi en az grubun her yetişkini için OATA'nın 50 litresini karşılamalı");
assert(verifiedDiscus?.sourceUrl?.includes("ornamentalfish.org"), "Diskus yetişkin sürü hacmini veren OATA bakım kaynağına bağlanmalı");
assert(["seriouslyfish.com","fishkeeper.co.uk","fishbase.se"].every((host) => verifiedDiscus?.additionalSourceUrls?.some((url) => url.includes(host))), "Diskusun uzunluk, su değerleri ve kimlik kaynakları korunmalı");
// Satış adı tek bir bilimsel türe denk gelmeyen kayıtlar satılan balığa göre tanımlanır; birden fazla aday varsa en koruyucu kaynaklı değerler kullanılır (docs/DECISIONS/0014).
const identityRecords = [
  ["ancistrus", "Ancistrus sp. '3'", 15, 54, 60, 1, [21,26], [5.5,7.5], "seriouslyfish.com/species/ancistrus-cf-cirrhosus", "Ancistrus cirrhosus"],
  ["common-pleco", "Pterygoplichthys pardalis / P. disjunctivus", 70, 400, 200, 1, [25,26], [6.5,7.2], "fishkeeper.co.uk/fish/freshwater/catfish/common-plec", "Hypostomus plecostomus"],
  ["siamese-algae-eater", "Crossocheilus langei / C. atrilimes", 16.4, 304, 150, 6, [20,26], [6,7.5], "seriouslyfish.com/species/crossocheilus-langei", "Crossocheilus oblongus"],
];
for (const [id, scientificName, size, volume, length, group, temperature, ph, source, formerName] of identityRecords) {
  const profile = speciesCatalog.find((item) => item.id === id);
  assert.deepEqual([profile?.scientificName,profile?.adultSizeCm,profile?.minVolumeL,profile?.minTankLengthCm,profile?.minGroup,profile?.temperature,profile?.ph], [scientificName,size,volume,length,group,temperature,ph], `${id} satılan balığın kaynaklı kimliğini ve değerlerini taşımalı`);
  assert(profile?.sourceUrl?.includes(source), `${id} ana bakım kaynağına bağlanmalı`);
  assert.equal(profile?.verifiedAt, "2026-10-05", `${id} kimlik düzeltmesinin doğrulama tarihini taşımalı`);
  assert(profile?.aliases?.includes(formerName), `${id} eski bilimsel adla aranabilmeli`);
  assert(profile?.husbandryCaution, `${id} kimlik belirsizliğini kullanıcıya açıklamalı`);
}
const commonPleco = speciesCatalog.find((item) => item.id === "common-pleco");
assert(["art=108","art=552"].every((page) => commonPleco?.additionalSourceUrls?.some((url) => url.includes("suedamerikafans.de") && url.includes(page))), "Pleko uzunluğu iki aday tür için Welsfans kaynağına bağlanmalı");
assert(["fishipedia.fr","scotcat.com"].every((host) => commonPleco?.additionalSourceUrls?.some((url) => url.includes(host))), "Pleko hacmi ve su aralığını belirleyen Fishipedia ve ScotCat kaynaklarına bağlanmalı");
assert(commonPleco?.husbandryCaution?.includes("hacim önerileri farklıdır"), "Pleko hacim önerilerindeki fark kullanıcıya açıklanmalı");
assert(commonPleco?.husbandryCaution?.includes("ortak aralığını"), "Pleko su değerlerinin kaynakların ortak aralığı olduğu kullanıcıya açıklanmalı");
const koiCarp = speciesCatalog.find((item) => item.id === "koi-carp");
assert(koiCarp, "Koi, Japon balığından ayrı bir biyolojik profil taşımalı");
assert.equal(koiCarp.scientificName, "Cyprinus carpio", "Koi doğru bilimsel kimlikle tutulmalı");
assert.equal(koiCarp.minVolumeL, 4500, "Koi için OATA uzman havuzu alt sınırı korunmalı");
assert.equal(koiCarp.minTankLengthCm, 300, "Koi için doğrulanan yaklaşık üç metrelik yüzme alanı korunmalı");
assert.equal(koiCarp.minGroup, 3, "Koi sosyal grup ihtiyacı korunmalı");
assert(koiCarp.speciesOnly && koiCarp.husbandryCaution?.includes("akvaryum değil"), "Koi akvaryum canlısı gibi önerilmemeli");

const cikletistCatfishListings = [
  ["Süper Red Tül Kuyruk Cüce Vatoz", "ancistrus"],
  ["L144 Albino Cüce Vatoz", "ancistrus"],
  ["Otocınclus Profesyonel Yosun Yiyici", "otocinclus"],
  ["Borneo Kelebek Vatoz"],
  ["Sae Yosun Yiyici", "siamese-algae-eater"],
  ["DELHEZİ BİŞHİR", "delhezi-bichir"],
  ["RED TAİL CATFİSH", "redtail-catfish"],
  ["SİYAH CÜCE VATOZ", "ancistrus"],
  ["RED LİP STİCK GOBBY"],
  ["BLUE NEON GOBBY GOBİ"],
  ["HUJETA GAR", "hujeta-gar"],
  ["RED LİZARD ÇÖPÇÜ BALIKLARI", "red-whiptail-catfish"],
  ["SENEGAL BİŞİRLERİ", "senegal-bichir"],
  ["PENGASUS KÖPEK BALIKLARI", "iridescent-shark-catfish"],
  ["ORANGE VENEZUELA ÇÖPÇÜ BALIKLARI", "orange-venezuela-cory"],
  ["SİYAH LABEO BALIKLARI", "black-sharkminnow"],
  ["GREEN LAZER ÇÖPÇÜ BALIKLARI", "green-laser-cory-cw009"],
  ["RABAUTİ CORYDORAS ÇÖPÇÜ BALIKLARI", "rabauts-cory"],
  ["STERBAI ÇÖPÇÜ BALIKLARI", "sterbai-cory"],
  ["JULLY ÇÖPÇÜ BALIKLARI"],
  ["CÜCE OTOCINCLUS AFFİNİS PROFESYONEL YOSUN YİYİCİ", "otocinclus"],
  ["CW027 CORYDORAS", "highfin-spotted-cory-cw027"],
  ["KÜREK BURUN BALIKLARI"],
  ["PANDA GARRARUFA YOSUN YİYİCİ"],
  ["L144 TÜL DAMIZLIK", "ancistrus"],
  ["L-116 Hypostomus Sp", "red-fin-thresher-pleco-l116"],
  ["L-340 Mega Clown Pleco", "mega-clown-pleco-l340"],
  ["L-129 Zebra Pleco", "colombian-zebra-pleco-l129"],
  ["L-243 Peckoltia Sp.", "orange-tiger-pleco-l243"],
  ["L-091 Leporacanthicus Triactis", "three-beacon-pleco-l091"],
  ["L-201 Hypancistrus İnspector", "orinoco-angel-pleco-l201"],
  ["L-240 Vampir Pleco", "vampire-pleco-l240"],
  ["L-052 Pleco Dekeyseria Sp.", "butterfly-pleco-l052"],
  ["L-106 Red Peckoltia", "orange-seam-pleco-l106"],
  ["L-149 Ancistrus Brevifilis", "cucuta-bristlenose-l149"],
  ["LDA-72 Ancistrus Triradiatus", "three-ray-bristlenose-lda72"],
  ["L-128 Blue Phantom", "blue-phantom-pleco-l128"],
  ["L-239 Blue Panaque Pleco", "blue-panaque-l239"],
  ["L-146 Albino Pleco"],
  ["L-148 Total Spotted Pleco", "manacapuru-bristlenose-l148"],
  ["L-190 Royal Pleco", "royal-pleco-l190"],
  ["L-191 Broken Line Royal Pleco", "brokenline-royal-pleco-l191"],
  ["White Spotted Doras", "white-spotted-doras"],
  ["L-069 Peckoltia Ucayalensis"],
  ["L-244 Pseudolithoxus Dumus", "black-spotted-flyer-pleco-l244"],
  ["L-200A Hi-fin Green Phantom Pleco", "high-fin-green-phantom-l200a"],
  ["L-059A Ancistrus Hoplogenys", "blue-spotted-bristlenose-l059a"],
  ["L-235 Flyer Cat", "anthrax-flyer-pleco-l235"],
  ["CÜCE VATOZ SİYAH YAVRU", "ancistrus"],
  ["CÜCE VATOZ L144 TÜL YAVRU", "ancistrus"],
  ["LDA-38 HYPOSTOMUS PLECO", "orinoco-wood-pleco-lda38"],
  ["L-103 CLOWN PLECO", "peckoltia-l103"],
  ["L-127 ZEBRA PLECO", "lujans-pleco-l127"],
  ["L127 ZEBRA FAKE-PECKOLTİA PLECO LUJANİ (7 CM)", "lujans-pleco-l127"],
  ["COLOMBİAN FARLOWELLA"],
  ["L-128 PLECO VATOZ", "blue-phantom-pleco-l128"],
];
assert.equal(cikletistCatfishListings.length, 56, "Cikletist güncel vatoz/kedi balığı kategorisinin üç sayfasındaki 56 başlık denetlenmeli");
for (const [retailName, expectedId] of cikletistCatfishListings) {
  const matched = speciesForLivestock({commonName:retailName,category:"fish",quantity:1});
  if (expectedId) {
    assert.equal(matched?.id, expectedId, `Cikletist vatoz/kedi balığı adı doğru sağlık profiline bağlanmalı: ${retailName}`);
  } else {
    assert.equal(matched, undefined, `Bilimsel kimliği veya güvenli bakım verisi doğrulanmayan mağaza adı tahminle eşleştirilmemeli: ${retailName}`);
  }
}
for (const waterType of ["freshwater", "saltwater", "brackish"]) {
  for (const category of livestockCategories) {
    const expected = speciesCatalog.filter((item) => item.category === category && speciesWaterTypes(item).includes(waterType));
    assert.deepEqual(speciesForCategoryAndWaterType(category, waterType), expected, `${waterType} / ${category} seçicisinde yalnızca uyumlu su türü ve canlı sınıfı gösterilmeli`);
    assert.deepEqual(speciesGroupsForCategoryAndWaterType(category, waterType), [...new Set(expected.map(speciesGroup))], `${waterType} / ${category} grup seçicisine uyumsuz canlı grubu sızmamalı`);
  }
}
for (const [id, scientificName, volume, length, group, temperature, ph] of [
  ["blue-phantom-pleco-l128", "Hemiancistrus sp. L128", 162, 120, 1, [27,30], [6,7.5]],
  ["colombian-zebra-pleco-l129", "Hypancistrus debilittera", 96, 80, 4, [27,31], [6,7.5]],
  ["orinoco-angel-pleco-l201", "Hypancistrus sp. L201", 115, 80, 1, [25,29], [5.8,7]],
  ["blue-panaque-l239", "Baryancistrus beggini", 100, 80, 1, [25,30], [5.5,7.5]],
  ["royal-pleco-l190", "Panaque nigrolineatus", 500, 180, 1, [22,26], [6,8]],
  ["mega-clown-pleco-l340", "Hypancistrus sp. L340", 80, 80, 1, [26,30], [5.5,7.5]],
  ["three-beacon-pleco-l091", "Leporacanthicus triactis", 300, 120, 1, [25,29], [6,7.4]],
  ["vampire-pleco-l240", "Leporacanthicus sp. L240", 375, 150, 1, [25,28], [5.5,7.5]],
  ["butterfly-pleco-l052", "Dekeyseria picta", 150, 80, 1, [25,29], [5.8,7]],
  ["orange-tiger-pleco-l243", "Peckoltia wernekei", 200, 150, 1, [26,30], [5.5,7.5]],
  ["red-fin-thresher-pleco-l116", "Aphanotorulus emarginatus", 246, 150, 1, [25,28], [6.4,7.2]],
  ["three-ray-bristlenose-lda72", "Ancistrus triradiatus", 75, 80, 1, [24,28], [6,7.5]],
  ["cucuta-bristlenose-l149", "Ancistrus sp. L149", 76, 60, 1, [23,28], [6.5,7.8]],
  ["brokenline-royal-pleco-l191", "Panaque sp. L191", 600, 200, 1, [24,29], [6,8]],
  ["black-spotted-flyer-pleco-l244", "Pseudolithoxus dumus", 200, 100, 1, [24,30], [6,7]],
  ["high-fin-green-phantom-l200a", "Baryancistrus demantoides", 180, 120, 1, [25,30], [6,7.5]],
  ["blue-spotted-bristlenose-l059a", "Ancistrus hoplogenys", 80, 100, 1, [26,30], [5.5,7.5]],
  ["anthrax-flyer-pleco-l235", "Pseudolithoxus anthrax", 240, 120, 1, [25,29], [6,7.2]],
  ["lujans-pleco-l127", "Peckoltia lujani", 100, 100, 1, [25,29], [5.5,7.5]],
  ["orange-venezuela-cory", "Osteogaster venezuelanus", 80, 80, 6, [19,25], [6,7]],
  ["green-laser-cory-cw009", "Corydoras sp. CW009", 100, 80, 6, [24,28], [6,7.5]],
  ["rabauts-cory", "Osteogaster rabauti", 80, 90, 6, [20,27], [5.5,7.2]],
  ["highfin-spotted-cory-cw027", "Hoplisoma sp. CW027", 100, 80, 6, [23,28], [5.8,7]],
  ["white-spotted-doras", "Agamyxis pectinifrons", 130, 100, 1, [22,26], [6,7.5]],
  ["orinoco-wood-pleco-lda38", "Hypostomus plecostomoides", 250, 150, 1, [24,29], [6,8]],
  ["hujeta-gar", "Ctenolucius hujeta", 342, 150, 5, [22,25], [5.5,7.5]],
]) {
  const profile = speciesCatalog.find((item) => item.id === id);
  assert(profile, `${id} doğrulanmış canlı kataloğunda bulunmalı`);
  assert.deepEqual(
    [profile.scientificName,profile.minVolumeL,profile.minTankLengthCm,profile.minGroup,profile.temperature,profile.ph],
    [scientificName,volume,length,group,temperature,ph],
    `${id} kaynaklı kimlik, hacim, uzunluk, sosyal yapı ve su değerlerini taşımalı`,
  );
  assert.equal(profile.verifiedAt, "2026-08-28", `${id} güncel doğrulama tarihini taşımalı`);
  assert(profile.husbandryCaution, `${id} kullanıcıya özel bakım riskini açıklamalı`);
}
assert.equal(speciesCatalog.find((item) => item.id === "delhezi-bichir")?.predatory, true, "Delhezi bichir küçük canlılar için avlanma riski taşımalı");
const delheziBichir = speciesCatalog.find((item) => item.id === "delhezi-bichir");
assert.deepEqual(
  [delheziBichir?.scientificName,delheziBichir?.adultSizeCm,delheziBichir?.minVolumeL,delheziBichir?.minTankLengthCm,delheziBichir?.minGroup,delheziBichir?.temperature,delheziBichir?.ph,delheziBichir?.flow],
  ["Polypterus delhezi",44,648,180,1,[25,28],[6,8],"low"],
  "Delhezi bichir bilimsel boyu ile 180 × 60 × 60 cm kaynaklı erişkin alanını taşımalı",
);
assert.equal(delheziBichir?.verifiedAt, "2026-10-02", "Delhezi bichir güncel doğrulama tarihini taşımalı");
assert(delheziBichir?.husbandryCaution?.includes("648 litre") && delheziBichir?.husbandryCaution?.includes("hava boşluğu"), "Delhezi bichir erişkin tabanı ve yüzey havası güvenliğini açıklamalı");
assert(delheziBichir?.additionalSourceUrls?.some((url) => url.includes("fishbase.se")), "Delhezi bichir bilimsel boy için FishBase çapraz kaynağını saklamalı");
assert.equal(speciesCatalog.find((item) => item.id === "hujeta-gar")?.predatory, true, "Hujeta gar küçük canlılar için avlanma riski taşımalı");
assert(speciesCatalog.find((item) => item.id === "royal-pleco-l190")?.husbandryCaution?.includes("yüksek atık"), "Royal Pleco yüksek biyolojik yük uyarısı taşımalı");
assert(speciesCatalog.find((item) => item.id === "orinoco-angel-pleco-l201")?.husbandryCaution?.includes("kesin tür kimliği sayılmamalıdır"), "L201 mağaza adındaki inspector kimliği kesin tür gibi kullanılmamalı");
assert(speciesCatalog.find((item) => item.id === "three-beacon-pleco-l091")?.husbandryCaution?.includes("yüksek biyolojik yük"), "L091 yüksek biyolojik yük uyarısı taşımalı");
assert(speciesCatalog.find((item) => item.id === "vampire-pleco-l240")?.husbandryCaution?.includes("kesin tür adı varsayılmamalıdır"), "L240 bilimsel kimliği kaynakların verdiğinden daha kesin gösterilmemeli");
assert(speciesCatalog.find((item) => item.id === "butterfly-pleco-l052")?.husbandryCaution?.includes("Rengini"), "L052 renk değişimi kullanıcıya açıklanmalı");
assert(speciesCatalog.find((item) => item.id === "orange-tiger-pleco-l243")?.husbandryCaution?.includes("eski kaynaklarda"), "L243 tarihsel cins adı farkı kullanıcıya açıklanmalı");
assert(speciesCatalog.find((item) => item.id === "red-fin-thresher-pleco-l116")?.husbandryCaution?.includes("yüksek atığa"), "L116 iri erişkin boyu ve atık riski kullanıcıya açıklanmalı");
assert(speciesCatalog.find((item) => item.id === "cucuta-bristlenose-l149")?.husbandryCaution?.includes("kesin tür kimliği sayılmamalıdır"), "L149 mağaza başlığındaki brevifilis kimliği kesin tür gibi kullanılmamalı");
assert(speciesCatalog.find((item) => item.id === "brokenline-royal-pleco-l191")?.husbandryCaution?.includes("Çok yüksek atık"), "L191 yüksek biyolojik yük uyarısı taşımalı");
assert(speciesCatalog.find((item) => item.id === "black-spotted-flyer-pleco-l244")?.husbandryCaution?.includes("Düşük oksijenli"), "L244 yüksek oksijen gereksinimini açıklamalı");
assert(speciesCatalog.find((item) => item.id === "high-fin-green-phantom-l200a")?.husbandryCaution?.includes("standart L200"), "L200A standart L200 ile aynı tür gibi gösterilmemeli");
assert(speciesCatalog.find((item) => item.id === "blue-spotted-bristlenose-l059a")?.husbandryCaution?.includes("tutarlı kullanılmadığından"), "L059A ticari ekinin kimlik belirsizliği açıklanmalı");
assert(speciesCatalog.find((item) => item.id === "anthrax-flyer-pleco-l235")?.husbandryCaution?.includes("çok yüksek oksijen"), "L235 yüksek oksijen ve akıntı gereksinimini açıklamalı");
assert(speciesCatalog.find((item) => item.id === "lujans-pleco-l127")?.husbandryCaution?.includes("Hypancistrus zebra"), "L127 mağaza adındaki zebra ifadesi gerçek Zebra vatozla karıştırılmamalı");
assert(speciesCatalog.find((item) => item.id === "orange-venezuela-cory")?.husbandryCaution?.includes("taksonomisi"), "Orange Venezuela Cory taksonomi belirsizliğini açıklamalı");
assert(speciesCatalog.find((item) => item.id === "green-laser-cory-cw009")?.husbandryCaution?.includes("kesin bilimsel tür adı"), "CW009 henüz tanımlanmamış kimliğini kesin tür gibi göstermemeli");
assert(speciesCatalog.find((item) => item.id === "rabauts-cory")?.husbandryCaution?.includes("ince kum"), "Rabauti Cory hassas bıyık ve taban gereksinimini açıklamalı");
assert(speciesCatalog.find((item) => item.id === "highfin-spotted-cory-cw027")?.husbandryCaution?.includes("henüz bilimsel olarak tanımlanmamış"), "CW027 geçici katalog kimliği kesin tür gibi gösterilmemeli");
assert(speciesCatalog.find((item) => item.id === "white-spotted-doras")?.husbandryCaution?.includes("ağa takılabilir"), "White Spotted Doras yüzgeç dikeni taşıma riskini açıklamalı");
assert.equal(speciesCatalog.find((item) => item.id === "white-spotted-doras")?.predatory, true, "White Spotted Doras çok küçük canlılar için avlanma riski taşımalı");
assert(speciesCatalog.find((item) => item.id === "orinoco-wood-pleco-lda38")?.husbandryCaution?.includes("çok yüksek miktarda atık"), "LDA38 odun tüketimi ve yüksek biyolojik yük uyarısını taşımalı");
assert.equal(speciesForLivestock({commonName:"L-069 Peckoltia Ucayalensis",category:"fish",quantity:1}), undefined, "L069 ile Peckoltia ucayalensis arasındaki kimlik çelişkisi çözülmeden mağaza adı profile bağlanmamalı");
assert.equal(speciesForLivestock({commonName:"L-146 Albino Pleco",category:"fish",quantity:1}), undefined, "L146 ile albino satış adı arasındaki kimlik çelişkisi çözülmeden mağaza adı profile bağlanmamalı");
for (const [id, scientificName, sourcePath, adultSizeCm, verifiedAt] of [
  ["bola-pleco-l146", "Peckoltichthys cf. bachi", "art=236", 15, "2026-09-08"],
  ["ucayali-flathead-pleco", "Peckoltia bachi", "Peckoltia-ucayalensis", 14, "2026-09-20"],
]) {
  const profile = speciesCatalog.find((item) => item.id === id);
  assert(profile, `${id} kesin bilimsel/L-numarası profili katalogda bulunmalı`);
  assert.deepEqual(
    [profile.scientificName,profile.adultSizeCm,profile.minVolumeL,profile.minTankLengthCm,profile.temperature,profile.ph],
    [scientificName,adultSizeCm,120,100,[25,29],[6,8]],
    `${id} uzman kaynaktaki kimlik ve bakım eşiklerini taşımalı`,
  );
  assert(profile.sourceUrl?.includes(sourcePath), `${id} doğrudan uzman tür kaynağına bağlanmalı`);
  assert.equal(profile.verifiedAt, verifiedAt, `${id} güncel doğrulama tarihini taşımalı`);
  assert(profile.husbandryCaution?.includes("otomatik bağlanmaz"), `${id} belirsiz mağaza adıyla neden otomatik eşleşmediğini açıklamalı`);
}
const ucayaliFlathead = speciesCatalog.find((item) => item.id === "ucayali-flathead-pleco");
assert.deepEqual([ucayaliFlathead?.adultSizeCm, ucayaliFlathead?.verifiedAt], [14, "2026-09-20"], "Peckoltia bachi güncel FishBase boyu ve doğrulama tarihini taşımalı");
assert(ucayaliFlathead?.aliases?.includes("Peckoltia ucayalensis") && ucayaliFlathead?.husbandryCaution?.includes("genç eş anlamlısı"), "Eski Peckoltia ucayalensis adı aranabilir kalmalı ve güncel eş anlamlılık açıklanmalı");
const l069Unresolved = unresolvedSpeciesListings.find((item) => item.name === "L-069 Peckoltia Ucayalensis");
assert(l069Unresolved?.reason.includes("Ancistrini sp.") && l069Unresolved.reason.includes("L146/L232/LDA30") && l069Unresolved.verifiedAt === "2026-09-20", "L069 ile Peckoltia bachi/L146 kimlik çelişkisi güncel kaynaklarla görünür kalmalı");
assert.equal(speciesForCatalogSearch("L146", "fish", "freshwater")?.id, "bola-pleco-l146", "Kesin L146 araması doğrulanmış Bola vatoz profilini bulmalı");
assert.equal(speciesForCatalogSearch("Peckoltichthys ucayalensis", "fish", "freshwater")?.id, "ucayali-flathead-pleco", "Kesin Peckoltichthys ucayalensis araması doğru profili bulmalı");
for (const [id, scientificName, volume, length, temperature, ph, sourcePath] of [
  ["peckoltia-l103", "Peckoltia sp. L103", 112, 80, [25,29], [5.5,7.5], "art=191"],
  ["manacapuru-bristlenose-l148", "Ancistrus sp. L148", 120, 100, [25,29], [5,7], "art=233"],
]) {
  const profile = speciesCatalog.find((item) => item.id === id);
  assert(profile, `${id} doğrulanmış L-numarası profili katalogda bulunmalı`);
  assert.deepEqual(
    [profile.scientificName,profile.minVolumeL,profile.minTankLengthCm,profile.temperature,profile.ph],
    [scientificName,volume,length,temperature,ph],
    `${id} uzman kaynaktaki kimlik ve bakım eşiklerini taşımalı`,
  );
  assert(profile.sourceUrl?.includes(sourcePath), `${id} doğrudan uzman L-numarası kaynağına bağlanmalı`);
  assert.equal(profile.verifiedAt, "2026-09-01", `${id} güncel doğrulama tarihini taşımalı`);
  assert(profile.husbandryCaution, `${id} ticari ad ve bakım riskini kullanıcıya açıklamalı`);
}
assert(speciesCatalog.find((item) => item.id === "peckoltia-l103")?.husbandryCaution?.includes("Panaqolus maccus"), "L103 palyaço vatoz ticari adı Panaqolus maccus kimliği gibi gösterilmemeli");
assert(speciesCatalog.find((item) => item.id === "manacapuru-bristlenose-l148")?.husbandryCaution?.includes("L445"), "L148'in tarihsel çift numara kullanımı kullanıcıya açıklanmalı");

const unresolvedCatfishNames = cikletistCatfishListings.filter(([, expectedId]) => !expectedId).map(([name]) => name);
const unresolvedCatfishSafetyListings = unresolvedSpeciesListings.filter((item) => unresolvedCatfishNames.includes(item.name));
assert.equal(unresolvedSpeciesListings.length, 68, "Bilimsel kimliği, sucul bakım eşiği veya paludaryum modeli doğrulanamayan altmış sekiz benzersiz Cikletist satış adı görünür güvenlik listesinde tutulmalı");
assert.equal(new Set(unresolvedSpeciesListings.map((item) => item.name)).size, unresolvedSpeciesListings.length, "Çözülmemiş canlı adları benzersiz olmalı");
assert.deepEqual(
  [...unresolvedCatfishSafetyListings.map((item) => item.name)].sort((a, b) => a.localeCompare(b, "tr")),
  [...unresolvedCatfishNames].sort((a, b) => a.localeCompare(b, "tr")),
  "Cikletist regresyonundaki her çözülmemiş vatoz/kedi balığı adı kullanıcıya açıklanan güvenlik listesinde bulunmalı",
);
for (const listing of unresolvedSpeciesListings) {
  assert(["fish", "shrimp", "snail", "other"].includes(listing.category), `${listing.name} geçerli ana canlı sınıfında tutulmalı`);
  assert(listing.sourceUrl.startsWith("https://www.cikletistpetshop.com/"), `${listing.name} doğrudan satış adı kaynağına bağlanmalı`);
  assert(listing.additionalSourceUrls.length > 0 && listing.additionalSourceUrls.every((url) => url.startsWith("https://")), `${listing.name} kimlik belirsizliğini açıklayan HTTPS uzman kaynaklarına bağlanmalı`);
  assert(/^\d{4}-\d{2}-\d{2}$/.test(listing.verifiedAt), `${listing.name} YYYY-MM-DD biçiminde doğrulama tarihi taşımalı`);
  assert(listing.reason.length >= 80, `${listing.name} kullanıcıya neden eşlenmediğini anlaşılır biçimde açıklamalı`);
  assert.equal(speciesForLivestock({ commonName: listing.name, category: listing.category, quantity: 1 }), undefined, `${listing.name} güvenlik listesinde görünse de yanlış bakım profiline bağlanmamalı`);
}
const unresolvedRedLipstickGoby = unresolvedSpeciesListings.find((item) => item.name === "RED LİP STİCK GOBBY");
assert.equal(unresolvedRedLipstickGoby?.verifiedAt, "2026-09-09", "Red Lipstick Goby güncel kimlik ve koruma çatışması denetim tarihini taşımalı");
assert(unresolvedRedLipstickGoby?.reason.includes("Sicyopus exallisquamulus") && unresolvedRedLipstickGoby.reason.includes("S. rubicundus") && unresolvedRedLipstickGoby.reason.includes("S. jonklaasi"), "Red Lipstick Goby çelişen üç ticari kimliği kullanıcıya açıklamalı");
assert(unresolvedRedLipstickGoby?.additionalSourceUrls.some((url) => url.includes("publications.gc.ca")), "Red Lipstick Goby devlet ticaret envanteriyle çapraz doğrulanmalı");
assert(unresolvedRedLipstickGoby?.additionalSourceUrls.some((url) => url.includes("seriouslyfish.com/species/sicyopus-exallisquamulus")), "Red Lipstick Goby kesin Sicyopus exallisquamulus bakım profiline bağlanmalı");
assert(unresolvedRedLipstickGoby?.additionalSourceUrls.some((url) => url.includes("b-aqua.com/pages/fiche.aspx?id=7455")), "Red Lipstick Goby Sicyopus jonklaasi bakım ve koruma kaynağına bağlanmalı");
const unresolvedYellowFlagtail = unresolvedSpeciesListings.find((item) => item.name === "YELLOW FLAGTAİL");
assert(unresolvedYellowFlagtail?.reason.includes("Semaprochilodus kneri") && unresolvedYellowFlagtail.reason.includes("S. taeniurus") && unresolvedYellowFlagtail.reason.includes("S. insignis"), "Yellow Flagtail birbirinden farklı üç tatlı su kimliğiyle karışma riskini açıklamalı");
assert((unresolvedYellowFlagtail?.additionalSourceUrls.length || 0) >= 4, "Yellow Flagtail satış adı üç ayrı Semaprochilodus kimliği ve ortak ad kaynağıyla denetlenmeli");
const knersYellowFlagtail = speciesForLivestock({ commonName: "Kner'in sarı kuyruklu prochilodusu", scientificName: "Semaprochilodus kneri", category: "fish", quantity: 1 });
assert.deepEqual([knersYellowFlagtail?.id, knersYellowFlagtail?.adultSizeCm, knersYellowFlagtail?.minVolumeL, knersYellowFlagtail?.minTankLengthCm, knersYellowFlagtail?.minGroup, knersYellowFlagtail?.temperature, knersYellowFlagtail?.ph, knersYellowFlagtail?.flow], ["kners-yellow-flagtail", 28, 500, 200, 1, [24, 28], [6.5, 7.2], "high"], "Kesin Semaprochilodus kneri kaynaklı boy, akvaryum ve su eşiklerini taşımalı");
assert(knersYellowFlagtail?.husbandryCaution?.includes("500 litre") && knersYellowFlagtail?.husbandryCaution?.includes("200 cm"), "Semaprochilodus kneri koruyucu hacim ve yüzme cephesi gereksinimini açıklamalı");
assert(knersYellowFlagtail?.communityCaution?.includes("asgari grup sayısı") && knersYellowFlagtail?.communityCaution?.includes("tahmin edilmedi"), "Semaprochilodus kneri için yayımlanmayan kesin grup sayısı uydurulmamalı");
assert(knersYellowFlagtail?.sourceUrl?.includes("aquaristatlas.com/piranhas/semaprochilodus-kneri"), "Semaprochilodus kneri ayrıntılı tür bakım kaynağına bağlanmalı");
assert(knersYellowFlagtail?.additionalSourceUrls?.some((url) => url.includes("fishbase.se/summary/Semaprochilodus-kneri")), "Semaprochilodus kneri bilimsel kimlik ve boy kaynağına bağlanmalı");
assert.equal(speciesForCatalogExactSearch("Semaprochilodus kneri", "fish", "freshwater")?.id, "kners-yellow-flagtail", "Kesin Semaprochilodus kneri bilimsel adı doğru profili bulmalı");
assert.equal(speciesForCatalogExactSearch("YELLOW FLAGTAİL", "fish", "freshwater"), undefined, "Belirsiz Yellow Flagtail ticari adı kesin Semaprochilodus kneri profiline dönüşmemeli");
const insignisFlagtail = speciesForLivestock({ commonName: "Insignis flagtail prochilodus", scientificName: "Semaprochilodus insignis", category: "fish", quantity: 5 });
assert.deepEqual([insignisFlagtail?.id, insignisFlagtail?.adultSizeCm, insignisFlagtail?.minVolumeL, insignisFlagtail?.minTankLengthCm, insignisFlagtail?.minGroup, insignisFlagtail?.temperature, insignisFlagtail?.ph, insignisFlagtail?.flow], ["insignis-flagtail-prochilodus", 35, 1500, undefined, 5, [18, 29], [5.5, 7.2], "high"], "Kesin Semaprochilodus insignis koruyucu sürü, hacim ve su eşiklerini taşımalı; grup cephesi tahmin edilmemeli");
assert(insignisFlagtail?.communityCaution?.includes("beş") && insignisFlagtail?.communityCaution?.includes("strese"), "Semaprochilodus insignis yalnız bırakılma ve asgari sürü riskini açıklamalı");
assert(insignisFlagtail?.husbandryCaution?.includes("1.500 litre") && insignisFlagtail?.husbandryCaution?.includes("10–20 kat"), "Semaprochilodus insignis kaynaklı sürü hacmi ve akıntı gereksinimini açıklamalı");
assert(insignisFlagtail?.tankLengthDataNote?.includes("uzunluk tahmin edilmedi"), "Semaprochilodus insignis için yayımlanmayan grup akvaryumu cephesi uydurulmamalı");
assert(insignisFlagtail?.sourceUrl?.includes("fishipedia.fr/fr/poissons/semaprochilodus-insignis"), "Semaprochilodus insignis koruyucu grup bakım kaynağına bağlanmalı");
assert(insignisFlagtail?.additionalSourceUrls?.some((url) => url.includes("fishbase.se/summary/Semaprochilodus-insignis")), "Semaprochilodus insignis bilimsel kimlik ve boy kaynağına bağlanmalı");
assert.equal(speciesForCatalogExactSearch("Semaprochilodus insignis", "fish", "freshwater")?.id, "insignis-flagtail-prochilodus", "Kesin Semaprochilodus insignis bilimsel adı doğru profile bağlanmalı");
const silverFlagtail = speciesForLivestock({ commonName: "Gümüş flagtail prochilodus", scientificName: "Semaprochilodus taeniurus", category: "fish", quantity: 1 });
assert.deepEqual([silverFlagtail?.id, silverFlagtail?.adultSizeCm, silverFlagtail?.minVolumeL, silverFlagtail?.minTankLengthCm, silverFlagtail?.minGroup, silverFlagtail?.temperature, silverFlagtail?.ph, silverFlagtail?.flow], ["silver-flagtail-prochilodus", 30, 540, 150, 1, [23, 29], [5.5, 7.5], "high"], "Kesin Semaprochilodus taeniurus tek birey için kaynaklı boy, akvaryum ve su eşiklerini taşımalı");
assert(silverFlagtail?.communityCaution?.includes("iki ile beş") && silverFlagtail?.communityCaution?.includes("altılı"), "Semaprochilodus taeniurus küçük grup saldırganlığı ile güvenli sürü düzenini açıklamalı");
assert(silverFlagtail?.husbandryCaution?.includes("540 litre") && silverFlagtail?.husbandryCaution?.includes("150 × 60 cm"), "Semaprochilodus taeniurus kaynaklı tek-birey tabanını açıklamalı");
assert(silverFlagtail?.sourceUrl?.includes("seriouslyfish.com/species/semaprochilodus-taeniurus"), "Semaprochilodus taeniurus ayrıntılı uzman bakım kaynağına bağlanmalı");
assert(silverFlagtail?.additionalSourceUrls?.some((url) => url.includes("fishbase.se/summary/Semaprochilodus-taeniurus")), "Semaprochilodus taeniurus bilimsel kimlik ve boy kaynağına bağlanmalı");
assert.equal(speciesForCatalogExactSearch("Semaprochilodus taeniurus", "fish", "freshwater")?.id, "silver-flagtail-prochilodus", "Kesin Semaprochilodus taeniurus bilimsel adı doğru profile bağlanmalı");
assert.notEqual(silverFlagtail?.id, insignisFlagtail?.id, "Semaprochilodus taeniurus ve S. insignis tek profil gibi gösterilmemeli");
const texasCichlid = speciesForLivestock({ commonName: "Texas ciklet", scientificName: "Herichthys cyanoguttatus", category: "fish", quantity: 1 });
assert.deepEqual([texasCichlid?.id, texasCichlid?.adultSizeCm, texasCichlid?.minVolumeL, texasCichlid?.minTankLengthCm, texasCichlid?.minGroup, texasCichlid?.temperature, texasCichlid?.ph], ["texas-cichlid", 30, 255, 120, 1, [20, 28], [6, 7.5]], "Herichthys cyanoguttatus kaynaklı tek-birey boy, akvaryum ve su eşiklerini taşımalı");
assert(texasCichlid?.sourceUrl?.includes("seriouslyfish.com/species/herichthys-cyanoguttatus"), "Herichthys cyanoguttatus ayrıntılı uzman bakım kaynağına bağlanmalı");
assert.equal(texasCichlid?.speciesOnly, true, "Herichthys cyanoguttatus sıradan topluluk balığı gibi sunulmamalı");
const pearlscaleCichlid = speciesForLivestock({ commonName: "İnci pullu carpintis ciklet", scientificName: "Herichthys carpintis", category: "fish", quantity: 2 });
assert.deepEqual([pearlscaleCichlid?.id, pearlscaleCichlid?.adultSizeCm, pearlscaleCichlid?.minVolumeL, pearlscaleCichlid?.minTankLengthCm, pearlscaleCichlid?.minGroup, pearlscaleCichlid?.temperature, pearlscaleCichlid?.ph], ["pearlscale-cichlid", 30.5, 400, 150, 2, [24, 25], [7, 7.5]], "Herichthys carpintis kaynaklı çift, hacim, cephe ve su eşiklerini taşımalı");
assert.equal(pearlscaleCichlid?.predatory, true, "Herichthys carpintis küçük canlılar için avlanma riskini taşımalı");
assert.equal(pearlscaleCichlid?.speciesOnly, true, "Herichthys carpintis genel topluluk balığı olarak önerilmemeli");
assert(pearlscaleCichlid?.sourceUrl?.includes("cichlidamerique.fr/blog/herichthys-carpintis"), "Herichthys carpintis ayrıntılı tür bakım kaynağına bağlanmalı");
assert.equal(speciesForCatalogExactSearch("Herichthys carpintis", "fish", "freshwater")?.id, "pearlscale-cichlid", "Kesin Herichthys carpintis bilimsel adı doğru profile bağlanmalı");
assert.equal(speciesForCatalogExactSearch("GREEN TEXAS CİKLET BALIKLARI", "fish", "freshwater"), undefined, "Belirsiz Green Texas satış adı iki Herichthys türünden birine zorla bağlanmamalı");
for (const listing of unresolvedCatfishSafetyListings) {
  assert.equal(unresolvedSpeciesForSearch(listing.name, listing.category, "freshwater")?.name, listing.name, `${listing.name} tatlı su canlı aramasında bulunmalı`);
  assert.equal(unresolvedSpeciesForSearch(listing.name, listing.category, "saltwater"), undefined, `${listing.name} uyumsuz deniz akvaryumu aramasında görünmemeli`);
}
assert.equal(unresolvedSpeciesForSearch("blue neon goby", "fish", "freshwater")?.name, "BLUE NEON GOBBY GOBİ", "Yazım varyantı çözülmemiş Blue Neon Goby kaydını bulmalı");
assert.equal(unresolvedSpeciesForSearch("colombian farlowella", "fish", "freshwater")?.name, "COLOMBİAN FARLOWELLA", "Türkçe karakter içermeyen arama Colombian Farlowella kaydını bulmalı");
assert.equal(unresolvedSpeciesForSearch("albino sky", "fish", "freshwater")?.name, "ALBİNO SKY BLUE", "Belirsiz Albino Sky Blue adı canlı doğuran aramasında açıklamalı görünmeli");
assert.equal(unresolvedSpeciesForSearch("albino sky", "fish", "saltwater"), undefined, "Belirsiz Albino Sky Blue deniz akvaryumu aramasında görünmemeli");
const unresolvedAlbinoSkyBlue = unresolvedSpeciesForSearch("albino sky", "fish", "freshwater");
assert.equal(unresolvedAlbinoSkyBlue?.verifiedAt, "2026-09-23", "Albino Sky Blue doğrudan satış sayfası yeniden denetim tarihini taşımalı");
assert(unresolvedAlbinoSkyBlue?.reason.includes("canlı-256") && unresolvedAlbinoSkyBlue.reason.includes("temsili"), "Albino Sky Blue barkodu ve temsili görsel sınırı kullanıcıya açıklanmalı");
assert(unresolvedAlbinoSkyBlue?.reason.includes("tür, bilimsel ad") && unresolvedAlbinoSkyBlue.reason.includes("lepistes ya da moli"), "Albino Sky Blue için bilimsel kimlik olmadan canlı doğuran türü tahmin edilmemeli");
assert.equal(unresolvedSpeciesForSearch("meyan kökü", "fish", "freshwater")?.name, "MEYAN KÖKÜ GURAMİ", "Belirsiz Meyan Kökü Gurami adı labirentli aramasında açıklamalı görünmeli");
assert.equal(unresolvedSpeciesForSearch("licorice gourami", "fish", "freshwater")?.name, "MEYAN KÖKÜ GURAMİ", "İngilizce ticari ad çözülmemiş Meyan Kökü Gurami kaydını bulmalı");
assert.equal(unresolvedSpeciesForSearch("meyan kökü", "fish", "saltwater"), undefined, "Belirsiz Meyan Kökü Gurami deniz akvaryumu aramasında görünmemeli");
assert.equal(unresolvedSpeciesForSearch("gurami", "fish", "freshwater")?.name, "Gurami", "Tam genel Gurami satış adı daha uzun kısmi eşleşmeden önce kendi güvenlik kaydını bulmalı");
assert.equal(unresolvedSpeciesForSearch("gourami", "fish", "freshwater")?.name, "Gurami", "İngilizce genel ad kendi çözülmemiş Gurami kaydını bulmalı");
assert.equal(unresolvedSpeciesListings.find((item) => item.name === "Gurami")?.group, "labyrinth", "Tür belirtmeyen Gurami kaydı doğru canlı grubunda tutulmalı");
assert.equal(unresolvedSpeciesForSearch("gurami balığı", "fish", "freshwater")?.name, "Gurami", "Genel Gurami satış adı kendi açıklamalı güvenlik kaydıyla aranabilmeli");
assert.equal(unresolvedSpeciesForSearch("gurami balığı", "fish", "saltwater"), undefined, "Genel Gurami kaydı deniz akvaryumu aramasında görünmemeli");
assert.equal(speciesForCatalogSearch("L-103 clown", "fish", "freshwater")?.id, "peckoltia-l103", "Kategori geneli arama seçili grup dışında kalan doğrulanmış türü bulmalı");
assert.equal(speciesGroup(speciesForCatalogSearch("L-103 clown", "fish", "freshwater")), "bottom", "Kategori geneli arama bulunan türün doğru grubuna geçebilmeli");
assert.equal(speciesForCatalogSearch("L-103 clown", "fish", "saltwater"), undefined, "Kategori geneli arama akvaryum su türüne uymayan canlıyı göstermemeli");

const cikletistSnakeAndEelListings = [
  ["CHANNA MARULİODES", "emperor-snakehead"],
  ["ZİGZAK TARAK BALIKLARI"],
  ["GOLDEN SNAKEHEAD STEWARTİİ CHANNA", "assamese-snakehead"],
  ["CHANNA KIRMIZI YILANBAŞ MİCROPELTES", "giant-snakehead"],
  ["CHANNA ORNA YELLOW LİPS", "ornate-snakehead"],
  ["CHANNA ANDRO", "andrao-snakehead"],
  ["CHANNA GOLDEN LİMBATA"],
  ["HALF BANDED SPINY EEL", "half-banded-spiny-eel"],
  ["WHITE CHECK EEL MÜREN"],
  ["CHANNA BLEHERİ", "rainbow-snakehead"],
  ["CHANNA PULCHRA KOBALT MAVİ YILANBAŞ", "peacock-snakehead"],
  ["CHANNA ASIATICA GÖKKUŞAĞI YILANBAŞ BLEHERİ"],
];
assert.equal(cikletistSnakeAndEelListings.length, 12, "Cikletist güncel yılan ve müren kategorisindeki 12 başlık denetlenmeli");
for (const [retailName, expectedId] of cikletistSnakeAndEelListings) {
  const matched = speciesForLivestock({commonName:retailName,category:"fish",quantity:1});
  if (expectedId) {
    assert.equal(matched?.id, expectedId, `Cikletist yılanbaş adı doğru sağlık profiline bağlanmalı: ${retailName}`);
  } else {
    assert.equal(matched, undefined, `Bilimsel kimliği veya zorunlu bakım eşiği doğrulanmayan yılan/müren adı tahminle eşleştirilmemeli: ${retailName}`);
  }
}
const unresolvedSnakeAndEelNames = cikletistSnakeAndEelListings.filter(([, expectedId]) => !expectedId).map(([name]) => name);
const unresolvedSnakeAndEelSafetyListings = unresolvedSpeciesListings.filter((item) => unresolvedSnakeAndEelNames.includes(item.name));
assert.equal(unresolvedSnakeAndEelSafetyListings.length, 4, "Kimliği veya zorunlu bakım eşikleri doğrulanamayan dört yılan/müren adı görünür güvenlik listesinde tutulmalı");
assert.deepEqual(
  [...unresolvedSnakeAndEelSafetyListings.map((item) => item.name)].sort((a, b) => a.localeCompare(b, "tr")),
  [...unresolvedSnakeAndEelNames].sort((a, b) => a.localeCompare(b, "tr")),
  "Cikletist regresyonundaki her çözülmemiş yılan/müren adı kullanıcıya açıklanan güvenlik listesinde bulunmalı",
);
for (const listing of unresolvedSnakeAndEelSafetyListings) {
  assert.equal(listing.group, "monster", `${listing.name} doğru Monster grubunda tutulmalı`);
  assert.equal(unresolvedSpeciesForSearch(listing.name, "fish", "freshwater")?.name, listing.name, `${listing.name} tatlı su canlı aramasında bulunmalı`);
  if (listing.name === "WHITE CHECK EEL MÜREN") {
    assert.equal(unresolvedSpeciesForSearch("white cheek eel", "fish", "brackish")?.name, listing.name, "Belirsiz White Check/White Cheek adı acı su aramasında güvenlik uyarısıyla bulunmalı");
    assert.equal(unresolvedSpeciesForSearch("white cheek moray", "fish", "saltwater")?.name, listing.name, "Belirsiz White Check/White Cheek adı deniz suyu aramasında güvenlik uyarısıyla bulunmalı");
  } else {
    assert.equal(unresolvedSpeciesForSearch(listing.name, "fish", "saltwater"), undefined, `${listing.name} uyumsuz deniz akvaryumu aramasında görünmemeli`);
  }
}
assert.equal(unresolvedSpeciesForSearch("zig-zag eel", "fish", "freshwater")?.name, "ZİGZAK TARAK BALIKLARI", "İngilizce yazım varyantı çözülmemiş Zigzag kaydını bulmalı");
assert.equal(unresolvedSpeciesForSearch("golden limbata", "fish", "freshwater")?.name, "CHANNA GOLDEN LİMBATA", "Kısaltılmış satış adı çözülmemiş Golden Limbata kaydını bulmalı");
for (const [id, scientificName, size, volume, length, group, temperature, ph, sourceDomain] of [
  ["andrao-snakehead", "Channa andrao", 10, 72, 80, 1, [12,26], [6,7], "seriouslyfish.com"],
  ["assamese-snakehead", "Channa stewartii", 25, 300, 120, 1, [18,25], [6,7], "fishipedia.it"],
  ["ornate-snakehead", "Channa ornatipinnis", 30, 300, 120, 1, [18,25], [6,7], "fishipedia.es"],
  ["rainbow-snakehead", "Channa bleheri", 20, 150, 100, 2, [15,28], [6,7.5], "aquarium-dietzenbach.de"],
  ["peacock-snakehead", "Channa pulchra", 25, 200, 100, 1, [20,25], [6,7], "practicalfishkeeping.co.uk"],
  ["emperor-snakehead", "Channa marulioides", 65, 1000, 200, 1, [20,25], [4,6], "fishi-pedia.com"],
  ["half-banded-spiny-eel", "Macrognathus circumcinctus", 20, 215, 90, 1, [24,27], [6,7.5], "tankbud.com"],
]) {
  const profile = speciesCatalog.find((item) => item.id === id);
  assert(profile, `${id} doğrulanmış yılanbaş kataloğunda bulunmalı`);
  assert.deepEqual(
    [profile.scientificName,profile.adultSizeCm,profile.minVolumeL,profile.minTankLengthCm,profile.minGroup,profile.temperature,profile.ph],
    [scientificName,size,volume,length,group,temperature,ph],
    `${id} kaynaklı kimlik, yetişkin boyu, akvaryum, sosyal yapı ve su değerlerini taşımalı`,
  );
  assert.equal(profile.verifiedAt, "2026-08-28", `${id} güncel doğrulama tarihini taşımalı`);
  assert(profile.sourceUrl?.includes(sourceDomain), `${id} yerel mağaza açıklaması yerine güvenilir uzman kaynağına bağlanmalı`);
  assert.equal(profile.predatory, true, `${id} küçük canlılar için avcılık güvenlik uyarısını taşımalı`);
  if (id !== "half-banded-spiny-eel") {
    assert.equal(profile.speciesOnly, true, `${id} yılanbaş tür akvaryumu güvenlik uyarısını taşımalı`);
  }
  assert(profile.husbandryCaution?.includes("kapak"), `${id} kaçış ve atmosferik hava güvenliğini açıklamalı`);
}
for (const id of ["emperor-snakehead", "giant-snakehead", "half-banded-spiny-eel"]) {
  const profile = speciesCatalog.find((item) => item.id === id);
  assert((profile?.additionalSourceUrls?.length || 0) >= 2, `${id} bilimsel ve uzman ek doğrulama kaynaklarını saklamalı`);
  assert(profile?.additionalSourceUrls?.every((url) => url.startsWith("https://")), `${id} ek doğrulama kaynakları HTTPS olmalı`);
}
const giantSnakehead = speciesCatalog.find((item) => item.id === "giant-snakehead");
assert.deepEqual(
  [giantSnakehead?.scientificName,giantSnakehead?.adultSizeCm,giantSnakehead?.minVolumeL,giantSnakehead?.minTankLengthCm,giantSnakehead?.minGroup,giantSnakehead?.temperature,giantSnakehead?.ph,giantSnakehead?.flow],
  ["Channa micropeltes",130,6000,400,1,[20,30],[6,8],"low"],
  "Dev yılanbaş yalnız kaynaklı bilimsel boyu, uzman tesis eşiğini ve su aralığını taşımalı",
);
assert.equal(giantSnakehead?.verifiedAt, "2026-10-02", "Dev yılanbaş güncel doğrulama tarihini taşımalı");
assert(giantSnakehead?.sourceUrl?.includes("seriouslyfish.com"), "Dev yılanbaş ana bakım kaynağı olarak tür uzmanı profiline bağlanmalı");
assert(giantSnakehead?.husbandryCaution?.includes("sayısal taban yayımlamayıp") && giantSnakehead?.husbandryCaution?.includes("memeli/kanatlı eti"), "Dev yılanbaş kaynak sınırını ve beslenme güvenliğini açıklamalı");
assert.equal(speciesForLivestock({commonName:"ZİGZAG EEL",category:"fish",quantity:1}), undefined, "Belirsiz Zigzag eel ticari adı bilimsel kimlik olmadan Half-banded profile bağlanmamalı");
assert.equal(speciesCatalog.filter((item) => speciesGroup(item) === "monster").length, 39, "Büyük tür kataloğu ayrı Sorubim lima ve iki Pseudoplatystoma profili dahil 39 doğrulanmış profile ulaşmalı");
for (const [id, scientificName, minVolumeL, minTankLengthCm] of [
  ["iridescent-shark-catfish", "Pangasianodon hypophthalmus", 14580, 450],
  ["black-sharkminnow", "Labeo chrysophekadion", 2500, 360],
]) {
  const profile = speciesCatalog.find((item) => item.id === id);
  assert(profile, `${id} güvenli dev balık profilinde bulunmalı`);
  assert.equal(profile.scientificName, scientificName, `${id} doğrulanmış bilimsel kimliği taşımalı`);
  assert.equal(profile.minVolumeL, minVolumeL, `${id} yayımlanmış koruyucu hacim eşiğini taşımalı`);
  assert.equal(profile.minTankLengthCm, minTankLengthCm, `${id} yayımlanmış uzunluk eşiğini taşımalı`);
  assert.equal(profile.speciesOnly, true, `${id} standart topluluk akvaryumundan dışlanmalı`);
  assert.equal(profile.verifiedAt, "2026-10-02", `${id} güncel doğrulama tarihini taşımalı`);
  assert(profile.sourceUrl?.includes("fishbase"), `${id} bilimsel ana kaynağa bağlanmalı`);
  assert((profile.additionalSourceUrls?.length || 0) >= 2, `${id} kurumsal veya uzman ek kaynaklarla doğrulanmalı`);
  assert(/ev akvaryum/i.test(profile.husbandryCaution || ""), `${id} ev akvaryumu uygunluk riskini açıkça anlatmalı`);
}
const clownKnifefish = speciesCatalog.find((item) => item.id === "clown-knifefish");
assert.deepEqual(
  [clownKnifefish?.scientificName, clownKnifefish?.adultSizeCm, clownKnifefish?.minVolumeL, clownKnifefish?.minTankLengthCm, clownKnifefish?.temperature, clownKnifefish?.ph, clownKnifefish?.flow],
  ["Chitala ornata", 100, 2839, undefined, [20, 28], [6, 8], "medium"],
  "Chitala ornata yalnız kaynaklı boy, hacim ve su eşiklerini taşımalı; yayımlanmayan uzunluk tahmin edilmemeli",
);
assert.equal(clownKnifefish?.speciesOnly, true, "Chitala ornata standart topluluk balığı gibi sunulmamalı");
assert.equal(clownKnifefish?.predatory, true, "Chitala ornata küçük canlılar için avlanma riskini taşımalı");
assert(clownKnifefish?.tankLengthDataNote?.includes("tahmin edilmedi"), "Chitala ornata yayımlanmayan akvaryum uzunluğunu açıkça belirtmeli");
assert(clownKnifefish?.husbandryCaution?.includes("%50–70"), "Chitala ornata kaynaklı yoğun haftalık bakım gereksinimini taşımalı");
assert.equal(clownKnifefish?.verifiedAt, "2026-09-10", "Chitala ornata güncel doğrulama tarihini taşımalı");
assert.equal(speciesForCatalogExactSearch("Clown Knifefish", "fish", "freshwater")?.id, "clown-knifefish", "Kesin Clown Knifefish adı doğru profile bağlanmalı");
assert.equal(speciesForLivestock({commonName:"ALBİNO BIÇAK BALIĞI",category:"fish",quantity:1}), undefined, "Albino Bıçak Balığı renk adı Chitala ornata profiline tahminle bağlanmamalı");
assert.equal(speciesForLivestock({commonName:"BIÇAK BALIKLARI",category:"fish",quantity:1}), undefined, "Genel Bıçak Balıkları adı Chitala ornata profiline tahminle bağlanmamalı");

const cikletistTetraMainInventory = [
  `Neon Tetra
FURCATA RAINBOW
GERTRUADE BUTTERFLY RAINBOW
MADAGASCAR RAİNBOW BALIKLARI
BLUE KİNG TETRA
WERNERI RAINBOW BALIKLARI
NEON RAINBOW BALIKLARI
FLAME TETRA BALIKLARI
BENEKLİ WERNERİ GERTRUDES BLUE EYES
IRITNERIA WERNERİ
SARPAE TETRA BALIKLARI
KIRMIZI KALEM TETRA BALIKLARI
SİLVERTİPS TETRA BALIKLARI
EMBER TETRA BALIKLARI
LAMP EYE BALIKLARI
PENGUEN TETRA BALIKLARI
BUENES AIRES TETRA BALIKLARI
MAKAS KUYRUK TETRA
TRANSGENETİK TETRA
BUZ BALIĞI
BLACK PALMERİ TETRA
THREADFIN RAINBOW WERNERİ
BOESSAMANİ RAINBOW BALIKLARI
CONGO TETRA BALIKLARI`,
  `GARDNERİ KILLIFISH
ROSY TETRA BALIKLARI
TRANSGENETİK TETRA L BOY
RASBORA KUBUTAI
RASBORA MACULATA
RASBORA BRIGITTAE
Transgenic Tetrazon
Denisoni
Tetrazon
Kardinal Neon
Siyah Simpson Tetra
Kırmızı Neon Tetra
Colombian Tetra
Limon Tetra
Gül Tetra
Makas Kuyruk Tetra
Kırmızı Göz Tetra
Beyaz Bulut Tetra
Kiraz Tetra
Siyah Neon Tetra
Kırmızı Burun Tetra
Rasbora
MELEK BALIKLARI
BLACK RUBY BARB`,
  `PLATİNİUM HALF BEAK CÜCE ZARGANA
ALBİNO BIÇAK BALIĞI
ALBİNO TİNFOİL BARB
TİNFOİL BARB
BUTTERFLY FISH
PIPE FISH NEEDLE
FRENATUS BALIKLARI
DEV TİMSAH BALIKLARI
MONOCULUS PEACOCK BASS
POLYPTERUS ENDLİCHERİ
BIÇAK BALIKLARI
GÖKKUŞAĞI GOBY
PUFFER BALIKLARI
ALLIGATOR GAR TİMSAH BALIKLARI
SİLVER SHARK KÖPEK BALIKLARI
ENDLİCHERİ BALIKLARI
COLOMBİA TETRA
ETÇİL PİRANA NATTERİ
BLACK TİGER BADİS DARİO FİSH
PSEUDOMUGİL SİGNİFER
RED NEON BLUE EYE RAİNBOW FİSH
PSEUDOMUGİL GETRUDAE
RED FANTOM TETRA BALIKLARI
EİGHT BANDED BARB`,
  `REED KİTTY TETRA
YEŞİL ATEŞ TETRA APHYOCARAX RATHBUNİ
BALON KIRMIZI GÖZ TETRA
TRANSGENETİK TETRA XXL BOY
KIRMIZI NEON TETRA BALIKLARI
BLACK TETRA BALIKLARI
KIRMIZI TRANSGENETİK TETRAZONE
ORYZİAS WOWORAE
SAWBWA REPLENDENS
RED BELLY TETRA
NADİR TÜR MİLOMO CİKLET
LEMON OSCAR NADİR TÜR
RED CHİLİ ASTRONOT NADİR TÜR
APİSTOGRAMMA AGASSİZİ FİRE RED
YARASA MELEK BALIKLARI
GEOPHAGUS THREADFİN ACARA HECKELLİ
RED RUBY CİKLET
BORLEY KADANGO CİKLET
JOHANNI CİKLET
RED PANDA DİSCUS
YELLOW PANDA PİGEON BLOOD DİSCUS
BLUE DİAMOND DİSCUS BALIKLARI
RED RUBY DİSCUS BALIKLARI
YELLOW DİSCUS BALIKLARI`,
  `İTHAL SARI İMPARATOR CİKLET
İTHAL SARI İMPARATOR CİKLET
COMPRESSİCEPS YAPRAK CİKLET
İTHAL ALTUM MELEK BALIKLARI
ARGUS BALIKLARI
APİSTOGRAMMA AGASSİZİ DOUBLE RED
ELECTRİC BLUE JACK DEMPSEY
MALAWİ CİKLET BALIKLARI
RED RAİNBOW İNCİSUS
ODESSA BARB
RASBORA HARLEQUİN
RASBORA GALAXY BALIKLARI
RED EYE PUFFER
TATLI SU DİL BALIKLARI
PACU PİRANHA BALIKLARI
DWARF İNDİAN PUFFER
PAKİSTAN LOACH BALIKLARI
RASBORA MERAH BORARAS BALIKLARI
PURPLE SPOTTED GUDGEON MOGURNDA BALIĞI
İTHAL KARIŞIK CİKLET
BLUE AZUL PEACOCK BASS
GREEN NEON TETRA
CELEBES RAİNBOW
YELLOW FLAGTAİL`,
  `SİLVER ARGUS BALIKLARI
ODUN PENGASUS BALIKLARI
PEACOCK GOBY
ORANGE MARBLE MELEK BALIKLARI
RED PACU PİRANHA BALIKLARI
SİYAH KUHLİ
TATİA MUSAİCA
RED TAİLED HEMİODUS
DRAGONE FİSH`,
].flatMap((page) => page.split("\n"));
assert.equal(cikletistTetraMainInventory.length, 129, "Cikletist Tetra Türleri ana kategorisinin altı güncel sayfasındaki 129 satış kaydının tamamı denetlenmeli");
let tetraMainMappedCount = 0;
let tetraMainUnresolvedCount = 0;
for (const retailName of cikletistTetraMainInventory) {
  const exactVerified = speciesForCatalogExactSearch(retailName, "fish", "freshwater");
  const unresolved = exactVerified ? undefined : unresolvedSpeciesForSearch(retailName, "fish", "freshwater");
  const matched = exactVerified ?? (unresolved ? undefined : speciesForLivestock({commonName:retailName,category:"fish",quantity:1}));
  assert(matched || unresolved, `Tetra ana kategorisindeki satış adı doğrulanmış profile veya görünür güvenlik kaydına bağlanmalı: ${retailName}`);
  if (matched) tetraMainMappedCount += 1;
  if (unresolved) tetraMainUnresolvedCount += 1;
}
assert.deepEqual([tetraMainMappedCount,tetraMainUnresolvedCount], [99,30], "Tetra ana kategorisi 99 doğrulanmış ve 30 açıklamalı güvenlik kaydı olarak eksiksiz ayrılmalı");
assert.equal(speciesForCatalogExactSearch("ARGUS BALIKLARI", "fish", "freshwater")?.id, "spotted-scat", "Doğrulanmış tam Argus adı daha uzun çözülmemiş Silver Argus kaydı tarafından engellenmemeli");

const cikletistAmericanTetraListings = [
  ["FURCATA RAINBOW", "forktail-rainbow"],
  ["GERTRUADE BUTTERFLY RAINBOW", "gertrudae-rainbowfish"],
  ["MADAGASCAR RAİNBOW BALIKLARI", "madagascar-rainbowfish"],
  ["BLUE KİNG TETRA"],
  ["WERNERI RAINBOW BALIKLARI", "threadfin-rainbowfish"],
  ["NEON RAINBOW BALIKLARI", "dwarf-neon-rainbow"],
  ["FLAME TETRA BALIKLARI", "flame-tetra"],
  ["BENEKLİ WERNERİ GERTRUDES BLUE EYES", "gertrudae-rainbowfish"],
  ["IRITNERIA WERNERİ", "threadfin-rainbowfish"],
  ["SARPAE TETRA BALIKLARI", "serpae-tetra"],
  ["KIRMIZI KALEM TETRA BALIKLARI"],
  ["SİLVERTİPS TETRA BALIKLARI", "silver-tip-tetra"],
  ["EMBER TETRA BALIKLARI", "ember-tetra"],
  ["LAMP EYE BALIKLARI", "normans-lampeye"],
  ["PENGUEN TETRA BALIKLARI", "penguin-tetra"],
  ["BUENES AIRES TETRA BALIKLARI", "buenos-aires-tetra"],
  ["MAKAS KUYRUK TETRA", "scissortail-rasbora"],
  ["TRANSGENETİK TETRA", "black-skirt-tetra"],
  ["BUZ BALIĞI"],
  ["BLACK PALMERİ TETRA", "emperor-tetra"],
  ["THREADFIN RAINBOW WERNERİ", "threadfin-rainbowfish"],
  ["BOESSAMANİ RAINBOW BALIKLARI", "boesemani-rainbow"],
  ["CONGO TETRA BALIKLARI", "congo-tetra"],
  ["GARDNERİ KILLIFISH", "gardneri-killifish"],
  ["ALTIN RAMİREZİ", "ramirezi"],
  ["ELECTRIC BLUE RAMİREZİ", "ramirezi"],
  ["ROSY TETRA BALIKLARI", "rosy-tetra"],
  ["TRANSGENETİK TETRA L BOY", "black-skirt-tetra"],
  ["Transgenic Tetrazon", "tiger-barb"],
  ["Kardinal Neon", "cardinal-tetra"],
  ["Siyah Simpson Tetra"],
  ["Kırmızı Neon Tetra", "cardinal-tetra"],
  ["Colombian Tetra", "colombian-tetra"],
  ["Limon Tetra", "lemon-tetra"],
  ["Gül Tetra"],
  ["Makas Kuyruk Tetra", "scissortail-rasbora"],
  ["Kırmızı Göz Tetra", "red-eye-tetra"],
  ["Beyaz Bulut Tetra", "white-cloud"],
  ["Kiraz Tetra"],
  ["Siyah Neon Tetra", "black-neon-tetra"],
  ["Kırmızı Burun Tetra", "rummy-nose"],
  ["TRANSGENETİK TETRA XXL BOY", "black-skirt-tetra"],
  ["KIRMIZI NEON TETRA BALIKLARI", "cardinal-tetra"],
  ["GREEN NEON TETRA", "green-neon-tetra"],
  ["CELEBES RAİNBOW", "celebes-rainbowfish"],
  ["Neon Tetra", "neon-tetra"],
];
assert.equal(cikletistAmericanTetraListings.length, 46, "Cikletist Amerikan tetraları karşılaştırmasının beş sayfasındaki 46 satış başlığı denetlenmeli");
for (const [retailName, expectedId] of cikletistAmericanTetraListings) {
  const matched = speciesForLivestock({commonName:retailName,category:"fish",quantity:1});
  if (expectedId) {
    assert.equal(matched?.id, expectedId, `Cikletist Amerikan tetra/rainbow adı doğru sağlık profiline bağlanmalı: ${retailName}`);
  } else {
    assert.equal(matched, undefined, `Birden çok bilimsel türe işaret eden yerel satış adı tahminle eşleştirilmemeli: ${retailName}`);
  }
}
assert.equal(speciesForLivestock({commonName:"BLUE KING TETRA",category:"fish",quantity:1}), undefined, "Blue King adı Inpaichthys kerri ve Boehlkea fredcochui arasında belirsizken tahminle bağlanmamalı");
const cochusBlueTetra = speciesForLivestock({commonName:"Cochu'nun mavi tetrası",scientificName:"Boehlkea fredcochui",category:"fish",quantity:6});
assert.deepEqual([cochusBlueTetra?.id,cochusBlueTetra?.adultSizeCm,cochusBlueTetra?.minVolumeL,cochusBlueTetra?.minTankLengthCm,cochusBlueTetra?.minGroup,cochusBlueTetra?.temperature,cochusBlueTetra?.ph,cochusBlueTetra?.flow],["cochus-blue-tetra",5.4,60,60,6,[22,26],[6,6.5],"medium"],"Boehlkea fredcochui kaynaklı boy, sürü, akvaryum ve su eşiklerini taşımalı");
assert(cochusBlueTetra?.sourceUrl?.includes("fishbase.se/summary/Boehlkea-fredcochui"),"Boehlkea fredcochui FishBase kimlik ve ekoloji kaynağına bağlanmalı");
assert(cochusBlueTetra?.additionalSourceUrls?.some((url)=>url.includes("aquainfo.nl/en/article/boehlkea-fredcochui")),"Boehlkea fredcochui ayrıntılı bakım kaynağına bağlanmalı");
const bluePeruTetra = speciesForLivestock({commonName:"Mavi Peru tetrası",scientificName:"Knodus borki",category:"fish",quantity:8});
assert.deepEqual([bluePeruTetra?.id,bluePeruTetra?.adultSizeCm,bluePeruTetra?.minVolumeL,bluePeruTetra?.minTankLengthCm,bluePeruTetra?.minGroup,bluePeruTetra?.temperature,bluePeruTetra?.ph,bluePeruTetra?.flow],["blue-peru-tetra",5,86,75,8,[22,26],[5.5,7],"medium"],"Knodus borki kaynaklı boy, sürü, akvaryum ve su eşiklerini taşımalı");
assert(bluePeruTetra?.sourceUrl?.includes("seriouslyfish.com/species/knodus-borki"),"Knodus borki ayrıntılı bakım kaynağına bağlanmalı");
assert.notEqual(cochusBlueTetra?.scientificName,bluePeruTetra?.scientificName,"Boehlkea fredcochui ve Knodus borki tek profil gibi gösterilmemeli");
assert.equal(speciesForCatalogExactSearch("Cochu's Blue Tetra","fish","freshwater")?.id,"cochus-blue-tetra","Kesin Cochu's Blue Tetra adı Boehlkea fredcochui profilini bulmalı");
assert.equal(speciesForCatalogExactSearch("Blue Peru Tetra","fish","freshwater")?.id,"blue-peru-tetra","Kesin Blue Peru Tetra adı Knodus borki profilini bulmalı");
assert.equal(speciesForCatalogExactSearch("Blue Tetra","fish","freshwater"),undefined,"Genel Blue Tetra adı farklı mavi tetra türlerinden birine otomatik bağlanmamalı");
assert.equal(unresolvedSpeciesForSearch("Blue Tetra","fish","freshwater")?.name,"BLUE KİNG TETRA","Genel Blue Tetra adı açıklamalı çözülmemiş güvenlik kaydını bulmalı");
for (const retailName of ["KIRMIZI KALEM TETRA BALIKLARI","BUZ BALIĞI","Siyah Simpson Tetra","Gül Tetra","Kiraz Tetra"]) {
  assert.equal(speciesForLivestock({commonName:retailName,category:"fish",quantity:1}), undefined, `Belirsiz ticari ad bilimsel kimlik doğrulanmadan eşleştirilmemeli: ${retailName}`);
}
const rosyTetra = speciesForLivestock({commonName:"ROSY TETRA BALIKLARI",category:"fish",quantity:8});
assert.equal(rosyTetra?.id, "rosy-tetra", "Rosy Tetra satış adı doğrulanmış Hyphessobrycon rosaceus profiline bağlanmalı");
assert.deepEqual([rosyTetra?.scientificName,rosyTetra?.adultSizeCm,rosyTetra?.minVolumeL,rosyTetra?.minTankLengthCm,rosyTetra?.minGroup,rosyTetra?.temperature,rosyTetra?.ph], ["Hyphessobrycon rosaceus",5,68,60,8,[24,28],[5.5,7.5]], "Rosy Tetra kaynaklı kimlik, boy, akvaryum, sürü ve su eşiklerini taşımalı");
assert.equal(rosyTetra?.verifiedAt, "2026-09-06", "Rosy Tetra güncel doğrulama tarihini taşımalı");
assert.equal(unresolvedSpeciesForSearch("ROSY TETRA BALIKLARI", "fish", "freshwater"), undefined, "Doğrulanmış Rosy Tetra çözülmemiş listede kalmamalı");
assert.equal(speciesForLivestock({commonName:"Gül Tetra",category:"fish",quantity:1}), undefined, "Gül Tetra adı Rosy Tetra profiline tahminle bağlanmamalı");
assert.equal(unresolvedSpeciesForSearch("Gül Tetra", "fish", "freshwater")?.name, "Gül Tetra", "Belirsiz Gül Tetra adı açıklamalı güvenlik listesinde kalmalı");

for (const [retailName, expectedId] of [
  ["ORYZİAS WOWORAE", "daisys-blue-ricefish"],
  ["PSEUDOMUGİL SİGNİFER", "pacific-blue-eye"],
  ["RED FANTOM TETRA BALIKLARI", "red-phantom-tetra"],
  ["BLACK TETRA BALIKLARI", "black-skirt-tetra"],
  ["BALON KIRMIZI GÖZ TETRA", "red-eye-tetra"],
  ["COLOMBİA TETRA", "colombian-tetra"],
  ["KIRMIZI TRANSGENETİK TETRAZONE", "tiger-barb"],
  ["ODESSA BARB", "odessa-barb"],
  ["PSEUDOMUGİL GETRUDAE", "gertrudae-rainbowfish"],
  ["RASBORA GALAXY BALIKLARI", "galaxy-rasbora"],
  ["RASBORA HARLEQUİN", "harlequin-rasbora"],
  ["RED NEON BLUE EYE RAİNBOW FİSH", "red-neon-blue-eye"],
  ["RED RAİNBOW İNCİSUS", "red-rainbowfish"],
  ["RASBORA BRIGITTAE", "chili-rasbora"],
  ["RASBORA KUBUTAI", "kubotai-rasbora"],
  ["RASBORA MACULATA", "spotted-rasbora"],
  ["SAWBWA REPLENDENS", "sawbwa-resplendens"],
  ["RASBORA MERAH BORARAS BALIKLARI", "phoenix-rasbora"],
  ["YEŞİL ATEŞ TETRA APHYOCARAX RATHBUNİ", "green-fire-tetra"],
  ["ALBİNO TİNFOİL BARB", "tinfoil-barb"],
  ["TİNFOİL BARB", "tinfoil-barb"],
  ["SİLVER SHARK KÖPEK BALIKLARI", "bala-shark"],
  ["PAKİSTAN LOACH BALIKLARI", "yoyo-loach"],
  ["FRENATUS BALIKLARI", "rainbow-shark"],
  ["PEACOCK GOBY", "peacock-gudgeon"],
  ["DWARF İNDİAN PUFFER", "pea-puffer"],
  ["RED EYE PUFFER", "red-eyed-puffer"],
  ["FAHAKA PUFFER", "fahaka-puffer"],
  ["PACU PİRANHA BALIKLARI", "red-bellied-pacu"],
  ["RED PACU PİRANHA BALIKLARI", "red-bellied-pacu"],
  ["SİYAH KUHLİ", "kuhli-loach"],
  ["TATİA MUSAİCA", "ninja-woodcat"],
  ["ETÇİL PİRANA NATTERİ", "red-bellied-piranha"],
  ["ENDLİCHERİ BALIKLARI", "endlicheri-bichir"],
  ["POLYPTERUS ENDLİCHERİ", "endlicheri-bichir"],
  ["MONOCULUS PEACOCK BASS", "monoculus-peacock-bass"],
]) {
  assert.equal(speciesForLivestock({commonName:retailName,category:"fish",quantity:1})?.id, expectedId, `Cikletist Sazansıgiller adı güvenilir türe bağlanmalı: ${retailName}`);
}
for (const [id, scientificName, size, volume, length, group, temperature, ph, expectedVerifiedAt] of [
  ["eight-banded-false-barb", "Eirmotus octozona", 3.6, 54, 60, 10, [22,26], [5,7], "2026-10-02"],
  ["daisys-blue-ricefish", "Oryzias woworae", 3, 41, 45, 8, [23,27], [6,7.5], "2026-10-02"],
  ["pacific-blue-eye", "Pseudomugil signifer", 8.8, 54, 60, 10, [20,26], [6.5,7.5], "2026-10-02"],
  ["red-phantom-tetra", "Megalamphodus sweglesi", 3.5, 72, 80, 10, [20,28], [4.5,7.5], "2026-10-02"],
  ["sawbwa-resplendens", "Sawbwa resplendens", 3.5, 54, 60, 5, [18,22], [6,8], "2026-10-02"],
  ["phoenix-rasbora", "Boraras merah", 2, 41, 45, 10, [20,28], [4,6.5], "2026-10-02"],
  ["green-fire-tetra", "Aphyocharax rathbuni", 7.1, 54, 60, 6, [20,26], [6.5,7.5], "2026-10-02"],
  ["red-neon-blue-eye", "Pseudomugil luminatus", 3, 60, 60, 10, [20,28], [6.5,8], "2026-10-02"],
  ["ninja-woodcat", "Tatia musaica", 7, 56, 60, 5, [25,26], [6,7.2], "2026-10-02"],
  ["red-bellied-piranha", "Pygocentrus nattereri", 50, 1296, 240, 6, [23,27], [5.5,7.5], "2026-10-02"],
  ["endlicheri-bichir", "Polypterus endlicherii", 70, 2000, 300, 1, [26,28], [6.5,7.5], "2026-10-02"],
  ["monoculus-peacock-bass", "Cichla monoculus", 80, 1200, 200, 1, [25,31], [5.5,6.5], "2026-10-02"],
]) {
  const profile = speciesCatalog.find((item) => item.id === id);
  assert(profile, `${id} güvenilir kaynaklı canlı kataloğunda bulunmalı`);
  assert.deepEqual(
    [profile.scientificName,profile.adultSizeCm,profile.minVolumeL,profile.minTankLengthCm,profile.minGroup,profile.temperature,profile.ph],
    [scientificName,size,volume,length,group,temperature,ph],
    `${id} doğrulanmış kimlik, boy, akvaryum, sürü ve su eşiklerini taşımalı`,
  );
  assert.equal(profile.verifiedAt, expectedVerifiedAt, `${id} güncel doğrulama tarihini taşımalı`);
  assert(profile.sourceUrl?.startsWith("https://"), `${id} güvenilir HTTPS ana kaynağı taşımalı`);
  assert((profile.additionalSourceUrls?.length || 0) >= 2, `${id} en az iki ek doğrulama kaynağını saklamalı`);
}
assert.equal(speciesCatalog.filter((item) => speciesGroup(item) === "tetra").length, 32, "Tetra kataloğu ayrı mavi tetra, kalem balığı ve Bentosi profilleri dahil 32 güvenilir profile ulaşmalı");
for (const [id, scientificName] of [["coral-red-pencilfish","Nannostomus mortenthaleri"],["purple-pencilfish","Nannostomus rubrocaudatus"]]) {
  const profile = speciesCatalog.find((item) => item.id === id);
  assert.deepEqual(
    [profile?.scientificName,profile?.adultSizeCm,profile?.minVolumeL,profile?.minTankLengthCm,profile?.minGroup,profile?.temperature,profile?.ph,profile?.flow],
    [scientificName,3,81,90,10,[24,28],[4,7],"low"],
    `${scientificName} doğrulanmış kimlik, boy, grup, taban alanı ve su eşiklerini taşımalı`,
  );
  assert.equal(profile?.verifiedAt, "2026-09-09", `${scientificName} güncel doğrulama tarihini taşımalı`);
  assert.match(profile?.sourceUrl || "", /^https:\/\/www\.seriouslyfish\.com\/species\/nannostomus-/, `${scientificName} doğrudan türe özel uzman kaynağa bağlanmalı`);
}
assert.equal(speciesForLivestock({commonName:"KIRMIZI KALEM TETRA BALIKLARI",category:"fish",quantity:1}), undefined, "Genel Kırmızı Kalem Tetra satış adı iki benzer Nannostomus profilinden birine tahminle bağlanmamalı");
const ornateTetra = speciesCatalog.find((item) => item.id === "ornate-tetra");
assert.deepEqual(
  [ornateTetra?.scientificName,ornateTetra?.adultSizeCm,ornateTetra?.minVolumeL,ornateTetra?.minTankLengthCm,ornateTetra?.minGroup,ornateTetra?.temperature,ornateTetra?.ph,ornateTetra?.flow],
  ["Hyphessobrycon bentosi",4.5,81,90,8,[20,28],[5,7.5],"low"],
  "Bentosi tetra doğrulanmış kimlik, boy, grup, taban alanı ve su eşiklerini taşımalı",
);
assert.match(ornateTetra?.sourceUrl || "", /^https:\/\/www\.seriouslyfish\.com\/species\/hyphessobrycon-bentosi/, "Bentosi tetra doğrudan türe özel uzman kaynağa bağlanmalı");
assert.equal(speciesForLivestock({commonName:"Gül Tetra",category:"fish",quantity:1}), undefined, "Genel Gül Tetra satış adı H. rosaceus veya H. bentosi profiline tahminle bağlanmamalı");
const celebesHalfbeak = speciesCatalog.find((item) => item.id === "celebes-halfbeak");
assert.deepEqual(
  [celebesHalfbeak?.scientificName,celebesHalfbeak?.adultSizeCm,celebesHalfbeak?.minVolumeL,celebesHalfbeak?.minTankLengthCm,celebesHalfbeak?.minGroup,celebesHalfbeak?.temperature,celebesHalfbeak?.ph,celebesHalfbeak?.flow],
  ["Nomorhamphus liemi",10,132,91,5,[24,27],[6.5,8],"medium"],
  "Celebes Halfbeak doğrulanmış kimlik, erişkin dişi boyu, grup, yüzme alanı ve su eşiklerini taşımalı",
);
assert.deepEqual(celebesHalfbeak?.waterTypes, ["freshwater"], "Nomorhamphus liemi tatlı su profili olarak tutulmalı");
assert.equal(celebesHalfbeak?.predatory, true, "Nomorhamphus liemi küçük canlı avı riskini sağlık analizine taşımalı");
assert.equal(celebesHalfbeak?.verifiedAt, "2026-09-30", "Nomorhamphus liemi güncel doğrulama tarihini taşımalı");
assert.match(celebesHalfbeak?.sourceUrl || "", /^https:\/\/tropicalfreshwaterfish\.com\/species\/Nomorhamphus_liemi_liemi\.html$/, "Nomorhamphus liemi doğrudan tür bakım kaynağına bağlanmalı");
assert(celebesHalfbeak?.additionalSourceUrls?.some((url) => url.includes("fishbase.se/summary/Nomorhamphus-liemi")), "Nomorhamphus liemi doğal aralık ve boy için FishBase çapraz kaynağını taşımalı");
assert(celebesHalfbeak?.additionalSourceUrls?.some((url) => url.includes("practicalfishkeeping.co.uk/features/what-conditions-do-halfbeaks-need")), "Nomorhamphus liemi uzman halfbeak bakım çapraz kaynağını taşımalı");
assert(celebesHalfbeak?.husbandryCaution?.includes("20–24 °C") && celebesHalfbeak.husbandryCaution.includes("23–27 °C") && celebesHalfbeak.husbandryCaution.includes("24–27 °C"), "Nomorhamphus liemi kaynaklar arasındaki sıcaklık farkını kullanıcıdan saklamamalı");
assert(celebesHalfbeak?.husbandryCaution?.includes("çözünmüş oksijen"), "Nomorhamphus liemi yüksek sıcaklıkta oksijen güvenliğini taşımalı");
assert.equal(speciesForLivestock({commonName:"PLATİNİUM HALF BEAK CÜCE ZARGANA",category:"fish",quantity:1}), undefined, "Genel Platinum Halfbeak satış adı Dermogenys veya Nomorhamphus profiline tahminle bağlanmamalı");
assert.equal(speciesCatalog.filter((item) => speciesGroup(item) === "rasbora").length, 14, "Rasbora kataloğu Phoenix rasbora ve Sawbwa dahil 14 güvenilir profile ulaşmalı");
assert.equal(speciesCatalog.filter((item) => speciesGroup(item) === "rainbowfish").length, 12, "Rainbowfish kataloğu doğrulanmış 12 profile sahip olmalı");
for (const retailName of [
  "ALBİNO BIÇAK BALIĞI","BIÇAK BALIKLARI","DEV TİMSAH BALIKLARI","GÖKKUŞAĞI GOBY","PIPE FISH NEEDLE",
  "PLATİNİUM HALF BEAK CÜCE ZARGANA","PUFFER BALIKLARI","Rasbora",
  "RED BELLY TETRA","REED KİTTY TETRA","TATLI SU DİL BALIKLARI","CHALLENGERLAR",
  "DRAGONE FİSH","ODUN PENGASUS BALIKLARI","SİLVER ARGUS BALIKLARI","YELLOW FLAGTAİL",
]) {
  assert.equal(speciesForLivestock({commonName:retailName,category:"fish",quantity:1}), undefined, `Bilimsel kimliği veya tatlı su bakım modeli kesin olmayan ad tahminle eşleştirilmemeli: ${retailName}`);
}
const cikletistCyprinidInventory = [
  ["ALBİNO BIÇAK BALIĞI"],
  ["ALBİNO TİNFOİL BARB", "tinfoil-barb"],
  ["ALLIGATOR GAR TİMSAH BALIKLARI"],
  ["BIÇAK BALIKLARI"],
  ["BLACK RUBY BARB", "black-ruby-barb"],
  ["BUTTERFLY FISH", "african-butterfly-fish"],
  ["Denisoni", "denison-barb"],
  ["DEV TİMSAH BALIKLARI"],
  ["ENDLİCHERİ BALIKLARI", "endlicheri-bichir"],
  ["FRENATUS BALIKLARI", "rainbow-shark"],
  ["GÖKKUŞAĞI GOBY"],
  ["MONOCULUS PEACOCK BASS", "monoculus-peacock-bass"],
  ["PIPE FISH NEEDLE"],
  ["PLATİNİUM HALF BEAK CÜCE ZARGANA"],
  ["POLYPTERUS ENDLİCHERİ", "endlicheri-bichir"],
  ["PUFFER BALIKLARI"],
  ["Rasbora"],
  ["RASBORA BRIGITTAE", "chili-rasbora"],
  ["RASBORA KUBUTAI", "kubotai-rasbora"],
  ["RASBORA MACULATA", "spotted-rasbora"],
  ["Sae Yosun Yiyici", "siamese-algae-eater"],
  ["SİLVER SHARK KÖPEK BALIKLARI", "bala-shark"],
  ["Tetrazon", "tiger-barb"],
  ["TİNFOİL BARB", "tinfoil-barb"],
  ["BALON KIRMIZI GÖZ TETRA", "red-eye-tetra"],
  ["BLACK TETRA BALIKLARI", "black-skirt-tetra"],
  ["BLACK TİGER BADİS DARİO FİSH", "black-tiger-dario"],
  ["COLOMBİA TETRA", "colombian-tetra"],
  ["DWARF İNDİAN PUFFER", "pea-puffer"],
  ["EİGHT BANDED BARB"],
  ["ETÇİL PİRANA NATTERİ", "red-bellied-piranha"],
  ["KIRMIZI TRANSGENETİK TETRAZONE", "tiger-barb"],
  ["ODESSA BARB", "odessa-barb"],
  ["ORYZİAS WOWORAE", "daisys-blue-ricefish"],
  ["PACU PİRANHA BALIKLARI", "red-bellied-pacu"],
  ["PSEUDOMUGİL GETRUDAE", "gertrudae-rainbowfish"],
  ["PSEUDOMUGİL SİGNİFER", "pacific-blue-eye"],
  ["RASBORA GALAXY BALIKLARI", "galaxy-rasbora"],
  ["RASBORA HARLEQUİN", "harlequin-rasbora"],
  ["RED BELLY TETRA"],
  ["RED EYE PUFFER", "red-eyed-puffer"],
  ["RED FANTOM TETRA BALIKLARI", "red-phantom-tetra"],
  ["RED NEON BLUE EYE RAİNBOW FİSH", "red-neon-blue-eye"],
  ["RED RAİNBOW İNCİSUS", "red-rainbowfish"],
  ["REED KİTTY TETRA"],
  ["SAWBWA REPLENDENS", "sawbwa-resplendens"],
  ["TATLI SU DİL BALIKLARI"],
  ["YEŞİL ATEŞ TETRA APHYOCARAX RATHBUNİ", "green-fire-tetra"],
  ["BLUE AZUL PEACOCK BASS"],
  ["CHALLENGERLAR"],
  ["ÇİN EJDERİ", "chinese-high-fin-sucker"],
  ["DRAGONE FİSH"],
  ["FAHAKA PUFFER", "fahaka-puffer"],
  ["ODUN PENGASUS BALIKLARI"],
  ["PAKİSTAN LOACH BALIKLARI", "yoyo-loach"],
  ["PEACOCK GOBY", "peacock-gudgeon"],
  ["PURPLE SPOTTED GUDGEON MOGURNDA BALIĞI"],
  ["RASBORA MERAH BORARAS BALIKLARI", "phoenix-rasbora"],
  ["RED PACU PİRANHA BALIKLARI", "red-bellied-pacu"],
  ["RED TAİLED HEMİODUS", "slender-hemiodus"],
  ["SİLVER ARGUS BALIKLARI"],
  ["SİYAH KUHLİ", "kuhli-loach"],
  ["TATİA MUSAİCA", "ninja-woodcat"],
  ["YELLOW FLAGTAİL"],
];
assert.equal(cikletistCyprinidInventory.length, 64, "Cikletist Sazansıgiller kategorisinin üç sayfasındaki 64 başlığın tamamı denetlenmeli");
for (const [retailName, expectedId] of cikletistCyprinidInventory) {
  const matched = speciesForLivestock({commonName:retailName,category:"fish",quantity:1});
  if (expectedId) assert.equal(matched?.id, expectedId, `Sazansıgiller satış adı doğru biyolojik profile bağlanmalı: ${retailName}`);
  else assert.equal(matched, undefined, `Bilimsel kimliği veya güvenli bakım eşiği tamamlanmayan satış adı eşleştirilmemeli: ${retailName}`);
}
const slenderHemiodus = speciesForLivestock({commonName:"RED TAİLED HEMİODUS",category:"fish",quantity:8});
assert.equal(slenderHemiodus?.id, "slender-hemiodus", "Red Tailed Hemiodus satış adı doğrulanmış Hemiodus gracilis profiline bağlanmalı");
assert.deepEqual(
  [slenderHemiodus?.scientificName,slenderHemiodus?.adultSizeCm,slenderHemiodus?.minVolumeL,slenderHemiodus?.minTankLengthCm,slenderHemiodus?.minGroup,slenderHemiodus?.temperature,slenderHemiodus?.ph,slenderHemiodus?.flow],
  ["Hemiodus gracilis",18,243,120,8,[23,27],[5.8,7.2],"high"],
  "Hemiodus gracilis kaynaklı kimlik, boy, akvaryum, sürü, su ve akıntı eşiklerini taşımalı",
);
assert.equal(slenderHemiodus?.verifiedAt, "2026-09-07", "Hemiodus gracilis güncel doğrulama tarihini taşımalı");
assert.equal(unresolvedSpeciesForSearch("RED TAİLED HEMİODUS", "fish", "freshwater"), undefined, "Doğrulanmış Red Tailed Hemiodus çözülmemiş listede kalmamalı");

const cikletistArowanaInventory = [
  ["AFRİKAN AROWANA", "african-arowana"],
  ["SİLVER AROWANA", "arowana"],
  ["SİLVER AROWANA UFAK", "arowana"],
  ["SİLVER AROWANA", "arowana"],
];
assert.equal(cikletistArowanaInventory.length, 4, "Cikletist Arowanalar kategorisindeki dört satış başlığının tamamı denetlenmeli");
for (const [retailName, expectedId] of cikletistArowanaInventory) {
  const matched = speciesForLivestock({commonName:retailName,category:"fish",quantity:1});
  if (expectedId) assert.equal(matched?.id, expectedId, `Arowana satış adı doğru biyolojik profile bağlanmalı: ${retailName}`);
  else assert.equal(matched, undefined, `Güvenilir bakım eşikleri tamamlanmayan arowana adı tahminle eşleştirilmemeli: ${retailName}`);
}
const silverArowana = speciesCatalog.find((item) => item.id === "arowana");
assert(silverArowana, "Gümüş arowana güvenilir kaynaklı canlı kataloğunda bulunmalı");
assert.deepEqual(
  [silverArowana.scientificName,silverArowana.adultSizeCm,silverArowana.minVolumeL,silverArowana.minTankLengthCm,silverArowana.minGroup,silverArowana.temperature,silverArowana.ph],
  ["Osteoglossum bicirrhosum",90,4500,500,1,[24,28],[6,7.2]],
  "Gümüş arowana bilimsel kimlik, erişkin boyu, profesyonel ölçekli akvaryum ve su eşiklerini taşımalı",
);
assert.equal(silverArowana.verifiedAt, "2026-10-02", "Gümüş arowana güncel doğrulama tarihini taşımalı");
assert(silverArowana.sourceUrl?.includes("fishbase.se"), "Gümüş arowana bilimsel ana kaynağa bağlanmalı");
assert((silverArowana.additionalSourceUrls?.length || 0) >= 3, "Gümüş arowana bakım eşikleri bağımsız güvenilir kaynaklarla doğrulanmalı");
assert.equal(silverArowana.predatory, true, "Gümüş arowana avcılık uyarısını taşımalı");
assert.equal(silverArowana.speciesOnly, true, "Gümüş arowana sıradan topluluk akvaryumuna önerilmemeli");
assert(silverArowana.husbandryCaution?.includes("kapak") && silverArowana.husbandryCaution?.includes("%30–50"), "Gümüş arowana sıçrama, kapak ve su değişimi güvenliğini açıklamalı");

const redtailCatfish = speciesCatalog.find((item) => item.id === "redtail-catfish");
assert.deepEqual(
  [redtailCatfish?.scientificName,redtailCatfish?.adultSizeCm,redtailCatfish?.minVolumeL,redtailCatfish?.minTankLengthCm,redtailCatfish?.minGroup,redtailCatfish?.temperature,redtailCatfish?.ph,redtailCatfish?.flow],
  ["Phractocephalus hemioliopterus",135,10368,360,1,[21,26],[6,7.5],undefined],
  "Kırmızı kuyruk kedi balığı yalnız doğrudan kaynaklı dev erişkin ve kamusal akvaryum eşiklerini taşımalı",
);
assert.equal(redtailCatfish?.verifiedAt, "2026-10-02", "Kırmızı kuyruk kedi balığı güncel kaynak denetim tarihini taşımalı");
assert(redtailCatfish?.husbandryCaution?.includes("360 × 240 × 120 cm") && redtailCatfish?.husbandryCaution?.includes("10.368 litre"), "Kırmızı kuyruk kedi balığı doğrudan yayımlanan mutlak taban ölçüsünü açıklamalı");
assert(redtailCatfish?.husbandryCaution?.includes("tahmin edilmedi"), "Kırmızı kuyruk kedi balığı için yayımlanmayan tek akıntı hedefi uydurulmamalı");
assert(redtailCatfish?.additionalSourceUrls?.some((url) => url.includes("seriouslyfish.com/species/phractocephalus")), "Kırmızı kuyruk kedi balığı uzman bakım kaynağına bağlanmalı");
const africanArowana = speciesCatalog.find((item) => item.id === "african-arowana");
assert.deepEqual(
  [africanArowana?.scientificName,africanArowana?.adultSizeCm,africanArowana?.minVolumeL,africanArowana?.minTankLengthCm,africanArowana?.minGroup,africanArowana?.temperature,africanArowana?.ph,africanArowana?.flow],
  ["Heterotis niloticus",100,1000,undefined,1,[25,28],[6,7.5],undefined],
  "Afrika Arowanası yalnız kaynaklı kimlik, boy, hacim, sosyal yapı ve su eşiklerini taşımalı",
);
assert(africanArowana?.tankLengthDataNote?.includes("uzunluk değeri tahmin edilmedi"), "Afrika Arowanası yayımlanmayan santimetre eşiğini uydurmamalı");
assert.equal(africanArowana?.predatory, true, "Afrika Arowanası küçük canlı avlama riskini taşımalı");
assert.equal(africanArowana?.verifiedAt, "2026-10-02", "Afrika Arowanası güncel doğrulama tarihini taşımalı");
assert((africanArowana?.additionalSourceUrls?.length || 0) >= 4, "Afrika Arowanası kimlik, bakım ve Türkiye satış adı kaynaklarını saklamalı");
assert(africanArowana?.husbandryCaution?.includes("10,2 kg") && africanArowana?.husbandryCaution?.includes("omnivor"), "Afrika Arowanası bilimsel ağırlık ve gerçek beslenme güvenliğini açıklamalı");

const cikletistCurrentMonsterInventory = [
  ["AFRİKAN AROWANA", "african-arowana"],
  ["CHANNA MARULİODES", "emperor-snakehead"],
  ["ZİGZAK TARAK BALIKLARI"],
  ["GOLDEN SNAKEHEAD STEWARTİİ CHANNA", "assamese-snakehead"],
  ["CHANNA KIRMIZI YILANBAŞ MİCROPELTES", "giant-snakehead"],
  ["CHANNA ORNA YELLOW LİPS", "ornate-snakehead"],
  ["ASTRONOT BALIKLARI", "oscar"],
  ["SHORTBODY FLOWERHORN ÇEŞİTLERİ", "flowerhorn"],
  ["SİLVER AROWANA", "arowana"],
  ["SİLVER AROWANA UFAK", "arowana"],
  ["CHANNA ANDRO", "andrao-snakehead"],
  ["CHANNA GOLDEN LİMBATA"],
  ["HALF BANDED SPINY EEL", "half-banded-spiny-eel"],
  ["FLOWERHORN DAMIZLIK", "flowerhorn"],
  ["SİLVER AROWANA", "arowana"],
  ["ÇİN EJDERİ", "chinese-high-fin-sucker"],
  ["WHITE CHECK EEL MÜREN"],
  ["CHANNA BLEHERİ", "rainbow-snakehead"],
  ["FAHAKA PUFFER", "fahaka-puffer"],
  ["CHANNA PULCHRA KOBALT MAVİ YILANBAŞ", "peacock-snakehead"],
  ["CHANNA ASIATICA GÖKKUŞAĞI YILANBAŞ BLEHERİ"],
];
assert.equal(cikletistCurrentMonsterInventory.length, 21, "Cikletist güncel Monster ana kategorisindeki 21 satış başlığının tamamı denetlenmeli");
for (const [retailName, expectedId] of cikletistCurrentMonsterInventory) {
  const matched = speciesForLivestock({commonName:retailName,category:"fish",quantity:1});
  if (expectedId) assert.equal(matched?.id, expectedId, `Monster satış adı doğru güvenilir biyolojik profile bağlanmalı: ${retailName}`);
  else assert.equal(matched, undefined, `Bilimsel kimliği veya güvenli bakım modeli tamamlanmayan Monster adı tahminle eşleştirilmemeli: ${retailName}`);
}
const chineseHighFinSucker = speciesCatalog.find((item) => item.id === "chinese-high-fin-sucker");
assert.deepEqual(
  [chineseHighFinSucker?.scientificName,chineseHighFinSucker?.adultSizeCm,chineseHighFinSucker?.minVolumeL,chineseHighFinSucker?.minTankLengthCm,chineseHighFinSucker?.minGroup,chineseHighFinSucker?.temperature,chineseHighFinSucker?.ph,chineseHighFinSucker?.flow],
  ["Myxocyprinus asiaticus",68,1135,undefined,1,[15,26],[6,8],undefined],
  "Çin Ejderi yalnız kaynaklı kimlik, boy, yetişkin hacmi, sosyal yapı ve su eşiklerini taşımalı",
);
assert(chineseHighFinSucker?.tankLengthDataNote?.includes("uzunluk değeri tahmin edilmedi"), "Çin Ejderi yayımlanmayan santimetre eşiğini uydurmamalı");
assert(chineseHighFinSucker?.husbandryCaution?.includes("havuz"), "Çin Ejderi yetişkin bakımının havuz ölçeğini açıklamalı");
assert.equal(chineseHighFinSucker?.verifiedAt, "2026-10-02", "Çin Ejderi güncel doğrulama tarihini taşımalı");
assert((chineseHighFinSucker?.additionalSourceUrls?.length || 0) >= 3, "Çin Ejderi kimlik, bakım ve Türkiye satış adı kaynaklarını saklamalı");
assert(chineseHighFinSucker?.husbandryCaution?.includes("80–90 cm") && chineseHighFinSucker?.husbandryCaution?.includes("Hassas"), "Çin Ejderi bakım boyu farkını ve koruma durumunu açıklamalı");
const oscar = speciesCatalog.find((item) => item.id === "oscar");
assert.deepEqual(
  [oscar?.scientificName,oscar?.adultSizeCm,oscar?.minVolumeL,oscar?.minTankLengthCm,oscar?.minGroup,oscar?.temperature,oscar?.ph,oscar?.flow],
  ["Astronotus ocellatus",45.7,540,150,1,[20,28],[6,7.5],"low"],
  "Astronot bilimsel azami boyu ile uzman kaynaktaki erişkin tabanı ve su eşiklerini taşımalı",
);
assert.equal(oscar?.verifiedAt, "2026-10-02", "Astronot güncel doğrulama tarihini taşımalı");
assert(oscar?.sourceUrl?.includes("seriouslyfish.com"), "Astronot ana bakım kaynağı olarak tür uzmanı profiline bağlanmalı");
assert(oscar?.additionalSourceUrls?.some((url) => url.includes("fishbase.se")), "Astronot azami toplam boy için FishBase çapraz kaynağını saklamalı");
assert(oscar?.husbandryCaution?.includes("45,7 cm") && oscar?.husbandryCaution?.includes("%30–50"), "Astronot boy ölçümü farkını ve su değişimi gereksinimini açıklamalı");
const dwarfGourami = speciesCatalog.find((item) => item.id === "dwarf-gourami");
assert.deepEqual(
  [dwarfGourami?.scientificName,dwarfGourami?.adultSizeCm,dwarfGourami?.minVolumeL,dwarfGourami?.minTankLengthCm,dwarfGourami?.minGroup,dwarfGourami?.temperature,dwarfGourami?.ph,dwarfGourami?.flow],
  ["Trichogaster lalius",9.5,56,60,2,[22,27],[6,7.5],"low"],
  "Cüce gurami kaynaklı erişkin boy, çift, alan ve su eşiklerini taşımalı",
);
assert.equal(dwarfGourami?.verifiedAt, "2026-10-03", "Cüce gurami güncel doğrulama tarihini taşımalı");
assert(dwarfGourami?.sourceUrl?.includes("seriouslyfish.com"), "Cüce gurami ayrıntılı bakım kaynağına bağlanmalı");
assert(dwarfGourami?.additionalSourceUrls?.some((url) => url.includes("fishbase.se")), "Cüce gurami kimlik ve toplam boy için FishBase çapraz kaynağını saklamalı");
assert(dwarfGourami?.husbandryCaution?.includes("DGIV") && dwarfGourami?.husbandryCaution?.includes("56 litre"), "Cüce gurami iridovirüs ve çift alanı güvenliğini açıklamalı");
const pearlGourami = speciesCatalog.find((item) => item.id === "pearl-gourami");
assert.deepEqual(
  [pearlGourami?.scientificName,pearlGourami?.adultSizeCm,pearlGourami?.minVolumeL,pearlGourami?.minTankLengthCm,pearlGourami?.minGroup,pearlGourami?.temperature,pearlGourami?.ph,pearlGourami?.flow],
  ["Trichopodus leerii",12,81,120,1,[24,30],[5.5,8],undefined],
  "İnci gurami iki bakım kaynağındaki hacim, uzunluk ve su eşiklerini uydurmadan taşımalı",
);
assert.equal(pearlGourami?.verifiedAt, "2026-10-03", "İnci gurami güncel doğrulama tarihini taşımalı");
assert(pearlGourami?.husbandryCaution?.includes("81 litre") && pearlGourami?.husbandryCaution?.includes("120 cm"), "İnci gurami kaynaklar arasındaki alan farkını kullanıcıya açıklamalı");
const clownLoach = speciesCatalog.find((item) => item.id === "clown-loach");
assert.deepEqual(
  [clownLoach?.scientificName,clownLoach?.adultSizeCm,clownLoach?.minVolumeL,clownLoach?.minTankLengthCm,clownLoach?.minGroup,clownLoach?.temperature,clownLoach?.ph,clownLoach?.flow],
  ["Chromobotia macracanthus",40,648,180,5,[24,30],[5,7],"medium"],
  "Makrakanta kaynaklı erişkin boy, grup, alan ve su eşiklerini taşımalı",
);
assert.equal(clownLoach?.verifiedAt, "2026-10-03", "Makrakanta güncel doğrulama tarihini taşımalı");
assert(clownLoach?.husbandryCaution?.includes("20 yıldan uzun") && clownLoach?.husbandryCaution?.includes("%30–50"), "Makrakanta ömür ve su bakımı güvenliğini açıklamalı");
assert(clownLoach?.additionalSourceUrls?.some((url) => url.includes("fishbase.se")), "Makrakanta bilimsel karşılaştırma kaynağını saklamalı");
const neonTetra = speciesCatalog.find((item) => item.id === "neon-tetra");
assert.deepEqual(
  [neonTetra?.scientificName,neonTetra?.adultSizeCm,neonTetra?.minVolumeL,neonTetra?.minTankLengthCm,neonTetra?.minGroup,neonTetra?.temperature,neonTetra?.ph,neonTetra?.flow],
  ["Paracheirodon innesi",3,54,60,8,[21,25],[4,7.5],undefined],
  "Neon tetra kaynaklı boy, alan, sürü ve su eşiklerini taşımalı; akıntı tahmin edilmemeli",
);
assert.equal(neonTetra?.verifiedAt, "2026-10-03", "Neon tetra güncel doğrulama tarihini taşımalı");
assert(neonTetra?.husbandryCaution?.includes("Neon Tetra Hastalığı") && neonTetra?.husbandryCaution?.includes("54 litre"), "Neon tetra hastalık ve alan güvenliğini açıklamalı");
const cardinalTetra = speciesCatalog.find((item) => item.id === "cardinal-tetra");
assert.deepEqual(
  [cardinalTetra?.scientificName,cardinalTetra?.adultSizeCm,cardinalTetra?.minVolumeL,cardinalTetra?.minTankLengthCm,cardinalTetra?.minGroup,cardinalTetra?.temperature,cardinalTetra?.ph,cardinalTetra?.flow],
  ["Paracheirodon axelrodi",3.5,54,60,8,[23,29],[3.5,7.5],"low"],
  "Kardinal tetra kaynaklı boy, alan, sürü ve su eşiklerini taşımalı",
);
assert.equal(cardinalTetra?.verifiedAt, "2026-10-03", "Kardinal tetra güncel doğrulama tarihini taşımalı");
assert(cardinalTetra?.husbandryCaution?.includes("Doğadan yakalanan") && cardinalTetra?.husbandryCaution?.includes("54 litre"), "Kardinal tetra köken ve su kalitesi farkını açıklamalı");
const pandaCory = speciesCatalog.find((item) => item.id === "corydoras-panda");
assert.deepEqual(
  [pandaCory?.scientificName,pandaCory?.adultSizeCm,pandaCory?.minVolumeL,pandaCory?.minTankLengthCm,pandaCory?.minGroup,pandaCory?.temperature,pandaCory?.ph,pandaCory?.flow],
  ["Hoplisoma panda",5,41,45,6,[22,25],[6,7.4],undefined],
  "Panda çöpçü güncel bilimsel adı ile kaynaklı boy, alan, sürü ve su eşiklerini taşımalı",
);
assert.equal(pandaCory?.verifiedAt, "2026-10-03", "Panda çöpçü güncel doğrulama tarihini taşımalı");
assert(pandaCory?.aliases?.includes("Corydoras panda"), "Panda çöpçünün eski bilimsel adı aramada korunmalı");
assert(pandaCory?.husbandryCaution?.includes("bıyıklara zarar") && pandaCory?.husbandryCaution?.includes("25 °C üzerindeki"), "Panda çöpçü taban ve sıcaklık güvenliğini açıklamalı");
const molly = speciesCatalog.find((item) => item.id === "molly");
assert.deepEqual(
  [molly?.scientificName,molly?.adultSizeCm,molly?.minVolumeL,molly?.minTankLengthCm,molly?.minGroup,molly?.temperature,molly?.ph,molly?.flow],
  ["Poecilia sphenops",7.5,45,60,3,[20,28],[7,8],undefined],
  "Moli kaynaklı boy, alan, sosyal yapı ve su eşiklerini taşımalı; akıntı tahmin edilmemeli",
);
assert.deepEqual(molly?.waterTypes, ["freshwater","brackish"], "Moli FishBase doğal tatlı ve acı su kapsamını taşımalı");
assert.equal(molly?.verifiedAt, "2026-10-03", "Moli güncel doğrulama tarihini taşımalı");
assert(molly?.husbandryCaution?.includes("Poecilia mexicana") && molly?.husbandryCaution?.includes("%25"), "Moli kimlik ve haftalık bakım güvenliğini açıklamalı");
const platy = speciesCatalog.find((item) => item.id === "platy");
assert.deepEqual(
  [platy?.scientificName,platy?.adultSizeCm,platy?.minVolumeL,platy?.minTankLengthCm,platy?.minGroup,platy?.temperature,platy?.ph,platy?.flow],
  ["Xiphophorus maculatus",6,45,60,3,[17,27],[7,8],"low"],
  "Plati kaynaklı boy, alan, sosyal yapı ve su eşiklerini taşımalı",
);
assert.equal(platy?.verifiedAt, "2026-10-03", "Plati güncel doğrulama tarihini taşımalı");
assert(platy?.husbandryCaution?.includes("melez") && platy?.husbandryCaution?.includes("%25"), "Plati ticari melezlik ve haftalık bakım güvenliğini açıklamalı");
const swordtail = speciesCatalog.find((item) => item.id === "swordtail");
assert.deepEqual(
  [swordtail?.scientificName,swordtail?.adultSizeCm,swordtail?.minVolumeL,swordtail?.minTankLengthCm,swordtail?.minGroup,swordtail?.temperature,swordtail?.ph,swordtail?.flow],
  ["Xiphophorus hellerii",14,80,91,3,[22,27],[7,8],"high"],
  "Kılıçkuyruk kaynaklı boy, alan, sosyal yapı, su ve akıntı eşiklerini taşımalı",
);
assert.equal(swordtail?.verifiedAt, "2026-10-03", "Kılıçkuyruk güncel doğrulama tarihini taşımalı");
assert(swordtail?.husbandryCaution?.includes("91 cm") && swordtail?.husbandryCaution?.includes("yüksek oksijen"), "Kılıçkuyruk uzunluk ve oksijen güvenliğini açıklamalı");
const emberTetra = speciesCatalog.find((item) => item.id === "ember-tetra");
assert.deepEqual(
  [emberTetra?.scientificName,emberTetra?.adultSizeCm,emberTetra?.minVolumeL,emberTetra?.minTankLengthCm,emberTetra?.minGroup,emberTetra?.temperature,emberTetra?.ph,emberTetra?.flow],
  ["Hyphessobrycon amandae",2,41,45,8,[20,28],[5,7],"low"],
  "Ember tetra kaynaklı boy, alan, sürü, su ve nazik akıntı eşiklerini taşımalı",
);
assert.equal(emberTetra?.verifiedAt, "2026-10-03", "Ember tetra güncel doğrulama tarihini taşımalı");
assert(emberTetra?.sourceUrl?.includes("seriouslyfish.com"), "Ember tetra ayrıntılı uzman bakım kaynağına bağlanmalı");
assert(emberTetra?.additionalSourceUrls?.some((url) => url.includes("fishbase.se")), "Ember tetra bilimsel boy kaynağıyla çapraz doğrulanmalı");
assert(emberTetra?.husbandryCaution?.includes("41 litre") && emberTetra?.husbandryCaution?.includes("nazik"), "Ember tetra alan ve filtrasyon güvenliğini açıklamalı");
const rummyNose = speciesCatalog.find((item) => item.id === "rummy-nose");
assert.deepEqual(
  [rummyNose?.scientificName,rummyNose?.adultSizeCm,rummyNose?.minVolumeL,rummyNose?.minTankLengthCm,rummyNose?.minGroup,rummyNose?.temperature,rummyNose?.ph,rummyNose?.flow],
  ["Petitella bleheri",5,120,90,10,[23,26],[5.5,7],undefined],
  "Kırmızı burun tetra güncel bilimsel adla kaynaklı boy, alan, sürü ve su eşiklerini taşımalı; akıntı tahmin edilmemeli",
);
assert.equal(rummyNose?.verifiedAt, "2026-10-03", "Kırmızı burun tetra güncel doğrulama tarihini taşımalı");
assert(rummyNose?.aliases?.includes("Hemigrammus bleheri"), "Kırmızı burun tetranın eski bilimsel adı aramada korunmalı");
assert(rummyNose?.additionalSourceUrls?.some((url) => url.includes("fishbase.se")) && rummyNose?.additionalSourceUrls?.some((url) => url.includes("fishipedia")), "Kırmızı burun tetra taksonomi, boy ve hacim kaynaklarını saklamalı");
assert(rummyNose?.husbandryCaution?.includes("120 litre/90 cm") && rummyNose?.husbandryCaution?.includes("tahmin edilmez"), "Kırmızı burun tetra alan, bakım ve belirsiz akıntı güvenliğini açıklamalı");
const harlequinRasbora = speciesCatalog.find((item) => item.id === "harlequin-rasbora");
assert.deepEqual(
  [harlequinRasbora?.scientificName,harlequinRasbora?.adultSizeCm,harlequinRasbora?.minVolumeL,harlequinRasbora?.minTankLengthCm,harlequinRasbora?.minGroup,harlequinRasbora?.temperature,harlequinRasbora?.ph,harlequinRasbora?.flow],
  ["Trigonostigma heteromorpha",5,54,60,8,[21,28],[5,7.5],"low"],
  "Harlequin rasbora kaynaklı boy, alan, sürü, su ve düşük akıntı eşiklerini taşımalı",
);
assert.equal(harlequinRasbora?.verifiedAt, "2026-10-03", "Harlequin rasbora güncel doğrulama tarihini taşımalı");
assert(harlequinRasbora?.aliases?.includes("Rasbora heteromorpha"), "Harlequin rasboranın eski bilimsel adı aramada korunmalı");
assert(harlequinRasbora?.husbandryCaution?.includes("54 litre") && harlequinRasbora?.husbandryCaution?.includes("5 cm"), "Harlequin rasbora alan ve koruyucu boy farkını açıklamalı");
for (const [id,sourceDomain,extraSourceCount] of [
  ["flowerhorn","fishkeeping.co.uk",1],
]) {
  const profile = speciesCatalog.find((item) => item.id === id);
  assert(profile, `${id} güvenilir kaynaklı Monster kataloğunda bulunmalı`);
  assert.equal(profile.verifiedAt, "2026-08-28", `${id} güncel doğrulama tarihini taşımalı`);
  assert(profile.sourceUrl?.includes(sourceDomain), `${id} yerel satış açıklaması yerine bilimsel veya uzman ana kaynağa bağlanmalı`);
  assert((profile.additionalSourceUrls?.length || 0) >= extraSourceCount, `${id} bağımsız güvenilir ek kaynakları saklamalı`);
  assert(profile.communityCaution, `${id} topluluk güvenlik uyarısını taşımalı`);
  assert(profile.husbandryCaution, `${id} yetişkin bakım uyarısını taşımalı`);
}
assert.equal(speciesCatalog.find((item) => item.id === "flowerhorn")?.speciesOnly, true, "Flowerhorn tek balıklı tür akvaryumu uyarısını taşımalı");

const cikletistAmericanMonsterInventory = [
  ["ASTRONOT BALIKLARI", "oscar"],
  ["SHORTBODY FLOWERHORN ÇEŞİTLERİ", "flowerhorn"],
  ["FLOWERHORN DAMIZLIK", "flowerhorn"],
  ["ÇİN EJDERİ", "chinese-high-fin-sucker"],
  ["FAHAKA PUFFER", "fahaka-puffer"],
];
assert.equal(cikletistAmericanMonsterInventory.length, 5, "Cikletist güncel Amerikan Tetra Monster kategorisindeki beş satış başlığının tamamı denetlenmeli");
for (const [retailName, expectedId] of cikletistAmericanMonsterInventory) {
  const matched = speciesForLivestock({commonName:retailName,category:"fish",quantity:1});
  if (expectedId) assert.equal(matched?.id, expectedId, `Amerikan Monster satış adı doğru güvenilir profile bağlanmalı: ${retailName}`);
  else assert.equal(matched, undefined, `Belirsiz Amerikan Monster satış adı bilimsel kimlik doğrulanmadan eşleştirilmemeli: ${retailName}`);
}

const cikletistCatfishInventory = [
  ["Süper Red Tül Kuyruk Cüce Vatoz", "ancistrus"],
  ["L144 Albino Cüce Vatoz", "ancistrus"],
  ["Otocınclus Profesyonel Yosun Yiyici", "otocinclus"],
  ["Borneo Kelebek Vatoz"],
  ["Sae Yosun Yiyici", "siamese-algae-eater"],
  ["DELHEZİ BİŞHİR", "delhezi-bichir"],
  ["RED TAİL CATFİSH", "redtail-catfish"],
  ["SİYAH CÜCE VATOZ", "ancistrus"],
  ["RED LİP STİCK GOBBY"],
  ["BLUE NEON GOBBY GOBİ"],
  ["HUJETA GAR", "hujeta-gar"],
  ["RED LİZARD ÇÖPÇÜ BALIKLARI", "red-whiptail-catfish"],
  ["SENEGAL BİŞİRLERİ", "senegal-bichir"],
  ["PENGASUS KÖPEK BALIKLARI", "iridescent-shark-catfish"],
  ["ORANGE VENEZUELA ÇÖPÇÜ BALIKLARI", "orange-venezuela-cory"],
  ["SİYAH LABEO BALIKLARI", "black-sharkminnow"],
  ["GREEN LAZER ÇÖPÇÜ BALIKLARI", "green-laser-cory-cw009"],
  ["RABAUTİ CORYDORAS ÇÖPÇÜ BALIKLARI", "rabauts-cory"],
  ["STERBAI ÇÖPÇÜ BALIKLARI", "sterbai-cory"],
  ["JULLY ÇÖPÇÜ BALIKLARI"],
  ["CÜCE OTOCINCLUS AFFİNİS PROFESYONEL YOSUN YİYİCİ", "otocinclus"],
  ["CW027 CORYDORAS", "highfin-spotted-cory-cw027"],
  ["KÜREK BURUN BALIKLARI"],
  ["PANDA GARRARUFA YOSUN YİYİCİ"],
  ["L144 TÜL DAMIZLIK", "ancistrus"],
  ["L-116 Hypostomus Sp", "red-fin-thresher-pleco-l116"],
  ["L-340 Mega Clown Pleco", "mega-clown-pleco-l340"],
  ["L-129 Zebra Pleco", "colombian-zebra-pleco-l129"],
  ["L-243 Peckoltia Sp.", "orange-tiger-pleco-l243"],
  ["L-091 Leporacanthicus Triactis", "three-beacon-pleco-l091"],
  ["L-201 Hypancistrus İnspector", "orinoco-angel-pleco-l201"],
  ["L-240 Vampir Pleco", "vampire-pleco-l240"],
  ["L-052 Pleco Dekeyseria Sp.", "butterfly-pleco-l052"],
  ["L-106 Red Peckoltia", "orange-seam-pleco-l106"],
  ["L-149 Ancistrus Brevifilis", "cucuta-bristlenose-l149"],
  ["LDA-72 Ancistrus Triradiatus", "three-ray-bristlenose-lda72"],
  ["L-128 Blue Phantom", "blue-phantom-pleco-l128"],
  ["L-239 Blue Panaque Pleco", "blue-panaque-l239"],
  ["L-146 Albino Pleco"],
  ["L-148 Total Spotted Pleco", "manacapuru-bristlenose-l148"],
  ["L-190 Royal Pleco", "royal-pleco-l190"],
  ["L-191 Broken Line Royal Pleco", "brokenline-royal-pleco-l191"],
  ["White Spotted Doras", "white-spotted-doras"],
  ["L-069 Peckoltia Ucayalensis"],
  ["L-244 Pseudolithoxus Dumus", "black-spotted-flyer-pleco-l244"],
  ["L-200A Hi-fin Green Phantom Pleco", "high-fin-green-phantom-l200a"],
  ["L-059A Ancistrus Hoplogenys", "blue-spotted-bristlenose-l059a"],
  ["L-235 Flyer Cat", "anthrax-flyer-pleco-l235"],
  ["CÜCE VATOZ SİYAH YAVRU", "ancistrus"],
  ["CÜCE VATOZ L144 TÜL YAVRU", "ancistrus"],
  ["LDA-38 HYPOSTOMUS PLECO", "orinoco-wood-pleco-lda38"],
  ["L-103 CLOWN PLECO", "peckoltia-l103"],
  ["L-127 ZEBRA PLECO", "lujans-pleco-l127"],
  ["L127 ZEBRA FAKE-PECKOLTİA PLECO LUJANİ (7 CM)", "lujans-pleco-l127"],
  ["COLOMBİAN FARLOWELLA"],
  ["L-128 PLECO VATOZ", "blue-phantom-pleco-l128"],
];
assert.equal(cikletistCatfishInventory.length, 56, "Cikletist Vatoz Kedi Balıkları kategorisinin üç sayfasındaki 56 satış başlığının tamamı denetlenmeli");
for (const [retailName, expectedId] of cikletistCatfishInventory) {
  const matched = speciesForLivestock({commonName:retailName,category:"fish",quantity:1});
  if (expectedId) assert.equal(matched?.id, expectedId, `Vatoz/kedi balığı satış adı doğru güvenilir profile bağlanmalı: ${retailName}`);
  else assert.equal(matched, undefined, `Bilimsel kimliği veya güvenli bakım eşikleri tamamlanmayan vatoz/kedi balığı adı tahminle eşleştirilmemeli: ${retailName}`);
}

const cikletistAmericanCichlidInventory = [
  ["ELECTRIC BLUE RAMİREZİ", "ramirezi"],
  ["ELECTRIC BLUE RAMİREZİ ", "ramirezi"],
  ["Elangatus Mpanga Ciklet", "elongatus-mpanga"],
  ["Altın Ramirezi", "ramirezi"],
  ["Discus", "discus"],
  ["Discus", "discus"],
  ["MELEK BALIKLARI", "angelfish"],
  ["GREEN SEVERUM CİKLET BALIKLARI", "severum"],
  ["ASTRONOT BALIKLARI", "oscar"],
  ["GREEN TERROR CİKLET BALIKLARI", "green-terror"],
  ["GEOPHAGUS WINEMILLER", "winemillers-eartheater"],
  ["ELECTRIC BLUE ACARA", "blue-acara"],
  ["GREEN TEXAS CİKLET BALIKLARI"],
  ["SHORTBODY FLOWERHORN ÇEŞİTLERİ", "flowerhorn"],
  ["CALVUS BALIKLARI", "calvus-cichlid"],
  ["VİEJA ARGENTEA ARGENTEUS", "silver-maskaheros"],
  ["ürün"],
  ["NADİR TÜR MİLOMO CİKLET", "super-vc10-milomo"],
  ["LEMON OSCAR NADİR TÜR", "oscar"],
  ["RED CHİLİ ASTRONOT NADİR TÜR", "oscar"],
  ["APİSTOGRAMMA AGASSİZİ FİRE RED", "apisto-agassizii"],
  ["YARASA MELEK BALIKLARI", "angelfish"],
  ["GEOPHAGUS THREADFİN ACARA HECKELLİ", "threadfin-acara"],
  ["RED RUBY CİKLET"],
  ["BORLEY KADANGO CİKLET", "redfin-borleyi"],
  ["JOHANNI CİKLET", "johanni-cichlid"],
  ["RED PANDA DİSCUS", "discus"],
  ["YELLOW PANDA PİGEON BLOOD DİSCUS", "discus"],
  ["BLUE DİAMOND DİSCUS BALIKLARI", "discus"],
  ["RED RUBY DİSCUS BALIKLARI", "discus"],
  ["YELLOW DİSCUS BALIKLARI", "discus"],
  ["İTHAL SARI İMPARATOR CİKLET"],
  ["İTHAL SARI İMPARATOR CİKLET"],
  ["COMPRESSİCEPS YAPRAK CİKLET", "malawi-eyebiter"],
  ["İTHAL ALTUM MELEK BALIKLARI", "altum-angelfish"],
  ["ARGUS BALIKLARI", "spotted-scat"],
  ["APİSTOGRAMMA AGASSİZİ DOUBLE RED", "apisto-agassizii"],
  ["ELECTRİC BLUE JACK DEMPSEY", "jack-dempsey"],
  ["MALAWİ CİKLET BALIKLARI"],
  ["FLOWERHORN DAMIZLIK", "flowerhorn"],
  ["İTHAL KARIŞIK CİKLET"],
  ["BLACK BELT CİKLET", "blackbelt-cichlid"],
  ["GEOPHAGUS HONGDEA"],
  ["GUİANACARA DACRYA", "teardrop-guianacara"],
  ["GUİANACARA OWROEWEFİ", "owroewefi-guianacara"],
  ["KRİBENSİS ALBİNO", "kribensis"],
  ["THREADFIN HECHELLİ GEOPHAGUS", "threadfin-acara"],
  ["ELEKTRİK BLUE ACARA S BOY", "blue-acara"],
  ["ORANGE MARBLE MELEK BALIKLARI", "angelfish"],
  ["CİKLET M BOY A KALİTE"],
  ["Persei Ciklet", "pantano-cichlid"],
  ["Yeşil Teksas Ciklet"],
  ["RED SEVERUM", "severum"],
];
assert.equal(cikletistAmericanCichlidInventory.length, 53, "Cikletist Amerikan Cikletleri kategorisinin üç sayfasındaki 53 satış başlığının tamamı denetlenmeli");
for (const [retailName, expectedId] of cikletistAmericanCichlidInventory) {
  const matched = speciesForLivestock({commonName:retailName,category:"fish",quantity:1});
  if (expectedId) assert.equal(matched?.id, expectedId, `Amerikan ciklet satış adı doğru güvenilir profile bağlanmalı: ${retailName}`);
  else assert.equal(matched, undefined, `Bilimsel kimliği veya güvenli bakım eşikleri tamamlanmayan Amerikan ciklet adı tahminle eşleştirilmemeli: ${retailName}`);
}

const cikletistMalawiInventory = [
  ["MAVİ İMPARATOR TETRA", "blue-emperor-tetra"],
  ["Şeker Pembe Ciklet"],
  ["Litobades Sülfür Kafa Ciklet", "sulphur-head-hap"],
  ["Ciklet Balıkları"],
  ["AHLİ CİKLET", "electric-blue-hap"],
  ["RED BORLEY KADANGO", "redfin-borleyi"],
  ["YAŞAYAN KAYA CİKLET", "livingstonii-cichlid"],
  ["CİKLET M BOY A KALİTE"],
  ["YUNUS ORTA BOY", "blue-dolphin-cichlid"],
  ["Persei Ciklet", "pantano-cichlid"],
  ["Yeşil Teksas Ciklet"],
  ["MONO ARGENTUS", "silver-mono"],
  ["GREEN YEŞİL ARGUS", "spotted-scat"],
];
assert.equal(cikletistMalawiInventory.length, 13, "Cikletist güncel Malawi kategorisindeki 13 satış başlığının tamamı denetlenmeli");
for (const [retailName, expectedId] of cikletistMalawiInventory) {
  const matched = speciesForLivestock({commonName:retailName,category:"fish",quantity:1});
  if (expectedId) assert.equal(matched?.id, expectedId, `Malawi sayfasındaki satış adı doğru güvenilir profile bağlanmalı: ${retailName}`);
  else assert.equal(matched, undefined, `Bilimsel kimliği belirsiz veya genel Malawi satış adı tahminle eşleştirilmemeli: ${retailName}`);
}

const cikletistDwarfCichlidInventory = [
  ["ALTIN RAMİREZİ", "ramirezi"],
  ["ELECTRIC BLUE RAMİREZİ", "ramirezi"],
  ["ELECTRIC BLUE RAMİREZİ", "ramirezi"],
  ["Altın Ramirezi", "ramirezi"],
  ["Kribensis", "kribensis"],
  ["TÜL GOLD GERMAN RAMİREZİ", "ramirezi"],
  ["ELECTRIC BLUE ACARA", "blue-acara"],
  ["APİSTOGRAMMA KAKADU", "apisto-cacatuoides"],
  ["APİSTOGRAMMA HONGSLOİ", "apisto-hongsloi"],
  ["APİSTOGRAMMA BORELLİ OPAL", "apisto-borellii"],
  ["BLACK RAMİREZİ", "ramirezi"],
  ["ELEKTRİK BLUE ACARA S BOY", "blue-acara"],
  ["APİSTOGRAMMA NİJSSENİ RİO UCAYALİ", "apisto-nijsseni"],
  ["APİSTOGRAMMA BAENSCHİ", "apisto-baenschi"],
  ["APİSTOGRAMMA HONGSLOİ RED-GOLD", "apisto-hongsloi"],
  ["APİSTOGRAMMA MACMASTERİ \"GOLD/SUPER RED SHOULDER\"", "apisto-macmasteri"],
  ["APİSTOGRAMMA BORELLİİ OPAL", "apisto-borellii"],
  ["APİSTOGRAMMA ERYTHRURA", "apisto-erythrura"],
  ["APİSTOGRAMMA TRİFASCİATA", "apisto-trifasciata"],
  ["APİSTOGRAMMA COMMBRAE", "apisto-commbrae"],
  ["APİSTOGRAMMA PANDURO", "apisto-panduro"],
  ["APİSTOGRAMMA MENDEZİ SANTA İSABEL RED", "apisto-mendezi"],
  ["APİSTOGRAMMA AGASSİZİ RİO MİUA", "apisto-agassizii"],
  ["APİSTOGRAMMA MACMASTERİ \"RED SHOULDER\"", "apisto-macmasteri"],
  ["OCELLARIS PEACOCK BASS", "ocellaris-peacock-bass"],
  ["SAJİCA CİKLET", "sajica-cichlid"],
];
assert.equal(cikletistDwarfCichlidInventory.length, 26, "Cikletist Cüce Cikletler kategorisinin iki sayfasındaki 26 satış başlığının tamamı denetlenmeli");
for (const [retailName, expectedId] of cikletistDwarfCichlidInventory) {
  const matched = speciesForLivestock({commonName:retailName,category:"fish",quantity:1});
  if (expectedId) assert.equal(matched?.id, expectedId, `Cüce ciklet sayfasındaki satış adı doğru güvenilir profile bağlanmalı: ${retailName}`);
  else assert.equal(matched, undefined, `Bilimsel kimliği veya güvenli bakım eşiği tamamlanmayan cüce ciklet sayfası adı tahminle eşleştirilmemeli: ${retailName}`);
}

const redhumpEartheater = speciesForCatalogExactSearch("Geophagus steindachneri", "fish", "freshwater");
assert.deepEqual(
  [redhumpEartheater?.id, redhumpEartheater?.adultSizeCm, redhumpEartheater?.minVolumeL, redhumpEartheater?.minTankLengthCm, redhumpEartheater?.minGroup, redhumpEartheater?.temperature, redhumpEartheater?.ph, redhumpEartheater?.flow],
  ["redhump-eartheater", 19.8, 243, 120, 4, [20, 30], [6, 7.5], undefined],
  "Geophagus steindachneri bilimsel boy ve kaynaklı yetişkin bakım eşikleriyle bulunmalı",
);
assert.equal(speciesForCatalogExactSearch("Geophagus hondae", "fish", "freshwater")?.id, "redhump-eartheater", "Geophagus hondae doğrulanmış eş anlamlı olarak steindachneri profiline bağlanmalı");
assert.equal(speciesForCatalogExactSearch("GEOPHAGUS HONGDEA", "fish", "freshwater"), undefined, "Kanıtlanmamış Hongdea yazımı hondae eş anlamlısına tahminle dönüştürülmemeli");
assert(redhumpEartheater?.husbandryCaution?.includes("yüzde 40–70"), "Redhump Eartheater kaynaklı su değişimi ve kum güvenliği uyarısını taşımalı");
assert(redhumpEartheater?.additionalSourceUrls?.some((url) => url.includes("SynonymSummary")), "Redhump Eartheater hondae eş anlamlısının taksonomi kaynağını taşımalı");
const unresolvedHongdea = unresolvedSpeciesForSearch("GEOPHAGUS HONGDEA", "fish", "freshwater");
assert.equal(unresolvedHongdea?.verifiedAt, "2026-09-19", "Hongdea belirsizlik kaydı güncel doğrulama tarihini taşımalı");
assert(unresolvedHongdea?.reason.includes("harf hatası olduğu kanıtlanmadan"), "Hongdea kaydı olası yazım hatasını neden otomatik eşleştirmediğini açıklamalı");

const cikletistTropheusTanganyikaInventory = [
  ["İKOLA KAISER TROPHEUS", "tropheus-ikola"],
  ["DEMASONİ BALIKLARI", "demasoni-cichlid"],
  ["TROPHEUS KRİZA GOLD", "tropheus-kiriza"],
  ["TROPHEUS BLACK KRİZA", "tropheus-kiriza"],
  ["TROPHEUS RED BELLY"],
];
assert.equal(cikletistTropheusTanganyikaInventory.length, 5, "Cikletist güncel Tropheus/Tanganyika kategorisindeki beş satış başlığının tamamı denetlenmeli");
for (const [retailName, expectedId] of cikletistTropheusTanganyikaInventory) {
  const matched = speciesForLivestock({commonName:retailName,category:"fish",quantity:1});
  if (expectedId) assert.equal(matched?.id, expectedId, `Tropheus/Tanganyika satış adı doğru güvenilir profile bağlanmalı: ${retailName}`);
  else assert.equal(matched, undefined, `Bilimsel kimliği belirsiz Tropheus ticari adı tahminle eşleştirilmemeli: ${retailName}`);
}

const ikolaTropheus = speciesCatalog.find((item) => item.id === "tropheus-ikola");
assert.deepEqual([ikolaTropheus?.minVolumeL, ikolaTropheus?.minTankLengthCm, ikolaTropheus?.minGroup], [400, 120, 10], "Ikola Kaiser küçük tank veya küçük grup için önerilmemeli");
assert.equal(ikolaTropheus?.speciesOnly, true, "Ikola Kaiser özel Tanganika kurulumu uyarısı taşımalı");
const kirizaTropheus = speciesCatalog.find((item) => item.id === "tropheus-kiriza");
assert.deepEqual([kirizaTropheus?.minVolumeL, kirizaTropheus?.minTankLengthCm, kirizaTropheus?.minGroup], [375, 150, 10], "Kiriza Tropheus küçük tank veya küçük grup için önerilmemeli");
assert.equal(speciesForLivestock({commonName:"Kiriza Gold",category:"fish",quantity:1})?.id, "tropheus-kiriza", "Kiriza Gold ayrı tür gibi değil Kiriza renk formu olarak eşleşmeli");

const cikletistShrimpCrayfishInventory = [
  ["KIRMIZI RİLİ KARİDES 4 ADET", "red-rili-shrimp"],
  ["TURUNCU RİLİ KARİDES 4 ADET", "orange-rili-shrimp"],
  ["AMERİKAN KEREVİTLERİ"],
  ["KARBON RİLİ KARİDES 4 ADET", "carbon-rili-shrimp"],
  ["KIRMIZI SAKURA KARİDES 4 ADET", "red-sakura-shrimp"],
  ["YEŞİL JELLY KARİDES 4 ADET", "green-jelly-shrimp"],
  ["KİRAZ KARİDES 4 ADET", "cherry-shrimp"],
  ["Bloody Marry Karides 4 ADET", "bloody-mary-shrimp"],
  ["TURUNCU SAKURA KARİDES 4 ADET", "orange-sakura-shrimp"],
  ["SARI ATEŞ NEON KARİDES 3 ADET", "yellow-fire-shrimp"],
  ["Karışık Karides Paketi 10 ADET"],
  ["CARİDİNA BLACK FANCY KARİDES 2 ADET", "black-fancy-tiger-shrimp"],
  ["CARİDİNA PRL KRİSTAL KARİDES 2 ADET", "prl-shrimp"],
  ["CARİDİNA PİNTO KARİDES 2 ADET"],
  ["CARİDİNA BLACK PİNTO KARİDES 2 ADET", "black-pinto-shrimp"],
  ["CARİDİNA BLUE BOLT KARİDES 2 ADET", "blue-bolt-shrimp"],
  ["Siyah Gül Karides 4 adet", "black-rose-shrimp"],
  ["MAVİ MELEK KARİDES 4 ADET", "blue-angel-shrimp"],
  ["ÇİKOLATA KARİDES 4 ADET", "chocolate-shrimp"],
  ["Amano Karides Yosun Avcısı Straforlu Gönderim 3 Adet", "amano-shrimp"],
  ["DİMİNİTUS CÜCE KEREVİT 3 ADET", "least-dwarf-crayfish"],
  ["CARİDİNA GALAXY FİSHBONE KARİDES 2 ADET"],
  ["CARİDİNA KAPLAN KARİDES 2 ADET", "tiger-shrimp"],
  ["CARİDİNA RED FANCY KARİDES 2 ADET", "red-fancy-tiger-shrimp"],
  ["SNOW WHİTE KARİDES", "snow-white-shrimp"],
  ["PİNTO MELEZ KARİDESLER"],
  ["Amano Karides Yosun Avcısı Straforlu Gönderim 3 Adet", "amano-shrimp"],
  ["DİMİNİTUS CÜCE KEREVİT 3 ADET", "least-dwarf-crayfish"],
  ["GEOSESARMA DENNERLE HALLOWEEN VAMPIRE CRAB TANGERİNE VAMPİR YENGEÇ (STRAFOR+ISITICILI GÖNDERİM,AÇIKLAMAYI OKUYUNUZ)"],
  ["GEOSESARMA TRİCOLOR VAMPİRE CRAB"],
  ["ASSORTED VAMPİRE CRAB ORANGE"],
  ["RED DEVİL VAMPİRE CRAB ORANGE"],
  ["MAVİ JELLY KARİDES", "blue-jelly-shrimp"],
];
assert.equal(cikletistShrimpCrayfishInventory.length, 33, "Cikletist Karides/Kerevit kategorisinin iki sayfasındaki 33 satış satırının tamamı denetlenmeli");
for (const [retailName, expectedId] of cikletistShrimpCrayfishInventory) {
  const matched = speciesForLivestock({commonName:retailName,category:"other",quantity:1});
  if (expectedId) assert.equal(matched?.id, expectedId, `Karides/kerevit satış adı doğru güvenilir profile bağlanmalı: ${retailName}`);
  else assert.equal(matched, undefined, `Belirsiz satış adı bilimsel kimlik veya uygun yaşam modeli olmadan eşleştirilmemeli: ${retailName}`);
}
const unresolvedMixedShrimpPack = unresolvedSpeciesForSearch("Karışık Karides Paketi 10 ADET", "shrimp", "freshwater");
assert.equal(unresolvedMixedShrimpPack?.name, "Karışık Karides Paketi 10 ADET", "İçeriği stokla değişen karışık karides paketi kullanıcıya görünür güvenlik kaydıyla bulunmalı");
assert.equal(unresolvedMixedShrimpPack?.verifiedAt, "2026-09-19", "Karışık karides paketi güncel kaynak denetim tarihini taşımalı");
assert(unresolvedMixedShrimpPack?.reason.includes("stok durumuna göre") && unresolvedMixedShrimpPack.reason.includes("Neocaridina") && unresolvedMixedShrimpPack.reason.includes("Caridina"), "Karışık karides paketi değişken içerik ve tür kaynaklı su gereksinimi riskini açıklamalı");
assert.equal(unresolvedSpeciesForSearch("Karışık Karides Paketi", "shrimp", "saltwater"), undefined, "Karışık tatlı su karides paketi deniz akvaryumunda görünmemeli");
const unresolvedPintoHybrid = unresolvedSpeciesForSearch("PİNTO MELEZ KARİDESLER", "shrimp", "freshwater");
assert.equal(unresolvedPintoHybrid?.name, "PİNTO MELEZ KARİDESLER", "Pinto melez satış adı kullanıcıya görünür güvenlik kaydıyla bulunmalı");
assert.equal(unresolvedPintoHybrid?.verifiedAt, "2026-09-19", "Pinto melez kaydı güncel kaynak denetim tarihini taşımalı");
assert(unresolvedPintoHybrid?.reason.includes("Caridina serrata") && unresolvedPintoHybrid.reason.includes("ebeveynleri") && unresolvedPintoHybrid.reason.includes("nesli"), "Pinto melez kaydı tek tür varsaymadan hibrit köken belirsizliğini açıklamalı");
assert.equal(unresolvedPintoHybrid?.additionalSourceUrls.length, 3, "Pinto melez kaydı üretici damızlık kataloğu ve iki bağımsız hobi kaynağı taşımalı");
assert.equal(unresolvedSpeciesForSearch("Pinto Mischling Shrimp", "shrimp", "saltwater"), undefined, "Pinto melez güvenlik kaydı deniz akvaryumunda görünmemeli");
const unresolvedVampireCrabNames = [
  "GEOSESARMA DENNERLE HALLOWEEN VAMPIRE CRAB TANGERİNE VAMPİR YENGEÇ (STRAFOR+ISITICILI GÖNDERİM,AÇIKLAMAYI OKUYUNUZ)",
  "GEOSESARMA TRİCOLOR VAMPİRE CRAB",
  "ASSORTED VAMPİRE CRAB ORANGE",
  "RED DEVİL VAMPİRE CRAB ORANGE",
];
for (const retailName of unresolvedVampireCrabNames) {
  const unresolved = unresolvedSpeciesForSearch(retailName, "other", "freshwater");
  assert.equal(unresolved?.name, retailName, `${retailName} kullanıcıya görünür güvenlik kaydıyla bulunmalı`);
  assert.equal(unresolved?.verifiedAt, "2026-09-19", `${retailName} güncel paludaryum denetim tarihini taşımalı`);
  assert(unresolved?.reason.includes("yarı karasal"), `${retailName} tamamen sucul canlı gibi sunulmamalı`);
  assert(unresolved?.reason.includes("paludaryum"), `${retailName} kara alanı gereksinimini açıklamalı`);
  assert.equal(unresolvedSpeciesForSearch(retailName, "other", "saltwater"), undefined, `${retailName} deniz akvaryumu aramasında görünmemeli`);
}
assert(unresolvedSpeciesForSearch("Geosesarma dennerle Halloween", "other", "freshwater")?.reason.includes("nem"), "Geosesarma dennerle kaydı paludaryum nem gereksinimini açıklamalı");
assert(unresolvedSpeciesForSearch("Red Devil Vampire Crab", "other", "freshwater")?.reason.includes("Geosesarma hagen"), "Red Devil adı olası fakat kanıtlanmamış G. hagen kimliğini açıklamalı");
for (const id of ["red-rili-shrimp", "orange-rili-shrimp", "carbon-rili-shrimp", "green-jelly-shrimp", "chocolate-shrimp"]) {
  const profile = speciesCatalog.find((item) => item.id === id);
  assert.equal(profile?.scientificName, "Neocaridina davidi", `${id} satış rengi ayrı tür gibi tanımlanmamalı`);
  assert.equal(profile?.verifiedAt, "2026-08-29", `${id} güncel doğrulama tarihi taşımalı`);
  assert(profile?.additionalSourceUrls?.some((url) => url.startsWith("https://www.cikletistpetshop.com/")), `${id} doğrulanan yerel satış kaynağını taşımalı`);
}
const unresolvedTangerineTiger = unresolvedSpeciesForSearch("Tangerine Tiger Shrimp", "shrimp", "freshwater");
assert.equal(unresolvedTangerineTiger?.verifiedAt, "2026-09-19", "Tangerine Tiger bilimsel kimlik çelişkisi güncel denetim tarihini taşımalı");
for (const scientificName of ["Caridina serrata", "Caridina cantonensis", "Caridina mariae"]) {
  assert(unresolvedTangerineTiger?.reason.includes(scientificName), `Tangerine Tiger güvenlik kaydı çelişen ${scientificName} kimliğini açıklamalı`);
}
assert.equal(unresolvedTangerineTiger?.additionalSourceUrls.length, 4, "Tangerine Tiger kaydı taksonomi ve ticari kullanım çelişkisini ayrı kaynaklarla göstermeli");
assert.equal(speciesForCatalogExactSearch("Tangerine Tiger Shrimp", "shrimp", "freshwater"), undefined, "Bilimsel türü doğrulanmayan Tangerine Tiger güvenli profile otomatik bağlanmamalı");
assert.equal(unresolvedSpeciesForSearch("Tangerine Tiger Shrimp", "shrimp", "saltwater"), undefined, "Tangerine Tiger güvenlik kaydı deniz akvaryumunda görünmemeli");
const serrataDwarfShrimp = speciesCatalog.find((item) => item.id === "serrata-dwarf-shrimp");
assert.deepEqual([serrataDwarfShrimp?.scientificName, serrataDwarfShrimp?.adultSizeCm, serrataDwarfShrimp?.minVolumeL, serrataDwarfShrimp?.minTankLengthCm, serrataDwarfShrimp?.minGroup], ["Caridina serrata", 3, 20, undefined, 10], "Caridina serrata kaynaklı kimlik, boy, hacim ve grup eşiklerini taşımalı");
assert.deepEqual([serrataDwarfShrimp?.temperature, serrataDwarfShrimp?.ph, serrataDwarfShrimp?.flow], [[22, 26], [6, 7], "low"], "Caridina serrata kaynaklı su gereksinimlerini taşımalı");
assert.equal(serrataDwarfShrimp?.speciesOnly, true, "Caridina serrata bilimsel kimliği doğrulanmış ayrı koloni profili olmalı");
assert(serrataDwarfShrimp?.husbandryCaution?.includes("Tangerine Tiger") && serrataDwarfShrimp.husbandryCaution.includes("Pinto/Mischling"), "Caridina serrata ticari hat adlarıyla otomatik eşlenmeme uyarısını taşımalı");
assert(serrataDwarfShrimp?.tankLengthDataNote?.includes("tahmin edilmedi"), "Caridina serrata yayımlanmayan akvaryum uzunluğunu tahmin etmemeli");
assert.equal(speciesForCatalogExactSearch("Caridina serrata", "shrimp", "freshwater")?.id, "serrata-dwarf-shrimp", "Kesin Caridina serrata adı doğru profili bulmalı");
assert.equal(speciesForCatalogExactSearch("Tangerine Tiger Shrimp", "shrimp", "freshwater"), undefined, "Caridina serrata profili belirsiz Tangerine Tiger ticari adını üstlenmemeli");

const greenNeon = speciesCatalog.find((item) => item.id === "green-neon-tetra");
assert.equal(greenNeon?.minGroup, 10, "Green Neon tetra küçük bir grup yerine güvenli sürü sayısıyla önerilmeli");
assert.equal(greenNeon?.flow, "low", "Green Neon tetra düşük akış gereksinimini taşımalı");
const blackGhost = speciesCatalog.find((item) => item.id === "black-ghost-knifefish");
assert.equal(blackGhost?.minVolumeL, 454, "Yetişkin Black Ghost bıçak balığı küçük akvaryuma önerilmemeli");
assert.equal(blackGhost?.predatory, true, "Black Ghost küçük canlılar için avcı riski taşımalı");
assert((blackGhost?.adultSizeCm || 0) >= 45, "Black Ghost yetişkin boyu yavru satış boyuyla karıştırılmamalı");
for (const [id, minVolumeL, minTankLengthCm, minGroup] of [
  ["tinfoil-barb", 1500, 200, 6],
  ["spotted-silver-dollar", 304, 152, 6],
  ["bala-shark", 864, 240, 5],
]) {
  const profile = speciesCatalog.find((item) => item.id === id);
  assert(profile, `${id} büyük tür kataloğunda bulunmalı`);
  assert.equal(speciesGroup(profile), "monster", `${id} monster / büyük türler başlığında bulunmalı`);
  assert.equal(profile.minVolumeL, minVolumeL, `${id} yetişkin sürü hacmi korunmalı`);
  assert.equal(profile.minTankLengthCm, minTankLengthCm, `${id} yetişkin yüzme alanı korunmalı`);
  assert.equal(profile.minGroup, minGroup, `${id} tekli veya küçük grup olarak önerilmemeli`);
  assert(profile.husbandryCaution, `${id} özel yetişkin bakım uyarısı taşımalı`);
}
assert.equal(speciesCatalog.find((item) => item.id === "tinfoil-barb")?.predatory, true, "Tinfoil barb küçük balıklar için yutma riski taşımalı");
assert.equal(speciesCatalog.find((item) => item.id === "spotted-silver-dollar")?.predatory, true, "Benekli Silver Dollar lokma boyundaki balıklar için risk taşımalı");
const convict = speciesCatalog.find((item) => item.id === "convict-cichlid");
assert.equal(convict?.speciesOnly, true, "Convict ciklet agresiflik nedeniyle tür akvaryumu uyarısı taşımalı");
assert.equal(convict?.minTankLengthCm, 120, "Convict ciklet için doğrulanan dört fit akvaryum uzunluğu korunmalı");
const demasoni = speciesCatalog.find((item) => item.id === "demasoni-cichlid");
assert.equal(demasoni?.minGroup, 6, "Demasoni tek eş yerine saldırganlığı dağıtan kalabalık haremle önerilmeli");
assert((demasoni?.ph[0] || 0) >= 7.5, "Demasoni asidik topluluk akvaryumuna uygun gösterilmemeli");
const saulosi = speciesCatalog.find((item) => item.id === "saulosi-cichlid");
assert.equal(saulosi?.minVolumeL, 150, "Saulosi için yaklaşık 40 galon alt sınırı korunmalı");
const bolivianRam = speciesCatalog.find((item) => item.id === "bolivian-ram");
assert.equal(bolivianRam?.minTankLengthCm, 75, "Bolivian Ram çifti için doğrulanan 30 inç akvaryum uzunluğu korunmalı");
assert.deepEqual(bolivianRam?.temperature, [23, 28], "Bolivian Ram sıcaklık aralığı doğrulanan bakım değerlerini taşımalı");
const multifasciatus = speciesCatalog.find((item) => item.id === "multifasciatus-shelldweller");
assert.equal(multifasciatus?.minGroup, 6, "Multifasciatus tek balık yerine koloni düzeniyle önerilmeli");
assert.equal(multifasciatus?.speciesOnly, true, "Multifasciatus özel Tanganyika kurulumu uyarısı taşımalı");
assert((multifasciatus?.ph[0] || 0) >= 8, "Multifasciatus asidik topluluk akvaryumuna uygun gösterilmemeli");
const marliersJulie = speciesCatalog.find((item) => item.id === "marliers-julie");
assert.equal(marliersJulie?.minTankLengthCm, 120, "Marlier's Julie için doğrulanan dört fit akvaryum uzunluğu korunmalı");
assert.equal(marliersJulie?.speciesOnly, true, "Marlier's Julie özel Tanganyika kurulumu uyarısı taşımalı");
const turquoiseRainbow = speciesCatalog.find((item) => item.id === "turquoise-rainbowfish");
assert.equal(turquoiseRainbow?.minTankLengthCm, 120, "Turquoise gökkuşağı için dört fit yüzme alanı korunmalı");
assert.equal(turquoiseRainbow?.flow, "high", "Hızlı yüzen Turquoise gökkuşağı yüksek akış ihtiyacını taşımalı");
assert(speciesCatalog.filter((item) => speciesGroup(item) === "rainbowfish").length >= 10, "Gökkuşağı balığı kataloğu yaygın küçük ve iri türleri kapsamalı");
for (const [id, minGroup, flow] of [
  ["red-rainbowfish", 6, "medium"],
  ["parkinsons-rainbowfish", 6, "high"],
  ["madagascar-rainbowfish", 10, "low"],
]) {
  const profile = speciesCatalog.find((item) => item.id === id);
  assert(profile, `${id} gökkuşağı balığı kataloğunda bulunmalı`);
  assert.equal(profile.minVolumeL, 250, `${id} küçük akvaryuma önerilmemeli`);
  assert.equal(profile.minTankLengthCm, 120, `${id} dört fitten kısa yüzme alanına önerilmemeli`);
  assert.equal(profile.minGroup, minGroup, `${id} güvenli sürü sayısını taşımalı`);
  assert.equal(profile.flow, flow, `${id} doğru akıntı gereksinimini taşımalı`);
}
assert.deepEqual(speciesCatalog.find((item) => item.id === "madagascar-rainbowfish")?.ph, [5, 7], "Madagaskar gökkuşağı sert alkali suya uygun gösterilmemeli");
const gardneri = speciesCatalog.find((item) => item.id === "gardneri-killifish");
assert.equal(gardneri?.speciesOnly, true, "Gardneri killifish tür akvaryumu uyarısı taşımalı");
const goldenWonder = speciesCatalog.find((item) => item.id === "golden-wonder-killifish");
assert.equal(goldenWonder?.predatory, true, "Golden Wonder küçük balık ve karidesler için avlanma riski taşımalı");
const rainbowShiner = speciesCatalog.find((item) => item.id === "rainbow-shiner");
assert.equal(rainbowShiner?.temperature[1], 22, "Rainbow Shiner tropikal sıcaklıklara uygun gösterilmemeli");
assert.equal(rainbowShiner?.flow, "high", "Rainbow Shiner hızlı akarsu gereksinimini taşımalı");
const peacockGudgeon = speciesCatalog.find((item) => item.id === "peacock-gudgeon");
assert.equal(peacockGudgeon?.minGroup, 6, "Peacock Gudgeon gevşek sürü davranışı için en az altılı grupla önerilmeli");
const empireGudgeon = speciesCatalog.find((item) => item.id === "empire-gudgeon");
assert.equal(empireGudgeon?.predatory, true, "Empire Gudgeon küçük balıklar için avlanma riski taşımalı");
const dwarfChainLoach = speciesCatalog.find((item) => item.id === "dwarf-chain-loach");
assert.equal(dwarfChainLoach?.minGroup, 7, "Cüce zincir loach tek veya küçük grupla önerilmemeli");
const pepperedCory = speciesCatalog.find((item) => item.id === "peppered-cory");
assert.equal(pepperedCory?.temperature[0], 15, "Benekli çöpçünün serin su toleransı korunmalı");
const apistoCommbrae = speciesCatalog.find((item) => item.id === "apisto-commbrae");
assert.deepEqual(
  [apistoCommbrae?.scientificName, apistoCommbrae?.adultSizeCm, apistoCommbrae?.minVolumeL, apistoCommbrae?.minTankLengthCm, apistoCommbrae?.minGroup, apistoCommbrae?.temperature, apistoCommbrae?.ph, apistoCommbrae?.flow],
  ["Apistogramma commbrae", 4, 50, undefined, 2, [23, 28], [5, 7], undefined],
  "Apistogramma commbrae yalnız yayımlanmış tür bazlı bakım eşiklerini taşımalı",
);
assert(apistoCommbrae?.tankLengthDataNote?.includes("uzunluk değeri tahmin edilmedi"), "Apistogramma commbrae yayımlanmayan tank uzunluğunu açıkça belirtmeli");
assert.equal(apistoCommbrae?.additionalSourceUrls?.length, 3, "Apistogramma commbrae kimlik ve Türkiye satış adı kaynaklarını saklamalı");
assert.equal(apistoCommbrae?.verifiedAt, "2026-08-31", "Apistogramma commbrae güncel doğrulama tarihini taşımalı");
const ocellarisPeacockBass = speciesCatalog.find((item) => item.id === "ocellaris-peacock-bass");
assert.deepEqual(
  [ocellarisPeacockBass?.scientificName, ocellarisPeacockBass?.adultSizeCm, ocellarisPeacockBass?.minVolumeL, ocellarisPeacockBass?.minTankLengthCm, ocellarisPeacockBass?.minGroup, ocellarisPeacockBass?.temperature, ocellarisPeacockBass?.ph, ocellarisPeacockBass?.flow],
  ["Cichla ocellaris", 74, 5000, 300, 5, [24, 27], [6.5, 7.5], "high"],
  "Ocellaris Peacock Bass dev sürü avcısı için yayımlanmış güvenli eşikleri taşımalı",
);
assert.equal(ocellarisPeacockBass?.predatory, true, "Ocellaris Peacock Bass küçük canlılar için avlanma riski taşımalı");
assert.equal(ocellarisPeacockBass?.speciesOnly, true, "Ocellaris Peacock Bass sıradan topluluk canlısı gibi sunulmamalı");
assert.equal(ocellarisPeacockBass?.additionalSourceUrls?.length, 2, "Ocellaris Peacock Bass kimlik ve Türkiye satış adı kaynaklarını saklamalı");
assert.deepEqual(ocellarisPeacockBass?.waterTypes, ["freshwater"], "Ocellaris Peacock Bass akvaryum profilinde güvenli tatlı su kapsamını taşımalı");
assert(ocellarisPeacockBass?.husbandryCaution?.includes("10–20 kat") && ocellarisPeacockBass?.husbandryCaution?.includes("74 cm"), "Ocellaris Peacock Bass kaynaklı filtrasyon ve boy güvenliğini açıklamalı");
assert.equal(ocellarisPeacockBass?.verifiedAt, "2026-10-02", "Ocellaris Peacock Bass güncel doğrulama tarihini taşımalı");
assert.equal(speciesCatalog.filter((item) => speciesGroup(item) === "cichlid").length, 73, "Cichlid kataloğu doğrulanmış Geophagus steindachneri profili dahil 73 profil içermeli");
assert.equal(speciesCatalog.filter((item) => speciesGroup(item) === "bottom").length, 74, "Dip balığı kataloğu ayrı Beaufortia kweichowensis, Gastromyzon stellatus ve Farlowella vittata; gerçek Julii, doğrulanmış Garra türleri, Ninja woodcat ve kesin L146/Ucayalensis profilleri dahil 74 profil içermeli");
assert.equal(speciesCatalog.filter((item) => speciesGroup(item) === "goby").length, 12, "Goby kataloğu üç ayrı Lipstick Sicyopus türü ve yinelenmeyen iki Blue Neon adayı dahil 12 benzersiz profil içermeli");
assert.equal(speciesCatalog.filter((item) => speciesGroup(item) === "crayfish").length, 4, "Kerevit kataloğu Cambarellus diminutus dahil dört tür içermeli");
for (const [id,group,volume,length,count,temperature,ph,flow] of [
  ["goldeneye-dwarf-cichlid","cichlid",80,80,2,[22,25],[6,7.2],"low"],
  ["checkerboard-cichlid","cichlid",120,100,3,[24,30],[4.5,7],"low"],
  ["napo-cory","bottom",60,60,6,[22,26],[6,7.4],"medium"],
  ["smudge-spot-cory","bottom",100,60,8,[21,27],[6.8,7.2],"medium"],
  ["panda-loach","bottom",80,60,5,[20,23],[6.5,7.5],"high"],
  ["c125-red-aspidoras","bottom",60,60,6,[20,26],[6,7.5],"high"],
  ["black-venezuela-cory","bottom",60,60,6,[22,26],[6,7.5],"medium"],
  ["royal-farlowella","bottom",120,120,2,[24,30],[6,7.5],"high"],
  ["least-dwarf-crayfish","crayfish",20,30,1,[20,26],[6.5,8],"low"],
]) {
  const profile=speciesCatalog.find((item)=>item.id===id);
  assert(profile,id+" yerel canlı karşılaştırmasından sonra katalogda bulunmalı");
  assert.deepEqual(
    [speciesGroup(profile),profile.minVolumeL,profile.minTankLengthCm,profile.minGroup,profile.temperature,profile.ph,profile.flow],
    [group,volume,length,count,temperature,ph,flow],
    id+" doğrulanmış hacim, uzunluk, grup ve su gereksinimlerini taşımalı",
  );
  assert.equal(profile.verifiedAt,"2026-08-27",id+" güncel doğrulama tarihini taşımalı");
  assert(profile.husbandryCaution,id+" özel bakım uyarısını taşımalı");
}
for (const id of ["tinfoil-barb", "spotted-silver-dollar", "bala-shark"]) {
  const profile = speciesCatalog.find((item) => item.id === id);
  assert.equal(profile?.verifiedAt, "2026-09-10", `${id} güncel kaynak denetim tarihini taşımalı`);
  assert((profile?.additionalSourceUrls?.length || 0) >= 1, `${id} bakım veya bilimsel ek kaynağa bağlanmalı`);
}
assert(speciesCatalog.find((item) => item.id === "spotted-silver-dollar")?.husbandryCaution?.includes("metrik karşılığı"), "Benekli Silver Dollar dönüştürülen metrik akvaryum ölçüsünü açıklamalı");
assert.equal(speciesCatalog.find((item) => item.id === "bala-shark")?.adultSizeCm, 35, "Bala Shark bilimsel erişkin boyunu taşımalı");
const ropeFish = speciesForLivestock({ commonName: "Ropefish", scientificName: "Erpetoichthys calabaricus", category: "fish", quantity: 1 });
assert.deepEqual([ropeFish?.adultSizeCm, ropeFish?.minVolumeL, ropeFish?.minTankLengthCm, ropeFish?.temperature, ropeFish?.ph, ropeFish?.flow], [90, 540, 150, [23, 30], [6, 7.5], "low"], "Ropefish koruyucu uzman boyu, kaynaklı akvaryum ve su eşiklerini taşımalı");
assert.deepEqual(ropeFish?.waterTypes, ["freshwater", "brackish"], "Ropefish FishBase'deki tatlı ve acı su kapsamını taşımalı");
assert.equal(ropeFish?.verifiedAt, "2026-09-10", "Ropefish güncel kaynak denetim tarihini taşımalı");
assert(ropeFish?.husbandryCaution?.includes("37 cm") && ropeFish?.husbandryCaution?.includes("90 cm"), "Ropefish çelişen erişkin boy kaynaklarını kullanıcıya açıklamalı");
assert(ropeFish?.husbandryCaution?.includes("ağırlıklı kapak") && ropeFish?.husbandryCaution?.includes("yüzey havasına"), "Ropefish kaçış ve hava soluma güvenlik uyarılarını taşımalı");
assert.equal(speciesCatalog.find((item)=>item.id==="panda-loach")?.speciesOnly,true,"Panda Loach akarsu tipi özel kurulum uyarısı taşımalı");
for (const [id, scientificName, minVolumeL, minTankLengthCm, minGroup, temperature, ph, flow] of [
  ["winemillers-eartheater", "Geophagus winemilleri", 648, 180, 6, [26, 30], [4, 7], "medium"],
  ["threadfin-acara", "Acarichthys heckelii", 250, 150, 1, [24, 30], [6, 8], "low"],
]) {
  const profile = speciesCatalog.find((item) => item.id === id);
  assert(profile, `${id} Amerikan ciklet kataloğunda bulunmalı`);
  assert.deepEqual(
    [profile.scientificName, profile.minVolumeL, profile.minTankLengthCm, profile.minGroup, profile.temperature, profile.ph, profile.flow],
    [scientificName, minVolumeL, minTankLengthCm, minGroup, temperature, ph, flow],
    `${id} doğrulanmış kimlik, alan ve su gereksinimlerini taşımalı`,
  );
  assert.equal(profile.verifiedAt, "2026-10-02", `${id} güncel doğrulama tarihini taşımalı`);
  assert.match(profile.sourceUrl ?? "", /^https:\/\/www\.seriouslyfish\.com\//, `${id} ayrıntılı uzman bakım kaynağı taşımalı`);
  assert((profile.additionalSourceUrls ?? []).some((url) => url.includes("fishbase")), `${id} bilimsel kimlik için FishBase çapraz kaynağı taşımalı`);
  assert(profile.husbandryCaution, `${id} özel bakım uyarısını taşımalı`);
}
assert(speciesCatalog.find((item) => item.id === "winemillers-eartheater")?.husbandryCaution?.includes("180 × 60 cm") && speciesCatalog.find((item) => item.id === "winemillers-eartheater")?.husbandryCaution?.includes("%50–70"), "Geophagus winemilleri kaynaklı taban ve bakım sıklığını açıklamalı");
assert(speciesCatalog.find((item) => item.id === "threadfin-acara")?.husbandryCaution?.includes("150 × 45 cm") && speciesCatalog.find((item) => item.id === "threadfin-acara")?.husbandryCaution?.includes("ayırıcı"), "Acarichthys heckelii çift alanı ve saldırganlık güvenliğini açıklamalı");
for (const [id, scientificName, minVolumeL, minTankLengthCm, minGroup] of [
  ["altum-angelfish", "Pterophyllum altum", 450, 150, 4],
  ["blackbelt-cichlid", "Vieja maculicauda", 600, 180, 1],
  ["pantano-cichlid", "Cincelichthys pearsei", 850, 244, 2],
  ["malawi-eyebiter", "Dimidiochromis compressiceps", 680, 183, 4],
  ["redfin-borleyi", "Copadichromis borleyi", 450, 120, 5],
  ["super-vc10-milomo", "Placidochromis milomo", 1000, 183, 4],
  ["teardrop-guianacara", "Guianacara dacrya", 240, 120, 2],
  ["owroewefi-guianacara", "Guianacara owroewefi", 250, 140, 4],
  ["johanni-cichlid", "Pseudotropheus johannii", 400, 120, 5],
  ["silver-maskaheros", "Maskaheros argenteus", 700, 200, 1],
  ["elongatus-mpanga", "Chindongo elongatus", 375, 120, 5],
  ["sulphur-head-hap", "Otopharynx lithobates", 350, 130, 4],
  ["livingstonii-cichlid", "Nimbochromis livingstonii", 680, 180, 4],
  ["silver-mono", "Monodactylus argenteus", 600, 180, 6],
  ["spotted-scat", "Scatophagus argus", 680, 180, 6],
]) {
  const profile = speciesCatalog.find((item) => item.id === id);
  assert(profile, `${id} doğrulanmış ciklet kataloğunda bulunmalı`);
  assert.deepEqual(
    [profile.scientificName, profile.minVolumeL, profile.minTankLengthCm, profile.minGroup],
    [scientificName, minVolumeL, minTankLengthCm, minGroup],
    `${id} güvenli erişkin alanı ve sosyal gereksinimleri taşımalı`,
  );
  assert.equal(profile.verifiedAt, "2026-08-29", `${id} güncel doğrulama tarihini taşımalı`);
  assert.match(profile.sourceUrl ?? "", /^https:\/\/www\.fishbase\.(?:se|org)\//, `${id} bilimsel kimlik için FishBase kaynağı taşımalı`);
  assert(profile.additionalSourceUrls?.length, `${id} bakım gereksinimi için ek güvenilir kaynak taşımalı`);
  assert(profile.husbandryCaution, `${id} özel bakım uyarısını taşımalı`);
}
assert.equal(speciesCatalog.find((item) => item.id === "malawi-eyebiter")?.predatory, true, "Malawi Eyebiter küçük balıklar için av riski taşımalı");
assert.equal(speciesCatalog.find((item) => item.id === "pantano-cichlid")?.speciesOnly, true, "Pantano ciklet standart topluluk balığı olarak önerilmemeli");
assert.equal(speciesCatalog.find((item) => item.id === "johanni-cichlid")?.speciesOnly, true, "Johanni saldırgan Mbuna topluluğu dışında genel topluluk balığı olarak önerilmemeli");
assert.notEqual(speciesForLivestock({commonName:"JOHANNI CİKLET",category:"fish",quantity:1})?.id, "maingano-cichlid", "Gerçek Johanni benzer adlı Maingano profiline bağlanmamalı");
assert.equal(speciesCatalog.find((item) => item.id === "silver-maskaheros")?.speciesOnly, true, "Gümüş Maskaheros standart topluluk balığı olarak önerilmemeli");
assert.equal(speciesCatalog.find((item) => item.id === "elongatus-mpanga")?.speciesOnly, true, "Elongatus Mpanga genel topluluk akvaryumuna önerilmemeli");
assert.equal(speciesCatalog.find((item) => item.id === "livingstonii-cichlid")?.predatory, true, "Livingston ciklet küçük balıklar için açık av riski taşımalı");
assert.equal(speciesCatalog.find((item) => item.id === "silver-mono")?.speciesOnly, true, "Mono Argentus tatlı su topluluk balığı olarak önerilmemeli");
assert.equal(speciesCatalog.find((item) => item.id === "spotted-scat")?.speciesOnly, true, "Argus tatlı su cikleti olarak önerilmemeli");
for (const [id,alias] of [
  ["betta","Galaxy Candy Koi Betta"],
  ["betta","Galaxy Halfmoon Betta"],
  ["goldfish","Red Cap Oranda"],
  ["chili-rasbora","Sivrisinek Rasbora"],
]) {
  assert(speciesCatalog.find((item)=>item.id===id)?.aliases?.includes(alias),id+" yerel satış adıyla aranabilmeli: "+alias);
}
const falseJulii = speciesCatalog.find((item) => item.id === "three-lined-cory");
assert.equal(falseJulii?.scientificName, "Hoplisoma trilineatum", "Piyasadaki False Julii gerçek Julii türüyle karıştırılmamalı");
assert(speciesCatalog.every((item) => !(item.id === "three-lined-cory" && item.scientificName === "Hoplisoma julii")), "Three-lined çöpçü yanlış bilimsel adla kaydedilmemeli");
const trueJulii = speciesCatalog.find((item) => item.id === "true-julii-cory");
assert.deepEqual([trueJulii?.scientificName, trueJulii?.adultSizeCm, trueJulii?.minVolumeL, trueJulii?.minTankLengthCm, trueJulii?.minGroup, trueJulii?.temperature, trueJulii?.ph, trueJulii?.flow], ["Hoplisoma julii", 5.5, 81, 90, 6, [20, 26], [5.5, 7.5], "medium"], "Gerçek Julii kaynaklı boy, akvaryum tabanı, sürü ve su eşiklerini taşımalı");
assert.equal(trueJulii?.verifiedAt, "2026-09-08", "Gerçek Julii güncel kaynak denetim tarihini taşımalı");
assert(trueJulii?.sourceUrl?.includes("seriouslyfish.com/species/corydoras-julii"), "Gerçek Julii ayrıntılı uzman bakım kaynağına bağlanmalı");
assert(trueJulii?.additionalSourceUrls?.some((url) => url.includes("fishbase.se/summary/10923")), "Gerçek Julii güncel takson kaynağına bağlanmalı");
assert.notEqual(trueJulii?.scientificName, falseJulii?.scientificName, "Gerçek Julii ve False Julii ayrı bilimsel profiller olarak kalmalı");
const wrestlingHalfbeak = speciesCatalog.find((item) => item.id === "wrestling-halfbeak");
assert.equal(wrestlingHalfbeak?.predatory, true, "Wrestling Halfbeak küçük balık ve yavrular için avlanma riski taşımalı");
assert.deepEqual([wrestlingHalfbeak?.scientificName, wrestlingHalfbeak?.adultSizeCm, wrestlingHalfbeak?.minVolumeL, wrestlingHalfbeak?.minTankLengthCm, wrestlingHalfbeak?.minGroup], ["Dermogenys pusilla", 16.1, 68, 60, 1], "Wrestling Halfbeak kaynaklı kimlik, koruyucu azami boy, taban ve sosyal seçenekleri taşımalı");
assert.deepEqual([wrestlingHalfbeak?.temperature, wrestlingHalfbeak?.ph, wrestlingHalfbeak?.flow], [[24, 28], [6.5, 8], "low"], "Wrestling Halfbeak kaynaklı su ve düşük akıntı gereksinimini taşımalı");
assert.deepEqual(wrestlingHalfbeak?.waterTypes, ["freshwater", "brackish"], "Wrestling Halfbeak tatlı ve hafif acı su kapsamını taşımalı");
assert.deepEqual(wrestlingHalfbeak?.specificGravity, [1, 1.005], "Wrestling Halfbeak yalnız kaynaklı hafif acı su üst sınırını taşımalı");
assert.equal(wrestlingHalfbeak?.verifiedAt, "2026-09-30", "Wrestling Halfbeak güncel kaynak denetim tarihini taşımalı");
assert(wrestlingHalfbeak?.husbandryCaution?.includes("boşluksuz kapak") && wrestlingHalfbeak.husbandryCaution.includes("tuz zorunlu değildir"), "Wrestling Halfbeak sıçrama ve gereksiz tuz güvenliğini taşımalı");
assert(wrestlingHalfbeak?.husbandryCaution?.includes("16,1 cm") && wrestlingHalfbeak.husbandryCaution.includes("5,5 cm"), "Wrestling Halfbeak kaynaklardaki TL/SL boy farkını görünür tutmalı");
assert.equal(speciesForCatalogExactSearch("Dermogenys pusilla", "fish", "freshwater")?.id, "wrestling-halfbeak", "Kesin Dermogenys pusilla adı doğru profile bağlanmalı");
assert.equal(speciesForLivestock({commonName:"PLATİNİUM HALF BEAK CÜCE ZARGANA",category:"fish",quantity:1}), undefined, "Genel Platinum Halfbeak adı güncellenen Dermogenys veya Nomorhamphus profiline tahminle bağlanmamalı");
const humpbackLimia = speciesCatalog.find((item) => item.id === "humpback-limia");
assert.deepEqual(
  [humpbackLimia?.scientificName,humpbackLimia?.adultSizeCm,humpbackLimia?.minVolumeL,humpbackLimia?.minTankLengthCm,humpbackLimia?.minGroup,humpbackLimia?.temperature,humpbackLimia?.ph,humpbackLimia?.flow],
  ["Limia nigrofasciata",6.3,57,undefined,6,[22,26],[7,8],"low"],
  "Humpback Limia güncel taksonomi, kaynaklı boy, grup, hacim ve su eşiklerini taşımalı",
);
assert.deepEqual(humpbackLimia?.waterTypes,["freshwater","brackish"],"Humpback Limia kaynaklı tatlı ve düşük düzey acı su kapsamını taşımalı");
assert.equal(humpbackLimia?.verifiedAt,"2026-09-30","Humpback Limia güncel doğrulama tarihini taşımalı");
assert.match(humpbackLimia?.sourceUrl || "",/^https:\/\/www\.seriouslyfish\.com\/species\/limia-nigrofasciata$/,"Humpback Limia doğrudan türe özel uzman bakım kaynağına bağlanmalı");
assert(humpbackLimia?.additionalSourceUrls?.some((url) => url.includes("fishbase.se/summary/Limia-nigrofasciata")),"Humpback Limia taksonomi, doğal boy ve koruma durumu için FishBase çapraz kaynağını taşımalı");
assert(humpbackLimia?.additionalSourceUrls?.some((url) => url.includes("chicagolivebearer.com")),"Humpback Limia altılı grup ve hacim için canlı doğuran uzman kulübü kaynağını taşımalı");
assert(humpbackLimia?.tankLengthDataNote?.includes("kesin minimum uzunluk yayımlamadığı"),"Humpback Limia kaynakta olmayan santimetre uzunluğunu tahmin etmemeli");
assert(humpbackLimia?.husbandryCaution?.includes("kritik tehlike") && humpbackLimia.husbandryCaution.includes("biyolojik yük"),"Humpback Limia koruma ve hızlı üreme güvenliğini taşımalı");
const blackPhantom = speciesCatalog.find((item) => item.id === "black-phantom-tetra");
assert.equal(blackPhantom?.minGroup, 8, "Siyah Fantom tetra güvenli sürü sayısıyla önerilmeli");
const spottedRasbora = speciesCatalog.find((item) => item.id === "spotted-rasbora");
assert.deepEqual(spottedRasbora?.ph, [5, 6], "Benekli rasbora sert ve alkali suya uygun gösterilmemeli");
const redWhiptail = speciesCatalog.find((item) => item.id === "red-whiptail-catfish");
assert.equal(redWhiptail?.minGroup, 6, "Kırmızı Kamçı Kuyruk sosyal grup ihtiyacını taşımalı");
assert.equal(redWhiptail?.flow, "low", "Kırmızı Kamçı Kuyruk güçlü akıntıya zorlanmamalı");
const threeSpotGourami = speciesCatalog.find((item) => item.id === "three-spot-gourami");
assert(threeSpotGourami?.aliases?.includes("Gold gurami"), "Üç benekli guraminin yaygın renk formları ana bakım profiline bağlanmalı");
assert.equal(threeSpotGourami?.minVolumeL, 200, "Üç benekli gurami küçük satış akvaryumlarına uygun gösterilmemeli");
assert.equal(speciesCatalog.filter((item) => speciesGroup(item) === "labyrinth").length, 15, "Labirentli kataloğu gerçek Parosphromenus deissneri dahil 15 doğrulanmış profil içermeli");
for (const [id, minVolumeL, minGroup] of [
  ["moonlight-gourami", 150, 3],
  ["chocolate-gourami", 120, 6],
  ["croaking-gourami", 75, 4],
  ["betta-imbellis", 120, 4],
]) {
  const profile = speciesCatalog.find((item) => item.id === id);
  assert(profile, `${id} labirentli kataloğunda bulunmalı`);
  assert.equal(speciesGroup(profile), "labyrinth", `${id} doğru canlı grubunda bulunmalı`);
  assert.equal(profile.minVolumeL, minVolumeL, `${id} güvenli minimum hacmi korunmalı`);
  assert.equal(profile.minGroup, minGroup, `${id} sosyal yapı gereksinimi korunmalı`);
  assert(profile.husbandryCaution, `${id} özel bakım uyarısı taşımalı`);
}
assert.deepEqual(speciesCatalog.find((item) => item.id === "chocolate-gourami")?.ph, [4, 6], "Çikolata gurami genel sert su topluluğuna uygun gösterilmemeli");
assert.equal(speciesCatalog.find((item) => item.id === "moonlight-gourami")?.predatory, true, "Ayışığı gurami çok küçük balıklar için risk taşımalı");
const threadfinRainbow = speciesCatalog.find((item) => item.id === "threadfin-rainbowfish");
assert.equal(threadfinRainbow?.minGroup, 6, "Threadfin gökkuşağı grup halinde önerilmeli");
assert.equal(threadfinRainbow?.flow, "low", "Threadfin gökkuşağı güçlü akıntıya zorlanmamalı");
const petricola = speciesCatalog.find((item) => item.id === "petricola-catfish");
assert((petricola?.ph[0] || 0) >= 7.8, "Petricola asidik topluluk akvaryumuna uygun gösterilmemeli");
assert.equal(petricola?.predatory, true, "Petricola 3 cm altındaki canlılar için avlanma riski taşımalı");
assert.notEqual(speciesCatalog.find((item) => item.id === "five-banded-barb")?.scientificName, speciesCatalog.find((item) => item.id === "six-banded-barb")?.scientificName, "Piyasada Pentazona adıyla karışan iki barb ayrı biyolojik profil olmalı");
assert.equal(speciesCatalog.filter((item) => speciesGroup(item) === "barb").length, 13, "Barb kataloğu doğrulanmış Sekiz Bantlı, Melon ve Mascara dahil 13 tür içermeli");
for (const [id,size,volume,length,group,temperature,ph] of [
  ["melon-barb",7.5,150,120,6,[22,26],[5.5,7]],
  ["mascara-barb",12,200,120,8,[19,25],[6,7.5]],
]) {
  const profile=speciesCatalog.find((item)=>item.id===id);
  assert.deepEqual(
    [profile?.adultSizeCm,profile?.minVolumeL,profile?.minTankLengthCm,profile?.minGroup,profile?.temperature,profile?.ph,profile?.flow],
    [size,volume,length,group,temperature,ph,"high"],
    `${id} yetişkin sürü için doğrulanmış boy, hacim, uzunluk ve su gereksinimlerini taşımalı`,
  );
  assert.equal(profile?.verifiedAt,"2026-08-27",`${id} güncel doğrulama tarihini taşımalı`);
  assert(profile?.husbandryCaution,`${id} oksijen ve yüzme alanı uyarısı taşımalı`);
}
const pearlDanio = speciesCatalog.find((item) => item.id === "pearl-danio");
assert.equal(pearlDanio?.flow, "high", "İnci danio akıntılı ve iyi oksijenli yaşam gereksinimini taşımalı");
assert.equal(pearlDanio?.temperature[1], 25, "İnci danio sürekli yüksek tropikal sıcaklığa uygun gösterilmemeli");
assert(speciesCatalog.find((item) => item.id === "zebra-danio")?.aliases?.includes("Leopar danio"), "Leopar danio ayrı biyolojik tür gibi çoğaltılmadan bulunabilmeli");
const fahaka = speciesCatalog.find((item) => item.id === "fahaka-puffer");
assert.equal(fahaka?.speciesOnly, true, "Fahaka kesin tür akvaryumu uyarısı taşımalı");
assert.equal(fahaka?.predatory, true, "Fahaka tank arkadaşları için yüksek avlanma riski taşımalı");
assert((fahaka?.minVolumeL || 0) >= 800, "Fahaka yavru satış boyuna göre küçük akvaryuma önerilmemeli");

assert.equal(
  new Set(careProductCatalog.map((item) => item.id)).size,
  careProductCatalog.length,
  "Bakım ürünü kataloğunda yinelenen kimlik bulunmamalı",
);
assert(
  careProductCatalog.every((item) => item.brand.trim() && item.model.trim() && item.description.trim()),
  "Her bakım ürünü marka, model ve açıklama taşımalı",
);
assert(
  careProductCatalog.every((item) => /^https:\/\//.test(item.sourceUrl || "")),
  "Her bakım ürünü doğrulanabilir bir HTTPS kaynak bağlantısı taşımalı",
);
assert(
  careProductCatalog.every((item) => /^\d{4}-\d{2}-\d{2}$/.test(item.verifiedAt || "") && !Number.isNaN(Date.parse(item.verifiedAt))),
  "Her bakım ürünü geçerli bir doğrulama tarihi taşımalı",
);
const fluvalCare = careProductCatalog.filter((item) => item.brand === "Fluval");
assert.equal(fluvalCare.length, 251, "Fluval resmî su, bitki, test, yem ve filtre medyası dizinindeki 251 doğrulanmış seçenek bulunmalı");
assert.deepEqual(fluvalCare.slice(0,14).map((item) => item.model), [
  "Aqua Plus Water Conditioner 30 ml","Aqua Plus Water Conditioner 120 ml","Aqua Plus Water Conditioner 250 ml","Aqua Plus Water Conditioner 500 ml","Aqua Plus Water Conditioner 2 L",
  "Cycle Biological Enhancer 30 ml","Cycle Biological Enhancer 120 ml","Cycle Biological Enhancer 250 ml","Cycle Biological Enhancer 500 ml","Cycle Biological Enhancer 2 L",
  "Waste Control Biological Aquarium Cleaner 30 ml","Waste Control Biological Aquarium Cleaner 120 ml","Waste Control Biological Aquarium Cleaner 250 ml","Waste Control Biological Aquarium Cleaner 2 L",
], "Fluval su bakım ürünleri gerçek ambalaj seçenekleriyle ayrı kayıtlar olmalı");
assert.equal(fluvalCare.filter((item) => item.category === "water_conditioner").length, 17, "Fluval su düzenleyicileri tatlı su ürünleri, yedi deniz takviyesi ve iki Marine Salt seçeneğini taşımalı");
assert.equal(fluvalCare.filter((item) => item.category === "bacteria").length, 10, "Fluval bakteri ürünleri Cycle, Waste Control ve Betta Enviro Clean seçeneklerini taşımalı");
assert.equal(fluvalCare.filter((item) => item.category === "fertilizer").length, 2, "Fluval Plant Gro+ iki gerçek şişe seçeneğiyle gübre kategorisinde bulunmalı");
assert.equal(fluvalCare.filter((item) => item.category === "substrate").length, 7, "Fluval Stratum, Bio-Stratum ve Betta Stratum yedi gerçek paket seçeneğiyle bulunmalı");
assert.equal(fluvalCare.filter((item) => item.category === "test").length, 28, "Fluval on tekli kit, Professional Test Kit ve 17 doğrulanmış yedek reaktif ayrı bulunmalı");
assert.equal(fluvalCare.filter((item) => item.category === "food").length, 43, "Fluval doğrulanmış yem grubu 40 Bug Bites ve üç Betta ürünüyle 43 gerçek seçenek içermeli");
assert.equal(fluvalCare.filter((item) => item.category === "food" && item.id.startsWith("fluval-bug-bites-") && item.sourceUrl.includes("/us/shop/product/bug-bites")).length, 40, "Fluval resmî üç sayfalık Bug Bites dizinindeki 40 ürünün tamamı doğrudan ürün sayfasına bağlı olmalı");
assert.equal(fluvalCare.filter((item) => item.category === "filter_media").length, 143, "Fluval doğrulanmış filtre medyası portföyü 143 gerçek seçenek içermeli");
assert(fluvalCare.every((item) => item.description.includes("ürün kodu") && item.sourceUrl?.startsWith("https://fluvalaquatics.com/") && ["2026-09-28","2026-09-29","2026-09-30"].includes(item.verifiedAt)), "Fluval bakım ürünleri ürün kodu, doğrudan resmî kaynak ve güncel tarih taşımalı");
assert(careProductCatalog.find((item) => item.id === "fluval-cycle-30ml")?.description.includes("yayımlanmıyor"), "Fluval Cycle 30 ml için yayımlanmayan toplam kullanım hacmi tahmin edilmemeli");
assert(careProductCatalog.find((item) => item.id === "fluval-waste-control-120ml")?.description.includes("ürün kodu A8354") && careProductCatalog.find((item) => item.id === "fluval-waste-control-120ml")?.description.includes("toplam kullanım hacmi yayımlanmıyor"), "Fluval Waste Control 120 ml doğrulanmış ürün koduyla bulunmalı ve yayımlanmayan kullanım hacmi tahmin edilmemeli");
assert.deepEqual(["fluval-betta-plus-60ml","fluval-betta-enviro-clean-60ml","fluval-quick-clear-120ml","fluval-bio-clear-120ml"].map((id) => careProductCatalog.find((item) => item.id === id)?.category), ["water_conditioner","bacteria","water_conditioner","water_conditioner"], "Fluval Betta ve berraklaştırıcı ürünleri doğru bakım kategorilerine ayrılmalı");
assert(careProductCatalog.find((item) => item.id === "fluval-quick-clear-120ml")?.description.includes("1816 L") && careProductCatalog.find((item) => item.id === "fluval-bio-clear-120ml")?.description.includes("908 L"), "Fluval berraklaştırıcıları yalnız yayımlanan toplam kullanım hacimlerini taşımalı");
assert.deepEqual(["fluval-sea-alkalinity-a8253-237ml","fluval-sea-calcium-a8257-237ml","fluval-sea-iodine-a8264-237ml","fluval-sea-trace-elements-a8269-237ml","fluval-sea-3-ions-a8272-237ml"].map((id) => careProductCatalog.find((item) => item.id === id)?.description.match(/ürün kodu ([A-Z0-9-]+)/)?.[1]), ["A8253","A8257","A8264","A8269","A8272"], "Fluval SEA mineral ve iz element takviyeleri doğru ürün kodlarıyla bulunmalı");
assert(careProductCatalog.find((item) => item.id === "fluval-sea-alkalinity-a8253-237ml")?.description.includes("yüzde 20") && careProductCatalog.find((item) => item.id === "fluval-sea-calcium-a8257-237ml")?.description.includes("doz tahmin edilmemiştir") && careProductCatalog.find((item) => item.id === "fluval-sea-3-ions-a8272-237ml")?.description.includes("mükerrer doz"), "Fluval SEA takviyeleri net su hacmi, ölçüm ve mükerrer doz güvenliğini korumalı");
assert.deepEqual(["fluval-sea-magnesium-a8261-237ml","fluval-sea-magnesium-a8262-473ml"].map((id) => careProductCatalog.find((item) => item.id === id)?.description.match(/ürün kodu ([A-Z0-9-]+)/)?.[1]), ["A8261","A8262"], "Fluval SEA Magnesium iki gerçek ambalaj ve doğru ürün kodlarıyla bulunmalı");
assert(["fluval-sea-magnesium-a8261-237ml","fluval-sea-magnesium-a8262-473ml"].every((id) => { const item=careProductCatalog.find((entry) => entry.id === id); return item?.description.includes("yalnız tuzlu su") && item.description.includes("kalsiyum çökelmesini") && item.description.includes("mükerrer doz") && item.description.includes("doz tahmin edilmemiştir") && item.additionalSourceUrls?.some((url) => url.includes("water-care/page/3")); }), "Fluval SEA Magnesium tuzlu su, ölçüm, çökelme ve mükerrer doz güvenliğini doğrudan resmî dizinle taşımalı");
assert.deepEqual(["fluval-marine-salt-a8279-6-8kg","fluval-marine-salt-a8280-22-5kg"].map((id) => careProductCatalog.find((item) => item.id === id)?.description.match(/ürün kodu ([A-Z0-9-]+)/)?.[1]), ["L-A8279","L-A8280"], "Fluval Marine Salt ambalajları doğru ürün kodlarıyla ayrı bulunmalı");
assert(["fluval-marine-salt-a8279-6-8kg","fluval-marine-salt-a8280-22-5kg"].every((id) => careProductCatalog.find((item) => item.id === id)?.description.includes("tuzluluk ölçülmelidir")), "Fluval Marine Salt seçenekleri ayrı kapta hazırlama ve tuzluluk ölçümü güvenliğini taşımalı");
assert(careProductCatalog.find((item) => item.id === "fluval-freshwater-salt-a1091-675g")?.category === "treatment" && careProductCatalog.find((item) => item.id === "fluval-freshwater-salt-a1091-675g")?.description.includes("tuza hassastır") && careProductCatalog.find((item) => item.id === "fluval-freshwater-salt-a1091-675g")?.description.includes("1 yemek kaşığı/37,8 L"), "Fluval Freshwater Salt tür hassasiyeti ve yayımlanan kullanım oranıyla tedavi kategorisinde bulunmalı");
assert.deepEqual(["fluval-plant-gro-plus-120ml","fluval-plant-gro-plus-250ml"].map((id) => careProductCatalog.find((item) => item.id === id)?.description.match(/toplam kullanım hacmi (\d+) L/)?.[1]), ["5450","13000"], "Fluval Plant Gro+ şişeleri yalnız üreticinin yayımladığı kullanım hacimlerini taşımalı");
assert.deepEqual([2,4,8].map((weight) => careProductCatalog.find((item) => item.id === `fluval-stratum-${weight}kg`)?.description.match(/ürün kodu (\d+)/)?.[1]), ["12693","12694","12695"], "Fluval Stratum paketleri doğru ürün kodlarıyla eşleşmeli");
assert.deepEqual([2,4,8].map((weight) => careProductCatalog.find((item) => item.id === `fluval-bio-stratum-${weight}kg`)?.description.match(/ürün kodu (\d+)/)?.[1]), ["12696","12697","12698"], "Fluval Bio-Stratum paketleri doğru ürün kodlarıyla eşleşmeli");
assert(careProductCatalog.find((item) => item.id === "fluval-betta-stratum-0-8kg")?.description.includes("ürün kodu 12689") && careProductCatalog.find((item) => item.id === "fluval-betta-stratum-0-8kg")?.description.includes("22,7 L"), "Fluval Betta Stratum ürün kodu ve kit kullanım miktarıyla bulunmalı");
assert.deepEqual(["fluval-nitrate-test-a7871","fluval-nitrite-test-a7870","fluval-iron-test-a7873","fluval-ph-wide-test-a7868","fluval-ph-high-test-a7877","fluval-phosphate-test-a7872"].map((id) => careProductCatalog.find((item) => item.id === id)?.category), ["test","test","test","test","test","test"], "Fluval test kitleri doğru ürün kodu ve kategoriyle bulunmalı");
assert(careProductCatalog.find((item) => item.id === "fluval-nitrate-test-a7871")?.description.includes("yüksek nitrit") && careProductCatalog.find((item) => item.id === "fluval-phosphate-test-a7872")?.additionalSourceUrls?.some((url) => url.endsWith("A7872_Manual_Map.pdf")), "Fluval test kitlerinin ölçüm sınırlamaları ve kılavuz kaynakları korunmalı");
assert(careProductCatalog.find((item) => item.id === "fluval-ammonia-test-a7869")?.description.includes("A7855 bölgesel/eski") && careProductCatalog.find((item) => item.id === "fluval-ammonia-test-a7869")?.description.includes("20 dakika"), "Fluval amonyak testinin bölgesel kod farkı ve sonuç süresi gizlenmemeli");
assert(careProductCatalog.find((item) => item.id === "fluval-kh-gh-test-a7876")?.description.includes("×20") && careProductCatalog.find((item) => item.id === "fluval-kh-gh-test-a7876")?.description.includes("×10"), "Fluval KH/GH testi üreticinin damla dönüşümlerini taşımalı");
assert(careProductCatalog.find((item) => item.id === "fluval-calcium-test-a7875")?.description.includes("20 mg/L altını") && careProductCatalog.find((item) => item.id === "fluval-calcium-test-a7875")?.description.includes("A7850") && careProductCatalog.find((item) => item.id === "fluval-calcium-test-a7875")?.sourceUrl.endsWith("A7875_Calcium_Fresh-Salt-2018-FCB.pdf"), "Fluval kalsiyum testinin hassasiyet sınırı, resmî kılavuzu ve bölgesel paket kodu korunmalı");
const fluvalPhLowTest = careProductCatalog.find((item) => item.id === "fluval-ph-low-test-a7810-a7874");
assert(fluvalPhLowTest?.description.includes("A7810") && fluvalPhLowTest.description.includes("A7874") && fluvalPhLowTest.description.includes("225 test") && fluvalPhLowTest.description.includes("günde 0,5"), "Fluval pH Low Range güncel ve uluslararası kodları, test sayısı ve güvenli pH değişim sınırıyla bulunmalı");
assert(careProductCatalog.find((item) => item.id === "fluval-ph-high-test-a7877")?.description.includes("A7812") && careProductCatalog.find((item) => item.id === "fluval-ph-high-test-a7877")?.description.includes("A7877"), "Fluval pH High Range bölgesel paket kodu farkını görünür tutmalı");
const fluvalProfessionalTestKit = careProductCatalog.find((item) => item.id === "fluval-professional-test-kit-a7860");
assert(fluvalProfessionalTestKit?.description.includes("ürün kodu A7860") && fluvalProfessionalTestKit.description.includes("10 test") && fluvalProfessionalTestKit.description.includes("beş cam tüp") && fluvalProfessionalTestKit.description.includes("iki pipet"), "Fluval Professional Test Kit ürün kodu, on test ve gerçek kutu içeriğiyle bulunmalı");
assert(fluvalProfessionalTestKit?.description.includes("015561178600") && fluvalProfessionalTestKit.description.includes("015561183543") && fluvalProfessionalTestKit.description.includes("benzersiz doğrulayıcı sayılmamalıdır") && fluvalProfessionalTestKit.additionalSourceUrls?.some((url) => url.includes("/fr/shop/product/")), "Fluval Professional Test Kit resmî dil sayfalarındaki UPC çelişkisini görünür tutmalı");
const fluvalVerifiedReagentIds = ["fluval-ammonia-reagent-1-a7856","fluval-ammonia-reagent-2-a7857","fluval-ammonia-reagent-3-a7858","fluval-calcium-reagent-1-a7851","fluval-calcium-reagent-2-a7852","fluval-calcium-reagent-3-a7853","fluval-iron-reagent-1-a7836","fluval-iron-reagent-2-a7837","fluval-ph-high-reagent-a7813","fluval-ph-low-reagent-a7811","fluval-ph-wide-reagent-a7816","fluval-kh-reagent-a7831","fluval-nitrate-nitrite-reagent-1-a7846","fluval-nitrate-nitrite-reagent-2-a7847","fluval-nitrate-reagent-3-a7848","fluval-phosphate-reagent-1-a7841","fluval-phosphate-reagent-3-a7843"];
assert.equal(fluvalVerifiedReagentIds.filter((id) => careProductCatalog.some((item) => item.id === id)).length, 17, "Fluval doğrulanmış yedek reaktif grubu 17 gerçek ürün içermeli");
assert(fluvalVerifiedReagentIds.every((id) => { const item=careProductCatalog.find((entry) => entry.id === id); return item?.category === "test" && item.description.includes("ürün kodu") && item.description.includes("tek başına") && item.sourceUrl.includes("fluvalaquatics.com/") && ["2026-09-29","2026-09-30"].includes(item.verifiedAt); }), "Fluval yedek reaktifleri ürün kodu, uyumluluk sınırı, doğrudan resmî kaynak ve güncel tarih taşımalı");
const fluvalCurrentReagentIds = ["fluval-nitrate-nitrite-reagent-1-a7846","fluval-ammonia-reagent-2-a7857","fluval-ammonia-reagent-3-a7858","fluval-calcium-reagent-1-a7851","fluval-calcium-reagent-2-a7852","fluval-calcium-reagent-3-a7853","fluval-iron-reagent-1-a7836","fluval-iron-reagent-2-a7837","fluval-kh-reagent-a7831","fluval-nitrate-nitrite-reagent-2-a7847","fluval-nitrate-reagent-3-a7848","fluval-ph-high-reagent-a7813","fluval-ph-low-reagent-a7811","fluval-phosphate-reagent-1-a7841","fluval-phosphate-reagent-3-a7843"];
assert.equal(fluvalCurrentReagentIds.filter((id) => careProductCatalog.some((item) => item.id === id)).length, 15, "Fluval güncel resmî Reagent Refills dizinindeki 15 ürünün tamamı katalogda bulunmalı");
assert(careProductCatalog.find((item) => item.id === "fluval-phosphate-reagent-1-a7841")?.description.includes("yüzde 10 sülfürik asit") && careProductCatalog.find((item) => item.id === "fluval-nitrate-nitrite-reagent-2-a7847")?.description.includes("A7870") && careProductCatalog.find((item) => item.id === "fluval-nitrate-nitrite-reagent-2-a7847")?.description.includes("A7871"), "Fluval reaktif güvenliği ve paylaşılan kit uyumluluğu korunmalı");
assert(careProductCatalog.find((item) => item.id === "fluval-ammonia-reagent-2-a7857")?.description.includes("sodyum hidroksit") && careProductCatalog.find((item) => item.id === "fluval-ammonia-reagent-3-a7858")?.description.includes("fenol") && careProductCatalog.find((item) => item.id === "fluval-ammonia-reagent-3-a7858")?.description.includes("iyi havalandırılan"), "Fluval amonyak reaktiflerinin resmî kimyasal güvenlik uyarıları korunmalı");
assert(careProductCatalog.find((item) => item.id === "fluval-nitrate-nitrite-reagent-1-a7846")?.description.includes("4-aminobenzenesülfonik asit") && careProductCatalog.find((item) => item.id === "fluval-nitrate-reagent-3-a7848")?.description.includes("yüzde 75 etoksidiglikol") && careProductCatalog.find((item) => item.id === "fluval-nitrate-reagent-3-a7848")?.description.includes("30 saniye"), "Fluval nitrat/nitrit reaktiflerinin kimyasal ve kullanım güvenliği korunmalı");
assert(["fluval-calcium-reagent-2-a7852","fluval-iron-reagent-2-a7837"].every((id) => careProductCatalog.find((item) => item.id === id)?.description.includes("UPC kaydı bulunmadığı için numara tahmin edilmemiştir")), "Fluval reaktiflerinde yayımlanmayan UPC değerleri uydurulmamalı");
assert(["fluval-calcium-reagent-2-a7852","fluval-iron-reagent-2-a7837"].every((id) => careProductCatalog.find((item) => item.id === id)?.sourceUrl.endsWith("/water-testing/reagent-refills")), "Ürün sayfası güvenle açılamayan Fluval reaktifleri kırık bağlantı yerine güncel resmî dizine bağlanmalı");
const fluvalBugBitesIds = ["fluval-bug-bites-betta-micro-granules-a6575-30g","fluval-bug-bites-goldfish-granules-a6583-45g","fluval-bug-bites-tropical-granules-a6578-45g","fluval-bug-bites-betta-flakes-a7366-18g","fluval-bug-bites-tropical-flakes-a7330-18g","fluval-bug-bites-tropical-micro-granules-a6577-45g","fluval-bug-bites-goldfish-flakes-a7339-45g","fluval-bug-bites-cichlid-pellets-a6595-1-7kg"];
assert.deepEqual(fluvalBugBitesIds.map((id) => careProductCatalog.find((item) => item.id === id)?.description.match(/ürün kodu ([A-Z0-9-]+)/)?.[1]), ["A6575","A6583","A6578","A7366","A7330","A6577","A7339","A6595"], "Fluval Bug Bites yemleri doğru ürün kodlarıyla eşleşmeli");
assert(fluvalBugBitesIds.every((id) => careProductCatalog.find((item) => item.id === id)?.category === "food" && careProductCatalog.find((item) => item.id === id)?.sourceUrl.startsWith("https://fluvalaquatics.com/us/shop/product/bug-bites-") && careProductCatalog.find((item) => item.id === id)?.verifiedAt === "2026-09-29"), "Fluval Bug Bites yemleri gıda kategorisi, doğrudan resmî kaynak ve güncel doğrulama tarihi taşımalı");
assert(careProductCatalog.find((item) => item.id === "fluval-bug-bites-tropical-micro-granules-a6577-45g")?.description.includes("0,25–1,4 mm") && careProductCatalog.find((item) => item.id === "fluval-bug-bites-tropical-granules-a6578-45g")?.description.includes("1,4–2,0 mm") && careProductCatalog.find((item) => item.id === "fluval-bug-bites-cichlid-pellets-a6595-1-7kg")?.description.includes("5–7 mm"), "Fluval Bug Bites yem formları üreticinin yayımladığı doğru parçacık boylarını korumalı");
assert(careProductCatalog.find((item) => item.id === "fluval-bug-bites-betta-flakes-a7366-18g")?.description.includes("beslenme çeşitliliğini") && careProductCatalog.find((item) => item.id === "fluval-bug-bites-goldfish-flakes-a7339-45g")?.description.includes("iki dakikada"), "Fluval Bug Bites kullanım sınırları ve beslenme çeşitliliği görünür olmalı");
assert.deepEqual(["fluval-bug-bites-tropical-flakes-a7330-18g","fluval-bug-bites-tropical-flakes-a7331-45g","fluval-bug-bites-tropical-flakes-a7332-90g","fluval-bug-bites-tropical-flakes-a7334-1kg"].map((id) => careProductCatalog.find((item) => item.id === id)?.description.match(/ürün kodu ([A-Z0-9-]+)/)?.[1]), ["A7330","A7331","A7332","A7334"], "Fluval Tropical Flakes gramajları doğru ürün kodlarıyla ayrı bulunmalı");
assert.deepEqual(["fluval-bug-bites-goldfish-flakes-a7338-18g","fluval-bug-bites-goldfish-flakes-a7339-45g","fluval-bug-bites-goldfish-flakes-a7340-90g","fluval-bug-bites-goldfish-flakes-a7342-1kg"].map((id) => careProductCatalog.find((item) => item.id === id)?.description.match(/ürün kodu ([A-Z0-9-]+)/)?.[1]), ["A7338","A7339","A7340","A7342"], "Fluval Goldfish Flakes gramajları doğru ürün kodlarıyla ayrı bulunmalı");
assert.deepEqual(["fluval-bug-bites-shrimp-micro-granules-a6931-30g","fluval-bug-bites-bottom-feeder-granules-a6586-45g","fluval-bug-bites-cichlid-granules-a6580-45g"].map((id) => careProductCatalog.find((item) => item.id === id)?.description.match(/ürün kodu ([A-Z0-9-]+)/)?.[1]), ["A6931","A6586","A6580"], "Fluval karides, dip balığı ve ciklet granülleri doğru ürün kodlarıyla bulunmalı");
assert.deepEqual(["fluval-bug-bites-color-enhancing-flakes-a7346-18g","fluval-bug-bites-color-enhancing-flakes-a7347-45g","fluval-bug-bites-color-enhancing-flakes-a7348-90g","fluval-bug-bites-color-enhancing-flakes-a7350-1kg"].map((id) => careProductCatalog.find((item) => item.id === id)?.description.match(/ürün kodu ([A-Z0-9-]+)/)?.[1]), ["A7346","A7347","A7348","A7350"], "Fluval Color Enhancing Flakes gramajları doğru ürün kodlarıyla ayrı bulunmalı");
assert.deepEqual(["fluval-bug-bites-color-enhancing-granules-a6589-45g","fluval-bug-bites-color-enhancing-granules-a6590-125g","fluval-bug-bites-color-enhancing-granules-a6599-2kg"].map((id) => careProductCatalog.find((item) => item.id === id)?.description.match(/ürün kodu ([A-Z0-9-]+)/)?.[1]), ["A6589","A6590","A6599"], "Fluval Color Enhancing Granules gramajları doğru ürün kodlarıyla ayrı bulunmalı");
assert.deepEqual(["fluval-bug-bites-cichlid-pellets-a6581-100g","fluval-bug-bites-cichlid-pellets-a6582-450g","fluval-bug-bites-cichlid-pellets-a6595-1-7kg"].map((id) => careProductCatalog.find((item) => item.id === id)?.description.match(/ürün kodu ([A-Z0-9-]+)/)?.[1]), ["A6581","A6582","A6595"], "Fluval Cichlid Pellets gramajları doğru ürün kodlarıyla ayrı bulunmalı");
assert(careProductCatalog.find((item) => item.id === "fluval-bug-bites-shrimp-micro-granules-a6931-30g")?.description.includes("günde bir kez") && careProductCatalog.find((item) => item.id === "fluval-bug-bites-shrimp-micro-granules-a6931-30g")?.description.includes("dış iskelet"), "Fluval karides yeminin üretici besleme sıklığı ve dış iskelet desteği görünür olmalı");
assert(careProductCatalog.find((item) => item.id === "fluval-bug-bites-bottom-feeder-granules-a6586-45g")?.description.includes("1,4–2,0 mm") && careProductCatalog.find((item) => item.id === "fluval-bug-bites-cichlid-granules-a6580-45g")?.description.includes("1,4–2,0 mm") && careProductCatalog.find((item) => item.id === "fluval-bug-bites-cichlid-pellets-a6581-100g")?.description.includes("5–7 mm"), "Fluval dip balığı ve ciklet yemleri doğru parçacık boylarını korumalı");
assert.deepEqual(["fluval-bug-bites-pleco-sticks-a6587-130g","fluval-bug-bites-cichlid-granules-a6598-1-7kg","fluval-bug-bites-turtle-pellets-a6592-45g","fluval-bug-bites-turtle-sticks-a6593-100g","fluval-bug-bites-turtle-sticks-a6596-1-7kg","fluval-bug-bites-algae-crisps-a7360-40g","fluval-bug-bites-algae-crisps-a7361-100g","fluval-bug-bites-goldfish-pellets-a6584-100g"].map((id) => careProductCatalog.find((item) => item.id === id)?.description.match(/ürün kodu ([A-Z0-9-]+)/)?.[1]), ["A6587","A6598","A6592","A6593","A6596","A7360","A7361","A6584"], "Fluval Pleco, ciklet, kaplumbağa, alg crisp ve Japon balığı yemleri doğru ürün kodlarıyla bulunmalı");
assert(careProductCatalog.find((item) => item.id === "fluval-bug-bites-cichlid-granules-a6598-1-7kg")?.description.includes("Cichlid Pellets A6582") && careProductCatalog.find((item) => item.id === "fluval-bug-bites-cichlid-granules-a6598-1-7kg")?.description.includes("benzersiz doğrulayıcı sayılmamıştır"), "Fluval A6598 ve A6582 üretici UPC çelişkisi kullanıcıdan saklanmamalı");
assert(careProductCatalog.find((item) => item.id === "fluval-bug-bites-pleco-sticks-a6587-130g")?.description.includes("17–20 mm") && careProductCatalog.find((item) => item.id === "fluval-bug-bites-turtle-pellets-a6592-45g")?.description.includes("5–7 mm") && careProductCatalog.find((item) => item.id === "fluval-bug-bites-turtle-sticks-a6593-100g")?.description.includes("17–20 mm"), "Fluval Pleco ve kaplumbağa yemleri doğru stick ve pelet boylarını korumalı");
assert.deepEqual(["fluval-bug-bites-algae-crisps-a7360-40g","fluval-bug-bites-algae-crisps-a7361-100g"].map((id) => careProductCatalog.find((item) => item.id === id)?.description.includes("%43,5 ham protein")), [true,true], "Fluval Algae Crisps gramajları üreticinin ortak protein bilgisini korumalı");
assert.deepEqual(["fluval-bug-bites-tropical-granules-a6578-45g","fluval-bug-bites-tropical-granules-a6579-125g","fluval-bug-bites-tropical-granules-a6597-1-7kg"].map((id) => careProductCatalog.find((item) => item.id === id)?.description.match(/ürün kodu ([A-Z0-9-]+)/)?.[1]), ["A6578","A6579","A6597"], "Fluval Tropical Granules gramajları doğru ürün kodlarıyla ayrı bulunmalı");
assert(["fluval-bug-bites-tropical-granules-a6579-125g","fluval-bug-bites-tropical-granules-a6597-1-7kg"].every((id) => careProductCatalog.find((item) => item.id === id)?.description.includes("benzersiz doğrulayıcı sayılmamıştır")), "Fluval A6579 ve A6597 üretici UPC çelişkisi iki kayıtta da görünür olmalı");
assert.deepEqual(["fluval-bug-bites-spirulina-flakes-a7354-18g","fluval-bug-bites-spirulina-flakes-a7355-45g","fluval-bug-bites-spirulina-flakes-a7358-1kg"].map((id) => careProductCatalog.find((item) => item.id === id)?.description.match(/ürün kodu ([A-Z0-9-]+)/)?.[1]), ["A7354","A7355","A7358"], "Fluval Spirulina Flakes gramajları doğru ürün kodlarıyla ayrı bulunmalı");
assert(["fluval-bug-bites-spirulina-flakes-a7354-18g","fluval-bug-bites-spirulina-flakes-a7355-45g","fluval-bug-bites-spirulina-flakes-a7358-1kg"].every((id) => careProductCatalog.find((item) => item.id === id)?.description.includes("ilk bileşeni Hawaii spirulinası") && careProductCatalog.find((item) => item.id === id)?.description.includes("%37 ham protein")), "Fluval Spirulina Flakes seçenekleri ortak resmî formül bilgisini korumalı");
const fluvalVacationFood = careProductCatalog.find((item) => item.id === "fluval-bug-bites-vacation-food-a7367-20g");
assert(fluvalVacationFood?.description.includes("ürün kodu A7367") && fluvalVacationFood.description.includes("yeni kurulmuş akvaryumlarda kullanılmamalı") && fluvalVacationFood.description.includes("kabul testi") && fluvalVacationFood.description.includes("su öncesi/sonrası test"), "Fluval Vacation Food ürün kodu ve üreticinin kritik kullanım güvenliği görünür olmalı");
assert.deepEqual(["fluval-betta-protein-rich-food-a6678","fluval-betta-vacation-food-a6675","fluval-betta-freeze-dried-bloodworms-14840-5g"].map((id) => careProductCatalog.find((item) => item.id === id)?.description.match(/ürün kodu ([A-Z0-9-]+)/)?.[1]), ["A6678","A6675","14840"], "Fluval Bug Bites dışındaki Betta yemleri doğru ürün kodlarıyla bulunmalı");
assert(careProductCatalog.find((item) => item.id === "fluval-betta-protein-rich-food-a6678")?.description.includes("günde iki kez") && careProductCatalog.find((item) => item.id === "fluval-betta-protein-rich-food-a6678")?.description.includes("30 saniyede"), "Fluval Betta Protein-Rich Food üreticinin porsiyon ve sıklık sınırını taşımalı");
assert(careProductCatalog.find((item) => item.id === "fluval-betta-vacation-food-a6675")?.description.includes("kısmi su değişimi") && careProductCatalog.find((item) => item.id === "fluval-betta-vacation-food-a6675")?.description.includes("A7367"), "Fluval Betta tatil bloğu dönüş bakımı ve toplum akvaryumu ayrımını korumalı");
assert(careProductCatalog.find((item) => item.id === "fluval-betta-freeze-dried-bloodworms-14840-5g")?.description.includes("haftada iki-üç kez") && careProductCatalog.find((item) => item.id === "fluval-betta-freeze-dried-bloodworms-14840-5g")?.description.includes("tam günlük diyet"), "Fluval Betta kan kurdu tamamlayıcı yem sınırı görünür olmalı");
assert.equal(fluvalCare.filter((item) => item.model.startsWith("Bug Bites Tropical Flakes")).length, 4, "Fluval Tropical Flakes dört doğrulanmış ABD gramajını taşımalı");
assert.equal(fluvalCare.filter((item) => item.model.startsWith("Bug Bites Goldfish Flakes")).length, 4, "Fluval Goldfish Flakes dört doğrulanmış ABD gramajını taşımalı");
assert.deepEqual(["fluval-carbon-a1440-100g-3pack","fluval-biomax-a1456-500g","fluval-biomax-a495-u2-u3-u4","fluval-biomax-19660-ac20-ac30-42g","fluval-biomax-19662-ac50-80g","fluval-carbon-19641-ac20-ac30-50g","fluval-carbon-19642-ac20-ac30-150g-3pack","fluval-ammonia-remover-19630-ac20-ac30-90g","fluval-ammonia-remover-ll-a1487-2800g"].map((id) => careProductCatalog.find((item) => item.id === id)?.category), Array(9).fill("filter_media"), "Fluval doğrulanmış filtre medyaları doğru kategoride bulunmalı");
assert(careProductCatalog.find((item) => item.id === "fluval-biomax-a495-u2-u3-u4")?.description.includes("110 g") && careProductCatalog.find((item) => item.id === "fluval-biomax-a495-u2-u3-u4")?.description.includes("170 g") && careProductCatalog.find((item) => item.id === "fluval-biomax-a495-u2-u3-u4")?.description.includes("kesin alan olarak kullanılmamıştır"), "Fluval A495 ağırlık çelişkisi kullanıcıdan saklanmamalı ve kesin değere dönüştürülmemeli");
assert(careProductCatalog.find((item) => item.id === "fluval-ammonia-remover-19630-ac20-ac30-90g")?.description.includes("deniz suyuna uygun değildir") && careProductCatalog.find((item) => item.id === "fluval-carbon-a1440-100g-3pack")?.description.includes("bir–iki hafta"), "Fluval medya kullanım sınırları korunmalı");
assert.deepEqual(["fluval-biomax-19664-ac70-ac110-125g","fluval-biomax-19665-ac70-ac110-250g-2pack","fluval-carbon-19644-ac50-210g-3pack","fluval-ammonia-remover-19634-ac70-ac110-346g"].map((id) => careProductCatalog.find((item) => item.id === id)?.description.match(/ürün kodu ([A-Z0-9-]+)/)?.[1]), ["19664","19665","19644","19634"], "Fluval AC70/AC110 ve AC50 medya paketleri doğru ürün kodlarıyla eşleşmeli");
assert.deepEqual(["fluval-carbon-19643-ac50-70g","fluval-carbon-19646-ac70-ac110-435g-3pack","fluval-ammonia-remover-19631-ac20-ac30-272g-3pack","fluval-ammonia-remover-19632-ac50-143g","fluval-clear-carb-19628-ac70-ac110-310g-2pack"].map((id) => careProductCatalog.find((item) => item.id === id)?.description.match(/ürün kodu ([A-Z0-9-]+)/)?.[1]), ["19643","19646","19631","19632","19628"], "Fluval AC karbon, amonyak ve Clear-Carb paketleri doğru ürün kodlarıyla eşleşmeli");
assert(careProductCatalog.find((item) => item.id === "fluval-clear-carb-19628-ac70-ac110-310g-2pack")?.description.includes("fosfat, nitrit ve nitrat") && careProductCatalog.find((item) => item.id === "fluval-ammonia-remover-19632-ac50-143g")?.description.includes("deniz suyuna uygun değildir"), "Fluval Clear-Carb işlevi ve amonyak medyasının tatlı su sınırı korunmalı");
assert.deepEqual(["fluval-carbon-19645-ac70-ac110-145g","fluval-ammonia-remover-19633-ac50-429g-3pack","fluval-ammonia-remover-19635-ac70-ac110-1038g-3pack","fluval-zeo-carb-19650-ac20-ac30-60g","fluval-zeo-carb-19651-ac20-ac30-180g-3pack","fluval-zeo-carb-19652-ac50-90g","fluval-zeo-carb-19653-ac50-270g-3pack","fluval-clear-carb-19626-ac20-ac30-55g","fluval-clear-carb-19627-ac50-75g"].map((id) => careProductCatalog.find((item) => item.id === id)?.description.match(/ürün kodu ([A-Z0-9-]+)/)?.[1]), ["19645","19633","19635","19650","19651","19652","19653","19626","19627"], "Fluval kalan AC medya paketleri doğru ürün kodlarıyla eşleşmeli");
assert(careProductCatalog.find((item) => item.id === "fluval-carbon-19645-ac70-ac110-145g")?.description.includes("aynı UPC BIOMAX 19665") && careProductCatalog.find((item) => item.id === "fluval-carbon-19645-ac70-ac110-145g")?.description.includes("benzersiz ürün doğrulayıcısı olarak kullanılmamıştır"), "Fluval 19645 ve 19665 arasındaki resmî UPC çakışması görünür tutulmalı");
assert.equal(fluvalCare.filter((item) => item.id.startsWith("fluval-zeo-carb-196")).length, 4, "Fluval AC Zeo-Carb ailesinin dört doğrulanmış paketi bulunmalı");
assert.equal(fluvalCare.filter((item) => item.model.startsWith("Clear-Carb")).length, 3, "Fluval AC Clear-Carb ailesinin üç doğrulanmış paketi bulunmalı");
const fluvalBioFoamIds = ["fluval-bio-foam-19598-ac20","fluval-bio-foam-19670-ac20-3pack","fluval-bio-foam-19605-ac30","fluval-bio-foam-19672-ac30-3pack","fluval-bio-foam-19613-ac50","fluval-bio-foam-19674-ac50-3pack","fluval-bio-foam-19618-ac70","fluval-bio-foam-19676-ac70-3pack","fluval-bio-foam-19623-ac110"];
assert.deepEqual(fluvalBioFoamIds.map((id) => careProductCatalog.find((item) => item.id === id)?.description.match(/ürün kodu ([A-Z0-9-]+)/)?.[1]), ["19598","19670","19605","19672","19613","19674","19618","19676","19623"], "Fluval AC Bio-Foam tekli ve çoklu paketleri doğru ürün kodlarıyla eşleşmeli");
assert.equal(fluvalBioFoamIds.filter((id) => careProductCatalog.find((item) => item.id === id)?.description.includes("30 PPI")).length, 8, "Fluval AC20–AC70 Bio-Foam seçeneklerinin sekizi resmî 30 PPI yoğunluğunu taşımalı");
assert(careProductCatalog.find((item) => item.id === "fluval-bio-foam-19623-ac110")?.description.includes("20 PPI") && careProductCatalog.find((item) => item.id === "fluval-bio-foam-19623-ac110")?.description.includes("farklı olarak"), "Fluval AC110 Bio-Foam'ın resmî 20 PPI farkı görünür olmalı");
const fluvalMaintenanceKitIds = ["fluval-media-maintenance-kit-19690-ac20","fluval-media-maintenance-kit-19691-ac30","fluval-media-maintenance-kit-19692-ac50","fluval-media-maintenance-kit-19693-ac70","fluval-media-maintenance-kit-19694-ac110"];
assert.deepEqual(fluvalMaintenanceKitIds.map((id) => careProductCatalog.find((item) => item.id === id)?.description.match(/ürün kodu ([A-Z0-9-]+)/)?.[1]), ["19690","19691","19692","19693","19694"], "Fluval AC bakım kitleri doğru ürün kodlarıyla eşleşmeli");
assert(fluvalMaintenanceKitIds.slice(0,4).every((id) => careProductCatalog.find((item) => item.id === id)?.description.includes("iki Carbon, bir Bio-Foam ve bir BIOMAX")), "Fluval AC20–AC70 bakım kitlerinin yayımlanan içerikleri korunmalı");
assert(careProductCatalog.find((item) => item.id === "fluval-media-maintenance-kit-19694-ac110")?.description.includes("dört Carbon, bir Bio-Foam ve iki BIOMAX"), "Fluval AC110 bakım kitinin daha büyük resmî içeriği korunmalı");
const fluvalInsertBagIds = ["fluval-filter-insert-bag-a1360-ac20-2pack","fluval-filter-insert-bag-a1362-ac30-2pack","fluval-filter-insert-bag-a1364-ac50-2pack","fluval-filter-insert-bag-a1366-ac70-2pack","fluval-filter-insert-bag-a1368-ac110-2pack"];
assert.deepEqual(fluvalInsertBagIds.map((id) => careProductCatalog.find((item) => item.id === id)?.description.match(/ürün kodu ([A-Z0-9-]+)/)?.[1]), ["A1360","A1362","A1364","A1366","A1368"], "Fluval AC filtre medya torbaları doğru ürün kodlarıyla eşleşmeli");
assert(fluvalInsertBagIds.every((id) => careProductCatalog.find((item) => item.id === id)?.description.includes("yeniden kullanılabilir") && careProductCatalog.find((item) => item.id === id)?.category === "filter_media"), "Fluval AC medya torbaları kapasite üretmeyen yeniden kullanılabilir filtre medyası olmalı");
assert.deepEqual(["fluval-flex-2-foam-block-a1409-3pack","fluval-kuhl-coarse-filter-pad-a1381-4pack","fluval-kuhl-fine-filter-pad-a1383-3pack","fluval-flex-2-poly-carb-a1407-3pack"].map((id) => careProductCatalog.find((item) => item.id === id)?.description.match(/ürün kodu ([A-Z0-9-]+)/)?.[1]), ["A1409","A1381","A1383","A1407"], "Fluval Flex 2.0 ve Kühl filtre sarfları doğru ürün kodlarıyla eşleşmeli");
assert(careProductCatalog.find((item) => item.id === "fluval-flex-2-foam-block-a1409-3pack")?.description.includes("57 L") && careProductCatalog.find((item) => item.id === "fluval-flex-2-poly-carb-a1407-3pack")?.description.includes("34 ve 57 L"), "Fluval Flex 2.0 sarflarının farklı kit uyumlulukları korunmalı");
assert(careProductCatalog.find((item) => item.id === "fluval-kuhl-fine-filter-pad-a1383-3pack")?.description.includes("amonyak giderici") && careProductCatalog.find((item) => item.id === "fluval-kuhl-fine-filter-pad-a1383-3pack")?.description.includes("karbon granülleri"), "Fluval Kühl Fine pedin yayımlanan üç aşamalı medya yapısı korunmalı");
const fluvalAquariumMediaIds = ["fluval-clearx-a1336-4pack","fluval-foam-block-a1376-spec-evo-flex-betta","fluval-foam-block-10532-spec16-evo13-5","fluval-foam-block-a1375-flex15","fluval-edge-foam-biomax-renewal-a1389","fluval-betta-diffusion-pad-a1337-4pack"];
assert.deepEqual(fluvalAquariumMediaIds.map((id) => careProductCatalog.find((item) => item.id === id)?.description.match(/ürün kodu ([A-Z0-9-]+)/)?.[1]), ["A1336","A1376","10532","A1375","A1389","A1337"], "Fluval akvaryuma özel medya ürünleri doğru kodlarla eşleşmeli");
assert(careProductCatalog.find((item) => item.id === "fluval-clearx-a1336-4pack")?.description.includes("60 L'ye kadar") && careProductCatalog.find((item) => item.id === "fluval-clearx-a1336-4pack")?.description.includes("su değişiminin yerine geçmez"), "Fluval ClearX kapasite ve bakım sınırını görünür tutmalı");
assert(careProductCatalog.find((item) => item.id === "fluval-foam-block-10532-spec16-evo13-5")?.description.includes("aynı parça değildir") && careProductCatalog.find((item) => item.id === "fluval-foam-block-a1375-flex15")?.description.includes("önceki nesil"), "Fluval benzer köpük bloklarının nesil ve ölçü farkları korunmalı");
const fluvalKitMediaIds = ["fluval-biomax-a1378-spec-evo-flex-betta-60g","fluval-carbon-a1377-spec-evo-flex-45g-3pack","fluval-edge-carbon-a1379-45g-3pack","fluval-betta-poly-carb-a1338-4pack"];
assert.deepEqual(fluvalKitMediaIds.map((id) => careProductCatalog.find((item) => item.id === id)?.description.match(/ürün kodu ([A-Z0-9-]+)/)?.[1]), ["A1378","A1377","A1379","A1338"], "Fluval BIOMAX ve kit karbon medyaları doğru ürün kodlarıyla eşleşmeli");
assert(careProductCatalog.find((item) => item.id === "fluval-biomax-a1378-spec-evo-flex-betta-60g")?.description.includes("biyolojik döngü ve testin yerine geçmez"), "Fluval kit BIOMAX kaydı biyolojik güvenlik sınırını taşımalı");
assert(careProductCatalog.find((item) => item.id === "fluval-betta-poly-carb-a1338-4pack")?.additionalSourceUrls?.some((url) => url.endsWith("10496_Betta-Aquarium_Manual.pdf")), "Fluval Betta Poly-Carb resmî bakım kılavuzuyla çapraz doğrulanmalı");
const fluvalSmallKitMediaIds = ["fluval-edge-prefilter-sponge-a1387","fluval-chi-foam-pad-combo-a1426","fluval-chi-filter-pad-a1424-3pack","fluval-ammonia-remover-a1333-flex-spec-evo-4pack"];
assert.deepEqual(fluvalSmallKitMediaIds.map((id) => careProductCatalog.find((item) => item.id === id)?.description.match(/ürün kodu ([A-Z0-9-]+)/)?.[1]), ["A1387","A1426","A1424","A1333"], "Fluval Edge, Chi ve Flex/Spec/Evo sarfları doğru ürün kodlarıyla eşleşmeli");
assert(careProductCatalog.find((item) => item.id === "fluval-edge-prefilter-sponge-a1387")?.description.includes("küçük ve yavru balıkların") && careProductCatalog.find((item) => item.id === "fluval-edge-prefilter-sponge-a1387")?.description.includes("bağımsız filtre kapasitesi üretmez"), "Fluval Edge ön filtrenin küçük balık koruması ve pasif yapısı korunmalı");
assert(careProductCatalog.find((item) => item.id === "fluval-ammonia-remover-a1333-flex-spec-evo-4pack")?.description.includes("aylık ya da su testi gerektirdiğinde") && careProductCatalog.find((item) => item.id === "fluval-ammonia-remover-a1333-flex-spec-evo-4pack")?.description.includes("biyolojik döngü, su testi ve uygun su değişiminin yerine geçmez"), "Fluval A1333 kullanım aralığı test sonucuna bağlı kalmalı ve temel bakımı ikame etmemeli");
const fluvalNanoMediaIds = ["fluval-chi-foam-pad-a1425-2pack","fluval-nano-bio-foam-a456","fluval-nano-fine-foam-a457-2pack","fluval-nano-carbon-a458-2pack"];
assert.deepEqual(fluvalNanoMediaIds.map((id) => careProductCatalog.find((item) => item.id === id)?.description.match(/ürün kodu ([A-Z0-9-]+)/)?.[1]), ["A1425","A456","A457","A458"], "Fluval Chi köpük ve Nano filtre medya seçenekleri doğru ürün kodlarıyla eşleşmeli");
assert(careProductCatalog.find((item) => item.id === "fluval-chi-foam-pad-a1425-2pack")?.description.includes("A1424 filtre pediyle birlikte") && careProductCatalog.find((item) => item.id === "fluval-chi-filter-pad-a1424-3pack")?.description.includes("A1425 köpük pedle birlikte"), "Fluval Chi mekanik ve kimyasal pedlerin karşılıklı kullanım eşleşmesi korunmalı");
assert(fluvalNanoMediaIds.slice(1).every((id) => careProductCatalog.find((item) => item.id === id)?.description.includes("A455 Nano Aquarium Filter")), "Fluval Nano sarflarının A455 cihaz uyumluluğu açık olmalı");
assert(careProductCatalog.find((item) => item.id === "fluval-nano-carbon-a458-2pack")?.description.includes("su değişiminin yerine geçmez") && careProductCatalog.find((item) => item.id === "fluval-nano-bio-foam-a456")?.description.includes("bağımsız filtre kapasitesi üretmez"), "Fluval Nano karbonun bakım sınırı ve Bio-Foam'ın pasif medya yapısı korunmalı");
const fluvalUBioFoamIds = ["fluval-u1-bio-foam-a485-2pack","fluval-u2-bio-foam-a486-2pack","fluval-u3-bio-foam-a487-2pack","fluval-u4-bio-foam-a488-2pack"];
assert.deepEqual(fluvalUBioFoamIds.map((id) => careProductCatalog.find((item) => item.id === id)?.description.match(/ürün kodu ([A-Z0-9-]+)/)?.[1]), ["A485","A486","A487","A488"], "Fluval U1–U4 Bio-Foam pedleri doğru ürün kodlarıyla eşleşmeli");
const fluvalUPolyCarbIds = ["fluval-u2-poly-carb-a490-2pack","fluval-u3-poly-carb-a491-2pack","fluval-u4-poly-carb-a492-2pack"];
assert.deepEqual(fluvalUPolyCarbIds.map((id) => careProductCatalog.find((item) => item.id === id)?.description.match(/ürün kodu ([A-Z0-9-]+)/)?.[1]), ["A490","A491","A492"], "Fluval U2–U4 Poly-Carb kartuşları doğru ürün kodlarıyla eşleşmeli");
assert(fluvalUPolyCarbIds.every((id) => careProductCatalog.find((item) => item.id === id)?.description.includes("polyester yüz") && careProductCatalog.find((item) => item.id === id)?.description.includes("karbon yüz")), "Fluval U Poly-Carb kartuşlarının iki farklı filtre yüzü korunmalı");
const fluvalUPolyMaxIds = ["fluval-u2-poly-max-a481-2pack","fluval-u3-poly-max-a482-2pack","fluval-u4-poly-max-a483-2pack"];
assert.deepEqual(fluvalUPolyMaxIds.map((id) => careProductCatalog.find((item) => item.id === id)?.description.match(/ürün kodu ([A-Z0-9-]+)/)?.[1]), ["A481","A482","A483"], "Fluval U2–U4 Poly-Max kartuşları doğru ürün kodlarıyla eşleşmeli");
assert(fluvalUPolyMaxIds.every((id) => careProductCatalog.find((item) => item.id === id)?.description.includes("fosfat, nitrit ve nitrat")), "Fluval U Poly-Max kartuşlarının yayımlanan adsorpsiyon kapsamı korunmalı");
assert(careProductCatalog.find((item) => item.id === "fluval-u2-poly-max-a481-2pack")?.description.includes("Poly-Max") && careProductCatalog.find((item) => item.id === "fluval-u2-poly-max-a481-2pack")?.description.includes("Clearmax") && careProductCatalog.find((item) => item.id === "fluval-u2-poly-max-a481-2pack")?.additionalSourceUrls?.some((url) => url.endsWith("Underwater-Filter_Manual.pdf")), "Fluval A481 güncel ürün adı ile resmî kılavuzdaki ad farkını görünür tutmalı");
const fluvalCFoamIds = ["fluval-c2-foam-pad-14005-2pack","fluval-c3-foam-pad-14006-2pack","fluval-c4-foam-pad-14007-2pack"];
assert.deepEqual(fluvalCFoamIds.map((id) => careProductCatalog.find((item) => item.id === id)?.description.match(/ürün kodu ([A-Z0-9-]+)/)?.[1]), ["14005","14006","14007"], "Fluval C2–C4 mekanik köpük pedleri doğru ürün kodlarıyla eşleşmeli");
assert(fluvalCFoamIds.every((id) => careProductCatalog.find((item) => item.id === id)?.description.includes("bağımsız filtre kapasitesi üretmez")), "Fluval C serisi köpük pedleri pasif medya olarak kalmalı");
const fluvalCPolyFoamIds = ["fluval-c2-poly-foam-pad-14008-3pack","fluval-c3-poly-foam-pad-14009-3pack","fluval-c4-poly-foam-pad-14010-3pack"];
assert.deepEqual(fluvalCPolyFoamIds.map((id) => careProductCatalog.find((item) => item.id === id)?.description.match(/ürün kodu ([A-Z0-9-]+)/)?.[1]), ["14008","14009","14010"], "Fluval C2–C4 Poly/Foam pedleri doğru ürün kodlarıyla eşleşmeli");
assert(fluvalCPolyFoamIds.every((id) => careProductCatalog.find((item) => item.id === id)?.description.includes("birinci aşamada") && careProductCatalog.find((item) => item.id === id)?.description.includes("ikinci aşamada")), "Fluval C serisi Poly/Foam pedlerin iki mekanik aşaması korunmalı");
const fluvalCBioScreenIds = ["fluval-c2-bio-screen-14020-3pack","fluval-c3-bio-screen-14021-3pack","fluval-c4-bio-screen-14022-3pack"];
assert.deepEqual(fluvalCBioScreenIds.map((id) => careProductCatalog.find((item) => item.id === id)?.description.match(/ürün kodu ([A-Z0-9-]+)/)?.[1]), ["14020","14021","14022"], "Fluval C2–C4 Bio-Screen pedleri doğru ürün kodlarıyla eşleşmeli");
assert(fluvalCBioScreenIds.every((id) => careProductCatalog.find((item) => item.id === id)?.description.includes("damlatma haznesine eşit dağıtır") && careProductCatalog.find((item) => item.id === id)?.description.includes("biyolojik döngü ve testin yerine geçmez")), "Fluval C serisi Bio-Screen işlevi ve biyolojik güvenlik sınırı korunmalı");
const fluvalCCarbonIds = ["fluval-c2-carbon-14011-45g-3pack","fluval-c3-carbon-14012-70g-3pack","fluval-c4-carbon-14013-140g-3pack"];
assert.deepEqual(fluvalCCarbonIds.map((id) => careProductCatalog.find((item) => item.id === id)?.description.match(/ürün kodu ([A-Z0-9-]+)/)?.[1]), ["14011","14012","14013"], "Fluval C2–C4 aktif karbon paketleri doğru ürün kodlarıyla eşleşmeli");
assert.deepEqual(fluvalCCarbonIds.map((id) => careProductCatalog.find((item) => item.id === id)?.description.match(/paket toplamı (\d+) g/)?.[1]), ["45","70","140"], "Fluval C2–C4 aktif karbon paketleri yayımlanan toplam ağırlıkları taşımalı");
const fluvalCAmmoniaIds = ["fluval-c2-ammonia-remover-14014-90g-3pack","fluval-c3-ammonia-remover-14015-140g-3pack","fluval-c4-ammonia-remover-14016-290g-3pack"];
assert.deepEqual(fluvalCAmmoniaIds.map((id) => careProductCatalog.find((item) => item.id === id)?.description.match(/ürün kodu ([A-Z0-9-]+)/)?.[1]), ["14014","14015","14016"], "Fluval C2–C4 amonyak medyaları doğru ürün kodlarıyla eşleşmeli");
assert(fluvalCAmmoniaIds.every((id) => careProductCatalog.find((item) => item.id === id)?.description.includes("tatlı su") && careProductCatalog.find((item) => item.id === id)?.description.includes("biyolojik döngü, su testi ve su değişiminin yerine geçmez")), "Fluval C amonyak medyalarının tatlı su ve temel bakım sınırları korunmalı");
const fluvalCZeoCarbIds = ["fluval-c2-zeo-carb-14017-70g-3pack","fluval-c3-zeo-carb-14018-3pack","fluval-c4-zeo-carb-14019-3pack"];
assert.deepEqual(fluvalCZeoCarbIds.map((id) => careProductCatalog.find((item) => item.id === id)?.description.match(/ürün kodu ([A-Z0-9-]+)/)?.[1]), ["14017","14018","14019"], "Fluval C2–C4 Zeo-Carb paketleri doğru ürün kodlarıyla eşleşmeli");
assert(careProductCatalog.find((item) => item.id === "fluval-c3-zeo-carb-14018-3pack")?.description.includes("4,58 oz ile 140 g") && careProductCatalog.find((item) => item.id === "fluval-c4-zeo-carb-14019-3pack")?.description.includes("2,47 oz ile 230 g") && fluvalCZeoCarbIds.slice(1).every((id) => careProductCatalog.find((item) => item.id === id)?.description.includes("ağırlık kesin alan olarak kullanılmamıştır")), "Fluval C3/C4 Zeo-Carb resmî ağırlık çelişkileri kesin değere dönüştürülmemeli");
const fluvalCNodeIds = ["fluval-c-nodes-14023-c2-c3-100g","fluval-c-nodes-14024-c4-200g"];
assert.deepEqual(fluvalCNodeIds.map((id) => careProductCatalog.find((item) => item.id === id)?.description.match(/ürün kodu ([A-Z0-9-]+)/)?.[1]), ["14023","14024"], "Fluval C-Nodes seçenekleri doğru ürün kodlarıyla eşleşmeli");
assert(fluvalCNodeIds.every((id) => careProductCatalog.find((item) => item.id === id)?.description.includes("yıldız biçimli") && careProductCatalog.find((item) => item.id === id)?.description.includes("biyolojik döngü ve testin yerine geçmez")), "Fluval C-Nodes yapısı ve biyolojik güvenlik sınırı korunmalı");
const fluvalCSeriesMediaIds = [...fluvalCFoamIds,...fluvalCPolyFoamIds,...fluvalCBioScreenIds,...fluvalCCarbonIds,...fluvalCAmmoniaIds,...fluvalCZeoCarbIds,...fluvalCNodeIds];
assert.equal(fluvalCSeriesMediaIds.length, 20, "Fluval resmî C-Series medya arşivindeki 20 ayrı ürün seçeneğinin tamamı testte izlenmeli");
assert.equal(new Set(fluvalCSeriesMediaIds).size, 20, "Fluval C-Series medya test listesinde yinelenen kayıt olmamalı");
assert(fluvalCSeriesMediaIds.every((id) => {
  const item = careProductCatalog.find((candidate) => candidate.id === id);
  return item?.brand === "Fluval" && item.category === "filter_media" && item.verifiedAt === "2026-09-28" && item.sourceUrl.startsWith("https://fluvalaquatics.com/");
}), "Fluval C-Series'in 20 medya kaydı güncel resmî üretici sayfasına bağlı filtre medyası olmalı");
const fluvalFxMediaIds = ["fluval-fx2-bio-foam-a227-2pack","fluval-fx4-fx5-fx6-bio-foam-a228-3pack","fluval-fx-bio-foam-plus-a239-2pack","fluval-fx-carbon-foam-a249-2pack","fluval-fx-quick-clear-a246-3pack","fluval-fx-max-clean-a248-3pack","fluval-fx-nitrite-remover-a265-3pack","fluval-fx-ammonia-remover-a259-3pack","fluval-fx-phosphate-remover-a262-3pack"];
assert.deepEqual(fluvalFxMediaIds.map((id) => careProductCatalog.find((item) => item.id === id)?.description.match(/ürün kodu ([A-Z0-9-]+)/)?.[1]), ["A227","A228","A239","A249","A246","A248","A265","A259","A262"], "Fluval FX medya paketleri doğru resmî ürün kodlarıyla eşleşmeli");
assert(fluvalFxMediaIds.every((id) => {
  const item = careProductCatalog.find((candidate) => candidate.id === id);
  return item?.brand === "Fluval" && item.category === "filter_media" && item.verifiedAt === "2026-09-28" && item.sourceUrl.startsWith("https://fluvalaquatics.com/us/shop/product/");
}), "Fluval FX medya kayıtları güncel doğrudan üretici sayfalarına bağlı olmalı");
assert(careProductCatalog.find((item) => item.id === "fluval-fx-max-clean-a248-3pack")?.description.includes("A246 Quick-Clear ile birlikte"), "Fluval FX Max-Clean resmî tamamlayıcı Quick-Clear ilişkisini korumalı");
assert(careProductCatalog.find((item) => item.id === "fluval-fx-nitrite-remover-a265-3pack")?.description.includes("su testi sonucuna göre") && careProductCatalog.find((item) => item.id === "fluval-fx-nitrite-remover-a265-3pack")?.description.includes("biyolojik döngü ve su değişiminin yerine geçmez"), "Fluval FX nitrit pedinin test temelli kullanım ve temel bakım sınırı korunmalı");
assert(careProductCatalog.find((item) => item.id === "fluval-fx-ammonia-remover-a259-3pack")?.description.includes("biyolojik döngü, su testi ve uygun su değişiminin yerine geçmez"), "Fluval FX amonyak pedinin temel bakım güvenlik sınırı korunmalı");
assert(careProductCatalog.find((item) => item.id === "fluval-fx-phosphate-remover-a262-3pack")?.additionalSourceUrls?.some((url) => url.includes("/uk/shop/product/")) && careProductCatalog.find((item) => item.id === "fluval-fx-phosphate-remover-a262-3pack")?.description.includes("su testi sonucuna göre"), "Fluval FX fosfat pedi resmî bölgesel bakım sıklığı kaynağına bağlı olmalı");
const fluvalBioFxIds = ["fluval-bio-fx-a1458-2l","fluval-bio-fx-a1459-5l"];
assert.deepEqual(fluvalBioFxIds.map((id) => careProductCatalog.find((item) => item.id === id)?.description.match(/ürün kodu ([A-Z0-9-]+)/)?.[1]), ["A1458","A1459"], "Fluval BIO-FX hacimleri doğru resmî ürün kodlarıyla eşleşmeli");
assert.deepEqual(fluvalBioFxIds.map((id) => careProductCatalog.find((item) => item.id === id)?.description.match(/(2|5) L güvenli/)?.[1]), ["2","5"], "Fluval BIO-FX iki gerçek hacim seçeneğini ayrı tutmalı");
assert(fluvalBioFxIds.every((id) => careProductCatalog.find((item) => item.id === id)?.description.includes("2.250 m²") && careProductCatalog.find((item) => item.id === id)?.description.includes("biyolojik döngü ve su testinin yerine geçmez")), "Fluval BIO-FX yayımlanan yüzey alanını ve biyolojik güvenlik sınırını taşımalı");
const fluval07BioFoamValuePackIds = ["fluval-106-107-bio-foam-value-pack-a334","fluval-206-207-bio-foam-value-pack-a335","fluval-306-307-bio-foam-value-pack-a336","fluval-406-407-bio-foam-value-pack-a337"];
assert.deepEqual(fluval07BioFoamValuePackIds.map((id) => careProductCatalog.find((item) => item.id === id)?.description.match(/ürün kodu ([A-Z0-9-]+)/)?.[1]), ["A334","A335","A336","A337"], "Fluval 06/07 Bio-Foam Value Pack seçenekleri doğru ürün kodlarıyla eşleşmeli");
assert.deepEqual(fluval07BioFoamValuePackIds.map((id) => careProductCatalog.find((item) => item.id === id)?.description.match(/UPC (\d+)/)?.[1]), ["015561103343","015561103350","015561103367","015561103374"], "Fluval 06/07 Bio-Foam Value Pack seçenekleri doğru UPC'leri taşımalı");
assert(careProductCatalog.find((item) => item.id === "fluval-106-107-bio-foam-value-pack-a334")?.description.includes("2 × A187") && careProductCatalog.find((item) => item.id === "fluval-206-207-bio-foam-value-pack-a335")?.description.includes("2 × A188") && careProductCatalog.find((item) => item.id === "fluval-306-307-bio-foam-value-pack-a336")?.description.includes("2 × A237") && careProductCatalog.find((item) => item.id === "fluval-406-407-bio-foam-value-pack-a337")?.description.includes("2 × A189"), "Fluval 06/07 Value Pack içerikleri filtre modeline göre ayrışmalı");
const fluval07BioFoamIds = ["fluval-106-107-bio-foam-a220-2pack","fluval-206-306-207-307-bio-foam-a222-2pack","fluval-406-407-bio-foam-a226-2pack"];
assert.deepEqual(fluval07BioFoamIds.map((id) => careProductCatalog.find((item) => item.id === id)?.description.match(/ürün kodu ([A-Z0-9-]+)/)?.[1]), ["A220","A222","A226"], "Fluval 06/07 standart Bio-Foam paketleri doğru ürün kodlarıyla eşleşmeli");
const fluval07BioFoamPlusIds = ["fluval-106-206-107-207-bio-foam-plus-a236-3pack","fluval-306-406-307-407-bio-foam-plus-a237-2pack"];
assert.deepEqual(fluval07BioFoamPlusIds.map((id) => careProductCatalog.find((item) => item.id === id)?.description.match(/ürün kodu ([A-Z0-9-]+)/)?.[1]), ["A236","A237"], "Fluval 06/07 Bio-Foam+ paketleri doğru ürün kodlarıyla eşleşmeli");
const fluval07BioFoamMaxIds = ["fluval-106-107-bio-foam-max-a187-2pack","fluval-206-306-207-307-bio-foam-max-a188-2pack","fluval-406-407-bio-foam-max-a189-2pack"];
assert.deepEqual(fluval07BioFoamMaxIds.map((id) => careProductCatalog.find((item) => item.id === id)?.description.match(/ürün kodu ([A-Z0-9-]+)/)?.[1]), ["A187","A188","A189"], "Fluval 06/07 Bio-Foam Max paketleri doğru ürün kodlarıyla eşleşmeli");
assert(fluval07BioFoamMaxIds.every((id) => careProductCatalog.find((item) => item.id === id)?.description.includes("%30 daha fazla alan") && careProductCatalog.find((item) => item.id === id)?.description.includes("altı ayda değişim")), "Fluval 06/07 Bio-Foam Max yayımlanan yüzey ve değişim bilgisini taşımalı");
const fluval07BioFoamAllIds = [...fluval07BioFoamValuePackIds,...fluval07BioFoamIds,...fluval07BioFoamPlusIds,...fluval07BioFoamMaxIds];
assert.equal(fluval07BioFoamAllIds.length, 12, "Fluval 06/07 Bio-Foam alt ailesindeki 12 gerçek satış paketi testte izlenmeli");
assert(fluval07BioFoamAllIds.every((id) => {
  const item = careProductCatalog.find((candidate) => candidate.id === id);
  return item?.category === "filter_media" && item.verifiedAt === "2026-09-28" && item.sourceUrl.startsWith("https://fluvalaquatics.com/us/shop/product/");
}), "Fluval 06/07 Bio-Foam alt ailesi güncel doğrudan üretici sayfalarına bağlı olmalı");
const fluval07ChemicalPadIds = ["fluval-106-206-107-207-quick-clear-a242-3pack","fluval-306-406-307-407-quick-clear-a244-6pack","fluval-106-206-107-207-ammonia-remover-a257-3pack","fluval-306-406-307-407-ammonia-remover-a258-6pack","fluval-106-206-107-207-nitrite-remover-a263-3pack","fluval-306-406-307-407-nitrite-remover-a264-6pack","fluval-106-206-107-207-phosphate-remover-a260-3pack","fluval-306-406-307-407-phosphate-remover-a261-6pack"];
assert.deepEqual(fluval07ChemicalPadIds.map((id) => careProductCatalog.find((item) => item.id === id)?.description.match(/ürün kodu ([A-Z0-9-]+)/)?.[1]), ["A242","A244","A257","A258","A263","A264","A260","A261"], "Fluval 06/07 kimyasal ve parlatma pedleri doğru resmî ürün kodlarıyla eşleşmeli");
assert.deepEqual(fluval07ChemicalPadIds.map((id) => careProductCatalog.find((item) => item.id === id)?.description.match(/UPC (\d+)/)?.[1]), ["015561102421","015561102445","015561102575","015561102582","015561102636","015561102643","015561102605","015561102612"], "Fluval 06/07 kimyasal ve parlatma pedleri doğru UPC'leri taşımalı");
assert.deepEqual(fluval07ChemicalPadIds.map((id) => {
  const model = careProductCatalog.find((item) => item.id === id)?.model || "";
  return model.includes("3'lü paket") ? "3" : model.includes("6'lı paket") ? "6" : undefined;
}), ["3","6","3","6","3","6","3","6"], "Fluval 06/07 küçük ve büyük filtre pedleri üçlü ve altılı gerçek paketler olarak ayrılmalı");
assert(fluval07ChemicalPadIds.every((id) => {
  const item = careProductCatalog.find((candidate) => candidate.id === id);
  return item?.category === "filter_media" && item.verifiedAt === "2026-09-28" && item.sourceUrl.startsWith("https://fluvalaquatics.com/us/shop/product/");
}), "Fluval 06/07 kimyasal ve parlatma pedleri güncel doğrudan üretici sayfalarına bağlı olmalı");
assert(fluval07ChemicalPadIds.slice(2,4).every((id) => careProductCatalog.find((item) => item.id === id)?.description.includes("biyolojik döngü, su testi ve uygun su değişiminin yerine geçmez")), "Fluval 06/07 amonyak pedlerinin temel bakım güvenlik sınırı korunmalı");
assert(fluval07ChemicalPadIds.slice(4,6).every((id) => careProductCatalog.find((item) => item.id === id)?.description.includes("su testiyle değerlendirilmelidir") && careProductCatalog.find((item) => item.id === id)?.description.includes("biyolojik döngü ve su değişiminin yerine geçmez")), "Fluval 06/07 nitrit pedleri test temelli kullanım ve biyolojik güvenlik sınırı taşımalı");
assert(fluval07ChemicalPadIds.slice(6).every((id) => careProductCatalog.find((item) => item.id === id)?.description.includes("su testiyle değerlendirilmelidir") && careProductCatalog.find((item) => item.id === id)?.description.includes("temel bakım ve su değişiminin yerine geçmez")), "Fluval 06/07 fosfat pedleri test temelli kullanım ve temel bakım sınırı taşımalı");
const fluval07MediaValuePackIds = ["fluval-106-206-107-207-media-value-pack-a1461","fluval-306-406-307-407-media-value-pack-a1462"];
assert.deepEqual(fluval07MediaValuePackIds.map((id) => careProductCatalog.find((item) => item.id === id)?.description.match(/ürün kodu ([A-Z0-9-]+)/)?.[1]), ["A1461","A1462"], "Fluval 06/07 Media Value Pack seçenekleri doğru ürün kodlarıyla eşleşmeli");
assert.deepEqual(fluval07MediaValuePackIds.map((id) => careProductCatalog.find((item) => item.id === id)?.description.match(/UPC (\d+)/)?.[1]), ["015561114615","015561114622"], "Fluval 06/07 Media Value Pack seçenekleri doğru UPC'leri taşımalı");
assert(careProductCatalog.find((item) => item.id === "fluval-106-206-107-207-media-value-pack-a1461")?.description.includes("6 × Carbon A1440") && careProductCatalog.find((item) => item.id === "fluval-106-206-107-207-media-value-pack-a1461")?.description.includes("3 × Quick-Clear A242") && careProductCatalog.find((item) => item.id === "fluval-106-206-107-207-media-value-pack-a1461")?.description.includes("6 × Phosphate Remover A260"), "Fluval küçük 06/07 medya paketinin resmî içeriği korunmalı");
assert(careProductCatalog.find((item) => item.id === "fluval-306-406-307-407-media-value-pack-a1462")?.description.includes("12 × Carbon A1440") && careProductCatalog.find((item) => item.id === "fluval-306-406-307-407-media-value-pack-a1462")?.description.includes("6 × Quick-Clear A242") && careProductCatalog.find((item) => item.id === "fluval-306-406-307-407-media-value-pack-a1462")?.description.includes("12 × Phosphate Remover A260"), "Fluval büyük 06/07 medya paketinin resmî içeriği korunmalı");
assert(fluval07MediaValuePackIds.every((id) => {
  const item = careProductCatalog.find((candidate) => candidate.id === id);
  return item?.category === "filter_media" && item.verifiedAt === "2026-09-28" && item.sourceUrl.startsWith("https://fluvalaquatics.com/us/shop/product/") && item.description.includes("altı aylık");
}), "Fluval 06/07 Media Value Pack seçenekleri altı aylık ve doğrudan resmî kaynaklı olmalı");
const fluvalGeneralCanisterMediaIds = ["fluval-ammonia-remover-a1480-180g-3pack","fluval-ammonia-remover-a1486-1600g","fluval-zeo-carb-a1490-150g-3pack","fluval-zeo-carb-a1492-1200g","fluval-clearmax-a1348-100g-3pack","fluval-pre-filter-a1470-750g"];
assert.deepEqual(fluvalGeneralCanisterMediaIds.map((id) => careProductCatalog.find((item) => item.id === id)?.description.match(/ürün kodu ([A-Z0-9-]+)/)?.[1]), ["A1480","A1486","A1490","A1492","A1348","A1470"], "Fluval genel dış filtre medyaları doğru resmî ürün kodlarıyla eşleşmeli");
assert.deepEqual(fluvalGeneralCanisterMediaIds.map((id) => careProductCatalog.find((item) => item.id === id)?.model.match(/(180 g|1600 g|150 g|1200 g|100 g|750 g)/)?.[1]), ["180 g","1600 g","150 g","1200 g","100 g","750 g"], "Fluval genel dış filtre medyaları gerçek paket boyutlarını ayrı tutmalı");
assert(fluvalGeneralCanisterMediaIds.every((id) => {
  const item = careProductCatalog.find((candidate) => candidate.id === id);
  return item?.category === "filter_media" && item.verifiedAt === "2026-09-28" && item.sourceUrl.startsWith("https://fluvalaquatics.com/") && item.additionalSourceUrls?.every((url) => url.startsWith("https://fluvalaquatics.com/"));
}), "Fluval genel dış filtre medyaları güncel ve yalnız resmî üretici kaynaklarına bağlı olmalı");
const fluvalGeneralAmmoniaMediaIds = fluvalGeneralCanisterMediaIds.slice(0,4);
assert(fluvalGeneralAmmoniaMediaIds.every((id) => {
  const description = careProductCatalog.find((item) => item.id === id)?.description || "";
  return description.includes("yalnız tatlı su") && description.includes("aylık değişim") && description.includes("tüm filtre medyasını aynı anda değiştirmemeyi") && description.includes("biyolojik döngü, su testi ve uygun su değişiminin yerine geçmez");
}), "Fluval genel amonyak ve Zeo-Carb medyaları tatlı su, bakım sıklığı ve biyolojik güvenlik sınırlarını taşımalı");
const fluvalClearMax = careProductCatalog.find((item) => item.id === "fluval-clearmax-a1348-100g-3pack");
assert(fluvalClearMax?.description.includes("UPC 015561113489") && fluvalClearMax.description.includes("300 L") && fluvalClearMax.description.includes("deniz suyunda nitratı gidermez") && fluvalClearMax.description.includes("tüm medya aynı anda değiştirilmemelidir"), "Fluval ClearMax kod, kapasite, deniz suyu istisnası ve medya değişim sınırını taşımalı");
const fluvalPreFilter = careProductCatalog.find((item) => item.id === "fluval-pre-filter-a1470-750g");
assert(fluvalPreFilter?.description.includes("UPC 015561114707") && fluvalPreFilter.description.includes("inert seramik") && fluvalPreFilter.description.includes("orta ve kaba filtrasyonda") && fluvalPreFilter.description.includes("bağımsız filtre kapasitesi üretmez"), "Fluval Pre-Filter resmî kod, malzeme, işlev ve pasif medya sınırını taşımalı");
const fluvalBulkCarbonBiomaxIds = ["fluval-carbon-a1447-900g","fluval-carbon-a1448-1650g-archive","fluval-biomax-a1457-1100g"];
assert.deepEqual(fluvalBulkCarbonBiomaxIds.map((id) => careProductCatalog.find((item) => item.id === id)?.description.match(/ürün kodu ([A-Z0-9-]+)/)?.[1]), ["A1447","A1448","A1457"], "Fluval toplu Carbon ve BIOMAX seçenekleri doğru resmî ürün kodlarıyla eşleşmeli");
assert.deepEqual(fluvalBulkCarbonBiomaxIds.map((id) => careProductCatalog.find((item) => item.id === id)?.model.match(/(900 g|1650 g|1100 g)/)?.[1]), ["900 g","1650 g","1100 g"], "Fluval toplu Carbon ve BIOMAX seçenekleri gerçek paket boyutlarını ayrı tutmalı");
assert(fluvalBulkCarbonBiomaxIds.every((id) => {
  const item = careProductCatalog.find((candidate) => candidate.id === id);
  return item?.category === "filter_media" && item.verifiedAt === "2026-09-28" && item.sourceUrl.startsWith("https://fluvalaquatics.com/");
}), "Fluval toplu Carbon ve BIOMAX seçenekleri güncel resmî üretici kaynaklarına bağlı olmalı");
assert(careProductCatalog.find((item) => item.id === "fluval-carbon-a1447-900g")?.description.includes("aylık değiştirilmeli") && careProductCatalog.find((item) => item.id === "fluval-carbon-a1448-1650g-archive")?.description.includes("arşiv etiketiyle korunur"), "Fluval toplu Carbon seçenekleri bakım sıklığı ile güncel/arşiv ayrımını korumalı");
assert(careProductCatalog.find((item) => item.id === "fluval-biomax-a1457-1100g")?.description.includes("UPC 015561114578") && careProductCatalog.find((item) => item.id === "fluval-biomax-a1457-1100g")?.description.includes("altı ayda değişim") && careProductCatalog.find((item) => item.id === "fluval-biomax-a1457-1100g")?.description.includes("biyolojik döngü ve su testinin yerine geçmez"), "Fluval BIOMAX 1100 g kimlik, bakım ve biyolojik güvenlik sınırını taşımalı");
const fluvalPeat = careProductCatalog.find((item) => item.id === "fluval-peat-granules-a1465-500g");
assert(fluvalPeat?.description.includes("ürün kodu A1465") && fluvalPeat.description.includes("UPC 015561114653") && fluvalPeat.description.includes("yalnız tatlı su") && fluvalPeat.description.includes("pH ve KH düzenli ölçülmeli") && fluvalPeat.description.includes("3–5 dKH"), "Fluval Peat Granules kimlik, tatlı su, test ve kaynaklı KH sınırını taşımalı");
assert(fluvalPeat?.sourceUrl.startsWith("https://fluvalaquatics.com/") && fluvalPeat.additionalSourceUrls?.every((url) => url.startsWith("https://fluvalaquatics.com/")) && fluvalPeat.verifiedAt === "2026-09-29", "Fluval Peat Granules güncel ve yalnız resmî üretici kaynaklarına bağlı olmalı");
const fluvalZeoCarb2100 = careProductCatalog.find((item) => item.id === "fluval-zeo-carb-a1493-2100g");
assert(fluvalZeoCarb2100?.description.includes("ürün kodu A1493") && fluvalZeoCarb2100.description.includes("UPC 015561114936") && fluvalZeoCarb2100.description.includes("yalnız tatlı su") && fluvalZeoCarb2100.description.includes("aylık değişim") && fluvalZeoCarb2100.description.includes("biyolojik döngü, su testi ve uygun su değişiminin yerine geçmez"), "Fluval Zeo-Carb 2100 g kimlik, bakım ve biyolojik güvenlik sınırını taşımalı");
assert(fluvalZeoCarb2100?.sourceUrl.startsWith("https://fluvalaquatics.com/") && fluvalZeoCarb2100.additionalSourceUrls?.every((url) => url.startsWith("https://fluvalaquatics.com/")) && fluvalZeoCarb2100.verifiedAt === "2026-09-29", "Fluval Zeo-Carb 2100 g güncel ve yalnız resmî üretici kaynaklarına bağlı olmalı");
const fluvalUniversalMediaBag = careProductCatalog.find((item) => item.id === "fluval-universal-nylon-bags-a1428-2pack");
assert(fluvalUniversalMediaBag?.description.includes("ürün kodu A1428") && fluvalUniversalMediaBag.description.includes("UPC 015561114288") && fluvalUniversalMediaBag.description.includes("16,5 × 25,4 cm") && fluvalUniversalMediaBag.description.includes("bağımsız filtrasyon kapasitesi üretmez"), "Fluval evrensel medya torbası doğru kimlik, ölçü ve pasif kapasite sınırını taşımalı");
assert(fluvalUniversalMediaBag?.sourceUrl.startsWith("https://fluvalaquatics.com/") && fluvalUniversalMediaBag.additionalSourceUrls?.every((url) => url.startsWith("https://fluvalaquatics.com/")) && fluvalUniversalMediaBag.verifiedAt === "2026-09-29", "Fluval evrensel medya torbası güncel ve yalnız resmî üretici kaynaklarına bağlı olmalı");
const tetraCare = careProductCatalog.filter((item) => item.brand === "Tetra");
const tetraExpectedModels = `TetraMin Flakes
TetraMin Granules
TetraMin XL Granules
TetraMin XL Flakes
TetraMin Mini Granules
TetraMin Crisps
TetraMin Baby
TetraMin Junior
Tetra Cichlid Sticks
Tetra Cichlid XL Flakes
Tetra Rubin Granules
Tetra Betta Mini Flakes
Tetra Goldfish Flakes
Tetra Goldfish WaveSticks
Tetra Cichlid Granules
Tetra Cichlid Colour Mini Pellets
Tetra Rubin Flakes
Tetra Phyll Flakes
Tetra Phyll Granules
Tetra Malawi Flakes
Tetra Discus Granules
Tetra Goldfish Granules
Tetra Goldfish Colour Sticks
Tetra Goldfish Energy Sticks
TetraMin XL Crisps
Tetra Cichlid Mini Granules
Tetra Cichlid Shrimp Sticks
Tetra Cichlid Colour Pellets
Tetra Cichlid Algae Mini Pellets
Tetra Cichlid Algae Pellets
Tetra Discus Colour Granules
Tetra Guppy Mini Flakes
Tetra Guppy Colour Mini Flakes
Tetra Malawi Granules
Tetra Delica 4in1 Menu
Tetra Delica 4in1 Mix
Tetra Delica Brine Shrimps
Tetra Delica Daphnia
Tetra Delica Bloodworms
Tetra Delica Krill
Tetra Goldfish Menu
Tetra Wafer Mix
Tetra Wafer Mini Mix
Tetra Micro Granules
Tetra Micro Pellets
Tetra Micro Sticks
Tetra Selection
Tetra Crusta Menu
Tetra Micro Crisps
Tetra Menu
Tetra Micro Menu
Tetra Weekend
Tetra Crusta Granules
Tetra Crusta Sticks
TetraPRO Fertility
TetraPRO Algae
TetraPRO Energy
TetraPRO Colour
TetraPRO Menu
Tetra Cichlid Crisps
Tetra TabiMin Tablets
Tetra Pleco Tablets
Tetra Pleco Tablets XL
Tetra FunTips Tablets
Tetra Medica GeneralTonic Plus
Tetra Medica FungiStop Plus
Tetra Medica ContraIck Plus
Tetra AlguMin
Tetra Algetten
Tetra Algizit
Tetra AlgoStop depot
Tetra VitaMinPro 3in1
Tetra AquaSafe
Tetra EasyBalance
Tetra CrystalWater
Tetra NitrateMinus
Tetra PhosphateMinus
Tetra pH/KH Minus
Tetra pH/KH Plus
Tetra Goldfish AquaSafe
Tetra ToruMin
Tetra Vital
Tetra Wasserpflege Plus
Tetra NitrateMinus Pearls
Tetra Bactozym
Tetra FilterActive Bacteria
Tetra SafeStart Bacteria
Tetra Biocoryn Bacteria
Tetra Test 7in1
Tetra Test pH
Tetra Test NO2-
Tetra Test NO3-
Tetra CO2 Optimat Set
Tetra CO2 Optimat Refill
Tetra CO2 Plus
Tetra Crypto
Tetra PlantaStart
Tetra PlantaMin
Tetra ActiveSubstrate
Tetra CompleteSubstrate`.split("\n");
assert.equal(tetraCare.length, 100, "Tetra resmî akvaryum dizinindeki 64 yem ve 36 bakım ürünü katalogda bulunmalı");
assert.equal(tetraExpectedModels.length, 100, "Tetra beklenen model listesi 100 benzersiz ürün içermeli");
for (const model of tetraExpectedModels) {
  assert(tetraCare.some((item) => item.model === model), `Tetra ${model} bakım kataloğunda bulunmalı`);
}
for (const [category,count] of [["food",64],["treatment",7],["water_conditioner",13],["bacteria",4],["test",4],["fertilizer",6],["substrate",2]]) {
  assert.equal(tetraCare.filter((item) => item.category === category).length, count, `Tetra ${category} sınıfında ${count} ürün bulunmalı`);
}
assert(tetraCare.every((item) => item.verifiedAt === "2026-09-25"), "Tetra ürünleri güncel doğrulama tarihi taşımalı");
assert(tetraCare.every((item) => item.sourceUrl === "https://www.tetra.net/en-eu/products/nutrition-and-care/aquarium/food" || item.sourceUrl === "https://www.tetra.net/en-eu/products/nutrition-and-care/aquarium/care"), "Tetra ürünleri resmî yem veya bakım dizinine bağlanmalı");
assert(!tetraCare.some((item) => item.model === "Tetra GC Gravel Cleaner"), "Tetra GC Gravel Cleaner bakım kimyasalı gibi sınıflandırılmamalı");
const tetraGravelCleaners = equipmentCatalog.filter((item) => item.brand === "Tetra" && item.model.endsWith("Gravel Cleaner"));
assert.deepEqual(tetraGravelCleaners.map((item) => item.model), ["GC 30 Gravel Cleaner","GC 40 Gravel Cleaner","GC 50 Gravel Cleaner"], "Tetra GC dip süpürgesinin üç resmî boyu ayrı seçilebilmeli");
assert(tetraGravelCleaners.every((item) => item.category === "other" && item.passiveComponent && item.sourceUrl === "https://www.tetra.net/en-eu/products/tetra-gc-gravel-cleaner" && item.verifiedAt === "2026-09-25"), "Tetra GC dip süpürgeleri pasif ekipman ve resmî kaynaklı olmalı");
assert(tetraGravelCleaners.every((item) => item.specifications.includes("180 cm hortum") && !item.ratedFlowLph && !item.powerW && !item.recommendedMaxL), "Tetra GC dip süpürgelerine motor, debi veya hacim kapasitesi uydurulmamalı");
const tetraAccessoryModels = ["myFeeder","FN Net S","FN Net M","FN Net L","FN Net XL","FN Net XXL","Magnet Cleaner Flexible","Magnet Cleaner Flat S","Magnet Cleaner Flat M","Magnet Cleaner Flat L"];
for (const model of tetraAccessoryModels) {
  const item = equipmentCatalog.find((entry) => entry.brand === "Tetra" && entry.model === model);
  assert(item, `Tetra ${model} teknik katalogda bulunmalı`);
  assert.equal(item?.category, "other", `Tetra ${model} kapasite hesaplayan filtre veya ısıtıcı kategorisine karışmamalı`);
  assert.equal(item?.verifiedAt, "2026-09-25", `Tetra ${model} güncel doğrulama tarihini taşımalı`);
}
assert.equal(equipmentCatalog.find((item) => item.id === "tetra-myfeeder")?.passiveComponent, undefined, "Tetra myFeeder aktif cihaz olarak kalmalı");
assert(equipmentCatalog.find((item) => item.id === "tetra-myfeeder")?.specifications.includes("günde üç programa kadar"), "Tetra myFeeder resmî program kapasitesini taşımalı");
assert(tetraAccessoryModels.slice(1).every((model) => equipmentCatalog.find((item) => item.brand === "Tetra" && item.model === model)?.passiveComponent), "Tetra kepçe ve mıknatıslı temizleyiciler pasif ekipman olmalı");
const tetraCleaningAndThermometerModels = ["Magnet Cleaner Bowl","EasyWipes 10 pcs","GS 45 Aquarium Glass Scraper","SB 45 Replacement Blades 2 pcs","TH Digital Thermometer","TH 30 Thermometer","TH 35 Thermometer"];
for (const model of tetraCleaningAndThermometerModels) {
  const item = equipmentCatalog.find((entry) => entry.brand === "Tetra" && entry.model === model);
  assert(item, `Tetra ${model} teknik katalogda bulunmalı`);
  assert.equal(item?.category, "other", `Tetra ${model} kapasite hesaplayan sınıflara karışmamalı`);
  assert.equal(item?.verifiedAt, "2026-09-25", `Tetra ${model} güncel doğrulama tarihini taşımalı`);
  assert.match(item?.sourceUrl || "", /^https:\/\/www\.tetra\.net\/en-eu\/products\//, `Tetra ${model} doğrudan resmî kaynağa bağlanmalı`);
}
assert(tetraCleaningAndThermometerModels.filter((model) => model !== "TH Digital Thermometer").every((model) => equipmentCatalog.find((item) => item.brand === "Tetra" && item.model === model)?.passiveComponent), "Tetra manuel temizleme araçları ve sıvı kristal termometreler pasif ekipman olmalı");
const tetraDigitalThermometer = equipmentCatalog.find((item) => item.id === "tetra-th-digital");
assert.equal(tetraDigitalThermometer?.passiveComponent, undefined, "Tetra dijital termometre pilli aktif cihaz olarak kalmalı");
assert(tetraDigitalThermometer?.specifications.includes("95 cm") && tetraDigitalThermometer?.specifications.includes("-10–+50 °C") && tetraDigitalThermometer?.specifications.includes("LR44"), "Tetra dijital termometre resmî kablo, ölçüm aralığı ve pil bilgisini taşımalı");
assert(equipmentCatalog.find((item) => item.id === "tetra-easywipes-10")?.specifications.includes("10 tek kullanımlık mendil"), "Tetra EasyWipes resmî paket adedini taşımalı");
assert(equipmentCatalog.find((item) => item.id === "tetra-gs-45")?.specifications.includes("bir yedek bıçak dahil"), "Tetra GS 45 kutu içeriğindeki yedek bıçağı belirtmeli");
assert(equipmentCatalog.find((item) => item.id === "tetra-sb-45")?.specifications.includes("iki paslanmaz yedek bıçak"), "Tetra SB 45 resmî iki bıçaklık paketi belirtmeli");
assert(equipmentCatalog.find((item) => item.id === "tetra-th-30")?.specifications.includes("20–30 °C"), "Tetra TH 30 doğru ölçüm aralığını taşımalı");
assert(equipmentCatalog.find((item) => item.id === "tetra-th-35")?.specifications.includes("20–35 °C"), "Tetra TH 35 doğru ölçüm aralığını taşımalı");
const tetraAquaArtLights = equipmentCatalog.filter((item) => item.brand === "Tetra" && item.model.startsWith("AquaArt LED"));
assert.deepEqual(tetraAquaArtLights.map((item) => [item.model,item.powerW,item.recommendedMinL,item.recommendedMaxL]), [["AquaArt LED 20L/30L Lamp 4.8 W",4.8,20,30],["AquaArt LED 60L Lamp 9.6 W",9.6,60,60]], "Tetra AquaArt LED lambaları resmî güç ve uyumlu hacimleriyle ayrı seçilebilmeli");
assert(tetraAquaArtLights.every((item) => item.category === "lighting" && item.sourceUrl.startsWith("https://www.tetra.net/") && item.verifiedAt === "2026-09-25"), "Tetra AquaArt LED lambaları güncel resmî kaynaklı aydınlatma olmalı");
const tetraTetronicExpected = [[380,12.5,756,38,62],[580,19,1258,58,82],[780,24.5,1728,78,102],[980,28,1868,98,122],[1180,34,2380,118,142],[1380,38,2520,138,162]];
for (const [model,powerW,lumens,minLength,maxLength] of tetraTetronicExpected) {
  const item = equipmentCatalog.find((entry) => entry.brand === "Tetra" && entry.model === `Tetronic LED ProLine ${model}`);
  assert(item, `Tetra Tetronic LED ProLine ${model} teknik katalogda bulunmalı`);
  assert.deepEqual([item?.category,item?.powerW,item?.recommendedTankLengthCm], ["lighting",powerW,[minLength,maxLength]], `Tetra Tetronic ${model} resmî güç ve akvaryum uzunluğunu taşımalı`);
  assert(item?.specifications.includes(`${lumens} lm`) && item?.specifications.includes("6000 K") && item?.specifications.includes("50.000 saat"), `Tetra Tetronic ${model} resmî lümen, renk sıcaklığı ve ömür bilgisini taşımalı`);
  assert(item?.additionalSourceUrls?.some((url) => url.endsWith("TH53489_9074_2022_03_GA_Tetronic_LED_ProLine_Online.pdf")), `Tetra Tetronic ${model} resmî teknik kılavuza bağlanmalı`);
}
const tetraFilterJetExpected = [[400,400,4,50,120],[600,550,6,120,170],[900,900,12,170,230]];
for (const [model,flow,power,minL,maxL] of tetraFilterJetExpected) {
  const item = equipmentCatalog.find((entry) => entry.brand === "Tetra" && entry.model === `FilterJet ${model}`);
  assert.deepEqual([item?.category,item?.ratedFlowLph,item?.powerW,item?.recommendedMinL,item?.recommendedMaxL,item?.adjustableFlow], ["filter",flow,power,minL,maxL,true], `Tetra FilterJet ${model} resmî debi, güç ve hacim aralığını taşımalı`);
  assert(item?.additionalSourceUrls?.some((url) => url.endsWith("TH54181_9074_GA_FilterJet_400-900_KAZ_Online.pdf")), `Tetra FilterJet ${model} resmî teknik kılavuza bağlanmalı`);
}
const tetraFilterJet600 = equipmentCatalog.find((item) => item.id === "tetra-filterjet-600");
assert(tetraFilterJet600?.dataConflictNote?.includes("600 L/saat") && tetraFilterJet600?.dataConflictNote?.includes("550 L/saat"), "Tetra FilterJet 600 ürün sayfası ile kılavuz arasındaki debi farkını görünür tutmalı");
const tetraInxExpected = [[50,265,4,10,50],[100,425,5,40,100],[150,470,5.5,90,150],[200,740,10.5,140,200],[250,890,13.5,190,250]];
for (const [model,flow,power,minL,maxL] of tetraInxExpected) {
  const item = equipmentCatalog.find((entry) => entry.brand === "Tetra" && entry.model === `INX ${model}`);
  assert.deepEqual([item?.category,item?.ratedFlowLph,item?.powerW,item?.recommendedMinL,item?.recommendedMaxL,item?.adjustableFlow], ["filter",flow,power,minL,maxL,true], `Tetra INX ${model} resmî debi, güç ve hacim aralığını taşımalı`);
  assert(item?.specifications.includes("IP68") && item?.additionalSourceUrls?.some((url) => url.endsWith("TH54440_9074_GA_INX50_250.pdf")), `Tetra INX ${model} koruma sınıfı ve resmî teknik kılavuzu taşımalı`);
}
const tetraAirSilentExpected = [["Mini",21,1.6,10,40,34],["Maxi",42,1.8,40,80,35]];
for (const [model,flow,power,minL,maxL,noise] of tetraAirSilentExpected) {
  const item = equipmentCatalog.find((entry) => entry.brand === "Tetra" && entry.model === `AirSilent ${model}`);
  assert.deepEqual([item?.category,item?.ratedFlowLph,item?.powerW,item?.recommendedMinL,item?.recommendedMaxL], ["air_pump",flow,power,minL,maxL], `Tetra AirSilent ${model} resmî debi, güç ve hacim aralığını taşımalı`);
  assert(item?.specifications.includes(`${noise} dB(A)`) && item?.additionalSourceUrls?.some((url) => url.endsWith("TH52802_9074_2020-06_InstrucManual_AirSilent_Airpump_online.pdf")), `Tetra AirSilent ${model} resmî ses düzeyi ve kılavuza bağlanmalı`);
}
const tetraWaterPumpExpected = [[300,300,5,10,80,"0,5"],[600,600,11,80,200,"1,3"],[1000,1000,25,200,300,"2,0"]];
for (const [model,flow,power,minL,maxL,head] of tetraWaterPumpExpected) {
  const item = equipmentCatalog.find((entry) => entry.brand === "Tetra" && entry.model === `WP ${model} Water Pump`);
  assert.deepEqual([item?.category,item?.ratedFlowLph,item?.powerW,item?.recommendedMinL,item?.recommendedMaxL,item?.adjustableFlow], ["other",flow,power,minL,maxL,true], `Tetra WP ${model} resmî debi, güç ve hacim aralığını taşımalı`);
  assert(item?.specifications.includes(`${head} m`) && item?.specifications.includes("IPX8") && item?.additionalSourceUrls?.some((url) => url.endsWith("TH54003_9074_GA_WP300_600_1000_Online.pdf")), `Tetra WP ${model} resmî basma yüksekliği, koruma sınıfı ve kılavuza bağlanmalı`);
}
const tetraAirAccessories = ["AS 25 Air Stone","AS 30 Air Stone","AS 35 Air Stone","AS 40 Air Stone","AS 45 Air Stone","CV4 CheckValve","AH 50-400 Air Pump Hose (PVC)","AH 50-400 Air Hose (Silicone)"];
for (const model of tetraAirAccessories) {
  const item = equipmentCatalog.find((entry) => entry.brand === "Tetra" && entry.model === model);
  assert(item, `Tetra ${model} teknik katalogda bulunmalı`);
  assert.equal(item?.category, "other", `Tetra ${model} aktif hava motoru sınıfına karışmamalı`);
  assert(item?.passiveComponent && item?.requiresAirPump, `Tetra ${model} pasif ve hava motoru gerektiren aksesuar olmalı`);
  assert(!item?.ratedFlowLph && !item?.powerW && !item?.recommendedMaxL, `Tetra ${model} için bağımsız motor kapasitesi uydurulmamalı`);
  assert.match(item?.sourceUrl || "", /^https:\/\/www\.tetra\.net\/en-eu\/products\//, `Tetra ${model} doğrudan resmî sayfaya bağlanmalı`);
  assert.equal(item?.verifiedAt, "2026-09-27", `Tetra ${model} güncel doğrulama tarihini taşımalı`);
}
const tetraLightWaveExpected = [[270,6.3,661,6478,27,33],[430,12,1234,6612,43,49],[520,14.2,1460,6526,52,60],[720,19.4,1975,6566,72,80],[830,21,2544,6582,83,91],[990,23.4,2870,6570,99,107],[1140,28.4,3460,6654,114,122]];
for (const [model,power,lumens,kelvin,minLength,maxLength] of tetraLightWaveExpected) {
  for (const form of ["Complete Set","Single Light"]) {
    const item = equipmentCatalog.find((entry) => entry.brand === "Tetra" && entry.model === `LightWave ${model} ${form}`);
    assert.deepEqual([item?.category,item?.powerW,item?.recommendedTankLengthCm], ["lighting",power,[minLength,maxLength]], `Tetra LightWave ${model} ${form} resmî güç ve uzunluk aralığını taşımalı`);
    assert(item?.specifications.includes(`${lumens} lm`) && item?.specifications.includes(`${kelvin} K`) && item?.specifications.includes("IP68") && item?.additionalSourceUrls?.some((url) => url.endsWith("TH54308_9074.pdf")), `Tetra LightWave ${model} ${form} resmî lümen, renk sıcaklığı, koruma sınıfı ve kılavuza bağlanmalı`);
  }
}
assert(equipmentCatalog.filter((item) => item.brand === "Tetra" && item.model.endsWith("Single Light")).every((item) => item.specifications.includes("güç kaynağı içermez")), "Tetra LightWave Single Light kayıtları güç kaynağı içermediğini göstermeli");
const tetraLightingAccessoryModels = ["LightWave Splitter","LightWave Timer","Tetronic Arms"];
for (const model of tetraLightingAccessoryModels) {
  const item = equipmentCatalog.find((entry) => entry.brand === "Tetra" && entry.model === model);
  assert(item && item.category === "other" && item.verifiedAt === "2026-09-27", `Tetra ${model} aydınlatma armatürü yerine ayrı aksesuar olarak kataloglanmalı`);
}
assert(equipmentCatalog.find((item) => item.id === "tetra-lightwave-splitter")?.passiveComponent, "Tetra LightWave Splitter pasif bağlantı parçası olmalı");
assert.equal(equipmentCatalog.find((item) => item.id === "tetra-lightwave-timer")?.passiveComponent, undefined, "Tetra LightWave Timer aktif elektronik cihaz olmalı");
assert(equipmentCatalog.find((item) => item.id === "tetra-tetronic-arms")?.specifications.includes("380/580/780/980"), "Tetra Tetronic Arms yalnız resmî uyumlu dört boyu belirtmeli");
const tetraFilterMedia = equipmentCatalog.filter((item) => item.brand === "Tetra" && (
  item.id.startsWith("tetra-cf-plus-") || item.id.startsWith("tetra-bf-plus-") ||
  item.id.startsWith("tetra-bb-bioballs-") || item.id.startsWith("tetra-bf-biofoam-") ||
  item.id.startsWith("tetra-cf-carbon-") || item.id.startsWith("tetra-cr-filterrings-") ||
  item.id.startsWith("tetra-ff-filterfloss-") || item.id.startsWith("tetra-easycrystal-pack-") ||
  item.id === "tetra-easycrystal-600-biogrid"
));
assert.equal(tetraFilterMedia.length, 21, "Tetra resmî filtre medyası ve EasyCrystal kartuş dizini 21 seçilebilir varyant içermeli");
assert(tetraFilterMedia.every((item) => item.category === "other" && item.passiveComponent && item.verifiedAt === "2026-09-27"), "Tetra filtre medyaları aktif filtre gibi değerlendirilmemeli ve güncel doğrulama tarihi taşımalı");
assert(tetraFilterMedia.every((item) => !item.ratedFlowLph && !item.powerW && !item.recommendedMaxL), "Tetra filtre medyalarına bağımsız motor kapasitesi uydurulmamalı");
for (const [id,ean] of [["tetra-cf-plus-300","4004218175693"],["tetra-cf-plus-400-600","4004218134652"],["tetra-cf-plus-800-1000","4004218134669"],["tetra-bf-plus-300","4004218175709"],["tetra-bf-plus-400-600","4004218134676"],["tetra-bf-plus-800-1000","4004218134683"]]) {
  assert(equipmentCatalog.find((item) => item.id === id)?.specifications.includes(ean), `Tetra ${id} resmî EAN bilgisini taşımalı`);
}
assert.equal(equipmentCatalog.filter((item) => item.id.startsWith("tetra-easycrystal-pack-")).length, 4, "Tetra EasyCrystal dört gerçek üçlü kartuş paketiyle kataloglanmalı");
assert(equipmentCatalog.find((item) => item.id === "tetra-easycrystal-pack-c250-300")?.specifications.includes("aktif karbonlu C sürümü"), "Tetra EasyCrystal C250/300 aktif karbonlu sürüm olarak ayrılmalı");
assert(equipmentCatalog.find((item) => item.id === "tetra-easycrystal-pack-c600")?.specifications.includes("aktif karbonlu C sürümü"), "Tetra EasyCrystal C600 aktif karbonlu sürüm olarak ayrılmalı");
assert(equipmentCatalog.find((item) => item.id === "tetra-easycrystal-600-biogrid")?.specifications.includes("4004218174719"), "Tetra EasyCrystal 600 BioGrid resmî EAN bilgisini taşımalı");
assert(equipmentCatalog.filter((item) => item.id.startsWith("tetra-ff-filterfloss-")).every((item) => item.specifications.includes("4–8 haftada")), "Tetra FF FilterFloss değişim aralığı görünür olmalı");
const tetraHeaterExpected = [[25,10,25],[50,25,60],[75,60,100],[100,100,150],[150,150,225],[200,225,300],[300,300,450]];
for (const [power,minL,maxL] of tetraHeaterExpected) {
  const item = equipmentCatalog.find((entry) => entry.id === `tetra-ht-${power}`);
  assert.deepEqual([item?.category,item?.powerW,item?.recommendedMinL,item?.recommendedMaxL], ["heater",power,minL,maxL], `Tetra HT ${power} resmî güç ve hacim aralığını taşımalı`);
  assert(item?.specifications.includes("20–32 °C") && item?.specifications.includes("IPX8") && item?.additionalSourceUrls?.some((url) => url.endsWith("TH53436_9074.pdf")), `Tetra HT ${power} resmî sıcaklık aralığı, koruma sınıfı ve kılavuza bağlanmalı`);
  assert.equal(item?.verifiedAt, "2026-09-27", `Tetra HT ${power} güncel doğrulama tarihini taşımalı`);
}
assert.equal(equipmentCatalog.filter((item) => item.brand === "Tetra").length, 111, "Tetra teknik kataloğu bu aşamada 111 seçilebilir ekipman içermeli");
const tropicalCare = careProductCatalog.filter((item) => item.brand === "Tropical");
assert.equal(tropicalCare.length, 63, "Tropical'ın doğrulanan yem ve bitki bakım portföyü 63 ürün ailesi içermeli");
for (const model of ["Herbs & Vegetables", "Leaves & Flowers", "Betta Granulat", "Bio-Vit", "Ichtio-Vit", "Aqua Plant", "Aquaflorin Potassium", "Carbo"]) {
  assert(tropicalCare.some((item) => item.model === model), `Tropical ${model} katalogda bulunmalı`);
}
const nubiosCareModels = new Set(
  careProductCatalog.filter((item) => item.brand === "Nubios").map((item) => item.model),
);
assert(nubiosCareModels.has("Seramik Halka 500 g"), "Nubios seramik filtre medyası katalogda bulunmalı");
assert(nubiosCareModels.has("Aktif Karbon 300 g"), "Nubios aktif karbon filtre medyası katalogda bulunmalı");
const eurostarCareModels = new Set(careProductCatalog.filter((item) => item.brand === "Eurostar").map((item) => item.model));
for (const model of ["Zyro Max Fix 500 ml", "Zyro Max Fix XL 500 ml", "Hollow Bio Balls 1 L", "Super Premium Carbon 300 ml", "Aquaclay 500 ml", "Su Berraklaştırıcı 500 ml", "Amonyak Giderici Zeolit 500 ml", "Micro Bio Pellets 1000 ml"]) {
  assert(eurostarCareModels.has(model), `Eurostar ${model} bakım kataloğunda bulunmalı`);
}
const masterLineCare = careProductCatalog.filter((item) => item.brand === "MasterLine");
assert.equal(masterLineCare.length, 18, "MasterLine güncel bakım ürünleri eksiksiz bulunmalı");
assert(masterLineCare.every((item) => item.sourceUrl === "https://www.acvaristic.ro/"), "MasterLine bakım ürünleri doğru akvaryum üreticisi kaynağına bağlanmalı");
const aptCare = careProductCatalog.filter((item) => item.brand === "The 2Hr Aquarist");
assert.equal(aptCare.length, 13, "The 2Hr Aquarist resmî APT serisi eksiksiz bulunmalı");
assert(aptCare.every((item) => item.sourceUrl === "https://www.2hraquarist.com/collections/all"), "The 2Hr Aquarist ürünleri resmî tam ürün koleksiyonuna bağlanmalı");
const aptCategory = (model) => aptCare.find((item) => item.model === model)?.category;
assert.equal(aptCategory("APT Pure"), "water_conditioner", "APT Pure su düzenleyici kategorisinde bulunmalı");
assert.equal(aptCategory("APT Sky"), "water_conditioner", "APT Sky mineral/su düzenleyici kategorisinde bulunmalı");
assert.equal(aptCategory("APT Start"), "bacteria", "APT Start başlangıç bakterisi kategorisinde bulunmalı");
assert.equal(aptCategory("APT Balance"), "bacteria", "APT Balance bakteri kategorisinde bulunmalı");
assert.equal(aptCategory("APT Dew"), "fertilizer", "APT Dew yaprak gübresi kategorisinde bulunmalı");

const mecEquipment = equipmentCatalog.filter((item) => item.brand === "Meç");
assert.equal(mecEquipment.length, 14, "Meç aksesuar ve hava ile çalışan filtre portföyü 14 ürün ailesi içermeli");
assert.equal(mecEquipment.filter((item) => item.category === "other").length, 6, "Meç güncel aksesuar portföyü paket tekrarları birleştirilerek 6 ürün ailesi olmalı");
assert.equal(mecEquipment.filter((item) => item.category === "filter").length, 8, "Meç doğrulanan pipo ve üretim filtreleri eksiksiz bulunmalı");
assert(mecEquipment.filter((item) => item.category === "filter").every((item) => item.requiresAirPump), "Meç pipo filtreleri bağımsız motorlu filtre gibi değerlendirilmemeli");

const liyaEquipment = equipmentCatalog.filter((item) => item.brand === "Liya");
assert.equal(liyaEquipment.length, 28, "Liya doğrulanan bakım, havalandırma, yavruluk ve yakalama ekipmanları 28 ürün ailesi içermeli");
for (const model of ["FN-10 Çelik Saplı Kepçe", "LY-1822 Hortum Kırılma Önleyici", "4702B Büyük Tül Yavruluk", "LY-V8/2 İkili Metal Hava Dağıtıcısı", "Yuvarlak Hava Taşı 12,5 cm", "LY-T3 Hava Hortumu Eki 2'li"]) {
  assert(liyaEquipment.some((item) => item.model === model), `Liya ${model} ekipman kataloğunda bulunmalı`);
}
const liyaCareModels = new Set(careProductCatalog.filter((item) => item.brand === "Liya").map((item) => item.model));
for (const model of ["LY202 Aktif Karbon 500 g", "Biyolojik Seramik 500 g", "Zeolit 500 g"]) {
  assert(liyaCareModels.has(model), `Liya ${model} bakım ürünleri kataloğunda bulunmalı`);
}

const jingyeEquipment = equipmentCatalog.filter((item) => item.brand === "Jingye");
assert.equal(jingyeEquipment.length, 43, "Jingye doğrulanan filtre, pompa, hava motoru ve bakım portföyü 43 ürün ailesi içermeli");
for (const [model, flow, power] of [["LV-500DX",350,6],["LV-1000DX",750,10],["LV-2000DX",1500,25],["LV-2500DX",2500,35],["JY-910",500,6],["JY-915",800,12],["JY-920",1200,18],["JY-925",1600,25],["JY-825",2500,35],["JY-W155",250,3.8],["JY-W255",400,3.8],["JY-W355",500,3.8],["JY-6100F",500,6],["6972934051028 Şeffaf İç Filtre Siyah",500,6],["JY-6600F",1500,35],["JY-801F",880,15],["YE-12",210,3],["YE-22",480,5],["CD100",90,1.5],["CD300",120,3],["CD400",240,3.5]]) {
  const item = jingyeEquipment.find((entry) => entry.model === model);
  assert.equal(item?.ratedFlowLph, flow, `Jingye ${model} doğrulanmış güvenli debiyi taşımalı`);
  assert.equal(item?.powerW, power, `Jingye ${model} doğrulanmış güç değerini taşımalı`);
}
for (const [model, min, max] of [["JY-W155",undefined,60],["JY-W255",undefined,80],["JY-W355",undefined,100],["JY-6100F",undefined,80],["6972934051028 Şeffaf İç Filtre Siyah",undefined,80],["JY-6600F",250,300],["JY-801F",100,200],["JY-920",100,200],["LV-1000DX",undefined,150],["LV-2000DX",undefined,300],["LV-2500DX",undefined,500]]) {
  const item = jingyeEquipment.find((entry) => entry.model === model);
  assert.equal(item?.recommendedMinL, min, `Jingye ${model} doğrulanmış alt hacim sınırını taşımalı`);
  assert.equal(item?.recommendedMaxL, max, `Jingye ${model} doğrulanmış üst hacim sınırını taşımalı`);
}
for (const model of ["JY-W155", "JY-W255", "JY-W355"]) {
  const item = jingyeEquipment.find((entry) => entry.model === model);
  assert.equal(item?.category, "filter", `Jingye ${model} askı filtre kategorisinde bulunmalı`);
  assert.equal(item?.adjustableFlow, true, `Jingye ${model} ayarlanabilir akışı taşımalı`);
}
assert.equal(jingyeEquipment.find((item) => item.model === "JY-920")?.category, "other", "Jingye JY-920 bağımsız filtre değil üst hazne besleme pompası olarak sınıflandırılmalı");
assert.equal(jingyeEquipment.find((item) => item.model === "YE-CC1")?.category, "other", "Jingye YE-CC1 kapasite hesabına karışmamalı");
for (const model of ["JY-W155","JY-W255","JY-W355","JY-6100F","6972934051028 Şeffaf İç Filtre Siyah","JY-6600F","JY-801F","LV-1000DX","LV-2000DX","LV-2500DX","JY-920","CD400","YE-CC1"]) {
  const sourceUrl = jingyeEquipment.find((item) => item.model === model)?.sourceUrl;
  assert.equal(new URL(sourceUrl).hostname, "atakanpetshop.com", `Jingye ${model} doğrudan onaylı kaynağa bağlanmalı`);
}
for (const model of ["5000F","5100F","5200F","611","820F","9100DX","911","921","JY-5X Akvaryum Temizleme Seti 5'li","CD300","JY-920","LV-1500DX","LV-500DX","6972934051028 Şeffaf İç Filtre Siyah","T610","T640","T650","YE-12","YE-22","YE-621"]) {
  assert(jingyeEquipment.some((item) => item.model === model), `Atakan güncel Jingye marka sayfasındaki ${model} katalogda bulunmalı`);
}
for (const model of ["810F", "815F", "820F"]) {
  assert.equal(jingyeEquipment.find((item) => item.model === model)?.category, "filter", `Jingye ${model} tepe filtre kategorisinde bulunmalı`);
}
assert(jingyeEquipment.find((item) => item.model === "CD300")?.specifications.includes("güvenli hesap değeri"), "Jingye CD300 kaynak çelişkisi kullanıcıdan saklanmamalı");

assert.equal(tropicalCare.filter((item) => item.category === "food").length, 57, "Tropical'ın doğrulanan tatlı su yem serisi 57 ürün ailesi içermeli");
assert.equal(tropicalCare.filter((item) => item.category === "fertilizer").length, 6, "Tropical'ın doğrulanan bitki bakım serisi 6 ürün içermeli");
for (const model of ["Supervit Granulat", "Malawi", "Tanganyika", "Green Algae Wafers", "Caridina Nano Sticks", "Mikro-Vit Basic", "Shrimp-UP!"]) {
  assert(tropicalCare.some((item) => item.model === model), `Tropical ${model} katalogda bulunmalı`);
}

const seachemCare = careProductCatalog.filter((item) => item.brand === "Seachem");
assert.equal(seachemCare.length, 103, "Seachem'in resmî tatlı su bakım, yem, taban, filtrasyon, test ve ilaç portföyü eksiksiz bulunmalı");
const seachemCategory = (model) => seachemCare.find((item) => item.model === model)?.category;
assert.equal(seachemCategory("Neutral Regulator"), "water_conditioner", "Neutral Regulator su düzenleyici kategorisinde bulunmalı");
assert.equal(seachemCategory("MatrixCarbon"), "filter_media", "MatrixCarbon filtre medyası kategorisinde bulunmalı");
assert.equal(seachemCategory("Ammonia Alert"), "test", "Ammonia Alert test kategorisinde bulunmalı");
assert.equal(seachemCategory("KanaPlex"), "treatment", "KanaPlex tedavi kategorisinde bulunmalı");
assert.equal(seachemCategory("GarlicGuard"), "food", "GarlicGuard yem ve iştah desteği kategorisinde bulunmalı");
assert.equal(seachemCare.filter((item) => item.category === "substrate").length, 8, "Seachem'in tatlı suya uygun resmî kum ve çakıl serisi 8 ürün içermeli");
for (const model of ["NutriDiet Betta", "NutriDiet Chlorella Probiotics Formula", "NutriDiet Discus Probiotics Formula", "NutriDiet Herbivore Tabs"]) {
  assert.equal(seachemCategory(model), "food", `Seachem ${model} yem kategorisinde bulunmalı`);
}
assert(
  seachemCare.find((item) => item.model === "Cupramine")?.description.includes("omurgasız"),
  "Cupramine kaydı omurgasız canlılar için güvenlik uyarısını taşımalı",
);
for (const marineOnly of ["MultiTest Marine Basic", "Reef Status Calcium", "Marine Buffer", "Meridian", "Pearl Beach"]) {
  assert(!seachemCare.some((item) => item.model === marineOnly), `${marineOnly} tatlı su bakım kataloğuna karışmamalı`);
}

const seraCare = careProductCatalog.filter((item) => item.brand === "Sera");
assert.equal(seraCare.length, 124, "Sera'nın doğrulanan tatlı su bakım portföyü eksiksiz bulunmalı");
const seraCategory = (model) => seraCare.find((item) => item.model === model)?.category;
assert.equal(seraCategory("7in1 Quick Test"), "test", "Sera 7in1 Quick Test test kategorisinde bulunmalı");
assert.equal(seraCategory("siporax Professional 15 mm"), "filter_media", "Sera siporax filtre medyası kategorisinde bulunmalı");
assert.equal(seraCategory("flore 1 carbo"), "fertilizer", "Sera flore 1 carbo gübre kategorisinde bulunmalı");
assert.equal(seraCategory("med Professional Nematol"), "treatment", "Sera Nematol tedavi kategorisinde bulunmalı");
assert.equal(seraCategory("shrimp mineral salt"), "water_conditioner", "Sera karides minerali su düzenleyici kategorisinde bulunmalı");
assert.equal(seraCare.filter((item) => item.category === "test").length, 12, "Sera'nın resmî tatlı su test serisi eksiksiz bulunmalı");
assert.equal(seraCare.filter((item) => item.category === "treatment").length, 15, "Sera'nın resmî tatlı su tedavi serisi eksiksiz bulunmalı");
assert.equal(seraCare.filter((item) => item.category === "food").length, 47, "Sera'nın resmî tatlı su yem serisi 47 ürün ailesi içermeli");
assert.equal(seraCare.filter((item) => item.category === "substrate").length, 11, "Sera'nın resmî taban serisi 11 ürün içermeli");
for (const model of ["Immune Probiotic Granules XS", "Pleco Tabs XL", "Cichlid Malawi Granules", "Discus Probiotic Granules", "Shrimp Granules", "Vipagran Baby Granules", "Axolotl Wafers"]) {
  assert.equal(seraCategory(model), "food", `Sera ${model} yem kategorisinde bulunmalı`);
}

const dennerleCare = careProductCatalog.filter((item) => item.brand === "Dennerle");
assert.equal(dennerleCare.length, 111, "Dennerle'nin güncel yem, gübre, test, filtre medyası, su bakım ve taban ürün aileleri eksiksiz bulunmalı");
const dennerleCategory = (model) => dennerleCare.find((item) => item.model === model)?.category;
assert.equal(dennerleCare.filter((item) => item.category === "food").length, 30, "Dennerle güncel balık ve omurgasız yem portföyü 30 aile içermeli");
assert.equal(dennerleCare.filter((item) => item.category === "fertilizer").length, 20, "Dennerle güncel bitki ve karbon bakım portföyü 20 benzersiz aile içermeli");
assert.equal(dennerleCare.filter((item) => item.category === "test").length, 11, "Dennerle güncel su, pH ve CO₂ test portföyü 11 aile içermeli");
assert.equal(dennerleCare.filter((item) => item.category === "filter_media").length, 10, "Dennerle güncel filtre ve ozmoz medya portföyü 10 aile içermeli");
assert.equal(dennerleCare.filter((item) => item.category === "water_conditioner").length, 8, "Dennerle güncel su düzenleyici ve mineral serisi 8 aile içermeli");
assert.equal(dennerleCare.filter((item) => item.category === "bacteria").length, 3, "Dennerle güncel bakteri kültürü serisi 3 aile içermeli");
assert.equal(dennerleCare.filter((item) => item.category === "treatment").length, 9, "Dennerle güncel canlı ve doğal su bakım serisi 9 aile içermeli");
assert.equal(dennerleCare.filter((item) => item.category === "substrate").length, 20, "Dennerle güncel soil, kum, çakıl ve taban gübresi serisi 20 aile içermeli");
assert(dennerleCare.every((item) => item.sourceUrl.startsWith("https://dennerle.com/en/products/")), "Dennerle bakım kayıtları genel site haritası yerine doğrudan resmî ürün sayfasına bağlanmalı");
assert(dennerleCare.every((item) => item.verifiedAt === "2026-08-27"), "Dennerle bakım kayıtları güncel doğrulama tarihini taşımalı");
assert.equal(dennerleCategory("Shrimp King Baby"), "food", "Shrimp King Baby yem kategorisinde bulunmalı");
assert.equal(dennerleCategory("Cichlid Carny"), "food", "Cichlid Carny yem kategorisinde bulunmalı");
assert.equal(dennerleCategory("Shrimp King Cambarellus"), "food", "Shrimp King Cambarellus yem kategorisinde bulunmalı");
assert.equal(dennerleCategory("Shrimp King SnailStixx"), "food", "SnailStixx yem kategorisinde bulunmalı");
assert.equal(dennerleCategory("Plant Care K"), "fertilizer", "Plant Care K gübre kategorisinde bulunmalı");
assert.equal(dennerleCategory("Dosator"), "fertilizer", "Dennerle Dosator bitki bakım kategorisinde bulunmalı");
assert.equal(dennerleCategory("Carbo Care Pro"), "fertilizer", "Dennerle Carbo Care Pro karbon bakım ürünü gübre kategorisinde bulunmalı");
assert.equal(dennerleCategory("Plant System Set"), "fertilizer", "Plant System Set gübre kategorisinde bulunmalı");
assert.equal(dennerleCategory("Aquarium Starter Rapid"), "bacteria", "Dennerle Aquarium Starter Rapid bakteri kategorisinde bulunmalı");
assert.equal(dennerleCategory("Water Test 6in1"), "test", "Dennerle Water Test 6in1 test kategorisinde bulunmalı");
assert.equal(dennerleCategory("Nano Bio Filter Granules"), "filter_media", "Dennerle Nano Bio Filter Granules filtre medyası kategorisinde bulunmalı");
assert.equal(dennerleCategory("Betta Care"), "treatment", "Dennerle Betta Care canlı bakım kategorisinde bulunmalı");
assert.equal(dennerleCategory("Shrimp King Sulawesi Salt"), "water_conditioner", "Dennerle Sulawesi mineral tuzu su düzenleyici kategorisinde bulunmalı");
assert.equal(dennerleCategory("Shrimp King Active Soil"), "substrate", "Shrimp King Active Soil taban kategorisinde bulunmalı");
assert.equal(dennerleCategory("NutriBasis"), "substrate", "NutriBasis taban kategorisinde bulunmalı");
assert.equal(dennerleCategory("Natural Gravel Bairaman 0,1–0,6 mm"), "substrate", "Dennerle Bairaman doğal kumu taban kategorisinde bulunmalı");

const adaCare = careProductCatalog.filter((item) => item.brand === "ADA");
assert.equal(adaCare.length, 40, "ADA'nın doğrulanmış Nature Aquarium bakım portföyü filtre medyalarıyla korunmalı");
const adaCategory = (model) => adaCare.find((item) => item.model === model)?.category;
assert.equal(adaCategory("Green Bacter Plus"), "bacteria", "ADA Green Bacter Plus bakteri kategorisinde bulunmalı");
assert.equal(adaCategory("Phyton Git Sol"), "treatment", "ADA Phyton Git Sol tedavi kategorisinde bulunmalı");
assert.equal(adaCategory("Clear Water"), "water_conditioner", "ADA Clear Water su düzenleyici kategorisinde bulunmalı");
assert.equal(adaCategory("Aqua Soil Amazonia Pro"), "substrate", "ADA Amazonia Pro taban kategorisinde bulunmalı");
assert.equal(adaCategory("Power Sand Advance L"), "substrate", "ADA Power Sand Advance L taban kategorisinde bulunmalı");
assert.equal(adaCategory("Bacter 100"), "substrate", "ADA Bacter 100 taban katkısı kategorisinde bulunmalı");
assert.equal(adaCategory("Pack Checker NH4"), "test", "ADA NH4 Pack Checker test kategorisinde bulunmalı");
assert.equal(adaCare.filter((item) => item.category === "test").length, 8, "ADA Pack Checker test serisi eksiksiz bulunmalı");
assert.equal(adaCare.filter((item) => item.category === "filter_media").length, 4, "ADA'nın dört güncel filtre medyası bulunmalı");
assert.equal(adaCategory("Bio Rio G"), "filter_media", "ADA Bio Rio G filtre medyası kategorisinde bulunmalı");

const adaEquipment = equipmentCatalog.filter((item) => item.brand === "ADA");
assert.equal(adaEquipment.length, 77, "ADA ekipman kapsamı güncel resmî aydınlatma, CO₂, filtrasyon ve bakım araçlarını içermeli");
const adaEquipmentCategories = Object.fromEntries(
  ["filter","co2","lighting","other"].map((category) => [category, adaEquipment.filter((item) => item.category === category).length]),
);
assert.deepEqual(adaEquipmentCategories, {filter:6,co2:34,lighting:4,other:33}, "ADA ekipmanları doğru kullanıcı kategorilerine ayrılmalı");
const adaEquipmentByModel = (model) => adaEquipment.find((item) => item.model === model);
assert.equal(adaEquipmentByModel("NA LIGHT 300")?.powerW, 20, "ADA NA LIGHT 300 için yayımlanan tüketim korunmalı");
assert.deepEqual(adaEquipmentByModel("NA LIGHT 450")?.recommendedTankLengthCm, [45,45], "ADA NA LIGHT 450 yalnızca yayımlanan 45 cm tanklarla eşleşmeli");
assert.equal(adaEquipmentByModel("NA LIGHT PRO 600")?.powerW, 66, "ADA NA LIGHT PRO 600 azami yayımlanan tüketimi korumalı");
assert.equal(adaEquipmentByModel("SOLAR RGB II")?.powerW, 135, "ADA SOLAR RGB II yayımlanan güç tüketimini korumalı");
assert.deepEqual(adaEquipmentByModel("Pollen Glass Large 30Ø for CO₂")?.recommendedTankLengthCm, [75,90], "ADA Large 30Ø yayımlanan tank aralığını korumalı");
assert.deepEqual(adaEquipmentByModel("Pollen Glass Beetle 50Ø for CO₂")?.recommendedTankLengthCm, [120,180], "ADA Beetle 50Ø yayımlanan tank aralığını korumalı");
assert.equal(adaEquipmentByModel("Pollen Glass for AIR")?.category, "other", "Pasif ADA hava difüzörü hava motoru gibi sınıflandırılmamalı");
assert.equal(adaEquipmentByModel("Pollen Glass for AIR")?.requiresAirPump, true, "Pasif ADA hava difüzörünün motor gereksinimi korunmalı");
assert.equal(adaEquipmentByModel("VUPPA-II")?.category, "other", "ADA VUPPA-II bağımsız ana filtre kapasitesine katılmamalı");
assert.equal(adaEquipmentByModel("VUPPA-II")?.ratedFlowLph, undefined, "ADA'nın yayımlamadığı VUPPA-II debisi tahmin edilmemeli");
assert.equal(adaEquipment.filter((item) => item.model.startsWith("Joint Glass ")).length, 6, "ADA Joint Glass serisinin altı boyu bulunmalı");
assert.equal(adaEquipment.filter((item) => item.model.includes("Scissors")).length, 10, "ADA Pro-Scissors varyantları eksiksiz bulunmalı");
assert.equal(adaEquipment.filter((item) => item.model.includes("Pinsettes")).length, 7, "ADA Pinsettes varyantları eksiksiz bulunmalı");
assert(adaEquipment.every((item) => item.sourceUrl?.startsWith("https://")), "Tüm ADA ekipmanlarının HTTPS kaynağı olmalı");
assert(adaEquipment.every((item) => /^\d{4}-\d{2}-\d{2}$/.test(item.verifiedAt ?? "")), "Tüm ADA ekipmanlarının doğrulama tarihi olmalı");

const shrimpsForeverCare = careProductCatalog.filter((item) => item.brand === "Shrimps Forever");
assert.equal(shrimpsForeverCare.length, 32, "Shrimps Forever'ın resmî sayfa ve satış kanalında doğrulanan ürünleri eksiksiz bulunmalı");
const shrimpsForeverCategory = (model) => shrimpsForeverCare.find((item) => item.model === model)?.category;
assert.equal(shrimpsForeverCategory("Cycle Starter Pro Bacter"), "bacteria", "Pro Bacter bakteri kategorisinde bulunmalı");
assert.equal(shrimpsForeverCategory("TapFix"), "water_conditioner", "TapFix su düzenleyici kategorisinde bulunmalı");
assert.equal(shrimpsForeverCategory("Algasol"), "treatment", "Algasol yosun kontrol ürünü tedavi kategorisinde bulunmalı");
assert.equal(shrimpsForeverCategory("Shrimp Mineral (Montmorillonite)"), "water_conditioner", "Montmorillonit mineral desteği su düzenleyici kategorisinde bulunmalı");
for (const model of ["Walnut Shrimps Sticks", "Shrimp Sticks Algae", "Bean Pellet", "Barley Mix", "Speed Growth", "Mulberry", "Snowflake", "Glucazyme", "Moringa"]) {
  assert.equal(shrimpsForeverCategory(model), "food", `Shrimps Forever ${model} yem kategorisinde bulunmalı`);
}
assert.equal(shrimpsForeverCategory("Shrimp Soil"), "substrate", "Shrimps Forever Shrimp Soil taban kategorisinde bulunmalı");

const aquaminCare = careProductCatalog.filter((item) => item.brand === "Aquamins");
assert.equal(aquaminCare.length, 32, "Aquamins'in doğrulanan hacim, ağırlık ve taban varyantları eksiksiz bulunmalı");
for (const model of ["Aqua Nutrifish 30 ml", "Aqua Nutrifish 100 ml", "Anti Algae 100 ml", "Anti Algae 250 ml", "Anti Algae 500 ml", "Bacteria 100 ml", "Bacteria 250 ml", "California Black Sand 1,5 mm 20 kg", "White Sand 0,5 mm 20 kg", "Silis Kumu 0,5 mm 10 kg", "Silis Kumu 1,5 mm 10 kg"]) {
  assert(aquaminCare.some((item) => item.model === model), `Aquamins ${model} katalogda bulunmalı`);
}
assert.equal(aquaminCare.filter((item) => item.category === "substrate").length, 12, "Aquamins kum tane boyu ve paket ağırlıkları ayrı seçilebilmeli");

for (const species of [
  ["auratus-cichlid", 120, "medium"],
  ["blue-dolphin-cichlid", 180, "medium"],
  ["calvus-cichlid", 150, "medium"],
  ["leleupi-cichlid", 120, "medium"],
  ["electric-blue-hap", 150, "medium"],
  ["cobalt-zebra-cichlid", 120, "medium"],
  ["maingano-cichlid", 120, "medium"],
  ["blue-orchid-peacock", 120, "medium"],
]) {
  const [id, minTankLengthCm, flow] = species;
  const profile = speciesCatalog.find((item) => item.id === id);
  assert(profile, `${id} canlı kataloğunda bulunmalı`);
  assert.equal(profile.minTankLengthCm, minTankLengthCm, `${id} minimum akvaryum uzunluğu korunmalı`);
  assert.equal(profile.flow, flow, `${id} akıntı gereksinimi korunmalı`);
  assert(
    [profile.sourceUrl, ...(profile.additionalSourceUrls ?? [])].some((url) => url?.includes("fishkeeper.co.uk/fish/freshwater/cichlids")),
    `${id} türe özel bakım kaynağı taşımalı`,
  );
}
assert.equal(speciesCatalog.find((item) => item.id === "calvus-cichlid")?.predatory, true, "Calvus küçük canlılar için avlanma riski taşımalı");
assert.equal(speciesCatalog.find((item) => item.id === "electric-blue-hap")?.predatory, true, "Electric Blue Ahli küçük balıkları avlama riski taşımalı");
for (const [id, minVolumeL, minTankLengthCm, minGroup] of [
  ["green-terror", 300, 150, 1],
  ["firemouth-cichlid", 150, 100, 1],
  ["redhead-tapajos", 280, 120, 6],
]) {
  const profile = speciesCatalog.find((item) => item.id === id);
  assert(profile, `${id} Yeni Dünya cichlid kataloğunda bulunmalı`);
  assert.equal(profile.minVolumeL, minVolumeL, `${id} doğrulanmış minimum hacmi korunmalı`);
  assert.equal(profile.minTankLengthCm, minTankLengthCm, `${id} doğrulanmış minimum tank uzunluğu korunmalı`);
  assert.equal(profile.minGroup, minGroup, `${id} sosyal yapı gereksinimi korunmalı`);
  assert(profile.sourceUrl, `${id} bakım kaynağı taşımalı`);
}
assert(speciesCatalog.find((item) => item.id === "green-terror")?.communityCaution, "Green Terror bölgecilik uyarısı taşımalı");
assert(speciesCatalog.find((item) => item.id === "firemouth-cichlid")?.husbandryCaution, "Firemouth kum taban uyarısı taşımalı");
assert.equal(speciesCatalog.find((item) => item.id === "redhead-tapajos")?.predatory, true, "Red Head Tapajos küçük balıkları avlama riski taşımalı");
for (const id of ["red-tailed-black-shark", "rainbow-shark", "chinese-algae-eater"]) {
  const profile = speciesCatalog.find((item) => item.id === id);
  assert(profile?.communityCaution, `${id} topluluk akvaryumu risk açıklaması taşımalı`);
  assert(profile.minTankLengthCm >= 120, `${id} yetişkin boyuna uygun minimum tank uzunluğu taşımalı`);
}
for (const [id, minGroup, minTankLengthCm] of [
  ["pictus-catfish", 3, 120],
  ["glass-catfish", 6, 90],
  ["south-american-bumblebee-catfish", 5, 80],
]) {
  const profile = speciesCatalog.find((item) => item.id === id);
  assert(profile, `${id} canlı kataloğunda bulunmalı`);
  assert.equal(profile.minGroup, minGroup, `${id} sosyal grup gereksinimi korunmalı`);
  assert.equal(profile.minTankLengthCm, minTankLengthCm, `${id} minimum tank uzunluğu korunmalı`);
}
assert.equal(speciesCatalog.find((item) => item.id === "pictus-catfish")?.predatory, true, "Pictus küçük balıklar için avlanma riski taşımalı");
for (const [id, minVolumeL, minTankLengthCm] of [
  ["congo-puffer", 112, 80],
  ["red-eyed-puffer", 80, 80],
  ["spotted-congo-puffer", 110, 80],
  ["green-spotted-puffer", 120, 80],
]) {
  const profile = speciesCatalog.find((item) => item.id === id);
  assert(profile, `${id} tatlı su balon balığı kataloğunda bulunmalı`);
  assert.equal(profile.minVolumeL, minVolumeL, `${id} minimum hacmi korunmalı`);
  assert.equal(profile.minTankLengthCm, minTankLengthCm, `${id} minimum tank uzunluğu korunmalı`);
}
assert.equal(speciesCatalog.find((item) => item.id === "congo-puffer")?.speciesOnly, true, "Congo balon balığı tür akvaryumu gerektirmeli");
assert(speciesCatalog.find((item) => item.id === "spotted-congo-puffer")?.communityCaution, "Spotted Congo topluluk riski açıklaması taşımalı");
const greenSpottedPuffer = speciesCatalog.find((item) => item.id === "green-spotted-puffer");
assert.deepEqual([greenSpottedPuffer?.scientificName, greenSpottedPuffer?.adultSizeCm, greenSpottedPuffer?.temperature, greenSpottedPuffer?.ph], ["Dichotomyctere nigroviridis", 17, [24, 28], [7.5, 8.5]], "Green Spotted Puffer kaynaklı kimlik, boy ve su eşiklerini taşımalı");
assert.deepEqual(greenSpottedPuffer?.waterTypes, ["brackish", "saltwater"], "Green Spotted Puffer uzun süreli tatlı su profili gibi sunulmamalı");
assert.deepEqual(greenSpottedPuffer?.specificGravity, [1.01, 1.018], "Green Spotted Puffer erişkin acı su özgül ağırlığını taşımalı");
assert.equal(greenSpottedPuffer?.speciesOnly, true, "Green Spotted Puffer topluluk canlısı gibi sunulmamalı");
assert.equal(greenSpottedPuffer?.predatory, true, "Green Spotted Puffer avlanma riskini taşımalı");
assert(greenSpottedPuffer?.sourceUrl?.includes("fishbase.se/summary/Dichotomyctere-nigroviridis"), "Green Spotted Puffer FishBase tür kaynağına bağlanmalı");
assert.equal(speciesForCatalogExactSearch("Green Spotted Puffer", "fish", "brackish")?.id, "green-spotted-puffer", "Kesin Green Spotted Puffer adı acı su kataloğunda bulunmalı");
assert.equal(speciesForCatalogExactSearch("Green Spotted Puffer", "fish", "freshwater"), undefined, "Green Spotted Puffer tatlı su kataloğunda önerilmemeli");
assert.equal(unresolvedSpeciesForSearch("PUFFER BALIKLARI", "fish", "brackish")?.name, "PUFFER BALIKLARI", "Genel Puffer Balıkları adı tek türe tahminle bağlanmamalı");
const freshwaterNeedlefish = speciesCatalog.find((item) => item.id === "freshwater-needlefish");
assert.deepEqual([freshwaterNeedlefish?.scientificName, freshwaterNeedlefish?.adultSizeCm, freshwaterNeedlefish?.minVolumeL, freshwaterNeedlefish?.minTankLengthCm, freshwaterNeedlefish?.minGroup], ["Xenentodon cancila", 40, 648, 180, 4], "Xenentodon cancila kaynaklı kimlik, boy, akvaryum ve grup eşiklerini taşımalı");
assert.deepEqual([freshwaterNeedlefish?.temperature, freshwaterNeedlefish?.ph, freshwaterNeedlefish?.flow], [[18, 30], [6, 8], "low"], "Xenentodon cancila kaynaklı su ve düşük türbülans gereksinimini taşımalı");
assert.deepEqual(freshwaterNeedlefish?.waterTypes, ["freshwater"], "Xenentodon cancila normal bakımda tuz gerektiren tür gibi sunulmamalı");
assert.equal(freshwaterNeedlefish?.predatory, true, "Xenentodon cancila küçük canlılar için avlanma riskini taşımalı");
assert.equal(freshwaterNeedlefish?.speciesOnly, true, "Xenentodon cancila sıradan topluluk balığı gibi sunulmamalı");
assert(freshwaterNeedlefish?.husbandryCaution?.includes("%30–50"), "Xenentodon cancila haftalık bakım gereksinimini açıklamalı");
assert.equal(speciesForCatalogExactSearch("Freshwater Needlefish", "fish", "freshwater")?.id, "freshwater-needlefish", "Kesin Freshwater Needlefish adı doğru profili bulmalı");
const indochineseNeedlefish = speciesCatalog.find((item) => item.id === "indochinese-needlefish");
assert.deepEqual([indochineseNeedlefish?.scientificName, indochineseNeedlefish?.adultSizeCm, indochineseNeedlefish?.minVolumeL, indochineseNeedlefish?.minTankLengthCm, indochineseNeedlefish?.minGroup], ["Xenentodon canciloides", 30, 648, 180, 4], "Xenentodon canciloides kaynaklı kimlik, boy, akvaryum ve grup eşiklerini taşımalı");
assert.deepEqual([indochineseNeedlefish?.temperature, indochineseNeedlefish?.ph, indochineseNeedlefish?.flow], [[18, 26], [6, 8], "low"], "Xenentodon canciloides kaynaklı su ve düşük türbülans gereksinimini taşımalı");
assert.deepEqual(indochineseNeedlefish?.waterTypes, ["freshwater"], "Xenentodon canciloides yalnız tatlı su profilinde görünmeli");
assert.equal(indochineseNeedlefish?.predatory, true, "Xenentodon canciloides küçük canlılar için avlanma riskini taşımalı");
assert.equal(indochineseNeedlefish?.speciesOnly, true, "Xenentodon canciloides sıradan topluluk balığı gibi sunulmamalı");
assert.equal(speciesForCatalogExactSearch("Indochinese Needlefish", "fish", "freshwater")?.id, "indochinese-needlefish", "Ayırt edici Indochinese Needlefish adı doğru profili bulmalı");
assert.notEqual(freshwaterNeedlefish?.scientificName, indochineseNeedlefish?.scientificName, "İki Xenentodon türü tek profil gibi gösterilmemeli");
assert.equal(speciesForLivestock({commonName:"PIPE FISH NEEDLE",category:"fish",quantity:1}), undefined, "Genel Pipe Fish Needle adı pipefish veya needlefish profiline tahminle bağlanmamalı");
const malayanRiverSole = speciesCatalog.find((item) => item.id === "malayan-river-sole");
assert.deepEqual([malayanRiverSole?.scientificName, malayanRiverSole?.adultSizeCm, malayanRiverSole?.minVolumeL, malayanRiverSole?.minTankLengthCm, malayanRiverSole?.minGroup], ["Brachirus panoides", 20, 208, 100, 1], "Brachirus panoides kaynaklı kimlik, boy ve akvaryum eşiklerini taşımalı");
assert.deepEqual([malayanRiverSole?.temperature, malayanRiverSole?.ph, malayanRiverSole?.flow], [[23, 28], [7, 8], "low"], "Brachirus panoides kaynaklı su ve düşük akıntı gereksinimini taşımalı");
assert.deepEqual(malayanRiverSole?.waterTypes, ["freshwater", "brackish"], "Brachirus panoides doğrulanan tatlı ve acı su kapsamını taşımalı");
assert.deepEqual(malayanRiverSole?.specificGravity, [1, 1.015], "Brachirus panoides kaynaklı tuzluluk toleransını taşımalı");
assert.equal(malayanRiverSole?.predatory, true, "Brachirus panoides küçük canlılar için avlanma riskini taşımalı");
assert.equal(malayanRiverSole?.speciesOnly, true, "Brachirus panoides uzman kurulumu gerektirmeli");
assert(malayanRiverSole?.husbandryCaution?.includes("ince kum"), "Brachirus panoides gömülme zemini ve hedefli besleme uyarısını taşımalı");
assert.equal(speciesForCatalogExactSearch("Brachirus panoides", "fish", "freshwater")?.id, "malayan-river-sole", "Kesin Brachirus panoides adı doğru profili bulmalı");
const selheimsFreshwaterSole = speciesCatalog.find((item) => item.id === "selheims-freshwater-sole");
assert.deepEqual([selheimsFreshwaterSole?.scientificName, selheimsFreshwaterSole?.adultSizeCm, selheimsFreshwaterSole?.minVolumeL, selheimsFreshwaterSole?.minTankLengthCm, selheimsFreshwaterSole?.minGroup], ["Brachirus selheimi", 15, 100, undefined, 1], "Brachirus selheimi kaynaklı kimlik, boy ve akvaryum eşiklerini taşımalı");
assert.deepEqual([selheimsFreshwaterSole?.temperature, selheimsFreshwaterSole?.ph, selheimsFreshwaterSole?.flow], [[22, 26], [6.5, 7.5], "low"], "Brachirus selheimi kaynaklı su ve düşük akıntı gereksinimini taşımalı");
assert.deepEqual(selheimsFreshwaterSole?.waterTypes, ["freshwater", "brackish"], "Brachirus selheimi doğrulanan tatlı ve acı su kapsamını taşımalı");
assert.equal(selheimsFreshwaterSole?.specificGravity, undefined, "Brachirus selheimi için kaynakta yayımlanmayan tuzluluk değeri tahmin edilmemeli");
assert.equal(selheimsFreshwaterSole?.predatory, true, "Brachirus selheimi küçük canlılar için avlanma riskini taşımalı");
assert.equal(selheimsFreshwaterSole?.speciesOnly, true, "Brachirus selheimi uzman kurulumu gerektirmeli");
assert(selheimsFreshwaterSole?.husbandryCaution?.includes("ince kum"), "Brachirus selheimi gömülme zemini ve hedefli besleme uyarısını taşımalı");
assert(selheimsFreshwaterSole?.tankLengthDataNote?.includes("tahmin edilmedi"), "Brachirus selheimi yayımlanmayan akvaryum uzunluğunu tahmin etmemeli");
assert.equal(speciesForCatalogExactSearch("Brachirus selheimi", "fish", "freshwater")?.id, "selheims-freshwater-sole", "Kesin Brachirus selheimi adı doğru profili bulmalı");
assert.equal(speciesForLivestock({commonName:"TATLI SU DİL BALIKLARI",category:"fish",quantity:1}), undefined, "Genel Tatlı Su Dil Balıkları adı Brachirus panoides veya Brachirus selheimi profiline tahminle bağlanmamalı");
const indianGlassFish = speciesCatalog.find((item) => item.id === "indian-glass-fish");
assert.deepEqual(
  [indianGlassFish?.scientificName, indianGlassFish?.adultSizeCm, indianGlassFish?.minVolumeL, indianGlassFish?.minTankLengthCm, indianGlassFish?.minGroup],
  ["Parambassis ranga", 9.5, 72, 80, 6],
  "Parambassis ranga kaynaklı kimlik, boy, akvaryum ve sürü eşiklerini taşımalı",
);
assert.deepEqual([indianGlassFish?.temperature, indianGlassFish?.ph, indianGlassFish?.flow], [[20, 30], [6.5, 8], "low"], "Parambassis ranga kaynaklı su ve düşük akıntı gereksinimini taşımalı");
assert.deepEqual(indianGlassFish?.waterTypes, ["freshwater", "brackish"], "Parambassis ranga doğrulanan tatlı ve hafif acı su kapsamını taşımalı");
assert(indianGlassFish?.husbandryCaution?.includes("Painted"), "Parambassis ranga yapay boya enjeksiyonu refah uyarısını taşımalı");
assert.equal(speciesForCatalogExactSearch("Indian Glass Fish", "fish", "freshwater")?.id, "indian-glass-fish", "Kesin Indian Glass Fish adı doğru profili bulmalı");
assert.equal(speciesForLivestock({commonName:"BUZ BALIĞI",category:"fish",quantity:1}), undefined, "Genel Buz Balığı adı Parambassis ranga profiline tahminle bağlanmamalı");
assert.equal(unresolvedSpeciesForSearch("BUZ BALIĞI", "fish", "freshwater")?.name, "BUZ BALIĞI", "Genel Buz Balığı açıklamalı güvenlik kaydı olarak kalmalı");
for (const [id, minVolumeL, minTankLengthCm] of [
  ["african-butterfly-fish", 81, 90],
  ["elephantnose-fish", 680, 150],
  ["rope-fish", 540, 150],
]) {
  const profile = speciesCatalog.find((item) => item.id === id);
  assert(profile?.husbandryCaution, `${id} özel bakım uyarısı taşımalı`);
  assert.equal(profile.minVolumeL, minVolumeL, `${id} minimum hacmi korunmalı`);
  assert.equal(profile.minTankLengthCm, minTankLengthCm, `${id} minimum tank uzunluğu korunmalı`);
}
const africanButterflyFish = speciesForLivestock({commonName:"BUTTERFLY FISH",category:"fish",quantity:1});
assert.equal(africanButterflyFish?.id, "african-butterfly-fish", "Tatlı su Sazansıgiller bölümündeki Butterfly Fish adı Pantodon buchholzi profiline bağlanmalı");
assert.deepEqual(
  [africanButterflyFish?.scientificName,africanButterflyFish?.adultSizeCm,africanButterflyFish?.minVolumeL,africanButterflyFish?.minTankLengthCm,africanButterflyFish?.temperature,africanButterflyFish?.ph,africanButterflyFish?.flow],
  ["Pantodon buchholzi",15,81,90,[23,30],[6,7.5],"low"],
  "African Butterfly Fish kaynaklı kimlik, boy, akvaryum, su ve akıntı eşiklerini taşımalı",
);
assert.equal(africanButterflyFish?.verifiedAt, "2026-09-07", "African Butterfly Fish güncel doğrulama tarihini taşımalı");
assert.equal(unresolvedSpeciesForSearch("BUTTERFLY FISH", "fish", "freshwater"), undefined, "Doğrulanmış tatlı su Butterfly Fish çözülmemiş listede kalmamalı");
for (const [id, group, maxTemperature] of [
  ["axolotl", "coldwater", 18],
  ["african-clawed-frog", "other", 22],
]) {
  const profile = speciesCatalog.find((item) => item.id === id);
  assert(profile, `${id} amfibi kataloğunda bulunmalı`);
  assert.equal(profile.category, "other", `${id} balık olarak sınıflandırılmamalı`);
  assert.equal(profile.group, group, `${id} doğru canlı grubunda bulunmalı`);
  assert.equal(profile.temperature[1], maxTemperature, `${id} güvenli hedef sıcaklık aralığını korumalı`);
  assert.equal(profile.flow, "low", `${id} düşük akıntı gereksinimi taşımalı`);
  assert.equal(profile.speciesOnly, true, `${id} tür akvaryumu gerektirmeli`);
  assert(profile.husbandryCaution, `${id} özel amfibi bakım uyarısı taşımalı`);
}

assert.equal(cikletistMainCategoryInventory.length, 384, "Cikletist Balık Çeşitleri ana kategorisinin 16 sayfasındaki 384 güncel satış satırının tamamı denetlenmeli");
assert.equal(new Set(cikletistMainCategoryInventory.map(([, name]) => name)).size, 377, "Ana kategorideki tekrarlı satış adları satır düzeyinde korunmalı");
const cikletistMainNonLivestock = new Set(["JOKER ÜRÜN", "ürün", "TETRA BETTA MENÜ 100ML"]);
const livestockClasses = ["fish", "shrimp", "snail", "other"];
const aquariumWaterTypes = ["freshwater", "brackish", "saltwater"];
let mainMappedRows = 0;
let mainUnresolvedRows = 0;
let mainExcludedRows = 0;
for (const [retailCategory, retailName] of cikletistMainCategoryInventory) {
  const matched = livestockClasses.map((category) => speciesForLivestock({ commonName: retailName, category, quantity: 1 })).find(Boolean);
  const unresolved = aquariumWaterTypes.flatMap((waterType) => livestockClasses.map((category) => unresolvedSpeciesForSearch(retailName, category, waterType))).find(Boolean);
  if (cikletistMainNonLivestock.has(retailName)) {
    assert.equal(matched, undefined, `Canlı olmayan ana kategori satırı canlı profiline bağlanmamalı: ${retailName}`);
    assert.equal(unresolved, undefined, `Canlı olmayan ana kategori satırı çözülmemiş canlı gibi gösterilmemeli: ${retailName}`);
    mainExcludedRows += 1;
    continue;
  }
  assert(matched || unresolved, `Ana kategorideki canlı satış adı doğrulanmış profile veya açıklamalı güvenlik kaydına bağlanmalı: ${retailCategory} / ${retailName}`);
  if (matched) mainMappedRows += 1;
  else mainUnresolvedRows += 1;
}
assert.deepEqual([mainMappedRows, mainUnresolvedRows, mainExcludedRows], [314, 67, 3], "Ana kategori satırları doğrulanmış, çözülmemiş ve canlı olmayan sonuçlara eksiksiz ayrılmalı");
const blackTigerDario = speciesForLivestock({ commonName: "BLACK TİGER BADİS DARİO FİSH", category: "fish", quantity: 2 });
assert.equal(blackTigerDario?.id, "black-tiger-dario", "Black Tiger Dario satış adı güncel Dario tigris profiline bağlanmalı");
assert.deepEqual(
  [blackTigerDario?.scientificName, blackTigerDario?.adultSizeCm, blackTigerDario?.minVolumeL, blackTigerDario?.minTankLengthCm, blackTigerDario?.minGroup, blackTigerDario?.temperature, blackTigerDario?.ph, blackTigerDario?.flow],
  ["Dario tigris", 2, 41, 45, 2, [20, 24], [7, 9], undefined],
  "Black Tiger Dario güncel taksonomik boyu ve eski ticari kimliğin kaynaklı bakım eşiklerini taşımalı",
);
assert.equal(blackTigerDario?.speciesOnly, true, "Black Tiger Dario genel topluluk balığı olarak önerilmemeli");
assert.equal(blackTigerDario?.predatory, true, "Black Tiger Dario mikroavcı beslenme riskini taşımalı");
assert.equal(blackTigerDario?.verifiedAt, "2026-09-07", "Black Tiger Dario güncel doğrulama tarihini taşımalı");
assert(blackTigerDario?.sourceUrl?.includes("fishbase.se/summary/71127"), "Black Tiger Dario güncel Dario tigris taksonomik kaydına bağlanmalı");
assert(blackTigerDario?.additionalSourceUrls?.some((url) => url.includes("mapress.com/zt/issue/view/zootaxa.5138.1")), "Black Tiger Dario 2022 birincil tür tanımına bağlanmalı");
assert(blackTigerDario?.additionalSourceUrls?.some((url) => url.includes("seriouslyfish.com/species/dario-sp-myanmar")), "Black Tiger Dario eski ticari kimliğin ayrıntılı bakım kaynağına bağlanmalı");
assert.equal(unresolvedSpeciesForSearch("BLACK TİGER BADİS DARİO FİSH", "fish", "freshwater"), undefined, "Doğrulanmış Black Tiger Dario artık çözülmemiş listede kalmamalı");
const southernPurpleSpottedGudgeon = speciesForLivestock({ commonName: "Güney mor benekli gudgeon", scientificName: "Mogurnda adspersa", category: "fish", quantity: 1 });
assert.equal(southernPurpleSpottedGudgeon?.id, "southern-purple-spotted-gudgeon", "Mogurnda adspersa bilimsel kimliğiyle güvenli profile bağlanmalı");
assert.deepEqual(
  [southernPurpleSpottedGudgeon?.scientificName, southernPurpleSpottedGudgeon?.adultSizeCm, southernPurpleSpottedGudgeon?.minVolumeL, southernPurpleSpottedGudgeon?.minTankLengthCm, southernPurpleSpottedGudgeon?.minGroup, southernPurpleSpottedGudgeon?.temperature, southernPurpleSpottedGudgeon?.ph, southernPurpleSpottedGudgeon?.flow],
  ["Mogurnda adspersa", 14, 108, 120, 1, [16, 24], [7, 7.5], "low"],
  "Southern Purple-spotted Gudgeon kaynaklı boy, akvaryum tabanı ve su eşiklerini taşımalı",
);
assert.equal(southernPurpleSpottedGudgeon?.predatory, true, "Southern Purple-spotted Gudgeon küçük balık avlama riskini taşımalı");
assert.equal(southernPurpleSpottedGudgeon?.verifiedAt, "2026-09-08", "Southern Purple-spotted Gudgeon güncel doğrulama tarihini taşımalı");
assert(southernPurpleSpottedGudgeon?.sourceUrl?.includes("fishesofaustralia.net.au/home/species/4148"), "Mogurnda adspersa kurumsal tür kimliği kaynağına bağlanmalı");
assert(southernPurpleSpottedGudgeon?.additionalSourceUrls?.some((url) => url.includes("seriouslyfish.com/species/mogurnda-adspersa")), "Southern Purple-spotted Gudgeon ayrıntılı bakım kaynağına bağlanmalı");
assert.equal(speciesForLivestock({ commonName: "PURPLE SPOTTED GUDGEON MOGURNDA BALIĞI", category: "fish", quantity: 1 }), undefined, "Belirsiz Purple Spotted Gudgeon satış adı iki Mogurnda türünden birine zorla bağlanmamalı");
assert.equal(unresolvedSpeciesForSearch("PURPLE SPOTTED GUDGEON MOGURNDA BALIĞI", "fish", "freshwater")?.name, "PURPLE SPOTTED GUDGEON MOGURNDA BALIĞI", "Belirsiz mağaza başlığı açıklamalı güvenlik listesinde kalmalı");
const northernPurpleSpottedGudgeon = speciesForLivestock({ commonName: "Kuzey mor benekli gudgeon", scientificName: "Mogurnda mogurnda", category: "fish", quantity: 1 });
assert.equal(northernPurpleSpottedGudgeon?.id, "northern-purple-spotted-gudgeon", "Mogurnda mogurnda bilimsel kimliğiyle ayrı güvenli profile bağlanmalı");
assert.deepEqual(
  [northernPurpleSpottedGudgeon?.scientificName, northernPurpleSpottedGudgeon?.adultSizeCm, northernPurpleSpottedGudgeon?.minVolumeL, northernPurpleSpottedGudgeon?.minTankLengthCm, northernPurpleSpottedGudgeon?.minGroup, northernPurpleSpottedGudgeon?.temperature, northernPurpleSpottedGudgeon?.ph, northernPurpleSpottedGudgeon?.flow],
  ["Mogurnda mogurnda", 17, 108, 120, 1, [24, 26], [6, 8], "low"],
  "Northern Purple-spotted Gudgeon kaynaklı boy, akvaryum tabanı ve su eşiklerini taşımalı",
);
assert.equal(northernPurpleSpottedGudgeon?.predatory, true, "Northern Purple-spotted Gudgeon küçük canlı avlama riskini taşımalı");
assert(northernPurpleSpottedGudgeon?.sourceUrl?.includes("fishbase.se/summary/Mogurnda_mogurnda"), "Mogurnda mogurnda FishBase kimlik kaynağına bağlanmalı");
assert(northernPurpleSpottedGudgeon?.additionalSourceUrls?.some((url) => url.includes("seriouslyfish.com/species/mogurnda-mogurnda")), "Northern Purple-spotted Gudgeon ayrıntılı bakım kaynağına bağlanmalı");
assert.notEqual(southernPurpleSpottedGudgeon?.scientificName, northernPurpleSpottedGudgeon?.scientificName, "Kuzey ve güney Purple-spotted Gudgeon profilleri aynı tür gibi gösterilmemeli");
assert.equal(speciesForLivestock({ commonName: "Purple Spotted Gudgeon", category: "fish", quantity: 1 }), undefined, "Genel Purple Spotted Gudgeon adı kuzey veya güney profiline otomatik bağlanmamalı");
const unresolvedAlligatorGar = unresolvedSpeciesForSearch("ALLIGATOR GAR TİMSAH BALIKLARI", "fish", "freshwater");
assert.equal(unresolvedAlligatorGar?.group, "monster", "Alligator Gar satışı Monster grubunda güvenlik kaydı olarak kalmalı");
assert.equal(unresolvedAlligatorGar?.verifiedAt, "2026-09-10", "Alligator Gar güvenlik kaydı güncel kaynak denetim tarihini taşımalı");
assert(unresolvedAlligatorGar?.reason.includes("260 cm") && unresolvedAlligatorGar?.reason.includes("305 cm") && unresolvedAlligatorGar?.reason.includes("kamusal tesis"), "Alligator Gar kaydı farklı boy ölçümlerini ve ev akvaryumuna uygunsuzluğu açıklamalı");
assert(unresolvedAlligatorGar?.additionalSourceUrls.some((url) => url.includes("seriouslyfish.com/species/atractosteus-spatula")), "Alligator Gar uzman bakım kaynağına bağlanmalı");
assert(unresolvedAlligatorGar?.additionalSourceUrls.some((url) => url.includes("floridamuseum.ufl.edu")), "Alligator Gar kurumsal tür ve erişkin boy kaynağına bağlanmalı");
assert(unresolvedAlligatorGar?.additionalSourceUrls.some((url) => url.includes("fws.gov")), "Alligator Gar kamu kurumu risk kaynağına bağlanmalı");
assert.equal(speciesForLivestock({ commonName: "ALLIGATOR GAR TİMSAH BALIKLARI", category: "fish", quantity: 1 }), undefined, "Kimliği ve yetişkin tesisi doğrulanmayan Alligator Gar için sahte hacim profili üretilmemeli");
const senegalBichir = speciesForLivestock({ commonName: "Senegal bichir", scientificName: "Polypterus senegalus", category: "fish", quantity: 1 });
assert.deepEqual([senegalBichir?.adultSizeCm, senegalBichir?.minVolumeL, senegalBichir?.minTankLengthCm, senegalBichir?.temperature, senegalBichir?.ph], [70, 540, 150, [24, 28], [6.2, 7.8]], "Senegal bichir bilimsel azami boyu ve kaynaklı bakım eşiklerini taşımalı");
assert.equal(senegalBichir?.verifiedAt, "2026-09-10", "Senegal bichir güncel kaynak denetim tarihini taşımalı");
assert(senegalBichir?.husbandryCaution?.includes("150 × 60 cm") && senegalBichir?.husbandryCaution?.includes("70 cm"), "Senegal bichir boy ve taban kaynağı farkını açıklamalı");
const giantGourami = speciesForLivestock({ commonName: "Dev gurami", scientificName: "Osphronemus goramy", category: "fish", quantity: 1 });
assert.deepEqual([giantGourami?.adultSizeCm, giantGourami?.minVolumeL, giantGourami?.minTankLengthCm, giantGourami?.temperature, giantGourami?.ph, giantGourami?.flow], [70, 681, 183, [20, 30], [6.5, 8], "low"], "Dev gurami kaynaklı erişkin, akvaryum, su ve akıntı eşiklerini taşımalı");
assert.equal(giantGourami?.verifiedAt, "2026-10-02", "Dev gurami güncel kaynak denetim tarihini taşımalı");
assert(giantGourami?.husbandryCaution?.includes("mutlak çıplak alt sınır") && giantGourami?.husbandryCaution?.includes("4–5 hacim"), "Dev gurami yayımlanan minimumu ve filtrasyon-akıntı ayrımını açıklamalı");
const redBelliedPacu = speciesForLivestock({ commonName: "Kırmızı karınlı pacu", scientificName: "Piaractus brachypomus", category: "fish", quantity: 1 });
assert.deepEqual([redBelliedPacu?.adultSizeCm, redBelliedPacu?.minVolumeL, redBelliedPacu?.minTankLengthCm, redBelliedPacu?.minGroup, redBelliedPacu?.temperature, redBelliedPacu?.ph, redBelliedPacu?.flow], [88, 2550, 300, 1, [23, 28], [4.8, 7.5], "low"], "Kırmızı karınlı pacu kaynaklı erişkin, havuz ölçeği, su ve akıntı eşiklerini taşımalı");
assert.equal(redBelliedPacu?.verifiedAt, "2026-10-02", "Kırmızı karınlı pacu güncel kaynak denetim tarihini taşımalı");
assert.equal(redBelliedPacu?.speciesOnly, true, "Kırmızı karınlı pacu standart topluluk önerilerine girmemeli");
assert(redBelliedPacu?.husbandryCaution?.includes("2.550 litre") && redBelliedPacu?.husbandryCaution?.includes("2.430 litre"), "Kırmızı karınlı pacu kaynak içi hacim farkını kullanıcıdan saklamamalı");
const blackGhostKnifefish = speciesForLivestock({ commonName: "Black Ghost bıçak balığı", scientificName: "Apteronotus albifrons", category: "fish", quantity: 1 });
assert.deepEqual([blackGhostKnifefish?.adultSizeCm, blackGhostKnifefish?.minVolumeL, blackGhostKnifefish?.minTankLengthCm, blackGhostKnifefish?.temperature, blackGhostKnifefish?.ph, blackGhostKnifefish?.flow], [50, 454, undefined, [23, 28], [6, 8], undefined], "Black Ghost bıçak balığı yalnız yayımlanmış erişkin, hacim ve su eşiklerini taşımalı");
assert.equal(blackGhostKnifefish?.verifiedAt, "2026-09-10", "Black Ghost bıçak balığı güncel kaynak denetim tarihini taşımalı");
assert(blackGhostKnifefish?.tankLengthDataNote?.includes("tahmin edilmedi"), "Black Ghost bıçak balığı için yayımlanmayan akvaryum cephesi uydurulmamalı");
assert(blackGhostKnifefish?.additionalSourceUrls?.some((url) => url.includes("fishbase.se/summary/Apteronotus-albifrons")), "Black Ghost bıçak balığı bilimsel boy ve su kaynağına bağlanmalı");
const unresolvedBlueAzulPeacockBass = unresolvedSpeciesForSearch("BLUE AZUL PEACOCK BASS", "fish", "freshwater");
assert.equal(unresolvedBlueAzulPeacockBass?.group, "monster", "Blue Azul Peacock Bass Monster grubunda güvenlik kaydı olarak kalmalı");
assert.equal(unresolvedBlueAzulPeacockBass?.verifiedAt, "2026-09-09", "Blue Azul Peacock Bass güvenlik kaydı güncel kaynak denetim tarihini taşımalı");
assert(unresolvedBlueAzulPeacockBass?.reason.includes("48 cm") && unresolvedBlueAzulPeacockBass?.reason.includes("80 cm"), "Blue Azul kaydı kaynaklardaki erişkin boy farkını kullanıcıya açıklamalı");
assert(unresolvedBlueAzulPeacockBass?.reason.includes("5.000 litre") && unresolvedBlueAzulPeacockBass?.reason.includes("300 cm"), "Blue Azul kaydı koruyucu uzman bakım ölçeğini kullanıcıya göstermeli");
assert(unresolvedBlueAzulPeacockBass?.additionalSourceUrls.some((url) => url.includes("fishbase.se/summary/Cichla-piquiti")), "Blue Azul kaydı Cichla piquiti bilimsel boy kaynağına bağlanmalı");
assert(unresolvedBlueAzulPeacockBass?.additionalSourceUrls.some((url) => url.includes("fishi-pedia.com/fishes/cichla-piquiti")), "Blue Azul kaydı uzman bakım kaynağına bağlanmalı");
assert.equal(speciesForLivestock({ commonName: "BLUE AZUL PEACOCK BASS", category: "fish", quantity: 1 }), undefined, "Bilimsel kimliği ve erişkin ölçeği çelişkili Blue Azul için sahte hacim profili üretilmemeli");
const piquitiPeacockBass = speciesForLivestock({ commonName: "Piquiti peacock bass", scientificName: "Cichla piquiti", category: "fish", quantity: 1 });
assert.deepEqual([piquitiPeacockBass?.id, piquitiPeacockBass?.adultSizeCm, piquitiPeacockBass?.minVolumeL, piquitiPeacockBass?.minTankLengthCm, piquitiPeacockBass?.minGroup, piquitiPeacockBass?.temperature, piquitiPeacockBass?.ph, piquitiPeacockBass?.flow], ["piquiti-peacock-bass", 80, 5000, 300, 1, [21, 32], [5.8, 7.3], undefined], "Kesin Cichla piquiti koruyucu erişkin boy, akvaryum ve yayımlanmış su eşiklerini taşımalı");
assert.equal(piquitiPeacockBass?.predatory, true, "Cichla piquiti küçük canlılar için avcılık riskini taşımalı");
assert.equal(piquitiPeacockBass?.speciesOnly, true, "Cichla piquiti genel topluluk balığı olarak önerilmemeli");
assert(piquitiPeacockBass?.husbandryCaution?.includes("48 cm") && piquitiPeacockBass?.husbandryCaution?.includes("80 cm"), "Cichla piquiti bilimsel ölçüm ile koruyucu bakım boyu farkını açıklamalı");
assert(piquitiPeacockBass?.sourceUrl?.includes("fishi-pedia.com/fishes/cichla-piquiti"), "Cichla piquiti ayrıntılı uzman bakım kaynağına bağlanmalı");
assert(piquitiPeacockBass?.additionalSourceUrls?.some((url) => url.toLowerCase().includes("fishbase.se/summary/cichla-piquiti")), "Cichla piquiti bilimsel kimlik ve boy kaynağına bağlanmalı");
assert.equal(piquitiPeacockBass?.verifiedAt, "2026-10-02", "Cichla piquiti güncel kaynak denetim tarihini taşımalı");
assert(piquitiPeacockBass?.husbandryCaution?.includes("akıntı değeri tahmin edilmedi"), "Cichla piquiti yayımlanmayan akıntı eşiğini uydurmamalı");
assert.equal(speciesForCatalogExactSearch("Cichla piquiti", "fish", "freshwater")?.id, "piquiti-peacock-bass", "Kesin Cichla piquiti bilimsel adı doğru profili bulmalı");
assert.equal(speciesForCatalogExactSearch("Azul Peacock Bass", "fish", "freshwater"), undefined, "Belirsiz Azul ticari adı kesin Cichla piquiti profiline dönüşmemeli");
const unresolvedSilverArgus = unresolvedSpeciesForSearch("SİLVER ARGUS BALIKLARI", "fish", "freshwater");
assert.equal(unresolvedSilverArgus?.group, "other", "Silver Argus güvenlik kaydı doğru canlı grubunda kalmalı");
assert.equal(unresolvedSilverArgus?.verifiedAt, "2026-09-08", "Silver Argus güncel kaynak denetim tarihini taşımalı");
assert(unresolvedSilverArgus?.reason.includes("Selenotoca multifasciata") && unresolvedSilverArgus?.reason.includes("Scatophagus argus"), "Silver Argus kaydı iki olası tür kimliğini kullanıcıya açıklamalı");
assert(unresolvedSilverArgus?.additionalSourceUrls.some((url) => url.includes("ornamentalfish.org")), "Silver Argus kaydı OATA acı su bakım kaynağına bağlanmalı");
assert(unresolvedSilverArgus?.additionalSourceUrls.filter((url) => url.includes("fishbase.se")).length >= 2, "Silver Argus kaydı iki ayrı FishBase takson kaynağıyla kimlik çakışmasını göstermeli");
assert.equal(speciesForLivestock({ commonName: "SİLVER ARGUS BALIKLARI", category: "fish", quantity: 1 }), undefined, "Bilimsel kimliği belirsiz Silver Argus için sahte bakım profili üretilmemeli");
const silverScat = speciesForLivestock({ commonName: "Silver Scat", scientificName: "Selenotoca multifasciata", category: "fish", quantity: 6 });
assert.equal(silverScat?.id, "silver-scat", "Bilimsel kimliği doğrulanmış Silver Scat ayrı güvenli profile bağlanmalı");
assert.deepEqual([silverScat?.adultSizeCm, silverScat?.minVolumeL, silverScat?.minTankLengthCm, silverScat?.minGroup], [40, 600, undefined, 6], "Silver Scat kaynaklı boy, hacim ve sürü eşiklerini taşımalı; tank uzunluğu tahmin edilmemeli");
assert.deepEqual([silverScat?.temperature, silverScat?.ph, silverScat?.specificGravity], [[24, 27], [7.5, 8.5], [1.005, 1.026]], "Silver Scat kaynaklı sıcaklık, pH ve tuzluluk aralıklarını taşımalı");
assert.deepEqual(silverScat?.waterTypes, ["brackish", "saltwater"], "Silver Scat uzun süreli tatlı su profili gibi sunulmamalı");
assert(silverScat?.tankLengthDataNote?.includes("tahmini uzunluk kullanılmıyor"), "Silver Scat yayımlanmayan tank uzunluğu için açıklama taşımalı");
assert.equal(speciesForCatalogExactSearch("Silver Scat", "fish", "brackish")?.id, "silver-scat", "Doğrulanmış Silver Scat ortak adı acı su kataloğunda bulunmalı");
assert.equal(speciesForCatalogExactSearch("Silver Scat", "fish", "freshwater"), undefined, "Silver Scat tatlı su kataloğuna yanlışlıkla girmemeli");
assert.equal(unresolvedSpeciesForSearch("Silver Scat", "fish", "freshwater"), undefined, "Doğrulanmış Silver Scat adı çözülmemiş Silver Argus kaydına takılmamalı");
const unresolvedRedBellyTetra = unresolvedSpeciesForSearch("RED BELLY TETRA", "fish", "freshwater");
assert.equal(unresolvedRedBellyTetra?.group, "tetra", "Red Belly Tetra güvenlik kaydı tetra grubunda kalmalı");
assert.equal(unresolvedRedBellyTetra?.verifiedAt, "2026-09-08", "Red Belly Tetra güncel kaynak denetim tarihini taşımalı");
assert(unresolvedRedBellyTetra?.reason.includes("Aphyocharax rathbuni") && unresolvedRedBellyTetra?.reason.includes("Hyphessobrycon pyrrhonotus"), "Red Belly Tetra kaydı iki olası bilimsel kimliği açıklamalı");
assert(unresolvedRedBellyTetra?.additionalSourceUrls.some((url) => url.includes("Aphyocharax-rathbuni")), "Red Belly Tetra ilk FishBase takson kaynağına bağlanmalı");
assert(unresolvedRedBellyTetra?.additionalSourceUrls.some((url) => url.includes("Hyphessobrycon-pyrrhonotus")), "Red Belly Tetra ikinci FishBase takson kaynağına bağlanmalı");
assert.equal(speciesForLivestock({ commonName: "RED BELLY TETRA", category: "fish", quantity: 1 }), undefined, "Bilimsel kimliği belirsiz Red Belly Tetra için sahte bakım profili üretilmemeli");
const flamebackBleedingHeart = speciesForLivestock({ commonName: "Alev sırtlı kanayan kalp tetra", scientificName: "Hyphessobrycon pyrrhonotus", category: "fish", quantity: 10 });
assert.equal(flamebackBleedingHeart?.id, "flameback-bleeding-heart-tetra", "Bilimsel Hyphessobrycon pyrrhonotus adı ayrı güvenli profile bağlanmalı");
assert.deepEqual([flamebackBleedingHeart?.adultSizeCm, flamebackBleedingHeart?.minVolumeL, flamebackBleedingHeart?.minTankLengthCm, flamebackBleedingHeart?.minGroup], [4.5, 100, 100, 10], "Alev sırtlı kanayan kalp tetra kaynaklı boy, hacim, cephe ve sürü eşiklerini taşımalı");
assert.deepEqual([flamebackBleedingHeart?.temperature, flamebackBleedingHeart?.ph], [[20, 28], [4, 7]], "Alev sırtlı kanayan kalp tetra kaynaklı su aralıklarını taşımalı");
assert.equal(flamebackBleedingHeart?.speciesOnly, true, "Yeni profil belirsiz ticari ada bulanık eşleşmemeli");
assert(flamebackBleedingHeart?.sourceUrl.includes("seriouslyfish.com/species/hyphessobrycon-pyrrhonotus"), "Yeni profil doğrudan uzman bakım kaynağına bağlanmalı");
assert.equal(speciesForCatalogExactSearch("Flame-back Bleeding Heart Tetra", "fish", "freshwater")?.id, "flameback-bleeding-heart-tetra", "Doğrulanmış Flame-back ortak adı yeni profili bulmalı");
const unresolvedBlueNeonGoby = unresolvedSpeciesForSearch("BLUE NEON GOBBY GOBİ", "fish", "freshwater");
assert.equal(unresolvedBlueNeonGoby?.verifiedAt, "2026-09-08", "Blue Neon Goby güvenlik kaydı güncel tür ayrımı denetimini taşımalı");
assert(unresolvedBlueNeonGoby?.reason.includes("Stiphodon atropurpureus") && unresolvedBlueNeonGoby?.reason.includes("Stiphodon semoni"), "Blue Neon Goby kaydı iki olası bilimsel kimliği açıklamalı");
assert.equal(unresolvedBlueNeonGoby?.additionalSourceUrls.filter((url) => url.includes("seriouslyfish.com/species/stiphodon-")).length, 2, "Blue Neon Goby iki ayrı uzman tür profiline bağlanmalı");
assert.equal(speciesForLivestock({ commonName: "BLUE NEON GOBBY GOBİ", category: "fish", quantity: 1 }), undefined, "Bilimsel kimliği belirsiz Blue Neon Goby için sahte bakım profili üretilmemeli");
const blueNeonAtropurpureus = speciesForLivestock({ commonName: "Filipin mavi neon gobisi", scientificName: "Stiphodon atropurpureus", category: "fish", quantity: 3 });
const cobaltBlueSemoni = speciesForLivestock({ commonName: "Kobalt mavi gobi", scientificName: "Stiphodon semoni", category: "fish", quantity: 3 });
assert.deepEqual([blueNeonAtropurpureus?.id, blueNeonAtropurpureus?.adultSizeCm, blueNeonAtropurpureus?.minVolumeL, blueNeonAtropurpureus?.minTankLengthCm, blueNeonAtropurpureus?.minGroup, blueNeonAtropurpureus?.temperature, blueNeonAtropurpureus?.ph, blueNeonAtropurpureus?.flow], ["blue-neon-goby-atropurpureus", 5, 54, 60, 3, [22, 26], [6.5, 7.5], "high"], "Stiphodon atropurpureus kaynaklı akarsu bakım eşiklerini taşımalı");
assert.deepEqual([cobaltBlueSemoni?.id, cobaltBlueSemoni?.adultSizeCm, cobaltBlueSemoni?.minVolumeL, cobaltBlueSemoni?.minTankLengthCm, cobaltBlueSemoni?.minGroup, cobaltBlueSemoni?.temperature, cobaltBlueSemoni?.ph, cobaltBlueSemoni?.flow], ["cobalt-blue-goby-semoni", 5, 54, 60, 3, [22, 28], [6.5, 7.5], "high"], "Stiphodon semoni kaynaklı akarsu bakım eşiklerini taşımalı");
assert.notEqual(blueNeonAtropurpureus?.id, cobaltBlueSemoni?.id, "İki Stiphodon türü tek profil gibi gösterilmemeli");
assert.equal(speciesForCatalogExactSearch("Cobalt Blue Goby", "fish", "freshwater")?.id, "cobalt-blue-goby-semoni", "Tür bazlı Cobalt Blue Goby adı Stiphodon semoni profilini bulmalı");
assert.equal(speciesForCatalogExactSearch("Blue Neon Goby", "fish", "freshwater"), undefined, "Belirsiz Blue Neon Goby adı iki bilimsel profilden birine otomatik bağlanmamalı");
const redLipExallisquamulus = speciesForLivestock({ commonName: "Kırmızı dudaklı gobi", scientificName: "Sicyopus exallisquamulus", category: "fish", quantity: 3 });
assert.deepEqual([redLipExallisquamulus?.id, redLipExallisquamulus?.adultSizeCm, redLipExallisquamulus?.minVolumeL, redLipExallisquamulus?.minTankLengthCm, redLipExallisquamulus?.minGroup, redLipExallisquamulus?.temperature, redLipExallisquamulus?.ph, redLipExallisquamulus?.flow], ["red-lip-goby-exallisquamulus", 5.2, 54, 60, 3, [22, 28], [6.5, 7.5], "high"], "Sicyopus exallisquamulus kaynaklı akarsu bakım eşiklerini taşımalı");
assert.equal(redLipExallisquamulus?.predatory, true, "Sicyopus exallisquamulus küçük omurgasız avlama riskini taşımalı");
assert(redLipExallisquamulus?.husbandryCaution?.includes("Yosun yiyici değildir"), "Sicyopus exallisquamulus özel hayvansal beslenme gereksinimini açıklamalı");
assert.equal(redLipExallisquamulus?.verifiedAt, "2026-09-08", "Sicyopus exallisquamulus güncel doğrulama tarihini taşımalı");
assert.equal(speciesForCatalogExactSearch("Sicyopus exallisquamulus", "fish", "freshwater")?.id, "red-lip-goby-exallisquamulus", "Kesin Sicyopus exallisquamulus araması doğru profili bulmalı");
const rubicundusLipstickGoby = speciesForLivestock({ commonName: "Kızıl ruj gobisi", scientificName: "Sicyopus rubicundus", category: "fish", quantity: 5 });
assert.deepEqual([rubicundusLipstickGoby?.id, rubicundusLipstickGoby?.adultSizeCm, rubicundusLipstickGoby?.minVolumeL, rubicundusLipstickGoby?.minTankLengthCm, rubicundusLipstickGoby?.minGroup, rubicundusLipstickGoby?.temperature, rubicundusLipstickGoby?.ph, rubicundusLipstickGoby?.flow], ["rubicundus-lipstick-goby", 5, 112, 80, 5, [22, 26], [6, 7.5], "high"], "Sicyopus rubicundus koruyucu grup, akarsu ve su eşiklerini taşımalı");
assert.equal(rubicundusLipstickGoby?.predatory, true, "Sicyopus rubicundus küçük balık ve karides avlama riskini taşımalı");
assert.equal(rubicundusLipstickGoby?.speciesOnly, true, "Sicyopus rubicundus uzman tür akvaryumu canlısı olarak işaretlenmeli");
assert(rubicundusLipstickGoby?.husbandryCaution?.includes("yabani kökenlidir") && rubicundusLipstickGoby.husbandryCaution.includes("sorumlu kaynak"), "Sicyopus rubicundus yabani köken ve sorumlu tedarik uyarısını göstermeli");
assert(rubicundusLipstickGoby?.sourceUrl?.includes("interaquaristik.de/Roetliche-Lippenstiftgrundel-Sicyopus-rubicundus"), "Sicyopus rubicundus doğrudan türe özel bakım kaynağına bağlanmalı");
assert.equal(speciesForCatalogExactSearch("Sicyopus rubicundus", "fish", "freshwater")?.id, "rubicundus-lipstick-goby", "Kesin Sicyopus rubicundus araması doğru profili bulmalı");
const jonklaasLipstickGoby = speciesForLivestock({ commonName: "Jonklaas ruj gobisi", scientificName: "Sicyopus jonklaasi", category: "fish", quantity: 6 });
assert.deepEqual([jonklaasLipstickGoby?.id, jonklaasLipstickGoby?.adultSizeCm, jonklaasLipstickGoby?.minVolumeL, jonklaasLipstickGoby?.minTankLengthCm, jonklaasLipstickGoby?.minGroup, jonklaasLipstickGoby?.temperature, jonklaasLipstickGoby?.ph, jonklaasLipstickGoby?.flow], ["jonklaas-lipstick-goby", 5.5, 120, 100, 6, [20, 28], [6, 7.5], "high"], "Sicyopus jonklaasi kaynaklı grup, akarsu ve su eşiklerini taşımalı");
assert.equal(jonklaasLipstickGoby?.predatory, true, "Sicyopus jonklaasi küçük balık ve karides avlama riskini taşımalı");
assert.equal(jonklaasLipstickGoby?.speciesOnly, true, "Sicyopus jonklaasi hassas ve korunan tür olarak genel topluluk balığı sayılmamalı");
assert(jonklaasLipstickGoby?.husbandryCaution?.includes("Tehlikede") && jonklaasLipstickGoby.husbandryCaution.includes("yasal ve belgeli köken"), "Sicyopus jonklaasi koruma ve yasal köken uyarısını kullanıcıya göstermeli");
assert.equal(jonklaasLipstickGoby?.verifiedAt, "2026-09-09", "Sicyopus jonklaasi güncel doğrulama tarihini taşımalı");
assert.equal(speciesForCatalogExactSearch("Sicyopus jonklaasi", "fish", "freshwater")?.id, "jonklaas-lipstick-goby", "Kesin Sicyopus jonklaasi araması doğru koruma uyarılı profili bulmalı");
assert.equal(speciesForCatalogExactSearch("Red Lipstick Goby", "fish", "freshwater"), undefined, "Belirsiz Red Lipstick Goby adı üç bilimsel profilden birine otomatik bağlanmamalı");
const unresolvedPandaGarraRufa = unresolvedSpeciesForSearch("PANDA GARRARUFA YOSUN YİYİCİ", "fish", "freshwater");
assert.equal(unresolvedPandaGarraRufa?.verifiedAt, "2026-09-08", "Panda Garrarufa güvenlik kaydı güncel tür ayrımı denetimini taşımalı");
assert(unresolvedPandaGarraRufa?.reason.includes("Garra flavatra") && unresolvedPandaGarraRufa?.reason.includes("Garra rufa"), "Panda Garrarufa kaydı iki ayrı bilimsel kimliği açıklamalı");
assert(unresolvedPandaGarraRufa?.reason.includes("22–27 °C") && unresolvedPandaGarraRufa?.reason.includes("14–20 °C"), "Panda Garrarufa kaydı yanlış tür seçiminin sıcaklık riskini göstermeli");
assert.equal(speciesForLivestock({ commonName: "PANDA GARRARUFA YOSUN YİYİCİ", category: "fish", quantity: 1 }), undefined, "Birleşik Panda Garrarufa satış adı iki türden birine otomatik bağlanmamalı");
const pandaGarra = speciesForLivestock({ commonName: "Panda garra", scientificName: "Garra flavatra", category: "fish", quantity: 3 });
const redGarra = speciesForLivestock({ commonName: "Kırmızı garra", scientificName: "Garra rufa", category: "fish", quantity: 3 });
assert.deepEqual([pandaGarra?.id, pandaGarra?.adultSizeCm, pandaGarra?.minVolumeL, pandaGarra?.minTankLengthCm, pandaGarra?.minGroup, pandaGarra?.temperature, pandaGarra?.ph, pandaGarra?.flow], ["panda-garra", 9, 81, 90, 3, [22, 27], [6.5, 7.5], "high"], "Garra flavatra kaynaklı akarsu bakım eşiklerini taşımalı");
assert.deepEqual([redGarra?.id, redGarra?.adultSizeCm, redGarra?.minVolumeL, redGarra?.minTankLengthCm, redGarra?.minGroup, redGarra?.temperature, redGarra?.ph, redGarra?.flow], ["red-garra-rufa", 14.1, 243, 120, 3, [14, 20], [6, 8], "high"], "Garra rufa kaynaklı serin akarsu bakım eşiklerini taşımalı");
assert.notEqual(pandaGarra?.id, redGarra?.id, "Panda Garra ve Garra rufa tek profil gibi gösterilmemeli");
assert.equal(speciesForCatalogExactSearch("Panda Garra", "fish", "freshwater")?.id, "panda-garra", "Yerleşik Panda Garra ortak adı Garra flavatra profilini bulmalı");
assert.equal(speciesForCatalogExactSearch("Garra rufa", "fish", "freshwater")?.id, "red-garra-rufa", "Kesin Garra rufa bilimsel adı serin su profilini bulmalı");
assert.equal(speciesForCatalogExactSearch("Panda Garra Rufa", "fish", "freshwater"), undefined, "İki türü birleştiren ticari ad doğrulanmış profile dönüşmemeli");
const unresolvedJuliiCory = unresolvedSpeciesForSearch("JULLY ÇÖPÇÜ BALIKLARI", "fish", "freshwater");
assert.equal(unresolvedJuliiCory?.verifiedAt, "2026-09-08", "Jully çöpçü güvenlik kaydı güncel tür ayrımı denetimini taşımalı");
assert(unresolvedJuliiCory?.reason.includes("Hoplisoma julii") && unresolvedJuliiCory?.reason.includes("H. trilineatum"), "Jully çöpçü kaydı gerçek ve False Julii kimliklerini açıklamalı");
assert(unresolvedJuliiCory?.additionalSourceUrls.some((url) => url.includes("seriouslyfish.com/species/corydoras-julii")), "Jully çöpçü uzman kimlik karşılaştırmasına bağlanmalı");
assert.equal(speciesForLivestock({ commonName: "JULLY ÇÖPÇÜ BALIKLARI", category: "fish", quantity: 1 }), undefined, "Bilimsel kimliği belirsiz Jully satış adı iki profilden birine otomatik bağlanmamalı");
const verifiedTrueJulii = speciesForLivestock({ commonName: "Gerçek Julii çöpçü", scientificName: "Hoplisoma julii", category: "fish", quantity: 6 });
assert.equal(verifiedTrueJulii?.id, "true-julii-cory", "Bilimsel Hoplisoma julii adı ayrı güvenli profile bağlanmalı");
assert.equal(speciesForCatalogExactSearch("Leopard Corydoras", "fish", "freshwater")?.id, "true-julii-cory", "Doğrulanmış Leopard Corydoras ortak adı gerçek Julii profilini bulmalı");
assert.equal(speciesForCatalogExactSearch("Julii Cory", "fish", "freshwater"), undefined, "Genel Julii Cory adı kimlik kanıtı olmadan gerçek veya False Julii profiline dönüşmemeli");
const unresolvedAsiaticaBleheri = unresolvedSpeciesForSearch("CHANNA ASIATICA GÖKKUŞAĞI YILANBAŞ BLEHERİ", "fish", "freshwater");
assert.equal(unresolvedAsiaticaBleheri?.verifiedAt, "2026-09-08", "Birleşik Channa satış kaydı güncel tür ayrımı denetimini taşımalı");
assert(unresolvedAsiaticaBleheri?.reason.includes("Channa asiatica") && unresolvedAsiaticaBleheri?.reason.includes("Channa bleheri"), "Birleşik Channa kaydı iki ayrı bilimsel kimliği açıklamalı");
assert(unresolvedAsiaticaBleheri?.reason.includes("35 cm") && unresolvedAsiaticaBleheri?.reason.includes("17–20 cm"), "Birleşik Channa kaydı yanlış tür seçiminin erişkin boy farkını göstermeli");
assert.equal(speciesForLivestock({ commonName: "CHANNA ASIATICA GÖKKUŞAĞI YILANBAŞ BLEHERİ", category: "fish", quantity: 1 }), undefined, "İki türü birleştiren Channa satış adı otomatik profile dönüşmemeli");
const chineseSnakehead = speciesForLivestock({ commonName: "Çin yılanbaşı", scientificName: "Channa asiatica", category: "fish", quantity: 2 });
assert.deepEqual([chineseSnakehead?.id, chineseSnakehead?.adultSizeCm, chineseSnakehead?.minVolumeL, chineseSnakehead?.minTankLengthCm, chineseSnakehead?.minGroup, chineseSnakehead?.temperature, chineseSnakehead?.ph, chineseSnakehead?.flow], ["chinese-snakehead", 35, 160, 100, 2, [15, 25], [6, 8], "low"], "Channa asiatica kaynaklı koruyucu erişkin boy, taban, çift ve su eşiklerini taşımalı");
assert.equal(chineseSnakehead?.predatory, true, "Channa asiatica zorunlu avcı riskini taşımalı");
assert.equal(chineseSnakehead?.speciesOnly, true, "Channa asiatica genel topluluk balığı olarak önerilmemeli");
assert.equal(chineseSnakehead?.verifiedAt, "2026-09-08", "Channa asiatica güncel kaynak denetim tarihini taşımalı");
assert(chineseSnakehead?.sourceUrl?.includes("seriouslyfish.com/species/channa-asiatica"), "Channa asiatica ayrıntılı uzman bakım kaynağına bağlanmalı");
assert(chineseSnakehead?.additionalSourceUrls?.some((url) => url.includes("fishbase.se/summary/Channa_asiatica")), "Channa asiatica bilimsel boy kaynağına bağlanmalı");
assert.equal(speciesForCatalogExactSearch("Channa asiatica", "fish", "freshwater")?.id, "chinese-snakehead", "Kesin Channa asiatica bilimsel adı doğru profili bulmalı");
assert.equal(speciesForCatalogExactSearch("Channa asiatica bleheri", "fish", "freshwater"), undefined, "İki Channa türünü birleştiren ad doğrulanmış profile dönüşmemeli");
assert.notEqual(chineseSnakehead?.id, speciesForCatalogExactSearch("Channa bleheri", "fish", "freshwater")?.id, "Channa asiatica ve gökkuşağı yılanbaş tek profil gibi gösterilmemeli");
const unresolvedGoldenLimbata = unresolvedSpeciesForSearch("golden limbata", "fish", "freshwater");
assert.equal(unresolvedGoldenLimbata?.verifiedAt, "2026-09-09", "Golden Limbata güvenlik kaydı güncel tür ve form ayrımı denetimini taşımalı");
assert(unresolvedGoldenLimbata?.reason.includes("20 cm") && unresolvedGoldenLimbata?.reason.includes("100 litre/80 cm"), "Golden Limbata kaydı doğrulanmış kesin tür profilinin erişkin boy ve akvaryum eşiğini açıklamalı");
assert.equal(speciesForLivestock({ commonName: "CHANNA GOLDEN LİMBATA", category: "fish", quantity: 1 }), undefined, "Golden formu ve bilimsel kimliği kanıtlanmayan satış adı otomatik profile dönüşmemeli");
const redTailedSnakehead = speciesForLivestock({ commonName: "Kırmızı kuyruklu yılanbaş", scientificName: "Channa limbata", category: "fish", quantity: 1 });
assert.deepEqual([redTailedSnakehead?.id, redTailedSnakehead?.adultSizeCm, redTailedSnakehead?.minVolumeL, redTailedSnakehead?.minTankLengthCm, redTailedSnakehead?.minGroup, redTailedSnakehead?.temperature, redTailedSnakehead?.ph, redTailedSnakehead?.flow], ["red-tailed-snakehead", 20, 100, 80, 1, [22, 28], [5.5, 8], "low"], "Channa limbata kaynaklı erişkin boy, akvaryum ve su eşiklerini taşımalı");
assert.equal(redTailedSnakehead?.predatory, true, "Channa limbata küçük canlılar için avcılık riskini taşımalı");
assert.equal(redTailedSnakehead?.speciesOnly, true, "Channa limbata genel topluluk balığı olarak önerilmemeli");
assert(redTailedSnakehead?.sourceUrl?.includes("channaturkiye.com/cuce-turler/channa-limbata"), "Channa limbata doğrudan uzman bakım kaynağına bağlanmalı");
assert(redTailedSnakehead?.additionalSourceUrls?.some((url) => url.includes("researcharchive.calacademy.org")), "Channa limbata güncel taksonomi kaynağıyla çapraz doğrulanmalı");
assert.equal(speciesForCatalogExactSearch("Channa limbata", "fish", "freshwater")?.id, "red-tailed-snakehead", "Kesin Channa limbata bilimsel adı doğru profili bulmalı");
assert.equal(speciesForCatalogExactSearch("Golden Limbata", "fish", "freshwater"), undefined, "Golden form adı bilimsel kimlik kanıtı olmadan Channa limbata profiline dönüşmemeli");
const unresolvedZigzagEel = unresolvedSpeciesForSearch("ZİGZAK TARAK BALIKLARI", "fish", "freshwater");
assert.equal(unresolvedZigzagEel?.verifiedAt, "2026-09-08", "Zigzag eel güvenlik kaydı güncel tür ayrımı denetimini taşımalı");
assert(unresolvedZigzagEel?.reason.includes("Mastacembelus armatus") && unresolvedZigzagEel?.reason.includes("Macrognathus circumcinctus"), "Zigzag eel kaydı iki olası bilimsel kimliği açıklamalı");
assert(unresolvedZigzagEel?.reason.includes("90 cm") && unresolvedZigzagEel?.reason.includes("20 cm"), "Zigzag eel kaydı yanlış tür seçiminin erişkin boy farkını göstermeli");
assert.equal(speciesForLivestock({ commonName: "ZİGZAK TARAK BALIKLARI", category: "fish", quantity: 1 }), undefined, "Bilimsel kimliği belirsiz Zigzag satış adı iki profilden birine otomatik bağlanmamalı");
const tireTrackEel = speciesForLivestock({ commonName: "Lastik izli dikenli yılan balığı", scientificName: "Mastacembelus armatus", category: "fish", quantity: 1 });
assert.deepEqual([tireTrackEel?.id, tireTrackEel?.adultSizeCm, tireTrackEel?.minVolumeL, tireTrackEel?.minTankLengthCm, tireTrackEel?.minGroup, tireTrackEel?.temperature, tireTrackEel?.ph, tireTrackEel?.flow], ["tire-track-eel", 90, 450, undefined, 1, [24, 28], [6.5, 7.5], "low"], "Mastacembelus armatus kaynaklı boy, hacim, sosyal yapı ve su eşiklerini taşımalı; tank uzunluğu tahmin edilmemeli");
assert.equal(tireTrackEel?.predatory, true, "Mastacembelus armatus küçük balıklar için av riskini taşımalı");
assert.deepEqual(tireTrackEel?.waterTypes, ["freshwater", "brackish"], "Mastacembelus armatus doğrulanan tatlı ve acı su kapsamını taşımalı");
assert(tireTrackEel?.tankLengthDataNote?.includes("uzunluk değeri tahmin edilmedi"), "Mastacembelus armatus yayımlanmayan tank uzunluğunu açıkça belirtmeli");
assert.equal(tireTrackEel?.verifiedAt, "2026-09-08", "Mastacembelus armatus güncel kaynak denetim tarihini taşımalı");
assert.equal(speciesForCatalogExactSearch("Tire-track Eel", "fish", "freshwater")?.id, "tire-track-eel", "Doğrulanmış Tire-track Eel adı iri Mastacembelus profiline bağlanmalı");
assert.equal(speciesForCatalogExactSearch("Zigzag eel", "fish", "freshwater"), undefined, "Belirsiz Zigzag eel adı iri veya küçük dikenli yılan balığı profiline dönüşmemeli");
const unresolvedLicoriceGourami = unresolvedSpeciesForSearch("MEYAN KÖKÜ GURAMİ", "fish", "freshwater");
assert.equal(unresolvedLicoriceGourami?.verifiedAt, "2026-09-08", "Meyan Kökü Gurami güvenlik kaydı güncel tür ayrımı denetimini taşımalı");
assert(unresolvedLicoriceGourami?.reason.includes("P. deissneri") && unresolvedLicoriceGourami?.reason.includes("yanlış etiketlendiğini"), "Meyan Kökü Gurami kaydı ticari tür kimliği riskini açıklamalı");
assert(unresolvedLicoriceGourami?.reason.includes("pH 3,0–6,5"), "Meyan Kökü Gurami kaydı yanlış profil seçiminin dar siyah su riskini göstermeli");
assert.equal(speciesForLivestock({ commonName: "MEYAN KÖKÜ GURAMİ", category: "fish", quantity: 1 }), undefined, "Bilimsel kimliği belirsiz Meyan Kökü Gurami gerçek deissneri profiline otomatik bağlanmamalı");
const deissnersLicoriceGourami = speciesForLivestock({ commonName: "Deissner meyan kökü guramisi", scientificName: "Parosphromenus deissneri", category: "fish", quantity: 2 });
assert.deepEqual([deissnersLicoriceGourami?.id, deissnersLicoriceGourami?.adultSizeCm, deissnersLicoriceGourami?.minVolumeL, deissnersLicoriceGourami?.minTankLengthCm, deissnersLicoriceGourami?.minGroup, deissnersLicoriceGourami?.temperature, deissnersLicoriceGourami?.ph, deissnersLicoriceGourami?.flow], ["deissners-licorice-gourami", 4, 25, 40, 2, [22, 28], [3, 6.5], "low"], "Gerçek Parosphromenus deissneri kaynaklı boy, çift, siyah su ve alan eşiklerini taşımalı");
assert.equal(deissnersLicoriceGourami?.speciesOnly, true, "Gerçek P. deissneri genel topluluk balığı olarak önerilmemeli");
assert.equal(deissnersLicoriceGourami?.predatory, true, "Gerçek P. deissneri mikroavcı beslenme gereksinimini taşımalı");
assert.equal(deissnersLicoriceGourami?.verifiedAt, "2026-09-08", "Gerçek P. deissneri güncel kaynak denetim tarihini taşımalı");
assert(deissnersLicoriceGourami?.sourceUrl?.includes("parosphromenus-project.org/species/parosphromenus-deissneri"), "Gerçek P. deissneri uzman koruma ağı kaynağına bağlanmalı");
assert(deissnersLicoriceGourami?.additionalSourceUrls?.some((url) => url.includes("seriouslyfish.com/species/parosphromenus-deissneri")), "Gerçek P. deissneri ayrıntılı bakım kaynağına bağlanmalı");
assert.equal(speciesForCatalogExactSearch("Parosphromenus deissneri", "fish", "freshwater")?.id, "deissners-licorice-gourami", "Kesin P. deissneri bilimsel adı doğru profile bağlanmalı");
assert.equal(speciesForCatalogExactSearch("Licorice Gourami", "fish", "freshwater"), undefined, "Genel Licorice Gourami adı tür kanıtı olmadan gerçek deissneri profiline dönüşmemeli");
const unresolvedWhiteCheckMoray = unresolvedSpeciesForSearch("WHITE CHECK EEL MÜREN", "fish", "brackish");
assert.equal(unresolvedWhiteCheckMoray?.verifiedAt, "2026-09-08", "White Check müren güvenlik kaydı güncel kimlik ve tuzluluk denetimini taşımalı");
assert(unresolvedWhiteCheckMoray?.reason.includes("Echidna rhodochilus") && unresolvedWhiteCheckMoray?.reason.includes("33,8 cm"), "White Check kaydı olası türü ve erişkin ölçeğini açıklamalı");
assert(unresolvedWhiteCheckMoray?.reason.includes("SG 1.005–1.015") && unresolvedWhiteCheckMoray?.reason.includes("uzun süreli tatlı su"), "White Check kaydı yanlış tatlı su bakımının tuzluluk riskini göstermeli");
assert.equal(speciesForLivestock({ commonName: "WHITE CHECK EEL MÜREN", category: "fish", quantity: 1 }), undefined, "Bilimsel kimliği belirsiz White Check müren otomatik profile dönüşmemeli");
const pinkLippedMoray = speciesForLivestock({ commonName: "Pembe dudaklı müren", scientificName: "Echidna rhodochilus", category: "fish", quantity: 1 });
assert.deepEqual([pinkLippedMoray?.id, pinkLippedMoray?.adultSizeCm, pinkLippedMoray?.minVolumeL, pinkLippedMoray?.minTankLengthCm, pinkLippedMoray?.minGroup, pinkLippedMoray?.temperature, pinkLippedMoray?.ph, pinkLippedMoray?.flow], ["pink-lipped-moray", 33.8, 450, undefined, 1, [23, 28], [7.5, 8], undefined], "Echidna rhodochilus kaynaklı boy, acı su hacmi ve su eşiklerini taşımalı; tank uzunluğu tahmin edilmemeli");
assert.deepEqual(pinkLippedMoray?.waterTypes, ["brackish", "saltwater"], "Echidna rhodochilus uzun süreli tatlı su profili gibi sunulmamalı");
assert.deepEqual(pinkLippedMoray?.specificGravity, [1.005, 1.015], "Echidna rhodochilus kaynaklı acı su özgül ağırlığını taşımalı");
assert.equal(pinkLippedMoray?.predatory, true, "Echidna rhodochilus küçük canlılar için av riskini taşımalı");
assert.equal(pinkLippedMoray?.speciesOnly, true, "Echidna rhodochilus sıradan topluluk balığı olarak önerilmemeli");
assert(pinkLippedMoray?.tankLengthDataNote?.includes("uzunluk değeri tahmin edilmedi"), "Echidna rhodochilus yayımlanmayan tank uzunluğunu açıkça belirtmeli");
assert.equal(pinkLippedMoray?.verifiedAt, "2026-09-08", "Echidna rhodochilus güncel kaynak denetim tarihini taşımalı");
assert.equal(speciesForCatalogExactSearch("Pink-lipped Moray Eel", "fish", "brackish")?.id, "pink-lipped-moray", "Doğrulanmış Pink-lipped Moray adı acı su profilini bulmalı");
assert.equal(speciesForCatalogExactSearch("Pink-lipped Moray Eel", "fish", "freshwater"), undefined, "Pink-lipped Moray tatlı su kataloğuna yanlışlıkla girmemeli");
assert.equal(speciesForCatalogExactSearch("White Cheek Moray", "fish", "brackish"), undefined, "Belirsiz White Cheek adı bilimsel kimlik olmadan doğrulanmış profile dönüşmemeli");
const pearlCichlid = speciesForLivestock({ commonName: "GEOPHAGUS BRASİLİENSİS", category: "fish", quantity: 1 });
assert.equal(pearlCichlid?.id, "pearl-cichlid", "Bilimsel satış adı doğrulanmış Geophagus brasiliensis profiline bağlanmalı");
assert.deepEqual([pearlCichlid?.adultSizeCm, pearlCichlid?.minVolumeL, pearlCichlid?.minTankLengthCm, pearlCichlid?.temperature, pearlCichlid?.ph], [28, 320, 152, [20, 28], [6, 8]], "Geophagus brasiliensis kaynaklı boy, hacim, uzunluk, sıcaklık ve pH sınırlarını korumalı");
assert.equal(speciesForLivestock({ commonName: "Pearl Cichlid", category: "fish", quantity: 1 })?.id, "pearl-cichlid", "Pearl Cichlid adı yanlışlıkla Texas ciklet profiline bağlanmamalı");
assert.equal(unresolvedSpeciesForSearch("GEOPHAGUS BRASİLİENSİS", "fish", "freshwater"), undefined, "Doğrulanmış Geophagus brasiliensis artık çözülmemiş listede kalmamalı");
assert.equal(speciesForLivestock({ commonName: "RİO MANACAPURU MELEK BALIKLARI", category: "fish", quantity: 1 })?.id, "angelfish", "Rio Manacapuru satış adı Pterophyllum scalare profiline bağlanmalı");
assert.equal(speciesForLivestock({ commonName: "ALTIN BALON RAMİREZİ BALIKLARI", category: "fish", quantity: 1 })?.id, "ramirezi", "Altın Balon Ramirezi ayrı tür gibi çoğaltılmamalı");
assert.equal(speciesForLivestock({ commonName: "APİSTOGRAMMA MACMASTERİ", category: "fish", quantity: 1 })?.id, "apisto-macmasteri", "Kısaltılmış Macmasteri başlığı doğru tür profiline bağlanmalı");
assert.equal(speciesForLivestock({ commonName: "MEKSİKA CÜCE KEREVİT 2 ADET", category: "other", quantity: 2 })?.id, "mexican-dwarf-crayfish", "Meksika cüce kerevit satış adı doğru omurgasız profiline bağlanmalı");
assert.equal(speciesForLivestock({ commonName: "CARİDİNA DEEP BLUE BOLT KARİDES 2 ADET", category: "shrimp", quantity: 2 })?.id, "blue-bolt-shrimp", "Deep Blue Bolt aynı biyolojik karides profiline bağlanmalı");
assert.equal(unresolvedSpeciesForSearch("Elma Salyangozu 3 ADET", "snail", "freshwater")?.name, "Elma Salyangozu 3 ADET", "Türü belirtilmeyen elma salyangozu açıklamalı güvenlik kaydıyla bulunmalı");
assert.equal(unresolvedSpeciesForSearch("Elma Salyangozu 3 ADET", "snail", "saltwater"), undefined, "Belirsiz elma salyangozu deniz akvaryumunda görünmemeli");
assert.equal(unresolvedSpeciesForSearch("Green Carpet Anemone L Boy", "other", "saltwater")?.name, "Green Carpet Anemone", "Boy etiketi bilimsel kimlik gibi kullanılmadan deniz güvenlik kaydına bağlanmalı");
assert.equal(unresolvedSpeciesForSearch("Green Carpet Anemone", "other", "freshwater"), undefined, "Belirsiz halı anemonu tatlı su akvaryumunda görünmemeli");
assert.equal(unresolvedSpeciesForSearch("Amerikan Kereviti", "other", "freshwater")?.name, "AMERİKAN KEREVİTLERİ", "Genel Amerikan kereviti adı açıklamalı güvenlik kaydını bulmalı");
for (const [category, expectedCount] of [
  ["Omurgasızlar (Karides-Salyangoz)", 34],
  ["Canlı Doğuranlar", 26],
  ["Arowanalar", 4],
  ["Amerikan Tetraları", 47],
  ["BALIK ÇEŞİTLERİ", 3],
  ["Sazansıgiller", 64],
  ["Japon/Oranda Balıkları", 19],
  ["Ciklet Türleri", 84],
  ["Vatoz Kedi Balıkları", 55],
  ["Labirentli Balıklar", 15],
  ["Yılan Ve Müren Balıkları", 11],
  ["Amerikan Cikletleri", 2],
  ["Malawi Cikletleri", 3],
  ["Tuzlu Su Canlıları", 16],
  ["Betta Balıkları", 1],
]) {
  assert.equal(cikletistMainCategoryInventory.filter(([retailCategory]) => retailCategory === category).length, expectedCount, `Ana kategori alt başlık sayısı korunmalı: ${category}`);
}

console.log(`Katalog akışı: ${equipmentCategories.length} ekipman kategorisi, ${livestockCategories.length} canlı sınıfı ve ${careProductCatalog.length} bakım ürünü başarıyla doğrulandı.`);
