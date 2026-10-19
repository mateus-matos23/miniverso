"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { hashVisitante, ipDaRequisicao } from "@/lib/telemetria";
import { criarClienteServidor } from "@/utils/supabase/admin";

const interesses = [
  "implantacao",
  "projeto_personalizado",
  "parceria",
  "outro",
] as const;

const contatoSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(2, "O nome deve ter pelo menos 2 caracteres.")
    .max(120, "O nome deve ter no máximo 120 caracteres."),
  email: z
    .string()
    .trim()
    .max(200, "O e-mail deve ter no máximo 200 caracteres.")
    .pipe(z.email({ error: "Informe um e-mail válido." })),
  escola: z
    .string()
    .trim()
    .max(160, "A escola deve ter no máximo 160 caracteres.")
    .optional(),
  cargo: z
    .string()
    .trim()
    .max(80, "O cargo deve ter no máximo 80 caracteres.")
    .optional(),
  interesse: z.enum(interesses, {
    error: "Escolha o seu interesse.",
  }),
  mensagem: z
    .string()
    .trim()
    .min(10, "A mensagem deve ter pelo menos 10 caracteres.")
    .max(2000, "A mensagem deve ter no máximo 2000 caracteres."),
  // Honeypot: campo escondido do formulário, que pessoas não preenchem.
  site: z.string().max(200).optional(),
  utm_source: z.string().max(100).optional(),
  utm_medium: z.string().max(100).optional(),
  utm_campaign: z.string().max(100).optional(),
  pagina: z.string().max(200).optional(),
});

type DadosContato = z.infer<typeof contatoSchema>;

/** Campos visíveis do formulário, usados nas mensagens de erro e no preenchimento. */
export type CampoContato =
  | "nome"
  | "email"
  | "escola"
  | "cargo"
  | "interesse"
  | "mensagem";

export type EstadoContato = {
  ok?: boolean;
  erro?: string;
  erros?: Partial<Record<CampoContato, string>>;
  /** Valores digitados, devolvidos em caso de erro para não limpar o formulário. */
  values?: Partial<Record<CampoContato, string>>;
};

const camposVisiveis: CampoContato[] = [
  "nome",
  "email",
  "escola",
  "cargo",
  "interesse",
  "mensagem",
];

function valoresDigitados(formData: FormData) {
  const valores: Partial<Record<CampoContato, string>> = {};

  for (const campo of camposVisiveis) {
    valores[campo] = String(formData.get(campo) ?? "");
  }

  return valores;
}

function formatarErros(error: z.ZodError): EstadoContato["erros"] {
  const erros: NonNullable<EstadoContato["erros"]> = {};

  for (const issue of error.issues) {
    const campo = issue.path[0];

    if (
      typeof campo === "string" &&
      camposVisiveis.includes(campo as CampoContato)
    ) {
      erros[campo as CampoContato] ??= issue.message;
    }
  }

  return erros;
}

/**
 * Grava uma mensagem do formulário de contato pela função `registrar_lead`.
 * O honeypot preenchido devolve sucesso sem gravar nada.
 */
export async function enviarContato(
  _estadoAnterior: EstadoContato,
  formData: FormData,
): Promise<EstadoContato> {
  const valores = valoresDigitados(formData);

  const resultado = contatoSchema.safeParse({
    ...valores,
    site: formData.get("site") ?? undefined,
    utm_source: formData.get("utm_source") ?? undefined,
    utm_medium: formData.get("utm_medium") ?? undefined,
    utm_campaign: formData.get("utm_campaign") ?? undefined,
    pagina: formData.get("pagina") ?? undefined,
  });

  if (!resultado.success) {
    return { erros: formatarErros(resultado.error), values: valores };
  }

  const dados: DadosContato = resultado.data;

  if (dados.site) {
    return { ok: true };
  }

  const cabecalhos = await headers();
  const ipHash = hashVisitante({
    ip: ipDaRequisicao(cabecalhos),
    userAgent: cabecalhos.get("user-agent") ?? "",
  });

  const { error } = await criarClienteServidor().rpc("registrar_lead", {
    p_nome: dados.nome,
    p_email: dados.email,
    p_escola: dados.escola ?? "",
    p_cargo: dados.cargo ?? "",
    p_interesse: dados.interesse,
    p_mensagem: dados.mensagem,
    p_utm_source: dados.utm_source ?? "",
    p_utm_medium: dados.utm_medium ?? "",
    p_utm_campaign: dados.utm_campaign ?? "",
    p_pagina: dados.pagina ?? "",
    p_ip_hash: ipHash,
  });

  if (error) {
    if (error.message.includes("limite_excedido")) {
      return {
        erro: "Recebemos muitas mensagens deste dispositivo. Tente novamente mais tarde ou fale por e-mail.",
        values: valores,
      };
    }

    console.error("[contato] falha ao registrar o lead", error);

    return {
      erro: "Não foi possível enviar sua mensagem agora. Tente novamente.",
      values: valores,
    };
  }

  return { ok: true };
}
