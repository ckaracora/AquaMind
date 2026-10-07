# Kaynağı yalnızca FishBase olan türler

Son güncelleme: 2026-10-05. İlk liste 2026-10-03'te `main` `18fdfeb` kataloğuyla üretildi (45 tür); 42'si 2026-10-04'te kaynaklandı (`docs/CATALOG_LOG.md` → "2026-10-04 Kaynağı yalnızca FishBase olan 42 türün kaynak yenilemesi"). Kalan 3 türün kimliği 2026-10-05'te düzeltildi (`docs/CATALOG_LOG.md` → "2026-10-05 Kimliği belirsiz 3 türün kimlik ve kaynak düzeltmesi"); liste boş.

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

Bu liste önce Canberk'in sıradaki katalog işi olarak önerildi (2026-10-03). Ürün sahibinin isteğiyle 2026-10-04'te işi Claude üstlendi ve 42 türü kaynaklandırdı; bu türler tablodan çıkarıldı. Kalan üç türde sorun kaynak eksikliğinden çok kimlik belirsizliğiydi; 2026-10-05'te ayrı bir işte çözüldü.

## Kalan liste (yok)

Kalan üç kaydın sorunu kaynak eksikliği değil kimlikti. Ürün sahibinin 2026-10-05 onayıyla (`docs/DECISIONS/0014-coklu-tur-satis-adi-profilleri.md`) üçü de satılan balığa göre yeniden tanımlandı ve kaynaklandı:

| Kimlik | Ad | Eski bilimsel ad | Yeni bilimsel ad | Ana kaynak |
|---|---|---|---|---|
| `ancistrus` | Cüce vatoz | *Ancistrus cirrhosus* | *Ancistrus* sp. '3' | Seriously Fish |
| `common-pleco` | Common vatoz | *Hypostomus plecostomus* | *Pterygoplichthys pardalis* / *P. disjunctivus* | Fishkeeper |
| `siamese-algae-eater` | Siamese algae eater | *Crossocheilus oblongus* | *Crossocheilus langei* / *C. atrilimes* | Seriously Fish |

Değerler, çelişkiler ve kaynak cümleleri katalog günlüğündedir. Yeni bir tarama bu ölçüte uyan tür bulursa bu bölüme eklenmelidir.
