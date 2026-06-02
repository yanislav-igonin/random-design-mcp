import { describe, expect, it } from "vitest";
import { selectDistinct } from "../src/random.js";
import type { CatalogItem } from "../src/types.js";

const candidates: CatalogItem[] = [
  { value: "Clean", tags: ["clean"] },
  { value: "Dark", tags: ["dark"] },
  { value: "Digital", tags: ["digital"] },
];

describe("selectDistinct", () => {
  it("uses uniform ordering when compatibility is disabled", () => {
    const result = selectDistinct(candidates, 2, ["digital"], false, () => 0);
    expect(result.map(({ value }) => value)).toEqual(["Clean", "Dark"]);
  });

  it("increases weight for matching tags when compatibility is enabled", () => {
    const result = selectDistinct(candidates, 1, ["digital"], true, () => 0.8);
    expect(result.map(({ value }) => value)).toEqual(["Digital"]);
  });

  it("uses earlier selections as compatibility tags within the same batch", () => {
    const batchCandidates: CatalogItem[] = [
      { value: "Clean A", tags: ["clean"] },
      { value: "Dark", tags: ["dark"] },
      { value: "Clean B", tags: ["clean"] },
    ];
    const randomValues = [0, 0.4];
    const result = selectDistinct(batchCandidates, 2, [], true, () => randomValues.shift() ?? 0);
    expect(result.map(({ value }) => value)).toEqual(["Clean A", "Clean B"]);
  });

  it("never returns the same item twice", () => {
    const result = selectDistinct(candidates, 3, [], false, () => 0);
    expect(new Set(result.map(({ value }) => value)).size).toBe(3);
  });

  it("rejects impossible selection counts", () => {
    expect(() => selectDistinct(candidates, 4, [], false, () => 0)).toThrow(
      "Cannot select 4 distinct items from catalog with 3 items",
    );
  });
});
