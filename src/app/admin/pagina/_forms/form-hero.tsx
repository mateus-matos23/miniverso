"use client";

import { SeletorMidia } from "@/app/admin/midia/seletor-midia";
import { type Secao, visuaisHero } from "@/lib/landing/schema";
import { CabecalhoSecao } from "../_fields/cabecalho-secao";
import { CampoCta } from "../_fields/campo-cta";
import { CampoEscolha } from "../_fields/campo-escolha";
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
      <CampoEscolha
        id={`${id}-visual`}
        rotulo="Visual"
        valor={aparencia.visual}
        onChange={trocarVisual}
        erro={erros["aparencia.visual"]}
        opcoes={visuaisHero.map((chave) => ({
          valor: chave,
          rotulo: rotulosVisual[chave],
        }))}
      />
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
      <CabecalhoSecao
        id={id}
        dados={dados}
        onChange={onChange}
        erros={erros}
        maxTitulo={90}
        campoIntro={{ chave: "subtitulo", rotulo: "Subtítulo", max: 300 }}
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
