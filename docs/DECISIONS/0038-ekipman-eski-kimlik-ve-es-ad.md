# 0038 — Ekipman kaydında eski kimlik ve eş ad (`formerIds`, `aliases`)

- Tarih: 2026-11-11
- Durum: Kabul edildi. Birleştirme ürün sahibinin (`buraksenfx`) 2026-11-11 kararıdır: JBL PROTEMP S ısıtıcıları aynı ürünse tek kayıt olur, JBL Türkiye adıyla (S 25, 50, 100, 150, 200, 300); eski adlar aramada kalır; ısıtıcıyı önceden seçmiş kullanıcının kaydı silinmez, yeniden yazılmaz. Veri modeli ve yöntem teknik karardır (Claude). Uygulama `codex/data-test-2` dalında; kayıt ayrıntısı `docs/CATALOG_LOG.md` → "2026-11-11 JBL PROTEMP S: aynı ürünün iki kaydı tek kayıt oldu".

## Bağlam

- Aynı ürün katalogda iki kez duruyordu: eski adlı altı kayıt (`jbl-protemp-s25` … `s300`, 2026-08-17) ve S 26/51/101/151/201/301 adlı altı kayıt (`jbl-protemp-s-26` … `-s-301`, 2026-10-30). İkisinin kılavuzu bayt bayt aynı PDF, ürün numaraları aynı (6042100 … 6042600). Değerleri farklıydı; sağlık sonucu kullanıcının hangisini seçtiğine göre değişiyordu.
- Kullanıcı verisi tarayıcıda (`localStorage`, karar 0006). Kullanıcının ekipman kaydı katalog kaydına `catalogId` ile, kimliği yoksa marka + model adıyla bağlanır. Kaydı katalogdan silmek bu bağı koparır; kullanıcı kaydını yeni kimliğe göç ettirmek yerel depolamaya yazmak demektir.
- Aynı ürün üreticinin başka ülke sayfalarında başka adla geçiyor (ABD "S 101", Finlandiya "S 201"); kullanıcı o adı yazabilir.

## Karar

1. **Veri modeli.** Katalogdaki `EquipmentProfile`'a (`src/data/catalog-equipment.ts`) iki isteğe bağlı alan eklenir:
   - `formerIds`: katalogdan kaldırılıp bu kayda birleştirilen eski kimlikler.
   - `aliases`: aynı ürünün öbür adları (eski katalog adı, üreticinin başka ülke sayfasındaki ya da kılavuzdaki yazımı).
   Kullanıcının veri modeli (`Equipment`, `packages/domain`), yerel depolama anahtarları ve yedek biçimi değişmez.
2. **Eşleme okuma anında yapılır.**
   - Kimlik dizini (`equipmentById`) eski kimliği kanonik kayda verir. Tarayıcının katalog parçaları (`buildEquipmentBucket`, `src/data/catalog-bucket-builders.ts`) eski kimliği kendi parçasına kanonik kaydın profiliyle yazar; parça yükleyicinin (`src/lib/catalog-slice.ts`) mantığı değişmez.
   - Marka + model dizini eş adları ikinci geçişte ekler; bir eş ad hiçbir kaydın kendi kimliğinin ya da adının önüne geçmez.
   - Ekipman ekleme penceresinin model araması (`equipmentMatchesModelQuery`) model adına ve eş adlara bakar; kayıt listede kendi adıyla bir kez görünür.
3. **Kural.** Yalnız aynı ürünün (aynı üretici ürün numarası, aynı nesil) kayıtları birleşir. Kaynak kuralları değişmez (`AGENTS.md`, "Kaynak bilgisini kaybetme"): kalkan kaydın kaynağı kanonik kaydın `additionalSourceUrls`'ine girer, kimliği, tarihi ve değerleri `docs/CATALOG_LOG.md`'de kalır. Ad farkı açıklamada gösterilir (`docs/DATA_SOURCES.md`, "Çelişki ve eksiklik"). Farklı nesil ya da farklı ürün birleştirilmez; değeri doğrulanamıyorsa karar 0019'la çekilir (ör. 2026-11-11, önceki nesil Oase BioMaster).
4. **Denetim.** `assertEquipmentRedirects` ekipman kataloğunun bütünlük denetiminde çalışır:
   - Eski kimlik katalogdaki bir kimlik olamaz; hedef her zaman eski kimliği taşıyan kayıt olduğu için zincir, döngü ve katalogdaki bir kaydı gölgeleme kurulamaz. Eski kimlik tek kayda yönlenir; boş ya da boşluklu olamaz.
   - Eş ad aynı markadaki hiçbir kaydın model adıyla (kendisi dahil; marka + model eşlemesi kategoriye bakmadığı için kategori fark etmez) ve başka kaydın eş adıyla çakışamaz.
   - Testler: `src/lib/__tests__/equipment-redirects.test.ts` (yönlendirme, eş ad, arama, ekleme penceresinin araması, parça yükleyici, eski kimlikli kaydın kanonik kayıtla aynı analizi, bozuk örneklerde denetimin hata vermesi) ve `scripts/test-catalog-flow.cjs`.

## Değerlendirilen seçenekler

- **Eski kayıtları katalogda bırakmak:** kullanıcı aynı ürünü iki kez görmeye, sonuç seçime bağlı olmaya devam eder. Seçilmedi.
- **Kullanıcı kayıtlarını yeni kimliğe göç ettirmek:** yerel depolamaya yazma ve göç kodu gerektirir, yedekten sonradan geri yüklenen eski kayıtları kapsamaz; ürün sahibi kaydın yeniden yazılmamasını istedi. Seçilmedi.
- **Ayrı bir yönlendirme tablosu:** kayıttan ayrı durur; kaydı silen ya da yeniden adlandıran bir değişiklikte kopabilir. Canlılardaki `aliases` gibi kayıtla birlikte tutmak seçildi.

## Sonuçlar

- **Kullanıcı verisine etkisi:** kayıt yazılmaz, silinmez. Kanonik kimlikle kayıtlı cihazın sonucu aynı kalır. Eski kimlikle ya da eski adla kayıtlı cihaz kanonik kaydın kaynaklı değerleriyle hesaplanır; PROTEMP S'te eski kayıtların çoğunda hacim yoktu, bu yüzden tek ısıtıcılı akvaryumda "Isıtıcı uygunluğu" bazı hacimlerde değişir (hacim aralıkları günlükte). Kartta katalogun güncel açıklaması görünür; kayıttaki ad ve açıklama yerinde kalır.
- Motor değişmez (`ENGINE_VERSION`, `RULESET_VERSION` aynı); altın fikstürdeki vakaların hiçbiri PROTEMP S kullanmıyor.
- **Geri alma:** iki alan isteğe bağlıdır. Geri almak için eski kayıtlar katalogda yeniden açılır ve alanlar silinir; kullanıcı verisi değişmediği için göç gerekmez.
