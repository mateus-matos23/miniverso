/**
 * Formatação de datas. Tudo sai no fuso de Fortaleza (sem horário de verão),
 * em servidor e cliente, para que a mesma data apareça igual nos dois lados.
 */

export const FUSO = "America/Fortaleza";

const formatadorDataHora = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: FUSO,
});

const formatadorData = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: FUSO,
});

const formatadorHora = new Intl.DateTimeFormat("pt-BR", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: FUSO,
});

const formatadorDia = new Intl.DateTimeFormat("en-CA", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  timeZone: FUSO,
});

const formatadorRelativo = new Intl.RelativeTimeFormat("pt-BR", {
  numeric: "auto",
});

/** Data e hora, ex.: "19/10/2026, 14:30". */
export function formatarDataHora(iso: string): string {
  return formatadorDataHora.format(new Date(iso));
}

/** Só a data, ex.: "19/10/2026". */
export function formatarData(iso: string): string {
  return formatadorData.format(new Date(iso));
}

/** Só a hora, ex.: "14:30". */
export function formatarHora(iso: string): string {
  return formatadorHora.format(new Date(iso));
}

/** Dia no fuso de Fortaleza no formato YYYY-MM-DD, ex.: "2026-10-19". */
export function diaNoFuso(data: Date): string {
  const partes = formatadorDia.formatToParts(data);

  const ano = partes.find((p) => p.type === "year")?.value;
  const mes = partes.find((p) => p.type === "month")?.value;
  const dia = partes.find((p) => p.type === "day")?.value;

  return `${ano}-${mes}-${dia}`;
}

/** Dia e mês de uma data "YYYY-MM-DD", ex.: "19/10". */
export function formatarDiaMes(dia: string): string {
  return `${dia.slice(8, 10)}/${dia.slice(5, 7)}`;
}

/**
 * Tempo relativo em pt-BR, ex.: "agora", "há 3 horas", "ontem".
 * A partir de 30 dias mostra a data absoluta.
 */
export function formatarRelativo(iso: string, agora = Date.now()): string {
  const segundos = Math.round((new Date(iso).getTime() - agora) / 1000);
  const absoluto = Math.abs(segundos);

  if (absoluto < 60) return "agora";
  if (absoluto < 3600)
    return formatadorRelativo.format(Math.round(segundos / 60), "minute");
  if (absoluto < 86400)
    return formatadorRelativo.format(Math.round(segundos / 3600), "hour");
  if (absoluto < 86400 * 30)
    return formatadorRelativo.format(Math.round(segundos / 86400), "day");
  return formatarData(iso);
}
