import { describe, expect, it } from "vitest";
import { getDesignTags, getTagGroup, tagGroups, tagMetadata } from "../src/tag-metadata.js";

describe("tag metadata", () => {
  it("covers every design tag", () => {
    expect(Object.keys(tagMetadata).sort()).toEqual([...getDesignTags()].sort());
  });

  it("assigns every design tag to a known group", () => {
    for (const tag of getDesignTags()) {
      expect(tagGroups).toContain(getTagGroup(tag));
    }
  });
});
