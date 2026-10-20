import { DownloadIcon } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { LinkButton } from "@/components/ui/button";
import type { StatusLead } from "../schema";

export function CabecalhoLeads({
  hrefExportacao,
  porStatus,
  totalGeral,
}: {
  hrefExportacao: string;
  porStatus: Record<StatusLead, number>;
  totalGeral: number;
}) {
  return (
    <PageHeader
      actions={
        <LinkButton href={hrefExportacao} variant="outline">
          <DownloadIcon data-icon="inline-start" />
          Exportar CSV
        </LinkButton>
      }
      description="Contatos enviados pelo formulário da landing. Abra um lead para ver a mensagem, registrar o andamento e responder."
      meta={
        <>
          <span>{totalGeral} no total</span>
          <span aria-hidden="true">·</span>
          <span>
            {porStatus.novo} {porStatus.novo === 1 ? "novo" : "novos"}
          </span>
        </>
      }
      title="Leads"
    />
  );
}
