const assert = require("node:assert/strict");
const path = require("node:path");
const fs = require("node:fs");
const Module = require("node:module");
const ts = require("typescript");

const projectRoot = path.resolve(__dirname, "..");
const originalResolveFilename = Module._resolveFilename;
Module._resolveFilename = function resolveAquaMindAlias(request, parent, isMain, options) {
  const resolvedRequest = request.startsWith("@/")
    ? path.join(projectRoot, "src", request.slice(2))
    : request;
  return originalResolveFilename.call(this, resolvedRequest, parent, isMain, options);
};
require.extensions[".ts"] = function compileTypeScript(module, filename) {
  const source = fs.readFileSync(filename, "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
    fileName: filename,
  });
  module._compile(output.outputText, filename);
};

const { analyzeAquarium } = require("../src/lib/health-analysis.ts");

const aquarium = (overrides = {}) => ({
  id: "test-aquarium",
  name: "Test",
  type: "freshwater",
  lengthCm: 60,
  widthCm: 35,
  heightCm: 40,
  netVolumeLiters: 70,
  setupDate: "2026-01-01",
  ...overrides,
});
const animal = (catalogId, commonName, quantity = 1) => ({
  id: `animal-${catalogId}`,
  aquariumId: "test-aquarium",
  catalogId,
  commonName,
  category: "fish",
  quantity,
  addedAt: "2026-01-01",
});
const device = (catalogId, category, brand, model) => ({
  id: `device-${catalogId}`,
  aquariumId: "test-aquarium",
  catalogId,
  category,
  brand,
  model,
  installedAt: "2026-01-01",
});
const warningTitles = analysis => analysis.warnings.map(item => item.title);
const metric = (analysis, key) => analysis.metrics.find(item => item.key === key);

{
  const analysis = analyzeAquarium(
    aquarium(),
    [animal("neon-tetra", "Neon tetra", 8)],
    [
      device("aquael-pat-mini", "filter", "Aquael", "PAT Mini"),
      device("aquael-ultra-75", "heater", "Aquael", "Ultra Heater 75 W"),
    ],
    { id: "water-1", aquariumId: "test-aquarium", measuredAt: "2026-01-02", temperature: 25, ph: 7 },
  );
  assert.equal(metric(analysis, "confidence").score, 100, "Tam katalog verisi %100 güven vermeli");
  assert(!warningTitles(analysis).includes("Filtre akışı güçlü olabilir"));
  assert(!warningTitles(analysis).includes("Isıtıcı hacimle eşleşmiyor"));
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 25, lengthCm: 40 }),
    [animal("betta", "Beta balığı")],
    [device("oase-biomaster-350", "filter", "Oase", "BioMaster 350")],
  );
  assert(warningTitles(analysis).includes("Filtre akışı güçlü olabilir"), "Aşırı filtre debisi uyarılmalı");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 180, lengthCm: 100 }),
    [animal("neon-tetra", "Neon tetra", 8)],
    [device("eheim-thermo-50", "heater", "Eheim", "Thermocontrol 50 W")],
  );
  assert(warningTitles(analysis).includes("Isıtıcı hacimle eşleşmiyor"), "Küçük ısıtıcı uyarılmalı");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 100, lengthCm: 80 }),
    [animal("neon-tetra", "Neon tetra", 8)],
    [device("jeneca-lt-300", "filter", "Jeneca", "LT-300")],
  );
  assert(warningTitles(analysis).includes("Ekipman kapasite bilgisi eksik"));
  assert(metric(analysis, "confidence").score < 100, "Debisi bilinmeyen filtre tam güven vermemeli");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 400, lengthCm: 150 }),
    [animal("oscar", "Astronot"), animal("neon-tetra", "Neon tetra", 8)],
    [],
  );
  assert(warningTitles(analysis).includes("Neon tetra için avlanma riski"), "Yırtıcı-küçük tür eşleşmesi uyarılmalı");
  assert.equal(metric(analysis, "compatibility").status, "danger");
}

{
  const analysis = analyzeAquarium(
    aquarium(),
    [animal("neon-tetra", "Neon tetra", 8)],
    [device("unknown-filter", "filter", "Bilinmeyen", "X")],
  );
  assert(warningTitles(analysis).includes("Katalogla eşleşmeyen ekipman kaydı var"));
  assert(metric(analysis, "confidence").score < 100, "Eşleşmeyen filtre güven puanını düşürmeli");
}

console.log("Sağlık analizi: 6 senaryo başarıyla doğrulandı.");
