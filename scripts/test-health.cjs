const assert = require("node:assert/strict");
const path = require("node:path");
const fs = require("node:fs");
const Module = require("node:module");
const ts = require("typescript");

const projectRoot = path.resolve(__dirname, "..");
const originalResolveFilename = Module._resolveFilename;
Module._resolveFilename = function resolveAquaMindAlias(request, parent, isMain, options) {
  const resolvedRequest = request.startsWith("@/")
    ? path.join(projectRoot, "src", request.slice(2))
    : request;
  return originalResolveFilename.call(this, resolvedRequest, parent, isMain, options);
};
require.extensions[".ts"] = function compileTypeScript(module, filename) {
  const source = fs.readFileSync(filename, "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
    fileName: filename,
  });
  module._compile(output.outputText, filename);
};

const { analyzeAquarium } = require("../src/lib/health-analysis.ts");

const aquarium = (overrides = {}) => ({
  id: "test-aquarium",
  name: "Test",
  type: "freshwater",
  lengthCm: 60,
  widthCm: 35,
  heightCm: 40,
  netVolumeLiters: 70,
  setupDate: "2026-01-01",
  ...overrides,
});
const animal = (catalogId, commonName, quantity = 1) => ({
  id: `animal-${catalogId}`,
  aquariumId: "test-aquarium",
  catalogId,
  commonName,
  category: "fish",
  quantity,
  addedAt: "2026-01-01",
});
const device = (catalogId, category, brand, model) => ({
  id: `device-${catalogId}`,
  aquariumId: "test-aquarium",
  catalogId,
  category,
  brand,
  model,
  installedAt: "2026-01-01",
});
const warningTitles = analysis => analysis.warnings.map(item => item.title);
const metric = (analysis, key) => analysis.metrics.find(item => item.key === key);

{
  const analysis = analyzeAquarium(
    aquarium(),
    [animal("neon-tetra", "Neon tetra", 8)],
    [
      device("aquael-pat-mini", "filter", "Aquael", "PAT Mini"),
      device("aquael-ultra-75", "heater", "Aquael", "Ultra Heater 75 W"),
    ],
    { id: "water-1", aquariumId: "test-aquarium", measuredAt: "2026-01-02", temperature: 25, ph: 7 },
  );
  assert.equal(metric(analysis, "confidence").score, 100, "Tam katalog verisi %100 güven vermeli");
  assert(!warningTitles(analysis).includes("Filtre akışı güçlü olabilir"));
  assert(!warningTitles(analysis).includes("Isıtıcı hacimle eşleşmiyor"));
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 25, lengthCm: 40 }),
    [animal("betta", "Beta balığı")],
    [device("oase-biomaster-350", "filter", "Oase", "BioMaster 350")],
  );
  assert(warningTitles(analysis).includes("Filtre akışı güçlü olabilir"), "Aşırı filtre debisi uyarılmalı");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 180, lengthCm: 100 }),
    [animal("neon-tetra", "Neon tetra", 8)],
    [device("eheim-thermo-50", "heater", "Eheim", "Thermocontrol 50 W")],
  );
  assert(warningTitles(analysis).includes("Isıtıcı gücü yetersiz olabilir"), "Küçük ısıtıcı uyarılmalı");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 25, lengthCm: 40 }),
    [animal("betta", "Beta balığı")],
    [device("tetra-ht-25", "heater", "Tetra", "HT 25 Electronic")],
  );
  assert.equal(metric(analysis, "heater").status, "good", "Üreticinin 10–25 L aralığındaki HT 25 uygun değerlendirilmeli");
  assert.equal(metric(analysis, "confidence").score, 100, "Üretici hacim aralığı veri güvenini tamamlamalı");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 30, lengthCm: 45 }),
    [animal("betta", "Beta balığı")],
    [device("tetra-ht-25", "heater", "Tetra", "HT 25 Electronic")],
  );
  assert.equal(metric(analysis, "heater").status, "danger", "Üreticinin 25 L üst sınırını aşan HT 25 yetersiz değerlendirilmeli");
  assert(warningTitles(analysis).includes("Isıtıcı gücü yetersiz olabilir"), "HT 25 için üretici hacim üst sınırı aşılırsa açık uyarı verilmeli");
}

{
  const equipment = [device("eheim-thermocontrol-plus-e-250", "heater", "Eheim", "thermocontrol+ e 250")];
  const suitable = analyzeAquarium(
    aquarium({ netVolumeLiters: 500, lengthCm: 150 }),
    [animal("neon-tetra", "Neon tetra", 8)],
    equipment,
  );
  const undersized = analyzeAquarium(
    aquarium({ netVolumeLiters: 650, lengthCm: 180 }),
    [animal("neon-tetra", "Neon tetra", 8)],
    equipment,
  );
  assert.equal(metric(suitable, "heater").status, "good", "Eheim thermocontrol+ e 250 üreticinin 400–600 L aralığında uygun değerlendirilmeli");
  assert.equal(metric(undersized, "heater").status, "danger", "Eheim thermocontrol+ e 250 üreticinin 600 L üst sınırı aşılınca yetersiz değerlendirilmeli");
  assert(warningTitles(undersized).includes("Isıtıcı gücü yetersiz olabilir"), "Eheim akıllı ısıtıcı üst hacmi aşılırsa kullanıcı açıkça uyarılmalı");
}

{
  const equipment = [device("eheim-professionel-4plus-250t", "filter", "Eheim", "Professionel 4+ 250T")];
  const suitable = analyzeAquarium(
    aquarium({ netVolumeLiters: 200, lengthCm: 100 }),
    [animal("neon-tetra", "Neon tetra", 8)],
    equipment,
  );
  const undersized = analyzeAquarium(
    aquarium({ netVolumeLiters: 300, lengthCm: 120 }),
    [animal("neon-tetra", "Neon tetra", 8)],
    equipment,
  );
  assert.equal(metric(suitable, "heater").status, "good", "Eheim Professionel 4+ 250T entegre 210 W ısıtıcısıyla 120–250 L aralığında uygun değerlendirilmeli");
  assert.equal(metric(undersized, "heater").status, "danger", "Eheim Professionel 4+ 250T üreticinin 250 L üst sınırı aşılınca ısıtıcı açısından yetersiz değerlendirilmeli");
  assert(warningTitles(undersized).includes("Isıtıcı gücü yetersiz olabilir"), "Eheim termofiltre üst hacmi aşılırsa kullanıcı ısıtıcı açısından uyarılmalı");
}

{
  const tank = aquarium({ netVolumeLiters: 80, lengthCm: 60 });
  const animals = [animal("neon-tetra", "Neon tetra", 8)];
  const withoutHeater = analyzeAquarium(tank, animals, []);
  const analysis = analyzeAquarium(
    tank,
    animals,
    [device("jbl-protemp-b-20-iii", "heater", "JBL", "PROTEMP b20 III")],
  );
  assert.deepEqual(metric(analysis, "heater"), metric(withoutHeater, "heater"), "Taban ısıtma kablosu ana su ısıtıcısı gibi değerlendirilmemeli");
  assert.match(metric(analysis, "heater").detail, /Katalogdan ısıtıcı bulunamadı/, "Taban ısıtıcısı tek başına ana ısıtıcı sayılmamalı");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 20, lengthCm: 35 }),
    [animal("betta", "Beta balığı")],
    [device("fluval-t100", "heater", "Fluval", "T100")],
  );
  assert(warningTitles(analysis).includes("Isıtıcı akvaryuma göre güçlü olabilir"), "Aşırı güçlü ısıtıcı uyarılmalı");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 100, lengthCm: 80 }),
    [animal("neon-tetra", "Neon tetra", 8)],
    [device("jeneca-gd-320", "filter", "Jeneca", "GD-320")],
  );
  assert(warningTitles(analysis).includes("Ekipman kapasite bilgisi eksik"));
  assert(analysis.warnings.some((warning) => warning.message.includes("Jeneca GD-320")), "Eksik kapasite uyarısı kullanıcıya sorunlu marka ve modeli söylemeli");
  assert(analysis.warnings.some((warning) => warning.message.includes("Jeneca/ALEAS üretici kataloğu")), "Tek eksik ekipman uyarısı katalogdaki doğrulama nedenini göstermeli");
  assert(metric(analysis, "confidence").score < 100, "Debisi bilinmeyen filtre tam güven vermemeli");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 100, lengthCm: 80 }),
    [animal("neon-tetra", "Neon tetra", 8)],
    [device("jeneca-gd-403", "filter", "Jeneca", "GD-403")],
  );
  const warning = analysis.warnings.find((item) => item.title === "Ekipman kapasite bilgisi eksik");
  assert(warning?.message.includes("500 L/saat ve 8 W"), "Çelişkili ekipman uyarısı resmî kaynaktaki değeri açıklamalı");
  assert(warning?.message.includes("800 L/saat ve 10 W"), "Çelişkili ekipman uyarısı ikincil kaynaktaki farklı değeri açıklamalı");
  assert(warning?.message.includes("Çelişki çözülene kadar"), "Çelişkili ekipman uyarısı neden hesap dışı kaldığını açıklamalı");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 70, lengthCm: 60 }),
    [animal("neon-tetra", "Neon tetra", 8)],
    [device("jeneca-ym-03", "filter", "Jeneca", "YM-03")],
  );
  assert.equal(metric(analysis, "filter").status, "danger", "Yüzey skimmeri tek başına ana filtrasyon olarak yeterli sayılmamalı");
  assert(warningTitles(analysis).includes("Ana filtre gerekli"), "Yalnız skimmer seçildiğinde ana filtre uyarısı gösterilmeli");
  assert(!warningTitles(analysis).includes("Filtre akışı güçlü olabilir"), "Skimmer debisi ana filtre çevrimine eklenmemeli");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 70, lengthCm: 60 }),
    [animal("neon-tetra", "Neon tetra", 8)],
    [device("jeneca-ym-01", "filter", "Jeneca", "YM-01")],
  );
  assert.equal(metric(analysis, "filter").status, "danger", "Pompasız yüzey emiş aparatı filtre puanını yükseltmemeli");
  assert(warningTitles(analysis).includes("Ana filtre gerekli"), "Yalnız pasif yüzey emici seçildiğinde ana filtre uyarısı gösterilmeli");
  assert(!warningTitles(analysis).includes("Ekipman kapasite bilgisi eksik"), "Pompasız aksesuar yanlışlıkla kapasite eksiği sayılmamalı");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 400, lengthCm: 150 }),
    [animal("oscar", "Astronot"), animal("neon-tetra", "Neon tetra", 8)],
    [],
  );
  assert(warningTitles(analysis).includes("Astronot: alan sınırda"), "Astronot 540 litre/150 cm altındaki akvaryuma önerilmemeli");
  assert(warningTitles(analysis).includes("Neon tetra için avlanma riski"), "Yırtıcı-küçük tür eşleşmesi uyarılmalı");
  assert(warningTitles(analysis).includes("Astronot: özel bakım gereksinimi"), "Astronot filtrasyon, ısıtıcı, su değişimi ve beslenme güvenliğini göstermeli");
  assert.equal(metric(analysis, "compatibility").status, "danger");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 700, lengthCm: 160 }),
    [animal("rope-fish", "Ropefish")],
    [],
  );
  assert(warningTitles(analysis).includes("Ropefish: özel bakım gereksinimi"), "Tek başına beslenen kaçışçı tür için de kapak uyarısı gösterilmeli");
  assert(analysis.warnings.some((warning) => warning.message.includes("hava boşluğu")), "Ropefish yüzeyden hava alma gereksinimi açıklanmalı");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 300, lengthCm: 120 }),
    [animal("chinese-algae-eater", "Çin yosun yiyici"), animal("pearl-gourami", "İnci gurami", 2)],
    [],
  );
  assert(warningTitles(analysis).includes("Çin yosun yiyici: tank arkadaşı seçimine dikkat"), "Bölgeci ve yavaş balıkları taciz edebilen türler uyarılmalı");
  assert.equal(metric(analysis, "compatibility").status, "warning", "Topluluk ve akıntı riskleri birlikte uyarı seviyesinde gösterilmeli");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 300, lengthCm: 120 }),
    [animal("pictus-catfish", "Pictus kedi balığı", 3), animal("neon-tetra", "Neon tetra", 8)],
    [],
  );
  assert(warningTitles(analysis).includes("Neon tetra için avlanma riski"), "Pictus ile küçük tetra eşleşmesi avlanma riski üretmeli");
  assert.equal(metric(analysis, "compatibility").status, "danger");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 100, lengthCm: 80 }),
    [animal("red-eyed-puffer", "Kırmızı gözlü balon balığı", 2), animal("neon-tetra", "Neon tetra", 8)],
    [],
  );
  assert(warningTitles(analysis).includes("Kırmızı gözlü balon balığı için tür akvaryumu önerilir"), "Agresif tatlı su balon balığı topluluk akvaryumunda tehlike üretmeli");
  assert.equal(metric(analysis, "compatibility").status, "danger");
}

{
  const analysis = analyzeAquarium(
    aquarium(),
    [animal("neon-tetra", "Neon tetra", 8)],
    [device("unknown-filter", "filter", "Bilinmeyen", "X")],
  );
  assert(warningTitles(analysis).includes("Katalogla eşleşmeyen ekipman kaydı var"));
  assert(metric(analysis, "confidence").score < 100, "Eşleşmeyen filtre güven puanını düşürmeli");
}

{
  const analysis = analyzeAquarium(
    aquarium(),
    [animal("neon-tetra", "Neon tetra", 8)],
    [device("ista-bio-sponge-mini", "filter", "ISTA", "Bio Sponge Mini")],
  );
  assert(warningTitles(analysis).includes("Sünger filtre için hava motoru gerekli"), "Hava motorsuz pipo filtre uyarılmalı");
  assert.equal(metric(analysis, "filter").status, "danger");
}

{
  const analysis = analyzeAquarium(
    aquarium(),
    [animal("neon-tetra", "Neon tetra", 8)],
    [
      device("ista-bio-sponge-mini", "filter", "ISTA", "Bio Sponge Mini"),
      device("resun-air-500", "air_pump", "Resun", "AIR-500"),
    ],
  );
  assert(!warningTitles(analysis).includes("Sünger filtre için hava motoru gerekli"), "Hava motoru eklenince pipo filtre bağlantısı hazır olmalı");
  assert.equal(metric(analysis, "filter").status, "good");
  assert.equal(metric(analysis, "confidence").score, 100);
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 75, lengthCm: 60 }),
    [animal("pea-puffer", "Cüce puffer"), animal("neon-tetra", "Neon tetra", 8)],
    [],
  );
  assert(warningTitles(analysis).includes("Cüce puffer için tür akvaryumu önerilir"), "Tür akvaryumu gereksinimi uyarılmalı");
  assert.equal(metric(analysis, "compatibility").status, "danger");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 300, lengthCm: 120 }),
    [animal("convict-cichlid", "Convict ciklet", 2), animal("yellow-lab", "Sarı prenses", 5)],
    [],
  );
  assert(warningTitles(analysis).includes("Convict ciklet için tür akvaryumu önerilir"), "Convict topluluk akvaryumunda agresiflik uyarısı vermeli");
  assert.equal(metric(analysis, "compatibility").status, "danger");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 250, lengthCm: 120 }),
    [animal("demasoni-cichlid", "Demasoni", 6), animal("ramirezi", "Ramirezi", 2)],
    [],
  );
  assert(warningTitles(analysis).includes("Türlerin pH ihtiyaçları uyuşmuyor"), "Malawi ve yumuşak su cikletleri birlikte seçildiğinde pH çakışması uyarılmalı");
  assert.equal(metric(analysis, "compatibility").status, "danger");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 90, lengthCm: 70 }),
    [animal("golden-wonder-killifish", "Golden Wonder killifish"), animal("cherry-shrimp", "Kiraz karides", 10)],
    [],
  );
  assert(warningTitles(analysis).includes("Kiraz karides için avlanma riski"), "Golden Wonder küçük karideslerle birlikte seçildiğinde avlanma uyarısı vermeli");
  assert.equal(metric(analysis, "compatibility").status, "danger");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 500, lengthCm: 180 }),
    [animal("rainbow-shiner", "Rainbow Shiner", 6), animal("discus", "Diskus", 6)],
    [],
  );
  assert(warningTitles(analysis).includes("Türlerin sıcaklık ihtiyaçları uyuşmuyor"), "Soğuk su ve sıcak su türleri birlikte seçildiğinde sıcaklık çakışması uyarılmalı");
  assert.equal(metric(analysis, "compatibility").status, "danger");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 100, lengthCm: 75 }),
    [animal("dwarf-chain-loach", "Cüce zincir loach", 2)],
    [],
  );
  assert(warningTitles(analysis).includes("Cüce zincir loach: grup sayısı düşük"), "Cüce zincir loach küçük grupla girildiğinde sosyal ihtiyaç uyarısı vermeli");
  assert.equal(metric(analysis, "social").status, "danger");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 100, lengthCm: 80 }),
    [animal("neon-tetra", "Neon tetra", 4), animal("neon-tetra", "Neon tetra", 4)],
    [device("aquael-pat-mini", "filter", "Aquael", "PAT Mini")],
  );
  assert(!warningTitles(analysis).includes("Neon tetra: grup sayısı düşük"), "4 + 4 neon toplam sekiz kişilik sürü sayılmalı");
  assert.equal(metric(analysis, "social").status, "good");
  assert.equal(metric(analysis, "confidence").score, 100, "Birleştirilen doğrulanmış kayıtlar veri güveninde kaybolmamalı");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 80, lengthCm: 60 }),
    [animal("axolotl", "Axolotl"), animal("neon-tetra", "Neon tetra", 8)],
    [],
  );
  assert(warningTitles(analysis).includes("Axolotl için tür akvaryumu önerilir"), "Axolotl balıklarla birlikte seçildiğinde tür akvaryumu uyarısı vermeli");
  assert(warningTitles(analysis).includes("Türlerin sıcaklık ihtiyaçları uyuşmuyor"), "Axolotl tropikal balıklarla seçildiğinde sıcaklık çakışması uyarılmalı");
  assert(warningTitles(analysis).includes("Axolotl: özel bakım gereksinimi"), "Axolotl için soğuk su ve düşük akıntı uyarısı görünmeli");
  assert.equal(metric(analysis, "compatibility").status, "danger");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 45, lengthCm: 50 }),
    [animal("african-clawed-frog", "Afrika pençeli kurbağası")],
    [],
  );
  assert(warningTitles(analysis).includes("Afrika pençeli kurbağası: özel bakım gereksinimi"), "Pençeli kurbağa için kapak, hava boşluğu ve taban uyarısı görünmeli");
  assert.equal(metric(analysis, "confidence").score, 100, "Doğrulanmış amfibi kaydı veri güvenini düşürmemeli");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 350, lengthCm: 150 }),
    [animal("green-terror", "Green Terror"), animal("neon-tetra", "Neon tetra", 8)],
    [],
  );
  assert(warningTitles(analysis).includes("Green Terror: tank arkadaşı seçimine dikkat"), "Green Terror başka türlerle seçildiğinde bölgecilik uyarısı vermeli");
  assert.equal(metric(analysis, "compatibility").status, "warning");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 300, lengthCm: 120 }),
    [animal("redhead-tapajos", "Red Head Tapajos", 3)],
    [],
  );
  assert(warningTitles(analysis).includes("Red Head Tapajos: grup sayısı düşük"), "Tapajos üçlü girildiğinde altılı grup gereksinimi uyarılmalı");
  assert(warningTitles(analysis).includes("Red Head Tapajos: özel bakım gereksinimi"), "Tapajos için ince kum ve oturmuş tank uyarısı görünmeli");
  assert.equal(metric(analysis, "social").status, "danger");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 500, lengthCm: 150 }),
    [animal("tropheus-moorii", "Moorii Tropheus", 6)],
    [],
  );
  assert(warningTitles(analysis).includes("Moorii Tropheus: grup sayısı düşük"), "Moorii Tropheus küçük koloniyle girildiğinde en az 15 birey uyarısı vermeli");
  assert(warningTitles(analysis).includes("Moorii Tropheus: özel bakım gereksinimi"), "Moorii Tropheus için kayalık kurulum, oksijen ve bitkisel diyet uyarısı görünmeli");
  assert.equal(metric(analysis, "social").status, "danger");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 500, lengthCm: 150 }),
    [animal("texas-cichlid", "Texas ciklet"), animal("neon-tetra", "Neon tetra", 8)],
    [],
  );
  assert(warningTitles(analysis).includes("Texas ciklet için tür akvaryumu önerilir"), "Texas ciklet küçük topluluk balıklarıyla girildiğinde tür akvaryumu uyarısı vermeli");
  assert.equal(metric(analysis, "compatibility").status, "danger");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 500, lengthCm: 150 }),
    [animal("bala-shark", "Bala Shark", 3)],
    [],
  );
  assert(warningTitles(analysis).includes("Bala Shark: alan sınırda"), "Bala Shark yetişkin sürüsü küçük hacim ve kısa akvaryuma önerilmemeli");
  assert(warningTitles(analysis).includes("Bala Shark: grup sayısı düşük"), "Bala Shark üçlü girildiğinde altılı sürü gereksinimi uyarılmalı");
  assert(warningTitles(analysis).includes("Bala Shark: özel bakım gereksinimi"), "Bala Shark için büyüme, kapak ve oksijen uyarısı görünmeli");
  assert.equal(metric(analysis, "social").status, "danger");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 120, lengthCm: 60 }),
    [animal("chocolate-gourami", "Çikolata gurami", 3), animal("guppy", "Lepistes", 6)],
    [],
  );
  assert(warningTitles(analysis).includes("Çikolata gurami: grup sayısı düşük"), "Çikolata gurami üçlü girildiğinde altılı grup gereksinimi uyarılmalı");
  assert(warningTitles(analysis).includes("Türlerin pH ihtiyaçları uyuşmuyor"), "Çikolata gurami sert su canlılarıyla seçildiğinde pH çakışması uyarılmalı");
  assert(warningTitles(analysis).includes("Çikolata gurami: özel bakım gereksinimi"), "Çikolata gurami için siyah su ve kararlı su uyarısı görünmeli");
  assert.equal(metric(analysis, "compatibility").status, "danger");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 500, lengthCm: 150 }),
    [animal("jaguar-cichlid", "Jaguar ciklet"), animal("neon-tetra", "Neon tetra", 8)],
    [],
  );
  assert(warningTitles(analysis).includes("Jaguar ciklet: alan sınırda"), "Jaguar ciklet 680 litreden ve 182 cm'den küçük akvaryuma önerilmemeli");
  assert(warningTitles(analysis).includes("Neon tetra için avlanma riski"), "Jaguar ciklet küçük balıklarla seçildiğinde avlanma uyarısı vermeli");
  assert(warningTitles(analysis).includes("Jaguar ciklet için tür akvaryumu önerilir"), "Jaguar ciklet karma toplulukta tehlike üretmeli");
  assert.equal(metric(analysis, "compatibility").status, "danger");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 300, lengthCm: 120 }),
    [animal("dark-edged-splitfin", "Koyu kenarlı Splitfin", 6), animal("discus", "Diskus", 6)],
    [],
  );
  assert(warningTitles(analysis).includes("Türlerin sıcaklık ihtiyaçları uyuşmuyor"), "Serin su Splitfin tropikal Diskus ile seçildiğinde sıcaklık çakışması uyarılmalı");
  assert(warningTitles(analysis).includes("Koyu kenarlı Splitfin için tür akvaryumu önerilir"), "Koyu kenarlı Splitfin karma topluluğa önerilmemeli");
  assert.equal(metric(analysis, "compatibility").status, "danger");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 300, lengthCm: 120 }),
    [animal("madagascar-rainbowfish", "Madagaskar gökkuşağı balığı", 10), animal("red-zebra-mbuna", "Kırmızı zebra ciklet", 4)],
    [],
  );
  assert(warningTitles(analysis).includes("Türlerin pH ihtiyaçları uyuşmuyor"), "Madagaskar gökkuşağı alkali Malawi cikletiyle seçildiğinde pH çakışması uyarılmalı");
  assert.equal(metric(analysis, "compatibility").status, "danger");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 250, lengthCm: 120 }),
    [animal("strawberry-rasbora", "Çilek rasbora", 6), animal("red-zebra-mbuna", "Kırmızı zebra ciklet", 4)],
    [],
  );
  assert(warningTitles(analysis).includes("Çilek rasbora: grup sayısı düşük"), "Çilek rasbora altılı girildiğinde en az on ikili sürü gereksinimi uyarılmalı");
  assert(warningTitles(analysis).includes("Türlerin pH ihtiyaçları uyuşmuyor"), "Hassas asidik su rasborası alkali Malawi cikletiyle seçildiğinde pH çakışması uyarılmalı");
  assert(warningTitles(analysis).includes("Çilek rasbora: özel bakım gereksinimi"), "Çilek rasbora için olgun yumuşak su ve düşük nitrat uyarısı görünmeli");
  assert.equal(metric(analysis, "compatibility").status, "danger");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 180, lengthCm: 100 }),
    [animal("zebra-pleco-l046", "Zebra vatoz L046"), animal("goldfish", "Japon balığı", 2)],
    [],
  );
  assert(warningTitles(analysis).includes("Türlerin sıcaklık ihtiyaçları uyuşmuyor"), "Sıcak su uzmanı Zebra vatoz serin su Japon balığıyla seçildiğinde sıcaklık çakışması uyarılmalı");
  assert(warningTitles(analysis).includes("Zebra vatoz L046: özel bakım gereksinimi"), "Zebra vatoz için yüksek oksijen, mağara ve etçil beslenme uyarısı görünmeli");
  assert.equal(metric(analysis, "compatibility").status, "danger");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 300, lengthCm: 120 }),
    [animal("red-clawed-crayfish", "Kırmızı kıskaçlı kerevit"), animal("guppy", "Lepistes", 6)],
    [],
  );
  assert(warningTitles(analysis).includes("Lepistes için avlanma riski"), "Kırmızı kıskaçlı kerevit küçük balıklarla seçildiğinde avlanma uyarısı vermeli");
  assert(warningTitles(analysis).includes("Kırmızı kıskaçlı kerevit için tür akvaryumu önerilir"), "Kırmızı kıskaçlı kerevit karma akvaryuma önerilmemeli");
  assert(warningTitles(analysis).includes("Kırmızı kıskaçlı kerevit: özel bakım gereksinimi"), "Kerevit için kapak, mağara ve sert su uyarısı görünmeli");
  assert.equal(metric(analysis, "compatibility").status, "danger");
}

{
  const analysis = analyzeAquarium(
    aquarium({ type: "freshwater", netVolumeLiters: 100, lengthCm: 60 }),
    [animal("ocellaris-clownfish", "Ocellaris palyaço balığı", 2)],
    [],
  );
  assert(warningTitles(analysis).includes("Ocellaris palyaço balığı: akvaryum türü uyumsuz"), "Deniz balığı tatlı su akvaryumunda açık tehlike üretmeli");
  assert.equal(metric(analysis, "compatibility").status, "danger");
}

{
  const analysis = analyzeAquarium(
    aquarium({ type: "saltwater", netVolumeLiters: 100, lengthCm: 60 }),
    [animal("ocellaris-clownfish", "Ocellaris palyaço balığı", 2)],
    [],
    { id: "marine-water-missing-sg", aquariumId: "test-aquarium", measuredAt: "2026-08-31", temperature: 25, ph: 8.1 },
  );
  assert(warningTitles(analysis).includes("Özgül ağırlık ölçümü gerekli"), "Deniz canlısında tuzluluk ölçümü yoksa kullanıcı uyarılmalı");
  assert(!warningTitles(analysis).includes("Ocellaris palyaço balığı: akvaryum türü uyumsuz"), "Ocellaris tuzlu su akvaryumunda yaşam ortamı uyarısı üretmemeli");
}

{
  const analysis = analyzeAquarium(
    aquarium({ type: "saltwater", netVolumeLiters: 100, lengthCm: 60 }),
    [animal("ocellaris-clownfish", "Ocellaris palyaço balığı", 2)],
    [],
    { id: "marine-water-low-sg", aquariumId: "test-aquarium", measuredAt: "2026-08-31", temperature: 25, ph: 8.1, specificGravity: 1.018 },
  );
  assert(warningTitles(analysis).includes("Özgül ağırlık canlı aralığı dışında"), "Düşük özgül ağırlık deniz canlısı için tehlike üretmeli");
  assert.equal(metric(analysis, "water").status, "warning", "Tek uygunsuz deniz suyu parametresi su metriğini uyarı seviyesine düşürmeli");
}

{
  const analysis = analyzeAquarium(
    aquarium({ type: "saltwater", netVolumeLiters: 80, lengthCm: 70 }),
    [animal("maroon-clownfish", "Maroon palyaço balığı", 2), animal("ocellaris-clownfish", "Ocellaris palyaço balığı", 2)],
    [],
    { id: "marine-water-maroon", aquariumId: "test-aquarium", measuredAt: "2026-08-31", temperature: 25, ph: 8.2, specificGravity: 1.023 },
  );
  assert(warningTitles(analysis).includes("Maroon palyaço balığı: alan sınırda"), "Maroon palyaço balığı 120 litre ve 100 cm altındaki akvaryumda alan uyarısı üretmeli");
  assert(warningTitles(analysis).includes("Maroon palyaço balığı: tank arkadaşı seçimine dikkat"), "Maroon palyaço balığının yüksek bölgeciliği kullanıcıya açıklanmalı");
  assert(!warningTitles(analysis).includes("Özgül ağırlık canlı aralığı dışında"), "Geçerli deniz suyu ölçümü Maroon profili için tuzluluk tehlikesi üretmemeli");
}

{
  const analysis = analyzeAquarium(
    aquarium({ type: "saltwater", netVolumeLiters: 250, lengthCm: 150 }),
    [animal("long-tentacle-anemone", "Uzun tentaküllü anemon"), animal("ocellaris-clownfish", "Ocellaris palyaço balığı", 2)],
    [],
    { id: "marine-water-anemone", aquariumId: "test-aquarium", measuredAt: "2026-08-31", temperature: 25, ph: 8.2, specificGravity: 1.024 },
  );
  assert(warningTitles(analysis).includes("Uzun tentaküllü anemon: alan sınırda"), "Uzun tentaküllü anemon 300 litrenin altında hacim uyarısı üretmeli");
  assert(warningTitles(analysis).includes("Uzun tentaküllü anemon: tank arkadaşı seçimine dikkat"), "Hareketli ve sokucu anemon karma akvaryumda uyumluluk uyarısı üretmeli");
  assert(warningTitles(analysis).includes("Uzun tentaküllü anemon: özel bakım gereksinimi"), "Anemon için kum, ışık, pompa koruması ve bakır uyarıları görünmeli");
}

{
  const analysis = analyzeAquarium(
    aquarium({ type: "saltwater", netVolumeLiters: 300, lengthCm: 50 }),
    [animal("long-tentacle-anemone", "Uzun tentaküllü anemon")],
    [],
    { id: "marine-water-anemone-no-length", aquariumId: "test-aquarium", measuredAt: "2026-08-31", temperature: 25, ph: 8.2, specificGravity: 1.024 },
  );
  assert(!warningTitles(analysis).includes("Uzun tentaküllü anemon: alan sınırda"), "Kaynak tank uzunluğu yayımlamıyorsa sistem uydurma santimetre eşiği uygulamamalı");
}

{
  const analysis = analyzeAquarium(
    aquarium({ type: "saltwater", netVolumeLiters: 120, lengthCm: 60 }),
    [animal("blue-striped-sea-slug", "Mavi çizgili deniz tavşanı"), animal("ocellaris-clownfish", "Ocellaris palyaço balığı", 2)],
    [],
    { id: "marine-water-specialist-slug", aquariumId: "test-aquarium", measuredAt: "2026-08-31", temperature: 25, ph: 8.2, specificGravity: 1.024 },
  );
  assert(warningTitles(analysis).includes("Mavi çizgili deniz tavşanı için tür akvaryumu önerilir"), "Yalnız planarya yiyen deniz tavşanı sıradan topluluk canlısı gibi gösterilmemeli");
  assert(warningTitles(analysis).includes("Mavi çizgili deniz tavşanı: özel bakım gereksinimi"), "Uzman yem ve pompa koruması uyarısı kullanıcıya gösterilmeli");
  assert(!warningTitles(analysis).includes("Mavi çizgili deniz tavşanı: alan sınırda"), "Kaynak tank uzunluğu yayımlamıyorsa nudibranch için uydurma santimetre uyarısı verilmemeli");
}

{
  const analysis = analyzeAquarium(
    aquarium({ type: "saltwater", netVolumeLiters: 100, lengthCm: 40 }),
    [animal("percula-clownfish", "Percula palyaço balığı", 2)],
    [],
    { id: "marine-water-percula-no-length", aquariumId: "test-aquarium", measuredAt: "2026-08-31", temperature: 25, ph: 8.2, specificGravity: 1.023 },
  );
  assert(warningTitles(analysis).includes("Percula palyaço balığı: tank uzunluğu verisi sınırlı"), "Percula kaynağında santimetre eşiği yoksa veri sınırı kullanıcıya açıklanmalı");
  assert(!warningTitles(analysis).includes("Percula palyaço balığı: alan sınırda"), "Percula için kaynaksız tank uzunluğu uyarısı üretilmemeli");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 1000, lengthCm: 200 }),
    [animal("ocellaris-peacock-bass", "Ocellaris peacock bass"), animal("neon-tetra", "Neon tetra", 8)],
    [],
  );
  assert(warningTitles(analysis).includes("Ocellaris peacock bass: alan sınırda"), "Cichla ocellaris 5.000 litre ve 300 cm altındaki akvaryuma önerilmemeli");
  assert(warningTitles(analysis).includes("Ocellaris peacock bass: grup sayısı düşük"), "Cichla ocellaris tek birey yerine doğrulanmış beşli grup gereksinimini göstermeli");
  assert(warningTitles(analysis).includes("Neon tetra için avlanma riski"), "Cichla ocellaris küçük balıklarla seçildiğinde avlanma uyarısı vermeli");
  assert(warningTitles(analysis).includes("Ocellaris peacock bass için tür akvaryumu önerilir"), "Cichla ocellaris topluluk akvaryumunda tehlike üretmeli");
  assert.equal(metric(analysis, "compatibility").status, "danger");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 500, lengthCm: 150 }),
    [animal("winemillers-eartheater", "Winemiller toprak yiyen ciklet", 4)],
    [],
  );
  const spaceWarning = analysis.warnings.find((warning) => warning.title === "Winemiller toprak yiyen ciklet: alan sınırda");
  assert(spaceWarning, "Geophagus winemilleri 648 litre/180 cm altındaki akvaryuma önerilmemeli");
  assert(spaceWarning.message.includes("648 L") && spaceWarning.message.includes("180 cm"), "Geophagus winemilleri alan uyarısı kaynaklı hacim ve uzunluğu göstermeli");
  assert(warningTitles(analysis).includes("Winemiller toprak yiyen ciklet: grup sayısı düşük"), "Geophagus winemilleri altılı grubun altında önerilmemeli");
  assert(warningTitles(analysis).includes("Winemiller toprak yiyen ciklet: özel bakım gereksinimi"), "Geophagus winemilleri kum ve su kalitesi uyarısını göstermeli");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 300, lengthCm: 120 }),
    [animal("threadfin-acara", "Threadfin acara")],
    [],
  );
  const spaceWarning = analysis.warnings.find((warning) => warning.title === "Threadfin acara: alan sınırda");
  assert(spaceWarning, "Acarichthys heckelii 150 cm altındaki akvaryuma önerilmemeli");
  assert(spaceWarning.message.includes("150 cm"), "Acarichthys heckelii alan uyarısı kaynaklı çift taban uzunluğunu göstermeli");
  assert(warningTitles(analysis).includes("Threadfin acara: özel bakım gereksinimi"), "Acarichthys heckelii su kalitesi ve saldırganlık uyarısını göstermeli");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 500, lengthCm: 200 }),
    [animal("african-arowana", "Afrika arowanası"), animal("neon-tetra", "Neon tetra", 8)],
    [],
  );
  assert(warningTitles(analysis).includes("Afrika arowanası: alan sınırda"), "Afrika Arowanası 1.000 litre altındaki akvaryuma önerilmemeli");
  assert(warningTitles(analysis).includes("Afrika arowanası: tank uzunluğu verisi sınırlı"), "Afrika Arowanası için yayımlanmayan santimetre eşiği açıkça belirtilmeli");
  assert(warningTitles(analysis).includes("Neon tetra için avlanma riski"), "Afrika Arowanası küçük balıklarla seçildiğinde avlanma uyarısı vermeli");
  assert(warningTitles(analysis).includes("Afrika arowanası: özel bakım gereksinimi"), "Afrika Arowanası gerçek omnivor beslenme ve uzman bakım uyarısını göstermeli");
  assert.equal(metric(analysis, "compatibility").status, "danger");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 300, lengthCm: 150 }),
    [animal("chinese-high-fin-sucker", "Çin ejderi"), animal("betta", "Beta balığı")],
    [],
  );
  assert(warningTitles(analysis).includes("Çin ejderi: alan sınırda"), "Çin Ejderi 1.135 litre altındaki akvaryuma önerilmemeli");
  assert(warningTitles(analysis).includes("Çin ejderi: tank uzunluğu verisi sınırlı"), "Çin Ejderi için yayımlanmayan santimetre eşiği açıkça belirtilmeli");
  assert(!warningTitles(analysis).includes("Akıntı ihtiyaçları farklı"), "Çin Ejderi için kaynaksız akıntı çatışması üretilmemeli");
  assert(warningTitles(analysis).includes("Çin ejderi: özel bakım gereksinimi"), "Çin Ejderi boy farkı, havuz ve koruma uyarısını göstermeli");
  assert.equal(metric(analysis, "compatibility").status, "danger");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 1000, lengthCm: 200 }),
    [animal("piquiti-peacock-bass", "Piquiti peacock bass"), animal("neon-tetra", "Neon tetra", 8)],
    [],
  );
  const spaceWarning = analysis.warnings.find((warning) => warning.title === "Piquiti peacock bass: alan sınırda");
  assert(spaceWarning, "Cichla piquiti 5.000 litre/300 cm altındaki akvaryuma önerilmemeli");
  assert(spaceWarning.message.includes("5000 L") && spaceWarning.message.includes("300 cm"), "Cichla piquiti alan uyarısı kaynaklı hacim ve uzunluğu göstermeli");
  assert(warningTitles(analysis).includes("Neon tetra için avlanma riski"), "Cichla piquiti küçük balıklarla seçildiğinde avlanma uyarısı vermeli");
  assert(warningTitles(analysis).includes("Piquiti peacock bass için tür akvaryumu önerilir"), "Cichla piquiti sıradan topluluk akvaryumunda tehlike üretmeli");
  assert(warningTitles(analysis).includes("Piquiti peacock bass: özel bakım gereksinimi"), "Cichla piquiti kaynak farkı ve uzman bakım uyarısını göstermeli");
  assert(!warningTitles(analysis).includes("Akıntı ihtiyaçları farklı"), "Cichla piquiti için kaynaksız akıntı çatışması üretilmemeli");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 100, lengthCm: 75 }),
    [animal("peckoltia-l103", "L103 Peckoltia"), animal("manacapuru-bristlenose-l148", "Manacapuru benekli vatoz L148")],
    [],
  );
  assert(warningTitles(analysis).includes("L103 Peckoltia: alan sınırda"), "L103 doğrulanan 112 litre ve 80 cm altında alan uyarısı üretmeli");
  assert(warningTitles(analysis).includes("Manacapuru benekli vatoz L148: alan sınırda"), "L148 doğrulanan 120 litre ve 100 cm altında alan uyarısı üretmeli");
  assert(warningTitles(analysis).includes("L103 Peckoltia: özel bakım gereksinimi"), "L103 kimlik ve bakım sınırlılıklarını kullanıcıya açıklamalı");
  assert(warningTitles(analysis).includes("Manacapuru benekli vatoz L148: özel bakım gereksinimi"), "L148 tarihsel numara ve bakım uyarısını kullanıcıya göstermeli");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 80, lengthCm: 60 }),
    [animal("giant-sailfin-molly", "Velifera", 3)],
    [],
  );
  assert(warningTitles(analysis).includes("Velifera: alan sınırda"), "Velifera 104 litre ve 91 cm altındaki akvaryuma önerilmemeli");
  assert(warningTitles(analysis).includes("Velifera: özel bakım gereksinimi"), "Velifera sert su, grup ve ticari melezlik uyarılarını kullanıcıya göstermeli");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 200, lengthCm: 150 }),
    [animal("butterfly-goodeid", "Kelebek Goodeid", 4), animal("betta", "Beta balığı")],
    [],
  );
  assert(warningTitles(analysis).includes("Kelebek Goodeid: alan sınırda"), "Kelebek Goodeid 250 litrenin altında hacim uyarısı üretmeli");
  assert(warningTitles(analysis).includes("Kelebek Goodeid: grup sayısı düşük"), "Kelebek Goodeid altılı grubun altında sosyal uyarı üretmeli");
  assert(warningTitles(analysis).includes("Kelebek Goodeid: tank uzunluğu verisi sınırlı"), "Kelebek Goodeid için yayımlanmayan santimetre eşiği açıkça belirtilmeli");
  assert(warningTitles(analysis).includes("Kelebek Goodeid için tür akvaryumu önerilir"), "Kelebek Goodeid sıradan topluluk akvaryumunda tehlike üretmeli");
  assert(warningTitles(analysis).includes("Akıntı ihtiyaçları farklı"), "Kelebek Goodeid düşük akıntı isteyen Betta ile seçildiğinde akıntı çatışması vermeli");
  assert(warningTitles(analysis).includes("Kelebek Goodeid: özel bakım gereksinimi"), "Kelebek Goodeid sıcaklık, oksijen ve yüksek su değişimi uyarılarını göstermeli");
  assert.equal(metric(analysis, "compatibility").status, "danger");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 200, lengthCm: 150 }),
    [animal("red-tailed-goodeid", "Kırmızı kuyruklu Goodeid", 4), animal("betta", "Beta balığı")],
    [],
  );
  assert(warningTitles(analysis).includes("Kırmızı kuyruklu Goodeid: alan sınırda"), "Kırmızı kuyruklu Goodeid 250 litrenin altında hacim uyarısı üretmeli");
  assert(warningTitles(analysis).includes("Kırmızı kuyruklu Goodeid: grup sayısı düşük"), "Kırmızı kuyruklu Goodeid altılı grubun altında sosyal uyarı üretmeli");
  assert(warningTitles(analysis).includes("Kırmızı kuyruklu Goodeid: tank uzunluğu verisi sınırlı"), "Kırmızı kuyruklu Goodeid için yayımlanmayan santimetre eşiği açıkça belirtilmeli");
  assert(warningTitles(analysis).includes("Kırmızı kuyruklu Goodeid için tür akvaryumu önerilir"), "Kırmızı kuyruklu Goodeid sıradan topluluk akvaryumunda tehlike üretmeli");
  assert(warningTitles(analysis).includes("Akıntı ihtiyaçları farklı"), "Kırmızı kuyruklu Goodeid düşük akıntı isteyen Betta ile seçildiğinde akıntı çatışması vermeli");
  assert(warningTitles(analysis).includes("Kırmızı kuyruklu Goodeid: özel bakım gereksinimi"), "Kırmızı kuyruklu Goodeid sıcaklık, oksijen, su değişimi ve soy uyarılarını göstermeli");
  assert.equal(metric(analysis, "compatibility").status, "danger");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 60, lengthCm: 80 }),
    [animal("sparkling-limia", "Sparkling Limia", 5)],
    [],
  );
  assert(warningTitles(analysis).includes("Sparkling Limia: alan sınırda"), "Sparkling Limia 75 litrenin altında hacim uyarısı üretmeli");
  assert(warningTitles(analysis).includes("Sparkling Limia: grup sayısı düşük"), "Sparkling Limia altılı grubun altında sosyal uyarı üretmeli");
  assert(warningTitles(analysis).includes("Sparkling Limia: tank uzunluğu verisi sınırlı"), "Sparkling Limia için yayımlanmayan santimetre eşiği açıkça belirtilmeli");
  assert(warningTitles(analysis).includes("Sparkling Limia: özel bakım gereksinimi"), "Sparkling Limia boy farkı, sert su, melezleşme, tuz ve biyolojik yük uyarılarını göstermeli");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 70, lengthCm: 80 }),
    [animal("dark-edged-splitfin", "Koyu kenarlı Splitfin", 4)],
    [],
  );
  assert(warningTitles(analysis).includes("Koyu kenarlı Splitfin: alan sınırda"), "Koyu kenarlı Splitfin 80 litrenin altında hacim uyarısı üretmeli");
  assert(warningTitles(analysis).includes("Koyu kenarlı Splitfin: grup sayısı düşük"), "Koyu kenarlı Splitfin altılı grubun altında sosyal uyarı üretmeli");
  assert(warningTitles(analysis).includes("Koyu kenarlı Splitfin: tank uzunluğu verisi sınırlı"), "Koyu kenarlı Splitfin için yayımlanmayan santimetre eşiği açıkça belirtilmeli");
  assert(warningTitles(analysis).includes("Koyu kenarlı Splitfin: özel bakım gereksinimi"), "Koyu kenarlı Splitfin oksijen, su değişimi, mevsimsel serinlik ve koruma uyarılarını göstermeli");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 60, lengthCm: 60 }),
    [animal("black-neon-tetra", "Siyah neon tetra", 7)],
    [],
  );
  assert(warningTitles(analysis).includes("Siyah neon tetra: alan sınırda"), "Siyah Neon Tetra 72 litre/80 cm altındaki akvaryuma önerilmemeli");
  assert(warningTitles(analysis).includes("Siyah neon tetra: grup sayısı düşük"), "Siyah Neon Tetra sekizli sürünün altında sosyal uyarı üretmeli");
  assert(warningTitles(analysis).includes("Siyah neon tetra: özel bakım gereksinimi"), "Siyah Neon Tetra taban, sürü, düzen ve beslenme uyarılarını göstermeli");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 60, lengthCm: 55 }),
    [animal("glowlight-tetra", "Günışığı tetra", 7)],
    [],
  );
  assert(warningTitles(analysis).includes("Günışığı tetra: alan sınırda"), "Günışığı Tetra 68 litre/60 cm altındaki akvaryuma önerilmemeli");
  assert(warningTitles(analysis).includes("Günışığı tetra: grup sayısı düşük"), "Günışığı Tetra sekizli sürünün altında sosyal uyarı üretmeli");
  assert(warningTitles(analysis).includes("Günışığı tetra: özel bakım gereksinimi"), "Günışığı Tetra taban, sürü, dekor, akıntı ve beslenme uyarılarını göstermeli");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 60, lengthCm: 60 }),
    [animal("black-skirt-tetra", "Siyah etek tetra", 8)],
    [],
  );
  assert(warningTitles(analysis).includes("Siyah etek tetra: alan sınırda"), "Siyah Etek Tetra 68 litre/75 cm altındaki akvaryuma önerilmemeli");
  assert(warningTitles(analysis).includes("Siyah etek tetra: grup sayısı düşük"), "Siyah Etek Tetra 12'li sürünün altında sosyal uyarı üretmeli");
  assert(warningTitles(analysis).includes("Siyah etek tetra: özel bakım gereksinimi"), "Siyah Etek Tetra boy, sürü, yüzgeç ısırma, varyant ve beslenme uyarılarını göstermeli");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 60, lengthCm: 60 }),
    [animal("lemon-tetra", "Limon tetra", 7)],
    [],
  );
  assert(warningTitles(analysis).includes("Limon tetra: alan sınırda"), "Limon Tetra 72 litre/80 cm altındaki akvaryuma önerilmemeli");
  assert(warningTitles(analysis).includes("Limon tetra: grup sayısı düşük"), "Limon Tetra onlu sürünün altında sosyal uyarı üretmeli");
  assert(warningTitles(analysis).includes("Limon tetra: özel bakım gereksinimi"), "Limon Tetra taban, sürü, dekor, akıntı, beslenme ve kimlik uyarılarını göstermeli");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 70, lengthCm: 75 }),
    [animal("emperor-tetra", "İmparator tetra", 7)],
    [],
  );
  assert(warningTitles(analysis).includes("İmparator tetra: alan sınırda"), "İmparator Tetra 81 litre/90 cm altındaki akvaryuma önerilmemeli");
  assert(warningTitles(analysis).includes("İmparator tetra: grup sayısı düşük"), "İmparator Tetra onlu sürünün altında sosyal uyarı üretmeli");
  assert(warningTitles(analysis).includes("İmparator tetra: özel bakım gereksinimi"), "İmparator Tetra erkek bölgesi, akıntı, beslenme ve tür kimliği uyarılarını göstermeli");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 55, lengthCm: 55 }),
    [animal("blue-emperor-tetra", "Mavi imparator tetra", 7)],
    [],
  );
  assert(warningTitles(analysis).includes("Mavi imparator tetra: alan sınırda"), "Mavi İmparator Tetra 68 litre/60 cm altındaki akvaryuma önerilmemeli");
  assert(warningTitles(analysis).includes("Mavi imparator tetra: grup sayısı düşük"), "Mavi İmparator Tetra onlu sürünün altında sosyal uyarı üretmeli");
  assert(warningTitles(analysis).includes("Mavi imparator tetra: özel bakım gereksinimi"), "Mavi İmparator Tetra su kalitesi, akıntı, beslenme, varyant ve tür ayrımı uyarılarını göstermeli");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 70, lengthCm: 75 }),
    [animal("buenos-aires-tetra", "Buenos Aires tetra", 7)],
    [],
  );
  assert(warningTitles(analysis).includes("Buenos Aires tetra: alan sınırda"), "Buenos Aires Tetra 81 litre/90 cm altındaki akvaryuma önerilmemeli");
  assert(warningTitles(analysis).includes("Buenos Aires tetra: grup sayısı düşük"), "Buenos Aires Tetra onlu sürünün altında sosyal uyarı üretmeli");
  assert(warningTitles(analysis).includes("Buenos Aires tetra: özel bakım gereksinimi"), "Buenos Aires Tetra boy farkı, sıcaklık, yüzgeç ısırma, bitki yeme ve taksonomi uyarılarını göstermeli");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 70, lengthCm: 75 }),
    [animal("colombian-tetra", "Kolombiya tetra", 7)],
    [],
  );
  assert(warningTitles(analysis).includes("Kolombiya tetra: alan sınırda"), "Kolombiya Tetra 81 litre/90 cm altındaki akvaryuma önerilmemeli");
  assert(warningTitles(analysis).includes("Kolombiya tetra: grup sayısı düşük"), "Kolombiya Tetra onlu sürünün altında sosyal uyarı üretmeli");
  assert(warningTitles(analysis).includes("Kolombiya tetra: özel bakım gereksinimi"), "Kolombiya Tetra akıntı, beslenme, yüzgeç güvenliği ve kimlik uyarılarını göstermeli");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 80, lengthCm: 75 }),
    [animal("red-eye-tetra", "Kırmızı göz tetra", 6)],
    [],
  );
  assert(warningTitles(analysis).includes("Kırmızı göz tetra: alan sınırda"), "Kırmızı Göz Tetra 103 litre/90 cm altındaki akvaryuma önerilmemeli");
  assert(warningTitles(analysis).includes("Kırmızı göz tetra: grup sayısı düşük"), "Kırmızı Göz Tetra sekizli sürünün altında sosyal uyarı üretmeli");
  assert(warningTitles(analysis).includes("Kırmızı göz tetra: özel bakım gereksinimi"), "Kırmızı Göz Tetra hareketlilik, beslenme, varyant ve taksonomi uyarılarını göstermeli");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 45, lengthCm: 50 }),
    [animal("green-fire-tetra", "Yeşil ateş tetra", 5)],
    [],
  );
  assert(warningTitles(analysis).includes("Yeşil ateş tetra: alan sınırda"), "Yeşil Ateş Tetra 54 litre/60 cm altındaki akvaryuma önerilmemeli");
  assert(warningTitles(analysis).includes("Yeşil ateş tetra: grup sayısı düşük"), "Yeşil Ateş Tetra altılı sürünün altında sosyal uyarı üretmeli");
  assert(warningTitles(analysis).includes("Yeşil ateş tetra: özel bakım gereksinimi"), "Yeşil Ateş Tetra boy farkı, yüzgeç güvenliği, akıntı, beslenme ve kimlik uyarılarını göstermeli");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 45, lengthCm: 50 }),
    [animal("eight-banded-false-barb", "Sekiz bantlı sahte barb", 7)],
    [],
  );
  assert(warningTitles(analysis).includes("Sekiz bantlı sahte barb: alan sınırda"), "Eirmotus octozona 54 litre/60 cm altındaki akvaryuma önerilmemeli");
  assert(warningTitles(analysis).includes("Sekiz bantlı sahte barb: grup sayısı düşük"), "Eirmotus octozona onlu sürünün altında sosyal uyarı üretmeli");
  assert(warningTitles(analysis).includes("Sekiz bantlı sahte barb: özel bakım gereksinimi"), "Eirmotus octozona olgun tank, su kararlılığı, yem rekabeti ve kimlik uyarılarını göstermeli");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 30, lengthCm: 35 }),
    [animal("daisys-blue-ricefish", "Daisy'nin mavi pirinç balığı", 6)],
    [],
  );
  assert(warningTitles(analysis).includes("Daisy'nin mavi pirinç balığı: alan sınırda"), "Oryzias woworae 41 litre/45 cm altındaki akvaryuma önerilmemeli");
  assert(warningTitles(analysis).includes("Daisy'nin mavi pirinç balığı: grup sayısı düşük"), "Oryzias woworae sekizli sürünün altında sosyal uyarı üretmeli");
  assert(warningTitles(analysis).includes("Daisy'nin mavi pirinç balığı: özel bakım gereksinimi"), "Oryzias woworae küçük tank arkadaşı, melezlenme, yavru ve koruma uyarılarını göstermeli");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 45, lengthCm: 50 }),
    [animal("pacific-blue-eye", "Pasifik mavi göz", 7)],
    [],
  );
  assert(warningTitles(analysis).includes("Pasifik mavi göz: alan sınırda"), "Pseudomugil signifer 54 litre/60 cm altındaki akvaryuma önerilmemeli");
  assert(warningTitles(analysis).includes("Pasifik mavi göz: grup sayısı düşük"), "Pseudomugil signifer onlu sürünün altında sosyal uyarı üretmeli");
  assert(warningTitles(analysis).includes("Pasifik mavi göz: özel bakım gereksinimi"), "Pseudomugil signifer boy farkı, kuzey erkeği, olgun tank, tuzluluk ve beslenme uyarılarını göstermeli");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 60, lengthCm: 60 }),
    [animal("red-phantom-tetra", "Kırmızı fantom tetra", 7)],
    [],
  );
  assert(warningTitles(analysis).includes("Kırmızı fantom tetra: alan sınırda"), "Kırmızı Fantom Tetra 72 litre/80 cm altındaki akvaryuma önerilmemeli");
  assert(warningTitles(analysis).includes("Kırmızı fantom tetra: grup sayısı düşük"), "Kırmızı Fantom Tetra onlu sürünün altında sosyal uyarı üretmeli");
  assert(warningTitles(analysis).includes("Kırmızı fantom tetra: özel bakım gereksinimi"), "Kırmızı Fantom Tetra dekor, akıntı, beslenme, taksonomi ve varyant uyarılarını göstermeli");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 45, lengthCm: 50 }),
    [animal("sawbwa-resplendens", "Asya kırmızı burun", 4)],
    [],
  );
  assert(warningTitles(analysis).includes("Asya kırmızı burun: alan sınırda"), "Sawbwa resplendens 54 litre/60 cm altındaki akvaryuma önerilmemeli");
  assert(warningTitles(analysis).includes("Asya kırmızı burun: grup sayısı düşük"), "Sawbwa resplendens beşli cinsiyet grubunun altında sosyal uyarı üretmeli");
  assert(warningTitles(analysis).includes("Asya kırmızı burun: özel bakım gereksinimi"), "Sawbwa resplendens serin su, erkek saldırganlığı, cinsiyet oranı, yem ve koruma uyarılarını göstermeli");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 35, lengthCm: 40 }),
    [animal("phoenix-rasbora", "Phoenix rasbora", 7)],
    [],
  );
  assert(warningTitles(analysis).includes("Phoenix rasbora: alan sınırda"), "Boraras merah 41 litre/45 cm altındaki akvaryuma önerilmemeli");
  assert(warningTitles(analysis).includes("Phoenix rasbora: grup sayısı düşük"), "Boraras merah onlu sürünün altında sosyal uyarı üretmeli");
  assert(warningTitles(analysis).includes("Phoenix rasbora: özel bakım gereksinimi"), "Boraras merah olgun akvaryum, düşük sertlik, küçük yem, kimlik ve koruma uyarılarını göstermeli");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 50, lengthCm: 50 }),
    [animal("red-neon-blue-eye", "Red Neon Blue-eye", 8)],
    [],
  );
  assert(warningTitles(analysis).includes("Red Neon Blue-eye: alan sınırda"), "Pseudomugil luminatus 60 litre/60 cm altındaki akvaryuma önerilmemeli");
  assert(warningTitles(analysis).includes("Red Neon Blue-eye: grup sayısı düşük"), "Pseudomugil luminatus onlu sürünün altında sosyal uyarı üretmeli");
  assert(warningTitles(analysis).includes("Red Neon Blue-eye: özel bakım gereksinimi"), "Pseudomugil luminatus olgun akvaryum, yem, kimlik ve koruma uyarılarını göstermeli");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 50, lengthCm: 50 }),
    [animal("ninja-woodcat", "Ninja woodcat", 4)],
    [],
  );
  assert(warningTitles(analysis).includes("Ninja woodcat: alan sınırda"), "Tatia musaica 56 litre/60 cm altındaki akvaryuma önerilmemeli");
  assert(warningTitles(analysis).includes("Ninja woodcat: grup sayısı düşük"), "Tatia musaica beşli grubun altında sosyal uyarı üretmeli");
  assert(warningTitles(analysis).includes("Ninja woodcat: özel bakım gereksinimi"), "Tatia musaica gece beslenmesi, sıcaklık, kimlik ve su kalitesi uyarılarını göstermeli");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 1000, lengthCm: 220 }),
    [animal("red-bellied-piranha", "Kırmızı karınlı piranha", 5), animal("neon-tetra", "Neon tetra", 10)],
    [],
  );
  assert(warningTitles(analysis).includes("Kırmızı karınlı piranha: alan sınırda"), "Pygocentrus nattereri 1296 litre/240 cm altındaki akvaryuma önerilmemeli");
  assert(warningTitles(analysis).includes("Kırmızı karınlı piranha: grup sayısı düşük"), "Pygocentrus nattereri altılı grubun altında sosyal uyarı üretmeli");
  assert(warningTitles(analysis).includes("Kırmızı karınlı piranha için tür akvaryumu önerilir"), "Pygocentrus nattereri tür akvaryumu güvenliğini göstermeli");
  assert(warningTitles(analysis).includes("Kırmızı karınlı piranha: özel bakım gereksinimi"), "Pygocentrus nattereri bakım güvenliği, yem, alan ve filtrasyon uyarılarını göstermeli");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 1800, lengthCm: 250 }),
    [animal("endlicheri-bichir", "Endlicheri bichir", 1), animal("neon-tetra", "Neon tetra", 10)],
    [],
  );
  assert(warningTitles(analysis).includes("Endlicheri bichir: alan sınırda"), "Polypterus endlicherii 2000 litre/300 cm altındaki akvaryuma önerilmemeli");
  assert(warningTitles(analysis).includes("Endlicheri bichir için tür akvaryumu önerilir"), "Polypterus endlicherii uzman tür akvaryumu güvenliğini göstermeli");
  assert(warningTitles(analysis).includes("Endlicheri bichir: özel bakım gereksinimi"), "Polypterus endlicherii yüzey havası, kaçış kapağı, alan ve sosyal kaynak farkını göstermeli");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 1000, lengthCm: 180 }),
    [animal("monoculus-peacock-bass", "Monoculus peacock bass", 1), animal("neon-tetra", "Neon tetra", 10)],
    [],
  );
  assert(warningTitles(analysis).includes("Monoculus peacock bass: alan sınırda"), "Cichla monoculus 1200 litre/200 cm altındaki akvaryuma önerilmemeli");
  assert(warningTitles(analysis).includes("Monoculus peacock bass için tür akvaryumu önerilir"), "Cichla monoculus tür akvaryumu güvenliğini göstermeli");
  assert(warningTitles(analysis).includes("Monoculus peacock bass: özel bakım gereksinimi"), "Cichla monoculus boy, su kaynağı, yem, filtrasyon ve doğaya bırakmama uyarılarını göstermeli");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 60, lengthCm: 60 }),
    [animal("celebes-rainbowfish", "Celebes gökkuşağı balığı", 6)],
    [],
  );
  assert(warningTitles(analysis).includes("Celebes gökkuşağı balığı: alan sınırda"), "Celebes Gökkuşağı 68 litre/76 cm altındaki akvaryuma önerilmemeli");
  assert(warningTitles(analysis).includes("Celebes gökkuşağı balığı: grup sayısı düşük"), "Celebes Gökkuşağı sekizli sürünün altında sosyal uyarı üretmeli");
  assert(warningTitles(analysis).includes("Celebes gökkuşağı balığı: özel bakım gereksinimi"), "Celebes Gökkuşağı sert su, tuzluluk, akıntı, kapak ve koruma uyarılarını göstermeli");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 70, lengthCm: 75 }),
    [animal("bleeding-heart-tetra", "Kanayan kalp tetra", 7)],
    [],
  );
  assert(warningTitles(analysis).includes("Kanayan kalp tetra: alan sınırda"), "Kanayan Kalp Tetra 81 litre/90 cm altındaki akvaryuma önerilmemeli");
  assert(warningTitles(analysis).includes("Kanayan kalp tetra: grup sayısı düşük"), "Kanayan Kalp Tetra onlu sürünün altında sosyal uyarı üretmeli");
  assert(warningTitles(analysis).includes("Kanayan kalp tetra: özel bakım gereksinimi"), "Kanayan Kalp Tetra olgun tank, organik atık, erkek bölgesi, beslenme ve tür ayrımı uyarılarını göstermeli");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 60, lengthCm: 60 }),
    [animal("diamond-tetra", "Elmas tetra", 6)],
    [],
  );
  assert(warningTitles(analysis).includes("Elmas tetra: alan sınırda"), "Elmas Tetra 68 litre/80 cm altındaki akvaryuma önerilmemeli");
  assert(warningTitles(analysis).includes("Elmas tetra: grup sayısı düşük"), "Elmas Tetra sekizli sürünün altında sosyal uyarı üretmeli");
  assert(warningTitles(analysis).includes("Elmas tetra: özel bakım gereksinimi"), "Elmas Tetra akıntı, dekor, beslenme, taksonomi ve koruma kökeni uyarılarını göstermeli");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 60, lengthCm: 60 }),
    [animal("serpae-tetra", "Serpae tetra", 8)],
    [],
  );
  assert(warningTitles(analysis).includes("Serpae tetra: alan sınırda"), "Serpae Tetra 72 litre/80 cm altındaki akvaryuma önerilmemeli");
  assert(warningTitles(analysis).includes("Serpae tetra: grup sayısı düşük"), "Serpae Tetra on ikili sürünün altında sosyal uyarı üretmeli");
  assert(warningTitles(analysis).includes("Serpae tetra: özel bakım gereksinimi"), "Serpae Tetra yüzgeç ısırma, akıntı, beslenme, taksonomi ve ticari melezlik uyarılarını göstermeli");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 45, lengthCm: 50 }),
    [animal("xray-tetra", "X-ray tetra", 6)],
    [],
  );
  assert(warningTitles(analysis).includes("X-ray tetra: alan sınırda"), "X-ray Tetra 54 litre/60 cm altındaki akvaryuma önerilmemeli");
  assert(warningTitles(analysis).includes("X-ray tetra: grup sayısı düşük"), "X-ray Tetra onlu sürünün altında sosyal uyarı üretmeli");
  assert(warningTitles(analysis).includes("X-ray tetra: özel bakım gereksinimi"), "X-ray Tetra akıntı, tatlı su, beslenme ve GloFish ayrımı uyarılarını göstermeli");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 90, lengthCm: 90 }),
    [animal("congo-tetra", "Kongo tetra", 4)],
    [],
  );
  assert(warningTitles(analysis).includes("Kongo tetra: alan sınırda"), "Kongo Tetra 108 litre/120 cm altındaki akvaryuma önerilmemeli");
  assert(warningTitles(analysis).includes("Kongo tetra: grup sayısı düşük"), "Kongo Tetra beşli sürünün altında sosyal uyarı üretmeli");
  assert(warningTitles(analysis).includes("Kongo tetra: özel bakım gereksinimi"), "Kongo Tetra yüzgeç, su kalitesi, akıntı ve beslenme uyarılarını göstermeli");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 45, lengthCm: 50 }),
    [animal("flame-tetra", "Alev tetra", 7)],
    [],
  );
  assert(warningTitles(analysis).includes("Alev tetra: alan sınırda"), "Alev Tetra 54 litre/60 cm altındaki akvaryuma önerilmemeli");
  assert(warningTitles(analysis).includes("Alev tetra: grup sayısı düşük"), "Alev Tetra onlu sürünün altında sosyal uyarı üretmeli");
  assert(warningTitles(analysis).includes("Alev tetra: özel bakım gereksinimi"), "Alev Tetra olgun tank, su kalitesi, akıntı, beslenme ve koruma uyarılarını göstermeli");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 40, lengthCm: 40 }),
    [animal("endler", "Endler lepistes", 2)],
    [],
  );
  assert(warningTitles(analysis).includes("Endler lepistes: alan sınırda"), "Endler 45 litre/45 cm altındaki akvaryuma önerilmemeli");
  assert(warningTitles(analysis).includes("Endler lepistes: grup sayısı düşük"), "Endler üçlü sosyal grubun altında uyarı üretmeli");
  assert(warningTitles(analysis).includes("Endler lepistes: özel bakım gereksinimi"), "Endler sert su, cinsiyet oranı, hızlı üreme ve ticari melezlik uyarılarını göstermeli");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 80, lengthCm: 70 }),
    [animal("sailfin-molly", "Yelken moli", 2)],
    [],
  );
  assert(warningTitles(analysis).includes("Yelken moli: alan sınırda"), "Yelken Moli 87 litre/76 cm altındaki akvaryuma önerilmemeli");
  assert(warningTitles(analysis).includes("Yelken moli: grup sayısı düşük"), "Yelken Moli üçlü cinsiyet grubunun altında uyarı üretmeli");
  assert(warningTitles(analysis).includes("Yelken moli: özel bakım gereksinimi"), "Yelken Moli sert su, boy farkı, tuz, melezlik ve üreme yükü uyarılarını göstermeli");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 35, lengthCm: 50 }),
    [animal("least-killifish", "Cüce canlı doğuran", 5)],
    [],
  );
  assert(warningTitles(analysis).includes("Cüce canlı doğuran: alan sınırda"), "Cüce Canlı Doğuran 40 litrenin altındaki koloni akvaryumuna önerilmemeli");
  assert(warningTitles(analysis).includes("Cüce canlı doğuran: grup sayısı düşük"), "Cüce Canlı Doğuran altılı koloninin altında uyarı üretmeli");
  assert(warningTitles(analysis).includes("Cüce canlı doğuran: tank uzunluğu verisi sınırlı"), "Cüce Canlı Doğuran için yayımlanmayan koloni uzunluğu açıkça belirtilmeli");
  assert(warningTitles(analysis).includes("Cüce canlı doğuran: özel bakım gereksinimi"), "Cüce Canlı Doğuran boy farkı, akıntı, üreme yükü ve kimlik uyarılarını göstermeli");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 15, lengthCm: 30 }),
    [animal("betta", "Beta balığı")],
    [],
  );
  assert(warningTitles(analysis).includes("Beta balığı: alan sınırda"), "Betta tek erkek için doğrulanan 20 litre altındaki akvaryuma önerilmemeli");
  assert(warningTitles(analysis).includes("Beta balığı: tank uzunluğu verisi sınırlı"), "Betta için yayımlanmayan santimetre eşiği açıkça belirtilmeli");
  assert(warningTitles(analysis).includes("Beta balığı: özel bakım gereksinimi"), "Betta ısıtıcı, filtrasyon ve erkek uyumluluğu bakım uyarılarını kullanıcıya göstermeli");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 120, lengthCm: 100 }),
    [animal("goldfish", "Japon balığı", 2)],
    [],
  );
  const spaceWarning = analysis.warnings.find((warning) => warning.title === "Japon balığı: alan sınırda");
  assert(spaceWarning, "İki yetişkin Japon balığı 150 litreden küçük akvaryuma önerilmemeli");
  assert(spaceWarning.message.includes("150 L"), "Japon balığı alan uyarısı kayıtlı adede göre gereken hacmi göstermeli");
  assert(warningTitles(analysis).includes("Japon balığı: özel bakım gereksinimi"), "Japon balığı filtrasyon, oksijen ve bakım uyarılarını göstermeli");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 1000, lengthCm: 200 }),
    [animal("tiger-shovelnose-catfish", "Kaplan kürek burun kedi balığı"), animal("neon-tetra", "Neon tetra", 8)],
    [],
  );
  const spaceWarning = analysis.warnings.find((warning) => warning.title === "Kaplan kürek burun kedi balığı: alan sınırda");
  assert(spaceWarning, "Pseudoplatystoma tigrinum 10.368 litre/360 cm altındaki akvaryuma önerilmemeli");
  assert(spaceWarning.message.includes("10368 L") && spaceWarning.message.includes("360 cm"), "Kürek burun alan uyarısı kaynaklı erişkin hacim ve uzunluk eşiğini göstermeli");
  assert(warningTitles(analysis).includes("Neon tetra için avlanma riski"), "Pseudoplatystoma tigrinum küçük balıklarla seçildiğinde avlanma uyarısı vermeli");
  assert(warningTitles(analysis).includes("Kaplan kürek burun kedi balığı için tür akvaryumu önerilir"), "Pseudoplatystoma tigrinum sıradan topluluk akvaryumunda tehlike üretmeli");
  assert(warningTitles(analysis).includes("Kaplan kürek burun kedi balığı: özel bakım gereksinimi"), "Pseudoplatystoma tigrinum kamu akvaryumu ölçeğindeki bakım uyarısını göstermeli");
  assert.equal(metric(analysis, "compatibility").status, "danger");
  assert.equal(metric(analysis, "load").status, "danger");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 2000, lengthCm: 300 }),
    [animal("black-sharkminnow", "Siyah labeo", 1), animal("neon-tetra", "Neon tetra", 10)],
    [],
  );
  assert(warningTitles(analysis).includes("Siyah labeo: alan sınırda"), "Siyah Labeo 2500 litre/360 cm altındaki akvaryuma önerilmemeli");
  assert(warningTitles(analysis).includes("Siyah labeo için tür akvaryumu önerilir"), "Siyah Labeo standart topluluk akvaryumuna önerilmemeli");
  assert(warningTitles(analysis).includes("Siyah labeo: özel bakım gereksinimi"), "Siyah Labeo kamu tesisi ölçeği, oksijen ve bakım uyarılarını göstermeli");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 600, lengthCm: 170 }),
    [animal("giant-gourami", "Dev gurami", 1)],
    [],
  );
  assert(warningTitles(analysis).includes("Dev gurami: alan sınırda"), "Dev Gurami 681 litre/183 cm altındaki akvaryuma önerilmemeli");
  assert(warningTitles(analysis).includes("Dev gurami: özel bakım gereksinimi"), "Dev Gurami çıplak minimum, yüzey havası ve filtrasyon uyarılarını göstermeli");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 2400, lengthCm: 280 }),
    [animal("red-bellied-pacu", "Kırmızı karınlı pacu", 1), animal("neon-tetra", "Neon tetra", 10)],
    [],
  );
  assert(warningTitles(analysis).includes("Kırmızı karınlı pacu: alan sınırda"), "Kırmızı Karınlı Pacu 2550 litre/300 cm altındaki akvaryuma önerilmemeli");
  assert(warningTitles(analysis).includes("Neon tetra için avlanma riski"), "Kırmızı Karınlı Pacu küçük balıklarla seçildiğinde fırsatçı avlanma uyarısı vermeli");
  assert(warningTitles(analysis).includes("Kırmızı karınlı pacu için tür akvaryumu önerilir"), "Kırmızı Karınlı Pacu standart topluluk akvaryumuna önerilmemeli");
  assert(warningTitles(analysis).includes("Kırmızı karınlı pacu: özel bakım gereksinimi"), "Kırmızı Karınlı Pacu kaynak hacmi farkı, filtrasyon ve bakım güvenliğini göstermeli");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 9000, lengthCm: 320 }),
    [animal("redtail-catfish", "Kırmızı kuyruk kedi balığı", 1), animal("neon-tetra", "Neon tetra", 10)],
    [],
  );
  assert(warningTitles(analysis).includes("Kırmızı kuyruk kedi balığı: alan sınırda"), "Kırmızı Kuyruk Kedi Balığı 10368 litre/360 cm altındaki sisteme önerilmemeli");
  assert(warningTitles(analysis).includes("Neon tetra için avlanma riski"), "Kırmızı Kuyruk Kedi Balığı küçük balıklarla seçildiğinde avlanma uyarısı vermeli");
  assert(warningTitles(analysis).includes("Kırmızı kuyruk kedi balığı için tür akvaryumu önerilir"), "Kırmızı Kuyruk Kedi Balığı standart topluluk akvaryumuna önerilmemeli");
  assert(warningTitles(analysis).includes("Kırmızı kuyruk kedi balığı: özel bakım gereksinimi"), "Kırmızı Kuyruk Kedi Balığı kamusal ölçek ve beslenme güvenliğini göstermeli");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 4000, lengthCm: 450 }),
    [animal("arowana", "Gümüş arowana", 1), animal("neon-tetra", "Neon tetra", 10)],
    [],
  );
  assert(warningTitles(analysis).includes("Gümüş arowana: alan sınırda"), "Gümüş Arowana 4500 litre/500 cm altındaki sisteme önerilmemeli");
  assert(warningTitles(analysis).includes("Neon tetra için avlanma riski"), "Gümüş Arowana küçük balıklarla seçildiğinde avlanma uyarısı vermeli");
  assert(warningTitles(analysis).includes("Gümüş arowana için tür akvaryumu önerilir"), "Gümüş Arowana standart topluluk akvaryumuna önerilmemeli");
  assert(warningTitles(analysis).includes("Gümüş arowana: özel bakım gereksinimi"), "Gümüş Arowana kapak, filtrasyon ve beslenme güvenliğini göstermeli");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 12000, lengthCm: 400 }),
    [animal("iridescent-shark-catfish", "Pangasius köpek balığı", 1), animal("neon-tetra", "Neon tetra", 10)],
    [],
  );
  assert(warningTitles(analysis).includes("Pangasius köpek balığı: alan sınırda"), "Pangasius 14580 litre/450 cm altındaki sisteme önerilmemeli");
  assert(warningTitles(analysis).includes("Neon tetra için avlanma riski"), "Pangasius küçük balıklarla seçildiğinde avlanma uyarısı vermeli");
  assert(warningTitles(analysis).includes("Pangasius köpek balığı için tür akvaryumu önerilir"), "Pangasius standart topluluk akvaryumuna önerilmemeli");
  assert(warningTitles(analysis).includes("Pangasius köpek balığı: özel bakım gereksinimi"), "Pangasius çarpma, sürü ve kamusal ölçek güvenliğini göstermeli");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 600, lengthCm: 170 }),
    [animal("delhezi-bichir", "Delhezi bichir", 1), animal("neon-tetra", "Neon tetra", 10)],
    [],
  );
  assert(warningTitles(analysis).includes("Delhezi bichir: alan sınırda"), "Delhezi bichir 648 litre/180 cm altındaki akvaryuma önerilmemeli");
  assert(warningTitles(analysis).includes("Neon tetra için avlanma riski"), "Delhezi bichir küçük balıklarla seçildiğinde avlanma uyarısı vermeli");
  assert(warningTitles(analysis).includes("Delhezi bichir: özel bakım gereksinimi"), "Delhezi bichir yüzey havası, kaçış ve gece beslenmesi güvenliğini göstermeli");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 5000, lengthCm: 350 }),
    [animal("giant-snakehead", "Dev kırmızı yılanbaş", 1), animal("neon-tetra", "Neon tetra", 10)],
    [],
  );
  assert(warningTitles(analysis).includes("Dev kırmızı yılanbaş: alan sınırda"), "Dev yılanbaş 6000 litre/400 cm altındaki sisteme önerilmemeli");
  assert(warningTitles(analysis).includes("Neon tetra için avlanma riski"), "Dev yılanbaş küçük balıklarla seçildiğinde avlanma uyarısı vermeli");
  assert(warningTitles(analysis).includes("Dev kırmızı yılanbaş için tür akvaryumu önerilir"), "Dev yılanbaş standart topluluk akvaryumuna önerilmemeli");
  assert(warningTitles(analysis).includes("Dev kırmızı yılanbaş: özel bakım gereksinimi"), "Dev yılanbaş kamu tesisi, kapak ve beslenme güvenliğini göstermeli");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 50, lengthCm: 50 }),
    [animal("dwarf-gourami", "Cüce gurami", 1)],
    [],
  );
  assert(warningTitles(analysis).includes("Cüce gurami: alan sınırda"), "Cüce gurami 56 litre/60 cm altındaki akvaryuma önerilmemeli");
  assert(warningTitles(analysis).includes("Cüce gurami: grup sayısı düşük"), "Cüce gurami tek girildiğinde kaynaklı çift önerisi gösterilmeli");
  assert(warningTitles(analysis).includes("Cüce gurami: özel bakım gereksinimi"), "Cüce gurami DGIV, düşük akıntı ve bitki güvenliğini göstermeli");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 100, lengthCm: 100 }),
    [animal("pearl-gourami", "İnci gurami", 1)],
    [],
  );
  assert(warningTitles(analysis).includes("İnci gurami: alan sınırda"), "İnci gurami 120 cm kaynak eşiğinin altındaki akvaryuma önerilmemeli");
  assert(!warningTitles(analysis).includes("İnci gurami: grup sayısı düşük"), "İnci gurami kaynak olmadan zorunlu çift veya sürü uyarısı üretmemeli");
  assert(warningTitles(analysis).includes("İnci gurami: özel bakım gereksinimi"), "İnci gurami kaynak farkı, bitki ve davranış güvenliğini göstermeli");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 500, lengthCm: 150 }),
    [animal("clown-loach", "Makrakanta", 3)],
    [],
  );
  assert(warningTitles(analysis).includes("Makrakanta: alan sınırda"), "Makrakanta 648 litre/180 cm altındaki akvaryuma önerilmemeli");
  assert(warningTitles(analysis).includes("Makrakanta: grup sayısı düşük"), "Makrakanta beşli grubun altında sosyal uyarı üretmeli");
  assert(warningTitles(analysis).includes("Makrakanta: özel bakım gereksinimi"), "Makrakanta olgun tank, oksijen, kapak ve uzun ömür güvenliğini göstermeli");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 45, lengthCm: 50 }),
    [animal("neon-tetra", "Neon tetra", 6)],
    [],
  );
  assert(warningTitles(analysis).includes("Neon tetra: alan sınırda"), "Neon tetra 54 litre/60 cm altındaki akvaryuma önerilmemeli");
  assert(warningTitles(analysis).includes("Neon tetra: grup sayısı düşük"), "Neon tetra sekizli sürünün altında sosyal uyarı üretmeli");
  assert(warningTitles(analysis).includes("Neon tetra: özel bakım gereksinimi"), "Neon tetra stok, hastalık ve kararlı su güvenliğini göstermeli");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 45, lengthCm: 50 }),
    [animal("cardinal-tetra", "Kardinal tetra", 6)],
    [],
  );
  assert(warningTitles(analysis).includes("Kardinal tetra: alan sınırda"), "Kardinal tetra 54 litre/60 cm altındaki akvaryuma önerilmemeli");
  assert(warningTitles(analysis).includes("Kardinal tetra: grup sayısı düşük"), "Kardinal tetra sekizli sürünün altında sosyal uyarı üretmeli");
  assert(warningTitles(analysis).includes("Kardinal tetra: özel bakım gereksinimi"), "Kardinal tetra köken, düşük akıntı ve su kalitesi güvenliğini göstermeli");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 35, lengthCm: 40 }),
    [animal("corydoras-panda", "Panda çöpçü", 4)],
    [],
  );
  assert(warningTitles(analysis).includes("Panda çöpçü: alan sınırda"), "Panda çöpçü 41 litre/45 cm altındaki akvaryuma önerilmemeli");
  assert(warningTitles(analysis).includes("Panda çöpçü: grup sayısı düşük"), "Panda çöpçü altılı grubun altında sosyal uyarı üretmeli");
  assert(warningTitles(analysis).includes("Panda çöpçü: özel bakım gereksinimi"), "Panda çöpçü güncel kimlik, taban ve sıcaklık güvenliğini göstermeli");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 40, lengthCm: 50 }),
    [animal("molly", "Moli", 2)],
    [],
  );
  assert(warningTitles(analysis).includes("Moli: alan sınırda"), "Moli 45 litre/60 cm altındaki akvaryuma önerilmemeli");
  assert(warningTitles(analysis).includes("Moli: grup sayısı düşük"), "Moli üçlü grubun altında sosyal uyarı üretmeli");
  assert(warningTitles(analysis).includes("Moli: özel bakım gereksinimi"), "Moli sert su, kimlik ve haftalık bakım güvenliğini göstermeli");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 40, lengthCm: 50 }),
    [animal("platy", "Plati", 2)],
    [],
  );
  assert(warningTitles(analysis).includes("Plati: alan sınırda"), "Plati 45 litre/60 cm altındaki akvaryuma önerilmemeli");
  assert(warningTitles(analysis).includes("Plati: grup sayısı düşük"), "Plati üçlü grubun altında sosyal uyarı üretmeli");
  assert(warningTitles(analysis).includes("Plati: özel bakım gereksinimi"), "Plati sert su, melezlik ve haftalık bakım güvenliğini göstermeli");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 70, lengthCm: 80 }),
    [animal("swordtail", "Kılıçkuyruk", 2)],
    [],
  );
  assert(warningTitles(analysis).includes("Kılıçkuyruk: alan sınırda"), "Kılıçkuyruk 80 litre/91 cm altındaki akvaryuma önerilmemeli");
  assert(warningTitles(analysis).includes("Kılıçkuyruk: grup sayısı düşük"), "Kılıçkuyruk üçlü grubun altında sosyal uyarı üretmeli");
  assert(warningTitles(analysis).includes("Kılıçkuyruk: özel bakım gereksinimi"), "Kılıçkuyruk oksijen, akıntı, melezlik ve haftalık bakım güvenliğini göstermeli");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 35, lengthCm: 40 }),
    [animal("ember-tetra", "Ember tetra", 6)],
    [],
  );
  assert(warningTitles(analysis).includes("Ember tetra: alan sınırda"), "Ember tetra 41 litre/45 cm altındaki akvaryuma önerilmemeli");
  assert(warningTitles(analysis).includes("Ember tetra: grup sayısı düşük"), "Ember tetra sekizli sürünün altında sosyal uyarı üretmeli");
  assert(warningTitles(analysis).includes("Ember tetra: özel bakım gereksinimi"), "Ember tetra nazik filtrasyon, bitki ve küçük yem güvenliğini göstermeli");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 100, lengthCm: 80 }),
    [animal("rummy-nose", "Kırmızı burun tetra", 8)],
    [],
  );
  assert(warningTitles(analysis).includes("Kırmızı burun tetra: alan sınırda"), "Kırmızı burun tetra 120 litre/90 cm altındaki akvaryuma önerilmemeli");
  assert(warningTitles(analysis).includes("Kırmızı burun tetra: grup sayısı düşük"), "Kırmızı burun tetra onlu sürünün altında sosyal uyarı üretmeli");
  assert(warningTitles(analysis).includes("Kırmızı burun tetra: özel bakım gereksinimi"), "Kırmızı burun tetra olgun tank, kimlik ve haftalık bakım güvenliğini göstermeli");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 45, lengthCm: 50 }),
    [animal("harlequin-rasbora", "Harlequin rasbora", 6)],
    [],
  );
  assert(warningTitles(analysis).includes("Harlequin rasbora: alan sınırda"), "Harlequin rasbora 54 litre/60 cm altındaki akvaryuma önerilmemeli");
  assert(warningTitles(analysis).includes("Harlequin rasbora: grup sayısı düşük"), "Harlequin rasbora sekizli sürünün altında sosyal uyarı üretmeli");
  assert(warningTitles(analysis).includes("Harlequin rasbora: özel bakım gereksinimi"), "Harlequin rasbora kimlik, düşük akıntı ve bitki güvenliğini göstermeli");
}

console.log("Sağlık analizi: 113 senaryo başarıyla doğrulandı.");
