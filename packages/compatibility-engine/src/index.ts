// @aquamind/compatibility-engine
//
// Deterministik akvaryum uyumluluk ve sağlık analizi. Bu gövde
// src/lib/health-analysis.ts içinden Phase 0B'de birebir taşındı; puanlar,
// eşikler ve uyarı metinleri değişmedi. Tek fark: motor kataloğu doğrudan
// içe aktarmaz, bilgiye `KnowledgeResolver` üzerinden ulaşır. Uygulama
// tarafındaki uyarlayıcı (src/lib/health-analysis.ts) kataloğu bağlar.
//
// Kural: puan ve bulgular yalnızca bu deterministik motordan gelir; yapay zekâ
// hiçbir zaman puan üretmez (bkz. docs/COMPATIBILITY.md).
import type { Aquarium, AquariumType, Equipment, Livestock, WaterParameters } from "@aquamind/domain";

export { ENGINE_VERSION, RULESET_VERSION } from "./version";
export * from "./water-quality";
import { assessWaterQuality } from "./water-quality";

/** Motorun bir canlı profilinden okuduğu alanlar. Katalogdaki SpeciesProfile bunu yapısal olarak karşılar. */
export interface SpeciesProfileInput {
  id: string;
  commonName: string;
  /** Belirtilmezse canlı yalnızca tatlı su akvaryumuna uygun kabul edilir. */
  waterTypes?: AquariumType[];
  adultSizeCm: number;
  minVolumeL: number;
  additionalVolumePerAnimalL?: number;
  /** Kaynak tank uzunluğu yayımlamıyorsa boştur; o zaman yalnızca hacim denetlenir. */
  minTankLengthCm?: number;
  tankLengthDataNote?: string;
  minGroup: number;
  temperature: [number, number];
  ph: [number, number];
  flow?: "low" | "medium" | "high";
  wasteFactor: number;
  specificGravity?: [number, number];
  predatory?: boolean;
  speciesOnly?: boolean;
  communityCaution?: string;
  husbandryCaution?: string;
}

/** Motorun bir ekipman profilinden okuduğu alanlar. Katalogdaki EquipmentProfile bunu yapısal olarak karşılar. */
export interface EquipmentProfileInput {
  id: string;
  category: Equipment["category"];
  brand: string;
  model: string;
  ratedFlowLph?: number;
  powerW?: number;
  recommendedMinL?: number;
  recommendedMaxL?: number;
  requiresAirPump?: boolean;
  integratedHeaterW?: number;
  /** Tek başına su çevirmeyen filtre parçası; filtrasyon hesabına girmez. */
  passiveComponent?: boolean;
  /** Ana filtrenin yerine geçmeyen yardımcı filtre (ör. yüzey skimmeri). */
  auxiliaryFiltration?: boolean;
  capacityDataNote?: string;
}

/** Bilgi çözümleyici: motorun kataloğa (veya ileride veritabanına) açılan tek kapısı. */
export interface KnowledgeResolver {
  speciesForLivestock(item: Livestock): SpeciesProfileInput | undefined;
  profileForEquipment(item: Equipment): EquipmentProfileInput | undefined;
  isVerifiedSpeciesProfile(profile?: SpeciesProfileInput): boolean;
  isVerifiedEquipmentProfile(profile?: EquipmentProfileInput): boolean;
}

export type AnalyzeAquarium = (aquarium: Aquarium, animals: Livestock[], equipment: Equipment[], latest?: WaterParameters) => HealthAnalysis;

export interface HealthMetric { key:string; label:string; score:number; status:"good"|"warning"|"danger"; detail:string; }
export interface HealthAnalysis { score:number; status:"good"|"warning"|"danger"; metrics:HealthMetric[]; warnings:Array<{level:"warning"|"danger";title:string;message:string}>; }
const clamp=(n:number)=>Math.max(0,Math.min(100,Math.round(n)));
// Kural seti 1.3.0 eşikleri (docs/DECISIONS/0009-filtre-yuk-ve-genel-durum.md).
/** Akvaryum, filtrelerin üreticilerince önerilen toplam hacmi bu oranın üstünde aşarsa tehlike; altında aşarsa uyarı. */
const FILTER_OVER_CAPACITY_DANGER=1.5;
/** Üretici hacim önermiyorsa etiket debisiyle saatte en az bu kadar çevrim uygun sayılır. */
const FILTER_MIN_RATED_TURNOVER=4;
/** Etiket debisiyle saatte bu kadar çevrimin altı tehlikedir; arası uyarıdır. */
const FILTER_DANGER_RATED_TURNOVER=2;
/** Tahmini yük oranı bunun üstündeyse uyarı. Katalogdaki hiçbir tür, kendi kaynağının önerdiği en küçük akvaryum ve grupta bu değere ulaşmaz. */
const LOAD_WARNING_RATIO=2.5;
/** Kesin tehlike olmayan bir tehlike uyarısı varken genel puanın üst sınırı (en fazla "dikkat"). */
const DANGER_WARNING_SCORE_CAP=74;
const status=(score:number):HealthMetric["status"]=>score>=75?"good":score>=50?"warning":"danger";

export function createAnalyzer(resolver:KnowledgeResolver):AnalyzeAquarium{
 return function analyzeAquarium(aquarium,animals,equipment,latest){
 const matchedProfiles=animals.map(item=>({item,profile:resolver.speciesForLivestock(item)})).filter(x=>x.profile);
 const verifiedMatchedProfiles=matchedProfiles.filter(x=>resolver.isVerifiedSpeciesProfile(x.profile));
 // Aynı tür farklı tarihlerde birden fazla kez eklenebilir. Sosyal grup, alan ve
 // uyumluluk hesabında bu kayıtları tek popülasyon olarak değerlendiririz.
 const groupedProfiles=new Map<string,(typeof verifiedMatchedProfiles)[number]>();
 for(const entry of verifiedMatchedProfiles){
  const key=entry.profile!.id;
  const current=groupedProfiles.get(key);
  groupedProfiles.set(key,current?{...current,item:{...current.item,quantity:current.item.quantity+entry.item.quantity}}:entry);
 }
 const profiles=[...groupedProfiles.values()];
 // Su türü belirtilmemiş canlı profilleri tatlı su kabul edilir.
 const habitatIssues=profiles.filter(({profile})=>!(profile!.waterTypes??["freshwater"]).includes(aquarium.type));
 const loadUnits=profiles.reduce((sum,{item,profile})=>sum+item.quantity*profile!.adultSizeCm*profile!.wasteFactor,0);
 // Atık katsayısının kaynağı olmadığı için tahmini yük tehlike vermez; yalnızca belirgin aşırı kalabalıkta uyarır.
 const loadRatio=loadUnits/Math.max(1,aquarium.netVolumeLiters*.85); const loadScore=loadRatio>LOAD_WARNING_RATIO?60:clamp(100-loadRatio*10);
 const requiredVolume=({item,profile}:(typeof profiles)[number])=>profile!.minVolumeL+Math.max(0,item.quantity-1)*(profile!.additionalVolumePerAnimalL??0);
 const spaceIssues=profiles.filter(entry=>aquarium.netVolumeLiters<requiredVolume(entry)||(entry.profile!.minTankLengthCm!==undefined&&aquarium.lengthCm<entry.profile!.minTankLengthCm));
 const spaceScore=profiles.length?clamp(100-spaceIssues.length/profiles.length*80):100;
 const groupIssues=profiles.filter(({item,profile})=>item.quantity<profile!.minGroup); const socialScore=profiles.length?clamp(100-groupIssues.length/profiles.length*65):100;
 const tempIntersection:[number,number]=profiles.length?[Math.max(...profiles.map(x=>x.profile!.temperature[0])),Math.min(...profiles.map(x=>x.profile!.temperature[1]))]:[0,40];
 const phIntersection:[number,number]=profiles.length?[Math.max(...profiles.map(x=>x.profile!.ph[0])),Math.min(...profiles.map(x=>x.profile!.ph[1]))]:[0,14];
 const flowProfiles=profiles.filter(x=>x.profile!.flow!==undefined);
 const hasLowFlow=flowProfiles.some(x=>x.profile!.flow==="low"); const hasHighFlow=flowProfiles.some(x=>x.profile!.flow==="high");
 const temperatureConflict=tempIntersection[0]>tempIntersection[1]; const phConflict=phIntersection[0]>phIntersection[1]; const flowConflict=hasLowFlow&&hasHighFlow;
 const predationIssues=profiles.flatMap(predator=>predator.profile!.predatory?profiles.filter(prey=>prey.profile!.id!==predator.profile!.id&&prey.profile!.adultSizeCm<=predator.profile!.adultSizeCm*.4).map(prey=>({predator:predator.profile!,prey:prey.profile!})):[]);
 const speciesOnlyIssues=profiles.filter(({profile})=>profile!.speciesOnly&&profiles.some(other=>other.profile!.id!==profile!.id));
 const communityCautionIssues=profiles.filter(({profile})=>profile!.communityCaution&&profiles.some(other=>other.profile!.id!==profile!.id));
 // Ortak güvenli sıcaklık veya pH aralığı bulunmaması doğrudan tehlike seviyesidir.
 const compatibilityPenalty=(habitatIssues.length?80:0)+(temperatureConflict?55:0)+(phConflict?55:0)+(flowConflict?20:0)+(predationIssues.length?60:0)+(speciesOnlyIssues.length?60:0)+(communityCautionIssues.length?30:0); const compatibilityScore=clamp(100-compatibilityPenalty);
 const matchedEquipment=equipment.map(item=>resolver.profileForEquipment(item)).filter(profile=>profile!==undefined); const verifiedEquipment=matchedEquipment.filter(profile=>resolver.isVerifiedEquipmentProfile(profile));
 const filterEquipment=verifiedEquipment.filter(p=>p.category==="filter"); const auxiliaryFilters=filterEquipment.filter(p=>p.auxiliaryFiltration); const filters=filterEquipment.filter(p=>!p.passiveComponent); const primaryFilters=filters.filter(p=>!p.auxiliaryFiltration); const filtersWithFlow=primaryFilters.filter(p=>p.ratedFlowLph); const airDrivenFilters=primaryFilters.filter(p=>p.requiresAirPump); const airPumpsWithFlow=verifiedEquipment.filter(p=>p.category==="air_pump"&&p.ratedFlowLph); const airDrivenReady=!airDrivenFilters.length||airPumpsWithFlow.length>0; const ratedFlow=filtersWithFlow.reduce((s,p)=>s+(p.ratedFlowLph??0),0); const turnover=ratedFlow*.65/Math.max(1,aquarium.netVolumeLiters);
 const lowFlowShare=flowProfiles.length?flowProfiles.filter(x=>x.profile!.flow==="low").length/flowProfiles.length:0; const targetMax=lowFlowShare>.5?7:10;
 // Yeterlilik: her çalışan ana filtrenin karşılayabildiği hacim toplanır. Üretici hacim önerisi varsa o (tehlike sınırı 1,5 katı),
 // yoksa etiket debisinin saatte 4 çevrime (tehlike sınırı 2 çevrime) karşılık geldiği hacim kullanılır.
 // Hava motoru olmayan sünger filtre su çevirmediği için hesaba girmez.
 const runningFilters=primaryFilters.filter(p=>!p.requiresAirPump||airDrivenReady);
 const sizedFilters=runningFilters.filter(p=>p.recommendedMaxL||p.ratedFlowLph);
 const filterOkL=sizedFilters.reduce((s,p)=>s+(p.recommendedMaxL??(p.ratedFlowLph??0)/FILTER_MIN_RATED_TURNOVER),0);
 const filterLimitL=sizedFilters.reduce((s,p)=>s+(p.recommendedMaxL?p.recommendedMaxL*FILTER_OVER_CAPACITY_DANGER:(p.ratedFlowLph??0)/FILTER_DANGER_RATED_TURNOVER),0);
 const sizedByManufacturer=sizedFilters.length>0&&sizedFilters.every(p=>p.recommendedMaxL); const sizedByFlow=sizedFilters.length>0&&sizedFilters.every(p=>!p.recommendedMaxL);
 const ratedTurnover=sizedFilters.reduce((s,p)=>s+(p.ratedFlowLph??0),0)/Math.max(1,aquarium.netVolumeLiters);
 const filterFit:"ok"|"warning"|"danger"|undefined=sizedFilters.length?(aquarium.netVolumeLiters<=filterOkL?"ok":aquarium.netVolumeLiters<=filterLimitL?"warning":"danger"):undefined;
 const fitScore=!primaryFilters.length?35:filterFit?(filterFit==="ok"?95:filterFit==="warning"?60:35):airDrivenFilters.length?(airDrivenReady?80:45):60;
 const filterScore=turnover>targetMax?Math.min(fitScore,clamp(75-(turnover-targetMax)*8)):fitScore;
 const heaters=verifiedEquipment.filter(p=>p.category==="heater"||p.integratedHeaterW);
 const heaterPowerW=heaters.reduce((sum,h)=>sum+(h.integratedHeaterW??(h.category==="heater"?(h.powerW??0):0)),0);
 const manufacturerHeaterRanges=heaters.filter(h=>h.recommendedMinL||h.recommendedMaxL);
 // Oda sıcaklığı bilinmediğinde güvenli tarafta kalan geniş bir 0,5–1,5 W/L bandı kullanılır.
 // Üretici hacim aralığı varsa tek cihazda onu, birden çok cihazda toplam watt kapasitesini esas alırız.
 const estimatedHeaterRange=heaterPowerW?{min:heaterPowerW/1.5,max:heaterPowerW/.5}:undefined;
 const individualHeaterRanges=heaters.map(h=>{const watts=h.integratedHeaterW??(h.category==="heater"?h.powerW:undefined);return {min:h.recommendedMinL??(watts?watts/1.5:undefined),max:h.recommendedMaxL??(watts?watts/.5:undefined)}}).filter(h=>h.min||h.max);
 const manufacturerHeaterFit=individualHeaterRanges.some(h=>(!h.min||aquarium.netVolumeLiters>=h.min)&&(!h.max||aquarium.netVolumeLiters<=h.max));
 const useEstimatedHeaterRange=heaters.length>1||!manufacturerHeaterRanges.length;
 const heaterFit=useEstimatedHeaterRange?Boolean(estimatedHeaterRange&&aquarium.netVolumeLiters>=estimatedHeaterRange.min&&aquarium.netVolumeLiters<=estimatedHeaterRange.max):manufacturerHeaterFit;
 const heaterTooSmall=useEstimatedHeaterRange?Boolean(estimatedHeaterRange&&aquarium.netVolumeLiters>estimatedHeaterRange.max):individualHeaterRanges.every(h=>Boolean(h.max&&aquarium.netVolumeLiters>h.max));
 const heaterTooLarge=useEstimatedHeaterRange?Boolean(estimatedHeaterRange&&aquarium.netVolumeLiters<estimatedHeaterRange.min):individualHeaterRanges.every(h=>Boolean(h.min&&aquarium.netVolumeLiters<h.min));
 const heaterDataReady=manufacturerHeaterRanges.length>0||heaterPowerW>0;
 const heaterScore=heaters.length?(heaterDataReady?(heaterFit?95:45):60):profiles.some(x=>x.profile!.temperature[0]>=23)?35:75;
 const salinityProfiles=profiles.filter(({profile})=>profile!.specificGravity);
 const salinityIssues=salinityProfiles.filter(({profile})=>latest?.specificGravity!==undefined&&(latest.specificGravity<profile!.specificGravity![0]||latest.specificGravity>profile!.specificGravity![1]));
 const waterChecks=profiles.flatMap(({profile})=>latest?[latest.temperature!==undefined&&latest.temperature>=profile!.temperature[0]&&latest.temperature<=profile!.temperature[1],latest.ph!==undefined&&latest.ph>=profile!.ph[0]&&latest.ph<=profile!.ph[1],profile!.specificGravity&&latest.specificGravity!==undefined?latest.specificGravity>=profile!.specificGravity[0]&&latest.specificGravity<=profile!.specificGravity[1]:undefined].filter(x=>typeof x==="boolean") as boolean[]:[]);
 const waterQuality=assessWaterQuality(latest,aquarium.type);
 const waterQualityChecks=[waterQuality.ammonia,waterQuality.nitrite,waterQuality.nitrate].flatMap(item=>item?[item.level==="ok"]:[]);
 const allWaterChecks=[...waterChecks,...waterQualityChecks]; const waterScore=allWaterChecks.length?clamp(allWaterChecks.filter(Boolean).length/allWaterChecks.length*100):65;
 const safetyEquipment=matchedEquipment.filter(p=>!p.passiveComponent&&(p.category==="filter"||p.category==="heater"||Boolean(p.integratedHeaterW)||(airDrivenFilters.length>0&&p.category==="air_pump")));
 const calculationReadyEquipment=safetyEquipment.filter(p=>{
  if(!resolver.isVerifiedEquipmentProfile(p))return false;
  const filterReady=p.category!=="filter"||Boolean(p.ratedFlowLph)||(!p.requiresAirPump&&Boolean(p.recommendedMaxL))||(Boolean(p.requiresAirPump)&&airPumpsWithFlow.length>0);
  const airPumpReady=p.category!=="air_pump"||Boolean(p.ratedFlowLph);
  const heaterReady=!(p.category==="heater"||p.integratedHeaterW)||Boolean(p.recommendedMinL||p.recommendedMaxL||p.integratedHeaterW||(p.category==="heater"&&p.powerW));
  return filterReady&&heaterReady&&airPumpReady;
 });
 const safetyEquipmentInputCount=equipment.filter(item=>{const profile=resolver.profileForEquipment(item);return !profile?.passiveComponent&&(item.category==="filter"||item.category==="heater"||(airDrivenFilters.length>0&&item.category==="air_pump"));}).length;
 const missingCapacityEquipment=safetyEquipment.filter(profile=>!calculationReadyEquipment.some(ready=>ready.id===profile.id));
 const totalDataCount=animals.length+safetyEquipmentInputCount; const verifiedDataCount=verifiedMatchedProfiles.length+calculationReadyEquipment.length; const confidenceScore=totalDataCount?clamp(verifiedDataCount/totalDataCount*100):50;
 const metrics:HealthMetric[]=[
  {key:"load",label:"Biyolojik yük",score:loadScore,status:status(loadScore),detail:`Tahmini yük oranı %${Math.round(loadRatio*100)}`},
  {key:"space",label:"Yüzme alanı",score:spaceScore,status:status(spaceScore),detail:spaceIssues.length?`${spaceIssues.length} tür için alan sınırda`:"Kayıtlı türler için uygun"},
  {key:"social",label:"Sosyal ihtiyaç",score:socialScore,status:status(socialScore),detail:groupIssues.length?`${groupIssues.length} türün grup sayısı düşük`:"Grup ihtiyaçları uygun"},
  {key:"compatibility",label:"Tür uyumu",score:compatibilityScore,status:status(compatibilityScore),detail:habitatIssues.length?"Akvaryum türüyle yaşam ortamı uyuşmuyor":speciesOnlyIssues.length?"Tür akvaryumu önerilen canlı var":predationIssues.length?"Küçük canlılar için avlanma riski var":temperatureConflict||phConflict?"Su değeri aralıkları kesişmiyor":flowConflict?"Akıntı ihtiyaçları farklı":communityCautionIssues.length?"Tank arkadaşı seçimi dikkat gerektiriyor":"Ortak yaşam aralıkları mevcut"},
  {key:"filter",label:"Filtrasyon uygunluğu",score:filterScore,status:status(filterScore),detail:sizedByManufacturer?`Üretici önerisi en fazla ${filterOkL} L`:sizedByFlow?`Etiket debisiyle ${ratedTurnover.toFixed(1).replace(".",",")} çevrim/saat`:sizedFilters.length?`Üretici önerisi ve etiket debisine göre en fazla ${Math.round(filterOkL)} L`:airDrivenFilters.length?(airDrivenReady?"Hava motorlu sünger filtre bağlantısı hazır":"Sünger filtre için hava motoru gerekli"):primaryFilters.length?"Debi bilgisi doğrulanmayı bekliyor":auxiliaryFilters.length?"Yalnız yardımcı yüzey skimmeri kayıtlı; ana filtre gerekli":"Katalogdan filtre bulunamadı"},
  {key:"heater",label:"Isıtıcı uygunluğu",score:heaterScore,status:status(heaterScore),detail:heaterDataReady?(heaterFit?(useEstimatedHeaterRange?`Toplam ${heaterPowerW} W için tahmini hacim uygun`:"Üretici hacim aralığı uygun"):(heaterTooSmall?"Isıtma gücü bu hacim için düşük":heaterTooLarge?"Isıtma gücü bu hacim için yüksek":"Hacim aralığı dışında")):heaters.length?"Watt veya hacim verisi doğrulanmayı bekliyor":"Katalogdan ısıtıcı bulunamadı"},
  {key:"water",label:"Su değeri uyumu",score:waterScore,status:status(waterScore),detail:latest?"Son ölçüme göre":"Ölçüm eklenmesi gerekli"},
  {key:"confidence",label:"Veri güveni",score:confidenceScore,status:status(confidenceScore),detail:totalDataCount?`${verifiedDataCount}/${totalDataCount} güvenlik kaydı hesaplamaya hazır`:"Güvenlik hesabı için kayıt bulunamadı"},
 ];
 const warnings:HealthAnalysis["warnings"]=[];
 const unmatchedAnimalCount=animals.length-matchedProfiles.length; const unmatchedEquipmentCount=equipment.length-matchedEquipment.length;
 const unverifiedAnimalCount=matchedProfiles.length-verifiedMatchedProfiles.length; const unverifiedEquipmentCount=matchedEquipment.length-verifiedEquipment.length;
 const missingCapacityCount=missingCapacityEquipment.length;
 if(unmatchedAnimalCount)warnings.push({level:"warning",title:"Katalogla eşleşmeyen canlı kaydı var",message:`${unmatchedAnimalCount} canlı kaydı tanınmadığı için biyolojik yük ve uyumluluk hesabına dahil edilmedi.`});
 if(unmatchedEquipmentCount)warnings.push({level:"warning",title:"Katalogla eşleşmeyen ekipman kaydı var",message:`${unmatchedEquipmentCount} ekipmanın kapasitesi tanınmadığı için filtrasyon veya ısıtıcı hesabına dahil edilmedi.`});
 if(unverifiedAnimalCount)warnings.push({level:"warning",title:"Bazı canlı verileri doğrulanmayı bekliyor",message:`${unverifiedAnimalCount} canlı kaydı güvenlik hesabına dahil edilmedi; doğrulanmış katalog kaydı seçilmeli.`});
 if(unverifiedEquipmentCount)warnings.push({level:"warning",title:"Bazı ekipman verileri doğrulanmayı bekliyor",message:`${unverifiedEquipmentCount} ekipman kaydının teknik değerleri otomatik kapasite hesabında kullanılmadı.`});
 if(missingCapacityCount){const names=missingCapacityEquipment.slice(0,3).map(item=>`${item.brand} ${item.model}`).join(", ");const remaining=missingCapacityCount>3?` ve ${missingCapacityCount-3} ekipman daha`:"";const reason=missingCapacityCount===1&&missingCapacityEquipment[0].capacityDataNote?` ${missingCapacityEquipment[0].capacityDataNote}`:" Gerekli debi, hacim veya hava motoru bağlantısı doğrulanmalı.";warnings.push({level:"warning",title:"Ekipman kapasite bilgisi eksik",message:`${names}${remaining} güvenli kapasite hesabına alınamadı.${reason}`});}
 if(auxiliaryFilters.length&&!primaryFilters.length)warnings.push({level:"danger",title:"Ana filtre gerekli",message:"Yüzey skimmeri su yüzeyindeki filmi toplar ancak tek başına ana mekanik ve biyolojik filtrenin yerine geçmez. Katalogdan akvaryuma uygun bir ana filtre ekleyin."});
 if(airDrivenFilters.length&&!airDrivenReady)warnings.push({level:"danger",title:"Sünger filtre için hava motoru gerekli",message:"Seçilen pipo/sünger filtre kendi başına su çevirmez. Katalogdan uygun bir hava motoru ekleyin."});
 if(loadRatio>LOAD_WARNING_RATIO)warnings.push({level:"warning",title:"Biyolojik yük yüksek olabilir",message:"Tahmini canlı yükü, türlerin kaynaklarında önerilen koşulların belirgin biçimde üstünde. Canlı eklemeden önce filtrasyonu ve bakım sıklığını gözden geçir; amonyak, nitrit ve nitratı düzenli ölç."});
 if(turnover>targetMax)warnings.push({level:"warning",title:"Filtre akışı güçlü olabilir",message:`Tahmini ${turnover.toFixed(1)} çevrim/saat. Düşük akıntı seven türler için çıkışı dağıtmayı düşün.`});
 if(filterFit==="warning"||filterFit==="danger"){const volume=aquarium.netVolumeLiters;const cycles=ratedTurnover.toFixed(1).replace(".",",");if(sizedByManufacturer){const capacityText=sizedFilters.length>1?`filtrelerin üreticilerince önerilen toplam hacmin (${filterOkL} L)`:`filtrenin üreticisinin önerdiği en büyük hacmin (${filterOkL} L)`;warnings.push(filterFit==="danger"?{level:"danger",title:"Filtre bu akvaryum için küçük",message:`Akvaryumun net hacmi (${volume} L), ${capacityText} %50'den fazla üstünde. Akvaryuma uygun bir filtre ekleyin.`}:{level:"warning",title:"Filtre üretici önerisinin üstünde",message:`Akvaryumun net hacmi (${volume} L), ${capacityText} üstünde. Filtre bakımını sık yapın; canlı eklemeden önce daha büyük bir filtre düşünün.`});}else if(sizedByFlow){warnings.push(filterFit==="danger"?{level:"danger",title:"Filtre debisi yetersiz",message:`Üretici hacim önerisi olmadığı için etiket debisine bakıldı: akvaryumun suyu saatte yaklaşık ${cycles} kez dolaşıyor. Hortum ve filtre malzemesiyle gerçek debi bunun yaklaşık yarısına iner; akvaryuma uygun bir filtre ekleyin.`}:{level:"warning",title:"Filtre debisi düşük olabilir",message:`Üretici hacim önerisi olmadığı için etiket debisine bakıldı: akvaryumun suyu saatte yaklaşık ${cycles} kez dolaşıyor, önerilen en az ${FILTER_MIN_RATED_TURNOVER}. Filtre kirlendikçe gerçek debi daha da düşer.`});}else{warnings.push(filterFit==="danger"?{level:"danger",title:"Filtre bu akvaryum için küçük",message:`Akvaryumun net hacmi (${volume} L), filtrelerin üretici önerisi ve etiket debisine göre karşılayabildiği en büyük hacmin (${Math.round(filterLimitL)} L) üstünde. Akvaryuma uygun bir filtre ekleyin.`}:{level:"warning",title:"Filtre kapasitesi düşük olabilir",message:`Akvaryumun net hacmi (${volume} L), filtrelerin üretici önerisi ve etiket debisine göre uygun olduğu hacmin (${Math.round(filterOkL)} L) üstünde. Filtre bakımını sık yapın; canlı eklemeden önce daha güçlü bir filtre düşünün.`});}}
 if(heaterDataReady&&!heaterFit)warnings.push({level:heaterTooSmall?"danger":"warning",title:heaterTooSmall?"Isıtıcı gücü yetersiz olabilir":heaterTooLarge?"Isıtıcı akvaryuma göre güçlü olabilir":"Isıtıcı hacimle eşleşmiyor",message:heaterTooSmall?"Seçilen ısıtıcının üretici hacim aralığı veya watt kapasitesi bu akvaryum için düşük kalıyor.":heaterTooLarge?"Yüksek güçlü ısıtıcı küçük hacimde sıcaklığı hızlı değiştirebilir. Güvenilir termostat ve doğru konumlandırma önemlidir.":"Seçilen ısıtıcının katalog hacim aralığı bu akvaryumu kapsamıyor."});
 for(const {profile} of habitatIssues)warnings.push({level:"danger",title:profile!.commonName+": akvaryum türü uyumsuz",message:profile!.commonName+", "+(aquarium.type==="freshwater"?"tatlı su":aquarium.type==="saltwater"?"tuzlu su":"acı su")+" akvaryumunda güvenli kabul edilmez. Canlı profilinin desteklediği su türüne uygun ayrı bir akvaryum seçin."});
 if(salinityProfiles.length&&latest?.specificGravity===undefined)warnings.push({level:"warning",title:"Özgül ağırlık ölçümü gerekli",message:"Deniz canlılarının tuzluluk uyumu değerlendirilemedi. Refraktometre veya hidrometre ile özgül ağırlık ölçümü ekleyin."});
 if(salinityIssues.length)warnings.push({level:"danger",title:"Özgül ağırlık canlı aralığı dışında",message:salinityIssues.length+" canlı için son özgül ağırlık ölçümü güvenli katalog aralığının dışında."});
 const fmt=(value:number,digits=3)=>String(Number(value.toFixed(digits))).replace(".",",");
 const {ammonia,nitrite,nitrate,invalid}=waterQuality;
 if(invalid.length){const names=invalid.map(key=>({ammonia:"amonyak",nitrite:"nitrit",nitrate:"nitrat"})[key]);const list=names.length>1?`${names.slice(0,-1).join(", ")} ve ${names[names.length-1]}`:names[0];warnings.push({level:"warning",title:"Geçersiz su ölçümü",message:names.length>1?`Son ölçümdeki ${list} değerleri geçersiz (negatif ya da geçerli bir sayı değil); bu değerler değerlendirmeye alınmadı. Yeniden ölçüp kaydedin.`:`Son ölçümdeki ${list} değeri geçersiz (negatif ya da geçerli bir sayı değil); bu değer değerlendirmeye alınmadı. Yeniden ölçüp kaydedin.`});}
 if(ammonia&&ammonia.level!=="ok")warnings.push(ammonia.level==="danger"?(ammonia.worstCase?{level:"danger",title:"Amonyak zehirli olabilir",message:`Toplam amonyak ${fmt(ammonia.total)} ppm. pH veya sıcaklık ölçümü eksik ya da geçersiz olduğu için zehirli (serbest) kısmı hesaplanamadı; en kötü durumda güvenli üst sınır olan ${fmt(ammonia.limit)} ppm aşılıyor. pH ve sıcaklığı da ölçün, bu arada kısmi su değişimi yapın.`}:{level:"danger",title:"Zehirli amonyak sınırın üzerinde",message:`Ölçülen pH ve sıcaklıkta serbest (zehirli) amonyak yaklaşık ${fmt(ammonia.free,4)} ppm; güvenli üst sınır ${fmt(ammonia.limit)} ppm. Hemen kısmi su değişimi yapın, beslemeyi azaltın ve filtreyi kontrol edin.`}):{level:"warning",title:"Amonyak ölçüldü",message:`Toplam amonyak ${fmt(ammonia.total)} ppm. Olgun bir akvaryumda amonyak 0 olmalıdır; sıfırın üstündeki değerler yalnızca kısa süre tolere edilebilir. pH yükselirse zehirli kısmı hızla artar.`});
 if(nitrite&&nitrite.level!=="ok")warnings.push(nitrite.level==="danger"?{level:"danger",title:"Nitrit sınırın üzerinde",message:`Nitrit ${fmt(nitrite.value)} ppm; güvenli üst sınır ${fmt(nitrite.limit)} ppm. Hemen kısmi su değişimi yapın ve filtreyi kontrol edin.`}:{level:"warning",title:"Nitrit ölçüldü",message:`Nitrit ${fmt(nitrite.value)} ppm. Nitrit 0 olmalıdır; sıfırın üstündeki değerler yalnızca kısa süre tolere edilebilir.`});
 if(nitrate&&nitrate.level!=="ok")warnings.push(nitrate.level==="danger"?{level:"danger",title:"Nitrat çok yüksek",message:aquarium.type==="saltwater"?`Nitrat ${fmt(nitrate.value)} ppm; deniz akvaryumu için üst sınır 100 ppm. Su değişimini artırın.`:`Nitrat ${fmt(nitrate.value)} ppm. Musluk suyu yasal olarak en fazla 50 ppm nitrat içerebildiği için önerilen sınır (musluk suyunun en fazla 50 ppm üstü) aşılmış. Su değişimini artırın.`}:{level:"warning",title:"Nitrat yüksek olabilir",message:`Nitrat ${fmt(nitrate.value)} ppm. Önerilen sınır musluk suyunun en fazla 50 ppm üstüdür; musluk suyunun nitratını da ölçün ve su değişimini artırın.`});
 if(temperatureConflict)warnings.push({level:"danger",title:"Türlerin sıcaklık ihtiyaçları uyuşmuyor",message:"Seçilen canlılar için ortak ve güvenli bir sıcaklık aralığı bulunamadı."});
 if(phConflict)warnings.push({level:"danger",title:"Türlerin pH ihtiyaçları uyuşmuyor",message:"Seçilen canlılar için ortak ve güvenli bir pH aralığı bulunamadı."});
 if(flowConflict)warnings.push({level:"warning",title:"Akıntı ihtiyaçları farklı",message:"Düşük ve yüksek akıntı isteyen türler birlikte seçildi. Akvaryumda sakin ve güçlü akış bölgeleri oluşturulmalı."});
 for(const {predator,prey} of predationIssues)warnings.push({level:"danger",title:`${prey.commonName} için avlanma riski`,message:`${predator.commonName}, yetişkin boy farkı nedeniyle ${prey.commonName} için güvenli bir tank arkadaşı olmayabilir.`});
 for(const {profile} of speciesOnlyIssues)warnings.push({level:"danger",title:`${profile!.commonName} için tür akvaryumu önerilir`,message:"Bu tür agresiflik ve özel beslenme davranışları nedeniyle başka canlılarla birlikte güvenli kabul edilmedi."});
 for(const {profile} of communityCautionIssues)warnings.push({level:"warning",title:`${profile!.commonName}: tank arkadaşı seçimine dikkat`,message:profile!.communityCaution!});
 for(const {profile} of profiles.filter(({profile})=>profile!.husbandryCaution))warnings.push({level:"warning",title:`${profile!.commonName}: özel bakım gereksinimi`,message:profile!.husbandryCaution!});
 for(const {profile} of profiles.filter(({profile})=>profile!.tankLengthDataNote))warnings.push({level:"warning",title:`${profile!.commonName}: tank uzunluğu verisi sınırlı`,message:profile!.tankLengthDataNote!});
 for(const {item,profile} of groupIssues)warnings.push({level:"warning",title:`${profile!.commonName}: grup sayısı düşük`,message:`Kayıtlı adet ${item.quantity}; katalog önerisi en az ${profile!.minGroup}.`});
 for(const entry of spaceIssues){const {profile}=entry;const volume=requiredVolume(entry);warnings.push({level:"warning",title:`${profile!.commonName}: alan sınırda`,message:profile!.minTankLengthCm===undefined?`Kayıtlı adet için minimum ${volume} L referansı kullanıldı; kaynak tank uzunluğu yayımlamıyor.`:`Kayıtlı adet için minimum ${volume} L ve ${profile!.minTankLengthCm} cm uzunluk referansı kullanıldı.`});}
 // Kesin tehlikeler (yanlış su türü, kesişmeyen sıcaklık veya pH, avlanma, tür akvaryumu, tuzluluk, zehirli
 // amonyak veya nitrit) genel durumu "tehlike"ye çeker; sekiz ölçütün ortalaması bunları gizleyemez.
 // Diğer tehlike uyarıları (ör. üretici önerisini çok aşan filtre, yetersiz ısıtıcı) genel durumu "tehlike"ye
 // çekmez ama "iyi" görünmesini de engeller: genel puan en fazla "dikkat" olur.
 const criticalDanger=habitatIssues.length>0||temperatureConflict||phConflict||predationIssues.length>0||speciesOnlyIssues.length>0||salinityIssues.length>0||ammonia?.level==="danger"||nitrite?.level==="danger";
 const dangerWarning=warnings.some(warning=>warning.level==="danger");
 const averageScore=clamp(metrics.reduce((s,m)=>s+m.score,0)/metrics.length); const score=criticalDanger?Math.min(averageScore,49):dangerWarning?Math.min(averageScore,DANGER_WARNING_SCORE_CAP):averageScore; return {score,status:status(score),metrics,warnings};
 };
}
