"use client";

import Link from "next/link";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { formatarDataHora, formatarHora } from "@/lib/formatar";
import { cn } from "@/lib/utils";

import { CampoTexto } from "./_fields/campo-texto";

export type StatusSalvamento =
  | { tipo: "salvo"; salvoEm: string | null }
  | { tipo: "pendente" }
  | { tipo: "salvando" }
  | { tipo: "invalido" }
  | { tipo: "erro"; mensagem: string };

function textoStatus(status: StatusSalvamento): string {
  switch (status.tipo) {
    case "salvo":
      return status.salvoEm
        ? `Rascunho salvo às ${formatarHora(status.salvoEm)}`
        : "Sem alterações pendentes";
    case "pendente":
      return "Alterações não salvas";
    case "salvando":
      return "Salvando…";
    case "invalido":
      return "Corrija os campos destacados para salvar";
    case "erro":
      return status.mensagem;
  }
}

type BarraAcoesProps = {
  status: StatusSalvamento;
  temRascunho: boolean;
  publicadoEm: string | null;
  emAcao: boolean;
  onPublicar: (nota: string) => void;
  onDescartar: () => void;
};

export function BarraAcoes({
  status,
  temRascunho,
  publicadoEm,
  emAcao,
  onPublicar,
  onDescartar,
}: BarraAcoesProps) {
  const [publicarAberto, setPublicarAberto] = useState(false);
  const [descartarAberto, setDescartarAberto] = useState(false);
  const [nota, setNota] = useState("");
  // Publicar só com o rascunho salvo: o que está pendente não iria para o site.
  const podePublicar = temRascunho && status.tipo === "salvo" && !emAcao;

  return (
    <header className="sticky top-0 z-20 flex flex-col gap-4 border-b border-border bg-admin-canvas py-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex min-w-0 flex-col gap-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <p
            aria-live="polite"
            className={cn(
              "text-sm font-medium",
              status.tipo === "erro" || status.tipo === "invalido"
                ? "text-destructive"
                : "text-muted-foreground",
            )}
          >
            {textoStatus(status)}
          </p>
          {temRascunho ? (
            <Badge variant="outline">Alterações não publicadas</Badge>
          ) : null}
        </div>
        {publicadoEm ? (
          <p className="text-xs text-muted-foreground">
            Publicado em {formatarDataHora(publicadoEm)}
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Link
          className={buttonVariants({ variant: "ghost" })}
          href="/admin/pagina/historico"
        >
          Histórico
        </Link>
        {temRascunho ? (
          <Button
            variant="outline"
            isDisabled={emAcao}
            onPress={() => setDescartarAberto(true)}
          >
            Descartar rascunho
          </Button>
        ) : null}
        <Button
          isDisabled={!podePublicar}
          onPress={() => setPublicarAberto(true)}
        >
          {emAcao ? <Spinner data-icon="inline-start" /> : null}
          Publicar
        </Button>
      </div>

      <Dialog isOpen={publicarAberto} onOpenChange={setPublicarAberto}>
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Publicar a página inicial?
          </DialogTitle>
          <DialogDescription>
            O rascunho atual passa a ser o conteúdo do site. A versão anterior
            fica no histórico.
          </DialogDescription>
        </DialogHeader>
        <CampoTexto
          id="nota-versao"
          rotulo="Nota da versão (opcional)"
          max={200}
          valor={nota}
          onChange={setNota}
        />
        <DialogFooter>
          <Button variant="outline" onPress={() => setPublicarAberto(false)}>
            Cancelar
          </Button>
          <Button
            isDisabled={emAcao}
            onPress={() => {
              onPublicar(nota.trim());
              setPublicarAberto(false);
              setNota("");
            }}
          >
            Publicar
          </Button>
        </DialogFooter>
      </Dialog>

      <Dialog
        isOpen={descartarAberto}
        onOpenChange={setDescartarAberto}
        role="alertdialog"
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Descartar o rascunho?
          </DialogTitle>
          <DialogDescription>
            As alterações não publicadas são apagadas e o site continua com a
            última versão publicada.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onPress={() => setDescartarAberto(false)}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onPress={() => {
              onDescartar();
              setDescartarAberto(false);
            }}
          >
            Descartar
          </Button>
        </DialogFooter>
      </Dialog>
    </header>
  );
}
