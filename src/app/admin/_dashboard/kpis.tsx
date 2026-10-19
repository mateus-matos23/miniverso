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

  const itens = [
    { rotulo: "Visitantes", valor: formatarInteiro(visitantes) },
    { rotulo: "Visualizações", valor: formatarInteiro(pageviews) },
    { rotulo: "Leads", valor: formatarInteiro(leads) },
    {
      rotulo: "Taxa de conversão",
      valor: taxa === null ? "—" : formatarPercentual(taxa),
      ajuda: "Leads divididos por visitantes",
    },
  ];

  return (
    <dl className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 xl:grid-cols-4">
      {itens.map((item) => (
        <div className="bg-card p-6" key={item.rotulo}>
          <dt className="text-sm font-medium text-muted-foreground">
            {item.rotulo}
          </dt>
          <dd className="mt-2 font-display text-5xl font-bold leading-none text-heading tabular-nums">
            {item.valor}
          </dd>
          {item.ajuda ? (
            <p className="mt-2 text-xs text-muted-foreground">{item.ajuda}</p>
          ) : null}
        </div>
      ))}
    </dl>
  );
}
