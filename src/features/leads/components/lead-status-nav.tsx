import Link from "next/link";

import { cn } from "@/lib/utils";

import { type FiltrosLeads, hrefLeads, OPCOES_STATUS_LEAD } from "../filters";
import type { StatusLead } from "../schema";

export function NavStatusLeads({
  filtros,
  porStatus,
  totalAtivos,
}: {
  filtros: FiltrosLeads;
  porStatus: Record<StatusLead, number>;
  totalAtivos: number;
}) {
  return (
    <nav aria-label="Filtrar por status" className="min-w-0">
      <div className="flex flex-wrap gap-1 rounded-lg bg-muted p-1">
        {OPCOES_STATUS_LEAD.map((opcao) => {
          const quantidade =
            opcao.valor === "todos" ? totalAtivos : porStatus[opcao.valor];
          const ativo = filtros.status === opcao.valor;

          return (
            <Link
              aria-current={ativo ? "page" : undefined}
              className={cn(
                "inline-flex h-9 grow items-center justify-center gap-2 rounded-md px-3 text-sm font-medium whitespace-nowrap outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/30",
                ativo
                  ? "bg-card text-heading shadow-xs"
                  : "text-muted-foreground hover:text-heading",
              )}
              href={hrefLeads({ status: opcao.valor, q: filtros.q })}
              key={opcao.valor}
            >
              {opcao.rotulo}
              <span
                className={cn(
                  "rounded-full px-1.5 text-xs tabular-nums",
                  ativo ? "bg-accent text-primary" : "bg-background/80",
                )}
              >
                {quantidade}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
