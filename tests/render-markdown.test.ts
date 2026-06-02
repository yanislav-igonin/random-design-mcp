import { describe, expect, it } from "vitest";
import { renderDesignDescription } from "../src/render-markdown.js";
import type { DesignProfile } from "../src/types.js";

const profile: DesignProfile = {
  era: ["Victorian", "Cyberpunk"],
  style: ["Editorial"],
  mood: "Ominous",
  palette: "Charcoal and acid green",
  typography: "Condensed grotesk",
  shapeLanguage: "Sharp angular geometry",
  texture: "CRT scanlines",
  density: "Balanced",
  layout: "Asymmetric editorial grid",
  imagery: "Technical diagrams",
  motion: "Glitch bursts",
  tone: "Experimental",
  contrast: "Neon-on-dark contrast",
  borderTreatment: "Glowing neon outlines",
  lighting: "Neon bloom",
  material: "Chrome",
  signatureDetail: ["Giant section numbers", "Terminal cursor"],
  antiPattern: ["Generic SaaS gradients", "Excessive rounded cards"],
};

describe("renderDesignDescription", () => {
  it("renders context, every parameter, constraints, and prompt", () => {
    const markdown = renderDesignDescription(profile, {
      productType: "E-commerce storefront",
      audience: "Collectors",
      priority: "Conversion",
    });
    expect(markdown).toContain("# Design Direction");
    expect(markdown).toContain("## Context");
    expect(markdown).toContain("Product type: E-commerce storefront");
    expect(markdown).toContain("Era: Victorian + Cyberpunk");
    expect(markdown).toContain("Avoid Generic SaaS gradients");
    expect(markdown).toContain("## Frontend Design Prompt");
  });

  it("omits context section when optional values are blank", () => {
    const markdown = renderDesignDescription(profile, { productType: " " });
    expect(markdown).not.toContain("## Context");
  });
});
