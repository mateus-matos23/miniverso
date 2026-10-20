import { ArrowLeftIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import { AdminPage, PageHeader } from "@/components/admin/page-header";
import { requireAdmin } from "@/features/auth/require-admin";
import { listarClientesOpcoes } from "@/features/clients/data";
import { paraMidiaRef } from "@/features/media/urls";
import EditorProjeto from "@/features/projects/components/project-editor";
import { buscarConteudoParaEdicao } from "@/features/projects/data";

export const metadata: Metadata = { title: "Editar projeto" };

export default async function EditarProjetoPage({
  params,
}: PageProps<"/admin/projetos/[id]">) {
  const { id } = await params;

  if (!z.uuid().safeParse(id).success) notFound();

  const { supabase } = await requireAdmin();
  const [conteudoResult, clientesResult] = await Promise.all([
    buscarConteudoParaEdicao(supabase, id),
    listarClientesOpcoes(supabase),
  ]);

  if (conteudoResult.error) throw conteudoResult.error;
  if (clientesResult.error) throw clientesResult.error;

  const conteudo = conteudoResult.data;

  if (!conteudo) notFound();

  return (
    <AdminPage>
      <PageHeader
        description="Altere os dados ou troque a mídia. Se o projeto estiver publicado, a landing mostra as mudanças."
        eyebrow={
          <Link
            className="mb-4 inline-flex h-10 items-center gap-2 text-sm font-semibold text-primary"
            href="/admin/projetos"
          >
            <ArrowLeftIcon
              aria-hidden="true"
              className="size-4"
              data-icon="inline-start"
            />
            Projetos
          </Link>
        }
        title="Editar projeto"
      />
      <EditorProjeto
        clientes={clientesResult.data ?? []}
        conteudo={{
          id: conteudo.id,
          titulo: conteudo.titulo,
          slug: conteudo.slug,
          categoria: conteudo.categoria,
          descricao: conteudo.descricao,
          status: conteudo.status,
          ordem: conteudo.ordem,
          clienteId: conteudo.cliente_id,
          midia: conteudo.midia ? paraMidiaRef(conteudo.midia) : null,
        }}
      />
    </AdminPage>
  );
}
