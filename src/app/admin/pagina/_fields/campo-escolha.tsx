"use client";

import type { ReactNode } from "react";

import {
  Field,
  FieldError,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type OpcaoEscolha<T extends string> = {
  valor: T;
  rotulo: string;
  /** Conteúdo extra antes do rótulo, ex.: amostra de cor. */
  prefixo?: ReactNode;
};

type CampoEscolhaProps<T extends string> = {
  /** Prefixo estável: o rótulo do grupo usa `${id}-rotulo`. */
  id: string;
  rotulo: string;
  valor: T;
  opcoes: OpcaoEscolha<T>[];
  onChange: (valor: T) => void;
  erro?: string;
};

/** Escolha única entre poucas opções, cada uma exibida como cartão. */
export function CampoEscolha<T extends string>({
  id,
  rotulo,
  valor,
  opcoes,
  onChange,
  erro,
}: CampoEscolhaProps<T>) {
  return (
    <Field data-invalid={Boolean(erro) || undefined}>
      <FieldLabel id={`${id}-rotulo`}>{rotulo}</FieldLabel>
      <RadioGroup
        aria-labelledby={`${id}-rotulo`}
        className="flex flex-wrap gap-2"
        value={valor}
        onChange={(chave) => onChange(chave as T)}
      >
        {opcoes.map((opcao) => (
          <FieldLabel
            key={opcao.valor}
            htmlFor={`${id}-${opcao.valor}`}
            className="w-fit has-[>[data-slot=field]]:w-fit"
          >
            <Field orientation="horizontal" className="w-auto">
              <RadioGroupItem id={`${id}-${opcao.valor}`} value={opcao.valor} />
              {opcao.prefixo}
              <FieldTitle>{opcao.rotulo}</FieldTitle>
            </Field>
          </FieldLabel>
        ))}
      </RadioGroup>
      {erro ? <FieldError>{erro}</FieldError> : null}
    </Field>
  );
}
