import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminPage } from "@/components/admin/page-header";
import { requireAdmin } from "@/features/auth/require-admin";
import { DetalheLead } from "@/features/leads/components/lead-detail";
import { EstadoSemSelecao } from "@/features/leads/components/lead-empty-states";
import { PainelListaLeads } from "@/features/leads/components/lead-list-panel";
import { CabecalhoLeads } from "@/features/leads/components/leads-header";
import {
  buscarLeadPorId,
  contarLeadsPorStatus,
  listarLeads,
} from "@/features/leads/data";
import {
  hrefLeads,
  lerFiltrosLeads,
  totalDePaginas,
} from "@/features/leads/filters";
import type { LeadRow } from "@/lib/supabase/database";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Leads" };

export default async function LeadsPage({
  searchParams,
}: PageProps<"/admin/leads">) {
  const filtros = lerFiltrosLeads(await searchParams);
  const { supabase } = await requireAdmin();

  const contagens = await contarLeadsPorStatus(supabase);
  if (contagens.error) throw contagens.error;

  const porStatus = contagens.data;
  const totalGeral = Object.values(porStatus).reduce(
    (soma, quantidade) => soma + quantidade,
    0,
  );
  const totalAtivos =
    porStatus.novo + porStatus.em_contato + porStatus.convertido;

  const { data: leads, count, error } = await listarLeads(supabase, filtros);
  if (error) throw error;

  const totalPaginas = totalDePaginas(count ?? 0);

  // Página além do fim (ex.: lead excluído na última página): volta para a última.
  if (filtros.pagina > totalPaginas) {
    redirect(hrefLeads({ ...filtros, pagina: totalPaginas }));
  }

  let selecionado: LeadRow | null = null;

  if (filtros.selecionado) {
    const { data, error: erroSelecionado } = await buscarLeadPorId(
      supabase,
      filtros.selecionado,
    );

    if (erroSelecionado) throw erroSelecionado;
    selecionado = data;
  }

  const hrefLista = hrefLeads({ ...filtros, selecionado: undefined });
  const hrefExportacao = hrefLeads(
    { status: filtros.status, q: filtros.q },
    "/admin/leads/exportar",
  );

  return (
    <AdminPage ampla>
      <CabecalhoLeads
        hrefExportacao={hrefExportacao}
        porStatus={porStatus}
        totalGeral={totalGeral}
      />

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:items-start">
        <PainelListaLeads
          filtros={filtros}
          leads={leads}
          porStatus={porStatus}
          totalAtivos={totalAtivos}
          totalGeral={totalGeral}
          totalPaginas={totalPaginas}
        />

        <section
          aria-label="Detalhe do lead"
          className={cn("min-w-0", !filtros.selecionado && "hidden lg:block")}
        >
          {selecionado ? (
            <DetalheLead
              key={selecionado.id}
              lead={selecionado}
              voltarHref={hrefLista}
            />
          ) : (
            <EstadoSemSelecao />
          )}
        </section>
      </div>
    </AdminPage>
  );
}
