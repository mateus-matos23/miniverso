"use client";

import type { Secao, Superficie } from "@/lib/landing/schema";
import type { AncoraOpcao } from "../_fields/campo-cta";
import { CampoSuperficie } from "../_fields/campo-superficie";
import { FormClientes, FormContato } from "./form-clientes-contato";
import { FormHero } from "./form-hero";
import { FormPilares } from "./form-pilares";
import { FormProcesso } from "./form-processo";
import { FormProjetos } from "./form-projetos";
import { FormSobre } from "./form-sobre";
import type { Erros } from "./tipos";

type FormSecaoProps = {
  id: string;
  secao: Secao;
  onChange: (secao: Secao) => void;
  erros: Erros;
  ancoras: AncoraOpcao[];
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
}: FormSecaoProps) {
  const errosSuperficie = erros["aparencia.superficie"];

  const campoSuperficie = (
    <CampoSuperficie
      id={`${id}-superficie`}
      valor={secao.aparencia.superficie}
      erro={errosSuperficie}
      onChange={(superficie) => onChange(comSuperficie(secao, superficie))}
    />
  );

  const campos = (() => {
    switch (secao.tipo) {
      case "hero":
        return (
          <FormHero
            id={id}
            dados={secao.dados}
            erros={erros}
            ancoras={ancoras}
            onChange={(dados) => onChange({ ...secao, dados })}
            aparencia={secao.aparencia}
            onAparenciaChange={(aparencia) => onChange({ ...secao, aparencia })}
          />
        );
      case "sobre":
        return (
          <FormSobre
            id={id}
            dados={secao.dados}
            erros={erros}
            ancoras={ancoras}
            onChange={(dados) => onChange({ ...secao, dados })}
          />
        );
      case "pilares":
        return (
          <FormPilares
            id={id}
            dados={secao.dados}
            erros={erros}
            ancoras={ancoras}
            onChange={(dados) => onChange({ ...secao, dados })}
          />
        );
      case "projetos":
        return (
          <FormProjetos
            id={id}
            dados={secao.dados}
            erros={erros}
            ancoras={ancoras}
            onChange={(dados) => onChange({ ...secao, dados })}
          />
        );
      case "processo":
        return (
          <FormProcesso
            id={id}
            dados={secao.dados}
            erros={erros}
            ancoras={ancoras}
            onChange={(dados) => onChange({ ...secao, dados })}
          />
        );
      case "clientes":
        return (
          <FormClientes
            id={id}
            dados={secao.dados}
            erros={erros}
            ancoras={ancoras}
            onChange={(dados) => onChange({ ...secao, dados })}
          />
        );
      case "contato":
        return (
          <FormContato
            id={id}
            dados={secao.dados}
            erros={erros}
            ancoras={ancoras}
            onChange={(dados) => onChange({ ...secao, dados })}
          />
        );
    }
  })();

  return (
    <div className="flex flex-col gap-6">
      {campos}
      {campoSuperficie}
    </div>
  );
}
