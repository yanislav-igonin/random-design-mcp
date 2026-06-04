import type { DesignProfile, GenerationContext } from "./types.js";

const trim = (value?: string): string | undefined =>
  value?.trim().replace(/\s+/g, " ") || undefined;
const list = (values: readonly string[]): string => values.join(" + ");
const lower = (value: string): string => value.slice(0, 1).toLowerCase() + value.slice(1);
const article = (value: string): string => /^[aeiou]/i.test(value) ? "an" : "a";

export function renderDesignDescription(
  profile: DesignProfile,
  context: GenerationContext = {},
): string {
  const productType = trim(context.productType);
  const priority = trim(context.priority);
  const productTarget = productType ?? "frontend interface";
  const priorityTarget = priority ?? "clarity and memorability";
  const contextLines = [
    ["Product type", productType],
    ["Audience", trim(context.audience)],
    ["Priority", priority],
  ]
    .filter((entry): entry is [string, string] => Boolean(entry[1]))
    .map(([label, value]) => `${label}: ${value}`);

  const sections = [
    "# Design Direction",
    contextLines.length ? `## Context\n${contextLines.join("\n")}` : "",
    `## Core Concept
Design ${article(productTarget)} ${productTarget} with ${article(profile.mood)} ${lower(profile.mood)} ${lower(profile.tone)} point of view. Translate ${list(profile.era)} and ${list(profile.style)} into ${profile.layout}, ${profile.typography}, ${profile.palette}, and ${list(profile.signatureDetail)}. Optimize for ${priorityTarget}.`,
    `## Visual System
- Era: ${list(profile.era)}
- Style: ${list(profile.style)}
- Mood: ${profile.mood}
- Tone: ${profile.tone}
- Palette: ${profile.palette}
- Typography: ${profile.typography}
- Shape language: ${profile.shapeLanguage}
- Texture: ${profile.texture}
- Material: ${profile.material}
- Lighting: ${profile.lighting}
- Contrast: ${profile.contrast}`,
    `## Composition
- Layout: ${profile.layout}
- Density: ${profile.density}
- Imagery: ${profile.imagery}
- Signature detail: ${list(profile.signatureDetail)}
- First viewport: make the product, offer, or use case immediately visible; do not hide it behind generic atmosphere.`,
    `## Interaction
- Motion: ${profile.motion}
- Border treatment: ${profile.borderTreatment}
- Keep motion purposeful, localized, and compatible with reduced-motion preferences.`,
    `## Execution Rules
- Build a usable frontend, not a moodboard.
- Let the supplied context and priority override decorative choices.
- Translate era and style into interface decisions, not literal props.
- Use the signature detail once or twice as a memorable motif, not repeated decoration.
- Preserve readable text, accessible contrast, responsive behavior, clear hierarchy, and non-overlapping UI.
- If parameters clash, keep the boldest one or two traits as accents and make layout, typography, and navigation usable.`,
    `## Avoid
${profile.antiPattern.map((value) => `- Avoid ${value}`).join("\n")}`,
  ];

  return sections.filter(Boolean).join("\n\n");
}
