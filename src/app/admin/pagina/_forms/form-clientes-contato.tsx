"use client";

import { CampoTexto } from "../_fields/campo-texto";
import type { FormSecaoProps } from "./tipos";

export function FormClientes({
  id,
  dados,
  onChange,
  erros,
}: FormSecaoProps<"clientes">) {
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
    </>
  );
}

export function FormContato({
  id,
  dados,
  onChange,
  erros,
}: FormSecaoProps<"contato">) {
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
        id={`${id}-intro`}
        rotulo="Introdução"
        max={300}
        multilinha
        valor={dados.intro}
        onChange={(intro) => onChange({ ...dados, intro })}
        erro={erros.intro}
      />
    </>
  );
}
