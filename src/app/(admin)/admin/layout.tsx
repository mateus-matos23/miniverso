import type { Metadata } from "next";
import { cookies } from "next/headers";
import type { ReactNode } from "react";
import { AdminSidebar, AdminTopbar } from "@/components/admin/admin-nav";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { logout } from "@/features/auth/actions";
import { requireAdmin } from "@/features/auth/require-admin";
import { contarLeadsNovos } from "@/features/leads/data";
import { Providers } from "../../providers";

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
  // O estado da sidebar é gravado pelo cliente em um cookie; lemos aqui para evitar salto no carregamento.
  const cookieStore = await cookies();
  const sidebarState = cookieStore.get("sidebar_state")?.value;

  return (
    <Providers>
      <SidebarProvider
        className="bg-sidebar text-foreground"
        data-admin
        defaultOpen={sidebarState !== "false"}
      >
        <a
          className="sr-only z-50 bg-brand-cyan px-4 py-3 font-semibold text-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-3"
          href="#conteudo"
        >
          Pular para o conteúdo
        </a>
        <AdminSidebar
          leadsNovos={leadsNovos}
          onLogout={logout}
          user={account}
        />
        <SidebarInset
          className="min-w-0 bg-admin-canvas outline-none md:peer-data-[variant=inset]:rounded-xl"
          id="conteudo"
          tabIndex={-1}
        >
          <AdminTopbar />
          {children}
        </SidebarInset>
        <Toaster position="bottom-right" />
      </SidebarProvider>
    </Providers>
  );
}
