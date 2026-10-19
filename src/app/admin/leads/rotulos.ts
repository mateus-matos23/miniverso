import { INTERESSES, ROTULOS_INTERESSE } from "@/lib/leads";

export const STATUS_LEAD = [
  "novo",
  "em_contato",
  "convertido",
  "arquivado",
] as const;

export type StatusLead = (typeof STATUS_LEAD)[number];

export const rotulosStatusLead: Record<StatusLead, string> = {
  novo: "Novo",
  em_contato: "Em contato",
  convertido: "Convertido",
  arquivado: "Arquivado",
};

export const rotulosInteresseLead: Record<string, string> = Object.fromEntries(
  INTERESSES.map((valor) => [valor, ROTULOS_INTERESSE[valor].longo]),
);

// Temporário: detalhe-lead.tsx ainda importa daqui. Trocar para formatarDataHora.
