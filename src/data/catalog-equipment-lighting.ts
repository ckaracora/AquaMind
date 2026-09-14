import type { EquipmentProfile } from "./catalog";

const VERIFIED_AT = "2026-08-17";
const CHIHIROS_VERIFIED_AT = "2026-09-12";
const chihirosSlimSource = "https://chihiros.eu/chihiros-wrgb-ii-slim";
const twinstarSLineSource = "https://twinstareu.com/twinstar-light/s-line-iv/";
const twinstarELineSource = "https://twinstareu.com/fr/eclairage-twinstar/e-line-iv/";
const twinstarLegacyBLineSource = "https://europeanaquaristics.com/wp-content/uploads/B-LINE_EN.pdf";
const twinstarCurrentBLineSource = "https://twinstarstore.kr/collections/entry-level-lighting";
const twinstarNanoSource = "https://twinstarstore.kr/products/twinstar-nano-aquarium-sterilizer";
const creaquaSource = "https://www.creaqua.com.tr/en/3-aquarium-lightings";
const creaquaCatalogSource = "https://www.aquackakvaryum.com.tr/creaqua";
const orionAquaslimSource = "https://orionled.com.tr/urun/aquaslim-serisi-4-renk-akvaryum-led-aydinlatma/";
const orionDrgbwSource = "https://orionled.com.tr/urun/orionled-d-rgbw-black-wi-fi-telefon-app-kontrollu/";
const orionDrgbwGraySource = "https://orionled.com.tr/urun/orionled-d-rgbw-wi-fi-telefon-app-kontrollu-yeni-d-serisi/";
const orionESeriesSource = "https://orionled.com.tr/urun/orionled-e-serisi-5-sira-led-aydinlatma/";
const ORION_VERIFIED_AT = "2026-09-14";

const orionAquaslimCatalog:EquipmentProfile[] = Array.from({length:14},(_,index)=>{
  const lengthCm=(index+2)*10;
  const powerW=lengthCm/5;
  return {id:`orionled-aquaslim-${lengthCm}`,category:"lighting",brand:"OrionLED",model:`Aquaslim ${lengthCm}`,specifications:`Dört renk karışımlı kapalı kasa LED · ${powerW} W · ${lengthCm} cm`,powerW,recommendedTankLengthCm:[lengthCm,lengthCm],sourceUrl:orionAquaslimSource,verifiedAt:VERIFIED_AT};
});

const orionDrgbwCatalog:EquipmentProfile[] = [
  [35,37,3800,35,50],[45,60,6100,45,60],[60,78,7850,60,80],[75,90,8800,75,100],
  [90,110,10300,90,110],[100,125,11700,100,120],[120,145,13500,120,140],
].map(([model,powerW,lumen,minLength,maxLength])=>({id:`orionled-d-rgbw-${model}`,category:"lighting",brand:"OrionLED",model:`D-RGBW ${model} Black`,specifications:`Wi-Fi kontrollü RGBW LED · ${powerW} W · ${lumen} lm · ${minLength}–${maxLength} cm`,powerW,recommendedTankLengthCm:[minLength,maxLength] as [number,number],sourceUrl:orionDrgbwSource,verifiedAt:VERIFIED_AT}));

const orionDrgbwGrayCatalog:EquipmentProfile[] = [
  [35,37,3800,35,50],[45,60,6100,45,60],[60,78,7850,60,80],[75,90,8800,75,100],
  [90,110,10300,90,110],[100,125,11700,100,120],[120,145,13500,120,140],
].map(([model,powerW,lumen,minLength,maxLength])=>({id:`orionled-d-rgbw-gray-${model}`,category:"lighting",brand:"OrionLED",model:`D-RGBW ${model} Grey`,specifications:`Wi-Fi kontrollü RGBW LED · ${powerW} W · ${lumen} lm · ${minLength}–${maxLength} cm`,powerW,recommendedTankLengthCm:[minLength,maxLength] as [number,number],sourceUrl:orionDrgbwGraySource,verifiedAt:ORION_VERIFIED_AT}));

const orionESeriesCatalog:EquipmentProfile[] = [
  [20,25,30],[30,35,40],[40,45,50],[50,55,60],[60,65,70],[70,75,80],[80,85,90],
  [90,95,100],[100,110,115],[110,120,125],[120,130,135],[130,140,145],[140,150,155],[150,160,165],
].map(([model,minLength,maxLength])=>({id:`orionled-e-${model}`,category:"lighting",brand:"OrionLED",model:`Plant E ${model}`,specifications:`Beş sıralı tam spektrum LED · ${model} cm gövde · ${minLength}–${maxLength} cm akvaryum`,recommendedTankLengthCm:[minLength,maxLength] as [number,number],sourceUrl:orionESeriesSource,verifiedAt:VERIFIED_AT}));

const orionGroluxACatalog:EquipmentProfile[] = [
  [17,5.8,20,25],[28.5,11,30,45],[43,16,45,60],[57,22.5,60,75],
  [72,27,75,90],[87,31.5,90,105],[100,36,105,115],[115,42,115,130],
].map(([bodyLength,powerW,minLength,maxLength])=>({id:`orionled-grolux-a-${String(bodyLength).replace(".","-")}`,category:"lighting",brand:"OrionLED",model:`Grolux A ${String(bodyLength).replace(".5",",5")} cm`,specifications:`Dimmerli Grolux LED · ${powerW} W · ${minLength}–${maxLength} cm akvaryum`,powerW,recommendedTankLengthCm:[minLength,maxLength] as [number,number],sourceUrl:"https://orionled.com.tr/urun/orionled-grolux-serisi-a-akvaryum-led-aydinlatma/",verifiedAt:ORION_VERIFIED_AT}));

const orionGroluxT8Catalog:EquipmentProfile[] = [
  ["T8-35",28.5,5.5,40,50],["T8-45",43,7.5,50,60],["T8-60",57,11,65,80],
  ["T8-80",72,15,80,90],["T8-90",87,18,90,105],
].map(([model,bodyLength,powerW,minLength,maxLength])=>({id:`orionled-grolux-${String(model).toLowerCase()}`,category:"lighting",brand:"OrionLED",model:`Grolux ${model}`,specifications:`IP67 full spektrum T8 LED · ${powerW} W · ${bodyLength} cm gövde · ${minLength}–${maxLength} cm akvaryum`,powerW:Number(powerW),recommendedTankLengthCm:[Number(minLength),Number(maxLength)] as [number,number],sourceUrl:"https://orionled.com.tr/urun/orionled-grolux-t8-serisi-akvaryum-led-aydinlatma/",verifiedAt:ORION_VERIFIED_AT}));

const orionCBlackGreyCatalog:EquipmentProfile[] = [
  [30,19,30,45],[45,27,45,60],[60,32,60,75],[75,38,75,90],
  [90,44,90,100],[100,50,100,115],[115,56,115,125],
].map(([model,powerW,minLength,maxLength])=>({id:`orionled-c-black-grey-${model}`,category:"lighting",brand:"OrionLED",model:`C ${model} Black / Grey`,specifications:`Kumandalı beş spektrumlu LED · ${powerW} W · ${minLength}–${maxLength} cm akvaryum`,powerW,recommendedTankLengthCm:[minLength,maxLength] as [number,number],sourceUrl:"https://orionled.com.tr/urun/orionled-c-serisi-black-grey/",verifiedAt:ORION_VERIFIED_AT}));

const orionDReefCatalog:EquipmentProfile[] = [
  [45,60,45,60],[90,100,90,100],[100,100,100,115],
].map(([model,powerW,minLength,maxLength])=>({id:`orionled-d-reef-${model}`,category:"lighting",brand:"OrionLED",model:`D-REEF ${model}`,specifications:`Wi-Fi ve uygulama kontrollü resif LED'i · ${powerW} W · ${minLength}–${maxLength} cm akvaryum`,powerW,recommendedTankLengthCm:[minLength,maxLength] as [number,number],sourceUrl:"https://orionled.com.tr/urun/orionled-d-reef-serisi-deniz-akvaryum-aydinlatmasi-app-kontrol-gun-simulasyon/",verifiedAt:ORION_VERIFIED_AT}));

const orionNanoCatalog:EquipmentProfile[] = [
  {id:"orionled-nano-arc",category:"lighting",brand:"OrionLED",model:"Nano Arc",specifications:"Dimmerli Grolux Ice + Fire nano LED · 24 LED · 5,5 W · 4–10 mm cam",powerW:5.5,sourceUrl:"https://orionled.com.tr/urun/orionled-nano-arc-nano-akvaryum-led-aydinlatma/",verifiedAt:ORION_VERIFIED_AT},
  {id:"orionled-nano-m1-b",category:"lighting",brand:"OrionLED",model:"Nano M1-B",specifications:"6500 K beyaz nano LED · 12 LED · 6 W · 600 lm",powerW:6,sourceUrl:"https://orionled.com.tr/urun/nano-m1-b-beyaz-6500-kelvin-nano-m1-b/",verifiedAt:ORION_VERIFIED_AT},
  {id:"orionled-nano-c-reef",category:"lighting",brand:"OrionLED",model:"Nano C Reef",specifications:"Kumandalı resif nano LED · 48 LED · 20 W · yaklaşık 2200 lm",powerW:20,sourceUrl:"https://orionled.com.tr/urun/orionled-nano-c-reef-serisi/",verifiedAt:ORION_VERIFIED_AT},
  {id:"orionled-nano-grolux",category:"lighting",brand:"OrionLED",model:"Nano Grolux",specifications:"Dimmerli Grolux nano LED · 24 V DC · 8,5 W · 4–10 mm cam",powerW:8.5,sourceUrl:"https://orionled.com.tr/urun/orionled-nano-grolux-serisi/",verifiedAt:ORION_VERIFIED_AT},
  {id:"orionled-nano-m1-k",category:"lighting",brand:"OrionLED",model:"Nano M-1 Karışık Renkli",specifications:"Dimmerli 6500 K beyaz + full spectrum nano LED · 12 LED · 6 W · yaklaşık 500 lm",powerW:6,sourceUrl:"https://orionled.com.tr/urun/orionled-nano-m1-k-karisik-renkli-nano-m1-k/",verifiedAt:ORION_VERIFIED_AT},
  {id:"orionled-nano-m2",category:"lighting",brand:"OrionLED",model:"Nano M-2",specifications:"Beyaz, kırmızı ve pembe bitkili nano LED · 14 W · 1200 lm",powerW:14,sourceUrl:"https://orionled.com.tr/urun/orionled-nano-plant-plus-akvaryum-led-aydinlatma-hightech-seri-26-w-3200-lumen-dimmer-li/",verifiedAt:ORION_VERIFIED_AT},
  {id:"orionled-nano-m3",category:"lighting",brand:"OrionLED",model:"Nano M-3",specifications:"Kumandalı beyaz, kırmızı ve pembe nano LED · 48 LED · 20 W · yaklaşık 2200 lm",powerW:20,sourceUrl:"https://orionled.com.tr/urun/nano-c-serisi-lensli/",verifiedAt:ORION_VERIFIED_AT},
];

const orionPlantACatalog:EquipmentProfile[] = [
  [20,25,30],[30,35,40],[40,45,50],[50,55,60],[60,65,70],[70,75,80],[80,85,90],
  [90,95,100],[100,110,115],[110,120,125],[120,130,135],[130,140,145],[140,150,155],[150,160,165],
].map(([model,minLength,maxLength])=>({id:"orionled-plant-a-"+model,category:"lighting",brand:"OrionLED",model:"Plant A "+model,specifications:"Dört renkli bitkili akvaryum LED'i · "+model+" cm gövde · "+minLength+"–"+maxLength+" cm akvaryum · resmî sayfada güç yayımlanmıyor",recommendedTankLengthCm:[minLength,maxLength] as [number,number],sourceUrl:"https://orionled.com.tr/urun/orionled-plant-e-serisi-4-renkli-akvaryum-aydinlatma-3-sira-led/",verifiedAt:ORION_VERIFIED_AT}));

const orionSpotCatalog:EquipmentProfile[] = ["3000K","4000K","6500K"].map(colorTemperature=>({
  id:"orionled-spot-12w-"+colorTemperature.toLowerCase(),
  category:"lighting" as const,
  brand:"OrionLED",
  model:"SPOT 24V 12W "+colorTemperature,
  specifications:"Dimmerli ve 15°–90° ayarlanabilir mercekli LED · "+colorTemperature+" · 12 W · 900 lm · 4–16 mm cam",
  powerW:12,
  sourceUrl:"https://orionled.com.tr/urun/orionled-spot-led-24-v-12-w-isik-acisi-15-90-derece-ayarlanabilir-mercekli/",
  verifiedAt:ORION_VERIFIED_AT,
}));

const orionNanoSpotCatalog:EquipmentProfile[] = ["3000K","4000K","6500K"].map(colorTemperature=>({
  id:"orionled-nano-spot-3w-"+colorTemperature.toLowerCase(),
  category:"lighting" as const,
  brand:"OrionLED",
  model:"NANO SPOT 5V 3W "+colorTemperature,
  specifications:"USB beslemeli, dimmerli ve 15°–90° ayarlanabilir mercekli nano LED · "+colorTemperature+" · 3 W · 300 lm · 4–16 mm cam",
  powerW:3,
  sourceUrl:"https://orionled.com.tr/urun/orionled-nano-spot-led-5v-3-w-isik-acisi-15-90-derece-ayarlanabilir-mercekli/",
  verifiedAt:ORION_VERIFIED_AT,
}));

const orionFanusCatalog:EquipmentProfile[] = [
  {id:"orionled-fanus-nano-gooseneck-5v",category:"lighting",brand:"OrionLED",model:"Fanus & Nano Gooseneck 5V",specifications:"USB beslemeli esnek spiral LED · 5 V · 7 W · USB adaptörü dahil değil",powerW:7,sourceUrl:"https://orionled.com.tr/urun/orionled-fanus-nano-akvaryum-led-aydinlatma-spiral-ghoosneck-5v/",verifiedAt:ORION_VERIFIED_AT},
  {id:"orionled-fanus-mini-siyah",category:"lighting",brand:"OrionLED",model:"Fanus Mini LED Siyah",specifications:"Esnek spiral, klipsli nano LED · 2 W · 2–6 mm cam",powerW:2,sourceUrl:"https://orionled.com.tr/urun/orionled-fanus-mini-led-siyah/",verifiedAt:ORION_VERIFIED_AT},
];

const orionBSeriesCatalog:EquipmentProfile[] = [
  [20,920,10,25,30],[30,1260,16,35,40],[40,1620,20,45,50],[50,1960,24,55,60],
  [60,2285,28,65,70],[70,2630,32,75,80],[80,2970,36,85,90],[90,3290,40,95,100],
].map(([model,lumen,powerW,minLength,maxLength])=>({id:"orionled-b-"+model,category:"lighting",brand:"OrionLED",model:"B-"+model,specifications:"Kumandalı bitkili akvaryum LED'i · "+powerW+" W · "+lumen+" lm · "+minLength+"–"+maxLength+" cm akvaryum",powerW,recommendedTankLengthCm:[minLength,maxLength] as [number,number],sourceUrl:"https://orionled.com.tr/urun/orionled-extrem-b-serisi/",verifiedAt:ORION_VERIFIED_AT}));

const orionCRgbwCatalog:EquipmentProfile[] = [
  [30,24,30,45],[45,34,45,60],[60,40,60,75],[75,48,75,90],
  [90,55,90,100],[100,63,100,115],[115,70,115,125],
].map(([model,powerW,minLength,maxLength])=>({id:"orionled-c-rgbw-"+model,category:"lighting",brand:"OrionLED",model:"C RGB-W "+model,specifications:"Kumandalı RGB-W bitkili akvaryum LED'i · "+powerW+" W · "+minLength+"–"+maxLength+" cm akvaryum",powerW,recommendedTankLengthCm:[minLength,maxLength] as [number,number],sourceUrl:"https://orionled.com.tr/urun/orionled-c-serisi-rgb-w-kumandali/",verifiedAt:ORION_VERIFIED_AT}));

const orionBluetoothRgbCatalog:EquipmentProfile[] = [
  [20,30,35],[30,40,45],[40,50,55],[50,60,65],[60,70,75],[70,80,85],[80,90,95],
  [90,100,105],[100,110,115],[110,120,125],[120,130,135],[130,140,145],[140,150,155],[150,160,165],
].map(([model,minLength,maxLength])=>({id:"orionled-bluetooth-rgb-"+model,category:"lighting",brand:"OrionLED",model:"Bluetooth RGB "+model,specifications:"Telefon uygulaması kontrollü üç sıra RGB LED · "+minLength+"–"+maxLength+" cm akvaryum · resmî sayfada güç yayımlanmıyor",recommendedTankLengthCm:[minLength,maxLength] as [number,number],sourceUrl:"https://orionled.com.tr/urun/bluetooth-telefon-kontrollu-rgb-akvaryum-led-aydinlatma/",verifiedAt:ORION_VERIFIED_AT}));

const orionAquaslimAccentCatalog:EquipmentProfile[] = [
  ["Grolux Fire","fire","https://orionled.com.tr/urun/aquaslim-grolux-fire/"],
  ["Grolux Ice","ice","https://orionled.com.tr/urun/aquaslim-grolux-ice/"],
].flatMap(([family,slug,sourceUrl])=>[20,30,40,50,60,70,80,90].map(lengthCm=>({
  id:"orionled-aquaslim-"+slug+"-"+lengthCm,
  category:"lighting" as const,
  brand:"OrionLED",
  model:"Aquaslim "+family+" "+lengthCm,
  specifications:family+" renk vurgulu kapalı kasa LED · "+lengthCm+" cm · resmî ürün sayfasında güç yayımlanmıyor",
  recommendedTankLengthCm:[lengthCm,lengthCm] as [number,number],
  sourceUrl,
  verifiedAt:ORION_VERIFIED_AT,
})));

const orionAquaslimRoyalBlueCatalog:EquipmentProfile[] = [
  [20,4],[30,6],[35,null],[40,8],[50,10],[60,12],[65,null],[70,14],[80,16],[90,18],[100,20],
].map(([lengthCm,powerW])=>({
  id:"orionled-aquaslim-royal-blue-"+lengthCm,
  category:"lighting" as const,
  brand:"OrionLED",
  model:"Aquaslim Royal Mavi "+lengthCm,
  specifications:"Deniz ve resif akvaryumları için royal mavi kapalı kasa LED · "+lengthCm+" cm"+(powerW === null ? " · bu varyant için güç yayımlanmıyor" : " · "+powerW+" W"),
  powerW:powerW ?? undefined,
  recommendedTankLengthCm:[lengthCm,lengthCm] as [number,number],
  sourceUrl:"https://orionled.com.tr/urun/aquaslim-serisi-royal-mavi-akvaryum-led-aydinlatma/",
  verifiedAt:ORION_VERIFIED_AT,
}));

const orionShadeMirrorCatalog:EquipmentProfile[] = [
  [35,35,45],[45,45,60],[60,60,75],[75,75,90],[90,90,100],[100,100,115],[115,null,null],
].flatMap(([model,minLength,maxLength])=>["Gri","Siyah"].map(color=>({
  id:"orionled-shade-mirror-d-"+model+"-"+(color === "Gri" ? "grey" : "black"),
  category:"lighting" as const,
  brand:"OrionLED",
  model:"Shade Mirror D-"+model+" "+color,
  specifications:"D-RGBW serisi aynalı gölgelik · "+color+(minLength === null ? " · mağaza D-115 seçeneği ile açıklamadaki D-120 tablosu çeliştiği için uyumluluk ölçüsü kullanılmıyor" : " · "+minLength+"–"+maxLength+" cm akvaryum"),
  recommendedTankLengthCm:minLength === null ? undefined : [minLength,maxLength] as [number,number],
  sourceUrl:"https://orionled.com.tr/urun/d-serisi-shade-mirror-aynali-golgelik/",
  verifiedAt:ORION_VERIFIED_AT,
})));

const chihirosCurrentSeries:EquipmentProfile[] = [
  {id:"chihiros-magnetic-light",category:"lighting",brand:"Chihiros",model:"Magnetic Light",specifications:"Beyaz ve 3'ü 1 arada RGB LED · kırmızı ve yeşil kanallar ayarlanabilir · uygulama kontrollü · USB güç bağlantısı; üretici 5 V / 3 A adaptör öneriyor",sourceUrl:"https://www.chihirosaquaticstudio.com/products/chihiros-magnetic-light-terrarium-set",verifiedAt:CHIHIROS_VERIFIED_AT},
  {id:"chihiros-magnetic-light-2",category:"lighting",brand:"Chihiros",model:"Magnetic Light 2",specifications:"Manyetik montajlı dekoratif LED aydınlatma · üretimden kaldırıldı; resmî arşiv model bazında güç veya lümen yayımlamıyor",sourceUrl:"https://www.chihirosaquaticstudio.com/products/chihiros-magnetic-light-2",verifiedAt:CHIHIROS_VERIFIED_AT},
  {id:"chihiros-eco-ping-light",category:"lighting",brand:"Chihiros",model:"ECO Ping Light",specifications:"ECO Ping setine entegre beyaz ve 3'ü 1 arada RGB LED · kırmızı ve yeşil kanallar ayarlanabilir · uygulama kontrollü · USB güç bağlantısı; üretici 5 V / 3 A adaptör öneriyor",sourceUrl:"https://www.chihirosaquaticstudio.com/products/chihiros-eco-ping",verifiedAt:CHIHIROS_VERIFIED_AT},
  ...[
    ["C201",7,750,"https://www.chihirosaquaticstudio.com/products/chihiros-c201-led-light-with-dimmer-7-w-750-lm"],
    ["C251",10,1150,"https://www.chihirosaquaticstudio.com/products/chihiros-c251-led-light-with-dimmer-10-w-1150-lm"],
    ["C301",14,1500,"https://www.chihirosaquaticstudio.com/products/chihiros-c301-led-light-with-dimmer-14-w-1500-lm"],
    ["C361",18,1850,"https://www.chihirosaquaticstudio.com/products/chihiros-c361-led-light-with-dimmer-18-w-1850-lm"],
  ].map(([model,powerW,lumen,sourceUrl])=>({id:`chihiros-${String(model).toLowerCase()}`,category:"lighting" as const,brand:"Chihiros",model:String(model),specifications:`Nano akvaryumlar için dimmerli beyaz LED · ${powerW} W · ${lumen} lm · üretimden kaldırılmış model`,powerW:Number(powerW),sourceUrl:String(sourceUrl),verifiedAt:CHIHIROS_VERIFIED_AT})),
  {id:"chihiros-nova-1",category:"lighting",brand:"Chihiros",model:"Nova 1",specifications:"Deniz ve resif akvaryumları için uygulama kontrollü LED · 126 W · 3800 lm · 61 LED · 45–60 cm akvaryum",powerW:126,recommendedTankLengthCm:[45,60],sourceUrl:"https://www.chihirosaquaticstudio.com/blogs/%E6%96%B0%E9%97%BB/beautiful-lps-under-chihiros-nova-1-%F0%9F%8C%9F",additionalSourceUrls:["https://www.chihirosaquaticstudio.com/blogs/%E6%96%B0%E9%97%BB/world-class-forum-reefbuilders-made-a-report-on-our-new-reef-light-chihiros-nova-1"],verifiedAt:CHIHIROS_VERIFIED_AT},
  ...["301","451","601","801","901","1201"].map(model=>({id:`chihiros-a-ii-max-${model}`,category:"lighting" as const,brand:"Chihiros",model:`A II Max ${model}`,specifications:"Orta ışık gereksinimli bitkiler için uygulama kontrollü beyaz LED · dahili Bluetooth kontrolcü",sourceUrl:"https://www.chihirosaquaticstudio.com/products/chihiros-a-ii-max-led-light",verifiedAt:CHIHIROS_VERIFIED_AT})),
  ...[
    ["30x30",4.7],
    ["35x30",5.6],
    ["45x30",7.5],
    ["50x35",9.9],
    ["60x36",12.8],
    ["60x45",12.8],
    ["90x45",19.6],
  ].map(([model,powerW])=>({id:`chihiros-white-background-${String(model).replace("x","-")}`,category:"lighting" as const,brand:"Chihiros",model:`White LED Background ${model} cm`,specifications:`Akvaryum arka planı için uygulama kontrollü beyaz LED · ${powerW} W · 5 mm kalınlık · en fazla 8 mm cam`,powerW:Number(powerW),sourceUrl:"https://www.chihirosaquaticstudio.com/products/chihiros-white-led-background-lightscreen",verifiedAt:CHIHIROS_VERIFIED_AT})),
  ...[
    ["351",true],
    ["361",true],
    ["451",true],
    ["501",false],
    ["1201",false],
  ].map(([model,discontinued])=>({id:`chihiros-a-ii-${model}`,category:"lighting" as const,brand:"Chihiros",model:`A II ${model}${discontinued ? " (Discontinued)" : ""}`,specifications:`Uygulama kontrollü beyaz LED${discontinued ? " · üretimden kaldırılmış model" : ""}`,sourceUrl:"https://www.chihirosaquaticstudio.com/products/chihiros-a-ii-led-light",additionalSourceUrls:["https://www.chihirosaquaticstudio.com/products/chihiros-led-beads-panel-aluminum-substrate-replacement"],verifiedAt:CHIHIROS_VERIFIED_AT})),
  ...["301","401","801","901"].map(model=>({id:`chihiros-a-ii-${model}`,category:"lighting" as const,brand:"Chihiros",model:`A II ${model}`,specifications:"Uygulama kontrollü beyaz LED",sourceUrl:"https://www.chihirosaquaticstudio.com/products/chihiros-a-ii-led-light",verifiedAt:VERIFIED_AT})),
  {id:"chihiros-b-60",category:"lighting",brand:"Chihiros",model:"B 60",specifications:"Beyaz ve RGB LED · Commander 1 ile uygulama kontrolü",sourceUrl:"https://www.chihirosaquaticstudio.com/products/chihiros-b-series-led-light",additionalSourceUrls:["https://www.chihirosaquaticstudio.com/products/chihiros-b-series-shades-with-mirror"],verifiedAt:CHIHIROS_VERIFIED_AT},
  ...[
    ["standard","Z Light Tiny Standard","Standart L klipsli sürüm · en fazla 12 mm cam · IP43"],
    ["diving","Z Light Tiny Diving","Su içinde veya yüksek nemli kapalı habitatlarda kullanıma yönelik IP67 sürüm"],
  ].map(([id,model,version])=>({id:`chihiros-z-light-tiny-${id}`,category:"lighting" as const,brand:"Chihiros",model,specifications:`${version} · 6 W · 400 lm · 2800–8000 K · 15–60° ayarlanabilir ışın açısı · uygulama kontrollü · üretimden kaldırıldı`,powerW:6,sourceUrl:"https://www.chihirosaquaticstudio.com/products/chihiros-z-light-tiny-led-light",additionalSourceUrls:["https://cdnc.heyzine.com/files/uploaded/v3/b224daf0ae7b3966a6f5bc354f24bac0f10531d4.pdf"],verifiedAt:CHIHIROS_VERIFIED_AT})),
  ...["20","30","45","80","90","120"].map(model=>({id:`chihiros-b-${model}`,category:"lighting" as const,brand:"Chihiros",model:`B ${model}`,specifications:"Beyaz ve RGB LED · Commander 1 ile uygulama kontrolü",sourceUrl:"https://www.chihirosaquaticstudio.com/products/chihiros-b-series-led-light",verifiedAt:VERIFIED_AT})),
  ...["30","45","60","120"].map(model=>({id:`chihiros-wrgb-ii-${model}`,category:"lighting" as const,brand:"Chihiros",model:`WRGB II ${model}`,specifications:"Üçü bir arada RGB LED · uygulama kontrollü",sourceUrl:"https://www.chihirosaquaticstudio.com/products/chihiros-wrgb-ii-led-light",verifiedAt:VERIFIED_AT})),
  ...["30","45","60","90","120"].map(model=>({id:`chihiros-wrgb-ii-10th-${model}`,category:"lighting" as const,brand:"Chihiros",model:`WRGB II ${model} 10th Edition`,specifications:"Üçü bir arada RGB LED · 10. yıl sürümü · uygulama kontrollü",sourceUrl:"https://www.chihirosaquaticstudio.com/products/chihiros-wrgb-ii-10th-edition-led-light",verifiedAt:VERIFIED_AT})),
  ...["30","45","60","80","90","120"].map(model=>({id:`chihiros-wrgb-ii-pro-${model}`,category:"lighting" as const,brand:"Chihiros",model:`WRGB II Pro ${model}`,specifications:"Dördü bir arada WRGB LED · uygulama kontrollü",sourceUrl:"https://www.chihirosaquaticstudio.com/products/chihiros-wrgb-ii-pro-led-light",verifiedAt:"2026-08-24"})),
  {id:"chihiros-c-ii",category:"lighting",brand:"Chihiros",model:"C II",specifications:"Nano akvaryumlar için beyaz LED · uygulama kontrollü",sourceUrl:"https://www.chihirosaquaticstudio.com/products/chihiros-c-ii-led-light",verifiedAt:VERIFIED_AT},
  {id:"chihiros-c-ii-rgb",category:"lighting",brand:"Chihiros",model:"C II RGB",specifications:"Nano akvaryumlar için RGB LED · uygulama kontrollü",sourceUrl:"https://www.chihirosaquaticstudio.com/collections/chihiros-c-ii-rgb-led-lighting-system",verifiedAt:VERIFIED_AT},
  {id:"chihiros-rgb-vivid-ii-mini",category:"lighting",brand:"Chihiros",model:"RGB VIVID II Mini",specifications:"Üçü bir arada RGB ve ek beyaz LED · 75 W · 5000 lm · Mount ve Pendant montaj seçenekleri · dahili Bluetooth ve My Chihiros uygulama kontrolü",powerW:75,sourceUrl:"https://www.chihirosaquaticstudio.com/products/chihiros-rgb-vivid-ii-mini-led-light",additionalSourceUrls:["https://www.chihirosaquaticstudio.com/products/chihiros-rgb-vivid-2-mini-led-light-black-75-w-5000-lm","https://www.chihirosaquaticstudio.com/products/chihiros-rgb-vivid-2-mini-pendant-led-light-black-75-w-5000-lm"],verifiedAt:CHIHIROS_VERIFIED_AT},
  {id:"chihiros-rgb-vivid-ii-10th",category:"lighting",brand:"Chihiros",model:"RGB VIVID II 10th Edition",specifications:"Üçü bir arada RGB LED · fanlı · IP43 · uygulama kontrollü",sourceUrl:"https://www.chihirosaquaticstudio.com/products/chihiros-rgb-vivid-ii-10th-edition-led-light",verifiedAt:VERIFIED_AT},
  {id:"chihiros-rgb-vivid-2-mate",category:"lighting",brand:"Chihiros",model:"RGB VIVID 2 Mate",specifications:"60–90 cm akvaryumlar için askılı RGB LED · 140 adet 3'ü 1 arada RGB LED · 125 W · 10.000 lm · My Chihiros uygulama kontrollü",powerW:125,recommendedTankLengthCm:[60,90],sourceUrl:"https://bbs.chihirosaquaticstudio.com/threads/chihiros-rgb-vivid-2-mate-led-light.652/",verifiedAt:"2026-08-25"},
  {id:"chihiros-wrgb-vivid-3",category:"lighting",brand:"Chihiros",model:"WRGB VIVID 3",specifications:"60–90 cm akvaryumlar için askılı WRGB LED · 160 RGB + 160 beyaz LED · 180 W · yaklaşık 16.600 lm · 520 × 240 × 23 mm · IP43 · Bluetooth/Wi-Fi uygulama kontrollü",powerW:180,recommendedTankLengthCm:[60,90],sourceUrl:"https://chihiros.eu/chihiros-vivid-3",verifiedAt:"2026-08-25"},
];

const twinstarCurrentBLine: EquipmentProfile[] = [
  ["20B",10,750,20,25,"https://twinstarstore.kr/products/twinstar-200e-ver-5-0-aquarium-led-lighting-for-20cm-8-tank-%EC%82%AC%EB%B3%B8"],
  ["30B",11,820,30,36,"https://twinstarstore.kr/products/twinstar-30b-ver-3-0-wrgb-aquarium-lighting-for-20cm-8-tank"],
  ["45B",19,1550,45,55,"https://twinstarstore.kr/products/twinstar-45b-ver-3-0-wrgb-aquarium-lighting-for-20cm-8-tank"],
  ["60B",29,2300,60,70,"https://twinstarstore.kr/products/twinstar-60b-ver-3-0-wrgb-aquarium-lighting-for-60cm-24-tank-%EC%82%AC%EB%B3%B8"],
  ["75B",39,3200,75,85,"https://twinstarstore.kr/products/twinstar-75b-ver-3-0-wrgb-aquarium-lighting-for-75cm-30-tank"],
  ["90B",46,3750,90,100,"https://twinstarstore.kr/products/twinstar-90b-ver-3-0-wrgb-aquarium-lighting-for-90cm-35-tank"],
  ["120B",52,4100,120,125,"https://twinstarstore.kr/products/twinstar-90b-ver-3-0-wrgb-aquarium-lighting-for-90cm-35-tank-%EC%82%AC%EB%B3%B8"],
].map(([model,powerW,lumen,minLength,maxLength,sourceUrl])=>({
  id:`twinstar-b-v3-${String(model).toLowerCase()}`,
  category:"lighting" as const,
  brand:"Twinstar",
  model:`B Line Ver.3 ${model}`,
  specifications:`Güncel WRGB LED · LightControl Standard dahil · ${powerW} W · ${lumen} lm · ${minLength}–${maxLength} cm`,
  powerW:Number(powerW),
  recommendedTankLengthCm:[Number(minLength),Number(maxLength)] as [number,number],
  sourceUrl:String(sourceUrl || twinstarCurrentBLineSource),
  verifiedAt:"2026-08-27",
}));

const twinstarVer5Catalog: EquipmentProfile[] = [
  {id:"twinstar-s5-200s",category:"lighting",brand:"Twinstar",model:"S Line Ver.5 200S",specifications:"Altı renk + bitki gelişim LED'i · Bluetooth LightControl · 17 W · 1000 lm · 20–25 cm",powerW:17,recommendedTankLengthCm:[20,25],sourceUrl:"https://twinstarstore.kr/products/twinstar-200s-pro-ver-5-0-high-brightness-premium-aquarium-led-light-for-20cm-8-tank-%EC%82%AC%EB%B3%B8",verifiedAt:"2026-08-27"},
  {id:"twinstar-s5-300s",category:"lighting",brand:"Twinstar",model:"S Line Ver.5 300S",specifications:"Altı renk + bitki gelişim LED'i · Bluetooth LightControl · 27 W · 1700 lm · 30–40 cm",powerW:27,recommendedTankLengthCm:[30,40],sourceUrl:"https://twinstarstore.kr/products/twinstar-300s-line-ver-5-0-high-brightness-premium-aquarium-led-light-for-30cm-12-tank",verifiedAt:"2026-08-27"},
  {id:"twinstar-s5-450s",category:"lighting",brand:"Twinstar",model:"S Line Ver.5 450S",specifications:"Altı renk + bitki gelişim LED'i · Bluetooth LightControl · 40 W · 2700 lm · 45–55 cm",powerW:40,recommendedTankLengthCm:[45,55],sourceUrl:"https://twinstarstore.kr/products/twinstar-450s-pro-ver-5-0-high-brightness-premium-aquarium-led-light-for-45cm-18-tank",verifiedAt:"2026-08-27"},
  {id:"twinstar-s5-600s",category:"lighting",brand:"Twinstar",model:"S Line Ver.5 600S",specifications:"Altı renk + bitki gelişim LED'i · Bluetooth LightControl · 67 W · 4100 lm · 60–70 cm",powerW:67,recommendedTankLengthCm:[60,70],sourceUrl:"https://twinstarstore.kr/products/twinstar-600s-line-v-high-brightness-premium-aquarium-led-light",verifiedAt:"2026-08-27"},
  {id:"twinstar-s5-900s",category:"lighting",brand:"Twinstar",model:"S Line Ver.5 900S",specifications:"Altı renk + bitki gelişim LED'i · Bluetooth LightControl · 100 W · 6200 lm · 90–100 cm",powerW:100,recommendedTankLengthCm:[90,100],sourceUrl:"https://twinstarstore.kr/products/twinstar-900s-line-ver-5-0-high-brightness-premium-aquarium-led-light-for-90cm-35-4-tank",verifiedAt:"2026-08-27"},
  {id:"twinstar-s5-1200s",category:"lighting",brand:"Twinstar",model:"S Line Ver.5 1200S",specifications:"Altı renk + bitki gelişim LED'i · Bluetooth LightControl · 100 W · 6200 lm · 120–130 cm",powerW:100,recommendedTankLengthCm:[120,130],sourceUrl:"https://twinstarstore.kr/products/twinstar-1200s-pro-v-premium-wrgb-aquarium-led-lights-for-aquascaping",verifiedAt:"2026-08-27"},
  {id:"twinstar-e5-200e",category:"lighting",brand:"Twinstar",model:"E Line Ver.5 200E",specifications:"Altı renk tam spektrum LED · Bluetooth LightControl · 13 W · 900 lm · 20–25 cm",powerW:13,recommendedTankLengthCm:[20,25],sourceUrl:"https://twinstarstore.kr/products/twinstar-200e-pro-ver-5-0-premium-aquarium-led-light-for-20cm-8-tank",verifiedAt:"2026-08-27"},
  {id:"twinstar-e5-300e",category:"lighting",brand:"Twinstar",model:"E Line Ver.5 300E",specifications:"Altı renk tam spektrum LED · Bluetooth LightControl · 19 W · 1200 lm · 30–36 cm",powerW:19,recommendedTankLengthCm:[30,36],sourceUrl:"https://twinstarstore.kr/products/twinstar-300e-pro-ver-5-0-premium-aquarium-led-light-for-30cm-12-tank-%EC%82%AC%EB%B3%B8",verifiedAt:"2026-08-27"},
  {id:"twinstar-e5-450e",category:"lighting",brand:"Twinstar",model:"E Line Ver.5 450E",specifications:"Altı renk tam spektrum LED · Bluetooth LightControl · 31 W · 2100 lm · 45–50 cm",powerW:31,recommendedTankLengthCm:[45,50],sourceUrl:"https://twinstarstore.kr/products/twinstar-450e-pro-ver-5-0-premium-aquarium-led-light-for-45cm-18-tank",verifiedAt:"2026-08-27"},
  {id:"twinstar-e5-600e",category:"lighting",brand:"Twinstar",model:"E Line Ver.5 600E",specifications:"Altı renk tam spektrum LED · Bluetooth LightControl · 49 W · 3000 lm · 60–70 cm",powerW:49,recommendedTankLengthCm:[60,70],sourceUrl:"https://twinstarstore.kr/products/twinstar-600e-pro-ver-5-0-premium-aquarium-led-light-for-60cm-24-tank",verifiedAt:"2026-08-27"},
  {id:"twinstar-e5-750e",category:"lighting",brand:"Twinstar",model:"E Line Ver.5 750E",specifications:"Altı renk tam spektrum LED · Bluetooth LightControl · 60 W · 3700 lm · resmî sayfada akvaryum uzunluğu çelişkili olduğundan otomatik aralık kullanılmıyor",powerW:60,sourceUrl:"https://twinstarstore.kr/products/twinstar-750e-pro-ver-5-0-premium-aquarium-led-light-for-75-80cm-30-32-tank",verifiedAt:"2026-08-27"},
  {id:"twinstar-e5-900e",category:"lighting",brand:"Twinstar",model:"E Line Ver.5 900E",specifications:"Altı renk tam spektrum LED · Bluetooth LightControl · 69 W · 3700 lm · 90–100 cm",powerW:69,recommendedTankLengthCm:[90,100],sourceUrl:"https://twinstarstore.kr/products/twinstar-900e-pro-ver-5-0-premium-aquarium-led-light-for-90cm-36-tank",verifiedAt:"2026-08-27"},
  {id:"twinstar-e5-1200e",category:"lighting",brand:"Twinstar",model:"E Line Ver.5 1200E",specifications:"Altı renk tam spektrum LED · Bluetooth LightControl · 79 W · 4600 lm · 120 cm önerilen akvaryum",powerW:79,recommendedTankLengthCm:[120,120],sourceUrl:"https://twinstarstore.kr/products/twinstar-1200e-pro-ver-5-0-premium-aquarium-led-light-for-120cm-48-tank",verifiedAt:"2026-08-27"},
];

const twinstarSterilizers: EquipmentProfile[] = [
  {id:"twinstar-nano",category:"other",brand:"Twinstar",model:"NANO Sterilizer",specifications:"UV kullanmayan elektroliz sterilizatörü · M5 reaktör · 30–120 L",recommendedMinL:30,recommendedMaxL:120,sourceUrl:twinstarNanoSource,verifiedAt:"2026-08-27"},
  {id:"twinstar-nano-plus",category:"other",brand:"Twinstar",model:"NANO Plus Sterilizer",specifications:"UV kullanmayan elektroliz sterilizatörü · M9 reaktör · 50–250 L",recommendedMinL:50,recommendedMaxL:250,sourceUrl:twinstarNanoSource,verifiedAt:"2026-08-27"},
];

export const lightingCatalog: EquipmentProfile[] = [
  ...orionAquaslimCatalog,
  ...orionDrgbwCatalog,
  ...orionDrgbwGrayCatalog,
  ...orionESeriesCatalog,
  ...orionGroluxACatalog,
  ...orionGroluxT8Catalog,
  ...orionCBlackGreyCatalog,
  ...orionDReefCatalog,
  ...orionNanoCatalog,
  ...orionPlantACatalog,
  ...orionSpotCatalog,
  ...orionNanoSpotCatalog,
  ...orionFanusCatalog,
  ...orionBSeriesCatalog,
  ...orionCRgbwCatalog,
  ...orionBluetoothRgbCatalog,
  ...orionAquaslimAccentCatalog,
  ...orionAquaslimRoyalBlueCatalog,
  ...orionShadeMirrorCatalog,
  ...chihirosCurrentSeries,
  { id:"chihiros-wrgb2-slim-30", category:"lighting", brand:"Chihiros", model:"WRGB II Slim 30", specifications:"RGB LED · 23 W · 1200 lm", powerW:23, recommendedTankLengthCm:[30,45], sourceUrl:chihirosSlimSource, verifiedAt:VERIFIED_AT },
  { id:"chihiros-wrgb2-slim-45", category:"lighting", brand:"Chihiros", model:"WRGB II Slim 45", specifications:"RGB LED · 35 W · 1800 lm", powerW:35, recommendedTankLengthCm:[45,60], sourceUrl:chihirosSlimSource, verifiedAt:VERIFIED_AT },
  { id:"chihiros-wrgb2-slim-60", category:"lighting", brand:"Chihiros", model:"WRGB II Slim 60", specifications:"RGB LED · 45 W · 2400 lm", powerW:45, recommendedTankLengthCm:[60,80], sourceUrl:chihirosSlimSource, verifiedAt:VERIFIED_AT },
  { id:"chihiros-wrgb2-slim-90", category:"lighting", brand:"Chihiros", model:"WRGB II Slim 90", specifications:"RGB LED · 69 W · 3600 lm", powerW:69, recommendedTankLengthCm:[90,110], sourceUrl:chihirosSlimSource, verifiedAt:VERIFIED_AT },
  { id:"chihiros-wrgb2-slim-120", category:"lighting", brand:"Chihiros", model:"WRGB II Slim 120", specifications:"RGB LED · 90 W · 4800 lm", powerW:90, recommendedTankLengthCm:[120,140], sourceUrl:chihirosSlimSource, verifiedAt:VERIFIED_AT },

  ...[["200EA",13,900,20,25],["300EA",19,1200,30,35],["450EA",31,2100,45,55],["600EA",50,3000,60,70],["750EA",60,3700,80,90],["900EA",69,4000,90,100],["1200EA",79,4600,110,120]].map(([model,powerW,lumen,minLength,maxLength])=>({id:`twinstar-e4-${String(model).toLowerCase()}`,category:"lighting" as const,brand:"Twinstar",model:`E-Line IV ${model}`,specifications:`Altı renkli bitki spektrumlu LED · ${powerW} W · ${lumen} lm · ${minLength}–${maxLength} cm`,powerW:Number(powerW),recommendedTankLengthCm:[Number(minLength),Number(maxLength)] as [number,number],sourceUrl:twinstarELineSource,verifiedAt:"2026-08-24"})),
  { id:"twinstar-e4-450ec", category:"lighting", brand:"Twinstar", model:"E-Line IV 450EC", specifications:"Altı renkli bitki spektrumlu LED · 37 W · 1850 lm · sabit 45 cm", powerW:37, recommendedTankLengthCm:[45,45], sourceUrl:twinstarELineSource, verifiedAt:"2026-08-24" },
  { id:"twinstar-e4-600ec", category:"lighting", brand:"Twinstar", model:"E-Line IV 600EC", specifications:"Altı renkli bitki spektrumlu LED · 48 W · 2400 lm · sabit 60 cm", powerW:48, recommendedTankLengthCm:[60,60], sourceUrl:twinstarELineSource, verifiedAt:"2026-08-24" },
  ...[["30B",9,679,30,40],["45B",16,1217,45,55],["60B",22,1741,60,75],["90B",33,2528,90,110],["120B",42,3166,120,130]].map(([model,powerW,lumen,minLength,maxLength])=>({id:`twinstar-b-legacy-${String(model).toLowerCase()}`,category:"lighting" as const,brand:"Twinstar",model:`B Line Legacy ${model}`,specifications:`Önceki nesil beyaz + RGB LED · ${powerW} W · ${lumen} lm · ${minLength}–${maxLength} cm`,powerW:Number(powerW),recommendedTankLengthCm:[Number(minLength),Number(maxLength)] as [number,number],sourceUrl:twinstarLegacyBLineSource,verifiedAt:"2026-08-24"})),
  ...twinstarCurrentBLine,
  { id:"twinstar-s4-200s", category:"lighting", brand:"Twinstar", model:"S-Line IV 200S", specifications:"Altı renkli tam spektrum LED · 19 W · 1100 lm", powerW:19, recommendedTankLengthCm:[20,25], sourceUrl:twinstarSLineSource, verifiedAt:VERIFIED_AT },
  { id:"twinstar-s4-300s", category:"lighting", brand:"Twinstar", model:"S-Line IV 300S", specifications:"Altı renkli tam spektrum LED · 29 W · 1750 lm", powerW:29, recommendedTankLengthCm:[30,40], sourceUrl:twinstarSLineSource, verifiedAt:VERIFIED_AT },
  { id:"twinstar-s4-450s", category:"lighting", brand:"Twinstar", model:"S-Line IV 450S", specifications:"Altı renkli tam spektrum LED · 42 W · 2530 lm", powerW:42, recommendedTankLengthCm:[45,60], sourceUrl:twinstarSLineSource, verifiedAt:VERIFIED_AT },
  { id:"twinstar-s4-600s", category:"lighting", brand:"Twinstar", model:"S-Line IV 600S", specifications:"Altı renkli tam spektrum LED · 59 W · 3620 lm", powerW:59, recommendedTankLengthCm:[60,80], sourceUrl:twinstarSLineSource, verifiedAt:VERIFIED_AT },
  ...twinstarVer5Catalog,
  ...twinstarSterilizers,

  { id:"creaqua-delta-pw-11", category:"lighting", brand:"Creaqua", model:"Delta PW 11 W", specifications:"Bitkili akvaryum LED · 11 W", powerW:11, recommendedTankLengthCm:[35,55], sourceUrl:creaquaCatalogSource, verifiedAt:VERIFIED_AT },
  { id:"creaqua-delta-pw-22", category:"lighting", brand:"Creaqua", model:"Delta PW 22 W", specifications:"Bitkili akvaryum LED · 22 W", powerW:22, recommendedTankLengthCm:[60,85], sourceUrl:creaquaCatalogSource, verifiedAt:VERIFIED_AT },
  { id:"creaqua-delta-pw-33", category:"lighting", brand:"Creaqua", model:"Delta PW 33 W", specifications:"Bitkili akvaryum LED · 33 W", powerW:33, recommendedTankLengthCm:[90,120], sourceUrl:creaquaCatalogSource, verifiedAt:VERIFIED_AT },
  { id:"creaqua-delta-pw-44", category:"lighting", brand:"Creaqua", model:"Delta PW 44 W", specifications:"Bitkili akvaryum LED · 44 W", powerW:44, recommendedTankLengthCm:[120,150], sourceUrl:creaquaCatalogSource, verifiedAt:VERIFIED_AT },
  { id:"creaqua-sigma-pw-7", category:"lighting", brand:"Creaqua", model:"Sigma PW 7 W", specifications:"Bitkili akvaryum LED · 7 W", powerW:7, recommendedTankLengthCm:[40,55], sourceUrl:creaquaCatalogSource, verifiedAt:VERIFIED_AT },
  { id:"creaqua-sigma-pw-11", category:"lighting", brand:"Creaqua", model:"Sigma PW 11 W", specifications:"Bitkili akvaryum LED · 11 W", powerW:11, recommendedTankLengthCm:[60,85], sourceUrl:creaquaCatalogSource, verifiedAt:VERIFIED_AT },
  { id:"creaqua-sigma-pw-22", category:"lighting", brand:"Creaqua", model:"Sigma PW 22 W", specifications:"Bitkili akvaryum LED · 22 W", powerW:22, recommendedTankLengthCm:[120,150], sourceUrl:creaquaCatalogSource, verifiedAt:VERIFIED_AT },
  { id:"creaqua-sigma-pw-5", category:"lighting", brand:"Creaqua", model:"Sigma PW 5,5 W", specifications:"Premium White LED · 5,5 W · 800 lm · CRI 93+ · 35–55 cm", powerW:5.5, recommendedTankLengthCm:[35,55], sourceUrl:"https://www.creaqua.com.tr/tr/akvaryum-aydinlatmalari/91-sigma-pw.html", verifiedAt:"2026-08-25" },
  { id:"creaqua-sigma-pw-16", category:"lighting", brand:"Creaqua", model:"Sigma PW 16,5 W", specifications:"Premium White LED · 16,5 W · CRI 93+ · 90–115 cm", powerW:16.5, recommendedTankLengthCm:[90,115], sourceUrl:"https://akvaryumbalikavm.com.tr/aydinlatma-sistemleri", verifiedAt:"2026-08-25" },
  ...[["60",60,85,60],["90",90,115,undefined],["120",120,140,undefined],["150",150,175,undefined]].map(([model,minLength,maxLength,powerW])=>({id:`creaqua-alpha-pw-${model}`,category:"lighting" as const,brand:"Creaqua",model:`Alpha PW ${model}`,specifications:`Premium White askılı akvaryum LED aydınlatması · ${powerW ? `${powerW} W · ` : ""}${minLength}–${maxLength} cm`,powerW:powerW === undefined ? undefined : Number(powerW),recommendedTankLengthCm:[Number(minLength),Number(maxLength)] as [number,number],sourceUrl:"https://www.creaqua.com.tr/en/aquarium-lightings/93-alpha-pw.html",verifiedAt:"2026-08-25"})),
  ...[["60",60,85,74,7452],["90",90,115,111,11178],["120",120,150,148,14904],["150",150,175,185,18630]].map(([model,minLength,maxLength,powerW,lumen])=>({id:`creaqua-alpha-rgbw-${model}`,category:"lighting" as const,brand:"Creaqua",model:`Alpha RGB+W ${model}`,specifications:`Bluetooth kontrollü dört kanallı RGB+W LED · ${powerW} W · ${lumen} lm · ${minLength}–${maxLength} cm`,powerW:Number(powerW),recommendedTankLengthCm:[Number(minLength),Number(maxLength)] as [number,number],sourceUrl:"https://www.creaqua.com.tr/en/blog/post/12/",verifiedAt:"2026-08-25"})),
  { id:"creaqua-nano-elite-15", category:"lighting", brand:"Creaqua", model:"Nano Elite Black 17 W", specifications:"V2 spektrumlu gooseneck nano LED · 17 W · 1500 lm · CRI 92+", powerW:17, sourceUrl:"https://www.creaqua.com.tr/tr/ana-sayfa/34-nano-elite-black.html", verifiedAt:"2026-08-25" },
  { id:"creaqua-nano-s-8", category:"lighting", brand:"Creaqua", model:"Nano S Black 6,5 W", specifications:"V2 spektrumlu gooseneck nano LED · 6,5 W · 800 lm · CRI 92+ · 50 cm'ye kadar", powerW:6.5, recommendedTankLengthCm:[10,50], sourceUrl:"https://www.creaqua.com.tr/tr/ana-sayfa/35-nano-s-black.html", verifiedAt:"2026-08-25" },
  { id:"creaqua-delta-marine-35", category:"lighting", brand:"Creaqua", model:"Delta Marine 35", specifications:"Yumuşak mercanlar için 400–470 nm ağırlıklı resif LED'i · 15 W · 35–55 cm", powerW:15, recommendedTankLengthCm:[35,55], sourceUrl:"https://atakanpetshop.com/creaqua-delta-marine-35-deniz-akvaryumu-led-aydinlatmasi-15w-35-55-cm-2314356", verifiedAt:"2026-08-25" },
  { id:"creaqua-delta-marine-40", category:"lighting", brand:"Creaqua", model:"Delta Marine 40", specifications:"Yumuşak mercanlar için 400–470 nm ağırlıklı resif LED'i · 15 W · 40–55 cm", powerW:15, recommendedTankLengthCm:[40,55], sourceUrl:"https://atakanpetshop.com/creaqua?page=4", verifiedAt:"2026-08-25" },
  { id:"creaqua-delta-marine-60", category:"lighting", brand:"Creaqua", model:"Delta Marine 60", specifications:"Yumuşak mercanlar için 400–470 nm ağırlıklı resif LED'i · 30 W · 60–80 cm", powerW:30, recommendedTankLengthCm:[60,80], sourceUrl:"https://atakanpetshop.com/creaqua?page=4", verifiedAt:"2026-08-25" },
  { id:"creaqua-firefly-v3-60", category:"lighting", brand:"Creaqua", model:"Firefly V3 60 cm", specifications:"Bitkili akvaryum LED", recommendedTankLengthCm:[60,60], sourceUrl:creaquaSource, verifiedAt:VERIFIED_AT },
  { id:"creaqua-firefly-v3-90", category:"lighting", brand:"Creaqua", model:"Firefly V3 90 cm", specifications:"Bitkili akvaryum LED", recommendedTankLengthCm:[90,90], sourceUrl:creaquaSource, verifiedAt:VERIFIED_AT },
  { id:"creaqua-firefly-v3-100", category:"lighting", brand:"Creaqua", model:"Firefly V3 100 cm", specifications:"Bitkili akvaryum LED", recommendedTankLengthCm:[100,100], sourceUrl:creaquaSource, verifiedAt:VERIFIED_AT },

  {id:"shark-fs-23-4row",category:"lighting",brand:"Shark",model:"Full Spectrum 23 cm / 4 Sıra",specifications:"Dört renk full-spectrum, dört sıra Osram LED · 1320 lm · 30–35 cm akvaryum",recommendedTankLengthCm:[30,35],sourceUrl:"https://www.trendyol.com/shark/23-cm-30-35-cm-uyumlu-akvaryum-armatur-4-sira-osram-marka-ledli-1320-lumen-p-383015310",verifiedAt:"2026-08-25"},
  {id:"shark-fs-33-4row",category:"lighting",brand:"Shark",model:"Full Spectrum 33 cm / 4 Sıra",specifications:"Dört renk full-spectrum, dört sıra Osram LED · 1980 lm · 40–45 cm akvaryum",recommendedTankLengthCm:[40,45],sourceUrl:"https://www.trendyol.com/shark-akvaryum-aydinlatmasi-x-b142840-c103565",verifiedAt:"2026-08-25"},
  {id:"shark-fs-43-4row",category:"lighting",brand:"Shark",model:"Full Spectrum 43 cm / 4 Sıra",specifications:"Dört renk full-spectrum, dört sıra Osram LED · 2640 lm · 50–55 cm akvaryum",recommendedTankLengthCm:[50,55],sourceUrl:"https://www.trendyol.com/shark-akvaryum-aydinlatmasi-x-b142840-c103565",verifiedAt:"2026-08-25"},
  {id:"shark-fs-63-4row",category:"lighting",brand:"Shark",model:"Full Spectrum 63 cm / 4 Sıra",specifications:"Dört renk full-spectrum, dört sıra Osram LED · 3960 lm · 70–75 cm akvaryum",recommendedTankLengthCm:[70,75],sourceUrl:"https://www.trendyol.com/shark-akvaryum-aydinlatmasi-x-b142840-c103565",verifiedAt:"2026-08-25"},
  {id:"shark-fs-83-4row",category:"lighting",brand:"Shark",model:"Full Spectrum 83 cm / 4 Sıra",specifications:"Dört renk full-spectrum, dört sıra Osram LED · 5280 lm · 90–95 cm akvaryum",recommendedTankLengthCm:[90,95],sourceUrl:"https://www.trendyol.com/shark-akvaryum-aydinlatmasi-x-b142840-c103565",verifiedAt:"2026-08-25"},
  {id:"shark-fs-93-4row",category:"lighting",brand:"Shark",model:"Full Spectrum 93 cm / 4 Sıra",specifications:"Dört renk full-spectrum, dört sıra Osram LED · 5940 lm · 100–105 cm akvaryum",recommendedTankLengthCm:[100,105],sourceUrl:"https://www.trendyol.com/shark-akvaryum-aydinlatmasi-x-b142840-c103565",verifiedAt:"2026-08-25"},
  {id:"shark-fs-23-2row",category:"lighting",brand:"Shark",model:"Full Spectrum 23 cm / 2 Sıra",specifications:"Dört renk full-spectrum, iki sıra LED · 660 lm · 30–35 cm akvaryum",recommendedTankLengthCm:[30,35],sourceUrl:"https://www.trendyol.com/shark-akvaryum-aydinlatmasi-x-b142840-c103565",verifiedAt:"2026-08-27"},
  {id:"shark-fs-33-2row",category:"lighting",brand:"Shark",model:"Full Spectrum 33 cm / 2 Sıra",specifications:"Dört renk full-spectrum, iki sıra LED · 990 lm · 40–45 cm akvaryum",recommendedTankLengthCm:[40,45],sourceUrl:"https://www.trendyol.com/shark-akvaryum-aydinlatmasi-x-b142840-c103565",verifiedAt:"2026-08-27"},
  {id:"shark-fs-53-2row",category:"lighting",brand:"Shark",model:"Full Spectrum 53 cm / 2 Sıra",specifications:"Dört renk full-spectrum, iki sıra LED · 1650 lm · 60–65 cm akvaryum",recommendedTankLengthCm:[60,65],sourceUrl:"https://www.trendyol.com/shark-akvaryum-aydinlatmasi-x-b142840-c103565",verifiedAt:"2026-08-27"},
  {id:"shark-fs-93-3row",category:"lighting",brand:"Shark",model:"Full Spectrum 93 cm / 3 Sıra",specifications:"Dört renk full-spectrum, üç sıra LED · 4455 lm · 100–105 cm akvaryum",recommendedTankLengthCm:[100,105],sourceUrl:"https://www.trendyol.com/shark/93-cm-100-105-cm-uyumlu-fullspectrum-4-renk-armatur-3-sira-ledli-4455-lumen-p-355565138",verifiedAt:"2026-08-27"},
  {id:"shark-fs-53-4row",category:"lighting",brand:"Shark",model:"Full Spectrum 53 cm / 4 Sıra",specifications:"Dört renk full-spectrum, dört sıra LED · 3300 lm · 60–65 cm akvaryum",recommendedTankLengthCm:[60,65],sourceUrl:"https://www.trendyol.com/shark/53-cm-60-65-cm-uyumlu-akvaryum-armatur-4-sira-ledli-3300-lumen-p-383015212",verifiedAt:"2026-08-27"},
  {id:"shark-fs-75-4row",category:"lighting",brand:"Shark",model:"Full Spectrum 75 cm / 4 Sıra",specifications:"Dört renk full-spectrum, dört sıra LED · 80–85 cm akvaryum · kaynak başlığında lümen değeri yayımlanmıyor",recommendedTankLengthCm:[80,85],sourceUrl:"https://www.trendyol.com/shark/75-cm-80-85-cm-uyumlu-akvaryum-led-armatur-4-sira-ledli-p-383017744",verifiedAt:"2026-08-27"},
  {id:"shark-bar-full-spectrum-100",category:"lighting",brand:"Shark",model:"Full Spectrum 4 Renk Bar LED 100 cm",specifications:"Dört renk full-spectrum bar LED · 1650 lm · 100 cm",recommendedTankLengthCm:[100,100],sourceUrl:"https://www.trendyol.com/shark/100-cm-akvaryum-aydinlatma-fullspectrum-4-renk-bar-led-1650-lumen-p-355667089",verifiedAt:"2026-08-27"},
  {id:"shark-fs-73-3row",category:"lighting",brand:"Shark",model:"Full Spectrum 73 cm / 3 Sıra",specifications:"Dört renk full-spectrum, üç sıra LED · 3465 lm · 80–85 cm akvaryum",recommendedTankLengthCm:[80,85],sourceUrl:"https://www.trendyol.com/shark-akvaryum-aydinlatmasi-x-b142840-c103565",verifiedAt:"2026-08-25"},
  {id:"shark-fs-113-3row",category:"lighting",brand:"Shark",model:"Full Spectrum 113 cm / 3 Sıra",specifications:"Dört renk full-spectrum, üç sıra LED · 5445 lm · 120–125 cm akvaryum",recommendedTankLengthCm:[120,125],sourceUrl:"https://www.trendyol.com/shark-akvaryum-aydinlatmasi-x-b142840-c103565",verifiedAt:"2026-08-25"},
  {id:"shark-bar-grolux-60",category:"lighting",brand:"Shark",model:"Grolux 3 Renk Bar LED 60 cm",specifications:"Üç renk Grolux bar LED · 990 lm · 60 cm",recommendedTankLengthCm:[60,60],sourceUrl:"https://www.trendyol.com/shark-akvaryum-aydinlatmasi-x-b142840-c103565",verifiedAt:"2026-08-25"},
  {id:"shark-bar-grolux-70",category:"lighting",brand:"Shark",model:"Grolux 3 Renk Bar LED 70 cm",specifications:"Üç renk Grolux bar LED · 1155 lm · 70 cm",recommendedTankLengthCm:[70,70],sourceUrl:"https://www.trendyol.com/shark-akvaryum-aydinlatmasi-x-b142840-c103565",verifiedAt:"2026-08-25"},
  {id:"shark-bar-full-spectrum-70",category:"lighting",brand:"Shark",model:"Full Spectrum 4 Renk Bar LED 70 cm",specifications:"Dört renk full-spectrum bar LED · 1155 lm · 70 cm",recommendedTankLengthCm:[70,70],sourceUrl:"https://www.trendyol.com/shark-akvaryum-aydinlatmasi-x-b142840-c103565",verifiedAt:"2026-08-25"},
  {id:"shark-bar-grolux-100",category:"lighting",brand:"Shark",model:"Grolux 3 Renk Bar LED 100 cm",specifications:"Üç renk Grolux bar LED · 1650 lm · 100 cm",recommendedTankLengthCm:[100,100],sourceUrl:"https://www.trendyol.com/shark-akvaryum-aydinlatmasi-x-b142840-c103565",verifiedAt:"2026-08-25"},
  {id:"shark-bar-white-80",category:"lighting",brand:"Shark",model:"Beyaz Bar LED 80 cm",specifications:"Beyaz bar LED · 80 cm",recommendedTankLengthCm:[80,80],sourceUrl:"https://www.trendyol.com/shark-akvaryum-aydinlatmasi-x-b142840-c103565",verifiedAt:"2026-08-25"},
  {id:"shark-bar-white-90",category:"lighting",brand:"Shark",model:"Beyaz Bar LED 90 cm",specifications:"Beyaz bar LED · 90 cm",recommendedTankLengthCm:[90,90],sourceUrl:"https://www.trendyol.com/shark-akvaryum-aydinlatmasi-x-b142840-c103565",verifiedAt:"2026-08-25"},
  {id:"shark-bar-white-100",category:"lighting",brand:"Shark",model:"Beyaz Bar LED 100 cm",specifications:"Beyaz bar LED · 100 cm",recommendedTankLengthCm:[100,100],sourceUrl:"https://www.trendyol.com/shark-akvaryum-aydinlatmasi-x-b142840-c103565",verifiedAt:"2026-08-25"},

  { id:"chihiros-z-light-tiny", category:"lighting", brand:"Chihiros", model:"Z Light Tiny", specifications:"Uygulama kontrollü yakınlaştırılabilir LED · 6 W · 400 lm · 2800–8000 K", powerW:6, sourceUrl:"https://atakanpetshop.com/chihiros-z-light-tiny-yakinlastirilabilir-akvaryum-aydinlatmasi-su-ici-tasarimi", verifiedAt:VERIFIED_AT },
  { id:"netlea-530s-at5", category:"lighting", brand:"Netlea", model:"530S-AT5", specifications:"Telefon kontrollü RGB LED · 35 W · 30–40 cm", powerW:35, recommendedTankLengthCm:[30,40], sourceUrl:"https://bettamarketim.com.tr/netlea-led-armatur-30-40-cm-akvaryuma-uyumludur-530s-at5-rgb-35w-telefon-kontrollu", verifiedAt:"2026-08-24" },
  { id:"netlea-540s-at5", category:"lighting", brand:"Netlea", model:"540S-AT5", specifications:"Telefon kontrollü WRGB LED · 35 W · 40–50 cm", powerW:35, recommendedTankLengthCm:[40,50], sourceUrl:"https://thuysinh4u.com/den-thuy-sinh-netlea-at5s-wrgb-4-in-1", verifiedAt:VERIFIED_AT },
  { id:"netlea-545s-at5", category:"lighting", brand:"Netlea", model:"545S-AT5", specifications:"Telefon kontrollü WRGB LED · 50 W · 45–65 cm", powerW:50, recommendedTankLengthCm:[45,65], sourceUrl:"https://thuysinh4u.com/den-thuy-sinh-netlea-at5s-wrgb-4-in-1", verifiedAt:VERIFIED_AT },
  { id:"netlea-560s-at5", category:"lighting", brand:"Netlea", model:"560S-AT5", specifications:"Telefon kontrollü WRGB LED · 60 W · 60–80 cm", powerW:60, recommendedTankLengthCm:[60,80], sourceUrl:"https://thuysinh4u.com/den-thuy-sinh-netlea-at5s-wrgb-4-in-1", verifiedAt:VERIFIED_AT },
  { id:"netlea-580s-at5", category:"lighting", brand:"Netlea", model:"580S-AT5", specifications:"Telefon kontrollü WRGB LED · 92 W · 80–100 cm", powerW:92, recommendedTankLengthCm:[80,100], sourceUrl:"https://thuysinh4u.com/den-thuy-sinh-netlea-at5s-wrgb-4-in-1", verifiedAt:VERIFIED_AT },
  { id:"netlea-590s-at5", category:"lighting", brand:"Netlea", model:"590S-AT5", specifications:"Telefon kontrollü WRGB LED · 95 W · 90–110 cm", powerW:95, recommendedTankLengthCm:[90,110], sourceUrl:"https://thuysinh4u.com/den-thuy-sinh-netlea-at5s-wrgb-4-in-1", verifiedAt:VERIFIED_AT },
  { id:"netlea-5120s-at5-z04", category:"lighting", brand:"Netlea", model:"NL-5120S-AT5-Z0/4", specifications:"Bluetooth kontrollü, gün simülasyonlu AT5S WRGB LED · 100 LED · 120 W · 120 cm gövde · ayarlanabilir ayaklarla 140 cm'ye kadar", powerW:120, recommendedTankLengthCm:[120,140], sourceUrl:"https://www.akvaryumdizaynmerkezi.com/urun/netlea-nl-5120s-at5-z04-100-led-120w", verifiedAt:"2026-08-25" },
  { id:"netlea-560s-rgb-z04", category:"lighting", brand:"Netlea", model:"NL-560S-RGB-Z0/4", specifications:"Akıllı RGB akvaryum LED'i · 50 LED · 60 W", powerW:60, sourceUrl:"https://www.akvaryumdizaynmerkezi.com/urun-kategorisi/aydinlatma", verifiedAt:"2026-08-25" },
  { id:"netlea-580p-at5-d03", category:"lighting", brand:"Netlea", model:"NL-580P-AT5-D0/3", specifications:"AT5 profesyonel panel armatür · 70 LED · 80 W · 39 × 14 cm gövde", powerW:80, sourceUrl:"https://www.akvaryumdizaynmerkezi.com/magaza", verifiedAt:"2026-08-25" },
  { id:"netlea-6105p-at5-d04", category:"lighting", brand:"Netlea", model:"NL-6105P-AT5-D0/4", specifications:"Ra99, ses ve uygulama kontrollü AT5 profesyonel panel · 84 LED · 105 W · 45 × 18 cm gövde · 45–80 cm akvaryum", powerW:105, recommendedTankLengthCm:[45,80], sourceUrl:"https://www.chinaglobalmall.com/products/1053633174817", verifiedAt:"2026-08-25" },
  ...([["130S",30,30],["145S",40,45],["160S",60,60],["190S",85,90]] as const).map(([model,powerW,bodyLengthCm])=>({id:`netlea-at1e-${model.toLowerCase()}`,category:"lighting" as const,brand:"Netlea",model:`AT1e-${model}`,specifications:`AT1e tam spektrum bitki armatürü · ${powerW} W · ${bodyLengthCm} cm gövde`,powerW,sourceUrl:"https://www.paopaosz.com/topic/NWw5MDE3MjY%3D?page=5",verifiedAt:"2026-08-25"})),
  { id:"netlea-at6s-iii-6105p", category:"lighting", brand:"Netlea", model:"AT6S III 6105P", specifications:"Uygulama kontrollü tam spektrum profesyonel bitki aydınlatması · satıcı metninde güç değeri yayımlanmadı", sourceUrl:"https://www.sxi.com.tw/product/%E5%B0%BC%E7%89%B9%E5%88%A9NetleaAT6sIII", verifiedAt:"2026-08-27" },
  { id:"netlea-at6s-iii-6140p", category:"lighting", brand:"Netlea", model:"AT6S III 6140P", specifications:"Uygulama kontrollü tam spektrum profesyonel bitki aydınlatması · satıcı metninde güç değeri yayımlanmadı", sourceUrl:"https://www.sxi.com.tw/product/%E5%B0%BC%E7%89%B9%E5%88%A9NetleaAT6sIII", verifiedAt:"2026-08-27" },
  { id:"netlea-at7s-ii-7160p", category:"lighting", brand:"Netlea", model:"AT7S II 7160P", specifications:"Yedi kanallı RGBW, dokunmatik, ses ve uygulama kontrollü profesyonel bitki aydınlatması · satıcı metninde güç değeri yayımlanmadı", sourceUrl:"https://www.sxi.com.tw/product/%E5%B0%BC%E7%89%B9%E5%88%A9NetleaAT7s-II%E7%87%88%E7%9B%A4", verifiedAt:"2026-08-27" },
  { id:"netlea-nl-6140p-at5-d04", category:"lighting", brand:"Netlea", model:"NL-6140P-AT5-D0/4", specifications:"Tavan askı tipi AT5 panel armatür · 128 LED · 140 W · 68 × 18 cm gövde", powerW:140, sourceUrl:"https://www.cikletistpetshop.com/netlea-nl-6140p-at5-do4-tavan-aski-tip-68-x18-cm-128-led-140w-5518", verifiedAt:"2026-08-27" },
  { id:"netlea-at1-pro-70w", category:"lighting", brand:"Netlea", model:"AT1 PRO 70W", specifications:"Bluetooth uygulama kontrollü, zaman ayarlı ve gün simülasyonlu tavan askı tipi COB LED · 70 W · 2000–9000 K · 100–220 V · 120 × 50 × 50 cm akvaryuma kadar", powerW:70, sourceUrl:"https://www.cikletistpetshop.com/netlea-at1-pro-70w-5526", verifiedAt:"2026-08-27" },
  { id:"netlea-at3-pros-65w", category:"lighting", brand:"Netlea", model:"AT3 PROS 65W", specifications:"Bluetooth uygulama kontrollü, zaman ayarlı ve gün simülasyonlu tavan askı tipi COB LED · 65 W · 2000–9000 K · 100–220 V", powerW:65, sourceUrl:"https://www.cikletistpetshop.com/netlea-at3-pros-65w", verifiedAt:"2026-08-27" },
  { id:"netlea-nl-595p-at5-d02", category:"lighting", brand:"Netlea", model:"NL-595P-AT5-D0/2", specifications:"Siyah, tavan askı tipi AT5 panel armatür · 95 W · 45 × 16 cm gövde", powerW:95, sourceUrl:"https://www.cikletistpetshop.com/netlea-nl-595p-at5-d02tavan-aski-tipi-siyah-95w-45x16cm-5529", verifiedAt:"2026-08-27" },
  { id:"netlea-nl-5130p-at5-d02", category:"lighting", brand:"Netlea", model:"NL-5130P-AT5-D0/2", specifications:"Siyah, tavan askı tipi AT5 panel armatür · 130 W · 60 × 16 cm gövde", powerW:130, sourceUrl:"https://www.cikletistpetshop.com/netlea", verifiedAt:"2026-08-27" },
  { id:"netlea-at1-pros-30w", category:"lighting", brand:"Netlea", model:"AT1 PROS 30W", specifications:"PROS serisi akvaryum LED aydınlatması · 30 W", powerW:30, sourceUrl:"https://www.cikletistpetshop.com/netlea-at1-pros-30w-5531", verifiedAt:"2026-08-27" },
  { id:"netlea-at3-pros-40w", category:"lighting", brand:"Netlea", model:"AT3 PROS 40W", specifications:"PROS serisi akvaryum LED aydınlatması · 40 W", powerW:40, sourceUrl:"https://www.cikletistpetshop.com/netlea-at3-pros-40w-5532", verifiedAt:"2026-08-27" },
  { id:"netlea-at1-pros-50w", category:"lighting", brand:"Netlea", model:"AT1 PROS 50W", specifications:"PROS serisi akvaryum LED aydınlatması · 50 W", powerW:50, sourceUrl:"https://www.cikletistpetshop.com/netlea-at1-pros-50w-5533", verifiedAt:"2026-08-27" },
  { id:"netlea-7s-90-cylinder", category:"lighting", brand:"Netlea", model:"7S-90 Cylinder Light (NL-7S-90-T2)", specifications:"Tam güneş spektrumlu, Ra99, Wi-Fi/uygulama, ses ve dokunmatik kontrollü yakınlaştırılabilir silindir LED · 360 LED · 90 W", powerW:90, sourceUrl:"https://tarapet.ae/netlea-7s-canister-light-zoom-version-full-spectrum-sun-led-aquarium-plant-light-wifi-voice-touch/", verifiedAt:"2026-08-27" },
  { id:"netlea-7s-110-cylinder", category:"lighting", brand:"Netlea", model:"7S-110 Cylinder Light (NL-7S-110-T2)", specifications:"Tam güneş spektrumlu, Ra99, Wi-Fi/uygulama, ses ve dokunmatik kontrollü yakınlaştırılabilir silindir LED · 486 LED · 110 W", powerW:110, sourceUrl:"https://tarapet.ae/netlea-7s-canister-light-zoom-version-full-spectrum-sun-led-aquarium-plant-light-wifi-voice-touch/", verifiedAt:"2026-08-27" },
  { id:"netlea-7s-150-cylinder", category:"lighting", brand:"Netlea", model:"7S-150 Cylinder Light (NL-7S-150-T2)", specifications:"Tam güneş spektrumlu, Ra99, Wi-Fi/uygulama, ses ve dokunmatik kontrollü yakınlaştırılabilir silindir LED · 609 LED · 150 W", powerW:150, sourceUrl:"https://tarapet.ae/netlea-7s-canister-light-zoom-version-full-spectrum-sun-led-aquarium-plant-light-wifi-voice-touch/", verifiedAt:"2026-08-27" },
  ...([
    ["led-bar-freshlife","LED BAR FRESHLIFE 45",4.5,"9000 K tatlı su LED bar · IP67 · 12 V · 4,5 W","https://www.ferplast.com/products/led-bar-45-freshlife"],
    ["led-bar-freshlife-55","LED BAR FRESHLIFE 55",5,"9000 K tatlı su LED bar · IP67 · 12 V · 5 W","https://www.ferplast.com/products/led-bar-45-freshlife"],
    ["led-bar-freshlife-70","LED BAR FRESHLIFE 70",6.5,"9000 K tatlı su LED bar · IP67 · 12 V · 6,5 W","https://www.ferplast.com/products/led-bar-45-freshlife"],
    ["led-bar-freshlife-90","LED BAR FRESHLIFE 90",9,"9000 K tatlı su LED bar · IP67 · 12 V · 9 W","https://www.ferplast.com/products/led-bar-45-freshlife"],
    ["led-bar-toplife-45","LED BAR TOPLIFE 45",7.5,"6300 K tatlı su LED bar · IP67 · 12 V · 7,5 W","https://www.ferplast.com/products/led-bar-45-toplife"],
    ["led-bar-toplife-55","LED BAR TOPLIFE 55",8,"6300 K tatlı su LED bar · IP67 · 12 V · 8 W","https://www.ferplast.com/products/led-bar-45-toplife"],
    ["led-bar-toplife-70","LED BAR TOPLIFE 70",12,"6300 K tatlı su LED bar · IP67 · 12 V · 12 W","https://www.ferplast.com/products/led-bar-45-toplife"],
    ["led-bar-toplife-90","LED BAR TOPLIFE 90",15,"6300 K tatlı su LED bar · IP67 · 12 V · 15 W","https://www.ferplast.com/products/led-bar-45-toplife"],
    ["led-bar-sealife-45","LED BAR SEALIFE 45",7.5,"Deniz akvaryumu LED bar · IP67 · 12 V · 7,5 W","https://www.ferplast.com/products/led-bar-45-sealife"],
    ["led-bar-sealife-55","LED BAR SEALIFE 55",8,"Deniz akvaryumu LED bar · IP67 · 12 V · 8 W","https://www.ferplast.com/products/led-bar-45-sealife"],
    ["led-bar-sealife-70","LED BAR SEALIFE 70",12,"Deniz akvaryumu LED bar · IP67 · 12 V · 12 W","https://www.ferplast.com/products/led-bar-45-sealife"],
    ["led-bar-sealife-90","LED BAR SEALIFE 90",15,"Deniz akvaryumu LED bar · IP67 · 12 V · 15 W","https://www.ferplast.com/products/led-bar-45-sealife"],
    ["led-bar-pro-toplife-25","LED BAR PRO TOPLIFE 25",3,"Dimmer, zamanlayıcı, gün/gece ve gün doğumu-batımı kontrollü tatlı su LED bar · IP68 · 25 cm · 3 W","https://www.ferplast.com/products/led-bar-pro-25-toplife-1"],
    ["led-bar-pro-toplife-50","LED BAR PRO TOPLIFE 50",6.5,"Dimmer, zamanlayıcı, gün/gece ve gün doğumu-batımı kontrollü tatlı su LED bar · IP68 · 47 cm · 6,5 W","https://www.ferplast.com/products/led-bar-pro-25-toplife-1"],
    ["led-bar-pro-toplife-70","LED BAR PRO TOPLIFE 70",9,"Dimmer, zamanlayıcı, gün/gece ve gün doğumu-batımı kontrollü tatlı su LED bar · IP68 · 68 cm · 9 W","https://www.ferplast.com/products/led-bar-pro-25-toplife-1"],
    ["hy-led-mini","HY-LED MINI",5,"Üç modlu, dokunmatik dimmerli nano LED · 12 V · azami 5 W · 5 mm cama kadar","https://www.ferplast.com/products/hy-led-mini-eu"],
  ] as const).map(([id,model,powerW,specifications,sourceUrl])=>({
    id:`ferplast-${id}`,category:"lighting" as const,brand:"Ferplast",model,specifications,powerW,sourceUrl,verifiedAt:"2026-08-27",
  })),
  ...([
    ["aqamai-fresh-s","AQAMAI FRESH S","Wi-Fi ve uygulama kontrollü tatlı su LED aydınlatması","https://www.ferplast.com/products/aqamai-fresh-small-white-eu"],
    ["aqamai-fresh-m","AQAMAI FRESH M","Wi-Fi ve uygulama kontrollü tatlı su LED aydınlatması","https://www.ferplast.com/products/aqamai-fresh-medium-white-eu"],
    ["aqamai-reef-s","AQAMAI REEF S","Wi-Fi ve uygulama kontrollü deniz akvaryumu LED aydınlatması","https://www.ferplast.com/products/aqamai-reef-small-white-eu"],
    ["aqamai-reef-m","AQAMAI REEF M","Wi-Fi ve uygulama kontrollü deniz akvaryumu LED aydınlatması","https://www.ferplast.com/products/aqamai-reef-medium-white-eu"],
    ["aq-lux-fresh-500","AQ-LUX FRESH 500","CRI >90, dimmer, gün/gece, zamanlayıcı ve gün doğumu-batımı kontrollü IP67 tatlı su LED'i","https://www.ferplast.com/products/aq-lux-fresh-500"],
    ["aq-lux-fresh-700","AQ-LUX FRESH 700","CRI >90, dimmer, gün/gece, zamanlayıcı ve gün doğumu-batımı kontrollü IP67 tatlı su LED'i","https://www.ferplast.com/products/aq-lux-fresh-500"],
    ["aq-lux-fresh-900","AQ-LUX FRESH 900","CRI >90, dimmer, gün/gece, zamanlayıcı ve gün doğumu-batımı kontrollü IP67 tatlı su LED'i","https://www.ferplast.com/products/aq-lux-fresh-500"],
    ["aq-lux-fresh-1100","AQ-LUX FRESH 1100","CRI >90, dimmer, gün/gece, zamanlayıcı ve gün doğumu-batımı kontrollü IP67 tatlı su LED'i","https://www.ferplast.com/products/aq-lux-fresh-500"],
    ["aq-lux-reef-500","AQ-LUX REEF 500","CRI >90, dimmer, gün/gece, zamanlayıcı ve gün doğumu-batımı kontrollü IP67 deniz akvaryumu LED'i","https://www.ferplast.com/products/aq-lux-reef-500"],
    ["aq-lux-reef-700","AQ-LUX REEF 700","CRI >90, dimmer, gün/gece, zamanlayıcı ve gün doğumu-batımı kontrollü IP67 deniz akvaryumu LED'i","https://www.ferplast.com/products/aq-lux-reef-500"],
    ["aq-lux-reef-900","AQ-LUX REEF 900","CRI >90, dimmer, gün/gece, zamanlayıcı ve gün doğumu-batımı kontrollü IP67 deniz akvaryumu LED'i","https://www.ferplast.com/products/aq-lux-reef-500"],
    ["aq-lux-reef-1100","AQ-LUX REEF 1100","CRI >90, dimmer, gün/gece, zamanlayıcı ve gün doğumu-batımı kontrollü IP67 deniz akvaryumu LED'i","https://www.ferplast.com/products/aq-lux-reef-500"],
    ["toplife-t5-24","TOPLIFE 24 W T5","5000 K tatlı ve deniz akvaryumu floresan lambası · 24 W","https://www.ferplast.com/products/toplife-24w-t5"],
    ["toplife-t5-54","TOPLIFE 54 W T5","5000 K tatlı ve deniz akvaryumu floresan lambası · 54 W","https://www.ferplast.com/products/toplife-24w-t5"],
    ["freshlife-t5-54","FRESHLIFE 54 W T5","10000 K tatlı su floresan lambası · 54 W","https://www.ferplast.com/products/freshlife-54w-t5"],
    ["sealife-t5-24","SEALIFE 24 W T5","Deniz akvaryumu floresan lambası · 24 W","https://www.ferplast.com/products/sealife-39w-t5"],
    ["sealife-t5-39","SEALIFE 39 W T5","Deniz akvaryumu floresan lambası · 39 W","https://www.ferplast.com/products/sealife-39w-t5"],
    ["sealife-t5-54","SEALIFE 54 W T5","Deniz akvaryumu floresan lambası · 54 W","https://www.ferplast.com/products/sealife-39w-t5"],
    ["dubai-led-80","DUBAI LED Lamp 80","Dubai 80 akvaryumları için LED tavan aydınlatması","https://www.ferplast.com/products/dubai-led-lamp-80-black"],
    ["dubai-led-100","DUBAI LED Lamp 100","Dubai 100/120 akvaryumları için LED tavan aydınlatması","https://www.ferplast.com/products/dubai-led-lamp-80-black"],
  ] as const).map(([id,model,specifications,sourceUrl])=>({
    id:`ferplast-${id}`,category:"lighting" as const,brand:"Ferplast",model,specifications,
    ...(/(\d+(?:,\d+)?) W/.test(specifications) ? {powerW:Number(specifications.match(/(\d+(?:,\d+)?) W/)?.[1].replace(",","."))} : {}),
    sourceUrl,verifiedAt:"2026-08-27",
  })),
  ...([12,36,60] as const).map(powerW=>({
    id:`ferplast-led-power-supply-${powerW}`,category:"lighting" as const,brand:"Ferplast",model:`Power Supply HY-LD ${powerW} W`,
    specifications:`Ferplast LED aydınlatmaları için 24 V DC güç kaynağı · ${powerW} W`,powerW,
    sourceUrl:"https://www.ferplast.com/products/power-supply-hy-ld-12-eu",verifiedAt:"2026-08-27",
  })),
];
