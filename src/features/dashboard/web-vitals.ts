/** Limiares oficiais do Google para Core Web Vitals (valor do p75). */

export const METRICAS = ["LCP", "INP", "CLS", "FCP", "TTFB"] as const;

export type Metrica = (typeof METRICAS)[number];

export type Classificacao = "bom" | "precisa" | "ruim";

/** Abaixo disso o p75 não é confiável e o selo não é exibido. */
export const AMOSTRAS_MINIMAS = 20;

/** Métricas que disparam o alerta de desempenho no topo do painel. */
export const METRICAS_CORE: readonly Metrica[] = ["LCP", "INP", "CLS"];

/** Dispositivos exibidos nos cards. Tablets não aparecem (ver nota no componente). */
export const DISPOSITIVOS_CARDS = ["mobile", "desktop"] as const;

/** Piora relativa acima da qual uma versão é marcada na tabela por versão. */
export const LIMITE_PIORA = 0.2;

/** Bom até `bom` (inclusive); ruim acima de `ruim`; precisa melhorar entre os dois. */
export const limiares: Record<Metrica, { bom: number; ruim: number }> = {
  LCP: { bom: 2500, ruim: 4000 },
  INP: { bom: 200, ruim: 500 },
  CLS: { bom: 0.1, ruim: 0.25 },
  FCP: { bom: 1800, ruim: 3000 },
  TTFB: { bom: 800, ruim: 1800 },
};

export const rotulosMetrica: Record<
  Metrica,
  { nome: string; descricao: string }
> = {
  LCP: {
    nome: "Carregamento",
    descricao: "Tempo até o maior conteúdo aparecer",
  },
  INP: {
    nome: "Interatividade",
    descricao: "Tempo de resposta a cliques e toques",
  },
  CLS: {
    nome: "Estabilidade",
    descricao: "Quanto o layout se desloca durante a carga",
  },
  FCP: {
    nome: "Primeira pintura",
    descricao: "Tempo até o primeiro conteúdo aparecer",
  },
  TTFB: {
    nome: "Resposta do servidor",
    descricao: "Tempo até o primeiro byte chegar",
  },
};

export function classificarMetrica(
  metrica: Metrica,
  valor: number,
): Classificacao {
  const { bom, ruim } = limiares[metrica];
  if (valor <= bom) return "bom";
  if (valor <= ruim) return "precisa";
  return "ruim";
}

const formatadorSegundos = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const formatadorCls = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** LCP, FCP e TTFB em segundos (ex.: "2,4 s"); INP em ms; CLS com 2 casas. */
export function formatarValorMetrica(metrica: Metrica, valor: number): string {
  if (metrica === "CLS") return formatadorCls.format(valor);
  if (metrica === "INP") return `${Math.round(valor)} ms`;
  return `${formatadorSegundos.format(valor / 1000)} s`;
}

export const rotulosClassificacao: Record<Classificacao, string> = {
  bom: "Bom",
  precisa: "Precisa melhorar",
  ruim: "Ruim",
};
