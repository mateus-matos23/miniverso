"use client";

import {
  ExternalLinkIcon,
  EyeIcon,
  EyeOffIcon,
  FilmIcon,
  FolderKanbanIcon,
  GripVerticalIcon,
  ImageOffIcon,
  MoreHorizontalIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useActionState, useState } from "react";
import { toast } from "sonner";
import { ConfirmarExclusaoDialog } from "@/components/admin/confirm-delete-dialog";
import { PageHeader } from "@/components/admin/page-header";
import { superficie } from "@/components/admin/panel";
import { StatusBadge } from "@/components/admin/status-badge";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
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
import type { MidiaRef } from "@/features/media/schema";
import {
  alternarStatusConteudo,
  excluirConteudo,
  reordenarConteudos,
} from "@/features/projects/actions";
import type {
  AcaoConteudoState,
  CadastroConteudoState,
} from "@/features/projects/schema";
import { useListaReordenavel } from "@/hooks/use-reorderable-list";
import { cn } from "@/lib/utils";

export type ProjetoListItem = {
  id: string;
  titulo: string;
  slug: string;
  categoria: string | null;
  status: string;
  ordem: number;
  clienteNome: string;
  midia: MidiaRef | null;
};

const initialState: CadastroConteudoState = {};

export default function ProjetosTabela({
  projetos,
}: {
  projetos: ProjetoListItem[];
}) {
  const {
    ordemExibida,
    posicoes,
    dragAndDropHooks,
    erro,
    isPending,
    executar,
  } = useListaReordenavel<ProjetoListItem>({
    itens: projetos,
    rotulo: (projeto) => projeto.titulo,
    reordenar: reordenarConteudos,
  });

  const publicados = projetos.filter(
    (projeto) => projeto.status === "published",
  ).length;

  const novoProjeto = (
    <Link className={buttonVariants()} href="/admin/projetos/novo">
      <PlusIcon data-icon="inline-start" />
      Cadastrar projeto
    </Link>
  );

  return (
    <>
      <PageHeader
        actions={projetos.length > 0 ? novoProjeto : undefined}
        meta={
          projetos.length > 0 ? (
            <>
              <span>
                {projetos.length}{" "}
                {projetos.length === 1 ? "projeto" : "projetos"}
              </span>
              <span aria-hidden="true">·</span>
              <span>{publicados} publicados</span>
            </>
          ) : undefined
        }
        description="Projetos exibidos na landing. Só os publicados aparecem, na ordem definida aqui. No computador, arraste pela alça para reordenar."
        title="Projetos"
      />

      {erro ? (
        <Alert className="mt-6" variant="destructive">
          {erro}
        </Alert>
      ) : null}

      <div className="mt-6">
        {projetos.length === 0 ? (
          <Empty className="border border-dashed border-border bg-card/60">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FolderKanbanIcon />
              </EmptyMedia>
              <EmptyTitle>Nenhum projeto cadastrado</EmptyTitle>
              <EmptyDescription>
                Cadastre o primeiro projeto com título, cliente e mídia. Ele só
                aparece na landing quando estiver como “Publicado”.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>{novoProjeto}</EmptyContent>
          </Empty>
        ) : (
          <>
            <ul
              aria-label="Projetos cadastrados"
              className="flex flex-col gap-3 lg:hidden"
            >
              {ordemExibida.map((projeto) => (
                <li
                  className={cn(superficie, "flex items-start gap-4 p-4")}
                  key={projeto.id}
                >
                  <Miniatura projeto={projeto} />
                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <TituloProjeto projeto={projeto} />
                    <p className="text-sm text-body">
                      {projeto.clienteNome}
                      <span className="text-muted-foreground">
                        {" · "}
                        {projeto.categoria ?? "—"}
                      </span>
                    </p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted-foreground">
                      <StatusBadge status={projeto.status} />
                      <span className="tabular-nums">
                        Ordem {posicoes.get(projeto.id)}
                      </span>
                    </div>
                  </div>
                  <ProjetoAcoes
                    disabled={isPending}
                    onAcao={executar}
                    projeto={projeto}
                  />
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-muted-foreground lg:hidden">
              Para reordenar, use uma tela maior.
            </p>

            <div className={cn(superficie, "hidden overflow-hidden lg:block")}>
              <Table
                aria-label="Projetos cadastrados"
                className="text-left"
                dragAndDropHooks={dragAndDropHooks}
              >
                <TableHeader className="border-b border-border/80 bg-muted/50">
                  <TableHead className="w-12 px-3" id="reordenar">
                    <span className="sr-only">Reordenar</span>
                  </TableHead>
                  <TableHead className="w-36" id="miniatura">
                    Miniatura
                  </TableHead>
                  <TableHead id="titulo" isRowHeader>
                    Título
                  </TableHead>
                  <TableHead id="cliente">Cliente</TableHead>
                  <TableHead id="categoria">Categoria</TableHead>
                  <TableHead id="status">Status</TableHead>
                  <TableHead id="ordem">Ordem</TableHead>
                  <TableHead className="w-20 text-right" id="acoes">
                    <span className="sr-only">Ações</span>
                  </TableHead>
                </TableHeader>
                <TableBody items={ordemExibida}>
                  {(projeto) => (
                    <TableRow
                      className="data-dragging:opacity-50"
                      id={projeto.id}
                      textValue={projeto.titulo}
                    >
                      <TableCell className="px-3">
                        <Button
                          aria-label={`Arrastar projeto ${projeto.titulo}`}
                          className="cursor-grab"
                          size="icon-sm"
                          slot="drag"
                          variant="ghost"
                        >
                          <GripVerticalIcon />
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Miniatura projeto={projeto} />
                      </TableCell>
                      <TableCell>
                        <TituloProjeto projeto={projeto} />
                      </TableCell>
                      <TableCell className="text-body">
                        {projeto.clienteNome}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {projeto.categoria ?? "—"}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={projeto.status} />
                      </TableCell>
                      <TableCell className="tabular-nums text-muted-foreground">
                        {posicoes.get(projeto.id)}
                      </TableCell>
                      <TableCell className="text-right">
                        <ProjetoAcoes
                          disabled={isPending}
                          onAcao={executar}
                          projeto={projeto}
                        />
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

function TituloProjeto({ projeto }: { projeto: ProjetoListItem }) {
  return (
    <div className="min-w-0">
      <Link
        className="wrap-break-word font-medium text-heading hover:underline"
        href={`/admin/projetos/${projeto.id}`}
      >
        {projeto.titulo}
      </Link>
      <p className="mt-1 break-all text-sm text-muted-foreground">
        /projetos/{projeto.slug}
      </p>
    </div>
  );
}

function Miniatura({ projeto }: { projeto: ProjetoListItem }) {
  return (
    <span className="grid aspect-video w-24 shrink-0 place-items-center overflow-hidden rounded-lg bg-muted ring-1 ring-border/80">
      {projeto.midia?.tipo === "imagem" ? (
        <Image
          alt=""
          className="size-full object-cover"
          height={54}
          src={projeto.midia.url}
          width={96}
        />
      ) : null}
      {projeto.midia?.tipo === "video" ? (
        <FilmIcon
          aria-label="Vídeo"
          className="size-5 text-muted-foreground"
          role="img"
        />
      ) : null}
      {!projeto.midia ? (
        <ImageOffIcon
          aria-label="Mídia indisponível"
          className="size-5 text-muted-foreground"
          role="img"
        />
      ) : null}
    </span>
  );
}

function ProjetoAcoes({
  projeto,
  disabled,
  onAcao,
}: {
  projeto: ProjetoListItem;
  disabled: boolean;
  onAcao: (acao: () => Promise<AcaoConteudoState>) => void;
}) {
  const [excluirAberto, setExcluirAberto] = useState(false);
  const [estadoExclusao, acaoExclusao, excluindo] = useActionState(
    excluirConteudo,
    initialState,
  );
  const publicado = projeto.status === "published";

  return (
    <>
      <DropdownMenuTrigger>
        <Button
          aria-label={`Ações para ${projeto.titulo}`}
          isDisabled={disabled}
          size="icon-sm"
          variant="ghost"
        >
          <MoreHorizontalIcon />
        </Button>
        <DropdownMenu>
          <DropdownMenuGroup>
            <DropdownMenuItem href={`/admin/projetos/${projeto.id}`}>
              <PencilIcon data-icon="inline-start" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              onAction={() =>
                onAcao(async () => {
                  const resultado = await alternarStatusConteudo(
                    projeto.id,
                    publicado ? "draft" : "published",
                  );
                  // Erro continua na faixa da tabela (useListaReordenavel); aqui só o sucesso vira toast.
                  if (!resultado.erro) {
                    toast.success(
                      publicado
                        ? "Projeto despublicado."
                        : "Projeto publicado.",
                    );
                  }
                  return resultado;
                })
              }
            >
              {publicado ? (
                <EyeOffIcon data-icon="inline-start" />
              ) : (
                <EyeIcon data-icon="inline-start" />
              )}
              {publicado ? "Despublicar" : "Publicar"}
            </DropdownMenuItem>
            {publicado ? (
              <DropdownMenuItem
                href={`/projetos/${projeto.slug}`}
                rel="noopener noreferrer"
                target="_blank"
              >
                <ExternalLinkIcon data-icon="inline-start" />
                Ver na landing
              </DropdownMenuItem>
            ) : null}
            <DropdownMenuItem
              onAction={() => setExcluirAberto(true)}
              variant="destructive"
            >
              <Trash2Icon data-icon="inline-start" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenu>
      </DropdownMenuTrigger>

      <ConfirmarExclusaoDialog
        acao={acaoExclusao}
        aberto={excluirAberto}
        descricao="O projeto e a mídia enviada serão apagados e sairão da landing. Essa ação não pode ser desfeita."
        erro={estadoExclusao.erro}
        onAbertoChange={setExcluirAberto}
        pendente={excluindo}
        titulo={`Excluir “${projeto.titulo}” permanentemente?`}
      >
        <input name="id" type="hidden" value={projeto.id} />
      </ConfirmarExclusaoDialog>
    </>
  );
}
