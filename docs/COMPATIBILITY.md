# AquaMind uyumluluk motoru

Son güncelleme: 2026-10-29 (motor 1.12.0, bitki uyarılarına katalogdaki etiketler girdi: "su bitkisi değil" ve istilacı tür listesi — `docs/DECISIONS/0028-bitki-etiketleri-saglik-analizinde.md`; kural seti 1.9.0 ve altın fikstür değişmedi); 2026-10-28 (motor 1.11.0, bitki uyarıları ayrı işlevde: `assessPlants`, sağlık puanını etkilemez — `docs/DECISIONS/0025-bitki-uyarilari.md`; kural seti 1.9.0 ve altın fikstür değişmedi); 2026-10-20 (motor 1.10.0, sonuç biçimi v2: uyarı ve ölçüt kodları — `docs/DECISIONS/0021-dil-altyapisi.md` → "3. paket ayrıntıları"; kural seti 1.9.0 değişmedi; altın fikstür yalnızca yeni alanlarla yeniden üretildi); 2026-10-11 (kural seti 1.9.0, eşleşmeyen ekipman uyarısı yalnızca hesaba giren türlerde — `docs/DECISIONS/0018-eslesmeyen-ekipman-uyarisi.md`; altın fikstürde yalnızca örnek akvaryum vakası değişti; aynı gün kural seti 1.8.0, elle girilen ekipman değerleri — `docs/DECISIONS/0017-elle-girilen-ekipman-degerleri.md`; altın fikstür değişmedi); 2026-10-05 (motor değişmeden 42 türün kaynak yenilemesi ve kimliği belirsiz 3 türün düzeltmesiyle altın fikstür iki kez yeniden üretildi); 2026-10-03 (kural seti 1.7.0, salyangoz uyarısı; aynı gün 1.6.0 alan uyarısının şiddeti, 1.5.0 taban ısıtıcısı ve ikinci katalog entegrasyonu).

## Temel kural

Uyumluluk puanı, alt puanlar ve bulgular yalnızca `packages/compatibility-engine` içindeki deterministik ve testli motordan gelir. Yapay zekâ hiçbir zaman puan üretmez; ileride yalnızca motorun sonucunu açıklar. Aynı girdi her zaman aynı çıktıyı verir.

## Yerleşim

| Parça | Yer | Görev |
|---|---|---|
| Motor | `packages/compatibility-engine/src/index.ts` | `createAnalyzer(resolver)` → `analyzeAquarium(aquarium, animals, equipment, latest?)` |
| Sürümler | `packages/compatibility-engine/src/version.ts` | `ENGINE_VERSION`, `RULESET_VERSION` (ayrı sabitler) |
| Uyarlayıcı | `src/lib/health-analysis.ts` | Kataloğun dört fonksiyonunu çözümleyici olarak bağlar; `analyzeAquarium`'u aynı imzayla dışa aktarır |
| Bilgi | `src/data/catalog.ts` | Canlı ve ekipman profilleri, doğrulanmışlık kuralı |
| Davranış verisi | `src/data/species-behavior.ts` | Kaynaklı davranış kayıtları (1.4.0); uyarlayıcıdaki `withBehavior` bunları motorun isteğe bağlı `behavior` girişine bağlar |
| Testler | `packages/compatibility-engine/test/` | Altın karşılaştırma, bağımsızlık, mevcut senaryo betiği |
| Metinler | `packages/localization/src/messages/tr-engine.ts` (`@aquamind/localization/engine` girişi), `src/lib/engine-text.ts` | Uyarı ve ölçüt kodlarından ekran metni (1.10.0, 0021) |
| Bitki uyarıları | `packages/compatibility-engine/src/plants.ts` (`@aquamind/compatibility-engine/plants` girişi); metinler `packages/localization/src/messages/tr-plant-warnings.ts` (`@aquamind/localization/plant-warnings` girişi), `src/lib/plant-warning-text.ts` | `assessPlants(aquarium, plants, equipment, latest?)`: bitkinin CO₂, ışık, sıcaklık, pH ve boy uyarıları (1.11.0, 0025); sağlık puanından ayrı |
| Mevcut senaryolar | `scripts/test-health.cjs` | 113 senaryo; `pnpm verify` doğrudan, `pnpm test` alt süreç olarak çalıştırır |

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

## Sonuç biçimi (v2, motor 1.10.0)

```ts
type EngineParams = Record<string, string | number | boolean | string[]>;

interface HealthAnalysis {
  score: number;                       // 0–100, sekiz metriğin eşit ağırlıklı ortalaması; kesin tehlikede en fazla 49, diğer tehlike uyarısında en fazla 74
  status: "good" | "warning" | "danger";
  metrics: HealthMetric[];             // load, space, social, compatibility, filter, heater, water, confidence
  warnings: HealthWarning[];
}

interface HealthMetric {
  key: string; label: string; score: number; status: "good" | "warning" | "danger"; detail: string;
  detailCode: string;                  // ör. "ratedTurnover"
  detailParams: EngineParams;          // ör. { turnover: 4.2 }
  userProvided?: true;
}

interface HealthWarning {
  level: "warning" | "danger"; title: string; message: string;
  code: string;                        // ör. "filterFlowLow"
  params: EngineParams;                // ör. { turnover: 3.2, min: 4 }
}
```

1.10.0 (sonuç biçimi v2, 2026-10-20, `docs/DECISIONS/0021-dil-altyapisi.md` → "3. paket ayrıntıları"): her uyarı kararlı bir kod (`code`, 48 kod) ve değişkenler (`params`), her ölçüt açıklama kodu (`detailCode`, 38 kod) ve değişkenler (`detailParams`) taşır. Ekran metni seçili dilin dosyasında bu kod ve değişkenlerden kurulur (`@aquamind/localization/engine` → `engineMessagesFor(locale)`; metinler `packages/localization/src/messages/tr-engine.ts`, kuran modül `src/lib/engine-text.ts`); dil dosyasında karşılığı olmayan kodda motorun Türkçe metni gösterilir. Motor Türkçe `title`, `message`, `label` ve `detail` alanlarını aynen üretmeye devam eder. Dil dosyasının kurduğu metnin sözcükleri bunlarla birebir aynıdır, sayılarının değeri de aynıdır (`src/lib/__tests__/engine-text.test.ts`). Sayılar ve hacimler dil dosyasında ekranın biçimleyicisiyle yazılır: dilin ayırıcıları ve ayarlardaki hacim tercihi kullanılır (`engineTextFormat`, 0021 → "3b ayrıntıları"). Kurallar, puanlar, durumlar ve uyarıların sırası değişmedi; bu yüzden `RULESET_VERSION` 1.9.0'da kaldı. Sürümler sonuç nesnesine eklenmedi; ayrı sabit olarak dışa aktarılır ve Phase 1'de kalıcı hesaplama kaydına (`compatibility_calculations`) eşlik eder.

1.8.0: `HealthMetric` yalnızca sonucu kullanıcının elle girdiği bir ekipman değerine dayandığında `userProvided: true` taşır (filtre ve ısıtıcı ölçütleri; filtre ölçütü elle girilen debiyle, ısıtıcı ölçütü elle girilen güçle işaretlenir, bu yüzden ısıtıcısı doğrulanmış ısıtıcılı filtrede yalnız debi girildiyse ısıtıcı ölçütü işaretlenmez). Elle değer yoksa alan hiç bulunmaz; bu yüzden mevcut çıktılar ve altın fikstür değişmedi.

## Bitki uyarıları (motor 1.11.0 ve 1.12.0)

`assessPlants` sağlık analizinden ayrı bir işlevdir; `analyzeAquarium`'un girişi, çıktısı, puanı ve uyarıları değişmez (ürün sahibinin kararları, `docs/DECISIONS/0025-bitki-uyarilari.md` ve `0028-bitki-etiketleri-saglik-analizinde.md`). Katalogla eşleşen her bitki için, kaynakta yazan değerlerle ve etiketlerle (her bitkide önce etiketler):

| Kod | Seviye | Koşul |
|---|---|---|
| `plantNotAquatic` | uyarı | Kayıtta "su bitkisi değil" etiketi var (Practical Fishkeeping; 1.12.0) |
| `plantInvasive` | uyarı | Kayıt kaynaklı bir istilacı tür listesinde; `lists` listelerin türünü sabit sırayla verir (1.12.0) |
| `plantCo2` | uyarı | Bitkinin CO₂ ihtiyacı (Tropica) yüksek; akvaryumda `co2` türünde ekipman yok |
| `plantLight` | uyarı | Işık aralığının alt ucu orta ya da yüksek; akvaryumda `lighting` türünde ekipman yok |
| `plantTemperature` | uyarı | Son ölçümün sıcaklığı bitkinin kaynaktaki aralığının dışında (sınırlar içeride) |
| `plantPh` | uyarı | Son ölçümün pH'ı bitkinin kaynaktaki aralığının dışında (sınırlar içeride) |
| `plantHeight` | bilgi | Bitkinin kaynaktaki boyu akvaryumun yüksekliğinden büyük |

Aralığı kaynakta olmayan bitkide, ölçüm yokken ya da ölçümde değer yokken sıcaklık ve pH uyarısı çıkmaz. Değerleri kaynakta olmayan yalnız uyarı kayıtlarında (karar 0026) yalnız etiketler uyarı verir. Her uyarı `plantId`, `level`, `code`, `params` ve Türkçe `title`, `message` taşır. Bitki kurallarında puan cezası ve gömülü eşik yoktur; bu yüzden `RULESET_VERSION` 1.9.0'da kaldı.

## Kural seti (mevcut sabitler)

Motorun içine gömülü eşikler `RULESET_VERSION` ile sürümlenir. Mevcut sürüm 1.9.0:

- Etkin hacim: net hacmin 0,85'i. Tahmini biyolojik yük oranı = Σ(adet × yetişkin boy × atık katsayısı) / etkin hacim. Atık katsayısının kaynağı olmadığı için yük hiçbir zaman tehlike vermez: oran 2,5'in üstündeyse uyarı (ölçüt puanı 60), değilse ölçüt puanı 100 − oran × 10. 2,5, katalogdaki hiçbir türün kendi kaynağının önerdiği en küçük akvaryum ve grupta ulaşmadığı değerdir.
- Filtre yeterliliği: her çalışan ana filtrenin karşılayabildiği hacim toplanır. Üretici hacim önerisi olan filtrede öneri uygunluk, 1,5 katı tehlike sınırıdır; önerisi olmayanda etiket debisinin saatte 4 çevrime karşılık geldiği hacim uygunluk, saatte 2 çevrime karşılık geldiği hacim tehlike sınırıdır. Net hacim uygunluk sınırları toplamının içindeyse uygun, tehlike sınırları toplamının içindeyse uyarı, üstündeyse tehlike. Yalnız hacim önerili filtrelerde bu "önerinin %50'ye kadar aşımı uyarı", yalnız debili filtrelerde "saatte 4 çevrim uygun, 2–4 uyarı, 2'nin altı tehlike" demektir. Hacim önerili debisiz filtre hesaba hazır sayılır. Hava motoru olmayan sünger filtre hesaba girmez. Yük filtre hedefini etkilemez.
- Güçlü akış: etiket debisinin 0,65'iyle saatte 10'dan (düşük akıntı seven türler çoğunluktaysa 7'den) fazla çevrimde uyarı.
- Isıtıcı: üretici hacim aralığı varsa o, yoksa 0,5–1,5 W/L bandı. Pasif kayıtlar (taban ısıtma kablosu gibi) ısıtıcı kapasitesine katılmaz (1.5.0); yalnız onlar seçiliyse sonuç hiç ısıtıcı seçilmemiş gibidir.
- Yaşam ortamı: canlının su türü (`waterTypes`; belirtilmemişse yalnızca tatlı su) akvaryum türünü içermiyorsa tehlike uyarısı verilir.
- Alan: gereken hacim = en az hacim + (adet − 1) × birey başına ek hacim (tanımlıysa). Kaynak tank uzunluğu yayımlamıyorsa yalnızca hacim denetlenir ve bunu belirten bir uyarı gösterilir. Akvaryum kaynağın önerisinin altındaysa "<tür>: alan sınırda" uyarısı verilir; balıkta akvaryum ayrıca İsviçre Hayvan Koruma Yönetmeliği'nin (TSchV Ek 2 Tablo 8) yetişkin boya göre ölçü sınırının da altındaysa (uzunluk 3×, genişlik 2×, yükseklik 1× yetişkin boydan küçük; girilmemiş ölçü denetlenmez) "<tür>: akvaryum çok küçük" tehlike uyarısı verilir ve yüzme alanı ölçütü en fazla 35 olur (1.6.0). Kaynağın önerisini karşılayan akvaryum hiç alan uyarısı almaz. Bu tehlike kesin tehlike değildir; genel durum en fazla "dikkat" olur.
- Filtre türleri: pasif parçalar filtre hesabına girmez; yardımcı filtreler (ör. yüzey skimmeri) ana filtrenin yerine geçmez, akvaryumda yalnız yardımcı filtre varsa tehlike uyarısı verilir.
- Tuzluluk: deniz ve acı su profillerinde özgül ağırlık aralığı tanımlıdır; ölçüm yoksa uyarı, son ölçüm aralık dışındaysa tehlike uyarısı verilir.
- Uyum cezaları: yaşam ortamı uyumsuzluğu 80, sıcaklık kesişimi yok 55, pH kesişimi yok 55, akıntı çatışması 20, avlanma 60, tür akvaryumu gerektiren canlı 60, topluluk uyarısı 30; davranış: fırsatçı avcı 40, yüzgeç ısırma 30, aynı tür saldırganlığı 30, karides yiyen balık 30, karides uyumu doğrulanmayan balık 15, salyangoz yiyen balık 30 (1.7.0). Kesin tehlike (yaşam ortamı, sıcaklık veya pH, avlanma, tür akvaryumu) yoksa tür uyumu 50'nin altına inmez.
- Avlanma: av, avcının yetişkin boyunun %40'ı veya altındaysa.
- Davranış (1.4.0, yalnızca `src/data/species-behavior.ts` içindeki açık kaynaklı kayıtlar; hepsi uyarı): yüzgeç ısıran balık + uzun ya da yavaş yüzgeçli farklı balık → "<hedef>: yüzgeç ısırma riski"; fırsatçı avcı (asıl avcı değil) + yetişkin boyu %40 veya altındaki balık → "<av>: avlanabilir" (kaynak daha küçük bir av boyu verdiyse o sınır, sınır dahil; kaynağa göre asıl avcı olmayan türün katalogdaki avcı işareti kaldırılır, kaynak sayısal bir av boyu verdiyse tür o sınırla fırsatçı avcı sayılır); aynı tür saldırganlığında toplam adet 2 veya fazlaysa → "<tür>: erkekler kavga eder" ya da "<tür>: tek tutulmalı"; cüce karides (yetişkin 4 cm veya altı) + kaynağı "karides yer" diyen balık → "Karidesler yenebilir", kaynağında "karidesle güvenli" bilgisi olmayan balık → "Karides uyumu doğrulanmadı"; salyangoz + kaynağı "salyangoz yer" diyen balık → "Salyangozlar yenebilir" (1.7.0; mesaj kaynağın notunu söyler, salyangoz için "doğrulanmadı" uyarısı yoktur). Çelişkili kayıtlar uyarı üretmez (karideste "doğrulanmadı" sayılır). Uyarı mesajı kaynağın adını ve varsa notunu söyler.
- Su değeri uyumu: son ölçümün sıcaklığı, pH'ı, (tanımlı profillerde) özgül ağırlığı ve amonyak, nitrit, nitrat seviyeleri.
- Su kalitesi (OATA, Ekim 2022): amonyak ve nitrit sıfırın üstündeyse uyarı. Serbest amonyak tatlı suda 0,02, deniz ve acı suda 0,01 mg/L'yi; nitrit tatlı suda 0,2, deniz ve acı suda 0,125 mg/L'yi aşarsa tehlike. Serbest amonyak = toplam amonyak × Florida DEP kesri (pKa = 0,0901821 + 2729,92 / (°C + 273,2)); pH veya sıcaklık yoksa ya da geçersizse toplamın tamamı zehirli sayılır. Nitrat tatlı ve acı suda 50 mg/L üstü uyarı, 100 mg/L üstü tehlike; denizde 100 mg/L üstü tehlike. Negatif, sayı olmayan veya sonsuz amonyak, nitrit ve nitrat değerlendirilmez ("uygun" sayılmaz, puana girmez) ve "Geçersiz su ölçümü" uyarısı verilir.
- Kesin tehlike: yaşam ortamı uyumsuzluğu, sıcaklık veya pH kesişiminin olmaması, avlanma, tür akvaryumu gerektiren canlı, aralık dışı tuzluluk, zehirli amonyak veya sınırı aşan nitrit varsa genel puan en fazla 49 olur (durum "tehlike").
- Diğer tehlike uyarıları: kesin tehlike dışında herhangi bir tehlike uyarısı (ör. üretici önerisini çok aşan filtre, yetersiz ısıtıcı) varsa genel puan en fazla 74 olur (durum en fazla "dikkat").
- Davranış tabanı: davranış cezası olmadan tehlikede olmayan akvaryumun genel puanı davranış uyarıları yüzünden 50'nin altına inmez.
- Veri güveni: hesaplamaya hazır kayıtların (doğrulanmış katalog kayıtları ve 1.8.0'dan beri değeri kullanıcı tarafından girilen ekipman) güvenlik hesabına giren kayıtlara oranı. Açıklama, kaç kaydın kullanıcının girdiği değerle hesaba katıldığını ayrıca yazar.
- Elle girilen ekipman değeri (1.8.0, `docs/DECISIONS/0017-elle-girilen-ekipman-degerleri.md`): katalogda doğrulanmış kapasite verisi olmayan filtre, hava motoru ve ısıtıcıda (listede olmayan ya da değeri doğrulanamadığı için hesap dışı tutulan kayıt) kullanıcının cihaz etiketinden girdiği debi (L/saat) ya da güç (W) hesaba katılır. Kural aynıdır: filtre etiket debisiyle (saatte 4 çevrim uygun, 2 çevrimin altı tehlike), ısıtıcı 0,5–1,5 W/L bandıyla, hava motoru sünger filtre bağlantısıyla değerlendirilir. Kabul edilen aralık filtrede 20–20.000 L/saat, hava motorunda 10–50.000 L/saat, ısıtıcıda 5–2.000 W'tır; dışındaki değer hesaba katılmaz. Katalogda debisi, hacim önerisi ya da gücü doğrulanmış kayıtta, pasif parçada, yardımcı filtrede ve hava motoruyla çalışan filtrede girilen değer yok sayılır. Değeri girilen kayıt hesaplamaya hazır sayılır: "Katalogla eşleşmeyen ekipman kaydı var" ve "Ekipman kapasite bilgisi eksik" uyarıları o kayıt için çıkmaz. Sonucu böyle bir değere dayanan filtre ve ısıtıcı ölçütü `userProvided: true` taşır.
- Eşleşmeyen ekipman uyarısı (1.9.0, `docs/DECISIONS/0018-eslesmeyen-ekipman-uyarisi.md`): "Katalogla eşleşmeyen ekipman kaydı var" uyarısı yalnızca güvenlik hesabına giren türdeki kayıtlar için çıkar: filtre, ısıtıcı ve akvaryumda hava motoruyla çalışan bir filtre varsa hava motoru. Aydınlatma, CO₂, UV, dozaj pompası ve "diğer" türündeki cihaz listede olmasa da uyarı üretmez; bu türler hiçbir ölçüte ve veri güveni oranına girmez. Uyarıdaki sayı yalnızca hesaba giren türleri sayar. Puan, ölçütler ve diğer uyarılar bu kuralla değişmedi.

Bu sabitler Phase 0B'de değiştirilmedi. 1.1.0'da katalog entegrasyonuyla yaşam ortamı, tuzluluk, birey başına ek hacim ve yardımcı filtre kuralları eklendi (bkz. `docs/DECISIONS/0007-katalog-entegrasyonu-motor-kurallari.md`). 1.2.0'da su kalitesi eşikleri ve kesin tehlike kuralı eklendi (bkz. `docs/DECISIONS/0008-su-kalitesi-ve-kesin-tehlike.md`). 1.3.0'da filtre yeterliliği, tahmini yük ve tehlike uyarısının genel duruma etkisi değişti (bkz. `docs/DECISIONS/0009-filtre-yuk-ve-genel-durum.md`); eşikler `src/index.ts` başındaki adlandırılmış sabitlerdedir. 1.4.0'da kaynaklı davranış uyarıları eklendi (bkz. `docs/DECISIONS/0010-davranis-uyarilari.md`). 1.5.0'da taban ısıtma kablosu gibi pasif ısıtıcı kayıtları ısıtıcı hesabından çıkarıldı (bkz. `docs/DECISIONS/0011-katalog-entegrasyonu-2-taban-isiticisi.md`). 1.6.0'da alan uyarısına İsviçre yönetmeliğine dayanan tehlike basamağı eklendi (bkz. `docs/DECISIONS/0012-alan-uyarisinin-siddeti.md`). 1.7.0'da salyangoz uyarısı eklendi (bkz. `docs/DECISIONS/0013-salyangoz-uyarisi.md`). 1.8.0'da elle girilen ekipman değerleri eklendi; yeni eşik, ceza ya da uyarı yoktur (bkz. `docs/DECISIONS/0017-elle-girilen-ekipman-degerleri.md`). 1.9.0'da eşleşmeyen ekipman uyarısı hesaba giren türlerle sınırlandı; eşik ve ceza değişmedi (bkz. `docs/DECISIONS/0018-eslesmeyen-ekipman-uyarisi.md`).

## Değişmezlik güvencesi

- `test/fixtures/golden-v1.json`: ilk sürümü motor taşınmadan önce, `8d6a164` içeriğindeki orijinal `src/lib/health-analysis.ts` ile alınmış 604 vakalık çıktıydı. Motor 1.1.0 ile yeniden üretildi: 1020 vaka (417 türün her biri için kendi su türünde "sığar" ve "dar" senaryosu, 60 filtre, 30 ısıtıcı, 10 hava motoru, 84 tür çifti, tohum veri, boş akvaryum). Yeniden üretimden önce, pakete taşınan kuralların `codex/catalog-capacity-batch` dalındaki (`950a70f`) özgün motorla 1020 vakanın tamamında birebir aynı çıktıyı verdiği doğrulandı. Motor 1.2.0 (su kalitesi ve kesin tehlike) için ürün sahibi onayından sonra yeniden üretildi; vaka sayısı değişmedi. Motor 1.3.0 (filtre, yük, genel durum) için 2026-09-28 onayından sonra yeniden üretildi; 1014 vaka değişti ve farkların tamamı sınıflandırıldı (yük ölçütü, filtre ölçütü, filtre ve yük uyarıları, tehlike uyarısında 74 sınırı, hacim önerili debisiz filtrelerin veri güveni). Motor 1.4.0 (davranış uyarıları) için 2026-09-29 onayından sonra yeniden üretildi; 83 vaka değişti ve farkların tamamı sınıflandırıldı (tür uyumu ölçütü, davranış uyarıları, davranış tabanı). Motor 1.5.0 ve ikinci katalog entegrasyonu (`b1fb27d`) için 2026-10-03 onayından sonra yeniden üretildi: 1033 vaka (423 tür). Isıtıcı kuralı hiçbir vakayı değiştirmedi; farkların tamamı katalog kayıtlarındaki değişikliklerden geliyor ve sınıflandırıldı. Motor 1.6.0 (alan uyarısının şiddeti) için 2026-10-03 onayından sonra yeniden üretildi; 125 vaka değişti, hepsi sarı alan uyarısının kırmızıya dönmesi, yüzme alanı ölçütünün 35 ile sınırlanması ve genel puanın 74 sınırıyla açıklandı; hiçbir vakanın genel durumu değişmedi. Motor 1.7.0 (salyangoz uyarısı) altın fikstürü değiştirmedi: hiçbir vakada salyangoz yiyen balık ile salyangoz birlikte değil, fikstür yeniden üretilmedi. Motor değişmeden, kaynağı yalnızca FishBase olan 42 türün kaynak yenilemesi (PR #18, `b4444f7`) için 2026-10-05'te yeniden üretildi; 93 vaka değişti, hepsinin girdisi ya da tür kaydı değişmişti, açıklanamayan fark yok. İki vakanın genel durumu değişti: kakadu apistogramma çifti dikkat → iyi (kaynak grup sayısı vermiyor), cennet balığı ile Parkinson gökkuşağı balığı iyi → tehlike (kaynağa göre cennet balığı 10–22 °C). Aynı gün kimliği belirsiz 3 türün düzeltmesi (`docs/DECISIONS/0014-coklu-tur-satis-adi-profilleri.md`) için motor değişmeden yeniden üretildi; 7 vaka değişti, hepsinin girdisi ya da tür kaydı değişmişti, hiçbir vakanın genel durumu değişmedi. Motor 1.8.0 (elle girilen ekipman değerleri) altın fikstürü değiştirmedi. Motor 1.9.0 (eşleşmeyen ekipman uyarısı) için 2026-10-11 onayından sonra yeniden üretildi; yalnızca `seed:mock-data` vakası değişti: ISTA CO₂ seti için çıkan "Katalogla eşleşmeyen ekipman kaydı var" uyarısı kalktı, puan, durum, ölçütler ve diğer uyarılar aynı kaldı. Motor 1.10.0 (sonuç biçimi v2) için 2026-10-20 onayından sonra yeniden üretildi; 1033 vakanın hepsine yalnızca yeni alanlar (`code`, `params`, `detailCode`, `detailParams`) eklendi: bu alanlar çıkarılınca fikstür önceki sürümle (`bfaa8e8`) birebir aynıdır. Vakalar `test/fixtures/golden-cases.ts` ile deterministik üretilir.
- `test/golden.test.ts`: uyarlayıcının bugünkü çıktısını fikstürle `toStrictEqual` ile karşılaştırır. Fikstür yoksa test başarısız olur; sessizce yazılmaz.
- `test/legacy-scripts.test.ts`: `scripts/test-health.cjs` betiğini alt süreç olarak çalıştırır; 113 senaryo tek kaynakta kalır, kopyalanmaz.
- `test/isolation.test.ts`: motorun katalog modüllerini içe aktarmadığını ve stub çözümleyiciyle çalıştığını gösterir.
- `test/water-quality.test.ts`: serbest amonyak formülünü Florida DEP'in yayımlanmış tablosuyla, su kalitesi eşiklerini OATA değerleriyle, geçersiz (negatif, sayı olmayan, sonsuz) değerlerin sınırını ayrıca sınar.
- `test/behavior.test.ts`: 1.4.0 davranış kurallarını, çelişkili kayıtları, tür uyumu tabanını ve davranış tabanını stub kayıtlarla sınar.
- `test/user-equipment-values.test.ts`: 1.8.0 elle girilen ekipman değerlerini stub kayıtlarla sınar (hangi kayıtta girilebildiği, aralık sınırları, aynı değerli doğrulanmış kayıtla aynı puan ve açıklama, işaretin yalnız değeri elle girilen ölçütte bulunması, kalkan uyarılar, doğrulanmış değerin ezilememesi, aynı cihazın iki kaydı, elle değer olmayan çıktının değişmemesi).
- `test/unmatched-equipment-warning.test.ts`: 1.9.0 eşleşmeyen ekipman uyarısını stub kayıtlarla sınar (hesaba girmeyen türlerin uyarı üretmemesi ve sonucu değiştirmemesi, filtre ve ısıtıcının uyarı üretmesi, sayının yalnız hesaba giren türleri sayması, hava motorunun yalnız hava motoruyla çalışan filtre varken sayılması, değeri elle girilen kaydın uyarı üretmemesi, veri güveni).
- `src/lib/__tests__/engine-text.test.ts`: 1.10.0 sonuç biçimi v2. Dil dosyasının kod ve değişkenlerden kurduğu metni motorun Türkçe metniyle altın fikstürün 1033 vakasında ve fikstürde geçmeyen kodları ve dalları tetikleyen 30 stub senaryoda karşılaştırır. Sözcükler birebir aynı olmalı; dil dosyasının biçimlediği her sayı işaretlenir ve değeri hem motorun sayısıyla hem gerçek Türkçe biçimleyicinin yazdığı sayıyla aynı olmalıdır (3b). Ayrıca biçimleyiciden geçmeyen sayı (TypeScript tip bilgisiyle izin listesine göre bütün dallarda ve çalışma zamanında), değişkenlerin kendi türlerinin okuyucusuyla okunması, her kodda hangi değişkenin hangi türde ve sırayla yazıldığı (yöntem tablosu), yuvarlamanın farkı gizlememesi ve galon tercihi sınanır; motor kaynağındaki 48 uyarı ve 38 ölçüt kodunun dil dosyasında karşılığı olduğunu, dil dosyasında fazla kod olmadığını ve her kodun en az bir kez sınandığını denetler; dil paketinin ana girişinin motor metinlerini içe aktarmadığını da denetler (sayfa hızı).
- `test/plants.test.ts`: 1.11.0 ve 1.12.0 bitki uyarılarını stub kayıtlarla sınar (her kural, sınır değerler, aralığı ya da ölçümü olmayan bitki, eşleşmeyen bitki, kullanıcının verdiği ad, sıra, iki etiketin uyarısı ve istilacı listelerin sırası, girişlerin değişmemesi, ayrı girişin yalnız tip içe aktarması).
- `src/lib/__tests__/plant-warnings.test.ts`: bitki uyarılarının dil dosyasındaki metni motorun Türkçe metniyle aynı; °F yazımı, yuvarlamanın aşılan sınırı gizlememesi, sayıların biçimleyiciden geçmesi, yalnız o akvaryumun kayıtları ve en son ölçüm, ayrı girişler.
- `test/snail.test.ts`: 1.7.0 salyangoz uyarısını (metin, kaynağın notu, salyangoz yokluğu, çelişkili ve bilgisiz balık, ceza) stub kayıtlarla sınar.
- `test/space.test.ts`: 1.6.0 alan uyarısı basamaklarını (kaynak altı sarı, kaynak ve İsviçre sınırı altı kırmızı, kaynağa uyan akvaryum, balık olmayan canlı, girilmemiş ölçü, ölçüt ve genel durum sınırı) stub kayıtlarla sınar.
- `test/heater.test.ts`: 1.5.0 taban ısıtıcısı kuralını stub kayıtlarla sınar (yalnız taban kablosu, taban kablosu ve gerçek ısıtıcı).
- `test/filter-load.test.ts`: 1.3.0 filtre (hacim önerili, debili, karışık set, sünger filtre), yük ve genel durum eşiklerini stub kayıtlarla sınırlarından sınar.
- `test/audit-scenarios.test.ts`: 2026-09-24 denetim senaryoları ve bulguları. Düzeltilenler kalıcı testtir; son bulgu (alan uyarısının şiddeti) 1.6.0 ile kapandı, bekleyen `it.todo` kalmadı. Geçersiz ölçümün ve eksik pH/sıcaklık mesajının motor çıktısındaki etkisi de burada sınanır.

## Kural kaynakları

- OATA, "OATA water quality criteria", Ekim 2022: https://ornamentalfish.org/wp-content/uploads/OATA-Water-quality-criteria-Oct-2022.pdf
- Florida Department of Environmental Protection, "Calculation of un-ionized ammonia in fresh water", Rev. 2, 2001: https://floridadep.gov/sites/default/files/5-Unionized-Ammonia-SOP_1.pdf
- İnsani Tüketim Amaçlı Sular Hakkında Yönetmelik, Resmî Gazete 17.02.2005, Ek-1 (içme suyunda nitrat en fazla 50 mg/L): https://www.resmigazete.gov.tr/eskiler/2005/02/20050217-3.htm
- Filtre ve stok kuralı kaynakları (JBL ve Fluval kılavuzları, Eheim, Seriously Fish, Practical Fishkeeping, AqAdvisor, OATA, VDA, aquariumscience.org): `docs/DECISIONS/0009-filtre-yuk-ve-genel-durum.md` → "Kaynaklar"
- Davranış kuralı kaynakları (OATA, Seriously Fish, Fishkeeper, Practical Fishkeeping): `docs/DECISIONS/0010-davranis-uyarilari.md` → "Kaynaklar"; kayıt başına bağlantılar `src/data/species-behavior.ts` içinde
- Alan uyarısının tehlike basamağı: İsviçre Hayvan Koruma Yönetmeliği (TSchV, SR 455.1) Ek 2 Tablo 8 not b): https://fedlex.data.admin.ch/filestore/fedlex.data.admin.ch/eli/cc/2008/416/20260201/de/html/fedlex-data-admin-ch-eli-cc-2008-416-20260201-de-html-2.html ; araştırmanın tamamı `docs/DECISIONS/0012-alan-uyarisinin-siddeti.md` → "Araştırma"

## Motoru değiştirme kuralı

1. Puanı, eşikleri veya uyarıları değiştiren her değişiklik önce ürün sahibi onayı ve kısa bir karar kaydı ister.
2. `ENGINE_VERSION` (kod) ve/veya `RULESET_VERSION` (sabitler) yükseltilir.
3. Altın fikstür yalnızca bu onaydan sonra ve şu komutla yeniden üretilir; yeniden üretim tek başına bir commit olarak görünmeli ve incelemede gerekçelendirilmelidir:

```bash
AQUAMIND_GOLDEN_CAPTURE=1 pnpm exec vitest run packages/compatibility-engine/test/golden.test.ts
```

4. Etkilenen `scripts/test-health.cjs` senaryoları aynı değişiklikte güncellenir; test zayıflatılarak geçirilmez.
5. Katalog verisi puanı geçirmek için değiştirilmez.
6. Yeni bir uyarı ya da ölçüt açıklaması kod ve değişkenleriyle üretilir; metni dil dosyasına (`packages/localization/src/messages/tr-engine.ts`) yazılır. Motorun Türkçe metni ile dil dosyasının metninin sözcükleri aynı olmalıdır; dil dosyası sayıları biçimleyiciyle (`EngineTextFormat`) yazar. `src/lib/__tests__/engine-text.test.ts` karşılığı olmayan, kullanılmayan ya da hiç sınanmayan kodu ve farklı sözcüğü ya da değeri yakalar.

## Planlanan (Phase 1 ve sonrası)

- Kalıcı hesaplama kaydı: `compatibility_calculations(engine_version, ruleset_version, knowledge_version, input_snapshot, score, subscores, findings)`; "AquaMind neden %73 hesapladı?" sorusu bu kayıtla yanıtlanır.
- Bilgi anlık görüntüsü (`knowledge_releases`) üzerinden çözümleyici; motor testleri veritabanına ihtiyaç duymaz.
- Yapay zekâ açıklaması: motor sonucu girdi, açıklama çıktı; puan asla yapay zekâdan gelmez.
