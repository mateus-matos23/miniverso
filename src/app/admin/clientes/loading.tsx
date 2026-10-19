import { Skeleton } from "@/components/ui/skeleton";

import { EsqueletoCabecalho, EsqueletoTela, repetir } from "../esqueleto";

/** Espelha a tabela de clientes (desktop) e a lista compacta (celular). */
export default function ClientesLoading() {
  return (
    <EsqueletoTela>
      <EsqueletoCabecalho comAcao />

      <div className="mt-8 overflow-hidden rounded-lg border border-border bg-card">
        <div className="grid grid-cols-[6rem_minmax(0,1fr)_minmax(0,1fr)_6rem] gap-4 border-b border-border bg-muted/60 px-5 py-3 max-md:hidden">
          <Skeleton className="h-4 w-14" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-14" />
        </div>
        {repetir(5, "item").map((chave) => (
          <div
            className="grid grid-cols-[6rem_minmax(0,1fr)_minmax(0,1fr)_6rem] items-center gap-4 border-b border-border px-5 py-4 last:border-b-0 max-md:grid-cols-[3.5rem_minmax(0,1fr)]"
            key={chave}
          >
            <Skeleton className="size-14 rounded-md" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-2/3 max-md:hidden" />
            <Skeleton className="h-8 w-16 max-md:hidden" />
          </div>
        ))}
      </div>
    </EsqueletoTela>
  );
}
