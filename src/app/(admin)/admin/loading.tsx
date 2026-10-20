import {
  EsqueletoCabecalho,
  EsqueletoTela,
  repetir,
} from "@/components/admin/admin-skeleton";
import { superficie } from "@/components/admin/panel";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/** Espelha a visão geral: alertas, indicadores, tendência, leads, origem, desempenho e conteúdo. */
export default function AdminLoading() {
  return (
    <EsqueletoTela>
      <EsqueletoCabecalho comAcao />

      <div className="mt-6">
        <Skeleton className="h-14 w-full rounded-xl" />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {repetir(4, "indicador").map((chave) => (
          <div className={cn(superficie, "flex flex-col p-5")} key={chave}>
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="size-8 rounded-lg" />
            </div>
            <Skeleton className="mt-4 h-12 w-24" />
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <div
          className={cn(
            superficie,
            "flex flex-col gap-4 p-5 sm:p-6 xl:col-span-2",
          )}
        >
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-64 w-full" />
        </div>
        <div className={cn(superficie, "flex flex-col gap-4 p-5 sm:p-6")}>
          <Skeleton className="h-5 w-32" />
          {repetir(4, "lead").map((chave) => (
            <Skeleton className="h-12 w-full" key={chave} />
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-6">
        <div className={cn(superficie, "flex flex-col gap-4 p-5 sm:p-6")}>
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-40 w-full" />
        </div>
        <div className={cn(superficie, "flex flex-col gap-4 p-5 sm:p-6")}>
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>

      <div className={cn(superficie, "mt-6 flex flex-col gap-4 p-5 sm:p-6")}>
        <Skeleton className="h-5 w-64" />
        <Skeleton className="h-40 w-full" />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {repetir(3, "conteudo").map((chave) => (
          <div
            className={cn(superficie, "flex flex-col gap-4 p-5")}
            key={chave}
          >
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-4 w-28" />
          </div>
        ))}
      </div>
    </EsqueletoTela>
  );
}
