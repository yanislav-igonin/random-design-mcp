import { item } from "./catalog-item.js";

export const imagery = [
  item("No imagery", "minimal", "sparse"),
  item("Documentary photography", "editorial", "serious"),
  item("Studio product photography", "clean", "luxury"),
  item("Monochrome photography", "editorial", "serious"),
  item("Duotone photography", "editorial", "playful"),
  item("3D chrome objects", "futuristic", "clean"),
  item("3D clay objects", "soft", "playful"),
  item("Abstract gradients", "digital", "soft"),
  item("Technical diagrams", "industrial", "digital"),
  item("Blueprint illustrations", "industrial", "digital"),
  item("Line art", "clean", "minimal"),
  item("Pixel art", "digital", "retro", "playful"),
  item("Collage cutouts", "editorial", "textured"),
  item("Archival scans", "historic", "textured"),
  item("Botanical illustrations", "organic", "historic"),
  item("Architectural renders", "industrial", "clean"),
  item("Isometric scenes", "digital", "playful"),
  item("Generative particles", "digital", "futuristic"),
  item("Geometric icons", "clean", "sharp"),
  item("Oversized typography as imagery", "editorial", "maximal"),
] as const;
