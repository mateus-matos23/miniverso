"use server";

import { headers } from "next/headers";
import { hashVisitante, ipDaRequisicao } from "@/features/telemetry/visitor";
import { errosPorCampo, lerCampos } from "@/lib/form-data";
import { criarClienteServidor } from "@/lib/supabase/admin";
import { registrarLead } from "./data";
import {
  camposVisiveis,
  contatoSchema,
  type DadosContato,
  type EstadoContato,
} from "./schema";

/**
 * Grava uma mensagem do formulário de contato pela função `registrar_lead`.
 * O honeypot preenchido devolve sucesso sem gravar nada.
 */
export async function enviarContato(
  _estadoAnterior: EstadoContato,
  formData: FormData,
): Promise<EstadoContato> {
  const valores = lerCampos(formData, camposVisiveis);

  const resultado = contatoSchema.safeParse({
    ...valores,
    site: formData.get("site") ?? undefined,
    utm_source: formData.get("utm_source") ?? undefined,
    utm_medium: formData.get("utm_medium") ?? undefined,
    utm_campaign: formData.get("utm_campaign") ?? undefined,
    pagina: formData.get("pagina") ?? undefined,
  });

  if (!resultado.success) {
    return {
      erros: errosPorCampo(resultado.error, camposVisiveis),
      values: valores,
    };
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

  const { error } = await registrarLead(criarClienteServidor(), {
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
