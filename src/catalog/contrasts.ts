import { item } from "./catalog-item.js";

export const contrasts = [
  item("Low contrast", "soft", "minimal"),
  item("Medium contrast", "clean", "editorial"),
  item("High contrast", "sharp", "clean"),
  item("Extreme black-white contrast", "sharp", "minimal"),
  item("Soft tonal contrast", "soft", "editorial"),
  item("Neon-on-dark contrast", "digital", "dark", "bright"),
  item("Dark-on-light contrast", "sharp", "clean"),
  item("Light-on-dark contrast", "dark", "clean"),
  item("Warm-cold contrast", "warm", "cold"),
  item("Complementary color contrast", "bright", "playful"),
  item("Muted with one loud accent", "soft", "bright"),
  item("Monochrome tonal range", "minimal", "clean"),
  item("Textural contrast", "textured", "editorial"),
  item("Scale contrast", "editorial", "sharp"),
  item("Dense-sparse contrast", "dense", "sparse"),
  item("Sharp-soft contrast", "sharp", "soft"),
  item("Matte-gloss contrast", "textured", "luxury"),
  item("Vintage-future contrast", "retro", "futuristic"),
  item("Editorial-interface contrast", "editorial", "digital"),
  item("Minimal-maximal contrast", "minimal", "maximal"),
] as const;
