import { item } from "./catalog-item.js";

export const densities = [
  item("Extremely sparse", "sparse", "minimal"),
  item("Sparse", "sparse", "clean"),
  item("Airy", "sparse", "soft"),
  item("Balanced", "clean", "editorial"),
  item("Compact", "dense", "clean"),
  item("Dense", "dense", "maximal"),
  item("Information-heavy", "dense", "serious"),
  item("Dashboard-dense", "dense", "digital"),
  item("Poster-like", "editorial", "sharp"),
  item("Single-focus", "minimal", "sparse"),
  item("Layered", "dense", "editorial"),
  item("Editorial rhythm", "editorial", "clean"),
  item("High whitespace", "sparse", "minimal"),
  item("Tight grid", "dense", "clean"),
  item("Generous margins", "sparse", "editorial"),
  item("Edge-to-edge", "maximal", "sharp"),
  item("Micro-detail rich", "dense", "textured"),
  item("Large-type dominant", "editorial", "sharp"),
  item("Card-heavy", "digital", "dense"),
  item("Content-first", "editorial", "serious"),
] as const;
