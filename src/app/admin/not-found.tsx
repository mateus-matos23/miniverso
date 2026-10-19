import type { Metadata } from "next";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

import { AdminPage, PageHeader } from "./page-header";

export const metadata: Metadata = { title: "Página não encontrada" };

export default function AdminNotFound() {
  return (
    <AdminPage>
      <PageHeader
        description="O endereço pode estar errado ou o item foi removido."
        title="Página não encontrada"
      />
      <div className="mt-8">
        <Link className={buttonVariants({ variant: "outline" })} href="/admin">
          Voltar para a Visão geral
        </Link>
      </div>
    </AdminPage>
  );
}
