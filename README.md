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
