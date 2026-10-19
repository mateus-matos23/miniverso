import type { SupabaseClient } from "@supabase/supabase-js";
import { cache } from "react";
import { criarClientePublico } from "@/lib/public-content";
import type { Database } from "@/utils/supabase/database";
import { landingPadrao } from "./defaults";
import { parseLanding } from "./parse";
import type { LandingDocumento } from "./schema";

type Status = "draft" | "published";

type VersaoLida = { id: string; conteudo: unknown };

/**
 * Conteúdo de uma versão da landing, ou `null` se não existir ou a leitura falhar.
 * A RLS já limita o anon à `published`; o admin enxerga também o `draft`.
 */
async function lerVersao(
  supabase: SupabaseClient<Database>,
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
  supabase: SupabaseClient<Database>,
): Promise<LandingDocumento> {
  const versao =
    (await lerVersao(supabase, "draft")) ??
    (await lerVersao(supabase, "published"));

  return versao === null ? landingPadrao : parseLanding(versao.conteudo);
}
