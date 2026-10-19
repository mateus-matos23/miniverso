"use client";

import { Radio, RadioGroup } from "react-aria-components";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { type Superficie, superficies } from "@/lib/landing/schema";
import { cn } from "@/lib/utils";

const amostras: Record<Superficie, { rotulo: string; classe: string }> = {
  black: { rotulo: "Preto", classe: "bg-brand-black" },
  violet: { rotulo: "Violeta", classe: "bg-brand-violet" },
  aurora: { rotulo: "Aurora", classe: "bg-brand-aurora" },
  white: { rotulo: "Branco", classe: "border border-border bg-brand-white" },
  tint: { rotulo: "Tinta", classe: "bg-brand-tint" },
};

type CampoSuperficieProps = {
  id: string;
  valor: Superficie;
  onChange: (valor: Superficie) => void;
  erro?: string;
};

export function CampoSuperficie({
  id,
  valor,
  onChange,
  erro,
}: CampoSuperficieProps) {
  return (
    <Field data-invalid={Boolean(erro) || undefined}>
      <FieldLabel id={`${id}-rotulo`}>Superfície</FieldLabel>
      <RadioGroup
        aria-labelledby={`${id}-rotulo`}
        className="flex flex-wrap gap-2"
        value={valor}
        onChange={(chave) => onChange(chave as Superficie)}
      >
        {superficies.map((chave) => (
          <Radio
            key={chave}
            value={chave}
            className={({ isFocusVisible, isSelected }) =>
              cn(
                "flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors",
                isSelected ? "border-ring ring-3 ring-ring/30" : "border-input",
                isFocusVisible && "ring-3 ring-ring/50",
              )
            }
          >
            <span
              aria-hidden="true"
              className={cn("size-4 rounded-full", amostras[chave].classe)}
            />
            {amostras[chave].rotulo}
          </Radio>
        ))}
      </RadioGroup>
      {erro ? <FieldError>{erro}</FieldError> : null}
    </Field>
  );
}
