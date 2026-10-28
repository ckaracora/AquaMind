import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { formatCalendarDate } from "@aquamind/localization";
import { localIsoDate } from "@/lib/local-date";

// Saat dilimi sürecin `TZ` değişkeninden okunur; Node bu değişkene yapılan atamayı hemen uygular.
const originalTimeZone = process.env.TZ;

function clockAt(timeZone: string, instant: string) {
  process.env.TZ = timeZone;
  vi.setSystemTime(new Date(instant));
}

describe("localIsoDate", () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => {
    vi.useRealTimers();
    if (originalTimeZone === undefined) delete process.env.TZ;
    else process.env.TZ = originalTimeZone;
  });

  it("Türkiye'de gece yarısından sonra yeni günü verir; UTC günü hâlâ dündür (2026-10-28 00:20)", () => {
    clockAt("Europe/Istanbul", "2026-10-27T21:20:00Z");
    // Saat dilimi gerçekten uygulanmadıysa test boşuna geçmesin.
    expect(new Date().getHours()).toBe(0);
    expect(new Date().toISOString().slice(0, 10)).toBe("2026-10-27");
    expect(localIsoDate()).toBe("2026-10-28");
  });

  it("Türkiye'de gün 23:59:59'da değişmez, 00:00'da değişir", () => {
    clockAt("Europe/Istanbul", "2026-10-28T20:59:59Z");
    expect(localIsoDate()).toBe("2026-10-28");
    clockAt("Europe/Istanbul", "2026-10-28T21:00:00Z");
    expect(localIsoDate()).toBe("2026-10-29");
  });

  it("UTC'nin gerisindeki saat diliminde akşam saatlerinde ertesi güne geçmez", () => {
    clockAt("America/New_York", "2026-10-28T02:30:00Z");
    expect(new Date().getHours()).toBe(22);
    expect(localIsoDate()).toBe("2026-10-27");
  });

  it("yıl ve ay dönümünde yerel günü verir; ay ve gün iki hanelidir", () => {
    clockAt("Europe/Istanbul", "2026-12-31T21:05:00Z");
    expect(localIsoDate()).toBe("2027-01-01");
    clockAt("Europe/Istanbul", "2026-02-28T22:00:00Z");
    expect(localIsoDate()).toBe("2026-03-01");
  });

  it("verilen tarihi de yerel güne çevirir ve ekran aynı günü yazar", () => {
    clockAt("Europe/Istanbul", "2026-10-27T21:20:00Z");
    const value = localIsoDate(new Date("2026-03-04T22:30:00Z"));
    expect(value).toBe("2026-03-05");
    expect(formatCalendarDate(value, "day-first")).toBe("05.03.2026");
  });
});

// Ekranlar bugünün tarihini UTC gününden kurmasın diye kaynak dosyalar taranır (testler tarayıcı ortamında çalışmıyor).
describe("ekranlardaki bugünün tarihi", () => {
  const sourceFiles = (dir: string): string[] => readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) return entry === "__tests__" ? [] : sourceFiles(path);
    return /\.tsx$/.test(entry) ? [path.replaceAll("\\", "/")] : [];
  });
  const sources = ["src/app", "src/components"].flatMap((dir) => sourceFiles(dir)).map((file) => ({ file, text: readFileSync(file, "utf8") }));

  it("hiçbir sayfa ya da bileşen UTC gününü (`toISOString().slice(0, 10)`) kullanmaz", () => {
    expect(sources.filter(({ text }) => /toISOString\(\)\.slice\(0,\s*10\)/.test(text)).map(({ file }) => file)).toEqual([]);
  });

  it("yedek dosyasının adı yerel günü taşır", () => {
    expect(readFileSync("src/app/settings/page.tsx", "utf8")).toContain("exportFileName(localIsoDate())");
  });

  it("formlar varsayılan tarihi `localIsoDate` ile kurar", () => {
    expect(sources.filter(({ text }) => text.includes("defaultValue={localIsoDate()}")).map(({ file }) => file).sort()).toEqual([
      "src/app/aquariums/new/page.tsx",
      "src/app/equipment/page.tsx",
      "src/app/plants/page.tsx",
      "src/components/catalog-livestock-form.tsx",
    ]);
  });
});
