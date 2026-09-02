import { describe, expect, it } from "vitest";
import {
  aquariums,
  equipment,
  livestock,
  maintenanceTasks,
  plants,
  waterReadings,
} from "@/data/mock-data";
import {
  aquariumSchema,
  equipmentSchema,
  livestockSchema,
  maintenanceTaskSchema,
  plantSchema,
  waterParametersSchema,
} from "../src";

describe("alan şemaları", () => {
  it("uygulamanın tohum verisini olduğu gibi kabul eder", () => {
    for (const item of aquariums) expect(aquariumSchema.safeParse(item).success).toBe(true);
    for (const item of waterReadings) expect(waterParametersSchema.safeParse(item).success).toBe(true);
    for (const item of maintenanceTasks) expect(maintenanceTaskSchema.safeParse(item).success).toBe(true);
    for (const item of livestock) expect(livestockSchema.safeParse(item).success).toBe(true);
    for (const item of plants) expect(plantSchema.safeParse(item).success).toBe(true);
    for (const item of equipment) expect(equipmentSchema.safeParse(item).success).toBe(true);
  });

  it("geçerli kayıtları değiştirmeden geçirir", () => {
    expect(aquariumSchema.parse(aquariums[0])).toEqual(aquariums[0]);
    expect(waterParametersSchema.parse(waterReadings[0])).toEqual(waterReadings[0]);
    expect(maintenanceTaskSchema.parse(maintenanceTasks[0])).toEqual(maintenanceTasks[0]);
    expect(livestockSchema.parse(livestock[0])).toEqual(livestock[0]);
    expect(plantSchema.parse(plants[0])).toEqual(plants[0]);
    expect(equipmentSchema.parse(equipment[0])).toEqual(equipment[0]);
  });

  it("yalnızca zorunlu alanları taşıyan kayıtları kabul eder", () => {
    expect(
      aquariumSchema.safeParse({
        id: "a",
        name: "Küçük",
        type: "freshwater",
        lengthCm: 40,
        widthCm: 25,
        heightCm: 30,
        netVolumeLiters: 25,
        setupDate: "2026-09-01",
      }).success,
    ).toBe(true);
    expect(waterParametersSchema.safeParse({ id: "w", aquariumId: "a", measuredAt: "2026-09-01T10:00:00.000Z" }).success).toBe(true);
    expect(livestockSchema.safeParse({ id: "l", aquariumId: "a", commonName: "Neon tetra", category: "fish", quantity: 8, addedAt: "2026-09-01" }).success).toBe(true);
    expect(equipmentSchema.safeParse({ id: "e", aquariumId: "a", category: "filter", installedAt: "2026-09-01" }).success).toBe(true);
  });

  it("eksik veya yanlış tipli alanları reddeder", () => {
    const { name: _name, ...aquariumWithoutName } = aquariums[0];
    expect(aquariumSchema.safeParse(aquariumWithoutName).success).toBe(false);
    expect(aquariumSchema.safeParse({ ...aquariums[0], type: "pond" }).success).toBe(false);
    expect(aquariumSchema.safeParse({ ...aquariums[0], netVolumeLiters: "180" }).success).toBe(false);
    expect(livestockSchema.safeParse({ ...livestock[0], category: "bird" }).success).toBe(false);
    expect(livestockSchema.safeParse({ ...livestock[0], quantity: "16" }).success).toBe(false);
    expect(maintenanceTaskSchema.safeParse({ ...maintenanceTasks[0], type: "vacuum" }).success).toBe(false);
    expect(equipmentSchema.safeParse({ ...equipment[0], category: "skimmer" }).success).toBe(false);
    expect(waterParametersSchema.safeParse({ ...waterReadings[0], ph: "6.8" }).success).toBe(false);
  });
});
