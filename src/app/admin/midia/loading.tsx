import { Skeleton } from "@/components/ui/skeleton";

import {
  EsqueletoCabecalho,
  EsqueletoSecao,
  EsqueletoTela,
  repetir,
} from "../esqueleto";

/** Espelha a mídia: área de envio e a grade da biblioteca. */
export default function MidiaLoading() {
  return (
    <EsqueletoTela>
      <EsqueletoCabecalho />

      <section className="mt-10 rounded-lg border border-border bg-card p-5 sm:p-6">
        <Skeleton className="mb-4 h-6 w-36" />
        <Skeleton className="h-32 w-full" />
      </section>

      <EsqueletoSecao className="mt-12">
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {repetir(6, "item").map((chave) => (
            <li
              className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4"
              key={chave}
            >
              <Skeleton className="aspect-video w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </li>
          ))}
        </ul>
      </EsqueletoSecao>
    </EsqueletoTela>
  );
}
