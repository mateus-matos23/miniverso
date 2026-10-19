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
import {
  atualizarStatusLead,
  excluirLead,
  salvarNotasLead,
} from "@/app/admin/leads/actions";
import { Button, LinkButton } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
    <article className="flex flex-col gap-8 rounded-lg border border-border bg-card p-6 sm:p-8">
      <LinkButton
        className="w-fit lg:hidden"
        href={voltarHref}
        size="sm"
        variant="ghost"
      >
        <ArrowLeftIcon data-icon="inline-start" />
        Voltar para a lista
      </LinkButton>

      <header className="flex flex-col gap-3 border-b border-border pb-6">
        <div className="flex flex-wrap items-center gap-3">
          <StatusLeadBadge status={lead.status} />
          <span className="text-sm text-muted-foreground">
            {rotulosInteresseLead[lead.interesse] ?? lead.interesse}
          </span>
        </div>
        <h2 className="font-display text-2xl font-bold break-words text-brand-violet">
          {lead.nome}
        </h2>
        <div className="flex flex-wrap gap-2">
          <LinkButton
            href={`mailto:${lead.email}?subject=${encodeURIComponent("Contato Miniverso")}`}
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

      <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
        <Campo className="break-all" rotulo="E-mail">
          {lead.email}
        </Campo>
        <Campo rotulo="Escola">{lead.escola}</Campo>
        <Campo rotulo="Cargo">{lead.cargo}</Campo>
        <Campo rotulo="Interesse">
          {rotulosInteresseLead[lead.interesse] ?? lead.interesse}
        </Campo>
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
        <div className="flex flex-col gap-2">
          <dt className="text-sm font-medium text-muted-foreground">Status</dt>
          <dd>
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
          </dd>
        </div>
      </dl>

      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-brand-violet">Mensagem</h3>
        <p className="rounded-md bg-muted/50 p-4 leading-relaxed whitespace-pre-line break-words text-brand-ink">
          {lead.mensagem}
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-brand-violet">Origem</h3>
        <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
          {origem.map(([rotulo, valor]) => (
            <Campo key={rotulo} rotulo={rotulo}>
              {valor}
            </Campo>
          ))}
        </dl>
      </section>

      <section className="flex flex-col gap-3">
        <label
          className="text-sm font-semibold text-brand-violet"
          htmlFor={`notas-${lead.id}`}
        >
          Notas internas
        </label>
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
      </section>

      <div className="flex justify-end border-t border-border pt-6">
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
      <dd className="text-brand-ink">{children || "—"}</dd>
    </div>
  );
}
