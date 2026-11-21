// Herkese açık tür sayfalarının İspanyolca metinleri (Latin Amerika ortak İspanyolcası). Türkçe dosyayla (`tr-public-pages.ts`) aynı biçimdedir.
import type { PublicPageMessages } from "./tr-public-pages";

export const esPublicPages: PublicPageMessages = {
  indexTitle: "Guía de especies de agua dulce",
  indexDescription: "Datos de cuidado con fuentes para peces, camarones y caracoles comunes de agua dulce: volumen mínimo del acuario, grupo, temperatura y pH.",
  indexIntro: "Los valores de cada página vienen del catálogo; las fuentes aparecen al final de la página.",
  speciesCount: (count) => `${count} ${count === 1 ? "especie" : "especies"}`,
  speciesTitle: (name) => `${name}: cuidados, tamaño del acuario, temperatura y pH`,
  speciesDescription: ({ name, scientificName, volume, temperature, ph, group }) =>
    `${name} (${scientificName}): un acuario de al menos ${volume}${group ? `, un grupo de al menos ${group}` : ""}, ${temperature}${ph ? `, pH ${ph}` : ""}. Comportamiento y cuidados con fuentes.`,
  eyebrow: "Guía de especies",
  allSpecies: "Todas las especies",
  languages: "Idioma",
  catalogNote: "No se muestran los valores que la fuente no publica.",
  tryTitle: "Pruébalo en tu acuario",
  tryText: "Agrega esta especie a tu acuario; la app revisa juntos el volumen, los demás animales, el equipo y el agua.",
  tryButton: "Pruébalo en tu acuario",
  sourcesIntro: "Datos reunidos de estas fuentes:",
  disclaimer: "Orientación para aficionados; no es consejo veterinario.",
  openApp: "Abrir la app",
};
