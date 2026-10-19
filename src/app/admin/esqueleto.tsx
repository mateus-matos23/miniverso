import type { ReactNode } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

import { AdminPage } from "./page-header";

/**
 * Casca dos loadings do admin: mesma largura de `AdminPage` e anúncio para
 * leitores de tela. Cada tela monta o próprio esqueleto dentro dela.
 */
export function EsqueletoTela({
  ampla = false,
  children,
}: {
  ampla?: boolean;
  children: ReactNode;
}) {
  return (
    <AdminPage ampla={ampla}>
      <div aria-busy="true" aria-live="polite" className="flex flex-col">
        <span className="sr-only">Carregando…</span>
        {children}
      </div>
    </AdminPage>
  );
}

/** Espelha `PageHeader`: título, descrição e, opcionalmente, um botão de ação. */
export function EsqueletoCabecalho({
  comAcao = false,
  comDescricao = true,
  children,
}: {
  comAcao?: boolean;
  comDescricao?: boolean;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6 border-b border-border pb-8 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex min-w-0 flex-col gap-3">
        {children}
        <Skeleton className="h-11 w-56 max-w-full" />
        {comDescricao ? <Skeleton className="h-5 w-96 max-w-full" /> : null}
      </div>
      {comAcao ? <Skeleton className="h-10 w-40 shrink-0" /> : null}
    </div>
  );
}

/** Espelha as seções da visão geral: título com descrição e um bloco de conteúdo. */
export function EsqueletoSecao({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={cn("mt-12", className)}>
      <div className="mb-4 flex flex-col gap-2">
        <Skeleton className="h-6 w-44" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>
      {children}
    </section>
  );
}

/**
 * Chaves para repetir um esqueleto N vezes. A lista é fixa e não é reordenada,
 * então a posição serve de chave sem o lint de índice.
 */
export function repetir(quantidade: number, prefixo: string): string[] {
  return Array.from(
    { length: quantidade },
    (_, posicao) => `${prefixo}-${posicao}`,
  );
}

/** Linhas de tabela ou lista, com a mesma altura média dos itens reais. */
export function EsqueletoLinhas({
  quantidade = 5,
  altura = "h-14",
  className,
}: {
  quantidade?: number;
  altura?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {repetir(quantidade, "linha").map((chave) => (
        <Skeleton className={cn("w-full", altura)} key={chave} />
      ))}
    </div>
  );
}
