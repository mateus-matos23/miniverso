"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth";
import { BUCKET_PRIVADO } from "@/lib/storage";
import type { ClienteRow } from "@/utils/supabase/database";

const camposCliente = {
  nome: z
    .string({ error: "Informe o nome do cliente." })
    .trim()
    .min(2, "O nome deve ter pelo menos 2 caracteres.")
    .max(120, "O nome deve ter no máximo 120 caracteres."),
  status: z.enum(["draft", "published"], {
    error: "Selecione um status válido.",
  }),
};

const idSchema = z.uuid({ error: "Cliente inválido." });
const idsSchema = z.array(idSchema);

const logoSchema = z
  .file({ error: "Selecione o logo do cliente." })
  .min(1, "O arquivo do logo está vazio.")
  .max(5_000_000, "O logo deve ter no máximo 5 MB.")
  .mime(["image/jpeg", "image/png", "image/webp"]);

const clienteSchema = z.object({ ...camposCliente, logo: logoSchema });
const atualizarClienteSchema = z.object({
  ...camposCliente,
  logo: logoSchema.optional(),
});

/** Colunas que as telas do admin realmente carregam. */
export type Cliente = Pick<
  ClienteRow,
  "id" | "nome" | "caminho_logo" | "status" | "ordem"
>;

/** Revalida a landing, o admin geral e a listagem de clientes. */
function revalidarClientes() {
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/clientes");
}

function valoresDigitados(formData: FormData) {
  return {
    nome: String(formData.get("nome") ?? ""),
    status: String(formData.get("status") ?? ""),
  };
}

export type CadastroClienteState = {
  erro?: string;
  /** Valores digitados, devolvidos em caso de erro para não limpar o formulário. */
  values?: { nome?: string; status?: string };
  erros?: {
    nome?: string;
    logo?: string;
    status?: string;
  };
};

export type AcaoClienteState = { erro?: string };

function formatarErros(
  erroValidacao: z.ZodError,
): CadastroClienteState["erros"] {
  const erros: CadastroClienteState["erros"] = {};

  for (const issue of erroValidacao.issues) {
    const campo = issue.path[0];

    if (campo === "nome" || campo === "logo" || campo === "status") {
      erros[campo] ??= issue.message;
    }
  }

  return erros;
}

function extensaoDoLogo(tipo: string) {
  if (tipo === "image/jpeg") return "jpg";
  if (tipo === "image/png") return "png";
  if (tipo === "image/webp") return "webp";
  return undefined;
}

function logoDoFormulario(formData: FormData) {
  const logo = formData.get("logo");
  return logo instanceof File && logo.size > 0 ? logo : undefined;
}

export async function criarCliente(
  _estadoAnterior: CadastroClienteState,
  formData: FormData,
): Promise<CadastroClienteState> {
  const { supabase } = await requireAdmin();
  const resultado = clienteSchema.safeParse({
    nome: formData.get("nome"),
    logo: logoDoFormulario(formData),
    status: formData.get("status"),
  });

  if (!resultado.success) {
    return {
      erros: formatarErros(resultado.error),
      values: valoresDigitados(formData),
    };
  }

  const extensao = extensaoDoLogo(resultado.data.logo.type);

  if (!extensao) {
    return { erro: "Formato de logo não suportado." };
  }

  const caminhoLogo = `clientes/${crypto.randomUUID()}.${extensao}`;
  const { error: erroUpload } = await supabase.storage
    .from(BUCKET_PRIVADO)
    .upload(caminhoLogo, resultado.data.logo, {
      contentType: resultado.data.logo.type,
      upsert: false,
    });

  if (erroUpload) {
    return { erro: "Não foi possível enviar o logo. Tente novamente." };
  }

  const { error: erroInsercao } = await supabase.from("clientes").insert({
    nome: resultado.data.nome,
    caminho_logo: caminhoLogo,
    status: resultado.data.status,
  });

  if (erroInsercao) {
    await supabase.storage.from(BUCKET_PRIVADO).remove([caminhoLogo]);

    if (erroInsercao.code === "23505") {
      return { erro: "Já existe um cliente com esse nome." };
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

  const resultado = atualizarClienteSchema.safeParse({
    nome: formData.get("nome"),
    logo: logoDoFormulario(formData),
    status: formData.get("status"),
  });

  if (!resultado.success) {
    return {
      erros: formatarErros(resultado.error),
      values: valoresDigitados(formData),
    };
  }

  const { data: cliente, error: erroCliente } = await supabase
    .from("clientes")
    .select("id,caminho_logo")
    .eq("id", idValido.data)
    .maybeSingle();

  if (erroCliente) {
    console.error(
      "[clientes] falha ao buscar cliente para atualizar",
      erroCliente,
    );
    return {
      erro: "Não foi possível atualizar o cliente. Tente novamente.",
      values: valoresDigitados(formData),
    };
  }

  if (!cliente) return { erro: "Cliente não encontrado." };

  let caminhoLogo = cliente.caminho_logo;
  let novoCaminhoLogo: string | undefined;

  if (resultado.data.logo) {
    const extensao = extensaoDoLogo(resultado.data.logo.type);

    if (!extensao) {
      return { erro: "Formato de logo não suportado." };
    }

    novoCaminhoLogo = `clientes/${crypto.randomUUID()}.${extensao}`;
    const { error: erroUpload } = await supabase.storage
      .from(BUCKET_PRIVADO)
      .upload(novoCaminhoLogo, resultado.data.logo, {
        contentType: resultado.data.logo.type,
        upsert: false,
      });

    if (erroUpload) {
      return { erro: "Não foi possível enviar o logo. Tente novamente." };
    }

    caminhoLogo = novoCaminhoLogo;
  }

  const { error: erroAtualizacao } = await supabase
    .from("clientes")
    .update({
      nome: resultado.data.nome,
      caminho_logo: caminhoLogo,
      status: resultado.data.status,
    })
    .eq("id", cliente.id);

  if (erroAtualizacao) {
    if (novoCaminhoLogo) {
      await supabase.storage.from(BUCKET_PRIVADO).remove([novoCaminhoLogo]);
    }

    if (erroAtualizacao.code === "23505") {
      return { erro: "Já existe um cliente com esse nome." };
    }

    return { erro: "Não foi possível atualizar o cliente. Tente novamente." };
  }

  if (novoCaminhoLogo) {
    await supabase.storage.from(BUCKET_PRIVADO).remove([cliente.caminho_logo]);
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

  const { data: cliente, error: erroCliente } = await supabase
    .from("clientes")
    .select("id,caminho_logo")
    .eq("id", idValido.data)
    .maybeSingle();

  if (erroCliente) {
    console.error(
      "[clientes] falha ao buscar cliente para excluir",
      erroCliente,
    );
    return { erro: "Não foi possível excluir o cliente. Tente novamente." };
  }

  if (!cliente) return { erro: "Cliente não encontrado." };

  const { error: erroExclusao } = await supabase
    .from("clientes")
    .delete()
    .eq("id", cliente.id);

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

  await supabase.storage.from(BUCKET_PRIVADO).remove([cliente.caminho_logo]);
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

  const { error: erroReordenacao } = await supabase.rpc("reordenar_clientes", {
    p_ids: idsValidos.data,
  });

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
