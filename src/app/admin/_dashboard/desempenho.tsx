import { CircleCheckIcon, CircleXIcon, TriangleAlertIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Resultado } from "./dados";
import { formatarInteiro } from "./formatar";
import { rotulosDispositivo } from "./rotulos";
import type { WebVitalsLinha } from "./schemas";
import { AvisoBloco } from "./secao";
import {
  AMOSTRAS_MINIMAS,
  type Classificacao,
  classificarMetrica,
  DISPOSITIVOS_CARDS,
  formatarValorMetrica,
  METRICAS,
  type Metrica,
  rotulosClassificacao,
  rotulosMetrica,
} from "./web-vitals";

const varianteClassificacao = {
  bom: "success",
  precisa: "warning",
  ruim: "destructive",
} as const satisfies Record<Classificacao, string>;

const iconeClassificacao: Record<Classificacao, typeof CircleCheckIcon> = {
  bom: CircleCheckIcon,
  precisa: TriangleAlertIcon,
  ruim: CircleXIcon,
};

function SeloClassificacao({
  classificacao,
}: {
  classificacao: Classificacao;
}) {
  const Icone = iconeClassificacao[classificacao];
  return (
    <Badge
      className="font-semibold"
      variant={varianteClassificacao[classificacao]}
    >
      <Icone aria-hidden="true" />
      {rotulosClassificacao[classificacao]}
    </Badge>
  );
}

function LinhaDispositivo({
  metrica,
  dispositivo,
  linha,
}: {
  metrica: Metrica;
  dispositivo: string;
  linha: WebVitalsLinha | undefined;
}) {
  const rotulo = rotulosDispositivo[dispositivo] ?? dispositivo;

  if (!linha) {
    return (
      <div className="flex flex-col gap-1 border-t border-border py-3">
        <span className="text-xs font-medium text-muted-foreground">
          {rotulo}
        </span>
        <span className="text-sm text-muted-foreground">Sem dados</span>
      </div>
    );
  }

  const insuficiente = linha.amostras < AMOSTRAS_MINIMAS;

  return (
    <div className="flex flex-col gap-1.5 border-t border-border py-3">
      <span className="text-xs font-medium text-muted-foreground">
        {rotulo}
      </span>
      <span
        className={cn(
          "font-display text-3xl font-bold leading-none tabular-nums",
          insuficiente ? "text-muted-foreground" : "text-heading",
        )}
      >
        {formatarValorMetrica(metrica, linha.p75)}
      </span>
      {insuficiente ? (
        <span className="text-xs text-muted-foreground">
          Dados insuficientes ({formatarInteiro(linha.amostras)} visitas)
        </span>
      ) : (
        <>
          <SeloClassificacao
            classificacao={classificarMetrica(metrica, linha.p75)}
          />
          <span className="text-xs text-muted-foreground">
            {Math.round(linha.pct_bom)}% das visitas boas ·{" "}
            {formatarInteiro(linha.amostras)} visitas
          </span>
        </>
      )}
    </div>
  );
}

export function DesempenhoWebVitals({
  vitals,
}: {
  vitals: Resultado<WebVitalsLinha[]>;
}) {
  if (!vitals.ok) {
    return (
      <AvisoBloco texto="Não foi possível carregar os dados de desempenho." />
    );
  }

  const linhas = vitals.dados;
  // Tablets ficam fora dos cards: p75 não se combina entre dispositivos, então não somamos celular e tablet.
  const amostrasTablet = linhas
    .filter((linha) => linha.dispositivo === "tablet")
    .reduce((maior, linha) => Math.max(maior, linha.amostras), 0);

  return (
    <div className="flex flex-col gap-4">
      <p className="max-w-[46rem] text-sm text-muted-foreground">
        O p75 é o valor abaixo do qual ficam 75% das visitas: quanto menor,
        melhor. Um p75 “bom” quer dizer que a maioria das visitas carrega e
        responde rápido.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {METRICAS.map((metrica) => (
          <Card className="flex flex-col p-5" key={metrica}>
            <h3 className="text-sm font-semibold text-foreground">
              {metrica}
              <span className="block text-xs font-normal text-muted-foreground">
                {rotulosMetrica[metrica].nome}
              </span>
            </h3>
            <p className="mt-2 text-xs text-muted-foreground">
              {rotulosMetrica[metrica].descricao}
            </p>

            {DISPOSITIVOS_CARDS.map((dispositivo) => (
              <LinhaDispositivo
                dispositivo={dispositivo}
                key={dispositivo}
                linha={linhas.find(
                  (linha) =>
                    linha.metrica === metrica &&
                    linha.dispositivo === dispositivo,
                )}
                metrica={metrica}
              />
            ))}
          </Card>
        ))}
      </div>

      {amostrasTablet > 0 ? (
        <p className="text-xs text-muted-foreground">
          Os cards mostram celular e desktop. Há{" "}
          {formatarInteiro(amostrasTablet)} visitas em tablet no período, que
          não entram nesses valores.
        </p>
      ) : null}
    </div>
  );
}
