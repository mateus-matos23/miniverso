"use client";

import { CampoTexto } from "@/features/landing/editor/fields/text-field";
import type { FormConfigProps } from "@/features/landing/editor/forms/config/types";

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
