import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import { paraMidiaRef } from "@/features/media/urls";
import type { Database, MidiaRow } from "@/lib/supabase/database";
import { criarClientePublico, type PublicResult } from "@/lib/supabase/public";
import type { PublicConteudo, PublicConteudoDetalhe } from "./schema";

type Supabase = SupabaseClient<Database>;
type ConteudoInsert = Database["public"]["Tables"]["conteudos"]["Insert"];
type ConteudoUpdate = Database["public"]["Tables"]["conteudos"]["Update"];

/** Mídia como volta do join com `midias`. A FK é nullable no tipo gerado. */
type MidiaJunta = Pick<
  MidiaRow,
  "id" | "caminho" | "tipo" | "alt" | "largura" | "altura"
> | null;

export function listarConteudosAdmin(supabase: Supabase) {
  return supabase
    .from("conteudos")
    .select(
      "id,titulo,slug,categoria,status,ordem,midia:midias!conteudos_midia_id_fkey(id,caminho,tipo,alt,largura,altura),clientes(nome)",
    )
    .order("ordem", { ascending: true })
    .order("titulo", { ascending: true });
}

export function buscarConteudoParaEdicao(supabase: Supabase, id: string) {
  return supabase
    .from("conteudos")
    .select(
      "id,titulo,slug,categoria,descricao,status,ordem,cliente_id,midia:midias!conteudos_midia_id_fkey(id,caminho,tipo,alt,largura,altura)",
    )
    .eq("id", id)
    .maybeSingle();
}

/** Id e slug do projeto, usados para checar existência e revalidar a página antiga. */
export function buscarIdESlugConteudo(supabase: Supabase, id: string) {
  return supabase
    .from("conteudos")
    .select("id,slug")
    .eq("id", id)
    .maybeSingle();
}

export function inserirConteudo(supabase: Supabase, dados: ConteudoInsert) {
  return supabase.from("conteudos").insert(dados);
}

export function atualizarConteudoBanco(
  supabase: Supabase,
  id: string,
  dados: ConteudoUpdate,
) {
  return supabase.from("conteudos").update(dados).eq("id", id);
}

export function alternarStatusConteudoBanco(
  supabase: Supabase,
  id: string,
  status: "draft" | "published",
) {
  return supabase
    .from("conteudos")
    .update({ status })
    .eq("id", id)
    .select("slug")
    .maybeSingle();
}

/** Função `reordenar_conteudos`: regrava `ordem` como 0, 1, 2… numa única operação. */
export function reordenarConteudosBanco(supabase: Supabase, ids: string[]) {
  return supabase.rpc("reordenar_conteudos", { p_ids: ids });
}

export function excluirConteudoBanco(supabase: Supabase, id: string) {
  return supabase.from("conteudos").delete().eq("id", id);
}

/** Converte a linha do banco no item de vitrine, com a mídia já no formato público. */
function paraItemPublico(conteudo: ConteudoPublicado): PublicConteudo {
  return {
    id: conteudo.id,
    slug: conteudo.slug,
    titulo: conteudo.titulo,
    descricao: conteudo.descricao,
    categoria: conteudo.categoria,
    clienteNome: conteudo.clientes?.nome ?? "",
    midia: conteudo.midia ? paraMidiaRef(conteudo.midia) : null,
  };
}

type ConteudoPublicado = {
  id: string;
  slug: string;
  titulo: string;
  descricao: string;
  categoria: string | null;
  clientes: { nome: string } | null;
  midia: MidiaJunta;
};

/**
 * Conteúdos (projetos) publicados para a landing, na ordem definida no admin.
 * Depende da policy `conteudos: leitura` e da leitura de `midias` ligadas a um projeto publicado.
 */
export async function getPublishedConteudos(): Promise<
  PublicResult<PublicConteudo>
> {
  try {
    const supabase = criarClientePublico();

    const { data, error } = await supabase
      .from("conteudos")
      .select(
        "id,slug,titulo,descricao,categoria,ordem,midia:midias!conteudos_midia_id_fkey(id,caminho,tipo,alt,largura,altura),clientes(nome)",
      )
      .eq("status", "published")
      .order("ordem", { ascending: true })
      .order("titulo", { ascending: true });

    if (error) throw error;

    const items = ((data ?? []) as ConteudoPublicado[]).map(paraItemPublico);

    return { status: "ok", items };
  } catch (error) {
    console.error("[landing] falha ao carregar conteúdos publicados", error);
    return { status: "error", items: [] };
  }
}

/**
 * Um conteúdo publicado pelo slug. Rascunhos e slugs inexistentes retornam
 * `item: null`, que a página transforma em 404.
 */
export async function getPublishedConteudoBySlug(
  slug: string,
): Promise<PublicConteudoDetalhe> {
  try {
    const supabase = criarClientePublico();

    const { data, error } = await supabase
      .from("conteudos")
      .select(
        "id,slug,titulo,descricao,categoria,midia:midias!conteudos_midia_id_fkey(id,caminho,tipo,alt,largura,altura),clientes(nome)",
      )
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();

    if (error) throw error;
    if (!data) return { status: "ok", item: null };

    return {
      status: "ok",
      item: paraItemPublico(data as ConteudoPublicado),
    };
  } catch (error) {
    console.error("[projetos] falha ao carregar conteúdo publicado", error);
    return { status: "error", item: null };
  }
}

/** Slugs e datas dos conteúdos publicados, para o sitemap (sem gerar URLs de mídia). */
export async function getPublishedConteudoSlugs(): Promise<
  { slug: string; atualizadoEm: Date }[]
> {
  try {
    const supabase = criarClientePublico();

    const { data, error } = await supabase
      .from("conteudos")
      .select("slug,atualizado_em")
      .eq("status", "published")
      .order("ordem", { ascending: true });

    if (error) throw error;

    return (data ?? []).map((conteudo) => ({
      slug: conteudo.slug,
      atualizadoEm: new Date(conteudo.atualizado_em),
    }));
  } catch (error) {
    console.error("[sitemap] falha ao carregar slugs de conteúdos", error);
    return [];
  }
}
