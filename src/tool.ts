import { readFileSync } from "node:fs";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { generateDesignProfile } from "./generator.js";
import { renderDesignDescription } from "./render-markdown.js";
import type { GenerationContext } from "./types.js";

const packageJson = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf8"),
) as { version: string };

export const generateDesignDescriptionInputSchema = z.strictObject({
  productType: z.string().optional(),
  audience: z.string().optional(),
  priority: z.string().optional(),
  compatibility: z.boolean().optional(),
});
export const getVersionInputSchema = z.strictObject({});

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

export function getVersion(): string {
  return packageJson.version;
}

export function handleGetVersion() {
  return {
    content: [{ type: "text" as const, text: getVersion() }],
  };
}

export function createServer(): McpServer {
  const server = new McpServer({
    name: "random-design-mcp",
    version: getVersion(),
  });
  server.registerTool(
    "generate_design_description",
    {
      title: "Generate Design Description",
      description:
        "Generate one randomized English Markdown frontend design direction. " +
        "Infer optional productType, audience, and priority context from the user's request " +
        "and pass those fields in English. Set compatibility to false only when the user " +
        "explicitly wants unconstrained chaotic combinations.",
      inputSchema: generateDesignDescriptionInputSchema,
    },
    async (input) => handleGenerateDesignDescription(input),
  );
  server.registerTool(
    "get_version",
    {
      title: "Get Version",
      description:
        "Return the random-design-mcp package version from package.json for debugging cache or publish state.",
      inputSchema: getVersionInputSchema,
    },
    async () => handleGetVersion(),
  );
  return server;
}
