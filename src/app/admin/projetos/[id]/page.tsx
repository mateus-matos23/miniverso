import { ArrowLeftIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth";
import { AdminPage, PageHeader } from "../../page-header";
import EditorProjeto from "../editor-projeto";

export const metadata: Metadata = { title: "Editar projeto" };

export default async function EditarProjetoPage({
  params,
}: PageProps<"/admin/projetos/[id]">) {
  const { id } = await params;

  if (!z.uuid().safeParse(id).success) notFound();

  const { supabase } = await requireAdmin();
  const [conteudoResult, clientesResult] = await Promise.all([
    supabase
      .from("conteudos")
      .select(
        "id,titulo,slug,categoria,descricao,status,ordem,tipo_midia,caminho_midia,cliente_id",
      )
      .eq("id", id)
      .maybeSingle(),
    supabase.from("clientes").select("id,nome").order("nome", {
      ascending: true,
    }),
  ]);

  if (conteudoResult.error) throw conteudoResult.error;
  if (clientesResult.error) throw clientesResult.error;

  const conteudo = conteudoResult.data;

  if (!conteudo) notFound();

  const { data: midia, error: midiaError } = await supabase.storage
    .from("miniverso")
    .createSignedUrl(conteudo.caminho_midia, 3600);

  if (midiaError) throw midiaError;

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
          tipoMidia: conteudo.tipo_midia === "video" ? "video" : "imagem",
          midiaUrl: midia.signedUrl,
        }}
      />
    </AdminPage>
  );
}
