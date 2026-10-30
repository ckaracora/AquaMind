# 0031 — Deniz kataloğu: başlangıç türleri ve kaynak kuralları

- Tarih: 2026-10-30
- Durum: Kabul edildi. Ürün sahibi 2026-10-30'da öneri sayfasındaki (https://claude.ai/artifact/PgYshmU1U2rcmfC4cjngfh) dört soruda Claude'un önerdiği seçeneği seçti. Karar 0029'un 3. adımıdır (katalog).

## Bağlam

Karar 0029 kaynakları ve değer kurallarını belirledi; deniz akvaryumunun su hedefleri motor 1.13.0 ile geldi (karar 0030). Katalogda 11 deniz kaydı vardı; 5'inin değerleri kabul edilmeyen satıcı ya da hobi sitelerinden geliyordu. Orta paket 20–30 başlangıç türü istiyordu.

Değerler okunurken dört soru çıktı:

- Yeni türlerin adı nasıl yazılacak.
- Kaynağı olmayan atık katsayısı nereden alınacak.
- Fishkeeper'da ve Fishipedia'da sayfası olmayan 3 kayıt ne olacak.
- En az akvaryum hacmi için onaylanan "en büyüğü" kuralı. Meerwasser-Lexikon (topluluk veri tabanı) çoğu türde öbür kaynaklardan çok yüksek değer veriyordu: bicolour blenny 500 L (OATA 40 L), yellow wrasse 800 L (OATA 150 L).

## Karar

Ürün sahibinin kararları (2026-10-30):

1. **Ad:** Türkçe karşılık (ör. "Temizlikçi karides", "Sarı lapin", "İki renkli horozbina"). Fishkeeper'ın İngilizce adı ve eş adları satış adı olarak kalır; aramada ikisi de bulunur. Bugünkü kayıtların adları değişmez. Yalnız yanlış olan düzeltildi: *Chelidonura varians* bir deniz tavşanı değil, "Mavi kadife deniz salyangozu" (Fishkeeper: Blue Velvet Sea Slug).
2. **Atık katsayısı:** yeni kayıtlarda bugünkü kayıtların ortancası. Kaynaklı bir değer değil, model değeridir (karar 0009).
   - Balıkta aynı boy aralığındaki kayıtların ortancası: 5 cm'ye kadar 0,6; 5–8 cm 0,9; 8–12 cm 1,3; 12–16 cm 1,6; 16–25 cm 2; 25 cm üstü 4.
   - Omurgasızda aynı kategorinin ortancası: karides 0,15; salyangoz 0,4; öbürleri 0,45.
   - Bugünkü kayıtların katsayısı değişmez.
3. **Fishkeeper'da ve Fishipedia'da sayfası olmayan kayıtlar** (uzun dokunaçlı anemon, mozaik denizyıldızı, mor antenli nudibranch) katalogda kalır. Kabul edilen kaynakların vermediği değerler (sıcaklık, gerekirse boy) Meerwasser-Lexikon'dan alınır ve kayıtta bunun notu yazılır. Bu yalnız böyle kayıtlar içindir.
4. **En az akvaryum hacmi:** OATA'nın grup değeri ile Fishipedia'nın ve Practical Fishkeeping'in türe özel değerinin büyüğü. Meerwasser-Lexikon yalnız bunların hiçbiri değer vermiyorsa kullanılır. Bu, karar 0029'daki "en büyüğü" kuralının yerini alır.

Teknik kararlar (Claude):

- **Tür seçimi:** kaynakların yeni başlayana adıyla önerdiği türler alındı: Fishkeeper'ın "Caring for your Marine Fish and Invertebrates" yazısı ve Practical Fishkeeping'in iki yazısı ("Which fish are best for a beginner to marines?", "Marine starter fish to avoid"). Bunlardan Fishkeeper'da kendi sayfası olanlar ve Türk deniz mağazalarında görülen ailelerden olanlar seçildi.
  - Balıklar (12): kraliyet gramması, orkide dottyback, ateş gobisi, mavi neon gobi, iki renkli ve yosun horozbinası, Banggai kardinal balığı, sarı kuyruklu ve gök mavisi damsel, sarı tang, sarı lapin, alev cüce melek balığı.
  - Omurgasızlar (8): temizlikçi, nane ve seksi karides, zümrüt yengeç, mavi ve kırmızı bacaklı keşiş yengeci, deniz turbo salyangozu (*Astraea*), nassarius salyangozu.
  - Alınmayanlar ve nedenleri:
    - Yeşil kromis: Practical Fishkeeping "yeni başlayana iyi değil" diyor.
    - Springer ve Allen damseli, turuncu skunk palyaço: Fishkeeper'da sayfası yok.
    - Meksika turbo salyangozu: 20–24 °C, tropik akvaryuma uymuyor.
    - Kum eleyen denizyıldızı: Fishkeeper "yalnız çok büyük akvaryum, küçükte aç kalır" diyor.
- **Sıcaklık:** Fishkeeper ile Fishipedia'nın akvaryum bölümünün ortak aralığı (karar 0029). Ör. percula: 23–27 ve 26–28 °C, ortak aralık 26–27 °C.
- **Grup:** türe özel kaynağın verdiği en az sayı; kaynaklar farklıysa türe adanmış sayfanın sayısı (omurgasız kuralının deniz karşılığı).
  - Fishkeeper tek tutmaya izin veriyorsa 1 alınır. Ör. damseller: "tek, bilinen bir çift ya da 9 ve üstü grup".
  - Öbür kaynağın farklı sayısı bakım notunda yazılır. Ör. gök mavisi damselde Fishipedia "en az 5" diyor.
- **Uzunluk:** yalnız kaynak yazıyorsa.
  - Ocellaris 60 cm (Practical Fishkeeping'in bilgi kutusu); sarı kuyruklu damsel ve alev cüce melek 100 cm (Fishipedia).
  - Öbür balıklarda "tank uzunluğu verisi sınırlı" notu yazılır. Palyaçoların eski uzunlukları kabul edilmeyen kaynaklardandı.
- **Fishkeeper'ın türe özel hacim notu:** iki türde Fishkeeper'ın kendi sayfası salyangoz ya da yengeç başına hacim yazıyor ve bu ek birey hacmi olarak alındı.
  - Turbo salyangoz: her biri için kabaca 100 L.
  - Keşiş yengeçleri: 35 L'ye en çok bir yengeç.
  - Turbo salyangozun en az hacmi de (100 L) aynı Fishkeeper notundan gelir, OATA'nın küçük yumuşakçalar için yazdığı 40 L'den büyük olduğu için.
- **Davranış kayıtları** (karar 0010 düzeni), yalnız kaynağın açık ifadesiyle:
  - Karides yer: orkide dottyback, sarı lapin, Banggai kardinal (iri bireyler) ve ocellaris (Practical Fishkeeping: iri yetişkinler çok küçük süs karideslerini ara sıra).
  - Salyangoz yer: sarı lapin.
  - Kendi türüyle tek tutulmalı: iki renkli horozbina (eşleşmiş çift hariç), yosun horozbinası.
- **Nitelik düzeltmeleri** (kaynakla çelişen ya da kabul edilen kaynakta karşılığı olmayan eski değerler):
  - Mavi kadife deniz salyangozunun "tür akvaryumu" işareti kalktı; Fishkeeper resif uyumunu "Excellent" yazıyor. Eski Türkçe adı ("Mavi çizgili deniz tavşanı") eş ad olarak kalır; bu adla kaydedilmiş canlılar eşleşmeye devam eder.
  - Mor antenli nudibranchın "tür akvaryumu" işareti kalktı. Meerwasser-Lexikon akvaryum bakımına uygun olmadığını ve süngerle beslendiğini yazıyor, başka canlılarla tutulmasının tehlikeli olduğunu yazmıyor; motorun bu işaretle verdiği "saldırganlık nedeniyle başka canlılarla güvenli değil" tehlikesi kaynaksız olurdu. Bakıma uygun olmadığı bakım notunda yazıyor.
  - Uzun dokunaçlı anemonun eski akıntı değeri kaldırıldı; kabul edilen kaynaklarda yok.
- **Bilimsel ad (WoRMS):**
  - Uzun dokunaçlı anemon artık *Radianthus doreensis*; *Macrodactyla doreensis* eş ad olarak kalır.
  - Maroon palyaço *Amphiprion biaculeatus* olarak kalır; *Premnas biaculeatus* eş ad.
- **Kimlikler:** bugünkü 11 kaydın kimliği değişmedi (kullanıcı kayıtları bağlı). Deniz turbo salyangozu, tatlı sudaki "Turbo salyangoz" kaydıyla karışmasın diye `marine-turbo-snail` oldu.
- **Kaynak bağlantıları:**
  - Ana kaynak Fishkeeper sayfasıdır (Fishkeeper'da sayfası olmayan 3 kayıtta Meerwasser-Lexikon).
  - Ek kaynaklar OATA'nın grup kartı, Fishipedia, FishBase ya da SeaLifeBase, Practical Fishkeeping ve WoRMS'tur.
  - Kabul edilmeyen satıcı sayfaları kaldırıldı; Çikletist bağlantıları satış adının kaynağı olarak kaldı.

## Sonuçlar

- Katalogda 31 deniz canlısı var (20'si yeni); canlı kataloğu 443 kayıt.
- Kayıtlar daha koruyucu oldu. Ör. ocellaris 60 → 100 L, percula 100 → 200 L, maroon 120 → 200 L. Palyaçoların sıcaklığı Fishkeeper ile Fishipedia'nın ortak aralığına daraldı (ör. percula 26–27 °C).
- Kaynağında uzunluk olmayan deniz balıkları "tank uzunluğu verisi sınırlı" sarı notunu verir. Palyaçolardan yalnız ocellaris ve percula'nın durumu değişmedi: ocellaris'in uzunluğu artık Practical Fishkeeping'ten, percula'da not zaten vardı.
- Cüce karideslerle (nane ve seksi karides, 4 cm ve altı) tutulan ve kaynağında "karidesle güvenli" bilgisi olmayan balıklarda "Karides uyumu doğrulanmadı" uyarısı çıkar (motorun bugünkü kuralı).
- Uzun dokunaçlı anemonun en az hacmi OATA'nın çoğu anemon için yazdığı 80 L oldu. OATA iri türlerin daha büyük akvaryum istediğini, Meerwasser-Lexikon en az yaklaşık 1000 L yazıyor; ikisi de bakım notunda.

## Doğrulama

- Değerler 2026-10-30'da (UTC) sayfalar açılarak okundu: Fishkeeper (31 sayfa), OATA (13 grup kartı), Fishipedia (18 sayfa), FishBase ve SeaLifeBase, Meerwasser-Lexikon, Practical Fishkeeping, WoRMS. Kayıt başına ayrıntı `docs/CATALOG_LOG.md`'de.
- `scripts/test-catalog-flow.cjs` ve `scripts/test-health.cjs`: deniz kayıtlarının yeni değerleri ve sağlık analizindeki etkileri.
- Altın fikstür yeniden üretildi; ayrı commit'te kaydedilecek. Farkların sınıflandırması `docs/COMPATIBILITY.md`'de.
