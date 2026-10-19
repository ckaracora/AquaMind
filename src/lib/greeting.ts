// Ana sayfa selamlaması. Kullanıcı hesabı olmadığı için isim içermez;
// saat, ziyaretçinin kendi cihazından okunur (bkz. src/app/page.tsx). Metin dil dosyasından gelir (`t.greeting[key]`).
export type GreetingKey = "morning" | "afternoon" | "evening";

export function greetingForHour(hour: number): GreetingKey {
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 18) return "afternoon";
  return "evening";
}
