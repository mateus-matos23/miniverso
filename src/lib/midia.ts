import type { MidiaRef } from "@/lib/landing/schema";
import type { MidiaRow } from "@/utils/supabase/database";

/**
 * URL pública de um arquivo do bucket `site`. O acesso literal a
 * `process.env.NEXT_PUBLIC_SUPABASE_URL` deixa o Next inlinar a variável no client.
 */
export function urlPublicaMidia(caminho: string) {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/site/${caminho}`;
}

/** Converte a linha da tabela `midias` na referência guardada no documento da landing. */
export function paraMidiaRef(row: MidiaRow): MidiaRef {
  return {
    id: row.id,
    url: urlPublicaMidia(row.caminho),
    tipo: row.tipo === "video" ? "video" : "imagem",
    alt: row.alt,
    largura: row.largura,
    altura: row.altura,
  };
}
