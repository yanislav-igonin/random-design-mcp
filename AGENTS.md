# AGENTS.md

## Project Purpose

`random-design-mcp` is a TypeScript MCP server that generates randomized
frontend design directions as English Markdown.

The server does not call an LLM. It exposes one stdio MCP tool:
`generate_design_description`.

## Repository Map

- `src/index.ts`: executable stdio MCP entrypoint.
- `src/tool.ts`: MCP server creation, tool registration, input schema, and MCP
  boundary error handling.
- `src/generator.ts`: design profile generation core.
- `src/random.ts`: random selection helpers and injectable random source.
- `src/render-markdown.ts`: Markdown output renderer.
- `src/config.ts`: generator probabilities and config validation.
- `src/types.ts`: shared catalog, generation, and profile types.
- `src/catalog/*.ts`: editable design catalogs with compatibility tags.
- `tests/*.test.ts`: Vitest coverage for generator behavior, catalog integrity,
  Markdown rendering, publishing metadata, dev preview, and MCP tool behavior.
- `docs/superpowers/specs/`: design specs.
- `docs/superpowers/plans/`: implementation plans.
- `dist/`: generated build output. Do not edit by hand.

## Architecture

Flow:

```text
MCP stdio entrypoint
  -> generate_design_description tool
    -> generator core
      -> catalog/*.ts
      -> config.ts
      -> random.ts
      -> render-markdown.ts
```

Keep the generator core independent from MCP so it can be tested directly.

## Product Constraints

- Keep exactly one MCP tool unless user explicitly requests a product change.
- Tool name: `generate_design_description`.
- Output language: English Markdown.
- Optional input fields: `productType`, `audience`, `priority`,
  `compatibility`.
- `compatibility` defaults to `true`.
- Do not add LLM calls, HTTP transport, auth, persistent state, deterministic
  replay, or UI unless the user explicitly asks.
- Do not add undocumented input fields casually. The schema is strict and tests
  verify unknown arguments fail.

## Development Commands

```bash
npm install
npm run build
npm test
npm run check
npm run dev
```

`npm run check` runs build plus tests. Use it before claiming code changes are
complete.

## Coding Rules

- TypeScript is ESM. Keep `.js` extensions in local TypeScript imports.
- Prefer small pure functions in generator/rendering code.
- Keep catalog values in English.
- Every catalog item needs at least one tag.
- Avoid duplicate catalog values inside one category.
- Respect `minimumCatalogSizes` in `src/catalog/index.ts`.
- Use injectable randomness in tests instead of relying on global randomness.
- Catch generator errors at the MCP boundary and return readable MCP error text.

## Testing Guidance

- For tool contract changes, update or add tests in `tests/tool.test.ts`.
- For Markdown output changes, update `tests/render-markdown.test.ts`.
- For catalog changes, run catalog tests and preserve size/tag/duplicate
  invariants.
- For package or publish metadata changes, run `tests/publishing.test.ts`.

## Git Hygiene

- Do not edit `dist/` manually.
- Do not revert user changes unless user explicitly asks.
- Keep commits scoped to the requested change.
