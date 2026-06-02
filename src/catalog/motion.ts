import { item } from "./catalog-item.js";

export const motion = [
  item("Static", "minimal", "clean"),
  item("Subtle fades", "soft", "clean"),
  item("Gentle parallax", "soft", "digital"),
  item("Elastic micro-interactions", "playful", "digital"),
  item("Mechanical transitions", "industrial", "digital"),
  item("Glitch bursts", "digital", "underground"),
  item("CRT flicker", "digital", "retro"),
  item("Cinematic reveals", "luxury", "dark"),
  item("Scroll-driven storytelling", "editorial", "digital"),
  item("Snappy interface feedback", "digital", "clean"),
  item("Slow ambient drift", "soft", "organic"),
  item("Layered depth movement", "digital", "dense"),
  item("Marquee motion", "editorial", "retro"),
  item("Ticker motion", "digital", "dense"),
  item("Pixel-step animation", "digital", "retro"),
  item("Expanding panels", "digital", "clean"),
  item("Magnetic hover", "digital", "playful"),
  item("Smooth page morphs", "digital", "soft"),
  item("Diagram drawing animation", "industrial", "digital"),
  item("Reduced-motion-first", "clean", "minimal"),
] as const;
