"use client";

import { CampoLista } from "@/features/landing/editor/fields/list-field";
import { CabecalhoSecao } from "@/features/landing/editor/fields/section-header";
import { CampoTexto } from "@/features/landing/editor/fields/text-field";
import type { Erros } from "@/features/landing/editor/forms/types";

type ItemTitulado = { titulo: string; descricao: string };

/** Cabeçalho com introdução, mais uma lista de itens com título e descrição na chave `C`. */
type DadosCartoes<C extends string> = {
  rotulo: string;
  titulo: string;
  intro: string;
} & Record<C, ItemTitulado[]>;

type FormCartoesTituladosProps<C extends string> = {
  /** Prefixo estável para os ids dos campos. */
  id: string;
  dados: DadosCartoes<C>;
  onChange: (dados: DadosCartoes<C>) => void;
  erros: Erros;
  /** Chave da lista em `dados` e no mapa de erros, ex.: "itens". */
  chave: C;
  legenda: string;
  /** Nome singular usado nos rótulos, ex.: "pilar". */
  nomeItem: string;
  /** Artigo que acompanha o nome nos rótulos: "do" ou "da". */
  artigo: "do" | "da";
  /** Segmento dos ids de cada item, ex.: "item" gera `${id}-item-0-titulo`. */
  idItem: string;
  max: number;
  maxTitulo: number;
  maxIntro: number;
  maxTituloItem: number;
  maxDescricaoItem: number;
};

/** Seção com cabeçalho e uma lista de cartões com título e descrição. */
export function FormCartoesTitulados<C extends string>({
  id,
  dados,
  onChange,
  erros,
  chave,
  legenda,
  nomeItem,
  artigo,
  idItem,
  max,
  maxTitulo,
  maxIntro,
  maxTituloItem,
  maxDescricaoItem,
}: FormCartoesTituladosProps<C>) {
  return (
    <>
      <CabecalhoSecao
        id={id}
        dados={dados}
        onChange={onChange}
        erros={erros}
        maxTitulo={maxTitulo}
        campoIntro={{ chave: "intro", rotulo: "Introdução", max: maxIntro }}
      />
      <CampoLista
        id={`${id}-${chave}`}
        legenda={legenda}
        nomeItem={nomeItem}
        itens={dados[chave]}
        min={1}
        max={max}
        novoItem={() => ({ titulo: "", descricao: "" })}
        erro={erros[chave]}
        onChange={(proximos) => onChange({ ...dados, [chave]: proximos })}
        renderItem={(item, indice, atualizar) => (
          <>
            <CampoTexto
              id={`${id}-${idItem}-${indice}-titulo`}
              rotulo={`Título ${artigo} ${nomeItem} ${indice + 1}`}
              max={maxTituloItem}
              valor={item.titulo}
              onChange={(titulo) => atualizar({ ...item, titulo })}
              erro={erros[`${chave}.${indice}.titulo`]}
            />
            <CampoTexto
              id={`${id}-${idItem}-${indice}-descricao`}
              rotulo={`Descrição ${artigo} ${nomeItem} ${indice + 1}`}
              max={maxDescricaoItem}
              multilinha
              valor={item.descricao}
              onChange={(descricao) => atualizar({ ...item, descricao })}
              erro={erros[`${chave}.${indice}.descricao`]}
            />
          </>
        )}
      />
    </>
  );
}
