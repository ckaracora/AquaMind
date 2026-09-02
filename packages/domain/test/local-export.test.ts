import { describe, expect, it } from "vitest";
import {
  aquariums,
  equipment,
  livestock,
  maintenanceTasks,
  plants,
  waterReadings,
} from "@/data/mock-data";
import { LOCAL_EXPORT_VERSION, localExportV1Schema } from "../src";

// `src/app/settings/page.tsx` içindeki exportData ile aynı biçim: her
// `aquamind:*` localStorage anahtarı olduğu gibi bir özellik olarak yazılır.
function buildExportLikeSettingsPage() {
  return {
    exportedAt: "2026-09-02T00:00:00.000Z",
    version: 1,
    "aquamind:aquariums:v1": aquariums,
    "aquamind:water-readings:v1": waterReadings,
    "aquamind:maintenance:v1": maintenanceTasks,
    "aquamind:livestock:v1": livestock,
    "aquamind:plants:v1": plants,
    "aquamind:equipment:v1": equipment,
    "aquamind:preferences:v1": {
      temperature: "celsius",
      volume: "liters",
      dateFormat: "day-first",
      maintenance: true,
      waterAlerts: true,
      productNews: false,
      compactMode: false,
    },
  };
}

describe("LocalExportV1", () => {
  it("sürüm sabiti 1'dir", () => {
    expect(LOCAL_EXPORT_VERSION).toBe(1);
  });

  it("ayarlar sayfasının ürettiği dışa aktarımı kabul eder ve içeriği korur", () => {
    const data = buildExportLikeSettingsPage();
    const result = localExportV1Schema.safeParse(data);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toEqual(data);
  });

  it("yalnızca üst bilgi taşıyan boş dışa aktarımı kabul eder", () => {
    expect(localExportV1Schema.safeParse({ exportedAt: "2026-09-02T00:00:00.000Z", version: 1 }).success).toBe(true);
  });

  it("bilinmeyen aquamind:* anahtarlarını atmaz", () => {
    const data = { ...buildExportLikeSettingsPage(), "aquamind:future-collection:v1": [{ id: "x" }] };
    const result = localExportV1Schema.safeParse(data);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data["aquamind:future-collection:v1"]).toEqual([{ id: "x" }]);
  });

  it("farklı sürümü reddeder", () => {
    expect(localExportV1Schema.safeParse({ ...buildExportLikeSettingsPage(), version: 2 }).success).toBe(false);
  });

  it("bozuk koleksiyon içeriğini reddeder", () => {
    expect(localExportV1Schema.safeParse({ ...buildExportLikeSettingsPage(), "aquamind:aquariums:v1": "bozuk" }).success).toBe(false);
    expect(
      localExportV1Schema.safeParse({
        ...buildExportLikeSettingsPage(),
        "aquamind:livestock:v1": [{ ...livestock[0], quantity: "6" }],
      }).success,
    ).toBe(false);
  });
});
