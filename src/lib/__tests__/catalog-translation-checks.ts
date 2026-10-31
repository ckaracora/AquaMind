import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { speciesCatalog } from "@/data/catalog-species";

// Canlıların çeviri kaynaklarını denetleyen testlerin ortak parçaları (catalog-translations.test.ts, catalog-translations-es.test.ts;
// docs/DECISIONS/0021-dil-altyapisi.md, "4b" ve İspanyolca paketi). Dile özgü birim, süre ve sıklık kalıpları testlerin kendisindedir.

export interface TranslationEntry { key: string; fields: string[]; tr: string; method?: "a" | "k" | "t"; source?: string; [locale: string]: unknown }

export function readTranslations(locale: string): TranslationEntry[] {
  return JSON.parse(readFileSync(fileURLToPath(new URL(`../../../packages/localization/translations/${locale}-species.json`, import.meta.url)), "utf8")) as TranslationEntry[];
}

/** Metindeki sayılar, her dilin kendi ayırıcısıyla okunmuş değer olarak (Türkçe 1.200 = İngilizce 1,200; özgül ağırlık 1.001–1.029 ikisinde de ondalık). */
export const values = (text: string, notation: "tr" | "en") =>
  (text.match(/\d+(?:[.,]\d+)*/g) ?? [])
    .map((raw) => {
      if (/^1\.0(?:0[1-9]|[12]\d)$/.test(raw)) return Number(raw);
      if (notation === "tr") return Number(/^\d{1,3}(\.\d{3})+(,\d+)?$/.test(raw) ? raw.replace(/\./g, "").replace(",", ".") : raw.replace(",", "."));
      return Number(/^\d{1,3}(,\d{3})+(\.\d+)?$/.test(raw) ? raw.replace(/,/g, "") : raw);
    })
    .sort((a, b) => a - b);

export const PROPER = ["Seriously Fish", "Fishkeeper", "Practical Fishkeeping", "FishBase", "OATA", "Fishipedia", "Cikletist", "Meerwasser-Lexikon", "wirbellose.de"];

/** Latince cins adları: katalogdakiler ve notlarda geçen öbürleri. Tam ad ("Psalidodon anisitsi") ve kısaltma ("P. sphenops") aynen kalmalı. */
const OTHER_GENERA = [
  "Ancistomus", "Artemia", "Atherina", "Atherinosoma", "Cochliodon", "Convolutriloba", "Daphnia", "Macrodactyla", "Moenkhausia", "Moina",
  "Piabarchus", "Premnas", "Telmatherina", "Tritia", "Ilyanassa", "Aiptasia", "Rhynchocinetes", "Zoanthus", "Ricordea", "Euphyllia",
  "Condylactis", "Gambusia", "Chaetostoma", "Vallisneria", "Anubias", "Physa", "Ancistrini", "Gastromyzontidae", "Pimelodidae",
  "Loricariid",
];
const genera = new Set([...speciesCatalog.map((profile) => profile.scientificName.split(" ")[0]).filter((word) => /^[A-Z][a-z]+$/.test(word)), ...OTHER_GENERA]);
/**
 * Latince tür adları (cins adından sonra gelen ikinci sözcük): katalogdakiler, notlardaki kısaltmaların ("P. sphenops") tür adları ve
 * notlarda geçen öbürleri. Cins adından sonra gelen Türkçe sözcük ("Betta ile", "Vallisneria benzeri") tür adı sayılmaz.
 */
const OTHER_EPITHETS = [
  "aequipinnatus", "affinis", "altus", "brevifilis", "brevirostre", "cirrhosus", "clarkii", "digueti", "georgiae", "inspector",
  "jamesonii", "lacortei", "mexicana", "plecostomus", "retrogemma", "rhodostomus", "signata", "stramineus", "subviridis", "ucayalensis",
];

/** Türkçe metinlerdeki Latince adları bulan fonksiyon; kısaltmaların tür adları verilen Türkçe metinlerden toplanır. */
export function latinNameFinder(turkishTexts: readonly string[]) {
  const epithets = new Set([
    ...speciesCatalog.flatMap((profile) => profile.scientificName.split(" ").slice(1)).filter((word) => /^[a-z]+$/.test(word)),
    ...turkishTexts.flatMap((text) => [...text.matchAll(/(?<!\p{L})[A-Z]\. ([a-z]{3,})(?!\p{L})/gu)].map((match) => match[1])),
    ...OTHER_EPITHETS,
  ]);
  return (text: string) => [
    ...[...text.matchAll(/(?<!\p{L})([A-Z][a-z]+) ([a-z]{3,})(?!\p{L})/gu)].filter((match) => genera.has(match[1]) && epithets.has(match[2])).map((match) => match[0]),
    ...[...genera].filter((genus) => new RegExp(`(?<!\\p{L})${genus}(?!\\p{L})`, "u").test(text)),
    ...(text.match(/(?<!\p{L})[A-Z]\. [a-z]{3,}(?!\p{L})/gu) ?? []),
  ];
}

/** Kimlik kodları (L, LDA, CW, C numaraları); adda da korunur. */
export const codes = (text: string) => text.match(/\b(?:L|LDA|CW|C)\d+[A-Z]?\b/g) ?? [];

/** Türkçe yazılmış süre miktarları ("iki-üç ay"); karşılığı her dilin testinde. Yalnız süre birimine bağlı sözcükler sayılır. */
export const TR_NUMBER_WORDS: Record<string, number> = { iki: 2, üç: 3, dört: 4, beş: 5, altı: 6, yedi: 7, sekiz: 8, dokuz: 9, on: 10 };
export function turkishTimedNumberWords(text: string): number[] {
  const words = Object.keys(TR_NUMBER_WORDS).join("|");
  const phrase = new RegExp(`(?<!\\p{L})(?:${words})(?:(?:\\s?[-–]\\s?|\\s(?:ile|veya|ya da)\\s)(?:${words}))?\\s(?:saat|gün|hafta|ay|yıl)`, "giu");
  return (text.match(phrase) ?? []).flatMap((match) => [...match.toLocaleLowerCase("tr").matchAll(/\p{L}+/gu)].map((word) => TR_NUMBER_WORDS[word[0]]).filter((value) => value !== undefined)).sort();
}

/**
 * İspanyolca metinde Latin Amerika ortak İspanyolcasına uymayan kullanım (ürün sahibi kararı 2026-10-31): "vosotros" zamirleri ve
 * iyelikleri, "vosotros" fiil çekimi (-áis, -éis; dieciséis/veintiséis sayı), "vos", "sos" ve zamirsiz voseo çekimleri, İspanya'ya özgü
 * sözcükler. Arayüz (latam-spanish.test.ts) ve canlıların çevirisi (catalog-translations-es.test.ts) aynı denetimi kullanır.
 * Voseo düzenlidir: şimdiki zaman vurgulu -ás/-és/-ís (tenés, podés, vivís), emir kipi vurgulu -á/-é/-í (guardá, mantené, añadí) ile biter;
 * tek zamirli emirde vurgu işareti düşer (guardalo, cuidate), iki zamirlide kalır (guardátelo). Üç yolla aranır:
 * - Vurgulu ünlüyle (ya da vurgulu ünlü + s ile) biten her sözcük. Öbür vurgulu sözcükler (más, después, está, aquí, yer adları…) izin
 *   listesindedir; "tú" gelecek zamanı (-rás, -rá, -ré: tendrás, completará, escribiré) bu yolda geçer. Birinci tekil geçmiş zaman (guardé,
 *   añadí) emirle aynı yazılır; metinler kullanıcıya hitap ettiği için kullanılmaz, gerekirse izin listesine girer.
 * - Sık fiillerin voseo biçimleri (VOSEO_VERBS): emir (mirá, corré), şimdiki zaman (mirás), tek ve iki zamirli emir (miralo, fijate,
 *   leéselo). Gelecek zamanla aynı biten -rá/-rás/-ré biçimleri ve tek zamirli emir yalnız bu listedeki fiillerde yakalanır.
 * - Listede olmayan fiilin iki zamirli voseo emri: vurgu zamir çiftinden hemen önceki ünlüdedir ve önünde en az üç harf vardır
 *   (descargátelo, acercáselo). "tú" biçiminde vurgu daha öndedir (descárgatelo, léeselo); tek heceli "tú" emirleri (dímelo, dámelo) geçer.
 */
const SPAIN_OR_VOSOTROS = [
  /(?<!\p{L})(?:vosotr[oa]s|vuestr[oa]s?|os)(?!\p{L})/giu,
  /(?<!\p{L})(?!dieciséis|veintiséis)\p{L}+(?:áis|éis)(?!\p{L})/giu,
  /(?<!\p{L})(?:vos|sos)(?!\p{L})/giu,
  /(?<!\p{L})(?:ordenador(?:es)?|móvil(?:es)?|coger|cogió|grifo|zumo|piso|coche)(?!\p{L})/giu,
];
const STRESSED_NON_VOSEO = new Set([
  "más", "además", "demás", "atrás", "detrás", "jamás", "compás", "después", "estrés", "inglés", "siamés", "tailandés", "través", "japonés",
  "francés", "interés", "cortés", "revés", "ciprés", "portugués", "holandés", "escocés", "irlandés", "danés", "finlandés", "país", "anís", "maíz",
  "quizás", "veintitrés", "bebés", "ciempiés", "estás", "estés",
  "está", "esté", "dé", "sé", "té", "sí", "mí", "qué", "así", "aquí", "allí", "ahí", "allá", "acá", "quizá", "café", "bebé", "sofá", "mamá", "papá",
  "rubí", "maní", "ají", "colibrí", "bogotá", "canadá", "panamá", "paraná", "acandí",
]);
/** Sık fiiller. "tú" ile aynı çekimli ya da tek heceli fiiller (estar, dar, ser, ir, ver, haber) ve biçimi başka sözcükle karışanlar (tomar → tomate, regar → regalo) yok. */
const VOSEO_VERBS = [
  "acercar", "aclimatar", "acordar", "agregar", "airear", "aislar", "ajustar", "alimentar", "andar", "anotar", "apagar", "asegurar", "aumentar",
  "bajar", "borrar", "buscar", "calentar", "cambiar", "cancelar", "cerrar", "colocar", "comprar", "comprobar", "conectar", "confirmar", "consultar",
  "continuar", "controlar", "cortar", "cuidar", "dejar", "dosificar", "editar", "eliminar", "empezar", "encontrar", "enjuagar", "esperar", "evitar",
  "fijar", "filtrar", "guardar", "instalar", "intentar", "limpiar", "llenar", "llevar", "mirar", "mostrar", "necesitar", "observar", "ocupar",
  "olvidar", "pasar", "pensar", "plantar", "podar", "preocupar", "preparar", "probar", "quedar", "quitar", "recordar", "registrar", "retirar",
  "revisar", "sacar", "seleccionar", "sentar", "separar", "tocar", "tratar", "usar", "vaciar", "vigilar",
  "activar", "agitar", "aplicar", "aspirar", "completar", "desactivar", "descargar", "desconectar", "desenchufar", "enchufar", "exportar",
  "importar", "ingresar", "presionar", "programar", "pulsar", "reemplazar", "rellenar", "renovar", "reparar", "restaurar", "sifonear",
  "verificar",
  "conocer", "correr", "deber", "encender", "hacer", "leer", "mantener", "meter", "mover", "poder", "poner", "querer", "saber", "tener", "volver",
  "abrir", "añadir", "compartir", "decir", "diluir", "dormir", "elegir", "escribir", "introducir", "medir", "pedir", "reducir", "repetir",
  "salir", "seguir", "servir", "subir", "sustituir", "venir", "vivir",
];
const STRESSED_VOWEL: Record<string, string> = { a: "á", e: "é", i: "í" };
const CLITICS = ["lo", "la", "los", "las", "le", "les", "te", "me", "nos"];
const FIRST_CLITICS = ["me", "te", "se", "nos", "le", "les"];
const SECOND_CLITICS = ["lo", "la", "los", "las"];
const VOSEO_FORMS = new Set(
  VOSEO_VERBS.flatMap((verb) => {
    const stem = verb.slice(0, -2);
    const vowel = verb.at(-2) ?? "";
    const stressed = stem + STRESSED_VOWEL[vowel];
    return [
      stressed,
      `${stressed}s`,
      ...CLITICS.map((clitic) => stem + vowel + clitic),
      ...FIRST_CLITICS.flatMap((first) => SECOND_CLITICS.map((second) => stressed + first + second)),
    ];
  }),
);
export const spainOnlySpanish = (text: string) => [
  ...SPAIN_OR_VOSOTROS.flatMap((pattern) => text.match(pattern) ?? []),
  ...(text.match(/(?<!\p{L})\p{L}+(?!\p{L})/gu) ?? []).filter((word) => {
    const lower = word.toLowerCase();
    if (VOSEO_FORMS.has(lower)) return true;
    if (/\p{L}{3}[áéí](?:me|te|se|nos|le|les)(?:lo|la|los|las)$/u.test(lower)) return true;
    return /\p{L}[áéí]s?$/u.test(lower) && !STRESSED_NON_VOSEO.has(lower) && !/r(?:á|ás|é)$/u.test(lower);
  }),
];
