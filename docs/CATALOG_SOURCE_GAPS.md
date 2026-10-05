# Kaynağı yalnızca FishBase olan türler

Son güncelleme: 2026-10-04. İlk liste 2026-10-03'te `main` `18fdfeb` kataloğuyla üretildi (45 tür); 42'si 2026-10-04'te kaynaklandı (`docs/CATALOG_LOG.md` → "2026-10-04 Kaynağı yalnızca FishBase olan 42 türün kaynak yenilemesi").

## Neden önemli

Bu türlerin tek kaynağı bir FishBase özet sayfası. Bu kaynakların çoğu, katalog oluşturulurken bilimsel addan otomatik üretildi (`catalog-species-expanded.ts` içindeki `fishSource`). FishBase tür kimliği, boy ve su değerleri için iyi bir kaynak. Ama özet sayfaları **akvaryum hacmi yayımlamaz**; en küçük akvaryum uzunluğunu ise yalnızca bazı türler için verir (ör. beyaz bulut için 60 cm, kribensis için 80 cm; bu iki türde katalogdaki uzunluk FishBase'le aynı). Bu yüzden açık hacim ve uzunluk için ayrı değerlendirilmelidir:
- **Hacim (`minVolumeL`):** Bu türlerin hepsinde görünür bir kaynağa dayanmıyor.
- **Uzunluk (`minTankLengthCm`):** Tür tür denetlenmeli; FishBase'in uzunluk verdiği türlerde kaynaklı, vermediği türlerde kaynaksız.

Bu değerler doğrudan alan uyarısını belirler. Kaynağın önerisinin altı sarı uyarıdır; motor 1.6.0'dan beri balıklarda İsviçre ölçü sınırının da altı kırmızı uyarıdır (`docs/DECISIONS/0012-alan-uyarisinin-siddeti.md`). Listede hobinin en yaygın türleri var.

## Ölçüt

`sourceUrl` bir FishBase özet sayfası ve `additionalSourceUrls` boş, ya da yalnızca FishBase bağlantılarından oluşuyor. "Bağlantı" sütununda "otomatik", bağlantının kayıtta yazılmayıp `fishSource` ile bilimsel addan üretildiğini; "elle", kayıtta açıkça yazıldığını gösterir (42 otomatik, 3 elle).

## Düzeltme kuralı

`docs/DATA_SOURCES.md` geçerlidir:
- Hacim, uzunluk, grup ve bakım eşikleri kurumsal bakım rehberinden gelir. Öncelik Seriously Fish'tedir; sonra Practical Fishkeeping, Fishkeeper ve OATA gelir.
- FishBase kimlik ve boy için ek kaynak olarak kalabilir.
- Kaynak taban ölçüsü veriyorsa, katalog günlüğündeki mevcut yöntem kullanılır (ör. 180 × 60 cm taban → yaklaşık 648 L).
- Kaynakta olmayan değer uydurulmaz. Kaynaklar çelişirse fark not edilir.

Bu liste önce Canberk'in sıradaki katalog işi olarak önerildi (2026-10-03). Ürün sahibinin isteğiyle 2026-10-04'te işi Claude üstlendi ve 42 türü kaynaklandırdı; bu türler tablodan çıkarıldı. Kalan üç türde sorun kaynak eksikliğinden çok kimlik belirsizliği; ayrı bir işte çözülecek.

## Kalan liste (3 tür)

| Kimlik | Ad | Bilimsel ad | Kategori | Boy (cm) | En az hacim (L) | En az uzunluk (cm) | Sıcaklık (°C) | pH | Bağlantı |
|---|---|---|---|---|---|---|---|---|---|
| `ancistrus` | Cüce vatoz | *Ancistrus cirrhosus* | balık | 13 | 80 | 80 | 22–26 | 5,8–7,6 | elle |
| `common-pleco` | Common vatoz | *Hypostomus plecostomus* | balık | 45 | 500 | 150 | 22–28 | 6–8 | otomatik |
| `siamese-algae-eater` | Siamese algae eater | *Crossocheilus oblongus* | balık | 15 | 180 | 120 | 22–28 | 6–8 | otomatik |

- `ancistrus`: Seriously Fish'te *Ancistrus cirrhosus* sayfası yok. Bulunan sayfa ticari "bristlenose" balığını *Ancistrus* sp. '3' (cf. *cirrhosus*) olarak ele alıyor ve genetik verinin *A. cirrhosus* yakınlığını desteklemediğini, balığın melez olabileceğini söylüyor. Bu sayfanın bakım değerleri (54 L, 60 cm, 21–26 °C, pH 5,5–7,5) katalogdaki bilimsel ada bağlanmadı; kimlik kararıyla birlikte değerlendirilecek. Kayıttaki L144 gibi satış adları da ayrı *Ancistrus* formları olabilir.
- `common-pleco`: Seriously Fish'te *Hypostomus plecostomus* sayfası yok. Practical Fishkeeping'e göre "common plec" adıyla satılan balıklar çoğunlukla *Pterygoplichthys pardalis* ve *P. disjunctivus*; Fishkeeper'ın "Common Plec" sayfası da *P. pardalis*.
- `siamese-algae-eater`: Seriously Fish'e göre *Crossocheilus oblongus* neredeyse kesinlikle Siyam yosun yiyicisi adıyla satılan balık değil; satılanlar *C. atrilimes* ve *C. langei*. OATA bakım kılavuzu yalnızca en az 120 cm uzunluk veriyor.
