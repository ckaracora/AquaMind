# 0039 — Veri dondurma

- Tarih: 2026-11-11
- Durum: Kabul edildi. Dondurma ürün sahibinin (`buraksenfx`) kararıdır: 2026-11-03'te veri testi ve düzeltmeden sonra dondurulması (karar 0036, 3. madde), 2026-11-11'de "Önce Chrome oturumu, sonra dondur". Dondurmadan sonra neye izin verildiği teknik karardır (Claude). Kayıt `codex/data-test-2` dalında.
- Dayanak: karar 0036 (aşama sırası, 3 aylık yenilemenin ertelenmesi), karar 0020 (3 aylık yenilemenin yöntemi), ürün sahibinin 2026-11-11 sohbet yanıtı, `docs/CATALOG_LOG.md` 2026-11-11 bölümleri, `docs/DATA_COVERAGE.md` (ölçüm 2026-11-11), `PROJECT_STATUS.md` ("Veri testi" ve "Uyarı motoru 1.14.0" bölümlerinin açık işleri), karar 0037 ("Açık işler"), Codex'in 2026-11-11 kontrol raporu (depo dışındaki çalışma dosyası; bulguları `docs/CATALOG_LOG.md` → "2026-11-11 — Codex kontrolü" bölümünde).

## Bağlam

- Karar 0036'nın aşama sırasında veri iki aşamadır: 1. gerekenler; 2. veri testi ve düzeltme, ardından veri dondurulur. 3. aşama ad ve tasarımdır.
- Yapılanlar:
  - gerekenler (PR #82–#86);
  - veri testi ve düzeltmeleri (PR #87, `b2fe83c`);
  - uyarı motoru 1.14.0 (karar 0037, PR #88, `4fd4872`);
  - ürün sahibiyle 2026-11-11 Chrome oturumu, kardeş kayıtlar, son dört açık ve JBL PROTEMP S birleştirmesi (karar 0038), Codex kontrolüyle (`7fc4031`, fikstür `cc10d3f`).
- Dondurma anındaki kapsam (`docs/DATA_COVERAGE.md`, ölçüm 2026-11-11): 443 canlı, 3535 ekipman, 1893 bakım ürünü, 141 bitki.

## Ürün sahibinin kararları

1. **2026-11-03** (karar 0036, 3. madde): veri testi ve düzeltmeden sonra veri dondurulur. Sözü: "en sona artık veri çekmeyeceğiz".
2. **2026-11-04** (karar 0036, 3. madde; karar 0020, "Durum"): 3 aylık bilgi yenilemesi yayına kadar ertelendi. Tasarım ve uygulama aşamalarında veri çekilmez; ilk tur uygulama mağazaya çıktıktan sonra yapılır.
3. **2026-11-11** (sohbet yanıtı): "Önce Chrome oturumu, sonra dondur". Chrome oturumu aynı gün yapıldı (`docs/CATALOG_LOG.md` → "2026-11-11 Ürün sahibiyle Chrome oturumu …"). Açılmayan sayfalar için kararı: "Atla, oturumu bitir" (aynı bölüm, "Açılamayanlar ve atlananlar").

## Karar: ne donduruldu

- **Katalog kapsamı.** `src/data` altındaki canlı, ekipman, bakım ürünü ve bitki katalogları bugünkü kayıtlarıyla kalır.
  - Yeni kayıt açılmaz.
  - Yeni veri çekilmez: kaynak taraması yok, mağaza ya da üretici sayfaları toplu okunmaz, yeni kaynak ailesi eklenmez.
- Aşağıdaki açıklar dondurmayla kapanmaz; "bilinen açık" olarak kalır. Oranlar `docs/DATA_COVERAGE.md`'de görünür.
- Bu karar katalog verisini dondurur. Kullanıcı verisi, uyarı motoru ve arayüz bu kararın konusu değildir; motor değişikliği kendi kuralıyla (karar belgesi, kural seti sürümü, ayrı fikstür commit'i, ürün sahibinin onayı) yürür.

## Teknik karar: dondurmadan sonra izin verilenler (Claude)

1. **Kaynakla kanıtlanan hata düzeltmesi.**
   - Katalogdaki bir değerin ya da metnin kaynağıyla çeliştiği, kaynağın okuma alıntısıyla gösterilirse düzeltilir.
   - Kurallar aynen geçerlidir (`AGENTS.md`, `docs/DATA_SOURCES.md`): değer tahmin edilmez, kaynakta olmayan eklenmez, eski kaynak izi korunur.
   - Değişiklik ve alıntı `docs/CATALOG_LOG.md`'ye, oran değişirse `docs/DATA_COVERAGE.md`'ye yazılır. Sağlık sonucu değişirse altın fikstür ayrı commit'te yeniden üretilir.
   - Düzeltme yeni kayıt açmaz, yeni kaynak taraması başlatmaz.
2. **Ürün sahibinin açıkça istediği ekleme.**
   - Yeni kayıt ya da alan yalnız ürün sahibi açıkça isterse eklenir. İsteği tarih ve sözüyle `docs/CATALOG_LOG.md`'ye yazılır.
   - Kaynak kuralları aynen geçerlidir.
   - Bilinen örnek: nerite'nin acı suya açılması (ürün sahibinin 2026-11-11 kararı, sonraki motor işi; aşağıda).
3. **3 aylık yenileme, yayından sonra.** Karar 0020'nin yöntemiyle (teknik sonuç 5): kaynak bağlantılarının açılıp açılmadığı, değerlerin değişip değişmediği ve kullanıcı önerileri kontrol edilir; sonuç `docs/CATALOG_LOG.md`'ye yazılır. İlk tur yayından sonradır (karar 0036). Aşağıdaki bilinen açıklar bu turda yeniden ele alınır.

- Bunların dışındaki her veri işi önce ürün sahibine sorulur.
- Dondurmadan sonraki her katalog değeri değişikliği riskli iş sayılır: yazandan farklı bir kontrolcü ve son kapı (`pnpm verify`) gerekir.
- Mevcut kayıtların metinlerinin başka dile çevrilmesi yeni kayıt ya da yeni veri sayılmaz.

## Bilinen açıklar (dondurma anında)

Her madde kaynağıyla. Satır numaraları bu kararın commit'indeki hâle göredir (2026-11-11).

### Katalog verisi

| Açık | Bugünkü durum | Kaynak |
|---|---|---|
| Ninja woodcat'in 56 L'si ve "60 × 30 × 30 cm / yaklaşık 56 litre" bakım metni | Kabul edilen kaynak (Welsfans) hacmi doğrulamıyor; değer kaldı, tarih 2026-10-02 | `docs/CATALOG_LOG.md`:4191 |
| Fluval Iodine A8264 ve Turtle Pellets A6592'nin açıklama parçaları ("yoğun takviye", "doğal deniz suyundaki orana göre", "yumurta ve kabuk desteği için") | Alıntıyla doğrulanmadı; metin kaldı, tarih 2026-09-29 | `docs/CATALOG_LOG.md`:4189 |
| Oase BioMaster² Thermo 150'nin `adjustableFlow` alanı | INT sayfası okumasında görülmedi; alan kaldı, tarih 2026-09-09 | `docs/CATALOG_LOG.md`:4190 |
| Okunamayan eski PROFLORA setleri (m501, m502, m503, m2003, m500, m500 SILVER, m2000 SILVER, u95, u95 3x, u500, 3 x u500) | Güvenlik cümleleri kaynağa karşı okunamadı; cümleler ve tarihler değişmedi | `docs/CATALOG_LOG.md`:4160 (ayrıntı :4146) |
| NanoBel'in ağırlığı (15/16 g) | Arşiv ürün sayfası 15 g, eski kataloglar 15/16 g; çelişki açıklamada yazılı, tek değer seçilmedi | `docs/CATALOG_LOG.md`:4187 |
| NovoRed Refill sayfasındaki "1 l"nin anlamı | Çözülmedi; hacim ve ağırlık eklenmedi | `docs/CATALOG_LOG.md`:4186 |
| NanoTabs ve NanoBel'in ana kaynak bağlantısı | Eski JBL adresi JBL'in ürün listesine yönleniyor; arşiv kopyası ek kaynak | `docs/CATALOG_LOG.md`:3995 |
| Chrome oturumunda açılmayan kayıtlar | Atlanan 10 kayıt (sertifika uyarısı geçilmedi: Resun 3, Chihiros forumu 2, Haqos 1; Cloudflare doğrulaması istenmedi: tarapet 1, manuals.plus 1, FishBase.org 2) ve açılamayan 4 kayıt; tarihleri değişmedi | `docs/CATALOG_LOG.md`:4012–4013 |
| Calvus'un 350 L'si | Kaynaksız | `PROJECT_STATUS.md`:2066 |
| Fishkeeper ciklet kayıtlarında 4 ft = 120 mi 122 cm mi | Açık | `PROJECT_STATUS.md`:2066 |
| Betanın sıcaklık aralığı | Bir sonraki yenilemede Seriously Fish önceliğiyle bakılacak | `PROJECT_STATUS.md`:2066 |
| Electric blue hap'te Seriously Fish ek kaynak olunca boy, sıcaklık ve pH farkı; arı gobisinde tür akvaryumu işareti | Açık | `PROJECT_STATUS.md`:2066 |
| JBL'in eski adresli 442 bakım kaydı | Kaynak bağlantısı eski adreste | `PROJECT_STATUS.md`:2069 |
| Sobo WP-500D/700D ile Aquawing AQ-ECO 2000/3000/4000'in ürün sayfaları | Bağlanmadı | `PROJECT_STATUS.md`:2069 |
| Çözülmemiş 68 satış adı | Mağaza sayfalarında bilimsel ad ya da bakım bilgisi yok; kural gereği çözülmez | `PROJECT_STATUS.md`:2011; karar 0036, 2. madde |
| Kiriza Tropheus | Ana kaynağı kabul listesinde değil | karar 0036, 2. madde; `PROJECT_STATUS.md`:1623 |
| JBL PROTEMP S 26/51/151/301 adları | JBL'de bu adla sayfa bulunamadı; yalnız eski katalog adı olarak eş ad | `docs/CATALOG_LOG.md`:4081 |
| Önceki nesil Oase BioMaster 250/350/600 | Değerler hesaptan çekili (karar 0019); kaynak bulunursa geri gelebilir | `docs/CATALOG_LOG.md`:4105–4106 |

### Kullanıcı verisi

| Açık | Bugünkü durum | Kaynak |
|---|---|---|
| Eski akvaryum seçimi hatasıyla örnek akvaryumun kimliğine (`aqua-1`) ya da boş kimliğe yazılmış olabilecek yetim kayıtlar | Hata 2026-11-11'de düzeltildi (`19c03e9`): seçim her çizimde güncel listeden türetiliyor; yeni kayıt artık listede olmayan (ilk çizimdeki örnek veriden kalan) ya da boş bir akvaryum kimliğiyle yazılmıyor. Önceden yazılmış olanlar otomatik silinmez; var olmayan akvaryuma bağlı kayıt yetim sayılır ve ayarlar sayfasının özetinde raporlanır. Yayından sonra ayrı iş | `src/app/water/page.tsx`:49–51, `src/app/maintenance/page.tsx`:29–31, `src/app/plants/page.tsx`:25–27 (seçili akvaryum açıklaması); karar 0006, "Saklama ve yetim kayıtlar" |

### Uyarı motorunun bilinen sınırları

| Açık | Bugünkü durum | Kaynak |
|---|---|---|
| Tropikal eşiği 23 °C kaynaksız | Lepistes (20–28 °C) ve neon (21–25 °C) tropikal sayılmıyor; B14'te soğuk su uyarısı, B22'de ısıtıcı uyarısı çıkmıyor | karar 0037, "Açık işler" (149–150. satırlar) |
| Soğuk su grubunun kapsamı | `group:"coldwater"` yalnız 7 kayıtta | karar 0037, "Açık işler" (152. satır) |
| Balık dışı canlılar için fırsatçı avcılık | Kapsam ve şiddet modeli açık motor işi | `PROJECT_STATUS.md`:2067 |
| Sünger filtre kapasitesi | Hava motorlu sünger filtre hacimden bağımsız "hazır" sayılıyor | karar 0037, "Açık işler" (153. satır) |
| Sarı uyarıların genel duruma etkisi | Karar 0037'nin kapsamında değil | karar 0037, "Açık işler" (154. satır) |
| Nerite'nin acı suya açılması | Ürün sahibinin 2026-11-11 kararı: tuzluluk ölçümü yalnız acı ve tuzlu su akvaryumunda istensin, nerite acı suya açılsın. Sonraki motor işi; aralığın alt sınırı yazılı kurala bağlanmalı. Kayıt bugün yalnız tatlı su | `docs/CATALOG_LOG.md`:4021–4022 |

## Değerlendirilen seçenekler

- **Açıklar kapanmadan dondurmamak:** açıkların çoğu kaynağın açılmamasına ya da kaynağın yazmamasına bağlı; yeni araştırma veri aşamasını uzatırdı. Ürün sahibi dondurmayı veri testinden ve Chrome oturumundan sonraya koydu. Seçilmedi.
- **Hata düzeltmesini de yasaklamak:** kaynakla kanıtlanmış yanlış bir değer, yayına kadar kullanıcıya yanlış uyarı ya da yanlış hesap verirdi. Seçilmedi.

## Geri alma

Dondurma bir çalışma kuralıdır, kodda karşılığı yoktur. Ürün sahibi yeni veri işi isterse bu karar o iş için açılır ve isteği `docs/CATALOG_LOG.md`'ye yazılır.
