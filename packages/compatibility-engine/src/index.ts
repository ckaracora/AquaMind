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
export * from "./plants";
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
  /** Kaynaklı davranış bilgisi (kural seti 1.4.0). Yoksa davranış uyarısı üretilmez; bu "sorun yok" anlamına gelmez. */
  behavior?: SpeciesBehaviorInput;
}

/** Bir davranışın kaynağı. `conflict` ise kaynaklar çelişir ve kesin uyarı üretilmez. */
export interface BehaviorNote {
  source: string;
  /** Kaynağın koşulu (ör. grup büyüklüğü); kullanıcıya gösterilebilir. */
  condition?: string;
  conflict?: boolean;
  /** Yalnızca eatsSmallFish: kaynağın açıkça verdiği en büyük av boyu (cm); %40 kuralından küçükse o geçerlidir. */
  maxPreyCm?: number;
}

export interface SpeciesBehaviorInput {
  /** Başka balıkların yüzgeçlerini ısırır. */
  finNipper?: BehaviorNote;
  /** Uzun ya da yavaş yüzgeçli; ısıranların hedefi olur. */
  finNipTarget?: BehaviorNote;
  /** Cüce karidesleri yer. */
  eatsShrimp?: BehaviorNote;
  /** Kaynağa göre cüce karideslerle güvenli (yavrular için koşul olabilir). */
  shrimpSafe?: BehaviorNote;
  /** Salyangoz yer (kural seti 1.7.0). */
  eatsSnails?: BehaviorNote;
  /** Ağzına sığan küçük balıkları yer; asıl avcı (`predatory`) değildir. */
  eatsSmallFish?: BehaviorNote;
  /** Aynı türün erkekleri kavga eder ("males") ya da tür tek tutulmalıdır ("all"). */
  conspecificAggression?: BehaviorNote & { value: "males" | "all" };
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

/** Sonuç biçimi v2 (motor 1.10.0, karar 0021 paket 3): uyarı ve ölçüt metinlerinin dile bağlı olmayan karşılığı. Ekran metni dil
 * dosyasında kod ve değişkenlerden kurulur; Türkçe `title`, `message`, `label` ve `detail` alanları geriye uyum için aynen üretilir. */
export type EngineParamValue=string|number|boolean|string[];
export type EngineParams=Record<string,EngineParamValue>;
export interface HealthMetric { key:string; label:string; score:number; status:"good"|"warning"|"danger"; detail:string;
  /** `detail` metninin kodu ve değişkenleri (sonuç biçimi v2). */
  detailCode:string; detailParams:EngineParams;
  /** Sonuç, kullanıcının elle girdiği bir ekipman değerine dayanıyorsa işaretlenir (kural seti 1.8.0). */
  userProvided?:true; }
export interface HealthWarning { level:"warning"|"danger"; title:string; message:string;
  /** `title` ve `message` metinlerinin kodu ve değişkenleri (sonuç biçimi v2). */
  code:string; params:EngineParams; }
export interface HealthAnalysis { score:number; status:"good"|"warning"|"danger"; metrics:HealthMetric[]; warnings:HealthWarning[]; }
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
// Kural seti 1.4.0 (docs/DECISIONS/0010-davranis-uyarilari.md).
/** Av, avcının yetişkin boyunun bu oranı veya altındaysa avlanabilir (asıl ve fırsatçı avcılar için aynı). */
const PREY_SIZE_RATIO=.4;
/** Cüce karides: yetişkin boyu bu değer veya altındaki karidesler (OATA: cüce karidesler yaklaşık 3 cm). */
const DWARF_SHRIMP_MAX_CM=4;
// Kural seti 1.6.0 (docs/DECISIONS/0012-alan-uyarisinin-siddeti.md). İsviçre Hayvan Koruma Yönetmeliği (TSchV, SR 455.1)
// Ek 2 Tablo 8 not b): akvaryum ölçüleri en büyük balığın boyuna göre en az bu katlar olmalı. Kaynağın önerisinin altındaki
// akvaryum bu ölçülerin de altındaysa alan uyarısı tehlikedir; kaynağın önerisini karşılayan akvaryum hiç alan uyarısı almaz.
const SWISS_MIN_LENGTH_RATIO=3;
const SWISS_MIN_WIDTH_RATIO=2;
/** Yönetmelik su derinliği ister; akvaryum yüksekliği su derinliğinden küçük olamayacağı için yükseklik kullanılır. */
const SWISS_MIN_DEPTH_RATIO=1;
/** Tehlike seviyesindeki alan sorununda yüzme alanı ölçütünün üst sınırı (filtre tehlikesindeki puanla aynı). */
const SEVERE_SPACE_SCORE=35;
const status=(score:number):HealthMetric["status"]=>score>=75?"good":score>=50?"warning":"danger";

// Kural seti 1.8.0 (docs/DECISIONS/0017-elle-girilen-ekipman-degerleri.md): katalogda doğrulanmış kapasite verisi olmayan
// ekipmanda kullanıcının cihaz etiketinden girdiği değer kullanılır. Hesap kuralı aynıdır: filtre etiket debisiyle
// (saatte 4 ve 2 çevrim), ısıtıcı 0,5–1,5 W/L bandıyla değerlendirilir.
/** Elle girilebilen değer: filtre ve hava motorunda debi (L/saat), ısıtıcıda güç (W). */
export type UserEquipmentValueKind="flow"|"power";
/** Elle girilen debinin kabul edilen aralığı (L/saat). Dışındaki sayı büyük olasılıkla birim ya da yazım hatasıdır; hesaba katılmaz. */
export const USER_FLOW_LIMITS_LPH:{filter:[number,number];air_pump:[number,number]}={filter:[20,20000],air_pump:[10,50000]};
/** Elle girilen ısıtıcı gücünün kabul edilen aralığı (W). */
export const USER_HEATER_POWER_LIMITS_W:[number,number]=[5,2000];
/**
 * Bir kayıtta kullanıcının hangi değeri elle girebileceğini söyler; giremiyorsa `undefined`.
 * Katalogda doğrulanmış kapasite verisi olan, pasif, yardımcı ya da hava motoruyla çalışan cihazlarda elle giriş yoktur.
 */
export function userValueKindFor(category:Equipment["category"],profile?:EquipmentProfileInput):UserEquipmentValueKind|undefined{
 if(profile?.passiveComponent)return undefined;
 if(category==="filter")return profile&&(profile.auxiliaryFiltration||profile.requiresAirPump||profile.ratedFlowLph||profile.recommendedMaxL)?undefined:"flow";
 if(category==="air_pump")return profile?.ratedFlowLph?undefined:"flow";
 if(category==="heater")return profile&&(profile.powerW||profile.recommendedMinL||profile.recommendedMaxL||profile.integratedHeaterW)?undefined:"power";
 return undefined;
}
/** Elle girilen değerin kabul edilen aralığı; bu kayıtta elle giriş yoksa `undefined`. */
export function userValueLimitsFor(category:Equipment["category"],profile?:EquipmentProfileInput):{kind:UserEquipmentValueKind;min:number;max:number}|undefined{
 const kind=userValueKindFor(category,profile);
 if(!kind)return undefined;
 const [min,max]=kind==="power"?USER_HEATER_POWER_LIMITS_W:USER_FLOW_LIMITS_LPH[category==="air_pump"?"air_pump":"filter"];
 return {kind,min,max};
}
/** Kaydın hesaba katılacak elle girilmiş değeri; yoksa, aralık dışındaysa ya da bu kayıtta elle giriş yoksa `undefined`. */
export function userValueFor(item:Equipment,profile?:EquipmentProfileInput):{kind:UserEquipmentValueKind;value:number}|undefined{
 const limits=userValueLimitsFor(profile?.category??item.category,profile);
 if(!limits)return undefined;
 const value=limits.kind==="flow"?item.userRatedFlowLph:item.userPowerW;
 return typeof value==="number"&&Number.isFinite(value)&&value>=limits.min&&value<=limits.max?{kind:limits.kind,value}:undefined;
}

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
 // Ölçü girilmemişse (0) o ölçü denetlenmez. Yalnızca balıklar için; yönetmelik süs balıklarını kapsar.
 const belowSwiss=(dimensionCm:number,sizeCm:number,ratio:number)=>dimensionCm>0&&dimensionCm<sizeCm*ratio;
 const severeSpaceIssues=new Set(spaceIssues.filter(({item,profile})=>item.category==="fish"&&(belowSwiss(aquarium.lengthCm,profile!.adultSizeCm,SWISS_MIN_LENGTH_RATIO)||belowSwiss(aquarium.widthCm,profile!.adultSizeCm,SWISS_MIN_WIDTH_RATIO)||belowSwiss(aquarium.heightCm,profile!.adultSizeCm,SWISS_MIN_DEPTH_RATIO))));
 const spaceScore=profiles.length?Math.min(clamp(100-spaceIssues.length/profiles.length*80),severeSpaceIssues.size?SEVERE_SPACE_SCORE:100):100;
 const groupIssues=profiles.filter(({item,profile})=>item.quantity<profile!.minGroup); const socialScore=profiles.length?clamp(100-groupIssues.length/profiles.length*65):100;
 const tempIntersection:[number,number]=profiles.length?[Math.max(...profiles.map(x=>x.profile!.temperature[0])),Math.min(...profiles.map(x=>x.profile!.temperature[1]))]:[0,40];
 const phIntersection:[number,number]=profiles.length?[Math.max(...profiles.map(x=>x.profile!.ph[0])),Math.min(...profiles.map(x=>x.profile!.ph[1]))]:[0,14];
 const flowProfiles=profiles.filter(x=>x.profile!.flow!==undefined);
 const hasLowFlow=flowProfiles.some(x=>x.profile!.flow==="low"); const hasHighFlow=flowProfiles.some(x=>x.profile!.flow==="high");
 const temperatureConflict=tempIntersection[0]>tempIntersection[1]; const phConflict=phIntersection[0]>phIntersection[1]; const flowConflict=hasLowFlow&&hasHighFlow;
 const predationIssues=profiles.flatMap(predator=>predator.profile!.predatory?profiles.filter(prey=>prey.profile!.id!==predator.profile!.id&&prey.profile!.adultSizeCm<=predator.profile!.adultSizeCm*PREY_SIZE_RATIO).map(prey=>({predator:predator.profile!,prey:prey.profile!})):[]);
 const speciesOnlyIssues=profiles.filter(({profile})=>profile!.speciesOnly&&profiles.some(other=>other.profile!.id!==profile!.id));
 const communityCautionIssues=profiles.filter(({profile})=>profile!.communityCaution&&profiles.some(other=>other.profile!.id!==profile!.id));
 // Davranış (kural seti 1.4.0): yalnızca açık kaynaklı notlar uyarı üretir; çelişkili notlar sayılmaz. Hepsi uyarı seviyesindedir.
 const explicit=(note?:BehaviorNote)=>note&&!note.conflict?note:undefined;
 const fishProfiles=profiles.filter(({item})=>item.category==="fish");
 const finNipIssues=fishProfiles.flatMap(nipper=>{const note=explicit(nipper.profile!.behavior?.finNipper);return note?fishProfiles.filter(target=>target.profile!.id!==nipper.profile!.id&&explicit(target.profile!.behavior?.finNipTarget)).map(target=>({nipper:nipper.profile!,target:target.profile!,note})):[];});
 const smallFishPredationIssues=fishProfiles.flatMap(hunter=>{const note=explicit(hunter.profile!.behavior?.eatsSmallFish);return note&&!hunter.profile!.predatory?fishProfiles.filter(prey=>prey.profile!.id!==hunter.profile!.id&&prey.profile!.adultSizeCm<=Math.min(hunter.profile!.adultSizeCm*PREY_SIZE_RATIO,note.maxPreyCm??Infinity)).map(prey=>({hunter:hunter.profile!,prey:prey.profile!,note})):[];});
 const dwarfShrimp=profiles.filter(({item,profile})=>item.category==="shrimp"&&profile!.adultSizeCm<=DWARF_SHRIMP_MAX_CM);
 const shrimpEaters=dwarfShrimp.length?fishProfiles.filter(({profile})=>explicit(profile!.behavior?.eatsShrimp)):[];
 const shrimpUnverified=dwarfShrimp.length?fishProfiles.filter(({profile})=>!explicit(profile!.behavior?.eatsShrimp)&&!explicit(profile!.behavior?.shrimpSafe)):[];
 // Kural seti 1.7.0 (docs/DECISIONS/0013-salyangoz-uyarisi.md): yalnızca kaynağı açıkça "salyangoz yer" diyen balıklar uyarı üretir.
 const snails=profiles.filter(({item})=>item.category==="snail");
 const snailEaters=snails.length?fishProfiles.filter(({profile})=>explicit(profile!.behavior?.eatsSnails)):[];
 const conspecificIssues=profiles.filter(({item,profile})=>item.quantity>=2&&explicit(profile!.behavior?.conspecificAggression));
 // Ortak güvenli sıcaklık veya pH aralığı bulunmaması doğrudan tehlike seviyesidir.
 const compatibilityPenalty=(habitatIssues.length?80:0)+(temperatureConflict?55:0)+(phConflict?55:0)+(flowConflict?20:0)+(predationIssues.length?60:0)+(speciesOnlyIssues.length?60:0)+(communityCautionIssues.length?30:0);
 const behaviorPenalty=(smallFishPredationIssues.length?40:0)+(finNipIssues.length?30:0)+(conspecificIssues.length?30:0)+(shrimpEaters.length?30:0)+(shrimpUnverified.length?15:0)+(snailEaters.length?30:0);
 // Uyarı seviyesindeki uyum sorunları (akıntı, topluluk, davranış) birikse de tür uyumunu tehlikeye çekmez; yalnızca kesin tehlikeler çeker.
 const criticalCompatibilityIssue=habitatIssues.length>0||temperatureConflict||phConflict||predationIssues.length>0||speciesOnlyIssues.length>0;
 const compatibilityFor=(penalty:number)=>criticalCompatibilityIssue?clamp(100-penalty):Math.max(50,clamp(100-penalty));
 const compatibilityScore=compatibilityFor(compatibilityPenalty+behaviorPenalty);
 // Elle girilen değer (1.8.0) katalog kaydının eksik alanını doldurur; katalogda olmayan cihaz için yalnız bu değeri taşıyan bir kayıt oluşur.
 // Elle değer kullanılan kayıtlar ve girilen değerin türü: sonuç yalnızca o değere dayanan ölçütte işaretlenir.
 const userProvidedEquipment=new Map<EquipmentProfileInput,UserEquipmentValueKind>();
 const matchedEquipment=equipment.map(item=>{const profile=resolver.profileForEquipment(item);const user=userValueFor(item,profile);if(!user)return profile;const merged:EquipmentProfileInput={...(profile??{id:`user:${item.id}`,category:item.category,brand:item.brand??"",model:item.model??""}),...(user.kind==="flow"?{ratedFlowLph:user.value}:{powerW:user.value})};userProvidedEquipment.set(merged,user.kind);return merged;}).filter(profile=>profile!==undefined);
 const usableEquipment=(profile:EquipmentProfileInput)=>userProvidedEquipment.has(profile)||resolver.isVerifiedEquipmentProfile(profile);
 const verifiedEquipment=matchedEquipment.filter(usableEquipment);
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
 // Taban ısıtma kablosu gibi pasif kayıtlar ısıtıcı seçicisinde bulunur ama ana su ısıtma kapasitesi sağlamaz (1.5.0).
 const heaters=verifiedEquipment.filter(p=>!p.passiveComponent&&(p.category==="heater"||p.integratedHeaterW));
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
  if(!usableEquipment(p))return false;
  const filterReady=p.category!=="filter"||Boolean(p.ratedFlowLph)||(!p.requiresAirPump&&Boolean(p.recommendedMaxL))||(Boolean(p.requiresAirPump)&&airPumpsWithFlow.length>0);
  const airPumpReady=p.category!=="air_pump"||Boolean(p.ratedFlowLph);
  const heaterReady=!(p.category==="heater"||p.integratedHeaterW)||Boolean(p.recommendedMinL||p.recommendedMaxL||p.integratedHeaterW||(p.category==="heater"&&p.powerW));
  return filterReady&&heaterReady&&airPumpReady;
 });
 // Güvenlik hesabına giren ekipman türleri: filtre, ısıtıcı ve (hava motoruyla çalışan filtre varsa) hava motoru.
 const entersSafetyCalculation=(category:Equipment["category"])=>category==="filter"||category==="heater"||(airDrivenFilters.length>0&&category==="air_pump");
 const safetyEquipmentInputCount=equipment.filter(item=>{const profile=resolver.profileForEquipment(item);return !profile?.passiveComponent&&entersSafetyCalculation(item.category);}).length;
 // Aynı katalog cihazı iki kez kayıtlıysa ve yalnız birine değer girildiyse diğeri eksik sayılmaya devam eder; bu yüzden kimlikle değil kayıtla karşılaştırılır.
 const missingCapacityEquipment=safetyEquipment.filter(profile=>!calculationReadyEquipment.includes(profile));
 const totalDataCount=animals.length+safetyEquipmentInputCount; const verifiedDataCount=verifiedMatchedProfiles.length+calculationReadyEquipment.length; const confidenceScore=totalDataCount?clamp(verifiedDataCount/totalDataCount*100):50;
 const filterUsesUserValue=sizedFilters.some(p=>userProvidedEquipment.get(p)==="flow")||(airDrivenFilters.length>0&&airPumpsWithFlow.some(p=>userProvidedEquipment.get(p)==="flow"));
 const heaterUsesUserValue=heaters.some(h=>userProvidedEquipment.get(h)==="power");
 const userValueReadyCount=calculationReadyEquipment.filter(p=>userProvidedEquipment.has(p)).length;
 const userProvidedFlag=(used:boolean)=>used?{userProvided:true as const}:{};
 const compatibilityDetail:[string,string]=habitatIssues.length?["habitat","Akvaryum türüyle yaşam ortamı uyuşmuyor"]:speciesOnlyIssues.length?["speciesOnly","Tür akvaryumu önerilen canlı var"]:predationIssues.length?["predation","Küçük canlılar için avlanma riski var"]:temperatureConflict||phConflict?["waterRanges","Su değeri aralıkları kesişmiyor"]:smallFishPredationIssues.length?["smallFishPredation","Küçük balıklar avlanabilir"]:finNipIssues.length?["finNip","Yüzgeç ısırma riski var"]:conspecificIssues.length?["conspecific","Aynı tür bireyleri kavga edebilir"]:shrimpEaters.length?["shrimpEaten","Karidesler yenebilir"]:snailEaters.length?["snailEaten","Salyangozlar yenebilir"]:flowConflict?["flowConflict","Akıntı ihtiyaçları farklı"]:communityCautionIssues.length?["communityCaution","Tank arkadaşı seçimi dikkat gerektiriyor"]:shrimpUnverified.length?["shrimpUnverified","Karides uyumu doğrulanmadı"]:["compatible","Ortak yaşam aralıkları mevcut"];
 const filterDetail:[string,string,EngineParams]=sizedByManufacturer?["manufacturerMax",`Üretici önerisi en fazla ${filterOkL} L`,{liters:filterOkL}]:sizedByFlow?["ratedTurnover",`Etiket debisiyle ${ratedTurnover.toFixed(1).replace(".",",")} çevrim/saat`,{turnover:ratedTurnover}]:sizedFilters.length?["mixedMax",`Üretici önerisi ve etiket debisine göre en fazla ${Math.round(filterOkL)} L`,{liters:Math.round(filterOkL)}]:airDrivenFilters.length?(airDrivenReady?["airReady","Hava motorlu sünger filtre bağlantısı hazır",{}]:["airMissing","Sünger filtre için hava motoru gerekli",{}]):primaryFilters.length?["flowUnverified","Debi bilgisi doğrulanmayı bekliyor",{}]:auxiliaryFilters.length?["auxiliaryOnly","Yalnız yardımcı yüzey skimmeri kayıtlı; ana filtre gerekli",{}]:["noFilter","Katalogdan filtre bulunamadı",{}];
 const heaterDetail:[string,string,EngineParams]=heaterDataReady?(heaterFit?(useEstimatedHeaterRange?["estimatedOk",`Toplam ${heaterPowerW} W için tahmini hacim uygun`,{watts:heaterPowerW}]:["manufacturerOk","Üretici hacim aralığı uygun",{}]):(heaterTooSmall?["powerLow","Isıtma gücü bu hacim için düşük",{}]:heaterTooLarge?["powerHigh","Isıtma gücü bu hacim için yüksek",{}]:["outOfRange","Hacim aralığı dışında",{}])):heaters.length?["heaterUnverified","Watt veya hacim verisi doğrulanmayı bekliyor",{}]:["noHeater","Katalogdan ısıtıcı bulunamadı",{}];
 const metrics:HealthMetric[]=[
  {key:"load",label:"Biyolojik yük",score:loadScore,status:status(loadScore),detail:`Tahmini yük oranı %${Math.round(loadRatio*100)}`,detailCode:"loadRatio",detailParams:{percent:Math.round(loadRatio*100)}},
  {key:"space",label:"Yüzme alanı",score:spaceScore,status:status(spaceScore),detail:severeSpaceIssues.size?`${severeSpaceIssues.size} tür için akvaryum çok küçük`:spaceIssues.length?`${spaceIssues.length} tür için alan sınırda`:"Kayıtlı türler için uygun",detailCode:severeSpaceIssues.size?"spaceSevere":spaceIssues.length?"spaceLimited":"spaceOk",detailParams:severeSpaceIssues.size?{count:severeSpaceIssues.size}:spaceIssues.length?{count:spaceIssues.length}:{}},
  {key:"social",label:"Sosyal ihtiyaç",score:socialScore,status:status(socialScore),detail:groupIssues.length?`${groupIssues.length} türün grup sayısı düşük`:"Grup ihtiyaçları uygun",detailCode:groupIssues.length?"groupLow":"groupOk",detailParams:groupIssues.length?{count:groupIssues.length}:{}},
  {key:"compatibility",label:"Tür uyumu",score:compatibilityScore,status:status(compatibilityScore),detail:compatibilityDetail[1],detailCode:compatibilityDetail[0],detailParams:{}},
  {key:"filter",label:"Filtrasyon uygunluğu",score:filterScore,status:status(filterScore),detail:filterDetail[1],detailCode:filterDetail[0],detailParams:filterDetail[2],...userProvidedFlag(filterUsesUserValue)},
  {key:"heater",label:"Isıtıcı uygunluğu",score:heaterScore,status:status(heaterScore),detail:heaterDetail[1],detailCode:heaterDetail[0],detailParams:heaterDetail[2],...userProvidedFlag(heaterUsesUserValue)},
  {key:"water",label:"Su değeri uyumu",score:waterScore,status:status(waterScore),detail:latest?"Son ölçüme göre":"Ölçüm eklenmesi gerekli",detailCode:latest?"latestReading":"readingNeeded",detailParams:{}},
  {key:"confidence",label:"Veri güveni",score:confidenceScore,status:status(confidenceScore),detail:totalDataCount?`${verifiedDataCount}/${totalDataCount} güvenlik kaydı hesaplamaya hazır${userValueReadyCount?` · ${userValueReadyCount} kayıt senin girdiğin değerle`:""}`:"Güvenlik hesabı için kayıt bulunamadı",detailCode:totalDataCount?"recordsReady":"noRecords",detailParams:totalDataCount?{ready:verifiedDataCount,total:totalDataCount,userValue:userValueReadyCount}:{}},
 ];
 const warnings:HealthAnalysis["warnings"]=[];
 // 1.9.0 (docs/DECISIONS/0018-eslesmeyen-ekipman-uyarisi.md): yalnızca güvenlik hesabına giren türdeki eşleşmeyen kayıt uyarı üretir;
 // aydınlatma, CO₂, UV, dozaj pompası gibi hesaba hiç girmeyen cihaz listede olmasa da uyarı üretmez.
 const unmatchedAnimalCount=animals.length-matchedProfiles.length; const unmatchedEquipmentCount=equipment.filter(item=>entersSafetyCalculation(item.category)&&!resolver.profileForEquipment(item)&&!userValueFor(item)).length;
 const unverifiedAnimalCount=matchedProfiles.length-verifiedMatchedProfiles.length; const unverifiedEquipmentCount=matchedEquipment.length-verifiedEquipment.length;
 const missingCapacityCount=missingCapacityEquipment.length;
 if(unmatchedAnimalCount)warnings.push({level:"warning",title:"Katalogla eşleşmeyen canlı kaydı var",message:`${unmatchedAnimalCount} canlı kaydı tanınmadığı için biyolojik yük ve uyumluluk hesabına dahil edilmedi.`,code:"unmatchedAnimals",params:{count:unmatchedAnimalCount}});
 if(unmatchedEquipmentCount)warnings.push({level:"warning",title:"Katalogla eşleşmeyen ekipman kaydı var",message:`${unmatchedEquipmentCount} ekipmanın kapasitesi tanınmadığı için filtrasyon veya ısıtıcı hesabına dahil edilmedi.`,code:"unmatchedEquipment",params:{count:unmatchedEquipmentCount}});
 if(unverifiedAnimalCount)warnings.push({level:"warning",title:"Bazı canlı verileri doğrulanmayı bekliyor",message:`${unverifiedAnimalCount} canlı kaydı güvenlik hesabına dahil edilmedi; doğrulanmış katalog kaydı seçilmeli.`,code:"unverifiedAnimals",params:{count:unverifiedAnimalCount}});
 if(unverifiedEquipmentCount)warnings.push({level:"warning",title:"Bazı ekipman verileri doğrulanmayı bekliyor",message:`${unverifiedEquipmentCount} ekipman kaydının teknik değerleri otomatik kapasite hesabında kullanılmadı.`,code:"unverifiedEquipment",params:{count:unverifiedEquipmentCount}});
 if(missingCapacityCount){const names=missingCapacityEquipment.slice(0,3).map(item=>`${item.brand} ${item.model}`).join(", ");const remaining=missingCapacityCount>3?` ve ${missingCapacityCount-3} ekipman daha`:"";const reason=missingCapacityCount===1&&missingCapacityEquipment[0].capacityDataNote?` ${missingCapacityEquipment[0].capacityDataNote}`:" Gerekli debi, hacim veya hava motoru bağlantısı doğrulanmalı.";warnings.push({level:"warning",title:"Ekipman kapasite bilgisi eksik",message:`${names}${remaining} güvenli kapasite hesabına alınamadı.${reason}`,code:"missingCapacity",params:{names:missingCapacityEquipment.slice(0,3).map(item=>`${item.brand} ${item.model}`),remaining:Math.max(0,missingCapacityCount-3),note:missingCapacityCount===1&&missingCapacityEquipment[0].capacityDataNote?missingCapacityEquipment[0].capacityDataNote:""}});}
 if(auxiliaryFilters.length&&!primaryFilters.length)warnings.push({level:"danger",title:"Ana filtre gerekli",message:"Yüzey skimmeri su yüzeyindeki filmi toplar ancak tek başına ana mekanik ve biyolojik filtrenin yerine geçmez. Katalogdan akvaryuma uygun bir ana filtre ekleyin.",code:"primaryFilterRequired",params:{}});
 if(airDrivenFilters.length&&!airDrivenReady)warnings.push({level:"danger",title:"Sünger filtre için hava motoru gerekli",message:"Seçilen pipo/sünger filtre kendi başına su çevirmez. Katalogdan uygun bir hava motoru ekleyin.",code:"airPumpRequired",params:{}});
 if(loadRatio>LOAD_WARNING_RATIO)warnings.push({level:"warning",title:"Biyolojik yük yüksek olabilir",message:"Tahmini canlı yükü, türlerin kaynaklarında önerilen koşulların belirgin biçimde üstünde. Canlı eklemeden önce filtrasyonu ve bakım sıklığını gözden geçir; amonyak, nitrit ve nitratı düzenli ölç.",code:"highLoad",params:{}});
 if(turnover>targetMax)warnings.push({level:"warning",title:"Filtre akışı güçlü olabilir",message:`Tahmini ${turnover.toFixed(1)} çevrim/saat. Düşük akıntı seven türler için çıkışı dağıtmayı düşün.`,code:"strongFlow",params:{turnover}});
 if(filterFit==="warning"||filterFit==="danger"){const volume=aquarium.netVolumeLiters;const cycles=ratedTurnover.toFixed(1).replace(".",",");if(sizedByManufacturer){const capacityText=sizedFilters.length>1?`filtrelerin üreticilerince önerilen toplam hacmin (${filterOkL} L)`:`filtrenin üreticisinin önerdiği en büyük hacmin (${filterOkL} L)`;warnings.push(filterFit==="danger"?{level:"danger",title:"Filtre bu akvaryum için küçük",message:`Akvaryumun net hacmi (${volume} L), ${capacityText} %50'den fazla üstünde. Akvaryuma uygun bir filtre ekleyin.`,code:"filterTooSmallManufacturer",params:{volume,liters:filterOkL,multiple:sizedFilters.length>1}}:{level:"warning",title:"Filtre üretici önerisinin üstünde",message:`Akvaryumun net hacmi (${volume} L), ${capacityText} üstünde. Filtre bakımını sık yapın; canlı eklemeden önce daha büyük bir filtre düşünün.`,code:"filterOverManufacturer",params:{volume,liters:filterOkL,multiple:sizedFilters.length>1}});}else if(sizedByFlow){warnings.push(filterFit==="danger"?{level:"danger",title:"Filtre debisi yetersiz",message:`Üretici hacim önerisi olmadığı için etiket debisine bakıldı: akvaryumun suyu saatte yaklaşık ${cycles} kez dolaşıyor. Hortum ve filtre malzemesiyle gerçek debi bunun yaklaşık yarısına iner; akvaryuma uygun bir filtre ekleyin.`,code:"filterFlowInsufficient",params:{turnover:ratedTurnover}}:{level:"warning",title:"Filtre debisi düşük olabilir",message:`Üretici hacim önerisi olmadığı için etiket debisine bakıldı: akvaryumun suyu saatte yaklaşık ${cycles} kez dolaşıyor, önerilen en az ${FILTER_MIN_RATED_TURNOVER}. Filtre kirlendikçe gerçek debi daha da düşer.`,code:"filterFlowLow",params:{turnover:ratedTurnover,min:FILTER_MIN_RATED_TURNOVER}});}else{warnings.push(filterFit==="danger"?{level:"danger",title:"Filtre bu akvaryum için küçük",message:`Akvaryumun net hacmi (${volume} L), filtrelerin üretici önerisi ve etiket debisine göre karşılayabildiği en büyük hacmin (${Math.round(filterLimitL)} L) üstünde. Akvaryuma uygun bir filtre ekleyin.`,code:"filterTooSmallMixed",params:{volume,liters:Math.round(filterLimitL)}}:{level:"warning",title:"Filtre kapasitesi düşük olabilir",message:`Akvaryumun net hacmi (${volume} L), filtrelerin üretici önerisi ve etiket debisine göre uygun olduğu hacmin (${Math.round(filterOkL)} L) üstünde. Filtre bakımını sık yapın; canlı eklemeden önce daha güçlü bir filtre düşünün.`,code:"filterCapacityLow",params:{volume,liters:Math.round(filterOkL)}});}}
 if(heaterDataReady&&!heaterFit)warnings.push({level:heaterTooSmall?"danger":"warning",title:heaterTooSmall?"Isıtıcı gücü yetersiz olabilir":heaterTooLarge?"Isıtıcı akvaryuma göre güçlü olabilir":"Isıtıcı hacimle eşleşmiyor",message:heaterTooSmall?"Seçilen ısıtıcının üretici hacim aralığı veya watt kapasitesi bu akvaryum için düşük kalıyor.":heaterTooLarge?"Yüksek güçlü ısıtıcı küçük hacimde sıcaklığı hızlı değiştirebilir. Güvenilir termostat ve doğru konumlandırma önemlidir.":"Seçilen ısıtıcının katalog hacim aralığı bu akvaryumu kapsamıyor.",code:heaterTooSmall?"heaterTooSmall":heaterTooLarge?"heaterTooLarge":"heaterMismatch",params:{}});
 for(const {profile} of habitatIssues)warnings.push({level:"danger",title:profile!.commonName+": akvaryum türü uyumsuz",message:profile!.commonName+", "+(aquarium.type==="freshwater"?"tatlı su":aquarium.type==="saltwater"?"tuzlu su":"acı su")+" akvaryumunda güvenli kabul edilmez. Canlı profilinin desteklediği su türüne uygun ayrı bir akvaryum seçin.",code:"habitatMismatch",params:{name:profile!.commonName,aquariumType:aquarium.type}});
 if(salinityProfiles.length&&latest?.specificGravity===undefined)warnings.push({level:"warning",title:"Özgül ağırlık ölçümü gerekli",message:"Deniz canlılarının tuzluluk uyumu değerlendirilemedi. Refraktometre veya hidrometre ile özgül ağırlık ölçümü ekleyin.",code:"salinityReadingNeeded",params:{}});
 if(salinityIssues.length)warnings.push({level:"danger",title:"Özgül ağırlık canlı aralığı dışında",message:salinityIssues.length+" canlı için son özgül ağırlık ölçümü güvenli katalog aralığının dışında.",code:"salinityOutOfRange",params:{count:salinityIssues.length}});
 const fmt=(value:number,digits=3)=>String(Number(value.toFixed(digits))).replace(".",",");
 const {ammonia,nitrite,nitrate,invalid}=waterQuality;
 if(invalid.length){const names=invalid.map(key=>({ammonia:"amonyak",nitrite:"nitrit",nitrate:"nitrat"})[key]);const list=names.length>1?`${names.slice(0,-1).join(", ")} ve ${names[names.length-1]}`:names[0];warnings.push({level:"warning",title:"Geçersiz su ölçümü",message:names.length>1?`Son ölçümdeki ${list} değerleri geçersiz (negatif ya da geçerli bir sayı değil); bu değerler değerlendirmeye alınmadı. Yeniden ölçüp kaydedin.`:`Son ölçümdeki ${list} değeri geçersiz (negatif ya da geçerli bir sayı değil); bu değer değerlendirmeye alınmadı. Yeniden ölçüp kaydedin.`,code:"invalidReading",params:{fields:[...invalid]}});}
 if(ammonia&&ammonia.level!=="ok")warnings.push(ammonia.level==="danger"?(ammonia.worstCase?{level:"danger",title:"Amonyak zehirli olabilir",message:`Toplam amonyak ${fmt(ammonia.total)} ppm. pH veya sıcaklık ölçümü eksik ya da geçersiz olduğu için zehirli (serbest) kısmı hesaplanamadı; en kötü durumda güvenli üst sınır olan ${fmt(ammonia.limit)} ppm aşılıyor. pH ve sıcaklığı da ölçün, bu arada kısmi su değişimi yapın.`,code:"ammoniaWorstCase",params:{total:ammonia.total,limit:ammonia.limit}}:{level:"danger",title:"Zehirli amonyak sınırın üzerinde",message:`Ölçülen pH ve sıcaklıkta serbest (zehirli) amonyak yaklaşık ${fmt(ammonia.free,4)} ppm; güvenli üst sınır ${fmt(ammonia.limit)} ppm. Hemen kısmi su değişimi yapın, beslemeyi azaltın ve filtreyi kontrol edin.`,code:"ammoniaToxic",params:{free:ammonia.free,limit:ammonia.limit}}):{level:"warning",title:"Amonyak ölçüldü",message:`Toplam amonyak ${fmt(ammonia.total)} ppm. Olgun bir akvaryumda amonyak 0 olmalıdır; sıfırın üstündeki değerler yalnızca kısa süre tolere edilebilir. pH yükselirse zehirli kısmı hızla artar.`,code:"ammoniaDetected",params:{total:ammonia.total}});
 if(nitrite&&nitrite.level!=="ok")warnings.push(nitrite.level==="danger"?{level:"danger",title:"Nitrit sınırın üzerinde",message:`Nitrit ${fmt(nitrite.value)} ppm; güvenli üst sınır ${fmt(nitrite.limit)} ppm. Hemen kısmi su değişimi yapın ve filtreyi kontrol edin.`,code:"nitriteHigh",params:{value:nitrite.value,limit:nitrite.limit}}:{level:"warning",title:"Nitrit ölçüldü",message:`Nitrit ${fmt(nitrite.value)} ppm. Nitrit 0 olmalıdır; sıfırın üstündeki değerler yalnızca kısa süre tolere edilebilir.`,code:"nitriteDetected",params:{value:nitrite.value}});
 if(nitrate&&nitrate.level!=="ok")warnings.push(nitrate.level==="danger"?{level:"danger",title:"Nitrat çok yüksek",message:aquarium.type==="saltwater"?`Nitrat ${fmt(nitrate.value)} ppm; deniz akvaryumu için üst sınır 100 ppm. Su değişimini artırın.`:`Nitrat ${fmt(nitrate.value)} ppm. Musluk suyu yasal olarak en fazla 50 ppm nitrat içerebildiği için önerilen sınır (musluk suyunun en fazla 50 ppm üstü) aşılmış. Su değişimini artırın.`,code:aquarium.type==="saltwater"?"nitrateTooHighSaltwater":"nitrateTooHigh",params:{value:nitrate.value}}:{level:"warning",title:"Nitrat yüksek olabilir",message:`Nitrat ${fmt(nitrate.value)} ppm. Önerilen sınır musluk suyunun en fazla 50 ppm üstüdür; musluk suyunun nitratını da ölçün ve su değişimini artırın.`,code:"nitrateHigh",params:{value:nitrate.value}});
 if(temperatureConflict)warnings.push({level:"danger",title:"Türlerin sıcaklık ihtiyaçları uyuşmuyor",message:"Seçilen canlılar için ortak ve güvenli bir sıcaklık aralığı bulunamadı.",code:"temperatureConflict",params:{}});
 if(phConflict)warnings.push({level:"danger",title:"Türlerin pH ihtiyaçları uyuşmuyor",message:"Seçilen canlılar için ortak ve güvenli bir pH aralığı bulunamadı.",code:"phConflict",params:{}});
 if(flowConflict)warnings.push({level:"warning",title:"Akıntı ihtiyaçları farklı",message:"Düşük ve yüksek akıntı isteyen türler birlikte seçildi. Akvaryumda sakin ve güçlü akış bölgeleri oluşturulmalı.",code:"flowConflict",params:{}});
 for(const {predator,prey} of predationIssues)warnings.push({level:"danger",title:`${prey.commonName} için avlanma riski`,message:`${predator.commonName}, yetişkin boy farkı nedeniyle ${prey.commonName} için güvenli bir tank arkadaşı olmayabilir.`,code:"predation",params:{predator:predator.commonName,prey:prey.commonName}});
 for(const {profile} of speciesOnlyIssues)warnings.push({level:"danger",title:`${profile!.commonName} için tür akvaryumu önerilir`,message:"Bu tür agresiflik ve özel beslenme davranışları nedeniyle başka canlılarla birlikte güvenli kabul edilmedi.",code:"speciesOnly",params:{name:profile!.commonName}});
 for(const {profile} of communityCautionIssues)warnings.push({level:"warning",title:`${profile!.commonName}: tank arkadaşı seçimine dikkat`,message:profile!.communityCaution!,code:"communityCaution",params:{name:profile!.commonName,text:profile!.communityCaution!}});
 const noteText=(note:BehaviorNote)=>(note.condition?` Kaynağın notu: ${note.condition.replace(/\.?$/,".")}`:"")+` Kaynak: ${note.source}.`;
 const noteParams=(note:BehaviorNote):EngineParams=>({condition:note.condition??"",source:note.source});
 const nameList=(names:string[])=>names.length>1?`${names.slice(0,-1).join(", ")} ve ${names[names.length-1]}`:names[0];
 for(const {hunter,prey,note} of smallFishPredationIssues)warnings.push({level:"warning",title:`${prey.commonName}: avlanabilir`,message:`${hunter.commonName} ağzına sığan küçük balıkları yiyebilir; ${prey.commonName} yetişkin boyuyla bu risk içinde.${noteText(note)}`,code:"smallFishPredation",params:{hunter:hunter.commonName,prey:prey.commonName,...noteParams(note)}});
 for(const {nipper,target,note} of finNipIssues)warnings.push({level:"warning",title:`${target.commonName}: yüzgeç ısırma riski`,message:`${nipper.commonName} yüzgeç ısırabilir; ${target.commonName} gibi uzun ya da yavaş yüzgeçli balıklarla birlikte tutulması önerilmez.${noteText(note)}`,code:"finNip",params:{nipper:nipper.commonName,target:target.commonName,...noteParams(note)}});
 for(const {item,profile} of conspecificIssues){const note=profile!.behavior!.conspecificAggression!;warnings.push(note.value==="males"?{level:"warning",title:`${profile!.commonName}: erkekler kavga eder`,message:`Kaynağa göre bu türün erkekleri birbiriyle kavga eder; kayıtlı ${item.quantity} bireyden birden fazlası erkekse ayırın.${noteText(note)}`,code:"conspecificMales",params:{name:profile!.commonName,count:item.quantity,...noteParams(note)}}:{level:"warning",title:`${profile!.commonName}: tek tutulmalı`,message:`Kaynağa göre bu tür kendi türünden bireylere karşı saldırgandır ve genellikle tek tutulmalıdır.${noteText(note)}`,code:"conspecificAll",params:{name:profile!.commonName,...noteParams(note)}});}
 const shrimpNames=nameList(dwarfShrimp.map(({profile})=>profile!.commonName));
 if(shrimpEaters.length){const sources=[...new Set(shrimpEaters.map(({profile})=>profile!.behavior!.eatsShrimp!.source))];warnings.push({level:"warning",title:"Karidesler yenebilir",message:`Kaynaklara göre ${nameList(shrimpEaters.map(({profile})=>profile!.commonName))} karides yer; ${shrimpNames} ve özellikle yavruları risk altındadır. Kaynak: ${sources.join(", ")}.`,code:"shrimpEaten",params:{eaters:shrimpEaters.map(({profile})=>profile!.commonName),shrimp:dwarfShrimp.map(({profile})=>profile!.commonName),sources}});}
 if(snailEaters.length){const sources=[...new Set(snailEaters.map(({profile})=>profile!.behavior!.eatsSnails!.source))];const notes=snailEaters.flatMap(({profile})=>profile!.behavior!.eatsSnails!.condition?[` ${profile!.commonName}: ${profile!.behavior!.eatsSnails!.condition!.replace(/\.?$/,".")}`]:[]).join("");warnings.push({level:"warning",title:"Salyangozlar yenebilir",message:`Kaynaklara göre ${nameList(snailEaters.map(({profile})=>profile!.commonName))} salyangoz yer; ${nameList(snails.map(({profile})=>profile!.commonName))} risk altında olabilir.${notes} Kaynak: ${sources.join(", ")}.`,code:"snailEaten",params:{eaters:snailEaters.map(({profile})=>profile!.commonName),snails:snails.map(({profile})=>profile!.commonName),noteNames:snailEaters.flatMap(({profile})=>profile!.behavior!.eatsSnails!.condition?[profile!.commonName]:[]),noteConditions:snailEaters.flatMap(({profile})=>profile!.behavior!.eatsSnails!.condition?[profile!.behavior!.eatsSnails!.condition!]:[]),sources}});}
 if(shrimpUnverified.length)warnings.push({level:"warning",title:"Karides uyumu doğrulanmadı",message:`${nameList(shrimpUnverified.map(({profile})=>profile!.commonName))} için "karidesle güvenli" bilgisi kaynaklarda bulunamadı. OATA, karideslerin ağzına sığabilecekleri balıklarla tutulmamasını önerir; ${shrimpNames} yavruları ve yeni kabuk değiştirmiş karidesler özellikle risk altındadır.`,code:"shrimpUnverified",params:{fish:shrimpUnverified.map(({profile})=>profile!.commonName),shrimp:dwarfShrimp.map(({profile})=>profile!.commonName)}});
 for(const {profile} of profiles.filter(({profile})=>profile!.husbandryCaution))warnings.push({level:"warning",title:`${profile!.commonName}: özel bakım gereksinimi`,message:profile!.husbandryCaution!,code:"husbandryCaution",params:{name:profile!.commonName,text:profile!.husbandryCaution!}});
 for(const {profile} of profiles.filter(({profile})=>profile!.tankLengthDataNote))warnings.push({level:"warning",title:`${profile!.commonName}: tank uzunluğu verisi sınırlı`,message:profile!.tankLengthDataNote!,code:"tankLengthNote",params:{name:profile!.commonName,text:profile!.tankLengthDataNote!}});
 for(const {item,profile} of groupIssues)warnings.push({level:"warning",title:`${profile!.commonName}: grup sayısı düşük`,message:`Kayıtlı adet ${item.quantity}; katalog önerisi en az ${profile!.minGroup}.`,code:"groupLow",params:{name:profile!.commonName,count:item.quantity,min:profile!.minGroup}});
 for(const entry of spaceIssues){const {profile}=entry;const volume=requiredVolume(entry);const reference=profile!.minTankLengthCm===undefined?`Kayıtlı adet için minimum ${volume} L referansı kullanıldı; kaynak tank uzunluğu yayımlamıyor.`:`Kayıtlı adet için minimum ${volume} L ve ${profile!.minTankLengthCm} cm uzunluk referansı kullanıldı.`;const size=profile!.adultSizeCm;const cm=(n:number)=>`${Math.round(n*10)/10} cm`;const spaceParams:EngineParams={name:profile!.commonName,volume,hasLength:profile!.minTankLengthCm!==undefined,length:profile!.minTankLengthCm??0};
  warnings.push(severeSpaceIssues.has(entry)?{level:"danger",title:`${profile!.commonName}: akvaryum çok küçük`,message:`${reference} Akvaryum ayrıca İsviçre Hayvan Koruma Yönetmeliği'nin ölçü kuralından (uzunluk 3×, genişlik 2×, su derinliği 1× vücut boyu) uyarlanan AquaMind sınırının altında. Yönetmelik kuyruk yüzgeci hariç boyu kullanır; AquaMind daha sıkı davranıp katalogdaki ${cm(size)} yetişkin boyu (çoğu türde toplam boy) kullanır: uzunluk en az ${cm(size*SWISS_MIN_LENGTH_RATIO)}, genişlik en az ${cm(size*SWISS_MIN_WIDTH_RATIO)}, su derinliği en az ${cm(size*SWISS_MIN_DEPTH_RATIO)}.`,code:"spaceSevere",params:{...spaceParams,size,minLength:size*SWISS_MIN_LENGTH_RATIO,minWidth:size*SWISS_MIN_WIDTH_RATIO,minDepth:size*SWISS_MIN_DEPTH_RATIO}}:{level:"warning",title:`${profile!.commonName}: alan sınırda`,message:reference,code:"spaceLimited",params:spaceParams});}
 // Kesin tehlikeler (yanlış su türü, kesişmeyen sıcaklık veya pH, avlanma, tür akvaryumu, tuzluluk, zehirli
 // amonyak veya nitrit) genel durumu "tehlike"ye çeker; sekiz ölçütün ortalaması bunları gizleyemez.
 // Diğer tehlike uyarıları (ör. üretici önerisini çok aşan filtre, yetersiz ısıtıcı) genel durumu "tehlike"ye
 // çekmez ama "iyi" görünmesini de engeller: genel puan en fazla "dikkat" olur.
 const criticalDanger=habitatIssues.length>0||temperatureConflict||phConflict||predationIssues.length>0||speciesOnlyIssues.length>0||salinityIssues.length>0||ammonia?.level==="danger"||nitrite?.level==="danger";
 const dangerWarning=warnings.some(warning=>warning.level==="danger");
 const metricSum=metrics.reduce((s,m)=>s+m.score,0); const averageScore=clamp(metricSum/metrics.length);
 // Davranış uyarıları uyarı seviyesindedir: davranış cezası olmadan tehlikede olmayan akvaryumu tek başına tehlikeye çekemez.
 const averageWithoutBehavior=clamp((metricSum-compatibilityScore+compatibilityFor(compatibilityPenalty))/metrics.length); const behaviorFloor=averageWithoutBehavior>=50?50:0;
 const score=criticalDanger?Math.min(averageScore,49):Math.min(Math.max(averageScore,behaviorFloor),dangerWarning?DANGER_WARNING_SCORE_CAP:100); return {score,status:status(score),metrics,warnings};
 };
}
