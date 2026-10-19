"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth";
import { landingSchema } from "@/lib/landing/schema";
import type { Json } from "@/utils/supabase/database";

const erroPadrao = "Não foi possível concluir a ação. Tente novamente.";

export type ProblemaLanding = { caminho: string; mensagem: string };

export type SalvarRascunhoResult =
  | { ok: true; salvoEm: string }
  | { ok: false; erro: string; issues: ProblemaLanding[] };

export type AcaoLandingResult = { ok: true } | { ok: false; erro: string };

const idSchema = z.uuid({ error: "Versão inválida." });
const notaSchema = z
  .string()
  .trim()
  .max(200, "A nota deve ter no máximo 200 caracteres.")
  .optional();

/** Caminho no formato "secoes.2.dados.titulo" para exibir ao lado do campo. */
function formatarCaminho(path: PropertyKey[]): string {
  return path.map(String).join(".");
}

export async function salvarRascunho(
  doc: unknown,
): Promise<SalvarRascunhoResult> {
  const resultado = landingSchema.safeParse(doc);

  if (!resultado.success) {
    return {
      ok: false,
      erro: "Corrija os campos destacados para salvar.",
      issues: resultado.error.issues.map((issue) => ({
        caminho: formatarCaminho(issue.path),
        mensagem: issue.message,
      })),
    };
  }

  const { supabase } = await requireAdmin();
  const { error } = await supabase.rpc("salvar_rascunho_landing", {
    p_conteudo: resultado.data as unknown as Json,
  });

  if (error) {
    console.error("Erro ao salvar rascunho da landing:", error);
    return {
      ok: false,
      erro: erroPadrao,
      issues: [],
    };
  }

  // Rascunho não é público: sem revalidatePath.
  return { ok: true, salvoEm: new Date().toISOString() };
}

export async function publicar(nota?: string): Promise<AcaoLandingResult> {
  const notaValidada = notaSchema.safeParse(nota);

  if (!notaValidada.success) {
    return {
      ok: false,
      erro: notaValidada.error.issues[0]?.message ?? erroPadrao,
    };
  }

  const { supabase } = await requireAdmin();
  const { error } = await supabase.rpc("publicar_landing", {
    p_nota: notaValidada.data || undefined,
  });

  if (error) {
    console.error("Erro ao publicar a landing:", error);
    return { ok: false, erro: erroPadrao };
  }

  revalidatePath("/", "layout");
  return { ok: true };
}

export async function descartarRascunho(): Promise<AcaoLandingResult> {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.rpc("descartar_rascunho_landing");

  if (error) {
    console.error("Erro ao descartar o rascunho da landing:", error);
    return { ok: false, erro: erroPadrao };
  }

  return { ok: true };
}

export async function restaurarVersao(id: string): Promise<AcaoLandingResult> {
  const idValidado = idSchema.safeParse(id);

  if (!idValidado.success) {
    return { ok: false, erro: "Versão inválida." };
  }

  const { supabase } = await requireAdmin();
  const { error } = await supabase.rpc("restaurar_versao_landing", {
    p_id: idValidado.data,
  });

  if (error) {
    console.error("Erro ao restaurar versão da landing:", error);
    return { ok: false, erro: erroPadrao };
  }

  return { ok: true };
}
