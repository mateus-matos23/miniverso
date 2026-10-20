"use client";

import { CampoLista } from "@/features/landing/editor/fields/list-field";
import { CampoTexto } from "@/features/landing/editor/fields/text-field";
import type { FormConfigProps } from "@/features/landing/editor/forms/config/types";

export function FormConfigRodape({
  id,
  valor,
  onChange,
  erros,
}: FormConfigProps<"rodape">) {
  return (
    <CampoLista
      id={`${id}-servicos`}
      legenda="Serviços"
      nomeItem="serviço"
      itens={valor.servicos}
      min={1}
      max={10}
      novoItem={() => ""}
      erro={erros.servicos}
      onChange={(servicos) => onChange({ ...valor, servicos })}
      renderItem={(item, indice, atualizar) => (
        <CampoTexto
          id={`${id}-servico-${indice}`}
          rotulo={`Serviço ${indice + 1}`}
          max={40}
          valor={item}
          onChange={atualizar}
          erro={erros[`servicos.${indice}`]}
        />
      )}
    />
  );
}
