import type { EquipmentProfile } from "./catalog";

const VERIFIED_AT = "2026-08-17";
const co2ArtRegulators = "https://www.co2art.eu/collections/co2-regulators";
const co2ArtSystems = "https://www.co2art.eu/collections/complete-co2-systems/regulator_pro-se-series";
const aquawingSource = "https://www.akvaryumexpress.com/aquawing";

export const specializedEquipmentCatalog: EquipmentProfile[] = [
  { id:"co2art-pro-se-v2", category:"co2", brand:"CO2Art", model:"PRO-SE Series", specifications:"Çift kademeli regülatör · 12 V solenoid · azami 3 bar · çift gösterge", sourceUrl:"https://www.co2art.eu/products/pro-se-series-aquarium-co2-dual-stage-regulator-with-integrated-solenoid", verifiedAt:VERIFIED_AT },
  { id:"co2art-pro-elite-v2", category:"co2", brand:"CO2Art", model:"Pro-Elite Series V2", specifications:"Çift kademeli regülatör · 12 V solenoid · azami 5,5 bar · genişletilebilir manifold", sourceUrl:co2ArtRegulators, verifiedAt:VERIFIED_AT },
  { id:"co2art-pro-se-intank-system", category:"co2", brand:"CO2Art", model:"PRO-SE Complete System — In-Tank Flux", specifications:"Regülatör, tank içi difüzör, drop checker, CO₂ hortumu ve U-bend seti", sourceUrl:co2ArtSystems, verifiedAt:VERIFIED_AT },
  { id:"co2art-pro-se-inline-system", category:"co2", brand:"CO2Art", model:"PRO-SE Complete System — Inline", specifications:"Regülatör ve dış filtre hattı için inline difüzörlü tam set", sourceUrl:co2ArtSystems, verifiedAt:VERIFIED_AT },
  { id:"co2art-flux-v2", category:"co2", brand:"CO2Art", model:"In-Tank Flux Diffuser V2", specifications:"Tank içi CO₂ difüzörü", sourceUrl:"https://www.co2art.eu/", verifiedAt:VERIFIED_AT },
  { id:"co2art-inline-atomizer", category:"co2", brand:"CO2Art", model:"Inline CO₂ Atomizer", specifications:"Dış filtre hortumuna bağlanan CO₂ atomizeri", sourceUrl:"https://www.co2art.eu/", verifiedAt:VERIFIED_AT },
  { id:"co2art-io-diffuser", category:"co2", brand:"CO2Art", model:"IO Acrylic Diffuser", specifications:"Akrilik tank içi CO₂ difüzörü", sourceUrl:"https://www.co2art.eu/", verifiedAt:VERIFIED_AT },

  { id:"ista-co2-1l-set", category:"co2", brand:"ISTA", model:"1 L CO₂ Professional Set", specifications:"1 L yeniden doldurulabilir alüminyum tüp · solenoid regülatör · zamanlayıcı · difüzör · gösterge", sourceUrl:"https://aquarubi.com/ista-co2-profesyonel-set-1lt", verifiedAt:VERIFIED_AT },
  { id:"ista-co2-3l-set", category:"co2", brand:"ISTA", model:"3 L CO₂ Aluminium Cylinder Set", specifications:"3 L dikişsiz alüminyum tüp · çift göstergeli regülatör · kabarcık sayacı · seramik difüzör · hortum", sourceUrl:"https://fishyhub.com/product-detail/ista-3l-co2-aluminium-cylinder-set-9823", verifiedAt:VERIFIED_AT },
  { id:"ista-mini-co2-regulator", category:"co2", brand:"ISTA", model:"Tek Sayaçlı CO₂ Regülatör", specifications:"Basınç göstergeli ve hassas akış ayar vidalı CO₂ regülatörü", sourceUrl:"https://aquarubi.com/ista-co2-regulator-tek-sayacli", verifiedAt:VERIFIED_AT },
  { id:"ista-co2-solenoid-regulator", category:"co2", brand:"ISTA", model:"Solenoid CO₂ Regulator", specifications:"Zamanlayıcıyla kullanılabilen solenoid valfli CO₂ regülatörü", sourceUrl:"https://aquarubi.com/ista-co2-kontrol-selenoid-valfli-regulator", verifiedAt:VERIFIED_AT },
  { id:"mufan-dual-gauge-solenoid", category:"co2", brand:"Mufan", model:"W21.8 Dual Gauge Regulator with Solenoid", specifications:"Çift manometre · solenoid valf · hassas iğne valfi · kabarcık sayacı · W21.8 bağlantı", sourceUrl:"https://aquarubi.com/mufan-cift-gostergeli-selenoid-valfli-co2-regulator", verifiedAt:VERIFIED_AT },
  { id:"mufan-mini-regulator", category:"co2", brand:"Mufan", model:"W21.8 Dual Gauge Regulator", specifications:"Çift manometre · hassas iğne valfi · kabarcık sayacı · W21.8 bağlantı", sourceUrl:"https://aquarubi.com/mufan-cift-gostergeli-co2-regulator", verifiedAt:VERIFIED_AT },

  { id:"aquawing-aq202f", category:"filter", brand:"Aquawing", model:"AQ202F", specifications:"İç filtre · 500 L/saat · 5 W", ratedFlowLph:500, powerW:5, sourceUrl:aquawingSource, verifiedAt:VERIFIED_AT },
  { id:"aquawing-aq502hf", category:"filter", brand:"Aquawing", model:"AQ502HF", specifications:"Askı şelale filtre · 500 L/saat · 8 W", ratedFlowLph:500, powerW:8, sourceUrl:"https://malawiizmir.com/aq502hf-aquawing-selale-filtre-8w-500l-h", verifiedAt:VERIFIED_AT },
  { id:"aquawing-aq1000f", category:"filter", brand:"Aquawing", model:"AQ1000F", specifications:"Tepe filtre · 880 L/saat · 15 W", ratedFlowLph:880, powerW:15, sourceUrl:aquawingSource, verifiedAt:VERIFIED_AT },
  { id:"aquawing-aq188", category:"other", brand:"Aquawing", model:"AQ188", specifications:"Tepe filtre motoru · 1000 L/saat · 15 W", ratedFlowLph:1000, powerW:15, sourceUrl:aquawingSource, verifiedAt:VERIFIED_AT },
  { id:"aquawing-aq288", category:"other", brand:"Aquawing", model:"AQ288", specifications:"Tepe akvaryum motoru · 25 W", powerW:25, sourceUrl:aquawingSource, verifiedAt:VERIFIED_AT },
  { id:"aquawing-aq1000", category:"other", brand:"Aquawing", model:"AQ1000", specifications:"Kafa motoru · 800 L/saat · 15 W", ratedFlowLph:800, powerW:15, sourceUrl:aquawingSource, verifiedAt:VERIFIED_AT },
  { id:"aquawing-aq1200", category:"other", brand:"Aquawing", model:"AQ1200", specifications:"Kafa motoru · 1200 L/saat · 20 W", ratedFlowLph:1200, powerW:20, sourceUrl:aquawingSource, verifiedAt:VERIFIED_AT },
  { id:"aquawing-aq1500", category:"other", brand:"Aquawing", model:"AQ1500", specifications:"Kafa motoru · 1800 L/saat · 25 W", ratedFlowLph:1800, powerW:25, sourceUrl:aquawingSource, verifiedAt:VERIFIED_AT },
  { id:"aquawing-aq1800", category:"other", brand:"Aquawing", model:"AQ1800", specifications:"Kafa motoru · 2500 L/saat · 35 W", ratedFlowLph:2500, powerW:35, sourceUrl:aquawingSource, verifiedAt:VERIFIED_AT },
  { id:"aquawing-aq818", category:"air_pump", brand:"Aquawing", model:"AQ818", specifications:"Tek çıkışlı hava motoru · 2,5 W", powerW:2.5, sourceUrl:aquawingSource, verifiedAt:VERIFIED_AT },
  { id:"aquawing-aq838", category:"air_pump", brand:"Aquawing", model:"AQ838", specifications:"Çift çıkışlı hava motoru · 8 W", powerW:8, sourceUrl:aquawingSource, verifiedAt:VERIFIED_AT },
  { id:"aquawing-aq848", category:"air_pump", brand:"Aquawing", model:"AQ848", specifications:"Çift çıkışlı hava motoru · 10 W", powerW:10, sourceUrl:aquawingSource, verifiedAt:VERIFIED_AT },
  { id:"aquawing-aqa3000", category:"air_pump", brand:"Aquawing", model:"AQ-A3000", specifications:"Hava motoru · 25 W", powerW:25, sourceUrl:aquawingSource, verifiedAt:VERIFIED_AT },
];
