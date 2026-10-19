import {
  EyeIcon,
  InboxIcon,
  type LucideIcon,
  PercentIcon,
  UsersIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

import { superficie } from "../_componentes/painel";
import type { Resultado } from "./dados";
import { formatarInteiro, formatarPercentual } from "./formatar";
import type { Metricas } from "./schemas";
import { AvisoBloco } from "./secao";

export function KpisPeriodo({ metricas }: { metricas: Resultado<Metricas> }) {
  if (!metricas.ok) {
    return (
      <AvisoBloco texto="Não foi possível carregar os números do período. Recarregue a página." />
    );
  }

  const { visitantes, pageviews, leads } = metricas.dados;
  const taxa = visitantes === 0 ? null : (leads / visitantes) * 100;

  const itens: {
    rotulo: string;
    valor: string;
    icone: LucideIcon;
    ajuda?: string;
  }[] = [
    {
      rotulo: "Visitantes",
      valor: formatarInteiro(visitantes),
      icone: UsersIcon,
    },
    {
      rotulo: "Visualizações",
      valor: formatarInteiro(pageviews),
      icone: EyeIcon,
    },
    { rotulo: "Leads", valor: formatarInteiro(leads), icone: InboxIcon },
    {
      rotulo: "Taxa de conversão",
      valor: taxa === null ? "—" : formatarPercentual(taxa),
      icone: PercentIcon,
      ajuda: "Leads divididos por visitantes",
    },
  ];

  return (
    <dl className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
      {itens.map((item) => {
        const Icone = item.icone;
        return (
          <div className={cn(superficie, "p-4 sm:p-5")} key={item.rotulo}>
            <dt className="flex items-start justify-between gap-3 text-sm font-medium text-muted-foreground">
              {item.rotulo}
              <span
                aria-hidden="true"
                className="grid size-8 shrink-0 place-items-center rounded-lg bg-accent text-primary"
              >
                <Icone className="size-4" />
              </span>
            </dt>
            <dd className="mt-3 font-display text-4xl leading-none sm:mt-4 sm:text-5xl font-bold text-heading tabular-nums">
              {item.valor}
            </dd>
            {item.ajuda ? (
              <p className="mt-2 text-xs text-muted-foreground">{item.ajuda}</p>
            ) : null}
          </div>
        );
      })}
    </dl>
  );
}
