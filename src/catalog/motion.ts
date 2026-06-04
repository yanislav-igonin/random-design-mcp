import { item } from "./catalog-item.js";

export const motion = [
  item("Static", "minimal", "clean"),
  item("Subtle fades", "soft", "clean"),
  item("Gentle parallax", "soft", "digital"),
  item("Elastic micro-interactions", "playful", "digital"),
  item("Mechanical transitions", "industrial", "digital"),
  item("Rare glitch accent, never body text", "digital", "underground"),
  item("Subtle CRT flicker on decorative surfaces", "digital", "retro"),
  item("Staged cinematic section reveals", "luxury", "dark"),
  item("Scroll-driven storytelling", "editorial", "digital"),
  item("Snappy interface feedback", "digital", "clean"),
  item("Slow ambient drift", "soft", "organic"),
  item("Layered depth movement", "digital", "dense"),
  item("Contained marquee motion for secondary content", "editorial", "retro"),
  item("Contained ticker motion for secondary info", "digital", "dense"),
  item("Pixel-step animation", "digital", "retro"),
  item("Expanding panels", "digital", "clean"),
  item("Magnetic hover", "digital", "playful"),
  item("Smooth page morphs", "digital", "soft"),
  item("Diagram drawing animation", "industrial", "digital"),
  item("Reduced-motion-first", "clean", "minimal"),
] as const;
