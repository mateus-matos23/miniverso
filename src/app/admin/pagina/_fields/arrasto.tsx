"use client";

import { GripVerticalIcon } from "lucide-react";
import { DropIndicator, type DropTarget } from "react-aria-components";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Classes dos itens arrastáveis das listas do editor. A opacidade mostra o item
 * que está sendo arrastado; a borda mostra o item sob o cursor.
 */
export const classesItemArrastavel = cn(
  "data-dragging:opacity-60",
  "data-drop-target:border-brand-cyan data-drop-target:bg-brand-cyan/10",
);

/**
 * Alça de arrasto. É o único elemento que inicia o arrasto, então não disputa
 * cliques e digitação dentro da linha. Para teclado e leitor de tela, o Enter
 * nela entra no modo de arrasto do React Aria.
 */
export function AlcaArrasto({ label }: { label: string }) {
  return (
    <Button
      slot="drag"
      aria-label={label}
      variant="ghost"
      size="icon-sm"
      className="cursor-grab"
    >
      <GripVerticalIcon aria-hidden="true" />
    </Button>
  );
}

/** Linha de inserção entre dois itens. Só aparece quando é o alvo do arrasto. */
export function IndicadorArrasto({ target }: { target: DropTarget }) {
  return (
    <DropIndicator
      target={target}
      className={({ isDropTarget }) =>
        cn(
          "h-0.5 rounded-full bg-brand-cyan",
          isDropTarget ? "block" : "hidden",
        )
      }
    />
  );
}

/** Dados de um item arrastado: um valor por formato MIME, ex.: "text/plain". */
type ItemArrastado = Record<string, string>;

/** Chip mostrado sob o cursor enquanto um item é arrastado. */
export function PreviaArrasto({ itens }: { itens: ItemArrastado[] }) {
  const primeiro = itens[0];
  const texto = primeiro?.["text/plain"];

  return (
    <div className="rounded-md border border-border bg-card px-3 py-1.5 text-sm font-semibold shadow-md">
      {texto}
      {itens.length > 1 ? (
        <span className="ml-2 text-xs text-muted-foreground">
          +{itens.length - 1}
        </span>
      ) : null}
    </div>
  );
}
