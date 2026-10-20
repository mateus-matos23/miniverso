import { ArrowLeftIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { AdminPage, PageHeader } from "@/components/admin/page-header";
import { requireAdmin } from "@/features/auth/require-admin";
import { listarClientesOpcoes } from "@/features/clients/data";
import EditorProjeto from "@/features/projects/components/project-editor";

export const metadata: Metadata = { title: "Cadastrar projeto" };

export default async function NovoProjetoPage() {
  const { supabase } = await requireAdmin();
  const { data, error } = await listarClientesOpcoes(supabase);

  if (error) throw error;

  return (
    <AdminPage>
      <PageHeader
        description="Monte o projeto e confira, ao lado, como ele aparece na landing antes de publicar."
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
        title="Cadastrar projeto"
      />
      <EditorProjeto clientes={data ?? []} />
    </AdminPage>
  );
}
