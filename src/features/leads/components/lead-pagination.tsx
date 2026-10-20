import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { type FiltrosLeads, hrefLeads } from "../filters";

export function PaginacaoLeads({
  filtros,
  totalPaginas,
}: {
  filtros: FiltrosLeads;
  totalPaginas: number;
}) {
  return (
    <Pagination className="justify-between">
      <PaginationContent>
        {filtros.pagina > 1 ? (
          <PaginationItem>
            <PaginationPrevious
              aria-label="Página anterior"
              href={hrefLeads({
                ...filtros,
                pagina: filtros.pagina - 1,
              })}
              text="Anterior"
            />
          </PaginationItem>
        ) : null}
      </PaginationContent>
      <p className="text-sm text-muted-foreground tabular-nums">
        Página {filtros.pagina} de {totalPaginas}
      </p>
      <PaginationContent>
        {filtros.pagina < totalPaginas ? (
          <PaginationItem>
            <PaginationNext
              aria-label="Próxima página"
              href={hrefLeads({
                ...filtros,
                pagina: filtros.pagina + 1,
              })}
              text="Próxima"
            />
          </PaginationItem>
        ) : null}
      </PaginationContent>
    </Pagination>
  );
}
