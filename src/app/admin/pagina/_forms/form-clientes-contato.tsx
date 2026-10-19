"use client";

import { CabecalhoSecao } from "../_fields/cabecalho-secao";
import type { FormSecaoProps } from "./tipos";

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
