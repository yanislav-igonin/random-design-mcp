import type { CatalogRegistry, CategoryName } from "../types.js";
import { categoryNames } from "../types.js";

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
    for (const catalogItem of catalog) {
      if (!catalogItem.value.trim()) {
        throw new Error(`Catalog ${category} contains an item with empty text`);
      }
      if (catalogItem.tags.length === 0) {
        throw new Error(
          `Catalog ${category} item ${catalogItem.value} must include at least one tag`,
        );
      }
    }
    if (catalog.length < minimum) {
      throw new Error(`Catalog ${category} must contain at least ${minimum} items`);
    }
  }
}
