// Bugünün tarihi, cihazın kendi saat dilimindeki takvim günü (`YYYY-MM-DD`, kayıt biçimi aynı): tarih alanlarının varsayılanı ve yedek dosyasının adı.
// `toISOString().slice(0, 10)` UTC gününü verir; Türkiye'de (UTC+3) 00:00–03:00 arasında dünü gösterir.
// Ekranlar bu günü yine yerel takvim günü olarak okur (`@aquamind/localization` → `formatCalendarDate`).
export function localIsoDate(date: Date = new Date()): string {
  const year = String(date.getFullYear()).padStart(4, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
