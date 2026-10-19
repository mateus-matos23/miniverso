import { Skeleton } from "@/components/ui/skeleton";

import { EsqueletoCabecalho, EsqueletoTela, repetir } from "../esqueleto";

/** Espelha a lista de leads à esquerda e o detalhe do lead à direita. */
export default function LeadsLoading() {
  return (
    <EsqueletoTela ampla>
      <EsqueletoCabecalho comAcao />

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:items-start">
        <div className="flex min-w-0 flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            {repetir(5, "item").map((chave) => (
              <Skeleton className="h-8 w-20 rounded-full" key={chave} />
            ))}
          </div>
          <ul className="flex flex-col gap-2">
            {repetir(6, "item").map((chave) => (
              <li
                className="flex flex-col gap-2 rounded-lg border border-border bg-card p-4"
                key={chave}
              >
                <div className="flex items-center justify-between gap-3">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <Skeleton className="h-4 w-56 max-w-full" />
              </li>
            ))}
          </ul>
        </div>

        <article className="flex flex-col gap-8 rounded-lg border border-border bg-card p-6 sm:p-8">
          <div className="flex flex-col gap-3 border-b border-border pb-6">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
          <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
            {repetir(4, "item").map((chave) => (
              <div className="flex flex-col gap-2" key={chave}>
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-5 w-40 max-w-full" />
              </div>
            ))}
          </dl>
          <div className="flex flex-col gap-3">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-28 w-full" />
          </div>
        </article>
      </div>
    </EsqueletoTela>
  );
}
