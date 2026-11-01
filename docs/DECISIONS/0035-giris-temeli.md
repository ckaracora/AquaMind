# 0035 — Giriş temeli (Phase 1C-1)

- Tarih: 2026-11-01
- Durum: Kabul edildi. Hesaplar yalnız ortam değişkenleri girilmiş ortamda açılır; bugün yalnız Vercel önizlemeleri (hazırlık projesi). Canlı site değişmez.
- Dayanak: karar 0032 (1C), karar 0033 (`profiles`), karar 0034 (hazırlık projesi), `docs/SECURITY.md` ("Kimlik doğrulama sınırı").

## Ürün sahibinin kararları (2026-11-01)

Beş ekran taslağı onaylandı: giriş, hesap oluşturma, e-posta onayı, ilk girişte bu cihazdaki verileri taşıma, Ayarlar › Hesap. Dört karar:

1. **E-posta onayı zorunlu.** Onaylanmamış hesapla giriş yapılamaz; yanlış ya da başkasına ait adresle hesap açılmaz, parola sıfırlama doğru adrese gider.
2. **Takma ad sonra ve isteğe bağlı.** Kayıt yalnız e-posta ve parola ister; takma ad Ayarlar › Hesap'tan eklenir.
3. **Bu cihazdaki veriler ilk girişte sorulur** ("Hesabıma taşı" / "Şimdi değil"), sonra Ayarlar'dan da yapılabilir. Bulut verisi gelince (1C-3, 1C-4) uygulanır; bu adımda yok.
4. Ekranlar taslaktaki düzen ve metinlerle yapılır.

## 1C'nin alt adımları

1. **1C-1 (bu karar):** e-posta ve parolayla giriş, hesap oluşturma, e-posta onayı, parola sıfırlama, Ayarlar › Hesap (e-posta, takma ad, parola değiştirme, çıkış), kenar çubuğunda hesap kartı.
2. 1C-2: kalan kullanıcı tabloları (canlı, bitki, ekipman, ölçüm, bakım).
3. 1C-3: girişliyken akvaryum verisinin Supabase'ten okunup yazılması.
4. 1C-4: bu cihazdaki verileri hesaba taşıma (ekran 4).
5. 1C-5: Google ile giriş.
6. Üretimden önce: hesap silme, gizlilik metninin hesaplara göre güncellenmesi, özel e-posta sunucusu (SMTP), robot denetimi ve oran sınırları, üretim Supabase projesi ve Vercel üretim değişkenleri.

## Teknik kararlar

- **Aç/kapa ortam değişkeniyle.** `NEXT_PUBLIC_SUPABASE_URL` ve `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (Supabase'in Next.js belgesindeki adlar) ikisi de geçerliyse hesaplar açılır (`src/lib/auth/config.ts`). Adres yalnız `https://<20 karakterlik kimlik>.supabase.co` biçiminde kabul edilir; anahtar `sb_publishable_` ile başlamalıdır. Değişken yoksa giriş bağlantıları görünmez, Supabase kodu indirilmez, içerik güvenlik politikası değişmez, Ayarlar'daki "Profil" bölümü ve kenar çubuğundaki "Misafir" kartı olduğu gibi kalır. Değerleri ürün sahibi Vercel'e girer: bugün yalnız **Preview** ortamına hazırlık projesininkiler. Üretim ortamına üretim projesi açılınca girilir.
- **Gizli anahtar korunması.** Next, `NEXT_PUBLIC_` ile başlayan her değişkeni derlemede tarayıcı paketine gömer; hesaplar kapalı kalsa da değer pakette olur. Bu yüzden `next.config.ts`, derlemeden önce `NEXT_PUBLIC_` ile başlayan bütün değişkenleri tarar (`src/lib/auth/secret-guard.ts`): yeni biçim (`sb_secret_` ve ardından en az 20 karakter) ya da eski biçim (rolü `service_role` olan JWT) bir gizli anahtar varsa derleme durur. Yalnız öneki anan metin anahtar sayılmaz (Vercel'in `NEXT_PUBLIC_VERCEL_GIT_COMMIT_MESSAGE` değişkeni commit mesajını taşır; "sb_secret_ anahtarlarını reddet" gibi bir mesaj derlemeyi durdurmamalı). Hata iletisi yalnız değişkenin adını yazar. Koruma yalnız derlemede çalışır, tarayıcı paketine girmez.
- **Yalnız `@supabase/supabase-js` (2.118.0, zaten kilitli), `@supabase/ssr` yok.** `@supabase/ssr`'ın kendi belgesi (`createBrowserClient`, 0.12.7) oturumun sunucuda okunması gerekmiyorsa `supabase-js`'in `createClient`'ını kullanmayı söyler. Sayfalar tarayıcıda çalışıyor ve hiçbir sunucu kodu oturumu okumuyor. Oturumu çerezde tutmak her sayfa isteğine birkaç KB eklerdi. Supabase'in Next.js rehberindeki ara katman (middleware) da yalnız sunucu bileşenleri çerez yazamadığı için var. Bu yüzden ara katman ve rota işleyici yok, sayfalar statik kalır, her istekte kenar fonksiyonu çalışmaz (sayfa hızı). Oturum tarayıcının yerel deposundadır (`sb-<proje kimliği>-auth-token`); yedek ve "tüm verileri sil" yalnız `aquamind:` anahtarlarına dokunur. Depo istemciye uygulama tarafından verilir (`createAuthStorage`): auth-js kendi başına bırakılırsa yerel depo açılışta yazılamıyorsa kendi belleğine geçer ve o bellek dışarıdan silinemezdi (Codex 3. tur). Uygulamanın deposu yerel depo varken her okuma ve yazmayı doğrudan ona yapar; öbür sekmelerin yenilediği ya da kapattığı oturum hemen görülür. Yazma hatası (yer kalmadı) gizlenmez, girişte "bu cihazda yer kalmadı" iletisi çıkar; yarısı bellekte bir oturum tutulmaz (Codex 4. tur: sekmeler arası uyuşmazlık). Yalnız yerel depo hiç yoksa ya da erişim engelliyse bellek kullanılır; o durumda paylaşılan bir depo da yoktur. Silme hatası da gizlenmez: depoya o an erişilemiyorsa oturum silinemez ve ekran çıkış yapılmış demez (aşağıda). Yalnız bellekte duran bir "silindi" işareti tutulmaz; öyle bir işaret öbür sekmenin yeni oturumunu silebiliyor ve sayfa kapanınca kayboluyordu (Codex 5. tur). Sunucuda oturum gereken gün (ör. hesap silme) erişim jetonu istekle gönderilir ya da bu karar yeniden açılır. `docs/SECURITY.md`'deki "Web: SSR yardımcılarıyla sunucu tarafı oturum" satırı buna göre güncellendi.
- **Supabase kodu ayrı parça.** İstemci `import()` ile, yalnız hesaplar açıksa ve sayfa çizildikten sonra yüklenir (`src/lib/auth/client.ts`).
- **İçerik güvenlik politikası.** Hesaplar açıkken `connect-src`'ye yalnız o projenin kökeni eklenir (`src/lib/security-headers.ts`); başka hiçbir yönerge değişmez.
- **E-posta bağlantıları düğmeyle doğrulanır.** Supabase'in şablon belgesi, posta hizmetlerinin bağlantıyı önceden açıp tek kullanımlık anahtarı tüketebileceği konusunda uyarır. Onay ve sıfırlama bağlantısı statik bir sayfa açar (`/account/confirm`, `/account/new-password`); anahtar (`token_hash`) ancak kullanıcı düğmeye dokununca `verifyOtp` ile doğrulanır. Sayfa anahtarı okur okumaz adresten siler (tarayıcı geçmişinde kalmasın); sayfa yenilenirse bağlantı geçersiz görünür, e-postadaki bağlantı yeniden açılabilir. `/account/*` sayfalarında `Referrer-Policy: no-referrer` gönderilir: anahtar silinmeden önce yüklenen dosyaların istekleri de tam adresi taşımaz. Taslaktaki üç ekrana bir onay düğmesi eklendi. Yeni parola sayfasında önce parolalar denetlenir, sonra anahtar doğrulanır, sonra parola yazılır; parola reddedilirse oturum açık kaldığı için anahtar yeniden istenmez.
- **Hata iletileri dilde.** Supabase'in İngilizce hata metni gösterilmez. Hata kodu (`invalid_credentials`, `email_not_confirmed`, `weak_password`, `same_password`, `otp_expired`, oran sınırı, ağ, PostgREST `23505`/`23514`) ekrandaki ileti anahtarına çevrilir; tanınmayan her hata "Bir şeyler ters gitti" olur (`src/lib/auth/errors.ts`).
- **Ekran hesabın varlığını ayırt etmez; iletiler teslimi garanti etmez.**
  - Kayıt: kayıtlı bir e-postayla yeniden kayıtta Supabase, "Confirm email" ve "Confirm phone" ikisi de açıksa sahte bir kullanıcı döndürür, biri kapalıysa `user_already_exists` verir (Supabase `signUp` belgesi). Ekran ikisinde de "E-postanı kontrol et" gösterir ("onay bağlantısı gönderiyoruz") ve altında "bu e-postayla zaten hesabın varsa yeni e-posta gelmez; giriş yap ya da parolanı sıfırla" der.
  - Onay e-postasını yeniden gönderme: onaylı hesaba Supabase sessizce başarı döner, yeni hesaba kısa aralıkla ikinci istek `over_email_send_rate_limit` verir. İkisi de aynı "İstek alındı; birkaç dakika içinde gelmezse istenmeyen klasörüne bak ya da biraz sonra yeniden dene" iletisini gösterir.
  - Parola sıfırlama: kayıtsız adres hemen başarı döner; kayıtlı adrese kısa aralıkla ikinci istek ya da projenin saatlik e-posta sınırı `over_email_send_rate_limit` verir. Ekran her durumda "İstek alındı; bu e-postayla bir hesap varsa bağlantı birkaç dakika içinde gelir, gelmezse…" der; e-postanın gittiğini söylemez.
  - Kayıtta `over_email_send_rate_limit` (ör. projenin saatlik e-posta sınırı) da aynı "E-postanı kontrol et" ekranını açar: onaylı hesap o durumda e-posta yoluna girmeden başarı döndüğü için hatayı göstermek hesabı ayırt ettirirdi (Codex 4. tur). Supabase gönderim olmazsa kullanıcıyı da oluşturmaz (supabase/auth `signup.go`); bu yüzden o ekrandaki "E-postayı yeniden gönder" `resend` değil kaydın kendisini aynı e-posta ve parolayla yeniden dener (parola yalnız o ekranın belleğinde tutulur). Sınır kalkınca hesap oluşur ve e-posta gider; onaysız hesaba onay e-postası yeniden gider; onaylı hesap yine sessizce başarı döner.
  - IP'ye bağlı `over_request_rate_limit` ve ağ hataları hesaba bağlı olmadığı için açıkça gösterilir. Auth API'sini doğrudan çağıran biri için güvence panel ayarlarına bağlıdır; tam gizleme iddia edilmez.
- **Çıkış yalnız bu cihazda** (`signOut({ scope: "local" })`). auth-js 2.118.0 sunucuya ulaşamasa da geçerli oturumu bu cihazdan siler; ama oturumun süresi dolmuşsa ve yenileme ağ hatası verirse silmeden döner (`_signOut` → `_useSession`). Bu yüzden çıkış herhangi bir hata verirse uygulama oturumun yerel depodaki anahtarlarını kendisi siler (`clearStoredSession`, anahtar adı istemciye açıkça verilir) ve oturum durumunu "girişsiz" yapar (`markSignedOut`); istemci oturumu her seferinde depodan okuduğu için bağlantı dönünce otomatik yenileme oturumu geri getiremez. Kullanıcı çıkış yapamadan kalmaz. Tarayıcının deposuna o an erişilemediği için yerel oturum da silinemezse çıkış yapılmış gösterilmez; "oturum kapatılamadı, sayfayı yenileyip yeniden dene" iletisi çıkar (`storageUnavailable`). Sayfa yenilenmez: depolama doluyken yalnız bellekte duran akvaryum değişiklikleri kaybolmasın (Codex).
- **Parola en az 8 karakter.** Hem ekranda (kod noktası sayısı) hem Supabase'in parola ayarında. Girişte uzunluk denetlenmez; yanlışsa Supabase söyler.
- **Giriş ekranı şimdiki durumu söyler.** Taslaktaki "Verilerin her cihazında seninle olsun" yerine, bulut verisi gelene kadar (1C-3, 1C-4) "Verilerin şimdilik bu cihazda kalır; hesabına taşıma yakında geliyor" yazar (Codex: henüz olmayan özelliği vaat ediyordu). Bulut verisiyle birlikte taslaktaki cümleye dönülür.
- **Bağlantılar da en az 44 piksel** yüksekliğinde dokunma alanı taşır (`inline-flex min-h-11`).
- **Takma ad 1–100 karakter, büyük-küçük harfe duyarsız benzersiz** (1A şeması). Boş bırakılırsa silinir. Okunamazsa düzenleme düğmesi gösterilmez, böylece bilinmeyen ad üzerine yazılmaz.
- **Gizlilik satırı yok.** Gizlilik metni (`/privacy`, bağlantısız taslak) bugün "her şey yalnız bu cihazda" diyor ve hesaplar gelmeden önce güncelleneceğini söylüyor. Kayıt formundaki "gizlilik metnini kabul" satırı, metin hesaplara göre güncellenince eklenir (üretimden önce, ürün sahibine gösterilerek).

## Supabase ve Vercel ayarları (ürün sahibi girer)

- Hazırlık projesi → Authentication:
  - **URL Configuration → Redirect URLs:** `https://aqua-mind-*-ckaracoras-projects.vercel.app/**` (Vercel önizleme adresleri; `*` nokta ve eğik çizgiyi geçmez).
  - **Sign In / Providers → Email:** "Confirm email" açık; en az parola uzunluğu 8.
  - **Sign In / Providers → Phone:** "Confirm phone" açık (telefonla giriş kapalı kalsa bile). Supabase'in belgesine göre ikisinden biri kapalıysa kayıtlı e-postayla yeniden kayıt `user_already_exists` hatası verir ve hesabın varlığını ele verir.
  - **Email Templates:**
    - "Confirm sign up" bağlantısı `{{ .RedirectTo }}?token_hash={{ .TokenHash }}&type=email`.
    - "Reset password" bağlantısı `{{ .RedirectTo }}?token_hash={{ .TokenHash }}&type=recovery`.
    - `RedirectTo`, uygulamanın gönderdiği `emailRedirectTo`/`redirectTo` değeridir (`<köken>/account/confirm`, `<köken>/account/new-password`).
- Vercel → Environment Variables, yalnız **Preview**:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
  - Değişiklik yalnız yeni dağıtımlara uygulanır (Vercel belgesi).
- Supabase'in hazır e-posta servisi yalnız projenin ekip üyelerine ve saatte 2 e-posta gönderir (supabase.com/docs/guides/auth/auth-smtp). Önizlemede deneme için yeterli; üretimden önce özel SMTP gerekir.

## Doğrulama

- Yerel (`pnpm verify`):
  - `src/lib/__tests__/auth.test.ts`: ortam değişkeni, içerik politikası, hata kodları, Supabase çağrılarının seçenekleri, e-posta bağlantısı, takma ad.
  - `src/lib/__tests__/account-screens.test.ts`: kart, sayfalar ve Ayarlar › Hesap; kapalıyken kartın eskisiyle birebir aynı olduğu, sayfaların form göstermediği.
- Hazırlık (`pnpm test:staging`, `supabase/staging/auth-flows.test.ts`): uygulamanın aynı işlevleri gerçek Supabase Auth'a karşı çalışır. E-posta gönderilmez; anahtarlar yönetici `generateLink` çağrısından alınır. Temizlikte bu çalıştırmanın e-posta önekiyle eşleşen kullanıcılar da aranıp silinir (yanıtı kaybolan bir oluşturma isteği geride kullanıcı bırakmasın). Test proje ayarlarını da denetler:
  - e-posta ve telefon onayı açık;
  - önizleme adresi yönlendirme listesinde;
  - sunucu 7 karakterlik parolayı reddediyor.
  Ayar denetimi Auth'un herkese açık ayar ucundan (`/auth/v1/settings`) okunur: `mailer_autoconfirm` ve `phone_autoconfirm` ikisi de `false` olmalı (normal kayıt onay ister, kayıtlı adresle yeniden kayıt hata vermez). Ayrıca e-postası onaylanmamış kullanıcının giriş yapamadığı, onay anahtarının oturum açtığı ve tek kullanımlık olduğu, takma adın benzersizliği ve başkasının satırına dokunulamadığı, aynı parolanın reddi, sıfırlama ve çıkış sınanır.
- Görsel denetim: yerelde sahte proje adresiyle (gerçek anahtar yok); ağ istekleri tarayıcıda kesildi, dışarı bir şey gitmedi.

## Geri alma

Değerler derlemede pakete gömüldüğü için Vercel'deki iki önizleme değişkenini silmek tek başına yetmez: değişiklik yalnız yeni dağıtımlara uygulanır (Vercel belgesi). Değişkenler silinir, önizleme yeniden dağıtılır; eski önizleme dağıtımları ya silinir ya da Vercel'in dağıtım koruması arkasında kalır. En kesin yol hazırlık projesinde yeni kayıtları kapatmaktır (Authentication → Sign In / Providers, "Allow new users to sign up"). Kodda geri alma: `src/lib/auth`, `src/providers/auth-provider.tsx`, `src/app/account`, `src/components/account-*`, kart ve Ayarlar değişiklikleri, `next.config.ts` ve `security-headers.ts` eklemeleri, iletiler ve testler kaldırılır. `@supabase/supabase-js` geliştirme bağımlılığına döner.
