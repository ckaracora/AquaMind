# 0045 — İkinci kaynak kademesi (çapraz kontrollü hobi kaynakları)

- Tarih: 2026-11-14
- Durum: Kabul edildi. Ürün sahibi (`buraksenfx`) 2026-11-14 22:30'da kuralı onayladı ("tamam kabul ediyorum devam et"). Alan adları (`secondarySources`, `tier`), hükme etkinin uygulanışı (hangi uyarının sarıya indiği) ve ekran düzeni Claude'un teknik kararıdır. Motor 1.20.0, kural seti 1.17.0. İşaretli kayıt henüz yok; altın fikstür değişmez.

## Bağlam

Veri 9 sprintinin 2. turunda bitki sıcaklığı ve pH'ı %54 ve %52'de kaldı, birçok canlının hacmi ve uzunluğu kaynaksız: kabul edilen kaynaklar (docs/DATA_SOURCES.md) bu değerleri yayımlamıyor. Uydurma yasağı geçerli; boşluğu doldurmanın tek dürüst yolu birkaç bağımsız kaynağı çapraz kontrol etmek ve bunu ekranda açıkça yazmak.

## Karar

1. **Ne zaman:** yalnız boş alanda ya da kabul edilen kaynağı bağlı olmayan değerde. Kabul edilen kaynağın yazdığı değer ikinci kademeyle değiştirilmez.
2. **Kabul ölçütü:** bitki sıcaklığı/pH'ı en az 2, canlı hacmi, tank uzunluğu ve davranış en az 3 bağımsız kaynak. Kopya metin taşıyan siteler ve aynı şirketin siteleri tek kaynaktır. Değer: sıcaklık ve pH'ta ortak aralık; hacim ve uzunlukta kaynakların büyüğü; ortak aralık boşsa ya da hacimde biri ötekinin 2 katından fazlaysa değer yok. Davranışta üç kaynaktan en az ikisi aynı riski açık cümleyle yazmalı, hiçbiri çelişmemeli (çelişki varsa `confidence: "conflict"`). Kullanılmayanlar ve kanıt kuralı docs/DATA_SOURCES.md → "İkinci kademe (çapraz kontrollü) kaynaklar".
3. **Veri işareti (en küçük düzen):**
   - Canlı (`SpeciesProfile`): `secondarySources?: { minVolumeL?: string[]; minTankLengthCm?: string[] }`. Anahtar alanın adı, değer o değerin kaynak adresleri. Birey başına ek hacim, sıcaklık ve pH ikinci kademeden yazılmaz.
   - Bitki (`PlantProfile`): `secondarySources?: { temperature?: string[]; ph?: string[] }`.
   - Davranış (`BehaviorRecord`): `tier: "secondary"`; `source` ilk hobi kaynağının adı, `sourceUrl` ve `additionalSourceUrls` üç kaynağın adresleri, `evidence` alıntılar.
   - Adresler `additionalSourceUrls`'e yazılmaz (orası kabul edilen kaynakların yeri; bitki testleri onu denetler). İşaret alanı adres listesi olduğu için ayrı bir "hangi alan" listesi tutulmaz: anahtar varsa ve listesi boş değilse alan ikinci kademedir. Ayrı dosya açılmadı: alan kaydın kendisinde durur, katalog parçalarına (karar 0016) kendiliğinden girer.
   - Biçim denetimi: `src/lib/__tests__/secondary-sources.test.ts` (alan ve değer var, yeterli sayıda ayrı site, kabul edilen kaynak ve Wikipedia yok).
4. **Hükme etkisi (motor 1.20.0):**
   - Bitki ve davranış: ikinci kademe değer normal kullanılır (değişiklik yok).
   - Canlının hacmi ve tank uzunluğu: alan uyarısı tek başına "uygun değil" demez. Kabul edilen kaynağın değeriyle eksik kalan bir ölçü yoksa uyarı sarıdır: `spaceTooSmall` (yalnız hacme bakar; hacim ikinci kademedeyse) kesin tehlike değildir; `spaceSevere` sarıdır ve yüzme alanı ölçütünü kırmızıya çekmez (sarı alan sorununun tabanı 60). `spaceSevere` canlı riski sınıfına girdi; böylece bütün alan uyarıları genel puanı en çok 74 yapar. Kabul edilen kaynağın değeri de eksik kalıyorsa (ör. hacim ikinci kademede ama kaynağın uzunluğu ve İsviçre sınırı tutmuyor) o ölçünün bugünkü kırmızısı kalır; yine de kesin tehlike yalnız kabul edilen kaynağın hacmiyle olur.
   - Metin: uyarı `secondary: true` değişkeni taşır; sonuna şu not eklenir: «Bu türün hacim ya da uzunluk değeri kabul ettiğimiz kaynaklarda yok; birkaç hobi kaynağının ortak değeridir. Bu yüzden bu uyarı sonucu en fazla "Dikkat" yapar.» `spaceTooSmall` "Kaynağa göre" yerine "Birkaç hobi kaynağına göre" der, "Bu tür bu akvaryumda tutulmamalı" yerine "Bu tür için daha büyük bir akvaryum gerekir" der (EN, ES aynı anlamda).
5. **Ekran:** ikinci kademe değerin yanında kısa bilgi: tr "Birkaç hobi kaynağının ortak değeri", en "Shared value from several hobby sources", es "Valor común de varias fuentes de aficionados" (`t.common.secondarySource`). Dokununca kaynak listesi açılır (`src/components/secondary-source-note.tsx`). Tür kartında hacim, uzunluk ve davranış satırında; bitki kartında sıcaklık ve pH'ta. Kaynaklar kartın kaynak listesine de girer.

## Sonuç

- İşaretsiz kayıtta sonuç değişmez; altın fikstür aynı kalır (1.20.0 testi ve fikstür testi). İşaretli kayıt eklendiğinde fikstür son kapıda yeniden üretilir.
- Eski kayıtlar: kullanıcı verisi değişmez; yalnız katalog kaydına isteğe bağlı alan eklendi.
- Geri alma: alanlar isteğe bağlıdır; motor değişikliği `isSecondarySpaceValue` ve `hardSpaceIssue` çevresindedir, kaldırılınca 1.19.0 davranışı döner.
