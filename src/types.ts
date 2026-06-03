export type DesignTag =
  | "historic" | "retro" | "futuristic" | "digital" | "organic"
  | "industrial" | "editorial" | "minimal" | "maximal" | "soft"
  | "sharp" | "playful" | "serious" | "luxury" | "underground"
  | "bright" | "dark" | "warm" | "cold" | "clean" | "textured"
  | "dense" | "sparse";

export type CatalogItem = {
  value: string;
  tags: readonly DesignTag[];
};

export const categoryNames = [
  "era", "style", "mood", "palette", "typography", "shapeLanguage",
  "texture", "density", "layout", "imagery", "motion", "tone",
  "contrast", "borderTreatment", "lighting", "material",
  "signatureDetail", "antiPattern",
] as const;

export type CategoryName = (typeof categoryNames)[number];
export type CatalogRegistry = Record<CategoryName, readonly CatalogItem[]>;

export type GenerationContext = {
  productType?: string;
  audience?: string;
  priority?: string;
  compatibility?: boolean;
};

export type DesignProfile = {
  era: string[];
  style: string[];
  mood: string;
  palette: string;
  typography: string;
  shapeLanguage: string;
  texture: string;
  density: string;
  layout: string;
  imagery: string;
  motion: string;
  tone: string;
  contrast: string;
  borderTreatment: string;
  lighting: string;
  material: string;
  signatureDetail: string[];
  antiPattern: string[];
};
