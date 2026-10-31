// Hastalık ve tedavi sayfasının İngilizce metinleri (karar 0021, 5. paket). Türkçe dosyayla (`tr-diseases.ts`) aynı biçimdedir.
// Veteriner bulma yolları İngilizce konuşulan ülkelere göredir; listesi `src/data/disease-guide.ts` → `vetSources`.
import type { DiseaseMessages } from "./tr-diseases";

export const enDiseases: DiseaseMessages = {
  eyebrow: "Trusted sources",
  description: "First steps when you notice symptoms, what to know before using medication, and ways to find a vet.",
  notice: "AquaMind does not diagnose diseases or recommend medication. This page points you to trusted sources and to a vet.",
  firstStepsTitle: "First steps if you notice symptoms",
  steps: {
    water: "Test the water right away: ammonia should be tested as soon as a fish's appearance or behavior changes, even if it is only eating less. In a healthy aquarium, ammonia is always zero.",
    signs: "Signs of disease include clamped fins, flicking against gravel or decor, shimmying, white spots or cotton-like growths. A fish that shows no signs can still carry disease.",
    quarantine: "Keep new livestock and plants in a separate aquarium before adding them to your main aquarium. For a sick animal, consult a vet or a fish health specialist.",
  },
  addReading: "Add a water reading",
  copperTitle: "Before using medication",
  copperGeneral: "Shrimp and snails are very sensitive to copper; they die if exposed to even low levels. Make sure every medication you add to the aquarium is safe for invertebrates. Medications containing copper and formalin are lethal to shrimp.",
  copperAquarium: (name, kinds) => `There are ${kinds === "both" ? "shrimp and snails" : kinds === "shrimp" ? "shrimp" : "snails"} in ${name}. These animals are very sensitive to copper and die at even low levels; make sure the medication you add is safe for invertebrates.`,
  vetTitle: "Find a vet",
  vetHelp: "Use the directories below to find a vet who treats ornamental fish. If there is no fish vet near you, ask your local vet, an aquarium store or a local aquarium society; a local vet can also contact the AAFV to be put in touch with a fish vet for advice.",
  guidesTitle: "Trusted guides",
  sourceLabel: "Source",
  language: { tr: "Turkish", en: "English" },
  languageShort: { tr: "TR", en: "EN" },
  opensNewTab: "opens in a new tab",
  sponsorNote: "If there is ever sponsored content, it will be clearly marked \"Sponsored\" and will not affect recommendations.",
  sources: {
    ufAmmonia: { name: "Ammonia in aquatic systems", publisher: "University of Florida (UF/IFAS)" },
    oataDiseaseSigns: { name: "How to look after guppies and mollies: signs of disease", publisher: "OATA" },
    ufResponsibleOwnership: { name: "Responsible aquarium fish ownership", publisher: "University of Florida (UF/IFAS)" },
    oataInvertebrates: { name: "How to look after freshwater shrimp and snails", publisher: "OATA" },
    pfkShrimpMedication: { name: "Shrimp and medications", publisher: "Practical Fishkeeping" },
    tvhbChambers: { name: "Provincial veterinary chambers", publisher: "Turkish Veterinary Medical Association" },
    erciyesAquatic: { name: "Department of Aquatic Animal Diseases", publisher: "Erciyes University Faculty of Veterinary Medicine" },
    fishVetSociety: { name: "Vets who treat ornamental fish (UK and Ireland)", publisher: "Fish Veterinary Society" },
    aafvFindVet: { name: "Find a fish vet (North America)", publisher: "American Association of Fish Veterinarians" },
    wavmaFindVet: { name: "Find a fish vet (worldwide)", publisher: "World Aquatic Veterinary Medical Association" },
    ufFishHealth: { name: "Fish health management and welfare", publisher: "University of Florida (UF/IFAS)" },
    oataCareSheets: { name: "Customer care sheets by species", publisher: "OATA" },
  },
};
