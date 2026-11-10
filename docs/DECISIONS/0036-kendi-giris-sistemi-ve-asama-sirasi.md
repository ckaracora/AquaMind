# 0036 — Kendi giriş sistemi ve aşama sırası

- Tarih: 2026-11-03
- Durum: Kabul edildi (ürün sahibi `buraksenfx`, 2026-11-03). Karar 0003'ün Supabase seçimi ve karar 0020'nin sırası bu kararla değişir. Karar 0032, 0033 ve 0034'ün Supabase'e bağlı kısımları bırakıldı; neyin kaldığı aşağıda ("Ne kalır, ne bırakılır").
- Dayanak: ürün sahibinin 2026-11-03 sohbet mesajları, iki soru penceresinin yanıtları ve 2026-11-04'teki yenileme sorusunun yanıtı; karar 0020 (yol haritası), 0032–0034 (hesaplar 1A ve 1B), `docs/SECURITY.md`.

## Ürün sahibinin kararları (2026-11-03)

1. **Supabase kullanılmayacak.** Giriş sistemi kendimizce kurulacak; giriş yolları e-posta, Google, Apple ve Facebook. Ürün sahibinin sözü: "Database'i dışarı çıkartmak istemiyorum." Bunun başka bir şirkete emanet etmemek mi, Türkiye dışına çıkarmamak mı olduğu soruldu, yanıtlanmadı; barındırma yeri 4. aşamada birlikte kararlaştırılacak.
2. **Önce veri işi bitecek**, sonra öteki işler ("yoksa kopuyorum projeden"). Kapsam "Gerekenler":
   - Claude'un tek başına yaptıkları: bitkilerin İngilizce ortak adları ve Trendyol'a bağlı 24 ekipman kaydı.
   - Ürün sahibiyle birlikte yapılanlar (sayfaları o kendi tarayıcısında açar, Claude okur): çözülmemiş 68 satış adı ile Resun (172 kayıt), Fluval (87) ve Haqos (38) sayfaları.
   - Kalan eksikler "kaynakta yok" diye kapanır. Bunlar JBL'in hesaba girmeyen eski adresli 69 kaydı ve kaynağın yazmadığı alanlar (canlılarda tank uzunluğu, akıntı ve bakım notu; bitkilerde sıcaklık ve pH; ekipmanda hesap değeri). `docs/CATALOG_SOURCE_GAPS.md`'deki "geliştirilecek" listeleri de 2026-10-20 kararıyla bugünkü değerleri ve kaynaklarıyla kalır: kabul edilen uzman kaynaklarda tür düzeyinde bakım sayfası bulunamayan ya da kimlik sorusu olan 16 balık; kabul edilen kaynaklarda sayfası olmayan, değerlerinin bir kısmı bulunamayan (ör. Pagoda salyangozunda sıcaklık, pH ve akvaryum) ya da tür kimliği olmayan 11 omurgasız; ana kaynağı kabul listesinde olmayan Kiriza.
3. **Sonra veri testi**, ardından veri dondurulur ("en sona artık veri çekmeyeceğiz"). Test üç parçadır: yeni bir örneklemin kaynağıyla karşılaştırılması; 25–30 gerçekçi akvaryum senaryosunda uyarıların okunması (yanlış uyarı, kaçan uyarı, anlaşılmayan metin); ürün sahibi için "neyi veriyor, neyi vermiyor" sayfası. Uzman değerlendirmesi olmayacak ("Hayır, siz yapın"): senaryoları Claude hazırlar, Codex denetler.
   - **3 aylık bilgi yenilemesi yayına kadar ertelendi** (karar 0020'nin ilk tur 2027 Ocak takvimi yerine). 2026-11-03'te sorulan soru yanıtlanmamıştı; 2026-11-04'te yeniden soruldu, ürün sahibi "Yayına kadar ertele (Önerilen)" seçeneğini seçti. Tasarım ve uygulama aşamalarında veri çekilmez; ilk yenileme turu uygulama mağazaya çıktıktan sonra yapılır.
4. **Aşama sırası.** Ürün sahibi kendi sırasını yazdı (veri, veri testi, uygulamanın içeriği, sosyal, mağaza uyumu, güvenlik ve yasal, yayın). Claude'un önerdiği sıra seçildi ("Önerdiğin sıra"):
   1. Veri: gerekenler.
   2. Veri testi ve düzeltme; veri dondurulur.
   3. Ad ve tasarım: marka adı, telefon için ekranlar ve düğmeler, ücretsiz ve premium ayrımı, görsel kararı (fotoğraf mı, çizim mi).
   4. Telefon uygulaması ve altyapı: kendi sunucu, veritabanı, giriş sistemi, verinin buluta taşınması.
   5. Sosyal: önce avukat görüşü, sonra profil, paylaşma, takip, beğeni, yorum, şikâyet ve engelleme.
   6. Mağaza hazırlığı: uygulama içi ödeme, hesap silme, gizlilik metni, güvenlik denetimi, kapalı test.
   7. Yayın; ardından ilk 3 aylık bilgi yenilemesi.

   Önerinin gerekçeleri:
   - Sosyal hesap ister, o yüzden giriş sistemi önce gelir.
   - Sosyal önce web'de yazılırsa telefon için yeniden yazılır.
   - Sosyal ağlarda yaş doğrulama kuralları (7578 sayılı Kanun; 2026-10-28 strateji araştırması) sosyalin tasarımını değiştirir.
   - "AquaMind" adı başka akvaryum uygulamalarında da kullanılıyor; logo ve görünüm ada bağlı.

   Ürün sahibinin yalnız kendisinin yapabileceği, kod gerektirmeyen işler (marka adı, Apple ve Google geliştirici hesapları, avukatla ilk görüşme) aşamaları bölmeden ona kalır.

## Teknik sonuçlar (Claude)

- **Giriş:** kilit mekanizması (parola saklama, oturum, e-posta doğrulama, Google/Apple/Facebook akışları) sıfırdan yazılmaz. Kendi sunucumuzda çalışan, açık kaynak ve yaygın kullanılan bir giriş kütüphanesi kullanılır. Kullanıcı bilgisi kendi veritabanımızda durur. Kütüphane, sunucu ve barındırma yeri 4. aşamada araştırılır ve alternatifleri, geri alma yoluyla ayrı bir karar kaydına yazılır.
- **Dış hesaplar:** Google, Apple ve Facebook ile girişte kimliği o şirket doğrular, veritabanı onlara gitmez. Ürün sahibinin açacağı hesaplar:
  - Apple geliştirici programı (mağaza yayını için de gerekir);
  - Google Cloud (giriş izni);
  - Meta geliştirici hesabı (Facebook girişi için uygulama incelemesi ve veri silme bağlantısı ister).
- **Mağaza kuralları:** 2026-11-03 sohbetinde bilinen hâlleriyle anlatıldı. Mağaza hazırlığında güncel metinleriyle yeniden okunur.
  - App Store: başka şirketlerin girişi sunuluyorsa gizliliği koruyan eşdeğer bir seçenek (Apple ile giriş) ve hesap oluşturulabilen uygulamada uygulama içinden hesap silme.
  - Google Play: kişisel geliştirici hesabında yayından önce kapalı test (12 kişi, 14 gün).
- **Ne kalır:**
  - `packages/domain`;
  - sürümlü migration disiplini;
  - 1A tablo tasarımı (`profiles`, `aquariums`, `aquarium_members`);
  - veritabanı düzeyinde yetki ilkesi ve yetki matrisi testleri (PGlite saf PostgreSQL olduğu için geliştirme yolu sürer);
  - hesapsız kullanımda `localStorage`'ın birincil depo olması.
- **Ne bırakılır:** Supabase'e özgü parçalar. Bunlar 4. aşamaya kadar depoda olduğu gibi kalır; `pnpm verify` içindeki testleri geçmeye devam eder, uygulama hiçbir veritabanına bağlanmaz. 4. aşamada yeni yapıya uyarlanır ya da kaldırılır.
  - `auth.uid()` ve `anon`/`authenticated`/`service_role` rolleri;
  - testteki Supabase taklidi (`supabase/tests/supabase-shim.sql`);
  - hazırlık projesi (`aquamind-staging`), "Hazırlık veritabanı" iş akışı (`.github/workflows/staging-db.yml`) ve `supabase/staging/` testleri;
  - `@supabase/supabase-js` geliştirme bağımlılığı.
- **PR #80 (hesaplar 1C-1, karar 0035 o dalda):** birleştirilmez, taslak kalır. Ekranlar, üç dildeki iletiler, hata eşlemesi ve testlerin çoğu 4. aşamada yeni giriş sistemine taşınır; Supabase istemcisi ve oturum deposu yeniden yazılır. Canlıya hiçbir şey gitmemişti.
- **Ürün sahibine kalan işler:**
  - Hazırlık projesindeki eski "default" gizli anahtarın silinmesi; içinde gerçek kullanıcı olmadığı için proje tamamen de silinebilir.
  - Artık kullanılmayan erişim jetonunun ve `SUPABASE_ACCESS_TOKEN` sırrının silinmesi.
  - 4. aşamada öteki `STAGING_*` sırlarının silinmesi.
  - 1C-1 için verilen Supabase ve Vercel panel adımları artık gerekmiyor.

## Değerlendirilen seçenekler

- Supabase'le sürdürmek: ürün sahibi istemedi.
- Giriş kodunu sıfırdan yazmak: en riskli yol. Küçük bir hata bütün hesapları açığa çıkarır; önerilmedi.
- Ürün sahibinin ilk sırası: telefon uygulaması sosyalden sonra geldiği için sosyal iki kez yazılırdı, giriş sistemi de sırada yoktu.

## Geri alma

Supabase'e dönülürse 0032–0034'ün araçları depoda, 1C-1 de PR #80'de durduğu için iş kaldığı yerden sürer.
