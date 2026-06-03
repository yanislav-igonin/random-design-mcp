import type { CatalogItem, DesignTag } from "../types.js";

export const item = (value: string, ...tags: DesignTag[]): CatalogItem => ({
  value,
  tags,
});
