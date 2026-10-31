// Katalog çeviri tablolarını üretir (docs/DECISIONS/0021-dil-altyapisi.md, 4. paket). Kaynak, gözden geçirilen JSON dosyasıdır
// (`packages/localization/translations/<dil>-species.json`: anahtar, alanlar, Türkçe metin, dilin kodu adındaki alanda çeviri, adlarda yöntem
// ve kaynak); uygulamaya
// giren tablo yalnız anahtar → çeviri tutar (`packages/localization/src/messages/<dil>-catalog-species.ts`).
// Kullanım:
//   node scripts/catalog-translations.cjs           tabloları yazar
//   node scripts/catalog-translations.cjs --check   tablo kaynağıyla aynı değilse ya da bir anahtar Türkçe metne uymuyorsa çıkış kodu 1
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");

const root = path.resolve(__dirname, "..");
const pkg = path.join(root, "packages/localization");
// Paketin TypeScript dosyalarını (ve göreli içe aktarmalarını) derlemeden yükler.
const load = (file) => {
  const output = ts.transpileModule(fs.readFileSync(file, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const module = { exports: {} };
  const localRequire = (request) => (request.startsWith(".") ? load(path.resolve(path.dirname(file), `${request}.ts`)) : require(request));
  new Function("module", "exports", "require", output)(module, module.exports, localRequire);
  return module.exports;
};
const { catalogTextKey } = load(path.join(pkg, "src/catalog.ts"));

const TABLES = [
  { locale: "en", source: "translations/en-species.json", target: "src/messages/en-catalog-species.ts", name: "enCatalogSpecies" },
  { locale: "es", source: "translations/es-species.json", target: "src/messages/es-catalog-species.ts", name: "esCatalogSpecies" },
];

function render({ locale, source, name }, entries) {
  const lines = entries.map((entry) => `  ${JSON.stringify(entry.key)}: ${JSON.stringify(entry[locale])},`);
  return [
    `// Bu dosya üretilir: node scripts/catalog-translations.cjs (kaynak packages/localization/${source}). Elle düzenlemeyin.`,
    `import type { CatalogTexts } from "../catalog";`,
    ``,
    `export const ${name}: CatalogTexts = {`,
    ...lines,
    `};`,
    ``,
  ].join("\n");
}

const check = process.argv.includes("--check");
let failed = false;
for (const table of TABLES) {
  const entries = JSON.parse(fs.readFileSync(path.join(pkg, table.source), "utf8"));
  for (const entry of entries) {
    if (catalogTextKey(entry.tr) !== entry.key) {
      console.error(`${table.source}: anahtar Türkçe metne uymuyor: ${entry.key} (${entry.tr.slice(0, 60)})`);
      failed = true;
    }
  }
  const text = render(table, entries);
  const target = path.join(pkg, table.target);
  if (check) {
    const current = fs.existsSync(target) ? fs.readFileSync(target, "utf8").replace(/\r\n/g, "\n") : "";
    if (current !== text) {
      console.error(`${table.target} kaynağıyla aynı değil; node scripts/catalog-translations.cjs ile yeniden üretin.`);
      failed = true;
    }
  } else {
    fs.writeFileSync(target, text);
    console.log(`${table.target}: ${entries.length} çeviri`);
  }
}
process.exit(failed ? 1 : 0);
