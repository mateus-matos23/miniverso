"use client";

import { ImagePlusIcon, InfoIcon } from "lucide-react";
import Image from "next/image";
import { type ChangeEvent, useEffect, useId, useState } from "react";

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
import { Textarea } from "@/components/ui/textarea";

const TITLE_MAX = 90;
const DESCRIPTION_MAX = 400;
const IMAGE_MAX = 10 * 1024 * 1024;
const VIDEO_MAX = 50 * 1024 * 1024;
const imageTypes = ["image/jpeg", "image/png", "image/webp"];
const videoTypes = ["video/mp4", "video/webm"];

type Media = { url: string; kind: "image" | "video"; name: string };

function validateMedia(file: File): string | null {
  if (imageTypes.includes(file.type)) {
    return file.size > IMAGE_MAX ? "A imagem deve ter no máximo 10 MB." : null;
  }
  if (videoTypes.includes(file.type)) {
    return file.size > VIDEO_MAX ? "O vídeo deve ter no máximo 50 MB." : null;
  }
  return "Formato não aceito. Envie JPG, PNG, WebP, MP4 ou WebM.";
}

export default function ContentEditor() {
  const id = useId();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [media, setMedia] = useState<Media | null>(null);
  const [mediaError, setMediaError] = useState<string | null>(null);

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

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.85fr)]">
      <form
        aria-labelledby={`${id}-form-title`}
        className="rounded-lg border border-border bg-card p-6"
        onSubmit={(event) => event.preventDefault()}
      >
        <h2
          className="text-lg font-semibold text-brand-violet"
          id={`${id}-form-title`}
        >
          Dados do conteúdo
        </h2>
        <FieldGroup className="mt-6 gap-6">
          <Field>
            <FieldLabel htmlFor={`${id}-title`}>Título</FieldLabel>
            <Input
              aria-describedby={`${id}-title-count`}
              id={`${id}-title`}
              maxLength={TITLE_MAX}
              onChange={(event) => setTitle(event.currentTarget.value)}
              placeholder="Ex.: Aprender também é explorar"
              value={title}
            />
            <FieldDescription id={`${id}-title-count`}>
              {title.length}/{TITLE_MAX} caracteres
            </FieldDescription>
          </Field>

          <Field>
            <FieldLabel htmlFor={`${id}-description`}>Descrição</FieldLabel>
            <Textarea
              aria-describedby={`${id}-description-count`}
              className="min-h-36"
              id={`${id}-description`}
              maxLength={DESCRIPTION_MAX}
              onChange={(event) => setDescription(event.currentTarget.value)}
              placeholder="Conte o que acontece nesta experiência."
              value={description}
            />
            <FieldDescription id={`${id}-description-count`}>
              {description.length}/{DESCRIPTION_MAX} caracteres
            </FieldDescription>
          </Field>

          <Field data-invalid={mediaError ? true : undefined}>
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
                  {media ? media.name : "Selecionar arquivo"}
                </span>
                <span className="text-muted-foreground">
                  Imagens JPG, PNG ou WebP até 10 MB. Vídeos MP4 ou WebM até 50
                  MB.
                </span>
              </span>
            </label>
            <input
              accept={[...imageTypes, ...videoTypes].join(",")}
              aria-describedby={mediaError ? `${id}-media-error` : undefined}
              aria-invalid={mediaError ? true : undefined}
              className="sr-only"
              id={`${id}-media`}
              onChange={handleMediaChange}
              type="file"
            />
            <FieldError id={`${id}-media-error`}>{mediaError}</FieldError>
          </Field>
        </FieldGroup>

        <div className="mt-8 flex flex-col gap-4 border-t border-border pt-6">
          <p className="flex items-start gap-2 text-sm text-muted-foreground">
            <InfoIcon aria-hidden="true" className="mt-0.5 size-4 shrink-0" />O
            salvamento de conteúdos ainda está em desenvolvimento. Por enquanto,
            use este editor para montar e revisar a apresentação.
          </p>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button isDisabled variant="outline">
              Salvar rascunho
            </Button>
            <Button isDisabled>Publicar</Button>
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
            {media?.kind === "image" ? (
              <Image
                alt=""
                className="size-full object-cover"
                height={500}
                src={media.url}
                unoptimized
                width={900}
              />
            ) : null}
            {media?.kind === "video" ? (
              // biome-ignore lint/a11y/useMediaCaption: prévia local do arquivo enviado
              <video
                className="size-full object-cover"
                controls
                src={media.url}
              />
            ) : null}
            {!media ? "A mídia aparece aqui" : null}
          </div>
          <div className="p-6">
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
