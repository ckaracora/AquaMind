# AquaMind görev ve devir sistemi

Görev panosu: `https://github.com/users/ckaracora/projects/1`

## Temel kural

Aynı anda yalnızca bir kişi çalışır ve yalnızca bir GitHub Issue aktif geliştirmededir. Görev numarası olmadan ürün kodu veya katalog verisi değiştirilmez.

## Görev durumları

1. **Fikirler:** Henüz kapsamı netleşmemiş öneriler
2. **Hazır:** Amaç ve kabul ölçütleri yazılmış görevler
3. **Yapılıyor:** Bir kişinin devraldığı tek aktif görev
4. **Codex kontrolü:** Claude değişikliği bitirdi, Codex inceliyor
5. **Tamamlandı:** Test, kullanıcı kontrolü ve gerekli GitHub işlemleri tamamlandı

## Görevi başlatma

- Uygun GitHub Issue şablonuyla görev açılır.
- Amaç, kapsam, kapsam dışı işler ve kabul ölçütleri yazılır.
- Uygulayıcı seçilir.
- `PROJECT_STATUS.md` içindeki “Sıradaki tek iş” bu görev numarasıyla güncellenir.

Claude Code başlangıç komutu:

```text
AGENTS.md, CLAUDE.md, PROJECT_STATUS.md ve GitHub Issue #NUMARA içeriğini tamamen oku. Git durumunu doğrula. Yerel değişiklik varsa dur. Görevin amacını, kapsamını, kapsam dışını ve kabul ölçütlerini özetle. Ben onaylamadan kod yazma.
```

## Claude'dan Codex'e devir

Claude, kod yazmayı bıraktıktan sonra şu özeti hazırlar:

```text
Görev: #NUMARA
Amaç:
Değişen dosyalar:
Yapılanlar:
Kapsam dışı bırakılanlar:
Çalıştırılan testler ve sonuçları:
Bilinen riskler:
PROJECT_STATUS.md güncellendi mi:
Commit/push/yayın durumu:
```

## Codex denetimi

Codex'e şu komut verilir:

```text
GitHub Issue #NUMARA, AGENTS.md ve PROJECT_STATUS.md dosyalarını oku. Claude'un yaptığı yerel değişiklikleri salt inceleme yaklaşımıyla denetle. Önce git diff ve değişen dosyaları incele. Hata, veri kaybı, mobil uyumsuzluk, kaynak doğruluğu ve kapsam dışı değişiklik ara. pnpm verify çalıştır. Bulguları önem sırasıyla bildir. Kullanıcı açıkça istemedikçe dosya değiştirme, commit, push veya yayın yapma.
```

## Denetim sonucu

- Codex bulgu bulursa görev Claude'a geri döner.
- Claude yalnızca raporlanan sorunu düzeltir ve tekrar devir özeti verir.
- Codex bulgu bulmaz ve testler geçerse kullanıcı son kontrolü yapar.
- Kullanıcı açıkça onayladıktan sonra commit ve push yapılır.
- GitHub ve gerekiyorsa Vercel sonucu doğrulanır.
- Issue kapatılır ve `PROJECT_STATUS.md` sıradaki görevle güncellenir.

## Bilgisayarlar arası devir mesajı

```text
AquaMind çalışması devredildi.
Tamamlanan Issue: #NUMARA
Son commit: HASH VE BAŞLIK
main GitHub'a gönderildi: Evet/Hayır
pnpm verify: Başarılı/Başarısız/Çalıştırılmadı
Vercel: Güncellendi/Güncellenmedi/Kontrol edilmedi
Canlı uygulama: BAĞLANTI
Canlı uygulama bu değişiklikleri içeriyor: Evet/Hayır/Bilinmiyor
Görev branch'i veya Pull Request: BAĞLANTI
Yerel çalışma alanı: Temiz/Değişiklik var
Sıradaki Issue: #NUMARA
Çalışmayı devralabilirsin: Evet/Hayır
```

## Kısa devir komutu

Kullanıcı **“AquaMind'i GitHub'a devret”** dediğinde çalışan araç:

- mevcut Issue ve branch'i doğrular,
- `PROJECT_STATUS.md` dosyasını günceller,
- `pnpm verify` çalıştırır,
- başarılıysa açıklayıcı commit oluşturur,
- yalnızca mevcut görev branch'ini GitHub'a gönderir,
- commit ve uzak branch sonucunu raporlar,
- görev branch'i veya Pull Request bağlantısını raporlar,
- sonuç mesajına `PROJECT_STATUS.md` içindeki güncel canlı uygulama bağlantısını ekler,
- canlı yayının görevdeki son değişiklikleri içerip içermediğini açıkça belirtir.

Bu komut `main` birleştirmesi veya Vercel yayını yapmaz.

## Kısa devralma komutu

Kullanıcı **“AquaMind'i GitHub'dan devral”** dediğinde çalışan araç:

- yerel çalışma alanının temiz olduğunu doğrular,
- uzak dalları yeniler ve devredilen görev branch'i ile commit'i doğrular,
- devir belgelerini ve değişiklikleri okur,
- güvenliyse görev branch'ini `--ff-only` yöntemiyle devralır,
- `pnpm verify` çalıştırır ve sıradaki işi özetler,
- görev branch'i veya Pull Request bağlantısını raporlar,
- güncel canlı uygulama bağlantısını ve bu yayının devredilen değişiklikleri içerip içermediğini açıkça belirtir.

Yerel değişiklik varsa hiçbir dosyanın üzerine yazılmaz. Bu komut commit, push, `main` birleştirmesi veya Vercel yayını yapmaz.
