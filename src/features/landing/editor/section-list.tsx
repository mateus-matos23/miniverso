"use client";

import { CircleAlertIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import {
  GridList,
  GridListItem,
  type Key,
  useDragAndDrop,
} from "react-aria-components";

import { Button } from "@/components/ui/button";
import {
  AlcaArrasto,
  classesItemArrastavel,
  IndicadorArrasto,
  PreviaArrasto,
} from "@/features/landing/editor/fields/drag-handle";
import {
  type GrupoConfig,
  gruposConfig,
  type Selecao,
} from "@/features/landing/editor/selection";
import {
  type Secao,
  type TipoSecao,
  tiposSecao,
} from "@/features/landing/schema";
import { cn } from "@/lib/utils";

type ListaSecoesProps = {
  secoes: Secao[];
  selecao: Selecao;
  /** Tipos de seção que têm erro de validação, para o indicador. */
  tiposComErro: ReadonlySet<Secao["tipo"]>;
  onSelecionar: (selecao: Selecao) => void;
  onAlternarVisivel: (tipo: Secao["tipo"]) => void;
  /** Move as seções `chaves` para antes ou depois de `alvo`. */
  onReordenar: (
    chaves: Iterable<Key>,
    alvo: Key,
    posicao: "before" | "after",
  ) => void;
};

/** Rótulo do item da lista, com o indicador de erro quando houver. */
function Rotulo({ nome, comErro }: { nome: string; comErro: boolean }) {
  return (
    <span className="flex items-center gap-2 text-sm font-semibold">
      {nome}
      {comErro ? (
        <>
          <CircleAlertIcon
            aria-hidden="true"
            className="size-4 text-destructive"
          />
          <span className="sr-only">(com erros)</span>
        </>
      ) : null}
    </span>
  );
}

export function ListaSecoes({
  secoes,
  selecao,
  tiposComErro,
  onSelecionar,
  onAlternarVisivel,
  onReordenar,
}: ListaSecoesProps) {
  const selecionada = selecao.tipo === "secao" ? selecao.secao : null;

  const { dragAndDropHooks } = useDragAndDrop<Secao>({
    getItems: (_chaves, itens) =>
      itens.map((secao) => ({
        "text/plain": tiposSecao[secao.tipo].nome,
      })),
    renderDragPreview: (itens) => <PreviaArrasto itens={itens} />,
    renderDropIndicator: (target) => <IndicadorArrasto target={target} />,
    onReorder(e) {
      // Seções não se aninham: só aceita soltar entre itens.
      if (e.target.dropPosition === "on") return;
      onReordenar(e.keys, e.target.key, e.target.dropPosition);
    },
  });

  return (
    <nav aria-label="Seções da landing" className="flex flex-col gap-6">
      <GridList
        aria-label="Seções da landing, arrastáveis para reordenar"
        selectionMode="single"
        selectionBehavior="replace"
        selectedKeys={selecionada ? [selecionada] : []}
        onSelectionChange={(chaves) => {
          // A seleção vazia não tem efeito: a seção aberta continua aberta.
          if (chaves === "all") return;
          const [chave] = chaves;
          if (chave === undefined) return;
          onSelecionar({ tipo: "secao", secao: chave as TipoSecao });
        }}
        // Cada linha tem botões (arrastar, ocultar): com "tab", as setas
        // continuam navegando entre as linhas e o Tab alcança os botões.
        keyboardNavigationBehavior="tab"
        dragAndDropHooks={dragAndDropHooks}
        className="flex flex-col gap-2"
      >
        {secoes.map((secao) => {
          const nome = tiposSecao[secao.tipo].nome;
          const comErro = tiposComErro.has(secao.tipo);

          return (
            <GridListItem
              key={secao.tipo}
              id={secao.tipo}
              value={secao}
              textValue={nome}
              className={cn(
                "flex items-center gap-1 rounded-lg border border-transparent pr-1 outline-none transition-colors hover:bg-muted",
                "data-selected:border-border/80 data-selected:bg-accent data-selected:text-heading data-selected:shadow-[inset_3px_0_0_var(--color-primary)]",
                "data-focus-visible:ring-3 data-focus-visible:ring-ring/50",
                // Alça de arrasto (botão icon-sm, vinda de editor/fields/drag-handle) com 44px de alvo de toque.
                "[&_button[data-size=icon-sm]]:size-11",
                classesItemArrastavel,
              )}
            >
              <AlcaArrasto label={`Arrastar seção ${nome}`} />
              <div
                className={cn(
                  "flex min-w-0 flex-1 flex-col items-start gap-0.5 py-2 text-left",
                  !secao.visivel && "text-muted-foreground",
                )}
              >
                <Rotulo nome={nome} comErro={comErro} />
                <span className="flex w-full min-w-0 flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                  <span className="truncate">{secao.dados.rotulo}</span>
                  {secao.visivel ? null : <span>Oculta</span>}
                </span>
              </div>
              <Button
                aria-label={
                  secao.visivel
                    ? `Ocultar seção ${nome}`
                    : `Mostrar seção ${nome}`
                }
                variant="ghost"
                size="icon-lg"
                onPress={() => onAlternarVisivel(secao.tipo)}
              >
                {secao.visivel ? (
                  <EyeIcon aria-hidden="true" />
                ) : (
                  <EyeOffIcon aria-hidden="true" />
                )}
              </Button>
            </GridListItem>
          );
        })}
      </GridList>
    </nav>
  );
}

type ListaConfiguracoesProps = {
  selecao: Selecao;
  /** Grupos de configuração que têm erro de validação, para o indicador. */
  gruposComErro: ReadonlySet<GrupoConfig>;
  onSelecionar: (selecao: Selecao) => void;
};

/** Lista dos grupos de configuração do documento. Sem arrasto: a ordem é fixa. */
export function ListaConfiguracoes({
  selecao,
  gruposComErro,
  onSelecionar,
}: ListaConfiguracoesProps) {
  return (
    <nav aria-label="Configurações do site">
      <ol className="flex flex-col gap-2">
        {(Object.keys(gruposConfig) as GrupoConfig[]).map((grupo) => {
          const selecionado =
            selecao.tipo === "config" && selecao.grupo === grupo;

          return (
            <li key={grupo} className="rounded-lg">
              <button
                type="button"
                aria-current={selecionado ? "true" : undefined}
                onClick={() => onSelecionar({ tipo: "config", grupo })}
                className={cn(
                  "flex h-10 w-full min-w-0 items-center rounded-lg px-3 text-left text-sm outline-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50",
                  selecionado &&
                    "bg-accent font-medium text-heading shadow-[inset_3px_0_0_var(--color-primary)] hover:bg-accent",
                )}
              >
                <Rotulo
                  nome={gruposConfig[grupo].nome}
                  comErro={gruposComErro.has(grupo)}
                />
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
