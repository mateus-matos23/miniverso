"use client";

import type { ConfigLanding } from "@/lib/landing/schema";
import type { AncoraOpcao } from "../../_fields/campo-cta";
import type { GrupoConfig } from "../../selecao";
import type { Erros } from "../tipos";
import { FormConfigAviso } from "./form-aviso";
import { FormConfigCabecalho } from "./form-cabecalho";
import { FormConfigContato } from "./form-contato";
import { FormConfigRodape } from "./form-rodape";
import { FormConfigSeo } from "./form-seo";

type FormConfigProps = {
  id: string;
  grupo: GrupoConfig;
  config: ConfigLanding;
  onChange: (config: ConfigLanding) => void;
  erros: Erros;
  ancoras: AncoraOpcao[];
};

/**
 * Escolhe o form do grupo de configuração. Cada form recebe só o próprio
 * subgrupo, e o `onChange` devolve o `config` inteiro com essa troca.
 */
export function FormConfig({
  id,
  grupo,
  config,
  onChange,
  erros,
  ancoras,
}: FormConfigProps) {
  switch (grupo) {
    case "contato":
      return (
        <FormConfigContato
          id={id}
          valor={config.contato}
          erros={erros}
          ancoras={ancoras}
          onChange={(contato) => onChange({ ...config, contato })}
        />
      );
    case "seo":
      return (
        <FormConfigSeo
          id={id}
          valor={config.seo}
          erros={erros}
          ancoras={ancoras}
          onChange={(seo) => onChange({ ...config, seo })}
        />
      );
    case "cabecalho":
      return (
        <FormConfigCabecalho
          id={id}
          valor={config.cabecalho}
          erros={erros}
          ancoras={ancoras}
          onChange={(cabecalho) => onChange({ ...config, cabecalho })}
        />
      );
    case "rodape":
      return (
        <FormConfigRodape
          id={id}
          valor={config.rodape}
          erros={erros}
          ancoras={ancoras}
          onChange={(rodape) => onChange({ ...config, rodape })}
        />
      );
    case "aviso":
      return (
        <FormConfigAviso
          id={id}
          valor={config.aviso}
          erros={erros}
          ancoras={ancoras}
          onChange={(aviso) => onChange({ ...config, aviso })}
        />
      );
  }
}
