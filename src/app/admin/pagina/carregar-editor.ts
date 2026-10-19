import { parseLanding } from "@/lib/landing/parse";
import type { LandingDocumento } from "@/lib/landing/schema";
import type { createClient } from "@/utils/supabase/server";

type Supabase = ReturnType<typeof createClient>;

export type EstadoEditorLanding = {
  inicial: LandingDocumento;
  temRascunho: boolean;
  publicadoEm: string | null;
  /** Muda quando o servidor muda o estado (publicar, descartar), para remontar o editor. */
  chave: string;
};

/**
 * Lê o rascunho (ou, se não houver, a versão publicada) da landing.
 * Usado pelas telas de Página inicial e de Configurações, que editam o mesmo documento.
 */
export async function carregarEditorLanding(
  supabase: Supabase,
): Promise<EstadoEditorLanding> {
  const { data: rascunho, error: erroRascunho } = await supabase
    .from("landing_versoes")
    .select("conteudo")
    .eq("status", "draft")
    .maybeSingle();

  if (erroRascunho) throw erroRascunho;

  const { data: publicada, error: erroPublicada } = await supabase
    .from("landing_versoes")
    .select("conteudo,publicado_em")
    .eq("status", "published")
    .maybeSingle();

  if (erroPublicada) throw erroPublicada;

  const publicadoEm = publicada?.publicado_em ?? null;

  return {
    inicial: parseLanding((rascunho ?? publicada)?.conteudo),
    temRascunho: Boolean(rascunho),
    publicadoEm,
    chave: rascunho ? "rascunho" : `publicada-${publicadoEm ?? "padrao"}`,
  };
}
