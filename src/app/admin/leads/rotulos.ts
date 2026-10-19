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

// Datas do painel sempre no fuso de Fortaleza, em servidor e cliente.
const fusoHorario = "America/Fortaleza";

const formatadorAbsoluto = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: fusoHorario,
});

const formatadorCurto = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  timeZone: fusoHorario,
});

export function formatarDataAbsoluta(iso: string) {
  return formatadorAbsoluto.format(new Date(iso));
}

export function formatarDataRelativa(iso: string, agora = Date.now()) {
  const minutos = Math.floor((agora - new Date(iso).getTime()) / 60_000);

  if (minutos < 1) return "agora";
  if (minutos < 60) return `há ${minutos} min`;

  const horas = Math.floor(minutos / 60);
  if (horas < 24) return `há ${horas} h`;

  const dias = Math.floor(horas / 24);
  if (dias < 7) return `há ${dias} d`;

  return formatadorCurto.format(new Date(iso));
}
