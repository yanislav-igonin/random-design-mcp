import { item } from "./catalog-item.js";

export const tones = [
  item("Serious", "serious", "clean"),
  item("Premium", "luxury", "clean"),
  item("Experimental", "playful", "underground"),
  item("Underground", "underground", "dark"),
  item("Friendly", "warm", "soft"),
  item("Utilitarian", "industrial", "serious"),
  item("Scholarly", "historic", "editorial"),
  item("Provocative", "sharp", "underground"),
  item("Technical", "industrial", "digital"),
  item("Reassuring", "soft", "clean"),
  item("Exclusive", "luxury", "serious"),
  item("Accessible", "clean", "soft"),
  item("Irreverent", "playful", "underground"),
  item("Poetic", "soft", "editorial"),
  item("Direct", "clean", "sharp"),
  item("Institutional", "serious", "editorial"),
  item("Countercultural", "underground", "sharp"),
  item("Optimistic", "bright", "warm"),
  item("Disciplined", "serious", "clean"),
  item("Exploratory", "playful", "futuristic"),
] as const;
