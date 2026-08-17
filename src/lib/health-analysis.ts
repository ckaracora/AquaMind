import { isVerifiedEquipmentProfile, isVerifiedSpeciesProfile, profileForEquipment, speciesForLivestock } from "@/data/catalog";
import type { Aquarium, Equipment, Livestock, WaterParameters } from "@/types/aquarium";

export interface HealthMetric { key:string; label:string; score:number; status:"good"|"warning"|"danger"; detail:string; }
export interface HealthAnalysis { score:number; status:"good"|"warning"|"danger"; metrics:HealthMetric[]; warnings:Array<{level:"warning"|"danger";title:string;message:string}>; }
const clamp=(n:number)=>Math.max(0,Math.min(100,Math.round(n)));
const status=(score:number):HealthMetric["status"]=>score>=75?"good":score>=50?"warning":"danger";

export function analyzeAquarium(aquarium:Aquarium,animals:Livestock[],equipment:Equipment[],latest?:WaterParameters):HealthAnalysis{
 const matchedProfiles=animals.map(item=>({item,profile:speciesForLivestock(item)})).filter(x=>x.profile);
 const profiles=matchedProfiles.filter(x=>isVerifiedSpeciesProfile(x.profile));
 const loadUnits=profiles.reduce((sum,{item,profile})=>sum+item.quantity*profile!.adultSizeCm*profile!.wasteFactor,0);
 const loadRatio=loadUnits/Math.max(1,aquarium.netVolumeLiters*.85); const loadScore=clamp(100-loadRatio*55);
 const spaceIssues=profiles.filter(({profile})=>aquarium.netVolumeLiters<profile!.minVolumeL||aquarium.lengthCm<profile!.minTankLengthCm);
 const spaceScore=profiles.length?clamp(100-spaceIssues.length/profiles.length*80):100;
 const groupIssues=profiles.filter(({item,profile})=>item.quantity<profile!.minGroup); const socialScore=profiles.length?clamp(100-groupIssues.length/profiles.length*65):100;
 const tempIntersection:[number,number]=profiles.length?[Math.max(...profiles.map(x=>x.profile!.temperature[0])),Math.min(...profiles.map(x=>x.profile!.temperature[1]))]:[0,40];
 const phIntersection:[number,number]=profiles.length?[Math.max(...profiles.map(x=>x.profile!.ph[0])),Math.min(...profiles.map(x=>x.profile!.ph[1]))]:[0,14];
 const hasLowFlow=profiles.some(x=>x.profile!.flow==="low"); const hasHighFlow=profiles.some(x=>x.profile!.flow==="high");
 const temperatureConflict=tempIntersection[0]>tempIntersection[1]; const phConflict=phIntersection[0]>phIntersection[1]; const flowConflict=hasLowFlow&&hasHighFlow;
 const compatibilityPenalty=(temperatureConflict?40:0)+(phConflict?35:0)+(flowConflict?20:0); const compatibilityScore=clamp(100-compatibilityPenalty);
 const matchedEquipment=equipment.map(profileForEquipment).filter(Boolean); const verifiedEquipment=matchedEquipment.filter(isVerifiedEquipmentProfile);
 const filters=verifiedEquipment.filter(p=>p.category==="filter"); const filtersWithFlow=filters.filter(p=>p.ratedFlowLph); const ratedFlow=filtersWithFlow.reduce((s,p)=>s+(p.ratedFlowLph??0),0); const turnover=ratedFlow*.65/Math.max(1,aquarium.netVolumeLiters);
 const lowFlowShare=profiles.length?profiles.filter(x=>x.profile!.flow==="low").length/profiles.length:0; const loadBoost=Math.min(3,Math.max(0,(loadRatio-1)*2)); const targetMin=(lowFlowShare>.5?3:5)+loadBoost; const targetMax=(lowFlowShare>.5?7:10)+loadBoost;
 const filterScore=!filters.length?35:!filtersWithFlow.length?60:turnover<targetMin?clamp(70-(targetMin-turnover)*15):turnover>targetMax?clamp(75-(turnover-targetMax)*8):95;
 const heaters=verifiedEquipment.filter(p=>p.category==="heater"||p.integratedHeaterW); const heatersWithRange=heaters.filter(h=>h.recommendedMinL||h.recommendedMaxL); const heaterFit=heatersWithRange.some(h=>(!h.recommendedMinL||aquarium.netVolumeLiters>=h.recommendedMinL)&&(!h.recommendedMaxL||aquarium.netVolumeLiters<=h.recommendedMaxL)); const heaterScore=heaters.length?(heatersWithRange.length?(heaterFit?95:45):60):profiles.some(x=>x.profile!.temperature[0]>=23)?35:75;
 const waterChecks=profiles.flatMap(({profile})=>latest?[latest.temperature!==undefined&&latest.temperature>=profile!.temperature[0]&&latest.temperature<=profile!.temperature[1],latest.ph!==undefined&&latest.ph>=profile!.ph[0]&&latest.ph<=profile!.ph[1]].filter(x=>typeof x==="boolean") as boolean[]:[]); const waterScore=waterChecks.length?clamp(waterChecks.filter(Boolean).length/waterChecks.length*100):65;
 const totalDataCount=animals.length+equipment.length; const verifiedDataCount=profiles.length+verifiedEquipment.length; const confidenceScore=totalDataCount?clamp(verifiedDataCount/totalDataCount*100):50;
 const metrics:HealthMetric[]=[
  {key:"load",label:"Biyolojik yük",score:loadScore,status:status(loadScore),detail:`Tahmini yük oranı %${Math.round(loadRatio*100)}`},
  {key:"space",label:"Yüzme alanı",score:spaceScore,status:status(spaceScore),detail:spaceIssues.length?`${spaceIssues.length} tür için alan sınırda`:"Kayıtlı türler için uygun"},
  {key:"social",label:"Sosyal ihtiyaç",score:socialScore,status:status(socialScore),detail:groupIssues.length?`${groupIssues.length} türün grup sayısı düşük`:"Grup ihtiyaçları uygun"},
  {key:"compatibility",label:"Tür uyumu",score:compatibilityScore,status:status(compatibilityScore),detail:temperatureConflict||phConflict?"Su değeri aralıkları kesişmiyor":flowConflict?"Akıntı ihtiyaçları farklı":"Ortak yaşam aralıkları mevcut"},
  {key:"filter",label:"Filtrasyon uygunluğu",score:filterScore,status:status(filterScore),detail:filtersWithFlow.length?`Tahmini ${turnover.toFixed(1)} çevrim/saat`:filters.length?"Debi bilgisi doğrulanmayı bekliyor":"Katalogdan filtre bulunamadı"},
  {key:"heater",label:"Isıtıcı uygunluğu",score:heaterScore,status:status(heaterScore),detail:heatersWithRange.length?(heaterFit?"Hacim aralığı uygun":"Hacim aralığı dışında"):heaters.length?"Hacim aralığı doğrulanmayı bekliyor":"Katalogdan ısıtıcı bulunamadı"},
  {key:"water",label:"Su değeri uyumu",score:waterScore,status:status(waterScore),detail:latest?"Son ölçüme göre":"Ölçüm eklenmesi gerekli"},
  {key:"confidence",label:"Veri güveni",score:confidenceScore,status:status(confidenceScore),detail:totalDataCount?`${verifiedDataCount}/${totalDataCount} kayıt kaynak doğrulamalı`:"Katalog kaydı bulunamadı"},
 ];
 const warnings:HealthAnalysis["warnings"]=[];
 const unmatchedAnimalCount=animals.length-matchedProfiles.length; const unmatchedEquipmentCount=equipment.length-matchedEquipment.length;
 const unverifiedAnimalCount=matchedProfiles.length-profiles.length; const unverifiedEquipmentCount=matchedEquipment.length-verifiedEquipment.length;
 if(unmatchedAnimalCount)warnings.push({level:"warning",title:"Katalogla eşleşmeyen canlı kaydı var",message:`${unmatchedAnimalCount} canlı kaydı tanınmadığı için biyolojik yük ve uyumluluk hesabına dahil edilmedi.`});
 if(unmatchedEquipmentCount)warnings.push({level:"warning",title:"Katalogla eşleşmeyen ekipman kaydı var",message:`${unmatchedEquipmentCount} ekipmanın kapasitesi tanınmadığı için filtrasyon veya ısıtıcı hesabına dahil edilmedi.`});
 if(unverifiedAnimalCount)warnings.push({level:"warning",title:"Bazı canlı verileri doğrulanmayı bekliyor",message:`${unverifiedAnimalCount} canlı kaydı güvenlik hesabına dahil edilmedi; doğrulanmış katalog kaydı seçilmeli.`});
 if(unverifiedEquipmentCount)warnings.push({level:"warning",title:"Bazı ekipman verileri doğrulanmayı bekliyor",message:`${unverifiedEquipmentCount} ekipman kaydının teknik değerleri otomatik kapasite hesabında kullanılmadı.`});
 if(loadScore<75)warnings.push({level:loadScore<50?"danger":"warning",title:"Biyolojik yük yüksek olabilir",message:"Canlı eklemeden önce filtrasyon ve bakım sıklığını gözden geçir."});
 if(turnover>targetMax)warnings.push({level:"warning",title:"Filtre akışı güçlü olabilir",message:`Tahmini ${turnover.toFixed(1)} çevrim/saat. Düşük akıntı seven türler için çıkışı dağıtmayı düşün.`});
 if(filtersWithFlow.length&&turnover<targetMin)warnings.push({level:"danger",title:"Filtrasyon sınırda",message:"Tahmini filtre çevrimi mevcut canlı yükü için düşük görünüyor."});
 if(heatersWithRange.length&&!heaterFit)warnings.push({level:"warning",title:"Isıtıcı hacimle eşleşmiyor",message:"Seçilen ısıtıcının katalog hacim aralığı bu akvaryumu kapsamıyor."});
 if(temperatureConflict)warnings.push({level:"danger",title:"Türlerin sıcaklık ihtiyaçları uyuşmuyor",message:"Seçilen canlılar için ortak ve güvenli bir sıcaklık aralığı bulunamadı."});
 if(phConflict)warnings.push({level:"danger",title:"Türlerin pH ihtiyaçları uyuşmuyor",message:"Seçilen canlılar için ortak ve güvenli bir pH aralığı bulunamadı."});
 if(flowConflict)warnings.push({level:"warning",title:"Akıntı ihtiyaçları farklı",message:"Düşük ve yüksek akıntı isteyen türler birlikte seçildi. Akvaryumda sakin ve güçlü akış bölgeleri oluşturulmalı."});
 for(const {item,profile} of groupIssues)warnings.push({level:"warning",title:`${profile!.commonName}: grup sayısı düşük`,message:`Kayıtlı adet ${item.quantity}; katalog önerisi en az ${profile!.minGroup}.`});
 for(const {profile} of spaceIssues)warnings.push({level:"warning",title:`${profile!.commonName}: alan sınırda`,message:`Minimum ${profile!.minVolumeL} L ve ${profile!.minTankLengthCm} cm uzunluk referansı kullanıldı.`});
 const score=clamp(metrics.reduce((s,m)=>s+m.score,0)/metrics.length); return {score,status:status(score),metrics,warnings};
}
