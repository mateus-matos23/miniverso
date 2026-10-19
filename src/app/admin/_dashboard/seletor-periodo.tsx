import Link from "next/link";

import { cn } from "@/lib/utils";
import { PERIODOS, type Periodo } from "./periodo";

export function SeletorPeriodo({ atual }: { atual: Periodo }) {
  return (
    <nav
      aria-label="Período do painel"
      className="inline-flex rounded-lg bg-muted p-1"
    >
      {PERIODOS.map((periodo) => {
        const ativo = periodo === atual;

        return (
          <Link
            aria-current={ativo ? "true" : undefined}
            className={cn(
              "inline-flex h-9 items-center rounded-md px-3 text-sm font-medium transition-colors",
              ativo
                ? "bg-card text-heading shadow-xs"
                : "text-muted-foreground hover:text-heading",
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
