"use client";

import { FormCartoesTitulados } from "@/features/landing/editor/forms/titled-cards-form";
import type { FormSecaoProps } from "@/features/landing/editor/forms/types";

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
