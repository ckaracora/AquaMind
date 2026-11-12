# 0040 — Canlı riski uyarıları genel durumda

- Tarih: 2026-11-12
- Durum: Kabul edildi. Ürün sahibi (`buraksenfx`) 2026-11-12'de seçenek B'yi seçti: "Kırmızı uyarı, sonuç 'dikkat'". Teknik kararlar Claude'un (lider); "tek çift" düzeltmesi liderin teknik kararıdır. Motor 1.15.0, kural seti 1.12.0. Kontrol: Antigravity (Gemini), 2026-11-12; P1 ve P2 yok. Tek P3 (`smallFishPredation` tehlike seviyesinde olduğu için sınıftaki yeri puanı değiştirmiyor) kod açıklamasıyla giderildi; davranış değişmedi. Altın fikstür ayrı commit'te yeniden üretilir.

## Bağlam

Veri testi B (30 senaryo, karar 0037) ve C (40 senaryo, 2026-11-12) aynı sınırı buldu: sarı uyarılar genel sonucu düşürmüyordu. Kaynaklar daha sert bir hüküm beklerken genel sonuç "uygun" kalıyordu. Örnekler:

- B16, 200 L melek balığı ve neon: "melek neonu yiyebilir" sarı, genel 93 "uygun". Kaynak (Fishkeeper) neon gibi küçük tetralarla birlikte tutulmamasını söylüyor.
- B28 ve C35: pH tür aralığının dışında (Malawi pH 6,5; tetralar pH 8,3), genel "uygun".
- C23: 100 L'de 5 Japon balığı (OATA 300 L ister), yük ve alan sarı, genel 86 "uygun".
- C24 ve C36: Japon balığı 29 °C'de, diskus 24 °C'de, genel "uygun".

Ürün sahibinin sözü (2026-11-12): "Sarı uyarıları düzeltelim. Benim anladığım kadarıyla bir balığın yenmesi kesin kötü bir olay."

Ayrıca C04'te kaynağın önerdiği tek leleupi çifti "tek tutulmalı" uyarısı alıyordu (yersiz alarm). Kayıttaki değer `all`, notu "çok büyük tank hariç"; katalog türü çift olarak öneriyor (en az grup 2).

## Karar

Ürün sahibinin kararı (2026-11-12, seçenek B):

1. **Canlıya zarar anlatan uyarılar genel sonucu en fazla "dikkat" yapar.** Canlı kaydı olan akvaryumda canlı riski sınıfından bir uyarı varsa genel puan en fazla 74 olur.
2. **"Küçük balık avlanabilir" kırmızı uyarıdır, genel sonuç "dikkat".** Fırsatçı avcının (kaynağı "ağzına sığan küçük balıkları yiyebilir" diyen tür) uyarısı tehlike seviyesine çıkar, ama kesin tehlike değildir. "Uygun değil", kaynağın asıl avcı dediği türlerde (ör. astronot, yılanbaş) bugünkü gibi kalır.
3. **Bilgi notları sonucu değiştirmez.** Bakım notu, topluluk notu, kayıt ve veri eksikliği her akvaryumda çıkabilir; genel sonuca girmez.

Teknik kararlar (Claude):

- **Canlı riski sınıfı (18 kod, `LIVESTOCK_RISK_WARNING_CODES`, `packages/compatibility-engine/src/index.ts`):**
  - yenme ve yaralanma: `smallFishPredation`, `shrimpEaten`, `snailEaten`, `finNip`;
  - alan, kalabalık ve grup: `spaceLimited`, `spaceNarrow`, `highLoad`, `groupLow`;
  - aralık dışı su değeri: `speciesTemperatureOutOfRange`, `speciesPhOutOfRange`, `coldwaterWithTropical`, `marineSpecificGravity`, `marinePh`, `marineKh`, `marineNitrate`, `ammoniaDetected`, `nitriteDetected`, `nitrateHigh`.
- **Sınıfın dışında kalan 23 sarı kod** genel puanı değiştirmez:
  - bilgi notu, kayıt ve veri: `husbandryCaution`, `tankLengthNote`, `communityCaution`, `shrimpUnverified`, `temperatureRangeNarrow`, `unmatchedAnimals`, `unmatchedEquipment`, `unverifiedAnimals`, `unverifiedEquipment`, `missingCapacity`, `salinityReadingNeeded`, `invalidReading`, `filterMissing`, `heaterMissing`. `filterMissing` ve `heaterMissing` ölçütü 35 yaptığı için akvaryum zaten "dikkat"te.
  - koşullu not: `conspecificMales`, `conspecificAll`. Uygulama cinsiyeti bilmiyor; kaynağın önerdiği harem ve çiftte de çıkıyorlar.
  - ekipman ve akıntı: `flowConflict`, `strongFlow`, `filterOverManufacturer`, `filterFlowLow`, `filterCapacityLow`, `heaterTooLarge`, `heaterMismatch`. Ölçüt kartı zaten uyarıyor; `heaterTooLarge` ölçütü 45 olduğu için zaten "dikkat".
  - `shrimpUnverified`: kaynakta bilgi yok, zarar iddia edilemez (uydurma yasağı); tür uyumu cezası (15) duruyor. `temperatureRangeNarrow`: şu an sorun yok; ölçüm aralık dışına çıkarsa ayrı sıcaklık uyarısı çıkıyor.
- **Tavan:** `livestockRiskWarning = canlı kaydı var ve uyarılardan biri sınıfta`. Genel puan `dangerWarning || dangerMetric || livestockRiskWarning` iken en fazla 74 (`DANGER_WARNING_SCORE_CAP`, değişmedi). Yeni sayı yok. Kesin tehlikenin 49 sınırı önce gelir. Canlısız akvaryumda tavan yok (ör. döngü kuran akvaryumda amonyak beklenir).
- **Fırsatçı avcı:**
  - `smallFishPredation` seviyesi `danger`. Kesin tehlike listesine girmez; tür uyumu cezası 40 değişmedi (ölçüt 60, "dikkat"), genel puan dangerWarning ile en fazla 74.
  - Metin: "{avcı} ağzına sığan küçük balıkları yiyebilir; {av} yetişkin boyuyla bu risk içinde. Bu iki türü aynı akvaryumda tutmayın." (EN "Do not keep these two species in the same aquarium.", ES "No mantengas estas dos especies en el mismo acuario.")
  - Fırsatçı avcı her kategoriden olabilir; av yalnız balıktır. Kurbağa gibi balık olmayan bir canlının kaynaklı kaydı artık uyarı üretir.
- **"Yiyebilir" ile "yer":** Kaynakların sözcüğüne bakılmaz; aynı davranış için "may eat", "will eat" karışık kullanılıyor. Fark veride yapı olarak duruyor: asıl avcı (`predatory`, kesin tehlike) ve fırsatçı avcı (`eatsSmallFish`, kırmızı uyarı, "dikkat"). Karides ve salyangoz yenmesinin kaynak notları çoğunlukla "yavruları ya da küçük olanları" diyor; sarı ve "dikkat".
- **"Tek tutulmalı" ve çift:** `conspecificAll` kaydı, katalog türü çift ya da grup halinde öneriyorsa (`minGroup >= 2`) ve kayıtlı adet bu sayıyı aşmıyorsa uyarı ve tür uyumu cezası üretmez. Fazlası yine uyarı alır. `conspecificMales` değişmedi.
- **Veri (docs/CATALOG_LOG.md, 2026-11-12):**
  - Ayışığı guramisinin `predatory` işareti kalktı. Kaynaklar yalnız çok küçük balıkları anıyor (Fishkeeper "not to be trusted with very tiny fish", Seriously Fish "so small as to be seen as food"). Kaynaklı `eatsSmallFish` kaydı eklendi.
  - Afrika cüce kurbağasına kaynaklı `eatsSmallFish` kaydı eklendi (Fishkeeper "adults will take very small fish and fry"). Avcı işareti PR #87'de bu yüzden kaldırılmıştı.
- **Sürüm:** motor 1.15.0. Kural seti 1.12.0: tavan kuralı, bir uyarının seviyesi ve bir uyarının koşulu değişti. Sonuç nesnesinin biçimi ve uyarı kodlarının sayısı (60) değişmedi.

## Değerlendirilen alternatifler

Ölçüm `S\motor-1-15\oneri.md` (2026-11-12) içinde; 68 sayılan senaryo (30 B + 38 C).

- **A, yenme ve yaralanma kesin tehlike; öbür sarılar etkisiz:** 55/68 tuttu. Lepistes + kiraz karides ve cüce zincir loach + nerite "uygun değil" olurdu, oysa kaynak notları yavru ve küçük salyangoz diyor. 29 °C'deki Japon balığı "uygun" kalırdı.
- **C, B + küçük balık avı kesin tehlike:** 61/68 tuttu (B ile aynı). 561 yaygın ikiliden 34'ü "uygun değil" olurdu. Bunların bir kısmı yalnız kaynaksız %40 boy kuralından geliyor (melek + panda çöpçü, melek + plati). Fırsatçı avcı ile asıl avcı arasındaki ayrımı ve PR #87'nin gerekçesini kaldırırdı. Ürün sahibi seçmedi.
- **Aynı tür saldırganlığını da tavana almak:** 30 tek tür kurulumu (kaynağın önerdiği Malawi haremleri, apisto çiftleri) ve 62 ikili daha "dikkat" olurdu. Yersiz.
- **Ekipman ve akıntı sarılarını da tavana almak:** Altın fikstürde 11 filtre vakası, 27 ikili daha "dikkat" olurdu. Canlıya doğrudan zarar değil; ölçüt kartı zaten uyarıyor. Sonra eklenebilir.
- **Eşikli kırmızı** (sıcaklıkta 2 °C, pH'ta 0,5 sapma; kaynak hacminin yarısı): veri testi C raporunun önerisi. Kaynağı yok; seçilmedi. Karar 0012 de "hacim oranına göre kırmızı"yı aynı nedenle seçmemişti.
- **"Birden çok sarı = uygun değil":** B02'yi (20 L beta + 6 lepistes) tuttururdu; kaynağı yok, seçilmedi.

## Doğrulama

- Yeni stub test `packages/compatibility-engine/test/warnings-1-15.test.ts`:
  - 15 canlı riski kodunun her biri tek başına: ortalama 74'ün üstünde, genel 74 "dikkat";
  - sınıfın 18 kodu; ölçüm düzelince yeniden "uygun"; canlısız akvaryumda tavan yok; kesin tehlike önce;
  - bilgi notu, koşullu not, akıntı ve ekipman sarıları genel puanı değiştirmez (6 durum);
  - fırsatçı avcının tam metni ve seviyesi; asıl avcı aynı; balık olmayan avcı, av yalnız balık;
  - "tek tutulmalı": çift, grup, tek birey, ayrı kayıtların toplanması, `conspecificMales`'in değişmemesi, tür uyumu cezası.
- Güncellenen testler:
  - `behavior.test.ts` ve `audit-scenarios.test.ts`: fırsatçı avcı uyarısının seviyesi `danger`, genel durum "dikkat"; melek + neon (veri testi B16) "dikkat".
  - `src/lib/__tests__/species-behavior.test.ts`: threadfin acara uyarısı `danger`. Gerçek katalogla ayışığı guramisi + neon (C38) kırmızı uyarı, kesin tehlike değil. Kurbağa + 2 cm chili rasbora kırmızı uyarı; neon, karides ve salyangozla uyarı yok. Leleupi çifti uyarısız, üç birey uyarılı (C04).
  - `scripts/test-catalog-flow.cjs`: ayışığı guramisi avcı işareti taşımaz, çok küçük balık riski bakım metninde.
- `scripts/test-health.cjs` (113 senaryo) değişmeden geçti. `engine-text.test.ts` üç dilde yeni metni motorun Türkçesiyle karşılaştırdı.
- Veri testi yeniden ölçümü (motor 1.15.0):
  - B: 30 senaryoda 18 → 23 tuttu;
  - C: 38 sayılan senaryoda 32 → 38 tuttu. C sınıfı 30/6/2/0 → 37/0/1/0, hata %21,1 → %2,6.
  - Hiçbir senaryoda motor beklenenden sert değil. Sorunsuz C01–C12'de hüküm "uygun" kaldı.
  - Kalan C03: "erkekler kavga eder" notu; C raporu bu notu kaynağa uygun buluyor.
- Altın fikstür (beklenen, yeniden üretilmedi): 13 vaka değişir, hepsinde `conspecificAll` kalkar. Durumu değişen vaka yok. Puanı değişen 2 vaka: Siyam yosun yiyicisinin "dar" vakası 62 → 65, Siyam yosun yiyicisi + prochilodus 69 → 73. Değişen vakalar:
  - 9 tek tür vakası: apisto panduro, Çin yılanbaşı, jewel, kribensis, leleupi, marliers julie, gökkuşağı yılanbaşı, sajica, Siyam yosun yiyicisi;
  - 3 ikili: turbo salyangoz + marliers julie, gökkuşağı yılanbaşı + ramirezi, Siyam yosun yiyicisi + prochilodus;
  - 1 "dar" vaka: Siyam yosun yiyicisi.
  - Tavan kuralı hiçbir vakayı değiştirmiyor: 1.077 vakanın 967'si zaten "dikkat" (vakalarda filtre yok); kalanlarda canlı riski uyarısı yok. Kural stub ve gerçek katalog testleriyle sınanıyor.

## Sonuçlar

- Yenme, yaralanma, alan ve kalabalık riski ya da aralık dışı su değeri olan akvaryum artık "uygun / sorun görünmüyor" demez. Genel özet cümlesi durumdan geldiği için ("Sağlık analizinde dikkat gerektiren konular var.") yeni metin gerekmedi.
- Doğru kurulmuş akvaryum denetimi (`S\motor-1-15\gercekci\`):
  - Kaynağın en küçük akvaryumundaki 443 tek tür kurulumunda yalnız 1 yeni "dikkat" çıktı: Buenos Aires tetra kendi kaynağının önerisinde "yük yüksek olabilir" alıyor (açık iş).
  - Yaygın 561 ikiliden 70'i "dikkat"e indi; hepsinde kaynaklı bir risk var (34 küçük balık avı, 29 yüzgeç ısırma, 7 salyangoz, 5 karides yenmesi; bir kısmı birlikte).
- Kayıtlı akvaryumlar: analiz sonucu saklanmıyor, her açılışta yeniden hesaplanıyor (karar 0037, "Sonuçlar"). Taşıma gerekmez.

## Açık işler

- %40 av boyu kuralının (`PREY_SIZE_RATIO`) yazılı kaynağı yok. Fırsatçı avcıda etkisi kırmızı uyarı ve "dikkat"; ayışığı guramisi + panda çöpçü de uyarı alıyor, oysa Seriously Fish Corydoras'ı uygun tank arkadaşı sayıyor.
- `conspecificAll` değerli 9 kaydın notu "tek çift" ya da "tek birey veya 5+ grup" diyor. Kayıtlara ayrı bir değer vermek, kaynakları yeniden okumayı isteyen ayrı bir veri işi.
- Buenos Aires tetra kendi kaynağının en küçük hacminde yük uyarısı alıyor; karar 0009'un "hiçbir tür ulaşmaz" varsayımı bu türde tutmuyor.
- Ekipman ve akıntı sarılarının genel sonuca etkisi ayrı bir karar olabilir.
- Altın vakalara ekipmanlı ikililer eklemek (kural fikstürde sınanmıyor) teknik bir seçenek.

## Geri alma

Kod, metin, veri ve belge değişikliği tek commit olacak; altın fikstür ayrı commit. Kod commit'i geri alınınca motor 1.14.0 davranışına döner; o durumda fikstür commit'i de geri alınmalı. Kullanıcı verisi ve depolama biçimi etkilenmez.
