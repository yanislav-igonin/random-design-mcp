import { describe, expect, it } from "vitest";
import {
  generateDesignDescriptionInputSchema,
  handleGenerateDesignDescription,
} from "../src/tool.js";

describe("generate_design_description tool", () => {
  it("accepts only documented optional arguments", () => {
    expect(generateDesignDescriptionInputSchema.parse({})).toEqual({});
    expect(
      generateDesignDescriptionInputSchema.parse({
        productType: "Landing page",
        audience: "Developers",
        priority: "Conversion",
        compatibility: false,
      }),
    ).toEqual({
      productType: "Landing page",
      audience: "Developers",
      priority: "Conversion",
      compatibility: false,
    });
    expect(() =>
      generateDesignDescriptionInputSchema.parse({ seed: 42 }),
    ).toThrow();
  });

  it("returns one Markdown text content item", () => {
    const result = handleGenerateDesignDescription(
      { productType: "Landing page" },
      () => "# Design Direction",
    );
    expect(result).toEqual({
      content: [{ type: "text", text: "# Design Direction" }],
    });
  });

  it("returns readable tool error text without throwing", () => {
    const result = handleGenerateDesignDescription({}, () => {
      throw new Error("Catalog era must contain at least 40 items");
    });
    expect(result).toEqual({
      content: [{
        type: "text",
        text: "Failed to generate design description: Catalog era must contain at least 40 items",
      }],
      isError: true,
    });
  });
});
