"use client";

import { ImagePlus } from "lucide-react";
import { useActionState, useRef, useState } from "react";

import {
  atualizarCliente,
  type CadastroClienteState,
  type Cliente,
  criarCliente,
} from "@/app/admin/clientes/actions";
import {
  Attachment,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentTrigger,
} from "@/components/ui/attachment";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const initialState: CadastroClienteState = {};

const inputClassName =
  "min-h-11 w-full rounded-[.45rem] border border-[#d6dce8] bg-white px-3 text-[.85rem] text-brand-black outline-none transition-colors placeholder:text-[#9ca6b9] focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/15";

function LogoField({
  fieldId,
  mensagem,
  required,
}: {
  fieldId: string;
  mensagem?: string;
  required: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [logoName, setLogoName] = useState<string>();
  const hasError = Boolean(mensagem);

  return (
    <>
      <Attachment
        className="w-full"
        state={hasError ? "error" : logoName ? "done" : "idle"}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${fieldId}-logo-error` : undefined}
      >
        <AttachmentMedia>
          <ImagePlus aria-hidden="true" />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>
            {logoName ??
              (required ? "Selecione a logo" : "Selecione uma nova logo")}
          </AttachmentTitle>
          <AttachmentDescription>
            PNG, JPG ou WebP. Tamanho máximo: 5 MB.
          </AttachmentDescription>
        </AttachmentContent>
        <AttachmentTrigger
          type="button"
          aria-label={logoName ? "Trocar logo" : "Selecionar logo"}
          onClick={() => inputRef.current?.click()}
        />
      </Attachment>
      <Input
        ref={inputRef}
        className="sr-only"
        id={`${fieldId}-logo`}
        name="logo"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        aria-invalid={hasError}
        aria-describedby={hasError ? `${fieldId}-logo-error` : undefined}
        onChange={(event) => setLogoName(event.currentTarget.files?.[0]?.name)}
        required={required}
      />
    </>
  );
}

export default function ClienteForm({ cliente }: { cliente?: Cliente }) {
  const action = cliente ? atualizarCliente : criarCliente;
  const [state, formAction, pending] = useActionState(action, initialState);
  const fieldId = cliente ? `cliente-${cliente.id}` : "cliente";

  return (
    <form
      className="grid gap-6"
      action={formAction}
      encType="multipart/form-data"
    >
      {cliente ? <Input type="hidden" name="id" value={cliente.id} /> : null}
      <Field className="gap-[.45rem]">
        <FieldLabel
          className="text-[.76rem] font-bold text-brand-violet"
          htmlFor={`${fieldId}-nome`}
        >
          Nome do cliente
        </FieldLabel>
        <Input
          className={inputClassName}
          id={`${fieldId}-nome`}
          name="nome"
          type="text"
          autoComplete="organization"
          placeholder="Ex.: Escola Horizonte"
          defaultValue={cliente?.nome}
          aria-invalid={Boolean(state.erros?.nome)}
          aria-describedby={
            state.erros?.nome ? `${fieldId}-nome-error` : undefined
          }
          required
        />
        <FieldError
          className="text-[.72rem] text-[#bd3d45]"
          id={`${fieldId}-nome-error`}
        >
          {state.erros?.nome}
        </FieldError>
      </Field>

      <Field className="gap-[.45rem]">
        <FieldLabel
          className="text-[.76rem] font-bold text-brand-violet"
          htmlFor={`${fieldId}-logo`}
        >
          Logo
        </FieldLabel>
        <LogoField
          fieldId={fieldId}
          mensagem={state.erros?.logo}
          required={!cliente}
        />
        <FieldError
          className="text-[.72rem] text-[#bd3d45]"
          id={`${fieldId}-logo-error`}
        >
          {state.erros?.logo}
        </FieldError>
      </Field>

      <div className="grid grid-cols-2 gap-4 max-[560px]:grid-cols-1">
        <Field className="gap-[.45rem]">
          <FieldLabel
            className="text-[.76rem] font-bold text-brand-violet"
            htmlFor={`${fieldId}-status`}
          >
            Status
          </FieldLabel>
          <Select
            name="status"
            className="w-full"
            defaultSelectedKey={cliente?.status ?? "draft"}
          >
            <SelectTrigger
              className={inputClassName}
              id={`${fieldId}-status`}
              type="button"
              aria-invalid={Boolean(state.erros?.status)}
              aria-describedby={
                state.erros?.status ? `${fieldId}-status-error` : undefined
              }
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem id="draft">Rascunho</SelectItem>
              <SelectItem id="published">Publicado</SelectItem>
            </SelectContent>
          </Select>
          <FieldError
            className="text-[.72rem] text-[#bd3d45]"
            id={`${fieldId}-status-error`}
          >
            {state.erros?.status}
          </FieldError>
        </Field>

        <Field className="gap-[.45rem]">
          <FieldLabel
            className="text-[.76rem] font-bold text-brand-violet"
            htmlFor={`${fieldId}-ordem`}
          >
            Ordem de exibição
          </FieldLabel>
          <Input
            className={inputClassName}
            id={`${fieldId}-ordem`}
            name="ordem"
            type="number"
            min="0"
            step="1"
            defaultValue={cliente?.ordem ?? 0}
            aria-invalid={Boolean(state.erros?.ordem)}
            aria-describedby={
              state.erros?.ordem ? `${fieldId}-ordem-error` : undefined
            }
            required
          />
          <FieldError
            className="text-[.72rem] text-[#bd3d45]"
            id={`${fieldId}-ordem-error`}
          >
            {state.erros?.ordem}
          </FieldError>
        </Field>
      </div>

      {state.erro ? (
        <p
          className="rounded-[.45rem] bg-[#fff0f0] px-3 py-2 text-[.75rem] text-[#bd3d45]"
          role="alert"
        >
          {state.erro}
        </p>
      ) : null}

      <div className="flex justify-end border-t border-[#eef0f5] pt-5">
        <Button
          className="inline-flex min-h-11 items-center justify-center rounded-[.55rem] border border-brand-blue bg-brand-blue px-5 text-[.78rem] font-bold text-brand-white transition-transform hover:-translate-y-0.5 hover:bg-[#1039a9] disabled:cursor-wait disabled:opacity-60"
          type="submit"
          isDisabled={pending}
        >
          {pending
            ? "Salvando..."
            : cliente
              ? "Salvar alterações"
              : "Cadastrar cliente"}
        </Button>
      </div>
    </form>
  );
}
