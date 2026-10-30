# 0027 — Veri güvenliği 1: yedekten geri yükleme, kalıcı depolama, yedek hatırlatması, güvenlik başlıkları, gizlilik sayfası

- Tarih: 2026-10-29
- Durum: Kabul edildi. Ürün sahibi 2026-10-29'da bu paketi istedi ("ürün kararı gerektirmeyen veri açıklarını kapatan küçük paket"), metinleri gördü ve 2026-10-30'da gizlilik bağlantısı gizlenerek yayına alınmasını onayladı ("Evet, yayına al"). Gizlilik sayfasındaki eksik bilgi (veri sorumlusu ve iletişim adresi) yayından önceki son adımda gelecek.
- Kapsam dışı (ürün kararı): Ayarlar'daki kaydetmeyen "Ad soyad" ve "E-posta" kutularının kaldırılması ya da çalışır hâle getirilmesi; iletişim adresi; uygulamanın adı.

## Bağlam

Strateji araştırması (2026-10-28, `reports/AquaMind strateji ve farklılaşma.md`) bugünkü uygulamada yedi veri açığı buldu. Asıl risk verinin sızması değil, kaybolmasıydı:

- Yedek alınabiliyordu ama geri yüklenemiyordu.
- Tarayıcıdan kalıcı depolama istenmiyordu. MDN'e göre kalıcı olmayan ("best-effort") veri, tarayıcının kendi kurallarıyla silinebilir; kalıcı işaretlenen veri ise kullanıcı ya da site silmedikçe silinmez (https://developer.mozilla.org/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria). Tarayıcı isteği kabul etmeyebilir.
- Safari, siteyle etkileşim olmadan geçen 7 Safari kullanım gününden sonra sitenin betikle yazılan verisini silebilir; ana ekrana eklenen web uygulamalarının kendi gün sayacı vardır (WebKit, 2020: https://webkit.org/?p=10218). WebKit, kalıcılık isteğini sitenin ana ekran uygulaması olarak açılması gibi ölçütlerle verir (https://webkit.org/?p=14403).
- Yedek almayı hatırlatan bir şey yoktu.
- Vercel'in gönderdiği HSTS dışında güvenlik başlığı yoktu.
- Gizlilik metni yoktu; Vercel'in ziyaretçi IP adresini işlediği hiçbir yerde yazmıyordu.

## Karar

### 1. Yedekten geri yükleme (değiştirerek)

- Ayarlar → "Yedekten geri yükle" bir JSON dosyası seçtirir. Dosya `LocalExportV1` şemasından bütünüyle geçmelidir; tek bir bozuk kayıt bile yedeği reddettirir (yarım yükleme olmaz). 10 MB'tan büyük dosya okunmaz. Daha yeni bir yedek sürümü ayrı bir mesajla reddedilir.
- Onay penceresi yedeğin tarihini, yedekteki kayıt sayılarını ve bu cihazda yerini alacak kayıtların sayılarını gösterir; "Önce şu anki verilerimi indir" düğmesi aynı penceredededir. Depoya yalnızca "Yedeği geri yükle" ile yazılır.
- **Değiştirme, birleştirme değil.** Altı koleksiyon ve tercihler yedektekiyle değişir. Birleştirme, aynı kimlikli kayıtlar ve yetimler için kural gerektirirdi; değiştirme öngörülebilir ve sınanabilir.
- **Kurtarma verisi silinmez.** Silinen akvaryum arşivi birleştirilir (cihazdaki paketler korunur, yedekteki eksik paketler eklenir). Cihazdaki karantina kayıtları korunur; yedekteki karantina kayıtları yalnız cihazda yoksa ve anahtar `aquamind:<ad>:v1:corrupt:<zaman>` biçimindeyse eklenir.
- **Satırlar orijinal nesnelerdir**: bilinmeyen ek alanlar kaybolmaz. Yedekteki yetim kayıtlar ait oldukları koleksiyona geri konur; böylece dışa aktarılan her kayıt geri gelir.
- **Günlüklü yazma.** `localStorage` transaction desteklemez. Geri yükleme silme günlüğüyle aynı anahtara (`aquamind:journal:v1`) `op: "restore-backup"` günlüğünü yazar; günlük yazılacak her değerin tamamını taşır. Sıra: yer sınaması → günlük → hedef anahtarlar boşaltılır (dizi tutanlara `[]`, tercihler kaldırılır) → yazmalar, günlük her yazmadan sonra o yazma çıkarılarak küçülür → günlük silinir. Böylece uygulama sırasında depo en çok "günlük + en büyük değer" kadar dolar. Yer sınaması günlükten önce yapılır: geçici bir anahtara (`aquamind:restore-probe:v1`) günlüğün metni ile en büyük değerin kendisi art arda yazılıp hemen silinir; tarayıcılar boyutu farklı sayabileceği için en büyük değer hem karakter hem UTF-8 bayt ölçüsüne göre seçilir; ikisi farklıysa her biri ayrı ayrı sınanır (toplamları değil, çünkü uygulama sırasında aynı anda yalnız biri fazladan durur). Sığmıyorsa geri yükleme "yeterli depolama alanı yok" diye reddedilir. Sınama günlükten önce olduğu için yarıda kalırsa ortada günlük yoktur; açılış geçici anahtarı siler. Böylece yer yetmezliği yıkıcı yazmalar başlamadan anlaşılır ve geri yükleme yarıda takılı kalmaz (Codex 1. ve 2. tur bulguları). Ret yollarında depoya hiçbir şey yazılmaz: silinen akvaryum arşivi de onarılmadan okunur, bozuksa geri yükleme reddedilir (normal açılış arşivi karantinaya alıp onarır, sonra yeniden denenebilir). Yarıda kalırsa (çökme, geçici hata) günlük durur, normal kaydetmeler yazamaz (0006'daki koruma) ve açılışta kalan yazmalar uygulanır; her yazma sabit bir değer yazdığı için yinelenebilir. Açılışta yalnız izin verilen anahtarlara yazılır. Yazıya dökülemeyen içerik (ör. bilinmeyen bir alanda aşırı iç içe dizi) dosya okunurken reddedilir; geri yükleme sırasında beklenmeyen bir hata olursa kaydetme askısı kalkar ve ekranda yazar.
- Başarıdan sonra sayfa yeniden yüklenir; yazma boyunca kaydetme askısı açıktır, bellekteki eski veri depoya geri yazılmaz.

### 2. Kalıcı depolama isteği

Ayarlar → Veri yönetimi'nde "Tarayıcı verilerimi silmesin" satırı tarayıcının kararını gösterir (açık, kapalı, kabul edilmedi, desteklenmiyor). "Kalıcı depolamayı iste" düğmesi `navigator.storage.persist()` çağırır. İstek kendiliğinden yapılmaz: bazı tarayıcılar burada izin sorar ve kullanıcı ne olduğunu anlamadan bir izin penceresi görmemelidir. Safari notu: Safari'nin sayacı sitede dokunma ya da tıklama olmadan geçen Safari kullanım günlerini sayar (yalnız sayfayı açmak değil); siteyi ana ekrana eklemek ve düzenli yedek almak.

### 3. Yedek hatırlatması

- Bu cihazda kalıcı kullanıcı verisi varken (demo kayıtlar sayılmaz), hiç yedek alınmadıysa ya da son yedekten bu yana 7 gün geçtiyse Genel Bakış'ta ve her sayfanın başlığının altında bir kutu çıkar: "Şimdi yedek al" ve "Sonra hatırlat" (7 gün erteler). 7 gün, Safari'nin 7 günlük kuralıyla aynı aralıktır.
- Son yedek zamanı ve erteleme yeni anahtar `aquamind:backup-status:v1`'de durur. Kullanıcı verisi değildir: yedeğe girmez, geri yüklemede değişmez, okunamıyorsa boş sayılır. "Tüm verileri sıfırla" onu da siler.
- Ayarlar'da "Son yedek: tarih" ve "Yedek dosyası şifresizdir" notu yazar.

### 4. Güvenlik başlıkları

`next.config.ts` her sayfaya şu başlıkları ekler (`src/lib/security-headers.ts`): `Content-Security-Policy`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` (kamera, mikrofon, konum, ödeme, USB, ilgi alanı kapalı), `Cross-Origin-Opener-Policy: same-origin`. `X-Powered-By` kapatılır. Ayrıntı ve gerekçe: `docs/SECURITY.md` → "Tarayıcı güvenlik başlıkları".

### 5. Gizlilik sayfası (taslak)

`/privacy` uygulamanın bugünkü davranışını anlatır: veri yalnız bu tarayıcıda; hesap, çerez, reklam, analiz yok; Vercel'in IP ve tarayıcı bilgisini işlemesi ve gizlilik politikasının bağlantısı; yedek dosyasının şifresiz olduğu; Ayarlar'daki ad ve e-posta kutularının bugün hiçbir yere kaydetmediği; silme yolu; KVKK m.11 hakları. Veri sorumlusu ve iletişim adresi belirlenmediği için sarı kutuda "belirlenmedi" yazar; tahminle doldurulmaz. Sayfanın başında "Taslak" notu durur. Ürün sahibi 2026-10-30'da veri sorumlusu, iletişim adresi ve hukuki işlerin yayından (mağaza) önceki son adıma bırakılmasını istedi; bu yüzden sayfaya şimdilik bağlantı verilmez (Ayarlar'daki bağlantı kaldırıldı, metni dil dosyasında duruyor). Sayfa yalnız adresi yazılınca açılır ve taslak notunu taşır. İletişim bilgisi gelince taslak notu kalkar ve bağlantı Ayarlar'a geri konur. Metinler ayrı dil girişindedir (`@aquamind/localization/privacy`).

## Alternatifler

- **Birleştirerek geri yükleme.** Cihazda ve yedekte farklı kayıtlar varsa ikisini de tutar, ama aynı kimlikli iki kayıtta hangisinin kazanacağı bir ürün kuralı olurdu ve yarım birleşmiş veri anlaşılması zor bir durum yaratırdı. Önce değiştirme; birleştirme gerekirse ayrı bir iş.
- **Değiştirilen veriyi cihazda saklamak.** Eski koleksiyonları karantina gibi bir anahtara taşımak geri almayı sağlardı, ama depoyu iki katına çıkarır ve yeni bir kurtarma arayüzü ister. Yerine onay penceresinde "Önce şu anki verilerimi indir" düğmesi var.
- **Kalıcı depolamayı açılışta kendiliğinden istemek.** Chrome'da sessiz geçer, ama izin soran tarayıcılarda kullanıcı bağlamsız bir pencere görür. Açık düğme seçildi.
- **Nonce'lu sıkı içerik politikası.** Satır içi betikleri de engellerdi, ama her isteğin sunucuda çizilmesini gerektirir; sayfalar şu an önceden derleniyor (0015, 0016) ve uygulama dışarıya istek göndermiyor. Hesap ve sunucu kodu geldiğinde yeniden değerlendirilir.

## Sonuçlar ve geri alma

- `:v1` anahtar adları ve yedek biçimi (`LocalExportV1`, sürüm 1) değişmedi; eski yedekler geri yüklenebilir. Yeni anahtar: `aquamind:backup-status:v1`.
- Geri alınırsa eski kod `restore-backup` günlüğünü bozuk günlük sayar: ham değeri karantinaya kopyalar ve günlüğü kaldırır, aktif veriye dokunmaz. Çözülmemiş bir geri yükleme günlüğü varken (yalnız yazmalar sırasında çökme ya da işlemin kesilmesiyle; yer yetmezliği yazmalardan önce reddedilir) eski sürüme dönülürse, yarım kalmış veri olduğu gibi kalır: ör. yedekteki akvaryumlar ile bu cihazın eski ekipmanı birlikte. Ham günlük karantinada durduğu için veri kaybolmaz ama elle toparlanması gerekir. Karantina kopyası da yazılamazsa eski kod günlüğü korur ve yazmaları engellemeyi sürdürür.
- Kalıcı depolama isteğinin sonucu ekran okuyucuya duyurulur (`role="status"`); düğme kalkınca odak sonuç metnine taşınır.
- Bilinen sınır: yer sınaması, sınama ile yazmalar arasında başka bir sekmenin depoya yazmayacağını varsayar. Bir yazma sırasında kesinti olur ve açılıştaki toparlama da başarısız kalırsa, hiç yazılmamış bir koleksiyon anahtarı açılışta yok sayılıp örnek (demo) veri gösterilebilir; uyarı ve yazma engeli yine görünür.
- Bilinen sınır: aynı anda açık ikinci bir sekme, geri yüklemeden sonra kendi bellekteki eski verisini değişiklik yapıldığında yazabilir (0006'daki çoklu sekme sınırıyla aynı).
- Phase 1'de hesap gelince gizlilik metni, hesap silme ve veri aktarımı bölümleriyle yeniden yazılır.
