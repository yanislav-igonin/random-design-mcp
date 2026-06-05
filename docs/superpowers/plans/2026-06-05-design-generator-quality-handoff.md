# Design Generator Quality Handoff

> Use this as the starting context for the next chat. Current branch had a clean
> worktree when this note was written.

## Goal

Improve `random-design-mcp` output quality so `generate_design_description`
returns stronger frontend design prompts without adding LLM calls, new MCP
tools, HTTP transport, auth, persistent state, deterministic replay, or UI.

## Completed

### Commit `48170b3` — `feat: improve design prompt quality`

- Replaced flat Markdown inventory with prompt-oriented sections in
  `src/render-markdown.ts`:
  - `Core Concept`
  - `Visual System`
  - `Composition`
  - `Interaction`
  - `Execution Rules`
  - `Avoid`
- Made `productType` and `priority` affect prompt wording, not only context
  display.
- Kept `era` and `style` as arrays in the public profile shape, but generator
  now emits exactly one value for each.
- Removed `secondEraProbability` and `secondStyleProbability`.
- Preserved optional second `signatureDetail`.
- Added `docs/catalog-guidelines.md` with catalog naming rules:
  - expand `style`, `layout`, `imagery`, `motion`, `signatureDetail`
  - keep `era`, `mood`, `tone`, `palette`, `material`, `texture`, `lighting`
    shorter when labels are clear
  - keep meme/retro/FX directions, but phrase risky effects as usable UI accents
- Lightly sharpened catalog wording:
  - `Minimalism` -> `Museum-grade restraint with one focal object`
  - `Glassmorphism` -> restrained translucent panels
  - `Neumorphism` -> tactile controls with accessible contrast
  - `Bento grid` -> mixed-scale utility grid
  - `Chrome orb` -> single reflective accent object
  - `Organic blobs` -> asymmetric organic masks
  - `Low contrast` -> accessible soft contrast
  - `Card-heavy` -> modular content-dense without repetitive cards
- Added more concrete frontend layouts, imagery, signature details, and
  anti-patterns.

### Commit `ca95108` — `feat: rebalance design compatibility`

- Added `compatibilityMatchedTagCap: 2` in `src/config.ts`.
- Updated `src/random.ts` so one candidate cannot gain unlimited weight from
  broad generic tag matches like `digital + clean + editorial`.
- Added `selectRiskBalancedAntiPatterns` in `src/generator.ts`.
- Anti-pattern selection now picks:
  - one relevant risk using active compatibility tags
  - one neutral/general risk from the remaining catalog
- Added tests for generic tag cap and anti-pattern selection.

### Commit `2d4dc5f` — `distribution tests`

- Added deterministic test PRNG in `tests/seeded-random.ts`.
- Added `tests/distribution.test.ts`.
- Distribution tests generate 1000 profiles and check:
  - `era.length === 1`
  - `style.length === 1`
  - `signatureDetail.length` is 1 or 2
  - `antiPattern.length === 2`
  - key categories cover a broad set of values
  - no single value dominates generated output

## Last Verification

`npm run check` passed after distribution tests:

- 8 test files passed
- 39 tests passed

Observed distribution with seed `0x5eed`, 1000 profiles:

```text
era: unique=48/48, top=2.8%
style: unique=51/51, top=3.2%
layout: unique=27/27, top=5.2%
imagery: unique=25/25, top=5.8%
motion: unique=20/20, top=6.2%
signatureDetail: unique=28/28, top=4.4%
antiPattern: unique=32/32, top=4.0%
```

Conclusion: current generator does not appear to collapse into repetitive output.
The next quality problem is semantic compatibility, not distribution.

## Current Product Constraints

- Keep exactly one MCP tool unless explicitly changing product scope.
- Tool name: `generate_design_description`.
- Output language: English Markdown.
- Optional input fields remain:
  - `productType`
  - `audience`
  - `priority`
  - `compatibility`
- `compatibility` defaults to `true`.
- Schema stays strict. Unknown arguments must fail.
- Do not add LLM calls, HTTP transport, auth, persistent state, deterministic
  replay, or UI unless explicitly requested.
- Do not edit `dist/` manually.

## Next Work

### Next Phase 1: Grouped Tags

Problem: current `DesignTag` is flat. Tags like `clean`, `digital`, and
`editorial` are too broad and can imply many unrelated things.

Proposed direction:

- Keep catalog authoring simple.
- Add internal tag metadata in a new module, likely `src/tag-metadata.ts` or
  similar.
- Group existing tags into dimensions:
  - lineage: `historic`, `retro`, `futuristic`, `editorial`, `industrial`,
    `organic`, `digital`
  - mood: `playful`, `serious`, `luxury`, `underground`, `soft`, `sharp`
  - color/light: `bright`, `dark`, `warm`, `cold`
  - surface: `clean`, `textured`
  - density: `dense`, `sparse`, `minimal`, `maximal`
- Use groups only for scoring and validation at first. Avoid rewriting all
  catalog tags in the first pass.

Potential benefit:

- Compatibility can prefer matching within meaningful dimensions instead of
  treating all tags equally.
- Future contradiction logic becomes easier and less ad hoc.

### Next Phase 2: Contradiction Pairs

Problem: distribution is healthy, but combinations can still be semantically
awkward, such as a sparse/minimal direction pulling dense/maximal details without
a useful bridge.

Initial contradiction pairs to consider:

- `minimal` vs `maximal`
- `dense` vs `sparse`
- `warm` vs `cold`
- `soft` vs `sharp`
- `clean` vs `textured`
- `bright` vs `dark`

Important: do not fully ban all contradictions. Contrasts can be interesting.
Prefer scoring penalties unless a pair is clearly harmful.

Potential benefit:

- Fewer incoherent combinations.
- Keep creative tension, but reduce random soup.

### Next Phase 3: Bridge Tags / Contrast Handling

Problem: some contradictions are useful when framed as contrast:

- `retro` + `futuristic`
- `editorial` + `digital`
- `minimal` + `maximal`
- `warm` + `cold`

Possible approach:

- Treat certain pairs as allowed if another selected item includes a bridge tag
  or if the renderer frames them as intentional contrast.
- Keep this small. Do not build a large rules engine unless samples prove it is
  needed.

Potential benefit:

- Preserve weird/meme/retro/fx landing-page energy.
- Avoid flattening everything into safe corporate output.

### Next Phase 4: Distribution Tests After Mechanics

After grouped tags or contradiction scoring:

- Re-run `npm run check`.
- Run distribution tests.
- Generate 8-12 `npm run dev` samples and inspect manually.
- Compare against current baseline above.

## Recommended Next Step

Start with grouped tag metadata and tests.

Suggested TDD path:

1. Add tests for tag metadata coverage:
   - every `DesignTag` has a group
   - no unknown group names
2. Add tests for a scoring helper:
   - same-group matches score predictably
   - capped generic matches still apply
   - contradiction penalty lowers candidate weight
3. Integrate scoring helper into `selectDistinct` only after helper tests pass.
4. Run full `npm run check`.
5. Run `npm run dev` samples and compare output quality.

## Open Questions

- Should contradictions be penalized globally or only after anchor categories
  (`era`, `style`, `mood`) are chosen?
- Should `antiPattern` use contradiction metadata, or remain separate with one
  relevant risk plus one neutral risk?
- Should grouped tags remain metadata-only, or should catalog values eventually
  use more precise tags like `screen-native`, `publication`, `polished`,
  `low-noise`?

Recommendation: keep grouped tags metadata-only for the next change. Avoid a
large catalog retagging pass until scoring behavior is proven.
