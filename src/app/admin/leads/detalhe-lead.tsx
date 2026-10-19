"use client";

import {
  ArrowLeftIcon,
  CheckCheckIcon,
  CopyIcon,
  MailIcon,
  Trash2Icon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { type ReactNode, useState, useTransition } from "react";
import { toast } from "sonner";
import { superficie } from "@/app/admin/_componentes/painel";
import {
  atualizarStatusLead,
  excluirLead,
  salvarNotasLead,
} from "@/app/admin/leads/actions";
import { Button, LinkButton } from "@/components/ui/button";
import { FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { formatarDataHora } from "@/lib/formatar";
import { cn } from "@/lib/utils";
import type { LeadRow } from "@/utils/supabase/database";

import { ConfirmarExclusaoDialog } from "../_componentes/confirmar-exclusao-dialog";

import {
  rotulosInteresseLead,
  rotulosStatusLead,
  STATUS_LEAD,
  type StatusLead,
} from "./rotulos";
import { StatusLeadBadge } from "./status-lead-badge";

const limiteNotas = 4000;

const rotuloSecao =
  "text-xs font-medium uppercase tracking-wide text-muted-foreground";

export function DetalheLead({
  lead,
  voltarHref,
}: {
  lead: LeadRow;
  /** Lista com os mesmos filtros, sem o lead selecionado. */
  voltarHref: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [notas, setNotas] = useState(lead.notas);
  const [excluirAberto, setExcluirAberto] = useState(false);
  const notasAlteradas = notas !== lead.notas;
  const origem = [
    ["Origem (utm_source)", lead.utm_source],
    ["Mídia (utm_medium)", lead.utm_medium],
    ["Campanha (utm_campaign)", lead.utm_campaign],
    ["Página", lead.pagina],
  ] as const;

  function mudarStatus(status: string) {
    startTransition(async () => {
      const resultado = await atualizarStatusLead(lead.id, status);

      if (resultado.erro) {
        toast.error(resultado.erro);
        return;
      }

      toast.success(
        `Status alterado para “${rotulosStatusLead[status as StatusLead]}”.`,
      );
    });
  }

  function salvarNotas() {
    startTransition(async () => {
      const resultado = await salvarNotasLead(lead.id, notas);

      if (resultado.erro) {
        toast.error(resultado.erro);
        return;
      }

      toast.success("Notas salvas.");
    });
  }

  function excluir() {
    startTransition(async () => {
      const resultado = await excluirLead(lead.id);

      if (resultado.erro) {
        toast.error(resultado.erro);
        return;
      }

      setExcluirAberto(false);
      toast.success("Lead excluído.");
      router.push(voltarHref);
    });
  }

  function copiarEmail() {
    navigator.clipboard
      .writeText(lead.email)
      .then(() => toast.success("E-mail copiado."))
      .catch(() => toast.error("Não foi possível copiar o e-mail."));
  }

  return (
    <article className={cn(superficie, "flex flex-col gap-6 p-5 sm:p-6")}>
      <LinkButton
        className="w-fit lg:hidden"
        href={voltarHref}
        size="sm"
        variant="ghost"
      >
        <ArrowLeftIcon data-icon="inline-start" />
        Voltar para a lista
      </LinkButton>

      <header className="flex flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-xl font-semibold break-words text-heading">
              {lead.nome}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {lead.escola ?? "Escola não informada"}
              <span aria-hidden="true"> · </span>
              {rotulosInteresseLead[lead.interesse] ?? lead.interesse}
            </p>
          </div>
          <StatusLeadBadge status={lead.status} />
        </div>
        <div className="flex flex-wrap gap-2">
          <LinkButton
            href={`mailto:${encodeURIComponent(lead.email)}?subject=${encodeURIComponent("Contato Miniverso")}`}
            size="sm"
          >
            <MailIcon data-icon="inline-start" />
            Responder por e-mail
          </LinkButton>
          <Button onPress={copiarEmail} size="sm" variant="outline">
            <CopyIcon data-icon="inline-start" />
            Copiar e-mail
          </Button>
          {lead.status === "novo" ? (
            <Button
              isDisabled={isPending}
              onPress={() => mudarStatus("em_contato")}
              size="sm"
              variant="outline"
            >
              <CheckCheckIcon data-icon="inline-start" />
              Marcar como em contato
            </Button>
          ) : null}
        </div>
      </header>

      <Separator />

      <section className="flex flex-col gap-4">
        <h3 className={rotuloSecao}>Contato</h3>
        <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
          <Campo className="break-all" rotulo="E-mail">
            {lead.email}
          </Campo>
          <Campo rotulo="Escola">{lead.escola}</Campo>
          <Campo rotulo="Cargo">{lead.cargo}</Campo>
        </dl>
        <dl className="grid gap-x-8 gap-y-4 border-t border-border/80 pt-4 sm:grid-cols-2">
          {origem.map(([rotulo, valor]) => (
            <Campo key={rotulo} rotulo={rotulo}>
              {valor}
            </Campo>
          ))}
        </dl>
      </section>

      <Separator />

      <section className="flex flex-col gap-3">
        <h3 className={rotuloSecao}>Mensagem</h3>
        <p className="rounded-lg bg-muted/60 p-4 leading-relaxed break-words whitespace-pre-wrap text-body">
          {lead.mensagem}
        </p>
      </section>

      <Separator />

      <section className="flex flex-col gap-5">
        <h3 className={rotuloSecao}>Andamento</h3>
        <Select
          aria-label="Status do lead"
          className="w-full sm:w-56"
          isDisabled={isPending}
          onSelectionChange={(chave) => {
            if (chave && chave !== lead.status) mudarStatus(String(chave));
          }}
          selectedKey={lead.status}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_LEAD.map((status) => (
              <SelectItem id={status} key={status}>
                {rotulosStatusLead[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
          <Campo rotulo="Recebido em">
            <time dateTime={lead.criado_em}>
              {formatarDataHora(lead.criado_em)}
            </time>
          </Campo>
          <Campo rotulo="Atualizado em">
            <time dateTime={lead.atualizado_em}>
              {formatarDataHora(lead.atualizado_em)}
            </time>
          </Campo>
        </dl>

        <div className="flex flex-col gap-3">
          <FieldLabel
            className="font-semibold text-heading"
            htmlFor={`notas-${lead.id}`}
          >
            Notas internas
          </FieldLabel>
          <Textarea
            id={`notas-${lead.id}`}
            maxLength={limiteNotas}
            onChange={(event) => setNotas(event.target.value)}
            placeholder="Anote contatos feitos, retornos e combinados. Só o painel vê este texto."
            value={notas}
          />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-sm text-muted-foreground tabular-nums">
              {notas.length}/{limiteNotas}
            </span>
            <Button
              isDisabled={isPending || !notasAlteradas}
              onPress={salvarNotas}
              size="sm"
            >
              {isPending && notasAlteradas ? (
                <Spinner data-icon="inline-start" />
              ) : null}
              Salvar notas
            </Button>
          </div>
        </div>
      </section>

      <Separator />

      <div className="flex justify-end">
        <Button
          isDisabled={isPending}
          onPress={() => setExcluirAberto(true)}
          size="sm"
          variant="destructive-solid"
        >
          <Trash2Icon data-icon="inline-start" />
          Excluir lead
        </Button>
      </div>

      <ConfirmarExclusaoDialog
        acao={excluir}
        aberto={excluirAberto}
        descricao="O contato, a mensagem e as notas serão apagados. Essa ação não pode ser desfeita."
        onAbertoChange={setExcluirAberto}
        pendente={isPending}
        titulo={`Excluir o lead de “${lead.nome}”?`}
      />
    </article>
  );
}

function Campo({
  rotulo,
  children,
  className,
}: {
  rotulo: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <dt className="text-sm font-medium text-muted-foreground">{rotulo}</dt>
      <dd className="text-body">{children || "—"}</dd>
    </div>
  );
}
