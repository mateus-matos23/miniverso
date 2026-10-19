"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth";
import type { MidiaRef } from "@/lib/landing/schema";
import { paraMidiaRef } from "@/lib/midia";
import { BUCKET_SITE } from "@/lib/storage";

const tiposMime = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "video/mp4",
  "video/webm",
] as const;

const TAMANHO_MAXIMO_BYTES = 52_428_800;
const TAMANHO_PAGINA_MIDIAS = 60;

const registroSchema = z
  .object({
    caminho: z
      .string({ error: "Caminho do arquivo inválido." })
      .regex(
        /^biblioteca\/[0-9a-f-]{36}\.(jpg|png|webp|avif|mp4|webm)$/,
        "Caminho do arquivo inválido.",
      ),
    tipo: z.enum(["imagem", "video"], { error: "Tipo de mídia inválido." }),
    mime: z.enum(tiposMime, { error: "Formato de arquivo não suportado." }),
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

const idSchema = z.string().uuid("Mídia inválida.");

const altSchema = z
  .string({ error: "Informe o texto alternativo." })
  .trim()
  .max(200, "O texto alternativo deve ter no máximo 200 caracteres.");

// Cursor da paginação: o criado_em vem do próprio banco (com microssegundos e offset).
// A validação estrita evita injetar texto no filtro .or() do PostgREST.
const cursorSchema = z
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

const listagemSchema = z.object({
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

const mensagemEmUso =
  "Esta mídia está em uso na página inicial. Troque-a antes de excluir.";

const mensagemNoHistorico =
  "Esta mídia é usada em uma versão do histórico da página inicial (arquivada). Ela não pode ser excluída enquanto essa versão existir.";

/**
 * Registra no banco um arquivo que o browser já enviou para o bucket `site`.
 * O envio é feito direto para o Storage (a policy exige admin). Antes de gravar a linha,
 * confere no Storage que o objeto existe e usa o tamanho real, não o informado pelo browser.
 */
export async function registrarMidia(input: {
  caminho: string;
  tipo: "imagem" | "video";
  mime: string;
  tamanho: number;
  largura?: number | null;
  altura?: number | null;
  alt: string;
}): Promise<ResultadoMidia> {
  const { supabase } = await requireAdmin();
  const result = registroSchema.safeParse(input);

  if (!result.success) {
    return {
      ok: false,
      erro: result.error.issues[0]?.message ?? "Dados inválidos.",
    };
  }

  // `info` falha com 404 quando o objeto não existe (ex.: upload que não concluiu).
  const { data: arquivo, error: arquivoError } = await supabase.storage
    .from(BUCKET_SITE)
    .info(result.data.caminho);

  if (arquivoError || !arquivo) {
    return {
      ok: false,
      erro: "O arquivo não foi encontrado no armazenamento. Envie novamente.",
    };
  }

  const tamanhoReal = arquivo.size;

  if (!tamanhoReal || tamanhoReal <= 0) {
    return { ok: false, erro: "O arquivo está vazio." };
  }

  if (tamanhoReal > TAMANHO_MAXIMO_BYTES) {
    return { ok: false, erro: "O arquivo deve ter no máximo 50 MB." };
  }

  const { data, error } = await supabase
    .from("midias")
    .insert({
      caminho: result.data.caminho,
      tipo: result.data.tipo,
      mime: result.data.mime,
      tamanho: tamanhoReal,
      largura: result.data.largura ?? null,
      altura: result.data.altura ?? null,
      alt: result.data.alt,
    })
    .select()
    .single();

  if (error || !data) {
    return {
      ok: false,
      erro: "Não foi possível registrar a mídia. Tente novamente.",
    };
  }

  revalidatePath("/admin/midia");
  return { ok: true, midia: paraMidiaRef(data) };
}

/** Atualiza o texto alternativo. Não propaga para a landing: o documento guarda sua cópia. */
export async function atualizarAlt(
  id: string,
  alt: string,
): Promise<ResultadoSimples> {
  const { supabase } = await requireAdmin();
  const idResult = idSchema.safeParse(id);
  const altResult = altSchema.safeParse(alt);

  if (!idResult.success) return { ok: false, erro: "Mídia inválida." };
  if (!altResult.success) {
    return {
      ok: false,
      erro: altResult.error.issues[0]?.message ?? "Texto alternativo inválido.",
    };
  }

  const { data, error } = await supabase
    .from("midias")
    .update({ alt: altResult.data })
    .eq("id", idResult.data)
    .select("id")
    .maybeSingle();

  if (error) {
    return { ok: false, erro: "Não foi possível salvar o texto alternativo." };
  }

  if (!data) return { ok: false, erro: "Mídia não encontrada." };

  revalidatePath("/admin/midia");
  return { ok: true };
}

/**
 * Exclui a mídia do banco e do bucket. Antes confere se ela aparece no documento de
 * alguma versão da landing (rascunho, publicada ou arquivada). Versões arquivadas
 * podem ser restauradas, então também bloqueiam a exclusão para não gerar link quebrado.
 */
export async function excluirMidia(id: string): Promise<ResultadoSimples> {
  const { supabase } = await requireAdmin();
  const idResult = idSchema.safeParse(id);

  if (!idResult.success) return { ok: false, erro: "Mídia inválida." };

  const { data: midia, error: midiaError } = await supabase
    .from("midias")
    .select("id,caminho")
    .eq("id", idResult.data)
    .maybeSingle();

  if (midiaError) {
    return {
      ok: false,
      erro: "Não foi possível excluir a mídia. Tente novamente.",
    };
  }

  if (!midia) return { ok: false, erro: "Mídia não encontrada." };

  const { data: versoes, error: versoesError } = await supabase
    .from("landing_versoes")
    .select("status,conteudo")
    .in("status", ["draft", "published", "archived"]);

  if (versoesError) {
    return { ok: false, erro: "Não foi possível verificar o uso da mídia." };
  }

  // O id é um uuid: basta procurar o texto dentro do JSON de cada versão.
  const usadas = (versoes ?? []).filter((versao) =>
    JSON.stringify(versao.conteudo).includes(midia.id),
  );

  if (usadas.some((versao) => versao.status !== "archived")) {
    return { ok: false, erro: mensagemEmUso };
  }

  if (usadas.length > 0) return { ok: false, erro: mensagemNoHistorico };

  const { error: deleteError } = await supabase
    .from("midias")
    .delete()
    .eq("id", midia.id);

  if (deleteError) {
    return {
      ok: false,
      erro: "Não foi possível excluir a mídia. Tente novamente.",
    };
  }

  await supabase.storage.from(BUCKET_SITE).remove([midia.caminho]);

  revalidatePath("/admin/midia");
  return { ok: true };
}

/**
 * Lista a biblioteca, da mais recente para a mais antiga, em páginas de 60.
 * Paginação por cursor (criado_em desc, id desc): ao carregar mais, passe `proximoCursor`.
 * Usado pela tela e pelo seletor.
 */
export async function listarMidias(
  opcoes: { tipo?: "imagem" | "video"; cursor?: CursorMidias | null } = {},
): Promise<PaginaMidias> {
  const { supabase } = await requireAdmin();
  const entrada = listagemSchema.safeParse(opcoes);

  if (!entrada.success) throw new Error("Parâmetros de listagem inválidos.");

  const { tipo, cursor } = entrada.data;

  let consulta = supabase
    .from("midias")
    .select("id,caminho,tipo,alt,largura,altura,tamanho,criado_em")
    .order("criado_em", { ascending: false })
    .order("id", { ascending: false })
    // Uma linha a mais que a página: indica se existe próxima página sem outra consulta.
    .limit(TAMANHO_PAGINA_MIDIAS + 1);

  if (tipo) consulta = consulta.eq("tipo", tipo);

  if (cursor) {
    consulta = consulta.or(
      `criado_em.lt."${cursor.criadoEm}",and(criado_em.eq."${cursor.criadoEm}",id.lt.${cursor.id})`,
    );
  }

  const { data, error } = await consulta;

  if (error) throw error;

  const linhas = data ?? [];
  const pagina = linhas.slice(0, TAMANHO_PAGINA_MIDIAS);
  const ultima = pagina.at(-1);

  return {
    itens: pagina.map((row) => ({
      ...paraMidiaRef(row),
      tamanho: row.tamanho,
      criadoEm: row.criado_em,
    })),
    proximoCursor:
      linhas.length > TAMANHO_PAGINA_MIDIAS && ultima
        ? { criadoEm: ultima.criado_em, id: ultima.id }
        : null,
  };
}
