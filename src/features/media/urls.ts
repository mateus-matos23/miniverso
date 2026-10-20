import type { MidiaRef } from "@/features/media/schema";
import type { MidiaRow } from "@/lib/supabase/database";

/** Bucket público da biblioteca de mídia do site. */
export const BUCKET_SITE = "site";

/** Colunas que a referência usa. Aceita a linha completa ou um select parcial. */
type LinhaMidia = Pick<
  MidiaRow,
  "id" | "caminho" | "tipo" | "alt" | "largura" | "altura"
>;

/**
 * URL pública de um arquivo do bucket `site`. O acesso literal a
 * `process.env.NEXT_PUBLIC_SUPABASE_URL` deixa o Next inlinar a variável no client.
 */
export function urlPublicaMidia(caminho: string) {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BUCKET_SITE}/${caminho}`;
}

/** Converte a linha da tabela `midias` na referência guardada no documento da landing. */
export function paraMidiaRef(row: LinhaMidia): MidiaRef {
  return {
    id: row.id,
    url: urlPublicaMidia(row.caminho),
    tipo: row.tipo === "video" ? "video" : "imagem",
    alt: row.alt,
    largura: row.largura,
    altura: row.altura,
  };
}
