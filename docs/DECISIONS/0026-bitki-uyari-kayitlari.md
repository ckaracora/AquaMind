# 0026 — Bitki kataloğunda yalnız uyarı kayıtları

- Tarih: 2026-10-28
- Durum: Kabul edildi. Ürün sahibi 2026-10-28'de üç seçenekten Claude'un önerdiğini ("Yalnız uyarı kaydı") seçti. Bitki kataloğunun (`docs/DECISIONS/0023-bitki-katalogu.md`) "Sonraki paketler" bölümündeki ilk iki işin devamıdır.

## Bağlam

Bitki kataloğu değerleri yalnız Fishkeeper'ın bitki bilgi bankasından ve Tropica'nın ürün sayfalarından alıyor (0023). Türk mağazalarında satılan bazı bitkilerin bu iki sitede sayfası yok, ama kaynaklı ve önemli bir uyarısı var:

- *Pistia stratiotes* (su marulu): AB'nin istilacı yabancı türler listesinde; UF/IFAS'ın başlığında "FISC Category 1".
- *Azolla filiculoides*: İngiltere'nin 2014 tarihli satış yasağında (güncel metinde hâlâ var).
- *Ophiopogon japonicus*: Practical Fishkeeping'in "akvaryumda kaçınılacak bitkiler" yazısında ev bitkisi olarak geçiyor; satıldığı mağazanın kendi açıklaması da "karasal bitkidir" diyor.

Seçenekler: yalnız uyarı kaydı, kataloğa almamak ya da değerler için yeni kaynak aramak.

## Karar

1. **Yalnız uyarı kaydı.** Bu bitkiler kataloğa adı, satış adı ve kaynaklı etiketiyle girer. Işık, CO₂, sıcaklık, pH, boy, büyüme ve yerleşim yoktur, ekranda "Kaynakta yok" yazar; değer uydurulmaz. Kullanıcı bitkiyi seçince ve kartta uyarıyı görür.
2. **Etiketler:**
   - İstilacı tür listeleri: AB listesi (`eu-union-list`), İngiltere'nin satış yasağı (`england-sale-ban`), UF/IFAS'ın başlığındaki ABD federal ve FISC listeleri. Metin önceki kararla aynı: "Doğaya bırakmayın." ve "Bu, Türkiye'de yasak olduğu anlamına gelmez." (0024).
   - "Su bitkisi değil" (`notAquatic`): Practical Fishkeeping'in yazısındaki ev bitkileri. Metin: "Practical Fishkeeping bu bitkiyi akvaryumda kaçınılacak ev bitkileri arasında sayıyor: su altında kısa süre dayanır."
3. **Kayıt kuralı** (`docs/DATA_SOURCES.md` → "Bitkiler"):
   - Kayıt `warningOnly: true` taşır ve değer alanı taşımaz.
   - En az bir kaynaklı etiketi vardır.
   - Ana kaynağı etiketlerinden birinin kaynağıdır.
   - En az bir kabul edilen Türk mağazasında ürün sayfası olmalıdır. Stok durumu ölçüt değildir (Aquarubi'de *Pistia* ve *Azolla* tükendi görünüyor, sayfaları yayında).
   - Bütünlük denetimi bunları zorlar.
4. **Kaynağı olmayanlar girmez.** Aquarubi'de satılan *Fittonia albivenis*, *Selaginella kraussiana* 'Mini' ve *Homalomena* türleri ne Fishkeeper'da ne Tropica'da ne de Practical Fishkeeping'in listesinde var. Practical Fishkeeping'in listesindeki *Selaginella* başka bir tür (*S. willdenowii*). Bu bitkiler kataloğa girmez; kullanıcı elle yazar.

Teknik kararlar (Claude):

- **Ayrı dizi:** kayıtlar `src/data/catalog-plants.ts` içinde, üretim betiğinin çıktısından ayrı elle yazılan bir dizidedir (`warningOnlyPlants`). Katalog iki dizinin birleşimidir. Betiğin çıktısıyla karşılaştıran test yalnız kaynaktan üretilen kayıtlara bakar; uyarı kayıtları alan alan ayrı sınanır.
- **İstilacı uyarısının metni:** UF/IFAS'ın başlığından gelen listeler birlikte ve kaynağıyla yazılır ("… (UF/IFAS)"). Resmî listeler adlarıyla yazılır; kaynakları "Kaynak" satırında bağlantılıdır (EUR-Lex, legislation.gov.uk). Var olan bitkilerin metni değişmedi.
- **Bitki uyarıları (0025):** değeri olmayan kayıt değerlendirilemez. Sağlık analizindeki bölüm bu bitkileri ayrıca yazar: "Değerleri kaynakta olmayan bitkiler için uyarı hesaplanmadı: … Bitki kartındaki uyarıya bakın." Yalnız bunlar varsa yeşil "uyarı yok" gösterilmez. Yeşil sonucun metni "Değerlendirilen bitkiler için uyarı yok." oldu (bir kısmı değerlendirilemediğinde).
- **Veri kapsamı:** bitkiler tablosuna "Su bitkisi değil etiketi" ve "Yalnız uyarı kaydı (değer kaynağı yok)" satırları eklendi. Uyarı kayıtları değer satırlarının paydasına girer; oranlar biraz düştü (`docs/DATA_COVERAGE.md`).

## Sonuçlar

- Kullanıcı bu üç bitkiyi katalogda bulur ve uyarısını görür; elle yazınca uyarı görmezdi.
- "Su bitkisi değil" ve istilacı tür etiketleri sağlık analizine girmez; yalnız seçerken ve bitki kartında görünür. Sağlık analizinde de gösterilmeleri ayrı bir ürün kararıdır. (2026-10-29: ürün sahibi sarı uyarı olarak gösterilmesini seçti, `docs/DECISIONS/0028-bitki-etiketleri-saglik-analizinde.md`.)
- Practical Fishkeeping'in tür kutuları (sıcaklık ve pH) bu pakette taranmadı; 0023'teki sıra gereği sonraki iştir.

## Doğrulama

- Kaynaklar 2026-10-28'de (UTC) okundu (`docs/CATALOG_LOG.md` → "Bitki kataloğu 3").
- `src/lib/__tests__/plant-catalog.test.ts`: üç kaydın bütün alanları, etiketler, bütünlük denetiminin yalnız uyarı kaydı kuralları.
- `src/lib/__tests__/plant-selection.test.ts`: uyarıların, notun ve kaynakların metni; seçme penceresi ve kart.
- `src/lib/__tests__/plant-warnings.test.ts`: sağlık bölümünde değeri olmayan bitkiler.
