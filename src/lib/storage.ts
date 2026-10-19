import type { SupabaseClient } from "@supabase/supabase-js";

/** Bucket privado: logos de clientes e mídias de projetos, lidos por URL assinada. */
export const BUCKET_PRIVADO = "miniverso";

/** Bucket público da biblioteca de mídia do site. */
export const BUCKET_SITE = "site";

/**
 * Gera URLs assinadas para os caminhos do bucket privado, na mesma ordem.
 * Caminho sem URL vira `null`. Lança erro se o Storage falhar.
 */
export async function urlsAssinadas(
  supabase: Pick<SupabaseClient, "storage">,
  caminhos: string[],
  validadeSegundos: number,
): Promise<(string | null)[]> {
  if (caminhos.length === 0) return [];

  const { data, error } = await supabase.storage
    .from(BUCKET_PRIVADO)
    .createSignedUrls(caminhos, validadeSegundos);

  if (error) throw error;

  return caminhos.map((_, index) => data?.[index]?.signedUrl || null);
}
