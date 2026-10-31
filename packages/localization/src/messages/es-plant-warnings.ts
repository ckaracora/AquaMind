// Bitki uyarılarının İspanyolca metinleri (karar 0021, İspanyolca paketi; Latin Amerika ortak İspanyolcası). Türkçe dosyayla
// (`tr-plant-warnings.ts`) aynı kodlar ve değişkenler.
import type { PlantWarningFormat } from "../plant-warnings";
import type { PlantWarningMessages, PlantWarningParams } from "./tr-plant-warnings";

type Text = (p: PlantWarningParams, f: PlantWarningFormat) => string;

const num = (p: PlantWarningParams, key: string) => p[key] as number;
const str = (p: PlantWarningParams, key: string) => p[key] as string;
const high = (p: PlantWarningParams) => str(p, "direction") === "high";
const levelNames: Record<string, string> = { low: "baja", medium: "media", high: "alta" };
// İstilacı tür listelerinin adları bitki kartındaki uyarıyla aynı (`es.ts` → `plants.catalog.invasive.lists`).
const invasiveListNames: Record<string, string> = {
  "us-federal-noxious-weed": "en la lista federal de malezas nocivas de Estados Unidos",
  "fisc-invasive": "en la lista del Consejo de Especies Invasoras de Florida",
  "eu-union-list": "en la lista de especies exóticas invasoras de la Unión Europea",
  "england-sale-ban": "entre las plantas cuya venta está prohibida en Inglaterra",
};
const ufLists = new Set(["us-federal-noxious-weed", "fisc-invasive"]);
const join = (parts: string[]) => (parts.length > 1 ? `${parts.slice(0, -1).join(", ")} y ${parts[parts.length - 1]}` : parts[0]);
const invasiveLists = (p: PlantWarningParams) => {
  const kinds = str(p, "lists").split(",").filter(Boolean);
  const uf = kinds.filter((kind) => ufLists.has(kind)).map((kind) => invasiveListNames[kind] ?? kind);
  const official = kinds.filter((kind) => !ufLists.has(kind)).map((kind) => invasiveListNames[kind] ?? kind);
  return join([...(uf.length ? [`${join(uf)} (UF/IFAS)`] : []), ...official]);
};

export const esPlantWarnings: PlantWarningMessages = {
  eyebrow: "Plantas",
  title: "Advertencias sobre plantas",
  note: "Las advertencias sobre plantas no afectan la puntuación de salud.",
  none: "No hay advertencias para las plantas registradas.",
  noneForMatched: "No hay advertencias para las plantas evaluadas.",
  unmatched: (names: string) => `No se calcularon advertencias para las plantas que no coinciden con el catálogo${names ? `: ${names}` : ""}.`,
  noneChecked: (names: string) => `No se pudieron calcular advertencias porque las plantas no coinciden con el catálogo${names ? `: ${names}` : ""}.`,
  noValues: (names: string) => `No se pudieron revisar la luz, el CO₂, la temperatura, el pH ni la altura de las plantas cuyos valores no están en la fuente${names ? `: ${names}` : ""}.`,
  preparing: "Preparando la información de las plantas…",
  loadFailed: "No se pudo cargar la información de las plantas; no se pueden mostrar sus resúmenes ni sus advertencias. Revisa tu conexión e inténtalo de nuevo.",
  warnings: {
    plantNotAquatic: {
      title: (p) => `${str(p, "name")} no es una planta acuática`,
      message: () => "Practical Fishkeeping incluye esta planta entre las plantas de interior que hay que evitar en el acuario: bajo el agua solo resiste poco tiempo.",
    },
    plantInvasive: {
      title: (p) => `${str(p, "name")} figura en una lista de especies invasoras`,
      message: (p) => `No liberar en la naturaleza. Esta planta está ${invasiveLists(p)}. Consulta qué normas se aplican donde vives.`,
    },
    plantCo2: {
      title: (p) => `${str(p, "name")} necesita un nivel alto de CO₂`,
      message: () => "Según Tropica, esta planta necesita alrededor de 15–25 mg/L de CO₂. No hay ningún sistema de CO₂ registrado en el acuario; la planta puede tener un crecimiento débil.",
    },
    plantLight: {
      title: (p) => `${str(p, "name")} necesita luz ${levelNames[str(p, "level")] ?? str(p, "level")}`,
      message: () => "No hay iluminación registrada en el acuario. Puedes agregar tu iluminación en la página de equipos.",
    },
    plantTemperature: {
      title: (p) => `Agua demasiado ${high(p) ? "caliente" : "fría"} para ${str(p, "name")}`,
      message: (p, f) =>
        `El rango de temperatura de esta planta según la fuente es ${f.temperatureNumber(num(p, "min"))}–${f.temperature(num(p, "max"))}; última medición: ${f.temperature(num(p, "value"), num(p, high(p) ? "max" : "min"))}.`,
    },
    plantPh: {
      title: (p) => `pH demasiado ${high(p) ? "alto" : "bajo"} para ${str(p, "name")}`,
      message: (p, f) =>
        `El rango de pH de esta planta según la fuente es ${f.measurement(num(p, "min"))}–${f.measurement(num(p, "max"))}; última medición: ${f.measurement(num(p, "value"), num(p, high(p) ? "max" : "min"))}.`,
    },
    plantHeight: {
      title: (p, f) => `${str(p, "name")} crece hasta ${f.length(num(p, "height"), num(p, "tankHeight"))}`,
      message: (p, f) => `El acuario tiene ${f.length(num(p, "tankHeight"), num(p, "height"))} de altura. La planta llega a la superficie del agua; hay que podarla con regularidad.`,
    },
  } satisfies Record<string, { title: Text; message: Text }>,
};
