import { SearchXIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button-variants";
import {
  Empty,
  EmptyContent,
  EmptyHeader,
  EmptyMedia,
} from "@/components/ui/empty";

import { AdminPage, PageHeader } from "./page-header";

export const metadata: Metadata = { title: "Página não encontrada" };

export default function AdminNotFound() {
  return (
    <AdminPage>
      <PageHeader
        description="O endereço pode estar errado ou o item foi removido."
        title="Página não encontrada"
      />
      <Empty className="mt-6 border border-dashed border-border bg-card/60">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <SearchXIcon aria-hidden="true" />
          </EmptyMedia>
        </EmptyHeader>
        <EmptyContent>
          <Link
            className={buttonVariants({ variant: "outline" })}
            href="/admin"
          >
            Voltar para a Visão geral
          </Link>
        </EmptyContent>
      </Empty>
    </AdminPage>
  );
}
