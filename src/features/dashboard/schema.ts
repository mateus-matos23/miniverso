import { z } from "zod";

// O dashboard recebe JSON do banco (tipo Json no cliente gerado); validamos antes de usar.

export const metricasSchema = z.object({
  visitantes: z.number().nonnegative(),
  pageviews: z.number().nonnegative(),
  leads: z.number().nonnegative(),
  por_dia: z.array(
    z.object({
      dia: z.string(),
      visitantes: z.number().nonnegative(),
      pageviews: z.number().nonnegative(),
      leads: z.number().nonnegative(),
    }),
  ),
  ctas: z.array(z.object({ alvo: z.string(), cliques: z.number() })),
  origens: z.array(z.object({ origem: z.string(), visitantes: z.number() })),
  dispositivos: z.array(
    z.object({ dispositivo: z.string(), visitantes: z.number() }),
  ),
});

export type Metricas = z.infer<typeof metricasSchema>;
export type DiaMetrica = Metricas["por_dia"][number];

export const webVitalsLinhaSchema = z.object({
  metrica: z.string(),
  dispositivo: z.string(),
  p75: z.number(),
  amostras: z.number(),
  pct_bom: z.number(),
});

export type WebVitalsLinha = z.infer<typeof webVitalsLinhaSchema>;

export const versaoVitalsLinhaSchema = z.object({
  versao_id: z.string(),
  publicado_em: z.string().nullable(),
  nota: z.string().nullable(),
  metrica: z.string(),
  dispositivo: z.string(),
  p75: z.number(),
  amostras: z.number(),
});

export type VersaoVitalsLinha = z.infer<typeof versaoVitalsLinhaSchema>;
