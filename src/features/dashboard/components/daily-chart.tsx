"use client";

import { type ReactNode, useId, useState } from "react";
import { formatarDiaMes } from "@/lib/format";
import type { Resultado } from "../data";
import { formatarCompacto, formatarInteiro } from "../format";
import type { DiaMetrica, Metricas } from "../schema";
import { AvisoBloco } from "./section";

// Cores dos dados vêm dos tokens da marca (globals.css); SVG não lê classes Tailwind.
const COR_VISITANTES = "#1e4488"; // brand-blue
const COR_LEADS = "#1e1645"; // brand-violet (ciano não é texto nem marca sobre fundo claro)
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
const TOOLTIP_LARGURA = 168;
const TOOLTIP_ALTURA = 58;

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
  // Dia em destaque por foco, toque ou ponteiro: mostra o rótulo com os valores.
  const [ativo, setAtivo] = useState<number | null>(null);
  // IDs de gradiente e sombra: sem os dois-pontos do useId, para não quebrar a referência url(#…).
  const idBase = useId().replace(/:/g, "");
  const idGradiente = `${idBase}-area`;
  const idSombra = `${idBase}-sombra`;
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

  let destaque: ReactNode = null;
  if (ativo !== null) {
    const dia = dias[ativo];
    const xAtivo = xDe(ativo);
    const xTooltip = Math.min(
      Math.max(xAtivo - TOOLTIP_LARGURA / 2, MARGEM.esquerda),
      LARGURA - MARGEM.direita - TOOLTIP_LARGURA,
    );

    destaque = (
      <g pointerEvents="none">
        <line
          stroke={COR_EIXO}
          strokeDasharray="3 3"
          x1={xAtivo}
          x2={xAtivo}
          y1={MARGEM.topo}
          y2={base}
        />
        <rect
          fill={COR_SUPERFICIE}
          filter={`url(#${idSombra})`}
          height={TOOLTIP_ALTURA}
          rx={8}
          stroke={COR_GRADE}
          width={TOOLTIP_LARGURA}
          x={xTooltip}
          y={MARGEM.topo}
        />
        <text
          fill={COR_TEXTO}
          fontSize={12}
          x={xTooltip + 10}
          y={MARGEM.topo + 17}
        >
          {formatarDiaMes(dia.dia)}
        </text>
        <text
          fill={COR_VISITANTES}
          fontSize={13}
          fontWeight={600}
          x={xTooltip + 10}
          y={MARGEM.topo + 34}
        >
          {formatarInteiro(dia.visitantes)} visitantes
        </text>
        <text
          fill={COR_LEADS}
          fontSize={13}
          fontWeight={600}
          x={xTooltip + 10}
          y={MARGEM.topo + 50}
        >
          {formatarInteiro(dia.leads)} {dia.leads === 1 ? "lead" : "leads"}
        </text>
      </g>
    );
  }

  return (
    <svg
      aria-label={`Gráfico de visitantes e leads por dia, ${total} dias. Os valores estão na tabela abaixo.`}
      className="hidden h-auto w-full sm:block sm:max-w-160"
      viewBox={`0 0 ${LARGURA} ${ALTURA}`}
    >
      <defs>
        <linearGradient id={idGradiente} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={COR_VISITANTES} stopOpacity={0.18} />
          <stop offset="1" stopColor={COR_VISITANTES} stopOpacity={0} />
        </linearGradient>
        <filter height="160%" id={idSombra} width="130%" x="-15%" y="-15%">
          <feDropShadow
            dx={0}
            dy={2}
            floodColor="#1e1645"
            floodOpacity={0.12}
            stdDeviation={3}
          />
        </filter>
      </defs>

      {marcasEixoY.map((valor) => (
        <g key={valor}>
          <line
            stroke={valor === 0 ? COR_EIXO : COR_GRADE}
            strokeDasharray={valor === 0 ? undefined : "3 4"}
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

      <path d={area} fill={`url(#${idGradiente})`} />
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
          <g key={`lead-${dia.dia}`}>
            <circle
              cx={xDe(i)}
              cy={yDe(dia.leads)}
              fill={COR_LEADS}
              r={4.5}
              stroke={COR_SUPERFICIE}
              strokeWidth={2}
            />
            {/* Leads ficam colados ao eixo na escala de visitantes: o valor fica ao lado. */}
            <text
              fill={COR_LEADS}
              fontSize={12}
              fontWeight={600}
              textAnchor="middle"
              x={xDe(i)}
              y={yDe(dia.leads) - 9}
            >
              {formatarInteiro(dia.leads)}
            </text>
          </g>
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

      {destaque}

      {/* Colunas transparentes e focáveis: a área cobre o dia inteiro e recebe foco, toque e ponteiro. */}
      {dias.map((dia, i) => {
        return (
          // O role img é o padrão de pontos de dados focáveis em gráficos (ex.: Highcharts); o nome do dia e os valores vêm do aria-label.
          // biome-ignore lint/a11y/noInteractiveElementToNoninteractiveRole: ponto de dado focável; "img" com aria-label descreve a coluna
          <rect
            aria-label={`${formatarDiaMes(dia.dia)}: ${formatarInteiro(dia.visitantes)} visitantes, ${formatarInteiro(dia.leads)} ${dia.leads === 1 ? "lead" : "leads"}`}
            fill="transparent"
            height={AREA_ALTURA}
            key={`hover-${dia.dia}`}
            onBlur={() => setAtivo(null)}
            onFocus={() => setAtivo(i)}
            onPointerDown={() => setAtivo(i)}
            onPointerEnter={(evento) => {
              if (evento.pointerType === "mouse") setAtivo(i);
            }}
            onPointerLeave={(evento) => {
              if (evento.pointerType === "mouse") setAtivo(null);
            }}
            role="img"
            tabIndex={0}
            width={larguraBanda}
            x={MARGEM.esquerda + i * larguraBanda}
            y={MARGEM.topo}
          />
        );
      })}
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
    <figure className="flex flex-col">
      <figcaption className="mb-2 flex flex-wrap items-center justify-end gap-x-5 gap-y-2 text-sm text-body">
        <span className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="size-2.5 rounded-full bg-primary"
          />
          Visitantes por dia
        </span>
        <span className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="size-2.5 rounded-full bg-brand-violet"
          />
          Leads
        </span>
      </figcaption>

      <GraficoSvg dias={dias} />

      {/* Abaixo de sm o SVG some e esta tabela vira a leitura visível dos dados. */}
      <table className="w-full border-collapse text-sm tabular-nums sm:sr-only">
        <caption className="mb-2 text-left text-sm text-body">
          Visitantes, visualizações e leads por dia
        </caption>
        <thead>
          <tr className="border-b border-border">
            <th
              className="px-2 py-2 text-left text-xs font-medium text-body"
              scope="col"
            >
              Dia
            </th>
            <th
              className="px-2 py-2 text-right text-xs font-medium text-body"
              scope="col"
            >
              Visitantes
            </th>
            <th
              className="px-2 py-2 text-right text-xs font-medium text-body"
              scope="col"
            >
              Visualizações
            </th>
            <th
              className="px-2 py-2 text-right text-xs font-medium text-body"
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
                className="px-2 py-2 text-left font-normal text-body"
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
