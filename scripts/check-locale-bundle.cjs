#!/usr/bin/env node
// Dil paketinin sınırı (docs/DECISIONS/0021-dil-altyapisi.md, "5a ayrıntıları"): İngilizce metinler yalnız İngilizce seçilince
// yüklenen ayrı parçada olmalı; hiçbir sayfanın ilk yüklemesinde bulunmamalı. Türkçe kullanan kimse onları indirmez. `next build`
// sonrasında çalışır (`pnpm verify`): derleme manifestindeki her sayfanın ilk yükleme dosyalarında İngilizce dosyalara özgü işaret
// cümleleri aranır. İşaretler İngilizce kaynak dosyalarında bulunmalı (dosya değişince betik de güncellenir).
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const messages = path.join(root, "packages/localization/src/messages");
const MARKERS = [
  ["en.ts", "Interface language and measurement formats used in calculations"],
  ["en-engine.ts", "not yet available in English"],
  ["en-diseases.ts", "Use the directories below to find a vet who treats ornamental fish"],
  ["en-plant-warnings.ts", "No warnings were calculated for plants that do not match the catalog"],
  ["en-privacy.ts", "Everything you enter in AquaMind is stored only in the browser on this device"],
  ["en-catalog-species.ts", "Color and fin names are not separate species"],
];

const failures = [];
const markers = [];
for (const [file, marker] of MARKERS) {
  const source = fs.readFileSync(path.join(messages, file), "utf8");
  if (!source.includes(marker)) failures.push(`İşaret ${file} içinde yok: "${marker}" (betiği güncelle)`);
  markers.push(marker);
}

const next = path.join(root, ".next");
const manifestFile = path.join(next, "app-build-manifest.json");
if (!fs.existsSync(manifestFile)) {
  console.error(`Derleme manifesti yok: ${manifestFile} (önce next build)`);
  process.exit(1);
}
const manifest = JSON.parse(fs.readFileSync(manifestFile, "utf8"));
const firstLoad = new Set(Object.values(manifest.pages).flat().filter((file) => file.endsWith(".js")));
const read = (file) => fs.readFileSync(path.join(next, file), "utf8");

for (const file of firstLoad) {
  const content = read(file);
  for (const marker of markers) if (content.includes(marker)) failures.push(`İngilizce metin ilk yüklemede: ${file} → "${marker}"`);
}

// İngilizce parça derlemede var olmalı (yoksa işaretler boşuna aranmış olur).
const chunks = path.join(next, "static/chunks");
const all = [];
const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith(".js")) all.push(full);
  }
};
walk(chunks);
const bundles = all.filter((file) => markers.every((marker) => fs.readFileSync(file, "utf8").includes(marker)));
if (bundles.length !== 1) failures.push(`Bütün işaretleri taşıyan tek bir İngilizce parça bekleniyordu; bulunan: ${bundles.length}`);
else if (firstLoad.has(path.relative(next, bundles[0]).split(path.sep).join("/"))) failures.push(`İngilizce parça ilk yüklemede: ${bundles[0]}`);

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log(`Dil paketi sınırı: ${firstLoad.size} ilk yükleme dosyasında İngilizce metin yok; İngilizce parça ${path.relative(root, bundles[0])} (${Math.round(fs.statSync(bundles[0]).size / 1024)} kB).`);
