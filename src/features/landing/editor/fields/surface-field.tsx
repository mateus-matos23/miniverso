"use client";

import { CampoEscolha } from "@/features/landing/editor/fields/choice-field";
import { type Superficie, superficies } from "@/features/landing/schema";
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
    <CampoEscolha
      id={id}
      rotulo="Superfície"
      valor={valor}
      onChange={onChange}
      erro={erro}
      opcoes={superficies.map((chave) => ({
        valor: chave,
        rotulo: amostras[chave].rotulo,
        prefixo: (
          <span
            aria-hidden="true"
            className={cn("size-4 rounded-full", amostras[chave].classe)}
          />
        ),
      }))}
    />
  );
}
