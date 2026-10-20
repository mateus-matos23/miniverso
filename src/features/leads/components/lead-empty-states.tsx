import { ExternalLinkIcon, InboxIcon, SearchIcon } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button-variants";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

const classeVazio = "border border-dashed border-border bg-card/60";

/** Nenhum lead cadastrado ainda. Aponta para o formulário público. */
export function EstadoSemLeads() {
  return (
    <Empty className={classeVazio}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <InboxIcon />
        </EmptyMedia>
        <EmptyTitle>Nenhum lead ainda</EmptyTitle>
        <EmptyDescription>
          Os contatos enviados pelo formulário da landing aparecem aqui.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Link
          className={buttonVariants({ variant: "outline" })}
          href="/#contato"
          rel="noopener noreferrer"
          target="_blank"
        >
          Ver o formulário na landing
          <ExternalLinkIcon aria-hidden="true" />
          <span className="sr-only">(abre em nova aba)</span>
        </Link>
      </EmptyContent>
    </Empty>
  );
}

/** Há leads, mas nenhum passa pelo status ou pela busca atuais. */
export function EstadoSemResultados() {
  return (
    <Empty className={classeVazio}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <SearchIcon />
        </EmptyMedia>
        <EmptyTitle>Nenhum resultado para o filtro</EmptyTitle>
        <EmptyDescription>
          Nenhum lead corresponde a esta busca ou status.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Link
          className={buttonVariants({ variant: "outline" })}
          href="/admin/leads"
        >
          Limpar filtros
        </Link>
      </EmptyContent>
    </Empty>
  );
}

/** Painel de detalhe sem lead selecionado. */
export function EstadoSemSelecao() {
  return (
    <Empty className={classeVazio}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <InboxIcon />
        </EmptyMedia>
        <EmptyTitle>Selecione um lead</EmptyTitle>
        <EmptyDescription>
          Escolha um contato na lista para ver a mensagem e registrar o
          andamento.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
