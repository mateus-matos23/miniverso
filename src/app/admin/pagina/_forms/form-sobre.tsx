"use client";

import { CampoLista } from "../_fields/campo-lista";
import { CampoTexto } from "../_fields/campo-texto";
import type { FormSecaoProps } from "./tipos";

export function FormSobre({
  id,
  dados,
  onChange,
  erros,
}: FormSecaoProps<"sobre">) {
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
        max={120}
        valor={dados.titulo}
        onChange={(titulo) => onChange({ ...dados, titulo })}
        erro={erros.titulo}
      />
      <CampoLista
        id={`${id}-paragrafos`}
        legenda="Parágrafos"
        nomeItem="parágrafo"
        itens={dados.paragrafos}
        min={1}
        max={4}
        novoItem={() => ""}
        erro={erros.paragrafos}
        onChange={(paragrafos) => onChange({ ...dados, paragrafos })}
        renderItem={(paragrafo, indice, atualizar) => (
          <CampoTexto
            id={`${id}-paragrafo-${indice}`}
            rotulo={`Parágrafo ${indice + 1}`}
            max={600}
            multilinha
            valor={paragrafo}
            onChange={atualizar}
            erro={erros[`paragrafos.${indice}`]}
          />
        )}
      />
      <CampoLista
        id={`${id}-principios`}
        legenda="Princípios"
        nomeItem="princípio"
        itens={dados.principios}
        min={1}
        max={4}
        novoItem={() => ({ termo: "", descricao: "" })}
        erro={erros.principios}
        onChange={(principios) => onChange({ ...dados, principios })}
        renderItem={(principio, indice, atualizar) => (
          <>
            <CampoTexto
              id={`${id}-principio-${indice}-termo`}
              rotulo={`Termo ${indice + 1}`}
              max={40}
              valor={principio.termo}
              onChange={(termo) => atualizar({ ...principio, termo })}
              erro={erros[`principios.${indice}.termo`]}
            />
            <CampoTexto
              id={`${id}-principio-${indice}-descricao`}
              rotulo={`Descrição ${indice + 1}`}
              max={400}
              multilinha
              valor={principio.descricao}
              onChange={(descricao) => atualizar({ ...principio, descricao })}
              erro={erros[`principios.${indice}.descricao`]}
            />
          </>
        )}
      />
    </>
  );
}
