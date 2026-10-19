import { TriangleAlertIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Alert } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

import { superficie } from "../_componentes/painel";

/**
 * Bloco da visão geral. Por padrão vira um cartão (`superficie`); com
 * `semMoldura` mostra só o cabeçalho, para seções cujo conteúdo já são cartões.
 * Dentro de uma grade, passe `className="mt-0"` para o `gap` da grade mandar.
 */
export function Secao({
  id,
  titulo,
  descricao,
  acao,
  semMoldura = false,
  className,
  children,
}: {
  id: string;
  titulo: string;
  descricao?: string;
  /** Ação à direita do título (ex.: link "Ver todos"). */
  acao?: ReactNode;
  semMoldura?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      aria-labelledby={id}
      className={cn(
        "mt-6 flex min-w-0 flex-col",
        !semMoldura && superficie,
        className,
      )}
    >
      <header
        className={cn(
          "flex items-start justify-between gap-4",
          semMoldura ? "mb-4" : "px-5 pt-5 sm:px-6",
        )}
      >
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-semibold text-heading" id={id}>
            {titulo}
          </h2>
          {descricao ? (
            <p className="mt-1 max-w-[46rem] text-sm text-muted-foreground">
              {descricao}
            </p>
          ) : null}
        </div>
        {acao ? <div className="flex shrink-0 gap-2">{acao}</div> : null}
      </header>
      <div
        className={cn(
          "min-w-0 flex-1",
          !semMoldura && "px-5 pt-4 pb-5 sm:px-6 sm:pb-6",
        )}
      >
        {children}
      </div>
    </section>
  );
}

/** Aviso de bloco que falhou. Os demais blocos continuam funcionando. */
export function AvisoBloco({ texto }: { texto: string }) {
  return (
    <Alert variant="destructive">
      <TriangleAlertIcon aria-hidden="true" className="size-4 shrink-0" />
      {texto}
    </Alert>
  );
}
