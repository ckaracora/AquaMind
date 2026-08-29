# AquaMind proje durumu

Son güncelleme: 2026-08-29

## Doğrulanmış temel

- GitHub: `https://github.com/ckaracora/AquaMind`
- Ana dal: `main`
- Başlangıç commit'i: `7d8fb01 fix: approve sharp build dependency`
- Canlı önizleme: `https://aqua-mind-three.vercel.app/`
- Görev panosu: `https://github.com/users/ckaracora/projects/1`
- Teknoloji: Next.js 15, React 19, TypeScript, Tailwind CSS, pnpm
- `pnpm verify`: 2026-08-29 tarihinde yerelde başarılı
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

`codex/catalog-capacity-batch` dalındaki katalog çalışması sürüyor. Son güvenli kapasite paketi Netlea No.2B, No.3B ve iki ayrı No.4B alt modelini doğrulanmış debileriyle otomatik hava kapasitesi hesabına kattı; pasif G1, G2 ve Flower Cartridge ön filtreleri motorlu kapasite eksiği gibi sayılmayacak biçimde işaretlendi. Netlea kapasite denetimi 14/14 (%100) oldu. Teknik değeri yayımlanmayan Aquawing, Boyu, Eurostar ve Haqos kayıtlarında tahmin yapılmadı. Sıradaki güvenli iş Nubios'un yedi açıklamalı filtre debisi boşluğunu doğrudan ürün kaynaklarıyla yeniden denetlemektir. Canlı kataloğundaki son grup `Tuzlu Su Canlıları`dır; akvaryum türü, tuzluluk ve deniz canlısı gereksinimleri için ayrı veri/sağlık modeli kararı verilene kadar tatlı su profillerine eklenmeyecektir.

## Oturum sonu devir şablonu

- Yapılan görev:
- Değişen dosyalar:
- Çalıştırılan kontroller:
- Sonuç:
- Bilinen hata veya risk:
- GitHub'a gönderildi mi:
- Vercel'e yayımlandı mı:
- Sonraki tek iş:

## 2026-08-28 Cikletist vatoz ve kedi balığı karşılaştırması

- Cikletist'in güncel `Vatoz Kedi Balıkları` kategorisindeki üç sayfa doğrudan karşılaştırıldı; toplam 56 satış başlığı regresyon kapsamına alındı.
- Mevcut güvenli profillere bağlanan Ancistrus varyeteleri, Otocinclus ticari adları, SAE, Red Tail Catfish, Red Lizard, Senegal bichir, Sterbai ve L106 adlarıyla birlikte 43 başlık doğrulanmış sağlık profiline bağlandı.
- Yirmi yedi eksik profil kaynaklı bakım eşikleriyle eklendi: Delhezi bichir (`Polypterus delhezi`), Hujeta gar (`Ctenolucius hujeta`), L128 Blue Phantom (`Hemiancistrus sp. L128`), L129 Kolombiya Zebra (`Hypancistrus debilittera`), L190 Royal Pleco (`Panaque nigrolineatus`), L201 Orinoco Angel (`Hypancistrus sp. L201`), L239 Blue Panaque (`Baryancistrus beggini`), L340 Mega Clown (`Hypancistrus sp. L340`), L091 Three Beacon (`Leporacanthicus triactis`), L240 Vampir (`Leporacanthicus sp. L240`), L052 Kelebek (`Dekeyseria picta`), L243 Orange Tiger (`Peckoltia wernekei`), L116 Red Fin Thresher (`Aphanotorulus emarginatus`), LDA72 Three-ray Bristlenose (`Ancistrus triradiatus`), L149 Cucuta Bristlenose (`Ancistrus sp. L149`), L191 Brokenline Royal (`Panaque sp. L191`), L244 Black Spotted Flyer (`Pseudolithoxus dumus`), L200A High-fin Green Phantom (`Baryancistrus demantoides`), L059A Blue-spotted Bristlenose (`Ancistrus hoplogenys`), L235 Anthrax Flyer (`Pseudolithoxus anthrax`), L127 Lujan vatozu (`Peckoltia lujani`), Orange Venezuela Cory (`Osteogaster venezuelanus`), Green Laser CW009 (`Corydoras sp. CW009`), Rabauti Cory (`Osteogaster rabauti`), Highfin Spotted CW027 (`Hoplisoma sp. CW027`), White Spotted Doras (`Agamyxis pectinifrons`) ve LDA38 Orinoco Wood Pleco (`Hypostomus plecostomoides`). Büyük/avcı türlerde akvaryum uzunluğu, sosyal grup, kaçış, yüksek atık ve avlanma riskleri kullanıcı uyarılarına işlendi.
- L201 mağaza başlığındaki `Hypancistrus inspector` ifadesi kesin bilimsel kimlik olarak kullanılmadı; bu adın benzer benekli Hypancistruslarla karışabildiği kullanıcı uyarısına işlendi.
- Kalan 13 ticari ad; mağaza sayfası bilimsel kimlik vermediği, L-numarası ile yazılı ad çelişebildiği veya güvenli bakım eşiği henüz doğrulanmadığı için tahminle eşleştirilmedi. `L-069 Peckoltia Ucayalensis` başlığı özellikle çözülmemiş tutuldu: güncel L-numarası kaynakları L069'u `Ancistrini sp.` olarak verirken `Peckoltia ucayalensis` başka numaralarla ilişkilendiriliyor. `L-103 CLOWN PLECO` da L103'ün güvenilir kaynaklarda `Peckoltia sp.` olarak geçmesi ve palyaço vatoz ticari adının başka türler için kullanılması nedeniyle `Panaqolus maccus` profiline bağlanmadı. Pangasius ve goby gibi yalnızca genel ticari ad taşıyan başlıklar da satıcı bilimsel kimlik yayımlamadığı için çözülmemiş durumda. Bu başlıkların yanlış profile bağlanmaması ayrıca test ediliyor.
- Tam doğrulama: `pnpm verify` başarılı; TypeScript, 56 başlıklı Cikletist regresyonu dahil katalog akışı, 35 sağlık senaryosu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti.
- GitHub/Vercel: bu paket henüz gönderilmedi ve yayımlanmadı.
- Sonraki tek iş: Cikletist listesindeki kalan 13 çözülmemiş başlığı, bilimsel kimliği açık olanlardan başlayarak küçük gruplar halinde doğrulamak.

## 2026-08-26 katalog kapasite paketi

- Aktif dal: `codex/catalog-capacity-batch`
- Boyu SES-10 hava kompresörünün 10 L/dakika (600 L/saat), 10 W ve 0,02 MPa teknik verileri iki güvenilir Türkiye kaynağında doğrulandı; doğrudan ürün kaynağı katalog kaydına işlendi.
- Nubios NW-450F, NW-600F, NW-800F, NW-1500F, NB-1500F, YU-118C ve YU-119C için güvenilir debi verisi bulunamadı. YU-118C adıyla yayımlanan bir sayfanın Xinyou XY-2900 verisini yanlış kopyaladığı görüldüğü için bu değerler kullanılmadı.
- Aquawing AQ-A3000 için 25 W güç doğrulandı ancak hava debisi; Boyu SP-1300C içinse kapasite verileri yayımlanmadı. İki kayıt da otomatik kapasite hesabının dışında bırakıldı. Haqos EASY-1000AT, Aqua Flow 250 ve Thermo-Sprite resmî katalogda doğrulandı; resmî sayfalarda teknik değerler metin olarak yayımlanmadığı ve görsel sunucusu erişilemediği için başka markalara ait benzer model değerleri kopyalanmadı.
- `pnpm verify`: başarılı; TypeScript, katalog akışı, 35 sağlık senaryosu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti.
- GitHub/Vercel: bu paket henüz gönderilmedi ve yayımlanmadı.
- Regent'in güncel Türkiye portföyündeki 6500, 7500, 8500 ve 9500 modellerinin katalogda bulunduğu doğrulandı. Eski/yurt dışı 5500 kaydının yanlışlıkla 9500 ürününe giden kaynağı, 2 W ve 80 L/saat değerlerini yayımlayan doğrudan 5500 sayfasıyla değiştirildi; Calm RC-006 bağımsız kaynağıyla korundu.
- XLPro'nun Türkiye dağıtıcı ve perakendeci listelerindeki altı güncel filtre modelinin tamamının katalogda bulunduğu doğrulandı. Mini seri adları gerçek model kodları olan MINI-230, MINI-500 ve MINI-500AT biçimine getirildi; MINI-500AT doğrudan ürün kaynağına bağlandı ve yayımlanan 100 litre üst sınırı eklendi.
- Xinyou'nun güncel marka sayfasındaki dokuz sünger filtre modelinin tamamının katalogda doğru hacim üst sınırları ve hava motoru gereksinimiyle bulunduğu doğrulandı. Türkiye'de kullanılan diğer eski modeller ve XY-2010 köşe filtresi ayrıca korundu; güncel dokuz model için regresyon kapsamı eklendi.
- Meç'in güncel Türkiye marka sayfasındaki dokuz satış kalemi, paket adetleri birleştirildiğinde altı aksesuar ailesidir ve altısı da katalogda bulunuyor. Ayrı kaynaklarla doğrulanan sekiz pipo/üretim filtresinin tamamı hava motoru gerektiren filtre olarak korunuyor.
- RS Electrical'ın Türkiye yetkili satıcı marka sayfasındaki 29 güncel satış kaleminin tamamı katalogda doğrulandı: yedi FA askı filtre, üç tepe/UV filtre, üç hava motoru, altı I399 çelik ısıtıcı, dört 758 cam ısıtıcı ve beş bakım/soğutma ürünü. Eski/yurt dışı doğrulanmış modeller ayrıca korundu; marka toplamı 42 ekipmana ulaştı.
- RS-288 tepe filtrenin eski 1000 L/saat değeri doğrudan ürün sayfasındaki 1200 L/saat, 15 W ve 240 litre verisiyle düzeltildi. FA serisinin debi, güç, hacim üst sınırı ve ayarlanabilir akış bilgileri doğrudan ürün kaynaklarına bağlandı.
- RS 313 ve RS 960 hava motorları otomatik kapasite hesabına girecek doğrulanmış debilerle eklendi. RS 1000 için yetkili satıcının teknik tablosundaki toplam 9 L/dakika değeri aynı model serisini listeleyen bağımsız kaynaklarla doğrulandı; 540 L/saat, 8 W, 200 litre ve ayarlanabilir akış bilgileri otomatik hava kapasitesi hesabına alındı.
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
- SunSun 502 için iki bağımsız kaynakta ortak yayımlanan 320 L/saat ve 60 litre değerleri işlendi; güç kaynaklarda 5 W ve 6 W olarak çeliştiği için boş bırakıldı. Güncel Türkiye 503 modeli iki güncel ürün kaynağında doğrulanan 600 L/saat ve 6 W değerleriyle otomatik filtrasyon hesabına alındı. JVP dalga motorları filtrasyon ekipmanı gibi değerlendirilmedi.
- SunSun katalog denetimi: kapasite gerektiren 48 kaydın 48'i hazır (%100). 77 kayıt toplamı, 28 güncel Türkiye eki, çapraz kaynaklar, kaynak/tarih zorunluluğu ve kritik teknik değerler regresyon kapsamına alındı.
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
- AQAMAI ve AQ-LUX sayfalarının erişilebilir metninde model bazında güç tablosu yayımlanmadığı için güç değeri tahmin edilmedi. SELTZ, PICO, BLUPOWER ve KORALIA pompalarında model numarası doğrulanmış debi gibi kullanılmadı. AIRFIZZ 50/100/200/400 modellerinin resmî sayfada yayımlanan toplam 50/100/200/400 L/saat debileri, 2/3/4/5 W güçleri, çıkış sayıları ve basınçları işlendi.
- Ferplast regresyon kapsamı 143 ekipman/1 bakım ürünü toplamını, beş kategori dağılımını, kritik LED güçlerini, pasif BIOFLO güvenliğini, doğrudan resmî kaynakları ve teknik değer uydurulmamasını doğruluyor.
- Ferplast sonrasında `pnpm verify` 2026-08-27 tarihinde başarılı: TypeScript, yedi ekipman kategorili ve 610 bakım ürünlü katalog akışı, 35 sağlık senaryosu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti. AIRFIZZ doğrulamasıyla kapasite gerektiren 51 Ferplast kaydının 51'i otomatik hesaba hazır (%100).
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
- AquaRubi'nin ana balık kategorisindeki 38 güncel satış kaleminin tamamı herkese açık mağaza verisinden karşılaştırıldı. Yeni biyolojik tür açığı bulunmadı; mağaza adları mevcut 24 doğru bakım profiline bağlandı.
- Siyah Cüce Vatoz, L144 Longfin, Halfmoon Red/White, Kardinal Neon, Electric Blue Ramirezi, Apistogramma Kakadu, Pigme/Habrosus Cory, C125 Red, Black Venezuela, Royal Farlowella, Red Lizard Whiptail, SAE ve Otocinclus Affinis gibi yerel adlar yeni tür gibi çoğaltılmadan aranabilir takma ad olarak eklendi.
- `Otocinclus affinis` ve `SAE` ticari adlarının birden fazla benzer türle karışabildiği kullanıcı uyarısına işlendi. Ticari ad nedeniyle bilimsel kimlik değiştirilmedi; mevcut doğrulanmış bakım profilleri korundu.
- AquaRubi'nin 38 güncel balık adının doğru sağlık profiline bağlanması regresyon kapsamına alındı; hedefli katalog akışı testi başarılı.
- AquaRubi ana balık listesi sonrasında tam `pnpm verify` başarılı: TypeScript, katalog akışı, 35 sağlık senaryosu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti.
- Cikletist'in güncel canlı doğuran kategorisindeki 24 satış kalemi karşılaştırıldı. Bilimsel kimliği açık olan 18 lepistes varyetesi ile Plati, Moli ve Koi Kılıç Kuyruk mevcut doğru biyolojik profillere bağlandı; renk varyeteleri ayrı tür gibi çoğaltılmadı.
- `VELİFERA BALIKLARI`, `VELİFERA TÜRLERİ` ve `ALBİNO SKY BLUE` sayfalarında bilimsel tür yayımlanmadığı için bu üç ticari ad tahminle bir profile bağlanmadı. FishBase, `Poecilia velifera` ile mevcut `Poecilia latipinna` profilinin ayrı türler olduğunu doğruluyor; satıcı kimliği açıklanana kadar yanlış sağlık önerisi üretmemek için kayıtlar çözülmemiş tutuldu.
- Cikletist canlı doğuran paketi sonrasında `pnpm verify` başarılı: TypeScript, yedi ekipman kategorili katalog akışı, 35 sağlık senaryosu, 18 canlı grubunun kaynak/bakım denetimi ve 14 sayfalık üretim derlemesi geçti.
- Cikletist Betta kategorisindeki 14 canlı kayıt karşılaştırıldı. On bir `Betta splendens` varyetesi ile Dev Gurami ve Çikolata Gurami mevcut doğru profillere bağlandı; mağazadaki Tetra Betta Menü canlı listesine dahil edilmedi.
- `MEYAN KÖKÜ GURAMİ` adı birden fazla `Parosphromenus` türünü kapsayabildiği ve mağaza bilimsel kimlik yayımlamadığı için tahminle eşleştirilmedi. Bu ayrım regresyon testinde korunuyor.
- Cikletist Betta/labirentli paketi sonrasında `pnpm verify` başarılı: TypeScript, katalog akışı, 35 sağlık senaryosu, tüm canlı gruplarının kaynak/bakım denetimi ve 14 sayfalık üretim derlemesi geçti.
- Cikletist Japon/Oranda kategorisindeki 17 benzersiz satış başlığı karşılaştırıldı: 13 Japon/Oranda/Ranchu/Ryukin/Teleskop varyetesi mevcut `Carassius auratus` profiline, dört koi başlığı yeni ve ayrı `Cyprinus carpio` profiline bağlandı.
- Koi profili FishBase, OATA ve Australian Koi Association verileriyle doğrulandı: 75 cm yetişkin boyu, en az 4.500 litre uzman havuzu, yaklaşık 3 metre yüzme alanı, en az üçlü sosyal grup, 4–24 °C ve pH 6,5–8,5. Akvaryuma uygun olmadığı, güçlü filtrasyon/oksijen/karantina gerektiği ve doğaya bırakılamayacağı görünür uyarılara işlendi.
- Koi/Japon paketi sonrasında `pnpm verify` başarılı: TypeScript, katalog akışı, 35 sağlık senaryosu, artık yedi profilli soğuk su grubu dahil tüm katalog denetimi ve 14 sayfalık üretim derlemesi geçti.
- Sonraki tek iş: yerel canlı listelerinde henüz denetlenmeyen grupları mevcut biyolojik profiller ve mağaza varyantlarıyla karşılaştırmak.

## 2026-08-28 Cikletist yılan ve müren karşılaştırması

- Cikletist'in güncel `Yılan ve Müren Balıkları` kategorisindeki 12 satış başlığı regresyon kapsamına alındı.
- Bilimsel kimliği ve zorunlu bakım eşikleri güçlü bilimsel/uzman kaynaklarda açık olan sekiz tür eklendi: Andrao yılanbaş (`Channa andrao`), Assam yılanbaş (`Channa stewartii`), Ornate yılanbaş (`Channa ornatipinnis`), Gökkuşağı yılanbaş (`Channa bleheri`), Peacock yılanbaş (`Channa pulchra`), İmparator yılanbaş (`Channa marulioides`), Dev kırmızı yılanbaş (`Channa micropeltes`) ve Yarım bantlı dikenli yılan balığı (`Macrognathus circumcinctus`).
- Bu profillerde yetişkin boyu, minimum hacim ve akvaryum uzunluğu, sıcaklık, pH, avcılık, topluluk/tür akvaryumu, mevsimsel serinleme, yüzey havası, hassas kum ve kaçışa dayanıklı kapak gereksinimleri kaynaklı eşiklerle işlendi. Büyük tür grubu 23 profile ulaştı.
- Yerel mağaza sayfaları yalnızca Türkiye'de kullanılan satış adlarını karşılaştırmak için kullanıldı. Bakım değerleri Seriously Fish, Fishipedia, Practical Fishkeeping, Maidenhead Aquatics/Fishkeeper ve tür uzmanı Aquarium Dietzenbach gibi daha güvenilir kaynaklarla denetlendi.
- `Channa marulioides` için bilimsel tür geçerliliği Eschmeyer's Catalog of Fishes, 65 cm erişkin boyu USGS yayınındaki tür monografisi ve bakım eşiği Fishipedia ile çapraz doğrulandı. Daha düşük hacim yayımlayan kaynaklar bulunmasına rağmen 65 cm erişkin boya uygun, koruyucu 1000 litre/200 cm eşik kullanıldı.
- `Channa micropeltes` bilimsel 130 cm boy, 5000–6000 litre bakım kaynağı ve 400–500 cm uzman yüzme alanı önerisiyle; `Macrognathus circumcinctus` ise 20 cm boy, koruyucu 215 litre/90 cm taban ve kum/kaçış gereksinimleriyle çapraz doğrulandı. Birden çok kaynağın kayda izlenebilir biçimde bağlanması için `additionalSourceUrls` alanı ve HTTPS denetimi eklendi.
- `ZİGZAK TARAK BALIKLARI`, `WHITE CHECK EEL MÜREN`, `CHANNA GOLDEN LİMBATA` ve birbiriyle çelişen `CHANNA ASIATICA GÖKKUŞAĞI YILANBAŞ BLEHERİ` adları kesin kimlik tamamlanana kadar tahminle eşleştirilmiyor. White Cheek/Check Moray adı `Echidna rhodochilus` ile ilişkili görünse de acı su-deniz salinitesi mevcut tatlı su sağlık modelinde temsil edilmediği için güvenli profil oluşturulmadı.
- Tam `pnpm verify` başarılı: TypeScript, yedi ekipman kategorili ve dört canlı sınıflı katalog akışı, 35 sağlık senaryosu, çoklu HTTPS kaynak denetimi, 23 profilli büyük tür grubu ve 14 sayfalık üretim derlemesi geçti.
- GitHub/Vercel: bu paket henüz gönderilmedi veya yayımlanmadı.
- Sonraki tek iş: kategoride çözülemeyen dört adı güvenli biçimde çözülmemiş tutup sıradaki yerel canlı kategorisini güvenilir tür kaynaklarıyla karşılaştırmak.

## 2026-08-28 Cikletist Amerikan tetra ve rainbowfish karşılaştırması

- Yerel mağazanın Amerikan tetra kategorisindeki beş sayfada bulunan 46 satış başlığı yalnızca Türkiye'de kullanılan ticari adları tespit etmek için kullanıldı; bilimsel kimlik ve bakım eşikleri mağaza açıklamalarından alınmadı.
- Flame tetra (`Hyphessobrycon flammeus`), Mavi imparator tetra (`Inpaichthys kerri`), Buenos Aires tetra (`Psalidodon anisitsi`), Kolombiya tetra (`Hyphessobrycon columbianus`), Kırmızı göz tetra (`Bario sanctaefilomenae`) ve Celebes gökkuşağı (`Marosatherina ladigesi`) güvenilir bilimsel/uzman kaynaklarla eklendi. Kimlik, yetişkin boyu, sürü sayısı, sıcaklık, pH, minimum hacim ve yüzme alanı eşikleri FishBase ile Fishkeeper, Fluval, Practical Fishkeeping ve tür odaklı uzman kaynaklar üzerinden çapraz doğrulandı.
- Furcata, Gertrudae, Madagaskar, Werneri, Neon Rainbow, Serpae, Silvertip, Ember, Lamp Eye, Penguin, makas kuyruk, transgenetik tetra, Black Palmeri, Boesemani, Congo, Gardneri ve Green Neon satış adları yeni biyolojik türler gibi çoğaltılmadan mevcut doğru profillere bağlandı.
- `BLUE KING TETRA` adı güvenilir ticaret listelerinde hem `Inpaichthys kerri` hem `Boehlkea fredcochui` için kullanıldığı için çözülmemiş bırakıldı. `KIRMIZI KALEM TETRA BALIKLARI`, `BUZ BALIĞI`, `ROSY TETRA BALIKLARI`, `Gül Tetra`, `Siyah Simpson Tetra` ve `Kiraz Tetra` başlıkları da bilimsel kimlik netleşmeden tahminle eşleştirilmedi.
- Tamamı büyük yazılan İngilizce/Türkçe satış adlarındaki `I/İ/ı/i` farklarının kullanıcı aramasını bozmasını önlemek için canlı adı normalizasyonu dotless-I toleranslı hale getirildi; belirsiz adların eşleşmemesi regresyon testinde korunuyor.
- Tam `pnpm verify` 46 başlıklı tamamlanmış paket için başarılı: TypeScript, yedi ekipman kategorili ve dört canlı sınıflı katalog akışı, 35 sağlık senaryosu, çoklu HTTPS kaynak/bakım denetimi ve 14 sayfalık üretim derlemesi geçti. Tetra grubu 23, rainbowfish grubu 11 doğrulanmış profile ulaştı.
- GitHub/Vercel: bu paket henüz gönderilmedi veya yayımlanmadı.
- Sonraki tek iş: Cikletist'in üç sayfalık Sazansıgiller kategorisindeki ticari adları mevcut biyolojik profillerle karşılaştırıp gerçek tür açıklarını güvenilir kaynaklarla doğrulamak.

## 2026-08-28 Cikletist Sazansıgiller karşılaştırması — ilk güvenilir tür paketi

- Kategorinin üç sayfasındaki güncel satış başlıkları çıkarıldı. Yerel mağaza bu aşamada yalnızca Türkiye'deki ticari adları tespit etmek için kullanıldı; bilimsel kimlik ve bakım eşikleri mağaza metninden alınmadı.
- İlk gerçek tür açığı paketi dört doğrulanmış profille tamamlandı: Sekiz bantlı barb (`Eirmotus octozona`), Daisy's Blue Ricefish (`Oryzias woworae`), Pacific Blue-eye (`Pseudomugil signifer`) ve Kırmızı fantom tetra (`Megalamphodus sweglesi`).
- Tür kimliği ve doğal boy bilgileri FishBase, Smithsonian'ın tür tanımlama yayını ve Australian Museum gibi bilimsel/kurumsal kaynaklarla; sürü, hacim, akvaryum uzunluğu ve su eşikleri Fishkeeper, Fishipedia ve bağımsız karşılaştırmalı bakım kaynaklarıyla çapraz doğrulandı. Her kayıt en az üç HTTPS kaynağa izlenebilir.
- Ticari ad eşleştirmeleri regresyon testine alındı. Grup toplamları tetra 24, barb 13, rainbowfish 12 ve killifish sekiz doğrulanmış profile ulaştı.
- Tam `pnpm verify` başarılı: TypeScript, katalog akışı, 35 sağlık senaryosu, kaynak/bakım denetimi ve 14 sayfalık üretim derlemesi geçti.
- Genel veya birden çok türe işaret edebilen `BIÇAK BALIKLARI`, `PUFFER BALIKLARI`, `Rasbora`, `GÖKKUŞAĞI GOBY`, `PIPE FISH NEEDLE` ve benzeri adlar bilimsel kimlik doğrulanmadan eşleştirilmeyecek.
- GitHub/Vercel: bu paket henüz gönderilmedi veya yayımlanmadı.
- Sonraki tek iş: Sazansıgiller envanterindeki kalan bilimsel olarak açık türleri küçük güvenilir paketlerle doğrulamak; belirsiz ve acı su/deniz gereksinimli adları mevcut tatlı su sağlık modeline zorla bağlamamak.

## 2026-08-28 Cikletist Sazansıgiller karşılaştırması — ikinci güvenilir tür paketi

- Canlı bakım verisinde kaynak sırası kesinleştirildi: yerel mağazalar yalnızca Türkiye'deki ticari adı ve bulunabilirliği gösterecek; bilimsel kimlik FishBase, kurumsal koleksiyonlar veya taksonomi yayınlarından, bakım eşikleri ise kurumsal ve köklü uzman kaynaklardan alınacak.
- Phoenix rasbora (`Boraras merah`), Asya kırmızı burun (`Sawbwa resplendens`) ve Yeşil ateş tetra (`Aphyocharax rathbuni`) güvenilir bilimsel ve bakım kaynaklarıyla eklendi. Her kayıt bilimsel kimlik, yetişkin boyu, minimum hacim/uzunluk, sürü sayısı, sıcaklık, pH ve özel bakım uyarılarıyla en az üç HTTPS kaynağa izlenebilir.
- Red Neon Blue-eye kaydındaki farklı bir `Pseudomugil` türüne ait eski kaynak kaldırıldı; doğru `Pseudomugil luminatus` FishBase, Fishkeeper ve Avustralya hükûmeti raporuyla bağlandı. Yetişkin boyu ve sürü eşiği güvenli profile göre düzeltildi.
- Kategoride bilimsel kimliği zaten açık olan 28 yerel satış adı mevcut doğru biyolojik profillere bağlandı. Renk/varyete adları yeni tür gibi çoğaltılmadı.
- `BIÇAK BALIKLARI`, `PUFFER BALIKLARI`, `Rasbora`, `GÖKKUŞAĞI GOBY`, `PIPE FISH NEEDLE`, `RED BELLY TETRA`, `TATLI SU DİL BALIKLARI`, `SİLVER ARGUS BALIKLARI` ve benzeri 19 belirsiz ya da mevcut tatlı su modeli açısından eksik adın tahminle eşleşmemesi regresyon testinde korunuyor.
- Tam `pnpm verify` başarılı: TypeScript, yedi ekipman kategorili ve dört canlı sınıflı katalog akışı, 35 sağlık senaryosu, kaynak/bakım denetimi ve 14 sayfalık üretim derlemesi geçti. Güncel gruplar tetra 25, rasbora 14 ve rainbowfish 12 doğrulanmış profildir.
- GitHub/Vercel: bu paket ve önceki yerel katalog değişiklikleri henüz gönderilmedi veya yayımlanmadı.
- Sonraki tek iş: Sazansıgiller listesindeki bilimsel adı açık kalan az sayıdaki türü aynı kaynak standardıyla tamamlamak; bilimsel kimliği veya tatlı/acı su gereksinimi kesinleşmeyen başlıkları çözülmemiş tutmak.

## 2026-08-28 Cikletist Sazansıgiller karşılaştırması — kategori tamamlandı

- Üç sayfadaki 64 satış başlığının tamamı tek bir envanter regresyonuna alındı. 42 başlık doğrulanmış biyolojik profile bağlandı; 22 başlık bilimsel kimliği, güvenli bakım eşiği veya tatlı/acı su modeli tamamlanmadığı için bilinçli olarak eşleşmeden bırakıldı.
- Ninja woodcat (`Tatia musaica`), Kırmızı karınlı piranha (`Pygocentrus nattereri`), Endlicheri bichir (`Polypterus endlicherii`) ve Monoculus peacock bass (`Cichla monoculus`) güvenilir bilimsel ve uzman kaynaklarla eklendi.
- Tatia için en az beşli grup, 60 litre/60 cm, gececilik, yumuşak kum ve küçük yavruları avlama riski; Natterer piranhası için altılı grup, 600 litre/200 cm, tür akvaryumu ve ciddi yaralanma riski işlendi.
- Endlicheri bichir için 75 cm yetişkin boyu, yaklaşık 2.000 litre/200 cm uzman sistemi, hava alma ve kaçış kapağı; Monoculus için 71 cm yetişkin boyu, 1.200 litre/200 cm uzman sistemi, güçlü filtrasyon ve doğaya bırakmama uyarıları görünür hale getirildi.
- `ALLIGATOR GAR TİMSAH BALIKLARI`, `BLUE AZUL PEACOCK BASS`, `PURPLE SPOTTED GUDGEON MOGURNDA BALIĞI`, `RED TAİLED HEMİODUS`, `SİLVER ARGUS BALIKLARI` ve diğer genel/çelişkili adlar yalnızca ticari addan bilimsel tür tahmin edilerek eşleştirilmedi.
- Tam `pnpm verify` başarılı: TypeScript, 64 başlıklı kategori regresyonu, yedi ekipman kategorili ve dört canlı sınıflı katalog akışı, 35 sağlık senaryosu, kaynak/bakım denetimi ve 14 sayfalık üretim derlemesi geçti. Güncel toplamlar bottom 64, monster 26, tetra 25, rasbora 14 ve rainbowfish 12 doğrulanmış profildir.
- GitHub/Vercel: bu kategori paketi ve önceki yerel katalog değişiklikleri henüz gönderilmedi veya yayımlanmadı.
- Sonraki tek iş: Cikletist'in sıradaki denetlenmemiş canlı kategorisini aynı güvenilir kaynak ve tam envanter regresyonu yöntemiyle karşılaştırmak.

## 2026-08-28 Cikletist Arowanalar karşılaştırması — kategori tamamlandı

- Arowanalar kategorisindeki dört satış başlığının tamamı regresyon kapsamına alındı. Üç ilan aynı biyolojik tür olan gümüş arowanaya (`Osteoglossum bicirrhosum`) bağlandı; satış boyunu ifade eden `UFAK` kaydı ayrı tür veya daha düşük yetişkin gereksinimi gibi değerlendirilmedi.
- Yerel mağaza yalnızca Türkiye'deki satış adlarını belirlemek için kullanıldı. Bilimsel kimlik ve 90 cm erişkin boy FishBase, bakım eşikleri Fishipedia ve B-Aqua, büyük yüzme alanı gereksinimi ise EMBRAPA yayınındaki Amazon süs balıkları rehberiyle çapraz doğrulandı.
- Eski 1.000 litre/250 cm gümüş arowana profili daha koruyucu yetişkin bakım eşiğine yükseltildi: en az 4.500 litre, 500 cm uzunluk, 24–28 °C ve pH 6–7,2. Güçlü sıçrama nedeniyle tam kapak, avcılık ve sıradan topluluk akvaryumuna uygun olmama uyarıları görünür hale getirildi.
- `AFRİKAN AROWANA` adı `Heterotis niloticus` ile ilişkili görünse de FishBase bilimsel boy verisini yayımlarken güvenilir uzman kaynaklarda yetişkin minimum akvaryum ve tam bakım eşikleri yeterince tutarlı bulunmadı. Yerel mağaza verisinden eşik uydurulmadı; kayıt güvenli doğrulama tamamlanana kadar bilinçli olarak eşleşmeden bırakıldı.
- Tam `pnpm verify` başarılı: TypeScript, dört başlıklı Arowanalar regresyonu, katalog akışı, 35 sağlık senaryosu, kaynak/bakım denetimi ve 14 sayfalık üretim derlemesi geçti.
- GitHub/Vercel: bu paket ve önceki yerel katalog değişiklikleri henüz gönderilmedi veya yayımlanmadı.
- Sonraki tek iş: Cikletist Monster Balık Türleri ana kategorisindeki satış başlıklarını mevcut yılan/müren, arowana ve büyük tür profilleriyle karşılaştırıp gerçek açıkları aynı güvenilir kaynak standardıyla tamamlamak.

## 2026-08-28 Cikletist Monster Balık Türleri ana kategori — güncel envanter tamamlandı

- Güncel Monster ana sayfasındaki 21 satış başlığının tamamı tek regresyon envanterine alındı. Yılanbaş, arowana, dikenli yılan balığı, fahaka, Astronot ve Flowerhorn tekrarları mevcut doğru biyolojik profillere bağlandı; satış sayfalarındaki tekrarlar ayrı tür gibi çoğaltılmadı.
- Astronot (`Astronotus ocellatus`) kaydı FishBase, Fishkeeper, bağımsız karşılaştırmalı bakım rehberi ve Güney Afrika çevre kurumunun çalışmasıyla güçlendirildi. 35 cm yetişkin boy, 300 litre/120 cm, 23–28 °C, pH 6–8, güçlü filtrasyon ve küçük canlıları avlama uyarıları izlenebilir kaynaklara bağlandı.
- Flowerhorn hibrit kaydı 400 litre/150 cm, 25–29 °C, pH 6–7,5, tek balıklı tür akvaryumu, yüksek biyolojik yük ve güvenli dekor gereksinimleriyle güncellendi. `Shortbody` satış formundaki yapısal sağlık riski görünür bakım uyarısına eklendi.
- `AFRİKAN AROWANA`, `ZİGZAK TARAK BALIKLARI`, `CHANNA GOLDEN LİMBATA`, `ÇİN EJDERİ`, `WHITE CHECK EEL MÜREN` ve çelişkili `CHANNA ASIATICA GÖKKUŞAĞI YILANBAŞ BLEHERİ` adlarının bilimsel kimlik veya mevcut tatlı su bakım modeli tamamlanmadığı için eşleşmemesi regresyonla korunuyor.
- Tam `pnpm verify` başarılı: TypeScript, 21 başlıklı Monster ana kategori regresyonu, katalog akışı, 35 sağlık senaryosu, kaynak/bakım denetimi ve 14 sayfalık üretim derlemesi geçti.
- GitHub/Vercel: bu paket ve önceki yerel katalog değişiklikleri henüz gönderilmedi veya yayımlanmadı.
- Sonraki tek iş: Monster alt kategorilerinden `Kedi Balıkları` ve ardından `Amerikan Tetra Monster` güncel envanterlerini aynı güvenilir kaynak standardıyla karşılaştırmak.

## 2026-08-28 Cikletist Monster alt kategorileri — tamamlandı

- Monster altındaki `Kedi Balıkları` kategori sayfasının güncel olarak ürün içermediği doğrulandı; eski veya başka kategorideki kayıtlar güncel satış ürünü gibi yeniden eklenmedi.
- `Amerikan Tetra Monster` kategorisindeki beş güncel başlığın tamamı regresyon envanterine alındı. Astronot, iki Flowerhorn ilanı ve Fahaka mevcut güvenilir bakım profillerine bağlandı.
- `ÇİN EJDERİ` satış adı birden fazla farklı büyük balık için kullanılabildiği ve mağaza bilimsel kimlik yayımlamadığı için bilinçli olarak eşleşmeden bırakıldı.
- Tam `pnpm verify` başarılı: TypeScript, Monster ana/alt kategori regresyonları, katalog akışı, 35 sağlık senaryosu, kaynak/bakım denetimi ve 14 sayfalık üretim derlemesi geçti.
- Monster bölümü güncel kategori yapısıyla tamamlandı. GitHub/Vercel henüz güncellenmedi.
- Sonraki tek iş: Cikletist'in henüz tamamlanmamış `Vatoz Kedi Balıkları` üç sayfalık envanterini güvenilir bilimsel ve kedi balığı uzmanı kaynaklarla karşılaştırmak.

## 2026-08-28 Cikletist Vatoz Kedi Balıkları — üç sayfalık envanter tamamlandı

- Üç güncel sayfadaki 56 satış başlığının tamamı tek regresyon envanterine alındı. 45 başlık doğrulanmış biyolojik profile bağlandı; 11 belirsiz başlık bilimsel kimlik veya güvenli yetişkin bakım eşiği tamamlanmadığı için bilinçli olarak eşleşmeden bırakıldı.
- Yerel mağaza yalnızca Türkiye'deki satış adlarını ve bulunabilirliği saptamak için kullanıldı. Balıkların bilimsel kimliği, erişkin boyu ve doğal gereksinimleri FishBase, GBIF/taksonomi kaynakları ve kurumsal yayınlardan; akvaryum eşikleri ise kurumsal veya köklü uzman kaynaklardan alındı.
- Pangasius köpek balığı (`Pangasianodon hypophthalmus`) 130 cm erişkin boy, 14.580 litre/450 cm koruyucu uzun süreli bakım eşiği ve açık `ev akvaryumuna uygun değildir` uyarısıyla eklendi. Pelajik/göçmen yapı, cama çarpma riski, yüksek biyolojik yük ve kamu akvaryumu/ısıtılmış kapalı havuz gereksinimi görünür hale getirildi.
- Siyah labeo (`Labeo chrysophekadion`) FishBase ve ABD Balık ve Yaban Hayatı Kurumu verileriyle 90 cm erişkin boy, 24–27 °C ve pH 6,5–7,5 olarak doğrulandı; 2.500 litre/360 cm uzman sistemi, aşırı bölgecilik ve standart topluluk akvaryumuna uygun olmama uyarıları eklendi.
- Kırmızı kuyruk kedi balığı (`Phractocephalus hemioliopterus`) kaydı bilimsel ve uzman ek kaynaklarla güçlendirildi; çok iri avcı, güçlü filtrasyon, güvenli kapak ve yalnızca dev uzman/kamu akvaryumu ölçeği uyarıları tamamlandı.
- `Borneo Kelebek Vatoz`, `RED LİP STİCK GOBBY`, `BLUE NEON GOBBY`, `JULLY`, `KÜREK BURUN`, `PANDA GARRARUFA`, L146, L148, L069, L103 ve `COLOMBİAN FARLOWELLA` adları yalnızca ticari addan tür tahmin edilerek eşleştirilmedi.
- Tam `pnpm verify` başarılı: TypeScript, 56 başlıklı Vatoz/Kedi Balıkları regresyonu, yedi ekipman kategorili ve dört canlı sınıflı katalog akışı, 35 sağlık senaryosu, kaynak/bakım denetimi ve 14 sayfalık üretim derlemesi geçti. Büyük tür grubu 28 doğrulanmış profile ulaştı.
- GitHub/Vercel: bu paket ve önceki yerel katalog değişiklikleri henüz gönderilmedi veya yayımlanmadı.
- Sonraki tek iş: Cikletist'in sıradaki denetlenmemiş canlı kategorisini aynı güvenilir tür kaynağı ve tam envanter regresyonu yöntemiyle karşılaştırmak.

## 2026-08-29 Cikletist Amerikan Cikletleri — kategori tamamlandı

- Üç güncel sayfadaki 53 satış başlığının tamamı tek envanter regresyonuna alındı. Argus'un acı su tür kimliği sonraki Malawi paketi sırasında doğrulandığı için 43 başlık doğrulanmış biyolojik profile bağlıdır; 10 genel, melez veya bilimsel kimliği açıklanmamış başlık tahminle eşleştirilmemiştir.
- Winemiller toprak yiyen ciklet (`Geophagus winemilleri`) ve Threadfin acara (`Acarichthys heckelii`) FishBase ile bilimsel olarak doğrulandı; ince kum, grup, taban alanı, güçlü filtrasyon ve küçük balıkları avlama riskleri görünür hale getirildi.
- Gerçek Altum melek (`Pterophyllum altum`) standart melekten ayrı profile alındı: en az dört birey, 450 litre/150 cm, en az 60 cm akvaryum yüksekliği, 27–31 °C ve çok yumuşak-asidik kararlı su gereksinimi işlendi. Kimlik FishBase, alan gereksinimi Flaman hükûmetinin hayvan refahı rehberiyle çapraz doğrulandı.
- Black Belt (`Vieja maculicauda`) 600 litre/180 cm ve tür akvaryumu; Persei/Pantano (`Cincelichthys pearsei`) 850 litre/244 cm, bitkisel beslenme ve çok yüksek biyolojik yük; Malawi Compressiceps (`Dimidiochromis compressiceps`) 680 litre/183 cm, bir erkek-birkaç dişi ve küçük balıkları avlama uyarılarıyla eklendi.
- Kadango (`Copadichromis borleyi`) bir erkek-dört dişilik harem için koruyucu 450 litre/120 cm; Super VC-10 Milomo (`Placidochromis milomo`) 1.000 litre/183 cm, sert-alkali su, açık kum ve sabit kayalık alan gereksinimleriyle tamamlandı.
- Dacrya (`Guianacara dacrya`) ve Owroewefi (`Guianacara owroewefi`) ayrı tür profillerine alındı; ince kum, mağara/kaya yarığı, sosyal grup, yumuşak su ve güçlü oksijen gereksinimleri işlendi. Gerçek Johanni (`Pseudotropheus johannii`) Maingano'dan ayrıldı ve yanlış eşleşme regresyonla engellendi.
- Gümüş Maskaheros (`Maskaheros argenteus`) 700 litre/200 cm tür akvaryumu; Elongatus Mpanga (`Chindongo elongatus`) 375 litre/120 cm, bir erkek-dört dişi ve kayalık Mbuna düzeniyle eklendi.
- Yerel mağaza sayfaları yalnızca Türkiye'deki satış adlarını belirlemek için kullanıldı. Bilimsel kimlik FishBase, ABD Balık ve Yaban Hayatı Kurumu ve taksonomi kaynaklarından; bakım eşikleri hükûmet rehberi veya yerleşik uzman kaynaklardan alındı.
- `Yeşil Teksas` (tür/hibrit belirsiz), `Sarı İmparator`, `Red Ruby Cichlid`, `Geophagus Hongdea`, genel `Malawi/Karışık Ciklet`, `ürün` ve boy-kalite başlıkları yanlış türe bağlanmadı. Bu 10 satış başlığının eşleşmemesi regresyonla korunuyor. `Argus Balıkları` ise FishBase ve OATA doğrulaması sonrasında ayrı acı su profiline bağlandı.
- Tam `pnpm verify` başarılı: TypeScript, 53 başlıklı Amerikan Cikletleri regresyonu, yedi ekipman kategorili ve dört canlı sınıflı katalog akışı, 35 sağlık senaryosu, kaynak/bakım denetimi ve 14 sayfalık üretim derlemesi geçti. Ciklet grubu 53 kaynaklı ve bakım verisi tam profile ulaştı.
- GitHub/Vercel: bu paket ve önceki yerel katalog değişiklikleri henüz gönderilmedi veya yayımlanmadı.
- Sonraki tek iş: Cikletist'in sıradaki henüz tamamlanmamış canlı kategorisini aynı tam envanter ve güvenilir kaynak yöntemiyle denetlemek.

## 2026-08-29 Cikletist Malawi Cikletleri — kategori tamamlandı

- Güncel sayfadaki 13 satış başlığının tamamı regresyon envanterine alındı. Dokuz başlık güvenilir biyolojik profile bağlandı; `Şeker Pembe Ciklet`, genel `Ciklet Balıkları`, `Ciklet M Boy A Kalite` ve tür/hibrit kimliği belirsiz `Yeşil Teksas` tahminle eşleştirilmedi.
- Sülfür Kafa Hap (`Otopharynx lithobates`) FishBase ve Malawi uzman kaynağıyla 350 litre/130 cm, bir erkek-birkaç dişi ve kayalık mağara gereksinimleriyle eklendi. Yaşayan Kaya/Livingston (`Nimbochromis livingstonii`) FishBase, Cichlid Room Companion ve Fishkeeper ile 680 litre/180 cm, avcılık ve tür akvaryumu uyarılarıyla eklendi.
- Ahli (`Sciaenochromis fryeri`) ve Yunus (`Cyrtocara moorii`) profillerinin bilimsel kaynakları FishBase'e yükseltildi; türe özel bakım kaynakları, grup, alan, avcılık ve Malawi suyu uyarılarıyla tamamlandı. Red Borley Kadango adı mevcut `Copadichromis borleyi` profiline güvenle bağlandı.
- Sayfada yanlış kategori altında bulunan Mono Argentus (`Monodactylus argenteus`) ve Green Argus (`Scatophagus argus`) ciklet gibi gösterilmedi. FishBase bilimsel kimliği ve veteriner onaylı OATA bakım rehberiyle ayrı acı su profilleri oluşturuldu: en az altılı grup, 600–680 litre, 180 cm, güçlü akıntı/oksijen ve erişkin dönemde yüksek tuzluluk veya deniz suyu gereksinimi açıkça işlendi.
- Yerel satış sayfası yalnızca güncel Türkçe ticari ad envanteri için kullanıldı; bilimsel kimlik, erişkin boyu, davranış, su ve alan gereksinimleri yerel mağaza metninden alınmadı.
- Tam `pnpm verify` başarılı: TypeScript, 13 başlıklı Malawi regresyonu dahil katalog akışı, 35 sağlık senaryosu, kaynak/bakım denetimi ve 14 sayfalık üretim derlemesi geçti. Ciklet grubu 55, acı su türlerini içeren `other` grubu yedi kaynaklı ve bakım verisi tam profile ulaştı.
- GitHub/Vercel: bu paket ve önceki yerel katalog değişiklikleri henüz gönderilmedi veya yayımlanmadı.
- Sonraki tek iş: sıradaki eksik `Cüce Cikletler` kategorisini aynı bilimsel kimlik ve güvenilir bakım kaynağı yöntemiyle denetlemek.

## 2026-08-29 Cikletist Cüce Cikletler — kategori tamamlandı

- İki güncel sayfadaki 26 satış başlığının tamamı envanter regresyonuna alındı. Yerel mağaza sayfaları yalnızca Türkiye'deki satış adlarını belirlemek için kullanıldı; bilimsel kimlik FishBase, bakım eşikleri Fishkeeper, Practical Fishkeeping ve tür bazlı TankBud sayfalarıyla çapraz doğrulandı.
- Hongsloi, Borellii Opal, Nijsseni, Baenschi, Macmasteri, Erythrura, Trifasciata, Panduro ve Mendezi için ayrı biyolojik profiller eklendi. Ramirezi renk/yüzgeç varyantları, Electric Blue Acara ve Agassizii Rio Miua mevcut doğru tür profillerine takma ad olarak bağlandı; renk varyantları yeni tür gibi çoğaltılmadı.
- Sajica'nın cüce ciklet olmadığı doğrulandı ve `Amatitlania sajica` olarak 150 litre/90 cm, çift, orta akıntı ve üreme bölgeciliği uyarılarıyla ayrı profile eklendi.
- 26 başlığın 24'ü doğrulanmış profile bağlıdır. `Apistogramma commbrae` güvenilir tür bazlı minimum akvaryum eşiği tamamlanmadığı için, `Ocellaris Peacock Bass` ise 74 cm'lik dev avcı için litre ile fiziksel uzunluk eşiği aynı güvenilirlik düzeyinde tamamlanmadığı için tahminle eşleştirilmedi.
- Tam `pnpm verify` başarılı: TypeScript, 26 başlıklı Cüce Cikletler regresyonu dahil katalog akışı, 35 sağlık senaryosu, kaynak/bakım denetimi ve 14 sayfalık üretim derlemesi geçti. Cichlid grubu 65 kaynaklı ve bakım verisi tam profile ulaştı.
- GitHub/Vercel'e gönderim yapılmadı. Sonraki tek iş: sıradaki eksik Tropheus/Tanganika canlı kategorilerini aynı yöntemle denetlemek.

## 2026-08-29 Cikletist Tropheus/Tanganyika — kategori tamamlandı

- Kategorideki 5 güncel satış başlığının tamamı regresyon envanterine alındı; 4 başlık doğrulanmış bilimsel/bakım profiline bağlandı.
- `İkola Kaiser Tropheus` ve `Tropheus Black Kriza` için ayrı, kaynaklı profiller eklendi. `Kiriza Gold`, ayrı tür gibi çoğaltılmadan Kiriza'nın üretim renk formuna bağlandı; `Demasoni Balıkları` mevcut bilimsel profile eşlendi.
- Yerel mağaza yalnızca Türkçe satış başlıklarını karşılaştırmak için kullanıldı. Kimlik ve bakım eşikleri Ciklid.org, Cichlid Room Companion, Fishkeeper, Zoopet ve hakemli Tropheus taksonomi çalışmasıyla doğrulandı.
- `Tropheus Red Belly` ticari adı birden fazla doğal form/melez için kullanılabildiğinden tahminle eşleştirilmedi ve güvenli biçimde çözülmemiş bırakıldı.
- Tam `pnpm verify` başarılı: TypeScript, 5 başlıklı Tropheus/Tanganyika regresyonu dahil katalog akışı, 35 sağlık senaryosu, kaynak/bakım denetimi ve 14 sayfalık üretim derlemesi geçti. Cichlid kataloğu 67 kaynaklı ve bakım verisi tam profile ulaştı.
- GitHub/Vercel'e gönderim yapılmadı. Sonraki tek iş: sıradaki eksik canlı kategorisini aynı güvenli kaynak yöntemiyle denetlemek.

## 2026-08-29 GitHub devir hazırlığı — katalog kapasite ve canlı paketi

- Görev dalı: `codex/catalog-capacity-batch`. GitHub'da bu paketle ilişkilendirilmiş açık bir Issue bulunmadı; mevcut dal korunarak devredilecek.
- Devir kapsamı yalnızca `PROJECT_STATUS.md`, `scripts/audit-catalog.cjs`, `scripts/test-catalog-flow.cjs`, `src/data/catalog-equipment-hardware.ts`, `src/data/catalog-species-expanded.ts` ve `src/data/catalog.ts` dosyalarıdır.
- Kullanıcıya ait izlenmeyen `Codex Görseli 27 Ağu 2026 02_52_04.png` dosyası kapsam dışıdır ve commit'e eklenmeyecektir.
- Devir öncesi tam `pnpm verify` başarılıdır; son uzak commit bilgisi push tamamlandıktan sonra devir mesajında bildirilecektir.
- `main` birleştirmesi ve Vercel yayını bu devir kapsamında değildir. Canlı uygulama `https://aqua-mind-three.vercel.app/` bu yerel katalog paketini henüz içermez.

## 2026-08-29 Cikletist Karides/Kerevit — iki sayfalık kategori tamamlandı

- Birinci sayfadaki güncel 24 satış başlığı ile kategori bağlantısında bulunan ikinci sayfadaki dokuz satır birlikte regresyon envanterine alındı. İkinci sayfada tekrar listelenen Amano karides ve Diminutus kerevit satırları da sayfa yapısını birebir korumak için test kapsamındadır.
- Kırmızı Rili, Turuncu Rili, Karbon Rili, Yeşil Jelly ve Çikolata renk formları ayrı tür gibi gösterilmeden `Neocaridina davidi` bilimsel kimliğiyle eklendi. Kimlik ve bakım verisi Aquarium Co-Op, Aquairi, Shrimp Science, Buce Plant ve uzman karides kaynaklarıyla; Türkiye'deki tam satış adları Cikletist sayfalarıyla doğrulandı.
- Sakura, Bloody Mary, Yellow Fire, Black Rose, Blue Angel, Blue Jelly, Blue Bolt, Tiger, PRL, Black Pinto, Black/Red Fancy, Snow White, Amano ve Diminutus satış adları mevcut doğru biyolojik profillere bağlandı.
- 33 satış satırının 24'ü güvenilir profile bağlıdır. Tür belirtmeyen `Amerikan Kerevitleri`, stok içeriği değişen karışık paket, renk kimliği belirsiz genel Pinto/Galaxy adları ile akvaryum yerine kara alanlı paludaryum gerektiren dört vampir yengeç başlığı mevcut sağlık modeline tahminle bağlanmadı.
- Tam `pnpm verify` başarılıdır: TypeScript, 33 satırlık Karides/Kerevit regresyonu, 43 karides ve 4 kerevit profilinin kaynak/bakım denetimi, 35 sağlık senaryosu ve 14 sayfalık üretim derlemesi geçti.
- GitHub/Vercel'e bu yeni paket için gönderim yapılmadı. Canlı uygulama bu değişiklikleri henüz içermez.
- Sonraki tek iş: Cikletist Salyangoz Türleri kategorisini aynı tam envanter ve güvenilir kaynak yöntemiyle denetlemek.

## 2026-08-29 Cikletist Salyangoz Türleri — kategori tamamlandı

- Kategori sayfasındaki 10 satış başlığının tamamı tek regresyon envanterine alındı. Ramshorn, Poso Orange Rabbit, Helena/Katil, Yeşil Boynuzlu Nerite ve Zebra Nerite başlıkları doğrulanmış mevcut bakım profillerine bağlandı.
- Beş güvenli eşleşmeye ürün sayfasının tam Türkçe satış adı ve Cikletist bağlantısı eklendi. Zebra Nerite profilinin ana bakım kaynağı, sıcaklık, alkali su, erişkin boy ve bakır hassasiyetini açıkça yayımlayan Fishkeeper tür sayfasına yükseltildi.
- `Elma Salyangozu` adı birden çok `Pomacea` türünü; `Tatlı Su Midyesi` adı birden çok familyayı kapsayabildiği için bilimsel kimlik tahmin edilmedi. `Spotted Nerite Çeşitleri` karışık ürün olduğu için tek türe bağlanmadı.
- `Tricolor Horn` kaynaklarda hem `Clithon corona` hem `Clithon diadema` adıyla satılıyor; `Ring Snail` ise bilimsel kaynak ve resmî ticaret değerlendirmelerinde yalnızca `Nerita/Neritina sp.` düzeyinde kalıyor. Bu iki başlık kesin türe zorlanmadı.
- Tam `pnpm verify` başarılıdır: TypeScript, 10 satırlık salyangoz güvenlik regresyonu, yedi ekipman kategorili katalog akışı, 35 sağlık senaryosu, kaynak/bakım denetimi ve 14 sayfalık üretim derlemesi geçti.
- GitHub/Vercel'e gönderim yapılmadı; canlı uygulama bu değişiklikleri henüz içermez.
- Güncel Cikletist kategori ağacıyla karşılaştırmada kalan son grup `Tuzlu Su Canlıları`dır. Sayfada palyaço balıkları yanında anemon, deniz hıyarı, nudibranch ve denizyıldızı bulunduğundan; mevcut tatlı su ağırlıklı modelde tuzluluk ve deniz akvaryumu türü olmadan bu kayıtlar eklenmeyecektir.
- Sonraki tek iş: tuzlu su desteğini bu sürüme ekleme veya sonraki faza erteleme ürün kararını almak; eklenirse önce akvaryum türü/tuzluluk veri modelini ve sağlık analizini tasarlamak.

## 2026-08-29 Netlea hava motorları — kapasite paketi tamamlandı

- Netlea No.2B ve No.3B için ürün sayfasındaki model bazlı değerler, aynı ürün ailesinin NETLEA markalı teknik tablo görseliyle karşılaştırıldı. No.2B 10 L/dakika (600 L/saat), azami 6,5 W, 0,020 MPa ve 3550 mAh/17,75 Wh; No.3B 12 L/dakika (720 L/saat), azami 9,5 W, 0,024 MPa ve 9750 mAh/48,75 Wh değerleriyle otomatik hava kapasitesi hesabına alındı.
- Genel `No.4B` kaydının tek bir cihaz olmadığı, teknik tabloda `Q2/4` ve `Q9/4` olarak iki alt modele ayrıldığı doğrulandı. Q2/4 16 L/dakika (960 L/saat), 0,027 MPa; Q9/4 14 L/dakika (840 L/saat), 0,022 MPa değerleriyle ayrı katalog kayıtlarına dönüştürüldü. İki alt model de azami 9,5 W, iki çıkış ve 14600 mAh/73 Wh batarya verisini taşıyor.
- G1, G2 ve Flower Cartridge ön filtrelerine motor debisi atanmadı. Bu üç pasif bileşen `passiveComponent` ile işaretlendi; otomatik filtrasyon hesabına tek başına katılmıyor ve katalog denetiminde motorlu kapasite eksiği olarak sayılmıyor.
- Hedefli katalog akışı ve denetimi başarılıdır. Netlea 65 ekipman ve 12 bakım ürününe ulaştı; motorlu kapasite gerektiren 14 kaydın 14'ü hazırdır (%100).
- GitHub/Vercel'e gönderim yapılmadı; canlı uygulama bu paketi henüz içermez.
- Nubios NW-450F, NW-600F, NW-800F, NW-1500F ve NB-1500F ürün sayfalarındaki kutu teknik tabloları incelendi. Sırasıyla 450, 600, 800, 1500 ve 1500 L/saat debi; 4, 6, 15, 20 ve 20 W güç değerleri doğrudan modele ait ambalajdan doğrulanarak otomatik filtrasyon hesabına alındı. Ambalajda ayrıca 0,6; 0,8; 1,0; 1,2 ve 1,2 m azami basma yüksekliği yayımlanıyor.
- YU-118C ve YU-119C için kendi motorlu sünger filtre yapısı ve ürün ailesinin 5 W gücü doğrulandı; ancak model bazlı debi yayımlanmıyor. Başka modele ait 450 L/saat değerini kopyalayan hatalı satıcı metni kullanılmadı; iki ürün güvenli biçimde otomatik filtrasyon hesabının dışında kaldı.
- Hedefli katalog akışı ve denetimi başarılıdır. Nubios'ta motorlu kapasite gerektiren 16 kaydın 14'ü hazırdır (%88); kalan iki kayıt yalnızca yayımlanmamış YU-118C/YU-119C debileridir.
- GitHub/Vercel'e gönderim yapılmadı; canlı uygulama bu paketi henüz içermez.
- Sonraki tek iş: Resun'un kapasite denetiminde eksik görünen modellerini seri aileleri halinde doğrulamak; yalnızca yayımlanmış model bazlı teknik verileri otomatik hesaba almak.
- Resun'un 12 resmî filtre seri sayfasındaki görsel teknik tablolar doğrudan incelendi. BC, EFC, GF, CX, CS, MAGI, HS, CY, BF, EVF ve EF/Xtreme ailelerindeki 29 modelin model bazlı debi ve güç değerleri; tabloda varsa önerilen akvaryum aralıkları ve EF1600U/EF2800U için 220–240 V sürümündeki 11 W UV gücü işlendi.
- Türkiye kaynağında yalnızca 340 L/saat debiyle kayıtlı CX-400, resmî tabloda yayımlanan 5,5 W ve 38–57 litre aralığıyla tamamlandı. Resun'un kapasite gerektiren 75 kaydında otomatik hesaba hazır kayıt sayısı 15'ten 44'e yükseldi; filtre ailesindeki bu paket %100 hazırdır.
- Hedefli katalog akışı ve kapasite denetimi başarılıdır. GitHub/Vercel'e gönderim yapılmadı; canlı uygulama bu paketi henüz içermez.
- Sonraki tek iş: Resun'un 22 hava motoru ve dokuz ısıtıcı kaydındaki resmî görsel teknik tabloları model bazında işlemek.
- Resun HCB, HCA, AP, HLP, DC, PLP, NLP ve QSW/QSB hava motoru ailelerinin dokuz resmî seri sayfasındaki teknik tablolar işlendi. 22 mevcut kaydın debi ve güçleri tamamlandı; HCA2000 ve HCA3000 seri tablosunda doğrulanıp eksik katalog modelleri olarak eklendi. DC120/DC160 için yayımlanan 80/120 litre üst sınırları da otomatik hava kapasitesi hesabına alındı.
- Hava debileri yalnızca tabloda yayımlanan birimlerden dönüştürüldü: L/dakika değerleri 60 ile çarpıldı, çift çıkış tablolarındaki toplam debi açıkça toplandı. NLP200'de Türkiye'nin 220–240 V sürümüne ait 14.000 L/saat değeri kullanıldı.
- Hedefli katalog akışı ve kapasite denetimi çalıştırılmayı bekliyor. GitHub/Vercel'e gönderim yapılmadı.
- Sonraki tek iş: Resun'un dokuz ısıtıcı kaydındaki resmî görsel teknik tabloları model bazında işlemek.
- Resun'un Sunlike, Digital Smart, Thermo, Rising Heat, Delta, HT Mini ve MH ısıtıcı ailelerinin yedi resmî sayfasındaki model tabloları işlendi. Kullanıcının seçemeyeceği altı genel “Series” kaydı kaldırılıp SUNLIKE25–300, DSH100–300, TM25–300, RH9000 25–300W, DT50–300, HT10/HT25 ve MH75/MH150/MH250 olmak üzere 36 gerçek varyanta ayrıldı.
- Her varyant yayımlanmış güç ve hacim sınırını taşıyor. HT ve MH tablolarındaki sıcaklık artışının akvaryum hacmi ile değiştiği bilgi açıklamasında korundu; olmayan bir sıcaklık performansı tahmin edilmedi.
- Resun filtresi, hava motoru ve ısıtıcı kapasite paketi tamamlandı. Resun 209 ekipman ve beş bakım ürününe ulaştı; kapasite gerektiren 104 kaydın 104'ü otomatik hesaba hazırdır (%100).
- `pnpm verify` 2026-08-29 tarihinde başarılı: TypeScript, yedi ekipman kategorili ve 610 bakım ürünlü katalog akışı, 35 sağlık senaryosu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti.
- GitHub/Vercel'e gönderim yapılmadı; canlı uygulama bu paketi henüz içermez.
- Sonraki tek iş: Jeneca'nın kapasite denetiminde eksik görünen filtre, hava motoru ve ısıtıcı kayıtlarını seri aileleri halinde resmî/güvenilir teknik tablolardan doğrulamak.
