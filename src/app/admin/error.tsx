"use client";

import { TriangleAlertIcon } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

import { Button, buttonVariants } from "@/components/ui/button";

import { AdminPage, PageHeader } from "./page-header";

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

      <div
        className="mt-8 flex flex-col items-start gap-5 rounded-lg border border-destructive/30 bg-destructive/5 p-6 sm:p-8"
        role="alert"
      >
        <TriangleAlertIcon
          aria-hidden="true"
          className="size-8 text-destructive"
        />
        <p className="max-w-[40rem] text-brand-ink">
          Tente de novo. Se o problema continuar, volte à Visão geral e tente
          mais tarde.
        </p>
        {codigo ? (
          <p className="text-xs text-muted-foreground">
            Código do erro: <span className="font-mono">{codigo}</span>
          </p>
        ) : null}
        <div className="flex flex-wrap gap-2">
          <Button onPress={() => retry()}>Tentar novamente</Button>
          <Link
            className={buttonVariants({ variant: "outline" })}
            href="/admin"
          >
            Ir para a Visão geral
          </Link>
        </div>
      </div>
    </AdminPage>
  );
}
