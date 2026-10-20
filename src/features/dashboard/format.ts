const formatadorInteiro = new Intl.NumberFormat("pt-BR");

const formatadorCompacto = new Intl.NumberFormat("pt-BR", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const formatadorPercentual = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

export function formatarInteiro(valor: number) {
  return formatadorInteiro.format(valor);
}

export function formatarCompacto(valor: number) {
  return formatadorCompacto.format(valor);
}

/** Percentual com 1 casa, ex.: "3,4%". */
export function formatarPercentual(valor: number) {
  return `${formatadorPercentual.format(valor)}%`;
}
