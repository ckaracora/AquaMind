#!/usr/bin/env node
// Dil paketlerinin sınırı (docs/DECISIONS/0021-dil-altyapisi.md, "5a ayrıntıları" ve İspanyolca paketi): Türkçe dışındaki her dilin
// metinleri yalnız o dil seçilince yüklenen kendi ayrı parçasında olmalı; hiçbir sayfanın ilk yüklemesinde bulunmamalı. Türkçe kullanan
// kimse onları indirmez. `next build` sonrasında çalışır (`pnpm verify`): derleme manifestindeki her sayfanın ilk yükleme dosyalarında her
// dilin dosyalarına özgü işaret cümleleri aranır. İşaretler kaynak dosyalarda bulunmalı (dosya değişince betik de güncellenir).
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const messages = path.join(root, "packages/localization/src/messages");
const MARKERS = {
  en: [
    ["en.ts", "Interface language and measurement formats used in calculations"],
    ["en-engine.ts", "not yet available in English"],
    ["en-diseases.ts", "Use the directories below to find a vet who treats ornamental fish"],
    ["en-plant-warnings.ts", "No warnings were calculated for plants that do not match the catalog"],
    ["en-privacy.ts", "Everything you enter in AquaMind is stored only in the browser on this device"],
    ["en-catalog-species.ts", "Color and fin names are not separate species"],
  ],
  es: [
    ["es.ts", "Idioma de la interfaz y formatos de medida usados en los cálculos"],
    ["es-engine.ts", "aún no está disponible en español"],
    ["es-diseases.ts", "Usa los directorios de abajo para encontrar un veterinario que atienda"],
    ["es-plant-warnings.ts", "No se calcularon advertencias para las plantas que no coinciden con el catálogo"],
    ["es-privacy.ts", "Todo lo que ingresas en AquaMind se guarda solo en el navegador de este dispositivo"],
    ["es-catalog-species.ts", "Los nombres de color y de aletas no son especies distintas"],
  ],
};

/**
 * Küçültücü ASCII dışı harfleri kaçış dizisiyle yazar ("cálculos" → "c\xe1lculos", 0xFF üstü "ı"); işaret her biçimde aranır.
 */
const escapeJs = (text, upper) => text.replace(/[^\x00-\x7e]/g, (char) => {
  const code = char.charCodeAt(0);
  const hex = upper ? code.toString(16).toUpperCase() : code.toString(16);
  return code <= 0xff ? `\\x${hex.padStart(2, "0")}` : `\\u${hex.padStart(4, "0")}`;
});
const forms = (marker) => [...new Set([marker, escapeJs(marker, false), escapeJs(marker, true)])];
const contains = (content, marker) => forms(marker).some((form) => content.includes(form));

const failures = [];
for (const [locale, list] of Object.entries(MARKERS)) {
  for (const [file, marker] of list) {
    const source = fs.readFileSync(path.join(messages, file), "utf8");
    if (!source.includes(marker)) failures.push(`İşaret ${file} içinde yok: "${marker}" (betiği güncelle; ${locale})`);
  }
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
  for (const [locale, list] of Object.entries(MARKERS)) {
    for (const [, marker] of list) if (contains(content, marker)) failures.push(`${locale} metni ilk yüklemede: ${file} → "${marker}"`);
  }
}

// Her dilin parçası derlemede var olmalı (yoksa işaretler boşuna aranmış olur) ve tek bir parçada toplanmalı.
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
const contents = new Map(all.map((file) => [file, fs.readFileSync(file, "utf8")]));
const found = {};
for (const [locale, list] of Object.entries(MARKERS)) {
  const bundles = all.filter((file) => list.every(([, marker]) => contains(contents.get(file), marker)));
  if (bundles.length !== 1) failures.push(`Bütün ${locale} işaretlerini taşıyan tek bir parça bekleniyordu; bulunan: ${bundles.length}`);
  else if (firstLoad.has(path.relative(next, bundles[0]).split(path.sep).join("/"))) failures.push(`${locale} parçası ilk yüklemede: ${bundles[0]}`);
  else found[locale] = bundles[0];
}
if (found.en && found.es && found.en === found.es) failures.push("İngilizce ve İspanyolca aynı parçada");

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
const describe = (file) => `${path.relative(root, file)} (${Math.round(fs.statSync(file).size / 1024)} kB)`;
console.log(`Dil paketi sınırı: ${firstLoad.size} ilk yükleme dosyasında başka dilin metni yok; ${Object.entries(found).map(([locale, file]) => `${locale} ${describe(file)}`).join(", ")}.`);
