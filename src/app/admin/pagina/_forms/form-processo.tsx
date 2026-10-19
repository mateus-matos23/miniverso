"use client";

import { FormCartoesTitulados } from "./form-cartoes-titulados";
import type { FormSecaoProps } from "./tipos";

export function FormProcesso(props: FormSecaoProps<"processo">) {
  return (
    <FormCartoesTitulados
      {...props}
      chave="etapas"
      legenda="Etapas"
      nomeItem="etapa"
      artigo="da"
      idItem="etapa"
      max={6}
      maxTitulo={120}
      maxIntro={400}
      maxTituloItem={80}
      maxDescricaoItem={400}
    />
  );
}
