import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

import { superficie } from "../_componentes/painel";
import { EsqueletoCabecalho, EsqueletoTela, repetir } from "../esqueleto";

/** Espelha a lista de leads à esquerda e o detalhe do lead à direita. */
export default function LeadsLoading() {
  return (
    <EsqueletoTela ampla>
      <EsqueletoCabecalho comAcao />

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:items-start">
        <div className="flex min-w-0 flex-col gap-6">
          <div className="flex flex-col gap-3">
            <Skeleton className="h-11 w-full max-w-[22rem] rounded-lg" />
            <Skeleton className="h-9 w-full" />
          </div>
          <ul className="flex flex-col gap-2">
            {repetir(6, "item").map((chave) => (
              <li className={superficie} key={chave}>
                <div className="flex flex-col gap-2 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                  <Skeleton className="h-4 w-56 max-w-full" />
                  <Skeleton className="mt-1 h-6 w-24 rounded-full" />
                </div>
              </li>
            ))}
          </ul>
        </div>

        <article className={`${superficie} flex flex-col gap-6 p-5 sm:p-6`}>
          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col gap-2">
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-4 w-40" />
              </div>
              <Skeleton className="h-6 w-24 rounded-sm" />
            </div>
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-8 w-32" />
            </div>
          </div>
          <Separator />
          <div className="flex flex-col gap-4">
            <Skeleton className="h-3 w-20" />
            <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
              {repetir(3, "contato").map((chave) => (
                <div className="flex flex-col gap-2" key={chave}>
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-5 w-40 max-w-full" />
                </div>
              ))}
            </div>
          </div>
          <Separator />
          <div className="flex flex-col gap-3">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-28 w-full" />
          </div>
          <Separator />
          <div className="flex flex-col gap-5">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-10 w-full sm:w-56" />
            <Skeleton className="h-24 w-full" />
          </div>
        </article>
      </div>
    </EsqueletoTela>
  );
}
