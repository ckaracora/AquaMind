// Herkese açık tür sayfalarının İngilizce metinleri (Amerikan İngilizcesi). Türkçe dosyayla (`tr-public-pages.ts`) aynı biçimdedir.
import type { PublicPageMessages } from "./tr-public-pages";

export const enPublicPages: PublicPageMessages = {
  indexTitle: "Freshwater species guide",
  indexDescription: "Sourced care facts for common freshwater fish, shrimp and snails: minimum tank size, group size, temperature and pH.",
  indexIntro: "The values on each page come from the catalog; the sources are listed at the bottom of the page.",
  speciesCount: (count) => `${count} species`,
  speciesTitle: (name) => `${name} care: tank size, temperature and pH`,
  speciesDescription: ({ name, scientificName, volume, temperature, ph, group }) =>
    `${name} (${scientificName}): a tank of at least ${volume}${group ? `, a group of at least ${group}` : ""}, ${temperature}${ph ? `, pH ${ph}` : ""}. Sourced behavior and care facts.`,
  eyebrow: "Species guide",
  allSpecies: "All species",
  languages: "Language",
  catalogNote: "Values the source does not publish are not shown.",
  tryTitle: "Try it in your own aquarium",
  tryText: "Add this species to your aquarium; the app checks the volume, the other livestock, the equipment and the water together.",
  tryButton: "Try it in your aquarium",
  sourcesIntro: "Compiled from these sources:",
  disclaimer: "Hobby guidance, not veterinary advice.",
  openApp: "Open the app",
};
