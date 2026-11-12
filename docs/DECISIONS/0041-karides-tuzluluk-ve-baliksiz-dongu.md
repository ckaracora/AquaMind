# 0041 — Karides kapsamı, balık-yalnız deniz tuzluluğu ve balıksız döngü

- Tarih: 2026-11-12
- Durum: Kabul edildi. Ürün sahibi (`buraksenfx`) 2026-11-12'de veri testi D'nin üç uç durumu için "üçünü de düzelt" dedi. Teknik kararlar Claude'un (lider). Motor 1.16.0, kural seti 1.13.0. Altın fikstür kod değişikliğinden ayrı bir commit'te yeniden üretilecek. Kontrol: karşı firma (Codex) kontrolü bekliyor.

## Bağlam

Veri testi D (39 sayılan senaryo, motor 1.15.0) hata %7,7 buldu. Üç uç durum:

- **D29, 200 L'de 2 Japon balığı + 6 Amano karides:** genel 95 "uygun", uyarı yok.
  - Japon balığının kaynaklı "karides yer" kaydı var (Practical Fishkeeping).
  - Motor bu uyarıyı yalnız yetişkin boyu 4 cm ve altı karideste çıkarıyordu (`DWARF_SHRIMP_MAX_CM`). Amano 5 cm.
- **Yalnız balıklı deniz akvaryumu, özgül ağırlık 1,025:** sarı `marineSpecificGravity`, genel "dikkat".
  - Motor OATA'nın kurulum rehberindeki yalnız balıklı hedefi (1,017–1,023) kullanıyordu.
  - OATA'nın palyaço bakım kartı ve Fishkeeper'ın royal gramma sayfası 1,020–1,025 diyor.
- **D39, balıksız döngü akvaryumu (amonyak 2, nitrit 0,5):** genel 49 "uygun değil".
  - Sınırı aşan nitrit, canlı olup olmadığına bakılmadan kesin tehlike sayılıyordu.
  - Canlısız akvaryumda bu "hemen kısmi su değişimi yapın" diyen kırmızı uyarılar da çıkarıyordu.

## Karar

Ürün sahibinin isteği (2026-11-12):

1. **Karides:** kaynak "cüce" ya da bir boy sınırı demiyorsa karides yeme uyarısı bütün karidesleri kapsar. Uyarı sarı canlı riski olarak kalır, sonuç "dikkat".
2. **Tuzluluk:** yalnız balıklı akvaryumda (omurgasız ya da mercan yoksa) özgül ağırlığın üst sınırı 1,025. Omurgasızlı akvaryumda bugünkü hedef kalır.
3. **Balıksız döngü:** canlı yokken amonyak ya da nitrit varsa sonuç "dikkat" olur. Metin: "Canlı eklemeden önce amonyak ve nitrit sıfıra inmeli." Canlı varken bugünkü kırmızı davranış aynen kalır.

Teknik kararlar (Claude):

### 1. Karides kaydının kapsamı (`smallShrimpOnly`)

Veride ayrım yoktu: 29 `eatsShrimp` kaydının hiçbirinde boy alanı yok, hiçbir kaynak santimetre vermiyor. Kaynak sayfaları 2026-11-12'de yeniden okundu (alıntılar `docs/CATALOG_LOG.md`, 2026-11-12).

- **Kural:**
  - Kaynak riski küçük, cüce ya da yavru karidesle sınırlıyorsa ya da daha büyük bir karidesi uygun arkadaş diye öneriyorsa kayıt `smallShrimpOnly: true` taşır. Uyarı yalnız 4 cm ve altı karideste çıkar.
  - Öbür kayıtlar bütün karideslerde uyarır.
  - "Küçük" için yeni sayı yok: bugünkü `DWARF_SHRIMP_MAX_CM` (4 cm; OATA: cüce karidesler yaklaşık 3 cm) kullanılır.
- **Bütün karidesler (18 kayıt):**
  - Japon balığı, yarım bantlı ve lastik izi dikenli yılan balığı, diskus, melek: Practical Fishkeeping'in "karidesle tutulmaz" grubu; melek için Neale Monks'un yanıtı. Aynı yazı çiklitler bölümünde Amano'nun "hayatta kalabilir ama saklanmayı bilir" olduğunu yazıyor; risk Amano'yu da kapsıyor.
  - Cennet balığı: PFK, avlama ihtimali var, "özellikle küçükse".
  - Siyah hayalet bıçak balığı, benekli Kongo balonu: Fishkeeper.
  - Sarı lapin, orkide dottyback (deniz): Fishkeeper.
  - Seriously Fish'in "canlı nehir karidesi" yem önerisi olan 8 kayıt: Andrao yılanbaşı, gökkuşağı yılanbaşı, arowana, palyaço bıçak balığı, iki iğne balığı, hujeta gar, kırmızı karınlı pirana.
- **Yalnız küçük karides (10 kayıt):**
  - lepistes, kuhli, palyaço killi ve White Cloud (PFK "belki" grubu: yavruları neredeyse kesin yer; olası arkadaş sayılıyorlar; PFK'nın White Cloud biyotop yazısı ayrıca Amano öneriyor);
  - sparkling gurami (PFK: küçük türler; yetişkini ancak kabuk değişiminde; Amano öneriyor);
  - cüce balon (PFK: küçük boylar yem; büyüyünce küçük türler risk altında);
  - homurdanan gurami (Fishkeeper: küçük süs karidesleri);
  - ocellaris palyaço (PFK: çok küçük süs karidesleri);
  - Banggai kardinal (Fishkeeper: küçük karides);
  - kırmızı dudaklı gobi (Seriously Fish: küçük canlı omurgasızlar).
- **Belirsiz iki okuma, liderin kararı:**
  - Orkide dottyback: Fishkeeper aynı sayfada hem "süs karidesleri" hem "küçük süs karidesleri" diyor.
  - Sarı lapin: "küçük salyangoz ve karides" ifadesinde "küçük" yalnız salyangoza bağlanabilir; sayfanın tanım cümlesi "süs karidesi olmayan resif" diyor.
  - İkisi de bütün karidesleri kapsar.
- **Melek + fan karidesi (bambu, vampir):** PFK "yeterince beslenirse işe yarayabilir" diyor. "Dikkat" kalır; kaydın koşul notu bu istisnayı yazıyor.
- **Değişmeyenler:**
  - Beta kaydı çelişkili (`conflict`), uyarı üretmez.
  - "Karides uyumu doğrulanmadı" (`shrimpUnverified`) bugünkü gibi yalnız 4 cm ve altı karideste çıkar.
  - Ceza (30), seviye (sarı) ve canlı riski tavanı (74) aynı.
- **Mesaj:** "Kaynaklara göre {yiyenler} karides yer; {karidesler} ve özellikle yavruları risk altındadır." Sözcükler değişmedi. Karides listesi artık en az bir yiyenin kapsamına giren karideslerdir (`params.shrimp`).
- **Varsayılan:** işaretsiz kayıt bütün karideslerde uyarır. İleride eklenen bir kayıt işaretlenmezse uyarı geniş çıkar, dar değil.

### 2. Yalnız balıklı deniz akvaryumunda özgül ağırlık 1,017–1,025

Kaynaklar 2026-11-12'de yeniden okundu:
- OATA, "How to set up and maintain a marine aquarium" (Eylül 2022): yalnız balık 1.017–1.023 SG (23–30 ppt); omurgasızlı 1.024–1.026 SG.
- OATA'nın deniz balığı bakım kartları: katalogdaki deniz balıklarının bütün grupları 1.020–1.025.
  - Gruplar: palyaço, basslet ve dottyback, jawfish ve dartfish, gobi, horozbina, chromis ve damsel, tang, lapin, cüce melek.
- Fishkeeper: royal gramma ve Banggai kardinal sayfalarında 1.020–1.025 (karar 0029: açılan bütün deniz balığı sayfalarında aynı blok).

Karar:
- **Üst sınır 1,025.** Türe özgü bütün kaynaklar 1,025'e kadar kabul ediyor.
- **Alt sınır 1,017 kalır.** Kurulum rehberi yalnız balıklı ev akvaryumunu açıkça 1,017'ye kadar uygun sayıyor. Tür kartlarının 1,020'si alınsaydı rehbere uyan akvaryum uyarı alırdı: ölçümde 18 deniz balığının tek başına kurulumunda 1,017 ve 1,019 değerlerinde 36 yeni "dikkat".
- İlke iki uçta aynı: kabul edilen bir OATA belgesinin yalnız balıklı akvaryum için uygun dediği değer uyarı almaz.
- Değişmeyenler:
  - `MARINE_SPECIFIC_GRAVITY_SAFE` (1,017–1,026; dışı kesin tehlike);
  - omurgasızlı hedef (1,024–1,026);
  - uyarı kodları ve metinleri.
- Yalnız balıklı akvaryumda sarı bant artık 1,025'in üstü ile 1,026 arası.
- **Sonra değişti (2026-11-12, karar 0042, motor 1.17.0):** kesin tehlike artık `MARINE_SPECIFIC_GRAVITY_DANGER_LIMITS` ile: güvenli aralığın bir okuma basamağı (0,001) dışı sarı. Yalnız balıklı akvaryumda sarı bant 1,016–1,017 arası ve 1,025'in üstü ile 1,027 arası (sınırlar dahil); omurgasızlı akvaryumda üstte 1,027'ye kadar. `MARINE_SPECIFIC_GRAVITY_SAFE` metindeki aralık olarak kaldı.
- "Deniz suyu" bölümünün kaynak satırı: "Kaynak: OATA, deniz akvaryumu kurulum rehberi ve deniz balığı bakım kartları (2022)." (EN "Source: OATA, marine aquarium setup guide and marine fish care sheets (2022).", ES "Fuente: OATA, guía de montaje de acuarios marinos y fichas de cuidado de peces marinos (2022).")
- **Karar 0029'un değişen ilkesi:** 0029 "hedefler için yalnız kurulum rehberi esas alınır, grup sayfalarının değerleri hedef olarak kullanılmaz" demişti. Yalnız balıklı özgül ağırlığın üst sınırında bu ilke değişti; öbür hedefler rehberden kalır.

### 3. Canlısız akvaryumda amonyak ve nitrit (`cycleIncomplete`)

Kaynaklar:
- OATA'nın deniz kurulum rehberi:
  - Balıksız döngüde amonyak ve nitrit önce yükselip sonra düşer.
  - Bu atıkların sınırları aşmaması balık eklendiyse önemlidir.
  - İkisi sıfıra inip sıfırda kalınca filtre olgunlaşmıştır, yavaşça canlı eklenebilir.
- OATA'nın lepistes ve moli bakım kartı: balık eklemeden önce amonyak ve nitritin sıfır olduğunu kontrol edin.

Kural: akvaryumda hiç canlı kaydı yoksa (`animals.length === 0`; katalogda olmayan canlı kaydı da canlı sayılır, 0040'taki tanım) ve son ölçümde amonyak ya da nitrit sıfırın üstündeyse:
1. Amonyak ve nitrit uyarıları çıkmaz: `ammoniaDetected`, `ammoniaToxic`, `ammoniaWorstCase`, `nitriteDetected`, `nitriteHigh`.
2. Tek sarı uyarı çıkar: `cycleIncomplete`.
   - TR: "Canlı eklemek için erken" / "Son ölçümde amonyak {a} ppm ve nitrit {n} ppm. Canlı eklemeden önce amonyak ve nitrit sıfıra inmeli." Yalnız sıfırın üstündeki değer yazılır.
   - EN: "Too early to add livestock" / "Latest reading: ammonia {a} ppm and nitrite {n} ppm. Ammonia and nitrite should drop to zero before you add livestock."
   - ES: "Aún es pronto para agregar animales" / "Última medición: amoníaco {a} ppm y nitrito {n} ppm. El amoníaco y el nitrito deben bajar a cero antes de agregar animales."
   - Değişkenler `ammonia` (toplam) ve `nitrite`; yalnız sıfırın üstündekiler.
3. Zehirli amonyak ve sınırı aşan nitrit kesin tehlike sayılmaz.
4. Genel puan en fazla 74 olur (`DANGER_WARNING_SCORE_CAP`; yeni sayı yok).

Kapsam:
- Düşük değer (ör. amonyak 0,25) de "dikkat" olur; ürün sahibinin isteği "amonyak ya da nitrit varsa".
- **Karar 0040'ın değişen kuralı:** 0040 "canlısız akvaryumda tavan yok" diyordu. Canlı riski sınıfı için bu doğru kalır (ör. canlısız akvaryumda nitrat uyarısı genel puanı değiştirmez). Amonyak ve nitrit için 1.16.0'dan beri ayrı `cycleIncomplete` tavanı vardır.
- **Değişmeyenler:**
  - canlısı olan akvaryum;
  - nitrat;
  - su değeri ölçütünün hesabı (D39'da 33 ve kırmızı kalır; zaten tavana girer);
  - canlısız deniz akvaryumunda güvenli aralık dışı tuzluluğun kesin tehlikesi.
- Uyarı kodu sayısı 60 → 61.

### Sürüm

- **Motor 1.16.0.** COMPATIBILITY.md'nin kuralı: `ENGINE_VERSION` puanı ya da uyarıyı değiştiren her kod değişikliğinde yükselir. Projede hiç yama sürümü (1.x.1) kullanılmadı; 1.15.1 "davranış değişmedi" diye okunurdu.
- **Kural seti 1.13.0.** Bir hedef sabiti, bir uyarının kapsamı ve kesin tehlike koşulu değişti, yeni uyarı kodu geldi. Sonuç nesnesinin biçimi değişmez.

## Değerlendirilen alternatifler

Ölçüm `S\motor-1-16\oneri.md` (2026-11-12).

- **PFK "belki" grubu da bütün karidesleri kapsasın:** 2 yaygın ikili daha "dikkat" olurdu (lepistes + Amano, kuhli + Amano) ve 9 karides çifti daha. Kaynak bu türleri olası arkadaş sayıyor ve kesin riskini yavruda görüyor; seçilmedi.
- **Yalnız balıklı tuzluluğun alt sınırı da 1,020:** 36 yeni "dikkat", kurulum rehberine uyan akvaryumda; seçilmedi.
- **Canlısız akvaryumda yalnız kırmızıyı "dikkat"e indirmek, düşük değeri "uygun" bırakmak:** isteğin "amonyak ya da nitrit varsa" sözüne uymuyor; uyarının cümlesi düşük değerde de doğru. Seçilmedi.

## Doğrulama

- Yeni stub test `packages/compatibility-engine/test/warnings-1-16.test.ts` (17 test, 11'i 1.15.0 motorunda başarısız):
  - **Karides:** boy sınırı vermeyen kayıt 4 cm'den büyük karideste uyarır (tam metin, değişkenler, ceza, 74); `smallShrimpOnly` 4,1 cm'de uyarmaz, 4 cm'de uyarır; karides listesi kapsama göre; deniz karidesinde de aynı; çelişkili kayıt ve "doğrulanmadı" değişmez.
  - **Tuzluluk:** hedef sabitleri; 1,017–1,025 temiz ve "uygun"; 1,0251 ve 1,026 sarı ve 74; 1,026'nın üstü ve 1,017'nin altı kesin tehlike; omurgasızlı hedef değişmez.
  - **Canlısız akvaryum:** amonyak ve nitrit sıfırken uyarı ve tavan yok; düşük amonyak, sınırı aşan nitrit, ikisi birlikte, pH yok ve acı ile tuzlu su durumlarında yalnız `cycleIncomplete` ve 74; tuzluluğun kesin tehlikesi sürer; canlı varken (katalog dışı canlı dahil) bugünkü kırmızı davranış.
- Güncellenen testler:
  - `warnings-1-15.test.ts`: canlısız akvaryumda canlı riski sınıfı tavan koymaz (nitrat); amonyak artık `cycleIncomplete` ile 74.
  - `marine.test.ts`, `src/lib/__tests__/marine-water.test.ts`, `water-status.test.ts`, `dashboard-status.test.ts` ve `scripts/test-health.cjs`: yalnız balıklı hedef 1,017–1,025; 1,025 hedefte, hedef dışı örnek 1,026.
  - `engine-text.test.ts`: kod sayısı 61; üç dilde `cycleIncomplete` (üç stub senaryo: iki değer, yalnız amonyak, yalnız nitrit); yalnız balıklı tuzluluk senaryosu 1,026.
  - `src/lib/__tests__/species-behavior.test.ts`:
    - `smallShrimpOnly` yalnız bu 10 açık kaynaklı `eatsShrimp` kaydında;
    - gerçek katalogla Japon balığı ve melek + Amano uyarılı (D29), lepistes + Amano uyarısız, lepistes + kiraz karides uyarılı;
    - ocellaris + temizlikçi karides uyarısız, sarı lapin + temizlikçi karides uyarılı.
- Veri testi yeniden ölçümü (motor 1.16.0): `S\motor-1-16\uygulama-rapor.md`. Tasarım ölçümünde D 36/0/2/1 (%7,7) → 38/0/1/0 (%2,6); B (23/30) ve C (37/0/1/0) değişmedi.
- **Altın fikstür (yeniden üretilecek, ayrı commit):** 36 vaka değişir. Hepsi 18 deniz balığının "sığar" ve "dar" vakası. Yalnız `marineWater.rows[0].max` 1,023 → 1,025 (vakalarda tuzluluk ölçümü yok). Puan, durum, uyarı ve ölçüt değişmez. Karides ve döngü kuralları fikstürde sınanmıyor; stub ve gerçek katalog testleriyle sınanıyor.

## Sonuçlar

- Japon balığı, melek, diskus ve kaynağı karides yer diyen öbür balıklar Amano, bambu ve vampir karidesle "Karidesler yenebilir" uyarısı alır. Sonuç "dikkat".
- Lepistes, kuhli, White Cloud ve sparkling gurami gibi kaynağı yalnız küçük karidesi ya da yavruyu anan balıklar Amano ile uyarı almaz.
- Yalnız balıklı deniz akvaryumunda 1,024–1,025 artık "uygun".
- Balıksız döngü kuran akvaryum "uygun değil" yerine "dikkat" görür ve ne yapacağını okur. Canlı eklenince bugünkü kırmızı uyarılar geri gelir.
- Doğru kurulmuş akvaryum denetimi (`S\motor-1-16\gercekci\`):
  - 443 tek tür kurulumunda değişen yok.
  - 561 yaygın ikiliden 3'ü "dikkat"e iner (melek, diskus ve Japon balığı + Amano; üçü de PFK'nın "karidesle tutulmaz" grubunda).
- Kayıtlı akvaryumlar: analiz her açılışta yeniden hesaplanıyor; taşıma gerekmez.

## Açık işler

- `shrimpEaten` mesajı yiyenin koşul notunu göstermiyor (salyangoz mesajı gösteriyor). Melek + fan karidesi istisnası kayıtta yazılı ama ekranda görünmüyor.
- Mesajdaki "ve özellikle yavruları" büyük karidesler (ör. Amano) için de yazılıyor; liderin kararıyla metin değişmedi.
- Balıksız döngüde su değeri ölçütü kırmızı kalıyor, genel sonuç "dikkat".
- D25 (inci gurami, kaynak farkı) bu işin dışında.

## Geri alma

Kod, metin, veri ve belge değişikliği tek commit olacak; altın fikstür ayrı commit. Kod commit'i geri alınınca motor 1.15.0 davranışına döner; o durumda fikstür commit'i de geri alınmalı. Kullanıcı verisi ve depolama biçimi etkilenmez.
