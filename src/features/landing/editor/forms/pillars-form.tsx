"use client";

import { FormCartoesTitulados } from "@/features/landing/editor/forms/titled-cards-form";
import type { FormSecaoProps } from "@/features/landing/editor/forms/types";

export function FormPilares(props: FormSecaoProps<"pilares">) {
  return (
    <FormCartoesTitulados
      {...props}
      chave="itens"
      legenda="Pilares"
      nomeItem="pilar"
      artigo="do"
      idItem="item"
      max={8}
      maxTitulo={120}
      maxIntro={400}
      maxTituloItem={80}
      maxDescricaoItem={400}
    />
  );
}
