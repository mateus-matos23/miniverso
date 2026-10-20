import { after } from "next/server";
import { registrarTelemetria } from "@/features/telemetry/data";
import { type LoteTelemetria, loteSchema } from "@/features/telemetry/schema";
import {
  dispositivoDoUserAgent,
  ehBot,
  hashVisitante,
  ipDaRequisicao,
} from "@/features/telemetry/visitor";
import { criarClienteServidor } from "@/lib/supabase/admin";
import type { Json } from "@/lib/supabase/database";

// Corpo máximo aceito. Lotes reais ficam bem abaixo disso (até 20 itens).
const TAMANHO_MAXIMO = 16 * 1024;

/** Grava o lote pela função `registrar_telemetria`. Falhas só são logadas. */
async function registrarLote(
  lote: LoteTelemetria,
  visitanteHash: string,
  dispositivo: string,
) {
  try {
    const { error } = await registrarTelemetria(criarClienteServidor(), {
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
