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
import { useRouter } from "next/navigation";
import { useActionState, useState } from "react";

import {
  type AcaoConteudoState,
  alternarStatusConteudo,
  type CadastroConteudoState,
  excluirConteudo,
  reordenarConteudos,
} from "@/app/admin/projetos/actions";
import { Button, buttonVariants } from "@/components/ui/button";
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

export type { Feedback };

export type ProjetoListItem = {
  id: string;
  titulo: string;
  slug: string;
  categoria: string | null;
  status: string;
  ordem: number;
  tipoMidia: "imagem" | "video";
  clienteNome: string;
  midiaUrl: string | null;
};

const feedbackMessages: Record<Feedback, string> = {
  criado:
    "Projeto cadastrado. Se estiver como publicado, já aparece na landing.",
  atualizado: "Alterações salvas. A landing foi atualizada.",
  excluido: "Projeto excluído permanentemente.",
};

const initialState: CadastroConteudoState = {};

export default function ProjetosTabela({
  projetos,
  feedback,
}: {
  projetos: ProjetoListItem[];
  feedback?: Feedback;
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

  const novoProjeto = (
    <Link className={buttonVariants()} href="/admin/projetos/novo">
      <PlusIcon data-icon="inline-start" />
      Novo projeto
    </Link>
  );

  return (
    <>
      <PageHeader
        actions={projetos.length > 0 ? novoProjeto : undefined}
        description="Projetos exibidos na landing. Só os publicados aparecem, na ordem definida aqui. Arraste pela alça para reordenar."
        title="Projetos"
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

      <div className="mt-8">
        {projetos.length === 0 ? (
          <Empty className="border border-border bg-card">
            <EmptyHeader>
              <EmptyMedia className="bg-accent text-brand-blue" variant="icon">
                <FolderKanbanIcon />
              </EmptyMedia>
              <EmptyTitle className="text-lg font-semibold text-brand-violet">
                Nenhum projeto cadastrado
              </EmptyTitle>
              <EmptyDescription>
                Cadastre o primeiro projeto com título, cliente e mídia. Ele só
                aparece na landing quando estiver como “Publicado”.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>{novoProjeto}</EmptyContent>
          </Empty>
        ) : (
          <div className="overflow-hidden rounded-lg border border-border bg-card">
            <Table
              aria-label="Projetos cadastrados"
              className="min-w-[56rem] text-left"
              dragAndDropHooks={dragAndDropHooks}
            >
              <TableHeader className="border-b border-border bg-muted/60 text-sm text-muted-foreground">
                <TableHead
                  className="w-12 px-3 py-3 font-medium"
                  id="reordenar"
                >
                  <span className="sr-only">Reordenar</span>
                </TableHead>
                <TableHead
                  className="w-36 px-5 py-3 font-medium"
                  id="miniatura"
                >
                  Miniatura
                </TableHead>
                <TableHead
                  className="px-5 py-3 font-medium"
                  id="titulo"
                  isRowHeader
                >
                  Título
                </TableHead>
                <TableHead className="px-5 py-3 font-medium" id="cliente">
                  Cliente
                </TableHead>
                <TableHead className="px-5 py-3 font-medium" id="categoria">
                  Categoria
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
                {(projeto) => (
                  <TableRow
                    className="data-dragging:opacity-50"
                    id={projeto.id}
                    textValue={projeto.titulo}
                  >
                    <TableCell className="px-3 py-3">
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
                    <TableCell className="px-5 py-3">
                      <Miniatura projeto={projeto} />
                    </TableCell>
                    <TableCell className="px-5 py-3">
                      <Link
                        className="font-semibold text-brand-violet hover:underline"
                        href={`/admin/projetos/${projeto.id}`}
                      >
                        {projeto.titulo}
                      </Link>
                      <p className="mt-1 text-sm text-muted-foreground">
                        /projetos/{projeto.slug}
                      </p>
                    </TableCell>
                    <TableCell className="px-5 py-3 text-brand-ink">
                      {projeto.clienteNome}
                    </TableCell>
                    <TableCell className="px-5 py-3 text-muted-foreground">
                      {projeto.categoria ?? "—"}
                    </TableCell>
                    <TableCell className="px-5 py-3">
                      <StatusBadge status={projeto.status} />
                    </TableCell>
                    <TableCell className="px-5 py-3 tabular-nums text-muted-foreground">
                      {posicoes.get(projeto.id)}
                    </TableCell>
                    <TableCell className="px-5 py-3 text-right">
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
        )}
      </div>
    </>
  );
}

function Miniatura({ projeto }: { projeto: ProjetoListItem }) {
  return (
    <span className="grid aspect-video w-24 place-items-center overflow-hidden rounded-md border border-border bg-brand-aurora">
      {projeto.midiaUrl && projeto.tipoMidia === "imagem" ? (
        <Image
          alt={`Miniatura de ${projeto.titulo}`}
          className="size-full object-cover"
          height={54}
          src={projeto.midiaUrl}
          unoptimized
          width={96}
        />
      ) : null}
      {projeto.tipoMidia === "video" ? (
        <FilmIcon
          aria-label="Vídeo"
          className="size-5 text-brand-mist"
          role="img"
        />
      ) : null}
      {!projeto.midiaUrl && projeto.tipoMidia === "imagem" ? (
        <ImageOffIcon
          aria-label="Mídia indisponível"
          className="size-5 text-brand-mist"
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
  const router = useRouter();
  const [excluirAberto, setExcluirAberto] = useState(false);
  const [deleteState, deleteAction, deleting] = useActionState(
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
          size="icon"
          variant="ghost"
        >
          <MoreHorizontalIcon />
        </Button>
        <DropdownMenu>
          <DropdownMenuGroup>
            <DropdownMenuItem
              onAction={() => router.push(`/admin/projetos/${projeto.id}`)}
            >
              <PencilIcon data-icon="inline-start" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              onAction={() => onAcao(() => alternarStatusConteudo(projeto.id))}
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
                onAction={() =>
                  window.open(
                    `/projetos/${projeto.slug}`,
                    "_blank",
                    "noopener,noreferrer",
                  )
                }
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
        acao={deleteAction}
        aberto={excluirAberto}
        descricao="O projeto e a mídia enviada serão apagados e sairão da landing. Essa ação não pode ser desfeita."
        erro={deleteState.erro}
        onAbertoChange={setExcluirAberto}
        pendente={deleting}
        titulo={`Excluir “${projeto.titulo}” permanentemente?`}
      >
        <input name="id" type="hidden" value={projeto.id} />
      </ConfirmarExclusaoDialog>
    </>
  );
}
