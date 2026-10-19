import { ArrowLeftIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { AdminPage, PageHeader } from "../../page-header";
import ContentEditor from "./content-editor";

export const metadata: Metadata = { title: "Novo conteúdo" };

export default function NewContentPage() {
  return (
    <AdminPage>
      <PageHeader
        description="Monte o conteúdo e confira, ao lado, como ele aparece na landing antes de publicar."
        eyebrow={
          <Link
            className="mb-4 inline-flex h-10 items-center gap-2 text-sm font-semibold text-brand-blue"
            href="/admin"
          >
            <ArrowLeftIcon aria-hidden="true" className="size-4" />
            Visão geral
          </Link>
        }
        title="Novo conteúdo"
      />
      <ContentEditor />
    </AdminPage>
  );
}
