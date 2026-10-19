import { FolderKanbanIcon, UsersIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { requireAdmin } from "@/lib/auth";
import { AdminPage, PageHeader } from "./page-header";

export const metadata: Metadata = { title: "Visão geral" };

export default async function AdminOverviewPage() {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.from("clientes").select("status");

  const clientes = data ?? [];
  const published = clientes.filter((c) => c.status === "published").length;
  const stats = [
    { label: "Clientes cadastrados", value: clientes.length },
    { label: "Visíveis na landing", value: published },
    { label: "Em rascunho", value: clientes.length - published },
  ];

  return (
    <AdminPage>
      <PageHeader
        description="Acompanhe o que está publicado na landing page e o que ainda está em rascunho."
        title="Visão geral"
      />

      <section aria-labelledby="clientes-resumo" className="mt-10">
        <div className="flex items-center justify-between gap-4">
          <h2
            className="text-lg font-semibold text-brand-violet"
            id="clientes-resumo"
          >
            Clientes
          </h2>
          <Link
            className="inline-flex h-10 items-center rounded-md px-3 text-sm font-semibold text-brand-blue hover:bg-accent"
            href="/admin/clientes"
          >
            Gerenciar clientes
          </Link>
        </div>
        {error ? (
          <p
            className="mt-4 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
            role="alert"
          >
            Não foi possível carregar os números de clientes. Recarregue a
            página.
          </p>
        ) : (
          <dl className="mt-4 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-3">
            {stats.map((stat) => (
              <div className="bg-card p-6" key={stat.label}>
                <dt className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </dt>
                <dd className="mt-2 font-display text-5xl font-bold leading-none text-brand-violet tabular-nums">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        )}
        {!error && clientes.length === 0 ? (
          <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <UsersIcon aria-hidden="true" className="size-4" />
            Nenhum cliente ainda. A seção “Clientes” da landing mostra um aviso
            até o primeiro ser publicado.
          </p>
        ) : null}
      </section>

      <section aria-labelledby="conteudos-resumo" className="mt-12">
        <h2
          className="text-lg font-semibold text-brand-violet"
          id="conteudos-resumo"
        >
          Conteúdos
        </h2>
        <Empty className="mt-4 border border-border bg-card">
          <EmptyHeader>
            <EmptyMedia className="bg-accent text-brand-blue" variant="icon">
              <FolderKanbanIcon />
            </EmptyMedia>
            <EmptyTitle className="text-lg font-semibold text-brand-violet">
              Nenhum conteúdo publicado
            </EmptyTitle>
            <EmptyDescription>
              O salvamento de conteúdos ainda está em desenvolvimento. Já é
              possível montar e pré-visualizar um conteúdo no editor.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Link
              className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-brand-violet"
              href="/admin/conteudos/novo"
            >
              Abrir editor
            </Link>
          </EmptyContent>
        </Empty>
      </section>
    </AdminPage>
  );
}
