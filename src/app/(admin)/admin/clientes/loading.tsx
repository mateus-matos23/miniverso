import {
  EsqueletoCabecalho,
  EsqueletoTela,
  repetir,
} from "@/components/admin/admin-skeleton";
import { superficie } from "@/components/admin/panel";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/** Espelha a lista empilhada (abaixo de lg) e a tabela de clientes (a partir de lg). */
export default function ClientesLoading() {
  return (
    <EsqueletoTela>
      <EsqueletoCabecalho comAcao />
      <Skeleton className="mt-3 h-5 w-48" />

      <div className="mt-6 flex flex-col gap-3 lg:hidden">
        {repetir(4, "cartao").map((chave) => (
          <div
            className={cn(superficie, "flex items-center gap-4 p-4")}
            key={chave}
          >
            <Skeleton className="size-14 shrink-0 rounded-lg" />
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
            <Skeleton className="size-8 shrink-0" />
          </div>
        ))}
      </div>

      <div className={cn(superficie, "mt-6 hidden overflow-hidden lg:block")}>
        <div className="grid grid-cols-[3rem_6rem_minmax(0,1fr)_7rem_5rem_5rem] items-center gap-4 border-b border-border/80 bg-muted/50 px-5 py-3">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-3 w-14" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-14" />
          <Skeleton className="h-3 w-14" />
          <Skeleton className="h-3 w-14" />
        </div>
        {repetir(5, "item").map((chave) => (
          <div
            className="grid grid-cols-[3rem_6rem_minmax(0,1fr)_7rem_5rem_5rem] items-center gap-4 border-b border-border/70 px-5 py-4 last:border-b-0"
            key={chave}
          >
            <Skeleton className="size-8" />
            <Skeleton className="size-14 rounded-lg" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-4 w-6" />
            <Skeleton className="size-8" />
          </div>
        ))}
      </div>
    </EsqueletoTela>
  );
}
