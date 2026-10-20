import { SearchIcon } from "lucide-react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

import type { FiltrosLeads } from "../filters";

/** Busca por nome, e-mail ou escola. Mantém o status atual no envio. */
export function BuscaLeads({ filtros }: { filtros: FiltrosLeads }) {
  return (
    <search className="w-full">
      <form action="/admin/leads">
        {filtros.status !== "todos" ? (
          <input name="status" type="hidden" value={filtros.status} />
        ) : null}
        <InputGroup>
          <InputGroupAddon>
            <SearchIcon aria-hidden="true" />
          </InputGroupAddon>
          <InputGroupInput
            aria-label="Buscar por nome, e-mail ou escola"
            defaultValue={filtros.q}
            name="q"
            placeholder="Nome, e-mail ou escola"
            type="search"
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton size="xs" type="submit" variant="default">
              Buscar
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </form>
    </search>
  );
}
