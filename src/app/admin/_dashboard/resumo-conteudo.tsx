import { FolderKanbanIcon, ImageIcon, UsersIcon } from "lucide-react";
import Link from "next/link";

import { Card } from "@/components/ui/card";

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
          <Card className="flex flex-col p-5" key={cartao.id}>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-brand-black">
              <Icone aria-hidden="true" className="size-4 text-brand-blue" />
              {cartao.titulo}
            </h3>
            <p className="mt-4 font-display text-4xl font-bold leading-none text-brand-violet">
              {cartao.principal}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {cartao.detalhe}
            </p>
            <Link
              className="mt-4 inline-flex w-fit items-center rounded-md px-2 py-1 text-sm font-semibold text-brand-blue hover:bg-accent"
              href={cartao.href}
            >
              {cartao.rotulo}
            </Link>
          </Card>
        );
      })}
    </div>
  );
}
