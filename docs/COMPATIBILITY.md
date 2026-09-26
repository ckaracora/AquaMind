# AquaMind uyumluluk motoru

Son güncelleme: 2026-09-24 (kural seti 1.1.0, katalog entegrasyonu).

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
  score: number;                       // 0–100, sekiz metriğin eşit ağırlıklı ortalaması
  status: "good" | "warning" | "danger";
  metrics: HealthMetric[];             // load, space, social, compatibility, filter, heater, water, confidence
  warnings: Array<{ level: "warning" | "danger"; title: string; message: string }>;
}
```

Sonuç nesnesine sürüm veya bulgu kodu alanı **eklenmedi**; bu, çıktı biçimini değiştirir ve altın karşılaştırmayı bozardı. Sürümler ayrı sabit olarak dışa aktarılır ve Phase 1'de kalıcı hesaplama kaydına (`compatibility_calculations`) eşlik eder. Uyarı başlık ve mesajları bugün Türkçe metin olarak motorun içinde üretilir; kararlı bulgu kodları ve yerelleştirme Phase 1'de, sonuç biçiminin sürümlenmesiyle birlikte ele alınır.

## Kural seti (mevcut sabitler)

Motorun içine gömülü eşikler `RULESET_VERSION` ile sürümlenir. Mevcut sürüm 1.1.0:

- Etkin hacim: net hacmin 0,85'i. Biyolojik yük = Σ(adet × yetişkin boy × atık katsayısı) / etkin hacim.
- Filtre: nominal debinin 0,65'i etkin sayılır; hedef çevrim 5–10/saat, düşük akıntı seven türler çoğunluktaysa 3–7/saat, yük arttıkça hedef yükselir.
- Isıtıcı: üretici hacim aralığı varsa o, yoksa 0,5–1,5 W/L bandı.
- Yaşam ortamı: canlının su türü (`waterTypes`; belirtilmemişse yalnızca tatlı su) akvaryum türünü içermiyorsa tehlike uyarısı verilir.
- Alan: gereken hacim = en az hacim + (adet − 1) × birey başına ek hacim (tanımlıysa). Kaynak tank uzunluğu yayımlamıyorsa yalnızca hacim denetlenir ve bunu belirten bir uyarı gösterilir.
- Filtre türleri: pasif parçalar filtre hesabına girmez; yardımcı filtreler (ör. yüzey skimmeri) ana filtrenin yerine geçmez, akvaryumda yalnız yardımcı filtre varsa tehlike uyarısı verilir.
- Tuzluluk: deniz ve acı su profillerinde özgül ağırlık aralığı tanımlıdır; ölçüm yoksa uyarı, son ölçüm aralık dışındaysa tehlike uyarısı verilir.
- Uyum cezaları: yaşam ortamı uyumsuzluğu 80, sıcaklık kesişimi yok 55, pH kesişimi yok 55, akıntı çatışması 20, avlanma 60, tür akvaryumu gerektiren canlı 60, topluluk uyarısı 30.
- Avlanma: av, avcının yetişkin boyunun %40'ı veya altındaysa.
- Su değeri uyumu: son ölçümün sıcaklığı, pH'ı ve (tanımlı profillerde) özgül ağırlığı. Amonyak, nitrit ve nitrat bu sürümde değerlendirilmez.
- Veri güveni: doğrulanmış (kaynaklı) kayıtların güvenlik hesabına giren kayıtlara oranı.

Bu sabitler Phase 0B'de değiştirilmedi. 1.1.0'da katalog entegrasyonuyla yaşam ortamı, tuzluluk, birey başına ek hacim ve yardımcı filtre kuralları eklendi (bkz. `docs/DECISIONS/0007-katalog-entegrasyonu-motor-kurallari.md`).

## Değişmezlik güvencesi

- `test/fixtures/golden-v1.json`: ilk sürümü motor taşınmadan önce, `8d6a164` içeriğindeki orijinal `src/lib/health-analysis.ts` ile alınmış 604 vakalık çıktıydı. Motor 1.1.0 ile yeniden üretildi: 1020 vaka (417 türün her biri için kendi su türünde "sığar" ve "dar" senaryosu, 60 filtre, 30 ısıtıcı, 10 hava motoru, 84 tür çifti, tohum veri, boş akvaryum). Yeniden üretimden önce, pakete taşınan kuralların `codex/catalog-capacity-batch` dalındaki (`950a70f`) özgün motorla 1020 vakanın tamamında birebir aynı çıktıyı verdiği doğrulandı. Vakalar `test/fixtures/golden-cases.ts` ile deterministik üretilir.
- `test/golden.test.ts`: uyarlayıcının bugünkü çıktısını fikstürle `toStrictEqual` ile karşılaştırır. Fikstür yoksa test başarısız olur; sessizce yazılmaz.
- `test/legacy-scripts.test.ts`: `scripts/test-health.cjs` betiğini alt süreç olarak çalıştırır; 52 senaryo tek kaynakta kalır, kopyalanmaz.
- `test/isolation.test.ts`: motorun katalog modüllerini içe aktarmadığını ve stub çözümleyiciyle çalıştığını gösterir.

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
