import { item } from "./catalog-item.js";

export const lighting = [
  item("Flat even lighting", "clean", "minimal"),
  item("Soft diffuse glow", "soft", "warm"),
  item("Neon bloom", "digital", "bright", "dark"),
  item("Dramatic hard shadows", "sharp", "dark"),
  item("Studio softbox", "clean", "luxury"),
  item("Rim lighting", "sharp", "dark"),
  item("Backlit silhouettes", "dark", "serious"),
  item("Volumetric haze", "soft", "dark"),
  item("Bioluminescent glow", "organic", "futuristic", "bright"),
  item("Screen-lit darkness", "digital", "dark"),
  item("Golden-hour warmth", "warm", "organic"),
  item("Cold fluorescent", "cold", "industrial"),
  item("Overexposed high key", "bright", "clean"),
  item("Underexposed low key", "dark", "serious"),
  item("Chrome reflections", "futuristic", "luxury"),
  item("Glass refractions", "clean", "soft"),
  item("Holographic shimmer", "futuristic", "bright"),
  item("Spotlight focus", "serious", "sharp"),
  item("Candlelit warmth", "historic", "warm"),
  item("No lighting effects", "minimal", "clean"),
] as const;
