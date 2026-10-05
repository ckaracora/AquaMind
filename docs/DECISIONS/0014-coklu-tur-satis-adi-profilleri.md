# 0014 — Birden fazla türü kapsayan satış adı profilleri

- Tarih: 2026-10-05
- Durum: Önerildi — ürün sahibi (`buraksenfx`) 2026-10-05'te soru formuyla "en koruyucu değerler" seçeneğini açıkça onayladı (önerilen seçenek). `codex/species-identity-3` dalında; Codex denetimi ve `main` birleştirmesi bekleniyor. `main` dalına birleştirilene kadar kabul edilmiş sayılmaz

## Bağlam

Kaynağı yalnızca FishBase olan türlerin taramasında (`docs/CATALOG_SOURCE_GAPS.md`) üç kaydın sorunu kaynak eksikliği değil kimlik çıktı. Bu adlarla satılan balıklar katalogdaki bilimsel türler değildi:

- `common-pleco` (*Hypostomus plecostomus*): Practical Fishkeeping'e göre "common plec" olarak satılanlar *Pterygoplichthys pardalis* ve *P. disjunctivus*; ticarette ikisi ayrılmıyor ve melez olabiliyor. Fishkeeper'ın "Common Plec" sayfası *P. pardalis*.
- `siamese-algae-eater` (*Crossocheilus oblongus*): Seriously Fish'e göre *C. oblongus* ticarette neredeyse hiç yok; Siyam yosun yiyicisi olarak satılanlar *C. langei*, *C. atrilimes* ve *C.* sp. 'citripinnis'.
- `ancistrus` (*Ancistrus cirrhosus*): Seriously Fish ve PlanetCatfish ticari cüce vatozu, kimliği kesinleşmemiş, büyük olasılıkla melez kökenli bir üretim balığı (*Ancistrus* sp. '3') olarak ele alıyor.

`docs/DATA_SOURCES.md` şunu söylüyor: "Ticari ad birden fazla türe uyuyorsa ... eşleme yapılmaz; kayıt çözülmemiş tutulur". Bu kural mağaza başlıklarını profillere bağlarken yazıldı. Ama bu üç profil katalogda zaten var ve kullanıcı kayıtları (örnek akvaryumdaki iki cüce vatoz dahil) kimliklerine (`id`) bağlı. Profili kaldırmak ya da "doğrulanmamış" yapmak, sağlık analizinin bu balıkları hesaba katmaması demek. Örneğin 100 litrelik akvaryumdaki pleko için alan uyarısı kaybolur.

## Karar

1. Satış adı tek bir bilimsel türe denk gelmeyen mevcut profil, satılan balığa göre tanımlanır. Profil kimliği (`id`) ve görünen adı değişmez.
2. Satılan balık tek bir üretim balığıysa (cüce vatoz), bilimsel ad uzman kaynağın kullandığı addır (*Ancistrus* sp. '3') ve değerler o kaynaktan gelir.
3. Satış adı birden fazla türü kapsıyorsa (pleko, Siyam yosun yiyicisi):
   - Bilimsel ad adayları gösterir: "*Pterygoplichthys pardalis* / *P. disjunctivus*", "*Crossocheilus langei* / *C. atrilimes*".
   - Değerler adaylar arasında kaynaklı ve en koruyucu olanlardır: kaynakların verdiği en büyük boy ve en büyük akvaryum.
   - Sıcaklık ve pH için birincil kaynağın aralığı kullanılır. Birincil kaynak (Seriously Fish) yoksa, tür özelinde aralık veren bütün bakım kaynaklarının ortak aralığı alınır (diskustaki yöntem). FishBase'in doğal yaşam alanı ölçümleri bu hesaba katılmaz. Kaynaklar arasındaki fark bakım notunda kullanıcıya açıklanır.
   - Kaynakta olmayan değer uydurulmaz. Kaynak yetişkin için uzunluk vermiyorsa uzunluk boş bırakılır ve kullanıcıya not yazılır.
4. Eski bilimsel ad ve aday türlerin adları arama için eş ad (`aliases`) olarak tutulur. Kimlik belirsizliği bakım notunda (`husbandryCaution`) kullanıcıya açıklanır.
5. Bu istisna yalnızca katalogda zaten bulunan ve kullanıcı kayıtlarının bağlı olduğu profiller için geçerlidir. Yeni mağaza başlıkları için `docs/DATA_SOURCES.md`'deki "eşleme yapılmaz" kuralı aynen geçerlidir.

## Değerlendirilen alternatifler

- **Analizden çıkarmak** (profil "doğrulanmamış"): Kural metnine birebir uyar. Ama gerçek tehlikeler için (küçük akvaryumdaki pleko) uyarı kaybolur. Seçilmedi.
- **En yaygın türe bağlamak** (pleko → *P. pardalis*, Siyam yosun yiyicisi → *C. langei*): Daha basit. Ama farklı türe sahip kullanıcı için değerler eksik koruyabilir. Seçilmedi.

## Doğrulama

- `scripts/test-catalog-flow.cjs`: üç kaydın bilimsel adı, değerleri, ana kaynağı, doğrulama tarihi, eski adla aranabilmesi ve bakım notu kontrol edilir.
- Altın fikstür motor değişmeden yeniden üretildi: 7 vaka değişti (üç türün "sığar" ve "dar" vakaları ile örnek akvaryum; değişen ölçütler yük, ısıtıcı ve yüzme alanı). Hepsinin girdisi ya da tür kaydı değişmişti; hiçbir vakanın genel durumu değişmedi.
- Kaynaklar ve değer seçimleri: `docs/CATALOG_LOG.md` → "2026-10-05 Kimliği belirsiz 3 türün kimlik ve kaynak düzeltmesi".

## Geri alma

Üç katalog satırı, test bloğu ve altın fikstür önceki commit'e döndürülür. Motor değişmediği için sürüm değişikliği gerekmez.
