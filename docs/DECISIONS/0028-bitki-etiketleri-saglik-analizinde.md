# 0028 — Bitki etiketleri sağlık analizinde

- Tarih: 2026-10-29
- Durum: Kabul edildi. Ürün sahibi 2026-10-29'da iki seçenekten Claude'un önerdiğini ("Evet, sarı uyarı") seçti. Karar 0026'nın "Sonuçlar" bölümünde açık bırakılan sorunun cevabıdır.

## Bağlam

Bitki kataloğunda iki kaynaklı etiket var:

- İstilacı tür listesi (karar 0024 ve 0026): AB'nin istilacı yabancı türler listesi, İngiltere'nin satış yasağı ve UF/IFAS'ın başlığındaki ABD federal ve FISC listeleri. Katalogda 7 bitki.
- "Su bitkisi değil" (karar 0026): Practical Fishkeeping'in akvaryumda kaçınılacak ev bitkileri listesi. Katalogda *Ophiopogon japonicus*.

Bu etiketler yalnız bitki seçilirken ve bitki kartında görünüyordu. Akvaryumun sağlık analizindeki "Bitki uyarıları" bölümü (karar 0025) onları göstermiyordu. Değerleri kaynakta olmayan bitkiler için de yalnız "uyarı hesaplanmadı… Bitki kartındaki uyarıya bakın." yazıyordu.

Seçenekler: sağlık analizinde sarı uyarı olarak göstermek ya da bugünkü gibi yalnız bitki kartında bırakmak.

## Karar

1. **Sağlık analizinde sarı uyarı.** Akvaryumdaki bitkinin kaydında etiket varsa "Bitki uyarıları" bölümünde sarı uyarı çıkar:
   - "<ad> su bitkisi değil": "Practical Fishkeeping bu bitkiyi akvaryumda kaçınılacak ev bitkileri arasında sayıyor: su altında kısa süre dayanır."
   - "<ad> istilacı tür listesinde": "Doğaya bırakmayın. Bu bitki <listeler>. Bu, Türkiye'de yasak olduğu anlamına gelmez."

   Metinler bitki kartındaki uyarının metniyle aynıdır (liste adları ve sırası dahil).
2. **Sağlık puanını etkilemez.** Bitki uyarılarının hepsi gibi (karar 0025): genel puan ve durum değişmez, bölümün notu bunu yazar.

Teknik kararlar (Claude):

- **Motorda:** etiketler motorun bitki uyarılarına (`assessPlants`) iki yeni kodla girer: `plantNotAquatic` ve `plantInvasive`. Her bitkide önce etiketler, sonra değer kuralları gelir. İstilacı uyarısının `lists` değişkeni listelerin türünü sabit sırayla ve virgülle verir; ekran metni dil dosyasında bundan kurulur. Motor sürümü 1.12.0. `analyzeAquarium`, kural seti (1.9.0) ve altın fikstür değişmez.
- **Yalnız uyarı kayıtları:** değerleri olmayan kayıtlar (karar 0026) artık motora verilir; yalnız etiketleri uyarı üretir. Değerlendirilen bitki sayısına girmezler. Bölüm onları ayrıca yazar: "Değerleri kaynakta olmayan bitkilerde ışık, CO₂, sıcaklık, pH ve boy denetlenemedi: …". Böylece yalnız bunlar varken yeşil "uyarı yok" yine gösterilmez.
- **Bitki kartı:** kart etiketleri katalogun kısa uyarısı olarak zaten gösteriyor ("Su bitkisi değil (ev bitkisi)", "Doğaya bırakmayın (istilacı tür listesinde)"). Motorun etiket uyarıları kartın uyarı listesine girmez; kartta aynı uyarı iki kez yazılmaz.

## Sonuçlar

- Akvaryuma su marulu ya da *Ophiopogon* ekleyen kullanıcı, uyarıyı sağlık analizinde de görür.
- Katalogla eşleşmeyen (elle yazılan) bitkide etiket olmadığı için uyarı çıkmaz; kaynağı olmayan satılan bitkiler (*Fittonia*, *Selaginella kraussiana*, *Homalomena*) katalogda yok (karar 0026).

## Doğrulama

- `packages/compatibility-engine/test/plants.test.ts`: iki etiketin uyarısı, liste sırası ve tekrarın tek yazılması, değerleri olmayan kayıtta da çıkması, sıra (etiketler önce).
- `src/lib/__tests__/plant-warnings.test.ts`: dil dosyasının metni motorun Türkçe metniyle ve bitki kartındaki uyarıyla aynı; yalnız uyarı kaydının etiket uyarısı ve "denetlenemedi" satırı; bitki kartında etiketin iki kez yazılmaması.
