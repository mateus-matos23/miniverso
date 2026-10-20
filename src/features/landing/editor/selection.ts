import type { TipoSecao } from "@/features/landing/schema";

/** Grupos de "Configurações gerais", cada um é um subgrupo de `config` do documento. */
export const gruposConfig = {
  contato: { nome: "Contato" },
  seo: { nome: "SEO e compartilhamento" },
  cabecalho: { nome: "Cabeçalho" },
  rodape: { nome: "Rodapé" },
  aviso: { nome: "Aviso" },
} as const;

export type GrupoConfig = keyof typeof gruposConfig;

/** Item selecionado no editor: uma seção do documento ou um grupo de configurações. */
export type Selecao =
  | { tipo: "secao"; secao: TipoSecao }
  | { tipo: "config"; grupo: GrupoConfig };

/** Aceita o valor de `?painel=` e devolve o grupo, ou `undefined` se não for um grupo válido. */
export function grupoConfigDe(
  valor: string | undefined,
): GrupoConfig | undefined {
  return (Object.keys(gruposConfig) as GrupoConfig[]).find(
    (grupo) => grupo === valor,
  );
}
