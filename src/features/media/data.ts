import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import type { CursorMidias } from "@/features/media/schema";
import { BUCKET_SITE } from "@/features/media/urls";
import type { Database } from "@/lib/supabase/database";

type Cliente = SupabaseClient<Database>;
type MidiaInsert = Database["public"]["Tables"]["midias"]["Insert"];

/** Metadados do arquivo no bucket `site`. Falha com 404 quando o objeto não existe. */
export function infoArquivo(supabase: Cliente, caminho: string) {
  return supabase.storage.from(BUCKET_SITE).info(caminho);
}

export function inserirMidia(supabase: Cliente, dados: MidiaInsert) {
  return supabase.from("midias").insert(dados).select().single();
}

export function buscarMidia(supabase: Cliente, id: string) {
  return supabase
    .from("midias")
    .select("id,caminho")
    .eq("id", id)
    .maybeSingle();
}

export function atualizarAltMidia(supabase: Cliente, id: string, alt: string) {
  return supabase
    .from("midias")
    .update({ alt })
    .eq("id", id)
    .select("id")
    .maybeSingle();
}

/**
 * Quantos projetos (`conteudos.midia_id`) e clientes (`clientes.logo_id`) apontam para a mídia.
 * Consulta só a contagem: não traz as linhas.
 */
export async function contarUsosMidia(supabase: Cliente, id: string) {
  const [projetos, clientes] = await Promise.all([
    supabase
      .from("conteudos")
      .select("id", { count: "exact", head: true })
      .eq("midia_id", id),
    supabase
      .from("clientes")
      .select("id", { count: "exact", head: true })
      .eq("logo_id", id),
  ]);

  const error = projetos.error ?? clientes.error;
  if (error) return { total: 0, error };

  return { total: (projetos.count ?? 0) + (clientes.count ?? 0), error: null };
}

export function removerMidia(supabase: Cliente, id: string) {
  return supabase.from("midias").delete().eq("id", id);
}

export function removerArquivo(supabase: Cliente, caminho: string) {
  return supabase.storage.from(BUCKET_SITE).remove([caminho]);
}

/**
 * Versões da landing (rascunho, publicada ou arquivada) cujo documento cita a mídia.
 * O id é um uuid: basta procurar o texto dentro do JSON de cada versão.
 */
export async function versoesQueUsam(supabase: Cliente, id: string) {
  const { data, error } = await supabase
    .from("landing_versoes")
    .select("status,conteudo")
    .in("status", ["draft", "published", "archived"]);

  if (error) return { data: [], error };

  const usadas = (data ?? []).filter((versao) =>
    JSON.stringify(versao.conteudo).includes(id),
  );

  return { data: usadas, error: null };
}

/** Uma página da biblioteca, ordenada por criado_em e id desc. `limite` é o número de linhas a buscar. */
export async function listarPagina(
  supabase: Cliente,
  {
    tipo,
    cursor,
    limite,
  }: {
    tipo?: "imagem" | "video";
    cursor?: CursorMidias | null;
    limite: number;
  },
) {
  let consulta = supabase
    .from("midias")
    .select("id,caminho,tipo,alt,largura,altura,tamanho,criado_em")
    .order("criado_em", { ascending: false })
    .order("id", { ascending: false })
    .limit(limite);

  if (tipo) consulta = consulta.eq("tipo", tipo);

  if (cursor) {
    consulta = consulta.or(
      `criado_em.lt."${cursor.criadoEm}",and(criado_em.eq."${cursor.criadoEm}",id.lt.${cursor.id})`,
    );
  }

  return await consulta;
}
