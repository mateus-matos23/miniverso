"use client";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type CampoTextoProps = {
  id: string;
  rotulo: string;
  valor: string;
  onChange: (valor: string) => void;
  /** Limite do schema, usado no contador "12/90". */
  max?: number;
  multilinha?: boolean;
  erro?: string;
};

export function CampoTexto({
  id,
  rotulo,
  valor,
  onChange,
  max,
  multilinha = false,
  erro,
}: CampoTextoProps) {
  const erroId = `${id}-erro`;
  const contadorId = `${id}-contador`;
  const descritoPor = [max ? contadorId : null, erro ? erroId : null]
    .filter(Boolean)
    .join(" ");
  const invalido = Boolean(erro);

  const controle = multilinha ? (
    <Textarea
      id={id}
      value={valor}
      onChange={(event) => onChange(event.currentTarget.value)}
      aria-invalid={invalido || undefined}
      aria-describedby={descritoPor || undefined}
      rows={3}
    />
  ) : (
    <Input
      id={id}
      type="text"
      value={valor}
      onChange={(event) => onChange(event.currentTarget.value)}
      aria-invalid={invalido || undefined}
      aria-describedby={descritoPor || undefined}
    />
  );

  return (
    <Field data-invalid={invalido || undefined}>
      <FieldLabel htmlFor={id}>{rotulo}</FieldLabel>
      {controle}
      {max ? (
        <FieldDescription id={contadorId}>
          {valor.length}/{max}
        </FieldDescription>
      ) : null}
      {erro ? <FieldError id={erroId}>{erro}</FieldError> : null}
    </Field>
  );
}
