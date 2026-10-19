import {
  ArrowRightIcon,
  FolderKanbanIcon,
  ImageIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

import { superficie } from "../_componentes/painel";

import type { Resultado, ResumoDeConteudo } from "./dados";
import { formatarInteiro } from "./formatar";
import { AvisoBloco } from "./secao";

export function ResumoConteudo({
  conteudo,
}: {
  conteudo: Resultado<ResumoDeConteudo>;
}) {
  if (!conteudo.ok) {
    return (
      <AvisoBloco texto="Não foi possível carregar o resumo do conteúdo." />
    );
  }

  const { clientes, projetos, midias } = conteudo.dados;

  const cartoes = [
    {
      id: "clientes",
      titulo: "Clientes",
      icone: UsersIcon,
      principal: `${formatarInteiro(clientes.publicados)} de ${formatarInteiro(clientes.total)}`,
      detalhe: "publicados na landing",
      href: "/admin/clientes",
      rotulo: "Gerenciar clientes",
    },
    {
      id: "projetos",
      titulo: "Projetos",
      icone: FolderKanbanIcon,
      principal: `${formatarInteiro(projetos.publicados)} de ${formatarInteiro(projetos.total)}`,
      detalhe: "publicados",
      href: "/admin/projetos",
      rotulo: "Gerenciar projetos",
    },
    {
      id: "midias",
      titulo: "Biblioteca de mídia",
      icone: ImageIcon,
      principal: formatarInteiro(midias),
      detalhe: midias === 1 ? "item cadastrado" : "itens cadastrados",
      href: "/admin/midia",
      rotulo: "Abrir biblioteca",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {cartoes.map((cartao) => {
        const Icone = cartao.icone;
        return (
          <div className={cn(superficie, "flex flex-col p-5")} key={cartao.id}>
            <h3 className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <span
                aria-hidden="true"
                className="grid size-8 shrink-0 place-items-center rounded-lg bg-accent text-primary"
              >
                <Icone className="size-4" />
              </span>
              {cartao.titulo}
            </h3>
            <p className="mt-4 font-display text-4xl font-bold leading-none text-heading tabular-nums">
              {cartao.principal}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {cartao.detalhe}
            </p>
            <Link
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "mt-4 -ml-3 self-start",
              )}
              href={cartao.href}
            >
              {cartao.rotulo}
              <ArrowRightIcon />
            </Link>
          </div>
        );
      })}
    </div>
  );
}
