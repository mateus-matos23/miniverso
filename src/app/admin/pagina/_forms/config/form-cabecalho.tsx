"use client";

import { CampoTexto } from "../../_fields/campo-texto";
import type { FormConfigProps } from "./tipos";

export function FormConfigCabecalho({
  id,
  valor,
  onChange,
  erros,
}: FormConfigProps<"cabecalho">) {
  return (
    <CampoTexto
      id={`${id}-cta-rotulo`}
      rotulo="Rótulo do botão"
      max={40}
      valor={valor.ctaRotulo}
      onChange={(ctaRotulo) => onChange({ ...valor, ctaRotulo })}
      erro={erros.ctaRotulo}
    />
  );
}
