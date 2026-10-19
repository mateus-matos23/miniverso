"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { restaurarVersao } from "@/app/admin/pagina/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

import { formatarDataHora } from "../formatar-data";

export type VersaoHistorico = {
  id: string;
  nota: string | null;
  publicadoEm: string;
  publicada: boolean;
};

function LinhaVersao({ versao }: { versao: VersaoHistorico }) {
  const router = useRouter();
  const [pendente, iniciarTransicao] = useTransition();

  function restaurar() {
    iniciarTransicao(async () => {
      const resultado = await restaurarVersao(versao.id);

      if (!resultado.ok) {
        toast.error(resultado.erro);
        return;
      }

      toast.success("Versão restaurada no rascunho.");
      router.push("/admin/pagina");
    });
  }

  return (
    <tr className="border-t border-border">
      <td className="px-4 py-3 align-top text-sm whitespace-nowrap">
        {formatarDataHora(versao.publicadoEm)}
      </td>
      <td className="px-4 py-3 align-top text-sm">
        {versao.nota ?? <span className="text-muted-foreground">Sem nota</span>}
      </td>
      <td className="px-4 py-3 align-top">
        {versao.publicada ? (
          <Badge variant="default">Publicada</Badge>
        ) : (
          <Badge variant="outline">Arquivada</Badge>
        )}
      </td>
      <td className="px-4 py-3 text-right align-top">
        <Button
          variant="outline"
          size="sm"
          isDisabled={pendente}
          onPress={restaurar}
        >
          {pendente ? <Spinner data-icon="inline-start" /> : null}
          {pendente ? "Restaurando…" : "Restaurar no rascunho"}
        </Button>
      </td>
    </tr>
  );
}

export function HistoricoLista({ versoes }: { versoes: VersaoHistorico[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-card">
      <table className="w-full min-w-[40rem] border-collapse text-left">
        <caption className="sr-only">
          Versões publicadas da página inicial
        </caption>
        <thead className="bg-muted/50 text-sm text-muted-foreground">
          <tr>
            <th scope="col" className="px-4 py-3 font-medium">
              Publicada em
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Nota
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Situação
            </th>
            <th scope="col" className="px-4 py-3 text-right font-medium">
              <span className="sr-only">Ações</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {versoes.map((versao) => (
            <LinhaVersao key={versao.id} versao={versao} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
