import type { CatalogRegistry, CategoryName } from "../types.js";
import { categoryNames } from "../types.js";
import { antiPatterns } from "./anti-patterns.js";
import { borderTreatments } from "./border-treatments.js";
import { contrasts } from "./contrasts.js";
import { densities } from "./densities.js";
import { eras } from "./eras.js";
import { imagery } from "./imagery.js";
import { layouts } from "./layouts.js";
import { lighting } from "./lighting.js";
import { materials } from "./materials.js";
import { moods } from "./moods.js";
import { motion } from "./motion.js";
import { palettes } from "./palettes.js";
import { shapeLanguages } from "./shape-languages.js";
import { signatureDetails } from "./signature-details.js";
import { styles } from "./styles.js";
import { textures } from "./textures.js";
import { tones } from "./tones.js";
import { typography } from "./typography.js";

export const minimumCatalogSizes: Record<CategoryName, number> = {
  era: 40,
  style: 40,
  mood: 40,
  palette: 40,
  typography: 40,
  shapeLanguage: 20,
  texture: 20,
  density: 20,
  layout: 20,
  imagery: 20,
  motion: 20,
  tone: 20,
  contrast: 20,
  borderTreatment: 20,
  lighting: 20,
  material: 20,
  signatureDetail: 20,
  antiPattern: 20,
};

export function validateCatalogs(catalogs: CatalogRegistry): void {
  for (const category of categoryNames) {
    const catalog = catalogs[category] ?? [];
    const minimum = minimumCatalogSizes[category];
    const values = new Set<string>();
    for (const catalogItem of catalog) {
      const value = catalogItem.value.trim();
      if (!value) {
        throw new Error(`Catalog ${category} contains an item with empty text`);
      }
      if (catalogItem.tags.length === 0) {
        throw new Error(
          `Catalog ${category} item ${catalogItem.value} must include at least one tag`,
        );
      }
      if (values.has(value)) {
        throw new Error(`Catalog ${category} contains duplicate value ${value}`);
      }
      values.add(value);
    }
    if (catalog.length < minimum) {
      throw new Error(`Catalog ${category} must contain at least ${minimum} items`);
    }
  }
}

export const catalogs: CatalogRegistry = {
  era: eras,
  style: styles,
  mood: moods,
  palette: palettes,
  typography,
  shapeLanguage: shapeLanguages,
  texture: textures,
  density: densities,
  layout: layouts,
  imagery,
  motion,
  tone: tones,
  contrast: contrasts,
  borderTreatment: borderTreatments,
  lighting,
  material: materials,
  signatureDetail: signatureDetails,
  antiPattern: antiPatterns,
};
