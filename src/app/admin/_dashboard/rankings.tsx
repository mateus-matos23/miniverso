import type { Resultado } from "./dados";
import { formatarInteiro } from "./formatar";
import { rotulosAlvoCta, rotulosDispositivo, rotulosOrigem } from "./rotulos";
import type { Metricas } from "./schemas";
import { AvisoBloco } from "./secao";

type Item = { rotulo: string; valor: number };

function ListaBarras({
  titulo,
  itens,
  descricao,
}: {
  titulo: string;
  itens: Item[];
  descricao: string;
}) {
  const maximo = Math.max(1, ...itens.map((item) => item.valor));

  return (
    <div className="flex min-w-0 flex-col">
      <h3 className="text-sm font-semibold text-heading">{titulo}</h3>
      <p className="mt-1 text-xs text-muted-foreground">{descricao}</p>
      {itens.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">
          Sem dados no período.
        </p>
      ) : (
        <ul className="mt-5 flex flex-col gap-4">
          {itens.map((item) => (
            <li key={item.rotulo}>
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="min-w-0 truncate text-body">
                  {item.rotulo}
                </span>
                <span className="shrink-0 font-semibold text-foreground tabular-nums">
                  {formatarInteiro(item.valor)}
                </span>
              </div>
              <div
                aria-hidden="true"
                className="mt-1.5 h-1.5 w-full rounded-full bg-muted"
              >
                <div
                  className="h-1.5 rounded-full bg-primary"
                  style={{ width: `${(item.valor / maximo) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function RankingsPeriodo({
  metricas,
}: {
  metricas: Resultado<Metricas>;
}) {
  if (!metricas.ok) {
    return (
      <AvisoBloco texto="Não foi possível carregar cliques, origens e dispositivos." />
    );
  }

  const { ctas, origens, dispositivos } = metricas.dados;

  return (
    <div className="grid gap-8 md:grid-cols-3">
      <ListaBarras
        descricao="Cliques nos botões e links da landing."
        itens={ctas.map((cta) => ({
          rotulo: rotulosAlvoCta[cta.alvo] ?? cta.alvo,
          valor: cta.cliques,
        }))}
        titulo="CTAs mais clicados"
      />
      <ListaBarras
        descricao="Visitantes por fonte de tráfego."
        itens={origens.map((origem) => ({
          rotulo: rotulosOrigem[origem.origem] ?? origem.origem,
          valor: origem.visitantes,
        }))}
        titulo="Origens"
      />
      <ListaBarras
        descricao="Visitantes por tipo de aparelho."
        itens={dispositivos.map((dispositivo) => ({
          rotulo:
            rotulosDispositivo[dispositivo.dispositivo] ??
            dispositivo.dispositivo,
          valor: dispositivo.visitantes,
        }))}
        titulo="Dispositivos"
      />
    </div>
  );
}
