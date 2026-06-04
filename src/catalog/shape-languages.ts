import { item } from "./catalog-item.js";

export const shapeLanguages = [
  item("Sharp angular geometry", "sharp", "clean"),
  item("Soft rounded geometry", "soft", "clean"),
  item("Strict rectangles", "sharp", "minimal"),
  item("Asymmetric organic masks", "organic", "soft"),
  item("Asymmetric cutouts", "editorial", "playful"),
  item("Modular tiles", "digital", "clean"),
  item("Circular systems", "soft", "clean"),
  item("Diagonal slices", "sharp", "editorial"),
  item("Arched frames", "historic", "soft"),
  item("Brutalist blocks", "industrial", "sharp"),
  item("Thin-line wireframes", "digital", "minimal"),
  item("Layered panels", "digital", "dense"),
  item("Pill controls only for compact actions", "digital", "soft"),
  item("Hexagonal motifs", "futuristic", "sharp"),
  item("Pixel-grid geometry", "digital", "retro"),
  item("Torn-paper edges", "textured", "underground"),
  item("Ornamental frames", "historic", "luxury"),
  item("Mechanical joints", "industrial", "sharp"),
  item("Fluid curves", "organic", "soft"),
  item("Oversized geometric primitives", "maximal", "sharp"),
] as const;
