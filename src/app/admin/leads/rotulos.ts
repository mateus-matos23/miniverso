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

export const rotulosInteresseLead: Record<string, string> = {
  implantacao: "Implantar na escola",
  projeto_personalizado: "Projeto personalizado",
  parceria: "Parceria",
  outro: "Outro",
};

// Temporário: detalhe-lead.tsx ainda importa daqui. Trocar para formatarDataHora.
