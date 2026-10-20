"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { CampoCta } from "@/features/landing/editor/fields/cta-field";
import { CampoTexto } from "@/features/landing/editor/fields/text-field";
import type { FormConfigProps } from "@/features/landing/editor/forms/config/types";

/** Link padrão ao marcar "Adicionar link": preenchido para o usuário só ajustar. */
const LINK_PADRAO = { rotulo: "Saiba mais", destino: "#contato" };

export function FormConfigAviso({
  id,
  valor,
  onChange,
  erros,
  ancoras,
}: FormConfigProps<"aviso">) {
  const temLink = valor.link != null;

  return (
    <>
      <Field orientation="horizontal">
        <Switch
          id={`${id}-ativo`}
          isSelected={valor.ativo}
          onChange={(ativo) => onChange({ ...valor, ativo })}
        />
        <FieldLabel htmlFor={`${id}-ativo`}>Mostrar aviso</FieldLabel>
      </Field>
      <CampoTexto
        id={`${id}-texto`}
        rotulo="Texto do aviso"
        max={140}
        valor={valor.texto}
        onChange={(texto) => onChange({ ...valor, texto })}
        erro={erros.texto}
      />
      <FieldGroup className="gap-4">
        <Field orientation="horizontal">
          <Checkbox
            id={`${id}-tem-link`}
            isSelected={temLink}
            onChange={(marcado) =>
              onChange({ ...valor, link: marcado ? LINK_PADRAO : null })
            }
          />
          <FieldLabel htmlFor={`${id}-tem-link`}>Adicionar link</FieldLabel>
        </Field>
        {valor.link ? (
          <CampoCta
            id={`${id}-link`}
            legenda="Link do aviso"
            valor={valor.link}
            onChange={(link) => onChange({ ...valor, link })}
            ancoras={ancoras}
            erros={{
              rotulo: erros["link.rotulo"],
              destino: erros["link.destino"],
            }}
          />
        ) : null}
      </FieldGroup>
    </>
  );
}
