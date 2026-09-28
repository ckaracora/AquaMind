# AquaMind uyumluluk motoru

Son güncelleme: 2026-09-27 (kural seti 1.2.0, su kalitesi ve kesin tehlike; geçersiz ölçüm kuralı).

## Temel kural

Uyumluluk puanı, alt puanlar ve bulgular yalnızca `packages/compatibility-engine` içindeki deterministik ve testli motordan gelir. Yapay zekâ hiçbir zaman puan üretmez; ileride yalnızca motorun sonucunu açıklar. Aynı girdi her zaman aynı çıktıyı verir.

## Yerleşim

| Parça | Yer | Görev |
|---|---|---|
| Motor | `packages/compatibility-engine/src/index.ts` | `createAnalyzer(resolver)` → `analyzeAquarium(aquarium, animals, equipment, latest?)` |
| Sürümler | `packages/compatibility-engine/src/version.ts` | `ENGINE_VERSION`, `RULESET_VERSION` (ayrı sabitler) |
| Uyarlayıcı | `src/lib/health-analysis.ts` | Kataloğun dört fonksiyonunu çözümleyici olarak bağlar; `analyzeAquarium`'u aynı imzayla dışa aktarır |
| Bilgi | `src/data/catalog.ts` | Canlı ve ekipman profilleri, doğrulanmışlık kuralı |
| Testler | `packages/compatibility-engine/test/` | Altın karşılaştırma, bağımsızlık, mevcut senaryo betiği |
| Mevcut senaryolar | `scripts/test-health.cjs` | 52 senaryo; `pnpm verify` doğrudan, `pnpm test` alt süreç olarak çalıştırır |

## Sınır: `KnowledgeResolver`

Motor kataloğu içe aktarmaz. Bilgiye şu arayüzle ulaşır:

```ts
interface KnowledgeResolver {
  speciesForLivestock(item: Livestock): SpeciesProfileInput | undefined;
  profileForEquipment(item: Equipment): EquipmentProfileInput | undefined;
  isVerifiedSpeciesProfile(profile?: SpeciesProfileInput): boolean;
  isVerifiedEquipmentProfile(profile?: EquipmentProfileInput): boolean;
}
```

`SpeciesProfileInput` ve `EquipmentProfileInput`, motorun bir profilden okuduğu alan alt kümesidir. Katalogdaki `SpeciesProfile` ve `EquipmentProfile` bunları yapısal olarak karşılar; uyarlayıcı derlenirken `tsc` bunu denetler. Katalog tipleri `src/data/catalog.ts` içinde kalır; kataloglar `packages/knowledge` altına taşındığında (Phase 2) çözümleyici oradan bağlanır, motor değişmez. Aynı arayüz ileride veritabanından beslenen bir çözümleyiciyle de kullanılabilir.

## Sonuç biçimi (Phase 0B'de değişmedi)

```ts
interface HealthAnalysis {
  score: number;                       // 0–100, sekiz metriğin eşit ağırlıklı ortalaması; kesin tehlikede en fazla 49
  status: "good" | "warning" | "danger";
  metrics: HealthMetric[];             // load, space, social, compatibility, filter, heater, water, confidence
  warnings: Array<{ level: "warning" | "danger"; title: string; message: string }>;
}
```

Sonuç nesnesine sürüm veya bulgu kodu alanı **eklenmedi**; bu, çıktı biçimini değiştirir ve altın karşılaştırmayı bozardı. Sürümler ayrı sabit olarak dışa aktarılır ve Phase 1'de kalıcı hesaplama kaydına (`compatibility_calculations`) eşlik eder. Uyarı başlık ve mesajları bugün Türkçe metin olarak motorun içinde üretilir; kararlı bulgu kodları ve yerelleştirme Phase 1'de, sonuç biçiminin sürümlenmesiyle birlikte ele alınır.

## Kural seti (mevcut sabitler)

Motorun içine gömülü eşikler `RULESET_VERSION` ile sürümlenir. Mevcut sürüm 1.2.0:

- Etkin hacim: net hacmin 0,85'i. Biyolojik yük = Σ(adet × yetişkin boy × atık katsayısı) / etkin hacim.
- Filtre: nominal debinin 0,65'i etkin sayılır; hedef çevrim 5–10/saat, düşük akıntı seven türler çoğunluktaysa 3–7/saat, yük arttıkça hedef yükselir.
- Isıtıcı: üretici hacim aralığı varsa o, yoksa 0,5–1,5 W/L bandı.
- Yaşam ortamı: canlının su türü (`waterTypes`; belirtilmemişse yalnızca tatlı su) akvaryum türünü içermiyorsa tehlike uyarısı verilir.
- Alan: gereken hacim = en az hacim + (adet − 1) × birey başına ek hacim (tanımlıysa). Kaynak tank uzunluğu yayımlamıyorsa yalnızca hacim denetlenir ve bunu belirten bir uyarı gösterilir.
- Filtre türleri: pasif parçalar filtre hesabına girmez; yardımcı filtreler (ör. yüzey skimmeri) ana filtrenin yerine geçmez, akvaryumda yalnız yardımcı filtre varsa tehlike uyarısı verilir.
- Tuzluluk: deniz ve acı su profillerinde özgül ağırlık aralığı tanımlıdır; ölçüm yoksa uyarı, son ölçüm aralık dışındaysa tehlike uyarısı verilir.
- Uyum cezaları: yaşam ortamı uyumsuzluğu 80, sıcaklık kesişimi yok 55, pH kesişimi yok 55, akıntı çatışması 20, avlanma 60, tür akvaryumu gerektiren canlı 60, topluluk uyarısı 30.
- Avlanma: av, avcının yetişkin boyunun %40'ı veya altındaysa.
- Su değeri uyumu: son ölçümün sıcaklığı, pH'ı, (tanımlı profillerde) özgül ağırlığı ve amonyak, nitrit, nitrat seviyeleri.
- Su kalitesi (OATA, Ekim 2022): amonyak ve nitrit sıfırın üstündeyse uyarı. Serbest amonyak tatlı suda 0,02, deniz ve acı suda 0,01 mg/L'yi; nitrit tatlı suda 0,2, deniz ve acı suda 0,125 mg/L'yi aşarsa tehlike. Serbest amonyak = toplam amonyak × Florida DEP kesri (pKa = 0,0901821 + 2729,92 / (°C + 273,2)); pH veya sıcaklık yoksa ya da geçersizse toplamın tamamı zehirli sayılır. Nitrat tatlı ve acı suda 50 mg/L üstü uyarı, 100 mg/L üstü tehlike; denizde 100 mg/L üstü tehlike. Negatif, sayı olmayan veya sonsuz amonyak, nitrit ve nitrat değerlendirilmez ("uygun" sayılmaz, puana girmez) ve "Geçersiz su ölçümü" uyarısı verilir.
- Kesin tehlike: yaşam ortamı uyumsuzluğu, sıcaklık veya pH kesişiminin olmaması, avlanma, tür akvaryumu gerektiren canlı, aralık dışı tuzluluk, zehirli amonyak veya sınırı aşan nitrit varsa genel puan en fazla 49 olur (durum "tehlike"). Tahmine dayalı biyolojik yük, filtre ve ısıtıcı uyarıları genel durumu kilitlemez.
- Veri güveni: doğrulanmış (kaynaklı) kayıtların güvenlik hesabına giren kayıtlara oranı.

Bu sabitler Phase 0B'de değiştirilmedi. 1.1.0'da katalog entegrasyonuyla yaşam ortamı, tuzluluk, birey başına ek hacim ve yardımcı filtre kuralları eklendi (bkz. `docs/DECISIONS/0007-katalog-entegrasyonu-motor-kurallari.md`). 1.2.0'da su kalitesi eşikleri ve kesin tehlike kuralı eklendi (bkz. `docs/DECISIONS/0008-su-kalitesi-ve-kesin-tehlike.md`).

## Değişmezlik güvencesi

- `test/fixtures/golden-v1.json`: ilk sürümü motor taşınmadan önce, `8d6a164` içeriğindeki orijinal `src/lib/health-analysis.ts` ile alınmış 604 vakalık çıktıydı. Motor 1.1.0 ile yeniden üretildi: 1020 vaka (417 türün her biri için kendi su türünde "sığar" ve "dar" senaryosu, 60 filtre, 30 ısıtıcı, 10 hava motoru, 84 tür çifti, tohum veri, boş akvaryum). Yeniden üretimden önce, pakete taşınan kuralların `codex/catalog-capacity-batch` dalındaki (`950a70f`) özgün motorla 1020 vakanın tamamında birebir aynı çıktıyı verdiği doğrulandı. Motor 1.2.0 (su kalitesi ve kesin tehlike) için ürün sahibi onayından sonra yeniden üretildi; vaka sayısı değişmedi. Vakalar `test/fixtures/golden-cases.ts` ile deterministik üretilir.
- `test/golden.test.ts`: uyarlayıcının bugünkü çıktısını fikstürle `toStrictEqual` ile karşılaştırır. Fikstür yoksa test başarısız olur; sessizce yazılmaz.
- `test/legacy-scripts.test.ts`: `scripts/test-health.cjs` betiğini alt süreç olarak çalıştırır; 52 senaryo tek kaynakta kalır, kopyalanmaz.
- `test/isolation.test.ts`: motorun katalog modüllerini içe aktarmadığını ve stub çözümleyiciyle çalıştığını gösterir.
- `test/water-quality.test.ts`: serbest amonyak formülünü Florida DEP'in yayımlanmış tablosuyla, su kalitesi eşiklerini OATA değerleriyle, geçersiz (negatif, sayı olmayan, sonsuz) değerlerin sınırını ayrıca sınar.
- `test/audit-scenarios.test.ts`: 2026-09-24 denetim senaryoları ve bulguları. Düzeltilenler kalıcı testtir; henüz düzeltilmeyenler (yedi senaryo ve alan uyarısının şiddeti) `it.todo` olarak görünür kalır. Geçersiz ölçümün ve eksik pH/sıcaklık mesajının motor çıktısındaki etkisi de burada sınanır.

## Kural kaynakları

- OATA, "OATA water quality criteria", Ekim 2022: https://ornamentalfish.org/wp-content/uploads/OATA-Water-quality-criteria-Oct-2022.pdf
- Florida Department of Environmental Protection, "Calculation of un-ionized ammonia in fresh water", Rev. 2, 2001: https://floridadep.gov/sites/default/files/5-Unionized-Ammonia-SOP_1.pdf
- İnsani Tüketim Amaçlı Sular Hakkında Yönetmelik, Resmî Gazete 17.02.2005, Ek-1 (içme suyunda nitrat en fazla 50 mg/L): https://www.resmigazete.gov.tr/eskiler/2005/02/20050217-3.htm

## Motoru değiştirme kuralı

1. Puanı, eşikleri veya uyarıları değiştiren her değişiklik önce ürün sahibi onayı ve kısa bir karar kaydı ister.
2. `ENGINE_VERSION` (kod) ve/veya `RULESET_VERSION` (sabitler) yükseltilir.
3. Altın fikstür yalnızca bu onaydan sonra ve şu komutla yeniden üretilir; yeniden üretim tek başına bir commit olarak görünmeli ve incelemede gerekçelendirilmelidir:

```bash
AQUAMIND_GOLDEN_CAPTURE=1 pnpm exec vitest run packages/compatibility-engine/test/golden.test.ts
```

4. Etkilenen `scripts/test-health.cjs` senaryoları aynı değişiklikte güncellenir; test zayıflatılarak geçirilmez.
5. Katalog verisi puanı geçirmek için değiştirilmez.

## Planlanan (Phase 1 ve sonrası)

- Kalıcı hesaplama kaydı: `compatibility_calculations(engine_version, ruleset_version, knowledge_version, input_snapshot, score, subscores, findings)`; "AquaMind neden %73 hesapladı?" sorusu bu kayıtla yanıtlanır.
- Kararlı bulgu kodları ve yerelleştirilebilir mesajlar (sonuç biçimi v2, ayrı onayla).
- Bilgi anlık görüntüsü (`knowledge_releases`) üzerinden çözümleyici; motor testleri veritabanına ihtiyaç duymaz.
- Yapay zekâ açıklaması: motor sonucu girdi, açıklama çıktı; puan asla yapay zekâdan gelmez.
