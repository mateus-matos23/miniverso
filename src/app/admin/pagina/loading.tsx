import { Skeleton } from "@/components/ui/skeleton";

import {
  EsqueletoCabecalho,
  EsqueletoLinhas,
  EsqueletoTela,
} from "../esqueleto";

/** Espelha o editor da página inicial: seções, campos e prévia em três colunas. */
export default function PaginaInicialLoading() {
  return (
    <EsqueletoTela ampla>
      <EsqueletoCabecalho />

      <div className="mt-8 grid gap-6 xl:grid-cols-[15rem_minmax(0,1fr)_minmax(0,26rem)] 2xl:grid-cols-[16rem_minmax(0,1fr)_minmax(0,30rem)]">
        <aside className="flex flex-col gap-2">
          <EsqueletoLinhas quantidade={8} altura="h-10" />
        </aside>

        <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-5 sm:p-6">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-full max-w-[36rem]" />
          <Skeleton className="mt-2 h-10 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>

        <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-5 sm:p-6">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="aspect-video w-full" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-3/5" />
        </div>
      </div>
    </EsqueletoTela>
  );
}
