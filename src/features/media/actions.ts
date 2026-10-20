"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/features/auth/require-admin";
import {
  atualizarAltMidia,
  buscarMidia,
  contarUsosMidia,
  infoArquivo,
  inserirMidia,
  listarPagina,
  removerArquivo,
  removerMidia,
  versoesQueUsam,
} from "@/features/media/data";
import { TAMANHO_MAXIMO_BYTES } from "@/features/media/rules";
import {
  altSchema,
  type CursorMidias,
  idSchema,
  listagemSchema,
  type MidiaBiblioteca,
  type PaginaMidias,
  type ResultadoMidia,
  type ResultadoSimples,
  registroSchema,
} from "@/features/media/schema";
import { paraMidiaRef } from "@/features/media/urls";

const TAMANHO_PAGINA_MIDIAS = 60;

const mensagemEmUso =
  "Esta mídia está em uso na página inicial. Troque-a antes de excluir.";

const mensagemEmUsoPorConteudo =
  "Esta mídia está em uso por um projeto ou cliente. Troque-a antes de excluir.";

const mensagemNoHistorico =
  "Esta mídia é usada em uma versão do histórico da página inicial (arquivada). Ela não pode ser excluída enquanto essa versão existir.";

/**
 * Registra no banco um arquivo que o browser já enviou para o bucket `site`.
 * O envio é feito direto para o Storage (a policy exige admin). Antes de gravar a linha,
 * confere no Storage que o objeto existe e usa o tamanho real, não o informado pelo browser.
 */
export async function registrarMidia(input: {
  caminho: string;
  tipo: "imagem" | "video";
  mime: string;
  tamanho: number;
  largura?: number | null;
  altura?: number | null;
  alt: string;
}): Promise<ResultadoMidia> {
  const { supabase } = await requireAdmin();
  const result = registroSchema.safeParse(input);

  if (!result.success) {
    return {
      ok: false,
      erro: result.error.issues[0]?.message ?? "Dados inválidos.",
    };
  }

  // `info` falha com 404 quando o objeto não existe (ex.: upload que não concluiu).
  const { data: arquivo, error: arquivoError } = await infoArquivo(
    supabase,
    result.data.caminho,
  );

  if (arquivoError || !arquivo) {
    return {
      ok: false,
      erro: "O arquivo não foi encontrado no armazenamento. Envie novamente.",
    };
  }

  const tamanhoReal = arquivo.size;

  if (!tamanhoReal || tamanhoReal <= 0) {
    return { ok: false, erro: "O arquivo está vazio." };
  }

  if (tamanhoReal > TAMANHO_MAXIMO_BYTES) {
    return { ok: false, erro: "O arquivo deve ter no máximo 50 MB." };
  }

  const { data, error } = await inserirMidia(supabase, {
    caminho: result.data.caminho,
    tipo: result.data.tipo,
    mime: result.data.mime,
    tamanho: tamanhoReal,
    largura: result.data.largura ?? null,
    altura: result.data.altura ?? null,
    alt: result.data.alt,
  });

  if (error || !data) {
    return {
      ok: false,
      erro: "Não foi possível registrar a mídia. Tente novamente.",
    };
  }

  revalidatePath("/admin/midia");
  return { ok: true, midia: paraMidiaRef(data) };
}

/** Atualiza o texto alternativo. Não propaga para a landing: o documento guarda sua cópia. */
export async function atualizarAlt(
  id: string,
  alt: string,
): Promise<ResultadoSimples> {
  const { supabase } = await requireAdmin();
  const idResult = idSchema.safeParse(id);
  const altResult = altSchema.safeParse(alt);

  if (!idResult.success) return { ok: false, erro: "Mídia inválida." };
  if (!altResult.success) {
    return {
      ok: false,
      erro: altResult.error.issues[0]?.message ?? "Texto alternativo inválido.",
    };
  }

  const { data, error } = await atualizarAltMidia(
    supabase,
    idResult.data,
    altResult.data,
  );

  if (error) {
    return { ok: false, erro: "Não foi possível salvar o texto alternativo." };
  }

  if (!data) return { ok: false, erro: "Mídia não encontrada." };

  revalidatePath("/admin/midia");
  return { ok: true };
}

/**
 * Exclui a mídia do banco e do bucket. Antes confere se algum projeto ou cliente aponta
 * para ela (FK com restrict) e se ela aparece no documento de alguma versão da landing
 * (rascunho, publicada ou arquivada). Versões arquivadas
 * podem ser restauradas, então também bloqueiam a exclusão para não gerar link quebrado.
 */
export async function excluirMidia(id: string): Promise<ResultadoSimples> {
  const { supabase } = await requireAdmin();
  const idResult = idSchema.safeParse(id);

  if (!idResult.success) return { ok: false, erro: "Mídia inválida." };

  const { data: midia, error: midiaError } = await buscarMidia(
    supabase,
    idResult.data,
  );

  if (midiaError) {
    return {
      ok: false,
      erro: "Não foi possível excluir a mídia. Tente novamente.",
    };
  }

  if (!midia) return { ok: false, erro: "Mídia não encontrada." };

  const { total, error: usosError } = await contarUsosMidia(supabase, midia.id);

  if (usosError) {
    return { ok: false, erro: "Não foi possível verificar o uso da mídia." };
  }

  if (total > 0) return { ok: false, erro: mensagemEmUsoPorConteudo };

  const { data: usadas, error: versoesError } = await versoesQueUsam(
    supabase,
    midia.id,
  );

  if (versoesError) {
    return { ok: false, erro: "Não foi possível verificar o uso da mídia." };
  }

  if (usadas.some((versao) => versao.status !== "archived")) {
    return { ok: false, erro: mensagemEmUso };
  }

  if (usadas.length > 0) return { ok: false, erro: mensagemNoHistorico };

  const { error: deleteError } = await removerMidia(supabase, midia.id);

  if (deleteError) {
    // 23503: um projeto ou cliente passou a usar a mídia depois da verificação acima.
    if (deleteError.code === "23503") {
      return { ok: false, erro: mensagemEmUsoPorConteudo };
    }

    return {
      ok: false,
      erro: "Não foi possível excluir a mídia. Tente novamente.",
    };
  }

  await removerArquivo(supabase, midia.caminho);

  revalidatePath("/admin/midia");
  return { ok: true };
}

/**
 * Lista a biblioteca, da mais recente para a mais antiga, em páginas de 60.
 * Paginação por cursor (criado_em desc, id desc): ao carregar mais, passe `proximoCursor`.
 * Usado pela tela e pelo seletor.
 */
export async function listarMidias(
  opcoes: { tipo?: "imagem" | "video"; cursor?: CursorMidias | null } = {},
): Promise<PaginaMidias> {
  const { supabase } = await requireAdmin();
  const entrada = listagemSchema.safeParse(opcoes);

  if (!entrada.success) throw new Error("Parâmetros de listagem inválidos.");

  const { tipo, cursor } = entrada.data;

  // Uma linha a mais que a página: indica se existe próxima página sem outra consulta.
  const { data, error } = await listarPagina(supabase, {
    tipo,
    cursor,
    limite: TAMANHO_PAGINA_MIDIAS + 1,
  });

  if (error) throw error;

  const linhas = data ?? [];
  const pagina = linhas.slice(0, TAMANHO_PAGINA_MIDIAS);
  const ultima = pagina.at(-1);

  return {
    itens: pagina.map(
      (row): MidiaBiblioteca => ({
        ...paraMidiaRef(row),
        tamanho: row.tamanho,
        criadoEm: row.criado_em,
      }),
    ),
    proximoCursor:
      linhas.length > TAMANHO_PAGINA_MIDIAS && ultima
        ? { criadoEm: ultima.criado_em, id: ultima.id }
        : null,
  };
}
