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
    aquarium({ netVolumeLiters: 30, lengthCm: 45 }),
    [animal("betta", "Beta balığı")],
    [device("tetra-ht-25", "heater", "Tetra", "HT 25 Electronic")],
  );
  assert.equal(metric(analysis, "heater").status, "good", "Watt değeri bilinen ısıtıcı otomatik değerlendirilmeli");
  assert.equal(metric(analysis, "confidence").score, 100, "Watt tabanlı hesap veri güvenini tamamlamalı");
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
    [device("jeneca-xp-605", "filter", "Jeneca", "XP-605")],
  );
  assert(warningTitles(analysis).includes("Ekipman kapasite bilgisi eksik"));
  assert(analysis.warnings.some((warning) => warning.message.includes("Jeneca XP-605")), "Eksik kapasite uyarısı kullanıcıya sorunlu marka ve modeli söylemeli");
  assert(metric(analysis, "confidence").score < 100, "Debisi bilinmeyen filtre tam güven vermemeli");
}

{
  const analysis = analyzeAquarium(
    aquarium({ netVolumeLiters: 400, lengthCm: 150 }),
    [animal("oscar", "Astronot"), animal("neon-tetra", "Neon tetra", 8)],
    [],
  );
  assert(warningTitles(analysis).includes("Neon tetra için avlanma riski"), "Yırtıcı-küçük tür eşleşmesi uyarılmalı");
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

console.log("Sağlık analizi: 35 senaryo başarıyla doğrulandı.");
