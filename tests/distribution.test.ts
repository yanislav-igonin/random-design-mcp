import { describe, expect, it } from "vitest";
import { catalogs } from "../src/catalog/index.js";
import { generateDesignProfile } from "../src/generator.js";
import type { DesignProfile } from "../src/types.js";
import { createSeededRandom } from "./seeded-random.js";

type CountedCategory =
  | "era" | "style" | "layout" | "imagery" | "motion" | "signatureDetail"
  | "antiPattern";

const sampleSize = 1000;

function increment(counts: Map<string, number>, value: string): void {
  counts.set(value, (counts.get(value) ?? 0) + 1);
}

function collectDistribution(profiles: readonly DesignProfile[]): Record<CountedCategory, Map<string, number>> {
  const counts: Record<CountedCategory, Map<string, number>> = {
    era: new Map(),
    style: new Map(),
    layout: new Map(),
    imagery: new Map(),
    motion: new Map(),
    signatureDetail: new Map(),
    antiPattern: new Map(),
  };

  for (const profile of profiles) {
    for (const value of profile.era) increment(counts.era, value);
    for (const value of profile.style) increment(counts.style, value);
    increment(counts.layout, profile.layout);
    increment(counts.imagery, profile.imagery);
    increment(counts.motion, profile.motion);
    for (const value of profile.signatureDetail) increment(counts.signatureDetail, value);
    for (const value of profile.antiPattern) increment(counts.antiPattern, value);
  }

  return counts;
}

function topCount(counts: Map<string, number>): number {
  return Math.max(...counts.values());
}

describe("generator distribution", () => {
  const random = createSeededRandom(0x5eed);
  const profiles = Array.from({ length: sampleSize }, () => generateDesignProfile({ random }));
  const distribution = collectDistribution(profiles);

  it("keeps high-level anchors singular for every generated profile", () => {
    for (const profile of profiles) {
      expect(profile.era).toHaveLength(1);
      expect(profile.style).toHaveLength(1);
      expect(profile.signatureDetail.length).toBeGreaterThanOrEqual(1);
      expect(profile.signatureDetail.length).toBeLessThanOrEqual(2);
      expect(profile.antiPattern).toHaveLength(2);
    }
  });

  it("covers a broad set of catalog values across repeated generation", () => {
    expect(distribution.era.size).toBeGreaterThanOrEqual(35);
    expect(distribution.style.size).toBeGreaterThanOrEqual(35);
    expect(distribution.layout.size).toBeGreaterThanOrEqual(18);
    expect(distribution.imagery.size).toBeGreaterThanOrEqual(18);
    expect(distribution.motion.size).toBeGreaterThanOrEqual(15);
    expect(distribution.signatureDetail.size).toBeGreaterThanOrEqual(20);
    expect(distribution.antiPattern.size).toBeGreaterThanOrEqual(24);
  });

  it("prevents one catalog value from dominating generated profiles", () => {
    expect(topCount(distribution.era)).toBeLessThanOrEqual(90);
    expect(topCount(distribution.style)).toBeLessThanOrEqual(90);
    expect(topCount(distribution.layout)).toBeLessThanOrEqual(120);
    expect(topCount(distribution.imagery)).toBeLessThanOrEqual(120);
    expect(topCount(distribution.motion)).toBeLessThanOrEqual(140);
    expect(topCount(distribution.signatureDetail)).toBeLessThanOrEqual(140);
    expect(topCount(distribution.antiPattern)).toBeLessThanOrEqual(170);
  });

  it("keeps distribution expectations aligned with current catalog sizes", () => {
    expect(distribution.era.size).toBeLessThanOrEqual(catalogs.era.length);
    expect(distribution.style.size).toBeLessThanOrEqual(catalogs.style.length);
    expect(distribution.layout.size).toBeLessThanOrEqual(catalogs.layout.length);
    expect(distribution.imagery.size).toBeLessThanOrEqual(catalogs.imagery.length);
    expect(distribution.motion.size).toBeLessThanOrEqual(catalogs.motion.length);
    expect(distribution.signatureDetail.size).toBeLessThanOrEqual(catalogs.signatureDetail.length);
    expect(distribution.antiPattern.size).toBeLessThanOrEqual(catalogs.antiPattern.length);
  });
});
