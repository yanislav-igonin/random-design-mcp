# Design Generator Semantic Compatibility Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans for one-task-per-chat execution. If executing the whole plan in one chat with subagents, use superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve semantic compatibility in `generate_design_description` by adding tag groups, grouped scoring, contradiction penalties, and manual sample QA without changing the MCP tool contract.

**Architecture:** Keep catalog authoring simple: catalog items still use the existing flat `DesignTag[]`. Add internal metadata and scoring helpers outside the MCP boundary, then wire them into `selectDistinct`. Keep each task independently testable and leave the repo green after every task.

**Tech Stack:** TypeScript ESM, Vitest, Node.js, MCP stdio server.

---

## Execution Protocol

Use this plan across separate chats.

1. Open this file.
2. Find the first incomplete top-level task.
3. Execute only that task.
4. Use TDD for behavior changes: write failing test, verify red, implement, verify green.
5. Run the task verification command and then `npm run check`.
6. Update this file:
   - mark the task checkbox done
   - add `Completed:` with date, verification command, and commit SHA if committed
   - leave later tasks unchecked
7. Stop. Next chat continues from the next unchecked task.

Do not edit `dist/` manually. Do not add tools, inputs, HTTP transport, auth, persistent state, deterministic replay, UI, or LLM calls.

## Model Recommendations

Use these recommendations to reduce cost and context waste. They are based on current public Codex model guidance and the local Codex config available when this plan was written.

Limits:

- I cannot see the exact model dropdown or account entitlements in the Codex UI.
- Local config currently uses `model = "gpt-5.5"` and `model_reasoning_effort = "high"`.
- Codex public guidance recommends `gpt-5.5` for complex coding/research and `gpt-5.4-mini` for faster, lower-cost lighter coding tasks or subagents.
- If `gpt-5.4-mini` is unavailable in the UI, use `gpt-5.5` with the same reasoning effort listed below.

| Task | Recommended model | Reasoning | Why |
| --- | --- | --- | --- |
| Task 1: Add tag metadata coverage | `gpt-5.4-mini` | `low` | Mechanical file edits and coverage tests. No behavior change. |
| Task 2: Add pure compatibility scoring helper | `gpt-5.4-mini` | `medium` | Small pure helper, but scoring math needs care. |
| Task 3: Integrate grouped scoring into selection | `gpt-5.4-mini` | `medium` | Narrow integration with focused tests. |
| Task 4: Add contradiction penalty tuning | `gpt-5.4-mini` | `medium` | Config + selection wiring. Escalate to `gpt-5.5` / `medium` only after repeated test failures. |
| Task 5: Run distribution and manual sample QA | `gpt-5.5` | `medium` | Requires semantic judgment over generated prompts. |
| Task 6: Add bridge/contrast handling only if QA proves it is needed | `gpt-5.5` | `high` | Optional semantic design/tuning work with higher regression risk. |

For one-task-per-chat execution, set the model before starting the chat if possible. For CLI execution, equivalent flags look like:

```bash
codex -m gpt-5.4-mini -c 'model_reasoning_effort="medium"'
```

Do not use deprecated Codex models for this plan.

## Status

- [x] Task 1: Add tag metadata coverage
  Completed: 2026-06-05. Verification: `npm test -- tests/tag-metadata.test.ts`, `npm run check`. Commit: not committed.
- [x] Task 2: Add pure compatibility scoring helper
  Completed: 2026-06-05. Verification: `npm test -- tests/compatibility-scoring.test.ts`, `npm run check`. Commit: not committed.
- [x] Task 3: Integrate grouped scoring into selection
  Completed: 2026-06-05. Verification: `npm test -- tests/random.test.ts tests/compatibility-scoring.test.ts`, `npm run check`. Commit: not committed.
- [x] Task 4: Add contradiction penalty tuning
  Completed: 2026-06-05. Verification: `npm test -- tests/random.test.ts tests/generator.test.ts tests/compatibility-scoring.test.ts`, `npm run check`. Commit: `d3f1ef8`.
- [x] Task 5: Run distribution and manual sample QA
  Completed: 2026-06-05. Verification: `npm run check`, `npm test -- tests/distribution.test.ts`. Commit: not committed.
- [ ] Task 6: Add bridge/contrast handling only if QA proves it is needed

---

## File Structure

- Modify: `src/types.ts`
  - Export runtime `designTags` and derive `DesignTag` from it.
- Create: `src/tag-metadata.ts`
  - Own tag groups and tag-to-group coverage.
- Create: `tests/tag-metadata.test.ts`
  - Verify runtime coverage and group validity.
- Create: `src/compatibility-scoring.ts`
  - Own grouped match counting, contradiction metadata, contradiction counting, and score calculation.
- Create: `tests/compatibility-scoring.test.ts`
  - Verify pure scoring behavior before integration.
- Modify: `src/random.ts`
  - Replace inline weight math with `scoreCompatibility`.
- Modify: `src/config.ts`
  - Add `compatibilityContradictionPenalty` after integration is stable.
- Modify: `tests/random.test.ts`
  - Add selection-level tests for grouped scoring and contradiction penalty.
- Modify: `tests/generator.test.ts`
  - Add config validation coverage.
- Possibly modify: `tests/distribution.test.ts`
  - Only relax/tighten thresholds if fresh distribution data proves current thresholds are no longer aligned.

---

## Task 1: Add Tag Metadata Coverage

**Purpose:** Add runtime tag metadata with zero generator behavior change.

**Files:**
- Modify: `src/types.ts`
- Create: `src/tag-metadata.ts`
- Create: `tests/tag-metadata.test.ts`

- [ ] **Step 1: Update `src/types.ts` to export runtime tags**

Replace the current `DesignTag` union with this array-derived type. Leave the rest of the file unchanged.

```ts
export const designTags = [
  "historic", "retro", "futuristic", "digital", "organic",
  "industrial", "editorial", "minimal", "maximal", "soft",
  "sharp", "playful", "serious", "luxury", "underground",
  "bright", "dark", "warm", "cold", "clean", "textured",
  "dense", "sparse",
] as const;

export type DesignTag = (typeof designTags)[number];
```

- [ ] **Step 2: Create `src/tag-metadata.ts`**

```ts
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
```

- [ ] **Step 3: Create `tests/tag-metadata.test.ts`**

```ts
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
```

- [ ] **Step 4: Verify Task 1**

Run:

```bash
npm test -- tests/tag-metadata.test.ts
npm run check
```

Expected:

```text
tests/tag-metadata.test.ts passes
npm run check exits 0
```

- [ ] **Step 5: Update task status**

Mark Task 1 done in `## Status` and add:

```md
Completed: write the current date. Verification: `npm test -- tests/tag-metadata.test.ts`, `npm run check`. Commit: write the actual commit SHA, or write `not committed`.
```

---

## Task 2: Add Pure Compatibility Scoring Helper

**Purpose:** Prove grouped scoring and contradiction math in a pure helper before touching selection.

**Files:**
- Create: `src/compatibility-scoring.ts`
- Create: `tests/compatibility-scoring.test.ts`

- [ ] **Step 1: Write failing tests in `tests/compatibility-scoring.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import {
  areContradictoryTags,
  countContradictions,
  countMatchedTagGroups,
  scoreCompatibility,
} from "../src/compatibility-scoring.js";

const options = {
  tagWeight: 2,
  matchedTagCap: 2,
  contradictionPenalty: 1,
};

describe("compatibility scoring", () => {
  it("counts exact matches once per tag group", () => {
    expect(countMatchedTagGroups(["digital", "editorial"], ["digital", "editorial"])).toBe(1);
    expect(countMatchedTagGroups(["digital", "clean"], ["digital", "clean"])).toBe(2);
  });

  it("caps matched groups using the configured cap", () => {
    const score = scoreCompatibility(
      ["digital", "clean", "warm"],
      ["digital", "clean", "warm"],
      options,
    );

    expect(score).toBeCloseTo(2.5);
  });

  it("keeps base scoring compatible with previous weighting", () => {
    expect(scoreCompatibility(["digital"], ["digital"], options)).toBeCloseTo(1.5);
    expect(scoreCompatibility(["digital"], ["clean"], options)).toBeCloseTo(0.5);
  });

  it("detects configured contradiction pairs symmetrically", () => {
    expect(areContradictoryTags("minimal", "maximal")).toBe(true);
    expect(areContradictoryTags("maximal", "minimal")).toBe(true);
    expect(areContradictoryTags("digital", "editorial")).toBe(false);
  });

  it("penalizes contradictions without reducing weight to zero", () => {
    expect(countContradictions(["maximal"], ["minimal"])).toBe(1);

    const neutral = scoreCompatibility(["digital"], ["minimal"], options);
    const contradictory = scoreCompatibility(["maximal"], ["minimal"], options);

    expect(contradictory).toBeGreaterThan(0);
    expect(contradictory).toBeLessThan(neutral);
  });
});
```

- [ ] **Step 2: Verify red**

Run:

```bash
npm test -- tests/compatibility-scoring.test.ts
```

Expected: FAIL because `src/compatibility-scoring.ts` does not exist.

- [ ] **Step 3: Create `src/compatibility-scoring.ts`**

```ts
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
```

- [ ] **Step 4: Verify green**

Run:

```bash
npm test -- tests/compatibility-scoring.test.ts
npm run check
```

Expected:

```text
tests/compatibility-scoring.test.ts passes
npm run check exits 0
```

- [ ] **Step 5: Update task status**

Mark Task 2 done in `## Status` and add:

```md
Completed: write the current date. Verification: `npm test -- tests/compatibility-scoring.test.ts`, `npm run check`. Commit: write the actual commit SHA, or write `not committed`.
```

---

## Task 3: Integrate Grouped Scoring Into Selection

**Purpose:** Replace raw tag-match weighting with grouped exact-match weighting in `selectDistinct`. Keep contradiction penalty disabled for this task.

**Files:**
- Modify: `src/random.ts`
- Modify: `tests/random.test.ts`

- [ ] **Step 1: Add failing selection test to `tests/random.test.ts`**

Add this test inside `describe("selectDistinct", () => { ... })`:

```ts
  it("counts matching tags by metadata group during selection", () => {
    const groupedCandidates: CatalogItem[] = [
      { value: "Cross group", tags: ["digital", "clean"] },
      { value: "Lineage only", tags: ["digital", "editorial"] },
    ];

    const result = selectDistinct(
      groupedCandidates,
      1,
      ["digital", "editorial", "clean"],
      true,
      () => 0.55,
    );

    expect(result.map(({ value }) => value)).toEqual(["Cross group"]);
  });
```

- [ ] **Step 2: Verify red**

Run:

```bash
npm test -- tests/random.test.ts
```

Expected: FAIL because current raw tag counting treats both candidates as equal and selects `Lineage only`.

- [ ] **Step 3: Modify `src/random.ts`**

Add import:

```ts
import { scoreCompatibility } from "./compatibility-scoring.js";
```

Replace the inline compatibility weight logic inside `weights = remaining.map(...)` with:

```ts
    const weights = remaining.map((candidate) => {
      if (!compatibility) return 1;
      return scoreCompatibility(candidate.tags, selectionTags, {
        tagWeight: generatorConfig.compatibilityTagWeight,
        matchedTagCap: generatorConfig.compatibilityMatchedTagCap,
        contradictionPenalty: 0,
      });
    });
```

Remove unused local variables:

```ts
  const tagWeight = generatorConfig.compatibilityTagWeight;
  const weightScale = Math.max(1, tagWeight);
```

- [ ] **Step 4: Verify green**

Run:

```bash
npm test -- tests/random.test.ts tests/compatibility-scoring.test.ts
npm run check
```

Expected:

```text
tests/random.test.ts passes
tests/compatibility-scoring.test.ts passes
npm run check exits 0
```

- [ ] **Step 5: Update task status**

Mark Task 3 done in `## Status` and add:

```md
Completed: write the current date. Verification: `npm test -- tests/random.test.ts tests/compatibility-scoring.test.ts`, `npm run check`. Commit: write the actual commit SHA, or write `not committed`.
```

---

## Task 4: Add Contradiction Penalty Tuning

**Purpose:** Turn contradiction metadata into a small scoring penalty. Do not hard-ban contradictions.

**Files:**
- Modify: `src/config.ts`
- Modify: `src/random.ts`
- Modify: `tests/random.test.ts`
- Modify: `tests/generator.test.ts`

- [ ] **Step 1: Add failing config validation test to `tests/generator.test.ts`**

Add this test inside `describe("generateDesignProfile", () => { ... })`:

```ts
  it("rejects invalid compatibility contradiction penalties", () => {
    generatorConfig.compatibilityContradictionPenalty = -0.1;
    expect(() => generateDesignProfile({ random: () => 0.5 })).toThrow(
      "Generator config compatibilityContradictionPenalty must be a finite non-negative number",
    );
  });
```

- [ ] **Step 2: Add failing selection test to `tests/random.test.ts`**

First replace the current config reset setup:

```ts
const initialCompatibilityTagWeight = generatorConfig.compatibilityTagWeight;

afterEach(() => {
  generatorConfig.compatibilityTagWeight = initialCompatibilityTagWeight;
});
```

with:

```ts
const initialGeneratorConfig = { ...generatorConfig };

afterEach(() => {
  Object.assign(generatorConfig, initialGeneratorConfig);
});
```

Then add this test inside `describe("selectDistinct", () => { ... })`:

```ts
  it("penalizes contradictory candidates without banning them", () => {
    generatorConfig.compatibilityContradictionPenalty = 0.5;
    const contradictionCandidates: CatalogItem[] = [
      { value: "Contradictory digital", tags: ["digital", "maximal"] },
      { value: "Aligned digital", tags: ["digital", "clean"] },
    ];

    const result = selectDistinct(
      contradictionCandidates,
      1,
      ["digital", "minimal"],
      true,
      () => 0.41,
    );

    expect(result.map(({ value }) => value)).toEqual(["Aligned digital"]);
  });
```

- [ ] **Step 3: Verify red**

Run:

```bash
npm test -- tests/random.test.ts tests/generator.test.ts
```

Expected: FAIL because `compatibilityContradictionPenalty` is not in `GeneratorConfig`, validation, or selection scoring yet.

- [ ] **Step 4: Update `src/config.ts`**

Add the property to `GeneratorConfig`:

```ts
  compatibilityContradictionPenalty: number;
```

Add the default value to `generatorConfig`:

```ts
  compatibilityContradictionPenalty: 0.5,
```

Add validation after `compatibilityMatchedTagCap` validation:

```ts
  if (
    !Number.isFinite(config.compatibilityContradictionPenalty) ||
    config.compatibilityContradictionPenalty < 0
  ) {
    throw new Error(
      "Generator config compatibilityContradictionPenalty must be a finite non-negative number",
    );
  }
```

- [ ] **Step 5: Update `src/random.ts` to pass the configured penalty**

Change:

```ts
        contradictionPenalty: 0,
```

to:

```ts
        contradictionPenalty: generatorConfig.compatibilityContradictionPenalty,
```

- [ ] **Step 6: Verify green**

Run:

```bash
npm test -- tests/random.test.ts tests/generator.test.ts tests/compatibility-scoring.test.ts
npm run check
```

Expected:

```text
tests/random.test.ts passes
tests/generator.test.ts passes
tests/compatibility-scoring.test.ts passes
npm run check exits 0
```

- [ ] **Step 7: Update task status**

Mark Task 4 done in `## Status` and add:

```md
Completed: write the current date. Verification: `npm test -- tests/random.test.ts tests/generator.test.ts tests/compatibility-scoring.test.ts`, `npm run check`. Commit: write the actual commit SHA, or write `not committed`.
```

---

## Task 5: Run Distribution And Manual Sample QA

**Purpose:** Confirm semantic mechanics did not collapse output variety and inspect actual Markdown prompt quality.

**Files:**
- Possibly modify: `tests/distribution.test.ts`
- Modify this plan file with QA notes.

- [ ] **Step 1: Run full verification**

Run:

```bash
npm run check
```

Expected:

```text
npm run check exits 0
```

- [ ] **Step 2: Run distribution test directly**

Run:

```bash
npm test -- tests/distribution.test.ts
```

Expected:

```text
tests/distribution.test.ts passes
```

If it fails only because top-count or unique-count thresholds shifted after grouped scoring, inspect generated counts before changing thresholds. Do not relax thresholds blindly.

- [ ] **Step 3: Generate 12 manual samples**

Run `npm run dev --silent` twelve times. Use varied contexts:

```bash
RANDOM_DESIGN_PRODUCT_TYPE="AI code editor" RANDOM_DESIGN_AUDIENCE="senior frontend engineers" RANDOM_DESIGN_PRIORITY="trustworthy but visually memorable" npm run dev --silent
RANDOM_DESIGN_PRODUCT_TYPE="music festival landing page" RANDOM_DESIGN_AUDIENCE="young urban fans" RANDOM_DESIGN_PRIORITY="high-energy ticket conversion" npm run dev --silent
RANDOM_DESIGN_PRODUCT_TYPE="luxury skincare shop" RANDOM_DESIGN_AUDIENCE="design-conscious buyers" RANDOM_DESIGN_PRIORITY="premium product clarity" npm run dev --silent
RANDOM_DESIGN_PRODUCT_TYPE="developer analytics dashboard" RANDOM_DESIGN_AUDIENCE="technical founders" RANDOM_DESIGN_PRIORITY="dense scannable insight" npm run dev --silent
RANDOM_DESIGN_PRODUCT_TYPE="museum exhibition microsite" RANDOM_DESIGN_AUDIENCE="curious visitors" RANDOM_DESIGN_PRIORITY="editorial storytelling" npm run dev --silent
RANDOM_DESIGN_PRODUCT_TYPE="retro game launch page" RANDOM_DESIGN_AUDIENCE="indie game players" RANDOM_DESIGN_PRIORITY="distinctive nostalgia" npm run dev --silent
RANDOM_DESIGN_PRODUCT_TYPE="fintech onboarding" RANDOM_DESIGN_AUDIENCE="first-time investors" RANDOM_DESIGN_PRIORITY="clarity and confidence" npm run dev --silent
RANDOM_DESIGN_PRODUCT_TYPE="restaurant booking page" RANDOM_DESIGN_AUDIENCE="local diners" RANDOM_DESIGN_PRIORITY="warm fast reservation flow" npm run dev --silent
RANDOM_DESIGN_PRODUCT_TYPE="portfolio homepage" RANDOM_DESIGN_AUDIENCE="creative directors" RANDOM_DESIGN_PRIORITY="strong first impression" npm run dev --silent
RANDOM_DESIGN_PRODUCT_TYPE="B2B security product" RANDOM_DESIGN_AUDIENCE="enterprise buyers" RANDOM_DESIGN_PRIORITY="credible technical depth" npm run dev --silent
RANDOM_DESIGN_PRODUCT_TYPE="fashion campaign" RANDOM_DESIGN_AUDIENCE="style-focused shoppers" RANDOM_DESIGN_PRIORITY="bold visual identity" npm run dev --silent
RANDOM_DESIGN_PRODUCT_TYPE="education app" RANDOM_DESIGN_AUDIENCE="busy parents" RANDOM_DESIGN_PRIORITY="friendly clarity" npm run dev --silent
```

- [ ] **Step 4: Record QA notes in this plan**

Add notes below:

```md
### Task 5 QA Notes

Completed: write the current date. Verification: `npm run check`, `npm test -- tests/distribution.test.ts`. Commit: write the actual commit SHA, or write `not committed`.

Manual sample result:
- Strong samples: write an exact number out of 12.
- Awkward but usable samples: write an exact number out of 12.
- Bad samples: write an exact number out of 12.

Observed issues:
- Write each recurring issue as a concrete bullet, or write `None`.

Decision:
- Proceed to Task 6: yes/no
- Reason: cite concrete evidence from the manual samples.
```

- [ ] **Step 5: Update task status**

Mark Task 5 done in `## Status`.

---

## Task 6: Add Bridge/Contrast Handling Only If QA Proves It Is Needed

### Task 5 QA Notes

Completed: 2026-06-05. Verification: `npm run check`, `npm test -- tests/distribution.test.ts`. Commit: not committed.

Manual sample result:
- Strong samples: 3 out of 12.
- Awkward but usable samples: 7 out of 12.
- Bad samples: 2 out of 12.

Observed issues:
- Serious or trust-heavy products can receive overly expressive choices that need user priority to dominate more strongly, for example fintech onboarding with Punk zine and provocative tone.
- Product-type mismatch still appears in some samples, for example restaurant booking with Terminal UI and warning labels despite a warm reservation-flow priority.
- Density can conflict with priority, for example a dense analytics dashboard receiving single-focus composition, or a security product receiving extremely sparse density.
- No recurring bridge/contrast contradiction problem was observed from the new contradiction penalty.

Decision:
- Proceed to Task 6: no.
- Reason: manual samples showed contextual prioritization issues, not a need for bridge or contrast handling. Distribution and full checks passed, so no threshold or scoring change is justified in this task.

**Purpose:** Preserve useful creative contrast if contradiction penalties make samples too flat or if samples still show awkward contrast that needs explicit framing.

**Precondition:** Task 5 QA notes must say `Proceed to Task 6: yes`. If Task 5 says no, mark Task 6 skipped with reason and stop.

**Files if needed:**
- Modify: `src/compatibility-scoring.ts`
- Modify: `src/render-markdown.ts`
- Modify: `tests/compatibility-scoring.test.ts`
- Modify: `tests/render-markdown.test.ts`

- [ ] **Step 1: Decide bridge scope from Task 5 evidence**

Use only pairs observed in samples. Start with at most these bridgeable pairs:

```ts
["retro", "futuristic"]
["editorial", "digital"]
["minimal", "maximal"]
["warm", "cold"]
```

Do not create a large rules engine. If no sample evidence exists, skip this task.

- [ ] **Step 2: If scoring bridge is needed, add failing test**

Add a test to `tests/compatibility-scoring.test.ts` only for the observed pair. Example for `minimal` + `maximal`:

```ts
  it("allows an observed bridge pair to reduce contradiction penalty", () => {
    const unbridged = scoreCompatibility(["maximal"], ["minimal"], {
      tagWeight: 2,
      matchedTagCap: 2,
      contradictionPenalty: 1,
    });

    const bridged = scoreCompatibility(["maximal"], ["minimal"], {
      tagWeight: 2,
      matchedTagCap: 2,
      contradictionPenalty: 0.25,
    });

    expect(bridged).toBeGreaterThan(unbridged);
  });
```

This example uses existing options instead of adding new API. Prefer this if enough.

- [ ] **Step 3: If renderer framing is needed, add failing render test**

Only add renderer framing if samples show prompts need explicit contrast language. Add a test in `tests/render-markdown.test.ts` using a profile that contains the observed contrast and assert the Markdown frames it as intentional contrast.

- [ ] **Step 4: Implement minimal bridge behavior**

Preferred implementation order:

1. Adjust `compatibilityContradictionPenalty` only if samples are too flat.
2. Add renderer wording only if prompt language is unclear.
3. Avoid new metadata unless the two options above fail.

- [ ] **Step 5: Verify Task 6**

Run:

```bash
npm test -- tests/compatibility-scoring.test.ts tests/render-markdown.test.ts
npm run check
```

Expected:

```text
targeted tests pass
npm run check exits 0
```

- [ ] **Step 6: Update task status**

If implemented:

```md
Completed: write the current date. Verification: `npm test -- tests/compatibility-scoring.test.ts tests/render-markdown.test.ts`, `npm run check`. Commit: write the actual commit SHA, or write `not committed`.
```

If skipped:

```md
Skipped: YYYY-MM-DD. Reason: Task 5 QA did not show a bridge/contrast problem.
```

---

## New Chat Starter Prompt

Use this in each new chat:

```text
Use caveman, context7, and superpowers. Open docs/superpowers/plans/2026-06-05-design-generator-semantic-compatibility-plan.md. Execute only the first unchecked top-level task. Use TDD where the task changes behavior. Run the task verification and npm run check. Update the plan checkbox/status with verification result and commit SHA if committed. Stop after that one task.
```
