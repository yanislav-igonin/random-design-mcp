import { item } from "./catalog-item.js";

export const antiPatterns = [
  item("Generic SaaS gradients", "digital", "clean"),
  item("Excessive rounded cards", "digital", "soft"),
  item("Stock photography", "editorial", "clean"),
  item("Decorative clutter", "maximal", "dense"),
  item("Low-contrast body text", "soft", "minimal"),
  item("Tiny primary actions", "minimal", "sparse"),
  item("Unstructured spacing", "playful", "maximal"),
  item("Too many font families", "editorial", "maximal"),
  item("Meaningless glass effects", "digital", "soft"),
  item("Gratuitous animation", "digital", "playful"),
  item("Inconsistent icon styles", "digital", "playful"),
  item("Mobile-hostile fixed widths", "digital", "dense"),
  item("Long unreadable line lengths", "editorial", "dense"),
  item("Hidden navigation", "digital", "minimal"),
  item("Overloaded hero copy", "editorial", "dense"),
  item("Repetitive card grids", "digital", "dense"),
  item("Random shadows", "digital", "soft"),
  item("Fake dashboard metrics", "digital", "dense"),
  item("Ambiguous button labels", "digital", "serious"),
  item("Visual effects that reduce readability", "digital", "maximal"),
] as const;
