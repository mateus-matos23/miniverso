import type { Metadata } from "next";
import type { ReactNode } from "react";

import { requireAdmin } from "@/lib/auth";

import { AdminSidebar, AdminTopbar } from "./admin-nav";

export const metadata: Metadata = {
  title: { default: "Painel", template: "%s | Painel Miniverso" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const { user } = await requireAdmin();
  const account = {
    name:
      typeof user.name === "string" && user.name.trim()
        ? user.name
        : "Administrador",
    email: user.email ?? "Conta administrativa",
  };

  return (
    <div className="flex min-h-svh bg-[#f5f7fb] text-brand-black">
      <a
        className="sr-only z-50 bg-brand-cyan px-4 py-3 font-semibold text-brand-black focus:not-sr-only focus:fixed focus:left-4 focus:top-3"
        href="#conteudo"
      >
        Pular para o conteúdo
      </a>
      <AdminSidebar user={account} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar user={account} />
        <main
          className="min-w-0 flex-1 outline-none"
          id="conteudo"
          tabIndex={-1}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
