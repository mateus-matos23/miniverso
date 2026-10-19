import { Skeleton } from "@/components/ui/skeleton";

import { EsqueletoCabecalho, EsqueletoTela, repetir } from "../esqueleto";

/** Espelha a lista empilhada (abaixo de lg) e a tabela de projetos (a partir de lg). */
export default function ProjetosLoading() {
  return (
    <EsqueletoTela>
      <EsqueletoCabecalho comAcao />

      <div className="mt-8 flex flex-col gap-3 lg:hidden">
        {repetir(4, "cartao").map((chave) => (
          <div
            className="flex items-start gap-4 rounded-lg border border-border bg-card p-4"
            key={chave}
          >
            <Skeleton className="aspect-video w-24 shrink-0" />
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
            <Skeleton className="size-9 shrink-0" />
          </div>
        ))}
      </div>

      <div className="mt-8 hidden overflow-hidden rounded-lg border border-border bg-card lg:block">
        <div className="grid grid-cols-[3rem_6rem_minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_7rem_5rem_5rem] gap-4 border-b border-border bg-muted/60 px-5 py-3">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-14" />
          <Skeleton className="h-4 w-14" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-14" />
          <Skeleton className="h-4 w-14" />
          <Skeleton className="h-4 w-14" />
        </div>
        {repetir(5, "item").map((chave) => (
          <div
            className="grid grid-cols-[3rem_6rem_minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_7rem_5rem_5rem] items-center gap-4 border-b border-border px-5 py-4 last:border-b-0"
            key={chave}
          >
            <Skeleton className="size-8" />
            <Skeleton className="aspect-video w-20" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-4 w-6" />
            <Skeleton className="size-9" />
          </div>
        ))}
      </div>
    </EsqueletoTela>
  );
}
