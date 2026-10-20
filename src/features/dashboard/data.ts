import "server-only";

import { listarUltimosLeads } from "@/features/leads/data";
import type { createClient } from "@/lib/supabase/server";
import {
  type Metricas,
  metricasSchema,
  type VersaoVitalsLinha,
  versaoVitalsLinhaSchema,
  type WebVitalsLinha,
  webVitalsLinhaSchema,
} from "./schema";

type Supabase = ReturnType<typeof createClient>;

export type Resultado<T> = { ok: true; dados: T } | { ok: false };

/** Isola a falha de um bloco: o erro vai para o log e a página segue com os outros blocos. */
export async function seguro<T>(
  tarefa: () => PromiseLike<T>,
): Promise<Resultado<T>> {
  try {
    return { ok: true, dados: await tarefa() };
  } catch (erro) {
    console.error("[dashboard] falha ao carregar bloco", erro);
    return { ok: false };
  }
}

export async function temRascunhoPendente(supabase: Supabase) {
  const { count, error } = await supabase
    .from("landing_versoes")
    .select("id", { count: "exact", head: true })
    .eq("status", "draft");

  if (error) throw error;
  return (count ?? 0) > 0;
}

export async function buscarMetricas(
  supabase: Supabase,
  inicio: string,
  fim: string,
): Promise<Metricas> {
  const { data, error } = await supabase.rpc("metricas_resumo", {
    p_inicio: inicio,
    p_fim: fim,
  });

  if (error) throw error;
  return metricasSchema.parse(data);
}

export async function buscarWebVitals(
  supabase: Supabase,
  inicio: string,
  fim: string,
): Promise<WebVitalsLinha[]> {
  const { data, error } = await supabase.rpc("web_vitals_resumo", {
    p_inicio: inicio,
    p_fim: fim,
  });

  if (error) throw error;
  return webVitalsLinhaSchema.array().parse(data);
}

export async function buscarVitalsPorVersao(
  supabase: Supabase,
  inicio: string,
): Promise<VersaoVitalsLinha[]> {
  const { data, error } = await supabase.rpc("web_vitals_por_versao", {
    p_inicio: inicio,
  });

  if (error) throw error;
  return versaoVitalsLinhaSchema.array().parse(data);
}

export async function buscarResumoConteudo(supabase: Supabase) {
  const contagem = (tabela: "clientes" | "conteudos") =>
    supabase.from(tabela).select("id", { count: "exact", head: true });

  const [
    clientesTotal,
    clientesPublicados,
    projetosTotal,
    projetosPublicados,
    midias,
  ] = await Promise.all([
    contagem("clientes"),
    contagem("clientes").eq("status", "published"),
    contagem("conteudos"),
    contagem("conteudos").eq("status", "published"),
    supabase.from("midias").select("id", { count: "exact", head: true }),
  ]);

  for (const resultado of [
    clientesTotal,
    clientesPublicados,
    projetosTotal,
    projetosPublicados,
    midias,
  ]) {
    if (resultado.error) throw resultado.error;
  }

  return {
    clientes: {
      total: clientesTotal.count ?? 0,
      publicados: clientesPublicados.count ?? 0,
    },
    projetos: {
      total: projetosTotal.count ?? 0,
      publicados: projetosPublicados.count ?? 0,
    },
    midias: midias.count ?? 0,
  };
}

export type ResumoDeConteudo = Awaited<ReturnType<typeof buscarResumoConteudo>>;

export async function buscarUltimosLeads(supabase: Supabase) {
  const { data, error } = await listarUltimosLeads(supabase);

  if (error) throw error;
  return data ?? [];
}

export type UltimoLead = Awaited<ReturnType<typeof buscarUltimosLeads>>[number];
