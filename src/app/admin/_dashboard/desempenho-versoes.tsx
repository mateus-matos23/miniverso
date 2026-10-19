import { TriangleAlertIcon } from "lucide-react";

import { formatarData } from "@/lib/formatar";

import type { Resultado } from "./dados";
import { formatarInteiro } from "./formatar";
import type { VersaoVitalsLinha } from "./schemas";
import { AvisoBloco } from "./secao";
import {
  AMOSTRAS_MINIMAS,
  formatarValorMetrica,
  LIMITE_PIORA,
  METRICAS_CORE,
  type Metrica,
  rotulosMetrica,
} from "./web-vitals";

type Medida = { p75: number; amostras: number };

type VersaoResumo = {
  id: string;
  publicadoEm: string | null;
  nota: string | null;
  medidas: Partial<Record<Metrica, Medida>>;
};

/** Versões com dado de celular nas métricas core, da mais nova para a mais antiga. */
function agruparPorVersao(linhas: VersaoVitalsLinha[]): VersaoResumo[] {
  const versoes = new Map<string, VersaoResumo>();

  for (const linha of linhas) {
    if (linha.dispositivo !== "mobile") continue;
    if (!METRICAS_CORE.includes(linha.metrica as Metrica)) continue;

    const versao = versoes.get(linha.versao_id) ?? {
      id: linha.versao_id,
      publicadoEm: linha.publicado_em,
      nota: linha.nota,
      medidas: {},
    };

    versao.medidas[linha.metrica as Metrica] = {
      p75: linha.p75,
      amostras: linha.amostras,
    };
    versoes.set(linha.versao_id, versao);
  }

  return [...versoes.values()];
}

/** Piorou só com amostras suficientes nas duas versões e p75 acima do limite. */
function piorou(atual: Medida | undefined, anterior: Medida | undefined) {
  if (!atual || !anterior) return false;
  if (atual.amostras < AMOSTRAS_MINIMAS || anterior.amostras < AMOSTRAS_MINIMAS)
    return false;
  return atual.p75 > anterior.p75 * (1 + LIMITE_PIORA);
}

export function DesempenhoVersoes({
  versoes,
}: {
  versoes: Resultado<VersaoVitalsLinha[]>;
}) {
  if (!versoes.ok) {
    return (
      <AvisoBloco texto="Não foi possível carregar o desempenho por versão." />
    );
  }

  const lista = agruparPorVersao(versoes.dados);

  if (lista.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Nenhuma versão publicada tem dados de celular no período.
      </p>
    );
  }

  return (
    <div className="-mx-5 overflow-x-auto px-5 sm:-mx-6 sm:px-6">
      <table className="w-full min-w-[40rem] text-left text-sm">
        <caption className="sr-only">
          Desempenho p75 no celular por versão publicada
        </caption>
        <thead className="border-b border-border text-xs text-muted-foreground">
          <tr>
            <th className="px-4 py-3 font-medium" scope="col">
              Versão publicada
            </th>
            {METRICAS_CORE.map((metrica) => (
              <th className="px-4 py-3 font-medium" key={metrica} scope="col">
                <span className="block font-semibold text-body">{metrica}</span>
                <span className="block font-normal">
                  {rotulosMetrica[metrica].nome.toLowerCase()} (celular)
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {lista.map((versao, indice) => {
            const anterior = lista[indice + 1];

            return (
              <tr
                className="border-b border-border last:border-0"
                key={versao.id}
              >
                <th className="px-4 py-3 align-top font-normal" scope="row">
                  <span className="font-medium text-foreground">
                    {versao.publicadoEm
                      ? formatarData(versao.publicadoEm)
                      : "Data desconhecida"}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    {versao.nota || "Sem nota"}
                  </span>
                </th>
                {METRICAS_CORE.map((metrica) => {
                  const medida = versao.medidas[metrica];
                  const worse = piorou(medida, anterior?.medidas[metrica]);

                  return (
                    <td className="px-4 py-3 align-top" key={metrica}>
                      {medida ? (
                        medida.amostras < AMOSTRAS_MINIMAS ? (
                          <span className="text-muted-foreground">
                            Dados insuficientes (
                            {formatarInteiro(medida.amostras)} visitas)
                          </span>
                        ) : (
                          <>
                            <span className="font-display text-xl font-bold text-heading tabular-nums">
                              {formatarValorMetrica(metrica, medida.p75)}
                            </span>
                            <span className="block text-xs text-muted-foreground">
                              {formatarInteiro(medida.amostras)} visitas
                            </span>
                          </>
                        )
                      ) : (
                        <span className="text-muted-foreground">Sem dados</span>
                      )}
                      {worse ? (
                        <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-destructive">
                          <TriangleAlertIcon
                            aria-hidden="true"
                            className="size-3.5"
                          />
                          Piorou após esta publicação
                        </span>
                      ) : null}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
