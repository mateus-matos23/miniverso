const FUSO = "America/Fortaleza";

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

/** Data curta no fuso de Fortaleza, ex.: "19/10/2026". */
export function formatarDataCurta(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    timeZone: FUSO,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/** Dia e mês de uma data "YYYY-MM-DD", ex.: "19/10". */
export function formatarDiaMes(dia: string) {
  return `${dia.slice(8, 10)}/${dia.slice(5, 7)}`;
}

const formatadorRelativo = new Intl.RelativeTimeFormat("pt-BR", {
  numeric: "auto",
});

/** Data relativa em pt-BR, ex.: "há 3 horas", "ontem". */
export function formatarTempoRelativo(iso: string, agora = Date.now()) {
  const segundos = Math.round((new Date(iso).getTime() - agora) / 1000);
  const absoluto = Math.abs(segundos);

  if (absoluto < 60) return "agora";
  if (absoluto < 3600)
    return formatadorRelativo.format(Math.round(segundos / 60), "minute");
  if (absoluto < 86400)
    return formatadorRelativo.format(Math.round(segundos / 3600), "hour");
  if (absoluto < 86400 * 30)
    return formatadorRelativo.format(Math.round(segundos / 86400), "day");
  return formatarDataCurta(iso);
}
