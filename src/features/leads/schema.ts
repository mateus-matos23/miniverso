import { z } from "zod";

import { INTERESSES, type Interesse, ROTULOS_INTERESSE } from "./constants";

export { INTERESSES, type Interesse, ROTULOS_INTERESSE };

export const STATUS_LEAD = [
  "novo",
  "em_contato",
  "convertido",
  "arquivado",
] as const;

export type StatusLead = (typeof STATUS_LEAD)[number];

export const idSchema = z.uuid({ error: "Lead inválido." });
export const statusSchema = z.enum(STATUS_LEAD, { error: "Status inválido." });
export const notasSchema = z
  .string({ error: "Informe as notas." })
  .max(4000, "As notas devem ter no máximo 4000 caracteres.");

export type AcaoLeadState = { erro?: string };

export const contatoSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(2, "O nome deve ter pelo menos 2 caracteres.")
    .max(120, "O nome deve ter no máximo 120 caracteres."),
  email: z
    .string()
    .trim()
    .max(200, "O e-mail deve ter no máximo 200 caracteres.")
    .pipe(z.email({ error: "Informe um e-mail válido." })),
  escola: z
    .string()
    .trim()
    .max(160, "A escola deve ter no máximo 160 caracteres.")
    .optional(),
  cargo: z
    .string()
    .trim()
    .max(80, "O cargo deve ter no máximo 80 caracteres.")
    .optional(),
  interesse: z.enum(INTERESSES, {
    error: "Escolha o seu interesse.",
  }),
  mensagem: z
    .string()
    .trim()
    .min(10, "A mensagem deve ter pelo menos 10 caracteres.")
    .max(2000, "A mensagem deve ter no máximo 2000 caracteres."),
  // Honeypot: campo escondido do formulário, que pessoas não preenchem.
  site: z.string().max(200).optional(),
  utm_source: z.string().max(100).optional(),
  utm_medium: z.string().max(100).optional(),
  utm_campaign: z.string().max(100).optional(),
  pagina: z.string().max(200).optional(),
});

export type DadosContato = z.infer<typeof contatoSchema>;

/** Campos visíveis do formulário, usados nas mensagens de erro e no preenchimento. */
export type CampoContato =
  | "nome"
  | "email"
  | "escola"
  | "cargo"
  | "interesse"
  | "mensagem";

export type EstadoContato = {
  ok?: boolean;
  erro?: string;
  erros?: Partial<Record<CampoContato, string>>;
  /** Valores digitados, devolvidos em caso de erro para não limpar o formulário. */
  values?: Partial<Record<CampoContato, string>>;
};

export const camposVisiveis: CampoContato[] = [
  "nome",
  "email",
  "escola",
  "cargo",
  "interesse",
  "mensagem",
];
