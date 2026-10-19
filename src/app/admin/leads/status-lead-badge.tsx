import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { rotulosStatusLead, type StatusLead } from "./rotulos";

const estilos: Record<StatusLead, string> = {
  novo: "bg-brand-cyan/15 text-brand-blue",
  em_contato: "bg-brand-blue/10 text-brand-blue",
  convertido: "bg-success/10 text-success",
  arquivado: "bg-muted text-muted-foreground",
};

export function StatusLeadBadge({ status }: { status: string }) {
  const chave = status as StatusLead;

  return (
    <Badge
      className={cn(
        "h-6 gap-1.5 px-2 text-xs font-semibold before:size-1.5 before:rounded-full before:bg-current",
        estilos[chave] ?? "bg-muted text-muted-foreground",
      )}
      variant="secondary"
    >
      {rotulosStatusLead[chave] ?? status}
    </Badge>
  );
}
