import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// status é text no banco; qualquer valor diferente de "published" é tratado como rascunho.
const labels = {
  draft: "Rascunho",
  published: "Publicado",
} as const;

export function StatusBadge({ status }: { status: string }) {
  const isPublished = status === "published";

  return (
    <Badge
      className={cn(
        "h-6 gap-1.5 px-2 text-xs font-semibold before:size-1.5 before:rounded-full before:bg-current",
        isPublished
          ? "bg-success/10 text-success"
          : "bg-muted text-muted-foreground",
      )}
      variant="secondary"
    >
      {isPublished ? labels.published : labels.draft}
    </Badge>
  );
}
