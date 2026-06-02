export type GeneratorConfig = {
  compatibilityDefault: boolean;
  compatibilityTagWeight: number;
  secondEraProbability: number;
  secondStyleProbability: number;
  secondSignatureDetailProbability: number;
};

export const generatorConfig: GeneratorConfig = {
  compatibilityDefault: true,
  compatibilityTagWeight: 2,
  secondEraProbability: 0.3,
  secondStyleProbability: 0.25,
  secondSignatureDetailProbability: 0.3,
};
