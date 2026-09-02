"use client";

import { ImagePlus, Save, Send } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { type ChangeEvent, useEffect, useState } from "react";

const imageTypes = ["image/jpeg", "image/png", "image/webp"];
const videoTypes = ["video/mp4", "video/webm"];

export default function ContentEditor() {
  const [title, setTitle] = useState("Uma nova experiência começa aqui.");
  const [description, setDescription] = useState(
    "Compartilhe como a realidade virtual pode abrir espaço para aprender, criar e se desenvolver.",
  );
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [mediaKind, setMediaKind] = useState<"image" | "video" | null>(null);

  useEffect(() => {
    return () => {
      if (mediaUrl) URL.revokeObjectURL(mediaUrl);
    };
  }, [mediaUrl]);

  function handleMediaChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];

    if (!file) {
      setMediaUrl(null);
      setMediaKind(null);
      return;
    }

    setMediaUrl(URL.createObjectURL(file));
    setMediaKind(file.type.startsWith("video/") ? "video" : "image");
  }

  return (
    <form
      className="mt-12 grid grid-cols-[minmax(0,1fr)_minmax(300px,.8fr)] gap-5 max-[850px]:grid-cols-1"
      onSubmit={(event) => event.preventDefault()}
    >
      <section
        className="rounded-[.7rem] border border-[#e1e5ef] bg-white p-6"
        aria-labelledby="editor-fields-title"
      >
        <h2
          className="mb-6 font-display text-[1.8rem] leading-none tracking-[-.04em] text-brand-violet"
          id="editor-fields-title"
        >
          Dados do conteúdo
        </h2>
        <div className="mb-5 grid gap-[.45rem]">
          <label
            className="text-[.76rem] font-bold text-brand-violet"
            htmlFor="content-title"
          >
            Título
          </label>
          <input
            className="min-h-11 w-full rounded-[.45rem] border border-[#d6dce8] bg-white px-3 text-[.85rem] text-brand-black outline-none transition-colors placeholder:text-[#9ca6b9] focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/15"
            id="content-title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.currentTarget.value)}
            placeholder="Ex.: Aprender também é explorar"
          />
        </div>
        <div className="mb-5 grid gap-[.45rem]">
          <label
            className="text-[.76rem] font-bold text-brand-violet"
            htmlFor="content-description"
          >
            Descrição
          </label>
          <textarea
            className="min-h-36 w-full resize-y rounded-[.45rem] border border-[#d6dce8] bg-white px-3 py-3 text-[.85rem] leading-relaxed text-brand-black outline-none transition-colors placeholder:text-[#9ca6b9] focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/15"
            id="content-description"
            value={description}
            onChange={(event) => setDescription(event.currentTarget.value)}
            placeholder="Conte um pouco sobre esta experiência..."
          />
        </div>
        <div className="mb-5 grid gap-[.45rem]">
          <label
            className="text-[.76rem] font-bold text-brand-violet"
            htmlFor="content-media"
          >
            Imagem ou vídeo
          </label>
          <div className="grid grid-cols-[auto_1fr] items-center gap-3 rounded-[.55rem] border border-dashed border-[#bfc8d8] bg-[#fafbfe] p-4 text-[#58647c]">
            <ImagePlus size={18} aria-hidden="true" />
            <input
              className="min-w-0 text-[.78rem] file:mr-3 file:rounded-[.35rem] file:border-0 file:bg-brand-blue file:px-3 file:py-2 file:font-bold file:text-brand-white"
              id="content-media"
              type="file"
              accept={[...imageTypes, ...videoTypes].join(",")}
              onChange={handleMediaChange}
            />
            <span className="col-span-2 text-[.7rem] text-[#7b8498]">
              Imagens até 10 MB · vídeos até 100 MB · JPG, PNG, WebP, MP4 ou
              WebM
            </span>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2 max-[560px]:flex-col-reverse max-[560px]:items-stretch">
          <Link
            className="inline-flex min-h-11 items-center justify-center gap-[.55rem] rounded-[.55rem] border border-[#d6dce8] bg-white px-4 text-[.78rem] font-bold text-brand-violet transition-transform hover:-translate-y-0.5 hover:bg-[#f1f4fa]"
            href="/admin"
          >
            Cancelar
          </Link>
          <button
            className="inline-flex min-h-11 items-center justify-center gap-[.55rem] rounded-[.55rem] border border-[#d6dce8] bg-white px-4 text-[.78rem] font-bold text-brand-violet transition-transform hover:-translate-y-0.5 hover:bg-[#f1f4fa]"
            type="button"
          >
            <Save size={15} aria-hidden="true" />
            Salvar rascunho
          </button>
          <button
            className="inline-flex min-h-11 items-center justify-center gap-[.55rem] rounded-[.55rem] border border-brand-blue bg-brand-blue px-4 text-[.78rem] font-bold text-brand-white transition-transform hover:-translate-y-0.5 hover:bg-[#1039a9]"
            type="button"
          >
            <Send size={15} aria-hidden="true" />
            Publicar
          </button>
        </div>
      </section>

      <aside
        className="rounded-[.7rem] border border-[#e1e5ef] bg-white p-6"
        aria-labelledby="preview-title"
      >
        <h2
          className="mb-6 font-display text-[1.8rem] leading-none tracking-[-.04em] text-brand-violet"
          id="preview-title"
        >
          Pré-visualização
        </h2>
        <div className="overflow-hidden rounded-[.55rem] border border-[#e1e5ef] bg-white">
          <div className="grid aspect-video place-items-center overflow-hidden bg-[radial-gradient(circle_at_70%_30%,rgba(85,216,232,.35),transparent_35%),#192b69] text-center text-[.78rem] text-white/70">
            {mediaUrl && mediaKind === "image" ? (
              <Image
                className="size-full object-cover"
                src={mediaUrl}
                alt="Prévia do conteúdo"
                width={900}
                height={500}
                unoptimized
              />
            ) : null}
            {mediaUrl && mediaKind === "video" ? (
              <video
                className="size-full object-cover"
                src={mediaUrl}
                controls
                aria-label="Prévia do vídeo"
              >
                <track
                  kind="captions"
                  src="data:text/vtt,WEBVTT"
                  srcLang="pt-BR"
                  label="Legendas"
                />
              </video>
            ) : null}
            {!mediaUrl ? "Sua mídia aparece aqui" : null}
          </div>
          <small className="mt-5 block px-5 text-[.68rem] font-bold uppercase tracking-[.1em] text-brand-blue">
            Miniverso / experiência
          </small>
          <h3 className="px-5 pt-2 font-serif text-[1.5rem] italic leading-tight text-brand-violet">
            {title || "Título do conteúdo"}
          </h3>
          <p className="px-5 pb-5 pt-2 text-[.85rem] leading-relaxed text-[#6f7890]">
            {description || "Descrição do conteúdo"}
          </p>
        </div>
      </aside>
    </form>
  );
}
