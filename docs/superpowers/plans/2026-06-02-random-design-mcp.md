# Random Design MCP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a local TypeScript stdio MCP server exposing one tool that returns a randomized English Markdown frontend design direction.

**Architecture:** Keep design generation independent from MCP. Curated TypeScript catalogs feed a selector with optional soft compatibility scoring. The generator creates a typed profile, the renderer turns it into Markdown, and the MCP boundary exposes one schema-validated tool.

**Tech Stack:** Node.js 22, TypeScript 6, npm, stable `@modelcontextprotocol/sdk` v1, Zod 4, Vitest 4.

---

## SDK Decision

Use stable MCP SDK v1:

```bash
npm install @modelcontextprotocol/sdk zod
```

Do not use `@modelcontextprotocol/server` yet. On 2026-06-02 npm reports
`2.0.0-alpha.2`. Stable `@modelcontextprotocol/sdk` reports `1.29.0`.

Use v1 imports:

```ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
```

## File Map

```text
package.json                         npm scripts and dependencies
tsconfig.json                        strict ESM TypeScript build config
src/config.ts                        generation probabilities and scorer weight
src/types.ts                         shared generator types
src/catalog/catalog-item.ts          catalog item helper
src/catalog/*.ts                     one editable design-quality catalog per file
src/catalog/index.ts                 catalog registry and runtime validation
src/random.ts                        random source and weighted selection
src/generator.ts                     randomized typed design profile
src/render-markdown.ts               English Markdown rendering
src/tool.ts                          MCP schema, description, handler, server factory
src/index.ts                         stdio process entrypoint
tests/catalog.test.ts                catalog size and integrity checks
tests/random.test.ts                 uniform and compatibility-weighted selection
tests/generator.test.ts              profile construction and toggles
tests/render-markdown.test.ts        output format and context trimming
tests/tool.test.ts                   schema and handled MCP error behavior
README.md                            local install and MCP client configuration
```

## Catalog Vocabulary

Use this shared tag vocabulary. Catalog entries may use multiple tags:

```ts
export type DesignTag =
  | "historic"
  | "retro"
  | "futuristic"
  | "digital"
  | "organic"
  | "industrial"
  | "editorial"
  | "minimal"
  | "maximal"
  | "soft"
  | "sharp"
  | "playful"
  | "serious"
  | "luxury"
  | "underground"
  | "bright"
  | "dark"
  | "warm"
  | "cold"
  | "clean"
  | "textured"
  | "dense"
  | "sparse";
```

Use these minimum catalog sizes:

| Catalog | Minimum |
| --- | ---: |
| `eras`, `styles`, `moods`, `palettes`, `typography` | 40 |
| Every other catalog | 20 |

Use these approved values as source data. Add explicit `DesignTag[]` to every
entry based on meaning; keep tags within vocabulary above.

```text
eras:
Ancient Egypt; Classical Greece; Roman Empire; Medieval; Gothic; Renaissance;
Baroque; Rococo; Victorian; Belle Epoque; Art Nouveau; Art Deco; Bauhaus;
Mid-century modern; Space Age; Soviet modernism; 1970s retro; 1980s synthwave;
1990s cyberculture; Y2K; Contemporary; Near future; Far future;
Post-apocalyptic future; Early internet; Web 1.0; Windows 95; Arcade;
8-bit console; 16-bit console; Retro terminal; Dot-com futurism; Frutiger Aero;
Vaporwave; Cyberpunk; Solarpunk; Biopunk; Cassette futurism; Retro futurism;
Ancient alien civilization; Dark fantasy kingdom; Industrial dystopia;
Corporate utopia; Space colony; Neon megacity; Analog sci-fi laboratory;
Interstellar civilization; Post-human minimalism

styles:
Minimalism; Brutalism; Neo-brutalism; Swiss design; International typographic style;
Editorial; Magazine collage; Maximalism; Glassmorphism; Neumorphism; Flat design;
Material-inspired; Geometric abstraction; Organic modernism; Luxury editorial;
Corporate modernism; Utilitarian; Industrial; Blueprint; Technical manual;
Constructivism; De Stijl; Memphis; Psychedelic; Grunge; Punk zine; Streetwear;
Graffiti-inspired; Retro futurism; Sci-fi interface; Cybernetic; Terminal UI;
Pixel art; Vaporwave; Synthwave; Frutiger Aero; Dark academia; Cottagecore;
Museum archive; High-fashion campaign; Monochrome photography; Pop art;
Comic-book; Handcrafted; Experimental web

moods:
Calm; Aggressive; Playful; Ominous; Luxurious; Rebellious; Optimistic;
Melancholic; Clinical; Mysterious; Energetic; Serene; Nostalgic; Futuristic;
Authoritative; Friendly; Underground; Sophisticated; Raw; Dreamlike; Precise;
Chaotic; Meditative; Dramatic; Intimate; Monumental; Curious; Eccentric; Elegant;
Tense; Warm; Cold; Joyful; Serious; Provocative; Hopeful; Cinematic; Weird;
Focused; Otherworldly

palettes:
Charcoal and acid green; Black and electric cyan; Deep navy and neon magenta;
Warm ivory and oxblood; Concrete gray and safety orange; Paper white and ink black;
Muted earth tones; Forest green and cream; Terracotta and sand; Dusty rose and burgundy;
Pastel candy colors; Ice blue and silver; Chrome and ultraviolet; Cobalt and lemon;
Emerald and gold; Midnight blue and copper; Black and red; Sepia and faded teal;
CRT green monochrome; Amber terminal monochrome; Grayscale; High-key white monochrome;
Low-key black monochrome; Solarized dark; Vaporwave pink and cyan; Synthwave purple and orange;
Frutiger sky blue and grass green; Bauhaus primary colors; Art Deco black and champagne;
Victorian jewel tones; Industrial rust and steel; Holographic rainbow; Bioluminescent aqua;
Toxic lime and purple; Soft lavender and slate; Coral and turquoise; Chocolate and mint;
Ultramarine and hot pink; Mustard and petrol blue; Pearl white and graphite;
Desert sunset gradient; Arctic blue gradient; Neon city night; Moss and stone;
Burnt orange and charcoal

typography:
Geometric sans; Condensed grotesk; Humanist sans; Neo-grotesk; Wide grotesk;
Rounded sans; Monospace terminal; Monospace technical; Slab serif; Editorial serif;
High-contrast Didone; Old-style serif; Transitional serif; Blackletter accent;
Art Nouveau display; Art Deco display; Bauhaus geometric display; Pixel bitmap;
CRT raster; Stencil; Industrial signage; Typewriter; Newspaper headline;
Magazine display; Fashion editorial; Handwritten marker; Brush lettering;
Graffiti display; Comic lettering; Sci-fi extended; Cyberpunk condensed;
Mechanical engraved; Architectural lettering; Blueprint annotation; Retro computer;
Y2K techno; Psychedelic warped; Minimal lowercase; All-caps utilitarian;
Mixed serif and monospace; Mixed grotesk and display; Oversized numerals;
Tiny annotation text; Variable-width experimental; Cutout collage lettering

shape-languages:
Sharp angular geometry; Soft rounded geometry; Strict rectangles; Organic blobs;
Asymmetric cutouts; Modular tiles; Circular systems; Diagonal slices; Arched frames;
Brutalist blocks; Thin-line wireframes; Layered panels; Pill-shaped controls;
Hexagonal motifs; Pixel-grid geometry; Torn-paper edges; Ornamental frames;
Mechanical joints; Fluid curves; Oversized geometric primitives

textures:
Perfectly clean surfaces; Fine film grain; Rough paper fibers; Newsprint halftone;
Brushed metal; Polished chrome; Frosted glass; Clear glass; Concrete pores;
CRT scanlines; VHS noise; Pixel dithering; Photocopier artifacts; Ink bleed;
Plastic gloss; Holographic foil; Fabric weave; Blueprint grid; Dust and scratches;
Subtle gradient mesh

densities:
Extremely sparse; Sparse; Airy; Balanced; Compact; Dense; Information-heavy;
Dashboard-dense; Poster-like; Single-focus; Layered; Editorial rhythm;
High whitespace; Tight grid; Generous margins; Edge-to-edge; Micro-detail rich;
Large-type dominant; Card-heavy; Content-first

layouts:
Strict Swiss grid; Asymmetric editorial grid; Modular card grid; Oversized hero;
Split screen; Layered collage; Single-column narrative; Bento grid; Masonry grid;
Horizontal scroll narrative; Full-bleed sections; Poster composition;
Dashboard shell; Sidebar workspace; Centered monument; Staggered blocks;
Diagonal flow; Timeline; Catalog grid; Technical schematic

imagery:
No imagery; Documentary photography; Studio product photography; Monochrome photography;
Duotone photography; 3D chrome objects; 3D clay objects; Abstract gradients;
Technical diagrams; Blueprint illustrations; Line art; Pixel art; Collage cutouts;
Archival scans; Botanical illustrations; Architectural renders; Isometric scenes;
Generative particles; Geometric icons; Oversized typography as imagery

motion:
Static; Subtle fades; Gentle parallax; Elastic micro-interactions; Mechanical transitions;
Glitch bursts; CRT flicker; Cinematic reveals; Scroll-driven storytelling;
Snappy interface feedback; Slow ambient drift; Layered depth movement; Marquee motion;
Ticker motion; Pixel-step animation; Expanding panels; Magnetic hover;
Smooth page morphs; Diagram drawing animation; Reduced-motion-first

tones:
Serious; Premium; Experimental; Underground; Friendly; Utilitarian; Scholarly;
Provocative; Technical; Reassuring; Exclusive; Accessible; Irreverent; Poetic;
Direct; Institutional; Countercultural; Optimistic; Disciplined; Exploratory

contrasts:
Low contrast; Medium contrast; High contrast; Extreme black-white contrast;
Soft tonal contrast; Neon-on-dark contrast; Dark-on-light contrast; Light-on-dark contrast;
Warm-cold contrast; Complementary color contrast; Muted with one loud accent;
Monochrome tonal range; Textural contrast; Scale contrast; Dense-sparse contrast;
Sharp-soft contrast; Matte-gloss contrast; Vintage-future contrast;
Editorial-interface contrast; Minimal-maximal contrast

border-treatments:
No borders; Hairline borders; Thin solid borders; Heavy black borders; Double-line borders;
Dashed technical borders; Dotted borders; Rounded outlines; Pill outlines;
Ornamental frames; Art Deco frames; Pixel borders; Glowing neon outlines;
Inset panel borders; Embossed borders; Hand-drawn borders; Cropped corner frames;
Bracket corners; Divider-only borders; Mixed-weight borders

lighting:
Flat even lighting; Soft diffuse glow; Neon bloom; Dramatic hard shadows;
Studio softbox; Rim lighting; Backlit silhouettes; Volumetric haze; Bioluminescent glow;
Screen-lit darkness; Golden-hour warmth; Cold fluorescent; Overexposed high key;
Underexposed low key; Chrome reflections; Glass refractions; Holographic shimmer;
Spotlight focus; Candlelit warmth; No lighting effects

materials:
Paper; Newsprint; Cardboard; Plastic; Translucent plastic; Chrome; Brushed steel;
Aluminum; Glass; Frosted glass; Concrete; Stone; Wood; Fabric; Leather;
Holographic foil; Ink; CRT phosphor; Enamel signage; Ceramic

signature-details:
CRT scanlines; Giant section numbers; Sticker clusters; Blueprint measurement marks;
Pixel icons; Terminal cursor; Marquee ticker; Cropped corner brackets; Ornamental dividers;
Chrome orb; Holographic highlights; Torn-paper collage edge; Handwritten annotations;
Dense footnotes; Oversized quotation marks; Diagram arrows; Warning labels;
Barcode motifs; Windowed desktop panels; Circular navigation marker

anti-patterns:
Generic SaaS gradients; Excessive rounded cards; Stock photography; Decorative clutter;
Low-contrast body text; Tiny primary actions; Unstructured spacing; Too many font families;
Meaningless glass effects; Gratuitous animation; Inconsistent icon styles;
Mobile-hostile fixed widths; Long unreadable line lengths; Hidden navigation;
Overloaded hero copy; Repetitive card grids; Random shadows; Fake dashboard metrics;
Ambiguous button labels; Visual effects that reduce readability
```

### Task 1: Bootstrap Strict TypeScript Project

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `.gitignore`

- [ ] **Step 1: Write package metadata and scripts**

Create `package.json`:

```json
{
  "name": "random-design-mcp",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "test": "vitest run",
    "check": "npm run build && npm test"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.29.0",
    "zod": "^4.4.3"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "typescript": "^6.0.3",
    "vitest": "^4.1.8"
  }
}
```

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "dist",
    "rootDir": ".",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*.ts", "tests/**/*.ts"]
}
```

Create `.gitignore`:

```gitignore
node_modules/
dist/
coverage/
```

- [ ] **Step 2: Install dependencies**

Run:

```bash
npm install
```

Expected: `package-lock.json` created and install exits `0`.

- [ ] **Step 3: Verify installed compiler**

Run:

```bash
npx tsc --version
```

Expected: output starts with `Version 6.` and command exits `0`.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json tsconfig.json .gitignore
git commit -m "chore: bootstrap TypeScript MCP project"
```

### Task 2: Add Catalog Types, Config, and Validation

**Files:**
- Create: `src/types.ts`
- Create: `src/config.ts`
- Create: `src/catalog/catalog-item.ts`
- Create: `src/catalog/index.ts`
- Create: `tests/catalog.test.ts`

- [ ] **Step 1: Write failing catalog validation tests**

Create `tests/catalog.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { validateCatalogs } from "../src/catalog/index.js";
import type { CatalogRegistry } from "../src/types.js";

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
});
```

- [ ] **Step 2: Run tests to verify failure**

Run:

```bash
npm test -- tests/catalog.test.ts
```

Expected: FAIL because `src/catalog/index.ts` does not exist.

- [ ] **Step 3: Add shared types**

Create `src/types.ts`:

```ts
export type DesignTag =
  | "historic" | "retro" | "futuristic" | "digital" | "organic"
  | "industrial" | "editorial" | "minimal" | "maximal" | "soft"
  | "sharp" | "playful" | "serious" | "luxury" | "underground"
  | "bright" | "dark" | "warm" | "cold" | "clean" | "textured"
  | "dense" | "sparse";

export type CatalogItem = {
  value: string;
  tags: readonly DesignTag[];
};

export const categoryNames = [
  "era", "style", "mood", "palette", "typography", "shapeLanguage",
  "texture", "density", "layout", "imagery", "motion", "tone",
  "contrast", "borderTreatment", "lighting", "material",
  "signatureDetail", "antiPattern",
] as const;

export type CategoryName = (typeof categoryNames)[number];
export type CatalogRegistry = Record<CategoryName, readonly CatalogItem[]>;

export type GenerationContext = {
  productType?: string;
  audience?: string;
  priority?: string;
  compatibility?: boolean;
};

export type DesignProfile = {
  era: string[];
  style: string[];
  mood: string;
  palette: string;
  typography: string;
  shapeLanguage: string;
  texture: string;
  density: string;
  layout: string;
  imagery: string;
  motion: string;
  tone: string;
  contrast: string;
  borderTreatment: string;
  lighting: string;
  material: string;
  signatureDetail: string[];
  antiPattern: string[];
};
```

Create `src/config.ts`:

```ts
export type GeneratorConfig = {
  compatibilityDefault: boolean;
  compatibilityTagWeight: number;
  secondEraProbability: number;
  secondStyleProbability: number;
  secondSignatureDetailProbability: number;
};

export const generatorConfig: GeneratorConfig = {
  compatibilityDefault: true,
  compatibilityTagWeight: 2,
  secondEraProbability: 0.3,
  secondStyleProbability: 0.25,
  secondSignatureDetailProbability: 0.3,
};
```

Create `src/catalog/catalog-item.ts`:

```ts
import type { CatalogItem, DesignTag } from "../types.js";

export const item = (value: string, ...tags: DesignTag[]): CatalogItem => ({
  value,
  tags,
});
```

- [ ] **Step 4: Add initial registry validator**

Create `src/catalog/index.ts`:

```ts
import type { CatalogRegistry, CategoryName } from "../types.js";
import { categoryNames } from "../types.js";

export const minimumCatalogSizes: Record<CategoryName, number> = {
  era: 40,
  style: 40,
  mood: 40,
  palette: 40,
  typography: 40,
  shapeLanguage: 20,
  texture: 20,
  density: 20,
  layout: 20,
  imagery: 20,
  motion: 20,
  tone: 20,
  contrast: 20,
  borderTreatment: 20,
  lighting: 20,
  material: 20,
  signatureDetail: 20,
  antiPattern: 20,
};

export function validateCatalogs(catalogs: CatalogRegistry): void {
  for (const category of categoryNames) {
    const catalog = catalogs[category] ?? [];
    const minimum = minimumCatalogSizes[category];
    for (const catalogItem of catalog) {
      if (!catalogItem.value.trim()) {
        throw new Error(`Catalog ${category} contains an item with empty text`);
      }
      if (catalogItem.tags.length === 0) {
        throw new Error(
          `Catalog ${category} item ${catalogItem.value} must include at least one tag`,
        );
      }
    }
    if (catalog.length < minimum) {
      throw new Error(`Catalog ${category} must contain at least ${minimum} items`);
    }
  }
}
```

- [ ] **Step 5: Run focused test**

Run:

```bash
npm test -- tests/catalog.test.ts
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/types.ts src/config.ts src/catalog/catalog-item.ts src/catalog/index.ts tests/catalog.test.ts
git commit -m "feat: add catalog model and validation"
```

### Task 3: Populate Editable Design Catalogs

**Files:**
- Create: `src/catalog/eras.ts`
- Create: `src/catalog/styles.ts`
- Create: `src/catalog/moods.ts`
- Create: `src/catalog/palettes.ts`
- Create: `src/catalog/typography.ts`
- Create: `src/catalog/shape-languages.ts`
- Create: `src/catalog/textures.ts`
- Create: `src/catalog/densities.ts`
- Create: `src/catalog/layouts.ts`
- Create: `src/catalog/imagery.ts`
- Create: `src/catalog/motion.ts`
- Create: `src/catalog/tones.ts`
- Create: `src/catalog/contrasts.ts`
- Create: `src/catalog/border-treatments.ts`
- Create: `src/catalog/lighting.ts`
- Create: `src/catalog/materials.ts`
- Create: `src/catalog/signature-details.ts`
- Create: `src/catalog/anti-patterns.ts`
- Modify: `src/catalog/index.ts`
- Modify: `tests/catalog.test.ts`

- [ ] **Step 1: Extend failing test for real registry**

Add imports beside existing imports and append the test to `tests/catalog.test.ts`:

```ts
import { catalogs } from "../src/catalog/index.js";
import { categoryNames } from "../src/types.js";

it("ships valid catalogs for every required category", () => {
  expect(() => validateCatalogs(catalogs)).not.toThrow();
  expect(Object.keys(catalogs).sort()).toEqual([...categoryNames].sort());
});
```

- [ ] **Step 2: Run test to verify failure**

Run:

```bash
npm test -- tests/catalog.test.ts
```

Expected: FAIL because `catalogs` is not exported.

- [ ] **Step 3: Create catalog modules**

Create one module per catalog using the approved value lists in **Catalog
Vocabulary**. Every value becomes one explicit `item()` call with `1-4`
meaningful tags.

Use this exact format:

```ts
import { item } from "./catalog-item.js";

export const eras = [
  item("Ancient Egypt", "historic", "warm", "textured"),
  item("Classical Greece", "historic", "clean"),
  item("Roman Empire", "historic", "serious"),
] as const;
```

The snippet demonstrates tuple shape only. Each completed module must contain
every corresponding approved value listed in **Catalog Vocabulary**. Do not
generate tags at runtime. Tags are editable catalog data. Do not add values
outside approved lists during this task.

- [ ] **Step 4: Export complete registry**

Append imports and registry to `src/catalog/index.ts`:

```ts
import { antiPatterns } from "./anti-patterns.js";
import { borderTreatments } from "./border-treatments.js";
import { contrasts } from "./contrasts.js";
import { densities } from "./densities.js";
import { eras } from "./eras.js";
import { imagery } from "./imagery.js";
import { layouts } from "./layouts.js";
import { lighting } from "./lighting.js";
import { materials } from "./materials.js";
import { moods } from "./moods.js";
import { motion } from "./motion.js";
import { palettes } from "./palettes.js";
import { shapeLanguages } from "./shape-languages.js";
import { signatureDetails } from "./signature-details.js";
import { styles } from "./styles.js";
import { textures } from "./textures.js";
import { tones } from "./tones.js";
import { typography } from "./typography.js";

export const catalogs: CatalogRegistry = {
  era: eras,
  style: styles,
  mood: moods,
  palette: palettes,
  typography,
  shapeLanguage: shapeLanguages,
  texture: textures,
  density: densities,
  layout: layouts,
  imagery,
  motion,
  tone: tones,
  contrast: contrasts,
  borderTreatment: borderTreatments,
  lighting,
  material: materials,
  signatureDetail: signatureDetails,
  antiPattern: antiPatterns,
};
```

- [ ] **Step 5: Run catalog tests and compiler**

Run:

```bash
npm test -- tests/catalog.test.ts
npm run build
```

Expected: PASS and exit `0`.

- [ ] **Step 6: Commit**

```bash
git add src/catalog tests/catalog.test.ts
git commit -m "feat: add curated design catalogs"
```

### Task 4: Add Uniform and Compatibility-Weighted Selection

**Files:**
- Create: `src/random.ts`
- Create: `tests/random.test.ts`

- [ ] **Step 1: Write failing selector tests**

Create `tests/random.test.ts`:

```ts
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
    const result = selectDistinct(candidates, 2, [], false, () => 0);
    expect(result.map(({ value }) => value)).toEqual(["Clean", "Dark"]);
  });

  it("increases weight for matching tags when compatibility is enabled", () => {
    const result = selectDistinct(candidates, 1, ["digital"], true, () => 0.8);
    expect(result.map(({ value }) => value)).toEqual(["Digital"]);
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
```

- [ ] **Step 2: Run tests to verify failure**

Run:

```bash
npm test -- tests/random.test.ts
```

Expected: FAIL because `src/random.ts` does not exist.

- [ ] **Step 3: Implement selector**

Create `src/random.ts`:

```ts
import { generatorConfig } from "./config.js";
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
  while (selected.length < count) {
    const weights = remaining.map((candidate) => {
      if (!compatibility) return 1;
      const matches = candidate.tags.filter((tag) => activeTags.includes(tag)).length;
      return 1 + matches * generatorConfig.compatibilityTagWeight;
    });
    const chosen = chooseWeighted(remaining, weights, random);
    selected.push(chosen);
    remaining.splice(remaining.indexOf(chosen), 1);
  }
  return selected;
}
```

- [ ] **Step 4: Run focused tests**

Run:

```bash
npm test -- tests/random.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/random.ts tests/random.test.ts
git commit -m "feat: add compatibility weighted selector"
```

### Task 5: Generate Typed Design Profiles

**Files:**
- Create: `src/generator.ts`
- Create: `tests/generator.test.ts`

- [ ] **Step 1: Write failing generator tests**

Create `tests/generator.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { generateDesignProfile } from "../src/generator.js";

describe("generateDesignProfile", () => {
  it("creates every profile field", () => {
    const profile = generateDesignProfile({ random: () => 0.99 });
    expect(Object.keys(profile).sort()).toEqual([
      "antiPattern", "borderTreatment", "contrast", "density", "era", "imagery",
      "layout", "lighting", "material", "mood", "motion", "palette",
      "shapeLanguage", "signatureDetail", "style", "texture", "tone", "typography",
    ].sort());
  });

  it("selects optional second values when random falls below probabilities", () => {
    const profile = generateDesignProfile({ random: () => 0 });
    expect(profile.era).toHaveLength(2);
    expect(profile.style).toHaveLength(2);
    expect(profile.signatureDetail).toHaveLength(2);
    expect(profile.antiPattern).toHaveLength(2);
  });

  it("uses config default when compatibility is absent", () => {
    const profile = generateDesignProfile({ random: () => 0.5 });
    expect(profile.era.length).toBeGreaterThan(0);
  });

  it("supports full-chaos selection when compatibility is false", () => {
    const profile = generateDesignProfile({ compatibility: false, random: () => 0.5 });
    expect(profile.style.length).toBeGreaterThan(0);
  });

  it("validates catalogs before selecting", () => {
    expect(() => generateDesignProfile({ random: () => 0.5 })).not.toThrow();
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

Run:

```bash
npm test -- tests/generator.test.ts
```

Expected: FAIL because `src/generator.ts` does not exist.

- [ ] **Step 3: Implement profile generation**

Create `src/generator.ts`:

```ts
import { catalogs, validateCatalogs } from "./catalog/index.js";
import { generatorConfig } from "./config.js";
import { defaultRandom, selectDistinct, type RandomSource } from "./random.js";
import type { CatalogItem, DesignProfile, DesignTag } from "./types.js";

type GeneratorOptions = {
  compatibility?: boolean;
  random?: RandomSource;
};

export function generateDesignProfile({
  compatibility = generatorConfig.compatibilityDefault,
  random = defaultRandom,
}: GeneratorOptions = {}): DesignProfile {
  validateCatalogs(catalogs);
  const activeTags: DesignTag[] = [];

  const select = (category: keyof typeof catalogs, count = 1): CatalogItem[] => {
    const selected = selectDistinct(catalogs[category], count, activeTags, compatibility, random);
    activeTags.push(...selected.flatMap(({ tags }) => tags));
    return selected;
  };
  const values = (items: CatalogItem[]): string[] => items.map(({ value }) => value);
  const value = (category: keyof typeof catalogs): string => select(category)[0].value;
  const optionalCount = (probability: number): number => random() < probability ? 2 : 1;

  return {
    era: values(select("era", optionalCount(generatorConfig.secondEraProbability))),
    style: values(select("style", optionalCount(generatorConfig.secondStyleProbability))),
    mood: value("mood"),
    palette: value("palette"),
    typography: value("typography"),
    shapeLanguage: value("shapeLanguage"),
    texture: value("texture"),
    density: value("density"),
    layout: value("layout"),
    imagery: value("imagery"),
    motion: value("motion"),
    tone: value("tone"),
    contrast: value("contrast"),
    borderTreatment: value("borderTreatment"),
    lighting: value("lighting"),
    material: value("material"),
    signatureDetail: values(
      select("signatureDetail", optionalCount(generatorConfig.secondSignatureDetailProbability)),
    ),
    antiPattern: values(select("antiPattern", 2)),
  };
}
```

- [ ] **Step 4: Run focused tests and compiler**

Run:

```bash
npm test -- tests/generator.test.ts
npm run build
```

Expected: PASS and exit `0`.

- [ ] **Step 5: Commit**

```bash
git add src/generator.ts tests/generator.test.ts
git commit -m "feat: generate randomized design profiles"
```

### Task 6: Render English Markdown Prompt

**Files:**
- Create: `src/render-markdown.ts`
- Create: `tests/render-markdown.test.ts`

- [ ] **Step 1: Write failing renderer tests**

Create `tests/render-markdown.test.ts`:

```ts
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
```

- [ ] **Step 2: Run tests to verify failure**

Run:

```bash
npm test -- tests/render-markdown.test.ts
```

Expected: FAIL because `src/render-markdown.ts` does not exist.

- [ ] **Step 3: Implement Markdown rendering**

Create `src/render-markdown.ts`:

```ts
import type { DesignProfile, GenerationContext } from "./types.js";

const trim = (value?: string): string | undefined => value?.trim() || undefined;
const list = (values: readonly string[]): string => values.join(" + ");

export function renderDesignDescription(
  profile: DesignProfile,
  context: GenerationContext = {},
): string {
  const contextLines = [
    ["Product type", trim(context.productType)],
    ["Audience", trim(context.audience)],
    ["Priority", trim(context.priority)],
  ]
    .filter((entry): entry is [string, string] => Boolean(entry[1]))
    .map(([label, value]) => `${label}: ${value}`);

  const sections = [
    "# Design Direction",
    contextLines.length ? `## Context\n${contextLines.join("\n")}` : "",
    `## Generated Parameters
Era: ${list(profile.era)}
Style: ${list(profile.style)}
Mood: ${profile.mood}
Palette: ${profile.palette}
Typography: ${profile.typography}
Shape language: ${profile.shapeLanguage}
Texture: ${profile.texture}
Density: ${profile.density}
Layout: ${profile.layout}
Imagery: ${profile.imagery}
Motion: ${profile.motion}
Tone: ${profile.tone}
Contrast: ${profile.contrast}
Border treatment: ${profile.borderTreatment}
Lighting: ${profile.lighting}
Material: ${profile.material}
Signature detail: ${list(profile.signatureDetail)}`,
    `## Constraints
${profile.antiPattern.map((value) => `- Avoid ${value}`).join("\n")}`,
    `## Frontend Design Prompt
Create a frontend design using the direction above. Apply the generated visual language consistently while preserving usability, responsive behavior, accessible contrast, and clear hierarchy. Respect the supplied page context and avoid the listed anti-patterns.`,
  ];

  return sections.filter(Boolean).join("\n\n");
}
```

- [ ] **Step 4: Run focused tests**

Run:

```bash
npm test -- tests/render-markdown.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/render-markdown.ts tests/render-markdown.test.ts
git commit -m "feat: render frontend design prompt"
```

### Task 7: Expose Single MCP Tool and stdio Entrypoint

**Files:**
- Create: `src/tool.ts`
- Create: `src/index.ts`
- Create: `tests/tool.test.ts`

- [ ] **Step 1: Write failing schema and handler tests**

Create `tests/tool.test.ts`:

```ts
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
```

- [ ] **Step 2: Run test to verify failure**

Run:

```bash
npm test -- tests/tool.test.ts
```

Expected: FAIL because `src/tool.ts` does not exist.

- [ ] **Step 3: Implement MCP schema, handler, and server factory**

Create `src/tool.ts`:

```ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { generateDesignProfile } from "./generator.js";
import { renderDesignDescription } from "./render-markdown.js";
import type { GenerationContext } from "./types.js";

export const generateDesignDescriptionInputSchema = z.object({
  productType: z.string().optional(),
  audience: z.string().optional(),
  priority: z.string().optional(),
  compatibility: z.boolean().optional(),
}).strict();

type GenerateInput = z.infer<typeof generateDesignDescriptionInputSchema>;
type Generate = (input: GenerateInput) => string;

export const generateDesignDescription: Generate = (input) =>
  renderDesignDescription(
    generateDesignProfile({ compatibility: input.compatibility }),
    input,
  );

export function handleGenerateDesignDescription(
  input: GenerationContext,
  generate: Generate = generateDesignDescription,
) {
  try {
    return {
      content: [{ type: "text" as const, text: generate(input) }],
    };
  } catch (error) {
    return {
      content: [{
        type: "text" as const,
        text: `Failed to generate design description: ${
          error instanceof Error ? error.message : String(error)
        }`,
      }],
      isError: true,
    };
  }
}

export function createServer(): McpServer {
  const server = new McpServer({ name: "random-design-mcp", version: "0.1.0" });
  server.registerTool(
    "generate_design_description",
    {
      title: "Generate Design Description",
      description:
        "Generate one randomized English Markdown frontend design direction. " +
        "Infer optional productType, audience, and priority context from the user's request " +
        "and pass those fields in English. Set compatibility to false only when the user " +
        "explicitly wants unconstrained chaotic combinations.",
      inputSchema: generateDesignDescriptionInputSchema.shape,
    },
    async (input) => handleGenerateDesignDescription(input),
  );
  return server;
}
```

- [ ] **Step 4: Add stdio process entrypoint**

Create `src/index.ts`:

```ts
#!/usr/bin/env node
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createServer } from "./tool.js";

async function main(): Promise<void> {
  const server = createServer();
  await server.connect(new StdioServerTransport());
}

main().catch((error: unknown) => {
  console.error("Random Design MCP failed to start:", error);
  process.exitCode = 1;
});
```

- [ ] **Step 5: Run focused test and compiler**

Run:

```bash
npm test -- tests/tool.test.ts
npm run build
```

Expected: PASS and exit `0`.

- [ ] **Step 6: Commit**

```bash
git add src/tool.ts src/index.ts tests/tool.test.ts
git commit -m "feat: expose random design MCP tool"
```

### Task 8: Document Local MCP Setup and Verify End-to-End

**Files:**
- Create: `README.md`

- [ ] **Step 1: Write README**

Create `README.md`:

````md
# Random Design MCP

Local TypeScript MCP server that returns randomized English Markdown frontend
design directions. It uses curated catalogs and optional soft compatibility
scoring. It does not call an LLM.

## Install

```bash
npm install
npm run build
```

## MCP Configuration

Configure a local MCP client to spawn the built stdio server:

```json
{
  "mcpServers": {
    "random-design": {
      "command": "node",
      "args": [
        "/Users/h0b0/Documents/private/random-design-mcp/dist/src/index.js"
      ]
    }
  }
}
```

## Tool

`generate_design_description` accepts optional free-text English context:

```ts
{
  productType?: string;
  audience?: string;
  priority?: string;
  compatibility?: boolean; // defaults to true
}
```

Set `compatibility: false` for unconstrained random combinations.

## Development

```bash
npm run check
```
````

- [ ] **Step 2: Run all verification**

Run:

```bash
npm run check
git status --short
```

Expected:

```text
> npm run build
> tsc -p tsconfig.json
> npm test
> vitest run
Test Files  5 passed
Tests  18 passed
?? README.md
```

- [ ] **Step 3: Commit README**

```bash
git add README.md
git commit -m "docs: add local MCP setup"
```

- [ ] **Step 4: Confirm clean worktree and inspect commits**

Run:

```bash
git status --short --branch
git log --oneline --decorate -10
```

Expected: clean `main` worktree with spec commit plus eight implementation
commits.

## Final App Setup

After implementation:

1. Add `/Users/h0b0/Documents/private/random-design-mcp` as a saved Codex
   Project using Codex desktop UI. Current available thread API can target an
   existing saved project but cannot create one.
2. Create a new local project thread for that saved project.
3. Configure agents that should use this server with the `node
   /Users/h0b0/Documents/private/random-design-mcp/dist/src/index.js` stdio
   command.
4. Keep this original projectless design thread as historical context. Current
   available Codex API cannot move an existing thread into a saved project.
