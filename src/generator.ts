import { catalogs, validateCatalogs } from "./catalog/index.js";
import { generatorConfig } from "./config.js";
import { defaultRandom, selectDistinct, type RandomSource } from "./random.js";
import type { CatalogItem, DesignProfile, DesignTag } from "./types.js";

type GeneratorOptions = {
  compatibility?: boolean;
  random?: RandomSource;
};

export function generateDesignProfile({
  compatibility = generatorConfig.compatibilityDefault,
  random = defaultRandom,
}: GeneratorOptions = {}): DesignProfile {
  validateCatalogs(catalogs);
  const activeTags: DesignTag[] = [];

  const select = (category: keyof typeof catalogs, count = 1): CatalogItem[] => {
    const selected = selectDistinct(catalogs[category], count, activeTags, compatibility, random);
    activeTags.push(...selected.flatMap(({ tags }) => tags));
    return selected;
  };
  const values = (items: CatalogItem[]): string[] => items.map(({ value }) => value);
  const value = (category: keyof typeof catalogs): string => select(category)[0].value;
  const optionalCount = (probability: number): number => random() < probability ? 2 : 1;

  return {
    era: values(select("era", optionalCount(generatorConfig.secondEraProbability))),
    style: values(select("style", optionalCount(generatorConfig.secondStyleProbability))),
    mood: value("mood"),
    palette: value("palette"),
    typography: value("typography"),
    shapeLanguage: value("shapeLanguage"),
    texture: value("texture"),
    density: value("density"),
    layout: value("layout"),
    imagery: value("imagery"),
    motion: value("motion"),
    tone: value("tone"),
    contrast: value("contrast"),
    borderTreatment: value("borderTreatment"),
    lighting: value("lighting"),
    material: value("material"),
    signatureDetail: values(
      select("signatureDetail", optionalCount(generatorConfig.secondSignatureDetailProbability)),
    ),
    antiPattern: values(select("antiPattern", 2)),
  };
}
