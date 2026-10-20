"use client";

import type { ComponentType } from "react";

import { FieldGroup } from "@/components/ui/field";
import type { AncoraOpcao } from "@/features/landing/editor/fields/cta-field";
import { CampoSuperficie } from "@/features/landing/editor/fields/surface-field";
import { FormSobre } from "@/features/landing/editor/forms/about-form";
import {
  FormClientes,
  FormContato,
} from "@/features/landing/editor/forms/clients-contact-form";
import { FormContadores } from "@/features/landing/editor/forms/counters-form";
import { FormHero } from "@/features/landing/editor/forms/hero-form";
import { FormPilares } from "@/features/landing/editor/forms/pillars-form";
import { FormProcesso } from "@/features/landing/editor/forms/process-form";
import { FormProjetos } from "@/features/landing/editor/forms/projects-form";
import { FormDepoimentos } from "@/features/landing/editor/forms/testimonials-form";
import type { FormSecaoProps } from "@/features/landing/editor/forms/types";
import type { Secao, Superficie, TipoSecao } from "@/features/landing/schema";

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
  contadores: FormContadores,
  projetos: FormProjetos,
  processo: FormProcesso,
  depoimentos: FormDepoimentos,
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
