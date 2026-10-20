"use client";

import { CampoLista } from "@/features/landing/editor/fields/list-field";
import { CampoNumero } from "@/features/landing/editor/fields/number-field";
import { CabecalhoSecao } from "@/features/landing/editor/fields/section-header";
import { CampoTexto } from "@/features/landing/editor/fields/text-field";
import type { FormSecaoProps } from "@/features/landing/editor/forms/types";

export function FormContadores({
  id,
  dados,
  onChange,
  erros,
}: FormSecaoProps<"contadores">) {
  return (
    <>
      <CabecalhoSecao
        id={id}
        dados={dados}
        onChange={onChange}
        erros={erros}
        maxTitulo={120}
      />
      <CampoLista
        id={`${id}-itens`}
        legenda="Números"
        nomeItem="número"
        itens={dados.itens}
        min={1}
        max={4}
        novoItem={() => ({ titulo: "", numero: 0 })}
        erro={erros.itens}
        onChange={(itens) => onChange({ ...dados, itens })}
        renderItem={(item, indice, atualizar) => (
          <>
            <CampoTexto
              id={`${id}-item-${indice}-titulo`}
              rotulo={`Título do número ${indice + 1}`}
              max={60}
              valor={item.titulo}
              onChange={(titulo) => atualizar({ ...item, titulo })}
              erro={erros[`itens.${indice}.titulo`]}
            />
            <CampoNumero
              id={`${id}-item-${indice}-numero`}
              rotulo={`Valor do número ${indice + 1}`}
              valor={item.numero}
              onChange={(numero) => atualizar({ ...item, numero })}
              erro={erros[`itens.${indice}.numero`]}
            />
          </>
        )}
      />
    </>
  );
}
