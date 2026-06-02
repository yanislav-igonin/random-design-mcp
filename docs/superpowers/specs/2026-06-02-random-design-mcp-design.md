# Random Design MCP Design

## Goal

Build a local TypeScript MCP server that gives frontend agents a randomized,
coherent design direction. The server does not call an LLM. It exposes one MCP
tool and returns one English Markdown document that can be pasted into or used
directly by a frontend-design agent.

## Scope

Version 1 includes:

- A local MCP server connected through `stdio`.
- One MCP tool named `generate_design_description`.
- A TypeScript generator core called directly by the MCP tool.
- Editable TypeScript catalogs containing design qualities and compatibility
  tags.
- Configurable probabilities for optional blends and multiple-value choices.
- Optional compatibility scoring, controlled per tool call.
- English Markdown output containing selected parameters and a ready-to-use
  frontend prompt.
- Automated tests for generator behavior, catalog integrity, Markdown output,
  and MCP input schema.

Version 1 excludes:

- LLM calls.
- CLI commands.
- HTTP transport, ports, Docker, and authentication.
- Persistent state and saved generations.
- A seed argument and deterministic replay.
- A user interface.

An LLM adapter may be added later as a separate version 2 concern. It can accept
the generated design direction and rewrite or expand the final prompt.

## MCP Interface

The server exposes exactly one tool:

```ts
generate_design_description({
  productType?: string,
  audience?: string,
  priority?: string,
  compatibility?: boolean
}) => string
```

Argument behavior:

- `productType`, `audience`, and `priority` are optional free-text context.
- Context fields containing only whitespace are treated as absent.
- `compatibility` defaults to `true`.
- The MCP tool description instructs agents to infer relevant context from the
  user's request and pass context fields in English.
- The generator does not translate or parse natural language beyond trimming
  optional context values.

The MCP response contains one text content item with the rendered English
Markdown document. Generation errors are caught at the MCP boundary and returned
as clear error text without terminating the server process.

## Architecture

```text
MCP stdio entrypoint
  -> generate_design_description tool
    -> generator core
      -> catalog/*.ts
      -> config.ts
      -> compatibility scorer
      -> Markdown renderer
```

Responsibilities:

- MCP entrypoint: create server, register the single tool, connect through
  `stdio`, and translate generator failures into MCP error responses.
- Generator core: select qualities according to configuration and return one
  generated design profile for rendering.
- Catalog files: define editable category values and compatibility tags.
- Configuration: define probabilities for optional blends and extra selections.
- Compatibility scorer: increase selection weight for candidates that share
  tags with already selected values.
- Markdown renderer: create the final English design direction and frontend
  prompt.

The generator core remains independent from MCP so it can be tested directly.

## Catalog

Catalog files are grouped by category:

```text
src/catalog/
  anti-patterns.ts
  border-treatments.ts
  contrasts.ts
  densities.ts
  eras.ts
  imagery.ts
  layouts.ts
  lighting.ts
  materials.ts
  moods.ts
  motion.ts
  palettes.ts
  shape-languages.ts
  signature-details.ts
  styles.ts
  textures.ts
  tones.ts
  typography.ts
```

Each catalog value contains English text and tags:

```ts
type CatalogItem = {
  value: string;
  tags: string[];
};
```

The initial catalog is intentionally medium-sized:

- Aim for roughly `40-50` entries in `eras`, `styles`, `moods`, `palettes`, and
  `typography`.
- Aim for roughly `20-30` entries in other categories.
- Prefer values with distinct design meaning. Avoid duplicating the same idea
  across categories.

The `eras` catalog includes historical eras, digital eras, and useful fictional
eras. Examples include `Victorian`, `Bauhaus`, `Early internet`,
`Frutiger Aero`, `Cyberpunk`, `Solarpunk`, `Neon megacity`, and
`Analog sci-fi laboratory`.

## Generation Rules

Every generation selects:

| Category | Selection count |
| --- | --- |
| `era` | One, with configurable chance of a two-era blend |
| `style` | One, with configurable chance of selecting two |
| `mood` | One |
| `palette` | One |
| `typography` | One |
| `shapeLanguage` | One |
| `texture` | One |
| `density` | One |
| `layout` | One |
| `imagery` | One |
| `motion` | One |
| `tone` | One |
| `contrast` | One |
| `borderTreatment` | One |
| `lighting` | One |
| `material` | One |
| `signatureDetail` | One, with configurable chance of selecting two |
| `antiPattern` | Two distinct values |

`src/config.ts` contains explicit probabilities. Initial defaults:

```ts
{
  compatibilityDefault: true,
  secondEraProbability: 0.3,
  secondStyleProbability: 0.25,
  secondSignatureDetailProbability: 0.3
}
```

The implementation uses an injectable random source internally. This supports
focused tests without exposing deterministic replay through MCP.

## Compatibility Scoring

Compatibility uses tags and soft weighting:

- Each selected item contributes tags to the active design direction.
- Candidate values sharing active tags receive a higher selection weight.
- Candidates without shared tags remain possible.
- No hard conflict matrix is required in version 1.
- Deliberate contrasting blends remain possible, such as
  `Victorian + Cyberpunk`.
- With `compatibility: false`, selection uses uniform random choice and bypasses
  compatibility scoring entirely.

This provides managed variety without making catalog maintenance expensive.

## Markdown Output

The tool returns one English Markdown document:

```md
# Design Direction

## Context
Product type: ...
Audience: ...
Priority: ...

## Generated Parameters
Era: ...
Style: ...
Mood: ...
...

## Constraints
- Avoid ...
- Avoid ...

## Frontend Design Prompt
Create a frontend design using the direction above...
```

Rules:

- Omit `## Context` when no context fields are present.
- Omit individual context lines when their values are absent.
- Include every generated design category.
- Format selected blends and multiple selections clearly.
- Render anti-pattern values as explicit constraints.
- End with an actionable frontend prompt that tells an agent to apply the
  generated direction while preserving usability, responsiveness, and the
  supplied page context.

## Error Handling

The generator validates catalog assumptions at runtime:

- Every required catalog must contain enough values for its configured
  selection count.
- Catalog values must have non-empty text and at least one tag.
- Multiple selections from one category must be distinct.

Invalid catalog or configuration state produces a descriptive error. The MCP
entrypoint catches that error and returns an MCP tool error response while
keeping the process alive.

## Testing

Tests cover:

- Every generated category appears in rendered Markdown.
- Optional context is rendered when present and omitted when empty.
- `compatibility` defaults to `true`.
- `compatibility: false` bypasses compatibility scoring.
- Controlled random sources exercise era blending, two-style selection, and
  two-signature-detail selection.
- Multiple selections from one category are distinct.
- Every required catalog is non-empty and every item has text and tags.
- MCP input schema accepts only the four documented optional arguments.
- MCP boundary returns clear error text when generation fails.

## Project Location

Repository:

```text
/Users/h0b0/Documents/private/random-design-mcp
```

