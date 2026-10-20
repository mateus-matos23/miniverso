"use client";

import { PlusIcon, Trash2Icon } from "lucide-react";
import { type ReactNode, useRef, useState } from "react";
import {
  GridList,
  GridListItem,
  type Key,
  useDragAndDrop,
} from "react-aria-components";

import { Button } from "@/components/ui/button";
import { FieldError, FieldLegend, FieldSet } from "@/components/ui/field";
import {
  AlcaArrasto,
  classesItemArrastavel,
  IndicadorArrasto,
  PreviaArrasto,
} from "@/features/landing/editor/fields/drag-handle";
import { mesmaOrdem, moverItens } from "@/lib/reorder";
import { cn } from "@/lib/utils";

type CampoListaProps<T> = {
  id: string;
  legenda: string;
  itens: T[];
  onChange: (itens: T[]) => void;
  /** Cria um item vazio ao clicar em "Adicionar". */
  novoItem: () => T;
  min: number;
  max: number;
  /** Rótulo do item, usado nos aria-label dos botões, ex.: "pilar". */
  nomeItem: string;
  /** Renderiza os campos de um item. `atualizar` troca só esse item. */
  renderItem: (
    item: T,
    indice: number,
    atualizar: (proximo: T) => void,
  ) => ReactNode;
  erro?: string;
};

type ParItem<T> = { chave: string; item: T };

export function CampoLista<T>({
  id,
  legenda,
  itens,
  onChange,
  novoItem,
  min,
  max,
  nomeItem,
  renderItem,
  erro,
}: CampoListaProps<T>) {
  // Os itens não têm id próprio. Cada um recebe uma chave que acompanha o item
  // ao ser reordenado, para que o foco e o estado dos campos sigam o item certo.
  const [ids, setIds] = useState(() => itens.map((_, i) => `${id}-${i}`));
  const ultimoId = useRef(itens.length);
  // Itens criados fora daqui (sem id na lista) usam uma chave pelo índice.
  const pares: ParItem<T>[] = itens.map((item, indice) => ({
    chave: ids[indice] ?? `${id}-sem-${indice}`,
    item,
  }));

  const podeRemover = itens.length > min;
  const podeAdicionar = itens.length < max;

  const rotulos = new Map(
    pares.map(({ chave }, indice) => [chave, `${nomeItem} ${indice + 1}`]),
  );

  const { dragAndDropHooks } = useDragAndDrop({
    getItems: (chaves) =>
      [...chaves].map((chave) => ({
        "text/plain": rotulos.get(String(chave)) ?? nomeItem,
      })),
    renderDragPreview: (arrastados) => <PreviaArrasto itens={arrastados} />,
    renderDropIndicator: (target) => <IndicadorArrasto target={target} />,
    onReorder(e) {
      if (e.target.dropPosition === "on") return;
      reordenar(e.keys, e.target.key, e.target.dropPosition);
    },
  });

  function novoIdItem(): string {
    ultimoId.current += 1;
    return `${id}-${ultimoId.current}`;
  }

  function atualizar(indice: number, proximo: T) {
    onChange(itens.map((item, i) => (i === indice ? proximo : item)));
  }

  function adicionar() {
    setIds([...pares.map(({ chave }) => chave), novoIdItem()]);
    onChange([...itens, novoItem()]);
  }

  function remover(indice: number) {
    const restantes = pares.filter((_, i) => i !== indice);
    setIds(restantes.map(({ chave }) => chave));
    onChange(restantes.map(({ item }) => item));
  }

  function reordenar(
    movidas: Iterable<Key>,
    alvo: Key,
    posicao: "before" | "after",
  ) {
    const proximos = moverItens(
      pares,
      ({ chave }) => chave,
      new Set(movidas),
      alvo,
      posicao,
    );
    if (mesmaOrdem(pares, proximos)) return;

    setIds(proximos.map(({ chave }) => chave));
    onChange(proximos.map(({ item }) => item));
  }

  return (
    <FieldSet className="gap-3" data-invalid={Boolean(erro) || undefined}>
      <FieldLegend variant="label">{legenda}</FieldLegend>
      <GridList
        aria-label={`${legenda}, arrastáveis para reordenar`}
        // Os campos de texto dentro de cada linha precisam receber setas e
        // digitação: com "tab", o Tab entra e sai da linha em vez de navegar.
        keyboardNavigationBehavior="tab"
        // Digitar nos campos não deve buscar linhas pelo texto.
        disallowTypeAhead
        dragAndDropHooks={dragAndDropHooks}
        className="flex flex-col gap-4"
      >
        {pares.map(({ chave, item }, indice) => (
          <GridListItem
            key={chave}
            id={chave}
            value={item}
            textValue={rotulos.get(chave)}
            className={cn(
              "flex gap-3 rounded-md border border-border bg-card p-4 outline-none data-focus-visible:ring-3 data-focus-visible:ring-ring/50",
              classesItemArrastavel,
            )}
          >
            <div className="flex shrink-0 flex-col gap-1">
              <AlcaArrasto label={`Arrastar ${nomeItem} ${indice + 1}`} />
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-4">
              {renderItem(item, indice, (proximo) =>
                atualizar(indice, proximo),
              )}
            </div>
            <div className="flex shrink-0 flex-col gap-1">
              <Button
                aria-label={`Remover ${nomeItem} ${indice + 1}`}
                variant="ghost"
                size="icon-sm"
                isDisabled={!podeRemover}
                onPress={() => remover(indice)}
              >
                <Trash2Icon aria-hidden="true" />
              </Button>
            </div>
          </GridListItem>
        ))}
      </GridList>
      {erro ? <FieldError>{erro}</FieldError> : null}
      <div>
        <Button
          variant="outline"
          size="sm"
          isDisabled={!podeAdicionar}
          onPress={adicionar}
        >
          <PlusIcon aria-hidden="true" />
          Adicionar {nomeItem}
        </Button>
      </div>
    </FieldSet>
  );
}
