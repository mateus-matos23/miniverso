"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/features/auth/require-admin";
import { errosPorCampo, lerCampos } from "@/lib/form-data";
import {
  atualizarClienteBanco,
  buscarClientePorId,
  excluirClienteBanco,
  inserirCliente,
  reordenarClientesBanco,
} from "./data";
import {
  type AcaoClienteState,
  type CadastroClienteState,
  campos,
  camposTexto,
  clienteSchema,
  idSchema,
  idsSchema,
} from "./schema";

/** Revalida a landing, o admin geral e a listagem de clientes. */
function revalidarClientes() {
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/clientes");
}

/** Violação da FK `logo_id` (23503): a mídia escolhida não existe mais na biblioteca. */
function logoInvalido(error: { code?: string; message: string }) {
  return error.code === "23503" && error.message.includes("logo_id");
}

export async function criarCliente(
  _estadoAnterior: CadastroClienteState,
  formData: FormData,
): Promise<CadastroClienteState> {
  const { supabase } = await requireAdmin();
  const resultado = clienteSchema.safeParse({
    nome: formData.get("nome"),
    logo: formData.get("logoId"),
    status: formData.get("status"),
  });

  if (!resultado.success) {
    return {
      erros: errosPorCampo(resultado.error, campos),
      values: lerCampos(formData, camposTexto),
    };
  }

  const { error: erroInsercao } = await inserirCliente(supabase, {
    nome: resultado.data.nome,
    logo_id: resultado.data.logo,
    status: resultado.data.status,
  });

  if (erroInsercao) {
    if (erroInsercao.code === "23505") {
      return { erro: "Já existe um cliente com esse nome." };
    }

    if (logoInvalido(erroInsercao)) {
      return {
        erros: { logo: "Logo não encontrado." },
        values: lerCampos(formData, camposTexto),
      };
    }

    return { erro: "Não foi possível criar o cliente. Tente novamente." };
  }

  revalidarClientes();
  redirect("/admin/clientes?feedback=criado");
}

export async function atualizarCliente(
  _estadoAnterior: CadastroClienteState,
  formData: FormData,
): Promise<CadastroClienteState> {
  const { supabase } = await requireAdmin();
  const idValido = idSchema.safeParse(formData.get("id"));

  if (!idValido.success) return { erro: "Cliente inválido." };

  const resultado = clienteSchema.safeParse({
    nome: formData.get("nome"),
    logo: formData.get("logoId"),
    status: formData.get("status"),
  });

  if (!resultado.success) {
    return {
      erros: errosPorCampo(resultado.error, campos),
      values: lerCampos(formData, camposTexto),
    };
  }

  const { data: cliente, error: erroCliente } = await buscarClientePorId(
    supabase,
    idValido.data,
  );

  if (erroCliente) {
    console.error(
      "[clientes] falha ao buscar cliente para atualizar",
      erroCliente,
    );
    return {
      erro: "Não foi possível atualizar o cliente. Tente novamente.",
      values: lerCampos(formData, camposTexto),
    };
  }

  if (!cliente) return { erro: "Cliente não encontrado." };

  const { error: erroAtualizacao } = await atualizarClienteBanco(
    supabase,
    cliente.id,
    {
      nome: resultado.data.nome,
      logo_id: resultado.data.logo,
      status: resultado.data.status,
    },
  );

  if (erroAtualizacao) {
    if (erroAtualizacao.code === "23505") {
      return { erro: "Já existe um cliente com esse nome." };
    }

    if (logoInvalido(erroAtualizacao)) {
      return {
        erros: { logo: "Logo não encontrado." },
        values: lerCampos(formData, camposTexto),
      };
    }

    return { erro: "Não foi possível atualizar o cliente. Tente novamente." };
  }

  revalidarClientes();
  redirect("/admin/clientes?feedback=atualizado");
}

export async function excluirCliente(
  _estadoAnterior: CadastroClienteState,
  formData: FormData,
): Promise<CadastroClienteState> {
  const { supabase } = await requireAdmin();
  const idValido = idSchema.safeParse(formData.get("id"));

  if (!idValido.success) {
    return { erro: "Cliente inválido." };
  }

  const { data: cliente, error: erroCliente } = await buscarClientePorId(
    supabase,
    idValido.data,
  );

  if (erroCliente) {
    console.error(
      "[clientes] falha ao buscar cliente para excluir",
      erroCliente,
    );
    return { erro: "Não foi possível excluir o cliente. Tente novamente." };
  }

  if (!cliente) return { erro: "Cliente não encontrado." };

  const { error: erroExclusao } = await excluirClienteBanco(
    supabase,
    cliente.id,
  );

  if (erroExclusao) {
    // 23503: há projetos (conteudos) vinculados, com on delete restrict.
    if (erroExclusao.code === "23503") {
      return {
        erro: "Este cliente tem projetos vinculados. Exclua ou mova os projetos antes de excluir o cliente.",
      };
    }

    console.error("[clientes] falha ao excluir cliente", erroExclusao);
    return { erro: "Não foi possível excluir o cliente. Tente novamente." };
  }

  // O logo continua na biblioteca: excluir o cliente não apaga o arquivo.
  revalidarClientes();
  redirect("/admin/clientes?feedback=excluido");
}

/** Regrava `ordem` como 0, 1, 2… na sequência enviada, numa única operação no banco (função `reordenar_clientes`). */
export async function reordenarClientes(
  ids: string[],
): Promise<AcaoClienteState> {
  const { supabase } = await requireAdmin();
  const idsValidos = idsSchema.safeParse(ids);

  if (!idsValidos.success) return { erro: "Ordem inválida." };

  const { error: erroReordenacao } = await reordenarClientesBanco(
    supabase,
    idsValidos.data,
  );

  // Revalida também em caso de erro: se a lista estiver defasada, a tela volta a mostrar a ordem do banco.
  revalidarClientes();

  if (erroReordenacao) {
    return {
      erro:
        erroReordenacao.message === "lista de ordem invalida"
          ? "A lista de clientes mudou. Atualize a página e tente novamente."
          : "Não foi possível reordenar os clientes. Tente novamente.",
    };
  }

  return {};
}
