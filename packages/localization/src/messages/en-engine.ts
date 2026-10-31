// Sağlık analizi motorunun İngilizce uyarı ve ölçüt metinleri (karar 0021, 5. paket). Türkçe dosyayla (`tr-engine.ts`) aynı kodlar ve
// değişkenler. Katalog metni taşıyan değişkenler (tür adı, not, koşul) ekranda katalog çevirmeninden geçer; çevirisi olmayan not ve koşul
// boş gelir (karar 0021, 4. paket) ve burada atlanır: boş koşul cümleye girmez, gövdesi boş kalacak uyarı genel bir cümle gösterir.
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
const nameList = (names: string[]) => (names.length > 1 ? `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}` : names[0]);
const sentence = (text: string) => text.replace(/\.?$/, ".");
const plural = (count: number, one: string, many: string) => (count === 1 ? one : many);
const sourceNote = (p: EngineTextParams) =>
  (str(p, "condition") ? ` Source note: ${sentence(str(p, "condition"))}` : "") + ` Source: ${str(p, "source")}.`;
/** Katalogdan gelen not metni; çevirisi yoksa boş gelir ve yerine bu cümle yazılır. */
const catalogNote = (p: EngineTextParams) => str(p, "text") || "The source's note for this species is not yet available in English.";
const aquariumTypeName = (type: string) => (type === "freshwater" ? "a freshwater" : type === "saltwater" ? "a saltwater" : "a brackish");
const waterFieldName = (field: string) => ({ ammonia: "ammonia", nitrite: "nitrite", nitrate: "nitrate" } as Record<string, string>)[field] ?? field;
const manufacturerCapacity = (p: EngineTextParams, f: EngineTextFormat) =>
  flag(p, "multiple")
    ? `the total volume recommended by the filters' manufacturers (${f.volume(num(p, "liters"), num(p, "volume"))})`
    : `the largest volume recommended by the filter's manufacturer (${f.volume(num(p, "liters"), num(p, "volume"))})`;
const spaceReference = (p: EngineTextParams, f: EngineTextFormat) =>
  flag(p, "hasLength")
    ? `For the recorded number, a minimum of ${f.volume(num(p, "volume"))} and a length of ${f.length(num(p, "length"))} were used as the reference.`
    : `For the recorded number, a minimum of ${f.volume(num(p, "volume"))} was used as the reference; the source publishes no tank length.`;
const fixed = (text: string): Text => () => text;
const marineTarget = (p: EngineTextParams) => (str(p, "profile") === "fishOnly" ? "fish-only aquarium" : "aquarium with invertebrates");
const marineRange = (p: EngineTextParams, f: EngineTextFormat) => `${f.measurement(num(p, "min"), 3)}–${f.measurement(num(p, "max"), 3)}`;

export const enEngine: EngineMessages = {
  metricLabels: {
    load: "Bioload",
    space: "Swimming space",
    social: "Social needs",
    compatibility: "Species compatibility",
    filter: "Filtration",
    heater: "Heater",
    water: "Water parameters",
    confidence: "Data confidence",
  },
  metricDetails: {
    loadRatio: (p, f) => `Estimated load ratio ${f.number(num(p, "percent"))}%`,
    spaceSevere: (p, f) => `Aquarium too small for ${f.number(num(p, "count"))} ${plural(num(p, "count"), "species", "species")}`,
    spaceLimited: (p, f) => `Space is borderline for ${f.number(num(p, "count"))} ${plural(num(p, "count"), "species", "species")}`,
    spaceOk: fixed("Suitable for the recorded species"),
    groupLow: (p, f) => `Group size is low for ${f.number(num(p, "count"))} ${plural(num(p, "count"), "species", "species")}`,
    groupOk: fixed("Group needs are met"),
    habitat: fixed("Habitat does not match the aquarium type"),
    speciesOnly: fixed("An animal is recommended for a species aquarium"),
    predation: fixed("Small animals are at risk of predation"),
    waterRanges: fixed("Water parameter ranges do not overlap"),
    smallFishPredation: fixed("Small fish may be eaten"),
    finNip: fixed("Risk of fin nipping"),
    conspecific: fixed("Individuals of the same species may fight"),
    shrimpEaten: fixed("Shrimp may be eaten"),
    snailEaten: fixed("Snails may be eaten"),
    flowConflict: fixed("Flow needs differ"),
    communityCaution: fixed("Tankmate choice needs care"),
    shrimpUnverified: fixed("Shrimp compatibility not confirmed"),
    compatible: fixed("Shared living ranges exist"),
    manufacturerMax: (p, f) => `Manufacturer recommends at most ${f.volume(num(p, "liters"))}`,
    ratedTurnover: (p, f) => `${f.cycles(num(p, "turnover"))} turnovers/hour at the rated flow`,
    mixedMax: (p, f) => `At most ${f.volume(num(p, "liters"))} by manufacturer recommendation and rated flow`,
    airReady: fixed("Air-driven sponge filter connection ready"),
    airMissing: fixed("Sponge filter needs an air pump"),
    flowUnverified: fixed("Flow data awaiting confirmation"),
    auxiliaryOnly: fixed("Only an auxiliary surface skimmer recorded; a main filter is needed"),
    noFilter: fixed("No filter found in the catalog"),
    estimatedOk: (p, f) => `Estimated volume suitable for a total of ${f.number(num(p, "watts"))} W`,
    manufacturerOk: fixed("Within the manufacturer's volume range"),
    powerLow: fixed("Heating power is low for this volume"),
    powerHigh: fixed("Heating power is high for this volume"),
    outOfRange: fixed("Outside the volume range"),
    heaterUnverified: fixed("Wattage or volume data awaiting confirmation"),
    noHeater: fixed("No heater found in the catalog"),
    latestReading: fixed("Based on the latest reading"),
    readingNeeded: fixed("A reading needs to be added"),
    recordsReady: (p, f) =>
      `${f.number(num(p, "ready"))}/${f.number(num(p, "total"))} safety records ready for the calculation${num(p, "userValue") ? ` · ${f.number(num(p, "userValue"))} ${plural(num(p, "userValue"), "record", "records")} with a value you entered` : ""}`,
    noRecords: fixed("No records found for the safety calculation"),
  },
  warnings: {
    unmatchedAnimals: {
      title: fixed("A livestock record does not match the catalog"),
      message: (p, f) => `${f.number(num(p, "count"))} ${plural(num(p, "count"), "livestock record was", "livestock records were")} not recognized and ${plural(num(p, "count"), "was", "were")} left out of the bioload and compatibility calculation.`,
    },
    unmatchedEquipment: {
      title: fixed("An equipment record does not match the catalog"),
      message: (p, f) => `The capacity of ${f.number(num(p, "count"))} ${plural(num(p, "count"), "device", "devices")} was not recognized and was left out of the filtration or heater calculation.`,
    },
    unverifiedAnimals: {
      title: fixed("Some livestock data is awaiting confirmation"),
      message: (p, f) => `${f.number(num(p, "count"))} ${plural(num(p, "count"), "livestock record was", "livestock records were")} left out of the safety calculation; a confirmed catalog record should be chosen.`,
    },
    unverifiedEquipment: {
      title: fixed("Some equipment data is awaiting confirmation"),
      message: (p, f) => `The technical values of ${f.number(num(p, "count"))} ${plural(num(p, "count"), "equipment record were", "equipment records were")} not used in the automatic capacity calculation.`,
    },
    missingCapacity: {
      title: fixed("Equipment capacity data is missing"),
      message: (p, f) =>
        `${list(p, "names").join(", ")}${num(p, "remaining") ? ` and ${f.number(num(p, "remaining"))} more ${plural(num(p, "remaining"), "device", "devices")}` : ""} could not be included in the safe capacity calculation.${str(p, "note") ? ` ${str(p, "note")}` : " The required flow rate, volume or air pump connection should be confirmed."}`,
    },
    primaryFilterRequired: {
      title: fixed("A main filter is needed"),
      message: fixed("A surface skimmer collects the film on the water surface but cannot replace a main mechanical and biological filter on its own. Add a suitable main filter for the aquarium from the catalog."),
    },
    airPumpRequired: {
      title: fixed("Sponge filter needs an air pump"),
      message: fixed("The selected sponge filter does not move water on its own. Add a suitable air pump from the catalog."),
    },
    highLoad: {
      title: fixed("Bioload may be high"),
      message: fixed("The estimated livestock load is clearly above the conditions recommended in the species' sources. Before adding livestock, review the filtration and maintenance frequency; measure ammonia, nitrite and nitrate regularly."),
    },
    strongFlow: {
      title: fixed("Filter flow may be strong"),
      message: (p, f) => `Estimated ${f.cycles(num(p, "turnover"))} turnovers/hour. Consider spreading the outflow for species that like low flow.`,
    },
    filterTooSmallManufacturer: {
      title: fixed("The filter is too small for this aquarium"),
      message: (p, f) => `The aquarium's net volume (${f.volume(num(p, "volume"), num(p, "liters"))}) is more than 50% above ${manufacturerCapacity(p, f)}. Add a suitable filter for the aquarium.`,
    },
    filterOverManufacturer: {
      title: fixed("The filter is above the manufacturer's recommendation"),
      message: (p, f) => `The aquarium's net volume (${f.volume(num(p, "volume"), num(p, "liters"))}) is above ${manufacturerCapacity(p, f)}. Clean the filter often; consider a larger filter before adding livestock.`,
    },
    filterFlowInsufficient: {
      title: fixed("Filter flow is insufficient"),
      message: (p, f) =>
        `With no manufacturer volume recommendation, the rated flow was used: the aquarium's water circulates about ${f.cycles(num(p, "turnover"))} times per hour. With hoses and filter media the real flow drops to about half of this; add a suitable filter for the aquarium.`,
    },
    filterFlowLow: {
      title: fixed("Filter flow may be low"),
      message: (p, f) =>
        `With no manufacturer volume recommendation, the rated flow was used: the aquarium's water circulates about ${f.cycles(num(p, "turnover"))} times per hour, against a recommended minimum of ${f.cycles(num(p, "min"))}. As the filter gets dirty, the real flow drops further.`,
    },
    filterTooSmallMixed: {
      title: fixed("The filter is too small for this aquarium"),
      message: (p, f) =>
        `The aquarium's net volume (${f.volume(num(p, "volume"), num(p, "liters"))}) is above the largest volume the filters can handle by manufacturer recommendation and rated flow (${f.volume(num(p, "liters"), num(p, "volume"))}). Add a suitable filter for the aquarium.`,
    },
    filterCapacityLow: {
      title: fixed("Filter capacity may be low"),
      message: (p, f) =>
        `The aquarium's net volume (${f.volume(num(p, "volume"), num(p, "liters"))}) is above the volume the filters suit by manufacturer recommendation and rated flow (${f.volume(num(p, "liters"), num(p, "volume"))}). Clean the filter often; consider a stronger filter before adding livestock.`,
    },
    heaterTooSmall: {
      title: fixed("Heater power may be insufficient"),
      message: fixed("The selected heater's manufacturer volume range or wattage is too low for this aquarium."),
    },
    heaterTooLarge: {
      title: fixed("The heater may be strong for the aquarium"),
      message: fixed("A high-power heater can change the temperature quickly in a small volume. A reliable thermostat and correct placement are important."),
    },
    heaterMismatch: {
      title: fixed("The heater does not match the volume"),
      message: fixed("The selected heater's catalog volume range does not cover this aquarium."),
    },
    habitatMismatch: {
      title: (p) => `${str(p, "name")}: wrong aquarium type`,
      message: (p) =>
        `${str(p, "name")} is not considered safe in ${aquariumTypeName(str(p, "aquariumType"))} aquarium. Choose a separate aquarium suited to the water type its profile supports.`,
    },
    salinityReadingNeeded: {
      title: fixed("A specific gravity reading is needed"),
      message: fixed("The salinity compatibility of the marine animals could not be assessed. Add a specific gravity reading taken with a refractometer or hydrometer."),
    },
    salinityOutOfRange: {
      title: fixed("Specific gravity outside the animals' range"),
      message: (p, f) => `For ${f.number(num(p, "count"))} ${plural(num(p, "count"), "animal", "animals")}, the latest specific gravity reading is outside the safe catalog range.`,
    },
    marineSpecificGravity: {
      title: fixed("Specific gravity off target"),
      message: (p, f) => `OATA's target for a ${marineTarget(p)} is ${marineRange(p, f)}; latest reading ${f.measurement(num(p, "value"), 3)}.`,
    },
    marineSpecificGravityDanger: {
      title: fixed("Specific gravity outside the safe range"),
      message: (p, f) =>
        `Latest reading ${f.measurement(num(p, "value"), 3)}. None of OATA's home aquarium targets covers this value (${f.measurement(MARINE_SPECIFIC_GRAVITY_SAFE_MIN, 3)}–${f.measurement(MARINE_SPECIFIC_GRAVITY_SAFE_MAX, 3)}). Bring the salinity to the target slowly.`,
    },
    marinePh: {
      title: fixed("pH off target"),
      message: (p, f) => `OATA's target for a ${marineTarget(p)} is pH ${marineRange(p, f)}; latest reading ${f.measurement(num(p, "value"), 2)}.`,
    },
    marineKh: {
      title: fixed("KH off target"),
      message: (p, f) => `OATA's target for a ${marineTarget(p)} is KH ${marineRange(p, f)} dKH; latest reading ${f.measurement(num(p, "value"), 2)} dKH.`,
    },
    marineNitrate: {
      title: fixed("Nitrate above target"),
      message: (p, f) => `OATA's target for a ${marineTarget(p)} is nitrate at most ${f.measurement(num(p, "max"), 3)} mg/L; latest reading ${f.measurement(num(p, "value"), 2)} mg/L.`,
    },
    invalidReading: {
      title: fixed("Invalid water reading"),
      message: (p) => {
        const names = list(p, "fields").map(waterFieldName);
        return names.length > 1
          ? `The ${nameList(names)} values in the latest reading are invalid (negative or not a valid number); they were not assessed. Measure again and save.`
          : `The ${names[0]} value in the latest reading is invalid (negative or not a valid number); it was not assessed. Measure again and save.`;
      },
    },
    ammoniaWorstCase: {
      title: fixed("Ammonia may be toxic"),
      message: (p, f) =>
        `Total ammonia ${f.measurement(num(p, "total"), 3, num(p, "limit"))} ppm. Because the pH or temperature reading is missing or invalid, the toxic (free) part could not be calculated; in the worst case the safe upper limit of ${f.measurement(num(p, "limit"), 3, num(p, "total"))} ppm is exceeded. Measure pH and temperature too, and make a partial water change meanwhile.`,
    },
    ammoniaToxic: {
      title: fixed("Toxic ammonia above the limit"),
      message: (p, f) =>
        `At the measured pH and temperature, free (toxic) ammonia is about ${f.measurement(num(p, "free"), 4, num(p, "limit"))} ppm; the safe upper limit is ${f.measurement(num(p, "limit"), 3, num(p, "free"))} ppm. Make a partial water change now, feed less and check the filter.`,
    },
    ammoniaDetected: {
      title: fixed("Ammonia detected"),
      message: (p, f) =>
        `Total ammonia ${f.measurement(num(p, "total"))} ppm. In a mature aquarium ammonia should be 0; values above zero can only be tolerated for a short time. If the pH rises, the toxic part increases quickly.`,
    },
    nitriteHigh: {
      title: fixed("Nitrite above the limit"),
      message: (p, f) => `Nitrite ${f.measurement(num(p, "value"), 3, num(p, "limit"))} ppm; the safe upper limit is ${f.measurement(num(p, "limit"), 3, num(p, "value"))} ppm. Make a partial water change now and check the filter.`,
    },
    nitriteDetected: {
      title: fixed("Nitrite detected"),
      message: (p, f) => `Nitrite ${f.measurement(num(p, "value"))} ppm. Nitrite should be 0; values above zero can only be tolerated for a short time.`,
    },
    nitrateTooHighSaltwater: {
      title: fixed("Nitrate very high"),
      message: (p, f) =>
        `Nitrate ${f.measurement(num(p, "value"), 3, MARINE_NITRATE_LIMIT_PPM)} ppm; the upper limit for a marine aquarium is ${f.measurement(MARINE_NITRATE_LIMIT_PPM, 3, num(p, "value"))} ppm. Increase water changes.`,
    },
    nitrateTooHigh: {
      title: fixed("Nitrate very high"),
      message: (p, f) =>
        `Nitrate ${f.measurement(num(p, "value"), 3, TAP_WATER_NITRATE_LIMIT_PPM + NITRATE_ABOVE_TAP_LIMIT_PPM)} ppm. Because tap water can legally contain up to ${f.measurement(TAP_WATER_NITRATE_LIMIT_PPM)} ppm nitrate (the EU limit; the US limit is lower), the recommended limit (at most ${f.measurement(NITRATE_ABOVE_TAP_LIMIT_PPM)} ppm above tap water) has been exceeded. Increase water changes.`,
    },
    nitrateHigh: {
      title: fixed("Nitrate may be high"),
      message: (p, f) =>
        `Nitrate ${f.measurement(num(p, "value"), 3, NITRATE_ABOVE_TAP_LIMIT_PPM)} ppm. The recommended limit is at most ${f.measurement(NITRATE_ABOVE_TAP_LIMIT_PPM)} ppm above tap water; measure your tap water's nitrate too and increase water changes.`,
    },
    temperatureConflict: {
      title: fixed("The species' temperature needs do not match"),
      message: fixed("No shared, safe temperature range was found for the selected animals."),
    },
    phConflict: {
      title: fixed("The species' pH needs do not match"),
      message: fixed("No shared, safe pH range was found for the selected animals."),
    },
    flowConflict: {
      title: fixed("Flow needs differ"),
      message: fixed("Species that need low and high flow were chosen together. Calm and strong flow zones should be created in the aquarium."),
    },
    predation: {
      title: (p) => `Predation risk for ${str(p, "prey")}`,
      message: (p) => `Because of the difference in adult size, ${str(p, "predator")} may not be a safe tankmate for ${str(p, "prey")}.`,
    },
    speciesOnly: {
      title: (p) => `A species aquarium is recommended for ${str(p, "name")}`,
      message: fixed("Because of its aggression and special feeding behavior, this species is not considered safe with other animals."),
    },
    communityCaution: {
      title: (p) => `${str(p, "name")}: choose tankmates with care`,
      message: catalogNote,
    },
    smallFishPredation: {
      title: (p) => `${str(p, "prey")}: may be eaten`,
      message: (p) => `${str(p, "hunter")} can eat small fish that fit in its mouth; at its adult size, ${str(p, "prey")} is within this risk.${sourceNote(p)}`,
    },
    finNip: {
      title: (p) => `${str(p, "target")}: risk of fin nipping`,
      message: (p) =>
        `${str(p, "nipper")} can nip fins; keeping it with long- or slow-finned fish such as ${str(p, "target")} is not recommended.${sourceNote(p)}`,
    },
    conspecificMales: {
      title: (p) => `${str(p, "name")}: males fight`,
      message: (p, f) =>
        `According to the source, males of this species fight each other; if more than one of the ${f.number(num(p, "count"))} recorded ${plural(num(p, "count"), "individual", "individuals")} is male, separate them.${sourceNote(p)}`,
    },
    conspecificAll: {
      title: (p) => `${str(p, "name")}: should be kept alone`,
      message: (p) => `According to the source, this species is aggressive toward its own kind and should usually be kept alone.${sourceNote(p)}`,
    },
    shrimpEaten: {
      title: fixed("Shrimp may be eaten"),
      message: (p) =>
        `According to the sources, ${nameList(list(p, "eaters"))} ${plural(list(p, "eaters").length, "eats", "eat")} shrimp; ${nameList(list(p, "shrimp"))} and especially their young are at risk. Source: ${list(p, "sources").join(", ")}.`,
    },
    snailEaten: {
      title: fixed("Snails may be eaten"),
      message: (p) => {
        const conditions = list(p, "noteConditions");
        const notes = list(p, "noteNames").map((name, index) => (conditions[index] ? ` ${name}: ${sentence(conditions[index])}` : "")).join("");
        return `According to the sources, ${nameList(list(p, "eaters"))} ${plural(list(p, "eaters").length, "eats", "eat")} snails; ${nameList(list(p, "snails"))} may be at risk.${notes} Source: ${list(p, "sources").join(", ")}.`;
      },
    },
    shrimpUnverified: {
      title: fixed("Shrimp compatibility not confirmed"),
      message: (p) =>
        `No "safe with shrimp" information was found in the sources for ${nameList(list(p, "fish"))}. OATA recommends not keeping shrimp with fish that can fit them in their mouths; the young of ${nameList(list(p, "shrimp"))} and freshly molted shrimp are especially at risk.`,
    },
    husbandryCaution: {
      title: (p) => `${str(p, "name")}: special care needs`,
      message: catalogNote,
    },
    tankLengthNote: {
      title: (p) => `${str(p, "name")}: limited tank length data`,
      message: catalogNote,
    },
    groupLow: {
      title: (p) => `${str(p, "name")}: group size is low`,
      message: (p, f) => `Recorded number ${f.number(num(p, "count"))}; the catalog recommends at least ${f.number(num(p, "min"))}.`,
    },
    spaceLimited: {
      title: (p) => `${str(p, "name")}: space is borderline`,
      message: spaceReference,
    },
    spaceSevere: {
      title: (p) => `${str(p, "name")}: aquarium too small`,
      message: (p, f) =>
        `${spaceReference(p, f)} The aquarium is also below the AquaMind limit adapted from the size rule of the Swiss Animal Welfare Ordinance (length 3×, width 2×, water depth 1× body length). The ordinance uses body length without the tail fin; AquaMind is stricter and uses the catalog's adult size of ${f.length(num(p, "size"))} (total length for most species): length at least ${f.length(num(p, "minLength"))}, width at least ${f.length(num(p, "minWidth"))}, water depth at least ${f.length(num(p, "minDepth"))}.`,
    },
  },
};
