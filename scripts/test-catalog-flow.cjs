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
assert.equal(chihiros.find((item) => item.model === "Heater Pro 12/16 mm (EU)")?.recommendedMaxL, 650, "Chihiros Heater Pro resmî 650 L kapasite sınırını taşımalı");
assert.equal(chihiros.find((item) => item.model === "Dosing Pump System (4 Head)")?.category, "other", "Chihiros dozaj sistemi filtre veya ısıtıcı hesabına karışmamalı");
const sharkFourRow23 = equipmentCatalog.find((item) => item.id === "shark-fs-23-4row");
assert.equal(sharkFourRow23?.category, "lighting", "Shark ayrı ölçülü armatür modelleri aydınlatma kategorisinde bulunmalı");
assert.deepEqual(sharkFourRow23?.recommendedTankLengthCm, [30, 35], "Shark 23 cm armatürün doğrulanmış akvaryum uyumu korunmalı");

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
assert.equal(equipmentCatalog.find((entry) => entry.brand === "Regent" && entry.model === "6500")?.adjustableFlow, false, "Güncel Regent 6500 ayar düğmesi varmış gibi gösterilmemeli");
assert.equal(equipmentCatalog.find((entry) => entry.brand === "Regent" && entry.model === "7500")?.adjustableFlow, false, "Güncel Regent 7500 ayar düğmesi varmış gibi gösterilmemeli");
assert.equal(equipmentCatalog.find((entry) => entry.brand === "Regent" && entry.model === "8500")?.adjustableFlow, false, "Güncel Regent 8500 ayar düğmesi varmış gibi gösterilmemeli");
assert.equal(equipmentCatalog.find((entry) => entry.brand === "Regent" && entry.model === "9500")?.adjustableFlow, true, "Regent 9500 akış ayarı korunmalı");

const xlproModels = new Set(equipmentCatalog.filter((entry) => entry.brand === "XLPro").map((entry) => entry.model));
assert.deepEqual(
  xlproModels,
  new Set(["230 Mini", "Mini-500", "500AT Mini", "EX-1000", "EX-1200", "EX-1500"]),
  "XLPro'nun Türkiye'de doğrulanan altı güncel filtre modeli eksiksiz bulunmalı",
);
for (const [model, power, maxL] of [["Mini-500", 6.9, 100], ["EX-1000", 22, 200], ["EX-1200", 28, 280], ["EX-1500", 36, 300]]) {
  const item = equipmentCatalog.find((entry) => entry.brand === "XLPro" && entry.model === model);
  assert.deepEqual([item?.powerW, item?.recommendedMaxL], [power, maxL], `XLPro ${model} doğrulanmış güç ve hacim sınırını taşımalı`);
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

const armaturkModels = new Set(equipmentCatalog.filter((entry) => entry.brand === "Armatürk").map((entry) => entry.model));
assert.equal(armaturkModels.size, 37, "Armatürk güncel tatlı su aydınlatma portföyü 37 ana model içermeli");
for (const model of ["Nano Türk", "Plant Nano20", "Plant Nano25", "Eko 30 cm", "Eko 100 cm", "1030L", "1040L", "1090L", "1500L", "1030H", "2050H", "2200H", "2500H", "Premium 40 cm", "Premium 100 cm", "Fanus ve Beta Kabı Aydınlatma Seti"]) {
  assert(armaturkModels.has(model), `Armatürk ${model} katalogda bulunmalı`);
}

const ejet905 = equipmentCatalog.find((entry) => entry.brand === "Ejet" && entry.model === "905F");
assert(ejet905, "Ejet 905F katalogda bulunmalı");
assert.equal(ejet905.ratedFlowLph, 470, "Ejet 905F debisi 1000 L/saat olarak hatalı kaydedilmemeli");
assert.equal(ejet905.powerW, 7, "Ejet 905F güç bilgisi doğrulanmış 7 W olmalı");
assert.equal(equipmentCatalog.filter((entry) => entry.brand === "Ejet").length, 12, "Ejet'in doğrulanan dış, iç, sünger ve hava motoru portföyü 12 model içermeli");
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

const yikedaEquipment = equipmentCatalog.filter((entry) => entry.brand === "Yikeda");
assert.equal(yikedaEquipment.length, 23, "Yikeda'nın doğrulanmış güncel aydınlatma portföyü 23 seçilebilir model içermeli");
const yikedaModels = new Set(yikedaEquipment.map((entry) => entry.model));
for (const model of ["SD-48A-B", "SD-48A-S", "YKD-6124 Optik LED Beyaz", "YKD-6124 Optik LED Siyah", "YKD-6126 Optik LED Beyaz", "YKD-6126 Optik LED Siyah", "SD-T8-1200JL RGB", "SD-1030 RGB", "SD-1040 RGB", "SD-1045 RGB", "SD-1055 RGB", "TP-3,6WHB Tray Light", "TP-3,6WLB Tray Light", "TP-5,6WHB Tray Light"]) {
  assert(yikedaModels.has(model), `Yikeda ${model} katalogda bulunmalı`);
}
const yikedaSd1045 = yikedaEquipment.find((entry) => entry.model === "SD-1045 RGB");
assert.deepEqual([yikedaSd1045?.powerW, yikedaSd1045?.recommendedTankLengthCm], [45, [80, 90]], "Yikeda SD-1045 güç ve akvaryum uzunluğu korunmalı");
assert(yikedaSd1045?.specifications.includes("3940 lm"), "Yikeda SD-1045 doğrulanmış ışık akısını taşımalı");

const sharkLights = equipmentCatalog.filter((entry) => entry.brand === "Shark");
assert.equal(sharkLights.length, 22, "Shark doğrulanmış aydınlatma seçenekleri tek seri kaydı yerine 22 ayrı model içermeli");
const sharkLightModels = new Set(sharkLights.map((entry) => entry.model));
for (const model of ["Full Spectrum 23 cm / 4 Sıra", "Full Spectrum 33 cm / 4 Sıra", "Full Spectrum 43 cm / 4 Sıra", "Full Spectrum 63 cm / 4 Sıra", "Full Spectrum 83 cm / 4 Sıra", "Full Spectrum 93 cm / 4 Sıra", "Full Spectrum 33 cm / 3 Sıra", "Full Spectrum 73 cm / 3 Sıra", "Full Spectrum 113 cm / 3 Sıra", "Grolux 3 Renk Bar LED 60 cm", "Full Spectrum 4 Renk Bar LED 70 cm", "Beyaz Bar LED 100 cm"]) {
  assert(sharkLightModels.has(model), `Shark ${model} katalogda ayrı seçilebilir olmalı`);
}
assert(!sharkLightModels.has("Full Spectrum 4 Sıra Osram LED (15 uzunluk seçeneği)"), "Shark modelleri tek ve belirsiz seri seçeneğinde birleştirilmemeli");
const sharkFourRow93 = sharkLights.find((entry) => entry.model === "Full Spectrum 93 cm / 4 Sıra");
assert.deepEqual([sharkFourRow93?.recommendedTankLengthCm, sharkFourRow93?.specifications.includes("5940 lm")], [[100, 105], true], "Shark 93 cm dört sıra modelinin doğrulanmış ölçü ve ışık akısı korunmalı");

const netlea530 = equipmentCatalog.find((entry) => entry.brand === "Netlea" && entry.model === "530S-AT5");
assert.equal(netlea530?.powerW, 35, "Netlea 530S-AT5 doğrulanmış 35 W bilgisini taşımalı");
assert.deepEqual(netlea530?.recommendedTankLengthCm, [30, 40], "Netlea 530S-AT5 30–40 cm akvaryum aralığını taşımalı");
assert(netlea530?.sourceUrl.includes("530s-at5-rgb-35w"), "Netlea 530S-AT5 doğrudan yerel ürün kaynağına bağlanmalı");

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
for (const [model, flow, power] of [["WP-850F", 400, 4], ["WP-330F", 800, 12]]) {
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
assert.equal(boyuSes10?.ratedFlowLph, undefined, "Boyu SES-10 hava debisi yalnızca güç değerinden tahmin edilmemeli");
assert.match(boyuSes10?.capacityDataNote || "", /yayımlanmamış/, "Boyu SES-10 kapasite boşluğu kullanıcıya açıklanmalı");
for (const [model, flow, power] of [["XFP-1000", 1000, 15], ["XFP-1500", 1500, 23]]) {
  const item = equipmentCatalog.find((entry) => entry.brand === "Boyu" && entry.model === model);
  assert.deepEqual([item?.category, item?.ratedFlowLph, item?.powerW], ["other", flow, power], `Boyu ${model} sump pompası filtre hesabına karışmadan teknik verileri taşımalı`);
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

for (const model of ["EASY-1000AT", "Aqua Flow 250"]) {
  const item = equipmentCatalog.find((entry) => entry.brand === "Haqos" && entry.model === model);
  assert(item, `Haqos ${model} resmî ürün kataloğunda bulunduğu için katalogda yer almalı`);
  assert.equal(item.category, "filter", `Haqos ${model} filtre kategorisinde bulunmalı`);
  assert.equal(item.ratedFlowLph, undefined, `Haqos ${model} debisi benzer model kodlarından türetilmemeli`);
  assert.equal(item.powerW, undefined, `Haqos ${model} gücü doğrulanmadan katalogda kullanılmamalı`);
  assert(item.capacityDataNote?.includes("otomatik kapasite hesabına katılmaz"), `Haqos ${model} eksik teknik veri nedeniyle kapasite hesabından açıkça dışlanmalı`);
}

for (const model of ["NW-450F", "NW-600F", "NW-800F", "NW-1500F", "NB-1500F", "YU-118C", "YU-119C"]) {
  const item = equipmentCatalog.find((entry) => entry.brand === "Nubios" && entry.model === model);
  assert(item, `Nubios ${model} katalogda bulunmalı`);
  assert.equal(item.category, "filter", `Nubios ${model} filtre kategorisinde bulunmalı`);
  assert.equal(item.ratedFlowLph, undefined, `Nubios ${model} debisi doğrudan ürün kaynağı olmadan tahmin edilmemeli`);
  assert(item.capacityDataNote?.includes("otomatik filtrasyon hesabına katılmaz"), `Nubios ${model} yayımlanmamış debi nedeniyle kapasite hesabından açıkça dışlanmalı`);
}
assert.equal(equipmentCatalog.find((entry) => entry.id === "nubios-ch-729")?.ratedFlowLph, 520, "Nubios elektrikli dip süpürgesi doğrulanmış 520 L/saat pompa debisini taşımalı");
const waterBearG220 = equipmentCatalog.find((entry) => entry.brand === "WaterBear" && entry.model === "WB-G220");
assert.deepEqual([waterBearG220?.ratedFlowLph, waterBearG220?.powerW, waterBearG220?.adjustableFlow], [500, 8, true], "WaterBear WB-G220 Türkiye varyantının doğrulanmış teknik değerlerini taşımalı");
assert(waterBearG220?.sourceUrl.includes("aquarubi.com/waterbear-wb-g220"), "WaterBear WB-G220 ilgisiz Eurogold kategori sayfasına bağlanmamalı");

const aquaproInlet12 = equipmentCatalog.find((entry) => entry.id === "aquapro-inlet-strainer-12");
const aquaproInlet16 = equipmentCatalog.find((entry) => entry.id === "aquapro-inlet-strainer-16");
assert(aquaproInlet12?.sourceUrl.includes("aquapro-inlet-12mm-emis-suzgec-6975017512225"), "Aquapro 12 mm emiş süzgeci kendi ürün sayfasına bağlanmalı");
assert(aquaproInlet16?.sourceUrl.includes("aquapro-inlet-emis-borusu-suzgeci-16mm"), "Aquapro 16 mm emiş süzgeci kendi ürün sayfasına bağlanmalı");
assert.notEqual(aquaproInlet12?.sourceUrl, aquaproInlet16?.sourceUrl, "Aquapro 12 ve 16 mm varyantları aynı kaynak sayfasını paylaşmamalı");
for (const [model, flow, volume] of [["Nano Easy Tank 4,5 L", 180, 4.5], ["Masaüstü Akvaryum Seti 12 L", 250, 12], ["Masaüstü Akvaryum Seti Fanus 12 L", 150, 12]]) {
  const set = equipmentCatalog.find((entry) => entry.brand === "Nubios" && entry.model === model);
  assert.deepEqual([set?.category, set?.ratedFlowLph, set?.recommendedMaxL], ["other", flow, volume], `Nubios ${model} entegre sistem verilerini taşımalı`);
  assert(set?.sourceUrl.includes("aquarubi.com"), `Nubios ${model} güncel yerel ürün kaynağına bağlanmalı`);
}
const nubiosModels = new Set(equipmentCatalog.filter((entry) => entry.brand === "Nubios").map((entry) => entry.model));
for (const model of ["NB-150 Betta Habitat Nano Tank", "Şeffaf Dış Filtre Hortumu 12/16 mm 1 m", "Şeffaf Dış Filtre Hortumu 16/22 mm 1 m", "Dış Filtre Hortumu 12/16 mm 10 m", "Dış Filtre Hortumu 16/22 mm 10 m", "Pompalı Dip Sifonu Küçük", "Pompalı Vanalı Dip Sifonu Büyük"]) {
  assert(nubiosModels.has(model), `Nubios ${model} güncel Türkiye portföyünde bulunduğu için katalogda yer almalı`);
}
assert(equipmentCatalog.filter((entry) => entry.brand === "Nubios").length >= 33, "Nubios tek tük filtre örneğiyle sınırlı kalmamalı");

const mufanModels = new Set(equipmentCatalog.filter((entry) => entry.brand === "Mufan").map((entry) => entry.model));
for (const way of [2, 3, 4, 5, 6]) {
  assert(mufanModels.has(`CO₂ Splitter ${way} Yollu`), `Mufan ${way} yollu CO₂ dağıtıcı katalogda bulunmalı`);
}
assert(mufanModels.has("Inline CO₂ Diffuser 12/16 mm"), "Mufan 12/16 mm hat içi difüzör katalogda bulunmalı");
assert(mufanModels.has("Inline CO₂ Diffuser 16/22 mm"), "Mufan 16/22 mm hat içi difüzör katalogda bulunmalı");
assert.equal(mufanModels.size, 24, "Mufan doğrulanan CO₂ ve bakım ekipmanları 24 ürün ailesi içermeli");
for (const model of ["Akrilik Boru Tutucu Aparat", "Sis Makinesi", "Paslanmaz Çelik Emiş Süzgeci 12 mm", "Paslanmaz Çelik Emiş Süzgeci 16 mm", "Akvaryum Bitki Budama Seti 6'lı", "Refraktometre Tuz Ölçer"]) {
  assert(mufanModels.has(model), `Mufan ${model} ekipman kataloğunda bulunmalı`);
}
const mufanMedia = careProductCatalog.filter((item) => item.brand === "Mufan" && item.category === "filter_media");
assert.equal(mufanMedia.length, 4, "Mufan altı katmanlı filtre süngerinin dört doğrulanmış ölçüsü bulunmalı");
assert(mufanMedia.every((item) => item.description.includes("kalınlık belirtilmedi")), "Mufan filtre süngerlerinde çelişkili kalınlık değeri kesin bilgi gibi sunulmamalı");

const tropicaEquipment = equipmentCatalog.filter((entry) => entry.brand === "Tropica");
assert.equal(tropicaEquipment.length, 8, "Tropica'nın resmî CO₂ ve bakım aleti serisi eksiksiz bulunmalı");
assert(
  tropicaEquipment.filter((entry) => entry.category === "co2").length === 5,
  "Tropica CO₂ sistemleri yalnızca CO₂ kategorisinde bulunmalı",
);
const tropicaBio = tropicaEquipment.find((entry) => entry.model === "CO₂ System Bio");
assert.equal(tropicaBio?.recommendedMaxL, 60, "Tropica CO₂ System Bio hacim sınırı 60 litre olmalı");

const twinstarEquipment = equipmentCatalog.filter((entry) => entry.brand === "Twinstar");
assert.equal(twinstarEquipment.length, 25, "Twinstar güncel S/E/B serileri ile önceki B Line modelleri birlikte 25 kayıt içermeli");
for (const [model,power,lumenText,min,max] of [["E-Line IV 200EA",13,"900 lm",20,25],["E-Line IV 750EA",60,"3700 lm",80,90],["E-Line IV 1200EA",79,"4600 lm",110,120],["B Line 2025 20B",10,"750 lm",20,25],["B Line 2025 75B",39,"3200 lm",75,80],["B Line 2025 120B",52,"4100 lm",110,120]]) {
  const item = twinstarEquipment.find((entry) => entry.model === model);
  assert.equal(item?.powerW, power, `Twinstar ${model} güncel resmî güç değerini taşımalı`);
  assert(item?.specifications.includes(lumenText), `Twinstar ${model} güncel resmî lümen değerini taşımalı`);
  assert.deepEqual(item?.recommendedTankLengthCm, [min,max], `Twinstar ${model} güncel akvaryum uzunluğu aralığını taşımalı`);
}
assert.equal(twinstarEquipment.filter((entry) => entry.model.startsWith("B Line Legacy")).length, 5, "Önceki nesil Twinstar B Line cihazları yanlışlıkla güncel seri gibi sunulmamalı");

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
assert.equal(speciesCatalog.filter((item) => speciesGroup(item) === "shrimp").length, 19, "Karides kataloğu yaygın tür ve renk varyeteleriyle 19 kayıt içermeli");
assert.equal(speciesCatalog.filter((item) => speciesGroup(item) === "snail").length, 10, "Salyangoz kataloğu yaygın tatlı su türleriyle 10 kayıt içermeli");
for (const id of ["blue-dream-shrimp", "yellow-fire-shrimp", "orange-sakura-shrimp", "green-jade-shrimp", "bloody-mary-shrimp"]) {
  const item = speciesCatalog.find((entry) => entry.id === id);
  assert.equal(item?.scientificName, "Neocaridina davidi", `${id} renk varyetesi doğru biyolojik türü kullanmalı`);
  assert.deepEqual(item?.temperature, [18, 28], `${id} Neocaridina bakım aralığını paylaşmalı`);
}
const cardinalSulawesi = speciesCatalog.find((item) => item.id === "cardinal-sulawesi-shrimp");
assert.deepEqual(cardinalSulawesi?.temperature, [27, 29], "Cardinal Sulawesi karides serin Caridina koşullarına önerilmemeli");
assert((cardinalSulawesi?.ph[0] || 0) >= 7.8, "Cardinal Sulawesi karides asidik Caridina koşullarına önerilmemeli");
assert.equal(speciesCatalog.find((item) => item.id === "pagoda-snail")?.flow, "medium", "Pagoda salyangoz oksijenli ve akıntılı su gereksinimini taşımalı");
assert(speciesCatalog.find((item) => item.id === "guppy")?.aliases?.includes("Moscow Blue"), "Lepistes yaygın mağaza varyeteleriyle aranabilmeli");
assert(speciesCatalog.find((item) => item.id === "betta")?.aliases?.includes("Halfmoon"), "Betta yüzgeç formları ana biyolojik profile bağlanmalı");
assert(speciesCatalog.find((item) => item.id === "angelfish")?.aliases?.includes("Koi melek"), "Melek balığı renk varyeteleri katalog aramasında bulunmalı");
assert(speciesCatalog.find((item) => item.id === "ancistrus")?.aliases?.includes("Albino cüce vatoz"), "Yaygın Ancistrus varyeteleri ana bakım profiliyle aranabilmeli");
assert(speciesCatalog.find((item) => item.id === "goldfish")?.aliases?.includes("Oranda"), "Yaygın süslü Japon balığı formları katalog aramasında bulunmalı");
assert.equal(speciesForLivestock({commonName:"Halfmoon",category:"fish",quantity:1})?.id, "betta", "Kimliksiz eski varyete kaydı ana Betta sağlık profiline bağlanmalı");
assert.equal(speciesForLivestock({commonName:"Albino cüce vatoz",category:"fish",quantity:1})?.id, "ancistrus", "Kimliksiz eski Ancistrus varyetesi sağlık analizinden düşmemeli");

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
assert.equal(dennerleCare.length, 30, "Dennerle'nin doğrulanan güncel bakım ürünleri eksiksiz bulunmalı");
const dennerleCategory = (model) => dennerleCare.find((item) => item.model === model)?.category;
assert.equal(dennerleCategory("Shrimp King Baby"), "food", "Shrimp King Baby yem kategorisinde bulunmalı");
assert.equal(dennerleCategory("Shrimp King SnailStixx"), "food", "SnailStixx yem kategorisinde bulunmalı");
assert.equal(dennerleCategory("Plant Care K"), "fertilizer", "Plant Care K gübre kategorisinde bulunmalı");
assert.equal(dennerleCategory("Plant System Set"), "fertilizer", "Plant System Set gübre kategorisinde bulunmalı");
assert.equal(dennerleCategory("Shrimp King Active Soil"), "substrate", "Shrimp King Active Soil taban kategorisinde bulunmalı");
assert.equal(dennerleCategory("NutriBasis"), "substrate", "NutriBasis taban kategorisinde bulunmalı");

const adaCare = careProductCatalog.filter((item) => item.brand === "ADA");
assert.equal(adaCare.length, 36, "ADA'nın resmî Nature Aquarium bakım portföyü eksiksiz bulunmalı");
const adaCategory = (model) => adaCare.find((item) => item.model === model)?.category;
assert.equal(adaCategory("Green Bacter Plus"), "bacteria", "ADA Green Bacter Plus bakteri kategorisinde bulunmalı");
assert.equal(adaCategory("Phyton Git Sol"), "treatment", "ADA Phyton Git Sol tedavi kategorisinde bulunmalı");
assert.equal(adaCategory("Clear Water"), "water_conditioner", "ADA Clear Water su düzenleyici kategorisinde bulunmalı");
assert.equal(adaCategory("Aqua Soil Amazonia Pro"), "substrate", "ADA Amazonia Pro taban kategorisinde bulunmalı");
assert.equal(adaCategory("Power Sand Advance L"), "substrate", "ADA Power Sand Advance L taban kategorisinde bulunmalı");
assert.equal(adaCategory("Bacter 100"), "substrate", "ADA Bacter 100 taban katkısı kategorisinde bulunmalı");
assert.equal(adaCategory("Pack Checker NH4"), "test", "ADA NH4 Pack Checker test kategorisinde bulunmalı");
assert.equal(adaCare.filter((item) => item.category === "test").length, 8, "ADA Pack Checker test serisi eksiksiz bulunmalı");

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
  assert(profile.sourceUrl?.includes("fishkeeper.co.uk/fish/freshwater/cichlids"), `${id} türe özel bakım kaynağı taşımalı`);
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
