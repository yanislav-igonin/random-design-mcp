import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { generateDesignProfile } from "./generator.js";
import { renderDesignDescription } from "./render-markdown.js";
import type { GenerationContext } from "./types.js";

export const generateDesignDescriptionInputSchema = z.strictObject({
  productType: z.string().optional(),
  audience: z.string().optional(),
  priority: z.string().optional(),
  compatibility: z.boolean().optional(),
});

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
      inputSchema: generateDesignDescriptionInputSchema,
    },
    async (input) => handleGenerateDesignDescription(input),
  );
  return server;
}
