"use client";

import { ImagePlusIcon } from "lucide-react";
import Image from "next/image";
import {
  type ChangeEvent,
  useActionState,
  useEffect,
  useId,
  useState,
} from "react";

import {
  atualizarConteudo,
  type CadastroConteudoState,
  criarConteudo,
} from "@/app/admin/projetos/actions";
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
import { slugify } from "@/lib/slug";

const initialState: CadastroConteudoState = {};
const TITLE_MAX = 90;
const DESCRIPTION_MAX = 400;
const IMAGE_MAX = 10 * 1024 * 1024;
const VIDEO_MAX = 50 * 1024 * 1024;
const imageTypes = ["image/jpeg", "image/png", "image/webp"];
const videoTypes = ["video/mp4", "video/webm"];

type Media = { url: string; kind: "image" | "video"; name: string };

/** Monta o aria-describedby ignorando ids ausentes, para não apontar para elementos que não existem. */
function descreverPor(...ids: (string | false | null | undefined)[]) {
  return ids.filter(Boolean).join(" ") || undefined;
}

function validateMedia(file: File): string | null {
  if (imageTypes.includes(file.type)) {
    return file.size > IMAGE_MAX ? "A imagem deve ter no máximo 10 MB." : null;
  }
  if (videoTypes.includes(file.type)) {
    return file.size > VIDEO_MAX ? "O vídeo deve ter no máximo 50 MB." : null;
  }
  return "Formato não aceito. Envie JPG, PNG, WebP, MP4 ou WebM.";
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
  tipoMidia: "imagem" | "video";
  /** URL assinada da mídia atual, gerada no servidor. */
  midiaUrl: string | null;
};

export default function ContentEditor({
  clientes,
  conteudo,
}: {
  clientes: ClienteOpcao[];
  conteudo?: ConteudoEditavel;
}) {
  const id = useId();
  const [state, formAction, pending] = useActionState(
    conteudo ? atualizarConteudo : criarConteudo,
    initialState,
  );
  const [title, setTitle] = useState(conteudo?.titulo ?? "");
  const [slug, setSlug] = useState(conteudo?.slug ?? "");
  const [slugEditado, setSlugEditado] = useState(Boolean(conteudo));
  const [categoria, setCategoria] = useState(conteudo?.categoria ?? "");
  const [description, setDescription] = useState(conteudo?.descricao ?? "");
  const [media, setMedia] = useState<Media | null>(null);
  const [mediaError, setMediaError] = useState<string | null>(null);
  // Mídia já salva: aparece até o usuário escolher um arquivo novo.
  const midiaAtual: Media | null = conteudo?.midiaUrl
    ? {
        url: conteudo.midiaUrl,
        kind: conteudo.tipoMidia === "video" ? "video" : "image",
        name: "Mídia atual",
      }
    : null;
  const midiaExibida = media ?? midiaAtual;

  function handleTitleChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event.currentTarget.value;
    setTitle(value);
    // O slug acompanha o título até o usuário editar o campo manualmente.
    if (!slugEditado) setSlug(slugify(value));
  }

  useEffect(() => {
    return () => {
      if (media) URL.revokeObjectURL(media.url);
    };
  }, [media]);

  function handleMediaChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    setMediaError(null);

    if (!file) {
      setMedia(null);
      return;
    }

    const error = validateMedia(file);
    if (error) {
      event.currentTarget.value = "";
      setMedia(null);
      setMediaError(error);
      return;
    }

    setMedia({
      url: URL.createObjectURL(file),
      kind: file.type.startsWith("video/") ? "video" : "image",
      name: file.name,
    });
  }

  const erros = state.erros ?? {};

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.85fr)]">
      <form
        action={formAction}
        aria-labelledby={`${id}-form-title`}
        className="rounded-lg border border-border bg-card p-6"
      >
        {conteudo ? (
          <input name="id" type="hidden" value={conteudo.id} />
        ) : null}
        <h2
          className="text-lg font-semibold text-brand-violet"
          id={`${id}-form-title`}
        >
          Dados do projeto
        </h2>
        <FieldGroup className="mt-6 gap-6">
          <Field data-invalid={Boolean(erros.titulo) || undefined}>
            <FieldLabel htmlFor={`${id}-title`}>Título</FieldLabel>
            <Input
              aria-describedby={descreverPor(
                `${id}-title-count`,
                erros.titulo && `${id}-title-error`,
              )}
              aria-invalid={Boolean(erros.titulo) || undefined}
              id={`${id}-title`}
              maxLength={TITLE_MAX}
              name="titulo"
              onChange={handleTitleChange}
              placeholder="Ex.: Aprender também é explorar"
              required
              value={title}
            />
            <FieldDescription id={`${id}-title-count`}>
              {title.length}/{TITLE_MAX} caracteres
            </FieldDescription>
            <FieldError id={`${id}-title-error`}>{erros.titulo}</FieldError>
          </Field>

          <Field data-invalid={Boolean(erros.slug) || undefined}>
            <FieldLabel htmlFor={`${id}-slug`}>Endereço (slug)</FieldLabel>
            <Input
              aria-describedby={descreverPor(
                `${id}-slug-help`,
                erros.slug && `${id}-slug-error`,
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
            <FieldDescription id={`${id}-slug-help`}>
              Página do projeto: /projetos/{slug || "slug"}
            </FieldDescription>
            <FieldError id={`${id}-slug-error`}>{erros.slug}</FieldError>
          </Field>

          <div className="grid gap-6 sm:grid-cols-2">
            <Field data-invalid={Boolean(erros.clienteId) || undefined}>
              <FieldLabel htmlFor={`${id}-cliente`}>Cliente</FieldLabel>
              <Select
                className="w-full"
                defaultSelectedKey={
                  state.values?.clienteId || conteudo?.clienteId || undefined
                }
                name="clienteId"
                placeholder="Selecione"
              >
                <SelectTrigger
                  aria-describedby={descreverPor(
                    erros.clienteId && `${id}-cliente-error`,
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
              <FieldError id={`${id}-cliente-error`}>
                {erros.clienteId}
              </FieldError>
            </Field>

            <Field data-invalid={Boolean(erros.categoria) || undefined}>
              <FieldLabel htmlFor={`${id}-categoria`}>
                Categoria (opcional)
              </FieldLabel>
              <Input
                aria-describedby={descreverPor(
                  erros.categoria && `${id}-categoria-error`,
                )}
                aria-invalid={Boolean(erros.categoria) || undefined}
                defaultValue={
                  state.values?.categoria ?? conteudo?.categoria ?? undefined
                }
                id={`${id}-categoria`}
                maxLength={60}
                name="categoria"
                onChange={(event) => setCategoria(event.currentTarget.value)}
                placeholder="Ex.: Realidade virtual"
                type="text"
              />
              <FieldError id={`${id}-categoria-error`}>
                {erros.categoria}
              </FieldError>
            </Field>
          </div>

          <Field data-invalid={Boolean(erros.descricao) || undefined}>
            <FieldLabel htmlFor={`${id}-description`}>Descrição</FieldLabel>
            <Textarea
              aria-describedby={descreverPor(
                `${id}-description-count`,
                erros.descricao && `${id}-description-error`,
              )}
              aria-invalid={Boolean(erros.descricao) || undefined}
              className="min-h-36"
              id={`${id}-description`}
              maxLength={DESCRIPTION_MAX}
              name="descricao"
              onChange={(event) => setDescription(event.currentTarget.value)}
              placeholder="Conte o que acontece nesta experiência."
              required
              value={description}
            />
            <FieldDescription id={`${id}-description-count`}>
              {description.length}/{DESCRIPTION_MAX} caracteres
            </FieldDescription>
            <FieldError id={`${id}-description-error`}>
              {erros.descricao}
            </FieldError>
          </Field>

          <Field data-invalid={mediaError || erros.midia ? true : undefined}>
            <FieldLabel htmlFor={`${id}-media`}>Imagem ou vídeo</FieldLabel>
            <label
              className="flex cursor-pointer items-center gap-4 rounded-md border border-dashed border-input bg-muted/40 p-4 transition-colors hover:border-brand-blue has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ring"
              htmlFor={`${id}-media`}
            >
              <ImagePlusIcon
                aria-hidden="true"
                className="size-5 shrink-0 text-brand-blue"
              />
              <span className="min-w-0 flex-1 text-sm">
                <span className="block truncate font-semibold text-brand-violet">
                  {media
                    ? media.name
                    : conteudo
                      ? "Trocar mídia (opcional)"
                      : "Selecionar arquivo"}
                </span>
                <span className="text-muted-foreground">
                  {conteudo && !media
                    ? "Sem novo arquivo, a mídia atual é mantida. "
                    : null}
                  Imagens JPG, PNG ou WebP até 10 MB. Vídeos MP4 ou WebM até 50
                  MB.
                </span>
              </span>
            </label>
            <input
              accept={[...imageTypes, ...videoTypes].join(",")}
              aria-describedby={descreverPor(
                (mediaError || erros.midia) && `${id}-media-error`,
              )}
              aria-invalid={mediaError || erros.midia ? true : undefined}
              className="sr-only"
              id={`${id}-media`}
              name="midia"
              onChange={handleMediaChange}
              type="file"
            />
            <FieldError id={`${id}-media-error`}>
              {mediaError ?? erros.midia}
            </FieldError>
          </Field>

          <div className="grid gap-6 sm:grid-cols-2">
            <Field data-invalid={Boolean(erros.status) || undefined}>
              <FieldLabel htmlFor={`${id}-status`}>Status</FieldLabel>
              <Select
                className="w-full"
                defaultSelectedKey={
                  state.values?.status || conteudo?.status || "draft"
                }
                name="status"
              >
                <SelectTrigger
                  aria-describedby={descreverPor(
                    erros.status && `${id}-status-error`,
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
              <FieldError id={`${id}-status-error`}>{erros.status}</FieldError>
            </Field>

            <Field data-invalid={Boolean(erros.ordem) || undefined}>
              <FieldLabel htmlFor={`${id}-ordem`}>Ordem de exibição</FieldLabel>
              <Input
                aria-describedby={descreverPor(
                  erros.ordem && `${id}-ordem-error`,
                )}
                aria-invalid={Boolean(erros.ordem) || undefined}
                defaultValue={state.values?.ordem ?? conteudo?.ordem ?? 0}
                id={`${id}-ordem`}
                min="0"
                name="ordem"
                required
                step="1"
                type="number"
              />
              <FieldError id={`${id}-ordem-error`}>{erros.ordem}</FieldError>
            </Field>
          </div>
        </FieldGroup>

        <div className="mt-8 flex flex-col gap-4 border-t border-border pt-6">
          {state.erro ? (
            <Alert variant="destructive">{state.erro}</Alert>
          ) : null}
          <div className="flex justify-end">
            <Button isDisabled={pending} type="submit">
              {pending ? <Spinner data-icon="inline-start" /> : null}
              {pending ? "Salvando…" : "Salvar projeto"}
            </Button>
          </div>
        </div>
      </form>

      <section
        aria-labelledby={`${id}-preview-title`}
        className="flex flex-col gap-4 lg:sticky lg:top-6 lg:self-start"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2
            className="text-lg font-semibold text-brand-violet"
            id={`${id}-preview-title`}
          >
            Pré-visualização
          </h2>
          <Badge className="h-6 px-2 font-semibold" variant="secondary">
            Rascunho — ainda não publicado
          </Badge>
        </div>
        <article className="overflow-hidden rounded-lg border border-border bg-brand-white">
          <div className="grid aspect-video place-items-center overflow-hidden bg-brand-aurora text-sm text-brand-mist">
            {midiaExibida?.kind === "image" ? (
              <Image
                alt=""
                className="size-full object-cover"
                height={500}
                src={midiaExibida.url}
                unoptimized
                width={900}
              />
            ) : null}
            {midiaExibida?.kind === "video" ? (
              // biome-ignore lint/a11y/useMediaCaption: prévia do arquivo do projeto
              <video
                className="size-full object-cover"
                controls
                src={midiaExibida.url}
              />
            ) : null}
            {!midiaExibida ? "A mídia aparece aqui" : null}
          </div>
          <div className="p-6">
            {categoria ? (
              <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-brand-blue">
                {categoria}
              </p>
            ) : null}
            <h3 className="font-display text-4xl font-bold leading-none text-brand-violet">
              {title || "Título do conteúdo"}
            </h3>
            <p className="mt-3 text-brand-ink">
              {description || "A descrição aparece aqui, como na landing page."}
            </p>
          </div>
        </article>
      </section>
    </div>
  );
}
