"use client";

import { CampoLista } from "../_fields/campo-lista";
import { CampoTexto } from "../_fields/campo-texto";
import type { FormSecaoProps } from "./tipos";

export function FormProcesso({
  id,
  dados,
  onChange,
  erros,
}: FormSecaoProps<"processo">) {
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
      <CampoTexto
        id={`${id}-intro`}
        rotulo="Introdução"
        max={400}
        multilinha
        valor={dados.intro}
        onChange={(intro) => onChange({ ...dados, intro })}
        erro={erros.intro}
      />
      <CampoLista
        id={`${id}-etapas`}
        legenda="Etapas"
        nomeItem="etapa"
        itens={dados.etapas}
        min={1}
        max={6}
        novoItem={() => ({ titulo: "", descricao: "" })}
        erro={erros.etapas}
        onChange={(etapas) => onChange({ ...dados, etapas })}
        renderItem={(etapa, indice, atualizar) => (
          <>
            <CampoTexto
              id={`${id}-etapa-${indice}-titulo`}
              rotulo={`Título da etapa ${indice + 1}`}
              max={80}
              valor={etapa.titulo}
              onChange={(titulo) => atualizar({ ...etapa, titulo })}
              erro={erros[`etapas.${indice}.titulo`]}
            />
            <CampoTexto
              id={`${id}-etapa-${indice}-descricao`}
              rotulo={`Descrição da etapa ${indice + 1}`}
              max={400}
              multilinha
              valor={etapa.descricao}
              onChange={(descricao) => atualizar({ ...etapa, descricao })}
              erro={erros[`etapas.${indice}.descricao`]}
            />
          </>
        )}
      />
    </>
  );
}
