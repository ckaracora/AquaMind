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

const { catalogBrandCoverage } = require(path.join(projectRoot, "src/data/catalog-coverage.ts"));
const { equipmentCatalog, speciesCatalog, speciesGroup } = require(path.join(projectRoot, "src/data/catalog.ts"));

const normalized = (value) => value
  .normalize("NFKD")
  .replace(/[ıİ]/g, "i")
  .replace(/[şŞ]/g, "s")
  .replace(/[ğĞ]/g, "g")
  .replace(/[üÜ]/g, "u")
  .replace(/[öÖ]/g, "o")
  .replace(/[çÇ]/g, "c")
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "");

const rows = catalogBrandCoverage.map((coverage) => {
  const equipment = equipmentCatalog.filter((item) => normalized(item.brand) === normalized(coverage.brand));
  const capacityEquipment = equipment.filter((item) => ["filter", "heater", "air_pump"].includes(item.category));
  const technicalCount = capacityEquipment.filter((item) => {
    if (item.category === "heater") return item.powerW != null || item.recommendedMaxL != null;
    if (item.category === "filter" && item.requiresAirPump) return true;
    return item.ratedFlowLph != null || item.recommendedMaxL != null;
  }).length;
  const categoryCount = new Set(equipment.map((item) => item.category)).size;
  return {
    marka: coverage.brand,
    ekipman: coverage.equipmentCount,
    urun: coverage.careProductCount,
    kategori: categoryCount,
    kapasiteGereken: capacityEquipment.length,
    kapasiteHazir: technicalCount,
    kapasiteOran: capacityEquipment.length ? `${Math.round(technicalCount / capacityEquipment.length * 100)}%` : "—",
  };
});

rows.sort((a, b) => (a.ekipman + a.urun) - (b.ekipman + b.urun) || a.marka.localeCompare(b.marka, "tr"));
console.table(rows);

const missingCapacityRows = equipmentCatalog
  .filter((item) => ["filter", "heater", "air_pump"].includes(item.category))
  .filter((item) => {
    if (item.category === "heater") return item.powerW == null && item.recommendedMaxL == null;
    if (item.category === "filter" && item.requiresAirPump) return false;
    return item.ratedFlowLph == null && item.recommendedMaxL == null;
  })
  .map((item) => ({ id: item.id, marka: item.brand, kategori: item.category, model: item.model, durum: item.capacityDataNote ? "kaynakta yayımlanmamış" : "açıklanmamış" }));

if (missingCapacityRows.length) console.table(missingCapacityRows);
const unexplainedCapacityRows = missingCapacityRows.filter((item) => item.durum === "açıklanmamış");
if (unexplainedCapacityRows.length) throw new Error(`Açıklanmamış kapasite boşlukları: ${unexplainedCapacityRows.map((item) => item.id).join(", ")}`);

const emptyBrands = rows.filter((row) => row.ekipman + row.urun === 0);
if (emptyBrands.length) {
  throw new Error(`Boş katalog markaları: ${emptyBrands.map((row) => row.marka).join(", ")}`);
}

const speciesRows = [...new Set(speciesCatalog.map(speciesGroup))]
  .map((group) => {
    const species = speciesCatalog.filter((item) => speciesGroup(item) === group);
    return {
      grup: group,
      tur: species.length,
      kaynakli: species.filter((item) => item.sourceUrl && item.verifiedAt).length,
      bakimVerisiTam: species.filter((item) =>
        item.adultSizeCm > 0 && item.minVolumeL > 0 && item.minTankLengthCm > 0 && item.minGroup > 0
        && item.temperature?.length === 2 && item.ph?.length === 2 && item.wasteFactor > 0
      ).length,
    };
  })
  .sort((a, b) => b.tur - a.tur || a.grup.localeCompare(b.grup));

console.table(speciesRows);

const requiredSpeciesGroups = ["livebearer", "tetra", "rasbora", "danio", "barb", "rainbowfish", "killifish", "cichlid", "labyrinth", "bottom", "goby", "puffer", "monster", "coldwater", "shrimp", "snail", "crayfish"];
const missingSpeciesGroups = requiredSpeciesGroups.filter((group) => !speciesRows.some((row) => row.grup === group && row.tur > 0));
const incompleteSpecies = speciesCatalog.filter((item) =>
  !item.sourceUrl || !item.verifiedAt || item.adultSizeCm <= 0 || item.minVolumeL <= 0
  || item.minTankLengthCm <= 0 || item.minGroup <= 0 || item.temperature?.length !== 2
  || item.ph?.length !== 2 || item.wasteFactor <= 0
);

if (missingSpeciesGroups.length) throw new Error(`Boş canlı grupları: ${missingSpeciesGroups.join(", ")}`);
if (incompleteSpecies.length) throw new Error(`Eksik canlı bakım profilleri: ${incompleteSpecies.map((item) => item.id).join(", ")}`);
