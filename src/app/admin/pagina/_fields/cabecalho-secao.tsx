"use client";

import type { Erros } from "../_forms/tipos";
import { CampoTexto } from "./campo-texto";

type CabecalhoBase = { rotulo: string; titulo: string };

type CabecalhoSecaoProps<C extends string, T extends CabecalhoBase> = {
  /** Prefixo estável para os ids dos campos. */
  id: string;
  dados: T;
  onChange: (dados: T) => void;
  erros: Erros;
  /** Limite do schema para o título. */
  maxTitulo: number;
  /** Campo multilinha opcional logo abaixo do título, ex.: "intro" ou "subtitulo". */
  campoIntro?: { chave: C; rotulo: string; max: number };
};

/** Rótulo, título e (opcionalmente) texto de introdução compartilhados pelas seções. */
export function CabecalhoSecao<
  C extends string = never,
  T extends CabecalhoBase & Record<C, string> = CabecalhoBase &
    Record<C, string>,
>({
  id,
  dados,
  onChange,
  erros,
  maxTitulo,
  campoIntro,
}: CabecalhoSecaoProps<C, T>) {
  return (
    <>
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
        max={maxTitulo}
        valor={dados.titulo}
        onChange={(titulo) => onChange({ ...dados, titulo })}
        erro={erros.titulo}
      />
      {campoIntro ? (
        <CampoTexto
          id={`${id}-${campoIntro.chave}`}
          rotulo={campoIntro.rotulo}
          max={campoIntro.max}
          multilinha
          valor={dados[campoIntro.chave]}
          onChange={(valor) =>
            onChange({ ...dados, [campoIntro.chave]: valor })
          }
          erro={erros[campoIntro.chave]}
        />
      ) : null}
    </>
  );
}
