# 0024 — Bitki sayfasında katalogdan seçme

- Tarih: 2026-10-28
- Durum: Kabul edildi. Ürün sahibi 2026-10-28'de taslaktaki (`https://claude.ai/artifact/8Umv9pEraBUmRZeSuq9zU4`) dört konunun dördünde de Claude'un önerisini seçti. Bitki kataloğunun (`docs/DECISIONS/0023-bitki-katalogu.md`) ilk kullanımıdır.

## Bağlam

Bitki kataloğunda Türkiye'de satılan 138 bitki ve form var (0023). Bitki sayfasında kullanıcı bitkiyi hâlâ elle yazıyordu; kaynaklı bilgiler (ışık, CO₂, sıcaklık, pH, boy, büyüme, yerleşim, istilacı tür listeleri) ekranda görünmüyordu.

Claude kodlamadan önce telefon ekranında üç görünümlü bir taslak gösterdi: arama, seçilen bitkinin bilgi kartı ve bitki listesindeki kart. Taslakta ürün sahibine dört soru soruldu.

## Karar

1. **Bitki listesindeki kart:** kısa bilgi (ışık, CO₂, boy). Sıcaklık, pH, büyüme ve kaynaklar karttaki "Ayrıntılar" düğmesiyle açılır.
2. **Yerleşim:** kaynağın önerdiği yerleşim pencerede seçili gelir ve değiştirilebilir. Alanın altında "Kaynağın önerisi: …" yazar. Kaynak birden çok yer yazıyorsa ilki seçilir, hepsi yazılır. Kaynak yerleşim yazmıyorsa konum "Seçilmedi" gelir ve "Kaynak yerleşim yazmıyor" yazar; tahmin edilmez (Codex 1. tur).
3. **İstilacı tür uyarısı:** hem seçerken hem bitki kartında görünür. Pencerede uzun metin var: "Doğaya bırakmayın.", hangi listelerde olduğu (UF/IFAS) ve "Bu, Türkiye'de yasak olduğu anlamına gelmez." Kartta kısa satır var.
4. **Kaynakta olmayan bilgi:** "Kaynakta yok" yazar (ör. Tropica'ya dayanan bitkilerde sıcaklık ve pH).

Teknik kararlar (Claude):

- **Arama:** bilimsel ad, eş ad ve satış adında yapılır (`searchPlants`, `src/data/catalog-plants.ts`). Harflerin işaretleri (Türkçe harfler, 'Windeløv'), büyük-küçük harf, tırnak ve noktalama gözetilmez. Sözcüklerin hepsi aynı adda geçmelidir.
  - Kesme işareti sözcüğü bölmez ('H'ra' → "Hra"); öbür işaretler sözcük arasıdır.
  - Sıra: adın tamamı, adın başı, bir sözcüğün başı, adın içi. Aynı sırada kısa ad önce gelir ("anubias" aramasında *Anubias nana*).
  - Pencerede en çok sekiz sonuç gösterilir. Aramaya uyan ad, kayda bitki adı olarak önerilir ve değiştirilebilir.
- **Kayıt:** katalogdan seçilen bitki kayda katalog kimliği (`Plant.catalogId`, isteğe bağlı yeni alan) ve katalogdaki bilimsel adla yazılır.
  - "Katalogda yok, kendim yazacağım" seçeneği bugünkü elle yazma formudur.
  - Bitki seçilmeden gönderilen pencere kayıt kurmaz; arama alanında Enter formu göndermez (Codex 2. tur). Varsayılan tarih cihazın yerel günüdür (`localIsoDate`, PR #50).
  - Kimliği olmayan eski ve elle yazılan kayıtlar bilimsel adla katalogla eşleşir (`plantForRecord`). Bilimsel ad yazılı ama katalogda yoksa kayıt eşleşmez, çünkü ad daha genel bir satış adı olabilir. Ad yalnız bilimsel ad boşsa denenir. Kayıtları değişmez.
  - Katalogdan çıkmış bir kimlik başka kayda düşmez.
- **Yükleme:** katalog sayfanın ilk yüklemesine girmez.
  - Pencere açılınca ya da listede bitki varken ayrı bir parça olarak yüklenir (`src/lib/use-plant-catalog.ts`; 0016'daki "gereken kayıtlar sonradan yüklenir" ilkesi).
  - Yüklenirken ve yüklenemediğinde elle yazma seçeneği kalır; yüklenemezse "Yeniden dene" var.
- **Biçim:** sıcaklık ayarlardaki birimle, sayılar dilin ayırıcılarıyla yazılır. Metinler dil dosyasında (`t.plants.catalog`).

## Sonuçlar

- Bitki sayfasının ilk yüklemesi 150 kB'tan 153 kB'a çıktı: arayüz kodu ve metinler. Ana sayfa ve canlılar sayfası da 1'er kB büyüdü, çünkü dil dosyası ortak pakette. Katalog verisi ayrı parçadadır (yaklaşık 74 kB, sıkıştırılmış 11 kB).
- `src/lib/__tests__/plant-catalog.test.ts` uygulama kodunun kataloğu yalnız kancadaki ayrı parça olarak yüklediğini denetler; öbür dosyalar ondan yalnız tür alır.
- Kullanıcının bitki kaydına isteğe bağlı `catalogId` alanı eklendi (`packages/domain`). Eski kayıtlar ve yedekler geçerli kalır; motor ve altın fikstür değişmedi. Motor bitkileri kullanmaz.
- Bitkiye göre motor uyarıları (ör. "bu bitki yüksek ışık ister", sıcaklık uyumu) bu kararın dışındadır; ayrı onayla gelir.
- Su bitkisi olmayan bitkiler için uyarı (0023, karar 4), o bitkiler kataloğa girdiğinde aynı yerde gösterilecek.
