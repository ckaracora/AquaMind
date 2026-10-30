# 0020 — Ürün hedefleri ve yol haritası

- Tarih: 2026-10-19
- Durum: Kabul edildi (ürün sahibi `buraksenfx`, 2026-10-19). Teknik sıra ve yöntem Claude'a bırakıldı ("öneri sırana uyuyorum … sen hakim ol"). Belge `codex/roadmap` dalında; Codex iki tur denetledi (2. tur temiz, 2026-10-19); commit ve PR planlandı.

## Bağlam

Ekipman kaynak yenilemesi 3 (PR #30) ile veri temizliği sonuna yaklaştı. Ürün sahibi 2026-10-19'da uygulamanın nereye gittiğini, ihtiyacı karşılayıp karşılamayacağını ve yurt dışında kullanılıp kullanılamayacağını sordu. Claude bir durum özeti ve kısa bir rakip taraması sundu; ürün sahibi aşağıdaki hedefleri ve kararları verdi.

Rakip taraması (2026-10-19; ön değerlendirme: web aramasına dayanıyor, uygulamalar kurulup denenmedi; kaynaklar çoğunlukla uygulamaların kendi tanıtımları ve mağaza listeleri, bağımsız karşılaştırma bulunamadı):

- Takip uygulamaları (Aquarimate, AquaticLog, Aquarium Log, Fishi) bakım, su değeri ve hatırlatma sunuyor; uyum denetimi yok ya da sınırlı.
- Uyum denetimi yapanlar (App-aquatic, TankFlare, Aquabuildr) İngilizce ve değerlerin kaynağını göstermiyor.
- Resif uygulamaları (Reef Trak, MyReefPal) yalnız tuzlu su.
- Türkçe, yerel markalı ve uyum denetimi yapan bir uygulama bulunamadı.
- Uygulama içi güçlü bir sosyal yapı bulunamadı; hobi topluluğu Instagram, Reddit, Facebook grupları ve forumlarda. Bitki için ayrı bir uygulama bulunamadı.

## Ürün hedefleri (ürün sahibi)

1. Uygulama **App Store ve Google Play'de** yayımlanacak; web sürümü de kalacak.
2. **Rakiplerin üstünde** olacak ve **on binlerce kullanıcıyı** kaldıracak.
3. **Uygulama içi ödeme** altyapısı olacak.
4. **Birden çok dilde** olacak; ilk ek dil İngilizce.
5. Son derece **modern ve akıcı** olacak; hem bilgilendirecek, hem akvaryumun düzenli kontrolünü sağlayacak, hem de insanların **tanışıp etkileşime girdiği** sosyal bir uygulama olacak.
6. **Kullanıcı odaklı** olacak.

## Ürün sahibinin kararları (2026-10-19)

1. **Bitki bilgisine başlanır:** bitki kataloğu ve bitkiye göre uyarılar.
2. **Tuzlu su:** iş yükü çıkarılır; en azından bir başlangıç paketiyle tuzlu su kullanıcısına da hizmet verilir.
3. **Hastalık ve tedavi:** şimdilik güvenilir kaynaklara yönlendiren bir sayfa; konu ileride yeniden araştırılır. İleride sponsorluk olabilir; sponsorlu içerik açıkça "sponsorlu" diye işaretlenir ve tavsiyeyi etkilemez.
4. **Dile uygun yapıya geçilir;** çeviri kesin yapılacak, birden çok dil.
5. **Yasal hazırlık en sona bırakılır.** Kapsam (Claude'un notu): KVKK aydınlatma metni, gizlilik politikası, kullanım koşulları, yurt dışına veri aktarımı (2024'ten beri standart sözleşme ve bildirim), sosyal içerik için şikâyet ve kaldırma düzeni. Bunlar hesapla kullanılan ilk gerçek yayından ve mağazalara gönderimden önce hazır olmalıdır; mağazalar gizlilik politikası olmayan uygulamayı kabul etmez. Yayından önce bir avukat incelemesi önerilir.
6. **Bilginin güncelliği:** katalog bilgileri **3 ayda bir yeniden araştırılır**; ayrıca kullanıcıların bir bilgiye **artı/eksi** verebileceği ve düzeltme önerebileceği bir alan yapılır.
7. **Görseller** tasarım çalışmasında netleşir.
8. Sıra: Claude'un önerdiği sıra kabul edildi; sosyal ilk sürüm telefon uygulamasından önce, bitki tuzlu sudan önce.

## Teknik sonuçlar (Claude'un kararları; baştan değişenler)

1. **Çok dil.** Arayüz metinleri dil dosyalarına taşınır. Motor uyarılarını Türkçe cümle olarak değil kod ve değişken olarak üretir; ekran bunları kullanıcının diliyle yazar. Katalogda tür ve bitki adları ile açıklamalar dile göre alan olur; bilimsel ad dilden bağımsız anahtar olarak kalır. Tarih ve sayı biçimi kullanıcının diline göre yapılır. Türkçe metinler değişmez. Motorun çıktı biçimi değiştiği için bu bir motor değişikliğidir: kurallar ve sonuçlar aynı kalır, altın fikstür ayrı commit'te yeniden üretilir, uygulamadan önce ürün sahibine bildirilir.
2. **Birimler.** Değerler içeride metrik tutulur (litre, °C, cm); ekranda kullanıcının tercihine göre gösterilir (galon, °F, inç).
3. **Katalog uygulamaya gömülü kalmaz.** Hesaplar aşamasında katalog sunucuda sürümlü veri olur (`docs/ARCHITECTURE.md` → `packages/knowledge`, kontrollü içe aktarma). Böylece 3 aylık güncellemeler ve çeviriler mağaza sürümü beklemeden kullanıcıya ulaşır; telefon uygulaması katalogu önbelleğe alır.
4. **Bilgi geri bildirimi.** Her katalog kaydı ve alanı için artı/eksi ve düzeltme önerisi; öneriler bir inceleme listesine düşer, incelenen değer kaynağıyla değişir. Hesap gerektirir; veri modeli hesaplar aşamasında kurulur.
5. **3 aylık araştırma.** Her çeyrekte kaynak bağlantılarının açıldığı, değerlerin değişip değişmediği ve kullanıcı önerileri kontrol edilir; sonuç `docs/CATALOG_LOG.md`'ye yazılır. Bağlantı ve değer karşılaştırması mümkün olduğunca betikle yapılır.
6. **Giriş.** E-posta ve Google girişine ek olarak Apple ile giriş: App Store, başka sağlayıcıyla giriş sunan uygulamalardan buna eşdeğer bir seçenek istiyor.
7. **Ödeme.** Telefonda dijital özellikler App Store ve Google Play'in kendi ödeme sistemiyle satılır; mağaza ödemelerini tek yerden yöneten bir katman kullanılır. Web'de ayrı ödeme isteğe bağlıdır. Ücretsiz ve premium ayrımı ürün kararıdır, ayrıca sorulur.
8. **Sosyal.** Profil, akvaryum paylaşma, takip, beğeni ve yorum; baştan şikâyet, engelleme ve içerik süzme (mağazaların kullanıcı içeriği kuralları). Fotoğraflar için boyutlandıran ve hızlı dağıtan bir depolama.
9. **Ölçek.** On binlerce kullanıcı için planlanan altyapı (Supabase Postgres, Auth, Storage) yeterlidir; hata izleme, ürün analitiği, yedekleme ve istek sınırlama hesaplar aşamasında kurulur.
10. **Tasarım önce.** Telefon uygulaması ve sosyal ekranlar yazılmadan önce ortak bir tasarım sistemi ve taslaklar ürün sahibinin onayına sunulur.

## Yol haritası

| Sıra | İş | Not |
|---|---|---|
| 0 | Bu yol haritasının kaydı ve PR #30'un birleştirme kaydı | `codex/roadmap` |
| 1 | Dil altyapısı (arayüz, motor uyarıları, katalog adları, birimler) | Hesap gerektirmez; motor çıktı biçimi değişir, kural değişmez |
| 2 | 133 türün uzman kaynağı | Veri |
| 3 | Hastalık ve tedavi yönlendirme sayfası | Küçük; kaynak araştırması ayrıca |
| 4 | Bitki kataloğu ve bitki sayfasında katalogdan seçme; ardından bitki uyarıları | Uyarı kuralları için ayrıca onay |
| 5 | Tuzlu su başlangıç paketi | Kaynak listesine deniz kaynakları için onay; mercanlar ayrı paket |
| 6 | Kalan veri işleri: örnek denetim, 68 satış adı (ürün sahibiyle), bakım ürünleri | |
| 7 | Hesaplar ve bulut (Phase 1), katalog sunucuda, bilgi geri bildirimi | Docker ve BIOS ya da Docker gerektirmeyen geliştirme yolu |
| 8 | Tasarım çalışması: tasarım sistemi, görseller, sosyal ekran taslakları | Ürün sahibi onayı |
| 9 | Sosyal ilk sürüm | |
| 10 | Telefon uygulaması (iOS, Android): hatırlatmalar, bildirimler, uygulama içi ödeme, İngilizce | |
| 11 | Yasal hazırlık ve yayın: metinler, mağaza gereksinimleri, beta deneme | Gerçek kullanıcıya hesap açılmadan önce |
| Sürekli | 3 ayda bir bilgi araştırması; kullanıcı geri bildirimleri | İlk tur 2027 Ocak |

Sonra: mercanlar, bitki uyarılarının ışık ve CO₂ ölçümüyle geliştirilmesi, hastalık konusunun ayrıntılı araştırması, yapay zekâ ve diğer Phase 3 başlıkları.

## Açık ürün kararları

- Ücretsiz ve premium özelliklerin ayrımı.
- Sosyal ilk sürümün kapsamı (taslakla birlikte).
- Tuzlu su ve bitki için kabul edilecek uzman kaynak listesi (`docs/DATA_SOURCES.md`'ye eklenecek). Bitki: 2026-10-25, karar 0023. Tuzlu su: 2026-10-29, karar 0029.
- Görsel stratejisi (kendi fotoğraflar, açık lisanslı görseller, markalardan izinli ürün fotoğrafları, kullanıcı fotoğrafları).
- İngilizceden sonra hangi diller.
