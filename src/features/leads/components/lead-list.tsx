import Link from "next/link";

import { superficie } from "@/components/admin/panel";
import { formatarDataHora, formatarRelativo } from "@/lib/format";
import type { LeadRow } from "@/lib/supabase/database";
import { cn } from "@/lib/utils";

import { type FiltrosLeads, hrefLeads } from "../filters";
import { rotulosInteresseLead } from "../labels";
import { StatusLeadBadge } from "./lead-status-badge";

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
                superficie,
                "flex items-start gap-3 p-4 transition-colors hover:border-primary/40",
                ativo &&
                  "border-primary/50 bg-accent/60 shadow-[inset_3px_0_0_var(--color-primary)]",
              )}
              href={hrefLeads({ ...filtros, selecionado: lead.id })}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "mt-2 size-2 shrink-0 rounded-full",
                  novo ? "bg-primary" : "bg-transparent",
                )}
              />
              <span className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="flex items-center justify-between gap-3">
                  <span className="truncate font-medium text-heading">
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
                <span className="flex min-w-0 flex-wrap gap-x-3 gap-y-0.5 text-sm text-muted-foreground">
                  <span className="truncate">
                    {lead.escola ?? "Escola não informada"}
                  </span>
                  <span className="shrink-0">
                    {rotulosInteresseLead[lead.interesse] ?? lead.interesse}
                  </span>
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
