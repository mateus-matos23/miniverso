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

const estadoInicial: CadastroClienteState = {};
const TIPOS_LOGO = ["image/jpeg", "image/png", "image/webp"];

function CampoLogo({
  campoId,
  mensagem,
  obrigatorio,
}: {
  campoId: string;
  mensagem?: string;
  obrigatorio: boolean;
}) {
  const refInput = useRef<HTMLInputElement>(null);
  const [nomeLogo, setNomeLogo] = useState<string>();
  const temErro = Boolean(mensagem);

  function escolherLogo(files: FileList | null) {
    sincronizarArquivoFormulario(refInput.current, files);
    setNomeLogo(files?.[0]?.name);
  }

  return (
    <>
      <Attachment
        className="w-full"
        state={temErro ? "error" : nomeLogo ? "done" : "idle"}
        aria-invalid={temErro || undefined}
        aria-describedby={temErro ? `${campoId}-logo-erro` : undefined}
      >
        <AttachmentMedia>
          <ImagePlus aria-hidden="true" />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>
            {nomeLogo ??
              (obrigatorio ? "Selecione a logo" : "Selecione uma nova logo")}
          </AttachmentTitle>
          <AttachmentDescription>
            PNG, JPG ou WebP, até 5 MB. Prefira fundo transparente.
          </AttachmentDescription>
        </AttachmentContent>
        <FileTrigger acceptedFileTypes={TIPOS_LOGO} onSelect={escolherLogo}>
          <Button
            aria-label={nomeLogo ? "Trocar logo" : "Selecionar logo"}
            variant="ghost"
            className="absolute inset-0 z-10 h-full w-full rounded-none p-0 outline-none hover:bg-transparent"
          />
        </FileTrigger>
      </Attachment>
      {/* Recebe o arquivo do FileTrigger para o FormData; a validação real é no servidor. */}
      <input
        ref={refInput}
        hidden
        name="logo"
        type="file"
        accept={TIPOS_LOGO.join(",")}
      />
    </>
  );
}

export default function FormularioCliente({ cliente }: { cliente?: Cliente }) {
  const acao = cliente ? atualizarCliente : criarCliente;
  const [estado, acaoFormulario, pendente] = useActionState(
    acao,
    estadoInicial,
  );
  const campoId = cliente ? `cliente-${cliente.id}` : "cliente";

  return (
    <form className="flex flex-col gap-6" action={acaoFormulario}>
      {cliente ? <Input type="hidden" name="id" value={cliente.id} /> : null}
      <Field data-invalid={Boolean(estado.erros?.nome) || undefined}>
        <FieldLabel htmlFor={`${campoId}-nome`}>Nome do cliente</FieldLabel>
        <Input
          id={`${campoId}-nome`}
          name="nome"
          type="text"
          autoComplete="organization"
          placeholder="Ex.: Escola Horizonte"
          defaultValue={estado.values?.nome ?? cliente?.nome}
          aria-invalid={Boolean(estado.erros?.nome)}
          aria-describedby={
            estado.erros?.nome ? `${campoId}-nome-erro` : undefined
          }
          required
        />
        <FieldError id={`${campoId}-nome-erro`}>
          {estado.erros?.nome}
        </FieldError>
      </Field>

      <Field data-invalid={Boolean(estado.erros?.logo) || undefined}>
        <FieldLabel>Logo</FieldLabel>
        <CampoLogo
          campoId={campoId}
          mensagem={estado.erros?.logo}
          obrigatorio={!cliente}
        />
        <FieldError id={`${campoId}-logo-erro`}>
          {estado.erros?.logo}
        </FieldError>
      </Field>

      <Field data-invalid={Boolean(estado.erros?.status) || undefined}>
        <FieldLabel id={`${campoId}-status-rotulo`}>Status</FieldLabel>
        <Select
          aria-labelledby={`${campoId}-status-rotulo`}
          name="status"
          className="w-full"
          defaultSelectedKey={
            estado.values?.status || cliente?.status || "draft"
          }
        >
          <SelectTrigger
            id={`${campoId}-status`}
            type="button"
            aria-invalid={Boolean(estado.erros?.status)}
            aria-describedby={
              estado.erros?.status ? `${campoId}-status-erro` : undefined
            }
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem id="draft">Rascunho</SelectItem>
            <SelectItem id="published">Publicado</SelectItem>
          </SelectContent>
        </Select>
        <FieldError id={`${campoId}-status-erro`}>
          {estado.erros?.status}
        </FieldError>
      </Field>

      {estado.erro ? <Alert variant="destructive">{estado.erro}</Alert> : null}

      <div className="flex justify-end border-t border-border pt-5">
        <Button type="submit" isDisabled={pendente}>
          {pendente ? <Spinner data-icon="inline-start" /> : null}
          {cliente
            ? pendente
              ? "Salvando…"
              : "Salvar alterações"
            : pendente
              ? "Cadastrando…"
              : "Cadastrar cliente"}
        </Button>
      </div>
    </form>
  );
}
