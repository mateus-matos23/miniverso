// Constantes do lote de telemetria sem dependência de zod: o client importa daqui.

/** Limite de itens (eventos e vitals somados) por lote. */
export const LIMITE_ITENS_LOTE = 20;

export const METRICAS_VITAIS = ["LCP", "INP", "CLS", "FCP", "TTFB"] as const;
