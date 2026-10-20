"use client";

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

const secoes = [
  { href: "/admin/pagina", label: "Página inicial" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/projetos", label: "Projetos" },
  { href: "/admin/clientes", label: "Clientes" },
  { href: "/admin/midia", label: "Mídia" },
  { href: "/admin/configuracoes", label: "Configurações" },
];

function resolverTrilha(pathname: string) {
  if (pathname === "/admin") {
    return { secao: { href: "/admin", label: "Visão geral" }, sub: undefined };
  }

  const secao = secoes.find(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
  );

  let sub: string | undefined;
  if (pathname === "/admin/projetos/novo") {
    sub = "Novo projeto";
  } else if (/^\/admin\/projetos\/[^/]+$/.test(pathname)) {
    sub = "Editar projeto";
  } else if (pathname === "/admin/pagina/historico") {
    sub = "Histórico";
  }

  return { secao, sub };
}

export function AdminBreadcrumb() {
  const pathname = usePathname();
  const { secao, sub } = resolverTrilha(pathname);

  // Painel > seção > subpágina. Último item é a página atual.
  const itens: { id: string; label: string; href?: string }[] = [
    { id: "painel", label: "Painel", href: "/admin" },
  ];

  if (secao) {
    // Com subpágina, a seção vira link; sem ela, é a página atual.
    itens.push(
      sub
        ? { id: secao.href, label: secao.label, href: secao.href }
        : { id: secao.href, label: secao.label },
    );
  }

  if (sub) {
    itens.push({ id: "sub", label: sub });
  }

  return (
    <Breadcrumb>
      <BreadcrumbList aria-label="Localização atual">
        {itens.map((item, index) => {
          const atual = index === itens.length - 1;
          return (
            <BreadcrumbItem
              className={cn(!atual && "hidden md:inline-flex")}
              id={item.id}
              key={item.id}
            >
              {atual || !item.href ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
              )}
            </BreadcrumbItem>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
