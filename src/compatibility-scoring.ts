import { getTagGroup } from "./tag-metadata.js";
import type { DesignTag } from "./types.js";

export type CompatibilityScoreOptions = {
  tagWeight: number;
  matchedTagCap: number;
  contradictionPenalty: number;
};

export const contradictoryTagPairs = [
  ["minimal", "maximal"],
  ["dense", "sparse"],
  ["warm", "cold"],
  ["soft", "sharp"],
  ["clean", "textured"],
  ["bright", "dark"],
] as const satisfies readonly (readonly [DesignTag, DesignTag])[];

export function countMatchedTagGroups(
  candidateTags: readonly DesignTag[],
  activeTags: readonly DesignTag[],
): number {
  const activeTagSet = new Set(activeTags);
  const matchedGroups = new Set<string>();

  for (const candidateTag of candidateTags) {
    if (activeTagSet.has(candidateTag)) {
      matchedGroups.add(getTagGroup(candidateTag));
    }
  }

  return matchedGroups.size;
}

export function areContradictoryTags(left: DesignTag, right: DesignTag): boolean {
  return contradictoryTagPairs.some(
    ([first, second]) =>
      (first === left && second === right) || (first === right && second === left),
  );
}

export function countContradictions(
  candidateTags: readonly DesignTag[],
  activeTags: readonly DesignTag[],
): number {
  const candidateTagSet = new Set(candidateTags);
  const activeTagSet = new Set(activeTags);

  return contradictoryTagPairs.filter(
    ([left, right]) =>
      (candidateTagSet.has(left) && activeTagSet.has(right)) ||
      (candidateTagSet.has(right) && activeTagSet.has(left)),
  ).length;
}

export function scoreCompatibility(
  candidateTags: readonly DesignTag[],
  activeTags: readonly DesignTag[],
  options: CompatibilityScoreOptions,
): number {
  const weightScale = Math.max(1, options.tagWeight);
  const matchedGroups = countMatchedTagGroups(candidateTags, activeTags);
  const cappedMatches = Math.min(matchedGroups, options.matchedTagCap);
  const baseWeight = 1 / weightScale + cappedMatches * (options.tagWeight / weightScale);
  const contradictions = countContradictions(candidateTags, activeTags);

  return baseWeight / (1 + contradictions * options.contradictionPenalty);
}
