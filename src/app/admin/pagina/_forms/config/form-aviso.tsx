"use client";

import { CheckIcon } from "lucide-react";
import { Checkbox, Switch } from "react-aria-components";

import { cn } from "@/lib/utils";
import { CampoCta } from "../../_fields/campo-cta";
import { CampoTexto } from "../../_fields/campo-texto";
import type { FormConfigProps } from "./tipos";

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
      <Switch
        id={`${id}-ativo`}
        isSelected={valor.ativo}
        onChange={(ativo) => onChange({ ...valor, ativo })}
        className="group flex cursor-pointer items-center gap-3 text-sm font-medium outline-none"
      >
        <span
          aria-hidden="true"
          className="flex h-6 w-11 shrink-0 items-center rounded-full bg-input p-0.5 transition-colors group-data-selected:bg-brand-blue group-data-focus-visible:ring-3 group-data-focus-visible:ring-ring/50"
        >
          <span className="size-5 rounded-full bg-background shadow-sm transition-transform group-data-selected:translate-x-5" />
        </span>
        Mostrar aviso
      </Switch>
      <CampoTexto
        id={`${id}-texto`}
        rotulo="Texto do aviso"
        max={140}
        valor={valor.texto}
        onChange={(texto) => onChange({ ...valor, texto })}
        erro={erros.texto}
      />
      <div className="flex flex-col gap-4">
        <Checkbox
          id={`${id}-tem-link`}
          isSelected={temLink}
          onChange={(marcado) =>
            onChange({ ...valor, link: marcado ? LINK_PADRAO : null })
          }
          className="group flex cursor-pointer items-center gap-3 text-sm font-medium outline-none"
        >
          {({ isSelected }) => (
            <>
              <span
                aria-hidden="true"
                className={cn(
                  "flex size-5 shrink-0 items-center justify-center rounded-sm border transition-colors group-data-focus-visible:ring-3 group-data-focus-visible:ring-ring/50",
                  isSelected
                    ? "border-brand-violet bg-brand-violet text-brand-white"
                    : "border-input",
                )}
              >
                {isSelected ? <CheckIcon className="size-3.5" /> : null}
              </span>
              Adicionar link
            </>
          )}
        </Checkbox>
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
      </div>
    </>
  );
}
