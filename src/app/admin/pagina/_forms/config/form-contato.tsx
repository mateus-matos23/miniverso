"use client";

import { CampoTexto } from "../../_fields/campo-texto";
import type { FormConfigProps } from "./tipos";

export function FormConfigContato({
  id,
  valor,
  onChange,
  erros,
}: FormConfigProps<"contato">) {
  return (
    <>
      <CampoTexto
        id={`${id}-email`}
        rotulo="E-mail"
        valor={valor.email}
        onChange={(email) => onChange({ ...valor, email })}
        erro={erros.email}
      />
      <CampoTexto
        id={`${id}-telefone`}
        rotulo="Telefone"
        max={30}
        valor={valor.telefone}
        onChange={(telefone) => onChange({ ...valor, telefone })}
        erro={erros.telefone}
      />
      <CampoTexto
        id={`${id}-instagram-url`}
        rotulo="Link do Instagram"
        valor={valor.instagramUrl}
        onChange={(instagramUrl) => onChange({ ...valor, instagramUrl })}
        erro={erros.instagramUrl}
      />
      <CampoTexto
        id={`${id}-instagram-handle`}
        rotulo="@ do Instagram"
        max={60}
        valor={valor.instagramHandle}
        onChange={(instagramHandle) => onChange({ ...valor, instagramHandle })}
        erro={erros.instagramHandle}
      />
      <CampoTexto
        id={`${id}-cidade`}
        rotulo="Cidade"
        max={80}
        valor={valor.cidade}
        onChange={(cidade) => onChange({ ...valor, cidade })}
        erro={erros.cidade}
      />
      <CampoTexto
        id={`${id}-estado`}
        rotulo="Estado"
        max={80}
        valor={valor.estado}
        onChange={(estado) => onChange({ ...valor, estado })}
        erro={erros.estado}
      />
      <CampoTexto
        id={`${id}-uf`}
        rotulo="UF"
        valor={valor.uf}
        onChange={(uf) => onChange({ ...valor, uf })}
        erro={erros.uf}
      />
    </>
  );
}
