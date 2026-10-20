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
import { useActionState, useState } from "react";
import { ConfirmarExclusaoDialog } from "@/components/admin/confirm-delete-dialog";
import { PageHeader } from "@/components/admin/page-header";
import { superficie } from "@/components/admin/panel";
import { StatusBadge } from "@/components/admin/status-badge";
import { Alert } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { excluirCliente, reordenarClientes } from "@/features/clients/actions";
import type { CadastroClienteState, Cliente } from "@/features/clients/schema";
import { useListaReordenavel } from "@/hooks/use-reorderable-list";
import { cn } from "@/lib/utils";
import FormularioCliente from "./client-form";

const estadoInicial: CadastroClienteState = {};

export default function TabelaClientes({ clientes }: { clientes: Cliente[] }) {
  const [cadastroAberto, setCadastroAberto] = useState(false);
  const { ordemExibida, posicoes, dragAndDropHooks, erro } =
    useListaReordenavel<Cliente>({
      itens: clientes,
      rotulo: (cliente) => cliente.nome,
      reordenar: reordenarClientes,
    });

  const publicados = clientes.filter(
    (cliente) => cliente.status === "published",
  ).length;

  const botaoCadastro = (
    <Button onPress={() => setCadastroAberto(true)}>
      <PlusIcon data-icon="inline-start" />
      Cadastrar cliente
    </Button>
  );

  return (
    <>
      <PageHeader
        actions={clientes.length > 0 ? botaoCadastro : undefined}
        meta={
          clientes.length > 0 ? (
            <>
              <span>
                {clientes.length}{" "}
                {clientes.length === 1 ? "cliente" : "clientes"}
              </span>
              <span aria-hidden="true">·</span>
              <span>{publicados} publicados</span>
            </>
          ) : undefined
        }
        description="Marcas exibidas na seção “Clientes” da landing. Só itens publicados ficam visíveis, na ordem definida aqui. No computador, arraste pela alça para reordenar."
        title="Clientes"
      />

      {erro ? (
        <Alert className="mt-6" variant="destructive">
          {erro}
        </Alert>
      ) : null}

      <Dialog isOpen={cadastroAberto} onOpenChange={setCadastroAberto}>
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Cadastrar cliente
          </DialogTitle>
          <DialogDescription>
            Adicione a marca que aparece na landing page.
          </DialogDescription>
        </DialogHeader>
        <FormularioCliente />
      </Dialog>

      <div className="mt-6">
        {clientes.length === 0 ? (
          <Empty className="border border-dashed border-border bg-card/60">
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
            <EmptyContent>{botaoCadastro}</EmptyContent>
          </Empty>
        ) : (
          <>
            <ul
              aria-label="Clientes cadastrados"
              className="flex flex-col gap-3 lg:hidden"
            >
              {ordemExibida.map((cliente) => (
                <li
                  className={cn(superficie, "flex items-center gap-4 p-4")}
                  key={cliente.id}
                >
                  <LogoCliente cliente={cliente} />
                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <p className="break-words font-medium text-heading">
                      {cliente.nome}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted-foreground">
                      <StatusBadge status={cliente.status} />
                      <span className="tabular-nums">
                        Ordem {posicoes.get(cliente.id)}
                      </span>
                    </div>
                  </div>
                  <ClienteAcoes cliente={cliente} />
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-muted-foreground lg:hidden">
              Para reordenar, use uma tela maior.
            </p>

            <div className={cn(superficie, "hidden overflow-hidden lg:block")}>
              <Table
                aria-label="Clientes cadastrados"
                className="text-left"
                dragAndDropHooks={dragAndDropHooks}
              >
                <TableHeader className="border-b border-border/80 bg-muted/50">
                  <TableHead className="w-12 px-3" id="reordenar">
                    <span className="sr-only">Reordenar</span>
                  </TableHead>
                  <TableHead className="w-24" id="logo">
                    Logo
                  </TableHead>
                  <TableHead id="nome" isRowHeader>
                    Nome
                  </TableHead>
                  <TableHead id="status">Status</TableHead>
                  <TableHead id="ordem">Ordem</TableHead>
                  <TableHead className="w-20 text-right" id="acoes">
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
                      <TableCell className="px-3">
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
                      <TableCell>
                        <LogoCliente cliente={cliente} />
                      </TableCell>
                      <TableCell className="font-medium text-heading">
                        {cliente.nome}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={cliente.status} />
                      </TableCell>
                      <TableCell className="tabular-nums text-muted-foreground">
                        {posicoes.get(cliente.id)}
                      </TableCell>
                      <TableCell className="text-right">
                        <ClienteAcoes cliente={cliente} />
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

function LogoCliente({ cliente }: { cliente: Cliente }) {
  return (
    <Avatar className="size-14 bg-brand-white">
      <AvatarImage
        alt={cliente.logo?.alt || `Logo de ${cliente.nome}`}
        className="object-cover"
        src={cliente.logo?.url}
      />
      <AvatarFallback>
        <ImageOffIcon
          aria-label="Logo indisponível"
          className="size-5 text-muted-foreground"
        />
      </AvatarFallback>
    </Avatar>
  );
}

function ClienteAcoes({ cliente }: { cliente: Cliente }) {
  const [dialogo, setDialogo] = useState<"edit" | "delete" | null>(null);
  const [estadoExclusao, acaoExclusao, excluindo] = useActionState(
    excluirCliente,
    estadoInicial,
  );

  return (
    <>
      <DropdownMenuTrigger>
        <Button
          aria-label={`Ações para ${cliente.nome}`}
          size="icon-sm"
          variant="ghost"
        >
          <MoreHorizontalIcon />
        </Button>
        <DropdownMenu>
          <DropdownMenuGroup>
            <DropdownMenuItem onAction={() => setDialogo("edit")}>
              <PencilIcon data-icon="inline-start" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              onAction={() => setDialogo("delete")}
              variant="destructive"
            >
              <Trash2Icon data-icon="inline-start" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenu>
      </DropdownMenuTrigger>

      <Dialog
        isOpen={dialogo === "edit"}
        onOpenChange={(aberto) => setDialogo(aberto ? "edit" : null)}
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Editar cliente
          </DialogTitle>
          <DialogDescription>
            Atualize os dados e, se quiser, substitua o logo atual.
          </DialogDescription>
        </DialogHeader>
        <FormularioCliente cliente={cliente} />
      </Dialog>

      <ConfirmarExclusaoDialog
        acao={acaoExclusao}
        aberto={dialogo === "delete"}
        descricao="O cliente e o logo enviado serão apagados e sairão da landing. Essa ação não pode ser desfeita."
        erro={estadoExclusao.erro}
        onAbertoChange={(aberto) => setDialogo(aberto ? "delete" : null)}
        pendente={excluindo}
        titulo={`Excluir “${cliente.nome}” permanentemente?`}
      >
        <input name="id" type="hidden" value={cliente.id} />
      </ConfirmarExclusaoDialog>
    </>
  );
}
