import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function AdminPage({
  children,
  ampla = false,
}: {
  children: ReactNode;
  /** Telas de edição com várias colunas (ex.: editor da página inicial). */
  ampla?: boolean;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 py-6 sm:px-6 lg:px-8 lg:py-8",
        ampla ? "max-w-admin-wide" : "max-w-admin",
      )}
    >
      {children}
    </div>
  );
}

export function PageHeader({
  title,
  description,
  actions,
  eyebrow,
  meta,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  eyebrow?: ReactNode;
  /** Números de contexto exibidos abaixo da descrição (ex.: "12 projetos · 8 publicados"). */
  meta?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        {eyebrow}
        <h1 className="font-display text-4xl leading-none font-bold text-heading sm:text-5xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            {description}
          </p>
        ) : null}
        {meta ? (
          <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-medium text-body tabular-nums">
            {meta}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>
      ) : null}
    </div>
  );
}
