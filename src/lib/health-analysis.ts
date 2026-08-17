import { profileForEquipment, speciesForLivestock } from "@/data/catalog";
import type { Aquarium, Equipment, Livestock, WaterParameters } from "@/types/aquarium";

export interface HealthMetric { key:string; label:string; score:number; status:"good"|"warning"|"danger"; detail:string; }
export interface HealthAnalysis { score:number; status:"good"|"warning"|"danger"; metrics:HealthMetric[]; warnings:Array<{level:"warning"|"danger";title:string;message:string}>; }
const clamp=(n:number)=>Math.max(0,Math.min(100,Math.round(n)));
const status=(score:number):HealthMetric["status"]=>score>=75?"good":score>=50?"warning":"danger";

export function analyzeAquarium(aquarium:Aquarium,animals:Livestock[],equipment:Equipment[],latest?:WaterParameters):HealthAnalysis{
 const profiles=animals.map(item=>({item,profile:speciesForLivestock(item)})).filter(x=>x.profile);
 const loadUnits=profiles.reduce((sum,{item,profile})=>sum+item.quantity*profile!.adultSizeCm*profile!.wasteFactor,0);
 const loadRatio=loadUnits/Math.max(1,aquarium.netVolumeLiters*.85); const loadScore=clamp(100-loadRatio*55);
 const spaceIssues=profiles.filter(({profile})=>aquarium.netVolumeLiters<profile!.minVolumeL||aquarium.lengthCm<profile!.minTankLengthCm);
 const spaceScore=profiles.length?clamp(100-spaceIssues.length/profiles.length*80):100;
 const groupIssues=profiles.filter(({item,profile})=>item.quantity<profile!.minGroup); const socialScore=profiles.length?clamp(100-groupIssues.length/profiles.length*65):100;
 const filters=equipment.map(profileForEquipment).filter(p=>p?.category==="filter"); const filtersWithFlow=filters.filter(p=>p?.ratedFlowLph); const ratedFlow=filtersWithFlow.reduce((s,p)=>s+(p?.ratedFlowLph??0),0); const turnover=ratedFlow*.65/Math.max(1,aquarium.netVolumeLiters);
 const lowFlowShare=profiles.length?profiles.filter(x=>x.profile!.flow==="low").length/profiles.length:0; const targetMin=lowFlowShare>.5?3:5; const targetMax=lowFlowShare>.5?7:10;
 const filterScore=!filters.length?35:!filtersWithFlow.length?60:turnover<targetMin?clamp(70-(targetMin-turnover)*15):turnover>targetMax?clamp(75-(turnover-targetMax)*8):95;
 const heaters=equipment.map(profileForEquipment).filter(p=>p?.category==="heater"); const heaterFit=heaters.some(h=>(!h?.recommendedMinL||aquarium.netVolumeLiters>=h.recommendedMinL)&&(!h?.recommendedMaxL||aquarium.netVolumeLiters<=h.recommendedMaxL)); const heaterScore=heaters.length?(heaterFit?95:45):profiles.some(x=>x.profile!.temperature[0]>=23)?35:75;
 const waterChecks=profiles.flatMap(({profile})=>latest?[latest.temperature!==undefined&&latest.temperature>=profile!.temperature[0]&&latest.temperature<=profile!.temperature[1],latest.ph!==undefined&&latest.ph>=profile!.ph[0]&&latest.ph<=profile!.ph[1]].filter(x=>typeof x==="boolean") as boolean[]:[]); const waterScore=waterChecks.length?clamp(waterChecks.filter(Boolean).length/waterChecks.length*100):65;
 const metrics:HealthMetric[]=[
  {key:"load",label:"Biyolojik yük",score:loadScore,status:status(loadScore),detail:`Tahmini yük oranı %${Math.round(loadRatio*100)}`},
  {key:"space",label:"Yüzme alanı",score:spaceScore,status:status(spaceScore),detail:spaceIssues.length?`${spaceIssues.length} tür için alan sınırda`:"Kayıtlı türler için uygun"},
  {key:"social",label:"Sosyal ihtiyaç",score:socialScore,status:status(socialScore),detail:groupIssues.length?`${groupIssues.length} türün grup sayısı düşük`:"Grup ihtiyaçları uygun"},
  {key:"filter",label:"Filtrasyon uygunluğu",score:filterScore,status:status(filterScore),detail:filtersWithFlow.length?`Tahmini ${turnover.toFixed(1)} çevrim/saat`:filters.length?"Debi bilgisi doğrulanmayı bekliyor":"Katalogdan filtre bulunamadı"},
  {key:"heater",label:"Isıtıcı uygunluğu",score:heaterScore,status:status(heaterScore),detail:heaters.length?(heaterFit?"Hacim aralığı uygun":"Hacim aralığı dışında"):"Katalogdan ısıtıcı bulunamadı"},
  {key:"water",label:"Su değeri uyumu",score:waterScore,status:status(waterScore),detail:latest?"Son ölçüme göre":"Ölçüm eklenmesi gerekli"},
 ];
 const warnings:HealthAnalysis["warnings"]=[];
 if(loadScore<75)warnings.push({level:loadScore<50?"danger":"warning",title:"Biyolojik yük yüksek olabilir",message:"Canlı eklemeden önce filtrasyon ve bakım sıklığını gözden geçir."});
 if(turnover>targetMax)warnings.push({level:"warning",title:"Filtre akışı güçlü olabilir",message:`Tahmini ${turnover.toFixed(1)} çevrim/saat. Düşük akıntı seven türler için çıkışı dağıtmayı düşün.`});
 if(filtersWithFlow.length&&turnover<targetMin)warnings.push({level:"danger",title:"Filtrasyon sınırda",message:"Tahmini filtre çevrimi mevcut canlı yükü için düşük görünüyor."});
 if(heaters.length&&!heaterFit)warnings.push({level:"warning",title:"Isıtıcı hacimle eşleşmiyor",message:"Seçilen ısıtıcının katalog hacim aralığı bu akvaryumu kapsamıyor."});
 for(const {item,profile} of groupIssues)warnings.push({level:"warning",title:`${profile!.commonName}: grup sayısı düşük`,message:`Kayıtlı adet ${item.quantity}; katalog önerisi en az ${profile!.minGroup}.`});
 for(const {profile} of spaceIssues)warnings.push({level:"warning",title:`${profile!.commonName}: alan sınırda`,message:`Minimum ${profile!.minVolumeL} L ve ${profile!.minTankLengthCm} cm uzunluk referansı kullanıldı.`});
 const score=clamp(metrics.reduce((s,m)=>s+m.score,0)/metrics.length); return {score,status:status(score),metrics,warnings};
}
