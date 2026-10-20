import { cn } from "@/lib/utils";

import type { FiltrosLeads } from "../filters";
import type { StatusLead } from "../schema";
import { EstadoSemLeads, EstadoSemResultados } from "./lead-empty-states";
import type { LeadResumo } from "./lead-list";
import { ListaLeads } from "./lead-list";
import { PaginacaoLeads } from "./lead-pagination";
import { BuscaLeads } from "./lead-search-form";
import { NavStatusLeads } from "./lead-status-nav";

/** Coluna esquerda do admin: filtros, busca, lista e paginação. */
export function PainelListaLeads({
  filtros,
  leads,
  porStatus,
  totalGeral,
  totalAtivos,
  totalPaginas,
}: {
  filtros: FiltrosLeads;
  leads: LeadResumo[] | null;
  porStatus: Record<StatusLead, number>;
  totalGeral: number;
  totalAtivos: number;
  totalPaginas: number;
}) {
  return (
    <section
      aria-label="Lista de leads"
      className={cn(
        "flex min-w-0 flex-col gap-6",
        filtros.selecionado && "hidden lg:flex",
      )}
    >
      <div className="flex flex-col gap-3">
        <NavStatusLeads
          filtros={filtros}
          porStatus={porStatus}
          totalAtivos={totalAtivos}
        />
        <BuscaLeads filtros={filtros} />
      </div>

      {leads && leads.length > 0 ? (
        <>
          <ListaLeads
            filtros={filtros}
            leads={leads}
            selecionado={filtros.selecionado}
          />
          {totalPaginas > 1 ? (
            <PaginacaoLeads filtros={filtros} totalPaginas={totalPaginas} />
          ) : null}
        </>
      ) : totalGeral === 0 ? (
        <EstadoSemLeads />
      ) : (
        <EstadoSemResultados />
      )}
    </section>
  );
}
