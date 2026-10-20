"use client";

import type { ComponentType } from "react";
import type { AncoraOpcao } from "@/features/landing/editor/fields/cta-field";
import { FormConfigAviso } from "@/features/landing/editor/forms/config/announcement-form";
import { FormConfigContato } from "@/features/landing/editor/forms/config/contact-form";
import { FormConfigRodape } from "@/features/landing/editor/forms/config/footer-form";
import { FormConfigCabecalho } from "@/features/landing/editor/forms/config/header-form";
import { FormConfigSeo } from "@/features/landing/editor/forms/config/seo-form";
import type { FormConfigProps } from "@/features/landing/editor/forms/config/types";
import type { Erros } from "@/features/landing/editor/forms/types";
import type { GrupoConfig } from "@/features/landing/editor/selection";
import type { ConfigLanding } from "@/features/landing/schema";

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
