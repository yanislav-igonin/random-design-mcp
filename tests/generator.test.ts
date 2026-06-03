import { afterEach, describe, expect, it } from "vitest";
import { generatorConfig } from "../src/config.js";
import { generateDesignProfile } from "../src/generator.js";

const initialGeneratorConfig = { ...generatorConfig };

afterEach(() => {
  Object.assign(generatorConfig, initialGeneratorConfig);
});

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
    const implicit = generateDesignProfile({ random: () => 0.5 });
    const explicit = generateDesignProfile({ compatibility: true, random: () => 0.5 });
    const chaos = generateDesignProfile({ compatibility: false, random: () => 0.5 });
    expect(implicit).toEqual(explicit);
    expect(implicit).not.toEqual(chaos);
  });

  it("supports full-chaos selection when compatibility is false", () => {
    const profile = generateDesignProfile({ compatibility: false, random: () => 0.5 });
    expect(profile.style.length).toBeGreaterThan(0);
  });

  it("validates catalogs before selecting", () => {
    expect(() => generateDesignProfile({ random: () => 0.5 })).not.toThrow();
  });

  it("rejects out-of-range blend probabilities", () => {
    generatorConfig.secondEraProbability = 1.1;
    expect(() => generateDesignProfile({ random: () => 0.5 })).toThrow(
      "Generator config secondEraProbability must be between 0 and 1",
    );
  });

  it("rejects invalid compatibility tag weights", () => {
    generatorConfig.compatibilityTagWeight = Number.NaN;
    expect(() => generateDesignProfile({ random: () => 0.5 })).toThrow(
      "Generator config compatibilityTagWeight must be a finite positive number",
    );
  });

  it("rejects zero compatibility tag weights", () => {
    generatorConfig.compatibilityTagWeight = 0;
    expect(() => generateDesignProfile({ random: () => 0.5 })).toThrow(
      "Generator config compatibilityTagWeight must be a finite positive number",
    );
  });
});
