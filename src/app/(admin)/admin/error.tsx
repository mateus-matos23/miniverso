"use client";

import { TriangleAlertIcon } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { AdminPage, PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
} from "@/components/ui/empty";

export default function AdminError({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  useEffect(() => {
    console.error("[admin] falha ao renderizar a tela", error);
  }, [error]);

  // O digest liga o erro ao log do servidor; em produção a mensagem original não chega ao cliente.
  const codigo =
    error instanceof Error &&
    "digest" in error &&
    typeof error.digest === "string"
      ? error.digest
      : undefined;

  return (
    <AdminPage>
      <PageHeader
        description="Algo deu errado ao carregar esta tela. Seus dados não foram alterados."
        title="Não foi possível carregar"
      />

      <Empty
        className="mt-6 border border-dashed border-border bg-card/60"
        role="alert"
      >
        <EmptyHeader>
          <EmptyMedia
            variant="icon"
            className="bg-destructive/10 text-destructive"
          >
            <TriangleAlertIcon aria-hidden="true" />
          </EmptyMedia>
          <EmptyDescription>
            Tente de novo. Se o problema continuar, volte à Visão geral e tente
            mais tarde.
          </EmptyDescription>
          {codigo ? (
            <p className="text-xs text-muted-foreground">
              Código do erro: <span className="font-mono">{codigo}</span>
            </p>
          ) : null}
        </EmptyHeader>
        <EmptyContent className="flex-row flex-wrap justify-center gap-2">
          <Button onPress={() => retry()}>Tentar novamente</Button>
          <Link
            className={buttonVariants({ variant: "outline" })}
            href="/admin"
          >
            Ir para a Visão geral
          </Link>
        </EmptyContent>
      </Empty>
    </AdminPage>
  );
}
