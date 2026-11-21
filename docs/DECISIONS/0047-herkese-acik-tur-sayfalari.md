# 0047 — Herkese açık tür sayfaları, Google'a kapalı başlangıç

- Tarih: 2026-11-21
- Durum: Kabul edildi. Ürün sahibi (`buraksenfx`) 2026-11-21'de kararları verdi: her türün sade, hızlı açılan, herkese açık bir bilgi sayfası olacak; altta kaynak adları ve bağlantıları küçük yazıyla; sayfalar hazırlanır ama yeni ad ve alan adı belli olana kadar Google'a kapalı durur; ilk deneme 30 tatlı su türüyle, üç dilde. Yerleşim düzeni, adres dosyaları, açma ayarının adı ve denetimler Claude'un teknik kararıdır (paket B1, plan `plan-kart-google.md`).

## Bağlam

Uygulamanın bütün ekranları tarayıcıda çalışır ve tek bir kök yerleşimin içindedir (`src/app/layout.tsx`, şimdi `src/app/(app)/layout.tsx`). Bu yerleşim dili adresten değil tarayıcıdan seçer: `<head>` içindeki betik dili açılışta değiştirir ve dil paketi gelene kadar sayfayı gizler (`src/lib/locale-choice.ts`). Arama motoru için her dilin kendi adresi, `<html lang>` değeri, `hreflang` ve `canonical` bağlantıları gerekir; ayrıca sayfa betiksiz, düz HTML olarak hemen görünmelidir. Tek kök yerleşimde bu yapılamaz: yerleşim alt sayfanın dilini okuyamaz ve sağlayıcılar (yerel depo, dil) her sayfaya tarayıcı kodu taşır.

## Karar

1. **İki tür kök yerleşim (Next "route group").** Uygulama ekranları `src/app/(app)/` altına taşındı; adresleri değişmedi (`/`, `/livestock`, `/aquariums/[id]/health` …). Herkese açık sayfalar `src/app/(public)/<dil>/` altında, her dilin kendi kök yerleşimiyle (`<html lang="tr|en|es">`); dil seçme betiği, sağlayıcılar ve yerel depo yoktur. Katalog parçaları (`src/app/catalog-data/**`), `robots.ts`, `sitemap.ts`, `globals.css` ve `icon.svg` kökte kaldı. İki yerleşim arasında geçiş tam sayfa yüklemesidir (düz bağlantı).
   - Değerlendirilen daha küçük yol: tek kök yerleşimde betiğin adrese bakıp herkese açık sayfada çalışmaması. Reddedildi: sunucudaki `<html lang>` yine Türkçe kalırdı ve sağlayıcılar (uygulamanın bütün ilk yükleme kodu) herkese açık sayfaya da giderdi. Taşıma mekaniktir; testlerdeki dosya yolları `src/app/(app)/...` olarak güncellendi.
2. **Adresler:** dizin `/tr/tur`, `/en/species`, `/es/especies`; tür sayfası `/tr/tur/<kimlik>`, `/en/species/<kimlik>`, `/es/especies/<kimlik>` (kimlik katalog kimliği). Her sayfada tek `canonical` ve üç dilin `hreflang` bağlantısı; dil seçimi olmayan ziyaretçi için `x-default` İngilizce sayfadır. Listede olmayan kimlik 404 verir (`dynamicParams = false`).
3. **Derleme anında düz HTML.** Sayfalar sunucu bileşenidir (`force-static`); katalog, davranış ve bakım kayıtları yalnız derlemede okunur (`src/lib/public-species.ts`), sayfaya hazır metin gider. Tarayıcıya giden betik yalnız Next'in ortak çatısıdır (yaklaşık 103 kB, bütün sayfalarda ortak); sayfanın kendi kodu yoktur. `scripts/check-locale-bundle.cjs` (derlemeden sonra) herkese açık sayfaların ilk yükleme dosyalarında katalog olmadığını, sayfa metinlerinin hiçbir tarayıcı parçasında olmadığını ve her HTML dosyasında dil, arama motoru izni, `canonical` ve `hreflang` bulunduğunu denetler.
4. **Google'a kapalı başlangıç, tek açma ayarı.** `PUBLIC_PAGES_INDEXING=on` ortam değişkeni olmadıkça herkese açık sayfalar `noindex, nofollow` taşır, `robots.txt` her şeyi kapatır (`Disallow: /`) ve site haritası boştur. Açılınca yalnız herkese açık sayfalar açılır (`Allow: /tr/tur`, `/en/species`, `/es/especies`, sayfanın görünümü için `/_next/static/` ve `/icon.svg`; geri kalan `Disallow: /`), site haritası 31 sayfanın üç dildeki 93 adresini dil bağlantılarıyla listeler. Uygulama ekranları her durumda `noindex` taşır. Ayar derleme anında okunur; değiştirince yeniden derlemek (Vercel'de yeniden yayımlamak) gerekir.
5. **Alan adı ve uygulama adı tek yerden.** Sitenin adresi `SITE_URL` ortam değişkeninden (`metadataBase`, `canonical`, `hreflang`, site haritası); yoksa Vercel'in üretim adresi (`VERCEL_PROJECT_PRODUCTION_URL`), o da yoksa yerel adres. Uygulama adı dil dosyasındaki `app.name` (`src/lib/site-config.ts` → `SITE_NAME`); test üç dilin adının aynı olduğunu denetler.
6. **İçerik yalnız katalogdan.** Boy, en az hacim (birey başına ek hacim), en az uzunluk, en az grup, sıcaklık, pH, akıntı, davranış özeti ve kaynağın notu, bakım bilgisi, kaynaklar ve son doğrulama tarihi; tür kartıyla aynı kurallar (`src/lib/species-card.ts`): kaynağın yazmadığı alanın satırı çizilmez, çevirisi olmayan metin gösterilmez, ikinci kademe değerin yanında aynı kısa not. İngilizce sayfa ABD okuru için galon, °F ve inç değerini parantez içinde ekler (metrik katalog değerinden çevrilir). Yeni tür verisi yoktur. "Kendi akvaryumunda dene" canlılar sayfasını tür seçili açar (`/livestock?add=1&species=<kimlik>`).
7. **İlk liste (30 tür):** `src/lib/public-pages.ts` → `PUBLIC_SPECIES_IDS`. Şartlar testtedir: kaynaklı ve doğrulanmış, tatlı su, üç dilde çevirisi tam, kaynaklı davranış ya da bakım bilgisi var.
8. **Görünüm:** bugünkü uygulamanın renkleriyle sade; bileşenler `src/components/public/` altında ayrıdır, yeni tasarım gelince yalnız onlar değişir. Metinler `@aquamind/localization/public-pages` girişinde (`messages/{tr,en,es}-public-pages.ts`); yalnız sunucuda okunur, dil paketine girmez.

## Yapılmayanlar

- "Bu türle uyanlar" listesi: motorun bugünkü kalıbı (`aquarium-fit`) bir akvaryum, ekipman ve su ölçümü ister; ekipmansız "kesin uygun" sunumu motor sonucunun yeni bir sunumudur (plan B3 gibi karşı firma kontrolü ister). Bu pakete alınmadı.
- Paylaşım görseli, Search Console, İspanyolca dışında yeni dil, ikili uyum sayfaları.

## Sonuç

- Uygulama ekranlarının davranışı ve adresleri değişmedi; dil betiği ve dil paketi sınırı testleri geçiyor. Eşleşmeyen uygulama adresleri `(app)/[...notFound]/page.tsx` üzerinden `notFound()` çağırır; 404 önceki gibi uygulama yerleşiminin dil betiği, sağlayıcıları ve görünümü içinde kalır (kontrol turunda düzeltildi).
- Eski kayıtlar: kullanıcı verisi ve katalog değişmedi.
- Geri alma: `src/app/(public)/`, `robots.ts`, `sitemap.ts` silinir ve `src/app/(app)/` içeriği `src/app/` altına geri taşınır; testlerdeki yollar geri alınır.
