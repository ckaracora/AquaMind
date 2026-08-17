import type { Equipment, Livestock } from "@/types/aquarium";

export interface SpeciesProfile {
  id: string; commonName: string; scientificName: string; category: Livestock["category"];
  adultSizeCm: number; minVolumeL: number; minTankLengthCm: number; minGroup: number;
  temperature: [number, number]; ph: [number, number]; flow: "low"|"medium"|"high"; wasteFactor: number;
}

export interface EquipmentProfile {
  id: string; category: Equipment["category"]; brand: string; model: string; specifications: string;
  ratedFlowLph?: number; powerW?: number; recommendedMinL?: number; recommendedMaxL?: number; adjustableFlow?: boolean;
}

export const speciesCatalog: SpeciesProfile[] = [
  { id:"neon-tetra", commonName:"Neon tetra", scientificName:"Paracheirodon innesi", category:"fish", adultSizeCm:4, minVolumeL:50, minTankLengthCm:60, minGroup:8, temperature:[21,27], ph:[4,7.5], flow:"low", wasteFactor:.7 },
  { id:"cardinal-tetra", commonName:"Kardinal tetra", scientificName:"Paracheirodon axelrodi", category:"fish", adultSizeCm:5, minVolumeL:70, minTankLengthCm:70, minGroup:8, temperature:[24,29], ph:[3.5,7.5], flow:"low", wasteFactor:.75 },
  { id:"guppy", commonName:"Lepistes", scientificName:"Poecilia reticulata", category:"fish", adultSizeCm:5, minVolumeL:45, minTankLengthCm:50, minGroup:3, temperature:[22,28], ph:[7,8.2], flow:"medium", wasteFactor:1 },
  { id:"betta", commonName:"Beta balığı", scientificName:"Betta splendens", category:"fish", adultSizeCm:7, minVolumeL:25, minTankLengthCm:40, minGroup:1, temperature:[24,28], ph:[6,7.5], flow:"low", wasteFactor:1.1 },
  { id:"corydoras-panda", commonName:"Panda çöpçü", scientificName:"Corydoras panda", category:"fish", adultSizeCm:5, minVolumeL:60, minTankLengthCm:60, minGroup:6, temperature:[20,26], ph:[6,7.5], flow:"medium", wasteFactor:1 },
  { id:"ancistrus", commonName:"Cüce vatoz", scientificName:"Ancistrus sp.", category:"fish", adultSizeCm:13, minVolumeL:80, minTankLengthCm:80, minGroup:1, temperature:[23,28], ph:[6,7.8], flow:"medium", wasteFactor:2.2 },
  { id:"goldfish", commonName:"Japon balığı", scientificName:"Carassius auratus", category:"fish", adultSizeCm:25, minVolumeL:100, minTankLengthCm:90, minGroup:1, temperature:[18,24], ph:[6.5,8], flow:"medium", wasteFactor:3 },
  { id:"amano-shrimp", commonName:"Amano karides", scientificName:"Caridina multidentata", category:"shrimp", adultSizeCm:5, minVolumeL:25, minTankLengthCm:30, minGroup:4, temperature:[18,27], ph:[6,7.8], flow:"medium", wasteFactor:.25 },
  { id:"cherry-shrimp", commonName:"Kiraz karides", scientificName:"Neocaridina davidi", category:"shrimp", adultSizeCm:3, minVolumeL:15, minTankLengthCm:25, minGroup:6, temperature:[18,28], ph:[6.5,8], flow:"low", wasteFactor:.15 },
  { id:"nerite-snail", commonName:"Nerite salyangoz", scientificName:"Neritina natalensis", category:"snail", adultSizeCm:3, minVolumeL:20, minTankLengthCm:25, minGroup:1, temperature:[20,28], ph:[7,8.5], flow:"medium", wasteFactor:.4 },
];

export const equipmentCatalog: EquipmentProfile[] = [
  { id:"oase-biomaster-350", category:"filter", brand:"Oase", model:"BioMaster 350", specifications:"Dış filtre · 1100 L/saat · 18 W", ratedFlowLph:1100, powerW:18, recommendedMaxL:350, adjustableFlow:true },
  { id:"eheim-classic-250", category:"filter", brand:"Eheim", model:"Classic 250 (2213)", specifications:"Dış filtre · 440 L/saat · 8 W", ratedFlowLph:440, powerW:8, recommendedMaxL:250 },
  { id:"fluval-107", category:"filter", brand:"Fluval", model:"107", specifications:"Dış filtre · 550 L/saat · 10 W", ratedFlowLph:550, powerW:10, recommendedMinL:40, recommendedMaxL:130 },
  { id:"aquael-pat-mini", category:"filter", brand:"Aquael", model:"PAT Mini", specifications:"İç filtre · 400 L/saat · 4 W", ratedFlowLph:400, powerW:4, recommendedMinL:10, recommendedMaxL:120, adjustableFlow:true },
  { id:"tetra-ex-700", category:"filter", brand:"Tetra", model:"EX 700 Plus", specifications:"Dış filtre · 1040 L/saat · 13 W", ratedFlowLph:1040, powerW:13, recommendedMinL:100, recommendedMaxL:200 },
  { id:"eheim-thermo-50", category:"heater", brand:"Eheim", model:"Thermocontrol 50 W", specifications:"Ayarlı ısıtıcı · 50 W", powerW:50, recommendedMinL:25, recommendedMaxL:60 },
  { id:"eheim-thermo-100", category:"heater", brand:"Eheim", model:"Thermocontrol 100 W", specifications:"Ayarlı ısıtıcı · 100 W", powerW:100, recommendedMinL:100, recommendedMaxL:150 },
  { id:"aquael-ultra-75", category:"heater", brand:"Aquael", model:"Ultra Heater 75 W", specifications:"Elektronik ısıtıcı · 75 W", powerW:75, recommendedMinL:35, recommendedMaxL:75 },
  { id:"chihiros-wrgb2-90", category:"lighting", brand:"Chihiros", model:"WRGB II 90", specifications:"LED aydınlatma · 100 W", powerW:100, recommendedMinL:150, recommendedMaxL:250 },
];

export const speciesById = (id?: string) => speciesCatalog.find(item=>item.id===id);
export const equipmentById = (id?: string) => equipmentCatalog.find(item=>item.id===id);
const normalize = (value?: string) => value?.trim().toLocaleLowerCase("tr-TR");
export const speciesForLivestock = (item: Livestock) => speciesById(item.catalogId) ?? speciesCatalog.find(profile =>
  normalize(profile.scientificName) === normalize(item.scientificName) || normalize(profile.commonName) === normalize(item.commonName)
);
export const profileForEquipment = (item: Equipment) => equipmentById(item.catalogId) ?? equipmentCatalog.find(profile =>
  normalize(profile.brand) === normalize(item.brand) && normalize(profile.model) === normalize(item.model)
);
