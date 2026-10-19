import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Classes da superfície padrão do admin, para quem não pode usar `Painel` (ex.: `<li>`, `<article>`). */
export const superficie =
  "rounded-xl border border-border/80 bg-card shadow-xs shadow-brand-violet/5";

/**
 * Superfície padrão das telas do admin: cartão com cabeçalho opcional
 * (título, descrição e ação à direita). Use `semPadding` para tabelas e
 * listas que encostam nas bordas.
 */
export function Painel({
  titulo,
  descricao,
  acao,
  semPadding = false,
  className,
  conteudoClassName,
  children,
  ...props
}: {
  titulo?: ReactNode;
  descricao?: ReactNode;
  acao?: ReactNode;
  semPadding?: boolean;
  className?: string;
  conteudoClassName?: string;
  children: ReactNode;
} & Omit<ComponentProps<"section">, "title" | "children">) {
  const temCabecalho = Boolean(titulo || descricao || acao);

  return (
    <section
      className={cn(superficie, "flex min-w-0 flex-col", className)}
      {...props}
    >
      {temCabecalho ? (
        <header
          className={cn(
            "flex items-start justify-between gap-4 px-5 pt-5 sm:px-6",
            semPadding && "border-b border-border/80 pb-4",
          )}
        >
          <div className="min-w-0 flex-1">
            {titulo ? (
              <h2 className="text-base font-semibold text-heading">{titulo}</h2>
            ) : null}
            {descricao ? (
              <p className="mt-1 text-sm text-muted-foreground">{descricao}</p>
            ) : null}
          </div>
          {acao ? <div className="flex shrink-0 gap-2">{acao}</div> : null}
        </header>
      ) : null}
      <div
        className={cn(
          "min-w-0 flex-1",
          !semPadding && "p-5 sm:p-6",
          !semPadding && temCabecalho && "pt-4 sm:pt-4",
          conteudoClassName,
        )}
      >
        {children}
      </div>
    </section>
  );
}
