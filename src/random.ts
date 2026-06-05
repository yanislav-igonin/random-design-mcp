import { generatorConfig } from "./config.js";
import { scoreCompatibility } from "./compatibility-scoring.js";
import type { CatalogItem, DesignTag } from "./types.js";

export type RandomSource = () => number;
export const defaultRandom: RandomSource = Math.random;

function chooseWeighted(
  candidates: readonly CatalogItem[],
  weights: readonly number[],
  random: RandomSource,
): CatalogItem {
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  let cursor = random() * total;
  for (let index = 0; index < candidates.length; index += 1) {
    cursor -= weights[index];
    if (cursor < 0) return candidates[index];
  }
  return candidates[candidates.length - 1];
}

export function selectDistinct(
  catalog: readonly CatalogItem[],
  count: number,
  activeTags: readonly DesignTag[],
  compatibility: boolean,
  random: RandomSource = defaultRandom,
): CatalogItem[] {
  if (catalog.length < count) {
    throw new Error(
      `Cannot select ${count} distinct items from catalog with ${catalog.length} items`,
    );
  }

  const remaining = [...catalog];
  const selected: CatalogItem[] = [];
  const selectionTags = [...activeTags];
  while (selected.length < count) {
    const weights = remaining.map((candidate) => {
      if (!compatibility) return 1;
      return scoreCompatibility(candidate.tags, selectionTags, {
        tagWeight: generatorConfig.compatibilityTagWeight,
        matchedTagCap: generatorConfig.compatibilityMatchedTagCap,
        contradictionPenalty: generatorConfig.compatibilityContradictionPenalty,
      });
    });
    const chosen = chooseWeighted(remaining, weights, random);
    selected.push(chosen);
    selectionTags.push(...chosen.tags);
    remaining.splice(remaining.indexOf(chosen), 1);
  }
  return selected;
}
