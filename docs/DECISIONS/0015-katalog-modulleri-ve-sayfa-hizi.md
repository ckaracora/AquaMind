# 0015 — Katalog modülleri ve sayfa hızı

- Tarih: 2026-10-07
- Durum: Önerildi — ürün sahibi (`buraksenfx`) 2026-10-07'de sayfa hızı işinin önceliklendirilmesini onayladı ("onaylıyorum"). Yöntem teknik karardır (Claude). `codex/page-speed` dalında; Codex denetimi ve `main` birleştirmesi bekleniyor. `main` dalına birleştirilene kadar kabul edilmiş sayılmaz

## Bağlam

Canlı sitede sağlık analizi yeni bir tarayıcıda ilk açılışta yaklaşık 10 saniyede, sonraki ölçümde 3,4 saniyede hazırlandı. Ölçümler (2026-10-07):

- **İndirme:** Bütün sayfalar istemci bileşeni ve katalogları doğrudan içe aktarıyor. `src/data/catalog.ts` hem canlı hem ekipman kataloğunu taşıdığı için:
  - canlılar sayfası ekipmanı, ekipman sayfası canlıları da indiriyordu;
  - sağlık sayfasının ilk yüklemesi 387 kB (sıkıştırılmış), canlılar 378 kB, ekipman 363 kB idi (`next build` tablosu).
- **Arama:** `speciesForLivestock` ve `profileForEquipment`, katalog kimliği olmayan kayıtlar için bütün katalogu dolaşıp her kaydın adını Türkçe yerel ayarla (`toLocaleLowerCase("tr-TR")`) yeniden biçimlendiriyordu.
  - Örnek akvaryumdaki katalog dışı tek ekipman ("ISTA 2L Set") için bir arama 75 ms sürüyordu.
  - Bu arama analizde iki kez çalıştığı için tek bir analiz 160 ms sürüyordu; telefonda bu süre birkaç kat artar.
  - Katalog formundaki arama da her tuşta yüzlerce kaydı yeniden biçimlendiriyordu.
- **Bütünlük denetimi:** Katalog bütünlük denetimi her yüklemede kullanıcının tarayıcısında 3.964 kaydı dolaşıyordu. Bunun yalnızca yerel ayarlı harf çevirmeleri yaklaşık 50–90 ms tutuyordu.

## Karar

1. **Katalog modülleri:** `src/data/catalog.ts` iki modüle ayrıldı: `catalog-species.ts` (canlılar) ve `catalog-equipment.ts` (ekipman). Ortak yardımcılar `catalog-shared.ts` içinde. Satırlar birebir taşındı.
   - `catalog.ts` yalnızca ikisini yeniden dışa aktarır; betikler ve testler değişmeden çalışır.
   - Uygulama kodu ilgili modülü doğrudan içe aktarır.
   - `src/lib/__tests__/catalog-lookup.test.ts`, uygulama kodunun birleşik dosyayı değer olarak içe aktarmadığını denetler.
2. **Arama dizinleri:** Katalog çalışma sırasında değişmediği için biçimlendirilmiş adlar ilk kullanımda bir kez hesaplanır.
   - Kimlik dizini biçimlendirme gerektirmediği için ayrıdır. Ad ve marka/model dizinleri yalnızca kimliği olmayan bir kayıt ya da katalog araması geldiğinde kurulur.
   - Sonuç kuralı değişmedi: eşleşme varsa katalog sırasındaki ilk kayıt döner.
3. **Bütünlük denetimi:** Denetim geliştirmede, testlerde ve CI'da (`pnpm verify`; betikler ve Vitest katalogu içe aktarırken) çalışır. Üretim derlemesinde (`process.env.NODE_ENV === "production"`) kullanıcının tarayıcısında çalışmaz.
4. **Sağlık sayfası:** Analiz modülü sayfa açıldıktan sonra dinamik `import()` ile yüklenir. Ana sayfadaki durum hesabı (`dashboard-status`) zaten böyle çalışıyordu. Sayfa iskeleti hemen görünür, analiz kodu onunla paralel iner.
   - Yükleme başarısız olursa (ör. bağlantı koptu) "Analiz yüklenemedi" mesajı ve "Yeniden dene" düğmesi gösterilir; sayfa süresiz beklemez.
   - Ana sayfada önceden de var olan aynı açık kapatıldı: durum hesabı yüklenemezse "Durum yüklenemedi; sayfayı yenileyin." yazılır.

## Sonuçlar (yerel ölçüm)

| Ölçüm | Önce | Sonra |
|---|---|---|
| Sağlık sayfası ilk yükleme (sıkıştırılmış JS) | 387 kB | 140 kB (analiz kodu ardından iner) |
| Canlılar sayfası | 378 kB | 243 kB |
| Ekipman sayfası | 363 kB | 276–277 kB (derlemeler arasında 1 kB yuvarlama farkı) |
| Bir sağlık analizi (örnek akvaryum) | 160 ms | 0,14 ms (ilk seferde dizin kurulumu: kimlikli kayıtlarla 5,6 ms, katalog dışı ekipmanla 62 ms) |
| ~11.400 aramalık karşılaştırma dökümü | 4 dk 4 sn | 2,4 sn |

Yerel üretim sunucusunda sağlık analizi 1,1 saniyede hazırlandı. Puan (90), yük (%70) ve uyarılar canlıdakiyle aynı. Hata yolu da denendi: analiz kodunun parçası derleme çıktısında geçici olarak kaldırılınca hata ekranı çıktı, parça geri konunca "Yeniden dene" analizi açtı.

### Önizleme ölçümü (2026-10-07)

Ölçüm aynı masaüstü tarayıcıda, sayfa açılışından analizin ekrana gelmesine kadar yapıldı:

- **Canlı site (eski kod):** 2.322 ms (önbelleği soğuk ilk açılış), 823 ms ve 832 ms.
- **PR #20 önizlemesi (yeni kod):** 1.058, 1.041 ve 858 ms.

Hızlı bir masaüstünde fark ölçüm gürültüsü düzeyinde. Toplam indirilen kod da değişmedi (383 kB). Önizlemede analiz parçaları sayfa açıldıktan sonra isteniyor; bu ek bir bekleme sırası yaratıyor.

Beklenen kazanç işlemcisi yavaş cihazlarda. Analiz hesabı 160 ms yerine 0,14 ms sürüyor, bütünlük denetimi cihazda çalışmıyor ve sayfa iskeleti hemen görünüyor. Bu ölçülemedi, çünkü kullanılan aracın işlemci yavaşlatma özelliği yok.

Sonraki adımda analiz kodu sayfa kodu çalışır çalışmaz istenecek ve sağlık sayfası yalnızca gereken kayıtları indirecek.

## Davranışın değişmediğinin kanıtı

- Değişiklikten önce ve sonra aynı betikle döküm alındı (`speciesCatalog`, `equipmentCatalog`, yaklaşık 11.400 arama sonucu, gruplar, markalar, doğrulama sayıları). İki döküm bayt bayt aynı.
- `src/lib/__tests__/catalog-lookup.test.ts`, yeni aramaları eski kodun ifadelerini aynen kullanan başvuru fonksiyonlarıyla karşılaştırır: bütün adlar, yazım varyasyonları ve ekipman kayıtları.
- Altın fikstür, 113 sağlık senaryosu ve katalog akışı değişmeden geçiyor; motor değişmedi.

## Değerlendirilen alternatifler

- **Analizi sunucuda yapmak:** Kullanıcının akvaryum verisi sunucuya gönderilmiş olurdu. Bugün veri yalnızca tarayıcıda; bu bir gizlilik ve ürün kararı. Seçilmedi.
- **Sayfanın yalnızca ihtiyaç duyduğu kayıtları ayrı dosyalardan istemesi** (ör. kimliğe göre JSON): Sağlık sayfasındaki toplam indirmeyi de azaltır. Ama eski kayıtların adla eşlenmesi için ayrıca bir ad dizini gerekir. Daha büyük bir değişiklik olduğu için sonraki adıma bırakıldı.

## Geri alma

`catalog.ts` önceki hâline döndürülür ve yeni üç modül silinir. Uygulama içe aktarmaları `@/data/catalog`'a geri alınır, sağlık sayfasındaki dinamik içe aktarma kaldırılır. Motor ve veri değişmediği için altın fikstür etkilenmez.
