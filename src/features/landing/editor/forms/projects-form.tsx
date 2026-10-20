"use client";

import { CampoCta } from "@/features/landing/editor/fields/cta-field";
import { CabecalhoSecao } from "@/features/landing/editor/fields/section-header";
import { CampoTexto } from "@/features/landing/editor/fields/text-field";
import type { FormSecaoProps } from "@/features/landing/editor/forms/types";

export function FormProjetos({
  id,
  dados,
  onChange,
  erros,
  ancoras,
}: FormSecaoProps<"projetos">) {
  return (
    <>
      <CabecalhoSecao
        id={id}
        dados={dados}
        onChange={onChange}
        erros={erros}
        maxTitulo={90}
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
