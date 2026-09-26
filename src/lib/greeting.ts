// Ana sayfa selamlaması. Kullanıcı hesabı olmadığı için isim içermez;
// saat, ziyaretçinin kendi cihazından okunur (bkz. src/app/page.tsx).
export function greetingForHour(hour: number): string {
  if (hour >= 5 && hour < 12) return "Günaydın.";
  if (hour >= 12 && hour < 18) return "İyi günler.";
  return "İyi akşamlar.";
}
