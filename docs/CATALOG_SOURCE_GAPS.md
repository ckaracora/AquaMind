# Kaynağı yalnızca FishBase olan türler

Son güncelleme: 2026-10-03 (`main` `18fdfeb` kataloğuyla üretildi)

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

Bu liste önce Canberk'in sıradaki katalog işi olarak önerildi (2026-10-03). Ürün sahibinin isteğiyle 2026-10-04'te işi Claude üstlendi; kaynak araştırması başladı ve düzeltmeler ayrı bir PR'da gelecek. Düzeltilen türler bu tablodan çıkarılmalı, çalışma notları `docs/CATALOG_LOG.md`'ye yazılmalıdır.

## Liste (45 tür)

| Kimlik | Ad | Bilimsel ad | Kategori | Boy (cm) | En az hacim (L) | En az uzunluk (cm) | Sıcaklık (°C) | pH | Bağlantı |
|---|---|---|---|---|---|---|---|---|---|
| `ancistrus` | Cüce vatoz | *Ancistrus cirrhosus* | balık | 13 | 80 | 80 | 22–26 | 5.8–7.6 | elle |
| `chili-rasbora` | Chili rasbora | *Boraras brigittae* | balık | 2 | 30 | 40 | 20–28 | 4–7 | otomatik |
| `cherry-barb` | Kiraz barb | *Puntius titteya* | balık | 5 | 60 | 60 | 22–27 | 6–8 | otomatik |
| `tiger-barb` | Sumatra barb | *Puntigrus tetrazona* | balık | 7 | 100 | 80 | 20–27 | 6–8 | otomatik |
| `discus` | Diskus | *Symphysodon aequifasciatus* | balık | 20 | 300 | 120 | 28–31 | 5–7 | otomatik |
| `kuhli-loach` | Kuhli çöpçü | *Pangio kuhlii* | balık | 10 | 70 | 70 | 24–30 | 5.5–7.5 | otomatik |
| `lambchop-rasbora` | Kuzu pirzola rasbora | *Trigonostigma espei* | balık | 3.5 | 50 | 60 | 23–28 | 5.5–7.5 | otomatik |
| `hengeli-rasbora` | Hengeli rasbora | *Trigonostigma hengeli* | balık | 3.5 | 50 | 60 | 23–28 | 5–7.5 | otomatik |
| `galaxy-rasbora` | Galaxy danio | *Danio margaritatus* | balık | 2.5 | 40 | 45 | 20–26 | 6.5–7.5 | otomatik |
| `emerald-dwarf-rasbora` | Zümrüt cüce danio | *Danio erythromicron* | balık | 3 | 45 | 50 | 20–25 | 7–8 | otomatik |
| `kubotai-rasbora` | Neon yeşil rasbora | *Microdevario kubotai* | balık | 3 | 50 | 60 | 22–27 | 6–7.5 | otomatik |
| `scissortail-rasbora` | Makas kuyruk rasbora | *Rasbora trilineata* | balık | 12 | 180 | 120 | 23–27 | 5–8 | otomatik |
| `rosy-barb` | Gül barb | *Pethia conchonius* | balık | 10 | 120 | 90 | 18–25 | 6–8 | otomatik |
| `odessa-barb` | Odessa barb | *Pethia padamya* | balık | 7 | 100 | 80 | 20–26 | 6–7.5 | otomatik |
| `gold-barb` | Altın barb | *Barbodes semifasciolatus* | balık | 7 | 100 | 80 | 18–26 | 6–8 | otomatik |
| `denison-barb` | Denison barb | *Sahyadria denisonii* | balık | 15 | 250 | 120 | 20–26 | 6.5–7.8 | otomatik |
| `checker-barb` | Dama barb | *Oliotius oligolepis* | balık | 5 | 70 | 70 | 20–26 | 6–7.5 | otomatik |
| `apisto-cacatuoides` | Kakadu cüce cichlid | *Apistogramma cacatuoides* | balık | 8 | 80 | 70 | 23–29 | 5.5–7.5 | otomatik |
| `apisto-agassizii` | Agassiz cüce cichlid | *Apistogramma agassizii* | balık | 9 | 90 | 75 | 24–29 | 5–7 | otomatik |
| `kribensis` | Kribensis | *Pelvicachromis pulcher* | balık | 10 | 100 | 80 | 24–28 | 5.5–8 | otomatik |
| `keyhole-cichlid` | Anahtar deliği cichlid | *Cleithracara maronii* | balık | 12 | 150 | 100 | 22–27 | 5.5–7.5 | otomatik |
| `blue-acara` | Mavi acara | *Andinoacara pulcher* | balık | 16 | 200 | 110 | 22–28 | 6–8 | otomatik |
| `severum` | Severum | *Heros efasciatus* | balık | 25 | 300 | 120 | 24–29 | 5.5–7.5 | otomatik |
| `yellow-lab` | Sarı prenses | *Labidochromis caeruleus* | balık | 12 | 200 | 100 | 24–28 | 7.5–8.6 | otomatik |
| `frontosa` | Frontosa | *Cyphotilapia frontosa* | balık | 35 | 600 | 180 | 24–27 | 7.8–9 | otomatik |
| `jack-dempsey` | Jack Dempsey | *Rocio octofasciata* | balık | 25 | 300 | 120 | 22–30 | 6–8 | elle |
| `jewel-cichlid` | Mücevher ciklet | *Rubricatochromis bimaculatus* | balık | 14 | 180 | 100 | 21–26 | 6.5–7.5 | elle |
| `honey-gourami` | Bal gurami | *Trichogaster chuna* | balık | 5 | 60 | 60 | 22–28 | 6–7.5 | otomatik |
| `sparkling-gourami` | Parıltılı gurami | *Trichopsis pumila* | balık | 4 | 45 | 50 | 24–28 | 5–7.5 | otomatik |
| `thicklip-gourami` | Kalın dudak gurami | *Trichogaster labiosa* | balık | 10 | 100 | 80 | 22–28 | 6–7.5 | otomatik |
| `paradise-fish` | Cennet balığı | *Macropodus opercularis* | balık | 10 | 100 | 80 | 16–26 | 6–8 | otomatik |
| `kissing-gourami` | Öpüşen gurami | *Helostoma temminckii* | balık | 25 | 300 | 120 | 22–28 | 6–8 | otomatik |
| `bronze-cory` | Bronz çöpçü | *Corydoras aeneus* | balık | 7 | 80 | 75 | 21–27 | 6–8 | otomatik |
| `sterbai-cory` | Sterbai çöpçü | *Corydoras sterbai* | balık | 7 | 80 | 75 | 24–28 | 6–7.5 | otomatik |
| `pygmy-cory` | Cüce çöpçü | *Corydoras pygmaeus* | balık | 3 | 45 | 50 | 22–26 | 6–7.5 | otomatik |
| `salt-pepper-cory` | Tuz biber çöpçü | *Corydoras habrosus* | balık | 3.5 | 45 | 50 | 20–26 | 6–7.5 | otomatik |
| `otocinclus` | Otocinclus | *Otocinclus macrospilus* | balık | 4 | 60 | 60 | 21–26 | 5.5–7.5 | otomatik |
| `common-pleco` | Common vatoz | *Hypostomus plecostomus* | balık | 45 | 500 | 150 | 22–28 | 6–8 | otomatik |
| `hillstream-loach` | Kelebek vatoz | *Sewellia lineolata* | balık | 6 | 100 | 80 | 20–25 | 6.5–8 | otomatik |
| `yoyo-loach` | Yoyo loach | *Botia almorhae* | balık | 15 | 200 | 120 | 24–30 | 6–7.5 | otomatik |
| `zebra-loach` | Zebra loach | *Botia striata* | balık | 10 | 150 | 100 | 23–28 | 6–7.5 | otomatik |
| `siamese-algae-eater` | Siamese algae eater | *Crossocheilus oblongus* | balık | 15 | 180 | 120 | 22–28 | 6–8 | otomatik |
| `white-cloud` | Beyaz bulut dağı balığı | *Tanichthys albonubes* | balık | 4 | 60 | 60 | 16–24 | 6–8 | otomatik |
| `medaka` | Medaka pirinç balığı | *Oryzias latipes* | balık | 4 | 60 | 60 | 15–28 | 6.5–8.5 | otomatik |
| `dojo-loach` | Hava durumu loach | *Misgurnus anguillicaudatus* | balık | 25 | 250 | 120 | 10–25 | 6–8 | otomatik |