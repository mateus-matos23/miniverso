import { z } from "zod";

import { env } from "@/config/env";
import { mimesAceitos, TAMANHO_MAXIMO_BYTES } from "@/features/media/rules";

/** Prefixo das URLs públicas do bucket `site` (ver `urlPublicaMidia` em `@/features/media/urls`). */
const PREFIXO_MIDIA_PUBLICA = `${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/site/`;

/**
 * Referência a um item da biblioteca de mídia (tabela `midias`, bucket
 * público `site`). A URL pública vai junto para a landing renderizar sem join.
 */
export const midiaRefSchema = z.object({
  id: z.uuid({ error: "Mídia inválida." }),
  url: z
    .url({ protocol: /^https?$/, error: "URL da mídia inválida." })
    .refine((url) => url.startsWith(PREFIXO_MIDIA_PUBLICA), {
      message: "A mídia precisa vir da biblioteca do site.",
    }),
  tipo: z.enum(["imagem", "video"], { error: "Tipo de mídia inválido." }),
  alt: z
    .string({ error: "Informe o texto alternativo." })
    .trim()
    .max(200, "O texto alternativo deve ter no máximo 200 caracteres."),
  largura: z.number().int().positive().nullable(),
  altura: z.number().int().positive().nullable(),
});

export type MidiaRef = z.infer<typeof midiaRefSchema>;

export const registroSchema = z
  .object({
    caminho: z
      .string({ error: "Caminho do arquivo inválido." })
      .regex(
        /^biblioteca\/[0-9a-f-]{36}\.(jpg|png|webp|avif|mp4|webm)$/,
        "Caminho do arquivo inválido.",
      ),
    tipo: z.enum(["imagem", "video"], { error: "Tipo de mídia inválido." }),
    mime: z.enum(mimesAceitos, { error: "Formato de arquivo não suportado." }),
    tamanho: z
      .number({ error: "Tamanho do arquivo inválido." })
      .int()
      .positive("O arquivo está vazio.")
      .max(TAMANHO_MAXIMO_BYTES, "O arquivo deve ter no máximo 50 MB."),
    largura: z.number().int().positive().nullish(),
    altura: z.number().int().positive().nullish(),
    alt: z
      .string({ error: "Informe o texto alternativo." })
      .trim()
      .max(200, "O texto alternativo deve ter no máximo 200 caracteres."),
  })
  .refine(
    (dados) => (dados.tipo === "video") === dados.mime.startsWith("video/"),
    {
      message: "O tipo não corresponde ao formato do arquivo.",
      path: ["tipo"],
    },
  )
  .refine((dados) => dados.tipo === "video" || dados.alt.length > 0, {
    message: "Informe o texto alternativo da imagem.",
    path: ["alt"],
  });

export const idSchema = z.string().uuid("Mídia inválida.");

export const altSchema = z
  .string({ error: "Informe o texto alternativo." })
  .trim()
  .max(200, "O texto alternativo deve ter no máximo 200 caracteres.");

// Cursor da paginação: o criado_em vem do próprio banco (com microssegundos e offset).
// A validação estrita evita injetar texto no filtro .or() do PostgREST.
export const cursorSchema = z
  .object({
    criadoEm: z
      .string()
      .regex(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,6})?(Z|[+-]\d{2}(:?\d{2})?)$/,
        "Cursor inválido.",
      ),
    id: z.string().uuid("Cursor inválido."),
  })
  .nullish();

export const listagemSchema = z.object({
  tipo: z.enum(["imagem", "video"]).optional(),
  cursor: cursorSchema,
});

/** Item da biblioteca: referência da landing mais os dados que só a tela usa. */
export type MidiaBiblioteca = MidiaRef & {
  tamanho: number;
  criadoEm: string;
};

/** Posição da última mídia carregada. Passe de volta para buscar a página seguinte. */
export type CursorMidias = { criadoEm: string; id: string };

export type PaginaMidias = {
  itens: MidiaBiblioteca[];
  /** `null` quando não há mais itens. */
  proximoCursor: CursorMidias | null;
};

export type ResultadoMidia =
  | { ok: true; midia: MidiaRef }
  | { ok: false; erro: string };

export type ResultadoSimples = { ok: true } | { ok: false; erro: string };
