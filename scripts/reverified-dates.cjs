// Yeniden doğrulama tablosunun (src/data/catalog-reverified.ts) adressiz kopyasını üretir: catalog-reverified-equipment-dates.ts ve
// catalog-reverified-care-dates.ts. Katalog tarayıcıda yalnız kimlik ve okuma gününü yükler; adresler tabloda, testte ve denetimde kalır
// (docs/DATA_SOURCES.md → "Yeniden doğrulama tablosu"). Kullanım: node scripts/reverified-dates.cjs
// src/lib/__tests__/catalog-reverified.test.ts üretilen dosyaların tabloyla aynı olduğunu denetler.
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");

const projectRoot = path.resolve(__dirname, "..");
const source = path.join(projectRoot, "src/data/catalog-reverified.ts");
const compiled = ts.transpileModule(fs.readFileSync(source, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
const table = {};
new Function("exports", compiled)(table);

/** Okuma satırlarını güne göre birleştirir; günler ve kimlikler tablodaki sırayla kalır. */
function datesOf(groups) {
  const byDay = new Map();
  for (const [readAt, , ids] of groups) byDay.set(readAt, [...(byDay.get(readAt) ?? []), ...ids]);
  return [...byDay];
}

function render(exportName, groups) {
  const lines = [
    "// Üretilen dosya, elle düzenlenmez. Kaynak: src/data/catalog-reverified.ts (yeniden doğrulama tablosu); yeniden üretmek için",
    "// `node scripts/reverified-dates.cjs`. Yalnız okuma günü ve kimlik taşır; okunan adresler tarayıcı paketine girmesin diye tabloda kalır.",
    'import type { ReverifiedDates } from "./catalog-shared";',
    "",
    `export const ${exportName}: ReverifiedDates = [`,
  ];
  for (const [readAt, ids] of datesOf(groups)) {
    lines.push(`  [${JSON.stringify(readAt)}, [`);
    for (let index = 0; index < ids.length; index += 8) lines.push(`    ${ids.slice(index, index + 8).map((id) => JSON.stringify(id)).join(", ")},`);
    lines.push("  ]],");
  }
  lines.push("];", "");
  return lines.join("\r\n");
}

for (const [file, exportName, groups] of [
  ["catalog-reverified-equipment-dates.ts", "reverifiedEquipmentDates", table.reverifiedEquipment],
  ["catalog-reverified-care-dates.ts", "reverifiedCareDates", table.reverifiedCare],
]) {
  fs.writeFileSync(path.join(projectRoot, "src/data", file), render(exportName, groups));
  console.log(`${file}: ${groups.reduce((sum, [, , ids]) => sum + ids.length, 0)} kayıt`);
}
