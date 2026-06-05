import { describe, expect, it } from "vitest";
import {
  areContradictoryTags,
  countContradictions,
  countMatchedTagGroups,
  scoreCompatibility,
} from "../src/compatibility-scoring.js";

const options = {
  tagWeight: 2,
  matchedTagCap: 2,
  contradictionPenalty: 1,
};

describe("compatibility scoring", () => {
  it("counts exact matches once per tag group", () => {
    expect(countMatchedTagGroups(["digital", "editorial"], ["digital", "editorial"])).toBe(1);
    expect(countMatchedTagGroups(["digital", "clean"], ["digital", "clean"])).toBe(2);
  });

  it("caps matched groups using the configured cap", () => {
    const score = scoreCompatibility(
      ["digital", "clean", "warm"],
      ["digital", "clean", "warm"],
      options,
    );

    expect(score).toBeCloseTo(2.5);
  });

  it("keeps base scoring compatible with previous weighting", () => {
    expect(scoreCompatibility(["digital"], ["digital"], options)).toBeCloseTo(1.5);
    expect(scoreCompatibility(["digital"], ["clean"], options)).toBeCloseTo(0.5);
  });

  it("detects configured contradiction pairs symmetrically", () => {
    expect(areContradictoryTags("minimal", "maximal")).toBe(true);
    expect(areContradictoryTags("maximal", "minimal")).toBe(true);
    expect(areContradictoryTags("digital", "editorial")).toBe(false);
  });

  it("penalizes contradictions without reducing weight to zero", () => {
    expect(countContradictions(["maximal"], ["minimal"])).toBe(1);

    const neutral = scoreCompatibility(["digital"], ["minimal"], options);
    const contradictory = scoreCompatibility(["maximal"], ["minimal"], options);

    expect(contradictory).toBeGreaterThan(0);
    expect(contradictory).toBeLessThan(neutral);
  });
});
