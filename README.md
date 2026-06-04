# Random Design MCP

TypeScript MCP server that returns randomized English Markdown frontend design
directions. It uses curated catalogs and optional soft compatibility scoring. It
does not call an LLM.

Website: https://random-design-mcp.h0b0.dev

## Install

Use the published npm package from any MCP client that supports stdio servers:

```json
{
  "mcpServers": {
    "random-design": {
      "command": "npx",
      "args": ["-y", "random-design-mcp"]
    }
  }
}
```

## Tool

`generate_design_description` returns one randomized Markdown design direction.
All input fields are optional, but passing context makes the result easier to
use:

```ts
{
  productType?: string;
  audience?: string;
  priority?: string;
  compatibility?: boolean; // defaults to true
}
```

- `productType`: what you are designing, such as `landing page`, `dashboard`,
  `mobile app`, or `pricing page`.
- `audience`: who the interface is for, such as `developers`, `founders`, or
  `enterprise buyers`.
- `priority`: what the design should optimize for or pay extra attention to,
  such as `conversion`, `readability`, `premium feel`, `dense data display`, or
  `playful experimentation`.
- `compatibility`: controls how wild the random combination can be. It defaults
  to `true`, which keeps generated parameters more coherent and practical. Set
  it to `false` for unconstrained combinations that can intentionally mix
  clashing eras, styles, palettes, layouts, and materials.

## Development

```bash
npm install
npm run build
npm run check
```

Preview one generated design direction locally:

```bash
npm run dev
```

Optional preview context:

```bash
RANDOM_DESIGN_PRODUCT_TYPE="Landing page" \
RANDOM_DESIGN_AUDIENCE="Developers" \
RANDOM_DESIGN_PRIORITY="Conversion" \
RANDOM_DESIGN_COMPATIBILITY=false \
npm run dev
```
