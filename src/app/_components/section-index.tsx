import { IndexLine } from "@/components/motion/index-line";
import { cn } from "@/lib/utils";

/** Índice de capítulo do percurso do visitante: "/ 02  Sobre". */
export function SectionIndex({
  number,
  children,
  className,
}: {
  number: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "flex items-center gap-3 text-label font-semibold uppercase text-muted-foreground",
        className,
      )}
    >
      <span className="text-brand-blue surface-dark:text-brand-cyan">
        / {number}
      </span>
      <IndexLine className="h-px w-8 bg-current opacity-40" />
      <span>{children}</span>
    </p>
  );
}
