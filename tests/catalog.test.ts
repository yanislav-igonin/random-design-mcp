import { describe, expect, it } from "vitest";
import { catalogs, validateCatalogs } from "../src/catalog/index.js";
import { categoryNames, type CatalogRegistry } from "../src/types.js";

const validItem = { value: "Example", tags: ["clean"] as const };

describe("validateCatalogs", () => {
  it("rejects an empty required catalog", () => {
    expect(() =>
      validateCatalogs({ era: [] } as unknown as CatalogRegistry),
    ).toThrow("Catalog era must contain at least");
  });

  it("rejects values without tags", () => {
    expect(() =>
      validateCatalogs({
        era: [{ value: "Broken", tags: [] }],
      } as unknown as CatalogRegistry),
    ).toThrow("Catalog era item Broken must include at least one tag");
  });

  it("rejects blank values", () => {
    expect(() =>
      validateCatalogs({
        era: [{ value: " ", tags: validItem.tags }],
      } as unknown as CatalogRegistry),
    ).toThrow("Catalog era contains an item with empty text");
  });

  it("rejects duplicate values", () => {
    expect(() =>
      validateCatalogs({
        era: [validItem, validItem],
      } as unknown as CatalogRegistry),
    ).toThrow("Catalog era contains duplicate value Example");
  });
});

it("ships valid catalogs for every required category", () => {
  expect(() => validateCatalogs(catalogs)).not.toThrow();
  expect(Object.keys(catalogs).sort()).toEqual([...categoryNames].sort());
});
