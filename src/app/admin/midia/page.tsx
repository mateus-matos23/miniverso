import type { Metadata } from "next";

import { Painel } from "@/app/admin/_componentes/painel";
import { listarMidias } from "@/app/admin/midia/actions";
import { AdminPage, PageHeader } from "@/app/admin/page-header";

import { BibliotecaMidias } from "./biblioteca-midias";
import { EnviarMidia } from "./enviar-midia";

export const metadata: Metadata = { title: "Mídia" };

export default async function MidiaPage() {
  const { itens: midias, proximoCursor } = await listarMidias();

  const contagem = `${midias.length}${proximoCursor ? "+" : ""} ${midias.length === 1 && !proximoCursor ? "item" : "itens"}`;

  return (
    <AdminPage>
      <PageHeader
        title="Mídia"
        description="Biblioteca de imagens e vídeos usados na página inicial e nos projetos. Todo item precisa de texto alternativo."
      />

      <Painel aria-label="Enviar mídia" className="mt-6" titulo="Enviar mídia">
        <EnviarMidia />
      </Painel>

      <Painel
        aria-label="Biblioteca"
        className="mt-6"
        descricao={contagem}
        titulo="Biblioteca"
      >
        <BibliotecaMidias midias={midias} proximoCursor={proximoCursor} />
      </Painel>
    </AdminPage>
  );
}
