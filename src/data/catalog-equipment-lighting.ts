import type { EquipmentProfile } from "./catalog";

const VERIFIED_AT = "2026-08-17";
const chihirosSlimSource = "https://chihiros.eu/chihiros-wrgb-ii-slim";
const twinstarSLineSource = "https://twinstareu.com/twinstar-light/s-line-iv/";
const twinstarELineSource = "https://www.profiplants.cz/ke-stazeni/manual/katalog-twinstar-iv";
const twinstarBLineSource = "https://europeanaquaristics.com/wp-content/uploads/B-LINE_EN.pdf";
const creaquaSource = "https://www.creaqua.com.tr/en/3-aquarium-lightings";
const creaquaCatalogSource = "https://www.aquackakvaryum.com.tr/creaqua";
const orionAquaslimSource = "https://orionled.com.tr/urun/aquaslim-serisi-4-renk-akvaryum-led-aydinlatma/";
const orionDrgbwSource = "https://orionled.com.tr/urun/orionled-d-rgbw-black-wi-fi-telefon-app-kontrollu/";
const orionESeriesSource = "https://orionled.com.tr/urun/orionled-e-serisi-5-sira-led-aydinlatma/";

const orionAquaslimCatalog:EquipmentProfile[] = Array.from({length:14},(_,index)=>{
  const lengthCm=(index+2)*10;
  const powerW=lengthCm/5;
  return {id:`orionled-aquaslim-${lengthCm}`,category:"lighting",brand:"OrionLED",model:`Aquaslim ${lengthCm}`,specifications:`Dört renk karışımlı kapalı kasa LED · ${powerW} W · ${lengthCm} cm`,powerW,recommendedTankLengthCm:[lengthCm,lengthCm],sourceUrl:orionAquaslimSource,verifiedAt:VERIFIED_AT};
});

const orionDrgbwCatalog:EquipmentProfile[] = [
  [35,37,3800,35,50],[45,60,6100,45,60],[60,78,7850,60,80],[75,90,8800,75,100],
  [90,110,10300,90,110],[100,125,11700,100,120],[120,145,13500,120,140],
].map(([model,powerW,lumen,minLength,maxLength])=>({id:`orionled-d-rgbw-${model}`,category:"lighting",brand:"OrionLED",model:`D-RGBW ${model} Black`,specifications:`Wi-Fi kontrollü RGBW LED · ${powerW} W · ${lumen} lm · ${minLength}–${maxLength} cm`,powerW,recommendedTankLengthCm:[minLength,maxLength] as [number,number],sourceUrl:orionDrgbwSource,verifiedAt:VERIFIED_AT}));

const orionESeriesCatalog:EquipmentProfile[] = [
  [20,25,30],[30,35,40],[40,45,50],[50,55,60],[60,65,70],[70,75,80],[80,85,90],
  [90,95,100],[100,110,115],[110,120,125],[120,130,135],[130,140,145],[140,150,155],[150,160,165],
].map(([model,minLength,maxLength])=>({id:`orionled-e-${model}`,category:"lighting",brand:"OrionLED",model:`Plant E ${model}`,specifications:`Beş sıralı tam spektrum LED · ${model} cm gövde · ${minLength}–${maxLength} cm akvaryum`,recommendedTankLengthCm:[minLength,maxLength] as [number,number],sourceUrl:orionESeriesSource,verifiedAt:VERIFIED_AT}));

const chihirosCurrentSeries:EquipmentProfile[] = [
  ...["301","401","801","901"].map(model=>({id:`chihiros-a-ii-${model}`,category:"lighting" as const,brand:"Chihiros",model:`A II ${model}`,specifications:"Uygulama kontrollü beyaz LED",sourceUrl:"https://www.chihirosaquaticstudio.com/products/chihiros-a-ii-led-light",verifiedAt:VERIFIED_AT})),
  ...["20","30","45","80","90","120"].map(model=>({id:`chihiros-b-${model}`,category:"lighting" as const,brand:"Chihiros",model:`B ${model}`,specifications:"Beyaz ve RGB LED · Commander 1 ile uygulama kontrolü",sourceUrl:"https://www.chihirosaquaticstudio.com/products/chihiros-b-series-led-light",verifiedAt:VERIFIED_AT})),
  ...["30","45","60","120"].map(model=>({id:`chihiros-wrgb-ii-${model}`,category:"lighting" as const,brand:"Chihiros",model:`WRGB II ${model}`,specifications:"Üçü bir arada RGB LED · uygulama kontrollü",sourceUrl:"https://www.chihirosaquaticstudio.com/products/chihiros-wrgb-ii-led-light",verifiedAt:VERIFIED_AT})),
  ...["30","45","60","90","120"].map(model=>({id:`chihiros-wrgb-ii-10th-${model}`,category:"lighting" as const,brand:"Chihiros",model:`WRGB II ${model} 10th Edition`,specifications:"Üçü bir arada RGB LED · 10. yıl sürümü · uygulama kontrollü",sourceUrl:"https://www.chihirosaquaticstudio.com/products/chihiros-wrgb-ii-10th-edition-led-light",verifiedAt:VERIFIED_AT})),
  ...["30","45","80","90"].map(model=>({id:`chihiros-wrgb-ii-pro-${model}`,category:"lighting" as const,brand:"Chihiros",model:`WRGB II Pro ${model}`,specifications:"Dördü bir arada WRGB LED · uygulama kontrollü",sourceUrl:"https://www.chihirosaquaticstudio.com/products/chihiros-wrgb-ii-pro-led-light",verifiedAt:VERIFIED_AT})),
  {id:"chihiros-c-ii",category:"lighting",brand:"Chihiros",model:"C II",specifications:"Nano akvaryumlar için beyaz LED · uygulama kontrollü",sourceUrl:"https://www.chihirosaquaticstudio.com/products/chihiros-c-ii-led-light",verifiedAt:VERIFIED_AT},
  {id:"chihiros-c-ii-rgb",category:"lighting",brand:"Chihiros",model:"C II RGB",specifications:"Nano akvaryumlar için RGB LED · uygulama kontrollü",sourceUrl:"https://www.chihirosaquaticstudio.com/collections/chihiros-c-ii-rgb-led-lighting-system",verifiedAt:VERIFIED_AT},
  {id:"chihiros-rgb-vivid-ii-mini",category:"lighting",brand:"Chihiros",model:"RGB VIVID II Mini",specifications:"RGBW LED · yeni sürüm · askılı montaj",sourceUrl:"https://www.chihirosaquaticstudio.com/products/chihiros-rgb-vivid-ii-mini-led-light",verifiedAt:VERIFIED_AT},
  {id:"chihiros-rgb-vivid-ii-10th",category:"lighting",brand:"Chihiros",model:"RGB VIVID II 10th Edition",specifications:"Üçü bir arada RGB LED · fanlı · IP43 · uygulama kontrollü",sourceUrl:"https://www.chihirosaquaticstudio.com/products/chihiros-rgb-vivid-ii-10th-edition-led-light",verifiedAt:VERIFIED_AT},
  {id:"chihiros-rgb-vivid-2-mate",category:"lighting",brand:"Chihiros",model:"RGB VIVID 2 Mate",specifications:"60–90 cm akvaryumlar için RGB LED · uygulama kontrollü",recommendedTankLengthCm:[60,90],sourceUrl:"https://www.chihirosaquaticstudio.com/",verifiedAt:VERIFIED_AT},
  {id:"chihiros-wrgb-vivid-3",category:"lighting",brand:"Chihiros",model:"WRGB VIVID 3",specifications:"Üst seviye WRGB LED · uygulama kontrollü",sourceUrl:"https://www.chihirosaquaticstudio.com/",verifiedAt:VERIFIED_AT},
];

export const lightingCatalog: EquipmentProfile[] = [
  ...orionAquaslimCatalog,
  ...orionDrgbwCatalog,
  ...orionESeriesCatalog,
  ...chihirosCurrentSeries,
  { id:"chihiros-wrgb2-slim-30", category:"lighting", brand:"Chihiros", model:"WRGB II Slim 30", specifications:"RGB LED · 23 W · 1200 lm", powerW:23, recommendedTankLengthCm:[30,45], sourceUrl:chihirosSlimSource, verifiedAt:VERIFIED_AT },
  { id:"chihiros-wrgb2-slim-45", category:"lighting", brand:"Chihiros", model:"WRGB II Slim 45", specifications:"RGB LED · 35 W · 1800 lm", powerW:35, recommendedTankLengthCm:[45,60], sourceUrl:chihirosSlimSource, verifiedAt:VERIFIED_AT },
  { id:"chihiros-wrgb2-slim-60", category:"lighting", brand:"Chihiros", model:"WRGB II Slim 60", specifications:"RGB LED · 45 W · 2400 lm", powerW:45, recommendedTankLengthCm:[60,80], sourceUrl:chihirosSlimSource, verifiedAt:VERIFIED_AT },
  { id:"chihiros-wrgb2-slim-90", category:"lighting", brand:"Chihiros", model:"WRGB II Slim 90", specifications:"RGB LED · 69 W · 3600 lm", powerW:69, recommendedTankLengthCm:[90,110], sourceUrl:chihirosSlimSource, verifiedAt:VERIFIED_AT },
  { id:"chihiros-wrgb2-slim-120", category:"lighting", brand:"Chihiros", model:"WRGB II Slim 120", specifications:"RGB LED · 90 W · 4800 lm", powerW:90, recommendedTankLengthCm:[120,140], sourceUrl:chihirosSlimSource, verifiedAt:VERIFIED_AT },

  { id:"twinstar-e4-200ea", category:"lighting", brand:"Twinstar", model:"E-Line IV 200EA", specifications:"Full spectrum LED · 17 W · 850 lm", powerW:17, recommendedTankLengthCm:[20,20], sourceUrl:twinstarELineSource, verifiedAt:VERIFIED_AT },
  { id:"twinstar-e4-300ea", category:"lighting", brand:"Twinstar", model:"E-Line IV 300EA", specifications:"Full spectrum LED · 21 W · 1050 lm", powerW:21, recommendedTankLengthCm:[30,30], sourceUrl:twinstarELineSource, verifiedAt:VERIFIED_AT },
  { id:"twinstar-e4-450ea", category:"lighting", brand:"Twinstar", model:"E-Line IV 450EA", specifications:"Full spectrum LED · 30 W · 1500 lm", powerW:30, recommendedTankLengthCm:[45,45], sourceUrl:twinstarELineSource, verifiedAt:VERIFIED_AT },
  { id:"twinstar-e4-600ea", category:"lighting", brand:"Twinstar", model:"E-Line IV 600EA", specifications:"Full spectrum LED · 40 W · 2100 lm", powerW:40, recommendedTankLengthCm:[60,60], sourceUrl:twinstarELineSource, verifiedAt:VERIFIED_AT },
  { id:"twinstar-e4-900ea", category:"lighting", brand:"Twinstar", model:"E-Line IV 900EA", specifications:"Full spectrum LED · 52 W · 2600 lm", powerW:52, recommendedTankLengthCm:[90,90], sourceUrl:twinstarELineSource, verifiedAt:VERIFIED_AT },
  { id:"twinstar-e4-1200ea", category:"lighting", brand:"Twinstar", model:"E-Line IV 1200EA", specifications:"Full spectrum LED · 61 W · 3050 lm", powerW:61, recommendedTankLengthCm:[120,120], sourceUrl:twinstarELineSource, verifiedAt:VERIFIED_AT },
  { id:"twinstar-e4-450ec", category:"lighting", brand:"Twinstar", model:"E-Line IV 450EC", specifications:"Full spectrum LED · 37 W · 1850 lm", powerW:37, recommendedTankLengthCm:[45,45], sourceUrl:twinstarELineSource, verifiedAt:VERIFIED_AT },
  { id:"twinstar-e4-600ec", category:"lighting", brand:"Twinstar", model:"E-Line IV 600EC", specifications:"Full spectrum LED · 48 W · 2400 lm", powerW:48, recommendedTankLengthCm:[60,60], sourceUrl:twinstarELineSource, verifiedAt:VERIFIED_AT },
  { id:"twinstar-b4-30b", category:"lighting", brand:"Twinstar", model:"B-Line IV 30B", specifications:"Beyaz LED · 9 W · 679 lm", powerW:9, recommendedTankLengthCm:[30,40], sourceUrl:twinstarBLineSource, verifiedAt:VERIFIED_AT },
  { id:"twinstar-b4-45b", category:"lighting", brand:"Twinstar", model:"B-Line IV 45B", specifications:"Beyaz LED · 16 W · 1217 lm", powerW:16, recommendedTankLengthCm:[45,55], sourceUrl:twinstarBLineSource, verifiedAt:VERIFIED_AT },
  { id:"twinstar-b4-60b", category:"lighting", brand:"Twinstar", model:"B-Line IV 60B", specifications:"Beyaz LED · 22 W · 1741 lm", powerW:22, recommendedTankLengthCm:[60,75], sourceUrl:twinstarBLineSource, verifiedAt:VERIFIED_AT },
  { id:"twinstar-b4-90b", category:"lighting", brand:"Twinstar", model:"B-Line IV 90B", specifications:"Beyaz LED · 33 W · 2528 lm", powerW:33, recommendedTankLengthCm:[90,110], sourceUrl:twinstarBLineSource, verifiedAt:VERIFIED_AT },
  { id:"twinstar-b4-120b", category:"lighting", brand:"Twinstar", model:"B-Line IV 120B", specifications:"Beyaz LED · 42 W · 3166 lm", powerW:42, recommendedTankLengthCm:[120,130], sourceUrl:twinstarBLineSource, verifiedAt:VERIFIED_AT },
  { id:"twinstar-s4-200s", category:"lighting", brand:"Twinstar", model:"S-Line IV 200S", specifications:"Altı renkli tam spektrum LED · 19 W · 1100 lm", powerW:19, recommendedTankLengthCm:[20,25], sourceUrl:twinstarSLineSource, verifiedAt:VERIFIED_AT },
  { id:"twinstar-s4-300s", category:"lighting", brand:"Twinstar", model:"S-Line IV 300S", specifications:"Altı renkli tam spektrum LED · 29 W · 1750 lm", powerW:29, recommendedTankLengthCm:[30,40], sourceUrl:twinstarSLineSource, verifiedAt:VERIFIED_AT },
  { id:"twinstar-s4-450s", category:"lighting", brand:"Twinstar", model:"S-Line IV 450S", specifications:"Altı renkli tam spektrum LED · 42 W · 2530 lm", powerW:42, recommendedTankLengthCm:[45,60], sourceUrl:twinstarSLineSource, verifiedAt:VERIFIED_AT },
  { id:"twinstar-s4-600s", category:"lighting", brand:"Twinstar", model:"S-Line IV 600S", specifications:"Altı renkli tam spektrum LED · 59 W · 3620 lm", powerW:59, recommendedTankLengthCm:[60,80], sourceUrl:twinstarSLineSource, verifiedAt:VERIFIED_AT },

  { id:"creaqua-delta-pw-11", category:"lighting", brand:"Creaqua", model:"Delta PW 11 W", specifications:"Bitkili akvaryum LED · 11 W", powerW:11, recommendedTankLengthCm:[35,55], sourceUrl:creaquaCatalogSource, verifiedAt:VERIFIED_AT },
  { id:"creaqua-delta-pw-22", category:"lighting", brand:"Creaqua", model:"Delta PW 22 W", specifications:"Bitkili akvaryum LED · 22 W", powerW:22, recommendedTankLengthCm:[60,85], sourceUrl:creaquaCatalogSource, verifiedAt:VERIFIED_AT },
  { id:"creaqua-delta-pw-33", category:"lighting", brand:"Creaqua", model:"Delta PW 33 W", specifications:"Bitkili akvaryum LED · 33 W", powerW:33, recommendedTankLengthCm:[90,120], sourceUrl:creaquaCatalogSource, verifiedAt:VERIFIED_AT },
  { id:"creaqua-delta-pw-44", category:"lighting", brand:"Creaqua", model:"Delta PW 44 W", specifications:"Bitkili akvaryum LED · 44 W", powerW:44, recommendedTankLengthCm:[120,150], sourceUrl:creaquaCatalogSource, verifiedAt:VERIFIED_AT },
  { id:"creaqua-sigma-pw-7", category:"lighting", brand:"Creaqua", model:"Sigma PW 7 W", specifications:"Bitkili akvaryum LED · 7 W", powerW:7, recommendedTankLengthCm:[40,55], sourceUrl:creaquaCatalogSource, verifiedAt:VERIFIED_AT },
  { id:"creaqua-sigma-pw-11", category:"lighting", brand:"Creaqua", model:"Sigma PW 11 W", specifications:"Bitkili akvaryum LED · 11 W", powerW:11, recommendedTankLengthCm:[60,85], sourceUrl:creaquaCatalogSource, verifiedAt:VERIFIED_AT },
  { id:"creaqua-sigma-pw-22", category:"lighting", brand:"Creaqua", model:"Sigma PW 22 W", specifications:"Bitkili akvaryum LED · 22 W", powerW:22, recommendedTankLengthCm:[120,150], sourceUrl:creaquaCatalogSource, verifiedAt:VERIFIED_AT },
  { id:"creaqua-sigma-pw-5", category:"lighting", brand:"Creaqua", model:"Sigma PW 5 W", specifications:"Bitkili akvaryum LED · 5 W", powerW:5, recommendedTankLengthCm:[35,55], sourceUrl:"https://www.aquackakvaryum.com.tr/sigma-line-pw-serisi", verifiedAt:"2026-08-18" },
  { id:"creaqua-sigma-pw-16", category:"lighting", brand:"Creaqua", model:"Sigma PW 16 W", specifications:"Bitkili akvaryum LED · 16 W", powerW:16, recommendedTankLengthCm:[90,120], sourceUrl:"https://www.aquackakvaryum.com.tr/sigma-line-pw-serisi", verifiedAt:"2026-08-18" },
  ...[["60",60,85],["90",90,115],["120",120,140],["150",150,175]].map(([model,minLength,maxLength])=>({id:`creaqua-alpha-pw-${model}`,category:"lighting" as const,brand:"Creaqua",model:`Alpha PW ${model}`,specifications:`Premium White askılı akvaryum LED aydınlatması · ${minLength}–${maxLength} cm`,recommendedTankLengthCm:[Number(minLength),Number(maxLength)] as [number,number],sourceUrl:"https://www.aquackakvaryum.com.tr/alpha-line-pw-serisi",verifiedAt:"2026-08-18"})),
  ...[["60",60,85],["90",90,115],["120",120,150],["150",150,175]].map(([model,minLength,maxLength])=>({id:`creaqua-alpha-rgbw-${model}`,category:"lighting" as const,brand:"Creaqua",model:`Alpha RGBW ${model}`,specifications:`RGBW askılı akvaryum LED aydınlatması · ${minLength}–${maxLength} cm`,recommendedTankLengthCm:[Number(minLength),Number(maxLength)] as [number,number],sourceUrl:"https://www.aquackakvaryum.com.tr/creaqua",verifiedAt:"2026-08-18"})),
  { id:"creaqua-nano-elite-15", category:"lighting", brand:"Creaqua", model:"Nano Elite 15 W", specifications:"Nano akvaryum LED · 15 W", powerW:15, sourceUrl:creaquaCatalogSource, verifiedAt:VERIFIED_AT },
  { id:"creaqua-nano-s-8", category:"lighting", brand:"Creaqua", model:"Nano S 8 W", specifications:"Nano akvaryum LED · 8 W", powerW:8, sourceUrl:creaquaCatalogSource, verifiedAt:VERIFIED_AT },
  { id:"creaqua-firefly-v3-60", category:"lighting", brand:"Creaqua", model:"Firefly V3 60 cm", specifications:"Bitkili akvaryum LED", recommendedTankLengthCm:[60,60], sourceUrl:creaquaSource, verifiedAt:VERIFIED_AT },
  { id:"creaqua-firefly-v3-90", category:"lighting", brand:"Creaqua", model:"Firefly V3 90 cm", specifications:"Bitkili akvaryum LED", recommendedTankLengthCm:[90,90], sourceUrl:creaquaSource, verifiedAt:VERIFIED_AT },
  { id:"creaqua-firefly-v3-100", category:"lighting", brand:"Creaqua", model:"Firefly V3 100 cm", specifications:"Bitkili akvaryum LED", recommendedTankLengthCm:[100,100], sourceUrl:creaquaSource, verifiedAt:VERIFIED_AT },

  {id:"shark-fs-23-3row",category:"lighting",brand:"Shark",model:"Full Spectrum 23 cm / 3 Sıra",specifications:"Dört renk full-spectrum, üç sıra Osram LED · 990 lm · 30–35 cm akvaryum",recommendedTankLengthCm:[30,35],sourceUrl:"https://www.trendyol.com/akvaryum-aydinlatmasi-x-c103565?pi=12",verifiedAt:"2026-08-18"},
  {id:"shark-fs-53-3row",category:"lighting",brand:"Shark",model:"Full Spectrum 53 cm / 3 Sıra",specifications:"Dört renk full-spectrum, üç sıra Osram LED · 2475 lm · 60–65 cm akvaryum",recommendedTankLengthCm:[60,65],sourceUrl:"https://www.trendyol.com/akvaryum-aydinlatmasi-x-c103565?pi=12",verifiedAt:"2026-08-18"},
  {id:"shark-fs-63-3row",category:"lighting",brand:"Shark",model:"Full Spectrum 63 cm / 3 Sıra",specifications:"Dört renk full-spectrum, üç sıra Osram LED · 2970 lm · 70–75 cm akvaryum",recommendedTankLengthCm:[70,75],sourceUrl:"https://www.trendyol.com/akvaryum-aydinlatmasi-x-c103565?pi=12",verifiedAt:"2026-08-18"},
  {id:"shark-fs-83-2row",category:"lighting",brand:"Shark",model:"Full Spectrum 83 cm / 2 Sıra",specifications:"Dört renk full-spectrum, iki sıra Osram LED · 2640 lm · 90–95 cm akvaryum",recommendedTankLengthCm:[90,95],sourceUrl:"https://www.trendyol.com/akvaryum-aydinlatmasi-x-c103565?pi=12",verifiedAt:"2026-08-18"},
  {id:"shark-fs-95-3row",category:"lighting",brand:"Shark",model:"Full Spectrum 95 cm / 3 Sıra",specifications:"Dört renk full-spectrum, üç sıra LED · 4455 lm · 100–105 cm akvaryum",recommendedTankLengthCm:[100,105],sourceUrl:"https://indirimli.com/marka/shark/akvaryum-aydinlatmasi",verifiedAt:"2026-08-18"},
  {id:"shark-fs-105-3row",category:"lighting",brand:"Shark",model:"Full Spectrum 105 cm / 3 Sıra",specifications:"Dört renk full-spectrum, üç sıra LED · 4950 lm · 110–115 cm akvaryum",recommendedTankLengthCm:[110,115],sourceUrl:"https://indirimli.com/marka/shark/akvaryum-aydinlatmasi",verifiedAt:"2026-08-18"},

  { id:"orionled-a30", category:"lighting", brand:"OrionLED", model:"A30", specifications:"Low-tech bitkiler için LED · 35–40 cm akvaryum", recommendedTankLengthCm:[35,40], sourceUrl:"https://bettamarketim.com.tr/orionled-led-armatur-a-serisi-35-40-cm-akvaryum-icin-uygun", verifiedAt:VERIFIED_AT },
  { id:"orionled-a40", category:"lighting", brand:"OrionLED", model:"A40", specifications:"Low-tech bitkiler için LED · 12 W · 45–50 cm akvaryum", powerW:12, recommendedTankLengthCm:[45,50], sourceUrl:"https://www.bettamarketim.com.tr/orionled-led-armatur-a-serisi-45-50-cm-akvaryum-icin-uygun", verifiedAt:VERIFIED_AT },
  { id:"orionled-d60s", category:"lighting", brand:"OrionLED", model:"D-60S WRGB", specifications:"Wi-Fi kontrollü RGBW LED · 78 W · 7850 lm · 60–80 cm", powerW:78, recommendedTankLengthCm:[60,80], sourceUrl:"https://atakanpetshop.com/orionled-d-wrgb-wifi-kontrollu-led-aydinlatma-siyah-78w-60cm-d-60s", verifiedAt:VERIFIED_AT },
  { id:"orionled-extreme-b-80", category:"lighting", brand:"OrionLED", model:"Extreme B 80 cm", specifications:"Üç sıralı akvaryum LED'i · 36 W · 2970 lm · 85–90 cm", powerW:36, recommendedTankLengthCm:[85,90], sourceUrl:"https://atakanpetshop.com/orionled-extrem-b-3-sira-akvaryum-led-aydinlatma-80cm", verifiedAt:VERIFIED_AT },
  { id:"chihiros-z-light-tiny", category:"lighting", brand:"Chihiros", model:"Z Light Tiny", specifications:"Uygulama kontrollü yakınlaştırılabilir LED · 6 W · 400 lm · 2800–8000 K", powerW:6, sourceUrl:"https://atakanpetshop.com/chihiros-z-light-tiny-yakinlastirilabilir-akvaryum-aydinlatmasi-su-ici-tasarimi", verifiedAt:VERIFIED_AT },
  { id:"netlea-530s-at5", category:"lighting", brand:"Netlea", model:"530S-AT5", specifications:"Telefon kontrollü RGB LED · 35 W · 30–40 cm", powerW:35, recommendedTankLengthCm:[30,40], sourceUrl:"https://www.bettamarketim.com.tr/netlea", verifiedAt:VERIFIED_AT },
  { id:"netlea-540s-at5", category:"lighting", brand:"Netlea", model:"540S-AT5", specifications:"Telefon kontrollü WRGB LED · 35 W · 40–50 cm", powerW:35, recommendedTankLengthCm:[40,50], sourceUrl:"https://thuysinh4u.com/den-thuy-sinh-netlea-at5s-wrgb-4-in-1", verifiedAt:VERIFIED_AT },
  { id:"netlea-545s-at5", category:"lighting", brand:"Netlea", model:"545S-AT5", specifications:"Telefon kontrollü WRGB LED · 50 W · 45–65 cm", powerW:50, recommendedTankLengthCm:[45,65], sourceUrl:"https://thuysinh4u.com/den-thuy-sinh-netlea-at5s-wrgb-4-in-1", verifiedAt:VERIFIED_AT },
  { id:"netlea-560s-at5", category:"lighting", brand:"Netlea", model:"560S-AT5", specifications:"Telefon kontrollü WRGB LED · 60 W · 60–80 cm", powerW:60, recommendedTankLengthCm:[60,80], sourceUrl:"https://thuysinh4u.com/den-thuy-sinh-netlea-at5s-wrgb-4-in-1", verifiedAt:VERIFIED_AT },
  { id:"netlea-580s-at5", category:"lighting", brand:"Netlea", model:"580S-AT5", specifications:"Telefon kontrollü WRGB LED · 92 W · 80–100 cm", powerW:92, recommendedTankLengthCm:[80,100], sourceUrl:"https://thuysinh4u.com/den-thuy-sinh-netlea-at5s-wrgb-4-in-1", verifiedAt:VERIFIED_AT },
  { id:"netlea-590s-at5", category:"lighting", brand:"Netlea", model:"590S-AT5", specifications:"Telefon kontrollü WRGB LED · 95 W · 90–110 cm", powerW:95, recommendedTankLengthCm:[90,110], sourceUrl:"https://thuysinh4u.com/den-thuy-sinh-netlea-at5s-wrgb-4-in-1", verifiedAt:VERIFIED_AT },
];
