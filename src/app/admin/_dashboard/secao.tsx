import { TriangleAlertIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function Secao({
  id,
  titulo,
  descricao,
  className,
  children,
}: {
  id: string;
  titulo: string;
  descricao?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={id} className={cn("mt-12", className)}>
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-brand-violet" id={id}>
          {titulo}
        </h2>
        {descricao ? (
          <p className="mt-1 max-w-[46rem] text-sm text-muted-foreground">
            {descricao}
          </p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

/** Aviso de bloco que falhou. Os demais blocos continuam funcionando. */
export function AvisoBloco({ texto }: { texto: string }) {
  return (
    <p
      className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
      role="alert"
    >
      <TriangleAlertIcon aria-hidden="true" className="size-4 shrink-0" />
      {texto}
    </p>
  );
}
