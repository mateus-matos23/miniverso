"use client";

import { useReportWebVitals } from "next/web-vitals";
import { useEffect } from "react";

type CallbackVitals = Parameters<typeof useReportWebVitals>[0];

type Navegador = Navigator & { globalPrivacyControl?: boolean };

type EventoTelemetria = {
  tipo: "pageview" | "cta_click";
  caminho: string;
  alvo?: string;
  referrer_host?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
};

type VitalTelemetria = {
  metrica: "LCP" | "INP" | "CLS" | "FCP" | "TTFB";
  valor: number;
  rating: string;
  navegacao?: string;
  caminho: string;
  versao_id?: string;
};

const LIMITE_LOTE = 20;
const ATRASO_PAGEVIEW_MS = 3000;
const METRICAS = new Set<VitalTelemetria["metrica"]>([
  "LCP",
  "INP",
  "CLS",
  "FCP",
  "TTFB",
]);

// Estado de módulo: a fila e a Map sobrevivem a trocas de rota no client.
const filaEventos: EventoTelemetria[] = [];
const vitaisPorId = new Map<string, VitalTelemetria>();
let versaoAtual: string | null = null;

/** Respeita Do Not Track e Global Privacy Control: nada é coletado nesse caso. */
function coletaPermitida(): boolean {
  const navegador = navigator as Navegador;

  return (
    navegador.doNotTrack !== "1" && navegador.globalPrivacyControl !== true
  );
}

/** Corta o texto no limite aceito pelo servidor, que descarta o lote inteiro se algum campo passar. */
function limitar(valor: string, max: number): string {
  return valor.slice(0, max);
}

function utmDaUrl(params: URLSearchParams) {
  const utm: Partial<
    Record<"utm_source" | "utm_medium" | "utm_campaign", string>
  > = {};

  for (const chave of ["utm_source", "utm_medium", "utm_campaign"] as const) {
    const valor = params.get(chave);
    if (valor) utm[chave] = limitar(valor, 100);
  }

  return utm;
}

/** Host da origem do referrer, só quando vem de outro domínio. */
function referrerDeOutroDominio(): string | undefined {
  if (!document.referrer) return undefined;

  try {
    const origem = new URL(document.referrer);
    if (origem.host === location.host) return undefined;
    return limitar(origem.host, 200);
  } catch {
    return undefined;
  }
}

function enfileirarEvento(evento: EventoTelemetria) {
  if (!coletaPermitida()) return;
  filaEventos.push(evento);
}

/**
 * Divide a fila em lotes de no máximo 20 itens no total (eventos e vitals
 * juntos), que é o limite aceito por `/api/eventos`.
 */
function montarLotes(
  eventos: EventoTelemetria[],
  vitais: VitalTelemetria[],
): { eventos: EventoTelemetria[]; vitals: VitalTelemetria[] }[] {
  const lotes: { eventos: EventoTelemetria[]; vitals: VitalTelemetria[] }[] =
    [];
  const restoEventos = [...eventos];
  const restoVitais = [...vitais];

  while (restoEventos.length || restoVitais.length) {
    const loteEventos = restoEventos.splice(0, LIMITE_LOTE);
    const loteVitais = restoVitais.splice(0, LIMITE_LOTE - loteEventos.length);
    lotes.push({ eventos: loteEventos, vitals: loteVitais });
  }

  return lotes;
}

/** Envia a fila com sendBeacon (ou fetch com keepalive) e esvazia tudo. */
function enviarFila() {
  const eventos = filaEventos.splice(0);
  const vitais = [...vitaisPorId.values()];
  vitaisPorId.clear();

  if (!eventos.length && !vitais.length) return;
  if (!coletaPermitida()) return;

  for (const lote of montarLotes(eventos, vitais)) {
    const corpo = JSON.stringify(lote);
    const enviadoPorBeacon =
      typeof navigator.sendBeacon === "function" &&
      navigator.sendBeacon("/api/eventos", corpo);

    if (!enviadoPorBeacon) {
      fetch("/api/eventos", {
        method: "POST",
        body: corpo,
        keepalive: true,
      }).catch(() => {
        // Telemetria nunca deve quebrar a página: a falha é ignorada.
      });
    }
  }
}

// Referência estável, como a doc de useReportWebVitals exige: uma função nova
// a cada render faria a biblioteca reportar métricas duplicadas.
const registrarVital: CallbackVitals = (metric) => {
  if (!coletaPermitida()) return;
  if (!METRICAS.has(metric.name as VitalTelemetria["metrica"])) return;

  vitaisPorId.set(metric.id, {
    metrica: metric.name as VitalTelemetria["metrica"],
    valor: metric.value,
    rating: metric.rating,
    navegacao: metric.navigationType,
    caminho: limitar(location.pathname, 200),
    ...(versaoAtual ? { versao_id: versaoAtual } : {}),
  });
};

/**
 * Telemetria anônima: pageview, cliques em CTAs (`data-cta`) e Web Vitals.
 * Envia em lote quando a aba fica oculta ou a página é fechada.
 * Não renderiza nada.
 */
export function Telemetria({ versaoId }: { versaoId: string | null }) {
  useReportWebVitals(registrarVital);

  useEffect(() => {
    versaoAtual = versaoId;
  }, [versaoId]);

  useEffect(() => {
    if (!coletaPermitida()) return;

    const params = new URLSearchParams(location.search);
    const referrerHost = referrerDeOutroDominio();

    enfileirarEvento({
      tipo: "pageview",
      caminho: limitar(location.pathname, 200),
      ...(referrerHost ? { referrer_host: referrerHost } : {}),
      ...utmDaUrl(params),
    });

    const aoClicar = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;

      const alvo = event.target.closest("[data-cta]")?.getAttribute("data-cta");
      if (!alvo) return;

      enfileirarEvento({
        tipo: "cta_click",
        caminho: limitar(location.pathname, 200),
        alvo: limitar(alvo, 80),
      });
    };

    const aoOcultar = () => {
      if (document.visibilityState === "hidden") enviarFila();
    };

    // Envia o pageview inicial mesmo que a aba nunca fique oculta.
    const temporizador = window.setTimeout(enviarFila, ATRASO_PAGEVIEW_MS);

    document.addEventListener("click", aoClicar, { capture: true });
    document.addEventListener("visibilitychange", aoOcultar);
    window.addEventListener("pagehide", enviarFila);

    return () => {
      window.clearTimeout(temporizador);
      document.removeEventListener("click", aoClicar, { capture: true });
      document.removeEventListener("visibilitychange", aoOcultar);
      window.removeEventListener("pagehide", enviarFila);
    };
  }, []);

  return null;
}
