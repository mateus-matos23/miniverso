import "server-only";
import { createHash } from "node:crypto";
import { envServidor } from "@/config/env.server";
import { diaNoFuso } from "@/lib/format";

/**
 * Helpers da telemetria anônima. Só para o servidor (Route Handlers e Server
 * Actions): o salt vem de `TELEMETRIA_SALT` e nunca pode ir para o client.
 */

type LeitorDeCabecalhos = { get(nome: string): string | null };

/**
 * Hash diário do visitante: muda a cada dia e não identifica a pessoa.
 * Serve para contar visitantes únicos e aplicar rate limit, sem guardar IP.
 */
export function hashVisitante({
  ip,
  userAgent,
  agora = new Date(),
}: {
  ip: string;
  userAgent: string;
  agora?: Date;
}): string {
  return createHash("sha256")
    .update(
      `${ip}|${userAgent}|${diaNoFuso(agora)}|${envServidor.TELEMETRIA_SALT}`,
    )
    .digest("hex");
}

/**
 * IP do cliente: último valor de x-forwarded-for, depois x-real-ip.
 * O primeiro valor é escrito pelo próprio cliente (qualquer um forja), então
 * o último é o que o proxy mais próximo anexou. Usar o primeiro permitiria
 * burlar o rate limit trocando o IP a cada envio.
 */
export function ipDaRequisicao(headers: LeitorDeCabecalhos): string {
  const encaminhado = headers.get("x-forwarded-for")?.split(",").at(-1)?.trim();
  if (encaminhado) return encaminhado;

  const real = headers.get("x-real-ip")?.trim();
  if (real) return real;

  return "0.0.0.0";
}

export type Dispositivo = "mobile" | "tablet" | "desktop";

/** Classificação grosseira pelo User-Agent. Tablet vem antes de mobile. */
export function dispositivoDoUserAgent(userAgent: string): Dispositivo {
  if (/ipad|tablet|android(?!.*mobile)/i.test(userAgent)) return "tablet";
  if (/mobile|iphone|ipod|windows phone/i.test(userAgent)) return "mobile";
  return "desktop";
}

const padraoBot =
  /bot|crawler|spider|slurp|preview|lighthouse|headless|facebookexternalhit|curl|wget|python-requests|httpclient/i;

/** Robôs, crawlers e ferramentas de auditoria ficam fora da telemetria. */
export function ehBot(userAgent: string): boolean {
  return padraoBot.test(userAgent);
}
