export const PERIODOS = [7, 30, 90] as const;

export type Periodo = (typeof PERIODOS)[number];

export const PERIODO_PADRAO: Periodo = 30;

const FUSO = "America/Fortaleza";

/** Lê o parâmetro `periodo` da URL; valores desconhecidos caem no padrão. */
export function lerPeriodo(valor: string | string[] | undefined): Periodo {
  const texto = Array.isArray(valor) ? valor[0] : valor;
  return (
    PERIODOS.find((periodo) => String(periodo) === texto) ?? PERIODO_PADRAO
  );
}

/**
 * Intervalo [início do dia há N-1 dias, agora) no fuso de Fortaleza.
 * Fortaleza não usa horário de verão, então o deslocamento é fixo (-03:00).
 */
export function intervaloDoPeriodo(dias: Periodo, agora = new Date()) {
  const hoje = new Intl.DateTimeFormat("en-CA", {
    timeZone: FUSO,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(agora);

  const data = new Date(`${hoje}T00:00:00Z`);
  data.setUTCDate(data.getUTCDate() - (dias - 1));

  return {
    inicio: `${data.toISOString().slice(0, 10)}T00:00:00-03:00`,
    fim: agora.toISOString(),
  };
}
