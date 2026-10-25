# 0023 — Bitki kataloğu

- Tarih: 2026-10-25
- Durum: Kabul edildi. Ürün sahibi 2026-10-25'te (UTC) kaynak önerisindeki dört konunun dördünde de Claude'un önerisini seçti. Bitki kataloğu yol haritasının 4. adımıdır (`docs/DECISIONS/0020-urun-hedefleri-ve-yol-haritasi.md`, karar 1); bitki için kabul edilecek kaynak listesi orada açık ürün kararı olarak bekliyordu.

## Bağlam

Bitki sayfasında kullanıcı bitkiyi elle yazıyor; katalog yok, bitkiye göre uyarı da yok. Katalog önce katalogdan seçmeyi, ileride bitkiye göre uyarıları mümkün kılacak.

Claude altı kaynağın sayfalarını açarak inceledi ve ürün sahibine artı ve eksileriyle bir öneri sayfası sundu:

- Fishkeeper (Maidenhead Aquatics) bitki bilgi bankası: 71 akvaryum bitkisi; ışık, sıcaklık aralığı, sertlik, pH, boy, en, büyüme hızı, zorluk ve açıklama.
- Tropica (bitki yetiştiricisi): ışık ve CO₂ ihtiyacı tanımlı bir ölçekle, büyüme hızı, iki ayda ulaşılan boy; sıcaklık ve pH yok.
- Practical Fishkeeping: adı geçen yazarların yazıları ve tür kutuları; "akvaryumda kaçınılacak bitkiler" yazısı.
- Flowgrow: alanları zengin ama sahibi bir bitki satıcısı (Aquasabi); bazı değerler bütün bitkilerde aynı, yani varsayılan.
- Dennerle: bitki veri tabanı yok. Aquasabi: satıcı; bitki verisi Flowgrow'dan kopya.
- İstilacı ve yasak bitkiler: AB'nin resmî listesi, İngiltere'nin satış yasağı, Florida Üniversitesi'nin (UF/IFAS) bitki dizini. Türkiye'de resmî bir liste bulunamadı.

## Karar

1. **Kaynaklar.** Değerler Fishkeeper bitki bilgi bankasından ve Tropica'dan gelir. Practical Fishkeeping destekleyici kaynaktır. Flowgrow yalnız eş ad ve yanlış satış adı eşleştirmesi için kullanılır. Dennerle ve Aquasabi kabul edilmez. Ayrıntı ve değer kuralı `docs/DATA_SOURCES.md` → "Bitkiler".
2. **İlk paket:** Türkiye'de kabul edilen mağazalarda satılan ve kaynağı olan bitkiler.
3. **İstilacı ve yasak bitkiler:** kaynağıyla etiketlenir ve "doğaya bırakmayın" uyarısı gösterilir. Türkiye'de resmî liste olmadığı için metin "Türkiye'de yasak" diye anlaşılmayacak biçimde yazılır (ör. "ABD'de federal zararlı ot listesinde").
4. **Su bitkisi olmayan ev bitkileri** (akvaryumda çürüyen, mağazada akvaryum bitkisi diye satılanlar) katalogda kalır ve uyarıyla gösterilir.

## Sonuçlar

- Katalog `src/data/catalog-plants.ts` içindedir. İlk pakette 54 bitki var: Fishkeeper'da sayfası olan 71 bitkiden kabul edilen mağazalarda (Aquarubi, Akvaryum Express) satılanların hepsi.
  - Satış adları Flowgrow'un eş ad ve ticari ad listeleriyle de eşlendi. Örnekler: *A. reineckii* var. *rosaefolia* Türkiye'de Tropica'nın 'Pink' adıyla, *Anubias* 'Petite' 'Bonsai' adıyla, *Cryptocoryne undulata* *C. axelrodii* adıyla satılıyor.
  - Başka bir formun satış adı Fishkeeper'ın form kaydına bağlanmadı (ör. *C. wendtii* 'Green Gecko', *Echinodorus* 'Ozelot Narrow Mini').
  - Satılmayan 17 bitki ilk pakete girmedi.
- Uygulama sayfaları kataloğu henüz içe aktarmaz; hiçbir sayfa büyümez (`src/lib/__tests__/plant-catalog.test.ts` denetler). Bitki sayfasında katalogdan seçme ayrı bir pakettir; kodlamadan önce taslak ürün sahibine gösterilir. İstilacı tür ve ev bitkisi uyarılarının metni de o pakette yazılır.
- Kullanıcının bitki kaydı (`Plant`) ve motor değişmez; altın fikstür değişmez. Bitkiye göre motor uyarıları (ör. "bu bitki yüksek ışık ister") ayrı bir onayla gelir.
- İlk pakette resmî listede bulunan iki bitki var: *Hygrophila polysperma* ve *Limnophila sessiliflora* ABD federal zararlı ot listesinde (UF/IFAS). Satılan 54 bitkinin hiçbiri AB'nin listesinde ya da İngiltere'nin 2014 satış yasağında değil.
- Satılan ama Fishkeeper'da olmayan bitkiler sonraki paketlere kaldı:
  - yalnız Tropica'da sayfası olanlar;
  - resmî listedeki satılan bitkiler: Aquarubi'de *Pistia stratiotes* (AB listesi) ve *Azolla filiculoides* (İngiltere'nin satış yasağı) var;
  - su bitkisi olup olmadığı kaynakla kontrol edilecek bitkiler: Aquarubi'de *Ophiopogon japonicus*, *Fittonia albivenis*, *Selaginella* ve *Homalomena* satılıyor. Bunlar için Practical Fishkeeping'in "akvaryumda kaçınılacak bitkiler" yazısı okunacak.
  - Practical Fishkeeping'in tür kutuları da bu paketlerde taranır.
- Bitki adları: bilimsel ad dilden bağımsız anahtardır. İlk pakette yalnız eş adlar ve Türk mağazalarındaki satış adları var (ör. "Tilki kuyruğu"). İngilizce yaygın adlar İngilizce dil paketinde kaynaktan alınır. Fishkeeper'ın yaygın adlarından biri ("Fanwort") başka bir istilacı türün de adı olduğu için yanıltabilir.
