"use client";

import { useActionState, useState } from "react";
import { Painel } from "@/components/admin/panel";
import { Alert } from "@/components/ui/alert";
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
import { atualizarCliente, criarCliente } from "@/features/clients/actions";
import type { CadastroClienteState, Cliente } from "@/features/clients/schema";
import { SeletorMidia } from "@/features/media/components/media-picker";
import type { MidiaRef } from "@/features/media/schema";

const estadoInicial: CadastroClienteState = {};

export default function FormularioCliente({ cliente }: { cliente?: Cliente }) {
  const acao = cliente ? atualizarCliente : criarCliente;
  const [estado, acaoFormulario, pendente] = useActionState(
    acao,
    estadoInicial,
  );
  const campoId = cliente ? `cliente-${cliente.id}` : "cliente";
  const [logo, setLogo] = useState<MidiaRef | null>(cliente?.logo ?? null);

  return (
    <form className="flex flex-col gap-5" action={acaoFormulario}>
      {cliente ? <Input type="hidden" name="id" value={cliente.id} /> : null}
      <Painel conteudoClassName="flex flex-col gap-5" titulo="Informações">
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

        <SeletorMidia
          erro={estado.erros?.logo}
          id={`${campoId}-logo`}
          onChange={setLogo}
          rotulo="Logo"
          tipo="imagem"
          valor={logo}
        />
        {/* Leva a logo escolhida na biblioteca para o servidor. */}
        <input name="logoId" type="hidden" value={logo?.id ?? ""} />
      </Painel>

      <Painel conteudoClassName="flex flex-col gap-5" titulo="Publicação">
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
      </Painel>

      {estado.erro ? <Alert variant="destructive">{estado.erro}</Alert> : null}

      <div className="flex justify-end">
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
