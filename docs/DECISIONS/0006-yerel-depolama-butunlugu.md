# 0006 — Yerel depolama bütünlüğü: karantina, kaydetme askısı ve günlüklü silme

- Tarih: 2026-09-03
- Durum: Kabul edildi (Issue #8) — PR #9 ile `main` dalına squash merge edildi (`76cabd2`, 2026-09-03). Codex denetimi temiz geçti; GitHub Actions `Doğrulama` ve Vercel üretim dağıtımı başarılı, canlı uygulama bu değişikliği içeriyor ve Issue #8 kapandı

## Bağlam

Phase 0A denetimi tarayıcı deposunda üç veri kaybı yolu tespit etmişti ve bunlar `main` üzerinde açıktı:

1. `JSON.parse` hatası tohum (demo) veriye düşüyordu; hidrasyondan hemen sonra çalışan kaydetme efektleri bu demo veriyi bozuk anahtarın üstüne yazıyordu.
2. Demo veri ilk ziyarette kalıcı hâle geliyordu; JSON yedeği demo kayıtları gerçek veriymiş gibi taşıyordu.
3. Akvaryum silme yalnızca akvaryum dizisini süzüyordu; ölçüm, bakım, canlı, bitki ve ekipman kayıtları yetim kalıyordu.

Ayrıca `packages/domain` içindeki Zod şemaları uygulamada hiç kullanılmıyordu ve tercih anahtarı ayarlar sayfasında doğrudan `JSON.parse` ile okunuyordu.

## Karar

### Karantina

Bozuk veya şemaya uymayan bir değer asla demo/varsayılan ile değiştirilmez. Ham değer `<anahtar>:corrupt:<ISO>` altına kopyalanır. Birincil anahtar **yalnızca kopya başarıyla yazıldıysa** onarılır (koleksiyonlarda geçerli satırlar veya boş dizi yazılır; tercihlerde anahtar kaldırılır, varsayılan yazılmaz). Kopya yazılamazsa birincil anahtara hiç dokunulmaz. Onarım, aynı bozuk değer için her açılışta yeni karantina anahtarı üretilmesini engeller.

Kısmen bozuk koleksiyonda geçerli satırlar korunur; ham değerin tamamı karantinada geri alınabilir kalır. Doğrulamadan geçen satırlar orijinal nesnelerdir, bu yüzden bilinmeyen ek alanlar kaybolmaz.

### Kaydetme askısı ve aktif günlük koruması

`localStorage` transaction desteklemez. Altı anahtarın tutarlı kalması için normal kaydetmeler üç katmanla engellenir:

1. Depolama modülünde askı sayacı; her `saveX()` ilk iş bunu kontrol eder.
2. `aquamind:journal:v1` anahtarının varlığı; aktif günlük varken normal kaydetmeler fiziksel olarak yazamaz. Bu, başka bir sekmenin veya beklenmedik bir efektin araya girmesini önler. Tam çoklu-sekme eşzamanlılığı bu fazın kapsamında değildir.
3. Sağlayıcıda `useRef` koruması; askı açıkken efektler `saveX()`'i hiç çağırmaz.

Günlüğün kendi kontrollü yazmaları bu korumayı bilerek atlar. Askı, altı kaydetme efektinden **sonra tanımlanmış** bir serbest bırakma efektiyle kaldırılır; efektler bir commit içinde tanımlanma sırasına göre çalıştığı için sıra deterministiktir.

Hidrasyon da askı altında yapılır. Bunun iki sonucu var: demo veri kalıcı olarak yazılmaz ve günlük toparlaması normal kaydetme başlamadan önce tamamlanır.

### Günlüklü silme

Sıra: günlük (silinecek kayıtların tam yükü) → silinen akvaryum paketi → altı koleksiyon → günlük silinir. Yıkıcı hiçbir yazma, veri kalıcı bir yerde durmadan önce yapılmaz. Günlük yazılamazsa silme reddedilir; kayıp yerine ret.

Açılışta günlük varsa işaretlenmemiş adımlar yeniden uygulanır. Adımlar yinelenebilir: koleksiyon süzme tekrar edilebilir, paket kimliği zaten varsa ikinci kez eklenmez.

Bozuk günlükte aktif veriye dokunulmaz, otomatik toparlama yapılmaz; ham değer karantinaya kopyalanır ve yalnızca kopya yazılabildiyse birincil anahtar temizlenir.

### Saklama ve yetim kayıtlar

Silinen akvaryum paketi 30 gün saklanır (`docs/SECURITY.md` içindeki ürün kuralıyla aynı); süresi dolanlar yüklemede temizlenir. Var olmayan bir akvaryuma bağlı mevcut yetim kayıtlar **otomatik silinmez**; sayılır, ayarlar sayfasındaki özette ve yedeğin ayrı bölümünde raporlanır.

### Dışa aktarma

Ana koleksiyonlar yalnızca geçerli ve yetim olmayan kullanıcı verisini taşır. Yetimler, karantinaya alınmış ham değerler ve silinen akvaryum paketleri ayrı ve etiketli bölümlerdedir. `LocalExportV1` sürümü 1 olarak kalır; yeni bölümlerin tamamı isteğe bağlıdır, bu yüzden eski yedekler geçerliliğini korur.

## Alternatifler

- **Tek veri belgesi (tek anahtar).** Altı koleksiyonu tek JSON'da tutmak atomik güncelleme sağlardı, ancak mevcut `:v1` anahtar biçimini kırar, geriye uyumluluğu bozar ve her yazmada tüm veriyi serileştirir. Günlük, aynı güvenceyi biçim değiştirmeden verir.
- **Bozuk anahtarın tamamını atmak.** Kısmen bozuk koleksiyonda geçerli satırları da atmak daha tutucuydu ama kullanıcı geçerli kayıtlarını kaybetmiş gibi hisseder. Ham değer zaten karantinada olduğu için geçerli satırları korumayı seçtik.
- **Elle yazılmış tip kontrolleri.** Zod yerine elle doğrulayıcı yazmak istemci paketini büyütmezdi, ancak alan tanımlarını `packages/domain` dışında çoğaltırdı (`AGENTS.md` bunu yasaklıyor).

## Sonuçlar

- Zod, doğrulama artık uygulamada kullanıldığı için istemci paketine girdi: ilk yükleme JS'i sayfa başına yaklaşık 26 kB arttı (`/settings` 110 → 138 kB, `/livestock` 188 → 214 kB). Veri bütünlüğü karşılığında kabul edilen bilinçli maliyet; ölçüm `PROJECT_STATUS.md` içinde kayıtlı.
- `:v1` anahtar adları ve JSON biçimi değişmedi. Değişiklik geri alınırsa eski kod aynı veriyi okumaya devam eder; yeni anahtarlar (`:corrupt:*`, `deleted-aquariums`, `journal`) eski sürümce yok sayılır.
- Silinen akvaryumlar için geri yükleme arayüzü yok; veri korunuyor, arayüz sonraki bir iştir.
- Phase 1'deki "yerel verileri içe aktar" akışı artık doğrulanmış, yetimsiz ve demo içermeyen bir yedekle başlayabilir.
