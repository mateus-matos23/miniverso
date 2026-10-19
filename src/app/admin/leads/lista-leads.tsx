import Link from "next/link";

import { formatarDataHora, formatarRelativo } from "@/lib/formatar";
import { cn } from "@/lib/utils";
import type { LeadRow } from "@/utils/supabase/database";

import { type FiltrosLeads, hrefLeads } from "./filtros";
import { rotulosInteresseLead } from "./rotulos";
import { StatusLeadBadge } from "./status-lead-badge";

export type LeadResumo = Pick<
  LeadRow,
  "id" | "nome" | "escola" | "interesse" | "status" | "criado_em"
>;

export function ListaLeads({
  leads,
  filtros,
  selecionado,
}: {
  leads: LeadResumo[];
  filtros: FiltrosLeads;
  selecionado?: string;
}) {
  return (
    <ul className="flex flex-col gap-2">
      {leads.map((lead) => {
        const ativo = lead.id === selecionado;
        const novo = lead.status === "novo";

        return (
          <li key={lead.id}>
            <Link
              aria-current={ativo ? "true" : undefined}
              className={cn(
                "flex items-start gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:border-brand-blue/60",
                ativo && "border-brand-blue ring-1 ring-brand-blue/40",
              )}
              href={hrefLeads({ ...filtros, selecionado: lead.id })}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "mt-2 size-2 shrink-0 rounded-full",
                  novo ? "bg-brand-blue" : "bg-transparent",
                )}
              />
              <span className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="flex items-center justify-between gap-3">
                  <span
                    className={cn(
                      "truncate text-brand-violet",
                      novo ? "font-bold" : "font-semibold",
                    )}
                  >
                    {lead.nome}
                  </span>
                  <time
                    className="shrink-0 text-xs text-muted-foreground tabular-nums"
                    dateTime={lead.criado_em}
                    title={formatarDataHora(lead.criado_em)}
                  >
                    {formatarRelativo(lead.criado_em)}
                  </time>
                </span>
                <span className="truncate text-sm text-muted-foreground">
                  {lead.escola ?? "Escola não informada"} ·{" "}
                  {rotulosInteresseLead[lead.interesse] ?? lead.interesse}
                </span>
                <span className="mt-1">
                  <StatusLeadBadge status={lead.status} />
                </span>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
