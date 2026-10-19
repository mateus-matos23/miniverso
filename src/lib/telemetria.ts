import { createHash } from "node:crypto";

/**
 * Helpers da telemetria anônima. Só para o servidor (Route Handlers e Server
 * Actions): o salt vem de `TELEMETRIA_SALT` e nunca pode ir para o client.
 */

const saltPadrao = "miniverso-telemetria-local";
let avisouSaltAusente = false;

type LeitorDeCabecalhos = { get(nome: string): string | null };

function salt(): string {
  const valor = process.env.TELEMETRIA_SALT;

  if (valor) return valor;

  if (!avisouSaltAusente) {
    avisouSaltAusente = true;
    console.warn(
      "[telemetria] TELEMETRIA_SALT não definido; usando salt de desenvolvimento.",
    );
  }

  return saltPadrao;
}

/** Data do dia no fuso de Fortaleza, no formato YYYY-MM-DD. */
function diaEmFortaleza(agora: Date): string {
  const partes = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Fortaleza",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(agora);

  const ano = partes.find((p) => p.type === "year")?.value;
  const mes = partes.find((p) => p.type === "month")?.value;
  const dia = partes.find((p) => p.type === "day")?.value;

  return `${ano}-${mes}-${dia}`;
}

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
    .update(`${ip}|${userAgent}|${diaEmFortaleza(agora)}|${salt()}`)
    .digest("hex");
}

/** IP do cliente: primeiro valor de x-forwarded-for, depois x-real-ip. */
export function ipDaRequisicao(headers: LeitorDeCabecalhos): string {
  const encaminhado = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
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
