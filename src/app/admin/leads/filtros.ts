import { z } from "zod";

import type { StatusLead } from "./rotulos";

export const PORCAO_LEADS = 25;

export const OPCOES_STATUS_LEAD = [
  { valor: "todos", rotulo: "Todos" },
  { valor: "novo", rotulo: "Novos" },
  { valor: "em_contato", rotulo: "Em contato" },
  { valor: "convertido", rotulo: "Convertidos" },
  { valor: "arquivado", rotulo: "Arquivados" },
] as const;

export type FiltroStatusLead = (typeof OPCOES_STATUS_LEAD)[number]["valor"];

export type FiltrosLeads = {
  status: FiltroStatusLead;
  q: string;
  pagina: number;
  selecionado?: string;
};

type ParamsLeads = Record<string, string | string[] | undefined>;

function primeiro(valor: string | string[] | undefined) {
  return Array.isArray(valor) ? valor[0] : valor;
}

export function lerFiltrosLeads(params: ParamsLeads): FiltrosLeads {
  const opcao = OPCOES_STATUS_LEAD.find(
    (item) => item.valor === primeiro(params.status),
  );
  const pagina = Number(primeiro(params.pagina));
  const selecionado = primeiro(params.selecionado);

  return {
    status: opcao?.valor ?? "todos",
    q: (primeiro(params.q) ?? "").trim().slice(0, 100),
    pagina: Number.isInteger(pagina) && pagina >= 1 ? pagina : 1,
    selecionado: z.uuid().safeParse(selecionado).success
      ? selecionado
      : undefined,
  };
}

/** Monta a URL com os filtros preservados. Omite os valores padrão. */
export function hrefLeads(
  filtros: Partial<FiltrosLeads>,
  base = "/admin/leads",
) {
  const params = new URLSearchParams();

  if (filtros.status && filtros.status !== "todos") {
    params.set("status", filtros.status);
  }
  if (filtros.q) params.set("q", filtros.q);
  if (filtros.pagina && filtros.pagina > 1) {
    params.set("pagina", String(filtros.pagina));
  }
  if (filtros.selecionado) params.set("selecionado", filtros.selecionado);

  const query = params.toString();
  return query ? `${base}?${query}` : base;
}

/** Status incluídos pelo filtro. "Todos" deixa de fora os arquivados. */
export function statusDoFiltro(status: FiltroStatusLead): StatusLead[] {
  if (status === "todos") return ["novo", "em_contato", "convertido"];
  return [status];
}

/**
 * Escapa o termo para ILIKE: % e _ viram literais. Como o PostgREST lê o valor
 * entre aspas duplas, \ e " também são escapados nesse nível.
 */
function padraoIlike(termo: string) {
  const likeEscapado = termo.replace(/[\\%_]/g, "\\$&");
  const valor = `%${likeEscapado}%`;
  return `"${valor.replace(/[\\"]/g, "\\$&")}"`;
}

/** Filtro .or() de busca por nome, e-mail ou escola. */
export function filtroBuscaLeads(termo: string) {
  const padrao = padraoIlike(termo);
  return ["nome", "email", "escola"]
    .map((coluna) => `${coluna}.ilike.${padrao}`)
    .join(",");
}
