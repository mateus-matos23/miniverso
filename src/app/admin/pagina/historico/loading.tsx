import { Skeleton } from "@/components/ui/skeleton";

import { EsqueletoCabecalho, EsqueletoTela, repetir } from "../../esqueleto";

/** Espelha o histórico: cartões empilhados (abaixo de lg) e tabela de versões (a partir de lg). */
export default function HistoricoPaginaLoading() {
  return (
    <EsqueletoTela>
      <EsqueletoCabecalho />

      <div className="mt-8 flex flex-col gap-3 lg:hidden">
        {repetir(4, "cartao").map((chave) => (
          <div
            className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4"
            key={chave}
          >
            <div className="flex items-center justify-between gap-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-8 w-full" />
          </div>
        ))}
      </div>

      <div className="mt-8 hidden overflow-hidden rounded-lg border border-border bg-card lg:block">
        <div className="grid grid-cols-[12rem_minmax(0,1fr)_8rem_12rem] gap-4 border-b border-border bg-muted/50 px-4 py-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-14" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-14" />
        </div>
        {repetir(4, "item").map((chave) => (
          <div
            className="grid grid-cols-[12rem_minmax(0,1fr)_8rem_12rem] items-center gap-4 border-b border-border px-4 py-4 last:border-b-0"
            key={chave}
          >
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ))}
      </div>
    </EsqueletoTela>
  );
}
