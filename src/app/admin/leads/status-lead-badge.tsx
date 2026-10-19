import type { VariantProps } from "class-variance-authority";

import { Badge, type badgeVariants } from "@/components/ui/badge";

import { rotulosStatusLead, type StatusLead } from "./rotulos";

type VarianteBadge = NonNullable<VariantProps<typeof badgeVariants>["variant"]>;

const variantes: Record<StatusLead, VarianteBadge> = {
  novo: "info",
  em_contato: "warning",
  convertido: "success",
  arquivado: "outline",
};

export function StatusLeadBadge({ status }: { status: string }) {
  const chave = status as StatusLead;

  return (
    <Badge
      className="h-6 font-semibold"
      dot
      variant={variantes[chave] ?? "outline"}
    >
      {rotulosStatusLead[chave] ?? status}
    </Badge>
  );
}
