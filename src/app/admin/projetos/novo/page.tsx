import { ArrowLeftIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { requireAdmin } from "@/lib/auth";
import { AdminPage, PageHeader } from "../../page-header";
import ContentEditor from "../content-editor";

export const metadata: Metadata = { title: "Novo projeto" };

export default async function NovoProjetoPage() {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from("clientes")
    .select("id,nome")
    .order("nome", { ascending: true });

  if (error) throw error;

  return (
    <AdminPage>
      <PageHeader
        description="Monte o projeto e confira, ao lado, como ele aparece na landing antes de publicar."
        eyebrow={
          <Link
            className="mb-4 inline-flex h-10 items-center gap-2 text-sm font-semibold text-brand-blue"
            href="/admin/projetos"
          >
            <ArrowLeftIcon aria-hidden="true" className="size-4" />
            Projetos
          </Link>
        }
        title="Novo projeto"
      />
      <ContentEditor clientes={data ?? []} />
    </AdminPage>
  );
}
