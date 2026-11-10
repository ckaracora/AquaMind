// Veri kapsamı raporu (docs/DATA_COVERAGE.md). Katalogları TypeScript kaynağından okur ve src/lib/data-coverage.ts ile hesaplar.
// Kullanım:
//   node scripts/data-coverage.cjs                 belgenin güncel tablosunu bugünün tarihiyle yazar (belgeye elle aktarılır)
//   node scripts/data-coverage.cjs 2026-10-28      verilen ölçüm tarihiyle
//   node scripts/data-coverage.cjs --json <dosya>  ayrıca raporu ve katalog satırlarını JSON olarak yazar (ürün sahibinin veri sayfası için)
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

const load = (file) => require(path.join(projectRoot, file));
const { speciesCatalog, generatedSourceSpeciesIds } = load("src/data/catalog-species.ts");
const { equipmentCatalog } = load("src/data/catalog-equipment.ts");
const { unverifiedEquipmentIds } = load("src/data/catalog-equipment-unverified.ts");
const { careProductCatalog } = load("src/data/care-product-catalog.ts");
const { plantCatalog } = load("src/data/catalog-plants.ts");
const { dataCoverage, coverageMarkdown, parseCoverageArgs } = load("src/lib/data-coverage.ts");

// Argümanlar src/lib/data-coverage.ts → parseCoverageArgs; hatalı argümanda açıklayıcı hata ve çıkış kodu 1. Tarih verilmezse bilgisayarın yerel günü.
const now = new Date();
const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
const parsed = parseCoverageArgs(process.argv.slice(2), today);
if ("error" in parsed) { console.error(parsed.error); process.exit(1); }
const { measuredOn, jsonPath } = parsed;

const input = { species: speciesCatalog, generatedSourceSpeciesIds, equipment: equipmentCatalog, unverifiedEquipmentIds, care: careProductCatalog, plants: plantCatalog };
const report = dataCoverage(input, measuredOn);
console.log(coverageMarkdown(report));

if (jsonPath) {
  // Veri sayfası için katalog satırları: yalnız gösterilecek alanlar.
  const rows = {
    species: speciesCatalog.map(({ id, commonName, scientificName, category, temperature, ph, adultSizeCm, minVolumeL, sourceUrl, verifiedAt }) => ({ id, commonName, scientificName, category, temperature, ph, adultSizeCm, minVolumeL, sourceUrl, verifiedAt })),
    equipment: equipmentCatalog.map(({ id, category, brand, model, ratedFlowLph, powerW, recommendedMinL, recommendedMaxL, sourceUrl, verifiedAt }) => ({ id, category, brand, model, ratedFlowLph, powerW, recommendedMinL, recommendedMaxL, sourceUrl, verifiedAt, unverified: unverifiedEquipmentIds.includes(id) })),
    care: careProductCatalog.map(({ id, category, brand, model, volumeL, sourceUrl, verifiedAt }) => ({ id, category, brand, model, volumeL, sourceUrl, verifiedAt })),
    plants: plantCatalog.map(({ id, scientificName, aliases, light, co2, growth, heightCm, temperature, ph, placements, invasiveListings, notAquatic, warningOnly, sourceUrl, verifiedAt }) => ({ id, scientificName, aliases, light, co2, growth, heightCm, temperature, ph, placements, invasive: Boolean(invasiveListings?.length), notAquatic: Boolean(notAquatic), warningOnly: Boolean(warningOnly), sourceUrl, verifiedAt })),
  };
  fs.writeFileSync(jsonPath, `${JSON.stringify({ report, rows })}\n`, "utf8");
}
