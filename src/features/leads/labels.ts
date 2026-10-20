import { INTERESSES, ROTULOS_INTERESSE, type StatusLead } from "./schema";

export const rotulosStatusLead: Record<StatusLead, string> = {
  novo: "Novo",
  em_contato: "Em contato",
  convertido: "Convertido",
  arquivado: "Arquivado",
};

export const rotulosInteresseLead: Record<string, string> = Object.fromEntries(
  INTERESSES.map((valor) => [valor, ROTULOS_INTERESSE[valor].longo]),
);
