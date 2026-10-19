import { Badge } from "@/components/ui/badge";

// status é text no banco; qualquer valor diferente de "published" é tratado como rascunho.
const rotulos = {
  draft: "Rascunho",
  published: "Publicado",
} as const;

const variantes = {
  draft: "secondary",
  published: "success",
} as const;

export function StatusBadge({ status }: { status: string }) {
  const chave = status === "published" ? "published" : "draft";

  return (
    <Badge className="h-6 font-semibold" dot variant={variantes[chave]}>
      {rotulos[chave]}
    </Badge>
  );
}
