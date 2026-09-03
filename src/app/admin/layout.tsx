import type { ReactNode } from "react";

import { requireAdmin } from "@/lib/auth";

import AdminHeader from "./admin-header";

export default async function AdminLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const { user } = await requireAdmin();
  const metadataName = user.user_metadata?.name;
  const name =
    typeof metadataName === "string" && metadataName.trim()
      ? metadataName
      : "Administrador";

  return (
    <div className="min-h-screen bg-[#f6f7fb] text-brand-black">
      <AdminHeader name={name} email={user.email ?? "Conta administrativa"} />
      <main className="min-w-0">{children}</main>
    </div>
  );
}
