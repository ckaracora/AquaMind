import { describe, expect, it } from "vitest";
import { speciesById } from "@/data/catalog";
import { dashboardStatus } from "@/lib/dashboard-status";
import { fullCatalogLookup } from "@/lib/health-analysis";
import type { Aquarium, Livestock, WaterParameters } from "@/types/aquarium";

const aquarium: Aquarium = { id: "a", name: "A", type: "freshwater", lengthCm: 80, widthCm: 35, heightCm: 40, netVolumeLiters: 100, setupDate: "2026-01-01" };
const neon = speciesById("neon-tetra")!;
const animals: Livestock[] = [{ id: "n", aquariumId: "a", catalogId: neon.id, commonName: neon.commonName, category: neon.category, quantity: 10, addedAt: "2026-01-01" }];
const reading = (values: Partial<WaterParameters>): WaterParameters => ({ id: "w", aquariumId: "a", measuredAt: "2026-09-26", ...values });

describe("dashboardStatus", () => {
  it("kartları son ölçüme ve türlere göre etiketler", () => {
    const status = dashboardStatus(fullCatalogLookup, aquarium, animals, [], reading({ temperature: neon.temperature[0], ph: neon.ph[0], nitrate: 10, tds: 180 }));
    expect(status.temperature.label).toBe("Uygun");
    expect(status.ph.label).toBe("Uygun");
    expect(status.nitrate.label).toBe("Uygun");
    expect(status.tds.label).toBe("Bilgi amaçlı");
  });

  it("zehirli suda özet cümlesi tehlike tonundadır", () => {
    const status = dashboardStatus(fullCatalogLookup, aquarium, animals, [], reading({ temperature: 25, ph: 7, nitrite: 1 }));
    expect(status.summary.tone).toBe("danger");
  });

  it("veri yokken özet eklemeye yönlendirir", () => {
    expect(dashboardStatus(fullCatalogLookup, aquarium, [], []).summary.tone).toBe("neutral");
  });
});
