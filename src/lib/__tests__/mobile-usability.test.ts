import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import resolveConfig from "tailwindcss/resolveConfig";
import ts from "typescript";
import { describe, expect, it } from "vitest";
import tailwindConfig from "../../../tailwind.config";

// Telefonda kullanım kolaylığı için konan kuralların yanlışlıkla geri alınmaması için kaynak dosyalar taranır.
// Testler tarayıcı ortamında çalışmadığından kesin ölçüler (yazı boyutu, dokunma alanı) ayrıca yerel sunucuda ölçülür.
//
// Bu tarama bir güvencedir, ölçümün yerine geçmez; bu yüzden katı davranır:
// - Etiketler TypeScript'in kendi ayrıştırıcısıyla okunur; dizgi içindeki `{`, `>` ya da `</button>` taramayı yanıltmaz.
// - Ölçü sınıflarının piksel değeri tahmin edilmez, projenin Tailwind ölçü tablosundan okunur; tabloda olmayan sınıf ölçü vermez.
// - Düğmenin ölçüsü yalnızca koşulsuz yazılmış sınıflardan hesaplanır. Ölçüyü belirsiz bırakan her şey (koşullu ifadedeki ölçü
//   sınıfı, ifadeyle birleştirilmiş sınıf adı, `style` ya da `class` özniteliği, yayılan öznitelik, `hover:` ya da `max-sm:`
//   gibi telefonda da geçerli olabilen önek, `[height:36px]` gibi keyfi CSS özelliği, şablon dizgisinde değeri kaynakta
//   yazılı olmayan ifade) açıkça hata sayılır; "en büyük dalı al" gibi iyimser bir varsayım yapılmaz. Şablon dizgisindeki
//   ifadede yalnız şunlar okunur: dizgi, koşullu ifadenin dalları, aynı dosyada tek yerde `const` ile bildirilen ad ve aynı
//   dosyada `const` ile bildirilen tek ifadeli işlevin çağrısı (bkz. `classValues`); parametre, içe aktarılan ad, `function`
//   bildirimi, özellik ya da başka çağrı hatadır. `undefined` adı dosyada yeniden bağlanmışsa o da sıradan bir addır.
// - Sınıflar Tailwind'in ve tarayıcının okuduğu gibi okunur: sınıfları yalnız boşluk, sekme ve satır sonu ayırır; önekler
//   ayraç içindeki `:` sayılmadan ayrılır; keyfi CSS özelliği adına bakılmadan, asıl sınıfın köşeli ayraçla başlamasından tanınır.
// - Hangi düğmenin ölçüsünün denetleneceği düğmenin adına bağlı değildir; ad her biçimde yazılabilir. Üç kural vardır:
//   (1) simge düğmesi, yani kendi yazısı kesin olarak eksik kalabilen düğme, iki boyutta en az 44 pikseli güvence eder;
//   (2) yazılı olsun olmasın hiçbir düğmenin ölçüsü 44 pikselin altına sabitlenmez ya da sınırlanmaz;
//   (3) 44 piksel yükseklik verilen düğme genişlikte de en az 44 pikseldir.
//   Bilinen istisnalar `SIZE_EXCEPTIONS` içinde gerekçeleriyle listelenir; her biri en çok bir düğmeyle eşleşebilir.
// - Alt sınırlar "en az" olarak sınanır: 44 pikselden büyük bir düğme ya da yeni eklenen bir düğme testi bozmaz. Düğme
//   sayıları da alt sınırdır (taramanın körleşmesine karşı); bir düğmeyi kaldırmak sayıyı bilinçli olarak güncellemeyi gerektirir.
// - Erişilebilir ad boş olamaz; bir dalı ad vermeyen koşullu ifade de ad sayılmaz.
// - "Bu düğmenin her durumda okunabilir bir içeriği ya da adı var mı" sorusu sezgiyle değil, koşulların bütün olası değerleri
//   tek tek denenerek yanıtlanır (bkz. `stateOf`). İçerik ile ad birlikte değerlendirilir: yazısı bir koşulda kaybolan düğmenin
//   adı o koşulda geliyorsa düğme geçerlidir. Koşullar ayrı bir taramayla toplanmaz; değerlendirmenin dal seçmek için sorduğu
//   her soru (`k ? a : b`, `k && a`, `k || a`, `!k` için "doğru mu", `k ?? a` için "boş mu") bir koşuldur. Böylece çocuk
//   öğelerin öznitelikleri (`alt`, `aria-label`, `aria-hidden`) dahil, sonucu etkileyen hiçbir koşul gözden kaçamaz.
// - Yalnızca kesin olan durumda hata verilir: hiçbir durumda içerik ve ad yoksa ya da tek bir koşulun bir değeri, öbür koşullar
//   ne olursa olsun ikisini de yok ediyorsa. Yokluk ancak birden çok koşulun birlikte belirli değerler almasına bağlıysa
//   koşullar birbirine bağlı olabilir (ör. `a > 0` ile `a <= 0`); tarama bunu bilemez ve iddiada bulunmaz.
// - İşlecin seçtiği değer ile o değerin yazı çizmesi ayrı değerlendirilir (bkz. `evaluate`): `true || "Yazı"` hiçbir şey çizmez.
// - JSX yazısındaki ve JSX öznitelik dizgisindeki HTML varlıkları derleyicinin yaptığı gibi çözülür (`&nbsp;` bölünmez
//   boşluktur, yazı değildir); JS dizgisi çözülmez (`{"&nbsp;"}` görünen altı karakterdir). Görünmeyen karakterler yazı değildir.
// - `aria-hidden` içerik ad vermez; `alt` yazısı olan resim ve kendi `aria-label` değeri olan öğe verir.
// - Kaynak metni değil, tarayıcıya giden değer okunur: öznitelik dizgisinin ham metni tek yerden (`jsxStringValue`) çözülerek
//   alınır; HTML'de büyük-küçük harf ayrımı olmayan yerlerde (tireli öznitelik adları, `type` değeri, `aria-hidden` değeri)
//   ayrım yapılmaz; düğme adları Türkçe kurallarıyla küçük harfe çevrilerek karşılaştırılır.
// Bilinen sınırlar:
//   S1. Değeri kaynakta görünmeyen ifade (değişken, özellik, çağrı, şablon dizgisi, aritmetik) çizildiğinde doğruyken yazı,
//       yanlışken hiçbir şey sayılır (bir simge tutuyorsa ya da değeri 0 olan bir sayıysa tarama bunu göremez). Bileşen
//       (`<Check/>`) ise simge sayılır: kendi `aria-label` ya da `alt` değeri ve çocuğu yoksa yazı vermez; yazı çizen bir
//       bileşen taşıyan düğmeye ad yazılması gerekir.
//   S2. Sınanan her koşulun iki değeri de alabildiği varsayılır; koşul gerçekte bir sabit olsa da değişken sayılır.
//   S3. Yokluk ancak birden çok koşulun birlikte belirli değerler almasına bağlıysa ya da sekizden çok koşul varsa iddia edilmez.
//   S4. Değeri yalnız çalışma anında belli olan ad (değişken, çağrı, şablon dizgisi) kabul edilir; `aria-labelledby`nin
//       gösterdiği öğe denetlenmez. Çocuk öğelerde ad kaynağı olarak yalnız `aria-label` ile (`img` öğesinde ya da bir
//       bileşende) `alt` tanınır; bileşenin bu değerleri öğeye aktardığı varsayılır. Yayılan öznitelikle (`{...props}`)
//       gelen ad görülmez; böyle bir öğeye ad açıkça yazılır.
//   S5. Ölçü ve görünürlük: üst öğenin daraltması, CSS dosyasındaki kurallar, dönüşümler, CSS ile ya da `hidden` ve `inert`
//       öznitelikleriyle gizlenen yazı görülmez; boş görünen ama Unicode'da görünmez sayılmayan karakterler yazı sayılır.
//       Ölçü yalnız `w-*`, `h-*`, `size-*`, `min-*` ve `max-*` sınıflarından okunur; ölçüyü dolaylı etkileyen öbür Tailwind
//       sınıflarının (`basis-*`, `scale-*`, `aspect-*`, `flex-*`, `grow`, `shrink`) ve projenin kendi CSS sınıflarının etkisi
//       görülmez.
//   S6. Türü değişkenden gelen alan sayı alanı olarak tanınmaz. `aria-hidden` yalnız değeri kaynakta belli olduğunda gizler:
//       değersiz yazım ve `false`, "false", boş dizgi, boş değer dışındaki her değer (`true`, "true", `!k`, karşılaştırma;
//       koşullu ifadede dalların bu değerleri; geçersiz değerlerde katı taraf). Değişkenden ya da yayılan öznitelikten
//       (`{...props}`) gelen değer gizlemez.
//   S7. Ad denetimine yalnız `button` ve `a` öğeleri ile Next'in `Link` bileşeni girer; başka bileşenle ya da `role="button"`
//       ile yazılan düğmeler girmez. Ölçü denetimleri yalnız `button` öğelerini kapsar. Yazısı olan ve ölçüsü dolgudan gelen
//       düğmenin gerçek ölçüsü sınıflardan hesaplanamaz; simge düğmesinin ölçüsü bu yüzden ölçü sınıfıyla (`size-*`, `w-*`,
//       `h-*`, `min-*`) açıkça verilmelidir, dolguyla verilen ölçü kabul edilmez. Telefonda `hidden` sınıfıyla (kendisinde ya
//       da üst öğesinde) gizlenen düğme de denetlenir; yalnız masaüstünde görünen küçük ölçü `sm:` gibi bir önekle yazılır.

const sourceFiles = (dir: string): string[] => readdirSync(dir).flatMap((entry) => {
  const path = join(dir, entry);
  if (statSync(path).isDirectory()) return entry === "__tests__" ? [] : sourceFiles(path);
  return /\.tsx$/.test(entry) ? [path.replaceAll("\\", "/")] : [];
});

interface Attribute {
  /** Düz dizgi değeri (`a="x"`, `a={"x"}` ya da ifadesiz şablon), çalışma anındaki haliyle; başka ifadede `undefined`. */
  literal?: string;
  /** Dizgi olmayan değerin ifadesi (koşul, değişken, şablon dizgisi …). */
  expression?: ts.Expression;
  /** Değersiz öznitelik (ör. `disabled`). */
  bare: boolean;
}

interface Tag {
  name: string;
  attributes: Map<string, Attribute>;
  /** `className` içinde koşulsuz yer alan sınıflar: dizginin kendisi ya da şablon dizgisinin sabit parçaları. */
  staticClasses: string[];
  /** `className` içindeki ifadelerin (`${…}`, koşul, çağrı) dizgilerinden gelen, koşula bağlı sınıflar. */
  dynamicClasses: string[];
  /** Şablon dizgisinde bir ifadeye boşluksuz bitişen sınıf parçaları (ör. `size-${n}`); adı okunamaz. */
  gluedClasses: string[];
  /** Şablon dizgisinde değeri kaynakta yazılı olmayan ifadeler (ör. `${chipClass}`); herhangi bir sınıf taşıyabilirler. */
  opaqueClasses: string[];
  /** `className` yok, dizgi ya da şablon dizgisi; başka bir ifadeyse (değişken, koşul, çağrı) `false`. */
  classNameReadable: boolean;
  hasSpread: boolean;
  /** Öğe bir `form` öğesinin içinde (türü verilmemiş düğme orada formu gönderir). */
  insideForm: boolean;
  /** Açılış etiketi ve çocuklar; okunabilir içerik ve ad bunlardan değerlendirilir (bkz. `contentState`, `readableState`). */
  opening: ts.JsxOpeningLikeElement;
  children: readonly ts.JsxChild[];
  source: string;
}

/**
 * `always`: koşulların her değerinde var. `never`: hiçbir değerinde yok. `sometimes`: tek bir koşulun bir değeri, öbür
 * koşullar ne olursa olsun yok ediyor. `unknown`: yokluk birden çok koşulun birlikte belirli değerler almasına bağlı; iddia edilmez.
 */
type TextState = "always" | "never" | "sometimes" | "unknown";
/**
 * Koşulların denenen değerleri ve bu denemede dal seçmek için sorulan koşullar. `textOnly`: yalnız düğmenin kendi yazısı
 * sayılır; çocuğun `aria-label` ya da `alt` değeri sayılmaz (bkz. `plainTextState`).
 */
interface Conditions { values: ReadonlyMap<string, boolean>; asked: Set<string>; textOnly?: boolean }
/** Bir ifadeye dal seçmek için sorulan soru: "doğru mu" (`k ? a : b`, `k && a`, `k || a`, `!k`) ve "boş mu" (`k ?? a`). */
interface Question { truthy: boolean; nullish: boolean }
/** Yalnızca çizilen (ya da öznitelik değeri olan) ifadeye soru sorulmaz. */
const RENDERED: Question = { truthy: false, nullish: false };
const TRUTHY: Question = { truthy: true, nullish: false };
/** Bu sayıdan çok farklı koşul varsa bütün durumlar denenmez; sonuç `unknown` olur. */
const MAX_CONDITIONS = 8;

/**
 * Sınıf adlarını tarayıcının yaptığı gibi ayırır: ayırıcı yalnız boşluk, sekme ve satır sonudur. Bölünmez boşluk ayırıcı
 * değildir; `x&nbsp;size-11` tek bir (geçersiz) sınıftır ve `size-11` sayılmaz.
 */
const CLASS_SEPARATOR = /[ \t\n\f\r]+/;
const words = (parts: readonly string[]) => parts.join(" ").split(CLASS_SEPARATOR).filter(Boolean);
const operator = (node: ts.BinaryExpression) => node.operatorToken.kind;

function stringParts(node: ts.Node, parts: string[] = []): string[] {
  if (ts.isStringLiteral(node) && ts.isJsxAttribute(node.parent)) parts.push(jsxStringValue(node));
  else if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node) || ts.isTemplateHead(node) || ts.isTemplateMiddle(node) || ts.isTemplateTail(node)) parts.push(node.text);
  ts.forEachChild(node, (child) => { stringParts(child, parts); });
  return parts;
}

const unwrap = (node: ts.Expression): ts.Expression => ts.isParenthesizedExpression(node) || ts.isAsExpression(node) || ts.isNonNullExpression(node) || ts.isSatisfiesExpression(node) ? unwrap(node.expression) : node;
const isNegation = (node: ts.Expression): node is ts.PrefixUnaryExpression => ts.isPrefixUnaryExpression(node) && node.operator === ts.SyntaxKind.ExclamationToken;
const isLogical = (node: ts.Expression): node is ts.BinaryExpression => ts.isBinaryExpression(node) && [ts.SyntaxKind.AmpersandAmpersandToken, ts.SyntaxKind.BarBarToken, ts.SyntaxKind.QuestionQuestionToken].includes(operator(node));
/**
 * `undefined` bir anahtar sözcük değil, sıradan bir addır ve yerel kapsamda yeniden bağlanabilir (`const undefined = "…"`).
 * Dosyada bu adı bağlayan bir bildirim varsa ad boş değer sayılmaz; öbür adlar gibi okunur ya da okunamıyorsa hata sayılır.
 */
const rebindsUndefined = new WeakMap<ts.SourceFile, boolean>();
const isUndefined = (node: ts.Expression) => {
  if (!ts.isIdentifier(node) || node.text !== "undefined") return false;
  const file = node.getSourceFile();
  if (!rebindsUndefined.has(file)) rebindsUndefined.set(file, bindingsOf(file).has("undefined"));
  return !rebindsUndefined.get(file);
};
const isNeverText = (node: ts.Expression) => ts.isArrowFunction(node) || ts.isFunctionExpression(node) || ts.isObjectLiteralExpression(node);
/**
 * Koşulun adı: belirteçleri tek boşlukla birleştirilmiş kaynak metni (boşluk ve satır kırma farkı önemsizdir, dizgilerin içi
 * aynen kalır). Aynı metin aynı koşuldur; `x` ile `!x` aynı koşulun iki yüzüdür.
 */
const conditionKey = (node: ts.Node): string => node.getChildCount() === 0 ? node.getText() : node.getChildren().map(conditionKey).join(" ");
/** `x ?? a` içindeki x "boş mu (null/undefined)" diye sınanır; bu, "doğru mu" sorusundan ayrı bir koşuldur. */
const NULLISH = "??";
/** Sonucu her zaman doğru/yanlış olan işleçler; böyle bir değer çizilince hiçbir şey görünmez. */
const BOOLEAN_OPERATORS = [ts.SyntaxKind.EqualsEqualsToken, ts.SyntaxKind.ExclamationEqualsToken, ts.SyntaxKind.EqualsEqualsEqualsToken, ts.SyntaxKind.ExclamationEqualsEqualsToken, ts.SyntaxKind.LessThanToken, ts.SyntaxKind.GreaterThanToken, ts.SyntaxKind.LessThanEqualsToken, ts.SyntaxKind.GreaterThanEqualsToken, ts.SyntaxKind.InstanceOfKeyword, ts.SyntaxKind.InKeyword];
const isComparison = (node: ts.Expression): node is ts.BinaryExpression => ts.isBinaryExpression(node) && BOOLEAN_OPERATORS.includes(operator(node));
const isComma = (node: ts.Expression): node is ts.BinaryExpression => ts.isBinaryExpression(node) && operator(node) === ts.SyntaxKind.CommaToken;

// JSX yazısındaki ve JSX öznitelik dizgisindeki (`a="…"`) HTML varlıklarını derleyici çözer; JS dizgisi (`{"…"}`) olduğu gibi
// kalır: `&nbsp;` birincisinde bölünmez boşluk, ikincisinde görünen altı karakterdir. TypeScript ağacı ikisini de ham verir.
// TypeScript ve Next'in derleyicisi (SWC) aynı kuralı uygular: ondalık (`&#160;`), küçük `x` ile onaltılık (`&#xa0;`) ve XHTML
// tablosundaki adlar (büyük-küçük harf ayrımıyla). Tablodaki 253 addan görünmeyen karakter veren dokuzu aşağıdadır; öbür
// adlar çözülse de çözülmese de görünür kalır.
const INVISIBLE_ENTITIES = new Map([["nbsp", 160], ["shy", 173], ["ensp", 8194], ["emsp", 8195], ["thinsp", 8201], ["zwnj", 8204], ["zwj", 8205], ["lrm", 8206], ["rlm", 8207]]);
const decodeEntities = (raw: string) => raw.replace(/&(?:#(\d+)|#x([\da-fA-F]+)|(\w+));/g, (match: string, decimal?: string, hex?: string, name?: string) => {
  const code = decimal ? Number.parseInt(decimal, 10) : hex ? Number.parseInt(hex, 16) : INVISIBLE_ENTITIES.get(name ?? "");
  return code === undefined || code > 0x10ffff ? match : String.fromCodePoint(code);
});
// Görünmeyen karakterler Unicode özellikleriyle tanımlanır: boşluklar (bölünmez boşluk dahil), denetim ve biçim karakterleri
// (sıfır genişlikli boşluk ve birleştiriciler, yön işaretleri, yumuşak tire) ve "varsayılan olarak yok sayılan" karakterler.
const INVISIBLE = new RegExp("[\\s\\p{Cc}\\p{Cf}\\p{Default_Ignorable_Code_Point}]", "gu");
/** Çalışma anındaki metinde (varlıkları çözülmüş JSX yazısı ya da JS dizgisi) görünen bir karakter var mı? */
const visible = (content: string) => content.replace(INVISIBLE, "") !== "";
/** JSX öznitelik dizgisinin (`a="…"`) çalışma anındaki değeri. Öznitelik dizgisinin ham metni başka hiçbir yerde okunmaz. */
const jsxStringValue = (literal: ts.StringLiteral) => decodeEntities(literal.text);
/**
 * Bu dizgi `aria-hidden` değeri olarak öğeyi gizler mi? Boş dizgi ve "false" gizlemez. Geçerli öbür değer "true"dur; geçersiz
 * değerlerde ("TRUE", "yes", "1") tarayıcılar farklı davranır, tarama katı tarafı seçer ve gizli sayar.
 */
const hidesAs = (content: string) => content !== "" && content.toLowerCase() !== "false";

/** Bir ifadenin değeri: hangi dalı seçtireceği (doğru mu, boş mu) ile çizildiğinde görünür yazı verip vermediği ayrıdır. */
interface Value {
  truthy: boolean;
  nullish: boolean;
  /** Çizilince görünür yazı (öznitelikte: boş olmayan metin) verir. */
  text: boolean;
  /** `aria-hidden` değeri olarak öğeyi gizler: `false`, "false", boş dizgi ve boş değer dışındaki, kaynakta belli her değer. */
  hides: boolean;
}
const value = (truthy: boolean, text: boolean, nullish = false, hides = false): Value => ({ truthy, nullish, text, hides });

/** Koşulun denenen değerini verir; `asked` ise ifade bir dal seçmek için sınanıyor demektir ve koşul olarak kaydedilir. */
function answer(conditions: Conditions, key: string, asked: boolean, fallback: boolean): boolean {
  if (asked) conditions.asked.add(key);
  return conditions.values.get(key) ?? fallback;
}

/**
 * Koşulların verilen değerlerinde ifadenin değerini bulur. React'in çizim kuralları: `true`, `false`, `null`, `undefined`
 * hiçbir şey çizmez; boş dizgi yazı değildir; sayı (0 dahil) yazıdır; `a && b` a yanlışsa a'nın kendisini, `a || b` a
 * doğruysa a'nın kendisini, `a ?? b` a boş değilse a'nın kendisini verir. `question`: bu ifadenin değeri bir dal seçmek için
 * sınanıyorsa neye göre sınandığı; işlecin koruduğu sol değer dışarıdaki soruyu da yanıtlar (`(a ?? b) ? … : …` içinde a hem
 * "boş mu" hem "doğru mu" diye sınanır). Değeri kaynakta görünmeyen ifade (değişken, özellik, çağrı, şablon dizgisi) doğruyken
 * yazı, yanlışken hiçbir şey sayılır; değerlendirmenin ulaştığı hiçbir yerde sınanmıyorsa doğru sayılır.
 */
function evaluate(node: ts.Expression, conditions: Conditions, question: Question = RENDERED): Value {
  const inner = unwrap(node);
  if (ts.isJsxElement(inner) || ts.isJsxFragment(inner) || ts.isJsxSelfClosingElement(inner)) return value(true, childShowsText(inner, conditions), false, true);
  if (isNeverText(inner)) return value(true, false, false, true);
  if (ts.isVoidExpression(inner) || ts.isOmittedExpression(inner)) return value(false, false, true);
  if (isComma(inner)) return evaluate(inner.right, conditions, question);
  if (inner.kind === ts.SyntaxKind.TrueKeyword) return value(true, false, false, true);
  if (inner.kind === ts.SyntaxKind.FalseKeyword) return value(false, false);
  if (inner.kind === ts.SyntaxKind.NullKeyword || isUndefined(inner)) return value(false, false, true);
  if (ts.isStringLiteral(inner) || ts.isNoSubstitutionTemplateLiteral(inner)) return value(inner.text !== "", visible(inner.text), false, hidesAs(inner.text));
  if (ts.isNumericLiteral(inner)) return value(Number(inner.text) !== 0, true, false, true);
  if (isNegation(inner)) {
    const truthy = !evaluate(inner.operand, conditions, TRUTHY).truthy;
    return value(truthy, false, false, truthy);
  }
  if (ts.isArrayLiteralExpression(inner)) return value(true, anyOf(inner.elements.map((element) => ts.isSpreadElement(element) || evaluate(element, conditions).text)), false, true);
  if (ts.isConditionalExpression(inner)) return evaluate(evaluate(inner.condition, conditions, TRUTHY).truthy ? inner.whenTrue : inner.whenFalse, conditions, question);
  if (isLogical(inner)) {
    const coalesce = operator(inner) === ts.SyntaxKind.QuestionQuestionToken;
    const left = evaluate(inner.left, conditions, { truthy: question.truthy || !coalesce, nullish: question.nullish || coalesce });
    const keepLeft = coalesce ? !left.nullish : operator(inner) === ts.SyntaxKind.AmpersandAmpersandToken ? !left.truthy : left.truthy;
    return keepLeft ? left : evaluate(inner.right, conditions, question);
  }
  // Karşılaştırma sonucu doğru/yanlıştır: boş olamaz, çizilince hiçbir şey görünmez.
  const comparison = isComparison(inner);
  const key = conditionKey(inner);
  const nullish = !comparison && answer(conditions, NULLISH + key, question.nullish, false);
  const truthy = !nullish && answer(conditions, key, question.truthy, true);
  return value(truthy, truthy && !comparison, nullish, truthy && comparison);
}

/**
 * Öğenin açılış etiketinde verilen adı (küçük harfle) taşıyan öznitelikler. HTML'de öznitelik adında büyük-küçük harf ayrımı
 * yoktur (`ARIA-HIDDEN` da `aria-hidden`dır) ve TypeScript tireli adları denetlemez; bu yüzden ad küçük harfe çevrilerek aranır.
 * Aynı ad farklı yazımla birden çok kez geçebilir; hangisinin geçerli kalacağı bilinemez, çağıran katı tarafı seçer.
 */
function attributesOf(opening: ts.JsxOpeningLikeElement, name: string): ts.JsxAttribute[] {
  return opening.attributes.properties.filter((property): property is ts.JsxAttribute => ts.isJsxAttribute(property) && property.name.getText().toLowerCase() === name);
}

/** Öznitelik boş olmayan bir metin veriyor mu? Değersiz öznitelik metin değildir; ad birden çok yazımla geçiyorsa hepsi vermelidir. */
function attributeGivesText(opening: ts.JsxOpeningLikeElement, name: string, conditions: Conditions): boolean {
  const results = attributesOf(opening, name).map((attribute) => {
    const initializer = attribute.initializer;
    if (!initializer) return false;
    if (ts.isStringLiteral(initializer)) return visible(jsxStringValue(initializer));
    return ts.isJsxExpression(initializer) && initializer.expression !== undefined && evaluate(initializer.expression, conditions).text;
  });
  return results.length > 0 && results.every(Boolean);
}

/**
 * `aria-hidden`: öğe ve içeriği ekran okuyucuya sunulmaz, ad vermez. Değersiz öznitelik ve `false`, "false", boş dizgi, boş değer
 * dışındaki, kaynakta belli her değer gizler (bkz. `hidesAs`). Ad birden çok yazımla geçiyorsa biri gizliyorsa gizli sayılır.
 */
function isAriaHidden(opening: ts.JsxOpeningLikeElement, conditions: Conditions): boolean {
  return anyOf(attributesOf(opening, "aria-hidden").map((attribute) => {
    const initializer = attribute.initializer;
    if (!initializer) return true;
    if (ts.isStringLiteral(initializer)) return hidesAs(jsxStringValue(initializer));
    // Özniteliğin değeri burada sınanır: `aria-hidden={k > 0}` içindeki karşılaştırma bir koşuldur.
    return ts.isJsxExpression(initializer) && initializer.expression !== undefined && evaluate(initializer.expression, conditions, TRUTHY).hides;
  }));
}

/** HTML öğesi küçük harfle başlar ve nokta içermez (`img`, `span`); gerisi bileşendir (`Image`, `motion.img`). */
const isComponent = (tagName: string) => !/^[a-z][^.]*$/.test(tagName);

/**
 * Çocuk, düğmeye okunabilir bir içerik katıyor mu? Görünür yazı; kendi `aria-label` değeri olan öğe; `alt` yazısı olan resim
 * (`img` ya da bir bileşen). `aria-hidden` taşıyan öğe ve içeriği sayılmaz (ör. süs amaçlı `×`).
 */
function childShowsText(child: ts.JsxChild, conditions: Conditions): boolean {
  if (ts.isJsxText(child)) return visible(decodeEntities(child.text));
  if (ts.isJsxExpression(child)) return child.expression !== undefined && evaluate(child.expression, conditions).text;
  if (ts.isJsxFragment(child)) return showsText(child.children, conditions);
  const opening = ts.isJsxElement(child) ? child.openingElement : child;
  if (isAriaHidden(opening, conditions)) return false;
  const tagName = opening.tagName.getText();
  return anyOf([
    !conditions.textOnly && attributeGivesText(opening, "aria-label", conditions),
    !conditions.textOnly && (tagName === "img" || isComponent(tagName)) && attributeGivesText(opening, "alt", conditions),
    ts.isJsxElement(child) && showsText(child.children, conditions),
  ]);
}

/**
 * Kardeş parçaların hepsi değerlendirilir, ilk yazıda durulmaz: bir parçada yalnızca çizilen ifade başka bir parçada
 * sınanıyorsa koşul olarak bulunur ve sonuç parçaların sırasına bağlı kalmaz. Değerlendirilmeyen tek yer, işlecin seçmediği
 * dal (`false && …`) ile gizli (`aria-hidden`) öğenin içidir.
 */
const anyOf = (results: readonly boolean[]) => results.some(Boolean);
const showsText = (children: readonly ts.JsxChild[], conditions: Conditions) => anyOf(children.map((child) => childShowsText(child, conditions)));

/**
 * `shows` sonucunu koşulların bütün olası değerlerinde dener ve dört durumdan birine indirir. Koşullar önceden toplanmaz:
 * değerlendirmenin sorduğu her yeni koşul listeye eklenir ve deneme, yeni koşul çıkmayana dek yinelenir. Böylece sonucu
 * etkileyen her koşul denenir, hiç ulaşılmayan bir daldaki koşul denenmez.
 */
function stateOf(shows: (conditions: Conditions) => boolean): TextState {
  const keys: string[] = [];
  for (;;) {
    const asked = new Set<string>();
    const runs: { values: ReadonlyMap<string, boolean>; shows: boolean }[] = [];
    for (let mask = 0; mask < 2 ** keys.length; mask += 1) {
      const values = new Map(keys.map((key, index) => [key, (mask & (1 << index)) !== 0] as const));
      // Aynı ifade hem boş hem doğru olamaz; böyle bir durum denenmez.
      if (keys.some((key) => key.startsWith(NULLISH) && values.get(key) && values.get(key.slice(NULLISH.length)))) continue;
      runs.push({ values, shows: shows({ values, asked }) });
    }
    const fresh = [...asked].filter((key) => !keys.includes(key));
    if (fresh.length > 0) {
      keys.push(...fresh);
      if (keys.length > MAX_CONDITIONS) return "unknown";
      continue;
    }
    if (runs.every((run) => run.shows)) return "always";
    if (runs.every((run) => !run.shows)) return "never";
    // Tek bir koşulun bir değeri, öbür koşullar ne olursa olsun sonucu yok ediyorsa bu kesindir.
    const silences = (key: string, state: boolean) => {
      const matching = runs.filter((run) => run.values.get(key) === state);
      return matching.length > 0 && matching.every((run) => !run.shows);
    };
    return keys.some((key) => silences(key, true) || silences(key, false)) ? "sometimes" : "unknown";
  }
}

/** Erişilebilir ad veren öznitelikler. */
const NAME_ATTRIBUTES = ["aria-label", "aria-labelledby", "title"];
const givesName = (tag: Tag, conditions: Conditions) => anyOf(NAME_ATTRIBUTES.map((name) => attributeGivesText(tag.opening, name, conditions)));

/** İçeriğin okunabilirlik durumu (görünür yazı ya da ad veren çocuk). */
const contentState = (tag: Tag): TextState => stateOf((conditions) => showsText(tag.children, conditions));
/** İçerik ile adın birlikte durumu: öğenin okunabilir içeriği ya da boş olmayan bir adı var mı? */
const readableState = (tag: Tag): TextState => stateOf((conditions) => anyOf([showsText(tag.children, conditions), givesName(tag, conditions)]));

const lacks = (state: TextState) => state === "never" || state === "sometimes";
/** İçeriği kesin olarak okunamaz kalabilen öğe (yalnız simge, boş ya da bir koşulda yazısız). */
const needsName = (tag: Tag) => lacks(contentState(tag));
/** Kesin olarak hem okunabilir içeriksiz hem adsız kalabilen öğe; `unknown` için iddia edilmez. */
const lacksName = (tag: Tag) => lacks(readableState(tag));

/**
 * Düğmenin kendi yazısının durumu: yalnız hem görünen hem okunabilen yazı sayılır. Çocuğun `aria-label` ya da `alt` değeri
 * (adı olan simge ya da resim) ve gizli (`aria-hidden`) yazı sayılmaz.
 */
const plainTextState = (tag: Tag): TextState => stateOf((conditions) => showsText(tag.children, { ...conditions, textOnly: true }));
/**
 * Simge düğmesi: kendi yazısı kesin olarak eksik kalabilen düğme (yalnız simge, boş ya da bir koşulda yazısız). Ölçü kuralı
 * düğmeyi adından değil buradan tanır; ad ne yazılırsa yazılsın (ya da hiç yazılmasın) simge düğmesi ölçü denetimine girer.
 */
const isIconButton = (tag: Tag) => lacks(plainTextState(tag));

/**
 * Karşılaştırma için ad: görünmeyen karakterler atılır (boşluk türleri tek boşluğa iner), baştaki ve sondaki boşluk kırpılır,
 * Türkçe kurallarıyla küçük harfe çevrilir ("Sil", "SİL", " sil " ve sonuna sıfır genişlikli boşluk eklenmiş "Sil" aynıdır).
 */
const normalizeLabel = (label: string) => label.replace(INVISIBLE, (character) => (/\s/.test(character) ? " " : "")).replace(/ +/g, " ").trim().toLocaleLowerCase("tr");
/**
 * `aria-label` içinde geçen dizgiler, karşılaştırma için düzleştirilmiş: düz değerde kendisi, ifadede bütün dizgi parçaları.
 * Ad birden çok yazımla geçiyorsa hepsinin dizgileri alınır. Yalnızca bilinen istisnaları tanımak için kullanılır; hangi
 * düğmenin denetleneceği ada bağlı değildir.
 */
const labelTexts = (tag: Tag): string[] => attributesOf(tag.opening, "aria-label").flatMap((attribute) => {
  const initializer = attribute.initializer;
  if (!initializer) return [];
  if (ts.isStringLiteral(initializer)) return [jsxStringValue(initializer)];
  return ts.isJsxExpression(initializer) && initializer.expression ? stringParts(initializer.expression) : [];
}).map(normalizeLabel);
/**
 * Düğme bir şey yapıyor mu? Tıklama işleyicisi (`onClick`) vardır ya da bir forma bağlıdır (formun içindedir ya da `form`
 * özniteliği taşır) ve türü "button" değildir (formu gönderir ya da sıfırlar). Türü "button" olan düğme forma bağlı olsa da
 * işleyicisiz hiçbir şey yapmaz. Üst öğede dinlenen tıklama görülmez; böyle bir düğmeye işleyici açıkça yazılır.
 */
const doesSomething = (tag: Tag) => tag.attributes.has("onClick") || ((tag.insideForm || tag.attributes.has("form")) && tag.attributes.get("type")?.literal?.toLowerCase() !== "button");

/** Sayı alanı: `type` değeri düz dizgiyle "number" (HTML'de bu değerde büyük-küçük harf ayrımı yoktur). */
const isNumberInput = (tag: Tag) => tag.attributes.get("type")?.literal?.toLowerCase() === "number";

/** Dosyadaki adlandırmalar: ad → o adı bağlayan bütün bildirimler (değişken, parametre, yapı bozma, işlev, sınıf, içe aktarma). */
function bindingsOf(tree: ts.SourceFile): Map<string, ts.Node[]> {
  const bindings = new Map<string, ts.Node[]>();
  const visit = (node: ts.Node) => {
    const named = ts.isVariableDeclaration(node) || ts.isParameter(node) || ts.isBindingElement(node) || ts.isFunctionDeclaration(node) || ts.isFunctionExpression(node) || ts.isClassDeclaration(node) || ts.isClassExpression(node) || ts.isImportClause(node) || ts.isImportSpecifier(node) || ts.isNamespaceImport(node) || ts.isImportEqualsDeclaration(node) || ts.isEnumDeclaration(node) || ts.isModuleDeclaration(node);
    if (named && node.name && ts.isIdentifier(node.name)) bindings.set(node.name.text, [...(bindings.get(node.name.text) ?? []), node]);
    ts.forEachChild(node, visit);
  };
  visit(tree);
  return bindings;
}

const isWithin = (node: ts.Node, scope: ts.Node) => { for (let current: ts.Node | undefined = node; current; current = current.parent) if (current === scope) return true; return false; };

/**
 * Bir adın kaynakta yazılı değerini bulur; emin olunamayan her durumda `undefined` döner. Ad dosyada TEK bir yerde bağlanmış
 * olmalıdır (aynı adla ikinci bir değişken, parametre ya da içe aktarma varsa hangisinin kastedildiği taranmaz) ve kullanıldığı
 * yer bildirimin kapsamı içinde olmalıdır. `constantOf`: `const` ile bildirilen değişkenin başlangıç değeri. `returnOf`:
 * `const` ile bildirilen, gövdesi tek bir ifade olan ok işlevinin ya da tek deyimi `return` olan işlevin döndürdüğü ifade.
 * Yalnız `const` izlenir, çünkü yeniden atanamayan tek bildirim odur: `let`, `var`, parametre ve `function` bildirimiyle
 * verilen adlar sonradan değiştirilebilir.
 */
function resolverOf(tree: ts.SourceFile) {
  const bindings = bindingsOf(tree);
  const only = (reference: ts.Identifier) => { const declarations = bindings.get(reference.text) ?? []; return declarations.length === 1 ? declarations[0] : undefined; };
  const constantOf = (reference: ts.Identifier): ts.Expression | undefined => {
    const declaration = only(reference);
    if (!declaration || !ts.isVariableDeclaration(declaration) || !declaration.initializer) return undefined;
    const list = declaration.parent;
    if (!ts.isVariableDeclarationList(list) || (list.flags & ts.NodeFlags.BlockScoped) !== ts.NodeFlags.Const) return undefined;
    const scope = ts.isVariableStatement(list.parent) ? list.parent.parent : list.parent;
    return isWithin(reference, scope) ? declaration.initializer : undefined;
  };
  const returnOf = (callee: ts.Identifier): ts.Expression | undefined => {
    const candidate = constantOf(callee);
    const made = candidate && unwrap(candidate);
    if (!made || !(ts.isArrowFunction(made) || ts.isFunctionExpression(made))) return undefined;
    if (made.asteriskToken || made.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.AsyncKeyword)) return undefined;
    const body = made.body;
    if (!body) return undefined;
    if (!ts.isBlock(body)) return body;
    const [statement] = body.statements;
    return body.statements.length === 1 && ts.isReturnStatement(statement) ? statement.expression : undefined;
  };
  return { constantOf, returnOf };
}

interface ClassReading { values: string[]; opaque: string[]; resolver: ReturnType<typeof resolverOf>; visiting: Set<ts.Node> }

/**
 * Şablon dizgisindeki bir ifadenin (`${…}`) verebileceği sınıf dizgilerini toplar. Yalnız değeri kaynakta yazılı olan biçimler
 * okunur: dizgi, sayı, `k ? a : b` (iki dal; koşul önemsizdir), `k && a` (a; soldaki değer yanlışken "false", "0" ya da boş
 * yazılır, sınıf olamaz), `a || b` ve `a ?? b` (iki taraf), virgül (son değer), aynı dosyada tek yerde `const` ile bildirilen
 * ad (başlangıç değeri) ve aynı dosyada `const` ile bildirilen tek ifadeli işlevin çağrısı (döndürdüğü ifade; bkz.
 * `resolverOf`). Başka her ifade (parametre, içe aktarılan ad, `function` bildirimi, özellik, yöntem çağrısı, birleştirme,
 * iç içe şablon) herhangi bir sınıfı taşıyabilir ve `opaque` listesine yazılır.
 */
function classValues(node: ts.Expression, reading: ClassReading): void {
  const inner = unwrap(node);
  if (ts.isStringLiteral(inner) || ts.isNoSubstitutionTemplateLiteral(inner) || ts.isNumericLiteral(inner)) reading.values.push(inner.text);
  else if (inner.kind === ts.SyntaxKind.TrueKeyword || inner.kind === ts.SyntaxKind.FalseKeyword || inner.kind === ts.SyntaxKind.NullKeyword || isUndefined(inner)) return;
  else if (ts.isConditionalExpression(inner)) {
    classValues(inner.whenTrue, reading);
    classValues(inner.whenFalse, reading);
  } else if (isLogical(inner)) {
    if (operator(inner) !== ts.SyntaxKind.AmpersandAmpersandToken) classValues(inner.left, reading);
    classValues(inner.right, reading);
  } else if (isComma(inner)) classValues(inner.right, reading);
  else {
    const target = ts.isIdentifier(inner) ? reading.resolver.constantOf(inner) : ts.isCallExpression(inner) && ts.isIdentifier(inner.expression) && !inner.questionDotToken ? reading.resolver.returnOf(inner.expression) : undefined;
    if (!target || reading.visiting.has(target)) { reading.opaque.push(inner.getText()); return; }
    reading.visiting.add(target);
    classValues(target, reading);
    reading.visiting.delete(target);
  }
}

/** Bir TSX metnindeki bütün JSX öğelerini (kendiliğinden kapananlar dahil) belgedeki sırasıyla döndürür. */
function jsxTags(text: string, file = "sample.tsx"): Tag[] {
  const tree = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const resolver = resolverOf(tree);
  const tags: Tag[] = [];
  const describeTag = (opening: ts.JsxOpeningElement | ts.JsxSelfClosingElement, children: readonly ts.JsxChild[], insideForm: boolean): Tag => {
    const tag: Tag = { name: opening.tagName.getText(tree), attributes: new Map(), staticClasses: [], dynamicClasses: [], gluedClasses: [], opaqueClasses: [], classNameReadable: true, hasSpread: false, insideForm, opening, children, source: opening.getText(tree).slice(0, 90) };
    for (const property of opening.attributes.properties) {
      if (!ts.isJsxAttribute(property)) { tag.hasSpread = true; continue; }
      // Tireli adlarda (`aria-…`, `data-…`) büyük-küçük harf ayrımı yoktur ve TypeScript bunları denetlemez; küçük harfle saklanır.
      const name = property.name.getText(tree);
      const key = name.includes("-") ? name.toLowerCase() : name;
      const value = property.initializer;
      const expression = value && ts.isJsxExpression(value) ? value.expression : value;
      // JSX öznitelik dizgisinde (`a="…"`) HTML varlıkları çözülür; ayraç içindeki JS dizgisi (`a={"…"}`) olduğu gibi kalır.
      const literal = value && ts.isStringLiteral(value) ? jsxStringValue(value) : expression && (ts.isStringLiteral(expression) || ts.isNoSubstitutionTemplateLiteral(expression)) ? expression.text : undefined;
      tag.attributes.set(key, { literal, expression: literal === undefined && expression && !ts.isJsxElement(expression) && !ts.isJsxSelfClosingElement(expression) && !ts.isJsxFragment(expression) ? expression : undefined, bare: !value });
      if (key !== "className" || !value) continue;
      if (literal !== undefined) tag.staticClasses = words([literal]);
      else if (expression && ts.isTemplateExpression(expression)) {
        const fixed = [expression.head.text, ...expression.templateSpans.map((span) => span.literal.text)];
        const reading: ClassReading = { values: [], opaque: tag.opaqueClasses, resolver, visiting: new Set() };
        for (const span of expression.templateSpans) classValues(span.expression, reading);
        tag.dynamicClasses = words(reading.values);
        // Sabit parça bir ifadeye boşluksuz bitişiyorsa oradaki sınıf adı ifadeyle tamamlanır ve okunamaz; aralarında hiçbir
        // şey olmayan iki ifadenin değerleri de birbirine yapışır.
        fixed.forEach((part, index) => {
          const pieces = words([part]);
          if (index > 0 && index < fixed.length - 1 && part === "") tag.gluedClasses.push("${…}${…}");
          if (index < fixed.length - 1 && part !== "" && !/[ \t\n\f\r]$/.test(part)) tag.gluedClasses.push(pieces[pieces.length - 1]);
          if (index > 0 && part !== "" && !/^[ \t\n\f\r]/.test(part)) tag.gluedClasses.push(pieces[0]);
        });
        tag.staticClasses = words(fixed).filter((name) => !tag.gluedClasses.includes(name));
      } else {
        tag.classNameReadable = false;
        tag.dynamicClasses = expression ? words(stringParts(expression)) : [];
      }
    }
    return tag;
  };
  const visit = (node: ts.Node, insideForm: boolean) => {
    if (ts.isJsxElement(node)) tags.push(describeTag(node.openingElement, node.children, insideForm));
    else if (ts.isJsxSelfClosingElement(node)) tags.push(describeTag(node, [], insideForm));
    const inside = insideForm || (ts.isJsxElement(node) && node.openingElement.tagName.getText(tree) === "form");
    ts.forEachChild(node, (child) => visit(child, inside));
  };
  visit(tree, false);
  return tags;
}

// Ölçü sınıflarının değeri projenin kendi Tailwind yapılandırmasından okunur; `min-w-13` gibi tabloda olmayan bir sınıf için
// Tailwind CSS üretmez, burada da ölçü vermez.
const theme = resolveConfig(tailwindConfig).theme as unknown as Record<string, Record<string, string> | undefined>;
const THEME_KEY = { "min-w": "minWidth", "min-h": "minHeight", "max-w": "maxWidth", "max-h": "maxHeight", w: "width", h: "height", size: "size" } as const;
type Utility = keyof typeof THEME_KEY;
const TOUCH_TARGET_PX = 44;
const FIELD_FONT_PX = 16;
/** Telefon: bu genişlikten dar ekran (alan yazısı kuralındaki `max-width: 639px` ile aynı sınır). */
const PHONE_BELOW_PX = 640;

function toPx(value: string): number | undefined {
  const length = value.match(/^(\d*\.?\d+)(px|rem)$/);
  if (length) return Number(length[1]) * (length[2] === "rem" ? 16 : 1);
  if (value === "0") return 0;
  if (value === "100%") return Infinity;
  return undefined;
}

/**
 * Yalnızca telefon genişliğinin ÜSTÜNDE geçerli olan önekler; telefondaki taban ölçüyü değiştirmezler. Projenin ekran
 * tablosundan okunur: değeri düz bir en küçük genişlik olan ve 640 pikselden başlayan ekranlar (`sm`, `md`, `lg`, `xl`, `2xl`).
 */
const DESKTOP_ONLY = new Set(Object.entries(theme.screens ?? {}).filter(([, width]) => typeof width === "string" && (toPx(width) ?? 0) >= PHONE_BELOW_PX).map(([name]) => name));

/**
 * Sınıf adını Tailwind'in yaptığı gibi öneklerine ve asıl sınıfa ayırır: ayraç içindeki `:` ayırıcı değildir (`[&:hover]:w-8`,
 * `w-[length:36px]`, `supports-[display:grid]:grid`); asıl sınıfın başındaki `!` (önemli) atılır.
 */
function classParts(name: string): { variants: string[]; utility: string } {
  const CLOSER: Record<string, string> = { "(": ")", "[": "]", "{": "}" };
  const variants: string[] = [];
  const open: string[] = [];
  let start = 0;
  for (let index = 0; index < name.length; index += 1) {
    const character = name[index];
    if (character === ":" && open.length === 0) {
      variants.push(name.slice(start, index));
      start = index + 1;
    } else if (character in CLOSER) open.push(CLOSER[character]);
    else if (character === open[open.length - 1]) open.pop();
  }
  return { variants, utility: name.slice(start).replace(/^!/, "") };
}

/**
 * Keyfi CSS özelliği (`[height:36px]`, `[maxHeight:36px]`, `![width:20px]`): asıl sınıfın kendisi bir köşeli ayraçtır. Özelliğin
 * adına bakılmaz; ad hangi harflerle yazılırsa yazılsın (Tailwind `maxHeight` yazımını `max-height` yapar) tanınır.
 */
const isArbitraryProperty = (name: string) => classParts(name).utility.startsWith("[");

interface Sizing { utility: Utility; /** Telefonda geçerli olabilir (önek yok ya da önek masaüstüne özgü değil). */ mobile: boolean; /** Piksel değeri; çözülemiyorsa `undefined`. */ px: number | undefined }

/** Bir sınıf ölçü belirliyorsa hangi ölçüyü, telefonda geçerli olup olmadığını ve piksel değerini döndürür. */
function sizingOf(name: string): Sizing | undefined {
  const { variants, utility: body } = classParts(name);
  const match = body.match(/^(min-w|min-h|max-w|max-h|w|h|size)-(.+)$/);
  if (!match) return undefined;
  const utility = match[1] as Utility;
  if (variants.length > 0) return { utility, mobile: !variants.every((variant) => DESKTOP_ONLY.has(variant)), px: undefined };
  const arbitrary = match[2].match(/^\[(.+)\]$/);
  const value = arbitrary ? arbitrary[1] : theme[THEME_KEY[utility]]?.[match[2]];
  return { utility, mobile: true, px: value === undefined ? undefined : toPx(value) };
}

/** Düğmenin ölçüsünü belirsiz bırakan durumlar; boş liste, ölçünün yalnız koşulsuz sınıflardan okunabildiğini gösterir. */
function sizingProblems(tag: Tag): string[] {
  const problems: string[] = [];
  if (!tag.classNameReadable) problems.push("className dizgi ya da şablon dizgisi değil");
  if (tag.hasSpread) problems.push("yayılan öznitelik var");
  // `style` ve `class` hangi harflerle yazılırsa yazılsın tarayıcıda aynı özniteliktir (`STYLE`, `CLASS`); `class`, `className`
  // ile verilen sınıfların yerine geçebilir.
  if (attributesOf(tag.opening, "style").length > 0) problems.push("style özniteliği var");
  if (attributesOf(tag.opening, "class").length > 0) problems.push("class özniteliği var");
  for (const name of tag.gluedClasses) problems.push(`sınıf adı ifadeyle birleşik: ${name}`);
  for (const part of tag.opaqueClasses) problems.push(`sınıf ifadesinde değeri kaynakta yazılı olmayan parça: ${part}`);
  // Keyfi CSS özelliği ölçüyü ölçü sınıfı olmadan değiştirebilir; değeri burada okunmaz.
  for (const name of [...tag.staticClasses, ...tag.dynamicClasses]) if (isArbitraryProperty(name)) problems.push(`keyfi CSS özelliği sınıfı: ${name}`);
  for (const name of tag.dynamicClasses) if (sizingOf(name)) problems.push(`ölçü sınıfı koşullu ifadede: ${name}`);
  for (const name of tag.staticClasses) {
    const sizing = sizingOf(name);
    if (sizing?.mobile && sizing.px === undefined) problems.push(`çözümlenemeyen ölçü sınıfı: ${name}`);
  }
  return problems;
}

interface MobileSize {
  /** Güvence edilen en küçük ölçü (piksel); ölçü verilmemişse 0. */
  width: number;
  height: number;
  /** Ölçünün çıkabileceği en büyük değer: `w-*`, `h-*` ya da `size-*` ile sabitlenmişse o değer, yalnız `max-*` varsa o sınır, yoksa sınırsız. */
  maxWidth: number;
  maxHeight: number;
}

/**
 * Koşulsuz sınıfların telefondaki ölçüsü (piksel). Aynı ölçüyü belirleyen birden çok sınıf varsa hangisinin kazanacağı sınıf
 * sırasından bilinemez; küçük olanı alınır. CSS'teki gibi `max-*` ölçüyü üstten, `min-*` alttan sınırlar ve ikisi çelişirse
 * `min-*` kazanır. Ölçü sabitlenmemişse (içeriğe bağlıysa) güvence edilen değer yalnız alt sınırdır.
 */
function mobileSize(classes: readonly string[]): MobileSize {
  const known = classes.map(sizingOf).filter((sizing): sizing is Sizing & { px: number } => sizing !== undefined && sizing.mobile && sizing.px !== undefined);
  const least = (utilities: readonly Utility[]) => {
    const values = known.filter((sizing) => utilities.includes(sizing.utility)).map((sizing) => sizing.px);
    return values.length ? Math.min(...values) : undefined;
  };
  const measure = (fixing: readonly Utility[], lower: Utility, upper: Utility) => {
    const fixed = least(fixing);
    const floor = least([lower]) ?? 0;
    const ceiling = least([upper]) ?? Infinity;
    return { guaranteed: Math.max(Math.min(fixed ?? 0, ceiling), floor), most: Math.max(Math.min(fixed ?? Infinity, ceiling), floor) };
  };
  const width = measure(["w", "size"], "min-w", "max-w");
  const height = measure(["h", "size"], "min-h", "max-h");
  return { width: width.guaranteed, height: height.guaranteed, maxWidth: width.most, maxHeight: height.most };
}

/**
 * Ölçü kurallarının bilinen istisnaları. Düğme dosyası, adı ve (verilmişse) sınıflarıyla tanınır; her istisna en çok bir düğmeyle
 * eşleşebilir ve o düğmenin alt sınırı `least` olur. Yeni bir istisna ancak buraya gerekçesiyle yazılarak eklenir.
 */
const SIZE_EXCEPTIONS: readonly { file: string; label: string; classes: readonly string[]; least: number; reason: string }[] = [
  { file: "src/components/mobile-nav.tsx", label: "menüyü kapat", classes: ["inset-0"], least: 0, reason: "yan menünün arka planı: ekranı kaplar, ölçüsü sınıftan değil konumdan gelir" },
];
const exceptionFor = (tag: Tag & { file: string }) => SIZE_EXCEPTIONS.find((exception) => exception.file === tag.file && labelTexts(tag).includes(exception.label) && exception.classes.every((name) => tag.staticClasses.includes(name)));
/** Düğmenin telefonda taşıması gereken en küçük ölçü: 44 piksel, bilinen istisnada o istisnanın sınırı. */
const sizeFloor = (tag: Tag & { file: string }) => exceptionFor(tag)?.least ?? TOUCH_TARGET_PX;

const sources = ["src/app", "src/components"].flatMap((dir) => sourceFiles(dir)).map((file) => {
  const text = readFileSync(file, "utf8");
  return { file, text, tags: jsxTags(text, file) };
});
const located = (names: readonly string[]) => sources.flatMap(({ file, tags }) => tags.filter((tag) => names.includes(tag.name)).map((tag) => ({ file, ...tag })));
const buttons = located(["button"]);
const where = ({ file, source }: { file: string; source: string }) => `${file}: ${source}`;
const allClasses = (tag: Tag) => [...tag.staticClasses, ...tag.dynamicClasses, ...tag.gluedClasses];
/** Boşlukları tek boşluğa indirir; biçim değişikliği (satır kırma, girinti) taramayı bozmasın diye. */
const squeeze = (text: string) => text.replace(/\s+/g, " ");
const globals = squeeze(readFileSync("src/app/globals.css", "utf8"));
const firstTag = (jsx: string) => jsxTags(`const view = ${jsx};`)[0];

describe("etiket ayrıştırıcısı", () => {
  it("dizgi içindeki ayraçlar, `>` ve kapanış etiketi taramayı yanıltmaz", () => {
    const sample = [
      "const view = <div>",
      "  <button data-note={\"{\"} title=\"a > b\" tabIndex={-1} onClick={() => close()} className=\"absolute inset-0\"/>",
      "  <button data-note={\"</button>\"} onClick={() => count > 1 && open()} aria-label=\"Kaydı sil\" className={`grid size-11 ${active ? \"text-a sm:size-9\" : \"text-b\"}`}><Trash2 size={14}/></button>",
      "  <button disabled className=\"min-h-11\">{label}</button>",
      "  <button><span><Check size={1}/></span></button>",
      "</div>;",
    ].join("\n");
    const parsed = jsxTags(sample).filter((tag) => tag.name === "button");
    expect(parsed.length).toBe(4);
    expect(parsed[0].attributes.get("data-note")?.literal).toBe("{");
    expect(parsed[0].attributes.get("title")?.literal).toBe("a > b");
    expect(parsed[0].staticClasses).toEqual(["absolute", "inset-0"]);
    expect(contentState(parsed[0])).toBe("never");
    expect(parsed[1].attributes.get("aria-label")?.literal).toBe("Kaydı sil");
    expect(parsed[1].staticClasses).toEqual(["grid", "size-11"]);
    expect(parsed[1].dynamicClasses).toEqual(["text-a", "sm:size-9", "text-b"]);
    expect(contentState(parsed[1])).toBe("never");
    expect(parsed[2].attributes.get("disabled")?.bare).toBe(true);
    expect(contentState(parsed[2])).toBe("always");
    expect(contentState(parsed[3])).toBe("never");
    expect(parsed[3].attributes.has("aria-label")).toBe(false);
  });

  it("yan menünün arka planını, kapatma düğmesini ve menü düğmesini ayrı ayrı okur", () => {
    const parsed = buttons.filter(({ file }) => file === "src/components/mobile-nav.tsx");
    expect(parsed.length).toBeGreaterThanOrEqual(3);
    const backdrop = parsed.find((tag) => tag.staticClasses.includes("inset-0"));
    const close = parsed.find((tag) => labelTexts(tag).includes("menüyü kapat") && !tag.staticClasses.includes("inset-0"));
    const opener = parsed.find((tag) => tag.attributes.get("aria-controls")?.literal === "mobile-side-menu");
    expect(backdrop?.attributes.get("tabIndex")?.expression?.getText()).toBe("-1");
    expect(close && contentState(close)).toBe("never");
    expect(mobileSize(close?.staticClasses ?? []).width).toBeGreaterThanOrEqual(TOUCH_TARGET_PX);
    expect(mobileSize(close?.staticClasses ?? []).height).toBeGreaterThanOrEqual(TOUCH_TARGET_PX);
    expect(opener).toBeDefined();
  });
});

describe("görünür yazı ve erişilebilir ad", () => {
  const text = (jsx: string) => contentState(firstTag(jsx));
  /** İçeriği olmayan örnekte öğenin durumu adın durumudur: boş olmayan bir ad var mı? */
  const named = (jsx: string) => !lacksName(firstTag(jsx));

  it("hiçbir durumda yazısı olmayan içeriği tanır (simge, boş, simge dizisi, iki dalı da simge)", () => {
    expect(text("<button><X size={1}/></button>")).toBe("never");
    expect(text("<button/>")).toBe("never");
    expect(text("<button>{\" \"}</button>")).toBe("never");
    expect(text("<button>{null}</button>")).toBe("never");
    expect(text("<button>{[<Check key=\"done\" size={17}/>]}</button>")).toBe("never");
    expect(text("<button>{open ? <X size={1}/> : <Menu size={1}/>}</button>")).toBe("never");
    expect(text("<button>{open && <X size={1}/>}</button>")).toBe("never");
    expect(text("<button>{false && \"Yazı\"}</button>")).toBe("never");
    expect(text("<button><span><Check size={1}/></span></button>")).toBe("never");
  });

  it("her durumda yazısı olan içeriği tanır; birbirini tamamlayan koşulları ayrı ayrı değil birlikte değerlendirir", () => {
    expect(text("<button><Plus size={1}/>Ekle</button>")).toBe("always");
    expect(text("<button>{label}</button>")).toBe("always");
    expect(text("<button>{all ? \"Tümü\" : names[key]}</button>")).toBe("always");
    expect(text("<button><span>{count}</span></button>")).toBe("always");
    expect(text("<button>{done ? \"Tamamlandı\" : \"Tamamla\"}</button>")).toBe("always");
    expect(text("<button>{done && \"Tamamlandı\"}{!done && \"Tamamla\"}</button>")).toBe("always");
    expect(text("<button>{!(done) && \"Tamamla\"}{done && <b>Tamamlandı</b>}</button>")).toBe("always");
    expect(text("<button>{[<Check key=\"a\" size={1}/>, \"Tamam\"]}</button>")).toBe("always");
    expect(text("<button>{true && \"Yazı\"}</button>")).toBe("always");
    expect(text("<button>{label || \"Kapat\"}</button>")).toBe("always");
  });

  it("yazısı tek bir koşula bağlı olup bir durumda yazısız kalan içeriği tanır", () => {
    expect(text("<button>{open ? <X size={1}/> : \"Menü\"}</button>")).toBe("sometimes");
    expect(text("<button>{count > 0 && <span>{count}</span>}</button>")).toBe("sometimes");
    expect(text("<button>{done && \"Tamamlandı\"}</button>")).toBe("sometimes");
    expect(text("<button>{done && \"Tamamlandı\"}{done && \"!\"}</button>")).toBe("sometimes");
    expect(text("<button>{label || <X size={1}/>}</button>")).toBe("sometimes");
  });

  it("yazının yokluğu birden çok koşulun birlikte belirli değerler almasına bağlıysa iddiada bulunmaz", () => {
    expect(text("<button>{a > 0 && \"Var\"}{a <= 0 && \"Yok\"}</button>")).toBe("unknown");
    expect(text("<button>{status === \"ok\" && \"Tamam\"}{status !== \"ok\" && \"Hata\"}</button>")).toBe("unknown");
    // Tek bir koşulun bir değeri yazıyı öbür koşullardan bağımsız olarak yok ediyorsa bu kesindir.
    expect(text("<button>{open && <X size={1}/>}{busy && \"Bekle\"}</button>")).toBe("sometimes");
    expect(text("<button>{open ? <ChevronUp size={1}/> : <ChevronDown size={1}/>}{busy && \"Bekle\"}</button>")).toBe("sometimes");
    expect(text("<button>{open && busy && \"Bekle\"}</button>")).toBe("sometimes");
    // Hiç ulaşılmayan daldaki koşul denenmez; boşluk farkı koşulu değiştirmez, dizginin içindeki boşluk değiştirir.
    expect(text("<button>{false && open && \"Gizli\"}{busy && \"Bekle\"}</button>")).toBe("sometimes");
    expect(text("<button>{a>0 && \"Var\"}{!(a > 0) && \"Yok\"}</button>")).toBe("always");
    expect(text("<button>{mode === \"a b\" && \"Bir\"}{mode === \"ab\" && \"İki\"}</button>")).toBe("unknown");
    // Bir parçada yalnızca çizilen ifade başka bir parçada sınanıyorsa koşuldur; sonuç parçaların sırasına bağlı değildir.
    expect(text("<button>{label}{label && <X size={1}/>}</button>")).toBe("sometimes");
    expect(text("<button>{label && <X size={1}/>}{label}</button>")).toBe("sometimes");
    expect(text("<button>{[label, label && <X size={1}/>]}</button>")).toBe("sometimes");
    expect(text("<button>Kapat{label && <X size={1}/>}</button>")).toBe("always");
    expect(text("<button><img src=\"/x.png\" alt={label}/>{label ? null : <X size={1}/>}</button>")).toBe("sometimes");
    expect(needsName(firstTag("<button>{a > 0 && \"Var\"}{a <= 0 && \"Yok\"}</button>"))).toBe(false);
    expect(needsName(firstTag("<button>{open ? <X size={1}/> : \"Menü\"}</button>"))).toBe(true);
    expect(needsName(firstTag("<button><X size={1}/></button>"))).toBe(true);
    expect(needsName(firstTag("<button>{label}</button>"))).toBe(false);
  });

  it("işlecin seçtiği değer ile o değerin yazı çizmesini ayırır (React `true`, `false`, `null` çizmez; `0` çizer)", () => {
    // `||` ve `??` sol değeri seçtiğinde çizilen sol değerin kendisidir; `true` ve `false` hiçbir şey çizmez.
    expect(text("<button><Check size={17}/>{true || \"Tamamla\"}</button>")).toBe("never");
    expect(text("<button>{false ?? \"Tamamla\"}</button>")).toBe("never");
    expect(text("<button>{true ?? \"Tamamla\"}</button>")).toBe("never");
    expect(text("<button>{!done || \"Tamamla\"}</button>")).toBe("sometimes");
    expect(text("<button>{false || \"Tamamla\"}</button>")).toBe("always");
    expect(text("<button>{null ?? \"Tamamla\"}</button>")).toBe("always");
    expect(text("<button>{undefined ?? \"Tamamla\"}</button>")).toBe("always");
    expect(text("<button>{\"\" || \"Tamamla\"}</button>")).toBe("always");
    expect(text("<button>{\"Tamam\" || <X size={1}/>}</button>")).toBe("always");
    expect(text("<button>{\"\" ?? \"Tamamla\"}</button>")).toBe("never");
    // `&&` sol değer yanlışsa sol değerin kendisini verir: `false` ve boş dizgi çizilmez, `0` çizilir.
    expect(text("<button>{\"\" && \"Tamamla\"}</button>")).toBe("never");
    expect(text("<button>{0 && \"Tamamla\"}</button>")).toBe("always");
    expect(text("<button>{1 && <X size={1}/>}</button>")).toBe("never");
    expect(text("<button>{!done}</button>")).toBe("never");
    // Değeri kaynakta görünmeyen sol değer: doğruyken yazı, boşken sağ taraf.
    expect(text("<button>{label ?? \"Kapat\"}</button>")).toBe("always");
    expect(text("<button>{label ?? <X size={1}/>}</button>")).toBe("sometimes");
    expect(text("<button>{label && <b>{label}</b>}</button>")).toBe("sometimes");
    expect(text("<button>{label ? <b>{label}</b> : \"Adsız\"}</button>")).toBe("always");
    // İşlecin koruduğu sol değer dışarıdaki soruyu da yanıtlar: `label` boş değilse "doğru mu" diye de sınanır.
    expect(text("<button>{(label ?? \"\") ? \"Kapat\" : <X size={1}/>}</button>")).toBe("sometimes");
    expect(text("<button>{(label ?? \"Ad\") ? \"Kapat\" : <X size={1}/>}</button>")).toBe("unknown");
    expect(text("<button>{(label || \"Ad\") ? \"Kapat\" : <X size={1}/>}</button>")).toBe("always");
  });

  it("çocuk öğelerin koşullu özniteliklerini de koşul olarak dener (`alt`, `aria-label`, `aria-hidden`)", () => {
    expect(text("<button><img src=\"/x.png\" alt={done ? \"Tamamlandı\" : \"\"}/></button>")).toBe("sometimes");
    expect(text("<button><img src=\"/x.png\" alt={done ? \"Tamamlandı\" : \"Tamamla\"}/></button>")).toBe("always");
    expect(text("<button><span><img src=\"/x.png\" alt={label || \"\"}/></span></button>")).toBe("sometimes");
    expect(text("<button><Check size={17} aria-label={done ? \"Tamamlandı\" : undefined}/></button>")).toBe("sometimes");
    expect(text("<button><Check size={17} aria-label={done && \"Tamamlandı\"}/>{!done && \"Tamamla\"}</button>")).toBe("always");
    expect(text("<button><Check size={17} aria-label={done && \"Tamamlandı\"}/>{done && \"Tamam\"}</button>")).toBe("sometimes");
    expect(text("<button><span aria-hidden={done ? true : false}>Tamamla</span></button>")).toBe("sometimes");
    expect(text("<button><span aria-hidden={done ? \"true\" : \"false\"}>Tamamla</span></button>")).toBe("sometimes");
    expect(text("<button><span aria-hidden={!done}>Tamamla</span>{!done && \"Bekliyor\"}</button>")).toBe("always");
    expect(text("<button><span aria-hidden={count > 0}>Tamamla</span></button>")).toBe("sometimes");
    expect(text("<button><span aria-hidden={false}>Tamamla</span></button>")).toBe("always");
    // `alt` yalnız resimde ad verir: `img` öğesinde ya da bir bileşende (ör. Next'in `Image` bileşeni).
    expect(text("<button><Image src={logo} alt=\"Ana sayfa\"/></button>")).toBe("always");
    expect(text("<button><Image src={logo} alt={done ? \"Tamamlandı\" : \"\"}/></button>")).toBe("sometimes");
    expect(text("<button><span alt=\"Kapat\"/></button>")).toBe("never");
  });

  it("HTML varlıklarını yalnız derleyicinin çözdüğü yerde çözer: JSX yazısında ve JSX öznitelik dizgisinde", () => {
    // JS dizgisindeki `&nbsp;` görünen altı karakterdir.
    expect(text("<button><Check size={17}/>{\"&nbsp;\"}</button>")).toBe("always");
    expect(text("<button>{`&nbsp;`}</button>")).toBe("always");
    expect(text("<button><img src=\"/x.png\" alt={\"&nbsp;\"}/></button>")).toBe("always");
    expect(named("<button aria-label={\"&nbsp;\"}/>")).toBe(true);
    expect(firstTag("<button title={\"&amp;\"}/>").attributes.get("title")?.literal).toBe("&amp;");
    // JSX yazısında ve JSX öznitelik dizgisinde bölünmez boşluktur.
    expect(text("<button><Check size={17}/>&nbsp;</button>")).toBe("never");
    expect(text("<button><img src=\"/x.png\" alt=\"&nbsp;\"/></button>")).toBe("never");
    expect(named("<button aria-label=\"&nbsp;\"/>")).toBe(false);
    expect(named("<button title=\"&#160;&#xA0;\"/>")).toBe(false);
    expect(firstTag("<button title=\"a&#32;b&nbsp;c\"/>").attributes.get("title")?.literal).toBe(`a b${String.fromCharCode(160)}c`);
    // Sayıyla yazılan ve adı XHTML tablosunda olan görünmez karakterler çözülür; öbür yazımlar olduğu gibi görünür.
    expect(text("<button>&#32;&#x20;&#xA0;&#0160;&#x200b;&shy;&lrm;&rlm;&zwj;&zwnj;&ensp;&emsp;&thinsp;</button>")).toBe("never");
    expect(text("<button>&NBSP;</button>")).toBe("always");
    expect(text("<button>&#Xa0;</button>")).toBe("always");
    expect(text("<button>&hairsp;</button>")).toBe("always");
    expect(text("<button>&amp;</button>")).toBe("always");
    expect(text("<button>&constructor;</button>")).toBe("always");
    // JS dizgisinde kaçışla yazılan görünmez karakter de yazı değildir.
    expect(text("<button>{\"\\u00a0\\u200b\\u00ad\\ufeff\"}</button>")).toBe("never");
    expect(named("<button aria-label={\"\\u00a0\"}/>")).toBe(false);
  });

  it("kaynak metnini değil tarayıcıya giden değeri okur (`aria-hidden` değeri, öznitelik adında ve değerinde büyük-küçük harf)", () => {
    // `aria-hidden` dizgisinde de HTML varlıkları çözülür: `tr&#117;e` derlenince "true" olur.
    expect(text("<button><span aria-hidden=\"tr&#117;e\">Tamamla</span><Check size={17}/></button>")).toBe("never");
    expect(text("<button><span aria-hidden=\"fal&#115;e\">Tamamla</span></button>")).toBe("always");
    expect(text("<button><span aria-hidden={\"false\"}>Tamamla</span></button>")).toBe("always");
    expect(text("<button><span aria-hidden=\"False\">Tamamla</span></button>")).toBe("always");
    expect(text("<button><span aria-hidden=\"\">Tamamla</span></button>")).toBe("always");
    expect(text("<button><span aria-hidden={null}>Tamamla</span></button>")).toBe("always");
    expect(text("<button><span aria-hidden={undefined}>Tamamla</span></button>")).toBe("always");
    // Geçersiz değerlerde tarayıcılar farklı davranır; tarama katı tarafı seçer ve gizli sayar.
    expect(text("<button><span aria-hidden=\"TRUE\">Tamamla</span></button>")).toBe("never");
    expect(text("<button><span aria-hidden=\"yes\">Tamamla</span></button>")).toBe("never");
    expect(text("<button><span aria-hidden={\"True\"}>Tamamla</span></button>")).toBe("never");
    expect(text("<button><span aria-hidden={1}>Tamamla</span></button>")).toBe("never");
    expect(text("<button><span aria-hidden={done ? \"TRUE\" : \"false\"}>Tamamla</span></button>")).toBe("sometimes");
    // Öznitelik adı hangi harflerle yazılırsa yazılsın aynı özniteliktir; iki yazım birden varsa katı taraf seçilir.
    expect(text("<button><span ARIA-HIDDEN=\"true\">Tamamla</span></button>")).toBe("never");
    expect(text("<button><span Aria-Hidden>Tamamla</span></button>")).toBe("never");
    expect(text("<button><span aria-hidden=\"false\" ARIA-HIDDEN=\"true\">Tamamla</span></button>")).toBe("never");
    expect(text("<button><X size={1} ARIA-LABEL=\"Kapat\"/></button>")).toBe("always");
    expect(text("<button><X size={1} aria-label=\"Kapat\" ARIA-LABEL=\"\"/></button>")).toBe("never");
    expect(named("<button ARIA-LABEL=\"Kapat\"/>")).toBe(true);
    expect(named("<button aria-label=\"Kapat\" Aria-Label=\"\"/>")).toBe(false);
    expect(named("<button Aria-LabelledBy=\"title-id\"/>")).toBe(true);
    expect(firstTag("<button ARIA-Controls=\"menu\"/>").attributes.get("aria-controls")?.literal).toBe("menu");
    // Düğme adı (yalnız istisnaları tanımak için): varlıklar çözülür, görünmeyen karakterler atılır, boşluk kırpılır,
    // Türkçe kurallarıyla küçük harfe çevrilir.
    const labels = (jsx: string) => labelTexts(firstTag(jsx));
    expect(labels("<button Aria-Label=\" Kapa&#116; \"/>")).toEqual(["kapat"]);
    expect(labels("<button aria-label=\"Sil&#8203;\"/>")).toEqual(["sil"]);
    expect(labels("<button aria-label=\"&#8203;S&shy;il&#xfeff;\"/>")).toEqual(["sil"]);
    expect(labels("<button aria-label={\"Sil\\u200b\"}/>")).toEqual(["sil"]);
    expect(labels("<button aria-label=\"MENÜYÜ&nbsp;&nbsp;KAPAT\"/>")).toEqual(["menüyü kapat"]);
    expect(labels("<button aria-label=\"KAYDI SİL\"/>")).toEqual(["kaydı sil"]);
    expect(labels("<button aria-label={`${name} kaydını sil`}/>")).toEqual(["", "kaydını sil"]);
    expect(labels("<button aria-label=\"Ara\" ARIA-LABEL=\"Bildirimler\"/>")).toEqual(["ara", "bildirimler"]);
    // Sayı alanı: `type` değeri de çözülür ve büyük-küçük harf ayrımı yapılmaz.
    expect(isNumberInput(firstTag("<input type=\"NUMBER\"/>"))).toBe(true);
    expect(isNumberInput(firstTag("<input type=\"n&#117;mber\"/>"))).toBe(true);
    expect(isNumberInput(firstTag("<input type={\"number\"}/>"))).toBe(true);
    expect(isNumberInput(firstTag("<input type=\"text\"/>"))).toBe(false);
  });

  it("içerik ile adı birlikte değerlendirir: her durumda ya okunabilir içerik ya da ad olmalıdır", () => {
    const missing = (jsx: string) => lacksName(firstTag(jsx));
    // Yazısı bir koşulda kaybolan düğmenin adı o koşulda geliyorsa düğme geçerlidir; ters koşulda geliyorsa değildir.
    expect(missing("<button aria-label={collapsed ? \"Menü\" : undefined}><Menu size={1}/>{!collapsed && \"Menü\"}</button>")).toBe(false);
    expect(missing("<button aria-label={collapsed ? undefined : \"Menü\"}><Menu size={1}/>{!collapsed && \"Menü\"}</button>")).toBe(true);
    expect(missing("<button title={done ? \"\" : \"Tamamla\"}>{done && \"Tamamlandı\"}</button>")).toBe(false);
    expect(missing("<button aria-label={done ? \"\" : \"Tamamla\"}><img src=\"/x.png\" alt={done ? \"Tamamlandı\" : \"\"}/></button>")).toBe(false);
    expect(missing("<button aria-label=\"\">Kapat</button>")).toBe(false);
    expect(missing("<button aria-label=\"Kapat\"><X size={1}/></button>")).toBe(false);
    expect(missing("<button><X size={1}/></button>")).toBe(true);
    expect(missing("<button aria-label=\"\"><X size={1}/></button>")).toBe(true);
    expect(missing("<button aria-label={busy && \"Bekle\"}>{open ? <ChevronUp size={1}/> : <ChevronDown size={1}/>}</button>")).toBe(true);
    expect(missing("<button>{a > 0 && \"Var\"}{a <= 0 && \"Yok\"}</button>")).toBe(false);
    expect(missing("<a href=\"/x\"><Plus size={1}/></a>")).toBe(true);
    expect(missing("<Link href=\"/x\"><Plus size={1}/></Link>")).toBe(true);
    expect(missing("<Link href=\"/x\" aria-label=\"Ekle\"><Plus size={1}/></Link>")).toBe(false);
  });

  it("görünmeyen içeriği yazı saymaz; ekran okuyucuya ad veren içeriği sayar", () => {
    // Karşılaştırma sonucu, virgül ve `void`: çizilen değer kaynakta bellidir.
    expect(text("<button>{a === b}</button>")).toBe("never");
    expect(text("<button><X size={1}/>{count > 0}</button>")).toBe("never");
    expect(text("<button>{(1, null)}</button>")).toBe("never");
    expect(text("<button>{void 0}</button>")).toBe("never");
    expect(text("<button>{(null, \"Tamam\")}</button>")).toBe("always");
    expect(text("<button>{count > 0 ? \"Var\" : \"Yok\"}</button>")).toBe("always");
    expect(text("<button>{count > 0 || \"Yok\"}</button>")).toBe("sometimes");
    // Görünmez boşluk yazı değildir.
    expect(text("<button>&nbsp;</button>")).toBe("never");
    expect(text("<button>&#160;&#8203;</button>")).toBe("never");
    expect(text("<button>{\"   \"}</button>")).toBe("never");
    expect(text("<button>&nbsp;Kapat</button>")).toBe("always");
    // `aria-hidden` içerik ad vermez; kendi `aria-label` değeri olan öğe ve `alt` yazısı olan resim verir.
    expect(text("<button><span aria-hidden=\"true\">×</span></button>")).toBe("never");
    expect(text("<button><span aria-hidden>×</span></button>")).toBe("never");
    expect(text("<button><span aria-hidden={true}>Kapat</span></button>")).toBe("never");
    expect(text("<button><span aria-hidden=\"false\">Kapat</span></button>")).toBe("always");
    expect(text("<button><span aria-hidden=\"true\">×</span><span className=\"sr-only\">Kapat</span></button>")).toBe("always");
    expect(text("<button><img src=\"/x.png\" alt=\"Kapat\"/></button>")).toBe("always");
    expect(text("<button><img src=\"/x.png\" alt=\"\"/></button>")).toBe("never");
    expect(text("<button><img src=\"/x.png\"/></button>")).toBe("never");
    expect(text("<button><X size={1} aria-label=\"Kapat\"/></button>")).toBe("always");
    expect(text("<button><X size={1} aria-label=\"\"/></button>")).toBe("never");
  });

  it("boş, yalnız boşluk ya da bir dalı boş olan adı ad saymaz", () => {
    expect(named("<button aria-label=\"Kapat\"/>")).toBe(true);
    expect(named("<button aria-labelledby=\"title-id\"/>")).toBe(true);
    expect(named("<button aria-label={done ? \"Tamamlandı\" : \"Tamamlandı olarak işaretle\"}/>")).toBe(true);
    expect(named("<button aria-label={`${name} kaydını sil`}/>")).toBe(true);
    expect(named("<button aria-label={label}/>")).toBe(true);
    expect(named("<button aria-label={label || \"Kapat\"}/>")).toBe(true);
    expect(named("<button/>")).toBe(false);
    expect(named("<button aria-label=\"\"/>")).toBe(false);
    expect(named("<button aria-label=\"   \"/>")).toBe(false);
    expect(named("<button aria-label={\"\"}/>")).toBe(false);
    expect(named("<button aria-label/>")).toBe(false);
    expect(named("<button aria-label={undefined}/>")).toBe(false);
    expect(named("<button aria-label={null}/>")).toBe(false);
    expect(named("<button aria-label={done ? \"Tamamlandı\" : \"\"}/>")).toBe(false);
    expect(named("<button aria-label={open && \"Kapat\"}/>")).toBe(false);
    expect(named("<button aria-label={label || \"\"}/>")).toBe(false);
    // İşlecin seçtiği değer: `true` ad değildir; soldaki dolu dizgi seçiliyorsa sağdaki boş dizgi adı bozmaz.
    expect(named("<button aria-label={true || \"Kapat\"}/>")).toBe(false);
    expect(named("<button aria-label={false ?? \"Kapat\"}/>")).toBe(false);
    expect(named("<button aria-label={\"Kapat\" && \"\"}/>")).toBe(false);
    expect(named("<button aria-label={label ?? \"\"}/>")).toBe(false);
    expect(named("<button aria-label={\"Kapat\" || \"\"}/>")).toBe(true);
    expect(named("<button aria-label={null ?? \"Kapat\"}/>")).toBe(true);
    expect(named("<button aria-label={label ?? \"Kapat\"}/>")).toBe(true);
    expect(named("<button aria-label={done ? \"Tamamlandı\" : (!done ? \"Tamamla\" : \"\")}/>")).toBe(true);
    // Görünmez boşluk ve doğru/yanlış sonuç ad değildir; `title` addır.
    expect(named("<button aria-label=\"&nbsp;\"/>")).toBe(false);
    expect(named("<button aria-label={a === b}/>")).toBe(false);
    expect(named("<button title=\"Kapat\"/>")).toBe(true);
    expect(named("<button title=\"\"/>")).toBe(false);
  });
});

describe("telefondaki ölçü hesabı", () => {
  const width = (...classes: string[]) => mobileSize(classes).width;

  it("değerleri projenin Tailwind ölçü tablosundan okur; tabloda olmayan sınıf ölçü vermez", () => {
    expect(width("min-w-11")).toBe(44);
    expect(width("min-w-12")).toBe(48);
    expect(width("min-w-20")).toBe(80);
    expect(width("min-w-10")).toBe(40);
    expect(width("min-w-[44px]")).toBe(44);
    expect(width("min-w-[2.75rem]")).toBe(44);
    expect(width("w-full")).toBe(Infinity);
    expect(width("min-w-13")).toBe(0);
    expect(sizingOf("min-w-13")).toEqual({ utility: "min-w", mobile: true, px: undefined });
    expect(sizingOf("size-13")?.px).toBeUndefined();
    expect(sizingOf("w-auto")?.px).toBeUndefined();
    expect(sizingOf("min-w-[calc(100%-1rem)]")?.px).toBeUndefined();
    expect(sizingOf("text-sm")).toBeUndefined();
    expect(mobileSize(["min-h-11"])).toEqual({ width: 0, height: 44, maxWidth: Infinity, maxHeight: Infinity });
    expect(mobileSize(["size-11"])).toEqual({ width: 44, height: 44, maxWidth: 44, maxHeight: 44 });
    expect(mobileSize(["h-11", "w-11"])).toEqual({ width: 44, height: 44, maxWidth: 44, maxHeight: 44 });
  });

  it("güvence edilen en küçük ölçü ile çıkabilecek en büyük ölçüyü ayırır", () => {
    // Ölçüsü içeriğe bağlı düğme (dolgu ve yazı): güvence yok, üst sınır da yok.
    expect(mobileSize(["px-4", "py-3"])).toEqual({ width: 0, height: 0, maxWidth: Infinity, maxHeight: Infinity });
    expect(mobileSize(["w-full", "py-3"])).toMatchObject({ width: Infinity, maxWidth: Infinity, height: 0, maxHeight: Infinity });
    // Sabitlenen ölçü hem güvence hem üst sınırdır; `sm:` ile verilen ölçü telefonda yoktur.
    expect(mobileSize(["h-9", "px-4"])).toMatchObject({ height: 36, maxHeight: 36, width: 0, maxWidth: Infinity });
    expect(mobileSize(["size-9", "sm:size-11"])).toMatchObject({ width: 36, maxWidth: 36, height: 36, maxHeight: 36 });
    expect(mobileSize(["size-11", "sm:size-9"])).toMatchObject({ width: 44, maxWidth: 44 });
    // Yalnız alt sınır: güvence o kadardır, içerik daha büyük olabilir. Yalnız üst sınır: ölçü oraya kadar çıkabilir.
    expect(mobileSize(["min-w-11"])).toMatchObject({ width: 44, maxWidth: Infinity });
    expect(mobileSize(["max-w-8"])).toMatchObject({ width: 0, maxWidth: 32 });
    expect(mobileSize(["max-w-xs"])).toMatchObject({ width: 0, maxWidth: 320 });
    // CSS'teki gibi alt sınır üst sınırla çelişirse alt sınır kazanır.
    expect(mobileSize(["min-w-11", "max-w-8"])).toMatchObject({ width: 44, maxWidth: 44 });
    expect(mobileSize(["size-11", "max-w-8", "min-w-11"])).toMatchObject({ width: 44, maxWidth: 44 });
    expect(mobileSize(["size-12", "max-w-11"])).toMatchObject({ width: 44, maxWidth: 44 });
  });

  it("simge düğmesini adından değil içeriğinden tanır: kendi yazısı kesin olarak eksik kalabilen düğme", () => {
    const icon = (jsx: string) => isIconButton(firstTag(jsx));
    // Ad ne yazılırsa yazılsın (ya da hiç yazılmasın) yalnız simgeden oluşan düğme simge düğmesidir.
    expect(icon("<button aria-label=\"Sil\"><Trash2 size={14}/></button>")).toBe(true);
    expect(icon("<button aria-label=\"Sil&#8203;\"><Trash2 size={14}/></button>")).toBe(true);
    expect(icon("<button aria-label=\"Kaldır.\"><Trash2 size={14}/></button>")).toBe(true);
    expect(icon("<button aria-label={label}><Pencil size={14}/></button>")).toBe(true);
    expect(icon("<button><Trash2 size={14}/></button>")).toBe(true);
    expect(icon("<button/>")).toBe(true);
    // Adı olan simge ya da resim yazı değildir; gizli (`aria-hidden`) yazı da değildir; bir koşulda yazısız kalan da simge düğmesidir.
    expect(icon("<button><Trash2 size={14} aria-label=\"Sil\"/></button>")).toBe(true);
    expect(icon("<button><img src=\"/x.png\" alt=\"Sil\"/></button>")).toBe(true);
    expect(icon("<button aria-label=\"Kapat\"><span aria-hidden=\"true\">×</span></button>")).toBe(true);
    expect(icon("<button>{open ? <X size={1}/> : \"Menü\"}</button>")).toBe(true);
    expect(icon("<button><Check size={17}/>{done && \"Tamamlandı\"}</button>")).toBe(true);
    // Her durumda kendi yazısı olan düğme simge düğmesi değildir; yokluk birden çok koşula bağlıysa iddia edilmez.
    expect(icon("<button>Kaydet</button>")).toBe(false);
    expect(icon("<button aria-label=\"Sil\"><Trash2 size={14}/>Sil</button>")).toBe(false);
    expect(icon("<button>{label}</button>")).toBe(false);
    expect(icon("<button>{done ? \"Tamamlandı\" : \"Tamamla\"}</button>")).toBe(false);
    expect(icon("<button>{a > 0 && \"Var\"}{a <= 0 && \"Yok\"}</button>")).toBe(false);
    // Ad denetimi (okunabilir içerik) ile ölçü denetimi (düğmenin kendi yazısı) ayrı sorulardır.
    expect(needsName(firstTag("<button><Trash2 size={14} aria-label=\"Sil\"/></button>"))).toBe(false);
    expect(lacksName(firstTag("<button><Trash2 size={14} aria-label=\"Sil\"/></button>"))).toBe(false);
  });

  it("bir şey yapmayan düğmeyi tanır: işleyicisi yok ve formu göndermiyor", () => {
    const works = (code: string) => doesSomething(jsxTags(`const view = ${code};`).filter((tag) => tag.name === "button")[0]);
    expect(works("<button onClick={save}>Kaydet</button>")).toBe(true);
    expect(works("<form onSubmit={save}><div><button>Kaydet</button></div></form>")).toBe(true);
    expect(works("<form onSubmit={save}><button type=\"submit\">Kaydet</button></form>")).toBe(true);
    expect(works("<button type=\"submit\" form=\"measurement\">Kaydet</button>")).toBe(true);
    expect(works("<button form=\"measurement\">Kaydet</button>")).toBe(true);
    expect(works("<button type=\"button\" form=\"measurement\" onClick={close}>Vazgeç</button>")).toBe(true);
    // Forma bağlı olmak yetmez: türü "button" olan düğme formu göndermez.
    expect(works("<button type=\"button\" form=\"measurement\">Vazgeç</button>")).toBe(false);
    expect(works("<button>Yeni kayıt</button>")).toBe(false);
    expect(works("<button aria-label=\"Ara\" className=\"grid size-11\"><Search size={18}/></button>")).toBe(false);
    expect(works("<button type=\"submit\">Kaydet</button>")).toBe(false);
    expect(works("<form onSubmit={save}><button type=\"button\">Vazgeç</button></form>")).toBe(false);
    expect(works("<form onSubmit={save}><button type=\"BUTTON\">Vazgeç</button></form>")).toBe(false);
    expect(works("<div><form onSubmit={save}/><button>Kaydet</button></div>")).toBe(false);
  });

  it("bilinen istisnaları dosya, ad ve sınıfla tanır; öbür her düğmenin alt sınırı 44 pikseldir", () => {
    const button = (file: string, jsx: string) => ({ file, ...firstTag(jsx) });
    expect(sizeFloor(button("src/components/mobile-nav.tsx", "<button aria-label=\"Menüyü kapat\" className=\"absolute inset-0\"/>"))).toBe(0);
    expect(sizeFloor(button("src/components/mobile-nav.tsx", "<button aria-label=\"MENÜYÜ KAPAT&#8203;\" className=\"fixed inset-0\"/>"))).toBe(0);
    // Aynı ad başka dosyada, aynı dosyada başka ad ya da sınıfı tutmayan düğme istisna değildir.
    expect(sizeFloor(button("src/components/mobile-nav.tsx", "<button aria-label=\"Menüyü kapat\" className=\"grid size-11\"/>"))).toBe(44);
    expect(sizeFloor(button("src/app/plants/page.tsx", "<button aria-label=\"Ara\" className=\"grid size-9\"/>"))).toBe(44);
    expect(sizeFloor(button("src/app/page.tsx", "<button aria-label=\"Sil\" className=\"grid size-9\"/>"))).toBe(44);
    expect(sizeFloor(button("src/app/page.tsx", "<button aria-label=\"Ara\" className=\"grid size-9\"/>"))).toBe(44);
    expect(sizeFloor(button("src/app/page.tsx", "<button className=\"grid size-9\"/>"))).toBe(44);
  });

  it("yalnızca telefonda geçerli sınıfları sayar: `sm:` ile verilen ölçü telefonda yoktur", () => {
    expect(width("min-w-11", "sm:min-w-0")).toBe(44);
    expect(width("sm:min-w-11")).toBe(0);
    expect(width("size-9", "sm:size-11", "lg:size-12")).toBe(36);
    expect(sizingOf("sm:size-11")).toEqual({ utility: "size", mobile: false, px: undefined });
    expect(sizingOf("max-sm:size-9")).toEqual({ utility: "size", mobile: true, px: undefined });
    expect(sizingOf("hover:w-8")?.mobile).toBe(true);
  });

  it("çakışan sınıflarda küçük olanı alır; alt ve üst sınırı uygular", () => {
    expect(width("size-11", "size-9")).toBe(36);
    expect(width("size-11", "!size-9")).toBe(36);
    expect(width("w-9", "min-w-11")).toBe(44);
    expect(width("size-11", "max-w-8")).toBe(32);
    expect(mobileSize(["size-11", "max-h-9"]).height).toBe(36);
  });

  it("ölçüyü belirsiz bırakan her durumu hata sayar", () => {
    const problems = (jsx: string) => sizingProblems(firstTag(jsx));
    expect(problems("<button className=\"grid size-11 sm:size-9\"/>")).toEqual([]);
    expect(problems("<button className={`grid size-11 ${on ? \"text-a\" : \"text-b\"}`}/>")).toEqual([]);
    expect(problems("<button className={on ? \"size-9\" : \"size-11\"}/>")).toEqual(["className dizgi ya da şablon dizgisi değil", "ölçü sınıfı koşullu ifadede: size-9", "ölçü sınıfı koşullu ifadede: size-11"]);
    expect(problems("<button className={`grid ${true ? \"size-9\" : \"size-11\"}`}/>")).toEqual(["ölçü sınıfı koşullu ifadede: size-9", "ölçü sınıfı koşullu ifadede: size-11"]);
    expect(problems("<button className={`grid size-${big ? 11 : 9}`}/>")).toEqual(["sınıf adı ifadeyle birleşik: size-"]);
    expect(problems("<button className={chip}/>")).toEqual(["className dizgi ya da şablon dizgisi değil"]);
    expect(problems("<button className=\"size-11\" {...rest}/>")).toEqual(["yayılan öznitelik var"]);
    expect(problems("<button className=\"size-11\" style={{ width: 20 }}/>")).toEqual(["style özniteliği var"]);
    expect(problems("<button className=\"min-h-11 min-w-13\"/>")).toEqual(["çözümlenemeyen ölçü sınıfı: min-w-13"]);
    expect(problems("<button className=\"size-11 max-sm:size-9\"/>")).toEqual(["çözümlenemeyen ölçü sınıfı: max-sm:size-9"]);
    expect(problems("<button className=\"size-11 hover:w-8\"/>")).toEqual(["çözümlenemeyen ölçü sınıfı: hover:w-8"]);
    // Keyfi CSS özelliği ölçüyü ölçü sınıfı olmadan değiştirebilir; keyfi değer (`text-[#586e77]`, `-m-[15px]`) öyle değildir.
    expect(problems("<button className=\"size-11 [height:36px]\"/>")).toEqual(["keyfi CSS özelliği sınıfı: [height:36px]"]);
    expect(problems("<button className=\"size-11 sm:![width:20px]\"/>")).toEqual(["keyfi CSS özelliği sınıfı: sm:![width:20px]"]);
    expect(problems("<button className={`size-11 ${on ? \"[scale:.5]\" : \"\"}`}/>")).toEqual(["keyfi CSS özelliği sınıfı: [scale:.5]"]);
    expect(problems("<button className=\"-m-[15px] grid size-11 text-[#586e77] bg-white/[.04] supports-[display:grid]:grid\"/>")).toEqual([]);
    expect(problems("<button className=\"size-11 [&_svg]:size-4\"/>")).toEqual(["çözümlenemeyen ölçü sınıfı: [&_svg]:size-4"]);
    // Özelliğin adı hangi harflerle yazılırsa yazılsın: Tailwind `[maxHeight:36px]` yazımından `max-height: 36px` üretir.
    expect(problems("<button className=\"size-11 [maxHeight:36px]\"/>")).toEqual(["keyfi CSS özelliği sınıfı: [maxHeight:36px]"]);
    expect(problems("<button className=\"size-11 [maxWidth:36px]\"/>")).toEqual(["keyfi CSS özelliği sınıfı: [maxWidth:36px]"]);
    expect(problems("<button className=\"size-11 [HEIGHT:36px]\"/>")).toEqual(["keyfi CSS özelliği sınıfı: [HEIGHT:36px]"]);
    expect(problems("<button className=\"size-11 ![block-size:36px]\"/>")).toEqual(["keyfi CSS özelliği sınıfı: ![block-size:36px]"]);
    expect(problems("<button className=\"size-11 [--size:36px]\"/>")).toEqual(["keyfi CSS özelliği sınıfı: [--size:36px]"]);
    expect(problems("<button className=\"size-11 lg:hover:[zoom:.5]\"/>")).toEqual(["keyfi CSS özelliği sınıfı: lg:hover:[zoom:.5]"]);
    // Ayraç içindeki `:` önek ayırıcısı değildir: tür ipuçlu keyfi değer bir ölçü sınıfıdır ve çözümlenemez.
    expect(problems("<button className=\"size-11 w-[length:36px]\"/>")).toEqual(["çözümlenemeyen ölçü sınıfı: w-[length:36px]"]);
    expect(problems("<button className=\"size-11 [&:hover]:size-9\"/>")).toEqual(["çözümlenemeyen ölçü sınıfı: [&:hover]:size-9"]);
    expect(problems("<button className=\"size-11 [&]:size-9\"/>")).toEqual(["çözümlenemeyen ölçü sınıfı: [&]:size-9"]);
    expect(problems("<button className=\"size-11 min-[400px]:size-9\"/>")).toEqual(["çözümlenemeyen ölçü sınıfı: min-[400px]:size-9"]);
    expect(problems("<button className=\"size-11 w-[36PX]\"/>")).toEqual(["çözümlenemeyen ölçü sınıfı: w-[36PX]"]);
    expect(problems("<button className=\"size-11 sm:w-[length:36px] lg:size-9\"/>")).toEqual([]);
    // `style` ve `class` hangi harflerle yazılırsa yazılsın ölçüyü belirsiz bırakır.
    expect(problems("<button className=\"size-11\" STYLE=\"width: 20px\"/>")).toEqual(["style özniteliği var"]);
    expect(problems("<button className=\"size-11\" class=\"size-9\"/>")).toEqual(["class özniteliği var"]);
    expect(problems("<button className=\"size-11\" CLASS=\"size-9\"/>")).toEqual(["class özniteliği var"]);
  });

  it("şablon dizgisindeki ifadelerde yalnız değeri kaynakta yazılı olanı okur; gerisini hata sayar", () => {
    const problems = (code: string) => sizingProblems(jsxTags(code).filter((tag) => tag.name === "button")[0]);
    const opaque = (part: string) => `sınıf ifadesinde değeri kaynakta yazılı olmayan parça: ${part}`;
    // Aynı dosyada tek yerde `const` ile bildirilen ad okunur: içinde ölçü sınıfı varsa hata, yoksa geçerli.
    expect(problems("const mobileTargetClass = \"!size-9\"; const view = <button className={`grid size-11 ${mobileTargetClass}`}/>;")).toEqual(["ölçü sınıfı koşullu ifadede: !size-9"]);
    expect(problems("const tint = \"text-aqua\"; const view = <button className={`grid size-11 ${tint}`}/>;")).toEqual([]);
    expect(problems("const tint = wide ? \"text-aqua\" : \"text-white\"; const view = <button className={`grid size-11 ${tint}`}/>;")).toEqual([]);
    expect(problems("const base = \"h-9\" as const; const extra = base; const view = <button className={`grid size-11 ${extra}`}/>;")).toEqual(["ölçü sınıfı koşullu ifadede: h-9"]);
    expect(problems("const hack = \"[maxHeight:36px]\"; const view = <button className={`grid size-11 ${hack}`}/>;")).toEqual(["keyfi CSS özelliği sınıfı: [maxHeight:36px]"]);
    // Değeri kaynakta yazılı olmayan ad: bildirimi yok, içe aktarılmış, parametre, `let`, yapı bozma, başka kapsamda ya da iki kez bağlanmış.
    expect(problems("const view = <button className={`grid size-11 ${chipClass}`}/>;")).toEqual([opaque("chipClass")]);
    expect(problems("import { chip } from \"./styles\"; const view = <button className={`grid size-11 ${chip}`}/>;")).toEqual([opaque("chip")]);
    expect(problems("function B({ tone }: { tone: string }) { return <button className={`grid size-11 ${tone}`}/>; }")).toEqual([opaque("tone")]);
    expect(problems("function B(tone: string) { return <button className={`grid size-11 ${tone}`}/>; }")).toEqual([opaque("tone")]);
    expect(problems("let tint = \"text-aqua\"; const view = <button className={`grid size-11 ${tint}`}/>;")).toEqual([opaque("tint")]);
    expect(problems("const { tint } = styles; const view = <button className={`grid size-11 ${tint}`}/>;")).toEqual([opaque("tint")]);
    expect(problems("function A() { const tint = \"text-aqua\"; return tint; } function B() { return <button className={`grid size-11 ${tint}`}/>; }")).toEqual([opaque("tint")]);
    expect(problems("const tint = \"text-aqua\"; function B(tint: string) { return <button className={`grid size-11 ${tint}`}/>; }")).toEqual([opaque("tint")]);
    expect(problems("const a: string = b; const b: string = a; const view = <button className={`grid size-11 ${a}`}/>;")).toEqual([opaque("a")]);
    // Aynı dosyadaki tek ifadeli işlevin çağrısı okunur; parametresini döndüren ya da gövdesi başka deyim içeren işlev okunmaz.
    expect(problems("const tone = (active: boolean) => active ? \"text-aqua\" : \"text-[#71858d]\"; const view = <button className={`grid size-11 ${tone(open)}`}/>;")).toEqual([]);
    expect(problems("const tone = function (active: boolean) { return active ? \"text-aqua\" : \"text-white\"; }; const view = <button className={`grid size-11 ${tone(open)}`}/>;")).toEqual([]);
    // `function` bildirimiyle verilen ad yeniden atanabilir (`tone = …`); okunmaz.
    expect(problems("function tone(active: boolean) { return active ? \"text-aqua\" : \"text-white\"; } const view = <button className={`grid size-11 ${tone(open)}`}/>;")).toEqual([opaque("tone(open)")]);
    expect(problems("const tone = (active: boolean) => active ? \"size-9\" : \"size-11\"; const view = <button className={`grid ${tone(open)}`}/>;")).toEqual(["ölçü sınıfı koşullu ifadede: size-9", "ölçü sınıfı koşullu ifadede: size-11"]);
    expect(problems("const pick = (name: string) => name; const view = <button className={`grid size-11 ${pick(\"size-9\")}`}/>;")).toEqual([opaque("name")]);
    expect(problems("function tone(active: boolean) { if (active) return \"size-9\"; return \"text-white\"; } const view = <button className={`grid size-11 ${tone(open)}`}/>;")).toEqual([opaque("tone(open)")]);
    expect(problems("const tone = async () => \"text-aqua\"; const view = <button className={`grid size-11 ${tone()}`}/>;")).toEqual([opaque("tone()")]);
    // Özellik, yöntem ve içe aktarılan işlev çağrısı, birleştirme, iç içe şablon okunmaz.
    expect(problems("const view = <button className={`grid size-11 ${styles.chip}`}/>;")).toEqual([opaque("styles.chip")]);
    expect(problems("const view = <button className={`grid size-11 ${cn(\"text-aqua\")}`}/>;")).toEqual([opaque("cn(\"text-aqua\")")]);
    expect(problems("const view = <button className={`grid size-11 ${\"size-\" + \"9\"}`}/>;")).toEqual([opaque("\"size-\" + \"9\"")]);
    expect(problems("const view = <button className={`grid size-11 ${`w-${n}`}`}/>;")).toEqual([opaque("`w-${n}`")]);
    // `k && a` içinde soldaki değer sınıf olamaz; `a || b` ve `a ?? b` içinde soldaki değer de sonuç olabilir.
    expect(problems("const view = <button className={`grid size-11 ${busy && \"opacity-50\"}`}/>;")).toEqual([]);
    expect(problems("const view = <button className={`grid size-11 ${extra || \"text-aqua\"}`}/>;")).toEqual([opaque("extra")]);
    expect(problems("const view = <button className={`grid size-11 ${extra ?? \"text-aqua\"}`}/>;")).toEqual([opaque("extra")]);
    // `undefined` sıradan bir addır: dosyada yeniden bağlanmışsa boş değer sayılmaz, öbür adlar gibi okunur.
    expect(problems("const view = <button className={`grid size-11 ${undefined}`}/>;")).toEqual([]);
    expect(problems("function B() { const undefined = \"!size-9\"; return <button className={`grid size-11 ${undefined}`}/>; }")).toEqual(["ölçü sınıfı koşullu ifadede: !size-9"]);
    expect(problems("function B() { const undefined = \"text-aqua\"; return <button className={`grid size-11 ${on ? undefined : \"\"}`}/>; }")).toEqual([]);
    expect(problems("function B(undefined: string) { return <button className={`grid size-11 ${undefined}`}/>; }")).toEqual([opaque("undefined")]);
    expect(problems("function A() { const undefined = \"!size-9\"; return undefined; } function B() { return <button className={`grid size-11 ${undefined}`}/>; }")).toEqual([opaque("undefined")]);
    expect(problems("await using lock = \"size-9\"; const view = <button className={`grid size-11 ${lock}`}/>;")).toEqual([opaque("lock")]);
    // Aralarında hiçbir şey olmayan iki ifadenin değerleri birbirine yapışır.
    expect(problems("const view = <button className={`grid ${on ? \"size-\" : \"\"}${big ? \"9\" : \"11\"}`}/>;")).toEqual(["sınıf adı ifadeyle birleşik: ${…}${…}"]);
    expect(problems("const view = <button className={`grid size-11 ${on ? \"text-a\" : \"\"} ${big ? \"font-bold\" : \"\"}`}/>;")).toEqual([]);
  });

  it("sınıf adını Tailwind'in ve tarayıcının yaptığı gibi ayırır", () => {
    expect(classParts("size-11")).toEqual({ variants: [], utility: "size-11" });
    expect(classParts("sm:!size-9")).toEqual({ variants: ["sm"], utility: "size-9" });
    expect(classParts("lg:hover:[zoom:.5]")).toEqual({ variants: ["lg", "hover"], utility: "[zoom:.5]" });
    expect(classParts("[&:hover]:size-9")).toEqual({ variants: ["[&:hover]"], utility: "size-9" });
    expect(classParts("supports-[display:grid]:grid")).toEqual({ variants: ["supports-[display:grid]"], utility: "grid" });
    expect(classParts("w-[length:36px]")).toEqual({ variants: [], utility: "w-[length:36px]" });
    expect(classParts("w-[calc(100%-theme(spacing.4))]")).toEqual({ variants: [], utility: "w-[calc(100%-theme(spacing.4))]" });
    expect(isArbitraryProperty("[maxHeight:36px]")).toBe(true);
    expect(isArbitraryProperty("sm:![width:20px]")).toBe(true);
    expect(isArbitraryProperty("text-[#586e77]")).toBe(false);
    expect(isArbitraryProperty("[&_svg]:size-4")).toBe(false);
    // Yalnız telefon genişliğinin üstünde geçerli önekler projenin ekran tablosundan okunur.
    expect([...DESKTOP_ONLY].sort()).toEqual(["2xl", "lg", "md", "sm", "xl"]);
    // Sınıfları yalnız boşluk, sekme ve satır sonu ayırır; bölünmez boşluk ayırmaz (tarayıcıda `size-11` diye bir sınıf oluşmaz).
    const classes = (jsx: string) => firstTag(jsx).staticClasses;
    expect(classes("<button className=\"grid  size-11\"/>")).toEqual(["grid", "size-11"]);
    expect(classes("<button className=\"size-11&#9;size-9&#10;grid\"/>")).toEqual(["size-11", "size-9", "grid"]);
    expect(classes("<button className=\"grid p-1 x&nbsp;size-11\"/>")).toEqual(["grid", "p-1", `x${String.fromCharCode(160)}size-11`]);
    expect(mobileSize(classes("<button className=\"grid p-1 x&nbsp;size-11\"/>"))).toMatchObject({ width: 0, height: 0 });
    expect(mobileSize(classes("<button className={\"grid p-1 x\\u00a0size-11\"}/>"))).toMatchObject({ width: 0, height: 0 });
    expect(sizingProblems(firstTag("<button className=\"size-11&nbsp;x\"/>"))).toEqual([`çözümlenemeyen ölçü sınıfı: size-11${String.fromCharCode(160)}x`]);
  });
});

describe("telefonda kullanım kolaylığı", () => {
  it("alan yazısı dokunmatik cihazda ve dar ekranda en az 16 piksel tutulur (iPhone kendiliğinden yakınlaştırmasın)", () => {
    const rule = globals.match(/@media \(pointer: coarse\), \(max-width: 639px\) \{ ([^{}]*) \{ font-size: (\d+)px !important; \} \}/);
    expect(rule, "globals.css içinde alan yazısı kuralı yok").not.toBeNull();
    expect(Number(rule![2])).toBeGreaterThanOrEqual(FIELD_FONT_PX);
    for (const control of ["input", "select", "textarea"]) expect(rule![1], control).toContain(`${control}:not(.text-lg):not(.text-xl):not(.text-2xl):not(.text-3xl)`);
  });

  it("açılan pencerenin yüksekliği ekranın görünen kısmına göre ölçülür", () => {
    expect(globals).toMatch(/\.sheet-height \{ max-height: \d+vh; max-height: \d+dvh; \}/);
    const dialog = sources.find(({ file }) => file === "src/components/modal-dialog.tsx")!;
    expect(dialog.tags.some((tag) => tag.attributes.get("role")?.literal === "dialog" && tag.staticClasses.includes("sheet-height"))).toBe(true);
    expect(sources.filter(({ tags }) => tags.some((tag) => allClasses(tag).some((name) => /^max-h-\[\d+vh\]$/.test(name)))).map(({ file }) => file)).toEqual([]);
  });

  it("her düğmenin ve bağlantının her durumda okunabilir bir içeriği ya da boş olmayan bir erişilebilir adı vardır", () => {
    const targets = located(["button", "a", "Link"]);
    // Sayı alt sınırdır: taramanın yalnız simgeden oluşan düğmeleri gerçekten gördüğünü gösterir.
    expect(targets.filter((tag) => tag.name === "button" && needsName(tag)).length).toBeGreaterThanOrEqual(13);
    expect(targets.filter(lacksName).map(where)).toEqual([]);
  });

  it("hiçbir düğmenin ölçüsü belirsiz değildir (koşullu ölçü sınıfı, style, yayılan öznitelik, tabloda olmayan sınıf yok)", () => {
    expect(buttons.length).toBeGreaterThanOrEqual(45);
    expect(buttons.flatMap((tag) => sizingProblems(tag).map((problem) => `${tag.file}: ${problem}: ${tag.source}`))).toEqual([]);
  });

  it("her düğme bir şey yapar, her bağlantının bir adresi vardır (tıklanınca hiçbir şey olmayan öğe kalmaz)", () => {
    expect(buttons.filter((tag) => !doesSomething(tag)).map(where)).toEqual([]);
    expect(located(["a", "Link"]).filter((tag) => !tag.attributes.has("href")).map(where)).toEqual([]);
  });

  it("her simge düğmesi (kapatma, silme ve öbürleri; adı ne olursa olsun) telefonda en az 44 piksellik dokunma alanı taşır", () => {
    const icons = buttons.filter(isIconButton);
    // Sayı alt sınırdır: taramanın simge düğmelerini gerçekten gördüğünü gösterir; yeni bir düğme eklemek testi bozmaz.
    expect(icons.length).toBeGreaterThanOrEqual(13);
    expect(icons.filter((tag) => { const size = mobileSize(tag.staticClasses); return size.width < sizeFloor(tag) || size.height < sizeFloor(tag); }).map(where)).toEqual([]);
  });

  it("hiçbir düğmenin ölçüsü telefonda 44 pikselin altına sabitlenmez ya da sınırlanmaz (yazılı düğmeler dahil)", () => {
    expect(buttons.filter((tag) => { const size = mobileSize(tag.staticClasses); return size.maxWidth < sizeFloor(tag) || size.maxHeight < sizeFloor(tag); }).map(where)).toEqual([]);
  });

  it("ölçü kurallarının her istisnası en çok bir düğmeyle eşleşir", () => {
    for (const exception of SIZE_EXCEPTIONS) expect(buttons.filter((tag) => exceptionFor(tag) === exception).map(where).length, `${exception.file}: ${exception.label}`).toBeLessThanOrEqual(1);
    // Bugünkü tek istisna yan menünün arka planı. Sayı artarsa bu liste gerekçesiyle güncellenir.
    expect(buttons.filter((tag) => exceptionFor(tag) !== undefined).length).toBeLessThanOrEqual(SIZE_EXCEPTIONS.length);
  });

  it("telefonda en az 44 piksel yükseklik verilen her düğme genişlikte de en az 44 pikseldir", () => {
    // Yükseklik `min-h-*`, `h-*` ya da `size-*` ile verilmiş olabilir; hangisiyle verildiği sonucu değiştirmez.
    const tall = buttons.filter((tag) => mobileSize(tag.staticClasses).height >= TOUCH_TARGET_PX);
    expect(tall.length).toBeGreaterThanOrEqual(7);
    expect(tall.filter((tag) => mobileSize(tag.staticClasses).width < TOUCH_TARGET_PX).map(where)).toEqual([]);
  });

  it("sayı alanları telefonda sayı tuş takımını açar", () => {
    // HTML'de `type` değerinde büyük-küçük harf ayrımı yoktur: `type="NUMBER"` da sayı alanıdır.
    const numberInputs = located(["input"]).filter(isNumberInput);
    expect(numberInputs.length).toBeGreaterThanOrEqual(11);
    const keypad = (tag: Tag) => {
      const attribute = tag.attributes.get("inputMode");
      const values = attribute?.literal !== undefined ? [attribute.literal] : attribute?.expression ? stringParts(attribute.expression) : [];
      return values.length > 0 && values.every((value) => value === "numeric" || value === "decimal");
    };
    expect(numberInputs.filter((tag) => !keypad(tag)).map(where)).toEqual([]);
  });

  it("yan menü ekran genişleyince kapanır (gizli kalıp sayfa kaydırmasını kilitli bırakmaz)", () => {
    const menu = sources.find(({ file }) => file === "src/components/mobile-nav.tsx")!;
    const code = menu.text.replace(/\s+/g, "");
    expect(code).toContain("window.matchMedia(\"(min-width:1024px)\")");
    expect(code).toMatch(/if\(\w+\.matches\)setOpen\(false\)/);
    expect(code).toMatch(/\.addEventListener\("change",\w+\)/);
    expect(code).toMatch(/\.removeEventListener\("change",\w+\)/);
    expect(menu.tags.some((tag) => tag.staticClasses.includes("lg:hidden") && tag.staticClasses.includes("inset-0"))).toBe(true);
  });
});
