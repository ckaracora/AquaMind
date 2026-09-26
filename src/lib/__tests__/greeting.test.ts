import { describe, expect, it } from "vitest";
import { greetingForHour } from "@/lib/greeting";

describe("greetingForHour", () => {
  it("05.00–11.59 arasında günaydın der", () => {
    for (const hour of [5, 8, 11]) expect(greetingForHour(hour)).toBe("Günaydın.");
  });

  it("12.00–17.59 arasında iyi günler der", () => {
    for (const hour of [12, 15, 17]) expect(greetingForHour(hour)).toBe("İyi günler.");
  });

  it("18.00–04.59 arasında iyi akşamlar der", () => {
    for (const hour of [18, 21, 23, 0, 4]) expect(greetingForHour(hour)).toBe("İyi akşamlar.");
  });

  it("hiçbir saatte kişi adı içermez", () => {
    for (let hour = 0; hour < 24; hour += 1) expect(greetingForHour(hour)).not.toMatch(/,/);
  });
});
