import {
  ActivityIcon,
  ArrowRightIcon,
  InboxIcon,
  NotebookPenIcon,
} from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import type { Resultado } from "../data";
import { rotulosDispositivo } from "../labels";
import type { WebVitalsLinha } from "../schema";
import {
  AMOSTRAS_MINIMAS,
  classificarMetrica,
  formatarValorMetrica,
  METRICAS_CORE,
  type Metrica,
  rotulosMetrica,
} from "../web-vitals";

// Tom de atenção usa o violeta da marca (o manual não tem amarelo); ver --warning em globals.css.
const estiloIconePorTom: Record<"aviso" | "info", string> = {
  aviso: "bg-warning/10 text-warning",
  info: "bg-accent text-primary",
};

const estiloFaixaPorTom: Record<"aviso" | "info", string> = {
  aviso: "border-warning/30",
  info: "border-border",
};

type Alerta = {
  id: string;
  texto: string;
  href: string;
  rotuloLink: string;
  icone: typeof InboxIcon;
  tom: "aviso" | "info";
};

export function AlertasTopo({
  rascunhoPendente,
  leadsNovos,
  vitals,
}: {
  rascunhoPendente: Resultado<boolean>;
  leadsNovos: Resultado<number>;
  vitals: Resultado<WebVitalsLinha[]>;
}) {
  const alertas: Alerta[] = [];

  // Falhas de bloco não geram alerta aqui: cada seção mostra o próprio aviso de erro.
  if (rascunhoPendente.ok && rascunhoPendente.dados) {
    alertas.push({
      id: "rascunho",
      texto: "Há alterações não publicadas na página inicial",
      href: "/admin/pagina",
      rotuloLink: "Revisar e publicar",
      icone: NotebookPenIcon,
      tom: "info",
    });
  }

  if (leadsNovos.ok && leadsNovos.dados > 0) {
    const quantidade = leadsNovos.dados;
    alertas.push({
      id: "leads",
      texto: `${quantidade} ${quantidade === 1 ? "lead novo aguardando" : "leads novos aguardando"} resposta`,
      href: "/admin/leads?status=novo",
      rotuloLink: "Ver leads novos",
      icone: InboxIcon,
      tom: "info",
    });
  }

  if (vitals.ok) {
    const ruins = vitals.dados.filter(
      (linha) =>
        METRICAS_CORE.includes(linha.metrica as Metrica) &&
        linha.amostras >= AMOSTRAS_MINIMAS &&
        classificarMetrica(linha.metrica as Metrica, linha.p75) === "ruim",
    );

    for (const linha of ruins) {
      const metrica = linha.metrica as Metrica;
      alertas.push({
        id: `vitals-${metrica}-${linha.dispositivo}`,
        texto: `Desempenho ruim: ${metrica} (${rotulosMetrica[metrica].nome.toLowerCase()}) com p75 de ${formatarValorMetrica(metrica, linha.p75)} no ${rotulosDispositivo[linha.dispositivo] ?? linha.dispositivo}`,
        href: "#desempenho",
        rotuloLink: "Ver desempenho",
        icone: ActivityIcon,
        tom: "aviso",
      });
    }
  }

  if (alertas.length === 0) return null;

  return (
    <section aria-label="Alertas">
      <ul className="flex flex-col gap-2">
        {alertas.map((alerta) => {
          const Icone = alerta.icone;
          return (
            <li
              className={cn(
                "flex flex-col gap-3 rounded-xl border bg-card px-4 py-3 sm:flex-row sm:items-center sm:justify-between",
                estiloFaixaPorTom[alerta.tom],
              )}
              key={alerta.id}
            >
              <div className="flex min-w-0 items-center gap-3">
                <span
                  aria-hidden="true"
                  className={cn(
                    "grid size-8 shrink-0 place-items-center rounded-lg",
                    estiloIconePorTom[alerta.tom],
                  )}
                >
                  <Icone className="size-4" />
                </span>
                <span className="text-sm font-medium text-heading">
                  {alerta.texto}
                </span>
              </div>
              <Link
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "shrink-0 self-start sm:self-auto",
                )}
                href={alerta.href}
              >
                {alerta.rotuloLink}
                <ArrowRightIcon />
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
