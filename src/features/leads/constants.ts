// Constantes de leads sem dependência de zod: o formulário público importa daqui.

/** Valores de interesse gravados em `leads.interesse`. Fonte única do formulário, da validação e dos rótulos. */
export const INTERESSES = [
  "implantacao",
  "projeto_personalizado",
  "parceria",
  "outro",
] as const;

export type Interesse = (typeof INTERESSES)[number];

/**
 * Textos de cada interesse por tela:
 * - `formulario`: opção do formulário de contato (público).
 * - `longo`: lista, detalhe e exportação do admin de leads.
 * - `curto`: cards do dashboard.
 */
export const ROTULOS_INTERESSE: Record<
  Interesse,
  { formulario: string; longo: string; curto: string }
> = {
  implantacao: {
    formulario: "Implantar na minha escola",
    longo: "Implantar na escola",
    curto: "Implantação",
  },
  projeto_personalizado: {
    formulario: "Projeto personalizado",
    longo: "Projeto personalizado",
    curto: "Projeto personalizado",
  },
  parceria: {
    formulario: "Parceria",
    longo: "Parceria",
    curto: "Parceria",
  },
  outro: {
    formulario: "Outro",
    longo: "Outro",
    curto: "Outro",
  },
};
