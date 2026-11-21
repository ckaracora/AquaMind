#!/usr/bin/env node
// Dil paketlerinin sınırı (docs/DECISIONS/0021-dil-altyapisi.md, "5a ayrıntıları" ve İspanyolca paketi): Türkçe dışındaki her dilin
// metinleri yalnız o dil seçilince yüklenen kendi ayrı parçasında olmalı; hiçbir sayfanın ilk yüklemesinde bulunmamalı. Türkçe kullanan
// kimse onları indirmez. `next build` sonrasında çalışır (`pnpm verify`): derleme manifestindeki her sayfanın ilk yükleme dosyalarında her
// dilin dosyalarına özgü işaret cümleleri aranır. İşaretler kaynak dosyalarda bulunmalı (dosya değişince betik de güncellenir).
// Ekipman (7. paket) ve bakım ürünü (8. paket) kataloglarının ve tür bakım bilgisinin (veri sprinti E3) çevirisi dil paketinden de ayrı,
// katalog ve dil başına kendi parçasındadır; yalnız o kataloğu gösteren ekranlar (bakım bilgisinde tür kartı) yükler.
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

/** Katalog çevirilerinin işaretleri: katalog → dil → [dosya, işaret]. */
const SEGMENT_MARKERS = {
  ekipman: {
    en: ["en-catalog-equipment.ts", "is not included in the automatic capacity calculation"],
    es: ["es-catalog-equipment.ts", "no se incluye en el cálculo automático de capacidad"],
  },
  "bakım ürünü": {
    en: ["en-catalog-care.ts", "Archived Novo"],
    es: ["es-catalog-care.ts", "paquete de recarga"],
  },
  // Tür bakım bilgisi (veri sprinti E3, 2026-11-14): yalnız tür kartı yükler (src/lib/use-species-care-text.ts).
  "tür bakım bilgisi": {
    en: ["en-catalog-species-care.ts", "Mature females are larger and appear fuller."],
    es: ["es-catalog-species-care.ts", "La hembra madura es más grande y se ve más llena."],
  },
};
const segmentMarkers = Object.entries(SEGMENT_MARKERS).flatMap(([catalog, locales]) => Object.entries(locales).map(([locale, [file, marker]]) => ({ catalog, locale, file, marker })));

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
for (const { locale, file, marker } of segmentMarkers) {
  if (!fs.readFileSync(path.join(messages, file), "utf8").includes(marker)) failures.push(`İşaret ${file} içinde yok: "${marker}" (betiği güncelle; ${locale})`);
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
  for (const { catalog, locale, marker } of segmentMarkers) {
    if (contains(content, marker)) failures.push(`${locale} ${catalog} çevirisi ilk yüklemede: ${file} → "${marker}"`);
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
// Her katalog çevirisi dil başına tek bir parçada; dil paketinde, öbür dilin ya da öbür kataloğun parçasında değil.
const segments = [];
for (const { catalog, locale, marker } of segmentMarkers) {
  const holders = all.filter((file) => contains(contents.get(file), marker));
  if (holders.length !== 1) failures.push(`${locale} ${catalog} çevirisini taşıyan tek bir parça bekleniyordu; bulunan: ${holders.length}`);
  else if (Object.values(found).includes(holders[0])) failures.push(`${locale} ${catalog} çevirisi dil paketinin içinde: ${holders[0]}`);
  else segments.push({ catalog, locale, file: holders[0] });
}
for (const [index, segment] of segments.entries()) {
  for (const other of segments.slice(index + 1)) if (other.file === segment.file) failures.push(`${segment.locale} ${segment.catalog} ve ${other.locale} ${other.catalog} çevirisi aynı parçada`);
}

// Herkese açık tür sayfaları (docs/DECISIONS/0047-herkese-acik-tur-sayfalari.md): sunucuda düz HTML olarak üretilir. İlk yükleme dosyalarında
// katalog (canlı kaydı, davranış kaydı, bakım bilgisi) olmamalı; sayfaların kendi metinleri hiçbir tarayıcı parçasına girmemeli (yalnız sunucuda
// okunur). Üretilen her HTML dosyasında dil, arama motoru izni (açma ayarı kapalıyken noindex), tek canonical ve üç dilin hreflang bağlantısı
// olmalı; uygulama ekranlarının dil seçme betiği bulunmamalı.
const PUBLIC_SEGMENTS = { tr: "tur", en: "species", es: "especies" };
const CATALOG_MARKERS = [
  ["src/data/catalog-species.ts", "Paracheirodon innesi"],
  ["src/data/species-behavior.ts", "Zayıf kanıt; en çok uzun yüzgeçli erkek Betta ile ilgili bildiriliyor"],
  ["src/data/species-care.ts", "Muhtemelen hepçildir; küçük omurgasızlar, kabuklular ve iplik yosunla beslenir."],
];
const PUBLIC_TEXT_MARKERS = [
  ["packages/localization/src/messages/tr-public-pages.ts", "Hobi rehberliğidir; veteriner tavsiyesi değildir."],
  ["packages/localization/src/messages/en-public-pages.ts", "Hobby guidance, not veterinary advice."],
  ["packages/localization/src/messages/es-public-pages.ts", "Orientación para aficionados; no es consejo veterinario."],
];
for (const [file, marker] of [...CATALOG_MARKERS, ...PUBLIC_TEXT_MARKERS]) {
  if (!fs.readFileSync(path.join(root, file), "utf8").includes(marker)) failures.push(`İşaret ${file} içinde yok: "${marker}" (betiği güncelle; herkese açık sayfalar)`);
}
const publicEntries = Object.entries(manifest.pages).filter(([page]) => page.startsWith("/(public)/"));
// Dil başına bir kök yerleşim, bir dizin ve bir tür sayfası girişi.
if (publicEntries.length !== Object.keys(PUBLIC_SEGMENTS).length * 3) failures.push(`Herkese açık sayfa girişi bekleniyordu (${Object.keys(PUBLIC_SEGMENTS).length * 3}); bulunan: ${publicEntries.length}`);
const publicFirstLoad = new Set(publicEntries.flatMap(([, files]) => files).filter((file) => file.endsWith(".js")));
for (const file of publicFirstLoad) {
  const content = read(file);
  for (const [, marker] of CATALOG_MARKERS) if (contains(content, marker)) failures.push(`Katalog herkese açık sayfanın ilk yüklemesinde: ${file} → "${marker}"`);
}
for (const [file, content] of contents) {
  for (const [, marker] of PUBLIC_TEXT_MARKERS) if (contains(content, marker)) failures.push(`Herkese açık sayfa metni tarayıcı parçasında: ${path.relative(root, file)} → "${marker}"`);
}
const indexingOn = process.env.PUBLIC_PAGES_INDEXING === "on";
const publicHtml = [];
for (const [locale, segment] of Object.entries(PUBLIC_SEGMENTS)) {
  const base = path.join(next, "server/app", locale);
  const dir = path.join(base, segment);
  const files = [path.join(base, `${segment}.html`), ...(fs.existsSync(dir) ? fs.readdirSync(dir).filter((name) => name.endsWith(".html")).map((name) => path.join(dir, name)) : [])];
  if (files.length !== 31) failures.push(`${locale}: 30 tür ve bir dizin için 31 HTML bekleniyordu; bulunan: ${files.length}`);
  for (const file of files) {
    if (!fs.existsSync(file)) { failures.push(`Herkese açık sayfa üretilmemiş: ${path.relative(root, file)}`); continue; }
    const html = fs.readFileSync(file, "utf8");
    const name = path.relative(root, file);
    publicHtml.push({ name, size: Buffer.byteLength(html) });
    if (!html.includes(`<html lang="${locale}"`)) failures.push(`${name}: <html lang="${locale}"> yok`);
    const robots = html.match(/<meta name="robots" content="([^"]*)"/g) ?? [];
    if (robots.length !== 1 || robots[0].includes("noindex") === indexingOn) failures.push(`${name}: arama motoru izni beklenen gibi değil (${robots.join(" ") || "yok"}; açma ayarı ${indexingOn ? "açık" : "kapalı"})`);
    if ((html.match(/<link rel="canonical"/g) ?? []).length !== 1) failures.push(`${name}: tek canonical bekleniyordu`);
    for (const lang of [...Object.keys(PUBLIC_SEGMENTS), "x-default"]) if (!new RegExp(`<link\\b[^>]*rel="alternate"[^>]*href[Ll]ang="${lang}"`).test(html)) failures.push(`${name}: <link rel="alternate" hreflang="${lang}"> yok`);
    if (html.includes("aquamind:locale:v1")) failures.push(`${name}: uygulama ekranlarının dil seçme betiği herkese açık sayfada`);
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
const describe = (file) => `${path.relative(root, file)} (${Math.round(fs.statSync(file).size / 1024)} kB)`;
console.log(`Dil paketi sınırı: ${firstLoad.size} ilk yükleme dosyasında başka dilin metni yok; ${Object.entries(found).map(([locale, file]) => `${locale} ${describe(file)}`).join(", ")}; katalog çevirileri ayrı parçalarda: ${segments.map(({ catalog, locale, file }) => `${catalog} ${locale} ${describe(file)}`).join(", ")}.`);
console.log(`Herkese açık sayfalar: ${publicHtml.length} HTML dosyası (toplam ${Math.round(publicHtml.reduce((sum, file) => sum + file.size, 0) / 1024)} kB, en büyüğü ${Math.round(Math.max(...publicHtml.map((file) => file.size)) / 1024)} kB), ${publicFirstLoad.size} ilk yükleme dosyasında katalog yok, sayfa metinleri hiçbir tarayıcı parçasında yok; ${indexingOn ? "arama motorlarına açık" : "noindex (kapalı)"}, canonical ve hreflang tam.`);
