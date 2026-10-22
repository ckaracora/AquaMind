# 0022 — Hastalık ve tedavi sayfası

- Tarih: 2026-10-22
- Durum: Kabul edildi. Ürün sahibi 2026-10-22'de (UTC) taslaktaki dört konunun dördünde de Claude'un önerisini seçti. Sayfanın amacı ürün sahibinin 2026-10-19 kararına dayanır (`docs/DECISIONS/0020-urun-hedefleri-ve-yol-haritasi.md`, karar 3).

## Bağlam

Yol haritasının 3. adımı. Karar 0020'ye göre AquaMind şimdilik hastalık teşhisi koymaz ve tedavi önermez; güvenilir kaynaklara yönlendiren bir sayfa olur. Konu ileride yeniden araştırılır. Sponsorluk olursa sponsorlu içerik açıkça "Sponsorlu" diye işaretlenir ve tavsiyeyi etkilemez.

Kodlamadan önce telefon görünümlü bir taslak ürün sahibine gösterildi. Taslakta dört konu artı ve eksileriyle soruldu.

## Karar

1. **Kısa "ilk adımlar" listesi.** Sayfa üç madde gösterir; her maddenin kaynağı yazılıdır. Teşhis ya da ilaç önerisi yoktur. En üstteki uyarı, sayfanın teşhis koymadığını ve ilaç önermediğini söyler.
   - Suyu hemen ölç; amonyak her zaman sıfır olmalı (UF/IFAS, FA031).
   - Hastalık belirtileri ve belirti göstermeyen balığın da hastalık taşıyabileceği (OATA bakım kartı).
   - Yeni canlıyı ve bitkiyi önce ayrı akvaryumda tut; hasta canlı için veterinere danış (UF/IFAS, FA124).
2. **Bakır uyarısı akvaryuma göre.** Karides ya da salyangoz bulunan akvaryumlar adıyla öne çıkar: "… akvaryumunda karides ve salyangoz var. Bu canlılar bakıra çok duyarlıdır ve düşük düzeyde bile ölürler; eklediğin ilacın omurgasızlar için güvenli olduğundan emin ol." Metin kaynağın ifadesini izler: OATA'nın karides ve salyangoz kartı ("very sensitive to copper", düşük düzeyde bile ölüm, "Always ensure that any treatments added to the aquarium are safe for invertebrates") ve Practical Fishkeeping (bakır ve formalin içeren ilaçlar karidesler için öldürücüdür). Canlının türü kayıttaki `category` alanından okunur; katalog indirilmez. Genel uyarı her durumda görünür.
3. **Sayfanın yeri.** Sayfa yan menüde ("Hastalık ve Tedavi", `/diseases`) ve sağlık analizi sayfasının altındaki bağlantıdan açılır. Sağlık analizinden gelindiğinde (`?aquarium=`) o akvaryum bakır uyarısında başa gelir, su ölçümü bağlantısı o akvaryuma gider.
4. **Türkiye için veteriner yönlendirmesi.** Türk Veteriner Hekimleri Birliği'nin il odaları listesi ve veteriner fakültelerinin su ürünleri hastalıkları bölümleri kullanılır.
   - Fakülte sayfaları tek tek açıldı (2026-10-22). Yalnız Erciyes Üniversitesi Veteriner Fakültesi'nin Sucul Hayvan Hastalıkları (Su Ürünleri ve Hastalıkları) Anabilim Dalı doğrulandı; sayfa süs balığından söz etmiyor. Bu yüzden metin, süs balığına hizmet verilip verilmediğinin önce sorulmasını söyler.
   - Ankara Üniversitesi Veteriner Fakültesi'nin bölüm listesinde böyle bir anabilim dalı yok. İstanbul Üniversitesi-Cerrahpaşa'nın sitesi güvenlik doğrulamasına takıldı. Fırat, Ondokuz Mayıs, Selçuk ve Bursa Uludağ'ın sitelerine bağlanılamadı. Doğrulanmayan bölüm listeye girmez.
   - İngiltere ve İrlanda için Fish Veterinary Society'nin süs balığı tedavi eden veteriner listesi de verilir.

Kaynakların seçimi ve gerekçesi `docs/DATA_SOURCES.md` → "Hastalık ve tedavi yönlendirme kaynakları" bölümünde.

## Sonuçlar

- Motor ve kayıt biçimi değişmez; altın fikstür değişmez.
- Sayfa durağan üretilir: adres (`?aquarium=`) tarayıcıda okunur ve içeriği çizen bileşene (`src/components/disease-guide-view.tsx`) verilir; sorgu anahtarı ve bağlantı adresleri `src/data/disease-guide.ts`'teki ortak yardımcılardadır.
- Sayfanın metinleri dil paketinin ayrı girişindedir (`@aquamind/localization/diseases`, `packages/localization/src/messages/tr-diseases.ts`); ana giriş onları içe aktarmaz. Metinler ana dil dosyasına konduğunda her sayfa yaklaşık 2 kB büyüyordu (ilk denemede ölçüldü); motor metinleriyle aynı yöntemle yalnız bu sayfanın paketine girerler. Menü adı ve sağlık analizindeki bağlantı metni ana dil dosyasındadır. Kaynak adresleri `src/data/disease-guide.ts` içindedir.
- Kaynakların çoğu İngilizcedir; her bağlantıda dil etiketi (TR/EN) görünür.
- Kerevit ve yengeç gibi "diğer" türündeki omurgasızlar bakır uyarısına henüz girmez; kayıttaki tür yalnız karides ve salyangozu ayırır.
- Konunun ayrıntılı araştırması (hastalıklar, tedavi kaynakları, Türkiye'de balık veterineri ağı) yol haritasında sonraya kaldı.
