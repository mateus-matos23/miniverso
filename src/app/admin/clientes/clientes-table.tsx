"use client";

import {
  GripVerticalIcon,
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
  reordenarClientes,
} from "@/app/admin/clientes/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogDescription,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { ConfirmarExclusaoDialog } from "../_componentes/confirmar-exclusao-dialog";
import { type Feedback, FeedbackBanner } from "../_componentes/feedback-banner";
import { useListaReordenavel } from "../_componentes/use-lista-reordenavel";
import { PageHeader } from "../page-header";
import { StatusBadge } from "../status-badge";
import ClienteForm from "./cliente-form";

export type { Feedback };
export type ClienteListItem = Cliente & { logoUrl: string | null };

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
  const { ordemExibida, posicoes, dragAndDropHooks, erro } =
    useListaReordenavel<ClienteListItem>({
      itens: clientes,
      rotulo: (cliente) => cliente.nome,
      reordenar: reordenarClientes,
    });

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
        description="Marcas exibidas na seção “Clientes” da landing. Só itens publicados ficam visíveis, na ordem definida aqui. No computador, arraste pela alça para reordenar."
        title="Clientes"
      />

      <FeedbackBanner feedback={feedback} mensagens={feedbackMessages} />

      {erro ? (
        <p
          className="mt-6 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
          role="alert"
        >
          {erro}
        </p>
      ) : null}

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
              <EmptyMedia variant="icon">
                <UsersIcon />
              </EmptyMedia>
              <EmptyTitle>Nenhum cliente cadastrado</EmptyTitle>
              <EmptyDescription>
                Cadastre o primeiro cliente com nome e logo. Ele só aparece na
                landing quando estiver como “Publicado”.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>{createButton}</EmptyContent>
          </Empty>
        ) : (
          <>
            <ul
              aria-label="Clientes cadastrados"
              className="flex flex-col gap-3 lg:hidden"
            >
              {ordemExibida.map((cliente) => (
                <li
                  className="flex items-center gap-4 rounded-lg border border-border bg-card p-4"
                  key={cliente.id}
                >
                  <Logo cliente={cliente} />
                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <p className="break-words font-semibold text-brand-violet">
                      {cliente.nome}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted-foreground">
                      <StatusBadge status={cliente.status} />
                      <span className="tabular-nums">
                        Ordem {posicoes.get(cliente.id)}
                      </span>
                    </div>
                  </div>
                  <ClienteActions cliente={cliente} />
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-muted-foreground lg:hidden">
              Para reordenar, use uma tela maior.
            </p>

            <div className="hidden overflow-hidden rounded-lg border border-border bg-card lg:block">
              <Table
                aria-label="Clientes cadastrados"
                className="text-left"
                dragAndDropHooks={dragAndDropHooks}
              >
                <TableHeader className="border-b border-border bg-muted/60 text-sm text-muted-foreground">
                  <TableHead
                    className="w-12 px-3 py-3 font-medium"
                    id="reordenar"
                  >
                    <span className="sr-only">Reordenar</span>
                  </TableHead>
                  <TableHead className="w-24 px-5 py-3 font-medium" id="logo">
                    Logo
                  </TableHead>
                  <TableHead
                    className="px-5 py-3 font-medium"
                    id="nome"
                    isRowHeader
                  >
                    Nome
                  </TableHead>
                  <TableHead className="px-5 py-3 font-medium" id="status">
                    Status
                  </TableHead>
                  <TableHead className="px-5 py-3 font-medium" id="ordem">
                    Ordem
                  </TableHead>
                  <TableHead
                    className="w-20 px-5 py-3 text-right font-medium"
                    id="acoes"
                  >
                    <span className="sr-only">Ações</span>
                  </TableHead>
                </TableHeader>
                <TableBody items={ordemExibida}>
                  {(cliente) => (
                    <TableRow
                      className="data-dragging:opacity-50"
                      id={cliente.id}
                      textValue={cliente.nome}
                    >
                      <TableCell className="px-3 py-3">
                        <Button
                          aria-label={`Arrastar cliente ${cliente.nome}`}
                          className="cursor-grab"
                          size="icon-sm"
                          slot="drag"
                          variant="ghost"
                        >
                          <GripVerticalIcon />
                        </Button>
                      </TableCell>
                      <TableCell className="px-5 py-3">
                        <Logo cliente={cliente} />
                      </TableCell>
                      <TableCell className="px-5 py-3 font-semibold text-brand-violet">
                        {cliente.nome}
                      </TableCell>
                      <TableCell className="px-5 py-3">
                        <StatusBadge status={cliente.status} />
                      </TableCell>
                      <TableCell className="px-5 py-3 tabular-nums text-muted-foreground">
                        {posicoes.get(cliente.id)}
                      </TableCell>
                      <TableCell className="px-5 py-3 text-right">
                        <ClienteActions cliente={cliente} />
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
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

      <ConfirmarExclusaoDialog
        acao={deleteAction}
        aberto={dialog === "delete"}
        descricao="O cliente e o logo enviado serão apagados e sairão da landing. Essa ação não pode ser desfeita."
        erro={deleteState.erro}
        onAbertoChange={(aberto) => setDialog(aberto ? "delete" : null)}
        pendente={deleting}
        titulo={`Excluir “${cliente.nome}” permanentemente?`}
      >
        <input name="id" type="hidden" value={cliente.id} />
      </ConfirmarExclusaoDialog>
    </>
  );
}
