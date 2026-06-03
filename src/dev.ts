import { pathToFileURL } from "node:url";
import {
  generateDesignDescription,
  generateDesignDescriptionInputSchema,
} from "./tool.js";
import type { GenerationContext } from "./types.js";

type DevPreviewEnv = {
  RANDOM_DESIGN_PRODUCT_TYPE?: string;
  RANDOM_DESIGN_AUDIENCE?: string;
  RANDOM_DESIGN_PRIORITY?: string;
  RANDOM_DESIGN_COMPATIBILITY?: string;
};

function parseCompatibility(value: string | undefined): boolean | undefined {
  if (value === undefined) return undefined;
  if (value === "true") return true;
  if (value === "false") return false;
  throw new Error("RANDOM_DESIGN_COMPATIBILITY must be true or false");
}

export function parseDevContext(env: DevPreviewEnv = process.env): GenerationContext {
  return {
    productType: env.RANDOM_DESIGN_PRODUCT_TYPE,
    audience: env.RANDOM_DESIGN_AUDIENCE,
    priority: env.RANDOM_DESIGN_PRIORITY,
    compatibility: parseCompatibility(env.RANDOM_DESIGN_COMPATIBILITY),
  };
}

export function generateDevPreview(env: DevPreviewEnv = process.env): string {
  return generateDesignDescription(
    generateDesignDescriptionInputSchema.parse(parseDevContext(env)),
  );
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    console.log(generateDevPreview());
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
