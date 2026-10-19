"use client";

import { CircleAlertIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import {
  GridList,
  GridListItem,
  type Key,
  useDragAndDrop,
} from "react-aria-components";

import { Button } from "@/components/ui/button";
import { type Secao, type TipoSecao, tiposSecao } from "@/lib/landing/schema";
import { cn } from "@/lib/utils";
import {
  AlcaArrasto,
  classesItemArrastavel,
  IndicadorArrasto,
  PreviaArrasto,
} from "./_fields/arrasto";
import { type GrupoConfig, gruposConfig, type Selecao } from "./selecao";

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
                "flex items-center gap-1 rounded-md border bg-card pr-1 outline-none",
                "border-border data-selected:border-ring data-selected:ring-2 data-selected:ring-ring/30",
                "data-focus-visible:ring-3 data-focus-visible:ring-ring/50",
                classesItemArrastavel,
              )}
            >
              <AlcaArrasto label={`Arrastar seção ${nome}`} />
              <div
                className={cn(
                  "flex min-w-0 flex-1 flex-col items-start gap-0.5 py-2.5 text-left",
                  !secao.visivel && "text-muted-foreground",
                )}
              >
                <Rotulo nome={nome} comErro={comErro} />
                <span className="w-full truncate text-xs text-muted-foreground">
                  {secao.dados.rotulo}
                  {secao.visivel ? "" : " · oculta"}
                </span>
              </div>
              <Button
                aria-label={
                  secao.visivel
                    ? `Ocultar seção ${nome}`
                    : `Mostrar seção ${nome}`
                }
                variant="ghost"
                size="icon-sm"
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
            <li
              key={grupo}
              className={cn(
                "rounded-md border bg-card",
                selecionado
                  ? "border-ring ring-2 ring-ring/30"
                  : "border-border",
              )}
            >
              <button
                type="button"
                aria-current={selecionado ? "true" : undefined}
                onClick={() => onSelecionar({ tipo: "config", grupo })}
                className="flex w-full min-w-0 items-center rounded-md px-3 py-2.5 text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
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
