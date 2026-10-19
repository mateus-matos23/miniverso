"use client";

import { Radio, RadioGroup } from "react-aria-components";

import { SeletorMidia } from "@/app/admin/midia/seletor-midia";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { type Secao, visuaisHero } from "@/lib/landing/schema";
import { cn } from "@/lib/utils";
import { CampoCta } from "../_fields/campo-cta";
import { CampoTexto } from "../_fields/campo-texto";
import type { FormSecaoProps } from "./tipos";

type AparenciaHero = Extract<Secao, { tipo: "hero" }>["aparencia"];
type VisualHero = (typeof visuaisHero)[number];

const rotulosVisual: Record<VisualHero, string> = {
  ilustracao: "Ilustração",
  imagem: "Imagem",
  video: "Vídeo",
};

type FormHeroProps = FormSecaoProps<"hero"> & {
  aparencia: AparenciaHero;
  onAparenciaChange: (aparencia: AparenciaHero) => void;
};

export function FormHero({
  id,
  dados,
  onChange,
  erros,
  ancoras,
  aparencia,
  onAparenciaChange,
}: FormHeroProps) {
  // Ao trocar o tipo, a mídia só continua se for do mesmo tipo do novo visual.
  function trocarVisual(visual: VisualHero) {
    const midia =
      visual !== "ilustracao" && aparencia.midia?.tipo === visual
        ? aparencia.midia
        : null;
    onAparenciaChange({ ...aparencia, visual, midia });
  }

  return (
    <>
      <Field data-invalid={Boolean(erros["aparencia.visual"]) || undefined}>
        <FieldLabel id={`${id}-visual-rotulo`}>Visual</FieldLabel>
        <RadioGroup
          aria-labelledby={`${id}-visual-rotulo`}
          className="flex flex-wrap gap-2"
          value={aparencia.visual}
          onChange={(chave) => trocarVisual(chave as VisualHero)}
        >
          {visuaisHero.map((chave) => (
            <Radio
              key={chave}
              value={chave}
              className={({ isFocusVisible, isSelected }) =>
                cn(
                  "flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors",
                  isSelected
                    ? "border-ring ring-3 ring-ring/30"
                    : "border-input",
                  isFocusVisible && "ring-3 ring-ring/50",
                )
              }
            >
              {rotulosVisual[chave]}
            </Radio>
          ))}
        </RadioGroup>
        {erros["aparencia.visual"] ? (
          <FieldError>{erros["aparencia.visual"]}</FieldError>
        ) : null}
      </Field>
      {aparencia.visual === "ilustracao" ? null : (
        <SeletorMidia
          id={`${id}-midia`}
          rotulo={
            aparencia.visual === "imagem" ? "Imagem do hero" : "Vídeo do hero"
          }
          tipo={aparencia.visual}
          descricao={
            aparencia.visual === "video"
              ? "Use um vídeo curto: ele toca em loop, sem som. Com movimento reduzido, o visitante vê os controles."
              : undefined
          }
          valor={aparencia.midia}
          onChange={(midia) => onAparenciaChange({ ...aparencia, midia })}
          erro={erros["aparencia.midia"]}
        />
      )}
      <CampoTexto
        id={`${id}-rotulo`}
        rotulo="Rótulo"
        max={40}
        valor={dados.rotulo}
        onChange={(rotulo) => onChange({ ...dados, rotulo })}
        erro={erros.rotulo}
      />
      <CampoTexto
        id={`${id}-titulo`}
        rotulo="Título"
        max={90}
        valor={dados.titulo}
        onChange={(titulo) => onChange({ ...dados, titulo })}
        erro={erros.titulo}
      />
      <CampoTexto
        id={`${id}-subtitulo`}
        rotulo="Subtítulo"
        max={300}
        multilinha
        valor={dados.subtitulo}
        onChange={(subtitulo) => onChange({ ...dados, subtitulo })}
        erro={erros.subtitulo}
      />
      <CampoCta
        id={`${id}-cta-primario`}
        legenda="Botão principal"
        valor={dados.ctaPrimario}
        onChange={(ctaPrimario) => onChange({ ...dados, ctaPrimario })}
        ancoras={ancoras}
        erros={{
          rotulo: erros["ctaPrimario.rotulo"],
          destino: erros["ctaPrimario.destino"],
        }}
      />
      <CampoCta
        id={`${id}-cta-secundario`}
        legenda="Botão secundário"
        valor={dados.ctaSecundario}
        onChange={(ctaSecundario) => onChange({ ...dados, ctaSecundario })}
        ancoras={ancoras}
        erros={{
          rotulo: erros["ctaSecundario.rotulo"],
          destino: erros["ctaSecundario.destino"],
        }}
      />
    </>
  );
}
