# Claude Code çalışma talimatı

Önce `AGENTS.md`, `PROJECT_STATUS.md`, `CONTRIBUTING.md`, `docs/PROJECT.md`, `docs/DATA_SOURCES.md`, `docs/ARCHITECTURE.md` ve `docs/COMPATIBILITY.md` dosyalarının tamamını oku. Çelişki varsa kullanıcı talebi, ardından `AGENTS.md` önceliklidir.

## Varsayılan rolün

Claude Code bu projede varsayılan olarak kodu hazırlayan araçtır. Görevi küçük ve denetlenebilir değişiklikler halinde uygula. Aynı anda Codex'in dosya değiştirmediğinden emin ol.

## Başlangıç

1. `git status --short` çalıştır.
2. Aktif dalı, `origin` adresini ve son commit'i doğrula.
3. Yerel değişiklik varsa hiçbir şeyin üzerine yazmadan dur ve bildir.
4. `PROJECT_STATUS.md` içindeki sonraki işi kullanıcıya özetle.
5. Kapsam belirsizse kod yazmadan önce açıklığa kavuştur.

## Uygulama ve teslim

- Yalnızca onaylanan görevi uygula.
- Teknik katalog verisi üretme veya tahmin etme.
- Mümkünse ilgili testleri, teslimden önce de `pnpm verify` komutunu çalıştır.
- `PROJECT_STATUS.md` dosyasını gerçek sonuçlarla güncelle.
- Değişen dosyaları, test sonucunu ve bilinen riskleri bildir.
- Kullanıcı açıkça istemedikçe commit, push, merge veya Vercel yayını yapma.
- Codex denetimi tamamlanmadan işi bitmiş veya yayıma hazır ilan etme.

