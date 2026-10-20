import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { cache } from "react";

import { landingPadrao } from "@/features/landing/defaults";
import { parseLanding } from "@/features/landing/parse";
import type { LandingDocumento } from "@/features/landing/schema";
import type { Database, Json } from "@/lib/supabase/database";
import { criarClientePublico } from "@/lib/supabase/public";

type Cliente = SupabaseClient<Database>;
type Status = "draft" | "published";

type VersaoLida = { id: string; conteudo: unknown };

/**
 * Conteúdo de uma versão da landing, ou `null` se não existir ou a leitura falhar.
 * A RLS já limita o anon à `published`; o admin enxerga também o `draft`.
 */
async function lerVersao(
  supabase: Cliente,
  status: Status,
): Promise<VersaoLida | null> {
  const { data, error } = await supabase
    .from("landing_versoes")
    .select("id,conteudo")
    .eq("status", status)
    .maybeSingle();

  if (error) {
    console.error(`[landing] falha ao carregar a versão ${status}`, error);
    return null;
  }

  if (data?.conteudo == null) return null;

  return { id: data.id, conteudo: data.conteudo };
}

/**
 * Documento da landing publicada, lido com a chave pública e sem cookies, para
 * a página ser estática e revalidada. Nunca lança: sem versão válida, cai em
 * `landingPadrao`.
 *
 * `versaoId` é o id da linha `published` lida, usado pela telemetria de Web
 * Vitals. É `null` quando o documento vem dos defaults.
 *
 * Envolvido em `cache` para layout e page compartilharem uma única leitura.
 */
export const getLanding = cache(
  async (): Promise<{ doc: LandingDocumento; versaoId: string | null }> => {
    const versao = await lerVersao(criarClientePublico(), "published");

    return {
      doc: versao === null ? landingPadrao : parseLanding(versao.conteudo),
      versaoId: versao?.id ?? null,
    };
  },
);

/**
 * Documento da landing para a pré-visualização do admin: o rascunho e, se ele
 * não existir, a publicada. Recebe o cliente do admin (com cookies), cuja RLS
 * enxerga o `draft`. Nunca lança: sem versão válida, cai em `landingPadrao`.
 */
export async function getRascunhoLanding(
  supabase: Cliente,
): Promise<LandingDocumento> {
  const versao =
    (await lerVersao(supabase, "draft")) ??
    (await lerVersao(supabase, "published"));

  return versao === null ? landingPadrao : parseLanding(versao.conteudo);
}

/** Grava o conteúdo validado como rascunho (RPC `salvar_rascunho_landing`). */
export function salvarRascunhoLanding(supabase: Cliente, conteudo: Json) {
  return supabase.rpc("salvar_rascunho_landing", { p_conteudo: conteudo });
}

/** Publica o rascunho com uma nota opcional (RPC `publicar_landing`). */
export function publicarLanding(supabase: Cliente, nota: string | undefined) {
  return supabase.rpc("publicar_landing", { p_nota: nota });
}

/** Descarta o rascunho (RPC `descartar_rascunho_landing`). */
export function descartarRascunhoLanding(supabase: Cliente) {
  return supabase.rpc("descartar_rascunho_landing");
}

/** Copia uma versão do histórico para o rascunho, sem publicar (RPC `restaurar_versao_landing`). */
export function restaurarVersaoLanding(supabase: Cliente, id: string) {
  return supabase.rpc("restaurar_versao_landing", { p_id: id });
}

/** Conteúdo do rascunho para o editor. `null` quando não há rascunho. */
export function buscarRascunhoEditor(supabase: Cliente) {
  return supabase
    .from("landing_versoes")
    .select("conteudo")
    .eq("status", "draft")
    .maybeSingle();
}

/** Conteúdo e data de publicação da versão no ar, para o editor. */
export function buscarPublicadaEditor(supabase: Cliente) {
  return supabase
    .from("landing_versoes")
    .select("conteudo,publicado_em")
    .eq("status", "published")
    .maybeSingle();
}

/** Versões publicadas e arquivadas, da mais recente para a mais antiga. */
export function listarVersoesHistorico(supabase: Cliente) {
  return supabase
    .from("landing_versoes")
    .select("id,nota,status,publicado_em")
    .in("status", ["published", "archived"])
    .order("publicado_em", { ascending: false });
}
