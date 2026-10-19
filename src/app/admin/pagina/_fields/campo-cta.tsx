"use client";

import { useState } from "react";

import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Cta } from "@/lib/landing/schema";

import { CampoTexto } from "./campo-texto";

const OUTRO_LINK = "__outro__";

export type AncoraOpcao = { valor: string; rotulo: string };

type CampoCtaProps = {
  id: string;
  legenda: string;
  valor: Cta;
  onChange: (valor: Cta) => void;
  ancoras: AncoraOpcao[];
  erros?: { rotulo?: string; destino?: string };
};

export function CampoCta({
  id,
  legenda,
  valor,
  onChange,
  ancoras,
  erros,
}: CampoCtaProps) {
  const ehAncora = ancoras.some((ancora) => ancora.valor === valor.destino);
  // "Outro link" fica ativo se o destino não corresponde a nenhuma âncora.
  const [modoOutro, setModoOutro] = useState(!ehAncora);
  const chaveSelecionada = modoOutro ? OUTRO_LINK : valor.destino;

  function escolherDestino(chave: string) {
    if (chave === OUTRO_LINK) {
      setModoOutro(true);
      return;
    }
    setModoOutro(false);
    onChange({ ...valor, destino: chave });
  }

  return (
    <FieldSet className="gap-4">
      <FieldLegend variant="label">{legenda}</FieldLegend>
      <FieldGroup className="gap-4">
        <CampoTexto
          id={`${id}-rotulo`}
          rotulo="Rótulo do botão"
          max={40}
          valor={valor.rotulo}
          onChange={(rotulo) => onChange({ ...valor, rotulo })}
          erro={erros?.rotulo}
        />
        <Field>
          <FieldLabel
            htmlFor={`${id}-destino-select`}
            id={`${id}-destino-rotulo`}
          >
            Destino
          </FieldLabel>
          <Select
            aria-labelledby={`${id}-destino-rotulo`}
            className="w-full"
            selectedKey={chaveSelecionada}
            onSelectionChange={(chave) => escolherDestino(String(chave))}
          >
            <SelectTrigger id={`${id}-destino-select`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ancoras.map((ancora) => (
                <SelectItem key={ancora.valor} id={ancora.valor}>
                  {ancora.rotulo}
                </SelectItem>
              ))}
              <SelectItem id={OUTRO_LINK}>Outro link</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        {modoOutro ? (
          <CampoTexto
            id={`${id}-destino`}
            rotulo="Link personalizado"
            max={300}
            valor={valor.destino}
            onChange={(destino) => onChange({ ...valor, destino })}
            erro={erros?.destino}
          />
        ) : null}
      </FieldGroup>
    </FieldSet>
  );
}
