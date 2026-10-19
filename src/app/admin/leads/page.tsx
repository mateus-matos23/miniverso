import { DownloadIcon, InboxIcon, SearchIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Button, LinkButton } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { requireAdmin } from "@/lib/auth";
import { cn } from "@/lib/utils";
import type { LeadRow } from "@/utils/supabase/database";

import { AdminPage, PageHeader } from "../page-header";
import { DetalheLead } from "./detalhe-lead";
import {
  filtroBuscaLeads,
  hrefLeads,
  lerFiltrosLeads,
  OPCOES_STATUS_LEAD,
  PORCAO_LEADS,
  statusDoFiltro,
} from "./filtros";
import { ListaLeads } from "./lista-leads";
import { STATUS_LEAD, type StatusLead } from "./rotulos";

export const metadata: Metadata = { title: "Leads" };

export default async function LeadsPage({
  searchParams,
}: PageProps<"/admin/leads">) {
  const filtros = lerFiltrosLeads(await searchParams);
  const { supabase } = await requireAdmin();

  const contagens = await Promise.all(
    STATUS_LEAD.map(async (status) => {
      const { count, error } = await supabase
        .from("leads")
        .select("id", { count: "exact", head: true })
        .eq("status", status);

      if (error) throw error;

      return [status, count ?? 0] as const;
    }),
  );
  const porStatus = Object.fromEntries(contagens) as Record<StatusLead, number>;
  const totalGeral = contagens.reduce(
    (soma, [, quantidade]) => soma + quantidade,
    0,
  );
  const totalAtivos =
    porStatus.novo + porStatus.em_contato + porStatus.convertido;

  let consulta = supabase
    .from("leads")
    .select("id,nome,escola,interesse,status,criado_em", { count: "exact" })
    .in("status", statusDoFiltro(filtros.status));

  if (filtros.q) consulta = consulta.or(filtroBuscaLeads(filtros.q));

  const inicio = (filtros.pagina - 1) * PORCAO_LEADS;
  const {
    data: leads,
    count,
    error,
  } = await consulta
    .order("criado_em", { ascending: false })
    .order("id", { ascending: false })
    .range(inicio, inicio + PORCAO_LEADS - 1);

  if (error) throw error;

  const total = count ?? 0;
  const totalPaginas = Math.max(1, Math.ceil(total / PORCAO_LEADS));

  // Página além do fim (ex.: lead excluído na última página): volta para a última.
  if (filtros.pagina > totalPaginas) {
    redirect(hrefLeads({ ...filtros, pagina: totalPaginas }));
  }

  let selecionado: LeadRow | null = null;

  if (filtros.selecionado) {
    const { data, error: erroSelecionado } = await supabase
      .from("leads")
      .select("*")
      .eq("id", filtros.selecionado)
      .maybeSingle();

    if (erroSelecionado) throw erroSelecionado;
    selecionado = data;
  }

  const hrefLista = hrefLeads({ ...filtros, selecionado: undefined });
  const hrefExportacao = hrefLeads(
    { status: filtros.status, q: filtros.q },
    "/admin/leads/exportar",
  );

  return (
    <AdminPage ampla>
      <PageHeader
        actions={
          <LinkButton href={hrefExportacao} variant="outline">
            <DownloadIcon data-icon="inline-start" />
            Exportar CSV
          </LinkButton>
        }
        description="Contatos enviados pelo formulário da landing. Abra um lead para ver a mensagem, registrar o andamento e responder."
        title="Leads"
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:items-start">
        <section
          aria-label="Lista de leads"
          className={cn(
            "flex min-w-0 flex-col gap-4",
            filtros.selecionado && "hidden lg:flex",
          )}
        >
          <nav aria-label="Filtrar por status" className="flex flex-wrap gap-2">
            {OPCOES_STATUS_LEAD.map((opcao) => {
              const quantidade =
                opcao.valor === "todos" ? totalAtivos : porStatus[opcao.valor];
              const ativo = filtros.status === opcao.valor;

              return (
                <Link
                  aria-current={ativo ? "page" : undefined}
                  className={buttonVariants({
                    size: "sm",
                    variant: ativo ? "secondary" : "ghost",
                  })}
                  href={hrefLeads({ status: opcao.valor, q: filtros.q })}
                  key={opcao.valor}
                >
                  {opcao.rotulo}
                  <span className="tabular-nums text-muted-foreground">
                    {quantidade}
                  </span>
                </Link>
              );
            })}
          </nav>

          <search>
            <form action="/admin/leads" className="flex gap-2">
              {filtros.status !== "todos" ? (
                <input name="status" type="hidden" value={filtros.status} />
              ) : null}
              <Input
                aria-label="Buscar por nome, e-mail ou escola"
                defaultValue={filtros.q}
                name="q"
                placeholder="Nome, e-mail ou escola"
                type="search"
              />
              <Button type="submit" variant="outline">
                <SearchIcon data-icon="inline-start" />
                Buscar
              </Button>
            </form>
          </search>

          {leads && leads.length > 0 ? (
            <>
              <ListaLeads
                filtros={filtros}
                leads={leads}
                selecionado={filtros.selecionado}
              />

              {totalPaginas > 1 ? (
                <Pagination className="justify-between">
                  <PaginationContent>
                    {filtros.pagina > 1 ? (
                      <PaginationItem>
                        <PaginationPrevious
                          aria-label="Página anterior"
                          href={hrefLeads({
                            ...filtros,
                            pagina: filtros.pagina - 1,
                          })}
                          text="Anterior"
                        />
                      </PaginationItem>
                    ) : null}
                  </PaginationContent>
                  <p className="text-sm text-muted-foreground tabular-nums">
                    Página {filtros.pagina} de {totalPaginas}
                  </p>
                  <PaginationContent>
                    {filtros.pagina < totalPaginas ? (
                      <PaginationItem>
                        <PaginationNext
                          aria-label="Próxima página"
                          href={hrefLeads({
                            ...filtros,
                            pagina: filtros.pagina + 1,
                          })}
                          text="Próxima"
                        />
                      </PaginationItem>
                    ) : null}
                  </PaginationContent>
                </Pagination>
              ) : null}
            </>
          ) : totalGeral === 0 ? (
            <Empty className="border border-border bg-card">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <InboxIcon />
                </EmptyMedia>
                <EmptyTitle>Nenhum lead ainda</EmptyTitle>
                <EmptyDescription>
                  Os contatos enviados pelo formulário da landing aparecem aqui.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <Empty className="border border-border bg-card">
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
          )}
        </section>

        <section
          aria-label="Detalhe do lead"
          className={cn("min-w-0", !filtros.selecionado && "hidden lg:block")}
        >
          {selecionado ? (
            <DetalheLead
              key={selecionado.id}
              lead={selecionado}
              voltarHref={hrefLista}
            />
          ) : (
            <Empty className="border border-border bg-card">
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
          )}
        </section>
      </div>
    </AdminPage>
  );
}
