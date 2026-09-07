import { FolderKanban, LayoutDashboard, LogOut, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { logout } from "@/app/actions/auth";
import logo from "../../../public/miniverso.png";

type AdminHeaderProps = {
  name: string;
  email: string;
};

export default function AdminHeader({ name, email }: AdminHeaderProps) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="border-b border-white/10 bg-brand-black text-brand-white">
      <div className="mx-auto grid min-h-20 max-w-[1440px] grid-cols-[1fr_auto_1fr] items-center gap-8 px-8 max-[900px]:flex max-[900px]:flex-wrap max-[900px]:gap-x-6 max-[900px]:gap-y-2 max-[560px]:px-5">
        <Link
          className="flex min-h-11 items-center gap-[.7rem] font-bold tracking-[.02em]"
          href="/admin"
        >
          <Image
            className="size-[2.7rem] rounded-[.7rem]"
            src={logo}
            alt="Miniverso"
          />
          <span className="flex flex-col">
            miniverso
            <small className="mt-[.15rem] text-[.62rem] font-medium uppercase tracking-[.08em] text-brand-muted">
              painel de conteúdo
            </small>
          </span>
        </Link>

        <nav
          className="flex items-center justify-center gap-1 max-[900px]:order-3 max-[900px]:w-full max-[900px]:justify-start max-[900px]:overflow-x-auto"
          aria-label="Navegação administrativa"
        >
          <Link
            className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-[.55rem] px-3 text-[.78rem] font-bold text-brand-muted transition-colors hover:bg-white/10 hover:text-brand-white"
            href="/admin"
          >
            <LayoutDashboard size={15} aria-hidden="true" />
            Visão geral
          </Link>
          <Link
            className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-[.55rem] px-3 text-[.78rem] font-bold text-brand-muted transition-colors hover:bg-white/10 hover:text-brand-white"
            href="/admin/conteudos/novo"
          >
            <FolderKanban size={15} aria-hidden="true" />
            Conteúdos
          </Link>
          <Link
            className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-[.55rem] px-3 text-[.78rem] font-bold text-brand-muted transition-colors hover:bg-white/10 hover:text-brand-white"
            href="/admin/clientes"
          >
            <Users size={15} aria-hidden="true" />
            Clientes
          </Link>
        </nav>

        <div className="flex items-center justify-self-end gap-3 max-[900px]:ml-auto">
          <div className="hidden text-right min-[561px]:block">
            <strong className="block text-[.78rem] text-brand-white">
              {name}
            </strong>
            <span className="block max-w-48 truncate text-[.68rem] text-brand-muted">
              {email}
            </span>
          </div>
          <span
            className="grid size-9 place-items-center rounded-full bg-brand-cyan text-[.72rem] font-bold text-brand-violet"
            aria-hidden="true"
          >
            {initials || "AD"}
          </span>
          <form action={logout}>
            <button
              className="inline-flex min-h-11 items-center gap-2 rounded-[.55rem] border-0 bg-transparent px-3 text-[.78rem] font-bold text-brand-muted transition-colors hover:bg-white/10 hover:text-brand-white"
              type="submit"
            >
              <LogOut size={15} aria-hidden="true" />
              <span className="max-[560px]:sr-only">Sair</span>
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
