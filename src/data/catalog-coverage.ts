import { careProductCatalog } from "./care-product-catalog";
import { equipmentCatalog } from "./catalog";

const requiredBrands = [
  "ADA", "Aquael", "Aquamins", "Aquapro", "Aquawing", "Armatürk", "Boyu",
  "Chihiros", "CO2Art", "Creaqua", "Dennerle", "Dophin", "Eheim", "Ejet",
  "Eurostar", "Ferplast", "Fluval", "Haqos", "ISTA", "JBL", "Jeneca",
  "Jingye", "Lifetech", "Liya", "MasterLine", "Meç", "Mufan", "Netlea",
  "Nubios", "Oase", "OrionLED", "Regent", "Resun", "RS Electrical",
  "Seachem", "Sera", "Shark", "Shrimps Forever", "Sobo", "SunSun",
  "Tetra", "The 2Hr Aquarist", "Tropica", "Tropical", "Twinstar", "WaterBear",
  "Xinyou", "XLPro", "Yikeda",
] as const;

const normalizeBrand = (value:string) => value
  .normalize("NFKD")
  .replace(/[ıİ]/g,"i")
  .replace(/[şŞ]/g,"s")
  .replace(/[ğĞ]/g,"g")
  .replace(/[üÜ]/g,"u")
  .replace(/[öÖ]/g,"o")
  .replace(/[çÇ]/g,"c")
  .toLowerCase()
  .replace(/[^a-z0-9]+/g,"");

const combinedCatalog = [...equipmentCatalog, ...careProductCatalog];
const availableBrands = new Set(combinedCatalog.map(item=>normalizeBrand(item.brand)));
const missingBrands = requiredBrands.filter(brand=>!availableBrands.has(normalizeBrand(brand)));

if (missingBrands.length) {
  throw new Error(`Zorunlu katalog markaları eksik: ${missingBrands.join(", ")}`);
}

export const catalogBrandCoverage = requiredBrands.map(brand=>({
  brand,
  equipmentCount:equipmentCatalog.filter(item=>normalizeBrand(item.brand)===normalizeBrand(brand)).length,
  careProductCount:careProductCatalog.filter(item=>normalizeBrand(item.brand)===normalizeBrand(brand)).length,
}));
