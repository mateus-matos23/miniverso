"use client";

import type { ComponentType } from "react";

import { FieldGroup } from "@/components/ui/field";
import type { Secao, Superficie, TipoSecao } from "@/lib/landing/schema";
import type { AncoraOpcao } from "../_fields/campo-cta";
import { CampoSuperficie } from "../_fields/campo-superficie";
import { FormClientes, FormContato } from "./form-clientes-contato";
import { FormHero } from "./form-hero";
import { FormPilares } from "./form-pilares";
import { FormProcesso } from "./form-processo";
import { FormProjetos } from "./form-projetos";
import { FormSobre } from "./form-sobre";
import type { FormSecaoProps } from "./tipos";

type FormSecaoRaiz = {
  id: string;
  secao: Secao;
  onChange: (secao: Secao) => void;
  erros: Record<string, string>;
  ancoras: AncoraOpcao[];
};

/** Tipos cujo form recebe só `dados`; o hero tem props extras de aparência. */
type TipoSimples = Exclude<TipoSecao, "hero">;

const formularios: { [T in TipoSimples]: ComponentType<FormSecaoProps<T>> } = {
  sobre: FormSobre,
  pilares: FormPilares,
  projetos: FormProjetos,
  processo: FormProcesso,
  clientes: FormClientes,
  contato: FormContato,
};

/** Troca a superfície preservando o `visual` do hero, que é o único com esse campo extra. */
function comSuperficie(secao: Secao, superficie: Superficie): Secao {
  if (secao.tipo === "hero") {
    return { ...secao, aparencia: { ...secao.aparencia, superficie } };
  }
  return { ...secao, aparencia: { superficie } };
}

/** Escolhe o form do tipo da seção e acrescenta o campo de superfície comum a todas. */
export function FormSecao({
  id,
  secao,
  onChange,
  erros,
  ancoras,
}: FormSecaoRaiz) {
  const campos =
    secao.tipo === "hero" ? (
      <FormHero
        id={id}
        dados={secao.dados}
        erros={erros}
        ancoras={ancoras}
        onChange={(dados) => onChange({ ...secao, dados })}
        aparencia={secao.aparencia}
        onAparenciaChange={(aparencia) => onChange({ ...secao, aparencia })}
      />
    ) : (
      <FormSimples
        tipo={secao.tipo}
        id={id}
        dados={secao.dados}
        erros={erros}
        ancoras={ancoras}
        onChange={(dados) => onChange({ ...secao, dados } as Secao)}
      />
    );

  return (
    <FieldGroup>
      {campos}
      <CampoSuperficie
        id={`${id}-superficie`}
        valor={secao.aparencia.superficie}
        erro={erros["aparencia.superficie"]}
        onChange={(superficie) => onChange(comSuperficie(secao, superficie))}
      />
    </FieldGroup>
  );
}

/** Renderiza o form de um tipo sem campos extras, escolhido pelo mapa `formularios`. */
function FormSimples({
  tipo,
  ...props
}: Omit<FormSecaoProps<TipoSimples>, "dados"> & {
  tipo: TipoSimples;
  dados: FormSecaoProps<TipoSimples>["dados"];
}) {
  const Formulario = formularios[tipo] as ComponentType<
    FormSecaoProps<TipoSimples>
  >;
  return <Formulario {...props} />;
}
