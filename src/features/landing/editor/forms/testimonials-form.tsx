"use client";

import { CampoLista } from "@/features/landing/editor/fields/list-field";
import { CabecalhoSecao } from "@/features/landing/editor/fields/section-header";
import { CampoTexto } from "@/features/landing/editor/fields/text-field";
import type { FormSecaoProps } from "@/features/landing/editor/forms/types";

export function FormDepoimentos({
  id,
  dados,
  onChange,
  erros,
}: FormSecaoProps<"depoimentos">) {
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
        legenda="Depoimentos"
        nomeItem="depoimento"
        itens={dados.itens}
        min={1}
        max={6}
        novoItem={() => ({ nome: "", cargo: "", fala: "" })}
        erro={erros.itens}
        onChange={(itens) => onChange({ ...dados, itens })}
        renderItem={(item, indice, atualizar) => (
          <>
            <CampoTexto
              id={`${id}-item-${indice}-nome`}
              rotulo={`Nome do depoimento ${indice + 1}`}
              max={80}
              valor={item.nome}
              onChange={(nome) => atualizar({ ...item, nome })}
              erro={erros[`itens.${indice}.nome`]}
            />
            <CampoTexto
              id={`${id}-item-${indice}-cargo`}
              rotulo={`Cargo do depoimento ${indice + 1}`}
              max={120}
              valor={item.cargo}
              onChange={(cargo) => atualizar({ ...item, cargo })}
              erro={erros[`itens.${indice}.cargo`]}
            />
            <CampoTexto
              id={`${id}-item-${indice}-fala`}
              rotulo={`Fala do depoimento ${indice + 1}`}
              max={500}
              multilinha
              valor={item.fala}
              onChange={(fala) => atualizar({ ...item, fala })}
              erro={erros[`itens.${indice}.fala`]}
            />
          </>
        )}
      />
    </>
  );
}
