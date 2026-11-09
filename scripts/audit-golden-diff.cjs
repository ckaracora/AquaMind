const fs = require("node:fs");
const Module = require("node:module");
const path = require("node:path");
const ts = require("typescript");

const projectRoot = path.resolve(__dirname, "..");
const originalResolveFilename = Module._resolveFilename;

Module._resolveFilename = function resolveTypeScriptImports(request, parent, ...rest) {
  if (request.startsWith("@/")) {
    const candidate = path.join(projectRoot, "src", request.slice(2));
    if (fs.existsSync(`${candidate}.ts`)) return originalResolveFilename.call(this, `${candidate}.ts`, parent, ...rest);
    if (fs.existsSync(`${candidate}.tsx`)) return originalResolveFilename.call(this, `${candidate}.tsx`, parent, ...rest);
  }
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
      jsx: ts.JsxEmit.ReactJSX,
    },
    fileName: filename,
  }).outputText;
  module._compile(output, filename);
};

const { analyzeAquarium } = require(path.join(projectRoot, "src/lib/health-analysis.ts"));
const { buildGoldenCases } = require(path.join(projectRoot, "packages/compatibility-engine/test/fixtures/golden-cases.ts"));
const fixturePath = path.join(projectRoot, "packages/compatibility-engine/test/fixtures/golden-v1.json");

const expected = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
const current = buildGoldenCases().map((testCase) => ({
  name: testCase.name,
  result: JSON.parse(JSON.stringify(analyzeAquarium(...testCase.args))),
}));
const expectedByName = new Map(expected.map((record) => [record.name, record.result]));
const currentByName = new Map(current.map((record) => [record.name, record.result]));
const added = current.filter((record) => !expectedByName.has(record.name)).map((record) => record.name);
const removed = expected.filter((record) => !currentByName.has(record.name)).map((record) => record.name);
const changed = current.filter((record) => {
  const previous = expectedByName.get(record.name);
  return previous !== undefined && JSON.stringify(previous) !== JSON.stringify(record.result);
});
const warningCodes = (result) => (result.warnings ?? []).map((warning) => warning.code).sort();
const scoreChanged = changed.filter((record) => expectedByName.get(record.name)?.score !== record.result.score);
const statusChanged = changed.filter((record) => expectedByName.get(record.name)?.status !== record.result.status);
const warningCodesChanged = changed.filter((record) =>
  JSON.stringify(warningCodes(expectedByName.get(record.name))) !== JSON.stringify(warningCodes(record.result)));

console.table({
  recordedCases: expected.length,
  currentCases: current.length,
  added: added.length,
  removed: removed.length,
  changedCommon: changed.length,
  scoreChanged: scoreChanged.length,
  statusChanged: statusChanged.length,
  warningCodesChanged: warningCodesChanged.length,
});
if (statusChanged.length) {
  console.table(statusChanged.map((record) => ({
    name: record.name,
    previous: expectedByName.get(record.name)?.status,
    current: record.result.status,
  })));
}

process.exitCode = 0;
