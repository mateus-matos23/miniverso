/** Rótulos legíveis para os valores gravados no banco. Valores desconhecidos aparecem crus. */

import { INTERESSES, ROTULOS_INTERESSE } from "@/features/leads/schema";

export const rotulosAlvoCta: Record<string, string> = {
  "hero-primario": "Hero · botão principal",
  "hero-secundario": "Hero · botão secundário",
  "projetos-vazio": "Projetos · estado vazio",
  "aviso-topo": "Faixa de aviso",
  "contato-enviar": "Formulário de contato",
};

export const rotulosOrigem: Record<string, string> = {
  direto: "Acesso direto",
};

export const rotulosDispositivo: Record<string, string> = {
  mobile: "Celular",
  tablet: "Tablet",
  desktop: "Desktop",
};

export const rotulosInteresse: Record<string, string> = Object.fromEntries(
  INTERESSES.map((valor) => [valor, ROTULOS_INTERESSE[valor].curto]),
);
