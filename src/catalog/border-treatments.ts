import { item } from "./catalog-item.js";

export const borderTreatments = [
  item("No borders", "minimal", "clean"),
  item("Hairline borders", "minimal", "clean"),
  item("Thin solid borders", "clean", "sharp"),
  item("Heavy black borders", "sharp", "serious"),
  item("Double-line borders", "historic", "editorial"),
  item("Dashed technical borders", "industrial", "digital"),
  item("Dotted borders", "playful", "soft"),
  item("Rounded outlines", "soft", "clean"),
  item("Pill outlines", "soft", "digital"),
  item("Ornamental frames", "historic", "luxury"),
  item("Art Deco frames", "historic", "luxury", "sharp"),
  item("Pixel borders", "digital", "retro"),
  item("Glowing neon outlines", "digital", "bright", "dark"),
  item("Inset panel borders", "digital", "industrial"),
  item("Embossed borders", "textured", "luxury"),
  item("Hand-drawn borders", "organic", "playful"),
  item("Cropped corner frames", "digital", "sharp"),
  item("Bracket corners", "industrial", "sharp"),
  item("Divider-only borders", "editorial", "minimal"),
  item("Mixed-weight borders", "editorial", "sharp"),
] as const;
