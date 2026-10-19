import { createClient } from "@supabase/supabase-js";
import { env } from "@/config/env";
import type { Database } from "@/utils/supabase/database";

const bucket = "miniverso";

export type PublicCliente = {
  id: string;
  nome: string;
  logoUrl: string;
};

export type PublicResult<T> =
  | { status: "ok"; items: T[] }
  | { status: "error"; items: [] };

/**
 * Clientes publicados para a landing. Usa a chave pública, sem cookies, para
 * que a página possa ser estática e revalidada. Depende de uma política RLS
 * que permita `select` em `clientes` com `status = 'published'` e leitura dos
 * logos no Storage.
 */
export function criarClientePublico() {
  return createClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    { auth: { persistSession: false } },
  );
}

export async function getPublishedClientes(): Promise<
  PublicResult<PublicCliente>
> {
  try {
    const supabase = criarClientePublico();

    const { data, error } = await supabase
      .from("clientes")
      .select("id,nome,caminho_logo")
      .eq("status", "published")
      .order("ordem", { ascending: true })
      .order("nome", { ascending: true });

    if (error) throw error;
    if (!data?.length) return { status: "ok", items: [] };

    const { data: urls, error: urlError } = await supabase.storage
      .from(bucket)
      .createSignedUrls(
        data.map((cliente) => cliente.caminho_logo),
        60 * 60 * 2,
      );

    if (urlError) throw urlError;

    const items = data.flatMap((cliente, index) => {
      const url = urls?.[index]?.signedUrl;
      return url ? [{ id: cliente.id, nome: cliente.nome, logoUrl: url }] : [];
    });

    return { status: "ok", items };
  } catch (error) {
    console.error("[landing] falha ao carregar clientes publicados", error);
    return { status: "error", items: [] };
  }
}

export type PublicConteudo = {
  id: string;
  slug: string;
  titulo: string;
  descricao: string;
  categoria: string | null;
  clienteNome: string;
  tipoMidia: "imagem" | "video";
  midiaUrl: string | null;
};

export type PublicConteudoDetalhe = {
  status: "ok" | "error";
  item: PublicConteudo | null;
};

const colunasConteudo =
  "id,slug,titulo,descricao,categoria,tipo_midia,caminho_midia,ordem,clientes(nome)";

type ConteudoPublicado = {
  id: string;
  slug: string;
  titulo: string;
  descricao: string;
  categoria: string | null;
  tipo_midia: string;
  caminho_midia: string;
  clientes: { nome: string } | null;
};

/** Converte as linhas do banco em itens de vitrine, com URL assinada para a mídia. */
async function comMidiaAssinada(
  supabase: ReturnType<typeof criarClientePublico>,
  rows: ConteudoPublicado[],
): Promise<PublicConteudo[]> {
  if (!rows.length) return [];

  const { data: urls, error: urlError } = await supabase.storage
    .from(bucket)
    .createSignedUrls(
      rows.map((conteudo) => conteudo.caminho_midia),
      60 * 60 * 2,
    );

  if (urlError) throw urlError;

  return rows.map((conteudo, index) => ({
    id: conteudo.id,
    slug: conteudo.slug,
    titulo: conteudo.titulo,
    descricao: conteudo.descricao,
    categoria: conteudo.categoria,
    clienteNome: conteudo.clientes?.nome ?? "",
    tipoMidia: conteudo.tipo_midia === "video" ? "video" : "imagem",
    midiaUrl: urls?.[index]?.signedUrl ?? null,
  }));
}

/**
 * Conteúdos (projetos) publicados para a landing, na ordem definida no admin.
 * Depende das policies `conteudos: leitura` e `miniverso: leitura` (storage).
 */
export async function getPublishedConteudos(): Promise<
  PublicResult<PublicConteudo>
> {
  try {
    const supabase = criarClientePublico();

    const { data, error } = await supabase
      .from("conteudos")
      .select(colunasConteudo)
      .eq("status", "published")
      .order("ordem", { ascending: true })
      .order("titulo", { ascending: true });

    if (error) throw error;

    const items = await comMidiaAssinada(
      supabase,
      (data ?? []) as ConteudoPublicado[],
    );

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
      .select(colunasConteudo)
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();

    if (error) throw error;
    if (!data) return { status: "ok", item: null };

    const [item] = await comMidiaAssinada(supabase, [
      data as ConteudoPublicado,
    ]);

    return { status: "ok", item: item ?? null };
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
