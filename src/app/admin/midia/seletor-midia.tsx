"use client";

import { ImageIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { GridList, GridListItem } from "react-aria-components";

import { listarMidias, type MidiaBiblioteca } from "@/app/admin/midia/actions";
import { EnviarMidia } from "@/app/admin/midia/enviar-midia";
import { MiniaturaMidia } from "@/app/admin/midia/miniatura-midia";
import { rotuloTipoMidia, type TipoMidia } from "@/app/admin/midia/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FieldError } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import type { MidiaRef } from "@/lib/landing/schema";
import { cn } from "@/lib/utils";

/**
 * Escolha de uma mídia da biblioteca para um campo de formulário. O valor é a
 * referência (`MidiaRef`) que a landing guarda no documento.
 */
export function SeletorMidia({
  id,
  rotulo,
  tipo,
  valor,
  onChange,
  erro,
  descricao,
}: {
  id: string;
  rotulo: string;
  tipo?: TipoMidia;
  valor: MidiaRef | null | undefined;
  onChange: (midia: MidiaRef | null) => void;
  erro?: string;
  descricao?: string;
}) {
  const rotuloId = `${id}-rotulo`;
  const descricaoId = `${id}-descricao`;
  const erroId = `${id}-erro`;
  const [aberto, setAberto] = useState(false);
  const [midias, setMidias] = useState<MidiaBiblioteca[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [falhou, setFalhou] = useState(false);
  const nomeTipo = tipo ? rotuloTipoMidia[tipo].toLowerCase() : "mídia";

  const descrevidoPor =
    [descricao ? descricaoId : null, erro ? erroId : null]
      .filter(Boolean)
      .join(" ") || undefined;

  async function carregar(abrir: boolean) {
    setAberto(abrir);
    if (!abrir) return;

    setCarregando(true);
    setFalhou(false);

    try {
      setMidias(await listarMidias(tipo));
    } catch {
      setFalhou(true);
    } finally {
      setCarregando(false);
    }
  }

  function selecionar(midia: MidiaBiblioteca) {
    onChange({
      id: midia.id,
      url: midia.url,
      tipo: midia.tipo,
      alt: midia.alt,
      largura: midia.largura,
      altura: midia.altura,
    });
    setAberto(false);
  }

  return (
    <fieldset
      id={id}
      aria-describedby={descrevidoPor}
      className="flex min-w-0 flex-col gap-3 border-0 p-0"
    >
      <legend
        id={rotuloId}
        className="mb-1 p-0 text-sm font-semibold text-brand-black"
      >
        {rotulo}
      </legend>
      {descricao ? (
        <p id={descricaoId} className="-mt-2 text-sm text-muted-foreground">
          {descricao}
        </p>
      ) : null}
      <div
        className={cn(
          "flex flex-col gap-3 rounded-lg border bg-card p-3 sm:flex-row sm:items-center",
          erro ? "border-destructive/40" : "border-border",
        )}
      >
        <div className="w-full shrink-0 sm:w-40">
          {valor ? (
            <MiniaturaMidia midia={valor} className="rounded-md" />
          ) : (
            <div
              className="flex aspect-[4/3] w-full items-center justify-center rounded-md border border-dashed border-border bg-muted text-muted-foreground"
              aria-hidden="true"
            >
              <ImageIcon className="size-6" />
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          {valor ? (
            <p className="text-sm text-muted-foreground">
              {rotuloTipoMidia[valor.tipo]}
              {valor.alt ? (
                <span className="block truncate text-brand-black">
                  {valor.alt}
                </span>
              ) : (
                <span className="block font-medium text-destructive">
                  Sem texto alternativo
                </span>
              )}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Nenhuma {nomeTipo} escolhida.
            </p>
          )}

          <div className="flex flex-wrap gap-2">
            <DialogTrigger isOpen={aberto} onOpenChange={carregar}>
              <Button type="button" variant="outline" size="sm">
                Escolher da biblioteca
              </Button>
              <Dialog className="sm:max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Escolher {nomeTipo}</DialogTitle>
                  <DialogDescription>
                    Selecione um item da biblioteca ou envie um novo arquivo.
                  </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-6">
                  <EnviarMidia
                    tipo={tipo}
                    onEnviada={(midia) => {
                      onChange(midia);
                      setAberto(false);
                    }}
                  />

                  {carregando ? (
                    <p className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Spinner /> Carregando biblioteca…
                    </p>
                  ) : falhou ? (
                    <p className="text-sm text-destructive" role="alert">
                      Não foi possível carregar a biblioteca. Feche e tente de
                      novo.
                    </p>
                  ) : midias.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Nenhuma {nomeTipo} na biblioteca ainda.
                    </p>
                  ) : (
                    <GridList
                      aria-label="Itens da biblioteca"
                      className="grid max-h-[50svh] grid-cols-2 gap-3 overflow-y-auto sm:grid-cols-3"
                      disallowEmptySelection
                      layout="grid"
                      onSelectionChange={(chaves) => {
                        if (chaves === "all") return;
                        const escolhida = midias.find(
                          (midia) => midia.id === [...chaves][0],
                        );
                        if (escolhida) selecionar(escolhida);
                      }}
                      selectedKeys={valor ? [valor.id] : []}
                      selectionBehavior="replace"
                      selectionMode="single"
                    >
                      {midias.map((midia) => {
                        const rotulo = `Escolher ${rotuloTipoMidia[midia.tipo].toLowerCase()}${midia.alt ? `: ${midia.alt}` : " (sem texto alternativo)"}`;
                        return (
                          <GridListItem
                            key={midia.id}
                            aria-label={rotulo}
                            className="w-full cursor-pointer overflow-hidden rounded-md border-2 border-transparent text-left outline-none hover:border-border data-focus-visible:ring-2 data-focus-visible:ring-ring data-selected:border-brand-blue"
                            id={midia.id}
                            textValue={rotulo}
                          >
                            <MiniaturaMidia midia={midia} />
                          </GridListItem>
                        );
                      })}
                    </GridList>
                  )}
                </div>
              </Dialog>
            </DialogTrigger>

            {valor ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onPress={() => onChange(null)}
              >
                <Trash2Icon aria-hidden="true" />
                Remover
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      <FieldError id={erroId}>{erro}</FieldError>
    </fieldset>
  );
}
