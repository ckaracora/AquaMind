// Sağlık analizi motorunun İspanyolca uyarı ve ölçüt metinleri (karar 0021, İspanyolca paketi; Latin Amerika ortak İspanyolcası). Türkçe
// dosyayla (`tr-engine.ts`) aynı kodlar ve değişkenler. Katalog metni taşıyan değişkenler (tür adı, not, koşul) ekranda katalog çevirmeninden
// geçer; çevirisi olmayan not ve koşul boş gelir (karar 0021, 4. paket) ve burada atlanır: boş koşul cümleye girmez, gövdesi boş kalacak
// uyarı genel bir cümle gösterir.
import type { EngineTextFormat } from "../engine-format";
import {
  MARINE_NITRATE_LIMIT_PPM, MARINE_SPECIFIC_GRAVITY_SAFE_MAX, MARINE_SPECIFIC_GRAVITY_SAFE_MIN, NITRATE_ABOVE_TAP_LIMIT_PPM, TAP_WATER_NITRATE_LIMIT_PPM,
} from "./engine-limits";
import type { EngineMessages, EngineTextParams } from "./tr-engine";

type Text = (p: EngineTextParams, f: EngineTextFormat) => string;

const num = (p: EngineTextParams, key: string) => p[key] as number;
const str = (p: EngineTextParams, key: string) => p[key] as string;
const list = (p: EngineTextParams, key: string) => p[key] as string[];
const flag = (p: EngineTextParams, key: string) => p[key] as boolean;
const nameList = (names: string[]) => (names.length > 1 ? `${names.slice(0, -1).join(", ")} y ${names[names.length - 1]}` : names[0]);
const sentence = (text: string) => text.replace(/\.?$/, ".");
const plural = (count: number, one: string, many: string) => (count === 1 ? one : many);
const sourceNote = (p: EngineTextParams) =>
  (str(p, "condition") ? ` Nota de la fuente: ${sentence(str(p, "condition"))}` : "") + ` Fuente: ${str(p, "source")}.`;
/** Katalogdan gelen not metni; çevirisi yoksa boş gelir ve yerine bu cümle yazılır. */
const catalogNote = (p: EngineTextParams) => str(p, "text") || "La nota de la fuente sobre esta especie aún no está disponible en español.";
const aquariumTypeName = (type: string) => (type === "freshwater" ? "agua dulce" : type === "saltwater" ? "agua salada" : "agua salobre");
const waterFieldName = (field: string) => ({ ammonia: "amoníaco", nitrite: "nitrito", nitrate: "nitrato" } as Record<string, string>)[field] ?? field;
const manufacturerCapacity = (p: EngineTextParams, f: EngineTextFormat) =>
  flag(p, "multiple")
    ? `el volumen total recomendado por los fabricantes de los filtros (${f.volume(num(p, "liters"), num(p, "volume"))})`
    : `el mayor volumen recomendado por el fabricante del filtro (${f.volume(num(p, "liters"), num(p, "volume"))})`;
const spaceReference = (p: EngineTextParams, f: EngineTextFormat) =>
  flag(p, "hasLength")
    ? `Para la cantidad registrada se tomó como referencia un mínimo de ${f.volume(num(p, "volume"))} y una longitud de ${f.length(num(p, "length"))}.`
    : `Para la cantidad registrada se tomó como referencia un mínimo de ${f.volume(num(p, "volume"))}; la fuente no publica una longitud de acuario.`;
const fixed = (text: string): Text => () => text;
const marineTarget = (p: EngineTextParams) => (str(p, "profile") === "fishOnly" ? "acuario solo con peces" : "acuario con invertebrados");
const marineRange = (p: EngineTextParams, f: EngineTextFormat) => `${f.measurement(num(p, "min"), 3)}–${f.measurement(num(p, "max"), 3)}`;

export const esEngine: EngineMessages = {
  metricLabels: {
    load: "Carga biológica",
    space: "Espacio para nadar",
    social: "Necesidades sociales",
    compatibility: "Compatibilidad de especies",
    filter: "Filtración",
    heater: "Calentador",
    water: "Parámetros del agua",
    confidence: "Confianza de los datos",
  },
  metricDetails: {
    loadRatio: (p, f) => `Proporción de carga estimada: ${f.number(num(p, "percent"))}%`,
    spaceSevere: (p, f) => `Acuario demasiado pequeño para ${f.number(num(p, "count"))} ${plural(num(p, "count"), "especie", "especies")}`,
    spaceLimited: (p, f) => `Espacio al límite para ${f.number(num(p, "count"))} ${plural(num(p, "count"), "especie", "especies")}`,
    spaceOk: fixed("Adecuado para las especies registradas"),
    groupLow: (p, f) => `Tamaño de grupo bajo en ${f.number(num(p, "count"))} ${plural(num(p, "count"), "especie", "especies")}`,
    groupOk: fixed("Se cubren las necesidades de grupo"),
    habitat: fixed("El hábitat no coincide con el tipo de acuario"),
    speciesOnly: fixed("Hay un animal para el que se recomienda un acuario monoespecífico"),
    predation: fixed("Los animales pequeños corren riesgo de depredación"),
    waterRanges: fixed("Los rangos de parámetros del agua no se superponen"),
    smallFishPredation: fixed("Los peces pequeños pueden ser comidos"),
    finNip: fixed("Riesgo de mordisqueo de aletas"),
    conspecific: fixed("Los individuos de la misma especie pueden pelear"),
    shrimpEaten: fixed("Los camarones pueden ser comidos"),
    snailEaten: fixed("Los caracoles pueden ser comidos"),
    flowConflict: fixed("Las necesidades de corriente son distintas"),
    communityCaution: fixed("La elección de compañeros de acuario requiere cuidado"),
    shrimpUnverified: fixed("Compatibilidad con camarones sin confirmar"),
    compatible: fixed("Existen rangos de condiciones en común"),
    manufacturerMax: (p, f) => `El fabricante recomienda como máximo ${f.volume(num(p, "liters"))}`,
    ratedTurnover: (p, f) => `${f.cycles(num(p, "turnover"))} veces el volumen por hora con el caudal nominal`,
    mixedMax: (p, f) => `Como máximo ${f.volume(num(p, "liters"))} según la recomendación del fabricante y el caudal nominal`,
    airReady: fixed("Conexión del filtro de esponja con bomba de aire lista"),
    airMissing: fixed("El filtro de esponja necesita una bomba de aire"),
    flowUnverified: fixed("Datos de caudal pendientes de confirmación"),
    auxiliaryOnly: fixed("Solo hay un limpiador de superficie auxiliar registrado; se necesita un filtro principal"),
    noFilter: fixed("No se encontró ningún filtro en el catálogo"),
    estimatedOk: (p, f) => `Volumen estimado adecuado para un total de ${f.number(num(p, "watts"))} W`,
    manufacturerOk: fixed("Dentro del rango de volumen del fabricante"),
    powerLow: fixed("La potencia de calefacción es baja para este volumen"),
    powerHigh: fixed("La potencia de calefacción es alta para este volumen"),
    outOfRange: fixed("Fuera del rango de volumen"),
    heaterUnverified: fixed("Datos de potencia o volumen pendientes de confirmación"),
    noHeater: fixed("No se encontró ningún calentador en el catálogo"),
    latestReading: fixed("Según la última medición"),
    readingNeeded: fixed("Hay que agregar una medición"),
    recordsReady: (p, f) =>
      `${f.number(num(p, "ready"))}/${f.number(num(p, "total"))} registros de seguridad listos para el cálculo${num(p, "userValue") ? ` · ${f.number(num(p, "userValue"))} ${plural(num(p, "userValue"), "registro", "registros")} con un valor que ingresaste` : ""}`,
    noRecords: fixed("No se encontraron registros para el cálculo de seguridad"),
  },
  warnings: {
    unmatchedAnimals: {
      title: fixed("Hay un registro de animales que no coincide con el catálogo"),
      message: (p, f) => `${f.number(num(p, "count"))} ${plural(num(p, "count"), "registro de animal no se reconoció y quedó", "registros de animales no se reconocieron y quedaron")} fuera del cálculo de carga biológica y de compatibilidad.`,
    },
    unmatchedEquipment: {
      title: fixed("Hay un registro de equipo que no coincide con el catálogo"),
      message: (p, f) => `No se reconoció la capacidad de ${f.number(num(p, "count"))} ${plural(num(p, "count"), "equipo", "equipos")}, por lo que quedó fuera del cálculo de filtración o del calentador.`,
    },
    unverifiedAnimals: {
      title: fixed("Algunos datos de animales están pendientes de confirmación"),
      message: (p, f) => `${f.number(num(p, "count"))} ${plural(num(p, "count"), "registro de animal quedó", "registros de animales quedaron")} fuera del cálculo de seguridad; debería elegirse un registro confirmado del catálogo.`,
    },
    unverifiedEquipment: {
      title: fixed("Algunos datos de equipos están pendientes de confirmación"),
      message: (p, f) => `Los valores técnicos de ${f.number(num(p, "count"))} ${plural(num(p, "count"), "registro de equipo", "registros de equipos")} no se usaron en el cálculo automático de capacidad.`,
    },
    missingCapacity: {
      title: fixed("Faltan datos de capacidad del equipo"),
      message: (p, f) =>
        `${list(p, "names").join(", ")}${num(p, "remaining") ? ` y ${f.number(num(p, "remaining"))} ${plural(num(p, "remaining"), "equipo", "equipos")} más` : ""} ${num(p, "remaining") ? "no se pudieron" : plural(list(p, "names").length, "no se pudo", "no se pudieron")} incluir en el cálculo de capacidad segura.${str(p, "note") ? ` ${str(p, "note")}` : " Debería confirmarse el caudal, el volumen o la conexión a la bomba de aire necesarios."}`,
    },
    primaryFilterRequired: {
      title: fixed("Se necesita un filtro principal"),
      message: fixed("Un limpiador de superficie recoge la película de la superficie del agua, pero por sí solo no puede reemplazar a un filtro principal mecánico y biológico. Agrega del catálogo un filtro principal adecuado para el acuario."),
    },
    airPumpRequired: {
      title: fixed("El filtro de esponja necesita una bomba de aire"),
      message: fixed("El filtro de esponja seleccionado no mueve el agua por sí solo. Agrega del catálogo una bomba de aire adecuada."),
    },
    highLoad: {
      title: fixed("La carga biológica puede ser alta"),
      message: fixed("La carga estimada de animales está claramente por encima de las condiciones recomendadas en las fuentes de las especies. Antes de agregar animales, revisa la filtración y la frecuencia de mantenimiento; mide el amoníaco, el nitrito y el nitrato con regularidad."),
    },
    strongFlow: {
      title: fixed("El flujo del filtro puede ser fuerte"),
      message: (p, f) => `Caudal estimado: ${f.cycles(num(p, "turnover"))} veces el volumen por hora. Para las especies que prefieren poca corriente, considera dispersar la salida del filtro.`,
    },
    filterTooSmallManufacturer: {
      title: fixed("El filtro es demasiado pequeño para este acuario"),
      message: (p, f) => `El volumen neto del acuario (${f.volume(num(p, "volume"), num(p, "liters"))}) supera en más de un 50% ${manufacturerCapacity(p, f)}. Agrega un filtro adecuado para el acuario.`,
    },
    filterOverManufacturer: {
      title: fixed("El filtro funciona por encima de la recomendación del fabricante"),
      message: (p, f) => `El volumen neto del acuario (${f.volume(num(p, "volume"), num(p, "liters"))}) supera ${manufacturerCapacity(p, f)}. Haz el mantenimiento del filtro con frecuencia; considera un filtro más grande antes de agregar animales.`,
    },
    filterFlowInsufficient: {
      title: fixed("El caudal del filtro es insuficiente"),
      message: (p, f) =>
        `Como no hay una recomendación de volumen del fabricante, se usó el caudal nominal: el agua del acuario circula unas ${f.cycles(num(p, "turnover"))} veces por hora. Con las mangueras y los materiales filtrantes, el caudal real baja a aproximadamente la mitad; agrega un filtro adecuado para el acuario.`,
    },
    filterFlowLow: {
      title: fixed("El caudal del filtro puede ser bajo"),
      message: (p, f) =>
        `Como no hay una recomendación de volumen del fabricante, se usó el caudal nominal: el agua del acuario circula unas ${f.cycles(num(p, "turnover"))} veces por hora, frente a un mínimo recomendado de ${f.cycles(num(p, "min"))}. A medida que el filtro se ensucia, el caudal real baja todavía más.`,
    },
    filterTooSmallMixed: {
      title: fixed("El filtro es demasiado pequeño para este acuario"),
      message: (p, f) =>
        `El volumen neto del acuario (${f.volume(num(p, "volume"), num(p, "liters"))}) supera el mayor volumen que los filtros pueden atender según la recomendación del fabricante y el caudal nominal (${f.volume(num(p, "liters"), num(p, "volume"))}). Agrega un filtro adecuado para el acuario.`,
    },
    filterCapacityLow: {
      title: fixed("La capacidad del filtro puede ser baja"),
      message: (p, f) =>
        `El volumen neto del acuario (${f.volume(num(p, "volume"), num(p, "liters"))}) supera el volumen para el que los filtros son adecuados según la recomendación del fabricante y el caudal nominal (${f.volume(num(p, "liters"), num(p, "volume"))}). Haz el mantenimiento del filtro con frecuencia; considera un filtro más potente antes de agregar animales.`,
    },
    heaterTooSmall: {
      title: fixed("La potencia del calentador puede ser insuficiente"),
      message: fixed("El rango de volumen del fabricante o la potencia en vatios del calentador seleccionado no alcanza para este acuario."),
    },
    heaterTooLarge: {
      title: fixed("El calentador puede ser muy potente para el acuario"),
      message: fixed("Un calentador de alta potencia puede cambiar la temperatura rápidamente en un volumen pequeño. Son importantes un termostato confiable y una ubicación correcta."),
    },
    heaterMismatch: {
      title: fixed("El calentador no corresponde al volumen"),
      message: fixed("El rango de volumen que indica el catálogo para el calentador seleccionado no cubre este acuario."),
    },
    habitatMismatch: {
      title: (p) => `${str(p, "name")}: tipo de acuario incompatible`,
      message: (p) =>
        `No se considera seguro tener ${str(p, "name")} en un acuario de ${aquariumTypeName(str(p, "aquariumType"))}. Elige un acuario aparte adecuado para el tipo de agua que admite su perfil.`,
    },
    salinityReadingNeeded: {
      title: fixed("Se necesita una medición de gravedad específica"),
      message: fixed("No se pudo evaluar la compatibilidad de salinidad de los animales marinos. Agrega una medición de gravedad específica tomada con un refractómetro o un densímetro."),
    },
    salinityOutOfRange: {
      title: fixed("Gravedad específica fuera del rango de los animales"),
      message: (p, f) => `Para ${f.number(num(p, "count"))} ${plural(num(p, "count"), "animal", "animales")}, la última medición de gravedad específica está fuera del rango seguro del catálogo.`,
    },
    marineSpecificGravity: {
      title: fixed("Gravedad específica fuera del objetivo"),
      message: (p, f) => `El objetivo de OATA para un ${marineTarget(p)} es ${marineRange(p, f)}; última medición: ${f.measurement(num(p, "value"), 3)}.`,
    },
    marineSpecificGravityDanger: {
      title: fixed("Gravedad específica fuera del rango seguro"),
      message: (p, f) =>
        `Última medición: ${f.measurement(num(p, "value"), 3)}. Ninguno de los objetivos de OATA para acuarios domésticos cubre este valor (${f.measurement(MARINE_SPECIFIC_GRAVITY_SAFE_MIN, 3)}–${f.measurement(MARINE_SPECIFIC_GRAVITY_SAFE_MAX, 3)}). Lleva la salinidad al objetivo poco a poco.`,
    },
    marinePh: {
      title: fixed("pH fuera del objetivo"),
      message: (p, f) => `El objetivo de OATA para un ${marineTarget(p)} es pH ${marineRange(p, f)}; última medición: ${f.measurement(num(p, "value"), 2)}.`,
    },
    marineKh: {
      title: fixed("KH fuera del objetivo"),
      message: (p, f) => `El objetivo de OATA para un ${marineTarget(p)} es KH ${marineRange(p, f)} dKH; última medición: ${f.measurement(num(p, "value"), 2)} dKH.`,
    },
    marineNitrate: {
      title: fixed("Nitrato por encima del objetivo"),
      message: (p, f) => `El objetivo de OATA para un ${marineTarget(p)} es nitrato de ${f.measurement(num(p, "max"), 3)} mg/L como máximo; última medición: ${f.measurement(num(p, "value"), 2)} mg/L.`,
    },
    invalidReading: {
      title: fixed("Medición del agua no válida"),
      message: (p) => {
        const names = list(p, "fields").map(waterFieldName);
        return names.length > 1
          ? `Los valores de ${nameList(names)} de la última medición no son válidos (negativos o no son un número válido); no se evaluaron. Vuelve a medir y guarda.`
          : `El valor de ${names[0]} de la última medición no es válido (negativo o no es un número válido); no se evaluó. Vuelve a medir y guarda.`;
      },
    },
    ammoniaWorstCase: {
      title: fixed("El amoníaco puede ser tóxico"),
      message: (p, f) =>
        `Amoníaco total: ${f.measurement(num(p, "total"), 3, num(p, "limit"))} ppm. Como la medición de pH o de temperatura falta o no es válida, no se pudo calcular la parte tóxica (libre); en el peor de los casos se supera el límite superior seguro de ${f.measurement(num(p, "limit"), 3, num(p, "total"))} ppm. Mide también el pH y la temperatura y, mientras tanto, haz un cambio parcial de agua.`,
    },
    ammoniaToxic: {
      title: fixed("Amoníaco tóxico por encima del límite"),
      message: (p, f) =>
        `Con el pH y la temperatura medidos, el amoníaco libre (tóxico) es de aproximadamente ${f.measurement(num(p, "free"), 4, num(p, "limit"))} ppm; el límite superior seguro es ${f.measurement(num(p, "limit"), 3, num(p, "free"))} ppm. Haz un cambio parcial de agua ahora, reduce la alimentación y revisa el filtro.`,
    },
    ammoniaDetected: {
      title: fixed("Se detectó amoníaco"),
      message: (p, f) =>
        `Amoníaco total: ${f.measurement(num(p, "total"))} ppm. En un acuario maduro el amoníaco debe ser 0; los valores por encima de cero solo pueden tolerarse durante poco tiempo. Si el pH sube, la parte tóxica aumenta rápidamente.`,
    },
    nitriteHigh: {
      title: fixed("Nitrito por encima del límite"),
      message: (p, f) => `Nitrito: ${f.measurement(num(p, "value"), 3, num(p, "limit"))} ppm; el límite superior seguro es ${f.measurement(num(p, "limit"), 3, num(p, "value"))} ppm. Haz un cambio parcial de agua ahora y revisa el filtro.`,
    },
    nitriteDetected: {
      title: fixed("Se detectó nitrito"),
      message: (p, f) => `Nitrito: ${f.measurement(num(p, "value"))} ppm. El nitrito debe ser 0; los valores por encima de cero solo pueden tolerarse durante poco tiempo.`,
    },
    nitrateTooHighSaltwater: {
      title: fixed("Nitrato muy alto"),
      message: (p, f) =>
        `Nitrato: ${f.measurement(num(p, "value"), 3, MARINE_NITRATE_LIMIT_PPM)} ppm; el límite superior para un acuario marino es ${f.measurement(MARINE_NITRATE_LIMIT_PPM, 3, num(p, "value"))} ppm. Aumenta los cambios de agua.`,
    },
    nitrateTooHigh: {
      title: fixed("Nitrato muy alto"),
      message: (p, f) =>
        `Nitrato: ${f.measurement(num(p, "value"), 3, TAP_WATER_NITRATE_LIMIT_PPM + NITRATE_ABOVE_TAP_LIMIT_PPM)} ppm. Como el agua de la llave puede contener legalmente hasta ${f.measurement(TAP_WATER_NITRATE_LIMIT_PPM)} ppm de nitrato (el límite de la UE; en Estados Unidos el límite es menor), se superó el límite recomendado (como máximo ${f.measurement(NITRATE_ABOVE_TAP_LIMIT_PPM)} ppm por encima del agua de la llave). Aumenta los cambios de agua.`,
    },
    nitrateHigh: {
      title: fixed("El nitrato puede estar alto"),
      message: (p, f) =>
        `Nitrato: ${f.measurement(num(p, "value"), 3, NITRATE_ABOVE_TAP_LIMIT_PPM)} ppm. El límite recomendado es, como máximo, ${f.measurement(NITRATE_ABOVE_TAP_LIMIT_PPM)} ppm por encima del agua de la llave; mide también el nitrato de tu agua de la llave y aumenta los cambios de agua.`,
    },
    temperatureConflict: {
      title: fixed("Las necesidades de temperatura de las especies no coinciden"),
      message: fixed("No se encontró un rango de temperatura común y seguro para los animales seleccionados."),
    },
    phConflict: {
      title: fixed("Las necesidades de pH de las especies no coinciden"),
      message: fixed("No se encontró un rango de pH común y seguro para los animales seleccionados."),
    },
    flowConflict: {
      title: fixed("Las necesidades de corriente son distintas"),
      message: fixed("Se eligieron juntas especies que necesitan corriente baja y corriente alta. Deberían crearse en el acuario zonas de corriente tranquila y zonas de corriente fuerte."),
    },
    predation: {
      title: (p) => `Riesgo de depredación para ${str(p, "prey")}`,
      message: (p) => `Por la diferencia de tamaño adulto, puede no ser seguro que ${str(p, "predator")} comparta acuario con ${str(p, "prey")}.`,
    },
    speciesOnly: {
      title: (p) => `Se recomienda un acuario monoespecífico para ${str(p, "name")}`,
      message: fixed("Por su agresividad y su comportamiento alimentario especial, esta especie no se considera segura junto con otros animales."),
    },
    communityCaution: {
      title: (p) => `${str(p, "name")}: elige con cuidado a sus compañeros de acuario`,
      message: catalogNote,
    },
    smallFishPredation: {
      title: (p) => `${str(p, "prey")}: puede ser presa`,
      message: (p) => `${str(p, "hunter")} puede comer peces pequeños que le quepan en la boca; con su tamaño adulto, ${str(p, "prey")} corre este riesgo.${sourceNote(p)}`,
    },
    finNip: {
      title: (p) => `${str(p, "target")}: riesgo de mordisqueo de aletas`,
      message: (p) =>
        `${str(p, "nipper")} puede mordisquear aletas; no se recomienda que conviva con peces de aletas largas o de nado lento, como ${str(p, "target")}.${sourceNote(p)}`,
    },
    conspecificMales: {
      title: (p) => `${str(p, "name")}: los machos pelean`,
      message: (p, f) =>
        `Según la fuente, los machos de esta especie pelean entre sí; si entre los ${f.number(num(p, "count"))} ${plural(num(p, "count"), "individuo registrado", "individuos registrados")} hay más de un macho, sepáralos.${sourceNote(p)}`,
    },
    conspecificAll: {
      title: (p) => `${str(p, "name")}: debe mantenerse en solitario`,
      message: (p) => `Según la fuente, esta especie es agresiva con individuos de su misma especie y, por lo general, debe mantenerse en solitario.${sourceNote(p)}`,
    },
    shrimpEaten: {
      title: fixed("Los camarones pueden ser comidos"),
      message: (p) =>
        `Según las fuentes, ${nameList(list(p, "eaters"))} ${plural(list(p, "eaters").length, "come", "comen")} camarones; ${nameList(list(p, "shrimp"))} y, sobre todo, sus crías están en riesgo. Fuente: ${list(p, "sources").join(", ")}.`,
    },
    snailEaten: {
      title: fixed("Los caracoles pueden ser comidos"),
      message: (p) => {
        const conditions = list(p, "noteConditions");
        const notes = list(p, "noteNames").map((name, index) => (conditions[index] ? ` ${name}: ${sentence(conditions[index])}` : "")).join("");
        return `Según las fuentes, ${nameList(list(p, "eaters"))} ${plural(list(p, "eaters").length, "come", "comen")} caracoles; ${nameList(list(p, "snails"))} ${plural(list(p, "snails").length, "puede", "pueden")} estar en riesgo.${notes} Fuente: ${list(p, "sources").join(", ")}.`;
      },
    },
    shrimpUnverified: {
      title: fixed("Compatibilidad con camarones sin confirmar"),
      message: (p) =>
        `No se encontró en las fuentes la indicación "seguro con camarones" para ${nameList(list(p, "fish"))}. OATA recomienda no mantener camarones con peces en cuya boca puedan caber; las crías de ${nameList(list(p, "shrimp"))} y los camarones recién mudados están especialmente en riesgo.`,
    },
    husbandryCaution: {
      title: (p) => `${str(p, "name")}: necesidades de cuidado especiales`,
      message: catalogNote,
    },
    tankLengthNote: {
      title: (p) => `${str(p, "name")}: datos limitados sobre la longitud del acuario`,
      message: catalogNote,
    },
    groupLow: {
      title: (p) => `${str(p, "name")}: tamaño de grupo bajo`,
      message: (p, f) => `Cantidad registrada: ${f.number(num(p, "count"))}; el catálogo recomienda al menos ${f.number(num(p, "min"))}.`,
    },
    spaceLimited: {
      title: (p) => `${str(p, "name")}: espacio al límite`,
      message: spaceReference,
    },
    spaceSevere: {
      title: (p) => `${str(p, "name")}: acuario demasiado pequeño`,
      message: (p, f) =>
        `${spaceReference(p, f)} Además, el acuario está por debajo del límite de AquaMind adaptado de la regla de dimensiones de la Ordenanza de Protección de los Animales de Suiza (largo 3×, ancho 2×, profundidad del agua 1× la longitud del cuerpo). La ordenanza usa la longitud del cuerpo sin la aleta caudal; AquaMind aplica un criterio más estricto y usa el tamaño adulto del catálogo, ${f.length(num(p, "size"))} (longitud total en la mayoría de las especies): largo de al menos ${f.length(num(p, "minLength"))}, ancho de al menos ${f.length(num(p, "minWidth"))}, profundidad del agua de al menos ${f.length(num(p, "minDepth"))}.`,
    },
  },
};
