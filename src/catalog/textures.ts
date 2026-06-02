import { item } from "./catalog-item.js";

export const textures = [
  item("Perfectly clean surfaces", "clean", "minimal"),
  item("Fine film grain", "textured", "editorial"),
  item("Rough paper fibers", "textured", "organic"),
  item("Newsprint halftone", "textured", "editorial", "retro"),
  item("Brushed metal", "textured", "industrial"),
  item("Polished chrome", "clean", "futuristic"),
  item("Frosted glass", "soft", "clean"),
  item("Clear glass", "clean", "minimal"),
  item("Concrete pores", "industrial", "textured"),
  item("CRT scanlines", "digital", "retro", "textured"),
  item("VHS noise", "retro", "textured"),
  item("Pixel dithering", "digital", "retro", "textured"),
  item("Photocopier artifacts", "underground", "textured"),
  item("Ink bleed", "organic", "textured"),
  item("Plastic gloss", "playful", "clean"),
  item("Holographic foil", "futuristic", "bright"),
  item("Fabric weave", "organic", "textured"),
  item("Blueprint grid", "industrial", "digital"),
  item("Dust and scratches", "retro", "textured"),
  item("Subtle gradient mesh", "digital", "soft"),
] as const;
