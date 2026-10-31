// Hastalık ve tedavi sayfasının İspanyolca metinleri (karar 0021, İspanyolca paketi; Latin Amerika ortak İspanyolcası). Türkçe dosyayla
// (`tr-diseases.ts`) aynı biçimdedir. Veteriner bulma yolları İspanyolca konuşulan ülkelere göredir; listesi `src/data/disease-guide.ts`
// → `vetSources`.
import type { DiseaseMessages } from "./tr-diseases";

export const esDiseases: DiseaseMessages = {
  eyebrow: "Fuentes confiables",
  description: "Primeros pasos cuando notas síntomas, qué saber antes de usar medicamentos y cómo encontrar un veterinario.",
  notice: "AquaMind no diagnostica enfermedades ni recomienda medicamentos. Esta página te dirige a fuentes confiables y a un veterinario.",
  firstStepsTitle: "Primeros pasos si notas síntomas",
  steps: {
    water: "Mide el agua de inmediato: el amoníaco debe medirse en cuanto cambie el aspecto o el comportamiento de un pez, aunque solo esté comiendo menos. En un acuario sano, el amoníaco siempre es cero.",
    signs: "Entre las señales de enfermedad están las aletas plegadas, frotarse contra la grava o la decoración, los temblores, los puntos blancos o los crecimientos algodonosos. Un pez que no muestra señales también puede portar una enfermedad.",
    quarantine: "Mantén los animales y las plantas nuevos en un acuario aparte antes de agregarlos a tu acuario principal. Para un animal enfermo, consulta a un veterinario o a un especialista en salud de peces.",
  },
  addReading: "Agregar una medición del agua",
  copperTitle: "Antes de usar medicamentos",
  copperGeneral: "Los camarones y los caracoles son muy sensibles al cobre; mueren si se exponen incluso a niveles bajos. Asegúrate de que cada medicamento que agregues al acuario sea seguro para invertebrados. Los medicamentos con cobre y formalina son letales para los camarones.",
  copperAquarium: (name, kinds) => `En ${name} hay ${kinds === "both" ? "camarones y caracoles" : kinds === "shrimp" ? "camarones" : "caracoles"}. Estos animales son muy sensibles al cobre y mueren incluso con niveles bajos; asegúrate de que el medicamento que agregues sea seguro para invertebrados.`,
  vetTitle: "Encontrar un veterinario",
  vetHelp: "Usa los directorios de abajo para encontrar un veterinario que atienda peces ornamentales. En España, puedes preguntar en el colegio veterinario de tu provincia por un veterinario que atienda peces; en otros países, pregunta en el colegio o la asociación de médicos veterinarios de tu país o región. Si no hay un veterinario de peces cerca, tu veterinario también puede contactar a la AAFV para que lo pongan en contacto con un veterinario de peces que lo oriente.",
  guidesTitle: "Guías confiables",
  sourceLabel: "Fuente",
  language: { tr: "turco", en: "inglés", es: "español" },
  languageShort: { tr: "TR", en: "EN", es: "ES" },
  opensNewTab: "se abre en una pestaña nueva",
  sponsorNote: "Si alguna vez hay contenido patrocinado, se marcará claramente como \"Patrocinado\" y no afectará las recomendaciones.",
  sources: {
    ufAmmonia: { name: "Amoníaco en sistemas acuáticos", publisher: "Universidad de Florida (UF/IFAS)" },
    oataDiseaseSigns: { name: "Cómo cuidar guppys y mollys: señales de enfermedad", publisher: "OATA" },
    ufResponsibleOwnership: { name: "Tenencia responsable de peces de acuario", publisher: "Universidad de Florida (UF/IFAS)" },
    oataInvertebrates: { name: "Cómo cuidar camarones y caracoles de agua dulce", publisher: "OATA" },
    pfkShrimpMedication: { name: "Camarones y medicamentos", publisher: "Practical Fishkeeping" },
    tvhbChambers: { name: "Colegios veterinarios provinciales", publisher: "Unión de Médicos Veterinarios de Turquía" },
    erciyesAquatic: { name: "Departamento de Enfermedades de Animales Acuáticos", publisher: "Facultad de Medicina Veterinaria de la Universidad de Erciyes" },
    fishVetSociety: { name: "Veterinarios que atienden peces ornamentales (Reino Unido e Irlanda)", publisher: "Fish Veterinary Society" },
    aafvFindVet: { name: "Encontrar un veterinario de peces (Estados Unidos y Canadá)", publisher: "American Association of Fish Veterinarians" },
    wavmaFindVet: { name: "Encontrar un veterinario de peces (todo el mundo)", publisher: "World Aquatic Veterinary Medical Association" },
    colvetColleges: { name: "Colegios veterinarios provinciales (España)", publisher: "Consejo General de Colegios Veterinarios de España" },
    ufFishHealth: { name: "Manejo de la salud y el bienestar de los peces", publisher: "Universidad de Florida (UF/IFAS)" },
    oataCareSheets: { name: "Fichas de cuidado por especie", publisher: "OATA" },
  },
};
