import type { DesignProfile, GenerationContext } from "./types.js";

const trim = (value?: string): string | undefined =>
  value?.trim().replace(/\s+/g, " ") || undefined;
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
