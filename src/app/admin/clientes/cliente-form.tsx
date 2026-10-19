"use client";

import { ImagePlus } from "lucide-react";
import { useActionState, useRef, useState } from "react";
import { FileTrigger } from "react-aria-components";

import {
  atualizarCliente,
  type CadastroClienteState,
  type Cliente,
  criarCliente,
} from "@/app/admin/clientes/actions";
import { Alert } from "@/components/ui/alert";
import {
  Attachment,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
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
import { Spinner } from "@/components/ui/spinner";
import { sincronizarArquivoFormulario } from "@/lib/arquivo-formulario";

const initialState: CadastroClienteState = {};
const TIPOS_LOGO = ["image/jpeg", "image/png", "image/webp"];

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

  function escolherLogo(files: FileList | null) {
    sincronizarArquivoFormulario(inputRef.current, files);
    setLogoName(files?.[0]?.name);
  }

  return (
    <>
      <Attachment
        className="w-full"
        state={hasError ? "error" : logoName ? "done" : "idle"}
        aria-invalid={hasError || undefined}
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
            PNG, JPG ou WebP, até 5 MB. Prefira fundo transparente.
          </AttachmentDescription>
        </AttachmentContent>
        <FileTrigger acceptedFileTypes={TIPOS_LOGO} onSelect={escolherLogo}>
          <Button
            aria-label={logoName ? "Trocar logo" : "Selecionar logo"}
            variant="ghost"
            className="absolute inset-0 z-10 h-full w-full rounded-none p-0 outline-none hover:bg-transparent"
          />
        </FileTrigger>
      </Attachment>
      {/* Recebe o arquivo do FileTrigger para o FormData; a validação real é no servidor. */}
      <input
        ref={inputRef}
        hidden
        name="logo"
        type="file"
        accept={TIPOS_LOGO.join(",")}
      />
    </>
  );
}

export default function ClienteForm({ cliente }: { cliente?: Cliente }) {
  const action = cliente ? atualizarCliente : criarCliente;
  const [state, formAction, pending] = useActionState(action, initialState);
  const fieldId = cliente ? `cliente-${cliente.id}` : "cliente";

  return (
    <form className="flex flex-col gap-6" action={formAction}>
      {cliente ? <Input type="hidden" name="id" value={cliente.id} /> : null}
      <Field data-invalid={Boolean(state.erros?.nome) || undefined}>
        <FieldLabel htmlFor={`${fieldId}-nome`}>Nome do cliente</FieldLabel>
        <Input
          id={`${fieldId}-nome`}
          name="nome"
          type="text"
          autoComplete="organization"
          placeholder="Ex.: Escola Horizonte"
          defaultValue={state.values?.nome ?? cliente?.nome}
          aria-invalid={Boolean(state.erros?.nome)}
          aria-describedby={
            state.erros?.nome ? `${fieldId}-nome-error` : undefined
          }
          required
        />
        <FieldError id={`${fieldId}-nome-error`}>
          {state.erros?.nome}
        </FieldError>
      </Field>

      <Field data-invalid={Boolean(state.erros?.logo) || undefined}>
        <FieldLabel>Logo</FieldLabel>
        <LogoField
          fieldId={fieldId}
          mensagem={state.erros?.logo}
          required={!cliente}
        />
        <FieldError id={`${fieldId}-logo-error`}>
          {state.erros?.logo}
        </FieldError>
      </Field>

      <Field data-invalid={Boolean(state.erros?.status) || undefined}>
        <FieldLabel id={`${fieldId}-status-rotulo`}>Status</FieldLabel>
        <Select
          aria-labelledby={`${fieldId}-status-rotulo`}
          name="status"
          className="w-full"
          defaultSelectedKey={
            state.values?.status || cliente?.status || "draft"
          }
        >
          <SelectTrigger
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
        <FieldError id={`${fieldId}-status-error`}>
          {state.erros?.status}
        </FieldError>
      </Field>

      {state.erro ? <Alert variant="destructive">{state.erro}</Alert> : null}

      <div className="flex justify-end border-t border-border pt-5">
        <Button type="submit" isDisabled={pending}>
          {pending ? <Spinner data-icon="inline-start" /> : null}
          {pending
            ? "Salvando…"
            : cliente
              ? "Salvar alterações"
              : "Cadastrar cliente"}
        </Button>
      </div>
    </form>
  );
}
