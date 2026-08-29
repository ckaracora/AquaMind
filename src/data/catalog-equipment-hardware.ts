import type { EquipmentProfile } from "./catalog";

const verifiedAt = "2026-08-17";

const seraSource = "https://www.sera.de/fileadmin/user_upload/manuals/sourcefiles/30601_30602_30603_30604_30605_sera_fil_bioactive_2015-10_INT.pdf";
const seraFilters: EquipmentProfile[] = [
  { id:"sera-fil-bioactive-130", category:"filter", brand:"Sera", model:"fil bioactive 130", specifications:"Dış filtre · 300 L/saat · 11 W", ratedFlowLph:300, powerW:11, recommendedMaxL:130 },
  { id:"sera-fil-bioactive-130-uv", category:"filter", brand:"Sera", model:"fil bioactive 130 + UV", specifications:"UV'li dış filtre · 300 L/saat · 16 W · 5 W UV-C", ratedFlowLph:300, powerW:16, integratedUvcW:5, recommendedMaxL:130 },
  { id:"sera-fil-bioactive-250", category:"filter", brand:"Sera", model:"fil bioactive 250", specifications:"Dış filtre · 750 L/saat · 22 W", ratedFlowLph:750, powerW:22, recommendedMaxL:250 },
  { id:"sera-fil-bioactive-250-uv", category:"filter", brand:"Sera", model:"fil bioactive 250 + UV", specifications:"UV'li dış filtre · 750 L/saat · 32 W · 5 W UV-C", ratedFlowLph:750, powerW:32, integratedUvcW:5, recommendedMaxL:250 },
  { id:"sera-fil-bioactive-400-uv", category:"filter", brand:"Sera", model:"fil bioactive 400 + UV", specifications:"UV'li dış filtre · 1100 L/saat · 36 W · 5 W UV-C", ratedFlowLph:1100, powerW:36, integratedUvcW:5, recommendedMaxL:400 },
].map((item): EquipmentProfile => ({ ...item, category:"filter", sourceUrl:seraSource, verifiedAt }));
seraFilters.push(
  {id:"sera-x-edge-300",category:"filter",brand:"Sera",model:"X-Edge 300",specifications:"Ayarlanabilir köşe filtre · 300 L/saat · 4,2 W · 50–100 L",ratedFlowLph:300,powerW:4.2,recommendedMinL:50,recommendedMaxL:100,adjustableFlow:true,sourceUrl:"https://www.sera.de/us/product/freshwater-aquarium/sera-x-edge-corner-filter/",verifiedAt:"2026-08-18"},
  {id:"sera-x-edge-450",category:"filter",brand:"Sera",model:"X-Edge 450",specifications:"Ayarlanabilir köşe filtre · 450 L/saat · 5 W · 80–200 L",ratedFlowLph:450,powerW:5,recommendedMinL:80,recommendedMaxL:200,adjustableFlow:true,sourceUrl:"https://www.sera.de/us/product/freshwater-aquarium/sera-x-edge-corner-filter/",verifiedAt:"2026-08-18"},
  {id:"sera-x-edge-700",category:"filter",brand:"Sera",model:"X-Edge 700",specifications:"Ayarlanabilir köşe filtre · 700 L/saat · 8,5 W · 100–300 L",ratedFlowLph:700,powerW:8.5,recommendedMinL:100,recommendedMaxL:300,adjustableFlow:true,sourceUrl:"https://www.sera.de/us/product/freshwater-aquarium/sera-x-edge-corner-filter/",verifiedAt:"2026-08-18"},
  {id:"sera-fil-60",category:"filter",brand:"Sera",model:"fil 60",specifications:"Modüler iç filtre · 380 L/saat · 7 W · 60 litreye kadar",ratedFlowLph:380,powerW:7,recommendedMaxL:60,sourceUrl:"https://www.sera.de/fileadmin/user_upload/manuals/sourcefiles/80030_80031_80032_80033_-INT-_sera-fil-60-120_12-2017.pdf",verifiedAt:"2026-08-18"},
  {id:"sera-fil-120",category:"filter",brand:"Sera",model:"fil 120",specifications:"Modüler iç filtre · 700 L/saat · 10 W · 120 litreye kadar",ratedFlowLph:700,powerW:10,recommendedMaxL:120,sourceUrl:"https://www.sera.de/fileadmin/user_upload/manuals/sourcefiles/80030_80031_80032_80033_-INT-_sera-fil-60-120_12-2017.pdf",verifiedAt:"2026-08-18"},
  ...([25,50,75,100,150,200,300] as const).map(powerW=>({id:`sera-heater-thermostat-${powerW}`,category:"heater" as const,brand:"Sera",model:`Aquarium Heater Thermostat ${powerW} W`,specifications:`Kuvars camlı ayarlı ısıtıcı · ${powerW} W`,powerW,sourceUrl:"https://www.sera.de/en/product/freshwater-aquarium/sera-aquarium-heater-thermostats/",verifiedAt:"2026-08-18"})),
  ...([100,150,200,300] as const).map(powerW=>({id:`sera-delta-dh${powerW}`,category:"heater" as const,brand:"Sera",model:`Delta Heater DH${powerW}`,specifications:`18–32 °C ayarlı, aşırı ısınma korumalı ince ısıtıcı · ${powerW} W`,powerW,sourceUrl:"https://www.sera.de/en/product/freshwater-aquarium/sera-delta-heater/",verifiedAt:"2026-08-18"})),
  {id:"sera-air-110-plus",category:"air_pump",brand:"Sera",model:"air 110 plus",specifications:"Tek çıkışlı hava motoru · 110 L/saat · 3 W · 100 litreye kadar",ratedFlowLph:110,powerW:3,recommendedMaxL:100,sourceUrl:"https://www.sera.de/en/service/info/fresh-air-in-the-aquarium-air-pumps/",verifiedAt:"2026-08-18"},
  {id:"sera-air-275-r-plus",category:"air_pump",brand:"Sera",model:"air 275 R plus",specifications:"Ayarlanabilir çift çıkışlı hava motoru · 275 L/saat · 4 W · 300 litreye kadar",ratedFlowLph:275,powerW:4,recommendedMaxL:300,adjustableFlow:true,sourceUrl:"https://www.sera.de/en/service/info/fresh-air-in-the-aquarium-air-pumps/",verifiedAt:"2026-08-18"},
  {id:"sera-air-550-r-plus",category:"air_pump",brand:"Sera",model:"air 550 R plus",specifications:"Ayarlanabilir dört çıkışlı hava motoru · 550 L/saat · 8 W · 300 litre üzeri",ratedFlowLph:550,powerW:8,recommendedMinL:300,adjustableFlow:true,sourceUrl:"https://www.sera.de/en/service/info/fresh-air-in-the-aquarium-air-pumps/",verifiedAt:"2026-08-18"},
);

const dennerleSource = "https://dennerle.com/en/products/corner-filter";
const dennerleFilters: EquipmentProfile[] = [
  { id:"dennerle-corner-40", category:"filter", brand:"Dennerle", model:"Corner Filter 40", specifications:"Ayarlanabilir köşe filtre · 150 L/saat · 2 W", ratedFlowLph:150, powerW:2, recommendedMaxL:40, adjustableFlow:true },
  { id:"dennerle-corner-60", category:"filter", brand:"Dennerle", model:"Corner Filter 60", specifications:"Ayarlanabilir köşe filtre · 150 L/saat · 2 W", ratedFlowLph:150, powerW:2, recommendedMaxL:60, adjustableFlow:true },
  { id:"dennerle-corner-100", category:"filter", brand:"Dennerle", model:"Corner Filter 100", specifications:"Ayarlanabilir köşe filtre · 390 L/saat · 5,1 W", ratedFlowLph:390, powerW:5.1, recommendedMaxL:100, adjustableFlow:true },
].map((item): EquipmentProfile => ({ ...item, category:"filter", sourceUrl:dennerleSource, verifiedAt }));

const dennerleConstantSource = "https://dennerle.com/en/products/nano-heater-constant";
const dennerleHeaters: EquipmentProfile[] = [35,50,75].map(powerW => ({
  id:`dennerle-nano-heater-constant-${powerW}`, category:"heater", brand:"Dennerle", model:`Nano Heater Constant ${powerW} W`,
  specifications:`Sabit 25 °C elektronik nano ısıtıcı · ${powerW} W`, powerW, sourceUrl:dennerleConstantSource, verifiedAt,
}));
dennerleHeaters.push({ id:"dennerle-nano-heater-compact-150", category:"heater", brand:"Dennerle", model:"Nano Heater Compact 150 W", specifications:"20–33 °C ayarlanabilir elektronik ısıtıcı · 150 W", powerW:150, recommendedMinL:10, recommendedMaxL:230, sourceUrl:"https://dennerle.com/en/products/nano-heater-compact", verifiedAt });

const dennerleExpandedEquipment: EquipmentProfile[] = [
  {id:"dennerle-scapers-flow",category:"filter",brand:"Dennerle",model:"Scaper's Flow",specifications:"Sırt tipi dış filtre · 450 L/saat · 60 cm basma yüksekliği",ratedFlowLph:450,adjustableFlow:true,sourceUrl:"https://dennerle.com/en/products/scapers-flow",verifiedAt:"2026-08-18"},
  ...([[40,18],[70,36],[110,60],[140,78]] as const).map(([lengthCm,powerW])=>({id:`dennerle-trocal-led-${lengthCm}`,category:"lighting" as const,brand:"Dennerle",model:`Trocal LED ${lengthCm} cm`,specifications:`Bitkili akvaryum LED aydınlatma · ${lengthCm} cm · ${powerW} W`,powerW,sourceUrl:"https://dennerle.com/en/products/trocal-led",verifiedAt:"2026-08-18"})),
  {id:"dennerle-trocal-style-two-6",category:"lighting",brand:"Dennerle",model:"Trocal Style Two 6 W",specifications:"6500 K nano LED · 800 lm · 6 W",powerW:6,sourceUrl:"https://dennerle.com/en/products/trocal-style-two",verifiedAt:"2026-08-18"},
  {id:"dennerle-trocal-style-two-8",category:"lighting",brand:"Dennerle",model:"Trocal Style Two 8 W",specifications:"6500 K nano LED · 1280 lm · 8 W",powerW:8,sourceUrl:"https://dennerle.com/en/products/trocal-style-two",verifiedAt:"2026-08-18"},
  ...([
    ["20",4.8,864,20,30],
    ["30",7.2,1296,26,36],
    ["40",9.6,1728,34.5,44.5],
    ["60",16.8,3024,56,66],
    ["80",21.6,3888,74,84],
  ] as const).map(([model,powerW,lumens,minLength,maxLength])=>({
    id:`dennerle-daytime-onex-${model}-black`,category:"lighting" as const,brand:"Dennerle",model:`daytime onex${model} black`,
    specifications:`7000 K LED · ${powerW} W · ${lumens} lm · ${minLength}–${maxLength} cm akvaryum`,
    powerW,recommendedTankLengthCm:[minLength,maxLength] as [number,number],
    sourceUrl:"https://dennerle.com/en/products/daytime-onex-black",verifiedAt:"2026-08-27",
  })),
  {id:"dennerle-trocal-flat-35",category:"lighting",brand:"Dennerle",model:"Trocal Flat 35",specifications:"6500 K nano akvaryum LED aydınlatması · 40–45 cm akvaryumlar için",recommendedTankLengthCm:[40,45],sourceUrl:"https://dennerle.com/en/products/trocal-flat",verifiedAt:"2026-08-27"},
  ...([20,50,80] as const).map(powerW=>({
    id:`dennerle-trocal-led-power-supply-${powerW}`,category:"other" as const,brand:"Dennerle",model:`Trocal LED Güç Kaynağı ${powerW} W`,
    specifications:`Trocal LED sistemi için ${powerW} W yedek güç kaynağı`,
    powerW,sourceUrl:"https://dennerle.com/en/products/trocal-led-netzteil",verifiedAt:"2026-08-27",
  })),
  {id:"dennerle-carbo-bio-start-60",category:"co2",brand:"Dennerle",model:"Carbo Bio Start 60",specifications:"Biyolojik CO₂ tam set · en az 40 gün · 60 litreye kadar",recommendedMaxL:60,sourceUrl:"https://dennerle.com/en/products/carbo-bio-start",verifiedAt:"2026-08-18"},
  {id:"dennerle-carbo-bio-start-80",category:"co2",brand:"Dennerle",model:"Carbo Bio Start 80",specifications:"Biyolojik CO₂ tam set · 2 × en az 40 gün · 80 litreye kadar",recommendedMaxL:80,sourceUrl:"https://dennerle.com/en/products/carbo-bio-start",verifiedAt:"2026-08-18"},
  {id:"dennerle-carbo-start-e200",category:"co2",brand:"Dennerle",model:"Carbo Start E200",specifications:"Tek kullanımlık tüplü hassas CO₂ tam seti · 200 litreye kadar",recommendedMaxL:200,sourceUrl:"https://dennerle.com/en/products/carbo-start-e200",verifiedAt:"2026-08-18"},
  {id:"dennerle-carbo-start-e200-special",category:"co2",brand:"Dennerle",model:"Carbo Start E200 Special Edition",specifications:"Solenoid valfli tek kullanımlık tüp CO₂ tam seti · 200 litreye kadar",recommendedMaxL:200,sourceUrl:"https://dennerle.com/en/products/carbo-start-e200",verifiedAt:"2026-08-18"},
  {id:"dennerle-carbo-start-m200",category:"co2",brand:"Dennerle",model:"Carbo Start M200",specifications:"Yeniden doldurulabilir tüplü hassas CO₂ tam seti · 200 litreye kadar",recommendedMaxL:200,sourceUrl:"https://dennerle.com/en/products/carbo-start-m200",verifiedAt:"2026-08-18"},
  {id:"dennerle-carbo-start-flex200",category:"co2",brand:"Dennerle",model:"Carbo Start Flex200",specifications:"Tek ve yeniden doldurulabilir tüple uyumlu CO₂ teknik seti · 200 litreye kadar",recommendedMaxL:200,sourceUrl:"https://dennerle.com/en/products/carbo-start-flex200",verifiedAt:"2026-08-18"},
  {id:"dennerle-carbo-night-m400",category:"co2",brand:"Dennerle",model:"Carbo Night M400",specifications:"Gece kapatma solenoidli, yeniden doldurulabilir tüplü CO₂ tam seti · 400 litreye kadar",recommendedMaxL:400,sourceUrl:"https://dennerle.com/en/products/carbo-night-m400",verifiedAt:"2026-08-18"},
  {id:"dennerle-carbo-night-m600",category:"co2",brand:"Dennerle",model:"Carbo Night M600",specifications:"Gece kapatma solenoidli, yeniden doldurulabilir tüplü CO₂ tam seti · 600 litreye kadar",recommendedMaxL:600,sourceUrl:"https://dennerle.com/en/products/carbo-night-m600",verifiedAt:"2026-08-18"},
];

const dennerleCurrentCo2Equipment: EquipmentProfile[] = [
  {id:"dennerle-carbo-bio-style-120",category:"co2",brand:"Dennerle",model:"Carbo Bio Style 120",specifications:"Yeniden doldurulabilir paslanmaz reaksiyon kabına sahip biyolojik CO₂ tam seti · 120 litreye kadar · en az 40 gün",recommendedMaxL:120,sourceUrl:"https://dennerle.com/en/products/carbo-bio-style-120",verifiedAt:"2026-08-27"},
  {id:"dennerle-carbo-soda-m200",category:"co2",brand:"Dennerle",model:"Carbo Soda M200",specifications:"Standart vidalı soda CO₂ tüpüyle çalışan tam set · 200 litreye kadar",recommendedMaxL:200,sourceUrl:"https://dennerle.com/en/products/carbo-soda-m200",verifiedAt:"2026-08-27"},
  ...([
    ["E400","Tek kullanımlık CO₂ tüpüyle uyumlu"],
    ["E400 Special Edition","Solenoid valfli, tek kullanımlık CO₂ tüpüyle uyumlu"],
    ["Flex400","Tek ve yeniden doldurulabilir CO₂ tüpleriyle uyumlu"],
    ["Flex400 Special Edition","Solenoid valfli, tek ve yeniden doldurulabilir CO₂ tüpleriyle uyumlu"],
    ["M400","Yeniden doldurulabilir CO₂ tüpüyle uyumlu"],
    ["M400 Special Edition","Solenoid valfli, yeniden doldurulabilir CO₂ tüpüyle uyumlu"],
  ] as const).map(([model,detail])=>({
    id:`dennerle-carbo-power-${model.toLowerCase().replace(/[^a-z0-9]+/g,"-")}`,category:"co2" as const,brand:"Dennerle",model:`Carbo Power ${model}`,
    specifications:`${detail} hassas CO₂ tam seti · 400 litreye kadar`,recommendedMaxL:400,
    sourceUrl:`https://dennerle.com/en/products/carbo-power-${model.startsWith("E")?"e400":model.startsWith("Flex")?"flex400":"m400"}`,verifiedAt:"2026-08-27",
  })),
  {id:"dennerle-carbo-night-flex400",category:"co2",brand:"Dennerle",model:"Carbo Night Flex400",specifications:"Entegre gece kapatma solenoidi bulunan, tek ve yeniden doldurulabilir tüplerle uyumlu CO₂ tam seti · 400 litreye kadar",recommendedMaxL:400,sourceUrl:"https://dennerle.com/en/products/carbo-night-flex400",verifiedAt:"2026-08-27"},
  {id:"dennerle-carbo-start-flex200-special",category:"co2",brand:"Dennerle",model:"Carbo Start Flex200 Special Edition",specifications:"Solenoid valfli, tek ve yeniden doldurulabilir tüplerle uyumlu CO₂ tam seti · 200 litreye kadar",recommendedMaxL:200,sourceUrl:"https://dennerle.com/en/products/carbo-start-flex200",verifiedAt:"2026-08-27"},
  {id:"dennerle-carbo-regulator-start",category:"co2",brand:"Dennerle",model:"Carbo Start Basınç Düşürücü",specifications:"İnce filtreli, aşırı basınç emniyetli ve otomatik basınç dengelemeli hassas basınç düşürücü",sourceUrl:"https://dennerle.com/en/products/druckminderer-start",verifiedAt:"2026-08-27"},
  {id:"dennerle-carbo-regulator-power",category:"co2",brand:"Dennerle",model:"Carbo Power Basınç Düşürücü",specifications:"Tüp ve çalışma basıncı manometreli, iğne valfli hassas basınç düşürücü",sourceUrl:"https://dennerle.com/en/products/druckminderer-power",verifiedAt:"2026-08-27"},
  {id:"dennerle-carbo-regulator-night",category:"co2",brand:"Dennerle",model:"CO₂ Basınç Düşürücü Night",specifications:"Elektrik kesildiğinde kapanan entegre 9 V solenoid valfli basınç düşürücü",sourceUrl:"https://dennerle.com/en/products/druckminderer-night",verifiedAt:"2026-08-27"},
  ...([500,1200] as const).map(grams=>({id:`dennerle-carbo-cylinder-e-${grams}`,category:"co2" as const,brand:"Dennerle",model:`Carbo Cylinder E ${grams} g`,specifications:`${grams} g tek kullanımlık basınçlı CO₂ tüpü`,sourceUrl:"https://dennerle.com/en/products/carbo-cylinder-e",verifiedAt:"2026-08-27"})),
  ...([500,2000] as const).map(grams=>({id:`dennerle-co2-refillable-cylinder-${grams}`,category:"co2" as const,brand:"Dennerle",model:`CO₂ Yeniden Doldurulabilir Tüp ${grams} g`,specifications:`${grams} g yeniden doldurulabilir basınçlı CO₂ tüpü`,sourceUrl:"https://dennerle.com/en/products/co2-mehrwegflasche",verifiedAt:"2026-08-27"})),
  {id:"dennerle-co2-solenoid-valve",category:"co2",brand:"Dennerle",model:"CO₂ Solenoid Valf",specifications:"CO₂ beslemesini zamanlayıcı veya pH kontrol cihazı üzerinden açıp kapatan solenoid valf",sourceUrl:"https://dennerle.com/en/products/co2-magnetventil",verifiedAt:"2026-08-27"},
  ...(["S","M","L"] as const).map(size=>({id:`dennerle-co2-diffuser-ultra-${size.toLowerCase()}`,category:"co2" as const,brand:"Dennerle",model:`CO₂ Diffuser Ultra ${size}`,specifications:`Ultraince kabarcık üreten seramik diskli CO₂ difüzörü · ${size} boy`,sourceUrl:"https://dennerle.com/en/products/co2-diffusor-ultra",verifiedAt:"2026-08-27"})),
  ...([
    ["Micro-Flipper",60],
    ["Mini-Flipper",200],
    ["Flipper",300],
    ["Maxi-Flipper",600],
  ] as const).map(([model,maxL])=>({id:`dennerle-co2-${model.toLowerCase()}`,category:"co2" as const,brand:"Dennerle",model:`CO₂ ${model}`,specifications:`Pasif CO₂ çözündürme cihazı · ${maxL} litreye kadar`,recommendedMaxL:maxL,sourceUrl:"https://dennerle.com/en/products/co2-flipper",verifiedAt:"2026-08-27"})),
  {id:"dennerle-co2-nano-flipper",category:"co2",brand:"Dennerle",model:"CO₂ Nano-Flipper",specifications:"Nano akvaryumlar için pasif CO₂ çözündürme cihazı",sourceUrl:"https://dennerle.com/en/products/co2-nano-flipper",verifiedAt:"2026-08-27"},
  {id:"dennerle-co2-bubble-counter-exact",category:"co2",brand:"Dennerle",model:"CO₂ Blasenzähler Exact",specifications:"CO₂ besleme hızını görsel olarak izlemek için hassas kabarcık sayacı",sourceUrl:"https://dennerle.com/en/products/co2-blasenzaehler",verifiedAt:"2026-08-27"},
  {id:"dennerle-co2-check-valve",category:"co2",brand:"Dennerle",model:"CO₂ Geri Akış Önleyici",specifications:"Akvaryum suyunun CO₂ sistemine geri akmasını önleyen valf",sourceUrl:"https://dennerle.com/en/products/co2-ruecklaufsicherung",verifiedAt:"2026-08-27"},
  ...([2,5] as const).map(meters=>({id:`dennerle-co2-hose-${meters}m`,category:"co2" as const,brand:"Dennerle",model:`CO₂ Hortumu ${meters} m`,specifications:`Basınca dayanıklı CO₂ hortumu · ${meters} m`,sourceUrl:`https://dennerle.com/en/products/co2-schlauch-${meters}m`,verifiedAt:"2026-08-27"})),
  {id:"dennerle-carbo-bio-depot-60-80",category:"co2",brand:"Dennerle",model:"Carbo Bio Depot 60/80",specifications:"Carbo Bio Start 60/80 için biyolojik CO₂ yedek dolumu",sourceUrl:"https://dennerle.com/en/products/carbo-bio-depot-60-80",verifiedAt:"2026-08-27"},
  {id:"dennerle-carbo-bio-depot-120",category:"co2",brand:"Dennerle",model:"Carbo Bio Depot 120",specifications:"Carbo Bio Style 120 için biyolojik CO₂ yedek dolumu",sourceUrl:"https://dennerle.com/en/products/carbo-bio-depot-120",verifiedAt:"2026-08-27"},
];

const dennerleCurrentOtherEquipment: EquipmentProfile[] = [
  {id:"dennerle-osmose-professional-190",category:"other",brand:"Dennerle",model:"Osmose Professional 190",specifications:"İnce ve aktif karbon ön filtreli, 3/4 inç musluk bağlantılı ters ozmoz sistemi",sourceUrl:"https://dennerle.com/en/products/osmose-professional-190",verifiedAt:"2026-08-27"},
  {id:"dennerle-nano-thermometer",category:"other",brand:"Dennerle",model:"Nano Thermometer",specifications:"Vantuzlu, yüksek hassasiyetli ve kolay okunan nano akvaryum termometresi",sourceUrl:"https://dennerle.com/en/products/nano-thermometer",verifiedAt:"2026-08-27"},
  {id:"dennerle-plant-scissor-spring",category:"other",brand:"Dennerle",model:"Plant Scissor Spring",specifications:"Paslanmaz çelik, yaylı hassas bitki budama makası",sourceUrl:"https://dennerle.com/en/products/plant-scissor-spring",verifiedAt:"2026-08-27"},
  {id:"dennerle-nano-feeding-tongs",category:"other",brand:"Dennerle",model:"Nano Feeding Tongs",specifications:"Yem yapraklarını akvaryum içinde sabitlemek ve kalıntıları çıkarmak için maşa",sourceUrl:"https://dennerle.com/en/products/nano-futterzange",verifiedAt:"2026-08-27"},
  ...(["Small","Large"] as const).map(size=>({id:`dennerle-fish-net-${size.toLowerCase()}`,category:"other" as const,brand:"Dennerle",model:`Fish Net ${size}`,specifications:`${size==="Small"?"Küçük":"Büyük"} boy akvaryum kepçesi`,sourceUrl:"https://dennerle.com/en/products/fish-net",verifiedAt:"2026-08-27"})),
  {id:"dennerle-shake-and-flow",category:"other",brand:"Dennerle",model:"Shake and Flow",specifications:"Eloksallı alüminyum pompa başlıklı, 1,70 m hortumlu su değişim sifonu",sourceUrl:"https://dennerle.com/en/products/shake-and-flow",verifiedAt:"2026-08-27"},
  {id:"dennerle-alginator",category:"other",brand:"Dennerle",model:"Alginator",specifications:"Yuvarlatılmış camlarda kullanılabilen, 2,5 kg tutuş güçlü neodimyum mıknatıslı cam temizleyici",sourceUrl:"https://dennerle.com/en/products/alginator",verifiedAt:"2026-08-27"},
  {id:"dennerle-gravel-cleaner",category:"other",brand:"Dennerle",model:"Mulmsauger",specifications:"50 cm emiş borulu ve 180 cm hortumlu taban temizleme sifonu",sourceUrl:"https://dennerle.com/en/products/mulmsauger",verifiedAt:"2026-08-27"},
  {id:"dennerle-cleanator",category:"other",brand:"Dennerle",model:"Cleanator",specifications:"Paslanmaz çelik yün ve sünger yüzeyli çift taraflı akvaryum cam temizleyicisi",sourceUrl:"https://dennerle.com/en/products/cleanator",verifiedAt:"2026-08-27"},
  {id:"dennerle-nano-gravel-cleaner",category:"other",brand:"Dennerle",model:"Nano Mulmsauger",specifications:"Valf pompalı, hortum tutuculu ve debi ayarlı nano taban temizleme sifonu",sourceUrl:"https://dennerle.com/en/products/nano-mulmsauger",verifiedAt:"2026-08-27"},
  {id:"dennerle-snail-catcher",category:"other",brand:"Dennerle",model:"Snail Catcher",specifications:"Yaklaşık 6 mm'ye kadar küçük salyangozları camdan mekanik olarak toplayan araç",sourceUrl:"https://dennerle.com/en/products/snail-catcher",verifiedAt:"2026-08-27"},
  {id:"dennerle-scapers-tools-set",category:"other",brand:"Dennerle",model:"Scaper's Tools Set",specifications:"Paslanmaz çelik aquascaping makası ve cımbızlarından oluşan bakım seti",sourceUrl:"https://dennerle.com/en/products/scapers-tools-set",verifiedAt:"2026-08-27"},
  ...(["Straight","Curved"] as const).map(shape=>({id:`dennerle-plant-tweezer-${shape.toLowerCase()}`,category:"other" as const,brand:"Dennerle",model:`Plant Tweezer ${shape}`,specifications:`${shape==="Straight"?"Düz":"Eğri"} uçlu paslanmaz çelik bitki cımbızı`,sourceUrl:"https://dennerle.com/en/products/plant-tweezer",verifiedAt:"2026-08-27"})),
  {id:"dennerle-plant-scissor-curved",category:"other",brand:"Dennerle",model:"Plant Scissor Curved",specifications:"Zor ulaşılan bölgeler için eğri uçlu paslanmaz çelik bitki makası",sourceUrl:"https://dennerle.com/en/products/plant-scissor-curved",verifiedAt:"2026-08-27"},
  {id:"dennerle-aquarium-care-set",category:"other",brand:"Dennerle",model:"Aquarium Care Set",specifications:"Paslanmaz çelik bitki makası ve cımbızı içeren akvaryum bakım seti",sourceUrl:"https://dennerle.com/en/products/aquarium-care-set",verifiedAt:"2026-08-27"},
  ...(["small","large"] as const).map(size=>({id:`dennerle-shrimp-net-${size}`,category:"other" as const,brand:"Dennerle",model:`Shrimp Net ${size==="small"?"Small":"Large"}`,specifications:`24–62 cm uzayabilen, beyaz ve siyah seçenekli ${size==="small"?"küçük":"büyük"} karides kepçesi`,sourceUrl:`https://dennerle.com/en/products/shrimp-netz-${size==="small"?"klein":"gross"}`,verifiedAt:"2026-08-27"})),
  {id:"dennerle-corner-filter-module-40-60",category:"other",brand:"Dennerle",model:"Corner Filter Module 40/60",specifications:"Corner Filter 40/60 için ek filtre modülü",sourceUrl:"https://dennerle.com/en/products/corner-filter-modul",verifiedAt:"2026-08-27"},
  {id:"dennerle-corner-filter-extension-40-60",category:"other",brand:"Dennerle",model:"Corner Filter Extension 40/60",specifications:"Corner Filter 40/60 için uzatma modülü",sourceUrl:"https://dennerle.com/en/products/corner-filter-extension-40-60",verifiedAt:"2026-08-27"},
  {id:"dennerle-corner-filter-baby-protect-40-60",category:"other",brand:"Dennerle",model:"Corner Filter Baby Protect 40/60",specifications:"Corner Filter 40/60 için yavru ve karides emiş koruyucusu",sourceUrl:"https://dennerle.com/en/products/corner-filter-baby-protect-40-60",verifiedAt:"2026-08-27"},
  {id:"dennerle-corner-filter-baby-protect-100",category:"other",brand:"Dennerle",model:"Corner Filter Baby Protect 100",specifications:"Corner Filter 100 için yavru ve karides emiş koruyucusu",sourceUrl:"https://dennerle.com/en/products/corner-filter-baby-protect-100",verifiedAt:"2026-08-27"},
  {id:"dennerle-corner-filter-accessory-set-40-60",category:"other",brand:"Dennerle",model:"Corner Filter Accessory Set 40/60",specifications:"Corner Filter 40/60 için resmî aksesuar seti",sourceUrl:"https://dennerle.com/en/products/zubehorset-corner-filter-40-60",verifiedAt:"2026-08-27"},
];

const ferplastFilterSource = "https://www.ferplast.com/products/bluextreme-700";
const ferplastFilters: EquipmentProfile[] = [
  [700,700,12,150], [1100,1100,16,300], [1500,1500,32,500],
].map(([model,ratedFlowLph,powerW,recommendedMaxL]) => ({
  id:`ferplast-bluextreme-${model}`, category:"filter", brand:"Ferplast", model:`Bluextreme ${model}`,
  specifications:`Dış filtre · ${ratedFlowLph} L/saat · ${powerW} W`, ratedFlowLph, powerW, recommendedMaxL,
  adjustableFlow:true, sourceUrl:ferplastFilterSource, verifiedAt,
}));
ferplastFilters.push(
  ...([[250,800,12],[350,1100,16],[450,1300,22]] as const).map(([model,flow,power])=>({id:`ferplast-professional-2-${model}`,category:"filter" as const,brand:"Ferplast",model:`Professional 2.0 ${model}`,specifications:`Dört aşamalı dış filtre · ${flow} L/saat · en çok ${power} W · entegre CO₂ difüzörü`,ratedFlowLph:flow,powerW:power,recommendedMaxL:model,sourceUrl:"https://www.ferplast.com/products/filter-professional-2-0-250-eu",verifiedAt})),
  {id:"ferplast-prime-10",category:"filter",brand:"Ferplast",model:"Prime 10",specifications:"Dış filtre · 580 L/saat · 9 W · 80–150 L",ratedFlowLph:580,powerW:9,recommendedMinL:80,recommendedMaxL:150,sourceUrl:"https://www.ferplast.com/products/prime-10-eu",verifiedAt},
  {id:"ferplast-prime-20",category:"filter",brand:"Ferplast",model:"Prime 20",specifications:"Dış filtre · 1000 L/saat · 21 W · 100–250 L",ratedFlowLph:1000,powerW:21,recommendedMinL:100,recommendedMaxL:250,sourceUrl:"https://www.ferplast.com/products/prime-10-eu",verifiedAt},
  {id:"ferplast-prime-30",category:"filter",brand:"Ferplast",model:"Prime 30",specifications:"Dış filtre · 1320 L/saat · 25 W · 200–450 L",ratedFlowLph:1320,powerW:25,recommendedMinL:200,recommendedMaxL:450,sourceUrl:"https://www.ferplast.com/products/prime-10-eu",verifiedAt},
  {id:"ferplast-bravo-200",category:"filter",brand:"Ferplast",model:"Bravo 200",specifications:"Askı filtre · 750 L/saat · 8 W · 60–120 L",ratedFlowLph:750,powerW:8,recommendedMinL:60,recommendedMaxL:120,adjustableFlow:true,sourceUrl:"https://www.ferplast.com/products/bravo-200-eu",verifiedAt},
  {id:"ferplast-bravo-300",category:"filter",brand:"Ferplast",model:"Bravo 300",specifications:"Askı filtre · 1050 L/saat · 8 W · 100–200 L",ratedFlowLph:1050,powerW:8,recommendedMinL:100,recommendedMaxL:200,adjustableFlow:true,sourceUrl:"https://www.ferplast.com/products/bravo-200-eu",verifiedAt},
  {id:"ferplast-blumodular-1",category:"filter",brand:"Ferplast",model:"Blumodular 1",specifications:"Modüler iç filtre · 900 L/saat · 12 W",ratedFlowLph:900,powerW:12,adjustableFlow:true,sourceUrl:"https://www.ferplast.com/products/blumodular-1",verifiedAt},
  {id:"ferplast-blumodular-2",category:"filter",brand:"Ferplast",model:"Blumodular 2",specifications:"İki modüllü iç filtre · 900 L/saat · 12 W",ratedFlowLph:900,powerW:12,adjustableFlow:true,sourceUrl:"https://www.ferplast.com/products/blumodular-1",verifiedAt},
  {id:"ferplast-blumodular-3",category:"filter",brand:"Ferplast",model:"Blumodular 3",specifications:"Üç modüllü iç filtre · 1200 L/saat",ratedFlowLph:1200,adjustableFlow:true,sourceUrl:"https://www.ferplast.com/products/blumodular-1",verifiedAt},
  {id:"ferplast-bluwave-01",category:"filter",brand:"Ferplast",model:"Bluwave 01",specifications:"İç filtre · 500 L/saat · 70 litreye kadar",ratedFlowLph:500,recommendedMaxL:70,sourceUrl:"https://www.ferplast.com/collections/all/bluwave",verifiedAt},
  {id:"ferplast-bluwave-01-bioflo",category:"filter",brand:"Ferplast",model:"Bluwave 01 Bioflo",specifications:"Aerobik iç filtre · 500 L/saat",ratedFlowLph:500,sourceUrl:"https://www.ferplast.com/collections/all/bluwave",verifiedAt},
  {id:"ferplast-bluwave-03",category:"filter",brand:"Ferplast",model:"Bluwave 03",specifications:"Üç aşamalı iç filtre · 500 L/saat · 4,5 W · 150 litreye kadar",ratedFlowLph:500,powerW:4.5,recommendedMaxL:150,sourceUrl:"https://www.ferplast.com/products/bluwave-03",verifiedAt},
  {id:"ferplast-bluwave-05",category:"filter",brand:"Ferplast",model:"Bluwave 05",specifications:"Üç aşamalı iç filtre · 500 L/saat · 4,5 W · 150 litreye kadar",ratedFlowLph:500,powerW:4.5,recommendedMaxL:150,sourceUrl:"https://www.ferplast.com/products/bluwave-05",verifiedAt},
  {id:"ferplast-bluwave-07",category:"filter",brand:"Ferplast",model:"Bluwave 07",specifications:"Üç aşamalı iç filtre · 900 L/saat · 13 W · 300 litreye kadar",ratedFlowLph:900,powerW:13,recommendedMaxL:300,sourceUrl:"https://www.ferplast.com/products/bluwave-07",verifiedAt},
  {id:"ferplast-pico-filter",category:"filter",brand:"Ferplast",model:"Pico Filter",specifications:"Ayarlanabilir mini iç filtre · 350 L/saat · 6,5 W · 30 litreye kadar",ratedFlowLph:350,powerW:6.5,recommendedMaxL:30,adjustableFlow:true,sourceUrl:"https://www.ferplast.com/products/pico-filter-eu",verifiedAt},
  {id:"ferplast-pico-pro",category:"filter",brand:"Ferplast",model:"Pico Pro",specifications:"Üç aşamalı iç filtre · 300 L/saat · 4,5 W · 45 litreye kadar",ratedFlowLph:300,powerW:4.5,recommendedMaxL:45,adjustableFlow:true,sourceUrl:"https://www.ferplast.com/products/pico-pro-eu",verifiedAt},
  ...([[50,170,4,20,50],[90,450,5,40,90],[150,650,10,80,150],[200,800,11,120,200],[300,900,12,200,500]] as const).map(([model,flow,power,minL,maxL])=>({id:`ferplast-crystal-${model}`,category:"filter" as const,brand:"Ferplast",model:`Crystal ${model}`,specifications:`İki aşamalı iç filtre · ${flow} L/saat · ${power} W`,ratedFlowLph:flow,powerW:power,recommendedMinL:minL,recommendedMaxL:maxL,sourceUrl:"https://www.ferplast.com/products/crystal-50-eu",verifiedAt})),
);

const ferplastHeaterSource = "https://www.ferplast.com/products/bluclima-8299";
const ferplastHeaters: EquipmentProfile[] = [50,75,100,150,200,300].map(powerW => ({
  id:`ferplast-bluclima-${powerW}`, category:"heater", brand:"Ferplast", model:`Bluclima ${powerW}`,
  specifications:`Ayarlanabilir dalgıç ısıtıcı · ${powerW} W`, powerW, sourceUrl:ferplastHeaterSource, verifiedAt,
}));
ferplastHeaters.push(
  ...([[25,10,25],[50,20,50],[100,50,100],[150,90,150],[200,100,200],[300,200,300]] as const).map(([power,minL,maxL])=>({id:`ferplast-theo-${power}`,category:"heater" as const,brand:"Ferplast",model:`Theo ${power} W`,specifications:`PTC korumalı ayarlanabilir dalgıç ısıtıcı · ${power} W · ${minL}–${maxL} L`,powerW:power,recommendedMinL:minL,recommendedMaxL:maxL,sourceUrl:"https://www.ferplast.com/products/theo-25-eu",verifiedAt})),
  {id:"ferplast-eth-200-12",category:"heater",brand:"Ferplast",model:"ETH 200 — 12 mm",specifications:"Dış filtre hattı ısıtıcısı · 200 W · 12 mm · 100–200 L",powerW:200,recommendedMinL:100,recommendedMaxL:200,sourceUrl:"https://www.ferplast.com/products/eth-200-12-mm-eu",verifiedAt},
  {id:"ferplast-eth-200-16",category:"heater",brand:"Ferplast",model:"ETH 200 — 16 mm",specifications:"Dış filtre hattı ısıtıcısı · 200 W · 16 mm · 100–200 L",powerW:200,recommendedMinL:100,recommendedMaxL:200,sourceUrl:"https://www.ferplast.com/products/eth-200-12-mm-eu",verifiedAt},
  {id:"ferplast-eth-300-16",category:"heater",brand:"Ferplast",model:"ETH 300 — 16 mm",specifications:"Dış filtre hattı ısıtıcısı · 300 W · 16 mm · 200–300 L",powerW:300,recommendedMinL:200,recommendedMaxL:300,sourceUrl:"https://www.ferplast.com/products/eth-200-12-mm-eu",verifiedAt},
  {id:"ferplast-fixheat-25",category:"heater",brand:"Ferplast",model:"Fixheat 25 W",specifications:"26 °C sabit sıcaklıklı kompakt ısıtıcı · 25 W · 30 litreye kadar",powerW:25,recommendedMaxL:30,sourceUrl:"https://www.ferplast.com/products/fixheat-25-eu",verifiedAt},
  ...([[15,25,40],[25,40,65],[50,60,125],[75,120,200],[100,160,250]] as const).map(([power,minL,maxL])=>({id:`ferplast-hydrokable-${power}`,category:"heater" as const,brand:"Ferplast",model:`Hydrokable ${power} W`,specifications:`Taban ısıtma kablosu · ${power} W · ${minL}–${maxL} L`,powerW:power,recommendedMinL:minL,recommendedMaxL:maxL,sourceUrl:"https://www.ferplast.com/products/hydrokable-15-eu",verifiedAt})),
);

const ferplastCurrentEquipment: EquipmentProfile[] = [
  {id:"ferplast-hydroset",category:"other",brand:"Ferplast",model:"HYDROSET",specifications:"Akvaryum ve teraryumlar için yüksek hassasiyetli elektronik termostat",sourceUrl:"https://www.ferplast.com/products/hydroset-eu",verifiedAt:"2026-08-27"},
  {id:"ferplast-module-blumodular",category:"other",brand:"Ferplast",model:"MODULE BLUMODULAR",specifications:"Blumodular iç filtreler için ek filtre modülü",sourceUrl:"https://www.ferplast.com/products/module-blumodular",verifiedAt:"2026-08-27"},
  {id:"ferplast-chef-pro",category:"other",brand:"Ferplast",model:"CHEF PRO",specifications:"Pul ve granül yemler için günde üç öğüne kadar programlanabilen pilli otomatik yemleyici",sourceUrl:"https://www.ferplast.com/products/chef-pro",verifiedAt:"2026-08-27"},
  {id:"ferplast-ekomixo",category:"other",brand:"Ferplast",model:"EKOMIXO",specifications:"Yaklaşık 90 ml hazneli, 10 porsiyon ayarlı pilli otomatik yemleyici",sourceUrl:"https://www.ferplast.com/products/ekomixo",verifiedAt:"2026-08-27"},
  {id:"ferplast-mixo",category:"other",brand:"Ferplast",model:"MIXO",specifications:"Yaklaşık 90 ml hazneli, 10 porsiyon ayarlı dijital otomatik yemleyici",sourceUrl:"https://www.ferplast.com/products/mixo",verifiedAt:"2026-08-27"},
  {id:"ferplast-smart-wave",category:"other",brand:"Ferplast",model:"SMART WAVE",specifications:"Uyumlu sirkülasyon pompaları için iki akış ve iki yemleme programlı kontrol cihazı",sourceUrl:"https://www.ferplast.com/products/smart-wave-eu",verifiedAt:"2026-08-27"},
  {id:"ferplast-smart-level",category:"other",brand:"Ferplast",model:"SMART LEVEL",specifications:"Tatlı ve deniz akvaryumu ile sump sistemleri için elektronik su seviyesi kontrol cihazı",sourceUrl:"https://www.ferplast.com/products/smart-level-eu",verifiedAt:"2026-08-27"},
  {id:"ferplast-flo",category:"other",brand:"Ferplast",model:"FLO",specifications:"Pompa veya filtre çıkışına takılan döner su yönlendirici",sourceUrl:"https://www.ferplast.com/products/flo-eu",verifiedAt:"2026-08-27"},
  {id:"ferplast-bioflo",category:"other",brand:"Ferplast",model:"BIOFLO",specifications:"Mevcut filtre akışıyla çalışan, bağımsız pompası olmayan pasif aerobik döner filtre · 200 litreye kadar",recommendedMaxL:200,sourceUrl:"https://www.ferplast.com/products/bioflo-medium",verifiedAt:"2026-08-27"},
  {id:"ferplast-bubble-show",category:"other",brand:"Ferplast",model:"BUBBLE SHOW",specifications:"Akvaryum içinde oksijenlenmeye ve dekoratif kabarcık akışına yardımcı aeratör",sourceUrl:"https://www.ferplast.com/products/bubble-show-eu",verifiedAt:"2026-08-27"},
  {id:"ferplast-kit-volcano-show",category:"other",brand:"Ferplast",model:"KIT BOX VOLCANO SHOW",specifications:"Volkan dekoru, düşük voltajlı LED Show ve Bubble Show aeratörlü set",sourceUrl:"https://www.ferplast.com/products/kit-box-vulcano-show-eu",verifiedAt:"2026-08-27"},
  {id:"ferplast-kit-crystal-show",category:"other",brand:"Ferplast",model:"KIT BOX CRYSTAL SHOW",specifications:"Kristal dekoru, düşük voltajlı LED Show ve Bubble Show aeratörlü set",sourceUrl:"https://www.ferplast.com/products/kit-box-crystal-show-eu",verifiedAt:"2026-08-27"},
  {id:"ferplast-kit-stump-show",category:"other",brand:"Ferplast",model:"KIT BOX STUMP SHOW",specifications:"Kütük dekoru, düşük voltajlı LED Show ve Bubble Show aeratörlü set",sourceUrl:"https://www.ferplast.com/products/kit-box-stump-show-eu",verifiedAt:"2026-08-27"},
  {id:"ferplast-slim-skim-nano",category:"other",brand:"Ferplast",model:"SLIM SKIM NANO",specifications:"Nano ve mini resif akvaryumları için iç protein skimmer · 140 litreye kadar",recommendedMaxL:140,sourceUrl:"https://www.ferplast.com/products/slim-skim-nano-eu",verifiedAt:"2026-08-27"},
  {id:"ferplast-pico-skim",category:"other",brand:"Ferplast",model:"PICO SKIM",specifications:"Yüzeydeki yağ tabakasını ve yüzen kalıntıları toplayan dalgıç skimmer · 30 litreye kadar",recommendedMaxL:30,sourceUrl:"https://www.ferplast.com/products/pico-skim-eu",verifiedAt:"2026-08-27"},
  {id:"ferplast-pico-evomag",category:"other",brand:"Ferplast",model:"PICO EVOMAG 650",specifications:"Küre mafsallı, akış yönü ve debisi ayarlanabilen sirkülasyon pompası",sourceUrl:"https://www.ferplast.com/products/pico-evomag-650-eu",verifiedAt:"2026-08-27"},
  ...([[50,50,2,120],[100,100,3,150],[200,200,4,150],[400,400,5,200]] as const).map(([model,ratedFlowLph,powerW,pressureMbar])=>({
    id:`ferplast-airfizz-${model}`,category:"air_pump" as const,brand:"Ferplast",model:`AIRFIZZ ${model}`,
    specifications:`Ayarlanabilir sessiz hava motoru · ${model<=100?`${ratedFlowLph} L/saat, tek çıkış`:`${ratedFlowLph/2} L/saat × 2 çıkış (toplam ${ratedFlowLph} L/saat)`} · ${powerW} W · ${pressureMbar} mbar`,
    ratedFlowLph,powerW,adjustableFlow:true,
    sourceUrl:"https://www.ferplast.com/products/airfizz-50",verifiedAt:"2026-08-29",
  })),
  ...([250,400,600,750,1000,1150] as const).map(model=>({
    id:`ferplast-pico-pump-${model}`,category:"other" as const,brand:"Ferplast",model:`PICO ${model}`,
    specifications:"Tatlı/deniz akvaryumu ve aquaterraryumlar için ayarlanabilir dalgıç santrifüj pompa",
    adjustableFlow:true,sourceUrl:model===600?"https://www.ferplast.com/products/pico-600-eu":model<600?"https://www.ferplast.com/products/pico-250-eu":"https://www.ferplast.com/products/pico-750-eu",verifiedAt:"2026-08-27",
  })),
  {id:"ferplast-pico-600-115",category:"other",brand:"Ferplast",model:"PICO 600.115",specifications:"Tatlı/deniz akvaryumu ve aquaterraryumlar için ayarlanabilir 115 V dalgıç santrifüj pompa",adjustableFlow:true,sourceUrl:"https://www.ferplast.com/products/pico-600-115-eu",verifiedAt:"2026-08-27"},
  ...([900,1200] as const).map(model=>({
    id:`ferplast-blupower-${model}`,category:"other" as const,brand:"Ferplast",model:`BLUPOWER ${model}`,
    specifications:"Tatlı ve deniz akvaryumları için ayarlanabilir dalgıç santrifüj pompa",
    adjustableFlow:true,sourceUrl:"https://www.ferplast.com/products/blupower-9215",verifiedAt:"2026-08-27",
  })),
  ...([700,1200,2800] as const).map(model=>({
    id:`ferplast-seltz-l-${model}`,category:"other" as const,brand:"Ferplast",model:`SELTZ L ${model}`,
    specifications:"Biyolojik ve ıslak-kuru filtrelerle su dolaşımı için ayarlanabilir çok amaçlı pompa",
    adjustableFlow:true,sourceUrl:"https://www.ferplast.com/products/seltz-l-700-eu",verifiedAt:"2026-08-27",
  })),
  ...([2000,3000,4000] as const).map(model=>({
    id:`ferplast-seltz-d-dc-${model}`,category:"other" as const,brand:"Ferplast",model:`SELTZ D DC ${model}`,
    specifications:"Elektronik kontrolcülü, su içinde veya hat üzerinde kullanılabilen çok amaçlı DC pompa",
    adjustableFlow:true,sourceUrl:"https://www.ferplast.com/products/seltz-d-2000-dc-eu",verifiedAt:"2026-08-27",
  })),
  ...([6000,9000,12000] as const).map(model=>({
    id:`ferplast-seltz-d-ac-${model}`,category:"other" as const,brand:"Ferplast",model:`SELTZ D AC ${model}`,
    specifications:"Altı kademeli elektronik kontrolcülü, kuru çalışma korumalı çok amaçlı AC pompa",
    adjustableFlow:true,sourceUrl:"https://www.ferplast.com/products/seltz-d-6000-ac-eu",verifiedAt:"2026-08-27",
  })),
  ...([900,1600,2200] as const).map(model=>({
    id:`ferplast-koralia-nano-${model}`,category:"other" as const,brand:"Ferplast",model:`KORALIA NANO ${model}`,
    specifications:"Tatlı veya deniz akvaryumları için mıknatıslı sirkülasyon/dalga pompası",
    sourceUrl:"https://www.ferplast.com/products/koralia-nano-900-eu",verifiedAt:"2026-08-27",
  })),
  ...([3200,4400,5600] as const).map(model=>({
    id:`ferplast-koralia-evo-${model}`,category:"other" as const,brand:"Ferplast",model:`KORALIA EVO ${model}`,
    specifications:"Tatlı veya deniz akvaryumları için kontrolcü uyumlu sirkülasyon/dalga pompası",
    sourceUrl:"https://www.ferplast.com/products/koralia-evo-3200-eu",verifiedAt:"2026-08-27",
  })),
  ...([5000,7000,9000] as const).map(model=>({
    id:`ferplast-koralia-g3-${model}`,category:"other" as const,brand:"Ferplast",model:`KORALIA G3 ${model}`,
    specifications:"Resif ve tatlı su akvaryumları için çift mıknatıs destekli sirkülasyon/dalga pompası",
    sourceUrl:"https://www.ferplast.com/products/koralia-g3-5000-eu",verifiedAt:"2026-08-27",
  })),
  ...(["S","M"] as const).map(model=>({
    id:`ferplast-koralia-wifi-${model.toLowerCase()}`,category:"other" as const,brand:"Ferplast",model:`KORALIA WI-FI ${model}`,
    specifications:"Uygulama ve Wi-Fi kontrollü tatlı/deniz akvaryumu sirkülasyon pompası",
    sourceUrl:"https://www.ferplast.com/products/koralia-wi-fi-s-eu",verifiedAt:"2026-08-27",
  })),
  ...([250,550] as const).map(model=>({
    id:`ferplast-bluskimmer-${model}`,category:"other" as const,brand:"Ferplast",model:`BLUSKIMMER ${model}`,
    specifications:`Dahili pompalı deniz akvaryumu protein skimmeri · ${model} litreye kadar`,recommendedMaxL:model,
    sourceUrl:"https://www.ferplast.com/products/bluskimmer-250-eu",verifiedAt:"2026-08-27",
  })),
  ...([600,800,1000] as const).flatMap(model=>([
    {id:`ferplast-e-skim-dc-${model}`,category:"other" as const,brand:"Ferplast",model:`E-SKIM DC ${model}`,specifications:"Elektronik kontrollü pompalı protein skimmer",sourceUrl:"https://www.ferplast.com/products/e-skim-600-dc-eu",verifiedAt:"2026-08-27"},
    {id:`ferplast-seltz-d-skim-dc-${model}`,category:"other" as const,brand:"Ferplast",model:`SELTZ D SKIM DC ${model}`,specifications:"Skimmerler için elektronik kontrollü iğne çarklı pompa",sourceUrl:"https://www.ferplast.com/products/seltz-d-600-skim-dc-eu",verifiedAt:"2026-08-27"},
  ])),
];

const boyuSource = "https://www.boyuaquarium.com/En_Pr_d_gci_39_id_39.html";
const boyuFilters: EquipmentProfile[] = ["EF-25","EF-35","EF-45"].map(model => ({
  id:`boyu-${model.toLowerCase()}`, category:"filter", brand:"Boyu", model,
  specifications:"Çok kademeli dış filtre · model teknik bilgisi doğrulama bekliyor",
  sourceUrl:"https://boyu.com.mx/producto/filtros-canister-boyu-serie-ef-sin-uv/", verifiedAt,
}));
boyuFilters.push(...["EFU-8000A","EFU-10000A","EFU-15000A"].map(model => ({
  id:`boyu-${model.toLowerCase()}`, category:"filter" as const, brand:"Boyu", model,
  specifications:"UV-C sistemli yüksek kapasiteli dış filtre · model teknik bilgisi doğrulama bekliyor",
  sourceUrl:boyuSource, verifiedAt,
})));
boyuFilters.push(
  {id:"boyu-ef-05",category:"filter",brand:"Boyu",model:"EF-05",specifications:"Mini dış filtre · 150 L/saat · 5,5 W",ratedFlowLph:150,powerW:5.5,recommendedMinL:30,recommendedMaxL:60,sourceUrl:"https://atakanpetshop.com/boyu-ef-05-mini-dis-filtre-5-5w-150l-h",verifiedAt},
  {id:"boyu-wf-200",category:"filter",brand:"Boyu",model:"WF-200",specifications:"Ayarlanabilir iç filtre · 370 L/saat · 5 W",ratedFlowLph:370,powerW:5,recommendedMaxL:74,adjustableFlow:true,sourceUrl:"https://atakanpetshop.com/boyu-wf-200-ic-filtre-5w-370lh",verifiedAt},
  {id:"boyu-wf-2035",category:"filter",brand:"Boyu",model:"WF-2035",specifications:"Skimmerli askı filtre · 300 L/saat · 4,6 W",ratedFlowLph:300,powerW:4.6,sourceUrl:"https://bettamarketim.com.tr/boyu-wf-2035-selale-filtre-4-6w-300l-s-su-ustu-skimmerli-filtre-emis-singerli-kartuslu-sistem-sessiz",verifiedAt},
  {id:"boyu-wf-2045",category:"filter",brand:"Boyu",model:"WF-2045",specifications:"Askı filtre · 500 L/saat · 6,5 W",ratedFlowLph:500,powerW:6.5,recommendedMinL:50,recommendedMaxL:100,sourceUrl:"https://atakanpetshop.com/boyu-wf-2045-selale-filtre-65w-500ls-wf-2045",verifiedAt},
  {id:"boyu-wf-600",category:"filter",brand:"Boyu",model:"WF-600",specifications:"Ayarlanabilir iç filtre · 650 L/saat · 9,5 W",ratedFlowLph:650,powerW:9.5,adjustableFlow:true,sourceUrl:"https://atakanpetshop.com/boyu-wf-600-ic-filtre-95w-650ls-wf-600",verifiedAt},
  {id:"boyu-dgn-460a",category:"filter",brand:"Boyu",model:"DGN-460A",specifications:"DC ayarlanabilir dış filtre · 300–1610 L/saat · 30 W",ratedFlowLph:1610,powerW:30,adjustableFlow:true,sourceUrl:"https://atakanpetshop.com/boyu-dgn-460a-dis-filtre-30w-1610ls-dgn-460a",verifiedAt},
  {id:"boyu-wf-400",category:"filter",brand:"Boyu",model:"WF-400",specifications:"İç filtre · 400 L/saat · 7 W",ratedFlowLph:400,powerW:7,sourceUrl:"https://atakanpetshop.com/boyu",verifiedAt},
  {id:"boyu-wf-2055",category:"filter",brand:"Boyu",model:"WF-2055",specifications:"Askı şelale filtre · 720 L/saat · 8,6 W",ratedFlowLph:720,powerW:8.6,sourceUrl:"https://atakanpetshop.com/boyu",verifiedAt},
  {id:"boyu-dgn-410a",category:"filter",brand:"Boyu",model:"DGN-410A",specifications:"Dış filtre · 1610 L/saat · 30 W",ratedFlowLph:1610,powerW:30,sourceUrl:"https://atakanpetshop.com/boyu",verifiedAt},
  ...["SF-100","SF-101","SF-102","SF-103","SF-104"].map(model=>({id:`boyu-${model.toLowerCase()}`,category:"filter" as const,brand:"Boyu",model,specifications:"Hava motoruyla çalışan ağırlıklı biyolojik sünger üretim filtresi",requiresAirPump:true,sourceUrl:"https://atakanpetshop.com/boyu-sf-103-uretim-filtresi-sf-103",verifiedAt})),
  ...["SF-02","SF-03"].map(model=>({id:`boyu-${model.toLowerCase()}`,category:"filter" as const,brand:"Boyu",model,specifications:"Hava motoruyla çalışan biyolojik sünger üretim filtresi",requiresAirPump:true,sourceUrl:"https://atakanpetshop.com/boyu",verifiedAt})),
);
boyuFilters.push(
  {id:"boyu-dgn-410",category:"filter",brand:"Boyu",model:"DGN-410",specifications:"Ayarlanabilir dış filtre · 300–1610 L/saat · en fazla 30 W",ratedFlowLph:1610,powerW:30,adjustableFlow:true,sourceUrl:"https://thietbibeca.com/loc-thung-boyu-dgn-410.html",verifiedAt:"2026-08-18"},
  {id:"boyu-dgn-460",category:"filter",brand:"Boyu",model:"DGN-460",specifications:"Ayarlanabilir dış filtre · 300–1610 L/saat · en fazla 30 W · 4 W UV-C",ratedFlowLph:1610,powerW:30,adjustableFlow:true,integratedUvcW:4,recommendedMinL:120,recommendedMaxL:480,sourceUrl:"https://www.shop.aqvadesign.ru/catalogue/filtry_i_nagrevateli_dlja_akvariuma/vneshnij_reguliruemyj_akvariumnyj_filtr_boyu_dgn_460_s_uv_sterilizatorom_i_napolniteljami_ot_120do_480l/",verifiedAt:"2026-08-18"},
  {id:"boyu-dgn-520",category:"filter",brand:"Boyu",model:"DGN-520",specifications:"Ayarlanabilir dış filtre · 300–1610 L/saat · en fazla 30 W · 4 W UV-C",ratedFlowLph:1610,powerW:30,adjustableFlow:true,integratedUvcW:4,recommendedMinL:100,recommendedMaxL:650,sourceUrl:"https://rozetka.com.ua/ua/boyu-dgn-520/p317101675/",verifiedAt:"2026-08-18"},
  {id:"boyu-dgn-520a",category:"filter",brand:"Boyu",model:"DGN-520A",specifications:"Ayarlanabilir dış filtre · 1610 L/saat · 30 W",ratedFlowLph:1610,powerW:30,adjustableFlow:true,sourceUrl:"https://atakanpetshop.com/boyu-dgn-520a-dis-filtre-30w-1610ls-dgn-520a",verifiedAt:"2026-08-18"},
  {id:"boyu-dgn-80",category:"filter",brand:"Boyu",model:"DGN-80",specifications:"Çok katmanlı kutu dış filtre · 800 L/saat · 35 W",ratedFlowLph:800,powerW:35,sourceUrl:"https://minipuraaqua.lk/product/boyu-dgn-80-canister-filter/",verifiedAt:"2026-08-18"},
  {id:"boyu-dgn-80a",category:"filter",brand:"Boyu",model:"DGN-80A",specifications:"UV-C'li çok katmanlı kutu dış filtre · 800 L/saat · 35 W + 7 W UV-C",ratedFlowLph:800,powerW:35,integratedUvcW:7,sourceUrl:"https://aquadelsa.com/product/dgn-80a/",verifiedAt:"2026-08-18"},
  {id:"boyu-dgn-120",category:"filter",brand:"Boyu",model:"DGN-120",specifications:"DGN serisi dört katmanlı UV donanımlı kutu dış filtre · 1200 L/saat · 55 W",ratedFlowLph:1200,powerW:55,sourceUrl:"https://www.ruparupa.com/p/boyu-filter-akuarium-120-hitam-biru.html",verifiedAt:"2026-08-24"},
  {id:"boyu-dgn-120a",category:"filter",brand:"Boyu",model:"DGN-120A",specifications:"UV-C'li çok katmanlı kutu dış filtre · 1200 L/saat · 55 W + 13 W UV-C",ratedFlowLph:1200,powerW:55,integratedUvcW:13,sourceUrl:"https://fishfixsrilanka.lk/product/boyu-dgn-120a-canister-filter/",verifiedAt:"2026-08-24"},
  ...[
    {model:"EF-10",flow:602,power:11,max:95},
    {model:"EF-15",flow:700,power:13,max:190},
    {model:"EF-20",flow:799,power:15,max:285},
  ].map(({model,flow,power,max})=>({id:`boyu-${model.toLowerCase()}`,category:"filter" as const,brand:"Boyu",model,specifications:`Çok kademeli dış filtre · ${flow} L/saat · ${power} W`,ratedFlowLph:flow,powerW:power,recommendedMaxL:max,sourceUrl:"https://jbjaquarium.com/wp-content/uploads/2019/03/EFU-253545_Manual.pdf",verifiedAt:"2026-08-18"})),
  ...[
    {model:"EFU-10",flow:300,power:11,min:100,max:300,uv:5},
    {model:"EFU-15",flow:350,power:13,min:150,max:350,uv:5},
    {model:"EFU-20",flow:400,power:15,min:200,max:400,uv:5},
    {model:"EFU-25",flow:750,power:22,min:250,max:450,uv:5},
    {model:"EFU-35",flow:950,power:24,min:350,max:550,uv:6},
    {model:"EFU-45",flow:1100,power:26,min:450,max:650,uv:7},
  ].map(({model,flow,power,min,max,uv})=>({id:`boyu-${model.toLowerCase()}`,category:"filter" as const,brand:"Boyu",model,specifications:`UV-C sistemli dış filtre · ${flow} L/saat · ${power} W · ${uv} W UV-C`,ratedFlowLph:flow,powerW:power,recommendedMinL:min,recommendedMaxL:max,integratedUvcW:uv,sourceUrl:"https://ondaaquarios.com.br/catalgos/boyu/CATALOGO%20BOYU%20GRUPO%20ONDA%20V1.26.pdf",verifiedAt:"2026-08-18"})),
  ...["FEF-230","FEF-230A"].map(model=>({id:`boyu-${model.toLowerCase()}`,category:"filter" as const,brand:"Boyu",model,specifications:"Dış filtre · 800 L/saat · 15 W · 100–300 litre",ratedFlowLph:800,powerW:15,recommendedMinL:100,recommendedMaxL:300,sourceUrl:"https://ondaaquarios.com.br/catalgos/boyu/CATALOGO%20BOYU%20GRUPO%20ONDA%20V1.26.pdf",verifiedAt:"2026-08-18"})),
  ...["FEF-280","FEF-280A"].map(model=>({id:`boyu-${model.toLowerCase()}`,category:"filter" as const,brand:"Boyu",model,specifications:"Dış filtre · 1000 L/saat · 18 W · 150–400 litre",ratedFlowLph:1000,powerW:18,recommendedMinL:150,recommendedMaxL:400,sourceUrl:"https://ondaaquarios.com.br/catalgos/boyu/CATALOGO%20BOYU%20GRUPO%20ONDA%20V1.26.pdf",verifiedAt:"2026-08-18"})),
  ...[
    {model:"SP-601E",flow:150},{model:"SP-602E",flow:340},{model:"SP-603E",flow:400},{model:"SP-604E",flow:750},
    {model:"SP-601F",flow:150},{model:"SP-602F",flow:340},{model:"SP-800F",flow:300},{model:"SP-1800B",flow:700},
  ].map(({model,flow})=>({id:`boyu-${model.toLowerCase()}`,category:"filter" as const,brand:"Boyu",model,specifications:`Dalgıç iç filtre · ${flow} L/saat`,ratedFlowLph:flow,sourceUrl:"https://www.sanisvet.es/photos/PECES-SURTROPIC.pdf",verifiedAt:"2026-08-18"})),
  {id:"boyu-sp-1000c",category:"filter",brand:"Boyu",model:"SP-1000C",specifications:"Dalgıç iç filtre · 300 L/saat",ratedFlowLph:300,sourceUrl:"https://www.sanisvet.es/photos/PECES-SURTROPIC.pdf",verifiedAt:"2026-08-18"},
  {id:"boyu-sp-1300c",category:"filter",brand:"Boyu",model:"SP-1300C",specifications:"SP serisi dalgıç iç filtre · yayımlanmış teknik tablo bulunamadı",sourceUrl:"https://www.boyuaquarium.com/En_Pr_index_gci_27.html",verifiedAt:"2026-08-18"},
  {id:"boyu-sp-2300b",category:"filter",brand:"Boyu",model:"SP-2300B",specifications:"Dalgıç iç filtre · 1200 L/saat · 28 W · 300–450 litre",ratedFlowLph:1200,powerW:28,recommendedMinL:300,recommendedMaxL:450,sourceUrl:"https://ideasmarinas.com/archivo/catalogos/BOYU/catalogo_boyu.pdf",verifiedAt:"2026-08-18"},
  {id:"boyu-sp-2500b",category:"filter",brand:"Boyu",model:"SP-2500B",specifications:"Dalgıç iç filtre · 1400 L/saat · 32 W · 350–500 litre",ratedFlowLph:1400,powerW:32,recommendedMinL:350,recommendedMaxL:500,sourceUrl:"https://ideasmarinas.com/archivo/catalogos/BOYU/catalogo_boyu.pdf",verifiedAt:"2026-08-18"},
  {id:"boyu-wf-2015",category:"filter",brand:"Boyu",model:"WF-2015",specifications:"Askı şelale filtre · 150 L/saat · 6 W",ratedFlowLph:150,powerW:6,adjustableFlow:true,sourceUrl:"https://boyu.com.mx/producto/filtros-de-cascada-boyu-wf-compactos/",verifiedAt:"2026-08-18"},
  {id:"boyu-wf-2025",category:"filter",brand:"Boyu",model:"WF-2025",specifications:"Askı şelale filtre · 300 L/saat · 11 W",ratedFlowLph:300,powerW:11,adjustableFlow:true,sourceUrl:"https://boyu.com.mx/producto/filtros-de-cascada-boyu-wf-compactos/",verifiedAt:"2026-08-18"},
);
const boyuAirAndCo2:EquipmentProfile[]=[
  {id:"boyu-acq-009",category:"air_pump",brand:"Boyu",model:"ACQ-009",specifications:"Elektromanyetik hava kompresörü · 160 L/dakika · 105 W",ratedFlowLph:9600,powerW:105,sourceUrl:"https://www.toolsvilla.com/air-pump-power-f-ul-motor",verifiedAt},
  {id:"boyu-electromagnetic-110",category:"air_pump",brand:"Boyu",model:"Electro Magnetic 110 L/min",specifications:"ACQ-008 elektromanyetik hava kompresörü · 110 L/dakika · 100 W",ratedFlowLph:6600,powerW:100,sourceUrl:"https://atakanpetshop.com/boyu-electro-magnetic-hava-kompresoru-100w-110l-min",verifiedAt},
  {id:"boyu-cjy-1000",category:"air_pump",brand:"Boyu",model:"CJY-1000",specifications:"Tek çıkışlı hava motoru · 1 L/dakika · 1,7 W",ratedFlowLph:60,powerW:1.7,sourceUrl:"https://www.akvaryumexpress.com/boyu/sayfa/4",verifiedAt:"2026-08-25"},
  {id:"boyu-cjy-1500",category:"air_pump",brand:"Boyu",model:"CJY-1500",specifications:"Tek çıkışlı hava motoru · 1,5 L/dakika · 2,2 W",ratedFlowLph:90,powerW:2.2,sourceUrl:"https://www.akvaryumexpress.com/cjy-1500-boyu-tek-cikisli-hava-motoru-15l-min-22-w",verifiedAt:"2026-08-25"},
  {id:"boyu-ses-10",category:"air_pump",brand:"Boyu",model:"SES-10",specifications:"Üretim tipi hava kompresörü · 10 L/dakika (600 L/saat) · 10 W · 0,02 MPa",ratedFlowLph:600,powerW:10,sourceUrl:"https://www.akvaryumexpress.com/ses-10-boyu-hava-kompresoru-10w",verifiedAt:"2026-08-26"},
  {id:"boyu-ses-20",category:"air_pump",brand:"Boyu",model:"SES-20",specifications:"Üretim tipi hava motoru · 20 L/dakika · 15 W",ratedFlowLph:1200,powerW:15,sourceUrl:"https://www.akvaryumexpress.com/akvaryum-motorlari/sayfa/6",verifiedAt:"2026-08-25"},
  {id:"boyu-ses-30",category:"air_pump",brand:"Boyu",model:"SES-30",specifications:"Üretim tipi hava motoru · 30 L/dakika · 25 W",ratedFlowLph:1800,powerW:25,sourceUrl:"https://www.akvaryumexpress.com/yeni-urunler/sayfa/62",verifiedAt:"2026-08-25"},
  {id:"boyu-ses-60",category:"air_pump",brand:"Boyu",model:"SES-60",specifications:"Üretim tipi hava motoru · 60 L/dakika · 35 W",ratedFlowLph:3600,powerW:35,sourceUrl:"https://www.akvaryumexpress.com/akvaryum-motorlari/sayfa/6",verifiedAt:"2026-08-25"},
  {id:"boyu-xfp-1000",category:"other",brand:"Boyu",model:"XFP-1000",specifications:"Sump/devirdaim pompası · 1000 L/saat · 15 W · 1,45 m basma yüksekliği · 12 mm çıkış",ratedFlowLph:1000,powerW:15,sourceUrl:"https://www.akvaryumexpress.com/xfp-1000-boyu-sump-motoru-15w-1000l-h",verifiedAt:"2026-08-25"},
  {id:"boyu-xfp-1500",category:"other",brand:"Boyu",model:"XFP-1500",specifications:"Sump/devirdaim pompası · 1500 L/saat · 23 W",ratedFlowLph:1500,powerW:23,sourceUrl:"https://www.akvaryumexpress.com/boyu/sayfa/4",verifiedAt:"2026-08-25"},
  ...["CO-100","CO-150","CO-170"].map(model=>({id:`boyu-${model.toLowerCase()}`,category:"co2" as const,brand:"Boyu",model,specifications:"Bitkili akvaryum için cam CO₂ difüzörü",sourceUrl:"https://atakanpetshop.com/boyu",verifiedAt})),
];
boyuAirAndCo2.push(
  ...([50,100,150,200,250,300] as const).map(powerW=>({id:`boyu-ht-6${powerW}`,category:"heater" as const,brand:"Boyu",model:`HT-6${powerW}`,specifications:`Termostatlı dalgıç ısıtıcı · ${powerW} W`,powerW,sourceUrl:"https://www.boyuaquarium.com/En_Pr_index_gci_57.html",verifiedAt:"2026-08-18"})),
  ...([50,100,150,200,250,300] as const).map(powerW=>({id:`boyu-dr-${powerW}`,category:"heater" as const,brand:"Boyu",model:`DR-${powerW}`,specifications:`Ayarlanabilir cam akvaryum ısıtıcısı · ${powerW} W`,powerW,sourceUrl:"https://www.boyuaquarium.com/En_Pr_index_gci_57.html",verifiedAt:"2026-08-18"})),
  ...([100,150,200,250,300] as const).map(powerW=>({id:`boyu-tr-${powerW}a`,category:"heater" as const,brand:"Boyu",model:`TR-${powerW}A`,specifications:`Titanyum akvaryum ısıtıcısı · ${powerW} W`,powerW,sourceUrl:"https://www.boyuaquarium.com/En_Pr_index_gci_57.html",verifiedAt:"2026-08-18"})),
  ...([100,150,200,250,300] as const).map(powerW=>({id:`boyu-gr-${powerW}`,category:"heater" as const,brand:"Boyu",model:`GR-${powerW}`,specifications:`Termostatlı akvaryum ısıtıcısı · ${powerW} W`,powerW,sourceUrl:"https://www.boyuaquarium.com/En_Pr_index_gci_57.html",verifiedAt:"2026-08-18"})),
);
const boyuEfVerified:Record<string,Partial<EquipmentProfile>>={
  "EF-25":{specifications:"Çok kademeli dış filtre · 750 L/saat · 22 W · 250–450 litre",ratedFlowLph:750,powerW:22,recommendedMinL:250,recommendedMaxL:450,sourceUrl:"https://ideasmarinas.com/archivo/fichas/BOYU/Filtracion/filtros_canister_ef-efu_25-35-45_ft.pdf"},
  "EF-35":{specifications:"Çok kademeli dış filtre · 950 L/saat · 24 W · 350–550 litre",ratedFlowLph:950,powerW:24,recommendedMinL:350,recommendedMaxL:550,sourceUrl:"https://ideasmarinas.com/archivo/fichas/BOYU/Filtracion/filtros_canister_ef-efu_25-35-45_ft.pdf"},
  "EF-45":{specifications:"Çok kademeli dış filtre · 1100 L/saat · 26 W · 450–650 litre",ratedFlowLph:1100,powerW:26,recommendedMinL:450,recommendedMaxL:650,sourceUrl:"https://ideasmarinas.com/archivo/fichas/BOYU/Filtracion/filtros_canister_ef-efu_25-35-45_ft.pdf"},
  "EFU-10000A":{specifications:"Pompası ayrıca kullanılan basınçlı havuz filtresi · 18 W UV-C · 1000–5000 litre",integratedUvcW:18,recommendedMinL:1000,recommendedMaxL:5000,sourceUrl:"https://ideasmarinas.com/archivo/manuales/BOYU/Filtracion/PDF/filtros_estanque_efu-10000a-15000a_mi.pdf"},
  "EFU-15000A":{specifications:"Pompası ayrıca kullanılan basınçlı havuz filtresi · 24 W UV-C · 2000–10000 litre",integratedUvcW:24,recommendedMinL:2000,recommendedMaxL:10000,sourceUrl:"https://ideasmarinas.com/archivo/manuales/BOYU/Filtracion/PDF/filtros_estanque_efu-10000a-15000a_mi.pdf"},
  "EFU-8000A":{specifications:"Pompası ayrıca kullanılan basınçlı havuz filtresi · 11 W UV-C · 5000–8000 litre",integratedUvcW:11,recommendedMinL:5000,recommendedMaxL:8000,sourceUrl:"https://isuruaqua.com/shop/?filter_category=air-pumps%2Cjpd%2Cwater-pumps%2Cfeeders%2Cjtp-pumps%2Cwater-treatment-medicine%2Cpower-filters%2Cuv-filters%2Cnt-labs&per_page=24&stock_status=onsale"},
};
for(const item of boyuFilters){Object.assign(item,boyuEfVerified[item.model]??{});}

const xinyouSource = "https://www.csl-fish.com.my/XINYOU";
const xinyouFilters: EquipmentProfile[] = [
  ["XY-168",30], ["XY-2835",40], ["XY-180",50], ["XY-2836",80], ["XY-2810",100],
  ["XY-2901",120], ["XY-280",100], ["XY-380",200], ["XY-2811",220], ["XY-2902",220],
  ["XY-2812",250], ["XY-2813",380],
].map(([model,maxL]) => ({
  id:`xinyou-${String(model).toLowerCase()}`, category:"filter", brand:"Xinyou", model:String(model),
  specifications:`Hava ile çalışan biyolojik sünger filtre · ${maxL} litreye kadar`, recommendedMaxL:Number(maxL), requiresAirPump:true,
  sourceUrl:xinyouSource, verifiedAt,
}));
xinyouFilters.push({
  id:"xinyou-xy-2010",
  category:"filter",
  brand:"Xinyou",
  model:"XY-2010",
  specifications:"İki katlı, filtre malzemeli köşe üretim filtresi · motorsuzdur ve hava motoruyla çalışır · 7,5 × 10,5 × 27,5 cm",
  requiresAirPump:true,
  sourceUrl:"https://www.akvaryumexpress.com/xy-2010-plastik-kose-ic-filtre-ici-dolu",
  verifiedAt:"2026-08-25",
});

const adaFilterSource = "https://www.adana.co.jp/jp/contents/products/na_filter/detail01.html";
const adaFilters: EquipmentProfile[] = [
  ["ES-150 Ver.2",210,3,30,45], ["ES-300 Ver.2",360,6,45,60], ["ES-600",360,16,60,60],
  ["ES-900",720,15,90,90], ["ES-1200",1140,31,120,120], ["ES-2400",1860,50,150,180],
].map(([model,flow,power,minLength,maxLength]) => ({
  id:`ada-super-jet-${String(model).toLowerCase().replace(/[^a-z0-9]+/g,"-")}`, category:"filter", brand:"ADA",
  model:`Super Jet Filter ${model}`, specifications:`Paslanmaz çelik dış filtre · ${flow} L/saat · ${power} W (60 Hz)`,
  ratedFlowLph:Number(flow), powerW:Number(power), recommendedTankLengthCm:[Number(minLength),Number(maxLength)] as [number,number],
  sourceUrl:adaFilterSource, verifiedAt,
}));

const adaCo2Source = "https://www.adana.co.jp/en/contents/products/na_co2/detail04.html";
const adaCo2: EquipmentProfile[] = [
  { id:"ada-co2-advanced-forest", category:"co2", brand:"ADA", model:"CO₂ Advanced System – Forest", specifications:"60 cm ve daha küçük akvaryumlar için kartuşlu tam CO₂ seti" },
  { id:"ada-co2-system-74-ya-v2", category:"co2", brand:"ADA", model:"CO₂ System 74-YA/Ver.2", specifications:"Küçük kartuş tipi CO₂ regülatörü" },
  { id:"ada-co2-system-74-sa", category:"co2", brand:"ADA", model:"CO₂ System 74-SA", specifications:"0–0,35 MPa ayarlanabilir yüksek sınıf kartuş regülatörü" },
  { id:"ada-co2-system-74-da", category:"co2", brand:"ADA", model:"CO₂ System 74-DA", specifications:"Sabit 0,3 MPa çıkışlı kartuş CO₂ sistemi" },
].map((item): EquipmentProfile => ({ ...item, category:"co2", sourceUrl:adaCo2Source, verifiedAt }));

const adaCurrentVerifiedAt = "2026-08-27";
const adaLightingSource = "https://www.adana.co.jp/en/contents/products/na_lighting/detail04.html";
const adaSolarRgbSource = "https://www.adana.co.jp/en/contents/products/na_lighting/detail05.html";
const adaPollenGlassSource = "https://www.adana.co.jp/en/contents/products/na_co2/detail01.html";
const adaCounterSource = "https://www.adana.co.jp/en/contents/products/na_co2/detail02.html";
const adaJointGlassSource = "https://www.adana.co.jp/en/contents/products/na_co2/detail03.html";
const adaLargeCo2Source = "https://www.adana.co.jp/en/contents/products/na_co2/detail05.html";
const adaControlSource = "https://www.adana.co.jp/en/contents/products/na_co2/detail06.html";
const adaVuppaSource = "https://www.adana.co.jp/en/contents/products/na_filter/detail02.html";
const adaScissorsSource = "https://www.adana.co.jp/en/contents/products/na_layout/detail01.html";
const adaPinsettesSource = "https://www.adana.co.jp/en/contents/products/na_layout/detail02.html";
const adaMaintenanceSource = "https://www.adana.co.jp/en/contents/products/na_layout/detail03.html";

const adaCurrentEquipment: EquipmentProfile[] = [
  {id:"ada-na-light-300",category:"lighting",brand:"ADA",model:"NA LIGHT 300",specifications:"Üç kademeli ayarlanabilir RGB LED · 20 W ±%10 tüketim · yaklaşık 24.000 lx · 9.000–12.000 K · 30 cm akvaryum",powerW:20,recommendedTankLengthCm:[30,30],sourceUrl:adaLightingSource,verifiedAt:adaCurrentVerifiedAt},
  {id:"ada-na-light-450",category:"lighting",brand:"ADA",model:"NA LIGHT 450",specifications:"Üç kademeli ayarlanabilir RGB LED · 30 W ±%10 tüketim · yaklaşık 25.000 lx · 9.000–12.000 K · 45 cm akvaryum",powerW:30,recommendedTankLengthCm:[45,45],sourceUrl:adaLightingSource,verifiedAt:adaCurrentVerifiedAt},
  {id:"ada-na-light-pro-600",category:"lighting",brand:"ADA",model:"NA LIGHT PRO 600",specifications:"Uygulama kontrollü RGB LED · 0–66 W tüketim · 0–40.000 lx · yaklaşık 8.000–11.000 K · 60 cm akvaryum",powerW:66,recommendedTankLengthCm:[60,60],sourceUrl:adaLightingSource,verifiedAt:adaCurrentVerifiedAt},
  {id:"ada-solar-rgb-ii",category:"lighting",brand:"ADA",model:"SOLAR RGB II",specifications:"Uygulama kontrollü 170 RGB LED · 135 W ±%10 tüketim · yaklaşık 31.000 lx · 9.000–12.000 K · tek ünite 90 cm genişliğe kadar",powerW:135,sourceUrl:adaSolarRgbSource,verifiedAt:adaCurrentVerifiedAt},

  {id:"ada-co2-forest-bottle",category:"co2",brand:"ADA",model:"CO₂ Forest Bottle",specifications:"CO₂ System 74 serisi için yedek küçük basınçlı CO₂ kartuşu",sourceUrl:adaCo2Source,verifiedAt:adaCurrentVerifiedAt},
  {id:"ada-clear-stand-system-74",category:"co2",brand:"ADA",model:"Clear Stand for CO₂ System 74",specifications:"6 mm veya daha ince çerçevesiz akvaryum camına takılan şeffaf kartuş standı",sourceUrl:adaCo2Source,verifiedAt:adaCurrentVerifiedAt},

  {id:"ada-pollen-glass-co2",category:"co2",brand:"ADA",model:"Pollen Glass for CO₂",specifications:"60 cm akvaryumlar için temel cam CO₂ difüzörü",recommendedTankLengthCm:[60,60],sourceUrl:adaPollenGlassSource,verifiedAt:adaCurrentVerifiedAt},
  {id:"ada-pollen-glass-type-2",category:"co2",brand:"ADA",model:"Pollen Glass TYPE-2",specifications:"Yükseltilmiş difüzyon yüzeyli, temel modelle aynı performansta cam CO₂ difüzörü",sourceUrl:adaPollenGlassSource,verifiedAt:adaCurrentVerifiedAt},
  {id:"ada-pollen-glass-type-3",category:"co2",brand:"ADA",model:"Pollen Glass TYPE-3",specifications:"Dikey hortum bağlantılı cam CO₂ difüzörü",sourceUrl:adaPollenGlassSource,verifiedAt:adaCurrentVerifiedAt},
  {id:"ada-pollen-glass-mini",category:"co2",brand:"ADA",model:"Pollen Glass Mini",specifications:"5 mm'den ince camlı küçük akvaryumlar için askılı cam CO₂ difüzörü",sourceUrl:adaPollenGlassSource,verifiedAt:adaCurrentVerifiedAt},
  {id:"ada-pollen-glass-large-20-co2",category:"co2",brand:"ADA",model:"Pollen Glass Large 20Ø for CO₂",specifications:"60 cm yoğun bitkili akvaryumlar için geniş yüzeyli cam CO₂ difüzörü",recommendedTankLengthCm:[60,60],sourceUrl:adaPollenGlassSource,verifiedAt:adaCurrentVerifiedAt},
  {id:"ada-pollen-glass-large-30-co2",category:"co2",brand:"ADA",model:"Pollen Glass Large 30Ø for CO₂",specifications:"75–90 cm akvaryumlar için geniş yüzeyli cam CO₂ difüzörü",recommendedTankLengthCm:[75,90],sourceUrl:adaPollenGlassSource,verifiedAt:adaCurrentVerifiedAt},
  {id:"ada-pollen-glass-beetle-30-co2",category:"co2",brand:"ADA",model:"Pollen Glass Beetle 30Ø for CO₂",specifications:"90 cm akvaryumlar için köşeye takılan cam CO₂ difüzörü",recommendedTankLengthCm:[90,90],sourceUrl:adaPollenGlassSource,verifiedAt:adaCurrentVerifiedAt},
  {id:"ada-pollen-glass-beetle-40-co2",category:"co2",brand:"ADA",model:"Pollen Glass Beetle 40Ø for CO₂",specifications:"90–120 cm akvaryumlar için köşeye takılan cam CO₂ difüzörü",recommendedTankLengthCm:[90,120],sourceUrl:adaPollenGlassSource,verifiedAt:adaCurrentVerifiedAt},
  {id:"ada-pollen-glass-beetle-50-co2",category:"co2",brand:"ADA",model:"Pollen Glass Beetle 50Ø for CO₂",specifications:"120–180 cm akvaryumlar için köşeye takılan cam CO₂ difüzörü",recommendedTankLengthCm:[120,180],sourceUrl:adaPollenGlassSource,verifiedAt:adaCurrentVerifiedAt},

  {id:"ada-pollen-glass-air",category:"other",brand:"ADA",model:"Pollen Glass for AIR",specifications:"60 cm akvaryumlarda hava motoruyla kullanılan cam hava difüzörü",requiresAirPump:true,recommendedTankLengthCm:[60,60],sourceUrl:adaPollenGlassSource,verifiedAt:adaCurrentVerifiedAt},
  {id:"ada-pollen-glass-large-20-air",category:"other",brand:"ADA",model:"Pollen Glass Large 20Ø for AIR",specifications:"60 cm akvaryumlarda hava motoruyla kullanılan geniş yüzeyli cam hava difüzörü",requiresAirPump:true,recommendedTankLengthCm:[60,60],sourceUrl:adaPollenGlassSource,verifiedAt:adaCurrentVerifiedAt},
  {id:"ada-pollen-glass-large-30-air",category:"other",brand:"ADA",model:"Pollen Glass Large 30Ø for AIR",specifications:"75–90 cm akvaryumlarda hava motoruyla kullanılan geniş yüzeyli cam hava difüzörü",requiresAirPump:true,recommendedTankLengthCm:[75,90],sourceUrl:adaPollenGlassSource,verifiedAt:adaCurrentVerifiedAt},
  {id:"ada-pollen-glass-beetle-30-air",category:"other",brand:"ADA",model:"Pollen Glass Beetle 30Ø for AIR",specifications:"90 cm akvaryumlarda hava motoruyla kullanılan köşe tipi cam hava difüzörü",requiresAirPump:true,recommendedTankLengthCm:[90,90],sourceUrl:adaPollenGlassSource,verifiedAt:adaCurrentVerifiedAt},
  {id:"ada-pollen-glass-beetle-40-air",category:"other",brand:"ADA",model:"Pollen Glass Beetle 40Ø for AIR",specifications:"90–120 cm akvaryumlarda hava motoruyla kullanılan köşe tipi cam hava difüzörü",requiresAirPump:true,recommendedTankLengthCm:[90,120],sourceUrl:adaPollenGlassSource,verifiedAt:adaCurrentVerifiedAt},
  {id:"ada-pollen-glass-beetle-50-air",category:"other",brand:"ADA",model:"Pollen Glass Beetle 50Ø for AIR",specifications:"120–180 cm akvaryumlarda hava motoruyla kullanılan köşe tipi cam hava difüzörü",requiresAirPump:true,recommendedTankLengthCm:[120,180],sourceUrl:adaPollenGlassSource,verifiedAt:adaCurrentVerifiedAt},

  {id:"ada-co2-glass-counter",category:"co2",brand:"ADA",model:"CO₂ Glass Counter",specifications:"CO₂ besleme miktarını kabarcık sayısıyla izleyen cam sayaç",sourceUrl:adaCounterSource,verifiedAt:adaCurrentVerifiedAt},
  {id:"ada-co2-twist-counter",category:"co2",brand:"ADA",model:"CO₂ Twist Counter",specifications:"Pollen Glass Large ve Beetle için 15 × 170 mm spiral kabarcık sayacı",sourceUrl:adaCounterSource,verifiedAt:adaCurrentVerifiedAt},
  {id:"ada-co2-beetle-counter",category:"co2",brand:"ADA",model:"CO₂ Beetle Counter",specifications:"Büyük akvaryumlarda yüksek CO₂ beslemesini izleyen spiral cam kabarcık sayacı",sourceUrl:adaCounterSource,verifiedAt:adaCurrentVerifiedAt},
  {id:"ada-count-diffuser",category:"co2",brand:"ADA",model:"Count Diffuser",specifications:"45–60 cm akvaryumlar için kabarcık sayacı entegre cam CO₂ difüzörü",recommendedTankLengthCm:[45,60],sourceUrl:adaCounterSource,verifiedAt:adaCurrentVerifiedAt},
  {id:"ada-co2-check-valve",category:"co2",brand:"ADA",model:"CO₂ Check Valve",specifications:"Suyun CO₂ regülatörüne geri akmasını önleyen, yaklaşık yılda bir yenilenen valf",sourceUrl:adaCounterSource,verifiedAt:adaCurrentVerifiedAt},
  {id:"ada-cabochon-ruby",category:"co2",brand:"ADA",model:"Cabochon Ruby",specifications:"Doğal mineral bilyeli dayanıklı ve dekoratif cam geri akış önleyici",sourceUrl:adaCounterSource,verifiedAt:adaCurrentVerifiedAt},
  {id:"ada-co2-mini-counter",category:"co2",brand:"ADA",model:"CO₂ Mini Counter",specifications:"45 cm ve daha küçük akvaryumlar için kompakt cam kabarcık sayacı",sourceUrl:"https://www.adana.co.jp/jp/contents/products/na_co2/detail02.html",verifiedAt:adaCurrentVerifiedAt},

  ...(["JG-001","JG-002","JG-003","JG-004","JG-007","JG-008"] as const).map((model):EquipmentProfile=>({
    id:`ada-joint-glass-${model.toLowerCase()}`,category:"co2",brand:"ADA",model:`Joint Glass ${model}`,
    specifications:`Akvaryum kenarında silikon hortumun bükülmesini önleyen cam bağlantı parçası · ${model}`,
    sourceUrl:adaJointGlassSource,verifiedAt:adaCurrentVerifiedAt,
  })),
  {id:"ada-co2-tower",category:"co2",brand:"ADA",model:"CO₂ Tower",specifications:"18 küçük kartuşa eşdeğer kapasiteli, 50 cm uzunluğunda yeniden doldurulabilir CO₂ tüpü ve paslanmaz koruyucu gövde",sourceUrl:adaLargeCo2Source,verifiedAt:adaCurrentVerifiedAt},
  {id:"ada-co2-attache-regulator",category:"co2",brand:"ADA",model:"CO₂ Attache Regulator",specifications:"Yeniden doldurulabilir tüpler için sabit 0,30 MPa çıkışlı regülatör",sourceUrl:adaLargeCo2Source,verifiedAt:adaCurrentVerifiedAt},
  {id:"ada-co2-speed-regulator",category:"co2",brand:"ADA",model:"CO₂ Speed Regulator",specifications:"Yeniden doldurulabilir tüpler için 0–0,35 MPa ayarlanabilir çıkışlı dağıtım uyumlu regülatör",sourceUrl:adaLargeCo2Source,verifiedAt:adaCurrentVerifiedAt},
  {id:"ada-co2-adapter",category:"co2",brand:"ADA",model:"CO₂ Adapter",specifications:"System 74-YA/Ver.2 ve 74-SA regülatörlerini yeniden doldurulabilir tüpe bağlayan adaptör",sourceUrl:adaLargeCo2Source,verifiedAt:adaCurrentVerifiedAt},
  {id:"ada-na-control-timer-ii",category:"co2",brand:"ADA",model:"NA Control Timer II",specifications:"Aydınlatma, CO₂ solenoidi ve havalandırmayı zamanlayan kontrol ünitesi · iki Solar RGB veya bir Solar I/Grand Solar ile uyumlu",sourceUrl:adaControlSource,verifiedAt:adaCurrentVerifiedAt},
  {id:"ada-el-valve",category:"co2",brand:"ADA",model:"EL Valve",specifications:"ADA regülatörleri için AC100 V 50/60 Hz elektromanyetik CO₂ kapatma valfi",sourceUrl:adaControlSource,verifiedAt:adaCurrentVerifiedAt},

  {id:"ada-vuppa-ii",category:"other",brand:"ADA",model:"VUPPA-II",specifications:"Şamandıra kontrollü paslanmaz su yüzeyi emici · 5 V / 1 A USB besleme · debi yayımlanmamıştır; bağımsız ana filtre kapasitesi sayılmaz",sourceUrl:adaVuppaSource,verifiedAt:adaCurrentVerifiedAt},

  ...([
    ["Pro-Scissors Spring Straight",160],["Pro-Scissors Spring Curve",160],
    ["Pro-Scissors Short Straight",170],["Pro-Scissors Short Curve",170],
    ["Pro-Scissors Wave",200],["Pro-Scissors S Straight",255],["Pro-Scissors S Curve",255],
    ["Pro-Scissors M",305],["Pro-Scissors L",355],["Pro-Scissors Nude",320],
  ] as const).map(([model,lengthMm]):EquipmentProfile=>({
    id:`ada-${model.toLowerCase().replace(/[^a-z0-9]+/g,"-")}`,category:"other",brand:"ADA",model,
    specifications:`Paslanmaz profesyonel akvaryum bitkisi budama makası · ${lengthMm} mm`,
    sourceUrl:adaScissorsSource,verifiedAt:adaCurrentVerifiedAt,
  })),
  ...([
    ["Pinsettes Series S",160],["Pinsettes Series M",210],["Pinsettes Series L",270],["Pinsettes Series XL",300],
    ["Pro-Pinsettes Grip S",210],["Pro-Pinsettes Grip M",260],["Pro-Pinsettes Grip L",310],
  ] as const).map(([model,lengthMm]):EquipmentProfile=>({
    id:`ada-${model.toLowerCase().replace(/[^a-z0-9]+/g,"-")}`,category:"other",brand:"ADA",model,
    specifications:`Profesyonel akvaryum bitkisi dikim cımbızı · ${lengthMm} mm`,
    sourceUrl:adaPinsettesSource,verifiedAt:adaCurrentVerifiedAt,
  })),
  ...([
    ["Soil Scraper 30","Taban ile cam arasındaki mavi-yeşil alg ve kalıntıları sifonlayarak temizleyen kazıyıcı"],
    ["Pro-Brush Hard","Kaya ve köklerdeki dirençli algler için metal kıllı sert bakım fırçası"],
    ["Pro-Brush","Kaya ve diğer dekorlardaki algleri temizleyen aşındırıcı bakım fırçası"],
    ["Bottom Release","Taban gübresini derine yerleştirmek için 375 mm özel uygulama aracı"],
    ["Pro Razor Mini","Küçük ve dar akvaryum alanları için 260 mm cam alg kazıyıcı"],
    ["Pro Razor","Akvaryum camındaki algleri temizleyen 400 mm profesyonel kazıyıcı"],
    ["Pro Razor Extender","Pro Razor sapını uzatan 410 mm ek parça"],
    ["Sand Flattener","Taban yüzeyini düzeltmek için çift uçlu 270 mm araç"],
    ["Pro Picker","Kaya ve köklerin dar bölgelerindeki algleri kazıyan 175 mm araç"],
  ] as const).map(([model,specifications]):EquipmentProfile=>({
    id:`ada-${model.toLowerCase().replace(/[^a-z0-9]+/g,"-")}`,category:"other",brand:"ADA",model,specifications,
    sourceUrl:adaMaintenanceSource,verifiedAt:adaCurrentVerifiedAt,
  })),
];

const jenecaSource = "https://www.aleas.cn/product/20/";
const jenecaFilters: EquipmentProfile[] = ["IPF-010","IPF-020","XP-01B","XP-01C","XP-33","XP-36","GD-16","GD-17","GD-18","GD-19","YL-1","YL-3","YL-5","YL-7"].map(model => ({
  id:`jeneca-${model.toLowerCase()}`, category:"filter", brand:"Jeneca", model,
  specifications:"Akvaryum filtresi · model teknik bilgisi doğrulama bekliyor", sourceUrl:jenecaSource, verifiedAt,
}));
for(const item of jenecaFilters.filter(item=>["YL-1","YL-3","YL-5","YL-7"].includes(item.model))){item.specifications="Ayarlanabilir fanus tipi şelale filtre · 300 L/saat · 4 W";item.ratedFlowLph=300;item.powerW=4;item.adjustableFlow=true;item.sourceUrl=item.model==="YL-1"?"https://atakanpetshop.com/jeneca-yl-1-fanus-tipi-selale-filtre-4w-300lh-6948344912532":"https://atakanpetshop.com/jeneca-yl-7-fanus-tipi-selale-filtre-4w-300lh-6948344912563";}
const jenecaVerified:Record<string,Partial<EquipmentProfile>>={
  "IPF-010":{specifications:"İç filtre · 500 L/saat · 8 W · 100 litreye kadar",ratedFlowLph:500,powerW:8,recommendedMaxL:100,sourceUrl:"https://allegro.pl/oferta/jeneca-ipf-010-wydajny-filtr-wewnetrzny-deszczownica-500l-h-8w-do-akwarium-16603976410"},
  "IPF-020":{specifications:"İç filtre · 1000 L/saat · 15 W · 200 litreye kadar",ratedFlowLph:1000,powerW:15,recommendedMaxL:200,sourceUrl:"https://zoo-aquos.pl/pl/c/Filtry-Wewnetrzne-Akwarystyczne/131/5"},
  "XP-01B":{specifications:"Düşük su seviyesi filtresi · 850 L/saat · 7,5 W",ratedFlowLph:850,powerW:7.5,sourceUrl:"https://www.aleas.cn/product/698.html"},
  "XP-01C":{specifications:"Düşük su seviyesi filtresi · 1000 L/saat · 8 W",ratedFlowLph:1000,powerW:8,sourceUrl:"https://www.aleas.cn/product/698.html"},
  "XP-33":{specifications:"Ayarlanabilir skimmerli askı filtre · 1000 L/saat · 10 W · 200 litreye kadar",ratedFlowLph:1000,powerW:10,recommendedMaxL:200,adjustableFlow:true,sourceUrl:"https://www.mercadolivre.com.br/filtro-externo-hang-on-jeneca-xp-33-1000lh-aquario-ate-200l/p/MLB35873209"},
  "XP-36":{specifications:"Ayarlanabilir skimmerli askı filtre · 1200 L/saat · 15 W · 40–200 litre",ratedFlowLph:1200,powerW:15,recommendedMinL:40,recommendedMaxL:200,adjustableFlow:true,sourceUrl:"https://gensou.sg/filtration-aquarium-equipment/jeneca-xp-36-hang-on-filter-xl-size/"},
  "GD-16":{specifications:"Akrilik üst/askı filtre · 300 L/saat · 5 W · 60 litreye kadar",ratedFlowLph:300,powerW:5,recommendedMaxL:60,sourceUrl:"https://www.mercadolivre.com.br/jeneca-gd-16-filtro-sump-hang-on-de-acrilico-para-aquario-110v/p/MLB36321763"},
  "GD-17":{specifications:"Akrilik üst/askı filtre · 220 L/saat · 5 W · 80 litreye kadar",ratedFlowLph:220,powerW:5,recommendedMaxL:80,sourceUrl:"https://www.mercadolivre.com.br/jeneca-gd17-filtro-sump-hang-on-de-acrilico-p-aquario-220v/up/MLBU3033052156"},
  "GD-18":{specifications:"Ayarlanabilir beş hazneli akrilik üst filtre · 300 L/saat · 5 W · 100–130 litre",ratedFlowLph:300,powerW:5,recommendedMinL:100,recommendedMaxL:130,adjustableFlow:true,sourceUrl:"https://yellowtail.shop/product/jeneca-gd-18-aquarium-top-sump-filter-with-multi-slot-filtration-oxygenation/"},
  "GD-19":{specifications:"Altı hazneli akrilik üst filtre · 300 L/saat · 5 W",ratedFlowLph:300,powerW:5,sourceUrl:"https://swallowaquatics.co.uk/products/top-filter-gd-19"},
};
for(const item of jenecaFilters){Object.assign(item,jenecaVerified[item.model]??{});}

// Jeneca/ALEAS'ın güncel üretici kataloğunda bulunan ek seriler. Üreticinin
// parametre tablosu boş olan modellerde debi ve güç değeri özellikle yazılmaz.
const jenecaOfficialSource="https://www.aleas.cn/product/20/";
const jenecaCurrentFilters:EquipmentProfile[]=[
  ...["LT-300","LT-400","LT-500","LT-600"].map(model=>({id:`jeneca-${model.toLowerCase()}`,category:"filter" as const,brand:"Jeneca",model,specifications:"Ayarlanabilir askı filtre",adjustableFlow:true,sourceUrl:"https://www.aleas.cn/product/688.html",verifiedAt})),
  ...["XP-02","XP-03","XP-05","XP-06","XP-06L","XP-605","XP-606","XP-07","XP-08","XP-09","XP-09D","XP-11","XP-11D","XP-13","XP-13D","XP-15","XP-17"].map(model=>({id:`jeneca-${model.toLowerCase()}`,category:"filter" as const,brand:"Jeneca",model,specifications:"Şelale çıkışlı askı filtre",adjustableFlow:true,sourceUrl:model==="XP-07"||model==="XP-08"?"https://www.aleas.cn/product/731.html":jenecaOfficialSource,verifiedAt})),
  {id:"jeneca-xp-33-pro",category:"filter",brand:"Jeneca",model:"XP-33 Pro",specifications:"Yüzey emişli ayarlanabilir askı filtre",adjustableFlow:true,sourceUrl:jenecaOfficialSource,verifiedAt},
  {id:"jeneca-xp-36-pro",category:"filter",brand:"Jeneca",model:"XP-36 Pro",specifications:"Yüzey emişli ayarlanabilir askı filtre",adjustableFlow:true,sourceUrl:jenecaOfficialSource,verifiedAt},
  ...["XP-33 Ultra","XP-36 Ultra","XP-33D","XP-36D","XP-006 Ultra","XP-007 Ultra"].map(model=>({id:`jeneca-${model.toLowerCase().replace(/[^a-z0-9]+/g,"-")}`,category:"filter" as const,brand:"Jeneca",model,specifications:"Üretici kataloğundaki dış/askı filtrasyon sistemi",sourceUrl:jenecaOfficialSource,verifiedAt})),
  ...["TGD-15","TGD-16","TGD-17","TGD-18","TGD-19","XGD-15","XGD-16","XGD-17","XGD-18","XGD-19"].map(model=>({id:`jeneca-${model.toLowerCase()}`,category:"filter" as const,brand:"Jeneca",model,specifications:"Çok işlevli üst filtre",sourceUrl:jenecaOfficialSource,verifiedAt})),
  ...["GD-402","GD-403","GD-502","GD-503","GD-602","GD-603"].map(model=>({id:`jeneca-${model.toLowerCase()}`,category:"filter" as const,brand:"Jeneca",model,specifications:"Ayarlanabilir çok katmanlı damlama üst filtresi",adjustableFlow:true,sourceUrl:jenecaOfficialSource,verifiedAt})),
];
const jenecaXpVerified:Record<string,Partial<EquipmentProfile>>={
  "LT-300":{specifications:"Yüzey emişli, geri yıkamalı askı filtre · 300 L/saat · 5 W · iki filtre sepeti",ratedFlowLph:300,powerW:5,sourceUrl:"https://www.fishmit.com/products/backwash-hang-on-filter"},
  "LT-400":{specifications:"Yüzey emişli, geri yıkamalı askı filtre · 300 L/saat · 5 W · üç filtre sepeti",ratedFlowLph:300,powerW:5,sourceUrl:"https://onyxaqua.com/products/jeneca-lt-400-hang-on-canister-filter-5w-300l-h-external-filter-with-surface-skimmer/"},
  "LT-500":{specifications:"Yüzey emişli, geri yıkamalı askı filtre · 500 L/saat · 7 W · üç filtre sepeti",ratedFlowLph:500,powerW:7,sourceUrl:"https://www.fishmit.com/products/backwash-hang-on-filter"},
  "LT-600":{specifications:"Yüzey emişli, geri yıkamalı askı filtre · 600 L/saat · 7 W · dört filtre sepeti",ratedFlowLph:600,powerW:7,sourceUrl:"https://www.fishmit.com/products/backwash-hang-on-filter"},
  "XP-05":{specifications:"Şelale çıkışlı askı filtre · 180 L/saat · 3 W",ratedFlowLph:180,powerW:3,sourceUrl:"https://www.artemia.vn/loc-thac-treo-jeneca-ket-hop-hut-vang-mat-nuoc-ho-ca-xp-03-xp-05-xp-06-xp-07-xp-08-xp-09-xp-011-xp-013"},
  "XP-02":{specifications:"Yüzey emişli ayarlanabilir mini askı filtre · 160 L/saat · 2,5 W · 25 litre altı akvaryumlar",ratedFlowLph:160,powerW:2.5,recommendedMaxL:25,adjustableFlow:true,sourceUrl:"https://koyaquarium.com/san-pham/may-loc-nuoc/loc-thac-jeneca-xp-02/"},
  "XP-03":{specifications:"Ayarlanabilir askı filtre · 160 L/saat · 2,5 W",ratedFlowLph:160,powerW:2.5,adjustableFlow:true,sourceUrl:"https://kingfarshop.com/EN/product-detail/71193208856"},
  "XP-06":{specifications:"Şelale çıkışlı askı filtre · 250 L/saat · 3,5 W",ratedFlowLph:250,powerW:3.5,sourceUrl:"https://www.artemia.vn/loc-thac-treo-jeneca-ket-hop-hut-vang-mat-nuoc-ho-ca-xp-03-xp-05-xp-06-xp-07-xp-08-xp-09-xp-011-xp-013"},
  "XP-06L":{specifications:"Döner çarklı mini askı filtre · 250 L/saat · 3,5 W",ratedFlowLph:250,powerW:3.5,sourceUrl:"https://shop-vn.tiktok.com/pdp/1730509348745415412"},
  "XP-07":{specifications:"Yüzey emişli ayarlanabilir askı filtre · 500 L/saat · 4,5 W",ratedFlowLph:500,powerW:4.5,sourceUrl:"https://www.aquariumshopgt.com/producto/xp-07/"},
  "XP-08":{specifications:"Yüzey emişli ayarlanabilir askı filtre · 680 L/saat · 6,5 W",ratedFlowLph:680,powerW:6.5,sourceUrl:"https://www.artemia.vn/loc-thac-treo-jeneca-ket-hop-hut-vang-mat-nuoc-ho-ca-xp-03-xp-05-xp-06-xp-07-xp-08-xp-09-xp-011-xp-013"},
  "XP-09":{specifications:"Şelale çıkışlı askı filtre · 200 L/saat · 3,5 W",ratedFlowLph:200,powerW:3.5,sourceUrl:"https://www.artemia.vn/loc-thac-treo-jeneca-ket-hop-hut-vang-mat-nuoc-ho-ca-xp-03-xp-05-xp-06-xp-07-xp-08-xp-09-xp-011-xp-013"},
  "XP-09D":{specifications:"LED uyarılı ayarlanabilir askı filtre · 200 L/saat · 5 W",ratedFlowLph:200,powerW:5,adjustableFlow:true,sourceUrl:"https://kingfarshop.com/EN/product-detail/71193208856"},
  "XP-11":{specifications:"Yüzey emişli ayarlanabilir askı filtre · 260 L/saat · 4,2 W",ratedFlowLph:260,powerW:4.2,sourceUrl:"https://www.acuaticaperu.com/wp-content/uploads/2024/08/ACUATICA-PUBLICO-AGOSTO-2024.pdf"},
  "XP-11D":{specifications:"LED uyarılı ayarlanabilir askı filtre · 260 L/saat · 4,2 W",ratedFlowLph:260,powerW:4.2,adjustableFlow:true,sourceUrl:"https://kingfarshop.com/EN/product-detail/71193208856"},
  "XP-13":{specifications:"Yüzey emişli ayarlanabilir askı filtre · 290 L/saat · 4,8 W",ratedFlowLph:290,powerW:4.8,sourceUrl:"https://www.acuaticaperu.com/wp-content/uploads/2024/08/ACUATICA-PUBLICO-AGOSTO-2024.pdf"},
  "XP-13D":{specifications:"LED uyarılı ayarlanabilir askı filtre · 290 L/saat · 4,8 W",ratedFlowLph:290,powerW:4.8,adjustableFlow:true,sourceUrl:"https://kingfarshop.com/EN/product-detail/71193208856"},
  "XP-15":{specifications:"Ayarlanabilir askı filtre · 270 L/saat · 5,5 W",ratedFlowLph:270,powerW:5.5,adjustableFlow:true,sourceUrl:"https://kingfarshop.com/EN/product-detail/71193208856"},
  "XP-17":{specifications:"Dört kartuşlu ayarlanabilir askı filtre · 330 L/saat · 8 W · 120 litreye kadar",ratedFlowLph:330,powerW:8,recommendedMaxL:120,adjustableFlow:true,sourceUrl:"https://es.scribd.com/document/654385520/X-MENOR-ENERO-2023-2024"},
  "XP-606":{specifications:"Yüzey emişli ince gövdeli askı filtre · 300 L/saat · 4 W",ratedFlowLph:300,powerW:4,adjustableFlow:true,sourceUrl:"https://store.betezion.com/products/jeneca-xp-606-slim-aquarium-hang-on-filter-4w-300lh-with-int/234978710/"},
  "XP-006 Ultra":{specifications:"Kuru/ıslak çok aşamalı yüzey emişli askı filtre · 500 L/saat · 6 W",ratedFlowLph:500,powerW:6,sourceUrl:"https://eastoceansg.com/products/jeneca-external-hang-on-power-filter-xp-006-007-ultra-high-flow-aquarium-filter-with-surface-skimmer-multi-stage-filtration"},
  "XP-007 Ultra":{specifications:"Kuru/ıslak çok aşamalı yüzey emişli askı filtre · 800 L/saat · 8 W",ratedFlowLph:800,powerW:8,sourceUrl:"https://eastoceansg.com/products/jeneca-external-hang-on-power-filter-xp-006-007-ultra-high-flow-aquarium-filter-with-surface-skimmer-multi-stage-filtration"},
  "XP-33 Ultra":{specifications:"Yüzey emişli, üç aşamalı ayarlanabilir askı filtre · 1200 L/saat · 10 W",ratedFlowLph:1200,powerW:10,adjustableFlow:true,sourceUrl:"https://eastoceansg.com/products/jeneca-external-hang-on-power-filter-xp-33-36-ultra-high-flow-aquarium-filter-with-surface-skimmer-multi-stage-filtration"},
  "XP-36 Ultra":{specifications:"Yüzey emişli, üç aşamalı ayarlanabilir askı filtre · 1500 L/saat · 15 W",ratedFlowLph:1500,powerW:15,adjustableFlow:true,sourceUrl:"https://eastoceansg.com/products/jeneca-external-hang-on-power-filter-xp-33-36-ultra-high-flow-aquarium-filter-with-surface-skimmer-multi-stage-filtration"},
  "XP-33D":{specifications:"Kuru/ıslak ayrımlı, yüzey emişli ayarlanabilir askı filtre · 1200 L/saat · 10 W",ratedFlowLph:1200,powerW:10,adjustableFlow:true,sourceUrl:"https://eastoceansg.com/products/jeneca-external-hang-on-power-filter-xp-33-36-ultra-high-flow-aquarium-filter-with-surface-skimmer-multi-stage-filtration"},
  "XP-36D":{specifications:"Kuru/ıslak ayrımlı, yüzey emişli ayarlanabilir askı filtre · 1500 L/saat · 15 W",ratedFlowLph:1500,powerW:15,adjustableFlow:true,sourceUrl:"https://eastoceansg.com/products/jeneca-external-hang-on-power-filter-xp-33-36-ultra-high-flow-aquarium-filter-with-surface-skimmer-multi-stage-filtration"},
  "XP-33 Pro":{specifications:"Balık dışkısı ayırma hazneli, çift valfli ayarlanabilir askı filtre · 1000 L/saat",ratedFlowLph:1000,adjustableFlow:true,sourceUrl:"https://www.fishmit.com/products/xp-pro-fish-waste-filter"},
  "XP-36 Pro":{specifications:"Balık dışkısı ayırma hazneli, çift valfli ayarlanabilir askı filtre · 1200 L/saat · 15 W",ratedFlowLph:1200,powerW:15,adjustableFlow:true,sourceUrl:"https://thaiaquariumcenter.tarad.com/products_detail/view/7914997"},
  "XGD-15":{specifications:"Kuru/ıslak üst filtre · 400 L/saat · 6 W · bir filtre kutusu",ratedFlowLph:400,powerW:6,sourceUrl:"https://www.fishmit.com/products/dry-wet-top-filter"},
  "XGD-16":{specifications:"Kuru/ıslak üst filtre · 400 L/saat · 6 W · iki filtre kutusu",ratedFlowLph:400,powerW:6,sourceUrl:"https://www.fishmit.com/products/dry-wet-top-filter"},
  "XGD-17":{specifications:"Kuru/ıslak üst filtre · 400 L/saat · 6 W · üç filtre kutusu",ratedFlowLph:400,powerW:6,sourceUrl:"https://www.fishmit.com/products/dry-wet-top-filter"},
  "XGD-18":{specifications:"Kuru/ıslak üst filtre · 400 L/saat · 6 W · dört filtre kutusu",ratedFlowLph:400,powerW:6,sourceUrl:"https://www.fishmit.com/products/dry-wet-top-filter"},
  "XGD-19":{specifications:"Kuru/ıslak üst filtre · 400 L/saat · 6 W · beş filtre kutusu",ratedFlowLph:400,powerW:6,sourceUrl:"https://www.fishmit.com/products/dry-wet-top-filter"},
  "GD-403":{specifications:"Üç katmanlı ayarlanabilir üst filtre · 800 L/saat · 10 W",ratedFlowLph:800,powerW:10,adjustableFlow:true,sourceUrl:"https://yellowtail.shop/product/jeneca-gd-403-aquarium-top-filter-2-feet-tank/"},
  "GD-503":{specifications:"Üç katmanlı ayarlanabilir üst filtre · 1500 L/saat · 20 W",ratedFlowLph:1500,powerW:20,adjustableFlow:true,sourceUrl:"https://greenfinaqua.com/products/jeneca-aquarium-top-filters-gd-series"},
  "GD-603":{specifications:"Üç katmanlı ayarlanabilir üst filtre · 1800 L/saat · 25 W",ratedFlowLph:1800,powerW:25,adjustableFlow:true,sourceUrl:"https://seasunaquarium.com/shop/index.php?category_id=96&flypage=flypage.tpl&option=com_virtuemart&page=shop.product_details&product_id=1685&vmcchk=1"},
};
for(const item of jenecaCurrentFilters){Object.assign(item,jenecaXpVerified[item.model]??{});}
for(const item of jenecaCurrentFilters.filter(item=>["XP-605","TGD-15","TGD-16","TGD-17","TGD-18","TGD-19","GD-402","GD-502","GD-602"].includes(item.model))){
  item.specifications=`${item.specifications} · debi ve güç bilgisi yayımlanmamış`;
  item.capacityDataNote="Jeneca/ALEAS üretici kataloğu modelin varlığını doğruluyor; ancak debi, güç veya önerilen hacim yayımlanmadığı için otomatik filtrasyon hesabına katılmaz.";
  item.sourceUrl=jenecaOfficialSource;
}
const jenecaAirPumps:EquipmentProfile[]=["AP-970","AP-980","AP-960","AP-548","AP-648","AP-9801","AP-9802","AP-9804","DC-001","DC-003"].map(model=>({
  id:`jeneca-${model.toLowerCase()}`,category:"air_pump",brand:"Jeneca",model,
  specifications:model.startsWith("DC-")?"DC hava motoru":"Sessiz hava motoru",
  sourceUrl:model.startsWith("AP-980")?"https://www.aleas.cn/product/711.html":jenecaOfficialSource,verifiedAt,
}));
jenecaAirPumps.push(
  ...([["AP-01",180,2.4,1],["AP-02",360,4.4,2],["AP-03",420,3.2,1]] as const).map(([model,flow,power,outlets])=>({id:`jeneca-${model.toLowerCase()}`,category:"air_pump" as const,brand:"Jeneca",model,specifications:`Yüksek çıkışlı hava motoru · ${outlets} çıkış · ${flow} L/saat · ${String(power).replace(".",",")} W`,ratedFlowLph:flow,powerW:power,sourceUrl:"https://eastoceansg.com/products/jeneca-ap-01-air-pump",verifiedAt:"2026-08-25"})),
  ...([["AP-910",96,2.8,1],["AP-920",420,4,2]] as const).map(([model,flow,power,outlets])=>({id:`jeneca-${model.toLowerCase()}`,category:"air_pump" as const,brand:"Jeneca",model,specifications:`Sessiz hava motoru · ${outlets} çıkış · ${flow} L/saat · ${String(power).replace(".",",")} W`,ratedFlowLph:flow,powerW:power,sourceUrl:"https://www.aleas.cn/product/449.html",verifiedAt:"2026-08-25"})),
  ...([["AP-1688",96,1.5,1],["AP-2688A",192,3,2]] as const).map(([model,flow,power,outlets])=>({id:`jeneca-${model.toLowerCase()}`,category:"air_pump" as const,brand:"Jeneca",model,specifications:`Ayarlanabilir sessiz hava motoru · ${outlets} çıkış · ${flow} L/saat · ${String(power).replace(".",",")} W`,ratedFlowLph:flow,powerW:power,adjustableFlow:true,sourceUrl:"https://www.aleas.cn/product/461.html",verifiedAt:"2026-08-25"})),
  ...([["AP-8801",126,1.5,1],["AP-8803",174,2,1],["AP-8804",396,3.5,2]] as const).map(([model,flow,power,outlets])=>({id:`jeneca-${model.toLowerCase()}`,category:"air_pump" as const,brand:"Jeneca",model,specifications:`Yağsız hava motoru · ${outlets} çıkış · ${flow} L/saat · ${String(power).replace(".",",")} W`,ratedFlowLph:flow,powerW:power,sourceUrl:"https://www.aquasclean.com/product/jeneca-air-pump-ap-8801-8803-8804-single-double-outlet-models/",verifiedAt:"2026-08-25"})),
);
jenecaAirPumps.push({id:"jeneca-as615b",category:"other",brand:"Jeneca",model:"AS615B Dip Süpürgesi",specifications:"USB kablolu veya 2 pil ile çalışan dip süpürgesi · kumu temizleyip süzülen suyu akvaryuma geri verir · 52 cm derinliğe kadar",sourceUrl:"https://atakanpetshop.com/jeneca-pilli-ve-elektrikli-dip-supurgesi",verifiedAt:"2026-08-25"});
const jenecaAirVerified:Record<string,Partial<EquipmentProfile>>={
  "AP-548":{specifications:"Sessiz tek çıkışlı hava motoru · 3,5 L/dak · 3 W",ratedFlowLph:210,powerW:3,sourceUrl:"https://tieuguppy.vn/may-oxy-ho-ca-jeneca-ap568-ap648-may-oxy-the-he-moi"},
  "AP-648":{specifications:"Sessiz çift çıkışlı hava motoru · 2 × 4 L/dak · 5 W",ratedFlowLph:480,powerW:5,sourceUrl:"https://tieuguppy.vn/may-oxy-ho-ca-jeneca-ap568-ap648-may-oxy-the-he-moi"},
  "AP-960":{specifications:"Sessiz tek çıkışlı hava motoru · 1,65 L/dak · 2,8 W",ratedFlowLph:99,powerW:2.8,sourceUrl:"https://asiaoptom.com/item/789123137401/"},
  "AP-970":{specifications:"Sessiz tek çıkışlı hava motoru · 3,5 L/dak · 3,5 W",ratedFlowLph:210,powerW:3.5,sourceUrl:"https://www.aleas.cn/product/449.html"},
  "AP-980":{specifications:"Sessiz çift çıkışlı hava motoru · toplam 7 L/dak · 4 W",ratedFlowLph:420,powerW:4,sourceUrl:"https://www.aleas.cn/product/449.html"},
  "AP-9801":{specifications:"Ayarlanabilir sessiz tek çıkışlı hava motoru · 2,5 L/dak · 3 W",ratedFlowLph:150,powerW:3,adjustableFlow:true,sourceUrl:"https://aquabornworld.com/product/bomba-de-aire-silenciosa-jeneca-ap-9801/"},
  "AP-9802":{specifications:"Ayarlanabilir sessiz çift çıkışlı hava motoru · toplam 5 L/dak · 3 W",ratedFlowLph:300,powerW:3,adjustableFlow:true,sourceUrl:"https://www.goldsupplier.com/provide/p124206961.html"},
  "AP-9804":{specifications:"Ayarlanabilir sessiz çift çıkışlı hava motoru · toplam 6 L/dak · 4 W",ratedFlowLph:360,powerW:4,adjustableFlow:true,sourceUrl:"https://www.goldsupplier.com/provide/p124206961.html"},
};
for(const item of jenecaAirPumps){Object.assign(item,jenecaAirVerified[item.model]??{});}
for(const item of jenecaAirPumps.filter(item=>["DC-001","DC-003"].includes(item.model))){
  item.specifications="DC hava motoru · hava debisi ve güç bilgisi yayımlanmamış";
  item.capacityDataNote="Jeneca/ALEAS üretici kataloğu modelin varlığını doğruluyor; ancak hava debisi ve güç yayımlanmadığı için otomatik hava kapasitesi hesabına katılmaz.";
  item.sourceUrl="https://www.aleas.cn/product/41/";
}
const jenecaBx20Source="https://www.jd.com/brand/69942b14a8a7bb507928.html";
const jenecaHeaters:EquipmentProfile[]=[
  {id:"jeneca-bx-20-25w",category:"heater",brand:"Jeneca",model:"BX-20 25 W",specifications:"304 paslanmaz çelik otomatik termostatlı ısıtıcı · 25 W · yaklaşık 20 litre",powerW:25,recommendedMaxL:20,sourceUrl:jenecaBx20Source,verifiedAt:"2026-08-18"},
  {id:"jeneca-bx-20-50w",category:"heater",brand:"Jeneca",model:"BX-20 50 W",specifications:"304 paslanmaz çelik otomatik termostatlı ısıtıcı · 50 W · yaklaşık 30 litre",powerW:50,recommendedMaxL:30,sourceUrl:jenecaBx20Source,verifiedAt:"2026-08-18"},
  ...[100,200,300,500].map(powerW=>({id:`jeneca-bx-20-${powerW}w`,category:"heater" as const,brand:"Jeneca",model:`BX-20 ${powerW} W`,specifications:`304 paslanmaz çelik otomatik termostatlı ısıtıcı · ${powerW} W · üretici/satıcı hacim aralığı yayımlamamış`,powerW,sourceUrl:"https://shopee.com.my/%F0%9F%8C%B1-JENECA-304-Stainless-Steel-Heater-for-Fish-Tank-Automatic-Constant-Temperature-BX-20-Series-%E9%87%91%E5%88%A9%E4%BD%B3-304%E4%B8%8D%E9%94%88%E9%92%A2%E8%87%AA%E5%8A%A8%E6%81%92%E6%B8%A9%E9%B1%BC%E7%BC%B8%E5%8A%A0%E6%B8%A9%E6%A3%92-EVO-i.327591138.27381083056",verifiedAt:"2026-08-18"})),
];

// Üreticinin güncel çevrim içi kataloğunda bulunan Jeneca serileri. Sayısal
// parametre tablosu yayımlanmayan ürünler katalogda bulunur, ancak sağlık
// analizinde varsayımsal debi/güç kullanılmaz.
const jenecaOfficialCatalogSource="https://www.aleas.cn/product/20/";
const jenecaOfficialAdditional:EquipmentProfile[]=[
  {id:"jeneca-cda-200l",category:"filter",brand:"Jeneca",model:"CDA-200L",specifications:"Çok işlevli iç filtre · 280 L/saat · 3,5 W",ratedFlowLph:280,powerW:3.5,sourceUrl:"https://www.jd.com/jiage/6994e92af22db77e076c.html?brand=%E9%87%91%E5%88%A9%E4%BD%B3%EF%BC%88Jeneca%EF%BC%89",verifiedAt:"2026-08-18"},
  {id:"jeneca-cda-300l",category:"filter",brand:"Jeneca",model:"CDA-300L",specifications:"Çok işlevli iç filtre · 370 L/saat · 5,5 W",ratedFlowLph:370,powerW:5.5,sourceUrl:"https://www.jd.com/jiage/6994e92af22db77e076c.html?brand=%E9%87%91%E5%88%A9%E4%BD%B3%EF%BC%88Jeneca%EF%BC%89",verifiedAt:"2026-08-18"},
  {id:"jeneca-cda-500l",category:"filter",brand:"Jeneca",model:"CDA-500L",specifications:"Çok işlevli iç filtre · 500 L/saat · 7 W",ratedFlowLph:500,powerW:7,sourceUrl:"https://www.jd.com/brand/98558c1a5c66c7569a28.html",verifiedAt:"2026-08-18"},
  {id:"jeneca-cda-1000l",category:"filter",brand:"Jeneca",model:"CDA-1000L",specifications:"Çok işlevli iç filtre · 1000 L/saat · 15 W",ratedFlowLph:1000,powerW:15,sourceUrl:"https://www.jd.com/jiage/6994e92af22db77e076c.html?brand=%E9%87%91%E5%88%A9%E4%BD%B3%EF%BC%88Jeneca%EF%BC%89",verifiedAt:"2026-08-18"},
  ...["CDA-200","CDA-300","CDA-500","CDA-1000","CDA-1500","CDA-2500","PB-260A","PB-360A","PB-460A","PB-560A"].map(model=>({
    id:`jeneca-${model.toLowerCase()}`,category:"other" as const,brand:"Jeneca",model,
    specifications:model.startsWith("PB-")?"İç sirkülasyon pompası · üretici teknik tablosu yayımlanmamış":"Dalgıç/devirdaim su pompası · üretici teknik tablosu yayımlanmamış",
    sourceUrl:jenecaOfficialCatalogSource,verifiedAt,
  })),
  ...["GLS-21","GLS-21D","GLS-22","GLS-22D","GLS-31","GLS-31D","GLS-32","GLS-32D"].map(model=>({
    id:`jeneca-${model.toLowerCase()}`,category:"other" as const,brand:"Jeneca",model,
    specifications:"Ultra ince filtre emiş süzgeci/aksesuarı",sourceUrl:jenecaOfficialCatalogSource,verifiedAt,
  })),
  ...[60,80,100,120,150,180].map(length=>({
    id:`jeneca-t8-ts${length}`,category:"lighting" as const,brand:"Jeneca",model:`T8-TS${length}`,
    specifications:`RGB ayarlanabilir akvaryum aydınlatması · ${length} cm seri`,sourceUrl:jenecaOfficialCatalogSource,verifiedAt,
  })),
  ...[20,30,40,50,60,80,100,120].flatMap(length=>([
    {id:`jeneca-sc-${length}-standard`,category:"lighting" as const,brand:"Jeneca",model:`SC-${length} Standard`,specifications:`Beyaz / mavi-beyaz / renk geçişli akvaryum aydınlatması · ${length} cm seri`,sourceUrl:"https://www.aleas.cn/product/704.html",verifiedAt},
    {id:`jeneca-sc-${length}-rgb`,category:"lighting" as const,brand:"Jeneca",model:`SC-${length} RGB`,specifications:`RGB akvaryum aydınlatması · ${length} cm seri`,sourceUrl:jenecaOfficialCatalogSource,verifiedAt},
  ])),
  ...["D-1","D-1S","D-2","D-15","D-16"].map(model=>({
    id:`jeneca-${model.toLowerCase()}`,category:"lighting" as const,brand:"Jeneca",model,
    specifications:"Enerji tasarruflu akvaryum LED aydınlatması",sourceUrl:jenecaOfficialCatalogSource,verifiedAt,
  })),
];

// Jeneca/ALEAS'in resmî çevrim içi kataloğundaki kalan güncel cihaz ve
// aksesuar aileleri. Üreticinin teknik tablo yayımlamadığı modeller görünür
// kalır; ancak otomatik kapasite analizine varsayımsal değer gönderilmez.
const jenecaOfficialExternalSource="https://www.aleas.cn/product/46/";
const jenecaOfficialInternalSource="https://www.aleas.cn/product/43/";
const jenecaOfficialAirSource="https://www.aleas.cn/product/41/";
const jenecaOfficialWaterPumpSource="https://www.aleas.cn/product/59/";
const jenecaOfficialTopFilterSource="https://www.aleas.cn/product/31/";
const jenecaOfficialSubmersibleSource="https://www.aleas.cn/product/26/";
const jenecaOfficialLightSource="https://www.aleas.cn/product/45/";
const jenecaOfficialAccessorySource="https://www.aleas.cn/product/48/";
const jenecaOfficialHeaterSource="https://www.aleas.cn/product/49/";
const jenecaOfficialAirStoneSource="https://www.aleas.cn/product/42/";

const jenecaMissingCapacityProfile=(model:string,category:"filter"|"air_pump"|"heater",specifications:string,sourceUrl:string):EquipmentProfile=>({
  id:`jeneca-${model.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")}`,
  category,brand:"Jeneca",model,
  specifications:`${specifications} · kapasite için gerekli sayısal teknik tablo yayımlanmamış`,
  capacityDataNote:category==="filter"
    ?"Jeneca/ALEAS üretici kataloğu modelin varlığını doğruluyor; ancak debi, güç veya önerilen hacim yayımlanmadığı için otomatik filtrasyon hesabına katılmaz."
    :category==="air_pump"
      ?"Jeneca/ALEAS üretici kataloğu modelin varlığını doğruluyor; ancak hava debisi ve güç yayımlanmadığı için otomatik hava kapasitesi hesabına katılmaz."
      :"Jeneca/ALEAS üretici kataloğu modelin varlığını doğruluyor; ancak güç veya önerilen hacim yayımlanmadığı için otomatik ısıtıcı kapasitesi hesabına katılmaz.",
  sourceUrl,verifiedAt,
});

const jenecaOfficialExpandedFilters:EquipmentProfile[]=[
  {id:"jeneca-xp-03b",category:"filter",brand:"Jeneca",model:"XP-03B",specifications:"Ayarlanabilir yüzey emişli askı filtre · 160 L/saat · 2,5 W",ratedFlowLph:160,powerW:2.5,adjustableFlow:true,sourceUrl:"https://www.aleas.cn/product/473.html",verifiedAt},
  ...([
    ["IPF-408",200,2],["IPF-448",450,6],["IPF-728",720,10],["IPF-1008",1020,14],["IPF-1508",1500,22],
  ] as const).map(([model,ratedFlowLph,powerW]):EquipmentProfile=>({id:`jeneca-${model.toLowerCase()}`,category:"filter",brand:"Jeneca",model,specifications:`Mekanik, biyolojik ve kimyasal filtrelemeli iç filtre · ${ratedFlowLph} L/saat · ${powerW} W`,ratedFlowLph,powerW,sourceUrl:"https://www.aleas.cn/product/486.html",verifiedAt})),
  ...["XP-18","XP-19","XP-31","XP-32"].map(model=>jenecaMissingCapacityProfile(model,"filter","Dış güç filtresi",jenecaOfficialExternalSource)),
  ...["AE-1000","AE-1300"].map(model=>jenecaMissingCapacityProfile(model,"filter","Kendinden emişli ayarlanabilir dış filtre","https://www.aleas.cn/product/478.html")),
  {id:"jeneca-ae-800",category:"filter",brand:"Jeneca",model:"AE-800",specifications:"Kendinden emişli ayarlanabilir dış filtre · 750 L/saat · 9,3 W · 50–80 litre",ratedFlowLph:750,powerW:9.3,recommendedMinL:50,recommendedMaxL:80,adjustableFlow:true,sourceUrl:"https://www.acuarioacuaworld.com/externos/688-filtro-canister-ae800-jeneca.html",verifiedAt},
  ...([
    ["AE-800UV",750,20,5],["AE-1000UV",850,21,7],["AE-1300UV",950,21,7],["AE-1500UV",1300,26,9],["AE-1800UV",1500,30,9],
  ] as const).map(([model,ratedFlowLph,powerW,uvPower]):EquipmentProfile=>({id:`jeneca-${model.toLowerCase()}`,category:"filter",brand:"Jeneca",model,specifications:`Kendinden emişli ayarlanabilir UV dış filtre · ${ratedFlowLph} L/saat · pompa ${powerW} W · UV ${uvPower} W`,ratedFlowLph,powerW,adjustableFlow:true,sourceUrl:"https://fishyhub.com/product-detail/jeneca-canister-filter-w-uv-ae-series-8001000130015001800-26379",verifiedAt})),
  ...["XP-01A","YM-01","YM-03","GL-3","GL-5","GL-7","IPF-380","IPF-280","IPF-180","IPF-080","GLB-600","GLB-800","GLB-1000","IPF-228","IPF-338","IPF-628","IPF-260","IPF-360","IPF-460","IPF-480","IPF-560","IPF-060"].map(model=>jenecaMissingCapacityProfile(model,"filter",model.startsWith("YM-")?"Yüzey yağ filmi emici":"İç filtre pompası",jenecaOfficialInternalSource)),
  ...["GD-400","GD-500","GD-600","GD-320"].map(model=>jenecaMissingCapacityProfile(model,"filter","Üst filtre",jenecaOfficialTopFilterSource)),
];

const jenecaOfficialUvFilters:EquipmentProfile[]=[
  ...([
    ["XP-U1",200,3.5],["XP-U3",260,4.2],["XP-U5",200,3.5],["XP-U6",260,4.2],
  ] as const).map(([model,ratedFlowLph,powerW]):EquipmentProfile=>({id:`jeneca-${model.toLowerCase()}`,category:"uv",brand:"Jeneca",model,specifications:`Yüzey emişli, ayarlanabilir çok katmanlı dış UV filtre · ${ratedFlowLph} L/saat · ${String(powerW).replace(".",",")} W`,ratedFlowLph,powerW,adjustableFlow:true,sourceUrl:"https://www.aleas.cn/product/472.html",verifiedAt})),
  {id:"jeneca-uv-02",category:"uv",brand:"Jeneca",model:"UV-02",specifications:"Dış UV filtre ünitesi · 3,5 W · üretici debi yayımlamamış",powerW:3.5,sourceUrl:"https://www.aleas.cn/product/472.html",verifiedAt},
];

const jenecaOfficialExpandedAirPumps:EquipmentProfile[]=[
  ...["AP-602","AP-8806","AP-601","AP-18000","AP-10000","AP-12000","DB-58","AP-06","AP-15000","AP-20000","AP-22000","AP-30000","AP-40000","DB-11","DB-11 Upgrade","DB-21","DB-21 Upgrade","DB-31","DB-51","DB-81","DB-58 Upgrade"].map(model=>jenecaMissingCapacityProfile(model,"air_pump",model.startsWith("DB-")?"Yüksek çıkışlı hava motoru":"Sessiz hava motoru",jenecaOfficialAirSource)),
];

const jenecaOfficialPumpsAndWaveMakers:EquipmentProfile[]=[
  ...([
    ["AH-2000DC",2000,15],["AH-3000DC",3000,20],["AH-4000DC",4000,25],["AH-5500DC",5500,30],["AH-6500DC",6500,40],["AH-8500DC",8500,50],
  ] as const).map(([model,ratedFlowLph,powerW]):EquipmentProfile=>({id:`jeneca-${model.toLowerCase()}`,category:"other",brand:"Jeneca",model,specifications:`Ayarlanabilir sessiz DC devirdaim pompası · ${ratedFlowLph} L/saat · ${powerW} W`,ratedFlowLph,powerW,adjustableFlow:true,sourceUrl:"https://www.aleas.cn/product/447.html",verifiedAt})),
  {id:"jeneca-ah-100000dc-official-label",category:"other",brand:"Jeneca",model:"AH-100000DC (üretici yazımı)",specifications:"Sessiz DC devirdaim pompası · üretici tablosunda model kodu 100000DC, debi 10000 L/saat olarak yayımlanıyor; olası yazım çelişkisi nedeniyle otomatik hesapta kullanılmaz",powerW:65,sourceUrl:"https://www.aleas.cn/product/447.html",verifiedAt},
  {id:"jeneca-ah-12000dc",category:"other",brand:"Jeneca",model:"AH-12000DC",specifications:"Sessiz DC devirdaim pompası · 75 W · üretici tablosundaki 120000 L/saat değeri olası yazım hatası olduğundan debi kullanılmaz",powerW:75,sourceUrl:"https://www.aleas.cn/product/447.html",verifiedAt},
  ...([
    ["ZL-101",4000,8],["ZL-103",5000,12],["ZL-221",8000,16],["ZL-223",12000,24],
  ] as const).map(([model,ratedFlowLph,powerW]):EquipmentProfile=>({id:`jeneca-${model.toLowerCase()}`,category:"other",brand:"Jeneca",model,specifications:`360° dönebilen ayarlanabilir dalga motoru · ${ratedFlowLph} L/saat · ${powerW} W`,ratedFlowLph,powerW,adjustableFlow:true,sourceUrl:"https://www.aleas.cn/product/448.html",verifiedAt})),
  ...["PF-7200","PF-5200","HM-9131","HM-8101","HM-6081","HM-5063","HM-4103","HM-3101","HM-2101","DB-5500","DB-5000","DB-4500","DB-3500","DB-3000","DB-2500"].map((model:string)=>({id:`jeneca-${model.toLowerCase()}`,category:"other" as const,brand:"Jeneca",model,specifications:"Tatlı ve tuzlu suya uygun amfibik devirdaim pompası · üretici kategori sayfasında sayısal teknik tablo yayımlanmamış",sourceUrl:jenecaOfficialWaterPumpSource,verifiedAt})),
  ...["AH-07","AH-11","AH-15","AH-20","AH-35","AH-45","AH-60","AH-90","AH-120","PF-1550","PF-2000","PF-3200","PF-3300","PF-3500","PF-228","PF-338","PF-628","PF-9101","PF-9102","PF-9103"].map((model:string)=>({id:`jeneca-submersible-${model.toLowerCase()}`,category:"other" as const,brand:"Jeneca",model,specifications:"Dalgıç/devirdaim su pompası · üretici kategori sayfasında sayısal teknik tablo yayımlanmamış",sourceUrl:jenecaOfficialSubmersibleSource,verifiedAt})),
];

const jenecaOfficialExpandedHeaters:EquipmentProfile[]=[
  ...[25,50,75,100,150,200,300].map((powerW):EquipmentProfile=>({id:`jeneca-al-3201-${powerW}w`,category:"heater",brand:"Jeneca",model:`AL-3201 ${powerW} W`,specifications:`2 mm kalınlaştırılmış kuvars camlı tatlı/tuzlu su ısıtıcısı · ${powerW} W · üretici hacim aralığı yayımlamamış`,powerW,sourceUrl:"https://www.aleas.cn/product/640.html",verifiedAt})),
  ...["SX-366","SX-388","SX-265","AL-22","BX-28","AL-28","BX-22","BX-29"].map(model=>jenecaMissingCapacityProfile(model,"heater","Akvaryum ısıtıcısı",jenecaOfficialHeaterSource)),
];

const jenecaOfficialExpandedLighting:EquipmentProfile[]=[
  ...["T8-LY","T8-YW","T8-JL","T8-BS","T12-LY","T12-JL","SZ-40D","SZ-50D","SZ-60D","X1","X3","X5","D3","D5","D7"].map((model):EquipmentProfile=>({id:`jeneca-light-${model.toLowerCase()}`,category:"lighting",brand:"Jeneca",model,specifications:"Üretici kataloğundaki akvaryum LED aydınlatması · güç/uzunluk varyant tablosu yayımlanmamış",sourceUrl:jenecaOfficialLightSource,verifiedAt})),
];

const jenecaOfficialAirStones:EquipmentProfile[]=[
  ...["AS-01","Q-40","Q-60","Q-80","Q-100","Q-120","Q-150","A-50","A-80","A-100","A-100F"].map((model):EquipmentProfile=>({id:`jeneca-air-stone-${model.toLowerCase()}`,category:"other",brand:"Jeneca",model,specifications:"Hava motoruyla kullanılan nano hava taşı/difüzörü",requiresAirPump:true,sourceUrl:jenecaOfficialAirStoneSource,verifiedAt})),
];

const jenecaOfficialAccessories:EquipmentProfile[]=[
  ...["AS-715","AS-615A","AS-666","AS-666B","AS-888","AS-999","AS-777","ST-03","ST-06","F-8805","AD-2T","AD-3T","AD-4T","AD-6T","AD-8T","F-15","F-21","F-29","F-35","CL-01","CL-02","CL-03","CL-04","SD-01","WGD-02","GLB-05","GLB-06","GLB-06B","GLB-07","CV-B","CV-C","CR-250","CR-500","CR-1000 SALT","AC-168","FN-030","FN-040","FN-050","FN-060","FN-080","FN-100","FN-120","Bio-S","Bio-L","BM-101","BM-102","BM-103","BM-104","JOINT-12","ACV-01","ACV-02","DF-1516","DF-1526","FH-S","FH-M","FH-D","AT-07","MM-30","MM-31","MM-32","MM-32D","DSQ-02","DSQ-03","SB-6717","AT-040","AT-050","AT-070","AT-080","AT-27W","AT-37W","AT-48W","AT-27Z","ST-37Z","AT-48Z","AS-59","AS-60","AS-53","AS-16","AS-23","AS-29","AS-555","AS-320","AS-323","AS-325","MB-S","MB-M","MB-L","FMB-03","FMB-06","FMB-09","CL-05","CL-06","CL-07","CL-08","FS-13","GLB-01","GLB-02","GLB-03","GLB-04"].map((model):EquipmentProfile=>({id:`jeneca-accessory-${model.toLowerCase().replace(/[^a-z0-9]+/g,"-")}`,category:"other",brand:"Jeneca",model,specifications:"Jeneca resmî katalogdaki akvaryum bakım/kurulum aksesuarı",sourceUrl:jenecaOfficialAccessorySource,verifiedAt})),
];

const eurostarFilters: EquipmentProfile[] = [
  { id:"eurostar-hbl802", category:"filter", brand:"Eurostar", model:"HBL802", specifications:"Beş bölmeli ayarlanabilir askı filtre · 500 L/saat · 6 W · 60–100 litre", ratedFlowLph:500, powerW:6, recommendedMinL:60, recommendedMaxL:100, adjustableFlow:true, sourceUrl:"https://atakanpetshop.com/eurostar-hbl802-aski-filtre-500l-h-6w", verifiedAt:"2026-08-25" },
  { id:"eurostar-ege-sp200", category:"filter", brand:"Eurostar", model:"Ege SP200", specifications:"Kompakt iç filtre · 200 L/saat · 2 W", ratedFlowLph:200, powerW:2, sourceUrl:"https://www.hepsiburada.com/eurostar-ege-sp200-ic-filtre-200-lth-2w-p-HBV000001V3ZE", verifiedAt:"2026-08-18" },
  { id:"eurostar-ege-sp300", category:"filter", brand:"Eurostar", model:"Ege SP300", specifications:"Ayarlanabilir çıkışlı kompakt iç filtre · 300 L/saat · 2 W · 30–60 litre", ratedFlowLph:300, powerW:2, recommendedMinL:30, recommendedMaxL:60, adjustableFlow:true, sourceUrl:"https://www.akvaryem.com.tr/urun/eurostar-ege-sp300-ic-filtre-300-lt-h-2w", verifiedAt:"2026-08-25" },
  { id:"eurostar-ege-400", category:"filter", brand:"Eurostar", model:"Ege 400", specifications:"Mekanik ve biyolojik temizlik ile oksijenlendirme sağlayan iç filtre · 400 L/saat · 4 W · 40–100 litre", ratedFlowLph:400, powerW:4, recommendedMinL:40, recommendedMaxL:100, sourceUrl:"https://www.akvaryem.com.tr/urun/eurostar-ege-400-ic-filtre-400lt-saat-4w", verifiedAt:"2026-08-25" },
  { id:"eurostar-ege-500", category:"filter", brand:"Eurostar", model:"Ege 500", specifications:"Mekanik ve biyolojik temizlik ile oksijenlendirme sağlayan iç filtre · 500 L/saat · 6 W · 40–100 litre", ratedFlowLph:500, powerW:6, recommendedMinL:40, recommendedMaxL:100, sourceUrl:"https://www.akvaryem.com.tr/urun/eurostar-ege-500-ic-filtre-500lt-saat-6w", verifiedAt:"2026-08-25" },
  { id:"eurostar-ege-w550", category:"filter", brand:"Eurostar", model:"Ege W550", specifications:"Karbon ve sünger medyalı, oksijenlendirmeli iç filtre · 550 L/saat · 10 W", ratedFlowLph:550, powerW:10, sourceUrl:"https://www.akvaryem.com.tr/urun/eurostar-ege-w550-ic-filtre-550-lt-h-10w", verifiedAt:"2026-08-25" },
  { id:"eurostar-ege-2200f", category:"filter", brand:"Eurostar", model:"Ege 2200F", specifications:"İç filtre · 1000 L/saat · 20 W", ratedFlowLph:1000, powerW:20, sourceUrl:"https://www.akakce.com/akvaryum-filtresi/eurostar.html", verifiedAt:"2026-08-18" },
  { id:"eurostar-marmara-single", category:"air_pump", brand:"Eurostar", model:"Marmara Tek Çıkış", specifications:"Tek çıkışlı hava motoru · 3,5 L/dakika · 3 W", ratedFlowLph:210, powerW:3, sourceUrl:"https://www.petcanlar.com/akvaryum-hava-motorlari", verifiedAt:"2026-08-18" },
  { id:"eurostar-marmara-double", category:"air_pump", brand:"Eurostar", model:"Marmara Çift Çıkış", specifications:"Çift çıkışlı hava motoru · 2 × 4 L/dakika · 5 W", ratedFlowLph:480, powerW:5, sourceUrl:"https://www.petcanlar.com/akvaryum-hava-motorlari", verifiedAt:"2026-08-18" },
  { id:"eurostar-sponge-production-small", category:"filter", brand:"Eurostar", model:"Sünger Üretim Filtresi Small", specifications:"Hava motoru veya filtre emiş hattıyla çalışan ağırlıklı sünger filtre · Small", requiresAirPump:true, sourceUrl:"https://atakanpetshop.com/eurostar-sunger-uretim-filtresi-medium", verifiedAt },
  { id:"eurostar-sponge-production-medium", category:"filter", brand:"Eurostar", model:"Sünger Üretim Filtresi Medium", specifications:"Hava motoru veya filtre emiş hattıyla çalışan ağırlıklı sünger filtre · 12 cm çap · 10 cm yükseklik", requiresAirPump:true, sourceUrl:"https://atakanpetshop.com/eurostar-sunger-uretim-filtresi-medium", verifiedAt },
  { id:"eurostar-sponge-production-large", category:"filter", brand:"Eurostar", model:"Sünger Üretim Filtresi Large", specifications:"Hava motoru veya filtre emiş hattıyla çalışan ağırlıklı sünger filtre · Large", requiresAirPump:true, sourceUrl:"https://atakanpetshop.com/eurostar-sunger-uretim-filtresi-medium", verifiedAt },
  { id:"eurostar-motorized-sponge-medium", category:"filter", brand:"Eurostar", model:"Motorlu Pipo Filtre Medium", specifications:"Kendinden motorlu, filtre medyası hazneli sünger filtre · 5 W · 17,5 × 23 cm", powerW:5, capacityDataNote:"Yetkili satıcı ürün sayfasında su debisi veya önerilen hacim yayımlanmamış; benzer modelden tahmin edilmedi.", sourceUrl:"https://atakanpetshop.com/eurostar-motorlu-pipo-filtre---filtre-malzemeli-medium-5w", verifiedAt:"2026-08-24" },
  { id:"eurostar-motorized-sponge-large", category:"filter", brand:"Eurostar", model:"Motorlu Pipo Filtre Large", specifications:"Kendinden motorlu, filtre medyası hazneli sünger filtre · 5 W · 18,5 × 25 cm", powerW:5, capacityDataNote:"Yetkili satıcı ürün sayfasında su debisi veya önerilen hacim yayımlanmamış; benzer modelden tahmin edilmedi.", sourceUrl:"https://atakanpetshop.com/eurostar-motorlu-pipo-filtre---filtre-malzemeli-large-5w", verifiedAt:"2026-08-24" },
  { id:"eurostar-cleaning-set-4", category:"other", brand:"Eurostar", model:"Akvaryum Temizlik Seti 4'lü", specifications:"9/12, 12/16 ve 16/22 mm boru-hortum sistemleri için dört farklı boy fırça", sourceUrl:"https://atakanpetshop.com/eurostar-akvaryum-temizlik-seti-4-lu", verifiedAt:"2026-08-25" },
  { id:"eurostar-cleaning-set-5", category:"other", brand:"Eurostar", model:"Akvaryum Temizlik Seti 5'li", specifications:"Jilet, sünger, tırmık, döner keçe ve kepçe başlıklı uzatılabilir bakım seti · 78 cm'ye kadar", sourceUrl:"https://atakanpetshop.com/eurostar-akvaryum-temizlik-seti-5-li", verifiedAt:"2026-08-25" },
  { id:"eurostar-glass-surface-intake-13", category:"other", brand:"Eurostar", model:"Cam Yüzey Emiş Borusu 13 mm", specifications:"Yüzey filmi ve su emişini birleştiren cam boru · 13 mm · 12/16 mm hortum uyumlu", sourceUrl:"https://atakanpetshop.com/eurostar-cam-yuzey-emis-borusu-13mm-452-yd-ymj13", verifiedAt:"2026-08-25" },
  { id:"eurostar-glass-surface-intake-17", category:"other", brand:"Eurostar", model:"Cam Yüzey Emiş Borusu 17 mm", specifications:"Yüzey filmi ve su emişini birleştiren cam boru · 17 mm · 16/22 mm hortum uyumlu", sourceUrl:"https://atakanpetshop.com/eurostar-cam-yuzey-emis-borusu-17mm-452-yd-ymj17", verifiedAt:"2026-08-25" },
  { id:"eurostar-glass-intake-13", category:"other", brand:"Eurostar", model:"Cam Emiş Borusu 13 mm", specifications:"Dış filtreler için şeffaf cam emiş borusu · 13 mm · 12/16 mm hortum uyumlu", sourceUrl:"https://atakanpetshop.com/eurostar-cam-emis-borusu-13mm", verifiedAt:"2026-08-25" },
  { id:"eurostar-glass-intake-17", category:"other", brand:"Eurostar", model:"Cam Emiş Borusu 17 mm", specifications:"Dış filtreler için şeffaf cam emiş borusu · 17 mm · 16/22 mm hortum uyumlu", sourceUrl:"https://atakanpetshop.com/eurostar-cam-emis-borusu-17mm", verifiedAt:"2026-08-25" },
  { id:"eurostar-digital-adhesive-thermometer", category:"other", brand:"Eurostar", model:"Dijital Yapışkan Termometre", specifications:"Akvaryum camının dış yüzeyinden sıcaklık takibi sağlayan yapışkan dijital termometre", sourceUrl:"https://atakanpetshop.com/eurostar-dijital-yapiskan-termometre", verifiedAt:"2026-08-25" },
  { id:"eurostar-snail-trap-large", category:"other", brand:"Eurostar", model:"Salyangoz Kapanı Large", specifications:"İstenmeyen akvaryum salyangozlarını yemle toplamak için büyük boy kapan · 4 cm taban çapı · 4 cm yükseklik", sourceUrl:"https://atakanpetshop.com/eurostar-salyangoz-kapani-large", verifiedAt:"2026-08-25" },
  { id:"eurostar-digital-thermometer", category:"other", brand:"Eurostar", model:"Dijital Termometre", specifications:"Akvaryum su sıcaklığını izlemek için dijital termometre", sourceUrl:"https://www.akvaryumexpress.com/eurostar/sayfa/2", verifiedAt:"2026-08-25" },
  { id:"eurostar-multifunction-breeder", category:"other", brand:"Eurostar", model:"Plastik Multi Fonksiyon Yavruluk", specifications:"Yavru balık ayırma ve doğum sürecinde kullanım için çok işlevli plastik yavruluk", sourceUrl:"https://www.akvaryumexpress.com/eurostar/sayfa/2", verifiedAt:"2026-08-25" },
  { id:"eurostar-feeding-square-10", category:"other", brand:"Eurostar", model:"Plastik Yemleme Aparatı 10 × 10 cm", specifications:"Yüzen yemlerin dağılmasını sınırlayan kare yemleme çerçevesi · 10 × 10 cm", sourceUrl:"https://www.akvaryumexpress.com/eurostar/sayfa/2", verifiedAt:"2026-08-25" },
  { id:"eurostar-curved-tweezers-48", category:"other", brand:"Eurostar", model:"Paslanmaz Çelik Kıvrımlı Maşa 48 cm", specifications:"Akvaryum bitkisi dikimi ve bakım için paslanmaz çelik kıvrımlı maşa · 48 cm", sourceUrl:"https://www.akvaryumexpress.com/eurostar/sayfa/2", verifiedAt:"2026-08-25" },
  { id:"eurostar-curved-scissors-27", category:"other", brand:"Eurostar", model:"Paslanmaz Çelik Kıvrımlı Makas 27 cm", specifications:"Bitkili akvaryum budaması için paslanmaz çelik kıvrımlı makas · 27 cm", sourceUrl:"https://www.akvaryumexpress.com/ista-akvaryum-urunleri/sayfa/", verifiedAt:"2026-08-25" },
];

const xlproSource = "https://www.akvaryumexpress.com/xlpro";
const xlproFilters: EquipmentProfile[] = [
  {id:"xlpro-230-mini",category:"filter",brand:"XLPro",model:"MINI-230",specifications:"Mini dış filtre · 210 L/saat · 1,7 W",ratedFlowLph:210,powerW:1.7,sourceUrl:"https://www.dogasan.com.tr/xlpro-230-mini-selale-filtre-210-lt-h",verifiedAt},
  {id:"xlpro-mini-500",category:"filter",brand:"XLPro",model:"MINI-500",specifications:"Mini dış filtre · 510 L/saat · 6,9 W · 100 litreye kadar",ratedFlowLph:510,powerW:6.9,recommendedMaxL:100,sourceUrl:"https://atakanpetshop.com/xlpro-500-mini-dis-filtre-510l-s",verifiedAt:"2026-08-24"},
  {id:"xlpro-500at-mini",category:"filter",brand:"XLPro",model:"MINI-500AT",specifications:"Yüzey emicili mini dış filtre · 450 L/saat · 100 litreye kadar",ratedFlowLph:450,recommendedMaxL:100,sourceUrl:"https://akvaryumbalikavm.com.tr/xlpro-500at-mini-dis-filtre-450l-s",verifiedAt:"2026-08-26"},
  {id:"xlpro-ex-1000",category:"filter",brand:"XLPro",model:"EX-1000",specifications:"Üç sepetli dış filtre · 1000 L/saat · 22 W · 200 litreye kadar",ratedFlowLph:1000,powerW:22,recommendedMaxL:200,sourceUrl:"https://atakanpetshop.com/xlpro-ex-1000-dis-filtre-1000lh-dolu-xpef001",verifiedAt:"2026-08-24"},
  {id:"xlpro-ex-1200",category:"filter",brand:"XLPro",model:"EX-1200",specifications:"Dört sepetli dış filtre · 1200 L/saat · 28 W · 280 litreye kadar",ratedFlowLph:1200,powerW:28,recommendedMaxL:280,sourceUrl:"https://atakanpetshop.com/xlpro-ex-1200-dis-filtre-1200lh-dolu-xpef002",verifiedAt:"2026-08-24"},
  {id:"xlpro-ex-1500",category:"filter",brand:"XLPro",model:"EX-1500",specifications:"Beş sepetli dış filtre · 1500 L/saat · 36 W · 300 litreye kadar",ratedFlowLph:1500,powerW:36,recommendedMaxL:300,sourceUrl:"https://www.akvaryumexpress.com/xlpro-ex-1500-dis-filtre-1500l-h-dolu",verifiedAt:"2026-08-24"},
];

const ejetSource = "https://atakanpetshop.com/ejet";
const ejetFilters: EquipmentProfile[] = [
  {id:"ejet-3358",category:"filter",brand:"Ejet",model:"3358",specifications:"İki sepetli dış filtre · güncel yetkili satıcı 750 L/saat, diğer satıcı başlığı 1000 L/saat · güvenli hesap değeri 750 L/saat · 7,6 W · 100–150 litre",ratedFlowLph:750,powerW:7.6,recommendedMinL:100,recommendedMaxL:150,sourceUrl:"https://atakanpetshop.com/ejet-3358-dis-filtre-750-l-h",verifiedAt:"2026-08-25"},
  {id:"ejet-3368",category:"filter",brand:"Ejet",model:"3368",specifications:"Üç sepetli dış filtre · ürün başlığı 1650 L/saat, ayrıntılı teknik değer 1400 L/saat · güvenli hesap değeri 1400 L/saat · 7,6 W · 200–250 litre",ratedFlowLph:1400,powerW:7.6,recommendedMinL:200,recommendedMaxL:250,sourceUrl:"https://atakanpetshop.com/ejet-3368-dis-filtre-1650-l-h",verifiedAt:"2026-08-25"},
  {id:"ejet-3378",category:"filter",brand:"Ejet",model:"3378",specifications:"Dört sepetli dış filtre · ürün başlığı 1850 L/saat, ayrıntılı teknik değer 1750 L/saat · güvenli hesap değeri 1750 L/saat · 12 W · 300–400 litre",ratedFlowLph:1750,powerW:12,recommendedMinL:300,recommendedMaxL:400,sourceUrl:"https://atakanpetshop.com/ejet-3378-dis-filtre-1850-l-h",verifiedAt:"2026-08-25"},
  {id:"ejet-3388",category:"filter",brand:"Ejet",model:"3388",specifications:"Beş sepetli dış filtre · ürün başlığı 2000 L/saat, ayrıntılı teknik değer 1910 L/saat · güvenli hesap değeri 1910 L/saat · 15 W · 350–450 litre",ratedFlowLph:1910,powerW:15,recommendedMinL:350,recommendedMaxL:450,sourceUrl:"https://atakanpetshop.com/ejet-3388-dis-filtre-2000-l-h",verifiedAt:"2026-08-25"},
];
ejetFilters.push(
  {id:"ejet-101",category:"filter",brand:"Ejet",model:"101",specifications:"Hava motoruyla çalışan sünger/pipo üretim filtresi · debi kullanılan hava motoruna bağlıdır",requiresAirPump:true,sourceUrl:"https://malawiizmir.com/ejet-101-pipo-uretim-filtre",verifiedAt:"2026-08-27"},
  {id:"ejet-j103",category:"filter",brand:"Ejet",model:"J103",specifications:"Hava ile çalışan sünger üretim filtresi · 8,5 cm sünger çapı · 13,5 cm yükseklik",requiresAirPump:true,sourceUrl:"https://www.akvaryem.com.tr/urun/e-jet-103-uretim-filtresi",verifiedAt:"2026-08-24"},
  {id:"ejet-102",category:"filter",brand:"Ejet",model:"102",specifications:"Hava ile çalışan pipo filtre",requiresAirPump:true,sourceUrl:"https://www.akvaryem.com.tr/urun/e-jet-102-uretim-filtresi",verifiedAt:"2026-08-24"},
  {id:"ejet-104",category:"filter",brand:"Ejet",model:"104",specifications:"Hava ile çalışan üretim filtresi",requiresAirPump:true,sourceUrl:"https://www.akvaryem.com.tr/urun/e-jet-104-uretim-filtresi",verifiedAt:"2026-08-24"},
  {id:"ejet-bp3",category:"air_pump",brand:"Ejet",model:"BP3",specifications:"Tek çıkışlı pilli hava motoru · 120 L/saat",ratedFlowLph:120,sourceUrl:"https://www.akvaryem.com.tr/urun/jet-bp3-pilli-hava-motoru",verifiedAt},
  {id:"ejet-905f",category:"filter",brand:"Ejet",model:"905F",specifications:"İç filtre · 470 L/saat · 7 W",ratedFlowLph:470,powerW:7,sourceUrl:"https://www.akvaryem.com.tr/urun/e-jet-j905f-ic-filtre-470lt-saat",verifiedAt:"2026-08-24"},
  {id:"ejet-906f",category:"filter",brand:"Ejet",model:"906F",specifications:"İç filtre · ürün başlığı 1050 L/saat, teknik açıklama 1000 L/saat · güvenli hesap değeri 1000 L/saat · 16 W",ratedFlowLph:1000,powerW:16,sourceUrl:"https://www.akvaryem.com.tr/urun/e-jet-j906f-ic-filtre-1050lt-saat",verifiedAt:"2026-08-24"},
  {id:"ejet-907f",category:"filter",brand:"Ejet",model:"907F",specifications:"İç filtre · ürün başlığı 1350 L/saat, teknik açıklama 1500 L/saat · güvenli hesap değeri 1350 L/saat · 25 W",ratedFlowLph:1350,powerW:25,sourceUrl:"https://www.akvaryem.com.tr/urun/e-jet-j907f-ic-filtre-1350lt-saat",verifiedAt:"2026-08-24"},
  {id:"ejet-908f",category:"filter",brand:"Ejet",model:"908F",specifications:"İç filtre · satıcı kaynaklarında 1400–1550 L/saat · güvenli hesap değeri 1400 L/saat · 29,3 W",ratedFlowLph:1400,powerW:29.3,sourceUrl:"https://www.akvaryem.com.tr/urun/e-jet-j908f-ic-filtre-1550lt-saat",verifiedAt:"2026-08-24"},
);

const dophinRetailSource="https://atakanpetshop.com/dophin";
const dophinCurrentFilters:EquipmentProfile[]=[
  {id:"dophin-h200",category:"filter",brand:"Dophin",model:"H200",specifications:"Askı şelale filtre · 370 L/saat · 3,4 W · 75 litreye kadar",ratedFlowLph:370,powerW:3.4,recommendedMaxL:75,sourceUrl:"https://www.qimeigroup.com/Products_detail/dophin-aquarium-slim-hanging-filter-h80.html",verifiedAt:"2026-08-25"},
  {id:"dophin-h300",category:"filter",brand:"Dophin",model:"H300",specifications:"Askı şelale filtre · 440 L/saat · 5,2 W · 100 litreye kadar",ratedFlowLph:440,powerW:5.2,recommendedMaxL:100,sourceUrl:"https://www.qimeigroup.com/Products_detail/dophin-aquarium-slim-hanging-filter-h80.html",verifiedAt:"2026-08-25"},
  {id:"dophin-h500",category:"filter",brand:"Dophin",model:"H500",specifications:"Askı şelale filtre · 580 L/saat · 6,2 W · 150 litreye kadar",ratedFlowLph:580,powerW:6.2,recommendedMaxL:150,sourceUrl:"https://www.qimeigroup.com/Products_detail/dophin-aquarium-slim-hanging-filter-h80.html",verifiedAt:"2026-08-25"},
  {id:"dophin-h800",category:"filter",brand:"Dophin",model:"H800",specifications:"Askı şelale filtre · 1000 L/saat · 8,1 W · 200 litreye kadar",ratedFlowLph:1000,powerW:8.1,recommendedMaxL:200,sourceUrl:"https://www.qimeigroup.com/Products_detail/dophin-aquarium-slim-hanging-filter-h80.html",verifiedAt:"2026-08-25"},
  {id:"dophin-kf150",category:"filter",brand:"Dophin",model:"KF150",specifications:"Oksijenlendirme işlevli kompakt iç filtre · 200 L/saat · 2,8 W · 50 litreye kadar",ratedFlowLph:200,powerW:2.8,recommendedMaxL:50,sourceUrl:"https://www.qimeigroup.com/Products_detail/dophin-aquarium-internal-filter-kf350.html",verifiedAt:"2026-08-25"},
  {id:"dophin-kf160",category:"filter",brand:"Dophin",model:"KF160",specifications:"Oksijenlendirme işlevli kompakt iç filtre · 200 L/saat · 2,8 W · 30 litreye kadar",ratedFlowLph:200,powerW:2.8,recommendedMaxL:30,sourceUrl:"https://www.qimeigroup.com/Products_detail/dophin-aquarium-internal-filter-kf350.html",verifiedAt:"2026-08-25"},
  {id:"dophin-kf200",category:"filter",brand:"Dophin",model:"KF200",specifications:"Oksijenlendirme işlevli kompakt iç filtre · 240 L/saat · 3 W · 50 litreye kadar",ratedFlowLph:240,powerW:3,recommendedMaxL:50,sourceUrl:"https://www.qimeigroup.com/Products_detail/dophin-aquarium-internal-filter-kf350.html",verifiedAt:"2026-08-25"},
  {id:"dophin-kf350",category:"filter",brand:"Dophin",model:"KF350",specifications:"Oksijenlendirme işlevli kompakt iç filtre · 280 L/saat · 4,5 W · 70 litreye kadar",ratedFlowLph:280,powerW:4.5,recommendedMaxL:70,sourceUrl:"https://www.qimeigroup.com/Products_detail/dophin-aquarium-internal-filter-kf350.html",verifiedAt:"2026-08-25"},
  {id:"dophin-fb1000f",category:"filter",brand:"Dophin",model:"FB1000 F",specifications:"Aktif karbon kartuşlu iç filtre · 300 L/saat",ratedFlowLph:300,sourceUrl:dophinRetailSource,verifiedAt},
  {id:"dophin-fb3000f",category:"filter",brand:"Dophin",model:"FB3000 F",specifications:"Aktif karbon kartuşlu iç filtre · 500 L/saat · 50–90 litre",ratedFlowLph:500,recommendedMinL:50,recommendedMaxL:90,sourceUrl:"https://atakanpetshop.com/dophin-fb3000-f-ic-filtre-500-l-s",verifiedAt},
  {id:"dophin-fb4000f",category:"filter",brand:"Dophin",model:"FB4000 F",specifications:"Aktif karbon kartuşlu iç filtre · 600 L/saat",ratedFlowLph:600,sourceUrl:dophinRetailSource,verifiedAt},
  {id:"dophin-sf15",category:"filter",brand:"Dophin",model:"SF15",specifications:"Hava motoruyla çalışan biyolojik pipo filtre",requiresAirPump:true,sourceUrl:dophinRetailSource,verifiedAt},
  {id:"dophin-sf33",category:"filter",brand:"Dophin",model:"SF33",specifications:"Hava motoruyla çalışan biyolojik pipo filtre",requiresAirPump:true,sourceUrl:dophinRetailSource,verifiedAt},
  {id:"dophin-cf300",category:"filter",brand:"Dophin",model:"CF-300",specifications:"Mini dış filtre · 410 L/saat · 6,7 W · 40 litreye kadar",ratedFlowLph:410,powerW:6.7,recommendedMaxL:40,sourceUrl:"https://www.avmatik.com/dophin-cf-300-dis-filtre-300-l-h-200-cf300",verifiedAt},
  {id:"dophin-ap1302",category:"air_pump",brand:"Dophin",model:"AP1302",specifications:"Akvaryum hava motoru · 96 L/saat · 2 W",ratedFlowLph:96,powerW:2,sourceUrl:"https://www.flipkart.com/dophin-ap-1302-air-aquarium-pump/p/itmfhnxdzyy7ccgd",verifiedAt},
];
dophinCurrentFilters.push(
  {id:"dophin-h80",category:"filter",brand:"Dophin",model:"H80",specifications:"Askı şelale filtre · 190 L/saat · 2,7 W · 25 litreye kadar",ratedFlowLph:190,powerW:2.7,recommendedMaxL:25,sourceUrl:"https://www.qimeigroup.com/Products_detail/dophin-aquarium-slim-hanging-filter-h80.html",verifiedAt:"2026-08-25"},
  {id:"dophin-h100",category:"filter",brand:"Dophin",model:"H100",specifications:"Askı şelale filtre · 350 L/saat · 3,4 W · 50 litreye kadar",ratedFlowLph:350,powerW:3.4,recommendedMaxL:50,sourceUrl:"https://www.qimeigroup.com/Products_detail/dophin-aquarium-slim-hanging-filter-h80.html",verifiedAt:"2026-08-25"},
  ...([["688",800,10,20,5,110,190],["888",1000,10,21.5,7,120,200],["1288",1200,13.2,25.5,9,130,210],["1488",1400,17,29.3,9,140,230]] as const).flatMap(([model,flow,basePower,uvPower,uvW,minL,maxL])=>[
    {id:`dophin-cf-${model}`,category:"filter" as const,brand:"Dophin",model:`CF${model}`,specifications:`Çok kademeli dış filtre · ${flow} L/saat · ${String(basePower).replace(".",",")} W · ${minL}–${maxL} litre`,ratedFlowLph:flow,powerW:basePower,recommendedMinL:minL,recommendedMaxL:maxL,sourceUrl:"https://www.qimeigroup.com/Products_detail/dophin-aquarium-external-uv-canister-filter-cf688.html",verifiedAt:"2026-08-25"},
    {id:`dophin-cf-${model}-uv`,category:"filter" as const,brand:"Dophin",model:`CF${model}UV`,specifications:`Entegre ${uvW} W UV-C'li çok kademeli dış filtre · ${flow} L/saat · toplam ${String(uvPower).replace(".",",")} W · ${minL}–${maxL} litre`,ratedFlowLph:flow,powerW:uvPower,integratedUvcW:uvW,recommendedMinL:minL,recommendedMaxL:maxL,sourceUrl:"https://www.qimeigroup.com/Products_detail/dophin-aquarium-external-uv-canister-filter-cf688.html",verifiedAt:"2026-08-25"},
  ]),
  ...([[2000,300,3.1,40],[3000,350,3.1,60],[5000,400,4.5,80],[6000,500,4.5,100]] as const).map(([model,flow,power,maxL])=>({id:`dophin-a-${model}`,category:"filter" as const,brand:"Dophin",model:`A-${model}`,specifications:`Medya kutulu ayarlanabilir askı filtre · ${flow} L/saat · ${String(power).replace(".",",")} W`,ratedFlowLph:flow,powerW:power,recommendedMaxL:maxL,adjustableFlow:true,sourceUrl:"https://www.qimeigroup.com/Products_detail/dophin-aquarium-hanging-filter-a2000.html",verifiedAt:"2026-08-18"})),
  ...([[300,300,4.5,50],[500,450,6,100],[800,650,12,150]] as const).map(([model,flow,power,maxL])=>({id:`dophin-tf-${model}`,category:"filter" as const,brand:"Dophin",model:`TF-${model}`,specifications:`Yatay kullanıma uygun iç filtre · ${flow} L/saat · ${String(power).replace(".",",")} W`,ratedFlowLph:flow,powerW:power,recommendedMaxL:maxL,sourceUrl:"https://www.qimeigroup.com/Products_detail/dophin-aquarium-internal-filter-tf300.html",verifiedAt:"2026-08-18"})),
  ...([[200,150,2.8,20],[250,250,4,40],[280,280,4.1,60],[380,380,4,80]] as const).map(([model,flow,power,maxL])=>({id:`dophin-sh-${model}`,category:"filter" as const,brand:"Dophin",model:`SH-${model}`,specifications:`Yüzey yağ sıyırıcılı ince askı filtre · ${flow} L/saat · ${String(power).replace(".",",")} W · ${maxL} litreye kadar`,ratedFlowLph:flow,powerW:power,recommendedMaxL:maxL,sourceUrl:"https://www.qimeigroup.com/Products_detail/dophin-aquarium-slim-hanging-filter-sh380.html",verifiedAt:"2026-08-25"})),
  ...([["CF600",650,9.3,20,5,100,160],["CF700",750,9.3,20.8,7,120,200],["CF800",850,9.3,20.8,7,140,230],["CF1200",1200,13.2,25.5,9,170,280],["CF1400",1400,17,29.3,9,190,310],["C2400",3000,47,58,9,400,660]] as const).flatMap(([model,flow,basePower,uvPower,uvW,minL,maxL])=>([
    {id:`dophin-${model.toLowerCase()}`,category:"filter" as const,brand:"Dophin",model,specifications:`Çok kademeli dış filtre · ${flow} L/saat · ${String(basePower).replace(".",",")} W · ${minL}–${maxL} litre`,ratedFlowLph:flow,powerW:basePower,recommendedMinL:minL,recommendedMaxL:maxL,sourceUrl:"https://www.qimeigroup.com/Products_detail/dophin-external-aquarium-uv-canister-filter-cf600.html",verifiedAt:"2026-08-25"},
    {id:`dophin-${model.toLowerCase()}-uv`,category:"filter" as const,brand:"Dophin",model:`${model}UV`,specifications:`Entegre ${uvW} W UV-C'li çok kademeli dış filtre · ${flow} L/saat · toplam ${String(uvPower).replace(".",",")} W · ${minL}–${maxL} litre`,ratedFlowLph:flow,powerW:uvPower,integratedUvcW:uvW,recommendedMinL:minL,recommendedMaxL:maxL,sourceUrl:"https://www.qimeigroup.com/Products_detail/dophin-external-aquarium-uv-canister-filter-cf600.html",verifiedAt:"2026-08-25"},
  ])),
  ...([25,50,100,150,200,300,500] as const).flatMap(powerW=>(["1006","1008"] as const).map(series=>({id:`dophin-ah-${series}-${powerW}`,category:"heater" as const,brand:"Dophin",model:`AH-${series} ${powerW} W`,specifications:`Termostatlı ayarlanabilir cam ısıtıcı · ${powerW} W · ${powerW} litreye kadar`,powerW,recommendedMaxL:powerW,sourceUrl:`https://www.qimeigroup.com/Products_detail/dophin-aquarium-${series==="1006"?"heater-ah1006":"submersible-heater-ah1008"}.html`,verifiedAt:"2026-08-18"}))),
  ...([[2030,9.5,"27–36"],[2045,13.5,"42–51"],[2060,18,"57–66"],[2080,22,"77–86"],[2090,24.5,"87–96"],[20120,29.5,"117–126"]] as const).map(([model,power,length])=>({id:`dophin-led-${model}`,category:"lighting" as const,brand:"Dophin",model:`LED${model}`,specifications:`IP67, RA95 ince LED armatür · ${length} cm akvaryum · ${String(power).replace(".",",")} W`,powerW:power,sourceUrl:"https://www.qimeigroup.com/Products_detail/dophin-aquarium-slim-led-light-led2030.html",verifiedAt:"2026-08-18"})),
  {id:"dophin-led-106",category:"lighting",brand:"Dophin",model:"LED 106",specifications:"Dokunmatik, kısılabilir ince LED · 4 W",powerW:4,sourceUrl:"https://www.qimeigroup.com/Products_detail/dophin-aquarium-led-light-led106-led108.html",verifiedAt:"2026-08-18"},
  {id:"dophin-led-108",category:"lighting",brand:"Dophin",model:"LED 108",specifications:"Dokunmatik, kısılabilir ince LED · 5 W",powerW:5,sourceUrl:"https://www.qimeigroup.com/Products_detail/dophin-aquarium-led-light-led106-led108.html",verifiedAt:"2026-08-18"},
  {id:"dophin-led-109",category:"lighting",brand:"Dophin",model:"LED 109",specifications:"12 beyaz + 3 mavi LED'li ultra ince armatür · 120° ışık dağılımı · 3,4 W",powerW:3.4,sourceUrl:"https://www.qimeigroup.com/Products_detail/dophin-aquarium-led-light-led109.html",verifiedAt:"2026-08-25"},
  {id:"dophin-cf388",category:"filter",brand:"Dophin",model:"CF388",specifications:"360° yüzey yağ sıyırıcılı, oksijenlendirmeli ayarlanabilir mini askı dış filtre · 330 L/saat",ratedFlowLph:330,adjustableFlow:true,sourceUrl:"https://www.qimeigroup.com/Products_detail/dophin-mini-canister-filter.html",verifiedAt:"2026-08-25"},
  ...([[300,300,4.5,50],[500,500,undefined,100],[1000,1000,10,300],[2000,2000,32,400],[3000,3000,45,500],[4000,4000,75,600],[5000,5000,125,800]] as const).map(([model,flow,power,maxL])=>({id:`dophin-pc-${model}`,category:"other" as const,brand:"Dophin",model:`PC-${model}`,specifications:`Ayarlanabilir dalgıç sirkülasyon pompası · ${flow} L/saat${power?` · ${String(power).replace(".",",")} W`:""}`,ratedFlowLph:flow,...(power?{powerW:power}:{}),recommendedMaxL:maxL,adjustableFlow:true,sourceUrl:"https://www.qimeigroup.com/Products_detail/128.html",verifiedAt:"2026-08-18"})),
  {id:"dophin-wp-1000",category:"other",brand:"Dophin",model:"WP-1000",specifications:"Yönlendirilebilir dalga motoru · 2000 L/saat · 3,8 W · 30–190 L",ratedFlowLph:2000,powerW:3.8,recommendedMinL:30,recommendedMaxL:190,sourceUrl:"https://www.qimeigroup.com/Products_detail/dophin-aquarium-wave-pump-wave-maker-wp1000.html",verifiedAt:"2026-08-18"},
  {id:"dophin-wp-3000",category:"other",brand:"Dophin",model:"WP-3000",specifications:"Yönlendirilebilir dalga motoru · 5000 L/saat · 6 W · 190–380 L",ratedFlowLph:5000,powerW:6,recommendedMinL:190,recommendedMaxL:380,sourceUrl:"https://www.qimeigroup.com/Products_detail/dophin-aquarium-wave-pump-wave-maker-wp1000.html",verifiedAt:"2026-08-18"},
);

const rsSource = "https://www.petadana01.com/akvaryum-ic-filtre/";
const rsFilters: EquipmentProfile[] = ["RS602","RS605","RS2004","RS800","RS604","RS712","RS2002","RS760","RS-04B"].map(model=>({
  id:`rs-${model.toLowerCase()}`,category:"filter",brand:"RS Electrical",model,specifications:"İç filtre · model teknik bilgisi doğrulama bekliyor",sourceUrl:rsSource,verifiedAt,
}));
const rs712=rsFilters.find(item=>item.model==="RS712");if(rs712){rs712.model="RS 712";rs712.specifications="İç filtre · 350 L/saat · 4 W";rs712.ratedFlowLph=350;rs712.powerW=4;rs712.sourceUrl="https://malawiizmir.com/rs-712-ic-filtre-4w-350l-h";}
const rsVerified:Record<string,Partial<EquipmentProfile>>={
  "RS602":{model:"RS-602",specifications:"İç filtre · 300 L/saat · 3 W · 20–40 litre",ratedFlowLph:300,powerW:3,recommendedMinL:20,recommendedMaxL:40,sourceUrl:"https://kaspi.kz/shop/p/rs-electrical-vnutrennii-rs-602-130650929/"},
  "RS605":{model:"RS-605",specifications:"İç filtre · 450 L/saat · 6 W · 90 litreye kadar",ratedFlowLph:450,powerW:6,recommendedMaxL:90,sourceUrl:"https://www.trendyol.com/en/rs-electrical/aquarium-internal-filter-rs-605-6w-450-l-h-p-335528547"},
  "RS2004":{model:"RS-2004",specifications:"İç filtre · 1750 L/saat · 25 W",ratedFlowLph:1750,powerW:25,sourceUrl:"https://www.dayaaquatics.com/index.php?cat=Aquarium-Filter-Categories&products_id=2165910&subcat=Internal-Filter&ws=showproducts"},
  "RS800":{model:"RS-800",category:"air_pump",specifications:"Çift çıkışlı hava motoru · 3 L/dakika · 3,5 W",ratedFlowLph:180,powerW:3.5,sourceUrl:"https://m-once.com/producto/rs-800-j004rs800/"},
  "RS604":{model:"RS-604",specifications:"Üç işlevli iç filtre · 350 L/saat · 4 W",ratedFlowLph:350,powerW:4,sourceUrl:"https://www.daraz.com.bd/i304500232-s1358956807.html"},
  "RS2002":{model:"RS-2002",specifications:"İç filtre · 1500 L/saat · 18 W",ratedFlowLph:1500,powerW:18,sourceUrl:"https://www.ciceksepeti.com/rs-electrical-rs-2002-akvaryum-ic-filtre-18w-1500-lh-kcm63436178"},
  "RS760":{model:"RS-760",specifications:"Dalgıç iç filtre · 650 L/saat · 10 W",ratedFlowLph:650,powerW:10,sourceUrl:"https://aqualink-shop.com/products/rs-760"},
  "RS-04B":{specifications:"Hava motoruyla çalışan biyolojik ve karbonlu filtre · 10–50 litre",recommendedMinL:10,recommendedMaxL:50,sourceUrl:"https://www.aquagreen.pet/products/rs04b-airoperated-aquarium-filter-for-10l50l-tanks-ecofriendly-biological-carbon-filtration-with-replaceable-sponge-ideal-for-betta-shrimp-small-fish-tanks-rs-04b"},
};
for(const item of rsFilters){Object.assign(item,rsVerified[item.model]??{});}
rsFilters.push(
  {id:"rs-118f",category:"filter",brand:"RS Electrical",model:"RS-118F",specifications:"İç filtre · 400 L/saat · 4 W",ratedFlowLph:400,powerW:4,sourceUrl:"https://www.akakce.com/akvaryum-filtresi/rs.html",verifiedAt},
  {id:"rs-062a",category:"filter",brand:"RS Electrical",model:"RS-062A",specifications:"İç filtre · 300 L/saat · 2 W",ratedFlowLph:300,powerW:2,sourceUrl:"https://www.akakce.com/akvaryum-filtresi/rs.html",verifiedAt},
  {id:"rs-082a",category:"filter",brand:"RS Electrical",model:"RS-082A",specifications:"İç filtre · 450 L/saat · 6 W",ratedFlowLph:450,powerW:6,sourceUrl:"https://www.akakce.com/akvaryum-filtresi/rs.html",verifiedAt},
  {id:"rs-1000-hob",category:"filter",brand:"RS Electrical",model:"FA1000",specifications:"Ayarlanabilir askı filtre · 600 L/saat · 2,5 W · 120 litreye kadar",ratedFlowLph:600,powerW:2.5,recommendedMaxL:120,adjustableFlow:true,sourceUrl:"https://atakanpetshop.com/rs-1000-aski-filtre-600l-h-2-5w",verifiedAt:"2026-08-26"},
  {id:"rs-fa2000",category:"filter",brand:"RS Electrical",model:"FA2000",specifications:"Ayarlanabilir askı filtre · 800 L/saat · 5 W · 160 litreye kadar",ratedFlowLph:800,powerW:5,recommendedMaxL:160,adjustableFlow:true,sourceUrl:"https://atakanpetshop.com/rs-2000-aski-filtre-800l-h-5w",verifiedAt:"2026-08-26"},
  {id:"rs-fa3000",category:"filter",brand:"RS Electrical",model:"FA3000",specifications:"Ayarlanabilir askı filtre · 1200 L/saat · 7 W · 240 litreye kadar",ratedFlowLph:1200,powerW:7,recommendedMaxL:240,adjustableFlow:true,sourceUrl:"https://atakanpetshop.com/rs-3000-aski-filtre-1200l-h-7w",verifiedAt:"2026-08-26"},
  {id:"rs-fa4000",category:"filter",brand:"RS Electrical",model:"FA4000",specifications:"Ayarlanabilir askı filtre · 1600 L/saat · 10 W · 320 litreye kadar",ratedFlowLph:1600,powerW:10,recommendedMaxL:320,adjustableFlow:true,sourceUrl:"https://atakanpetshop.com/rs-4000-aski-filtre-1600l-h-10w",verifiedAt:"2026-08-26"},
  {id:"rs-fa5000",category:"filter",brand:"RS Electrical",model:"FA5000",specifications:"Ayarlanabilir askı filtre · 280 L/saat · 2 W · 56 litreye kadar",ratedFlowLph:280,powerW:2,recommendedMaxL:56,adjustableFlow:true,sourceUrl:"https://atakanpetshop.com/rs-5000-aski-filtre-280l-h-2w",verifiedAt:"2026-08-26"},
  {id:"rs-fa6000",category:"filter",brand:"RS Electrical",model:"FA6000",specifications:"Ayarlanabilir askı filtre · 350 L/saat · 3 W · 70 litreye kadar",ratedFlowLph:350,powerW:3,recommendedMaxL:70,adjustableFlow:true,sourceUrl:"https://atakanpetshop.com/rs-6000-aski-filtre-350l-h-3w",verifiedAt:"2026-08-26"},
  {id:"rs-188-top",category:"filter",brand:"RS Electrical",model:"RS-188 Tepe",specifications:"Tepe filtre · 800 L/saat · 12 W",ratedFlowLph:800,powerW:12,sourceUrl:"https://www.n11.com/evcil-hayvan-urunleri/balik/dis-filtre?m=Rs+Electrical",verifiedAt},
  {id:"rs-288-top",category:"filter",brand:"RS Electrical",model:"RS-288 Tepe",specifications:"Tepe filtre · 1200 L/saat · 15 W · 240 litreye kadar",ratedFlowLph:1200,powerW:15,recommendedMaxL:240,sourceUrl:"https://atakanpetshop.com/rs-288-tepe-filtre-1200l-h-15w",verifiedAt:"2026-08-26"},
  {id:"rs-388-top",category:"filter",brand:"RS Electrical",model:"RS-388 Tepe",specifications:"Tepe filtre · 1750 L/saat · 25 W",ratedFlowLph:1750,powerW:25,sourceUrl:"https://www.n11.com/evcil-hayvan-urunleri/balik/dis-filtre?m=Rs+Electrical",verifiedAt},
  {id:"rs-fa7000",category:"filter",brand:"RS Electrical",model:"FA7000",specifications:"Ayarlanabilir askı filtre · 600 L/saat · 4,5 W · 120 litreye kadar",ratedFlowLph:600,powerW:4.5,recommendedMaxL:120,adjustableFlow:true,sourceUrl:"https://atakanpetshop.com/rs-7000-aski-filtre-600l-h-4-5w",verifiedAt:"2026-08-26"},
  {id:"rs-99-uv",category:"filter",brand:"RS Electrical",model:"RS-99 UV",specifications:"Ayarlanabilir UV'li iç filtre · 800 L/saat · 8 W + 9 W UV-C",ratedFlowLph:800,powerW:8,integratedUvcW:9,recommendedMaxL:160,adjustableFlow:true,sourceUrl:"https://atakanpetshop.com/rs-99-9w-uv-lambali-ic-filtre-8w-800l-h",verifiedAt},
  {id:"rs-613",category:"filter",brand:"RS Electrical",model:"RS 613",specifications:"İç filtre · 450 L/saat · 5 W",ratedFlowLph:450,powerW:5,sourceUrl:"https://malawiizmir.com/rs-613-ic-filtre-5w-450-l-h",verifiedAt},
  {id:"rs-313-air",category:"air_pump",brand:"RS Electrical",model:"RS 313",specifications:"Tek çıkışlı şarjlı hava motoru · 1,5 L/dakika (90 L/saat) · 1 W · 40 litreye kadar",ratedFlowLph:90,powerW:1,recommendedMaxL:40,sourceUrl:"https://atakanpetshop.com/rs-313-tek-cikisli-sarjli-hava-motoru-1-5l-min-1w",verifiedAt:"2026-08-26"},
  {id:"rs-960-air",category:"air_pump",brand:"RS Electrical",model:"RS 960",specifications:"Tek çıkışlı pilli hava motoru · 2 L/dakika (120 L/saat) · 50 litreye kadar",ratedFlowLph:120,recommendedMaxL:50,sourceUrl:"https://atakanpetshop.com/rs-960-tek-cikisli-pilli-hava-motoru-sari-2l-min",verifiedAt:"2026-08-26"},
  {id:"rs-1000-air",category:"air_pump",brand:"RS Electrical",model:"RS 1000",specifications:"Dört çıkışlı ayarlanabilir hava motoru · toplam 9 L/dakika (540 L/saat) · 8 W · 200 litreye kadar",ratedFlowLph:540,powerW:8,recommendedMaxL:200,adjustableFlow:true,sourceUrl:"https://atakanpetshop.com/rs-1000-4-cikisli-hava-motoru-9l-min-8w",verifiedAt:"2026-08-29"},
  {id:"rs-fu430k",category:"filter",brand:"RS Electrical",model:"FU430K",specifications:"Hava motoruyla çalışan biyolojik sünger filtre · 12 × 14 cm",requiresAirPump:true,sourceUrl:"https://atakanpetshop.com/rs-fu430k-biyolojik-sunger-filtre-12x14cm",verifiedAt:"2026-08-26"},
  {id:"rs-sf331",category:"other",brand:"RS Electrical",model:"SF331 Soğutucu Fan",specifications:"Akvaryum su yüzeyi için tekli soğutucu fan",sourceUrl:"https://atakanpetshop.com/rs-sf331-akvaryum-sogutucu-fan-tekli",verifiedAt:"2026-08-26"},
  {id:"rs-sf332",category:"other",brand:"RS Electrical",model:"SF332 Soğutucu Fan",specifications:"Akvaryum su yüzeyi için tekli soğutucu fan",sourceUrl:"https://atakanpetshop.com/rs-sf332-akvaryum-sogutucu-fan-tekli",verifiedAt:"2026-08-26"},
  {id:"rs-mt27",category:"other",brand:"RS Electrical",model:"MT27 Mıknatıslı Cam Sileceği",specifications:"Kaplumbağa şekilli mıknatıslı akvaryum cam sileceği",sourceUrl:"https://atakanpetshop.com/rs-mt27-kaplumbaga-sekilli-miknatisli-cam-silecegi",verifiedAt:"2026-08-26"},
  {id:"rs-s1",category:"other",brand:"RS Electrical",model:"S1 Pompalı Dip Sifonu",specifications:"Pompalı akvaryum dip sifonu · 17 cm",sourceUrl:"https://atakanpetshop.com/rs-s1-pompali-akvaryum-dip-sifonu-17cm",verifiedAt:"2026-08-26"},
  ...([25,50,100,200,300,500] as const).map(powerW=>({id:`rs-i399-${powerW}`,category:"heater" as const,brand:"RS Electrical",model:`I399 ${powerW} W Çelik Isıtıcı`,specifications:`20–32 °C ayarlanabilir paslanmaz çelik ısıtıcı · ${powerW} W · ${powerW} litreye kadar`,powerW,recommendedMaxL:powerW,sourceUrl:`https://atakanpetshop.com/rs-celik-akvaryum-isiticisi-${powerW}w`,verifiedAt:"2026-08-26"})),
  ...([50,100,200,300] as const).map(powerW=>({id:`rs-758-${powerW}`,category:"heater" as const,brand:"RS Electrical",model:`758 ${powerW} W Cam Isıtıcı`,specifications:`18–32 °C ayarlanabilir kuvars cam ısıtıcı · ${powerW} W · ${powerW} litreye kadar`,powerW,recommendedMaxL:powerW,sourceUrl:`https://atakanpetshop.com/rs-cam-akvaryum-isiticisi-${powerW}w`,verifiedAt:"2026-08-26"})),
);

const lifetechSource="https://atakanpetshop.com/lifetech";
const lifetechEquipment:EquipmentProfile[]=[
  {id:"lifetech-jebo-mini-420",category:"filter",brand:"Lifetech",model:"Jebo Mini 420",specifications:"Kompakt dış filtre · 420 L/saat · 5 W · 60–200 litre",ratedFlowLph:420,powerW:5,recommendedMinL:60,recommendedMaxL:200,sourceUrl:"https://atakanpetshop.com/jebo-mini-dis-filtre-420-l-s-5w",verifiedAt:"2026-08-18"},
  {id:"lifetech-635",category:"filter",brand:"Lifetech",model:"635",specifications:"Dış filtre · 600 L/saat · 13 W",ratedFlowLph:600,powerW:13,recommendedMinL:100,recommendedMaxL:200,sourceUrl:"https://atakanpetshop.com/lifetech-635-dis-filtre-600-l-s",verifiedAt},
  {id:"lifetech-835",category:"filter",brand:"Lifetech",model:"835",specifications:"Üç sepetli dış filtre · 1000 L/saat · 22 W · 100–300 litre",ratedFlowLph:1000,powerW:22,recommendedMinL:100,recommendedMaxL:300,sourceUrl:"https://atakanpetshop.com/lifetech-835-dis-filtre-1000-l-s",verifiedAt},
  {id:"lifetech-838",category:"filter",brand:"Lifetech",model:"838",specifications:"Dış filtre · 1200 L/saat",ratedFlowLph:1200,recommendedMinL:200,recommendedMaxL:400,sourceUrl:"https://atakanpetshop.com/lifetech-838-dis-filtre-1200-l-s?page=1",verifiedAt},
  {id:"lifetech-839",category:"filter",brand:"Lifetech",model:"839",specifications:"Beş sepetli dış filtre · 1500 L/saat · 35 W · 400–600 litre",ratedFlowLph:1500,powerW:35,recommendedMinL:400,recommendedMaxL:600,sourceUrl:"https://atakanpetshop.com/lifetech-839-dis-filtre-1500-l-s",verifiedAt},
  ...[5,9,11,13,18,36].map(powerW=>({id:`lifetech-uv-h${powerW}`,category:"uv" as const,brand:"Lifetech",model:`Jebo UV-H${powerW}`,specifications:`UV sterilizatör · ${powerW} W`,powerW,sourceUrl:lifetechSource,verifiedAt})),
];
const lifetechPumpSource="https://bomhoca.com/danh-muc/may-bom-ho-ca/may-bom-ho-ca-lifetech/";
lifetechEquipment.push(
  ...[
    {model:"AP1000",flow:400,power:6.5},
    {model:"AP1200",flow:600,power:8.5},
    {model:"AP1300",flow:650,power:8.5},
    {model:"AP1550",flow:1200,power:18},
    {model:"AP1600",flow:900,power:23},
    {model:"AP2000",flow:1300,power:26},
    {model:"AP2500",flow:2000,power:30},
    {model:"AP2500D",flow:2000,power:32},
    {model:"AP3100",flow:1350,power:28},
    {model:"AP4500",flow:2600,power:50},
    {model:"AP4550",flow:3300,power:65},
    {model:"AP5200",flow:3500,power:70},
    {model:"AP5300",flow:3000,power:75},
    {model:"AP5400",flow:3500,power:100},
    {model:"AP5600",flow:6000,power:150},
    {model:"AP5800",flow:12000,power:360},
    {model:"AP6500",flow:3400,power:120},
  ].map(({model,flow,power})=>({
    id:`lifetech-${model.toLowerCase()}`,
    category:"other" as const,
    brand:"Lifetech",
    model,
    specifications:`Dalgıç su pompası · ${flow} L/saat · ${power} W`,
    ratedFlowLph:flow,
    powerW:power,
    sourceUrl:lifetechPumpSource,
    verifiedAt:"2026-08-24",
  })),
  {id:"lifetech-ap3500",category:"other",brand:"Lifetech",model:"AP3500",specifications:"Dalgıç su pompası · 60 W · farklı satış bölgelerinde yayımlanan debi değerleri uyuşmuyor",powerW:60,sourceUrl:lifetechPumpSource,verifiedAt:"2026-08-24"},
);
Object.assign(lifetechEquipment.find(item=>item.model==="Jebo UV-H9")!,{specifications:"UV sterilizatör · 9 W · azami 500 L/saat akış · 1000 litreye kadar",ratedFlowLph:500,recommendedMaxL:1000,sourceUrl:"https://atakanpetshop.com/jebo-uv-h9-ultraviole-filtre-9w"});

const jblExpandedEquipment:EquipmentProfile[]=[
  {id:"jbl-procristal-i30",category:"filter",brand:"JBL",model:"ProCristal i30",specifications:"Karides güvenli ayarlanabilir iç filtre · 200 L/saat · 3,7 W · 10–60 L",ratedFlowLph:200,powerW:3.7,recommendedMinL:10,recommendedMaxL:60,adjustableFlow:true,sourceUrl:"https://www.jbl.de/en/products/detail/7324/jbl-procristal-i30",verifiedAt},
  {id:"jbl-cristalprofi-i60",category:"filter",brand:"JBL",model:"CristalProfi i60 greenline",specifications:"Modüler iç filtre · 150–420 L/saat · 4 W · 40–80 L",ratedFlowLph:420,powerW:4,recommendedMinL:40,recommendedMaxL:80,adjustableFlow:true,sourceUrl:"https://www.jbl.de/en/products/detail/5956/jbl-cristalprofi-i60-greenline",verifiedAt},
  {id:"jbl-cristalprofi-i80",category:"filter",brand:"JBL",model:"CristalProfi i80 greenline",specifications:"Modüler ayarlanabilir iç filtre · 150–420 L/saat · 4 W · 60–110 L",ratedFlowLph:420,powerW:4,recommendedMinL:60,recommendedMaxL:110,adjustableFlow:true,sourceUrl:"https://www.jbl.de/de/produkte/group/1079/innenfilter",verifiedAt},
  {id:"jbl-cristalprofi-i100",category:"filter",brand:"JBL",model:"CristalProfi i100 greenline",specifications:"Modüler iç filtre · 300–720 L/saat · 8 W · 90–160 L",ratedFlowLph:720,powerW:8,recommendedMinL:90,recommendedMaxL:160,adjustableFlow:true,sourceUrl:"https://www.jbl.de/en/products/detail/5960/jbl-cristalprofi-i100-greenline",verifiedAt},
  {id:"jbl-cristalprofi-i200",category:"filter",brand:"JBL",model:"CristalProfi i200 greenline",specifications:"Modüler iç filtre · 300–720 L/saat · 8 W · 130–200 L",ratedFlowLph:720,powerW:8,recommendedMinL:130,recommendedMaxL:200,adjustableFlow:true,sourceUrl:"https://www.jbl.de/en/products/detail/5962/jbl-cristalprofi-i200-greenline",verifiedAt},
  {id:"jbl-protemp-e300",category:"heater",brand:"JBL",model:"ProTemp e300",specifications:"Dış filtre hattı dijital ısıtıcısı · 300 W · 90–300 L",powerW:300,recommendedMinL:90,recommendedMaxL:300,sourceUrl:"https://www.jbl.de/en/blog/detail/473/video-jbl-protemp-e-external-heater-for-aquariums-keeping-electricity-and-technology-outside-the-aquarium",verifiedAt},
  {id:"jbl-protemp-e500",category:"heater",brand:"JBL",model:"ProTemp e500",specifications:"Dış filtre hattı dijital ısıtıcısı · 500 W · 160–600 L",powerW:500,recommendedMinL:160,recommendedMaxL:600,sourceUrl:"https://www.jbl.de/en/products/detail/8744/jbl-protemp-e500",verifiedAt},
  {id:"jbl-proair-a60",category:"air_pump",brand:"JBL",model:"ProAir a60",specifications:"Tek çıkışlı hava motoru · 60 L/saat · 120 litreye kadar",ratedFlowLph:60,recommendedMaxL:120,sourceUrl:"https://www.jbl.de/en/products-beta/jbl-shop-for-aquarium-pond-terrarium",verifiedAt},
  {id:"jbl-proair-a100",category:"air_pump",brand:"JBL",model:"ProAir a100",specifications:"Elektronik ayarlı hava motoru · 100 L/saat · 2,5 W · 200 litreye kadar",ratedFlowLph:100,powerW:2.5,recommendedMaxL:200,sourceUrl:"https://www.jbl.de/en-us/productsv2/detail/25136630",verifiedAt},
  {id:"jbl-proair-a200",category:"air_pump",brand:"JBL",model:"ProAir a200",specifications:"Elektronik ayarlı hava motoru · 200 L/saat · 3,2 W · 300 litreye kadar",ratedFlowLph:200,powerW:3.2,recommendedMaxL:300,sourceUrl:"https://www.jbl.de/en-mt/productsv2/detail/25141072",verifiedAt},
  {id:"jbl-proair-a400",category:"air_pump",brand:"JBL",model:"ProAir a400",specifications:"İki çıkışlı elektronik ayarlı hava motoru · 400 L/saat · 5 W · 400 litreye kadar",ratedFlowLph:400,powerW:5,recommendedMaxL:400,sourceUrl:"https://www.jbl.de/en-ie/productsv2/detail/25148678",verifiedAt},
  {id:"jbl-proair-a600",category:"air_pump",brand:"JBL",model:"ProAir a600",specifications:"İki çıkışlı elektronik ayarlı hava motoru · 600 L/saat · 10 W · 800 litreye kadar",ratedFlowLph:600,powerW:10,recommendedMaxL:800,sourceUrl:"https://www.jbl.de/en-fi/productsv2/detail/25149347",verifiedAt},
];

const yikedaEquipment:EquipmentProfile[]=[
  {id:"yikeda-sd48ab",category:"lighting",brand:"Yikeda",model:"SD-48A-B",specifications:"Full spectrum klipsli LED · 15,2 W",powerW:15.2,sourceUrl:"https://atakanpetshop.com/yikeda-led-akvaryum-aydinlatmasi-beyaz-152w-sd-48a-b",verifiedAt:"2026-08-26"},
  {id:"yikeda-sd48as",category:"lighting",brand:"Yikeda",model:"SD-48A-S",specifications:"Siyah gövdeli full spectrum klipsli LED · 15,2 W",powerW:15.2,sourceUrl:"https://atakanpetshop.com/yikeda-led-akvaryum-aydinlatmasi-siyah-152w-sd-48a-s",verifiedAt:"2026-08-25"},
  {id:"yikeda-ykd6124-white",category:"lighting",brand:"Yikeda",model:"YKD-6124 Optik LED Beyaz",specifications:"Optik lensli, 360° esnek kollu klipsli LED · 10,4 W · beyaz gövde",powerW:10.4,sourceUrl:"https://atakanpetshop.com/yikeda-ykd-6124-optik-led-aydinlatma-10-4w-beyaz",verifiedAt:"2026-08-25"},
  {id:"yikeda-ykd6124-black",category:"lighting",brand:"Yikeda",model:"YKD-6124 Optik LED Siyah",specifications:"Optik lensli, 360° esnek kollu klipsli LED · 10,4 W · siyah gövde",powerW:10.4,sourceUrl:"https://atakanpetshop.com/yikeda-ykd-6124-optik-led-aydinlatma-10-4w-siyah",verifiedAt:"2026-08-26"},
  {id:"yikeda-ykd6126-white",category:"lighting",brand:"Yikeda",model:"YKD-6126 Optik LED Beyaz",specifications:"Optik lensli, 360° esnek kollu klipsli LED · 15,2 W · beyaz gövde",powerW:15.2,sourceUrl:"https://atakanpetshop.com/yikeda-ykd-6126-optik-led-aydinlatma-15-2w-beyaz",verifiedAt:"2026-08-26"},
  {id:"yikeda-ykd6126-black",category:"lighting",brand:"Yikeda",model:"YKD-6126 Optik LED Siyah",specifications:"Optik lensli, 360° esnek kollu klipsli LED · 15,2 W · siyah gövde",powerW:15.2,sourceUrl:"https://atakanpetshop.com/yikeda-ykd-6126-optik-led-aydinlatma-15-2w-siyah",verifiedAt:"2026-08-25"},
  {id:"yikeda-sd1055",category:"lighting",brand:"Yikeda",model:"SD-1055 RGB",specifications:"RGB LED · 55 W · 4920 lm · 3 kademe dimmer",powerW:55,recommendedTankLengthCm:[90,110],sourceUrl:"https://atakanpetshop.com/yikeda-sd-1055-rgb-led-aydinlatma-55w-90-110-cm",verifiedAt:"2026-08-26"},
  {id:"yikeda-dy10w",category:"lighting",brand:"Yikeda",model:"DY-10W",specifications:"Mavi-beyaz, 360° esnek kollu ayaklı LED · 10 W",powerW:10,sourceUrl:"https://atakanpetshop.com/yikeda-dy-10w-ayakli-led-aydinlatma-10w-mavi-beyaz",verifiedAt:"2026-08-26"},
  {id:"yikeda-xt4w",category:"lighting",brand:"Yikeda",model:"XT-4W",specifications:"Mavi-beyaz ayaklı nano LED · 4 W",powerW:4,sourceUrl:"https://atakanpetshop.com/yikeda-xt-4w-ayakli-led-aydinlatma-4w-mavi-beyaz",verifiedAt:"2026-08-26"},
  ...[85,100,120].map(powerW=>({id:`yikeda-smart-ufo-${powerW}`,category:"lighting" as const,brand:"Yikeda",model:`Smart UFO ${powerW} W`,specifications:`Tam spectrum UFO LED · ${powerW} W`,powerW,sourceUrl:"https://atakanpetshop.com/yikeda-smart-ufo-led-lamba-100w",verifiedAt:"2026-08-26"})),
  {id:"yikeda-full-spectrum-rgb-30",category:"lighting",brand:"Yikeda",model:"SD-1030 RGB",specifications:"Üç kademeli dimmerli RGB LED · 30 W · 2460 lm · 48,8 cm gövde · 50–60 cm akvaryum",powerW:30,recommendedTankLengthCm:[50,60],sourceUrl:"https://atakanpetshop.com/yikeda-sd-1030-rgb-led-aydinlatma-30w-50-60-cm",verifiedAt:"2026-08-25"},
  {id:"yikeda-full-spectrum-rgb-35",category:"lighting",brand:"Yikeda",model:"SD-1035 RGB",specifications:"Üç kademeli dimmerli RGB LED · 35 W · 2960 lm · 58,8 cm gövde · 60–70 cm akvaryum",powerW:35,recommendedTankLengthCm:[60,70],sourceUrl:"https://atakanpetshop.com/yikeda-sd-1035-rgb-led-aydinlatma-35w-60-70-cm",verifiedAt:"2026-08-26"},
  {id:"yikeda-full-spectrum-rgb-40",category:"lighting",brand:"Yikeda",model:"SD-1040 RGB",specifications:"Üç kademeli dimmerli RGB LED · 40 W · 3460 lm · 68,8 cm gövde · 70–80 cm akvaryum",powerW:40,recommendedTankLengthCm:[70,80],sourceUrl:"https://atakanpetshop.com/yikeda-sd-1040-rgb-led-aydinlatma-40w-70-80-cm",verifiedAt:"2026-08-26"},
  {id:"yikeda-full-spectrum-rgb-45",category:"lighting",brand:"Yikeda",model:"SD-1045 RGB",specifications:"Üç kademeli dimmerli RGB LED · 45 W · 3940 lm · 78,8 cm gövde · 80–90 cm akvaryum",powerW:45,recommendedTankLengthCm:[80,90],sourceUrl:"https://atakanpetshop.com/yikeda-sd-1045-rgb-led-aydinlatma-45w-80-90-cm",verifiedAt:"2026-08-26"},
  {id:"yikeda-full-spectrum-rgb-65",category:"lighting",brand:"Yikeda",model:"SD-1065 RGB",specifications:"Üç kademeli dimmerli full spectrum RGB LED · 65 W · 118,8 cm gövde · 120–140 cm akvaryum",powerW:65,recommendedTankLengthCm:[120,140],sourceUrl:"https://atakanpetshop.com/yikeda-sd-1065-rgb-led-aydinlatma-65w-120-140-cm",verifiedAt:"2026-08-26"},
  {id:"yikeda-sd-t8-13",category:"lighting",brand:"Yikeda",model:"SD-T8-13 W",specifications:"Çift kanatlı, ayarlanabilir gövdeli LED · 13,6 W",powerW:13.6,sourceUrl:"https://www.karacaakvaryum.com/marka/yikeda/",verifiedAt:"2026-08-18"},
  {id:"yikeda-dy10-spot",category:"lighting",brand:"Yikeda",model:"DY-10 Spot",specifications:"Ayarlanabilir açılı cam lensli spot LED · 16,8 W",powerW:16.8,sourceUrl:"https://www.karacaakvaryum.com/marka/yikeda/",verifiedAt:"2026-08-18"},
  {id:"yikeda-mini-clip",category:"lighting",brand:"Yikeda",model:"Mini Klipsli LED",specifications:"Nano akvaryumlar için klipsli LED aydınlatma",sourceUrl:"https://aquarubi.com/yikeda",verifiedAt:"2026-08-18"},
  {id:"yikeda-sdt8-1200jl",category:"lighting",brand:"Yikeda",model:"SD-T8-1200JL RGB",specifications:"RGB LED armatür · 16,8 W · 1480 lm · 30–40 cm akvaryum",powerW:16.8,recommendedTankLengthCm:[30,40],sourceUrl:"https://atakanpetshop.com/yikeda-sd-t8-1200jl-rgb-led-aydinlatma-168w-30-40-cm",verifiedAt:"2026-08-26"},
  {id:"yikeda-sdt8-1800jl",category:"lighting",brand:"Yikeda",model:"SD-T8-1800JL RGB",specifications:"Üç kademeli dimmerli RGB LED · 22,4 W · 1960 lm · 38,8 cm gövde · 40–50 cm akvaryum",powerW:22.4,recommendedTankLengthCm:[40,50],sourceUrl:"https://atakanpetshop.com/yikeda-sd-t8-1800jl-rgb-led-aydinlatma-224w-40-50-cm",verifiedAt:"2026-08-26"},
  {id:"yikeda-tp36whb",category:"lighting",brand:"Yikeda",model:"TP-3,6WHB Tray Light",specifications:"Sarı-beyaz standlı nano LED · 3,6 W · 15 × 15 cm",powerW:3.6,sourceUrl:"https://atakanpetshop.com/yikeda-tp-36whb-tray-light-15x15-cm-standli-led-aydinlatma-36w-sari-beyaz",verifiedAt:"2026-08-25"},
  {id:"yikeda-tp36wlb",category:"lighting",brand:"Yikeda",model:"TP-3,6WLB Tray Light",specifications:"Mavi-beyaz standlı nano LED · 3,6 W · 15 × 15 cm",powerW:3.6,sourceUrl:"https://atakanpetshop.com/yikeda-tp-36wlb-tray-light-15x15-cm-standli-led-aydinlatma-36w-mavi-beyaz",verifiedAt:"2026-08-25"},
  {id:"yikeda-tp56whb",category:"lighting",brand:"Yikeda",model:"TP-5,6WHB Tray Light",specifications:"Sarı-beyaz standlı nano LED · 5,6 W · 20 × 20 cm",powerW:5.6,sourceUrl:"https://atakanpetshop.com/yikeda-tp-56whb-tray-light-20x20-cm-standli-led-aydinlatma-56w-sari-beyaz",verifiedAt:"2026-08-25"},
  {id:"yikeda-tp56wlb",category:"lighting",brand:"Yikeda",model:"TP-5,6WLB Tray Light",specifications:"Mavi-beyaz standlı nano LED · 5,6 W · 20 × 20 cm",powerW:5.6,sourceUrl:"https://atakanpetshop.com/yikeda-tp-56wlb-tray-light-20x20-cm-standli-led-aydinlatma-56w-mavi-beyaz",verifiedAt:"2026-08-26"},
  {id:"yikeda-tp72whb",category:"lighting",brand:"Yikeda",model:"TP-7,2WHB Tray Light",specifications:"Sarı-beyaz standlı nano LED · 7,2 W · 25 × 25 cm",powerW:7.2,sourceUrl:"https://atakanpetshop.com/yikeda-tp-72whb-tray-light-25x25-cm-standli-led-aydinlatma-72w-sari-beyaz",verifiedAt:"2026-08-26"},
  {id:"yikeda-tp72wlb",category:"lighting",brand:"Yikeda",model:"TP-7,2WLB Tray Light",specifications:"Mavi-beyaz standlı nano LED · 7,2 W · 25 × 25 cm",powerW:7.2,sourceUrl:"https://atakanpetshop.com/yikeda-tp-72wlb-tray-light-25x25-cm-standli-led-aydinlatma-72w-mavi-beyaz",verifiedAt:"2026-08-26"},
];

const haqosEquipment:EquipmentProfile[]=[
  {id:"haqos-expro-500",category:"filter",brand:"Haqos",model:"EXPRO-500",specifications:"Ayarlanabilir askı dış filtre · 510 L/saat · 6,9 W",ratedFlowLph:510,powerW:6.9,recommendedMaxL:100,adjustableFlow:true,sourceUrl:"https://www.haqos.com/productshow-45495778.html",verifiedAt:"2026-08-26"},
  {id:"haqos-ex500at",category:"filter",brand:"Haqos",model:"EX-500AT",specifications:"Beş sepetli slim askı dış filtre · 510 L/saat · 7 W · 250 litreye kadar",ratedFlowLph:510,powerW:7,recommendedMaxL:250,sourceUrl:"https://www.haqos.com/productshow-45495777.html",verifiedAt:"2026-08-26"},
  {id:"haqos-exp-500",category:"filter",brand:"Haqos",model:"EXP-500",specifications:"Askı mini dış filtre · 510 L/saat · 7 W",ratedFlowLph:510,powerW:7,sourceUrl:"https://www.kumovapet.com.tr/dis-filtreler/marka/328/haqos-marka-urunler.html",verifiedAt},
  {id:"haqos-expad-500",category:"other",brand:"Haqos",model:"EXPAD-500",specifications:"EXPRO/EXP serisiyle kullanılan, kendi pompası bulunmayan harici ön filtre modülü",sourceUrl:"https://www.haqos.com/productshow-45495779.html",verifiedAt:"2026-08-26"},
  {id:"haqos-expro-230",category:"filter",brand:"Haqos",model:"EXPRO-230",specifications:"Nano askı filtre · 210 L/saat · 2 W · 30–80 litre",ratedFlowLph:210,powerW:2,recommendedMinL:30,recommendedMaxL:80,sourceUrl:"https://www.haqos.com/productshow-45495776.html",verifiedAt:"2026-08-26"},
  {id:"haqos-expro-1000",category:"filter",brand:"Haqos",model:"EXPRO-1000",specifications:"Dış filtre · 1000 L/saat · 22 W",ratedFlowLph:1000,powerW:22,sourceUrl:"https://www.haqos.com/productshow-45495775.html",verifiedAt:"2026-08-26"},
  {id:"haqos-ex1000at",category:"filter",brand:"Haqos",model:"EX1000AT",specifications:"Otomatik su emişli dış filtre · 1000 L/saat · 22 W · 250 litreye kadar",ratedFlowLph:1000,powerW:22,recommendedMaxL:250,sourceUrl:"https://www.haqos.com/productshow-45495774.html",verifiedAt:"2026-08-26"},
  {id:"haqos-easy-1000at",category:"filter",brand:"Haqos",model:"EASY-1000AT",specifications:"Üreticinin resmî ürün kataloğundaki filtrasyon sistemi · debi ve güç bilgisi yayımlanmamış",capacityDataNote:"Üreticinin model sayfasında ve güvenilir satıcı kaynaklarında debi yayımlanmamış; otomatik kapasite hesabına katılmaz.",sourceUrl:"https://www.haqos.com/productshow-45495781.html",verifiedAt:"2026-08-26"},
  {id:"haqos-aqua-flow-250",category:"filter",brand:"Haqos",model:"Aqua Flow 250",specifications:"Üreticinin resmî ürün kataloğundaki akvaryum filtresi · debi ve güç bilgisi yayımlanmamış",capacityDataNote:"Üreticinin model sayfasında ve güvenilir satıcı kaynaklarında debi yayımlanmamış; aynı adlı başka marka ürünlerin değerleri kullanılmadı ve otomatik kapasite hesabına katılmaz.",sourceUrl:"https://www.haqos.com/productshow-45495780.html",verifiedAt:"2026-08-26"},
  {id:"haqos-exc-500",category:"filter",brand:"Haqos",model:"EXC-500",specifications:"Dış filtre · 430 L/saat · 17 W · 2 m basma yüksekliği",ratedFlowLph:430,powerW:17,sourceUrl:"https://www.haqos.com/productshow-45495772.html",verifiedAt:"2026-08-26"},
  {id:"haqos-hec-600",category:"other",brand:"Haqos",model:"HEC-600",specifications:"Pilli teleskopik dip süpürgesi · 520 L/saat · 40–52 cm su seviyesi",ratedFlowLph:520,sourceUrl:"https://www.haqos.com/productshow-45495770.html",verifiedAt:"2026-08-26"},
  {id:"haqos-ex-1200at",category:"filter",brand:"Haqos",model:"EX-1200AT",specifications:"Otomatik su emişli dış filtre · 1200 L/saat · 28 W · 300 litreye kadar",ratedFlowLph:1200,powerW:28,recommendedMaxL:300,sourceUrl:"https://www.evcilsepetim.com/ex-1200at-haqos-dis-filitre-1200-lt-15721",verifiedAt:"2026-08-18"},
  {id:"haqos-ex-1500at",category:"filter",brand:"Haqos",model:"EX-1500AT",specifications:"Beş sepetli otomatik su emişli dış filtre · 1500 L/saat · 36 W · 400 litreye kadar",ratedFlowLph:1500,powerW:36,recommendedMaxL:400,sourceUrl:"https://www.ecoarium.pt/filtros-externos/2559-haqos-ex1500at",verifiedAt:"2026-08-18"},
  {id:"haqos-hf-900",category:"filter",brand:"Haqos",model:"HF-900",specifications:"İç filtre · 900 L/saat · 8,5 W · 250–300 litre",ratedFlowLph:900,powerW:8.5,recommendedMinL:250,recommendedMaxL:300,sourceUrl:"https://www.canlipetshop.com/ornek-alt-kategori4/ic-filtreler?limit=75&page=2&sort=pd.name",verifiedAt:"2026-08-18"},
  {id:"haqos-jular-230",category:"filter",brand:"Haqos",model:"Jular-230",specifications:"Kompakt iç filtre · 210 L/saat · 1,7 W",ratedFlowLph:210,powerW:1.7,sourceUrl:"https://www.canlipetshop.com/ornek-alt-kategori4/ic-filtreler?limit=75&page=2&sort=pd.name",verifiedAt:"2026-08-18"},
  {id:"haqos-glass-cleaner-60",category:"other",brand:"Haqos",model:"Saplı Cam Silici 60 cm",specifications:"Akvaryum camı temizliği için uzun saplı silecek · 60 cm",sourceUrl:"https://www.cikletistpetshop.com/haqos-sapli-cam-silici-60-cm-5253",verifiedAt:"2026-08-25"},
  {id:"haqos-glass-cleaner-70",category:"other",brand:"Haqos",model:"Saplı Silecek 70 cm",specifications:"Akvaryum camı temizliği için uzun saplı silecek · 70 cm",sourceUrl:"https://www.cikletistpetshop.com/haqos--241",verifiedAt:"2026-08-25"},
  {id:"haqos-biopro-b600",category:"other",brand:"Haqos",model:"BIOPRO B-600",specifications:"Pilli ayarlanabilir dip süpürgesi · 57–82 cm · 520 L/saat · 40–52 cm su seviyesi",ratedFlowLph:520,sourceUrl:"https://malawiizmir.com/biopro-b-600-pilli-dip-supurgesi",verifiedAt:"2026-08-26"},
  {id:"haqos-solaris-508",category:"lighting",brand:"Haqos",model:"Solaris 508",specifications:"Nano akvaryumlar için kompakt LED aydınlatma · güç ve ışık akısı yayımlanmamış",sourceUrl:"https://malawiizmir.com/haqos-solaris-508-nano-akvaryum-aydinlatmasi",verifiedAt:"2026-08-26"},
  {id:"haqos-overbox-5000",category:"other",brand:"Haqos",model:"OverBox 5000",specifications:"Akvaryum taşma kutusu · 5000 L/saat",ratedFlowLph:5000,sourceUrl:"https://malawiizmir.com/haqos-overbox-5000-l-h",verifiedAt:"2026-08-26"},
  ...([["wm-300","WM-300","45495755"],["wm-200","WM-200","45495756"],["wm-100","WM-100","45495758"],["sp-230","SP-230","45495760"],["mp-2200","MP-2200","45495761"],["sa101","SA101","45495762"]] as const).map(([slug,model,page])=>({
    id:`haqos-${slug}`,category:"other" as const,brand:"Haqos",model,
    specifications:"Üreticinin resmî pompa kataloğundaki akvaryum su pompası · debi ve güç bilgisi metin olarak yayımlanmamış",
    sourceUrl:`https://www.haqos.com/productshow-${page}.html`,verifiedAt:"2026-08-26",
  })),
  {id:"haqos-ps300",category:"other",brand:"Haqos",model:"PS-300",specifications:"Üreticinin resmî kataloğundaki protein skimmer · kapasite ve güç bilgisi metin olarak yayımlanmamış",sourceUrl:"https://www.haqos.com/productshow-45495763.html",verifiedAt:"2026-08-26"},
  {id:"haqos-uv-9w",category:"uv",brand:"Haqos",model:"UV 9W",specifications:"UV sterilizatör · 9 W",powerW:9,sourceUrl:"https://www.haqos.com/productshow-45495767.html",verifiedAt:"2026-08-26"},
  {id:"haqos-mini-uv-5w",category:"uv",brand:"Haqos",model:"Mini UV 5W",specifications:"Kompakt UV sterilizatör · 5 W",powerW:5,sourceUrl:"https://www.haqos.com/productshow-45495768.html",verifiedAt:"2026-08-26"},
  {id:"haqos-power-led-clip",category:"lighting",brand:"Haqos",model:"Power LED Clip Light",specifications:"Üreticinin resmî kataloğundaki klipsli LED aydınlatma · güç ve ışık akısı yayımlanmamış",sourceUrl:"https://www.haqos.com/productshow-45495617.html",verifiedAt:"2026-08-26"},
  {id:"haqos-led-clamp-45495618",category:"lighting",brand:"Haqos",model:"LED Clamp-on Lamp (45495618)",specifications:"Üreticinin resmî kataloğundaki mandallı LED aydınlatma varyantı · güç ve ışık akısı yayımlanmamış",sourceUrl:"https://www.haqos.com/productshow-45495618.html",verifiedAt:"2026-08-26"},
  {id:"haqos-power-led-clip-506",category:"lighting",brand:"Haqos",model:"Power LED Clip Light 506",specifications:"Üreticinin resmî kataloğundaki 506 serisi klipsli LED aydınlatma · güç ve ışık akısı yayımlanmamış",sourceUrl:"https://www.haqos.com/productshow-45495621.html",verifiedAt:"2026-08-26"},
  {id:"haqos-led-clamp-45495622",category:"lighting",brand:"Haqos",model:"LED Clamp-on Lamp (45495622)",specifications:"Üreticinin resmî kataloğundaki mandallı LED aydınlatma varyantı · güç ve ışık akısı yayımlanmamış",sourceUrl:"https://www.haqos.com/productshow-45495622.html",verifiedAt:"2026-08-26"},
  {id:"haqos-temperature-strip",category:"other",brand:"Haqos",model:"Temperature Strip Sticker",specifications:"Yapışkanlı akvaryum sıcaklık şeridi",sourceUrl:"https://www.haqos.com/productshow-45495586.html",verifiedAt:"2026-08-26"},
  {id:"haqos-thermometer",category:"other",brand:"Haqos",model:"Thermometer",specifications:"Üreticinin resmî kataloğundaki akvaryum termometresi",sourceUrl:"https://www.haqos.com/productshow-45495588.html",verifiedAt:"2026-08-26"},
  {id:"haqos-hydrometer-45495608",category:"other",brand:"Haqos",model:"Hydrometer (45495608)",specifications:"Üreticinin resmî kataloğundaki hidrometre varyantı",sourceUrl:"https://www.haqos.com/productshow-45495608.html",verifiedAt:"2026-08-26"},
  {id:"haqos-hydrometer-45495611",category:"other",brand:"Haqos",model:"Hydrometer (45495611)",specifications:"Üreticinin resmî kataloğundaki hidrometre varyantı",sourceUrl:"https://www.haqos.com/productshow-45495611.html",verifiedAt:"2026-08-26"},
  ...([17,21,30] as const).map(model=>({id:`haqos-tp-l-${model}`,category:"other" as const,brand:"Haqos",model:`TP-L-${model}`,specifications:"Üreticinin resmî diğer ekipman kataloğundaki aksesuar; ayrıntılı teknik özellik yayımlanmamış",sourceUrl:`https://www.haqos.com/productshow-${model===17?"45495613":model===21?"45495614":"45495616"}.html`,verifiedAt:"2026-08-26"})),
  {id:"haqos-thermo-sprite",category:"heater",brand:"Haqos",model:"Thermo-Sprite Micro Plastic Heater",specifications:"Üreticinin resmî kataloğundaki kompakt plastik akvaryum ısıtıcısı · güç seçenekleri metin olarak yayımlanmamış",capacityDataNote:"Üreticinin model sayfasında güç ve akvaryum hacmi seçenekleri metin olarak yayımlanmamış; otomatik ısıtıcı kapasitesi hesabına katılmaz.",sourceUrl:"https://www.haqos.com/productshow-45495753.html",verifiedAt:"2026-08-26"},
];
const haqosHeaterSource="https://www.haqos.com/productshow-45495754.html";
haqosEquipment.push(...[25,50,75,100,150,200,300].map(powerW=>({
  id:`haqos-heater-${powerW}`,category:"heater" as const,brand:"Haqos",model:`Thermo-Genius ${powerW} W`,
  specifications:`Tam daldırılabilir, 20–32 °C ayarlı termostatlı cam ısıtıcı · ${powerW} W · ${powerW} litreye kadar`,
  powerW,recommendedMaxL:powerW,sourceUrl:haqosHeaterSource,verifiedAt:"2026-08-26",
})));

const jingyeSource="https://atakanpetshop.com/jingye";
const jingyeEquipment:EquipmentProfile[]=[
  ...[["T610",650,8],["T620",850,10],["T630",1000,12],["T640",1500,undefined],["T650",1800,undefined]].map(([model,ratedFlowLph,powerW])=>({id:`jingye-${String(model).toLowerCase()}`,category:"filter" as const,brand:"Jingye",model:String(model),specifications:`Dış filtre · ${ratedFlowLph} L/saat${powerW?` · ${powerW} W`:""}`,ratedFlowLph:Number(ratedFlowLph),...(powerW?{powerW:Number(powerW)}:{}),sourceUrl:jingyeSource,verifiedAt})),
  {id:"jingye-5000f",category:"filter",brand:"Jingye",model:"5000F",specifications:"Şeffaf iç filtre · 400 L/saat · 4 W",ratedFlowLph:400,powerW:4,sourceUrl:jingyeSource,verifiedAt},
  {id:"jingye-5100f",category:"filter",brand:"Jingye",model:"5100F",specifications:"Şeffaf iç filtre · 500 L/saat · 6 W",ratedFlowLph:500,powerW:6,sourceUrl:jingyeSource,verifiedAt},
  {id:"jingye-5200f",category:"filter",brand:"Jingye",model:"5200F",specifications:"Şeffaf iç filtre · 600 L/saat · 10 W",ratedFlowLph:600,powerW:10,sourceUrl:jingyeSource,verifiedAt},
  {id:"jingye-8000f",category:"filter",brand:"Jingye",model:"8000F",specifications:"Şeffaf iç filtre · 400 L/saat · 4 W",ratedFlowLph:400,powerW:4,sourceUrl:jingyeSource,verifiedAt},
  {id:"jingye-9100dx",category:"other",brand:"Jingye",model:"9100DX",specifications:"Sump motoru · 500 L/saat · 6 W",ratedFlowLph:500,powerW:6,sourceUrl:jingyeSource,verifiedAt},
  {id:"jingye-lv1500dx",category:"other",brand:"Jingye",model:"LV-1500DX",specifications:"Sump motoru · 1000 L/saat · 15 W · 200 litreye kadar",ratedFlowLph:1000,powerW:15,recommendedMaxL:200,sourceUrl:"https://atakanpetshop.com/jingye-sump-motoru-15w-1000lh-lv-1500dx",verifiedAt},
  {id:"jingye-jy104",category:"other",brand:"Jingye",model:"JY-104",specifications:"Sump motoru · 3000 L/saat · 40 W · 500 litreye kadar",ratedFlowLph:3000,powerW:40,recommendedMaxL:500,sourceUrl:"https://atakanpetshop.com/jingye-104-sump-motoru-siyah-40w-3000ls-jy-104",verifiedAt},
  {id:"jingye-911",category:"air_pump",brand:"Jingye",model:"911",specifications:"Tek çıkışlı hava motoru · 3 L/dakika · 2 W",ratedFlowLph:180,powerW:2,sourceUrl:jingyeSource,verifiedAt},
  {id:"jingye-921",category:"air_pump",brand:"Jingye",model:"921",specifications:"Çift çıkışlı hava motoru · 2 × 3,4 L/dakika · 3 W",ratedFlowLph:408,powerW:3,sourceUrl:jingyeSource,verifiedAt},
  {id:"jingye-ye621",category:"air_pump",brand:"Jingye",model:"YE-621",specifications:"Çift çıkışlı sessiz hava motoru · 2 × 3,4 L/dakika · 5 W",ratedFlowLph:408,powerW:5,sourceUrl:jingyeSource,verifiedAt},
  {id:"jingye-cd200",category:"air_pump",brand:"Jingye",model:"CD200",specifications:"Şarjlı tek çıkışlı hava motoru · 2 L/dakika · 1,8 W · 2600 mAh",ratedFlowLph:120,powerW:1.8,sourceUrl:"https://atakanpetshop.com/jingye-cd200-tek-cikisli-sarjli-hava-motoru-beyaz-18w-2lmin",verifiedAt:"2026-08-24"},
  {id:"jingye-lv500dx",category:"other",brand:"Jingye",model:"LV-500DX",specifications:"Sump motoru · 350 L/saat · 6 W · 0,8 m basma yüksekliği · 70 litreye kadar",ratedFlowLph:350,powerW:6,recommendedMaxL:70,sourceUrl:"https://atakanpetshop.com/jingye-sump-motoru-6w-350lh-lv-500dx",verifiedAt:"2026-08-24"},
  {id:"jingye-jy910",category:"other",brand:"Jingye",model:"JY-910",specifications:"Dalgıç filtre/üst hazne pompası · 500 L/saat · 6 W · 0,6 m · 80–100 litre",ratedFlowLph:500,powerW:6,recommendedMinL:80,recommendedMaxL:100,sourceUrl:"https://atakanpetshop.com/jingye-dalgic-filtre-pompasi-beyaz-6w-500lh-jy-910",verifiedAt:"2026-08-24"},
  {id:"jingye-jy915",category:"other",brand:"Jingye",model:"JY-915",specifications:"Dalgıç filtre/üst hazne pompası · 800 L/saat · 12 W · 0,7 m · 100–150 litre",ratedFlowLph:800,powerW:12,recommendedMinL:100,recommendedMaxL:150,sourceUrl:"https://atakanpetshop.com/jingye-dalgic-filtre-pompasi-beyaz-12w-800lh-jy-915",verifiedAt:"2026-08-24"},
  {id:"jingye-jy925",category:"other",brand:"Jingye",model:"JY-925",specifications:"Dalgıç filtre/üst hazne pompası · 1600 L/saat · 25 W",ratedFlowLph:1600,powerW:25,sourceUrl:"https://atakanpetshop.com/jingye-dalgic-filtre-pompasi-beyaz-25w-1600lh-jy-925",verifiedAt:"2026-08-24"},
  {id:"jingye-jy825",category:"other",brand:"Jingye",model:"JY-825",specifications:"Dalgıç filtre pompası · 2500 L/saat · 35 W · 1,8 m basma yüksekliği",ratedFlowLph:2500,powerW:35,sourceUrl:"https://atakanpetshop.com/jingye-825-dalgic-filtre-pompasi-beyaz-35w-2500ls",verifiedAt:"2026-08-24"},
  {id:"jingye-810f",category:"filter",brand:"Jingye",model:"810F",specifications:"Üst/tepe filtre · 800 L/saat",ratedFlowLph:800,sourceUrl:"https://atakanpetshop.com/akvaryum-ust-filtreler",verifiedAt:"2026-08-24"},
  {id:"jingye-815f",category:"filter",brand:"Jingye",model:"815F",specifications:"Üst/tepe filtre · 1200 L/saat",ratedFlowLph:1200,sourceUrl:"https://atakanpetshop.com/akvaryum-ust-filtreler",verifiedAt:"2026-08-24"},
  {id:"jingye-820f",category:"filter",brand:"Jingye",model:"820F",specifications:"Üst/tepe filtre · 1800 L/saat",ratedFlowLph:1800,sourceUrl:"https://atakanpetshop.com/akvaryum-ust-filtreler",verifiedAt:"2026-08-24"},
  {id:"jingye-ye12",category:"air_pump",brand:"Jingye",model:"YE-12",specifications:"Tek çıkışlı hava motoru · 3,5 L/dakika · 3 W",ratedFlowLph:210,powerW:3,sourceUrl:jingyeSource,verifiedAt:"2026-08-24"},
  {id:"jingye-ye22",category:"air_pump",brand:"Jingye",model:"YE-22",specifications:"Çift çıkışlı hava motoru · 2 × 4 L/dakika · 5 W",ratedFlowLph:480,powerW:5,sourceUrl:jingyeSource,verifiedAt:"2026-08-24"},
  {id:"jingye-611",category:"air_pump",brand:"Jingye",model:"611",specifications:"Tek çıkışlı hava motoru · 3 L/dakika · 3 W",ratedFlowLph:180,powerW:3,sourceUrl:jingyeSource,verifiedAt:"2026-08-24"},
  {id:"jingye-cd100",category:"air_pump",brand:"Jingye",model:"CD100",specifications:"Şarjlı tek çıkışlı hava motoru · 1,5 L/dakika · 1,5 W",ratedFlowLph:90,powerW:1.5,sourceUrl:"https://atakanpetshop.com/jingye-tek-cikisli-sarjli-hava-motoru-beyaz-15w-ye-cd100",verifiedAt:"2026-08-24"},
  {id:"jingye-cd300",category:"air_pump",brand:"Jingye",model:"CD300",specifications:"Şarjlı çift çıkışlı hava motoru · başlık 2 × 1,5 L/dakika, açıklama toplam 2 L/dakika · güvenli hesap değeri 2 L/dakika · 3 W · 2600 mAh",ratedFlowLph:120,powerW:3,sourceUrl:"https://atakanpetshop.com/jingye-cd300-cift-cikisli-sarjli-hava-motoru-beyaz-3w-2x15lmin",verifiedAt:"2026-08-24"},
  {id:"jingye-cleaning-kit-5in1",category:"other",brand:"Jingye",model:"Akvaryum Temizleme Seti 5'li",specifications:"Değiştirilebilir uçlu beş işlevli akvaryum bakım ve temizlik seti",sourceUrl:jingyeSource,verifiedAt:"2026-08-24"},
];

const accessoryEquipment:EquipmentProfile[]=[
  {id:"liya-ly1009h",category:"other",brand:"Liya",model:"LY-1009H",specifications:"95 cm üçgen keçeli cam sileceği",sourceUrl:"https://www.akvaryumexpress.com/liya",verifiedAt},
  {id:"liya-ly1820",category:"other",brand:"Liya",model:"LY-1820",specifications:"Kare yemleme aparatı",sourceUrl:"https://www.akvaryumexpress.com/liya",verifiedAt},
  {id:"liya-dx6",category:"other",brand:"Liya",model:"D-X6",specifications:"12–16 mm hortum ve ısıtıcı için vantuz",sourceUrl:"https://www.akvaryumexpress.com/liya",verifiedAt},
  {id:"liya-hose-brush-30",category:"other",brand:"Liya",model:"Esnek Hortum Fırçası 30 cm",specifications:"Esnek akvaryum hortumu temizleme fırçası · 30 cm",sourceUrl:"https://www.akvaryumexpress.com/liya",verifiedAt},
  {id:"liya-lcd-thermometer",category:"other",brand:"Liya",model:"LCD Yapıştırmalı Termometre",specifications:"Akvaryum camına yapıştırılan LCD termometre",sourceUrl:"https://www.akvaryumexpress.com/liya",verifiedAt},
  {id:"liya-lcd-thermometer-long",category:"other",brand:"Liya",model:"LCD Uzun Termometre",specifications:"Uzun tip yapıştırmalı LCD akvaryum termometresi",sourceUrl:"https://www.akvaryumexpress.com/liya",verifiedAt},
  {id:"liya-glass-thermometer",category:"other",brand:"Liya",model:"Tombul Cam Termometre",specifications:"Cam akvaryum termometresi",sourceUrl:"https://www.akvaryumexpress.com/liya",verifiedAt},
  {id:"liya-air-stone-cylinder",category:"other",brand:"Liya",model:"Silindir Hava Taşı",specifications:"Silindir biçimli akvaryum hava taşı",sourceUrl:"https://www.akvaryumexpress.com/liya",verifiedAt},
  {id:"liya-air-stone-round-25",category:"other",brand:"Liya",model:"Yuvarlak Hava Taşı 25 mm",specifications:"Yuvarlak akvaryum hava taşı · 25 mm",sourceUrl:"https://www.akvaryumexpress.com/liya",verifiedAt},
  {id:"liya-air-stone-20",category:"other",brand:"Liya",model:"Hava Taşı 20 cm",specifications:"Çubuk akvaryum hava taşı · 20 cm",sourceUrl:"https://www.akvaryumexpress.com/liya",verifiedAt},
  {id:"liya-air-stone-50",category:"other",brand:"Liya",model:"Hava Taşı 50 cm",specifications:"Çubuk akvaryum hava taşı · 50 cm",sourceUrl:"https://www.akvaryumexpress.com/liya",verifiedAt},
  ...[3,4,5,6].map(size=>({id:`liya-net-${size}`,category:"other" as const,brand:"Liya",model:`Balık Kepçesi ${size} inç`,specifications:`Balık yakalama kepçesi · ${size} inç`,sourceUrl:"https://www.akvaryumexpress.com/liya",verifiedAt})),
  {id:"liya-fn10",category:"other",brand:"Liya",model:"FN-10 Çelik Saplı Kepçe",specifications:"Çelik saplı akvaryum kepçesi · 120 cm",sourceUrl:"https://atakanpetshop.com/liya",verifiedAt:"2026-08-24"},
  {id:"liya-hose-brush-20",category:"other",brand:"Liya",model:"Hortum Temizleme Fırçası 20 cm",specifications:"Akvaryum hortumu temizleme fırçası · 20 cm",sourceUrl:"https://atakanpetshop.com/liya",verifiedAt:"2026-08-24"},
  {id:"liya-hose-brush-160",category:"other",brand:"Liya",model:"Esnek Hortum Temizleme Harbisi 160 cm",specifications:"Uzun akvaryum ve dış filtre hortumları için çift uçlu esnek temizleme fırçası · 160 cm",sourceUrl:"https://atakanpetshop.com/liya",verifiedAt:"2026-08-24"},
  {id:"liya-hose-bend-guard",category:"other",brand:"Liya",model:"LY-1822 Hortum Kırılma Önleyici",specifications:"Dış filtre hortumunun akvaryum kenarında bükülmesini ve debi kaybını önleyen kılavuz",sourceUrl:"https://atakanpetshop.com/liya-hortum-kirilma-onleyici",verifiedAt:"2026-08-24"},
  {id:"liya-feeding-ring-round",category:"other",brand:"Liya",model:"Yuvarlak Yem Toplama Aparatı",specifications:"Yüzen yemleri belirli bir alanda tutan yuvarlak yemleme halkası",sourceUrl:"https://atakanpetshop.com/liya",verifiedAt:"2026-08-24"},
  {id:"liya-breeder-4701b",category:"other",brand:"Liya",model:"4701B Küçük Tül Yavruluk",specifications:"Akvaryum içine asılan küçük tül yavruluk ve balık ayırma aparatı",sourceUrl:"https://atakanpetshop.com/liya",verifiedAt:"2026-08-24"},
  {id:"liya-breeder-4702b",category:"other",brand:"Liya",model:"4702B Büyük Tül Yavruluk",specifications:"Akvaryum içine asılan tül yavruluk · 26 × 15 × 15 cm",sourceUrl:"https://atakanpetshop.com/liya-4702b-buyuk-tul-yavruluk",verifiedAt:"2026-08-24"},
  {id:"liya-air-divider-v82",category:"other",brand:"Liya",model:"LY-V8/2 İkili Metal Hava Dağıtıcısı",specifications:"Ayrı ayarlanabilir iki çıkışlı, krom kaplı metal hava dağıtıcısı",sourceUrl:"https://atakanpetshop.com/liya-ikili-metal-hava-dagiticisi-ly-v82",verifiedAt:"2026-08-24"},
  {id:"liya-glass-divider-suction",category:"other",brand:"Liya",model:"Vantuzlu Cam Bölme Aparatı 2'li",specifications:"Akvaryum bölme camını sabitlemek için iki vantuzlu aparat",sourceUrl:"https://atakanpetshop.com/liya",verifiedAt:"2026-08-24"},
  ...[7.5,10,12.5].map(size=>({id:`liya-round-air-stone-${String(size).replace(".","-")}`,category:"other" as const,brand:"Liya",model:`Yuvarlak Hava Taşı ${String(size).replace(".",",")} cm`,specifications:`Yuvarlak akvaryum hava taşı · ${String(size).replace(".",",")} cm`,sourceUrl:"https://atakanpetshop.com/liya-yuvarlak-havatasi-75cm-ly28-3",verifiedAt:"2026-08-24"})),
  {id:"liya-airline-connector-t3",category:"other",brand:"Liya",model:"LY-T3 Hava Hortumu Eki 2'li",specifications:"Standart akvaryum hava hortumuyla uyumlu bağlantı ve çoğaltma eki · 2'li paket",sourceUrl:"https://atakanpetshop.com/liya-hava-hortumu-eki-2li-paket-ly-t3",verifiedAt:"2026-08-24"},
  {id:"nubios-kdsm01-mini",category:"other",brand:"Nubios",model:"KDSM01 Mini",specifications:"Mıknatıslı nano akvaryum cam sileceği",sourceUrl:"https://atakanpetshop.com/nubios-miknatisli-akvaryum-cam-silecegi-mini-771-kdsm01",verifiedAt},
  {id:"nubios-kdsm01-small",category:"other",brand:"Nubios",model:"KDSM01 Small",specifications:"Mıknatıslı küçük akvaryum cam sileceği",sourceUrl:"https://atakanpetshop.com/nubios-miknatisli-akvaryum-cam-silecegi-mini-771-kdsm01",verifiedAt},
  {id:"nubios-cl02",category:"other",brand:"Nubios",model:"CL-02",specifications:"Mıknatıslı ve kazıyıcılı akvaryum cam sileceği",sourceUrl:"https://www.ozelyem.com/nubios",verifiedAt:"2026-08-24"},
  {id:"nubios-cl03",category:"other",brand:"Nubios",model:"CL-03",specifications:"Mıknatıslı ve kazıyıcılı akvaryum cam sileceği",sourceUrl:"https://www.ozelyem.com/nubios",verifiedAt:"2026-08-24"},
  {id:"nubios-cl04",category:"other",brand:"Nubios",model:"CL-04",specifications:"Mıknatıslı ve kazıyıcılı akvaryum cam sileceği",sourceUrl:"https://www.ozelyem.com/nubios",verifiedAt:"2026-08-24"},
  {id:"nubios-fpd51a",category:"other",brand:"Nubios",model:"FPD-51A 5in1",specifications:"58 cm beş fonksiyonlu akvaryum temizlik seti",sourceUrl:"https://www.akvaryem.com.tr/marka/nubios",verifiedAt:"2026-08-24"},
  {id:"nubios-fpd51b",category:"other",brand:"Nubios",model:"FPD51B 5in1",specifications:"67 cm beş parçalı akvaryum bakım kiti",sourceUrl:"https://atakanpetshop.com/nubios-5in1-akvaryum-cam-temizleme-ve-bakim-kiti-67cm-771-fpd51b",verifiedAt},
  {id:"nubios-xy1038",category:"other",brand:"Nubios",model:"XY1038 Filtre Süngeri",specifications:"Siyah biyolojik filtre süngeri · 45 × 45 × 5 cm",sourceUrl:"https://atakanpetshop.com/nubios-filtre-sungeri-siyah-45x45x5-cm-771-xy1038",verifiedAt},
  {id:"nubios-nw-450f",category:"filter",brand:"Nubios",model:"NW-450F",specifications:"Üç işlevli iç filtre · 450 L/saat · 4 W · 0,6 m azami basma yüksekliği",ratedFlowLph:450,powerW:4,sourceUrl:"https://www.ozumakvaryum.com.tr/nubios-nw-450f-4w",verifiedAt:"2026-08-29"},
  {id:"nubios-nw-600f",category:"filter",brand:"Nubios",model:"NW-600F",specifications:"Üç işlevli iç filtre · 600 L/saat · 6 W · 0,8 m azami basma yüksekliği",ratedFlowLph:600,powerW:6,sourceUrl:"https://www.ozumakvaryum.com.tr/nubios-nw-600f-6w",verifiedAt:"2026-08-29"},
  {id:"nubios-nw-800f",category:"filter",brand:"Nubios",model:"NW-800F",specifications:"Üç işlevli iç filtre · 800 L/saat · 15 W · 1 m azami basma yüksekliği",ratedFlowLph:800,powerW:15,sourceUrl:"https://www.ozumakvaryum.com.tr/nubios-nw-800f-15w",verifiedAt:"2026-08-29"},
  {id:"nubios-nb-800f",category:"filter",brand:"Nubios",model:"NB-800F",specifications:"Üç işlevli iç filtre · 800 L/saat · 15 W",ratedFlowLph:800,powerW:15,sourceUrl:"https://www.mascoteriachile.cl/docs/CAT%C3%81LOGO-ACUARISTICA-24%2BOCTUBRE%2B2024.pdf",verifiedAt:"2026-08-18"},
  ...([["MY03",300,3,50],["MY05",450,5,100],["MY07",600,7,150],["MY10",800,10,250]] as const).map(([model,flow,power,maxL])=>({id:`nubios-${model.toLowerCase()}`,category:"filter" as const,brand:"Nubios",model,specifications:`Üç aşamalı kompakt iç filtre · ${flow} L/saat · ${power} W · ${maxL} litreye kadar`,ratedFlowLph:flow,powerW:power,recommendedMaxL:maxL,sourceUrl:"https://creatureculture.co.nz/products/nubios-internal-filter",verifiedAt:"2026-08-25"})),
  {id:"nubios-nw-1500f",category:"filter",brand:"Nubios",model:"NW-1500F",specifications:"Üç işlevli iç filtre · 1500 L/saat · 20 W · 1,2 m azami basma yüksekliği",ratedFlowLph:1500,powerW:20,sourceUrl:"https://www.ozumakvaryum.com.tr/nubios-nw-1500f-20w",verifiedAt:"2026-08-29"},
  {id:"nubios-nb-1500f",category:"filter",brand:"Nubios",model:"NB-1500F",specifications:"Üç işlevli iç filtre · 1500 L/saat · 20 W · 1,2 m azami basma yüksekliği",ratedFlowLph:1500,powerW:20,sourceUrl:"https://www.ozumakvaryum.com.tr/nubios-nb-1500f-20w",verifiedAt:"2026-08-29"},
  {id:"nubios-n201",category:"filter",brand:"Nubios",model:"N-201 Mini Pipo",specifications:"Fanus ve nano akvaryumlar için biyolojik sünger/pipo filtre · hava motoruyla çalışır",requiresAirPump:true,sourceUrl:"https://aquarubi.com/nubios-n-201-hava-ile-calisan-faunus-ic-filtresi",verifiedAt:"2026-08-25"},
  {id:"nubios-yu001",category:"filter",brand:"Nubios",model:"YU-001 Büyük Pipo",specifications:"Büyük boy sünger/pipo üretim filtresi · hava motoruyla çalışır",requiresAirPump:true,sourceUrl:"https://www.ozelyem.com/nubios",verifiedAt:"2026-08-18"},
  {id:"nubios-yu002",category:"filter",brand:"Nubios",model:"YU-002 Orta Pipo",specifications:"Orta boy sünger/pipo üretim filtresi · hava motoruyla çalışır",requiresAirPump:true,sourceUrl:"https://www.ozelyem.com/nubios",verifiedAt:"2026-08-18"},
  {id:"nubios-yu003",category:"filter",brand:"Nubios",model:"YU-003 Küçük Pipo",specifications:"Küçük boy sünger/pipo üretim filtresi · hava motoruyla çalışır",requiresAirPump:true,sourceUrl:"https://www.ozelyem.com/nubios",verifiedAt:"2026-08-18"},
  {id:"nubios-yu118c",category:"filter",brand:"Nubios",model:"YU-118C",specifications:"Kendi motorlu, ince gözenekli tekli sünger/pipo üretim filtresi · yavru akvaryumları için emniyetli emiş · vantuzlu · debi yayımlanmamış",capacityDataNote:"Güvenilir satıcı kaynaklarında debi yayımlanmamış; otomatik filtrasyon hesabına katılmaz.",sourceUrl:"https://www.ozelyem.com/nubios-yu-118c-tekli-motorlu-sunger-pipo-filitre",verifiedAt:"2026-08-25"},
  {id:"nubios-yu119c",category:"filter",brand:"Nubios",model:"YU-119C",specifications:"Kendi motorlu, ince gözenekli tekli sünger/pipo üretim filtresi · yavru akvaryumları için emniyetli emiş · vantuzlu · 11 × 27 cm · debi yayımlanmamış",capacityDataNote:"Güvenilir satıcı kaynaklarında debi yayımlanmamış; otomatik filtrasyon hesabına katılmaz.",sourceUrl:"https://atakanpetshop.com/nubios-filtre-malzemeli-motorlu-pipo-filtre-small-771-yu119c",verifiedAt:"2026-08-25"},
  {id:"nubios-ch-729",category:"other",brand:"Nubios",model:"CH-729 Elektrikli Dip Süpürgesi",specifications:"USB veya 2 × AAA pil ile çalışan dip şifonu ve kum temizleyici · 45–75 cm · 520 L/saat",ratedFlowLph:520,sourceUrl:"https://aquarubi.com/nubios-elektrikli-dip-supurgesi-seti-45-75cm",verifiedAt:"2026-08-25"},
  {id:"nubios-nano-easy-4-5",category:"other",brand:"Nubios",model:"Nano Easy Tank 4,5 L",specifications:"Dahili çift filtrasyonlu masaüstü nano akvaryum seti · 180 L/saat pompa · 3 W pompa · 3 W LED · 4,5 L",ratedFlowLph:180,powerW:3,recommendedMaxL:4.5,sourceUrl:"https://aquarubi.com/nubios-nano-easy-tank-4-5-l-beyaz",verifiedAt:"2026-08-25"},
  {id:"nubios-desktop-set-12",category:"other",brand:"Nubios",model:"Masaüstü Akvaryum Seti 12 L",specifications:"Dahili pompalı ve LED aydınlatmalı masaüstü set · 250 L/saat · 2,5 W pompa · 6,5 W LED · 12 L",ratedFlowLph:250,powerW:2.5,recommendedMaxL:12,sourceUrl:"https://aquarubi.com/nubios-masaustu-akvaryum-seti-12lt",verifiedAt:"2026-08-25"},
  {id:"nubios-desktop-bowl-set-12",category:"other",brand:"Nubios",model:"Masaüstü Akvaryum Seti Fanus 12 L",specifications:"Dahili pompalı ve LED aydınlatmalı yuvarlak masaüstü set · 150 L/saat · 2,5 W pompa · 6,5 W LED · yaklaşık 12 L",ratedFlowLph:150,powerW:2.5,recommendedMaxL:12,sourceUrl:"https://aquarubi.com/nubios-masaustu-akvaryum-seti-fanus",verifiedAt:"2026-08-25"},
  {id:"nubios-nb150-betta-habitat",category:"other",brand:"Nubios",model:"NB-150 Betta Habitat Nano Tank",specifications:"Betta balıkları için kompakt akrilik masaüstü nano akvaryum",sourceUrl:"https://aquarubi.com/nubios-betta-habitat-nano-tank",verifiedAt:"2026-08-25"},
  {id:"nubios-desktop-cube-5l",category:"other",brand:"Nubios",model:"Masaüstü Plastik Akvaryum Seti 5 L Küp",specifications:"Havalandırma kanallı kapaklı, şeffaf dayanıklı plastik masaüstü mini akvaryum seti · 5 L",sourceUrl:"https://www.cikletistpetshop.com/nubios-masasustu-plastik-akvaryum-seti-5-l-kup-7990",verifiedAt:"2026-08-27"},
  {id:"nubios-desktop-faunus-3-7l",category:"other",brand:"Nubios",model:"Masaüstü Plastik Akvaryum Seti 3,7 L Faunus",specifications:"Havalandırma kanallı kapaklı, şeffaf dayanıklı plastik masaüstü mini akvaryum seti · 3,7 L",sourceUrl:"https://www.cikletistpetshop.com/nubios-masasustu-plastik-akvaryum-seti-37l-faunus-7991",verifiedAt:"2026-08-27"},
  {id:"nubios-nano-inca-black",category:"other",brand:"Nubios",model:"NB-A20-INCA-S Nano Akvaryum Inca Siyah",specifications:"Kullanıma hazır ekipman yapılı kompakt nano akvaryum seti · 20 × 22 × 29 cm",sourceUrl:"https://aquarubi.com/nubios-nano-akvaryum-inca-siyah",verifiedAt:"2026-08-27"},
  {id:"nubios-da-l25-cube-13-5l",category:"other",brand:"Nubios",model:"DA-L25 Masaüstü Akvaryum Seti 13,5 L Küp",specifications:"Pleksi masaüstü akvaryum seti · 13,5 L · 25 × 25 × 22 cm",sourceUrl:"https://atakanpetshop.com/nubios-masasustu-akvaryum-seti-135lt-l-kup-670-da-l25",verifiedAt:"2026-08-27"},
  {id:"nubios-shrimp-net-square-7",category:"other",brand:"Nubios",model:"Karides Kepçesi Kare 7 × 7 cm",specifications:"Karides ve küçük akvaryum canlıları için kare bakım kepçesi · 7 × 7 cm",sourceUrl:"https://www.cikletistpetshop.com/nubios-karides-kepcesi-kare-7x7-5238",verifiedAt:"2026-08-27"},
  {id:"nubios-thermo-hygrometer-combo",category:"other",brand:"Nubios",model:"Dijital Kombo Termometre-Higrometre",specifications:"Dijital LCD ekranlı sıcaklık ve bağıl nem ölçer · pil ile çalışır",sourceUrl:"https://www.cikletistpetshop.com/nubios-kombo-olcer-termometre-higrometre-7993",verifiedAt:"2026-08-27"},
  {id:"nubios-hose-clear-12-16-1m",category:"other",brand:"Nubios",model:"Şeffaf Dış Filtre Hortumu 12/16 mm 1 m",specifications:"Dış filtre bağlantıları için şeffaf 12/16 mm hortum · 1 metre",sourceUrl:"https://www.ozelyem.com/nubios",verifiedAt:"2026-08-25"},
  {id:"nubios-hose-clear-16-22-1m",category:"other",brand:"Nubios",model:"Şeffaf Dış Filtre Hortumu 16/22 mm 1 m",specifications:"Dış filtre bağlantıları için şeffaf 16/22 mm hortum · 1 metre",sourceUrl:"https://www.ozelyem.com/nubios",verifiedAt:"2026-08-25"},
  {id:"nubios-hose-12-16-1m",category:"other",brand:"Nubios",model:"Dış Filtre Hortumu 12/16 mm 1 m",specifications:"Dış filtre bağlantıları için 12/16 mm hortum · 1 metre",sourceUrl:"https://www.ozelyem.com/nubios",verifiedAt:"2026-08-25"},
  {id:"nubios-hose-12-16-10m",category:"other",brand:"Nubios",model:"Dış Filtre Hortumu 12/16 mm 10 m",specifications:"Dış filtre bağlantıları için 12/16 mm hortum · 10 metre",sourceUrl:"https://www.ozelyem.com/nubios",verifiedAt:"2026-08-25"},
  {id:"nubios-hose-16-22-1m",category:"other",brand:"Nubios",model:"Dış Filtre Hortumu 16/22 mm 1 m",specifications:"Dış filtre bağlantıları için 16/22 mm hortum · 1 metre",sourceUrl:"https://www.ozelyem.com/nubios",verifiedAt:"2026-08-25"},
  {id:"nubios-hose-16-22-10m",category:"other",brand:"Nubios",model:"Dış Filtre Hortumu 16/22 mm 10 m",specifications:"Dış filtre bağlantıları için 16/22 mm hortum · 10 metre",sourceUrl:"https://www.ozelyem.com/nubios",verifiedAt:"2026-08-25"},
  {id:"nubios-siphon-small",category:"other",brand:"Nubios",model:"Pompalı Dip Sifonu Küçük",specifications:"Küçük akvaryumlar için elle pompalı dip temizleme sifonu",sourceUrl:"https://www.ozelyem.com/nubios",verifiedAt:"2026-08-25"},
  {id:"nubios-siphon-large-valve",category:"other",brand:"Nubios",model:"Pompalı Vanalı Dip Sifonu Büyük",specifications:"Büyük akvaryumlar için elle pompalı ve akış vanalı dip temizleme sifonu",sourceUrl:"https://www.ozelyem.com/nubios",verifiedAt:"2026-08-25"},
  {id:"aquapro-smart-bubble-counter",category:"co2",brand:"Aquapro",model:"Smart Bubble Counter",specifications:"Hortum giriş-çıkışlı akıllı CO₂ damla sayacı",sourceUrl:"https://atakanpetshop.com/aquapro",verifiedAt},
  {id:"aquapro-bubble-counter",category:"co2",brand:"Aquapro",model:"Bubble Counter",specifications:"Hortum giriş-çıkışlı CO₂ damla sayacı",sourceUrl:"https://atakanpetshop.com/aquapro",verifiedAt},
  {id:"aquapro-metal-check-valve",category:"co2",brand:"Aquapro",model:"Alüminyum Metal Check Valve 4/6 mm",specifications:"CO₂ sistemi için alüminyum geri dönüşsüz valf · 4/6 mm hortum",sourceUrl:"https://atakanpetshop.com/aquapro",verifiedAt},
  {id:"aquapro-co2-diffuser-medium",category:"co2",brand:"Aquapro",model:"CO₂ Diffuser Medium",specifications:"Orta boy CO₂ difüzörü",sourceUrl:"https://atakanpetshop.com/aquapro",verifiedAt},
  {id:"aquapro-co2-diffuser-large",category:"co2",brand:"Aquapro",model:"CO₂ Diffuser Large",specifications:"Büyük boy CO₂ difüzörü",sourceUrl:"https://atakanpetshop.com/aquapro",verifiedAt},
  {id:"aquapro-nano-air-diffuser-large",category:"other",brand:"Aquapro",model:"Nano Air Diffuser Large",specifications:"Mikro gözenekli seramik hava difüzörü · 90–150 cm akvaryumlar",recommendedTankLengthCm:[90,150],sourceUrl:"https://atakanpetshop.com/aquapro-nano-air-difuzor-large-hava-tasi",verifiedAt},
  {id:"aquapro-lily-pipe-glass-9",category:"other",brand:"Aquapro",model:"Lily Pipe Glass 9 mm",specifications:"Dış filtre için cam emiş ve basış takımı · 9 mm",sourceUrl:"https://atakanpetshop.com/aquapro",verifiedAt},
  {id:"aquapro-lily-pipe-glass-16",category:"other",brand:"Aquapro",model:"Lily Pipe Glass 16 mm",specifications:"Dış filtre için cam emiş ve basış takımı · 16 mm",sourceUrl:"https://atakanpetshop.com/aquapro",verifiedAt},
  {id:"aquapro-lily-flow-s-12",category:"other",brand:"Aquapro",model:"Lily Flow S 12 mm",specifications:"Dış filtre için akışı yumuşatan şeffaf çıkış borusu · 12 mm",sourceUrl:"https://atakanpetshop.com/aquapro-lily-flow-s-12mm-6975017512171",verifiedAt},
  {id:"aquapro-inlet-strainer-12",category:"other",brand:"Aquapro",model:"Inlet Emiş Borusu Süzgeci 12 mm",specifications:"Çok ince gözenekli, yavru ve karides korumalı dış filtre emiş borusu süzgeci · 12 mm",sourceUrl:"https://atakanpetshop.com/aquapro-inlet-emis-borusu-suzgeci-12mm",verifiedAt:"2026-08-25"},
  {id:"aquapro-inlet-strainer-16",category:"other",brand:"Aquapro",model:"Inlet Emiş Borusu Süzgeci 16 mm",specifications:"Çok ince gözenekli, yavru ve karides korumalı dış filtre emiş borusu süzgeci · 16 mm",sourceUrl:"https://atakanpetshop.com/aquapro-inlet-emis-borusu-suzgeci-16mm",verifiedAt:"2026-08-25"},
  {id:"aquapro-inlet-12",category:"other",brand:"Aquapro",model:"Inlet 12 mm Emiş Süzgeç",specifications:"Şeffaf PETG · Yavru ve karides korumalı dış filtre emiş süzgeci · 12 mm",sourceUrl:"https://atakanpetshop.com/aquapro-inlet-12mm-emis-suzgec-6975017512225",verifiedAt:"2026-08-25"},
  {id:"aquapro-inlet-16",category:"other",brand:"Aquapro",model:"Inlet 16 mm Emiş Süzgeç",specifications:"Şeffaf PETG · Yavru ve karides korumalı dış filtre emiş süzgeci · 16 mm",sourceUrl:"https://atakanpetshop.com/aquapro-inlet-16mm-emis-suzgec-6975017512546",verifiedAt:"2026-08-25"},
  {id:"aquapro-inout-16-22",category:"other",brand:"Aquapro",model:"Emiş Basış Takımı 16/22 mm",specifications:"Yüzey temizleyicili ve 0,8 mm yavru korumalı dış filtre emiş-basış takımı · 16/22 mm",sourceUrl:"https://atakanpetshop.com/aquapro-emis-basis-takimi-1622-mm-6975017511709",verifiedAt},
  {id:"aquapro-mini-pro-16-22",category:"other",brand:"Aquapro",model:"Mini Pro 16/22 mm",specifications:"Paslanmaz çelik dış filtre emiş ve basış takımı · 16/22 mm",sourceUrl:"https://atakanpetshop.com/aquapro",verifiedAt},
  {id:"aquapro-pipe-holder-s",category:"other",brand:"Aquapro",model:"Metal Pipe Holder S 12–16 mm",specifications:"Alüminyum filtre hortumu tutucu · 12–16 mm",sourceUrl:"https://atakanpetshop.com/aquapro",verifiedAt},
  {id:"aquapro-pipe-holder-l",category:"other",brand:"Aquapro",model:"Metal Pipe Holder L 16–22 mm",specifications:"Alüminyum filtre hortumu tutucu · 16–22 mm",sourceUrl:"https://atakanpetshop.com/aquapro",verifiedAt},
  {id:"aquapro-pipe-brush-150",category:"other",brand:"Aquapro",model:"Pipe Brush 150 cm",specifications:"Dış filtre hortumu temizleme fırçası · 150 cm",sourceUrl:"https://atakanpetshop.com/aquapro",verifiedAt},
  {id:"aquapro-co2-diffuser-small",category:"co2",brand:"Aquapro",model:"CO₂ Diffuser Small",specifications:"Küçük akvaryumlar için mikro gözenekli seramik CO₂ difüzörü",sourceUrl:"https://atakanpetshop.com/aquapro",verifiedAt:"2026-08-24"},
  {id:"aquapro-co2-diffuser-hang-small",category:"co2",brand:"Aquapro",model:"CO₂ Diffuser Hang Small",specifications:"Küçük bitkili akvaryumlar için kırılmaz akrilik, asma tip seramik CO₂ difüzörü",sourceUrl:"https://atakanpetshop.com/aquapro-co2-difuzoru-hang-small",verifiedAt:"2026-08-24"},
  {id:"aquapro-co2-diffuser-hang-medium",category:"co2",brand:"Aquapro",model:"CO₂ Diffuser Hang Medium",specifications:"Asma tip kırılmaz akrilik seramik CO₂ difüzörü · 125–300 litre",recommendedMinL:125,recommendedMaxL:300,sourceUrl:"https://atakanpetshop.com/aquapro-co2-difuzoru-hang-medium",verifiedAt:"2026-08-24"},
  {id:"aquapro-pipe-holder-xs",category:"other",brand:"Aquapro",model:"Pipe Holder XS 12–16 mm",specifications:"Dış filtre hortumu ve borularını sabitleyen kompakt tutucu · 12–16 mm",sourceUrl:"https://atakanpetshop.com/aquapro",verifiedAt:"2026-08-24"},
  {id:"aquapro-lily-flow-m-16",category:"other",brand:"Aquapro",model:"Lily Flow M 16 mm",specifications:"Dış filtre için akışı yumuşatan şeffaf çıkış borusu · 16 mm",sourceUrl:"https://atakanpetshop.com/aquapro",verifiedAt:"2026-08-24"},
  {id:"aquapro-inout-12-16",category:"other",brand:"Aquapro",model:"Emiş Basış Takımı 12/16 mm",specifications:"PETG akrilik, yüzey temizleyicili ve 0,8 mm yavru korumalı dış filtre emiş-basış takımı · 12/16 mm",sourceUrl:"https://atakanpetshop.com/aquapro-emis-basis-takimi-1216-mm-6975017511693",verifiedAt:"2026-08-24"},
  {id:"aquapro-lily-pipe-glass-12",category:"other",brand:"Aquapro",model:"Lily Pipe Glass 12 mm",specifications:"Dış filtre için borosilikat cam emiş ve basış takımı · 12 mm",sourceUrl:"https://atakanpetshop.com/aquapro-lily-pipe-glass-12mm-cam-emis-basis-takimi",verifiedAt:"2026-08-24"},
  {id:"aquapro-lily-pipe-premium-12",category:"other",brand:"Aquapro",model:"Lily Pipe Glass Premium 12 mm",specifications:"Ayarlanabilir yüzey emişli borosilikat cam dış filtre emiş ve basış takımı · 12 mm",sourceUrl:"https://atakanpetshop.com/aquapro-lily-pipe-glass-premium-12mm-yuzey-emisli-cam-emis-basis-takimi",verifiedAt:"2026-08-24"},
  {id:"aquapro-lily-pipe-premium-16",category:"other",brand:"Aquapro",model:"Lily Pipe Glass Premium 16 mm",specifications:"Ayarlanabilir yüzey emişli borosilikat cam dış filtre emiş ve basış takımı · 16 mm",sourceUrl:"https://atakanpetshop.com/aquapro-lily-pipe-glass-premium-16mm-yuzey-emisli-cam-emis-basis-takimi",verifiedAt:"2026-08-24"},
  {id:"aquapro-glass-plant-pot",category:"other",brand:"Aquapro",model:"Glass Plant Pot",specifications:"Çift vantuzlu, su akış delikli şeffaf cam akvaryum bitki saksısı · 7 × 7 × 6 cm",sourceUrl:"https://atakanpetshop.com/aquapro-glass-plant-pot-cam-bitki-saksisi",verifiedAt:"2026-08-24"},
];

const waterbearEquipment:EquipmentProfile[]=[
  {id:"waterbear-wb-g04",category:"filter",brand:"WaterBear",model:"WB-G04",specifications:"Biyo-tekerlekli askı filtre · 250 L/saat · 3 W",ratedFlowLph:250,powerW:3,sourceUrl:"https://atakanpetshop.com/waterbear-wb-g04-aski-filtre-3w-250ls",verifiedAt},
  {id:"waterbear-wb-g220",category:"filter",brand:"WaterBear",model:"WB-G220",specifications:"Ayarlanabilir, yüzey skimmerli üç aşamalı biyo-tekerlek askı filtre · Türkiye modeli 500 L/saat · 8 W · 19 × 11,5 × 15 cm",ratedFlowLph:500,powerW:8,adjustableFlow:true,sourceUrl:"https://aquarubi.com/waterbear-wb-g220-akvaryum-aski-selale-filtre",verifiedAt:"2026-08-25"},
  ...([['Q418',120,4,'Tek çıkış · 1 × 2 L/dakika'],['Q428',420,6,'Çift çıkış · 2 × 3,5 L/dakika'],['Q448',840,10,'Dört çıkış · 4 × 3,5 L/dakika'],['Q458',1200,12,'Dört çıkış · 4 × 5 L/dakika'],['Q708',60,undefined,'Tek çıkış · 1 L/dakika'],['Q718',90,undefined,'Tek çıkış · 1,5 L/dakika']] as const).map(([model,ratedFlowLph,powerW,detail])=>({id:`waterbear-${model.toLowerCase()}`,category:"air_pump" as const,brand:"WaterBear",model,specifications:`${detail} hava motoru · ${ratedFlowLph} L/saat${powerW ? ` · ${powerW} W` : ''}`,ratedFlowLph,...(powerW ? {powerW} : {}),sourceUrl:"https://akvaryumbalikavm.com.tr/waterbear",verifiedAt:"2026-08-24"})),
  ...[["880F",650,15],["1880F",880,25],["2880F",1800,30],["3880F",2500,40]].map(([model,ratedFlowLph,powerW])=>({id:`waterbear-${String(model).toLowerCase()}`,category:"filter" as const,brand:"WaterBear",model:String(model),specifications:`Tepe filtre · ${ratedFlowLph} L/saat · ${powerW} W`,ratedFlowLph:Number(ratedFlowLph),powerW:Number(powerW),sourceUrl:"https://atakanpetshop.com/akvaryum-ust-filtreler",verifiedAt})),
  ...[["WB-177",500,8],["WB-277",900,12],["WB-377",1200,18],["WB-477",1600,25],["WB-1771",500,8],["WB-2771",900,12],["WB-3771",1200,18],["WB-4771",1600,25]].map(([model,ratedFlowLph,powerW])=>({id:`waterbear-${String(model).toLowerCase()}`,category:"other" as const,brand:"WaterBear",model:String(model),specifications:`Dalgıç/sump pompası · ${ratedFlowLph} L/saat · ${powerW} W`,ratedFlowLph:Number(ratedFlowLph),powerW:Number(powerW),sourceUrl:"https://akvaryumbalikavm.com.tr/waterbear",verifiedAt:"2026-08-24"})),
  ...[["WB-1770",500,8],["WB-2770",800,12],["WB-3770",1200,18],["WB-4770",1600,25]].map(([model,ratedFlowLph,powerW])=>({id:`waterbear-${String(model).toLowerCase()}`,category:"filter" as const,brand:"WaterBear",model:String(model),specifications:`İç filtre · ${ratedFlowLph} L/saat · ${powerW} W`,ratedFlowLph:Number(ratedFlowLph),powerW:Number(powerW),sourceUrl:"https://akvaryumbalikavm.com.tr/waterbear",verifiedAt:"2026-08-24"})),
  ...[["WB-D303",2500,30],["WB-D305",3300,60],["WB-D307",4000,90]].map(([model,ratedFlowLph,powerW])=>({id:`waterbear-${String(model).toLowerCase()}`,category:"other" as const,brand:"WaterBear",model:String(model),specifications:`Dalgıç/sump pompası · ${ratedFlowLph} L/saat · ${powerW} W`,ratedFlowLph:Number(ratedFlowLph),powerW:Number(powerW),sourceUrl:"https://akvaryumbalikavm.com.tr/waterbear",verifiedAt:"2026-08-24"})),
  ...[["WB-Z601",3000,3],["WB-Z602",7000,10]].map(([model,ratedFlowLph,powerW])=>({id:`waterbear-${String(model).toLowerCase()}`,category:"other" as const,brand:"WaterBear",model:String(model),specifications:`Dalga motoru · ${ratedFlowLph} L/saat · ${powerW} W`,ratedFlowLph:Number(ratedFlowLph),powerW:Number(powerW),sourceUrl:"https://akvaryumbalikavm.com.tr/waterbear",verifiedAt:"2026-08-24"})),
  {id:"waterbear-wb-g800",category:"filter",brand:"WaterBear",model:"WB-G800",specifications:"Zaman ayarlı UV modüllü iç filtre · 800 L/saat · 10 W",ratedFlowLph:800,powerW:10,sourceUrl:"https://akvaryumbalikavm.com.tr/filtreler",verifiedAt:"2026-08-24"},
  {id:"waterbear-wb-g810",category:"filter",brand:"WaterBear",model:"WB-G810",specifications:"Zaman ayarlı UV modüllü iç filtre · 900 L/saat · 15 W",ratedFlowLph:900,powerW:15,sourceUrl:"https://akvaryumbalikavm.com.tr/filtreler",verifiedAt:"2026-08-24"},
  {id:"waterbear-c3m",category:"other",brand:"WaterBear",model:"C3M",specifications:"10 mm cama kadar üç parçalı yüzer mıknatıslı cam temizleyici",sourceUrl:"https://akvaryumbalikavm.com.tr/waterbear",verifiedAt:"2026-08-24"},
  {id:"waterbear-sd01",category:"filter",brand:"WaterBear",model:"SD-01",specifications:"Hava ile çalışan pipo filtre",requiresAirPump:true,sourceUrl:"https://atakanpetshop.com/akvaryum-sunger-filtreler-pipo-filtre-dophin-sfp",verifiedAt},
  {id:"waterbear-sd02",category:"filter",brand:"WaterBear",model:"SD-02",specifications:"Motorlu pipo filtre · 200 L/saat · 2 W",ratedFlowLph:200,powerW:2,sourceUrl:"https://atakanpetshop.com/akvaryum-sunger-filtreler-pipo-filtre-dophin-sfp",verifiedAt},
];

const regentEquipment:EquipmentProfile[]=[
  ["5500",2,"Tek çıkış",80,false,"https://hydroponic.co.za/size/regent-5500/"],
  ["6500",2.4,"Tek çıkış",100,false,"https://atakanpetshop.com/regent-6500-tek-cikisli-hava-motoru-2-4w"],
  ["7500",3,"Çift çıkış",150,false,"https://atakanpetshop.com/regent-7500-cift-cikisli-hava-motoru-3w"],
  ["8500",4,"Çift çıkış",210,false,"https://atakanpetshop.com/regent-8500-cift-cikisli-hava-motoru-4w"],
  ["9500",4,"Çift çıkış, ayarlanabilir",240,true,"https://atakanpetshop.com/regent-9500-cift-cikisli-hava-motoru-4w"],
].map(([model,powerW,outlet,ratedFlowLph,adjustableFlow,sourceUrl])=>({id:`regent-${model}`,category:"air_pump",brand:"Regent",model:String(model),specifications:`${outlet} hava motoru · ${ratedFlowLph} L/saat · ${powerW} W`,ratedFlowLph:Number(ratedFlowLph),powerW:Number(powerW),adjustableFlow:Boolean(adjustableFlow),sourceUrl:String(sourceUrl),verifiedAt:model==="5500"?"2026-08-26":"2026-08-24"}));
regentEquipment.push({id:"regent-calm-rc-006",category:"air_pump",brand:"Regent",model:"Calm RC-006",specifications:"Çift çıkışlı hava motoru · 180 L/saat · 3 W · 200 litreye kadar",ratedFlowLph:180,powerW:3,recommendedMaxL:200,adjustableFlow:true,sourceUrl:"https://rozetka.com.ua/kwzone_6938104010394/p16905500/",verifiedAt:"2026-08-18"});

const sharkEquipment:EquipmentProfile[]=[
  ["Shark Pro 500",530,4],["Shark Pro 700",720,7],["Shark Pro 900",910,10],
].map(([model,ratedFlowLph,powerW])=>({id:`sicce-${String(model).toLowerCase().replace(/[^a-z0-9]+/g,"-")}`,category:"filter",brand:"Shark (Sicce)",model:String(model),specifications:`Ayarlanabilir modüler iç filtre · ${ratedFlowLph} L/saat · ${powerW} W`,ratedFlowLph:Number(ratedFlowLph),powerW:Number(powerW),adjustableFlow:true,sourceUrl:"https://us.sicce.com/en/products/filters/shark-pro.html",verifiedAt}));
sharkEquipment.push(
  ...([["Shark ADV 400",400,6.5],["Shark ADV 600",600,8.2],["Shark ADV 800",800,8.6]] as const).map(([model,ratedFlowLph,powerW])=>({
    id:`sicce-${model.toLowerCase().replace(/[^a-z0-9]+/g,"-")}`,category:"filter" as const,brand:"Shark (Sicce)",model,
    specifications:`Manyetik hızlı bağlantılı, ayarlanabilir modüler iç filtre · ${ratedFlowLph} L/saat · ${powerW} W`,
    ratedFlowLph,powerW,adjustableFlow:true,sourceUrl:"https://www.sicce.com/en/products/filters/shark-adv-internal.html",verifiedAt:"2026-08-24",
  })),
  {id:"sicce-shark-pro-nano-250",category:"filter",brand:"Shark (Sicce)",model:"Shark PRO NANO 250",specifications:"Dikey/yatay kullanılabilen ayarlanabilir nano iç filtre · 250 L/saat · 3,5 W · 40–60 L",ratedFlowLph:250,powerW:3.5,recommendedMinL:40,recommendedMaxL:60,adjustableFlow:true,sourceUrl:"https://us.sicce.com/media/wysiwyg/ISTRUZIONI/80N821-A_-_SHARK_PRO_NANO_istruzioni_PRINT.pdf",verifiedAt:"2026-08-24"},
  {id:"sicce-shark-pro-nano-320",category:"filter",brand:"Shark (Sicce)",model:"Shark PRO NANO 320",specifications:"Dikey/yatay kullanılabilen ayarlanabilir nano iç filtre · 320 L/saat · 4 W · 60–100 L",ratedFlowLph:320,powerW:4,recommendedMinL:60,recommendedMaxL:100,adjustableFlow:true,sourceUrl:"https://us.sicce.com/media/wysiwyg/ISTRUZIONI/80N821-A_-_SHARK_PRO_NANO_istruzioni_PRINT.pdf",verifiedAt:"2026-08-24"},
);

const armaturkSource="https://www.armaturk.com.tr/tatli-su-armaturleri-81/";
const armaturkEquipment:EquipmentProfile[]=[
  {model:"Nano Türk",lengthCm:20,series:"Nano"},
  {model:"Plant Nano20",lengthCm:20,series:"Plant Nano"},
  {model:"Plant Nano25",lengthCm:25,series:"Plant Nano"},
  ...[30,40,50,60,70,80,90,100].map(lengthCm=>({model:`Eko ${lengthCm} cm`,lengthCm,series:"Eko"})),
  ...[["1030L",30],["1040L",40],["1050L",50],["1060L",60],["1070L",70],["1080L",80],["1090L",90],["1100L",100],["1200L",120],["1300L",130],["1500L",150]].map(([model,lengthCm])=>({model:String(model),lengthCm:Number(lengthCm),series:"L"})),
  ...[["1030H",30],["2040H",40],["2050H",50],["2060H",60],["2070H",70],["2080H",80],["2090H",90],["2100H",100],["2200H",120],["2300H",130],["2500H",150]].map(([model,lengthCm])=>({model:String(model),lengthCm:Number(lengthCm),series:"H"})),
  ...[40,60,100].map(lengthCm=>({model:`Premium ${lengthCm} cm`,lengthCm,series:"Premium"})),
  {model:"Fanus ve Beta Kabı Aydınlatma Seti",lengthCm:0,series:"Nano"},
].map(({model,lengthCm,series})=>({
  id:`armaturk-${model.toLowerCase().replace(/[^a-z0-9]+/g,"-")}`,category:"lighting" as const,brand:"Armatürk",model,
  specifications:lengthCm?`${series} serisi akvaryum LED armatürü · ${lengthCm} cm gövde`:`${series} sınıfı fanus ve beta kabı LED aydınlatma seti`,
  ...(lengthCm?{recommendedTankLengthCm:[lengthCm,lengthCm+14] as [number,number]}:{}),sourceUrl:armaturkSource,verifiedAt:"2026-08-24",
}));

armaturkEquipment.push(
  {
    id:"armaturk-2040t",category:"lighting",brand:"Armatürk",model:"2040T Tuzlu Su 40 cm",
    specifications:"Tuzlu su ve LPS mercanlar için LED armatür · 48 W · 13.000 K · 5.400 lm · 450–490 nm · 40 cm gövde",
    powerW:48,recommendedTankLengthCm:[39,54],
    sourceUrl:"https://www.armaturk.com.tr/armaturk-40cm-tuzlu-su-armaturu-P1571",verifiedAt:"2026-08-27",
  },
  {
    id:"armaturk-2060t",category:"lighting",brand:"Armatürk",model:"2060T Tuzlu Su 60 cm",
    specifications:"Tuzlu su ve LPS mercanlar için LED armatür · 72 W · 13.000 K · 10.000 lm · 450–490 nm · teknik ölçü bloğunda 60 cm gövde; açıklamadaki tek bir cümlede 50 cm yazım farkı var",
    powerW:72,recommendedTankLengthCm:[59,74],
    sourceUrl:"https://www.armaturk.com.tr/armaturk-60cm-tuzlu-su-armaturu-2060t-P1572",verifiedAt:"2026-08-27",
  },
  {
    id:"armaturk-2070t",category:"lighting",brand:"Armatürk",model:"2070T Tuzlu Su 70 cm",
    specifications:"Tuzlu su ve LPS mercanlar için LED armatür · 84 W · 13.000 K · 12.000 lm · 450–490 nm · 70 cm gövde",
    powerW:84,recommendedTankLengthCm:[69,84],
    sourceUrl:"https://www.armaturk.com.tr/armaturk-70-cm-tuzlu-su-armaturu-2070t-P1573",verifiedAt:"2026-08-27",
  },
  {
    id:"armaturk-2080t",category:"lighting",brand:"Armatürk",model:"2080T Tuzlu Su 80 cm",
    specifications:"Tuzlu su LED armatürü · resmî ürün başlığı 2080T, açıklama gövdesinde 2080H yazım çelişkisi var; teknik değerler otomatik uygunluk hesabına aktarılmadı",
    sourceUrl:"https://www.armaturk.com.tr/armaturk-80-cm-tuzlu-su-armaturu-2080t-P1575",verifiedAt:"2026-08-27",
  },
  {
    id:"armaturk-cooling-fan-1",category:"other",brand:"Armatürk",model:"1'li Akvaryum Soğutucu Fan",
    specifications:"Otomatik dijital termostat · 1 fan · 0–30 °C ayar · 180° hareket · 9 mm'ye kadar cam · 14 × 12 × 4 cm",
    recommendedMaxL:50,sourceUrl:"https://www.armaturk.com.tr/1l-fanli-akvaryum-sogutucu-1li-fan-P477",verifiedAt:"2026-08-27",
  },
  {
    id:"armaturk-cooling-fan-2",category:"other",brand:"Armatürk",model:"2'li Akvaryum Soğutucu Fan",
    specifications:"Otomatik dijital termostat · 2 fan · 0–30 °C ayar · 180° hareket · 13 mm'ye kadar cam · 24 × 14 × 3 cm",
    recommendedMaxL:120,sourceUrl:"https://www.armaturk.com.tr/2li-akvaryum-sogutucu-fan-2li-fan-P231",verifiedAt:"2026-08-27",
  },
  {
    id:"armaturk-cooling-fan-3",category:"other",brand:"Armatürk",model:"3'lü Akvaryum Soğutucu Fan",
    specifications:"Otomatik dijital termostat · 3 fan · 0–30 °C ayar · 180° hareket · 13 mm'ye kadar cam · 32 × 14 × 3 cm",
    recommendedMinL:150,recommendedMaxL:250,sourceUrl:"https://www.armaturk.com.tr/3-lu-akvaryum-sogutucu-fan-3-lu-fan-P229",verifiedAt:"2026-08-27",
  },
  {
    id:"armaturk-cooling-fan-4",category:"other",brand:"Armatürk",model:"4'lü Akvaryum Soğutucu Fan",
    specifications:"Otomatik dijital termostat · 4 fan · 12 V DC · 0–30 °C ayar · NTC10K sensör · 40 × 13 × 4 cm",
    recommendedMaxL:350,sourceUrl:"https://www.armaturk.com.tr/4-lu-akvaryum-sogutucu-fan-4-lu-fan-P230",verifiedAt:"2026-08-27",
  },
  {
    id:"armaturk-spare-light-foot",category:"other",brand:"Armatürk",model:"Armatür Yedek Ayak",
    specifications:"Armatürk armatürleri için 6 mm pleksi yedek ayak · 10 cm yükseklik · 20 cm uzunluk",
    sourceUrl:"https://www.armaturk.com.tr/armaturk-yedek-ayak-armatur-ayak-P298",verifiedAt:"2026-08-27",
  },
  {
    id:"armaturk-pipe-holder",category:"other",brand:"Armatürk",model:"Pipe Holder Dış Filtre Boru Tutucu",
    specifications:"İkili takım · 6 mm ve 18 mm dış çaptaki borular için",
    sourceUrl:"https://www.armaturk.com.tr/pipe-holder-dis-filtre-boru-tutucu-P1576",verifiedAt:"2026-08-27",
  },
  {
    id:"armaturk-canister-suction-cup-12-16",category:"other",brand:"Armatürk",model:"12/16 mm Kelepçeli Dış Filtre Vantuzu",
    specifications:"12/16 mm dış filtre hortumu için kelepçeli vantuz",
    sourceUrl:"https://www.armaturk.com.tr/12-16-mm-kelepceli-dis-filtre-vantuzu-P1577",verifiedAt:"2026-08-27",
  },
  {
    id:"armaturk-canister-hose-12-16",category:"other",brand:"Armatürk",model:"Dış Filtre Hortumu 12×16 mm / 1 m",
    specifications:"12×16 mm dış filtre hortumu · 1 metre",
    sourceUrl:"https://www.armaturk.com.tr/dis-filtre-hortumu-12x16mm-1-metre-1564-P1564",verifiedAt:"2026-08-27",
  },
  {
    id:"armaturk-canister-hose-16-22",category:"other",brand:"Armatürk",model:"Dış Filtre Hortumu 16×22 mm / 1 m",
    specifications:"16×22 mm dış filtre hortumu · 1 metre",
    sourceUrl:"https://www.armaturk.com.tr/dis-filtre-hortumu-16x22-mm-1-metre-1565-P1565",verifiedAt:"2026-08-27",
  },
);

const mecEquipment:EquipmentProfile[]=[
  {id:"mec-heater-suction-cup",category:"other",brand:"Meç",model:"İsıtıcı Vantuzu",specifications:"İsıtıcı sabitleme vantuzu · tekli ve 10'lu paket"},
  {id:"mec-heater-suction-cup-black",category:"other",brand:"Meç",model:"Siyah Isıtıcı Vantuzu",specifications:"Siyah ısıtıcı sabitleme vantuzu · tekli"},
  {id:"mec-airline-t-splitter",category:"other",brand:"Meç",model:"Hava Hortumu T Dağıtıcı",specifications:"Hava hortumu T bağlantısı · tekli ve 10'lu paket"},
  {id:"mec-airline-valve",category:"other",brand:"Meç",model:"Hava Hortumu Musluğu",specifications:"Hava hortumu akış vanası · tekli ve 10'lu paket"},
  {id:"mec-airline-suction-cup",category:"other",brand:"Meç",model:"Hava Hortumu Vantuzu",specifications:"Hava hortumu sabitleme vantuzu · 10'lu paket"},
  {id:"mec-brine-shrimp-net",category:"other",brand:"Meç",model:"Artemia Süzgeci 9 cm",specifications:"Artemia çıkartma süzgeci/kepçesi"},
].map((item):EquipmentProfile=>({...item,category:"other",sourceUrl:"https://atakanpetshop.com/mec",verifiedAt}));

const mecAirDrivenFilters:EquipmentProfile[]=[
  {id:"mec-pipo-5",model:"Pipo 5",specifications:"Küçük boy sünger pipo filtre · yaklaşık 9 × 16 cm",sourceUrl:"https://cukurovapet.com.tr/urun/mec-akvaryum-pi%CC%87po-fi%CC%87ltre-kucuk-boy-5-3015"},
  {id:"mec-pipo-10",model:"Pipo 10",specifications:"Orta boy sünger pipo filtre",sourceUrl:"https://emirakvaryum.com/index.php?path=109&route=product%2Fcategory"},
  {id:"mec-pipo-15",model:"Pipo 15",specifications:"Büyük boy sünger pipo filtre",sourceUrl:"https://emirakvaryum.com/index.php?path=109&route=product%2Fcategory"},
  {id:"mec-hamburg-pipo",model:"Modüler Hamburg Pipo Filtre",specifications:"Modüler biyolojik Hamburg tipi sünger filtre",sourceUrl:"https://cukurovapet.com.tr/marka/mec"},
  {id:"mec-turbo-pipo",model:"Turbo Pipo Filtre",specifications:"25 cm gövdeli biyolojik sünger pipo filtre",sourceUrl:"https://www.trendyol.com/mec/mec-turbo-pipo-filtre-nostaljik-p-802855493"},
  {id:"mec-f002",model:"F002 Tekli Pipo Filtre",specifications:"Tek süngerli biyolojik pipo filtre",sourceUrl:"https://www.cmticaret.com/filtreler-motorlar-ve-isiticilar/"},
  {id:"mec-f003",model:"F003 Çiftli Pipo Filtre",specifications:"Çift süngerli biyolojik pipo filtre",sourceUrl:"https://www.cmticaret.com/filtreler-motorlar-ve-isiticilar/"},
  {id:"mec-f008",model:"F008 Box Filtre",specifications:"Üretim ve yavru akvaryumları için kutu filtre",sourceUrl:"https://www.cmticaret.com/filtreler-motorlar-ve-isiticilar/"},
].map((item):EquipmentProfile=>({
  ...item,category:"filter",brand:"Meç",requiresAirPump:true,verifiedAt:"2026-08-18",
}));

const netleaPumpSource="https://atakanpetshop.com/netlea";
const netleaPumps:EquipmentProfile[]=[
  {id:"netlea-s1500",category:"other",brand:"Netlea",model:"S1500",specifications:"20 kademeli ayarlanabilir DC kafa motoru · 420–1500 L/saat · 12 W · 1,4–3,5 m basma yüksekliği",ratedFlowLph:1500,powerW:12,adjustableFlow:true,sourceUrl:"https://aquazonefish.vn/products/may-bom-nuoc-netlea-cao-cap",verifiedAt:"2026-08-25"},
  {id:"netlea-s3000",category:"other",brand:"Netlea",model:"S3000",specifications:"20 kademeli ayarlanabilir DC kafa motoru · 820–3000 L/saat · 20 W · 1,9–3,8 m basma yüksekliği",ratedFlowLph:3000,powerW:20,adjustableFlow:true,sourceUrl:"https://aquazonefish.vn/products/may-bom-nuoc-netlea-cao-cap",verifiedAt:"2026-08-25"},
  {id:"netlea-s4000",category:"other",brand:"Netlea",model:"S4000",specifications:"20 kademeli ayarlanabilir DC kafa motoru · 1650–4000 L/saat · 25 W · 2,2–4,5 m basma yüksekliği",ratedFlowLph:4000,powerW:25,adjustableFlow:true,sourceUrl:"https://aquazonefish.vn/products/may-bom-nuoc-netlea-cao-cap",verifiedAt:"2026-08-25"},
  {id:"netlea-s1500-c",category:"other",brand:"Netlea",model:"C1500",specifications:"Ayarlanabilir DC kafa motoru · 600–1500 L/saat · 2–12 W · 1,4–3,5 m basma yüksekliği",ratedFlowLph:1500,powerW:12,adjustableFlow:true,sourceUrl:"https://aquazonefish.vn/products/may-bom-nuoc-netlea-cao-cap",verifiedAt:"2026-08-25"},
  {id:"netlea-c4000",category:"other",brand:"Netlea",model:"C4000",specifications:"Altı kademeli ayarlanabilir DC kafa motoru · 4000 L/saat · 3–25 W · 4 m basma yüksekliği",ratedFlowLph:4000,powerW:25,adjustableFlow:true,sourceUrl:"https://atakanpetshop.com/netlea-c4000-debi-ayarli-kafa-motoru-25w-4000lh-4-metre-6949625020212",verifiedAt},
  {id:"netlea-c5000",category:"other",brand:"Netlea",model:"C5000",specifications:"Ayarlanabilir DC kafa motoru · 5000 L/saat · 35 W · 4,5 m basma yüksekliği",ratedFlowLph:5000,powerW:35,adjustableFlow:true,sourceUrl:"https://atakanpetshop.com/netlea-c5000-debi-ayarli-kafa-motoru-35w-5000lh-45-metre-6949625020229",verifiedAt},
  {id:"netlea-c6000",category:"other",brand:"Netlea",model:"C6000",specifications:"Ayarlanabilir DC kafa motoru · 6000 L/saat · 40 W · 5 m basma yüksekliği",ratedFlowLph:6000,powerW:40,adjustableFlow:true,sourceUrl:netleaPumpSource,verifiedAt},
  {id:"netlea-c7000",category:"other",brand:"Netlea",model:"C7000",specifications:"Ayarlanabilir DC kafa motoru · 7000 L/saat · 50 W · 5 m · 1400 litreye kadar",ratedFlowLph:7000,powerW:50,recommendedMaxL:1400,adjustableFlow:true,sourceUrl:"https://atakanpetshop.com/netlea-c7000-dc-debi-ayarli-kafa-motoru-50w-7000ls-5m",verifiedAt},
  {id:"netlea-sg2500",category:"other",brand:"Netlea",model:"SG2500",specifications:"Bluetooth kontrollü DC kafa motoru · 2500 L/saat · 22 W · 3,8 m basma yüksekliği",ratedFlowLph:2500,powerW:22,adjustableFlow:true,sourceUrl:netleaPumpSource,verifiedAt},
  {id:"netlea-sg5000",category:"other",brand:"Netlea",model:"SG5000",specifications:"Bluetooth kontrollü DC kafa motoru · 5000 L/saat · 35 W · 4,5 m basma yüksekliği",ratedFlowLph:5000,powerW:35,adjustableFlow:true,sourceUrl:netleaPumpSource,verifiedAt},
  {id:"netlea-s5500",category:"other",brand:"Netlea",model:"S5500",specifications:"20 kademeli ayarlanabilir DC kafa motoru · 2200–5500 L/saat · 35 W · 2,4–4,6 m basma yüksekliği",ratedFlowLph:5500,powerW:35,adjustableFlow:true,sourceUrl:"https://aquazonefish.vn/products/may-bom-nuoc-netlea-cao-cap",verifiedAt:"2026-08-25"},
];

const netleaFilters:EquipmentProfile[]=[
  {id:"netlea-no1-dc-canister",category:"filter",brand:"Netlea",model:"No.1 DC Canister Filter",specifications:"Ayarlanabilir DC dış filtre · 980 L/saat azami debi",ratedFlowLph:980,adjustableFlow:true,sourceUrl:"https://topickaquarium.com/collections/filterations/products/netlea-external-canister-filter-dc-pump",verifiedAt:"2026-08-25"},
  {id:"netlea-no2-dc-canister",category:"filter",brand:"Netlea",model:"No.2 DC Canister Filter",specifications:"Ayarlanabilir DC dış filtre · 1500 L/saat azami debi",ratedFlowLph:1500,adjustableFlow:true,sourceUrl:"https://topickaquarium.com/collections/filterations/products/netlea-external-canister-filter-dc-pump",verifiedAt:"2026-08-25"},
  {id:"netlea-no2v-dc-canister",category:"filter",brand:"Netlea",model:"No.2V DC Canister Filter",specifications:"10 kademeli ayarlanabilir DC dış filtre · 500–1500 L/saat · 3,5–28 W · 9 L filtre malzemesi · 60–300 L",ratedFlowLph:1500,powerW:28,recommendedMinL:60,recommendedMaxL:300,recommendedTankLengthCm:[60,120],adjustableFlow:true,sourceUrl:"https://www.aquazones.in/netlea-external-filter-no-2v/",verifiedAt:"2026-08-25"},
  {id:"netlea-aquatic-time-no1-canister",category:"filter",brand:"Netlea",model:"Aquatic Time No.1 Variable Canister Filter",specifications:"Ayarlanabilir dış filtre · 400–960 L/saat · 14 W · 4 L filtre malzemesi hacmi",ratedFlowLph:960,powerW:14,adjustableFlow:true,sourceUrl:"https://www.smzdm.com/p/138819390/",verifiedAt:"2026-08-25"},
  {id:"netlea-2fl-complete",category:"filter",brand:"Netlea",model:"2F-L Complete",specifications:"Dış filtre sistemi · 1100 L/saat",ratedFlowLph:1100,sourceUrl:"https://jafaraquatics.com/Product/Details/2179",verifiedAt:"2026-08-25"},
  {id:"netlea-no2s-hang-on",category:"filter",brand:"Netlea",model:"No.2S Hang-on Back Filter",specifications:"Debi ayarlı askı filtre · yüzey emici ve CO₂ girişi · 600 L/saat · 7 W · 25–60 cm akvaryum",ratedFlowLph:600,powerW:7,recommendedTankLengthCm:[25,60],adjustableFlow:true,sourceUrl:"https://www.aquazones.in/netlea-hang-on-back-no-2s/",verifiedAt:"2026-08-25"},
  {id:"netlea-g1-prefilter",category:"filter",brand:"Netlea",model:"G1 Prefilter",specifications:"Pompasız pasif ön filtre · 3,8 L hazne · 80.042 mm² filtre yüzeyi · 16 mm bağlantı",passiveComponent:true,capacityDataNote:"Pasif ön filtre kendi pompasına sahip değildir; ana filtrenin debisi ayrıca değerlendirilir ve otomatik filtrasyon hesabına tek başına katılmaz.",sourceUrl:"https://aquarockscolorado.com/products/netlea-prefilter",verifiedAt:"2026-08-25"},
  {id:"netlea-g2-prefilter",category:"filter",brand:"Netlea",model:"G2 Prefilter",specifications:"Pompasız pasif ön filtre · 6,9 L hazne · 171.449 mm² filtre yüzeyi · 22 mm bağlantı",passiveComponent:true,capacityDataNote:"Pasif ön filtre kendi pompasına sahip değildir; ana filtrenin debisi ayrıca değerlendirilir ve otomatik filtrasyon hesabına tek başına katılmaz.",sourceUrl:"https://aquarockscolorado.com/products/netlea-prefilter",verifiedAt:"2026-08-25"},
];

const netleaAirPumpSource="https://aquazonefish.vn/products/may-sui-oxy-sieu-em-cao-cap-2-voi-netlea";
const netleaAirPumpTableSource="https://shopee.co.th/Netlea-Air-Pump-NO.2B-NO.3B-NO.4B-i.826328.26858731364";
const netleaAirPumpFamilySource="https://www.sxi.com.tw/product/%E5%B0%BC%E7%89%B9%E5%88%A9Netle%E7%A9%BA%E6%B0%A3%E6%B3%B5%E6%97%97%E8%89%A6%E7%B4%9A";
const netleaCurrentEquipment:EquipmentProfile[]=[
  {id:"netlea-v1500",category:"other",brand:"Netlea",model:"V1500",specifications:"Değişken hızlı, sessiz DC su/kafa motoru · su içinde veya dışında kullanılabilir",adjustableFlow:true,sourceUrl:"https://www.sxi.com.tw/product/%E5%B0%BC%E7%89%B9%E5%88%A9Netlea%E6%B0%B4%E9%99%B8%E9%A6%AC%E9%81%94",verifiedAt:"2026-08-27"},
  {id:"netlea-v3000",category:"other",brand:"Netlea",model:"V3000",specifications:"Değişken hızlı, sessiz DC su/kafa motoru · su içinde veya dışında kullanılabilir",adjustableFlow:true,sourceUrl:"https://www.sxi.com.tw/product/%E5%B0%BC%E7%89%B9%E5%88%A9Netlea%E6%B0%B4%E9%99%B8%E9%A6%AC%E9%81%94",verifiedAt:"2026-08-27"},
  {id:"netlea-v4000",category:"other",brand:"Netlea",model:"V4000",specifications:"Değişken hızlı, sessiz DC su/kafa motoru · su içinde veya dışında kullanılabilir",adjustableFlow:true,sourceUrl:"https://www.sxi.com.tw/product/%E5%B0%BC%E7%89%B9%E5%88%A9Netlea%E6%B0%B4%E9%99%B8%E9%A6%AC%E9%81%94",verifiedAt:"2026-08-27"},
  {id:"netlea-c2500s",category:"other",brand:"Netlea",model:"C2500S",specifications:"Değişken hızlı, sessiz DC su/kafa motoru · su içinde veya dışında kullanılabilir",adjustableFlow:true,sourceUrl:"https://www.sxi.com.tw/product/%E5%B0%BC%E7%89%B9%E5%88%A9Netlea%E6%B0%B4%E9%99%B8%E9%A6%AC%E9%81%94",verifiedAt:"2026-08-27"},
  {id:"netlea-c5000s",category:"other",brand:"Netlea",model:"C5000S",specifications:"Değişken hızlı, sessiz DC su/kafa motoru · su içinde veya dışında kullanılabilir",adjustableFlow:true,sourceUrl:"https://www.sxi.com.tw/product/%E5%B0%BC%E7%89%B9%E5%88%A9Netlea%E6%B0%B4%E9%99%B8%E9%A6%AC%E9%81%94",verifiedAt:"2026-08-27"},
  {id:"netlea-c9000s",category:"other",brand:"Netlea",model:"C9000S",specifications:"Değişken hızlı, sessiz DC su/kafa motoru · su içinde veya dışında kullanılabilir",adjustableFlow:true,sourceUrl:"https://www.sxi.com.tw/product/%E5%B0%BC%E7%89%B9%E5%88%A9Netlea%E6%B0%B4%E9%99%B8%E9%A6%AC%E9%81%94",verifiedAt:"2026-08-27"},
  {id:"netlea-no2b-air-pump",category:"air_pump",brand:"Netlea",model:"No.2B Bluetooth Air Pump",specifications:"Bluetooth ve uygulama kontrollü, Type-C şarjlı hava motoru · 10 L/dakika (600 L/saat) · azami giriş 6,5 W · 2 çıkış · 0,020 MPa · 3550 mAh / 17,75 Wh batarya",ratedFlowLph:600,powerW:6.5,adjustableFlow:true,sourceUrl:netleaAirPumpSource,additionalSourceUrls:[netleaAirPumpTableSource,netleaAirPumpFamilySource],verifiedAt:"2026-08-29"},
  {id:"netlea-no3b-air-pump",category:"air_pump",brand:"Netlea",model:"No.3B Bluetooth Air Pump",specifications:"Bluetooth ve uygulama kontrollü, Type-C şarjlı hava motoru · 12 L/dakika (720 L/saat) · azami giriş 9,5 W · 2 çıkış · 0,024 MPa · 9750 mAh / 48,75 Wh batarya",ratedFlowLph:720,powerW:9.5,adjustableFlow:true,sourceUrl:netleaAirPumpSource,additionalSourceUrls:[netleaAirPumpTableSource,netleaAirPumpFamilySource],verifiedAt:"2026-08-29"},
  {id:"netlea-no4b-q2-air-pump",category:"air_pump",brand:"Netlea",model:"No.4B Q2/4 Bluetooth Air Pump",specifications:"Bluetooth ve uygulama kontrollü, Type-C şarjlı hava motoru · 16 L/dakika (960 L/saat) · azami giriş 9,5 W · 2 çıkış · 0,027 MPa · 14600 mAh / 73 Wh batarya",ratedFlowLph:960,powerW:9.5,adjustableFlow:true,sourceUrl:netleaAirPumpTableSource,additionalSourceUrls:[netleaAirPumpFamilySource],verifiedAt:"2026-08-29"},
  {id:"netlea-no4b-q9-air-pump",category:"air_pump",brand:"Netlea",model:"No.4B Q9/4 Bluetooth Air Pump",specifications:"Bluetooth ve uygulama kontrollü, Type-C şarjlı hava motoru · 14 L/dakika (840 L/saat) · azami giriş 9,5 W · 2 çıkış · 0,022 MPa · 14600 mAh / 73 Wh batarya",ratedFlowLph:840,powerW:9.5,adjustableFlow:true,sourceUrl:netleaAirPumpTableSource,additionalSourceUrls:[netleaAirPumpFamilySource],verifiedAt:"2026-08-29"},
  {id:"netlea-no1-sf",category:"filter",brand:"Netlea",model:"No.1 SF Stainless Canister Filter",specifications:"Pozitif basınçlı paslanmaz dış filtre · 5 L hazne · ayarlanabilir 105–290 US gal/saat (yaklaşık 397–1098 L/saat) · 15 W",ratedFlowLph:1098,powerW:15,adjustableFlow:true,sourceUrl:"https://www.aquaelva.com/product/netlea-stainless-steel-canister-filter/",verifiedAt:"2026-08-27"},
  {id:"netlea-no2-sf",category:"filter",brand:"Netlea",model:"No.2 SF Stainless Canister Filter",specifications:"Pozitif basınçlı paslanmaz dış filtre · 5 L hazne · ayarlanabilir 145–396 US gal/saat (yaklaşık 549–1499 L/saat) · 28 W",ratedFlowLph:1499,powerW:28,adjustableFlow:true,sourceUrl:"https://www.aquaelva.com/product/netlea-stainless-steel-canister-filter/",verifiedAt:"2026-08-27"},
  {id:"netlea-no3-sf",category:"filter",brand:"Netlea",model:"No.3 SF Stainless Canister Filter",specifications:"Pozitif basınçlı paslanmaz dış filtre · ayarlanabilir 211–713 US gal/saat (yaklaşık 799–2699 L/saat) · 35 W",ratedFlowLph:2699,powerW:35,adjustableFlow:true,sourceUrl:"https://www.aquaelva.com/product/netlea-stainless-steel-canister-filter/",verifiedAt:"2026-08-27"},
  {id:"netlea-no4-sf",category:"filter",brand:"Netlea",model:"No.4 SF Stainless Canister Filter",specifications:"Pozitif basınçlı paslanmaz dış filtre · ayarlanabilir 211–834 US gal/saat (yaklaşık 799–3157 L/saat) · 40 W",ratedFlowLph:3157,powerW:40,adjustableFlow:true,sourceUrl:"https://www.aquaelva.com/product/netlea-stainless-steel-canister-filter/",verifiedAt:"2026-08-27"},
  {id:"netlea-flower-prefilter",category:"filter",brand:"Netlea",model:"Flower Cartridge Prefilter 16/22",specifications:"Şeffaf gövdeli, 16/22 mm bağlantılı, değiştirilebilir filtre pamuklu pasif ön filtre",passiveComponent:true,capacityDataNote:"Pasif ön filtre kendi pompasına sahip değildir; ana filtrenin debisi ayrıca değerlendirilir ve otomatik filtrasyon hesabına tek başına katılmaz.",sourceUrl:"https://www.sxi.com.tw/product/%E5%B0%BC%E7%89%B9%E5%88%A9Netlea%E5%89%8D%E7%BD%AE%E8%8F%8A%E8%8A%B1%E6%A1%B6",verifiedAt:"2026-08-27"},
  {id:"netlea-l-single-arm-stand",category:"other",brand:"Netlea",model:"L-Type Single-Arm Light Stand",specifications:"Netlea aydınlatmaları için L tipi tek kollu montaj ayağı",sourceUrl:"https://www.netlea.com/cpzx-szyp.html",verifiedAt:"2026-08-27"},
  {id:"netlea-light-panel-connector",category:"other",brand:"Netlea",model:"Light Panel Connector",specifications:"Uyumlu Netlea aydınlatma panellerini birleştirme aksesuarı",sourceUrl:"https://www.netlea.com/cpzx-szyp.html",verifiedAt:"2026-08-27"},
  {id:"netlea-light-panel-stand",category:"other",brand:"Netlea",model:"Dedicated Light Panel Stand",specifications:"Netlea ışık panelleri için özel montaj standı",sourceUrl:"https://www.netlea.com/cpzx-szyp.html",verifiedAt:"2026-08-27"},
];

const soboSource="https://atakanpetshop.com/sobo";
const soboExpressSource="https://www.akvaryumexpress.com/sobo/sayfa/3?sort=isimaz";
const soboExpressFilterSource="https://www.akvaryumexpress.com/akvaryum-filtreleri/sayfa/10";
const soboExpressHangOnSource="https://www.akvaryumexpress.com/askili-selale-filtre";
const soboExpandedEquipment:EquipmentProfile[]=[
  {id:"sobo-wp-190f-uv",category:"filter",brand:"Sobo",model:"WP-190F UV",specifications:"UV lambalı iç filtre · 500 L/saat · 12 W",ratedFlowLph:500,powerW:12,sourceUrl:soboSource,verifiedAt},
  {id:"sobo-909f-uv",category:"filter",brand:"Sobo",model:"909F UV",specifications:"UV lambalı dış filtre · 1800 L/saat · 9 W UV",ratedFlowLph:1800,integratedUvcW:9,sourceUrl:soboSource,verifiedAt},
  {id:"sobo-wp-1300f",category:"filter",brand:"Sobo",model:"WP-1300F",specifications:"İç filtre · 600 L/saat · 10 W",ratedFlowLph:600,powerW:10,sourceUrl:soboSource,verifiedAt},
  {id:"sobo-wp-1301f",category:"filter",brand:"Sobo",model:"WP-1301F",specifications:"İç filtre · 600 L/saat · 10 W",ratedFlowLph:600,powerW:10,sourceUrl:soboSource,verifiedAt},
  {id:"sobo-wp-310f",category:"filter",brand:"Sobo",model:"WP-310F",specifications:"İç filtre · 300 L/saat · 3 W",ratedFlowLph:300,powerW:3,sourceUrl:soboSource,verifiedAt},
  {id:"sobo-aq-500f",category:"filter",brand:"Sobo",model:"AQ-500F",specifications:"Kompakt iç filtre · 500 L/saat · 6 W · 60 cm ve altı akvaryumlar",ratedFlowLph:500,powerW:6,recommendedTankLengthCm:[20,60],sourceUrl:"https://www.karacaakvaryum.com/urun/sobo-aq-500f-ic-filtre/",verifiedAt:"2026-08-18"},
  {id:"sobo-wp-950f",category:"filter",brand:"Sobo",model:"WP-950F",specifications:"İç filtre · 500 L/saat · 6 W",ratedFlowLph:500,powerW:6,sourceUrl:"https://www.amigospet.com.tr/gallery/AM%C4%B0GOS%20KATALOG22.pdf",verifiedAt:"2026-08-18"},
  {id:"sobo-wp-1000f",category:"filter",brand:"Sobo",model:"WP-1000F",specifications:"İç filtre · 650 L/saat · 15 W · 200 litreye kadar",ratedFlowLph:650,powerW:15,recommendedMaxL:200,sourceUrl:"https://www.sobo.com.tr/sobo-akvaryum-ic-filtre-wp-1000f",verifiedAt:"2026-08-18"},
  {id:"sobo-wp-4001",category:"filter",brand:"Sobo",model:"WP-4001",specifications:"İç filtre · 2000 L/saat · 30 W",ratedFlowLph:2000,powerW:30,sourceUrl:"https://www.amigospet.com.tr/gallery/AM%C4%B0GOS%20KATALOG22.pdf",verifiedAt:"2026-08-18"},
  {id:"sobo-wp-6001",category:"filter",brand:"Sobo",model:"WP-6001",specifications:"Sessiz iç filtre · 2800 L/saat · 40 W · 380 litreye kadar",ratedFlowLph:2800,powerW:40,recommendedMaxL:380,sourceUrl:"https://www.sobo.com.tr/sobo-akvaryum-ic-filtre-wp-6001",verifiedAt:"2026-08-18"},
  {id:"sobo-wp-280f",category:"filter",brand:"Sobo",model:"WP-280F",specifications:"Şelale aparatlı kompakt iç filtre · 500 L/saat · 5 W",ratedFlowLph:500,powerW:5,sourceUrl:"https://www.sobo.com.tr/sobo-akvaryum-selale-aparatli-ic-filtre-wp-280f",verifiedAt:"2026-08-18"},
  {id:"sobo-aq-16h",category:"filter",brand:"Sobo",model:"AQ-16H",specifications:"Biyolojik medya hazneli askı şelale filtre · 400 L/saat · 4 W",ratedFlowLph:400,powerW:4,sourceUrl:"https://www.sobo.com.tr/selale-filtreler",verifiedAt:"2026-08-18"},
  {id:"sobo-aq-17h",category:"filter",brand:"Sobo",model:"AQ-17H",specifications:"Biyolojik medya hazneli askı şelale filtre · 500 L/saat · 6 W",ratedFlowLph:500,powerW:6,sourceUrl:"https://www.sobo.com.tr/selale-filtreler",verifiedAt:"2026-08-18"},
  {id:"sobo-aq-18h",category:"filter",brand:"Sobo",model:"AQ-18H",specifications:"Biyolojik medya hazneli askı şelale filtre · 500 L/saat · 6 W",ratedFlowLph:500,powerW:6,sourceUrl:"https://www.sobo.com.tr/selale-filtreler",verifiedAt:"2026-08-18"},
  {id:"sobo-motorized-sponge-350",category:"filter",brand:"Sobo",model:"Motorlu Pipo Filtre 350",specifications:"Motorlu biyolojik pipo filtre · 350 L/saat · 3 W · 70 litreye kadar",ratedFlowLph:350,powerW:3,recommendedMaxL:70,sourceUrl:"https://atakanpetshop.com/sobo-pompali-pipo-filtre-350lh-3w",verifiedAt},
  {id:"sobo-sf-2000",category:"other",brand:"Sobo",model:"SF-2000",specifications:"Debi kontrollü DC kafa/sump pompası · 1800 L/saat · 18 W · 3 m basma yüksekliği",ratedFlowLph:1800,powerW:18,adjustableFlow:true,sourceUrl:"https://atakanpetshop.com/sobo-debi-kontrollu-dc-pompa-18w-1800lh-3m",verifiedAt},
  {id:"sobo-wp-4000-pump",category:"other",brand:"Sobo",model:"WP-4000",specifications:"Sump motoru · 2000 L/saat · 40 W · 2 m basma yüksekliği",ratedFlowLph:2000,powerW:40,sourceUrl:soboSource,verifiedAt},
  {id:"sobo-wp-500d",category:"other",brand:"Sobo",model:"WP-500D",specifications:"Alttan emişli sump motoru · 4500 L/saat · 55 W",ratedFlowLph:4500,powerW:55,sourceUrl:soboSource,verifiedAt},
  {id:"sobo-wp-700d",category:"other",brand:"Sobo",model:"WP-700D",specifications:"Alttan emişli sump motoru · 5500 L/saat · 110 W",ratedFlowLph:5500,powerW:110,sourceUrl:soboSource,verifiedAt},
  {id:"sobo-wp-880f",category:"filter",brand:"Sobo",model:"WP-880F",specifications:"Tepe filtre · 650 L/saat · 15 W",ratedFlowLph:650,powerW:15,sourceUrl:"https://www.akvaryumexpress.com/sobo-wp-880-akvaryum-tepe-filtre-650-l-h-15-w",verifiedAt:"2026-08-25"},
  {id:"sobo-wp-505c",category:"filter",brand:"Sobo",model:"WP-505C",specifications:"Köşe iç filtre · 500 L/saat · 5 W",ratedFlowLph:500,powerW:5,sourceUrl:soboExpressSource,verifiedAt:"2026-08-25"},
  {id:"sobo-fg-1202",category:"filter",brand:"Sobo",model:"FG-1202",specifications:"İç filtre · 880 L/saat · 12 W",ratedFlowLph:880,powerW:12,sourceUrl:soboExpressSource,verifiedAt:"2026-08-25"},
  {id:"sobo-wp-909c",category:"filter",brand:"Sobo",model:"WP-909C",specifications:"Köşe iç filtre · 1600 L/saat · 28 W",ratedFlowLph:1600,powerW:28,sourceUrl:soboExpressSource,verifiedAt:"2026-08-25"},
  {id:"sobo-wp-300f",category:"filter",brand:"Sobo",model:"WP-300F",specifications:"Mini iç filtre · 2 W · 5–10 litre için · debi yayımlanmamış",powerW:2,recommendedMinL:5,recommendedMaxL:10,sourceUrl:soboExpressFilterSource,verifiedAt:"2026-08-25"},
  {id:"sobo-wp-308h",category:"filter",brand:"Sobo",model:"WP-308H",specifications:"Askı şelale filtre · 580 L/saat · 5,8 W",ratedFlowLph:580,powerW:5.8,sourceUrl:soboExpressFilterSource,verifiedAt:"2026-08-25"},
  {id:"sobo-wp-1108f",category:"filter",brand:"Sobo",model:"WP-1108F",specifications:"İç filtre · 700 L/saat · 8 W",ratedFlowLph:700,powerW:8,sourceUrl:soboExpressFilterSource,verifiedAt:"2026-08-25"},
  {id:"sobo-wp-508h",category:"filter",brand:"Sobo",model:"WP-508H",specifications:"Askı şelale filtre · 680 L/saat · 6,8 W",ratedFlowLph:680,powerW:6.8,sourceUrl:soboExpressFilterSource,verifiedAt:"2026-08-25"},
  {id:"sobo-wp-606h",category:"filter",brand:"Sobo",model:"WP-606H",specifications:"Askı şelale filtre · 500 L/saat · 10 W",ratedFlowLph:500,powerW:10,sourceUrl:soboExpressFilterSource,verifiedAt:"2026-08-25"},
  {id:"sobo-wp-628h",category:"filter",brand:"Sobo",model:"WP-628H",specifications:"Askı şelale filtre · 400 L/saat · 6 W",ratedFlowLph:400,powerW:6,sourceUrl:soboExpressFilterSource,verifiedAt:"2026-08-25"},
  {id:"sobo-wp-808c",category:"filter",brand:"Sobo",model:"WP-808C",specifications:"Köşe iç filtre · 800 L/saat · 15 W",ratedFlowLph:800,powerW:15,sourceUrl:soboExpressFilterSource,verifiedAt:"2026-08-25"},
  {id:"sobo-wp-707c",category:"filter",brand:"Sobo",model:"WP-707C",specifications:"Köşe iç filtre · 650 L/saat · 12 W",ratedFlowLph:650,powerW:12,sourceUrl:soboExpressFilterSource,verifiedAt:"2026-08-25"},
  {id:"sobo-sf-350f",category:"filter",brand:"Sobo",model:"SF-350F",specifications:"Askı şelale filtre · 300 L/saat · 5 W",ratedFlowLph:300,powerW:5,sourceUrl:soboExpressHangOnSource,verifiedAt:"2026-08-25"},
  {id:"sobo-sf-150f",category:"filter",brand:"Sobo",model:"SF-150F",specifications:"Askı şelale filtre · 260 L/saat · güç bilgisi satıcı sayfasında 4 W / 7,4 W olarak çelişkili yayımlanmış",ratedFlowLph:260,sourceUrl:"https://www.akvaryumexpress.com/sf-150f-sobo-aski-dis-filtre-74w-260l-h",verifiedAt:"2026-08-25"},
  {id:"sobo-wp-618h",category:"filter",brand:"Sobo",model:"WP-618H",specifications:"Askı şelale filtre · 280 L/saat · 5 W",ratedFlowLph:280,powerW:5,sourceUrl:soboExpressHangOnSource,verifiedAt:"2026-08-25"},
  {id:"sobo-wp-206h",category:"filter",brand:"Sobo",model:"WP-206H",specifications:"Askı şelale filtre · 250 L/saat · 3 W",ratedFlowLph:250,powerW:3,sourceUrl:"https://www.akvaryumexpress.com/sobo-wp-206h-mini-aski-filitre-250lt-h-3w",verifiedAt:"2026-08-25"},
  {id:"sobo-wp-638h",category:"filter",brand:"Sobo",model:"WP-638H",specifications:"Askı şelale filtre · 500 L/saat · 6,8 W",ratedFlowLph:500,powerW:6.8,sourceUrl:soboExpressHangOnSource,verifiedAt:"2026-08-25"},
  {id:"sobo-wp-408h",category:"filter",brand:"Sobo",model:"WP-408H",specifications:"Askı şelale filtre · 600 L/saat · 6 W",ratedFlowLph:600,powerW:6,sourceUrl:soboExpressHangOnSource,verifiedAt:"2026-08-25"},
  {id:"sobo-wp-200d",category:"other",brand:"Sobo",model:"WP-200D",specifications:"Alttan emişli sump pompası · 1800 L/saat · 25 W",ratedFlowLph:1800,powerW:25,sourceUrl:soboExpressSource,verifiedAt:"2026-08-25"},
  {id:"sobo-wp-100d",category:"other",brand:"Sobo",model:"WP-100D",specifications:"Alttan emişli sump pompası · 560 L/saat · 7 W",ratedFlowLph:560,powerW:7,sourceUrl:soboExpressSource,verifiedAt:"2026-08-25"},
  {id:"sobo-pd-1",category:"other",brand:"Sobo",model:"PD-1",specifications:"DC kafa pompası · 200 L/saat · 1 W",ratedFlowLph:200,powerW:1,sourceUrl:soboExpressSource,verifiedAt:"2026-08-25"},
  {id:"sobo-pd-2",category:"other",brand:"Sobo",model:"PD-2",specifications:"DC kafa pompası · 200 L/saat · 1 W",ratedFlowLph:200,powerW:1,sourceUrl:soboExpressSource,verifiedAt:"2026-08-25"},
  {id:"sobo-pd-3",category:"other",brand:"Sobo",model:"PD-3",specifications:"DC kafa pompası · 200 L/saat · 1 W",ratedFlowLph:200,powerW:1,sourceUrl:soboExpressSource,verifiedAt:"2026-08-25"},
  {id:"sobo-aq-018",category:"other",brand:"Sobo",model:"AQ-018",specifications:"Kafa/sirkülasyon pompası · 600 L/saat · 8 W",ratedFlowLph:600,powerW:8,sourceUrl:soboExpressSource,verifiedAt:"2026-08-25"},
  {id:"sobo-aq-028",category:"other",brand:"Sobo",model:"AQ-028",specifications:"Kafa/sirkülasyon pompası · 800 L/saat · 10 W",ratedFlowLph:800,powerW:10,sourceUrl:soboExpressSource,verifiedAt:"2026-08-25"},
  {id:"sobo-aq-038",category:"other",brand:"Sobo",model:"AQ-038",specifications:"Kafa/sirkülasyon pompası · 1000 L/saat · 15 W",ratedFlowLph:1000,powerW:15,sourceUrl:soboExpressSource,verifiedAt:"2026-08-25"},
  {id:"sobo-wp-50m",category:"other",brand:"Sobo",model:"WP-50M",specifications:"Ayarlanabilir dalga motoru · 1000–3000 L/saat · 3 W",ratedFlowLph:3000,powerW:3,adjustableFlow:true,sourceUrl:"https://www.akvaryumexpress.com/sobo-wp-50m-dalga-motoru-3w-1000-3000-lt-h",verifiedAt:"2026-08-25"},
  {id:"sobo-wp-3880f",category:"filter",brand:"Sobo",model:"WP-3880F",specifications:"Tepe filtre · 2500 L/saat · 40 W",ratedFlowLph:2500,powerW:40,sourceUrl:"https://www.akvaryumexpress.com/akvaryum-filtreleri/sayfa/4",verifiedAt:"2026-08-25"},
  {id:"sobo-wp-1105f",category:"filter",brand:"Sobo",model:"WP-1105F",specifications:"Şelale aparatlı iç filtre · 200 L/saat · 5 W · 30–40 litre",ratedFlowLph:200,powerW:5,recommendedMinL:30,recommendedMaxL:40,sourceUrl:"https://www.akvaryumexpress.com/sobo-wp-1105f-filtre-200-lt-h-5-w",verifiedAt:"2026-08-25"},
  {id:"sobo-wp-377f",category:"filter",brand:"Sobo",model:"WP-377F",specifications:"Üç kademeli mekanik ve biyolojik iç filtre · 1500 L/saat · 20 W",ratedFlowLph:1500,powerW:20,sourceUrl:"https://www.cikletistpetshop.com/sobo-wp-377f-filtre-1500-lth-20-w-967",verifiedAt:"2026-08-25"},
  {id:"sobo-wp-3200f",category:"filter",brand:"Sobo",model:"WP-3200F",specifications:"Mekanik ve biyolojik, oksijen çıkışlı iç filtre · 1200 L/saat · 25 W",ratedFlowLph:1200,powerW:25,sourceUrl:"https://www.sobo.com.tr/sobo-akvaryum-ic-filtre-wp-3200f",verifiedAt:"2026-08-25"},
  {id:"sobo-wp-780f",category:"filter",brand:"Sobo",model:"WP-780F",specifications:"Mekanik ve biyolojik tepe filtre · 800 L/saat · 10 W",ratedFlowLph:800,powerW:10,sourceUrl:"https://www.akvaryumexpress.com/sobo-wp-780f-tepe-filtre-10w",verifiedAt:"2026-08-25"},
  {id:"sobo-wp-303h",category:"filter",brand:"Sobo",model:"WP-303H",specifications:"Ayarlanabilir, yüzey emişli askı şelale filtre · 280 L/saat · 5 W · 25–40 litre",ratedFlowLph:280,powerW:5,recommendedMinL:25,recommendedMaxL:40,adjustableFlow:true,sourceUrl:"https://manuals.plus/ae/4000786264971",verifiedAt:"2026-08-25"},
  {id:"sobo-wp-607h",category:"filter",brand:"Sobo",model:"WP-607H",specifications:"Ayarlanabilir, yüzey emişli askı şelale filtre · 600 L/saat · 12 W",ratedFlowLph:600,powerW:12,adjustableFlow:true,sourceUrl:"https://manuals.plus/ae/4000786264971",verifiedAt:"2026-08-25"},
  {id:"sobo-sf-550f",category:"filter",brand:"Sobo",model:"SF-550F",specifications:"Üç litre filtre hacimli askı dış filtre · 500 L/saat · 7 W · 40–70 cm akvaryumlar",ratedFlowLph:500,powerW:7,recommendedTankLengthCm:[40,70],sourceUrl:"https://manuals.plus/ae/1005007865831973",verifiedAt:"2026-08-25"},
  {id:"sobo-fg-1204",category:"filter",brand:"Sobo",model:"FG-1204",specifications:"Dört filtre malzemeli, Venturi çıkışlı iç filtre · 880 L/saat · 12 W",ratedFlowLph:880,powerW:12,sourceUrl:"https://aquabornworld.com/product/filtro-interno-sumergible-sobo-fg-1204-880l-h-para-acuarios/",verifiedAt:"2026-08-25"},
  {id:"sobo-wp-850f",category:"filter",brand:"Sobo",model:"WP-850F",specifications:"Kompakt iç filtre · 400 L/saat · 4 W",ratedFlowLph:400,powerW:4,sourceUrl:"https://aquarubi.com/sobo-wp-850f-ic-filtre",verifiedAt:"2026-08-25"},
  {id:"sobo-wp-330f",category:"filter",brand:"Sobo",model:"WP-330F",specifications:"Şelale aparatı ve sünger medyalı iç filtre · 600 L/saat · 12 W · 200 litreye kadar · 17 × 5 cm",ratedFlowLph:600,powerW:12,recommendedMaxL:200,sourceUrl:"https://www.sobo.com.tr/sobo-akvaryum-selale-aparatli-ic-filtre-wp-330f",verifiedAt:"2026-08-25"},
  {id:"sobo-sb-848",category:"air_pump",brand:"Sobo",model:"SB-848",specifications:"Ayarlanabilir çift çıkışlı hava motoru · 2 × 4,5 L/dakika · toplam 540 L/saat · 12 W · 20 kPa",ratedFlowLph:540,powerW:12,adjustableFlow:true,sourceUrl:"https://manuals.plus/ae/1005007988043520",verifiedAt:"2026-08-25"},
  {id:"sobo-sb-3330",category:"filter",brand:"Sobo",model:"SB-3330 Pipo Filtre",specifications:"Büyük boy biyolojik sünger/pipo filtre · hava motoruyla çalışır · 12 × 10 cm sünger · borusuz 14 cm, toplam 22 cm",requiresAirPump:true,sourceUrl:"https://www.akvaryumexpress.com/sobo-sb-3330-pipo-filtre-buyuk-boy",verifiedAt:"2026-08-25"},
  {id:"sobo-sb-8808",category:"air_pump",brand:"Sobo",model:"SB-8808",specifications:"Ayarlanabilir çift çıkışlı hava motoru · 2 × 6 L/dakika · toplam 720 L/saat · güç değeri kaynaklarda 5,8/10 W çelişkili",ratedFlowLph:720,adjustableFlow:true,sourceUrl:"https://www.sobo.com.tr/sobo-ayarlanabilir-cift-cikisli-akvaryum-sessiz-hava-motoru-sb-8808",verifiedAt:"2026-08-25"},
  {id:"sobo-aq-7500",category:"other",brand:"Sobo",model:"AQ7500",specifications:"Kafa/sump motoru · 5000 L/saat · 100 W",ratedFlowLph:5000,powerW:100,sourceUrl:"https://www.akvaryumexpress.com/yeni-urunler/sayfa",verifiedAt:"2026-08-25"},
];

const sunsunHblSource="https://www.sunsun-china.com/product/aquarium-equipment/hang-on-filter/hbl-series-hang-on-filter.html";
const sunsunHangOnFilters:EquipmentProfile[]=[
  ["HBL-301",300,2],["HBL-501",400,5],["HBL-701",600,8],["HBL-302",350,3],["HBL-303",350,3],
  ["HBL-402",300,2],["HBL-403",400,5],["HBL-502",500,4],["HBL-702",800,7],
].map(([model,ratedFlowLph,powerW])=>({id:`sunsun-${String(model).toLowerCase()}`,category:"filter",brand:"SunSun",model:String(model),specifications:`Askı şelale filtre · ${ratedFlowLph} L/saat · ${powerW} W`,ratedFlowLph:Number(ratedFlowLph),powerW:Number(powerW),sourceUrl:sunsunHblSource,verifiedAt}));

const sunsunHw700Source="https://www.sunsun-china.com/product/aquarium-equipment/out-side-filter/hw-series-out-side-filter.html";
const sunsunHw700Filters:EquipmentProfile[]=[
  ["HW-702A",1000,24,0],["HW-702B",1000,24,9],["HW-703A",1400,30,0],
  ["HW-703B",1400,30,9],["HW-704A",2000,45,0],["HW-704B",2000,45,9],
].map(([model,ratedFlowLph,powerW,uvW])=>({id:`sunsun-${String(model).toLowerCase()}`,category:"filter",brand:"SunSun",model:String(model),specifications:`${uvW?"UV'li ":""}dış filtre · ${ratedFlowLph} L/saat · ${powerW} W${uvW?` + ${uvW} W UV`:""}`,ratedFlowLph:Number(ratedFlowLph),powerW:Number(powerW),...(uvW?{integratedUvcW:Number(uvW)}:{}),sourceUrl:sunsunHw700Source,verifiedAt}));

const sunsunCompactFilters:EquipmentProfile[]=[
  {id:"sunsun-503b",category:"filter",brand:"SunSun",model:"503B",specifications:"Kompakt dış filtre · 600 L/saat · 6 W",ratedFlowLph:600,powerW:6,sourceUrl:"https://atakanpetshop.com/sunsun-503b-dis-filtre-600lh-6w",verifiedAt},
  {id:"sunsun-602b",category:"filter",brand:"SunSun",model:"602B",specifications:"Kompakt dış filtre · 400 L/saat · 6 W",ratedFlowLph:400,powerW:6,sourceUrl:"https://atakanpetshop.com/sunsun-603b-dis-filtre-400-lt-h-6w",verifiedAt},
  {id:"sunsun-603b",category:"filter",brand:"SunSun",model:"603B",specifications:"Kompakt dış filtre · 400 L/saat · 6 W · 80 litreye kadar",ratedFlowLph:400,powerW:6,recommendedMaxL:80,sourceUrl:"https://atakanpetshop.com/sunsun-603b-dis-filtre-400-lt-h-6w",verifiedAt},
];

const sunsunFiltrationPumpSource="https://www.sunsun-china.com/product/aquarium-equipment/multi-function-submersible-filtration-pump/hj-series-multi-function-submersible-filtration-pump-2.html";
const sunsunInternalFilters:EquipmentProfile[]=[
  ["HJ-111B",200,2],["HJ-311B",300,2],["HJ-411B",300,2],["HJ-611B",450,6],["HJ-532",350,5],
  ["HJ-732",550,8],["HJ-752",600,10],["HJ-952",800,16],["HJ-1152",1200,22],
].map(([model,ratedFlowLph,powerW])=>({id:`sunsun-${String(model).toLowerCase()}`,category:"filter",brand:"SunSun",model:String(model),specifications:`Çok işlevli iç filtre · ${ratedFlowLph} L/saat · ${powerW} W`,ratedFlowLph:Number(ratedFlowLph),powerW:Number(powerW),sourceUrl:sunsunFiltrationPumpSource,verifiedAt}));

const sunsunPumpSource="https://www.sunsun-china.com/product/aquarium-equipment/multi-function-submersible-pump/hj-series-multi-function-submersible-pump-2.html";
const sunsunWaterPumps:EquipmentProfile[]=[
  ["HJ-500",500,7],["HJ-600",600,8],["HJ-1100",900,20],["HJ-1500",1500,25],["HJ-2200",2000,35],
  ["HJ-2500",2500,45],["HJ-3000",3000,55],["HJ-4500",5000,80],["HJ-5500",6000,100],["HJ-6000",6800,150],
].map(([model,ratedFlowLph,powerW])=>({id:`sunsun-${String(model).toLowerCase()}`,category:"other",brand:"SunSun",model:String(model),specifications:`Çok işlevli dalgıç pompa · ${ratedFlowLph} L/saat · ${powerW} W`,ratedFlowLph:Number(ratedFlowLph),powerW:Number(powerW),sourceUrl:sunsunPumpSource,verifiedAt}));

const sunsunUvSource="https://www.sunsun-china.com/product/aquarium-equipment/uv-filtration-pump/jup-series-uv-filtration-pump.html";
const sunsunUvFilters:EquipmentProfile[]=[
  ["JUP-01",800,8,9],["JUP-02",500,5,5],["JUP-21",800,8,7],["JUP-22",800,8,9],["JUP-23",800,8,13],
].map(([model,ratedFlowLph,powerW,integratedUvcW])=>({id:`sunsun-${String(model).toLowerCase()}`,category:"filter",brand:"SunSun",model:String(model),specifications:`UV sterilizasyonlu iç filtre · ${ratedFlowLph} L/saat · ${powerW} W pompa + ${integratedUvcW} W UV`,ratedFlowLph:Number(ratedFlowLph),powerW:Number(powerW),integratedUvcW:Number(integratedUvcW),sourceUrl:sunsunUvSource,verifiedAt}));

const sunsunTurkeyVerifiedAt="2026-08-27";
const sunsunTurkeyCurrentExtras:EquipmentProfile[]=[
  {id:"sunsun-16-22-outlet-set",category:"other",brand:"SunSun",model:"16/22 mm Dış Filtre Basış Seti",specifications:"16/22 mm dış filtre basış borusu seti",sourceUrl:"https://malawiizmir.com/sunsun-16-22mm-dis-filtre-basis-seti",verifiedAt:sunsunTurkeyVerifiedAt},
  {id:"sunsun-16-22-inlet-set",category:"other",brand:"SunSun",model:"16/22 mm Dış Filtre Emiş Seti",specifications:"16/22 mm dış filtre emiş borusu seti",sourceUrl:"https://malawiizmir.com/sunsun-16-22mm-dis-filtre-emis-seti",verifiedAt:sunsunTurkeyVerifiedAt},
  {id:"sunsun-502",category:"filter",brand:"SunSun",model:"502",specifications:"Kompakt dış filtre · 320 L/saat · 60 litreye kadar · kaynaklar güç değerini 5 W ve 6 W olarak farklı yayımladığı için güç belirtilmedi",ratedFlowLph:320,recommendedMaxL:60,sourceUrl:"https://e-catalog.com/SUNSUN-HW-502.htm",additionalSourceUrls:["https://manuals.plus/ae/1005007451551630","https://malawiizmir.com/sunsun-502-dis-filtre"],verifiedAt:"2026-08-29"},
  {id:"sunsun-503",category:"filter",brand:"SunSun",model:"503",specifications:"Kompakt dış filtre · 600 L/saat · 6 W",ratedFlowLph:600,powerW:6,sourceUrl:"https://www.aquashop.com.tr/urunler/sunsun-dis-filtre-600-lt-h-6w",additionalSourceUrls:["https://www.trendyol.com/sunsun/503-dis-filtre-600l-h-6w-p-1144414509","https://malawiizmir.com/sunsun-503-dis-filtre"],verifiedAt:"2026-08-29"},
  {id:"sunsun-604b",category:"filter",brand:"SunSun",model:"604B",specifications:"Kompakt dış filtre · 800 L/saat · 14 W",ratedFlowLph:800,powerW:14,sourceUrl:"https://cdn.malawiizmir.com/pdf/sunsun_602-603-604_tr.pdf",verifiedAt:sunsunTurkeyVerifiedAt},
  {id:"sunsun-ad260",category:"lighting",brand:"SunSun",model:"AD260",specifications:"Dokunmatik kontrollü LED akvaryum aydınlatması · 8,5 W",powerW:8.5,sourceUrl:"https://malawiizmir.com/sunsun-8-5w-led-aydinlatma-ad260-dokunmatik-panel",verifiedAt:sunsunTurkeyVerifiedAt},
  {id:"sunsun-aco006",category:"air_pump",brand:"SunSun",model:"ACO-006",specifications:"Yüksek basınçlı hava motoru · 85 L/dakika (5100 L/saat) · 105 W",ratedFlowLph:5100,powerW:105,sourceUrl:"https://malawiizmir.com/sunsun-aco-006-yuksek-basincli-hava-motoru-105w-85-l-dk",verifiedAt:sunsunTurkeyVerifiedAt},
  {id:"sunsun-ad200",category:"lighting",brand:"SunSun",model:"AD200",specifications:"Dokunmatik kontrollü LED akvaryum armatürü · 12 W",powerW:12,sourceUrl:"https://malawiizmir.com/sunsun-ad200-12w-dokunmatik-led-armatur",verifiedAt:sunsunTurkeyVerifiedAt},
  {id:"sunsun-ya-4l-white",category:"other",brand:"SunSun",model:"4 L Beyaz Akvaryum",specifications:"Dört litrelik beyaz nano akvaryum · 29 × 15 × 26,5 cm",sourceUrl:"https://malawiizmir.com/sunsun-akvaryum-4-l-beyaz-29-cm-x-15-cm-x-26-5-cm",verifiedAt:sunsunTurkeyVerifiedAt},
  {id:"sunsun-ya-4l-pink",category:"other",brand:"SunSun",model:"4 L Pembe Akvaryum",specifications:"Dört litrelik pembe nano akvaryum · 29 × 15 × 26,5 cm",sourceUrl:"https://malawiizmir.com/sunsun-akvaryum-4-l-pembe-29-cm-x-15-cm-x-26-5-cm",verifiedAt:sunsunTurkeyVerifiedAt},
  {id:"sunsun-ya-6l-white",category:"other",brand:"SunSun",model:"6 L Beyaz Akvaryum",specifications:"Altı litrelik beyaz nano akvaryum · 34,5 × 31,6 × 16,5 cm",sourceUrl:"https://malawiizmir.com/sunsun-akvaryum-6-l-beyaz-34-5x31-6x16-5-cm",verifiedAt:sunsunTurkeyVerifiedAt},
  {id:"sunsun-ya-6l-pink",category:"other",brand:"SunSun",model:"6 L Pembe Akvaryum",specifications:"Altı litrelik pembe nano akvaryum · 34,5 × 31,6 × 16,5 cm",sourceUrl:"https://malawiizmir.com/sunsun-akvaryum-6-l-pembe-34-5x31-6x16-5-cm",verifiedAt:sunsunTurkeyVerifiedAt},
  {id:"sunsun-ad120",category:"lighting",brand:"SunSun",model:"AD120",specifications:"Dokunmatik kontrollü LED akvaryum aydınlatması · 3 W",powerW:3,sourceUrl:"https://malawiizmir.com/sunsun-dokunmatik-led-lamba-3w-ad120",verifiedAt:sunsunTurkeyVerifiedAt},
  {id:"sunsun-hjs312",category:"other",brand:"SunSun",model:"HJS-312",specifications:"Jiletli akvaryum cam temizleyicisi · 52 cm",sourceUrl:"https://malawiizmir.com/sunsun-hjs-312-jiletli-akvaryum-cam-temizleyicisi-52-cm",verifiedAt:sunsunTurkeyVerifiedAt},
  {id:"sunsun-hkl250",category:"other",brand:"SunSun",model:"HKL-250",specifications:"15 litrelik kompakt akvaryum",sourceUrl:"https://malawiizmir.com/sunsun-hkl-250-akvaryum-15-lt",verifiedAt:sunsunTurkeyVerifiedAt},
  {id:"sunsun-hw602-603-outlet-set",category:"other",brand:"SunSun",model:"HW 602/603 B Basış Seti",specifications:"HW-602B ve HW-603B dış filtreler için basış borusu seti",sourceUrl:"https://malawiizmir.com/sunsun-hw-602-603-b-basis-seti",verifiedAt:sunsunTurkeyVerifiedAt},
  {id:"sunsun-hw602-603-inlet-set",category:"other",brand:"SunSun",model:"HW 602/603 B Emiş Seti",specifications:"HW-602B ve HW-603B dış filtreler için emiş borusu seti",sourceUrl:"https://malawiizmir.com/sunsun-hw-602-603-b-emis-seti",verifiedAt:sunsunTurkeyVerifiedAt},
  {id:"sunsun-jf002",category:"other",brand:"SunSun",model:"JF-002",specifications:"Akvaryum yüzeyini soğutmak için tekli fan",sourceUrl:"https://malawiizmir.com/sunsun-jf---002-tekli-fan",verifiedAt:sunsunTurkeyVerifiedAt},
  {id:"sunsun-jp022f",category:"filter",brand:"SunSun",model:"JP-022F",specifications:"İç filtre · 600 L/saat · 8 W",ratedFlowLph:600,powerW:8,sourceUrl:"https://malawiizmir.com/sunsun-jp-022f-ic-filtre-600-l-h-8w",verifiedAt:sunsunTurkeyVerifiedAt},
  {id:"sunsun-jp025f",category:"filter",brand:"SunSun",model:"JP-025F",specifications:"İç filtre · 1600 L/saat · 35 W · 120–600 litre · 2,5 m azami basma yüksekliği",ratedFlowLph:1600,powerW:35,recommendedMinL:120,recommendedMaxL:600,sourceUrl:"https://malawiizmir.com/sunsun-jp-025f-ic-filtre-1600-l-h-35w",verifiedAt:sunsunTurkeyVerifiedAt},
  {id:"sunsun-jp094",category:"filter",brand:"SunSun",model:"JP-094",specifications:"İç filtre · 650 L/saat · güç ve önerilen hacim yayımlanmamış",ratedFlowLph:650,sourceUrl:"https://malawiizmir.com/sunsun-jp-094-ic-filtre-650-l-h",verifiedAt:sunsunTurkeyVerifiedAt},
  {id:"sunsun-jvp102b",category:"other",brand:"SunSun",model:"JVP-102B",specifications:"Mıknatıslı dalga motoru · debi ve güç satıcı sayfasında yayımlanmamış",sourceUrl:"https://malawiizmir.com/sunsun-jvp-102-b-wave-maker-miknatisli",verifiedAt:sunsunTurkeyVerifiedAt},
  {id:"sunsun-jvp102a",category:"other",brand:"SunSun",model:"JVP-102A",specifications:"Sirkülasyon ve dalga motoru · 5000 L/saat · 12 W · tatlı suda 100–300 litre, deniz akvaryumunda 150–350 litre",ratedFlowLph:5000,powerW:12,sourceUrl:"https://malawiizmir.com/sunsun-jvp-102a-dalga-motoru-5000lt-h",verifiedAt:sunsunTurkeyVerifiedAt},
  {id:"sunsun-jvp201",category:"other",brand:"SunSun",model:"JVP-201",specifications:"Çift kafalı dalga motoru · 6000 L/saat · 12 W · 158 × 80 × 100 mm",ratedFlowLph:6000,powerW:12,sourceUrl:"https://malawiizmir.com/sunsun-jvp-201-dalga-motoru-6000lt-saat",verifiedAt:sunsunTurkeyVerifiedAt},
  {id:"sunsun-jvp202a",category:"other",brand:"SunSun",model:"JVP-202A",specifications:"Çift kafalı dalga motoru · satıcı sayfasında debi ve güç yayımlanmamış",sourceUrl:"https://malawiizmir.com/sunsun-jvp-202-a-wave-maker",verifiedAt:sunsunTurkeyVerifiedAt},
  {id:"sunsun-jvp402",category:"other",brand:"SunSun",model:"JVP-402",specifications:"Dalga motoru · satıcı sayfasında debi ve güç yayımlanmamış",sourceUrl:"https://malawiizmir.com/sunsun-jvp-402-wave-maker",verifiedAt:sunsunTurkeyVerifiedAt},
  {id:"sunsun-pg180",category:"air_pump",brand:"SunSun",model:"PG-180",specifications:"Blower hava motoru · 26 m³/saat (26.000 L/saat)",ratedFlowLph:26000,sourceUrl:"https://malawiizmir.com/sunsun-pg-180-blower-26-m3-h",verifiedAt:sunsunTurkeyVerifiedAt},
  {id:"sunsun-pg250",category:"air_pump",brand:"SunSun",model:"PG-250",specifications:"Blower hava motoru · 35 m³/saat (35.000 L/saat)",ratedFlowLph:35000,sourceUrl:"https://malawiizmir.com/sunsun-pg-250-blower-35-m3-h",verifiedAt:sunsunTurkeyVerifiedAt},
];

const resunKingSource="https://okosgazdi.hu/index.php/resun-king-fejszettes-vizpumpa-sorozat";
const resunWaterPumps:EquipmentProfile[]=[
  ["KING-1",380,5],["KING-1A",700,10],["KING-2",1000,20],["KING-3",2300,40],
  ["KING-5",6200,100],["KING-6",8200,150],
].map(([model,ratedFlowLph,powerW])=>({
  id:`resun-${String(model).toLowerCase()}`,category:"other",brand:"Resun",model:String(model),
  specifications:`Dalgıç kafa/devirdaim pompası · ${ratedFlowLph} L/saat · ${powerW} W`,
  ratedFlowLph:Number(ratedFlowLph),powerW:Number(powerW),sourceUrl:resunKingSource,verifiedAt:"2026-08-18",
}));
resunWaterPumps.push(
  {id:"resun-sp-5000",category:"other",brand:"Resun",model:"SP-5000",specifications:"Tatlı ve tuzlu su için seramik milli dalgıç devirdaim pompası · 2500 L/saat · 35 W · 2,2 m azami basma yüksekliği",ratedFlowLph:2500,powerW:35,sourceUrl:"https://www.smilepetshop.com/product/366/resun-sp-5000%E0%B8%9B%E0%B8%B1%E0%B9%8A%E0%B8%A1%E0%B8%99%E0%B9%89%E0%B8%B3%E0%B8%AA%E0%B8%B3%E0%B8%AB%E0%B8%A3%E0%B8%B1%E0%B8%9A%E0%B8%97%E0%B8%B3%E0%B8%A3%E0%B8%B0%E0%B8%9A%E0%B8%9A%E0%B8%81%E0%B8%A3%E0%B8%AD%E0%B8%87-%E0%B8%99%E0%B9%89%E0%B8%B3%E0%B8%9E%E0%B8%B8-%E0%B8%99%E0%B9%89%E0%B8%B3%E0%B8%95%E0%B8%81-%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%81%E0%B8%B1%E0%B8%99%E0%B8%A8%E0%B8%B9%E0%B8%99%E0%B8%A2%E0%B9%8C-resun-%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B9%80%E0%B8%97%E0%B8%A8%E0%B9%84%E0%B8%97%E0%B8%A2-%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1%E0%B9%81%E0%B8%A3%E0%B8%87-2500-l-hr",verifiedAt:"2026-08-25"},
  {id:"resun-sp-6000",category:"other",brand:"Resun",model:"SP-6000",specifications:"Tatlı ve tuzlu su için seramik milli dalgıç devirdaim pompası · 2800 L/saat · 40 W · 2,5 m azami basma yüksekliği",ratedFlowLph:2800,powerW:40,sourceUrl:"https://www.akouashop.com/pompes-d-aquarium/pompes-universelles-aquarium/resun-sp-6000-pompe-d-aquarium-universelle-avec-debit-fixe-de-2800-l-h.html",verifiedAt:"2026-08-25"},
  {id:"resun-sp-7800s",category:"other",brand:"Resun",model:"SP-7800S",specifications:"Dalgıç devirdaim pompası · 3000 L/saat · 75 W · 3,5 m azami basma yüksekliği",ratedFlowLph:3000,powerW:75,sourceUrl:"https://www.ecer.com/corp/uuu67nz-xc1989/gu1d5b0-plastic-velocity-water-pump.html",verifiedAt:"2026-08-25"},
  {id:"resun-sp-9000as",category:"other",brand:"Resun",model:"SP-9000AS",specifications:"Dalgıç devirdaim pompası · 3800 L/saat · 120 W · 4,5 m azami basma yüksekliği",ratedFlowLph:3800,powerW:120,sourceUrl:"https://okmarts.com/resun-water-pump-sp-9000as.html",verifiedAt:"2026-08-25"},
  {id:"resun-sp-9000s",category:"other",brand:"Resun",model:"SP-9000S",specifications:"Dalgıç devirdaim pompası · 4500 L/saat · 130 W · 4,5 m azami basma yüksekliği",ratedFlowLph:4500,powerW:130,sourceUrl:"https://okmarts.com/resun-water-pump-sp-9000s.html",verifiedAt:"2026-08-25"},
  {id:"resun-sp-10000s",category:"other",brand:"Resun",model:"SP-10000S",specifications:"Dalgıç devirdaim pompası · 5500 L/saat · 160 W · 5,5 m azami basma yüksekliği",ratedFlowLph:5500,powerW:160,sourceUrl:"https://www.ecer.com/corp/details-uuu67nz-puhmzrh-resun-sp-10000s-160w-high-lift-and-large-outlet-submersible-pump-silent-flow-circulation-pump-for-fish-pond.html",verifiedAt:"2026-08-25"},
);

const resunFilters:EquipmentProfile[]=[
  {id:"resun-mini",category:"filter",brand:"Resun",model:"Mini Filter",specifications:"Kompakt iç filtre · 400 L/saat · 5 W",ratedFlowLph:400,powerW:5,sourceUrl:"https://atakanpetshop.com/resun",verifiedAt:"2026-08-18"},
  {id:"resun-sf-400",category:"filter",brand:"Resun",model:"SF-400",specifications:"Askı filtre · 400 L/saat · 5 W · 60 litreye kadar",ratedFlowLph:400,powerW:5,recommendedMaxL:60,sourceUrl:"https://produto.mercadolivre.com.br/MLB-2901672634-filtro-resun-hang-on-sf-400-360h-5w-para-aquarios-ate-60lt-_JM",verifiedAt:"2026-08-18"},
  {id:"resun-cx-400",category:"filter",brand:"Resun",model:"CX-400 ClearMax",specifications:"Alçak su seviyesine uygun biyolojik ve mekanik iç filtre · 340 L/saat · 5,5 W · 38–57 litre",ratedFlowLph:340,powerW:5.5,recommendedMinL:38,recommendedMaxL:57,sourceUrl:"https://www.resun-china.com/h-pd-131.html",additionalSourceUrls:["https://malawiizmir.com/resun-cx---400-clear-max-biyolojik-ic-filtre-340-litre-saat"],verifiedAt:"2026-08-29"},
  {id:"resun-uv07-11w",category:"uv",brand:"Resun",model:"UV-07 11 W",specifications:"Hat üstü UV-C sterilizatör · 11 W",powerW:11,integratedUvcW:11,sourceUrl:"https://www.cikletistpetshop.com/resun-uv-filtre-11-wt-100-uv07-11w-566",verifiedAt:"2026-08-18"},
  {id:"resun-uv07-24w",category:"uv",brand:"Resun",model:"UV-07 24 W",specifications:"Hat üstü UV-C sterilizatör · 24 W",powerW:24,integratedUvcW:24,sourceUrl:"https://www.cikletistpetshop.com/uv-filtreler-140",verifiedAt:"2026-08-18"},
];

const resunOfficialFilterSpecs:Record<string,{ratedFlowLph:number;powerW:number;recommendedMinL?:number;recommendedMaxL?:number;integratedUvcW?:number}>={
  BC300:{ratedFlowLph:300,powerW:4.5,recommendedMinL:20,recommendedMaxL:40},
  BC450:{ratedFlowLph:450,powerW:5.5,recommendedMinL:40,recommendedMaxL:80},
  BC650:{ratedFlowLph:650,powerW:8.5,recommendedMinL:60,recommendedMaxL:120},
  EFC300:{ratedFlowLph:300,powerW:4},EFC550:{ratedFlowLph:550,powerW:10},
  GF400:{ratedFlowLph:360,powerW:4},GF800:{ratedFlowLph:820,powerW:7},
  "CX-200 ClearMax":{ratedFlowLph:180,powerW:3,recommendedMinL:8,recommendedMaxL:30},
  CS400:{ratedFlowLph:400,powerW:6,recommendedMinL:40,recommendedMaxL:80},
  CS700:{ratedFlowLph:700,powerW:10,recommendedMinL:70,recommendedMaxL:140},
  CS1000:{ratedFlowLph:1000,powerW:15,recommendedMinL:100,recommendedMaxL:200},
  CS1500:{ratedFlowLph:1500,powerW:25,recommendedMinL:150,recommendedMaxL:300},
  CS2000:{ratedFlowLph:2000,powerW:30,recommendedMinL:200,recommendedMaxL:400},
  MAGI200:{ratedFlowLph:208,powerW:5,recommendedMinL:20,recommendedMaxL:40},
  MAGI380:{ratedFlowLph:380,powerW:7,recommendedMinL:40,recommendedMaxL:80},
  MAGI700:{ratedFlowLph:606,powerW:10,recommendedMinL:60,recommendedMaxL:120},
  MAGI1000:{ratedFlowLph:852,powerW:20,recommendedMinL:80,recommendedMaxL:200},
  HS300:{ratedFlowLph:300,powerW:4,recommendedMinL:40,recommendedMaxL:120},
  CY20:{ratedFlowLph:200,powerW:3,recommendedMaxL:60},
  BF80:{ratedFlowLph:260,powerW:5.5,recommendedMaxL:80},
  BF100:{ratedFlowLph:300,powerW:5.8,recommendedMaxL:100},
  BF200:{ratedFlowLph:550,powerW:10,recommendedMaxL:200},
  EVF600:{ratedFlowLph:600,powerW:6.5},EVF900:{ratedFlowLph:900,powerW:10},EVF1200:{ratedFlowLph:1200,powerW:17.5},
  EF1600:{ratedFlowLph:1600,powerW:35},EF1600U:{ratedFlowLph:1600,powerW:35,integratedUvcW:11},
  EF2800:{ratedFlowLph:2800,powerW:60},EF2800U:{ratedFlowLph:2800,powerW:60,integratedUvcW:11},
};

const resunOfficialFilterSeries:EquipmentProfile[]=(
  [
    ["BC300",128,"BioClear beş aşamalı iç filtre"],["BC450",128,"BioClear beş aşamalı iç filtre"],["BC650",128,"BioClear beş aşamalı iç filtre"],
    ["EFC300",395,"Edge Flow köşe filtresi"],["EFC550",395,"Edge Flow köşe filtresi"],
    ["GF400",132,"Üç aşamalı ayarlanabilir köşe filtresi"],["GF800",132,"Üç aşamalı ayarlanabilir köşe filtresi"],
    ["CX-200 ClearMax",131,"Üç aşamalı biyolojik ve mekanik iç filtre"],
    ["CS400",133,"Cruiser iç filtre"],["CS700",133,"Cruiser iç filtre"],["CS1000",133,"Cruiser iç filtre"],["CS1500",133,"Cruiser iç filtre"],["CS2000",133,"Cruiser iç filtre"],
    ["MAGI200",135,"Karbon kutulu kimyasal ve biyolojik iç filtre"],["MAGI380",135,"Karbon kutulu kimyasal ve biyolojik iç filtre"],["MAGI700",135,"Karbon kutulu kimyasal ve biyolojik iç filtre"],["MAGI1000",135,"Karbon kutulu kimyasal ve biyolojik iç filtre"],
    ["HS300",299,"Hydro Sweep yüzey yağ tabakası filtresi"],
    ["CY20",134,"Cyclone mini dış filtre"],
    ["BF80",129,"Aqua Bio üç aşamalı iç filtre"],["BF100",129,"Aqua Bio üç aşamalı iç filtre"],["BF200",129,"Aqua Bio üç aşamalı iç filtre"],
    ["EVF600",141,"EVO dış filtre"],["EVF900",141,"EVO dış filtre"],["EVF1200",141,"EVO dış filtre"],
    ["EF1600",138,"Xtreme orta boy dış filtre"],["EF1600U",138,"UV yuvalı Xtreme orta boy dış filtre"],
    ["EF2800",140,"Xtreme büyük dış filtre"],["EF2800U",140,"UV yuvalı Xtreme büyük dış filtre"],
  ] as Array<[string,number,string]>
).map(([model,page,description])=>{
  const capacity=resunOfficialFilterSpecs[model];
  const volume=capacity.recommendedMinL&&capacity.recommendedMaxL
    ?` · ${capacity.recommendedMinL}–${capacity.recommendedMaxL} litre`
    :capacity.recommendedMaxL?` · ${capacity.recommendedMaxL} litreye kadar`:"";
  return {
    id:`resun-${model.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")}`,
    category:"filter",brand:"Resun",model,
    specifications:`${description} · ${capacity.ratedFlowLph} L/saat · ${capacity.powerW} W${capacity.integratedUvcW?` + ${capacity.integratedUvcW} W UV`:""}${volume}`,
    ...capacity,sourceUrl:`https://www.resun-china.com/h-pd-${page}.html`,verifiedAt:"2026-08-29",
  };
});

const resunOfficialUvClarifiers:EquipmentProfile[]=(
  [["U2",142],["Terminator 11",144],["Terminator 18",144],["Terminator 36",144],["Terminator 56",144]] as Array<[string,number]>
).map(([model,page])=>({
  id:`resun-${model.toLowerCase().replace(/[^a-z0-9]+/g,"-")}`,category:"uv",brand:"Resun",model,
  specifications:"Üreticinin güncel UV berraklaştırıcı serisi · güç ve akış tablosu metin olarak yayımlanmadığı için değer tahmin edilmedi",
  sourceUrl:`https://www.resun-china.com/h-pd-${page}.html`,verifiedAt:"2026-08-26",
}));

const resunOfficialCurrentWaterPumps:EquipmentProfile[]=(
  [
    ["SP500 / SP55",118,"Ayarlanabilir kompakt heykel/masaüstü pompası"],["SP600 / SP65",118,"Ayarlanabilir kompakt heykel/masaüstü pompası"],["SP650 / SP80",118,"Ayarlanabilir kompakt heykel/masaüstü pompası"],["SP980 / SP130",118,"Ayarlanabilir kompakt heykel/masaüstü pompası"],["SP800 / SP75",118,"Ayarlanabilir kompakt heykel/masaüstü pompası"],["SP880 / SP98",118,"Ayarlanabilir kompakt heykel/masaüstü pompası"],
    ["FLOW700 / KING160",126,"Küçük Flow dalgıç su pompası"],["FLOW1000 / KING290",126,"Küçük Flow dalgıç su pompası"],["FLOW1500 / KING400",126,"Küçük Flow dalgıç su pompası"],["FLOW2400 / KING590",126,"Küçük Flow dalgıç su pompası"],
    ["FLOW4000 / KING1000",125,"Büyük Flow dalgıç su pompası"],["FLOW4800 / KING1340",125,"Büyük Flow dalgıç su pompası"],["FLOW6000 / KING1630",125,"Büyük Flow dalgıç su pompası"],["FLOW8500 / KING2160",125,"Büyük Flow dalgıç su pompası"],
    ["S400",127,"Submarine küçük dalgıç su pompası"],["S700",127,"Submarine küçük dalgıç su pompası"],["S1000",127,"Submarine küçük dalgıç su pompası"],["S1500",127,"Submarine küçük dalgıç su pompası"],["S2000",127,"Submarine küçük dalgıç su pompası"],
    ["S3000",117,"Submarine büyük dalgıç su pompası"],["S4500",117,"Submarine büyük dalgıç su pompası"],["S7000",117,"Submarine büyük dalgıç su pompası"],["S10000",117,"Submarine büyük dalgıç su pompası"],
    ["BDP250",124,"10 mm su seviyesine kadar çalışan Bottom Draw pompa"],["BDP550",124,"10 mm su seviyesine kadar çalışan Bottom Draw pompa"],["BDP750",124,"10 mm su seviyesine kadar çalışan Bottom Draw pompa"],
    ["SP1100",121,"Ayarlanabilir akışlı SP power head"],["SP1200",121,"Ayarlanabilir akışlı SP power head"],["SP2500",121,"Ayarlanabilir akışlı SP power head"],["SP3800",121,"Ayarlanabilir akışlı SP power head"],
    ["PENGUIN2400",123,"Dikey düşük seviye su pompası"],["PENGUIN3200",123,"Dikey düşük seviye su pompası"],["PENGUIN4500",123,"Dikey düşük seviye su pompası"],["PENGUIN8500",123,"Dikey düşük seviye su pompası"],
    ["SP9500",120,"Dikey düşük seviye su pompası"],["SP9600",120,"Dikey düşük seviye su pompası"],["SP9500S",120,"Dikey düşük seviye su pompası"],["SP9600S",120,"Dikey düşük seviye su pompası"],
    ["HWM2000",296,"Mıknatıslı dalga motoru"],["HWM4000",296,"Mıknatıslı dalga motoru"],["HWM6000",296,"Mıknatıslı dalga motoru"],
  ] as Array<[string,number,string]>
).map(([model,page,description])=>({
  id:`resun-current-pump-${model.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")}`,
  category:"other",brand:"Resun",model,
  specifications:`${description} · üreticinin güncel seri sayfasında model doğrulandı; debi, güç ve basma yüksekliği tablosu metin olarak yayımlanmamış`,
  sourceUrl:`https://www.resun-china.com/h-pd-${page}.html`,verifiedAt:"2026-08-26",
}));

const resunOfficialAirPumpSpecs:Record<string,{ratedFlowLph:number;powerW?:number;recommendedMaxL?:number;adjustableFlow?:boolean}>={
  HCB1000:{ratedFlowLph:60,powerW:1.5},HCB4000:{ratedFlowLph:360,powerW:3.5,adjustableFlow:true},
  HCA1000:{ratedFlowLph:60,powerW:1.5},HCA2000:{ratedFlowLph:140,powerW:2.8},HCA3000:{ratedFlowLph:360,powerW:3.5},HCA4000:{ratedFlowLph:360,powerW:3.5,adjustableFlow:true},
  AP72:{ratedFlowLph:72,powerW:2},AP108:{ratedFlowLph:108,powerW:2.5},AP180:{ratedFlowLph:180,powerW:3},AP216:{ratedFlowLph:216,powerW:3},
  "HLP-4000":{ratedFlowLph:3600,powerW:28},"HLP-8000":{ratedFlowLph:7200,powerW:28},
  DC120:{ratedFlowLph:120,recommendedMaxL:80},DC160:{ratedFlowLph:160,recommendedMaxL:120},
  PLP40:{ratedFlowLph:3600,powerW:30},PLP60:{ratedFlowLph:4500,powerW:40},PLP100:{ratedFlowLph:9000,powerW:70},
  NLP20:{ratedFlowLph:1500,powerW:17},NLP40:{ratedFlowLph:3000,powerW:35},NLP60:{ratedFlowLph:4200,powerW:50},NLP100:{ratedFlowLph:8400,powerW:100},NLP200:{ratedFlowLph:14000,powerW:230},
  QSW70:{ratedFlowLph:42,powerW:1.5},QSB70:{ratedFlowLph:42,powerW:1.5},
};

const resunOfficialCurrentAirPumps:EquipmentProfile[]=(
  [
    ["HCB1000",396,"Silent Flow çift katmanlı sessiz hava motoru"],["HCB4000",396,"Ayarlanabilir Silent Flow çift çıkışlı hava motoru"],
    ["HCA1000",300,"Hush Charm çift katmanlı sessiz hava motoru"],["HCA2000",300,"Hush Charm sessiz hava motoru"],["HCA3000",300,"Çift çıkışlı Hush Charm sessiz hava motoru"],["HCA4000",300,"Ayarlanabilir Hush Charm çift çıkışlı hava motoru"],
    ["AP72",145,"Titreşim azaltıcı ayaklı hava motoru"],["AP108",145,"Titreşim azaltıcı ayaklı hava motoru"],["AP180",145,"Titreşim azaltıcı ayaklı hava motoru"],["AP216",145,"Titreşim azaltıcı ayaklı hava motoru"],
    ["HLP-4000",301,"Akü destekli AC/DC düşük sesli hava motoru"],["HLP-8000",284,"Dijital ekranlı akü destekli AC/DC hava motoru"],
    ["DC120",148,"Pilli taşınabilir hava motoru"],["DC160",148,"Pilli taşınabilir hava motoru"],
    ["PLP40",146,"PLP üretim tipi hava motoru"],["PLP60",146,"PLP üretim tipi hava motoru"],["PLP100",146,"PLP üretim tipi hava motoru"],
    ["NLP20",397,"Alüminyum gövdeli NLP havuz hava motoru"],["NLP40",397,"Alüminyum gövdeli NLP havuz hava motoru"],["NLP60",397,"Alüminyum gövdeli NLP havuz hava motoru"],["NLP100",397,"Alüminyum gövdeli NLP havuz hava motoru"],["NLP200",397,"Alüminyum gövdeli NLP havuz hava motoru"],
    ["QSW70",151,"Süper mini sessiz hava motoru"],["QSB70",151,"Süper mini sessiz hava motoru"],
  ] as Array<[string,number,string]>
).map(([model,page,description])=>{
  const capacity=resunOfficialAirPumpSpecs[model];
  return {
    id:`resun-current-air-${model.toLowerCase().replace(/[^a-z0-9]+/g,"-")}`,
    category:"air_pump",brand:"Resun",model,
    specifications:`${description} · ${capacity.ratedFlowLph} L/saat${capacity.powerW?` · ${capacity.powerW} W`:""}${capacity.recommendedMaxL?` · ${capacity.recommendedMaxL} litreye kadar`:""}`,
    ...capacity,sourceUrl:`https://www.resun-china.com/h-pd-${page}.html`,verifiedAt:"2026-08-29",
  };
});

const resunHeaterProfile=(model:string,powerW:number,page:number,description:string,recommendedMaxL?:number,recommendedMinL?:number):EquipmentProfile=>({
  id:`resun-current-heater-${model.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")}`,
  category:"heater",brand:"Resun",model,
  specifications:`${description} · ${powerW} W${recommendedMinL&&recommendedMaxL?` · ${recommendedMinL}–${recommendedMaxL} litre`:recommendedMaxL?` · ${recommendedMaxL} litreye kadar`:""}`,
  powerW,...(recommendedMinL?{recommendedMinL}:{}),...(recommendedMaxL?{recommendedMaxL}:{}),
  sourceUrl:`https://www.resun-china.com/h-pd-${page}.html`,verifiedAt:"2026-08-29",
});
const resunOfficialCurrentHeaters:EquipmentProfile[]=[
  ...([[25,20],[50,40],[75,60],[100,100],[150,160],[200,200],[250,240],[300,300]] as const).map(([power,maxL])=>resunHeaterProfile(`SUNLIKE${power}`,power,157,"Ayarlanabilir, kırılmaya dayanıklı kuvars camlı Sunlike ısıtıcı",maxL)),
  ...([[100,75],[150,110],[200,170],[300,245]] as const).map(([power,maxL])=>resunHeaterProfile(`DSH${power}`,power,283,"Kuru çalışma korumalı, dijital ekranlı akıllı kuvars ısıtıcı",maxL)),
  ...([[25,20],[50,40],[100,75],[150,110],[200,170],[300,245]] as const).map(([power,maxL])=>resunHeaterProfile(`TM${power}`,power,158,"Ayarlanabilir, kırılmaya dayanıklı kuvars camlı Thermo ısıtıcı",maxL)),
  ...([[25,20],[50,40],[75,60],[100,100],[150,160],[200,200],[250,240],[300,300]] as const).map(([power,maxL])=>resunHeaterProfile(`RH9000 ${power}W`,power,156,"Spiral elemanlı, eşit ısı dağılımlı Rising Heat ısıtıcı",maxL)),
  ...([[50,20,50],[100,50,100],[150,100,150],[200,100,200],[300,200,300]] as const).map(([power,minL,maxL])=>resunHeaterProfile(`DT${power}`,power,154,"Kuru çalışma korumalı, 25 °C ön ayarlı Delta ısıtıcı",maxL,minL)),
  resunHeaterProfile("HT10",10,153,"26 °C ön ayarlı, sert plastik korumalı mini ısıtıcı; tabloda 10 L'de kapaklı 6 °C ve 20 L'de 4 °C sıcaklık artışı",20),
  resunHeaterProfile("HT25",25,153,"26 °C ön ayarlı, sert plastik korumalı mini ısıtıcı; tabloda 20 L'de kapaklı 8 °C ve 40 L'de 5 °C sıcaklık artışı",40),
  resunHeaterProfile("MH75",7.5,155,"Tatlı ve tuzlu suya uygun kompakt MH mini ısıtıcı; tabloda 5–10 L için 6–4 °C sıcaklık artışı",10),
  resunHeaterProfile("MH150",15,155,"Tatlı ve tuzlu suya uygun kompakt MH mini ısıtıcı; tabloda 20–40 L için 4–2 °C sıcaklık artışı",40),
  resunHeaterProfile("MH250",25,155,"Tatlı ve tuzlu suya uygun kompakt MH mini ısıtıcı; tabloda 30–60 L için 5–3 °C sıcaklık artışı",60),
];

const resunOfficialCurrentLighting:EquipmentProfile[]=[
  {id:"resun-slm-series",category:"lighting",brand:"Resun",model:"SLM Super Slim LED Series",specifications:"Dokunmatik gündüz/ay ışığı modlu, uzatılabilir alüminyum gövdeli LED armatür · güç ve uzunluk seçenekleri metin olarak yayımlanmamış",sourceUrl:"https://www.resun-china.com/h-pd-94.html",verifiedAt:"2026-08-27"},
  {id:"resun-wifi-super-slim-series",category:"lighting",brand:"Resun",model:"Wi-Fi Super Slim LED Series",specifications:"Uygulama kontrollü zamanlayıcı, gün doğumu ve gün batımı simülasyonlu uzatılabilir LED armatür · güç ve uzunluk seçenekleri metin olarak yayımlanmamış",sourceUrl:"https://www.resun-china.com/h-pd-91.html",verifiedAt:"2026-08-27"},
  {id:"resun-flexible-led-bubble-wand",category:"lighting",brand:"Resun",model:"Flexible LED Bubble Wand Series",specifications:"Tatlı ve deniz akvaryumlarına uygun, bükülebilir LED'li hava perdesi · boy ve güç seçenekleri metin olarak yayımlanmamış",sourceUrl:"https://www.resun-china.com/h-pd-86.html",verifiedAt:"2026-08-27"},
  {id:"resun-ldc-01",category:"lighting",brand:"Resun",model:"LDC-01 LED Controller",specifications:"24 saat dijital saatli gün doğumu/gün batımı ve bakım hatırlatıcılı LED kontrolcüsü · DC 10–20 V · en fazla 3 A · 41 × 20 × 95 mm",sourceUrl:"https://www.resun-china.com/h-pd-87.html",verifiedAt:"2026-08-27"},
];

const resunOfficialCurrentChillers:EquipmentProfile[]=[
  {id:"resun-icecore-chiller-series",category:"other",brand:"Resun",model:"IceCore Chiller Series",specifications:"Dijital kontrollü, güç kesintisi hafızalı, titanyum ısı eşanjörlü akvaryum soğutucu serisi · model ve kapasite tablosu metin olarak yayımlanmamış",sourceUrl:"https://www.resun-china.com/h-pd-398.html",verifiedAt:"2026-08-27"},
  ...["CL200","CL280"].map((model):EquipmentProfile=>({id:`resun-${model.toLowerCase()}`,category:"other",brand:"Resun",model,specifications:"Macro dijital kontrollü, titanyum ısı eşanjörlü akvaryum soğutucusu · soğutma kapasitesi metin olarak yayımlanmamış",sourceUrl:"https://www.resun-china.com/h-pd-161.html",verifiedAt:"2026-08-27"})),
  ...["MINI200","MINI300","MINI650"].map((model):EquipmentProfile=>({id:`resun-${model.toLowerCase()}`,category:"other",brand:"Resun",model,specifications:"Mini dijital kontrollü, titanyum ısı eşanjörlü akvaryum soğutucusu · soğutma kapasitesi metin olarak yayımlanmamış",sourceUrl:"https://www.resun-china.com/h-pd-162.html",verifiedAt:"2026-08-27"})),
  {id:"resun-outdoor-chiller-series",category:"other",brand:"Resun",model:"Outdoor Chiller Series",specifications:"Kablolu uzaktan kontrollü, titanyum ısı eşanjörlü dış ortam akvaryum soğutucu serisi · model ve kapasite tablosu metin olarak yayımlanmamış",sourceUrl:"https://www.resun-china.com/h-pd-163.html",verifiedAt:"2026-08-27"},
];

const resunOfficialCurrentAccessories:EquipmentProfile[]=[
  {id:"resun-ast410",category:"other",brand:"Resun",model:"AST410 FlexClean 3-in-1",specifications:"Uzatılabilir saplı, plastik/paslanmaz/ped kaplı değiştirilebilir başlıklı akvaryum cam kazıyıcı",sourceUrl:"https://www.resun-china.com/h-pd-399.html",verifiedAt:"2026-08-27"},
  {id:"resun-mct510",category:"other",brand:"Resun",model:"MCT510",specifications:"Değiştirilebilir dört temizleme başlıklı çok amaçlı akvaryum kazıyıcı · 50,8 cm",sourceUrl:"https://www.resun-china.com/h-pd-179.html",verifiedAt:"2026-08-27"},
  {id:"resun-mct180",category:"other",brand:"Resun",model:"MCT180",specifications:"Değiştirilebilir dört temizleme başlıklı çok amaçlı akvaryum kazıyıcı · 17,8 cm",sourceUrl:"https://www.resun-china.com/h-pd-179.html",verifiedAt:"2026-08-27"},
  {id:"resun-ack12",category:"other",brand:"Resun",model:"ACK12",specifications:"Metal bıçak, köşe süngeri ve düz nano sünger içeren akvaryum temizleme seti",sourceUrl:"https://www.resun-china.com/h-pd-166.html",verifiedAt:"2026-08-27"},
  {id:"resun-ack36",category:"other",brand:"Resun",model:"ACK36",specifications:"Metal bıçak, köşe süngeri ve düz nano sünger içeren akvaryum temizleme seti",sourceUrl:"https://www.resun-china.com/h-pd-166.html",verifiedAt:"2026-08-27"},
  {id:"resun-mwc01",category:"other",brand:"Resun",model:"MWC01 Mini Water Changer",specifications:"Nano ve betta akvaryumları için ölçekli mini su değiştirici · 30 ml · Ø50 × 283 mm",sourceUrl:"https://www.resun-china.com/h-pd-164.html",verifiedAt:"2026-08-27"},
  ...["VC1","VC3","VC3B"].map((model):EquipmentProfile=>({id:`resun-${model.toLowerCase()}`,category:"other",brand:"Resun",model,specifications:"Geniş ağızlı akvaryum çakıl ve dip temizleme sifonu",sourceUrl:"https://www.resun-china.com/h-pd-182.html",verifiedAt:"2026-08-27"})),
  {id:"resun-sc150",category:"other",brand:"Resun",model:"SC150 Mini Siphon Cleaner",specifications:"Tıkanma önleyici giriş ızgaralı kompakt akvaryum sifonu",sourceUrl:"https://www.resun-china.com/h-pd-174.html",verifiedAt:"2026-08-27"},
  {id:"resun-vc5",category:"other",brand:"Resun",model:"VC5 Easy Vac",specifications:"Ayarlanabilir akışlı, geri akış önleyicili ve kova klipsli akvaryum su değiştirici",sourceUrl:"https://www.resun-china.com/h-pd-170.html",verifiedAt:"2026-08-27"},
  {id:"resun-advanced-water-changer",category:"other",brand:"Resun",model:"Advanced Water Changer Series",specifications:"Kovasız, musluk adaptörlü, el vanasıyla ayarlanabilir büyük akvaryum su değiştirici",sourceUrl:"https://www.resun-china.com/h-pd-171.html",verifiedAt:"2026-08-27"},
  {id:"resun-bd06b",category:"lighting",brand:"Resun",model:"BD06B LED Bubble Ring",specifications:"Hava motoru gerektiren, daldırılabilir sabit renkli LED hava halkası",requiresAirPump:true,sourceUrl:"https://www.resun-china.com/h-pd-176.html",verifiedAt:"2026-08-27"},
  {id:"resun-bd06c",category:"lighting",brand:"Resun",model:"BD06C LED Bubble Ring",specifications:"Hava motoru gerektiren, otomatik renk değiştiren daldırılabilir LED hava halkası",requiresAirPump:true,sourceUrl:"https://www.resun-china.com/h-pd-176.html",verifiedAt:"2026-08-27"},
  {id:"resun-as301",category:"other",brand:"Resun",model:"AS301 Air Stone",specifications:"BD06 LED hava halkasıyla ayrı kullanılabilen hava taşı",requiresAirPump:true,sourceUrl:"https://www.resun-china.com/h-pd-176.html",verifiedAt:"2026-08-27"},
  {id:"resun-swh06",category:"other",brand:"Resun",model:"SWH06 Hydrometer",specifications:"Kabarcık etkisini azaltan patentli su kanallı deniz suyu hidrometresi · 148 × 112 × 35 mm",sourceUrl:"https://www.resun-china.com/h-pd-175.html",verifiedAt:"2026-08-27"},
  {id:"resun-swh05",category:"other",brand:"Resun",model:"SWH05 Hydrometer",specifications:"0,001 özgül ağırlık hassasiyetli deniz suyu hidrometresi · 100 × 100 mm",sourceUrl:"https://www.resun-china.com/h-pd-180.html",verifiedAt:"2026-08-27"},
  {id:"resun-swh04",category:"other",brand:"Resun",model:"SWH04 Hydrometer",specifications:"0,001 özgül ağırlık hassasiyetli deniz suyu hidrometresi · 85 × 110 mm",sourceUrl:"https://www.resun-china.com/h-pd-180.html",verifiedAt:"2026-08-27"},
  {id:"resun-fmc-mini",category:"other",brand:"Resun",model:"FMC-Mini",specifications:"Yüzen neodimyum mıknatıslı cam temizleyici · 45 × 25 × 42 mm · cam/akrilik 4 mm'ye kadar",sourceUrl:"https://www.resun-china.com/h-pd-302.html",verifiedAt:"2026-08-27"},
  {id:"resun-fmc-s",category:"other",brand:"Resun",model:"FMC-S",specifications:"Yüzen neodimyum mıknatıslı cam temizleyici · 63 × 33 × 52 mm · cam 8 mm'ye kadar",sourceUrl:"https://www.resun-china.com/h-pd-302.html",verifiedAt:"2026-08-27"},
  {id:"resun-fmc-m",category:"other",brand:"Resun",model:"FMC-M",specifications:"Yüzen neodimyum mıknatıslı cam temizleyici · 100 × 38 × 58 mm · cam 10 mm'ye kadar",sourceUrl:"https://www.resun-china.com/h-pd-302.html",verifiedAt:"2026-08-27"},
  {id:"resun-magblade-series",category:"other",brand:"Resun",model:"MagBlade Floating Cleaner Series",specifications:"Yüzen, plastik kazıyıcı bıçaklı mıknatıslı akvaryum cam temizleyici serisi · model seçenekleri metin olarak yayımlanmamış",sourceUrl:"https://www.resun-china.com/h-pd-400.html",verifiedAt:"2026-08-27"},
  {id:"resun-nf09-s",category:"other",brand:"Resun",model:"NF09-S",specifications:"Cam ve akrilik için değiştirilebilir pedli mıknatıslı temizleyici · 59 × 31 mm ped · 6 mm'ye kadar",sourceUrl:"https://www.resun-china.com/h-pd-169.html",verifiedAt:"2026-08-27"},
  {id:"resun-nf09-m",category:"other",brand:"Resun",model:"NF09-M",specifications:"Cam ve akrilik için değiştirilebilir pedli mıknatıslı temizleyici · 95 × 37 mm ped · 8 mm'ye kadar",sourceUrl:"https://www.resun-china.com/h-pd-169.html",verifiedAt:"2026-08-27"},
  {id:"resun-nf09-l",category:"other",brand:"Resun",model:"NF09-L",specifications:"Cam ve akrilik için değiştirilebilir pedli mıknatıslı temizleyici · 113 × 46 mm ped · 15 mm'ye kadar",sourceUrl:"https://www.resun-china.com/h-pd-169.html",verifiedAt:"2026-08-27"},
];

const resunLpAdditional:EquipmentProfile[]=[
  {id:"resun-lp20",category:"air_pump",brand:"Resun",model:"LP-20",specifications:"Düşük sesli üretim tipi hava motoru · 1500 L/saat · 17 W",ratedFlowLph:1500,powerW:17,sourceUrl:"https://www.isw.co.id/pompa-resun",verifiedAt:"2026-08-18"},
  {id:"resun-lp40",category:"air_pump",brand:"Resun",model:"LP-40",specifications:"Düşük sesli üretim tipi hava motoru · 3000 L/saat · 35 W",ratedFlowLph:3000,powerW:35,sourceUrl:"https://www.isw.co.id/pompa-resun",verifiedAt:"2026-08-18"},
];

const resunAutomaticFeeders:EquipmentProfile[]=[
  {id:"resun-af2003",category:"other",brand:"Resun",model:"AF2003",specifications:"Otomatik yemleme makinesi · granül, stick ve pul yemlerle uyumlu",sourceUrl:"https://atakanpetshop.com/resun-af2003-otomatik-yemleme-makinesi",verifiedAt:"2026-08-25"},
  {id:"resun-af2005",category:"other",brand:"Resun",model:"AF2005",specifications:"Otomatik yemleme makinesi · günde 4 öğüne kadar · 12/24 saat ayarı · 2 AA pil",sourceUrl:"https://atakanpetshop.com/resun-af2005-otomatik-yemleme-makinasi",verifiedAt:"2026-08-25"},
  {id:"resun-af2005d",category:"other",brand:"Resun",model:"AF2005D",specifications:"Dijital otomatik yemleme makinesi · 2 öğüne kadar programlama · nem korumalı hazne",sourceUrl:"https://atakanpetshop.com/resun",verifiedAt:"2026-08-25"},
  {id:"resun-af2009d",category:"other",brand:"Resun",model:"AF2009D",specifications:"Dijital otomatik yemleme makinesi · günde 4 öğüne kadar programlama · LCD ekran",sourceUrl:"https://atakanpetshop.com/resun-af2009d-otomatik-yemleme-makinesi",verifiedAt:"2026-08-25"},
  {id:"resun-af2020",category:"other",brand:"Resun",model:"AF2020",specifications:"Otomatik yemleme makinesi · 3 otomatik besleme seçeneği · manuel besleme · USB veya pil",sourceUrl:"https://www.akvaryumexpress.com/resun-af2020-otomatik-yemleme-makinasi",verifiedAt:"2026-08-25"},
];

const resunCurrentCareAccessories:EquipmentProfile[]=[
  {id:"resun-manuel-dip-sifonu",category:"other",brand:"Resun",model:"Manuel Dip Sifonu",specifications:"Elle çalışan akvaryum dip temizleme sifonu",sourceUrl:"https://malawiizmir.com/resun-manuel-dip-sifonu",verifiedAt:"2026-08-26"},
  {id:"resun-mb-s",category:"other",brand:"Resun",model:"MB-S Mıknatıslı Cam Sileceği",specifications:"Küçük boy mıknatıslı akvaryum cam temizleyici",sourceUrl:"https://malawiizmir.com/resun-miknatisli-cam-silecek-mb-s",verifiedAt:"2026-08-26"},
  {id:"resun-mb-l",category:"other",brand:"Resun",model:"MB-L Mıknatıslı Cam Sileceği",specifications:"Büyük boy mıknatıslı akvaryum cam temizleyici",sourceUrl:"https://malawiizmir.com/resun-miknatisli-silecek-mb-l-large",verifiedAt:"2026-08-26"},
  {id:"resun-rst04",category:"other",brand:"Resun",model:"RST04 Cam Termometre",specifications:"Akvaryum camına takılan hassas cam termometre",sourceUrl:"https://malawiizmir.com/resun-rst04-akvaryum-cam-derece-hassas",verifiedAt:"2026-08-26"},
];

export const hardwareEquipmentCatalog: EquipmentProfile[] = [
  {id:"chihiros-heater-pro-12-16",category:"heater",brand:"Chihiros",model:"Heater Pro 12/16 mm (EU)",specifications:"Uygulama kontrollü dış hat ısıtıcısı · 10–35 °C · 10–1000 W dinamik çıkış · 650 litreye kadar",recommendedMaxL:650,sourceUrl:"https://www.chihirosaquaticstudio.com/products/chihiros-heater-pro-eu-version",verifiedAt:"2026-08-24"},
  {id:"chihiros-heater-pro-16-22",category:"heater",brand:"Chihiros",model:"Heater Pro 16/22 mm (EU)",specifications:"Uygulama kontrollü dış hat ısıtıcısı · 10–35 °C · 10–1000 W dinamik çıkış · 650 litreye kadar",recommendedMaxL:650,sourceUrl:"https://www.chihirosaquaticstudio.com/products/chihiros-heater-pro-eu-version",verifiedAt:"2026-08-24"},
  ...seraFilters,
  ...dennerleFilters,
  ...dennerleHeaters,
  ...dennerleExpandedEquipment,
  ...dennerleCurrentCo2Equipment,
  ...dennerleCurrentOtherEquipment,
  ...ferplastFilters,
  ...ferplastHeaters,
  ...ferplastCurrentEquipment,
  ...boyuFilters,
  ...boyuAirAndCo2,
  ...xinyouFilters,
  ...adaFilters,
  ...adaCo2,
  ...adaCurrentEquipment,
  ...jenecaFilters,
  ...jenecaCurrentFilters,
  ...jenecaAirPumps,
  ...jenecaHeaters,
  ...jenecaOfficialAdditional,
  ...jenecaOfficialExpandedFilters,
  ...jenecaOfficialUvFilters,
  ...jenecaOfficialExpandedAirPumps,
  ...jenecaOfficialPumpsAndWaveMakers,
  ...jenecaOfficialExpandedHeaters,
  ...jenecaOfficialExpandedLighting,
  ...jenecaOfficialAirStones,
  ...jenecaOfficialAccessories,
  ...eurostarFilters,
  ...xlproFilters,
  ...ejetFilters,
  ...dophinCurrentFilters,
  ...rsFilters,
  ...lifetechEquipment,
  ...jblExpandedEquipment,
  ...yikedaEquipment,
  ...haqosEquipment,
  ...jingyeEquipment,
  ...accessoryEquipment,
  ...waterbearEquipment,
  ...regentEquipment,
  ...sharkEquipment,
  ...armaturkEquipment,
  ...mecEquipment,
  ...mecAirDrivenFilters,
  ...netleaPumps,
  ...netleaFilters,
  ...netleaCurrentEquipment,
  ...soboExpandedEquipment,
  ...sunsunHangOnFilters,
  ...sunsunHw700Filters,
  ...sunsunCompactFilters,
  ...sunsunInternalFilters,
  ...sunsunWaterPumps,
  ...sunsunUvFilters,
  ...sunsunTurkeyCurrentExtras,
  ...resunWaterPumps,
  ...resunFilters,
  ...resunOfficialFilterSeries,
  ...resunOfficialUvClarifiers,
  ...resunOfficialCurrentWaterPumps,
  ...resunOfficialCurrentAirPumps,
  ...resunOfficialCurrentHeaters,
  ...resunOfficialCurrentLighting,
  ...resunOfficialCurrentChillers,
  ...resunOfficialCurrentAccessories,
  ...resunLpAdditional,
  ...resunAutomaticFeeders,
  ...resunCurrentCareAccessories,
];
