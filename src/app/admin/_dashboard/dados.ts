import type { createClient } from "@/utils/supabase/server";
import {
  type Metricas,
  metricasSchema,
  type VersaoVitalsLinha,
  versaoVitalsLinhaSchema,
  type WebVitalsLinha,
  webVitalsLinhaSchema,
} from "./schemas";

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

export async function contarLeadsNovos(supabase: Supabase) {
  const { count, error } = await supabase
    .from("leads")
    .select("id", { count: "exact", head: true })
    .eq("status", "novo");

  if (error) throw error;
  return count ?? 0;
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
  const [clientes, projetos, midias] = await Promise.all([
    supabase.from("clientes").select("status"),
    supabase.from("conteudos").select("status"),
    supabase.from("midias").select("id", { count: "exact", head: true }),
  ]);

  if (clientes.error) throw clientes.error;
  if (projetos.error) throw projetos.error;
  if (midias.error) throw midias.error;

  const clientesLista = clientes.data ?? [];
  const projetosLista = projetos.data ?? [];

  return {
    clientes: {
      total: clientesLista.length,
      publicados: clientesLista.filter(
        (cliente) => cliente.status === "published",
      ).length,
    },
    projetos: {
      total: projetosLista.length,
      publicados: projetosLista.filter(
        (projeto) => projeto.status === "published",
      ).length,
    },
    midias: midias.count ?? 0,
  };
}

export type ResumoDeConteudo = Awaited<ReturnType<typeof buscarResumoConteudo>>;

export async function buscarUltimosLeads(supabase: Supabase) {
  const { data, error } = await supabase
    .from("leads")
    .select("id, nome, escola, interesse, criado_em")
    .order("criado_em", { ascending: false })
    .limit(5);

  if (error) throw error;
  return data ?? [];
}

export type UltimoLead = Awaited<ReturnType<typeof buscarUltimosLeads>>[number];
