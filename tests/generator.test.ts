import { describe, expect, it } from "vitest";
import { generateDesignProfile } from "../src/generator.js";

describe("generateDesignProfile", () => {
  it("creates every profile field", () => {
    const profile = generateDesignProfile({ random: () => 0.99 });
    expect(Object.keys(profile).sort()).toEqual([
      "antiPattern", "borderTreatment", "contrast", "density", "era", "imagery",
      "layout", "lighting", "material", "mood", "motion", "palette",
      "shapeLanguage", "signatureDetail", "style", "texture", "tone", "typography",
    ].sort());
  });

  it("selects optional second values when random falls below probabilities", () => {
    const profile = generateDesignProfile({ random: () => 0 });
    expect(profile.era).toHaveLength(2);
    expect(profile.style).toHaveLength(2);
    expect(profile.signatureDetail).toHaveLength(2);
    expect(profile.antiPattern).toHaveLength(2);
  });

  it("uses config default when compatibility is absent", () => {
    const profile = generateDesignProfile({ random: () => 0.5 });
    expect(profile.era.length).toBeGreaterThan(0);
  });

  it("supports full-chaos selection when compatibility is false", () => {
    const profile = generateDesignProfile({ compatibility: false, random: () => 0.5 });
    expect(profile.style.length).toBeGreaterThan(0);
  });

  it("validates catalogs before selecting", () => {
    expect(() => generateDesignProfile({ random: () => 0.5 })).not.toThrow();
  });
});
