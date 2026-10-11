import { describe, expect, it } from "vitest";
import { trappedFocusIndex } from "@/lib/dialog-focus";

// Pencere içindeki klavye odağı (src/lib/dialog-focus.ts): Sekme tuşu odağı pencerenin dışına çıkarmamalı.

describe("trappedFocusIndex", () => {
  it("son öğede Sekme ilk öğeye, ilk öğede Shift+Sekme son öğeye döner", () => {
    expect(trappedFocusIndex(5, 4, false)).toBe(0);
    expect(trappedFocusIndex(5, 0, true)).toBe(4);
  });

  it("aradaki öğelerde tarayıcının kendi sırasına karışmaz", () => {
    expect(trappedFocusIndex(5, 0, false)).toBeUndefined();
    expect(trappedFocusIndex(5, 2, false)).toBeUndefined();
    expect(trappedFocusIndex(5, 2, true)).toBeUndefined();
    expect(trappedFocusIndex(5, 4, true)).toBeUndefined();
  });

  it("odak pencerenin dışındaysa içeri alır", () => {
    expect(trappedFocusIndex(5, -1, false)).toBe(0);
    expect(trappedFocusIndex(5, -1, true)).toBe(4);
    expect(trappedFocusIndex(5, 9, false)).toBe(0);
  });

  it("tek öğeli pencerede odak o öğede kalır; öğe yoksa hedef yoktur", () => {
    expect(trappedFocusIndex(1, 0, false)).toBe(0);
    expect(trappedFocusIndex(1, 0, true)).toBe(0);
    expect(trappedFocusIndex(0, -1, false)).toBeUndefined();
  });
});
