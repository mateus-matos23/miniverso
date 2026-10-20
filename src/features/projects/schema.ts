import { z } from "zod";

import type { MidiaRef } from "@/features/media/schema";

export const camposConteudo = {
  titulo: z
    .string({ error: "Informe o título." })
    .trim()
    .min(1, "Informe o título.")
    .max(90, "O título deve ter no máximo 90 caracteres."),
  slug: z
    .string({ error: "Informe o slug." })
    .trim()
    .min(1, "Informe o slug.")
    .max(120, "O slug deve ter no máximo 120 caracteres.")
    .regex(
      /^[a-z0-9]+(-[a-z0-9]+)*$/,
      "Use apenas letras minúsculas, números e hifens.",
    ),
  categoria: z
    .string()
    .trim()
    .max(60, "A categoria deve ter no máximo 60 caracteres.")
    .optional(),
  clienteId: z.uuid({ error: "Selecione o cliente." }),
  descricao: z
    .string({ error: "Informe a descrição." })
    .trim()
    .min(1, "Informe a descrição.")
    .max(400, "A descrição deve ter no máximo 400 caracteres."),
  status: z.enum(["draft", "published"], {
    error: "Selecione um status válido.",
  }),
  ordem: z
    .string({ error: "Informe a ordem." })
    .trim()
    .regex(/^\d+$/, "A ordem deve ser um número inteiro não negativo.")
    .transform(Number)
    .pipe(z.number().int().min(0)),
  // Chega do campo `midiaId`; o nome do erro segue o do estado (`midia`).
  midia: z.uuid({ error: "Escolha uma imagem ou vídeo." }),
};

export const conteudoSchema = z.object(camposConteudo);
export const idSchema = z.uuid({ error: "Projeto inválido." });
export const statusConteudoSchema = z.enum(["draft", "published"], {
  error: "Selecione um status válido.",
});
export const idsSchema = z.array(idSchema);

export const camposTexto = [
  "titulo",
  "slug",
  "categoria",
  "clienteId",
  "descricao",
  "status",
  "ordem",
] as const;

export const campos = [...camposTexto, "midia"] as const;

export type CampoConteudo = (typeof campos)[number];

export type CadastroConteudoState = {
  erro?: string;
  /** Valores digitados, devolvidos em caso de erro para não limpar o formulário. */
  values?: Partial<Record<Exclude<CampoConteudo, "midia">, string>>;
  erros?: Partial<Record<CampoConteudo, string>>;
};

export type AcaoConteudoState = { erro?: string };

export type PublicConteudo = {
  id: string;
  slug: string;
  titulo: string;
  descricao: string;
  categoria: string | null;
  clienteNome: string;
  /** Mídia da biblioteca do projeto. `null` só se o join não puder ser lido. */
  midia: MidiaRef | null;
};

export type PublicConteudoDetalhe = {
  status: "ok" | "error";
  item: PublicConteudo | null;
};
