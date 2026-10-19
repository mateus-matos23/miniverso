import type { Resultado } from "./dados";
import { formatarCompacto, formatarDiaMes, formatarInteiro } from "./formatar";
import type { DiaMetrica, Metricas } from "./schemas";
import { AvisoBloco } from "./secao";

// Cores dos dados vêm dos tokens da marca (globals.css); SVG não lê classes Tailwind.
const COR_VISITANTES = "#1e4488"; // brand-blue
const COR_LEADS = "#00b7e3"; // brand-cyan
const COR_SUPERFICIE = "#ffffff";
const COR_GRADE = "#dbe1ec"; // border
const COR_EIXO = "#c9d2e3"; // brand-line
const COR_TEXTO = "#4f5a72"; // muted-foreground

const LARGURA = 560;
const ALTURA = 260;
const MARGEM = { topo: 12, direita: 12, base: 28, esquerda: 40 };
const AREA_LARGURA = LARGURA - MARGEM.esquerda - MARGEM.direita;
const AREA_ALTURA = ALTURA - MARGEM.topo - MARGEM.base;
const MAX_ROTULOS_EIXO = 6;

/** Menor passo "redondo" (1, 2, 2,5 ou 5 vezes uma potência de 10) que cobre `valor`. */
function passoRedondo(valor: number) {
  const potencia = 10 ** Math.floor(Math.log10(valor));
  const passo = [1, 2, 2.5, 5, 10]
    .map((fator) => fator * potencia)
    .find((p) => p >= valor);
  return passo ?? potencia * 10;
}

/** Índices dos dias que recebem rótulo no eixo x, sempre incluindo o último. */
function indicesRotulos(total: number) {
  const passo = Math.max(1, Math.ceil((total - 1) / (MAX_ROTULOS_EIXO - 1)));
  const indices: number[] = [];

  for (let i = 0; i < total - 1; i += passo) indices.push(i);

  const ultimo = total - 1;
  if (indices.length > 0 && ultimo - indices[indices.length - 1] < passo / 2)
    indices.pop();
  indices.push(ultimo);

  return indices;
}

function GraficoSvg({ dias }: { dias: DiaMetrica[] }) {
  const total = dias.length;
  const larguraBanda = AREA_LARGURA / total;
  const maximo = Math.max(1, ...dias.map((dia) => dia.visitantes));
  // Contagens são inteiras: o passo do eixo nunca fica abaixo de 1.
  const passo = Math.max(1, Math.ceil(passoRedondo(maximo / 4)));
  const divisoes = Math.min(4, Math.ceil(maximo / passo));
  const topoEscala = passo * divisoes;

  const xDe = (indice: number) =>
    MARGEM.esquerda + (indice + 0.5) * larguraBanda;
  const yDe = (valor: number) =>
    MARGEM.topo + AREA_ALTURA - (valor / topoEscala) * AREA_ALTURA;
  const base = MARGEM.topo + AREA_ALTURA;

  const pontosVisitantes = dias.map(
    (dia, i) => `${xDe(i)},${yDe(dia.visitantes)}`,
  );
  const linha = `M ${pontosVisitantes.join(" L ")}`;
  const area = `M ${xDe(0)},${base} L ${pontosVisitantes.join(" L ")} L ${xDe(total - 1)},${base} Z`;

  const marcasEixoY = Array.from({ length: divisoes + 1 }, (_, k) => k * passo);
  const rotulosX = indicesRotulos(total);

  return (
    <svg
      aria-label={`Gráfico de visitantes e leads por dia, ${total} dias. Os valores estão na tabela abaixo.`}
      className="hidden h-auto w-full sm:block sm:max-w-[40rem]"
      role="img"
      viewBox={`0 0 ${LARGURA} ${ALTURA}`}
    >
      {marcasEixoY.map((valor) => (
        <g key={valor}>
          <line
            stroke={valor === 0 ? COR_EIXO : COR_GRADE}
            strokeWidth={1}
            x1={MARGEM.esquerda}
            x2={LARGURA - MARGEM.direita}
            y1={yDe(valor)}
            y2={yDe(valor)}
          />
          <text
            fill={COR_TEXTO}
            fontSize={13}
            textAnchor="end"
            x={MARGEM.esquerda - 6}
            y={yDe(valor) + 4}
          >
            {formatarCompacto(valor)}
          </text>
        </g>
      ))}

      <path d={area} fill={COR_VISITANTES} fillOpacity={0.1} />
      <path
        d={linha}
        fill="none"
        stroke={COR_VISITANTES}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />

      {dias.map((dia, i) =>
        dia.leads > 0 ? (
          <circle
            cx={xDe(i)}
            cy={yDe(dia.leads)}
            fill={COR_LEADS}
            key={`lead-${dia.dia}`}
            r={4.5}
            stroke={COR_SUPERFICIE}
            strokeWidth={2}
          />
        ) : null,
      )}

      {rotulosX.map((i) => (
        <text
          fill={COR_TEXTO}
          fontSize={13}
          key={`rotulo-${dias[i].dia}`}
          textAnchor={i === 0 ? "start" : i === total - 1 ? "end" : "middle"}
          x={
            xDe(i) +
            (i === 0
              ? -larguraBanda / 2
              : i === total - 1
                ? larguraBanda / 2
                : 0)
          }
          y={ALTURA - 8}
        >
          {formatarDiaMes(dias[i].dia)}
        </text>
      ))}

      {/* Colunas transparentes com <title>: a área de hover cobre o dia inteiro. */}
      {dias.map((dia, i) => (
        <rect
          fill="transparent"
          height={AREA_ALTURA}
          key={`hover-${dia.dia}`}
          width={larguraBanda}
          x={MARGEM.esquerda + i * larguraBanda}
          y={MARGEM.topo}
        >
          <title>
            {`${formatarDiaMes(dia.dia)}: ${formatarInteiro(dia.visitantes)} visitantes, ${formatarInteiro(dia.leads)} ${dia.leads === 1 ? "lead" : "leads"}`}
          </title>
        </rect>
      ))}
    </svg>
  );
}

export function GraficoDiario({ metricas }: { metricas: Resultado<Metricas> }) {
  if (!metricas.ok) {
    return <AvisoBloco texto="Não foi possível carregar a série diária." />;
  }

  const { por_dia: dias } = metricas.dados;

  if (dias.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Sem dias no período selecionado.
      </p>
    );
  }

  return (
    <figure className="rounded-lg border border-border bg-card p-5">
      <figcaption className="mb-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-brand-ink">
        <span className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="h-0.5 w-5 rounded-full bg-brand-blue"
          />
          Visitantes por dia
        </span>
        <span className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="size-2.5 rounded-full bg-brand-cyan"
          />
          Leads
        </span>
      </figcaption>

      <GraficoSvg dias={dias} />

      {/* Abaixo de sm o SVG some e esta tabela vira a leitura visível dos dados. */}
      <table className="w-full border-collapse text-sm tabular-nums sm:sr-only">
        <caption className="mb-2 text-left text-sm text-brand-ink">
          Visitantes, visualizações e leads por dia
        </caption>
        <thead>
          <tr className="border-b border-border">
            <th
              className="px-2 py-2 text-left text-xs font-medium text-brand-ink"
              scope="col"
            >
              Dia
            </th>
            <th
              className="px-2 py-2 text-right text-xs font-medium text-brand-ink"
              scope="col"
            >
              Visitantes
            </th>
            <th
              className="px-2 py-2 text-right text-xs font-medium text-brand-ink"
              scope="col"
            >
              Visualizações
            </th>
            <th
              className="px-2 py-2 text-right text-xs font-medium text-brand-ink"
              scope="col"
            >
              Leads
            </th>
          </tr>
        </thead>
        <tbody>
          {dias.map((dia) => (
            <tr
              className="border-b border-border last:border-b-0"
              key={dia.dia}
            >
              <th
                className="px-2 py-2 text-left font-normal text-brand-ink"
                scope="row"
              >
                {formatarDiaMes(dia.dia)}
              </th>
              <td className="px-2 py-2 text-right">{dia.visitantes}</td>
              <td className="px-2 py-2 text-right">{dia.pageviews}</td>
              <td className="px-2 py-2 text-right">{dia.leads}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
