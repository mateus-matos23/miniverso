const formatoDataHora = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "America/Fortaleza",
});

const formatoHora = new Intl.DateTimeFormat("pt-BR", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "America/Fortaleza",
});

/** Ex.: "19/10/2026 14:30". */
export function formatarDataHora(iso: string): string {
  return formatoDataHora.format(new Date(iso));
}

/** Ex.: "14:30". */
export function formatarHora(iso: string): string {
  return formatoHora.format(new Date(iso));
}
