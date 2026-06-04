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

## Publishing

This package is prepared for npm and the MCP Registry:

- npm package: `random-design-mcp`
- MCP Registry name: `io.github.yanislav-igonin/random-design-mcp`
- Registry metadata: `server.json`

Manual first publish:

```bash
npm adduser
npm run check
npm pack --dry-run
npm publish --access public
mcp-publisher login github
mcp-publisher publish
```

Automated publish runs from `.github/workflows/publish.yml` when a version tag is
pushed:

```bash
git tag v1.0.0
git push origin v1.0.0
```

Required GitHub secret:

- `NPM_TOKEN`: npm automation token allowed to publish `random-design-mcp`

MCP Registry publishing uses GitHub OIDC, so no MCP registry secret is required.
