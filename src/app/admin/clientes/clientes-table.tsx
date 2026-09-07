"use client";

import { MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useActionState, useState } from "react";

import {
  type CadastroClienteState,
  type Cliente,
  excluirCliente,
} from "@/app/admin/clientes/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import ClienteForm from "./cliente-form";

export type ClienteListItem = Cliente & { logoUrl: string };

const initialState: CadastroClienteState = {};

export default function ClientesTable({
  clientes,
}: {
  clientes: ClienteListItem[];
}) {
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <>
      <Button
        className="shrink-0 rounded-[.55rem] bg-brand-blue px-4 text-[.78rem] font-bold text-brand-white hover:bg-[#1039a9]"
        onPress={() => setCreateOpen(true)}
      >
        <Plus data-icon="inline-start" size={16} aria-hidden="true" />
        Cadastrar cliente
      </Button>

      <Dialog isOpen={createOpen} onOpenChange={setCreateOpen}>
        <div className="w-full max-w-[34rem]">
          <DialogHeader>
            <DialogTitle>Cadastrar cliente</DialogTitle>
            <DialogDescription>
              Adicione a marca que vai receber os conteúdos do Miniverso.
            </DialogDescription>
          </DialogHeader>
          <ClienteForm />
        </div>
      </Dialog>

      <div className="mt-14 w-full max-[700px]:mt-10">
        {clientes.length === 0 ? (
          <div className="rounded-[.7rem] border border-dashed border-[#cdd4e2] bg-white p-10 text-center">
            <p className="font-display text-2xl text-brand-violet">
              Nenhum cliente cadastrado.
            </p>
            <p className="mt-2 text-[.85rem] text-[#6f7890]">
              Cadastre o primeiro cliente para começar.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-[.7rem] border border-[#e1e5ef] bg-white">
            <table className="w-full min-w-[620px] border-collapse text-left">
              <thead className="border-b border-[#e1e5ef] bg-[#f8f9fc]">
                <tr>
                  <th className="px-6 py-4 text-[.68rem] font-bold uppercase tracking-[.1em] text-[#7b8498]">
                    Nome
                  </th>
                  <th className="px-6 py-4 text-[.68rem] font-bold uppercase tracking-[.1em] text-[#7b8498]">
                    Logo
                  </th>
                  <th className="w-20 px-6 py-4 text-right text-[.68rem] font-bold uppercase tracking-[.1em] text-[#7b8498]">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eef0f5]">
                {clientes.map((cliente) => (
                  <ClienteRow key={cliente.id} cliente={cliente} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

function ClienteRow({ cliente }: { cliente: ClienteListItem }) {
  return (
    <tr>
      <td className="px-6 py-4 text-[.9rem] font-bold text-brand-violet">
        {cliente.nome}
      </td>
      <td className="px-6 py-4">
        <Image
          className="size-12 rounded-[.55rem] border border-[#e1e5ef] object-contain p-1"
          src={cliente.logoUrl}
          width={48}
          height={48}
          unoptimized
          alt={`Logo de ${cliente.nome}`}
        />
      </td>
      <td className="px-6 py-4 text-right">
        <ClienteActions cliente={cliente} />
      </td>
    </tr>
  );
}

function ClienteActions({ cliente }: { cliente: ClienteListItem }) {
  const [dialog, setDialog] = useState<"edit" | "delete" | null>(null);
  const [deleteState, deleteAction, deleting] = useActionState(
    excluirCliente,
    initialState,
  );

  return (
    <>
      <DropdownMenuTrigger>
        <Button
          aria-label={`Ações para ${cliente.nome}`}
          className="size-10 rounded-[.5rem] text-brand-violet hover:bg-[#eef2f9]"
          variant="ghost"
        >
          <MoreHorizontal size={18} aria-hidden="true" />
        </Button>
        <DropdownMenu>
          <DropdownMenuGroup>
            <DropdownMenuItem onAction={() => setDialog("edit")}>
              <Pencil data-icon="inline-start" size={15} />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onAction={() => setDialog("delete")}
            >
              <Trash2 data-icon="inline-start" size={15} />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenu>
      </DropdownMenuTrigger>

      <Dialog
        isOpen={dialog === "edit"}
        onOpenChange={(isOpen) => setDialog(isOpen ? "edit" : null)}
      >
        <div className="w-full max-w-[34rem]">
          <DialogHeader>
            <DialogTitle>Editar cliente</DialogTitle>
            <DialogDescription>
              Atualize os dados e, se quiser, substitua o logo atual.
            </DialogDescription>
          </DialogHeader>
          <ClienteForm cliente={cliente} />
        </div>
      </Dialog>

      <Dialog
        isOpen={dialog === "delete"}
        onOpenChange={(isOpen) => setDialog(isOpen ? "delete" : null)}
      >
        <div className="w-full max-w-[30rem]">
          <DialogHeader>
            <DialogTitle>Excluir cliente?</DialogTitle>
            <DialogDescription>
              O cliente “{cliente.nome}” e o logo enviado serão removidos.
            </DialogDescription>
          </DialogHeader>
          <form action={deleteAction} className="grid gap-4">
            <input type="hidden" name="id" value={cliente.id} />
            {deleteState.erro ? (
              <p
                className="rounded-[.45rem] bg-[#fff0f0] px-3 py-2 text-[.75rem] text-[#bd3d45]"
                role="alert"
              >
                {deleteState.erro}
              </p>
            ) : null}
            <DialogFooter>
              <DialogClose>Cancelar</DialogClose>
              <Button type="submit" variant="destructive" isDisabled={deleting}>
                {deleting ? "Excluindo..." : "Excluir cliente"}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </Dialog>
    </>
  );
}
