"use client";

import Image from "next/image";
import { type ChangeEvent, useActionState, useId, useState } from "react";
import { Painel, superficie } from "@/components/admin/panel";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { SeletorMidia } from "@/features/media/components/media-picker";
import type { MidiaRef } from "@/features/media/schema";
import { atualizarConteudo, criarConteudo } from "@/features/projects/actions";
import type { CadastroConteudoState } from "@/features/projects/schema";
import { slugify } from "@/features/projects/slug";
import { cn } from "@/lib/utils";

const estadoInicial: CadastroConteudoState = {};
const TITULO_MAX = 90;
const DESCRICAO_MAX = 400;

/** Monta o aria-describedby ignorando ids ausentes, para não apontar para elementos que não existem. */
function descreverPor(...ids: (string | false | null | undefined)[]) {
  return ids.filter(Boolean).join(" ") || undefined;
}

type ClienteOpcao = { id: string; nome: string };

/** Projeto existente, usado no modo de edição. */
export type ConteudoEditavel = {
  id: string;
  titulo: string;
  slug: string;
  categoria: string | null;
  descricao: string;
  status: string;
  ordem: number;
  clienteId: string;
  /** Mídia da biblioteca escolhida para o projeto. */
  midia: MidiaRef | null;
};

export default function EditorProjeto({
  clientes,
  conteudo,
}: {
  clientes: ClienteOpcao[];
  conteudo?: ConteudoEditavel;
}) {
  const id = useId();
  const [estado, acaoFormulario, pendente] = useActionState(
    conteudo ? atualizarConteudo : criarConteudo,
    estadoInicial,
  );
  const [titulo, setTitulo] = useState(conteudo?.titulo ?? "");
  const [slug, setSlug] = useState(conteudo?.slug ?? "");
  const [slugEditado, setSlugEditado] = useState(Boolean(conteudo));
  const [categoria, setCategoria] = useState(conteudo?.categoria ?? "");
  const [descricao, setDescricao] = useState(conteudo?.descricao ?? "");
  const [midia, setMidia] = useState<MidiaRef | null>(conteudo?.midia ?? null);

  function aoMudarTitulo(event: ChangeEvent<HTMLInputElement>) {
    const valor = event.currentTarget.value;
    setTitulo(valor);
    // O slug acompanha o título até o usuário editar o campo manualmente.
    if (!slugEditado) setSlug(slugify(valor));
  }

  const erros = estado.erros ?? {};

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.85fr)]">
      <form action={acaoFormulario} className="flex min-w-0 flex-col gap-5">
        {conteudo ? (
          <input name="id" type="hidden" value={conteudo.id} />
        ) : null}
        <Painel
          conteudoClassName="flex flex-col gap-6"
          titulo="Dados do projeto"
        >
          <FieldGroup className="gap-6">
            <Field data-invalid={Boolean(erros.titulo) || undefined}>
              <FieldLabel htmlFor={`${id}-titulo`}>Título</FieldLabel>
              <Input
                aria-describedby={descreverPor(
                  `${id}-titulo-contador`,
                  erros.titulo && `${id}-titulo-erro`,
                )}
                aria-invalid={Boolean(erros.titulo) || undefined}
                id={`${id}-titulo`}
                maxLength={TITULO_MAX}
                name="titulo"
                onChange={aoMudarTitulo}
                placeholder="Ex.: Aprender também é explorar"
                required
                value={titulo}
              />
              <FieldDescription id={`${id}-titulo-contador`}>
                {titulo.length}/{TITULO_MAX} caracteres
              </FieldDescription>
              <FieldError id={`${id}-titulo-erro`}>{erros.titulo}</FieldError>
            </Field>

            <Field data-invalid={Boolean(erros.slug) || undefined}>
              <FieldLabel htmlFor={`${id}-slug`}>Endereço (slug)</FieldLabel>
              <Input
                aria-describedby={descreverPor(
                  `${id}-slug-ajuda`,
                  erros.slug && `${id}-slug-erro`,
                )}
                aria-invalid={Boolean(erros.slug) || undefined}
                id={`${id}-slug`}
                maxLength={120}
                name="slug"
                onChange={(event) => {
                  setSlug(event.currentTarget.value);
                  setSlugEditado(true);
                }}
                placeholder="aprender-tambem-e-explorar"
                required
                value={slug}
              />
              <FieldDescription id={`${id}-slug-ajuda`}>
                Página do projeto: /projetos/{slug || "slug"}
              </FieldDescription>
              <FieldError id={`${id}-slug-erro`}>{erros.slug}</FieldError>
            </Field>

            <div className="grid gap-6 sm:grid-cols-2">
              <Field data-invalid={Boolean(erros.clienteId) || undefined}>
                <FieldLabel id={`${id}-cliente-rotulo`}>Cliente</FieldLabel>
                <Select
                  aria-labelledby={`${id}-cliente-rotulo`}
                  className="w-full"
                  defaultSelectedKey={
                    estado.values?.clienteId || conteudo?.clienteId || undefined
                  }
                  name="clienteId"
                  placeholder="Selecione"
                >
                  <SelectTrigger
                    aria-describedby={descreverPor(
                      erros.clienteId && `${id}-cliente-erro`,
                    )}
                    aria-invalid={Boolean(erros.clienteId) || undefined}
                    id={`${id}-cliente`}
                    type="button"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {clientes.map((cliente) => (
                      <SelectItem id={cliente.id} key={cliente.id}>
                        {cliente.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError id={`${id}-cliente-erro`}>
                  {erros.clienteId}
                </FieldError>
              </Field>

              <Field data-invalid={Boolean(erros.categoria) || undefined}>
                <FieldLabel htmlFor={`${id}-categoria`}>
                  Categoria (opcional)
                </FieldLabel>
                <Input
                  aria-describedby={descreverPor(
                    erros.categoria && `${id}-categoria-erro`,
                  )}
                  aria-invalid={Boolean(erros.categoria) || undefined}
                  defaultValue={
                    estado.values?.categoria ?? conteudo?.categoria ?? undefined
                  }
                  id={`${id}-categoria`}
                  maxLength={60}
                  name="categoria"
                  onChange={(event) => setCategoria(event.currentTarget.value)}
                  placeholder="Ex.: Realidade virtual"
                  type="text"
                />
                <FieldError id={`${id}-categoria-erro`}>
                  {erros.categoria}
                </FieldError>
              </Field>
            </div>

            <Field data-invalid={Boolean(erros.descricao) || undefined}>
              <FieldLabel htmlFor={`${id}-descricao`}>Descrição</FieldLabel>
              <Textarea
                aria-describedby={descreverPor(
                  `${id}-descricao-contador`,
                  erros.descricao && `${id}-descricao-erro`,
                )}
                aria-invalid={Boolean(erros.descricao) || undefined}
                className="min-h-36"
                id={`${id}-descricao`}
                maxLength={DESCRICAO_MAX}
                name="descricao"
                onChange={(event) => setDescricao(event.currentTarget.value)}
                placeholder="Conte o que acontece nesta experiência."
                required
                value={descricao}
              />
              <FieldDescription id={`${id}-descricao-contador`}>
                {descricao.length}/{DESCRICAO_MAX} caracteres
              </FieldDescription>
              <FieldError id={`${id}-descricao-erro`}>
                {erros.descricao}
              </FieldError>
            </Field>
          </FieldGroup>
        </Painel>

        <Painel conteudoClassName="flex flex-col gap-6" titulo="Mídia">
          <SeletorMidia
            erro={erros.midia}
            id={`${id}-midia`}
            onChange={setMidia}
            rotulo="Imagem ou vídeo"
            valor={midia}
          />
          {/* Leva a mídia escolhida para o servidor. */}
          <input name="midiaId" type="hidden" value={midia?.id ?? ""} />
        </Painel>

        <Painel conteudoClassName="flex flex-col gap-6" titulo="Publicação">
          <div className="grid gap-6 sm:grid-cols-2">
            <Field data-invalid={Boolean(erros.status) || undefined}>
              <FieldLabel id={`${id}-status-rotulo`}>Status</FieldLabel>
              <Select
                aria-labelledby={`${id}-status-rotulo`}
                className="w-full"
                defaultSelectedKey={
                  estado.values?.status || conteudo?.status || "draft"
                }
                name="status"
              >
                <SelectTrigger
                  aria-describedby={descreverPor(
                    erros.status && `${id}-status-erro`,
                  )}
                  aria-invalid={Boolean(erros.status) || undefined}
                  id={`${id}-status`}
                  type="button"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem id="draft">Rascunho</SelectItem>
                  <SelectItem id="published">Publicado</SelectItem>
                </SelectContent>
              </Select>
              <FieldError id={`${id}-status-erro`}>{erros.status}</FieldError>
            </Field>

            <Field data-invalid={Boolean(erros.ordem) || undefined}>
              <FieldLabel htmlFor={`${id}-ordem`}>Ordem de exibição</FieldLabel>
              <Input
                aria-describedby={descreverPor(
                  erros.ordem && `${id}-ordem-erro`,
                )}
                aria-invalid={Boolean(erros.ordem) || undefined}
                defaultValue={estado.values?.ordem ?? conteudo?.ordem ?? 0}
                id={`${id}-ordem`}
                min="0"
                name="ordem"
                required
                step="1"
                type="number"
              />
              <FieldError id={`${id}-ordem-erro`}>{erros.ordem}</FieldError>
            </Field>
          </div>
        </Painel>

        {estado.erro ? (
          <Alert variant="destructive">{estado.erro}</Alert>
        ) : null}
        <div className="flex justify-end">
          <Button isDisabled={pendente} type="submit">
            {pendente ? <Spinner data-icon="inline-start" /> : null}
            {conteudo
              ? pendente
                ? "Salvando…"
                : "Salvar alterações"
              : pendente
                ? "Cadastrando…"
                : "Cadastrar projeto"}
          </Button>
        </div>
      </form>

      <section
        aria-labelledby={`${id}-previa-titulo`}
        className="flex flex-col gap-4 lg:sticky lg:top-6 lg:self-start"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2
            className="text-lg font-semibold text-heading"
            id={`${id}-previa-titulo`}
          >
            Pré-visualização
          </h2>
          <Badge className="h-6 px-2 font-semibold" variant="secondary">
            Rascunho, ainda não publicado
          </Badge>
        </div>
        <article className={cn(superficie, "overflow-hidden")}>
          <div className="grid aspect-video place-items-center overflow-hidden bg-brand-aurora text-sm text-brand-mist">
            {midia?.tipo === "imagem" ? (
              <Image
                alt={midia.alt}
                className="size-full object-cover"
                height={500}
                src={midia.url}
                width={900}
              />
            ) : null}
            {midia?.tipo === "video" ? (
              // biome-ignore lint/a11y/useMediaCaption: prévia do arquivo do projeto
              <video
                className="size-full object-cover"
                controls
                src={midia.url}
              />
            ) : null}
            {!midia ? "A mídia aparece aqui" : null}
          </div>
          <div className="p-6">
            {categoria ? (
              <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">
                {categoria}
              </p>
            ) : null}
            <h3 className="font-display text-4xl font-bold leading-none text-heading">
              {titulo || "Título do conteúdo"}
            </h3>
            <p className="mt-3 text-body">
              {descricao || "A descrição aparece aqui, como na landing page."}
            </p>
          </div>
        </article>
      </section>
    </div>
  );
}
