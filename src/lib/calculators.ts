// Kum türleri ve yaklaşık yoğunlukları; adları ve kısa açıklamaları dil dosyasındadır (`t.calculators.substrates[id]`).
export const substrateTypes = [
  {id:"silica",densityKgPerL:1.55},
  {id:"basalt",densityKgPerL:1.7},
  {id:"aquasoil",densityKgPerL:.85},
  {id:"coral",densityKgPerL:1.25},
  {id:"gravel",densityKgPerL:1.6},
] as const;

const nonNegative = (value: number) => Number.isFinite(value) ? Math.max(0,value) : 0;
const clamp = (value: number,min: number,max: number) => Math.min(max,Math.max(min,nonNegative(value)));

export function calculateAquariumVolume(lengthCm:number,widthCm:number,heightCm:number,lossPercent:number){
  const grossLiters=nonNegative(lengthCm)*nonNegative(widthCm)*nonNegative(heightCm)/1000;
  const netLiters=grossLiters*(1-clamp(lossPercent,0,100)/100);
  return {grossLiters,netLiters,baseAreaM2:nonNegative(lengthCm)*nonNegative(widthCm)/10000};
}

export function calculateWaterChange(volumeLiters:number,percent:number){
  const safeVolume=nonNegative(volumeLiters);const safePercent=clamp(percent,0,100);const changeLiters=safeVolume*safePercent/100;
  return {changeLiters,remainingLiters:safeVolume-changeLiters,tenLiterBuckets:Math.ceil(changeLiters/10)};
}

export function calculateSubstrate(lengthCm:number,widthCm:number,frontHeightCm:number,backHeightCm:number,densityKgPerL:number){
  const averageHeightCm=(nonNegative(frontHeightCm)+nonNegative(backHeightCm))/2;
  const liters=nonNegative(lengthCm)*nonNegative(widthCm)*averageHeightCm/1000;
  return {liters,kilograms:liters*nonNegative(densityKgPerL),averageHeightCm};
}
