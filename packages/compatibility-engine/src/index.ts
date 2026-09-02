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
import type { Aquarium, Equipment, Livestock, WaterParameters } from "@aquamind/domain";

export { ENGINE_VERSION, RULESET_VERSION } from "./version";

/** Motorun bir canlı profilinden okuduğu alanlar. Katalogdaki SpeciesProfile bunu yapısal olarak karşılar. */
export interface SpeciesProfileInput {
  id: string;
  commonName: string;
  adultSizeCm: number;
  minVolumeL: number;
  minTankLengthCm: number;
  minGroup: number;
  temperature: [number, number];
  ph: [number, number];
  flow: "low" | "medium" | "high";
  wasteFactor: number;
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
 const loadUnits=profiles.reduce((sum,{item,profile})=>sum+item.quantity*profile!.adultSizeCm*profile!.wasteFactor,0);
 const loadRatio=loadUnits/Math.max(1,aquarium.netVolumeLiters*.85); const loadScore=clamp(100-loadRatio*55);
 const spaceIssues=profiles.filter(({profile})=>aquarium.netVolumeLiters<profile!.minVolumeL||aquarium.lengthCm<profile!.minTankLengthCm);
 const spaceScore=profiles.length?clamp(100-spaceIssues.length/profiles.length*80):100;
 const groupIssues=profiles.filter(({item,profile})=>item.quantity<profile!.minGroup); const socialScore=profiles.length?clamp(100-groupIssues.length/profiles.length*65):100;
 const tempIntersection:[number,number]=profiles.length?[Math.max(...profiles.map(x=>x.profile!.temperature[0])),Math.min(...profiles.map(x=>x.profile!.temperature[1]))]:[0,40];
 const phIntersection:[number,number]=profiles.length?[Math.max(...profiles.map(x=>x.profile!.ph[0])),Math.min(...profiles.map(x=>x.profile!.ph[1]))]:[0,14];
 const hasLowFlow=profiles.some(x=>x.profile!.flow==="low"); const hasHighFlow=profiles.some(x=>x.profile!.flow==="high");
 const temperatureConflict=tempIntersection[0]>tempIntersection[1]; const phConflict=phIntersection[0]>phIntersection[1]; const flowConflict=hasLowFlow&&hasHighFlow;
 const predationIssues=profiles.flatMap(predator=>predator.profile!.predatory?profiles.filter(prey=>prey.profile!.id!==predator.profile!.id&&prey.profile!.adultSizeCm<=predator.profile!.adultSizeCm*.4).map(prey=>({predator:predator.profile!,prey:prey.profile!})):[]);
 const speciesOnlyIssues=profiles.filter(({profile})=>profile!.speciesOnly&&profiles.some(other=>other.profile!.id!==profile!.id));
 const communityCautionIssues=profiles.filter(({profile})=>profile!.communityCaution&&profiles.some(other=>other.profile!.id!==profile!.id));
 // Ortak güvenli sıcaklık veya pH aralığı bulunmaması doğrudan tehlike seviyesidir.
 const compatibilityPenalty=(temperatureConflict?55:0)+(phConflict?55:0)+(flowConflict?20:0)+(predationIssues.length?60:0)+(speciesOnlyIssues.length?60:0)+(communityCautionIssues.length?30:0); const compatibilityScore=clamp(100-compatibilityPenalty);
 const matchedEquipment=equipment.map(item=>resolver.profileForEquipment(item)).filter(profile=>profile!==undefined); const verifiedEquipment=matchedEquipment.filter(profile=>resolver.isVerifiedEquipmentProfile(profile));
 const filters=verifiedEquipment.filter(p=>p.category==="filter"); const filtersWithFlow=filters.filter(p=>p.ratedFlowLph); const airDrivenFilters=filters.filter(p=>p.requiresAirPump); const airPumpsWithFlow=verifiedEquipment.filter(p=>p.category==="air_pump"&&p.ratedFlowLph); const airDrivenReady=!airDrivenFilters.length||airPumpsWithFlow.length>0; const ratedFlow=filtersWithFlow.reduce((s,p)=>s+(p.ratedFlowLph??0),0); const turnover=ratedFlow*.65/Math.max(1,aquarium.netVolumeLiters);
 const lowFlowShare=profiles.length?profiles.filter(x=>x.profile!.flow==="low").length/profiles.length:0; const loadBoost=Math.min(3,Math.max(0,(loadRatio-1)*2)); const targetMin=(lowFlowShare>.5?3:5)+loadBoost; const targetMax=(lowFlowShare>.5?7:10)+loadBoost;
 const filterScore=!filters.length?35:!filtersWithFlow.length?(airDrivenFilters.length?(airDrivenReady?80:45):60):turnover<targetMin?clamp(70-(targetMin-turnover)*15):turnover>targetMax?clamp(75-(turnover-targetMax)*8):95;
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
 const waterChecks=profiles.flatMap(({profile})=>latest?[latest.temperature!==undefined&&latest.temperature>=profile!.temperature[0]&&latest.temperature<=profile!.temperature[1],latest.ph!==undefined&&latest.ph>=profile!.ph[0]&&latest.ph<=profile!.ph[1]].filter(x=>typeof x==="boolean") as boolean[]:[]); const waterScore=waterChecks.length?clamp(waterChecks.filter(Boolean).length/waterChecks.length*100):65;
 const safetyEquipment=matchedEquipment.filter(p=>p.category==="filter"||p.category==="heater"||Boolean(p.integratedHeaterW)||(airDrivenFilters.length>0&&p.category==="air_pump"));
 const calculationReadyEquipment=safetyEquipment.filter(p=>{
  if(!resolver.isVerifiedEquipmentProfile(p))return false;
  const filterReady=p.category!=="filter"||Boolean(p.ratedFlowLph)||(Boolean(p.requiresAirPump)&&airPumpsWithFlow.length>0);
  const airPumpReady=p.category!=="air_pump"||Boolean(p.ratedFlowLph);
  const heaterReady=!(p.category==="heater"||p.integratedHeaterW)||Boolean(p.recommendedMinL||p.recommendedMaxL||p.integratedHeaterW||(p.category==="heater"&&p.powerW));
  return filterReady&&heaterReady&&airPumpReady;
 });
 const safetyEquipmentInputCount=equipment.filter(item=>item.category==="filter"||item.category==="heater"||(airDrivenFilters.length>0&&item.category==="air_pump")).length;
 const missingCapacityEquipment=safetyEquipment.filter(profile=>!calculationReadyEquipment.some(ready=>ready.id===profile.id));
 const totalDataCount=animals.length+safetyEquipmentInputCount; const verifiedDataCount=verifiedMatchedProfiles.length+calculationReadyEquipment.length; const confidenceScore=totalDataCount?clamp(verifiedDataCount/totalDataCount*100):50;
 const metrics:HealthMetric[]=[
  {key:"load",label:"Biyolojik yük",score:loadScore,status:status(loadScore),detail:`Tahmini yük oranı %${Math.round(loadRatio*100)}`},
  {key:"space",label:"Yüzme alanı",score:spaceScore,status:status(spaceScore),detail:spaceIssues.length?`${spaceIssues.length} tür için alan sınırda`:"Kayıtlı türler için uygun"},
  {key:"social",label:"Sosyal ihtiyaç",score:socialScore,status:status(socialScore),detail:groupIssues.length?`${groupIssues.length} türün grup sayısı düşük`:"Grup ihtiyaçları uygun"},
  {key:"compatibility",label:"Tür uyumu",score:compatibilityScore,status:status(compatibilityScore),detail:speciesOnlyIssues.length?"Tür akvaryumu önerilen canlı var":predationIssues.length?"Küçük canlılar için avlanma riski var":temperatureConflict||phConflict?"Su değeri aralıkları kesişmiyor":flowConflict?"Akıntı ihtiyaçları farklı":communityCautionIssues.length?"Tank arkadaşı seçimi dikkat gerektiriyor":"Ortak yaşam aralıkları mevcut"},
  {key:"filter",label:"Filtrasyon uygunluğu",score:filterScore,status:status(filterScore),detail:filtersWithFlow.length?`Tahmini ${turnover.toFixed(1)} çevrim/saat`:airDrivenFilters.length?(airDrivenReady?"Hava motorlu sünger filtre bağlantısı hazır":"Sünger filtre için hava motoru gerekli"):filters.length?"Debi bilgisi doğrulanmayı bekliyor":"Katalogdan filtre bulunamadı"},
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
 if(missingCapacityCount){const names=missingCapacityEquipment.slice(0,3).map(item=>`${item.brand} ${item.model}`).join(", ");const remaining=missingCapacityCount>3?` ve ${missingCapacityCount-3} ekipman daha`:"";warnings.push({level:"warning",title:"Ekipman kapasite bilgisi eksik",message:`${names}${remaining} güvenli kapasite hesabına alınamadı. Gerekli debi, hacim veya hava motoru bağlantısı doğrulanmalı.`});}
 if(airDrivenFilters.length&&!airDrivenReady)warnings.push({level:"danger",title:"Sünger filtre için hava motoru gerekli",message:"Seçilen pipo/sünger filtre kendi başına su çevirmez. Katalogdan uygun bir hava motoru ekleyin."});
 if(loadScore<75)warnings.push({level:loadScore<50?"danger":"warning",title:"Biyolojik yük yüksek olabilir",message:"Canlı eklemeden önce filtrasyon ve bakım sıklığını gözden geçir."});
 if(turnover>targetMax)warnings.push({level:"warning",title:"Filtre akışı güçlü olabilir",message:`Tahmini ${turnover.toFixed(1)} çevrim/saat. Düşük akıntı seven türler için çıkışı dağıtmayı düşün.`});
 if(filtersWithFlow.length&&turnover<targetMin)warnings.push({level:"danger",title:"Filtrasyon sınırda",message:"Tahmini filtre çevrimi mevcut canlı yükü için düşük görünüyor."});
 if(heaterDataReady&&!heaterFit)warnings.push({level:heaterTooSmall?"danger":"warning",title:heaterTooSmall?"Isıtıcı gücü yetersiz olabilir":heaterTooLarge?"Isıtıcı akvaryuma göre güçlü olabilir":"Isıtıcı hacimle eşleşmiyor",message:heaterTooSmall?"Seçilen ısıtıcının üretici hacim aralığı veya watt kapasitesi bu akvaryum için düşük kalıyor.":heaterTooLarge?"Yüksek güçlü ısıtıcı küçük hacimde sıcaklığı hızlı değiştirebilir. Güvenilir termostat ve doğru konumlandırma önemlidir.":"Seçilen ısıtıcının katalog hacim aralığı bu akvaryumu kapsamıyor."});
 if(temperatureConflict)warnings.push({level:"danger",title:"Türlerin sıcaklık ihtiyaçları uyuşmuyor",message:"Seçilen canlılar için ortak ve güvenli bir sıcaklık aralığı bulunamadı."});
 if(phConflict)warnings.push({level:"danger",title:"Türlerin pH ihtiyaçları uyuşmuyor",message:"Seçilen canlılar için ortak ve güvenli bir pH aralığı bulunamadı."});
 if(flowConflict)warnings.push({level:"warning",title:"Akıntı ihtiyaçları farklı",message:"Düşük ve yüksek akıntı isteyen türler birlikte seçildi. Akvaryumda sakin ve güçlü akış bölgeleri oluşturulmalı."});
 for(const {predator,prey} of predationIssues)warnings.push({level:"danger",title:`${prey.commonName} için avlanma riski`,message:`${predator.commonName}, yetişkin boy farkı nedeniyle ${prey.commonName} için güvenli bir tank arkadaşı olmayabilir.`});
 for(const {profile} of speciesOnlyIssues)warnings.push({level:"danger",title:`${profile!.commonName} için tür akvaryumu önerilir`,message:"Bu tür agresiflik ve özel beslenme davranışları nedeniyle başka canlılarla birlikte güvenli kabul edilmedi."});
 for(const {profile} of communityCautionIssues)warnings.push({level:"warning",title:`${profile!.commonName}: tank arkadaşı seçimine dikkat`,message:profile!.communityCaution!});
 for(const {profile} of profiles.filter(({profile})=>profile!.husbandryCaution))warnings.push({level:"warning",title:`${profile!.commonName}: özel bakım gereksinimi`,message:profile!.husbandryCaution!});
 for(const {item,profile} of groupIssues)warnings.push({level:"warning",title:`${profile!.commonName}: grup sayısı düşük`,message:`Kayıtlı adet ${item.quantity}; katalog önerisi en az ${profile!.minGroup}.`});
 for(const {profile} of spaceIssues)warnings.push({level:"warning",title:`${profile!.commonName}: alan sınırda`,message:`Minimum ${profile!.minVolumeL} L ve ${profile!.minTankLengthCm} cm uzunluk referansı kullanıldı.`});
 const score=clamp(metrics.reduce((s,m)=>s+m.score,0)/metrics.length); return {score,status:status(score),metrics,warnings};
 };
}
