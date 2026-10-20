import {
  EsqueletoCabecalho,
  EsqueletoTela,
  repetir,
} from "@/components/admin/admin-skeleton";
import { superficie } from "@/components/admin/panel";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/** Espelha a mídia: área de envio e a grade da biblioteca. */
export default function MidiaLoading() {
  return (
    <EsqueletoTela>
      <EsqueletoCabecalho />

      <section className={cn(superficie, "mt-6 p-5 sm:p-6")}>
        <Skeleton className="mb-4 h-6 w-36" />
        <Skeleton className="h-32 w-full" />
      </section>

      <section className={cn(superficie, "mt-6 p-5 sm:p-6")}>
        <Skeleton className="mb-4 h-6 w-28" />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {repetir(6, "item").map((chave) => (
            <li className={cn(superficie, "overflow-hidden")} key={chave}>
              <Skeleton className="aspect-video w-full rounded-none" />
              <div className="flex flex-col gap-2 p-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </li>
          ))}
        </ul>
      </section>
    </EsqueletoTela>
  );
}
