"use client";

import {
  CheckCircle2Icon,
  ImageOffIcon,
  MoreHorizontalIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
  UsersIcon,
} from "lucide-react";
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
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";

import { PageHeader } from "../page-header";
import { StatusBadge } from "../status-badge";
import ClienteForm from "./cliente-form";

export type ClienteListItem = Cliente & { logoUrl: string | null };
export type Feedback = "criado" | "atualizado" | "excluido";

const feedbackMessages: Record<Feedback, string> = {
  criado:
    "Cliente cadastrado. Se estiver como publicado, já aparece na landing.",
  atualizado: "Alterações salvas. A landing foi atualizada.",
  excluido: "Cliente excluído permanentemente.",
};

const initialState: CadastroClienteState = {};

export default function ClientesTable({
  clientes,
  feedback,
}: {
  clientes: ClienteListItem[];
  feedback?: Feedback;
}) {
  const [createOpen, setCreateOpen] = useState(false);

  const createButton = (
    <Button onPress={() => setCreateOpen(true)}>
      <PlusIcon data-icon="inline-start" />
      Cadastrar cliente
    </Button>
  );

  return (
    <>
      <PageHeader
        actions={clientes.length > 0 ? createButton : undefined}
        description="Marcas exibidas na seção “Clientes” da landing. Só itens publicados ficam visíveis, na ordem definida aqui."
        title="Clientes"
      />

      <div aria-live="polite" className="empty:hidden">
        {feedback ? (
          <span className="mt-6 flex items-center gap-3 rounded-md border border-success/30 bg-success/5 px-4 py-3 text-sm font-medium text-success">
            <CheckCircle2Icon aria-hidden="true" className="size-4 shrink-0" />
            {feedbackMessages[feedback]}
          </span>
        ) : null}
      </div>

      <Dialog isOpen={createOpen} onOpenChange={setCreateOpen}>
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Cadastrar cliente
          </DialogTitle>
          <DialogDescription>
            Adicione a marca que aparece na landing page.
          </DialogDescription>
        </DialogHeader>
        <ClienteForm />
      </Dialog>

      <div className="mt-8">
        {clientes.length === 0 ? (
          <Empty className="border border-border bg-card">
            <EmptyHeader>
              <EmptyMedia className="bg-accent text-brand-blue" variant="icon">
                <UsersIcon />
              </EmptyMedia>
              <EmptyTitle className="text-lg font-semibold text-brand-violet">
                Nenhum cliente cadastrado
              </EmptyTitle>
              <EmptyDescription>
                Cadastre o primeiro cliente com nome e logo. Ele só aparece na
                landing quando estiver como “Publicado”.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>{createButton}</EmptyContent>
          </Empty>
        ) : (
          <>
            {/* desktop: tabela */}
            <div className="hidden overflow-hidden rounded-lg border border-border bg-card md:block">
              <table className="w-full border-collapse text-left">
                <caption className="sr-only">Clientes cadastrados</caption>
                <thead className="border-b border-border bg-muted/60 text-sm text-muted-foreground">
                  <tr>
                    <th className="w-24 px-5 py-3 font-medium" scope="col">
                      Logo
                    </th>
                    <th className="px-5 py-3 font-medium" scope="col">
                      Nome
                    </th>
                    <th className="px-5 py-3 font-medium" scope="col">
                      Status
                    </th>
                    <th
                      className="w-24 px-5 py-3 text-right font-medium"
                      scope="col"
                    >
                      Ordem
                    </th>
                    <th
                      className="w-20 px-5 py-3 text-right font-medium"
                      scope="col"
                    >
                      <span className="sr-only">Ações</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {clientes.map((cliente) => (
                    <tr key={cliente.id}>
                      <td className="px-5 py-3">
                        <Logo cliente={cliente} />
                      </td>
                      <td className="px-5 py-3 font-semibold text-brand-violet">
                        {cliente.nome}
                      </td>
                      <td className="px-5 py-3">
                        <StatusBadge status={cliente.status} />
                      </td>
                      <td className="px-5 py-3 text-right tabular-nums text-muted-foreground">
                        {cliente.ordem}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <ClienteActions cliente={cliente} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* mobile: lista empilhada */}
            <ul className="flex flex-col divide-y divide-border rounded-lg border border-border bg-card md:hidden">
              {clientes.map((cliente) => (
                <li className="flex items-center gap-4 p-4" key={cliente.id}>
                  <Logo cliente={cliente} />
                  <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                    <p className="truncate font-semibold text-brand-violet">
                      {cliente.nome}
                    </p>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <StatusBadge status={cliente.status} />
                      <span>Ordem {cliente.ordem}</span>
                    </div>
                  </div>
                  <ClienteActions cliente={cliente} />
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  );
}

function Logo({ cliente }: { cliente: ClienteListItem }) {
  return (
    <span className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-md border border-border bg-white p-1.5">
      {cliente.logoUrl ? (
        <Image
          alt={`Logo de ${cliente.nome}`}
          className="size-full object-contain"
          height={56}
          src={cliente.logoUrl}
          unoptimized
          width={56}
        />
      ) : (
        <ImageOffIcon
          aria-label="Logo indisponível"
          className="size-5 text-muted-foreground"
        />
      )}
    </span>
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
          size="icon"
          variant="ghost"
        >
          <MoreHorizontalIcon />
        </Button>
        <DropdownMenu>
          <DropdownMenuGroup>
            <DropdownMenuItem onAction={() => setDialog("edit")}>
              <PencilIcon data-icon="inline-start" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              onAction={() => setDialog("delete")}
              variant="destructive"
            >
              <Trash2Icon data-icon="inline-start" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenu>
      </DropdownMenuTrigger>

      <Dialog
        isOpen={dialog === "edit"}
        onOpenChange={(isOpen) => setDialog(isOpen ? "edit" : null)}
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Editar cliente
          </DialogTitle>
          <DialogDescription>
            Atualize os dados e, se quiser, substitua o logo atual.
          </DialogDescription>
        </DialogHeader>
        <ClienteForm cliente={cliente} />
      </Dialog>

      <Dialog
        isDismissable={false}
        isOpen={dialog === "delete"}
        onOpenChange={(isOpen) => setDialog(isOpen ? "delete" : null)}
        role="alertdialog"
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Excluir “{cliente.nome}” permanentemente?
          </DialogTitle>
          <DialogDescription>
            O cliente e o logo enviado serão apagados e sairão da landing. Essa
            ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <form action={deleteAction} className="flex flex-col gap-4">
          <input name="id" type="hidden" value={cliente.id} />
          {deleteState.erro ? (
            <p
              className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
              role="alert"
            >
              {deleteState.erro}
            </p>
          ) : null}
          <DialogFooter>
            <DialogClose autoFocus>Cancelar</DialogClose>
            <Button
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              isDisabled={deleting}
              type="submit"
            >
              {deleting ? <Spinner data-icon="inline-start" /> : null}
              {deleting ? "Excluindo…" : "Excluir permanentemente"}
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </>
  );
}
