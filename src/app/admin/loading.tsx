import { Skeleton } from "@/components/ui/skeleton";

import {
  EsqueletoCabecalho,
  EsqueletoSecao,
  EsqueletoTela,
  repetir,
} from "./esqueleto";

/** Espelha a visão geral: indicadores, tendência, origem, desempenho e leads. */
export default function AdminLoading() {
  return (
    <EsqueletoTela>
      <EsqueletoCabecalho comAcao />

      <div className="mt-8">
        <Skeleton className="h-16 w-full" />
      </div>

      <EsqueletoSecao>
        <dl className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 xl:grid-cols-4">
          {repetir(4, "item").map((chave) => (
            <div className="flex flex-col gap-3 bg-card p-5" key={chave}>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-9 w-20" />
            </div>
          ))}
        </dl>
      </EsqueletoSecao>

      <EsqueletoSecao>
        <Skeleton className="h-64 w-full" />
      </EsqueletoSecao>

      <EsqueletoSecao>
        <div className="grid gap-6 md:grid-cols-3">
          {repetir(3, "item").map((chave) => (
            <div
              className="flex flex-col gap-3 rounded-lg border border-border bg-card p-5"
              key={chave}
            >
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-2 w-full" />
              <Skeleton className="h-2 w-4/5" />
              <Skeleton className="h-2 w-3/5" />
            </div>
          ))}
        </div>
      </EsqueletoSecao>

      <EsqueletoSecao>
        <div className="flex flex-col gap-2">
          {repetir(5, "item").map((chave) => (
            <Skeleton className="h-14 w-full" key={chave} />
          ))}
        </div>
      </EsqueletoSecao>
    </EsqueletoTela>
  );
}
