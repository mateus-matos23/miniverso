"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { restaurarVersao } from "@/app/admin/pagina/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatarDataHora } from "@/lib/formatar";

export type VersaoHistorico = {
  id: string;
  nota: string | null;
  publicadoEm: string;
  publicada: boolean;
};

function SituacaoVersao({ publicada }: { publicada: boolean }) {
  return publicada ? (
    <Badge variant="default">Publicada</Badge>
  ) : (
    <Badge variant="outline">Arquivada</Badge>
  );
}

function NotaVersao({ nota }: { nota: string | null }) {
  return nota ?? <span className="text-muted-foreground">Sem nota</span>;
}

function RestaurarVersaoBotao({
  versao,
  className,
}: {
  versao: VersaoHistorico;
  className?: string;
}) {
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
    <Button
      className={className}
      variant="outline"
      size="sm"
      isDisabled={pendente}
      onPress={restaurar}
    >
      {pendente ? <Spinner data-icon="inline-start" /> : null}
      {pendente ? "Restaurando…" : "Restaurar no rascunho"}
    </Button>
  );
}

export function HistoricoLista({ versoes }: { versoes: VersaoHistorico[] }) {
  return (
    <>
      <ul
        aria-label="Versões publicadas da página inicial"
        className="flex flex-col gap-3 lg:hidden"
      >
        {versoes.map((versao) => (
          <li
            className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4"
            key={versao.id}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-semibold text-heading">
                {formatarDataHora(versao.publicadoEm)}
              </span>
              <SituacaoVersao publicada={versao.publicada} />
            </div>
            <p className="break-words text-sm">
              <NotaVersao nota={versao.nota} />
            </p>
            <RestaurarVersaoBotao className="w-full" versao={versao} />
          </li>
        ))}
      </ul>

      <div className="hidden overflow-hidden rounded-lg border border-border bg-card lg:block">
        <Table
          aria-label="Versões publicadas da página inicial"
          className="text-left"
        >
          <TableHeader className="border-b border-border bg-muted/50 text-sm text-muted-foreground">
            <TableHead className="px-4 py-3 font-medium" id="publicada">
              Publicada em
            </TableHead>
            <TableHead className="px-4 py-3 font-medium" id="nota">
              Nota
            </TableHead>
            <TableHead className="px-4 py-3 font-medium" id="situacao">
              Situação
            </TableHead>
            <TableHead className="px-4 py-3 text-right font-medium" id="acoes">
              <span className="sr-only">Ações</span>
            </TableHead>
          </TableHeader>
          <TableBody items={versoes}>
            {(versao) => (
              <TableRow
                id={versao.id}
                textValue={formatarDataHora(versao.publicadoEm)}
              >
                <TableCell className="px-4 py-3 align-top text-sm">
                  {formatarDataHora(versao.publicadoEm)}
                </TableCell>
                <TableCell className="px-4 py-3 align-top text-sm whitespace-normal">
                  <NotaVersao nota={versao.nota} />
                </TableCell>
                <TableCell className="px-4 py-3 align-top">
                  <SituacaoVersao publicada={versao.publicada} />
                </TableCell>
                <TableCell className="px-4 py-3 text-right align-top">
                  <RestaurarVersaoBotao versao={versao} />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
