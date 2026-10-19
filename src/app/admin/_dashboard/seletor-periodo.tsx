import Link from "next/link";

import { cn } from "@/lib/utils";
import { PERIODOS, type Periodo } from "./periodo";

export function SeletorPeriodo({ atual }: { atual: Periodo }) {
  return (
    <nav
      aria-label="Período do painel"
      className="inline-flex rounded-md border border-border bg-card p-1"
    >
      {PERIODOS.map((periodo) => {
        const ativo = periodo === atual;

        return (
          <Link
            aria-current={ativo ? "page" : undefined}
            className={cn(
              "inline-flex h-9 items-center rounded-sm px-3 text-sm font-medium transition-colors",
              ativo
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-brand-violet",
            )}
            href={`/admin?periodo=${periodo}`}
            key={periodo}
            scroll={false}
          >
            {periodo} dias
          </Link>
        );
      })}
    </nav>
  );
}
