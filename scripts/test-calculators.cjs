const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");

require.extensions[".ts"] = (module,filename) => {
  const source=fs.readFileSync(filename,"utf8");
  const output=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022},fileName:filename}).outputText;
  module._compile(output,filename);
};

const {calculateAquariumVolume,calculateSubstrate,calculateWaterChange,substrateTypes}=require(path.resolve(__dirname,"../src/lib/calculators.ts"));

const assertClose=(actual,expected,message)=>assert(Math.abs(actual-expected)<1e-9,`${message}: ${actual} !== ${expected}`);

assert.deepEqual(calculateAquariumVolume(100,45,50,15),{grossLiters:225,netLiters:191.25,baseAreaM2:.45},"Hacim ve dekor/kum kaybı doğru hesaplanmalı");
assert.deepEqual(calculateWaterChange(180,30),{changeLiters:54,remainingLiters:126,tenLiterBuckets:6},"Su değişimi litre ve kova sonucu doğru hesaplanmalı");
const aquasoilResult=calculateSubstrate(100,45,4,7,.85);
assert.equal(aquasoilResult.liters,24.75,"Eğimli aquasoil tabanı litre olarak hesaplanmalı");
assertClose(aquasoilResult.kilograms,21.0375,"Eğimli aquasoil tabanı yaklaşık kg olarak hesaplanmalı");
assert.equal(aquasoilResult.averageHeightCm,5.5,"Eğimli tabanın ortalama yüksekliği hesaplanmalı");
assert.equal(calculateSubstrate(100,45,4,7,1.7).liters,24.75,"Kum cinsi gereken litreyi değiştirmemeli");
assertClose(calculateSubstrate(100,45,4,7,1.7).kilograms,42.075,"Kum cinsi yoğunluk üzerinden yaklaşık ağırlığı değiştirmeli");
assert.deepEqual(calculateAquariumVolume(-100,45,50,150),{grossLiters:0,netLiters:0,baseAreaM2:0},"Geçersiz negatif ölçüler veya yüzde güvenli sonuç üretmeli");
assert.equal(new Set(substrateTypes.map((item)=>item.id)).size,substrateTypes.length,"Kum türü kimlikleri yinelenmemeli");
assert(substrateTypes.every((item)=>item.densityKgPerL>0&&item.name&&item.note),"Her kum türü yaklaşık yoğunluk ve açıklama taşımalı");

console.log(`Hesaplayıcılar: hacim, su değişimi ve ${substrateTypes.length} kum türü başarıyla doğrulandı.`);
