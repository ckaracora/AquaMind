# 0029 — Tuzlu su başlangıç paketi: kaynaklar, su hedefleri ve kapsam

- Tarih: 2026-10-29
- Durum: Kabul edildi. Ürün sahibi 2026-10-29'da öneri sayfasındaki (https://claude.ai/artifact/XCGcMBmJu1oVMZ9t9emiiu) dört soruyu cevapladı. Üçünde Claude'un önerisini seçti. Satış kanıtı sorusunda öneri (uzman bir deniz mağazasını kabul edilen mağazalara eklemek) yerine "satış kanıtı aranmasın"ı seçti. Yol haritasının 5. adımıdır (`docs/DECISIONS/0020-urun-hedefleri-ve-yol-haritasi.md`).

## Bağlam

Uygulamada akvaryum türü olarak tuzlu ve acı su seçilebiliyor. Motor, deniz canlısı olan akvaryumda özgül ağırlık ölçümü istiyor; ölçüm canlının kayıttaki aralığının dışındaysa tehlike uyarısı veriyor. Katalogda 11 deniz canlısı var; 5'inin kaynağı satıcı ya da tek kişilik hobi sitesi (LiveAquaria, Quality Marine, WhiteCorals, SaltCorner).

2026-10-29'da (UTC) sayfalar açılarak yapılan araştırmanın bulguları:

- **İncelenen kaynaklarda tuzluluk, pH ve KH türe özel değil.** Fishkeeper'ın açılan deniz balığı sayfalarında aynı değerler yazıyor: özgül ağırlık 1.020–1.025, pH 8,1–8,4. Sıcaklık türe göre değişiyor; ör. ocellaris palyaço 23–27 °C, sarı tang 24–28 °C, neon gobi 22–28 °C. LiveAquaria'nın ve Quality Marine'in açılan sayfalarında da genel su değerleri var. OATA'nın tür grubu sayfaları türe özgü olmayan, gruptan gruba biraz değişen değerler veriyor (ör. palyaço 1.020–1.025, anemon 1.023–1.026). Practical Fishkeeping'in karides yazısı su değerlerini tür kutularından çıkarıp standart resif değerlerini geçerli saydığını yazıyor.
- **OATA'nın ev akvaryumu rehberi** ("How to set up and maintain a marine aquarium", Eylül 2022) iki akvaryum için hedef veriyor:
  - Yalnız balık: özgül ağırlık 1.017–1.023 (23–30 ppt), 24–27 °C, pH 8,0–8,2, amonyak ve nitrit sıfır, nitrat en çok 20 mg/L.
  - Omurgasızlı: özgül ağırlık 1.024–1.026 (32–35 ppt), 24–26 °C, pH 8,0–8,2, KH 8–12 dKH; nitrat 5–10 mg/L ve fosfat 0,04–0,1 mg/L, ikisi de "türe bağlı" ("species depending") koşuluyla.
  - OATA'nın tür grubu sayfaları (Eylül 2022; ör. özgül ağırlık 1.020–1.025, pH 7,9–8,3, nitrat en çok 50 mg/L) ve ticaret için su kalitesi ölçütleri (Ekim 2022; nitrat en çok 100 mg/L) bundan farklı değer veriyor.
- **Türe özel güvenilir bilgi** sıcaklık, boy, resif uyumu ve huydur. En geniş kaynak Fishkeeper'dır: 321 deniz balığı ve 99 deniz omurgasızı (ör. temizlikçi karides 23–27 °C). En az akvaryum hacmi yazmıyor. OATA akvaryum hacmini balık grubu düzeyinde veriyor (ör. küçük palyaço türlerinden bir çift için en az 60 L).
- **Satış:** kabul edilen 6 Türk mağazasının açılabilen 5'inde deniz canlısı yok, yalnız deniz ekipmanı var (tuz, tuz ölçer, skimmer, resif testleri). Çikletist Pet Shop'un sitesi bot doğrulaması istediği için açılmadı. Deniz canlısını uzman mağazalar satıyor (ör. BlueLife Akvaryum).

## Karar

1. **Kaynaklar** (`docs/DATA_SOURCES.md` → "Deniz canlıları"):
   - ana: Fishkeeper (balıklarda ve omurgasızlarda sıcaklık, boy, resif uyumu, huy) ve OATA (su hedefleri);
   - destek: OATA'nın tür grubu sayfaları (akvaryum hacmi), Practical Fishkeeping, FishBase ve SeaLifeBase, Fishipedia, Meerwasser-Lexikon;
   - ad eşleştirme: WoRMS;
   - kabul edilmeyen: LiveAquaria, Quality Marine, Reefs.com, TFH, WetWebMedia (satıcı ya da açılan sayfalarında genel su değerleri; çoğu yazarsız ve tarihsiz).
2. **Tuzluluk, pH ve KH akvaryum düzeyinde.** Uygulama deniz akvaryumunun son ölçümünü OATA'nın ev akvaryumu rehberindeki hedeflerle karşılaştırır. Akvaryumda deniz omurgasızı yoksa "yalnız balık", varsa "omurgasızlı" hedefleri kullanılır. Tür kaydına tuzluluk ve pH yazılmaz; sıcaklık türe göre kalır. Rehberin sıcaklık aralığı ve "türe bağlı" diye yazdığı nitrat ve fosfat aralıkları bilgi olarak gösterilir, eşik olarak uygulanmaz (`docs/DATA_SOURCES.md` → "Deniz canlıları").
3. **Deniz canlılarında satış kanıtı aranmaz.** Tatlı su ve bitkideki "kabul edilen Türk mağazasında satılan" şartı deniz canlılarına uygulanmaz.
4. **Orta paket.** İçerik:
   - başlangıç balıkları ve omurgasızları, yaklaşık 20–30 tür;
   - akvaryum düzeyinde deniz su hedefleri;
   - bugünkü 11 deniz kaydının kaynağının bu kurallarla yenilenmesi.

   Mercanlar, kalsiyum ve magnezyum ölçümü ve deniz ekipmanı türleri (ör. protein skimmer) sonraki paketlerdedir.
5. **Öneri sayfasında "sorun yoksa böyle" diye yazılan, itiraz edilmeyen iki konu:**
   - En az akvaryum hacmi: OATA'nın grup değeri ile türe özel destek kaynağının değerinden büyüğü alınır (koruyucu).
   - Nesli tehlikedeki türler: FishBase'te IUCN durumu "tehlikede" olan türde kaynaklı bir bilgi notu yazılır (ör. Banggai kardinal, 2007). Satın almayı yasaklamaz, yetiştirme ürününü tercih etmeyi önerir.

Teknik kararlar (Claude):

- **OATA'nın hangi değeri:** OATA'nın üç belgesi farklı değer veriyor. Hedefler için ev akvaryumu için yazılmış olan kurulum rehberi esas alınır; grup sayfalarının değerleri günlüğe yazılır, hedef olarak kullanılmaz. Ticaret ölçütü ev akvaryumu hedefi değildir; motorun bugünkü amonyak, nitrit ve nitrat tehlike sınırlarının kaynağı olarak kalır (karar 0008). Rehberin hedefleriyle bu sınırların birlikte nasıl kullanılacağı motor paketinde ürün sahibine gösterilir.
- **Tür seçimi:** satış kanıtı aranmadığı için türler şöyle seçilir: Türk uzman deniz mağazalarında (BlueLife Akvaryum, Mercan Çiftliği, Evcilim Pet) en sık görülen başlangıç aileleri içinden, Fishkeeper'da sayfası olan türler (balık ve omurgasız). Mağazalar yalnız seçim için kullanılır; katalogda kanıt olarak saklanmaz, satış adı oradan alınmaz.
- **Sıra:**
  1. Bu karar ve kaynak kuralları (belge).
  2. Motor değişikliği: deniz akvaryumunun su hedefleri akvaryum düzeyinde. Sağlık puanına etkisi kodlamadan önce ürün sahibine gösterilir. Altın fikstür ayrı commit'te yeniden üretilir.
  3. Katalog: 11 kaydın kaynağı ve yeni türler.
- **Geçiş:** motor değişikliği gelene kadar katalogdaki deniz kayıtlarının özgül ağırlık aralığı yerinde kalır; yoksa bugünkü tuzluluk denetimi sessizce kaybolurdu.
- **2. adımın uygulaması (2026-10-30):** motor 1.13.0, karar 0030 (`docs/DECISIONS/0030-deniz-suyu-hedefleri.md`). Ürün sahibi puan etkisini ve ekran taslağını görüp dört ayrıntıyı onayladı. Aynı değişiklikle deniz kayıtlarının pH ve özgül ağırlık aralığı kaldırıldı.

## Sonuçlar

- Deniz kullanıcısı "bu balığı alabilir miyim, suyum doğru mu" sorusuna kaynaklı cevap alır. Tuzluluk ve pH'ın genel hedef olduğu ekranda açıkça yazar; türe özelmiş gibi gösterilmez.
- Satış kanıtı aranmadığı için katalogda Türkiye'de bugün bulunmayan bir deniz canlısı yer alabilir; bu, tatlı su ve bitki kataloğundan farklıdır.
- Fishkeeper en az akvaryum hacmini yazmadığı için hacim OATA'nın grup sayfasından ve türe özel destek kaynaklarından gelir; kaynak bulunmayan alanlar boş kalabilir.

## Doğrulama

- Kaynaklar 2026-10-29'da (UTC) okundu: Fishkeeper (ör. common clownfish, yellow tang, blue neon goby sayfaları), OATA (kurulum rehberi, su kalitesi ölçütleri, tür grubu sayfaları), Practical Fishkeeping, FishBase ve SeaLifeBase, LiveAquaria, Quality Marine, Reefs.com, TFH, WetWebMedia, Meerwasser-Lexikon, Fishipedia, WoRMS.
- Mağazalar: kabul edilen 6 mağaza (Çikletist açılamadı), BlueLife Akvaryum (ör. palyaço ailesinde 11 ilan, 2'si stokta; damsel ve chromis ailesinde 17 ilan, 6'sı stokta), Mercan Çiftliği, Evcilim Pet.
