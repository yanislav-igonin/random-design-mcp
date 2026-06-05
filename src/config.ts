export type GeneratorConfig = {
  compatibilityDefault: boolean;
  compatibilityTagWeight: number;
  compatibilityMatchedTagCap: number;
  compatibilityContradictionPenalty: number;
  secondSignatureDetailProbability: number;
};

export const generatorConfig: GeneratorConfig = {
  compatibilityDefault: true,
  compatibilityTagWeight: 2,
  compatibilityMatchedTagCap: 2,
  compatibilityContradictionPenalty: 0.5,
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
  if (
    !Number.isInteger(config.compatibilityMatchedTagCap) ||
    config.compatibilityMatchedTagCap < 1
  ) {
    throw new Error(
      "Generator config compatibilityMatchedTagCap must be a positive integer",
    );
  }
  if (
    !Number.isFinite(config.compatibilityContradictionPenalty) ||
    config.compatibilityContradictionPenalty < 0
  ) {
    throw new Error(
      "Generator config compatibilityContradictionPenalty must be a finite non-negative number",
    );
  }
  for (const name of ["secondSignatureDetailProbability"] as const) {
    const probability = config[name];
    if (!Number.isFinite(probability) || probability < 0 || probability > 1) {
      throw new Error(`Generator config ${name} must be between 0 and 1`);
    }
  }
}
