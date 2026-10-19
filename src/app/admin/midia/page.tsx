import type { Metadata } from "next";

import { listarMidias } from "@/app/admin/midia/actions";
import { AdminPage, PageHeader } from "@/app/admin/page-header";

import { BibliotecaMidias } from "./biblioteca-midias";
import { EnviarMidia } from "./enviar-midia";

export const metadata: Metadata = { title: "Mídia" };

export default async function MidiaPage() {
  const midias = await listarMidias();

  return (
    <AdminPage>
      <PageHeader
        title="Mídia"
        description="Biblioteca de imagens e vídeos usados na página inicial e nos projetos. Todo item precisa de texto alternativo."
      />

      <section
        aria-labelledby="enviar-midia-titulo"
        className="mt-10 rounded-lg border border-border bg-card p-5 sm:p-6"
      >
        <h2
          id="enviar-midia-titulo"
          className="mb-4 text-lg font-semibold text-brand-black"
        >
          Enviar arquivo
        </h2>
        <EnviarMidia />
      </section>

      <section aria-labelledby="biblioteca-titulo" className="mt-12">
        <h2
          id="biblioteca-titulo"
          className="mb-6 text-lg font-semibold text-brand-black"
        >
          Biblioteca
        </h2>
        <BibliotecaMidias midias={midias} />
      </section>
    </AdminPage>
  );
}
