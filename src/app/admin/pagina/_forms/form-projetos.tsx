"use client";

import { CampoCta } from "../_fields/campo-cta";
import { CampoTexto } from "../_fields/campo-texto";
import type { FormSecaoProps } from "./tipos";

export function FormProjetos({
  id,
  dados,
  onChange,
  erros,
  ancoras,
}: FormSecaoProps<"projetos">) {
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
        max={90}
        valor={dados.titulo}
        onChange={(titulo) => onChange({ ...dados, titulo })}
        erro={erros.titulo}
      />
      <CampoTexto
        id={`${id}-vazio-titulo`}
        rotulo="Título do estado vazio"
        max={90}
        valor={dados.vazioTitulo}
        onChange={(vazioTitulo) => onChange({ ...dados, vazioTitulo })}
        erro={erros.vazioTitulo}
      />
      <CampoTexto
        id={`${id}-vazio-descricao`}
        rotulo="Descrição do estado vazio"
        max={300}
        multilinha
        valor={dados.vazioDescricao}
        onChange={(vazioDescricao) => onChange({ ...dados, vazioDescricao })}
        erro={erros.vazioDescricao}
      />
      <CampoCta
        id={`${id}-vazio-cta`}
        legenda="Botão do estado vazio"
        valor={dados.vazioCta}
        onChange={(vazioCta) => onChange({ ...dados, vazioCta })}
        ancoras={ancoras}
        erros={{
          rotulo: erros["vazioCta.rotulo"],
          destino: erros["vazioCta.destino"],
        }}
      />
    </>
  );
}
