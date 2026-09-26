# 0007 — Katalog entegrasyonu: yaşam ortamı, tuzluluk, ek hacim ve yardımcı filtre kuralları

- Tarih: 2026-09-24
- Durum: Önerildi — ürün sahibi (`buraksenfx`) beş kuralı 2026-09-24'te açıkça onayladı; Codex denetimi temiz geçti ve PR #11 açıldı; `main` birleştirmesi bekliyor. `main` dalına birleştirilene kadar kabul edilmiş sayılmaz

## Bağlam

`codex/catalog-capacity-batch` dalı (son commit `950a70f`, 2026-09-14) kataloğu 228'den 417 canlıya, 1557'den 3009 ekipmana ve 507'den 1027 bakım ürününe genişletti. Dal, Phase 0B'den önceki `main` commit'inden (`242f899`) ayrıldığı için motor değişikliklerini eski `src/lib/health-analysis.ts` içinde yapmıştı. Motor ise Phase 0B'de `packages/compatibility-engine` paketine taşınmıştı; bu yüzden birleştirmede bu dosya çakıştı.

Katalogdaki yeni alanlar (su türü, özgül ağırlık, birey başına ek hacim, isteğe bağlı tank uzunluğu, pasif ve yardımcı filtre işaretleri) bu kurallar olmadan motorda kullanılamıyordu.

## Karar

Dalın motor kuralları pakete birebir taşındı:

1. **Yaşam ortamı:** Canlının su türü (`waterTypes`; belirtilmemişse yalnızca tatlı su) akvaryum türünü içermiyorsa 80 uyum cezası ve tehlike uyarısı verilir.
2. **Tuzluluk:** Özgül ağırlık aralığı tanımlı profillerde ölçüm yoksa uyarı, son ölçüm aralık dışındaysa tehlike uyarısı verilir; özgül ağırlık su değeri uyumuna dahildir. `WaterParameters` tipine ve Zod şemasına isteğe bağlı `specificGravity` alanı eklendi.
3. **Alan:** Gereken hacim, en az hacme her ek birey için tanımlı ek hacmin eklenmesiyle bulunur. Kaynak tank uzunluğu yayımlamıyorsa yalnızca hacim denetlenir ve bunu açıklayan bir uyarı gösterilir.
4. **Filtre türleri:** Pasif parçalar filtrasyon hesabına girmez. Yardımcı filtreler ana filtre sayılmaz; akvaryumda yalnız yardımcı filtre varsa tehlike uyarısı verilir.
5. **Akıntı:** Akıntı bilgisi olmayan profiller akıntı karşılaştırmasına girmez.

Motor kataloğu içe aktarmamaya devam eder. Su türü varsayılanı motor içinde uygulanır; katalogdaki `speciesWaterTypes` seçici ekranlar için kalır. `ENGINE_VERSION` ve `RULESET_VERSION` 1.1.0'a yükseltildi.

## Doğrulama

- Pakete taşınan motor, aynı birleşik katalog üzerinde dalın özgün motoruyla 1020 altın vakanın tamamında birebir aynı çıktıyı verdi.
- Altın fikstür, ürün sahibi onayından sonra yeniden üretildi (604 vakadan 1020 vakaya); birleştirme commit'inden ayrı bir commit'te (`0698435`) kaydedildi. Her tür kendi su türündeki akvaryumda denenir.
- `scripts/test-health.cjs`, dalın 52 senaryosuyla değişmeden çalışır.

## Sonuçlar

- Tatlı su canlısı tuzlu veya acı su akvaryumunda (ve tersi) artık tehlike uyarısı alır.
- Yeni alanların tamamı isteğe bağlıdır; mevcut kullanıcı kayıtları ve `localStorage` biçimi değişmez.
- Bu kararda bilerek ele alınmayan, 2026-09-24 uyumluluk denetiminde bulunan sorunlar ayrı görevlerdir:
  - Genel puan sekiz ölçütün ortalaması olduğu için tehlike uyarısı varken "iyi" görünebilir.
  - Amonyak, nitrit ve nitrat değerlendirilmez; ana sayfadaki su değeri etiketleri sabittir.
  - Filtre ve biyolojik yük eşikleri, üretici değerleriyle çelişen yanlış alarmlar üretir.
  - Bazı yaygın türlerde davranış işaretleri (avcılık, yüzgeç ısırma, aynı tür içi saldırganlık) eksiktir.
