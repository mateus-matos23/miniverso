"use client";

import {
  ExternalLinkIcon,
  FolderKanbanIcon,
  ImagesIcon,
  InboxIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  MenuIcon,
  PanelsTopLeftIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { logout } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import logoWhite from "../../../public/brand/logo-horizontal-white.webp";

const items = [
  {
    href: "/admin",
    label: "Visão geral",
    icon: LayoutDashboardIcon,
    exact: true,
  },
  {
    href: "/admin/pagina",
    label: "Página inicial",
    icon: PanelsTopLeftIcon,
    match: "/admin/pagina",
  },
  { href: "/admin/leads", label: "Leads", icon: InboxIcon, contador: true },
  { href: "/admin/projetos", label: "Projetos", icon: FolderKanbanIcon },
  { href: "/admin/clientes", label: "Clientes", icon: UsersIcon },
  { href: "/admin/midia", label: "Mídia", icon: ImagesIcon },
  // Configurações vivem no documento da landing; a rota só abre o painel certo.
  { href: "/admin/configuracoes", label: "Configurações", icon: SettingsIcon },
] as const;

type User = { name: string; email: string };

function NavList({
  leadsNovos,
  onNavigate,
}: {
  leadsNovos: number;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <ul className="flex flex-col gap-1">
      {items.map((item) => {
        const base = "match" in item ? item.match : item.href;
        const active =
          "exact" in item ? pathname === item.href : pathname.startsWith(base);
        const Icon = item.icon;

        return (
          <li key={item.href}>
            <Link
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex h-11 items-center gap-3 rounded-md px-3 font-medium text-brand-mist transition-colors hover:bg-white/8 hover:text-brand-white",
                active &&
                  "bg-white/10 text-brand-white shadow-[inset_2px_0_0_var(--color-brand-cyan)]",
              )}
              href={item.href}
              onClick={onNavigate}
            >
              <Icon aria-hidden="true" className="size-4.5" />
              {item.label}
              {"contador" in item && leadsNovos > 0 ? (
                <span className="ml-auto rounded-full bg-brand-cyan px-2 py-0.5 text-xs font-semibold text-brand-black tabular-nums">
                  {leadsNovos}
                  <span className="sr-only">
                    {leadsNovos === 1 ? " lead novo" : " leads novos"}
                  </span>
                </span>
              ) : null}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function AccountBlock({ user }: { user: User }) {
  return (
    <div className="flex flex-col gap-3 border-t border-white/10 pt-5">
      <div className="min-w-0">
        <p className="truncate font-semibold text-brand-white">{user.name}</p>
        <p className="truncate text-sm text-brand-mist">{user.email}</p>
      </div>
      <div className="flex flex-col gap-1">
        <a
          className="flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-brand-mist transition-colors hover:bg-white/8 hover:text-brand-white"
          href="/"
          rel="noreferrer"
          target="_blank"
        >
          <ExternalLinkIcon aria-hidden="true" className="size-4" />
          Ver site
          <span className="sr-only">(abre em nova aba)</span>
        </a>
        <form action={logout}>
          <button
            className="flex h-10 w-full items-center gap-3 rounded-md px-3 text-sm font-medium text-brand-mist transition-colors hover:bg-white/8 hover:text-brand-white"
            type="submit"
          >
            <LogOutIcon aria-hidden="true" className="size-4" />
            Sair
          </button>
        </form>
      </div>
    </div>
  );
}

export function AdminSidebar({
  user,
  leadsNovos,
}: {
  user: User;
  leadsNovos: number;
}) {
  return (
    <aside
      className="sticky top-0 hidden h-svh w-64 shrink-0 flex-col gap-10 bg-brand-black px-4 py-6 lg:flex"
      data-surface="dark"
    >
      <Link className="inline-flex px-3" href="/admin">
        <Image
          alt="Miniverso — painel"
          className="h-7 w-auto"
          priority
          src={logoWhite}
        />
      </Link>
      <nav aria-label="Administração" className="flex-1">
        <NavList leadsNovos={leadsNovos} />
      </nav>
      <AccountBlock user={user} />
    </aside>
  );
}

export function AdminTopbar({
  user,
  leadsNovos,
}: {
  user: User;
  leadsNovos: number;
}) {
  const [isOpen, setOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-30 flex h-16 items-center justify-between bg-brand-black px-4 lg:hidden"
      data-surface="dark"
    >
      <Link className="inline-flex p-1" href="/admin">
        <Image
          alt="Miniverso — painel"
          className="h-6 w-auto"
          priority
          src={logoWhite}
        />
      </Link>
      <SheetTrigger isOpen={isOpen} onOpenChange={setOpen}>
        <Button
          aria-label="Abrir navegação"
          className="text-brand-white hover:bg-white/10 hover:text-brand-white"
          size="icon-lg"
          variant="ghost"
        >
          <MenuIcon />
        </Button>
        <SheetContent
          className="max-w-[min(18rem,100%)] bg-brand-black p-4 pt-5 text-brand-white sm:max-w-[18rem] [&_[data-slot=sheet-close]]:bg-white/10 [&_[data-slot=sheet-close]]:text-brand-white"
          data-surface="dark"
          side="left"
        >
          <SheetTitle className="flex h-9 items-center px-3 text-label font-semibold uppercase text-brand-mist">
            Navegação
          </SheetTitle>
          <nav aria-label="Administração" className="flex-1">
            <NavList
              leadsNovos={leadsNovos}
              onNavigate={() => setOpen(false)}
            />
          </nav>
          <AccountBlock user={user} />
        </SheetContent>
      </SheetTrigger>
    </header>
  );
}
