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

const ferplastFilterSource = "https://www.ferplast.com/products/bluextreme-700";
const ferplastFilters: EquipmentProfile[] = [
  [700,700,12,150], [1100,1100,16,300], [1500,1500,32,500],
].map(([model,ratedFlowLph,powerW,recommendedMaxL]) => ({
  id:`ferplast-bluextreme-${model}`, category:"filter", brand:"Ferplast", model:`Bluextreme ${model}`,
  specifications:`Dış filtre · ${ratedFlowLph} L/saat · ${powerW} W`, ratedFlowLph, powerW, recommendedMaxL,
  adjustableFlow:true, sourceUrl:ferplastFilterSource, verifiedAt,
}));

const ferplastHeaterSource = "https://www.ferplast.com/products/bluclima-8299";
const ferplastHeaters: EquipmentProfile[] = [50,75,100,150,200,300].map(powerW => ({
  id:`ferplast-bluclima-${powerW}`, category:"heater", brand:"Ferplast", model:`Bluclima ${powerW}`,
  specifications:`Ayarlanabilir dalgıç ısıtıcı · ${powerW} W`, powerW, sourceUrl:ferplastHeaterSource, verifiedAt,
}));

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
  ...["SF-100","SF-101","SF-102","SF-103","SF-104"].map(model=>({id:`boyu-${model.toLowerCase()}`,category:"filter" as const,brand:"Boyu",model,specifications:"Hava motoruyla çalışan ağırlıklı biyolojik sünger üretim filtresi",sourceUrl:"https://atakanpetshop.com/boyu-sf-103-uretim-filtresi-sf-103",verifiedAt})),
  ...["SF-02","SF-03"].map(model=>({id:`boyu-${model.toLowerCase()}`,category:"filter" as const,brand:"Boyu",model,specifications:"Hava motoruyla çalışan biyolojik sünger üretim filtresi",sourceUrl:"https://atakanpetshop.com/boyu",verifiedAt})),
);
const boyuAirAndCo2:EquipmentProfile[]=[
  {id:"boyu-acq-009",category:"air_pump",brand:"Boyu",model:"ACQ-009",specifications:"Elektromanyetik hava kompresörü · 160 L/dakika · 105 W",powerW:105,sourceUrl:"https://atakanpetshop.com/boyu",verifiedAt},
  {id:"boyu-electromagnetic-110",category:"air_pump",brand:"Boyu",model:"Electro Magnetic 110 L/min",specifications:"Elektromanyetik hava kompresörü · 110 L/dakika · 100 W",powerW:100,sourceUrl:"https://atakanpetshop.com/boyu",verifiedAt},
  ...["CO-100","CO-150","CO-170"].map(model=>({id:`boyu-${model.toLowerCase()}`,category:"co2" as const,brand:"Boyu",model,specifications:"Bitkili akvaryum için cam CO₂ difüzörü",sourceUrl:"https://atakanpetshop.com/boyu",verifiedAt})),
];
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
  specifications:`Hava ile çalışan biyolojik sünger filtre · ${maxL} litreye kadar`, recommendedMaxL:Number(maxL),
  sourceUrl:xinyouSource, verifiedAt,
}));

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

const eurostarFilters: EquipmentProfile[] = [
  { id:"eurostar-hbl802", category:"filter", brand:"Eurostar", model:"HBL802", specifications:"Ayarlanabilir askı filtre · 500 L/saat · 6 W", ratedFlowLph:500, powerW:6, recommendedMinL:60, recommendedMaxL:100, adjustableFlow:true, sourceUrl:"https://www.karacaakvaryum.com/urun/eurostar-hbl802-aski-filtre-sistemi/", verifiedAt },
  { id:"eurostar-sponge-production-small", category:"filter", brand:"Eurostar", model:"Sünger Üretim Filtresi Small", specifications:"Hava motoru veya filtre emiş hattıyla çalışan ağırlıklı sünger filtre · Small", sourceUrl:"https://atakanpetshop.com/eurostar-sunger-uretim-filtresi-medium", verifiedAt },
  { id:"eurostar-sponge-production-medium", category:"filter", brand:"Eurostar", model:"Sünger Üretim Filtresi Medium", specifications:"Hava motoru veya filtre emiş hattıyla çalışan ağırlıklı sünger filtre · 12 cm çap · 10 cm yükseklik", sourceUrl:"https://atakanpetshop.com/eurostar-sunger-uretim-filtresi-medium", verifiedAt },
  { id:"eurostar-sponge-production-large", category:"filter", brand:"Eurostar", model:"Sünger Üretim Filtresi Large", specifications:"Hava motoru veya filtre emiş hattıyla çalışan ağırlıklı sünger filtre · Large", sourceUrl:"https://atakanpetshop.com/eurostar-sunger-uretim-filtresi-medium", verifiedAt },
];

const xlproSource = "https://www.akvaryumexpress.com/xlpro";
const xlproFilters: EquipmentProfile[] = [
  ["230 Mini",210], ["Mini-500",510], ["EX-1000",1000], ["EX-1200",1200], ["EX-1500",1500],
].map(([model,flow]) => ({id:`xlpro-${String(model).toLowerCase().replace(/[^a-z0-9]+/g,"-")}`,category:"filter",brand:"XLPro",model:String(model),specifications:`Dış filtre · ${flow} L/saat`,ratedFlowLph:Number(flow),sourceUrl:xlproSource,verifiedAt}));

const ejetSource = "https://atakanpetshop.com/ejet";
const ejetFilters: EquipmentProfile[] = [
  ["3358",750], ["3368",1650], ["3378",1850], ["3388",2000],
].map(([model,flow]) => ({id:`ejet-${model}`,category:"filter",brand:"Ejet",model:String(model),specifications:`Dış filtre · ${flow} L/saat`,ratedFlowLph:Number(flow),sourceUrl:ejetSource,verifiedAt}));
ejetFilters.push(
  {id:"ejet-j103",category:"filter",brand:"Ejet",model:"J103",specifications:"Hava ile çalışan sünger filtre",sourceUrl:ejetSource,verifiedAt},
  {id:"ejet-102",category:"filter",brand:"Ejet",model:"102",specifications:"Hava ile çalışan pipo filtre",sourceUrl:ejetSource,verifiedAt},
  {id:"ejet-bp3",category:"air_pump",brand:"Ejet",model:"BP3",specifications:"Pilli hava motoru",sourceUrl:ejetSource,verifiedAt},
  {id:"ejet-905f",category:"filter",brand:"Ejet",model:"905F",specifications:"İç filtre · 1000 L/saat",ratedFlowLph:1000,sourceUrl:"https://malawiizmir.com/e---jet-905-f-ic-filtre",verifiedAt},
);

const dophinRetailSource="https://atakanpetshop.com/dophin";
const dophinCurrentFilters:EquipmentProfile[]=[
  {id:"dophin-h200",category:"filter",brand:"Dophin",model:"H200",specifications:"Askı şelale filtre · 250 L/saat · 4 W",ratedFlowLph:250,powerW:4,sourceUrl:dophinRetailSource,verifiedAt},
  {id:"dophin-h300",category:"filter",brand:"Dophin",model:"H300",specifications:"Askı şelale filtre · 360 L/saat · 5,2 W",ratedFlowLph:360,powerW:5.2,sourceUrl:dophinRetailSource,verifiedAt},
  {id:"dophin-h500",category:"filter",brand:"Dophin",model:"H500",specifications:"Askı şelale filtre · 510 L/saat",ratedFlowLph:510,sourceUrl:dophinRetailSource,verifiedAt},
  {id:"dophin-h800",category:"filter",brand:"Dophin",model:"H800",specifications:"Askı şelale filtre · 1000 L/saat · 9,3 W",ratedFlowLph:1000,powerW:9.3,sourceUrl:dophinRetailSource,verifiedAt},
  {id:"dophin-kf150",category:"filter",brand:"Dophin",model:"KF150",specifications:"İç filtre · 150 L/saat",ratedFlowLph:150,sourceUrl:dophinRetailSource,verifiedAt},
  {id:"dophin-kf160",category:"filter",brand:"Dophin",model:"KF160",specifications:"İç filtre · 150 L/saat",ratedFlowLph:150,sourceUrl:dophinRetailSource,verifiedAt},
  {id:"dophin-kf200",category:"filter",brand:"Dophin",model:"KF200",specifications:"İç filtre · 180 L/saat",ratedFlowLph:180,sourceUrl:dophinRetailSource,verifiedAt},
  {id:"dophin-kf350",category:"filter",brand:"Dophin",model:"KF350",specifications:"İç filtre · 350 L/saat",ratedFlowLph:350,sourceUrl:dophinRetailSource,verifiedAt},
  {id:"dophin-fb1000f",category:"filter",brand:"Dophin",model:"FB1000 F",specifications:"Aktif karbon kartuşlu iç filtre · 300 L/saat",ratedFlowLph:300,sourceUrl:dophinRetailSource,verifiedAt},
  {id:"dophin-fb3000f",category:"filter",brand:"Dophin",model:"FB3000 F",specifications:"Aktif karbon kartuşlu iç filtre · 500 L/saat · 50–90 litre",ratedFlowLph:500,recommendedMinL:50,recommendedMaxL:90,sourceUrl:"https://atakanpetshop.com/dophin-fb3000-f-ic-filtre-500-l-s",verifiedAt},
  {id:"dophin-fb4000f",category:"filter",brand:"Dophin",model:"FB4000 F",specifications:"Aktif karbon kartuşlu iç filtre · 600 L/saat",ratedFlowLph:600,sourceUrl:dophinRetailSource,verifiedAt},
  {id:"dophin-sf15",category:"filter",brand:"Dophin",model:"SF15",specifications:"Hava motoruyla çalışan biyolojik pipo filtre",sourceUrl:dophinRetailSource,verifiedAt},
  {id:"dophin-sf33",category:"filter",brand:"Dophin",model:"SF33",specifications:"Hava motoruyla çalışan biyolojik pipo filtre",sourceUrl:dophinRetailSource,verifiedAt},
  {id:"dophin-cf300",category:"filter",brand:"Dophin",model:"CF-300",specifications:"Nano akvaryumlar için mini dış filtre",sourceUrl:dophinRetailSource,verifiedAt},
  {id:"dophin-ap1302",category:"air_pump",brand:"Dophin",model:"AP1302",specifications:"Akvaryum hava motoru",sourceUrl:dophinRetailSource,verifiedAt},
];

const rsSource = "https://www.petadana01.com/akvaryum-ic-filtre/";
const rsFilters: EquipmentProfile[] = ["RS602","RS605","RS2004","RS800","RS604","RS712","RS2002","RS760","RS-04B"].map(model=>({
  id:`rs-${model.toLowerCase()}`,category:"filter",brand:"RS Electrical",model,specifications:"İç filtre · model teknik bilgisi doğrulama bekliyor",sourceUrl:rsSource,verifiedAt,
}));
const rs712=rsFilters.find(item=>item.model==="RS712");if(rs712){rs712.model="RS 712";rs712.specifications="İç filtre · 350 L/saat · 4 W";rs712.ratedFlowLph=350;rs712.powerW=4;rs712.sourceUrl="https://malawiizmir.com/rs-712-ic-filtre-4w-350l-h";}
const rsVerified:Record<string,Partial<EquipmentProfile>>={
  "RS602":{model:"RS-602",specifications:"İç filtre · 300 L/saat · 3 W · 20–40 litre",ratedFlowLph:300,powerW:3,recommendedMinL:20,recommendedMaxL:40,sourceUrl:"https://kaspi.kz/shop/p/rs-electrical-vnutrennii-rs-602-130650929/"},
  "RS605":{model:"RS-605",specifications:"İç filtre · 450 L/saat · 6 W · 90 litreye kadar",ratedFlowLph:450,powerW:6,recommendedMaxL:90,sourceUrl:"https://www.trendyol.com/en/rs-electrical/aquarium-internal-filter-rs-605-6w-450-l-h-p-335528547"},
  "RS2004":{model:"RS-2004",specifications:"İç filtre · 1750 L/saat · 25 W",ratedFlowLph:1750,powerW:25,sourceUrl:"https://www.dayaaquatics.com/index.php?cat=Aquarium-Filter-Categories&products_id=2165910&subcat=Internal-Filter&ws=showproducts"},
  "RS800":{model:"RS-800",category:"air_pump",specifications:"Çift çıkışlı hava motoru · 3 L/dakika",sourceUrl:"https://www.mercadolibre.com.uy/oxigenador-bomba-de-aire-acuario-rs800-3lmin-2-salidas/up/MLUU3171039318"},
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
  {id:"rs-1000-hob",category:"filter",brand:"RS Electrical",model:"RS-1000 Şelale",specifications:"Askı filtre · 600 L/saat · 2,5 W",ratedFlowLph:600,powerW:2.5,sourceUrl:"https://www.n11.com/evcil-hayvan-urunleri/balik/dis-filtre?m=Rs+Electrical",verifiedAt},
  {id:"rs-188-top",category:"filter",brand:"RS Electrical",model:"RS-188 Tepe",specifications:"Tepe filtre · 800 L/saat · 12 W",ratedFlowLph:800,powerW:12,sourceUrl:"https://www.n11.com/evcil-hayvan-urunleri/balik/dis-filtre?m=Rs+Electrical",verifiedAt},
  {id:"rs-288-top",category:"filter",brand:"RS Electrical",model:"RS-288 Tepe",specifications:"Tepe filtre · 1000 L/saat · 15 W",ratedFlowLph:1000,powerW:15,sourceUrl:"https://www.n11.com/evcil-hayvan-urunleri/balik/dis-filtre?m=Rs+Electrical",verifiedAt},
  {id:"rs-388-top",category:"filter",brand:"RS Electrical",model:"RS-388 Tepe",specifications:"Tepe filtre · 1750 L/saat · 25 W",ratedFlowLph:1750,powerW:25,sourceUrl:"https://www.n11.com/evcil-hayvan-urunleri/balik/dis-filtre?m=Rs+Electrical",verifiedAt},
  {id:"rs-fa7000",category:"filter",brand:"RS Electrical",model:"FA7000",specifications:"Askı filtre · 600 L/saat · 4,5 W",ratedFlowLph:600,powerW:4.5,sourceUrl:"https://atakanpetshop.com/rs-7000-aski-filtre-600l-h-4-5w",verifiedAt},
  {id:"rs-99-uv",category:"filter",brand:"RS Electrical",model:"RS-99 UV",specifications:"Ayarlanabilir UV'li iç filtre · 800 L/saat · 8 W + 9 W UV-C",ratedFlowLph:800,powerW:8,integratedUvcW:9,recommendedMaxL:160,adjustableFlow:true,sourceUrl:"https://atakanpetshop.com/rs-99-9w-uv-lambali-ic-filtre-8w-800l-h",verifiedAt},
  {id:"rs-613",category:"filter",brand:"RS Electrical",model:"RS 613",specifications:"İç filtre · 450 L/saat · 5 W",ratedFlowLph:450,powerW:5,sourceUrl:"https://malawiizmir.com/rs-613-ic-filtre-5w-450-l-h",verifiedAt},
);

const lifetechSource="https://atakanpetshop.com/lifetech";
const lifetechEquipment:EquipmentProfile[]=[
  {id:"lifetech-635",category:"filter",brand:"Lifetech",model:"635",specifications:"Dış filtre · 600 L/saat · 13 W",ratedFlowLph:600,powerW:13,recommendedMinL:100,recommendedMaxL:200,sourceUrl:"https://atakanpetshop.com/lifetech-635-dis-filtre-600-l-s",verifiedAt},
  {id:"lifetech-835",category:"filter",brand:"Lifetech",model:"835",specifications:"Üç sepetli dış filtre · 1000 L/saat · 22 W · 100–300 litre",ratedFlowLph:1000,powerW:22,recommendedMinL:100,recommendedMaxL:300,sourceUrl:"https://atakanpetshop.com/lifetech-835-dis-filtre-1000-l-s",verifiedAt},
  {id:"lifetech-838",category:"filter",brand:"Lifetech",model:"838",specifications:"Dış filtre · 1200 L/saat",ratedFlowLph:1200,recommendedMinL:200,recommendedMaxL:400,sourceUrl:"https://atakanpetshop.com/lifetech-838-dis-filtre-1200-l-s?page=1",verifiedAt},
  {id:"lifetech-839",category:"filter",brand:"Lifetech",model:"839",specifications:"Beş sepetli dış filtre · 1500 L/saat · 35 W · 400–600 litre",ratedFlowLph:1500,powerW:35,recommendedMinL:400,recommendedMaxL:600,sourceUrl:"https://atakanpetshop.com/lifetech-839-dis-filtre-1500-l-s",verifiedAt},
  ...[5,9,11,13,18,36].map(powerW=>({id:`lifetech-uv-h${powerW}`,category:"uv" as const,brand:"Lifetech",model:`Jebo UV-H${powerW}`,specifications:`UV sterilizatör · ${powerW} W`,powerW,sourceUrl:lifetechSource,verifiedAt})),
];
Object.assign(lifetechEquipment.find(item=>item.model==="Jebo UV-H9")!,{specifications:"UV sterilizatör · 9 W · azami 500 L/saat akış · 1000 litreye kadar",ratedFlowLph:500,recommendedMaxL:1000,sourceUrl:"https://atakanpetshop.com/jebo-uv-h9-ultraviole-filtre-9w"});

const yikedaEquipment:EquipmentProfile[]=[
  {id:"yikeda-sd48ab",category:"lighting",brand:"Yikeda",model:"SD-48A-B",specifications:"Full spectrum klipsli LED · 15,2 W",powerW:15.2,sourceUrl:"https://atakanpetshop.com/yikeda-led-akvaryum-aydinlatmasi-beyaz-152w-sd-48a-b",verifiedAt},
  {id:"yikeda-sd1055",category:"lighting",brand:"Yikeda",model:"SD-1055 RGB",specifications:"RGB LED · 55 W · 4920 lm · 3 kademe dimmer",powerW:55,recommendedTankLengthCm:[90,110],sourceUrl:"https://atakanpetshop.com/yikeda-sd-1055-rgb-led-aydinlatma-55w-90-110-cm",verifiedAt},
  {id:"yikeda-dy10w",category:"lighting",brand:"Yikeda",model:"DY-10W",specifications:"Mavi-beyaz ayaklı LED · 10 W",powerW:10,sourceUrl:"https://atakanpetshop.com/yikeda-dy-10w-ayakli-led-aydinlatma-10w-mavi-beyaz",verifiedAt},
  ...[85,100,120].map(powerW=>({id:`yikeda-smart-ufo-${powerW}`,category:"lighting" as const,brand:"Yikeda",model:`Smart UFO ${powerW} W`,specifications:`Tam spectrum UFO LED · ${powerW} W`,powerW,sourceUrl:"https://atakanpetshop.com/yikeda-smart-ufo-led-lamba-100w",verifiedAt})),
];

const haqosEquipment:EquipmentProfile[]=[
  {id:"haqos-expro-500",category:"filter",brand:"Haqos",model:"EXPRO-500",specifications:"Ayarlanabilir askı dış filtre · 510 L/saat · 6,9 W",ratedFlowLph:510,powerW:6.9,recommendedMaxL:100,adjustableFlow:true,sourceUrl:"https://www.haqos.com/",verifiedAt},
];

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
  {id:"jingye-911",category:"air_pump",brand:"Jingye",model:"911",specifications:"Tek çıkışlı hava motoru · 3 L/dakika · 2 W",powerW:2,sourceUrl:jingyeSource,verifiedAt},
  {id:"jingye-921",category:"air_pump",brand:"Jingye",model:"921",specifications:"Çift çıkışlı hava motoru · 2 × 3,4 L/dakika · 3 W",powerW:3,sourceUrl:jingyeSource,verifiedAt},
  {id:"jingye-ye621",category:"air_pump",brand:"Jingye",model:"YE-621",specifications:"Çift çıkışlı sessiz hava motoru · 2 × 3,4 L/dakika · 5 W",powerW:5,sourceUrl:jingyeSource,verifiedAt},
  {id:"jingye-cd200",category:"air_pump",brand:"Jingye",model:"CD200",specifications:"Şarjlı tek çıkışlı hava motoru · 2 L/dakika · 1,8 W",powerW:1.8,sourceUrl:"https://atakanpetshop.com/akvaryum-pilli-sarjli-hava-motorlari",verifiedAt},
];

const accessoryEquipment:EquipmentProfile[]=[
  {id:"liya-ly1009h",category:"other",brand:"Liya",model:"LY-1009H",specifications:"95 cm üçgen keçeli cam sileceği",sourceUrl:"https://www.akvaryumexpress.com/liya",verifiedAt},
  {id:"liya-ly1820",category:"other",brand:"Liya",model:"LY-1820",specifications:"Kare yemleme aparatı",sourceUrl:"https://www.akvaryumexpress.com/liya",verifiedAt},
  {id:"nubios-kdsm01-mini",category:"other",brand:"Nubios",model:"KDSM01 Mini",specifications:"Mıknatıslı nano akvaryum cam sileceği",sourceUrl:"https://atakanpetshop.com/nubios-miknatisli-akvaryum-cam-silecegi-mini-771-kdsm01",verifiedAt},
  {id:"nubios-fpd51b",category:"other",brand:"Nubios",model:"FPD51B 5in1",specifications:"67 cm beş parçalı akvaryum bakım kiti",sourceUrl:"https://atakanpetshop.com/nubios-5in1-akvaryum-cam-temizleme-ve-bakim-kiti-67cm-771-fpd51b",verifiedAt},
  {id:"aquapro-smart-bubble-counter",category:"co2",brand:"Aquapro",model:"Smart Bubble Counter",specifications:"Hortum giriş-çıkışlı akıllı CO₂ damla sayacı",sourceUrl:"https://atakanpetshop.com/aquapro",verifiedAt},
  {id:"aquapro-co2-diffuser-medium",category:"co2",brand:"Aquapro",model:"CO₂ Diffuser Medium",specifications:"Orta boy CO₂ difüzörü",sourceUrl:"https://atakanpetshop.com/aquapro",verifiedAt},
  {id:"aquapro-co2-diffuser-large",category:"co2",brand:"Aquapro",model:"CO₂ Diffuser Large",specifications:"Büyük boy CO₂ difüzörü",sourceUrl:"https://atakanpetshop.com/aquapro",verifiedAt},
];

const waterbearEquipment:EquipmentProfile[]=[
  {id:"waterbear-wb-g04",category:"filter",brand:"WaterBear",model:"WB-G04",specifications:"Biyo-tekerlekli askı filtre · 250 L/saat · 3 W",ratedFlowLph:250,powerW:3,sourceUrl:"https://atakanpetshop.com/waterbear-wb-g04-aski-filtre-3w-250ls",verifiedAt},
  ...[["880F",650,15],["1880F",880,25],["2880F",1800,30],["3880F",2500,40]].map(([model,ratedFlowLph,powerW])=>({id:`waterbear-${String(model).toLowerCase()}`,category:"filter" as const,brand:"WaterBear",model:String(model),specifications:`Tepe filtre · ${ratedFlowLph} L/saat · ${powerW} W`,ratedFlowLph:Number(ratedFlowLph),powerW:Number(powerW),sourceUrl:"https://atakanpetshop.com/akvaryum-ust-filtreler",verifiedAt})),
  ...[["WB-2771",900,12],["WB-3771",1200,18],["WB-4771",1600,25]].map(([model,ratedFlowLph,powerW])=>({id:`waterbear-${String(model).toLowerCase()}`,category:"other" as const,brand:"WaterBear",model:String(model),specifications:`Dalgıç/sump pompası · ${ratedFlowLph} L/saat · ${powerW} W`,ratedFlowLph:Number(ratedFlowLph),powerW:Number(powerW),sourceUrl:"https://atakanpetshop.com/akvaryum-kafa-ve-sump-motoru",verifiedAt})),
  {id:"waterbear-sd01",category:"filter",brand:"WaterBear",model:"SD-01",specifications:"Hava ile çalışan pipo filtre",sourceUrl:"https://atakanpetshop.com/akvaryum-sunger-filtreler-pipo-filtre-dophin-sfp",verifiedAt},
  {id:"waterbear-sd02",category:"filter",brand:"WaterBear",model:"SD-02",specifications:"Motorlu pipo filtre · 200 L/saat · 2 W",ratedFlowLph:200,powerW:2,sourceUrl:"https://atakanpetshop.com/akvaryum-sunger-filtreler-pipo-filtre-dophin-sfp",verifiedAt},
];

const regentEquipment:EquipmentProfile[]=[
  ["6500",2.4,"Tek çıkış"],["7500",3,"Çift çıkış"],["8500",4,"Çift çıkış"],["9500",4,"Çift çıkış"],
].map(([model,powerW,outlet])=>({id:`regent-${model}`,category:"air_pump",brand:"Regent",model:String(model),specifications:`${outlet} hava motoru · ${powerW} W`,powerW:Number(powerW),sourceUrl:"https://atakanpetshop.com/regent",verifiedAt}));

const sharkEquipment:EquipmentProfile[]=[
  ["Shark Pro 500",530,4],["Shark Pro 700",720,7],["Shark Pro 900",910,10],
].map(([model,ratedFlowLph,powerW])=>({id:`sicce-${String(model).toLowerCase().replace(/[^a-z0-9]+/g,"-")}`,category:"filter",brand:"Shark (Sicce)",model:String(model),specifications:`Ayarlanabilir modüler iç filtre · ${ratedFlowLph} L/saat · ${powerW} W`,ratedFlowLph:Number(ratedFlowLph),powerW:Number(powerW),adjustableFlow:true,sourceUrl:"https://us.sicce.com/en/products/filters/shark-pro.html",verifiedAt}));

const armaturkEquipment:EquipmentProfile[]=[
  ["Nano Türk",20,27],["1030H",30,37],["2040H",40,54],["1050L",50,64],["2060H",60,74],["2070H",70,84],["2080H",80,94],["2090H",90,104],["2100H",100,114],["1200L",120,134],["1300L",130,144],["1500L",150,164],
].map(([model,minLength,maxLength])=>({id:`armaturk-${String(model).toLowerCase().replace(/[^a-z0-9]+/g,"-")}`,category:"lighting",brand:"Armatürk",model:String(model),specifications:`Akvaryum LED armatürü · ${minLength} cm gövde`,recommendedTankLengthCm:[Number(minLength),Number(maxLength)] as [number,number],sourceUrl:"https://www.armaturk.com.tr/",verifiedAt}));

const mecEquipment:EquipmentProfile[]=[
  {id:"mec-heater-suction-cup",category:"other",brand:"Meç",model:"İsıtıcı Vantuzu",specifications:"İsıtıcı sabitleme vantuzu · tekli ve 10'lu paket"},
  {id:"mec-airline-t-splitter",category:"other",brand:"Meç",model:"Hava Hortumu T Dağıtıcı",specifications:"Hava hortumu T bağlantısı · tekli ve 10'lu paket"},
  {id:"mec-airline-valve",category:"other",brand:"Meç",model:"Hava Hortumu Musluğu",specifications:"Hava hortumu akış vanası · tekli ve 10'lu paket"},
  {id:"mec-brine-shrimp-net",category:"other",brand:"Meç",model:"Artemia Süzgeci 9 cm",specifications:"Artemia çıkartma süzgeci/kepçesi"},
].map((item):EquipmentProfile=>({...item,category:"other",sourceUrl:"https://atakanpetshop.com/mec",verifiedAt}));

const netleaPumpSource="https://atakanpetshop.com/netlea";
const netleaPumps:EquipmentProfile[]=[
  {id:"netlea-c4000",category:"other",brand:"Netlea",model:"C4000",specifications:"Altı kademeli ayarlanabilir DC kafa motoru · 4000 L/saat · 3–25 W · 4 m basma yüksekliği",ratedFlowLph:4000,powerW:25,adjustableFlow:true,sourceUrl:"https://atakanpetshop.com/netlea-c4000-debi-ayarli-kafa-motoru-25w-4000lh-4-metre-6949625020212",verifiedAt},
  {id:"netlea-c5000",category:"other",brand:"Netlea",model:"C5000",specifications:"Ayarlanabilir DC kafa motoru · 5000 L/saat · 35 W · 4,5 m basma yüksekliği",ratedFlowLph:5000,powerW:35,adjustableFlow:true,sourceUrl:"https://atakanpetshop.com/netlea-c5000-debi-ayarli-kafa-motoru-35w-5000lh-45-metre-6949625020229",verifiedAt},
  {id:"netlea-c6000",category:"other",brand:"Netlea",model:"C6000",specifications:"Ayarlanabilir DC kafa motoru · 6000 L/saat · 40 W · 5 m basma yüksekliği",ratedFlowLph:6000,powerW:40,adjustableFlow:true,sourceUrl:netleaPumpSource,verifiedAt},
  {id:"netlea-c7000",category:"other",brand:"Netlea",model:"C7000",specifications:"Ayarlanabilir DC kafa motoru · 7000 L/saat · 50 W · 5 m · 1400 litreye kadar",ratedFlowLph:7000,powerW:50,recommendedMaxL:1400,adjustableFlow:true,sourceUrl:"https://atakanpetshop.com/netlea-c7000-dc-debi-ayarli-kafa-motoru-50w-7000ls-5m",verifiedAt},
  {id:"netlea-sg2500",category:"other",brand:"Netlea",model:"SG2500",specifications:"Bluetooth kontrollü DC kafa motoru · 2500 L/saat · 22 W · 3,8 m basma yüksekliği",ratedFlowLph:2500,powerW:22,adjustableFlow:true,sourceUrl:netleaPumpSource,verifiedAt},
  {id:"netlea-sg5000",category:"other",brand:"Netlea",model:"SG5000",specifications:"Bluetooth kontrollü DC kafa motoru · 5000 L/saat · 35 W · 4,5 m basma yüksekliği",ratedFlowLph:5000,powerW:35,adjustableFlow:true,sourceUrl:netleaPumpSource,verifiedAt},
  {id:"netlea-s5500",category:"other",brand:"Netlea",model:"S5500",specifications:"Ayarlanabilir DC kafa motoru · 6000 L/saat · 35 W · 5 m basma yüksekliği",ratedFlowLph:6000,powerW:35,adjustableFlow:true,sourceUrl:netleaPumpSource,verifiedAt},
];

export const hardwareEquipmentCatalog: EquipmentProfile[] = [
  ...seraFilters,
  ...dennerleFilters,
  ...dennerleHeaters,
  ...ferplastFilters,
  ...ferplastHeaters,
  ...boyuFilters,
  ...boyuAirAndCo2,
  ...xinyouFilters,
  ...adaFilters,
  ...adaCo2,
  ...jenecaFilters,
  ...eurostarFilters,
  ...xlproFilters,
  ...ejetFilters,
  ...dophinCurrentFilters,
  ...rsFilters,
  ...lifetechEquipment,
  ...yikedaEquipment,
  ...haqosEquipment,
  ...jingyeEquipment,
  ...accessoryEquipment,
  ...waterbearEquipment,
  ...regentEquipment,
  ...sharkEquipment,
  ...armaturkEquipment,
  ...mecEquipment,
  ...netleaPumps,
];
