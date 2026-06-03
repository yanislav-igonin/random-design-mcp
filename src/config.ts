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

export function validateGeneratorConfig(config: GeneratorConfig): void {
  if (typeof config.compatibilityDefault !== "boolean") {
    throw new Error("Generator config compatibilityDefault must be a boolean");
  }
  if (!Number.isFinite(config.compatibilityTagWeight) || config.compatibilityTagWeight <= 0) {
    throw new Error(
      "Generator config compatibilityTagWeight must be a finite positive number",
    );
  }
  for (const name of [
    "secondEraProbability",
    "secondStyleProbability",
    "secondSignatureDetailProbability",
  ] as const) {
    const probability = config[name];
    if (!Number.isFinite(probability) || probability < 0 || probability > 1) {
      throw new Error(`Generator config ${name} must be between 0 and 1`);
    }
  }
}
