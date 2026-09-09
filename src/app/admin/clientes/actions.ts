"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth";
import type { ClienteRow } from "@/utils/supabase/database";

const bucket = "miniverso";

const camposCliente = {
  nome: z
    .string({ error: "Informe o nome do cliente." })
    .trim()
    .min(2, "O nome deve ter pelo menos 2 caracteres.")
    .max(120, "O nome deve ter no máximo 120 caracteres."),
  status: z.enum(["draft", "published"], {
    error: "Selecione um status válido.",
  }),
  ordem: z
    .string({ error: "Informe a ordem." })
    .trim()
    .regex(/^\d+$/, "A ordem deve ser um número inteiro não negativo.")
    .transform(Number)
    .pipe(z.number().int().min(0)),
};

const logoSchema = z
  .file({ error: "Selecione o logo do cliente." })
  .min(1, "O arquivo do logo está vazio.")
  .max(5_000_000, "O logo deve ter no máximo 5 MB.")
  .mime(["image/jpeg", "image/png", "image/webp"]);

const clienteSchema = z.object({ ...camposCliente, logo: logoSchema });
const atualizarClienteSchema = z.object({
  id: z.string().min(1, "Cliente inválido."),
  ...camposCliente,
  logo: logoSchema.optional(),
});

export type Cliente = ClienteRow;

export type CadastroClienteState = {
  erro?: string;
  erros?: {
    nome?: string;
    logo?: string;
    status?: string;
    ordem?: string;
  };
};

function formatarErros(error: z.ZodError): CadastroClienteState["erros"] {
  const erros: CadastroClienteState["erros"] = {};

  for (const issue of error.issues) {
    const campo = issue.path[0];

    if (
      campo === "nome" ||
      campo === "logo" ||
      campo === "status" ||
      campo === "ordem"
    ) {
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
  _previousState: CadastroClienteState,
  formData: FormData,
): Promise<CadastroClienteState> {
  const result = clienteSchema.safeParse({
    nome: formData.get("nome"),
    logo: logoDoFormulario(formData),
    status: formData.get("status"),
    ordem: formData.get("ordem"),
  });

  if (!result.success) {
    return { erros: formatarErros(result.error) };
  }

  const { supabase } = await requireAdmin();
  const extensao = extensaoDoLogo(result.data.logo.type);

  if (!extensao) {
    return { erro: "Formato de logo não suportado." };
  }

  const caminhoLogo = `clientes/${crypto.randomUUID()}.${extensao}`;
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(caminhoLogo, result.data.logo, {
      contentType: result.data.logo.type,
      upsert: false,
    });

  if (uploadError) {
    return { erro: "Não foi possível enviar o logo. Tente novamente." };
  }

  const { error: insertError } = await supabase.from("clientes").insert({
    nome: result.data.nome,
    caminho_logo: caminhoLogo,
    status: result.data.status,
    ordem: result.data.ordem,
  });

  if (insertError) {
    await supabase.storage.from(bucket).remove([caminhoLogo]);

    if (insertError.code === "23505") {
      return { erro: "Já existe um cliente com esse nome." };
    }

    return { erro: "Não foi possível criar o cliente. Tente novamente." };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/clientes");
  redirect("/admin/clientes");
}

export async function atualizarCliente(
  _previousState: CadastroClienteState,
  formData: FormData,
): Promise<CadastroClienteState> {
  const result = atualizarClienteSchema.safeParse({
    id: formData.get("id"),
    nome: formData.get("nome"),
    logo: logoDoFormulario(formData),
    status: formData.get("status"),
    ordem: formData.get("ordem"),
  });

  if (!result.success) {
    return { erros: formatarErros(result.error) };
  }

  const { supabase } = await requireAdmin();
  const { data: cliente, error: clienteError } = await supabase
    .from("clientes")
    .select("id,caminho_logo")
    .eq("id", result.data.id)
    .returns<Pick<Cliente, "id" | "caminho_logo">>()
    .maybeSingle<Pick<Cliente, "id" | "caminho_logo">>();

  if (clienteError) throw clienteError;
  if (!cliente) return { erro: "Cliente não encontrado." };

  let caminhoLogo = cliente.caminho_logo;
  let novoCaminhoLogo: string | undefined;

  if (result.data.logo) {
    const extensao = extensaoDoLogo(result.data.logo.type);

    if (!extensao) {
      return { erro: "Formato de logo não suportado." };
    }

    novoCaminhoLogo = `clientes/${crypto.randomUUID()}.${extensao}`;
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(novoCaminhoLogo, result.data.logo, {
        contentType: result.data.logo.type,
        upsert: false,
      });

    if (uploadError) {
      return { erro: "Não foi possível enviar o logo. Tente novamente." };
    }

    caminhoLogo = novoCaminhoLogo;
  }

  const { error: updateError } = await supabase
    .from("clientes")
    .update({
      nome: result.data.nome,
      caminho_logo: caminhoLogo,
      status: result.data.status,
      ordem: result.data.ordem,
    })
    .eq("id", cliente.id);

  if (updateError) {
    if (novoCaminhoLogo) {
      await supabase.storage.from(bucket).remove([novoCaminhoLogo]);
    }

    if (updateError.code === "23505") {
      return { erro: "Já existe um cliente com esse nome." };
    }

    return { erro: "Não foi possível atualizar o cliente. Tente novamente." };
  }

  if (novoCaminhoLogo) {
    await supabase.storage.from(bucket).remove([cliente.caminho_logo]);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/clientes");
  redirect("/admin/clientes");
}

export async function excluirCliente(
  _previousState: CadastroClienteState,
  formData: FormData,
): Promise<CadastroClienteState> {
  const id = z
    .string()
    .min(1, "Cliente inválido.")
    .safeParse(formData.get("id"));

  if (!id.success) {
    return { erro: "Cliente inválido." };
  }

  const { supabase } = await requireAdmin();
  const { data: cliente, error: clienteError } = await supabase
    .from("clientes")
    .select("id,caminho_logo")
    .eq("id", id.data)
    .returns<Pick<Cliente, "id" | "caminho_logo">>()
    .maybeSingle<Pick<Cliente, "id" | "caminho_logo">>();

  if (clienteError) throw clienteError;
  if (!cliente) return { erro: "Cliente não encontrado." };

  const { error: deleteError } = await supabase
    .from("clientes")
    .delete()
    .eq("id", cliente.id);

  if (deleteError) throw deleteError;

  await supabase.storage.from(bucket).remove([cliente.caminho_logo]);
  revalidatePath("/admin");
  revalidatePath("/admin/clientes");
  redirect("/admin/clientes");
}
