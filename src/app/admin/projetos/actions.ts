"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth";

const bucket = "miniverso";
const IMAGE_MAX = 10 * 1024 * 1024;
const VIDEO_MAX = 50 * 1024 * 1024;
const imageTypes = ["image/jpeg", "image/png", "image/webp"];
const videoTypes = ["video/mp4", "video/webm"];

const camposConteudo = {
  titulo: z
    .string({ error: "Informe o título." })
    .trim()
    .min(1, "Informe o título.")
    .max(90, "O título deve ter no máximo 90 caracteres."),
  slug: z
    .string({ error: "Informe o slug." })
    .trim()
    .min(1, "Informe o slug.")
    .max(120, "O slug deve ter no máximo 120 caracteres.")
    .regex(
      /^[a-z0-9]+(-[a-z0-9]+)*$/,
      "Use apenas letras minúsculas, números e hifens.",
    ),
  categoria: z
    .string()
    .trim()
    .max(60, "A categoria deve ter no máximo 60 caracteres.")
    .optional(),
  clienteId: z.uuid({ error: "Selecione o cliente." }),
  descricao: z
    .string({ error: "Informe a descrição." })
    .trim()
    .min(1, "Informe a descrição.")
    .max(400, "A descrição deve ter no máximo 400 caracteres."),
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

const midiaSchema = z
  .file({ error: "Selecione uma imagem ou um vídeo." })
  .min(1, "O arquivo da mídia está vazio.")
  .max(VIDEO_MAX, "A mídia deve ter no máximo 50 MB.")
  .mime([...imageTypes, ...videoTypes]);

const conteudoSchema = z.object({ ...camposConteudo, midia: midiaSchema });
const atualizarConteudoSchema = z.object({
  ...camposConteudo,
  midia: midiaSchema.optional(),
});
const idSchema = z.uuid({ error: "Projeto inválido." });
const idsSchema = z.array(idSchema);

const campos = [
  "titulo",
  "slug",
  "categoria",
  "clienteId",
  "descricao",
  "status",
  "ordem",
  "midia",
] as const;

export type CampoConteudo = (typeof campos)[number];

export type CadastroConteudoState = {
  erro?: string;
  /** Valores digitados, devolvidos em caso de erro para não limpar o formulário. */
  values?: Partial<Record<Exclude<CampoConteudo, "midia">, string>>;
  erros?: Partial<Record<CampoConteudo, string>>;
};

export type AcaoConteudoState = { erro?: string };

function valoresDigitados(formData: FormData) {
  return {
    titulo: String(formData.get("titulo") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    categoria: String(formData.get("categoria") ?? ""),
    clienteId: String(formData.get("clienteId") ?? ""),
    descricao: String(formData.get("descricao") ?? ""),
    status: String(formData.get("status") ?? ""),
    ordem: String(formData.get("ordem") ?? ""),
  };
}

function formatarErros(error: z.ZodError): CadastroConteudoState["erros"] {
  const erros: NonNullable<CadastroConteudoState["erros"]> = {};

  for (const issue of error.issues) {
    const campo = issue.path[0];

    if (
      typeof campo === "string" &&
      (campos as readonly string[]).includes(campo)
    ) {
      erros[campo as CampoConteudo] ??= issue.message;
    }
  }

  return erros;
}

function extensaoDaMidia(tipo: string) {
  if (tipo === "image/jpeg") return "jpg";
  if (tipo === "image/png") return "png";
  if (tipo === "image/webp") return "webp";
  if (tipo === "video/mp4") return "mp4";
  if (tipo === "video/webm") return "webm";
  return undefined;
}

function midiaDoFormulario(formData: FormData) {
  const midia = formData.get("midia");
  return midia instanceof File && midia.size > 0 ? midia : undefined;
}

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
  const { data, error } = await supabase
    .from("clientes")
    .select("id")
    .eq("id", clienteId)
    .maybeSingle();

  if (error) {
    console.error("[projetos] falha ao verificar cliente", error);
    return null;
  }

  return Boolean(data);
}

/** Valida tipo e tamanho da mídia enviada. Devolve a mensagem de erro, se houver. */
function erroDaMidia(midia: File) {
  if (imageTypes.includes(midia.type) && midia.size > IMAGE_MAX) {
    return "A imagem deve ter no máximo 10 MB.";
  }

  return undefined;
}

export async function criarConteudo(
  _previousState: CadastroConteudoState,
  formData: FormData,
): Promise<CadastroConteudoState> {
  const result = conteudoSchema.safeParse({
    titulo: formData.get("titulo"),
    slug: formData.get("slug"),
    categoria: formData.get("categoria"),
    clienteId: formData.get("clienteId"),
    descricao: formData.get("descricao"),
    status: formData.get("status"),
    ordem: formData.get("ordem"),
    midia: midiaDoFormulario(formData),
  });

  if (!result.success) {
    return {
      erros: formatarErros(result.error),
      values: valoresDigitados(formData),
    };
  }

  const { midia, ...dados } = result.data;
  const erroMidia = erroDaMidia(midia);

  if (erroMidia) {
    return { erros: { midia: erroMidia }, values: valoresDigitados(formData) };
  }

  const tipoMidia = imageTypes.includes(midia.type) ? "imagem" : "video";
  const extensao = extensaoDaMidia(midia.type);

  if (!extensao) {
    return { erro: "Formato de mídia não suportado." };
  }

  const { supabase } = await requireAdmin();

  const existeCliente = await clienteExiste(supabase, dados.clienteId);

  if (existeCliente === null) {
    return {
      erro: "Não foi possível criar o projeto. Tente novamente.",
      values: valoresDigitados(formData),
    };
  }

  if (!existeCliente) {
    return {
      erros: { clienteId: "Cliente não encontrado." },
      values: valoresDigitados(formData),
    };
  }

  const caminhoMidia = `conteudos/${crypto.randomUUID()}.${extensao}`;
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(caminhoMidia, midia, {
      contentType: midia.type,
      upsert: false,
    });

  if (uploadError) {
    return { erro: "Não foi possível enviar a mídia. Tente novamente." };
  }

  const { error: insertError } = await supabase.from("conteudos").insert({
    titulo: dados.titulo,
    slug: dados.slug,
    categoria: dados.categoria || null,
    cliente_id: dados.clienteId,
    descricao: dados.descricao,
    tipo_midia: tipoMidia,
    caminho_midia: caminhoMidia,
    status: dados.status,
    ordem: dados.ordem,
  });

  if (insertError) {
    await supabase.storage.from(bucket).remove([caminhoMidia]);

    if (insertError.code === "23505") {
      return {
        erros: { slug: "Já existe um projeto com esse slug." },
        values: valoresDigitados(formData),
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
  const idValido = idSchema.safeParse(formData.get("id"));

  if (!idValido.success) return { erro: "Projeto inválido." };

  const result = atualizarConteudoSchema.safeParse({
    titulo: formData.get("titulo"),
    slug: formData.get("slug"),
    categoria: formData.get("categoria"),
    clienteId: formData.get("clienteId"),
    descricao: formData.get("descricao"),
    status: formData.get("status"),
    ordem: formData.get("ordem"),
    midia: midiaDoFormulario(formData),
  });

  if (!result.success) {
    return {
      erros: formatarErros(result.error),
      values: valoresDigitados(formData),
    };
  }

  const { midia, ...dados } = result.data;
  const erroMidia = midia ? erroDaMidia(midia) : undefined;

  if (erroMidia) {
    return { erros: { midia: erroMidia }, values: valoresDigitados(formData) };
  }

  const extensao = midia ? extensaoDaMidia(midia.type) : undefined;

  if (midia && !extensao) {
    return { erro: "Formato de mídia não suportado." };
  }

  const { supabase } = await requireAdmin();

  const { data: atual, error: atualError } = await supabase
    .from("conteudos")
    .select("id,slug,caminho_midia")
    .eq("id", idValido.data)
    .maybeSingle();

  if (atualError) {
    console.error(
      "[projetos] falha ao buscar projeto para atualizar",
      atualError,
    );
    return {
      erro: "Não foi possível salvar o projeto. Tente novamente.",
      values: valoresDigitados(formData),
    };
  }

  if (!atual) return { erro: "Projeto não encontrado." };

  const existeCliente = await clienteExiste(supabase, dados.clienteId);

  if (existeCliente === null) {
    return {
      erro: "Não foi possível salvar o projeto. Tente novamente.",
      values: valoresDigitados(formData),
    };
  }

  if (!existeCliente) {
    return {
      erros: { clienteId: "Cliente não encontrado." },
      values: valoresDigitados(formData),
    };
  }

  let caminhoMidia = atual.caminho_midia;
  let tipoMidia: "imagem" | "video" | undefined;
  let novoCaminhoMidia: string | undefined;

  if (midia && extensao) {
    novoCaminhoMidia = `conteudos/${crypto.randomUUID()}.${extensao}`;
    tipoMidia = imageTypes.includes(midia.type) ? "imagem" : "video";

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(novoCaminhoMidia, midia, {
        contentType: midia.type,
        upsert: false,
      });

    if (uploadError) {
      return { erro: "Não foi possível enviar a mídia. Tente novamente." };
    }

    caminhoMidia = novoCaminhoMidia;
  }

  const { error: updateError } = await supabase
    .from("conteudos")
    .update({
      titulo: dados.titulo,
      slug: dados.slug,
      categoria: dados.categoria || null,
      cliente_id: dados.clienteId,
      descricao: dados.descricao,
      caminho_midia: caminhoMidia,
      ...(tipoMidia ? { tipo_midia: tipoMidia } : {}),
      status: dados.status,
      ordem: dados.ordem,
    })
    .eq("id", atual.id);

  if (updateError) {
    if (novoCaminhoMidia) {
      await supabase.storage.from(bucket).remove([novoCaminhoMidia]);
    }

    if (updateError.code === "23505") {
      return {
        erros: { slug: "Já existe um projeto com esse slug." },
        values: valoresDigitados(formData),
      };
    }

    return { erro: "Não foi possível salvar o projeto. Tente novamente." };
  }

  // A mídia antiga só sai do storage depois que a linha já aponta para a nova.
  if (novoCaminhoMidia) {
    await supabase.storage.from(bucket).remove([atual.caminho_midia]);
  }

  revalidarConteudo(atual.slug, dados.slug);
  redirect("/admin/projetos?feedback=atualizado");
}

export async function alternarStatusConteudo(
  id: string,
): Promise<AcaoConteudoState> {
  const idValido = idSchema.safeParse(id);

  if (!idValido.success) return { erro: "Projeto inválido." };

  const { supabase } = await requireAdmin();
  const { data: atual, error: atualError } = await supabase
    .from("conteudos")
    .select("id,slug,status")
    .eq("id", idValido.data)
    .maybeSingle();

  if (atualError) {
    console.error(
      "[projetos] falha ao buscar projeto para alterar status",
      atualError,
    );
    return { erro: "Não foi possível alterar o status. Tente novamente." };
  }

  if (!atual) return { erro: "Projeto não encontrado." };

  const novoStatus = atual.status === "published" ? "draft" : "published";
  const { error: updateError } = await supabase
    .from("conteudos")
    .update({ status: novoStatus })
    .eq("id", atual.id);

  if (updateError) {
    return { erro: "Não foi possível alterar o status. Tente novamente." };
  }

  revalidarConteudo(atual.slug);
  return {};
}

/**
 * Regrava `ordem` como 0, 1, 2… na sequência enviada, numa única operação no banco
 * (função `reordenar_conteudos`). A lista precisa conter todos os projetos, sem repetição.
 */
export async function reordenarConteudos(
  ids: string[],
): Promise<AcaoConteudoState> {
  const idsValidos = idsSchema.safeParse(ids);

  if (!idsValidos.success) return { erro: "Ordem inválida." };

  const { supabase } = await requireAdmin();
  const { error } = await supabase.rpc("reordenar_conteudos", {
    p_ids: idsValidos.data,
  });

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
  const id = idSchema.safeParse(formData.get("id"));

  if (!id.success) {
    return { erro: "Projeto inválido." };
  }

  const { supabase } = await requireAdmin();
  const { data: conteudo, error: conteudoError } = await supabase
    .from("conteudos")
    .select("id,slug,caminho_midia")
    .eq("id", id.data)
    .maybeSingle();

  if (conteudoError) {
    console.error(
      "[projetos] falha ao buscar projeto para excluir",
      conteudoError,
    );
    return { erro: "Não foi possível excluir o projeto. Tente novamente." };
  }

  if (!conteudo) return { erro: "Projeto não encontrado." };

  const { error: deleteError } = await supabase
    .from("conteudos")
    .delete()
    .eq("id", conteudo.id);

  if (deleteError) {
    console.error("[projetos] falha ao excluir projeto", deleteError);
    return { erro: "Não foi possível excluir o projeto. Tente novamente." };
  }

  await supabase.storage.from(bucket).remove([conteudo.caminho_midia]);
  revalidarConteudo(conteudo.slug);
  redirect("/admin/projetos?feedback=excluido");
}
