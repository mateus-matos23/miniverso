import { Skeleton } from "@/components/ui/skeleton";

import { EsqueletoCabecalho, EsqueletoTela, repetir } from "../esqueleto";

/** Espelha a tabela de projetos: miniatura, título, cliente, categoria e status. */
export default function ProjetosLoading() {
  return (
    <EsqueletoTela>
      <EsqueletoCabecalho comAcao />

      <div className="mt-8 overflow-hidden rounded-lg border border-border bg-card">
        <div className="grid grid-cols-[6rem_minmax(0,1fr)_minmax(0,10rem)_7rem_6rem] gap-4 border-b border-border bg-muted/60 px-5 py-3">
          <Skeleton className="h-4 w-14" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-14" />
        </div>
        {repetir(5, "item").map((chave) => (
          <div
            className="grid grid-cols-[6rem_minmax(0,1fr)_minmax(0,10rem)_7rem_6rem] items-center gap-4 border-b border-border px-5 py-4 last:border-b-0"
            key={chave}
          >
            <Skeleton className="aspect-video w-20" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>
    </EsqueletoTela>
  );
}
