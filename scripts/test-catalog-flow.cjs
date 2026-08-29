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

const { equipmentCatalog, hasStandaloneCapacityData, speciesCatalog, speciesForLivestock, speciesGroup } = require(path.join(projectRoot, "src/data/catalog.ts"));
const { careProductCatalog } = require(path.join(projectRoot, "src/data/care-product-catalog.ts"));
const { catalogBrandCoverage } = require(path.join(projectRoot, "src/data/catalog-coverage.ts"));

assert.equal(catalogBrandCoverage.length, 49, "Kullanıcının zorunlu marka listesi 49 başlıkla korunmalı");
assert(catalogBrandCoverage.every((item) => item.equipmentCount + item.careProductCount > 0), "Zorunlu markaların hiçbiri boş katalog başlığına dönüşmemeli");
for (const brand of ["Aquael", "Sera", "Eheim", "Tetra", "ISTA", "Seachem", "Fluval", "Sobo", "Chihiros", "Oase", "SunSun", "Dennerle", "ADA"]) {
  assert(catalogBrandCoverage.some((item) => item.brand === brand && item.equipmentCount + item.careProductCount >= 8), `${brand} tek tük örnek ürünle temsil edilmemeli`);
}

const chihiros = equipmentCatalog.filter((item) => item.brand === "Chihiros");
for (const model of ["WRGB II Pro 60", "WRGB II Pro 120", "Dosing Pump System (4 Head)", "Dosing Pump Mate (2 Head)", "Heater Pro 12/16 mm (EU)", "Heater Pro 16/22 mm (EU)", "Doctor Mate", "Digital TDS / Temperature Tester Pen", "CO₂ Spiral Bubble Counter", "Nano CO₂ Diffuser", "CO₂ Drop Checker"]) {
  assert(chihiros.some((item) => item.model === model), `Chihiros ${model} güncel ürün ailesinde bulunduğu için katalogda yer almalı`);
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
  assert.equal(item.verifiedAt, "2026-08-27", `SunSun ${id} güncel doğrulama tarihini taşımalı`);
}
const sunsun604b = sunsun.find((item) => item.id === "sunsun-604b");
assert.deepEqual([sunsun604b?.category, sunsun604b?.ratedFlowLph, sunsun604b?.powerW], ["filter", 800, 14], "SunSun 604B doğrulanmış 800 L/saat ve 14 W değerlerini taşımalı");
const sunsunJp025f = sunsun.find((item) => item.id === "sunsun-jp025f");
assert.deepEqual([sunsunJp025f?.ratedFlowLph, sunsunJp025f?.powerW, sunsunJp025f?.recommendedMinL, sunsunJp025f?.recommendedMaxL], [1600, 35, 120, 600], "SunSun JP-025F doğrulanmış debi, güç ve hacim aralığını taşımalı");
const sunsunAco006 = sunsun.find((item) => item.id === "sunsun-aco006");
assert.deepEqual([sunsunAco006?.category, sunsunAco006?.ratedFlowLph, sunsunAco006?.powerW], ["air_pump", 5100, 105], "SunSun ACO-006 birim dönüşümü doğrulanmış hava debisi ve güç değerini taşımalı");
assert.deepEqual([sunsun.find((item) => item.id === "sunsun-pg180")?.ratedFlowLph, sunsun.find((item) => item.id === "sunsun-pg250")?.ratedFlowLph], [26000, 35000], "SunSun blower modellerinin m³/saat değerleri L/saat olarak doğru dönüştürülmeli");
for (const id of ["sunsun-502", "sunsun-503"]) {
  const item = sunsun.find((entry) => entry.id === id);
  assert.equal(hasStandaloneCapacityData(item), false, `SunSun ${id} yayımlanmayan debi tahmin edilerek hesaplamaya katılmamalı`);
  assert.match(item?.capacityDataNote || "", /yayımlanmadığı/, `SunSun ${id} teknik veri boşluğu kullanıcıya açıklanmalı`);
}
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
assert.equal(hasStandaloneCapacityData(equipmentCatalog.find((item) => item.id === "boyu-sp-1300c")), false, "Debisi yayımlanmayan Boyu modeli hesaplamaya hazır gösterilmemeli");
assert.match(equipmentCatalog.find((item) => item.id === "boyu-sp-1300c")?.capacityDataNote || "", /yayımlanmamış/, "Doğrulanamayan kapasite boşluğu sessiz bırakılmamalı");
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
  assert.match(item?.capacityDataNote || "", /yayımlanmamış/, `Aquawing ${model} kapasite boşluğunu kullanıcıya açıklamalı`);
}
const aquawingAq938 = equipmentCatalog.find((entry) => entry.brand === "Aquawing" && entry.model === "AQ938");
assert.deepEqual([aquawingAq938?.ratedFlowLph, aquawingAq938?.powerW, aquawingAq938?.recommendedMaxL], [420, 8, 200], "Aquawing AQ938 doğrulanmış hava debisi, güç ve hacim verilerini taşımalı");
assert.equal(aquawingAq938?.adjustableFlow, true, "Aquawing AQ938 ayarlanabilir hava çıkışını belirtmeli");
for (const model of ["AQ01 Mıknatıslı Cam Sileceği", "AQ02 Mıknatıslı Cam Sileceği", "AQ03 Mıknatıslı Cam Sileceği", "AQ04 Mıknatıslı Cam Sileceği"]) {
  const item = equipmentCatalog.find((entry) => entry.brand === "Aquawing" && entry.model === model);
  assert.equal(item?.category, "other", `Aquawing ${model} cihaz kapasite hesabına karışmamalı`);
}

const equipmentCategories = [...new Set(equipmentCatalog.map((item) => item.category))];
for (const category of equipmentCategories) {
  const categoryItems = equipmentCatalog.filter((item) => item.category === category);
  assert(categoryItems.length > 0, `${category} ekipman kategorisi boş olmamalı`);

  for (const brand of new Set(categoryItems.map((item) => item.brand))) {
    const models = categoryItems.filter((item) => item.brand === brand);
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
  assert(item?.sourceUrl.includes(`regent-${model}-`), `Regent ${model} genel seri sayfası yerine doğrudan ürün kaynağına bağlanmalı`);
}
assert.equal(equipmentCatalog.find((entry) => entry.brand === "Regent" && entry.model === "5500")?.sourceUrl, "https://hydroponic.co.za/size/regent-5500/", "Regent 5500 yanlışlıkla 9500 ürün kaynağına bağlanmamalı");
assert.equal(equipmentCatalog.find((entry) => entry.brand === "Regent" && entry.model === "6500")?.adjustableFlow, false, "Güncel Regent 6500 ayar düğmesi varmış gibi gösterilmemeli");
assert.equal(equipmentCatalog.find((entry) => entry.brand === "Regent" && entry.model === "7500")?.adjustableFlow, false, "Güncel Regent 7500 ayar düğmesi varmış gibi gösterilmemeli");
assert.equal(equipmentCatalog.find((entry) => entry.brand === "Regent" && entry.model === "8500")?.adjustableFlow, false, "Güncel Regent 8500 ayar düğmesi varmış gibi gösterilmemeli");
assert.equal(equipmentCatalog.find((entry) => entry.brand === "Regent" && entry.model === "9500")?.adjustableFlow, true, "Regent 9500 akış ayarı korunmalı");

const xlproModels = new Set(equipmentCatalog.filter((entry) => entry.brand === "XLPro").map((entry) => entry.model));
assert.deepEqual(
  xlproModels,
  new Set(["MINI-230", "MINI-500", "MINI-500AT", "EX-1000", "EX-1200", "EX-1500"]),
  "XLPro'nun Türkiye'de doğrulanan altı güncel filtre modeli eksiksiz bulunmalı",
);
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
for (const model of ["Motorlu Pipo Filtre Medium", "Motorlu Pipo Filtre Large"]) {
  const item = equipmentCatalog.find((entry) => entry.brand === "Eurostar" && entry.model === model);
  assert.equal(item?.powerW, 5, `Eurostar ${model} doğrulanmış 5 W güç değerini taşımalı`);
  assert.equal(item?.ratedFlowLph, undefined, `Eurostar ${model} debisi yayımlanmadığı için tahmin edilmemeli`);
  assert.match(item?.capacityDataNote || "", /yayımlanmamış/, `Eurostar ${model} kapasite boşluğunu kullanıcıya açıklamalı`);
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
for (const model of ["Akvaryum Temizlik Seti 4'lü", "Akvaryum Temizlik Seti 5'li", "Cam Yüzey Emiş Borusu 13 mm", "Cam Yüzey Emiş Borusu 17 mm", "Cam Emiş Borusu 13 mm", "Cam Emiş Borusu 17 mm", "Dijital Yapışkan Termometre", "Salyangoz Kapanı Large"]) {
  assert(eurostarModels.has(model), `Eurostar ${model} güncel Türkiye portföyünde bulunduğu için katalogda yer almalı`);
}
const eurostarCareModelsExpanded = new Set(careProductCatalog.filter((entry) => entry.brand === "Eurostar").map((entry) => entry.model));
for (const model of ["Super Premium Carbon 1 L", "Bio Filter Ring Beyaz 500 ml", "Bio Filter Ring Kahverengi 500 ml", "Bio Brick Seramik Fix 500 ml", "Bio Glass Ring 500 ml"]) {
  assert(eurostarCareModelsExpanded.has(model), `Eurostar ${model} güncel filtre medyası portföyünde bulunduğu için katalogda yer almalı`);
}
assert(careProductCatalog.filter((entry) => entry.brand === "Eurostar").length >= 17, "Eurostar bakım ürünleri birkaç örnek filtre medyasıyla sınırlı kalmamalı");

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
for (const model of ["AIRFIZZ 50","AIRFIZZ 100","AIRFIZZ 200","AIRFIZZ 400"]) {
  const item = ferplastEquipment.find((entry) => entry.model === model);
  assert.deepEqual([item?.category,item?.ratedFlowLph,item?.adjustableFlow], ["air_pump",undefined,true], `Ferplast ${model} hava motoru olmalı ve model adı debi varsayımına dönüştürülmemeli`);
  assert.match(item?.capacityDataNote || "", /model bazında toplam hava debisini.*yayımlamıyor/, `Ferplast ${model} kapasite boşluğunu açıklamalı`);
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
  assert(item?.specifications.includes(volume) && item?.specifications.includes(connection), `Netlea ${model} doğrulanmış hazne ve bağlantı ölçülerini taşımalı`);
  assert.match(item?.capacityDataNote || "", /Pasif ön filtre.*otomatik filtrasyon hesabına tek başına katılmaz/, `Netlea ${model} biyolojik yük hesabında bağımsız filtre sayılmamalı`);
}

const netleaEquipment = equipmentCatalog.filter((entry) => entry.brand === "Netlea");
const netleaCare = careProductCatalog.filter((entry) => entry.brand === "Netlea");
assert.equal(netleaEquipment.length, 64, "Netlea güncel ve doğrulanmış ekipman kapsamı 64 ayrı kayıt içermeli");
assert.equal(netleaCare.length, 12, "Netlea taban, gübre, bakteri ve filtre medyası kapsamı 12 ayrı kayıt içermeli");
assert.deepEqual(
  Object.fromEntries(["filter", "air_pump", "lighting", "other"].map((category) => [category, netleaEquipment.filter((entry) => entry.category === category).length])),
  {filter:13, air_pump:3, lighting:28, other:20},
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
for (const model of ["No.2B Bluetooth Air Pump", "No.3B Bluetooth Air Pump", "No.4B Bluetooth Air Pump"]) {
  const item = netleaEquipment.find((entry) => entry.model === model);
  assert.equal(item?.category, "air_pump", `Netlea ${model} hava motoru kategorisinde bulunmalı`);
  assert.equal(item?.ratedFlowLph, undefined, `Netlea ${model} için yayımlanmayan hava debisi tahmin edilmemeli`);
  assert.match(item?.capacityDataNote || "", /debisi yayımlanmadığı.*otomatik hava kapasitesi hesabına katılmaz/, `Netlea ${model} kapasite boşluğunu kullanıcıya açıklamalı`);
}
const netleaFlowerPrefilter = netleaEquipment.find((entry) => entry.model === "Flower Cartridge Prefilter 16/22");
assert.deepEqual([netleaFlowerPrefilter?.category, netleaFlowerPrefilter?.ratedFlowLph], ["filter", undefined], "Netlea Flower Cartridge pasif ön filtre olarak kalmalı ve pompa debisi uydurulmamalı");
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
assert.equal(creaquaCare.length, 22, "Creaqua gübre, su düzenleyici, bakteri, filtre medyası ve kum aileleri 22 ayrı ürün içermeli");
for (const [model, category] of [["Plant Nutrition Macro 250 ml", "fertilizer"], ["GH Plus 250 ml", "water_conditioner"], ["Cycle Booster", "bacteria"], ["Hivex", "filter_media"], ["Cosmetics River Sand 3 L", "substrate"]]) {
  const item = creaquaCare.find((entry) => entry.model === model);
  assert.equal(item?.category, category, `Creaqua ${model} doğru bakım kategorisinde bulunmalı`);
  assert.match(item?.sourceUrl || "", /^https:\/\//, `Creaqua ${model} doğrulama kaynağı taşımalı`);
}

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
assert.equal(boyuSp1300c?.ratedFlowLph, undefined, "Boyu SP-1300C debisi doğrudan model kaynağı olmadan tahmin edilmemeli");
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
assert.deepEqual([resunCx400?.category, resunCx400?.ratedFlowLph, resunCx400?.powerW], ["filter", 340, undefined], "Resun CX-400 yalnızca yayımlanan 340 L/saat debiyi kullanmalı");
const resunOfficialFilterModels = [
  "BC300", "BC450", "BC650", "EFC300", "EFC550", "GF400", "GF800", "CX-200 ClearMax",
  "CS400", "CS700", "CS1000", "CS1500", "CS2000", "MAGI200", "MAGI380", "MAGI700", "MAGI1000",
  "HS300", "CY20", "BF80", "BF100", "BF200", "EVF600", "EVF900", "EVF1200", "EF1600", "EF1600U", "EF2800", "EF2800U",
];
for (const model of resunOfficialFilterModels) {
  const item = equipmentCatalog.find((entry) => entry.brand === "Resun" && entry.model === model);
  assert.equal(item?.category, "filter", `Resun resmî güncel filtre ailesindeki ${model} filtre kategorisinde bulunmalı`);
  assert.equal(item?.ratedFlowLph, undefined, `Resun ${model} için görsel teknik tablodan okunamayan debi tahmin edilmemeli`);
  assert.equal(item?.recommendedMaxL, undefined, `Resun ${model} için yayımlanmayan hacim önerisi tahmin edilmemeli`);
  assert(item?.capacityDataNote, `Resun ${model} eksik kapasite verisini kullanıcıya açıklamalı`);
  assert(item?.sourceUrl.startsWith("https://www.resun-china.com/h-pd-"), `Resun ${model} doğrudan resmî seri sayfasına bağlanmalı`);
  assert.equal(item?.verifiedAt, "2026-08-26", `Resun ${model} güncel doğrulama tarihini taşımalı`);
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
const resunOfficialCurrentAirPumpModels = [
  "HCB1000", "HCB4000", "HCA1000", "HCA4000", "AP72", "AP108", "AP180", "AP216",
  "HLP-4000", "HLP-8000", "DC120", "DC160", "PLP40", "PLP60", "PLP100",
  "NLP20", "NLP40", "NLP60", "NLP100", "NLP200", "QSW70", "QSB70",
];
for (const model of resunOfficialCurrentAirPumpModels) {
  const item = equipmentCatalog.find((entry) => entry.brand === "Resun" && entry.model === model);
  assert.equal(item?.category, "air_pump", `Resun ${model} hava motoru yalnızca hava motoru kategorisinde listelenmeli`);
  assert.equal(item?.ratedFlowLph, undefined, `Resun ${model} görsel tablosundaki hava debisi okunmadan tahmin edilmemeli`);
  assert.equal(item?.powerW, undefined, `Resun ${model} görsel tablosundaki güç okunmadan tahmin edilmemeli`);
  assert(item?.capacityDataNote, `Resun ${model} eksik hava kapasitesi verisini kullanıcıya açıklamalı`);
  assert(item?.sourceUrl.startsWith("https://www.resun-china.com/h-pd-"), `Resun ${model} doğrudan resmî hava motoru seri sayfasına bağlanmalı`);
  assert.equal(item?.verifiedAt, "2026-08-27", `Resun ${model} güncel doğrulama tarihini taşımalı`);
}
const resunOfficialCurrentHeaterModels = [
  "Sunlike Heater Series", "Digital Smart Heater Series", "Thermo Heater Series", "Rising Heat Heater Series",
  "Delta Pre-set Heater Series", "HT Mini Heater Series", "MH75", "MH150", "MH250",
];
for (const model of resunOfficialCurrentHeaterModels) {
  const item = equipmentCatalog.find((entry) => entry.brand === "Resun" && entry.model === model);
  assert.equal(item?.category, "heater", `Resun ${model} yalnızca ısıtıcı kategorisinde listelenmeli`);
  assert.equal(item?.powerW, undefined, `Resun ${model} görsel tablodan okunmayan güç değerini taşımamalı`);
  assert.equal(item?.recommendedMaxL, undefined, `Resun ${model} için hacim önerisi tahmin edilmemeli`);
  assert(item?.capacityDataNote, `Resun ${model} eksik ısıtıcı kapasitesini açıklamalı`);
  assert(item?.sourceUrl.startsWith("https://www.resun-china.com/h-pd-"), `Resun ${model} doğrudan resmî ısıtıcı sayfasına bağlanmalı`);
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
assert.deepEqual([rs1000Air?.category, rs1000Air?.ratedFlowLph, rs1000Air?.powerW, rs1000Air?.recommendedMaxL], ["air_pump", undefined, 8, 200], "RS 1000 hava motorunda çelişkili debi seçilmemeli; doğrulanan güç ve hacim korunmalı");
assert.match(rs1000Air?.capacityDataNote || "", /toplam debiyi 9 L\/dakika.*her çıkışı 9 L\/dakika.*otomatik hava kapasitesi hesabına katılmaz/, "RS 1000 kaynak çelişkisi kullanıcıdan saklanmamalı");
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
assert.equal(
  equipmentCatalog.find((entry) => entry.brand === "Jeneca" && entry.model === "XP-605")?.ratedFlowLph,
  undefined,
  "Jeneca XP-605 debisi güvenilir kaynak olmadan tahmin edilmemeli",
);
for (const model of ["XP-605", "TGD-15", "TGD-16", "TGD-17", "TGD-18", "TGD-19", "GD-402", "GD-502", "GD-602"]) {
  const item = equipmentCatalog.find((entry) => entry.brand === "Jeneca" && entry.model === model);
  assert(item, `Jeneca ${model} resmî üretici kataloğunda bulunduğu için katalogda yer almalı`);
  assert.equal(item.category, "filter", `Jeneca ${model} filtre kategorisinde bulunmalı`);
  assert.equal(item.ratedFlowLph, undefined, `Jeneca ${model} debisi benzer seriden türetilmemeli`);
  assert.equal(item.powerW, undefined, `Jeneca ${model} gücü benzer seriden türetilmemeli`);
  assert(item.capacityDataNote?.includes("otomatik filtrasyon hesabına katılmaz"), `Jeneca ${model} eksik teknik veri nedeniyle kapasite hesabından açıkça dışlanmalı`);
}
for (const model of ["DC-001", "DC-003"]) {
  const item = equipmentCatalog.find((entry) => entry.brand === "Jeneca" && entry.model === model);
  assert(item, `Jeneca ${model} resmî üretici kataloğunda bulunduğu için katalogda yer almalı`);
  assert.equal(item.category, "air_pump", `Jeneca ${model} hava motoru kategorisinde bulunmalı`);
  assert.equal(item.ratedFlowLph, undefined, `Jeneca ${model} hava debisi model kodundan tahmin edilmemeli`);
  assert.equal(item.powerW, undefined, `Jeneca ${model} gücü doğrulanmadan kullanılmamalı`);
  assert(item.capacityDataNote?.includes("otomatik hava kapasitesi hesabına katılmaz"), `Jeneca ${model} eksik teknik veri nedeniyle hava kapasitesi hesabından açıkça dışlanmalı`);
}

const jenecaProfiles = equipmentCatalog.filter((entry) => entry.brand === "Jeneca");
assert.equal(jenecaProfiles.length, 392, "Jeneca resmî cihaz ve aksesuar portföyü birkaç örnek modelle sınırlı kalmamalı");
assert.deepEqual(
  Object.fromEntries([...new Set(jenecaProfiles.map((entry) => entry.category))].sort().map((category) => [category, jenecaProfiles.filter((entry) => entry.category === category).length])),
  { air_pump: 41, filter: 107, heater: 21, lighting: 42, other: 176, uv: 5 },
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
for (const model of ["AP-602", "AP-8806", "AP-601", "AP-18000", "AP-10000", "AP-12000", "AP-15000", "AP-20000", "AP-22000", "AP-30000", "AP-40000", "DB-58 Upgrade"]) {
  assert.equal(jenecaProfiles.find((entry) => entry.model === model)?.category, "air_pump", `Jeneca ${model} resmî hava motoru portföyünde bulunmalı`);
}
for (const model of ["AL-3201 25 W", "AL-3201 50 W", "AL-3201 75 W", "AL-3201 100 W", "AL-3201 150 W", "AL-3201 200 W", "AL-3201 300 W", "SX-366", "SX-388", "SX-265", "AL-22", "BX-28", "AL-28", "BX-22", "BX-29"]) {
  assert.equal(jenecaProfiles.find((entry) => entry.model === model)?.category, "heater", `Jeneca ${model} resmî ısıtıcı portföyünde bulunmalı`);
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
  assert.equal(item?.verifiedAt, "2026-08-26", `Haqos ${model} güncel doğrulama tarihini taşımalı`);
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
assert.equal(haqosThermoSprite?.powerW, undefined, "Haqos Thermo-Sprite gücü yayımlanmadan tahmin edilmemeli");
assert(haqosThermoSprite?.capacityDataNote?.includes("otomatik ısıtıcı kapasitesi hesabına katılmaz"), "Haqos Thermo-Sprite eksik güç nedeniyle otomatik ısıtıcı hesabından açıkça dışlanmalı");

for (const model of ["NW-450F", "NW-600F", "NW-800F", "NW-1500F", "NB-1500F", "YU-118C", "YU-119C"]) {
  const item = equipmentCatalog.find((entry) => entry.brand === "Nubios" && entry.model === model);
  assert(item, `Nubios ${model} katalogda bulunmalı`);
  assert.equal(item.category, "filter", `Nubios ${model} filtre kategorisinde bulunmalı`);
  assert.equal(item.ratedFlowLph, undefined, `Nubios ${model} debisi doğrudan ürün kaynağı olmadan tahmin edilmemeli`);
  assert(item.capacityDataNote?.includes("otomatik filtrasyon hesabına katılmaz"), `Nubios ${model} yayımlanmamış debi nedeniyle kapasite hesabından açıkça dışlanmalı`);
}
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
for (const model of ["NB-150 Betta Habitat Nano Tank", "Şeffaf Dış Filtre Hortumu 12/16 mm 1 m", "Şeffaf Dış Filtre Hortumu 16/22 mm 1 m", "Dış Filtre Hortumu 12/16 mm 10 m", "Dış Filtre Hortumu 16/22 mm 10 m", "Pompalı Dip Sifonu Küçük", "Pompalı Vanalı Dip Sifonu Büyük"]) {
  assert(nubiosModels.has(model), `Nubios ${model} güncel Türkiye portföyünde bulunduğu için katalogda yer almalı`);
}
const nubiosEquipment = equipmentCatalog.filter((entry) => entry.brand === "Nubios");
assert.equal(nubiosEquipment.length, 43, "Nubios doğrulanmış ekipman ve aksesuar kapsamı 43 ayrı kayıt içermeli");
assert.deepEqual(
  Object.fromEntries(["filter", "other"].map((category) => [category, nubiosEquipment.filter((entry) => entry.category === category).length])),
  {filter:16, other:27},
  "Nubios filtreleri ve yardımcı ekipmanları kullanıcı seçiminde doğru kategoriye ayrılmalı",
);
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
assert.equal(
  new Set(speciesCatalog.map((item) => item.id)).size,
  speciesCatalog.length,
  "Canlı kataloğunda yinelenen kimlik bulunmamalı",
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
  ["butterfly-goodeid", 250, 8],
  ["red-tailed-goodeid", 100, 6],
  ["sparkling-limia", 100, 5],
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
assert.equal(speciesCatalog.find((item) => item.id === "red-tailed-goodeid")?.speciesOnly, true, "Kırmızı kuyruklu Goodeid güvenli topluluk balığı gibi önerilmemeli");
assert.deepEqual(speciesCatalog.find((item) => item.id === "dark-edged-splitfin")?.temperature, [10, 22], "Koyu kenarlı Splitfin sürekli tropikal sıcaklığa önerilmemeli");
assert.deepEqual([speciesCatalog.find((item) => item.id === "tropheus-moorii")?.minGroup, speciesCatalog.find((item) => item.id === "tropheus-moorii")?.minTankLengthCm], [15, 150], "Moorii Tropheus küçük grup veya kısa tank için önerilmemeli");
assert.equal(speciesCatalog.find((item) => item.id === "red-zebra-mbuna")?.ph[0], 7.5, "Kırmızı zebra asidik topluluk su koşullarına önerilmemeli");
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
assert.equal(speciesCatalog.filter((item) => speciesGroup(item) === "shrimp").length, 38, "Karides kataloğu doğrulanan yaygın tür ve renk varyeteleriyle 38 biyolojik bakım profili içermeli");
assert.equal(speciesCatalog.filter((item) => speciesGroup(item) === "snail").length, 20, "Salyangoz kataloğu doğrulanan yaygın tatlı su türleri ve ticari varyantlarla 20 bakım profili içermeli");
for (const id of ["blue-dream-shrimp", "yellow-fire-shrimp", "orange-sakura-shrimp", "green-jade-shrimp", "bloody-mary-shrimp"]) {
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

for (const [retailName, expectedId] of [
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
  ["KOİ KILIÇ KUYRUK", "swordtail"],
  ["PANDA LEPİSTES", "guppy"],
  ["GREEN COBRA LEPİSTES", "guppy"],
  ["SNOW WHİTE LEPİSTES", "guppy"],
  ["COBRA LEPİSTES", "guppy"],
]) {
  assert.equal(
    speciesForLivestock({commonName:retailName,category:"fish",quantity:1})?.id,
    expectedId,
    `Cikletist canlı doğuran adı doğru sağlık profiline bağlanmalı: ${retailName}`,
  );
}
for (const unresolvedTradeName of ["VELİFERA BALIKLARI", "VELİFERA TÜRLERİ", "ALBİNO SKY BLUE"]) {
  assert.equal(
    speciesForLivestock({commonName:unresolvedTradeName,category:"fish",quantity:1}),
    undefined,
    `Bilimsel kimliği yayımlanmayan ticari ad tahminle bir türe bağlanmamalı: ${unresolvedTradeName}`,
  );
}
for (const [retailName, expectedId] of [
  ["Veiltail Betta", "betta"],
  ["Crowntail Betta", "betta"],
  ["HALFMOON BETTA BALIKLARI", "betta"],
  ["HALFMOON BETTA BALIKLARI A+", "betta"],
  ["DEV GURAMİ BALIKLARI", "giant-gourami"],
  ["WHİTE BETTA ÇEŞİTLERİ", "betta"],
  ["GALAXY KOİ BETTA BALIKLARI", "betta"],
  ["TAÇ BETTA BALIKLARI", "betta"],
  ["ÇİKOLATA GURAMİ", "chocolate-gourami"],
  ["SAMURAY BETTA", "betta"],
  ["KOİ PLAKAT BETTA", "betta"],
  ["GALAXY HALFMOON NEMO BETTA BALIKLARI STRAFORLU GÖNDERİM", "betta"],
  ["KOİ PLAKAT DİŞİ BETTA", "betta"],
]) {
  assert.equal(
    speciesForLivestock({commonName:retailName,category:"fish",quantity:1})?.id,
    expectedId,
    `Cikletist Betta/labirentli adı doğru sağlık profiline bağlanmalı: ${retailName}`,
  );
}
assert.equal(
  speciesForLivestock({commonName:"MEYAN KÖKÜ GURAMİ",category:"fish",quantity:1}),
  undefined,
  "Birden fazla Parosphromenus türünü kapsayabilen ticari ad bilimsel kimlik doğrulanmadan eşleştirilmemeli",
);
for (const [retailName, expectedId] of [
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
  ["A+ İTHAL ORANDALAR", "goldfish"],
  ["BALONGÖZ JAPON", "goldfish"],
  ["ORANDALAR YERLİ", "goldfish"],
  ["RYUKİN CALİCO", "goldfish"],
  ["TELESKOP JAPON", "goldfish"],
]) {
  assert.equal(
    speciesForLivestock({commonName:retailName,category:"fish",quantity:1})?.id,
    expectedId,
    `Cikletist Japon/koi adı doğru sağlık profiline bağlanmalı: ${retailName}`,
  );
}
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
  ["L-148 Total Spotted Pleco"],
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
  ["L-103 CLOWN PLECO"],
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
  ["delhezi-bichir", "Polypterus delhezi", 680, 180, 1, [25,28], [6,8]],
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
assert.equal(speciesForLivestock({commonName:"L-103 CLOWN PLECO",category:"fish",quantity:1}), undefined, "L103 bilimsel kimliği doğrulanmadan Panaqolus maccus veya başka palyaço vatoza bağlanmamalı");

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
for (const [id, scientificName, size, volume, length, group, temperature, ph, sourceDomain] of [
  ["andrao-snakehead", "Channa andrao", 10, 72, 80, 1, [12,26], [6,7], "seriouslyfish.com"],
  ["assamese-snakehead", "Channa stewartii", 25, 300, 120, 1, [18,25], [6,7], "fishipedia.it"],
  ["ornate-snakehead", "Channa ornatipinnis", 30, 300, 120, 1, [18,25], [6,7], "fishipedia.es"],
  ["rainbow-snakehead", "Channa bleheri", 20, 150, 100, 2, [15,28], [6,7.5], "aquarium-dietzenbach.de"],
  ["peacock-snakehead", "Channa pulchra", 25, 200, 100, 1, [20,25], [6,7], "practicalfishkeeping.co.uk"],
  ["emperor-snakehead", "Channa marulioides", 65, 1000, 200, 1, [20,25], [4,6], "fishi-pedia.com"],
  ["giant-snakehead", "Channa micropeltes", 130, 6000, 400, 1, [26,30], [6.5,7.2], "fishfish.fr"],
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
assert.equal(speciesForLivestock({commonName:"ZİGZAG EEL",category:"fish",quantity:1}), undefined, "Belirsiz Zigzag eel ticari adı bilimsel kimlik olmadan Half-banded profile bağlanmamalı");
assert.equal(speciesCatalog.filter((item) => speciesGroup(item) === "monster").length, 28, "Büyük tür kataloğu Pangasius ve Siyah Labeo dahil 28 profile ulaşmalı");
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
  assert.equal(profile.verifiedAt, "2026-08-28", `${id} güncel doğrulama tarihini taşımalı`);
  assert(profile.sourceUrl?.includes("fishbase"), `${id} bilimsel ana kaynağa bağlanmalı`);
  assert((profile.additionalSourceUrls?.length || 0) >= 2, `${id} kurumsal veya uzman ek kaynaklarla doğrulanmalı`);
  assert(/ev akvaryum/i.test(profile.husbandryCaution || ""), `${id} ev akvaryumu uygunluk riskini açıkça anlatmalı`);
}

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
  ["ROSY TETRA BALIKLARI"],
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
for (const [id, scientificName, size, volume, length, group, temperature, ph, sourceDomain] of [
  ["flame-tetra", "Hyphessobrycon flammeus", 2.6, 60, 60, 8, [22,28], [5.8,7.8], "fishbase.se"],
  ["blue-emperor-tetra", "Inpaichthys kerri", 4, 60, 60, 10, [24,27], [5.5,7], "fishkeeper.co.uk"],
  ["buenos-aires-tetra", "Psalidodon anisitsi", 13.2, 120, 90, 10, [16,28], [5.5,8.5], "fishbase.se"],
  ["colombian-tetra", "Hyphessobrycon columbianus", 7, 100, 80, 8, [24,27], [5.5,7], "fishbase.se"],
  ["red-eye-tetra", "Bario sanctaefilomenae", 7, 105, 90, 8, [22,26], [6,8], "fishbase.se"],
  ["celebes-rainbowfish", "Marosatherina ladigesi", 8, 120, 100, 8, [22,28], [7,8], "fishbase.org"],
]) {
  const profile = speciesCatalog.find((item) => item.id === id);
  assert(profile, `${id} güvenilir kaynaklı canlı kataloğunda bulunmalı`);
  assert.deepEqual(
    [profile.scientificName,profile.adultSizeCm,profile.minVolumeL,profile.minTankLengthCm,profile.minGroup,profile.temperature,profile.ph],
    [scientificName,size,volume,length,group,temperature,ph],
    `${id} doğrulanmış kimlik, yetişkin boyu, akvaryum, sürü ve su eşiklerini taşımalı`,
  );
  assert.equal(profile.verifiedAt, "2026-08-28", `${id} güncel doğrulama tarihini taşımalı`);
  assert(profile.sourceUrl?.includes(sourceDomain), `${id} yerel satış açıklaması yerine bilimsel veya uzman kaynağına bağlanmalı`);
  assert((profile.additionalSourceUrls?.length || 0) >= 1, `${id} bağımsız ek doğrulama kaynağını saklamalı`);
}
assert.equal(speciesForLivestock({commonName:"BLUE KING TETRA",category:"fish",quantity:1}), undefined, "Blue King adı Inpaichthys kerri ve Boehlkea fredcochui arasında belirsizken tahminle bağlanmamalı");
for (const retailName of ["KIRMIZI KALEM TETRA BALIKLARI","BUZ BALIĞI","ROSY TETRA BALIKLARI","Siyah Simpson Tetra","Gül Tetra","Kiraz Tetra"]) {
  assert.equal(speciesForLivestock({commonName:retailName,category:"fish",quantity:1}), undefined, `Belirsiz ticari ad bilimsel kimlik doğrulanmadan eşleştirilmemeli: ${retailName}`);
}

for (const [retailName, expectedId] of [
  ["EİGHT BANDED BARB", "eight-banded-false-barb"],
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
for (const [id, scientificName, size, volume, length, group, temperature, ph] of [
  ["eight-banded-false-barb", "Eirmotus octozona", 4, 100, 60, 10, [24,26], [6.5,7.2]],
  ["daisys-blue-ricefish", "Oryzias woworae", 4, 40, 60, 8, [24,27], [6.5,7.5]],
  ["pacific-blue-eye", "Pseudomugil signifer", 7.5, 60, 60, 10, [18,27], [6.5,7.5]],
  ["red-phantom-tetra", "Megalamphodus sweglesi", 4, 80, 80, 10, [20,23], [5.5,7.5]],
  ["sawbwa-resplendens", "Sawbwa resplendens", 4.5, 60, 60, 10, [15,25], [7,8]],
  ["phoenix-rasbora", "Boraras merah", 2, 40, 45, 10, [20,28], [4,6.5]],
  ["green-fire-tetra", "Aphyocharax rathbuni", 7.1, 75, 50, 12, [20,26], [6,7.5]],
  ["red-neon-blue-eye", "Pseudomugil luminatus", 3, 60, 60, 8, [20,28], [6.5,8]],
  ["ninja-woodcat", "Tatia musaica", 6, 60, 60, 5, [22,27], [6,7.5]],
  ["red-bellied-piranha", "Pygocentrus nattereri", 50, 600, 200, 6, [24,27], [5.5,7.5]],
  ["endlicheri-bichir", "Polypterus endlicherii", 75, 2000, 200, 1, [26,28], [6,7.5]],
  ["monoculus-peacock-bass", "Cichla monoculus", 71, 1200, 200, 1, [25,31], [5.5,6.5]],
]) {
  const profile = speciesCatalog.find((item) => item.id === id);
  assert(profile, `${id} güvenilir kaynaklı canlı kataloğunda bulunmalı`);
  assert.deepEqual(
    [profile.scientificName,profile.adultSizeCm,profile.minVolumeL,profile.minTankLengthCm,profile.minGroup,profile.temperature,profile.ph],
    [scientificName,size,volume,length,group,temperature,ph],
    `${id} doğrulanmış kimlik, boy, akvaryum, sürü ve su eşiklerini taşımalı`,
  );
  assert.equal(profile.verifiedAt, "2026-08-28", `${id} güncel doğrulama tarihini taşımalı`);
  assert(profile.sourceUrl?.startsWith("https://"), `${id} güvenilir HTTPS ana kaynağı taşımalı`);
  assert((profile.additionalSourceUrls?.length || 0) >= 2, `${id} en az iki ek doğrulama kaynağını saklamalı`);
}
assert.equal(speciesCatalog.filter((item) => speciesGroup(item) === "tetra").length, 25, "Tetra kataloğu Yeşil Ateş tetra dahil 25 güvenilir profile ulaşmalı");
assert.equal(speciesCatalog.filter((item) => speciesGroup(item) === "rasbora").length, 14, "Rasbora kataloğu Phoenix rasbora ve Sawbwa dahil 14 güvenilir profile ulaşmalı");
assert.equal(speciesCatalog.filter((item) => speciesGroup(item) === "rainbowfish").length, 12, "Rainbowfish kataloğu doğrulanmış 12 profile sahip olmalı");
for (const retailName of [
  "ALBİNO BIÇAK BALIĞI","BIÇAK BALIKLARI","DEV TİMSAH BALIKLARI","GÖKKUŞAĞI GOBY","PIPE FISH NEEDLE",
  "PLATİNİUM HALF BEAK CÜCE ZARGANA","PUFFER BALIKLARI","Rasbora","BLACK TİGER BADİS DARİO FİSH",
  "RED BELLY TETRA","REED KİTTY TETRA","TATLI SU DİL BALIKLARI","CHALLENGERLAR","ÇİN EJDERİ",
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
  ["BUTTERFLY FISH"],
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
  ["BLACK TİGER BADİS DARİO FİSH"],
  ["COLOMBİA TETRA", "colombian-tetra"],
  ["DWARF İNDİAN PUFFER", "pea-puffer"],
  ["EİGHT BANDED BARB", "eight-banded-false-barb"],
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
  ["ÇİN EJDERİ"],
  ["DRAGONE FİSH"],
  ["FAHAKA PUFFER", "fahaka-puffer"],
  ["ODUN PENGASUS BALIKLARI"],
  ["PAKİSTAN LOACH BALIKLARI", "yoyo-loach"],
  ["PEACOCK GOBY", "peacock-gudgeon"],
  ["PURPLE SPOTTED GUDGEON MOGURNDA BALIĞI"],
  ["RASBORA MERAH BORARAS BALIKLARI", "phoenix-rasbora"],
  ["RED PACU PİRANHA BALIKLARI", "red-bellied-pacu"],
  ["RED TAİLED HEMİODUS"],
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

const cikletistArowanaInventory = [
  ["AFRİKAN AROWANA"],
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
assert.equal(silverArowana.verifiedAt, "2026-08-28", "Gümüş arowana güncel doğrulama tarihini taşımalı");
assert(silverArowana.sourceUrl?.includes("fishbase.se"), "Gümüş arowana bilimsel ana kaynağa bağlanmalı");
assert((silverArowana.additionalSourceUrls?.length || 0) >= 3, "Gümüş arowana bakım eşikleri bağımsız güvenilir kaynaklarla doğrulanmalı");
assert.equal(silverArowana.predatory, true, "Gümüş arowana avcılık uyarısını taşımalı");
assert.equal(silverArowana.speciesOnly, true, "Gümüş arowana sıradan topluluk akvaryumuna önerilmemeli");
assert(silverArowana.husbandryCaution?.includes("kapak"), "Gümüş arowana sıçrama ve kapak güvenliğini açıklamalı");
assert.equal(speciesForLivestock({commonName:"AFRİKAN AROWANA",category:"fish",quantity:1}), undefined, "Afrika arowanası güvenilir bakım eşikleri tamamlanmadan tahminle eşleştirilmemeli");

const cikletistCurrentMonsterInventory = [
  ["AFRİKAN AROWANA"],
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
  ["ÇİN EJDERİ"],
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
for (const [id,sourceDomain,extraSourceCount] of [
  ["oscar","fishbase.se",3],
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
  ["ÇİN EJDERİ"],
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
  ["L-148 Total Spotted Pleco"],
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
  ["L-103 CLOWN PLECO"],
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
  ["APİSTOGRAMMA COMMBRAE"],
  ["APİSTOGRAMMA PANDURO", "apisto-panduro"],
  ["APİSTOGRAMMA MENDEZİ SANTA İSABEL RED", "apisto-mendezi"],
  ["APİSTOGRAMMA AGASSİZİ RİO MİUA", "apisto-agassizii"],
  ["APİSTOGRAMMA MACMASTERİ \"RED SHOULDER\"", "apisto-macmasteri"],
  ["OCELLARIS PEACOCK BASS"],
  ["SAJİCA CİKLET", "sajica-cichlid"],
];
assert.equal(cikletistDwarfCichlidInventory.length, 26, "Cikletist Cüce Cikletler kategorisinin iki sayfasındaki 26 satış başlığının tamamı denetlenmeli");
for (const [retailName, expectedId] of cikletistDwarfCichlidInventory) {
  const matched = speciesForLivestock({commonName:retailName,category:"fish",quantity:1});
  if (expectedId) assert.equal(matched?.id, expectedId, `Cüce ciklet sayfasındaki satış adı doğru güvenilir profile bağlanmalı: ${retailName}`);
  else assert.equal(matched, undefined, `Bilimsel kimliği veya güvenli bakım eşiği tamamlanmayan cüce ciklet sayfası adı tahminle eşleştirilmemeli: ${retailName}`);
}

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

const greenNeon = speciesCatalog.find((item) => item.id === "green-neon-tetra");
assert.equal(greenNeon?.minGroup, 10, "Green Neon tetra küçük bir grup yerine güvenli sürü sayısıyla önerilmeli");
assert.equal(greenNeon?.flow, "low", "Green Neon tetra düşük akış gereksinimini taşımalı");
const blackGhost = speciesCatalog.find((item) => item.id === "black-ghost-knifefish");
assert.equal(blackGhost?.minVolumeL, 450, "Yetişkin Black Ghost bıçak balığı küçük akvaryuma önerilmemeli");
assert.equal(blackGhost?.predatory, true, "Black Ghost küçük canlılar için avcı riski taşımalı");
assert((blackGhost?.adultSizeCm || 0) >= 45, "Black Ghost yetişkin boyu yavru satış boyuyla karıştırılmamalı");
for (const [id, minVolumeL, minTankLengthCm, minGroup] of [
  ["tinfoil-barb", 1500, 200, 6],
  ["spotted-silver-dollar", 350, 150, 6],
  ["bala-shark", 680, 180, 6],
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
assert.equal(speciesCatalog.filter((item) => speciesGroup(item) === "cichlid").length, 67, "Cichlid kataloğu doğrulanmış Amerikan, Malawi, cüce ve Tropheus profilleri dahil 67 profil içermeli");
assert.equal(speciesCatalog.filter((item) => speciesGroup(item) === "bottom").length, 64, "Dip balığı kataloğu Ninja woodcat ve doğrulanmış L-numaraları dahil 64 profil içermeli");
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
assert.equal(speciesCatalog.find((item)=>item.id==="panda-loach")?.speciesOnly,true,"Panda Loach akarsu tipi özel kurulum uyarısı taşımalı");
for (const [id, scientificName, minVolumeL, minTankLengthCm, minGroup] of [
  ["winemillers-eartheater", "Geophagus winemilleri", 350, 180, 6],
  ["threadfin-acara", "Acarichthys heckelii", 250, 120, 1],
]) {
  const profile = speciesCatalog.find((item) => item.id === id);
  assert(profile, `${id} Amerikan ciklet kataloğunda bulunmalı`);
  assert.deepEqual(
    [profile.scientificName, profile.minVolumeL, profile.minTankLengthCm, profile.minGroup],
    [scientificName, minVolumeL, minTankLengthCm, minGroup],
    `${id} doğrulanmış kimlik ve alan gereksinimlerini taşımalı`,
  );
  assert.equal(profile.verifiedAt, "2026-08-28", `${id} doğrulama tarihini taşımalı`);
  assert.match(profile.sourceUrl ?? "", /^https:\/\/www\.fishbase\.(?:se|org)\//, `${id} bilimsel kimlik için FishBase kaynağı taşımalı`);
  assert(profile.husbandryCaution, `${id} özel bakım uyarısını taşımalı`);
}
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
const wrestlingHalfbeak = speciesCatalog.find((item) => item.id === "wrestling-halfbeak");
assert.equal(wrestlingHalfbeak?.predatory, true, "Wrestling Halfbeak küçük balık ve yavrular için avlanma riski taşımalı");
assert.equal(wrestlingHalfbeak?.minGroup, 6, "Wrestling Halfbeak tek veya küçük grupla önerilmemeli");
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
assert(speciesCatalog.filter((item) => speciesGroup(item) === "labyrinth").length >= 14, "Labirentli kataloğu yaygın gurami ve Betta türlerini kapsamalı");
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
assert.equal(jingyeEquipment.length, 30, "Jingye doğrulanan filtre, pompa, hava motoru ve bakım portföyü 30 ürün ailesi içermeli");
for (const [model, flow, power] of [["LV-500DX",350,6],["JY-910",500,6],["JY-915",800,12],["JY-925",1600,25],["JY-825",2500,35],["YE-12",210,3],["YE-22",480,5],["CD100",90,1.5],["CD300",120,3]]) {
  const item = jingyeEquipment.find((entry) => entry.model === model);
  assert.equal(item?.ratedFlowLph, flow, `Jingye ${model} doğrulanmış güvenli debiyi taşımalı`);
  assert.equal(item?.powerW, power, `Jingye ${model} doğrulanmış güç değerini taşımalı`);
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
]) {
  const profile = speciesCatalog.find((item) => item.id === id);
  assert(profile, `${id} tatlı su balon balığı kataloğunda bulunmalı`);
  assert.equal(profile.minVolumeL, minVolumeL, `${id} minimum hacmi korunmalı`);
  assert.equal(profile.minTankLengthCm, minTankLengthCm, `${id} minimum tank uzunluğu korunmalı`);
}
assert.equal(speciesCatalog.find((item) => item.id === "congo-puffer")?.speciesOnly, true, "Congo balon balığı tür akvaryumu gerektirmeli");
assert(speciesCatalog.find((item) => item.id === "spotted-congo-puffer")?.communityCaution, "Spotted Congo topluluk riski açıklaması taşımalı");
for (const [id, minVolumeL, minTankLengthCm] of [
  ["african-butterfly-fish", 96, 80],
  ["elephantnose-fish", 680, 150],
  ["rope-fish", 680, 150],
]) {
  const profile = speciesCatalog.find((item) => item.id === id);
  assert(profile?.husbandryCaution, `${id} özel bakım uyarısı taşımalı`);
  assert.equal(profile.minVolumeL, minVolumeL, `${id} minimum hacmi korunmalı`);
  assert.equal(profile.minTankLengthCm, minTankLengthCm, `${id} minimum tank uzunluğu korunmalı`);
}
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

console.log(`Katalog akışı: ${equipmentCategories.length} ekipman kategorisi, ${livestockCategories.length} canlı sınıfı ve ${careProductCatalog.length} bakım ürünü başarıyla doğrulandı.`);
