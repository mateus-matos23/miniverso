"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/features/auth/require-admin";
import { buscarClientePorId } from "@/features/clients/data";
import { errosPorCampo, lerCampos } from "@/lib/form-data";
import {
  alternarStatusConteudoBanco,
  atualizarConteudoBanco,
  buscarIdESlugConteudo,
  excluirConteudoBanco,
  inserirConteudo,
  reordenarConteudosBanco,
} from "./data";
import {
  type AcaoConteudoState,
  type CadastroConteudoState,
  campos,
  camposTexto,
  conteudoSchema,
  idSchema,
  idsSchema,
  statusConteudoSchema,
} from "./schema";

/** Revalida a landing, a página de cada slug informado e a listagem do admin. */
function revalidarConteudo(...slugs: string[]) {
  revalidatePath("/");
  for (const slug of new Set(slugs)) {
    revalidatePath(`/projetos/${slug}`);
  }
  revalidatePath("/admin/projetos");
}

/** Devolve `null` se a consulta falhar, para a action responder com erro em vez de quebrar a tela. */
async function clienteExiste(
  supabase: Awaited<ReturnType<typeof requireAdmin>>["supabase"],
  clienteId: string,
): Promise<boolean | null> {
  const { data, error } = await buscarClientePorId(supabase, clienteId);

  if (error) {
    console.error("[projetos] falha ao verificar cliente", error);
    return null;
  }

  return Boolean(data);
}

export async function criarConteudo(
  _previousState: CadastroConteudoState,
  formData: FormData,
): Promise<CadastroConteudoState> {
  const { supabase } = await requireAdmin();
  const result = conteudoSchema.safeParse({
    titulo: formData.get("titulo"),
    slug: formData.get("slug"),
    categoria: formData.get("categoria"),
    clienteId: formData.get("clienteId"),
    descricao: formData.get("descricao"),
    status: formData.get("status"),
    ordem: formData.get("ordem"),
    midia: formData.get("midiaId"),
  });

  if (!result.success) {
    return {
      erros: errosPorCampo(result.error, campos),
      values: lerCampos(formData, camposTexto),
    };
  }

  const { midia, ...dados } = result.data;
  const existeCliente = await clienteExiste(supabase, dados.clienteId);

  if (existeCliente === null) {
    return {
      erro: "Não foi possível criar o projeto. Tente novamente.",
      values: lerCampos(formData, camposTexto),
    };
  }

  if (!existeCliente) {
    return {
      erros: { clienteId: "Cliente não encontrado." },
      values: lerCampos(formData, camposTexto),
    };
  }

  const { error: insertError } = await inserirConteudo(supabase, {
    titulo: dados.titulo,
    slug: dados.slug,
    categoria: dados.categoria || null,
    cliente_id: dados.clienteId,
    descricao: dados.descricao,
    midia_id: midia,
    status: dados.status,
    ordem: dados.ordem,
  });

  if (insertError) {
    if (insertError.code === "23505") {
      return {
        erros: { slug: "Já existe um projeto com esse slug." },
        values: lerCampos(formData, camposTexto),
      };
    }

    if (chaveDeMidiaInvalida(insertError)) {
      return {
        erros: { midia: "Mídia não encontrada." },
        values: lerCampos(formData, camposTexto),
      };
    }

    return { erro: "Não foi possível criar o projeto. Tente novamente." };
  }

  revalidarConteudo(dados.slug);
  redirect("/admin/projetos?feedback=criado");
}

export async function atualizarConteudo(
  _previousState: CadastroConteudoState,
  formData: FormData,
): Promise<CadastroConteudoState> {
  const { supabase } = await requireAdmin();
  const idValido = idSchema.safeParse(formData.get("id"));

  if (!idValido.success) return { erro: "Projeto inválido." };

  const result = conteudoSchema.safeParse({
    titulo: formData.get("titulo"),
    slug: formData.get("slug"),
    categoria: formData.get("categoria"),
    clienteId: formData.get("clienteId"),
    descricao: formData.get("descricao"),
    status: formData.get("status"),
    ordem: formData.get("ordem"),
    midia: formData.get("midiaId"),
  });

  if (!result.success) {
    return {
      erros: errosPorCampo(result.error, campos),
      values: lerCampos(formData, camposTexto),
    };
  }

  const { midia, ...dados } = result.data;

  const { data: atual, error: atualError } = await buscarIdESlugConteudo(
    supabase,
    idValido.data,
  );

  if (atualError) {
    console.error(
      "[projetos] falha ao buscar projeto para atualizar",
      atualError,
    );
    return {
      erro: "Não foi possível salvar o projeto. Tente novamente.",
      values: lerCampos(formData, camposTexto),
    };
  }

  if (!atual) return { erro: "Projeto não encontrado." };

  const existeCliente = await clienteExiste(supabase, dados.clienteId);

  if (existeCliente === null) {
    return {
      erro: "Não foi possível salvar o projeto. Tente novamente.",
      values: lerCampos(formData, camposTexto),
    };
  }

  if (!existeCliente) {
    return {
      erros: { clienteId: "Cliente não encontrado." },
      values: lerCampos(formData, camposTexto),
    };
  }

  const { error: updateError } = await atualizarConteudoBanco(
    supabase,
    atual.id,
    {
      titulo: dados.titulo,
      slug: dados.slug,
      categoria: dados.categoria || null,
      cliente_id: dados.clienteId,
      descricao: dados.descricao,
      midia_id: midia,
      status: dados.status,
      ordem: dados.ordem,
    },
  );

  if (updateError) {
    if (updateError.code === "23505") {
      return {
        erros: { slug: "Já existe um projeto com esse slug." },
        values: lerCampos(formData, camposTexto),
      };
    }

    if (chaveDeMidiaInvalida(updateError)) {
      return {
        erros: { midia: "Mídia não encontrada." },
        values: lerCampos(formData, camposTexto),
      };
    }

    return { erro: "Não foi possível salvar o projeto. Tente novamente." };
  }

  revalidarConteudo(atual.slug, dados.slug);
  redirect("/admin/projetos?feedback=atualizado");
}

/** Violação da FK `midia_id` (23503): a mídia escolhida não existe mais na biblioteca. */
function chaveDeMidiaInvalida(error: { code?: string; message: string }) {
  return error.code === "23503" && error.message.includes("midia_id");
}

export async function alternarStatusConteudo(
  id: string,
  statusAlvo: string,
): Promise<AcaoConteudoState> {
  const { supabase } = await requireAdmin();
  const idValido = idSchema.safeParse(id);

  if (!idValido.success) return { erro: "Projeto inválido." };

  // O cliente informa o status desejado (e não "inverter o atual"), para que dois cliques
  // com a tela defasada não revertam um ao outro.
  const statusValido = statusConteudoSchema.safeParse(statusAlvo);

  if (!statusValido.success) {
    return { erro: statusValido.error.issues[0].message };
  }

  const { data: atualizado, error: updateError } =
    await alternarStatusConteudoBanco(
      supabase,
      idValido.data,
      statusValido.data,
    );

  if (updateError) {
    return { erro: "Não foi possível alterar o status. Tente novamente." };
  }

  if (!atualizado) return { erro: "Projeto não encontrado." };

  revalidarConteudo(atualizado.slug);
  return {};
}

/**
 * Regrava `ordem` como 0, 1, 2… na sequência enviada, numa única operação no banco
 * (função `reordenar_conteudos`). A lista precisa conter todos os projetos, sem repetição.
 */
export async function reordenarConteudos(
  ids: string[],
): Promise<AcaoConteudoState> {
  const { supabase } = await requireAdmin();
  const idsValidos = idsSchema.safeParse(ids);

  if (!idsValidos.success) return { erro: "Ordem inválida." };

  const { error } = await reordenarConteudosBanco(supabase, idsValidos.data);

  // Revalida também em caso de erro: se a lista estiver defasada, a tela volta a mostrar a ordem do banco.
  revalidarConteudo();

  if (error) {
    return {
      erro:
        error.message === "lista de ordem invalida"
          ? "A lista de projetos mudou. Atualize a página e tente novamente."
          : "Não foi possível reordenar os projetos. Tente novamente.",
    };
  }

  return {};
}

export async function excluirConteudo(
  _previousState: CadastroConteudoState,
  formData: FormData,
): Promise<CadastroConteudoState> {
  const { supabase } = await requireAdmin();
  const id = idSchema.safeParse(formData.get("id"));

  if (!id.success) {
    return { erro: "Projeto inválido." };
  }

  const { data: conteudo, error: conteudoError } = await buscarIdESlugConteudo(
    supabase,
    id.data,
  );

  if (conteudoError) {
    console.error(
      "[projetos] falha ao buscar projeto para excluir",
      conteudoError,
    );
    return { erro: "Não foi possível excluir o projeto. Tente novamente." };
  }

  if (!conteudo) return { erro: "Projeto não encontrado." };

  const { error: deleteError } = await excluirConteudoBanco(
    supabase,
    conteudo.id,
  );

  if (deleteError) {
    console.error("[projetos] falha ao excluir projeto", deleteError);
    return { erro: "Não foi possível excluir o projeto. Tente novamente." };
  }

  // A mídia continua na biblioteca: excluir o projeto não apaga o arquivo.
  revalidarConteudo(conteudo.slug);
  redirect("/admin/projetos?feedback=excluido");
}
