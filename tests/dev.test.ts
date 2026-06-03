import { describe, expect, it } from "vitest";
import { generateDevPreview, parseDevContext } from "../src/dev.js";

describe("dev preview", () => {
  it("reads optional preview context from environment variables", () => {
    expect(
      parseDevContext({
        RANDOM_DESIGN_PRODUCT_TYPE: "Landing page",
        RANDOM_DESIGN_AUDIENCE: "Developers",
        RANDOM_DESIGN_PRIORITY: "Conversion",
        RANDOM_DESIGN_COMPATIBILITY: "false",
      }),
    ).toEqual({
      productType: "Landing page",
      audience: "Developers",
      priority: "Conversion",
      compatibility: false,
    });
  });

  it("rejects invalid preview compatibility values", () => {
    expect(() =>
      parseDevContext({ RANDOM_DESIGN_COMPATIBILITY: "chaos" }),
    ).toThrow("RANDOM_DESIGN_COMPATIBILITY must be true or false");
  });

  it("prints a Markdown design direction", () => {
    const markdown = generateDevPreview({
      RANDOM_DESIGN_PRODUCT_TYPE: "Landing page",
    });
    expect(markdown).toContain("# Design Direction");
    expect(markdown).toContain("Product type: Landing page");
    expect(markdown).toContain("## Generated Parameters");
    expect(markdown).toContain("## Frontend Design Prompt");
  });
});
