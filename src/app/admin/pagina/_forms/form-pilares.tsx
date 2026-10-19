"use client";

import { CampoLista } from "../_fields/campo-lista";
import { CampoTexto } from "../_fields/campo-texto";
import type { FormSecaoProps } from "./tipos";

export function FormPilares({
  id,
  dados,
  onChange,
  erros,
}: FormSecaoProps<"pilares">) {
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
        id={`${id}-itens`}
        legenda="Pilares"
        nomeItem="pilar"
        itens={dados.itens}
        min={1}
        max={8}
        novoItem={() => ({ titulo: "", descricao: "" })}
        erro={erros.itens}
        onChange={(itens) => onChange({ ...dados, itens })}
        renderItem={(item, indice, atualizar) => (
          <>
            <CampoTexto
              id={`${id}-item-${indice}-titulo`}
              rotulo={`Título do pilar ${indice + 1}`}
              max={80}
              valor={item.titulo}
              onChange={(titulo) => atualizar({ ...item, titulo })}
              erro={erros[`itens.${indice}.titulo`]}
            />
            <CampoTexto
              id={`${id}-item-${indice}-descricao`}
              rotulo={`Descrição do pilar ${indice + 1}`}
              max={400}
              multilinha
              valor={item.descricao}
              onChange={(descricao) => atualizar({ ...item, descricao })}
              erro={erros[`itens.${indice}.descricao`]}
            />
          </>
        )}
      />
    </>
  );
}
