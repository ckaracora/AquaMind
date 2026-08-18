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

const { equipmentCatalog, speciesCatalog, speciesGroup } = require(path.join(projectRoot, "src/data/catalog.ts"));

assert.equal(
  new Set(equipmentCatalog.map((item) => item.id)).size,
  equipmentCatalog.length,
  "Ekipman kataloğunda yinelenen kimlik bulunmamalı",
);
assert(
  equipmentCatalog.every((item) => /^https:\/\//.test(item.sourceUrl || "")),
  "Her ekipman kaydı doğrulanabilir bir HTTPS kaynak bağlantısı taşımalı",
);

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

const ejet905 = equipmentCatalog.find((entry) => entry.brand === "Ejet" && entry.model === "905F");
assert(ejet905, "Ejet 905F katalogda bulunmalı");
assert.equal(ejet905.ratedFlowLph, 470, "Ejet 905F debisi 1000 L/saat olarak hatalı kaydedilmemeli");
assert.equal(ejet905.powerW, 7, "Ejet 905F güç bilgisi doğrulanmış 7 W olmalı");

const livestockCategories = [...new Set(speciesCatalog.map((item) => item.category))];
assert.equal(
  new Set(speciesCatalog.map((item) => item.id)).size,
  speciesCatalog.length,
  "Canlı kataloğunda yinelenen kimlik bulunmamalı",
);
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

console.log(`Katalog akışı: ${equipmentCategories.length} ekipman kategorisi ve ${livestockCategories.length} canlı sınıfı başarıyla doğrulandı.`);
