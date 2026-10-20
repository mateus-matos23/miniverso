import { z } from "zod";

import { LIMITE_ITENS_LOTE, METRICAS_VITAIS } from "./constants";

export { LIMITE_ITENS_LOTE, METRICAS_VITAIS };

/**
 * Contrato do lote enviado a `/api/eventos`. Compartilhado por client e
 * server: o client monta o lote com estes tipos e o servidor valida com estes
 * schemas. Não importa nada de servidor.
 */

const caminho = z.string().max(200).startsWith("/");
const textoOpcional = (max: number) => z.string().max(max).nullish();

export const eventoSchema = z.object({
  tipo: z.enum(["pageview", "cta_click"]),
  caminho,
  alvo: textoOpcional(80),
  referrer_host: textoOpcional(200),
  utm_source: textoOpcional(100),
  utm_medium: textoOpcional(100),
  utm_campaign: textoOpcional(100),
});

export const vitalSchema = z.object({
  metrica: z.enum(METRICAS_VITAIS),
  valor: z.number().finite().nonnegative(),
  rating: z.enum(["good", "needs-improvement", "poor"]),
  navegacao: textoOpcional(30),
  caminho,
  versao_id: textoOpcional(36),
});

export const loteSchema = z
  .object({
    eventos: z.array(eventoSchema).max(LIMITE_ITENS_LOTE).default([]),
    vitals: z.array(vitalSchema).max(LIMITE_ITENS_LOTE).default([]),
  })
  .refine(
    (lote) => lote.eventos.length + lote.vitals.length <= LIMITE_ITENS_LOTE,
    {
      message: "O lote deve ter no máximo 20 itens no total.",
    },
  );

export type EventoTelemetria = z.input<typeof eventoSchema>;
export type VitalTelemetria = z.input<typeof vitalSchema>;
export type LoteTelemetria = z.infer<typeof loteSchema>;
