"use client";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type CampoNumeroProps = {
  id: string;
  rotulo: string;
  valor: number;
  onChange: (valor: number) => void;
  erro?: string;
};

/** Número inteiro não negativo. Campo vazio vale 0. */
export function CampoNumero({
  id,
  rotulo,
  valor,
  onChange,
  erro,
}: CampoNumeroProps) {
  const erroId = `${id}-erro`;
  const invalido = Boolean(erro);

  return (
    <Field data-invalid={invalido || undefined}>
      <FieldLabel htmlFor={id}>{rotulo}</FieldLabel>
      <Input
        id={id}
        type="number"
        inputMode="numeric"
        min={0}
        step={1}
        value={String(valor)}
        onChange={(event) => {
          const proximo = event.currentTarget.valueAsNumber;
          onChange(Number.isNaN(proximo) ? 0 : proximo);
        }}
        aria-invalid={invalido || undefined}
        aria-describedby={erro ? erroId : undefined}
      />
      {erro ? <FieldError id={erroId}>{erro}</FieldError> : null}
    </Field>
  );
}
