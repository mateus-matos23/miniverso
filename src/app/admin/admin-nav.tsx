"use client";

import {
  ChevronsUpDownIcon,
  ExternalLinkIcon,
  FolderKanbanIcon,
  ImagesIcon,
  InboxIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  PanelsTopLeftIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { startTransition } from "react";
import { logout } from "@/app/actions/auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import isotipo from "../../../public/brand/isotipo.webp";
import logoWhite from "../../../public/brand/logo-horizontal-white.webp";
import { AdminBreadcrumb } from "./admin-breadcrumb";

type Item = {
  href: string;
  label: string;
  icon: typeof LayoutDashboardIcon;
  exact?: boolean;
  contador?: boolean;
};

const grupos: { titulo: string; itens: Item[] }[] = [
  {
    titulo: "Geral",
    itens: [
      {
        href: "/admin",
        label: "Visão geral",
        icon: LayoutDashboardIcon,
        exact: true,
      },
    ],
  },
  {
    titulo: "Conteúdo",
    itens: [
      {
        href: "/admin/pagina",
        label: "Página inicial",
        icon: PanelsTopLeftIcon,
      },
      { href: "/admin/projetos", label: "Projetos", icon: FolderKanbanIcon },
      { href: "/admin/clientes", label: "Clientes", icon: UsersIcon },
      { href: "/admin/midia", label: "Mídia", icon: ImagesIcon },
    ],
  },
  {
    titulo: "Contatos",
    itens: [
      {
        href: "/admin/leads",
        label: "Leads",
        icon: InboxIcon,
        contador: true,
      },
    ],
  },
];

const itemConfiguracoes: Item = {
  href: "/admin/configuracoes",
  label: "Configurações",
  icon: SettingsIcon,
};

type User = { name: string; email: string };

function estaAtivo(pathname: string, item: Item) {
  return item.exact ? pathname === item.href : pathname.startsWith(item.href);
}

function iniciais(nome: string) {
  const partes = nome.trim().split(/\s+/).filter(Boolean);
  const primeira = partes[0]?.[0] ?? "";
  const ultima =
    partes.length > 1 ? (partes[partes.length - 1]?.[0] ?? "") : "";
  return (primeira + ultima).toUpperCase() || "A";
}

function NavItem({
  item,
  leadsNovos,
  pathname,
}: {
  item: Item;
  leadsNovos: number;
  pathname: string;
}) {
  const { setOpenMobile } = useSidebar();
  const ativo = estaAtivo(pathname, item);
  const Icon = item.icon;
  const mostrarContador = item.contador === true && leadsNovos > 0;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        aria-current={ativo ? "page" : undefined}
        className={cn(
          "h-9 focus-visible:ring-sidebar-ring",
          ativo && "shadow-[inset_2px_0_0_var(--color-brand-cyan)]",
        )}
        href={item.href}
        isActive={ativo}
        onPress={() => setOpenMobile(false)}
        tooltip={item.label}
      >
        <Icon aria-hidden="true" className="size-4" />
        <span>{item.label}</span>
      </SidebarMenuButton>
      {mostrarContador ? (
        <SidebarMenuBadge className="rounded-full bg-sidebar-primary px-1.5 font-semibold text-sidebar-primary-foreground">
          {leadsNovos}
          <span className="sr-only">
            {leadsNovos === 1 ? " lead novo" : " leads novos"}
          </span>
        </SidebarMenuBadge>
      ) : null}
    </SidebarMenuItem>
  );
}

function AccountMenu({ user }: { user: User }) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenuTrigger>
          <SidebarMenuButton size="lg" aria-label={`Conta de ${user.name}`}>
            <Avatar className="size-8 shrink-0">
              <AvatarFallback className="bg-white/10 text-xs font-semibold text-brand-white">
                {iniciais(user.name)}
              </AvatarFallback>
            </Avatar>
            <span className="grid min-w-0 flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
              <span className="truncate font-medium text-brand-white">
                {user.name}
              </span>
              <span className="truncate text-xs">{user.email}</span>
            </span>
            <ChevronsUpDownIcon
              aria-hidden="true"
              className="ml-auto group-data-[collapsible=icon]:hidden"
            />
          </SidebarMenuButton>
          <DropdownMenu
            aria-label="Opções da conta"
            className="w-56"
            placement="end bottom"
          >
            <DropdownMenuItem
              href="/"
              rel="noreferrer"
              target="_blank"
              textValue="Ver site"
            >
              <ExternalLinkIcon aria-hidden="true" />
              Ver site
              <span className="sr-only">(abre em nova aba)</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onAction={() => {
                startTransition(async () => {
                  await logout();
                });
              }}
              textValue="Sair"
            >
              <LogOutIcon aria-hidden="true" />
              Sair
            </DropdownMenuItem>
          </DropdownMenu>
        </DropdownMenuTrigger>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export function AdminSidebar({
  user,
  leadsNovos,
}: {
  user: User;
  leadsNovos: number;
}) {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  return (
    <Sidebar collapsible="icon" data-surface="dark" variant="inset">
      <SidebarHeader className="pt-4 md:pt-2">
        <Link
          className="flex h-9 items-center px-2 group-data-[collapsible=icon]:justify-center rounded-xl outline-hidden focus-visible:ring-3 focus-visible:ring-sidebar-ring"
          href="/admin"
          onClick={() => setOpenMobile(false)}
        >
          <Image
            alt="Miniverso — painel"
            className="h-7 w-auto group-data-[collapsible=icon]:hidden"
            preload
            src={logoWhite}
          />
          <Image
            alt="Miniverso — painel"
            className="hidden size-6 group-data-[collapsible=icon]:block"
            src={isotipo}
          />
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <nav aria-label="Administração" className="flex flex-col gap-2">
          {grupos.map((grupo) => (
            <SidebarGroup key={grupo.titulo}>
              <SidebarGroupLabel className="text-label font-semibold uppercase text-sidebar-foreground">
                {grupo.titulo}
              </SidebarGroupLabel>
              <SidebarMenu>
                {grupo.itens.map((item) => (
                  <NavItem
                    key={item.href}
                    item={item}
                    leadsNovos={leadsNovos}
                    pathname={pathname}
                  />
                ))}
              </SidebarMenu>
            </SidebarGroup>
          ))}
        </nav>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <NavItem
            item={itemConfiguracoes}
            leadsNovos={leadsNovos}
            pathname={pathname}
          />
        </SidebarMenu>
        <AccountMenu user={user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

export function AdminTopbar() {
  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-2 border-b border-border/80 bg-admin-canvas/85 px-4 backdrop-blur md:rounded-t-xl lg:px-6">
      <SidebarTrigger className="-ml-1" />
      <Separator
        className="mx-1 aria-[orientation=vertical]:h-4 aria-[orientation=vertical]:self-center"
        orientation="vertical"
      />
      <AdminBreadcrumb />
    </header>
  );
}
