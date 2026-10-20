"use client";

import { CabecalhoSecao } from "@/features/landing/editor/fields/section-header";
import type { FormSecaoProps } from "@/features/landing/editor/forms/types";

export function FormClientes({
  id,
  dados,
  onChange,
  erros,
}: FormSecaoProps<"clientes">) {
  return (
    <CabecalhoSecao
      id={id}
      dados={dados}
      onChange={onChange}
      erros={erros}
      maxTitulo={90}
    />
  );
}

export function FormContato({
  id,
  dados,
  onChange,
  erros,
}: FormSecaoProps<"contato">) {
  return (
    <CabecalhoSecao
      id={id}
      dados={dados}
      onChange={onChange}
      erros={erros}
      maxTitulo={90}
      campoIntro={{ chave: "intro", rotulo: "Introdução", max: 300 }}
    />
  );
}
