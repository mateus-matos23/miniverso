import { after } from "next/server";
import { z } from "zod";
import {
  dispositivoDoUserAgent,
  ehBot,
  hashVisitante,
  ipDaRequisicao,
} from "@/lib/telemetria";
import { criarClienteServidor } from "@/utils/supabase/admin";
import type { Json } from "@/utils/supabase/database";

// Corpo máximo aceito. Lotes reais ficam bem abaixo disso (até 20 itens).
const TAMANHO_MAXIMO = 16 * 1024;
const LIMITE_ITENS = 20;

const caminho = z.string().max(200).startsWith("/");
const textoOpcional = (max: number) => z.string().max(max).nullish();

const eventoSchema = z.object({
  tipo: z.enum(["pageview", "cta_click"]),
  caminho,
  alvo: textoOpcional(80),
  referrer_host: textoOpcional(200),
  utm_source: textoOpcional(100),
  utm_medium: textoOpcional(100),
  utm_campaign: textoOpcional(100),
});

const vitalSchema = z.object({
  metrica: z.enum(["LCP", "INP", "CLS", "FCP", "TTFB"]),
  valor: z.number().finite().nonnegative(),
  rating: z.enum(["good", "needs-improvement", "poor"]),
  navegacao: textoOpcional(30),
  caminho,
  versao_id: textoOpcional(36),
});

const loteSchema = z
  .object({
    eventos: z.array(eventoSchema).max(LIMITE_ITENS).default([]),
    vitals: z.array(vitalSchema).max(LIMITE_ITENS).default([]),
  })
  .refine((lote) => lote.eventos.length + lote.vitals.length <= LIMITE_ITENS, {
    message: "O lote deve ter no máximo 20 itens no total.",
  });

type Lote = z.infer<typeof loteSchema>;

/** Grava o lote pela função `registrar_telemetria`. Falhas só são logadas. */
async function registrarLote(
  lote: Lote,
  visitanteHash: string,
  dispositivo: string,
) {
  try {
    const { error } = await criarClienteServidor().rpc("registrar_telemetria", {
      p_visitante_hash: visitanteHash,
      p_dispositivo: dispositivo,
      p_eventos: lote.eventos as unknown as Json,
      p_vitals: lote.vitals as unknown as Json,
    });

    if (error) {
      console.error("[telemetria] falha ao registrar o lote", error);
    }
  } catch (error) {
    console.error("[telemetria] falha ao registrar o lote", error);
  }
}

/**
 * Recebe o lote de eventos e Web Vitals enviado pelo client (sendBeacon).
 * Responde 204 sempre e rápido: a gravação roda depois da resposta, com `after`.
 * Hash e dispositivo são calculados aqui, nunca vindos do client.
 */
export async function POST(request: Request) {
  const semConteudo = () => new Response(null, { status: 204 });

  try {
    const tamanhoInformado = Number(request.headers.get("content-length"));
    if (tamanhoInformado > TAMANHO_MAXIMO) return semConteudo();

    const texto = await request.text();
    if (Buffer.byteLength(texto) > TAMANHO_MAXIMO) return semConteudo();

    const userAgent = request.headers.get("user-agent") ?? "";
    if (ehBot(userAgent)) return semConteudo();

    let corpo: unknown;
    try {
      corpo = JSON.parse(texto);
    } catch {
      return semConteudo();
    }

    const resultado = loteSchema.safeParse(corpo);
    if (!resultado.success) {
      console.error(
        "[telemetria] lote inválido descartado",
        resultado.error.issues,
      );
      return semConteudo();
    }

    const visitanteHash = hashVisitante({
      ip: ipDaRequisicao(request.headers),
      userAgent,
    });
    const dispositivo = dispositivoDoUserAgent(userAgent);
    const lote = resultado.data;

    after(() => registrarLote(lote, visitanteHash, dispositivo));

    return semConteudo();
  } catch (error) {
    console.error("[telemetria] falha ao processar a requisição", error);
    return semConteudo();
  }
}
