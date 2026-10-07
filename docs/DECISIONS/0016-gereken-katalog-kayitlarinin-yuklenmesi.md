# 0016 — Gereken katalog kayıtlarının yüklenmesi

- Tarih: 2026-10-07
- Durum: Önerildi — ürün sahibi (`buraksenfx`) 2026-10-07'de sayfa hızının ikinci adımına geçilmesini istedi ("sayfa hızından devam"). Yöntem teknik karardır (Claude). `codex/page-speed-2` dalında; Codex denetimi ve `main` birleştirmesi bekleniyor. `main` dalına birleştirilene kadar kabul edilmiş sayılmaz

## Bağlam

0015'ten sonra sağlık sayfası ve ana sayfa kataloğun tamamını hâlâ indiriyordu. İkisi de analiz için tam katalogu kullanan `@/lib/health-analysis`'i yüklüyordu:

- **Sağlık sayfası:** İlk yükleme 140 kB'ydi. Ardından tür, ekipman ve analiz parçaları iniyordu: ~240 kB sıkıştırılmış, ~1,5 MB açılmış JavaScript.
- **Ana sayfa:** Durum hesabı için aynı katalogu sonradan yüklüyordu.

Önizlemede bu parçalar sayfa açıldıktan sonra isteniyordu. Hızlı bir masaüstünde analiz canlıdakiyle aynı sürede geliyordu (0015, "Önizleme ölçümü"). Bir akvaryumun analizi ise yalnızca birkaç canlı ve ekipman kaydına ihtiyaç duyar.

## Karar

1. **Katalog parçaları:** Katalog sabit sayıda parçaya bölünür ve parçalar derleme anında durağan JSON olarak üretilir.
   - Yanıt dosyaları: `src/app/catalog-data/{species,equipment,species-names,equipment-models}/[bucket]/route.ts`. Hepsi `generateStaticParams`, `dynamic = "force-static"` ve `dynamicParams = false` kullanır.
   - Parça sayıları: 32 canlı (profil ve davranış kayıtları), 64 ekipman, 16 canlı ad dizini, 32 ekipman marka/model dizini.
   - Bir kaydın parçası, kimliğinin ya da biçimlendirilmiş adının 32 bit FNV-1a özetinden hesaplanır (`src/data/catalog-buckets.ts`). Sunucu ve tarayıcı aynı fonksiyonu kullanır.
   - Parça içeriği `src/data/catalog-bucket-builders.ts`'te üretilir. Ad ve model dizinleri, katalog modüllerinin kendi aramalarında kullandığı dizinlerdir (`speciesNameIndex`, `equipmentModelIndex`). JSON'da nesne yerine dizi kullanılır; böylece "constructor" gibi bir ad nesnenin kendi özelliğiyle karışmaz.
2. **Tarayıcıda yükleme:** Yükleyici (`src/lib/catalog-slice.ts`) yalnızca akvaryumdaki kayıtların parçalarını ister.
   - Katalog kimliği olmayan ya da katalogda bulunmayan eski kayıtlar için önce ad veya marka/model dizini parçası, sonra bulunan kaydın parçası istenir.
   - Eşleme kuralı katalog modüllerindekiyle aynıdır: katalog kimliği, yoksa bilimsel ad ya da ortak ad/eş ad (katalogda önce gelen), ekipmanda marka + model.
   - Parçalar sayfa açık kaldıkça bellekte tutulur. Başarısız istek önbellekten çıkarılır, böylece yeniden denenebilir.
   - Yüklenmemiş bir kayda bakılırsa sessizce "bulunamadı" denmez, hata fırlatılır.
3. **Analiz çekirdeği:** Analiz kodu iki katmana ayrıldı.
   - `src/lib/health-analysis-core.ts` veri içermez: davranış kuralları ve `createHealthAnalyzer(lookup)` burada.
   - `src/lib/health-analysis.ts` tam katalogla aynı çekirdeği kullanır; `analyzeAquarium` imzası ve çıktısı aynı kaldı (betikler ve testler için).
   - `isVerifiedSpeciesProfile`, `isVerifiedEquipmentProfile` ve `brandModelKey` veri içermeyen `catalog-shared.ts`'e taşındı. Katalog modülleri bunları aynen yeniden dışa aktarır.
   - `water-status.ts` ve `dashboard-status.ts` veri içermez; türleri kendilerine verilen `CatalogLookup` üzerinden alırlar.
4. **Sayfalar:** Sağlık sayfası ve ana sayfa, `useCatalogLookup` kancasıyla (`src/lib/use-catalog-lookup.ts`) yalnızca gereken parçaları yükler.
   - Analiz motoru sayfayla birlikte gelir (~9 kB sıkıştırılmış); sonradan ayrı bir JavaScript isteği yoktur.
   - Kayıt listesi değişince (ör. başka akvaryum seçildi) yeniden yüklenir. Bir listenin yüklemesi başka liste için kullanılmaz.
   - Hata ve yeniden deneme davranışı 0015'teki gibidir: sağlık sayfasında "Analiz yüklenemedi" ile "Yeniden dene", ana sayfada "Durum yüklenemedi; sayfayı yenileyin.".
5. **Gizlilik:** Kullanıcı verisi sunucuya gitmez. Tarayıcı yalnızca parça numarası ister (ör. `/catalog-data/species/28`). Parça numarası kimliğin değil özetin kalanıdır ve ortalama 13 türü kapsar (423 tür / 32 parça).

## Sonuçlar (yerel ölçüm)

| Ölçüm | 0015 sonrası | Bu değişiklikle |
|---|---|---|
| Sağlık sayfası ilk yükleme (sıkıştırılmış JS) | 140 kB | 149 kB |
| Sağlık sayfasının sonradan indirdiği katalog | ~240 kB JS (3 parça) | örnek akvaryumda 6 JSON parçası (~113 kB ham; parça başına en çok 7,6 kB sıkıştırılmış) |
| Ana sayfa ilk yükleme | 139 kB | 149 kB |
| Ana sayfanın sonradan indirdiği katalog | ~240 kB JS | aynı 6 JSON parçası |
| Sağlık analizi hazır (yerel üretim sunucusu) | 1.073 ms ilk açılış, 254 ms ikinci | 808 ms ilk açılış, 241 ms ikinci |

- İlk yükleme, analiz motoru sayfayla birlikte geldiği için yaklaşık 10 kB arttı. Karşılığında ~1,5 MB açılmış katalog kodu artık ne indiriliyor ne de çalıştırılıyor.
- JSON'u çözmek, aynı veriyi JavaScript kodu olarak çalıştırmaktan daha hızlıdır.
- Canlılar, ekipman ve ürünler sayfaları değişmedi; onlar katalogun tamamını listeler.

## Davranışın değişmediğinin kanıtı

- `src/lib/__tests__/catalog-slice.test.ts`:
  - Altın fikstürdeki 1.033 vakanın hepsinde, yalnızca gereken parçalarla yapılan analiz ve ana sayfa durumu tam katalogdakiyle aynı. Parçalar ağdan gelmiş gibi JSON'a çevrilip geri okunuyor.
  - Katalog kimliği olmayan canlılarda (bütün adlar ve yazım varyasyonları, geçersiz kimlik) ve ekipmanlarda (marka/model varyasyonları) eşleme tam katalogdakiyle aynı.
  - Her katalog kaydı tam olarak bir parçada ve katalog sırasıyla duruyor. Ad ve model dizinleri katalog modüllerinin dizinlerinin tamamını taşıyor. Yanıt dosyaları üretici içeriğini döndürüyor.
  - Örnek akvaryumda yalnızca gereken parçalar isteniyor. Başarısız indirme yeniden denenebiliyor. Yüklenmemiş bir kayda bakmak hata veriyor.
- `src/lib/__tests__/catalog-lookup.test.ts`: parça yükleyen modüller (yükleyici, çekirdek, kanca, durum modülleri, ana sayfa, sağlık sayfası) katalog verisini değer olarak içe aktarmıyor. Kaynak dosyalarında NUL baytı yok.
- Yerel üretim sunucusunda:
  - Sağlık sayfasında puan 90, yük %70 ve uyarılar canlıdakiyle aynı. Ana sayfanın özet cümlesi ve dört kartı canlıdakiyle birebir aynı.
  - Hata yolu denendi: araya konan yerel bir sunucu `/catalog-data` isteklerine 503 döndü; iki sayfa da hata mesajını gösterdi. Kesinti kaldırılınca "Yeniden dene" sayfayı yenilemeden analizi açtı.

## Değerlendirilen alternatifler

- **Analizi sunucuda yapmak:** Kullanıcı verisi sunucuya gönderilmiş olurdu (0015). Seçilmedi.
- **Ayrı bir derleme betiğiyle `public/` altına JSON üretmek:** Derleme ve doğrulama komutlarına ek adım, önbellek sürümleme ve git dışında tutulan üretilmiş dosyalar gerekirdi. Next'in durağan yanıtları aynı işi ek araç olmadan yapıyor. Seçilmedi.
- **Kayıt başına bir dosya:** 3.964 dosya üretilirdi ve bir akvaryum için istek sayısı artardı. Parçalar istek sayısını sınırlıyor. Seçilmedi.

## Geri alma

`src/app/catalog-data/`, `catalog-buckets.ts`, `catalog-bucket-builders.ts`, `catalog-slice.ts`, `use-catalog-lookup.ts` ve `health-analysis-core.ts` kaldırılır. `health-analysis.ts`, `water-status.ts`, `dashboard-status.ts` ve iki sayfa 0015'teki hâline döndürülür. Motor ve veri değişmediği için altın fikstür etkilenmez.
