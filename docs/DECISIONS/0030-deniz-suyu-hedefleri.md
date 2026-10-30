# 0030 — Deniz suyu hedefleri

- Tarih: 2026-10-30
- Durum: Kabul edildi. Ürün sahibi 2026-10-30'da öneri sayfasındaki (https://claude.ai/artifact/DorA3tVJtpaWW6xiiwR2yg) üç kuralda ve ekran taslağında Claude'un önerdiği seçeneği seçti. Karar 0029'un 2. maddesinin ("tuzluluk, pH ve KH akvaryum düzeyinde") motordaki uygulamasıdır.

## Bağlam

Karar 0029'a göre deniz canlılarında tuzluluk, pH ve KH türe özel değildir; hedefler OATA'nın ev akvaryumu kurulum rehberinden ("How to set up and maintain a marine aquarium", Eylül 2022), "yalnız balık" ve "omurgasızlı" diye ayrı alınır.

Motor 1.12.0'da her deniz canlısının kaydında bir özgül ağırlık aralığı (çoğunda 1,020–1,025) ve bir pH aralığı (8,1–8,4) vardı. Son ölçüm bir canlının özgül ağırlık aralığının dışındaysa kesin tehlike çıkıyordu (genel puan en çok 49). pH her canlının aralığıyla karşılaştırılıyordu.

## Karar

Ürün sahibinin kararları (2026-10-30):

1. **Hedefin dışı sarı uyarı; özgül ağırlık iki hedefin de dışındaysa tehlike.** 1,017'nin altı ya da 1,026'nın üstü bugünkü gibi kesin tehlikedir (genel puan en çok 49), çünkü OATA'nın hiçbir ev akvaryumu hedefi bu değeri kapsamıyor. Öbür seçenekler "her zaman sarı uyarı" ve "her zaman tehlike (bugünkü gibi)" idi.
2. **Yalnız balıklı akvaryumda nitrat için OATA'nın hedefi (en çok 20 mg/L).** 20'nin üstü sarı uyarı; 100'ün üstü bugünkü gibi tehlike (OATA'nın ticaret ölçütü, karar 0008). Omurgasızlı akvaryumda OATA nitratı ve fosfatı "türe bağlı" yazdığı için ikisi yalnız bilgi olarak gösterilir. Öbür seçenek "bugünkü gibi" (yalnız 100'ün üstü) idi.
3. **Hedef otomatik seçilir.** Akvaryumda balık olmayan bir canlı (karides, salyangoz, anemon, denizyıldızı, ileride mercan) varsa "omurgasızlı", yoksa "yalnız balık". Bölüm hangi hedefin neden seçildiğini yazar. Öbür seçenek akvaryum ayarında kullanıcının seçmesiydi.
4. **Sağlık analizinde "Deniz suyu" bölümü** taslaktaki gibi.

Hedefler (OATA, Eylül 2022):

| | Yalnız balık | Omurgasızlı |
|---|---|---|
| Özgül ağırlık | 1,017–1,023 | 1,024–1,026 |
| pH | 8,0–8,2 | 8,0–8,2 |
| KH | — | 8–12 dKH |
| Nitrat | en çok 20 mg/L | 5–10 mg/L, türe bağlı (bilgi) |
| Fosfat | — | 0,04–0,1 mg/L, türe bağlı (bilgi) |
| Sıcaklık | 24–27 °C (bilgi) | 24–26 °C (bilgi) |

Sıcaklık her canlının kendi aralığıyla değerlendirilir (karar 0029); OATA'nın sıcaklığı yalnız gösterilir.

Teknik kararlar (Claude):

- **Motor:**
  - Yeni modül `packages/compatibility-engine/src/marine.ts`: `marineProfileFor` ve `assessMarineWater`. Yalnız tuzlu su akvaryumunda çalışır. Her değer için bir satır döner: `ok`, `warning`, `danger`, `missing` (ölçüm yok) ya da `info` (yalnız bilgi).
  - Sonuç nesnesine yalnız tuzlu su akvaryumunda `marineWater` eklenir.
  - Beş yeni uyarı kodu: `marineSpecificGravity` (sarı), `marineSpecificGravityDanger` (tehlike), `marinePh`, `marineKh`, `marineNitrate`. Değişkenler: değer, hedefin alt ve üst sınırı (en çok değerinde yalnız üst), hedef (`fishOnly` ya da `invertebrates`) ve yön. Toplam uyarı kodu 53.
  - Su değeri ölçütü: hedef satırlarından değerlendirilenler (özgül ağırlık, pH; omurgasızlı akvaryumda KH; yalnız balıklı akvaryumda nitrat) denetim olarak sayılır.
  - Yalnız balıklı akvaryumda nitratın denetimi hedefin kendisidir; su kalitesi kuralının nitrat denetimi ölçüte ikinci kez girmez. 100 mg/L'nin üstünde su kalitesi kuralının tehlike uyarısı çıkar, hedef uyarısı çıkmaz.
- **"Özgül ağırlık ölçümü gerekli":** tuzlu su akvaryumunda en az bir canlı varsa ve ölçümde özgül ağırlık yoksa çıkar (eskiden canlının kaydındaki aralık gerekiyordu).
- **Katalog:**
  - Su türü yalnız tuzlu su olan 11 kaydın pH ve özgül ağırlık alanları kaldırıldı. Katalog denetimi bu kayıtlarda iki alanı yasaklar, öbür kayıtlarda pH'ı zorunlu tutar.
  - Motor pH aralığı olmayan canlıyı pH kesişimine ve kendi pH denetimine almaz.
  - Acı su kayıtları değişmedi: kendi pH ve özgül ağırlık aralıkları kalır.
- **Su değeri kartları** (ana sayfa, akvaryum sayfası, su değerleri sayfası; `src/lib/water-status.ts`): tuzlu su akvaryumunda pH, özgül ağırlık ve yalnız balıklı akvaryumda nitrat aynı değerlendirmeden "Hedefte" ya da "Hedefin dışında" etiketini alır. 100 mg/L'nin üstündeki nitrat yine "Çok yüksek"tir. Ana sayfa ve akvaryum sayfası, su değerleri sayfası gibi, tatlı su dışındaki akvaryumda TDS kartının yerinde özgül ağırlığı gösterir; eskiden deniz akvaryumunda da TDS gösteriyordu ve özgül ağırlık o iki sayfada hiç görünmüyordu.
- **Sürüm:** motor 1.13.0; yeni gömülü eşikler (OATA hedefleri) eklendiği için kural seti 1.10.0.

## Sonuçlar

- Yalnız balıklı akvaryumda 1,024–1,025 tutan kullanıcı artık tehlike görmez; sarı uyarı görür.
- Omurgasızlı akvaryumda pH 8,3 sarı uyarıdır (eskiden canlıların 8,1–8,4 aralığındaydı).
- Yalnız balıklı akvaryumda nitrat 20–100 mg/L arası artık sarı uyarıdır.
- Tatlı ya da acı su akvaryumuna eklenen bir deniz canlısında "akvaryum türü uyumsuz" kesin tehlikesi sürer. Canlının kaydında artık tuzluluk ve pH aralığı olmadığı için yanında "Özgül ağırlık ölçümü gerekli" ve pH çatışması çıkmaz.
- Altın fikstür (1033 vaka) ürün sahibinin onayından sonra yeniden üretildi; kod değişikliğinden ayrı bir commit'te kaydedilecek. 26 vaka değişti, hiçbirinin puanı ya da durumu değişmedi:
  - 11 deniz canlısının "sığar" vakasına `marineWater` eklendi.
  - 11 "dar" vakasına `marineWater` ve `marinePh` uyarısı eklendi. Bu vakanın ölçüm girdisi pH aralığı olmayan türde 7,5'tir (8,0'ın 0,5 altı); önceden türün aralığının 0,5 altıydı.
  - Tatlı su akvaryumunda deniz canlısı olan 4 çiftten "Özgül ağırlık ölçümü gerekli" kalktı, birinden ayrıca pH çatışması kalktı. Dördünde de "akvaryum türü uyumsuz" tehlikesi duruyor.

## Doğrulama

- `packages/compatibility-engine/test/marine.test.ts`: hedef seçimi, sınır değerleri, iki hedefin dışı, geçersiz ve eksik değerler, bilgi satırları, su değeri ölçütü, kesin tehlike, nitratın su kalitesi kuralıyla ilişkisi, tatlı ve acı su akvaryumunun değişmemesi.
- `src/lib/__tests__/engine-text.test.ts`: beş yeni kodun dil dosyasındaki metni motorun Türkçe metniyle aynı (üç stub senaryo).
- `src/lib/__tests__/marine-water.test.ts`: "Deniz suyu" bölümünün iki hedefte yazdıkları ve tehlike rengi.
- `src/lib/__tests__/water-status.test.ts` ve `dashboard-status.test.ts`: su değeri kartlarının deniz akvaryumundaki etiketleri; acı su akvaryumunun değişmemesi.
- `scripts/test-health.cjs`: yalnız balıklı akvaryumda özgül ağırlık 1,018 (uyarısız), 1,025 (sarı) ve 1,016 (tehlike, puan en çok 49).
