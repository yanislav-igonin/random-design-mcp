import { catalogs, validateCatalogs } from "./catalog/index.js";
import { generatorConfig, validateGeneratorConfig } from "./config.js";
import { defaultRandom, selectDistinct, type RandomSource } from "./random.js";
import type { CatalogItem, DesignProfile, DesignTag } from "./types.js";

type GeneratorOptions = {
  compatibility?: boolean;
  random?: RandomSource;
};

export function selectRiskBalancedAntiPatterns(
  catalog: readonly CatalogItem[],
  activeTags: readonly DesignTag[],
  compatibility: boolean,
  random: RandomSource = defaultRandom,
): CatalogItem[] {
  const [relevantRisk] = selectDistinct(catalog, 1, activeTags, compatibility, random);
  const remaining = catalog.filter((candidate) => candidate !== relevantRisk);
  const [neutralRisk] = selectDistinct(remaining, 1, [], false, random);
  return [relevantRisk, neutralRisk];
}

export function generateDesignProfile({
  compatibility = generatorConfig.compatibilityDefault,
  random = defaultRandom,
}: GeneratorOptions = {}): DesignProfile {
  validateGeneratorConfig(generatorConfig);
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

  const era = values(select("era"));
  const style = values(select("style"));
  const mood = value("mood");
  const palette = value("palette");
  const typography = value("typography");
  const shapeLanguage = value("shapeLanguage");
  const texture = value("texture");
  const density = value("density");
  const layout = value("layout");
  const imagery = value("imagery");
  const motion = value("motion");
  const tone = value("tone");
  const contrast = value("contrast");
  const borderTreatment = value("borderTreatment");
  const lighting = value("lighting");
  const material = value("material");
  const signatureDetail = values(
    select("signatureDetail", optionalCount(generatorConfig.secondSignatureDetailProbability)),
  );

  return {
    era,
    style,
    mood,
    palette,
    typography,
    shapeLanguage,
    texture,
    density,
    layout,
    imagery,
    motion,
    tone,
    contrast,
    borderTreatment,
    lighting,
    material,
    signatureDetail,
    antiPattern: values(
      selectRiskBalancedAntiPatterns(catalogs.antiPattern, activeTags, compatibility, random),
    ),
  };
}
