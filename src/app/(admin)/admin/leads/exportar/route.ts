import type { NextRequest } from "next/server";
import { requireAdmin } from "@/features/auth/require-admin";
import { listarLeadsParaExportacao } from "@/features/leads/data";
import { type FiltrosLeads, lerFiltrosLeads } from "@/features/leads/filters";
import {
  rotulosInteresseLead,
  rotulosStatusLead,
} from "@/features/leads/labels";
import type { StatusLead } from "@/features/leads/schema";
import { diaNoFuso, formatarDataHora } from "@/lib/format";

const cabecalho = [
  "Data",
  "Nome",
  "E-mail",
  "Escola",
  "Cargo",
  "Interesse",
  "Status",
  "Mensagem",
  "utm_source",
  "utm_medium",
  "utm_campaign",
];

const lote = 1000;

/**
 * Célula CSV: valores que o Excel poderia executar como fórmula ganham "'"
 * na frente. Todas as células vão entre aspas, com aspas internas dobradas.
 */
function celula(valor: string | null | undefined) {
  let texto = valor ?? "";

  if (/^[=+\-@\t\r]/.test(texto)) texto = `'${texto}`;

  return `"${texto.replaceAll('"', '""')}"`;
}

function linha(valores: (string | null | undefined)[]) {
  return valores.map(celula).join(";");
}

export async function GET(request: NextRequest) {
  const { supabase } = await requireAdmin();
  const filtros: FiltrosLeads = lerFiltrosLeads(
    Object.fromEntries(request.nextUrl.searchParams),
  );

  const linhas: string[] = [linha(cabecalho)];

  // O PostgREST devolve no máximo 1000 linhas por requisição: pagina até acabar.
  for (let inicio = 0; ; inicio += lote) {
    const { data, error } = await listarLeadsParaExportacao(
      supabase,
      filtros,
      inicio,
      lote,
    );

    if (error) throw error;

    for (const lead of data ?? []) {
      linhas.push(
        linha([
          formatarDataHora(lead.criado_em),
          lead.nome,
          lead.email,
          lead.escola,
          lead.cargo,
          rotulosInteresseLead[lead.interesse] ?? lead.interesse,
          rotulosStatusLead[lead.status as StatusLead] ?? lead.status,
          lead.mensagem,
          lead.utm_source,
          lead.utm_medium,
          lead.utm_campaign,
        ]),
      );
    }

    if ((data?.length ?? 0) < lote) break;
  }

  const data = diaNoFuso(new Date());
  // BOM UTF-8 para o Excel reconhecer os acentos; CRLF como no RFC 4180.
  const corpo = `\uFEFF${linhas.join("\r\n")}\r\n`;

  return new Response(corpo, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="leads-${data}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
