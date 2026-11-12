# 0042 — Deniz akvaryumunda özgül ağırlığın sınır bandı

- Tarih: 2026-11-12
- Durum: Kabul edildi. Ürün sahibi (`buraksenfx`) 2026-11-12'de onayladı: "Sınırda 'dikkat' bandı olsun" (hedefin hemen dışındaki küçük bant "dikkat", daha uzak değerler "uygun değil"; bandın tam sınırları kaynaklara bakılarak). Bandın genişliği ve iki hedefte ayrı uygulanması Claude'un teknik kararıdır. Motor 1.17.0, kural seti 1.14.0. Altın fikstür son kapıda yeniden üretildi: bayt bayt aynı, ayrı commit gerekmedi (aşağıda). Kontrol: Google Gemini (Antigravity) denetimi, 2026-11-12: P1 yok; P2 ve P3 bulguları son kapıda düzeltildi (aşağıda, "5. Denetim sonrası").

## Bağlam

Veri testi E (39 sayılan senaryo, motor 1.16.0) hata %7,7 buldu. Üç hatanın üçü de aynı kuraldan:

| Senaryo | Akvaryum | Özgül ağırlık | Motor (1.16.0) | Beklenen |
|---|---|---|---|---|
| E20 | yalnız balık, 2 ocellaris | 1,016 | 49 "uygun değil" | "dikkat" |
| E21 | yalnız balık, 2 ocellaris | 1,027 | 49 "uygun değil" | "dikkat" |
| E23 | omurgasızlı (palyaço, gramma, temizlikçi karides, nassarius) | 1,027 | 49 "uygun değil" | "dikkat" |

- Karar 0030'a göre özgül ağırlık OATA'nın iki ev akvaryumu hedefinin birleşiminin (1,017–1,026) dışındaysa kesin tehlikedir.
- Üç değer de bu aralığın yalnız binde bir dışında.
- Binde birlik fark sonucu iki basamak düşürüyordu: omurgasızlı akvaryumda 1,026 "uygun", 1,027 "uygun değil"; yalnız balıklı akvaryumda 1,017 "uygun", 1,016 "uygun değil".

## Karar

Ürün sahibinin isteği (2026-11-12): güvenli aralığın hemen dışındaki küçük bant "dikkat", daha uzak değerler "uygun değil".

Kural (`MARINE_SPECIFIC_GRAVITY_DANGER_LIMITS`, `packages/compatibility-engine/src/marine.ts`):

| | Hedef (değişmedi) | Sarı ("hedefin dışında") | Kesin tehlike |
|---|---|---|---|
| Yalnız balık | 1,017–1,025 | 1,016–1,017 arası ve 1,025–1,027 arası (1,016 ve 1,027 dahil) | 1,016'nın altı, 1,027'nin üstü |
| Omurgasızlı | 1,024–1,026 | 1,017–1,024 arası (1,017 dahil, değişmedi) ve 1,026–1,027 arası (1,027 dahil) | 1,017'nin altı (değişmedi), 1,027'nin üstü |

- Sınır değerleri sarıdır: 1,016 ve 1,027 sarı; 1,0159 ve 1,0271 kesin tehlike.
- Bant içindeki uyarı bugünkü sarı `marineSpecificGravity` uyarısıdır. Canlı riski sınıfındadır (karar 0040): canlı varken genel puan en fazla 74, sonuç "dikkat".
- Bandın dışı bugünkü gibi `marineSpecificGravityDanger`: kesin tehlike, genel puan en çok 49.
- Değişmeyenler:
  - hedefler (`MARINE_TARGETS`) ve güvenli aralık (`MARINE_SPECIFIC_GRAVITY_SAFE`, 1,017–1,026; kesin tehlikenin metnindeki aralık);
  - uyarı kodları (61), metinleri ve değişkenleri;
  - acı su türlerinin kendi özgül ağırlık aralığı (`salinityOutOfRange`, kesin tehlike);
  - canlısız akvaryum: bant içi sarı uyarı genel puanı değiştirmez (karar 0040); bandın dışı kesin tehlike sürer (karar 0041).

Teknik kararlar (Claude):

### 1. Kaynaklar tehlike sınırı vermiyor

Kaynaklar 2026-11-12'de yeniden okundu. Hiçbiri "şu değerin altı ya da üstü tehlikelidir" demiyor:

- OATA, "How to set up and maintain a marine aquarium" (Eylül 2022): yalnız balık 1.017–1.023 SG (23–30 ppt), omurgasızlı 1.024–1.026 SG (32–35 ppt). Tehlikeli bir değer yazmıyor.
- OATA, "OATA water quality criteria" (Ekim 2022): deniz türleri için serbest amonyak, nitrit, pH (en az 8,1), oksijen ve nitrat sınırları var; tuzluluk satırı yok.
- OATA, "How to understand & test water quality in a marine aquarium" (Eylül 2022): sayı vermiyor. Tuzluluğun hızlı değişmesinin ciddi strese, hatta ölüme yol açabileceğini ve değişikliklerin yavaş yapılmasını yazıyor.
- OATA'nın deniz balığı bakım kartları: 1.020–1.025 (karar 0041).
- OATA'nın deniz omurgasızı bakım kartları (Eylül 2022; anemonlar, deniz yumuşakçaları, denizyıldızı-deniz kestanesi-deniz hıyarı, deniz kabukluları): dördü de 1.023–1.026. Dördü de omurgasızların su kimyasındaki değişime balıktan daha zor dayandığını yazıyor.
- Fishkeeper: deniz balığı sayfalarında 1.020–1.025 (karar 0029, 0041).
- Practical Fishkeeping (Jeremy Gay, "Marine fish with character"): omurgasız yokken deniz balıklarının geniş bir sıcaklık ve tuzluluk aralığına dayandığını yazıyor; sayı vermiyor.

Sonuç: bandın sınırları kaynaklı bir sayı değildir. Aşağıdaki genişlik teknik karardır.

### 2. Bant bir okuma basamağı (0,001)

- Özgül ağırlık üç ondalıkla okunur ve yazılır: uygulama, kaynaklar ve uyarı metinleri binde bir basamak kullanır. En küçük bant bir basamaktır.
- Ölçüm payı bu basamak kadardır:
  - Fishkeeper'ın sattığı Aqua Marin refraktometresinin sayfası doğruluğu ±1 ppt yazıyor. Bu bir ürün bilgisidir, bakım kaynağı değildir; bandın kaynağı değil, ölçüm payının örneğidir.
  - OATA rehberinin kendi dönüşümüne göre 1 ppt yaklaşık 0,0007–0,0009 özgül ağırlıktır (1.017–1.023 = 23–30 ppt; 1.024–1.026 = 32–35 ppt). Yani ±1 ppt en çok bir okuma basamağıdır.
- Güvenli aralığın bir basamak dışındaki ölçüm, bu payla sınırdaki değerden ayırt edilemez. Kesin tehlike demek için yeterli değildir; "dikkat" doğru hükümdür.
- İki basamak dışı (ör. 1,015 ya da 1,028) bu payı aşar; kesin tehlike kalır.

### 3. İki hedefte ayrı

- **Yalnız balık: iki uçta.**
  - Alt uç 1,016: rehberin yalnız balık hedefinin (1,017) bir basamak altı.
  - Üst uç 1,027: OATA'nın ev akvaryumu için yazdığı en yüksek değerin (1,026) bir basamak üstü.
  - PFK'ya göre omurgasız yokken balıklar geniş tuzluluğa dayanır; alt uçtaki bant gerçek bir tehlikeyi gizlemiyor.
- **Omurgasızlı: yalnız üst uçta (1,027).**
  - Üst sınır (1,026) bu hedefin kendi üst sınırıdır; 1,027'de bir basamakta iki sonuç basamağı düşülüyordu (E23).
  - Alt tehlike sınırı (1,017) bu hedefin alt sınırının (1,024) yedi basamak altındadır. Aradaki 1,017–1,024 zaten sarıdır; tek basamakta iki sonuç basamağı düşüşü yoktur. 1,016, omurgasızlı hedefin sekiz basamak altıdır; ölçüm payı onu hedefin yakınına getirmez.
  - OATA'nın dört omurgasız kartı omurgasızların su kimyasındaki değişime balıktan daha duyarlı olduğunu yazıyor. Alt uç genişletilmedi.

### 4. Metin

Uyarı metinleri değişmedi; her değerde doğru kalıyor:

- Bant içi (sarı): "OATA'nın yalnız balıklı akvaryum hedefi 1,017–1,025; son ölçüm 1,016." ve "OATA'nın omurgasızlı akvaryum hedefi 1,024–1,026; son ölçüm 1,027."
- Bant dışı (kırmızı): "Son ölçüm 1,015. OATA'nın hiçbir ev akvaryumu hedefi bu değeri kapsamıyor (1,017–1,026). Tuzluluğu yavaşça hedefe getirin."
- Dil dosyalarının (TR, EN ABD, ES Latin Amerika) metni ve `MARINE_SPECIFIC_GRAVITY_SAFE_MIN/MAX` (1,017 ve 1,026) değişmedi.

### 5. Denetim sonrası (2026-11-12)

Google Gemini (Antigravity) denetimi: P1 yok. Düzeltilenler:

- **Omurgasızlı sınır bandı sağlık betiğinde (P2).** `scripts/test-health.cjs`: palyaço çifti ve temizlikçi karides; 1,016 ve 1,028 kesin tehlike, 1,017 ve 1,027 sarı ("uygun değil" değil), 1,024 ve 1,026 uyarısız. Senaryo sayısı 113 → 114.
- **Ölçüm, aştığı sınırla aynı görünmez (P3).** 1.14.0'daki mekanizma (`f.measurement(değer, ondalık, karşılaştırılan)`, `engine-format.ts`) iki metinde kullanılır, üç dilde:
  - kesin tehlike: aşılan kesin tehlike sınırı (`marineSpecificGravityDangerBound`, `packages/localization/src/messages/engine-limits.ts`; sınırlar motorun `MARINE_SPECIFIC_GRAVITY_DANGER_LIMITS` sabitiyle aynı, testte denetlenir). 1,0159 "1,016" değil "1,0159" yazılır.
  - sarı: hedefin aşılan ucu (değişkenlerdeki yön, alt ve üst sınır). 1,0251 "1,025" değil "1,0251" yazılır.
  - Üç ondalıklı ölçümün yazımı, sözcükler, kodlar ve değişkenler değişmez. Motorun kendi Türkçe metni üç ondalıkla kalır; ekran metni dil dosyasından gelir.
- **Kayan nokta payı (P3).** Özgül ağırlık hedefle ve kesin tehlike sınırıyla 1e-9 payla karşılaştırılır (`marine.ts`). Hesapla gelen sınır değeri sınırın kendisi sayılır (1,015 + 0,001 = 1,0159999999999998 sarı; 1,028 − 0,001 = 1,0270000000000001 sarı; 1,023 + 0,001 omurgasızlıda hedefte). Dört ondalığa yuvarlama seçilmedi: form her ondalığa izin verir (`step="any"`), yuvarlama 1,02704 gibi elle girilen bir ölçümü kesin tehlikeden sarıya taşırdı. Pay yalnız artığı yutar; 1,0271, 1,02701 ve 1,027001 kesin tehlike kalır.
- **Motor metnindeki aralık sabitten (P3).** `marineSpecificGravityDanger` metnindeki "(1,017–1,026)" artık `MARINE_SPECIFIC_GRAVITY_SAFE`'ten yazılır; metin aynı.

### Sürüm

- **Motor 1.17.0.** Kural: `ENGINE_VERSION` puanı ya da uyarıyı değiştiren her kod değişikliğinde yükselir.
- **Kural seti 1.14.0.** Kesin tehlike koşulu değişti, yeni sabit geldi (`MARINE_SPECIFIC_GRAVITY_DANGER_LIMITS`). Sonuç nesnesinin biçimi değişmez.

## Değerlendirilen alternatifler

Ölçüm: `S\motor-1-17\` (2026-11-12). Bütün seçeneklerde B, C, D aynı kaldı; E üçünde de %0. Farkı tarama gösteriyor (29 özgül ağırlık değerinde 1.450 deniz kurulumu: 18 deniz balığı ve 13 omurgasız tek başına, palyaço çifti + her omurgasız, tuzlu suya da girebilen 5 acı su türü, canlısız akvaryum).

| Seçenek | Kesin tehlike sınırları (yalnız balık / omurgasızlı) | Taramada değişen | Neden seçilmedi |
|---|---|---|---|
| **Seçilen** | 1,016–1,027 / 1,017–1,027 | 222 | — |
| Omurgasızlıda da alt uç | 1,016–1,027 / 1,016–1,027 | 300 | 78 vaka daha: omurgasızlı akvaryumda 1,016–1,0169 "dikkat" olur; hedefin 7–8 basamak altı, omurgasız düşük tuzluluğa duyarlı. |
| Yalnız balıkta alt uç 1,015 (ürün sahibinin yaklaşık sayısı) | 1,015–1,027 / 1,017–1,027 | 294 | 72 vaka daha: 1,015–1,0159. Rehberin alt sınırının iki basamak altı, ölçüm payını (±1 ppt) aşar. Ürün sahibi isterse tek sabit değişir. |
| Her yerde iki basamak | 1,015–1,028 / 1,015–1,028 | 600 | En geniş; iki uçta da ölçüm payını aşar. |
| Bant içi uyarıya ayrı metin ("yeniden ölçün") | — | — | Bugünkü metinler doğru; üç dilde yeni metin ve kod gerekmeden çözülüyor. Açık iş olarak kaldı. |

## Doğrulama

- Yeni stub test `packages/compatibility-engine/test/warnings-1-17.test.ts` (17 test; ilk 15'in 11'i 1.16.0 motorunda başarısız; denetim sonrası iki test kayan nokta payını sınar):
  - sürüm; sabitler; bandın bir basamak olması ve omurgasızlıda alt ucun değişmemesi;
  - satır durumu sınırlarda (1,0159, 1,016, 1,0169, 1,017, 1,025, 1,0251, 1,026, 1,027, 1,0271; omurgasızlıda 1,016, 1,0169, 1,017, 1,0239, 1,024, 1,026, 1,0261, 1,027, 1,0271);
  - yalnız balıkta 1,016 ve 1,027 (eşitlik): tam metin, değişkenler, yön, genel 74 "dikkat"; bandın içi; 1,0159, 1,0271, 1,015, 1,010, 1,028, 1,030 kesin tehlike ve tam metin; su değeri ölçütü;
  - omurgasızlıda 1,027 ve 1,0261 sarı, 1,0271 ve 1,028 kesin tehlike, 1,017 sarı, 1,0169 ve 1,016 kesin tehlike;
  - canlısız deniz akvaryumu, acı su türünün kendi aralığı, tatlı ve acı su akvaryumu.
- Güncellenen testler:
  - `marine.test.ts`: yalnız balıkta kesin tehlike örnekleri 1,0159, 1,0271, 1,03; sarı örneklere 1,016, 1,0169, 1,0261, 1,027; omurgasızlıda 1,027 sarı, 1,0271 tehlike; analiz örneği 1,016 → 1,015.
  - `warnings-1-16.test.ts`: sürüm testi "en az 1.16.0 / 1.13.0" oldu (tam değer 1-17'de); kesin tehlike örnekleri 1,0261 ve 1,0169 → 1,0271 ve 1,0159.
  - `scripts/test-health.cjs`: yalnız balıkta 1,016 ve 1,027 sarı, 1,015 ve 1,028 tehlike; omurgasızlıda (denetim sonrası, yeni senaryo) 1,016 ve 1,028 tehlike, 1,017 ve 1,027 sarı, 1,024 ve 1,026 uyarısız.
  - `src/lib/__tests__/engine-text.test.ts`: iki stub senaryo (yalnız balıkta 1,016, omurgasızlıda 1,027; 48 → 50); üç dilin metni motorun Türkçesiyle aynı. Denetim sonrası bir test: ölçümün aştığı sınırla aynı görünmemesi, üç dilde (kesin tehlikede 1,0159, 1,0271, omurgasızlıda 1,0169; sarıda 1,0251, 1,0169, omurgasızlıda 1,0239 ve 1,0261; üç ondalıklı ölçüm değişmez).
  - `test/legacy-scripts.test.ts`: 114 senaryo.
- Senaryolar (motor kopyasıyla, `S\motor-1-17\olcum.txt`):

| Tur | 1.16.0 | 1.17.0 |
|---|---|---|
| B (30) | 23 tutan | 23 tutan (değişen yok) |
| C (38) | 37/0/1/0, %2,6 | aynı; C26 (1,014) kesin tehlike kalır |
| D (39) | 38/0/1/0, %2,6 | aynı |
| E (39) | 36/0/3/0, %7,7 | **39/0/0/0, %0** (E20, E21, E23: 49 "uygun değil" → 74 "dikkat") |

- Kaçırma denetimi (tarama): kesin tehlike bölgesindeki (yalnız balıkta 1,016'nın altı, omurgasızlıda 1,017'nin altı, ikisinde de 1,027'nin üstü) 862 canlılı ve 16 canlısız vakanın hepsi "uygun değil". Sınırların içinde (hedef dışı, sarı satır) "uygun değil" çıkan 20 vakanın hepsi tuzlu suya da girebilen acı su türlerinde, türün kendi aralığından (`salinityOutOfRange`).
- Doğru kurulmuş akvaryum denetimi (`motor-1-16\betik\gercekci-16.cjs`, 15.857 vaka): yalnız 49 vaka değişir, hepsi deniz tek tür setinde: 18 balık 1,016'da, 18 balık ve 13 omurgasız 1,027'de "uygun değil" → "dikkat". 443 tek tür, 561 yaygın ikili, karides çiftleri ve canlısız set değişmez.
- **Altın fikstür (1.077 vaka):** beklenen fark yok. Vakaların 62 özgül ağırlık satırının hepsi "ölçüm yok" (`missing`). Son kapıda (denetim düzeltmelerinden sonra) yeniden üretildi: bayt bayt aynı.

## Sonuçlar

- Yalnız balıklı deniz akvaryumunda 1,016 ve 1,027, omurgasızlı akvaryumda 1,027 artık "uygun değil" değil, "dikkat". Ekranda sarı "Özgül ağırlık hedefin dışında" uyarısı ve OATA'nın hedefi görünür.
- 1,015 ve altı (omurgasızlıda 1,0169 ve altı) ile 1,028 ve üstü bugünkü gibi "uygun değil".
- Kayıtlı akvaryumlar: analiz her açılışta yeniden hesaplanıyor; taşıma gerekmez.

## Açık işler

- Bant içindeki sarı uyarı, hedef dışındaki öbür sarıyla aynı metni kullanıyor. "Ölçüm güvenli aralığın sınırında; yeniden ölçün" gibi bir cümle istenirse üç dilde ayrı metin işi.
- ~~Dört ondalıklı ölçüm üç ondalıkla yazılıyor~~: denetim sonrası çözüldü (yukarıda, 5): 1,0159 "1,0159" yazılır.
- Ürün sahibinin yaklaşık sayısı yalnız balıkta alt uçta 1,015 idi; seçilen sınır 1,016 (bir basamak). İstenirse `MARINE_SPECIFIC_GRAVITY_DANGER_LIMITS.fishOnly[0]` 1,015 olur (taramada 72 vaka daha "dikkat").
- Denetimin emin olmadığı iki konu (ürün sahibine sorulacak; davranış değiştirilmedi):
  - Canlısız deniz akvaryumunda bandın dışındaki tuzluluk (ör. 1,0159, 1,0271) kesin tehlike, genel en çok 49 (karar 0041). Balıksız döngü kuran kullanıcı tuzluluğu ayarlarken "uygun değil" görür; amonyak ve nitritteki gibi sarı "canlı eklemek için erken" mi olmalı?
  - Tuzlu suya da girebilen acı su türleri (ör. mono, scat; katalogda 1,005–1,026): 1,027 akvaryum düzeyinde sarı, ama türün kendi aralığı dışında olduğu için `salinityOutOfRange` kesin tehlike; genel sonuç "uygun değil" kalır.

## Geri alma

Kod, test ve belge değişikliği tek commit; altın fikstür değişmedi. Kod commit'i geri alınınca motor 1.16.0 davranışına döner. Kullanıcı verisi ve depolama biçimi etkilenmez.
