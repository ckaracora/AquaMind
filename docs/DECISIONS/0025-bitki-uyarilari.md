# 0025 — Bitki uyarıları

- Tarih: 2026-10-28
- Durum: Kabul edildi. Ürün sahibi 2026-10-28'de dört sorunun dördünde de Claude'un önerisini seçti. Bitki kataloğunun (`docs/DECISIONS/0023-bitki-katalogu.md`) ve bitki seçmenin (`docs/DECISIONS/0024-bitki-secme.md`) devamıdır.

## Bağlam

Bitki kayıtları artık katalogla eşleşiyor (0024). Katalogda bitkinin ışık ve CO₂ ihtiyacı, boyu ve kaynak yazıyorsa sıcaklık ve pH aralığı var. Akvaryumun ekipmanı ve son su ölçümü de kayıtlı. Bu bilgiler yan yana konduğunda kullanıcıya somut bir uyarı verilebilir: "bu bitki CO₂ ister, sende CO₂ sistemi yok" gibi. Sağlık analizi motoru bugüne kadar bitkileri hiç almıyordu.

## Karar

Ürün sahibinin seçtiği dört konu:

1. **Dört uyarı.** Hepsi yalnız kaynakta yazan değerleri kullanır; yeni bir sayısal eşik konmaz.
   - **CO₂:** kaynağa (Tropica) göre yüksek CO₂ isteyen bitki var, akvaryumda CO₂ ekipmanı kayıtlı değil → sarı uyarı. Metinde Tropica'nın "yüksek" tanımı yazar: yaklaşık 15–25 mg/L (`docs/DATA_SOURCES.md`). Bugün katalogda 7 bitki.
   - **Işık:** bitkinin ışık aralığının alt ucu orta ya da yüksek, akvaryumda aydınlatma kayıtlı değil → sarı uyarı. Işığın gücü ölçülmez; yalnız aydınlatmanın varlığına bakılır. Bugün 76 bitki.
   - **Sıcaklık ve pH:** son su ölçümü bitkinin kaynaktaki aralığının dışında → sarı uyarı. Sınır değerler aralığın içindedir. Bugün sıcaklık aralığı 62, pH aralığı 61 bitkide var.
   - **Boy:** bitkinin kaynaktaki boyu akvaryumun yüksekliğinden büyük → mavi bilgi notu ("Bitki su yüzeyine ulaşır; düzenli budama gerekir"). Eşitse ya da akvaryumun yüksekliği girilmemişse not çıkmaz.
2. **Sağlık puanını etkilemez.** Puan, ölçütler, genel durum ve sağlık analizinin uyarıları değişmez.
3. **Nerede görünür:** sağlık analizinde ayrı "Bitki uyarıları" bölümünde ("Bitki uyarıları sağlık puanını etkilemez." notuyla) ve bitki sayfasında bitkinin kartında.
4. **Aralığı kaynakta olmayan bitki:** uyarı ya da not çıkmaz (ör. Tropica'ya dayanan bitkilerde sıcaklık ve pH). Ölçüm yoksa ya da ölçümde o değer yoksa da çıkmaz.

Teknik kararlar (Claude):

- **Motorda ayrı işlev:** `assessPlants(aquarium, plants, equipment, latest?)` (`packages/compatibility-engine/src/plants.ts`). `analyzeAquarium`'un imzası, çıktısı ve altın fikstür değişmez.
  - Paketin ayrı girişidir (`@aquamind/compatibility-engine/plants`). Yalnız tip içe aktarır, bu yüzden bitki sayfası motorun geri kalanını yüklemez.
  - Katalogla eşleşmeyen bitki (profil verilmeyen) atlanır. Uyarıda bitkinin kullanıcının kaydındaki adı yazılır; ad boşsa kaynaktaki bilimsel ad.
  - Sıra: bitkilerin sırası, her bitkide CO₂, ışık, sıcaklık, pH, boy.
- **Sürüm:** `ENGINE_VERSION` 1.11.0. `RULESET_VERSION` 1.9.0'da kalır: bitki kurallarında puan cezası ve motora gömülü eşik yok.
- **Sonuç biçimi:** her uyarı `plantId`, `level` (`warning` ya da `info`), `code`, `params` ve Türkçe `title`, `message` taşır; sağlık analizinin uyarılarıyla aynı düzen (0021, 3. paket). Beş kod: `plantCo2`, `plantLight`, `plantTemperature`, `plantPh`, `plantHeight`.
- **Metinler:** dil paketinin ayrı girişinde (`@aquamind/localization/plant-warnings`, `messages/tr-plant-warnings.ts`). Ana giriş bunu içe aktarmaz; metinler yalnız bitki ve sağlık sayfalarının paketine girer.
  - Sözcükler motorun Türkçe metniyle aynıdır.
  - Sıcaklık kullanıcının birim tercihiyle yazılır (°C ya da °F).
  - Son ölçüm, aştığı sınırla aynı görünecek kadar yuvarlanmaz ("aralık 20–28 °C; son ölçüm 28,004 °C").
- **Hesap:** `src/lib/plant-warning-text.ts` → `checkAquariumPlants`. Yalnız o akvaryumun bitkileri, ekipmanı ve ölçüm zamanı en yeni su ölçümü kullanılır (sağlık analiziyle aynı "son ölçüm"). Bitki katalogla `plantForRecord` ile eşleşir (0024); eşleşmeyen bitkiler ayrıca döner (Codex 1. tur).
- **Ekran:** `src/components/plant-warnings.tsx`.
  - Bitki kartında kısa liste (`PlantCardWarnings`).
  - Sağlık analizinde öneriler bölümünün altında ayrı bölüm (`PlantWarningsSection`): önce sarı uyarılar, sonra bilgi notları. Akvaryumda bitki yoksa bölüm görünmez. Bitki kataloğu ayrı parça olarak yüklenir (`usePlantCatalog`); yüklenirken bekleme metni, yüklenemezse yeniden deneme düğmesi var.
  - Katalogla eşleşmeyen bitki (ör. elle yazılmış ve katalogda olmayan) değerlendirilemez. Bölüm bu bitkileri adlarıyla yazar ("Katalogla eşleşmeyen bitkiler için uyarı hesaplanmadı: …"). Hiçbir bitki eşleşmediyse yeşil "uyarı yok" gösterilmez; bir kısmı eşleştiyse yeşil sonuç "Katalogla eşleşen bitkiler için uyarı yok" der (Codex 1. tur).
  - Bitki sayfasında katalog yüklenemezse listenin üstünde bunu söyleyen satır ve yeniden deneme düğmesi görünür; kartlar kısa bilgi ve uyarı olmadan kalır (Codex 1. tur).

## Sonuçlar

- Kullanıcı bitkisinin akvaryumuna uyup uymadığını kaynaklı bir gerekçeyle görür; sağlık puanı bitkiler yüzünden düşmez.
- Işık uyarısı yalnız aydınlatmanın kayıtlı olup olmadığına bakar. Kayıtlı aydınlatmanın gücü yetersizse uyarı çıkmaz; ışık gücü ölçüsü katalogda yok.
- Sıcaklık aralığı yalnız 62, pH aralığı 61 bitkide var (138 bitkiden; veri kapsamı: `docs/DATA_COVERAGE.md`); öbür bitkilerde bu uyarılar çıkmaz.
- Bitki yiyen balık uyarısı yok: kaynaklı bir veri yok.

## Doğrulama

- `packages/compatibility-engine/test/plants.test.ts`: her kural, sınır değerler, aralığı ya da ölçümü olmayan bitki, eşleşmeyen bitki, kullanıcının verdiği ad, sıra, girişlerin değişmemesi ve ayrı girişin yalnız tip içe aktarması.
- `src/lib/__tests__/plant-warnings.test.ts`: dil dosyasının metni motorun metniyle aynı (her kod, iki yön); °F yazımı; yuvarlamanın farkı gizlememesi; sayıların biçimleyiciden geçmesi; karşılığı olmayan kodda motorun metni; yalnız o akvaryumun kayıtları ve en son ölçüm; ayrı girişler.
- Altın fikstür testi değişmeden geçer.
