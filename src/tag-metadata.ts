import { designTags, type DesignTag } from "./types.js";

export const tagGroups = [
  "lineage",
  "mood",
  "colorLight",
  "surface",
  "density",
] as const;

export type TagGroup = (typeof tagGroups)[number];

export type TagMetadata = {
  group: TagGroup;
};

export const tagMetadata = {
  historic: { group: "lineage" },
  retro: { group: "lineage" },
  futuristic: { group: "lineage" },
  digital: { group: "lineage" },
  organic: { group: "lineage" },
  industrial: { group: "lineage" },
  editorial: { group: "lineage" },

  playful: { group: "mood" },
  serious: { group: "mood" },
  luxury: { group: "mood" },
  underground: { group: "mood" },
  soft: { group: "mood" },
  sharp: { group: "mood" },

  bright: { group: "colorLight" },
  dark: { group: "colorLight" },
  warm: { group: "colorLight" },
  cold: { group: "colorLight" },

  clean: { group: "surface" },
  textured: { group: "surface" },

  dense: { group: "density" },
  sparse: { group: "density" },
  minimal: { group: "density" },
  maximal: { group: "density" },
} as const satisfies Record<DesignTag, TagMetadata>;

export function getTagGroup(tag: DesignTag): TagGroup {
  return tagMetadata[tag].group;
}

export function getDesignTags(): readonly DesignTag[] {
  return designTags;
}
