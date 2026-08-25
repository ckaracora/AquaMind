# AquaMind ortak çalışma rehberi

Bu proje iki kişi tarafından sırayla geliştirilir. Aynı anda çalışma yapılmaz.

## Çalışmayı devralma

1. Diğer kişinin işi bıraktığını ve GitHub'a gönderdiğini doğrula.
2. Proje klasörünü Codex veya Claude Code ile aç.
3. `AGENTS.md` ve `PROJECT_STATUS.md` dosyalarını oku.
4. `git status --short` sonucunun temiz olduğunu doğrula.
5. `git pull --ff-only origin main` çalıştır.
6. Son commit'i `PROJECT_STATUS.md` ile karşılaştır.

Yerel değişiklik varsa pull yapma. Dosyaları silme veya resetleme; önce diğer kişiyle konuş.

## Görev üzerinde çalışma

- Bir seferde yalnızca bir açık görev üzerinde çalış.
- Claude Code kodu hazırlar.
- Claude işi bitirince dosya değiştirmeyi bırakır.
- Codex aynı değişiklikleri inceler ve `pnpm verify` çalıştırır.
- Codex'in bulguları varsa önce Claude'a düzelttirilir, sonra tekrar denetlenir.

## Görevi teslim etme

1. `pnpm verify` başarılı olmalı.
2. `PROJECT_STATUS.md` güncellenmeli.
3. Değişiklik özeti diğer kişiye gönderilmeli.
4. Kullanıcı açıkça onay verirse commit ve push yapılmalı.
5. Push sonrasında GitHub'daki commit doğrulanmalı.
6. Diğer kişiye “çalışmayı devralabilirsin” denmeli.

## Kesinlikle yapılmayacaklar

- Aynı anda iki bilgisayardan geliştirme yapmak
- Claude ve Codex'e aynı anda dosya değiştirtmek
- Doğrudan dosya klasörünü mesajlaşma uygulaması veya USB ile taşımak
- GitHub'dan çekmeden eski kopya üzerinde çalışmak
- Test geçmeden işi tamamlandı saymak
- Parola, API anahtarı veya `.env` dosyasını GitHub'a yüklemek

