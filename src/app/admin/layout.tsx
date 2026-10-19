import type { Metadata } from "next";
import type { ReactNode } from "react";

import { Toaster } from "@/components/ui/sonner";
import { requireAdmin } from "@/lib/auth";

import { AdminSidebar, AdminTopbar } from "./admin-nav";
import { contarLeadsNovos } from "./leads/contagem";

export const metadata: Metadata = {
  title: { default: "Painel", template: "%s | Painel Miniverso" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const { supabase, user } = await requireAdmin();
  // O contador é acessório: se falhar, o painel continua funcionando.
  const leadsNovos = await contarLeadsNovos(supabase).catch((error) => {
    console.error("[admin] falha ao contar leads novos", error);
    return 0;
  });
  const account = {
    name:
      typeof user.name === "string" && user.name.trim()
        ? user.name
        : "Administrador",
    email: user.email ?? "Conta administrativa",
  };

  return (
    <div className="flex min-h-svh bg-admin-canvas text-foreground">
      <a
        className="sr-only z-50 bg-brand-cyan px-4 py-3 font-semibold text-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-3"
        href="#conteudo"
      >
        Pular para o conteúdo
      </a>
      <AdminSidebar leadsNovos={leadsNovos} user={account} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar leadsNovos={leadsNovos} user={account} />
        <main
          className="min-w-0 flex-1 outline-none"
          id="conteudo"
          tabIndex={-1}
        >
          {children}
        </main>
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
}
