import Link from "next/link";

import { formatarRelativo } from "@/lib/formatar";

import type { Resultado, UltimoLead } from "./dados";
import { rotulosInteresse } from "./rotulos";
import { AvisoBloco } from "./secao";

export function UltimosLeads({
  leads,
  agora,
}: {
  leads: Resultado<UltimoLead[]>;
  agora: number;
}) {
  if (!leads.ok) {
    return <AvisoBloco texto="Não foi possível carregar os últimos leads." />;
  }

  if (leads.dados.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Nenhum lead recebido ainda.
        </p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-border">
      {leads.dados.map((lead) => (
        <li
          className="flex flex-col gap-1.5 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
          key={lead.id}
        >
          <div className="min-w-0">
            <Link
              className="font-medium text-heading underline-offset-4 hover:underline"
              href={`/admin/leads?selecionado=${lead.id}`}
            >
              {lead.nome}
            </Link>
            <div className="mt-0.5 flex min-w-0 flex-wrap gap-x-4 gap-y-0.5 text-sm text-muted-foreground">
              {lead.escola ? (
                <span className="truncate">{lead.escola}</span>
              ) : null}
              <span>{rotulosInteresse[lead.interesse] ?? lead.interesse}</span>
            </div>
          </div>
          <time
            className="shrink-0 text-sm text-muted-foreground tabular-nums"
            dateTime={lead.criado_em}
          >
            {formatarRelativo(lead.criado_em, agora)}
          </time>
        </li>
      ))}
    </ul>
  );
}
