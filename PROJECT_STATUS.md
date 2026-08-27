# AquaMind proje durumu

Son güncelleme: 2026-08-27

## Doğrulanmış temel

- GitHub: `https://github.com/ckaracora/AquaMind`
- Ana dal: `main`
- Başlangıç commit'i: `7d8fb01 fix: approve sharp build dependency`
- Canlı önizleme: `https://aqua-mind-three.vercel.app/`
- Görev panosu: `https://github.com/users/ckaracora/projects/1`
- Teknoloji: Next.js 15, React 19, TypeScript, Tailwind CSS, pnpm
- `pnpm verify`: 2026-08-27 tarihinde yerelde başarılı
- Arkadaş kurulumu: `buraksenfx` hesabı collaborator; Windows kopyasında kurulum ve tüm doğrulamalar başarılı

## Mevcut veri durumu

- Kataloglar `src/data/` altında sürüm kontrollü TypeScript verisidir.
- Akvaryumlar, ölçümler, bakım, canlılar, bitkiler ve ekipmanlar şimdilik tarayıcı `localStorage` alanında saklanır.
- Kullanıcı hesabı, bulut senkronizasyonu ve gerçek veritabanı henüz yoktur.
- Supabase geçişi gelecek aşamadır; tamamlanmış gibi gösterilmemelidir.

## Ortak çalışma kurulumu

- [x] GitHub collaborator eklendi
- [x] Proje arkadaşın Windows bilgisayarına klonlandı
- [x] Bağımlılıklar kuruldu ve `pnpm verify` geçti
- [x] Ortak talimat belgeleri hazırlandı ve GitHub'a gönderildi
- [x] GitHub görev şablonları, devir sistemi, etiketler ve ortak görev panosu etkinleştirildi
- [x] GitHub Actions otomatik doğrulaması (Issue #2) `main` dalına birleştirildi ve etkinleştirildi
- [ ] Ortak katalog araştırma tablosu şimdilik ertelendi; katalog verisi sürüm kontrollü dosyalar ve kaynak bağlantılarıyla ilerliyor
- [ ] Supabase tasarımı ve geçişi yapılacak
- [x] İki bilgisayarlı devir provası tamamlandı

## Sıradaki tek iş

`codex/catalog-capacity-batch` dalında canlı katalog denetimi sürüyor. AquaRubi'deki güncel barb, Güney Amerika cichlid, Corydoras, Pleco, cüce kerevit, tetra/rasbora, Betta/Japon, karides ve salyangoz listeleri karşılaştırıldı. Sıradaki tek iş; kalan yerel canlı kategorilerini grup grup denetleyip yalnızca bilimsel kimliği ve bakım değerleri doğrulanan eksikleri eklemek.

## Oturum sonu devir şablonu

- Yapılan görev:
- Değişen dosyalar:
- Çalıştırılan kontroller:
- Sonuç:
- Bilinen hata veya risk:
- GitHub'a gönderildi mi:
- Vercel'e yayımlandı mı:
- Sonraki tek iş:

## 2026-08-26 katalog kapasite paketi

- Aktif dal: `codex/catalog-capacity-batch`
- Boyu SES-10 hava kompresörünün 10 L/dakika (600 L/saat), 10 W ve 0,02 MPa teknik verileri iki güvenilir Türkiye kaynağında doğrulandı; doğrudan ürün kaynağı katalog kaydına işlendi.
- Nubios NW-450F, NW-600F, NW-800F, NW-1500F, NB-1500F, YU-118C ve YU-119C için güvenilir debi verisi bulunamadı. YU-118C adıyla yayımlanan bir sayfanın Xinyou XY-2900 verisini yanlış kopyaladığı görüldüğü için bu değerler kullanılmadı.
- Aquawing AQ-A3000 için 25 W güç doğrulandı ancak hava debisi; Boyu SP-1300C içinse kapasite verileri yayımlanmadı. İki kayıt da otomatik kapasite hesabının dışında bırakıldı.
- `pnpm verify`: başarılı; TypeScript, katalog akışı, 35 sağlık senaryosu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti.
- GitHub/Vercel: bu paket henüz gönderilmedi ve yayımlanmadı.
- Regent'in güncel Türkiye portföyündeki 6500, 7500, 8500 ve 9500 modellerinin katalogda bulunduğu doğrulandı. Eski/yurt dışı 5500 kaydının yanlışlıkla 9500 ürününe giden kaynağı, 2 W ve 80 L/saat değerlerini yayımlayan doğrudan 5500 sayfasıyla değiştirildi; Calm RC-006 bağımsız kaynağıyla korundu.
- XLPro'nun Türkiye dağıtıcı ve perakendeci listelerindeki altı güncel filtre modelinin tamamının katalogda bulunduğu doğrulandı. Mini seri adları gerçek model kodları olan MINI-230, MINI-500 ve MINI-500AT biçimine getirildi; MINI-500AT doğrudan ürün kaynağına bağlandı ve yayımlanan 100 litre üst sınırı eklendi.
- Xinyou'nun güncel marka sayfasındaki dokuz sünger filtre modelinin tamamının katalogda doğru hacim üst sınırları ve hava motoru gereksinimiyle bulunduğu doğrulandı. Türkiye'de kullanılan diğer eski modeller ve XY-2010 köşe filtresi ayrıca korundu; güncel dokuz model için regresyon kapsamı eklendi.
- Meç'in güncel Türkiye marka sayfasındaki dokuz satış kalemi, paket adetleri birleştirildiğinde altı aksesuar ailesidir ve altısı da katalogda bulunuyor. Ayrı kaynaklarla doğrulanan sekiz pipo/üretim filtresinin tamamı hava motoru gerektiren filtre olarak korunuyor.
- RS Electrical'ın Türkiye yetkili satıcı marka sayfasındaki 29 güncel satış kaleminin tamamı katalogda doğrulandı: yedi FA askı filtre, üç tepe/UV filtre, üç hava motoru, altı I399 çelik ısıtıcı, dört 758 cam ısıtıcı ve beş bakım/soğutma ürünü. Eski/yurt dışı doğrulanmış modeller ayrıca korundu; marka toplamı 42 ekipmana ulaştı.
- RS-288 tepe filtrenin eski 1000 L/saat değeri doğrudan ürün sayfasındaki 1200 L/saat, 15 W ve 240 litre verisiyle düzeltildi. FA serisinin debi, güç, hacim üst sınırı ve ayarlanabilir akış bilgileri doğrudan ürün kaynaklarına bağlandı.
- RS 313 ve RS 960 hava motorları otomatik kapasite hesabına girecek doğrulanmış debilerle eklendi. RS 1000 sayfasında teknik tablo toplam 9 L/dakika, açıklama ise çıkış başına 9 L/dakika dediği için debi tahmin edilmedi; çelişki kullanıcıya gösterilecek notla otomatik hava kapasitesi hesabının dışında bırakıldı.
- RS Electrical katalog denetimi: kapasite gerektiren 38 kaydın 38'i hazır (%100); güncel 29 ürün için regresyon kapsamı eklendi ve hedefli katalog testi geçti.
- Tropica'nın resmî Plant Care sayfasındaki güncel aileler karşılaştırıldı: iki CO₂ sistemi, üç CO₂ aksesuarı, üç bakım aleti, dört bitki besini, bir su düzenleyici ve üç taban ürünü olmak üzere 16 ürün ailesinin tamamı katalogda bulunuyor.
- Tropica bakım ürünlerindeki genel marka bağlantıları doğrudan resmî ürün sayfalarıyla değiştirildi. Ayrı ürün sayfası yayımlanmayan CO₂ System Bio, resmî genel sayfadaki 60 litre sınırına bağlandı; eski cımbız bağlantısı güncel Tweezers sayfasıyla yenilendi.
- Tropica için model tamlığı, kategori ayrımı, doğrudan kaynak ve güncel doğrulama tarihi regresyon kapsamına alındı.
- Mufan'ın Türkiye yetkili satıcı portföyü seçenek düzeyinde doğrulandı: beş çelik CO₂ difüzörü, üç regülatör, dört filtre süngeri, beş paslanmaz emiş/basış seti ve yedi bakım aksesuarı olmak üzere 24 güncel varyantın tamamı katalogda bulunuyor.
- Eksik olan beş emiş/basış seti varyantı ile ayrı damla sayaçlı çift göstergeli regülatör eklendi. W21.8 regülatörler, difüzörler ve bakım aksesuarları mümkün olan yerlerde doğrudan yetkili satıcı ürün sayfalarına bağlandı; uluslararası kaynaklarla doğrulanan eski CO₂ aksesuarları ayrıca korundu.
- Mufan güncel Türkiye model tamlığı, doğrudan kaynak ve aksesuarların otomatik filtre kapasitesi hesabına karışmaması regresyon kapsamına alındı.
- Yikeda'nın Türkiye yetkili satıcı akvaryum portföyü seçenek düzeyinde doğrulandı: iki SD-48A, dört YKD optik LED, yedi RGB armatür, iki ayaklı LED, üç Smart UFO ve altı Tray Light olmak üzere 24 güncel modelin tamamı katalogda bulunuyor.
- Eksik XT-4W, SD-T8-1800JL ve üç Tray Light varyantı eklendi. Genel adla tutulan 35 W ve 65 W armatürler gerçek SD-1035 ve SD-1065 model kodlarına çevrildi; SD-1035 için 2960 lümen, SD-T8-1800JL için 1960 lümen doğrulandı.
- Türkiye portföyü dışında daha önce doğrulanan dört eski Yikeda model ayrıca korundu; güncel model tamlığı, doğrudan kaynaklar ve kritik güç/uzunluk/lümen verileri regresyon kapsamına alındı.
- Haqos'un resmî güncel filtre, pompa, UV, ısıtıcı, aydınlatma ve skimmer aileleri karşılaştırıldı. On resmî filtre kaydı doğrudan üretici ürün sayfalarına bağlandı; altı pompa, iki UV cihazı, iki ısıtıcı ailesi, dört aydınlatma, bir skimmer ve doğrulanabilir aksesuarlar eklendi.
- Türkiye'de güncel satışı doğrulanan BIOPRO B-600 dip süpürgesi, Solaris 508 aydınlatma ve OverBox 5000 L/saat ayrıca kataloglandı. Haqos toplamı 48 ekipman ve beş kategoriye ulaştı.
- Kaynakta yayımlanmayan debi, güç ve hacim değerleri tahmin edilmedi. EASY-1000AT, Aqua Flow 250 ve Thermo-Sprite otomatik kapasite hesabının dışında açıklamalı biçimde tutuldu; Haqos'ta kapasite gerektiren 21 kaydın 18'i hazır (%86).
- Resmî sitede yalnızca `38X50`, `30X30`, `25X50`, `25X25` ve `20X30` adlarıyla yayımlanan beş aksesuarın ürün türü sayfa metninden doğrulanamadı. Yanlış kategori üretmemek için bu kayıtlar eklenmedi; ürün türü doğrulanınca yeniden ele alınacak.
- Haqos model tamlığı, doğrudan filtre kaynakları, pompa ve aydınlatmalarda değer uydurulmaması, UV güçleri ve ısıtıcı kapasite güvenliği regresyon kapsamına alındı.
- Haqos sonrasında `pnpm verify` başarılı: TypeScript, katalog akışı, 35 sağlık senaryosu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti.
- Resun'un güncel Türkiye stok listesinde doğrulanan 10 ürünün tamamı katalogda bulunuyor. Resmî üretici portföyünden 29 filtre, beş UV cihazı, 41 su/dalga pompası, 22 hava pompası, dokuz ısıtıcı ailesi/modeli, dört aydınlatma, yedi soğutucu ailesi/modeli, 25 aksesuar ve beş filtre pedi kapsam altına alındı.
- Resun toplamı 180 ekipman, beş bakım ürünü ve altı ekipman kategorisine ulaştı. AIR-3000 hava pompasının toplam debisi güncel doğrudan Türkiye ürün kaynağına göre 360 L/saat olarak düzeltildi; AIR-1000, AIR-2000 ve CX-400 değerleri de doğrudan ürün sayfalarıyla yenilendi.
- Resmî Resun sayfalarındaki bazı teknik tablolar yalnızca görsel olarak yayımlandığı ve güvenli metin verisi bulunmadığı için değerler tahmin edilmedi. Kapasite gerektiren 75 kaydın 15'i hesaplamaya hazır; kalan 60 kayıt, neden otomatik kapasite hesabına alınmadığını açıklayan `capacityDataNote` ile tutuluyor.
- Resun regresyon kapsamı; Türkiye stok listesi, filtre/UV/pompa/hava pompası/ısıtıcı/aydınlatma/soğutucu/aksesuar aileleri, kaynak bağlantıları, doğrulama tarihleri ve teknik değer uydurulmaması kontrollerini içeriyor.
- Resun sonrasında `pnpm verify` 2026-08-27 tarihinde başarılı: TypeScript, 512 bakım ürünlü katalog akışı, 35 sağlık senaryosu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti. `git diff --check` yalnızca satır sonu dönüşüm uyarıları verdi; içerik hatası bulunmadı.
- CO2Art'ın resmî güncel tüm ürünler, regülatörler, tam setler ve aksesuar koleksiyonları karşılaştırıldı. Akvaryumla ilgili 29 ürün ailesinin tamamı katalogda bulunuyor; tişört ve hediye kartı akvaryum ekipmanı olmadığı için kapsam dışında bırakıldı.
- Eksik dokuz CO2Art ürünü eklendi: üçlü adaptör contası, üçlü regülatör pulu, sekizli vantuz, tek kullanımlık tüp adaptörü tamir kiti, IO difüzör membranı, 12 V DC solenoid bobini, inline atomizer membranı, SodaStream adaptör tamir kiti ve evrensel 12 V DC güç adaptörü.
- Önceden koleksiyon/genel sayfalara bağlı CO2Art kayıtları doğrudan resmî ürün sayfalarına taşındı. Pro-Elite V2 için 5–5000 litre, 12 V DC ve azami 5 bar değerleri; membran ölçüleri ve regülatör bağlantı standartları resmî kaynaklardan güncellendi.
- CO2Art 29 ürün tamlığı, doğrudan kaynak, 2026-08-27 doğrulama tarihi ve kritik teknik değerleri regresyon kapsamına alındı; hedefli katalog testi geçti.
- CO2Art sonrasında `pnpm verify` başarılı: TypeScript, katalog akışı, 35 sağlık senaryosu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti. `git diff --check` içerik hatası göstermedi.
- SunSun'ın güvenilir Türkiye marka sayfasındaki 44 güncel ürün bağlantısının tamamı katalogla karşılaştırıldı. Önceden katalogda bulunmayan 28 ürün/model eklendi; mevcut uluslararası ve eski doğrulanmış modeller korunarak marka toplamı 77 ekipman ve dört kategoriye ulaştı.
- Yeni kapsam; 502, 503 ve 604B kompakt dış filtreler, AD120/AD200/AD260 aydınlatmalar, ACO-006 ve PG blower hava motorları, JP iç filtreler, JVP dalga motorları, nano akvaryumlar ile emiş/basış setleri ve bakım aksesuarlarını içeriyor.
- 604B için 800 L/saat ve 14 W değerleri Türkiye kullanım kılavuzundan; JP-025F için 1600 L/saat, 35 W ve 120–600 litre; ACO-006, PG-180 ve PG-250 için yayımlanan hava debileri doğrudan ürün sayfalarından işlendi. m³/saat ve L/dakika değerleri L/saat birimine açık biçimde dönüştürüldü.
- SunSun 502 ve 503 sayfalarında debi, güç veya önerilen hacim yayımlanmadığı için değer tahmin edilmedi; iki model açıklamalı kapasite boşluğuyla otomatik filtrasyon hesabının dışında bırakıldı. JVP dalga motorları da filtrasyon ekipmanı gibi değerlendirilmedi.
- SunSun katalog denetimi: kapasite gerektiren 48 kaydın 46'sı hazır (%96). 77 kayıt toplamı, 28 güncel Türkiye eki, kaynak/tarih zorunluluğu ve kritik teknik değerler regresyon kapsamına alındı.
- SunSun sonrasında `pnpm verify` 2026-08-27 tarihinde başarılı: TypeScript, yedi ekipman kategorili ve 512 bakım ürünlü katalog akışı, 35 sağlık senaryosu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti.
- Dennerle'nin resmî mağazasındaki 240 güncel ürün ailesi toplu ürün verisi ve kategori sayfalarıyla karşılaştırıldı. Uygulamanın kurulu ekipman, bakım ürünü ve sarf malzemesi akışına giren ürünler aile ve teknik varyant düzeyinde ayrıldı; mobilya, promosyon ürünü, salt yedek parça ve boş akvaryumlar ekipman seçicisini gereksiz kalabalıklaştırmamak için kurulu cihaz gibi gösterilmedi.
- Dennerle ekipman kapsamı 22'den 87 kayda çıktı. Beş daytime onex black varyantı, Trocal Flat 35, üç güç kaynağı, güncel Carbo Bio/Soda/Power/Night sistemleri, basınç düşürücüler, tüpler, difüzörler, dört Flipper kapasitesi, ozmoz sistemi, temizlik araçları ve filtre aksesuarları doğrudan resmî ürün sayfalarıyla eklendi.
- onex20–onex80 ailesinde 4,8–21,6 W güç, 864–3888 lm ışık ve 20–84 cm akvaryum uzunluğu aralıkları resmî teknik tablodan işlendi. CO₂ Flipper ailesinin 60, 200, 300 ve 600 litre üst sınırları doğrulandı; bakım araçları filtrasyon kapasitesi hesabına karıştırılmadı.
- Dennerle bakım kapsamı 30'dan 111 ürün ailesine çıktı: 30 yem, 20 bitki/karbon bakımı, 11 test, 10 filtre/ozmoz medyası, sekiz su düzenleyici, üç bakteri kültürü, dokuz doğal/canlı bakım ürünü ve 20 taban ürünü. Genel site haritası kaynakları doğrudan resmî ürün sayfalarıyla değiştirildi.
- Dennerle regresyon kapsamı; 87 ekipman ve 111 bakım ürünü sayısı, kategori dağılımı, doğrudan kaynaklar, güncel doğrulama tarihi, aydınlatma güç/uzunluk değerleri ve CO₂ sistem kapasitesini içeriyor.
- Dennerle sonrasında `pnpm verify` 2026-08-27 tarihinde başarılı: TypeScript, yedi ekipman kategorili ve 593 bakım ürünlü katalog akışı, 35 sağlık senaryosu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti. Marka denetimi sekiz kapasite gerektiren kaydın sekizinin hazır olduğunu gösterdi (%100).
- Jeneca'nın resmî ALEAS çevrim içi kataloğundaki dış/iç filtre, hava motoru, su pompası, UV, ısıtıcı, aydınlatma, hava taşı ve bakım aksesuarı aileleri model düzeyinde karşılaştırıldı. Önceki 135 kayıt 257 doğrulanmış ekle 392 ekipmana yükseldi: 107 filtre, 41 hava motoru, 21 ısıtıcı, 42 aydınlatma, beş UV ve 176 diğer cihaz/aksesuar.
- XP-03B; IPF-408/448/728/1008/1508; XP-U1/U3/U5/U6; AH-2000DC–AH-8500DC ve ZL-101/103/221/223 için üreticinin yayımladığı debi ve güç tabloları işlendi. AE UV dış filtre ailesinin beş modeli güvenilir model sayfasındaki 750–1500 L/saat, 20–30 W pompa ve 5–9 W UV verileriyle; AE-800 ise 750 L/saat, 9,3 W ve 50–80 litre bilgisiyle eklendi.
- Üreticinin AH-100000DC satırında model adı ile 10000 L/saat debi, AH-12000DC satırında ise model adı ile 120000 L/saat debi arasında olası yazım çelişkileri bulundu. Bu değerler tahmin edilmedi ve otomatik kapasite hesabına alınmadı.
- Jeneca'nın başlangıçtaki 11 yayımlanmamış kapasite boşluğu güvenli biçimde korundu. Geniş üretici portföyü eklendiğinde kapasite gerektiren kayıt sayısı 169'a, teknik verisi hazır kayıt sayısı 97'ye çıktı (%57); kalan 72 modelin her biri yayımlanmamış veri notuyla otomatik filtrasyon/hava/ısıtıcı hesabının dışında tutuluyor.
- Jeneca regresyon kapsamı 392 kayıt toplamını, altı kategori dağılımını, HTTPS kaynakları, tarih biçimini, kritik debi/güç tablolarını, olası üretici yazım hatalarının kullanılmamasını ve hava taşlarının bağımsız filtre sayılmamasını doğruluyor.
- Jeneca sonrasında `pnpm verify` 2026-08-27 tarihinde başarılı: TypeScript, yedi ekipman kategorili ve 593 bakım ürünlü katalog akışı, 35 sağlık senaryosu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti.
- Twinstar'ın 2026 resmî mağazası karşılaştırıldı. Güncel premium portföy altı S Line Ver.5 ve yedi E Line Ver.5 modelinden, giriş seviyesi portföy ise yedi B Line Ver.3 modelinden oluşuyor. Waterproof Lighting ve ayrı Bluetooth Controller koleksiyonlarında bağımsız ürün yayımlanmıyor; sterilizatör koleksiyonu NANO ve NANO Plus kapasite varyantlarını içeriyor.
- Twinstar ekipman kapsamı 25'ten 40 kayda çıktı: 13 güncel Ver.5 aydınlatma ve iki elektroliz sterilizatörü eklendi; önceki E/S Line IV ve B Line Legacy modelleri tarihsel adlarıyla korundu. Güncel B Line kayıtları resmî Ver.3 adıyla yenilendi; 45B, 75B ve 120B akvaryum uzunlukları doğrudan ürün teknik bloklarına göre sırasıyla 45–55, 75–85 ve 120–125 cm olarak düzeltildi.
- NANO (30–120 L, M5) ve NANO Plus (50–250 L, M9) UV cihazı değil elektroliz sterilizatörü olduğundan yanıltıcı `uv` kategorisine konmadı. E Line Ver.5 750E sayfasında başlık, teknik üst sınır ve önerilen tank uzunluğu birbiriyle çeliştiği için bu model otomatik uzunluk uygunluk hesabının dışında bırakıldı ve çelişki ürün açıklamasında gösterildi.
- Twinstar regresyon kapsamı 40 toplam kaydı, 38 aydınlatma/iki diğer cihaz kategori ayrımını, güncel seri model sayılarını, kritik güç-lümen-uzunluk değerlerini, NANO hacimlerini ve tüm kayıtlarda HTTPS kaynak/tarih zorunluluğunu doğruluyor.
- Twinstar sonrasında `pnpm verify` 2026-08-27 tarihinde başarılı: TypeScript, yedi ekipman kategorili ve 593 bakım ürünlü katalog akışı, 35 sağlık senaryosu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti. GitHub/Vercel'e gönderim yapılmadı.
- Sonraki marka paketi: ADA'nın güncel resmî ürün aileleri ile mevcut 10 ekipman ve 36 bakım ürünü kaydını karşılaştırmak.
- ADA'nın güncel resmî aydınlatma, CO₂, filtrasyon ve bakım araçları portföyü model/varyant düzeyinde karşılaştırıldı. Mevcut 10 ekipmana 67 doğrulanmış kayıt eklenerek marka toplamı 77 ekipmana çıktı: altı filtre, 34 CO₂ ürünü/aksesuarı, dört aydınlatma ve 33 diğer cihaz/bakım aracı.
- Güncel NA LIGHT 300, NA LIGHT 450, NA LIGHT PRO 600 ve SOLAR RGB II için üreticinin yayımladığı güç tüketimleri ile uygulanabilir akvaryum uzunlukları işlendi. SOLAR RGB II sayfası yalnızca 90 cm üst sınırı verdiği için kaynağın yayımlamadığı bir alt uzunluk uydurulmadı.
- Pollen Glass CO₂ ve AIR varyantları, CO₂ sayaçları, altı Joint Glass boyu, Forest Bottle, Clear Stand, Tower, Attache/Speed regülatörleri, CO₂ Adapter, NA Control Timer II ve EL Valve doğrudan resmî ürün sayfalarıyla eklendi. Pasif AIR difüzörleri hava motoru gibi sınıflandırılmadı; motor gereksinimleri ayrıca işaretlendi.
- VUPPA-II'nin yüzey emici olduğu ve üreticinin debi yayımlamadığı açıkça belirtildi; bağımsız ana filtre kapasitesine katılmadı. On Pro-Scissors, yedi Pinsettes ve dokuz bakım aracı `other` kategorisine eklendi.
- ADA bakım kataloğuna Bio Rio G, Bio Cube, NA Carbon ve Bamboo Charcoal filtre medyaları eklendi; marka bakım toplamı 36'dan 40'a, genel bakım kataloğu 597 ürüne çıktı.
- ADA regresyon kapsamı 77 ekipman/40 bakım ürünü sayısını, kategori dağılımını, kritik güç ve tank uzunluğu değerlerini, pasif hava difüzörü güvenliğini, VUPPA-II debisinin tahmin edilmemesini, HTTPS kaynakları ve doğrulama tarihlerini denetliyor.
- ADA sonrasında `pnpm verify` 2026-08-27 tarihinde başarılı: TypeScript, yedi ekipman kategorili ve 597 bakım ürünlü katalog akışı, 35 sağlık senaryosu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti. ADA'da kapasite gerektiren altı ana filtrenin altısı hazır (%100).
- GitHub/Vercel: ADA paketi ve önceki yerel katalog değişiklikleri henüz gönderilmedi veya yayımlanmadı.
- Netlea'nın resmî ürün merkezi, güvenilir distribütör/satıcı sayfaları ve onaylı Türkiye mağazaları karşılaştırıldı. Önceki 33 ekipman kaydı; güncel pompalar, hava motorları, paslanmaz filtreler, aydınlatmalar ve aksesuarlarla 64 ekipmana çıkarıldı. Ayrıca 12 taban, gübre, bakteri ve filtre medyası ürünü bakım kataloğuna eklendi.
- Cikletist yerel marka sayfasında doğrulanan sekiz eksik aydınlatma eklendi: NL-6140P-AT5-D0/4, AT1 PRO 70W, AT3 PROS 65W, NL-595P-AT5-D0/2, NL-5130P-AT5-D0/2, AT1 PROS 30W, AT3 PROS 40W ve AT1 PROS 50W. Güç, LED sayısı, gövde ölçüsü ve kontrol özellikleri yalnızca sayfalarda açıkça yayımlanan kapsamda işlendi.
- Atakan'ın güncel Netlea sayfasındaki C4000, C5000, C6000, C7000, SG2500 ve SG5000 pompalarının tamamının katalogda bulunduğu doğrulandı. Cikletist'teki C9000 ve S5500 debi metinleri model adı veya diğer güvenilir kaynaklarla çeliştiği için bu değerlerle katalog değiştirilmedi; BettaMarketim'deki seramik medya sayfasının ürün başlığı ile marka alanı çeliştiğinden kayıt eklenmedi.
- G1, G2 ve Flower Cartridge pasif ön filtrelerine bağımsız pompa debisi atanmadı. No.2B, No.3B ve No.4B hava motorlarında yayımlanmayan hava debileri tahmin edilmedi. Netlea denetimi kapasite gerektiren 16 kaydın 10'unun otomatik hesaba hazır olduğunu gösteriyor (%63).
- Netlea regresyon kapsamı 64 ekipman/12 bakım ürünü sayısını, dört ekipman kategorisini, yerel sekiz aydınlatmanın yayımlanmış güçlerini, HTTPS kaynak ve tarih zorunluluğunu, pasif filtre güvenliğini ve yayımlanmayan teknik değerlerin boş bırakılmasını doğruluyor.
- Netlea sonrasında `pnpm verify` 2026-08-27 tarihinde başarılı: TypeScript, yedi ekipman kategorili ve 609 bakım ürünlü katalog akışı, 35 sağlık senaryosu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti.
- GitHub/Vercel: Netlea paketi ve önceki yerel katalog değişiklikleri henüz gönderilmedi veya yayımlanmadı.
- Sonraki marka paketi: Nubios'un mevcut 37 ekipman ve iki bakım ürününü güncel resmî/güvenilir portföyle karşılaştırmak; NW-450F, NW-600F, NW-800F, NW-1500F, NB-1500F, YU-118C ve YU-119C filtrelerinin yayımlanmamış debilerini onaylı yerel kaynaklarda yeniden araştırmak.
- Nubios'un mevcut ekipman ve bakım kayıtları Aquarubi, Atakan, Cikletist, BettaMarketim, Malawi İzmir ve AkvaryumExpress dahil onaylı yerel kaynaklarda yeniden karşılaştırıldı. Nano Easy renk seçenekleri aynı teknik cihazın varyantları olduğu için modeli gereksiz çoğaltmadan tek kayıtta korundu.
- Yerel portföyde bulunup katalogda olmayan altı kayıt eklendi: 5 L Küp ve 3,7 L Faunus masaüstü plastik setleri, NB-A20-INCA-S Nano Inca, DA-L25 13,5 L Küp, 7 × 7 cm karides kepçesi ve dijital termometre-higrometre. Yalnızca kaynaklarda açıkça yayımlanan hacim, ölçü ve ürün özellikleri işlendi; yayımlanmayan pompa değerleri eklenmedi.
- NW-450F, NW-600F, NW-800F, NW-1500F, NB-1500F, YU-118C ve YU-119C filtre debileri altı onaylı yerel kaynakta yeniden arandı ancak güvenilir teknik değer bulunamadı. Modeller kapasite boşluğu açıklamasıyla otomatik filtrasyon hesabının dışında tutulmaya devam ediyor.
- Nubios toplamı 43 ekipman ve iki bakım ürününe ulaştı: 16 filtre ve 27 diğer cihaz/aksesuar. Kapasite gerektiren 16 kaydın dokuzu doğrulanmış teknik değerle otomatik hesaba hazır (%56).
- Nubios regresyon kapsamı toplam kayıt/kategori dağılımını, altı yeni yerel ürünü, HTTPS kaynak ve güncel doğrulama tarihini, yayımlanmamış debilerin tahmin edilmemesini doğruluyor.
- Nubios sonrasında `pnpm verify` 2026-08-27 tarihinde başarılı: TypeScript, yedi ekipman kategorili ve 609 bakım ürünlü katalog akışı, 35 sağlık senaryosu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti.
- GitHub/Vercel: Nubios paketi ve önceki yerel katalog değişiklikleri henüz gönderilmedi veya yayımlanmadı.
- Sonraki marka paketi: Ejet'in mevcut 12 ekipman kaydını güncel resmî/güvenilir portföy ve onaylı Türkiye mağazalarıyla karşılaştırmak.
- Ejet'in mevcut 12 ekipman kaydı güncel Atakan ve Malawi İzmir portföyleriyle karşılaştırıldı. Katalogda bulunmayan Ejet 101 sünger/pipo üretim filtresi, debisinin kullanılan hava motoruna bağlı olduğu açıkça belirtilerek ve doğrudan yerel ürün kaynağıyla eklendi.
- Ejet toplamı 13 ekipmana ulaştı: 12 filtre ve bir hava motoru. Kapasite değerlendirmesine giren 13 kaydın tamamı güvenli biçimde hazır; pasif pipo filtrelerine bağımsız motor debisi atanmadı.
- Yerel mağaza sayfalarında 905F ve 906F için mevcut güvenilir kayıtlarla çelişen debi/güç değerleri görüldü. Daha güçlü birincil kaynak bulunmadığı için katalogdaki değerler bu çelişkili ikincil verilerle değiştirilmedi.
- Ejet regresyon kapsamı 13 toplam kaydı, Ejet 101'in yerel kaynağını ve pasif filtre güvenliğini doğruluyor.
- Ejet sonrasında `pnpm verify` 2026-08-27 tarihinde başarılı: TypeScript, yedi ekipman kategorili ve 609 bakım ürünlü katalog akışı, 35 sağlık senaryosu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti.
- GitHub/Vercel: Ejet paketi ve önceki yerel katalog değişiklikleri henüz gönderilmedi veya yayımlanmadı.
- Sonraki marka paketi: Ferplast'ın mevcut ekipman ve bakım ürünü kayıtlarını güncel resmî portföy ve onaylı Türkiye mağazalarıyla karşılaştırmak.
- Ferplast'ın resmî güncel 69 cihaz/ekipman ürün ailesi, yayımlanan model varyantları düzeyinde karşılaştırıldı. Önceden filtre ve ısıtıcı ağırlıklı 47 kayıt içeren kapsam; aydınlatma, su ve dalga pompaları, hava motorları, skimmer, otomatik yemleyici, kontrol cihazı ve yardımcı ekipmanlarla 143 ekipmana çıkarıldı. CO₂ Energy Ingredients ayrıca bakım kataloğuna eklendi.
- Güncel Ferplast dağılımı 26 filtre, 21 ısıtıcı, dört hava motoru, 39 aydınlatma ve 53 yardımcı cihaz/aksesuar olmak üzere beş kategoridir. Renk seçenekleri ayrı teknik cihaz olarak çoğaltılmadı; gerçek güç veya ölçü varyantları ayrı seçilebilir model olarak işlendi.
- LED BAR FRESHLIFE, TOPLIFE, SEALIFE ve PRO TOPLIFE ailelerinin yayımlanan güçleri; HY-LED MINI'nin 5 W değeri; BLUSKIMMER, SLIM SKIM NANO, PICO SKIM ve BIOFLO'nun yayımlanan hacim üst sınırları resmî doğrudan ürün sayfalarından işlendi.
- AQAMAI ve AQ-LUX sayfalarının erişilebilir metninde model bazında güç tablosu yayımlanmadığı için güç değeri tahmin edilmedi. SELTZ, PICO, BLUPOWER ve KORALIA pompalarında model numarası doğrulanmış debi gibi kullanılmadı; AIRFIZZ modelleri de açık model bazlı toplam hava debisi bulunana kadar açıklamalı biçimde otomatik hava kapasitesi hesabının dışında tutuluyor.
- Ferplast regresyon kapsamı 143 ekipman/1 bakım ürünü toplamını, beş kategori dağılımını, kritik LED güçlerini, pasif BIOFLO güvenliğini, doğrudan resmî kaynakları ve teknik değer uydurulmamasını doğruluyor.
- Ferplast sonrasında `pnpm verify` 2026-08-27 tarihinde başarılı: TypeScript, yedi ekipman kategorili ve 610 bakım ürünlü katalog akışı, 35 sağlık senaryosu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti. Kapasite gerektiren 51 Ferplast kaydının 47'si otomatik hesaba hazır (%92).
- GitHub/Vercel: Ferplast paketi ve önceki yerel katalog değişiklikleri henüz gönderilmedi veya yayımlanmadı.
- Sonraki marka paketi: Shark ve Armatürk'ün mevcut aydınlatma kayıtlarını güncel resmî/güvenilir Türkiye portföyleriyle yeniden karşılaştırmak.
- Shark'ın güncel güvenilir Türkiye satıcı portföyündeki 22 aydınlatma seçeneği model düzeyinde yeniden karşılaştırıldı. Dört sıralı sekiz, üç sıralı üç, iki sıralı üç ve bar tipi sekiz güncel seçenek ayrı seçilebilir kayıtlar olarak tutuldu.
- Güncel listede görünmeyen eski 3-sıra 23/33/53/63/95/105 cm ve 2-sıra 83 cm kayıtları kaldırıldı; 2-sıra 23/33/53 cm, 3-sıra 93 cm, 4-sıra 53/75 cm ve 100 cm full-spectrum bar eklendi. 75 cm modelde kaynak lümen yayımlamadığı için değer tahmin edilmedi.
- Armatürk'ün resmî tatlı su kategorisindeki 37 modelin tamamının zaten katalogda olduğu doğrulandı. Eksik dört tuzlu su armatürü, dört termostatlı soğutucu fan ve beş resmî armatür/dış filtre aksesuarı eklenerek marka toplamı 50 ekipmana çıktı: 41 aydınlatma ve dokuz diğer ekipman.
- Armatürk 2040T, 2060T ve 2070T için resmî güç ve akvaryum uzunluğu verileri işlendi. 2080T ürün sayfasının gövdesinde modelin 2080H yazılması nedeniyle 96 W ve 80–94 cm değerleri otomatik uygunluk alanlarına aktarılmadı; çelişki açıklamada görünür bırakıldı.
- Armatürk soğutucu fanların yayımlanan üst sınırları sırasıyla 50, 120, 150–250 ve 350 litre olarak işlendi. Filtre hortumları, vantuz, boru tutucu ve yedek armatür ayağı kapasite cihazı gibi değerlendirilmedi.
- Shark ve Armatürk regresyon kapsamı; tam model listelerini, kategori dağılımını, kritik güç/lümen/uzunluk ve fan hacimlerini, eski Shark modellerinin geri dönmemesini ve çelişkili Armatürk değerlerinin otomatik hesaba girmemesini doğruluyor.
- Shark ve Armatürk sonrasında `pnpm verify` 2026-08-27 tarihinde başarılı: TypeScript, yedi ekipman kategorili ve 610 bakım ürünlü katalog akışı, 35 sağlık senaryosu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti.
- GitHub/Vercel: Shark/Armatürk paketi ve önceki yerel katalog değişiklikleri henüz gönderilmedi veya yayımlanmadı.
- Sonraki tek iş: canlı kataloğunun 18 kullanıcı kategorisindeki tür kapsamını ve doğrulanmış bakım/uyumluluk verilerini grup grup denetlemek.
- Canlı kataloğunun ilk yerel karşılaştırma turunda AquaRubi'nin güncel satış listeleri kullanıldı. Kullanıcının onayıyla Atakan Petshop, BettaMarketim, AquaRubi, Cikletist Petshop, Malawi İzmir ve AkvaryumExpress bundan sonra tüm ürünlerde resmî kaynaktan sonraki ikinci doğrulama katmanıdır.
- Barb grubuna Türkiye listesinde bulunan Melon Barb ve Mascara Barb eklendi. Boy, minimum akvaryum, sürü, sıcaklık, pH, akıntı ve özel bakım uyarıları tür bazlı kaynaklarla doğrulandı; barb grubu 12 profile ulaştı.
- Güney Amerika cichlid karşılaştırmasında Goldeneye cüce cichlid (`Nannacara anomala`) ve Checkerboard cichlid (`Dicrossus filamentosus`) eklendi. Bölgecilik, çok yumuşak/asidik su ve geniş taban ihtiyacı görünür uyarılara işlendi; cichlid grubu 40 profile ulaştı.
- AquaRubi'nin sekiz Corydoras ürünü ile ilgili Pleco/yosun yiyici listesi karşılaştırıldı. Napo, Similis, Panda Loach, C125 Red Aspidoras, Black Venezuela Cory ve Royal Farlowella eklendi. Ticari ad-taxonomi farkları arama takma adlarında korundu; dip balığı grubu 38 profile ulaştı.
- Cüce kerevit listesindeki `Cambarellus diminutus` eklendi. Tek birey ile grup hacmi farkı, mağara/görüş bariyeri, kaçış ve fırsatçı avlanma riski uyarılara işlendi; kerevit grubu dört profile ulaştı.
- Yeni dokuz canlı profili ve iki barb için kesin grup sayıları, minimum hacim/uzunluk, sıcaklık, pH, akıntı, doğrulama tarihi ve bakım uyarıları regresyon testine alındı. Hedefli katalog akışı testi başarılı.
- Kaynaklarda bilimsel kimlik veya teknik değer açık değilse ticari ad üzerinden tür tahmin edilmedi; kaynak çelişkileri kesin değer gibi kataloğa aktarılmadı.
- GitHub/Vercel: canlı kataloğu denetimi ve önceki yerel değişiklikler henüz gönderilmedi veya yayımlanmadı.
- Sonraki tek iş: yerel canlı listelerinde kalan tetra, rasbora, Betta/Japon, karides ve salyangoz gruplarını mevcut profiller ve renk varyantlarıyla karşılaştırmak.
- AquaRubi'nin 11 kalemlik tetra/rasbora ve altı kalemlik Betta/Japon listesi ayrıca karşılaştırıldı. Listedeki biyolojik türlerin tamamı katalogda bulunuyor; Galaxy Candy Koi, Galaxy Halfmoon, Mix Colour Betta, Red Cap Oranda ve Sivrisinek Rasbora yeni türler gibi çoğaltılmadan mevcut doğru bakım profillerine arama takma adı olarak bağlandı.
- AquaRubi'nin karides/kerevit bölümündeki 58 güncel satış kalemi; 29 Caridina, 11 Neocaridina, 13 salyangoz ve iki cüce kerevit alt listesiyle karşılaştırıldı. Mağaza kalite sınıfları ayrı biyolojik tür gibi çoğaltılmadı; 38 karides ve 20 salyangoz bakım profili altında aranabilir varyete adları olarak birleştirildi.
- White Pearl doğru `Neocaridina cf. zhangjiajiensis` kimliği ve yayımlanan 20–26 °C / pH 6,5–7,8 aralığıyla eklendi. Altı eksik Neocaridina bakım profili ile Taiwan Bee, Pinto, Galaxy, Fancy Tiger, PRL ve Blue Tiger ailelerini kapsayan 13 hassas Caridina profili eklendi.
- Hassas Taiwan Bee/Pinto/Galaxy gruplarında 19–22 °C, pH 5,5–6,5, en az altılı grup, aktif toprak, düşük KH ve kararlı GH/TDS gereksinimleri görünür uyarılara işlendi. Bu koşullar yalnızca kaynağın açıkça verdiği varyete ailelerine uygulandı.
- Yellow Poso Spotted Rabbit doğrulanan `Tylomelania towutica` kimliğiyle eklendi. Poso Orange/Yellow ticari varyantları tür düzeyinde kesinleştirilmedi; Turbo, Tiger, Mini Tiger, Mini, Batik ve Batman Nerite kayıtlarında kaynak bilimsel tür vermediği için `Neritidae sp.` kullanıldı ve kimlik belirsizliği kullanıcıya açıkça gösterildi.
- Yerel mağaza adlarının sağlık profiline bağlanması, yeni canlıların HTTPS kaynak ve 2026-08-27 doğrulama tarihi, hassas Caridina koşulları ve kaynaksız bilimsel tür uydurulmaması regresyon testine alındı. Hedefli katalog akışı; yedi ekipman kategorisi, dört canlı sınıfı ve 610 bakım ürünüyle başarılı.
- Karides/salyangoz paketi sonrasında `pnpm verify` başarılı: TypeScript, katalog akışı, 35 sağlık senaryosu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti. Canlı denetimi 38 karides ve 20 salyangoz profilinin tamamında kaynak ve bakım verisi bulunduğunu doğruladı.
- Kullanıcının onayıyla Atakan Petshop, BettaMarketim, AquaRubi, Cikletist Petshop, Malawi İzmir ve AkvaryumExpress tüm ürünlerde resmî kaynaktan sonraki ikinci doğrulama katmanı olarak kullanılacak; çelişkili değerler kesin veri gibi seçilmeyecek.
- GitHub devir noktası: bu doğrulanmış katalog paketi `codex/catalog-capacity-batch` görev dalına aktarılacak; `main` dalı ve Vercel/canlı uygulama bu pakette güncellenmeyecek.
- Sonraki tek iş: yerel canlı listelerinde henüz denetlenmeyen grupları mevcut biyolojik profiller ve mağaza varyantlarıyla karşılaştırmak.
