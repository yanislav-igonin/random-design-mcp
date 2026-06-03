import { item } from "./catalog-item.js";

export const materials = [
  item("Paper", "organic", "editorial"),
  item("Newsprint", "editorial", "textured"),
  item("Cardboard", "organic", "textured"),
  item("Plastic", "industrial", "clean"),
  item("Translucent plastic", "soft", "futuristic"),
  item("Chrome", "futuristic", "luxury"),
  item("Brushed steel", "industrial", "textured"),
  item("Aluminum", "industrial", "clean"),
  item("Glass", "clean", "luxury"),
  item("Frosted glass", "soft", "clean"),
  item("Concrete", "industrial", "textured"),
  item("Stone", "organic", "textured"),
  item("Wood", "organic", "warm"),
  item("Fabric", "organic", "soft"),
  item("Leather", "luxury", "warm"),
  item("Holographic foil", "futuristic", "bright"),
  item("Ink", "editorial", "textured"),
  item("CRT phosphor", "digital", "retro"),
  item("Enamel signage", "industrial", "retro"),
  item("Ceramic", "organic", "clean"),
] as const;
