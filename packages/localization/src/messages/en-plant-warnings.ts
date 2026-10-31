// Bitki uyarılarının İngilizce metinleri (karar 0021, 5. paket). Türkçe dosyayla (`tr-plant-warnings.ts`) aynı kodlar ve değişkenler.
import type { PlantWarningFormat } from "../plant-warnings";
import type { PlantWarningMessages, PlantWarningParams } from "./tr-plant-warnings";

type Text = (p: PlantWarningParams, f: PlantWarningFormat) => string;

const num = (p: PlantWarningParams, key: string) => p[key] as number;
const str = (p: PlantWarningParams, key: string) => p[key] as string;
const high = (p: PlantWarningParams) => str(p, "direction") === "high";
const levelNames: Record<string, string> = { low: "low", medium: "medium", high: "high" };
// İstilacı tür listelerinin adları bitki kartındaki uyarıyla aynı (`en.ts` → `plants.catalog.invasive.lists`).
const invasiveListNames: Record<string, string> = {
  "us-federal-noxious-weed": "on the US federal noxious weed list",
  "fisc-invasive": "on the Florida Invasive Species Council's list",
  "eu-union-list": "on the European Union's list of invasive alien species",
  "england-sale-ban": "among the plants banned from sale in England",
};
const ufLists = new Set(["us-federal-noxious-weed", "fisc-invasive"]);
const join = (parts: string[]) => (parts.length > 1 ? `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}` : parts[0]);
const invasiveLists = (p: PlantWarningParams) => {
  const kinds = str(p, "lists").split(",").filter(Boolean);
  const uf = kinds.filter((kind) => ufLists.has(kind)).map((kind) => invasiveListNames[kind] ?? kind);
  const official = kinds.filter((kind) => !ufLists.has(kind)).map((kind) => invasiveListNames[kind] ?? kind);
  return join([...(uf.length ? [`${join(uf)} (UF/IFAS)`] : []), ...official]);
};

export const enPlantWarnings: PlantWarningMessages = {
  eyebrow: "Plants",
  title: "Plant warnings",
  note: "Plant warnings do not affect the health score.",
  none: "No warnings for the recorded plants.",
  noneForMatched: "No warnings for the assessed plants.",
  unmatched: (names: string) => `No warnings were calculated for plants that do not match the catalog${names ? `: ${names}` : ""}.`,
  noneChecked: (names: string) => `Warnings could not be calculated because the plants do not match the catalog${names ? `: ${names}` : ""}.`,
  noValues: (names: string) => `Light, CO₂, temperature, pH and height could not be checked for plants whose values are not in the source${names ? `: ${names}` : ""}.`,
  preparing: "Preparing plant information…",
  loadFailed: "Plant information could not be loaded; the plants' summaries and warnings cannot be shown. Check your connection and try again.",
  warnings: {
    plantNotAquatic: {
      title: (p) => `${str(p, "name")} is not an aquatic plant`,
      message: () => "Practical Fishkeeping lists this plant among the houseplants to avoid in aquariums: it survives underwater only for a short time.",
    },
    plantInvasive: {
      title: (p) => `${str(p, "name")} is on an invasive species list`,
      message: (p) => `Do not release into the wild. This plant is ${invasiveLists(p)}. Check which rules apply where you live.`,
    },
    plantCo2: {
      title: (p) => `${str(p, "name")} needs high CO₂`,
      message: () => "According to Tropica, this plant needs about 15–25 mg/L of CO₂. No CO₂ system is recorded in the aquarium; the plant may grow poorly.",
    },
    plantLight: {
      title: (p) => `${str(p, "name")} needs ${levelNames[str(p, "level")] ?? str(p, "level")} light`,
      message: () => "No lighting is recorded in the aquarium. You can add your lighting on the equipment page.",
    },
    plantTemperature: {
      title: (p) => `Water too ${high(p) ? "warm" : "cold"} for ${str(p, "name")}`,
      message: (p, f) =>
        `This plant's temperature range in the source is ${f.temperatureNumber(num(p, "min"))}–${f.temperature(num(p, "max"))}; latest reading ${f.temperature(num(p, "value"), num(p, high(p) ? "max" : "min"))}.`,
    },
    plantPh: {
      title: (p) => `pH too ${high(p) ? "high" : "low"} for ${str(p, "name")}`,
      message: (p, f) =>
        `This plant's pH range in the source is ${f.measurement(num(p, "min"))}–${f.measurement(num(p, "max"))}; latest reading ${f.measurement(num(p, "value"), num(p, high(p) ? "max" : "min"))}.`,
    },
    plantHeight: {
      title: (p, f) => `${str(p, "name")} grows up to ${f.length(num(p, "height"), num(p, "tankHeight"))}`,
      message: (p, f) => `The aquarium is ${f.length(num(p, "tankHeight"), num(p, "height"))} high. The plant reaches the water surface; regular trimming is needed.`,
    },
  } satisfies Record<string, { title: Text; message: Text }>,
};
