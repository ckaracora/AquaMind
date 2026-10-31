import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { spainOnlySpanish as spainOnly } from "./catalog-translation-checks";

// İspanyolca metinler Latin Amerika ortak İspanyolcasıdır (ürün sahibi kararı 2026-10-31): kullanıcıya "tú" ile hitap edilir; "vosotros",
// "vos" ve İspanya'ya özgü sözcükler (ordenador, móvil, coger, grifo…) kullanılmaz. Arayüz, motor, bitki uyarıları, hastalık ve gizlilik
// sayfaları taranır (yorumlar Türkçedir, taranmaz); canlıların çevirisi kendi testinde (catalog-translations-es.test.ts).

const MESSAGES = "packages/localization/src/messages/";

const stripComments = (source: string) => source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:"'`\\])\/\/.*$/gm, "$1");

describe("İspanyolca metinler Latin Amerika ortak İspanyolcasıyla", () => {
  const files = readdirSync(MESSAGES).filter((name) => /^es(?:-[a-z-]+)?\.ts$/.test(name) && name !== "es-catalog-species.ts");

  it("İspanyolca dosyalar var", () => {
    expect(files.sort()).toEqual(["es-bundle.ts", "es-diseases.ts", "es-engine.ts", "es-plant-warnings.ts", "es-privacy.ts", "es.ts"]);
  });

  it.each(files)("%s İspanya'ya özgü kullanım içermez", (name) => {
    expect(spainOnly(stripComments(readFileSync(`${MESSAGES}${name}`, "utf8")))).toEqual([]);
  });

  it("denetim İspanya kullanımını yakalar, Latin Amerika kullanımını geçirir", () => {
    expect(spainOnly("Vosotros tenéis el ordenador y el móvil; os lo digo. Abrid el grifo.")).toEqual(["Vosotros", "os", "tenéis", "ordenador", "móvil", "grifo"]);
    expect(spainOnly("Ustedes tienen la computadora y el celular; abre la llave del agua. Seis peces, países, dos veces.")).toEqual([]);
    // Zamirsiz voseo ve emir kipi; "tú" gelecek zamanı, sayılar ve vurgulu öbür sözcükler geçer.
    expect(spainOnly("Tenés que vigilar el agua. Si podés, vivís tranquilo; vos sos el dueño. Mirá el filtro.")).toEqual(["vos", "sos", "Tenés", "podés", "vivís", "Mirá"]);
    expect(spainOnly("Además, después del estrés, el pez siamés de Tailandia nada a través del acuario; tendrás que esperar dieciséis o veintiséis días.")).toEqual([]);
    // Voseo emir kipi (vurgulu biten, -rá/-ré ile biten ve zamirli); "tú" gelecek zamanı, yer ve tür adları, vurgulu öbür sözcükler geçer.
    expect(spainOnly("Guardá los cambios. Mantené el agua limpia, evitá el estrés y añadí plantas; miralo, cuidate y corré. Si mirás el filtro, preparalo.")).toEqual(["Guardá", "Mantené", "evitá", "añadí", "miralo", "cuidate", "corré", "mirás", "preparalo"]);
    expect(spainOnly("Está bien así: aquí y allá el pez está tranquilo, quizás con veintitrés crías. ¿Qué incluirá? Te escribiré; el tucunaré y el acará del Paraná.")).toEqual([]);
    // Cümle başında büyük harfle "Vos" ve "Sos"; listedeki fiillerin -rá ile biten emri ve zamirli emri.
    expect(spainOnly("Vos tendrás que esperar antes de agregar más peces. Sos responsable del acuario. Repará la bomba y aplicalo.")).toEqual(["Vos", "Sos", "Repará", "aplicalo"]);
    // İki zamirli voseo emri yakalanır; "tú" biçimi (vurgu daha önde) ve tek heceli "tú" emirleri geçer.
    expect(spainOnly("Descargátelo en tu computadora, acercáselo con una pipeta y aplicáselo.")).toEqual(["Descargátelo", "acercáselo", "aplicáselo"]);
    expect(spainOnly("Descárgatelo en tu computadora, acércaselo con una pipeta y aplícaselo; dímelo y dámelo.")).toEqual([]);
    // Listedeki kısa gövdeli fiil (leer): iki zamirli voseo emri yakalanır, "tú" biçimi ve mastar/ulaç geçer.
    expect(spainOnly("Si no entiendes el aviso, leéselo a quien te ayude o leémelo.")).toEqual(["leéselo", "leémelo"]);
    expect(spainOnly("Si no entiendes el aviso, léeselo a quien te ayude, léemelo o intenta leérselo; leyéndoselo se entiende.")).toEqual([]);
  });
});
