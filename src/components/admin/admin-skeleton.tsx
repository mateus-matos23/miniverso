import type { ReactNode } from "react";
import { AdminPage } from "@/components/admin/page-header";
import { superficie } from "@/components/admin/panel";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

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
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 flex-col gap-3">
        {children}
        <Skeleton className="h-10 w-56 max-w-full sm:h-12" />
        {comDescricao ? <Skeleton className="h-4 w-96 max-w-full" /> : null}
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
    <section className={cn("mt-8", className)}>
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

/**
 * Espelha os editores de página e configurações: seções ou grupos à esquerda,
 * campos no meio e prévia à direita, em três colunas.
 */
export function EsqueletoEditor({ quantidade }: { quantidade: number }) {
  return (
    <EsqueletoTela ampla>
      <EsqueletoCabecalho />

      <div className="mt-6 grid gap-6 grid-editor">
        <aside className="flex flex-col gap-2">
          <EsqueletoLinhas quantidade={quantidade} altura="h-10" />
        </aside>

        <div className={cn(superficie, "flex flex-col gap-4 p-5 sm:p-6")}>
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-full max-w-[36rem]" />
          <Skeleton className="mt-2 h-10 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>

        <div className={cn(superficie, "flex flex-col gap-4 p-5 sm:p-6")}>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="aspect-video w-full" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-3/5" />
        </div>
      </div>
    </EsqueletoTela>
  );
}

/** Espelha os formulários de projeto (novo e edição): campos à esquerda e mídia à direita. */
export function EsqueletoFormularioProjeto({
  quantidadeCampos,
}: {
  quantidadeCampos: number;
}) {
  return (
    <EsqueletoTela>
      <div className="flex flex-col gap-3">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-10 w-56 max-w-full sm:h-12" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
        <div className="flex flex-col gap-5">
          {repetir(quantidadeCampos, "campo").map((chave) => (
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
