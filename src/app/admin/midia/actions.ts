"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth";
import type { MidiaRef } from "@/lib/landing/schema";
import { paraMidiaRef } from "@/lib/midia";
import { BUCKET_SITE } from "@/lib/storage";
import type { MidiaRow } from "@/utils/supabase/database";

const tiposMime = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "video/mp4",
  "video/webm",
] as const;

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
      .max(52_428_800, "O arquivo deve ter no máximo 50 MB."),
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

/** Item da biblioteca: referência da landing mais os dados que só a tela usa. */
export type MidiaBiblioteca = MidiaRef & {
  tamanho: number;
  criadoEm: string;
};

export type ResultadoMidia =
  | { ok: true; midia: MidiaRef }
  | { ok: false; erro: string };

export type ResultadoSimples = { ok: true } | { ok: false; erro: string };

const mensagemEmUso =
  "Esta mídia está em uso na página inicial. Troque-a antes de excluir.";

/**
 * Registra no banco um arquivo que o browser já enviou para o bucket `site`.
 * O envio é feito direto para o Storage (a policy exige admin); aqui só gravamos a linha.
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

  const { data, error } = await supabase
    .from("midias")
    .insert({
      caminho: result.data.caminho,
      tipo: result.data.tipo,
      mime: result.data.mime,
      tamanho: result.data.tamanho,
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
 * Exclui a mídia do banco e do bucket. Antes confere se ela aparece no documento
 * de alguma versão da landing (rascunho ou publicada), para não deixar link quebrado.
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
    .select("conteudo")
    .in("status", ["draft", "published"]);

  if (versoesError) {
    return { ok: false, erro: "Não foi possível verificar o uso da mídia." };
  }

  // O id é um uuid: basta procurar o texto dentro do JSON da landing.
  const emUso = (versoes ?? []).some((versao) =>
    JSON.stringify(versao.conteudo).includes(midia.id),
  );

  if (emUso) return { ok: false, erro: mensagemEmUso };

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

/** Lista a biblioteca, da mais recente para a mais antiga. Usado pela tela e pelo seletor. */
export async function listarMidias(
  tipo?: "imagem" | "video",
): Promise<MidiaBiblioteca[]> {
  const { supabase } = await requireAdmin();
  let consulta = supabase
    .from("midias")
    .select("*")
    .order("criado_em", { ascending: false });

  if (tipo) consulta = consulta.eq("tipo", tipo);

  const { data, error } = await consulta;

  if (error) throw error;

  return (data ?? []).map((row: MidiaRow) => ({
    ...paraMidiaRef(row),
    tamanho: row.tamanho,
    criadoEm: row.criado_em,
  }));
}
