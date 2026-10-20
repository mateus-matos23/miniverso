import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/database";
import {
  type FiltrosLeads,
  filtroBuscaLeads,
  PORCAO_LEADS,
  statusDoFiltro,
} from "./filters";
import { STATUS_LEAD, type StatusLead } from "./schema";

type Supabase = SupabaseClient<Database>;
type ParametrosRegistroLead =
  Database["public"]["Functions"]["registrar_lead"]["Args"];

const COLUNAS_LISTA = "id,nome,escola,interesse,status,criado_em";
const COLUNAS_EXPORTACAO =
  "criado_em,nome,email,escola,cargo,interesse,status,mensagem,utm_source,utm_medium,utm_campaign";

/** Consulta só a contagem de um status: não traz as linhas. */
export function contarLeadsComStatus(supabase: Supabase, status: StatusLead) {
  return supabase
    .from("leads")
    .select("id", { count: "exact", head: true })
    .eq("status", status);
}

/** Quantidade de leads por status, na ordem de `STATUS_LEAD`. Devolve o primeiro erro encontrado. */
export async function contarLeadsPorStatus(supabase: Supabase) {
  const resultados = await Promise.all(
    STATUS_LEAD.map((status) => contarLeadsComStatus(supabase, status)),
  );
  const erro = resultados.find((resultado) => resultado.error)?.error ?? null;

  if (erro) return { data: null, error: erro };

  const porStatus = Object.fromEntries(
    STATUS_LEAD.map((status, indice) => [
      status,
      resultados[indice].count ?? 0,
    ]),
  ) as Record<StatusLead, number>;

  return { data: porStatus, error: null };
}

/** Quantidade de leads com status "novo", para badges de menu e avisos. */
export async function contarLeadsNovos(supabase: Supabase): Promise<number> {
  const { count, error } = await contarLeadsComStatus(supabase, "novo");

  if (error) throw error;

  return count ?? 0;
}

/** Página da lista de leads, já filtrada e ordenada, com a contagem total. */
export function listarLeads(supabase: Supabase, filtros: FiltrosLeads) {
  let consulta = supabase
    .from("leads")
    .select(COLUNAS_LISTA, { count: "exact" })
    .in("status", statusDoFiltro(filtros.status));

  if (filtros.q) consulta = consulta.or(filtroBuscaLeads(filtros.q));

  const inicio = (filtros.pagina - 1) * PORCAO_LEADS;

  return consulta
    .order("criado_em", { ascending: false })
    .order("id", { ascending: false })
    .range(inicio, inicio + PORCAO_LEADS - 1);
}

/** Um lote da exportação CSV, na mesma ordem e filtro da lista. */
export function listarLeadsParaExportacao(
  supabase: Supabase,
  filtros: FiltrosLeads,
  inicio: number,
  lote: number,
) {
  let consulta = supabase
    .from("leads")
    .select(COLUNAS_EXPORTACAO)
    .in("status", statusDoFiltro(filtros.status));

  if (filtros.q) consulta = consulta.or(filtroBuscaLeads(filtros.q));

  return consulta
    .order("criado_em", { ascending: false })
    .order("id", { ascending: false })
    .range(inicio, inicio + lote - 1);
}

/** Últimos leads recebidos, para o bloco do dashboard. */
export function listarUltimosLeads(supabase: Supabase) {
  return supabase
    .from("leads")
    .select("id, nome, escola, interesse, criado_em")
    .order("criado_em", { ascending: false })
    .limit(5);
}

export function buscarLeadPorId(supabase: Supabase, id: string) {
  return supabase.from("leads").select("*").eq("id", id).maybeSingle();
}

export function atualizarStatusLeadBanco(
  supabase: Supabase,
  id: string,
  status: StatusLead,
) {
  return supabase.from("leads").update({ status }).eq("id", id);
}

export function atualizarNotasLeadBanco(
  supabase: Supabase,
  id: string,
  notas: string,
) {
  return supabase.from("leads").update({ notas }).eq("id", id);
}

export function excluirLeadBanco(supabase: Supabase, id: string) {
  return supabase.from("leads").delete().eq("id", id);
}

/** Grava o contato pela função `registrar_lead`, que também aplica o limite por dispositivo. */
export function registrarLead(
  supabase: Supabase,
  parametros: ParametrosRegistroLead,
) {
  return supabase.rpc("registrar_lead", parametros);
}
