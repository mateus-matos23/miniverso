"use client";

import { CampoLista } from "@/features/landing/editor/fields/list-field";
import { CabecalhoSecao } from "@/features/landing/editor/fields/section-header";
import { CampoTexto } from "@/features/landing/editor/fields/text-field";
import type { FormSecaoProps } from "@/features/landing/editor/forms/types";

export function FormSobre({
  id,
  dados,
  onChange,
  erros,
}: FormSecaoProps<"sobre">) {
  return (
    <>
      <CabecalhoSecao
        id={id}
        dados={dados}
        onChange={onChange}
        erros={erros}
        maxTitulo={120}
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
