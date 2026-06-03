import { item } from "./catalog-item.js";

export const layouts = [
  item("Strict Swiss grid", "editorial", "clean"),
  item("Asymmetric editorial grid", "editorial", "sharp"),
  item("Modular card grid", "digital", "clean"),
  item("Oversized hero", "maximal", "editorial"),
  item("Split screen", "sharp", "clean"),
  item("Layered collage", "editorial", "textured", "maximal"),
  item("Single-column narrative", "editorial", "sparse"),
  item("Bento grid", "digital", "clean"),
  item("Masonry grid", "digital", "dense"),
  item("Horizontal scroll narrative", "digital", "editorial"),
  item("Full-bleed sections", "maximal", "editorial"),
  item("Poster composition", "editorial", "sharp"),
  item("Dashboard shell", "digital", "dense"),
  item("Sidebar workspace", "digital", "serious"),
  item("Centered monument", "minimal", "serious"),
  item("Staggered blocks", "editorial", "playful"),
  item("Diagonal flow", "sharp", "playful"),
  item("Timeline", "editorial", "clean"),
  item("Catalog grid", "editorial", "dense"),
  item("Technical schematic", "industrial", "digital"),
] as const;
