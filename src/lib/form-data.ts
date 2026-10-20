import type { z } from "zod";

/** Lê os campos de texto do FormData; ausente vira "". */
export function lerCampos<K extends string>(
  formData: FormData,
  campos: readonly K[],
): Record<K, string> {
  const valores = {} as Record<K, string>;

  for (const campo of campos) {
    valores[campo] = String(formData.get(campo) ?? "");
  }

  return valores;
}

/** Primeira mensagem de erro do Zod por campo, só para os campos conhecidos. */
export function errosPorCampo<K extends string>(
  error: z.ZodError,
  campos: readonly K[],
): Partial<Record<K, string>> {
  const erros: Partial<Record<K, string>> = {};

  for (const issue of error.issues) {
    const campo = issue.path[0];

    if (
      typeof campo === "string" &&
      (campos as readonly string[]).includes(campo)
    ) {
      erros[campo as K] ??= issue.message;
    }
  }

  return erros;
}
