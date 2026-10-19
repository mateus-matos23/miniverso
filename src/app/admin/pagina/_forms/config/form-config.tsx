"use client";

import type { ComponentType } from "react";

import type { ConfigLanding } from "@/lib/landing/schema";
import type { AncoraOpcao } from "../../_fields/campo-cta";
import type { GrupoConfig } from "../../selecao";
import type { Erros } from "../tipos";
import { FormConfigAviso } from "./form-aviso";
import { FormConfigCabecalho } from "./form-cabecalho";
import { FormConfigContato } from "./form-contato";
import { FormConfigRodape } from "./form-rodape";
import { FormConfigSeo } from "./form-seo";
import type { FormConfigProps } from "./tipos";

type FormConfigRaiz = {
  id: string;
  grupo: GrupoConfig;
  config: ConfigLanding;
  onChange: (config: ConfigLanding) => void;
  erros: Erros;
  ancoras: AncoraOpcao[];
};

const formularios: { [G in GrupoConfig]: ComponentType<FormConfigProps<G>> } = {
  contato: FormConfigContato,
  seo: FormConfigSeo,
  cabecalho: FormConfigCabecalho,
  rodape: FormConfigRodape,
  aviso: FormConfigAviso,
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
}: FormConfigRaiz) {
  const Formulario = formularios[grupo] as ComponentType<
    FormConfigProps<GrupoConfig>
  >;
  return (
    <Formulario
      id={id}
      valor={config[grupo]}
      erros={erros}
      ancoras={ancoras}
      onChange={(valor) =>
        onChange({ ...config, [grupo]: valor } as ConfigLanding)
      }
    />
  );
}
