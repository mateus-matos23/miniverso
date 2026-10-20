import {
  buscarPublicadaEditor,
  buscarRascunhoEditor,
} from "@/features/landing/data";
import { parseLanding } from "@/features/landing/parse";
import type { LandingDocumento } from "@/features/landing/schema";
import type { createClient } from "@/lib/supabase/server";

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
  const { data: rascunho, error: erroRascunho } =
    await buscarRascunhoEditor(supabase);

  if (erroRascunho) throw erroRascunho;

  const { data: publicada, error: erroPublicada } =
    await buscarPublicadaEditor(supabase);

  if (erroPublicada) throw erroPublicada;

  const publicadoEm = publicada?.publicado_em ?? null;

  return {
    inicial: parseLanding((rascunho ?? publicada)?.conteudo),
    temRascunho: Boolean(rascunho),
    publicadoEm,
    chave: rascunho ? "rascunho" : `publicada-${publicadoEm ?? "padrao"}`,
  };
}
