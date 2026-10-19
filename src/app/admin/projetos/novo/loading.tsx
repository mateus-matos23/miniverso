import { Skeleton } from "@/components/ui/skeleton";

import { EsqueletoTela, repetir } from "../../esqueleto";

/** Espelha o formulário de novo projeto. */
export default function NovoProjetoLoading() {
  return (
    <EsqueletoTela>
      <div className="flex flex-col gap-6 border-b border-border pb-8">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-11 w-56 max-w-full" />
        <Skeleton className="h-5 w-96 max-w-full" />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
        <div className="flex flex-col gap-5">
          {repetir(5, "item").map((chave) => (
            <div className="flex flex-col gap-2" key={chave}>
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-3">
          <Skeleton className="aspect-video w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </EsqueletoTela>
  );
}
