"use client";

import type { ReactNode } from "react";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";

/**
 * Confirmação de exclusão permanente. Não fecha por clique fora nem pelo X, e o
 * foco começa em "Cancelar". `acao` roda como form action, então serve tanto
 * para `useActionState` quanto para uma função que dispara uma transição.
 */
export function ConfirmarExclusaoDialog({
  aberto,
  onAbertoChange,
  titulo,
  descricao,
  rotuloConfirmacao = "Excluir permanentemente",
  pendente = false,
  erro,
  acao,
  children,
}: {
  aberto: boolean;
  onAbertoChange: (aberto: boolean) => void;
  titulo: ReactNode;
  descricao: ReactNode;
  rotuloConfirmacao?: string;
  pendente?: boolean;
  erro?: string;
  acao: (formData: FormData) => void;
  /** Campos ocultos enviados junto com a ação, ex.: o id do registro. */
  children?: ReactNode;
}) {
  return (
    <Dialog
      isDismissable={false}
      isOpen={aberto}
      onOpenChange={(proximo) => {
        if (!proximo && !pendente) onAbertoChange(false);
      }}
      role="alertdialog"
      showCloseButton={false}
    >
      <DialogHeader>
        <DialogTitle className="text-lg font-semibold">{titulo}</DialogTitle>
        <DialogDescription>{descricao}</DialogDescription>
      </DialogHeader>
      <form action={acao} className="flex flex-col gap-4">
        {children}
        {erro ? <Alert variant="destructive">{erro}</Alert> : null}
        <DialogFooter>
          <DialogClose autoFocus isDisabled={pendente}>
            Cancelar
          </DialogClose>
          <Button
            isDisabled={pendente}
            type="submit"
            variant="destructive-solid"
          >
            {pendente ? <Spinner data-icon="inline-start" /> : null}
            {pendente ? "Excluindo…" : rotuloConfirmacao}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
