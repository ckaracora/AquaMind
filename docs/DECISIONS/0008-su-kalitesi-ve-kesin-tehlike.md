# 0008 — Su kalitesi değerlendirmesi ve kesin tehlikenin genel durumu belirlemesi

- Tarih: 2026-09-26
- Durum: Önerildi — ürün sahibi (`buraksenfx`) kuralları 2026-09-26'da açıkça onayladı; geçersiz ölçüm ek kuralını 2026-09-27'de onayladı. `codex/urgent-safety-fixes` dalında Codex denetimi üç turda tamamlandı (son tur 2026-09-28 temiz); `main` birleştirmesi için kullanıcı onayı bekliyor. `main` dalına birleştirilene kadar kabul edilmiş sayılmaz

## Bağlam

2026-09-24 uyumluluk denetimi, kullanıcıya yanlış güven veren üç sorun buldu:

1. Amonyak, nitrit ve nitrat girilebiliyordu ama hiçbir yerde değerlendirilmiyordu; 2 ppm amonyak ve 1 ppm nitritte "Su değeri uyumu" 100 çıkıyordu.
2. Genel puan sekiz ölçütün ortalaması olduğu için kesin bir tehlike (ör. diskus ile neonun sıcaklık ihtiyaçlarının kesişmemesi) varken bile genel durum "iyi" görünebiliyordu.
3. Ana sayfadaki su değeri kartlarının etiketleri ("İdeal", "Dengeli", "Normal", "Güvenli") ve "her şey yolunda" cümlesi koda sabit yazılıydı.

## Karar

### Su kalitesi (motor)

Eşikler OATA'nın su kalitesi ölçütlerinden (Ekim 2022) alınır. Test kiti değerleri mg/L (ppm) kabul edilir; amonyak değeri toplam amonyaktır (NH₃/NH₄⁺).

| | Tatlı su | Deniz ve acı su |
|---|---|---|
| Amonyak | Sıfırın üstü uyarı; serbest amonyak 0,02 mg/L üstü tehlike | Sıfırın üstü uyarı; serbest amonyak 0,01 mg/L üstü tehlike |
| Nitrit | Sıfırın üstü uyarı; 0,2 mg/L üstü tehlike | Sıfırın üstü uyarı; 0,125 mg/L üstü tehlike |
| Nitrat | 50 mg/L üstü uyarı, 100 mg/L üstü tehlike (acı su da) | 100 mg/L üstü tehlike (yalnızca deniz) |

- Serbest (zehirli) amonyak = toplam amonyak × kesir. Kesir Florida DEP yöntemiyle hesaplanır: pKa = 0,0901821 + 2729,92 / (°C + 273,2); kesir = 1 / (10^(pKa − pH) + 1). Formül, yöntemin yayımlanmış tablosuyla altı noktada %0,06'dan az farkla doğrulandı.
- pH veya sıcaklık ölçülmemişse ya da geçersizse serbest kısım hesaplanamaz; en kötü durum olarak toplam amonyağın tamamı zehirli sayılır.
- Geçersiz değer (negatif, sayı olmayan veya sonsuz amonyak, nitrit, nitrat) değerlendirilmez: "uygun" sayılmaz, "Su değeri uyumu" puanına girmez ve "Geçersiz su ölçümü" uyarısı yeniden ölçmeyi ister. Ölçüm formu negatif değer kabul etmez. Veri şeması değiştirilmedi; böylece cihazda kayıtlı eski negatif ölçümler karantinaya alınmaz, yalnızca değerlendirme dışında kalır. Bu ek kural Codex denetiminin bulgusu üzerine ürün sahibince 2026-09-27'de onaylandı.
- Tuzlu suda serbest amonyak oranı biraz daha düşüktür. Tatlı su formülünün deniz akvaryumunda kullanılması zehirliliği biraz fazla gösterir, yani güvenli taraftadır.
- OATA'nın acı su ölçütü yoktur; amonyak ve nitritte daha sıkı olan deniz değerleri, nitratta tatlı su kuralı kullanılır.
- OATA tatlı su nitratını "musluk suyunun en fazla 50 mg/L üstü" olarak tanımlar. Uygulama musluk suyunu bilmediği için 50 üstü "aşılmış olabilir" (uyarı) sayılır. İçme suyu yasal olarak en fazla 50 mg/L nitrat içerebildiğinden 100 üstü sınırın kesin aşıldığını gösterir (tehlike).
- Amonyak, nitrit ve nitrat "Su değeri uyumu" ölçütüne dahil edilir ve her biri için ne yapılması gerektiğini söyleyen bir uyarı üretilir.

### Kesin tehlike (motor)

Şunlardan biri varsa genel puan en fazla 49 olur ve genel durum "tehlike" görünür: yaşam ortamı (su türü) uyumsuzluğu, kesişmeyen sıcaklık veya pH aralığı, avlanma riski, tür akvaryumu gerektiren canlı, aralık dışı tuzluluk, zehirli amonyak, sınırı aşan nitrit.

Biyolojik yük, filtre ve ısıtıcı uyarıları genel durumu kilitlemez. Bu kurallar tahmine dayanır ve denetimde yanlış alarm ürettikleri görüldü (ör. üreticinin önerdiği hacimde kullanılan filtreye "tehlike"). Yeniden ayarlanana kadar genel durumu tek başlarına kırmızıya çekmeleri normal akvaryumları da kırmızı gösterirdi.

Sonuç nesnesinin biçimi değişmez; yalnızca `score` ve `status` değerleri etkilenir.

### Ana sayfa (arayüz)

- Sıcaklık ve pH kartları, akvaryumdaki doğrulanmış türlerin ortak katalog aralığına göre "Uygun", "Aralık dışında", "Türler uyuşmuyor", "Tür verisi yok" veya "Ölçüm yok" gösterir.
- Nitrat kartı, motorun su kalitesi kuralını kullanır; geçersiz (negatif, sayı olmayan veya sonsuz) değerde "Geçersiz ölçüm" gösterir.
- TDS için katalogda tür aralığı olmadığından kart "Bilgi amaçlı" der; hiçbir zaman "Normal" demez.
- "Her şey yolunda" cümlesinin yerine sağlık analizinin genel durumundan üretilen bir cümle ve sağlık analizine bağlantı gelir.
- En son ölçüm, sağlık sayfasındaki gibi tarihe göre seçilir.
- Durum hesapları kataloğun tamamını gerektirdiği için ana sayfaya sayfa açıldıktan sonra yüklenir; böylece kataloğun tamamı ana sayfanın ilk yüküne girmez.

`ENGINE_VERSION` ve `RULESET_VERSION` 1.2.0'a yükseltilir.

## Kaynaklar

- OATA, "OATA water quality criteria", Ekim 2022: https://ornamentalfish.org/wp-content/uploads/OATA-Water-quality-criteria-Oct-2022.pdf
- Florida Department of Environmental Protection, "Calculation of un-ionized ammonia in fresh water", Rev. 2, 2001 (Thurston ve ark. verisi): https://floridadep.gov/sites/default/files/5-Unionized-Ammonia-SOP_1.pdf
- İnsani Tüketim Amaçlı Sular Hakkında Yönetmelik, Resmî Gazete 17.02.2005, Ek-1 (nitrat 50 mg/L): https://www.resmigazete.gov.tr/eskiler/2005/02/20050217-3.htm

## Doğrulama

- `packages/compatibility-engine/test/water-quality.test.ts`: formül Florida DEP tablosuyla, eşikler OATA değerleriyle sınanır.
- `packages/compatibility-engine/test/audit-scenarios.test.ts`: denetim senaryolarından düzeltilenler kalıcı teste dönüştü. Düzeltilmeyenler `it.todo` olarak görünür kalır.
- `src/lib/__tests__/water-status.test.ts` ve `src/lib/__tests__/dashboard-status.test.ts`: ana sayfa etiketleri ve özet cümlesi.
- Altın fikstür, ürün sahibi onayından sonra yeniden üretildi (vaka sayısı 1020, değişmedi); kod değişikliğinden ayrı bir commit'te kaydedilmesi planlandı.

## Sonuçlar

- Zehirli su, yanlış su türü ve kesin uyumsuzluk artık büyük puan halkasında da "tehlike" görünür.
- Bilerek ele alınmayanlar (ayrı görevler): biyolojik yük ve filtre eşiklerinin yeniden ayarı; yüzgeç ısırma, küçük balık ve karides avlama işaretleri; aynı tür içi saldırganlık; şablonla üretilmiş kaynakların gerçek kaynaklarla değiştirilmesi.
- Musluk suyunun nitratı bilinmediği için 50–100 mg/L arası yalnızca uyarıdır; musluk suyu ölçümü eklenirse kural kesinleştirilebilir.
