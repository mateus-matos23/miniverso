"use client";

import { CampoTexto } from "@/features/landing/editor/fields/text-field";
import type { FormConfigProps } from "@/features/landing/editor/forms/config/types";
import { SeletorMidia } from "@/features/media/components/media-picker";

export function FormConfigSeo({
  id,
  valor,
  onChange,
  erros,
}: FormConfigProps<"seo">) {
  const imagem = valor.imagemOg;

  return (
    <>
      <CampoTexto
        id={`${id}-titulo`}
        rotulo="Título da página"
        max={70}
        valor={valor.titulo}
        onChange={(titulo) => onChange({ ...valor, titulo })}
        erro={erros.titulo}
      />
      <CampoTexto
        id={`${id}-descricao`}
        rotulo="Descrição da página"
        max={170}
        multilinha
        valor={valor.descricao}
        onChange={(descricao) => onChange({ ...valor, descricao })}
        erro={erros.descricao}
      />
      <SeletorMidia
        id={`${id}-imagem-og`}
        rotulo="Imagem de compartilhamento"
        tipo="imagem"
        descricao="Recomendado 1200×630. Sem imagem, a landing usa a imagem gerada."
        valor={imagem}
        onChange={(imagemOg) => onChange({ ...valor, imagemOg })}
        erro={erros.imagemOg}
      />
      <section aria-labelledby={`${id}-previa`} className="flex flex-col gap-3">
        <h3 id={`${id}-previa`} className="text-sm font-semibold">
          Prévia do compartilhamento
        </h3>
        <div className="overflow-hidden rounded-lg border border-border bg-card">
          <div className="flex aspect-[1200/630] items-center justify-center bg-muted">
            {imagem ? (
              // biome-ignore lint/performance/noImgElement: prévia no admin, a URL vem da biblioteca de mídia
              <img
                src={imagem.url}
                alt=""
                width={imagem.largura ?? 1200}
                height={imagem.altura ?? 630}
                className="size-full object-cover"
              />
            ) : (
              <span className="text-xs text-muted-foreground">
                Imagem gerada automaticamente
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1 p-3">
            <p className="truncate text-sm font-semibold text-heading">
              {valor.titulo || "Título da página"}
            </p>
            <p className="line-clamp-2 text-xs text-muted-foreground">
              {valor.descricao || "Descrição da página"}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
