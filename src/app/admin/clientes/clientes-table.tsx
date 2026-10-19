"use client";

import {
  CheckCircle2Icon,
  GripVerticalIcon,
  ImageOffIcon,
  MoreHorizontalIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
  UsersIcon,
} from "lucide-react";
import Image from "next/image";
import { useActionState, useOptimistic, useState, useTransition } from "react";
import { DropIndicator, type Key, useDragAndDrop } from "react-aria-components";

import {
  type CadastroClienteState,
  type Cliente,
  excluirCliente,
  reordenarClientes,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

/**
 * Reposiciona as linhas arrastadas antes ou depois da linha de destino.
 * Devolve a mesma referência quando o arrasto não muda nada.
 */
function moverItens(
  itens: ClienteListItem[],
  chaves: ReadonlySet<Key>,
  alvo: Key,
  posicao: "before" | "after" | "on",
) {
  if (posicao === "on" || chaves.has(alvo)) return itens;

  const movidos = itens.filter((item) => chaves.has(item.id));
  const restantes = itens.filter((item) => !chaves.has(item.id));
  const indiceAlvo = restantes.findIndex((item) => item.id === alvo);

  if (indiceAlvo === -1) return itens;

  const indice = posicao === "after" ? indiceAlvo + 1 : indiceAlvo;

  return [
    ...restantes.slice(0, indice),
    ...movidos,
    ...restantes.slice(indice),
  ];
}

export default function ClientesTable({
  clientes,
  feedback,
}: {
  clientes: ClienteListItem[];
  feedback?: Feedback;
}) {
  const [createOpen, setCreateOpen] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  // A ordem exibida muda na hora ao soltar o cliente. Se a action falhar, a ordem
  // volta sozinha para a que veio do servidor, porque as props não mudaram.
  const [ordemExibida, definirOrdemExibida] = useOptimistic(
    clientes,
    (_atual, proxima: ClienteListItem[]) => proxima,
  );
  const posicoes = new Map(
    ordemExibida.map((cliente, indice) => [cliente.id, indice + 1]),
  );

  const { dragAndDropHooks } = useDragAndDrop<ClienteListItem>({
    // Sem isDisabled ligado ao isPending: a transição começa no drop, antes do
    // dragend, e desligar o DnD nesse meio deixava a linha presa em data-dragging.
    getItems: (_chaves, itens) =>
      itens.map((cliente) => ({ "text/plain": cliente.nome })),
    renderDropIndicator: (target) => (
      <DropIndicator
        className="bg-transparent data-drop-target:bg-brand-cyan [&>td]:h-0.5 [&>td]:p-0"
        target={target}
      />
    ),
    onReorder(e) {
      const proxima = moverItens(
        ordemExibida,
        e.keys,
        e.target.key,
        e.target.dropPosition,
      );

      if (proxima === ordemExibida) return;

      setErro(null);
      startTransition(async () => {
        definirOrdemExibida(proxima);
        const resultado = await reordenarClientes(
          proxima.map((cliente) => cliente.id),
        );
        if (resultado.erro) setErro(resultado.erro);
      });
    },
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
        description="Marcas exibidas na seção “Clientes” da landing. Só itens publicados ficam visíveis, na ordem definida aqui. Arraste pela alça para reordenar."
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
          <div className="overflow-hidden rounded-lg border border-border bg-card">
            <Table
              aria-label="Clientes cadastrados"
              className="min-w-[40rem] text-left"
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
